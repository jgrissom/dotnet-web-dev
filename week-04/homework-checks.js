// ═══════════════════════════════════════════════════════════════════════════
//  Week 4 homework self-check — the SAME checks I grade with.
//
//  EASIEST WAY (no installs — just like weeks 1 and 2):
//    1. Open YOUR site in the browser (localhost while you build, or your
//       deployed Azure URL before you submit)
//    2. F12 → Console
//    3. Paste this whole file, press Enter
//
//  It checks whatever site the console is open on. Run it on your DEPLOYED
//  site before submitting — that's the one I grade.
//
//  (Have Node installed? `node homework-checks.js <url>` works too.)
//
//  Your topic is your own, so nothing here is hard-coded: the script finds
//  your controller the same way a visitor would — by following the link you
//  put in the navbar. If it can't find that link, neither can I.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const BAD_ID = 999999;

  async function get(url, timeoutMs = 45000) {
    try {
      const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(timeoutMs) });
      return { status: res.status, body: await res.text() };
    } catch {
      return null;
    }
  }

  // Free tier naps: one retry after a pause, so a cold app isn't a false failure.
  async function getWithWakeup(url) {
    const first = await get(url);
    if (first) return first;
    await new Promise(r => setTimeout(r, 15000));
    return await get(url);
  }

  // Nav links that point at a controller: href="/Something" — anything but Home.
  function navCandidates(html) {
    const out = [];
    for (const m of html.matchAll(/href="\/([A-Za-z]\w*)\/?"/g)) {
      if (/^home$/i.test(m[1])) continue;
      if (!out.includes(m[1])) out.push(m[1]);
    }
    return out;
  }

  const detailsLinks = (html, route) =>
    [...new Set([...html.matchAll(new RegExp(`/${route}/Details/(\\d+)`, "gi"))].map(m => m[0]))];

  function tally(checks) {
    return {
      earned: checks.filter(c => c.pass).reduce((n, c) => n + c.pts, 0),
      possible: checks.reduce((n, c) => n + c.pts, 0),
    };
  }

  /**
   * Runs every URL-verifiable check against a base URL.
   * Returns { route, checks: [{label, pass, pts, hint}], earned, possible }
   * Shared with the grader so students and I run identical logic.
   */
  async function runChecks(baseUrl, forcedRoute) {
    const root = String(baseUrl).replace(/\/$/, "");
    const checks = [];
    const add = (pass, pts, label, hint) => checks.push({ pass, pts, label, hint: pass ? null : hint });

    const home = await getWithWakeup(root + "/");
    if (!home || home.status >= 400) {
      add(false, 2, "nav link to your index page", "your home page didn't load at all — is the app running / deployed?");
      add(false, 4, "index page lists all your items", "can't get there until the home page loads");
      add(false, 4, "details page shows one item", "can't get there until the home page loads");
      add(false, 2, "a bad id returns 404", "can't get there until the home page loads");
      return { route: null, checks, ...tally(checks) };
    }

    const tries = forcedRoute ? [forcedRoute] : navCandidates(home.body);
    let route = null, links = [];
    for (const cand of tries) {
      const page = await getWithWakeup(`${root}/${cand}`);
      if (!page || page.status >= 400) continue;
      const found = detailsLinks(page.body, cand);
      if (found.length) { route = cand; links = found; break; }
      if (!route) route = cand;                       // reachable, but no detail links yet
    }

    add(!!route, 2, `nav link to your index page${route ? ` — found /${route}` : ""}`,
      "no working link to your controller in the navbar. Copy the Privacy <li> in _Layout.cshtml and adapt it.");

    if (!route) {
      add(false, 4, "index page lists all your items", "can't find your index page without that nav link");
      add(false, 4, "details page shows one item", "can't find your index page without that nav link");
      add(false, 2, "a bad id returns 404", "can't find your index page without that nav link");
      return { route: null, checks, ...tally(checks) };
    }

    add(links.length >= 5, 4, `index lists all your items — ${links.length} detail link${links.length === 1 ? "" : "s"} found`,
      `I count your items by their Details links. Need 5+: seed at least 5 items and give each row a link like href="/${route}/Details/@item.Id".`);

    if (!links.length) {
      add(false, 4, "details page shows one item", "no Details links on your index page to follow");
      add(false, 2, "a bad id returns 404", "no Details links on your index page to follow");
      return { route, checks, ...tally(checks) };
    }

    const detail = await getWithWakeup(root + links[0]);
    const okDetail = detail && detail.status < 400;
    const stillAList = okDetail && detailsLinks(detail.body, route).length >= links.length;
    add(okDetail && !stillAList, 4, `details page shows one item — ${links[0]}`,
      stillAList
        ? "that page still lists everything. Your Details action should pass ONE item to the view, not the whole list."
        : "that link didn't load. Does your Details action exist, and is there a Details.cshtml for it?");

    const bad = await getWithWakeup(`${root}/${route}/Details/${BAD_ID}`);
    add(bad && bad.status === 404, 2, `a bad id returns 404 — got ${bad ? bad.status : "no response"}`,
      "use FirstOrDefault, then `if (item == null) return NotFound();` before returning the view.");

    return { route, checks, ...tally(checks) };
  }

  const BY_HAND = [
    "4 pts — model with 4+ properties (an int Id, plus at least one non-string) and 5+ seeded items",
    "4 pts — 3+ meaningful commits, pushed to a public repo",
  ];

  // ── Node: export for the grader, and support `node homework-checks.js <url>` ──
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { runChecks, BAD_ID };
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
      console.log("       node homework-checks.js https://my-app.azurewebsites.net");
      process.exit(1);
    }

    (async () => {
      console.log(`\n🔎 Checking ${url}\n`);
      const { checks, earned, possible, route } = await runChecks(url, forced);
      for (const c of checks) {
        console.log(`${c.pass ? "✅" : "❌"} ${String(c.pts).padStart(2)} pts  ${c.label}`);
        if (c.hint) console.log(`         ↳ ${c.hint}`);
      }
      console.log(`\n${earned === possible ? "🎉" : "📊"} ${earned} / ${possible} automated points${route ? `  (controller: /${route})` : ""}`);
      console.log(earned === possible
        ? "\nEverything I can check from a URL passes. Two things I check by hand — confirm them yourself:"
        : "\nFix the ❌ above, then run this again. Also check by hand:");
      BY_HAND.forEach(l => console.log("   • " + l));
      console.log("\nSubmit your Azure URL + repo URL via Canvas.\n");
      process.exit(earned === possible ? 0 : 1);
    })();
  }

  // ── Browser: paste into the console on your own site ─────────────────────────
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const bold = "font-weight: bold";
    console.log(`%c🔎 Week 4 self-check — ${window.location.origin}`, "font-weight: bold; font-size: 1.1em");
    console.log("Heads up: a red 404 line will appear partway through. That's expected — one of the checks asks for a bad id on purpose.");
    runChecks(window.location.origin).then(({ checks, earned, possible, route }) => {
      for (const c of checks) {
        console.log(`%c${c.pass ? "✅" : "❌"} ${c.pts} pts  ${c.label}`, c.pass ? "color: green" : "color: crimson");
        if (c.hint) console.log(`      ↳ ${c.hint}`);
      }
      console.log(`%c${earned === possible ? "🎉" : "📊"} ${earned} / ${possible} automated points${route ? `  (controller: /${route})` : ""}`,
        `${bold}; font-size: 1.1em`);
      console.log(`%c${earned === possible
        ? "Everything I can check from a URL passes. Two things I check by hand:"
        : "Fix the ❌ above and run it again. Also check by hand:"}`, bold);
      BY_HAND.forEach(l => console.log("   • " + l.trim()));
      console.log("%cRun this on your DEPLOYED site before you submit.", bold);
    });
  }
})();
