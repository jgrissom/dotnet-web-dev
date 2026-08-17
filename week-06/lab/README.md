# Week 6 Lab — The Registry Takes Reports 📝

Six creatures, filed by whoever wrote the seed data. Tonight the Registry starts accepting reports from *visitors* — which means a form, a second `Create` action, rules on the model, and a guard that refuses a report from someone who typed the year 99999.

**Time:** ~50 minutes in class — **in-class target: checks 1–5 green.** Check 6 is a three-line paste; do it if you get there, otherwise it rolls into the homework.

## Setup

> [!IMPORTANT]
> **The app arrives with last week's shell already on it** — branded layout, card partial, Bootswatch theme, the lot. If your own week-5 lab never got finished, you are **not** behind tonight. Check 1 passes before you touch anything, and it proves it.
>
> Tonight you work in the model, the controller, one new view, and one line of `Views/Cryptids/Index.cshtml`. Nothing in `Views/Shared/` gets touched at all.

**1. Update the starters clone.** Open `dotnet-web` in VS Code, then `` Ctrl+` `` for a terminal standing in it:

```bash
git -C dotnet-web-starters pull
```

`-C` tells git to work *in that folder* without moving your terminal into it — you stay in `dotnet-web`, which is where every other command belongs.

**2. Copy the `week-06` folder into `dotnet-web`** — next to the clone, never inside it — **and rename the copy.** `CryptidForms` works. (Copy it *out*; never work inside the clone, or next week's `git pull` will fight you.)

You should end up with exactly this:

```
CryptidForms/               ← in `dotnet-web`, the folder you copied and renamed
├─ Cryptids.Web/           ← your app — ALL your work happens in here
└─ Cryptids.Checks/        ← the checks — read-only, never edit
```

**3. Open `CryptidForms` in VS Code** — the folder that *contains* both project folders, not one of the projects themselves.

**4. Open a second terminal** — the `+` in the terminal panel, or `` Ctrl+Shift+` ``. **You need two:** `dotnet watch` keeps running and rebuilds on every save, which is why you can't type in it.

| Terminal | Where it stands | What runs in it |
|---|---|---|
| 1 | inside `Cryptids.Web` — `cd Cryptids.Web` | `dotnet watch` — start it, then leave it alone |
| 2 | `CryptidForms`, the folder holding **both** projects | `dotnet test Cryptids.Checks`, after every task |

**5. In terminal 2:**

```bash
dotnet test Cryptids.Checks
```

**1 / 6 passing.** Check 1 is the app you were given, already working. The other five are the form.

> [!WARNING]
> Seeing `error MSB1009: Project file does not exist`? You're one folder too deep — probably inside `Cryptids.Web`. Run `cd ..` and try again; the command goes in the folder that holds *both* projects.

> [!TIP]
> Keep `/Cryptids` open in a browser tab — every task tonight ends with you filling a form in and watching what the app does about it.

## Where tonight's work happens

| File | What you do to it |
|---|---|
| `Cryptids.Web/Models/Cryptid.cs` | add the rules — task 2 |
| `Cryptids.Web/Views/Cryptids/Create.cshtml` | **new file** — the form — task 3 |
| `Cryptids.Web/Controllers/CryptidsController.cs` | two new actions — tasks 3 and 4 |
| `Cryptids.Web/Views/Cryptids/Index.cshtml` | one link to the form — task 3 |

> [!NOTE]
> **The checks fill your form in and submit it, the same way a browser does** — once with a good report and once with a bad one. That means check 4 leaves a creature called *The Beast of Bray Road* in your registry. It's supposed to; it's how the check knows the form works. It vanishes the next time the app restarts, and [there's a reason for that](../lecture-notes.md#part-5-where-the-truck-actually-went-10-min).

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 2 | `TheModelCarriesItsRules` | Add [data annotations](../lecture-notes.md#data-annotations) to `Models/Cryptid.cs`: `Name` needs `[Required]` **and** `[StringLength(60, MinimumLength = 2)]`, `Region` needs `[Required]`, `FirstSighting` needs `[Range(500, 2026)]` **and** `[Display(Name = "First sighted")]`, `Sightings` needs `[Range(0, 100000)]`. Don't forget `using System.ComponentModel.DataAnnotations;` at the top. **[Task 2 in full ↓](#task-2-in-full)** |
| 3 | `TheFormPageExists` | A `Create()` action, a `Views/Cryptids/Create.cshtml` [built with tag helpers](../lecture-notes.md#the-whole-form-field-by-field), and a link to it from the top of `Views/Cryptids/Index.cshtml` — the list page, **not** `Views/Home/Index.cshtml`. **[Task 3 in full ↓](#task-3-in-full)** has every line to paste. |
| 4 | `AGoodReportGetsFiled` | A **second** `Create` action, marked `[HttpPost]`, that takes a `Cryptid`, gives it an id, adds it to `CryptidData.All`, and [redirects to the index](../lecture-notes.md#redirect-dont-render). **[Task 4 in full ↓](#task-4-in-full)** |
| 5 | `ABadReportIsRefused` | Guard that POST action with [`if (!ModelState.IsValid)`](../lecture-notes.md#modelstate-the-notes-the-binder-was-already-taking) and hand the form back instead of filing it. The error messages need somewhere to land — task 3's markup already has the sockets. **[Task 5 in full ↓](#task-5-in-full)** |
| 6 | `ValidationRunsInTheBrowserToo` | Render `_ValidationScriptsPartial` inside a [`@section Scripts`](../../week-05/lecture-notes.md#the-slot-that-was-always-there) block at the bottom of `Create.cshtml`, so the same rules run in the browser. **[Task 6 in full ↓](#task-6-in-full)** |

> [!IMPORTANT]
> **The exact text matters** for check 2: `[Display(Name = "First sighted")]`, spelled that way. Everything else about your form is yours; that string is how an automated check knows the label came from the model instead of being typed into the markup.

### Task 2 in full

**Check:** `Check2_TheModelCarriesItsRules`

**This is the whole of `Models/Cryptid.cs`** afterwards. Type it rather than pasting — the four attributes in here (`[Required]`, `[StringLength]`, `[Range]`, `[Display]`) are the week's entire vocabulary:

```csharp
using System.ComponentModel.DataAnnotations;

namespace Cryptids.Web.Models;

public class Cryptid
{
    // Not on the form — the controller assigns it. Nothing to validate.
    public int Id { get; set; }

    [Required(ErrorMessage = "Every creature needs a name.")]
    [StringLength(60, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [Required(ErrorMessage = "Where was it seen?")]
    [StringLength(80)]
    public string Region { get; set; } = "";

    [Display(Name = "First sighted")]
    [Range(500, 2026, ErrorMessage = "First sighted has to be a year between {1} and {2}.")]
    public int FirstSighting { get; set; }

    [Display(Name = "Reports on file")]
    [Range(0, 100000)]
    public int Sightings { get; set; }

    [Display(Name = "Already debunked?")]
    public bool IsDebunked { get; set; }
}
```

`ErrorMessage` is optional — leave it off and you get *"The Name field is required."*, which is correct and sounds like a compiler wrote it. The `{1}` and `{2}` in the `[Range]` message fill themselves in from the numbers, so the message can't drift from the rule.

> [!TIP]
> **Check 2 passes on its own, before any form exists.** Run `dotnet test Cryptids.Checks` now — 2/6. It reads the attributes straight off the class, which is the point: the rules are a property of the *model*, not of any page.

### Task 3 in full

**Check:** `Check3_TheFormPageExists`

**First, the action.** Inside `CryptidsController`, below `Details`:

```csharp
// GET /Cryptids/Create — hand the browser an empty form
public IActionResult Create()
{
    return View();
}
```

*(No model passed. That's deliberate — the number boxes come up blank instead of pre-filled with 0.)*

**Then create `Views/Cryptids/Create.cshtml`.** This is the whole file — paste it; tonight's lesson is what the form *does*, not the Bootstrap around it:

```html
@model Cryptid
@{
    ViewData["Title"] = "File a report";
}

<h1>File a field report 👣</h1>
<p class="text-muted">Six creatures on file. Make it seven.</p>

<form asp-action="Create" method="post" class="col-md-6">
    <div asp-validation-summary="ModelOnly" class="text-danger"></div>

    <div class="mb-3">
        <label asp-for="Name" class="form-label"></label>
        <input asp-for="Name" class="form-control" />
        <span asp-validation-for="Name" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Region" class="form-label"></label>
        <input asp-for="Region" class="form-control" />
        <span asp-validation-for="Region" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="FirstSighting" class="form-label"></label>
        <input asp-for="FirstSighting" class="form-control" />
        <span asp-validation-for="FirstSighting" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Sightings" class="form-label"></label>
        <input asp-for="Sightings" class="form-control" />
        <span asp-validation-for="Sightings" class="text-danger"></span>
    </div>

    <div class="form-check mb-3">
        <input asp-for="IsDebunked" class="form-check-input" />
        <label asp-for="IsDebunked" class="form-check-label"></label>
    </div>

    <button type="submit" class="btn btn-primary">File it</button>
    <a asp-action="Index" class="btn btn-link">Cancel</a>
</form>
```

**Then the link.** At the top of `Views/Cryptids/Index.cshtml`, under the `<p class="text-muted">` line:

```html
<a asp-action="Create" class="btn btn-primary mb-4">＋ File a report</a>
```

> [!IMPORTANT]
> **Load `/Cryptids/Create` and View Source before you move on.** Every `<label>` has text you never typed, every `<input>` has a `name` matching a property, the year box is a `type="number"`, and there's a hidden `__RequestVerificationToken` at the bottom that you definitely didn't write. Your rules from task 2 are in there too, as `data-val-*` attributes. [What `asp-for` is doing](../lecture-notes.md#asp-for-does-four-jobs-at-once).

### Task 4 in full

**Check:** `Check4_AGoodReportGetsFiled`

A **second** action, same name, in the same controller. `[HttpPost]` is what stops the two of them fighting over the same URL:

```csharp
// POST /Cryptids/Create — the filled-in form arrives back here
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult Create(Cryptid cryptid)
{
    cryptid.Id = CryptidData.All.Max(c => c.Id) + 1;
    CryptidData.All.Add(cryptid);

    return RedirectToAction(nameof(Index));
}
```

File a report and watch it land on `/Cryptids` as a seventh card. Here's one that satisfies every rule you wrote in task 2, if you'd rather not invent one:

| Field | Value |
|---|---|
| Name | `Skunk Ape` |
| Region | `Everglades, Florida` |
| First sighted | `1974` |
| Reports on file | `156` |
| Already debunked? | leave unchecked |

Then notice what the action *also* accepts right now — a blank name, a first sighting in the year 99999 — and that's task 5.

> [!TIP]
> **Give it the id before you add it.** Without that line the creature goes in with `Id` 0, its card links to `/Cryptids/Details/0`, and the moment a second report arrives they both answer to the same URL. The check catches this one specifically.

> [!NOTE]
> **`RedirectToAction`, not `return View(...)`.** A page returned from a POST is still a POST as far as the browser is concerned — refresh it and it files the report a second time. [Why every form bounces you to a different URL](../lecture-notes.md#redirect-dont-render).

### Task 5 in full

**Check:** `Check5_ABadReportIsRefused`

The guard goes at the very top of the POST action, above the id assignment:

```csharp
if (!ModelState.IsValid)
{
    return View(cryptid);
}
```

Now file a report with **no name and a first sighting of 99999**. The form comes back with your input still in it, and red messages beside the two bad fields — the ones you wrote in task 2.

- **`ModelState.IsValid` is a question, not a command.** Validation already ran, during model binding, before your first line executed. You're reading a verdict.
- **`return View(cryptid)`**, not `return View()`. One bad field shouldn't cost someone the four good ones they typed.
- The messages appear in the empty `<span asp-validation-for="...">` sockets that were already in task 3's markup. [Where the errors come from](../lecture-notes.md#showing-the-errors).

### Task 6 in full

**Check:** `Check6_ValidationRunsInTheBrowserToo`

At the very bottom of `Create.cshtml`, below the closing `</form>`:

```html
@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

Submit the empty form now: the errors appear **instantly**, with no page reload. Nothing in your C# changed — those two scripts read the `data-val-*` attributes your annotations put in the HTML and enforce the same rules in the browser.

> [!IMPORTANT]
> **It has to be inside the section.** Pasted into the middle of the view, the scripts load before jQuery — which the layout puts at the bottom — and you get `$ is not defined` in the console and no validation at all. Check 6 looks at *where* the script lands, not just that it's there.

> [!WARNING]
> **This does not replace task 5.** Turn JavaScript off, or edit the form in dev tools, and the browser will happily submit garbage — [the server check is the one that's actually enforcing anything](../lecture-notes.md#client-side-validation-is-a-courtesy-not-a-gate). Client-side validation is there so honest people get instant feedback.

## Rules

> [!IMPORTANT]
> - **Never edit `Cryptids.Checks`** — it's the grading contract. All work happens in `Cryptids.Web`.
> - Don't remove the `public partial class Program { }` line at the bottom of `Program.cs` — the checks need it to see your app.
> - Don't rename the `Cryptid` properties. The checks read them by name.

## 🆘 Stuck?

- **Clicking "File it" does nothing — the same blank form comes back** — there's no `[HttpPost]` action to receive it, so the POST landed on your GET `Create()`. An action with no verb attribute answers *every* verb. That's task 4.
- **`AmbiguousMatchException: The request matched multiple endpoints`** — two actions called `Create` and neither says `[HttpPost]`. Add it to the one that takes a `Cryptid`.
- **A 400, with nothing of yours in the error** — antiforgery. Your action has `[ValidateAntiForgeryToken]` but the form isn't sending a token; check the `<form>` tag is the one from task 3.
- **A field always arrives empty** — the input's `name` and the property name don't match. `asp-for` can't get this wrong, so check you're using it.
- **`FirstSighting` says it's required and I never wrote `[Required]`** — a non-nullable `int` has nowhere to put "empty", so it's implicitly required. Working as intended.
- **Validation messages never show up** — the `<span asp-validation-for="...">` elements are missing, or `ModelState.IsValid` isn't being checked, or the action is returning `View()` with no argument.
- **The errors only appear after a page reload** — that's task 6; the browser-side scripts aren't loaded yet.
- **`$ is not defined` in the console** — the validation partial is outside `@section Scripts`, so it loaded before jQuery.
- **Everything I add disappears when I restart the app** — working as designed. `CryptidData.All` is a `static List<T>`; it lives in memory. That's week 7.
- The [troubleshooting appendix](../lecture-notes.md#appendix-troubleshooting) covers the rest.

## 🚀 Done early?

- **Make the summary earn its place.** Add a rule the annotations can't express — reject a creature whose name is already in the registry — with `ModelState.AddModelError("", "We already have one of those.")` before the `IsValid` check. That's the kind of error `asp-validation-summary="ModelOnly"` exists for, and right now your summary never shows anything.
- **Add a `Notes` property** and render it with `<textarea asp-for="Notes" class="form-control"></textarea>` instead of an `<input>` — an attribute isn't the only thing that decides what a field looks like, and `asp-for` works on more tags than one. *(Adding `[DataType(DataType.MultilineText)]` on its own doesn't do it: an `<input>` stays an input no matter what the model says.)*
- **Make `Sightings` optional.** Change it to `int?` and watch the implicit-required behaviour disappear. Then work out what breaks on the details page and fix it.
- **Send them somewhere better.** `RedirectToAction(nameof(Details), new { id = cryptid.Id })` drops the visitor on the page for the creature they just filed, rather than back at the list.
