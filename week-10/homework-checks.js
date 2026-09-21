// ═══════════════════════════════════════════════════════════════════════════
//  Week 10 — the stranger's pass.
//
//  THIS ONE SCORES NOTHING. Every week since 3 has handed you a script that
//  counted points. This one doesn't, and that is deliberate: the midterm is
//  graded on judgement, and no script has any. What this does is walk your
//  deployed site the way a visitor would and print what it trips over.
//
//  INSTALL IT THE USUAL WAY — open Views/Home/Index.cshtml, find the week-09
//  line, and REPLACE it:
//
//    @section Scripts {
//        <script src="https://jgrissom.github.io/dotnet-web-dev/week-10/homework-checks.js"></script>
//    }
//
//  ⚠️  You are going to REWRITE that file this week, and the script tag lives
//  in it. Put the @section Scripts block back when you do, or this stops
//  loading and you will think you fixed something you didn't.
//
//  Then load the page and open the console (F12). Nothing runs on its own —
//  type  recheck()  when you want it to look.
//
//  IT READS ONLY. It submits no forms and writes no rows — unlike weeks 6-9,
//  running this is free and leaves nothing behind. Run it as often as you like.
//
//  It does NOT know what your app is about. Everything below is something a
//  stranger can see without knowing your topic: a front door that still
//  belongs to Microsoft, a link that goes nowhere, a wrong id that lands on a
//  blank browser page, last week's test row sitting on your public site.
//
//  ⚠️  A CLEAN REPORT IS NOT FULL MARKS. Read "What this cannot see" at the
//  bottom — the things it misses are most of what the midterm is actually for.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const WEEK = 10;

  // Last week's row, and the weeks before it. Weeks 6-9's self-checks each
  // filed one marked "Week N Test"; week 7's and week 9's could not take it
  // back. If it's still in your data it is on your public site.
  const MARKER_RX = /Week\s*\d+\s*Test/i;

  // The stock ASP.NET MVC template, verbatim. If any of this is still on your
  // site, that page is the one `dotnet new mvc` wrote, not one you did.
  const TEMPLATE_HOME = [
    "Learn about <a href=\"https://learn.microsoft.com/aspnet/core\">building Web apps with ASP.NET Core</a>",
    "building Web apps with ASP.NET Core",
  ];
  const TEMPLATE_PRIVACY = "Use this page to detail your site's privacy policy";
  const TEMPLATE_TITLES = ["Home Page", "Privacy Policy"];

  async function get(url, timeoutMs = 45000) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });
      return { status: res.status, body: await res.text(), url };
    } catch {
      return null;
    }
  }

  // Free tier naps: one retry after a pause, so a cold app isn't a false finding.
  async function getWithWakeup(url) {
    const first = await get(url);
    if (first) return first;
    await new Promise(r => setTimeout(r, 15000));
    return await get(url);
  }

  // ── reading their pages ─────────────────────────────────────────────────────

  const titleOf = (html) => {
    const m = /<title>([\s\S]*?)<\/title>/i.exec(String(html || ""));
    return m ? m[1].trim().replace(/\s+/g, " ") : "";
  };

  // Internal links only, minus assets and anchors. Case is preserved because
  // that's what we report back; comparison is always case-insensitive.
  function internalLinks(html) {
    const out = [];
    for (const m of String(html || "").matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
      const raw = m[1].trim();
      if (!raw.startsWith("/")) continue;              // external, mailto, #anchor
      const u = raw.split("#")[0];
      if (!u || u === "/") { if (!out.includes("/")) out.push("/"); continue; }
      if (/\.(css|js|png|jpe?g|webp|gif|svg|ico|woff2?|map)(\?|$)/i.test(u)) continue;
      if (!out.some(x => x.toLowerCase() === u.toLowerCase())) out.push(u);
    }
    return out;
  }

  // The controllers a visitor can reach from the navbar. Home is skipped —
  // it's the front door, not a list.
  function navCandidates(html) {
    const out = [];
    for (const m of String(html || "").matchAll(/href="\/([A-Za-z]\w*)(?:\/(?:Index)?)?"/gi)) {
      if (/^home$/i.test(m[1])) continue;
      if (!out.some(x => x.toLowerCase() === m[1].toLowerCase())) out.push(m[1]);
    }
    return out;
  }

  const detailsIds = (html, route) => [...new Set(
    [...String(html || "").matchAll(new RegExp(`/${route}/Details/(\\d+)`, "gi"))].map(m => Number(m[1]))
  )];

  // A rendered page is a whole document. A bare NotFound() is zero bytes.
  // That is the entire difference, and it cannot be mistaken for anything else.
  const isRenderedPage = (res) =>
    !!res && typeof res.body === "string" &&
    res.body.length > 0 && /<\/html>/i.test(res.body);

  // ── the stale-checker trap ──────────────────────────────────────────────────
  function staleCheckers(html) {
    const found = new Set();
    for (const m of String(html || "").matchAll(/week-0*(\d+)\/homework-checks\.js/gi)) {
      if (Number(m[1]) !== WEEK) found.add(Number(m[1]));
    }
    return [...found].sort((a, b) => a - b);
  }

  /**
   * Walks a deployed app the way a visitor would and collects findings.
   * Read-only: it issues GETs and nothing else.
   *
   * Returns { route, findings, looked, stale }.
   * A finding is { what, where, why, fix } — no points, no pass/fail.
   * Shared with the grader, which prints the same list next to a hand rubric.
   */
  async function runChecks(baseUrl, forcedRoute, onFinding) {
    const root = String(baseUrl).replace(/\/$/, "");
    const findings = [];
    const stale = new Set();
    const looked = [];

    const flag = (what, where, why, fix) => {
      const f = { what, where, why, fix };
      findings.push(f);
      if (onFinding) onFinding(f);
      return f;
    };

    const done = (route) => ({ route, findings, looked, stale: [...stale] });

    // ── the front door ────────────────────────────────────────────────────────
    const home = await getWithWakeup(root + "/");
    looked.push("/");
    if (!home || home.status >= 400) {
      flag(
        "Your site didn't load at all",
        "/",
        home ? `the home page came back ${home.status}.`
             : "nothing answered. The app may be stopped, or the URL may be wrong.",
        "Start it (dotnet watch locally, or check the app is running in Azure) and run this again. "
          + "Nothing else can be looked at until the front door opens."
      );
      return done(null);
    }
    staleCheckers(home.body).forEach(w => stale.add(w));

    if (TEMPLATE_HOME.some(t => home.body.includes(t))) {
      flag(
        "Your front door is still Microsoft's",
        "/",
        "your home page is the one `dotnet new mvc` wrote — \"Welcome\", and a link to the "
          + "ASP.NET Core docs. It is the first thing every visitor sees, and it says nothing "
          + "about what you built.",
        "Rewrite Views/Home/Index.cshtml: what this site is, who it's for, and a button into "
          + "your list page. ⚠️ Keep the @section Scripts block at the bottom — this script "
          + "lives in it."
      );
    }

    const homeTitle = titleOf(home.body);
    if (TEMPLATE_TITLES.some(t => homeTitle.toLowerCase().startsWith(t.toLowerCase()))) {
      flag(
        `Your browser tab says "${homeTitle}"`,
        "/",
        "that's the template's ViewData[\"Title\"]. It's what a bookmark is named and what a "
          + "shared link shows.",
        "Set ViewData[\"Title\"] at the top of the view to something that describes the page."
      );
    }

    // ── every link the front page offers ──────────────────────────────────────
    const homeLinks = internalLinks(home.body);
    const broken = [];
    for (const u of homeLinks.slice(0, 20)) {
      if (u === "/") continue;
      const page = await getWithWakeup(root + u);
      looked.push(u);
      if (!page) { broken.push({ u, status: 0 }); continue; }
      staleCheckers(page.body).forEach(w => stale.add(w));
      if (page.status >= 400) broken.push({ u, status: page.status });
      if (page.status >= 500) {
        flag(
          `${u} is throwing`,
          u,
          `it came back ${page.status}. A visitor gets an error page, and on Azure they get one `
            + "with no explanation at all.",
          "Read the real exception in your terminal, or in Azure's Log stream. If it names a "
            + "table or a column, your deployed database hasn't had a migration applied."
        );
      }
      if (page.body && page.body.includes(TEMPLATE_PRIVACY)) {
        flag(
          "The stock Privacy page is still linked",
          u,
          "it says \"Use this page to detail your site's privacy policy\" — a page you didn't "
            + "write, advertised in your navbar and your footer.",
          "Either make it a real page about your project, or delete it: the view, the action, "
            + "and both links in _Layout.cshtml. A page you haven't written is worse than no page."
        );
      }
    }
    for (const b of broken) {
      if (b.status >= 500) continue;   // already reported above, with more detail
      flag(
        `A link on your front page goes nowhere`,
        b.u,
        b.status ? `it came back ${b.status}.` : "nothing answered.",
        "Either point the link somewhere real or take it out of _Layout.cshtml. A dead link in "
          + "the navbar is on every page of your site at once."
      );
    }

    // ── find their list page, the way a visitor would ─────────────────────────
    const tries = forcedRoute ? [forcedRoute] : navCandidates(home.body);
    let route = null, index = null;
    for (const cand of tries) {
      const page = await getWithWakeup(`${root}/${cand}`);
      if (!page || page.status >= 400) continue;
      if (detailsIds(page.body, cand).length) { route = cand; index = page; break; }
      if (!route) { route = cand; index = page; }
    }

    if (!route) {
      flag(
        "I couldn't find your list page",
        "the navbar",
        "no link in your navbar reaches a controller of yours. That link has been a requirement "
          + "since week 4.",
        "Check the navbar in _Layout.cshtml. Or tell me where to look: recheck(\"Trails\") with "
          + "your own controller name."
      );
      return done(null);
    }
    staleCheckers(index.body).forEach(w => stale.add(w));
    looked.push("/" + route);

    const ids = detailsIds(index.body, route);

    // ── last week's test row, on your public site ─────────────────────────────
    if (MARKER_RX.test(index.body)) {
      flag(
        "A self-check test row is still in your data",
        "/" + route,
        "your list page is showing a record whose text matches \"Week N Test\". Weeks 6 to 9 each "
          + "filed one through your own form, and weeks 7 and 9 had no way to take it back. It is "
          + "on your deployed site, where anyone can read it.",
        "Delete it — through your own Delete action if you have one for that table, or by hand "
          + "in the mssql panel."
      );
    }

    // ── can every record on the list actually be opened? ──────────────────────
    for (const id of ids.slice(0, 8)) {
      const page = await getWithWakeup(`${root}/${route}/Details/${id}`);
      looked.push(`/${route}/Details/${id}`);
      if (!page) continue;
      staleCheckers(page.body).forEach(w => stale.add(w));
      if (page.status >= 400) {
        flag(
          `A record on your list page can't be opened`,
          `/${route}/Details/${id}`,
          `your list page links to it, and it came back ${page.status}.`,
          "Every link on your list page has to lead somewhere. If the record is gone, the link "
            + "shouldn't still be rendered."
        );
        break;   // one is enough; they're almost always the same cause
      }
      if (MARKER_RX.test(page.body)) {
        flag(
          "A self-check test row is showing on a record's page",
          `/${route}/Details/${id}`,
          "a row matching \"Week N Test\" is rendered on this page. That's a leftover from an "
            + "earlier week's self-check, and it is public.",
          "Delete it from your database."
        );
        break;
      }
    }

    // ── a wrong id: the page a stranger lands on by accident ──────────────────
    //
    // Not a made-up scenario. Delete a record and every saved link to it comes
    // here — and the default is zero bytes, which the browser draws as its own
    // error page: no navbar, no site, no way back.
    const ghostId = (ids.length ? Math.max(...ids) : 0) + 1000;
    const ghost = await getWithWakeup(`${root}/${route}/Details/${ghostId}`);
    looked.push(`/${route}/Details/${ghostId}`);
    if (ghost && !isRenderedPage(ghost)) {
      flag(
        "A wrong id lands on a blank browser page",
        `/${route}/Details/${ghostId}`,
        `it came back ${ghost.status} with an empty body — so the browser draws its own error `
          + "page. No navbar, no way back, nothing that looks like your site. That is what a "
          + "visitor gets after you delete a record they had a link to.",
        "Give your app a page for it — and build it in this order, or there's a window where "
          + "every wrong-id URL answers 500 instead:\n"
          + "    1. Views/Home/Missing.cshtml — an apology and a link home\n"
          + "    2. a Missing() action on HomeController that returns View()\n"
          + "    3. in Program.cs, above app.UseRouting():\n"
          + "         app.UseStatusCodePagesWithReExecute(\"/Home/Missing\");\n"
          + "⚠️ Don't name the action NotFound — Controller already has a method by that name."
      );
    }

    return done(route);
  }

  // Printed above everything, because a stale checker makes the whole report suspect.
  const staleWarning = (stale) => stale && stale.length
    ? `Week ${stale.join(" and ")}'s self-check script is STILL installed in your app. This `
      + `week's line REPLACES it — it does not go underneath it. Delete the old <script> tag.`
    : null;

  const walked = (n) => `${n} page${n === 1 ? "" : "s"} walked`;

  const headline = (n) =>
    n === 0 ? "Nothing here a stranger would trip over"
            : `${n} thing${n === 1 ? "" : "s"} a stranger would trip over`;

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  const CANNOT_SEE = [
    "whether your list pages say anything useful when they are EMPTY — I can't empty your database",
    "whether your seeded records read like real content or like \"asdf\", \"test 2\", \"aaa\"",
    "whether a visitor can work out what your site is FOR in ten seconds",
    "whether your forms are reachable from somewhere a person would look",
    "whether anything on any page is ugly",
  ];

  const NO_SCORE =
    "This scores nothing. There is no number in it and there is no number hiding behind it. "
    + "The midterm is 20 points and I grade it by hand against the rubric in the homework, "
    + "plus the explain-it standard. A clean report here is a good sign and it is not a grade.";

  // ── Node: export for the grader, and support `node homework-checks.js <url>` ──
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { runChecks, MARKER_RX };
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
      console.log(`\n🔎 Week ${WEEK} — the stranger's pass — ${url}`);
      console.log("   Reading only. Nothing is submitted and nothing is written.");
      console.log("   (a sleeping free-tier app can take ~30s for the first page)\n");
      const res = await runChecks(url, forced, (f) => {
        console.log(`⚠️  ${f.what}`);
        console.log(`      ${f.where} — ${f.why}`);
        console.log(`      → ${f.fix.split("\n").join("\n        ")}\n`);
      });
      const oldOne = staleWarning(res.stale);
      if (oldOne) console.log(`\n🚨 ${oldOne}\n`);

      const n = res.findings.length;
      console.log(`📋 ${headline(n)}`
        + `  ·  ${walked(res.looked.length)}${res.route ? `  (list page: /${res.route})` : ""}`);

      if (n === 0 && isLocal(url)) {
        console.log("\n⚠️  That was localhost. Run it again on your Azure URL — the deployed one is the one I open.");
      } else if (n === 0) {
        console.log("\n🎉 Nothing here trips a stranger up. Now read the list below, because that is the rest of it.");
      }

      console.log("\n👀 What this cannot see:");
      CANNOT_SEE.forEach(l => console.log("   • " + l));
      console.log(`\nℹ️  ${NO_SCORE}`);
      console.log("\nSubmit your Azure URL + repo URL via Canvas.\n");
      process.exit(0);
    })();
  }

  // ── Browser: <script src> on your own site ──────────────────────────────────
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const bold = "font-weight: bold";
    const big = `${bold}; font-size: 1.1em`;

    const printFinding = (f) => {
      console.log(`%c⚠️  ${f.what}`, `${bold}; color: #d29922`);
      console.log(`      ${f.where} — ${f.why}`);
      console.log(`%c      → ${f.fix}`, "color: #79c0ff");
    };

    const report = (res) => {
      const oldOne = staleWarning(res.stale);
      if (oldOne) console.log(`%c🚨 ${oldOne}`, `${bold}; color: crimson`);

      const n = res.findings.length;
      console.log(
        `%c📋 ${headline(n)}`
        + `  ·  ${walked(res.looked.length)}${res.route ? `  (list page: /${res.route})` : ""}`,
        big);

      if (n === 0 && isLocal(window.location.origin)) {
        console.log("%c⚠️  This is localhost. Run it again on your Azure URL — the deployed one is the one I open.",
          `${bold}; color: #d29922`);
      } else if (n === 0) {
        console.log("%c🎉 Nothing here trips a stranger up. Now read the list below, because that is the rest of it.",
          `${bold}; color: green`);
      }

      console.log("%c👀 What this cannot see:", bold);
      CANNOT_SEE.forEach(l => console.log("   • " + l));
      console.log(`%cℹ️  ${NO_SCORE}`, "color: #79c0ff");
      console.log("%cType  recheck()  to walk it again — or  recheck(\"Trails\")  with your controller name.",
        "color: #79c0ff");
    };

    const run = (forcedRoute) => {
      console.log(`%c🔎 Week ${WEEK} — the stranger's pass — ${window.location.origin}`, big);
      console.log("%c👀 Reading only. Nothing is submitted and nothing is written, so run it as often as you like.",
        "color: #79c0ff");
      console.log("Findings appear as each page is walked — a sleeping free-tier app can take ~30s for the first one.");
      if (forcedRoute) console.log(`Starting from /${forcedRoute} (you told me where to look).`);
      return runChecks(window.location.origin, forcedRoute || null, printFinding).then(report);
    };

    window.recheck = (forcedRoute) => run(forcedRoute);

    console.log(`%c🔎 Week ${WEEK} — the stranger's pass — loaded, but it hasn't run.`, big);
    console.log("%cType  recheck()  to walk your site. It reads only — no forms submitted, no rows written.",
      "color: #79c0ff");
    console.log("%cThis one scores nothing. It prints what a visitor would trip over; the 20 points are graded by hand.",
      "color: #79c0ff");
  }
})();
