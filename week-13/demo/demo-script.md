# Week 13 Demo Script — Curbside Gets Polished ✨

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Paste from here; nothing tonight is worth typing.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-13/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it is due. Everything that is not a 🎞️ line happens in the other state, so **you do not need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

> [!IMPORTANT]
> **Tonight the lab comes in six short blocks, one after each part of the demo that it practices.** Each block has its own `## Lab` section below — what to say, what to watch for, and the README note it stops at. The lab README goes on screen for every block. There is no lab slide.

> [!IMPORTANT]
> **Two things tonight get broken, and both are put back.** §5 swaps in `EmptyTruckService` and swaps it out, and §6 changes `AddScoped` to `AddSingleton` and changes it back. Everything else is forward. §2's missing message is the right code in the wrong place, and it gets replaced rather than undone.

## 0 · Before class

- [ ] ⚠️ **Re-rehearsing this week? Delete `instructor/week-13/Curbside` first** — a rehearsal leaves it in tonight's **end** state, and every beat below starts from week 12's. Deleting the folder in Finder is enough; the next step recreates it
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course/instructor/week-13`, create a new empty **folder** named `Curbside` and open it *(the dialog's **New Folder** button makes `week-13` too, the first time)*. **The folder stays empty — there is no `dotnet new` tonight;** the next step fills it with the starter
- [ ] Integrated terminal (**Ctrl+&#96;**) — fill the empty folder with tonight's starter. This is Curbside as week 12's demo left it: the Admin role on every write, the seeder, the hidden buttons and the claims page:
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-13/demo-starter/Curbside/. .
  ```
  The trailing `/.` copies the *contents* in, so the project lands at the top of the window you already have open — no folder inside a folder

  ⚠️ **That resets the files, not the database and not the secrets.** Curbside's data lives on the school SQL Server, and every copy carries the same `<UserSecretsId>` — so the database rebuild below is a *separate* reset.
- [ ] **Set your connection string and the admin's email** — the `<UserSecretsId>` ships in the `.csproj`, so `set` alone is enough, no `init`:
  ```bash
  dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=...;User ID=...;Password=...;TrustServerCertificate=True"
  dotnet user-secrets set "Admin:Email" "ada@example.com"
  ```
- [ ] 🚨 **Check both are there:**
  ```bash
  dotnet user-secrets list
  ```
  **Two lines**, `Admin:Email = ada@example.com` and `ConnectionStrings:DefaultConnection = …`. Unlike last week, the email stays in place all night: Ada is the admin before the room arrives
- [ ] ⚠️ **Rebuild the database — before your rehearsal, and again after it:**
  ```bash
  dotnet ef database drop --force
  dotnet ef database update
  ```
  Seven migrations replay. **No new migration tonight:** nothing in the model changes
- [ ] **Rehearse the whole script once in a separate copy.** Stop the rehearsal's `dotnet watch` when you're done — both copies use the same port
- [ ] 🚨 **Then rebuild the database again** — drop and update. A separate *copy* is not a separate database: your rehearsal left Noodle Nomad on the street and Ada registered, and §4's page counts come from exactly eight trucks. **Last thing before class, always: drop, update**
- [ ] Run it, same terminal:
  ```bash
  dotnet watch
  ```
- [ ] **Register Ada.** Browse to `/Account/Register`: **Email** `ada@example.com`, **What should we call you?** `Ada`, `Curbside-2026` in **Password** and again in **Confirm password**
- [ ] **Press Ctrl+R in the terminal, then sign out and back in as Ada.** The seeder hands the role out at startup, so it needs a restart after she registers, and her cookie needs a fresh sign-in after that. Check it: `/Trucks` shows **＋ Add a truck**
- [ ] ⚠️ **Know the one prompt, and where it comes.** It is **not** in §2, §3 or §4: all of those edits hot-reload, new ViewModel and changed action signature included. It is in **§5, when the `TrucksController` paste lands** — `ENC0004: Updating the modifiers of const field requires restarting the application`, then **`Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`**. **Answer `a`.** After that, `watch` restarts by itself for every `Program.cs` edit. *(Measured on a pty-driven `dotnet watch`.)*
- [ ] ⚠️ **Every restart tonight is Ctrl+R in the terminal, never Ctrl+C + `dotnet watch`.** *Always* belongs to the `watch` session; Ctrl+C ends it
- [ ] **Park three browser tabs**: `/`, `/Trucks`, and **week 13's lab README** on github.com — it goes on screen for every lab block tonight
- [ ] **Say the no-typing line out loud in the first minute.** Tonight is watched, not typed along with: *"Nothing I type tonight is yours to type. Curbside is my app, and the Registry is yours. Your keyboard time is the lab blocks. There are six of them tonight."*
- [ ] Teaching profile on, notifications off, editor font sized for the back of the room and for a small laptop screen

> [!NOTE]
> **🖥️ On screen, at curtain**
>
> - **VS Code** — left half, `instructor/week-13/Curbside` open, one integrated terminal running `dotnet watch`
> - **Browser** — right half, three tabs: `/` (Curbside's front page, **signed in as Ada**), `/Trucks`, and the week 13 lab README

## 1 · The silent save *(slide 1)*

- [ ] 🎞️ **GO TO SLIDE 1** — *Week 13 — Polish* · it is still up from the gallery — talk to its list before you swipe away from it: *"Nothing tonight adds a table. The app you have works. Tonight it gets easier to use, and then easier to read. First, a message after every change. Then a search box and a filter, then pages. Then a question that has been open since week 7: where does underscore context come from? And last, how long those things last."*

### Nothing says so

- [ ] **Swipe to the browser, the `/Trucks` tab.** Say the goal: *"I am signed in as Ada, my admin. I am going to add a truck and watch what the site tells me."*
- [ ] Click **＋ Add a truck**: **Name** `Noodle Nomad`, **Cuisine** `Thai`, **City** `Waukesha`, **Rating** `4.5`. Submit
- [ ] 🎯 Back on `/Trucks`. *"It worked. I can tell because I know where to look: eight trucks on the street, and there it is in the cards. The site itself said nothing. With a longer list, I would have no idea whether my click did anything."*

## Lab A · Setup and task 1 — 8 minutes

- [ ] Put the **lab README** on screen — the tab you parked in §0 — scrolled to **Setup**
- [ ] *"Tonight the lab comes in six short blocks. After each part of my demo, you do the same kind of thing to your Registry, plus one thing I did not show. Each block ends at a note that says In class, stop here."*
- [ ] *"The first block is setup and task 1. There is no database drop tonight. This starter has the same migrations as last week's, so your database, your account and your curator role are all still there. You run update, it applies nothing, and you sign in."*
- [ ] *"If your secrets are gone, because you are on a frozen lab PC, task 1 has both commands. Tonight's in-class target is all five checks."*
- [ ] 👀 **Watch for:** `There is already an object named 'Cryptids'` on `database update` — they never ran week 12's lab, so their database has their own week-11 migrations; the callout in task 1 is for them. `The ConnectionString property has not been initialized` before `Now listening on:` — the secret is gone; set it again. No **＋ Open a new file** after signing in — `Admin:Email` is missing or holds a different email. `Could not find a MSBuild project file` — terminal 1 or 2 never ran `cd Cryptids.Web`
- [ ] **Stop:** the note after **Task 1 in full**. Where they should be: `dotnet test` prints **`Passed: 1`**, the app is running in terminal 1, and they are signed in as their curator

## 2 · A message that survives *(slide 2)*

### The obvious way

- [ ] **Swipe to the editor.** Say the goal: *"I want a message at the top of the page after a change. I already know one way to hand a value to a view, and that is ViewData. So I set it in the POST, and I show it in the layout, so every page can show one."*
- [ ] `Controllers/TrucksController.cs` — in the **POST `Create`**, just above `return RedirectToAction(nameof(Index));`:
  ```csharp
  ViewData["Message"] = $"{truck.Name} is on the street.";
  ```
- [ ] `Views/Shared/_Layout.cshtml` — just above `@RenderBody()`:
  ```cshtml
  @if (ViewData["Message"] != null)
  {
      <div class="alert alert-success" role="alert">@ViewData["Message"]</div>
  }
  ```
- [ ] **Say what they are:** *"One line that sets the message, and a green box that shows it if there is one."*
- [ ] **Ask before the click — the answers are week 4 and week 6:** *"Week 4 said ViewData lasts for one request. Week 6 said a redirect makes the browser send a second request. So will I see the message?"* Take answers
- [ ] **Swipe to the browser.** **＋ Add a truck**: **Name** `Pad Thai Pilot`, **Cuisine** `Thai`, **City** `Racine`, **Rating** `4`. Submit. 🎯 **The truck is there. The message isn't.**

### A second request *(slide 2)*

- [ ] 🎞️ **GO TO SLIDE 2** — *One request, or until it's read* · *"Here are the two requests. The POST set the message, then answered with a redirect. The browser sent a brand new GET, and that one drew the page. ViewData was gone by then."*
- [ ] Still on slide 2, the table: *"TempData is built for this. It lasts until something reads it, so it survives the redirect. ASP.NET keeps it in a cookie between the two requests."*
- [ ] **Swipe to the editor.** Change the word in all three places — `ViewData["Message"]` becomes `TempData["Message"]`, once in the POST and twice in `_Layout.cshtml`
- [ ] **Swipe to the browser.** **＋ Add a truck**: **Name** `Larb Larder`, **Cuisine** `Thai`, **City** `Racine`, **Rating** `4`. Submit. 🎯 **`Larb Larder is on the street.`**
- [ ] **Reload the page.** 🎯 **The message is gone.** *"It was read once, so it was removed. That is what you want from a message: it should not still be there tomorrow."*

### Every write

- [ ] **Swipe to the editor.** Say the goal: *"Edit and Delete get the same line, with their own words."* In the **POST `Edit`**, just below `await _context.SaveChangesAsync();` inside the `try`:
  ```csharp
  TempData["Message"] = $"{truck.Name} is updated.";
  ```
  In **`DeleteConfirmed`**, just below `_context.Trucks.Remove(truck);`, inside the `if`:
  ```csharp
  TempData["Message"] = $"{truck.Name} is off the street.";
  ```
- [ ] **Say what they are:** *"The same message, on the other two writes. Delete sets it inside the if, so the message only appears when a truck was really removed."*
- [ ] **Swipe to the browser.** Open **Larb Larder**, **🗑️ Remove this truck**, confirm: `Larb Larder is off the street.` Do the same for **Pad Thai Pilot**. *"Back to eight trucks, and it told me both times."*

## Lab B · Task 2 — 15 minutes

- [ ] Lab README on screen, scrolled to **Task 2 in full**
- [ ] *"Task 2 is the same message on your three archive writes, in your words. The block goes in your layout."*
- [ ] ⚠️ *"Then the one I did not show. When a visitor files a sighting, they should get a message too, and it should name the creature. That form only posts the creature's id. So your POST has to look the name up."*
- [ ] 👀 **Watch for:** check 2 saying no message after filing a creature — the block isn't in `_Layout.cshtml`, or it still says `ViewData`. Check 2 naming Mothman — the sighting POST. A `CS0103` on `name` — they wrote the lookup after the `TempData` line. The message on the next page too — `TempData.Keep` or `Peek` from a search result
- [ ] **Stop:** the note after **Task 2 in full**. Where they should be: **`Passed: 2`**, and a message on their screen after filing a sighting, signed out

## ☕ Break

## 3 · Search and a filter *(slide 3)*

### The page's own model

- [ ] In the editor — the deck stays down for the first part. Say the goal: *"Eight trucks is fine, and eight hundred is not. I want a search box and a dropdown of cities. The page now needs more than a list of trucks: it needs what was searched for, so the box can show it. A page that needs several things gets a ViewModel, the same as week 9."* Create `ViewModels/TruckListViewModel.cs` and paste:
  ```csharp
  using Curbside.Models;

  namespace Curbside.ViewModels;

  // What the list page needs: this page's trucks, plus the search that produced
  // them, so the form can show what was typed.
  public class TruckListViewModel
  {
      public List<Truck> Trucks { get; set; } = new();
      public string? Search { get; set; }
      public string? City { get; set; }
      public List<string> Cities { get; set; } = new();
  }
  ```
- [ ] **Say what it is:** *"The trucks to show, what was searched for, which city was picked, and the list of cities for the dropdown."*
- [ ] Say the goal: *"Now the page. A form above the cards, and the cards read from the ViewModel."* `Views/Trucks/Index.cshtml` — select everything in the file and paste:
  ```cshtml
  @model TruckListViewModel
  @{
      ViewData["Title"] = "Trucks";
  }

  <h1>Curbside</h1>
  <p class="text-muted">@Model.Trucks.Count truck@(Model.Trucks.Count == 1 ? "" : "s") on the street.</p>

  @if (User.IsInRole("Admin"))
  {
      <a asp-action="Create" class="btn btn-primary mb-4">＋ Add a truck</a>
  }

  <form method="get" class="row g-2 mb-4">
      <div class="col-md-6">
          <input type="search" name="search" value="@Model.Search" class="form-control"
                 placeholder="Name, cuisine or city" aria-label="Search trucks" />
      </div>
      <div class="col-md-4">
          <select name="city" class="form-select" aria-label="Filter by city">
              <option value="">Every city</option>
              @foreach (var city in Model.Cities)
              {
                  <option value="@city" selected="@(city == Model.City)">@city</option>
              }
          </select>
      </div>
      <div class="col-md-2">
          <button class="btn btn-secondary w-100">Search</button>
      </div>
  </form>

  @if (!Model.Trucks.Any())
  {
      <p class="text-muted">No trucks match that.</p>
  }

  <div class="row row-cols-1 row-cols-md-3 g-4">
      @foreach (var truck in Model.Trucks)
      {
          <div class="col">
              <partial name="_TruckCard" model="truck" />
          </div>
      }
  </div>
  ```
- [ ] **Say what it is:** *"The form has method get, and there is no action on it, so it goes back to this same page with the fields in the address. Search is a box, city is a dropdown, and each keeps what you chose. Everything else is the page you already had."*
- [ ] Say the goal: *"Last piece, the action. It takes the search and the city, builds the query one step at a time, and hands the ViewModel to the page."* `Controllers/TrucksController.cs` — replace the whole `Index` method, from `public IActionResult Index()` to its closing brace. Keep the two comment lines and `[AllowAnonymous]` above it:
  ```csharp
      public IActionResult Index(string? search, string? city)
      {
          // Nothing runs yet: this builds the query, and each Where adds to it.
          var trucks = _context.Trucks
              .Include(t => t.Specials)
              .AsQueryable();

          if (!string.IsNullOrWhiteSpace(search))
          {
              trucks = trucks.Where(t => t.Name.Contains(search)
                                      || t.Cuisine.Contains(search)
                                      || t.City.Contains(search));
          }

          if (!string.IsNullOrEmpty(city))
          {
              trucks = trucks.Where(t => t.City == city);
          }

          return View(new TruckListViewModel
          {
              Trucks = trucks.OrderBy(t => t.Name).ToList(),
              Search = search,
              City = city,
              Cities = _context.Trucks.Select(t => t.City).Distinct().OrderBy(c => c).ToList()
          });
      }
  ```
- [ ] **Say what it is, with it on screen:** *"The first statement builds a query and does not run it. Each if adds a Where to it, but only when that box was filled in. The query runs once, at ToList. The search looks in three columns. The last line asks the database for its list of cities, each one once."*
- [ ] 💡 ⚠️ Don't reload until all three are in: between the pastes the page and the action disagree about the model, and that is a `500` you don't need to show. If a `500` survives the third paste, press Ctrl+R in the terminal

### Watch the address bar *(slide 3)*

- [ ] **Swipe to the browser**, `/Trucks`. Say what to watch: *"Watch the address bar, not the cards."* Type `korean` in the box and press **Search**. 🎯 **One truck, Roll Models, and `/Trucks?search=korean&city=` in the address bar.** The box still says `korean`
- [ ] *"I typed korean in lowercase and the database said Korean. SQL Server ignores case by default, and that is the database's setting, not my code."*
- [ ] 🎞️ **GO TO SLIDE 3** — *The address bar is the search* · *"Those are the same names. search in the address, search in the action. That is model binding, the same as question mark name equals Ada in week 3."*
- [ ] Still on slide 3, the last line: *"This form is a GET on purpose. A search changes nothing, so it does not need a POST, and it needs no sign-in. And a GET lives in the address bar, so I can bookmark this search or send it to someone."*
- [ ] **Swipe to the browser.** Clear the box. Pick **Milwaukee** in the dropdown and press **Search**: Banh Mi Mobile and Taco Tornado. Then type `taco` in the box too, and **Search**: Taco Tornado. *"Both Wheres ran. Each one narrows what the last one left."*
- [ ] Type `zzz`, **Search**: *No trucks match that.* *"And a search with no answer says so."*

## Lab C · Task 3 — 17 minutes

- [ ] Lab README on screen, scrolled to **Task 3 in full**
- [ ] *"Task 3 is a search box and a dropdown on your Registry. Yours searches three columns: the name, the region and the Latin name."*
- [ ] ⚠️ *"Two things are different from mine. Latin name can be null, so the compiler will warn you until you check it. And your dropdown is not a list out of the database. It is Unconfirmed or Debunked, and those words have to turn into a true or false on IsDebunked."*
- [ ] 👀 **Watch for:** `The model item passed into the ViewDataDictionary is of type …` — the action or the view is still on the old model; finish both. `CS8602` on `LatinName` — the null check. Check 3 naming the status dropdown — the `Where` needs `c.IsDebunked`, not a comparison with the word. A search that does nothing — the input's `name` and the action's parameter differ
- [ ] **Stop:** the note after **Task 3 in full**. Where they should be: **`Passed: 3`**, and `hodag` finding The Hodag in their browser

## 4 · Pages *(slide 4)*

### The arithmetic

- [ ] 🎞️ **GO TO SLIDE 4** — *A page is Skip and Take* · *"Three to a page. For page 2, I skip the first three rows and take the next three. Page 3 skips six. It is the page number minus one, times the page size."*
- [ ] Still on slide 4, the order line: *"The order is the part to remember. Filter first, or you would search one page. Count next, or you would only know how many are on this page. Sort before you cut, or the database can hand back the rows in any order, and a row can show up on two pages."*

### Three to a page

- [ ] **Swipe to the editor.** Say the goal: *"The page needs to know where it is. So the ViewModel gets three more numbers."* `ViewModels/TruckListViewModel.cs` — select everything and paste:
  ```csharp
  using Curbside.Models;

  namespace Curbside.ViewModels;

  // What the list page needs: this page's trucks, where it is in the list, plus the search that produced
  // them, so the form can show what was typed.
  public class TruckListViewModel
  {
      public List<Truck> Trucks { get; set; } = new();
      public string? Search { get; set; }
      public string? City { get; set; }
      public List<string> Cities { get; set; } = new();
      public int Page { get; set; }
      public int TotalPages { get; set; }
      public int TotalCount { get; set; }
  }
  ```
- [ ] **Say what it is:** *"Which page this is, how many pages there are, and how many trucks matched in total."*
- [ ] Say the goal: *"Now the action. It counts, works out the pages, and cuts the query down."* `Controllers/TrucksController.cs` — just below `private readonly CurbsideContext _context;`:
  ```csharp

      private const int PageSize = 3;
  ```
  Then replace the whole `Index` method again:
  ```csharp
      public IActionResult Index(string? search, string? city, int page = 1)
      {
          // Nothing runs yet: this builds the query, and each Where adds to it.
          var trucks = _context.Trucks
              .Include(t => t.Specials)
              .AsQueryable();

          if (!string.IsNullOrWhiteSpace(search))
          {
              trucks = trucks.Where(t => t.Name.Contains(search)
                                      || t.Cuisine.Contains(search)
                                      || t.City.Contains(search));
          }

          if (!string.IsNullOrEmpty(city))
          {
              trucks = trucks.Where(t => t.City == city);
          }

          // Count what matched, before cutting it down to one page.
          var total = trucks.Count();
          var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)PageSize));
          page = Math.Clamp(page, 1, totalPages);

          return View(new TruckListViewModel
          {
              Trucks = trucks
                  .OrderBy(t => t.Name)
                  .Skip((page - 1) * PageSize)
                  .Take(PageSize)
                  .ToList(),
              Search = search,
              City = city,
              Cities = _context.Trucks.Select(t => t.City).Distinct().OrderBy(c => c).ToList(),
              Page = page,
              TotalPages = totalPages,
              TotalCount = total
          });
      }
  ```
- [ ] **Say what it is, with it on screen:** *"A new page parameter that starts at one. Everything above the Count line is what I already had. The Count runs first. Then the arithmetic, then Skip and Take. Math.Clamp keeps the page number between one and the last page, because anybody can type a page number into the address bar. On SQL Server, page zero would mean a negative offset, and the database refuses that."*
- [ ] Say the goal: *"Last, the links. Previous and Next, and each one carries the search and the city."* `Views/Trucks/Index.cshtml` — select everything and paste:
  ```cshtml
  @model TruckListViewModel
  @{
      ViewData["Title"] = "Trucks";
  }

  <h1>Curbside</h1>
  <p class="text-muted">@Model.TotalCount truck@(Model.TotalCount == 1 ? "" : "s") on the street.</p>

  @if (User.IsInRole("Admin"))
  {
      <a asp-action="Create" class="btn btn-primary mb-4">＋ Add a truck</a>
  }

  <form method="get" class="row g-2 mb-4">
      <div class="col-md-6">
          <input type="search" name="search" value="@Model.Search" class="form-control"
                 placeholder="Name, cuisine or city" aria-label="Search trucks" />
      </div>
      <div class="col-md-4">
          <select name="city" class="form-select" aria-label="Filter by city">
              <option value="">Every city</option>
              @foreach (var city in Model.Cities)
              {
                  <option value="@city" selected="@(city == Model.City)">@city</option>
              }
          </select>
      </div>
      <div class="col-md-2">
          <button class="btn btn-secondary w-100">Search</button>
      </div>
  </form>

  @if (!Model.Trucks.Any())
  {
      <p class="text-muted">No trucks match that.</p>
  }

  <div class="row row-cols-1 row-cols-md-3 g-4">
      @foreach (var truck in Model.Trucks)
      {
          <div class="col">
              <partial name="_TruckCard" model="truck" />
          </div>
      }
  </div>

  @if (Model.TotalPages > 1)
  {
      <nav class="d-flex justify-content-between align-items-center mt-4" aria-label="Pages">
          @if (Model.Page > 1)
          {
              <a asp-route-page="@(Model.Page - 1)" asp-route-search="@Model.Search" asp-route-city="@Model.City"
                 class="btn btn-outline-secondary">← Previous</a>
          }
          else
          {
              <span></span>
          }

          <span class="text-muted">Page @Model.Page of @Model.TotalPages</span>

          @if (Model.Page < Model.TotalPages)
          {
              <a asp-route-page="@(Model.Page + 1)" asp-route-search="@Model.Search" asp-route-city="@Model.City"
                 class="btn btn-outline-secondary">Next →</a>
          }
          else
          {
              <span></span>
          }
      </nav>
  }
  ```
- [ ] **Say what it is:** *"The count at the top now reads the total. Below the cards there is a Previous link, the page number, and a Next link. Each link gets a page number one away from this one, plus the search and the city, through asp-route. Those attributes go into the link's query string."*

### Walk it

- [ ] **Swipe to the browser**, `/Trucks`. 🎯 **Three cards, `8 trucks on the street.`, `Page 1 of 3`.** Click **Next →**: `/Trucks?page=2`. Click **Next →**: page 3 has two cards. *"Eight trucks, three to a page, three pages, and the last one is short."*
- [ ] Say what to look at: *"Every list is in name order now, because of the OrderBy."* Then type **`/Trucks?page=0`** into the address bar. Page 1. Then **`/Trucks?page=99`**. Page 3. *"Math.Clamp. Nobody gets an error for typing a number."*
- [ ] Type `a` in the search box, **Search**. `Page 1 of 3`. Click **Next →**. 🎯 Point at the address bar: **`/Trucks?page=2&search=a`**. *"The link carried the search. Without asp-route-search on it, page 2 would be page 2 of everything, and the search would be gone with no warning."*

## Lab D · Task 4 — 15 minutes

- [ ] Lab README on screen, scrolled to **Task 4 in full**
- [ ] *"Task 4 is three to a page on your Registry, with the same order: Where, Count, OrderBy, Skip, Take. Six creatures gives you two pages."*
- [ ] ⚠️ *"Your links are different from mine. You want a numbered link for every page, so that is a for loop. And every link carries both of your parameters, the search and the status."*
- [ ] 👀 **Watch for:** `Model.Cryptids.Count` still in the heading — check 4 wants `6 creatures on file` on a page of three. The wrong three creatures on page 1 — `OrderBy` is missing or after `Take`. Check 4 naming `search=e` — a page link with no `asp-route-status`. `/Cryptids?page=99` empty — `Math.Clamp`
- [ ] **Stop:** the note after **Task 4 in full**. Where they should be: **`Passed: 4`**, and page 2 of a filtered list still filtered

## ☕ Break

## 5 · Where `_context` comes from *(slides 5–6)*

### Move the query out

- [ ] **Swipe to the editor, `TrucksController.cs`, the `Index` method.** Say the goal: *"Look at this action. It is nearly forty lines, and all it does is read a list. A controller's job is to take a request and hand back a page. So this query is moving into a class of its own, called a service. And that answers a question from week 7, so watch how it gets here."*
- [ ] First, what the service promises. Create `Services/ITruckService.cs` and paste:
  ```csharp
  using Curbside.ViewModels;

  namespace Curbside.Services;

  // What the app can ask of a truck service. Controllers depend on this, not on
  // the class underneath it.
  public interface ITruckService
  {
      TruckListViewModel GetList(string? search, string? city, int page);
  }
  ```
- [ ] **Say what it is:** *"An interface: one method, with no code in it. It says what a truck service can do, and nothing about how. If you have used interfaces in your C# course, this is the same thing."*
- [ ] Now the class that does it. Create `Services/TruckService.cs` and paste:
  ```csharp
  using Microsoft.EntityFrameworkCore;
  using Curbside.Data;
  using Curbside.ViewModels;

  namespace Curbside.Services;

  // The list query, moved out of TrucksController. It asks for the context in its
  // constructor, the same way the controller did.
  public class TruckService : ITruckService
  {
      private const int PageSize = 3;

      private readonly CurbsideContext _context;

      public TruckService(CurbsideContext context)
      {
          _context = context;
      }

      public TruckListViewModel GetList(string? search, string? city, int page)
      {
          // Nothing runs yet: this builds the query, and each Where adds to it.
          var trucks = _context.Trucks
              .Include(t => t.Specials)
              .AsQueryable();

          if (!string.IsNullOrWhiteSpace(search))
          {
              trucks = trucks.Where(t => t.Name.Contains(search)
                                      || t.Cuisine.Contains(search)
                                      || t.City.Contains(search));
          }

          if (!string.IsNullOrEmpty(city))
          {
              trucks = trucks.Where(t => t.City == city);
          }

          // Count what matched, before cutting it down to one page.
          var total = trucks.Count();
          var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)PageSize));
          page = Math.Clamp(page, 1, totalPages);

          return new TruckListViewModel
          {
              Trucks = trucks
                  .OrderBy(t => t.Name)
                  .Skip((page - 1) * PageSize)
                  .Take(PageSize)
                  .ToList(),
              Search = search,
              City = city,
              Cities = _context.Trucks.Select(t => t.City).Distinct().OrderBy(c => c).ToList(),
              Page = page,
              TotalPages = totalPages,
              TotalCount = total
          };
      }
  }
  ```
- [ ] **Say what it is, with it on screen:** *"This is the query from the controller, moved here. The only new part is at the top: this class asks for the context in its constructor, the same way the controller always did."*
- [ ] Say the goal: *"Now the controller gets short. It asks for the service, and the action is one line."* `Controllers/TrucksController.cs`: first add the using at the top:
  ```csharp
  using Curbside.Services;
  ```
  Then replace the field, the `PageSize` line and the constructor with:
  ```csharp
      private readonly CurbsideContext _context;

      // Week 13: the list comes from a service. Same move as the context: ask
      // for it in the constructor, and it is handed over.
      private readonly ITruckService _trucks;

      public TrucksController(CurbsideContext context, ITruckService trucks)
      {
          _context = context;
          _trucks = trucks;
      }
  ```
  Then replace the whole `Index` method:
  ```csharp
      public IActionResult Index(string? search, string? city, int page = 1)
      {
          return View(_trucks.GetList(search, city, page));
      }
  ```
- [ ] ⚠️ **The terminal — the prompt.** It prints `ENC0004: Updating the modifiers of const field requires restarting the application`, then `Do you want to restart your app?` **Answer `a`.** Say why while it restarts: *"Removing that constant is a change hot reload cannot make, so dotnet watch asks to restart. I answer a, for always, and from now on it restarts by itself."*
- [ ] Say what to watch: *"Nothing is left in the controller but one line. Watch the page."* **Swipe to the browser**, reload `/Trucks`. 🎯 **A 500: `Unable to resolve service for type 'Curbside.Services.ITruckService' while attempting to activate 'Curbside.Controllers.TrucksController'`**

### The container *(slide 5)*

- [ ] Point at the message: *"Read that out with me. ASP.NET tried to make a TrucksController. It looked at the constructor, saw it needs an ITruckService, and could not find one. So something has been building my controllers all along, and it has been filling in that constructor."*
- [ ] 🎞️ **GO TO SLIDE 5** — *Where `_context` comes from* · *"Here is the answer from week 7. In Program.cs, AddDbContext puts the context on a list. That list is called the container. When a request needs a controller, ASP.NET looks at its constructor and hands it what it asks for from the container. Nothing in my code has ever said new TrucksController. That is dependency injection."*
- [ ] Still on slide 5, the second row: *"It is the same for last week's seeder. UserManager came from AddIdentity. And the last row is what is missing: nothing has told the container about ITruckService."*
- [ ] **Swipe to the editor.** `Program.cs` — add the using at the top:
  ```csharp
  using Curbside.Services;
  ```
  and paste this **just above `var app = builder.Build();`**:
  ```csharp
  // Week 13: when anything asks for an ITruckService, hand it a TruckService.
  // One per request, the same lifetime AddDbContext gives the context.
  builder.Services.AddScoped<ITruckService, TruckService>();
  ```
- [ ] **Say what it is:** *"One line. When anything asks for an ITruckService, hand it a TruckService."* The terminal restarts by itself — that is the `a`
- [ ] **Swipe to the browser**, reload. 🎯 **Three cards, `Page 1 of 3`.** *"The same page, and the same query. The controller got shorter, and the query has a name."*

### One line changes *(slide 6)*

- [ ] **Swipe to the editor.** Say the goal: *"Why an interface, and not just the class? Here is a second service with the same one method. It returns nothing at all, and it never touches the database. It is a throwaway."* Create `Services/EmptyTruckService.cs` and paste:
  ```csharp
  using Curbside.ViewModels;

  namespace Curbside.Services;

  // A throwaway, to prove a point: same interface, no database.
  public class EmptyTruckService : ITruckService
  {
      public TruckListViewModel GetList(string? search, string? city, int page)
      {
          return new TruckListViewModel { Page = 1, TotalPages = 1 };
      }
  }
  ```
- [ ] `Program.cs` — on the `AddScoped` line, change `TruckService` to `EmptyTruckService`:
  ```csharp
  builder.Services.AddScoped<ITruckService, EmptyTruckService>();
  ```
  The terminal restarts by itself
- [ ] **Swipe to the browser**, reload. 🎯 ***No trucks match that.***
- [ ] 🎞️ **GO TO SLIDE 6** — *Why ask for the interface* · *"I changed one line in Program.cs. I did not open the controller. It asks for ITruckService and it never names a class, so it took whatever it was handed."*
- [ ] Still on slide 6, the last line: *"So a test can hand it a fake one, and tomorrow's version can replace today's, and the controller never hears about it. That is what the interface buys."*
- [ ] **Swipe to the editor.** `Program.cs` — change it back:
  ```csharp
  builder.Services.AddScoped<ITruckService, TruckService>();
  ```
- [ ] **Swipe to the browser**, reload: the trucks are back
- [ ] ⚠️ **Only now**, in the Explorer, delete `Services/EmptyTruckService.cs`. *Measured: deleting it in the same moment as the `Program.cs` save crashed `dotnet watch` on two runs of three; one at a time is clean*

## Lab E · Task 5 — 15 minutes

- [ ] Lab README on screen, scrolled to **Task 5 in full**
- [ ] *"Task 5 moves your list query into a CryptidService behind an ICryptidService, and registers it. Same moves as mine."*
- [ ] ⚠️ *"Then the one I did not show. Your home page has a query of its own, the featured creature. It moves into the same service, so one service has two callers. And when that is done, HomeController has no reason to hold the context at all, so it stops asking for it."*
- [ ] *"Terminal 1 will tell you to press Ctrl+R, or ask to restart. Do what it says, and answer a."*
- [ ] 👀 **Watch for:** every check red at once — `Unable to resolve service`: the `AddScoped` line is missing or below `builder.Build()`. `Press "Ctrl + R" to restart.` ignored — the edit to `Program.cs` isn't live until they press it. `The type or namespace name 'CryptidListViewModel' could not be found` in the service — the `using`. Check 5 saying `HomeController` still asks for the context — remove the field, the parameter and the two usings. **Sweep the room here** — this is tonight's in-class target
- [ ] **Stop:** the note after **Task 5 in full**. Where they should be: **`Passed: 5`** — all five, tonight's in-class target

## 6 · How long one lasts *(slide 7)*

### The wrong word

- [ ] **Swipe to the editor.** `Program.cs`. Say the goal: *"I have said AddScoped twice and not said why. There are three words that could go there. Let me try another one."* Change `AddScoped` to `AddSingleton`:
  ```csharp
  builder.Services.AddSingleton<ITruckService, TruckService>();
  ```
- [ ] 🎯 **The terminal.** The app stops: `Cannot consume scoped service 'Curbside.Data.CurbsideContext' from singleton 'Curbside.Services.ITruckService'`, then `Waiting for a file to change before restarting`. *"It will not even start. That is a useful error. A singleton is one object for the life of the app. It asked for the context, and the context is meant to last for one request."*
- [ ] 🎞️ **GO TO SLIDE 7** — *How long one lasts* · *"This is called a service's lifetime. Transient gives you a new one every time something asks. Scoped gives you one per request, so everything in that request shares it. Singleton gives you one for the whole app, shared by every visitor."*
- [ ] Still on slide 7, the table: *"The context is scoped because it remembers what it has loaded, and that should not leak from one visitor's request into another's. So anything that holds the context is scoped too. That is why it is AddScoped."*
- [ ] Still on slide 7, the last line: *"That also finishes a line from last week. A scope is a request, more or less. At startup there is no request, so the seeder had to make a scope for itself. That is what CreateScope was doing."*
- [ ] **Swipe to the editor.** Change it back:
  ```csharp
  builder.Services.AddScoped<ITruckService, TruckService>();
  ```
  The terminal restarts, because it was waiting for that file. Reload `/Trucks` to show it

## Lab F · Catch up, or the stretch — 25 minutes

- [ ] Lab README on screen, scrolled to **The tasks**
- [ ] *"This is the last block, and it has no stop. If any of your checks are red, finish those first. If you are at five, the stretch adds a sort order to the Registry, and it goes through everything tonight: a parameter, the service, the form and the page links."*
- [ ] *"The stretch has no check and no points. Tonight's in-class target was all five checks. Anything still red is Part 1 of your homework."*
- [ ] 👀 **Watch for:** anyone still red on check 5 — have them read its message first; it names the one thing missing
- [ ] 👀 **Stretch:** the sort lost on page 2 — the third `asp-route`. `The type or namespace name` errors in `ICryptidService` — every caller changes when the signature does, which is the moment to say so
- [ ] **No stop.** This block takes whatever time is left before the wrap-up. Anyone finished: the stretch, **🚀 Done early?** at the bottom of the README, or help a classmate

## 7 · Wrap-up, after the lab *(slide 8)*

- [ ] 🎞️ **GO TO SLIDE 8** — *Tonight, in one picture* · walk the five rows, one sentence each, and give the last row the emphasis: *"Every constructor in your app has been filled in from a list in Program.cs since week 7. If you only remember one row, remember that one."*
- [ ] Homework: **the same four moves on their own app.** *"A message after every change, a search box, pages, and one service with an interface. Your page size has to be smaller than your record count, so there is a second page to look at. With five records, two to a page is fine."*
- [ ] ⚠️ Say what the self-check can't see: *"The self-check only reads your pages. It never signs in, so it leaves you signed in. That also means it cannot see your message, because a message needs a change, and a change needs your role. It cannot see your service either. I read both of those from your repo. So test the message yourself: sign in, change something, read it, reload."*
- [ ] 💡 *"There is no migration this week. Nothing about your tables changed."*
- [ ] 💡 *"My Curbside is on localhost. Nothing is deployed for it. Yours is graded on its Azure URL."*
- [ ] 🔗 Week 14: *"Next week your app starts answering with JSON. That is Web API."*
