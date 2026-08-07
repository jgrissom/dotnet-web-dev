#!/usr/bin/env node
// Markdown -> HTML for the published cue sheets, with syntax highlighting
// applied AT BUILD TIME.
//
//   node scripts/render-cue-html.js < demo-script.md > body.html
//
// Why build-time and not a <script> tag: the sheet is read live, at the
// projector, on classroom wifi. Highlighting here bakes <span class="hljs-…">
// straight into the published HTML, so the page needs no CDN, no runtime JS
// and no second origin that can fail on its own. The colours are plain CSS in
// export-slides.yml, matching the deck's.
//
// Fences with no language stay untouched on purpose — the sheets use bare
// fences for EXPECTED OUTPUT (terminal text, commit messages), and colouring
// those as if they were source would be a lie about what they are.
//
// ⚠️ Highlighting splits code into <span>s, which splits TEXT NODES — and the
// sticky Port box walks text nodes to retarget every localhost:NNNN, including
// what the Copy buttons put on the clipboard. Verified against week 6's curl
// (the only sheet with a localhost URL): highlight.js's bash grammar leaves it
// contiguous. Re-check that if a new sheet puts a URL in a different language.
//
// ⚠️ `cshtml` and `razor` are NOT registered highlight.js languages — a fence
// tagged with either falls through to plain text rather than erroring. No sheet
// uses them today; if one does, decide whether to map it to `xml`.
const { Marked } = require("marked");
const { markedHighlight } = require("marked-highlight");
const hljs = require("highlight.js");

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "nohighlight",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      if (!lang) return code; // expected-output block — leave it alone
      if (!hljs.getLanguage(lang)) return code;
      return hljs.highlight(code, { language: lang }).value;
    },
  })
);
marked.setOptions({ gfm: true });

let md = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (md += c));
process.stdin.on("end", () => process.stdout.write(marked.parse(md)));
