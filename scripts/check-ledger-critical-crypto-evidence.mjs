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

const criticalIds = [12, 13, 14, 15, 17];
const requiredEvidence = [
  'node:scripts/check-cryptographic-primitives.mjs',
  'node:scripts/check-crypto-route-contract-parity.mjs',
  'node:scripts/check-vote-crypto-contract-parity.mjs',
  'cypress:e2e/crypto-compliance-parity.cy.js',
  'flutter:test/services/cryptographic_service_test.dart',
];

const failures = [];

for (const id of criticalIds) {
  const row = rows.find((r) => r.id === id);
  if (!row) {
    failures.push(`Missing ledger row ${id}`);
    continue;
  }

  const evidence = String(row.regressionEvidence || '');
  for (const token of requiredEvidence) {
    if (!evidence.includes(token)) {
      failures.push(`Row ${id} missing evidence: ${token}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Critical crypto ledger evidence check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Critical crypto ledger evidence check passed (rows 12-15,17).');
