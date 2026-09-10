import { mkdir, writeFile } from 'node:fs/promises';
import { config } from 'dotenv';
import pg from 'pg';
config({ path: new URL('../../.env', import.meta.url), quiet: true });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const url = new URL(process.env.DATABASE_URL);
if (!['127.0.0.1', 'localhost'].includes(url.hostname)) url.searchParams.set('sslmode', 'verify-full');
const pool = new pg.Pool({ connectionString: url.href });
const client = await pool.connect();
try {
  await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
  const names = (await client.query('SELECT tablename FROM pg_tables WHERE schemaname=$1 ORDER BY tablename', ['public'])).rows.map(x => x.tablename);
  const tables = {};
  for (const name of names) tables[name] = (await client.query('SELECT * FROM "public"."' + name.replaceAll('"', '""') + '"')).rows;
  const directory = new URL('../.cache/backups/', import.meta.url);
  await mkdir(directory, { recursive: true });
  const file = new URL('before-newpj02-' + Date.now() + '.json', directory);
  await writeFile(file, JSON.stringify({ createdAt: new Date().toISOString(), tables }), { mode: 0o600, flag: 'wx' });
  await client.query('COMMIT');
  console.log('Database snapshot saved privately in backend/.cache/backups; tables:', names.length);
} catch (error) { await client.query('ROLLBACK'); throw error; }
finally { client.release(); await pool.end(); }
