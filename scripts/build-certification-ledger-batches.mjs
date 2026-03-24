import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'docs', 'certification-20260323');
const inPath = path.join(dir, 'feature-baseline-ledger-1-233.json');
const ledger = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const rows = ledger.rows || [];

const ranges = [
  { name: 'L1', start: 1, end: 69 },
  { name: 'L2', start: 70, end: 93 },
  { name: 'L3', start: 94, end: 154 },
  { name: 'L4', start: 155, end: 193 },
  { name: 'L5', start: 194, end: 233 },
];

for (const range of ranges) {
  const batchRows = rows.filter((r) => r.id >= range.start && r.id <= range.end);
  const summary = batchRows.reduce(
    (acc, r) => {
      acc[r.verdict] = (acc[r.verdict] || 0) + 1;
      return acc;
    },
    { GREEN: 0, AMBER: 0, RED: 0 }
  );

  const md = [
    `# Certification Ledger ${range.name} (${range.start}-${range.end})`,
    '',
    `- Generated: ${new Date().toISOString()}`,
    `- Rows: ${batchRows.length}`,
    `- GREEN: ${summary.GREEN} | AMBER: ${summary.AMBER} | RED: ${summary.RED}`,
    '',
    '| ID | Feature | Web | Mobile | DB | Baseline Verdict | Policy Compliance | Regression Evidence |',
    '|---|---|---|---|---|---|---|---|',
    ...batchRows.map(
      (r) =>
        `| ${r.id} | ${r.title} | ${r.webEvidence || '—'} | ${r.mobileEvidence || '—'} | ${r.dbEvidence || '—'} | ${r.verdict} | ${r.policyCompliance || 'PENDING'} | ${r.regressionEvidence || 'PENDING'} |`
    ),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dir, `ledger-${range.name}-${range.start}-${range.end}.md`), md);
}

console.log('Ledger batches generated:', ranges.map((r) => r.name).join(', '));
