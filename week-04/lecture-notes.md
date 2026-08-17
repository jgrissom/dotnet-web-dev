# Week 4 — Lecture Notes

> Last week: one URL found one method. Tonight: an app is a **set** of URLs over a **set** of data — and Razor is how C# data becomes HTML.

## Part 1: Routing deep dive (40 min)

### Where we left off

Week 3 ended with `/Home/Hello?name=Ada` reaching a C# method. That's one URL, one action, one answer. Real sites don't work that way — a catalog has a page per item, and nobody writes a method per product. Tonight we make **one action serve many URLs**, and **one view render many rows**.

Open week 3's demo app (or a fresh one) and put `Program.cs` on the projector. The line that matters:

```csharp
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
```

### Routing: the pattern decoded

Read the pattern as **three slots separated by slashes**:

| Slot | Means | If the URL omits it |
|------|-------|---------------------|
| `{controller=Home}` | which controller class | use `HomeController` |
| `{action=Index}` | which method on it | use `Index()` |
| `{id?}` | an optional extra value | leave it empty — the `?` says "optional" |

- The `=Home` and `=Index` parts are **defaults**. They are the entire reason `/` shows a page: the URL supplies *no* slots, so both defaults fire and you land on `HomeController.Index()`.
- The `Controller` suffix is added by convention. `/Trucks` → `TrucksController`. You never type the word "Controller" in a URL.

> [!IMPORTANT]
> Say this out loud and let it land: **the URL is not a file path.** There is no folder named `Trucks` being served. The URL is an *instruction* — "run this method" — and the route pattern is the translation table.

### Predict-then-run: the URL table

Put these on screen one at a time. Ask the room to predict **class + method** before you press Enter. Answers (instructor only):

| URL | Controller | Action | `id` |
|-----|-----------|--------|------|
| `/` | `HomeController` | `Index()` | — |
| `/Home` | `HomeController` | `Index()` | — |
| `/Home/Privacy` | `HomeController` | `Privacy()` | — |
| `/Privacy` | ❌ **404** — looks for `PrivacyController` | — | — |
| `/Home/Privacy/7` | `HomeController` | `Privacy()` | `7` (ignored — no parameter to catch it) |
| `/Trucks` | ❌ **404** tonight — `TrucksController` doesn't exist *yet* | — | — |

The `/Privacy` one is the money question. Most rooms guess it works. It doesn't — the first slot is always the *controller*, so `/Privacy` means "the Privacy controller," which nobody wrote.

> [!TIP]
> `/Home/Privacy/7` is worth a beat: the `7` matches `{id?}`, routing is perfectly happy, and the action simply never asks for it. **Routing matching and parameter binding are two different steps.** That distinction pays off in Part 4.

### Defaults are editable — break them on purpose

This is the segment's live-coding moment (demo §1). Change the default action:

```csharp
pattern: "{controller=Home}/{action=Privacy}/{id?}"
```

Save, hit `/` — the privacy page. The home page didn't move; the *default* moved. Change it back.

Then delete `/{id?}` from the pattern, save, and visit `/Home/Privacy/7` → **404**. The URL has three segments; the pattern now only knows two. Restore it.

- Two edits, two visible consequences: students see that routing is **just configuration**, not magic baked into the framework.
- Restore the pattern before moving on. Say that out loud so nobody leaves it broken.

### 404 vs 500 — the diagnosis habit

| You see | It means | Look at |
|---------|----------|---------|
| **404** | routing found nothing — no such controller/action, or the pattern doesn't match | the URL, the class name, the method name |
| **500** | routing worked, then *your code* threw | the terminal running `dotnet watch` — the real error is there |

Reinforce week 3's line: **the status code is clue #1.** Tonight adds the corollary — 404 is a *routing* conversation, 500 is a *code* conversation. Students who internalize this stop guessing.

## Part 2: A second controller (30 min)

### Conventions: three names that must agree

To make `/Trucks` work, three things must line up:

```
Controllers/TrucksController.cs      ← class TrucksController
        ▲
        │ the "Trucks" part must match
        ▼
Views/Trucks/Index.cshtml            ← folder named for the controller,
                                       file named for the action
```

- **Class name** `TrucksController` → URL segment `Trucks`
- **View folder** `Views/Trucks/` → matches the controller name
- **View file** `Index.cshtml` → matches the action name

`return View()` with no arguments means: *"go find the view whose name matches the action I'm in, in the folder named after my controller."* Nobody registers anything. This is **convention over configuration** — the phrase from week 3, now doing real work.

> [!TIP]
> **Misname a folder on purpose** (demo §2). Rename `Views/Trucks` to `Views/Truck`, refresh, and read the error page out loud — ASP.NET Core lists *every path it searched*. That error message is the single most useful thing a beginner can learn to read this semester: it doesn't just say "broken," it says "I looked here, and here" — naming `Views/Trucks/Index.cshtml` and `Views/Shared/Index.cshtml`, the only two places it tried. Rename it back.

### Content() before View()

Build the controller in two steps so each half is provable on its own. This is the **whole file**, top to bottom — `Controllers/TrucksController.cs`:

```csharp
using Microsoft.AspNetCore.Mvc;      // Controller, IActionResult

namespace Curbside.Controllers;      // matches the folder, by convention

public class TrucksController : Controller
{
    public IActionResult Index()
    {
        return Content("trucks!");   // step 1: proves ROUTING works
    }
}
```

- **The `using` is not optional.** `Controller` and `IActionResult` both live in `Microsoft.AspNetCore.Mvc`; without that line neither name resolves. VS Code will offer to add it (`Ctrl/Cmd + .`) — and often adds it silently when you accept `Controller` from IntelliSense.
- The `namespace` line mirrors the folder. Nothing enforces it, but every file in the project does it, and it's [why your controller later needs a `using` for your Models](#namespaces-and-the-using-they-require).

Visit `/Trucks` → the word "trucks!" on a blank page. No view exists yet and it doesn't matter — routing is proven. *Then* swap `Content(...)` for `View()` and add the `.cshtml`. Two possible failure points, isolated one at a time.

- **Why this matters as a habit:** when something breaks later, the students who split the problem in half find the bug; the ones who stare at all of it don't.

## Part 3: Razor for real (45 min)

Week 3 was a taste — `@ViewData["Title"]` in a page. Tonight Razor earns its keep.

### The @ escape hatch

Razor is **HTML with `@` as the door into C#**. One rule covers most of it: `@` means "the next bit is C#, evaluate it and write the result here."

```html
<p>The time is @DateTime.Now</p>
<p>Two plus two is @(2 + 2)</p>
```

- Bare `@expression` works for simple things: a variable, a property, a method call.
- **Parentheses** `@( ... )` when the expression has spaces or operators, or when Razor might not guess where the C# ends.
- **JS bridge:** this is template interpolation, same instinct as `` `${x}` `` in a template literal. The difference is *where* it runs — Razor runs on the server, before the browser sees anything.

### Code blocks and variables

```html
@{
    var special = "Birria Tuesday";
    var count = 6;
}

<h2>@special</h2>
<p>We track @count trucks.</p>
```

- `@{ ... }` is a block of **statements** — declare variables, do math, no output on its own.
- Inside the block you're writing plain C#; outside it you're writing HTML. Razor switches back and forth automatically, which feels uncanny for about ten minutes and then feels normal.

### Conditionals in a view

Still no model yet, so the condition reads a local — demo §3 declares it in the block right above:

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

- Flip the variable to `false`, save, refresh: **different HTML from the same file**, and View Source shows only the branch that ran. The other one never existed.
- Note there is **no `@` on `else`** — once you've opened `@if`, Razor stays in C# mode through the whole statement. Students will add a stray `@` here; it's the most common Razor typo of the night.
- The braces belong to C#; the tags inside them are HTML that only gets written **when the branch runs**. That's the whole idea: *markup as an outcome of logic*.

### Loops in a view

There's still no model at this point in the night, so the loop runs over a **local array you declare in the view** — exactly what demo §3 types:

```html
@{
    var cuisines = new[] { "Korean", "Mexican", "Greek", "Polish" };
}

<ul>
    @foreach (var c in cuisines)
    {
        <li>@c</li>
    }
</ul>
```

- One `<li>` written in the source; **four** `<li>` in the output. **This is the moment the week is built around.** Say it plainly: you no longer write a page, you write a *rule for producing a page*.
- Add a fifth cuisine to the array and the page grows: **data changed, markup didn't.**
- Callback to week 2: the coffee shop's six menu cards were six hand-typed blocks of HTML. Tonight one loop does that job. Same kind of site, different century.
- **Forward pointer:** in Part 4 the same loop runs over `Model` instead of a local array — `@foreach (var truck in Model)`. The loop doesn't change; only where the data comes from does.

### Comments: two kinds, and only one is private

```html
@* Razor comment — the server strips this. The browser never sees it. *@
<!-- HTML comment — this ships to the browser. View Source shows it. -->
```

Demo this and View Source it. It's a five-second beat with a real security lesson attached: notes-to-self go in `@* *@`, because anything in an HTML comment is public.

### View Source: the proof

After every Razor beat above, **View Source** — not DevTools' Elements panel, actual View Source: `Ctrl+U` on Windows, **`⌘⌥U` on a Mac** (plain `⌘U` is not bound to it in Chrome). Right-click → *View Page Source* always works and is the safest thing to show a mixed room.

- There is no `@`, no `foreach`, no `if` anywhere in what the browser received. Just HTML.
- The loop ran **on the server**; the browser got the finished product. This is the deepest difference between week 1–2 JavaScript and what you're doing now, and View Source is the proof you can point at.

> [!NOTE]
> DevTools' **Elements** panel shows the *live DOM* — which JavaScript may have changed since the page loaded. **View Source** shows the raw bytes the server actually sent. When you want to know "what did the server render?", View Source is the honest answer.

## Part 4: Passing data and @model (35 min)

### The model: a plain C# class

Before anything can be passed to a view, there has to be something to pass. The **M** in MVC is just a class — and the first thing to say out loud is how *unremarkable* it is:

```csharp
namespace Curbside.Models;

public class Truck
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Cuisine { get; set; } = "";
    public double Rating { get; set; }
    public bool IsOpenLate { get; set; }
}
```

- **No base class, no interface, no attributes, nothing from ASP.NET.** It's the same C# they wrote in the prerequisite course. If it looks too simple to be "the model," that's the point.
- `{ get; set; }` — auto-properties, the shape every model in this course uses.
- **Why `= ""` on the strings?** The template turns on nullable reference types, so a non-nullable `string` with no initial value gets a compiler warning. `= ""` says "starts empty, never null." Students writing their own model in the homework will hit this — it's a warning, not an error, but tell them what it means rather than letting them wonder.
- `Id` is an `int` by convention. Week 7's database will make that a primary key for free.

### The seeded list: a database that isn't one yet

```csharp
namespace Curbside.Models;           // Models/TruckData.cs

public static class TruckData
{
    public static List<Truck> All { get; } = new()
    {
        new Truck { Id = 1, Name = "Roll Models", Cuisine = "Korean", Rating = 4.6, IsOpenLate = true },
        // ...five more
    };
}
```

- **Why `static`?** ASP.NET creates a *new controller instance for every request* — instance fields don't survive between them. A `static` list lives for the life of the app, which is what makes it behave like a data store. This surprises people; say it before they discover it.
- Object-initializer syntax (`new Truck { Id = 1, ... }`) is worth naming, because they'll write a lot of it tonight and again in week 7's seeding.
- **This whole file is scaffolding.** It exists so the interesting parts — routing, Razor, `@model` — can be taught before the database arrives. Week 7 deletes it and the controller barely changes.

> [!TIP]
> The lab **hands them both files**, so nobody writes a model during class. The homework asks them to write their own from scratch — this section is the one they'll be reading at home, so don't skip it just because the lab doesn't need it.

### Three ways data reaches the page

| Way | Looks like | Good for | Trouble |
|-----|-----------|----------|---------|
| **Action parameter** | `Details(int id)` | values that come *from the URL* | it's input, not page data |
| **`ViewData` / `ViewBag`** | `ViewData["Title"] = "Trucks";` | one-off scraps — a title, a flash message | no type safety, no IntelliSense, typos fail silently |
| **`@model`** ⭐ | `return View(trucks);` | **the actual subject of the page** | none — this is the one you want |

**They don't all move the same way, and only one of them is really a direction.** `@model` is the strict one: the controller hands an object over in `View(...)`, and the view declares on line 1 what it expects.

`ViewData` is looser than that — it's a dictionary that lives for the length of a single request, so anything in the pipeline can write to it *or* read it. A controller can fill it (week 3's `MenuController` sets `ViewData["Title"]`), and so can a view: the `Index.cshtml` you write this week sets its own title, and `_Layout.cshtml` reads it back out for the `<title>` tag. That one is view → layout.

An action parameter goes the other way entirely — *URL → controller* — so it isn't a way of handing data to a view at all; it's how the data reaches the controller in the first place. And it arrives as a brand-new request: the browser asks again, and a fresh controller object is built to answer, remembering nothing from last time.

The honest summary for students: `ViewData` is a shoebox you toss things into; `@model` is a labeled, typed slot the compiler checks. Use `ViewData` for the page title (the template already does) and `@model` for everything that *is* the page.

### Namespaces, and the `using` they require

The moment the controller says `TruckData.All`, something has to connect two files. That something is a **namespace**.

```csharp
namespace Curbside.Models;      // Models/Truck.cs, Models/TruckData.cs
namespace Curbside.Controllers; // Controllers/TrucksController.cs
```

- A namespace is a **surname for your types**. `Curbside.Models.Truck` is the type's full name; `Truck` is just what you call it among family.
- **Being in the same project does not make a type visible.** `Curbside.Controllers` can't see `Curbside.Models` any more than it can see a random NuGet package — you have to import it: `using Curbside.Models;`
- **Views never declare a namespace.** You don't write `namespace` in a `.cshtml` file. They get their *imports* handed to them instead: `Views/_ViewImports.cshtml` already contains `@using Curbside.Models`, and it applies to every view in the folder and below — which is why `@model List<Truck>` just works while the controller needed a `using` of its own.
- **Why anyone bothers:** two classes named `Truck` can coexist if they live in different namespaces, and every scaffolded file you meet from week 7 on — EF Core, Identity — will have one. This is universal .NET furniture, not a Curbside quirk.

> [!NOTE]
> **Honest footnote, and it explains something you may see live:** C# does *not* force this. Type a class with no `namespace` line at all and it lands in the global namespace, visible everywhere, needing no `using` — the app builds and runs exactly the same. That's why a student who skips the namespace never hits the red squiggle, and why VS Code adding the `using` for you (when you accept `TruckData` from IntelliSense) can make the whole issue invisible.
>
> We use namespaces because every professional .NET codebase does, and because the template already put your files in them. **It isn't graded** — but tell them to match the starter's shape, or half the room will be reading different code from the other half by week 7.

> [!TIP]
> **If someone asks "so what namespace is my view in?"** — a good question, and the answer reinforces the week's thesis. Razor compiles every `.cshtml` into a real C# class at build time, and the build puts it here:
>
> ```csharp
> namespace AspNetCoreGeneratedDocument
> {
>     internal sealed class Views_Trucks_Index : RazorPage<List<Truck>>
> ```
>
> The class name is just the file's path with slashes turned into underscores, and the `@model` line became the generic argument. You never write any of it. Land the point: **a view isn't a document the server reads — it's a class the server runs**, which is exactly why the `@foreach` executes before the browser sees anything.

### Strongly typed views with @model

Two halves that must agree. Controller side:

```csharp
public IActionResult Index()
{
    return View(TruckData.All);       // hand the list to the view
}
```

View side, **first line of the file**:

```html
@model List<Truck>

<p>@Model.Count trucks on the street.</p>

<ul>
    @foreach (var truck in Model)
    {
        <li>@truck.Name — @truck.Cuisine</li>
    }
</ul>
```

- Lowercase **`@model`** (the declaration, once, at the top) vs. capital **`@Model`** (the value, used everywhere below). This trips everyone; call it out before it bites.
- **Make the two halves disagree on purpose** (demo §4): have `Index` pass a single `Truck` to a view that still declares `@model List<Truck>`. It **compiles** — the mismatch only surfaces when someone requests the page, as a 500 whose message names both types (`is of type 'Truck', but ... requires ... 'List<Truck>'`). Worth doing live, because it is the same error the troubleshooting appendix lists, and students meet it alone.
- The payoff: type `@Model.` in VS Code and **IntelliSense lists the real properties**. Typo one — `@truck.Titel` — and you get a red squiggle *before* you refresh. Do this live; it's the most persuasive 15 seconds in the segment.
- **Why it matters beyond convenience:** in week 8 the scaffolder generates views that all start with `@model`. Tonight is what makes that generated code readable instead of magic.

### Index and Details: the classic pair

Every data-driven site you have ever used is this pair:

```
/Trucks            → Index   → the whole list
/Trucks/Details/2  → Details → one item, chosen by the id in the URL
```

And here's where `{id?}` pays off. `Details(int id)` gets its `id` from the **third route slot** — not a query string:

```csharp
public IActionResult Details(int id)
```

`/Trucks/Details/2` → `id` is `2`. Same binding idea as week 3's `?name=Ada`, different source. Model binding looks in the route values *and* the query string, and it matches **by name**.

### Details and the NotFound guard

A second action **inside the controller you already have** — the `using` and `namespace` at the top of that file are already in place:

```csharp
public IActionResult Details(int id)
{
    var truck = TruckData.All.FirstOrDefault(t => t.Id == id);

    if (truck == null)
    {
        return NotFound();       // honest 404
    }

    return View(truck);
}
```

- **`FirstOrDefault` vs `First`:** `First` *throws* when nothing matches — the user gets a 500 and a stack trace for what is really a perfectly ordinary situation ("that truck doesn't exist"). `FirstOrDefault` returns `null` instead, handing *you* the decision. Choosing the API that lets you handle the case is the lesson.
- **`NotFound()` returns a 404** — the same status the browser gets for any missing page. It's another `IActionResult`, exactly like `View()` and `Content()`.
- **Visit `/Trucks/Details/999` on purpose.** Without the guard: a 500, or a page rendering nothing. With it: a clean 404. The difference between "the site is broken" and "that thing doesn't exist" is this `if`.

> [!WARNING]
> Skip the null check and the view blows up on `@Model.Title` with a `NullReferenceException` — a **500**. Students will hit this. The fix is always the guard, and 500-means-your-code (Part 1) is how they'll find it.

### The navbar, and the one nav link your homework needs

The navbar's links use `asp-controller` / `asp-action` — **tag helpers**, which generate the same `href` you'd type by hand. Tonight we write plain `href="/Trucks/Details/@truck.Id"` in our own views because it's honest about what the URL is. Tag helpers get their proper introduction in week 6, where forms make them genuinely worth it. If a student asks why the nav looks different from their table links: that's the answer, and it's a good question.

**Your homework asks for one nav link, and this is the whole edit.** We don't do it in the demo — tonight is about routing, and the way to prove a URL is an instruction is to *type* it, not click it. But the homework needs it, so here it is written out.

Open `Views/Shared/_Layout.cshtml` and find the `<ul class="navbar-nav">`. It already has two `<li>` items — Home and Privacy. This is the Privacy one:

```html
<li class="nav-item">
    <a class="nav-link text-dark" asp-area="" asp-controller="Home" asp-action="Privacy">Privacy</a>
</li>
```

**Copy it, paste it directly below itself, and change three things** — the controller, the action, and the text between the tags:

```html
<li class="nav-item">
    <a class="nav-link text-dark" asp-area="" asp-controller="Trucks" asp-action="Index">Trucks</a>
</li>
```

- **`asp-controller` is the class name minus the word `Controller`** — `TrucksController` → `"Trucks"`. Same name the URL uses, for the same reason.
- **`asp-action` is the method name** — `Index`.
- The text between `<a>` and `</a>` is just what the visitor reads. It doesn't have to match anything.
- That renders as `href="/Trucks"`, which you can confirm in View Source — the tag helper wrote the same URL you'd have typed.

> [!IMPORTANT]
> **This is the only change to `_Layout.cshtml` the homework wants, and that's deliberate.** You're pasting one line into a file we haven't explained — the rest of it is week 5, where you take the whole shell over. Don't go exploring in there tonight; it isn't needed and it's a good way to break every page at once.
>
> It's also worth 2 points on its own, *and* it's how the self-checker finds your controller — it follows the navbar exactly like a visitor would. No link, no discovery.

## Wrap-up (10 min)

The whole chain, now complete:

```
URL → route pattern → controller action → data → Razor view → HTML → browser
```

- **Tonight:** routing you can read *and edit*, a second controller built from conventions, Razor with loops and conditionals, and typed data flowing from C# into a page.
- **The setup for week 7:** every creature in tonight's lab came from a hard-coded `List<Cryptid>`. Point at it and say — *when this becomes a database table, the controller barely changes.* The `@model` line doesn't change at all.
- **Homework:** the same Index → Details pair, on a topic they pick, deployed to Azure.
- **Next week:** the site *shell* — layouts and partials, and the Bootstrap from week 2 applied across every page at once.

## Appendix: Troubleshooting

**404 on a page that should exist**
- Route → action → view, in that order. Is the class named `XxxController` and `public`? Is the method `public`? Does the URL's first segment match the class name minus "Controller"?
- Did you edit the route pattern earlier and forget to restore it? (It happens in this exact lecture.)

**`InvalidOperationException: The view 'Index' was not found`**
- Read the error — it lists every path it searched. Nine times out of ten the view folder name doesn't match the controller name (`Views/Truck/` vs `Views/Trucks/`), or the file is `index.cshtml` on a case-sensitive deployment. Match the case exactly.

**The model item passed into the ViewDataDictionary is of type X, but requires Y**
- The controller passed one thing, the view's `@model` line declares another. Common pair: `return View(truck)` (a single item) with `@model List<Truck>` at the top. Make the two agree.

**`NullReferenceException` / 500 on a Details page**
- Missing null guard, or an id that doesn't exist. Add the `FirstOrDefault` + `NotFound()` pattern.

**`@Model` is null in the view**
- The action returned `View()` with no argument. Pass the data: `View(truck)`.

**Razor syntax errors that make no sense**
- Stray `@` on an `else` or on a closing brace — inside a C# block you're already in C#. Also check for a `@` in an email address or CSS selector in your markup; escape it as `@@`.

**Changes don't show up**
- `dotnet watch` handles `.cs` and `.cshtml` edits, but a new *file* occasionally needs a restart. Stop it (`Ctrl+C`) and run it again before you debug something that isn't broken.

**IntelliSense shows no properties after `@Model.`**
- The C# extension lost the project. Command Palette → *Developer: Reload Window*. If the `@model` line has a typo in the type name, that'll do it too.

**404 for every URL after editing `Program.cs`**
- The route pattern is malformed or the `MapControllerRoute` call got mangled. Compare against a fresh `dotnet new mvc` — the pattern should read `{controller=Home}/{action=Index}/{id?}`.
