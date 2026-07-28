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

# Week 4 — Routing & Razor

.NET Web Development · Week 4 of 16

---

## Last week vs. tonight

**Week 3:** one URL found one method.

**Tonight:** an app is a *set* of URLs over a *set* of data.

- Routing you can read **and edit**
- A second controller, built from conventions
- Razor with loops and conditionals
- Data flowing from C# into a page — typed

---

## The pattern, decoded

```csharp
pattern: "{controller=Home}/{action=Index}/{id?}"
```

| Slot | Means | If omitted |
|------|-------|------------|
| `{controller=Home}` | which class | `HomeController` |
| `{action=Index}` | which method | `Index()` |
| `{id?}` | optional extra | left empty |

The `=` parts are **defaults** — they're why `/` works.

---

## Predict before you press Enter

| URL | Controller? | Action? |
|-----|-------------|---------|
| `/` | ? | ? |
| `/Home/Privacy` | ? | ? |
| `/Privacy` | ? | ? |
| `/Home/Privacy/7` | ? | ? |
| `/Courses` | ? | ? |

Two of these do something you won't expect.

---

<!-- _footer: '🎨 demo time — script §1: edit the pattern, break it, restore it' -->

## The URL is not a file path

There is no folder named `Courses`.

- The URL is an **instruction**: *run this method*
- The pattern is the **translation table**
- Change the pattern → change what every URL means

Routing is configuration, not magic. So let's edit it.

---

## Three names must agree

```
Controllers/TrucksController.cs     ← class TrucksController
                ▲
                │  "Trucks" must match
                ▼
Views/Trucks/Index.cshtml           ← folder = controller
                                      file   = action
```

`return View()` = *"find the view named after the action I'm in."*

**Convention over configuration.**

---

<!-- _footer: '🎨 demo time — script §2: build it in two steps, misname a folder on purpose' -->

## Prove one half at a time

```csharp
public class TrucksController : Controller
{
    public IActionResult Index()
    {
        return Content("trucks!");   // routing works?
    }
}
```

Content first → routing proven. *Then* swap in `View()`.

Two failure points, isolated. Make this a habit.

---

## Razor: `@` is the door

```html
<p>The time is @DateTime.Now</p>
<p>Two plus two is @(2 + 2)</p>
```

- `@expression` — a variable, property, or call
- `@( ... )` — when there are spaces or operators
- Same instinct as `` `${x}` `` in JavaScript

Different in one huge way: **this runs on the server.**

---

## Blocks and branches

```html
@{
    var count = 6;
}

@if (truck.IsOpenLate)
{
    <span class="badge bg-success">🌙 Open late</span>
}
else
{
    <span class="badge bg-secondary">Closes at 8</span>
}
```

No `@` on `else` — you're already in C#.

---

## The big idea

```html
@foreach (var truck in trucks)
{
    <li>@truck.Name — @truck.Cuisine</li>
}
```

One `<li>` in the source. Six in the output.

You no longer write a page. You write a **rule for producing a page**.

---

## Week 2, revisited

The coffee shop's six menu cards were six hand-typed blocks of HTML.

Tonight, one loop does that job.

Adding a seventh truck means adding **data** — not markup.

Same kind of site. Different century.

---

<!-- _footer: '🎨 demo time — script §3: Razor playground + View Source after every beat' -->

## What does the browser actually get?

```html
@* the server strips this *@
<!-- this one ships -->
```

Then: **View Source** (`Ctrl/Cmd+U`).

- No `@`. No `foreach`. No `if`. Just HTML.
- The loop ran on the **server**; the browser got the result.

Notes-to-self go in `@* *@`.

---

## Three ways in

| Way | Good for |
|-----|----------|
| `Details(int id)` | values from the **URL** |
| `ViewData["Title"]` | one-off scraps — a title |
| `@model` ⭐ | **the subject of the page** |

`ViewData` is a shoebox. `@model` is a labeled, typed slot.

---

## Strongly typed views

Controller hands it over:

```csharp
return View(CourseData.All);
```

View declares what it's getting — **first line of the file**:

```html
@model List<Course>

<p>@Model.Count courses this semester.</p>
```

lowercase `@model` declares · capital `@Model` uses

---

## The pair behind every site

```
/Courses            →  Index    →  the whole list
/Courses/Details/2  →  Details  →  one item
```

```csharp
public IActionResult Details(int id)
```

The `2` lands in `id` — from the route's **third slot**, not a query string.

---

<!-- _footer: '🎨 demo time — script §4–5: the model arrives, then Details + the guard' -->

## Guard the door

```csharp
var course = CourseData.All
    .FirstOrDefault(c => c.Id == id);

if (course == null)
{
    return NotFound();
}
return View(course);
```

`First` **throws** → a 500. `FirstOrDefault` hands *you* the decision.

Then visit `/Courses/Details/999` on purpose.

---

## Lab: Roster 🧑‍🎓

- Copy `week-04/lab/starter/` out of the repo clone
- `dotnet test Roster.Checks` → **1 / 6 passing**
- A courses list · a details page · a 404 that's honest
- Same rhythm: one ❌ at a time

Tonight's target: **checks 1–4**. The rest is homework.

---

## Before next week

- ✅ Lab to **6 / 6**
- ✅ Your **own** list-and-details site — your topic, ≥5 items
- ✅ Deployed to Azure, URL + repo via Canvas
- ✅ 3+ meaningful commits

**Next week:** the site *shell* — layouts, partials, and week 2's Bootstrap everywhere at once.

---

## The chain, complete

```
URL → route → action → data → Razor → HTML → browser
```

Tonight's data was a hard-coded `List<Course>`.

In **week 7** it becomes a database table — and the controller barely changes.

The `@model` line doesn't change at all.
