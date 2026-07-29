# Week 5 Lab — The Registry Gets a Shell 👻

Same six creatures, same pages. Tonight you build the **shell** around them: one layout you own, a footer that lives in its own file, a script that only loads where it's needed, and a theme that changes everything at once.

**Time:** ~35 minutes in class — **in-class target: checks 1–4 green.** Checks 5–6 roll into the homework by design.

## Setup

> [!IMPORTANT]
> **The app arrives finished.** The starter is a complete, working Cryptid Registry — controller, Index, Details, 404 guard, all six creatures. If you never finished last week's lab, you are **not** behind tonight. Check 1 passes before you touch anything, and it proves it.
>
> Almost every edit tonight happens in **`Views/`**. You will not open a controller.

**1. Update your clone of the course repo:**

```bash
cd dotnet-web-dev && git pull
```

**2. Copy the `week-05/lab/starter` folder out to wherever you keep your projects, and rename the copy** — `CryptidShell` works. (Copy it *out*; never work inside the clone, or next week's `git pull` will fight you.)

You should end up with exactly this:

```
CryptidShell/               ← the folder you copied and renamed
├─ Cryptids.Web/           ← your app — ALL your work happens in here
└─ Cryptids.Checks/        ← the checks — read-only, never edit
```

**3. Open `CryptidShell` in VS Code** — the folder that *contains* both project folders, not one of the projects themselves.

**4. In the VS Code terminal, from that same folder:**

```bash
dotnet test Cryptids.Checks
```

**1 / 6 passing.** Check 1 is the app you were given, already working. The other five are the shell.

> [!WARNING]
> Seeing `error MSB1009: Project file does not exist`? You're one folder too deep — probably inside `Cryptids.Web`. Run `cd ..` and try again; the command goes in the folder that holds *both* projects.

> [!TIP]
> Two terminals: in one, `cd Cryptids.Web` then `dotnet watch`; in the other, stay at the parent folder and re-run `dotnet test Cryptids.Checks` after each task. **Keep three browser tabs open** — `/`, `/Cryptids`, and `/Cryptids/Details/1`. Every task tonight is supposed to change all three at once, and the fastest way to know it worked is to watch them all change.

## The one file you'll live in

`Cryptids.Web/Views/Shared/_Layout.cshtml` — every page you have is wrapped in it. Open it and read it top to bottom **before** you start; it's about 50 lines and five of them matter tonight:

| Line you'll find | What it does |
|---|---|
| `<title>@ViewData["Title"] - Cryptids.Web</title>` | the browser tab — half from the view, half from here |
| `<link ... bootstrap.min.css />` | the stylesheet for the whole site |
| `<a class="navbar-brand" ...>Cryptids.Web</a>` | the name in the top-left corner |
| `@RenderBody()` | **where your page's HTML lands** |
| `@await RenderSectionAsync("Scripts", required: false)` | an optional slot a page can fill |

The [notes on the layout file](../lecture-notes.md#the-layout-file) walk the same file in more detail.

> [!WARNING]
> **One broken line in this file breaks every page at once.** That's the deal with a shared shell. If everything 500s, the layout is where you look — and the terminal running `dotnet watch` has the real exception.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 2 | `ShellIsBranded` | The app is called **`Cryptid Registry`**, not `Cryptids.Web`. Change **two things** in `_Layout.cshtml`: the `navbar-brand` text, and the suffix in the `<title>` line. Both must read `Cryptid Registry`. Then look at all three tabs — [one file, every page](../lecture-notes.md#branding-the-shell). |
| 3 | `EveryPageHasItsOwnTitle` | Give `Views/Cryptids/Index.cshtml` and `Views/Cryptids/Details.cshtml` their own `ViewData["Title"]`. Index's is your call. **Details' must be the creature's name** — `ViewData["Title"] = Model.Name;` — so `/Cryptids/Details/1` shows *The Hodag* in the tab. [How the view and the layout split the title](../lecture-notes.md#viewdatatitle-and-the-browser-tab). |
| 4 | `FooterIsAPartial` | Create `Views/Shared/_Footer.cshtml`, move the whole `<footer>` block out of `_Layout.cshtml` into it, and render it from the layout with `<partial name="_Footer" />`. The footer text must include exactly **`Field Reports Since 1893`**. [Making a partial](../lecture-notes.md#making-a-partial). |
| 5 | `DetailsAddsAScript` | Add a `@section Scripts { ... }` block to `Details.cshtml` containing a `<script>` that logs **`Cryptid file loaded`**. It must appear on the details page and **not** on the index. [Sections and the Scripts slot](../lecture-notes.md#the-slot-that-was-always-there). |
| 6 | `ThemeIsNotTheDefault` | Replace the Bootstrap `<link>` in `_Layout.cshtml` with a [Bootswatch](https://bootswatch.com) theme. **Delete the original line** — it's a replacement, not an addition. [One link, whole site](../lecture-notes.md#the-payoff). |

> [!IMPORTANT]
> **The exact text matters** for checks 2, 4 and 5 — `Cryptid Registry`, `Field Reports Since 1893`, `Cryptid file loaded`. Everything around it is your call; those strings are how an automated check recognises work it can't see.

> [!TIP]
> **Check 4 looks for the file on disk**, not just the text on the page. Pasting `Field Reports Since 1893` into the layout will not pass it — `Views/Shared/_Footer.cshtml` has to exist and the layout has to render it. That's the whole point of the task.

> [!TIP]
> **Check 5 looks at *where* your script lands**, not just that it's there. A `<script>` typed into the middle of `Details.cshtml` renders in the middle of the page; the same script inside `@section Scripts` renders at the bottom, below the footer, because [the layout decides where a section goes](../lecture-notes.md#the-slot-that-was-always-there).

> [!TIP]
> **For check 6, copy the whole `<link>` tag from [bootswatch.com](https://bootswatch.com)** (the CDN dropdown on each theme), or use this one and swap the theme name:
>
> ```html
> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/darkly/bootstrap.min.css" />
> ```
>
> `darkly`, `flatly`, `united`, `vapor`, `superhero`, `morph` — pick one you like. **Hard-refresh after every swap** (⌘⇧R / Ctrl+Shift+R) or you'll be looking at a cached stylesheet and think it failed.

## Rules

> [!IMPORTANT]
> - **Never edit `Cryptids.Checks`** — it's the grading contract. All work happens in `Cryptids.Web`.
> - Don't remove the `public partial class Program { }` line at the bottom of `Program.cs` — the checks need it to see your app.
> - You shouldn't need to touch `Controllers/` at all tonight.

## 🆘 Stuck?

- **Every page is suddenly a 500** — you edited the layout. Read the exception in the `dotnet watch` terminal. If it says `RenderBody has not been called`, you deleted [`@RenderBody()`](../lecture-notes.md#renderbody-where-your-page-lands); put it back inside `<main>`.
- **`The partial view '_Footer' was not found`** — it looks in this controller's view folder, then `Views/Shared/`. Check the file is in `Views/Shared/`, that the name in `<partial name="_Footer" />` has the underscore, and that it does **not** have `.cshtml` on it.
- **The theme didn't change** — hard-refresh (⌘⇧R / Ctrl+Shift+R). Still stock? View Source and look for the old `bootstrap.min.css` line still sitting there.
- **The navbar looks wrong on a dark theme** — the template hard-coded `navbar-light bg-white`. [Swap the color utilities](../lecture-notes.md#the-navbar-needs-a-word); your week-2 Bootstrap still works exactly as it did.
- **Check 3 passes for Index but not Details** — the details title has to come from the data: `ViewData["Title"] = Model.Name;`, not a fixed string.
- The [troubleshooting appendix](../lecture-notes.md#appendix-troubleshooting) covers the rest.

## 🚀 Done early?

- **Highlight the current page in the navbar.** We deliberately skipped this one — it needs the route data, which the view can reach via `ViewContext.RouteData.Values["controller"]`. Compare it to `"Cryptids"` and add Bootstrap's `active` class when they match.
- **Make a `_CryptidCard.cshtml` partial** with `@model Cryptid` and use it in *two* places — a card grid on the index instead of the table, and a "more from @Model.Region" panel at the bottom of the details page. [Passing a model to a partial](../lecture-notes.md#passing-a-model-to-a-partial).
- **A Google Font.** Week 2's trick, now applied site-wide from one file.
- **`Layout = null;`** on a copy of the details view, to see what a page is without its shell.
