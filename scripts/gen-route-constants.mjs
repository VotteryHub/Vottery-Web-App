import fs from "fs";
import path from "path";

const routesPath = path.join(process.cwd(), "src", "Routes.jsx");
const hubPath = path.join(process.cwd(), "src", "constants", "navigationHubRoutes.js");
const s = fs.readFileSync(routesPath, "utf8");
const lines = s.split(/\r?\n/);

const start = lines.findIndex((l) => l.includes("const routes = ["));
let end = -1;
for (let i = start + 1; i < lines.length; i++) {
  if (/^\s*\];\s*$/.test(lines[i])) {
    end = i;
    break;
  }
}
if (start < 0 || end < 0) {
  console.error("Could not find routes array");
  process.exit(1);
}

const block = lines.slice(start, end + 1).join("\n");
const pathRe = /path:\s*["']([^"']+)["']/g;
const seen = new Set();
const paths = [];
let m;
while ((m = pathRe.exec(block)) !== null) {
  const p = m[1];
  if (!seen.has(p)) {
    seen.add(p);
    paths.push(p);
  }
}

function pathToExportName(p) {
  const slug = p
    .replace(/^\//, "")
    .replace(/-/g, "_")
    .replace(/[^a-z0-9_]/gi, "_");
  return `${slug.toUpperCase()}_ROUTE`;
}

const existing = fs.readFileSync(hubPath, "utf8");
const existingNames = new Set();
const existingConstRe = /export const ([A-Z0-9_]+)\s*=/g;
let em;
while ((em = existingConstRe.exec(existing)) !== null) {
  existingNames.add(em[1]);
}

const newExports = [];
for (const p of paths) {
  let name = pathToExportName(p);
  if (existingNames.has(name)) continue;
  // avoid collisions by suffixing
  let candidate = name;
  let n = 2;
  while (existingNames.has(candidate) || newExports.some((x) => x.name === candidate)) {
    candidate = `${name.replace(/_ROUTE$/, "")}_${n}_ROUTE`;
    n++;
  }
  name = candidate;
  existingNames.add(name);
  const val = JSON.stringify(p);
  if (p.length < 70) {
    newExports.push(`export const ${name} = ${val};`);
  } else {
    newExports.push(`export const ${name} =\n  ${val};`);
  }
}

console.log(`Routes block lines ${start + 1}-${end + 1}, unique paths: ${paths.length}`);
console.log(`New exports to add: ${newExports.length}`);
fs.writeFileSync(
  path.join(process.cwd(), "scripts", "new-route-exports.fragment.js"),
  newExports.join("\n") + "\n"
);
console.log("Wrote scripts/new-route-exports.fragment.js");
