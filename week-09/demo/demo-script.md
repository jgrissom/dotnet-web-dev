# Week 9 Demo Script — Curbside Grows Relatives 🔗

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-09/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it is due. Everything that is not a 🎞️ line happens in the other state, so **you do not need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

> [!IMPORTANT]
> **Tonight the lab comes in eight short blocks, one after each part of the demo that it practices.** Each block has its own `## Lab` section below — what to say, what to watch for, and the README note it stops at. The lab README goes on screen for every block. There is no lab slide. §6 has no lab task of its own, so it runs straight into the second ☕ break instead.

> [!IMPORTANT]
> **Tonight has two deliberate failures and one hidden cost, and none of the three gets announced.** **Failure #1** is §4: a truck's page says **Nothing listed** while the table holds two rows. **The hidden cost** is §5, and it is the odd one — the page is entirely **correct**, and it pays **eight queries** to draw. Nothing on screen looks wrong, which is exactly why the terminal is the only place it shows. **Failure #2** is §7: a perfectly filled form is refused, blaming a field the user cannot see. All three are silent and all three are met on your machine first; the two *failures* are the ones waiting in the homework's 🆘 list.
>
> ⚠️ **Nothing tonight gets broken and put back.** Every one of the three is the naive version written forward into the right one — there is no beat that damages working code and restores it, so nothing here needs undoing if you lose your place.

## 0 · Before class

- [ ] ⚠️ **Re-rehearsing this week? Delete `instructor/week-09/Curbside` first** — a rehearsal leaves it in tonight's **end** state, and every beat below starts from week 8's. Deleting the folder in Finder is enough; the next step recreates it
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course/instructor/week-09`, create a new empty **folder** named `Curbside` and open it *(the dialog's **New Folder** button makes `week-09` too, the first time)*. **The folder stays empty — there is no `dotnet new` tonight;** the next step fills it with the starter. Its own week folder, so nothing here collides with another week's `Curbside`
- [ ] Integrated terminal (**Ctrl+&#96;**) — fill the empty folder with tonight's starter. This is Curbside exactly as week 8's demo left it: full CRUD, a themed Edit and Delete, three migrations, `Slogan` on the cards, and no scaffold:
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-09/demo-starter/Curbside/. .
  ```
  The trailing `/.` copies the *contents* in, so the project lands at the top of the window you already have open — no folder inside a folder

  ⚠️ **That resets the files, not the database.** Curbside's data lives on the school SQL Server, and every copy carries the same `<UserSecretsId>` — so the drop-and-rebuild below is a *separate* reset and you need both.
- [ ] **Set your connection string in your copy** — the `<UserSecretsId>` ships in the `.csproj`, so `set` alone is enough, no `init`:
  ```bash
  dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=...;User ID=...;Password=...;TrustServerCertificate=True"
  ```
- [ ] ⚠️ **Rebuild the database — before your rehearsal, and again after it:**
  ```bash
  dotnet ef database drop --force
  dotnet ef database update
  ```
  **The drop is what makes the update work.** The shipped migrations are new files with new ids — a database that still has your week-8 `__EFMigrationsHistory` refuses them with *"there is already an object named 'Trucks'"*. Then check `/Trucks` shows **seven** cards with slogans on them
- [ ] **Rehearse the whole script once in a separate copy (≈40 min).** Besides finding what is broken, the rehearsal warms your NuGet cache
- [ ] 🚨 **Then run the drop + rebuild above again — the rehearsal used the same database.** A separate *copy* is not a separate database: the `<UserSecretsId>` ships in the `.csproj`, so every copy reads one secret and points at one database. Forty minutes of rehearsal leaves it in tonight's **end** state — `Specials` and `Dishes` tables already there — and §2 has nothing left to create in front of the room. **Last thing before class, always: drop, update, `/Trucks` shows seven cards**
- [ ] Run it, same terminal:
  ```bash
  dotnet watch
  ```
- [ ] **Open a second integrated terminal** (the `+` on the terminal panel — it opens in the same folder). `dotnet watch` owns the first one all night; everything you type tonight goes in the second — §3's and §9's `dotnet ef migrations add` and `dotnet ef database update`
- [ ] ⚠️ **Know the one prompt that will bite you, and answer it `a` the first time.** Creating a *new* `.cshtml` (§7's `Specials/Create.cshtml`, §9's `Dishes/Details.cshtml`) is a change hot reload cannot apply, so watch stops and asks **`Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`** — **in terminal 1, while you are typing in terminal 2.** Miss it and the page 500s with *"The view 'Create' was not found"*, naming the exact path the file is sitting at. Answer **`a`** at the first prompt and it never asks again all night
- [ ] **Park three browser tabs**: `/Trucks`, `/Trucks/Details/1`, and **week 9's lab README** on github.com — it goes on screen for every lab block tonight
- [ ] **mssql extension** signed in, saved server connection tested, panel closed. It has **one** appearance tonight — §3, reading the fourteen rows the migration inserted
- [ ] **Say the no-typing line out loud in the first minute.** Tonight is watched, not typed along with: *"Nothing I type tonight is yours to type. Curbside is my app, and the Registry is yours. Your keyboard time is the lab blocks. There are eight of them tonight, one after each part of my demo."*
- [ ] Teaching profile on, notifications off, editor font sized for the back of the room and for a small laptop screen

> [!NOTE]
> **🖥️ On screen, at curtain**
>
> - **VS Code** — left half, `instructor/week-09/Curbside` open, two integrated terminals: terminal 1 running `dotnet watch`, terminal 2 idle at the project root
> - **Browser** — right half, three tabs: `/Trucks` (seven cards, slogans showing), `/Trucks/Details/1`, and the week 9 lab README

## 1 · Where we left off *(slide 2)*

### The payoff, retold

- [ ] **Before any slide:** the `/Trucks` tab on screen — seven cards, slogans showing
- [ ] *"You have Create, Read, Update and Delete on trucks. Each truck is one row in one table, and no row refers to any other row."*
- [ ] *"Tonight I add a second table to my app. Each row in it belongs to one truck. After each step I take, you take the same step on your Registry."*

### The three words *(slide 2)*

- [ ] 🎞️ **GO TO SLIDE 2** — *What a relationship is* · *"Three words, and you will use all three tonight. The truck is the principal. It can exist without a special. The special is the dependent. It cannot exist without a truck. The foreign key is the one column that ties them together. It is on the dependent, never on the principal."*
- [ ] 🎯 Still on slide 2 — the part the table cannot say: *"Principal and dependent are not about importance. They are about which one can exist alone. A truck with no specials is still a truck. A special with no truck is a row nobody can explain."*
- [ ] 💡 Still on slide 2, the two lines at the bottom: *"One truck has many specials. A special belongs to one truck. After your first lab block, I write that sentence as three properties."*

## Lab A · Setup and task 1 — 8 minutes

- [ ] Put the **lab README** on screen — the tab you parked in §0 — scrolled to **Setup**
- [ ] *"Tonight the lab comes in eight short blocks. After each part of my demo, you do the same thing to your Registry. Each block ends at a note that says In class, stop here."*
- [ ] *"The first block is setup and task 1. Task 1 sets your connection string, drops the lab database, rebuilds it, and starts your app. Use the same database name as last week."*
- [ ] ⚠️ **The drop is not optional, and say why:** *"You drop the lab database because the starter ships my migration files, and your database remembers yours. They cannot be mixed. If you skip the drop, the update fails with 'there is already an object named Cryptids'."*
- [ ] ⚠️ **Then fence it:** *"Only drop a database you can rebuild from scratch. The lab database is one of those. Never drop your own project's database. It has records that nothing can give back."*
- [ ] *"The checks never touch SQL Server. Six out of six does not prove your connection string works. Your browser proves that."* Then the target: *"Tonight's in-class target is checks 1 to 5."*
- [ ] 👀 **Watch for:** `There is already an object named 'Cryptids'` — they skipped the drop. `Could not find a MSBuild project file` — terminal 1 or 2 never ran `cd Cryptids.Web`. And `Login failed`, or a long wait that ends in a network error, on `database update` — the username or password, or the server name
- [ ] **Stop:** the note after **Task 1 in full**. Where they should be: `dotnet test` prints **`Passed: 1`**, the app is running in terminal 1, and `/Cryptids` shows six creatures

## 2 · The second table

### Three properties, two classes

- [ ] In the editor — no slide for this part. *"I start with the dependent. A special belongs to one truck, so the Special class is where the foreign key goes."*
- [ ] Create `Models/Special.cs` — **type this one**, it is the shape of the night:
  ```csharp
  using System.ComponentModel.DataAnnotations;
  using Microsoft.EntityFrameworkCore;

  namespace Curbside.Models;

  public class Special
  {
      public int Id { get; set; }

      [Required(ErrorMessage = "What's on offer?")]
      [StringLength(60, MinimumLength = 2)]
      public string Name { get; set; } = "";

      [Precision(5, 2)]
      [Range(1, 30, ErrorMessage = "Specials run from ${1} to ${2}.")]
      public decimal Price { get; set; }

      [Display(Name = "Served on")]
      [Required(ErrorMessage = "Which day?")]
      [StringLength(10)]
      public string ServedOn { get; set; } = "";

      [Display(Name = "Truck")]
      public int TruckId { get; set; }

      public Truck? Truck { get; set; }
  }
  ```
- [ ] 💡 One sentence on `decimal`, not a detour: *"money is decimal, not double. `Precision(5, 2)` says how wide the column is — five digits in total, two of them to the right of the decimal point — and without it EF decides for you"*
- [ ] Open `Models/Truck.cs` and add the other end, at the bottom of the class:
  ```csharp
  public ICollection<Special> Specials { get; set; } = new List<Special>();
  ```
- [ ] 🎯 Point at the initializer, because it is the difference between a bug and a blank page later: *"it starts as an empty list, not null. A truck with no specials should read as zero specials, not as a crash"*
- [ ] **Now ask, with `Truck.cs` still on screen** — the answer is the bottom row of slide 2: *"I have now typed three properties across two classes. TruckId and Truck are on Special. Specials is on Truck. Only one of the three is a column in SQL Server. Which one?"* Take answers
- [ ] *"TruckId. To the database, the whole relationship is that one integer. Truck and Specials are navigation properties. C# uses them to get from one object to the other, and neither one is in the table."*
- [ ] Open `Data/CurbsideContext.cs` and add the set, under `Trucks`:
  ```csharp
  public DbSet<Special> Specials => Set<Special>();
  ```
- [ ] Paste the seed inside `OnModelCreating`, after the `Truck` block. Fourteen specials across the seven trucks:
  ```csharp
  modelBuilder.Entity<Special>().HasData(
      new Special { Id = 1, TruckId = 1, Name = "Kimchi Fries", Price = 9.50m, ServedOn = "Friday" },
      new Special { Id = 2, TruckId = 1, Name = "Bulgogi Bowl", Price = 12.00m, ServedOn = "Saturday" },
      new Special { Id = 3, TruckId = 2, Name = "Cheese Curds", Price = 7.00m, ServedOn = "Friday" },
      new Special { Id = 4, TruckId = 2, Name = "Loaded Fries", Price = 8.50m, ServedOn = "Saturday" },
      new Special { Id = 5, TruckId = 2, Name = "Slider Trio", Price = 9.00m, ServedOn = "Sunday" },
      new Special { Id = 6, TruckId = 3, Name = "Birria Tacos", Price = 11.00m, ServedOn = "Tuesday" },
      new Special { Id = 7, TruckId = 3, Name = "Street Corn", Price = 5.00m, ServedOn = "Tuesday" },
      new Special { Id = 8, TruckId = 4, Name = "Gyro Plate", Price = 13.00m, ServedOn = "Thursday" },
      new Special { Id = 9, TruckId = 5, Name = "Pierogi Plate", Price = 10.00m, ServedOn = "Sunday" },
      new Special { Id = 10, TruckId = 5, Name = "Cheese Curds", Price = 7.50m, ServedOn = "Friday" },
      new Special { Id = 11, TruckId = 5, Name = "Loaded Fries", Price = 8.25m, ServedOn = "Thursday" },
      new Special { Id = 12, TruckId = 6, Name = "Banh Mi", Price = 9.00m, ServedOn = "Wednesday" },
      new Special { Id = 13, TruckId = 7, Name = "Slider Trio", Price = 10.50m, ServedOn = "Saturday" },
      new Special { Id = 14, TruckId = 7, Name = "Cheese Curds", Price = 6.50m, ServedOn = "Friday" }
  );
  ```
- [ ] 💡 Do **not** draw attention to the repeated dish names yet — three trucks sell Cheese Curds and that is §9's reveal. If someone spots it early, say *"hold that thought, you have just found the last thing we do tonight"*

## Lab B · Task 2 — 10 minutes

- [ ] Lab README on screen, scrolled to **Task 2 in full**
- [ ] *"Task 2 is what I just did, with one difference. I added a class. You add a class, and you also take a property out. Your Cryptid class has an int called Sightings. The Hodag says 47 reports because somebody typed 47. You delete that int, and Sightings becomes the collection."*
- [ ] *"Deleting the int breaks the seed, and the compiler shows you those six errors. Four other places do not error at all. The README lists all five places. Work from that list, not from the error pane."*
- [ ] ⚠️ *"Your homework adds a table and removes nothing. Taking a column out is the Registry's own change. Do not go looking for something to delete in your own app."*
- [ ] *"When you finish, every card says 0 reports. That is correct."*
- [ ] 👀 **Watch for:** a card that prints a type name starting `System.Collections.Generic.List` where the count should be — they fixed the seed and skipped the card, item 5. Six `CS0029` errors in `CryptidContext.cs` — that is the seed, item 1, and it is expected until they fix it. `NullReferenceException` on `Sightings.Count` — the collection has no `= new List<Sighting>();`. And anyone running `dotnet ef` already — not yet; that is task 3
- [ ] **Stop:** the note after **Task 2 in full**. Where they should be: **`Passed: 2`**, and all six cards on `/Cryptids` say *0 reports*

## 3 · The migration *(slide 3)*

### Cascade is chosen for you *(slide 3)*

- [ ] Terminal 2. **Nothing to guess here — say what you are going looking for, then go get it:** *"three migrations exist already. This one is going to contain something none of the others do. Let's find out what it is"*
  ```bash
  dotnet ef migrations add AddSpecials
  ```
- [ ] Open the generated file and read the four operations off the screen in order: **`CreateTable`**, a **`ForeignKey`** constraint inside it, **`InsertData`** with the fourteen rows, and **`CreateIndex`** on `TruckId`
- [ ] 🎯 Stop on the index, because nobody asks for it: *"EF indexed the foreign key without being asked. Every page from here on filters specials by truck, and that index is why it stays fast"*
- [ ] Now the line that earns its own slide — read it aloud off the migration — **HIGHLIGHT THE LINE** *(line 34, last line of the `table.ForeignKey` block)*:
  ```csharp
  onDelete: ReferentialAction.Cascade
  ```
- [ ] 🎞️ **GO TO SLIDE 3** — *Cascade is chosen for you* · deliver the inference chain, slowly, because this is the beat: *"I never typed the word cascade. I typed `int TruckId` with no question mark. That says a special must have a truck. So what happens to a special when its truck is deleted? The column will not take a null, so the special cannot stay without a truck. It is deleted too."*
- [ ] 🔗 Still on slide 3 — collect last week's reading question by name: *"the reading asked you what happens to a review when its trail is deleted. That is the answer, and the framework decided it on your behalf from a missing question mark"*
- [ ] Swipe back to the editor. Apply it in terminal 2:
  ```bash
  dotnet ef database update
  ```
- [ ] **mssql panel** — run this and let the fourteen rows sit on screen for a second:
  ```sql
  SELECT * FROM Specials;
  ```
- [ ] Say what is now true: *"Fourteen rows, and each one has a TruckId. The database has the specials. No page shows them yet."*
- [ ] ⚠️ **Restart the app now — `Ctrl+C` in terminal 1, then `dotnet watch` again.** EF Core builds its model once, at startup, and the running app started before `Special` existed. Every save since printed `Hot reload succeeded`, and that does not rebuild the model. Skip this and §4's first reload is a 500 page instead of *Nothing listed*, and the `Include` that should fix it fails with *"The expression 't.Specials' is invalid inside an 'Include' operation"*
- [ ] Say why while it comes back up: *"I am restarting my app. EF Core works out what my tables look like once, when the app starts. I added a class and a table after it started, so I start it again. You do the same thing in your task 3."*

## Lab C · Task 3 — 6 minutes

- [ ] Lab README on screen, scrolled to **Task 3 in full**
- [ ] *"Task 3 is the seed and the migration. Paste the seed and generate the migration. Read the migration before you apply it. Find the DropColumn and the CreateTable. They have the same name."*
- [ ] *"Then find onDelete Cascade, inside CreateTable. You did not type that either."*
- [ ] ⚠️ *"After database update, restart your app in terminal 1. It is the same restart I just did, for the same reason."*
- [ ] *"Your pages will still say 0 reports when you finish. That is expected."*
- [ ] 👀 **Watch for:** `Build failed` on `migrations add` — the seed still sets `Sightings = 47` somewhere; that is task 2's item 1. Every page that lists a creature failing after `database update`, with an error naming `Sightings` — they skipped the restart. And anyone worried that the cards still say *0 reports* — that is where task 3 ends
- [ ] **Stop:** the note after **Task 3 in full**. Where they should be: **`Passed: 3`**, the app restarted, and the pages still saying *0 reports*

## ☕ Break

## 4 · Failure #1 — the empty list *(slide 4)*

### Empty is not missing *(slide 4)*

- [ ] Open `Views/Trucks/Details.cshtml`. Paste this in, just under the *Back to all trucks* link:
  ```cshtml
  <h2 class="h5 mt-4">On the menu</h2>

  @if (Model.Specials.Count > 0)
  {
      <ul class="list-group mb-4">
          @foreach (var special in Model.Specials)
          {
              <li class="list-group-item d-flex justify-content-between">
                  <span>@special.Name <span class="text-muted">· @special.ServedOn</span></span>
                  <span>$@special.Price</span>
              </li>
          }
      </ul>
  }
  else
  {
      <p class="text-muted">Nothing listed.</p>
  }
  ```
- [ ] **No prediction here — this failure is what teaches the rule, so nobody can reason it out yet.** Say what to look at: *"In the mssql panel, we saw that Roll Models has two specials: Kimchi Fries and a Bulgogi Bowl. I am going to reload the Roll Models page. Look under the heading On the menu."*
- [ ] **Reload `/Trucks/Details/1`.** 🎯 **`Nothing listed.`** Let it sit there. Say nothing for a beat
- [ ] Then walk the evidence out loud, in this order — the point is that every instrument says fine: *"The page loaded with a 200. There is no error on it. The terminal has no exception in it. And the database has the rows. We read them in the mssql panel, after the migration ran."*
- [ ] **Ask a question the terminal can answer:** *"Read the SELECT statements this page just ran, in the terminal. Which tables do they name?"* Take the answer: `Trucks`, and nothing else
- [ ] 🎞️ **GO TO SLIDE 4** — *Empty is not missing* · *"That is the rule at the top of this slide. A navigation property is empty until a query asks for it. EF Core fetched a truck, because a truck is what I asked for. It does not fetch related rows unless I ask for them."*
- [ ] Still on slide 4, the last line — the sentence that makes it dangerous: *"An empty list looks exactly like a truck that has no specials. Nothing on the page or in the terminal tells you which one you have."*
- [ ] Still on slide 4, the code in the middle: *"That is the fix. One line, Include, between Trucks and FirstOrDefault."*
- [ ] Swipe back to the editor. Fix `Details` in `TrucksController`:
  ```csharp
  var truck = _context.Trucks
      .Include(t => t.Specials)
      .FirstOrDefault(t => t.Id == id);
  ```
- [ ] **Reload.** Two specials, with prices. 🎯 *"Same page, same database, same fourteen rows. I added one line."* Then point at the terminal: the page's first `SELECT` now has a `LEFT JOIN` to `Specials` in it

## Lab D · Task 4, part 1 — 5 minutes

- [ ] Lab README on screen, scrolled to **Task 4 in full**
- [ ] *"Do what I just did, in the same order. Paste the accounts list into your Details view first. Reload The Hodag's page and read what it says. Then add Include to your Details action and reload again."*
- [ ] *"Stop when The Hodag's page shows three accounts. Check 4 stays red at this stop. Read its message. It tells you what the next part of my demo is about."*
- [ ] 👀 **Watch for:** a 500 on The Hodag's page naming `Sightings`, or *invalid inside an 'Include' operation* — the app was never restarted after task 3's `database update`. *Nothing on file* that survives the `Include` — the `Include` went on a different action; they want `Details`. And anyone who has already put `Include` on `Index` — fine, they are ahead and at `Passed: 4`
- [ ] **Stop:** the first note in **Task 4 in full**, above **Task 4, part 2**. Where they should be: **`Passed: 3`** — check 4 is red, and its message says `Include` is per-query. The Hodag's page shows three accounts; its card on `/Cryptids` still says *0 reports*

## 5 · The hidden cost — how many SELECTs *(slide 5)*

### Predict the count

- [ ] Set the task up in the browser first, so the goal is concrete: go to `/Trucks` and say *"seven cards. I want each one to say how many specials that truck has"*
- [ ] Edit `Index` in `TrucksController` — **type this one**, because the shape is the point:
  ```csharp
  public IActionResult Index()
  {
      var trucks = _context.Trucks.ToList();

      var counts = new Dictionary<int, int>();
      foreach (var truck in trucks)
      {
          counts[truck.Id] = _context.Specials.Count(s => s.TruckId == truck.Id);
      }
      ViewData["Counts"] = counts;

      return View(trucks);
  }
  ```
- [ ] The count belongs **inside the card**, so it goes in the partial, not in `Index.cshtml`. Open `Views/Shared/_TruckCard.cshtml` and **replace the whole `card-footer` block** — the footer gains `d-flex justify-content-between`, which is what puts the count on the right of the Details link:
  ```cshtml
  <div class="card-footer d-flex justify-content-between">
      <a href="/Trucks/Details/@Model.Id">Details</a>
      @if (ViewData["Counts"] is Dictionary<int, int> counts)
      {
          <span class="text-muted small">@counts[Model.Id] on the menu</span>
      }
  </div>
  ```
- [ ] 🚨 **The `@if` is not decoration — leave it off and two other pages return 500.** This same card is drawn by `Details` (the *Also in* block) and by `Delete`, and neither of those actions puts `Counts` in `ViewData`. Without the guard the cast hands back `null`, the indexer runs on it, and you get `NullReferenceException` in `_TruckCard.cshtml` — on two pages you never edited
- [ ] 🎯 Say it out loud, because it is the strongest case you will make all night for §6: *"A partial gets the same ViewData as the page that draws it. Three pages draw this card. Only Index puts the counts in ViewData. On the other two pages the counts are not there, so this view has to check before it reads them. ViewData stores everything as object, and this check is what that costs."*
- [ ] **Scroll the editor back to the `Index` action, so the loop is on screen — no slide for this — and ask for a show of hands:** *"Read the loop in Index. There are seven trucks, and I am about to load this page once. How many SELECT statements will the terminal print? Hands up for one. For seven. For eight."*
- [ ] **Reload `/Trucks` and scroll the terminal.** 🎯 **Eight.** *"Eight. One SELECT for the list of trucks, and then one more for each truck."*
- [ ] 💡 Make the stakes real without a number you cannot support: *"Seven trucks cost eight queries. Every truck I add costs one more."*

### One JOIN *(slide 5)*

- [ ] Replace the whole `Index` action with the one line:
  ```csharp
  public IActionResult Index()
  {
      return View(_context.Trucks
          .Include(t => t.Specials)
          .ToList());
  }
  ```
- [ ] And back in `_TruckCard.cshtml`, the whole `card-footer` becomes what a reader would hope for — the cast, the bag, the `!` and the guard all leave together:
  ```cshtml
  <div class="card-footer d-flex justify-content-between">
      <a href="/Trucks/Details/@Model.Id">Details</a>
      <span class="text-muted small">@Model.Specials.Count on the menu</span>
  </div>
  ```
- [ ] 💡 No guard needed now, and say why — it is the initializer beat from §2 paying off: *"Specials starts as an empty list, never null. So this line is safe on every page that draws the card. The two pages that have not asked for specials yet will say zero."*
- [ ] **Reload and read the terminal.** 🎯 **One statement**, and it is a `LEFT JOIN`
- [ ] 🎞️ **GO TO SLIDE 5** — *One JOIN* · *"The top row is what I wrote first: one query for the trucks, and one more for each truck. That was eight. The bottom row is Include: one query, with seven trucks and all fourteen specials in it. I did not write that join. I wrote Include, and EF wrote the join."*
- [ ] ⚠️ Still on slide 5, the three lines at the bottom — this is the actual exam question: *"Include is per query. I put Include on the Details action, and it did nothing for this page. It is not a setting on the model, and it is not remembered for the next query."*

## Lab E · Task 4, part 2 — 4 minutes

- [ ] Lab README on screen, scrolled to **Task 4, part 2 — the cards**
- [ ] *"Your cards already count rows. You wrote that line in task 2. They say 0 because your Index action has not asked for the sightings. Add the same Include to Index. Try it before you open the answer."*
- [ ] *"Read terminal 1 before and after. It is one SELECT both times. After the change, it has a LEFT JOIN in it."*
- [ ] *"You do not write the loop I wrote first. I wrote it to show you what it costs."*
- [ ] 👀 **Watch for:** cards still at *0 reports* — the `Include` went back on `Details` instead of `Index`. Check 4 still red — have them read the message; it names the page and the number it is looking for
- [ ] **Stop:** the note at the end of **Task 4, part 2**. Where they should be: **`Passed: 4`**, and The Hodag's card says *3 reports*

## 6 · The ViewModel *(slide 6)*

### One view, two things *(slide 6)*

- [ ] Open `Views/Trucks/Details.cshtml` and scroll to the *Also in* block. Read the line that is already there, out loud, exactly as written:
  ```cshtml
  var alsoHere = (List<Truck>)ViewData["AlsoHere"]!;
  ```
- [ ] Still in the editor, with that line on screen, say what it costs: *"That line has a cast and an exclamation mark, in a view. ViewData stores everything as object, so the view has to cast it back to a list of trucks. The exclamation mark tells the compiler the value is not null, and nothing checks that."*
- [ ] 🎞️ **GO TO SLIDE 6** — *One view, two things* · the rule, which is the reason the folder is about to exist: *"When a view needs more than one thing, do not pass the second thing through ViewData. Give the view one type that holds both. That type is called a ViewModel."*
- [ ] ⚠️ Still on slide 6, the three bullets — this is where people put entities by mistake: *"A ViewModel is not an entity. It has no table. It is never in the DbContext. It goes in a ViewModels folder, not in Models."*
- [ ] Swipe back to the editor. Create the folder `ViewModels/` and `ViewModels/TruckDetailsViewModel.cs`:
  ```csharp
  using Curbside.Models;

  namespace Curbside.ViewModels;

  public class TruckDetailsViewModel
  {
      public Truck Truck { get; set; } = null!;
      public List<Truck> AlsoHere { get; set; } = new();
  }
  ```
- [ ] ⚠️ **Add the using to `Views/_ViewImports.cshtml` now, as the very next edit** — a namespace that does not exist yet breaks *every* view in the project, not just this one, and the error list will point at files you have not touched:
  ```cshtml
  @using Curbside.ViewModels
  ```
- [ ] **Replace the whole `Details` action** in `TrucksController` — this is the entire method, and the `ViewData["AlsoHere"]` line goes with it:
  ```csharp
  public IActionResult Details(int id)
  {
      var truck = _context.Trucks
          .Include(t => t.Specials)
          .FirstOrDefault(t => t.Id == id);

      if (truck == null)
      {
          return NotFound();
      }

      var viewModel = new TruckDetailsViewModel
      {
          Truck = truck,
          AlsoHere = _context.Trucks
              .Include(t => t.Specials)
              .Where(t => t.City == truck.City && t.Id != truck.Id)
              .ToList()
      };

      return View(viewModel);
  }
  ```
- [ ] 🎯 Name the three edits that just happened, because pasting a whole method hides them: *"the ViewData line is gone, the two things are now properties on one object, and the last line passes the view model to the view instead of the truck"*
- [ ] Change the view's first line to `@model TruckDetailsViewModel`, then let the compiler drive the easy half — every `Model.X` becomes `Model.Truck.X`, including `Also in @Model.Truck.City`
- [ ] 🚨 **The compiler will NOT drive the other half, and that is the beat.** Delete the `var alsoHere = ...` line, then repoint its **two** uses — they are not next to each other. First the `@if` that opens the *Also in* block:
  ```cshtml
  @if (Model.AlsoHere.Count > 0)
  ```
- [ ] Then the `@foreach` nested a few lines inside it:
  ```cshtml
  @foreach (var other in Model.AlsoHere)
  ```
- [ ] ⚠️ Miss either one and the page throws `NullReferenceException` on `alsoHere.Count`. **Nothing warns you**: `ViewData["AlsoHere"]` is typed `object`, so the cast compiles, and the `!` you are deleting was silencing the only complaint you would have had. The controller stopped filling the bag and the view had no way to find out
- [ ] 🎯 Say it, because it is the closing argument for the whole section: *"ViewData let that mistake compile. I would have found it only when someone loaded the page. With a ViewModel, a property that is missing does not compile."*
- [ ] **Reload `/Trucks/Details/1`.** 🎯 *"Same page. The cast is gone, the exclamation mark is gone, and the view now says what it wants in its first line"*
- [ ] 💡 **Not a beat — just so it does not surprise you.** The *Also in* card now carries a count it did not have in §4, because §5 put one on every card. It reads **1 on the menu** and that is correct: this action's `AlsoHere` query asks for specials too. The room last saw this page before §5, so there is no before-and-after here to point at — **don't try to make one**
- [ ] **No lab block follows this part — say so:** *"There is no lab block for this part. You make a ViewModel in your next block, for the report form."*

## ☕ Break

## 7 · The report form *(slide 7)*

### The dropdown

- [ ] In the editor — no slide for this part. Say where it is going: *"A new special has to say which truck it belongs to. On a form, that is a dropdown of trucks. The controller builds the list, and the view draws it."*
- [ ] Create `ViewModels/SpecialFormViewModel.cs` — **type the two `SelectList` lines**, they come back in a minute:
  ```csharp
  using Microsoft.AspNetCore.Mvc.Rendering;
  using Curbside.Models;

  namespace Curbside.ViewModels;

  public class SpecialFormViewModel
  {
      public Special Special { get; set; } = new();
      public SelectList Trucks { get; set; } = null!;
  }
  ```
- [ ] Create `Controllers/SpecialsController.cs`:
  ```csharp
  using Microsoft.AspNetCore.Mvc;
  using Microsoft.AspNetCore.Mvc.Rendering;
  using Curbside.Data;
  using Curbside.Models;
  using Curbside.ViewModels;

  namespace Curbside.Controllers;

  public class SpecialsController : Controller
  {
      private readonly CurbsideContext _context;

      public SpecialsController(CurbsideContext context)
      {
          _context = context;
      }

      public IActionResult Create(int? truckId)
      {
          var form = new SpecialFormViewModel
          {
              Special = new Special { TruckId = truckId ?? 0 },
              Trucks = TruckChoices(truckId)
          };

          return View(form);
      }

      [HttpPost]
      [ValidateAntiForgeryToken]
      public async Task<IActionResult> Create(SpecialFormViewModel form)
      {
          if (!ModelState.IsValid)
          {
              form.Trucks = TruckChoices(form.Special.TruckId);
              return View(form);
          }

          _context.Specials.Add(form.Special);
          await _context.SaveChangesAsync();

          return RedirectToAction("Details", "Trucks", new { id = form.Special.TruckId });
      }

      private SelectList TruckChoices(int? selected) =>
          new SelectList(_context.Trucks.OrderBy(t => t.Name).ToList(), "Id", "Name", selected);
  }
  ```
- [ ] Create `Views/Specials/Create.cshtml` *(watch terminal 1 for the restart prompt if you have not answered `a` yet)*:
  ```cshtml
  @model SpecialFormViewModel
  @{
      ViewData["Title"] = "Add a special";
  }

  <h1>Add a special 🍟</h1>

  <form asp-action="Create" method="post" class="col-md-6">
      <div asp-validation-summary="ModelOnly" class="text-danger"></div>

      <div class="mb-3">
          <label asp-for="Special.TruckId" class="form-label"></label>
          <select asp-for="Special.TruckId" asp-items="Model.Trucks" class="form-select">
              <option value="">— pick a truck —</option>
          </select>
      </div>

      <div class="mb-3">
          <label asp-for="Special.Name" class="form-label"></label>
          <input asp-for="Special.Name" class="form-control" />
          <span asp-validation-for="Special.Name" class="text-danger"></span>
      </div>

      <div class="mb-3">
          <label asp-for="Special.Price" class="form-label"></label>
          <input asp-for="Special.Price" class="form-control" />
          <span asp-validation-for="Special.Price" class="text-danger"></span>
      </div>

      <div class="mb-3">
          <label asp-for="Special.ServedOn" class="form-label"></label>
          <input asp-for="Special.ServedOn" class="form-control" placeholder="Friday" />
          <span asp-validation-for="Special.ServedOn" class="text-danger"></span>
      </div>

      <button type="submit" class="btn btn-primary">Add it</button>
  </form>

  @section Scripts {
      <partial name="_ValidationScriptsPartial" />
  }
  ```
- [ ] Add the way in, at the bottom of `Views/Trucks/Details.cshtml`:
  ```cshtml
  <p><a asp-controller="Specials" asp-action="Create" asp-route-truckId="@Model.Truck.Id" class="btn btn-primary">＋ Add a special</a></p>
  ```
- [ ] **Load `/Trucks/Details/1` and click the button.** The form comes up with **Roll Models already selected** — say why, because it is the query string doing it: *"the link passed `truckId=1`, the controller passed it to the SelectList as the selected value, and the dropdown came up on the right truck"*
- [ ] 🎯 **Right-click the dropdown → Inspect.** In the Elements panel, expand the `<select>` — its `name` is `Special.TruckId` — and point at the `<option>` lines under it: the placeholder, then seven trucks in name order. Find Roll Models, the one marked `selected`:
  ```html
  <option selected="selected" value="1">Roll Models</option>
  ```
- [ ] *"Look at one option. The words are the truck's name. The value is the truck's Id. When I submit this form, the browser sends the value, not the words. That value is the foreign key. It goes into Special.TruckId."* Then close DevTools

### The list is not an answer *(slide 7)*

- [ ] Fill the form in completely and correctly — **Roll Models**, `Tteokbokki`, `8.50`, `Monday` — and narrate that it is correct as you type, so the failure lands: *"a real truck, a real dish, a price inside the range, a day"*
- [ ] **Submit.** 🎯 The form comes back. Nothing saved
- [ ] Read the screen honestly, because there is nothing on it: *"and there is no message. Not one red word. The validation summary is set to `ModelOnly` and whatever went wrong is not a model-level error"*
- [ ] Change one word in the view, and say why this is the first move rather than a guess:
  ```cshtml
  <div asp-validation-summary="All" class="text-danger"></div>
  ```
- [ ] 💡 *"That is week 6's troubleshooting advice and it is still the fastest thing you own: when a form silently refuses, ask it to show you everything it knows"*
- [ ] **Submit again.** 🎯 **"The Trucks field is required."**
- [ ] Let the room sit with the contradiction before you explain it: *"the Trucks field. There is a truck in that dropdown. It says Roll Models"*
- [ ] 🎞️ **GO TO SLIDE 7** — *The list is not an answer* · the explanation the error message does not give: *"Trucks is not the dropdown. Trucks is the list of choices, and it is a non-nullable property. Week 6: a non-nullable property is a required field. The browser posted the truck I picked. It never posts the list I picked from. So the binder sees a required field that arrived empty."*
- [ ] Still on slide 7, the line of code at the bottom: *"The fix is one question mark."* Swipe back to the editor. Add one character in `SpecialFormViewModel`:
  ```csharp
  public SelectList? Trucks { get; set; }
  ```
- [ ] ⚠️ **Submit — and if the same error comes back over the file you just fixed, restart before you change anything else.** `Ctrl+C` in terminal 1, then `dotnet watch` again, then submit once more. ASP.NET works out which properties are required **once per model type** and caches it, so hot reload can print **`🔥 Hot reload succeeded.`** and leave this particular fix inert. *(Goes both ways in practice: inert after hot reload on three runs, live with no restart on another. Do not promise the room either outcome — just know the restart is the fix if the error repeats.)*
- [ ] **Submit again.** 🎯 Redirect to Roll Models, and **Tteokbokki is on the menu, third in the list**
- [ ] 💡 **Only if you had to restart** — say why, because otherwise it reads as superstition: *"that was not me being careful. The rule about which fields are required gets worked out once, when the app starts, and a hot reload does not always redo it"*
- [ ] 💡 Close the loop on the fix: *"one question mark. The list is not an answer, so it is allowed to be absent"*
- [ ] 💡 **Now** collect the line nobody asked about. Scroll `SpecialsController` to the one sitting inside `if (!ModelState.IsValid)`:
  ```csharp
  form.Trucks = TruckChoices(form.Special.TruckId);
  ```
- [ ] Walk it in order — the middle step is the one that is easy to miss: *"when this page first loaded, the controller built a list of seven trucks, and the view turned that list into seven options. Then I hit submit. The browser sent back the one option I picked. It does not send the other six, and it does not send the list"*
- [ ] 🎯 Then the step that makes the line necessary: *"so the form object that arrives in this action has no truck list on it at all — that part was never posted. Pass it straight back to the view and the dropdown comes back empty. This line builds the list again before the form is redisplayed, which is why you have been looking at a full dropdown every time it came back"*

## Lab F · Task 5 — 10 minutes

- [ ] Lab README on screen, scrolled to **Task 5 in full**
- [ ] *"Task 5 is the report form. It has three new files: a ViewModel, a controller and a view. It also adds one line to _ViewImports and a link on your Details page."*
- [ ] *"Create the ViewModels folder, the class, and the using line in _ViewImports together. If the using names a namespace that does not exist yet, every view in your project stops compiling."*
- [ ] *"Your ViewModel already has the question mark on SelectList. The README gives you the fix I had to find."*
- [ ] *"Create.cshtml is a new view. The terminal running dotnet watch will ask to restart. Answer a."*
- [ ] 👀 **Watch for:** every view failing to compile at once — the `@using` went in before the `ViewModels` folder and class existed. `The view 'Create' was not found` with the file right there — the restart prompt is waiting in terminal 1; **don't let them move the file**. *The Cryptids field is required* with a creature chosen — the `?` is missing, and after adding it the app may need a restart. A dropdown that comes back empty after a refused submit — the list isn't rebuilt inside `if (!ModelState.IsValid)`. **Sweep the room in this block** — it is the biggest one tonight
- [ ] **Stop:** the note after **Task 5 in full**. Where they should be: **`Passed: 5`** — checks 1 to 5, tonight's in-class target

## 8 · Delete takes the children

### Closing a file takes the children

- [ ] In the browser — no slide for this part. Go to `/Trucks/Details/1` and hover **Remove this truck**, but do not click yet
- [ ] **Ask — the answer is on the cascade slide from §3:** *"Roll Models has three specials now. If I delete this truck, what happens to its three rows in the Specials table?"* Take answers
- [ ] Answer it, and tie it back to a decision they watched get made: *"They are deleted too. They are not left behind, and the delete is not blocked. The migration says onDelete Cascade, and it says that because I typed int TruckId with no question mark in the Special class."*
- [ ] Then the design point, which is the reason this beat exists at all: *"So a page that asks 'are you sure' is leaving something out if it only shows the truck. It has to say what else will be deleted."*
- [ ] **Write the warning first.** In `Views/Trucks/Delete.cshtml` — **between the `</div>` that closes the card and the `<form>` below it**:
  ```cshtml
  @if (Model.Specials.Count > 0)
  {
      <div class="alert alert-warning">
          This truck has <strong>@Model.Specials.Count</strong> special@(Model.Specials.Count == 1 ? "" : "s") on file.
          Removing the truck removes @(Model.Specials.Count == 1 ? "it" : "them") too — the foreign key was
          created with <code>onDelete: Cascade</code>, and nothing is going to ask you twice.
      </div>
  }
  ```
- [ ] **Click Remove this truck — `/Trucks/Delete/1`.** There is no warning, and the card on the page says **0 on the menu**. **Ask:** *"There is no warning, and the card on this page says 0 on the menu. Roll Models has three specials. You have seen this twice tonight. What is missing?"* Take the answer: an `Include`
- [ ] Load the specials in the Delete GET in `TrucksController` — replace the line that looks the truck up:
  ```csharp
  var truck = await _context.Trucks
      .Include(t => t.Specials)
      .FirstOrDefaultAsync(t => t.Id == id);
  ```
- [ ] **Reload `/Trucks/Delete/1`.** 🎯 **Three specials on file**, and the card says **3 on the menu**. Then click **Keep it** — say out loud that you are not deleting it, because the room will assume you did
- [ ] 💡 One rider on the `Include`, because it is the same lesson yet again: *"That page needed its own Include. Details has one. Index has one. The Also in list has one. Delete showed zero until I added a fourth."*

## Lab G · Task 6 — 4 minutes

- [ ] Lab README on screen, scrolled to **Task 6 in full**
- [ ] *"The same two steps, in the same order. Paste the warning into your Delete view, and open The Hodag's Close the file page. There is no warning yet. Then add the Include yourself. It is the third one you have written tonight."*
- [ ] *"When the warning shows, click Keep it. Do not close The Hodag's file."*
- [ ] 👀 **Watch for:** the warning never appearing — the `Include` went on `DeleteConfirmed`, the POST, instead of the GET that takes `int? id`. And ⚠️ **check 6 green with no warning on the page** — the card on that page prints the count too, and the check is satisfied by it; the `Include` alone turns it green. Look at their Close-the-file page, not only at their count
- [ ] **Stop:** the note after **Task 6 in full**. Where they should be: **`Passed: 6`**, and The Hodag's Close-the-file page shows the warning

## 9 · One more foreign key *(slide 8)*

### The join was already there *(slide 8)*

- [ ] Back to the seed in `Data/CurbsideContext.cs`. Scroll so several rows are visible and **ask the room to find the problem**: *"read the dish names. What is wrong with this table?"*
- [ ] Take the answer and sharpen it — the repeated name is the symptom, and the point is what the database does **not** know: *"three trucks sell Cheese Curds, and each one has that name typed into its own row. As far as SQL Server is concerned those are three unrelated rows that happen to contain the same letters. Nothing in this table says they are the same dish"*
- [ ] 🎯 Then make the cost concrete, because that is what earns the next twenty minutes: *"so suppose I want a page that lists every truck selling cheese curds. The best I can do is compare the text and hope all three were typed identically — one stray capital or one missing s, and that truck is missing from the page. Nothing errors. The list is just wrong"*
- [ ] 🎞️ **GO TO SLIDE 8** — *One more foreign key* · say what the fix is before you type it: *"Here is the fix. I move the dish name into its own table. Look at Special, in the middle of the diagram. It now has two foreign keys: one to a truck and one to a dish. It is the link between them, and it carries the price and the day."*
- [ ] ⚠️ Still on slide 8, the lines under the diagram — the definition, which is the syllabus line landing: *"That is a many-to-many. Many trucks, many dishes. The join has to be a class of its own because it carries something. The price is not a fact about the truck or about the dish. It is a fact about the two together."*
- [ ] Swipe back to the editor. Create `Models/Dish.cs`:
  ```csharp
  using System.ComponentModel.DataAnnotations;

  namespace Curbside.Models;

  public class Dish
  {
      public int Id { get; set; }

      [Required(ErrorMessage = "A dish needs a name.")]
      [StringLength(60, MinimumLength = 2)]
      public string Name { get; set; } = "";

      public ICollection<Special> Specials { get; set; } = new List<Special>();
  }
  ```
- [ ] In `Models/Special.cs`, **delete** the `Name` property and its two attributes, and add the second key:
  ```csharp
  [Display(Name = "Dish")]
  public int DishId { get; set; }

  public Dish? Dish { get; set; }
  ```
- [ ] Add the set and the dish seed to the context, and repoint all fourteen specials at dish ids — **paste, do not type**:
  ```csharp
  public DbSet<Dish> Dishes => Set<Dish>();
  ```
  Then, in `OnModelCreating`, replace the whole `Special` seed block and add the dishes above it:
  ```csharp
  modelBuilder.Entity<Dish>().HasData(
      new Dish { Id = 1, Name = "Kimchi Fries" },
      new Dish { Id = 2, Name = "Bulgogi Bowl" },
      new Dish { Id = 3, Name = "Cheese Curds" },
      new Dish { Id = 4, Name = "Loaded Fries" },
      new Dish { Id = 5, Name = "Birria Tacos" },
      new Dish { Id = 6, Name = "Street Corn" },
      new Dish { Id = 7, Name = "Gyro Plate" },
      new Dish { Id = 8, Name = "Pierogi Plate" },
      new Dish { Id = 9, Name = "Banh Mi" },
      new Dish { Id = 10, Name = "Slider Trio" }
  );

  modelBuilder.Entity<Special>().HasData(
      new Special { Id = 1, TruckId = 1, DishId = 1, Price = 9.50m, ServedOn = "Friday" },
      new Special { Id = 2, TruckId = 1, DishId = 2, Price = 12.00m, ServedOn = "Saturday" },
      new Special { Id = 3, TruckId = 2, DishId = 3, Price = 7.00m, ServedOn = "Friday" },
      new Special { Id = 4, TruckId = 2, DishId = 4, Price = 8.50m, ServedOn = "Saturday" },
      new Special { Id = 5, TruckId = 2, DishId = 10, Price = 9.00m, ServedOn = "Sunday" },
      new Special { Id = 6, TruckId = 3, DishId = 5, Price = 11.00m, ServedOn = "Tuesday" },
      new Special { Id = 7, TruckId = 3, DishId = 6, Price = 5.00m, ServedOn = "Tuesday" },
      new Special { Id = 8, TruckId = 4, DishId = 7, Price = 13.00m, ServedOn = "Thursday" },
      new Special { Id = 9, TruckId = 5, DishId = 8, Price = 10.00m, ServedOn = "Sunday" },
      new Special { Id = 10, TruckId = 5, DishId = 3, Price = 7.50m, ServedOn = "Friday" },
      new Special { Id = 11, TruckId = 5, DishId = 4, Price = 8.25m, ServedOn = "Thursday" },
      new Special { Id = 12, TruckId = 6, DishId = 9, Price = 9.00m, ServedOn = "Wednesday" },
      new Special { Id = 13, TruckId = 7, DishId = 10, Price = 10.50m, ServedOn = "Saturday" },
      new Special { Id = 14, TruckId = 7, DishId = 3, Price = 6.50m, ServedOn = "Friday" }
  );
  ```
- [ ] 🚨 **The build is broken right now, and that is the next thing to fix.** `Special.Name` is gone and two files still ask for it, so nothing compiles — **including `dotnet ef`, which builds the project before it can look at your model.** No migration is possible until these are done. First, `Views/Trucks/Details.cshtml`, where the menu row becomes a link:
  ```cshtml
  <a asp-controller="Dishes" asp-action="Details" asp-route-id="@special.DishId">@special.Dish!.Name</a>
  ```
- [ ] And `Details` in `TrucksController` needs one more hop — **this is the new word tonight**:
  ```csharp
  var truck = _context.Trucks
      .Include(t => t.Specials)
          .ThenInclude(s => s.Dish)
      .FirstOrDefault(t => t.Id == id);
  ```
- [ ] 🎯 Name it plainly: *"`Include` gets you to the specials. `ThenInclude` keeps going, one step further, to the dish each special names"*
- [ ] Second, **the form has a `Name` box that no longer has anything to bind to.** It becomes a second dropdown. `ViewModels/SpecialFormViewModel.cs` gains a list:
  ```csharp
  public SelectList? Dishes { get; set; }
  ```
- [ ] `SpecialsController` builds it, exactly like the trucks one — a second helper, and a line in each of the two places `Trucks` is already set:
  ```csharp
  private SelectList DishChoices(int? selected) =>
      new SelectList(_context.Dishes.OrderBy(d => d.Name).ToList(), "Id", "Name", selected);
  ```
- [ ] And in `Views/Specials/Create.cshtml`, **replace the whole `Name` block** with the dish picker:
  ```cshtml
  <div class="mb-3">
      <label asp-for="Special.DishId" class="form-label"></label>
      <select asp-for="Special.DishId" asp-items="Model.Dishes" class="form-select">
          <option value="">— pick a dish —</option>
      </select>
      <span asp-validation-for="Special.DishId" class="text-danger"></span>
  </div>
  ```
- [ ] 🎯 Say what just happened to the form, because it is the normalization landing where they can see it: *"a text box became a dropdown. Nobody can invent a fourth spelling of cheese curds any more — they pick one that exists"*
- [ ] **Now it compiles, so EF can run.** Terminal 2 — and **read the warning EF prints, do not scroll past it**:
  ```bash
  dotnet ef migrations add AddDishes
  ```
- [ ] 🎯 Read the warning aloud, then answer it: *"an operation was scaffolded that may result in the loss of data. That is the `DropColumn`, and EF is right to say it — but we mean this one. The dish names are not lost, they moved"*
- [ ] Open the migration and read the operations out loud, in order, because the order is what makes it safe: **`DropColumn`**, **`AddColumn DishId`**, **`CreateTable Dishes`**, **`InsertData`** with the ten dish names, fourteen **`UpdateData`** repointing every special, and only *then* the index and the foreign key
- [ ] 💡 Say why that ordering matters: *"the foreign key constraint goes on last. If it went on first, fourteen rows with a `DishId` of zero would fail it instantly"*
- [ ] 🚨 **Fourteen is not how many specials you have.** In §7 you filed one through the form, and `UpdateData` only repoints the fourteen the seed knows about. That row keeps `DishId` 0, no dish has id 0, and the foreign key on the last line is refused — `The ALTER TABLE statement conflicted with the FOREIGN KEY constraint`. **Add one line to the migration by hand**, just above `CreateIndex`:
  ```csharp
  migrationBuilder.Sql("DELETE FROM Specials WHERE DishId = 0;");
  ```
- [ ] 🎯 Say what that line is doing, because deleting a row the room watched you create needs saying out loud: *"every special we seeded got a dish. The one I added through the form did not — I typed its name as free text, and there is no dish row to point it at. So it goes. That is what it costs to normalize a column after the fact, and it is the argument for doing it before real people have put data in"*
- [ ] 💡 One rider if anyone asks why EF did not write that line: *"it generated this from the model. It has no idea what is sitting in the table"*
  ```bash
  dotnet ef database update
  ```
- [ ] Now the payoff. Create `Controllers/DishesController.cs`:
  ```csharp
  using Microsoft.EntityFrameworkCore;
  using Microsoft.AspNetCore.Mvc;
  using Curbside.Data;

  namespace Curbside.Controllers;

  public class DishesController : Controller
  {
      private readonly CurbsideContext _context;

      public DishesController(CurbsideContext context)
      {
          _context = context;
      }

      public IActionResult Details(int id)
      {
          var dish = _context.Dishes
              .Include(d => d.Specials)
                  .ThenInclude(s => s.Truck)
              .FirstOrDefault(d => d.Id == id);

          if (dish == null)
          {
              return NotFound();
          }

          return View(dish);
      }
  }
  ```
- [ ] And `Views/Dishes/Details.cshtml`:
  ```cshtml
  @model Dish
  @{
      ViewData["Title"] = Model.Name;
  }

  <h1>@Model.Name</h1>

  <h2 class="h5 mt-4">Served by</h2>

  <ul class="list-group mb-4">
      @foreach (var special in Model.Specials)
      {
          <li class="list-group-item d-flex justify-content-between">
              <span>
                  <a asp-controller="Trucks" asp-action="Details" asp-route-id="@special.TruckId">@special.Truck!.Name</a>
                  <span class="text-muted">· @special.ServedOn</span>
              </span>
              <span>$@special.Price</span>
          </li>
      }
  </ul>
  ```
- [ ] **Go to `/Trucks/Details/2`, click Cheese Curds.** 🎯 **Cheese Curd Cartel, Pierogi Party, Sconnie Sliders**
- [ ] Land the reveal, and be precise that nothing was added to make it possible: *"I did not build a new relationship for that page. Those are the same fourteen rows, read from the other end. That is what a many-to-many is — one join table, read in either direction"*

## Lab H · Catch up, or the stretch — 3 minutes

- [ ] Lab README on screen, scrolled to **The tasks**
- [ ] *"This is the last block, and it has no stop. If any of your checks are red, finish those first. If you are at six, the stretch at the bottom of the README is what I just did. Witness becomes its own table, and Sighting becomes the link between a witness and a creature."*
- [ ] *"The stretch has no check and no points. Your homework needs a one-to-many and nothing more."*
- [ ] *"Tonight's in-class target was checks 1 to 5. Anything still red is Part 1 of your homework."*
- [ ] 👀 **Watch for:** anyone still red on check 4 — one `Include` on `Details`, a second one on `Index`. Anyone still red on check 5 — have them read the check's message before they change anything
- [ ] **No stop.** This block takes whatever time is left before the wrap-up. Anyone finished: the stretch, **🚀 Done early?** at the bottom of the README, or help a classmate

## 10 · Wrap-up, after the lab *(slide 9)*

- [ ] 🎞️ **GO TO SLIDE 9** — *Tonight, in one picture* · walk the five rows, one sentence each, and give `Include` the emphasis because it is the row that costs points: *"Include is per query. It is not per model, and it is not per app. Every page that shows related rows asks for them again."*
- [ ] Homework: **a second related table on their own app.** One-to-many is enough — *"Sightings for creatures, reviews for trails, showtimes for movies. Week 4 asked you to pick a topic that could grow a second list. This week you add it."*
- [ ] ⚠️ Say what the self-check leaves behind, because it cannot clean up after itself: *"The self-check files one report through your form, and it cannot remove it. Nothing this week asks you to build a delete for the second table. It files one row, marked Week 9 Test, and it reuses that same row on every run after."*
- [ ] 🔗 Week 10: *"Next week is the midterm. Nothing new is introduced. You extend what you have into something you would show someone."*
