#!/usr/bin/env node
// Every earlier week's references to a later week — the checklist you work
// through when you BUILD that later week.
//
//   node scripts/check-forward-refs.js <rootDir> <N>   references to week N
//   node scripts/check-forward-refs.js <rootDir>       all forward references
//
// ⚠️ THIS IS NOT A GATE. It always exits 0 when it finds things, because it
// cannot judge whether a claim is TRUE — only a human comparing the sentence
// against the built week can do that. Wiring it into CI would make it a
// checker that passes vacuously, which this course treats as worse than no
// checker at all.
//
// Why it exists. Week 2's lab README promised "in week 6 the sighting form
// actually starts saving things". Week 6 was written later and its form
// creates a Cryptid, not a sighting — so the promise was false the day week 6
// shipped, and stayed false because nothing sent anyone back to week 2.
//
// The lesson is that the defect is NOT in making a forward reference. Weeks
// 1–8 carry 238 of them and essentially all are safe: they restate a week's
// TOPIC as the syllabus commits it ("week 9 is your second related table"),
// and that syllabus is a pasted, committed artifact. What broke was a promise
// about what one specific ARTIFACT would do. So the rule is about specificity,
// and this script is about the re-check that was missing:
//
//   when you build week N, read every line below and confirm it against
//   what you actually built.
//
// Matching notes: `week 6`, `week-06`, `Week 6's` and `weeks 6–7` all count,
// and a single digit never matches a two-digit week (asking for week 1 does
// not drag in week 15). Ranges like "weeks 5–16" are matched on both ends.

const fs = require("fs");
const path = require("path");

const [, , rootArg, weekArg] = process.argv;

if (!rootArg) {
  console.log("usage: node scripts/check-forward-refs.js <rootDir> [weekNumber]");
  console.log("  e.g. node scripts/check-forward-refs.js . 9");
  process.exit(1);
}

const root = path.resolve(rootArg);
const target = weekArg ? parseInt(weekArg, 10) : null;

if (weekArg && (!Number.isInteger(target) || target < 1 || target > 16)) {
  console.log(`❌ "${weekArg}" is not a week number between 1 and 16.`);
  process.exit(1);
}

// ── the week folders we're scanning ──────────────────────────────────────────
let weekDirs = [];
try {
  weekDirs = fs.readdirSync(root)
    .filter((d) => /^week-\d+$/.test(d))
    .filter((d) => fs.statSync(path.join(root, d)).isDirectory())
    .sort();
} catch {
  console.log(`❌ can't read ${root}`);
  process.exit(1);
}

// ⚠️ Announce the vacuum out loud. Handed a week folder instead of the root,
// two of this repo's other checkers scan nothing and print their success line.
if (!weekDirs.length) {
  console.log(`❌ no week-NN folders inside ${root} — nothing was scanned.`);
  console.log("   Pass the ROOT that CONTAINS the week folders, not a week folder itself.");
  process.exit(1);
}

const mdFiles = (dir) => {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== "node_modules") walk(p); }
      else if (e.name.endsWith(".md")) out.push(p);
    }
  };
  walk(dir);
  return out;
};

// "week 6" / "week-06" / "Week 6's" / "weeks 6–7" — never 6 matching 16.
const refRe = (n) =>
  new RegExp(`weeks?[-\\s]+0*${n}(?![0-9])`, "gi");

// The sentence around a hit, so the claim is readable without opening the file.
const sentenceAt = (line, idx) => {
  const start = Math.max(0, line.lastIndexOf(". ", idx) + 1, line.lastIndexOf("— ", idx) + 1);
  let end = line.length;
  for (const p of [". ", "! ", "? "]) {
    const e = line.indexOf(p, idx);
    if (e !== -1 && e + 1 < end) end = e + 1;
  }
  return line.slice(start, end).trim().replace(/\s+/g, " ");
};

const targets = target ? [target] : Array.from({ length: 16 }, (_, i) => i + 1);
const found = new Map();          // targetWeek -> [{rel, line, text}]
let filesScanned = 0;

for (const dir of weekDirs) {
  const sourceWeek = parseInt(dir.match(/\d+/)[0], 10);
  for (const file of mdFiles(path.join(root, dir))) {
    filesScanned++;
    const rel = path.relative(root, file);
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const t of targets) {
        if (t <= sourceWeek) continue;             // only look FORWARD
        const re = refRe(t);
        let m;
        while ((m = re.exec(line))) {
          if (!found.has(t)) found.set(t, []);
          found.get(t).push({ rel, line: i + 1, text: sentenceAt(line, m.index) });
        }
      }
    });
  }
}

// ── report ───────────────────────────────────────────────────────────────────
const total = [...found.values()].reduce((n, a) => n + a.length, 0);
const label = target ? `week ${target}` : "later weeks";

if (!total) {
  console.log(`✅ no forward references to ${label} (scanned ${filesScanned} files in ${weekDirs.length} week folders).`);
  process.exit(0);
}

console.log(`📋 ${total} forward reference(s) to ${label} — scanned ${filesScanned} files in ${weekDirs.length} week folders.\n`);

for (const t of [...found.keys()].sort((a, b) => a - b)) {
  const hits = found.get(t);
  console.log(`── week ${t} ── ${hits.length} reference(s)`);
  for (const h of hits) console.log(`   ${h.rel}:${h.line}\n      ${h.text}`);
  console.log("");
}

console.log("⚠️  This tool cannot tell whether any of these is TRUE.");
console.log("    Read each one against what you actually built, and fix the ones that");
console.log("    promise what a specific artifact does rather than what the week covers.");
