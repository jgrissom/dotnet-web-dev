# Week 6 — Lecture Notes

> Five weeks in, your app is a very good pamphlet. It reads from a list you typed by hand and it shows people what's in it. Tonight it starts *listening* — and the moment a browser can send you data, three new questions arrive at once: how does the data get into your C# object, who decides whether it's any good, and where does it go afterwards. All three have short answers, and you'll break each one on purpose before the night is out.

## Part 1: The round trip (30 min)

### Everything so far has been one-way

Week 3: a URL comes in, HTML goes out. Week 4: the URL decided *which* data. Week 5: a shared shell wrapped it. In all three, the browser asked and the server told. Nothing ever traveled the other way.

A form reverses the direction, using HTTP's other verb — the one you named in week 3 and have never sent:

| | GET | POST |
|---|---|---|
| What it means | "give me this" | "here, take this" |
| Where the data rides | in the URL — `/Trucks/Details/2` | in the request **body**, out of sight |
| Safe to repeat | yes — refresh all you like | **no** — refreshing sends it again |
| You've used it | every page since week 3 | starting now |

That last row is not trivia. It's why the night ends with a redirect.

### A form, in plain HTML

Start with no tag helpers at all — a form exactly like the ones you wrote in week 2. Two actions first. **This goes inside the `TrucksController` you already have**, below `Details`:

```csharp
// GET /Trucks/Create — hand the browser an empty form
public IActionResult Create()
{
    return View();
}

// POST /Trucks/Create — the filled-in form lands here.
// It prints what arrived to the terminal and gets out of the way. Temporary,
// and the printing is the point.
[HttpPost]
public IActionResult Create(Truck truck)
{
    Console.WriteLine($"── model binding built a {truck.GetType().Name} ──");
    Console.WriteLine($"   Name      {truck.Name}");
    Console.WriteLine($"   Cuisine   {truck.Cuisine}");
    Console.WriteLine($"   City      {truck.City}");
    Console.WriteLine($"   Rating    {truck.Rating}   (x2 = {truck.Rating * 2})");
    Console.WriteLine($"   Open late {truck.IsOpenLate}");

    return Content("Submitted — look at the terminal 👀");
}
```

> [!NOTE]
> **`[HttpPost]` is an attribute, and this is the first one in the course.** Anything in square brackets above a declaration is a label attached to it — it doesn't run, and it isn't a statement. The framework reads these when the app starts and changes how it treats the thing underneath: `[HttpPost]` tells routing that *this* `Create` answers POSTs, not GETs.
>
> **It's the same idea as an HTML attribute** — extra information hung on a thing rather than instructions to carry out — except the reader is ASP.NET rather than the browser. Keep the two straight this week: `name="Cuisine"` is an HTML attribute, `[HttpPost]` is a C# one, and the notes below use "attribute" for both.
>
> You'll meet several more: `[Required]` and friends on the model in Part 3, `[ValidateAntiForgeryToken]` in Part 4, and in week 8 `[Bind]`, which is the one that bites hardest when it's wrong.

And `Views/Trucks/Create.cshtml` — **this is the whole file**, hand-written HTML:

```html
@{
    ViewData["Title"] = "Add a truck";
}

<h1>Add a truck</h1>

<form method="post">
    <label>Name <input name="Name" /></label>
    <label>Cuisine <input name="Cuisine" /></label>
    <label>City <input name="City" /></label>
    <label>Rating <input name="Rating" /></label>
    <button type="submit">Add it</button>
</form>
```

Fill it in and submit. The browser says to look at the terminal, and the terminal says:

```
── model binding built a Truck ──
   Name      Wurst Case Scenario
   Cuisine   German
   City      Appleton
   Rating    4.1   (x2 = 8.2)
   Open late False
```

`Open late` prints `False` because this form has no such box yet — the property kept its default. The checkbox turns up in Part 2, and that line is how you'll see it bind.

**A `Truck` object arrived in your action, fully populated, and you didn't write a line of code to build it.** That's the thing to point at. Everything in Part 1 is about why.

Two details in that output are doing work, and both are worth saying out loud:

- **`built a Truck`** comes from `truck.GetType().Name`. The thing that turned up isn't a bag of strings — it's an instance of the class you wrote in week 4.
- **`x2 = 8.2`** is the quiet one. **You cannot multiply a string.** The browser sent the characters `4.1`; what reached your method was a `double` you can do arithmetic on. Binding didn't just copy values across, it *converted* them.

> [!TIP]
> **The terminal is quieter than you'd expect**, because the template sets `"Microsoft.AspNetCore": "Warning"` in `appsettings.Development.json` — so there's no per-request logging to bury your output. Clearing it before a beat is free — wipe it, submit once, and the only thing on screen is the object you just built. **Note you can't type `clear`**: `dotnet watch` owns that terminal, so the shell isn't at a prompt. Clear it from the editor — **⌘K** on a Mac, or right-click the terminal → **Clear**.

> [!TIP]
> **Open the Network tab before you submit** (demo §1). Click the `Create` request, then **Payload**. There it is, the whole submission, as one string:
>
> ```
> Name=Wurst+Case+Scenario&Cuisine=German&City=Appleton&Rating=4.1
> ```
>
> That's week 3's query-string format — `key=value&key=value` — except it's riding in the body instead of the URL. Nothing exotic is happening. The form serialized itself, and the server took it apart again.

### Model binding is name-matching, and nothing else

Here is the entire rule. For each public settable property on the parameter's type, ASP.NET Core looks for an incoming value with **that name** — in the form body, the route values, then the query string. Found one? Convert the string to the property's type and set it. Didn't? Leave the property at its default and move on.

`name="Cuisine"` → `truck.Cuisine`. That's the whole contract, and it is made of strings.

> [!IMPORTANT]
> **Break it twice (demo §1), and don't clear the terminal in between** — the two failures land underneath the good one, and the comparison is the lesson.
>
> **First**, change one attribute in the view: `name="Cuisine"` becomes `name="Food"`. **Then**, without touching the code again, type `banana` into the Rating box. Submit:
>
> ```
> ── model binding built a Truck ──
>    Name      Wurst Case Scenario
>    Cuisine
>    City      Appleton
>    Rating    0   (x2 = 0)
> ```
>
> **No error. No warning. Two properties quietly wrong, for two different reasons.**
>
> - `Cuisine` is empty because binding went looking for a value called `Cuisine`, found nothing, and left the property alone. **It is name-matching, and nothing else.**
> - `Rating` is `0` because `banana` is not a number. Binding couldn't convert it, so the property kept its default — and `x2 = 0` proves it really is a number sitting there, not the text they typed.
>
> **Put the name attribute back.** This is the single most useful thing to know about forms: when a field mysteriously arrives blank or zero, the two candidates are a name that stopped matching and a value that wouldn't convert.

- **Neither failure threw, but neither went unrecorded.** Both were written down — the conversion failure especially — into a thing you'll meet by name in Part 3. It's called `ModelState`, and it has been keeping notes this whole time.
- Binding is **case-insensitive**, so `name="cuisine"` would have worked fine. It's the *spelling* that has to match, not the capitalisation.
- Nothing about this is specific to forms. The `int id` in `Details(int id)` arrived by exactly the same mechanism in week 4 — from the route instead of the body. Same binder, different source.

### Two actions, one name

Two methods called `Create`, in one controller. C# allows that — they're overloads — but routing doesn't care about overloads. It cares about **`/Trucks/Create`**, and both of them answer to it.

`[HttpPost]` is what breaks the tie: it tells routing this one is only for POSTs, which leaves the bare `Create()` to handle the GET.

> [!IMPORTANT]
> **Break it (demo §1).** Delete the `[HttpPost]` line and just *load* `/Trucks/Create` — you don't even have to submit:
>
> ```
> AmbiguousMatchException: The request matched multiple endpoints.
> ```
>
> **A 500 on the page that was working a second ago.** With no verb attribute, both actions claim the same URL for every verb, and routing refuses to guess. **Put `[HttpPost]` back, restart the app (`Ctrl+C`, then `dotnet watch`), and confirm the page loads.** The restart matters more than it looks: an attribute-only edit is one `dotnet watch` applies only *sometimes*, so a correct restore can leave the exception on screen and send you hunting a bug you have already fixed.

> [!WARNING]
> **The other half of this is the failure they'll actually hit in the lab**, and it's silent. Write only the GET `Create()` and no POST action at all: submitting the form gives you back a **blank form**, no error, nothing in the log. An action with no verb attribute answers *every* verb, so the POST reached the GET action, which returned the empty view. Nothing is broken — nothing is listening. If someone's form "does nothing when I click the button," this is it.

## Part 2: The same form, with tag helpers (35 min)

The plain form works. Now count what's wrong with it: the labels are hand-typed strings that will drift from the model, there's no `id` for a label to point at, nothing in the markup knows that `Rating` is supposed to be a number, and there is nowhere for an error message to go. Every one of those is fixed by the same three attributes.

### `asp-for` does four jobs at once

Replace one field and look at what comes out. In the view:

```html
<label asp-for="Name" class="form-label"></label>
<input asp-for="Name" class="form-control" />
```

**View Source** on the result:

```html
<label class="form-label" for="Name">Name</label>
<input class="form-control" type="text" data-val="true"
       data-val-required="The Name field is required." id="Name" name="Name" value="" />
```

One attribute, four jobs:

1. **`name="Name"`** — the binding contract from Part 1, now generated from the property instead of typed by hand. It cannot drift, because there's only one spelling of it.
2. **`id="Name"`**, and the label's matching `for="Name"` — so clicking the label focuses the box.
3. **The label's text**, read off the model.
4. **`type="text"`**, chosen from the property's C# type — and it isn't always text. `IsOpenLate` is a `bool` and comes out a **checkbox**; an `int` comes out `type="number"`.

Two attributes in there are **not** one of the four, and they turn up with no annotation on the model at all: `data-val="true"` and `data-val-required`. A non-nullable `string` has nowhere to put "empty", so ASP.NET treats it as required whether you asked for that or not — and writes the message itself. Part 3 is where that message becomes one of yours.

`Rating` is worth a second look, because it's a `double` and it stays a plain text box — the number input is for integral types. What it gains instead is this:

```html
<input ... type="text" data-val="true" data-val-number="The field Rating must be a number."
       data-val-required="The Rating field is required." id="Rating" name="Rating" />
```

That's the conversion rule from Part 1 — the one that quietly turned `banana` into `0` — written into the HTML. Nobody is reading it yet. Part 4 is where something starts to.

> [!NOTE]
> **`asp-for` takes a property name, not a string to print.** `asp-for="Name"` — no `@`, no quotes around a value, no `Model.`. It's an expression the tag helper reads at compile time, which is also why a typo here is a *build* error rather than a silently empty box. That's a real improvement on the plain HTML version, and worth saying out loud.

### The whole form, field by field

**This is the whole of `Views/Trucks/Create.cshtml`** after the rewrite:

```html
@model Truck
@{
    ViewData["Title"] = "Add a truck";
}

<h1>Add a truck</h1>

<form asp-action="Create" method="post" class="col-md-6">
    <div asp-validation-summary="ModelOnly" class="text-danger"></div>

    <div class="mb-3">
        <label asp-for="Name" class="form-label"></label>
        <input asp-for="Name" class="form-control" />
        <span asp-validation-for="Name" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Cuisine" class="form-label"></label>
        <input asp-for="Cuisine" class="form-control" />
        <span asp-validation-for="Cuisine" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="City" class="form-label"></label>
        <input asp-for="City" class="form-control" />
        <span asp-validation-for="City" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Rating" class="form-label"></label>
        <input asp-for="Rating" class="form-control" />
        <span asp-validation-for="Rating" class="text-danger"></span>
    </div>

    <div class="form-check mb-3">
        <input asp-for="IsOpenLate" class="form-check-input" />
        <label asp-for="IsOpenLate" class="form-check-label"></label>
    </div>

    <button type="submit" class="btn btn-primary">Add it</button>
    <a asp-action="Index" class="btn btn-link">Cancel</a>
</form>
```

Three things worth naming while it's on screen:

- **`@model Truck` at the top.** The form is strongly typed, exactly like the index and details views — that's what lets `asp-for="Name"` be checked at build time.
- **`asp-for` on a `bool` renders a checkbox**, again from the C# type. It also emits a hidden companion field — **not next to the checkbox, but at the bottom of the form, just inside `</form>`, so scroll down for it in View Source** — which is the fix for an old HTML wart: an unchecked box sends *nothing at all*, so without the hidden field a "no" would be indistinguishable from a missing field. Razor sends `false` alongside, and the checkbox overrides it with `true` when ticked. Show it in View Source; it surprises people who've fought this before. Submit the form with the box ticked and the `Open late` line in the terminal reads `True` — that's the one field the hand-written form couldn't produce.
- **The `<span>`s and the `<div>` are empty**, and they render as empty. They're the sockets Part 3 plugs error messages into.

### Getting to the form

A form nobody can reach is a form nobody uses, and so far the only way to `/Trucks/Create` has been typing it into the address bar. Put a button at the top of the list page — in `Views/Trucks/Index.cshtml`, just under the count:

```html
<a asp-action="Create" class="btn btn-primary mb-4">＋ Add a truck</a>
```

That's the same `asp-action` you just used on the `<form>`, and the same one the navbar has been using since week 4 — on an `<a>` it writes the `href` instead of the `action`. **No `asp-controller` needed:** you're in a view belonging to `TrucksController`, so it fills in the controller you're already in. Add one and the rendered HTML is plain old `<a class="btn btn-primary mb-4" href="/Trucks/Create">`.

Build the link before the action exists and it 404s — which is worth doing once on purpose, because it's the clearest demonstration that `asp-action` generates a URL from a *route*, not from a file that has to be sitting there.

### The hidden field you didn't write

Scroll to the bottom of View Source, just inside `</form>` — the same place the checkbox's hidden companion turned up. There are two hidden fields down there, and the token comes first:

```html
<input name="__RequestVerificationToken" type="hidden" value="CfDJ8L5JyJv3Gm..." /><input name="IsOpenLate" type="hidden" value="false" />
```

Nobody typed that. Razor adds it to **every** `<form method="post">` it renders — including the hand-written one from Part 1, which is worth pointing out, because it means this isn't something `asp-action` bought you.

What it's for, in one paragraph: without it, any other website could put a hidden form on their page that posts to *your* URL, and a logged-in visitor's browser would send it along with their cookies. The token is a value your server planted in this page and in a cookie; a form from somewhere else can't produce a matching pair. You opt into the check by putting `[ValidateAntiForgeryToken]` on the POST action:

```csharp
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult Create(Truck truck)
```

- The token is already in the page whether or not you check it. The attribute is what makes the server *look*.
- Its failure mode is memorable: a **400**, before your action runs, with nothing of yours in the stack trace. If a form starts 400ing the day someone rewrites it by hand with `asp-antiforgery="false"`, this is why.
- ⚠️ **Restart after adding this attribute — don't trust hot reload with it.** MVC builds each action's filter list at startup, and an attribute-only edit rebuilds it only sometimes; `dotnet watch` prints *Hot reload succeeded* either way. Press `Ctrl+R` in the watch terminal. This only bites you when you try to *test* the attribute and it appears to do nothing — which is exactly what the next section has you do.

### Seeing it yourself

You can't demonstrate this from the browser — your browser is on your own site, so Razor keeps handing it a valid token. You need a request from outside. Run the app, then from a **second** terminal (`dotnet watch` owns the first one):

```bash
curl -i -X POST http://localhost:5164/Trucks/Create \
  -d "Name=Totally Legit&Cuisine=Fake&City=Nowhere&Rating=5"
```

Check the port against what `dotnet watch` printed. **Without** the attribute you get `HTTP/1.1 200 OK`, and a fully-built `Truck` prints in the other terminal — a request that never loaded your page just reached your action. **With** the attribute (and after a restart) the same command gets:

```
HTTP/1.1 400 Bad Request
Content-Length: 0
```

and nothing at all appears in the other terminal. That absence is the real result: the action never ran. Note `Content-Length: 0` — an antiforgery rejection has an empty body and writes nothing to the log, so in a browser it looks like a blank white page. Worth recognizing once.

## Part 3: Rules that live on the model (40 min)

Submit the form with no name, no city, and a rating of 9000. The terminal reports it quite happily:

```
── model binding built a Truck ──
   Name
   Cuisine   German
   City
   Rating    9000   (x2 = 18000)
```

A nameless truck in no city with a rating of nine thousand, and **nothing in the app has an opinion about any of it.** Somebody has to say what a valid truck is. The question is *where* that lives.

Not in the view: the view is one of several places a `Truck` can be created, and rules pasted into markup can't be reused. Not in the controller either, or every action grows the same block of `if` statements. It belongs on the **model** — one description of what a valid `Truck` is, that the form, the controller and (in week 7) the database can all read.

### Data annotations

**This is the whole of `Models/Truck.cs`** afterwards. The `using` at the top is new and required:

```csharp
using System.ComponentModel.DataAnnotations;

namespace Curbside.Models;

public class Truck
{
    // Not on the form — the controller assigns it. Nothing to validate.
    public int Id { get; set; }

    [Required(ErrorMessage = "Every truck needs a name.")]
    [StringLength(50, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [Required]
    [StringLength(30)]
    public string Cuisine { get; set; } = "";

    [Required]
    public string City { get; set; } = "";

    [Range(1, 5, ErrorMessage = "Ratings run from {1} to {2}.")]
    public double Rating { get; set; }

    [Display(Name = "Open late?")]
    public bool IsOpenLate { get; set; }
}
```

The ones worth knowing tonight:

| Attribute | What it says |
|---|---|
| `[Required]` | must be present and not blank |
| `[StringLength(50, MinimumLength = 2)]` | between 2 and 50 characters |
| `[Range(1, 5)]` | a number between 1 and 5 — works on `int`, `double`, `decimal` |
| `[Display(Name = "Open late?")]` | what the **label** says — English, not a property name |
| `[DataType(DataType.Date)]` | render a date picker rather than a text box |

- **`ErrorMessage` is optional and worth setting.** The default for `Name` is *"The Name field is required."* — accurate, and written by a compiler. `{1}` and `{2}` in a `[Range]` message interpolate the bounds, so the message can't drift from the rule.
- **`[Display]` changes the label everywhere**, because the label was reading the model in the first place. Change it once, and the form, the errors and any future scaffolded page all say the same thing.
- Refresh the form after adding these and **View Source one input**, next to the same input in Part 2: `maxlength="50"` and `data-val-length` are new, and `data-val-required` has stopped saying *"The Name field is required."* and started saying yours. Your rules are now *in the HTML*, in your words. Don't explain them yet — that's Part 4, and it's better as a callback.

> [!NOTE]
> **`Rating` has no `[Required]`, but leave the box empty and it complains anyway.** A non-nullable value type like `double` or `int` can't hold "nothing", so the framework treats it as required automatically. This confuses people, so name it before it bites: **if you want a genuinely optional number, the property has to be `double?`.** That's the actionable half; the rest is just how C# types work.

### ModelState: the notes the binder was already taking

Back in Part 1, a `double` that got `banana` quietly stayed `0`. Here's where that went.

While model binding runs, it keeps a record of every value it saw, every conversion it couldn't do, and — once you add annotations — every rule that was broken. That record is `ModelState`, and it is sitting on your controller already:

```csharp
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult Create(Truck truck)
{
    if (!ModelState.IsValid)
    {
        return View(truck);          // back to the form, with their input and the errors
    }

    truck.Id = TruckData.All.Max(t => t.Id) + 1;
    TruckData.All.Add(truck);

    return RedirectToAction(nameof(Index));
}
```

Read that top to bottom:

- **`ModelState.IsValid`** is a question, not a command. Validation *already ran* — during binding, before your first line executed. You're reading a verdict.
- **`return View(truck)`** hands the form back with everything they typed still in it. One bad field must not cost someone four good ones. This is the difference between an app people tolerate and one they don't.
- **The guard comes first, and it returns.** Everything below it can assume a good truck.
- **`Max(t => t.Id) + 1`** is the crudest possible id assignment and it is fine tonight, because in week 7 the database takes the job over.

> [!IMPORTANT]
> **Break it (demo §3).** Comment out the whole `if (!ModelState.IsValid)` block. Submit a truck with a **blank name and a rating of 9000**. It goes straight into the list, and there it is on `/Trucks` — a nameless card rated nine thousand. Then say it plainly: *the annotations did their job; they recorded the problem and nobody read the record.* **Attributes describe. The guard decides.** Restore the block.

### Showing the errors

With the guard back in, submit the bad truck again. The form returns, their input intact, and:

- next to Name, in red: **Every truck needs a name.**
- next to Rating: **Ratings run from 1 to 5.**

Those came out of the empty `<span asp-validation-for="Name">` sockets from Part 2, filled in from `ModelState` on the way through.

- **`asp-validation-for="Name"`** shows the errors for one property.
- **`asp-validation-summary="ModelOnly"`** shows only errors that belong to the *form as a whole* rather than to a field — the ones you add yourself with `ModelState.AddModelError("", "...")`. Switch it to `"All"` and every field error is listed at the top *as well as* beside its box; that's a duplicate, and generally worse. `ModelOnly` is the default for a reason.
- View Source on a failing field: the input gained `class="input-validation-error"`, which is why it's outlined in red. Bootswatch styles it; you wrote no CSS.

### Redirect, don't render

The last line of the happy path is `RedirectToAction(nameof(Index))`, and it's the part that looks like an extra step. It isn't.

> [!IMPORTANT]
> **Break it (demo §3).** Change the last line to `return View("Index", TruckData.All);` — which *works*, and shows the list. Now the URL still reads **`/Trucks/Create`**, and a page that came back from a POST is still a POST as far as the browser is concerned. **Hit refresh.** The browser asks *"Confirm Form Resubmission?"*, you say yes, and there are now **two identical trucks** in the list.
>
> Put `RedirectToAction(nameof(Index))` back, submit another truck, and refresh: nothing happens, because the page you're looking at arrived by GET. **That's the whole reason.** The pattern has a name worth knowing — **POST-Redirect-GET** — and it's why every form you've ever used bounces you to a different URL after you submit.

- `nameof(Index)` over `"Index"`: renaming the action becomes a compile error rather than a 404. Small, free, do it.
- A redirect is a **302** with a `Location` header — the browser goes and does a fresh GET. Show it in the Network tab: two requests, POST then GET.

## Part 4: The same rules, in the browser (20 min)

Everything so far costs a round trip. Type a blank name, click, wait, page comes back red. It works, and it feels slow.

### The partial week 5 promised

`Views/Shared/_ValidationScriptsPartial.cshtml` has been sitting in your project since week 3, unused. You were told twice in week 5 to look at it. **This is the whole file:**

```html
<script src="~/lib/jquery-validation/dist/jquery.validate.min.js"></script>
<script src="~/lib/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.min.js"></script>
```

A partial, containing scripts, meant to be rendered into a section. Both of last week's ideas, doing one job. At the bottom of `Create.cshtml`:

```html
@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

Refresh, submit the empty form, and the errors appear **instantly** — no round trip, no page reload. Nothing about your C# changed.

How it works, and it's the payoff for the `data-val` attributes from Part 3: those two scripts scan the page for `data-val-*` attributes and enforce whatever they find, in the browser. **Your annotations were compiled into HTML, and the browser is now reading the same rules the server has.** One source of truth — `Models/Truck.cs` — enforced in two places.

- **It has to be in a `@section Scripts` block.** Dropped into the middle of the view it loads *before* jQuery, which the layout puts at the bottom, and it fails with `$ is not defined`. Week 5's section wasn't a formality.
- Add it to the details or index page too and it does nothing — no `data-val` attributes there to find.

### Client-side validation is a courtesy, not a gate

> [!IMPORTANT]
> **Client-side for convenience. Server-side for security.** You need both, and one does not stand in for the other.
>
> The browser copy is a courtesy: instant red text, no round trip, no waiting. It's most of what your users will ever notice, and it enforces **nothing**. **Anything in the browser is a suggestion** — it's someone else's computer, and they can edit it, disable JavaScript, or skip your page entirely and post to your URL from a terminal. You already saw that last one work, back in [Seeing it yourself](#seeing-it-yourself): a request reached the action with no browser and no JavaScript involved at all. Nothing the browser checks was ever in its way.
>
> **Server-side validation is the one that's actually enforcing anything**, and it is not optional.

That's the sentence to take away: *the browser copy is for speed; the server copy is for real.* It's also why the order tonight was server first, browser second — the reverse teaches people to trust the wrong one.

### Turning the browser copy off (if you want to see it)

Optional, and fiddlier than it looks. The obvious moves both fail:

- **Adding `novalidate` to the `<form>` does nothing** — and it's already there. jQuery Validate stamps `novalidate="novalidate"` on any form it takes over, so you'll spot it in the Elements panel and think you've found the switch. All it governs is the browser's *own* built-in validation, which these tag helpers never asked for: `asp-for` emits `data-val-*` attributes, not `required`. The browser had nothing to enforce in the first place.
- **Deleting `data-val="true"` does nothing either** — unobtrusive reads the rules once when the page loads and never looks at the attribute again.

The only real switch is **disabling JavaScript** — dev tools, `⌘⇧P` / `Ctrl+Shift+P`, *Disable JavaScript*, then reload. Submit the empty form and it goes to the server, which refuses it and hands the form back with the same messages. Turn JavaScript back on afterwards.

Be warned that it's a weak demonstration: what you're looking for is a full page round trip, and on a fast connection that's invisible — the page comes back looking almost identical to the client-side version. **Keep the Network panel open** and watch the POST appear, which is the only part you can actually see. The `curl` from Part 2 makes the same point far more plainly.

## Part 5: Where the truck actually went (10 min)

Add a truck. It's on `/Trucks`. Now stop the app in the terminal (`Ctrl+C`), start it again, and reload the page.

**It's gone.**

`TruckData.All` is a `static List<Truck>` — a variable in a running program. It lives in memory, so it lives exactly as long as the process does. Everything tonight is real: the form, the binding, the validation, the redirect. The *storage* is a placeholder, and it always has been; you just couldn't tell, because until tonight nothing ever changed.

- On Azure this is worse than on your laptop, and worth warning them about before the homework: a free-tier app **goes to sleep**, and wakes up with the six items you hard-coded. Anything a visitor added is gone. If they submit their homework and later find their test entries missing, nothing is broken.
- **This is week 7's entire motivation**, and it's the best hook the course has, because they'll have just felt it. Next week `TruckData.cs` is deleted and `TruckData.All` becomes a SQL Server table. Point at the controller while you say it: `ModelState.IsValid`, the guard, the redirect — all of that stays. **One line changes: where the list comes from.**

## Wrap-up (10 min)

The round trip, end to end:

```
GET  /Trucks/Create  →  Create()          →  empty form
                                               ↓  user types, submits
POST /Trucks/Create  →  model binding     →  Truck object      (by name attribute)
                     →  validation        →  ModelState        (from the annotations)
                     →  invalid?  View(truck)  →  same form, their input, red messages
                     →  valid?    Add + RedirectToAction  →  302  →  GET /Trucks
```

- **Tonight:** a form posts to an action; binding fills an object by name; annotations on the model say what "valid" means; `ModelState.IsValid` is the guard that decides; a redirect stops refresh from double-posting; and one partial in a section puts the same rules in the browser.
- **Homework:** your own app gets a Create form for your own item — same five moves, your model.
- **Next week:** the list stops being a variable. `TruckData.All` becomes a table in SQL Server, and almost none of tonight's controller code changes.

## Appendix: Troubleshooting

**Clicking Submit does nothing — the same blank form comes back**
- There's no `[HttpPost]` action to receive it, so the POST matched your GET `Create()`, which returned the empty view. An action with no verb attribute answers every verb. Add the second action.

**`AmbiguousMatchException: The request matched multiple endpoints`**
- Two actions with the same name and no `[HttpPost]` on the second one, so both claim the URL. Add `[HttpPost]` to the one that takes a parameter.
- **Still throwing on a file that now looks correct? Restart — `Ctrl+R` in the watch terminal.** MVC works out each action's verb at startup, and `dotnet watch` applies an attribute-only edit only *sometimes*, printing `Hot reload succeeded` either way. This is the one that sends people rewriting code that was already right.

**One field always arrives empty / null, and no error anywhere**
- The `name` attribute and the property name don't match. Check the rendered HTML, not the Razor — and prefer `asp-for`, which can't get this wrong.

**Everything arrives empty**
- The `<form>` has no `method="post"`, so the browser sent a GET with the values in the query string. Or the inputs are outside the `<form>` element.

**A 400 with no exception and nothing in your code**
- Antiforgery. The action has `[ValidateAntiForgeryToken]` but the form didn't send a token — usually a hand-written `<form>` with `asp-antiforgery="false"`, or markup that isn't inside the `<form>` at all.

**`ModelState.IsValid` is false and I can't see why**
- Temporarily switch your summary to `<div asp-validation-summary="All">`, which lists **every** error including the per-field ones — no tooling, one word changed, and you can put it back after. The usual answer is a non-nullable `int` or `double` that got a blank box. *(If you're comfortable with the debugger, a breakpoint on the guard and a look at `ModelState` shows the same thing.)*

**A number field says it's required and I never wrote `[Required]`**
- Non-nullable value types are implicitly required — an `int` has nowhere to put "empty". Make it `int?` if it's genuinely optional.

**Validation messages never appear, even though the guard is working**
- The `<span asp-validation-for="...">` elements are missing, or they name a property that doesn't exist. They render empty until there's something to say, so an absent one looks exactly like a passing one.

**Client-side validation doesn't fire — every check needs a round trip**
- `_ValidationScriptsPartial` isn't rendered on that page, or it's rendered outside `@section Scripts`. Check the console for `$ is not defined`, which means it loaded before jQuery.

**The form submits fine but the new item isn't in the list**
- The action validated it and then never added it, or added it without an `Id`, so its card links to `/Details/0`. Check `Max(t => t.Id) + 1` runs *before* the `Add`.

**Refreshing after a submit adds a second copy**
- The action returned a `View(...)` instead of redirecting. `return RedirectToAction(nameof(Index));`

**Everything I add disappears when the app restarts**
- Working as designed — `static List<T>` lives in memory. Week 7.
