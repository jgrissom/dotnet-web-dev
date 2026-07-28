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
- The `Controller` suffix is added by convention. `/Courses` → `CoursesController`. You never type the word "Controller" in a URL.

> [!IMPORTANT]
> Say this out loud and let it land: **the URL is not a file path.** There is no folder named `Courses` being served. The URL is an *instruction* — "run this method" — and the route pattern is the translation table.

### Predict-then-run: the URL table

Put these on screen one at a time. Ask the room to predict **class + method** before you press Enter. Answers (instructor only):

| URL | Controller | Action | `id` |
|-----|-----------|--------|------|
| `/` | `HomeController` | `Index()` | — |
| `/Home` | `HomeController` | `Index()` | — |
| `/Home/Privacy` | `HomeController` | `Privacy()` | — |
| `/Privacy` | ❌ **404** — looks for `PrivacyController` | — | — |
| `/Home/Privacy/7` | `HomeController` | `Privacy()` | `7` (ignored — no parameter to catch it) |
| `/Courses` | ❌ **404** tonight — `CoursesController` doesn't exist *yet* | — | — |

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
> **Misname a folder on purpose** (demo §2). Rename `Views/Trucks` to `Views/Truck`, refresh, and read the error page out loud — ASP.NET Core lists *every path it searched*. That error message is the single most useful thing a beginner can learn to read this semester: it doesn't just say "broken," it says "I looked here, here, and here." Rename it back.

### Content() before View()

Build the controller in two steps so each half is provable on its own:

```csharp
public class TrucksController : Controller
{
    public IActionResult Index()
    {
        return Content("trucks!");   // step 1: proves ROUTING works
    }
}
```

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

```html
@if (truck.IsOpenLate)
{
    <span class="badge bg-success">🌙 Open late</span>
}
else
{
    <span class="badge bg-secondary">Closes at 8</span>
}
```

- Note there is **no `@` on `else`** — once you've opened `@if`, Razor stays in C# mode through the whole statement. Students will add a stray `@` here; it's the most common Razor typo of the night.
- The braces belong to C#; the tags inside them are HTML that only gets written **when the branch runs**. That's the whole idea: *markup as an outcome of logic*.

### Loops in a view

```html
<ul>
    @foreach (var truck in trucks)
    {
        <li>@truck.Name — @truck.Cuisine</li>
    }
</ul>
```

- One `<li>` written in the source; six `<li>` in the output. **This is the moment the week is built around.** Say it plainly: you no longer write a page, you write a *rule for producing a page*.
- Callback to week 2: the coffee shop's six menu cards were six hand-typed blocks of HTML. Tonight one loop does that job, and adding a seventh truck means adding *data*, not markup. Same kind of site, different century.

### Comments: two kinds, and only one is private

```html
@* Razor comment — the server strips this. The browser never sees it. *@
<!-- HTML comment — this ships to the browser. View Source shows it. -->
```

Demo this and View Source it. It's a five-second beat with a real security lesson attached: notes-to-self go in `@* *@`, because anything in an HTML comment is public.

### View Source: the proof

After every Razor beat above, **View Source** (not DevTools' Elements panel — actual View Source, `Ctrl/Cmd+U`).

- There is no `@`, no `foreach`, no `if` anywhere in what the browser received. Just HTML.
- The loop ran **on the server**; the browser got the finished product. This is the deepest difference between week 1–2 JavaScript and what you're doing now, and View Source is the proof you can point at.

> [!NOTE]
> DevTools' **Elements** panel shows the *live DOM* — which JavaScript may have changed since the page loaded. **View Source** shows the raw bytes the server actually sent. When you want to know "what did the server render?", View Source is the honest answer.

## Part 4: Passing data and @model (35 min)

### Three ways to get data into a view

| Way | Looks like | Good for | Trouble |
|-----|-----------|----------|---------|
| **Action parameter** | `Details(int id)` | values that come *from the URL* | it's input, not page data |
| **`ViewData` / `ViewBag`** | `ViewData["Title"] = "Courses";` | one-off scraps — a title, a flash message | no type safety, no IntelliSense, typos fail silently |
| **`@model`** ⭐ | `return View(courses);` | **the actual subject of the page** | none — this is the one you want |

The honest summary for students: `ViewData` is a shoebox you toss things into; `@model` is a labeled, typed slot the compiler checks. Use `ViewData` for the page title (the template already does) and `@model` for everything that *is* the page.

### Strongly typed views with @model

Two halves that must agree. Controller side:

```csharp
public IActionResult Index()
{
    return View(CourseData.All);      // hand the list to the view
}
```

View side, **first line of the file**:

```html
@model List<Course>

<p>@Model.Count courses this semester.</p>
```

- Lowercase **`@model`** (the declaration, once, at the top) vs. capital **`@Model`** (the value, used everywhere below). This trips everyone; call it out before it bites.
- The payoff: type `@Model.` in VS Code and **IntelliSense lists the real properties**. Typo one — `@course.Titel` — and you get a red squiggle *before* you refresh. Do this live; it's the most persuasive 15 seconds in the segment.
- **Why it matters beyond convenience:** in week 8 the scaffolder generates views that all start with `@model`. Tonight is what makes that generated code readable instead of magic.

### Index and Details: the classic pair

Every data-driven site you have ever used is this pair:

```
/Courses            → Index   → the whole list
/Courses/Details/2  → Details → one item, chosen by the id in the URL
```

And here's where `{id?}` pays off. `Details(int id)` gets its `id` from the **third route slot** — not a query string:

```csharp
public IActionResult Details(int id)
```

`/Courses/Details/2` → `id` is `2`. Same binding idea as week 3's `?name=Ada`, different source. Model binding looks in the route values *and* the query string, and it matches **by name**.

### Details and the NotFound guard

```csharp
public IActionResult Details(int id)
{
    var course = CourseData.All.FirstOrDefault(c => c.Id == id);

    if (course == null)
    {
        return NotFound();       // honest 404
    }

    return View(course);
}
```

- **`FirstOrDefault` vs `First`:** `First` *throws* when nothing matches — the user gets a 500 and a stack trace for what is really a perfectly ordinary situation ("that course doesn't exist"). `FirstOrDefault` returns `null` instead, handing *you* the decision. Choosing the API that lets you handle the case is the lesson.
- **`NotFound()` returns a 404** — the same status the browser gets for any missing page. It's another `IActionResult`, exactly like `View()` and `Content()`.
- **Visit `/Courses/Details/999` on purpose.** Without the guard: a 500, or a page rendering nothing. With it: a clean 404. The difference between "the site is broken" and "that thing doesn't exist" is this `if`.

> [!WARNING]
> Skip the null check and the view blows up on `@Model.Title` with a `NullReferenceException` — a **500**. Students will hit this. The fix is always the guard, and 500-means-your-code (Part 1) is how they'll find it.

### One last note on the navbar

The navbar's links use `asp-controller` / `asp-action` — **tag helpers**, which generate the same `href` you'd type by hand. Tonight we write plain `href="/Courses/Details/@course.Id"` in our own views because it's honest about what the URL is. Tag helpers get their proper introduction in week 6, where forms make them genuinely worth it. If a student asks why the nav looks different from their table links: that's the answer, and it's a good question.

## Wrap-up (10 min)

The whole chain, now complete:

```
URL → route pattern → controller action → data → Razor view → HTML → browser
```

- **Tonight:** routing you can read *and edit*, a second controller built from conventions, Razor with loops and conditionals, and typed data flowing from C# into a page.
- **The setup for week 7:** every course in tonight's lab came from a hard-coded `List<Course>`. Point at it and say — *when this becomes a database table, the controller barely changes.* The `@model` line doesn't change at all.
- **Homework:** the same Index → Details pair, on a topic they pick, deployed to Azure.
- **Next week:** the site *shell* — layouts and partials, and the Bootstrap from week 2 applied across every page at once.

## Appendix: Troubleshooting

**404 on a page that should exist**
- Route → action → view, in that order. Is the class named `XxxController` and `public`? Is the method `public`? Does the URL's first segment match the class name minus "Controller"?
- Did you edit the route pattern earlier and forget to restore it? (It happens in this exact lecture.)

**`InvalidOperationException: The view 'Index' was not found`**
- Read the error — it lists every path it searched. Nine times out of ten the view folder name doesn't match the controller name (`Views/Truck/` vs `Views/Trucks/`), or the file is `index.cshtml` on a case-sensitive deployment. Match the case exactly.

**The model item passed into the ViewDataDictionary is of type X, but requires Y**
- The controller passed one thing, the view's `@model` line declares another. Common pair: `return View(course)` (a single item) with `@model List<Course>` at the top. Make the two agree.

**`NullReferenceException` / 500 on a Details page**
- Missing null guard, or an id that doesn't exist. Add the `FirstOrDefault` + `NotFound()` pattern.

**`@Model` is null in the view**
- The action returned `View()` with no argument. Pass the data: `View(course)`.

**Razor syntax errors that make no sense**
- Stray `@` on an `else` or on a closing brace — inside a C# block you're already in C#. Also check for a `@` in an email address or CSS selector in your markup; escape it as `@@`.

**Changes don't show up**
- `dotnet watch` handles `.cs` and `.cshtml` edits, but a new *file* occasionally needs a restart. Stop it (`Ctrl+C`) and run it again before you debug something that isn't broken.

**IntelliSense shows no properties after `@Model.`**
- The C# extension lost the project. Command Palette → *Developer: Reload Window*. If the `@model` line has a typo in the type name, that'll do it too.

**404 for every URL after editing `Program.cs`**
- The route pattern is malformed or the `MapControllerRoute` call got mangled. Compare against a fresh `dotnet new mvc` — the pattern should read `{controller=Home}/{action=Index}/{id?}`.
