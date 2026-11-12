// ═══════════════════════════════════════════════════════════════════════════
//  Week 14 homework self-check — the SAME checks I grade with.
//
//  EASIEST WAY — include it like a CDN, exactly like last week. Open
//  Views/Home/Index.cshtml, find the week-13 line, and REPLACE it:
//
//    @section Scripts {
//        <script src="https://jgrissom.github.io/dotnet-web-dev/week-14/homework-checks.js"></script>
//    }
//
//  Then load that page and open the console (F12). NOTHING RUNS ON ITS OWN.
//  Type  recheck()  when you want it to run.
//
//  HOW IT FINDS YOUR WORK: your list page from your navbar, the way it has
//  since week 4, and your API at the same word with /api in front, the way
//  week 13's did. Then it opens your list page out of sight, in this same
//  browser, and clicks a record's  show-related  button, the way you would.
//  List page not in your navbar?  recheck("Trails")  names it.
//
//  ✅  IT ONLY READS. It signs nothing in or out, sends no POST, PUT or DELETE,
//  and creates nothing. Whoever you're signed in as stays signed in. It clicks
//  only your show-related buttons, never a remove button, and answers "no" to
//  any confirm() your page asks.
//
//  ⚠️  IT CANNOT SEE YOUR ADD OR YOUR REMOVE. Both need your role, and this
//  check doesn't hold it. Trying them on your deployed site, signed in as
//  yourself, is a requirement of its own.
//
//  12 of the 20 points are in here. The rest: 5 from your repo (the workflow
//  that deploys, its last run, and the add and remove in your script) and 3
//  from commits.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const WEEK = 14;
  const inBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // One GET, as this browser — so a page shows what it shows you.
  async function send(url, timeoutMs = 45000) {
    try {
      const res = await fetch(url, { redirect: "follow", credentials: "same-origin", signal: AbortSignal.timeout(timeoutMs) });
      return { status: res.status, url: res.url, body: await res.text() };
    } catch {
      return null;
    }
  }

  // Free tier naps: one retry after a pause, so a cold app isn't a false failure.
  async function getWithWakeup(url) {
    const first = await send(url);
    if (first) return first;
    await sleep(15000);
    return await send(url);
  }

  // One API GET, as a program would send it: no cookie, no redirect followed.
  async function ask(url, timeoutMs = 45000) {
    try {
      const res = await fetch(url, {
        headers: { accept: "application/json" }, redirect: "manual", credentials: "omit",
        signal: AbortSignal.timeout(timeoutMs),
      });
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { /* not JSON */ }
      return { status: res.status, type: (res.headers.get("content-type") || "").split(";")[0], text, json };
    } catch {
      return null;
    }
  }

  // ── finding their app ───────────────────────────────────────────────────────

  function navCandidates(html) {
    const out = [];
    for (const m of html.matchAll(/href="\/([A-Za-z]\w*)(?:\/(?:Index)?)?"/gi)) {
      if (/^(home|account)$/i.test(m[1])) continue;
      if (!out.includes(m[1])) out.push(m[1]);
    }
    return out;
  }

  const detailsIds = (html, route) => [...new Set(
    [...html.matchAll(new RegExp(`/${route}/Details/(\\d+)`, "gi"))].map(m => Number(m[1]))
  )];

  const pathOf = (url) => { try { return new URL(url).pathname; } catch { return String(url); } };
  const isSignInUrl = (url) => /\/login\b|\/signin\b/i.test(pathOf(url));
  const isDeniedUrl = (url) => /accessdenied|denied|forbidden/i.test(pathOf(url));

  // Singular or plural is spelling, not behavior: /BallPark may keep its API at
  // /api/BallParks, and /Categories at /api/Category.
  function wordForms(word) {
    const forms = [word];
    if (/ies$/i.test(word)) forms.push(word.slice(0, -3) + "y");
    else if (/s$/i.test(word)) forms.push(word.slice(0, -1));
    else if (/[^aeiou]y$/i.test(word)) forms.push(word.slice(0, -1) + "ies", word + "s");
    else forms.push(word + "s");
    return [...new Set(forms)];
  }

  const prop = (obj, name) => {
    if (!obj || typeof obj !== "object") return undefined;
    const key = Object.keys(obj).find(k => k.toLowerCase() === name.toLowerCase());
    return key === undefined ? undefined : obj[key];
  };

  // Any array inside a record is its related rows, whatever they're called.
  const relatedRows = (record) => Object.entries(record || {}).filter(([, v]) => Array.isArray(v));

  // What a person would read off a related row: its text, not its dates.
  const readable = (row) => Object.values(row || {})
    .filter(v => typeof v === "string" && v.trim().length >= 2 && !/^\d{4}-\d{2}-\d{2}/.test(v))
    .map(v => v.trim().slice(0, 40));

  // The data-id on each record of a page, the hook week 14 asks for.
  const markedIds = (html) => [...new Set(
    [...String(html).matchAll(/\bdata-id\s*=\s*["'](\d+)["']/gi)].map(m => Number(m[1]))
  )];

  // Scripts the page loads from its own site, other than the template's and the libraries.
  const ownScripts = (html) => [...new Set(
    [...String(html).matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map(m => m[1].split("?")[0])
  )].filter(src => src.startsWith("/") && !src.startsWith("//")
    && !/^\/lib\/|^\/_framework\/|\/site\.js$|homework-checks\.js$/i.test(src));

  // ── the stale-checker trap ──────────────────────────────────────────────────
  function staleCheckers(html) {
    const found = new Set();
    for (const m of String(html || "").matchAll(/week-0*(\d+)\/homework-checks\.js/gi)) {
      if (Number(m[1]) !== WEEK) found.add(Number(m[1]));
    }
    return [...found].sort((a, b) => a - b);
  }

  // ── their list page, out of sight, in this browser ─────────────────────────
  //
  // Same site, so their scripts run exactly as they do for a visitor. The frame
  // answers "no" to confirm() and swallows alert(), so nothing can be removed
  // and nothing blocks the run.
  async function openFrame(url) {
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.style.cssText = "position:fixed;left:-12000px;top:0;width:1200px;height:900px;border:0;";
    const loaded = new Promise(resolve => { frame.onload = resolve; });
    frame.src = url;
    document.body.append(frame);
    await Promise.race([loaded, sleep(45000)]);
    await sleep(700);         // DOMContentLoaded handlers, and anything they start
    const win = frame.contentWindow;
    const said = [];
    const broke = [];
    try {
      win.confirm = () => false;
      win.alert = (m) => said.push(String(m));
      win.addEventListener("error", (e) => broke.push(e.message || String(e.error)));
      win.addEventListener("unhandledrejection", (e) => broke.push(String(e.reason && e.reason.message || e.reason)));
      win.__week14Marker = "still here";
    } catch { /* another origin: can't happen for a same-site link */ }
    return { frame, win, doc: frame.contentDocument, said, broke, close: () => frame.remove() };
  }

  const stayed = (f, url) => {
    try { return f.win.__week14Marker === "still here" && pathOf(f.win.location.href) === pathOf(url); }
    catch { return false; }
  };

  async function waitFor(test, ms) {
    const until = Date.now() + ms;
    while (Date.now() < until) {
      try { if (test()) return true; } catch { /* page mid-change */ }
      await sleep(150);
    }
    return false;
  }

  const tally = (checks) => ({
    earned: checks.filter(c => c.pass).reduce((n, c) => n + c.pts, 0),
    possible: checks.reduce((n, c) => n + c.pts, 0),
    green: checks.filter(c => c.pass).length,
    total: checks.length,
  });

  /**
   * Runs every URL-verifiable check against a base URL, IN A BROWSER: two of
   * them click a button on the list page. Shared with the grader, which runs
   * this same function inside Chromium, so students and I run identical logic.
   */
  async function runChecks(baseUrl, forcedRoute, onCheck) {
    const root = String(baseUrl).replace(/\/$/, "");
    const stale = new Set();
    const results = {};

    const CHECKS = [
      // In requirement order, so the first red one is always the next thing to build.
      ["script", 2, "your list page loads a script of your own"],
      ["marked", 2, "every record on your list page carries its id, and your API knows each one"],
      ["related", 5, "a record's related rows appear without leaving the page"],
      ["refused", 3, "when your API answers anything but 200, the page says so instead of breaking"],
    ];

    const set = (key, state, label, o = {}) => {
      if (results[key]) return;
      const [, pts, base] = CHECKS.find(c => c[0] === key);
      results[key] = {
        pass: state === "pass", blocked: state === "blocked", pts,
        label: label || base,
        hint: state === "pass" ? null : o.hint || null,
        todo: state === "pass" ? null : o.todo || null,
      };
    };

    const done = (route) => {
      const checks = CHECKS.map(([key, pts, label]) =>
        results[key] || { pass: false, blocked: true, pts, label, hint: "waiting on an earlier step", todo: null });
      if (onCheck) checks.forEach(onCheck);
      return { route, checks, stale: [...stale], ...tally(checks) };
    };

    // ── their home page ───────────────────────────────────────────────────────
    const home = await getWithWakeup(root + "/");
    if (!home || home.status >= 400) {
      const broke = home && home.status >= 500;
      set("script", "fail", null, {
        hint: broke
          ? `your home page returned a ${home.status} — the app is running, but something in it is throwing.`
          : "your home page didn't even load — nothing else can be checked until it does.",
        todo: broke
          ? "Look at the terminal (or Azure's Log stream) for the real exception."
          : "Start your app (dotnet watch), or check that your deployed URL is right. Your app reads "
            + "the database the moment it starts, so a missing or wrong connection string stops it "
            + "before 'Now listening on:' — read the terminal (or Azure's Log stream).",
      });
      return done(null);
    }
    staleCheckers(home.body).forEach(w => stale.add(w));

    // ── 1. their list page, and the script it loads ──────────────────────────
    const tries = forcedRoute ? [forcedRoute] : navCandidates(home.body);
    let route = null, index = null;
    for (const cand of tries) {
      const page = await getWithWakeup(`${root}/${cand}`);
      if (!page || page.status >= 400 || isSignInUrl(page.url) || isDeniedUrl(page.url)) continue;
      if (detailsIds(page.body, cand).length) { route = cand; index = page; break; }
    }
    if (!route) {
      set("script", "fail", null, {
        hint: "I couldn't find a list page in your navbar that a visitor can open and that links to "
            + "a record's Details page.",
        todo: "If your list page is called something I can't see, run  recheck(\"Trails\")  with YOUR "
            + "controller name.",
      });
      return done(null);
    }
    staleCheckers(index.body).forEach(w => stale.add(w));
    const listUrl = `${root}/${route}`;

    const srcs = ownScripts(index.body);
    const served = [];
    for (const src of srcs) {
      const r = await send(new URL(src, listUrl).toString());
      if (r && r.status === 200 && !/<html[\s>]/i.test(r.body)) served.push({ src, body: r.body });
    }
    const calling = served.filter(s => /\bfetch\s*\(/.test(s.body));
    set("script", calling.length ? "pass" : "fail",
      calling.length ? `your list page loads a script of your own — ${calling.map(s => s.src).join(", ")} on /${route}` : null, {
        hint: !srcs.length ? `/${route} loads no script of its own — only the template's.`
          : !served.length ? `/${route} asks for ${srcs.join(" and ")}, and ${srcs.length === 1 ? "it isn't" : "they aren't"} there. A script has to live in wwwroot to be served.`
          : `/${route} loads ${served.map(s => s.src).join(" and ")}, and none of it calls fetch.`,
        todo: "Requirement 1: create wwwroot/js/list.js, and load it at the bottom of your list page's "
            + "view: @section Scripts { <script src=\"~/js/list.js\"></script> }.",
      });
    if (!calling.length) return done(route);

    // ── 2. every record carries its id, and the API knows it ──────────────────
    const tried = wordForms(route).map(w => `/api/${w}`);
    let api = tried[0], list = null;
    for (const address of tried) {
      const answer = await ask(root + address);
      if (!list) list = answer;
      if (answer && answer.status !== 404) { api = address; list = answer; break; }
    }
    const apiIds = list && Array.isArray(list.json) ? list.json.map(r => prop(r, "id")).filter(i => i !== undefined) : [];
    const marked = markedIds(index.body);
    const linked = detailsIds(index.body, route);
    const unmarked = linked.filter(id => !marked.includes(id));
    const unknown = marked.filter(id => !apiIds.includes(id));
    const markedGood = apiIds.length > 0 && marked.length > 0 && unmarked.length === 0 && unknown.length === 0;
    set("marked", markedGood ? "pass" : "fail",
      markedGood ? `every record on your list page carries its id, and your API knows each one — ${marked.length} on /${route}, all in ${api}` : null, {
        hint: !apiIds.length ? `${api} didn't answer with your records${list ? ` (it said ${list.status})` : ""}, so week 13's API isn't working on this site.`
          : !marked.length ? `no record on /${route} has a data-id, so your script can't tell which one was clicked.`
          : unmarked.length ? `record${unmarked.length === 1 ? "" : "s"} ${unmarked.join(", ")} on /${route} ${unmarked.length === 1 ? "has" : "have"} a Details link and no data-id.`
          : `/${route} marks record${unknown.length === 1 ? "" : "s"} ${unknown.join(", ")}, and ${api} doesn't have ${unknown.length === 1 ? "it" : "them"}.`,
        todo: !apiIds.length
          ? `Week 13's list action has to answer at ${api}. If you renamed it, rename it back.`
          : "Requirement 1: put data-id=\"@item.Id\" on the element that holds each record in your "
            + "list page's loop — the card's column, or the table row.",
      });
    if (!markedGood) return done(route);

    // ── 3. a record's related rows, without leaving the page ──────────────────
    //    An entity with no Include prints an empty list for every record, so
    //    look at several before deciding nothing has related rows.
    let pick = null, emptyArray = null;
    for (const id of marked.slice(0, 8)) {
      const one = await ask(`${root}${api}/${id}`);
      if (!one || !one.json || typeof one.json !== "object" || Array.isArray(one.json)) continue;
      const arrays = relatedRows(one.json);
      if (arrays.length && !emptyArray) emptyArray = arrays[0][0];
      const withRows = arrays.find(([, rows]) => rows.length > 0 && rows.some(r => readable(r).length));
      if (withRows) { pick = { id, name: withRows[0], rows: withRows[1] }; break; }
    }
    if (!pick) {
      const looked = Math.min(marked.length, 8);
      set("related", "fail", null, {
        hint: emptyArray
          ? `I looked at ${looked} record${looked === 1 ? "" : "s"} in ${api}/{id}, and "${emptyArray}" is empty on every one.`
          : `I looked at ${looked} record${looked === 1 ? "" : "s"} in ${api}/{id}, and none has a list of related rows in it.`,
        todo: emptyArray
          ? "If those records show related rows on their own pages, week 13's one-record action has no "
            + "Include, so the API never loads them. If they really have none, add one through your own form."
          : "Week 13's one-record action returns a DTO with a list of related rows in it. That list is "
            + "what show-related draws.",
      });
      return done(route);
    }

    if (!inBrowser) {
      set("related", "blocked", null, { hint: "this check clicks a button, so it only runs in a browser." });
      set("refused", "blocked", null, { hint: "this check clicks a button, so it only runs in a browser." });
      return done(route);
    }

    const f = await openFrame(listUrl);
    const card = f.doc && f.doc.querySelector(`[data-id="${pick.id}"]`);
    const button = card && card.querySelector(".show-related");
    if (!button) {
      f.close();
      set("related", "fail", null, {
        hint: `record ${pick.id} on /${route} has no button with the class show-related inside it.`,
        todo: "Requirement 2: inside the element that carries data-id, a "
            + "<button type=\"button\" class=\"btn btn-link px-0 show-related\">…</button>.",
      });
      return done(route);
    }

    const wanted = pick.rows.slice(0, 5).map(readable).filter(r => r.length);
    const before = card.innerText;
    const shown = () => wanted.filter(texts => texts.some(t => card.innerText.includes(t) && !before.includes(t))).length;
    button.click();
    await waitFor(() => shown() === wanted.length, 6000);
    const found = shown();
    const relatedGood = found === wanted.length && stayed(f, listUrl) && !f.broke.length;
    set("related", relatedGood ? "pass" : "fail",
      relatedGood ? `a record's related rows appear without leaving the page — record ${pick.id}, ${wanted.length} of its "${pick.name}" shown` : null, {
        hint: !stayed(f, listUrl) ? "clicking show-related reloaded the page or left it. The click should only fetch."
          : f.broke.length ? `clicking show-related threw: ${f.broke[0]}`
          : found ? `clicking show-related on record ${pick.id} showed ${found} of the ${wanted.length} "${pick.name}" ${api}/${pick.id} has.`
          : `I clicked show-related on record ${pick.id} and waited 6 seconds, and none of its "${pick.name}" appeared inside that record's element.`,
        todo: "Requirement 2: the click fetches " + `${api}/` + "${id}, and for each related row adds an "
            + "item with its text inside the same record's element. Open F12 → Console on your list "
            + "page and click it yourself: a red error there is the line to fix.",
      });
    f.close();
    if (!relatedGood) return done(route);

    // ── 4. an answer that isn't 200 ───────────────────────────────────────────
    //    The frame's fetch is swapped for one that answers 404, the way the
    //    API does for a record someone else just removed. Nothing is sent.
    const g = await openFrame(listUrl);
    const card2 = g.doc && g.doc.querySelector(`[data-id="${pick.id}"]`);
    const button2 = card2 && card2.querySelector(".show-related");
    try {
      g.win.fetch = () => Promise.resolve(new g.win.Response(
        JSON.stringify({ type: "https://tools.ietf.org/html/rfc9110#section-15.5.5", title: "Not Found", status: 404 }),
        { status: 404, headers: { "Content-Type": "application/problem+json" } }));
    } catch { /* checked below */ }
    const before2 = card2 ? card2.innerText : "";
    if (button2) button2.click();
    await waitFor(() => card2.innerText !== before2 || g.said.length || g.broke.length, 4000);
    await sleep(300);
    const after2 = card2 ? card2.innerText : "";
    const nonsense = /undefined|\[object Object\]|NaN/.test(after2.replace(before2, ""));
    const showedRows = wanted.some(texts => texts.some(t => after2.includes(t) && !before2.includes(t)));
    const spoke = after2 !== before2 || g.said.length > 0;
    const refusedGood = !!button2 && !g.broke.length && spoke && !nonsense && !showedRows && stayed(g, listUrl);
    set("refused", refusedGood ? "pass" : "fail",
      refusedGood ? `when your API answers anything but 200, the page says so instead of breaking — a 404 for record ${pick.id} shows "${(g.said[0] || after2.replace(before2, "")).trim().slice(0, 60)}"` : null, {
        hint: g.broke.length ? `given a 404, the click threw: ${g.broke[0]}`
          : nonsense ? `given a 404, the page showed "${after2.replace(before2, "").trim().slice(0, 80)}".`
          : !spoke ? "given a 404, the click changed nothing on the page, so a visitor can't tell it failed."
          : "given a 404, the page didn't stay put.",
        todo: "Requirement 2: read response.status before anything else. If it isn't 200, put a message "
            + "where the related rows would go and stop (return) — don't call .json() and use what it gives you.",
      });
    g.close();
    return done(route);
  }

  // Printed above the score, because a stale checker makes the score itself suspect.
  const staleWarning = (stale) => stale && stale.length
    ? `Week ${stale.join(" and ")}'s self-check script is STILL installed in your app. It PASSES — `
      + `nothing this week breaks last week's requirements — so it prints a reassuring report about `
      + `the wrong week. The tell is the first line: it should say Week ${WEEK}. Delete the old `
      + `<script> tag; this week's line REPLACES it.`
    : null;

  const BY_HAND = [
    "2 pts — a workflow in .github/workflows that deploys your app to Azure on every push to main",
    "1 pt — its last run on main succeeded",
    "2 pts — your list page's script adds a record (POST) and removes one (DELETE) through your API",
    "3 pts — 3+ meaningful commits, pushed to a public repo",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  const CANT_SEE_ADMIN = "This check can't see your add or your remove: both need your role, which it "
    + "doesn't hold. Sign in as yourself on your deployed site and do both — add one, watch it appear, "
    + "remove it, watch it go. That's the homework's last requirement, and it's yours to do.";

  const WHERE_THE_POINTS_ARE =
    "12 of the 20 points are in this script — everything a visitor's browser can see. The other 8 are "
    + "in your repo and on GitHub.";

  const JUST_READS = "It only read: nothing was sent but GETs, and you're still signed in as whoever you were.";

  // ── Node: export for the grader, and support `node homework-checks.js <url>` ──
  //
  // Two checks click a button, so Node runs this same file inside Chromium. It
  // needs playwright-core and a Chromium. The grader README says how to get both.
  function loadPlaywright() {
    const os = require("os"), path = require("path");
    const places = [
      process.env.PLAYWRIGHT_CORE,
      path.join(os.homedir(), ".cache", "dotnet-web-grading", "node_modules", "playwright-core"),
      "playwright-core",
      "playwright",
    ].filter(Boolean);
    for (const p of places) {
      try { return require(p); } catch { /* next */ }
    }
    throw new Error("playwright-core isn't installed. Once: npm install --prefix ~/.cache/dotnet-web-grading playwright-core");
  }

  async function runInChromium(url, forcedRoute) {
    const { chromium } = loadPlaywright();
    let browser;
    try { browser = await chromium.launch(); }
    catch { browser = await chromium.launch({ channel: "chrome" }); }
    try {
      const page = await browser.newPage();
      await page.goto(String(url).replace(/\/$/, "") + "/", { timeout: 90000 }).catch(() => {});
      await page.addScriptTag({ path: __filename });
      return await page.evaluate(
        ([origin, route]) => window.__week14.runChecks(origin, route),
        [new URL(page.url()).origin, forcedRoute || null]);
    } finally {
      await browser.close();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { runChecks, runInChromium, staleWarning };
  }

  const isNodeCli =
    typeof process !== "undefined" && process.versions && process.versions.node &&
    typeof require !== "undefined" && typeof module !== "undefined" && require.main === module;

  if (isNodeCli) {
    const url = process.argv[2];
    const routeIdx = process.argv.indexOf("--route");
    const forced = routeIdx > -1 ? process.argv[routeIdx + 1] : null;

    if (!url) {
      console.log("usage: node homework-checks.js <url> [--route YourControllerName]");
      console.log("  e.g. node homework-checks.js http://localhost:5199");
      process.exit(1);
    }

    (async () => {
      console.log(`\n🔎 Week ${WEEK} self-check — ${url}`);
      console.log("   (a sleeping free-tier app can take ~30s for the first check; this runs in Chromium)\n");
      const res = await runInChromium(url, forced);
      for (const c of res.checks) {
        console.log(`${c.pass ? "✅" : c.blocked ? "⬜" : "❌"} ${String(c.pts).padStart(2)} pts  ${c.label}`);
        if (c.hint) console.log(`         ↳ ${c.hint}`);
      }
      const { earned, possible, green, total, route } = res;
      const oldOne = staleWarning(res.stale);
      if (oldOne) console.log(`\n🚨 ${oldOne}`);
      console.log(`\n📋 ${green} of ${total} checks green · ${earned} of ${possible} points${route ? `  (controller: /${route})` : ""}`);

      const next = res.checks.find(c => !c.pass && !c.blocked && c.todo)
                || res.checks.find(c => !c.pass && c.todo);
      if (next) console.log(`\n👉 Next: ${next.todo}`);
      else if (isLocal(url)) console.log("\n⚠️  That was localhost. Run it again on your Azure URL — the deployed one is what I grade.");
      else console.log("\n🎉 Your list page talks to your API, and a refusal doesn't break it.");

      console.log(`\n🔑 ${CANT_SEE_ADMIN}`);
      console.log(`\nℹ️  ${WHERE_THE_POINTS_ARE}`);
      console.log("\nThe other 8 points I check in your repo:");
      BY_HAND.forEach(l => console.log("   • " + l));
      console.log("\nSubmit your Azure URL + repo URL via Canvas.\n");
      process.exit(green === total ? 0 : 1);
    })().catch((e) => { console.error(e.message); process.exit(2); });
  }

  // ── Browser: <script src> on your own site ──────────────────────────────────
  if (inBrowser) {
    window.__week14 = { runChecks };
    const bold = "font-weight: bold";
    const big = `${bold}; font-size: 1.1em`;

    const printCheck = (c) => {
      const mark = c.pass ? "✅" : c.blocked ? "⬜" : "❌";
      const color = c.pass ? "color: green" : c.blocked ? "color: gray" : "color: crimson";
      console.log(`%c${mark} ${c.pts} pts  ${c.label}`, color);
      if (c.hint) console.log(`      ↳ ${c.hint}`);
    };

    const report = (res) => {
      const { earned, possible, green, total, route } = res;
      const oldOne = staleWarning(res.stale);
      if (oldOne) console.log(`%c🚨 ${oldOne}`, `${bold}; color: crimson`);
      console.log(`%c📋 ${green} of ${total} checks green · ${earned} of ${possible} points${route ? `  (controller: /${route})` : ""}`, big);

      const next = res.checks.find(c => !c.pass && !c.blocked && c.todo)
                || res.checks.find(c => !c.pass && c.todo);
      if (next) {
        console.log(`%c👉 Next: ${next.todo}`, `${bold}; color: #79c0ff`);
        console.log("Fix that, then type  recheck()  again.");
      } else if (isLocal(window.location.origin)) {
        console.log("%c⚠️  This is localhost. Run it again on your Azure URL — the deployed one is what I grade.", `${bold}; color: #d29922`);
      } else {
        console.log("%c🎉 Your list page talks to your API, and a refusal doesn't break it.", `${bold}; color: green`);
      }

      console.log(`%c🔑 ${CANT_SEE_ADMIN}`, "color: #d29922");
      console.log(`%c✅ ${JUST_READS}`, "color: #79c0ff");
      console.log(`%cℹ️  ${WHERE_THE_POINTS_ARE}`, "color: #79c0ff");
      console.log("%cThe other 8 points I check in your repo:", bold);
      BY_HAND.forEach(l => console.log("   • " + l.trim()));
      console.log("%cType  recheck()  to run again — or  recheck(\"Trails\")  with your controller name.", "color: #79c0ff");
    };

    const run = (forcedRoute) => {
      console.log(`%c🔎 Week ${WEEK} self-check — ${window.location.origin}`, big);
      console.log("Results appear when the run finishes — a sleeping free-tier app can take ~30s.");
      console.log("%cIt opens your list page out of sight and clicks one show-related button. It only reads.", "color: #79c0ff");
      if (forcedRoute) console.log(`Checking /${forcedRoute} directly (you told me where to look).`);
      return runChecks(window.location.origin, forcedRoute || null, printCheck).then(report);
    };

    // Nothing runs on load: the week-13 habit, and it keeps a page load quiet.
    window.recheck = (forcedRoute) => run(forcedRoute);

    // In Chromium for the grader, window.__week14 is all that's wanted.
    if (!window.__week14Grading) {
      console.log(`%c🔎 Week ${WEEK} self-check is loaded — but it hasn't run.`, big);
      console.log("%cType  recheck()  to check your work. It only reads: nothing is sent but GETs.", "color: #79c0ff");
      console.log("%cList page not in your navbar?  recheck(\"Trails\")  with your own word.", "color: #79c0ff");
    }
  }
})();
