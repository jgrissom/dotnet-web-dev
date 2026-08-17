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

<!-- _footer: '🖥️ Demo §0b' -->

## Last week vs. tonight

**Week 3:** one URL found one method.

**Tonight:** an app is a *set* of URLs over a *set* of data.

- Routing you can read **and edit**
- A second controller, built from conventions
- Razor with loops and conditionals
- Data flowing from C# into a page — typed

---

<!-- _footer: '🖥️ Demo §1 · read the pattern' -->

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

<!-- _footer: '🖥️ Demo §1 · predict-then-run' -->

## Predict before you press Enter

| URL | Controller? | Action? |
|-----|-------------|---------|
| `/` | ? | ? |
| `/Home/Privacy` | ? | ? |
| `/Privacy` | ? | ? |
| `/Home/Privacy/7` | ? | ? |
| `/Trucks` | ? | ? |

Two of these do something you may not expect.

---

<!-- _footer: '🖥️ Demo §1 · predict-then-run' -->

## The URL is not a file path

There is no folder named `Trucks`.

- The URL is an **instruction**: *run this method*
- The pattern is the **translation table**
- Change the pattern → change what every URL means

Routing is configuration, not magic. So let's edit it.

---

<!-- _footer: '🖥️ Demo §2 · controller, no view' -->

## Three names must agree

```
1. class    TrucksController     ← this is what makes /Trucks work
2. folder   Views/Trucks/        ← named for the controller
3. file     Index.cshtml         ← named for the action
```

`return View()` = *"find the view named after the action I'm in."*

**Convention over configuration.**

---

<!-- _footer: '🖥️ Demo §2 · then the view' -->

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

<!-- _footer: '🖥️ Demo §3 · expressions' -->

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

<!-- _footer: '🖥️ Demo §3 · blocks and branches' -->

<!-- A 15-line code block plus the payoff line overruns gaia's body box and the
     last line lands on the footer. Tightening the block margins fits it at
     full size. -->
<style scoped>
  section p { margin: .35em 0; }
  section pre { margin: .35em 0; }
</style>

## Blocks and branches

```html
@{
    var isOpenLate = true;
}

@if (isOpenLate)
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

<!-- _footer: '🖥️ Demo §3 · a loop' -->

## The big idea

```html
@{ var cuisines = new[] { "Korean", "Mexican", "Greek", "Polish" }; }

<ul>
    @foreach (var c in cuisines)
    {
        <li>@c</li>
    }
</ul>
```

One `<li>` in the source. Four in the output.

You no longer write a page. You write a **rule for producing a page**.

---

<!-- _footer: '🖥️ Demo §3 · a loop' -->

## Week 2, revisited

The coffee shop's six menu cards were six hand-typed blocks of HTML.

Tonight, one loop does that job.

Adding a fifth cuisine means adding **data** — not markup.

Same kind of site. Different century.

---

<!-- _footer: '🖥️ Demo §3 · comments' -->

## What does the browser actually get?

```html
@* the server strips this *@
<!-- this one ships -->
```

Then: **View Source** — `Ctrl+U`, or `⌘⌥U` on a Mac.

- No `@`. No `foreach`. No `if`. Just HTML.
- The loop ran on the **server**; the browser got the result.

Notes-to-self go in `@* *@`.

---

<!-- _footer: '🖥️ Demo §4 · the model class' -->

## The model is just a class

```csharp
public class Truck
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public double Rating { get; set; }
    public bool IsOpenLate { get; set; }
}
```

No base class. No attributes. Nothing from ASP.NET.

The **M** in MVC is plain C#.

---

<!-- _footer: '🖥️ Demo §4 · the seed data' -->

## Six trucks, no database

```csharp
public static class TruckData
{
    public static List<Truck> All { get; } = new()
    {
        new Truck { Id = 1, Name = "Roll Models", ... },
    };
}
```

`static` because **every request gets a new controller** — instance fields wouldn't survive.

Week 7 deletes this file. The controller barely notices.

---

<!-- _footer: '🖥️ Demo §4 · into the controller' -->

## Three ways in

| Way | Good for |
|-----|----------|
| `Details(int id)` | values from the **URL** |
| `ViewData["Title"]` | one-off scraps — a title |
| `@model` ⭐ | **the subject of the page** |

`ViewData` is a shoebox. `@model` is a labeled, typed slot.

---

<!-- _footer: '🖥️ Demo §4 · into the view' -->

## Strongly typed views

Controller hands it over:

```csharp
return View(TruckData.All);
```

View declares what it's getting — **first line of the file**:

```html
@model List<Truck>

<p>@Model.Count trucks on the street.</p>
```

lowercase `@model` declares · capital `@Model` uses

---

<!-- _footer: '🖥️ Demo §5 · the Details action' -->

## The pair behind every site

```
/Trucks            →  Index    →  the whole list
/Trucks/Details/2  →  Details  →  one item
```

```csharp
public IActionResult Details(int id)
```

The `2` lands in `id` — from the route's **third slot**, not a query string.

---

<!-- _footer: '🖥️ Demo §5 · an honest 404' -->

## Guard the door

```csharp
var truck = TruckData.All
    .FirstOrDefault(t => t.Id == id);

if (truck == null)
{
    return NotFound();
}
return View(truck);
```

`First` **throws** → a 500. `FirstOrDefault` hands *you* the decision.

Then visit `/Trucks/Details/999` on purpose.

---

<!-- _footer: '🖥️ Demo §6' -->

## Lab: Cryptid Registry 👻

- Copy `week-04/` out of the starters clone
- `dotnet test Cryptids.Checks` → **1 / 6 passing**
- **Model and data are given** — you write controllers and views
- A list · a details page · a 404 that's honest

**⏱️ 40 minutes · tonight's target: checks 1–4.** The rest is homework.

---

<!-- _footer: '🖥️ Demo §7' -->

## Before next week

- ✅ Lab to **6 / 6** — not collected, do it anyway
- ✅ **Start your semester project** — your topic, ≥5 items
- ✅ When done: one `<script>` tag, then read the console
- ✅ Deployed to Azure, URL + repo via Canvas · 3+ commits

You'll extend that app every week from here. **Pick a topic you can live with.**

---

<!-- _footer: '🖥️ Demo §7' -->

## The chain, complete

```
URL → route → action → data → Razor → HTML → browser
```

Tonight's data was a hard-coded `List<Truck>`.

In **week 7** it becomes a database table — and the controller barely changes. The `@model` line doesn't change at all.

**Next week:** the site *shell* — layouts, partials, and week 2's Bootstrap everywhere at once.
