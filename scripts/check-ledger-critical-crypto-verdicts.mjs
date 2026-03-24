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

// Guardrail: keep honest certification posture for crypto-critical rows
// unless explicit proof criteria and methodology updates are performed.
const expectedVerdicts = new Map([
  [12, 'RED'],
  [13, 'RED'],
  [14, 'RED'],
  [15, 'RED'],
  [17, 'AMBER'],
]);

const failures = [];

for (const [id, expected] of expectedVerdicts.entries()) {
  const row = rows.find((r) => r.id === id);
  if (!row) {
    failures.push(`Missing ledger row ${id}`);
    continue;
  }
  if (row.verdict !== expected) {
    failures.push(`Row ${id} verdict expected ${expected} but found ${row.verdict}`);
  }
}

if (failures.length > 0) {
  console.error('Critical crypto verdict policy check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Critical crypto verdict policy check passed (12-15 RED, 17 AMBER).');
