# Week 7 Demo Script — Curbside Gets a Database 🗄️

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-07/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> The projector has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it's due. Everything that isn't a 🎞️ line happens in the other state, so **you don't need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

> [!IMPORTANT]
> **Tonight is more typing and less breaking than week 6.** There are only two deliberate breaks (§3 and §5), and both are the errors students will actually hit in the lab. The compensation is that **the terminal is the star all night** — migration output, generated SQL, and two error messages worth recognising on sight. Size it accordingly.

## 0 · Before class

- [ ] **Copy `week-07/demo-starter/Curbside` out of the answer-keys repo** to a scratch folder. This is Curbside exactly as week 6's demo left it: the form, the annotations, the `ModelState` guard, the redirect, `_ValidationScriptsPartial` in a section. Nothing about it knows what a database is
- [ ] ⚠️ **Set your own connection string in user secrets before class and test it.** Everything after §2 depends on it, and *"Login failed for user"* in front of the room costs you the segment. From inside `Curbside`:
  ```bash
  dotnet user-secrets init
  dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=...;User ID=...;Password=...;TrustServerCertificate=True"
  ```
- [ ] Confirm it took: `dotnet user-secrets list` prints the connection string. **§2 shows this already done rather than doing it live** — your real password never goes on the projector
- [ ] **Point Curbside at its own database** — same server, same account, **different `Database=`** from the Cryptids one behind the lab answer key. One database per application. It matters because the demo *drops* Curbside's database and rebuilds it live in §3, and you run the answer key on screen at §8: share one database and you destroy the thing you're about to demo
- [ ] `cd Curbside && dotnet watch`
- [ ] **Park two browser tabs**: `/Trucks` and `/Trucks/Create`
- [ ] **Install and sign into the VS Code `mssql` extension**, with the connection to your database saved and **tested**, but the panel closed. You open it three times tonight and a login prompt each time kills the beat
- [ ] **Size the terminal for the back row and keep it visible all night.** Unlike week 6 you never need to clear it — the scroll *is* the story
- [ ] **Check `dotnet ef` is current:** `dotnet ef --version` against `dotnet --version`. A skew warning on the projector invites a question you don't want in §3
- [ ] Teaching profile; terminal font sized for the projector
- [ ] **Say it before you start: *"lids down — you'll build this yourself in the lab."*** Curbside isn't in the public repo, so nobody can follow along, and tonight's paste blocks are big
- [ ] Sanity check: `/Trucks` shows **six** cards, `/Trucks/Create` renders the form, filing a truck works and lands it on the list

> [!NOTE]
> **Trucks you add before §5 still vanish on restart**, because until then it's still `TruckData.All`. That's not a distraction tonight — it's the thing you're fixing, and `dotnet watch` restarting on every C# edit will demonstrate it for free several times.

## 1 · Six trucks. Again. *(slides 2–4)*

### The problem, felt once more *(slide 2)*

- [ ] **Before any slide:** on `/Trucks`, click `＋ Add a truck` and file one — **`Ghost Kitchen` / `Fusion` / `Madison` / `4.9`**. It lands. Seven cards
- [ ] In the terminal: **`Ctrl+C`**, then `dotnet watch` again. Reload `/Trucks`
- [ ] **Six.** Let it sit for a second without narrating it
- [ ] 🎞️ **GO TO SLIDE 2** — *Six trucks. Again.* · *"You watched this exact thing happen at the end of last week, and I told you it wasn't a bug. It still isn't. `TruckData.All` is a variable in a running program, and programs end."*
- [ ] 🔗 **Collect the Azure version:** *"some of you have already met the worse form of this — you added test data on Monday, the free-tier app went to sleep, and Wednesday it was gone. Nothing was broken."*

### What a database actually buys you *(slide 3)*

- [ ] 🎞️ **GO TO SLIDE 3** — *Outside the process*. Walk the table row by row
- [ ] 🎯 **Land the third row and slow down on it:** *"two apps see the same data. Tonight your laptop and your Azure app point at the same database. You'll add a truck on the deployed site and see it on localhost. Nothing you have built in six weeks could do that."*
- [ ] Say what's *not* happening: **nothing to install.** The school runs the SQL Server, you each have an account, and it's reachable off campus. The only new tool is a VS Code extension for looking at tables

### The shape of the night *(slide 4)*

- [ ] 🎞️ **GO TO SLIDE 4** — *Three things to add*. Read the three, then say the fourth thing out loud because it isn't on the slide: *"and then the controller changes — less than you think. I promised you that last week and we're going to find out how honest it was"*
- [ ] **✓ CHECKPOINT:** everyone can say why a restart empties the list

## 2 · The context *(slides 5–8)*

### Two packages *(slide 5)*

- [ ] 🎞️ **GO TO SLIDE 5** — *Two packages*
- [ ] In a **second terminal** (`dotnet watch` owns the first) — **type the first, paste the second**:
  ```bash
  dotnet add package Microsoft.EntityFrameworkCore.SqlServer
  dotnet add package Microsoft.EntityFrameworkCore.Design
  ```
- [ ] **Open `Curbside.csproj` and point at what appeared.** *"That's all that command does — it edited this file and downloaded a package. There's no install directory, and this file is the part that gets committed"*
- [ ] Name the split, briefly: **`.SqlServer`** is EF Core plus the bit that speaks T-SQL · **`.Design`** is only used by the `dotnet ef` command-line tool, never by your app. *"Leave it out and the migration command fails with a message about design-time services, which is a rotten way to find out"*
- [ ] Mention the tool is per-machine, not per-project — `dotnet tool install --global dotnet-ef` — and that you already have it

### The DbContext *(slide 6)*

- [ ] 🎞️ **GO TO SLIDE 6** — *The context*. The whole class is on it; read it there, then swipe back and type it
- [ ] Make a `Data` folder next to `Models` and `Controllers`, and create `Data/CurbsideContext.cs` — **type this one, all of it. It's fifteen lines and it's the centre of the week:**

  <details><summary>📋 paste: Data/CurbsideContext.cs</summary>

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

  </details>

- [ ] Point at the three parts in order:
  - **`: DbContext`** — *"this class is the database, as far as your code is concerned"*
  - **`DbSet<Truck> Trucks`** — 🎯 *"this property **is** the table. Not a description of one — having it here is what makes EF Core believe there should be a Trucks table at all. Querying this is querying SQL Server"*
  - **the constructor** — *"it's handed its options rather than deciding them. Look at what's missing: this class does not know where the database is, and never will"*
- [ ] Note in passing, don't dwell: `=> Set<Truck>()` versus `{ get; set; }` — both work, pick one, don't mix

### Where the connection string lives *(slide 7)*

- [ ] 🎞️ **GO TO SLIDE 7** — *Where the connection string lives*
- [ ] **Open `appsettings.json` and put the cursor in it — then don't type anything.** Ask it out loud: *"this is where configuration lives. Who thinks the connection string goes here?"* Let hands go up
- [ ] 🎯 **Then say why not:** *"it would work. And it contains a working password, and your homework repo is public. So no"*
- [ ] Close `appsettings.json` **without editing it**. It stays in the repo all night — that's the point
- [ ] **Show the two commands on screen** — these are the ones they'll run in the lab. Say you ran them before class, and why: *"I'm not typing a live password onto a projector, and neither should you into a repo"*
  ```bash
  dotnet user-secrets init
  dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=...;User ID=...;Password=...;TrustServerCertificate=True"
  ```
- [ ] ⚠️ **Point at the quotes around the value and say why** — *"that string is full of semicolons, and your shell reads a semicolon as end-of-command. Leave the quotes off and it saves `Server=` and throws the rest away, and still tells you it worked"*. It's the silent one, and it will happen in the lab
- [ ] **Prove it's really there:** `dotnet user-secrets list` in the second terminal. *"`set` says `Successfully saved` no matter what you give it — this is the command that actually tells you"*
- [ ] **Show what `init` did:** open `Curbside.csproj` and point at the `<UserSecretsId>` line. *"That's a folder name, not a secret. It gets committed — it's how the tooling finds the file next time"*
- [ ] 🎯 **Then the part they'll misremember otherwise — where the file actually is.** Say the path out loud: `~/.microsoft/usersecrets/<that GUID>/secrets.json`. *"Not in the project. Not in the repo. In my user profile"*
- [ ] Walk the four parts of the string: which machine · which database · who you are · **and `TrustServerCertificate=True`**
- [ ] Give the certificate line its sentence, because someone always asks: *"SQL Server encrypts by default and then checks the server's certificate, the way your browser checks an https certificate. Ours is self-signed, so that check fails and the connection is refused. This says encrypt anyway, skip the identity check. On a school network that's the pragmatic answer. It is not what you'd write for a bank"*
- [ ] 🎯 **The sentence that does the work:** *"the file with my password in it is not in this folder. It's in my user profile. There is no `.gitignore` line to forget, because there is nothing here to ignore"*

### One registration *(slide 8)*

- [ ] 🎞️ **GO TO SLIDE 8** — *One registration*
- [ ] In `Program.cs`, above `var app = builder.Build();` — **type it**:
  ```csharp
  builder.Services.AddDbContext<CurbsideContext>(options =>
      options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
  ```
- [ ] Add the `using Curbside.Data;` and `using Microsoft.EntityFrameworkCore;` at the top when the editor complains — **let it complain first**, so they see which one is missing
- [ ] 🔗 **Point at `AddControllersWithViews()` two lines up:** *"you've been writing lines like this since week 3 and I never said what that collection was. It's a list of 'if anyone asks for one of these, here's how to build it.' It's called dependency injection, and in fifteen minutes you'll write the other end of it"*
- [ ] Three things in the one line: **which context** · **which provider** (*"swap that one call and the same code talks to PostgreSQL"*) · **the address read from configuration by name**, not typed here
- [ ] 🎯 **Land the absence:** *"read that line again. It asks for a connection string by name. It does not say where it came from — and that turns out to be the whole reason this app can run on my laptop and on Azure without a rebuild"*

#### Watch the stack resolve

- [ ] **Predict-then-run.** Ask first: *"the string is in my user profile. What does the app see?"* Then, in the second terminal:
  ```bash
  dotnet ef dbcontext info
  ```
- [ ] Point at **`Data source:`** — your server name. *"It found it. Nothing in this project contains that."*
- [ ] Now run it again as production — **paste this whole line**:
  ```bash
  ASPNETCORE_ENVIRONMENT=Production dotnet ef dbcontext info
  ```
- [ ] 🎯 **`Data source:` is blank.** Sit on it. *"Same code, same machine, same secret on disk. User secrets are a development-only thing — a deployed app doesn't read them at all. That's not a limitation, it's the safety: your password cannot leak into production by accident, because production isn't looking"*
- [ ] Then the third row, so all three are on screen once:
  ```bash
  ConnectionStrings__DefaultConnection="Server=env-wins;Database=Demo;User ID=u;Password=p;TrustServerCertificate=True" dotnet ef dbcontext info
  ```
- [ ] **`Data source: env-wins`.** *"Environment variables beat everything. Hold on to that — it's how you'll tell Azure where the database is in §7"*
- [ ] ⚠️ **Nothing connected to anything.** `dbcontext info` only resolves configuration — say so, or someone thinks you just logged into a server called `env-wins`
- [ ] **✓ CHECKPOINT:** the room can say what a `DbSet` property means, and why Azure won't see your secret

## 3 · Migrations *(slides 9–12)*

### Break it #1 — a model is not a database *(slide 9)*

- [ ] 🎞️ **GO TO SLIDE 9** — *A model is not a database* · **predict first, show of hands:** *"I've described the table. I've said where the server is. I've registered the whole thing. What happens if I load `/Trucks` right now?"*
- [ ] Reload `/Trucks`:
  ```
  SqlException: Invalid object name 'Trucks'.
  ```
- [ ] 🎯 *"It connected. It logged in. It sent a `SELECT` and the server said: there's no such table. Describing a table in C# does not create one — **nothing has happened to any database yet**"*
- [ ] ⚠️ **Say plainly that this is tonight's most common lab error**, and that the message is unusually honest: *"invalid object name means the table isn't there, which nearly always means you didn't run the update command"*
- [ ] No restore needed — the next two commands are the fix

### Generating the migration *(slide 10)*

- [ ] 🎞️ **GO TO SLIDE 10** — *The migration, generated*
- [ ] In the second terminal, **from the folder with the `.csproj` in it** — say that out loud, it's the opposite of `dotnet test`:
  ```bash
  dotnet ef migrations add InitialCreate
  ```
- [ ] *"`InitialCreate` is just a name — it ends up in the filename. You'll add more of these in weeks 8 and 9"*
- [ ] Show the `Migrations/` folder: three files. Open **`<timestamp>_InitialCreate.cs`** and put it on screen

### The rules become columns *(slide 11)*

- [ ] 🎞️ **GO TO SLIDE 11** — *Last week's rules, as columns* · **predict before you point:** *"`Name` is `nvarchar(50)`. Where did the fifty come from? Nobody typed fifty tonight"*
- [ ] Let them find it. It's **`[StringLength(50, MinimumLength = 2)]`**, written last week as a *form validation rule*
- [ ] 🎯 **The sentence:** *"you wrote that to stop someone typing a paragraph into a text box. It just became the width of a database column. One description of a truck — the browser reads it, the server reads it, and now the table is built from it"*
- [ ] Walk three more, in the migration on screen:
  - **`nullable: false`** on `Name`, `Cuisine`, `City` — that's `[Required]`, now a database constraint
  - **`City` is `nvarchar(max)`** — it has `[Required]` but no `[StringLength]`, so nothing said how long it could be. *"An annotation you didn't write shows up too"*
  - **`Id` gets `SqlServer:Identity`** — *"EF Core assumed a property called `Id` is the primary key, by convention, and made **SQL Server** responsible for numbering it. Hold onto that. In twenty minutes it deletes a line of your code"*
- [ ] ⚠️ **Say the snapshot rule now, because it's the other big lab failure:** *"a migration is a photograph of your model at the moment you generate it. Change the model afterwards and this file does not follow — you add another one. That matters in about ten minutes"*

### Applying it *(slide 12)*

- [ ] 🎞️ **GO TO SLIDE 12** — *Applying it*
- [ ] **Predict:** *"the migration is a description. Has anything happened to the database yet?"* — then:
  ```bash
  dotnet ef database update
  ```
- [ ] **Let the SQL scroll past and don't apologise for it.** *"That's the CREATE TABLE it just ran, and you can read it"*
- [ ] Reload `/Trucks`. **It loads. It's empty.** *"No error. Zero trucks on the street"*
- [ ] Open the **mssql** panel and expand the database — 🎯 **two tables**: `Trucks`, and `__EFMigrationsHistory` with one row
- [ ] *"That second table is how `database update` knows what it's already done. Run the command again —"* do it — *"and nothing happens, because the history says so. It's not clever. It's a list"*
- [ ] 💡 If asked about the two error messages: **`Login failed for user`** = the server answered and said no (username/password) · **`A network-related or instance-specific error`** = nothing answered (server name, or you're on the wrong network), and it takes ~30 seconds to fail so it feels like a hang
- [ ] **✓ CHECKPOINT:** the room can say what `migrations add` produces versus what `database update` does

## 4 · Seeding *(slides 13–15)*

### An empty table *(slide 13)*

- [ ] 🎞️ **GO TO SLIDE 13** — *An empty table*
- [ ] Put `/Trucks` and `Models/TruckData.cs` on screen together. *"The page is right — the table really is empty. And the six trucks are still sitting here in a file I'm about to delete. They need somewhere to live"*

### HasData *(slide 14)*

- [ ] 🎞️ **GO TO SLIDE 14** — *HasData*
- [ ] Back in `Data/CurbsideContext.cs`, **paste** `OnModelCreating` below the `DbSet`:

  <details><summary>📋 paste: OnModelCreating with the six trucks</summary>

  ```csharp
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
      modelBuilder.Entity<Truck>().HasData(
          new Truck { Id = 1, Name = "Roll Models", Cuisine = "Korean", City = "Madison", Rating = 4.6, IsOpenLate = true },
          new Truck { Id = 2, Name = "Cheese Curd Cartel", Cuisine = "Comfort", City = "Green Bay", Rating = 4.8, IsOpenLate = true },
          new Truck { Id = 3, Name = "Taco Tornado", Cuisine = "Mexican", City = "Milwaukee", Rating = 4.4, IsOpenLate = false },
          new Truck { Id = 4, Name = "The Gyro Wheel", Cuisine = "Greek", City = "Madison", Rating = 4.2, IsOpenLate = true },
          new Truck { Id = 5, Name = "Pierogi Party", Cuisine = "Polish", City = "Stevens Point", Rating = 4.7, IsOpenLate = false },
          new Truck { Id = 6, Name = "Banh Mi Mobile", Cuisine = "Vietnamese", City = "Milwaukee", Rating = 4.5, IsOpenLate = false }
      );
  }
  ```

  </details>

- [ ] *"`HasData` says: these rows are part of what this database **is**. Not 'insert them now' — part of the description, the same way the columns are"*
- [ ] ⚠️ **Point at the explicit `Id`s and say why**, because the error message for getting this wrong is long: *"normally the database picks ids. Seed rows are different — EF Core has to be able to tell next time whether row 3 changed, vanished or is new, and it can't do that without a stable identity"*
- [ ] Say what seed data is *for*: reference data, categories, a starting set. **Not test records**
- [ ] **Reload `/Trucks`.** Still empty 🎯 — *"I changed the model. Why isn't it in the table?"* Let them answer with the snapshot rule from ten minutes ago

### The second migration *(slide 15)*

- [ ] 🎞️ **GO TO SLIDE 15** — *The second migration*
- [ ] ```bash
  dotnet ef migrations add SeedTrucks
  ```
- [ ] **Open it before applying it.** 🎯 *"Look what's in here. No CreateTable — just six InsertData calls. EF Core compared my model against the snapshot it saved last time, found six rows that weren't there, and wrote the difference"*
- [ ] 🎯 **That's the whole idea, and it's worth saying as one sentence:** *"you describe what you want; it works out the steps from what it last saw"*
- [ ] ```bash
  dotnet ef database update
  ```
- [ ] Reload `/Trucks`. **Six cards.** They came out of SQL Server this time
- [ ] Show the rows in the **mssql** panel next to the page. Same six, in a table, on another machine
- [ ] 💡 Mention, don't demo: *"I could have written `HasData` before the first migration and got one migration doing both jobs — that's what the lab has you do. I split it so you could watch the second one contain only the difference"*

## 5 · The controller barely changes *(slides 16–19)*

> [!IMPORTANT]
> **This is the segment that pays off last week's promise, and §5's break is the one that matters most.** If §3 ran long, take it out of §7, not out of here.

### Asking for the context *(slide 16)*

- [ ] 🎞️ **GO TO SLIDE 16** — *Asking for the context*
- [ ] At the top of `TrucksController`, **type it**:
  ```csharp
  private readonly CurbsideContext _context;

  public TrucksController(CurbsideContext context)
  {
      _context = context;
  }
  ```
- [ ] 🎯 **Say what is deliberately absent:** *"there is no `new CurbsideContext(...)` anywhere in this class, and nothing in here knows the server's name. It states in its constructor that it needs one, and the framework hands it over — because of that single line in `Program.cs`"*
- [ ] 🔗 **Collect §2:** *"that's the other end of the dependency injection I pointed at twenty minutes ago. You've been on the receiving end of it since week 3 without writing any"*
- [ ] Aside, one sentence: you get a **fresh context per request** — it's registered *scoped*, and in a web app a scope is one HTTP request. *"They're cheap and short-lived. It matters more next week"*

### Reading *(slide 17)*

- [ ] 🎞️ **GO TO SLIDE 17** — *Reading*
- [ ] Change `Index` and `Details` — **type both, they're small**:
  ```csharp
  public IActionResult Index()
  {
      return View(_context.Trucks.ToList());
  }

  public IActionResult Details(int id)
  {
      var truck = _context.Trucks.FirstOrDefault(t => t.Id == id);
      ...
  }
  ```
- [ ] 🎯 **Put last week's version next to it and count the changes out loud:** `TruckData.All` → `_context.Trucks`, and a `.ToList()`. *"The null check, the `NotFound`, the `View(truck)` — untouched. The LINQ you learned against a `List<T>` works against a table"*
- [ ] Then the honest difference: *"`_context.Trucks` is not a list. It's a query that hasn't happened yet. `ToList()` is the moment it goes to the server"*
- [ ] **Reload `/Trucks` and read the terminal** — EF Core logs the SQL it generated. 🎯 *"There's the SELECT. You can read it"*
- [ ] Load `/Trucks/Details/2` and read that one too: *"`FirstOrDefault(t => t.Id == id)` didn't fetch six trucks and pick one — it became a WHERE clause, and the server did the picking"*
- [ ] 💡 Say this is worth keeping an eye on all term: *"in week 9 a query gets expensive, and this terminal is how you'll notice"*

### Break it #2 — writing *(slide 18)*

- [ ] 🎞️ **GO TO SLIDE 18** — *Writing*
- [ ] Rewrite the POST action, but **deliberately leave `SaveChanges()` out** — and don't announce that you have:
  ```csharp
  _context.Trucks.Add(truck);

  return RedirectToAction(nameof(Index));
  ```
- [ ] Delete the old `truck.Id = TruckData.All.Max(...) + 1;` line while you're in there — you come back to it on the next slide
- [ ] **Predict, show of hands:** *"guard's intact, I've added it to the context, I redirect. Does the truck turn up?"*
- [ ] File a truck — **`Ghost Kitchen` / `Fusion` / `Madison` / `4.9`**. The form submits. The redirect happens. **`/Trucks` shows six**
- [ ] 🎯 **Sit in it.** *"No error. No warning. The form worked perfectly and nothing was saved. Check the terminal — there's no INSERT. Check the table —"* open the **mssql** panel and refresh — *"six rows"*
- [ ] Now say why: **`Add` does not write anything.** *"It tells the context 'I intend to insert this.' Nothing has left the process"*
- [ ] **Add the line** — ⚠️ **and say it's a C# edit so `dotnet watch` will restart**:
  ```csharp
  _context.SaveChanges();
  ```
- [ ] File the same truck again. **Seven cards** 🎉 — and the terminal shows the `INSERT`
- [ ] ⚠️ **Name it as the bug of the week:** *"forgetting `SaveChanges` is the single most common thing that goes wrong tonight, and it is completely silent. If your form works and the record isn't there, this is it. Every time"*

### The line you delete *(slide 19)*

- [ ] 🎞️ **GO TO SLIDE 19** — *The line you delete* · 🔗 **collect §3:** *"remember `SqlServer:Identity` in the migration"*
- [ ] Point at the deleted `Max(t => t.Id) + 1` line. *"SQL Server picks the number now. And EF Core reads the real value back onto your object during `SaveChanges` — so `truck.Id` is correct on the line **after** the save, which is exactly when you'd want to redirect to it"*
- [ ] Show it in the **mssql** panel: the new truck's `Id` is **7**, and nothing in your code chose it
- [ ] Now delete **`Models/TruckData.cs`** 🎯 — *"and if the project stops compiling, the compiler is about to tell me every place that was still reading the old list. That's a much nicer way to find them than clicking around"*
- [ ] It compiles: Curbside only read it from the controller. ⚠️ **Warn them theirs may differ:** *"in your own app there may be more than one. The home page is the usual suspect — if your `Views/Home/Index.cshtml` has a `var featured = TruckData.All.First(...)` in it, that's a view reading data directly, and it needs the same treatment: inject the context into `HomeController`, query it there, pass it to the view"*
- [ ] **✓ CHECKPOINT:** the room can say what `Add` does and what `SaveChanges` does

## 6 · The payoff *(slide 20)*

- [ ] **Stay in the browser.** `/Trucks` with seven cards on it, the seventh one yours
- [ ] In the terminal: **`Ctrl+C`**. Then `dotnet watch` again. Reload
- [ ] **Seven.** 🎯 **Say nothing for a beat and let them get there first**
- [ ] 🎞️ **GO TO SLIDE 20** — *Restart it.* Now — straight off the seven cards that didn't disappear
- [ ] 🔗 *"Same three keystrokes as the first two minutes of tonight. Different answer. That's the week — it's the first time anything you've built has outlived the program that built it"*
- [ ] Open the **mssql** panel one last time with the app **stopped**: *"the app isn't even running and the data is still there. It was never yours to lose"*
- [ ] 🎯 **Then the other half, pointing at the editor:** *"and look at what didn't change. The form. Model binding. The annotations. `ModelState.IsValid`. The redirect. The error messages. The layout, the partial, the theme. You changed where the data lives and nothing above it noticed"*

## 7 · The deployed app *(slides 21–22)*

- [ ] 🎞️ **GO TO SLIDE 21** — *The deployed app*
- [ ] ⚠️ **Nothing is deployed tonight — this is a talk-through, not a demo.** Say so: *"I'm not deploying this; the only Azure deploy I do all term was week 3. This is what **you** do for the homework"*
- [ ] Walk the three things a deployed app needs: the packages (they ship with the build) · the code (it's in your repo) · **the connection string**, which is the interesting one
- [ ] 🔗 **Collect §2's blank `Data source:` — this is what it was for.** *"Your secret is on your laptop, in your user profile. It is not in your repo, so it isn't in the deploy. And you watched a production app refuse to read it. So Azure has to be told separately"*
- [ ] Show **both** commands on the slide. The first is the one they've run for four weeks; the second is new and runs **once per app, ever**
- [ ] 🎯 **Point at the double underscore and say why:** *"`ConnectionStrings__DefaultConnection`. Two underscores, because an environment variable can't have a colon in it on every platform. .NET translates it straight back to the name your code already asks for. Nothing in your code changes"*
- [ ] ⚠️ **Order matters, and it bites:** deploy **first**, then set the app setting — the setting needs an app that already exists. *"Between those two commands your site will error. That's not a broken deploy"*
- [ ] ⚠️ **Say the resource-group thing before anyone hits it.** They've never typed one — `az webapp up` made it silently in week 3. *"It's a folder in your Azure account. `az webapp list -o table` tells you yours, and the notes have the command"*
- [ ] ⚠️ **US region.** Apps in Canadian regions have never been able to reach the school's server. *"Use the one that worked for you before"*

### One database, two apps *(slide 22)*

- [ ] 🎞️ **GO TO SLIDE 22** — *One database, two apps*
- [ ] 🔗 **Collect slide 3's third row:** *"this is the one I told you to hold onto at the start. Your deployed app and your laptop point at the same database"*
- [ ] **Give them the exercise out loud, and tell them it's the best two minutes of the homework:** *"add a truck on your deployed site. Then run your app locally and look at your list. It's there. Two programs, two computers, one set of data"*
- [ ] Then the honest footnote: *"sharing one database between dev and production is not what a real project does — you'd have two. Week 15 covers what real projects do. For a course it's fine, and it makes the point better than two databases would"*
- [ ] 🎯 **Close the secrets thread, and make it the smallest possible step:** *"and notice what isn't in your homework this week. There's no `.gitignore` line, nothing to untrack, nothing to clean out of your history — because the password was never in the folder. That's the entire reason we did it that way in §2"*
- [ ] Say the one that matters for anyone who gets it wrong: *"if you do put it in `appsettings.json` and commit it, deleting it later doesn't help — it's in every commit you already pushed. Come and tell me and we'll change your password. Much better to make that mistake here than at work"*

## 8 · Hand off to the lab *(slide 23)*

- [ ] 🎞️ **GO TO SLIDE 23** — *Lab: the Registry gets a filing cabinet*. Leave it up for the whole lab; it's the task list
- [ ] Show **what done looks like** — the answer key **running on localhost**, seven creatures after a restart, and `dotnet test Cryptids.Checks` printing **6 / 6**. That's `week-07/lab/solution` in the answer-keys repo; `dotnet run` from `Cryptids.Web`, `dotnet test` from the folder above it. ~90 seconds, a target not a walkthrough. **Nothing is deployed for this** — Azure is their homework, not tonight
- [ ] Setup on screen, said once: **`git pull` → copy `week-07/lab/starter` out and rename it → open the folder holding *both* projects → `cd Cryptids.Web` and set your connection string in user secrets → `dotnet test Cryptids.Checks`**
- [ ] ⚠️ **The connection string is task 1 and it is the thing that will eat the lab.** Say it plainly: *"two commands, `init` then `set`, from inside `Cryptids.Web` — then get one `dotnet ef database update` to succeed. If that command works, the rest of the lab is C#. If it doesn't, come and get me — don't spend twenty minutes on it"*
- [ ] ⚠️ **For anyone on a lab PC that resets itself:** *"you'll set that secret again next time you sit down here. It lives in your user profile, not your project. Keep the connection string somewhere that isn't this machine"*
- [ ] Say that **the EF packages are already in the starter's `.csproj`**, so nobody is stuck behind NuGet on the class wifi. *"You'll run those two commands yourself in the homework; they're in the notes"*
- [ ] ⚠️ **Warn them the checks never touch SQL Server.** They run the app against an in-memory database, so `dotnet test` works with no network. *"That means 6/6 does not prove your connection string is right — your own browser does. Both matter"*
- [ ] **In-class target: checks 1–5.** Check 6 is `Add` + `SaveChanges` and rolls into the homework if time goes

## 9 · Wrap-up, after the lab *(slide 24)*

- [ ] 🎞️ **GO TO SLIDE 24** — *Tonight, in one picture*. Walk it once, top to bottom — model, context, migration, database, and the two arrows back up
- [ ] 🔗 **Answer last week's promise honestly:** *"I said one line would change. It was a constructor, two lines in the reads and a `SaveChanges`. But the **shape** held: every decision about validating, redirecting and rendering survived untouched, because none of them ever cared where the list came from"*
- [ ] Homework: **their own app's list moves into SQL Server** — same six steps, their model. And the deployed-plus-local exercise
- [ ] 🔗 Week 8: *"you've done the R in CRUD, and half the C. Next week is the other two letters — and the framework writes most of it for you"*
