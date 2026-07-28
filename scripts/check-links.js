#!/usr/bin/env node
// Course link checker.
//   node scripts/check-links.js <rootDir> [--external]
//
// Validates every markdown link in every .md file under rootDir:
//   • relative file links  → target file exists (relative to the md's folder)
//   • #anchor links        → target file contains a heading with that GitHub slug
//   • absolute http(s)     → only with --external: fetches and expects < 400
// Skips fenced code blocks. Exits 1 if anything is broken (CI-friendly).
// Requires: npm i github-slugger  (CI installs it; locally use NODE_PATH or npm i)

const fs = require("fs");
const path = require("path");
const GithubSlugger = (() => { const m = require("github-slugger"); return m.default || m; })();

const root = path.resolve(process.argv[2] || ".");
const checkExternal = process.argv.includes("--external");
const SKIP_DIRS = new Set(["node_modules", "bin", "obj", ".git", ".playwright-mcp", "wwwroot"]);
// URLs that 404 for the unauthenticated world on purpose (private repos etc.)
const EXTERNAL_ALLOWLIST = new Set([
  "https://github.com/jgrissom/dotnet-web-dev-answer-keys",
]);

function mdFiles(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) out = out.concat(mdFiles(path.join(dir, e.name))); }
    else if (e.name.endsWith(".md")) out.push(path.join(dir, e.name));
  }
  return out;
}

const stripCode = (s) => s.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");

const slugCache = new Map();
function slugsOf(file) {
  if (slugCache.has(file)) return slugCache.get(file);
  const slugger = new GithubSlugger();
  const set = new Set();
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^#{1,6}\s+(.*)/);
    if (m) set.add(slugger.slug(m[1].replace(/`/g, "").replace(/\*/g, "").trim()));
  }
  slugCache.set(file, set);
  return set;
}

const problems = [];
const externals = new Set();

for (const file of mdFiles(root)) {
  const rel = path.relative(root, file);
  const text = stripCode(fs.readFileSync(file, "utf8"));
  for (const m of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(mailto:|tel:)/.test(target)) continue;
    if (/^https?:\/\//.test(target)) { externals.add(target); continue; }
    const [filePart, anchor] = target.split("#");
    const targetFile = filePart === "" ? file : path.resolve(path.dirname(file), decodeURI(filePart));
    if (filePart !== "" && !fs.existsSync(targetFile)) {
      problems.push(`${rel}: missing file → ${target}`);
      continue;
    }
    if (anchor !== undefined) {
      const isMd = targetFile.endsWith(".md");
      if (isMd && !slugsOf(targetFile).has(anchor)) {
        problems.push(`${rel}: missing anchor → ${target}`);
      }
    }
  }
}

(async () => {
  if (checkExternal) {
    for (const url of [...externals].sort()) {
      if (EXTERNAL_ALLOWLIST.has(url)) continue;
      try {
        let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(20000) });
        // some servers reject HEAD outright — always confirm failures with a GET
        if (res.status >= 400) res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000) });
        if (res.status >= 400) problems.push(`external ${res.status} → ${url}`);
      } catch (e) { problems.push(`external unreachable → ${url}`); }
    }
  }
  if (problems.length) {
    console.log(`❌ ${problems.length} broken link(s):`);
    problems.forEach(p => console.log("  " + p));
    process.exit(1);
  }
  console.log(`✅ all links good (${externals.size} external ${checkExternal ? "checked" : "skipped — use --external"})`);
})();
