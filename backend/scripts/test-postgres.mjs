import { mkdirSync, existsSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const root = fileURLToPath(new URL('../../', import.meta.url));
const cache = resolve(root, 'backend/.cache/postgres-test');
const bin = process.env.POSTGRES_BIN || 'C:/Program Files/PostgreSQL/18/bin';
const executable = name => join(bin, name + (process.platform === 'win32' ? '.exe' : ''));
const run = (name, args) => execFileSync(executable(name), args, { windowsHide: true, stdio: 'ignore', timeout: 30000 });
const configFile = join(cache, 'credentials.json'), data = join(cache, 'data');
mkdirSync(cache, { recursive: true });
if (process.argv[2] === 'stop') {
  if (existsSync(join(data, 'postmaster.pid'))) run('pg_ctl', ['-D', data, '-m', 'fast', '-w', 'stop']);
  console.log('Isolated test PostgreSQL stopped.');
  process.exit(0);
}
if (!existsSync(configFile)) {
  const password = randomBytes(24).toString('hex');
  writeFileSync(configFile, JSON.stringify({ password, adminPassword: randomBytes(24).toString('base64url') }), { mode: 0o600, flag: 'wx' });
}
const credentials = JSON.parse(readFileSync(configFile, 'utf8'));
if (!existsSync(join(data, 'PG_VERSION'))) {
  const passwordFile = join(cache, 'init-password');
  writeFileSync(passwordFile, credentials.password, { mode: 0o600 });
  try { run('initdb', ['-D', data, '-U', 'asset_test', '--pwfile', passwordFile, '--auth=scram-sha-256', '--encoding=UTF8', '--locale=C']); }
  finally { rmSync(passwordFile, { force: true }); }
}
if (!existsSync(join(data, 'postmaster.pid'))) run('pg_ctl', ['-D', data, '-l', join(cache, 'postgres.log'), '-o', '-h 127.0.0.1 -p 55432', '-w', 'start']);
const databaseUrl = `postgresql://asset_test:${credentials.password}@127.0.0.1:55432/asset_manager_test`;
const client = new pg.Client({ connectionString: databaseUrl.replace('/asset_manager_test', '/postgres') });
await client.connect();
try {
  const found = await client.query('SELECT 1 FROM pg_database WHERE datname=$1', ['asset_manager_test']);
  if (!found.rowCount) await client.query('CREATE DATABASE asset_manager_test');
} finally { await client.end(); }
writeFileSync(join(cache, 'env.json'), JSON.stringify({ DATABASE_URL: databaseUrl, FRONTEND_ORIGIN: 'http://localhost:5174', SESSION_COOKIE_SECURE: 'false', ADMIN_EMAIL: 'admin@tests.invalid', ADMIN_PASSWORD: credentials.adminPassword, TEST_ADMIN_EMAIL: 'admin@tests.invalid', TEST_ADMIN_PASSWORD: credentials.adminPassword }), { mode: 0o600 });
console.log('Isolated test PostgreSQL ready on loopback:55432; credentials kept in ignored backend/.cache.');
