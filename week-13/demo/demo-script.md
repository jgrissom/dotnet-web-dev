# Week 13 Demo Script — Curbside Answers in JSON 🌮

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Paste from here; nothing tonight needs typing except a path in the tester.

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
> **Two failures tonight are real and staged by the order of the pastes, and nothing needs undoing.** §4's `A possible object cycle was detected` is the next paste's reason for existing, and §6's `401` with a page of HTML behind it is the reason for §6's `Program.cs` edit. Every step goes forward.

## 0 · Before class

- [ ] ⚠️ **Re-rehearsing this week? Delete `instructor/week-13/Curbside` first** — a rehearsal leaves it in tonight's **end** state, and every beat below starts from week 12's. Deleting the folder in Finder is enough; the next step recreates it
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course/instructor/week-13`, create a new empty **folder** named `Curbside` and open it *(the dialog's **New Folder** button makes `week-13` too, the first time)*. **The folder stays empty — there is no `dotnet new` tonight;** the next step fills it with the starter
- [ ] Integrated terminal (**Ctrl+&#96;**) — fill the empty folder with tonight's starter. This is Curbside as week 12's demo left it: accounts, an Admin role on every write, and one new file, `wwwroot/api-tester.html`:
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-13/demo-starter/Curbside/. .
  ```
  The trailing `/.` copies the *contents* in, so the project lands at the top of the window you already have open — no folder inside a folder

  ⚠️ **That resets the files, not the database and not the secrets.** Curbside's data lives on the school SQL Server, and every copy carries the same `<UserSecretsId>`.
- [ ] **Set your connection string in your copy** — the `<UserSecretsId>` ships in the `.csproj`, so `set` alone is enough, no `init`:
  ```bash
  dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=...;User ID=...;Password=...;TrustServerCertificate=True"
  ```
- [ ] **Set the admin's email**, same terminal:
  ```bash
  dotnet user-secrets set "Admin:Email" "ada@example.com"
  ```
- [ ] ⚠️ **Rebuild the database — before your rehearsal, and again after it:**
  ```bash
  dotnet ef database drop --force
  dotnet ef database update
  ```
  Seven migrations replay. **No new migration tonight** — an API reads and writes the tables you already have
- [ ] **Rehearse the whole script once in a separate copy.** It is the only way to see §4's and §6's failures for yourself before the room does. Stop the rehearsal's `dotnet watch` when you're done — both copies use the same port
- [ ] 🚨 **Then rebuild the database again** — drop, update. Your rehearsal left a truck behind, and §5 counts on the new truck getting id `8`. A separate copy is not a separate database
- [ ] Run it, same terminal:
  ```bash
  dotnet watch
  ```
- [ ] **Register Ada, then Sam.** Browse to `/Account/Register`: **Email** `ada@example.com`, **What should we call you?** `Ada`, `Curbside-2026` in **Password** and again in **Confirm password**. Click **Sign out**. The same form again with `sam@example.com` and `Sam`, then **Sign out**
- [ ] **Press Ctrl+R in the terminal.** The seeder hands out the role at startup, so Ada holds Admin only after a restart that comes after she registers. Sign-in comes later, in §5, so her cookie will carry it
- [ ] ⚠️ **Know the two restarts, and where they come.** There is **no** `Do you want to restart your app?` prompt tonight, because nothing adds a view. New controllers and DTOs hot-reload. **`Program.cs` is the exception, and it comes up twice, in §3 and §6:** the terminal prints `Press "Ctrl + R" to restart.` above `Hot reload succeeded`, and the edit is not live until you press it. *(Measured on a pty-driven `dotnet watch`, one save per paste, on SQL Server.)*
- [ ] **Park four browser tabs**: `/`, `/Trucks`, `/api-tester.html`, and **week 13's lab README** on github.com — it goes on screen for every lab block tonight
- [ ] **Say the no-typing line out loud in the first minute.** Tonight is watched, not typed along with: *"Nothing I type tonight is yours to type. Curbside is my app, and the Registry is yours. Your keyboard time is the lab blocks. There are six of them tonight."*
- [ ] Teaching profile on, notifications off, editor font sized for the back of the room and for a small laptop screen

> [!NOTE]
> **🖥️ On screen, at curtain**
>
> - **VS Code** — left half, `instructor/week-13/Curbside` open, one integrated terminal running `dotnet watch`
> - **Browser** — right half, four tabs: `/` (Curbside's front page, **signed out**), `/Trucks`, `/api-tester.html`, and the week 13 lab README

## 1 · One request, two answers *(slides 1–2)*

- [ ] 🎞️ **GO TO SLIDE 1** — *Week 13 — Web API* · it is still up from the gallery — talk to its list before you swipe away from it: *"Here is tonight. Until now, every answer my app gave was a page for a person to read. Tonight it also answers programs, with data. I will write that first with a controller, then with a minimal API, and compare them. Then one truck with its menu, which breaks in a way worth seeing. Then testing, then who is allowed to change anything, and last, why none of it needs an antiforgery token."*

### What a page is made of

- [ ] **Swipe to the browser, the `/Trucks` tab.** Say the goal: *"This is the list of trucks, for a person. Now let's look at what the server actually sent."* Right-click → **View Page Source**
- [ ] Scroll the source. *"The trucks are in here, somewhere, in between the navbar, the Bootstrap classes and the footer. A person never sees any of that, because the browser turns it into a page. Now imagine you are a program, and all you want is the truck names. You would have to search through all of this to find them."*
- [ ] Close the source tab.

### Same data, no page *(slide 2)*

- [ ] 🎞️ **GO TO SLIDE 2** — *One request, two answers* · *"Here are two answers to the same request. At the top is what you just saw. Underneath is the same truck as JSON: just the data, with a name on each value. That is an API. A web API is a set of addresses that answer with data instead of pages."*
- [ ] 🎯 Still on slide 2, the last line: *"The JSON shape is the object syntax from week 1. Nothing about tonight replaces my pages. The app keeps them, and it gains a second set of addresses, for programs."*
- [ ] **Say why, before anyone asks:** *"You might wonder why my app needs an API, when its pages already show the trucks. For pages that reload every time, they do. An API is for two things a view cannot do. JavaScript on a page can ask it for data and change part of the screen without reloading the page, and that is next week. And anything that is not a web page, like a phone app, can only use an API. Tonight I build the server half."*

## Lab A · Setup and task 1 — 8 minutes

- [ ] Put the **lab README** on screen — the tab you parked in §0 — scrolled to **Setup**
- [ ] *"Tonight the lab comes in six short blocks. After most parts of my demo, you do the same thing to your Registry. Every block but the last ends at a note that says In class, stop here."*
- [ ] *"The first block is setup and task 1. There is no database drop tonight. This starter has the same migrations as last week's, so your database, your account and your curator role all carry over."*
- [ ] *"Sign in with your own email, and check you can see Open a new file on the list. Tonight's in-class target is all five checks."*
- [ ] 👀 **Watch for:** `there is already an object named 'Cryptids'` — they never ran week 12's lab; the warning in Task 1 has the order. `The ConnectionString property has not been initialized` before `Now listening on:` — the secret is gone (a frozen lab PC); task 1 has the commands. `Could not find a MSBuild project file` — terminal 1 or 2 never ran `cd Cryptids.Web`
- [ ] **Stop:** the note after **Task 1 in full**. Where they should be: `dotnet test` prints **`Passed: 1`**, the app is running in terminal 1, and they are signed in as their curator

## 2 · The first endpoint *(slide 3)*

### A controller with no views

- [ ] **Swipe to the editor.** Say the goal: *"I want one address that answers with every truck as JSON. That needs a new controller, next to the one that serves the pages."* Create `Controllers/TrucksApiController.cs` and paste:
  ```csharp
  using Microsoft.AspNetCore.Mvc;
  using Microsoft.EntityFrameworkCore;
  using Curbside.Data;
  using Curbside.Models;

  namespace Curbside.Controllers;

  // Week 13: the same trucks as TrucksController, answered as JSON.
  [ApiController]
  [Route("api/trucks")]
  public class TrucksApiController : ControllerBase
  {
      private readonly CurbsideContext _context;

      public TrucksApiController(CurbsideContext context)
      {
          _context = context;
      }

      // GET /api/trucks
      [HttpGet]
      public async Task<List<Truck>> GetAll()
      {
          return await _context.Trucks.ToListAsync();
      }
  }
  ```
- [ ] **Say what it is, with it on screen:** *"A controller with one action. The route attribute gives it the address api slash trucks. HttpGet says this action answers a GET. It returns the list itself, not a view."*
- [ ] Terminal: `Hot reload succeeded`. A new controller goes live on its own. *(If the next beat is the Missing page, press Ctrl+R in the terminal.)*
- [ ] **Swipe to the browser.** Open a new tab, type **`localhost:5164/api/trucks`** — your port is on the `/` tab. 🎯 **Seven trucks as JSON, and nothing else.** *"That is the response. No html, no css, no javascript. Just data - formatted as JSON."*
- [ ] Point at the first truck's `"name"`: *"My C# property is Name with a capital N, and here it is name with a small n. The JSON serializer does that for me, because JavaScript names start with a lowercase letter."*
- [ ] Point at `"specials":[]`: *"This says Roll Models has no specials, and it does have two. Nothing loaded them, so the list is empty. I am coming back to that."*

### What's different about it *(slide 3)*

- [ ] 🎞️ **GO TO SLIDE 3** — *Two kinds of controller* · *"The controller you know passes data to views. An API controller passes data to applications. Any application that can communicate over HTTP can use an API controller. Here is the controller you know next to the new one. The base class is ControllerBase, because an API has no use for views. The address comes from the route attribute on the class, not from the pattern in Program.cs. And the action returns data."*
- [ ] 🎯 Still on slide 3, the last line: *"ApiController is a small attribute that changes a lot. You are going to see it answer three problems tonight without my writing any code for them."*

## 3 · The same thing, minimal *(slide 4)*

- [ ] **Swipe to the editor.** Say the goal: *"There is a second way to write an endpoint, with no class at all. I want one small address that answers with how many trucks there are."* Open `Program.cs`, select everything and paste:
  ```csharp
  using Microsoft.AspNetCore.Identity;
  using Microsoft.EntityFrameworkCore;
  using Curbside.Data;
  using Curbside.Models;

  var builder = WebApplication.CreateBuilder(args);

  // Add services to the container.
  builder.Services.AddControllersWithViews();

  // The database. One registration: which context, which provider, which server.
  // The connection string lives in user secrets — never in this file.
  builder.Services.AddDbContext<CurbsideContext>(options =>
      options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

  // Identity: the users, and the cookie that remembers who is signed in.
  builder.Services.AddIdentity<AppUser, IdentityRole>()
      .AddEntityFrameworkStores<CurbsideContext>();

  var app = builder.Build();

  // Week 12: the Admin role, and who holds it. Runs once, at startup.
  using (var scope = app.Services.CreateScope())
  {
      await RoleSeeder.SeedAsync(scope.ServiceProvider);
  }

  // Configure the HTTP request pipeline.
  if (!app.Environment.IsDevelopment())
  {
      app.UseExceptionHandler("/Home/Error");
  }
  // A wrong id, or a URL nobody recognizes, used to be a blank browser page.
  // This re-runs the request through /Home/Missing and keeps the 404 status.
  app.UseStatusCodePagesWithReExecute("/Home/Missing");

  app.UseRouting();

  app.UseAuthentication();
  app.UseAuthorization();

  app.MapStaticAssets();

  app.MapControllerRoute(
      name: "default",
      pattern: "{controller=Home}/{action=Index}/{id?}")
      .WithStaticAssets();

  // Week 13: a minimal API endpoint. The same kind of answer as a controller
  // action, in one statement, with no class around it.
  app.MapGet("/api/trucks/count", async (CurbsideContext db) =>
      new { count = await db.Trucks.CountAsync() });

  app.Run();
  ```
- [ ] **Say what it is, with it on screen:** *"Near the bottom, MapGet. It takes an address and a function. The function asks for the context, and whatever it returns becomes the JSON. That is the entire endpoint."*
- [ ] ⚠️ **Terminal: `Press "Ctrl + R" to restart.`, above `Hot reload succeeded`.** Press **Ctrl+R**. Say why while it restarts: *"Program.cs runs once, when the app starts, and hot reload cannot run it again. So this line is not live until the app restarts. The terminal is telling me to press Ctrl+R."*
- [ ] **Browser:** the JSON tab, change the address to **`/api/trucks/count`**. 🎯 **`{"count":7}`**. *"Seven trucks. The new endpoint counted them in the database."*
- [ ] 🎞️ **GO TO SLIDE 4** — *Two ways to write an endpoint* · *"The same kind of answer, both ways. At the top, an action, inside a class with a constructor. Underneath, one statement. They run on the same app, and my context reaches both."*
- [ ] 🎯 Still on slide 4, the table: *"When there is one small endpoint, minimal is shorter. When there are five that share a route, a context and a rule about who may use them, a controller keeps them together. Tonight the trucks are a controller and the count is minimal. Do the same in your own work: a controller for several endpoints, minimal for one."*

## Lab B · Task 2 — 10 minutes

- [ ] Lab README on screen, scrolled to **Task 2 in full**
- [ ] *"Task 2 is the archive as JSON. A controller for the list, and a minimal endpoint for the count, the same as mine. When it works, look at the sightings on each creature in the list, and compare The Hodag's with its page."*
- [ ] ⚠️ *"When you save Program.cs, terminal 1 says Press Ctrl+R. Press it, or the count is not live."*
- [ ] 👀 **Watch for:** `404` on `/api/cryptids/count` over a correct `Program.cs` — they haven't pressed Ctrl+R. A `500` with `A possible object cycle was detected` — they added an `Include` the README doesn't have; take it out, task 3 brings the reports in. The Not on file page at `/api/cryptids` — the new controller needs a Ctrl+R
- [ ] **Stop:** the note after **Task 2 in full**. Where they should be: **`Passed: 2`**, and JSON in the address bar at `/api/cryptids`

## ☕ Break

## 4 · One truck, with its menu *(slide 5)*

### The cycle

- [ ] **Swipe to the editor.** Say the goal: *"Now one truck, with its specials. Earlier, the specials came back empty. I want the real ones. The Details page already knows how to load a truck with Include, so I will use the same query."* Open `Controllers/TrucksApiController.cs`, select everything and paste:
  ```csharp
  using Microsoft.AspNetCore.Mvc;
  using Microsoft.EntityFrameworkCore;
  using Curbside.Data;
  using Curbside.Models;

  namespace Curbside.Controllers;

  // Week 13: the same trucks as TrucksController, answered as JSON.
  [ApiController]
  [Route("api/trucks")]
  public class TrucksApiController : ControllerBase
  {
      private readonly CurbsideContext _context;

      public TrucksApiController(CurbsideContext context)
      {
          _context = context;
      }

      // GET /api/trucks
      [HttpGet]
      public async Task<List<Truck>> GetAll()
      {
          return await _context.Trucks.ToListAsync();
      }

      // GET /api/trucks/2
      [HttpGet("{id:int}")]
      public async Task<ActionResult<Truck>> GetOne(int id)
      {
          var truck = await _context.Trucks
              .Include(t => t.Specials)
                  .ThenInclude(s => s.Dish)
              .FirstOrDefaultAsync(t => t.Id == id);

          if (truck == null)
          {
              return NotFound();
          }

          return truck;
      }
  }
  ```
- [ ] **Say what it is:** *"A second action. The id in the HttpGet attribute is part of the address, and the colon int means it has to be a whole number. The return type says this action can give back a truck, or a status like 404. Include loads the specials, and then the dish on each one."*
- [ ] **Swipe to the browser.** Change the address to **`/api/trucks/2`**. 🎯 The error page: **`JsonException: A possible object cycle was detected`**
- [ ] 🎞️ **GO TO SLIDE 5** — *The loop in the JSON* · *"Here is what the serializer did. It started writing truck two, and reached its specials. Each special has a Truck property, which I filled with Include. So it wrote the truck again, reached its specials, and went round again. Thirty-two levels deep, it gave up."*
- [ ] Still on slide 5, the second half: *"The fix is not a setting. My model class is the shape of my tables, and the JSON is what other programs depend on. Those should be two different classes. A class whose only job is the shape of the JSON is called a DTO, a data transfer object. It is a ViewModel for a program."*

### Two DTOs

- [ ] **Swipe to the editor.** Say the goal: *"Two small classes. One says what a special looks like in my JSON, and one says what a truck looks like."* Create `Dtos/SpecialDto.cs` and paste:
  ```csharp
  namespace Curbside.Dtos;

  // One line of a truck's menu, as the API says it. The dish's name instead of
  // a Dish object, and no way back to the truck.
  public class SpecialDto
  {
      public string Dish { get; set; } = "";
      public decimal Price { get; set; }
      public string ServedOn { get; set; } = "";
  }
  ```
- [ ] **Say what it is:** *"The name of the dish, the price and the day. There is no Truck property on it, so there is nothing to loop through."*
- [ ] Create `Dtos/TruckDto.cs` and paste:
  ```csharp
  namespace Curbside.Dtos;

  // What the API says about a truck. A DTO is a class whose only job is the
  // shape of the JSON, so the JSON stops being whatever the table looks like.
  public class TruckDto
  {
      public int Id { get; set; }
      public string Name { get; set; } = "";
      public string Cuisine { get; set; } = "";
      public string City { get; set; } = "";
      public double Rating { get; set; }
      public bool IsOpenLate { get; set; }
      public string? Slogan { get; set; }
      public List<SpecialDto> Specials { get; set; } = new();
  }
  ```
- [ ] **Say what it is:** *"Everything about a truck that I want in the JSON, and a list of SpecialDto."*
- [ ] Say the goal for the next paste: *"Now both actions build those instead of returning the model."* `Controllers/TrucksApiController.cs` — select everything and paste:
  ```csharp
  using Microsoft.AspNetCore.Mvc;
  using Microsoft.EntityFrameworkCore;
  using Curbside.Data;
  using Curbside.Dtos;
  using Curbside.Models;

  namespace Curbside.Controllers;

  // Week 13: the same trucks as TrucksController, answered as JSON.
  [ApiController]
  [Route("api/trucks")]
  public class TrucksApiController : ControllerBase
  {
      private readonly CurbsideContext _context;

      public TrucksApiController(CurbsideContext context)
      {
          _context = context;
      }

      // GET /api/trucks
      [HttpGet]
      public async Task<List<TruckDto>> GetAll()
      {
          var trucks = await _context.Trucks
              .Include(t => t.Specials)
                  .ThenInclude(s => s.Dish)
              .ToListAsync();

          return trucks.Select(ToDto).ToList();
      }

      // GET /api/trucks/2
      [HttpGet("{id:int}")]
      public async Task<ActionResult<TruckDto>> GetOne(int id)
      {
          var truck = await _context.Trucks
              .Include(t => t.Specials)
                  .ThenInclude(s => s.Dish)
              .FirstOrDefaultAsync(t => t.Id == id);

          if (truck == null)
          {
              return NotFound();
          }

          return ToDto(truck);
      }

      private static TruckDto ToDto(Truck truck) => new TruckDto
      {
          Id = truck.Id,
          Name = truck.Name,
          Cuisine = truck.Cuisine,
          City = truck.City,
          Rating = truck.Rating,
          IsOpenLate = truck.IsOpenLate,
          Slogan = truck.Slogan,
          Specials = truck.Specials
              .Select(s => new SpecialDto { Dish = s.Dish!.Name, Price = s.Price, ServedOn = s.ServedOn })
              .ToList()
      };
  }
  ```
- [ ] **Say what it is:** *"Both actions now load the specials, and hand back DTOs. ToDto at the bottom copies a truck into a TruckDto, one property at a time. Nothing else in the app changes."*
- [ ] **Browser, `/api/trucks/2`.** 🎯 **Cheese Curd Cartel, with three specials, each with a dish name.** *"No loop, and the JSON says exactly what I chose."*
- [ ] **Browser, `/api/trucks/999`.** *"There is no truck 999, so the action returned NotFound. That is a 404. Its details came back as JSON, not as my Missing page, and that is the first thing ApiController did for me."*

## Lab C · Task 3 — 14 minutes

- [ ] Lab README on screen, scrolled to **Task 3 in full**
- [ ] *"Task 3 is one creature with its reports, and a list that says how many reports each creature has, instead of an empty list. Try the query first with no DTO, if you want to see the error for yourself. Then three DTOs, and the controller replaced with the README's version."*
- [ ] 👀 **Watch for:** `sightings` still on the list, with no `reportCount` — the controller wasn't replaced, so `GetAll` still returns `Cryptid`. `reportCount` of `0`, or `sightings` an empty array — no `Include` on that query. Still `A possible object cycle was detected` — the action still returns `Cryptid`, or a DTO carries a `Cryptid` property. `The type or namespace name 'CryptidDetailsDto' could not be found` — the `using Cryptids.Web.Dtos;` at the top
- [ ] **Stop:** the note after **Task 3 in full**. Where they should be: **`Passed: 3`**, The Hodag at `/api/cryptids/1` with three reports, and a `reportCount` on every creature at `/api/cryptids`

## 5 · Testing a write *(slide 6)*

### The tester

- [ ] **Swipe to the browser, the tab you parked in §0 at `localhost:5164/api-tester.html`** — if it isn't there, open that address in a new tab. It's the tester page in Curbside's `wwwroot`, which came with the starter. Say the goal: *"The address bar can only send a GET. To test a write, I need something that sends a POST with JSON in it. You have no extra software to install for this. This page is one file in wwwroot, and it is already in your lab."*
- [ ] Leave **GET**, type **`/api/trucks/2`**, click **Send**. **`200 OK`**, then `application/json`, then the truck. *"One request, from this browser. The status is at the top, then the type of what came back, then the body. It runs in my browser, so if I am signed in here, my cookie goes with it."*

### POST

- [ ] **Sign in** as `ada@example.com` with `Curbside-2026` on the `/` tab. Say the goal: *"Ada can add a truck through the pages. I want her to be able to do it through the API, and nobody else."*
- [ ] **Swipe to the editor.** Say the goal: *"A POST needs a class for what it accepts. TruckDto says what goes out. This new class says what is allowed to come in."* Create `Dtos/TruckInput.cs` and paste:
  ```csharp
  using System.ComponentModel.DataAnnotations;

  namespace Curbside.Dtos;

  // What the API accepts for a truck. The same rules as the Truck class, and
  // only the properties a client may send: no Id, and no Specials.
  public class TruckInput
  {
      [Required(ErrorMessage = "Every truck needs a name.")]
      [StringLength(50, MinimumLength = 2)]
      public string Name { get; set; } = "";

      [Required]
      [StringLength(30)]
      public string Cuisine { get; set; } = "";

      [Required]
      public string City { get; set; } = "";

      [Range(1, 5, ErrorMessage = "Ratings run from {1} to {2}.")]
      public double Rating { get; set; }

      public bool IsOpenLate { get; set; }

      [StringLength(80)]
      public string? Slogan { get; set; }
  }
  ```
- [ ] **Say what it is:** *"The same validation attributes as the Truck class, and only what a client is allowed to send. There is no Id, and no Specials."*
- [ ] Say the goal for the next paste: *"Now the POST itself, and the rule about who may use it, which is the same rule as the pages."* `Controllers/TrucksApiController.cs` — select everything and paste:
  ```csharp
  using Microsoft.AspNetCore.Authorization;
  using Microsoft.AspNetCore.Mvc;
  using Microsoft.EntityFrameworkCore;
  using Curbside.Data;
  using Curbside.Dtos;
  using Curbside.Models;

  namespace Curbside.Controllers;

  // Week 13: the same trucks as TrucksController, answered as JSON. Every action
  // needs the Admin role, except the two that only read.
  [ApiController]
  [Route("api/trucks")]
  [Authorize(Roles = "Admin")]
  public class TrucksApiController : ControllerBase
  {
      private readonly CurbsideContext _context;

      public TrucksApiController(CurbsideContext context)
      {
          _context = context;
      }

      // GET /api/trucks
      [AllowAnonymous]
      [HttpGet]
      public async Task<List<TruckDto>> GetAll()
      {
          var trucks = await _context.Trucks
              .Include(t => t.Specials)
                  .ThenInclude(s => s.Dish)
              .ToListAsync();

          return trucks.Select(ToDto).ToList();
      }

      // GET /api/trucks/2
      [AllowAnonymous]
      [HttpGet("{id:int}")]
      public async Task<ActionResult<TruckDto>> GetOne(int id)
      {
          var truck = await _context.Trucks
              .Include(t => t.Specials)
                  .ThenInclude(s => s.Dish)
              .FirstOrDefaultAsync(t => t.Id == id);

          if (truck == null)
          {
              return NotFound();
          }

          return ToDto(truck);
      }

      // POST /api/trucks
      // [ApiController] has already refused anything that breaks TruckInput's
      // rules, with a 400, so there is no ModelState check here.
      [HttpPost]
      public async Task<ActionResult<TruckDto>> Create(TruckInput input)
      {
          var truck = new Truck
          {
              Name = input.Name,
              Cuisine = input.Cuisine,
              City = input.City,
              Rating = input.Rating,
              IsOpenLate = input.IsOpenLate,
              Slogan = input.Slogan
          };

          _context.Trucks.Add(truck);
          await _context.SaveChangesAsync();

          return CreatedAtAction(nameof(GetOne), new { id = truck.Id }, ToDto(truck));
      }

      private static TruckDto ToDto(Truck truck) => new TruckDto
      {
          Id = truck.Id,
          Name = truck.Name,
          Cuisine = truck.Cuisine,
          City = truck.City,
          Rating = truck.Rating,
          IsOpenLate = truck.IsOpenLate,
          Slogan = truck.Slogan,
          Specials = truck.Specials
              .Select(s => new SpecialDto { Dish = s.Dish!.Name, Price = s.Price, ServedOn = s.ServedOn })
              .ToList()
      };
  }
  ```
- [ ] **Say what it is:** *"The Authorize attribute with the Admin role is on the class, and AllowAnonymous is on the two GETs, the same shape as TrucksController. The POST takes a TruckInput, builds a Truck, saves it, and answers with CreatedAtAction: a 201, and the address of the new truck."*
- [ ] **Tester.** Pick **POST**, type **`/api/trucks`**, paste this in the box, **Send**:
  ```json
  { "name": "Lake Effect Lunch", "cuisine": "Soup", "city": "Sheboygan", "rating": 4.3 }
  ```
  🎯 **`201 Created`**, `Location: …/api/trucks/8`, and the new truck with `"id": 8`. *"201 means created. The Location header gives the new truck's address. And there is no redirect, because a program has no use for one."*
- [ ] **The `/Trucks` tab, reload.** Eight cards. *"Same table, same data. The API and the pages both read the Trucks table."*

### Bad JSON

- [ ] Say the goal: *"Now something that breaks the rules. Look at the POST again: there is no check of ModelState in it."* **Tester**, replace the box with this, **Send**:
  ```json
  { "name": "X", "rating": 9 }
  ```
  🎯 **`400 Bad Request`**, and an `errors` object naming each field. *"That is the second thing ApiController did for me. It ran the rules on TruckInput and answered before my action started. A program can read those errors and show them."*
- [ ] Say the goal: *"Last one. This time I send an id, and a list of specials, which TruckInput does not have."* **Tester**, replace the box with this, **Send**:
  ```json
  { "id": 1, "name": "Week Thirteen Wagon", "cuisine": "Test", "city": "Waukesha", "rating": 3, "specials": [{ "price": 5 }] }
  ```
  🎯 **`201`**, `"id": 9`, `"specials": []`. *"Both were ignored. TruckInput does the job of week 8's Bind list, for JSON. If the POST had taken a Truck, a client could set any property on it, including related rows."*

### The status is the answer *(slide 6)*

- [ ] 🎞️ **GO TO SLIDE 6** — *Verbs and statuses* · *"A page tells a person what happened in words. An API tells a program with a number. Here are the statuses a working API answers with. You have seen four of them, and you are about to see the other three. A program reads this number first, before it looks at anything else."*
- [ ] Still on slide 6, the verbs: *"In week 3 I said PUT and DELETE would wait for the Web API. Tonight is when they arrive. One address, api slash trucks slash 2, takes a GET, a PUT and a DELETE. The verb says what to do to that truck."*

## Lab D · Task 4 — 15 minutes

- [ ] Lab README on screen, scrolled to **Task 4 in full**
- [ ] *"Task 4 is the Registry's public half. Anybody can file a report through the API, with no sign-in, so this controller has no Authorize attribute. It takes a SightingInput, and it answers with a 201."*
- [ ] ⚠️ *"There is one thing mine did not need. A report names a creature by its number, and your rules cannot know which creatures exist. So your POST looks the creature up first, and answers with a 400 if it is not there. Without that, SQL Server refuses the row and your API answers with a 500."*
- [ ] *"Test it with the tester in your own app. The README has the JSON."*
- [ ] 👀 **Watch for:** a `500` on a good-looking report — a bad `cryptidId`, and the lookup is missing. `400` naming `SeenOn` — the date needs to be in the JSON. `415 Unsupported Media Type` — they sent the request some way other than the tester, with no `Content-Type: application/json`. A report that saves with the year 1 — `SeenOn` is a plain `DateTime`
- [ ] **Stop:** the note after **Task 4 in full**. Where they should be: **`Passed: 4`**, and a `201` in their tester

## ☕ Break

## 6 · Who may write *(slide 7)*

### PUT and DELETE

- [ ] **Swipe to the editor.** Say the goal: *"Two more verbs. PUT changes a truck, and DELETE removes one."* `Controllers/TrucksApiController.cs` — select everything and paste:
  ```csharp
  using Microsoft.AspNetCore.Authorization;
  using Microsoft.AspNetCore.Mvc;
  using Microsoft.EntityFrameworkCore;
  using Curbside.Data;
  using Curbside.Dtos;
  using Curbside.Models;

  namespace Curbside.Controllers;

  // Week 13: the same trucks as TrucksController, answered as JSON. Every action
  // needs the Admin role, except the two that only read.
  [ApiController]
  [Route("api/trucks")]
  [Authorize(Roles = "Admin")]
  public class TrucksApiController : ControllerBase
  {
      private readonly CurbsideContext _context;

      public TrucksApiController(CurbsideContext context)
      {
          _context = context;
      }

      // GET /api/trucks
      [AllowAnonymous]
      [HttpGet]
      public async Task<List<TruckDto>> GetAll()
      {
          var trucks = await _context.Trucks
              .Include(t => t.Specials)
                  .ThenInclude(s => s.Dish)
              .ToListAsync();

          return trucks.Select(ToDto).ToList();
      }

      // GET /api/trucks/2
      [AllowAnonymous]
      [HttpGet("{id:int}")]
      public async Task<ActionResult<TruckDto>> GetOne(int id)
      {
          var truck = await _context.Trucks
              .Include(t => t.Specials)
                  .ThenInclude(s => s.Dish)
              .FirstOrDefaultAsync(t => t.Id == id);

          if (truck == null)
          {
              return NotFound();
          }

          return ToDto(truck);
      }

      // POST /api/trucks
      // [ApiController] has already refused anything that breaks TruckInput's
      // rules, with a 400, so there is no ModelState check here.
      [HttpPost]
      public async Task<ActionResult<TruckDto>> Create(TruckInput input)
      {
          var truck = new Truck
          {
              Name = input.Name,
              Cuisine = input.Cuisine,
              City = input.City,
              Rating = input.Rating,
              IsOpenLate = input.IsOpenLate,
              Slogan = input.Slogan
          };

          _context.Trucks.Add(truck);
          await _context.SaveChangesAsync();

          return CreatedAtAction(nameof(GetOne), new { id = truck.Id }, ToDto(truck));
      }

      // PUT /api/trucks/2
      [HttpPut("{id:int}")]
      public async Task<IActionResult> Update(int id, TruckInput input)
      {
          var truck = await _context.Trucks.FindAsync(id);
          if (truck == null)
          {
              return NotFound();
          }

          truck.Name = input.Name;
          truck.Cuisine = input.Cuisine;
          truck.City = input.City;
          truck.Rating = input.Rating;
          truck.IsOpenLate = input.IsOpenLate;
          truck.Slogan = input.Slogan;

          await _context.SaveChangesAsync();
          return NoContent();
      }

      // DELETE /api/trucks/2
      [HttpDelete("{id:int}")]
      public async Task<IActionResult> Delete(int id)
      {
          var truck = await _context.Trucks.FindAsync(id);
          if (truck == null)
          {
              return NotFound();
          }

          _context.Trucks.Remove(truck);
          await _context.SaveChangesAsync();
          return NoContent();
      }

      private static TruckDto ToDto(Truck truck) => new TruckDto
      {
          Id = truck.Id,
          Name = truck.Name,
          Cuisine = truck.Cuisine,
          City = truck.City,
          Rating = truck.Rating,
          IsOpenLate = truck.IsOpenLate,
          Slogan = truck.Slogan,
          Specials = truck.Specials
              .Select(s => new SpecialDto { Dish = s.Dish!.Name, Price = s.Price, ServedOn = s.ServedOn })
              .ToList()
      };
  }
  ```
- [ ] **Say what it is:** *"PUT loads the truck, copies the input across, and saves. DELETE loads it and removes it. Both answer with a 404 if the truck is not there. When they work they answer 204, which means it worked, and there is nothing to send back."*
- [ ] **Tester**, still signed in as Ada. **PUT**, **`/api/trucks/8`**, paste this, **Send**:
  ```json
  { "name": "Lake Effect Lunch", "cuisine": "Soup", "city": "Sheboygan", "rating": 4.5, "isOpenLate": true }
  ```
  **`204 No Content`**. *"The rating changed, and the body is empty."*
- [ ] **DELETE**, **`/api/trucks/9`**, **Send**. **`204`**. **Send** again. **`404`**. *"The first one removed it. The second found nothing to remove."*

### Three visitors

- [ ] Say the goal: *"Now, who is allowed to do this? Ada is. Let's see who is not."* On the `/` tab, **Sign out**. **Tester:** **DELETE**, **`/api/trucks/999`**, **Send**. 🎯 **`401 Unauthorized`**, `text/html`, and a page of HTML in the reply
- [ ] ⚠️ **If that says `404 Not Found`, the role on the class never applied** — the request reached the action, and truck 999 is there so that nothing is lost when this happens. Hot reload applied this attribute in both measured runs, but an attribute is the kind of edit it can report as applied when it isn't. Press **Ctrl+R** in the terminal and **Send** again. Say why: *"The new attribute was not applied yet. Hot reload does not always apply a change to an attribute. A restart always does."*
- [ ] Point at the status: *"Last week, a visitor who was not signed in went to the sign-in page. This is an API, so ApiController changed that into a 401. That is the third thing it did for me."*
- [ ] **Ask — the answer is last week's AccessDenied beat:** *"The status is right. Now look at the body. It is a whole page of HTML. Scroll down: Keep on Truckin'. Which part of my app put that there?"* Take the answer: *"The Missing page from week 10. It answers every status with no body, and that includes this one."*
- [ ] **Sign in** as `sam@example.com` with `Curbside-2026`. **Tester**, the same DELETE, **Send**. **`403 Forbidden`**, and the same HTML. *"Sam is signed in without the role, so that is a 403, with the same page of HTML behind it."*
- [ ] 🎞️ **GO TO SLIDE 7** — *A page redirects. An API answers.* · *"Here are the same three visitors as last week, and what each one gets from a page and from the API. A page sends you somewhere. An API tells you a number."*
- [ ] Still on slide 7, the third row: *"Ada's writes work because she signed in through my form, and her browser sends that cookie with every request to this site. The tester runs in her browser, on this site, so it gets the cookie too. Any application can read this API. An application that is not a browser on this site, like a phone app, has no cookie. To write, it sends a JWT in an Authorization header instead: a signed string that says who it is. That is next semester."*
- [ ] 🎯 Still on slide 7, the last line: *"A program that gets a 401 wants the status, and nothing else. It cannot do anything with my HTML. So the Missing page has to stay out of the API's answers."*

### Keep the Missing page off the API

- [ ] **Swipe to the editor.** Say the goal: *"The Missing page is for people. I want it to answer every address except the ones that start with api."* Open `Program.cs`, select everything and paste:
  ```csharp
  using Microsoft.AspNetCore.Identity;
  using Microsoft.EntityFrameworkCore;
  using Curbside.Data;
  using Curbside.Models;

  var builder = WebApplication.CreateBuilder(args);

  // Add services to the container.
  builder.Services.AddControllersWithViews();

  // The database. One registration: which context, which provider, which server.
  // The connection string lives in user secrets — never in this file.
  builder.Services.AddDbContext<CurbsideContext>(options =>
      options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

  // Identity: the users, and the cookie that remembers who is signed in.
  builder.Services.AddIdentity<AppUser, IdentityRole>()
      .AddEntityFrameworkStores<CurbsideContext>();

  var app = builder.Build();

  // Week 12: the Admin role, and who holds it. Runs once, at startup.
  using (var scope = app.Services.CreateScope())
  {
      await RoleSeeder.SeedAsync(scope.ServiceProvider);
  }

  // Configure the HTTP request pipeline.
  if (!app.Environment.IsDevelopment())
  {
      app.UseExceptionHandler("/Home/Error");
  }
  // A wrong id, or a URL nobody recognizes, used to be a blank browser page.
  // This re-runs the request through /Home/Missing and keeps the 404 status.
  // Week 13: pages only. Under /api, a status is the whole answer, and a page
  // of HTML in the body is no use to a program.
  app.UseWhen(context => !context.Request.Path.StartsWithSegments("/api"), pages =>
      pages.UseStatusCodePagesWithReExecute("/Home/Missing"));

  app.UseRouting();

  app.UseAuthentication();
  app.UseAuthorization();

  app.MapStaticAssets();

  app.MapControllerRoute(
      name: "default",
      pattern: "{controller=Home}/{action=Index}/{id?}")
      .WithStaticAssets();

  // Week 13: a minimal API endpoint. The same kind of answer as a controller
  // action, in one statement, with no class around it.
  app.MapGet("/api/trucks/count", async (CurbsideContext db) =>
      new { count = await db.Trucks.CountAsync() });

  app.Run();
  ```
- [ ] **Say what it is, with it on screen:** *"UseStatusCodePages is the same line as week 10, now inside UseWhen. UseWhen runs that line only when the path does not start with api."*
- [ ] ⚠️ **Terminal: `Press "Ctrl + R" to restart.`** Press **Ctrl+R**. *"Program.cs runs once, at startup, so this edit needs Ctrl+R too."*
- [ ] **Tester**, the same DELETE to `/api/trucks/999`, **Send**. Sam's cookie is still good. 🎯 **`403 Forbidden`**, `no Content-Type: the body is empty`. *"Just the status, which is what a program wants."*
- [ ] On the `/` tab, **Sign out**. **Tester**, **Send**. 🎯 **`401`**, empty. *"Signed out, a 401 and an empty body."*
- [ ] Change the address in the browser's own bar to **`/nope`**. ***Keep on Truckin' 🌮.*** *"And people still get the Missing page."*

## Lab E · Task 5 — 15 minutes

- [ ] Lab README on screen, scrolled to **Task 5 in full**
- [ ] *"Task 5 puts the rule from my trucks on your archive. PUT and DELETE, the Curator role on the class, AllowAnonymous on the two GETs, and the Missing page kept off the API."*
- [ ] ⚠️ *"Here is the one to look out for. Your CryptidInput has no ImageUrl, so a PUT must not touch the plate. Load the creature and copy the five properties across. Check 5 fails if the plate is gone."*
- [ ] *"Program.cs needs a Ctrl+R, the same as task 2."*
- [ ] 👀 **Watch for:** check 5 saying a `200` or `204` got through — the role isn't on the class, or `[AllowAnonymous]` is on the writes. A curator refused with `403` — their cookie is older than their role, or the spelling isn't `Curator`. The plate gone after a PUT — they used `_context.Update(new Cryptid …)`. HTML still behind a `401` — no Ctrl+R after the `Program.cs` edit. **Sweep the room here** — this is tonight's in-class target
- [ ] **Stop:** the note after **Task 5 in full**. Where they should be: **`Passed: 5`** — all five, tonight's in-class target

## 7 · Why no token *(slide 8)*

- [ ] 🎞️ **GO TO SLIDE 8** — *Why no token?* · *"You may have noticed something. Every POST since week 6 has had ValidateAntiForgeryToken on it. Ada's POST tonight had no token, and it worked. Here is why that is safe."*
- [ ] Still on slide 8, the first row: *"The token stops another website from posting one of my forms with your cookie. An HTML form cannot send JSON. If a form tries, the action answers with a 415, and nothing runs."*
- [ ] Still on slide 8, the other two rows: *"The sign-in cookie is marked SameSite Lax, so the browser does not attach it to a POST that starts on another site. And JavaScript on another site that tries to send JSON gets stopped by the browser, because this app never gave that site permission."*
- [ ] 🎯 Still on slide 8, the last line: *"So the pages keep their tokens, and the API does not use them. If you put ValidateAntiForgeryToken on an API action, your own POST gets a 400, because a program has no form to read a token from."*

## Lab F · Catch up, or the stretch — 38 minutes

- [ ] Lab README on screen, scrolled to **The tasks**
- [ ] *"This is the last block, and it has no stop. If any of your checks are red, finish those first. If you are at five, the stretch after task 5 in the README is a POST for curators, the same as mine."*
- [ ] *"The stretch has no check and no points. Tonight's in-class target was all five checks. Anything still red is Part 1 of your homework."*
- [ ] 👀 **Watch for:** anyone still red on check 5 — have them read the message; it names the visitor and the verb
- [ ] 👀 **Stretch:** a `403` for the curator — the cookie is older than the role; sign out and back in
- [ ] **No stop.** This block takes whatever time is left before the wrap-up. Anyone finished: the stretch, **🚀 Done early?** at the bottom of the README, or help a classmate

## 8 · Wrap-up, after the lab *(slide 9)*

- [ ] 🎞️ **GO TO SLIDE 9** — *Tonight, in one picture* · walk the rows, one sentence each, and give the DTO row the emphasis: *"A DTO is what your API sends. Your model is how you store it. Keep those two apart, and you can change one without breaking the other."*
- [ ] Homework: **the same moves on their own app.** *"Your list as JSON, one record with its related rows, a count with a minimal endpoint, and a POST and a DELETE that need your role. If your list page is slash Trails, your API is slash api slash trails."*
- [ ] ⚠️ Say what the self-check can't see, and what it does to your browser: *"The self-check changes none of your data. It sends broken JSON and an id that cannot exist. So it cannot see your admin succeed. The homework's last step is yours: sign in as your admin on Azure, open the tester, and send a real POST and a real DELETE. And when the check finishes, your browser is signed out, the same as last week."*
- [ ] 💡 *"When the self-check runs, the console shows red lines."* They say `Failed to load resource`. *"Those are the refusals it asked for. Read the report, not the red lines."*
- [ ] 💡 *"My Curbside is on localhost. Nothing is deployed for it. Yours is graded on its Azure URL."*
- [ ] 🔗 Week 14: *"Next week your own JavaScript calls this API."*
