# Week 9 Lab — The Registry Gets a Sightings Log 👁️

The Registry has a column that says **47 reports on file** for The Hodag. Somebody typed 47. There are no reports — there is a number, and it has never been connected to anything.

Tonight that number becomes the reports themselves: who saw it, where, when, and what they saw. Week 2's `report.html` was a form with nowhere to send anything. Tonight it gets somewhere to go.

**Time:** ~55 minutes in class — **in-class target: checks 1–5 green.** Check 6 is the delete warning; it's the same move your homework needs, and it rolls into it if the clock wins.

## Setup

> [!IMPORTANT]
> **The app arrives as week 8 finished it** — full CRUD, the field-guide plates, three migrations. If your own week-8 lab never got finished, you are **not** behind tonight. Check 1 passes before you touch anything.

**1. Update the starters clone.** Open `dotnet-web` in VS Code, then `` Ctrl+` `` for a terminal standing in it:

```bash
git -C dotnet-web-starters pull
```

`-C` tells git to work *in that folder* without moving your terminal into it — you stay in `dotnet-web`, which is where every other command belongs.

**2. Copy the `week-09` folder out of `dotnet-web-starters` and into `dotnet-web`** — next to the clone, never inside it — **and rename the copy.** `CryptidsRelated` works. (Never work inside the clone.)

```
CryptidsRelated/           ← in `dotnet-web`, the folder you copied and renamed
├─ Cryptids.Web/          ← your app — ALL your work happens in here
└─ Cryptids.Checks/       ← the checks — read-only, never edit
```

**3. Open `CryptidsRelated` in VS Code** — the folder that *contains* both project folders.

**4. Open two more terminals** — the `+` in the terminal panel, or `` Ctrl+Shift+` ``. **You need three tonight**, and `dotnet watch` is why: it stays running all lab and you can't type in it.

| Terminal | Where it stands | What runs in it |
|---|---|---|
| 1 | `CryptidsRelated`, the folder holding **both** projects | `dotnet watch --project Cryptids.Web` — **started in task 1**, then left alone |
| 2 | `Cryptids.Web` | `dotnet ef` — migrations and database updates |
| 3 | `CryptidsRelated` | `dotnet test Cryptids.Checks` — run it after every task |

**5. Set your connection string** (frozen lab PC? this is the one that gets wiped). From terminal 2, standing in `Cryptids.Web`:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=...;User ID=...;Password=...;TrustServerCertificate=True"
```

The `<UserSecretsId>` ships in the `.csproj`, so `set` on its own is enough — there is no `init` step.

> [!WARNING]
> **Task 1 starts by dropping the lab database, and you need to know why.** This starter ships its own migration files with their own ids. The database from last week's lab still has *last week's* `__EFMigrationsHistory` in it, and the two will not reconcile — you'd get *"there is already an object named 'Cryptids'"*.
>
> ⚠️ **Never do this on your own project.** Your semester project has data you care about, and `database drop` does not ask twice. This is a throwaway lab database and that is the only reason it's safe here.

## Where tonight's work happens

Every file you touch is in `Cryptids.Web`:

```
Cryptids.Web/
├─ Models/
│   ├─ Cryptid.cs           ← task 1 (a property comes OUT, another goes in)
│   └─ Sighting.cs          ← task 1 (new)
├─ Data/CryptidContext.cs   ← tasks 1 and 2
├─ ViewModels/              ← task 4 (new folder)
├─ Controllers/
│   ├─ CryptidsController.cs  ← tasks 1, 3, 5
│   └─ SightingsController.cs ← task 4 (new)
└─ Views/
    ├─ _ViewImports.cshtml     ← task 4
    ├─ Shared/_CryptidCard.cshtml ← task 1
    ├─ Cryptids/               ← tasks 1, 3, 4, 5
    └─ Sightings/Create.cshtml  ← task 4 (new)
```

## The tasks

| # | Task | Turns green |
|---|---|---|
| 1 | **The count stops being a number you typed** — `Sighting`, and the `int Sightings` comes out. [Task 1 in full ↓](#task-1-in-full) | check 2 |
| 2 | **Seed the accounts and migrate** — fourteen real reports. [Task 2 in full ↓](#task-2-in-full) | check 3 |
| 3 | **`Include`** — make them actually appear. [Task 3 in full ↓](#task-3-in-full) | check 4 |
| 4 | **The report form** — anyone can file one, and it says which creature. [Task 4 in full ↓](#task-4-in-full) | check 5 |
| 5 | **Closing a file says what goes with it.** [Task 5 in full ↓](#task-5-in-full) | check 6 |
| ⭐ | **Stretch: `Witness`, and a real many-to-many.** No check, no points. [Stretch in full ↓](#stretch-witness-and-a-real-many-to-many) | — |

Run `dotnet test Cryptids.Checks` from terminal 3 after each one. Check 1 passes from the start.

### Task 1 in full

**Start the app and drop the database first.** Terminal 1, from `CryptidsRelated`:

```bash
dotnet watch --project Cryptids.Web
```

Terminal 2, from `Cryptids.Web`:

```bash
dotnet ef database drop --force
dotnet ef database update
```

Three migrations replay and `/Cryptids` shows six creatures. Now the actual work.

**Create `Models/Sighting.cs`.** This is the whole file:

```csharp
using System.ComponentModel.DataAnnotations;

namespace Cryptids.Web.Models;

public class Sighting
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Who is reporting this?")]
    [Display(Name = "Reported by")]
    [StringLength(60, MinimumLength = 2)]
    public string Witness { get; set; } = "";

    [Required(ErrorMessage = "Where did you see it?")]
    [StringLength(80)]
    public string Location { get; set; } = "";

    [Display(Name = "Seen on")]
    [DataType(DataType.Date)]
    public DateTime SeenOn { get; set; }

    [Required(ErrorMessage = "Say what you saw.")]
    [Display(Name = "What you saw")]
    [StringLength(400, MinimumLength = 10, ErrorMessage = "Give us at least {2} characters.")]
    public string Account { get; set; } = "";

    // The foreign key — the column that actually exists in the table.
    [Display(Name = "Creature")]
    public int CryptidId { get; set; }

    // The navigation property — not a column.
    public Cryptid? Cryptid { get; set; }
}
```

**Now the swap in `Models/Cryptid.cs`.** Delete this property and both of its attributes:

```csharp
[Display(Name = "Reports on file")]
[Range(0, 100000)]
public int Sightings { get; set; }
```

...and add this one at the bottom of the class:

```csharp
public ICollection<Sighting> Sightings { get; set; } = new List<Sighting>();
```

> [!IMPORTANT]
> **The build breaks now, and stays broken until you finish this task.** Five places referred to the old `int`. That's expected — work through the errors, they're a checklist:
>
> 1. `Data/CryptidContext.cs` — the seed sets `Sightings = 47` on all six creatures. **Delete `, Sightings = <number>` from each line.**
> 2. `Views/Cryptids/Create.cshtml` — delete the whole `<div class="mb-3">` block for `Sightings`.
> 3. `Views/Cryptids/Edit.cshtml` — the same block, delete it.
> 4. `Controllers/CryptidsController.cs` — take `Sightings` out of the `[Bind]` list on the Edit POST.
> 5. `Views/Shared/_CryptidCard.cshtml` and `Views/Cryptids/Details.cshtml` — these now count rows:

In the card:

```cshtml
<p class="card-text">First sighted @Model.FirstSighting · @Model.Sightings.Count report@(Model.Sightings.Count == 1 ? "" : "s")</p>
```

In `Details.cshtml`:

```cshtml
<p>@Model.Sightings.Count report@(Model.Sightings.Count == 1 ? "" : "s") on file.</p>
```

**Add the `DbSet`** to `Data/CryptidContext.cs`, next to the one already there:

```csharp
public DbSet<Sighting> Sightings => Set<Sighting>();
```

✅ **Check 2 goes green.** Every page now says *0 reports* — that's correct, and task 2 fixes it.

### Task 2 in full

**Seed the accounts.** In `Data/CryptidContext.cs`, inside `OnModelCreating`, after the `Cryptid` block. Paste this — it's long and typing it teaches nothing:

```csharp
modelBuilder.Entity<Sighting>().HasData(
    new Sighting { Id = 1, CryptidId = 1, Witness = "Eugene Shepard", Location = "Rhinelander, Wisconsin", SeenOn = new DateTime(1893, 10, 3), Account = "Horned, thick with muscle, and it smelled of green wood smoke. It went into the tamarack swamp and did not come out." },
    new Sighting { Id = 2, CryptidId = 1, Witness = "M. Krueger", Location = "Pelican Lake, Wisconsin", SeenOn = new DateTime(1952, 7, 19), Account = "Tracks in the mud at the boat landing, too wide for a bear and too deep for a deer." },
    new Sighting { Id = 3, CryptidId = 1, Witness = "Dolores Ambrose", Location = "Hodag Park, Wisconsin", SeenOn = new DateTime(2011, 6, 2), Account = "Something moved along the treeline while we packed the car. My brother saw it too and will not talk about it." },
    new Sighting { Id = 4, CryptidId = 2, Witness = "Jerry Crew", Location = "Bluff Creek, California", SeenOn = new DateTime(1958, 8, 27), Account = "Prints around the equipment, sixteen inches, walking a straight line across ground no man had crossed." },
    new Sighting { Id = 5, CryptidId = 2, Witness = "R. Patterson", Location = "Six Rivers, California", SeenOn = new DateTime(1967, 10, 20), Account = "It turned to look at us as it walked. It did not hurry, and that is the part I think about." },
    new Sighting { Id = 6, CryptidId = 2, Witness = "Anonymous", Location = "Chequamegon Forest, Wisconsin", SeenOn = new DateTime(2019, 11, 4), Account = "Bow season, first light. Something upright crossed the ridge two hundred yards out and I stopped hunting for the day." },
    new Sighting { Id = 7, CryptidId = 2, Witness = "T. Nakamura", Location = "Olympic Peninsula, Washington", SeenOn = new DateTime(2023, 3, 15), Account = "Two knocks on wood, spaced evenly, answered from further up the valley. No wind that night." },
    new Sighting { Id = 8, CryptidId = 3, Witness = "Linda Scarberry", Location = "Point Pleasant, West Virginia", SeenOn = new DateTime(1966, 11, 15), Account = "Grey, tall as a man, with wings folded behind. The eyes threw back the headlights like a deer's, but red." },
    new Sighting { Id = 9, CryptidId = 3, Witness = "Newell Partridge", Location = "Salem, West Virginia", SeenOn = new DateTime(1966, 11, 12), Account = "The television went to herringbone and the dog would not stop barking at the hay barn. The dog was gone by morning." },
    new Sighting { Id = 10, CryptidId = 4, Witness = "Aldie Mackay", Location = "Loch Ness, Scotland", SeenOn = new DateTime(1933, 5, 2), Account = "A great disturbance in the water off Abriachan, and something rolling and plunging in it for a full minute." },
    new Sighting { Id = 11, CryptidId = 4, Witness = "Arthur Grant", Location = "Abriachan, Scotland", SeenOn = new DateTime(1934, 1, 5), Account = "It crossed the road in front of the motorcycle in two bounds and went down the bank into the water." },
    new Sighting { Id = 12, CryptidId = 4, Witness = "H. Lindqvist", Location = "Fort Augustus, Scotland", SeenOn = new DateTime(2018, 8, 11), Account = "A wake with no boat in front of it, tracking north for perhaps thirty seconds before it flattened out." },
    new Sighting { Id = 13, CryptidId = 5, Witness = "Nelson Evans", Location = "Gloucester, New Jersey", SeenOn = new DateTime(1909, 1, 19), Account = "It stood on the shed roof, dog-faced and long-legged, then went off over the fence without touching it." },
    new Sighting { Id = 14, CryptidId = 6, Witness = "Madelyne Tolentino", Location = "Canóvanas, Puerto Rico", SeenOn = new DateTime(1995, 8, 11), Account = "Upright, spines down the back, and it hopped rather than ran. The goats were found the following morning." }
);
```

**Migrate.** Terminal 2:

```bash
dotnet ef migrations add AddSightings
dotnet ef database update
```

**Open the generated migration and read it before you move on.** It tells the story of the task in two operations:

```csharp
migrationBuilder.DropColumn(name: "Sightings", table: "Cryptids");
migrationBuilder.CreateTable(name: "Sightings", ...);
```

Same name. The column became a table. EF also warns *"An operation was scaffolded that may result in the loss of data"* — that's the `DropColumn`, and here you mean it.

Look further down for `onDelete: ReferentialAction.Cascade` on the foreign key. **Nobody typed that** — see [the notes](../lecture-notes.md#part-3-the-migration-and-the-cascade-you-did-not-choose). It matters in task 5.

✅ **Check 3 goes green.** The pages still say *0 reports* — which is the whole point of task 3.

### Task 3 in full

The database has fourteen reports. Every page says zero. Nothing is broken.

**A navigation property is empty until a query asks for it.** In `Controllers/CryptidsController.cs`, two actions need it. `Details`:

```csharp
var cryptid = _context.Cryptids
    .Include(c => c.Sightings)
    .FirstOrDefault(c => c.Id == id);
```

...and `Index`, because the cards count rows:

```csharp
return View(_context.Cryptids
    .Include(c => c.Sightings)
    .ToList());
```

**Then show them.** In `Views/Cryptids/Details.cshtml`, after the closing `</div>` of the main row:

```cshtml
<h2 class="h4 mt-5">The accounts</h2>

@if (Model.Sightings.Count > 0)
{
    <div class="list-group mb-4">
        @foreach (var sighting in Model.Sightings)
        {
            <div class="list-group-item">
                <div class="d-flex justify-content-between">
                    <strong>@sighting.Witness</strong>
                    <span class="text-muted small">@sighting.SeenOn.ToString("MMMM d, yyyy")</span>
                </div>
                <div class="text-muted small mb-2">@sighting.Location</div>
                <p class="mb-0">@sighting.Account</p>
            </div>
        }
    </div>
}
else
{
    <p class="text-muted">Nothing on file. Nobody has reported this one yet.</p>
}
```

> [!TIP]
> **`Include` is per query.** Adding it to `Details` does nothing for `Index`, and you'll need a third one in task 5. Every page that shows related rows asks for them again.

✅ **Check 4 goes green.** The Hodag has 3 reports, not 47 — the number got smaller and true.

### Task 4 in full

Anyone can file a report. The archive is curated; the accounts are not.

**Create the folder `ViewModels/` and `ViewModels/SightingFormViewModel.cs`:**

```csharp
using Microsoft.AspNetCore.Mvc.Rendering;
using Cryptids.Web.Models;

namespace Cryptids.Web.ViewModels;

public class SightingFormViewModel
{
    public Sighting Sighting { get; set; } = new();

    // The "?" is load-bearing — see the note below.
    public SelectList? Cryptids { get; set; }
}
```

**Add the using to `Views/_ViewImports.cshtml` right now**, in the same breath:

```cshtml
@using Cryptids.Web.ViewModels
```

> [!WARNING]
> Do these two together. A `@using` naming a namespace that doesn't exist yet breaks **every view in the project**, and the error list points at files you never opened.

**Create `Controllers/SightingsController.cs`:**

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Cryptids.Web.Data;
using Cryptids.Web.Models;
using Cryptids.Web.ViewModels;

namespace Cryptids.Web.Controllers;

public class SightingsController : Controller
{
    private readonly CryptidContext _context;

    public SightingsController(CryptidContext context)
    {
        _context = context;
    }

    public IActionResult Create(int? cryptidId)
    {
        var form = new SightingFormViewModel
        {
            Sighting = new Sighting { CryptidId = cryptidId ?? 0, SeenOn = DateTime.Today },
            Cryptids = CryptidChoices(cryptidId)
        };

        return View(form);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(SightingFormViewModel form)
    {
        if (!ModelState.IsValid)
        {
            // A dropdown is never posted back. Rebuild it or the redisplayed
            // form comes back with an empty list.
            form.Cryptids = CryptidChoices(form.Sighting.CryptidId);
            return View(form);
        }

        _context.Sightings.Add(form.Sighting);
        await _context.SaveChangesAsync();

        return RedirectToAction("Details", "Cryptids", new { id = form.Sighting.CryptidId });
    }

    private SelectList CryptidChoices(int? selected) =>
        new SelectList(_context.Cryptids.OrderBy(c => c.Name).ToList(), "Id", "Name", selected);
}
```

**Create `Views/Sightings/Create.cshtml`:**

```cshtml
@model SightingFormViewModel
@{
    ViewData["Title"] = "Report a sighting";
}

<h1>Report a sighting 👁️</h1>
<p class="text-muted">Anyone can file a report. What you saw is yours to tell.</p>

<form asp-action="Create" method="post" class="col-md-8">
    <div asp-validation-summary="All" class="text-danger"></div>

    <div class="mb-3">
        <label asp-for="Sighting.CryptidId" class="form-label"></label>
        <select asp-for="Sighting.CryptidId" asp-items="Model.Cryptids" class="form-select">
            <option value="">— pick a creature —</option>
        </select>
        <span asp-validation-for="Sighting.CryptidId" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Sighting.Witness" class="form-label"></label>
        <input asp-for="Sighting.Witness" class="form-control" />
        <span asp-validation-for="Sighting.Witness" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Sighting.Location" class="form-label"></label>
        <input asp-for="Sighting.Location" class="form-control" />
        <span asp-validation-for="Sighting.Location" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Sighting.SeenOn" class="form-label"></label>
        <input asp-for="Sighting.SeenOn" class="form-control" />
        <span asp-validation-for="Sighting.SeenOn" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Sighting.Account" class="form-label"></label>
        <textarea asp-for="Sighting.Account" class="form-control" rows="5"></textarea>
        <span asp-validation-for="Sighting.Account" class="text-danger"></span>
    </div>

    <button type="submit" class="btn btn-primary">File the report</button>
    <a asp-controller="Cryptids" asp-action="Index" class="btn btn-link">Cancel</a>
</form>

@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

**Add the way in**, at the bottom of `Views/Cryptids/Details.cshtml`:

```cshtml
<p>
    <a asp-controller="Sightings" asp-action="Create" asp-route-cryptidId="@Model.Id" class="btn btn-primary">
        👁️ Report a sighting
    </a>
</p>
```

**File one.** Pick a creature, fill it in, submit — you land back on that creature's page with your account at the bottom.

> [!NOTE]
> **Why `SelectList?` and not `SelectList`.** ASP.NET treats a non-nullable property as a required field. The dropdown's *list of choices* is never posted back — the browser sends only the option you picked — so without the `?` every submission is refused with *"The Cryptids field is required"*, pointing at a dropdown that plainly has a creature in it. It's [week 6's rule in a new place](../lecture-notes.md#two-things-that-will-bite-you-here).

✅ **Check 5 goes green.**

### Task 5 in full

Closing a file deletes its reports too. That was decided in task 2, by the `int` on `CryptidId` — see the migration's `onDelete: Cascade`.

A page that asks *"are you sure?"* has to say what else is going.

**Load them** — `Delete` in `CryptidsController.cs`, the GET:

```csharp
var cryptid = await _context.Cryptids
    .Include(c => c.Sightings)
    .FirstOrDefaultAsync(c => c.Id == id);
```

**Say it** — in `Views/Cryptids/Delete.cshtml`, under the card:

```cshtml
@if (Model.Sightings.Count > 0)
{
    <div class="alert alert-warning">
        <strong>@Model.Sightings.Count</strong> eyewitness
        report@(Model.Sightings.Count == 1 ? "" : "s") @(Model.Sightings.Count == 1 ? "is" : "are")
        attached to this record, and closing the file takes
        @(Model.Sightings.Count == 1 ? "it" : "them") too.
    </div>
}
```

That's the **third** `Include` tonight. Details had one, Index had one, and this page counted zero until it got its own.

✅ **Check 6 goes green. That's 6 of 6.**

### Stretch: `Witness`, and a real many-to-many

**No check, no points, and nobody needs this for the homework.** Do it if you're ahead and curious.

Right now a witness is a string typed into a row. `"Anonymous"` appears twice and they are not the same person, and there is no way to ask *what else has this person reported?*

Pull the name into its own table and `Sighting` stops being a detail of a creature and becomes the **link** between a creature and a witness — carrying the date, the location and the account. That is a many-to-many, and the join has to be its own class precisely because it carries a payload.

**1.** `Models/Witness.cs`:

```csharp
using System.ComponentModel.DataAnnotations;

namespace Cryptids.Web.Models;

public class Witness
{
    public int Id { get; set; }

    [Required]
    [StringLength(60, MinimumLength = 2)]
    public string Name { get; set; } = "";

    public ICollection<Sighting> Sightings { get; set; } = new List<Sighting>();
}
```

**2.** In `Sighting.cs`, add a second foreign key next to the first:

```csharp
[Display(Name = "Witness")]
public int? WitnessId { get; set; }

public Witness? Witness2 { get; set; }
```

`int?` this time, so existing rows don't need one and deleting a witness doesn't delete the sighting. (Name it `Witness2` or rename the existing `Witness` string — you can't have two members with one name.)

**3.** `DbSet<Witness> Witnesses => Set<Witness>();`, then migrate.

**4.** The payoff — walk it backwards. A `WitnessesController` with:

```csharp
var witness = _context.Witnesses
    .Include(w => w.Sightings)
        .ThenInclude(s => s.Cryptid)
    .FirstOrDefault(w => w.Id == id);
```

`Include` gets you to the sightings. **`ThenInclude` keeps going**, one hop further, to the creature each sighting is about. Now one page can answer *"everything this person has reported"* — out of exactly the same rows, read from the other end.

## Rules

- **Never edit `Cryptids.Checks`.** If a check looks wrong, tell me.
- **Work in `Cryptids.Web` only.**
- `dotnet test Cryptids.Checks` runs from `CryptidsRelated`, the folder above both projects.
- **The checks don't need wifi or SQL Server** — they run your app against an in-memory database. 6/6 does **not** prove your connection string works. Your browser proves that.

## 🆘 Stuck?

- **The build is broken after task 1 and won't stop** — five files referred to the old `int Sightings`. The error list is your checklist; work down it. [Task 1 in full ↑](#task-1-in-full)
- **Pages say 0 reports after task 2** — expected. That's task 3.
- **Pages still say 0 reports after task 3** — the `Include` went on one action and not the other. [`Include` is per query](../lecture-notes.md#include-is-per-query).
- **`NullReferenceException` on `Sightings.Count`** — the collection isn't initialized. It needs `= new List<Sighting>();` on the property.
- **Every view suddenly fails to compile** — `_ViewImports.cshtml` names `Cryptids.Web.ViewModels` and the folder doesn't exist yet. [Task 4 in full ↑](#task-4-in-full)
- **"The Cryptids field is required" with a creature selected** — the `SelectList` isn't nullable. [Part 7 of the notes](../lecture-notes.md#two-things-that-will-bite-you-here).
- **The form is refused with no message** — `asp-validation-summary="ModelOnly"` hides property errors. Use `"All"`.
- **The dropdown is empty after a failed submit** — rebuild the `SelectList` inside the `if (!ModelState.IsValid)` branch.
- **`dotnet ef` says there's already an object named 'Cryptids'** — you skipped the database drop at the top of task 1.

## 🚀 Done early?

- Do the stretch task above.
- Sort the accounts newest-first on the details page.
- Give the registry index a *"most reported"* ordering — `OrderByDescending(c => c.Sightings.Count)`. Read the terminal afterwards and see what SQL that became.
