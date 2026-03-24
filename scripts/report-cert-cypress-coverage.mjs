import fs from 'node:fs';
import path from 'node:path';

/**
 * Reads `feature-baseline-ledger-1-233.json` and prints how many rows cite each
 * `cypress:e2e/*.cy.js` string vs org-wide-only evidence.
 *
 * Usage (repo root): node scripts/report-cert-cypress-coverage.mjs
 */
const file = path.resolve(
  process.cwd(),
  'docs',
  'certification-20260323',
  'feature-baseline-ledger-1-233.json'
);

const ledger = JSON.parse(fs.readFileSync(file, 'utf8'));
const rows = ledger.rows || [];

const CYPRESS_PREFIX = 'cypress:e2e/';

function specsFromEvidence(evidence) {
  if (!evidence || typeof evidence !== 'string') return [];
  return evidence
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.startsWith(CYPRESS_PREFIX));
}

const specToRowCount = new Map();
let withCypress = 0;
let withoutCypress = 0;
const noCypressBySection = new Map();

for (const row of rows) {
  const specs = specsFromEvidence(row.regressionEvidence);
  if (specs.length === 0) {
    withoutCypress += 1;
    const sec = row.section || '(no section)';
    noCypressBySection.set(sec, (noCypressBySection.get(sec) || 0) + 1);
  } else {
    withCypress += 1;
    for (const spec of specs) {
      specToRowCount.set(spec, (specToRowCount.get(spec) || 0) + 1);
    }
  }
}

const sortedSpecs = [...specToRowCount.entries()].sort((a, b) =>
  a[0].localeCompare(b[0])
);

console.log('=== Certification ledger — Cypress evidence coverage ===\n');
console.log(`Total features: ${rows.length}`);
console.log(`Rows citing ≥1 Cypress spec: ${withCypress}`);
console.log(`Rows with org-wide / Flutter only (no Cypress): ${withoutCypress}\n`);

console.log('--- Rows per Cypress spec (ledger citations) ---');
for (const [spec, n] of sortedSpecs) {
  console.log(`${n}\t${spec}`);
}

console.log('\n--- No-Cypress rows by ledger section ---');
const sortedSections = [...noCypressBySection.entries()].sort((a, b) => b[1] - a[1]);
for (const [sec, n] of sortedSections) {
  console.log(`${n}\t${sec}`);
}
