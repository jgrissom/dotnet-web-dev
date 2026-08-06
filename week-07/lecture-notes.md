# Week 7 — Lecture Notes

> Last week ended with a truck disappearing. You added it, restarted the app, and it was gone — and the explanation was a shrug: `TruckData.All` is a variable in a running program, and programs end. Tonight that stops being true. The list moves out of the process and into SQL Server, where it belongs to nobody's memory and outlives every restart, deploy and crash. The promise made at the end of last week was that the controller would barely change. You're going to find out how honest that was.

## Part 1: Why a variable isn't storage (20 min)

### The thing you already felt

Start where week 6 ended. Add a truck. It's on `/Trucks`. Stop the app, start it again, reload.

**Six trucks.**

```csharp
public static List<Truck> All { get; } = new() { ... };
```

That's not a bug and it never was. It's a `static List<Truck>` — a variable, living in the memory of one running process, and it lives exactly as long as that process does. Everything else you built was real. The storage was always a stand-in.

On Azure it's worse, and by now some of you will have seen it: a free-tier app **sleeps** when nobody's using it, and wakes up as a brand-new process with the six hard-coded items and nothing else. Anything a visitor added is gone. Students who added test data on Monday and found it missing on Wednesday were not looking at a broken app.

### What "outside the process" buys you

A database is a separate program, usually on a separate machine, whose entire job is to hold onto data and hand it back. That one move — **the data lives somewhere your app isn't** — is what fixes all of this at once:

| | `static List<T>` | A database |
|---|---|---|
| Survives a restart | no | yes |
| Survives a deploy | no | yes |
| Two apps see the same data | no | yes |
| Survives the app crashing | no | yes |
| Someone else can look at it | no | yes |

That third row is the one that surprises people, and it's the one you can *feel* tonight: your laptop and your deployed Azure app will point at the same database. Add something on the deployed site, run your app locally, and it's there. Two programs, two computers, one set of data. Nothing you have built so far could do that.

> [!NOTE]
> **We are using the school's SQL Server**, and you each have your own account on it. It's reachable from off campus, which is what makes it work for both your laptop and your Azure app. There is nothing to install — the only new tool is the VS Code **SQL Server (mssql)** extension, for looking at tables.

### The three pieces you're adding

Everything tonight is one of these, and it's worth putting the shape up before any of it arrives:

1. **A `DbContext`** — one C# class that stands for your database. It says which tables exist and what's in them.
2. **A connection string** — where that database is, and who you are. It lives in configuration, never in code.
3. **A migration** — the step that turns your C# classes into actual tables. Writing the model doesn't create anything; a migration is what does.

Then the controller changes, and it changes less than you'd think.

## Part 2: The context (30 min)

### Two packages

EF Core isn't in the box. From inside your **web project** folder — the one with the `.csproj` in it:

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
```

- **`.SqlServer`** is EF Core plus the SQL Server provider — the part that knows how to turn your LINQ into T-SQL.
- **`.Design`** is only used by the `dotnet ef` command-line tool. Your app never calls it — which is exactly why it's the one people skip. Leave it out and every `dotnet ef` command stops before it starts:

  ```
  Your startup project 'YourApp' doesn't reference Microsoft.EntityFrameworkCore.Design.
  This package is required for the Entity Framework Core Tools to work.
  ```

  Unusually helpful, as errors go: it names the package you're missing.

You also need the tool itself, once per machine — not per project:

```bash
dotnet tool install --global dotnet-ef
```

If you already have it, `dotnet tool update --global dotnet-ef`. It warns you when it's older than your runtime, and the warning is worth acting on.

> [!TIP]
> **Check `.csproj` after these commands.** Two `<PackageReference>` lines appear. That's all `dotnet add package` does — it edits a file and restores. There's no magic install location, and the file is what gets committed.

### The DbContext

**This is the whole of `Data/CurbsideContext.cs`** — a new folder, `Data`, alongside `Models` and `Controllers`:

```csharp
using Microsoft.EntityFrameworkCore;
using Curbside.Models;

namespace Curbside.Data;

public class CurbsideContext : DbContext
{
    public CurbsideContext(DbContextOptions<CurbsideContext> options) : base(options)
    {
    }

    public DbSet<Truck> Trucks => Set<Truck>();
}
```

Three things, and each is doing real work:

- **`: DbContext`** — this class *is* the database, as far as your code is concerned. Every query and every save goes through an instance of it.
- **`DbSet<Truck> Trucks`** — **this property is the table.** Its presence is what tells EF Core there should be a `Trucks` table at all, and its type says what a row looks like. Querying `Trucks` is querying SQL Server.
- **The constructor** — it takes `DbContextOptions` and hands them to the base class. This is how the context finds out *which* database and *where*, and the important part is what's missing: the context never decides that for itself. It's told. That's what lets the same class point at the school's server in production and at something else entirely in a test.

> [!NOTE]
> **`Set<Truck>()` versus `{ get; set; }`.** You'll see both. `public DbSet<Truck> Trucks { get; set; }` is the older shape and works fine; `=> Set<Truck>()` is the same thing without a nullable-warning fight, since it computes the value rather than leaving a property to be filled in. Pick either; don't mix them in one file.

### Where the connection string lives

A connection string says which server, which database, and who you are. Two things are true about it at once: your code needs it, and **it contains a working password while your homework repo is public.**

So it does not go in `Program.cs`, and it does not go in `appsettings.json` either. It goes in **user secrets** — a file in your own user profile, outside your project folder, which git therefore cannot see even by accident.

Two commands, from inside your web project folder:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=<SCHOOL-SQL-SERVER>;Database=<YOUR-DATABASE>;User ID=<YOUR-USERNAME>;Password=<YOUR-PASSWORD>;TrustServerCertificate=True"
```

**Three of those come from the class handout. The database name you make up yourself** — following the convention below. Piece by piece:

| Part | What it is |
|---|---|
| `Server=` | the machine the database is on — from the handout |
| `Database=` | which database on it. **You name this**, and it doesn't have to exist yet |
| `User ID=` / `Password=` | SQL Server Authentication: your account on that server — from the handout |
| `TrustServerCertificate=True` | "don't refuse the connection because the encryption certificate isn't one a browser would trust" |

### Naming your database

You get **one database per application**, and you name each one:

```
AppName_<COURSE-NUMBER>_<YOUR-INITIALS>
```

`AppName` is the app it belongs to, and the other two are yours. Filled in, it looks like this:

```
Cryptids_42_ABL
```

So the lab's Registry is one database, and your own semester project gets another — `TrailGuide_42_ABL`, or whatever yours is called.

> [!TIP]
> **If someone in the class already has your initials**, put a number after yours — `ABL2`. Everyone's databases live on one server, so two people deriving the same name is the one collision worth avoiding.

**You don't create it.** The first `dotnet ef database update` creates the database if it isn't there, then builds the tables inside it. Naming a database that doesn't exist yet is normal and expected — that's the whole of "creating" one.

Keeping them separate is what stops your semester project's tables and the lab's from ending up in the same place, which gets confusing fast when you open the **mssql** extension and try to work out which `__EFMigrationsHistory` belongs to what.

That last one deserves a sentence rather than a shrug. Modern SQL Server clients encrypt by default and then check the server's certificate, the same way a browser checks an `https` certificate. The school's server has a self-signed one, so the check fails and the connection is refused. `TrustServerCertificate=True` says *encrypt anyway, but skip the identity check*. On a school network that's the pragmatic answer; it is not what you'd write for a bank.

### What those two commands actually did

`dotnet user-secrets init` added one line to your `.csproj`:

```xml
<UserSecretsId>79d5a4f2-9c34-4f51-a744-e3a3afab0b3e</UserSecretsId>
```

Yours will be a different GUID — `init` generates one. It is **not** a secret; it's a folder name. **Commit it** — it's how the tooling finds your secrets next time, and without it in the repo you'd have to run `init` again on every machine.

`dotnet user-secrets set` wrote your connection string into that folder, which lives in your user profile:

| | |
|---|---|
| macOS / Linux | `~/.microsoft/usersecrets/<the GUID>/secrets.json` |
| Windows | `%APPDATA%\Microsoft\UserSecrets\<the GUID>\secrets.json` |

Read that path again: it is nowhere near your project. There is no `.gitignore` rule to remember and no file to accidentally `git add`, because the file is not in the repository at all. `dotnet user-secrets list` prints what's in there.

**And notice what names that folder: the GUID.** `init` generates a fresh one per project, so **every application has its own separate store.** The lab's Registry and your own semester project are two different applications with two different GUIDs — so they have two different secret files, even sitting side by side on the same laptop, even pointing at the same database with the same connection string.

Which means you will run these two commands more than once tonight, and that's correct, not a mistake:

| Doing this | Needs its own `init` + `set` |
|---|---|
| the lab's `Cryptids.Web` | yes |
| your own semester project | yes — separately |
| the same project on a second machine | `set` only; the GUID came across in the `.csproj` |

.NET's own wording gives it away: run `dotnet user-secrets list` in a project you haven't set up and it says *"No secrets configured for **this application**."*

### When you type it wrong

You will, and the tooling will not tell you. **`set` accepts anything you hand it and always prints `Successfully saved`** — it does not check the key, the value, or whether any of it makes sense. That message means "written to disk," not "correct."

So there is exactly one command that tells you the truth:

```bash
dotnet user-secrets list
```

> [!WARNING]
> **That prints your password.** Fine on your own screen — but if you're sharing a screen, or pasting the output somewhere to ask for help, mask it first:
>
> ```bash
> dotnet user-secrets list | sed 's/Password=[^;]*/Password=********/'
> ```
>
> Everything you actually need to debug is still visible: the key name, the server, the database, the user.

Three ways it goes wrong, in order of how quietly they fail:

**1. You forgot to quote the value.** This is the silent one. A connection string is full of `;`, and your shell reads `;` as *end of command*. Without quotes, everything after the first semicolon is chopped off and run as a separate command:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" Server=x;Database=y   # ✗
```

stores `Server=x` and nothing else. You get `Successfully saved`, no error — the leftover `Database=y` looks like a shell variable assignment, so your shell doesn't complain either. Then the app fails with a connection error that makes no sense against the string you *think* you typed. **Always put the value in quotes.**

**2. You misspelled the key.** `ConnectionString` instead of `ConnectionStrings` is the classic — one letter, and `GetConnectionString("DefaultConnection")` finds nothing. `set` stores it happily as a *second, useless* entry, so `list` shows both:

```
ConnectionStrings:DefaultConnection = Server=...
ConnectionString:DefaultConnection  = Server=...
```

Read those two lines carefully; they are hard to tell apart on purpose. Delete the wrong one:

```bash
dotnet user-secrets remove "ConnectionString:DefaultConnection"
```

*(`remove` prints nothing when it works. Run `list` again to confirm.)*

**3. The value itself is wrong** — a typo'd server, username or password. This one is easy: **just run `set` again with the same key.** It overwrites, and you don't need to remove anything first.

And if you want to start over entirely, `dotnet user-secrets clear` empties the store for that application.

> [!IMPORTANT]
> **Secrets do not travel with your repo, and that is the whole point.** Clone your project onto a second machine and the connection string is not there — you run `dotnet user-secrets set` again. Same if you work on a lab PC that resets itself when it reboots: your repo comes back from GitHub, your secret does not.
>
> So keep the connection string somewhere you can actually get to — your phone, a password manager, the class handout — and **not only on the machine that wipes itself**. One `set` command restores both `dotnet run` and `dotnet ef`; they read the same store.

> [!NOTE]
> **`appsettings.json` stays in your repo**, exactly as it has since week 3. It still holds your logging settings, and it has never held anything secret. The only thing that never goes in it is the connection string.

### One registration

`Program.cs`, above `var app = builder.Build();`:

```csharp
builder.Services.AddDbContext<CurbsideContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

You've been adding things to `builder.Services` since week 3 without much comment — `AddControllersWithViews()` is the same kind of line. That collection is the **dependency injection container**: a list of "if anybody asks for one of these, here's how to build it."

This line says three things:

1. **`AddDbContext<CurbsideContext>`** — when something asks for a `CurbsideContext`, make one.
2. **`UseSqlServer(...)`** — build it against the SQL Server provider. Swap this one call and the same context talks to PostgreSQL or SQLite instead.
3. **`GetConnectionString("DefaultConnection")`** — read the address out of configuration, **by name**. Not from a string literal here. Changing servers is now a change to configuration, not to code — which is the entire reason your deployed app can point somewhere different from your laptop without a rebuild.

Point 3 is the one to hold on to. `Program.cs` never says *where* the connection string came from. That turns out to matter a lot.

> [!TIP]
> **`GetConnectionString("X")` is shorthand for `Configuration["ConnectionStrings:X"]`.** Same thing, and worth knowing because the error you get when it returns `null` mentions neither: `UseSqlServer(null)` throws `ArgumentNullException`, and your app won't start. If the app dies immediately on launch with that, either the name doesn't match or nothing set the value — on a machine where you haven't run `dotnet user-secrets set`, it's the second one.

### Where configuration actually comes from

`builder.Configuration` is not a file. It's a **stack of sources**, read in order, and **later ones win**:

```
appsettings.json
   ↓  overridden by
appsettings.Development.json
   ↓  overridden by
user secrets            ← only when running in Development
   ↓  overridden by
environment variables
```

Three consequences, and all three are load-bearing this week:

1. **Your laptop reads the secret.** You run in Development, so user secrets are in the stack.
2. **Azure does not.** A deployed app runs in Production, where user secrets are *skipped entirely* — which is why your Azure app needs to be told the connection string separately, and why a secret can never leak into production by accident.
3. **An environment variable beats everything.** That's the hook Azure uses, and it's how you'll configure the deployed app in Part 7.

> [!TIP]
> **You can see the whole thing resolve.** `dotnet ef dbcontext info` prints the connection string your app would actually use, without connecting to anything:
>
> ```bash
> dotnet ef dbcontext info
> ```
>
> Look at the `Data source:` line. Set a secret and it appears; run the same command with `ASPNETCORE_ENVIRONMENT=Production` in front of it and it's blank again. That's the third row of the stack switching off in front of you.

> [!NOTE]
> **In configuration, `__` means `:`.** An environment variable called `ConnectionStrings__DefaultConnection` sets exactly the same value as `"ConnectionStrings": { "DefaultConnection": ... }` in a file. Environment variables can't contain a colon on every platform, so a double underscore stands in. You'll type this name in Part 7.

## Part 3: Migrations (25 min)

### Writing a model doesn't create a table

Open the **mssql** extension and look at your server right now. **Your database isn't there.** Not empty — absent. You described a table, named a server, and registered the whole thing, and nothing has touched SQL Server at all. This is the step people skip and then spend twenty minutes on.

> [!NOTE]
> **Your app still runs at this point, and that surprises people.** `AddDbContext` only registers *how* to build a context; nothing connects until something asks for one and uses it. Your controller still reads the old static list, so the pages work exactly as they did. The missing database doesn't announce itself until something queries it — which is when you'd meet `Invalid object name 'Trucks'`.

You have a C# class. SQL Server has no idea it exists. A **migration** is the bridge: a generated C# file that says, in EF Core's vocabulary, "create a table called Trucks with these columns." From inside the web project folder:

```bash
dotnet ef migrations add InitialCreate
```

`InitialCreate` is just a name — it becomes part of the filename. Pick something that describes the change; you'll be adding more of these in weeks 8 and 9.

A `Migrations/` folder appears with three files. The one to open is `<timestamp>_InitialCreate.cs`:

```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.CreateTable(
        name: "Trucks",
        columns: table => new
        {
            Id = table.Column<int>(type: "int", nullable: false)
                .Annotation("SqlServer:Identity", "1, 1"),
            Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
            Cuisine = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
            City = table.Column<string>(type: "nvarchar(max)", nullable: false),
            Rating = table.Column<double>(type: "float", nullable: false),
            IsOpenLate = table.Column<bool>(type: "bit", nullable: false)
        },
        constraints: table =>
        {
            table.PrimaryKey("PK_Trucks", x => x.Id);
        });
}
```

**Read that carefully, because it is last week's homework staring back at you.**

- **`nvarchar(50)`** on `Name`. Where did 50 come from? `[StringLength(50, MinimumLength = 2)]`. You wrote a validation rule in week 6 and it just became a column width.
- **`nullable: false`** on `Name`, `Cuisine` and `City` — that's `[Required]`, now a database constraint.
- **`City` is `nvarchar(max)`** because it has `[Required]` but no `[StringLength]`. Nothing said how long it could be, so EF Core reserved room for anything. Worth noticing: an annotation you *didn't* write shows up too.
- **`Id` gets `SqlServer:Identity`.** The column auto-numbers itself. EF Core assumed a property called `Id` is the primary key — by convention, no attribute needed — and made SQL Server responsible for assigning it. **Remember this; in Part 5 it deletes a line of your code.**

One model, two enforcers, exactly like week 6's client-and-server pair: the same annotations produce the browser's `data-val-*` attributes *and* the table's shape.

> [!IMPORTANT]
> **A migration is a snapshot of your model at the moment you generated it.** Change the model afterwards and the migration doesn't follow — you add another one. This is why the order matters so much tonight: seed data written *after* `migrations add` isn't in the migration, and the most common lab failure is exactly that.

### Applying it

The migration is a description. Nothing has happened to any database yet:

```bash
dotnet ef database update
```

Now it has. This connects using your connection string, creates the database if it isn't there, runs the `Up` method, and records that it did.

That last part is worth a look. Open the database in the **mssql** extension and there are *two* tables: `Trucks`, and `__EFMigrationsHistory` with one row in it. That's how `database update` knows what it has already done — run it again and it does nothing, because the history says so. It isn't magic and it isn't clever; it's a list of migrations that have been applied.

> [!TIP]
> **`dotnet ef` commands run from the folder with your `.csproj` in it**, not the folder above it. This is the opposite of `dotnet test` in the labs, and it catches people every week. If you get *"No project was found"*, you're in the wrong folder.

### The two errors you will actually get

**`Login failed for user '...'`** — the connection string reached the server and the server said no. Username or password is wrong. The server name is fine, or you'd have got the other error.

**`A network-related or instance-specific error occurred while establishing a connection`** — nothing answered. Server name is wrong, or you're not on a network that can reach it. It takes ~30 seconds to fail, which makes it feel like a hang.

Those two are worth telling apart on sight, because they send you to different halves of the same line.

## Part 4: Seeding (15 min)

### The table is empty

Open the `Trucks` table in the **mssql** extension. It exists, and it has no rows. That's correct — you created a table and nobody put anything in it. The six trucks are still in `TruckData.cs`, which is about to be deleted, and they need somewhere to live.

> [!NOTE]
> **Your page hasn't changed, and won't for a while yet.** `/Trucks` still shows six, because your controller still reads the old static list. The database and the page are two separate things until you connect them, which is the next part. Judge the database by the mssql panel, not the browser — the browser is still describing the past.

They go **on the model**, in `OnModelCreating`:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Truck>().HasData(
        new Truck { Id = 1, Name = "Roll Models", Cuisine = "Korean", City = "Madison", Rating = 4.6, IsOpenLate = true },
        new Truck { Id = 2, Name = "Cheese Curd Cartel", Cuisine = "Comfort", City = "Green Bay", Rating = 4.8, IsOpenLate = true },
        // ...and the rest
    );
}
```

`HasData` says: these rows are part of what this database *is*. Not "insert these now" — part of the description, the same way the columns are.

- **Every seeded row needs an explicit `Id`.** Normally the database assigns ids, but seed data is different: EF Core has to be able to tell next time whether row 3 changed, was removed, or is new, and it needs a stable identity to do that. Leave the `Id` off and you get an error saying so.
- **Seed data is for rows that are part of the app** — reference data, categories, a starting set. It is not a place to put test records.

> [!NOTE]
> **If your migration says `4.5999999999999996` where you wrote `4.6`, nothing is wrong.** A `double` stores fractions in binary, and binary can only write fractions whose denominator is a power of two. 4.6 is 23/5, so it repeats forever and gets cut off — the same reason `0.1 + 0.2` gives you `0.30000000000000004` in JavaScript. It's the identical number format.
>
> It only *looks* like that in the migration file, where EF Core writes 17 digits deliberately so the literal can't be misread. **SQL Server stores the same value and shows `4.6`, and your page will print `4.6`.** Notice that a rating of `4.5` comes out clean — a half is exact in binary.
>
> If you're storing money rather than a rating, use `decimal` instead: it works in base 10, so it has no such surprise. `[Column(TypeName = "decimal(18,2)")]` sets its precision.

### The second migration

The model changed, so the database is out of date. Same two commands:

```bash
dotnet ef migrations add SeedTrucks
dotnet ef database update
```

Open the new migration: it's nothing but `InsertData` calls. EF Core compared your model against the snapshot it saved last time, found six rows that weren't there before, and wrote the inserts.

**That comparison is the whole idea of migrations.** You describe what you want; EF Core works out the difference from what it last saw and writes the steps.

> [!TIP]
> **You could have written `HasData` before the first migration** and got one migration doing both jobs — which is what the lab has you do, because it's fewer moving parts. Doing it in two steps here is deliberate: watching a *second* migration contain only the difference is the clearest demonstration of what these things are.

## Part 5: The controller barely changes (25 min)

Here's the promise from the end of last week, and it's time to test it.

### Asking for the context

```csharp
public class TrucksController : Controller
{
    private readonly CurbsideContext _context;

    public TrucksController(CurbsideContext context)
    {
        _context = context;
    }

    // ...actions
}
```

**Nothing in this class ever creates a context, and nothing in it knows where the database is.** It declares in its constructor that it needs one, and the framework — which knows how, because of that one line in `Program.cs` — hands it over when it builds the controller for a request. That's **dependency injection**, and this is the first time in the course you've written the receiving end of it.

The `readonly` is habit, not requirement: the field is set once in the constructor and nothing should reassign it.

> [!NOTE]
> **You get a fresh context per request, and that's on purpose.** `AddDbContext` registers it as *scoped*, and in a web app a scope is one HTTP request. A context accumulates state about everything it has loaded, so a long-lived one is a memory leak with extra steps. This matters more in week 8; for now, know that the object is short-lived and cheap.

### Reading

```csharp
public IActionResult Index()
{
    return View(_context.Trucks.ToList());
}

public IActionResult Details(int id)
{
    var truck = _context.Trucks.FirstOrDefault(t => t.Id == id);

    if (truck == null)
    {
        return NotFound();
    }

    return View(truck);
}
```

Compare that to last week, honestly: `TruckData.All` became `_context.Trucks`, and `Index` gained a `.ToList()`. The `FirstOrDefault`, the null check, the `NotFound()`, the `View(truck)` — all identical. **The LINQ you learned against a `List<T>` works against a table**, which is most of why EF Core is pleasant to use.

The difference is where it runs. `_context.Trucks` is not a list; it's a *query that hasn't happened yet*. `ToList()` and `FirstOrDefault()` are the moment it goes to the server. And `FirstOrDefault(t => t.Id == id)` doesn't fetch every truck and pick one — it becomes a `WHERE` clause, and SQL Server does the picking.

> [!TIP]
> **Watch it happen.** `appsettings.Development.json` sets `"Microsoft.AspNetCore": "Warning"`, but EF Core logs at Information, so the generated SQL prints in your terminal on every request. Load `/Trucks` and read the `SELECT`. It's the single best way to build an accurate picture of what this library is doing on your behalf — and in week 9, when a query gets expensive, it's how you'll notice.

### Writing

```csharp
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult Create(Truck truck)
{
    if (!ModelState.IsValid)
    {
        return View(truck);
    }

    _context.Trucks.Add(truck);
    _context.SaveChanges();

    return RedirectToAction(nameof(Index));
}
```

The guard, the `View(truck)`, the redirect: untouched. Two lines changed in the middle, and one line disappeared.

- **`Add` does not write anything.** It tells the context "I intend to insert this." Nothing has left your process.
- **`SaveChanges()` is where it happens** — one round trip, wrapped in a transaction. Forget it and your form appears to work perfectly: no error, redirect happens, and the record simply isn't there. **That is the single most common bug of the week**, and it is silent, which should sound familiar after last week.

### The line you delete

```csharp
truck.Id = TruckData.All.Max(t => t.Id) + 1;      // ← gone
```

The `Id` column is an `IDENTITY`. SQL Server picks the next number, and EF Core reads the real value back onto your object during `SaveChanges()` — so `truck.Id` is correct on the line *after* the save, which is exactly when you'd want to redirect to it.

Keep the old line and you're fighting the database for the job. Set `Id` to something yourself and, at best, EF Core tries to insert it and SQL Server refuses.

Then delete `Models/TruckData.cs`. **It will stop compiling, and that's the useful part** — the compiler is now telling you every place that was still reading the old list, which is a much nicer way to find them than clicking around.

Curbside has two, and the second one is easy to forget: `Views/Trucks/Details.cshtml` builds its *"Also in {City}"* list straight out of `TruckData.All`. **That's a view reading data directly**, and the fix is the one you'd expect — query it in the controller and hand the result over. In `Details`, before returning:

```csharp
ViewData["AlsoHere"] = _context.Trucks
    .Where(t => t.City == truck.City && t.Id != truck.Id)
    .ToList();
```

and in the view:

```csharp
var alsoHere = (List<Truck>)ViewData["AlsoHere"]!;
```

**Your own app may have more**, and the home page is the usual suspect: if your `Views/Home/Index.cshtml` has a line like `var featured = TruckData.All.First(...)`, that view needs exactly the same treatment — inject the context into `HomeController`, query it there, and pass the result to the view.

> [!TIP]
> **Restart rather than trusting the reload.** Deleting a class is more than `dotnet watch` can hot-patch, and a build that fails leaves the *previous* version running — so a page that looks fine may be the old one. `Ctrl+C`, then `dotnet watch` again.

## Part 6: The payoff (10 min)

Add a truck through the form. It appears.

Now `Ctrl+C`. Start the app again. Reload.

**It's still there.**

That's the week. Nothing else tonight matters as much as that reload, because it's the first time anything you have built has outlived the program that built it.

Two more things worth doing while it's fresh:

- **Open the table in the mssql extension** and look at the row. Your truck, in a database, with an id SQL Server chose. The app isn't even running.
- **Note what didn't change.** The form, model binding, the annotations, `ModelState.IsValid`, the redirect, the validation messages, the layout, the partial. Week 6's work is untouched and still correct. You changed where the data lives, and nothing above it noticed.

## Part 7: The deployed app (10 min)

Your Azure app needs the same three things: the packages (they ship with the build), the code (it's in your repo), and **the connection string** — which is the one that needs thinking about, because it is deliberately in neither of those places.

Your secret is on your laptop, in your user profile. Azure has never seen it, your repo doesn't contain it, and a deployed app runs in **Production**, where user secrets aren't even read. So the deployed app has to be told separately — and the way to tell it is the bottom row of that stack from Part 2: **an environment variable.**

Deploy first, exactly as you have for four weeks:

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

Then give that app the connection string. This is a **setting on the app in Azure**, not a file — it's stored by Azure and handed to your app as an environment variable every time it starts:

```bash
az webapp config appsettings set --name your-app-XX1234 \
  --resource-group <YOUR-RESOURCE-GROUP> \
  --settings ConnectionStrings__DefaultConnection="Server=...;Database=...;User ID=...;Password=...;TrustServerCertificate=True"
```

That's the `__` from Part 2 doing its job: Azure sets an environment variable named `ConnectionStrings__DefaultConnection`, and your app reads it as `ConnectionStrings:DefaultConnection` — the same name `GetConnectionString("DefaultConnection")` has been asking for all night. **Nothing in your code changes. Nothing in your repo changes.**

You've never had to name a **resource group** before, because `az webapp up` quietly made one for you. It's a folder in your Azure account holding your app and its plan — that's the entire concept. To find yours:

```bash
az webapp list --query "[].{app:name, group:resourceGroup}" -o table
```

Setting it restarts the app on its own — **so wait rather than running it again.** On the free F1 tier the first request after a restart routinely takes 30 seconds or more, and a site that hasn't come back up yet looks exactly like a site with the wrong connection string. Give it a minute before you conclude anything.

If it's still wrong after that, watch it start instead of refreshing blindly — `az webapp log tail --name your-app-XX1234 --resource-group <YOUR-RESOURCE-GROUP>` prints the real exception. `az webapp restart` will force a bounce, but it restarts the same clock rather than shortening it.

Then load your site and the creatures are there.

Then — and this is the demonstration that makes the whole night land — **add a record on the deployed site and reload your local app.** Same row. One database, two applications, two machines, two completely different ways of being told where it is. That is what you built.

> [!WARNING]
> **Deploy first, then set the connection string.** `az webapp config appsettings set` needs an app that already exists, so running it before your first `az webapp up` fails with "resource not found." On that very first deploy the site will error until you set it — that's expected, not a broken deploy.

> [!TIP]
> **You only do this once per app.** App settings live on the Azure app, not in your code, so they survive every later `az webapp up`. Redeploy in weeks 8 and 9 and the connection string is still there.

> [!WARNING]
> **Stay in a US region.** Apps deployed to Canadian regions have never been able to reach the school's SQL Server. Use the region that worked for you in weeks 3–6; it's on the class list.

> [!IMPORTANT]
> **You do not need to run migrations against a "production" database**, because there isn't one — your laptop and your Azure app share a single database, and you already migrated it. That's unusual for a real deployment and completely fine for a course. Week 15 talks about what real projects do instead.

### Keeping the password out of a public repo

Here is the part worth noticing: **you didn't have to do anything.**

Your repo is public. Your connection string has a working password in it. And there is no step in this week's work where you delete it from a file, add anything to `.gitignore`, or untrack something you'd already committed — because the password was never in your project folder in the first place.

That's not a convenience, it's the difference between two outcomes:

| | Password in `appsettings.json`, then removed | Password in user secrets |
|---|---|---|
| In your working tree | until you remember to remove it | never |
| In your repo's **history** | **forever**, in every commit you already pushed | never |
| Fix if it leaks | rotate the password — the old one is public | nothing to fix |

The second row is the one that matters. Deleting a secret from a file doesn't delete it from the commits that already contain it; a public repo's history is public too. Getting the credential out of the folder *before* the first `git add` is the only version of this that actually works.

> [!TIP]
> **Check it yourself.** Run `git status` after setting your secret — nothing about it appears, because there's nothing in the repo to appear. The only file this week's secret work touched is your `.csproj`, and all it gained was that GUID.

You'll do this again for real. Week 10 adds sign-in, and the same store holds the same kind of thing.

## Wrap-up (10 min)

```
Models/Truck.cs        the shape of a row       (unchanged since week 6)
   ↓  [Required], [StringLength]  →  nullable: false, nvarchar(50)
Data/CurbsideContext   DbSet<Truck> Trucks      = the table
   ↓  dotnet ef migrations add    →  a C# description of the change
   ↓  dotnet ef database update   →  the change actually happens
SQL Server             Trucks + __EFMigrationsHistory
   ↑  _context.Trucks.ToList()          SELECT
   ↑  Add + SaveChanges()               INSERT, and the Id comes back
TrucksController       asks for a context in its constructor
```

- **Tonight:** the data left the process. A `DbContext` describes the database, a connection string says where it is, a migration builds it, `HasData` fills it, and the controller asks for a context instead of reaching for a static list.
- **The honest version of last week's promise:** it wasn't one line — it was a constructor, two lines in each read, and `SaveChanges()`. But the *shape* held. Every decision about validation, redirecting and rendering survived untouched, because none of them ever cared where the list came from.
- **Homework:** your own app's list moves into SQL Server. Same six steps, your model.
- **Next week:** the other two letters of CRUD — edit and delete — and the framework writing most of it for you.

## Appendix: Troubleshooting

**`No project was found in the current working directory`**
- `dotnet ef` runs from the folder containing your `.csproj`. In a lab layout that's `Cryptids.Web`, not the folder above it.

**`Unable to create a 'DbContext' of type ''`** / *"Unable to resolve the service for type DbContextOptions"*
- `AddDbContext` isn't in `Program.cs`, or it's below `builder.Build()`. Services have to be registered before the app is built.

**The app won't start at all, with `ArgumentNullException` / `Value cannot be null. (Parameter 'connectionString')`**
- `GetConnectionString("DefaultConnection")` returned nothing. Most often **no secret is set on this machine** — a fresh clone, a second computer, or a lab PC that reset itself. Run `dotnet user-secrets list` from your web project folder; if it's empty, that's your answer. Otherwise the key name is misspelled — it has to be exactly `ConnectionStrings:DefaultConnection`.
- `dotnet ef dbcontext info` shows what your app resolves. A blank `Data source:` is the same diagnosis without starting the app.

**`Login failed for user '...'`**
- The server answered and rejected you: username or password. The server name is right.

**`A network-related or instance-specific error occurred`**
- Nothing answered: server name is wrong, or this network can't reach it. Takes ~30s to fail, so it looks like a hang.

**`A connection was successfully established ... but then an error occurred during the login process` / a certificate complaint**
- `TrustServerCertificate=True` is missing from the connection string.

**`Invalid object name 'Trucks'`**
- The table isn't there. You created the migration but never ran `dotnet ef database update` — or you ran it against a different database than the app is using. Check both connection strings are the same one.

**`The model for context has pending changes` / *"...changes have been made to the model since the last migration"***
- You edited the model after generating the migration. Add another one: `dotnet ef migrations add WhateverChanged`.

**The list page is empty and there are no errors**
- The table exists but has no rows. Either `HasData` isn't in `OnModelCreating`, or it was added *after* the migration was generated. Check the migration file for `InsertData`; if it isn't in there, the migration predates your seed data.

**The seed data won't apply: `The seed entity for entity type 'X' cannot be added because no value was provided for the required property 'Id'`**
- Seeded rows need explicit `Id` values. EF Core has to be able to identify them across migrations.

**The form redirects, no error, and the record isn't in the list**
- No `SaveChanges()`. `Add` only records an intention. This is the quiet one.

**The new record shows up with Id 0, or `Cannot insert explicit value for identity column`**
- Last week's `item.Id = ...Max(...) + 1` line is still there. Delete it; the database assigns ids now.

**Everything works locally, and the deployed app throws a 500**
- **If you set the app setting less than a minute ago, wait.** It restarts the app, and a free-tier app that's still coming back up looks exactly like a broken one. Changing things during that window is how people break something that was working.
- Otherwise: almost always the connection string or the region. **Your laptop's user secret is not on Azure** — that's by design, and it's the first thing to check: `az webapp config appsettings list --name your-app-XX1234 --resource-group <YOUR-RESOURCE-GROUP>` should show `ConnectionStrings__DefaultConnection`, spelled with two underscores. Then read the log — `az webapp log tail --name your-app-XX1234 --resource-group <YOUR-RESOURCE-GROUP>`, or **Log stream** in the portal — for the actual exception, and confirm the app is in a **US** region.

**`dotnet ef` warns the tools are older than the runtime**
- `dotnet tool update --global dotnet-ef`. Worth doing; version skew here produces strange failures.
