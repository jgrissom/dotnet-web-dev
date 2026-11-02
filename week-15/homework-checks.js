// ═══════════════════════════════════════════════════════════════════════════
//  Week 15 stretch self-check. Optional: nothing here is graded.
//
//  EASIEST WAY — include it like a CDN, exactly like last week. Open
//  Views/Home/Index.cshtml, find last week's line, and REPLACE it:
//
//    @section Scripts {
//        <script src="https://jgrissom.github.io/dotnet-web-dev/week-15/homework-checks.js"></script>
//    }
//
//  Then load that page and open the console (F12). NOTHING RUNS ON ITS OWN.
//  Type  recheck()  when you want it to run.
//
//  ✅  THIS ONE ONLY READS. Search and paging are public, so it signs nothing
//  in, creates nothing, and leaves your browser exactly as it found it. If
//  you're signed in as your admin, you stay signed in. It's the first check
//  since week 10 that doesn't sign you out.
//
//  ⚠️  IT CANNOT SEE YOUR CONFIRMATION MESSAGE OR YOUR SERVICE. A message only
//  appears after a change, and a change needs your role, which this check
//  doesn't hold. A service is invisible from outside. The stretch page tells
//  you how to test the message yourself.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const WEEK = 15;
  const inBrowser = typeof window !== "undefined";

  // A word no student's records contain, to prove the search really filters.
  const NONSENSE = "zqxjkvw";

  // One request, redirects followed.
  async function send(url, timeoutMs = 45000) {
    try {
      const res = await fetch(url, { redirect: "follow", credentials: "same-origin", signal: AbortSignal.timeout(timeoutMs) });
      return { status: res.status, url: res.url, body: await res.text() };
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
    [...String(html).matchAll(new RegExp(`/${route}/Details/(\\d+)`, "gi"))].map(m => Number(m[1]))
  )];

  const pathOf = (url) => { try { return new URL(url).pathname; } catch { return String(url); } };
  const isSignInUrl = (url) => /\/login\b|\/signin\b/i.test(pathOf(url));

  const decode = (s) => String(s).replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

  // The words of a record's own title, longest first. A record's page has shown
  // its name in an <h1> since week 4.
  function titleOf(html) {
    const m = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(String(html));
    return m ? decode(m[1].replace(/<[^>]+>/g, " ")).trim() : "";
  }
  const wordsOf = (title) => [...new Set(title.match(/[\p{L}\p{N}]{3,}/gu) || [])].sort((a, b) => b.length - a.length);

  // ── their search box ────────────────────────────────────────────────────────

  function forms(html) {
    return [...String(html).matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/gi)].map(m => {
      const form = m[0];
      const open = form.slice(0, form.indexOf(">") + 1);
      const method = (/method\s*=\s*["']([^"']*)["']/i.exec(open) || [])[1];
      const action = (/\saction\s*=\s*["']([^"']*)["']/i.exec(open) || [])[1];
      const inputs = [...form.matchAll(/<input\b[^>]*>/gi)].map(i => {
        const at = (a) => (i[0].match(new RegExp(`\\b${a}\\s*=\\s*["']([^"']*)["']`, "i")) || [])[1];
        return { name: at("name"), type: (at("type") || "text").toLowerCase(), value: decode(at("value") || "") };
      }).filter(i => i.name && !/^__/.test(i.name));
      const selects = [...form.matchAll(/<select\b[^>]*>([\s\S]*?)<\/select>/gi)].map(s => {
        const name = (s[0].match(/\bname\s*=\s*["']([^"']*)["']/i) || [])[1];
        const picked = /<option\b[^>]*\bselected\b[^>]*value\s*=\s*["']([^"']*)["']|<option\b[^>]*value\s*=\s*["']([^"']*)["'][^>]*\bselected\b/i.exec(s[1]);
        const first = /<option\b[^>]*value\s*=\s*["']([^"']*)["']/i.exec(s[1]);
        return { name, value: decode((picked && (picked[1] ?? picked[2])) ?? (first ? first[1] : "")) };
      }).filter(s => s.name);
      const box = inputs.find(i => i.type === "search") || inputs.find(i => i.type === "text");
      return { isGet: !method || /^get$/i.test(method), method, action: action ? decode(action) : null, inputs, selects, box };
    });
  }

  // The URL a browser would load if a visitor typed `term` and pressed the button.
  function searchUrl(form, term, listUrl) {
    const url = new URL(form.action || listUrl, listUrl);
    url.search = "";
    for (const i of form.inputs) {
      if (i === form.box) continue;
      if (i.type === "hidden") url.searchParams.set(i.name, i.value);
    }
    for (const s of form.selects) url.searchParams.set(s.name, s.value);
    url.searchParams.set(form.box.name, term);
    return url.toString();
  }

  // ── their page links ────────────────────────────────────────────────────────

  // A link to another page of the same list, however they spelled it:
  // /Trails?page=2, /Trails?p=2&search=x, /Trails/Index?pageNumber=2, /Trails/Page/2.
  function pageLinks(html, route, listUrl) {
    const found = [];
    for (const m of String(html).matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)) {
      let url;
      try { url = new URL(decode(m[1]), listUrl); } catch { continue; }
      const onList = new RegExp(`^/${route}(?:/index)?/?$`, "i").test(url.pathname);
      if (onList) {
        for (const [name, value] of url.searchParams) {
          if (/^\d+$/.test(value) && !/^id$/i.test(name)) found.push({ url, name, number: Number(value) });
        }
      }
      const path = new RegExp(`^/${route}/(?:index/|page/)(\\d+)/?$`, "i").exec(url.pathname);
      if (path) found.push({ url, name: null, number: Number(path[1]) });
    }
    return found;
  }

  // The same link, pointed at page n.
  function linkTo(link, n) {
    const url = new URL(link.url);
    if (link.name) url.searchParams.set(link.name, String(n));
    else url.pathname = url.pathname.replace(/\d+\/?$/, String(n));
    return url.toString();
  }

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
   * Returns { route, checks, earned, ..., stale, boxName, pageParam, records }
   * `blocked` = couldn't be judged yet because an earlier step isn't done.
   * Shared with the grader so students and I run identical logic.
   */
  async function runChecks(baseUrl, forcedRoute, onCheck) {
    const root = String(baseUrl).replace(/\/$/, "");
    const stale = new Set();
    const results = {};
    let boxName = null, pageParam = null, records = null;

    const CHECKS = [
      // In requirement order, so the first red one is always the next thing to build.
      ["read", 1, "anyone can still read your list and a record's page"],
      ["box", 1, "your list page has a search box that sends a GET"],
      ["found", 3, "searching finds a record by its name"],
      ["nomatch", 2, "a search that matches nothing lists nothing, and doesn't break"],
      ["paged", 3, "your list comes in pages, and every record is on exactly one"],
      ["keep", 1, "a page link remembers what was searched for"],
      ["edges", 1, "a page number nobody should type doesn't break the page"],
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
      return { route, checks, stale: [...stale], boxName, pageParam, records, ...tally(checks) };
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
          ? "Look at the terminal (or Azure's Log stream) for the real exception. If it says Unable to "
            + "resolve service, the AddScoped line is missing from Program.cs."
          : "Start your app (dotnet watch), or check that your deployed URL is right. Your app reads the "
            + "database the moment it starts, so a missing or wrong connection string stops it before "
            + "'Now listening on:' — read the terminal (or Azure's Log stream).",
      });
      return done(null);
    }
    staleCheckers(home.body).forEach(w => stale.add(w));

    // ── find their list controller, the way a visitor would ───────────────────
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
        todo: "If your list page throws now, read the terminal: changing the action's model usually needs "
            + "the view's @model changed too. Otherwise run  recheck(\"Trails\")  with YOUR controller name.",
      });
      return done(null);
    }
    staleCheckers(index.body).forEach(w => stale.add(w));
    const listUrl = index.url;
    const firstIds = detailsIds(index.body, route);
    const detailsPage = await getWithWakeup(`${root}/${route}/Details/${firstIds[0]}`);
    const detailsOk = detailsPage && detailsPage.status < 400 && !isSignInUrl(detailsPage.url);
    set("read", detailsOk ? "pass" : "fail", `anyone can still read your list and a record's page — /${route}`, {
      hint: `/${route} opens, but /${route}/Details/${firstIds[0]} came back ${detailsPage ? detailsPage.status : "nothing"}.`,
      todo: "Reading is public. Keep [AllowAnonymous] on Index and Details.",
    });

    // ── every record, page by page ────────────────────────────────────────────
    // Walking the pager first means the search can be tested on a record that
    // ISN'T on page one, which is the only way to tell a real search from one
    // that filters what's already on the screen.
    const links = pageLinks(index.body, route, listUrl).filter(l => l.number >= 2);
    const link = links.find(l => l.name && /page/i.test(l.name)) || links[0] || null;
    if (link) pageParam = link.name || "(in the path)";
    const pages = [firstIds];
    if (link) {
      for (let n = 2; n <= 30; n++) {
        const next = await send(linkTo(link, n));
        if (!next || next.status >= 400) break;
        const ids = detailsIds(next.body, route);
        if (!ids.length || ids.every(i => pages.flat().includes(i))) { if (n === 2) pages.push(ids); break; }
        pages.push(ids);
      }
    }
    const all = [...new Set(pages.flat())];
    records = all.length;

    // Their own titles — the words the search is tried with.
    const titles = new Map();
    for (const id of all.slice(0, 12)) {
      const page = await send(`${root}/${route}/Details/${id}`);
      if (page && page.status < 400) titles.set(id, titleOf(page.body));
    }

    // ── their search box ──────────────────────────────────────────────────────
    const allForms = forms(index.body);
    const form = allForms.find(f => f.box && f.isGet);
    if (!form) {
      const post = allForms.find(f => f.box && !f.isGet);
      set("box", "fail", null, {
        hint: post
          ? `your list page has a box named ${post.box.name}, in a form that POSTs. A search changes nothing `
            + "and should be bookmarkable."
          : `/${route} has no form with a text or search box in it.`,
        todo: post
          ? "Change the form to method=\"get\", so the search lands in the address bar."
          : "Add a <form method=\"get\"> with an <input type=\"search\" name=\"search\"> above your list, and "
            + "give the Index action a matching  string? search  parameter.",
      });
      ["found", "nomatch"].forEach(k => set(k, "blocked", null, { hint: "needs a search box first" }));
      set("keep", "blocked", null, { hint: "needs a search box first" });
    } else {
      boxName = form.box.name;
      set("box", "pass", `your list page has a search box that sends a GET — it's named ${form.box.name}`);

      // Nonsense first: a box that ignores what's typed would otherwise "find" everything.
      const none = await send(searchUrl(form, NONSENSE, listUrl));
      const noneIds = none && none.status < 400 ? detailsIds(none.body, route) : null;
      const ignored = noneIds !== null && noneIds.length >= firstIds.length;
      set("nomatch", noneIds !== null && !ignored ? "pass" : "fail",
        noneIds !== null && !ignored ? `a search that matches nothing lists nothing, and doesn't break — ?${boxName}=${NONSENSE}` : null, {
          hint: none && none.status >= 400
            ? `?${boxName}=${NONSENSE} came back ${none.status}.`
            : `?${boxName}=${NONSENSE} still listed ${noneIds ? noneIds.length : 0} records — the same as no search at all.`,
          todo: `The box is there and nothing reads it. The Index action needs a parameter named ${boxName}, `
              + "and a Where that uses it. The name in the form and the name in the action have to match.",
        });

      // Search for a record on the LAST page, by a word from its own title.
      const lastPage = pages[pages.length - 1];
      const target = [...lastPage].reverse().find(id => titles.get(id)) ?? [...titles.keys()][0];
      const title = titles.get(target) || "";
      let hit = null, tried = [];
      for (const word of wordsOf(title).slice(0, 3)) {
        tried.push(word);
        const res = await send(searchUrl(form, word, listUrl));
        if (res && res.status < 400 && detailsIds(res.body, route).includes(target)) { hit = word; break; }
      }
      const offPageOne = !firstIds.includes(target);
      const real = !!hit && !ignored;
      set("found", real ? "pass" : "fail",
        real ? `searching finds a record by its name — ${hit} finds "${title}"${offPageOne ? ", which isn't on page 1" : ""}` : null, {
          hint: ignored
            ? "the box doesn't change what's listed, so finding a record proves nothing."
            : `I searched for ${tried.join(", ") || "the words of a record's title"} and "${title}" didn't come back.`
              + (offPageOne ? " That record isn't on page 1 — if the Where runs after Skip and Take, it only searches the page you're on." : ""),
          todo: ignored
            ? `The box is there and nothing reads it. The Index action needs a parameter named ${boxName}, `
              + "and a Where that uses it. The name in the form and the name in the action have to match."
            : "Search the query before you page it: the Where comes first, then Count, then Skip and Take. "
              + "Your search has to look in the property you show as the record's name.",
        });

      // A term with enough matches for a second page, so a page link can be read.
      const counts = new Map();
      for (const t of titles.values()) {
        for (const ch of new Set(t.toLowerCase().replace(/[^\p{L}]/gu, ""))) counts.set(ch, (counts.get(ch) || 0) + 1);
      }
      const letters = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0]).slice(0, 4);
      let keepLink = null, keepTerm = null;
      if (link) {
        for (const letter of letters) {
          const res = await send(searchUrl(form, letter, listUrl));
          const found = res && res.status < 400 ? pageLinks(res.body, route, listUrl).filter(l => l.number >= 2) : [];
          if (found.length) { keepLink = found[0]; keepTerm = letter; break; }
        }
      }
      if (!link) {
        set("keep", "blocked", null, { hint: "needs a second page first" });
      } else if (ignored) {
        set("keep", "blocked", null, { hint: "needs a search that works first" });
      } else if (!keepLink) {
        set("keep", "blocked", null, {
          hint: "no search I could think of matched enough records for a second page, so there's no page link to read.",
          todo: "Lower your page size, or add a record or two, so that a one-letter search spills onto a second page.",
        });
      } else {
        const kept = keepLink.url.searchParams.get(boxName);
        const ok = kept !== null && kept.toLowerCase() === keepTerm.toLowerCase();
        set("keep", ok ? "pass" : "fail", ok ? `a page link remembers what was searched for — ?${boxName}=${keepTerm}` : null, {
          hint: `I searched for ${keepTerm}, and the link to page 2 is ${keepLink.url.pathname}${keepLink.url.search}. `
              + "It forgets the search, so page 2 is page 2 of everything.",
          todo: `Every page link carries the search: add  asp-route-${boxName}="@Model.Search"  to it, `
              + "and the same for any filter.",
        });
      }
    }

    // ── their pages ───────────────────────────────────────────────────────────
    if (!link) {
      set("paged", "blocked", null, {
        hint: `your list shows ${firstIds.length} record${firstIds.length === 1 ? "" : "s"} and no link to a second page. `
            + "Either paging isn't built yet, or your page size is bigger than your list. I can't tell which from "
            + "here, and I won't guess.",
        todo: firstIds.length > 2
          ? `Page your list. Your page size has to be smaller than your record count: with ${firstIds.length} `
            + "on this page, a page size of 2 works. There's a link to the next page on every page but the last."
          : "A second page needs more records than a page holds. Add a record or two as your admin, and use a "
            + "page size of 2.",
      });
      set("edges", "blocked", null, { hint: "needs a page number to try" });
    } else {
      const flat = pages.flat();
      const dupes = flat.length !== new Set(flat).size;
      const second = pages[1] || [];
      const moved = second.length > 0 && !second.every(id => firstIds.includes(id));
      set("paged", moved && !dupes ? "pass" : "fail",
        moved && !dupes ? `your list comes in pages, and every record is on exactly one — ${all.length} records on ${pages.length} pages, ?${pageParam}=` : null, {
          hint: !moved
            ? `the link to page 2 is there, and page 2 shows the same records as page 1 (or none).`
            : "a record turned up on two different pages.",
          todo: !moved
            ? `The Index action needs a parameter named ${pageParam}, and Skip((page - 1) * pageSize).Take(pageSize).`
            : "Sort before you page: OrderBy, then Skip and Take. Without an order the database can give a "
              + "record to two pages and none to another.",
        });

      const bad = [];
      for (const n of [0, -1, 999999]) {
        const res = await send(linkTo(link, n));
        if (!res || res.status >= 500) bad.push(`?${pageParam}=${n} (${res ? res.status : "no answer"})`);
      }
      set("edges", bad.length ? "fail" : "pass", bad.length ? null : `a page number nobody should type doesn't break the page — ?${pageParam}=0 and -1 and 999999`, {
        hint: `these came back with an error: ${bad.join(", ")}. A negative page makes a negative OFFSET, which SQL Server refuses.`,
        todo: "Anyone can type a page number. Math.Clamp(page, 1, totalPages), after you've worked out totalPages.",
      });
    }

    return done(route);
  }

  // Printed above the score, because a stale checker makes the score itself suspect.
  const staleWarning = (stale) => stale && stale.length
    ? `Week ${stale.join(" and ")}'s self-check script is STILL installed in your app. It PASSES — `
      + `nothing this week breaks last week's requirements — so it prints a reassuring report about `
      + `the wrong week. The tell is the first line: it should say Week ${WEEK}. Delete the old `
      + `<script> tag; this week's line REPLACES it.`
    : null;

  const isLocal = (url) => /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url));

  const CANT_SEE = "This check can't see your confirmation message or your service. A message only shows up "
    + "after a change, and a change needs your role, which this check doesn't hold. A service doesn't show "
    + "from outside at all. Test the message yourself: sign in as your admin, change something, read the "
    + "message, reload, and watch it go.";

  const NOTHING_TOUCHED = "This check only read your pages: nothing was signed in or out, and nothing was added. "
    + "If you were signed in, you still are.";

  const NOT_GRADED = "This is an optional stretch. Nothing here is collected, and it's worth no points.";

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
      process.exit(1);
    }

    (async () => {
      console.log(`\n🔎 Week ${WEEK} self-check — ${url}`);
      console.log("   (a sleeping free-tier app can take ~30s for the first check)\n");
      const res = await runChecks(url, forced, (c) => {
        console.log(`${c.pass ? "✅" : c.blocked ? "⬜" : "❌"}  ${c.label}`);
        if (c.hint) console.log(`         ↳ ${c.hint}`);
      });
      const { green, total, route } = res;
      const oldOne = staleWarning(res.stale);
      if (oldOne) console.log(`\n🚨 ${oldOne}`);
      console.log(`\n📋 ${green} of ${total} checks green${route ? `  (controller: /${route})` : ""}`);

      const next = res.checks.find(c => !c.pass && !c.blocked && c.todo)
                || res.checks.find(c => !c.pass && c.todo);
      if (next) console.log(`\n👉 Next: ${next.todo}`);
      else if (isLocal(url)) console.log("\n✅ That was localhost. If you deploy, run it on your Azure URL too.");
      else console.log("\n🎉 Your list can be searched, it comes in pages, and it holds up to anything a visitor types.");

      console.log(`\n🔑 ${CANT_SEE}`);
      console.log(`\nℹ️  ${NOT_GRADED}\n`);
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
      console.log(`%c${mark}  ${c.label}`, color);
      if (c.hint) console.log(`      ↳ ${c.hint}`);
    };

    const report = (res) => {
      const { green, total, route } = res;
      const oldOne = staleWarning(res.stale);
      if (oldOne) console.log(`%c🚨 ${oldOne}`, `${bold}; color: crimson`);
      console.log(`%c📋 ${green} of ${total} checks green${route ? `  (controller: /${route})` : ""}`, big);

      const next = res.checks.find(c => !c.pass && !c.blocked && c.todo)
                || res.checks.find(c => !c.pass && c.todo);
      if (next) {
        console.log(`%c👉 Next: ${next.todo}`, `${bold}; color: #79c0ff`);
        console.log("Fix that, then type  recheck()  again.");
      } else if (isLocal(window.location.origin)) {
        console.log("%c✅ That was localhost. If you deploy, run it on your Azure URL too.", `${bold}; color: green`);
      } else {
        console.log("%c🎉 Your list can be searched, it comes in pages, and it holds up to anything a visitor types.", `${bold}; color: green`);
      }

      console.log(`%c🔑 ${CANT_SEE}`, "color: #d29922");
      console.log(`%c✅ ${NOTHING_TOUCHED}`, "color: #79c0ff");
      console.log(`%cℹ️  ${NOT_GRADED}`, "color: #79c0ff");
      console.log("%cType  recheck()  to run again — or  recheck(\"Trails\")  with your controller name.", "color: #79c0ff");
    };

    const run = (forcedRoute) => {
      console.log(`%c🔎 Week ${WEEK} self-check — ${window.location.origin}`, big);
      console.log("Results appear when the run finishes — a sleeping free-tier app can take ~30s.");
      if (forcedRoute) console.log(`Checking /${forcedRoute} directly (you told me where to look).`);
      return runChecks(window.location.origin, forcedRoute || null, printCheck).then(report);
    };

    // Nothing runs on load. Every run is a couple of dozen page loads, and your
    // home page shouldn't do that each time you open it.
    window.recheck = (forcedRoute) => run(forcedRoute);

    console.log(`%c🔎 Week ${WEEK} self-check is loaded — but it hasn't run.`, big);
    console.log("%cType  recheck()  to check your work. It only reads your pages: you stay signed in, and nothing is added.",
      "color: #79c0ff");
    console.log("%cWorking on a different controller than I'd guess?  recheck(\"Trails\")  with your own name.",
      "color: #79c0ff");
  }
})();
