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

> [!TIP]
> Two terminals: in one, `cd FirstFlight.Web` then `dotnet watch` (see your changes live); in the other, stay at the parent folder and re-run `dotnet test FirstFlight.Checks` after each task. Browser for feel, checks for truth.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 2 | `SiteIsBranded` | Make it yours: the navbar brand in `Views/Shared/_Layout.cshtml` and the home page heading should say **First Flight** (not the project name). |
| 3 | `AboutPageExists` | Add an `About` [action](../lecture-notes.md#controllers-and-actions) to `HomeController` and a matching [view](../lecture-notes.md#views-and-razor) — `Views/Home/About.cshtml` with an "About" heading and a sentence about you. |
| 4 | `AboutIsInTheNav` | Add About to the navbar in `_Layout.cshtml` — copy the Privacy `<li>` and adapt it. |
| 5 | `HelloGreetsByName` | A `Hello` action that [reads a query parameter](../lecture-notes.md#passing-data-viewdata-and-parameters): `/Home/Hello?name=Ada` returns `Hello, Ada!` (a `Content(...)` result — no view needed). |
| 6 | `HelloHasADefault` | No name given → `Hello, stranger!` — a nullable parameter and `??` do it in one line. |

## Rules

> [!IMPORTANT]
> - **Never edit `FirstFlight.Checks`** — it's the grading contract. All work happens in `FirstFlight.Web`.
> - Don't remove the `public partial class Program { }` line at the bottom of `Program.cs` — the checks need it to see your app.

## 🆘 Stuck?

Route → action → view, in that order — the [troubleshooting appendix](../lecture-notes.md#appendix-troubleshooting) walks the diagnosis. The [routing section](../lecture-notes.md#routing-controlleraction) explains *why* `/Home/About` finds `HomeController.About()`. The terminal running `dotnet watch` prints the real error when a page 500s.

## 🚀 Done early?

- Add a `PlanesController` with an `Index` — how little does it take to make `/Planes` work?
- Make `Hello` greet in uppercase when `/Home/Hello?name=ada&shout=true`. (Two parameters bind as easily as one.)
- Change the route pattern's defaults in `Program.cs` — what happens to `/` if the default action is `Privacy`? Change it back.
