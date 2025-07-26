import type { BetterAuthPlugin } from 'better-auth';
import type { H3Event } from 'h3';
import process from 'node:process';
import { App } from '@octokit/app';
import { RequestError } from '@octokit/request-error';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError } from 'better-call';
import { db } from './db';
import * as schema from './db/schema';

const github = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

let gh: ReturnType<typeof github.getInstallationOctokit> | undefined;
function restriction() {
  return ({
    id: 'restriction',
    init(ctx) {
      return {
        context: {
          internalAdapter: {
            ...ctx.internalAdapter,
            createOAuthUser: async (user, account, context) => {
              if (account.providerId !== 'github')
                throw new APIError('FORBIDDEN', { message: 'Only GitHub login is allowed' });
              if (!gh)
                gh = github.getInstallationOctokit(Number(process.env.GITHUB_INSTALLATION_ID));
              const octo = await gh;
              const { data } = await octo.request(`GET /user/${account.accountId}`);

              try {
                await octo.request('GET /orgs/{org}/members/{username}', {
                  org: 'rhythm-world',
                  username: data.login,
                });
              } catch (e) {
                if (e instanceof RequestError && e.status === 404)
                  throw new APIError('FORBIDDEN', { message: 'You are not invited to try Rhythmist AI' });
                throw e;
              }

              return ctx.internalAdapter.createOAuthUser(user, account, context);
            },
          },
        },
      };
    },
  }) satisfies BetterAuthPlugin;
}

export const auth = betterAuth({
  appName: 'Rhythm World',
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    restriction(),
  ],
});

export async function useAuth(ev: H3Event) {
  return auth.api.getSession({ headers: ev.headers });
}

export async function useAuthOrThrow(ev: H3Event) {
  const ret = await useAuth(ev);
  if (!ret)
    throw createError({ statusCode: 401 });
  return ret;
}
