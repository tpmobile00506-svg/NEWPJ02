import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
const env = JSON.parse(readFileSync(new URL('../.cache/postgres-test/env.json', import.meta.url), 'utf8'));
const child = spawn(process.execPath, process.argv.slice(2), { env: { ...process.env, ...env }, stdio: 'inherit', windowsHide: true });
child.on('exit', code => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
