# Week 9 Lab — The Registry Gets a Sightings Log 👁️

The Registry has a column that says **47 reports on file** for The Hodag. Somebody typed 47. There are no reports — there is a number, and it has never been connected to anything.

Tonight that number becomes the reports themselves: who saw it, where, when, and what they saw. Week 2's `report.html` was a form with nowhere to send anything. Tonight it gets somewhere to go.

**Time:** ~50 minutes in class, in eight short blocks — each one follows the part of the demo it practices, and every block but the last ends at an **In class, stop here** note. **In-class target: checks 1–5 green.** Check 6 is the delete warning; it's the same move your homework needs, and it rolls into it if the clock wins.

## Setup

> [!IMPORTANT]
> **The app arrives as week 8 finished it** — full CRUD, the field-guide plates, two migrations. If your own week-8 lab never got finished, you are **not** behind tonight. Check 1 passes before you touch anything.

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

**4. Open three terminals** — `` Ctrl+` `` opens the first, then the `+` in the terminal panel (or `` Ctrl+Shift+` ``) twice more. They are terminals 1, 2 and 3 for the rest of the lab, and every command below names the one it runs in. **You need three tonight**, and `dotnet watch` is why: it stays running all lab and you can't type in it.

| Terminal | Where it stands | What runs in it |
|---|---|---|
| 1 | inside `Cryptids.Web` — `cd Cryptids.Web` | `dotnet watch` — **started in task 1**, then left alone |
| 2 | inside `Cryptids.Web` — `cd Cryptids.Web` | everything else: `dotnet user-secrets`, `dotnet ef` |
| 3 | `CryptidsRelated`, the folder holding **both** projects | `dotnet test Cryptids.Checks` |

**All three open in `CryptidsRelated`. Move terminals 1 and 2 — run this in each of them:**

```bash
cd Cryptids.Web
```

Terminal 3 stays in `CryptidsRelated`, because `dotnet test Cryptids.Checks` runs from the folder holding both projects.

**5. In terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**1 / 6 passing.** Check 1 is the week-8 Registry you were handed, already working. The other five are tonight.

> [!CAUTION]
> **Same folder split as the last two weeks:** `dotnet test Cryptids.Checks` runs from the folder holding *both* projects; `dotnet watch`, `dotnet ef` and `dotnet user-secrets` all run from **inside `Cryptids.Web`** — which is what step 4's table is arranging for you.

## Where tonight's work happens

Every file you touch is in `Cryptids.Web`:

```
Cryptids.Web/
├─ Models/
│   ├─ Cryptid.cs             ← task 2 (a property comes OUT, another goes in)
│   └─ Sighting.cs            ← task 2 (new)
├─ Data/CryptidContext.cs     ← tasks 2 and 3
├─ Migrations/                ← task 3 (one new file, generated)
├─ ViewModels/                ← task 5 (new folder)
├─ Controllers/
│   ├─ CryptidsController.cs  ← tasks 2, 4 and 6
│   └─ SightingsController.cs ← task 5 (new)
└─ Views/
    ├─ _ViewImports.cshtml         ← task 5
    ├─ Shared/_CryptidCard.cshtml  ← task 2
    ├─ Cryptids/                   ← tasks 2, 4, 5 and 6
    └─ Sightings/Create.cshtml     ← task 5 (new)
```

> [!NOTE]
> **The checks never connect to SQL Server** — in-memory, seeded from your `HasData`, no wifi needed. **6/6 does not prove your connection string works.** Your browser proves that. Do both.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 1 | *(check 1 is already green)* | Put your connection string in user secrets, **drop last week's database**, let one `dotnet ef database update` rebuild it, and start the app. **[Task 1 in full ↓](#task-1-in-full)** |
| 2 | `ReportsOnFileIsNoLongerANumberYouTyped` | **The count stops being a number you typed** — `Sighting`, and the `int Sightings` comes out. **[Task 2 in full ↓](#task-2-in-full)** |
| 3 | `TheTableHasRealAccountsInIt` | **Seed the accounts and migrate** — fourteen real reports. **[Task 3 in full ↓](#task-3-in-full)** |
| 4 | `ThePagesActuallyShowTheAccounts` | **`Include`** — make them actually appear, on the details page and then on the cards. Two parts, with a part of the demo between them. **[Task 4 in full ↓](#task-4-in-full)** |
| 5 | `AnyoneCanFileAReport` | **The report form** — anyone can file one, and it says which creature. **[Task 5 in full ↓](#task-5-in-full)** |
| 6 | `ClosingAFileSaysWhatElseGoesWithIt` | **Closing a file says what goes with it.** **[Task 6 in full ↓](#task-6-in-full)** |
| ⭐ | — | **Stretch: `Witness`, and a real many-to-many.** No check, no points. **[Stretch in full ↓](#stretch-witness-and-a-real-many-to-many)** |

### Task 1 in full

**Check 1 is already green** — this task is about your database, which the checks can't see but your browser needs.

**First, the connection string** (frozen lab PC? this is the one that gets wiped). **In terminal 2** — the one step 4 left standing inside `Cryptids.Web`:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=<SCHOOL-SQL-SERVER>;Database=Cryptids_<COURSE-NUMBER>_<YOUR-INITIALS>;User ID=<YOUR-USERNAME>;Password=<YOUR-PASSWORD>;TrustServerCertificate=True"
```

**Same connection string as last week — same server, same database name.** This is still the Cryptid Registry, and [one application gets one database](../../week-07/lecture-notes.md#naming-your-database). The folder is new so week 8's work stays where it is; the database is not.

The `<UserSecretsId>` ships in the `.csproj`, so `set` on its own is enough — there is no `init` step.

**Now reset the database and rebuild it — two commands, still in terminal 2:**

```bash
dotnet ef database drop --force
dotnet ef database update
```

> [!WARNING]
> **The drop is not optional here, and you need to know why.** This starter ships its own migration files with their own ids. The database from last week's lab still has *last week's* `__EFMigrationsHistory` in it, and the two will not reconcile — you'd get *"there is already an object named 'Cryptids'"*.
>
> ⚠️ **Never do this on your own project.** Your semester project has data you care about, and `database drop` does not ask twice. This is a throwaway lab database and that is the only reason it's safe here.

Two migrations replay: the table with its six creatures, then their Latin names and plates.

**Now start the app — in terminal 1:**

```bash
dotnet watch
```

Open `/Cryptids` and count six. Then leave it running.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 1`** — the same as when you started. Task 1 changed your database, and the checks never look at it. Check 2's message says there is no second table yet. That's correct: task 2 makes one.

> [!NOTE]
> **In class, stop here.** Task 2 comes after the next part of the demo. Checks 2 to 6 are still red, and that's expected — the rest of tonight turns them green. Finished early? Open The Hodag's page and read the line that says **47 reports on file**, then find where the 47 comes from in `Data/CryptidContext.cs`. That number is what tonight replaces. Or help a classmate get to six creatures on `/Cryptids`. Working at home? Carry straight on.

### Task 2 in full

**Check:** `Check2_ReportsOnFileIsNoLongerANumberYouTyped`

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
> **Six errors appear, and every one of them is the same error.** Deleting the `int` breaks the seed — `Sightings = 47` will not go into a collection — so `Data/CryptidContext.cs` lights up once per creature. That is item 1 below.
>
> ⚠️ **The other four places do not error at all, and this is the part that catches people.** `asp-for="Sightings"` binds to a collection without complaining, `@Model.Sightings` renders it, and a `[Bind]` list is just a string to the compiler. Fix item 1 alone and the build goes green — **and so does check 2**, over a card that reads ``First sighted 1893 · System.Collections.Generic.List`1[Cryptids.Web.Models.Sighting] reports``. **This list is the checklist. The error pane is not.**
>
> 1. `Data/CryptidContext.cs` — the seed sets `Sightings = 47` on all six creatures. **Delete `, Sightings = <number>` from each line.** *(the only one the compiler will point at)*
> 2. `Views/Cryptids/Create.cshtml` — delete the whole `<div class="mb-3">` block for `Sightings`.
> 3. `Views/Cryptids/Edit.cshtml` — the same block, delete it.
> 4. `Controllers/CryptidsController.cs` — take `Sightings` out of the `[Bind]` list on the Edit POST.
> 5. `Views/Shared/_CryptidCard.cshtml` and `Views/Cryptids/Details.cshtml` — these now count rows:

In the card, replace the `<p class="card-text">` line:

```cshtml
<p class="card-text">First sighted @Model.FirstSighting · @Model.Sightings.Count report@(Model.Sightings.Count == 1 ? "" : "s")</p>
```

In `Details.cshtml`, replace the line that says `reports on file`:

```cshtml
<p>@Model.Sightings.Count report@(Model.Sightings.Count == 1 ? "" : "s") on file.</p>
```

**Add the `DbSet`** to `Data/CryptidContext.cs`, on the line below the one already there:

```csharp
public DbSet<Sighting> Sightings => Set<Sighting>();
```

Reload `/Cryptids`. **Every card now says *0 reports*, and that's correct** — there is a place for reports and nothing in it. The collection starts as an empty list, so a creature with no reports reads as zero instead of crashing.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 2`** — checks 1 and 2. Check 3's message says the Sightings table is empty. That's correct: task 3 seeds it.

> [!NOTE]
> **In class, stop here.** Task 3 comes after the next part of the demo. Checks 3 to 6 are still red, and that's expected. Finished early? Put `Models/Sighting.cs` and `Models/Cryptid.cs` side by side and find the three properties that tie the two classes together. Decide which one of the three will be a column — task 3's migration shows you whether you were right. Or help a classmate with the five places. Working at home? Carry straight on.

### Task 3 in full

**Check:** `Check3_TheTableHasRealAccountsInIt`

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

**Generate the migration — in terminal 2:**

```bash
dotnet ef migrations add AddSightings
```

EF warns *"An operation was scaffolded that may result in the loss of data"* — that's the `DropColumn`, and here you mean it.

**Open the generated migration and read it before you apply it.** There are four operations in it, and the first two tell the story:

```csharp
migrationBuilder.DropColumn(name: "Sightings", table: "Cryptids");
migrationBuilder.CreateTable(name: "Sightings", ...);
```

Same name. The column became a table.

**Expand that `...`.** Inside `CreateTable`, in its `constraints:` block, is the foreign key — and hanging off it, `onDelete: ReferentialAction.Cascade`. **Nobody typed that** — see [the notes](../lecture-notes.md#part-3-the-migration-and-the-cascade-you-did-not-choose). It matters in task 6.

The other two operations sit below the table. `InsertData` carries your fourteen accounts. `CreateIndex` puts an index on `CryptidId` — **you never asked for that one either.** EF indexes a foreign key on its own, because "which rows belong to this creature" is the only question that column exists to answer, and an index is what keeps it fast.

**Apply it — still in terminal 2:**

```bash
dotnet ef database update
```

> [!IMPORTANT]
> **Now restart the app — in terminal 1, `Ctrl+C`, then `dotnet watch` again.** EF Core works out what your tables look like **once, when the app starts**. The running app started before `Sighting` existed, so it still asks the database for a `Sightings` column — and that column is gone now. `dotnet watch` printed `Hot reload succeeded` for every file you saved, and that is not enough for this change. Skip the restart and pages that read a creature can fail with an error about `Sightings`, over code that is correct.

Reload `/Cryptids`. **The pages still say *0 reports*** — fourteen rows in the database, and not one of them on a page. That is the whole point of task 4.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 3`** — checks 1 to 3. Check 4's message says the details page for creature 1 doesn't show its reports, even though the database has them. That's correct: task 4 is next.

> [!NOTE]
> **In class, stop here.** Task 4 comes after the break and the next part of the demo. Checks 4 to 6 are still red, and that's expected. Finished early? In the mssql panel, run `SELECT * FROM Sightings;` against your database — fourteen rows, each with a `CryptidId`. Or help a classmate read their migration. Working at home? Carry straight on.

### Task 4 in full

**Check:** `Check4_ThePagesActuallyShowTheAccounts` — it goes green at the end of part 2.

The database has fourteen reports. Every page says zero. Nothing is broken.

**First, give the accounts somewhere to appear.** In `Views/Cryptids/Details.cshtml`, after the closing `</div>` of the main row and above `@section Scripts`:

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

**Reload The Hodag's page — `/Cryptids/Details/1`.** It says **Nothing on file.** No error, nothing in terminal 1 but an ordinary `SELECT` — and that `SELECT` names one table, `Cryptids`. The Hodag has three reports in the database.

**A navigation property is empty until a query asks for it.** In `Controllers/CryptidsController.cs`, in the `Details` action, replace the line that looks the creature up:

```csharp
var cryptid = _context.Cryptids
    .Include(c => c.Sightings)
    .FirstOrDefault(c => c.Id == id);
```

Reload The Hodag's page. **Three accounts, and the line above them now says *3 reports on file*.** Read the `SELECT` in terminal 1 again: it has a `LEFT JOIN` to `Sightings` in it. You didn't write that join. You wrote `Include`.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 3`** — the same as before. Check 4's message has changed: it now says the registry page never prints the number 3, and that `Include` is per-query. That's correct. Open `/Cryptids` — The Hodag's card still says *0 reports*, on the same app, a moment after its own page said 3.

> [!NOTE]
> **In class, stop here.** Part 2 comes after the next part of the demo. Check 4 is still red, and that's expected. Finished early? Show the accounts newest first: in `Details.cshtml`, change the `@foreach` to loop over `Model.Sightings.OrderByDescending(s => s.SeenOn)`. Or help a classmate get to three accounts on The Hodag's page. Working at home? Carry straight on.

#### Task 4, part 2 — the cards

**The cards count rows too**, and `Index` never asked for them. Reload `/Cryptids` and read terminal 1 first: one `SELECT`, one table, six cards saying *0 reports*.

**Add the same `Include` to the `Index` action** in `CryptidsController.cs`. It is the line you added to `Details`, in a different query — try it before you open the answer.

<details><summary>Want to compare? The Index action's return line</summary>

```csharp
return View(_context.Cryptids
    .Include(c => c.Sightings)
    .ToList());
```

</details>

Reload `/Cryptids`. **The Hodag's card says *3 reports*, not 47** — the number got smaller and true. Read terminal 1: still **one** `SELECT`, with a `LEFT JOIN` in it. Six creatures and all fourteen reports came back in one trip.

> [!TIP]
> **`Include` is per query.** Adding it to `Details` did nothing for `Index`, and you'll need a third one in task 6. Every page that shows related rows asks for them again.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 4`** — checks 1 to 4. Check 5's message says it couldn't find a form for filing a report. That's correct: task 5 builds one.

> [!NOTE]
> **In class, stop here.** Task 5 comes after the next two parts of the demo, with the break between them. Checks 5 and 6 are still red, and that's expected. Finished early? Try **a "most reported" ordering** from [🚀 Done early?](#-done-early) — it only changes the `Index` action you just edited. Or help a classmate. Working at home? Carry straight on.

### Task 5 in full

**Check:** `Check5_AnyoneCanFileAReport`

Anyone can file a report. The archive is curated; the accounts are not.

**Create the folder `ViewModels/` and `ViewModels/SightingFormViewModel.cs`:**

```csharp
using Microsoft.AspNetCore.Mvc.Rendering;
using Cryptids.Web.Models;

namespace Cryptids.Web.ViewModels;

public class SightingFormViewModel
{
    public Sighting Sighting { get; set; } = new();

    // The "?" is load-bearing: ASP.NET treats a non-nullable property as a
    // required field, and this list is never posted back — it is the choices,
    // not the answer. Without it every report is refused with
    // "The Cryptids field is required", pointing at a full dropdown.
    public SelectList? Cryptids { get; set; }
}
```

**Add the using to `Views/_ViewImports.cshtml` right now**, as the next thing you do:

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

> [!IMPORTANT]
> **Creating a new `.cshtml` makes `dotnet watch` stop and ask to restart** — `Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`, in terminal 1, where watch is running. Answer **`a`** and it won't ask again for the rest of the lab. Until you answer, the app keeps serving the build from before your file existed.

**Add the way in**, at the bottom of `Views/Cryptids/Details.cshtml`:

```cshtml
<p>
    <a asp-controller="Sightings" asp-action="Create" asp-route-cryptidId="@Model.Id" class="btn btn-primary">
        👁️ Report a sighting
    </a>
</p>
```

**File one.** Open The Hodag's page, click **Report a sighting** — the form opens with The Hodag already chosen in the dropdown, because the link passed its id. Fill it in, submit — you land back on The Hodag's page with your account in the list.

> [!NOTE]
> **Why `SelectList?` and not `SelectList`.** ASP.NET treats a non-nullable property as a required field. The dropdown's *list of choices* is never posted back — the browser sends only the option you picked — so without the `?` every submission is refused with *"The Cryptids field is required"*, pointing at a dropdown that plainly has a creature in it. It's [week 6's rule in a new place](../lecture-notes.md#three-things-that-will-bite-you-here).

> [!WARNING]
> **If you ever have to add that `?` to a running app, restart it — in terminal 1, `Ctrl+C`, then `dotnet watch` again.** Hot reload can print `🔥 Hot reload succeeded.` and still leave the fix **inert**: the required-field rules are worked out once per model type when the app starts, and a reload does not reliably redo them. When that happens you get the identical error over a file that is already correct.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 5`** — tonight's in-class target. 🎉 Check 6's message says the Close-the-file page never says how many reports are attached. That's correct: task 6 adds the warning.

> [!NOTE]
> **In class, stop here.** Task 6 comes after the next part of the demo. Check 6 is still red, and that's expected. Finished early? See the failure the `?` prevents: take the `?` off `SelectList? Cryptids`, restart the app in terminal 1, file a report, and read the message. Then put the `?` back, restart again, and run the checks — still `Passed: 5`. Or help a classmate. Working at home? Carry straight on.

### Task 6 in full

**Check:** `Check6_ClosingAFileSaysWhatElseGoesWithIt`

Closing a file deletes its reports too. That was decided in task 3, by the `int` on `CryptidId` — see the migration's `onDelete: Cascade`.

A page that asks *"are you sure?"* has to say what else is going.

**Say it first** — in `Views/Cryptids/Delete.cshtml`, between the `</div>` that closes the card and the `<form>`:

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

**Open The Hodag's Close-the-file page — `/Cryptids/Delete/1`.** No warning, and the card on it says *0 reports*. The Hodag's own page lists its accounts. Same creature, same database.

**You have seen this twice tonight. Fix it the same way:** the `Delete` action in `CryptidsController.cs` — the GET, the one that takes `int? id` — looks the creature up without asking for its sightings. Add the `Include`.

<details><summary>Want to compare? The lookup in the Delete GET</summary>

```csharp
var cryptid = await _context.Cryptids
    .Include(c => c.Sightings)
    .FirstOrDefaultAsync(c => c.Id == id);
```

</details>

Reload the page. **The warning appears, with the count in it.** Click **Keep it** — you are not closing The Hodag's file.

That's the **third** `Include` tonight. Details had one, Index had one, and this page counted zero until it got its own.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 6`** — all six. 🎉 The Registry has a sightings log.

> [!NOTE]
> **In class, stop here.** The last block comes after the final part of the demo. Finished early? Watch the cascade happen: file a throwaway creature with **＋ File a report** on `/Cryptids`, report a sighting for it, then close its file. In the mssql panel, `SELECT * FROM Sightings;` no longer has its report — nothing asked twice. Or help a classmate. Working at home? Carry straight on.

### Stretch: `Witness`, and a real many-to-many

**No check, no points, and nobody needs this for the homework.** In class this is the last block, after the demo builds a many-to-many on Curbside — and the block has no stop. If any of your checks are still red, finish those first. Do this if you're at `Passed: 6` and curious.

Right now a witness is a string typed into a row. Two reports signed `"Anonymous"` would not be the same person, two reports from one person are not connected to each other, and there is no way to ask *what else has this person reported?*

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

- **The build is broken after task 2** — that is the seed, and it is the *only* thing that errors. The other four places do not break the build at all, so a green build does not mean task 2 is done. Work the numbered list, not the error pane. [Task 2 in full ↑](#task-2-in-full)
- **"Could not find a MSBuild project file"** — that terminal is standing in `CryptidsRelated`, which holds two projects. `dotnet watch`, `dotnet ef` and `dotnet user-secrets` need one: run `cd Cryptids.Web` in terminals 1 and 2. `dotnet test Cryptids.Checks` is the one that runs from `CryptidsRelated`, in terminal 3.
- **Every page that lists or shows a creature fails right after `database update`** — the app is still running the build from before the migration. EF Core works out your tables once, at startup, and hot reload doesn't redo it. In terminal 1: `Ctrl+C`, then `dotnet watch`. The same goes for *"The expression 'c.Sightings' is invalid inside an 'Include' operation"* and *"Cannot create a DbSet for 'Sighting' because this type is not included in the model"* over code that matches the README — restart before you change anything.
- **Pages say 0 reports after task 3** — expected. That's task 4.
- **The details page shows the accounts but the cards still say 0 reports** — that's the end of task 4, part 1, and it's expected. Part 2 puts the `Include` on `Index`. [`Include` is per query](../lecture-notes.md#include-is-per-query).
- **`NullReferenceException` on `Sightings.Count`** — the collection isn't initialized. It needs `= new List<Sighting>();` on the property.
- **Every view suddenly fails to compile** — `_ViewImports.cshtml` names `Cryptids.Web.ViewModels` and the folder doesn't exist yet. [Task 5 in full ↑](#task-5-in-full)
- **"The Cryptids field is required" with a creature selected** — the `SelectList` isn't nullable. [Part 7 of the notes](../lecture-notes.md#three-things-that-will-bite-you-here). **Restart after the fix if the error survives it** — hot reload can report success and still leave this one inert.
- **The form is refused with no message** — `asp-validation-summary="ModelOnly"` hides property errors. Use `"All"`.
- **The dropdown is empty after a failed submit** — rebuild the `SelectList` inside the `if (!ModelState.IsValid)` branch.
- **`dotnet ef` says there's already an object named 'Cryptids'** — you skipped the database drop in task 1. Run it in terminal 2, then `database update` again. (Only ever in this lab — never on your own project's database.)
- **`The view 'Create' was not found`, and `Views/Sightings/Create.cshtml` is right there** — look at terminal 1. Creating a new `.cshtml` makes `dotnet watch` stop and ask **`Do you want to restart your app?`**, and until you answer it the app keeps serving the build from before your file existed. Press **`a`**. Don't move the file; it's in the right place.
- **The Close-the-file page shows no warning, and its card says 0 reports** — the `Delete` GET has no `Include` yet. Task 6's second step.

## 🚀 Done early?

- **Do the stretch task above.**
- **Sort the accounts newest-first** on the details page — `Model.Sightings.OrderByDescending(s => s.SeenOn)` in the `@foreach`.
- **A "most reported" ordering** for the registry index — `OrderByDescending(c => c.Sightings.Count)` in the `Index` action, between the `Include` and the `ToList`. Read terminal 1 afterwards and see what SQL that became.
