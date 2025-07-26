import { neon } from '@netlify/neon';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const sql = neon();
export const db = drizzle({ client: sql as any });
// eslint-disable-next-line antfu/no-top-level-await
await migrate(db, { migrationsFolder: './drizzle' });

export * from './auth-schema';
export * from './schema';
