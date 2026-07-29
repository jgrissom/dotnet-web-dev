# Week 5 — Lecture Notes

> Last week you built pages *from data*. Every one of them arrived wrapped in a shell you didn't write and never looked at. Tonight you open that file and take it over — and find out that one line changes the look of every page at once.

## Part 1: The shell you've been ignoring (35 min)

### Where we left off

Week 4 ended with `/Trucks` and `/Trucks/Details/2` — real pages, generated from a `List<Truck>`. But look at what you actually typed into `Views/Trucks/Index.cshtml`: an `<h1>`, a table, a loop. No `<html>`. No `<head>`. No navbar.

And yet the page in the browser had all of those. Somebody added them.

> [!IMPORTANT]
> Ask the room the question from last week's reading: **who put the navbar on your page?** Nobody typed it. It's in a file most of them have never opened, and after tonight it's the file they'll edit most.

### The layout file

Open `Views/Shared/_Layout.cshtml`. It is about 50 lines and it is a complete HTML document:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - Curbside</title>
    <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="~/css/site.css" asp-append-version="true" />
</head>
<body>
    <header>
        <nav class="navbar ...">
            <a class="navbar-brand" asp-controller="Home" asp-action="Index">Curbside</a>
            ...
        </nav>
    </header>
    <div class="container">
        <main role="main" class="pb-3">
            @RenderBody()
        </main>
    </div>

    <footer class="border-top footer text-muted">
        <div class="container">&copy; 2026 - Curbside - <a asp-controller="Home" asp-action="Privacy">Privacy</a></div>
    </footer>

    <script src="~/lib/jquery/dist/jquery.min.js"></script>
    <script src="~/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="~/js/site.js" asp-append-version="true"></script>
    @await RenderSectionAsync("Scripts", required: false)
</body>
</html>
```

*(That's the shape, trimmed to fit. Open the real file — it's `Views/Shared/_Layout.cshtml` in your own project and it is barely longer than this.)*

Three things to name out loud:

- **`Views/Shared/`** is the folder MVC looks in when it can't find something in the controller's own view folder. It's where things that belong to *no single page* live.
- The **underscore** prefix is a convention meaning "this is a piece, not a page." Nothing enforces it — `Layout.cshtml` would work fine — but every .NET codebase does it, and you'll see it again on `_ViewStart`, `_ViewImports`, and every partial you write tonight.
- The layout is **just Razor**. `@ViewData[...]`, `@RenderBody()`, tag helpers — all the syntax from week 4, in a file that happens to wrap other files.

### @RenderBody(): where your page lands

This is the whole trick:

```html
<main role="main" class="pb-3">
    @RenderBody()
</main>
```

`@RenderBody()` is the hole in the doughnut. When you `return View(...)`, Razor renders **your view** first, then renders the **layout**, and drops your view's HTML at exactly that spot.

> [!TIP]
> **Predict-then-run (demo §1).** Ask before you do it: *"I'm going to delete `@RenderBody()`. What happens — a blank page, or an error?"* Most rooms say blank page. Let them commit to an answer.

Delete the line, save, refresh. You get a **500**, and the exception is unusually helpful:

```
InvalidOperationException: RenderBody has not been called for the page at
'/Views/Shared/_Layout.cshtml'. To ignore call IgnoreBody().
```

That's worth a beat. ASP.NET Core doesn't just quietly drop your content — it treats a layout that never renders its body as a **bug**, and says so by name. Restore the line and verify a page loads before moving on.

- It also lands last week's diagnosis habit again: **500 means my code**, and one broken line in the layout takes down *every page at once*. That's the trade for having one shell.
- `IgnoreBody()` exists for the rare layout that deliberately throws the body away. Mention it only if asked.

### ViewData["Title"] and the browser tab

You have been writing this line since week 3 without ever asking who reads it:

```html
@{
    ViewData["Title"] = "Trucks";
}
```

Here's who. In the layout:

```html
<title>@ViewData["Title"] - Curbside</title>
```

The view runs **first** and puts a value in `ViewData`; the layout runs **second** and reads it. That ordering is the entire mechanism, and it's why a view can influence something that lives outside itself.

> [!TIP]
> **Break it to prove it (demo §1).** Delete the `ViewData["Title"]` line from `Views/Trucks/Details.cshtml`, refresh, and look at the browser tab: `- Curbside`, with a dangling dash and nothing in front of it. The layout still printed its half; the view just stopped supplying the other half. Put it back.

Two flavours worth showing side by side:

- **A fixed title** — `ViewData["Title"] = "Trucks";` at the top of the index view.
- **A data-driven title** — on the details view, the title *is* the record:

  ```html
  @{
      ViewData["Title"] = Model.Name;
  }
  ```

  Now the browser tab reads **Cheese Curd Cartel - Curbside**. Point at the tab. This is a small thing that makes an app feel finished, and it's a homework requirement.

### Branding the shell

Two edits, one file, whole site:

- the `<title>` suffix — `- Curbside` becomes whatever your app is called
- the `navbar-brand` text — same

Make both live and click through three pages. **Nothing else changed, and every page is different.** That's the sentence the whole night is built on; say it while it's on screen.

## Part 2: The two files nobody opens (20 min)

### _ViewStart: why every view gets a layout

Nothing in `Views/Trucks/Index.cshtml` mentions the layout. So why does it get one?

`Views/_ViewStart.cshtml` — the whole file:

```html
@{
    Layout = "_Layout";
}
```

That's it. It runs **before every view in its folder and every folder below**, so it sets `Layout` for the entire app from one place. Convention over configuration again — the same idea as week 4's controller/folder/view naming, applied to the shell.

> [!TIP]
> **Opt one page out (demo §2).** Add `Layout = null;` to `Views/Home/Privacy.cshtml`:
>
> ```html
> @{
>     ViewData["Title"] = "Privacy Policy";
>     Layout = null;
> }
> <h1>@ViewData["Title"]</h1>
> ```
>
> Refresh `/Home/Privacy`: your `<h1>` and `<p>`, on a white page, with no navbar, no footer, no Bootstrap — **not even an `<html>` tag**. View Source and count how little arrives. A view produces a fragment; the layout is what makes it a document. Take the line back out.

- Real uses: a print stylesheet page, a partial fetched by JavaScript, an embedded widget. Rare, but knowing the switch exists demystifies the whole arrangement.
- `_ViewStart` can hold any code that should run before every view, but 99% of the time it holds exactly this one line.

### _ViewImports: why tag helpers just work

`Views/_ViewImports.cshtml` — the whole file:

```html
@using Curbside
@using Curbside.Models
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
```

- The `@using` lines are why `@model List<Truck>` works without a `using` in the view. Week 4's namespace lesson, with the answer to "so where do views get *their* imports?"
- **`@addTagHelper` is the one that matters tonight.** It's why `asp-controller` in the navbar is a real thing rather than an unknown attribute the browser ignores — and it's why `<partial name="..." />`, which you're about to write, works at all. Tag helpers are opt-in, and this line opts every view in.
- Like `_ViewStart`, it applies to its folder and everything below.

> [!NOTE]
> If someone deletes or renames `_ViewImports.cshtml`, tag helpers silently stop being tag helpers — `<partial />` renders as literal unknown markup and `asp-controller` produces a dead link, with no error anywhere. It's a good thing to have seen once; it's a miserable thing to debug cold.

## Part 3: Partials (45 min) — the load-bearing segment

### The repetition problem

You now have a details page that shows one truck: name, cuisine, city, rating, an open-late badge. Suppose you want that same little block on the index page too, as a card — and later on a "trucks near you" panel.

The obvious move is copy-paste. The obvious move is wrong for the obvious reason: three copies, three places to fix, and they drift.

**A partial view is a `.cshtml` file that renders a fragment instead of a page.** Same Razor, same `@model`, no layout of its own.

### Making a partial

Start with the easy one — the footer, which is already in the layout and belongs to no page.

**1. Create the file.** `Views/Shared/_Footer.cshtml` — this is the whole file:

```html
<footer class="border-top footer text-muted">
    <div class="container">
        &copy; 2026 - Curbside - Wisconsin's finest, on four wheels -
        <a asp-area="" asp-controller="Home" asp-action="Privacy">Privacy</a>
    </div>
</footer>
```

**2. Render it.** In `Views/Shared/_Layout.cshtml`, delete the whole `<footer>...</footer>` block you just copied and put this in its place:

```html
<partial name="_Footer" />
```

**3. Refresh.** Identical page. That's the point — the *output* didn't change, the *structure* did.

Things to say while it's up:

- `name="_Footer"` is a **file name**, not a path. MVC looks in the current controller's view folder first, then `Views/Shared/`. Same lookup rule as views.
- The `.cshtml` extension is not included and the underscore *is*.
- **`<partial />` is a tag helper** — which is why Part 2's `_ViewImports` line mattered. The older spelling `@await Html.PartialAsync("_Footer")` does the same job; you'll meet it in older code and in a lot of Stack Overflow answers. Use `<partial />`.

### Passing a model to a partial

The footer is the same on every page. The interesting case is a partial that renders *different data each time*.

**1. The partial.** `Views/Shared/_TruckCard.cshtml` — the whole file:

```html
@model Truck

<div class="card h-100">
    <div class="card-body">
        <h5 class="card-title">@Model.Name</h5>
        <h6 class="card-subtitle mb-2 text-muted">@Model.Cuisine · @Model.City</h6>
        <p class="card-text">Rating: @Model.Rating / 5</p>
        @if (Model.IsOpenLate)
        {
            <span class="badge bg-success">🌙 Open late</span>
        }
    </div>
    <div class="card-footer">
        <a href="/Trucks/Details/@Model.Id">Details</a>
    </div>
</div>
```

It has an `@model` line exactly like a page does — a partial is strongly typed too. Note it says `@model Truck`, **one truck**, not a list. The partial's job is one card.

**2. Use it in the loop.** Replace the `<table>` in `Views/Trucks/Index.cshtml` — this is the whole file afterwards:

```html
@model List<Truck>
@{
    ViewData["Title"] = "Trucks";
}

<h1>Curbside</h1>
<p class="text-muted">@Model.Count trucks on the street.</p>

<div class="row row-cols-1 row-cols-md-3 g-4">
    @foreach (var truck in Model)
    {
        <div class="col">
            <partial name="_TruckCard" model="truck" />
        </div>
    }
</div>
```

- **`model="truck"`** is the handoff — the loop variable goes in, and the partial's `@Model` is that one truck.
- The page's model is `List<Truck>`; the partial's model is `Truck`. **They don't have to match**, and this is the thing that confuses people. The partial gets whatever you hand it.
- This is week 2's Bootstrap, finally applied to real data: `row-cols-md-3` is a three-across card grid, and the six cards came from six objects.

**3. Use it again somewhere else.** At the bottom of `Views/Trucks/Details.cshtml`, *below* the existing markup:

```html
@{
    var alsoHere = TruckData.All.Where(t => t.City == Model.City && t.Id != Model.Id).ToList();
}

@if (alsoHere.Count > 0)
{
    <h2 class="h5 mt-4">Also in @Model.City</h2>
    <div class="row row-cols-1 row-cols-md-3 g-4">
        @foreach (var other in alsoHere)
        {
            <div class="col">
                <partial name="_TruckCard" model="other" />
            </div>
        }
    </div>
}
```

> [!IMPORTANT]
> **This is the moment the segment exists for.** Two pages, two completely different contexts, **one card file**. Now go into `_TruckCard.cshtml`, change something obvious — make the title `text-primary`, add an emoji — save, and refresh **both** pages. One edit, both places. Let the room sit with it for a second.

- `TruckData` is reachable in the view because `_ViewImports.cshtml` has `@using Curbside.Models` (Part 2 — it pays off within the hour).
- Doing a `Where` in a view is fine for a demo and something we'll move into the controller once ViewModels arrive in week 9. Say that, don't dwell.
- `/Trucks/Details/5` (Pierogi Party, the only truck in Stevens Point) shows no panel at all — the `@if` guard. Worth clicking, because "what if there are none" is a question they should learn to ask.

> [!NOTE]
> **Partial vs. layout, in one line:** a layout wraps *around* a page; a partial drops *inside* one. Same mechanism, opposite direction.

## Part 4: Sections and the Scripts slot (20 min)

### The slot that was always there

Last line inside the layout's `<body>`, and you've been scrolling past it for three weeks:

```html
@await RenderSectionAsync("Scripts", required: false)
```

That's a **named hole** a page can choose to fill. `@RenderBody()` is the one required, unnamed hole; a section is an optional, named one.

Why it exists: scripts go at the bottom of the body, but the *page* is what knows which script it needs. Sections let a view contribute markup to a spot outside itself.

**Add one.** At the bottom of `Views/Trucks/Details.cshtml`:

```html
@section Scripts {
    <script>
        console.log("Truck file loaded: @Model.Name");
    </script>
}
```

Refresh `/Trucks/Details/2` and **View Source**. The `console.log` is not where you typed it — it's at the very bottom, *after* the footer and *after* jQuery, exactly where the layout put the slot.

- **The section can see the model.** `@Model.Name` interpolates into the script, because a section is still Razor and still runs in the view's context.
- Load `/Trucks` (which has no section) and View Source: nothing extra. Optional means optional.

### What required: false actually does

Change it in the layout, on purpose:

```html
@await RenderSectionAsync("Scripts", required: true)
```

Now visit `/Trucks` — the index, which has no `@section Scripts` — and you get a **500**:

```
InvalidOperationException: The layout page '/Views/Shared/_Layout.cshtml' cannot find
the section 'Scripts' in the content page '/Views/Trucks/Index.cshtml'.
```

Meanwhile `/Trucks/Details/2` still works fine, because *that* page has the section. Two pages, same layout, one broken — that's `required` in one demonstration. Put `false` back.

> [!TIP]
> 🔗 **Say the week-6 line here, while it's on screen.** Look in `Views/Shared/` and find `_ValidationScriptsPartial.cshtml` — a partial, sitting unused. Next week you build a form, and client-side validation arrives as exactly this: a partial, rendered inside a `@section Scripts` block. Tonight's two ideas, combined, doing a real job.

## Part 5: Bootswatch — one link, whole site (25 min)

### The payoff

[Bootswatch](https://bootswatch.com) is a set of free drop-in themes for Bootstrap. Not a different framework, not different classes — **the same Bootstrap, recompiled with different variables**. Everything from week 2 still applies.

In `Views/Shared/_Layout.cshtml`, replace the Bootstrap stylesheet line:

```html
<link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.min.css" />
```

with a theme:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/united/bootstrap.min.css" />
```

Save. Hard-refresh. **The entire site is a different site.**

> [!WARNING]
> **Hard-refresh every time you change themes** — ⌘⇧R / Ctrl+Shift+R. Browsers cache stylesheets aggressively, and a cached sheet looks exactly like "Bootswatch didn't work." This wastes five minutes of a class if you let it.

Cycle two or three themes live — `united`, `darkly`, `flatly`, `vapor` — hard-refreshing each time. Swap the last path segment and nothing else.

Points to land:

- **`5.3.3` is pinned deliberately.** It's the same Bootstrap version the template put in `wwwroot/lib`, so the local JavaScript bundle and the themed CSS agree. Version numbers in CDN URLs are not decoration.
- **It replaces, not adds.** If you leave the original `<link>` in, both stylesheets load and fight, and the theme only half applies. This is the single most common way to get a confusing result, and the lab checks for it.
- **Only the CSS changed.** The `<script>` for `bootstrap.bundle.min.js` stays local and untouched — dropdowns and the mobile navbar keep working.
- **Callback to week 2:** you put a CDN link in one HTML file and styled one page. Tonight the same link styles a *site*, because now you know which file every page comes from.

### The navbar needs a word

On a dark theme the stock navbar looks wrong, because the template hard-coded it light:

```html
<nav class="navbar ... navbar-light bg-white border-bottom box-shadow mb-3">
```

Swap the color utilities — this is inside the `<nav>` you already have:

```html
<nav class="navbar ... navbar-dark bg-primary mb-3">
```

and drop the `text-dark` class from each `nav-link`.

That's the reassuring half of the lesson: **your Bootstrap knowledge is intact.** The theme changed the variables; the utility classes are the same ones from week 2, and you still steer them.

## Wrap-up (10 min)

The shell, end to end:

```
_ViewStart  →  _Layout.cshtml  →  @RenderBody()  →  your view
                     ↑                                   ↓
                <partial />                      @section Scripts
```

- **Tonight:** one file wraps every page; two files you'd never opened explain why; partials kill copy-paste; sections let a page reach outside itself; and a single `<link>` re-skins the lot.
- **Homework:** your semester project gets the same treatment — brand, per-page titles, a footer partial, a theme.
- **Next week:** the shell holds a **form**. `@section Scripts` is how validation gets there, and `_ValidationScriptsPartial.cshtml` stops being a mystery.

## Appendix: Troubleshooting

**Every page is a 500 all of a sudden**
- You edited the layout. One bad line there breaks the whole site at once — that's the cost of one shell. The terminal running `dotnet watch` has the real exception.

**`InvalidOperationException: RenderBody has not been called`**
- `@RenderBody()` is missing from `_Layout.cshtml`. Put it back inside `<main>`.

**`InvalidOperationException: The layout page '...' cannot find the section 'Scripts'`**
- The layout says `required: true` but a page doesn't define that section. Make it `required: false`, which is how the template ships.

**`InvalidOperationException: The layout view '_Layout' could not be found`**
- `_ViewStart.cshtml` names a layout that isn't there. Check the spelling and that the file is `Views/Shared/_Layout.cshtml`. Searched paths are listed in the error.

**`InvalidOperationException: The partial view '_Footer' was not found`**
- Same lookup rules as views: the controller's own folder, then `Views/Shared/`. Check the file name (underscore included, `.cshtml` excluded from the `name`), and that it's in `Views/Shared/`.

**The partial renders but the data is wrong / `@Model` is null in a partial**
- You didn't pass one: `<partial name="_TruckCard" />` with no `model="..."` hands the partial **the parent page's model**, which is usually the wrong type. Add `model="truck"`.

**`The model item passed into the ViewDataDictionary is of type List<Truck>, but requires Truck`**
- Same cause as above, one step further along — a partial declaring `@model Truck` got the page's list. Pass the single item.

**The theme didn't change**
- Hard-refresh: ⌘⇧R / Ctrl+Shift+R. If it still looks stock, View Source and check the `<link>` — is the old `bootstrap.min.css` line still there too?

**The theme applied but the navbar looks broken**
- The template hard-codes `navbar-light bg-white`. Swap to `navbar-dark bg-primary` (and drop `text-dark` from the links) for a dark theme.

**`<partial />` renders as literal text, or `asp-controller` links go nowhere**
- `Views/_ViewImports.cshtml` is missing, renamed, or lost its `@addTagHelper` line. Without it, tag helpers are just unknown attributes and there is no error to tell you.

**A page has no styling at all, but other pages are fine**
- A stray `Layout = null;` left behind in that view's `@{ }` block.

**Changes don't show up**
- `dotnet watch` handles `.cshtml` edits, but a brand-new file occasionally needs a restart. Stop it (`Ctrl+C`) and start it again before debugging something that isn't broken.
