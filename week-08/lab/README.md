# Week 8 Lab — The Registry Gets a Corrections Desk ✏️

The Registry can take reports and show them. It cannot fix a typo in one, and it cannot get rid of one that turned out to be a hoax about a neighbor's dog. Tonight: a scaffolded reference controller, an Edit you port from it, a Delete that asks first — and then the archive's six **field-guide plates** go on display, which takes two new columns on a table that already has rows in it.

**Time:** ~50 minutes in class — **in-class target: checks 1–4 green.** Checks 5–6 (the plates) are the same moves your homework needs, and they roll into it if the clock wins.

## Setup

> [!IMPORTANT]
> **The app arrives as week 7 finished it** — context, seed data, one migration, a controller that reads and writes through EF Core. If your own week-7 lab never got finished, you are **not** behind tonight. Check 1 passes before you touch anything.
>
> **The two scaffolding packages are already in `Cryptids.Web.csproj`** (`Microsoft.VisualStudio.Web.CodeGeneration.Design` and `Microsoft.EntityFrameworkCore.Tools`), so nobody spends the lab waiting on NuGet. You'll add them to your own app yourself in the homework — they're in [the notes](../lecture-notes.md#two-packages-and-a-tool).
>
> **Because they're already in, your first build prints yellow `NU1901` warnings — expected, and temporary.** They're low-severity advisories against `NuGet.Packaging` / `NuGet.Protocol`, which arrive six levels beneath the scaffolder. Read the line above: `Build succeeded`. Warnings, not errors — and **task 4 removes the packages, which stops them.**
>
> **The seven plate images are already in `wwwroot/img/cryptids/`.** Task 6 puts them on screen; nothing has to be downloaded.

**1. Update your clone of the course repo:**

```bash
cd dotnet-web-dev && git pull
```

**2. Copy the `week-08/lab/starter` folder out to wherever you keep your projects, and rename the copy** — `CryptidsCrud` works. (Copy it *out*; never work inside the clone.)

```
CryptidsCrud/              ← the folder you copied and renamed
├─ Cryptids.Web/          ← your app — ALL your work happens in here
└─ Cryptids.Checks/       ← the checks — read-only, never edit
```

**3. Open `CryptidsCrud` in VS Code** — the folder that *contains* both project folders.

**4. In the VS Code terminal, from that same folder:**

```bash
dotnet test Cryptids.Checks
```

**1 / 6 passing.** Check 1 is the week-7 Registry you were handed, already working. The other five are tonight.

> [!CAUTION]
> **Same folder split as last week, and it still trips everybody:** `dotnet test Cryptids.Checks` runs from the folder holding *both* projects; `dotnet ef`, `dotnet user-secrets`, `dotnet watch` and tonight's new `dotnet aspnet-codegenerator` all run from **inside `Cryptids.Web`**.
>
> **So open three terminals now, before you start** — `dotnet watch` stays running all lab and you can't type in it:
>
> | Terminal | Where | What runs in it |
> |---|---|---|
> | 1 | inside `Cryptids.Web` | `dotnet watch` — started in task 1, left alone after that |
> | 2 | inside `Cryptids.Web` | everything else: `dotnet user-secrets`, `dotnet ef`, `dotnet aspnet-codegenerator` |
> | 3 | the folder holding **both** projects | `dotnet test Cryptids.Checks` |

## Where tonight's work happens

| File | What you do to it |
|---|---|
| *(user secrets — not a file in this project)* | your connection string, **same database name as last week** — task 1 |
| `Controllers/CryptidsScaffoldController.cs` | **generated** in task 2 · **deleted** in task 4 |
| `Views/CryptidsScaffold/` | **generated** in task 2 · **deleted** in task 4 |
| `Controllers/CryptidsController.cs` | gains the Edit and Delete pairs — tasks 3 and 4 |
| `Views/Cryptids/Edit.cshtml`, `Delete.cshtml` | **new files**, yours — tasks 3 and 4. ⚠️ a new view makes `dotnet watch` **ask to restart** — answer `a` |
| `Models/Cryptid.cs` + `Data/CryptidContext.cs` | two new properties, seed data updated — task 5 |
| `Migrations/` | **one new file, generated** — task 5. ⚠️ don't delete this folder any more |
| `Views/Shared/_CryptidCard.cshtml`, `Views/Cryptids/*`, `Views/Home/Index.cshtml`, `Controllers/HomeController.cs` | the plates go on display — task 6 |

> [!NOTE]
> **The checks never connect to SQL Server** — in-memory, seeded from your `HasData`, no wifi needed. **6/6 does not prove your connection string works.** Your browser proves that. Do both.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 1 | *(check 1 is already green)* | Install the scaffolder tool, put your connection string in user secrets, then **drop last week's database** and let one `dotnet ef database update` rebuild the whole thing. **[Task 1 in full ↓](#task-1-in-full)** |
| 2 | *(no check — it's the reference)* | [Scaffold](../lecture-notes.md#the-command-piece-by-piece) `CryptidsScaffoldController` and browse what one command wrote. **[Task 2 in full ↓](#task-2-in-full)** |
| 3 | `TheEditFormShowsTheRecord`, `ACorrectionIsSaved` | Port [the Edit pair](../lecture-notes.md#the-edit-pair) into `CryptidsController`, with a `Views/Cryptids/Edit.cshtml` in the Registry's own style. **[Task 3 in full ↓](#task-3-in-full)** |
| 4 | `AFileCanBeClosed` | Port [the Delete pair](../lecture-notes.md#the-delete-pair), then **delete the scaffold** — the check refuses to pass while it's still standing — and remove the two scaffolding packages. **[Task 4 in full ↓](#task-4-in-full)** |
| 5 | `TheRegistryGrowsTwoColumns` | Two [nullable properties](../lecture-notes.md#nullable-and-why), Latin names and plates in the seed data, and one [additive migration](../lecture-notes.md#the-additive-migration). **[Task 5 in full ↓](#task-5-in-full)** |
| 6 | `ThePlatesAreOnDisplay` | Plates on the cards and details, a featured record on the home page, the new fields on the Edit form — and [the `[Bind]` list](../lecture-notes.md#the-guest-list-bites) lets them through. **[Task 6 in full ↓](#task-6-in-full)** |

### Task 1 in full

**Check 1 is already green** — this task is about your database, which the checks can't see but your browser needs.

**First, the scaffolder tool** — once per machine, like `dotnet-ef`:

```bash
dotnet tool install --global dotnet-aspnet-codegenerator
```

*(Already have it from watching the demo too closely? `dotnet tool update --global dotnet-aspnet-codegenerator` is safe to run regardless.)*

**Then the connection string. From inside `Cryptids.Web`:**

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=<SCHOOL-SQL-SERVER>;Database=Cryptids_<COURSE-NUMBER>_<YOUR-INITIALS>;User ID=<YOUR-USERNAME>;Password=<YOUR-PASSWORD>;TrustServerCertificate=True"
```

Same drill as last week — server, username and password from the handout, quotes around the value, `dotnet user-secrets list` to see what actually landed. **This is a fresh copy of the project, so it needs its own `init` and `set`** — secrets are keyed to the project, not to you.

**The database name is the same one you used last week**, though. The folder is new so you don't overwrite week 7's work, but this is the same application — the Cryptid Registry — and [one application gets one database](../../week-07/lecture-notes.md#naming-your-database).

**Now reset it and rebuild it — two commands:**

```bash
dotnet ef database drop --force
dotnet ef database update
```

*(Didn't finish last week's lab? The drop will tell you there's nothing there. That's fine — carry on.)*

> [!WARNING]
> **The drop is not optional, and this is the only time all semester you should run it.** Your week-7 database was built by *your* migration files, and its `__EFMigrationsHistory` remembers them by name. Tonight's starter ships *its own* migration files, with different names. Point the starter at that database without dropping it first and `database update` fails with **`There is already an object named 'Cryptids'`** — the history and the files can't be reconciled.
>
> **Never do this to your own project's database.** Tonight's is a throwaway you can rebuild from a git clone in one command; your project's holds records you can't get back. There, [a bad migration is fixed by adding another one](../lecture-notes.md#forward-only).
>
> **And it's the *database* you're dropping — not the `Migrations/` folder.** Those files stay exactly where they are; they're what `database update` replays to rebuild the table and the six creatures. Deleting *them* is the move that's gone as of this week.

Watch what those two just did: dropped last week's database, then created it again, built the table and inserted the six creatures — schema *and* data, from files that came to you in a git clone. **The fact that that works is what a migration is:** a database you can carry in a repo.

`dotnet watch`, open `/Cryptids`, count six. Then leave it running.

> [!TIP]
> **On a lab PC that resets when it reboots:** both the tool and your secret are gone next session. Two commands bring them back — the two at the top of this task. Keep your connection string somewhere that isn't this machine.

### Task 2 in full

**No check for this one** — the scaffold is the *reference*, and it'll be deleted in task 4. The point of this task is to watch one command do four weeks of work, and then read it.

**From inside `Cryptids.Web`** (same folder as every `dotnet ef` command):

```bash
dotnet aspnet-codegenerator controller -name CryptidsScaffoldController -m Cryptid -dc CryptidContext --relativeFolderPath Controllers --useDefaultLayout --referenceScriptLibraries
```

Six lines of output: **one controller, five views.** Then:

- **Browse `/CryptidsScaffold`.** A complete working CRUD site — plain tables, none of your styling, all of your creatures.
- **Prove it's your data:** use the scaffold's own Edit page to change a creature's **Reports on file** (the `Sightings` property — `[Display]` is why the label differs), save, then reload `/Cryptids`. The change is on *your* page. Two UIs, one table.
- **Open `Controllers/CryptidsScaffoldController.cs` and skim it.** It's your week-7 controller with armor on — same constructor, same context, async everywhere, plus the Edit and Delete pairs you're about to take. The [notes walk every line](../lecture-notes.md#task-is-a-promise).

| If it says | It means |
|---|---|
| `Could not execute because the specified command or file was not found` | the tool isn't installed on this machine — top of task 1 |
| `...install Entity Framework core packages... Microsoft.EntityFrameworkCore.Tools` | you're in a project without the packages — the starter has them, so check you're inside `Cryptids.Web` |
| `Scaffolding failed: Build failed` | your project doesn't compile; fix that first — the scaffolder builds before it writes |

### Task 3 in full

**Checks:** `Check2_TheEditFormShowsTheRecord` and `Check3_ACorrectionIsSaved`

**Port the Edit pair.** Copy the two `Edit` methods out of `CryptidsScaffoldController` into **`CryptidsController`**, below `Create`. Ported into the Registry's house style (early-out guard instead of the scaffold's nested `if`), they look like this:

```csharp
// GET /Cryptids/Edit/3 — the form, pre-filled with what's on file.
public async Task<IActionResult> Edit(int? id)
{
    if (id == null)
    {
        return NotFound();
    }

    var cryptid = await _context.Cryptids.FindAsync(id);
    if (cryptid == null)
    {
        return NotFound();
    }
    return View(cryptid);
}

// POST /Cryptids/Edit/3 — the corrected record comes back.
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Region,FirstSighting,Sightings,IsDebunked")] Cryptid cryptid)
{
    if (id != cryptid.Id)
    {
        return NotFound();
    }

    if (!ModelState.IsValid)
    {
        return View(cryptid);
    }

    try
    {
        _context.Update(cryptid);
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!CryptidExists(cryptid.Id))
        {
            return NotFound();
        }
        else
        {
            throw;
        }
    }
    return RedirectToAction(nameof(Index));
}

// The helper the catch above calls — it came with the scaffold, and it
// crosses over with the actions, because it's what makes the catch compile.
private bool CryptidExists(int id)
{
    return _context.Cryptids.Any(e => e.Id == id);
}
```

> [!NOTE]
> **That's three things, not two — the `CryptidExists` helper comes across too.** The scaffold's catch calls it, and the scaffolder kept it `private` at the bottom of the controller you delete in task 4. Port the two actions without it and the build stops with *"the name 'CryptidExists' does not exist in the current context."* [Same on your own app in the homework](../lecture-notes.md#what-porting-means).

You'll need one more `using` at the top of the file — let the editor complain about `DbUpdateConcurrencyException` first, then add:

```csharp
using Microsoft.EntityFrameworkCore;
```

**Then the view.** Make `Views/Cryptids/Edit.cshtml` — the scaffold's `Views/CryptidsScaffold/Edit.cshtml` has the mechanics, your `Create.cshtml` has the style, and this is the two combined. **This is the whole file:**

> [!IMPORTANT]
> **Creating a new `.cshtml` makes `dotnet watch` stop and ask to restart** — `Do you want to restart your app? Yes (y) / No (n) / Always (a)`, in the terminal watch is running in. Answer **`a`** and it won't ask again for the rest of the lab. Ignore it and the page fails with **`The view 'Edit' was not found`** — listing the exact path your file is sitting at, because the running app was built before the file existed. The file is fine; the app is old.

```html
@model Cryptid
@{
    ViewData["Title"] = $"Correct: {Model.Name}";
}

<h1>Correct the record ✏️</h1>
<p class="text-muted">Field reports get facts wrong. Fix them here.</p>

<form asp-action="Edit" method="post" class="col-md-6">
    <div asp-validation-summary="ModelOnly" class="text-danger"></div>

    <input type="hidden" asp-for="Id" />

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

    <button type="submit" class="btn btn-primary">Save the correction</button>
    <a asp-action="Details" asp-route-id="@Model.Id" class="btn btn-link">Cancel</a>
</form>

@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

- **The hidden `Id` is the one line your Create form never had** — [it's how the POST carries its own identity](../lecture-notes.md#the-hidden-id), instead of depending on the URL's shape. Check 2 looks for it by name; leave it out and check 3 catches the duplicate record you get instead.
- The `[Bind]` list is [the guest list from the notes](../lecture-notes.md#the-guest-list) — six names now. **Task 6 comes back for it.**

**Last, the way in.** In `Views/Cryptids/Details.cshtml`, below the badge, add:

```html
<div class="mt-4">
    <a asp-action="Edit" asp-route-id="@Model.Id" class="btn btn-secondary">✏️ Correct the record</a>
</div>
```

Correct a record in the browser — change Mothman's **Reports on file** box, watch the `UPDATE ... WHERE` in the terminal — then `dotnet test Cryptids.Checks`: **3 / 6.**

> [!NOTE]
> **Looking for a "Sightings" field? There isn't one on screen.** The property is `Sightings`, but it carries `[Display(Name = "Reports on file")]`, and that's what the label renders — same `[Display]` you met in week 6. The C# name is what you write in `asp-for`; the display name is what the page shows.

### Task 4 in full

**Check:** `Check4_AFileCanBeClosed`

**Port the Delete pair** into `CryptidsController`, below Edit:

```csharp
// GET /Cryptids/Delete/5 — show what's about to go, and ask first.
public async Task<IActionResult> Delete(int? id)
{
    if (id == null)
    {
        return NotFound();
    }

    var cryptid = await _context.Cryptids.FirstOrDefaultAsync(c => c.Id == id);
    if (cryptid == null)
    {
        return NotFound();
    }

    return View(cryptid);
}

// POST /Cryptids/Delete/5 — the actual deletion.
[HttpPost, ActionName("Delete")]
[ValidateAntiForgeryToken]
public async Task<IActionResult> DeleteConfirmed(int id)
{
    var cryptid = await _context.Cryptids.FindAsync(id);
    if (cryptid != null)
    {
        _context.Cryptids.Remove(cryptid);
    }

    await _context.SaveChangesAsync();
    return RedirectToAction(nameof(Index));
}
```

- **Why two actions:** [a GET must never change data](../lecture-notes.md#why-delete-asks-first) — the GET shows a confirmation page; only the POST deletes. Check 4 tests this literally: it loads your confirmation page and then verifies the record is *still there*.
- **Why `DeleteConfirmed`:** [two methods can't share a name and a signature](../lecture-notes.md#deleteconfirmed-and-why-its-named-that) — `[ActionName("Delete")]` keeps its URL honest. Port both attributes.

**The confirmation view** — `Views/Cryptids/Delete.cshtml`, the whole file. Ours shows the creature's own card:

```html
@model Cryptid
@{
    ViewData["Title"] = $"Close the file: {Model.Name}";
}

<h1>Close the file 🗑️</h1>
<p class="text-muted">This removes the record from the registry for good. There is no undo.</p>

<div class="col-md-4 mb-4">
    <partial name="_CryptidCard" model="Model" />
</div>

<form asp-action="Delete" method="post">
    <input type="hidden" asp-for="Id" />
    <button type="submit" class="btn btn-danger">Close the file</button>
    <a asp-action="Details" asp-route-id="@Model.Id" class="btn btn-link">Keep it</a>
</form>
```

**The way in**, next to Edit on the Details page:

```html
<a asp-action="Delete" asp-route-id="@Model.Id" class="btn btn-outline-danger">🗑️ Close the file</a>
```

*(Both buttons in the same `mt-4` div reads nicely.)*

**Try it:** file a fake report through your Create form, then close its file. Watch the `DELETE ... WHERE` in the terminal. Your six seeded creatures aren't precious — this database rebuilds from migrations — but deleting the fake keeps the next checks' counts obvious.

---

**Then the scaffold comes down.** Delete **`Controllers/CryptidsScaffoldController.cs`** and the whole **`Views/CryptidsScaffold/`** folder. It was the reference; everything worth keeping has been ported, and what's left is an unthemed second UI nobody maintains.

> [!WARNING]
> **Restart after deleting it** — `Ctrl+C`, then `dotnet watch`. Deleting a class is a rude edit: `dotnet watch` prints `ENC0033` and keeps serving the old build, exactly like week 7's `CryptidData.cs` deletion.

**Then the tool goes back in the box.** The generated files are gone; the machinery that wrote them is still in your `.csproj`. From inside `Cryptids.Web`:

```bash
dotnet remove package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet remove package Microsoft.EntityFrameworkCore.Tools
```

**The yellow `NU1901` warnings you've had since your first build stop.** They came from packages the scaffolder brought with it — [a build-time tool you've finished with isn't a dependency](../lecture-notes.md#and-the-tool-goes-back-in-the-box).

> [!IMPORTANT]
> **Remove those two and nothing else. `Microsoft.EntityFrameworkCore.Design` stays** — that's what `dotnet ef` runs on, and task 5's `migrations add` needs it. It came with week 7's database, not with the scaffolder.

`dotnet test Cryptids.Checks`: **4 / 6** — and that's tonight's in-class target. 🎉 The rest is the plates.

### Task 5 in full

**Check:** `Check5_TheRegistryGrowsTwoColumns`

The archive has turned up **six field-guide plates** — children's drawings of the six original creatures, collected over most of a century. They're already in `wwwroot/img/cryptids/`, along with an *artist unknown* placeholder for records that have no art. To display them, the table needs two new columns.

**The model first.** In `Models/Cryptid.cs`, below `IsDebunked`:

```csharp
[Display(Name = "Latin name")]
[StringLength(80)]
public string? LatinName { get; set; }

[Display(Name = "Plate image")]
[StringLength(200)]
public string? ImageUrl { get; set; }
```

**Both nullable, and [the `?` is the point](../lecture-notes.md#nullable-and-why):** the table already has rows, and every record filed through your form arrives without a Latin name or a plate. Nullable says that's normal, not broken. (Check 5 verifies the `?` is really there.)

**Then the seed data.** In `Data/CryptidContext.cs`, the six archive records get their plates — **replace the `HasData` call with this one** (the Latin names are checked letter-for-letter, so paste rather than retype):

```csharp
modelBuilder.Entity<Cryptid>().HasData(
    new Cryptid { Id = 1, Name = "The Hodag", Region = "Rhinelander, Wisconsin", FirstSighting = 1893, Sightings = 47, IsDebunked = true, LatinName = "Bovine spiritus", ImageUrl = "/img/cryptids/hodag.webp" },
    new Cryptid { Id = 2, Name = "Bigfoot", Region = "Pacific Northwest", FirstSighting = 1958, Sightings = 1204, IsDebunked = false, LatinName = "Gigantopithecus canadensis", ImageUrl = "/img/cryptids/bigfoot.webp" },
    new Cryptid { Id = 3, Name = "Mothman", Region = "Point Pleasant, WV", FirstSighting = 1966, Sightings = 102, IsDebunked = false, LatinName = "Noctua pontiensis", ImageUrl = "/img/cryptids/mothman.webp" },
    new Cryptid { Id = 4, Name = "The Loch Ness Monster", Region = "Loch Ness, Scotland", FirstSighting = 565, Sightings = 1131, IsDebunked = false, LatinName = "Nessiteras rhombopteryx", ImageUrl = "/img/cryptids/lochness.webp" },
    new Cryptid { Id = 5, Name = "The Jersey Devil", Region = "Pine Barrens, NJ", FirstSighting = 1735, Sightings = 287, IsDebunked = false, LatinName = "Diabolus pinorum", ImageUrl = "/img/cryptids/jerseydevil.webp" },
    new Cryptid { Id = 6, Name = "Chupacabra", Region = "Puerto Rico", FirstSighting = 1995, Sightings = 214, IsDebunked = true, LatinName = "Caprivorus portoricensis", ImageUrl = "/img/cryptids/chupacabra.webp" }
);
```

*(Two of those Latin names are real. Worth a search sometime — one of them is an anagram.)*

**Then the migration — additive, from inside `Cryptids.Web`:**

```bash
dotnet ef migrations add AddFieldGuidePlates
dotnet ef database update
```

Two things worth reading before you move on:

- **EF prints** *"An operation was scaffolded that may result in the loss of data."* — [it's talking about the `Down` method](../lecture-notes.md#the-additive-migration), which would drop the columns. The `Up` is safe.
- **Open the migration file:** two `AddColumn`s and six `UpdateData`s. No `CreateTable`. It's a diff against the snapshot — schema *and* data.

> [!CAUTION]
> **The week-7 reset button is gone.** Last week a broken migration meant "delete the `Migrations` folder and regenerate." **Not any more:** your table has rows, and your database's `__EFMigrationsHistory` remembers the old files by name. [Migrations are forward-only now](../lecture-notes.md#forward-only) — you fix a migration by adding another one. Check 5 enforces the additive shape.

`dotnet test Cryptids.Checks`: **5 / 6.** *(Your browser still shows no plates — nothing renders `ImageUrl` yet. That's task 6, and it's exactly the gap week 7 taught you to expect: the database is ahead of the pages.)*

### Task 6 in full

**Check:** `Check6_ThePlatesAreOnDisplay`

Four small view jobs, and one attribute that will try to sabotage you.

**1. The card.** In `Views/Shared/_CryptidCard.cshtml`, add the plate at the top of the card and the Latin name under the title:

```html
@model Cryptid

<div class="card cryptid-card h-100">
    <img src="@(Model.ImageUrl ?? "/img/cryptids/unillustrated.webp")" class="card-img-top" alt="Field-guide plate: @Model.Name" />
    <div class="card-body">
        <h5 class="card-title">@Model.Name</h5>
        @if (Model.LatinName != null)
        {
            <h6 class="card-subtitle mb-1 fst-italic text-muted">@Model.LatinName</h6>
        }
        <h6 class="card-subtitle mb-2 text-muted">@Model.Region</h6>
        <p class="card-text">First sighted @Model.FirstSighting · @Model.Sightings reports</p>
        @if (Model.IsDebunked)
        {
            <span class="badge bg-danger">💀 Debunked</span>
        }
        else
        {
            <span class="badge bg-success">👀 Unconfirmed</span>
        }
    </div>
    <div class="card-footer">
        <a href="/Cryptids/Details/@Model.Id">Details</a>
    </div>
</div>
```

**The `??` is the null-safety this was all for:** a record with no plate shows the *artist unknown* placeholder instead of a broken image. File a report through your form and look at its card — that's the placeholder working, and check 6 does exactly that.

**2. Details.** `Views/Cryptids/Details.cshtml` gets the plate on the left and the facts on the right. **Two different things happen here:** everything already on the page *moves* into the right-hand column, and the **Latin name is new** — it didn't exist before task 5, so it isn't something you're moving.

**This is the whole file:**

```html
@model Cryptid
@{
    ViewData["Title"] = Model.Name;
}

<div class="row">
    <div class="col-md-5">
        <img src="@(Model.ImageUrl ?? "/img/cryptids/unillustrated.webp")" class="img-fluid rounded mb-3" alt="Field-guide plate: @Model.Name" />
    </div>
    <div class="col-md-7">
        <h1>@Model.Name</h1>
        @if (Model.LatinName != null)
        {
            <p class="fst-italic text-muted">@Model.LatinName</p>
        }
        <p class="lead">@Model.Region · first sighted @Model.FirstSighting</p>
        <p>@Model.Sightings reports on file.</p>

        @if (Model.IsDebunked)
        {
            <p><span class="badge bg-danger">💀 Debunked</span></p>
        }
        else
        {
            <p><span class="badge bg-success">👀 Unconfirmed</span></p>
        }

        <div class="mt-4">
            <a asp-action="Edit" asp-route-id="@Model.Id" class="btn btn-secondary">✏️ Correct the record</a>
            <a asp-action="Delete" asp-route-id="@Model.Id" class="btn btn-outline-danger">🗑️ Close the file</a>
        </div>

        <p class="mt-4"><a href="/Cryptids">← Back to the registry</a></p>
    </div>
</div>

@section Scripts {
    <script>
        console.log("Cryptid file loaded: @Model.Name");
    </script>
}
```

**The `@if` on the Latin name is the same `?` from task 5 earning its keep** — records filed through your form have no Latin name, and a blank italic line under the heading would look like a bug. The plate uses `??` for the same reason one line above.

**3. The home page gets a featured record** — and this is [the "views don't read data" rule](../../week-07/lecture-notes.md#the-line-you-delete) done properly: the query lives in the controller. **`Controllers/HomeController.cs`** gets the same constructor move as `CryptidsController`:

```csharp
private readonly CryptidContext _context;

public HomeController(CryptidContext context)
{
    _context = context;
}

public async Task<IActionResult> Index()
{
    // One random record, chosen by the database — this becomes ORDER BY NEWID().
    var featured = await _context.Cryptids
        .OrderBy(c => Guid.NewGuid())
        .FirstOrDefaultAsync();

    return View(featured);
}
```

*(Plus `using Microsoft.EntityFrameworkCore;`, `using Cryptids.Web.Data;` up top.)* And **`Views/Home/Index.cshtml`** renders it — the whole file:

```html
@model Cryptid?
@{
    ViewData["Title"] = "Home";
}

<div class="text-center">
    <h1 class="display-4">Cryptid Registry</h1>
    <p class="lead">Creatures of uncertain existence, catalogued with unwarranted confidence.</p>

    @if (Model != null)
    {
        <div class="col-md-4 mx-auto my-4 text-start">
            <partial name="_CryptidCard" model="Model" />
        </div>
        <p class="text-muted">Pulled from the files at random — refresh for another.</p>
    }

    <a asp-controller="Cryptids" asp-action="Index" class="btn btn-primary btn-lg mt-3">Open the registry 👻</a>
</div>
```

**4. The Edit form learns the new fields.** The scaffold generated your Edit view *before* these columns existed — **views don't update themselves when the model grows.** In `Views/Cryptids/Edit.cshtml`, add two blocks (Latin name after Name reads well; plate image after Sightings):

```html
<div class="mb-3">
    <label asp-for="LatinName" class="form-label"></label>
    <input asp-for="LatinName" class="form-control" />
    <span asp-validation-for="LatinName" class="text-danger"></span>
</div>
```

```html
<div class="mb-3">
    <label asp-for="ImageUrl" class="form-label"></label>
    <input asp-for="ImageUrl" class="form-control" />
    <span asp-validation-for="ImageUrl" class="text-danger"></span>
</div>
```

> [!CAUTION]
> **And the `[Bind]` list on your Edit POST — this is the saboteur.** Add the two names:
>
> ```csharp
> [Bind("Id,Name,Region,FirstSighting,Sightings,IsDebunked,LatinName,ImageUrl")]
> ```
>
> Skip this and the form *looks* perfect — but [the guest list drops the unbound fields and `Update` writes the resulting nulls](../lecture-notes.md#the-guest-list-bites), so saving an edit **erases** a record's Latin name and plate. Silently. Check 6 catches it by editing The Hodag's Latin name through your form and reading what actually landed.
>
> ⚠️ **Then restart — `Ctrl+C`, `dotnet watch`.** You changed *only* an attribute, and MVC reads each action's binding from its attributes at startup, so hot reload can report success and keep the old list. Re-test without restarting and the erase can happen again **with the correct fix already in place** — which sends you hunting a bug you've already fixed.

**Try the whole thing:** reload `/Cryptids` — six plates. Home page — a random creature, plate and all. Edit The Hodag, refine its Latin name, save — it sticks. File a fresh report — *artist unknown*.

`dotnet test Cryptids.Checks`: **6 / 6.** The Registry has a corrections desk and an illustrated archive. 🎉

## Rules

> [!IMPORTANT]
> - **Never edit `Cryptids.Checks`** — it's the grading contract. All work happens in `Cryptids.Web`.
> - Don't remove the `public partial class Program { }` line at the bottom of `Program.cs` — the checks need it to see your app.
> - Don't rename `CryptidsController` or the `Cryptid` properties. The checks read them by name.
> - Don't hand-write migration files — and from this week, **don't delete the `Migrations` folder either.** Forward only.

## 🆘 Stuck?

- **`Could not execute because the specified command or file was not found`** running the scaffolder — the tool isn't on this machine: `dotnet tool install --global dotnet-aspnet-codegenerator`. Frozen lab PCs lose it on reboot.
- **`...install Entity Framework core packages and try again: Microsoft.EntityFrameworkCore.Tools`** — you're not inside `Cryptids.Web` (the starter has the packages), or in the homework, your own app doesn't have them yet.
- **`Scaffolding failed: Build failed`** — the scaffolder compiles first. `dotnet build` shows the real error; fix it, scaffold again.
- **`There is already an object named 'Cryptids'`** on `database update` — you skipped task 1's `dotnet ef database drop --force`, so your **week-7 tables and migration history are still there**. Run the drop, then `database update` again. (Only ever in this lab — never on your own project's database.)
- **Saving an edit returns 404** — the posted `Id` and the URL's id genuinely disagree (a hand-edited hidden input, or a stale form), or the record was deleted while your form was open — that second one is the concurrency catch working. A *missing* hidden `Id` doesn't cause this; the binder falls back to the URL.
- **Saving an edit added a second creature instead of correcting the first** — no hidden `Id` **and** no id in the form's action, so the POST arrived with `Id = 0`; `Update()` treats an unset key as new and inserts. One line: `<input type="hidden" asp-for="Id" />`. Check 3 catches this by counting records.
- **An edit redirects but nothing changed** — `Update` only marks; the write is `await _context.SaveChangesAsync();`.
- **Editing created a duplicate instead** — the POST calls `Add` somewhere. An edit goes through `Update`.
- **Saving an edit erased the Latin name / plate** — the `[Bind]` list doesn't include the new names. Task 6's caution block is the fix, and this is *the* silent bug of the week.
- **`The view 'Edit' was not found`, and the file *is* right there** — **look at your `dotnet watch` terminal.** Creating a new `.cshtml` is a change hot reload can't apply (`ENC0021`), so watch stops and asks **`Do you want to restart your app? Yes (y) / No (n) / Always (a)`** — and until you answer it, the app keeps serving the build from before your file existed. Press **`a`** and it stops asking for the rest of the lab. **Don't move the file; it's in the right place.**
- **`The view 'Edit' was not found`, and the file genuinely isn't there** — it belongs at `Views/Cryptids/Edit.cshtml` (same for `Delete.cshtml`). Check the spelling and the folder before you blame the reload.
- **POSTing the delete returns 405** — the POST half is missing or lost its `[ActionName("Delete")]`. Port `DeleteConfirmed` with both attributes.
- **"already defines a member called 'Delete'"** — you named the POST `Delete` too. That's why the scaffold's is `DeleteConfirmed`.
- **Check 4 is red but delete works in the browser** — read the message: the scaffold controller is still in the project. Task 4 ends by deleting it (and restarting).
- **`The model for context 'CryptidContext' has pending changes`** — you edited the model after generating the migration. Add another: `dotnet ef migrations add WhatYouChanged`. Forward only.
- **The plates 404 in the browser** — the `src` should start `/img/cryptids/` (leading slash, no `wwwroot`). The files are already in the starter; nothing needs downloading.
- **Home page throws `Unable to resolve service`** — `HomeController` asks for the context now; that's fine ([the one registration](../../week-07/lecture-notes.md#one-registration) in `Program.cs` covers every controller, and it shipped with the starter), but check the constructor's parameter type is `CryptidContext`.
- The [troubleshooting appendix](../lecture-notes.md#appendix-troubleshooting) covers the rest.

## 🚀 Done early?

- **Redirect a correction somewhere smarter.** `RedirectToAction(nameof(Details), new { id = cryptid.Id })` after an edit drops you back on the record you just fixed — arguably better than the list. Your call; it's your app.
- **Produce the deleted-under-you 404 on purpose.** Edit form open in one tab, close the file in another, then save the edit. That's the `DbUpdateConcurrencyException` catch you ported, earning its keep.
- **Read the UPDATE closely.** Edit a record and look at the SQL: every column is in the SET clause, not just the one you changed. That's `Update()` marking the whole record — and it's why the `[Bind]` bite writes nulls instead of keeping old values.
- **Make the reads async too.** `Index` and `Details` still run week 7's sync code, which is fine — but converting them (`ToListAsync`, `FirstOrDefaultAsync`, `async Task<IActionResult>`) is good practice for the homework.
- **Attach the debugger to the Registry.** Breakpoint on the Edit guard, correct a record, and walk the Variables panel — same moves as the demo, your app.
