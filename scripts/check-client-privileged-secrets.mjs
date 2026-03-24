import { readFileSync } from 'node:fs';
import path from 'node:path';

const targets = [
  path.resolve('src/services'),
  path.resolve('src/lib'),
];

const disallowedPatterns = [
  /STRIPE_SECRET_KEY/,
  /VITE_ANTHROPIC_API_KEY/,
  /VITE_OPENAI_API_KEY/,
  /VITE_PERPLEXITY_API_KEY/,
  /anthropic-dangerous-direct-browser-access/,
  /https:\/\/api\.stripe\.com\/v1/,
  /https:\/\/api\.anthropic\.com\/v1/,
  /https:\/\/api\.openai\.com\/v1/,
  /https:\/\/api\.perplexity\.ai\//,
];

async function collectFiles(rootDir) {
  const fs = await import('node:fs/promises');
  const out = [];
  async function walk(dir) {
    let entries = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
        out.push(fullPath);
      }
    }
  }
  await walk(rootDir);
  return out;
}

const violations = [];

for (const target of targets) {
  // eslint-disable-next-line no-await-in-loop
  const files = await collectFiles(target);
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    for (const pattern of disallowedPatterns) {
      if (pattern.test(content)) {
        violations.push({ file, pattern: String(pattern) });
      }
    }
  }
}

if (violations.length) {
  console.error('Client privileged secret boundary violations found:');
  for (const violation of violations) {
    console.error(`- ${violation.file} matched ${violation.pattern}`);
  }
  process.exit(1);
}

console.log('No privileged client secret boundary violations found.');
