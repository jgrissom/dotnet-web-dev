// ═══════════════════════════════════════════════════════════════════════════
//  Week 6 homework self-check — the SAME checks I grade with.
//
//  EASIEST WAY — include it like a CDN, exactly like last week. Open
//  Views/Home/Index.cshtml, find the week-05 line, and REPLACE it:
//
//    @section Scripts {
//        <script src="https://jgrissom.github.io/dotnet-web-dev/week-06/homework-checks.js"></script>
//    }
//
//  Then load that page and open the console (F12). It runs automatically.
//  Type  recheck()  to run it again without reloading.
//
//  ⚠️  THIS ONE FILLS YOUR FORM IN AND SUBMITS IT. Twice: once with rubbish,
//  to check you refuse it, and once with a good record, to check you accept it.
//  That second one leaves a real item called "SelfCheck entry" in your list.
//  It's supposed to. It disappears the next time your app restarts, because
//  your data still lives in a static List<T> — which is week 7's whole point.
//
//  THIS IS A FINISH LINE, NOT A PROGRESS BAR. It can't tell you much until
//  there's a form to submit. Build first; check when you think you're done,
//  then again on your deployed URL before submitting.
//
//  Your topic is your own, so nothing here is hard-coded: it finds your
//  controller by following the link in your navbar, finds your form by
//  following the link on your list page, and works out what to type into the
//  form by reading the validation rules your own model put in the HTML.
//
//  (Have Node installed? `node homework-checks.js <url>` works too.)
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const WEEK = 6;
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

  const detailsIds = (html, route) => [...new Set(
    [...html.matchAll(new RegExp(`/${route}/Details/(\\d+)`, "gi"))].map(m => m[1])
  )];

  // ── reading their form ──────────────────────────────────────────────────────

  const num = (s) => (s === undefined || s === null || s === "" ? null : Number(s));

  function formHtml(html) {
    const m = String(html).match(/<form[^>]*method=["']post["'][\s\S]*?<\/form>/i);
    return m ? m[0] : "";
  }

  // Every field the form will actually submit, with whatever rules the student's
  // annotations printed into the markup. This is how the check knows what to type.
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
        // which data-val-* rules this field carries, e.g. ["required","length"]
        rules: [...new Set([...attrs.matchAll(/\bdata-val-([a-z]+)/gi)].map(x => x[1].toLowerCase()))]
                 .filter(r => r !== "val"),
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

  // "Rules a student had to ask for." required is free — ASP.NET marks every
  // non-nullable property required on its own — so it proves nothing about
  // whether they wrote any annotations. These ones can only come from an attribute.
  const EARNED_RULES = ["length", "range", "regex", "email", "url", "compare", "minlength", "maxlength", "phone", "creditcard"];
  const earnedRules = (fields) =>
    [...new Set(fields.flatMap(f => f.rules).filter(r => EARNED_RULES.includes(r)))];

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

  // Deliberately wrong, per field, using their own rules against them:
  // over the top of a [Range], past the end of a [StringLength], else blank
  // (which trips [Required], and trips a non-nullable number too).
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
  // Last week's script is still installed, and it PASSES: it checks week 5's
  // requirements, and week 6 breaks none of them. Leave it in and you read a
  // screen of green ticks for work you did seven days ago.
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
      [2, "your form page is a real form that posts"],
      [3, "your fields carry your model's rules"],
      [3, "a bad submission is refused, with messages"],
      [2, "a good submission is accepted and lands in your list"],
      [2, "validation runs in the browser too"],
    ];
    const blockRest = (from) => REST.slice(from).forEach(([pts, label]) =>
      add("blocked", pts, label, { hint: "waiting on an earlier step" }));

    // Set only once a record has actually landed, so the "I left something behind"
    // note never appears on a run that never got as far as submitting anything.
    let addedARecord = false;
    const done = (route) => ({ route, checks, stale: [...stale], addedARecord, ...tally(checks) });

    // ── 0. their home page ────────────────────────────────────────────────────
    const home = await getWithWakeup(root + "/");
    if (!home || home.status >= 400) {
      const broke = home && home.status >= 500;
      add("fail", 2, "a link from your list page to your form", {
        hint: broke
          ? `your home page returned a ${home.status} — the app is running, but something in it is throwing.`
          : "your home page didn't even load — nothing else can be checked until it does.",
        todo: broke
          ? "Look at the terminal running dotnet watch; the real exception is there."
          : "Start your app (dotnet watch), or check that your deployed URL is right.",
      });
      blockRest(0);
      return done(null);
    }
    staleCheckers(home.body).forEach(w => stale.add(w));

    // ── 1. find their controller, the way a visitor would ─────────────────────
    const tries = forcedRoute ? [forcedRoute] : navCandidates(home.body);
    let route = null, index = null;
    // A navbar link whose page 404s or throws is not a missing navbar link —
    // remember those so the advice can tell the two apart.
    const unreachable = [];
    for (const cand of tries) {
      const page = await getWithWakeup(`${root}/${cand}`);
      if (!page || page.status >= 400) { unreachable.push({ cand, status: page ? page.status : 0 }); continue; }
      route = cand; index = page;
      if (detailsIds(page.body, cand).length) break;      // this is the real one
    }

    if (!route) {
      add("fail", 2, "a link from your list page to your form", {
        hint: unreachable.length
          ? (unreachable[0].status >= 500
              ? `your navbar links to /${unreachable[0].cand}, which is right — but that page came back `
                + `${unreachable[0].status}. The controller is there and something in it, or in its view, is throwing.`
              : `your navbar links to /${unreachable[0].cand}, and that's right — but the page came back `
                + `${unreachable[0].status || "nothing"}, so I can't read anything from it.`)
          : "I couldn't find a link in your navbar that reaches a controller of yours, so I don't "
            + "know where your list page is — and the form lives next to it.",
        todo: unreachable.length
          ? (unreachable[0].status >= 500
              ? `Your nav link is fine. Load /${unreachable[0].cand} in a browser and read the error, or look `
                + "at the terminal running your app — the real exception is there."
              : `Your nav link is fine, but /${unreachable[0].cand} isn't answering. Check that controller still `
                + "has its Index action and its view.")
          : "That nav link has been a requirement since week 4. Check you still have it. "
            + "Not there yet? Run  recheck(\"Trails\")  with YOUR controller name.",
      });
      blockRest(0);
      return done(null);
    }
    staleCheckers(index.body).forEach(w => stale.add(w));

    const createUrl = `/${route}/Create`;

    // ── 2. the form is reachable from the list page ───────────────────────────
    const linked = new RegExp(`href="[^"]*/${route}/Create"`, "i").test(index.body);
    const createPage = await getWithWakeup(root + createUrl);
    const createOk = createPage && createPage.status < 400;

    add(linked && createOk ? "pass" : "fail", 2,
      `a link from your list page to your form${linked && createOk ? ` — ${createUrl}` : ""}`, {
        hint: !createOk
          ? `${createUrl} returned ${createPage ? createPage.status : "nothing"}. I look for the form at `
            + `/${route}/Create specifically — that's the name the framework's own scaffolding uses, `
            + "and week 8 will assume it."
          : `${createUrl} works, but nothing on /${route} links to it. A page nobody can reach is a `
            + "page nobody uses.",
        todo: !createOk
          ? `Add a Create() action to your ${route} controller and a Views/${route}/Create.cshtml to go with it.`
          : `Add <a asp-action="Create" class="btn btn-primary">Add one</a> to the top of `
            + `Views/${route}/Index.cshtml — your LIST page, the one your nav link opens. `
            + `Not Views/Home/Index.cshtml: I only look at /${route}.`,
      });

    if (!createOk) { blockRest(0); return done(route); }
    staleCheckers(createPage.body).forEach(w => stale.add(w));

    // ── 3. it's a real form ───────────────────────────────────────────────────
    const form = formHtml(createPage.body);
    const fields = form ? formFields(form) : [];
    const hasSubmit = /<(button|input)[^>]*type=["']submit["']/i.test(form) ||
                      /<button(?![^>]*type=)[^>]*>/i.test(form);

    add(form && fields.length >= 2 && hasSubmit ? "pass" : "fail", 2,
      `your form page is a real form that posts${form && fields.length >= 2 ? ` — ${fields.length} fields` : ""}`, {
        hint: !form
          ? "there's no <form method=\"post\"> on that page. A form that doesn't post can't send anything."
          : fields.length < 2
            ? `I can only see ${fields.length} input${fields.length === 1 ? "" : "s"} inside your form. `
              + "It should collect the fields your model actually has."
            : "your form has no submit button, so there's no way to send it.",
        todo: "Build the form with tag helpers: <form asp-action=\"Create\" method=\"post\">, then a "
            + "<label asp-for=\"X\">, <input asp-for=\"X\"> and <span asp-validation-for=\"X\"> per field.",
      });

    if (!form || fields.length < 2) { blockRest(1); return done(route); }

    // ── 4. the rules made it into the HTML ────────────────────────────────────
    const earned = earnedRules(fields);

    // Two very different causes end up here, and they need opposite advice.
    // asp-for on a non-nullable property emits data-val-required for free, even
    // with no annotations at all — so if there is no data-val attribute of ANY
    // kind, the inputs aren't tag helpers and the annotations never had a way to
    // reach the HTML. Telling that student to add more annotations is a dead end.
    const anyDataVal = fields.some(f => f.rules.length > 0);

    add(earned.length ? "pass" : "fail", 3,
      `your fields carry your model's rules${earned.length ? ` — ${earned.map(r => "data-val-" + r).join(", ")}` : ""}`, {
        hint: anyDataVal
          ? "your inputs only carry data-val-required, and that one is free — ASP.NET marks every "
            + "non-nullable property required whether you ask it to or not. So I can't see a single "
            + "rule you actually wrote."
          : "your inputs carry no data-val attributes at all — not even the free data-val-required. "
            + "That means they aren't tag-helper inputs, so your annotations have no way of reaching "
            + "the HTML. They can be perfectly written and still never show up here.",
        todo: anyDataVal
          ? "Put real data annotations on your model: [StringLength(...)] on your text properties and "
            + "[Range(...)] on your numbers. They show up in the HTML as data-val-length and "
            + "data-val-range, and that's what I'm looking for."
          : "Build each field with asp-for rather than by hand: <label asp-for=\"X\">, "
            + "<input asp-for=\"X\"> and <span asp-validation-for=\"X\">. A hand-written "
            + "<input name=\"X\"> still binds, which is why the rest of the form looks fine — but it "
            + "carries none of your rules, and the view needs @model YourThing at the top.",
      });

    // ── 5. a bad submission is refused ────────────────────────────────────────
    const before = detailsIds(index.body, route).length;
    // Only now is it certain there's a form to submit: a missing or unreachable
    // Create page returned early above. Warn here rather than at the top of the
    // run, so a student checking their progress before the form exists isn't
    // told about a record that never gets created.
    if (typeof window !== "undefined")
      console.log("%c⚠️  Submitting your form now — twice: once with rubbish, once with good data. "
        + "The good one adds a real item to your list.", "color: #d29922");

    const badBody = bodyFrom(fields, invalidValue, tokenOf(createPage.body));
    const badPost = await post(root + createUrl, badBody);

    const badRefused = badPost && !badPost.redirected && badPost.status === 200;
    const badSaidWhy = badRefused && hasErrors(badPost.body);

    // A 200 carrying a blank form has two very different causes, and the giveaway is
    // whether what I posted came back with it. An action with NO verb attribute answers
    // POST as happily as GET, so a lone GET Create() serves the empty form straight back —
    // which looks identical to "you forgot the validation spans" unless you look for your
    // own input. Only decidable when an invalid value is distinctive enough to search for.
    const echoable = fields
      .filter(f => f.type !== "checkbox")
      .map(f => badBody[f.name])
      .filter(v => typeof v === "string" && v.length >= 3);
    const badText = String((badPost && badPost.body) || "");

    // Did the FORM come back, or something else? A POST that lands on a lone GET
    // Create() gets the empty form; so does a POST action returning View() with
    // no argument. Anything else — Content(), a different view — means an action
    // really did receive it, and saying "you have no [HttpPost]" would be wrong.
    const cameBackAsTheForm = /<form[^>]*method=["']?post/i.test(badText)
      && fields.some(f => new RegExp(`name=["']${f.name}["']`, "i").test(badText));

    const mineEchoed = echoable.length > 0 && echoable.some(v => badText.includes(v));
    const emptyFormBack = !!badRefused && cameBackAsTheForm && echoable.length > 0 && !mineEchoed;
    const somethingElseBack = !!badRefused && !cameBackAsTheForm;

    const afterBad = await getWithWakeup(`${root}/${route}`);
    const idsAfterBad = afterBad ? detailsIds(afterBad.body, route) : detailsIds(index.body, route);
    const countAfterBad = idsAfterBad.length;

    add(badRefused && badSaidWhy && countAfterBad === before ? "pass" : "fail", 3,
      "a bad submission is refused, with messages", {
        hint: !badPost
          ? "the bad submission didn't get a response at all."
          : badPost.status === 400
            ? "your form came back 400 — the antiforgery token didn't check out. Make sure the form is "
              + "rendered by the <form asp-action=...> tag helper so it carries a token."
          : badPost.redirected
            ? "I filled your form with rubbish — blank text, numbers past the top of your own [Range] — "
              + "and it was accepted. Nothing is reading the validation rules."
          : countAfterBad > before
            ? "the form came back, but the bad record was added to your list anyway. The guard has to "
              + "return BEFORE the Add."
          : somethingElseBack
            ? "something received the post and answered with a page that isn't your form — so I can't "
              + "see any error messages, and neither can whoever filled it in. A refused submission has "
              + "to come back as the form itself: return View(item)."
          : emptyFormBack
            ? "the form came back without a word of what I sent it. Either nothing received the post — "
              + "an action with no verb attribute answers EVERY verb, so a lone GET Create() serves the "
              + "empty form straight back — or your POST action returns View() with no argument, which "
              + "throws away everything they typed."
          : !badSaidWhy
            ? "the form came back and nothing was added — good — but there are no error messages on the "
              + "page, so whoever filled it in has no idea what to fix."
            : `the bad submission returned ${badPost.status}, which I wasn't expecting.`,
        todo: badPost && badPost.redirected
          ? "Guard your POST action: if (!ModelState.IsValid) { return View(item); } — before you add anything."
          : somethingElseBack
            ? "Your POST action needs to hand the form back when the model is invalid: "
              + "if (!ModelState.IsValid) { return View(item); } — not Content(...) or a different view."
          : emptyFormBack
            ? "Add the second Create action — [HttpPost], taking your model as a parameter. Inside it: "
              + "guard with if (!ModelState.IsValid) { return View(item); }, give the new item an id, "
              + "add it to your list, then RedirectToAction(nameof(Index)). If you already have that "
              + "action, check it returns View(item) and not View()."
            : "Add <span asp-validation-for=\"YourField\" class=\"text-danger\"></span> next to each input, "
              + "and make sure the action returns View(item) rather than View().",
      });

    // ── 6. a good submission is accepted ──────────────────────────────────────
    // This is the one that leaves a record behind. Fresh page for a fresh token.
    const freshForm = await getWithWakeup(root + createUrl);
    const goodPost = freshForm
      ? await post(root + createUrl, bodyFrom(fields, validValue, tokenOf(freshForm.body)))
      : null;

    const afterGood = await getWithWakeup(`${root}/${route}`);
    const idsAfterGood = afterGood ? detailsIds(afterGood.body, route) : idsAfterBad;
    const countAfterGood = idsAfterGood.length;
    const grew = countAfterGood > countAfterBad;

    // A record that lands is not the same as a record that landed properly. An item added
    // without an Id goes in as 0, and /Details/0 finds it — for exactly one record. The next
    // one collides and only the first is ever reachable. So check the id it went in with,
    // not just that the list got longer.
    const newIds = idsAfterGood.filter(id => !idsAfterBad.includes(id));
    const idOk = newIds.length > 0 && newIds.every(id => Number(id) > 0);

    // Keyed on `grew`, not on the check passing: an Id-0 record is still a real record
    // sitting in their list, and the cleanup note at the end has to say so.
    if (grew) addedARecord = true;

    const goodOk = !!(goodPost && goodPost.redirected && grew && idOk);

    add(goodOk ? "pass" : "fail", 2,
      `a good submission is accepted and lands in your list${goodOk ? ` — ${countAfterBad} → ${countAfterGood}` : ""}`, {
        hint: !goodPost
          ? "the submission didn't get a response at all."
          : emptyFormBack
            ? "the blank form came back again — either there's no [HttpPost] Create action, or yours "
              + "returns View() with no argument."
          : !goodPost.redirected
            ? `I filled your form in using your own rules — every value inside your [Range] and `
              + `[StringLength] limits — and got a ${goodPost.status} back instead of a redirect. Either it `
              + "was rejected, or the action renders a view instead of redirecting. "
              + "A rendered POST files the record again every time someone refreshes."
            : !grew
              ? "you redirected, but nothing new turned up on your list page. Either the action "
                + "never added it, or your index doesn't link each item to /Details/{id}."
              : "you redirected and it landed — but it went in with Id 0, because nothing gave it "
                + "one. It looks fine right now, because /Details/0 finds it. Add a second record "
                + "and both answer to that URL, and only the first will ever be found.",
        todo: goodPost && goodPost.redirected
          ? "Give the new item an id BEFORE you add it: item.Id = YourData.All.Max(x => x.Id) + 1; "
            + "— and make sure every item on your index links to /Details/{id}."
          : emptyFormBack
            ? "Add the second Create action — [HttpPost], taking your model as a parameter."
            : "Finish the happy path: assign an id, add it to the list, then "
              + "return RedirectToAction(nameof(Index));",
      });

    // ── 7. client-side validation ─────────────────────────────────────────────
    const cp = createPage.body;
    const scriptAt = cp.search(/jquery[.\-]?validate/i);
    const footerAt = cp.search(/<footer/i);

    add(scriptAt > -1 && footerAt > -1 && scriptAt > footerAt ? "pass" : "fail", 2,
      "validation runs in the browser too", {
        hint: scriptAt === -1
          ? "your form page isn't loading the validation scripts, so every mistake costs a round trip "
            + "to the server before the person filling it in hears about it."
          : footerAt === -1
            ? "I found the validation scripts but no <footer>, so I can't tell where on the page they landed."
            : "the validation scripts are rendering in the middle of your page instead of down with the "
              + "other scripts — which means they load before jQuery does, and fail with $ is not defined.",
        todo: "Put this at the bottom of your Create view:\n"
            + "    @section Scripts { <partial name=\"_ValidationScriptsPartial\" /> }",
      });

    return done(route);
  }

  // Printed above the score, because a stale checker makes the score itself suspect.
  const staleWarning = (stale) => stale && stale.length
    ? `Week ${stale.join(" and ")}'s self-check script is STILL installed in your app, and it PASSES — `
      + `it's checking last week's requirements, which week ${WEEK} didn't break. Load a page with that tag on `
      + "it and you get a screen of green ticks for work you did seven days ago. Delete the <script> tag "
      + `pointing at week-0${stale[0]}/homework-checks.js — this week's line REPLACES it.`
    : null;

  const BY_HAND = [
    "3 pts — data annotations on your model: at least three, across at least two properties",
    "3 pts — 3+ meaningful commits, pushed to a public repo",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  const LEFTOVER = `I submitted your form once with good data, so there's now an item called "${MARKER}" `
    + "in your list. That's expected — it's the only way to prove from outside that your form works. "
    + "It'll disappear the next time your app restarts.";

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

      if (res.addedARecord) console.log(`\n🧹 ${LEFTOVER}`);
      console.log("\nThe last 6 points I check in your repo:");
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

      if (res.addedARecord) console.log(`%c🧹 ${LEFTOVER}`, "color: #d29922");
      console.log("%cThe last 6 points I check in your repo:", bold);
      BY_HAND.forEach(l => console.log("   • " + l.trim()));
      console.log("%cType  recheck()  to run again — or  recheck(\"Trails\")  with your controller name.", "color: #79c0ff");
    };

    const run = (forcedRoute) => {
      console.log(`%c🔎 Week ${WEEK} self-check — ${window.location.origin}`, big);
      console.log("Results appear as each check finishes — a sleeping free-tier app can take ~30s for the first one.");
      if (forcedRoute) console.log(`Checking /${forcedRoute} directly (you told me where to look).`);
      return runChecks(window.location.origin, forcedRoute || null, printCheck).then(report);
    };

    window.recheck = run;
    run();
  }
})();
