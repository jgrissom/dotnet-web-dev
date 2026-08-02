# Week 8 — Lecture Notes

> Last week the data left the process, and the reload that used to lose everything stopped mattering. You have half of CRUD: you can **C**reate records and **R**ead them. Tonight is **U**pdate and **D**elete — and the headline is that you won't write most of it. A tool will. The real skill tonight is *reading what it wrote*, deciding what to keep, and knowing the two places where its defaults will quietly bite you.

## Part 1: Where we left off (15 min)

### The foundation, restated

Restart the app. Reload. Seven trucks. Last week that was the whole show; this week it's just true, and everything tonight builds on it without ceremony.

In CRUD terms, here's the ledger:

| Letter | You have | Since |
|---|---|---|
| **C**reate | the form, the guard, `Add` + `SaveChanges` | weeks 6–7 |
| **R**ead | `ToList` on the index, `FirstOrDefault` on details | weeks 4–7 |
| **U**pdate | — | tonight |
| **D**elete | — | tonight |

### What Edit needs

The reading asked you to put your Create form and its POST action side by side and work out what would have to change for Edit. The list is short and every item matters:

1. **The form arrives pre-filled.** Create hands the browser an empty form; Edit has to look the record up first and hand over what's already true.
2. **The app has to know *which* record.** Create makes a new one; Edit is aimed at an existing row.
3. **The save is an UPDATE, not an INSERT.** Same guard, same redirect — different SQL.

And the follow-up question, which is the interesting one: *when you hit Save on an edit, how does the app know which record you meant?* Your Create form never sends an Id. Hold that — the answer turns out to be one line long, and it's in Part 3.

## Part 2: The scaffolder (part of 30 min with Part 3)

### Two packages and a tool

The scaffolder isn't in the box either. Two packages, from inside your **web project** folder:

```bash
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
```

- **`CodeGeneration.Design`** is the scaffolder itself — the templates and the machinery that writes files.
- **`EntityFrameworkCore.Tools`** is the part that reads your `DbContext` at design time. Skip it and the scaffolder stops immediately with an error that names it:

  ```
  To scaffold controllers and views using models, install Entity Framework core
  packages and try again: Microsoft.EntityFrameworkCore.Tools
  ```

  Like week 7's `.Design` message: unusually helpful, as errors go.

And the command-line tool, **once per machine** — the same deal as `dotnet-ef`:

```bash
dotnet tool install --global dotnet-aspnet-codegenerator
```

Already have it? `dotnet tool update --global dotnet-aspnet-codegenerator`. A 9.x tool against a 10.x SDK fails with a runtime error — same version-skew family as last week.

> [!TIP]
> **On a lab PC that resets when it reboots, the tool is gone next session** — it installs to your user profile, exactly like your secrets. Both restore in under a minute, and the lab README opens with the commands.

### The command, piece by piece

```bash
dotnet aspnet-codegenerator controller -name TrucksScaffoldController -m Truck -dc CurbsideContext --relativeFolderPath Controllers --useDefaultLayout --referenceScriptLibraries
```

Long, but every piece is a question you can answer:

| Piece | The question it answers |
|---|---|
| `controller` | generate what? A controller (and its views) |
| `-name TrucksScaffoldController` | called what? |
| `-m Truck` | for which **m**odel? |
| `-dc CurbsideContext` | through which **d**b**c**ontext? |
| `--relativeFolderPath Controllers` | put the file where? |
| `--useDefaultLayout` | views use `_Layout` — so they land inside your theme's shell |
| `--referenceScriptLibraries` | forms get the `_ValidationScriptsPartial` section, like your Create |

Three seconds later:

```
Added Controller : '/Controllers/TrucksScaffoldController.cs'.
Added View : /Views/TrucksScaffold/Create.cshtml
Added View : /Views/TrucksScaffold/Edit.cshtml
Added View : /Views/TrucksScaffold/Details.cshtml
Added View : /Views/TrucksScaffold/Delete.cshtml
Added View : /Views/TrucksScaffold/Index.cshtml
```

One controller, five views, and `/TrucksScaffold` is a complete working CRUD site — plain Bootstrap tables inside your layout, none of your card markup, all of your data.

**Prove it's really your data:** edit a truck through the scaffold's own Edit page, then reload `/Trucks`. The change is there. Two UIs, one table. The generated pages and your hand-built pages are the same kind of thing talking to the same database — which is precisely why the generated code is worth reading.

### What it wrote — and what it didn't

The deflating question first: if one command writes all this, why did you spend four weeks?

Because the command wrote *none of the decisions*:

- **Your model and its rules** — week 6. The scaffolder read `[Required]` and `[StringLength]` off your properties; it didn't invent them.
- **Your theme, your layout, your cards** — week 5. The scaffold's views are the plain proof of what your styling is worth.
- **Your seed data and migrations** — week 7. It touched none of it.
- **What the app even is** — week 4. `-m Truck -dc CurbsideContext` is you telling it everything it knows.

It wrote the plumbing around your decisions. And — the part that matters tonight — every line it generated is a line you can now read, which is what the next section is.

## Part 3: Reading what it wrote (the other half of 30 min)

Open `Controllers/TrucksScaffoldController.cs`. First impression before any details: **it's your week-7 controller with armor on.** Same constructor injection, same context, same five actions plus three new ones, more checks around everything.

### Task is a Promise

The first difference is on every method:

```csharp
public async Task<IActionResult> Index()
{
    return View(await _context.Trucks.ToListAsync());
}
```

You already know this material — you've written it in JavaScript for two semesters:

| C# | JavaScript you've written |
|---|---|
| `Task<IActionResult>` | `Promise<result>` |
| `await _context.Trucks.ToListAsync()` | `await fetch(url)` |
| `async` on the method | `async` on the function |

`await` is `await`. The method is marked `async`, the query methods grow an `Async` suffix (`ToListAsync`, `FirstOrDefaultAsync`, `SaveChangesAsync`), and that's the entire mechanical difference.

**Why bother?** One sentence's worth: while SQL Server is thinking, an `await`ed request lets go of its thread, so the server can handle other people instead of holding a thread hostage per waiting query. Under load, that's the difference between queueing and keeping up.

**The honest rule for this course:** your week-7 synchronous code is not wrong and does not need rewriting. The scaffolder writes async, so *new* actions from tonight are async. Both styles run side by side in one controller without complaint.

> [!NOTE]
> **The generated `Create()` GET is still synchronous** — look at it. It touches no database; there's nothing to await. `async` isn't a costume the tool puts on every method; it marks the ones that actually wait for something. That's the rule to internalize, and the scaffolder follows it.

### The Edit pair

```csharp
// GET: TrucksScaffold/Edit/5
public async Task<IActionResult> Edit(int? id)
{
    if (id == null)
    {
        return NotFound();
    }

    var truck = await _context.Trucks.FindAsync(id);
    if (truck == null)
    {
        return NotFound();
    }
    return View(truck);
}
```

Three stops:

- **`int? id`** — defensive. `/TrucksScaffold/Edit` with no number at all binds `null`, and null gets an honest 404 instead of a crash. (Your week-7 `Details(int id)` handles the same case by a different path — a missing value binds `0`, no truck has id 0, `NotFound()`. Both are fine; the scaffolder's version says what it means.)
- **`FindAsync(id)`** — fetch one row by primary key. It's the async single-row cousin of the `FirstOrDefault` you already write; you'll see `FirstOrDefaultAsync` in the same file doing the same job with a full predicate.
- **`return View(truck)`** — the entire "pre-filled form" feature. Look the record up, hand it to the view; the tag helpers do the filling, exactly as they did in week 6 when Create's guard handed back your typed input.

### The hidden Id

Open `Views/TrucksScaffold/Edit.cshtml`. It's your Create form's shape in plain clothes — validation summary, a labelled input per property, validation spans, a Scripts section — plus one line your Create form never had:

```html
<input type="hidden" asp-for="Id" />
```

**That's the answer to the reading question.** The form carries the record's identity in its pocket. The whole round trip:

```
URL /Trucks/Edit/8  →  FindAsync(8)  →  model  →  hidden input
      →  POST  →  model binder  →  truck.Id == 8
```

The GET put the id into the page; the browser sends it back with everything else; the binder reads it into `truck.Id`. One input, no pixels.

And now the first line of the POST makes sense:

```csharp
public async Task<IActionResult> Edit(int id, [Bind(...)] Truck truck)
{
    if (id != truck.Id)
    {
        return NotFound();
    }
```

Two ids arrive — one in the URL, one in the form — and the first thing the action does is check they agree. If they don't, someone's tampering or something's broken, and either way the answer is no.

**So what happens if the hidden input goes missing?** Less than you'd expect, and the precise answer is worth having. The binder looks for `Id` in the form **and** in the route, so a form posting to `/Trucks/Edit/8` still arrives with `truck.Id = 8` — taken from the URL — and the edit saves correctly. The guard doesn't fire, because the two ids agree.

The line earns its keep when the URL *can't* answer. A form whose action carries no id posts `Id = 0`, and `_context.Update()` treats an **unset key as a new record** — so instead of correcting record 8 you quietly gain a second one. No error, no 404; just a duplicate in the list. Keep the hidden input and the form never depends on the URL's shape.

### The guest list

The POST's signature carries an attribute you haven't seen:

```csharp
[Bind("Id,Name,Cuisine,City,Rating,IsOpenLate")]
```

The scaffolder documents it in a comment right above — *"To protect from overposting attacks, enable the specific properties you want to bind to"* — and the mental model is a **guest list**: the model binder reads *only* the listed names out of the form. Anything else in the POST is ignored, no matter what a hand-written request claims.

Why that matters, in one hypothetical: imagine `Truck` had an `IsAdmin` property. You'd never put a box for it on the form — but a crafted POST can send `IsAdmin=true` anyway, and without a list the binder would obligingly set it. The guest list stops fields you didn't offer from being smuggled in.

> [!WARNING]
> **A guest list has a failure mode, and it's silent.** When your model grows a property, the new name is not on the list — and what happens then is worse than "the field doesn't save." Part 8 stages it. For now, just remember the list exists.

### Update marks, SaveChanges writes

The body of the POST:

```csharp
_context.Update(truck);
await _context.SaveChangesAsync();
```

The same two-step as `Add`, and the same rule from week 7: **the first line marks, the second line writes.** `Update(truck)` tells the context "treat this whole record as modified" — no SQL happens. `SaveChangesAsync()` is the round trip; the `UPDATE ... WHERE [Id] = @p` runs there, and the terminal shows it.

In Part 5 you'll watch the gap between those two lines through a debugger, which is the closest this course gets to proving a negative.

### The catch that answers a deletion

```csharp
catch (DbUpdateConcurrencyException)
{
    if (!TruckExists(truck.Id))
    {
        return NotFound();
    }
    else
    {
        throw;
    }
}
```

Here's what this actually catches in your app: **the UPDATE went looking for the row and found nothing** — because the record was deleted while the form was open. EF expected to update one row, updated zero, and threw. The catch asks "does this record still exist?", and if not, answers 404 instead of crashing.

That's it. It is not magic conflict-detection — two people *editing* the same record just means the last save wins, silently. What it handles is the deleted-under-you case, and once Delete exists (Part 6) you can produce that case with two browser tabs. The scaffold shipped with the answer to a question you didn't know to ask yet.

## Part 4: Porting Edit (20 min)

### What porting means

The scaffold is a **reference, not a foundation**. Its controller and views work, but they're not *yours* — plain tables where you have cards, `form-group` where your forms say `mb-3`, "Back to List" where your app has a voice. The move is:

1. Copy the **actions** across — their logic is right and hard-won.
2. Rebuild the **views** in your own markup, keeping the scaffold's *mechanics* (the hidden `Id`, the tag helpers, the validation spans, the Scripts section).
3. When it's all ported, **delete the scaffold** (Part 7).

You're allowed to make the code yours as it crosses. Curbside's port flips the scaffold's nested `if (ModelState.IsValid)` into the early-out guard our Create has always used — same logic, house style.

### The Edit actions

These go **inside `TrucksController`**, below Create — plus `using Microsoft.EntityFrameworkCore;` at the top of the file, which `DbUpdateConcurrencyException` needs:

```csharp
// GET /Trucks/Edit/3 — the form, pre-filled with what's on file.
public async Task<IActionResult> Edit(int? id)
{
    if (id == null)
    {
        return NotFound();
    }

    var truck = await _context.Trucks.FindAsync(id);
    if (truck == null)
    {
        return NotFound();
    }
    return View(truck);
}

// POST /Trucks/Edit/3 — the corrected record comes back.
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Cuisine,City,Rating,IsOpenLate")] Truck truck)
{
    if (id != truck.Id)
    {
        return NotFound();
    }

    if (!ModelState.IsValid)
    {
        return View(truck);
    }

    try
    {
        _context.Update(truck);
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!_context.Trucks.Any(t => t.Id == truck.Id))
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
```

### The Edit view

**This is the whole file — `Views/Trucks/Edit.cshtml`**, in Curbside's own markup. Compare it to the scaffold's: the mechanics are identical, the clothes are ours.

```html
@model Truck
@{
    ViewData["Title"] = $"Edit: {Model.Name}";
}

<h1>Edit this truck ✏️</h1>

<form asp-action="Edit" method="post" class="col-md-6">
    <div asp-validation-summary="ModelOnly" class="text-danger"></div>

    <input type="hidden" asp-for="Id" />

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

    <button type="submit" class="btn btn-primary">Save changes</button>
    <a asp-action="Details" asp-route-id="@Model.Id" class="btn btn-link">Cancel</a>
</form>

@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

Week 6's client-side validation comes along for free — the annotations on `Truck` render the same `data-val-*` attributes on this form as on Create's.

### The way in

A form nobody can reach doesn't exist. In `Views/Trucks/Details.cshtml`, under the badge block:

```html
<p><a asp-action="Edit" asp-route-id="@Model.Id" class="btn btn-secondary">✏️ Edit this truck</a></p>
```

## Part 5: The debugger, finally (15 min)

### Attach to the process

Since week 1 you've technically had a debugger, and this course has never needed it — `Console.WriteLine` and the SQL log answered every question. Tonight there's finally a question they can't answer: **what does the object look like in the moment between the form and the database?**

`dotnet watch` owns the app, so you don't launch a second copy — you **attach** to the one that's running:

1. **⇧⌘P** (Ctrl+Shift+P on Windows) → **"Debug: Attach to a .NET 5+ or .NET Core process"**
2. Type the app's name — **Curbside** — and pick the process. (Two may match: `dotnet watch` is the watcher; **the one named like your app is the app.**)
3. Click in the gutter next to the `if (id != truck.Id)` line of the Edit POST — a red dot. That's the breakpoint.

> [!WARNING]
> **Attach *after* your last code edit.** Every save makes `dotnet watch` rebuild, and a breakpoint set against a build that's been replaced shows as a **hollow circle** and never fires. If that happens: detach (**⇧F5**), let the rebuild finish, re-attach. This is the number-one "the debugger doesn't work" report, and it isn't the debugger.

### What to look at

Submit an edit in the browser. VS Code takes the screen mid-request, paused on your breakpoint. Worth the trip:

- **`truck` in the Variables panel.** Name, Cuisine, City, Rating, Id — that object didn't exist a millisecond ago; model binding built it out of the form. In week 6 you took that on faith. There it is.
- **Hover `ModelState`** → `IsValid: true`. The guard you're paused on reads this.
- **F10** (step over) down to `_context.Update(truck)`, and past it — then look at the terminal: **no SQL.** Marked, not written.
- **F10** over `await _context.SaveChangesAsync()` — **the UPDATE appears.** That line is the database call; everything else was bookkeeping.
- **F5** to let the request finish, **⇧F5** to detach.

You just watched the gap where week 7's silent bug lived — the redirect-but-nothing-saved failure was code that never crossed that gap.

### When to reach for it

Any time the question is *"what is this object right now?"* — a form that binds zeros, a guard that fails when you're sure it shouldn't, a value that's right in the view and wrong in the database. Attach, breakpoint, look. It's faster than ten `Console.WriteLine`s and it can't lie to you.

For everything else, the terminal is still the right tool — the SQL log needs no setup and reads at a glance.

## Part 6: Delete asks first (20 min)

### Why Delete asks first

Delete *could* be one link — click it, record's gone. Nobody builds it that way, for a rule you already know from week 6:

**A GET must never change data.**

Link previews, browser prefetch, crawlers, a curious extension — things you don't control follow links all day. If following a link deletes a truck, your data belongs to whoever renders your page. So:

- **GET `/Trucks/Delete/5`** shows a confirmation page: *here's what's about to die, are you sure?* It changes nothing.
- **POST `/Trucks/Delete/5`** — the button on that page — does the deleting.

Two requests, on purpose. The GET is the question; the POST is the answer.

### The Delete pair

Into `TrucksController`, below Edit:

```csharp
// GET /Trucks/Delete/5 — show what's about to go, and ask first.
public async Task<IActionResult> Delete(int? id)
{
    if (id == null)
    {
        return NotFound();
    }

    var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.Id == id);
    if (truck == null)
    {
        return NotFound();
    }

    return View(truck);
}

// POST /Trucks/Delete/5 — the actual deletion.
[HttpPost, ActionName("Delete")]
[ValidateAntiForgeryToken]
public async Task<IActionResult> DeleteConfirmed(int id)
{
    var truck = await _context.Trucks.FindAsync(id);
    if (truck != null)
    {
        _context.Trucks.Remove(truck);
    }

    await _context.SaveChangesAsync();
    return RedirectToAction(nameof(Index));
}
```

`Remove` + `SaveChangesAsync` is the two-step a third time: mark, then write. The terminal shows the `DELETE ... WHERE [Id] = @p0`.

### DeleteConfirmed, and why it's named that

The GET is `Delete(int? id)`. The POST *wants* to be `Delete(int id)` — but two methods with the same name and the same parameter list won't compile, and `int?` vs `int` isn't different enough to save it. So the scaffolder renames the POST to `DeleteConfirmed` and pins its URL back with the attribute:

```csharp
[HttpPost, ActionName("Delete")]
```

The browser posts to `/Trucks/Delete/5` and never learns the method's real name. C# constraint, one-attribute fix — that's the whole story.

### The confirmation view

**The whole file — `Views/Trucks/Delete.cshtml`.** Ours shows the truck's own card, because we have one:

```html
@model Truck
@{
    ViewData["Title"] = $"Remove: {Model.Name}";
}

<h1>Remove this truck? 🗑️</h1>
<p class="text-muted">This takes it off the list for good. There is no undo.</p>

<div class="col-md-4 mb-4">
    <partial name="_TruckCard" model="Model" />
</div>

<form asp-action="Delete" method="post">
    <input type="hidden" asp-for="Id" />
    <button type="submit" class="btn btn-danger">Remove it</button>
    <a asp-action="Details" asp-route-id="@Model.Id" class="btn btn-link">Keep it</a>
</form>
```

And the way in, next to Edit on the Details page:

```html
<p><a asp-action="Delete" asp-route-id="@Model.Id" class="btn btn-outline-danger">🗑️ Remove this truck</a></p>
```

### Deleted under you

Now Part 3's mysterious catch can be produced on demand, with two tabs:

1. Tab A: open a truck's **Edit** form. Leave it open.
2. Tab B: **Delete** that truck. Confirm. It's gone; the terminal shows the DELETE.
3. Tab A: the form is still on screen, full of a truck that no longer exists. **Save.**

**404.** The UPDATE matched no rows, EF threw `DbUpdateConcurrencyException`, the catch asked "does it still exist?", and the honest answer came back. No crash, no 500 — a question you didn't know you had, already answered by code you read an hour before you needed it.

## Part 7: The scaffold comes down (5 min)

Everything worth keeping has been ported. What's left at `/TrucksScaffold` is a second, unthemed admin UI that nobody maintains and everybody forgets — a way to edit your data that skips every design decision you've made.

Delete **`Controllers/TrucksScaffoldController.cs`** and the whole **`Views/TrucksScaffold/`** folder.

> [!WARNING]
> **Restart rather than trusting the reload.** Deleting a class is a rude edit — `dotnet watch` prints `ENC0033` and **keeps serving the previous build**, exactly as it did when week 7 deleted `TruckData.cs`. `Ctrl+C`, `dotnet watch`, then check: `/Trucks` works, Edit works, `/TrucksScaffold` is an honest 404.

The lab's check 4 makes this a rule rather than advice: it refuses to pass while your scaffold controller is still in the project.

## Part 8: A column on a live table (25 min)

### Nullable, and why

Trucks are getting slogans. In `Models/Truck.cs`, below `IsOpenLate`:

```csharp
[StringLength(80)]
public string? Slogan { get; set; }
```

**The `?` is the load-bearing character.** Think about the table as it exists right now: seven rows, none of which has a slogan. A non-nullable column demands a value for every row — including rows that already exist and rows your form will create without the field filled in. `string?` says what's actually true: *some trucks have no slogan, and that's not an error.*

That's the general rule for growing a live table: **new columns arrive nullable** (or with a default), because the past has already happened and it didn't include your new column.

The seed data gets slogans too — the same `HasData` call, each truck gaining a `Slogan =`. (The demo's exact values are in the [cue sheet](demo/demo-script.md); what matters is that the seed changed, because the migration is about to notice.)

### The additive migration

```bash
dotnet ef migrations add AddSlogan
```

EF prints a line worth reading rather than fearing:

```
An operation was scaffolded that may result in the loss of data.
Please review the migration for accuracy.
```

**It's talking about the `Down` method.** Undoing this migration would drop the column and every slogan in it — that's the possible data loss. The `Up` is safe; going forward loses nothing.

Open the file. It contains exactly two kinds of operation:

```csharp
migrationBuilder.AddColumn<string>(
    name: "Slogan",
    table: "Trucks",
    type: "nvarchar(80)",
    maxLength: 80,
    nullable: true);

migrationBuilder.UpdateData(
    table: "Trucks",
    keyColumn: "Id",
    keyValue: 1,
    column: "Slogan",
    value: "Seoul food, street speed");
// ...and six more UpdateData, one per seeded row
```

No `CreateTable`. The migration is a **diff** — same as week 7's `SeedTrucks`, but this time the difference includes both schema *and* data: one new column, seven backfilled rows. `dotnet ef database update`, and the mssql panel shows the column with the slogans in it.

### Forward only

Last week's advice for a broken migration was: delete the `Migrations` folder, regenerate, run `database update` again. **That reset button died tonight**, for two reasons that arrived with your data:

1. **The table has rows you care about.** Regenerating from scratch means a migration that wants to *create* the table — which your database, quite reasonably, refuses: *"There is already an object named 'Trucks'."*
2. **The database remembers.** `__EFMigrationsHistory` lists what's been applied, by filename. A regenerated folder has new filenames the history has never seen and old ones it can't forget.

From tonight, migrations are **forward only**: you fix a migration by adding another one. Wrong column name? `dotnet ef migrations add RenameThatColumn`. Regret the whole thing? Add a migration that drops it. The history only ever grows — which is exactly what makes it a history.

> [!NOTE]
> **The one exception:** a migration you've generated but **not yet applied anywhere** can still be unwound safely with `dotnet ef migrations remove`. It's the applied ones that are forever.

### The guest list bites

Finish the feature: the field goes on the Edit form (a `mb-3` block like the others), the slogan shows on the card. Reload — slogans everywhere, the Edit box pre-filled. Looks done.

Now edit a truck's slogan and save. Redirect, list loads, and —

**The slogan is gone. Not the old value. Nothing.**

No error, no warning, no validation message. Here's the mechanism, and it's worth tracing slowly because this is the most dangerous bug in this week's homework:

1. `Slogan` isn't in `[Bind("Id,Name,Cuisine,City,Rating,IsOpenLate")]`, so the binder never reads your typed value. The posted `truck` arrives with `Slogan = null`.
2. `_context.Update(truck)` marks the **whole record** as modified — every property, including the null one.
3. `SaveChangesAsync()` faithfully writes every column. `Slogan = NULL` included.

**The guest list didn't just ignore your field — it fed the database a blank one.** The fix is one word:

```csharp
[Bind("Id,Name,Cuisine,City,Rating,IsOpenLate,Slogan")]
```

> [!WARNING]
> **Restart before you re-test it — `Ctrl+C`, then `dotnet watch` again.** That edit changed *only* an attribute, and MVC works out each action's binding from its attributes at startup: hot reload prints success and can keep the old guest list. Re-test without restarting and your slogan may vanish a second time — with a correct fix on screen and nothing to explain it. Same family as week 7's rude edits, and it is the reason to suspect your *process* rather than your code when a fix seems not to take.

### Three files care

The rule to carry into the homework, where your own model grows a property of your choosing:

> **When the model grows, three files care: the view that shows it, the form that edits it, and the `[Bind]` list that lets it through.**

The first two fail visibly — you look at the page and the field isn't there. The third fails silently and destructively. Check it first, not last.

## Wrap-up (10 min)

```
C   Add           +  SaveChangesAsync       INSERT
R   ToListAsync   ·  FindAsync              SELECT
U   Update        +  SaveChangesAsync       UPDATE    ← the hidden Id aims it
D   ask first  →  Remove + SaveChangesAsync DELETE    ← GET asks, POST acts
```

- **Tonight:** the scaffolder wrote a complete CRUD controller from your model and context; you read every line of it, ported Edit and Delete into your own controller in your own style, attached a debugger to the moment between *marked* and *written*, grew a live table by one nullable column, and met the two silent failures — the missing hidden `Id` and the `[Bind]` list — on purpose, before they could meet you.
- **The promise collected:** week 7 said the Azure app setting was *once per app, not once per deploy*. Your homework redeploy is one command, and the connection string is still there.
- **Homework:** the same moves on your own app — scaffold a reference, port Edit and Delete, delete the scaffold, and grow your model by one column, *forward*.
- **Next week:** your registry is one table, and every interesting app is at least two. Records get relatives — a second table that points back at this one.

## Appendix: Troubleshooting

**`Could not execute because the specified command or file was not found` when running `dotnet aspnet-codegenerator`**
- The global tool isn't installed on this machine: `dotnet tool install --global dotnet-aspnet-codegenerator`. On a lab PC that resets, this happens every session — same as your secrets.

**`To scaffold controllers and views using models, install Entity Framework core packages and try again: Microsoft.EntityFrameworkCore.Tools`**
- Exactly what it says: `dotnet add package Microsoft.EntityFrameworkCore.Tools`. The lab starter ships both scaffolding packages; your own app needs them added by hand.

**`Scaffolding failed: Build failed`**
- The scaffolder compiles your project first. Fix the build error it printed (or run `dotnet build` to see it plainly), then scaffold again.

**`No project found` / the scaffolder generates into the wrong place**
- Like every `dotnet ef` command: run it from the folder with your `.csproj` in it, not the folder above.

**A version error mentioning the runtime when running the scaffolder**
- Tool/SDK skew: `dotnet tool update --global dotnet-aspnet-codegenerator`. Same family as week 7's `dotnet ef` warning.

**Saving an edit returns 404**
- The URL's id and the posted `Id` genuinely disagree, and the `if (id != model.Id)` guard fired — a hand-edited hidden input, or a stale form. Note a *missing* hidden `Id` does **not** cause this: the binder falls back to the URL's id, the two agree, and the save goes through.
- The other 404 on save is the concurrency catch: the record was **deleted while your form was open**. That one is the code working, not failing.

**Saving an edit added a second record instead of changing the first**
- Your Edit form has no hidden `Id` **and** its action carries no id either, so the POST arrived with `Id = 0`. `Update()` treats an unset key as a *new* record and inserts it. One line fixes it: `<input type="hidden" asp-for="Id" />`. (The same symptom comes from calling `Add` instead of `Update` — check both.)

**An edit redirects fine, but one field comes back empty — and its old value is gone**
- That field isn't in the `[Bind]` list on your Edit POST. The binder left it `null`, `Update` marked everything modified, and the save wrote the null. Add the property's name to the list. This is the silent one this week.
- **Then restart before you re-test — `Ctrl+C`, `dotnet watch`.** Adding a name to `[Bind]` changes *only* an attribute, and MVC works out each action's binding from its attributes at startup: hot reload prints success and can keep the old list. Skip the restart and the field is erased a *second* time with the correct fix already on screen — which is how people end up rewriting code that was right.

**An edit redirects, but nothing changed at all**
- No `SaveChangesAsync()` — `Update` only marks. Same disease as week 7's missing `SaveChanges`, same silence.

**Editing added a NEW record instead of changing the old one**
- The POST calls `Add` where it should call `Update`. An insert with a fresh id is exactly what `Add` does.

**POSTing the delete confirmation returns 405 Method Not Allowed**
- There's no POST action answering `/YourThings/Delete/5`. The scaffold's POST half is `DeleteConfirmed` with `[HttpPost, ActionName("Delete")]` — port both attributes; the `ActionName` is what binds it to that URL.

**Two `Delete` methods won't compile: "already defines a member called 'Delete' with the same parameter types"**
- That's the constraint `DeleteConfirmed` exists to solve. Rename the POST and pin its URL with `[ActionName("Delete")]`.

**`InvalidOperationException: The view 'Edit' was not found`**
- The action exists, the view doesn't. Your copy of the scaffold's view belongs at `Views/YourThings/Edit.cshtml` (same for `Delete.cshtml`).

**My breakpoint is a hollow circle and never fires**
- It's set against a build `dotnet watch` has since replaced. Detach (⇧F5), let the rebuild finish, re-attach. Attach *after* your last code edit.

**Two processes match my app's name in the attach list**
- `dotnet watch` is the watcher; the process named like your app is the app. Pick that one.

**`There is already an object named 'Trucks'` (or `'Cryptids'`) during `database update`**
- You're pointing migrations at a database that was built by a *different* set of migration files — this week, usually the lab starter aimed at your week-7 database. The starter's migrations aren't yours, and histories don't mix. Lab task 1's `dotnet ef database drop --force` clears both the tables and the history; run it, then `database update` again. Note that drops the *database* — the `Migrations/` files stay put, and they're what rebuilds it. **That is a lab-only move** — on your own project's database, a bad migration is fixed by adding another one.

**`The model for context has pending changes`**
- You changed the model after generating the migration. Add another one — forward only.

**After deleting the scaffold controller, pages act stale or the build seems fine when it shouldn't be**
- Deleting a class is a rude edit; `dotnet watch` prints `ENC0033` and keeps serving the old build. `Ctrl+C`, `dotnet watch`.

**The Edit form shows empty boxes instead of the record**
- The GET handed the view no model (or a `new` one). It has to look the record up: `var item = await _context.YourThings.FindAsync(id); return View(item);`

**Everything works locally, and the deployed app 500s after this week's changes**
- If the log mentions an **invalid column name**, the deployed app's database hasn't had this week's migration applied. Your laptop and Azure share one database, so one `dotnet ef database update` from your project folder fixes both. Then the week-7 classics: the app setting (`ConnectionStrings__DefaultConnection`, two underscores) and the US region — `az webapp log tail` shows the real exception.
