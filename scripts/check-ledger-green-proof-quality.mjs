import fs from 'node:fs';
import path from 'node:path';

const ledgerPath = path.resolve(
  process.cwd(),
  'docs',
  'certification-20260323',
  'feature-baseline-ledger-1-233.json'
);

const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
const rows = ledger.rows || [];

const ORG_WIDE_BASELINE = new Set([
  'node:scripts/run-certification-policy-audit.mjs',
  'npm:check:route-feature-keys',
  'npm:build',
  'flutter:test/navigation/batch1_route_allowlist_policy_test.dart',
  'flutter:test/navigation/feature_parity_navigation_test.dart',
  'flutter:test/app_urls_parity_test.dart',
]);

function tokenizeEvidence(evidence) {
  return String(evidence || '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

const failures = [];

for (const row of rows) {
  if (row.verdict !== 'GREEN') continue;

  const tokens = tokenizeEvidence(row.regressionEvidence);
  const featureSpecific = tokens.filter((t) => !ORG_WIDE_BASELINE.has(t));

  if (featureSpecific.length === 0) {
    failures.push(
      `Row ${row.id} (${row.title}) is GREEN but has only org-wide baseline evidence`
    );
    continue;
  }

  const hasExecutableFeatureProof = featureSpecific.some(
    (t) =>
      t.startsWith('cypress:e2e/') ||
      t.startsWith('flutter:test/') ||
      t.startsWith('node:scripts/') ||
      t.startsWith('web:src/')
  );

  if (!hasExecutableFeatureProof) {
    failures.push(
      `Row ${row.id} (${row.title}) is GREEN without executable feature-specific proof`
    );
  }
}

if (failures.length > 0) {
  console.error('GREEN proof quality check failed:');
  for (const f of failures) {
    console.error(`- ${f}`);
  }
  process.exit(1);
}

console.log('GREEN proof quality check passed.');
