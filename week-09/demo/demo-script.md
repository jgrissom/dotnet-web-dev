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
> **Tonight has three deliberate failures and none of them gets announced.** §4 renders a truck's specials and the page says **Nothing listed** while the table holds two rows. §5 asks the room to guess a number and the terminal prints **eight**. §7 fills in a perfect form and the app refuses it, blaming a field the user cannot see. All three are silent, all three are the homework's bugs, and all three are met on your machine first.

## 0 · Before class

- [ ] ⚠️ **Re-rehearsing this week? Delete `instructor/week-09/Curbside` first** — a rehearsal leaves it in tonight's **end** state, and every beat below starts from week 8's. Deleting the folder in Finder is enough; the next step recreates it
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course/instructor/week-09`, create a new empty **Curbside** and open it *(the dialog's **New Folder** button makes `week-09` too, the first time)*. Its own week folder, so nothing here collides with another week's `Curbside`
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
- [ ] **Park two browser tabs**: `/Trucks` and `/Trucks/Details/1`
- [ ] **mssql extension** signed in, saved server connection tested, panel closed. It has **one** appearance tonight — §3, reading the fourteen rows the migration inserted
- [ ] **Say the no-typing line out loud in the first minute.** Tonight is watched, not typed along with: *"nothing tonight is yours to type. Curbside is my app, the Registry is yours, and your keyboard time is the lab — where the checks answer you and I am in the room"*
- [ ] Teaching profile on, notifications off, editor font sized for the back of the room and for a small laptop screen

> [!NOTE]
> **🖥️ On screen, at curtain**
>
> - **VS Code** — left half, `instructor/week-09/Curbside` open, two integrated terminals: terminal 1 running `dotnet watch`, terminal 2 idle at the project root
> - **Browser** — right half, two tabs: `/Trucks` (seven cards, slogans showing) and `/Trucks/Details/1`

## 1 · Where we left off *(slides 2–3)*

### The payoff, retold *(slide 2)*

- [ ] 🎞️ **GO TO SLIDE 2** — *One table. Every app is at least two*
- [ ] Say what the slide is claiming, and be specific about what is missing: *"you have Create, Read, Update and Delete on trucks. What you do not have is a truck that knows anything about anything else. Seven rows, seven islands"*
- [ ] Land the second half: *"tonight your records grow relatives — a second table whose rows point back at this one"*

### Collect the reading *(slide 3)*

- [ ] 🎞️ **GO TO SLIDE 3** — *What a relationship is*
- [ ] These three words came off last week's reading, so ask for them rather than reading them out: *"the docs used three words. Which one is the Truck, which one is the Special, and which one is the column?"*
- [ ] Then fix them in place with the sentence the table cannot say: *"principal and dependent are not about importance. They are about who can exist alone. A truck with no specials is a truck. A special with no truck is a row nobody can explain"*

## 2 · The second table *(slide 4)*

### Three properties, two classes *(slide 4)*

- [ ] 🎞️ **GO TO SLIDE 4** — *Three properties, two classes*
- [ ] **Ask the question on the slide before you build any of it:** *"three properties up there, across two classes. Only one of them is a column in SQL Server. Which one?"*
- [ ] Give it away only after they commit: *"`TruckId`. That is the whole relationship as far as the database is concerned — one integer. The other two are conveniences C# gives you for walking between objects, and neither exists in the table"*
- [ ] Swipe back. Create `Models/Special.cs` — **type this one**, it is the shape of the night:
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
- [ ] 💡 One sentence on `decimal`, not a detour: *"money is decimal, not double. `Precision(5, 2)` says how wide the column is, and without it EF picks one for you and says so in the build output"*
- [ ] Open `Models/Truck.cs` and add the other end, at the bottom of the class:
  ```csharp
  public ICollection<Special> Specials { get; set; } = new List<Special>();
  ```
- [ ] 🎯 Point at the initializer, because it is the difference between a bug and a blank page later: *"it starts as an empty list, not null. A truck with no specials should read as zero specials, not as a crash"*
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
      new Special { Id = 5, TruckId = 3, Name = "Birria Tacos", Price = 11.00m, ServedOn = "Tuesday" },
      new Special { Id = 6, TruckId = 3, Name = "Street Corn", Price = 5.00m, ServedOn = "Tuesday" },
      new Special { Id = 7, TruckId = 4, Name = "Gyro Plate", Price = 13.00m, ServedOn = "Thursday" },
      new Special { Id = 8, TruckId = 5, Name = "Pierogi Plate", Price = 10.00m, ServedOn = "Sunday" },
      new Special { Id = 9, TruckId = 5, Name = "Cheese Curds", Price = 7.50m, ServedOn = "Friday" },
      new Special { Id = 10, TruckId = 6, Name = "Banh Mi", Price = 9.00m, ServedOn = "Wednesday" },
      new Special { Id = 11, TruckId = 6, Name = "Loaded Fries", Price = 8.00m, ServedOn = "Thursday" },
      new Special { Id = 12, TruckId = 7, Name = "Slider Trio", Price = 10.50m, ServedOn = "Saturday" },
      new Special { Id = 13, TruckId = 7, Name = "Cheese Curds", Price = 6.50m, ServedOn = "Friday" },
      new Special { Id = 14, TruckId = 4, Name = "Loaded Fries", Price = 8.00m, ServedOn = "Friday" }
  );
  ```
- [ ] 💡 Do **not** draw attention to the repeated dish names yet — three trucks sell Cheese Curds and that is §9's reveal. If someone spots it early, say *"hold that thought, you have just found the last thing we do tonight"*

## 3 · The migration *(slide 5)*

### Cascade is chosen for you *(slide 5)*

- [ ] Terminal 2. **Predict the contents before you generate it:** *"three migrations exist. This one is going to contain something none of the others do. What?"*
  ```bash
  dotnet ef migrations add AddSpecials
  ```
- [ ] Open the generated file and read the four operations off the screen in order: **`CreateTable`**, a **`ForeignKey`** constraint inside it, **`InsertData`** with the fourteen rows, and **`CreateIndex`** on `TruckId`
- [ ] 🎯 Stop on the index, because nobody asks for it: *"EF indexed the foreign key without being asked. Every page from here on filters specials by truck, and that index is why it stays fast"*
- [ ] Now the line that earns its own slide — read it aloud off the migration:
  ```csharp
  onDelete: ReferentialAction.Cascade
  ```
- [ ] 🎞️ **GO TO SLIDE 5** — *Cascade is chosen for you*
- [ ] Deliver the inference chain, slowly, because this is the beat: *"I never typed the word cascade. I typed `int TruckId` with no question mark. That says a special must have a truck. So EF asks: what should happen to a special when its truck is deleted? It cannot be orphaned, because the column will not take a null — so it goes too"*
- [ ] 🔗 Collect last week's reading question by name: *"the reading asked you what happens to a review when its trail is deleted. That is the answer, and the framework decided it on your behalf from a missing question mark"*
- [ ] Swipe back. Apply it in terminal 2:
  ```bash
  dotnet ef database update
  ```
- [ ] **mssql panel** — run this and let the fourteen rows sit on screen for a second:
  ```sql
  SELECT * FROM Specials;
  ```
- [ ] Say what is now true, and set up §4 without announcing it: *"fourteen rows, each one pointing at a truck. The database knows all of this. Let us go put it on a page"*

## 4 · Break #1 — the empty list *(slide 6)*

### Empty is not missing *(slide 6)*

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
- [ ] **Predict before you reload, and be exact about the number:** *"the mssql panel just showed us Roll Models has two specials, Kimchi Fries and a Bulgogi Bowl. I am about to reload its page. What am I going to see?"*
- [ ] **Reload `/Trucks/Details/1`.** 🎯 **`Nothing listed.`** Let it sit there. Say nothing for a beat
- [ ] Then walk the evidence out loud, in this order — the point is that every instrument says fine: *"the page is 200. There is no error. The terminal has no exception in it. And the database has the rows — we read them thirty seconds ago"*
- [ ] Ask for the diagnosis before you give it: *"so where did the two specials go?"*
- [ ] 🎞️ **GO TO SLIDE 6** — *Empty is not missing*
- [ ] Deliver the rule as the answer to the question they just tried: *"the navigation property is empty until a query asks for it. EF Core does not go and fetch related rows on the off chance you wanted them — it fetched a truck, because a truck is what you asked for"*
- [ ] Then the sentence that makes it dangerous, which is the last line on the slide: *"and an empty list looks exactly like a truck that has no specials. This failure has no symptom"*
- [ ] Swipe back. Fix `Details` in `TrucksController`:
  ```csharp
  var truck = _context.Trucks
      .Include(t => t.Specials)
      .FirstOrDefault(t => t.Id == id);
  ```
- [ ] **Reload.** Two specials, with prices. 🎯 *"Same page, same database, same fourteen rows. One line"*

## 5 · Break #2 — how many SELECTs *(slides 7–8)*

### Predict the count *(slide 7)*

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
- [ ] And in `Views/Trucks/Index.cshtml`, inside the loop, under the partial:
  ```cshtml
  <p class="small text-muted">@(((Dictionary<int,int>)ViewData["Counts"]!)[truck.Id]) specials</p>
  ```
- [ ] 🎞️ **GO TO SLIDE 7** — *How many SELECTs?*
- [ ] **The slide is the exercise.** Read the loop off it and ask for a show of hands on a number: *"seven trucks. One page load. How many SELECT statements is that terminal about to print? Hands up for one. For seven. For eight"*
- [ ] Swipe back. **Reload `/Trucks` and scroll the terminal.** 🎯 **Eight.** One for the trucks, then one per truck
- [ ] 🔗 Collect the promise made two weeks ago, in as many words: *"in week 7 I told you that in week 9 a query would get expensive and this terminal is how you would notice. That is the terminal, and that is the query"*
- [ ] 💡 Make the stakes real without a number you cannot support: *"seven trucks is eight queries. This page grows one query per row, forever"*

### One JOIN *(slide 8)*

- [ ] Replace the whole `Index` action with the one line:
  ```csharp
  public IActionResult Index()
  {
      return View(_context.Trucks
          .Include(t => t.Specials)
          .ToList());
  }
  ```
- [ ] And the view line becomes what a reader would hope for:
  ```cshtml
  <p class="small text-muted">@truck.Specials.Count specials</p>
  ```
- [ ] **Reload and read the terminal.** 🎯 **One statement**, and it is a `LEFT JOIN`
- [ ] 🎞️ **GO TO SLIDE 8** — *One JOIN*
- [ ] Point at the SQL on the slide and say what it proves: *"you did not write that join. You said Include, and EF wrote the join — one trip, seven trucks and all fourteen specials in it"*
- [ ] ⚠️ Then the rider that is the actual exam question, and it is the last line on the slide: *"Include is per query. I put it on Details twenty minutes ago and it did nothing for this page. It is not a setting on the model and it is not remembered"*

## 6 · The ViewModel *(slide 9)*

### One view, two things *(slide 9)*

- [ ] Open `Views/Trucks/Details.cshtml` and scroll to the *Also in* block. Read the line that is already there, out loud, exactly as written:
  ```cshtml
  var alsoHere = (List<Truck>)ViewData["AlsoHere"]!;
  ```
- [ ] 🎞️ **GO TO SLIDE 9** — *One view, two things*
- [ ] Say what that line costs, since the slide shows it but cannot complain about it: *"a cast and an exclamation mark, in a view, because `ViewData` is a bag of `object` and it forgot what went in. And the exclamation mark is me promising the compiler it is not null — with nothing backing the promise"*
- [ ] Then the rule, which is the reason the folder is about to exist: *"when a view needs more than one thing, stop stuffing them in a bag. Give it a type that holds both"*
- [ ] ⚠️ And the boundary, because this is where people put entities by mistake: *"a ViewModel is not an entity. It has no table, it is never in the `DbContext`, and it does not go in `Models/`"*
- [ ] Swipe back. Create the folder `ViewModels/` and `ViewModels/TruckDetailsViewModel.cs`:
  ```csharp
  using Curbside.Models;

  namespace Curbside.ViewModels;

  public class TruckDetailsViewModel
  {
      public Truck Truck { get; set; } = null!;
      public List<Truck> AlsoHere { get; set; } = new();
  }
  ```
- [ ] ⚠️ **Add the using to `Views/_ViewImports.cshtml` now, in the same breath** — a namespace that does not exist yet breaks *every* view in the project, not just this one, and the error list will point at files you have not touched:
  ```cshtml
  @using Curbside.ViewModels
  ```
- [ ] Rewrite `Details` in `TrucksController` to hand over one object:
  ```csharp
  var viewModel = new TruckDetailsViewModel
  {
      Truck = truck,
      AlsoHere = _context.Trucks
          .Include(t => t.Specials)
          .Where(t => t.City == truck.City && t.Id != truck.Id)
          .ToList()
  };

  return View(viewModel);
  ```
- [ ] Change the view's first line to `@model TruckDetailsViewModel`, then let the compiler drive: every `Model.X` becomes `Model.Truck.X`, and the cast line is deleted outright
- [ ] **Reload `/Trucks/Details/1`.** Same page. 🎯 *"Nothing on screen changed. The cast is gone, the exclamation mark is gone, and the view now says what it wants in its first line"*

## 7 · The report form *(slides 10–11)*

### The dropdown *(slide 10)*

- [ ] 🎞️ **GO TO SLIDE 10** — *SelectList*
- [ ] Read the two blocks as one mechanism, because the connection between them is the whole idea: *"the controller builds a list of trucks and says: the value is the Id, the words are the Name. The view drops it into a select. So the option a human clicks carries a truck id — and that id is the foreign key"*
- [ ] Swipe back. Create `ViewModels/SpecialFormViewModel.cs` — **type the two `SelectList` lines**, they come back in a minute:
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
- [ ] 🎯 Point at the rebuild inside the guard before anyone asks why it is there: *"if the form is rejected I build the truck list again. A dropdown is not posted back — the browser sends the one option you chose, never the list it came from. Skip this line and the redisplayed form has an empty dropdown"*
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

### The list is not an answer *(slide 11)*

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
- [ ] 🎞️ **GO TO SLIDE 11** — *The list is not an answer*
- [ ] Deliver the explanation the error message refuses to give: *"`Trucks` is not the dropdown. `Trucks` is the list of choices, and it is a non-nullable property. Week 6: a non-nullable property is a required field. The browser posted the truck you picked — it never posts the list it picked from, so as far as the binder is concerned a required field arrived empty"*
- [ ] Swipe back. Add one character in `SpecialFormViewModel`:
  ```csharp
  public SelectList? Trucks { get; set; }
  ```
- [ ] **Submit again.** 🎯 Redirect to Roll Models, and **Tteokbokki is on the menu, third in the list**
- [ ] 💡 Close the loop on the fix: *"one question mark. The list is not an answer, so it is allowed to be absent"*

## 8 · Delete takes the children *(slide 12)*

### Closing a file takes the children *(slide 12)*

- [ ] Go to `/Trucks/Details/1` and hover **Remove this truck**, but do not click yet
- [ ] **Ask, and make them commit before anything happens:** *"Roll Models has three specials now. If I delete this truck, what happens to the three rows in the Specials table?"*
- [ ] 🎞️ **GO TO SLIDE 12** — *Closing a file takes the children*
- [ ] Answer it against the slide, and tie it back to a decision they watched get made: *"they are deleted. Not orphaned, not blocked — deleted. And we chose that in section three, by typing `int` instead of `int?`"*
- [ ] Then the design point, which is the reason this beat exists at all: *"so a page that asks *are you sure* is lying if it only shows the truck. It has to say what else is going with it"*
- [ ] Swipe back. Load the specials in the Delete GET in `TrucksController`:
  ```csharp
  var truck = await _context.Trucks
      .Include(t => t.Specials)
      .FirstOrDefaultAsync(t => t.Id == id);
  ```
- [ ] And warn, in `Views/Trucks/Delete.cshtml`, under the card:
  ```cshtml
  @if (Model.Specials.Count > 0)
  {
      <div class="alert alert-warning">
          This truck has <strong>@Model.Specials.Count</strong> special@(Model.Specials.Count == 1 ? "" : "s") on file.
          Removing the truck removes @(Model.Specials.Count == 1 ? "it" : "them") too.
      </div>
  }
  ```
- [ ] **Load `/Trucks/Delete/1`.** 🎯 **Three specials on file.** Then click **Keep it** — say out loud that you are not deleting it, because the room will assume you did
- [ ] 💡 One rider on the `Include`, because it is the same lesson a third time: *"that page needed its own Include. Details had one, Index had one, and Delete still showed zero until I added a third"*

## 9 · One more foreign key *(slide 13)*

### The join was already there *(slide 13)*

- [ ] Back to the seed in `Data/CurbsideContext.cs`. Scroll so several rows are visible and **ask the room to find the problem**: *"read the dish names. What is wrong with this table?"*
- [ ] Take the answer and sharpen it into a question the database cannot answer: *"three trucks sell Cheese Curds and each one spells it into its own row. So tell me who sells cheese curds — and the only way is to match a string and hope everybody typed it the same"*
- [ ] 🎞️ **GO TO SLIDE 13** — *One more foreign key*
- [ ] Say what the fix is before you type it, and name what it turns `Special` into: *"pull the name out into its own table. `Special` stops being a detail of a truck and becomes the link between a truck and a dish — and it carries the price and the day while it does it"*
- [ ] ⚠️ Then the definition, which is the syllabus line landing: *"that is a many-to-many. Many trucks, many dishes. And the join has to be a class of its own precisely because it carries something — the price is not a fact about the truck or about the dish, it is a fact about the pairing"*
- [ ] Swipe back. Create `Models/Dish.cs`:
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
      new Special { Id = 5, TruckId = 3, DishId = 5, Price = 11.00m, ServedOn = "Tuesday" },
      new Special { Id = 6, TruckId = 3, DishId = 6, Price = 5.00m, ServedOn = "Tuesday" },
      new Special { Id = 7, TruckId = 4, DishId = 7, Price = 13.00m, ServedOn = "Thursday" },
      new Special { Id = 8, TruckId = 5, DishId = 8, Price = 10.00m, ServedOn = "Sunday" },
      new Special { Id = 9, TruckId = 5, DishId = 3, Price = 7.50m, ServedOn = "Friday" },
      new Special { Id = 10, TruckId = 6, DishId = 9, Price = 9.00m, ServedOn = "Wednesday" },
      new Special { Id = 11, TruckId = 6, DishId = 4, Price = 8.00m, ServedOn = "Thursday" },
      new Special { Id = 12, TruckId = 7, DishId = 10, Price = 10.50m, ServedOn = "Saturday" },
      new Special { Id = 13, TruckId = 7, DishId = 3, Price = 6.50m, ServedOn = "Friday" },
      new Special { Id = 14, TruckId = 4, DishId = 4, Price = 8.00m, ServedOn = "Friday" }
  );
  ```
- [ ] Terminal 2 — and **read the warning EF prints, do not scroll past it**:
  ```bash
  dotnet ef migrations add AddDishes
  ```
- [ ] 🎯 *"An operation was scaffolded that may result in the loss of data.* That is the `DropColumn`. EF is right to say it and we mean it — the names are not lost, they moved"*
- [ ] Open the migration and read the order out loud, because the order is what makes it safe: **`DropColumn`**, **`AddColumn DishId`**, **`CreateTable Dishes`**, fourteen **`UpdateData`**, and only *then* the index and the foreign key
- [ ] 💡 Say why that ordering matters: *"the foreign key constraint goes on last. If it went on first, fourteen rows with a `DishId` of zero would fail it instantly"*
  ```bash
  dotnet ef database update
  ```
- [ ] ⚠️ **`Name` is gone, so three things that used it have to catch up — the build will not run until all three are done.** First, `Views/Trucks/Details.cshtml`, where the menu row becomes a link:
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
- [ ] 🎯 Name it plainly: *"`Include` gets you to the specials. `ThenInclude` keeps going, one hop further, to the dish each special names"*
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
- [ ] Land the reveal, and be precise that nothing was added to make it possible: *"I did not build a new relationship for that page. Those are the same fourteen rows, read from the other end. That is what a many-to-many is — one join table, walked in either direction"*

## 10 · Hand off to the lab *(slide 14)*

- [ ] 🎞️ **GO TO SLIDE 14** — *Lab: the Registry gets a sightings log*
- [ ] Read the five tasks off the slide, then name the one that will eat the time: *"task 3 is one line and it is the line everybody forgets. When your accounts do not show up, it is not the seed and it is not the migration"*
- [ ] ~90 seconds of **what done looks like** — the answer key **on localhost**, from `week-09/lab/solution`. Nothing is deployed for this:
  ```bash
  dotnet run
  ```
  Show `/Cryptids` with report counts on the cards, a creature's page with its accounts, and the report form with its creature dropdown. Then, from `week-09/lab/solution`:
  ```bash
  dotnet test Cryptids.Checks
  ```
  printing **6/6**
- [ ] ⚠️ **Say what is different about the Registry's first task, because it is a deletion:** *"your `Sightings` column — the one that says 47 reports for the Hodag — comes out. Somebody typed 47. Tonight it becomes the reports themselves, and the number gets smaller and true"*
- [ ] ⚠️ **The task-1 database drop, with the why and the fence:** *"drop the lab database before your first migration, because the starter's migration history and yours will not agree. **Never on your own project** — your project has data you care about"*
- [ ] **In-class target: checks 1–5.** Check 6 is the delete warning, and it rolls into the homework if the clock wins

## 11 · Wrap-up, after the lab *(slide 15)*

- [ ] 🎞️ **GO TO SLIDE 15** — *Tonight, in one picture*
- [ ] Walk the five rows, one sentence each, and give `Include` the emphasis because it is the row that costs points: *"per query. Not per model, not per app. Every page that shows related rows asks for them again"*
- [ ] 🔗 **Collect the promise from week 7 one more time**, now that they have seen it: *"the terminal told you the truth about a query getting expensive, and it will do it again all term. It is free and it is already running"*
- [ ] Homework: **a second related table on their own app.** One-to-many is enough — *"sightings for creatures, reviews for trails, showtimes for movies. Week 4 told you to pick a topic that could grow one. That bill is due"*
- [ ] ⚠️ Say what the self-check leaves behind, because it cannot clean up after itself: *"it files one report through your form and it cannot take it back — nothing this week asks you to build a delete for the second table. It files one, marked Week 9 Test, and reuses that same row every run after"*
- [ ] 🔗 Week 10: *"the midterm. Nothing new — you extend what you have into something you would show someone"*
