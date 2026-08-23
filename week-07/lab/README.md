# Week 7 Lab — The Registry Gets a Filing Cabinet 🗄️

Six creatures that vanish every time you restart the app. Tonight they move into SQL Server and stop doing that — a `DbContext` to describe the table, a connection string to find the server, a migration to build it, and a controller that reads from a database instead of a variable.

**Time:** ~50 minutes in class — **in-class target: checks 1–5 green.** Check 6 is two lines; do it if you get there, otherwise it rolls into the homework.

## Setup

> [!IMPORTANT]
> **The app arrives as week 6 finished it** — the form, the annotations, the `ModelState` guard, the redirect, client-side validation, last week's theme and shell. If your own week-6 lab never got finished, you are **not** behind tonight. Check 1 passes before you touch anything.
>
> **The two EF Core packages are already in `Cryptids.Web.csproj`**, so nobody spends the lab waiting on NuGet. You'll run those commands yourself in the homework — they're in [the notes](../lecture-notes.md#two-packages).

**1. Update the starters clone.** Open `dotnet-web` in VS Code, then `` Ctrl+` `` for a terminal standing in it:

```bash
git -C dotnet-web-starters pull
```

`-C` tells git to work *in that folder* without moving your terminal into it — you stay in `dotnet-web`, which is where every other command belongs.

**2. Copy the `week-07` folder out of `dotnet-web-starters` and into `dotnet-web`** — next to the clone, never inside it — **and rename the copy.** `CryptidsDb` works. (Never work inside the clone.)

You should end up with exactly this:

```
CryptidsDb/                ← in `dotnet-web`, the folder you copied and renamed
├─ Cryptids.Web/          ← your app — ALL your work happens in here
└─ Cryptids.Checks/       ← the checks — read-only, never edit
```

**3. Open `CryptidsDb` in VS Code** — the folder that *contains* both project folders.

**4. Open two more terminals** — the `+` in the terminal panel, or `` Ctrl+Shift+` ``. **You need three tonight**, and the reason is the row below: `dotnet watch` keeps running and you can't type in it, so the `dotnet ef` commands need a terminal of their own *also* inside `Cryptids.Web`.

| Terminal | Where it stands | What runs in it |
|---|---|---|
| 1 | inside `Cryptids.Web` — `cd Cryptids.Web` | `dotnet watch` — **started in task 5**, then left alone |
| 2 | inside `Cryptids.Web` — `cd Cryptids.Web` | every `dotnet ef` and `dotnet user-secrets` command |
| 3 | `CryptidsDb`, the folder holding **both** projects | `dotnet test Cryptids.Checks`, after every task |

**5. In terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**1 / 6 passing.** Check 1 is the app you were given, already working. The other five are the database.

> [!WARNING]
> Seeing `error MSB1009: Project file does not exist`? You're one folder too deep. `cd ..` — the test command goes in the folder that holds *both* projects.

> [!CAUTION]
> **`dotnet ef` commands are the opposite: they run from inside `Cryptids.Web`.** Every `dotnet ef` line in this lab needs `cd Cryptids.Web` first. Getting `No project was found in the current working directory` means you're one folder too high. This trips everybody at least once tonight.

> [!TIP]
> **Watch the SQL as you go.** EF Core prints every query it generates into terminal 1, so the `dotnet watch` terminal is worth keeping visible tonight — it's the only place you can see what your C# turned into.

## Where tonight's work happens

| File | What you do to it |
|---|---|
| *(user secrets — not a file in this project)* | your connection string — task 1 |
| `Cryptids.Web/Data/CryptidContext.cs` | **new file** — the context and the seed data — task 2 |
| `Cryptids.Web/Program.cs` | one registration — task 3 |
| `Cryptids.Web/Migrations/` | **generated** — don't hand-write these — task 4 |
| `Cryptids.Web/Controllers/CryptidsController.cs` | reads and writes go through the context — tasks 5 and 6 |
| `Cryptids.Web/Models/CryptidData.cs` | **deleted** — task 6 |

> [!NOTE]
> **The checks never connect to SQL Server.** They run your app against an in-memory database seeded from the `HasData` you write, so `dotnet test` works with no network and can't be broken by fourteen people connecting at once.
>
> **That means 6/6 does not prove your connection string is right.** Your browser proves that. Do both: get the checks green, *and* load `/Cryptids` in a browser and see six creatures.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 1 | *(no check)* | Put your connection string in [user secrets](../lecture-notes.md#where-the-connection-string-lives) — two commands, from inside `Cryptids.Web`. Nothing later works until this is right, and task 4 is where you find out. **[Task 1 in full ↓](#task-1-in-full)** |
| 2 | `TheContextDescribesTheDatabase` | A new `Data/CryptidContext.cs`: a [`DbContext`](../lecture-notes.md#the-dbcontext) with a `DbSet<Cryptid>`, and the six creatures [seeded](../lecture-notes.md#the-table-is-empty) in `OnModelCreating`. **[Task 2 in full ↓](#task-2-in-full)** |
| 3 | `TheAppIsWiredToSqlServer` | [One `AddDbContext` line](../lecture-notes.md#one-registration) in `Program.cs`, reading the connection string from configuration. **[Task 3 in full ↓](#task-3-in-full)** |
| 4 | `AMigrationDescribesTheTable` | [`dotnet ef migrations add InitialCreate`](../lecture-notes.md#writing-a-model-doesnt-create-a-table), then `dotnet ef database update`. **[Task 4 in full ↓](#task-4-in-full)** |
| 5 | `TheRegistryReadsFromTheDatabase` | [Inject the context](../lecture-notes.md#asking-for-the-context) into `CryptidsController` and rewrite `Index` and `Details` [against the table](../lecture-notes.md#reading). **[Task 5 in full ↓](#task-5-in-full)** |
| 6 | `AFiledReportIsSaved` | Delete `Models/CryptidData.cs` **first** — then let the compiler walk you to the POST action, where [`Add` and `SaveChanges`](../lecture-notes.md#writing) replace it and [the id line goes](../lecture-notes.md#the-line-you-delete). **[Task 6 in full ↓](#task-6-in-full)** |

> [!IMPORTANT]
> **Do tasks 2 and 3 before task 4.** A migration is a photograph of your model at the moment you generate it — run `migrations add` before the seed data exists and you get a migration with no creatures in it, an empty registry, and no error message explaining why.

### Task 1 in full

**No check for this one** — but every other check depends on it, and it's the only task tonight that reading can't unblock. **If it isn't working ten minutes in, ask.**

Your connection string has a working password in it, so it does **not** go in a file in this project. It goes in [user secrets](../lecture-notes.md#where-the-connection-string-lives) — a file in your own user profile that git can't see.

**From inside `Cryptids.Web`** (`cd Cryptids.Web` first — same folder as every `dotnet ef` command tonight):

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=<SCHOOL-SQL-SERVER>;Database=<YOUR-DATABASE>;User ID=<YOUR-USERNAME>;Password=<YOUR-PASSWORD>;TrustServerCertificate=True"
```

`<SCHOOL-SQL-SERVER>`, `<YOUR-USERNAME>` and `<YOUR-PASSWORD>` come from the class handout. Leave `TrustServerCertificate=True` exactly as it is — [it's why the connection isn't refused](../lecture-notes.md#where-the-connection-string-lives).

**`<YOUR-DATABASE>` is different — you name it**, [following the convention](../lecture-notes.md#naming-your-database). For tonight that's:

```
Cryptids_<COURSE-NUMBER>_<YOUR-INITIALS>
```

which filled in looks like `Cryptids_42_ABL`. **It doesn't exist yet, and that's fine** — task 4's `dotnet ef database update` creates it. You'll name a *different* one for your own app in the homework, because it's one database per application.

> [!WARNING]
> **Fill both parts in.** A name with the angle brackets still in it is a real, creatable database name — and everyone else who left them in would be pointing at the same one, on the same server. Check 3 refuses a connection string containing `<` or `>` for exactly this reason.

**Keep the quotes around the value.** Your connection string is full of `;`, and your shell reads an unquoted `;` as the end of the command — it would store `Server=...` and silently throw the rest away.

Check it landed — this is the only command that tells you the truth, because `set` prints `Successfully saved` whatever you give it:

```bash
dotnet user-secrets list
```

You want **one** line, starting exactly `ConnectionStrings:DefaultConnection`, with the whole string after it. [If it's wrong, here's how to fix it](../lecture-notes.md#when-you-type-it-wrong) — a bad value just needs another `set`; a misspelled key needs `dotnet user-secrets remove`.

You can't fully test it yet (there's no context for it to use), so the real test is task 4. But you can rule out a bad server name or password now, in the **mssql** extension:

**Connect to the *server* — leave the database field blank.** Use the server, username and password from the handout. **Don't** name your database: it doesn't exist yet, and a connection that names a database that isn't there just fails, which tells you nothing about whether your credentials are right.

If that connects, your server name and login are good. Your database shows up underneath it after task 4 creates it. If it *doesn't* connect, the connection string is wrong and nothing later will save you — the two failure messages are in the table below.

> [!TIP]
> **On a lab PC that resets when it reboots, do this again next session.** Your secret lives in your user profile, not in your project, so it doesn't come back with your files. Keep the connection string somewhere that isn't this machine — one `dotnet user-secrets set` restores it.

The two errors, and they send you to different halves of the same line:

| Message | What it means |
|---|---|
| `Login failed for user '...'` | The server answered and said no — **username or password**. Server name is fine. |
| `A network-related or instance-specific error occurred` | Nothing answered — **server name**, or you're not on a network that can reach it. Takes ~30s to fail, so it feels like a hang. |

### Task 2 in full

**Check:** `Check2_TheContextDescribesTheDatabase`

Make a **`Data`** folder inside `Cryptids.Web`, next to `Models` and `Controllers`. **This is the whole of `Data/CryptidContext.cs`:**

```csharp
using Microsoft.EntityFrameworkCore;
using Cryptids.Web.Models;

namespace Cryptids.Web.Data;

public class CryptidContext : DbContext
{
    public CryptidContext(DbContextOptions<CryptidContext> options) : base(options)
    {
    }

    public DbSet<Cryptid> Cryptids => Set<Cryptid>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cryptid>().HasData(
            new Cryptid { Id = 1, Name = "The Hodag", Region = "Rhinelander, Wisconsin", FirstSighting = 1893, Sightings = 47, IsDebunked = true },
            new Cryptid { Id = 2, Name = "Bigfoot", Region = "Pacific Northwest", FirstSighting = 1958, Sightings = 1204, IsDebunked = false },
            new Cryptid { Id = 3, Name = "Mothman", Region = "Point Pleasant, WV", FirstSighting = 1966, Sightings = 102, IsDebunked = false },
            new Cryptid { Id = 4, Name = "The Loch Ness Monster", Region = "Loch Ness, Scotland", FirstSighting = 565, Sightings = 1131, IsDebunked = false },
            new Cryptid { Id = 5, Name = "The Jersey Devil", Region = "Pine Barrens, NJ", FirstSighting = 1735, Sightings = 287, IsDebunked = false },
            new Cryptid { Id = 6, Name = "Chupacabra", Region = "Puerto Rico", FirstSighting = 1995, Sightings = 214, IsDebunked = true }
        );
    }
}
```

Three things worth reading rather than pasting past:

- **`DbSet<Cryptid> Cryptids`** — that property *is* the table. Its presence is what makes EF Core believe there should be a `Cryptids` table at all.
- **The constructor** is handed its options rather than deciding them. This class does not know where the database is, and never will.
- **Every seeded row has an explicit `Id`.** Normally the database picks ids; seed rows are the exception, because EF Core has to be able to tell next time whether row 3 changed, vanished, or is new.

> [!TIP]
> **The six creatures are the same six, with the same Ids**, copied straight out of `Models/CryptidData.cs`. Details pages people already bookmarked are `/Cryptids/Details/1` through `6`, and check 2 looks for exactly that.

### Task 3 in full

**Check:** `Check3_TheAppIsWiredToSqlServer`

In `Program.cs`, **above `var app = builder.Build();`**:

```csharp
builder.Services.AddDbContext<CryptidContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

You'll need two `using` lines at the top — let the editor complain first, so you see which:

```csharp
using Microsoft.EntityFrameworkCore;
using Cryptids.Web.Data;
```

- **Above `builder.Build()`**, not below. Services have to be registered before the app is built, and the error if you get it backwards doesn't say so.
- **`GetConnectionString("DefaultConnection")`** has to match the key you set in task 1 exactly — `ConnectionStrings:DefaultConnection`. Misspell either end and it returns `null`, `UseSqlServer(null)` throws, and your app won't start at all.

### Task 4 in full

**Check:** `Check4_AMigrationDescribesTheTable`

⚠️ **From inside `Cryptids.Web`** — the folder with the `.csproj`, not the one above it:

```bash
cd Cryptids.Web
dotnet ef migrations add InitialCreate
dotnet ef database update
```

**Open the file it generated**, `Migrations/<timestamp>_InitialCreate.cs`, before you move on. It's worth thirty seconds:

- `Name` is `nvarchar(60)`. **You never typed 60 tonight** — that's `[StringLength(60, MinimumLength = 2)]`, which you wrote last week as a *form* rule.
- `nullable: false` is `[Required]`.
- `Id` gets `.Annotation("SqlServer:Identity", "1, 1")` — the column numbers itself. **That deletes a line of your code in task 6.**
- Below `CreateTable` there should be an **`InsertData`** with six rows in it. **If there isn't, your seed data wasn't there when you generated this** — delete the whole `Migrations` folder, check task 2, and run both commands again.

**Check this in the mssql extension, not the browser.** Expand your database → Tables. There are **two**: `Cryptids` with six rows in it, and `__EFMigrationsHistory` with one. That second table is how `database update` knows what it has already done — run the command again and nothing happens.

> [!NOTE]
> **`/Cryptids` looks exactly the same as it did an hour ago, and that's correct.** It's still showing six creatures out of `CryptidData.cs`, because nothing has told your controller the database exists — that's task 5. Right now you have the same six creatures in two places at once. Task 5 is where the page starts reading the one that survives a restart.

### Task 5 in full

**Check:** `Check5_TheRegistryReadsFromTheDatabase`

**Start the app first — this is the task where the browser starts mattering.** In terminal 1:

```bash
cd Cryptids.Web
dotnet watch
```

Tasks 1–4 were all verified by `dotnet test` and the mssql extension, so this is the first time tonight you actually need the site running. Leave it running for the rest of the lab; every reload below assumes it.

**Then the constructor.** At the top of `CryptidsController` **(inside the class)**, above the actions:

```csharp
private readonly CryptidContext _context;

public CryptidsController(CryptidContext context)
{
    _context = context;
}
```

Plus `using Cryptids.Web.Data;` at the top of the file.

Notice what isn't there: no `new CryptidContext(...)`, and nothing in this class knows the server's name. It says in its constructor that it needs one, and the framework hands it over — because of task 3's line.

**Then the two reads:**

```csharp
public IActionResult Index()
{
    return View(_context.Cryptids.ToList());
}

public IActionResult Details(int id)
{
    var cryptid = _context.Cryptids.FirstOrDefault(c => c.Id == id);

    if (cryptid == null)
    {
        return NotFound();
    }

    return View(cryptid);
}
```

`CryptidData.All` became `_context.Cryptids`, and `Index` gained a `.ToList()`. The null check, the `NotFound()`, the `View(cryptid)` — untouched.

**Reload `/Cryptids`.** Same six creatures — but this time they came out of SQL Server, and you can prove it.

> [!TIP]
> **Watch the SQL.** Look at the terminal running `dotnet watch` — EF Core prints the `SELECT` it generated. Load `/Cryptids/Details/2` and read that one too: `FirstOrDefault(c => c.Id == id)` didn't fetch six creatures and pick one, it became a `WHERE` clause.

**Leave `Models/CryptidData.cs` alone for now.** Your POST action still uses it, so deleting it here would stop the project compiling — and a project that doesn't compile can't run any checks at all. **Task 6 opens by deleting it**, once you're ready to fix what that breaks.

### Task 6 in full

**Check:** `Check6_AFiledReportIsSaved`

**Two parts, and the check stays red until you've done both.**

---

### Part 1 — delete `Models/CryptidData.cs`

🗑️ **Delete the file.** Right-click it in VS Code → Delete. Yes, before you change anything else.

**The project will stop compiling, and that is the point.** The compiler is now naming every place still reading the old list. In this app there's exactly one — your POST action — and rewriting it is part 2.

*(In your own project next week there may be more, and the home page is the usual suspect. Same treatment: query the context in the controller, pass the result to the view.)*

---

### Part 2 — rewrite the POST action

The one the compiler just pointed you at:

```csharp
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult Create(Cryptid cryptid)
{
    if (!ModelState.IsValid)
    {
        return View(cryptid);
    }

    _context.Cryptids.Add(cryptid);
    _context.SaveChanges();

    return RedirectToAction(nameof(Index));
}
```

- **The guard and the redirect don't change.** They never cared where the list was.
- **`cryptid.Id = CryptidData.All.Max(c => c.Id) + 1;` is one of the lines the compiler flagged — delete it, don't repair it.** `Id` is an `IDENTITY` column now: SQL Server picks the number, and EF Core reads it back onto your object during `SaveChanges()`.
- ⚠️ **`Add` does not write anything.** It records an intention. **`SaveChanges()` is the line that goes to the database**, and forgetting it is the most common bug of the week: the form submits, the redirect happens, no error appears anywhere, and the record simply isn't there.

---

**Now the part that's actually the point of tonight.** File a report. Then stop the app (`Ctrl+C`), start it again, and reload `/Cryptids`.

**It's still there.** That's the week.

## Rules

> [!IMPORTANT]
> - **Never edit `Cryptids.Checks`** — it's the grading contract. All work happens in `Cryptids.Web`.
> - Don't remove the `public partial class Program { }` line at the bottom of `Program.cs` — the checks need it to see your app.
> - Don't rename the `Cryptid` properties. The checks read them by name.
> - Don't hand-write migration files. Generate them, and if one is wrong, delete the `Migrations` folder and generate it again.

## 🆘 Stuck?

- **`No project was found in the current working directory`** — `dotnet ef` runs from inside `Cryptids.Web`, not the folder above. This is the opposite of `dotnet test`.
- **`Login failed for user '...'`** — the server answered and rejected you: username or password. The server name is right.
- **`A network-related or instance-specific error occurred`** — nothing answered: server name is wrong, or this network can't reach it. Takes ~30s to fail.
- **`Value cannot be null. (Parameter 'connectionString')`, and the app won't start** — `GetConnectionString("DefaultConnection")` returned nothing. Run `dotnet user-secrets list` from inside `Cryptids.Web`: if it says *"No secrets configured for this application"*, task 1 didn't take **for this project** — secrets are per application, so one you set for a different app doesn't count. If secrets *are* listed, look at them closely: the key has to be exactly `ConnectionStrings:DefaultConnection` (`ConnectionString` singular is the usual typo — `dotnet user-secrets remove` the wrong one), and the value has to be the *whole* string, not just `Server=...` chopped at the first `;` by missing quotes. [Fixing both](../lecture-notes.md#when-you-type-it-wrong).
- **`Invalid object name 'Cryptids'`** — the table isn't there. You generated the migration but never ran `dotnet ef database update`.
- **`Unable to resolve service for type ... CryptidContext`** — task 3's line is missing, or it's *below* `builder.Build()`.
- **The registry is empty and there's no error** — the table exists but has no rows. Open your migration: if there's no `InsertData` in it, you generated it before writing `HasData`. Delete the `Migrations` folder and do task 4 again.
- **`The seed entity for entity type 'Cryptid' cannot be added because no value was provided for the required property 'Id'`** — a seeded row is missing its `Id =`.
- **`The model for context 'CryptidContext' has pending changes`** — you edited the context after generating the migration. Add another one: `dotnet ef migrations add WhateverYouChanged`.
- **The form redirects, no error, and the creature isn't in the list** — no `SaveChanges()`. `Add` only records an intention.
- **The new creature has Id 0, or `Cannot insert explicit value for identity column`** — last week's `Max(c => c.Id) + 1` line is still there. Delete it.
- The [troubleshooting appendix](../lecture-notes.md#appendix-troubleshooting) covers the rest.

## 🚀 Done early?

- **Read the SQL.** Load every page with the terminal visible and match each one to its query. Then find the one that fetches more than it needs.
- **Send them to the new creature.** `RedirectToAction(nameof(Details), new { id = cryptid.Id })` drops the visitor on the page for the report they just filed — and it only works because `SaveChanges()` put the real id on the object.
- **Break it on purpose, then fix it.** Add a `Notes` property to `Cryptid` and reload without migrating: `Invalid column name 'Notes'`. Now you know what that one means too. Then `dotnet ef migrations add AddNotes` and `database update`.
- **Look at what a migration undoes.** Run `dotnet ef migrations remove` (with no `database update` after it) and watch the files disappear. Then read the `Down` method in a migration you keep — it's the reverse of `Up`, and it's how `dotnet ef database update <EarlierMigration>` walks a database backwards.
- **Order the registry.** `_context.Cryptids.OrderBy(c => c.Name).ToList()` — then read the generated SQL and find the `ORDER BY`. The sorting happened on the server, not in C#.
