# Week 4 Homework

**Due:** before the start of Week 5's class.
**Submit via Canvas:** your **Azure URL** + your **GitHub repo URL**.

## Part 1 — Finish the Cryptid Registry (not submitted, but do it first)

All six checks green:

```bash
dotnet test Cryptids.Checks
# Passed! - Failed: 0, Passed: 6 ...
```

If class ended at check 4, that's the `NotFound()` guard and the row links — the [details section](lecture-notes.md#details-and-the-notfound-guard) of the notes has both patterns. **This is practice for Part 2, which is what gets graded.**

## Part 2 — Your own catalog (graded)

Build a **new** MVC app on a topic you pick — *anything except food trucks or cryptids* (those are mine). Video games, hiking trails, recipes, players on a team, national parks, your sneaker collection. Your call.

It needs:

1. **A model class** with at least **4 properties**, including an `int Id` and at least one non-string property (a number, a `bool`, a `DateTime`).
2. **A seeded list of at least 5 items** — a `static List<T>` like the starter's `CryptidData`.
3. **An Index page** listing all of them, built with `@model` and `@foreach`.
4. **A Details page** — `/Things/Details/3` shows that one item.
5. **A 404 guard** — an id nobody has returns `NotFound()`, not a crash.
6. **A nav link** to your Index page. Copy the `Privacy` `<li>` in `Views/Shared/_Layout.cshtml` and adapt it. *(That's the only layout change you need — the shell is week 5's business.)*
7. **Deployed to Azure**, and **3+ meaningful commits** in a public GitHub repo.

> [!TIP]
> Start from `dotnet new mvc --no-https` in a fresh folder. You are not starting from the Registry — building it again from empty is the point, and it takes about 30 minutes once you've done the lab.

## Part 3 — Check it yourself before you submit ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with.** Nothing in it is specific to my topic or yours — it finds your controller by following the link you put in the navbar, exactly like a visitor would.

While you're building, with `dotnet watch` running:

```bash
node homework-checks.js http://localhost:5199     # use YOUR port
```

And again on the deployed app, right before you submit:

```bash
node homework-checks.js https://your-app-XX1234.azurewebsites.net
```

```
✅  2 pts  nav link to your index page — found /Trails
✅  4 pts  index lists all your items — 6 detail links found
✅  4 pts  details page shows one item — /Trails/Details/1
✅  2 pts  a bad id returns 404 — got 404

🎉 12 / 12 automated points
```

Every ❌ comes with a hint about what to fix. **12 of the 20 points are in that script** — there is no reason to lose any of them.

> [!IMPORTANT]
> Run it against your **deployed** URL, not just localhost. "It worked on my machine" is not worth points, and a broken deploy is the single most common way to lose them.

> [!NOTE]
> The other 8 points I check by hand: your model shape and seed count (4) and your commit history (4). The script reminds you of both when it finishes.

## Part 4 — Deploy it (graded)

Same as last week. Follow **[week 3's deploy-guide](../week-03/deploy-guide.md)** if you need the refresher, then from inside your web project folder:

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

Use the **same US region** that worked for you in week 3 — it's on the class list. Leave the app up until grades post.

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
