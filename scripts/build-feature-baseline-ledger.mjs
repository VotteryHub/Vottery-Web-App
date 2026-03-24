import fs from 'node:fs';
import path from 'node:path';

const webRoot = process.cwd();
const mobileRoot = path.resolve(webRoot, '..', 'Vottery-Mobile-App');
const contractPath = path.resolve(
  webRoot,
  'docs',
  'certification-20260323',
  'feature-contract-1-233.json'
);
const outDir = path.resolve(webRoot, 'docs', 'certification-20260323');

function readUtf8(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function walkFiles(rootDir, includeExts, maxFiles = 12000) {
  const out = [];
  const stack = [rootDir];
  while (stack.length && out.length < maxFiles) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(current, e.name);
      if (e.isDirectory()) {
        if (['node_modules', 'build', '.git', '.cursor', 'android', 'ios'].includes(e.name)) {
          continue;
        }
        stack.push(full);
      } else {
        const ext = path.extname(e.name).toLowerCase();
        if (includeExts.has(ext)) out.push(full);
      }
    }
  }
  return out;
}

function tokenizeTitle(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((x) => x.length >= 4)
    .slice(0, 5);
}

function containsKeywords(haystack, words) {
  if (!haystack || !words.length) return false;
  const s = haystack.toLowerCase();
  const hits = words.filter((w) => s.includes(w));
  return hits.length >= Math.min(2, words.length);
}

const contract = JSON.parse(readUtf8(contractPath));
const features = contract?.features || [];

const webFiles = walkFiles(
  path.join(webRoot, 'src'),
  new Set(['.js', '.jsx', '.ts', '.tsx'])
);
const mobileFiles = walkFiles(
  path.join(mobileRoot, 'lib'),
  new Set(['.dart'])
);
const migrationFiles = walkFiles(
  path.join(webRoot, 'supabase', 'migrations'),
  new Set(['.sql'])
);

const webCorpus = webFiles.map((p) => ({ path: p, text: readUtf8(p) }));
const mobileCorpus = mobileFiles.map((p) => ({ path: p, text: readUtf8(p) }));
const dbCorpus = migrationFiles.map((p) => ({ path: p, text: readUtf8(p) }));

const rows = features.map((f) => {
  const keywords = tokenizeTitle(f.title);
  const webMatch = webCorpus.find((doc) => containsKeywords(doc.text, keywords));
  const mobileMatch = mobileCorpus.find((doc) => containsKeywords(doc.text, keywords));
  const dbMatch = dbCorpus.find((doc) => containsKeywords(doc.text, keywords));
  const statusHint = String(f.statusHint || '').toLowerCase();

  let verdict = 'AMBER';
  if (statusHint.includes('not implemented')) verdict = 'RED';
  if (statusHint.includes('fully implemented')) verdict = 'GREEN';
  if (!f.statusHint && webMatch && mobileMatch) verdict = 'AMBER';

  return {
    id: f.id,
    title: f.title,
    section: f.section,
    availability: f.availability,
    webEvidence: webMatch ? path.relative(webRoot, webMatch.path).replaceAll('\\', '/') : '',
    mobileEvidence: mobileMatch
      ? path.relative(mobileRoot, mobileMatch.path).replaceAll('\\', '/')
      : '',
    dbEvidence: dbMatch ? path.relative(webRoot, dbMatch.path).replaceAll('\\', '/') : '',
    statusHint: f.statusHint || '',
    verdict,
    regressionEvidence: '',
    policyCompliance: 'PENDING',
  };
});

const ledger = {
  generatedAt: new Date().toISOString(),
  methodology: 'Heuristic baseline map. Final verdict requires full regression evidence.',
  rows,
};

fs.writeFileSync(path.join(outDir, 'feature-baseline-ledger-1-233.json'), JSON.stringify(ledger, null, 2));

const csvHeader = [
  'id',
  'title',
  'availability',
  'web_evidence',
  'mobile_evidence',
  'db_evidence',
  'status_hint',
  'verdict',
  'policy_compliance',
].join(',');
const csvRows = rows.map((r) =>
  [
    r.id,
    `"${r.title.replaceAll('"', '""')}"`,
    `"${String(r.availability).replaceAll('"', '""')}"`,
    `"${r.webEvidence}"`,
    `"${r.mobileEvidence}"`,
    `"${r.dbEvidence}"`,
    `"${String(r.statusHint).replaceAll('"', '""')}"`,
    r.verdict,
    r.policyCompliance,
  ].join(',')
);
fs.writeFileSync(path.join(outDir, 'feature-baseline-ledger-1-233.csv'), [csvHeader, ...csvRows].join('\n'));

const md = [
  '# Feature Baseline Ledger 1-233',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '| ID | Feature | Web Evidence | Mobile Evidence | DB Evidence | Status Hint | Baseline Verdict |',
  '|---|---|---|---|---|---|---|',
  ...rows.map(
    (r) =>
      `| ${r.id} | ${r.title} | ${r.webEvidence || '—'} | ${r.mobileEvidence || '—'} | ${r.dbEvidence || '—'} | ${r.statusHint || '—'} | ${r.verdict} |`
  ),
  '',
].join('\n');
fs.writeFileSync(path.join(outDir, 'feature-baseline-ledger-1-233.md'), md);

const summary = rows.reduce(
  (acc, r) => {
    acc[r.verdict] = (acc[r.verdict] || 0) + 1;
    return acc;
  },
  { GREEN: 0, AMBER: 0, RED: 0 }
);
console.log(`Baseline ledger generated. GREEN=${summary.GREEN} AMBER=${summary.AMBER} RED=${summary.RED}`);
