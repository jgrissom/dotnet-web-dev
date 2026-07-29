// ═══════════════════════════════════════════════════════════════════════════
//  Week 3 homework self-check — the SAME checks I grade your DEPLOYED app with.
//
//  16 of the 20 points are in here. `dotnet test` tells you your CODE works;
//  this tells you your DEPLOYED SITE works, and the deployed site is the grade.
//
//  EASIEST WAY — include it like a CDN, exactly like Bootstrap in week 2.
//  Add this at the bottom of Views/Home/Index.cshtml:
//
//    <script src="https://jgrissom.github.io/dotnet-web-dev/week-03/homework-checks.js"></script>
//
//  Then load that page and open the console (F12). It runs automatically, so
//  every refresh re-checks your work. Type  recheck()  to run it again.
//
//  It checks whatever site it's loaded on, so it works on localhost while you
//  build AND on your deployed app. Run it on your AZURE URL before you submit —
//  that's the one I grade. Leave the tag in or take it out; it only writes to
//  the console and doesn't affect grading.
//
//  (Have Node installed? `node homework-checks.js <url>` works too.)
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  // The graded checks, worth 16 of the 20 points. The grader imports this very
  // list, so what you see here is exactly what I run. Each one is the deployed
  // twin of a check in FirstFlight.Checks — if `dotnet test` is 6/6 and your
  // deploy is good, these are all green.
  const CHECKS = [
    { path: "/", pts: 3,
      label: "home page is branded First Flight",
      looksFor: '"First Flight" on the page',
      test: (body) => body.includes("First Flight"),
      todo: 'Put "First Flight" in the navbar brand in _Layout.cshtml and the heading on Views/Home/Index.cshtml.' },

    { path: "/Home/About", pts: 4,
      label: "/Home/About loads",
      looksFor: '"About" on the page',
      test: (body) => body.includes("About"),
      todo: "Add an About action to HomeController AND Views/Home/About.cshtml with an About heading." },

    { path: "/", pts: 2,
      label: "About is in the navbar",
      looksFor: 'a link to /Home/About',
      // URLs are case-insensitive, so /home/about is just as correct
      test: (body) => /\/Home\/About/i.test(body),
      todo: "Copy the Privacy <li> in Views/Shared/_Layout.cshtml and point it at About." },

    { path: "/Home/Hello?name=Ada", pts: 4,
      label: "/Home/Hello?name=Ada greets by name",
      looksFor: '"Hello, Ada!"',
      test: (body) => body.includes("Hello, Ada!"),
      todo: 'Add a Hello action that reads the name parameter and returns Content($"Hello, {name}!").' },

    { path: "/Home/Hello", pts: 3,
      label: "/Home/Hello defaults to stranger",
      looksFor: '"Hello, stranger!"',
      test: (body) => body.includes("Hello, stranger!"),
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
   * { checks: [{label, pass, blocked, pts, hint, todo}], earned, possible, green, total }
   * `blocked` = couldn't be judged because the site never answered — not a wrong
   * answer, just no answer. Shared with the grader so students and I run
   * identical logic.
   */
  async function runChecks(baseUrl, _unused, onCheck) {
    const root = String(baseUrl).replace(/\/$/, "");
    const checks = [];
    const seen = new Map();          // "/" is used by two checks — fetch it once
    let reachable = true;

    for (const chk of CHECKS) {
      let res = null;
      if (reachable) {
        if (!seen.has(chk.path)) seen.set(chk.path, await getWithWakeup(root + chk.path));
        res = seen.get(chk.path);
        if (res === null && chk.path === "/") reachable = false;
      }

      const pass = !!res && res.status < 400 && chk.test(res.body);
      const c = {
        pass,
        blocked: !reachable && chk.path !== "/",
        pts: chk.pts,
        label: chk.label,
        hint: pass ? null
          : !res ? "the site didn't respond at all."
          : res.status >= 400 ? `got ${res.status} — the page isn't there.`
          : `the page loaded, but I couldn't find ${chk.looksFor} on it.`,
        todo: pass ? null
          : !reachable ? "Start your app, or check that the URL you're testing is right."
          : chk.todo,
      };
      checks.push(c);
      if (onCheck) onCheck(c);
    }

    return { checks, ...tally(checks) };
  }

  const BY_HAND = [
    "4 pts — a public repo with 3+ meaningful commits",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  // ── Node: export for the grader, and support `node homework-checks.js <url>` ──
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { runChecks, CHECKS };
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
      console.log(`\n🔎 Week 3 self-check — ${url}`);
      console.log("   (a sleeping free-tier app can take ~30s for the first check)\n");
      const res = await runChecks(url, null, (c) => {
        console.log(`${c.pass ? "✅" : c.blocked ? "⬜" : "❌"} ${String(c.pts).padStart(2)} pts  ${c.label}`);
        if (c.hint) console.log(`         ↳ ${c.hint}`);
      });
      console.log(`\n📋 ${res.green} of ${res.total} checks green · ${res.earned} of ${res.possible} points`);
      const next = res.checks.find(c => !c.pass && c.todo);
      if (next) console.log(`\n👉 Next: ${next.todo}`);
      else if (isLocal(url)) console.log("\n⚠️  That was localhost. Run it again on your Azure URL — the deployed one is what I grade.");
      else console.log("\n🎉 Everything I can check from a URL passes on your deployed site.");
      console.log("\nThe last 4 points I check by hand:");
      BY_HAND.forEach(l => console.log("   • " + l));
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
      console.log(`%c📋 ${res.green} of ${res.total} checks green · ${res.earned} of ${res.possible} points`, big);
      const next = res.checks.find(c => !c.pass && c.todo);
      if (next) {
        console.log(`%c👉 Next: ${next.todo}`, `${bold}; color: #79c0ff`);
        console.log("Fix that, refresh this page, and the checks run again.");
      } else if (isLocal(window.location.origin)) {
        console.log("%c⚠️  This is localhost. Run it again on your Azure URL — the deployed one is what I grade.", `${bold}; color: #d29922`);
      } else {
        console.log("%c🎉 Everything I can check from a URL passes on your deployed site.", `${bold}; color: green`);
      }
      console.log("%cThe last 4 points I check by hand:", bold);
      BY_HAND.forEach(l => console.log("   • " + l));
      console.log("%cType  recheck()  to run these again without reloading.", "color: #79c0ff");
    };

    const run = () => {
      console.log(`%c🔎 Week 3 self-check — ${window.location.origin}`, big);
      console.log("Results appear as each check finishes — a sleeping free-tier app can take ~30s for the first one.");
      return runChecks(window.location.origin, null, printCheck).then(report);
    };

    window.recheck = run;   // re-run from the console without reloading
    run();
  }
})();
