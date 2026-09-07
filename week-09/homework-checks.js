// ═══════════════════════════════════════════════════════════════════════════
//  Week 9 homework self-check — the SAME checks I grade with.
//
//  EASIEST WAY — include it like a CDN, exactly like last week. Open
//  Views/Home/Index.cshtml, find the week-08 line, and REPLACE it:
//
//    @section Scripts {
//        <script src="https://jgrissom.github.io/dotnet-web-dev/week-09/homework-checks.js"></script>
//    }
//
//  Then load that page and open the console (F12). NOTHING RUNS ON ITS OWN.
//  Type  recheck()  when you want it to run.
//
//  ⚠️  IT FILES A REPORT THROUGH YOUR SECOND FORM, and it cannot take it back
//  — nothing this week asks you to build a delete for the second table. So it
//  files ONE, marked "Week 9 Test", and every run after that REUSES that same
//  row instead of adding another. If you want it gone, delete it by hand in
//  the mssql panel. One row, once, no matter how many times you run this.
//
//  It does NOT need to know what you called anything. Your second table might
//  be sightings, reviews, showtimes or players. What it looks for is a form
//  with a dropdown whose values are the ids of records on your list page —
//  because that dropdown IS the foreign key, whatever you named it.
//
//  12 of the 20 points are in here. The rest: 5 from your repo (the model and
//  the migration that creates the second table) and 3 from commits.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const WEEK = 9;
  const MARKER = `Week ${WEEK} Test`;
  // Recognizes a leftover from ANY week, and survives being clipped to a short
  // StringLength — the marker is trimmed to fit their own rules before it's sent.
  const MARKER_RX = /Week\s*\d+/i;

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

  // What a browser would POST to: the form's own action, not a URL we assumed.
  const formAction = (html) => {
    const m = /<form[^>]*\saction\s*=\s*["']([^"']*)["']/i.exec(String(html || ""));
    return m ? m[1].trim() : null;
  };

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

  // A rule that can only be there because you typed an attribute. Every
  // non-nullable property is marked required by the framework whether you
  // asked for it or not, so data-val-required proves nothing on its own.
  const hasTypedRule = (f) =>
    f.rangeMin !== null && f.rangeMin !== undefined ||
    f.rangeMax !== null && f.rangeMax !== undefined ||
    (f.lenMin !== null && f.lenMin !== undefined) ||
    (f.lenMax !== null && f.lenMax !== undefined);

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

  // The same, but every visible box leaves here carrying a value. An unbound
  // property can only be SEEN to vanish if it had something to lose: a column
  // the model grew this week is empty on a freshly filed record, so posting the
  // form back untouched would prove nothing either way.
  const bodyFilled = (fields, overrides, token) => {
    const body = {};
    for (const f of fields) {
      if (overrides[f.name] !== undefined) body[f.name] = overrides[f.name];
      else if (f.hidden) body[f.name] = f.value;           // the Id has to survive intact
      else body[f.name] = f.value !== "" ? f.value : validValue(f);
    }
    if (token) body.__RequestVerificationToken = token;
    return body;
  };

  // Boxes whose round trip is worth trusting: real <input>s, visible, and not
  // checkboxes (whose "value" is a tick, not text) or <select>s (whose value
  // lives on an <option>, so reading it back always looks empty).
  const roundTrips = (f) => !f.hidden && f.tag === "input" && f.type !== "checkbox";

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
  async function runChecks(baseUrl, forcedRoute, onCheck, opts = {}) {
    // Read-only unless asked. Nothing is submitted on a page load.
    const write = opts.write !== false;
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
      if (onCheck) onCheck(c);
      return c;
    };

    const REST = [
      [2, "there's a form for filing a related record"],
      [2, "it asks which record the new one belongs to"],
      [2, "a bad entry is refused"],
      [2, "a good entry is saved"],
      [3, "and it appears on that record's own page"],
    ];
    let blockHint = "waiting on an earlier step";
    const blockRest = (from) => REST.slice(from).forEach(([pts, label]) =>
      add("blocked", pts, label, { hint: blockHint }));

    // This week's script cannot clean up after itself — nothing here asks you
    // to build a delete for the second table — so it files at most one row,
    // ever, and reuses it forever after.
    let leftBehind = false;
    let markerWasAlreadyThere = false;
    let adopted = false;
    let childFormUrl = null;
    // Exported for the grader: the field names on the second form, which is
    // the only way to see whether the FK actually reached the deployed page.
    let childFieldNames = [];

    const done = (route) => ({
      route, checks, stale: [...stale], leftBehind, markerWasAlreadyThere,
      adopted, childFormUrl, childFieldNames, readOnly: !write, ...tally(checks),
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
          ? "Look at the terminal (or Azure's Log stream) for the real exception. If it names a "
            + "column or a table, your deployed app's database hasn't had this week's migration "
            + "applied — run  dotnet ef database update  against it."
          : "Start your app (dotnet watch), or check that your deployed URL is right.",
      });
      blockRest(0);
      return done(null);
    }
    staleCheckers(home.body).forEach(w => stale.add(w));

    // ── 1. find their list controller, the way a visitor would ────────────────
    const tries = forcedRoute ? [forcedRoute] : navCandidates(home.body);
    let route = null, index = null;
    const unreachable = [];
    for (const cand of tries) {
      const page = await getWithWakeup(`${root}/${cand}`);
      if (!page || page.status >= 400) { unreachable.push({ cand, status: page ? page.status : 0 }); continue; }
      if (detailsIds(page.body, cand).length) { route = cand; index = page; break; }
      if (!route) { route = cand; index = page; }
    }

    if (!route) {
      add("fail", 1, "your list page still works", {
        hint: unreachable.length
          ? `your navbar links to /${unreachable[0].cand}, and that's right — but the page came back `
            + `${unreachable[0].status || "nothing"}, so I can't read anything from it.`
          : "I couldn't find a link in your navbar that reaches a controller of yours, so I don't "
            + "know where your list page is.",
        todo: "That nav link has been a requirement since week 4. Check you still have it. "
            + "Not there yet? Run  recheck(\"Trails\")  with YOUR controller name.",
      });
      blockRest(0);
      return done(null);
    }
    staleCheckers(index.body).forEach(w => stale.add(w));

    const parentIds = detailsIds(index.body, route);
    markerWasAlreadyThere = MARKER_RX.test(index.body);

    add(parentIds.length >= 3 ? "pass" : "fail", 1,
      `your list page still works — ${parentIds.length} records`, {
        hint: parentIds.length === 0
          ? `/${route} loaded but there's nothing on it. If this worked last week, the likely `
            + "culprit is this week's migration never reaching the database your deployed app uses."
          : `I can only see ${parentIds.length} record(s) on /${route}.`,
        todo: "Your seeded records should all still be there — check that you ran "
            + "dotnet ef database update  after adding this week's migration.",
      });

    if (!parentIds.length) { blockRest(0); return done(route); }

    // ── 2. find the form that files a RELATED record ──────────────────────────
    //
    // This is the whole trick, and it needs to know nothing about your topic.
    // A form that files a child has a dropdown whose option values are the ids
    // of records on your list page. That dropdown IS the foreign key.
    const parentIdSet = new Set(parentIds.map(Number));
    const seenUrls = new Set();
    const candidates = [];
    const pushCandidate = (href) => {
      if (!href) return;
      const u = String(href).split("#")[0].split("?")[0];
      if (!u.startsWith("/")) return;
      if (/\.(css|js|png|jpe?g|webp|svg|ico)$/i.test(u)) return;
      // Not the parent's own pages — those are last week's app.
      if (new RegExp(`^/${route}(/(Index|Create|Edit|Delete|Details)?)?(/\\d+)?/?$`, "i").test(u)) return;
      const key = u.toLowerCase();
      if (seenUrls.has(key)) return;
      seenUrls.add(key);
      candidates.push(u);
    };

    // Links on a record's own page first — "add one of these" belongs there.
    const firstDetails = await getWithWakeup(`${root}/${route}/Details/${parentIds[0]}`);
    if (firstDetails && firstDetails.status < 400) {
      staleCheckers(firstDetails.body).forEach(w => stale.add(w));
      for (const m of firstDetails.body.matchAll(/href="([^"]+)"/gi)) pushCandidate(m[1]);
    }
    // Then a Create on every other controller in the navbar.
    for (const c of navCandidates(home.body)) {
      if (c.toLowerCase() === route.toLowerCase()) continue;
      pushCandidate(`/${c}/Create`);
    }

    let anyFormUrl = null, anyForm = "", anyFields = [];
    let fkForm = null;

    for (const u of candidates.slice(0, 14)) {
      const page = await getWithWakeup(root + u);
      if (!page || page.status >= 400) continue;
      const f = formHtml(page.body);
      if (!f) continue;
      const fields = formFields(f);
      if (fields.length < 2) continue;
      staleCheckers(page.body).forEach(w => stale.add(w));

      if (!anyFormUrl) { anyFormUrl = u; anyForm = f; anyFields = fields; }

      const sel = fields.find(x => x.options && x.options.length &&
        x.options.map(Number).filter(v => parentIdSet.has(v)).length >= Math.min(2, parentIdSet.size));
      if (sel) { fkForm = { url: u, form: f, fields, sel }; break; }
    }

    if (!anyFormUrl && !fkForm) {
      add("fail", 2, "there's a form for filing a related record", {
        hint: "I couldn't find a second form anywhere. I looked at every link on "
            + `/${route}/Details/${parentIds[0]} and at /Create on every other controller in your navbar.`,
        todo: "Your second table needs a way in: a controller of its own with a Create pair, a view "
            + "with the form, and a link to it from a record's details page so I (and a visitor) "
            + "can find it.",
      });
      blockRest(1);
      return done(route);
    }

    childFormUrl = fkForm ? fkForm.url : anyFormUrl;
    const childForm = fkForm ? fkForm.form : anyForm;
    const childFields = fkForm ? fkForm.fields : anyFields;
    childFieldNames = childFields.map(f => f.name);

    add("pass", 2, `there's a form for filing a related record — ${childFormUrl}`);

    // ── 3. does it say which record the new one belongs to? ───────────────────
    if (!fkForm) {
      add("fail", 2, "it asks which record the new one belongs to", {
        hint: `${childFormUrl} has a form on it, but nothing on that form offers your `
            + `${route} records to choose from. Without that, a new row has no way to say which `
            + "record it belongs to — which is the entire point of a second, RELATED table.",
        todo: "Build the list in the controller and hand it to the view:\n"
            + "    Parents = new SelectList(_context.Yours.OrderBy(x => x.Name), \"Id\", \"Name\")\n"
            + "...then render it: <select asp-for=\"Child.ParentId\" asp-items=\"Model.Parents\">",
      });
      blockRest(2);
      return done(route);
    }

    add("pass", 2, `it asks which record the new one belongs to — ${fkForm.sel.name}`);

    // ── the three that write ──────────────────────────────────────────────────
    const WAIT = "run  recheck()  to include this — it submits your form, so it isn't automatic";
    if (!write) { blockHint = WAIT; blockRest(2); return done(route); }

    // Which record we attach the test report to. Always the same one, so the
    // adopt-don't-add rule has something stable to look for.
    const parentId = parentIds[0];
    const parentUrl = `/${route}/Details/${parentId}`;
    const parentBefore = await getWithWakeup(root + parentUrl);
    const alreadyFiled = parentBefore && parentBefore.status < 400 && MARKER_RX.test(parentBefore.body);
    if (alreadyFiled) { markerWasAlreadyThere = true; adopted = true; }

    const action = formAction(childForm) || childFormUrl;
    const postUrl = action.startsWith("http") ? action : root + (action.startsWith("/") ? action : "/" + action);

    // ── 4. a bad entry is refused ─────────────────────────────────────────────
    const typedRule = childFields.some(f => !f.hidden && hasTypedRule(f));

    if (!typedRule) {
      add("fail", 2, "a bad entry is refused", {
        hint: "nothing on your second form carries a validation rule you wrote. ASP.NET marks every "
            + "non-nullable property required on its own, so 'it rejects a blank form' proves "
            + "nothing about your model.",
        todo: "Put at least one real rule on your second model, the way you did in week 6 — a "
            + "[StringLength], a [Range], something with a number in it. Then this can test it.",
      });
    } else {
      const badPage = await getWithWakeup(root + childFormUrl);
      const badToken = tokenOf(badPage ? badPage.body : "");
      const bad = await post(postUrl, bodyFrom(childFields, (f) =>
        (f === fkForm.sel ? String(parentId) : invalidValue(f)), badToken));

      const refused = bad && !bad.redirected && bad.status < 400 && hasErrors(bad.body);
      add(refused ? "pass" : "fail", 2, "a bad entry is refused", {
        hint: bad && bad.redirected
          ? "I sent a report that breaks your own rules and your app SAVED it — it redirected, "
            + "which is what a success looks like."
          : `posting a bad report came back ${bad ? bad.status : "nothing"} with no validation `
            + "errors on the page.",
        todo: "The POST needs its guard before it saves:\n"
            + "    if (!ModelState.IsValid)\n"
            + "    {\n"
            + "        form.Parents = /* rebuild the dropdown */;\n"
            + "        return View(form);\n"
            + "    }\n"
            + "...and the view needs <div asp-validation-summary=\"All\"> so the errors show.",
      });
    }

    // ── 5. a good entry is saved ──────────────────────────────────────────────
    if (adopted) {
      add("pass", 2, "a good entry is saved — reused the one from an earlier run");
    } else {
      const goodPage = await getWithWakeup(root + childFormUrl);
      const goodToken = tokenOf(goodPage ? goodPage.body : "");
      const good = await post(postUrl, bodyFrom(childFields, (f) =>
        (f === fkForm.sel ? String(parentId) : validValue(f)), goodToken));

      const saved = good && (good.redirected || (good.status < 400 && !hasErrors(good.body)));
      if (saved) leftBehind = true;

      add(saved ? "pass" : "fail", 2, "a good entry is saved", {
        hint: good && hasErrors(good.body)
          ? "I filled in every box on your form using your own rules and your app still refused it. "
            + "Something is required that the form never offers a way to fill in — a property with "
            + "no input on the page is the usual cause."
          : `posting a valid report came back ${good ? good.status : "nothing"} instead of a redirect.`,
        todo: "After saving, send the browser somewhere:\n"
            + "    _context.Yours.Add(form.Child);\n"
            + "    await _context.SaveChangesAsync();\n"
            + "    return RedirectToAction(\"Details\", \"Parent\", new { id = form.Child.ParentId });",
      });

      if (!saved) { add("blocked", 3, "and it appears on that record's own page", { hint: "waiting on an earlier step" }); return done(route); }
    }

    // ── 6. and it appears on that record's own page ───────────────────────────
    //
    // The one that catches the whole week. The row is in the database — check 5
    // just put it there — so if the page doesn't show it, the query didn't ask.
    const parentAfter = await getWithWakeup(root + parentUrl);
    const shows = parentAfter && parentAfter.status < 400 && MARKER_RX.test(parentAfter.body);

    add(shows ? "pass" : "fail", 3, "and it appears on that record's own page", {
      hint: `the report is saved — your form accepted it — but ${parentUrl} doesn't show it. `
          + "This is the week's whole lesson: a navigation property is EMPTY until the query asks "
          + "for it. No exception, no warning. An empty list looks exactly like a record that has "
          + "no related rows yet.",
      todo: "Two halves, and you need both:\n"
          + "    var parent = _context.Yours\n"
          + "        .Include(p => p.Children)\n"
          + "        .FirstOrDefault(p => p.Id == id);\n"
          + "...and then render them in Details.cshtml — @foreach (var child in Model.Children).",
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
    "2 pts — your second model has a foreign key property and a navigation property, and your first model has the collection pointing back",
    "3 pts — a NEW migration that CREATES the second table (CreateTable plus a foreign key — additive, on top of the migrations you already have)",
    "3 pts — 3+ meaningful commits, pushed to a public repo",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  const LEFTOVER = `This filed one report marked "${MARKER}" against your first record, and it `
    + "cannot take it back — nothing this week asks you to build a delete for the second table. "
    + "Every run after this one REUSES that same row rather than adding another, so it stays at "
    + "one no matter how often you check. Remove it by hand in the mssql panel if you want it gone.";

  const WHERE_THE_POINTS_ARE =
    "12 of the 20 points are in this script. A relationship is visible from outside — a report "
    + "filed against one record has to turn up on that record's page and nowhere else — so that "
    + "is exactly what this checks. The other 8: the model and the migration that create the "
    + "second table (5, from your repo) and commits (3).";

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
      console.log("   ⚠️  this files ONE report through your second form and reuses it forever after — see the note at the end\n");
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
      } else if (res.readOnly) {
        console.log("%c👉 Next: everything readable passes. Type  recheck()  to run the four that submit a form.", `${bold}; color: #79c0ff`);
      } else if (isLocal(window.location.origin)) {
        console.log("%c⚠️  This is localhost. Run it again on your Azure URL — the deployed one is what I grade.", `${bold}; color: #d29922`);
      } else {
        console.log("%c🎉 The full CRUD cycle works on your deployed site — created, edited, refused, confirmed, deleted.", `${bold}; color: green`);
      }

      if (res.leftBehind) console.log(`%c🧹 ${LEFTOVER}`, "color: #d29922");
      console.log(`%cℹ️  ${WHERE_THE_POINTS_ARE}`, "color: #79c0ff");
      console.log("%cThe other 8 points I check in your repo:", bold);
      BY_HAND.forEach(l => console.log("   • " + l.trim()));
      console.log("%cType  recheck()  to run again — or  recheck(\"Trails\")  with your controller name.", "color: #79c0ff");
    };

    const run = (forcedRoute, write) => {
      console.log(`%c🔎 Week ${WEEK} self-check — ${window.location.origin}`, big);
      console.log("Results appear as each check finishes — a sleeping free-tier app can take ~30s for the first one.");
      if (write) {
        console.log("%c⚠️  This files a test record, edits it, and deletes it — a full CRUD cycle through your own forms.", "color: #d29922");
      } else {
        console.log("%c👀 Reading only — nothing is submitted, so reloading your app never touches your data.", "color: #79c0ff");
        console.log("%cThe four checks that need to submit a form are waiting. Type  recheck()  to run them.", "color: #79c0ff");
      }
      if (forcedRoute) console.log(`Checking /${forcedRoute} directly (you told me where to look).`);
      return runChecks(window.location.origin, forcedRoute || null, printCheck, { write }).then(report);
    };

    // Nothing runs on load. Typing recheck() is the consent, and it's the only
    // path that touches your data.
    window.recheck = (forcedRoute) => run(forcedRoute, true);

    console.log(`%c🔎 Week ${WEEK} self-check is loaded — but it hasn't run.`, big);
    console.log("%cType  recheck()  to check your work. It submits your form, so nothing happens until you ask.",
      "color: #79c0ff");
    console.log("%cWorking on a different controller than I'd guess?  recheck(\"Trails\")  with your own name.",
      "color: #79c0ff");
  }
})();
