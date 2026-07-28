// ═══════════════════════════════════════════════════════════════════════════
//  Week 3 homework self-check — the SAME checks I grade your DEPLOYED app with.
//
//  `dotnet test` proves your CODE works. This proves your DEPLOYED SITE works,
//  which is a different question and worth 6 of the 20 points.
//
//  EASIEST WAY — include it like a CDN, exactly like Bootstrap in week 2.
//  Add this at the bottom of Views/Home/Index.cshtml:
//
//    <script src="https://jgrissom.github.io/dotnet-web-dev/week-03/homework-checks.js"></script>
//
//  Then load that page and open the console (F12). It runs automatically, so
//  every refresh re-checks your work. Type  recheck()  to run it again.
//
//  Run it on your AZURE URL before you submit — that's the one I grade.
//  Leave the tag in or take it out; it only writes to the console.
//
//  (Have Node installed? `node homework-checks.js <url>` works too.)
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  // The four deployed routes, worth 6 of the 20 points. The grader imports this
  // very list, so what you see here is exactly what I run.
  const ROUTES = [
    { path: "/",                     expect: "First Flight",     pts: 2,
      label: "home page is branded First Flight",
      todo: 'Put "First Flight" in the navbar brand in _Layout.cshtml and the heading on Views/Home/Index.cshtml.' },
    { path: "/Home/About",           expect: "About",            pts: 2,
      label: "/Home/About loads",
      todo: "Add an About action to HomeController AND Views/Home/About.cshtml with an About heading." },
    { path: "/Home/Hello?name=Ada",  expect: "Hello, Ada!",      pts: 1,
      label: "/Home/Hello?name=Ada greets by name",
      todo: 'Add a Hello action that reads the name parameter and returns Content($"Hello, {name}!").' },
    { path: "/Home/Hello",           expect: "Hello, stranger!", pts: 1,
      label: "/Home/Hello defaults to stranger",
      todo: 'Make the parameter nullable and default it: name ?? "stranger".' },
  ];

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

  const tally = (checks) => ({
    earned: checks.filter(c => c.pass).reduce((n, c) => n + c.pts, 0),
    possible: checks.reduce((n, c) => n + c.pts, 0),
    green: checks.filter(c => c.pass).length,
    total: checks.length,
  });

  /**
   * Checks the deployed routes. Returns
   * { checks: [{label, pass, pts, hint, todo}], earned, possible, green, total }
   * Shared with the grader so students and I run identical logic.
   */
  async function runChecks(baseUrl, _unused, onCheck) {
    const root = String(baseUrl).replace(/\/$/, "");
    const checks = [];
    let reachable = true;

    for (const r of ROUTES) {
      const res = reachable ? await getWithWakeup(root + r.path) : null;
      if (res === null && r.path === "/") reachable = false;

      const pass = !!res && res.status < 400 && res.body.includes(r.expect);
      const c = {
        pass,
        blocked: !reachable && r.path !== "/",
        pts: r.pts,
        label: r.label,
        hint: pass ? null
          : !res ? "the site didn't respond at all."
          : res.status >= 400 ? `got ${res.status} — the page isn't there.`
          : `the page loaded, but I couldn't find "${r.expect}" on it.`,
        todo: pass ? null
          : !reachable ? "Start your app, or check that the URL you're testing is right."
          : r.todo,
      };
      checks.push(c);
      if (onCheck) onCheck(c);
    }

    return { checks, ...tally(checks) };
  }

  const ALSO = [
    "10 pts — dotnet test FirstFlight.Checks showing 6/6 in your repo",
    "4 pts  — a public repo with 3+ meaningful commits",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  // ── Node: export for the grader, and support `node homework-checks.js <url>` ──
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { runChecks, ROUTES };
  }

  const isNodeCli =
    typeof process !== "undefined" && process.versions && process.versions.node &&
    typeof require !== "undefined" && typeof module !== "undefined" && require.main === module;

  if (isNodeCli) {
    const url = process.argv[2];
    if (!url) {
      console.log("usage: node homework-checks.js <url>");
      console.log("  e.g. node homework-checks.js https://ff-web-xx1234.azurewebsites.net");
      process.exit(1);
    }
    (async () => {
      console.log(`\n🔎 Week 3 deployed check — ${url}`);
      console.log("   (a sleeping free-tier app can take ~30s for the first check)\n");
      const res = await runChecks(url, null, (c) => {
        console.log(`${c.pass ? "✅" : c.blocked ? "⬜" : "❌"} ${String(c.pts).padStart(2)} pts  ${c.label}`);
        if (c.hint) console.log(`         ↳ ${c.hint}`);
      });
      console.log(`\n📋 ${res.green} of ${res.total} checks green · ${res.earned} of ${res.possible} deployed points`);
      const next = res.checks.find(c => !c.pass && c.todo);
      if (next) console.log(`\n👉 Next: ${next.todo}`);
      else if (isLocal(url)) console.log("\n⚠️  That was localhost. Run it again on your Azure URL — the deployed one is what I grade.");
      else console.log("\n🎉 Your deployed site passes everything I check from a URL.");
      console.log("\nThe other 14 points:");
      ALSO.forEach(l => console.log("   • " + l));
      console.log("\nSubmit your Azure URL + repo URL via Canvas.\n");
      process.exit(res.green === res.total ? 0 : 1);
    })();
  }

  // ── Browser: <script src> on your own site, or pasted into the console ───────
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const bold = "font-weight: bold";
    const big = `${bold}; font-size: 1.1em`;

    const printCheck = (c) => {
      const mark = c.pass ? "✅" : c.blocked ? "⬜" : "❌";
      const color = c.pass ? "color: green" : c.blocked ? "color: gray" : "color: crimson";
      console.log(`%c${mark} ${c.pts} pts  ${c.label}`, color);
      if (c.hint) console.log(`      ↳ ${c.hint}`);
    };

    const report = (res) => {
      console.log(`%c📋 ${res.green} of ${res.total} checks green · ${res.earned} of ${res.possible} deployed points`, big);
      const next = res.checks.find(c => !c.pass && c.todo);
      if (next) {
        console.log(`%c👉 Next: ${next.todo}`, `${bold}; color: #79c0ff`);
        console.log("Fix that, refresh this page, and the checks run again.");
      } else if (isLocal(window.location.origin)) {
        console.log("%c⚠️  This is localhost. Run it again on your Azure URL — the deployed one is what I grade.", `${bold}; color: #d29922`);
      } else {
        console.log("%c🎉 Your deployed site passes everything I check from a URL.", `${bold}; color: green`);
      }
      console.log("%cThe other 14 points:", bold);
      ALSO.forEach(l => console.log("   • " + l));
      console.log("%cType  recheck()  to run these again without reloading.", "color: #79c0ff");
    };

    const run = () => {
      console.log(`%c🔎 Week 3 deployed check — ${window.location.origin}`, big);
      console.log("Results appear as each check finishes — a sleeping free-tier app can take ~30s for the first one.");
      return runChecks(window.location.origin, null, printCheck).then(report);
    };

    window.recheck = run;
    run();
  }
})();
