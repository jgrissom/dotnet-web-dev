// ═══════════════════════════════════════════════════════════════════════════
//  Week 13 homework self-check — the SAME checks I grade with.
//
//  EASIEST WAY — include it like a CDN, exactly like last week. Open
//  Views/Home/Index.cshtml, find the week-12 line, and REPLACE it:
//
//    @section Scripts {
//        <script src="https://jgrissom.github.io/dotnet-web-dev/week-13/homework-checks.js"></script>
//    }
//
//  Then load that page and open the console (F12). NOTHING RUNS ON ITS OWN.
//  Type  recheck()  when you want it to run.
//
//  HOW IT FINDS YOUR API: it finds your list page in your navbar, the way it
//  has since week 4, and adds /api in front of it. /Trails means /api/Trails,
//  or /api/Trail: singular or plural both work, and capitals don't matter.
//  The two have to use the same word. List page not in your navbar?
//  recheck("Trails")  names that word, for both.
//
//  ⚠️  IT CHANGES NOTHING IN YOUR DATA. The POST it sends is broken JSON and the
//  DELETE names a record that can't exist, so an API with no protection on it
//  still can't lose anything. The one thing it can add is the account below.
//
//  ⚠️  IT SIGNS IN AS WEEK 11'S SELF-CHECK ACCOUNT — week11-selfcheck@example.com
//  — which your site already has if you ran the last two checks. If it doesn't,
//  this makes it, once, and reuses it after that. That account must NOT hold
//  your role. WHEN IT FINISHES YOUR BROWSER IS SIGNED OUT, even if you were
//  signed in as yourself before. Sign back in when it's done.
//
//  ⚠️  IT CANNOT SEE YOUR ADMIN SUCCEED. It doesn't know your admin's email or
//  password, and it never should. Sending a real POST and a real DELETE as your
//  admin is your job, and it's in the homework as a step of its own.
//
//  14 of the 20 points are in here. The rest: 3 from your repo ([ApiController],
//  a minimal endpoint, and DTOs) and 3 from commits.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const WEEK = 13;
  // Week 11's own account, so a site that ran the last two checks gets nothing new.
  const EMAIL = "week11-selfcheck@example.com";
  // Passes Identity's default rules: upper, lower, a digit, a symbol, 6+ long.
  const PASSWORD = "Week11-Check!";
  const MARKER = `Week ${WEEK} Test`;
  // An id no record will ever have, so a DELETE that gets through finds nothing.
  const NO_SUCH_ID = 999999999;
  const inBrowser = typeof window !== "undefined";

  // In Node, fetch keeps no cookies and can't show the Set-Cookie on a redirect
  // it follows for you — and the sign-in cookie arrives on exactly that
  // redirect. So in Node this keeps its own jar and follows redirects by hand.
  // A browser does both for itself.
  const jar = new Map();
  const cookieHeader = () => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");

  function stashCookies(res) {
    if (inBrowser) return;
    let list = [];
    try { list = res.headers.getSetCookie ? res.headers.getSetCookie() : []; } catch { /* older runtime */ }
    if (!list.length) {
      const raw = res.headers.get && res.headers.get("set-cookie");
      if (raw) list = [raw];
    }
    for (const c of list) {
      const [pair] = String(c).split(";");
      const i = pair.indexOf("=");
      if (i <= 0) continue;
      const name = pair.slice(0, i).trim(), value = pair.slice(i + 1).trim();
      if (value === "" || /expires=Thu, 01 Jan 1970/i.test(c)) jar.delete(name);
      else jar.set(name, value);
    }
  }

  // One request, redirects followed. Returns where it ended up — the final
  // URL is how a browser shows you where [Authorize] sent you.
  async function send(url, opts = {}, timeoutMs = 45000) {
    const method = opts.method || "GET";
    const body = opts.form ? new URLSearchParams(opts.form).toString() : undefined;
    try {
      if (inBrowser) {
        const res = await fetch(url, {
          method, body, redirect: "follow", credentials: "same-origin",
          headers: body ? { "content-type": "application/x-www-form-urlencoded" } : {},
          signal: AbortSignal.timeout(timeoutMs),
        });
        return { status: res.status, url: res.url, redirected: res.redirected, body: await res.text() };
      }
      let current = url, m = method, b = body, redirected = false;
      for (let hop = 0; hop < 6; hop++) {
        const headers = {};
        if (b) headers["content-type"] = "application/x-www-form-urlencoded";
        if (jar.size) headers.cookie = cookieHeader();
        const res = await fetch(current, { method: m, body: b, headers, redirect: "manual", signal: AbortSignal.timeout(timeoutMs) });
        stashCookies(res);
        if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
          current = new URL(res.headers.get("location"), current).toString();
          m = "GET"; b = undefined; redirected = true;
          continue;
        }
        return { status: res.status, url: current, redirected, body: await res.text() };
      }
      return null;
    } catch {
      return null;
    }
  }

  // Free tier naps: one retry after a pause, so a cold app isn't a false failure.
  async function getWithWakeup(url) {
    const first = await send(url);
    if (first) return first;
    await new Promise(r => setTimeout(r, 15000));
    return await send(url);
  }

  // ── finding their app ───────────────────────────────────────────────────────

  function navCandidates(html) {
    const out = [];
    for (const m of html.matchAll(/href="\/([A-Za-z]\w*)(?:\/(?:Index)?)?"/gi)) {
      if (/^(home|account)$/i.test(m[1])) continue;
      if (!out.includes(m[1])) out.push(m[1]);
    }
    return out;
  }

  const detailsIds = (html, route) => [...new Set(
    [...html.matchAll(new RegExp(`/${route}/Details/(\\d+)`, "gi"))].map(m => Number(m[1]))
  )];

  const pathOf = (url) => { try { return new URL(url).pathname; } catch { return String(url); } };
  const isSignInUrl = (url) => /\/login\b|\/signin\b/i.test(pathOf(url));
  // Identity's default is /Account/AccessDenied. Anything that says "denied" or
  // "forbidden" in its path is a page of their own for the same thing.
  const isDeniedUrl = (url) => /accessdenied|denied|forbidden/i.test(pathOf(url));

  // ── reading their forms ─────────────────────────────────────────────────────

  const num = (s) => (s === undefined || s === null || s === "" ? null : Number(s));

  function postForms(html) {
    return [...String(html).matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/gi)].map(m => m[0])
      .filter(f => /method\s*=\s*["']post["']/i.test(f.slice(0, f.indexOf(">") + 1)));
  }

  const formAction = (form) => {
    const m = /<form[^>]*\saction\s*=\s*["']([^"']*)["']/i.exec(String(form || ""));
    return m ? m[1].replace(/&amp;/g, "&").trim() : null;
  };

  function formFields(form) {
    const fields = [];
    const seen = new Set();
    for (const m of String(form).matchAll(/<(input|textarea|select)\b([^>]*?)>/gi)) {
      const tag = m[1].toLowerCase();
      const attrs = m[2];
      const at = (a) => (attrs.match(new RegExp(`\\b${a}=["']([^"']*)["']`, "i")) || [])[1];
      const name = at("name");
      if (!name || /^__/.test(name)) continue;          // __RequestVerificationToken
      if (seen.has(name)) continue;                     // a checkbox's hidden partner
      seen.add(name);
      const type = (at("type") || (tag === "textarea" ? "textarea" : "text")).toLowerCase();
      const field = {
        name, tag, type,
        hidden: type === "hidden",
        rangeMin: num(at("data-val-range-min")),
        rangeMax: num(at("data-val-range-max")),
        lenMin: num(at("data-val-length-min")),
        lenMax: num(at("data-val-length-max")) ?? num(at("maxlength")),
        isNumber: type === "number" || at("data-val-number") !== undefined,
      };
      if (tag === "select") {
        const after = form.slice(form.indexOf(m[0]) + m[0].length);
        const block = (after.match(/[\s\S]*?<\/select>/i) || [""])[0];
        field.options = [...block.matchAll(/<option[^>]*value=["']([^"']*)["']/gi)].map(o => o[1]).filter(v => v !== "");
      }
      fields.push(field);
    }
    return fields;
  }

  const isEmail = (f) => f.type === "email" || /email/i.test(f.name);
  const isPassword = (f) => f.type === "password";

  // A value their own rules accept — the same trick as weeks 6–11.
  function validValue(f) {
    if (f.type === "checkbox") return "false";
    if (f.options) return f.options[0] ?? "";
    if (f.isNumber) {
      const lo = f.rangeMin ?? 1;
      const hi = f.rangeMax ?? Math.max(lo, 100);
      return String(Math.min(Math.max(1, lo), hi));
    }
    if (f.type === "date") return "2020-06-15";
    if (f.type === "url") return "https://example.com";
    let v = MARKER;
    if (f.lenMin && v.length < f.lenMin) v = v.padEnd(f.lenMin, "x");
    if (f.lenMax && v.length > f.lenMax) v = v.slice(0, f.lenMax);
    return v;
  }

  const tokenOf = (html) => {
    const m = String(html).match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
    return m ? m[1] : "";
  };

  // The navbar's way out: a form that POSTs somewhere called logout or signout.
  const signOutForm = (html) =>
    postForms(html).find(f => /logout|signout|sign-out/i.test(formAction(f) || "")) || null;

  // ── the stale-checker trap ──────────────────────────────────────────────────
  function staleCheckers(html) {
    const found = new Set();
    for (const m of String(html || "").matchAll(/week-0*(\d+)\/homework-checks\.js/gi)) {
      if (Number(m[1]) !== WEEK) found.add(Number(m[1]));
    }
    return [...found].sort((a, b) => a - b);
  }

  // ── asking their API ────────────────────────────────────────────────────────

  // One API request, as a program would send it: no redirect followed, because
  // a redirect is exactly the wrong answer, and `signedOut` keeps the browser's
  // sign-in cookie out of it. Returns the status, the type, the text, and what
  // the text parses to.
  async function ask(url, opts = {}, timeoutMs = 45000) {
    const method = opts.method || "GET";
    const headers = { accept: "application/json" };
    if (opts.body !== undefined) headers["content-type"] = "application/json";
    try {
      let res;
      if (inBrowser) {
        res = await fetch(url, {
          method, body: opts.body, headers, redirect: "manual",
          credentials: opts.signedOut ? "omit" : "same-origin",
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (res.type === "opaqueredirect") return { status: 302, redirected: true, type: "", text: "", json: undefined };
      } else {
        if (!opts.signedOut && jar.size) headers.cookie = cookieHeader();
        res = await fetch(url, { method, body: opts.body, headers, redirect: "manual", signal: AbortSignal.timeout(timeoutMs) });
        if (!opts.signedOut) stashCookies(res);
      }
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { /* not JSON, and the caller says so */ }
      return {
        status: res.status,
        redirected: res.status >= 300 && res.status < 400,
        type: (res.headers.get("content-type") || "").split(";")[0],
        text, json,
      };
    } catch {
      return null;
    }
  }

  async function askWithWakeup(url, opts) {
    const first = await ask(url, opts);
    if (first) return first;
    await new Promise(r => setTimeout(r, 15000));
    return await ask(url, opts);
  }

  const isJson = (r) => !!r && /json/i.test(r.type) && r.json !== undefined;
  const isHtml = (r) => !!r && (/html/i.test(r.type) || /<html[\s>]/i.test(r.text));
  const said = (r) => !r ? "no answer" : r.redirected ? "a redirect" : `a ${r.status}${isHtml(r) ? " with a page of HTML" : ""}`;

  // Singular or plural is spelling, not behavior: a list page at /BallPark may
  // keep its API at /api/BallParks, and /Categories at /api/Category.
  function wordForms(word) {
    const forms = [word];
    if (/ies$/i.test(word)) forms.push(word.slice(0, -3) + "y");
    else if (/s$/i.test(word)) forms.push(word.slice(0, -1));
    else if (/[^aeiou]y$/i.test(word)) forms.push(word.slice(0, -1) + "ies", word + "s");
    else forms.push(word + "s");
    return [...new Set(forms)];
  }

  // Names ignore case: a serializer setting shouldn't cost anyone a point.
  const prop = (obj, name) => {
    if (!obj || typeof obj !== "object") return undefined;
    const key = Object.keys(obj).find(k => k.toLowerCase() === name.toLowerCase());
    return key === undefined ? undefined : obj[key];
  };

  // Any array inside a record is its related rows, whatever they're called.
  const relatedRows = (record) => Object.entries(record || {}).filter(([, v]) => Array.isArray(v));

  const tally = (checks) => ({
    earned: checks.filter(c => c.pass).reduce((n, c) => n + c.pts, 0),
    possible: checks.reduce((n, c) => n + c.pts, 0),
    green: checks.filter(c => c.pass).length,
    total: checks.length,
  });

  /**
   * Runs every URL-verifiable check against a base URL.
   * Returns { route, checks, earned, ..., leftBehind, adopted }
   * `blocked` = couldn't be judged yet because an earlier step isn't done.
   * Shared with the grader so students and I run identical logic.
   */
  async function runChecks(baseUrl, forcedRoute, onCheck) {
    const root = String(baseUrl).replace(/\/$/, "");
    const stale = new Set();
    const results = {};
    let leftBehind = false, adopted = false, wasSignedIn = false, apiRoute = null;

    const CHECKS = [
      // In requirement order, so the first red one is always the next thing to build.
      ["list", 3, "your list answers in JSON, to anyone"],
      ["one", 3, "one record answers in JSON, with its related rows"],
      ["missing", 2, "a record that isn't there is a 404 in JSON"],
      ["count", 2, "your count answers in JSON"],
      ["stranger", 2, "signed out, a POST and a DELETE get a 401"],
      ["member", 2, "signed in without your role, a POST and a DELETE get a 403"],
    ];

    const set = (key, state, label, o = {}) => {
      if (results[key]) return;
      const [, pts, base] = CHECKS.find(c => c[0] === key);
      results[key] = {
        pass: state === "pass", blocked: state === "blocked", pts,
        label: label || base,
        hint: state === "pass" ? null : o.hint || null,
        todo: state === "pass" ? null : o.todo || null,
      };
    };

    const done = (route) => {
      const checks = CHECKS.map(([key, pts, label]) =>
        results[key] || { pass: false, blocked: true, pts, label, hint: "waiting on an earlier step", todo: null });
      if (onCheck) checks.forEach(onCheck);
      return { route, checks, stale: [...stale], leftBehind, adopted, wasSignedIn, ...tally(checks) };
    };

    // ── their home page ───────────────────────────────────────────────────────
    const home = await getWithWakeup(root + "/");
    if (!home || home.status >= 400) {
      const broke = home && home.status >= 500;
      set("list", "fail", null, {
        hint: broke
          ? `your home page returned a ${home.status} — the app is running, but something in it is throwing.`
          : "your home page didn't even load — nothing else can be checked until it does.",
        todo: broke
          ? "Look at the terminal (or Azure's Log stream) for the real exception."
          : "Start your app (dotnet watch), or check that your deployed URL is right. Your app reads "
            + "the database the moment it starts, so a missing or wrong connection string stops it "
            + "before 'Now listening on:' — read the terminal (or Azure's Log stream).",
      });
      return done(null);
    }
    staleCheckers(home.body).forEach(w => stale.add(w));
    wasSignedIn = !!signOutForm(home.body);

    // ── signing in and out, the way a person does ─────────────────────────────
    const signOut = async () => {
      const page = await send(root + "/");
      const form = page && signOutForm(page.body);
      if (!form) return false;
      const action = formAction(form) || "/Account/Logout";
      const res = await send(new URL(action, root + "/").toString(), { method: "POST", form: { __RequestVerificationToken: tokenOf(form) || tokenOf(page.body) } });
      return !!res;
    };
    const signIn = async () => {
      const page = await send(root + "/Account/Login");
      if (!page || page.status >= 400) return null;
      const form = postForms(page.body).find(f => formFields(f).some(isPassword));
      if (!form) return null;
      const body = { __RequestVerificationToken: tokenOf(form) };
      for (const f of formFields(form)) {
        if (f.hidden) continue;
        body[f.name] = isPassword(f) ? PASSWORD : isEmail(f) ? EMAIL : f.type === "checkbox" ? "false" : validValue(f);
      }
      const action = formAction(form) || "/Account/Login";
      return send(new URL(action, root + "/Account/Login").toString(), { method: "POST", form: body });
    };
    const register = async () => {
      const page = await send(root + "/Account/Register");
      const form = page && postForms(page.body).find(f => formFields(f).some(isPassword));
      if (!form) return null;
      const body = { __RequestVerificationToken: tokenOf(form) || tokenOf(page.body) };
      for (const f of formFields(form)) {
        if (f.hidden) continue;
        body[f.name] = isPassword(f) ? PASSWORD : isEmail(f) ? EMAIL : validValue(f);
      }
      const action = formAction(form) || "/Account/Register";
      return send(new URL(action, root + "/Account/Register").toString(), { method: "POST", form: body });
    };
    const signedIn = async () => {
      const page = await send(root + "/");
      return page ? !!signOutForm(page.body) : false;
    };

    // ── 1. find their list page, the way a visitor would, then its API ────────
    const tries = forcedRoute ? [forcedRoute] : navCandidates(home.body);
    let route = null, index = null;
    for (const cand of tries) {
      const page = await getWithWakeup(`${root}/${cand}`);
      if (!page || page.status >= 400 || isSignInUrl(page.url) || isDeniedUrl(page.url)) continue;
      if (detailsIds(page.body, cand).length) { route = cand; index = page; break; }
    }
    if (!route) {
      set("list", "fail", null, {
        hint: "I couldn't find a list page in your navbar that a visitor can open and that links to "
            + "a record's Details page, so I don't know what your API is called.",
        todo: "If your list page is called something I can't see, run  recheck(\"Trails\")  with YOUR "
            + "controller name. Your API lives at the same word with /api in front, singular or plural: /Trails, /api/Trails.",
      });
      return done(null);
    }
    staleCheckers(index.body).forEach(w => stale.add(w));
    // The API is the list page's word with /api in front, singular or plural.
    const tried = wordForms(route).map(w => `/api/${w}`);
    let api = tried[0], list = null;
    for (const address of tried) {
      const answer = await askWithWakeup(root + address, { signedOut: true });
      if (!list) list = answer;
      if (answer && answer.status !== 404) { api = address; list = answer; break; }
    }
    apiRoute = api;
    const records = isJson(list) && Array.isArray(list.json) ? list.json : null;
    const ids = records ? records.map(r => prop(r, "id")).filter(i => i !== undefined) : [];
    const listGood = !!records && records.length > 0 && ids.length === records.length;
    set("list", listGood ? "pass" : "fail",
      listGood ? `your list answers in JSON, to anyone — ${api}, ${records.length} record${records.length === 1 ? "" : "s"}` : null, {
        hint: !list ? `${api} didn't answer.`
          : list.redirected ? `${api} sent a visitor who isn't signed in to another page. Reading is public.`
          : list.status === 404 ? `nothing answers at ${tried.join(" or ")} — I got those from your list page, /${route}.`
          : list.status >= 500 ? `${api} came back ${list.status}. If the terminal says "A possible object cycle was detected", you are returning your model class with its related rows loaded: each row points back at its parent.`
          : !isJson(list) ? `${api} answered ${said(list)}, not JSON.`
          : !records ? `${api} is JSON, but it isn't an array of your records.`
          : records.length === 0 ? `${api} is an empty array, and /${route} lists records. They should be the same records.`
          : `${api} is an array, and not every record in it has an "id".`,
        todo: `An API controller for your list: [ApiController] and [Route("api/${route}")] on a class `
            + "that inherits ControllerBase, and an [HttpGet] action marked [AllowAnonymous] that returns "
            + "a list of DTOs, each with its id. The word has to match your list page's; singular or "
            + "plural are both fine.",
      });
    if (!listGood) return done(route);

    // ── 2. one record, with its related rows ──────────────────────────────────
    //    An entity with no Include prints an empty array for every record, so
    //    one record's empty list proves nothing: look at several before failing.
    const sample = ids.slice(0, 8);
    let first = null, withRows = null, arrays = [];
    for (const id of sample) {
      const r = await ask(`${root}${api}/${id}`, { signedOut: true });
      if (first === null) first = { id, r };
      if (!isJson(r) || !r.json || Array.isArray(r.json) || typeof r.json !== "object") continue;
      arrays = relatedRows(r.json);
      if (arrays.some(([, rows]) => rows.length > 0)) { withRows = { id, r }; break; }
    }
    const shaped = first && isJson(first.r) && !Array.isArray(first.r.json) && prop(first.r.json, "id") === first.id;
    const nested = withRows ? relatedRows(withRows.r.json).find(([, rows]) => rows.length > 0) : null;
    set("one", shaped && nested ? "pass" : "fail",
      shaped && nested ? `one record answers in JSON, with its related rows — ${api}/${withRows.id}, "${nested[0]}" has ${nested[1].length}` : null, {
        hint: !first || !first.r ? `${api}/${ids[0]} didn't answer.`
          : first.r.status === 404 || first.r.status === 405 ? `nothing answers at ${api}/${first.id} yet.`
          : first.r.status >= 500 ? `${api}/${first.id} came back ${first.r.status}. If the terminal says "A possible object cycle was detected", return a DTO: your model's related rows point back at the record.`
          : !shaped ? `${api}/${first.id} should be one JSON object with the id ${first.id}, and it answered ${said(first.r)}.`
          : arrays.length ? `I looked at ${sample.length} record${sample.length === 1 ? "" : "s"}, and every one has an empty "${arrays[0][0]}". If they do have related rows on their pages, the query never loaded them: Include.`
          : `${api}/${first.id} has no array of related rows in it.`,
        todo: "An [HttpGet(\"{id:int}\")] action that loads the record with Include and returns a DTO carrying "
            + "a list of DTOs for the related rows. Build them by hand, so nothing can point back.",
      });

    // ── 3. a record that isn't there ──────────────────────────────────────────
    const gone = await ask(`${root}${api}/${NO_SUCH_ID}`, { signedOut: true });
    const goneGood = gone && gone.status === 404 && isJson(gone);
    set("missing", goneGood ? "pass" : "fail",
      goneGood ? `a record that isn't there is a 404 in JSON — ${api}/${NO_SUCH_ID}` : null, {
        hint: `${api}/${NO_SUCH_ID} answered ${said(gone)}.`,
        todo: "Return NotFound() when the query finds nothing. With [ApiController] on the class, that "
            + "answers in JSON by itself. A page of HTML here means there's no such action yet, or "
            + "[ApiController] is missing.",
      });

    // ── 4. the count ──────────────────────────────────────────────────────────
    const total = await ask(`${root}${api}/count`, { signedOut: true });
    const counted = total && isJson(total)
      ? (typeof total.json === "number" ? total.json : prop(total.json, "count"))
      : undefined;
    const countGood = typeof counted === "number" && counted === records.length;
    set("count", countGood ? "pass" : "fail",
      countGood ? `your count answers in JSON — ${api}/count says ${counted}` : null, {
        hint: typeof counted === "number"
          ? `${api}/count says ${counted}, and ${api} has ${records.length} records.`
          : `${api}/count answered ${said(total)}, and I wanted {"count": ${records.length}}.`,
        todo: "A minimal API endpoint in Program.cs, above app.Run(): "
            + `app.MapGet("${api.toLowerCase()}/count", …) that returns new { count = … }.`,
      });

    // ── 5. and 6. a write, refused. Both are built never to change anything:
    //    refusal comes before the body is read, and an API that doesn't refuse
    //    gets broken JSON it can't save and an id that isn't there.
    const writes = (opts) => Promise.all([
      ask(root + api, { ...opts, method: "POST", body: "{" }),
      ask(`${root}${api}/${NO_SUCH_ID}`, { ...opts, method: "DELETE" }),
    ]);
    const judge = (rs, status) => rs.map((r, i) => ({ r, verb: i ? "DELETE" : "POST" }))
      .filter(({ r }) => !(r && r.status === status && !r.redirected && !isHtml(r)));
    const describe = (bad) => bad.map(({ r, verb }) => `a ${verb} got ${said(r)}`).join(", and ");

    const asStranger = await writes({ signedOut: true });
    const badStranger = judge(asStranger, 401);
    const allAbsent = asStranger.every(r => r && r.status === 405);
    const someHtml = badStranger.some(({ r }) => r && r.status === 401 && isHtml(r));
    set("stranger", badStranger.length ? "fail" : "pass",
      badStranger.length ? null : `signed out, a POST and a DELETE get a 401 — ${api}`, {
        hint: `signed out: ${describe(badStranger)}.`,
        todo: someHtml
          ? "The status is right, and week 10's Missing page is printing itself behind it. Wrap "
            + "UseStatusCodePagesWithReExecute in app.UseWhen, so it stops at /api."
          : badStranger.some(({ r }) => r && r.redirected)
            ? "A redirect is a page's answer. [ApiController] on the class is what turns it into a 401."
            : allAbsent
              ? "Your writes aren't there yet: an [HttpPost] and an [HttpDelete(\"{id:int}\")], on a class "
                + "marked [Authorize(Roles = \"YourRole\")], with [AllowAnonymous] on the two GETs."
              : "Put [Authorize(Roles = \"YourRole\")] on the API controller CLASS, with [AllowAnonymous] on "
                + "the two GETs. ⚠️ An attribute is the kind of edit hot reload can report as applied "
                + "when it isn't — if nothing changes, restart your app.",
      });

    // Start signed out, whoever was signed in before — very likely their admin.
    if (wasSignedIn) await signOut();
    let signin = await signIn();
    if (!(await signedIn())) {
      const reg = await register();
      if (reg && reg.redirected) leftBehind = true;
      if (!(await signedIn())) signin = await signIn();
    } else {
      adopted = true;
    }
    const inNow = await signedIn();
    if (!inNow) {
      set("member", "blocked", null, {
        hint: `I couldn't sign in as ${EMAIL}, so I can't test a signed-in visitor.`,
        todo: "Week 11's register and sign-in pages have to keep working: /Account/Register and "
            + "/Account/Login, and a Sign out form in the navbar when someone is signed in.",
      });
      return done(route);
    }

    const asMember = await writes({});
    const badMember = judge(asMember, 403);
    const memberHtml = badMember.some(({ r }) => r && r.status === 403 && isHtml(r));
    set("member", badMember.length ? "fail" : "pass",
      badMember.length ? null : `signed in without your role, a POST and a DELETE get a 403 — ${api}`, {
        hint: `signed in as ${EMAIL}, an account that should hold no role: ${describe(badMember)}.`,
        todo: memberHtml
          ? "The status is right, and week 10's Missing page is printing itself behind it. Wrap "
            + "UseStatusCodePagesWithReExecute in app.UseWhen, so it stops at /api."
          : "The attribute has to name your role: [Authorize(Roles = \"YourRole\")], not plain [Authorize]. "
            + "If you gave that account your role, give it to your OWN email instead.",
      });

    // Leave the browser signed out, like the run found it at worst.
    await signOut();
    return done(route);
  }

  // Printed above the score, because a stale checker makes the score itself suspect.
  const staleWarning = (stale) => stale && stale.length
    ? `Week ${stale.join(" and ")}'s self-check script is STILL installed in your app. It PASSES — `
      + `nothing this week breaks last week's requirements — so it prints a reassuring report about `
      + `the wrong week. The tell is the first line: it should say Week ${WEEK}. Delete the old `
      + `<script> tag; this week's line REPLACES it.`
    : null;

  const BY_HAND = [
    "1 pt — [ApiController] on a controller class",
    "1 pt — a minimal API endpoint: app.MapGet in Program.cs",
    "1 pt — DTOs: your API returns and accepts classes of its own, not your models",
    "3 pts — 3+ meaningful commits, pushed to a public repo",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  const LEFTOVER = `This created one account on your site — ${EMAIL} — because it wasn't there yet. `
    + "Every run after this one REUSES it. Never give it your role. Delete it by hand in the mssql "
    + "panel (the AspNetUsers table) if you want it gone.";

  const SIGNED_OUT = "Your browser is now SIGNED OUT — the check signs its own account in and out. "
    + "Sign back in as yourself if you were.";

  const CANT_SEE_ADMIN = "This check can't see your admin succeed: it doesn't know your admin's email or "
    + "password, and it never should. Sign in as yourself, open /api-tester.html, and send a real POST "
    + "and a real DELETE — that's the homework's last step, and it's yours to do.";

  const WHERE_THE_POINTS_ARE =
    "14 of the 20 points are in this script — everything a program WITHOUT your role can see from "
    + "outside. The other 6: [ApiController], a minimal endpoint and DTOs (3, from your repo) and commits (3).";

  // ── Node: export for the grader, and support `node homework-checks.js <url>` ──
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { runChecks, EMAIL };
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
      process.exit(1);
    }

    (async () => {
      console.log(`\n🔎 Week ${WEEK} self-check — ${url}`);
      console.log("   (a sleeping free-tier app can take ~30s for the first check)");
      console.log(`   ⚠️  this signs in as ${EMAIL} — and makes it once if it isn't there\n`);
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
      else console.log("\n🎉 Your API answers in JSON, to anyone, and only your role can change anything through it.");

      console.log(`\n🔑 ${CANT_SEE_ADMIN}`);
      if (res.leftBehind) console.log(`\n🧹 ${LEFTOVER}`);
      console.log(`\nℹ️  ${WHERE_THE_POINTS_ARE}`);
      console.log("\nThe other 6 points I check in your repo:");
      BY_HAND.forEach(l => console.log("   • " + l));
      console.log("\nSubmit your Azure URL + repo URL via Canvas.\n");
      process.exit(green === total ? 0 : 1);
    })();
  }

  // ── Browser: <script src> on your own site ──────────────────────────────────
  if (inBrowser && typeof document !== "undefined") {
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
        console.log("Fix that, then type  recheck()  again.");
      } else if (isLocal(window.location.origin)) {
        console.log("%c⚠️  This is localhost. Run it again on your Azure URL — the deployed one is what I grade.", `${bold}; color: #d29922`);
      } else {
        console.log("%c🎉 Your API answers in JSON, to anyone, and only your role can change anything through it.", `${bold}; color: green`);
      }

      console.log(`%c🔑 ${CANT_SEE_ADMIN}`, "color: #d29922");
      if (res.leftBehind) console.log(`%c🧹 ${LEFTOVER}`, "color: #d29922");
      console.log(`%c🚪 ${SIGNED_OUT}`, "color: #d29922");
      console.log(`%cℹ️  ${WHERE_THE_POINTS_ARE}`, "color: #79c0ff");
      console.log("%cThe other 6 points I check in your repo:", bold);
      BY_HAND.forEach(l => console.log("   • " + l.trim()));
      console.log("%cType  recheck()  to run again — or  recheck(\"Trails\")  with your controller name.", "color: #79c0ff");
    };

    const run = (forcedRoute) => {
      console.log(`%c🔎 Week ${WEEK} self-check — ${window.location.origin}`, big);
      console.log("Results appear when the run finishes — a sleeping free-tier app can take ~30s.");
      console.log(`%c⚠️  This signs in as ${EMAIL} (making it once if it isn't there) and leaves your browser signed out. It changes none of your data.`, "color: #d29922");
      console.log("%cRed 'Failed to load resource' lines will appear above the report. Those are the 401s, 403s and 404s this check asked for. Read the report, not the red lines.", "color: #d29922");
      if (forcedRoute) console.log(`Checking /${forcedRoute} directly (you told me where to look).`);
      return runChecks(window.location.origin, forcedRoute || null, printCheck).then(report);
    };

    // Nothing runs on load. Typing recheck() is the consent — it signs your
    // browser out.
    window.recheck = (forcedRoute) => run(forcedRoute);

    console.log(`%c🔎 Week ${WEEK} self-check is loaded — but it hasn't run.`, big);
    console.log("%cType  recheck()  to check your work. It signs in as its own account and signs your browser out, so nothing happens until you ask.",
      "color: #79c0ff");
    console.log("%cList page not in your navbar?  recheck(\"Trails\")  with your own word. Your API has to use the same word.",
      "color: #79c0ff");
  }
})();
