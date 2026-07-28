// ═══════════════════════════════════════════════════════════════════════════
//  Week 4 homework self-check — the SAME checks I grade with.
//
//  EASIEST WAY — include it like a CDN, exactly like Bootstrap in week 2.
//  Add this at the bottom of YOUR index view (e.g. Views/Trails/Index.cshtml):
//
//    <script src="https://jgrissom.github.io/dotnet-web-dev/week-04/homework-checks.js"></script>
//
//  Then load that page and open the console (F12). It runs automatically, so
//  every refresh re-checks your work — the same red-to-green loop as the lab.
//  Type  recheck()  to run it again without reloading.
//
//  It checks whatever site it's loaded on, so it works on localhost while you
//  build AND on your deployed app. Leave the tag in or take it out; it only
//  writes to the console and doesn't affect grading.
//
//  (Have Node installed? `node homework-checks.js <url>` works too.)
//
//  Your topic is your own, so nothing here is hard-coded: it finds your
//  controller the same way a visitor would — by following the link you put in
//  the navbar. If it can't find that link, neither can I.
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

  // Nav links that point at a controller. Tag helpers render "/Trails", but a
  // hand-written link is often "/Trails/Index" — accept both, and never Home.
  function navCandidates(html) {
    const out = [];
    for (const m of html.matchAll(/href="\/([A-Za-z]\w*)(?:\/(?:Index)?)?"/gi)) {
      if (/^home$/i.test(m[1])) continue;
      if (!out.includes(m[1])) out.push(m[1]);
    }
    return out;
  }

  const detailsLinks = (html, route) =>
    [...new Set([...html.matchAll(new RegExp(`/${route}/Details/(\\d+)`, "gi"))].map(m => m[0]))];

  const tally = (checks) => ({
    earned: checks.filter(c => c.pass).reduce((n, c) => n + c.pts, 0),
    possible: checks.reduce((n, c) => n + c.pts, 0),
    green: checks.filter(c => c.pass).length,
    total: checks.length,
  });

  /**
   * Runs every URL-verifiable check against a base URL.
   * Returns { route, checks: [{label, pass, pts, hint, blocked, todo}], earned, possible, green, total }
   * `blocked` = couldn't be judged yet because an earlier step isn't done — not the
   * student's failure, just not their turn. `todo` is the single next action.
   * Shared with the grader so students and I run identical logic.
   */
  async function runChecks(baseUrl, forcedRoute, onCheck) {
    const root = String(baseUrl).replace(/\/$/, "");
    const checks = [];
    const add = (state, pts, label, opts = {}) => {
      const c = {
        pass: state === "pass",
        blocked: state === "blocked",
        pts, label,
        hint: state === "pass" ? null : opts.hint || null,
        todo: state === "pass" ? null : opts.todo || null,
      };
      checks.push(c);
      if (onCheck) onCheck(c);          // report as we go — a sleeping app is slow
      return c;
    };

    const home = await getWithWakeup(root + "/");
    if (!home || home.status >= 400) {
      add("fail", 2, "nav link to your index page", {
        hint: "your home page didn't even load — nothing else can be checked until it does.",
        todo: "Start your app (dotnet watch), or check that your deployed URL is right.",
      });
      ["index lists all your items", "details page shows one item", "a bad id returns 404"]
        .forEach((l, i) => add("blocked", [4, 4, 2][i], l, { hint: "waiting on the home page" }));
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

    add(route ? "pass" : "fail", 2,
      `nav link to your index page${route ? ` — found /${route}` : ""}`, {
        hint: "I couldn't find a link in your navbar that reaches a controller of yours.",
        todo: 'Copy the Privacy <li> in Views/Shared/_Layout.cshtml and point it at your controller.',
      });

    if (!route) {
      ["index lists all your items", "details page shows one item", "a bad id returns 404"]
        .forEach((l, i) => add("blocked", [4, 4, 2][i], l, { hint: "waiting on that nav link" }));
      return { route: null, checks, ...tally(checks) };
    }

    add(links.length >= 5 ? "pass" : "fail", 4,
      `index lists all your items — ${links.length} found`, {
        hint: `I count your items by the Details link on each row, and found ${links.length}. You need 5 or more.`,
        todo: `Seed at least 5 items, and give every row a link: href="/${route}/Details/@item.Id"`,
      });

    // No links on the index? Don't block the rest — probe the conventional URL so
    // Details and the 404 guard are still judged on their own merits.
    const probe = links.length ? links[0] : `/${route}/Details/1`;
    const guessed = !links.length;

    const detail = await getWithWakeup(root + probe);
    const okDetail = detail && detail.status < 400;
    const stillAList = okDetail && detailsLinks(detail.body, route).length >= Math.max(links.length, 2);
    add(okDetail && !stillAList ? "pass" : "fail", 4,
      `details page shows one item — ${probe}${guessed ? " (guessed — no links on your index)" : ""}`, {
        hint: stillAList
          ? "that page still lists everything, so it's showing the whole collection."
          : `${probe} didn't load.`,
        todo: stillAList
          ? "In your Details action, pass ONE item to the view — View(item), not View(list)."
          : `Add a Details(int id) action and a Views/${route}/Details.cshtml to match.`,
      });

    const bad = await getWithWakeup(`${root}/${route}/Details/${BAD_ID}`);
    add(bad && bad.status === 404 ? "pass" : "fail", 2,
      `a bad id returns 404 — got ${bad ? bad.status : "no response"}`, {
        hint: "an id nobody has should be an honest 404, not a crash or a blank page.",
        todo: "Use FirstOrDefault, then: if (item == null) return NotFound();",
      });

    return { route, checks, ...tally(checks) };
  }

  const BY_HAND = [
    "4 pts — model with 4+ properties (an int Id, plus at least one non-string) and 5+ seeded items",
    "4 pts — 3+ meaningful commits, pushed to a public repo",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

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
      console.log(`\n🔎 Week 4 self-check — ${url}`);
      console.log("   (a sleeping free-tier app can take ~30s for the first check)\n");
      const res = await runChecks(url, forced, (c) => {
        console.log(`${c.pass ? "✅" : c.blocked ? "⬜" : "❌"} ${String(c.pts).padStart(2)} pts  ${c.label}`);
        if (c.hint) console.log(`         ↳ ${c.hint}`);
      });
      const { earned, possible, green, total, route } = res;
      console.log(`\n📋 ${green} of ${total} checks green · ${earned} of ${possible} points${route ? `  (controller: /${route})` : ""}`);

      const next = res.checks.find(c => !c.pass && c.todo);
      if (next) console.log(`\n👉 Next: ${next.todo}`);
      else if (isLocal(url)) console.log("\n⚠️  That was localhost. Run it again on your Azure URL — the deployed one is what I grade.");
      else console.log("\n🎉 Everything I can check from a URL passes on your deployed site.");

      console.log("\nThe last 8 points I check by hand:");
      BY_HAND.forEach(l => console.log("   • " + l));
      console.log("\nSubmit your Azure URL + repo URL via Canvas.\n");
      process.exit(green === total ? 0 : 1);
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
      const { earned, possible, green, total, route } = res;
      console.log(`%c📋 ${green} of ${total} checks green · ${earned} of ${possible} points${route ? `  (controller: /${route})` : ""}`, big);

      const next = res.checks.find(c => !c.pass && c.todo);
      if (next) {
        console.log(`%c👉 Next: ${next.todo}`, `${bold}; color: #79c0ff`);
        console.log("Fix that, refresh this page, and the checks run again.");
      } else if (isLocal(window.location.origin)) {
        console.log("%c⚠️  This is localhost. Run it again on your Azure URL — the deployed one is what I grade.", `${bold}; color: #d29922`);
      } else {
        console.log("%c🎉 Everything I can check from a URL passes on your deployed site.", `${bold}; color: green`);
      }

      console.log("%cThe last 8 points I check by hand:", bold);
      BY_HAND.forEach(l => console.log("   • " + l.trim()));
      console.log("%cType  recheck()  to run these again without reloading.", "color: #79c0ff");
    };

    const run = () => {
      console.log(`%c🔎 Week 4 self-check — ${window.location.origin}`, big);
      console.log("Results appear as each check finishes — a sleeping free-tier app can take ~30s for the first one.");
      console.log("A red 404 line partway through is expected: one check asks for a bad id on purpose.");
      return runChecks(window.location.origin, null, printCheck).then(report);
    };

    window.recheck = run;   // re-run from the console without reloading
    run();
  }
})();
