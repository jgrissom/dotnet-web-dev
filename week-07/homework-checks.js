// ═══════════════════════════════════════════════════════════════════════════
//  Week 7 homework self-check — the SAME checks I grade with.
//
//  EASIEST WAY — include it like a CDN, exactly like last week. Open
//  Views/Home/Index.cshtml, find the week-06 line, and REPLACE it:
//
//    @section Scripts {
//        <script src="https://jgrissom.github.io/dotnet-web-dev/week-07/homework-checks.js"></script>
//    }
//
//  Then load that page and open the console (F12). It runs automatically.
//  Type  recheck()  to run it again without reloading.
//
//  ⚠️  THIS ONE FILLS YOUR FORM IN AND SUBMITS IT, same as last week. Twice:
//  once with rubbish, to check you refuse it, and once with a good record.
//  That second one leaves a real item called "SelfCheck entry" in your list —
//  and THIS week it's supposed to still be there tomorrow.
//
//  ⚠️  READ THIS — the points moved. Only 6 of the 20 points are in this
//  script, down from 14 last week. That is not because this week is easier;
//  it's because the thing you built tonight is invisible from outside. A page
//  reading a static List<T> and a page reading SQL Server render exactly the
//  same HTML, so no amount of fetching can tell them apart. What this script
//  checks is that your app SURVIVED the rewrite. The database itself I read
//  out of your repo — 11 points of it. See the rubric in homework.md.
//
//  THE ONE THING YOU SHOULD CHECK BY HAND, because it's the whole week:
//  add a record on your DEPLOYED site, then run your app LOCALLY and look at
//  your list. It's there. Same database, two apps, two computers. That is
//  what you built, and no script can show it to you.
//
//  (Have Node installed? `node homework-checks.js <url>` works too.)
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const WEEK = 7;
  const MARKER = "SelfCheck entry";

  // In Node, fetch doesn't keep cookies, and the antiforgery token needs its
  // cookie to come back with the POST. In a browser, same-origin cookies are
  // automatic and this whole thing stays empty.
  const jar = new Map();
  const cookieHeader = () =>
    [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");

  function stashCookies(res) {
    if (typeof window !== "undefined") return;            // browser does it for us
    let list = [];
    try {
      list = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    } catch { /* older runtime */ }
    if (!list.length) {
      const raw = res.headers.get && res.headers.get("set-cookie");
      if (raw) list = [raw];
    }
    for (const c of list) {
      const [pair] = String(c).split(";");
      const i = pair.indexOf("=");
      if (i > 0) jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
    }
  }

  async function get(url, timeoutMs = 45000) {
    try {
      const headers = {};
      if (typeof window === "undefined" && jar.size) headers.cookie = cookieHeader();
      const res = await fetch(url, {
        redirect: "follow", headers,
        signal: AbortSignal.timeout(timeoutMs),
      });
      stashCookies(res);
      return { status: res.status, body: await res.text() };
    } catch {
      return null;
    }
  }

  // Free tier naps: one retry after a pause, so a cold app isn't a false failure.
  // A database-backed app is slower to wake than last week's — first query has to
  // open a connection too.
  async function getWithWakeup(url) {
    const first = await get(url);
    if (first) return first;
    await new Promise(r => setTimeout(r, 15000));
    return await get(url);
  }

  // POST a form body WITHOUT following the redirect — the redirect is the thing
  // we're checking for.
  async function post(url, params, timeoutMs = 45000) {
    try {
      const headers = { "content-type": "application/x-www-form-urlencoded" };
      if (typeof window === "undefined" && jar.size) headers.cookie = cookieHeader();
      const res = await fetch(url, {
        method: "POST", redirect: "manual", headers,
        body: new URLSearchParams(params).toString(),
        signal: AbortSignal.timeout(timeoutMs),
      });
      stashCookies(res);
      // A browser fetch with redirect:"manual" reports an opaque type-0 response
      // rather than the 302 itself. That opacity IS the redirect.
      const redirected = res.type === "opaqueredirect" ||
                         (res.status >= 300 && res.status < 400);
      let body = "";
      try { body = await res.text(); } catch { /* opaque */ }
      return { status: res.status, redirected, location: res.headers.get("location") || "", body };
    } catch {
      return null;
    }
  }

  // ── finding their app ───────────────────────────────────────────────────────

  function navCandidates(html) {
    const out = [];
    for (const m of html.matchAll(/href="\/([A-Za-z]\w*)(?:\/(?:Index)?)?"/gi)) {
      if (/^home$/i.test(m[1])) continue;
      if (!out.includes(m[1])) out.push(m[1]);
    }
    return out;
  }

  const detailsIds = (html, route) => [...new Set(
    [...html.matchAll(new RegExp(`/${route}/Details/(\\d+)`, "gi"))].map(m => Number(m[1]))
  )];

  // ── reading their form ──────────────────────────────────────────────────────

  const num = (s) => (s === undefined || s === null || s === "" ? null : Number(s));

  function formHtml(html) {
    const m = String(html).match(/<form[^>]*method=["']post["'][\s\S]*?<\/form>/i);
    return m ? m[0] : "";
  }

  function formFields(form) {
    const fields = [];
    const seen = new Set();

    for (const m of form.matchAll(/<(input|textarea|select)\b([^>]*?)>/gi)) {
      const tag = m[1].toLowerCase();
      const attrs = m[2];
      const at = (a) => (attrs.match(new RegExp(`\\b${a}=["']([^"']*)["']`, "i")) || [])[1];

      const name = at("name");
      if (!name || /^__/.test(name)) continue;      // __RequestVerificationToken, __Invariant
      if (seen.has(name)) continue;                 // checkbox + its hidden false partner
      seen.add(name);

      const type = (at("type") || (tag === "textarea" ? "textarea" : "text")).toLowerCase();
      const lenMax = num(at("data-val-length-max")) ?? num(at("maxlength"));

      const field = {
        name, tag, type,
        rangeMin: num(at("data-val-range-min")),
        rangeMax: num(at("data-val-range-max")),
        lenMin: num(at("data-val-length-min")),
        lenMax,
        isNumber: type === "number" || at("data-val-number") !== undefined,
      };

      if (tag === "select") {
        const after = form.slice(form.indexOf(m[0]) + m[0].length);
        const block = (after.match(/[\s\S]*?<\/select>/i) || [""])[0];
        field.options = [...block.matchAll(/<option[^>]*value=["']([^"']*)["']/gi)]
          .map(o => o[1]).filter(v => v !== "");
      }

      fields.push(field);
    }
    return fields;
  }

  function validValue(f) {
    if (f.type === "checkbox") return "false";
    if (f.options) return f.options[0] ?? "";
    if (f.isNumber) {
      const lo = f.rangeMin ?? 1;
      const hi = f.rangeMax ?? Math.max(lo, 100);
      return String(Math.min(Math.max(1, lo), hi));
    }
    if (f.type === "date") return "2020-06-15";
    if (f.type === "datetime-local") return "2020-06-15T12:00";
    if (f.type === "time") return "12:00";
    if (f.type === "email") return "selfcheck@example.com";
    if (f.type === "url") return "https://example.com";
    let v = MARKER;
    if (f.lenMin && v.length < f.lenMin) v = v.padEnd(f.lenMin, "x");
    if (f.lenMax && v.length > f.lenMax) v = v.slice(0, f.lenMax);
    return v;
  }

  // Deliberately wrong, per field, using their own rules against them.
  function invalidValue(f) {
    if (f.type === "checkbox") return "false";
    if (f.rangeMax !== null && f.rangeMax !== undefined) return String(f.rangeMax + 1);
    if (f.lenMax && f.lenMax < 500) return "x".repeat(f.lenMax + 1);
    return "";
  }

  const bodyFrom = (fields, pick, token) => {
    const body = {};
    for (const f of fields) body[f.name] = pick(f);
    if (token) body.__RequestVerificationToken = token;
    return body;
  };

  const tokenOf = (html) => {
    const m = String(html).match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
    return m ? m[1] : "";
  };

  const hasErrors = (html) =>
    /field-validation-error/.test(html) || /validation-summary-errors/.test(html);

  // ── the stale-checker trap ──────────────────────────────────────────────────
  // Last week's script is still installed, and it PASSES — week 7 breaks none of
  // week 6's requirements. Worse this week: last week's is worth 14 points and
  // this one is worth 6, so a stale green report looks BETTER than the real one.
  function staleCheckers(html) {
    const found = new Set();
    for (const m of String(html || "").matchAll(/week-0*(\d+)\/homework-checks\.js/gi)) {
      if (Number(m[1]) !== WEEK) found.add(Number(m[1]));
    }
    return [...found].sort((a, b) => a - b);
  }

  const tally = (checks) => ({
    earned: checks.filter(c => c.pass).reduce((n, c) => n + c.pts, 0),
    possible: checks.reduce((n, c) => n + c.pts, 0),
    green: checks.filter(c => c.pass).length,
    total: checks.length,
  });

  /**
   * Runs every URL-verifiable check against a base URL.
   * Returns { route, checks: [{label, pass, pts, hint, blocked, todo}], earned, ... }
   * `blocked` = couldn't be judged yet because an earlier step isn't done.
   * Shared with the grader so students and I run identical logic.
   */
  async function runChecks(baseUrl, forcedRoute, onCheck) {
    const root = String(baseUrl).replace(/\/$/, "");
    const checks = [];
    const stale = new Set();

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

    const REST = [
      [1, "a details page still works"],
      [1, "your form still refuses a bad record"],
      [2, "a good record is accepted and lands in your list"],
      [1, "the new record's id was assigned for you"],
    ];
    const blockRest = (from) => REST.slice(from).forEach(([pts, label]) =>
      add("blocked", pts, label, { hint: "waiting on an earlier step" }));

    // Only set once a record has actually landed.
    let addedARecord = false;
    // Evidence for the grader: a marker already on the page BEFORE we post
    // anything is a record that outlived whatever restarts happened since.
    let markerWasAlreadyThere = false;
    const done = (route) => ({
      route, checks, stale: [...stale], addedARecord, markerWasAlreadyThere, ...tally(checks),
    });

    // ── 0. their home page ────────────────────────────────────────────────────
    const home = await getWithWakeup(root + "/");
    if (!home || home.status >= 400) {
      const broke = home && home.status >= 500;
      add("fail", 1, "your list page still works", {
        hint: broke
          ? `your home page returned a ${home.status} — the app is running, but something in it is throwing. `
            + "The most common cause tonight is a connection string your deployed app can't use."
          : "your home page didn't even load — nothing else can be checked until it does.",
        todo: broke
          ? "Look at the terminal (or Azure's Log stream). If it says 'A network-related or "
            + "instance-specific error occurred', your deployed app can't reach the SQL Server — "
            + "check the connection string that actually shipped, and that your app is in a US region."
          : "Start your app (dotnet watch), or check that your deployed URL is right.",
      });
      blockRest(0);
      return done(null);
    }
    staleCheckers(home.body).forEach(w => stale.add(w));

    // ── 1. find their controller, the way a visitor would ─────────────────────
    const tries = forcedRoute ? [forcedRoute] : navCandidates(home.body);
    let route = null, index = null;
    for (const cand of tries) {
      const page = await getWithWakeup(`${root}/${cand}`);
      if (!page || page.status >= 400) continue;
      route = cand; index = page;
      if (detailsIds(page.body, cand).length) break;      // this is the real one
    }

    if (!route) {
      add("fail", 1, "your list page still works", {
        hint: "I couldn't find a link in your navbar that reaches a controller of yours, so I don't "
            + "know where your list page is.",
        todo: "That nav link has been a requirement since week 4. Check you still have it. "
            + "Not there yet? Run  recheck(\"Trails\")  with YOUR controller name.",
      });
      blockRest(0);
      return done(null);
    }
    staleCheckers(index.body).forEach(w => stale.add(w));

    const before = detailsIds(index.body, route);
    markerWasAlreadyThere = index.body.includes(MARKER);

    // ── 2. the list page survived the rewrite ─────────────────────────────────
    // Moving to EF Core is where a working list page most often stops working:
    // the seed data never made it into the table, or the migration was never run.
    add(before.length >= 3 ? "pass" : "fail", 1,
      `your list page still works — ${before.length} records`, {
        hint: before.length === 0
          ? `/${route} loaded but there's nothing on it. Your list is empty, which after tonight `
            + "almost always means one of two things: the migration was never applied to the "
            + "database your deployed app is pointing at, or your seed data never made it into "
            + "OnModelCreating."
          : `I can only see ${before.length} record(s) on /${route}. Your seeded records should all `
            + "have come across into the table.",
        todo: "Check that your HasData seeding is in OnModelCreating, that you added a migration "
            + "AFTER writing it, and that you ran  dotnet ef database update  against the same "
            + "database your connection string points at.",
      });

    if (!before.length) { blockRest(0); return done(route); }

    // ── 3. a details page still works ─────────────────────────────────────────
    const firstId = Math.min(...before);
    const detailsPage = await getWithWakeup(`${root}/${route}/Details/${firstId}`);
    const detailsOk = detailsPage && detailsPage.status < 400;

    add(detailsOk ? "pass" : "fail", 1,
      `a details page still works — /${route}/Details/${firstId}`, {
        hint: `/${route}/Details/${firstId} returned ${detailsPage ? detailsPage.status : "nothing"}, `
            + "but that id is linked from your own list page.",
        todo: "Your Details action has to look the record up in the table now: "
            + "_context.YourThings.FirstOrDefault(x => x.Id == id);",
      });

    // ── 4. the form still refuses a bad record ────────────────────────────────
    const createUrl = `/${route}/Create`;
    const createPage = await getWithWakeup(root + createUrl);
    if (!createPage || createPage.status >= 400) {
      add("fail", 1, "your form still refuses a bad record", {
        hint: `${createUrl} returned ${createPage ? createPage.status : "nothing"} — the form you `
            + "built last week isn't loading any more.",
        todo: "If this broke tonight, the usual cause is the Create action being half-rewritten "
            + "while you were removing the old static list.",
      });
      blockRest(2);
      return done(route);
    }
    staleCheckers(createPage.body).forEach(w => stale.add(w));

    const form = formHtml(createPage.body);
    const fields = form ? formFields(form) : [];

    if (!form || fields.length < 2) {
      add("fail", 1, "your form still refuses a bad record", {
        hint: "there's no usable <form method=\"post\"> on your Create page any more.",
        todo: "Week 6's form has to keep working — this week only changes where the record goes.",
      });
      blockRest(2);
      return done(route);
    }

    const badPost = await post(root + createUrl,
      bodyFrom(fields, invalidValue, tokenOf(createPage.body)));
    const badRefused = badPost && !badPost.redirected && badPost.status === 200;
    const badSaidWhy = badRefused && hasErrors(badPost.body);

    const afterBad = await getWithWakeup(`${root}/${route}`);
    const idsAfterBad = afterBad ? detailsIds(afterBad.body, route) : before;

    add(badRefused && badSaidWhy && idsAfterBad.length === before.length ? "pass" : "fail", 1,
      "your form still refuses a bad record", {
        hint: !badPost
          ? "the bad submission didn't get a response at all."
          : badPost.redirected
            ? "I filled your form with rubbish and it was accepted. The ModelState.IsValid guard "
              + "has to survive the move to EF Core — it goes BEFORE the Add and the SaveChanges."
          : idsAfterBad.length > before.length
            ? "the form came back, but the bad record was written to the database anyway. The guard "
              + "has to return before SaveChanges()."
            : "the form came back and nothing was added, but there are no error messages on it.",
        todo: "Keep last week's guard at the top of the POST action: "
            + "if (!ModelState.IsValid) { return View(item); }",
      });

    // ── 5. a good record is accepted ──────────────────────────────────────────
    // This is the one that leaves a record behind — and this week it should stay.
    const freshForm = await getWithWakeup(root + createUrl);
    const goodPost = freshForm
      ? await post(root + createUrl, bodyFrom(fields, validValue, tokenOf(freshForm.body)))
      : null;

    const afterGood = await getWithWakeup(`${root}/${route}`);
    const idsAfterGood = afterGood ? detailsIds(afterGood.body, route) : idsAfterBad;
    const newIds = idsAfterGood.filter(id => !idsAfterBad.includes(id));
    const grew = newIds.length > 0;
    if (grew) addedARecord = true;

    add(goodPost && goodPost.redirected && grew ? "pass" : "fail", 2,
      `a good record is accepted and lands in your list${grew ? ` — ${idsAfterBad.length} → ${idsAfterGood.length}` : ""}`, {
        hint: !goodPost
          ? "the submission didn't get a response at all."
          : !goodPost.redirected
            ? `I filled your form in using your own rules and got a ${goodPost.status} back instead `
              + "of a redirect."
            : "you redirected, but nothing new turned up on your list page. After tonight the most "
              + "likely reason is a missing SaveChanges() — Add() only writes the record down in "
              + "memory; nothing reaches the database until you save.",
        todo: "Finish the POST action: _context.YourThings.Add(item); _context.SaveChanges(); "
            + "then return RedirectToAction(nameof(Index));",
      });

    // ── 6. the id came from the database ──────────────────────────────────────
    const highestBefore = Math.max(...idsAfterBad);
    const assigned = grew && newIds.every(id => id > 0) &&
                     newIds.some(id => id > highestBefore);

    add(grew ? (assigned ? "pass" : "fail") : "blocked", 1,
      `the new record's id was assigned for you${assigned ? ` — ${newIds.join(", ")}` : ""}`, {
        hint: !grew
          ? "waiting on an earlier step"
          : newIds.includes(0)
            ? "your new record went in with id 0, so nothing assigned it one. Delete any leftover "
              + "Max(x => x.Id) + 1 line: Id is an IDENTITY column now, the database picks the "
              + "number, and EF Core copies it back onto your object during SaveChanges()."
            : `the new record's id (${newIds.join(", ")}) isn't above everything that was already `
              + `there (highest was ${highestBefore}), which usually means an id was reused.`,
        todo: "Let the database assign the id: just Add the object and SaveChanges(). Don't set "
            + "the Id yourself.",
      });

    return done(route);
  }

  // Printed above the score, because a stale checker makes the score itself suspect.
  const staleWarning = (stale) => stale && stale.length
    ? `Week ${stale.join(" and ")}'s self-check script is STILL installed in your app, and it PASSES — `
      + `week ${WEEK} didn't break any of last week's requirements. It's also scored out of 14 while `
      + "this week's is scored out of 6, so the stale report looks BETTER than the real one. Delete "
      + `the <script> tag pointing at week-0${stale[0]}/homework-checks.js — this week's line REPLACES it.`
    : null;

  const BY_HAND = [
    "4 pts — a DbContext with a DbSet for your model, and your seed data in OnModelCreating",
    "2 pts — Program.cs registers it with UseSqlServer, reading the connection string from config",
    "3 pts — a migration that creates your table and inserts your seed rows",
    "2 pts — the old static List<T> class is deleted, and your POST action calls SaveChanges()",
    "3 pts — 3+ meaningful commits, pushed to a public repo",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  const LEFTOVER = `I submitted your form once with good data, so there's now an item called "${MARKER}" `
    + "in your list. Last week it would have evaporated at the next restart. This week it shouldn't — "
    + "and checking that is the best two minutes you can spend: restart your app and reload the page.";

  const WHERE_THE_POINTS_ARE =
    "Only 6 of the 20 points are in this script this week. A page backed by SQL Server and a page "
    + "backed by a static List<T> serve identical HTML, so from out here I genuinely cannot tell them "
    + "apart — what I check here is that your app still WORKS. The database itself is 11 points, read "
    + "out of your repo.";

  // ── Node: export for the grader, and support `node homework-checks.js <url>` ──
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { runChecks, MARKER };
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
      console.log(`\n🔎 Week ${WEEK} self-check — ${url}`);
      console.log("   (a sleeping free-tier app can take ~30s for the first check)");
      console.log("   ⚠️  this submits your form — see the note at the end\n");
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

      if (res.markerWasAlreadyThere) {
        console.log(`\n💾 A "${MARKER}" from an earlier run was already in your list before I posted `
          + "anything. That record outlived whatever happened to your app in between — which is "
          + "exactly what this week was for.");
      }
      if (res.addedARecord) console.log(`\n🧹 ${LEFTOVER}`);
      console.log(`\nℹ️  ${WHERE_THE_POINTS_ARE}`);
      console.log("\nThe other 14 points I check in your repo:");
      BY_HAND.forEach(l => console.log("   • " + l));
      console.log("\nSubmit your Azure URL + repo URL via Canvas.\n");
      process.exit(green === total ? 0 : 1);
    })();
  }

  // ── Browser: <script src> on your own site ──────────────────────────────────
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

      if (res.markerWasAlreadyThere) {
        console.log(`%c💾 A "${MARKER}" from an earlier run was already in your list before I posted anything — `
          + "that record outlived whatever happened to your app in between. That's the week, working.", "color: green");
      }
      if (res.addedARecord) console.log(`%c🧹 ${LEFTOVER}`, "color: #d29922");
      console.log(`%cℹ️  ${WHERE_THE_POINTS_ARE}`, "color: #79c0ff");
      console.log("%cThe other 14 points I check in your repo:", bold);
      BY_HAND.forEach(l => console.log("   • " + l.trim()));
      console.log("%cType  recheck()  to run again — or  recheck(\"Trails\")  with your controller name.", "color: #79c0ff");
    };

    const run = (forcedRoute) => {
      console.log(`%c🔎 Week ${WEEK} self-check — ${window.location.origin}`, big);
      console.log("Results appear as each check finishes — a sleeping free-tier app can take ~30s for the first one.");
      console.log("%c⚠️  This submits your form twice, and one of those adds a real item to your list.", "color: #d29922");
      if (forcedRoute) console.log(`Checking /${forcedRoute} directly (you told me where to look).`);
      return runChecks(window.location.origin, forcedRoute || null, printCheck).then(report);
    };

    window.recheck = run;
    run();
  }
})();
