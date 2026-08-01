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

# Week 7 — EF Core & SQL Server

.NET Web Development · Week 7 of 16

---

<!-- _footer: '🖥️ Demo §1 · the problem, felt once more' -->

## Six trucks. Again.

```csharp
public static List<Truck> All { get; } = new() { ... };
```

<br>

A variable in a running program.

**It lives exactly as long as the process does.**

---

<!-- _footer: '🖥️ Demo §1 · what a database actually buys you' -->

## Outside the process

| | `static List<T>` | A database |
|---|---|---|
| Survives a restart | no | **yes** |
| Survives a deploy | no | **yes** |
| Two apps, same data | no | **yes** |
| Someone else can read it | no | **yes** |

<br>

The data lives somewhere your app **isn't**.

---

<!-- _footer: '🖥️ Demo §1 · the shape of the night' -->

## Three things to add

1. **A `DbContext`** — one class that stands for your database
2. **A connection string** — where it is, and who you are
3. **A migration** — the step that actually builds the table

<br>

Writing the model creates nothing. **A migration does.**

---

<!-- _footer: '🖥️ Demo §2 · two packages' -->

## Two packages

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
```

<br>

**`.SqlServer`** — EF Core, and the part that speaks T-SQL

**`.Design`** — only for the `dotnet ef` tool. Your app never calls it

---

<!-- _footer: '🖥️ Demo §2 · the DbContext' -->

## The context

```csharp
public class CurbsideContext : DbContext
{
    public CurbsideContext(DbContextOptions<CurbsideContext> options)
        : base(options) { }

    public DbSet<Truck> Trucks => Set<Truck>();
}
```

<br>

**That property is the table.** The constructor is told where the database is — it never decides.

---

<!-- _footer: '🖥️ Demo §2 · where the connection string lives' -->

## Where the connection string lives

**Not** `appsettings.json` — your repo is public

```
appsettings.json
   ↓  beaten by
user secrets          ← your profile, not your project
   ↓  beaten by
environment variables ← how Azure will do it
```

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "..."
```

Later wins. Nothing to gitignore, because nothing is here.

---

<!-- _footer: '🖥️ Demo §2 · one registration' -->

## One registration

```csharp
builder.Services.AddDbContext<CurbsideContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
```

<br>

Which context · which provider · **the address, read from config by name**

---

<!-- _footer: '🖥️ Demo §3 · break it #1' -->

## A model is not a database

Table described. Server named. Context registered.

<br>

### So what happens when I load `/Trucks`?

---

<!-- _footer: '🖥️ Demo §3 · generating the migration' -->

## The migration, generated

```bash
dotnet ef migrations add InitialCreate
```

<br>

A generated C# file that says *"create a table called Trucks"*.

**Still nothing has happened to any database.**

---

<!-- _footer: '🖥️ Demo §3 · the rules become columns' -->

## Last week's rules, as columns

```csharp
Name = table.Column<string>(type: "nvarchar(50)",
                            maxLength: 50, nullable: false),
Id   = table.Column<int>(type: "int", nullable: false)
           .Annotation("SqlServer:Identity", "1, 1"),
```

<br>

Where did **50** come from? Nobody typed it tonight.

---

<!-- _footer: '🖥️ Demo §3 · applying it' -->

## Applying it

```bash
dotnet ef database update
```

<br>

Two tables appear: **`Trucks`**, and **`__EFMigrationsHistory`**.

That second one is how it knows what it has already done.

---

<!-- _footer: '🖥️ Demo §4 · an empty table' -->

## An empty table

`/Trucks` loads. Nothing on it.

<br>

**Correct.** You built a table. Nobody put anything in it.

---

<!-- _footer: '🖥️ Demo §4 · HasData' -->

## HasData

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Truck>().HasData(
        new Truck { Id = 1, Name = "Roll Models", ... },
        new Truck { Id = 2, Name = "Cheese Curd Cartel", ... }
    );
}
```

Not *"insert these now"* — **part of what the database is**.

Every seeded row needs an explicit `Id`.

---

<!-- _footer: '🖥️ Demo §4 · the second migration' -->

## The second migration

```bash
dotnet ef migrations add SeedTrucks
```

Open it: no `CreateTable`. Just six `InsertData` calls.

<br>

**You describe what you want. It works out the difference.**

---

<!-- _footer: '🖥️ Demo §5 · asking for the context' -->

## Asking for the context

```csharp
private readonly CurbsideContext _context;

public TrucksController(CurbsideContext context)
{
    _context = context;
}
```

<br>

No `new`. Nothing here knows the server's name.

**It asks. The framework hands one over.**

---

<!-- _footer: '🖥️ Demo §5 · reading' -->

## Reading

```csharp
return View(_context.Trucks.ToList());

var truck = _context.Trucks.FirstOrDefault(t => t.Id == id);
```

<br>

`TruckData.All` → `_context.Trucks`, plus a `ToList()`.

**That's it.** The LINQ is the same LINQ.

---

<!-- _footer: '🖥️ Demo §5 · break it #2' -->

## Writing

```csharp
_context.Trucks.Add(truck);

return RedirectToAction(nameof(Index));
```

Guard intact. Added. Redirected.

<br>

### Does the truck turn up?

---

<!-- _footer: '🖥️ Demo §5 · the line you delete' -->

## The line you delete

```csharp
truck.Id = TruckData.All.Max(t => t.Id) + 1;
```

`Id` is an **IDENTITY** column. SQL Server picks the number,

and `SaveChanges()` reads it back onto your object.

<br>

Then delete `TruckData.cs` — **and let the compiler find the rest**.

---

<!-- _footer: '🖥️ Demo §6 · the payoff' -->

## Restart it.

`Ctrl+C`. Start again. Reload.

<br>

**Seven trucks.**

<br>

The first thing you've built that outlived the program that built it.

---

<!-- _footer: '🖥️ Demo §7 · the deployed app' -->

## The deployed app

**Two** commands. Azure never saw your secret.

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"

az webapp config appsettings set --name your-app-XX1234 \
  --resource-group <RG> \
  --settings ConnectionStrings__DefaultConnection="..."
```

`__` is `:` — the bottom of the stack from slide 7.

⚠️ **US region.** Canadian regions can't reach the school server.

---

<!-- _footer: '🖥️ Demo §7 · one database two apps' -->

## One database, two apps

Add a truck on your **deployed** site.

Then run your app **locally** and look.

<br>

### It's there.

Two programs, two computers, one set of data.

---

<!-- _footer: '🖥️ Demo §8' -->

## Lab: the Registry gets a filing cabinet

- **1** — your connection string, and one successful `database update`
- **2** — `CryptidContext`: the `DbSet`, and the seed data
- **3** — register it in `Program.cs`
- **4** — `migrations add` → `database update`
- **5** — the controller reads from the table
- **6** — `Add` + `SaveChanges`

**⏱️ 50 minutes · target tonight: 1–5 green.**

---

<!-- _footer: '🖥️ Demo §9' -->

## Tonight, in one picture

```
Models/Truck.cs      [Required], [StringLength]
   ↓                 → nullable: false, nvarchar(50)
CurbsideContext      DbSet<Truck> Trucks  = the table
   ↓  migrations add    a C# description of the change
   ↓  database update   the change actually happens
SQL Server           Trucks + __EFMigrationsHistory
   ↑  .ToList()                SELECT
   ↑  Add + SaveChanges()      INSERT, and the Id comes back
```

- **Homework:** your app's list moves into SQL Server
- **Next week:** edit and delete — mostly written for you
