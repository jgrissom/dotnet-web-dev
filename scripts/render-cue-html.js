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
const { Marked } = require("marked");
const { markedHighlight } = require("marked-highlight");
const hljs = require("highlight.js");

// highlight.js has no `cshtml`/`razor` grammar, and an unrecognised language
// renders PLAIN — which on these sheets means a Razor block becomes
// indistinguishable from an expected-output block, the one distinction this
// file exists to keep. These blocks are HTML with @-expressions in them, so
// xml's tag/attribute colouring is exactly right and the @-bits stay plain:
// parity with fencing them as ```html, which is what the sheets do today.
// Nothing is mislabelled — langPrefix uses the fence's own tag, so the <code>
// still reads `language-cshtml` while the spans come from the xml grammar.
const ALIAS = { cshtml: "xml", razor: "xml" };

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "nohighlight",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      if (!lang) return code; // expected-output block — leave it alone
      const grammar = ALIAS[lang] || lang;
      // A typo'd fence tag (```csharo) fails the same silent way. Say so in the
      // build log rather than shipping a block that reads as terminal output.
      // Deliberately not fatal: blocking the whole Pages deploy — decks and all
      // — over one cosmetically-plain code block is disproportionate.
      if (!hljs.getLanguage(grammar)) {
        console.error(`render-cue-html: unknown fence language "${lang}" — rendered plain`);
        return code;
      }
      return hljs.highlight(code, { language: grammar }).value;
    },
  })
);
marked.setOptions({ gfm: true });

let md = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (md += c));
process.stdin.on("end", () => process.stdout.write(marked.parse(md)));
