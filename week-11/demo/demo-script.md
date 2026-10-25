# Week 11 Demo Script — Curbside Gets Members 🔑

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Paste from here; the only thing tonight worth typing is §5's two attributes.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-11/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

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
> **Nothing tonight gets broken and put back.** Every change is forward. There are two failures, and neither is staged: §3's weak password is Identity's own rules refusing it, and §6's blank name is an account that is older than its column. If you lose your place, nothing needs undoing.

## 0 · Before class

- [ ] ⚠️ **Re-rehearsing this week? Delete `instructor/week-11/Curbside` first** — a rehearsal leaves it in tonight's **end** state, and every beat below starts from week 10's. Deleting the folder in Finder is enough; the next step recreates it
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course/instructor/week-11`, create a new empty **folder** named `Curbside` and open it *(the dialog's **New Folder** button makes `week-11` too, the first time)*. **The folder stays empty — there is no `dotnet new` tonight;** the next step fills it with the starter
- [ ] Integrated terminal (**Ctrl+&#96;**) — fill the empty folder with tonight's starter. This is Curbside as week 10's demo left it: its own front page, no Privacy page, a Missing page for wrong ids, and empty states:
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-11/demo-starter/Curbside/. .
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
  Five migrations replay. Then check `/Trucks` shows **seven** cards and `/Dishes` shows **ten** dishes
- [ ] **Rehearse the whole script once in a separate copy.** Besides finding what is broken, the rehearsal warms your NuGet cache for §2's `dotnet add package`
- [ ] 🚨 **Then run the drop + rebuild above again — the rehearsal used the same database.** A separate *copy* is not a separate database: the `<UserSecretsId>` ships in the `.csproj`, so every copy reads one secret and points at one database. Your rehearsal built Identity's seven tables and made an account called `ada@example.com`, and §2 would have nothing left to create. **Last thing before class, always: drop, update, `/Trucks` shows seven cards**
- [ ] Run it, same terminal:
  ```bash
  dotnet watch
  ```
- [ ] ⚠️ **If terminal 1 prints yellow `NU1902` and `NU1903` warnings, then two `msbuild: [Failure] Msbuild failed when processing the file …` lines after `Now listening on:`** — the same `System.Security.Cryptography.Pkcs` advisory as weeks 9 and 10, three levels under the SQL Server package. The build succeeded and the app is running; tonight's Identity package neither adds to it nor fixes it. VS Code may also show the *There were problems loading project Curbside.csproj* toast — dismiss it. **The demo starter and the lab starter now carry the fix (2026-10-18), so expect no yellow lines — skip §1's warnings beat.** The fix is `dotnet add package System.Security.Cryptography.Pkcs --version 10.0.13`, from the folder with the `.csproj`; it's the first step of the homework, for their own apps
- [ ] **Open a second integrated terminal** (the `+` on the terminal panel — it opens in the same folder). `dotnet watch` owns the first one all night; everything you type tonight goes in the second — §2's `dotnet add package`, both copy-ins, and every `dotnet ef`
- [ ] ⚠️ **Know the one prompt, and where it comes.** It is **not** at the first new file. It is in **§2, the moment the context's base class changes** — `ENC0014: Updating the base class and/or base interface(s) of class requires restarting the application`, then **`Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`** — in terminal 1, while you are typing in terminal 2. **Answer `a`.** After that, `watch` restarts by itself for `Program.cs`, both copy-ins and the new partial. *(Measured on a pty-driven `dotnet watch`.)*
- [ ] ⚠️ **Every restart tonight is Ctrl+R in terminal 1, never Ctrl+C + `dotnet watch`.** *Always* belongs to the `watch` session. Ctrl+C ends the session, and the next new file stops and asks again — measured: after a Ctrl+C restart in §2, §3's copy-in sat at the prompt and `/Account/Register` was a `404` until it was answered. Ctrl+R restarts the app and keeps the session
- [ ] **Park three browser tabs**: `/`, `/Trucks/Delete/1`, and **week 11's lab README** on github.com — it goes on screen for every lab block tonight
- [ ] **mssql extension** signed in, saved server connection tested, panel closed. It has **three** appearances tonight — §2, the empty `AspNetUsers` table, §3, the row your registration writes, and §6, Ada's and Bea's rows with the new `DisplayName` column
- [ ] **Say the no-typing line out loud in the first minute.** Tonight is watched, not typed along with: *"Nothing I type tonight is yours to type. Curbside is my app, and the Registry is yours. Your keyboard time is the lab blocks. There are seven of them tonight, one after each part of my demo."*
- [ ] Teaching profile on, notifications off, editor font sized for the back of the room and for a small laptop screen

> [!NOTE]
> **🖥️ On screen, at curtain**
>
> - **VS Code** — left half, `instructor/week-11/Curbside` open, two integrated terminals: terminal 1 running `dotnet watch`, terminal 2 idle at the project root
> - **Browser** — right half, three tabs: `/` (Curbside's front page), `/Trucks/Delete/1`, and the week 11 lab README

## 1 · The hole *(slides 1–2)*

- [ ] 🎞️ **GO TO SLIDE 1** — *Week 11 — Identity* · it is still up from the gallery — talk to its list before you swipe away from it: *"Here is tonight. First, a table for users, and a user class of my own. Then registering, where a password goes in and only a hash is saved. Then signing in and out, and the cookie that remembers you. Then the lock: a change to my data needs an account. And last, a property of my own on the user."*

### Since week 6

- [ ] **Swipe to the browser, the `/Trucks/Delete/1` tab.** *"This is the page that deletes Roll Models. I have not signed in. There is nothing to sign in to."*
- [ ] *"Since week 6, anybody with my URL could add a truck. Since week 8, anybody could edit one or delete one. Nothing ever asked who they were."* Click **Keep it** — say out loud that you are not deleting it
- [ ] ⚠️ **Only if terminal 1 shows yellow `NU1902`/`NU1903` lines — otherwise skip this beat.** Swipe to the editor and point at them: *"These are the same warnings as the last two weeks: an advisory against a package the SQL Server package brings in. Read the line above them. Build succeeded. If your own app still shows them, the fix is one command, and it is in your homework's Stuck list."*

### Two questions *(slide 2)*

- [ ] 🎞️ **GO TO SLIDE 2** — *Two questions* · *"Two questions, and they sound alike. Authentication asks who you are. Authorization asks what you are allowed to do. Tonight is mostly the first one."*
- [ ] 🎯 Still on slide 2, the right-hand column: *"Tonight, the answer to what you may do is only signed in, or not. Signed in, you can change my trucks. Not signed in, you can read them."*
- [ ] Still on slide 2, the last line: *"Next week asks who you are signed in as. That is roles, and it is week 12."*

## Lab A · Setup and task 1 — 8 minutes

- [ ] Put the **lab README** on screen — the tab you parked in §0 — scrolled to **Setup**
- [ ] *"Tonight the lab comes in seven short blocks. After each part of my demo, you do the same thing to your Registry. Each block ends at a note that says In class, stop here."*
- [ ] *"The first block is setup and task 1. Task 1 sets your connection string, drops the lab database, rebuilds it, and starts your app. Use the same database name as in week 9."*
- [ ] ⚠️ **The drop is not optional, and say why:** *"You drop the lab database because the starter ships my migration files, and your database remembers yours. They cannot be mixed. If you skip the drop, the update fails with there is already an object named Cryptids."*
- [ ] ⚠️ **Then fence it:** *"Only drop a database you can rebuild from scratch. The lab database is one of those. Never drop your own project's database. It has records that nothing can give back."*
- [ ] *"The checks never touch SQL Server. Six out of six does not prove your connection string works. Your browser proves that."* Then the target: *"Tonight's in-class target is checks 1 to 5."*
- [ ] 💡 One line on what is new in the starter, so nobody hunts for it: *"Your starter is the Registry from week 9, with the three fixes from the midterm already in: Privacy is gone, a wrong id lands on a page of its own, and one creature says creature, not creatures."*
- [ ] 👀 **Watch for:** yellow `NU1902`/`NU1903` warnings and `msbuild: [Failure] Msbuild failed…` in terminal 1 — the `Pkcs` advisory, not a failure, and their copy of the starter predates the fix: `dotnet add package System.Security.Cryptography.Pkcs --version 10.0.13` from `Cryptids.Web`, the same command as the README's 🆘. `There is already an object named 'Cryptids'` — they skipped the drop. `Could not find a MSBuild project file` — terminal 1 or 2 never ran `cd Cryptids.Web`. `Login failed`, or a long wait that ends in a network error, on `database update` — the username or password, or the server name
- [ ] **Stop:** the note after **Task 1 in full**. Where they should be: `dotnet test` prints **`Passed: 1`**, the app is running in terminal 1, and `/Cryptids` shows six creatures

## 2 · Identity goes in *(slide 3)*

### The package

- [ ] In the editor — no slide yet. Say the goal before anything is pasted: *"First I give my app somewhere to keep users. Identity brings the tables and the code that runs them. I bring a user class and a database to put them in."*
- [ ] **Terminal 2** — the package. ⚠️ **Pinned, because the starter is frozen at EF 10.0.10** — an unpinned add can pull a newer version and refuse to build:
  ```bash
  dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 10.0.10
  ```
  Terminal 1 prints `File updated: ./Curbside.csproj` and `No C# changes to apply.` — that's all
- [ ] **Say what it is:** *"This package is Identity's database half: the tables for users, and the code that reads and writes them. Your homework adds the same package."*

### Your own user class *(slide 3)*

- [ ] Create `Models/AppUser.cs` and paste:
  ```csharp
  using Microsoft.AspNetCore.Identity;

  namespace Curbside.Models;

  // Curbside's own user. Empty for now: IdentityUser already has the email,
  // the password hash and everything else sign-in needs. It's here so that
  // every file that names the user names THIS class from the start.
  public class AppUser : IdentityUser
  {
  }
  ```
- [ ] 🎞️ **GO TO SLIDE 3** — *Your own user class, even empty* · *"This class is empty, and that is on purpose. IdentityUser already has everything sign-in needs: the email, the password hash, the lockout counters. My class inherits all of it."*
- [ ] 🎯 Still on slide 3, the bold line: *"So why have it at all, empty? By the end of tonight, four files name the user type: the context, Program.cs, the account controller and the navbar. If they all said IdentityUser and I wanted a property of my own, I would change all four. Because they say AppUser, I add one line to one class. That is the last part of tonight."*

### The context

- [ ] **Swipe back to the editor.** Open `Data/CurbsideContext.cs`. First, the line that goes **at the top of `OnModelCreating`**, above the truck seed:
  ```csharp
  base.OnModelCreating(modelBuilder);
  ```
- [ ] **Say what it is:** *"This line is for Identity. It does nothing yet. I will explain it once the next change is in."*
- [ ] Now change the class line, and add the using at the top of the file:
  ```csharp
  using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
  ```
  ```csharp
  public class CurbsideContext : IdentityDbContext<AppUser>
  ```
- [ ] **Say what it is, with it on screen:** *"IdentityDbContext is Microsoft's own DbContext, with Identity's seven tables already declared in it. By inheriting from it instead of plain DbContext, my context gets those seven tables, and keeps my trucks, specials and dishes. One context, one database, both jobs. Identity sets up its seven tables in its own OnModelCreating. My context has an OnModelCreating too, for the trucks, and mine replaces Identity's. So the base line calls Identity's first, and then mine seeds the trucks."*
- [ ] ⚠️ **Terminal 1 — the prompt.** It prints `ENC0014: Updating the base class and/or base interface(s) of class requires restarting the application`, then `Do you want to restart your app?` **Answer `a`.** Say why while it restarts: *"Changing what a class inherits from is a change hot reload cannot make, so dotnet watch asks to restart. I answer a, for always, and from now on it restarts by itself when it has to. You get the same question in your lab."*
- [ ] 💡 *"If you forget the base OnModelCreating line, nothing errors here. The app fails the first time anything touches the database. Your lab README has the exact message."*

### Program.cs

- [ ] Open `Program.cs`. Add the two usings at the top:
  ```csharp
  using Microsoft.AspNetCore.Identity;
  using Curbside.Models;
  ```
- [ ] Paste this **just above `var app = builder.Build();`**:
  ```csharp
  // Identity: the users, and the cookie that remembers who is signed in.
  builder.Services.AddIdentity<AppUser, IdentityRole>()
      .AddEntityFrameworkStores<CurbsideContext>();
  ```
- [ ] And this **just above `app.UseAuthorization();`**:
  ```csharp
  app.UseAuthentication();
  ```
- [ ] **Say what they are:** *"The first block turns Identity on for my AppUser, and tells it to keep the users in my context. The second line reads the sign-in cookie on every request, before anything checks whether you are allowed in. It goes above UseAuthorization for exactly that reason."*
- [ ] Terminal 1 prints `Restart is needed to apply the changes` and restarts by itself — that is the `a` paying off. *"Program.cs runs once, when the app starts, so it needs a restart. Because I answered a, it did that by itself."*

### The migration

- [ ] Terminal 2. Say what you are going looking for: *"Identity's tables are in my model now and not in my database. A migration carries them across. Let's see what it makes."*
  ```bash
  dotnet ef migrations add AddIdentity
  ```
- [ ] Open the new `Migrations/…_AddIdentity.cs`. Scroll the `Up` method and count the `CreateTable` calls out loud: **seven** — `AspNetRoles`, `AspNetUsers`, `AspNetRoleClaims`, `AspNetUserClaims`, `AspNetUserLogins`, `AspNetUserRoles`, `AspNetUserTokens`
- [ ] *"Seven tables. Tonight we use one of them, AspNetUsers. Roles are next week."*
- [ ] 🎯 **Open the `AspNetUsers` block and read down its columns.** Stop on `PasswordHash`: *"Here is a column for the password hash. Now look for a column called Password. There isn't one. This database will never hold a password."*
- [ ] Terminal 2 — apply it:
  ```bash
  dotnet ef database update
  ```
- [ ] **mssql panel** — run this and let the columns sit on screen:
  ```sql
  SELECT * FROM AspNetUsers;
  ```
  No rows. *"The table is there, with every column a user needs, and nobody in it yet."*
- [ ] ⚠️ **Restart the app — Ctrl+R in terminal 1.** It prints `Restart requested.` EF Core works out what my tables look like once, when the app starts, and seven new tables arrived after this one started. Say why while it comes back up: *"I am restarting my app. EF Core works out the shape of my database once, when the app starts. I just added seven tables, so I start it again. I use Ctrl R, not Ctrl C. Ctrl R restarts the app, and dotnet watch still remembers that I chose always. Ctrl C would make it ask again. You do the same thing in your task 2."*

## Lab B · Task 2 — 15 minutes

- [ ] Lab README on screen, scrolled to **Task 2 in full**
- [ ] *"Task 2 is what I just did, on the Registry. Your user class is called Member. Then the context, then Program.cs, then the migration."*
- [ ] *"In the context, add the line that calls base OnModelCreating first. Then change the base class. When terminal 1 asks to restart, answer a."*
- [ ] *"After database update, press Ctrl R in terminal 1. Not Ctrl C."*
- [ ] 👀 **Watch for:** every page failing, check 1 included, with `The entity type 'IdentityPasskeyData' requires a primary key to be defined` — `base.OnModelCreating(modelBuilder);` is missing. `The type or namespace name 'IdentityDbContext<>' could not be found` — the using at the top of the context. The restart prompt unanswered in terminal 1 while they wonder why nothing changes. Anyone who added the package with no `--version` and got `NU1605` — the README's command is pinned for that reason
- [ ] **Stop:** the note after **Task 2 in full**. Where they should be: **`Passed: 2`**, `AspNetUsers` empty in the mssql panel, and the app restarted

## ☕ Break

## 3 · Register *(slides 4–5)*

### The Register pair

- [ ] In the editor — no slide yet. Say the goal: *"Now a way to make an account. It is a form and a controller, the same shape as every Create pair since week 6. Typing it again teaches nothing, so I am copying it in."*
- [ ] **Terminal 2:**
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-11/demo-section3/Curbside/. .
  ```
  Three files land: `ViewModels/RegisterViewModel.cs`, `Controllers/AccountController.cs` and `Views/Account/Register.cshtml`. Terminal 1 prints `Restart is needed to apply the changes` and restarts by itself
- [ ] Say it while it restarts: *"A ViewModel for the form, a controller with a Register pair, and the form itself. I am going to look at three lines in the controller."*
- [ ] **Open `ViewModels/RegisterViewModel.cs`.** *"The form posts an email, a password and the password again. Compare checks that the two passwords match. This class only carries what the form sends. It is not the AppUser that gets saved. The password reaches this class once, Identity turns it into a hash, and the password itself is never stored."*
- [ ] **Open `Controllers/AccountController.cs`, the Register POST.** Point at the three lines in order:
  ```csharp
  var result = await _userManager.CreateAsync(user, form.Password);
  ```
  *"CreateAsync makes the user. The password goes in here, and Identity hashes it before anything is saved."*
  ```csharp
  foreach (var error in result.Errors)
  {
      ModelState.AddModelError("", error.Description);
  }
  ```
  *"If Identity refuses, it says why, in the result. This loop copies its reasons onto the form, the same ModelState as week 6."*
  ```csharp
  await _signInManager.SignInAsync(user, isPersistent: false);
  ```
  *"And if it worked, this signs the new user in."*

### Never stored *(slide 4)*

- [ ] **Browse to `/Account/Register`** — there is no link to it yet. Fill it in: **Email** `ada@example.com`, then `password` in **Password** and again in **Confirm password**. **Submit.**
- [ ] 🎯 Three messages: `Passwords must have at least one non alphanumeric character.`, `Passwords must have at least one digit ('0'-'9').`, `Passwords must have at least one uppercase ('A'-'Z').` *"The Identity framework has password hardening rules built in by default. They can be overridden. The errors are on the form because of the foreach loop: it copies Identity's errors into ModelState, and the page shows them the same way as the form validation we have already seen."*
- [ ] The email is still filled in; the two password boxes come back empty. Type `Curbside-2026` in **Password** and again in **Confirm password**. **Submit.** It lands on the front page — **and the page looks exactly the same.** Say it before anyone asks: *"Nothing on the page changed. My navbar does not know about signing in yet. That is the next part. So the proof is somewhere else."*
- [ ] 🎞️ **GO TO SLIDE 4** — *The password is never stored* · *"CreateAsync took my password, and a hash is what it saved. A hash can be checked against a password. It cannot be turned back into one."*
- [ ] Still on slide 4, the middle line: *"That is why the migration had a PasswordHash column and no password column. Let's look at the row."*
- [ ] **Swipe to the editor, mssql panel:**
  ```sql
  SELECT UserName, Email, PasswordHash FROM AspNetUsers;
  ```
  One row. The hash is 84 characters and starts `AQAAAAIAAYagAAAAE`. *"That is everything this database knows about my password. Nobody who reads this table can tell you what I typed."*

### The cookie is the login *(slide 5)*

- [ ] **Swipe to the browser. DevTools → Application → Cookies → `http://localhost:…`.** Point at `.AspNetCore.Identity.Application`, and its **HttpOnly** tick
- [ ] *"This cookie is how the app knows I am signed in. SignInAsync set it. HttpOnly means the page's own JavaScript cannot read it."*
- [ ] 🎞️ **GO TO SLIDE 5** — *The cookie is the login* · *"HTTP remembers nothing between requests. So when I sign in, the server sends a cookie, and the browser sends it back with every request after that. Every page reads it, and that is how every page knows it is me."*
- [ ] Still on slide 5, the last line: *"Signing out deletes this cookie. You will watch that happen next."*

## Lab C · Task 3 — 15 minutes

- [ ] Lab README on screen, scrolled to **Task 3 in full**
- [ ] *"Task 3 is the register page. Paste the three files from the README. Then register once with the password password, and read the messages. Then register for real."*
- [ ] *"Your page will not change after you register. Open DevTools, Application, Cookies, and find the Identity cookie. That is how you know it worked."*
- [ ] 👀 **Watch for:** `The view 'Register' was not found` with the file right there — the restart prompt is waiting in terminal 1, which means it was a Ctrl+C restart and the `a` is gone; answer `a`. A refused form with no messages — the `foreach` that copies `result.Errors` into `ModelState` is missing, or the summary is `ModelOnly`. `Username '…' is already taken.` — they registered that email already; it worked the first time
- [ ] **Stop:** the note after **Task 3 in full**. Where they should be: **`Passed: 3`**, and the Identity cookie in DevTools

## 4 · Signed in, signed out *(slide 6)*

### Login and Logout

- [ ] In the editor. Say the goal: *"Now signing in and signing out. The same kind of pair, so the same move: copy it in."*
- [ ] **Terminal 2:**
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-11/demo-section4/Curbside/. .
  ```
  Three files: `ViewModels/LoginViewModel.cs`, `Views/Account/Login.cshtml`, and `Controllers/AccountController.cs` **replaced** by one that has Login and Logout too. Terminal 1 restarts by itself
- [ ] **Open `Controllers/AccountController.cs`, the Login POST**, and point at:
  ```csharp
  var result = await _signInManager.PasswordSignInAsync(
      form.Email, form.Password, form.RememberMe, lockoutOnFailure: false);
  ```
  *"PasswordSignInAsync checks the password against the hash, and if they match, it sets the same cookie as before."*
- [ ] Scroll to the bottom, the Logout action: *"Signing out deletes the cookie. Notice HttpPost on it. That matters when we get to the sign out button."*

### The navbar

- [ ] Say the goal: *"Now the navbar, so the page can finally tell me whether I am signed in."* Create `Views/Shared/_LoginPartial.cshtml` and paste:
  ```cshtml
  <ul class="navbar-nav align-items-sm-center">
  @if (User.Identity?.IsAuthenticated == true)
  {
      <li class="nav-item">
          <span class="navbar-text me-2">Signed in as @User.Identity.Name</span>
      </li>
      <li class="nav-item">
          <form asp-controller="Account" asp-action="Logout" method="post">
              <button type="submit" class="btn btn-link nav-link">Sign out</button>
          </form>
      </li>
  }
  else
  {
      <li class="nav-item">
          <a class="nav-link" asp-controller="Account" asp-action="Register">Create an account</a>
      </li>
      <li class="nav-item">
          <a class="nav-link" asp-controller="Account" asp-action="Login">Sign in</a>
      </li>
  }
  </ul>
  ```
- [ ] **Say what it is:** *"If the cookie says someone is signed in, the navbar shows their email and a Sign out button. If not, it shows links to create an account and to sign in."*
- [ ] Open `Views/Shared/_Layout.cshtml`. Paste this **between the navbar's `</ul>` and the `</div>` under it**:
  ```cshtml
  <partial name="_LoginPartial" />
  ```
- [ ] **Reload `/`.** 🎯 *Signed in as ada@example.com*, on the right of the navbar. *"There it is. I have been signed in since I registered. The cookie said so, and now the page can say it too."*

### Two rules *(slide 6)*

- [ ] **Open DevTools on the Application tab, Cookies, and click Sign out.** The navbar changes to *Create an account · Sign in*, and `.AspNetCore.Identity.Application` is **gone** from the list. *"Signing out deleted the cookie."*
- [ ] Click **Sign in**. `ada@example.com`, and a wrong password — `Curbside-2025`. Submit. *That email and password don't match an account.*
- [ ] 🎞️ **GO TO SLIDE 6** — *Two rules for a sign-in form* · the first rule: *"That message never says which half was wrong. If it said wrong password, a stranger would learn that this email has an account here. So it says the same thing either way."*
- [ ] Still on slide 6, the second rule: *"Sign out is a form that posts, never a link. A link sends a GET, and any page on the internet can make your browser send a GET, with an image tag. If a GET could sign you out, any page you visited could sign you out of my site."*
- [ ] **Swipe back to the browser.** Sign in with `Curbside-2026`. The navbar says *Signed in as ada@example.com*, and the cookie is back in DevTools

## Lab D · Task 4 — 12 minutes

- [ ] Lab README on screen, scrolled to **Task 4 in full**
- [ ] *"Task 4 is signing in and out. Paste the files from the README, then the partial, then the one line in your layout. Your navbar says Join where mine says Create an account."*
- [ ] *"Then sign out with DevTools open, and watch the cookie disappear. Sign in with a wrong password, then the right one."*
- [ ] 👀 **Watch for:** a navbar that never changes — the `<partial>` line went somewhere other than after the navbar's `</ul>`, or into a view instead of `_Layout.cshtml`. A sign-out that does nothing, or a `405` — the partial posts and the action isn't `[HttpPost]`, or the other way round. Anyone who made Sign out an `<a>` link — check 4 fails with a message saying why
- [ ] **Stop:** the note after **Task 4 in full**. Where they should be: **`Passed: 4`**, and they have watched the cookie go and come back

## ☕ Break

## 5 · `[Authorize]` *(slides 7–8)*

### Lock the controller *(slide 7)*

- [ ] Start from the browser, signed in, on `/Trucks`. Say the goal: *"I can sign in now, and it changes nothing. Anybody can still add a truck. Now the lock."*
- [ ] 🎞️ **GO TO SLIDE 7** — *Lock the controller, open the reads* · *"Here is the plan. Authorize goes on the controller class, so every action in it needs someone signed in. Then AllowAnonymous goes on the two actions that only read: the list, and a truck's page."*
- [ ] 🎯 Still on slide 7, the last line: *"Why the class and not each action? Because the class covers the POSTs too, and any action I add next month. If I put it on each action instead, the first one I forget is open."*
- [ ] **Swipe to the editor.** `Controllers/TrucksController.cs` — **type these; the attribute is the lesson.** At the top:
  ```csharp
  using Microsoft.AspNetCore.Authorization;
  ```
  Above the class:
  ```csharp
  [Authorize]
  ```
  Above `public IActionResult Index()` and again above `public IActionResult Details(int id)`:
  ```csharp
  [AllowAnonymous]
  ```
- [ ] **Say what it is:** *"Authorize says you have to be signed in. AllowAnonymous says this one action is open to anybody."*
- [ ] ⚠️ **Watch terminal 1: `Hot reload succeeded`.** That usually means the lock is on — but an attribute is the kind of edit hot reload can report as applied when it isn't, because MVC works out each action's filters when the app starts. **If the next beat lets a signed-out visitor straight into the form, press Ctrl+R in terminal 1 and try again.** Say it if it happens: *"The lock was not on yet. Hot reload does not always apply a change to an attribute. A restart always does."*

### The 302

- [ ] **Sign out first** (the navbar). Then open **DevTools → Network**, and say what to watch: *"I am signed out. I am going to click Add a truck. Watch the address bar, and the first line in the Network tab."*
- [ ] Click **＋ Add a truck**. 🎯 You land on the **Sign in** page. In the Network tab, the first request is `Create`, status **`302`**, and its **Location** header is `/Account/Login?ReturnUrl=%2FTrucks%2FCreate`
- [ ] *"The server answered with a 302, a redirect to the sign-in page. And it wrote down where I was trying to go, in ReturnUrl. Slash Trucks slash Create."*
- [ ] Sign in with `Curbside-2026`. 🎯 You land on **`/Trucks/Create`** — the form, not the front page. *"After I sign in, it sends me back to the page I wanted. That is what ReturnUrl is for."*
- [ ] 💡 *"I never told it where the sign-in page is. AddIdentity sends people to slash Account slash Login unless you say otherwise. That is why our controller is called Account and the action is called Login. These are the Identity framework's defaults."*
- [ ] **The other two controllers.** `Controllers/DishesController.cs` — the same using, `[Authorize]` above the class, `[AllowAnonymous]` above `Index()` and `Details(int id)`. `Controllers/SpecialsController.cs` — the using and `[Authorize]` above the class, and nothing else: it only has the Create pair. *"Every Curbside write needs an account now. Every read is still open to anybody."*

### Signed in is not trusted *(slide 8)*

- [ ] 🎞️ **GO TO SLIDE 8** — *Signed in is not trusted* · *"Here is what tonight did not fix. Anyone can create an account. All it takes is an email address. So the lock keeps out people who have not signed in, and anybody can sign in."*
- [ ] 🎯 Still on slide 8, the last line: *"Next week is roles: not just signed in, but signed in as someone allowed to do this. Until then, this is a known gap, and I am saying it out loud, the same way I named it last week."*

## Lab E · Task 5 — 12 minutes

- [ ] Lab README on screen, scrolled to **Task 5 in full**
- [ ] *"Task 5 is the lock on your Registry. Authorize on the CryptidsController class. AllowAnonymous on Index and Details."*
- [ ] ⚠️ *"Then leave SightingsController alone. Reports are what the public files. Nobody should have to sign in to report a sighting. Check 5 fails if you lock it."*
- [ ] *"Then sign out, try to file a creature, and watch where you end up."*
- [ ] 👀 **Watch for:** check 5 saying a POST got through — `[Authorize]` went on the GET actions, not the class. A signed-out visitor sent to sign in from `/Cryptids` or a creature's page — `[AllowAnonymous]` is missing from one of them. The lock that seems not to work — hot reload; Ctrl+R in terminal 1. **Sweep the room here** — this is tonight's in-class target
- [ ] **Stop:** the note after **Task 5 in full**. Where they should be: **`Passed: 5`** — checks 1 to 5, tonight's in-class target

## 6 · Customizing the user

### A property of my own

- [ ] In the editor — no slide for this part. Say the goal: *"The navbar shows my email. I would rather it showed a name. That is a property on my own user class, which is why AppUser exists."*
- [ ] `Models/AppUser.cs` — add the using at the top and the property inside the class:
  ```csharp
  using System.ComponentModel.DataAnnotations;
  ```
  ```csharp
  // What the navbar calls you. A new column on AspNetUsers.
  [StringLength(40)]
  public string DisplayName { get; set; } = "";
  ```
- [ ] **Say what it is:** *"A display name, up to forty characters. AspNetUsers is just a table, so a new property is a new column."*
- [ ] Terminal 2:
  ```bash
  dotnet ef migrations add AddDisplayName
  ```
- [ ] Open the new migration. One `AddColumn` on `AspNetUsers` — and **point at `defaultValue: ""`**: *"Ada's row is already in that table. This line says what she gets in the new column: an empty string."*
- [ ] Terminal 2:
  ```bash
  dotnet ef database update
  ```
- [ ] ⚠️ **Ctrl+R in terminal 1**, same reason as §2: *"A new column, so I restart."*

### Ada is older than the column

- [ ] `Views/Shared/_LoginPartial.cshtml` — select everything in the file and paste the replacement. Three lines are new: the two at the top, and the `var user` line inside the `@if`:
  ```cshtml
  @using Microsoft.AspNetCore.Identity
  @inject UserManager<AppUser> UserManager

  <ul class="navbar-nav align-items-sm-center">
  @if (User.Identity?.IsAuthenticated == true)
  {
      var user = await UserManager.GetUserAsync(User);
      <li class="nav-item">
          <span class="navbar-text me-2">Signed in as @user?.DisplayName</span>
      </li>
      <li class="nav-item">
          <form asp-controller="Account" asp-action="Logout" method="post">
              <button type="submit" class="btn btn-link nav-link">Sign out</button>
          </form>
      </li>
  }
  else
  {
      <li class="nav-item">
          <a class="nav-link" asp-controller="Account" asp-action="Register">Create an account</a>
      </li>
      <li class="nav-item">
          <a class="nav-link" asp-controller="Account" asp-action="Login">Sign in</a>
      </li>
  }
  </ul>
  ```
- [ ] **Say what it is:** *"The cookie says who I am, but not my display name. That is a column, so the navbar looks me up in the database and shows it."*
- [ ] **Make sure you are signed in as Ada before you ask.** If the navbar says **Sign in**, click it and sign in with `ada@example.com` and `Curbside-2026` — Ada is the account from §3, made before this column existed
- [ ] **Ask — the answer is the `defaultValue` line you just pointed at:** *"I am signed in as Ada. Her account was made before this column existed. What will my navbar say?"* Take answers
- [ ] **Reload `/`.** 🎯 *Signed in as* — and nothing after it. *"An empty string. Her row has the new column, and nothing in it."*
- [ ] *"This is week 10 again. An empty value needs something to show instead. What should the navbar show for someone with no display name?"* Take the answer: the email. Replace the whole file again — the `var name` line is new, and the `<span>` shows it:
  ```cshtml
  @using Microsoft.AspNetCore.Identity
  @inject UserManager<AppUser> UserManager

  <ul class="navbar-nav align-items-sm-center">
  @if (User.Identity?.IsAuthenticated == true)
  {
      var user = await UserManager.GetUserAsync(User);
      var name = string.IsNullOrEmpty(user?.DisplayName) ? User.Identity.Name : user.DisplayName;
      <li class="nav-item">
          <span class="navbar-text me-2">Signed in as @name</span>
      </li>
      <li class="nav-item">
          <form asp-controller="Account" asp-action="Logout" method="post">
              <button type="submit" class="btn btn-link nav-link">Sign out</button>
          </form>
      </li>
  }
  else
  {
      <li class="nav-item">
          <a class="nav-link" asp-controller="Account" asp-action="Register">Create an account</a>
      </li>
      <li class="nav-item">
          <a class="nav-link" asp-controller="Account" asp-action="Login">Sign in</a>
      </li>
  }
  </ul>
  ```
- [ ] **Reload.** *Signed in as ada@example.com*. *"If there is a display name, it shows that. If not, it shows the email."*

### On the form

- [ ] Say the goal: *"Now new accounts get a display name when they register."* Three small edits. `ViewModels/RegisterViewModel.cs`, under `Email`:
  ```csharp
  [Required]
  [Display(Name = "What should we call you?")]
  [StringLength(40, MinimumLength = 2)]
  public string DisplayName { get; set; } = "";
  ```
- [ ] `Views/Account/Register.cshtml`, **between the Email block and the Password block**:
  ```cshtml
  <div class="mb-3">
      <label asp-for="DisplayName" class="form-label"></label>
      <input asp-for="DisplayName" class="form-control" />
      <span asp-validation-for="DisplayName" class="text-danger"></span>
  </div>
  ```
- [ ] `Controllers/AccountController.cs`, the Register POST — the line that makes the user:
  ```csharp
  var user = new AppUser { UserName = form.Email, Email = form.Email, DisplayName = form.DisplayName };
  ```
- [ ] **Say what they are:** *"The form asks for a display name, and the Register POST puts it on the new user."*
- [ ] ⚠️ **Ctrl+R in terminal 1 before you test the form.** Terminal 1 may print `Hot reload succeeded` for all three edits, but a new property with validation rules on a ViewModel changes what ASP.NET works out about the form when the app starts, and hot reload does not always redo that. It has gone both ways in rehearsal. A restart costs a few seconds and always works. Say it: *"I am restarting before I try the form. The new box has rules on it, and ASP.NET reads those rules when the app starts."*
- [ ] Sign out, then **Create an account**: **Email** `bea@example.com`, **What should we call you?** `Bea`, and `Curbside-2026` in **Password** and again in **Confirm password**. 🎯 *Signed in as Bea*
- [ ] **mssql panel** — the two accounts, side by side:
  ```sql
  SELECT UserName, DisplayName FROM AspNetUsers;
  ```
  Two rows: `ada@example.com` with nothing in `DisplayName`, and `bea@example.com` with `Bea`. *"Ada's row was there before the column, so the migration gave her an empty string. Bea's display name came from the form. A property of my own, on the form, in the database, in the navbar."*

## Lab F · Task 6 — 13 minutes

- [ ] Lab README on screen, scrolled to **Task 6 in full**
- [ ] *"Task 6 is a field name for your members: the name they sign their reports with. The property, the migration, the form, and the navbar."*
- [ ] *"After database update, Ctrl R in terminal 1. The navbar file is one paste, with the fallback already in it, because your account is older than the column too."*
- [ ] 👀 **Watch for:** `Invalid column name 'FieldName'` — they skipped `database update`, or the restart after it. A navbar reading *Signed in as* and nothing — the `var name` fallback line is missing from their partial. Check 6 saying the form doesn't ask for it — the box went on `Register.cshtml` but the property isn't on `RegisterViewModel`, or the other way round
- [ ] **Stop:** the note after **Task 6 in full**. Where they should be: **`Passed: 6`**, and a new account whose field name is in the navbar

## Lab G · Catch up, or the stretch — 10 minutes

- [ ] Lab README on screen, scrolled to **The tasks**
- [ ] *"This is the last block, and it has no stop. If any of your checks are red, finish those first. If you are at six, the stretch at the bottom of the README fills in Reported by on the sighting form with your field name, when you are signed in."*
- [ ] *"The stretch has no check and no points. Tonight's in-class target was checks 1 to 5. Anything still red is Part 1 of your homework."*
- [ ] 👀 **Watch for:** anyone still red on check 5 — have them read the message; it says which door is open
- [ ] **No stop.** This block takes whatever time is left before the wrap-up. Anyone finished: the stretch, **🚀 Done early?** at the bottom of the README, or help a classmate

## 7 · Wrap-up, after the lab *(slide 9)*

- [ ] 🎞️ **GO TO SLIDE 9** — *Tonight, in one picture* · walk the five rows, one sentence each, and give the last row the emphasis: *"Signed in is not trusted. Anyone can make an account. Next week, the lock asks who you are, not just whether you signed in."*
- [ ] Homework: **the same six moves on their own app.** *"Your user class, the context, register, sign in and out, the lock on your writes, and one property of your own. Decide which of your pages should need an account, and put the lock on those."*
- [ ] ⚠️ Say what the self-check leaves behind, and what it does to your browser: *"The self-check creates one account on your site, week11-selfcheck at example dot com, and reuses it on every run after. It signs that account in and out to test your login, so when it finishes, your browser is signed out. Sign back in as yourself."*
- [ ] 💡 *"My Curbside is on localhost. Nothing is deployed for it. Yours is graded on its Azure URL, and the migration goes to the database before you deploy, same as week 9."*
- [ ] 🔗 Week 12: *"Next week is roles, claims, and securing the rest of the application: not just signed in, but signed in as someone who is allowed."*
