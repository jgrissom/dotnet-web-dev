#!/usr/bin/env node
// Build the projector-facing step page for a build-along demo.
//
//   node scripts/render-demo-steps.js week-02 w02-step- week-02/demo/index.html > steps.html
//
// Reads the per-beat commits off the demo branch (one commit per cue-sheet
// beat, tagged <prefix>NN) and renders ONE PAGE the room looks at: each step
// is a screen showing that beat's diff, big enough to read from the back,
// with prev/next and a button that copies the whole file for that step.
//
// Why the whole file and not the diff: the instructor pastes over the scratch
// copy rather than hand-editing it. Select all, paste, refresh. That is the
// entire point — nobody hunts for an insertion point in front of the room.
//
// Self-contained on purpose: inline CSS and JS, no CDN, no fonts, no network.
// It is opened live at the projector on classroom wifi, and a second origin
// that can fail on its own is exactly what it does not need — same rule the
// cue sheets follow.
const { execFileSync } = require("child_process");

const [week, prefix, file] = process.argv.slice(2);
if (!week || !prefix || !file) {
  console.error("usage: render-demo-steps.js <week> <tag-prefix> <path>");
  process.exit(2);
}

const git = (...a) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const tags = git("tag", "--list", `${prefix}*`).split("\n").filter(Boolean).sort();
if (tags.length < 2) {
  console.error(`render-demo-steps: found ${tags.length} tags matching ${prefix}* — nothing to render`);
  process.exit(1);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Each step after the first: the diff against the step before it, plus the
// full file at that step for the Copy button.
const steps = [];
for (let i = 1; i < tags.length; i++) {
  const prev = tags[i - 1], cur = tags[i];
  const subject = git("log", "-1", "--format=%s", cur).trim();
  const raw = git("diff", `${prev}`, `${cur}`, "--unified=2", "--", file);
  const body = raw
    .split("\n")
    .filter((l) => !/^(diff --git|index |--- |\+\+\+ |new file|old mode|new mode)/.test(l))
    .filter((l, idx, arr) => !(l === "" && idx === arr.length - 1));
  const full = git("show", `${cur}:${file}`);
  steps.push({ n: i, tag: cur, subject, body, full });
}

const diffHtml = (lines) =>
  lines
    .map((l) => {
      if (l.startsWith("@@")) return `<span class="hunk">${esc(l)}</span>`;
      if (l.startsWith("+")) return `<span class="add">${esc(l)}</span>`;
      if (l.startsWith("-")) return `<span class="del">${esc(l)}</span>`;
      return `<span class="ctx">${esc(l)}</span>`;
    })
    // Joined with NOTHING on purpose. These spans are display:block, and this
    // sits inside a <pre> — a newline between them is preserved as its own
    // line box, so every diff row would get a blank row under it and half the
    // screen would be empty. Cost an entire projector's worth of space once.
    .join("");

// A 720p projector fits roughly 19 lines at the full size. Rather than let a
// long step scroll — which on a projector means the room reads the top half of
// a change and nothing else — step down the type, and past a point show only
// the head of the diff with an honest marker.
//
// Truncating the DISPLAY is safe here in a way it never was on the cue sheet:
// the Copy button reads the full file out of its own <textarea>, not out of
// the diff. What the room sees can be an excerpt; what lands on the clipboard
// is always the whole file.
// Budget in RENDERED ROWS, not source lines. Lines wrap now, so one long line
// can cost two or three rows — sizing off the line count put five steps over
// the fold at 1280x720 while the count looked fine. Chars-per-row is measured
// from the mono font at each size against the usable width.
const ROWS_FULL = 16, CPR_FULL = 86;    // 1.35rem
const ROWS_DENSE = 25, CPR_DENSE = 120; // 0.95rem
const HEAD = 12, TAIL = 9;              // either side of the marker when longer
const rows = (lines, cpr) =>
  lines.reduce((n, l) => n + Math.max(1, Math.ceil(l.length / cpr)), 0);

const sections = steps
  .map((s) => {
    const n = s.body.length;
    const cls = rows(s.body, CPR_FULL) <= ROWS_FULL ? "" : " dense";
    let shown = s.body, note = "";
    if (rows(s.body, CPR_DENSE) > ROWS_DENSE) {
      // HEAD AND TAIL, not just the head. A long step here is usually a
      // replacement — five cards out, five cards in — and head-only truncation
      // showed the room every removed line and none of the added ones, which
      // is the half of the change that does not matter. Top shows what goes,
      // bottom shows what arrives.
      shown = s.body.slice(0, HEAD);
      const tail = s.body.slice(-TAIL);
      note =
        `<span class="more">… ${n - HEAD - TAIL} more lines of the same shape — the Copy button still gives you the whole file</span>` +
        diffHtml(tail);
    }
    return `<section class="step" data-n="${s.n}" hidden>
  <h1><span class="count">${s.n}<span class="of">/${steps.length}</span></span> ${esc(s.subject)}</h1>
  <pre class="diff${cls}">${diffHtml(shown)}${note}</pre>
  <textarea class="full" hidden>${esc(s.full)}</textarea>
</section>`;
  })
  .join("\n");

const STYLE = `
:root{--bg:#0d1117;--fg:#e6edf3;--dim:#9198a1;--line:#30363d;--addbg:rgba(63,185,80,.18);--addfg:#aff5b4;--delbg:rgba(248,81,73,.18);--delfg:#ffc1ba}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:var(--bg);color:var(--fg);font-family:system-ui,-apple-system,sans-serif}
body{display:flex;flex-direction:column}
h1{font-size:1.5rem;margin:0 0 .6rem;font-weight:600;line-height:1.25}
.count{display:inline-block;background:#1f6feb;color:#fff;border-radius:6px;padding:.05em .45em;margin-right:.5rem;font-variant-numeric:tabular-nums}
.count .of{opacity:.65;font-size:.75em}
main{flex:1;overflow:auto;padding:1.2rem 1.6rem}
.step{max-width:100%}
pre.diff{margin:0;background:#151b23;border:1px solid var(--line);border-radius:10px;padding:.9rem 0;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:1.35rem;line-height:1.45}
/* WRAP, do not scroll. A projector cannot be scrolled sideways by the room,
   so a long line running off the right edge is a line nobody can read — 8 of
   22 steps did that at full width and 20 of 22 at half width. Wrapping with a
   hanging indent keeps every character on screen and keeps the continuation
   visually attached to its own line. */
pre.diff span{display:block;padding:.05rem 1rem .05rem 3.2rem;text-indent:-2.2rem;white-space:pre-wrap;overflow-wrap:anywhere}
pre.diff .add{background:var(--addbg);color:var(--addfg)}
pre.diff .del{background:var(--delbg);color:var(--delfg)}
pre.diff .hunk{color:var(--dim);background:#12161d;font-size:.8em;padding-top:.25rem;padding-bottom:.25rem}
pre.diff.dense{font-size:.95rem;line-height:1.4}
pre.diff .more{display:block;padding:.5rem 1rem;color:var(--dim);font-style:italic;background:#12161d;border-top:1px solid var(--line)}
nav{display:flex;align-items:center;gap:.6rem;padding:.7rem 1.6rem;border-top:1px solid var(--line);background:#11161d}
button{font:inherit;font-size:1rem;padding:.45rem 1rem;border-radius:8px;border:1px solid var(--line);background:#20262d;color:var(--fg);cursor:pointer}
button:hover:not(:disabled){background:#2b333c}
button:disabled{opacity:.35;cursor:default}
#copy{margin-left:auto;background:#1f6feb;border-color:#1f6feb;color:#fff;font-weight:600}
#copy.done{background:#238636;border-color:#238636}
#where{color:var(--dim);font-size:.95rem}
#jump{font:inherit;background:#20262d;color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:.4rem}
@media (max-width:900px){pre.diff{font-size:1rem}h1{font-size:1.15rem}}
`;

const SCRIPT = `
(function(){
  var steps=[].slice.call(document.querySelectorAll('.step'));
  var prev=document.getElementById('prev'), next=document.getElementById('next');
  var copy=document.getElementById('copy'), jump=document.getElementById('jump');
  var KEY='${week}-demo-step';
  var i=Math.min(Math.max(parseInt(localStorage.getItem(KEY)||'0',10)||0,0),steps.length-1);
  function show(k){
    i=Math.min(Math.max(k,0),steps.length-1);
    steps.forEach(function(s,n){s.hidden=(n!==i);});
    prev.disabled=(i===0); next.disabled=(i===steps.length-1);
    jump.value=String(i);
    localStorage.setItem(KEY,String(i));
    document.querySelector('main').scrollTop=0;
    copy.textContent='Copy whole file'; copy.classList.remove('done');
  }
  prev.addEventListener('click',function(){show(i-1);});
  next.addEventListener('click',function(){show(i+1);});
  jump.addEventListener('change',function(){show(parseInt(jump.value,10));});
  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='SELECT')return;
    if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' ')  {e.preventDefault();show(i+1);}
    if(e.key==='ArrowLeft' ||e.key==='PageUp')                 {e.preventDefault();show(i-1);}
    if(e.key==='Home'){show(0);} if(e.key==='End'){show(steps.length-1);}
  });
  copy.addEventListener('click',function(){
    var t=steps[i].querySelector('.full').value;
    navigator.clipboard.writeText(t).then(function(){
      copy.textContent='Copied — select all in the editor, paste'; copy.classList.add('done');
    },function(){
      var ta=steps[i].querySelector('.full'); ta.hidden=false; ta.select();
      copy.textContent='Press Cmd/Ctrl+C';
    });
  });
  show(i);
})();
`;

process.stdout.write(`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${week} demo — step by step</title>
<style>${STYLE}</style>
</head><body>
<main>
${sections}
</main>
<nav>
  <button id="prev" type="button">&larr; Prev</button>
  <button id="next" type="button">Next &rarr;</button>
  <select id="jump" aria-label="Jump to step">
${steps.map((s, k) => `    <option value="${k}">${s.n}. ${esc(s.subject)}</option>`).join("\n")}
  </select>
  <span id="where">&larr; &rarr; to move</span>
  <button id="copy" type="button">Copy whole file</button>
</nav>
<script>${SCRIPT}</script>
</body></html>
`);
