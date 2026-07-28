# Week 3 Homework

**Due:** before the start of Week 4's class.
**Submit via Canvas:** your **Azure URL** + your **GitHub repo URL** for the lab solution.

## Part 1 — Finish First Flight (graded)

All six checks green:

```bash
dotnet test FirstFlight.Checks
# Passed! - Failed: 0, Passed: 6 ...
```

If class ended at check 4, that means finishing `Hello` (checks 5–6) — the [parameters section](lecture-notes.md#passing-data-viewdata-and-parameters) of the notes has the pattern.

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work** — it's the same material from class, written out. The sections you'll want tonight: [controllers and actions](lecture-notes.md#controllers-and-actions), [views and Razor](lecture-notes.md#views-and-razor), [reading a query parameter](lecture-notes.md#passing-data-viewdata-and-parameters), and [`az webapp up`](lecture-notes.md#az-webapp-up) when you get to the deploy.

## Part 2 — Put it on GitHub (graded)

1. Create a **public** repo named `first-flight` and push your solution folder to it.
2. **Commit as you go — at least 3 meaningful commits** (a natural rhythm: one per check you turn green; the `.gitignore` in the starter already keeps build output out).

## Part 3 — Deploy it (graded)

Follow **[deploy-guide.md](deploy-guide.md)** — install `az`, log in, and pick your US region (guide steps 1–3, done in class), then deploy from inside `FirstFlight.Web`:

```bash
az webapp up --name ff-web-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

Leave the app up until grades post.

## Part 4 — Check your deployed site before you submit ✅

`dotnet test` proves your **code** works. It says nothing about whether your **deployed site** works — and that's worth **6 of the 20 points**. [`homework-checks.js`](homework-checks.js) checks exactly what I check.

**Nothing to install** — include it like the Bootstrap CDN from week 2. Add this at the bottom of `Views/Home/Index.cshtml`:

```html
<script src="https://jgrissom.github.io/dotnet-web-dev/week-03/homework-checks.js"></script>
```

Then open your **Azure URL**, press **F12 → Console**, and read the results:

```
🔎 Week 3 deployed check — https://ff-web-ab1234.azurewebsites.net
✅ 2 pts  home page is branded First Flight
✅ 2 pts  /Home/About loads
✅ 1 pts  /Home/Hello?name=Ada greets by name
✅ 1 pts  /Home/Hello defaults to stranger

📋 4 of 4 checks green · 6 of 6 deployed points
```

Every ❌ tells you the next thing to fix. It works on `localhost` too, but **run it on your Azure URL before submitting** — it'll remind you if you don't. Leave the `<script>` tag in or take it out; it only writes to the console.

> [!IMPORTANT]
> If a check fails on your deployed site but passes locally, you almost certainly deployed the wrong folder — `az webapp up` ships the folder you're standing in, so run it from **inside `FirstFlight.Web`**. The deploy-guide's 🆘 section covers the rest.

## 🆘 Stuck?

- **404 on `/Home/About`?** Route → action → view, in that order — [how the URL finds your method](lecture-notes.md#routing-controlleraction). Is the method `public`? Does `Views/Home/About.cshtml` exist, spelled exactly that way?
- **`Hello` returns nothing useful** — the query string binds *by name*, so `?name=Ada` needs a parameter called `name`. [The parameters section](lecture-notes.md#passing-data-viewdata-and-parameters).
- **A page 500s** — the terminal running `dotnet watch` prints the real error; the browser doesn't.
- **The deploy fails or the live site 404s** — the [deploy guide's 🆘 section](deploy-guide.md) covers the common ones, and remember `az webapp up` ships the folder you're standing in.
- Everything else: the [troubleshooting appendix](lecture-notes.md#appendix-troubleshooting).

## 📊 Grading (20 pts)

| Item | Points |
|------|--------|
| `dotnet test` 6 / 6 in your repo (I run it) | 10 |
| Deployed: home page branded | 2 |
| Deployed: `/Home/About` works | 2 |
| Deployed: `/Home/Hello?name=…` + default both work | 2 |
| Public repo with 3+ meaningful commits | 4 |
| **Deductions:** checks project edited, or dead submitted URL | −2 each |

*Reminder: the explain-it standard applies — be ready to walk me through any line, especially "why does `/Home/About` find your method?"*

## 📖 Reading for next week (~20 min)

Week 4 goes deep on routing and Razor — pages built from data.

- [Microsoft: Views in ASP.NET Core MVC](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/overview) — read the first half.
- Skim your own `FirstFlight.Web/Views/Shared/_Layout.cshtml` top to bottom and write down two things you recognize from week 2 and one thing you can't explain yet. Bring the list.
