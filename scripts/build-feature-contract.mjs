import fs from 'node:fs';
import path from 'node:path';

const sourcePath = path.resolve(
  process.cwd(),
  'VOTTERY_PLATFORM_COMPREHENSIVE_FEATURE_DOCUMENTATION_Web_All_User_Types.txt'
);
const outDir = path.resolve(process.cwd(), 'docs', 'certification-20260323');

const text = fs.readFileSync(sourcePath, 'utf8');
const lines = text.split(/\r?\n/);

const features = [];
const seenIds = new Set();
let section = '';
let subsection = '';
let availability = '';

for (const raw of lines) {
  const line = raw.trim();
  if (!line) continue;

  if (line.startsWith('SECTION ')) {
    section = line;
    continue;
  }
  if (line.startsWith('────────────────')) {
    continue;
  }
  if (line.startsWith('Available on:')) {
    availability = line.replace('Available on:', '').trim();
    continue;
  }
  const subMatch = raw.match(/^\s*\d+\.\d+\s+(.+?)\s+─+/);
  if (subMatch) {
    subsection = subMatch[1].trim();
    continue;
  }

  const m = line.match(/^(\d+)\.\s+(.+?)\s+Role:\s*(.+)$/);
  if (!m) continue;
  const id = Number(m[1]);
  let title = m[2].trim();
  let description = m[3].trim();
  let statusHint = '';

  const statusMatch = description.match(/^Status:\s*([^\.]+)\.\s*(.*)$/i);
  if (statusMatch) {
    statusHint = statusMatch[1].trim();
    description = statusMatch[2].trim();
  }

  if (id < 1 || id > 233 || seenIds.has(id)) {
    continue;
  }
  seenIds.add(id);

  const feature = {
    id,
    title,
    section,
    subsection,
    availability,
    statusHint: statusHint || null,
    description,
    policyConstraints: [
      'Maintain Batch-1 policy routes and controls',
      'AI routing must remain Gemini/Anthropic policy-compliant',
      'Internal ads remain disabled where policy requires',
    ],
    greenCriteria: [
      'Route/navigation verified',
      'Web and Mobile behavior parity verified where applicable',
      'Service + DB/Edge flow verified',
      'Automated tests passed (happy + edge cases)',
      'Policy compliance validated',
    ],
  };
  features.push(feature);
}

features.sort((a, b) => a.id - b.id);

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const contract = {
  generatedAt: new Date().toISOString(),
  sourcePath,
  featureCount: features.length,
  features,
};

fs.writeFileSync(path.join(outDir, 'feature-contract-1-233.json'), JSON.stringify(contract, null, 2));

const csvHeader = [
  'id',
  'title',
  'section',
  'subsection',
  'availability',
  'status_hint',
  'description',
].join(',');

const csvRows = features.map((f) =>
  [
    f.id,
    `"${String(f.title).replaceAll('"', '""')}"`,
    `"${String(f.section).replaceAll('"', '""')}"`,
    `"${String(f.subsection).replaceAll('"', '""')}"`,
    `"${String(f.availability).replaceAll('"', '""')}"`,
    `"${String(f.statusHint || '').replaceAll('"', '""')}"`,
    `"${String(f.description).replaceAll('"', '""')}"`,
  ].join(',')
);

fs.writeFileSync(
  path.join(outDir, 'feature-contract-1-233.csv'),
  [csvHeader, ...csvRows].join('\n')
);

const md = [
  '# Feature Contract 1-233',
  '',
  `- Generated: ${new Date().toISOString()}`,
  `- Source: \`${sourcePath}\``,
  `- Total features parsed: **${features.length}**`,
  '',
  '## GREEN Certification Rule',
  '',
  'A feature is GREEN only when route/navigation, service+data flow, parity, automated tests, and Batch-1 policy compliance are all proven.',
  '',
  '## Parsed IDs',
  '',
  features.map((f) => `${f.id}. ${f.title}`).join('\n'),
  '',
].join('\n');

fs.writeFileSync(path.join(outDir, 'feature-contract-1-233.md'), md);

console.log(`Feature contract generated: ${features.length} features`);
