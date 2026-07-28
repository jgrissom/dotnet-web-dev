#!/usr/bin/env node
// Week README table formatter/checker.
//   node scripts/check-tables.js <rootDir>          verify (CI)
//   node scripts/check-tables.js <rootDir> --fix    repair in place
//
// Every week-NN/README.md opens with a "Use in this order" table. Columns 1 and 2
// (When / Document) must never wrap — GitHub breaks them at BOTH spaces and
// hyphens, so "In class, last 30 min" and "lecture-notes.md" each split in two.
// Fix: &nbsp; for spaces, U+2060 WORD JOINER after every hyphen and slash.
// Link URLs are left alone — a joiner inside "(lecture-notes.md)" breaks the link.
// Column 3 is free to wrap; it carries the long descriptions.

const fs = require("fs");
const path = require("path");

const WJ = "\u2060";
const NBSP = "&nbsp;";
const root = path.resolve(process.argv[2] || ".");
const fix = process.argv.includes("--fix");
const isSeparator = (cell) => /^[\s:\-]+$/.test(cell);

// spaces can't break, and neither can hyphens/slashes
const harden = (text) =>
  text.replace(/ /g, NBSP).replace(/([-/])(?!\u2060)/g, "$1" + WJ);

// same, but never touch a markdown link's (url) part
const hardenLinkCell = (cell) =>
  cell
    .split(/(\([^)]*\))/g)
    .map((part) => (part.startsWith("(") && part.endsWith(")") ? part : harden(part)))
    .join("");

const weekReadmes = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((e) => e.isDirectory() && /^week-\d+$/.test(e.name))
  .map((e) => path.join(root, e.name, "README.md"))
  .filter(fs.existsSync)
  .sort();

const problems = [];
let repaired = 0;

for (const file of weekReadmes) {
  const rel = path.relative(root, file);
  const lines = fs.readFileSync(file, "utf8").split("\n");
  let inTable = false;
  let touched = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^\|\s*When\s*\|/.test(line) && /Document/.test(line)) { inTable = true; continue; }
    if (inTable && !line.startsWith("|")) { inTable = false; continue; }
    if (!inTable || !line.startsWith("|")) continue;

    const parts = line.split("|");
    if (parts.length < 4 || isSeparator(parts[1])) continue;

    const want1 = " " + harden(parts[1].trim()) + " ";
    const want2 = " " + hardenLinkCell(parts[2].trim()) + " ";

    if (want1 !== parts[1] || want2 !== parts[2]) {
      if (fix) {
        parts[1] = want1;
        parts[2] = want2;
        lines[i] = parts.join("|");
        touched = true;
        repaired++;
      } else {
        const which = want1 !== parts[1] ? parts[1].trim() : parts[2].trim();
        problems.push(`${rel}:${i + 1}: cell can wrap → ${which}`);
      }
    }
  }

  if (touched) fs.writeFileSync(file, lines.join("\n"));
}

if (!weekReadmes.length) {
  console.log("⚠️  no week-NN/README.md files found — nothing to check");
  process.exit(0);
}

if (fix) {
  console.log(`✅ ${repaired} cell(s) repaired across ${weekReadmes.length} week README(s)`);
  process.exit(0);
}

if (problems.length) {
  console.log(`❌ ${problems.length} wrappable cell(s) in week README tables:`);
  problems.forEach((p) => console.log("  " + p));
  console.log("\n   Run:  node scripts/check-tables.js . --fix");
  process.exit(1);
}

console.log(`✅ week README tables OK (${weekReadmes.length} checked — columns 1–2 can't wrap)`);
