// ═══════════════════════════════════════════════════════════════════════════
//  Week 8 homework self-check — the SAME checks I grade with.
//
//  EASIEST WAY — include it like a CDN, exactly like last week. Open
//  Views/Home/Index.cshtml, find the week-07 line, and REPLACE it:
//
//    @section Scripts {
//        <script src="https://jgrissom.github.io/dotnet-web-dev/week-08/homework-checks.js"></script>
//    }
//
//  Then load that page and open the console (F12). It runs automatically.
//  Type  recheck()  to run it again without reloading.
//
//  ⚠️  THIS ONE RUNS YOUR WHOLE CRUD CYCLE. It files a record through your
//  form, EDITS it through your Edit form, tries a bad edit to check you
//  refuse it, and then DELETES it through your Delete confirmation. If all
//  of that works, it leaves your data exactly as it found it — the deletion
//  is the clean-up, and it's also the D being checked.
//
//  If the delete step fails, a record called "SelfCheck entry (edited)"
//  stays in your list until your Delete works (or you remove it by hand).
//
//  THE POINTS MOVED BACK. Last week only 6 of 20 points were in this script,
//  because a database is invisible from outside. Edit and delete are NOT
//  invisible — a checker can watch a record change and disappear. So this
//  week 12 of the 20 points are right here. The rest: 5 from your repo
//  (async actions, and an ADDITIVE migration), 3 from commits.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const WEEK = 8;
  const MARKER = "SelfCheck entry";
  const EDITED = "SelfCheck entry (edited)";

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

  // ── reading their forms ─────────────────────────────────────────────────────

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
        // What's in the box right now — an Edit form arrives pre-filled, and
        // "send back what you were given, minus one change" is how a browser edits.
        value: type === "checkbox"
          ? (/\bchecked\b/i.test(attrs) ? "true" : "false")
          : (at("value") ?? ""),
        hidden: type === "hidden",
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

  // The pre-filled form, sent back as-is (hidden fields included) with an
  // override or two — exactly what a browser does when you change one box.
  const bodyAsRendered = (fields, overrides, token) => {
    const body = {};
    for (const f of fields) body[f.name] = overrides[f.name] ?? f.value;
    if (token) body.__RequestVerificationToken = token;
    return body;
  };

  // A bad edit: hidden fields keep their values (the Id has to survive, or
  // you're testing the wrong failure), everything visible gets rubbish.
  const bodyBadEdit = (fields, token) => {
    const body = {};
    for (const f of fields) body[f.name] = f.hidden ? f.value : invalidValue(f);
    if (token) body.__RequestVerificationToken = token;
    return body;
  };

  const tokenOf = (html) => {
    const m = String(html).match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
    return m ? m[1] : "";
  };

  const hasErrors = (html) =>
    /field-validation-error/.test(html) || /validation-summary-errors/.test(html);

  // The first field a human would call "the name" — text-ish, visible, no
  // preset options. It's the one the edit changes and the pages display.
  const textField = (fields) => fields.find(f =>
    !f.hidden && !f.isNumber && !f.options && f.type !== "checkbox" &&
    f.type !== "date" && f.type !== "datetime-local" && f.type !== "time");

  const clip = (v, f) => (f && f.lenMax && v.length > f.lenMax) ? v.slice(0, f.lenMax) : v;

  // ── the stale-checker trap ──────────────────────────────────────────────────
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
   * Returns { route, checks, earned, ..., leftBehind, markerWasAlreadyThere }
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
      [1, "a new record can still be filed"],
      [2, "the Edit form shows the record, pre-filled"],
      [3, "a correction is saved — as an update, not a copy"],
      [1, "a bad correction is refused"],
      [1, "Delete asks before deleting"],
      [3, "the record can be deleted"],
    ];
    const blockRest = (from) => REST.slice(from).forEach(([pts, label]) =>
      add("blocked", pts, label, { hint: "waiting on an earlier step" }));

    // True only if our record survived a failed delete — the one dirty exit.
    let leftBehind = false;
    // A marker from an earlier run (week 7's, or a failed week-8 delete)
    // already on the page = a row that outlived restarts. Grader evidence.
    let markerWasAlreadyThere = false;
    const done = (route) => ({
      route, checks, stale: [...stale], leftBehind, markerWasAlreadyThere, ...tally(checks),
    });

    // ── 0. their home page ────────────────────────────────────────────────────
    const home = await getWithWakeup(root + "/");
    if (!home || home.status >= 400) {
      const broke = home && home.status >= 500;
      add("fail", 1, "your list page still works", {
        hint: broke
          ? `your home page returned a ${home.status} — the app is running, but something in it is throwing.`
          : "your home page didn't even load — nothing else can be checked until it does.",
        todo: broke
          ? "Look at the terminal (or Azure's Log stream) for the real exception. If it mentions "
            + "a column name, your deployed app's database hasn't had this week's migration applied — "
            + "run  dotnet ef database update  from your project folder."
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

    const originalIds = detailsIds(index.body, route);
    markerWasAlreadyThere = index.body.includes(MARKER);

    add(originalIds.length >= 3 ? "pass" : "fail", 1,
      `your list page still works — ${originalIds.length} records`, {
        hint: originalIds.length === 0
          ? `/${route} loaded but there's nothing on it. If this worked last week, the likely `
            + "culprit is this week's migration never reaching the database your deployed app uses."
          : `I can only see ${originalIds.length} record(s) on /${route}.`,
        todo: "Your seeded records should all still be there — check that you ran "
            + "dotnet ef database update  after adding this week's migration.",
      });

    if (!originalIds.length) { blockRest(0); return done(route); }

    // ── 2. file the record the rest of the cycle uses ─────────────────────────
    const createUrl = `/${route}/Create`;
    const createPage = await getWithWakeup(root + createUrl);
    const createForm = createPage && createPage.status < 400 ? formHtml(createPage.body) : "";
    const createFields = createForm ? formFields(createForm) : [];

    if (createFields.length < 2) {
      add("fail", 1, "a new record can still be filed", {
        hint: `${createUrl} ${createPage && createPage.status < 400
          ? "loaded, but there's no usable <form method=\"post\"> on it"
          : `returned ${createPage ? createPage.status : "nothing"}`} — the form you've had since week 6 has to keep working.`,
        todo: "Weeks 6 and 7 built this; this week only adds neighbours. If it broke, check the "
            + "Create action and view are still intact.",
      });
      blockRest(1);
      return done(route);
    }
    staleCheckers(createPage.body).forEach(w => stale.add(w));

    const goodPost = await post(root + createUrl,
      bodyFrom(createFields, validValue, tokenOf(createPage.body)));
    const afterCreate = await getWithWakeup(`${root}/${route}`);
    const idsAfterCreate = afterCreate ? detailsIds(afterCreate.body, route) : originalIds;
    const newIds = idsAfterCreate.filter(id => !originalIds.includes(id));
    const created = goodPost && goodPost.redirected && newIds.length === 1;

    add(created ? "pass" : "fail", 1,
      `a new record can still be filed${created ? ` — id ${newIds[0]}` : ""}`, {
        hint: !goodPost
          ? "the submission didn't get a response at all."
          : !goodPost.redirected
            ? `I filled your form using your own rules and got a ${goodPost.status} back instead of a redirect.`
            : newIds.length === 0
              ? "you redirected, but nothing new turned up on your list page."
              : `expected exactly one new record and found ${newIds.length}.`,
        todo: "Week 7's POST action should still work: Add, SaveChanges, redirect. Everything "
            + "after this check edits and deletes the record it creates, so it can't proceed.",
      });

    if (!created) { blockRest(2); return done(route); }
    const id = newIds[0];
    leftBehind = true;                          // until the delete succeeds

    // ── 3. the Edit form, pre-filled ──────────────────────────────────────────
    const editUrl = `/${route}/Edit/${id}`;
    const editPage = await getWithWakeup(root + editUrl);
    const editForm = editPage && editPage.status < 400 ? formHtml(editPage.body) : "";
    const editFields = editForm ? formFields(editForm) : [];

    const idField = editFields.find(f => f.name.toLowerCase() === "id");
    const posted = bodyFrom(createFields, validValue, null);
    const prefilled = editFields.filter(f => !f.hidden && posted[f.name] !== undefined)
                                .filter(f => String(f.value) === String(posted[f.name]));

    const editOk = editFields.length >= 2 && idField && String(idField.value) === String(id)
                   && prefilled.length >= 1;

    add(editOk ? "pass" : "fail", 2,
      `the Edit form shows the record, pre-filled — ${editUrl}`, {
        hint: !editPage || editPage.status >= 400
          ? `${editUrl} returned ${editPage ? editPage.status : "nothing"}. The scaffold's Edit pair `
            + "gives you this URL shape for free — if you haven't ported it yet, that's this week's work."
          : !editFields.length
            ? "the Edit page loaded but has no POST form on it."
          : !idField
            ? "the Edit form has no Id field. The hidden Id is how the POST knows which record "
              + "it's editing — that was the reading question, and this is where it's answered:\n"
              + "<input type=\"hidden\" asp-for=\"Id\" />"
          : String(idField.value) !== String(id)
            ? `the form's Id says ${idField.value} but the URL says ${id}.`
            : "the form isn't pre-filled — the boxes should already hold the record's current "
              + "values. The GET half looks the record up and passes it to the view.",
        todo: "Port the scaffold's Edit actions and view, then re-style the view to match your "
            + "site. GET fills the form; POST saves it.",
      });

    if (!editOk) { blockRest(2); return done(route); }

    // ── 4. a correction is saved — and it's an UPDATE ─────────────────────────
    const target = textField(editFields);
    const editedValue = clip(EDITED, target);
    const overrides = target ? { [target.name]: editedValue } : {};
    const editPost = await post(root + editUrl,
      bodyAsRendered(editFields, overrides, tokenOf(editPage.body)));

    const afterEdit = await getWithWakeup(`${root}/${route}`);
    const idsAfterEdit = afterEdit ? detailsIds(afterEdit.body, route) : [];
    const sameCount = idsAfterEdit.length === idsAfterCreate.length;
    const detailsAfterEdit = await getWithWakeup(`${root}/${route}/Details/${id}`);
    const valueSaved = detailsAfterEdit && detailsAfterEdit.status < 400 &&
                       detailsAfterEdit.body.includes(editedValue);

    add(editPost && editPost.redirected && sameCount && valueSaved ? "pass" : "fail", 3,
      "a correction is saved — as an update, not a copy", {
        hint: !editPost
          ? "the edit submission didn't get a response at all."
          : editPost.status === 404
            ? "posting the edit came back 404. The action compares the URL's id with the posted "
              + "record's Id and refuses a mismatch — if the hidden Id field is missing or empty, "
              + "this is exactly what you see."
          : !editPost.redirected
            ? `posting a valid correction returned ${editPost.status} instead of a redirect.`
          : !sameCount
            ? `the edit went through, but your list grew from ${idsAfterCreate.length} to `
              + `${idsAfterEdit.length} records — the POST filed a duplicate instead of updating. `
              + "That's Add where Update should be."
          : "you redirected, but the record still shows its old value. Update() only marks the "
            + "record modified — nothing reaches the database until SaveChangesAsync().",
        todo: "The scaffold's POST half is the reference: _context.Update(item); "
            + "await _context.SaveChangesAsync(); then redirect.",
      });

    // ── 5. a bad correction is refused ────────────────────────────────────────
    const freshEdit = await getWithWakeup(root + editUrl);
    const freshFields = freshEdit && freshEdit.status < 400 ? formFields(formHtml(freshEdit.body)) : [];
    const badPost = freshFields.length
      ? await post(root + editUrl, bodyBadEdit(freshFields, tokenOf(freshEdit.body)))
      : null;
    const badRefused = badPost && !badPost.redirected && badPost.status === 200 && hasErrors(badPost.body);

    const detailsAfterBad = await getWithWakeup(`${root}/${route}/Details/${id}`);
    const survived = detailsAfterBad && detailsAfterBad.status < 400 &&
                     detailsAfterBad.body.includes(editedValue);

    add(badRefused && survived ? "pass" : "fail", 1,
      "a bad correction is refused", {
        hint: !badPost
          ? "the bad edit didn't get a response at all."
          : badPost.redirected
            ? "I filled your Edit form with rubbish and it was accepted. The ModelState.IsValid "
              + "guard belongs in the Edit POST too — the scaffold has it; keep it."
          : !hasErrors(badPost.body)
            ? "the form came back, but with no error messages on it."
            : "the bad edit was refused, but it still changed the record.",
        todo: "Same guard as Create, same place — before the Update:\n"
            + "if (!ModelState.IsValid) { return View(item); }",
      });

    // ── 6. Delete asks first ──────────────────────────────────────────────────
    const deleteUrl = `/${route}/Delete/${id}`;
    const confirmPage = await getWithWakeup(root + deleteUrl);
    const confirmOk = confirmPage && confirmPage.status < 400;
    const showsRecord = confirmOk && confirmPage.body.includes(editedValue);
    const hasForm = confirmOk && !!formHtml(confirmPage.body);

    const afterConfirm = await getWithWakeup(`${root}/${route}`);
    const stillThere = afterConfirm && detailsIds(afterConfirm.body, route).includes(id);

    add(confirmOk && showsRecord && hasForm && stillThere ? "pass" : "fail", 1,
      `Delete asks before deleting — ${deleteUrl}`, {
        hint: !confirmOk
          ? `${deleteUrl} returned ${confirmPage ? confirmPage.status : "nothing"} — the Delete GET `
            + "shows a confirmation page, and the scaffold gives you the whole pair."
          : !stillThere
            ? "loading the confirmation page DELETED the record. The GET only ever shows the page — "
              + "the deletion lives in the POST, behind the button. Links and previews fire GETs; "
              + "a GET that changes data is a record that vanishes because something crawled it."
          : !showsRecord
            ? "the confirmation page doesn't show the record it's about to delete — nobody should "
              + "confirm a deletion blind."
            : "the confirmation page has no POST form on it, so there's no way to actually delete.",
        todo: "Port the scaffold's Delete pair: GET shows the record with a form; POST "
            + "(DeleteConfirmed, with [ActionName(\"Delete\")]) does the deletion.",
      });

    // ── 7. the record can be deleted ──────────────────────────────────────────
    const confirmFields = confirmOk ? formFields(formHtml(confirmPage.body)) : [];
    const deletePost = confirmOk
      ? await post(root + deleteUrl, bodyAsRendered(confirmFields, {}, tokenOf(confirmPage.body)))
      : null;

    const afterDelete = await getWithWakeup(`${root}/${route}`);
    const idsAfterDelete = afterDelete ? detailsIds(afterDelete.body, route) : [];
    const gone = !idsAfterDelete.includes(id) &&
                 idsAfterDelete.length === originalIds.length &&
                 afterDelete && !afterDelete.body.includes(editedValue);
    const details404 = (await getWithWakeup(`${root}/${route}/Details/${id}`))?.status === 404;

    if (deletePost && deletePost.redirected && gone) leftBehind = false;

    add(deletePost && deletePost.redirected && gone && details404 ? "pass" : "fail", 3,
      "the record can be deleted — and your data is back exactly as I found it", {
        hint: !deletePost
          ? "the delete confirmation didn't get a response at all."
          : !deletePost.redirected
            ? `posting the confirmation returned ${deletePost.status} instead of a redirect. If `
              + "it's a 405, the POST half is missing — the scaffold's DeleteConfirmed with "
              + "[HttpPost, ActionName(\"Delete\")] is what answers this URL."
          : !gone
            ? "the confirmation posted and redirected, but the record is still in your list. "
              + "Remove() only marks it — the DELETE runs at SaveChangesAsync()."
            : "the record left the list, but its Details page doesn't 404 — Details should look "
              + "the id up and return NotFound() when it's gone.",
        todo: "Port the scaffold's DeleteConfirmed as-is: FindAsync, Remove, "
            + "await SaveChangesAsync(), redirect.",
      });

    return done(route);
  }

  // Printed above the score, because a stale checker makes the score itself suspect.
  const staleWarning = (stale) => stale && stale.length
    ? `Week ${stale.join(" and ")}'s self-check script is STILL installed in your app. It PASSES — `
      + `nothing this week breaks last week's requirements — so it prints a reassuring green report `
      + `about the wrong week. The tell is the first line: it should say Week ${WEEK}. Delete the old `
      + `<script> tag; this week's line REPLACES it.`
    : null;

  const BY_HAND = [
    "2 pts — your Edit and Delete actions are async (async Task<IActionResult>, await SaveChangesAsync)",
    "3 pts — a NEW migration that ADDS a column to your existing table (additive — your table has rows now; delete-and-regenerate stopped being an option)",
    "3 pts — 3+ meaningful commits, pushed to a public repo",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  const LEFTOVER = `The delete step didn't work, so a record called "${EDITED}" (or "${MARKER}") is `
    + "still in your list. It's the test record this script created — once your Delete works, run "
    + "recheck() and it cleans up after itself.";

  const WHERE_THE_POINTS_ARE =
    "12 of the 20 points are in this script this week — up from 6. Last week's work was invisible "
    + "from outside; edit and delete are not. A checker can watch a record change and disappear, "
    + "so that's exactly what this one does. The other 8: async actions and an additive migration "
    + "(5, from your repo) and commits (3).";

  // ── Node: export for the grader, and support `node homework-checks.js <url>` ──
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { runChecks, MARKER, EDITED };
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
      console.log("   ⚠️  this files, edits and deletes a test record — see the note at the end\n");
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
      else console.log("\n🎉 The full CRUD cycle works on your deployed site — created, edited, refused, confirmed, deleted.");

      if (res.markerWasAlreadyThere) {
        console.log(`\n💾 A "${MARKER}" from an earlier run was already in your list before I touched `
          + "anything — that row outlived whatever happened to your app in between. (This week's "
          + "run cleans up after itself; that one is yours to delete, and now you have a button for it.)");
      }
      if (res.leftBehind) console.log(`\n🧹 ${LEFTOVER}`);
      console.log(`\nℹ️  ${WHERE_THE_POINTS_ARE}`);
      console.log("\nThe other 8 points I check in your repo:");
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
        console.log("%c🎉 The full CRUD cycle works on your deployed site — created, edited, refused, confirmed, deleted.", `${bold}; color: green`);
      }

      if (res.markerWasAlreadyThere) {
        console.log(`%c💾 A "${MARKER}" from an earlier run was already in your list before I touched anything — `
          + "that row outlived whatever happened in between. This week's run cleans up after itself; "
          + "that one is yours to delete, and now you have a button for it.", "color: green");
      }
      if (res.leftBehind) console.log(`%c🧹 ${LEFTOVER}`, "color: #d29922");
      console.log(`%cℹ️  ${WHERE_THE_POINTS_ARE}`, "color: #79c0ff");
      console.log("%cThe other 8 points I check in your repo:", bold);
      BY_HAND.forEach(l => console.log("   • " + l.trim()));
      console.log("%cType  recheck()  to run again — or  recheck(\"Trails\")  with your controller name.", "color: #79c0ff");
    };

    const run = (forcedRoute) => {
      console.log(`%c🔎 Week ${WEEK} self-check — ${window.location.origin}`, big);
      console.log("Results appear as each check finishes — a sleeping free-tier app can take ~30s for the first one.");
      console.log("%c⚠️  This files a test record, edits it, and deletes it — a full CRUD cycle through your own forms.", "color: #d29922");
      if (forcedRoute) console.log(`Checking /${forcedRoute} directly (you told me where to look).`);
      return runChecks(window.location.origin, forcedRoute || null, printCheck).then(report);
    };

    window.recheck = run;
    run();
  }
})();
