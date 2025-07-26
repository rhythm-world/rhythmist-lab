import type { ClientOptions, InferSessionFromClient, InferUserFromClient } from 'better-auth/client';
import type { RouteLocationRaw } from 'vue-router';
import { createAuthClient } from 'better-auth/client';

export function useAuth() {
  const url = useRequestURL();
  const headers = import.meta.server ? useRequestHeaders() : undefined;

  const client = createAuthClient({
    baseURL: url.origin,
    fetchOptions: { headers },
  });
  const session = useState<InferSessionFromClient<ClientOptions> | null>('auth:session', () => null);
  const user = useState<InferUserFromClient<ClientOptions> | null>('auth:user', () => null);
  const sessionFetching = import.meta.server ? ref(false) : useState('auth:sessionFetching', () => false);

  const fetchSession = async () => {
    if (sessionFetching.value)
      return;
    sessionFetching.value = true;
    const { data } = await client.getSession();
    session.value = data?.session || null;
    user.value = data?.user || null;
    sessionFetching.value = false;
    return data;
  };

  if (import.meta.client) {
    client.$store.listen('$sessionSignal', async (signal) => {
      if (!signal)
        return;
      await fetchSession();
    });
  }

  return {
    session,
    user,
    loggedIn: computed(() => !!session.value),
    signIn: client.signIn,
    signUp: client.signUp,
    async signOut({ redirectTo }: { redirectTo?: RouteLocationRaw } = {}) {
      const res = await client.signOut();
      session.value = null;
      user.value = null;
      if (redirectTo)
        await navigateTo(redirectTo);
      return res;
    },
    fetchSession,
    client,
  };
}
