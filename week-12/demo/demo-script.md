# Week 12 Demo Script — Curbside Gets an Admin 🔒

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Paste from here; the only thing tonight worth typing is §2's attribute.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-12/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it is due. Everything that is not a 🎞️ line happens in the other state, so **you do not need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

> [!IMPORTANT]
> **Tonight the lab comes in seven short blocks, one after each part of the demo that it practices.** Each block has its own `## Lab` section below — what to say, what to watch for, and the README note it stops at. The lab README goes on screen for every block. There is no lab slide.

> [!IMPORTANT]
> **Nothing tonight gets broken and put back.** Every change is forward. There are three surprises, and none is staged: §2's page that doesn't exist (Identity sends Sam to a page nobody has written), §4's refusal after the role is granted (Ada's cookie is older than her role), and §5's address bar (a hidden button doesn't stop Sam typing the URL). If you lose your place, nothing needs undoing.

## 0 · Before class

- [ ] ⚠️ **Re-rehearsing this week? Delete `instructor/week-12/Curbside` first** — a rehearsal leaves it in tonight's **end** state, and every beat below starts from week 11's. Deleting the folder in Finder is enough; the next step recreates it
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course/instructor/week-12`, create a new empty **folder** named `Curbside` and open it *(the dialog's **New Folder** button makes `week-12` too, the first time)*. **The folder stays empty — there is no `dotnet new` tonight;** the next step fills it with the starter
- [ ] Integrated terminal (**Ctrl+&#96;**) — fill the empty folder with tonight's starter. This is Curbside as week 11's demo left it: accounts, a navbar that knows who is signed in, and a sign-in-only `[Authorize]` on every write:
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-12/demo-starter/Curbside/. .
  ```
  The trailing `/.` copies the *contents* in, so the project lands at the top of the window you already have open — no folder inside a folder

  ⚠️ **That resets the files, not the database and not the secrets.** Curbside's data lives on the school SQL Server, and every copy carries the same `<UserSecretsId>` — so the database rebuild and the secret check below are *separate* resets, and you need all three.
- [ ] **Set your connection string in your copy** — the `<UserSecretsId>` ships in the `.csproj`, so `set` alone is enough, no `init`:
  ```bash
  dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=...;User ID=...;Password=...;TrustServerCertificate=True"
  ```
- [ ] 🚨 **Check there is no admin email left over from a rehearsal:**
  ```bash
  dotnet user-secrets list
  ```
  **One line, `ConnectionStrings:DefaultConnection = …`, and nothing else.** If an `Admin:Email` line is there, remove it — a leftover email makes Ada an admin before §4 asks who should be:
  ```bash
  dotnet user-secrets remove "Admin:Email"
  ```
- [ ] ⚠️ **Rebuild the database — before your rehearsal, and again after it:**
  ```bash
  dotnet ef database drop --force
  dotnet ef database update
  ```
  Seven migrations replay. **No new migration tonight** — `AspNetRoles` and `AspNetUserRoles` came with week 11's `AddIdentity`, and they are empty
- [ ] Run it, same terminal:
  ```bash
  dotnet watch
  ```
- [ ] **Register Ada.** Browse to `/Account/Register`: **Email** `ada@example.com`, **What should we call you?** `Ada`, `Curbside-2026` in **Password** and again in **Confirm password**. Then **Sign out**. Ada is your own account tonight: §4 makes her the admin. Sam, the stranger, registers live in §1
- [ ] **Rehearse the whole script once in a separate copy.** Besides finding what is broken, it is the only way to see §4's refusal for yourself before the room does
- [ ] 🚨 **Then do all three resets again — files, `user-secrets list`, drop and update — and register Ada again.** A separate *copy* is not a separate database or a separate secret store: the `<UserSecretsId>` ships in the `.csproj`. Your rehearsal left an `Admin:Email` secret, an `Admin` role, Ada holding it, and Sam. **Last thing before class, always: `user-secrets list` shows one line, drop, update, Ada registered and signed out**
- [ ] **Open a second integrated terminal** (the `+` on the terminal panel — it opens in the same folder). `dotnet watch` owns the first one all night; §4's `dotnet user-secrets` goes in the second
- [ ] ⚠️ **Know the one prompt, and where it comes.** It is **not** at §2's attribute edit — that hot-reloads. It is in **§3, the moment `Views/Account/AccessDenied.cshtml` is created** — `ENC0021: Adding attribute requires restarting the application`, then **`Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`** — in terminal 1. **Answer `a`.** After that, `watch` restarts by itself for §4's `Program.cs` and §6's new view. *(Measured on a pty-driven `dotnet watch`.)*
- [ ] ⚠️ **Every restart tonight is Ctrl+R in terminal 1, never Ctrl+C + `dotnet watch`.** *Always* belongs to the `watch` session; Ctrl+C ends it, and the next new file stops and asks again
- [ ] **Park three browser tabs**: `/`, `/Trucks`, and **week 12's lab README** on github.com — it goes on screen for every lab block tonight
- [ ] **mssql extension** signed in, saved server connection tested, panel closed. It has **two** appearances tonight, both in §4: the empty `AspNetRoles` table, then the role and Ada's row
- [ ] **Say the no-typing line out loud in the first minute.** Tonight is watched, not typed along with: *"Nothing I type tonight is yours to type. Curbside is my app, and the Registry is yours. Your keyboard time is the lab blocks. There are seven of them tonight, one after each part of my demo."*
- [ ] Teaching profile on, notifications off, editor font sized for the back of the room and for a small laptop screen

> [!NOTE]
> **🖥️ On screen, at curtain**
>
> - **VS Code** — left half, `instructor/week-12/Curbside` open, two integrated terminals: terminal 1 running `dotnet watch`, terminal 2 idle at the project root
> - **Browser** — right half, three tabs: `/` (Curbside's front page, **signed out**), `/Trucks`, and the week 12 lab README

## 1 · The gap *(slides 1–2)*

- [ ] 🎞️ **GO TO SLIDE 1** — *Week 12 — Roles* · it is still up from the gallery — talk to its list before you swipe away from it: *"Here is tonight. First, a role on the lock, and the page someone lands on when the lock says no. Then who gets the role, and where that is written down. Then hiding the buttons someone cannot use, which is not the same as locking them. Then claims, which is what the sign-in cookie says about you. And last, everything we have already secured since week 6."*

### The debt from last week

- [ ] **Swipe to the browser, the `/` tab.** Say the goal: *"Last week I said signed in is not trusted, because anyone can make an account. Let me show you. I am a stranger called Sam, and I have an email address."*
- [ ] Click **Create an account**: **Email** `sam@example.com`, **What should we call you?** `Sam`, `Curbside-2026` in **Password** and again in **Confirm password**. Submit. The navbar says *Signed in as Sam*
- [ ] Click **Trucks**, then **＋ Add a truck**. 🎯 **The form opens.** *"That took one form, and I can add a truck, edit one, or remove one. Week 11's lock asks one question: are you signed in. Sam is."*

### Signed in as whom *(slide 2)*

- [ ] 🎞️ **GO TO SLIDE 2** — *Signed in as whom?* · *"Here is last week next to tonight. Last week, anyone with an account could write. Tonight, an account only lets you read, the same as a visitor. Writing needs a role."*
- [ ] 🎯 Still on slide 2, the last line: *"Anyone can make an account. A role is different, because only I can give one out. That is the whole idea of tonight."*

## Lab A · Setup and task 1 — 8 minutes

- [ ] Put the **lab README** on screen — the tab you parked in §0 — scrolled to **Setup**
- [ ] *"Tonight the lab comes in seven short blocks. After each part of my demo, you do the same thing to your Registry. Each block ends at a note that says In class, stop here."*
- [ ] *"The first block is setup and task 1. Task 1 sets your connection string, drops the lab database, rebuilds it, and starts your app. Use the same database name as in week 11."*
- [ ] ⚠️ **The drop is not optional, and say why:** *"You drop the lab database because the starter ships my migration files, and your database remembers yours. They cannot be mixed. If you skip the drop, the update fails with there is already an object named Cryptids."*
- [ ] ⚠️ **Then fence it:** *"Only drop a database you can rebuild from scratch. The lab database is one of those. Never drop your own project's database. It has records that nothing can give back."*
- [ ] *"Then join the Registry with your own email. Task 4 makes that account the curator, so use an email you will remember."* Then the target: *"Tonight's in-class target is checks 1 to 5."*
- [ ] 👀 **Watch for:** `There is already an object named 'Cryptids'` — they skipped the drop. `Could not find a MSBuild project file` — terminal 1 or 2 never ran `cd Cryptids.Web`. `Login failed`, or a long wait that ends in a network error, on `database update` — the username or password, or the server name. `Username '…' is already taken.` — they joined twice; it worked the first time
- [ ] **Stop:** the note after **Task 1 in full**. Where they should be: `dotnet test` prints **`Passed: 1`**, the app is running in terminal 1, and they are signed in with their own email

## 2 · The role on the lock *(slide 3)*

### One word in the attribute

- [ ] **Swipe to the editor.** Say the goal: *"Sam is still signed in. I am changing the lock on trucks, so it asks for a role called Admin instead of just a signed-in account."*
- [ ] Open `Controllers/TrucksController.cs`. **Type it — the attribute is the lesson.** The line above the class:
  ```csharp
  [Authorize]
  ```
  becomes
  ```csharp
  [Authorize(Roles = "Admin")]
  ```
- [ ] **Say what it is:** *"Same attribute, same place on the class. It still needs you signed in, and now it also needs the Admin role. The reads are still open, because AllowAnonymous on Index and Details has not changed."*
- [ ] ⚠️ **Watch terminal 1: `Hot reload succeeded`.** That usually means the change is live — but an attribute is the kind of edit hot reload can report as applied when it isn't, because MVC works out each action's filters when the app starts. **If the next beat still opens the form, press Ctrl+R in terminal 1 and try again.** Say it if it happens: *"The new lock was not on yet. Hot reload does not always apply a change to an attribute. A restart always does."*

### Where does Sam go

- [ ] **Ask before the click — the answer is last week's redirect:** *"Last week, a stranger who clicked Add a truck went to the sign-in page. Sam is signed in. What should happen to him instead?"* Take answers
- [ ] **Swipe to the browser**, `/Trucks`. Click **＋ Add a truck**. 🎯 The address bar says **`/Account/AccessDenied?ReturnUrl=%2FTrucks%2FCreate`**, and the page says ***Keep on Truckin' 🌮 — That page doesn't exist***
- [ ] Point at the address bar: *"Look at the address. Account, AccessDenied. Identity has two places it sends people. Someone who is not signed in goes to Account Login. Someone who is signed in, but is not allowed, goes to Account AccessDenied. These are the Identity framework's defaults, the same as the sign-in page last week."*
- [ ] **Ask the second one — the answer is week 10:** *"Now look at the page. It says that page doesn't exist. Which part of my app put this page up?"* Take the answer: *"The Missing page from week 10. Nothing in my app answers at Account AccessDenied, so it is a 404, and every 404 gets the Missing page."*
- [ ] 🎞️ **GO TO SLIDE 3** — *A role on the lock* · *"Here are the three visitors, and where each one lands. Not signed in, the sign-in page. Signed in without the role, AccessDenied. Signed in with it, the form."*
- [ ] 🎯 Still on slide 3, the last line: *"I never configured either of those addresses. I write the pages, and Identity sends people to them. The sign-in page exists since last week. AccessDenied is the one I still owe."*

### Every write

- [ ] **Swipe to the editor.** *"Dishes and specials get the same change."* `Controllers/DishesController.cs` and `Controllers/SpecialsController.cs` — the line above each class becomes:
  ```csharp
  [Authorize(Roles = "Admin")]
  ```
- [ ] *"Every Curbside write now needs the Admin role. Every read is still open to anybody."*

## Lab B · Task 2 — 12 minutes

- [ ] Lab README on screen, scrolled to **Task 2 in full**
- [ ] *"Task 2 is the same change on your Registry. Your role is called Curator, because a curator looks after the archive. The attribute on CryptidsController gets Roles equals Curator."*
- [ ] ⚠️ *"Leave SightingsController alone, exactly like last week. Reports are what the public files. Nobody needs a role to report a sighting, and check 2 fails if you lock it."*
- [ ] *"Then click File a report, signed in as yourself, and look at the address bar."*
- [ ] 👀 **Watch for:** check 2 saying a POST got through — the role went on the GET actions, not the class. The form still opening after the edit — hot reload; Ctrl+R in terminal 1. `Curators` or `curator` in the attribute — that's fine until task 4, when the seeder has to spell it the same way
- [ ] **Stop:** the note after **Task 2 in full**. Where they should be: **`Passed: 2`**, and their own account landing on the Not on file page at `/Account/AccessDenied`

## ☕ Break

## 3 · AccessDenied

### The view first

- [ ] In the editor — no slide for this part. Say the goal: *"Now the page Sam should have seen. It is a view and a one-line action. The view goes in first, and I will say why when the action goes in."*
- [ ] Create `Views/Account/AccessDenied.cshtml` and paste:
  ```cshtml
  @{
      ViewData["Title"] = "Admins only";
  }

  <div class="text-center py-5">
      <h1 class="display-5">Admins only 🔒</h1>
      <p class="lead text-muted">
          You're signed in, but changing Curbside's trucks, dishes and specials is for its admins.
      </p>
      <a asp-controller="Trucks" asp-action="Index" class="btn btn-primary">See every truck</a>
  </div>
  ```
- [ ] **Say what it is:** *"A page that tells someone who is signed in that this part of the site is for admins, and a way back to the trucks."*
- [ ] ⚠️ **Terminal 1 — the prompt.** It prints `ENC0021: Adding attribute requires restarting the application`, then `Do you want to restart your app?` **Answer `a`.** Say why while it restarts: *"A new view is a change hot reload cannot make, so dotnet watch asks to restart. I answer a, for always, and from now on it restarts by itself when it has to. You get the same question in your lab."*
- [ ] **Reload the AccessDenied tab.** Still ***Keep on Truckin'***. *"The view is there, and there is still no action to show it. So it is still a 404."*

### Then the action

- [ ] Open `Controllers/AccountController.cs`. Paste this **just above the comment `// POST /Account/Logout`**:
  ```csharp
  // GET /Account/AccessDenied — where [Authorize(Roles = "Admin")] sends someone
  // who IS signed in but isn't an admin. Identity's own default, the same
  // way a stranger is sent to /Account/Login.
  public IActionResult AccessDenied()
  {
      return View();
  }
  ```
- [ ] **Say what it is, and why it went second:** *"An action that shows the view. If I had added the action first, the action would have looked for a view that was not there yet, and that is a 500 error, not a 404. View first, then the action, the same order as the Missing page in week 10."*
- [ ] **Reload.** 🎯 ***Admins only 🔒***. *"Now Sam knows what happened. He is signed in, and this part is for admins."*

## Lab C · Task 3 — 10 minutes

- [ ] Lab README on screen, scrolled to **Task 3 in full**
- [ ] *"Task 3 is the Registry's page for this. The view first, then the action. When terminal 1 asks to restart, answer a."*
- [ ] *"Your page says Curators only. Check 3 looks for the word Curator on it, so a member knows the page is not broken."*
- [ ] 👀 **Watch for:** a `500` with `The view 'AccessDenied' was not found` — they added the action first, and the view is missing or the prompt is still waiting in terminal 1; answer `a`, don't move the file. A page that is still *Not on file* — the action isn't on `AccountController`, or it's misspelled
- [ ] **Stop:** the note after **Task 3 in full**. Where they should be: **`Passed: 3`**, and *Curators only* on their screen

## 4 · Who gets the role *(slides 4–5)*

### Nobody yet

- [ ] **Swipe to the browser.** Sign out, then **Sign in** as `ada@example.com` with `Curbside-2026`. Say the goal: *"Ada is my own account. She should be the admin. Watch what happens when she tries."*
- [ ] **Trucks → ＋ Add a truck.** ***Admins only.*** *"Ada is refused too. Nobody is an admin, because nobody has been given the role. There is not even a role yet."*
- [ ] **mssql panel:**
  ```sql
  SELECT * FROM AspNetRoles;
  ```
  No rows. *"This table has been here since last week's migration, and it is empty. A role is a row in this table, and holding a role is a row in AspNetUserRoles, next to it. So there is nothing to migrate tonight. The tables exist, and I need to put rows in them."*

### The email lives in configuration *(slide 4)*

- [ ] 🎞️ **GO TO SLIDE 4** — *Who gets the role* · *"The role itself I make in code. Who holds it, I do not write in code, because this repo is public and an admin's email is not the code's business. The email goes in configuration, in the same place as my connection string."*
- [ ] Still on slide 4, the table: *"On my machine, that is a user secret. On Azure, it is an app setting called Admin underscore underscore Email. Two underscores, the same as the connection string in week 7."*
- [ ] Still on slide 4, the last line: *"And no password anywhere. Ada registered through the form like anybody else. All I am doing is giving her account a role."*
- [ ] **Swipe to the editor. Terminal 2:**
  ```bash
  dotnet user-secrets set "Admin:Email" "ada@example.com"
  ```
  It prints `Successfully saved Admin:Email to the secret store.` Terminal 1 does nothing. *"The secret is saved. Nothing reads it yet."*

### The seeder

- [ ] Say the goal: *"Now the code that reads it. It runs once, when the app starts. It makes sure the Admin role exists, then it gives the role to whoever has that email."* Create `Data/RoleSeeder.cs` and paste:
  ```csharp
  using Microsoft.AspNetCore.Identity;
  using Curbside.Models;

  namespace Curbside.Data;

  // Runs once, when the app starts. Makes sure the Admin role exists, then
  // gives it to the user whose email is in configuration under Admin:Email —
  // a user secret on my machine, an app setting on Azure. No email set, or
  // nobody has registered with it yet: the role exists, and nobody holds it.
  public static class RoleSeeder
  {
      public static async Task SeedAsync(IServiceProvider services)
      {
          var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
          var userManager = services.GetRequiredService<UserManager<AppUser>>();
          var config = services.GetRequiredService<IConfiguration>();

          if (!await roleManager.RoleExistsAsync("Admin"))
          {
              await roleManager.CreateAsync(new IdentityRole("Admin"));
          }

          var email = config["Admin:Email"];
          if (string.IsNullOrEmpty(email))
          {
              return;
          }

          var user = await userManager.FindByEmailAsync(email);
          if (user != null && !await userManager.IsInRoleAsync(user, "Admin"))
          {
              await userManager.AddToRoleAsync(user, "Admin");
          }
      }
  }
  ```
- [ ] **Say what it is, with it on screen:** *"Three workers from Identity. RoleManager makes roles. UserManager finds users and gives them roles, the same UserManager as last week's register page. And configuration, for the email. If the role is missing, it makes it. If there is an email, and someone registered with it, and they are not an admin yet, it makes them one. Run it twice and nothing changes the second time."*
- [ ] Open `Program.cs`. Paste this **just below `var app = builder.Build();`**:
  ```csharp
  // Week 12: the Admin role, and who holds it. Runs once, at startup.
  using (var scope = app.Services.CreateScope())
  {
      await RoleSeeder.SeedAsync(scope.ServiceProvider);
  }
  ```
- [ ] **Say what it is:** *"These lines run the seeder once, when the app starts, before it answers anybody."* Terminal 1 prints `Restart is needed to apply the changes` and restarts by itself — that is the `a` from §3
- [ ] 💡 *"One thing changes because of this. My app now talks to the database the moment it starts. If the connection string is missing, it stops before it ever says Now listening. Your lab README has that one in its Stuck list."*

### Ada is still refused *(slide 5)*

- [ ] **mssql panel:**
  ```sql
  SELECT r.Name, u.Email
  FROM AspNetUserRoles ur
  JOIN AspNetRoles r ON r.Id = ur.RoleId
  JOIN AspNetUsers u ON u.Id = ur.UserId;
  ```
  One row: `Admin`, `ada@example.com`. *"The seeder ran. There is an Admin role, and Ada holds it."*
- [ ] **Swipe to the browser.** Say what to watch, and don't predict it: *"Ada is still signed in, and the database says she is an admin. Watch the page."* **Trucks → ＋ Add a truck.** 🎯 ***Admins only.***
- [ ] 🎞️ **GO TO SLIDE 5** — *The role is read when you sign in* · *"Here is why. When Ada signed in, the cookie got her name, her email, and her roles. She had none. The seeder gave her the role afterwards, in the database. Her cookie still says none, and the lock reads the cookie, not the database."*
- [ ] Still on slide 5, the last line: *"So a new role takes effect the next time she signs in. Identity also checks the cookie against the database every thirty minutes, so it would arrive by itself eventually. Do not wait for it. Sign out and sign back in."*
- [ ] **Swipe to the browser.** **Sign out**, **Sign in** as Ada, **＋ Add a truck.** 🎯 **The form.** *"Same account, same database, a new cookie. That one has the role in it."*

## Lab D · Task 4 — 15 minutes

- [ ] Lab README on screen, scrolled to **Task 4 in full**
- [ ] *"Task 4 makes you the curator. In terminal 2, set Admin Email to the email you joined with in task 1. Then the seeder file, then the lines in Program.cs."*
- [ ] *"Then try to file a report, still signed in. You will be refused, and that is correct. Sign out, sign back in, and try again."*
- [ ] 👀 **Watch for:** the refusal after restarting — they have done it right; sign out and back in. Never let in, even after signing in again — the role name in `RoleSeeder.cs` and in the attribute disagree (`Curator` both times), the secret's key isn't exactly `Admin:Email`, or the email isn't the one they joined with: `dotnet user-secrets list` shows it. `Unhandled exception … The ConnectionString property has not been initialized` before `Now listening on:` — the connection string secret is gone (a frozen lab PC); set it again
- [ ] **Stop:** the note after **Task 4 in full**. Where they should be: **`Passed: 4`**, and the form opening for their own account after signing in again

## ☕ Break

## 5 · Hide what you can't use *(slide 6)*

### Four views

- [ ] Start signed in as Ada, on `/Trucks`. Say the goal: *"Sam can still see the Add a truck button. It takes him to a page that says no. Buttons someone cannot use should not be there, so I am hiding them from everyone who is not an admin."*
- [ ] `Views/Trucks/Index.cshtml` — select everything in the file and paste:
  ```cshtml
  @model List<Truck>
  @{
      ViewData["Title"] = "Trucks";
  }

  <h1>Curbside</h1>
  <p class="text-muted">@Model.Count trucks on the street.</p>

  @if (User.IsInRole("Admin"))
  {
      <a asp-action="Create" class="btn btn-primary mb-4">＋ Add a truck</a>
  }

  @if (!Model.Any())
  {
      <p class="text-muted">No trucks on the street yet.</p>
  }

  <div class="row row-cols-1 row-cols-md-3 g-4">
      @foreach (var truck in Model)
      {
          <div class="col">
              <partial name="_TruckCard" model="truck" />
          </div>
      }
  </div>
  ```
- [ ] **Say what it is:** *"The Add a truck button now only shows for someone in the Admin role. And the empty list no longer says add the first one, because most people reading it cannot."*
- [ ] Say the goal for the next three: *"The same @if goes around every write button on three more pages. The edit and remove buttons on a truck's page, and the add buttons on the dishes pages."* `Views/Trucks/Details.cshtml` — select everything and paste:
  ```cshtml
  @model TruckDetailsViewModel
  @{
      ViewData["Title"] = Model.Truck.Name;
  }

  <h1>@Model.Truck.Name</h1>
  <p class="lead">@Model.Truck.Cuisine · @Model.Truck.City</p>
  <p>Rating: @Model.Truck.Rating / 5</p>

  @if (Model.Truck.IsOpenLate)
  {
      <p><span class="badge bg-success">🌙 Open late</span></p>
  }

  <a href="/Trucks">← Back to all trucks</a>

  <h2 class="h5 mt-4">On the menu</h2>

  @if (Model.Truck.Specials.Count > 0)
  {
      <ul class="list-group mb-4">
          @foreach (var special in Model.Truck.Specials)
          {
              <li class="list-group-item d-flex justify-content-between">
                  <span>
                      <a asp-controller="Dishes" asp-action="Details" asp-route-id="@special.DishId">@special.Dish!.Name</a>
                      <span class="text-muted">· @special.ServedOn</span>
                  </span>
                  <span>$@special.Price</span>
              </li>
          }
      </ul>
  }
  else
  {
      <p class="text-muted">Nothing listed.</p>
  }

  @if (User.IsInRole("Admin"))
  {
      <p><a asp-controller="Specials" asp-action="Create" asp-route-truckId="@Model.Truck.Id" class="btn btn-primary">＋ Add a special</a></p>
  }

  @if (Model.AlsoHere.Count > 0)
  {
      <h2 class="h5 mt-4">Also in @Model.Truck.City</h2>
      <div class="row row-cols-1 row-cols-md-3 g-4">
          @foreach (var other in Model.AlsoHere)
          {
              <div class="col">
                  <partial name="_TruckCard" model="other" />
              </div>
          }
      </div>
  }

  @section Scripts {
      <script>
          console.log("Truck file loaded: @Model.Truck.Name");
      </script>
  }

  @if (User.IsInRole("Admin"))
  {
      <p class="mt-4"><a asp-action="Edit" asp-route-id="@Model.Truck.Id" class="btn btn-secondary">✏️ Edit this truck</a></p>
      <p><a asp-action="Delete" asp-route-id="@Model.Truck.Id" class="btn btn-outline-danger">🗑️ Remove this truck</a></p>
  }
  ```
- [ ] `Views/Dishes/Index.cshtml` — select everything and paste:
  ```cshtml
  @model List<Dish>
  @{
      ViewData["Title"] = "Dishes";
  }

  <h1>Dishes</h1>
  <p class="text-muted">@Model.Count dishes, across every truck on the street.</p>

  @if (User.IsInRole("Admin"))
  {
      <a asp-action="Create" class="btn btn-primary mb-4">＋ Add a dish</a>
  }

  @if (!Model.Any())
  {
      <p class="text-muted">No dishes yet.</p>
  }

  <ul class="list-group">
      @foreach (var dish in Model)
      {
          <li class="list-group-item d-flex justify-content-between">
              <a asp-action="Details" asp-route-id="@dish.Id">@dish.Name</a>
              <span class="text-muted small">@dish.Specials.Count truck@(dish.Specials.Count == 1 ? "" : "s")</span>
          </li>
      }
  </ul>
  ```
- [ ] `Views/Dishes/Details.cshtml` — select everything and paste:
  ```cshtml
  @model Dish
  @{
      ViewData["Title"] = Model.Name;
  }

  <h1>@Model.Name</h1>

  <a href="/Dishes">← All dishes</a>

  <h2 class="h5 mt-4">Served by</h2>

  @if (Model.Specials.Any())
  {
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
  }
  else
  {
      <p class="text-muted">No truck is serving this yet.</p>
      @if (User.IsInRole("Admin"))
      {
          <p><a asp-controller="Specials" asp-action="Create" class="btn btn-primary">＋ Put it on a truck</a></p>
      }
  }
  ```
- [ ] **Say what they are:** *"Four pages, and every button that changes something is inside an if that asks one question: is this person in the Admin role."*

### Three visitors

- [ ] **Swipe to the browser.** As Ada: `/Trucks` has **＋ Add a truck**; open a truck — **＋ Add a special**, **✏️ Edit this truck** and **🗑️ Remove this truck** are there. *"Ada is the admin, so she sees all of them."*
- [ ] **Sign out.** `/Trucks` and the same truck: no buttons. *"A visitor sees the trucks and nothing to change them with."*
- [ ] **Sign in** as `sam@example.com` with `Curbside-2026`. `/Trucks`: no buttons. *"Sam is signed in, and he sees the same as a visitor."*
- [ ] Say what to watch: *"Sam cannot see the button. He can still type."* Type **`/Trucks/Create`** into the address bar. 🎯 ***Admins only.***

### Not the lock *(slide 6)*

- [ ] 🎞️ **GO TO SLIDE 6** — *Hiding a link is not security* · *"Two different jobs. The if decides what you see. The attribute decides what you can do. Sam just went straight past the missing button, and the attribute stopped him."*
- [ ] 🎯 Still on slide 6, the last line: *"If I had hidden the buttons and forgotten the attribute, the page would look locked, and anybody with an account could still type the address. Hide the button for the visitor. Lock the controller for the data."*

## Lab E · Task 5 — 12 minutes

- [ ] Lab README on screen, scrolled to **Task 5 in full**
- [ ] *"Task 5 hides the archive's buttons. File a report on the list, and Correct the record and Close the file on a creature's page. Each one inside an if that asks whether you are a Curator."*
- [ ] ⚠️ *"Report a sighting stays outside the if. That one is for the public, and check 5 fails if a visitor cannot see it."*
- [ ] *"Then sign out, and type Cryptids slash Create into the address bar."*
- [ ] 👀 **Watch for:** check 5 saying a visitor can't see 👁️ *Report a sighting* — it went inside the `@if` with the others. The curator seeing nothing either — the role name inside `IsInRole` isn't `Curator`, or they haven't signed in again since task 4. **Sweep the room here** — this is tonight's in-class target
- [ ] **Stop:** the note after **Task 5 in full**. Where they should be: **`Passed: 5`** — checks 1 to 5, tonight's in-class target

## 6 · A role is a claim *(slide 7)*

### The claims page

- [ ] In the editor. Say the goal: *"I keep saying the role is in the cookie. Let's look at what the cookie says. A page that lists everything it carries about whoever is signed in."*
- [ ] `Controllers/AccountController.cs` — add the using at the top:
  ```csharp
  using Microsoft.AspNetCore.Authorization;
  ```
  and paste this **just above the comment `// POST /Account/Logout`**:
  ```csharp
  // GET /Account/Claims — what the sign-in cookie says about you. A role
  // is one claim among the others.
  [Authorize]
  public IActionResult Claims()
  {
      return View();
  }
  ```
- [ ] Create `Views/Account/Claims.cshtml` and paste:
  ```cshtml
  @{
      ViewData["Title"] = "What the cookie says";
  }

  <h1>What the cookie says</h1>
  <p class="text-muted">Every row is a claim: one fact about you, written into the sign-in cookie when you signed in.</p>

  <table class="table">
      <thead>
          <tr>
              <th>Type</th>
              <th>Value</th>
          </tr>
      </thead>
      <tbody>
          @foreach (var claim in User.Claims)
          {
              <tr>
                  <td><code>@claim.Type</code></td>
                  <td>@claim.Value</td>
              </tr>
          }
      </tbody>
  </table>
  ```
  Terminal 1 restarts by itself for the new view
- [ ] **Say what they are:** *"An action that needs you signed in, because there is nobody to describe otherwise. And a table with one row for every claim in the cookie: its type, and its value."*

### Sam's five, Ada's six

- [ ] **Swipe to the browser.** Signed in as Sam, browse to **`/Account/Claims`**. Five rows: `…/nameidentifier`, `…/name`, `…/emailaddress`, `AspNet.Identity.SecurityStamp`, `amr`. *"This is everything my app knows about Sam without asking the database. His id, his name, his email, a stamp Identity uses to tell whether the account has changed, and how he signed in: pwd, a password."*
- [ ] **Sign out**, **sign in** as Ada, **`/Account/Claims`**. 🎯 **Six rows** — one of them `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`, value **`Admin`**. *"Ada has one more row. That is her role."*
- [ ] 🎞️ **GO TO SLIDE 7** — *A role is a claim* · *"A claim is one fact about you, written into the cookie when you sign in. A role is just a claim whose type is role."*
- [ ] Still on slide 7, the last line: *"So User IsInRole and Authorize with Roles are both reading that one row. That is why the role arrived when Ada signed in again: a new sign-in writes a new set of claims."*

## Lab F · Task 6 — 13 minutes

- [ ] Lab README on screen, scrolled to **Task 6 in full**
- [ ] *"Task 6 is the claims page for your Registry. The action with Authorize on it, then the view."*
- [ ] *"Then look at your own claims, and find the one that says Curator."*
- [ ] 👀 **Watch for:** check 6 saying a visitor opened `/Account/Claims` — `[Authorize]` is missing from the action. No role row for the curator — they haven't signed in again since task 4. `The type or namespace name 'Authorize' could not be found` — the using at the top of `AccountController.cs`
- [ ] **Stop:** the note after **Task 6 in full**. Where they should be: **`Passed: 6`**, and their own role claim on the page

## 7 · What's already secured *(slide 8)*

- [ ] 🎞️ **GO TO SLIDE 8** — *What's already secured* · *"Before you go back to the lab, here is everything this course has already secured, and what each one stops. None of it is new tonight except the last row."*
- [ ] Still on slide 8, the first two rows: *"Week 6, the antiforgery token: another website cannot post your forms for you. Week 8, the Bind list: a field nobody put on the form cannot be slipped into the post."*
- [ ] Still on slide 8, the week 11 rows: *"Week 11, four of them. The password is a hash, so a stolen table gives up no passwords. Sign out is a POST, so no other page can sign you out. LocalRedirect, so a return URL cannot send you to another site. And Authorize on the class, so an action someone adds later is locked by default."*
- [ ] 🎯 Still on slide 8, the last row: *"And tonight, the role. That closes the gap I named last week. A stranger can still make an account, and an account is no longer enough to change anything."*

## Lab G · Catch up, or the stretch — 20 minutes

- [ ] Lab README on screen, scrolled to **The tasks**
- [ ] *"This is the last block, and it has no stop. If any of your checks are red, finish those first. If you are at six, the stretch at the bottom of the README turns the Signed in as line in your navbar into a link to your claims page."*
- [ ] *"The stretch has no check and no points. Tonight's in-class target was checks 1 to 5. Anything still red is Part 1 of your homework."*
- [ ] 👀 **Watch for:** anyone still red on check 4 — have them sign out and back in, then read the message; it names the email it tried
- [ ] **No stop.** This block takes whatever time is left before the wrap-up. Anyone finished: the stretch, **🚀 Done early?** at the bottom of the README, or help a classmate

## 8 · Wrap-up, after the lab *(slide 9)*

- [ ] 🎞️ **GO TO SLIDE 9** — *Tonight, in one picture* · walk the five rows, one sentence each, and give the last row the emphasis: *"A hidden button is a courtesy. The attribute is the lock. If you only remember one row, remember that one."*
- [ ] Homework: **the same four moves on their own app.** *"The role on your lock, an AccessDenied page, a seeder that reads your own email from configuration, and the buttons hidden. You pick the role's name. Pick one that says what that person does in your app."*
- [ ] ⚠️ Say what the self-check can't see, and what it does to your browser: *"The self-check signs in as last week's self-check account, which has no role, and makes sure it is refused everything. It cannot see your admin succeed, because it does not know your password and never should. So the homework's last step is yours: sign in as your admin on Azure, and change something. And when the check finishes, your browser is signed out."*
- [ ] 💡 *"On Azure, your admin's email is an app setting called Admin underscore underscore Email, the same command as the connection string in week 7. Setting it restarts the app, and the seeder runs then. Then sign out and back in, the same as tonight."*
- [ ] 💡 *"My Curbside is on localhost. Nothing is deployed for it. Yours is graded on its Azure URL."*
- [ ] 🔗 Week 13: *"Next week is the flex week: services, TempData, and paging and search."*
