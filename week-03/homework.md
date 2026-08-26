# Week 3 Homework

**Due:** before the start of Week 4's class.
**Submit via Canvas:** your **Azure URL** + your **GitHub repo URL** for the lab solution.

## Part 1 — Finish First Flight (nobody collects this)

> [!IMPORTANT]
> **Start the git history before you start the work.** Three meaningful commits are graded, and they only exist if you make them as you go — a single "done" commit at 11:58pm costs a point, and by then the only fix is dishonest. In the VS Code terminal (`` Ctrl+` ``), from inside your `first-flight` folder:
>
> ```bash
> git init
> git add .
> git commit -m "First Flight starter"
> ```
>
> Then commit at each natural stopping point below. Part 2 pushes whatever history you built.

All six checks green:

```bash
dotnet test FirstFlight.Checks
```

```
Test Run Successful.
Total tests: 6
     Passed: 6
```

If class ended at check 4, that means finishing `Hello` (checks 5–6) — the [parameters section](lecture-notes.md#passing-data-viewdata-and-parameters) of the notes has the pattern.

> [!IMPORTANT]
> **The test suite is your guide, not your grade.** I never run `dotnet test` on your repo — the points come from the *deployed* site in Part 4, and that's the rule for the rest of the course. Check 1 is free — it just proves the harness runs. The other five are each the local twin of a check I *do* run against your URL. Get to 6/6 first and the graded checks are a formality; skip it and you'll be debugging a live Azure app instead of a local one, which is a much worse place to debug.

### Install the self-check now, while you're still local

The script that decides 16 of your 20 points **has to be part of the app you deploy** — it checks
whatever site it is loaded on, so it can only grade your Azure URL if it shipped with it.

**Nothing to install** — include it like the Bootstrap CDN from week 2. Add this at the bottom of
`Views/Home/Index.cshtml`:

```html
<script src="https://jgrissom.github.io/dotnet-web-dev/week-03/homework-checks.js"></script>
```

Then start the app the same way the lab did — `dotnet watch --project FirstFlight.Web`, from the `first-flight` folder — open your site, press **F12 → Console**, and read it. It will tell you it's
localhost — that's expected and correct at this stage. **Fixing things here is much cheaper than
fixing them on Azure**, which is the whole reason it goes in now rather than after the deploy.

> [!TIP]
> **Working offline?** Save [`homework-checks.js`](homework-checks.js) into your `wwwroot` folder and point the tag at it locally instead: `<script src="/homework-checks.js"></script>`. That's the CDN-versus-local-copy trade-off from [week 2](../week-02/lecture-notes.md#setup--two-tags), showing up in real life.

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work** — it's the same material from class, written out. The sections you'll want tonight: [controllers and actions](lecture-notes.md#controllers-and-actions), [views and Razor](lecture-notes.md#views-and-razor), [reading a query parameter](lecture-notes.md#passing-data-viewdata-and-parameters), and [`az webapp up`](lecture-notes.md#az-webapp-up) when you get to the deploy.

## Part 2 — Put it on GitHub (graded)

1. **Check the history first:** `git log --oneline` should already show 3+ commits — one per check you turn green is the natural rhythm, and the `.gitignore` in the starter already keeps build output out. Commit anything still outstanding now.
2. Create a **public** repo named `first-flight` and push your `first-flight` folder — the one in `dotnet-web` holding `FirstFlight.Web` and `FirstFlight.Checks` — to it.

## Part 3 — Deploy it (graded)

Follow **[deploy-guide.md](deploy-guide.md)** — install `az`, log in, and pick your US region (guide steps 1–3, done in class), then deploy from inside `FirstFlight.Web`:

```bash
az webapp up --name ff-web-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

Leave the app up until grades post.

## Part 4 — Check your deployed site before you submit ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with — 16 of the 20 points are in that script.** Each one is the deployed twin of a check in `FirstFlight.Checks`: `dotnet test` asks "does my code work?", this asks "does the site I actually shipped work?" They are different questions, and only the second one is worth points.

**You added the tag in Part 1, so it's already on the deployed site.** Open your **Azure URL**, press **F12 → Console**, and read the results:

```
🔎 Week 3 self-check — https://ff-web-ab1234.azurewebsites.net
✅  3 pts  home page is branded First Flight
✅  4 pts  /Home/About loads
✅  2 pts  About is in the navbar
✅  4 pts  /Home/Hello?name=Ada greets by name
✅  3 pts  /Home/Hello defaults to stranger

📋 5 of 5 checks green · 16 of 16 points
```

Every ❌ comes with a hint and a `👉 Next:` line naming the one thing to fix. Type `recheck()` in the console to run it again without refreshing. **You ran this locally in Part 1; this run is the one that counts**, because the deployed site is what I grade — and the script says so itself if you point it at localhost. Leave the `<script>` tag in or take it out afterwards: it only writes to the console, and my grading doesn't depend on it being there.

> [!IMPORTANT]
> If a check fails on your deployed site but passes locally, you almost certainly deployed the wrong folder — `az webapp up` ships the folder you're standing in, so run it from **inside `FirstFlight.Web`**. The deploy-guide's 🆘 section covers the rest.

## 🆘 Stuck?

- **404 on `/Home/About`?** Route → action → view, in that order — [how the URL finds your method](lecture-notes.md#routing-controlleraction). Is the method `public`? Does `Views/Home/About.cshtml` exist, spelled exactly that way?
- **It says `The view 'About' was not found` and the file is sitting right there** — it is, and you're not going mad. A brand-new `.cshtml` is the one change `dotnet watch` can't apply to a running app, so it stops and asks `Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)` — answer **`a`** and it won't ask again. Missed the prompt? **Press `Ctrl+R` in the terminal running `dotnet watch`.** Nothing is wrong with your code.
- **`Hello` returns nothing useful** — the query string binds *by name*, so `?name=Ada` needs a parameter called `name`. [The parameters section](lecture-notes.md#passing-data-viewdata-and-parameters).
- **A page 500s** — the terminal running `dotnet watch` prints the real error; the browser doesn't.
- **The deploy fails or the live site 404s** — the [deploy guide's 🆘 section](deploy-guide.md) covers the common ones, and remember `az webapp up` ships the folder you're standing in.
- Everything else: the [troubleshooting appendix](lecture-notes.md#appendix-troubleshooting).

## 📊 Grading (20 pts)

| Item | Points | Checked by |
|------|--------|------------|
| Home page branded "First Flight" (deployed) | 3 | `homework-checks.js` |
| `/Home/About` loads (deployed) | 4 | `homework-checks.js` |
| About link in the navbar (deployed) | 2 | `homework-checks.js` |
| `/Home/Hello?name=Ada` greets by name (deployed) | 4 | `homework-checks.js` |
| `/Home/Hello` defaults to stranger (deployed) | 3 | `homework-checks.js` |
| Public repo with 3+ meaningful commits | 4 | by hand |
| **Deductions:** dead submitted URL | −2 | |

*`dotnet test` is not on this table on purpose — see Part 1. It's how you get here, not what I grade.*

*Reminder: the explain-it standard applies — be ready to walk me through any line, especially "why does `/Home/About` find your method?"*

## 📖 Reading for next week (~20 min)

Week 4 goes deep on routing and Razor — pages built from data.

- [Microsoft: Views in ASP.NET Core MVC](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/overview) — read the first half.
- Skim your own `FirstFlight.Web/Views/Shared/_Layout.cshtml` top to bottom and write down two things you recognize from week 2 and one thing you can't explain yet. Bring the list.
