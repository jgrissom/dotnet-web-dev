#!/usr/bin/env node
// Nested emphasis that `marked` silently refuses to render.
//   node scripts/check-emphasis.js <rootDir>
//
// The demo cue sheets are published by `export-slides.yml`, which pipes each
// `week-NN/demo/demo-script.md` through `marked`. A **bold** nested inside an
// *italic* run breaks there — the OUTER emphasis never forms and its asterisks
// land on the page as literal text — when both of these are true:
//
//   • the inner run's content ENDS in punctuation (. ? ! : ; , ) … — any of them)
//   • the character just AFTER its closing `**` is not a space
//
//     *"one question decides this. **Have I pushed it?**"*   ← broken:  ? then "
//     *"say this **loudly.**, ok"*                           ← broken:  . then ,
//     *"say this **loudly.** and then stop"*                 ← fine:    a space follows
//     *"one question decides this. **Have I pushed it**?"*   ← fine:    the fix
//
// The fix is always to move the punctuation outside the bold.
//
// Two things make this survive review, which is why it gets its own checker:
// GitHub's preview renders all four correctly, so the sheet looks right in the
// place it's written and is wrong only on the built page. And the sheets style
// spoken lines off `<em>` runs that open with a quote (`em.say` — amber, with a
// 🗣 marker), so a broken line ALSO loses its styling and stops reading as
// speech. Both failures are invisible unless you look at a real render.
//
// Over-reporting is the trap here. A regex that just looks for `.**` finds a
// hundred harmless lines — `**runs your C#**.` and `*(slides 1–7)*.` are fine,
// because nothing encloses them. Two conditions are load-bearing and a first
// attempt that drops either one is useless: the closing delimiter needs a
// NON-SPACE right after it, and the span has to be nested inside another,
// still-open emphasis run of a different delimiter. Hence the stack below
// rather than a pattern match.
//
// Punctuation here is CommonMark's: Unicode P* and S*, so `—`, `·`, `→` and 🎯
// all count as "ends in punctuation", while letters and digits do not. The
// thresholds above were read off a rendered matrix, not off the spec — an
// earlier pass got the "after" condition wrong by asking whether an `<em>`
// existed anywhere in the output instead of whether a delimiter had leaked.
// Verified against marked 18.
//
// Deliberately out of scope: a bold with nothing around it (`**bold.**xok`),
// which fails to render at all. That one is a CommonMark rule rather than a
// marked quirk, so the GitHub preview shows it too and ordinary review catches
// it — unlike the nested case, which is why this file exists.
//
// Known limit: emphasis is matched within a single line. The course's markdown
// puts one paragraph (and one demo beat) per line, so this costs nothing here;
// a soft-wrapped paragraph could hide a case.
// Skips fenced code blocks, inline code and escaped delimiters. Exits 1 on any
// hit (CI-friendly).

const fs = require("fs");
const path = require("path");

const root = path.resolve(process.argv[2] || ".");
const SKIP_DIRS = new Set(["node_modules", "bin", "obj", ".git", ".playwright-mcp", "wwwroot", "_site"]);
const PUNCT = /[\p{P}\p{S}]/u;

function mdFiles(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) out = out.concat(mdFiles(path.join(dir, e.name))); }
    else if (e.name.endsWith(".md")) out.push(path.join(dir, e.name));
  }
  return out;
}

// Blank out what isn't markup — escaped delimiters and inline code — padding to
// the same width so every index still points at the real column in the source.
// The backticks have to survive: flanking is decided by the adjacent character,
// so blanking a whole code span makes `**`code`` look like it's followed by a
// space and the run stops counting as an opener. That alone cost six false
// positives on this repo.
const mask = (line) =>
  line
    .replace(/\\[*_]/g, "!!")
    .replace(/`[^`]*`/g, (m) => "`" + "x".repeat(Math.max(0, m.length - 2)) + "`");

// Walk the line's `*`/`_` delimiter runs, matching them on a stack the way the
// author intended them to nest. A run that closes while something is still open
// beneath it is a nested span; that's the only kind that can break its parent.
function hazards(line) {
  const s = mask(line);
  if (/\*{3,}|_{3,}/.test(s)) return [];   // ***both at once*** — not used in this course
  const found = [];
  const stack = [];
  const re = /\*{1,2}|_{1,2}/g;
  let m;
  while ((m = re.exec(s))) {
    const run = m[0];
    const before = s[m.index - 1];
    const after = s[m.index + run.length];
    const canOpen = after !== undefined && !/\s/.test(after);
    const canClose = before !== undefined && !/\s/.test(before);
    const top = stack[stack.length - 1];

    if (canClose && top && top === run) {
      stack.pop();
      // Only a same-character, different-length run around it counts: `*` inside
      // `*` isn't legal nesting, and `__` inside `*` renders fine. Both of those
      // look like nesting to a naive check and are pure noise.
      const enclosing = stack[stack.length - 1];
      const nested = enclosing && enclosing[0] === run[0] && enclosing.length !== run.length;
      const tight = after !== undefined && !/\s/.test(after);
      if (nested && tight && (PUNCT.test(before) || !PUNCT.test(after)))
        found.push({ col: m.index + 1, run, before, after });
    } else if (canOpen) {
      stack.push(run);
    }
  }
  return found;
}

const problems = [];

for (const file of mdFiles(root)) {
  const rel = path.relative(root, file) || path.basename(file);
  let fence = false;
  fs.readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return; }
    if (fence) return;
    for (const h of hazards(line)) {
      const fix = PUNCT.test(h.before)
        ? `Move the "${h.before}" outside the ${h.run}.`
        : `Put a space after the closing ${h.run}.`;
      problems.push(
        `${rel}:${i + 1}:${h.col} — nested ${h.run} closes on "${h.before}" with "${h.after}" hard against it, `
        + `so marked drops the emphasis around it and prints the outer markers as text `
        + `(a spoken line also loses its 🗣 styling). ${fix}`
      );
    }
  });
}

if (problems.length) {
  console.log(`❌ ${problems.length} nested emphasis run(s) marked won't render:`);
  problems.forEach((p) => console.log("  " + p));
  process.exit(1);
}
console.log("✅ no nested emphasis that marked would drop");
