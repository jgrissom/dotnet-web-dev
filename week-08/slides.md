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

# Week 8 — EF Core CRUD

.NET Web Development · Week 8 of 16

---

<!-- _footer: '🖥️ Demo §1 · the payoff, retold' -->

## Seven trucks. Still there.

`Ctrl+C` → `dotnet watch` → reload.

<br>

**Seven.** That's what a foundation is.

<br>

You have **C**reate and **R**ead. Tonight: **U** and **D** —

and most of it gets written *for* you.

---

<!-- _footer: '🖥️ Demo §1 · collect the reading' -->

## What Edit needs

1. The form arrives **pre-filled**
2. The app knows **which record**
3. The save is an **UPDATE, not an INSERT**

<br>

### Your Create form never sends an Id. Where does it come from?

---

<!-- _footer: '🖥️ Demo §1 · the shape of the night' -->

## The other two letters

1. **A tool writes it**
2. **You read what it wrote**
3. **You keep the parts that are yours**

<br>

Unchanged tonight: your model · your rules · your theme · your seed data · your database.

---

<!-- _footer: '🖥️ Demo §2 · two packages and a tool' -->

## Two packages and a tool

```bash
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools

dotnet tool install --global dotnet-aspnet-codegenerator
```

<br>

The templates · the part that reads your `DbContext` ·

the command itself — **per machine**, like `dotnet-ef`

---

<!-- _footer: '🖥️ Demo §2 · one command' -->

## One command

```bash
dotnet aspnet-codegenerator controller \
  -name TrucksScaffoldController \
  -m Truck  -dc CurbsideContext \
  --relativeFolderPath Controllers \
  --useDefaultLayout --referenceScriptLibraries
```

<br>

**One controller. Five views. Three seconds.**

All it asked for: which model, which context.

---

<!-- _footer: '🖥️ Demo §2 · what it didn’t write' -->

## What it didn't write

| | |
|---|---|
| Your model, and its rules | week 6 |
| Your theme, layout, cards | week 5 |
| Your seed data, your migrations | week 7 |
| What this app even is | week 4 |

**It wrote the plumbing around your decisions.**

---

<!-- _footer: '🖥️ Demo §3 · Task is a Promise' -->

## Task is a Promise

```csharp
public async Task<IActionResult> Index()
{
    return View(await _context.Trucks.ToListAsync());
}
```

`Task<T>` is `Promise<T>`. **`await` is `await`.**

While SQL Server thinks, the thread serves someone else.

Your sync code still works. New code is async.

---

<!-- _footer: '🖥️ Demo §3 · the Edit pair' -->

## The Edit pair

```csharp
// GET — show the form
public async Task<IActionResult> Edit(int? id)

// POST — save the correction
public async Task<IActionResult> Edit(int id, Truck truck)
```

GET: `FindAsync(id)` → `View(truck)`. **The pre-filled form is one line.**

POST's first question: do the URL and the form *agree*?

---

<!-- _footer: '🖥️ Demo §3 · the hidden Id' -->

## The hidden Id

```html
<input type="hidden" asp-for="Id" />
```

<br>

URL → `FindAsync` → model → **hidden input** → POST → `truck.Id`

<br>

**The form carries the record's identity in its pocket.**

---

<!-- _footer: '🖥️ Demo §3 · the guest list' -->

## The guest list

```csharp
[Bind("Id,Name,Cuisine,City,Rating,IsOpenLate")]
```

Only names on the list are read out of the form.

A POST can't smuggle in a field you never offered.

<br>

⚠️ It has a **silent** failure mode. Tonight ends on it.

---

<!-- _footer: '🖥️ Demo §4 · keep what’s yours' -->

## Porting: keep what's yours

**Theirs:** the actions, the guards, the hidden `Id`, the mechanics.

**Yours:** the markup, the spacing, the button labels, the names.

<br>

The scaffold is a **reference, not a foundation** —

it gets deleted before the night is out.

---

<!-- _footer: '🖥️ Demo §4 · watch the UPDATE' -->

## The UPDATE

```sql
UPDATE [Trucks] SET [City] = @p0, [Cuisine] = @p1, ...
WHERE [Id] = @p5;
```

<br>

The hidden Id, arrived as a **WHERE clause**. One row.

<br>

Without it, the form leans on the URL — and `Update` files a **duplicate** if that can't answer either.

---

<!-- _footer: '🖥️ Demo §5 · attach to the process' -->

## The debugger, finally

**⇧⌘P → “Attach to a .NET process” → Curbside**

Breakpoint. Submit the form. **Time stops mid-request.**

<br>

The question `Console.WriteLine` can't answer:

*what is this object, right now?*

---

<!-- _footer: '🖥️ Demo §5 · update marks, SaveChanges writes' -->

## Update marks. SaveChanges writes.

```csharp
_context.Update(truck);              // nothing happens
await _context.SaveChangesAsync();   // the UPDATE happens
```

<br>

You watched the gap between those lines.

**It's where week 7's silent bug lived.**

---

<!-- _footer: '🖥️ Demo §6 · why Delete asks first' -->

## Why Delete asks first

### A GET must never change data.

Link previews, prefetch, crawlers — things you don't control

follow links all day.

<br>

**GET:** show what's about to die, and a button. **POST:** delete.

---

<!-- _footer: '🖥️ Demo §6 · the Delete pair' -->

## The Delete pair

```csharp
// GET — the question
public async Task<IActionResult> Delete(int? id)

// POST — the answer
[HttpPost, ActionName("Delete")]
public async Task<IActionResult> DeleteConfirmed(int id)
```

Same name + same signature won't compile —

so the POST renames, and `[ActionName]` keeps its URL.

---

<!-- _footer: '🖥️ Demo §6 · deleted under you' -->

## Deleted under you

```csharp
catch (DbUpdateConcurrencyException)
```

<br>

The UPDATE went looking and found **no row** —

the record died while the form was open.

<br>

The scaffold shipped the answer to a question you hadn't asked yet.

---

<!-- _footer: '🖥️ Demo §7' -->

## The scaffold comes down

Everything worth keeping has been ported.

What's left is an unthemed admin UI nobody maintains.

<br>

Delete the controller. Delete the views. **Restart** — deleting

a class is a rude edit (`ENC0033`), same as last week.

---

<!-- _footer: '🖥️ Demo §8 · a column on a live table' -->

## A column on a live table

```csharp
[StringLength(80)]
public string? Slogan { get; set; }
```

<br>

The table already has rows. A required column

demands answers that don't exist.

**`string?` is the honest type: some trucks have no slogan.**

---

<!-- _footer: '🖥️ Demo §8 · the migration is a diff' -->

## The migration is a diff. Again.

```csharp
migrationBuilder.AddColumn<string>(name: "Slogan", ...);

migrationBuilder.UpdateData(...);   // × 7 — the seed, backfilled
```

No `CreateTable`. The difference — **including the data.**

<br>

⚠️ **Delete-and-regenerate died tonight. Forward only.**

---

<!-- _footer: '🖥️ Demo §8 · the guest list bites' -->

## The guest list bites

New box on the form. New value typed. Saved. **Gone.**

<br>

Unbound → `null` → `Update` marks *everything* → the null is written.

<br>

When the model grows, **three** files care:

the view · the form · **the `[Bind]` list**

---

<!-- _footer: '🖥️ Demo §9' -->

## Lab: the Registry gets a corrections desk

- **1** — drop last week's database, one `database update`
- **2** — scaffold the reference controller
- **3** — port Edit
- **4** — port Delete · the scaffold comes down
- **5** — two new columns, one additive migration
- **6** — the plates go on display

**⏱️ 50 minutes · target tonight: 1–4 green.**

---

<!-- _footer: '🖥️ Demo §10' -->

## Tonight, in one picture

```
C   Add          + SaveChangesAsync      INSERT
R   ToListAsync  · FindAsync             SELECT
U   Update       + SaveChangesAsync      UPDATE   ← the hidden Id
D   ask first →  Remove + SaveChanges    DELETE   ← GET asks, POST acts
```

- **Homework:** the same moves on your app — plus one new column, added *forward*
- **Next week:** a second table — records that point at each other
