#!/usr/bin/env node
// Demo cue sheet ↔ slide deck consistency checker.
//   node scripts/check-cues.js <rootDir>
//
// Every week with a demo/demo-script.md drives its deck from that sheet:
//   - `🎞️ **GO TO SLIDE n** — *Title*` marks each point the projector switches
//   - `## N · Section *(slides A–B)*` claims which slides a section covers
//   - each slide's `<!-- _footer: '🖥️ Demo §N · beat' -->` is the way back
//
// Those three drift apart silently. Week 5's script claimed §1 was slides 3–7
// when _ViewStart is slide 7 and belongs to §2; week 3's §1 claimed one slide
// for a segment teaching three; week 6's §1 heading claimed 3–7 while cueing
// slide 2 inside it. None of that is visible to check-links or a render.
//
// Checks, per week:
//   1. cues cover slides 2..last, in order, no duplicates, none invented
//   2. each cue's title matches that slide's real `##` heading
//   3. each cue sits inside the slide range its section claims
//   4. every cued slide carries a footer, pointing at the section it's cued in
//   5. a cue under a `###` sub-beat has a footer naming a beat (` · `)
//   6. no code fence opens on a `- [ ]` line, and fences are balanced
//
// (6) is a different class of bug and the nastiest so far. Writing a beat as
// "- [ ] ```bash" with the command indented under it looks correct on GitHub,
// but `marked` makes no code block from it — so no styling and no Copy button —
// and the unbalanced fence swallows the content after it. Week 7 shipped two
// and lost NINE checklist items: the source had 170 `- [ ]` lines and the built
// page rendered 161. Nothing else could see it. check-links passed, and
// comparing Copy buttons to <pre> count matches, because both are absent.

const fs = require("fs");
const path = require("path");

const root = path.resolve(process.argv[2] || ".");
const problems = [];
const norm = (s) => s.replace(/[`*]/g, "").replace(/[’]/g, "'").replace(/\.$/, "").trim().toLowerCase();

// Slide 1 is the title slide; `##` headings are slides 2..n+1.
function slidesOf(file) {
  const raw = fs.readFileSync(file, "utf8");
  const body = raw.split("---\n").slice(2).join("---\n");
  const chunks = body.split(/\n---\n/);
  return chunks.map((c, i) => ({
    n: i + 1,
    title: (c.match(/^#{1,2} (.+)$/m) || [])[1]?.trim() || null,
    footer: (c.match(/_footer:\s*'([^']*)'/) || [])[1] || null,
  }));
}

function cuesOf(file) {
  const out = [];
  let sec = null, lo = null, hi = null, beat = false;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    let m = line.match(/^## (\d+[a-z]?) · (.+?)\s*(?:\*\(slides? (\d+)(?:[–—-](\d+))?\)\*)?\s*(?:—.*)?$/);
    if (m) { sec = m[1]; lo = m[3] ? +m[3] : null; hi = m[4] ? +m[4] : lo; beat = false; continue; }
    if (/^## /.test(line)) { sec = null; continue; }
    if (/^### /.test(line) && sec) { beat = true; continue; }
    m = line.match(/🎞️ \*\*GO TO SLIDE (\d+)\*\* — \*([^*]+)\*/);
    if (m && sec) out.push({ n: +m[1], title: m[2].trim(), sec, lo, hi, beat });
  }
  return out;
}

for (const wk of fs.readdirSync(root).filter(d => /^week-\d+$/.test(d)).sort()) {
  const script = path.join(root, wk, "demo", "demo-script.md");
  const deck = path.join(root, wk, "slides.md");
  if (!fs.existsSync(script) || !fs.existsSync(deck)) continue;

  const slides = slidesOf(deck);
  const cues = cuesOf(script);
  const last = slides.length;
  const say = (msg) => problems.push(`${wk}: ${msg}`);

  // 1 — coverage, order, duplicates
  const nums = cues.map(c => c.n);
  const expected = Array.from({ length: last - 1 }, (_, i) => i + 2);
  for (const n of expected) if (!nums.includes(n)) say(`slide ${n} has no 🎞️ cue`);
  for (const n of nums) if (n < 2 || n > last) say(`cue names slide ${n}, but the deck has ${last} slides`);
  if (nums.some((n, i) => i && n < nums[i - 1])) say(`cues are out of order: ${nums.join(", ")}`);
  const dupes = nums.filter((n, i) => nums.indexOf(n) !== i);
  if (dupes.length) say(`slide(s) cued more than once: ${[...new Set(dupes)].join(", ")}`);

  for (const c of cues) {
    const slide = slides[c.n - 1];
    if (!slide) continue;

    // 2 — the cue's title is really that slide's heading
    if (slide.title && !(norm(c.title) === norm(slide.title) || norm(c.title).startsWith(norm(slide.title))))
      say(`cue for slide ${c.n} says "${c.title}" but the slide is "${slide.title}"`);

    // 3 — inside the range its section claims
    if (c.lo !== null && (c.n < c.lo || c.n > c.hi))
      say(`slide ${c.n} is cued inside §${c.sec}, which claims slides ${c.lo}–${c.hi}`);

    // 4/5 — the footer is the way back to this sheet
    if (!slide.footer) { say(`slide ${c.n} is cued but has no _footer`); continue; }
    const fsec = (slide.footer.match(/§(\d+[a-z]?)/) || [])[1];
    if (fsec !== c.sec)
      say(`slide ${c.n} footer says §${fsec} but it's cued in §${c.sec}`);
    if (c.beat && !slide.footer.includes("·"))
      say(`slide ${c.n} is cued under a ### sub-beat but its footer names no beat`);
  }

  // 6 — the sheet has to survive `marked`
  let fences = 0;
  fs.readFileSync(script, "utf8").split("\n").forEach((line, i) => {
    if (/^\s*```/.test(line)) fences++;
    if (/^\s*[-*] \[[ xX]\]\s*```/.test(line))
      say(`demo-script.md:${i + 1} opens a code fence on the checkbox line — `
        + `marked makes no code block from that (no styling, no Copy button) and `
        + `it swallows the items after it. Put the fence on its own line.`);
  });
  if (fences % 2)
    say(`demo-script.md has ${fences} fence lines — an odd count means one is unclosed`);
}

if (problems.length) {
  console.error("❌ cue sheet / deck mismatches:\n" + problems.map(p => "   " + p).join("\n"));
  process.exit(1);
}
console.log("✅ demo cues line up with the decks (order, titles, section ranges, footers)");
