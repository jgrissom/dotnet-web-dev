// ═══════════════════════════════════════════════════════════════════════════
//  Week 12 homework self-check — the SAME checks I grade with.
//
//  EASIEST WAY — include it like a CDN, exactly like last week. Open
//  Views/Home/Index.cshtml, find the week-11 line, and REPLACE it:
//
//    @section Scripts {
//        <script src="https://jgrissom.github.io/dotnet-web-dev/week-12/homework-checks.js"></script>
//    }
//
//  Then load that page and open the console (F12). NOTHING RUNS ON ITS OWN.
//  Type  recheck()  when you want it to run.
//
//  ⚠️  IT SIGNS IN AS WEEK 11'S SELF-CHECK ACCOUNT — week11-selfcheck@example.com
//  — which your site already has if you ran last week's check. If it doesn't,
//  this makes it, once, and reuses it after that. That account must NOT hold
//  your role: it is the "signed in, but not allowed" visitor this check needs.
//  WHEN IT FINISHES YOUR BROWSER IS SIGNED OUT, even if you were signed in as
//  yourself before. Sign back in when it's done.
//
//  ⚠️  IT CANNOT SEE YOUR ADMIN SUCCEED. It doesn't know your admin's email or
//  password, and it never should. It checks that everyone ELSE is refused.
//  Signing in as yourself and making a change is your job, and it's in the
//  homework as a step of its own.
//
//  14 of the 20 points are in here. The rest: 3 from your repo (the role on
//  the attribute, a seeder that creates it, and the email read from
//  configuration) and 3 from commits.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const WEEK = 12;
  // Week 11's own account, so a site that ran last week's check gets nothing new.
  const EMAIL = "week11-selfcheck@example.com";
  // Passes Identity's default rules: upper, lower, a digit, a symbol, 6+ long.
  const PASSWORD = "Week11-Check!";
  const MARKER = `Week ${WEEK} Test`;
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

  // A link a visitor could click to a write. Routing ignores case; so does this.
  function writeLinks(html, route, id) {
    const found = [];
    const re = (p) => new RegExp(`href=["']/${route}/${p}(?:["'?/])`, "i");
    if (re("Create").test(html)) found.push(`/${route}/Create`);
    if (id != null && re(`Edit/${id}`).test(html)) found.push(`/${route}/Edit/${id}`);
    if (id != null && re(`Delete/${id}`).test(html)) found.push(`/${route}/Delete/${id}`);
    return found;
  }

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
  async function runChecks(baseUrl, forcedRoute, onCheck, opts = {}) {
    const write = opts.write !== false;
    const root = String(baseUrl).replace(/\/$/, "");
    const stale = new Set();
    const results = {};
    let leftBehind = false, adopted = false, wasSignedIn = false;

    const CHECKS = [
      // In requirement order, so the first red one is always the next thing to build.
      ["read", 1, "anyone can still read your list and a record's page"],
      ["stranger", 2, "a visitor who isn't signed in is still sent to sign in"],
      ["account", 1, "the self-check can sign in — as someone WITHOUT your role"],
      ["refused", 4, "signed in without your role, every change is refused"],
      ["denied", 3, "the refusal lands on a page of your own"],
      ["hidden", 3, "nobody without your role sees a button for a change"],
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
      return { route, checks, stale: [...stale], leftBehind, adopted, wasSignedIn, readOnly: !write, ...tally(checks) };
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
          ? "Look at the terminal (or Azure's Log stream) for the real exception."
          : "Start your app (dotnet watch), or check that your deployed URL is right. From this week "
            + "your app reads the database the moment it starts, so a missing or wrong connection "
            + "string now stops it before 'Now listening on:' — read the terminal (or Azure's Log stream).",
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

    // Start signed out, whoever was signed in before — very likely their admin.
    if (write && wasSignedIn) await signOut();

    // ── 1. find their list controller, the way a visitor would ────────────────
    const tries = forcedRoute ? [forcedRoute] : navCandidates(home.body);
    let route = null, index = null;
    for (const cand of tries) {
      const page = await getWithWakeup(`${root}/${cand}`);
      if (!page || page.status >= 400 || isSignInUrl(page.url) || isDeniedUrl(page.url)) continue;
      if (detailsIds(page.body, cand).length) { route = cand; index = page; break; }
    }
    if (!route) {
      set("read", "fail", null, {
        hint: "I couldn't find a list page in your navbar that a visitor can open and that links to "
            + "a record's Details page.",
        todo: "If your list page now sends visitors away, the [AllowAnonymous] on Index is missing — "
            + "reading stays public. Otherwise run  recheck(\"Trails\")  with YOUR controller name.",
      });
      return done(null);
    }
    staleCheckers(index.body).forEach(w => stale.add(w));
    const id = detailsIds(index.body, route)[0];
    const detailsPage = await getWithWakeup(`${root}/${route}/Details/${id}`);
    const detailsOk = detailsPage && detailsPage.status < 400 && !isSignInUrl(detailsPage.url) && !isDeniedUrl(detailsPage.url);
    set("read", detailsOk ? "pass" : "fail", `anyone can still read your list and a record's page — /${route}`, {
      hint: `/${route} opens, but /${route}/Details/${id} `
          + (detailsPage && (isSignInUrl(detailsPage.url) || isDeniedUrl(detailsPage.url)) ? "sends a visitor away." : `came back ${detailsPage ? detailsPage.status : "nothing"}.`),
      todo: "Reading is public. Keep [AllowAnonymous] on Index and Details.",
    });

    // What a stranger sees on the two pages that read. Judged later, with the
    // signed-in visitor's view, as one check.
    const strangerSees = [
      ...writeLinks(index.body, route, null),
      ...(detailsOk ? writeLinks(detailsPage.body, route, id) : []),
    ];

    const doors = [`/${route}/Create`, `/${route}/Edit/${id}`, `/${route}/Delete/${id}`];

    // ── 2. a stranger is still sent to sign in ────────────────────────────────
    if (!write) {
      ["stranger", "account", "refused", "denied", "hidden"].forEach(k =>
        set(k, "blocked", null, { hint: "run  recheck()  to include this — it signs in, so it isn't automatic" }));
      return done(route);
    }
    const strangerToken = tokenOf((await send(root + "/Account/Login") || {}).body || "");
    const open = [];
    for (const d of doors) {
      const r = await send(root + d);
      if (!r || !isSignInUrl(r.url)) open.push(`${d} (${r ? r.status : "no answer"})`);
    }
    const strangerPost = await send(root + `/${route}/Create`, { method: "POST", form: { __RequestVerificationToken: strangerToken } });
    if (!strangerPost || !isSignInUrl(strangerPost.url)) open.push(`a POST to /${route}/Create (${strangerPost ? strangerPost.status : "no answer"})`);
    set("stranger", open.length ? "fail" : "pass",
      open.length ? null : `a visitor who isn't signed in is still sent to sign in — /${route} Create, Edit and Delete`, {
        hint: `signed out, these did NOT send me to sign in: ${open.join(", ")}.`,
        todo: "The attribute stays on the controller CLASS — [Authorize(Roles = \"YourRole\")] — with "
            + "[AllowAnonymous] on Index and Details. Week 12 changes week 11's attribute; it doesn't move it.",
      });

    // ── 3. the self-check signs in, as someone without the role ───────────────
    let signin = await signIn();
    if (!(await signedIn())) {
      const reg = await register();
      if (reg && reg.redirected) leftBehind = true;
      if (!(await signedIn())) signin = await signIn();
    } else {
      adopted = true;
    }
    const inNow = await signedIn();
    set("account", inNow ? "pass" : "fail",
      inNow ? `the self-check can sign in — as ${EMAIL}, ${adopted ? "week 11's account" : "made just now"}` : null, {
        hint: `I couldn't sign in as ${EMAIL} (password ${PASSWORD}), and registering it didn't sign me in either.`,
        todo: "Week 11's register and sign-in pages have to keep working: /Account/Register and "
            + "/Account/Login, and a Sign out form in the navbar when someone is signed in.",
      });
    if (!inNow) {
      ["refused", "denied"].forEach(k => set(k, "blocked", null, { hint: "needs a signed-in visitor first" }));
      set("hidden", "blocked", null, { hint: "needs a signed-in visitor first" });
      return done(route);
    }

    // ── 4. signed in, without the role: every change is refused ───────────────
    const memberHome = await send(root + "/");
    const memberToken = tokenOf(memberHome ? memberHome.body : "");
    const let_in = [];
    let deniedAt = null, deniedPage = null;
    for (const d of doors) {
      const r = await send(root + d);
      const refused = r && (r.status === 403 || isDeniedUrl(r.url));
      if (!refused) let_in.push(`${d} (${r ? (isSignInUrl(r.url) ? "sent to sign in" : r.status) : "no answer"})`);
      else if (!deniedPage) { deniedAt = d; deniedPage = r; }
    }
    const post = await send(root + `/${route}/Create`, { method: "POST", form: { __RequestVerificationToken: memberToken } });
    const postRefused = post && (post.status === 403 || isDeniedUrl(post.url));
    if (!postRefused) let_in.push(`a POST to /${route}/Create (${post ? post.status : "no answer"})`);
    const onlyPost = !postRefused && let_in.length === 1;
    set("refused", let_in.length ? "fail" : "pass",
      let_in.length ? null : `signed in without your role, every change is refused — /${route} Create, Edit, Delete and a POST`, {
        hint: `signed in as ${EMAIL} — an account that should hold no role — these let me in: `
            + `${let_in.join(", ")}. If you gave that account your role, give it to your OWN email instead.`,
        todo: onlyPost
          ? "The GETs are refused and the POST isn't. The role goes on the controller CLASS, not on the "
            + "GET actions — a form is not the only way to send a POST."
          : "Change week 11's [Authorize] on the class to [Authorize(Roles = \"YourRole\")]. Signed in is "
            + "not trusted: anyone can make an account. ⚠️ An attribute is the kind of edit hot reload "
            + "can report as applied when it isn't — if a page still opens, restart your app.",
      });

    // ── 5. the refusal lands on a page of their own ───────────────────────────
    if (!deniedPage) {
      set("denied", "blocked", null, { hint: "needs a refusal first" });
    } else {
      const ok = deniedPage.status === 200;
      set("denied", ok ? "pass" : "fail",
        ok ? `the refusal lands on a page of your own — ${pathOf(deniedPage.url)}` : null, {
          hint: `${deniedAt} sent me to ${pathOf(deniedPage.url)}, which came back ${deniedPage.status}`
              + (deniedPage.status === 404 ? " — your Missing page, because nothing answers there." : "."),
          todo: "Identity sends a signed-in visitor without the role to /Account/AccessDenied. Write it: "
              + "an AccessDenied() action on AccountController that returns View(), and "
              + "Views/Account/AccessDenied.cshtml saying who the page is for. View first, then the action.",
        });
    }

    // ── 6. no buttons for anyone without the role ─────────────────────────────
    const memberIndex = await send(`${root}/${route}`);
    const memberDetails = await send(`${root}/${route}/Details/${id}`);
    const memberSees = [
      ...(memberIndex ? writeLinks(memberIndex.body, route, null) : []),
      ...(memberDetails ? writeLinks(memberDetails.body, route, id) : []),
    ];
    const shown = [
      ...strangerSees.map(l => `${l} (signed out)`),
      ...memberSees.map(l => `${l} (signed in, no role)`),
    ];
    set("hidden", shown.length ? "fail" : "pass",
      shown.length ? null : `nobody without your role sees a button for a change — /${route} and /${route}/Details/${id}`, {
        hint: `these links are on the page for people who can't use them: ${shown.join(", ")}.`,
        todo: "Wrap each write link — on the list and on a record's page — in "
            + "@if (User.IsInRole(\"YourRole\")) { … }. Hiding a link is not security; the attribute is. "
            + "It just stops showing people buttons that lead to a refusal.",
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
    "1 pt — [Authorize(Roles = \"…\")] on a controller class",
    "1 pt — a seeder that creates your role and gives it out with AddToRoleAsync",
    "1 pt — the email it gives the role to comes from configuration (Admin:Email), not your code",
    "3 pts — 3+ meaningful commits, pushed to a public repo",
  ];

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  const LEFTOVER = `This created one account on your site — ${EMAIL} — because it wasn't there yet. `
    + "Every run after this one REUSES it. Never give it your role. Delete it by hand in the mssql "
    + "panel (the AspNetUsers table) if you want it gone.";

  const SIGNED_OUT = "Your browser is now SIGNED OUT — the check signs its own account in and out. "
    + "Sign back in as yourself if you were.";

  const CANT_SEE_ADMIN = "This check can't see your admin succeed: it doesn't know your admin's email or "
    + "password, and it never should. Sign in as yourself and make one change — that's the homework's "
    + "last step, and it's yours to do.";

  const WHERE_THE_POINTS_ARE =
    "14 of the 20 points are in this script — everything a visitor WITHOUT your role can see from "
    + "outside. The other 6: the role, its seeder and its configuration (3, from your repo) and commits (3).";

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
      else console.log("\n🎉 Everyone without your role can read your site, and nobody without it can change it.");

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
        console.log("%c🎉 Everyone without your role can read your site, and nobody without it can change it.", `${bold}; color: green`);
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
      console.log(`%c⚠️  This signs in as ${EMAIL} (making it once if it isn't there) and leaves your browser signed out.`, "color: #d29922");
      if (forcedRoute) console.log(`Checking /${forcedRoute} directly (you told me where to look).`);
      return runChecks(window.location.origin, forcedRoute || null, printCheck, { write: true }).then(report);
    };

    // Nothing runs on load. Typing recheck() is the consent — it signs your
    // browser out.
    window.recheck = (forcedRoute) => run(forcedRoute);

    console.log(`%c🔎 Week ${WEEK} self-check is loaded — but it hasn't run.`, big);
    console.log("%cType  recheck()  to check your work. It signs in as its own account and signs your browser out, so nothing happens until you ask.",
      "color: #79c0ff");
    console.log("%cWorking on a different controller than I'd guess?  recheck(\"Trails\")  with your own name.",
      "color: #79c0ff");
  }
})();
