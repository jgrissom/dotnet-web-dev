# Week 3 Lab — First Flight ✈️

Your first ASP.NET Core MVC app, built the way you'll work all term: run the checks, turn red into green.

**Time:** ~35 minutes in class — **in-class target: checks 1–4 green.** Checks 5–6 (and deploying it) roll into the homework by design.

## Setup

1. **Update the starters clone.** Open `dotnet-web` in VS Code, then `` Ctrl+` `` for a terminal standing in it:
   ```bash
   git -C dotnet-web-starters pull
   ```
   `-C` tells git to work *in that folder* without moving your terminal into it — you stay in `dotnet-web`, which is where every other command belongs.
2. **Copy the whole `week-03` folder into `dotnet-web`, then rename the copy `first-flight`** — next to the clone, never inside it. It's just two project folders side by side: your app (`FirstFlight.Web`) and the read-only checks (`FirstFlight.Checks`). The new name is the one you push to in the homework.
3. **This week you do open the copy** — `File → Open Folder` → your `first-flight` folder. It is the first .NET week, and both the C# extension and `dotnet test` want to be standing in the project. From its terminal:
   ```bash
   dotnet test FirstFlight.Checks
   ```

**1 / 6 passing.** Check 1 is free — it proves the harness works. The other five are the lab.

4. **Open a second terminal** — the `+` in the terminal panel, or `` Ctrl+Shift+` ``. **You need two from here on, and so does every .NET week after this one:**
   **Both stay in `first-flight`, the folder holding both projects.** Neither command needs you to move around — you name the project instead.

   **Terminal 1 — the app.** It keeps running and rebuilds on every save, which is why **you can't type anything else in it** — that's the whole reason for a second terminal, not a preference.

   ```bash
   dotnet watch --project FirstFlight.Web
   ```

   **Terminal 2 — the checks.** Re-run this after each task.

   ```bash
   dotnet test FirstFlight.Checks
   ```

   ⚠️ **`MSBUILD : error MSB1009: Project file does not exist.`** means that terminal wandered into `FirstFlight.Web`. `cd ..` and try again — both commands belong in the folder above it.

**Browser for feel, checks for truth.**

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 2 | `SiteIsBranded` | Make it yours: the navbar brand in `Views/Shared/_Layout.cshtml` and the home page heading should say **First Flight** (not the project name). |
| 3 | `AboutPageExists` | Add an `About` [action](../lecture-notes.md#controllers-and-actions) to `HomeController` and a matching [view](../lecture-notes.md#views-and-razor) — `Views/Home/About.cshtml` with an "About" heading and a sentence about you. ⚠️ **Creating a new `.cshtml` is the one edit `dotnet watch` can't apply live** — answer **`a`** to its restart prompt, or press **`Ctrl+R`** in terminal 1. Until you do, the page keeps saying the view wasn't found even though it's there. |
| 4 | `AboutIsInTheNav` | Add About to the navbar in `_Layout.cshtml` — copy the Privacy `<li>` and adapt it. |
| 5 | `HelloGreetsByName` | A `Hello` action that [reads a query parameter](../lecture-notes.md#passing-data-viewdata-and-parameters): `/Home/Hello?name=Ada` returns `Hello, Ada!` (a `Content(...)` result — no view needed). |
| 6 | `HelloHasADefault` | No name given → `Hello, stranger!` — a nullable parameter and `??` do it in one line. |

> [!IMPORTANT]
> **Task 3 creates your first `.cshtml` file, and `dotnet watch` will stop and ask you a question about it.** Hot reload can push most edits into a running app, but a brand-new view isn't one of them — so terminal 1 pauses and prints:
>
> ```
> Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)
> ```
>
> **Press `a`.** It restarts, and it won't ask again for the rest of the lab. Until you answer, `/Home/About` keeps failing with the *same* error you were trying to fix, while the file on screen is perfectly correct — and nothing in the browser tells you a terminal is waiting. This is the single most confusing thing that happens tonight, and it happens again in every .NET week from here.


## Rules

> [!IMPORTANT]
> - **Never edit `FirstFlight.Checks`** — it's the grading contract. All work happens in `FirstFlight.Web`.
> - Don't remove the `public partial class Program { }` line at the bottom of `Program.cs` — the checks need it to see your app.

## 🆘 Stuck?

Route → action → view, in that order — the [troubleshooting appendix](../lecture-notes.md#appendix-troubleshooting) walks the diagnosis. The [routing section](../lecture-notes.md#routing-controlleraction) explains *why* `/Home/About` finds `HomeController.About()`. The terminal running `dotnet watch` prints the real error when a page 500s.

- **An exception that couldn't be about your code** — `BadImageFormatException`, `TypeLoadException`, or a 500 where even the error page fails to render. Those come from the framework reflecting over types **hot reload rewrote in memory**, not from anything you typed. Press **`Ctrl+R`** in the terminal running `dotnet watch`; a fresh process reads the types from disk and it goes away.
- **Your edit isn't showing up, or the app stops responding** — `dotnet watch` keeps serving the **last version that built**, so a page can look completely fine while your newest edit hasn't compiled. Once in a while the app needs restarting outright. Terminal 1 is where the evidence is — a red ❌, an exception, or sometimes nothing at all — so glance at it whenever something doesn't add up, and press **Ctrl+R** there to force a full rebuild.

## 🚀 Done early?

- Add a `PlanesController` with an `Index` — how little does it take to make `/Planes` work?
- Make `Hello` greet in uppercase when `/Home/Hello?name=ada&shout=true`. (Two parameters bind as easily as one.)
- Change the route pattern's defaults in `Program.cs` — what happens to `/` if the default action is `Privacy`? Change it back.
