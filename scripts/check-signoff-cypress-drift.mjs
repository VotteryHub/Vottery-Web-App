import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const applyScriptPath = path.resolve(root, 'scripts', 'apply-regression-evidence.mjs');
const signoffPath = path.resolve(
  root,
  'docs',
  'certification-20260323',
  'CONTINUATION_SIGNOFF.md'
);

const applySrc = fs.readFileSync(applyScriptPath, 'utf8');
const signoffSrc = fs.readFileSync(signoffPath, 'utf8');

function expandIds(raw) {
  const cleaned = raw
    .replace(/\*\([^)]*\)\*/g, '')
    .replace(/`/g, '')
    .trim();
  if (!cleaned) return new Set();

  const ids = new Set();
  const tokens = cleaned.split(',').map((s) => s.trim()).filter(Boolean);

  for (const token of tokens) {
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      for (let i = lo; i <= hi; i += 1) ids.add(i);
      continue;
    }

    const single = token.match(/^(\d+)$/);
    if (single) ids.add(Number(single[1]));
  }

  return ids;
}

function parseSetLiterals(source) {
  const map = new Map();
  const re = /const\s+([A-Za-z0-9_]+)\s*=\s*new\s+Set\(\[([\s\S]*?)\]\);/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    map.set(m[1], expandIds(m[2]));
  }
  return map;
}

function parseSpecConstants(source) {
  const map = new Map();
  const re = /const\s+([A-Za-z0-9_]+)\s*=\s*'((?:cypress:e2e\/)[^']+)'/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    map.set(m[1], m[2].replace(/^cypress:e2e\//, ''));
  }
  return map;
}

function parsePushMappings(source) {
  const map = new Map(); // specConst -> setName
  const re =
    /if\s*\(\s*([A-Za-z0-9_]+)\.has\(row\.id\)\s*\)\s*\{\s*parts\.push\(\s*([A-Za-z0-9_]+)\s*\);\s*\}/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    map.set(m[2], m[1]);
  }
  return map;
}

function parseSignoffTable(source) {
  const lines = source.split(/\r?\n/);
  const map = new Map(); // spec filename -> Set<number>
  for (const line of lines) {
    const row = line.match(/^\|\s*`([^`]+\.cy\.js)`\s*\|\s*(.*?)\s*\|$/);
    if (!row) continue;
    map.set(row[1], expandIds(row[2]));
  }
  return map;
}

function diffSets(a, b) {
  const onlyA = [];
  const onlyB = [];
  for (const n of a) if (!b.has(n)) onlyA.push(n);
  for (const n of b) if (!a.has(n)) onlyB.push(n);
  onlyA.sort((x, y) => x - y);
  onlyB.sort((x, y) => x - y);
  return { onlyA, onlyB };
}

const setLiterals = parseSetLiterals(applySrc);
const specConstants = parseSpecConstants(applySrc);
const pushMappings = parsePushMappings(applySrc);
const docTable = parseSignoffTable(signoffSrc);

const scriptMap = new Map(); // spec filename -> Set<number>
for (const [specConst, setName] of pushMappings.entries()) {
  const specFile = specConstants.get(specConst);
  if (!specFile) continue;
  const ids = setLiterals.get(setName);
  if (!ids) continue;
  scriptMap.set(specFile, ids);
}

const scriptSpecs = new Set(scriptMap.keys());
const docSpecs = new Set(docTable.keys());

const missingInDoc = [...scriptSpecs].filter((s) => !docSpecs.has(s)).sort();
const extraInDoc = [...docSpecs].filter((s) => !scriptSpecs.has(s)).sort();

const mismatches = [];
for (const spec of [...scriptSpecs].sort()) {
  if (!docTable.has(spec)) continue;
  const { onlyA, onlyB } = diffSets(scriptMap.get(spec), docTable.get(spec));
  if (onlyA.length > 0 || onlyB.length > 0) {
    mismatches.push({ spec, onlyInScript: onlyA, onlyInDoc: onlyB });
  }
}

if (missingInDoc.length || extraInDoc.length || mismatches.length) {
  console.error('Cypress sign-off drift detected.\n');
  if (missingInDoc.length) {
    console.error('Missing in sign-off table:');
    for (const spec of missingInDoc) console.error(`  - ${spec}`);
    console.error('');
  }
  if (extraInDoc.length) {
    console.error('Present in sign-off table but not in apply script mappings:');
    for (const spec of extraInDoc) console.error(`  - ${spec}`);
    console.error('');
  }
  if (mismatches.length) {
    console.error('Spec ID mismatches:');
    for (const m of mismatches) {
      console.error(`  - ${m.spec}`);
      if (m.onlyInScript.length) {
        console.error(`      only in apply script: ${m.onlyInScript.join(', ')}`);
      }
      if (m.onlyInDoc.length) {
        console.error(`      only in sign-off doc: ${m.onlyInDoc.join(', ')}`);
      }
    }
  }
  process.exit(1);
}

console.log('No Cypress sign-off drift detected (apply script <-> sign-off table).');
