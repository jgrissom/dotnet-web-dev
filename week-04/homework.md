# Week 4 Homework

**Due:** before the start of Week 5's class.
**Submit via Canvas:** your **Azure URL** + your **GitHub repo URL**.

## Part 1 — Finish the Cryptid Registry (nobody collects this)

All six checks green:

```bash
dotnet test Cryptids.Checks
# Passed! - Failed: 0, Passed: 6 ...
```

If class ended at check 4, that's the `NotFound()` guard and the row links — the [details section](lecture-notes.md#details-and-the-notfound-guard) of the notes has both patterns.

> [!IMPORTANT]
> This isn't submitted and it isn't worth points. It's also the guided version of exactly what Part 2 asks you to do from an empty folder. The people who skip it are the ones who spend three hours on Part 2 instead of one — that's the whole enforcement mechanism, and it's a real one.

## Part 2 — Start your semester project (graded)

Build a **new** [MVC app](../week-03/lecture-notes.md#dotnet-new-mvc) on a topic you pick — *anything except food trucks or cryptids* (those are mine). Video games, hiking trails, recipes, players on a team, national parks, your sneaker collection. Your call.

> [!NOTE]
> **This one isn't a throwaway.** You'll be extending this same app for the rest of the course: week 5 gives it a real layout and theme, week 6 adds a form with validation, **week 7 moves your hard-coded list into SQL Server**, weeks 8–9 make it full CRUD with a second related table, and the midterm builds on whatever you've got by then. Pick something you can stand to look at for ten weeks.

> [!IMPORTANT]
> **This one gets shown.** From next week, class opens with a few deployed apps on the projector, and everyone's turn comes at least once before the end of term. Pick a topic you'd be happy to have on a screen in front of the room — and finish the deploy, because a dead URL is a lot more obvious up there than in a gradebook.

> [!TIP]
> **Choosing well matters more than usual now.** Pick a topic that could plausibly grow a *second, related list* later — trails and their **reviews**, games and their **publisher**, players and their **team**, parks and their **campgrounds**. If you can't imagine a second table hanging off yours, pick something else. Week 9 will ask for exactly that, and switching topics then means rebuilding.

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work.** It's the same material from class, written out — every requirement below links to the section that covers it, and the [troubleshooting appendix](lecture-notes.md#appendix-troubleshooting) names the errors you're most likely to hit.

It needs:

1. **A model class** with at least **4 properties**, including an `int Id` and at least one non-string property (a number, a `bool`, a `DateTime`). Put it in a [`namespace`](lecture-notes.md#namespaces-and-the-using-they-require), the way the starter's `Cryptid` is — not graded, but it's what every .NET codebase does, and it's why your controller needs a `using`.
2. **A seeded list of at least 5 items** — a `static List<T>` like the starter's `CryptidData`.
3. **An Index page** listing all of them, built with [`@model`](lecture-notes.md#strongly-typed-views-with-model) and [`@foreach`](lecture-notes.md#loops-in-a-view). Your controller will need a [`CryptidsController`-style class](lecture-notes.md#conventions-three-names-that-must-agree) and a matching `Views/<Name>/` folder — three names must agree.
4. **A Details page** — `/Things/Details/3` shows that one item. [The Index → Details pair](lecture-notes.md#index-and-details-the-classic-pair) explains where the `3` comes from.
5. **A link from each row** on the Index page to that item's Details page — `href="/Things/Details/@item.Id"` [inside your loop](lecture-notes.md#loops-in-a-view). (Same as check 6 in the lab.)
6. **A 404 guard** — an id nobody has returns `NotFound()`, not a crash. [`FirstOrDefault`, then the null check](lecture-notes.md#details-and-the-notfound-guard).
7. **A nav link** to your Index page. Copy the `Privacy` `<li>` in [`Views/Shared/_Layout.cshtml`](../week-03/lecture-notes.md#project-anatomy) and adapt it — [it uses tag helpers](lecture-notes.md#one-last-note-on-the-navbar), which is fine. *(That's the only layout change you need — the shell is week 5's business.)*
8. **Deployed to Azure**, and **3+ meaningful commits** in a public GitHub repo.

> [!TIP]
> Start from `dotnet new mvc --no-https` in a fresh folder. You are not starting from the Registry — building it again from empty is the point, and it takes about 30 minutes once you've done the lab. Week 3's notes cover [creating the app](../week-03/lecture-notes.md#dotnet-new-mvc) and [what every folder is for](../week-03/lecture-notes.md#project-anatomy) if you want the refresher.

## Part 3 — Check it yourself before you submit ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with.** Nothing in it is specific to my topic or yours — it finds your controller by following the link you put in the navbar, exactly like a visitor would.

**Nothing to install — you include it exactly like the Bootstrap CDN from week 2.**

Add this one line at the bottom of **your index view** (`Views/Trails/Index.cshtml`, or whatever yours is called):

```html
<script src="https://jgrissom.github.io/dotnet-web-dev/week-04/homework-checks.js"></script>
```

Then load that page and open the console — **F12 → Console**. It runs automatically, the same way week 1's checker did.

```
🔎 Week 4 self-check — https://trail-guide-ab1234.azurewebsites.net
✅ 2 pts  nav link to your index page — found /Trails
✅ 4 pts  index lists all your items — 6 detail links found
✅ 4 pts  details page shows one item — /Trails/Details/1
✅ 2 pts  a bad id returns 404 — got 404

🎉 12 / 12 automated points
```

> [!NOTE]
> It checks **whatever site it's loaded on** — so put the tag in *your* app, not on this page. It works on `localhost` while you build and on your deployed app afterwards. Type `recheck()` in the console to run it again without refreshing, and expect a red `404` partway through: one check asks for a bad id on purpose.
>
> Leave the `<script>` tag in or take it out, whichever you prefer. It only writes to the console and doesn't affect grading.

> [!TIP]
> **Working offline?** Save [`homework-checks.js`](homework-checks.js) into your `wwwroot` folder and point the tag at it locally instead: `<script src="/homework-checks.js"></script>`. That's the CDN-versus-local-copy trade-off from [week 2](../week-02/lecture-notes.md#setup--two-tags), showing up in real life.

*(If you happen to have Node installed, `node homework-checks.js <url>` does the same thing from a terminal. You don't need it.)*

Every ❌ comes with a hint about what to fix. **12 of the 20 points are in that script** — there is no reason to lose any of them.

> [!IMPORTANT]
> Run it against your **deployed** URL, not just localhost. "It worked on my machine" is not worth points, and a broken deploy is the single most common way to lose them.

> [!NOTE]
> The other 8 points I check by hand: your model shape and seed count (4) and your commit history (4). The script reminds you of both when it finishes.

## Part 4 — Deploy it (graded)

Same as last week. Follow **[week 3's deploy-guide](../week-03/deploy-guide.md)** for the step-by-step, or [the notes on `az webapp up`](../week-03/lecture-notes.md#az-webapp-up) for what the command is actually doing. Then, from inside your web project folder:

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

Use the **same US region** that worked for you in week 3 — it's on the class list. Leave the app up until grades post.

## 🆘 Stuck?

- **404 on your index page?** Route → action → view, in that order. Class named `XxxController`? Method `public`? View folder named to match? [Three names must agree](lecture-notes.md#conventions-three-names-that-must-agree).
- **"The view 'Index' was not found"** — read the error, it lists every path it searched. Usually the folder name doesn't match the controller.
- **"The model item passed into the ViewDataDictionary is of type…"** — your controller and your `@model` line disagree. One passes a list, the other expects a single item, or vice versa.
- **500 on a details page** — almost always the [missing null guard](lecture-notes.md#details-and-the-notfound-guard). Remember [what the status code is telling you](../week-03/lecture-notes.md#verbs-and-status-codes): 404 is routing, 500 is your code.
- **`YourData` won't resolve in the controller** — you need a [`using` for your Models namespace](lecture-notes.md#namespaces-and-the-using-they-require).
- Everything else: the [troubleshooting appendix](lecture-notes.md#appendix-troubleshooting).

## 📊 Grading (20 pts)

| Item | Points | Checked by |
|------|--------|------------|
| Index page lists all your items (deployed) | 4 | `homework-checks.js` |
| Details page shows one item by id (deployed) | 4 | `homework-checks.js` |
| Bad id returns 404, not a crash (deployed) | 2 | `homework-checks.js` |
| Nav link to your Index page works | 2 | `homework-checks.js` |
| Model has 4+ properties incl. `int Id` + a non-string; 5+ seeded items | 4 | by hand |
| Public repo with 3+ meaningful commits | 4 | by hand |
| **Deductions:** dead submitted URL | −2 | |

*Design isn't graded — use the template's Bootstrap and spend your time on the routing. I may still tell you what I think of your color choices.*

*Reminder: the explain-it standard applies. Be ready to walk me through any line — especially "where does the `3` in `/Things/Details/3` come from?" and "what happens if you delete the null check?"*

## 📖 Reading for next week (~15 min)

Week 5 is the site **shell** — one layout, every page.

- Open your own `Views/Shared/_Layout.cshtml` and find `@RenderBody()`. Everything around it is on *every* page. Write down two things in that file you'd want to change site-wide.
- [Microsoft: Layout in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/layout) — skim the first two sections.
