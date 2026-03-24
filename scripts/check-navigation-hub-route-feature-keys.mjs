/**
 * Verifies navigation hub route coverage in ROUTE_FEATURE_KEYS.
 *
 * Mode:
 * - Compares current missing set against a baseline JSON file.
 * - Fails only when new uncovered paths are introduced.
 * - Optional: --update-baseline to refresh the baseline.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { ROUTE_FEATURE_KEYS } from '../src/config/routeFeatureKeys.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const NAV_FILE = join(repoRoot, 'src/constants/navigationHubRoutes.js');
const BASELINE_FILE = join(__dirname, 'route-feature-keys-baseline.json');

const EXCLUDED_PATHS = new Set([
  '/',
  '/auth/callback',
  '/authentication-portal',
  '/role-upgrade',
  '/friend-requests',
  '/groups',
  '/home-feed-dashboard',
  '/content-removed-appeal',
  '/liveQuestionInjectionControlCenter',
]);

function extractQuotedPaths(source) {
  const paths = new Set();
  const re = /'(\/[^']*)'/g;
  let m;
  while ((m = re.exec(source))) paths.add(m[1]);
  return paths;
}

function computeMissing() {
  const navSource = readFileSync(NAV_FILE, 'utf8');
  const navPaths = extractQuotedPaths(navSource);
  const missing = [];

  for (const path of [...navPaths].sort()) {
    if (EXCLUDED_PATHS.has(path)) continue;
    const normalized = path.replace(/^\//, '').split('?')[0];
    if (!normalized) continue;
    if (!(normalized in ROUTE_FEATURE_KEYS)) missing.push(path);
  }

  return { missing, scanned: navPaths.size };
}

const update = process.argv.includes('--update-baseline');
const { missing, scanned } = computeMissing();

if (update || !existsSync(BASELINE_FILE)) {
  const baseline = {
    generatedAt: new Date().toISOString(),
    excludedPaths: [...EXCLUDED_PATHS].sort(),
    missingPaths: missing,
  };
  writeFileSync(BASELINE_FILE, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(
    `[check-navigation-hub-route-feature-keys] Baseline ${update ? 'updated' : 'created'}: ${missing.length} missing path(s).`,
  );
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'));
const baselineMissing = new Set(baseline.missingPaths ?? []);
const currentMissing = new Set(missing);

const newlyMissing = [...currentMissing].filter((p) => !baselineMissing.has(p)).sort();
const nowCovered = [...baselineMissing].filter((p) => !currentMissing.has(p)).sort();

if (newlyMissing.length > 0) {
  console.error(
    `[check-navigation-hub-route-feature-keys] New uncovered paths detected (${newlyMissing.length}).`,
  );
  for (const p of newlyMissing) console.error(`  + ${p}`);
  if (nowCovered.length > 0) {
    console.error('\nCovered since baseline (refresh baseline to lock in):');
    for (const p of nowCovered) console.error(`  - ${p}`);
  }
  process.exit(1);
}

console.log(
  `[check-navigation-hub-route-feature-keys] OK — scanned ${scanned} path(s). Current missing ${missing.length}, no regressions vs baseline.`,
);
if (nowCovered.length > 0) {
  console.log('[check-navigation-hub-route-feature-keys] Paths now covered (run with --update-baseline):');
  for (const p of nowCovered) console.log(`  - ${p}`);
}
