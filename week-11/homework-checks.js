// ═══════════════════════════════════════════════════════════════════════════
//  Week 11 homework self-check — the SAME checks I grade with.
//
//  EASIEST WAY — include it like a CDN, exactly like last week. Open
//  Views/Home/Index.cshtml, find the week-10 line, and REPLACE it:
//
//    @section Scripts {
//        <script src="https://jgrissom.github.io/dotnet-web-dev/week-11/homework-checks.js"></script>
//    }
//
//  Then load that page and open the console (F12). NOTHING RUNS ON ITS OWN.
//  Type  recheck()  when you want it to run.
//
//  ⚠️  IT CREATES ONE ACCOUNT ON YOUR SITE — week11-selfcheck@example.com —
//  and every run after the first REUSES it instead of making another. It
//  signs that account in and out to test your login, so WHEN IT FINISHES YOUR
//  BROWSER IS SIGNED OUT, even if you were signed in as yourself before. Sign
//  back in when it's done. Delete the account by hand in the mssql panel
//  (the AspNetUsers table) if you want it gone.
//
//  It does NOT need to know what your app is about. Your registration and
//  sign-in pages live at /Account/Register and /Account/Login — the framework's
//  own default — and your list controller is found from your navbar, the way
//  it has been since week 4.
//
//  14 of the 20 points are in here. The rest: 3 from your repo (your user
//  class, the context built on it, and the migration that creates its table)
//  and 3 from commits.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const WEEK = 11;
  const MARKER = `Week ${WEEK} Test`;
  const EMAIL = "week11-selfcheck@example.com";
  // Passes Identity's default rules: upper, lower, a digit, a symbol, 6+ long.
  const PASSWORD = "Week11-Check!";
  const WRONG = "Not-The-Password-7";
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
  // URL is how a browser shows you that [Authorize] sent you to sign in.
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
  // Anything a person fills in that isn't the email, a password or a tick box —
  // the thing requirement 6 put on the form.
  const isOwn = (f) => !f.hidden && !isEmail(f) && !isPassword(f) && f.type !== "checkbox";

  // A value their own rules accept — the same trick as weeks 6–9.
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

  const hasErrors = (html) =>
    /field-validation-error/.test(html) || /validation-summary-errors/.test(html);

  // The navbar's way out: a form that POSTs somewhere called logout or signout.
  const signOutForm = (html) =>
    postForms(html).find(f => /logout|signout|sign-out/i.test(formAction(f) || "")) || null;
  const signOutLink = (html) =>
    /<a\b[^>]*href=["'][^"']*(logout|signout)[^"']*["']/i.test(String(html));

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
   * Returns { route, checks, earned, ..., leftBehind, adopted, ownField }
   * `blocked` = couldn't be judged yet because an earlier step isn't done.
   * Shared with the grader so students and I run identical logic.
   */
  async function runChecks(baseUrl, forcedRoute, onCheck, opts = {}) {
    const write = opts.write !== false;
    const root = String(baseUrl).replace(/\/$/, "");
    const stale = new Set();
    const results = {};        // filled in whatever order the run reaches them
    let leftBehind = false, adopted = false, ownField = null, wasSignedIn = false;

    const CHECKS = [
      // In requirement order, so the first red one is always the next thing to build.
      ["read", 1, "anyone can still read your list and a record's page"],
      ["form", 1, "there's a registration form at /Account/Register"],
      ["create", 2, "a visitor can create an account"],
      ["navbar", 2, "signed in, the navbar says so — and the way out is a form"],
      ["inout", 2, "sign out, sign back in — and a wrong password is refused"],
      ["locked", 3, "a stranger can't change your data"],
      ["opens", 1, "signed in, your form opens"],
      ["own", 1, "it asks for something of your own"],
      ["name", 1, "the navbar knows the name you registered with"],
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
      return { route, checks, stale: [...stale], leftBehind, adopted, ownField, wasSignedIn, readOnly: !write, ...tally(checks) };
    };

    // ── their home page ───────────────────────────────────────────────────────
    const home = await getWithWakeup(root + "/");
    if (!home || home.status >= 400) {
      const broke = home && home.status >= 500;
      set("read", "fail", null, {
        hint: broke
          ? `your home page returned a ${home.status} — the app is running, but something in it is throwing.`
          : "your home page didn't even load — nothing else can be checked until it does.",
        todo: broke
          ? "Look at the terminal (or Azure's Log stream) for the real exception. If it names a table "
            + "like AspNetUsers, the database your app is using hasn't had this week's migration "
            + "applied — run  dotnet ef database update  against it, then redeploy."
          : "Start your app (dotnet watch), or check that your deployed URL is right.",
      });
      return done(null);
    }
    staleCheckers(home.body).forEach(w => stale.add(w));
    wasSignedIn = !!signOutForm(home.body);

    // ── 1. find their list controller, the way a visitor would ────────────────
    const tries = forcedRoute ? [forcedRoute] : navCandidates(home.body);
    let route = null, index = null;
    for (const cand of tries) {
      const page = await getWithWakeup(`${root}/${cand}`);
      if (!page || page.status >= 400 || isSignInUrl(page.url)) continue;
      if (detailsIds(page.body, cand).length) { route = cand; index = page; break; }
    }
    if (!route) {
      set("read", "fail", null, {
        hint: "I couldn't find a list page in your navbar that a visitor can open and that links to "
            + "a record's Details page.",
        todo: "If your list page now sends visitors to sign in, the [AllowAnonymous] on Index is "
            + "missing — reading should stay public. Otherwise run  recheck(\"Trails\")  with YOUR "
            + "controller name.",
      });
      return done(null);
    }
    staleCheckers(index.body).forEach(w => stale.add(w));
    const ids = detailsIds(index.body, route);
    const detailsPage = await getWithWakeup(`${root}/${route}/Details/${ids[0]}`);
    const detailsOk = detailsPage && detailsPage.status < 400 && !isSignInUrl(detailsPage.url);
    set("read", detailsOk ? "pass" : "fail", `anyone can still read your list and a record's page — /${route}`, {
      hint: `/${route} opens, but /${route}/Details/${ids[0]} `
          + (detailsPage && isSignInUrl(detailsPage.url) ? "sends a visitor to sign in." : `came back ${detailsPage ? detailsPage.status : "nothing"}.`),
      todo: "Reading is public. [Authorize] goes on the controller class, and [AllowAnonymous] goes on "
          + "Index and Details to open the two that only read.",
    });

    // ── 2 and 8. the registration form ────────────────────────────────────────────
    const regPage = await getWithWakeup(root + "/Account/Register");
    const regForm = regPage && regPage.status < 400 ? postForms(regPage.body).find(f => formFields(f).some(isPassword)) : null;
    const regFields = regForm ? formFields(regForm) : [];
    if (!regForm || !regFields.some(isEmail)) {
      set("form", "fail", null, {
        hint: regPage && regPage.status < 400
          ? "/Account/Register opens, but there's no form on it with an email box and a password box."
          : `/Account/Register came back ${regPage ? regPage.status : "nothing"}.`,
        todo: "An AccountController with a Register pair (GET shows the form, POST creates the "
            + "account), a RegisterViewModel with Email, Password and ConfirmPassword, and "
            + "Views/Account/Register.cshtml — built the way the lecture notes show.",
      });
      set("own", "blocked", null, { hint: "needs the registration form first" });
      return done(route);
    }
    staleCheckers(regPage.body).forEach(w => stale.add(w));
    set("form", "pass", `there's a registration form at /Account/Register — ${regFields.length} fields`);

    const own = regFields.filter(isOwn);
    ownField = own.length ? own[0].name : null;
    set("own", own.length ? "pass" : "fail",
      own.length ? `it asks for something of your own — ${own.map(f => f.name).join(", ")}` : null, {
        hint: "the form asks for an email and a password and nothing else. Requirement 6 is a "
            + "property of your own on your user class, and a box for it on this form.",
        todo: "Add a property to your user class (public string DisplayName { get; set; } = \"\"; "
            + "or whatever fits your app), migrate, then put it on RegisterViewModel, on "
            + "Register.cshtml, and on the new user in the Register POST.",
      });

    const WAIT = "run  recheck()  to include this — it creates an account, so it isn't automatic";
    if (!write) {
      ["create", "navbar", "inout", "locked", "opens", "name"].forEach(k => set(k, "blocked", null, { hint: WAIT }));
      return done(route);
    }

    // ── signing in and out, the way a person does ─────────────────────────────
    const signOut = async () => {
      const page = await send(root + "/");
      const form = page && signOutForm(page.body);
      if (!form) return false;
      const action = formAction(form) || "/Account/Logout";
      const res = await send(new URL(action, root + "/").toString(), { method: "POST", form: { __RequestVerificationToken: tokenOf(form) || tokenOf(page.body) } });
      return !!res;
    };
    const signIn = async (password) => {
      const page = await send(root + "/Account/Login");
      if (!page || page.status >= 400) return null;
      const form = postForms(page.body).find(f => formFields(f).some(isPassword));
      if (!form) return null;
      const body = { __RequestVerificationToken: tokenOf(form) };
      for (const f of formFields(form)) {
        if (f.hidden) continue;
        body[f.name] = isPassword(f) ? password : isEmail(f) ? EMAIL : f.type === "checkbox" ? "false" : validValue(f);
      }
      const action = formAction(form) || "/Account/Login";
      return send(new URL(action, root + "/Account/Login").toString(), { method: "POST", form: body });
    };
    const signedIn = async () => {
      const page = await send(root + "/");
      return page ? !!signOutForm(page.body) : false;
    };

    // Start signed out, whoever was signed in before. Then read the form again:
    // an antiforgery token belongs to whoever was signed in when it was issued,
    // so one taken before signing out is refused afterwards with a 400.
    if (wasSignedIn) await signOut();
    const freshPage = await send(root + "/Account/Register");
    const freshForm = (freshPage && postForms(freshPage.body).find(f => formFields(f).some(isPassword))) || regForm;
    const freshToken = tokenOf(freshForm) || tokenOf(freshPage ? freshPage.body : "");

    // ── 6. a stranger can't change your data ──────────────────────────────────
    const doors = [`/${route}/Create`, `/${route}/Edit/${ids[0]}`, `/${route}/Delete/${ids[0]}`];
    const open = [];
    for (const d of doors) {
      const r = await send(root + d);
      if (!r || !isSignInUrl(r.url)) open.push(`${d} (${r ? r.status : "no answer"})`);
    }
    // The POST is what writes. Send an empty one — nothing a guard lets through.
    const posted = await send(root + `/${route}/Create`, { method: "POST", form: { __RequestVerificationToken: freshToken } });
    const postOpen = !posted || !isSignInUrl(posted.url);
    if (postOpen) open.push(`a POST to /${route}/Create (${posted ? posted.status : "no answer"})`);
    set("locked", open.length ? "fail" : "pass",
      open.length ? null : `a stranger can't change your data — /${route} Create, Edit and Delete all ask for an account`, {
        hint: `signed out, these did NOT send me to sign in: ${open.join(", ")}.`,
        todo: postOpen && open.length === 1
          ? "The GETs are locked and the POST isn't. Locking a GET hides the form; it doesn't lock the "
            + "POST, and a form is not the only way to send one. Put [Authorize] on the controller "
            + "class, then [AllowAnonymous] on Index and Details."
          : "[Authorize] on the controller class (using Microsoft.AspNetCore.Authorization;), then "
            + "[AllowAnonymous] on Index and Details. ⚠️ An attribute is the kind of edit hot reload "
            + "can report as applied when it isn't — if a locked page still opens, restart your app.",
      });

    // ── 3. a visitor can create an account ────────────────────────────────────
    const regBody = { __RequestVerificationToken: freshToken };
    for (const f of formFields(freshForm)) {
      if (f.hidden) continue;
      if (isPassword(f)) regBody[f.name] = PASSWORD;
      else if (isEmail(f)) regBody[f.name] = EMAIL;
      else regBody[f.name] = validValue(f);
    }
    const action = formAction(freshForm) || "/Account/Register";
    const reg = await send(new URL(action, root + "/Account/Register").toString(), { method: "POST", form: regBody });
    const refused = !reg || (!reg.redirected && hasErrors(reg.body));
    if (reg && reg.redirected) {
      leftBehind = true;
      set("create", "pass", `a visitor can create an account — ${EMAIL}`);
    } else if (refused && reg && /already taken|already registered|is taken/i.test(reg.body)) {
      // An earlier run made it. Use it rather than make another.
      adopted = true;
      set("create", "pass", "a visitor can create an account — reused the one from an earlier run");
    } else {
      set("create", "fail", null, {
        hint: reg && hasErrors(reg.body)
          ? "I filled in your registration form using your own rules and it was refused, with an "
            + `error on the page. My password is ${PASSWORD} — upper, lower, a digit and a symbol — `
            + "so if you tightened Identity's password rules, that may be why."
          : `the registration POST came back ${reg ? reg.status : "nothing"} with no redirect and no `
            + "error on the page.",
        todo: "After CreateAsync succeeds, sign the new user in and redirect:\n"
            + "    await _signInManager.SignInAsync(user, isPersistent: false);\n"
            + "    return RedirectToAction(\"Index\", \"Home\");\n"
            + "...and when it fails, copy result.Errors into ModelState so the reasons show.",
      });
    }

    // Registering signs you in. An adopted account has to sign in instead.
    if (!(await signedIn())) await signIn(PASSWORD);

    // ── 4. signed in, the navbar says so ──────────────────────────────────────
    const homeIn = await send(root + "/");
    const formOut = homeIn && signOutForm(homeIn.body);
    if (!results.create.pass) {
      set("navbar", "blocked", null, { hint: "needs an account to sign in with" });
    } else if (formOut) {
      set("navbar", "pass");
    } else {
      const linkOut = homeIn && signOutLink(homeIn.body);
      set("navbar", "fail", null, {
        hint: linkOut
          ? "your Sign out is a LINK. A link is a GET, and any page on the internet can make a "
            + "browser send a GET — an <img> tag is enough — so a GET must never sign anybody out."
          : "after creating an account (and signing in with it), the home page's navbar shows no "
            + "way to sign out — so either nothing signed me in, or the navbar doesn't change.",
        todo: linkOut
          ? "Make it a form: <form asp-controller=\"Account\" asp-action=\"Logout\" method=\"post\"> "
            + "with a button inside, and mark the Logout action [HttpPost]."
          : "Views/Shared/_LoginPartial.cshtml — a Sign out form when User.Identity.IsAuthenticated, "
            + "Join and Sign in links when not — and <partial name=\"_LoginPartial\" /> in "
            + "_Layout.cshtml after the navbar's </ul>.",
      });
    }

    // ── 9. the navbar knows your name ─────────────────────────────────────────
    const ownValue = own.length ? validValue(own[0]) : null;
    if (!own.length) set("name", "blocked", null, { hint: "needs a field of your own on the registration form" });
    else if (!formOut) set("name", "blocked", null, { hint: "needs the signed-in navbar first" });
    else set("name", homeIn.body.includes(ownValue) ? "pass" : "fail",
      `the navbar knows the name you registered with — "${ownValue}"`, {
        hint: `I registered with ${own[0].name} = "${ownValue}", and the signed-in navbar doesn't show it.`,
        todo: "In _LoginPartial, look the user up and show your property where the email was:\n"
            + "    @inject UserManager<YourUser> UserManager\n"
            + "    var user = await UserManager.GetUserAsync(User);\n"
            + "...then @user?.YourProperty. Check the Register POST sets it on the new user, too.",
      });

    // ── 7. signed in, your form opens ─────────────────────────────────────────
    // Only worth asking once the form is locked — an open form opens for anyone.
    if (!formOut) {
      set("opens", "blocked", null, { hint: "needs a signed-in account first" });
    } else if (!results.locked.pass) {
      set("opens", "blocked", null, { hint: "needs the lock first — an unlocked form opens for anyone" });
    } else {
      const opened = await send(root + `/${route}/Create`);
      const ok = opened && opened.status < 400 && !isSignInUrl(opened.url);
      set("opens", ok ? "pass" : "fail", `signed in, your form opens — /${route}/Create`, {
        hint: `signed in, /${route}/Create ` + (opened && isSignInUrl(opened.url)
          ? "still sends me to sign in — even though the navbar says I'm signed in."
          : `came back ${opened ? opened.status : "nothing"}.`),
        todo: "In Program.cs, app.UseAuthentication(); has to come BEFORE app.UseAuthorization();. "
            + "The other way round, the lock is checked before the sign-in cookie has been read, so "
            + "every signed-in visitor looks like a stranger to it.",
      });
    }

    // ── 5. sign out, sign back in, a wrong password refused ───────────────────
    if (!formOut) {
      set("inout", "blocked", null, { hint: "needs the Sign out form first" });
    } else {
      await signOut();
      const outOk = !(await signedIn());
      const wrong = await signIn(WRONG);
      const wrongRefused = wrong && !(await signedIn());
      const right = await signIn(PASSWORD);
      const rightOk = right && (await signedIn());
      const ok = outOk && wrongRefused && rightOk;
      set("inout", ok ? "pass" : "fail", null, {
        hint: !outOk ? "posting your Sign out form left me signed in."
          : !wrong ? "/Account/Login has no form with a password box on it."
          : !wrongRefused ? "a WRONG password signed me in."
          : "the right password didn't sign me back in.",
        todo: !outOk
          ? "The Logout action is [HttpPost] and calls await _signInManager.SignOutAsync(); before it redirects."
          : "The Login POST:\n"
            + "    var result = await _signInManager.PasswordSignInAsync(form.Email, form.Password, form.RememberMe, lockoutOnFailure: false);\n"
            + "...redirect only when result.Succeeded; otherwise add one error to ModelState and return View(form).",
      });
    }

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
    "1 pt — a user class of your own that inherits IdentityUser, with at least one property of its own",
    "1 pt — your context inherits IdentityDbContext<YourUser>",
    "1 pt — a migration that creates AspNetUsers, on top of the migrations you already had",
    "3 pts — 3+ meaningful commits, pushed to a public repo",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  const LEFTOVER = `This created one account, ${EMAIL}, on your site. Every run after this one `
    + "REUSES it rather than making another. Delete it by hand in the mssql panel (the AspNetUsers "
    + "table) if you want it gone.";

  const SIGNED_OUT = "Your browser is now SIGNED OUT — the check signs its own account in and out "
    + "to test your login. Sign back in as yourself if you were.";

  const WHERE_THE_POINTS_ARE =
    "14 of the 20 points are in this script. Sign-in is visible from outside — a stranger is sent "
    + "to the sign-in page, a member isn't — so that is exactly what this checks. The other 6: your "
    + "user class, context and migration (3, from your repo) and commits (3).";

  // ── Node: export for the grader, and support `node homework-checks.js <url>` ──
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { runChecks, MARKER, EMAIL };
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
      console.log(`   ⚠️  this creates ONE account, ${EMAIL}, and reuses it forever after\n`);
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
      else console.log("\n🎉 Your site knows who its visitors are — and strangers can read it, but can't change it.");

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
        console.log("%c🎉 Your site knows who its visitors are — and strangers can read it, but can't change it.", `${bold}; color: green`);
      }

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
      console.log(`%c⚠️  This creates one account (${EMAIL}), signs it in and out, and leaves your browser signed out.`, "color: #d29922");
      if (forcedRoute) console.log(`Checking /${forcedRoute} directly (you told me where to look).`);
      return runChecks(window.location.origin, forcedRoute || null, printCheck, { write: true }).then(report);
    };

    // Nothing runs on load. Typing recheck() is the consent — it creates an
    // account and signs your browser out.
    window.recheck = (forcedRoute) => run(forcedRoute);

    console.log(`%c🔎 Week ${WEEK} self-check is loaded — but it hasn't run.`, big);
    console.log("%cType  recheck()  to check your work. It creates an account and signs your browser out, so nothing happens until you ask.",
      "color: #79c0ff");
    console.log("%cWorking on a different controller than I'd guess?  recheck(\"Trails\")  with your own name.",
      "color: #79c0ff");
  }
})();
