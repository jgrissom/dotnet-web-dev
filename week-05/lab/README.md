# Week 5 Lab — The Registry Gets a Shell 👻

Same six creatures, same pages. Tonight you build the **shell** around them: one layout you own, a footer that lives in its own file, a script that only loads where it's needed, and a theme that changes everything at once.

**Time:** ~45 minutes in class — **in-class target: checks 1–4 green.** Checks 5–6 roll into the homework by design.

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
| 2 | `ShellIsBranded` | The app is called **`Cryptid Registry`**, not `Cryptids.Web`. Change **three things** in `_Layout.cshtml`: the `navbar-brand` text, the suffix in the `<title>` line, and the footer — which must include exactly **`Field Reports Since 1893`**. Then look at all three tabs: three edits, one file, nine changed pages' worth of effect — [that's the whole idea](../lecture-notes.md#branding-the-shell). |
| 3 | `EveryPageHasItsOwnTitle` | Give `Views/Cryptids/Index.cshtml` and `Views/Cryptids/Details.cshtml` their own `ViewData["Title"]`. Index's is your call. **Details' must be the creature's name** — `ViewData["Title"] = Model.Name;` — so `/Cryptids/Details/1` shows *The Hodag* in the tab. [How the view and the layout split the title](../lecture-notes.md#viewdatatitle-and-the-browser-tab). |
| 4 | `CardIsAPartialUsedTwice` | Create `Views/Shared/_CryptidCard.cshtml` (markup below), then render it in **two different views** — a card grid on `/Cryptids`, and one featured creature on the home page. [Passing a model to a partial](../lecture-notes.md#passing-a-model-to-a-partial). |
| 5 | `DetailsAddsAScript` | Add a `@section Scripts { ... }` block to `Details.cshtml` containing a `<script>` that logs **`Cryptid file loaded`**. It must appear on the details page and **not** on the index. [Sections and the Scripts slot](../lecture-notes.md#the-slot-that-was-always-there). |
| 6 | `ThemeIsNotTheDefault` | Replace the Bootstrap `<link>` in `_Layout.cshtml` with a [Bootswatch](https://bootswatch.com) theme. **Delete the original line** — it's a replacement, not an addition. [One link, whole site](../lecture-notes.md#the-payoff). |

> [!IMPORTANT]
> **The exact text matters** for checks 2 and 5 — `Cryptid Registry`, `Field Reports Since 1893`, `Cryptid file loaded`. Everything around it is your call; those strings are how an automated check recognises work it can't see.

### Task 4 in full

**Create `Views/Shared/_CryptidCard.cshtml`** — this is the whole file. Paste it; tonight's lesson is the partial, not the Bootstrap:

```html
@model Cryptid

<div class="card cryptid-card h-100">
    <div class="card-body">
        <h5 class="card-title">@Model.Name</h5>
        <h6 class="card-subtitle mb-2 text-muted">@Model.Region</h6>
        <p class="card-text">First sighted @Model.FirstSighting · @Model.Sightings reports</p>
        @if (Model.IsDebunked)
        {
            <span class="badge bg-danger">🚫 Debunked</span>
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

**That's one call site — now the second.** Feature a single creature on the home page.

> [!NOTE]
> **Not the same second spot as the demo, on purpose.** Curbside put its card in an "Also in this city" panel on the details page — which works because two food trucks share Madison. **No two cryptids share a region**, so that panel would be empty on every details page here. The home page is the Registry's second call site instead. The partial doesn't care: that's what makes it a partial.
 This is the whole of `Views/Home/Index.cshtml` afterwards, and the two 👈 marks are the only things you add:

```html
@{
    ViewData["Title"] = "Home";
    var featured = CryptidData.All.First(c => !c.IsDebunked);   👈 add this line
}

<div class="text-center">
    <h1 class="display-4">Welcome</h1>
    <p>Learn about <a href="https://learn.microsoft.com/aspnet/core">building Web apps with ASP.NET Core</a>.</p>
</div>

<h2 class="h5 mt-4">Featured sighting</h2>                       👈 and this block
<div class="row row-cols-1 row-cols-md-3 g-4">
    <div class="col">
        <partial name="_CryptidCard" model="featured" />
    </div>
</div>
```

*(The 👈 marks aren't code — don't paste them. And you can delete the template's "Welcome" block if you'd rather; nothing checks it.)*

> [!TIP]
> **`CryptidData` works in a view without any controller change** — `Views/_ViewImports.cshtml` already has `@using Cryptids.Web.Models`. You shouldn't touch `Controllers/` tonight.

> [!IMPORTANT]
> **Check 4 wants the partial in *two* views, not one.** A file rendered from a single place isn't reuse — it's the same markup with an extra step. The check looks for the card on `/Cryptids` **and** on `/`, because that's the only way to prove the thing partials are actually for.
>
> Once both are rendering, **edit `_CryptidCard.cshtml` once** — change a badge, add an emoji — and refresh both pages. That's the payoff.

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
