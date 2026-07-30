---
marp: true
theme: gaia
class: invert
paginate: true
style: |
  section pre {
    background: #151b23;
    border-radius: 8px;
  }
  section pre code {
    background: transparent;
    color: #e6edf3;
  }
  section pre .hljs-keyword { color: #ff7b72; }
  section pre .hljs-string { color: #a5d6ff; }
  section pre .hljs-title, section pre .hljs-title.function_ { color: #d2a8ff; }
  section pre .hljs-comment { color: #9198a1; font-style: italic; }
  section pre .hljs-attr, section pre .hljs-attribute { color: #79c0ff; }
  section pre .hljs-number, section pre .hljs-literal { color: #79c0ff; }
  section pre .hljs-built_in { color: #ffa657; }
  section pre .hljs-name { color: #7ee787; }
  section pre .hljs-selector-class, section pre .hljs-selector-pseudo { color: #7ee787; }
  section footer { color: #9fb2c1; font-size: 0.6em; opacity: 0.85; }
---

<!-- _paginate: false -->

# Week 5 — Layouts & Partials

.NET Web Development · Week 5 of 16

---

<!-- _footer: '🖥️ Demo §1 · the gap' -->

## Last week vs. tonight

**Week 4:** you built pages *from data*.

**Tonight:** you build everything *around* them.

- One file that wraps every page
- Two files you've never opened
- Partials — write it once, use it anywhere
- One `<link>`, and the whole site changes

---

<!-- _footer: '🖥️ Demo §1 · the gap' -->

## A question

`Views/Home/Index.cshtml` — **all the markup there is**:

```html
<div class="text-center">
    <h1 class="display-4">Welcome</h1>
    <p>Learn about <a href="...">ASP.NET Core</a>.</p>
</div>
```

No `<html>`. No `<head>`. **No navbar.**

### View Source on `/`. Who wrote the other 54 lines?

---

<!-- _footer: '🖥️ Demo §1 · the layout file' -->

## `Views/Shared/_Layout.cshtml`

```html
<head>
    <title>@ViewData["Title"] - Curbside</title>
    <link rel="stylesheet" href="~/lib/bootstrap/.../bootstrap.min.css" />
</head>
<body>
    <nav class="navbar">...</nav>

    <main>@RenderBody()</main>

    <footer>...</footer>

    @await RenderSectionAsync("Scripts", required: false)
</body>
```

---

<!-- _footer: '🖥️ Demo §1 · break #1' -->

## `@RenderBody()`

```html
<main role="main" class="pb-3">
    @RenderBody()
</main>
```

Your view renders **first**. The layout renders **second**, and drops your HTML right there.

<br>

### I'm about to delete that line. Blank page — or error?

---

<!-- _footer: '🖥️ Demo §1 · the title' -->

## The title has two halves

**The view** puts a value in:

```html
@{
    ViewData["Title"] = Model.Name;
}
```

**The layout** reads it out:

```html
<title>@ViewData["Title"] - Curbside</title>
```

View runs first, layout runs second. That's the whole mechanism.

---

<!-- _footer: '🖥️ Demo §2' -->

## `Views/_ViewStart.cshtml`

The entire file:

```html
@{
    Layout = "_Layout";
}
```

Runs before **every view** in its folder and below.

Nothing in your Index view asks for a layout. This is why it gets one.

---

<!-- _footer: '🖥️ Demo §2 · _ViewImports' -->

## `Views/_ViewImports.cshtml`

```html
@using Curbside
@using Curbside.Models
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
```

- `@using` — why `@model List<Truck>` needs no import
- `@addTagHelper` — why `asp-controller` is real

<br>

...and why `<partial />` will work in ten minutes.

---

<!-- _footer: '🖥️ Demo §3 · the problem' -->

## The problem partials solve

You want the same truck block:

- on the details page
- as a card on the index
- in a "nearby trucks" panel

<br>

Copy-paste gives you **three places to fix**, and they *will* drift.

---

<!-- _footer: '🖥️ Demo §3 · the card' -->

## Making one — three steps

**1.** Create `Views/Shared/_TruckCard.cshtml`

**2.** `@model Truck` on the first line

**3.** Render it, handing it one:

```html
<partial name="_TruckCard" model="truck" />
```

<br>

A **file name**, not a path · underscore in, `.cshtml` out

---

<!-- _footer: '🖥️ Demo §3 · the card' -->

## Give it a model

```html
@model Truck

<div class="card h-100">
    <h5 class="card-title">@Model.Name</h5>
</div>
```

Render it with the loop variable:

```html
@foreach (var truck in Model)
{
    <partial name="_TruckCard" model="truck" />
}
```

---

<!-- _footer: '🖥️ Demo §3 · the card' -->

## The page and the partial disagree

**Page:** `@model List<Truck>`

**Partial:** `@model Truck`

<br>

They don't have to match.

The partial gets **whatever you hand it**.

---

<!-- _footer: '🖥️ Demo §3 · one file, two pages' -->

## One file. Two pages.

`_TruckCard.cshtml` renders:

- six times on `/Trucks`
- again on `/Trucks/Details/1`

<br>

### Edit the card once — watch both pages change.

---

<!-- _footer: '🖥️ Demo §4' -->

## The slot that was always there

Last line in the layout's `<body>`:

```html
@await RenderSectionAsync("Scripts", required: false)
```

A page can fill it:

```html
@section Scripts {
    <script>console.log("@Model.Name");</script>
}
```

`@RenderBody()`: **required, unnamed**. A section: **optional, named**.

---

<!-- _footer: '🖥️ Demo §4 · break #4' -->

## `required: false`

```html
@await RenderSectionAsync("Scripts", required: true)
```

`/Trucks/Details/2` has the section.
`/Trucks` does not.

<br>

### What happens to each one?

---

<!-- _footer: '🖥️ Demo §5' -->

## Bootswatch

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/united/bootstrap.min.css" />
```

Delete the old Bootstrap `<link>`. Hard-refresh.

<br>

**The same Bootstrap** — recompiled with different variables.
Every class you know still works.

---

<!-- _footer: '🖥️ Demo §5 · three things' -->

## Three things about that line

- **`5.3.3` is pinned** to match the Bootstrap in `wwwroot/lib`
- **It replaces** — leave both and they fight
- **Only the CSS moved** — the local JS bundle is untouched

<br>

⚠️ Hard-refresh every swap, or you're looking at a cache.

---

<!-- _footer: '🖥️ Demo §5 · the navbar' -->

## Your Bootstrap still works

The template hard-coded a light navbar:

```html
<nav class="navbar ... navbar-light bg-white">
```

On a dark theme, steer it yourself:

```html
<nav class="navbar ... navbar-dark bg-primary">
```

Week 2's utility classes. Same as they ever were.

---

<!-- _footer: '🖥️ Demo §6' -->

## Lab: the Registry gets a shell

**The app arrives finished.** Tonight is all `Views/`.

- **2** — brand it: navbar + title + footer
- **3** — a title per page, data-driven on Details
- **4** — one card partial, rendered on **two** pages
- **5** — a script, in a section
- **6** — a Bootswatch theme

**Target tonight: 1–4 green.**

---

<!-- _footer: '🖥️ Demo §7' -->

## Tonight, in one picture

```
_ViewStart → _Layout.cshtml → @RenderBody() → your view
                   ↑                              ↓
              <partial />                 @section Scripts
```

- **Homework:** your project gets the same treatment
- **Next week:** the shell holds a **form** — and `_ValidationScriptsPartial.cshtml` stops being a mystery
