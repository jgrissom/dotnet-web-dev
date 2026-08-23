// ═══════════════════════════════════════════════════════════════════════════
//  Week 5 homework self-check — the SAME checks I grade with.
//
//  EASIEST WAY — include it like a CDN, exactly like last week. This week it
//  goes in a SECTION: open Views/Home/Index.cshtml, find the week-04 line,
//  and REPLACE it — that's requirement 5, worth 2 points:
//
//    @section Scripts {
//        <script src="https://jgrissom.github.io/dotnet-web-dev/week-05/homework-checks.js"></script>
//    }
//
//  Then load that page and open the console (F12). It runs automatically.
//  Type  recheck()  to run it again without reloading.
//
//  THIS IS A FINISH LINE, NOT A PROGRESS BAR. It reads your shell from three
//  different pages at once, so it can't tell you much until the shell is
//  actually finished. Build first; check when you think you're done, then
//  again on your deployed URL before submitting.
//
//  It checks whatever site it's loaded on, so it works on localhost while you
//  build AND on your deployed app. Leave the section in or take it out after
//  I've graded it; it only writes to the console.
//
//  (Have Node installed? `node homework-checks.js <url>` works too.)
//
//  Your topic is your own, so nothing here is hard-coded: it finds your
//  controller the same way a visitor would — by following the link you put in
//  the navbar. If it can't find that link, neither can I.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
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

  // ── reading the shell out of a page ─────────────────────────────────────────

  const decode = (s) => s
    .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&copy;/g, "©");

  const textOf = (html) => decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

  function pageTitle(html) {
    const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return m ? textOf(m[1]) : "";
  }

  function footerText(html) {
    const m = html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);
    return m ? textOf(m[1]) : "";
  }

  // The stock template footer is "© 2026 - YourProject - Privacy" — same on every
  // page, so "it matches everywhere" alone doesn't prove they wrote anything.
  const isStockFooter = (t) => /^©\s*\d{4}\s*-\s*\S+\s*-\s*Privacy$/i.test(t);

  // Stylesheets the template ships with. Anything else is a deliberate choice.
  const isStockSheet = (href) =>
    /lib\/bootstrap\/dist\/css\/bootstrap(\.min)?\.css/i.test(href) ||
    /(^|\/)css\/site\.css/i.test(href) ||
    /\.styles\.css/i.test(href);

  function stylesheets(html) {
    return [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)]
      .map(m => (m[0].match(/href=["']([^"']+)["']/i) || [])[1])
      .filter(Boolean);
  }

  const tally = (checks) => ({
    earned: checks.filter(c => c.pass).reduce((n, c) => n + c.pts, 0),
    possible: checks.reduce((n, c) => n + c.pts, 0),
    green: checks.filter(c => c.pass).length,
    total: checks.length,
  });

  // Last week's <script> tag, still installed. This is the nastiest failure mode
  // of the whole setup, because the old checker WORKS: it checks last week's
  // requirements, week 5 breaks none of them, so it prints a screen of green and
  // the student never learns this week went unchecked. Not scored — costs them
  // nothing but the illusion — so it's a warning, not a check.
  function staleCheckers(html) {
    const found = new Set();
    for (const m of String(html || "").matchAll(/week-0*(\d+)\/homework-checks\.js/gi)) {
      if (Number(m[1]) !== 5) found.add(Number(m[1]));
    }
    return [...found].sort((a, b) => a - b);
  }

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

    const blockRest = (from) => {
      const rest = [
        [2, "your index and details pages still work"],
        [3, "the shell is on every page"],
        [3, "every page has its own title"],
        [2, "a theme, not the default stylesheet"],
      ];
      rest.slice(from).forEach(([pts, label]) =>
        add("blocked", pts, label, { hint: "waiting on an earlier step" }));
    };

    const home = await getWithWakeup(root + "/");
    if (!home || home.status >= 400) {
      // A 500 means the app is up and its code threw — this week that is almost
      // always the layout, and it takes down every page at once.
      const broke = home && home.status >= 500;
      add("fail", 2, "nav link to your index page", {
        hint: broke
          ? `your home page returned a ${home.status} — the app is running, but something in it is throwing. `
            + "Every page shares one layout now, so one bad line in _Layout.cshtml breaks all of them at once."
          : "your home page didn't even load — nothing else can be checked until it does.",
        todo: broke
          ? "Look at the terminal running dotnet watch — the real exception is there. The usual culprits are "
            + "a deleted @RenderBody(), or a <partial> naming a file that doesn't exist."
          : "Start your app (dotnet watch), or check that your deployed URL is right.",
      });
      blockRest(0);
      return { route: null, checks, stale: [], ...tally(checks) };
    }

    const stale = new Set(staleCheckers(home.body));

    // ── 1. find their controller, exactly the way a visitor would ─────────────
    const tries = forcedRoute ? [forcedRoute] : navCandidates(home.body);
    let route = null, links = [];
    for (const cand of tries) {
      const page = await getWithWakeup(`${root}/${cand}`);
      if (!page || page.status >= 400) continue;
      const found = detailsLinks(page.body, cand);
      if (found.length) { route = cand; links = found; break; }
      if (!route) route = cand;                       // reachable, but no detail links yet
    }

    if (forcedRoute) {
      add("blocked", 2, `nav link — not checked (you specified /${forcedRoute})`, {
        hint: "I skipped discovery because you named the controller, so I can't confirm a navbar link exists.",
        todo: "Add the nav link, then run recheck() with no argument to earn these 2 points.",
      });
    } else {
      add(route ? "pass" : "fail", 2,
        `nav link to your index page${route ? ` — found /${route}` : ""}`, {
          hint: "I couldn't find a link in your navbar that reaches a controller of yours — so I don't know where your index page is.",
          todo: "That link was week 4's requirement 4 and it's still worth 2 points. Check you didn't lose it "
              + "while rebuilding the navbar. Not there yet? Run  recheck(\"Trails\")  with YOUR controller name.",
        });
    }

    if (!route) { blockRest(0); return { route: null, checks, stale: [...stale], ...tally(checks) }; }

    // ── 2. week 4 still works (you rebuilt the shell around it) ───────────────
    const detailUrl = links.length ? links[0] : `/${route}/Details/1`;
    const index = await getWithWakeup(`${root}/${route}`);
    const detail = await getWithWakeup(root + detailUrl);
    const indexOk = index && index.status < 400 && links.length >= 5;
    const detailOk = detail && detail.status < 400;

    add(indexOk && detailOk ? "pass" : "fail", 2,
      `your index and details pages still work — /${route}, ${detailUrl}`, {
        hint: !indexOk
          ? `/${route} should list your items, each with a Details link — I found ${links.length} and I need 5 or more.`
          : `${detailUrl} didn't load.`,
        todo: "Week 5 rebuilds the shell around the pages you already had. If one broke, check "
            + "Views/Shared/_Layout.cshtml — a missing @RenderBody() takes down every page at once.",
      });

    if (!indexOk || !detailOk) { blockRest(2); return { route, checks, stale: [...stale], ...tally(checks) }; }

    const pages = [
      { url: "/", html: home.body },
      { url: `/${route}`, html: index.body },
      { url: detailUrl, html: detail.body },
    ];

    pages.forEach(p => staleCheckers(p.html).forEach(w => stale.add(w)));

    // ── 3. the shell really is shared ────────────────────────────────────────
    const footers = pages.map(p => footerText(p.html));
    const missing = pages.filter((p, i) => !footers[i]);
    const allSame = footers.every(f => f === footers[0]);
    const stock = isStockFooter(footers[0]);

    add(!missing.length && allSame && footers[0].length > 8 && !stock ? "pass" : "fail", 3,
      `the shell is on every page${!missing.length && allSame && !stock ? ` — "${footers[0].slice(0, 48)}"` : ""}`, {
        hint: missing.length === pages.length
          ? "none of your three pages has a <footer> at all — your layout isn't rendering one. "
            + "If you moved it into a partial, check that _Layout.cshtml actually renders that partial."
          : missing.length
            ? `${missing.map(p => p.url).join(" and ")} ${missing.length > 1 ? "have" : "has"} no <footer>, `
              + "but your other pages do — so it's living in a view instead of the layout."
          : !allSame
            ? "your three pages show different footers, which means the text is pasted into the views "
              + "instead of living in the layout."
            : stock
              ? "that's still the template's default footer line. Requirement 1 asks for a footer of "
                + "your own — your name and the year — edited in Views/Shared/_Layout.cshtml."
              : "I couldn't find enough footer text to compare.",
        todo: stock
          ? "Put your own name and the year in the <footer> in Views/Shared/_Layout.cshtml."
          : "Your footer should live in Views/Shared/_Layout.cshtml, so every page gets the same one. "
            + "If it's pasted into individual views, move it there.",
      });

    // ── 4. per-page titles ───────────────────────────────────────────────────
    const titles = pages.map(p => pageTitle(p.html));
    const distinct = new Set(titles).size === titles.length;
    const anyEmpty = titles.some(t => !t || /^[\s\-–—|]*$/.test(t));
    const defaultHome = /^home page\b/i.test(titles[0]);

    add(distinct && !anyEmpty && !defaultHome ? "pass" : "fail", 3,
      `every page has its own title${distinct && !anyEmpty && !defaultHome ? ` — "${titles[1]}"` : ""}`, {
        hint: anyEmpty
          ? `one of your pages has an empty title (${titles.map(t => `"${t}"`).join(", ")}) — that's a view `
            + `that never sets ViewData["Title"], leaving the layout with nothing to print.`
          : !distinct
            ? `two of your pages share a title (${titles.map(t => `"${t}"`).join(", ")}). Each view sets its own.`
            : `your home page is still titled "${titles[0]}" — the template's default.`,
        todo: defaultHome && distinct && !anyEmpty
          ? "Change ViewData[\"Title\"] at the top of Views/Home/Index.cshtml to something that's yours."
          : "Set ViewData[\"Title\"] at the top of each view. On your details page make it data-driven: "
            + "ViewData[\"Title\"] = Model.Name;",
      });

    // ── 5. a theme ───────────────────────────────────────────────────────────
    const sheets = pages.map(p => stylesheets(p.html));
    const themed = sheets.map(list =>
      list.some(h => /bootswatch/i.test(h)) || list.some(h => !isStockSheet(h)));
    const stillStock = sheets.some(list => list.some(h => /lib\/bootstrap\/dist\/css\/bootstrap(\.min)?\.css/i.test(h)));

    add(themed.every(Boolean) && !stillStock ? "pass" : "fail", 2,
      "a theme, not the default stylesheet", {
        hint: stillStock
          ? "you're still loading the template's own bootstrap.min.css. A Bootswatch theme REPLACES it — "
            + "if you leave both, the two stylesheets fight and the theme only half applies."
          : "I can't see a stylesheet of your own on every page — only the ones the template ships with.",
        todo: "Swap the Bootstrap <link> in Views/Shared/_Layout.cshtml for a theme from "
            + "https://bootswatch.com, and delete the original line.",
      });

    return { route, checks, stale: [...stale], ...tally(checks) };
  }

  // Printed above the score, because a stale checker makes the score itself suspect.
  const staleWarning = (stale) => stale && stale.length
    ? `Week ${stale.join(" and ")}'s self-check script is STILL installed in your app, and it PASSES — `
      + "it's checking last week's requirements, which week 5 didn't break. Load a page with that tag on it "
      + `and you get a screen of green ticks for work you did seven days ago. Delete the <script> tag `
      + `pointing at week-0${stale[0]}/homework-checks.js.`
    : null;

  const BY_HAND = [
    "3 pts — a partial in Views/Shared/, rendered from two different views",
    "2 pts — this script is included via @section Scripts, not pasted into the layout",
    "3 pts — 3+ meaningful commits, pushed to a public repo",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  // ── Node: export for the grader, and support `node homework-checks.js <url>` ──
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { runChecks };
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
      console.log(`\n🔎 Week 5 self-check — ${url}`);
      console.log("   (a sleeping free-tier app can take ~30s for the first check)\n");
      const res = await runChecks(url, forced, (c) => {
        console.log(`${c.pass ? "✅" : c.blocked ? "⬜" : "❌"} ${String(c.pts).padStart(2)} pts  ${c.label}`);
        if (c.hint) console.log(`         ↳ ${c.hint}`);
      });
      const { earned, possible, green, total, route } = res;
      const oldOne = staleWarning(res.stale);
      if (oldOne) console.log(`\n🚨 ${oldOne}`);
      console.log(`\n📋 ${green} of ${total} checks green · ${earned} of ${possible} points${route ? `  (controller: /${route})` : ""}`);

      const next = res.checks.find(c => !c.pass && !c.blocked && c.todo)
                || res.checks.find(c => !c.pass && c.todo);
      if (next) console.log(`\n👉 Next: ${next.todo}`);
      else if (isLocal(url)) console.log("\n⚠️  That was localhost. Run it again on your Azure URL — the deployed one is what I grade.");
      else console.log("\n🎉 Everything I can check from a URL passes on your deployed site.");

      console.log("\nThe last 8 points I check in your repo:");
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
      const oldOne = staleWarning(res.stale);
      if (oldOne) console.log(`%c🚨 ${oldOne}`, `${bold}; color: crimson`);
      console.log(`%c📋 ${green} of ${total} checks green · ${earned} of ${possible} points${route ? `  (controller: /${route})` : ""}`, big);

      const next = res.checks.find(c => !c.pass && !c.blocked && c.todo)
                || res.checks.find(c => !c.pass && c.todo);
      if (next) {
        console.log(`%c👉 Next: ${next.todo}`, `${bold}; color: #79c0ff`);
        console.log("Fix that, refresh this page, and the checks run again.");
      } else if (isLocal(window.location.origin)) {
        console.log("%c⚠️  This is localhost. Run it again on your Azure URL — the deployed one is what I grade.", `${bold}; color: #d29922`);
      } else {
        console.log("%c🎉 Everything I can check from a URL passes on your deployed site.", `${bold}; color: green`);
      }

      console.log("%cThe last 8 points I check in your repo:", bold);
      BY_HAND.forEach(l => console.log("   • " + l.trim()));
      console.log("%cType  recheck()  to run again — or  recheck(\"Trails\")  with your controller name to check before the nav link exists.", "color: #79c0ff");
    };

    const run = (forcedRoute) => {
      console.log(`%c🔎 Week 5 self-check — ${window.location.origin}`, big);
      console.log("Results appear as each check finishes — a sleeping free-tier app can take ~30s for the first one.");
      if (forcedRoute) console.log(`Checking /${forcedRoute} directly (you told me where to look).`);
      return runChecks(window.location.origin, forcedRoute || null, printCheck).then(report);
    };

    // recheck() re-runs; recheck("Trails") skips nav discovery and checks that controller
    window.recheck = run;
    run();
  }
})();
