# Week 5 Lab — The Registry Gets a Shell 👻

Same six creatures, same pages. Tonight you build the **shell** around them: one layout you own, one card file that renders on two different pages, a script that only loads where it's needed, and a theme that changes everything at once.

**Time:** ~45 minutes in class — **in-class target: checks 1–4 green.** Checks 5–6 roll into the homework by design.

## Setup

> [!IMPORTANT]
> **The app arrives finished.** The starter is a complete, working Cryptid Registry — controller, Index, Details, 404 guard, all six creatures. If you never finished last week's lab, you are **not** behind tonight. Check 1 passes before you touch anything, and it proves it.
>
> Almost every edit tonight happens in **`Views/`**. You will not open a controller.

**1. Update the starters clone.** Open `dotnet-web` in VS Code, then `` Ctrl+` `` for a terminal standing in it:

```bash
git -C dotnet-web-starters pull
```

`-C` tells git to work *in that folder* without moving your terminal into it — you stay in `dotnet-web`, which is where every other command belongs.

**2. Copy the `week-05` folder out of `dotnet-web-starters` and into `dotnet-web`** — next to the clone, never inside it — **and rename the copy.** `CryptidShell` works. (Never work inside the clone, or next week's `git pull` will fight you.)

You should end up with exactly this:

```
CryptidShell/               ← in `dotnet-web`, the folder you copied and renamed
├─ Cryptids.Web/           ← your app — ALL your work happens in here
├─ Cryptids.Checks/        ← the checks — read-only, never edit
└─ README.md, .gitignore   ← came with the starter; ignore both
```

**3. Open `CryptidShell` in VS Code** — the folder that *contains* both project folders, not one of the projects themselves.

**4. Open two terminals.** `` Ctrl+` `` gives you the first; the `+` in the terminal panel (or `` Ctrl+Shift+` ``) gives you the second. **You need two:** `dotnet watch` keeps running and rebuilds on every save, which is why you can't type in it.

| Terminal | Where it stands | What runs in it |
|---|---|---|
| 1 | inside `Cryptids.Web` — `cd Cryptids.Web` | `dotnet watch` — **start it now**, then leave it alone |
| 2 | `CryptidShell`, the folder holding **both** projects | `dotnet test Cryptids.Checks`, after every task |

**5. In terminal 2:**

```bash
dotnet test Cryptids.Checks
```

**1 / 6 passing.** Check 1 is the app you were given, already working. The other five are the shell.

> [!WARNING]
> Seeing `error MSB1009: Project file does not exist`? You're one folder too deep — probably inside `Cryptids.Web`. Run `cd ..` and try again; the command goes in the folder that holds *both* projects.

> [!TIP]
> **Keep three browser tabs open** — `/`, `/Cryptids`, and `/Cryptids/Details/1`. Every task tonight is supposed to change all three at once, and the fastest way to know it worked is to watch them all change.

## The one file you'll live in

`Cryptids.Web/Views/Shared/_Layout.cshtml` — every page you have is wrapped in it. Open it and read it top to bottom **before** you start; it's about 50 lines and six of them matter tonight:

| Line you'll find | What it does |
|---|---|
| `<title>@ViewData["Title"] - Cryptids.Web</title>` | the browser tab — half from the view, half from here |
| `<link ... bootstrap.min.css />` | the stylesheet for the whole site |
| `<a class="navbar-brand" ...>Cryptids.Web</a>` | the name in the top-left corner |
| `@RenderBody()` | **where your page's HTML lands** |
| `&copy; 2026 - Cryptids.Web - ...` | the footer — task 2 adds a phrase to it |
| `@await RenderSectionAsync("Scripts", required: false)` | an optional placeholder a page can fill |

The [notes on the layout file](../lecture-notes.md#the-layout-file) walk the same file in more detail.

> [!WARNING]
> **One broken line in this file breaks every page at once.** That's the deal with a shared shell, and it fails two different ways. If every page **500s**, the terminal running `dotnet watch` has the real exception. If the pages instead look **unchanged** — your edits stop appearing — the file didn't compile, and `dotnet watch` says nothing at all while it keeps serving the last build that worked. Either way `_Layout.cshtml` is where you look, and a pristine copy of it is still sitting in `dotnet-web-starters/week-05/` if you need to start that one file over.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 2 | `ShellIsBranded` | The app is called **`Cryptid Registry`**, not `Cryptids.Web`. Change **three things** in `_Layout.cshtml`: the `navbar-brand` text, the suffix in the `<title>` line, and the footer — add **`Field Reports Since 1893`** to its text, word for word. *(Add, not replace — keep the © and the Privacy link if you like; only that phrase is checked.)* Then look at all three tabs: three edits, one file, nine changed pages' worth of effect — [that's the whole idea](../lecture-notes.md#branding-the-shell). |
| 3 | `EveryPageHasItsOwnTitle` | Give `Views/Cryptids/Index.cshtml` and `Views/Cryptids/Details.cshtml` their own `ViewData["Title"]`. Index's is your call. **Details' must be the creature's name** — `ViewData["Title"] = Model.Name;` — so `/Cryptids/Details/1` shows *The Hodag* in the tab. [How the view and the layout split the title](../lecture-notes.md#viewdatatitle-and-the-browser-tab). |
| 4 | `CardIsAPartialUsedTwice` | Create `Views/Shared/_CryptidCard.cshtml`, then render it in **two different views** — a card grid on `/Cryptids`, and one featured creature on the home page. [Passing a model to a partial](../lecture-notes.md#passing-a-model-to-a-partial). **[Task 4 in full ↓](#task-4-in-full)** has every line to paste. |
| 5 | `DetailsAddsAScript` | Add a `@section Scripts { ... }` block to `Details.cshtml` that logs **`Cryptid file loaded`** plus the creature's name to the console. It must appear on the details page and **not** on the index. [Sections and the Scripts placeholder](../lecture-notes.md#the-placeholder-that-was-always-there). **[Task 5 in full ↓](#task-5-in-full)** has the exact block. |
| 6 | `ThemeIsNotTheDefault` | Replace the Bootstrap `<link>` in `_Layout.cshtml` with a [Bootswatch](https://bootswatch.com) theme. **Delete the original line** — it's a replacement, not an addition. [One link, whole site](../lecture-notes.md#the-payoff). **[Task 6 in full ↓](#task-6-in-full)** has the tag to paste. |

> [!IMPORTANT]
> **The exact text matters** for checks 2 and 5 — `Cryptid Registry`, `Field Reports Since 1893`, `Cryptid file loaded`. Everything around it is your call; those strings are how an automated check recognizes work it can't see.

### Task 4 in full

**Check:** `Check4_CardIsAPartialUsedTwice`

**Create `Views/Shared/_CryptidCard.cshtml`** — this is the whole file. Paste it; tonight's lesson is the partial, not the Bootstrap:

> [!NOTE]
> **It's a new `.cshtml`, so `dotnet watch` stops and asks to restart** — `Yes (y) / No (n) / Always (a) / Never (v)` in terminal 1. Answer `a`. Until you do, both pages keep failing on a file that looks fine.

```html
@model Cryptid

<div class="card cryptid-card h-100">
    <div class="card-body">
        <h5 class="card-title">@Model.Name</h5>
        <h6 class="card-subtitle mb-2 text-muted">@Model.Region</h6>
        <p class="card-text">First sighted @Model.FirstSighting · @Model.Sightings reports</p>
        @if (Model.IsDebunked)
        {
            <span class="badge bg-danger">💀 Debunked</span>
        }
        else
        {
            <span class="badge bg-success">👀 Unconfirmed</span>
        }
    </div>
    <div class="card-footer">
        <a href="/Cryptids/Details/@Model.Id">Details</a>
    </div>
</div>
```

**Use it twice.** In `Views/Cryptids/Index.cshtml`, replace the whole `<table>` with a card grid:

```html
<div class="row row-cols-1 row-cols-md-3 g-4">
    @foreach (var cryptid in Model)
    {
        <div class="col">
            <partial name="_CryptidCard" model="cryptid" />
        </div>
    }
</div>
```

**That's one call site — now the second.** Feature a single creature on the home page — and while you're in there, evict the template's "Welcome" text; this page is the Registry's now. This is the whole of `Views/Home/Index.cshtml` afterwards — safe to paste as-is, the 👈 marks are comments pointing at the two pieces check 4 cares about:

```html
@{
    ViewData["Title"] = "Home";
    var featured = CryptidData.All.First(c => !c.IsDebunked);   // 👈 the featured creature
}

<div class="text-center">
    <h1 class="display-4">Cryptid Registry</h1>
    <p>Six creatures. Varying amounts of evidence.</p>
</div>

@* 👈 the second call site *@
<h2 class="h5 mt-4">Featured sighting</h2>
<div class="row row-cols-1 row-cols-md-3 g-4">
    <div class="col">
        <partial name="_CryptidCard" model="featured" />
    </div>
</div>
```

*(The heading and tagline are yours to reword — no check reads them. Notice the two comment styles doing week 4's trick: `//` works inside the C# block, and the `@* *@` Razor comment never reaches the browser — View Source and it's simply not there.)*

> [!TIP]
> **`CryptidData` works in a view without any controller change** — `Views/_ViewImports.cshtml` already has `@using Cryptids.Web.Models`. You shouldn't touch `Controllers/` tonight.

> [!IMPORTANT]
> **Check 4 wants the partial in *two* views, not one.** A file rendered from a single place isn't reuse — it's the same markup with an extra step. The check looks for the card on `/Cryptids` **and** on `/`, because that's the only way to prove the thing partials are actually for.
>
> Once both are rendering, **edit `_CryptidCard.cshtml` once** — change a badge, add an emoji — and refresh both pages. That's the payoff.

### Task 5 in full

**Check:** `Check5_DetailsAddsAScript`

Open `Views/Cryptids/Details.cshtml` and add this at the bottom:

```html
@section Scripts {
    <script>console.log("Cryptid file loaded: @Model.Name");</script>
}
```

Then open the console (F12) on a details page — the creature's name is in the log. Only the words **`Cryptid file loaded`** are checked; the `@Model.Name` is there to prove a section is still Razor and can read the model.

> [!TIP]
> **Check 5 looks at *where* your script lands**, not just that it's there. A `<script>` typed into the middle of `Details.cshtml` renders in the middle of the page; the same script inside `@section Scripts` renders at the bottom, below the footer, because [the layout decides where a section goes](../lecture-notes.md#the-placeholder-that-was-always-there).

### Task 6 in full

**Check:** `Check6_ThemeIsNotTheDefault`

Pick your theme on [bootswatch.com](https://bootswatch.com) — the **Preview** link on each card shows a full sample page — **but get the `<link>` tag right here**, because the site itself never shows you one (its Download button hands you a CSS *file*; we're loading from the CDN, week-2 style):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/darkly/bootstrap.min.css" />
```

**Swap `darkly` for the theme you picked** — the theme name is the only part that changes, spelled in lowercase exactly as the site shows it. **Hard-refresh after every swap** (⌘⇧R / Ctrl+Shift+R) or you'll be looking at a cached stylesheet and think it failed.

*(One exception: **Brite** is newer than the `5.3.3` build — if you picked it and the page comes back unstyled, change the version in the URL to `5.3.8`.)*

> [!NOTE]
> **Picked a dark theme** (darkly, vapor, superhero, cyborg, slate, solar)? The template hard-coded a *light* navbar — `navbar-light bg-white` — and it'll sit like a white sticker on your dark pages. [Swap the color utilities](../lecture-notes.md#the-navbar-needs-a-word): `navbar-dark bg-primary`, and drop `text-dark` from the nav links. Light themes look fine untouched, and no check reads these classes either way — this one's for your eyes, not your score.

## Rules

> [!IMPORTANT]
> - **Never edit `Cryptids.Checks`** — it's the grading contract. All work happens in `Cryptids.Web`.
> - Don't remove the `public partial class Program { }` line at the bottom of `Program.cs` — the checks need it to see your app.
> - You shouldn't need to touch `Controllers/` at all tonight.

## 🆘 Stuck?

- **Every page is suddenly a 500** — you edited the layout. Read the exception in the `dotnet watch` terminal. If it says `RenderBody has not been called`, you deleted [`@RenderBody()`](../lecture-notes.md#renderbody-where-your-page-lands); put it back inside `<main>`. **If you fixed it and the 500 won't go away** — you reload and nothing changes, and the terminal is a pile of errors — press **Ctrl+R** in terminal 1 to force a full rebuild. Hot reload can't always patch a running app back to health after a bad edit, and `dotnet watch` sometimes says so itself.
- **Your edit isn't showing up** — the page looks fine, but your change isn't on it. A Razor syntax error means the app keeps serving the **last build that worked**, and `dotnet watch` prints nothing at all. Run `dotnet test Cryptids.Checks` in terminal 2 — it names the file, line and column, like `_Layout.cshtml(6,21): error RZ1027`. (Or press **Ctrl+R** in terminal 1 to force a rebuild and read the error there — it's the one key that terminal takes.)
- **`The partial view '_CryptidCard' was not found`** — it looks in this controller's view folder, then `Views/Shared/`. Check the file is in `Views/Shared/`, that the name in `<partial name="_CryptidCard" />` has the underscore, and that it does **not** have `.cshtml` on it.
- **`The model item passed into the ViewDataDictionary is of type List<Cryptid>, but requires Cryptid`** — you rendered the card without handing it one creature. Inside the loop it needs `model="cryptid"`; without it the partial inherits the *page's* model, which is the whole list.
- **The theme didn't change** — hard-refresh (⌘⇧R / Ctrl+Shift+R). Still stock? View Source and look for the old `bootstrap.min.css` line still sitting there.
- **The navbar looks wrong on a dark theme** — the template hard-coded `navbar-light bg-white`. [Swap the color utilities](../lecture-notes.md#the-navbar-needs-a-word); your week-2 Bootstrap still works exactly as it did.
- **Check 3 passes for Index but not Details** — the details title has to come from the data: `ViewData["Title"] = Model.Name;`, not a fixed string.
- The [troubleshooting appendix](../lecture-notes.md#appendix-troubleshooting) covers the rest.

## 🚀 Done early?

- **Highlight the current page in the navbar.** We deliberately skipped this one — it needs the route data, which the view can reach via `ViewContext.RouteData.Values["controller"]`. Compare it to `"Cryptids"` and add Bootstrap's `active` class when they match.
- **Use the card a third time** — put it at the top of the details page as a summary, or feature a *random* creature on the home page instead of the first (`.OrderBy(c => Guid.NewGuid()).First()`). Every extra call site costs one line, which is the argument for partials in one sentence.
- **A Google Font.** Week 2's trick, now applied site-wide from one file.
- **`Layout = null;`** on a copy of the details view, to see what a page is without its shell.
