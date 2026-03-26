/**
 * Removes ./node_modules reliably on Windows (long paths + locked binaries)
 * and on Unix (simple recursive rm).
 *
 * Windows: `Remove-Item -Recurse` often fails on deep trees (e.g. react-spring → react-native).
 * `npm ci` can fail with EPERM unlink on esbuild.exe when another Node process holds the file.
 *
 * Usage: node ./scripts/clean-node-modules.mjs
 * Tip: Stop Vite/Cypress/IDE terminals using this repo if you still see EPERM.
 */

import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const nodeModules = join(root, 'node_modules');

if (!existsSync(nodeModules)) {
  console.log('clean-node-modules: nothing to remove (node_modules missing).');
  process.exit(0);
}

if (process.platform === 'win32') {
  const emptyDir = mkdtempSync(join(tmpdir(), 'vottery-nm-clean-'));
  const robocopy = spawnSync(
    'robocopy',
    [
      emptyDir,
      nodeModules,
      '/MIR',
      '/R:0',
      '/W:0',
      '/NFL',
      '/NDL',
      '/NJH',
      '/NJS',
      '/NC',
      '/NS',
      '/NP',
      '/LOG:NUL',
    ],
    { stdio: 'ignore' },
  );
  rmSync(emptyDir, { recursive: true, force: true });
  // Robocopy: exit codes 0–7 indicate success ( bitmask ); 8+ is failure.
  const code = robocopy.status ?? 1;
  if (code >= 8) {
    console.error(`clean-node-modules: robocopy failed with exit code ${code}.`);
    process.exit(code);
  }
  try {
    rmSync(nodeModules, { recursive: true, force: true });
  } catch (err) {
    console.error('clean-node-modules: could not remove node_modules after robocopy:', err.message);
    console.error('Stop dev servers (npm run start / Cypress) and retry.');
    process.exit(1);
  }
} else {
  rmSync(nodeModules, { recursive: true, force: true });
}

console.log('clean-node-modules: removed node_modules.');
