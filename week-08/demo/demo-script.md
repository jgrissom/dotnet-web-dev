# Week 8 Demo Script — Curbside Gets the Rest of CRUD ✏️🗑️

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-08/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it's due. Everything that isn't a 🎞️ line happens in the other state, so **you don't need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

> [!IMPORTANT]
> **Tonight the lab comes in five short blocks, one after each part of the demo that it practices.** Each block has its own `## Lab` section below — what to say, what to watch for, and the README note it stops at. The lab README goes on screen for every block; the lab slide goes up only for the last one, in §9. §3 and §5 have no lab task of their own, so each one runs straight into a ☕ break instead.

> [!IMPORTANT]
> **Tonight has two deliberate failures, and neither gets announced.** §6 saves an edit to a record that was deleted under it; §8 types a slogan into a form whose `[Bind]` list doesn't include it — and the save quietly **erases** the old value. That last one is the nastiest bug of the homework, met on your machine first. The terminal shares the stage with a new instrument tonight: **the debugger**, attached to a live process in §5.

## 0 · Before class

- [ ] ⚠️ **Re-rehearsing this week? Delete `instructor/week-08/Curbside` first** — a rehearsal leaves it in tonight's **end** state, and every beat below starts from week 7's. Deleting the folder in Finder is enough; the next step recreates it
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course/instructor/week-08`, create a new empty **folder** named `Curbside` and open it *(the dialog's **New Folder** button makes `week-08` too, the first time)*. **The folder stays empty — there is no `dotnet new` tonight;** the next step fills it with the starter. Its own week folder, so nothing here collides with another week's `Curbside` and no previous demo gets deleted
- [ ] Integrated terminal (**Ctrl+&#96;**) — fill the empty folder with tonight's starter. This is Curbside exactly as week 7's demo left it: context, two migrations, seven seeded trucks (`Sconnie Sliders` included), controller reading and writing through the context, `TruckData.cs` gone:
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-08/demo-starter/Curbside/. .
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
  **The drop is what makes the update work.** The shipped migrations are new files with new ids — a database that still has your week-7 `__EFMigrationsHistory` refuses them with *"there is already an object named 'Trucks'"*. Same trap the lab's task 1 drop exists to avoid; better to meet it here than in Lab A. Then check `/Trucks` shows **seven** cards. Tonight nobody watches this get created — that was last week's show
- [ ] **Install the scaffolder tool now** — it's per-machine, it's boring, and it's not part of the show:
  ```bash
  dotnet tool install --global dotnet-aspnet-codegenerator
  ```
  *(Already have it? `dotnet tool update --global dotnet-aspnet-codegenerator` — a 9.x tool against a 10.x SDK fails with a runtime error, same family as last week's `dotnet ef` skew.)*
- [ ] **Rehearse the whole script once in a separate copy (≈40 min).** Besides finding what's broken, the rehearsal warms your NuGet cache — §1 adds two packages live, and a warm cache makes those commands instant on class wifi
- [ ] 🚨 **Then run the drop + rebuild above again — the rehearsal used the same database.** A separate *copy* is not a separate database: the `<UserSecretsId>` ships in the `.csproj`, so every copy reads one secret and points at one database. Forty minutes of rehearsal leaves it in tonight's **end** state — `Slogan` column added, Ghost Kitchen gone — and §8 has nothing left to add in front of the room. **Last thing before class, always: drop, update, `/Trucks` shows seven cards**
- [ ] Run it, same terminal:
  ```bash
  dotnet watch
  ```
- [ ] **Open a second integrated terminal** (the `+` on the terminal panel — it opens in the same folder). `dotnet watch` owns the first one all night; everything you type tonight goes in the second — §1's two `dotnet add package` commands, §2's scaffolder, then §8's `dotnet ef migrations add` and `dotnet ef database update`
- [ ] ⚠️ **Know the one prompt that will bite you, and answer it `a` the first time.** Creating a *new* `.cshtml` (§4's `Edit.cshtml`, §6's `Delete.cshtml`) is a change hot reload can't apply, so watch stops and asks **`Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`** — **in terminal 1, while you're typing in terminal 2.** Miss it and the page 500s with *"The view 'Edit' was not found"*, naming the exact path the file is sitting at. Answer **`a`** at the first prompt and it never asks again all night
- [ ] **Park three browser tabs**: `/Trucks`, `/Trucks/Details/2`, and **week 8's lab README** on github.com — it goes on screen for every lab block tonight
- [ ] **mssql extension** signed in, saved server connection tested, panel closed. It has **one** appearance tonight — §8, confirming the new column and its seven slogans — so it's a supporting actor this week, not the lead it was in week 7
- [ ] **Rehearse the §5 debugger attach once on this machine — restart the app first (`Ctrl+C`, `dotnet watch`), because a hot-reloaded process refuses the attach outright.** The first-ever *Attach to a .NET process* can stop to fetch debugger assets, and that download is not something you want between a breakpoint and a room full of people. Once it's cached, the attach is instant all term
- [ ] **Keep the terminal visible** (it's sized in the Teaching profile below). The generated SQL is still the evidence: tonight adds `UPDATE` and `DELETE` to the vocabulary, and §5 watches the gap between `Update()` and `SaveChangesAsync()` through it
- [ ] **Teaching profile in VS Code** (gear, bottom-left → **Profiles** → *Teaching*): C# and mssql extensions only, **no C# Dev Kit**. Bump both font sizes **in that profile** so they stick: `terminal.integrated.fontSize` (start around **18** — §5 reads the generated SQL from it) and `editor.fontSize` (around **16**)
- [ ] **Say it before you start: *"lids down — you'll run the scaffolder yourself in the lab."*** Curbside isn't in the public repo, so nobody can follow along, and tonight's paste blocks are big
- [ ] Sanity check: `/Trucks` shows **seven** cards, filing a truck works, a restart doesn't lose it

**🖥️ On screen, at curtain** — checklist above done, this is what the room walks in to; the projector's second state, side by side:

- **VS Code**, left half — folder `~/Repos/dotnet-web-dev-course/instructor/week-08/Curbside`, two integrated terminals (`dotnet watch` in the first, everything you type in the second), and the `mssql` panel signed in but closed
- **Browser**, right half — three tabs: `/Trucks`, `/Trucks/Details/2`, and the week 8 lab README

## 1 · Where we left off *(slides 2–4)*

### The payoff, retold

- [ ] **Before any slide:** on `/Trucks`, add nothing, change nothing — just `Ctrl+C` in the terminal, `dotnet watch` again, reload
- [ ] **Seven trucks.** *"Last week that reload was the whole show. This week it's just true."*
- [ ] *"You can read a table, show one row of it, and add to it. In CRUD terms you have C and R (Create and Read). Tonight is U and D (Update and Delete) — and most of it gets written for you."*

### Collect the reading *(slide 2)*

- [ ] **Collect the reading before any slide goes up** — the slide lists the answers: *"Suppose we want to implement the UPDATE part of CRUD. How is it different from CREATE? We need a form? We need an http post? What is different?"* Take three or four answers out loud
- [ ] 🎞️ **GO TO SLIDE 2** — *What Edit needs* · walk the slide's three, crediting the room for each one they found: *"The big difference is that the form arrives pre-filled with the record's existing field values. In order to do that, the app has to know which record. And the save is an UPDATE, not an INSERT."*
- [ ] 🎯 **Then the reading's second question — it's the slide's bottom line — and don't answer it:** *"when you hit Save on an edit, how does the app know which record you meant? Your Create form never sends an Id."* Take guesses. *"We are going to find that out in today's class."*

### The shape of the night *(slide 3)*

- [ ] 🎞️ **GO TO SLIDE 3** — *The other two letters* · *"Tonight has three steps. First, a tool called the scaffolder writes a controller with Edit and Delete in it. Second, we read the code the scaffolder wrote, line by line. Third, we copy Edit and Delete into our own controller, and we delete everything else the scaffolder wrote."*
- [ ] Still on slide 3, the bottom line: *"Look at what does not change tonight. Your model, your validation rules, your theme, your seed data and your database all stay exactly as they are. Tonight adds Edit and Delete beside the code you already have. Nothing you have already built gets rewritten."*
- [ ] **✓ CHECKPOINT:** the room can name the three things Edit needs that Create didn't

### Two packages and a tool *(slide 4)*

- [ ] 🎞️ **GO TO SLIDE 4** — *Two packages and a tool*
- [ ] **Two packages and one global tool** — *"These tools are needed to enable scaffolding. Scaffolding means a tool writes code for you. You give the tool a model class and a DbContext. It writes a controller with the Create, Read, Update and Delete actions, and the views that go with them. Once the code is written we no longer need the two packages, so we remove them again before we commit"*
- [ ] In the second terminal — **type the first, paste the second**:
  ```bash
  dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design --version 10.0.2
  dotnet add package Microsoft.EntityFrameworkCore.Tools --version 10.0.10
  ```

  ⚠️ **The versions are pinned here on purpose, and nowhere else.** Tonight's starter is frozen at EF `10.0.10`. An unpinned `dotnet add package` takes whatever shipped most recently, and a newer `Tools` demands a newer `Design` than the starter pins — that's `NU1605`, *"Detected package downgrade"*, and the build fails in front of the room. A pinned version stays on nuget.org forever, so this command keeps working no matter what ships between now and class. **Slide 4 shows the commands without versions, and that is correct for the students** — their app is live rather than frozen, so they add these unpinned. If anyone asks about the flag, that's the answer
- [ ] Name the split: *"`CodeGeneration.Design` is the scaffolder's templates · `EntityFrameworkCore.Tools` is the part that reads your `DbContext`."*
- [ ] **The third piece is the command itself — say it, don't run it** (you installed it on this machine in §0): *"There is a third piece: the command that does the scaffolding. It is called `dotnet-aspnet-codegenerator`. It is installed once on each computer, not in each project, the same way `dotnet-ef` is. I installed it on this computer before class. You install it on yours in task 1, in the lab block that comes next. If you are on a lab computer that resets itself, the command is gone the next time you sit down, and you run the same install command again"*
- [ ] Point at the `.csproj` — two more `<PackageReference>` lines, same as every package since week 7. *"All those two commands did was add two lines to this file"*
- [ ] ⚠️ **`dotnet watch` now prints yellow `NU1901` warnings — name them, don't skip past them:** *"NuGet audits every package you depend on, including the ones your packages depend on. `NuGet.Packaging` and `NuGet.Protocol` come in six levels under the scaffolder, and they've got a **low**-severity advisory against them. Read the line above it — **build succeeded**. Warnings, not errors"* — then plant the payoff: *"and, we are going to remove them from our project when we are done with them."* (§7 removes the packages). ⚠️ **A few seconds after the app starts, watch also prints two lines reading `msbuild: [Failure] Msbuild failed when processing the file …`** — the same two advisories, and nothing has failed. *"The app is running, and the build succeeded."*
- [ ] 🎯 **Then say where they meet these next:** *"The lab starter already has these two packages. So when you start your app in the lab block that comes next, you will see these same yellow warnings in your own terminal. You will also see two lines that say Msbuild failed. Those lines end with the same advisory, and nothing has failed. All of them are temporary. They stop when you remove the two packages in task 4."*

## Lab A · Setup and task 1 — 12 minutes

- [ ] Put the **lab README** on screen — the tab you parked in §0 — scrolled to **Setup**
- [ ] *"Tonight the lab comes in five short blocks. After each part of the demo, you do the same thing to the Registry. Each block ends at a note that says In class, stop here."*
- [ ] *"The first block is setup and task 1. Task 1 installs the scaffolder tool, sets your connection string, and rebuilds your database. Use the same database name as last week."*
- [ ] ⚠️ **The drop is not optional, and say why:** *"In this block of the lab, you will drop and recreate the database, because your week-7 database's migration history is yours — your timestamps, your files. The starter ships mine — different timestamps. They can't mix: point the starter at that database and it fails with 'there is already an object named Cryptids'. Drop it, and one `database update` rebuilds the whole thing, creatures included. The fact that that works is what a migration IS"*
- [ ] ⚠️ **Then fence it, in the same breath** — *"you only ever drop a database you could rebuild from scratch — and tonight's is exactly that, a throwaway I can hand you again from a git clone. Your own project's database has records in it that nothing can hand back. There, a bad migration is fixed by adding another one"*
- [ ] ⚠️ **And separate it from the folder, because tonight is also the night they stop deleting the `Migrations` folder** — *"The `Migrations` folder stays — those files are what rebuild it. Drop the database, keep the files. Deleting the folder is the thing that stops working tonight"*
- [ ] ⚠️ *"If you're on a lab computer that resets itself, the scaffolder tool is gone next time you sit down, the same as your secret. Both come back in under a minute."*
- [ ] *"Same warning as last week: the checks never touch SQL Server. Six out of six does not prove your connection string works. Your browser proves that."* Then the target: *"Tonight's in-class target is checks 1 to 4."*
- [ ] 👀 **Watch for:** `There is already an object named 'Cryptids'` — they skipped the drop. `msbuild: [Failure] Msbuild failed…` in terminal 1 after `dotnet watch` starts — the `NU1901` advisory again, not a failure; the README's Setup note covers it. `MSB1009` — one folder too deep. A 9.x scaffolder tool — `dotnet tool update --global dotnet-aspnet-codegenerator`. And `Login failed` or a ~30-second network error on `database update` — the username or password, or the server name
- [ ] **Stop:** the note after **Task 1 in full**. Where they should be: `dotnet test` prints **`Passed: 1`**, the app is running in terminal 1, and `/Cryptids` shows six creatures

## 2 · The scaffolder *(slides 5–6)*

### One command *(slide 5)*

- [ ] 🎞️ **GO TO SLIDE 5** — *One command* · **the slide states the scale; you supply what it cost them:** *"since week 4 you've built a controller, five views, a form with validation, and the links between them. That took us four weeks. This one command writes all of that code for us"*
- [ ] Swipe back and run it — **paste, it's long**:
  ```bash
  dotnet aspnet-codegenerator controller -name TrucksScaffoldController -m Truck -dc CurbsideContext --relativeFolderPath Controllers --useDefaultLayout --referenceScriptLibraries
  ```
- [ ] Read the output out loud, all six lines: *"one controller, five views. A few seconds"*
- [ ] Browse to **`/TrucksScaffold`**. A working list — a table, not your cards, but every truck is in it
- [ ] **Click Edit on Cheese Curd Cartel, change the rating to 4.9, save.** It lands back on the scaffold's list, updated
- [ ] 🎯 **Now switch to the `/Trucks` tab and reload: 4.9.** *"Two UIs, one table. And notice what just happened — a record was edited and saved, tonight's whole topic, and we haven't written a single line of code. The framework's generated pages and your hand-built pages are the same kind of code, and they read and write the same database"*

### What it didn't write *(slide 6)*

- [ ] Ask the uncomfortable question yourself before someone else does: *"so why did we spend four weeks?"*
- [ ] 🎞️ **GO TO SLIDE 6** — *What it didn't write* · *"Here is why. These four things are yours, and the scaffolder wrote none of them. It read your model, your validation rules and your context to do its work. It could not have written them, because they are your decisions about your app."* Give the room a moment to read the four rows — don't read them out
- [ ] 🎯 **The sentence:** *"It wrote the code every CRUD app needs. It made none of your decisions. Every line it generated is a line you could now write yourself, and that is why it is fine to let a tool write it. In week 4 you could not have read this code. Tonight you can, and we read it together after your lab block"*
- [ ] **✓ CHECKPOINT:** someone can say what the scaffolder read to do its work — the model, the context, and the annotations on them

## Lab B · Task 2 — 7 minutes

- [ ] Lab README on screen, scrolled to **Task 2 in full**
- [ ] *"The same command you just watched, against the Registry. Run it from inside Cryptids.Web, the same folder as every dotnet ef command."*
- [ ] *"The two scaffolding packages are already in the starter's project file, so nobody waits on NuGet. Your own app needs them added by hand this week, and the commands are in the notes."*
- [ ] *"Then use the scaffold's Edit page to change a creature, and reload your own page. Two UIs, one table — the same thing I did with Cheese Curd Cartel."*
- [ ] 👀 **Watch for:** `Could not execute because the specified command or file was not found` — the tool isn't installed, top of task 1. *"…install Entity Framework core packages…"* — they're not inside `Cryptids.Web`. `Scaffolding failed: Build failed` — the project doesn't compile; `dotnet build` shows the real error. And a typo in `-dc CryptidContext`: the scaffolder's errors name what's missing, so have them read the message rather than re-run it. **Sweep the room in this block** — task 1 is a drill most of them have done twice, and task 2 is where tonight's new failures live
- [ ] **Stop:** the note after **Task 2 in full**. Where they should be: **`Passed: 1`** — the scaffold turns no check green, and that's expected. `/CryptidsScaffold` lists six creatures

## 3 · Read what it wrote *(slides 7–9)*

### Task is a Promise *(slide 7)*

- [ ] Open `Controllers/TrucksScaffoldController.cs`. **Skim the shape first:** *"before we read closely — this is my week-7 controller with more checks added. Same constructor, same context, same actions"*
- [ ] Point at `Index`: `return View(await _context.Trucks.ToListAsync());` *"slightly different from the way we wrote it - the scaffolded code is using asynchronous methods"* — one line, three changes: `async Task<IActionResult>`, `await`, `ToListAsync`
- [ ] 🎞️ **GO TO SLIDE 7** — *Task is a Promise* · 🎯 lean on what they know: *"if you have written `async`/`await` in JavaScript, you already know this shape."*
- [ ] The *why*, one sentence, no more: *"while SQL Server is thinking, an `await`ed request lets go of its thread so the server can handle someone else. Under load that's the difference between queueing and keeping up"*
- [ ] The honest rule: *"your week-7 sync code is not wrong and does not need rewriting tonight. The scaffolder writes async, so what we write from tonight is async. Both run side by side in one controller without complaint"*
- [ ] 💡 If someone spots `Create()` GET is still sync: give them the point — *"nothing in it waits for anything. `async` only goes on a method that actually awaits something"*

### The Edit pair, in the editor

- [ ] Still in `TrucksScaffoldController.cs`, find the two `Edit` methods — **GET half first**
- [ ] Read the GET straight down — it answers three questions in order: *"if the id is not specified, we return 404, if a matching truck record is not found, we return 404, otherwise, we return the matching truck."*
- [ ] The POST signature: `Edit(int id, Truck truck)` — *"two parameters: the id from the URL, and the record from the form. The first thing the method does is check that they agree"*

### The hidden Id *(slide 8)*

- [ ] Open `Views/TrucksScaffold/Edit.cshtml`. Let them look for a second — it's their Create form with different markup
- [ ] 🎯 **Point at line 15** and say *"What is this id doing here?"* Let them come up with the answer. *"It's used to identify the record we are editing."*
  ```html
  <input type="hidden" asp-for="Id" />
  ```
- [ ] 🎞️ **GO TO SLIDE 8** — *The hidden Id* · *"There it is — the difference between create and edit. Your Create form never sends an Id; this one does. The GET put it there, the browser sends it back with everything else, and the binder reads it into `truck.Id`. That's the whole answer: one input the user never sees"*
- [ ] 🔗 Connect it to the guard: *"and now `if (id != truck.Id) return NotFound();` makes sense — if the URL and the form disagree about which record this is, someone's tampering or something's broken, and either way the answer is no"*

### The guest list *(slide 9)*

- [ ] Back in the controller, POST `Edit`. **Read the generated comment out loud** — *"To protect from overposting attacks, enable the specific properties you want to bind to"* — then define the two words it assumes you know: *"**binding** you met in week 6 — the fields in the request get matched up by name with properties on `Truck`. What nobody mentions is that it matches every property it can find, not just the ones your form has inputs for. And a form does not limit what can be sent: what actually arrives is a flat list of name-and-value pairs, and anyone can add a line to that list by hand. **Overposting** is doing exactly that — posting more fields than you ever offered, hoping the binder sets something you never put on the page"*
- [ ] 🎞️ **GO TO SLIDE 9** — *The guest list* · **`[Bind("Id,Name,Cuisine,City,Rating,IsOpenLate")]`** — *"a guest list for model binding. Only names on the list are read out of the form. Everything else is ignored — no matter what a POST claims"*
- [ ] Still on slide 9, the one-sentence why: *"imagine `Truck` had an `IsAdmin` property. No box on your form — but a hand-written POST can send `IsAdmin=true` anyway, and the binder would set it. The list stops the binder from setting a field you never offered"*
- [ ] ⚠️ **Still on slide 9 — flag it for later, but don't say what goes wrong:** *"remember the guest list — this `[Bind]` line, right here. We come back to it in the last part of the demo, and by then it will be causing a problem instead of preventing one"*
- [ ] **Swipe back to the editor** — the POST `Edit` in `TrucksScaffoldController.cs`. Point at the two lines in its body, `_context.Update(truck)` and `await _context.SaveChangesAsync()` — 🔗 *"the same two-step as `Add`: mark it, then write it. Update marks the whole record modified; the UPDATE runs at save"*
- [ ] Still in the editor, point at the `catch (DbUpdateConcurrencyException)` below them: *"notice the catch block - if the UPDATE matched no row — the record was deleted while the form was open. The catch checks whether the record still exists, and if it does not, returns 404. You'll see this catch run when we get to Delete"*
- [ ] **✓ CHECKPOINT:** the room can say what travels in the hidden input, and what `[Bind]` does

## ☕ Break

## 4 · Port Edit *(slide 10)*

### Keep what's yours *(slide 10)*

- [ ] 🎞️ **GO TO SLIDE 10** — *Porting: keep what's yours* · *"The scaffold is code we copy from. It is not code we keep. We take the two Edit actions and the mechanics of the view, and we keep our theme, our markup, our names. Once it's ported, the scaffold gets deleted"*
- [ ] **Copy the two `Edit` methods out of `Controllers/TrucksScaffoldController.cs`** — the GET and the POST sit together, so one selection takes both, with the comment lines above each. Paste them into `Controllers/TrucksController.cs`, below `Create`
- [ ] The editor now underlines two names: `TruckExists` and `DbUpdateConcurrencyException`. Take `TruckExists` first — go back to `TrucksScaffoldController.cs`, copy the `TruckExists` method from the bottom of the class, and paste it below the Edit pair
- [ ] ⚠️ **Say it while you paste it:** *"We copied three methods, not two. The catch calls this helper, and the scaffolder kept it private at the bottom of the file we are about to delete. If you take the two actions and leave the helper behind, your project stops compiling with 'the name TruckExists does not exist'."*
- [ ] One name is still underlined. Add this at the top of `TrucksController.cs`, and the file compiles:
  ```csharp
  using Microsoft.EntityFrameworkCore;
  ```
- [ ] The two comments you copied still say `TrucksScaffold/Edit/5`. Change both to `Trucks/Edit/5`
- [ ] 💡 **Fallback only — skip this if the copy worked.** The same pair, with the `ModelState` check written as an early return, which is how the lecture notes and the lab show it. Both shapes do the same thing; say so if someone asks why the notes look different:

  <details><summary>📋 fallback paste: the Edit pair, into TrucksController</summary>

  ```csharp
  // GET /Trucks/Edit/3 — the form, pre-filled with what's on file.
  public async Task<IActionResult> Edit(int? id)
  {
      if (id == null)
      {
          return NotFound();
      }

      var truck = await _context.Trucks.FindAsync(id);
      if (truck == null)
      {
          return NotFound();
      }
      return View(truck);
  }

  // POST /Trucks/Edit/3 — the corrected record comes back.
  [HttpPost]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Cuisine,City,Rating,IsOpenLate")] Truck truck)
  {
      if (id != truck.Id)
      {
          return NotFound();
      }

      if (!ModelState.IsValid)
      {
          return View(truck);
      }

      try
      {
          _context.Update(truck);
          await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
          if (!TruckExists(truck.Id))
          {
              return NotFound();
          }
          else
          {
              throw;
          }
      }
      return RedirectToAction(nameof(Index));
  }

  private bool TruckExists(int id)
  {
      return _context.Trucks.Any(e => e.Id == id);
  }
  ```

  </details>

- [ ] **Make the Edit view from the Create view.** In the Explorer, copy `Views/Trucks/Create.cshtml`, paste it into the same folder, and rename the copy `Edit.cshtml`. *"An Edit form is a Create form with a few changes. I copy the Create view, and then I change the copy."*
- [ ] ⚠️ **First new `.cshtml` of the night — terminal 1 is asking to restart.** Answer **`a`** (Always) and you won't see the prompt again tonight; §6 adds another view. Skip it and the Edit page 500s with *"The view 'Edit' was not found"*, listing the very path the file is at
- [ ] Change 1, the page title:
  ```csharp
  ViewData["Title"] = $"Edit: {Model.Name}";
  ```
- [ ] Change 2, the heading:
  ```html
  <h1>Edit this truck ✏️</h1>
  ```
- [ ] Change 3, on the `<form>` tag: `asp-action="Create"` becomes `asp-action="Edit"`. *"The form has to post to the Edit action. If I leave this as Create, the save goes to the wrong action."*
- [ ] 🎯 Change 4, the hidden `Id`. Open `Views/TrucksScaffold/Edit.cshtml`, copy line 15, and paste it into `Views/Trucks/Edit.cshtml` below the validation summary `<div>`. *"This is the one line I take from the scaffold's view. It is the hidden Id I pointed at when we read the scaffold."*
- [ ] Change 5, the button text: `Add it` becomes `Save changes`
- [ ] Change 6, the Cancel link goes to this truck's Details page:
  ```html
  <a asp-action="Details" asp-route-id="@Model.Id" class="btn btn-link">Cancel</a>
  ```
- [ ] *"Six changes. Four of them are wording and where Cancel goes. Two of them make this an Edit form: it posts to Edit, and it carries the truck's Id."*
- [ ] 💡 **Fallback only — skip this if the six changes worked.** The finished file:

  <details><summary>📋 fallback paste: Views/Trucks/Edit.cshtml</summary>

  ```html
  @model Truck
  @{
      ViewData["Title"] = $"Edit: {Model.Name}";
  }

  <h1>Edit this truck ✏️</h1>

  <form asp-action="Edit" method="post" class="col-md-6">
      <div asp-validation-summary="ModelOnly" class="text-danger"></div>

      <input type="hidden" asp-for="Id" />

      <div class="mb-3">
          <label asp-for="Name" class="form-label"></label>
          <input asp-for="Name" class="form-control" />
          <span asp-validation-for="Name" class="text-danger"></span>
      </div>

      <div class="mb-3">
          <label asp-for="Cuisine" class="form-label"></label>
          <input asp-for="Cuisine" class="form-control" />
          <span asp-validation-for="Cuisine" class="text-danger"></span>
      </div>

      <div class="mb-3">
          <label asp-for="City" class="form-label"></label>
          <input asp-for="City" class="form-control" />
          <span asp-validation-for="City" class="text-danger"></span>
      </div>

      <div class="mb-3">
          <label asp-for="Rating" class="form-label"></label>
          <input asp-for="Rating" class="form-control" />
          <span asp-validation-for="Rating" class="text-danger"></span>
      </div>

      <div class="form-check mb-3">
          <input asp-for="IsOpenLate" class="form-check-input" />
          <label asp-for="IsOpenLate" class="form-check-label"></label>
      </div>

      <button type="submit" class="btn btn-primary">Save changes</button>
      <a asp-action="Details" asp-route-id="@Model.Id" class="btn btn-link">Cancel</a>
  </form>

  @section Scripts {
      <partial name="_ValidationScriptsPartial" />
  }
  ```

  </details>

- [ ] Add the link in `Views/Trucks/Details.cshtml`, under the badge block, above the **Back to all trucks** link:
  ```html
  <p class="mt-4"><a asp-action="Edit" asp-route-id="@Model.Id" class="btn btn-secondary">✏️ Edit this truck</a></p>
  ```

### Watch the UPDATE

- [ ] **On `/Trucks`, click ＋ Add a truck** and add tonight's test subject — **`Ghost Kitchen` / `Fusion` / `Madison` / `4.9`**. *"We use this truck for the rest of the demo"* — on a fresh database it lands as **Id 8**

  💡 **Ghost Kitchen runs the rest of the night** — corrected here, inspected in the debugger in §5, deleted in §6, and its ghost 404s an open edit form. It is *not* seed data, so if a beat goes sideways and it dies early, or you jump back into §5 after a database rebuild, just add it again with the same values. Nothing depends on its id except your narration — check what it actually came back as before you say a number
- [ ] Open its Details → **Edit this truck**. 🎯 *"`FindAsync` looked the record up and designated the located truck as our view's model, exactly as we read it in the scaffold"*
- [ ] Change the rating to **4.7**. **Predict before saving:** *"what SQL is about to appear — and what will its WHERE clause say?"*
- [ ] Save. **Read the terminal:** an `UPDATE [Trucks] SET ... WHERE [Id] = @p...` 🎯 *"There is the hidden Id, in the WHERE clause. One row was updated"*

## Lab C · Task 3 — 10 minutes

- [ ] Lab README on screen, scrolled to **Task 3 in full**
- [ ] *"Copy the two Edit methods out of your CryptidsScaffoldController, the same way I just did. Paste them into CryptidsController, below Create. Then make the Edit view from your Create view, the way I did, and add the link."*
- [ ] *"It's three methods, not two. Copy the CryptidExists helper from the bottom of the scaffold controller too, or the project stops compiling."*
- [ ] *"Edit.cshtml is your first new view tonight. The terminal running dotnet watch will ask to restart. Answer a, and it won't ask again."*
- [ ] 👀 **Watch for:** *"the name 'CryptidExists' does not exist"* — they left the helper behind. `DbUpdateConcurrencyException` unresolved — the `using Microsoft.EntityFrameworkCore;` line. A **404 on `/Cryptids/Edit/3`** before any form shows — they copied only the POST `Edit`; the GET is the method above it in the scaffold. `The view 'Edit' was not found` with the file right there — the restart prompt is waiting in terminal 1; **don't let them move the file**. And a second creature appearing after a save instead of a corrected one — no hidden `Id` **and** no id in the form's action, which check 3 catches by counting. And a correction that fails with `Cannot insert explicit value for identity column` — `Edit.cshtml` still says `asp-action="Create"`; **the checks pass either way**, so only the browser shows it. **Sweep the room when the first Edit ports land** — those last two don't show up as errors
- [ ] **Stop:** the note after **Task 3 in full**. Where they should be: **`Passed: 3`** — checks 1 to 3

## 5 · The debugger, finally *(slides 11–12)*

### Attach to the process *(slide 11)*

- [ ] 🎞️ **GO TO SLIDE 11** — *The debugger, finally* · *"Since week 1 you've had a debugger and we've never needed it — `Console.WriteLine` and the SQL log answered everything. Tonight there's a question they can't answer: what does the object look like in the moment between the form and the database? Time to attach"*
- [ ] Say why it's *attach* and not F5: *"`dotnet watch` is already running the app, so we don't launch a second copy — we attach to the one that's running"*
- [ ] ⚠️ **Restart the app before you attach — `Ctrl+C`, then `dotnet watch` again, and let it come all the way up.** You cannot attach to a process that hot reload has patched, and §4 edited the controller, so this is always the state you are in by now. The refusal is explicit and it names the fix: *"Attaching a .NET debugger to this process is not allowed because code changes have been applied. The process must be restarted to allow debugging."* This is not optional and it is not intermittent — skip it and the segment cannot start
- [ ] **⇧⌘P → "Debug: Attach to a .NET 5+ or .NET Core process" → type `Curbside` → pick the process.** ⚠️ Two appear on some machines — `dotnet watch` and `Curbside`; you want **Curbside**, the app itself
- [ ] 🗣️ **Say the Windows shortcut, not the one you just pressed** — *"Ctrl+Shift+P for most of you"*. The slide shows both; almost everyone in the room is on Windows and you are not
- [ ] Set a breakpoint on the **`if (id != truck.Id)`** line of the ported Edit POST — click in the gutter, red dot
- [ ] ⚠️ **Now stop editing code until you detach.** Any save sends the watcher rebuilding, and a breakpoint set against a build that has been replaced shows as a **hollow circle** and never fires. If that happens: detach (`Shift+F5`), `Ctrl+C`, `dotnet watch`, re-attach

### Update marks, SaveChanges writes *(slide 12)*

- [ ] In the browser: Edit **Ghost Kitchen**, change the rating to **4.8**, Save — **VS Code takes the screen mid-request**
- [ ] 🎯 **Open `truck` in the Variables panel and walk it:** Name `Ghost Kitchen`, Cuisine `Fusion`, City `Madison`, Rating `4.8`, and its id — **`8` on a fresh database, but read it off the panel rather than saying it from here.** *"That object did not exist a millisecond ago. Model binding built it out of the form. In week 6 I told you that happens. Now you can see the object it built"*
- [ ] Hover `ModelState` → `IsValid: true`. *"The guard you're paused on is reading this"*
- [ ] **F10** — step over the guard, the `ModelState` check, down to `_context.Update(truck)`. **F10 past it**, then 🎯 **point at the terminal: no SQL.** *"Update ran, and no SQL appeared. It marked the record as modified. It did not write it. Last week I could only tell you that about `Add`. Tonight you can see it"*
- [ ] **F10 over `SaveChangesAsync`** — 🎯 **the UPDATE appears in the terminal.** *"There. That line is the database call. The lines before it only prepared the change"*
- [ ] **F5** to let the request finish; the browser gets its redirect
- [ ] ⚠️ **`Shift+F5` to detach — before §6, not optional.** Your breakpoint is on `if (id != truck.Id)`, the first line of the Edit POST, and **§6 submits an edit** to fire the concurrency 404. Stay attached and VS Code grabs the screen at the breakpoint instead — the beat dies for a reason that looks like nothing. Detaching is enough; the red dot can stay, it can't fire with nothing attached
- [ ] 🎞️ **GO TO SLIDE 12** — *Update marks. SaveChanges writes.* · recap on the slide what they just watched, because it stays true with no debugger attached: *"bind, guard, mark, write — you stepped through all four. Last week's bug was a missing `SaveChanges`: leave `SaveChanges` out and the form still submits, the guard still passes, the redirect still happens, and nothing ever reaches the database. Now you've seen why. `Update` only marks it"*
- [ ] 💡 If asked "when would I use this myself?": *"any time the question is 'what is this object right now?' — a form that binds zeros, a guard that fails when you're sure it shouldn't. Attach, breakpoint, look. It's faster than ten `Console.WriteLine`s, and it shows you the real values"*
- [ ] **✓ CHECKPOINT:** the room can say what `Update()` did and what `SaveChangesAsync()` did — having seen the gap between them

## ☕ Break

## 6 · Delete asks first *(slides 13–15)*

### Why Delete asks first *(slide 13)*

- [ ] **Predict before the slide:** *"Delete could be one link — click it, record's gone. Why doesn't anyone build it that way?"* Take answers
- [ ] 🎞️ **GO TO SLIDE 13** — *Why Delete asks first* · the rule underneath: **a GET must never change data.** Link previews, browser prefetch, crawlers, a curious extension — *"things you don't control follow links all day. If following a link deletes a truck, then anything that follows your links can delete your data"*
- [ ] So: *"the GET shows a confirmation page — the record that is about to be deleted, and a button. The POST does the deleting."* Two requests, on purpose

### The Delete pair *(slide 14)*

- [ ] 🎞️ **GO TO SLIDE 14** — *The Delete pair*. Read the scaffold's version in `TrucksScaffoldController.cs` first — one wrinkle worth a beat: **the POST is called `DeleteConfirmed`**
- [ ] 🎯 Say why: *"two methods named `Delete` taking the same `int` won't compile — same name, same signature. So the POST gets a new name, and `[ActionName("Delete")]` keeps its URL as `/Trucks/Delete`. The method's real name never appears in a URL"*
- [ ] Port the pair into `TrucksController`:

  <details><summary>📋 paste: the Delete pair, into TrucksController</summary>

  ```csharp
  // GET /Trucks/Delete/5 — show what's about to go, and ask first.
  public async Task<IActionResult> Delete(int? id)
  {
      if (id == null)
      {
          return NotFound();
      }

      var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.Id == id);
      if (truck == null)
      {
          return NotFound();
      }

      return View(truck);
  }

  // POST /Trucks/Delete/5 — the actual deletion.
  [HttpPost, ActionName("Delete")]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> DeleteConfirmed(int id)
  {
      var truck = await _context.Trucks.FindAsync(id);
      if (truck != null)
      {
          _context.Trucks.Remove(truck);
      }

      await _context.SaveChangesAsync();
      return RedirectToAction(nameof(Index));
  }
  ```

  </details>

- [ ] Create `Views/Trucks/Delete.cshtml` — ours shows the truck's own card, because we have one:

  <details><summary>📋 paste: Views/Trucks/Delete.cshtml</summary>

  ```html
  @model Truck
  @{
      ViewData["Title"] = $"Remove: {Model.Name}";
  }

  <h1>Remove this truck? 🗑️</h1>
  <p class="text-muted">This takes it off the list for good. There is no undo.</p>

  <div class="col-md-4 mb-4">
      <partial name="_TruckCard" model="Model" />
  </div>

  <form asp-action="Delete" method="post">
      <input type="hidden" asp-for="Id" />
      <button type="submit" class="btn btn-danger">Remove it</button>
      <a asp-action="Details" asp-route-id="@Model.Id" class="btn btn-link">Keep it</a>
  </form>
  ```

  </details>

- [ ] ⚠️ **`Delete.cshtml` is a new file — glance at terminal 1.** If you didn't answer `a` back in §0, watch is sitting on `Do you want to restart your app?` and the confirmation page will 500 with *"The view 'Delete' was not found"* despite the file being right there. Answer it before you go on
- [ ] Add the link next to Edit in `Views/Trucks/Details.cshtml`:
  ```html
  <p><a asp-action="Delete" asp-route-id="@Model.Id" class="btn btn-outline-danger">🗑️ Remove this truck</a></p>
  ```

### Deleted under you *(slide 15)*

- [ ] **Set up the two tabs, narrating as a story:** *"two people are looking at Ghost Kitchen at the same time. One of them starts fixing its rating—"* — **tab A: open its Edit form, change the rating, don't save**
- [ ] *"—and the other decides the whole truck is a mistake."* **Tab B: Details → Remove this truck** — the confirmation page renders for the first time; give it its beat: 🎯 *"this page is a GET, and it has deleted nothing. It shows you the record and asks. Only the form's POST deletes"*
- [ ] **Remove it.** Seven trucks again; the terminal shows the `DELETE ... WHERE [Id] = @p0`
- [ ] **Predict, hands:** *"tab A's form is still open, still full of Ghost Kitchen. What happens when that person hits Save?"*
- [ ] **Tab A: Save.** → **404**
- [ ] 🎞️ **GO TO SLIDE 15** — *Deleted under you* · 🎯 *"That is the `catch` you read in the scaffold's Edit, and it just ran. The UPDATE matched no row, because the truck was deleted. EF threw. The catch checked whether the truck still exists. It does not, so the action returned NotFound. The scaffold already handled a case we had not thought about"*
- [ ] **✓ CHECKPOINT:** someone can say why Delete is two requests, and what the GET half is allowed to do

## 7 · The scaffold comes down

- [ ] *"The reference did its job. Everything worth keeping has been ported. Leaving it up means a second, unthemed admin UI at `/TrucksScaffold` that nobody maintains and everybody forgets"*
- [ ] Delete **`Controllers/TrucksScaffoldController.cs`** and the **`Views/TrucksScaffold/`** folder
- [ ] ⚠️ **Restart, don't trust the reload** — deleting a class is a rude edit, same as week 7: `dotnet watch` prints `ENC0033` and keeps serving the old build. `Ctrl+C`, `dotnet watch`
- [ ] `/Trucks` works, Edit works, `/TrucksScaffold` is an honest 404. *"In your next lab block, check 4 stays red while your scaffold is still in the project"*
- [ ] **Now take the tool out too** — in the second terminal:
  ```bash
  dotnet remove package Microsoft.VisualStudio.Web.CodeGeneration.Design
  dotnet remove package Microsoft.EntityFrameworkCore.Tools
  ```
- [ ] 🎯 **Watch the yellow `NU1901` warnings stop.** *"Those have been on screen since I added the two packages. They came from packages the scaffolder depends on. The scaffolder wrote our code and we kept the parts we wanted, so now we remove the packages. A build tool you have finished with should not stay in the project"*
- [ ] ⚠️ **Say what's still there and why:** *"`EntityFrameworkCore.Design` stays — that's what `dotnet ef` runs on, and the new column after your next lab block needs it. It came with week 7, not with the scaffolder"*

## Lab D · Task 4 — 10 minutes

- [ ] Lab README on screen, scrolled to **Task 4 in full**
- [ ] *"The Delete pair, the confirmation view, and the link. Then delete the scaffold and remove the two packages — the same order you just watched."*
- [ ] *"Check 4 stays red while the scaffold is still in your project. Its message says so. After you delete it, restart the app."*
- [ ] *"Remove those two packages and nothing else. EntityFrameworkCore.Design stays — dotnet ef runs on it, and task 5 needs it."*
- [ ] 👀 **Watch for:** *"already defines a member called 'Delete'"* — the POST got named `Delete` too. A **405** on posting the confirmation — `DeleteConfirmed` lost its `[ActionName("Delete")]`. Check 4 red with Delete working in the browser — read the message, it's the scaffold still standing. A page that still serves `/CryptidsScaffold` — `ENC0033`, no restart. And `dotnet ef` failing in the next block because `EntityFrameworkCore.Design` went out with the other two
- [ ] **Stop:** the note after **Task 4 in full**. Where they should be: **`Passed: 4`** — checks 1 to 4, tonight's in-class target

## 8 · A column on a live table *(slides 16–18)*

### A column on a live table *(slide 16)*

- [ ] 🎞️ **GO TO SLIDE 16** — *A column on a live table* · *"One more change tonight, and your own app needs it this week: the model gets a new property. Each truck gets a slogan"*
- [ ] In `Models/Truck.cs`, below `IsOpenLate` — **type it, it's two lines**:
  ```csharp
  [StringLength(80)]
  public string? Slogan { get; set; }
  ```
- [ ] 🎯 **Stop on the `?` and give it its beat:** *"the table already has seven rows, and none of them has a slogan. A non-nullable column needs a value for rows that already exist, and we have none. `string?` says what's true: some trucks have no slogan, and that's not an error"*
- [ ] Update the seed data — **paste** over `HasData`:

  <details><summary>📋 paste: OnModelCreating with slogans</summary>

  ```csharp
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
      modelBuilder.Entity<Truck>().HasData(
          new Truck { Id = 1, Name = "Roll Models", Cuisine = "Korean", City = "Madison", Rating = 4.6, IsOpenLate = true, Slogan = "Seoul food, street speed" },
          new Truck { Id = 2, Name = "Cheese Curd Cartel", Cuisine = "Comfort", City = "Green Bay", Rating = 4.8, IsOpenLate = true, Slogan = "Squeak first, ask questions later" },
          new Truck { Id = 3, Name = "Taco Tornado", Cuisine = "Mexican", City = "Milwaukee", Rating = 4.4, IsOpenLate = false, Slogan = "Landfall daily at noon" },
          new Truck { Id = 4, Name = "The Gyro Wheel", Cuisine = "Greek", City = "Madison", Rating = 4.2, IsOpenLate = true, Slogan = "It's pronounced delicious" },
          new Truck { Id = 5, Name = "Pierogi Party", Cuisine = "Polish", City = "Stevens Point", Rating = 4.7, IsOpenLate = false, Slogan = "Dumplings until they're gone" },
          new Truck { Id = 6, Name = "Banh Mi Mobile", Cuisine = "Vietnamese", City = "Milwaukee", Rating = 4.5, IsOpenLate = false, Slogan = "Fresh bread, no brakes" },
          new Truck { Id = 7, Name = "Sconnie Sliders", Cuisine = "Burgers", City = "Eau Claire", Rating = 4.9, IsOpenLate = true, Slogan = "Small burgers, big weekend" }
      );
  }
  ```

  </details>

- [ ] **Predict:** *"the model changed. What will the next migration contain — and just as important, what won't it?"*

### The migration is a diff *(slide 17)*

- [ ] Generate it:
  ```bash
  dotnet ef migrations add AddSlogan
  ```
- [ ] ⚠️ **Read EF's warning line out loud** — *"An operation was scaffolded that may result in the loss of data"* — and defuse it: *"it's talking about the `Down` method. Undoing this migration would drop the column and every slogan in it. The `Up` is safe — going forward loses nothing"*
- [ ] **Open the file:** one `AddColumn`, seven `UpdateData`s. **No `CreateTable`.** 🎯 *"a diff again — and this time the diff includes data. It compared the seed against the snapshot and wrote seven updates"*
- [ ] 🎞️ **GO TO SLIDE 17** — *The migration is a diff. Again.* · 🎯 **the rule change, said in exactly these words:** *"last week I told you: migration wrong? Delete the folder, regenerate. **You can't do that any more.** Your table has rows you care about, and your database records which migrations it has applied. From now on you fix a migration by adding another one. Forward only"*
- [ ] Apply it:
  ```bash
  dotnet ef database update
  ```
- [ ] **Refresh the mssql panel** → the `Slogan` column exists, seven slogans in it. One `ALTER TABLE`, seven `UPDATE`s in the terminal

### The guest list bites *(slide 18)*

- [ ] Add the field to `Views/Trucks/Edit.cshtml`, below Rating — **paste**:
  ```html
  <div class="mb-3">
      <label asp-for="Slogan" class="form-label"></label>
      <input asp-for="Slogan" class="form-control" />
      <span asp-validation-for="Slogan" class="text-danger"></span>
  </div>
  ```
- [ ] And show it on the card — in `Views/Shared/_TruckCard.cshtml`, under the title line:
  ```html
  @if (Model.Slogan != null)
  {
      <p class="card-text fst-italic text-muted mb-1">"@Model.Slogan"</p>
  }
  ```
- [ ] Reload `/Trucks` — slogans on every card. Open **Edit on Roll Models** — the Slogan box shows *Seoul food, street speed*. *"Form updated, column live. Looks done"*
- [ ] ⚠️ **Break #2 — don't announce it.** On **Roll Models**' Edit form (already open from the beat above), replace the slogan with this, then Save:
  ```text
  Kimchi at midnight
  ```
  Redirect, list loads…
- [ ] 🎯 **The slogan is *gone*. Not the old one — none at all.** Sit in it. *"No error. No warning. I typed a new slogan and saving erased the one that existed"*
- [ ] **Predict/collect:** *"I told you the guest list would come back tonight. What just happened?"* — let someone get close before you point at `[Bind("Id,Name,Cuisine,City,Rating,IsOpenLate")]`
- [ ] 🎞️ **GO TO SLIDE 18** — *The guest list bites* · walk the mechanism: *"Slogan isn't on the list, so the binder never set it — the posted truck arrived with `Slogan = null`. Then `Update` marked the **whole record** modified, and the save faithfully wrote every column, null included. The guest list didn't just ignore my field. The save wrote null over the old value"*
- [ ] **Fix it** — add `Slogan` to the list:
  ```csharp
  [Bind("Id,Name,Cuisine,City,Rating,IsOpenLate,Slogan")]
  ```
- [ ] ⚠️ **Restart before re-testing — `Ctrl+C`, `dotnet watch`.** That edit changed *only* an attribute, and MVC works out each action's binding from its attributes at startup: hot reload prints success and keeps the old guest list on some runs. Skip the restart and the slogan can vanish a second time with nothing on screen to explain it — which destroys the beat you just built. Same family as week 7's rude edits
- [ ] Edit Roll Models again, put the same slogan back in, then Save:
  ```text
  Kimchi at midnight
  ```
  🎯 **It sticks** — and it shows on the card
- [ ] 🎯 **The takeaway, for the lab and the homework:** *"when your model grows a property, three places need it: the view that shows it, the form that edits it, and the `[Bind]` list that allows it to bind. Miss the third and the failure is silent — and destructive"*
- [ ] **✓ CHECKPOINT:** the room can say why the slogan vanished instead of just not saving

## 9 · Hand off to the last lab block *(slide 19)*

- [ ] 🎞️ **GO TO SLIDE 19** — *Lab: the Registry gets a corrections desk*. Leave it up for the whole block; its timer is how long they have before the wrap-up
- [ ] *"This is the last block, and it has no stop. Tasks 5 and 6 are the same change you just watched, on the Registry. Two nullable columns and one migration that adds them. Then the plates go on screen, and the new fields go on the Edit form."*
- [ ] *"When you add those two fields to the form, add their names to the Bind list too. Then restart the app before you test it. That's the slogan I just lost, and it will happen to your Latin names the same way."*
- [ ] **The in-class target is still checks 1–4.** Checks 5 and 6 roll into the homework if time goes

## Lab E · Tasks 5 and 6 — 16 minutes

- [ ] Lab README on screen, scrolled to **Task 5 in full**
- [ ] 👀 **Watch for:** `The model for context 'CryptidContext' has pending changes` — the model changed after the migration; add another one, forward only. Anyone reaching to delete the `Migrations` folder — stop them; that's the move that's gone this week. Plates that 404 — the `src` starts `/img/cryptids/`, no `wwwroot`. A Latin name that vanishes on save — the `[Bind]` list, then a restart. `Unable to resolve service` on the home page — check the `HomeController` constructor asks for `CryptidContext`
- [ ] **No stop.** This block takes whatever time is left before the wrap-up. Anyone finished: **🚀 Done early?** at the bottom of the README, or help a classmate

## 10 · Wrap-up, after the lab *(slide 20)*

- [ ] 🎞️ **GO TO SLIDE 20** — *Tonight, in one picture*. Walk the four verbs, each with its two-step: Create (`Add`+save) · Read (`ToListAsync`/`FindAsync`) · Update (mark+save, hidden Id) · Delete (ask, then `Remove`+save)
- [ ] 🔗 **Collect week 7's promise:** *"I told you the Azure app setting was once per app, not once per deploy. This week you redeploy with one command — `az webapp up` — and the connection string is still there. That is what I said would happen"*
- [ ] Homework: **same moves on your own app.** Scaffold a reference against your model, port Edit and Delete, delete the scaffold — and **your model grows one column of your choosing, additively.** The self-check runs your whole CRUD cycle and cleans up after itself
- [ ] ⚠️ Repeat the one that protects their data: *"when the model grows: view, form, **and the `[Bind]` list.** The third one is silent when you miss it"*
- [ ] 🔗 Week 9: *"your registry is one table, and every interesting app is at least two. Next week you add a second table whose rows refer to rows in this one — and you'll finally see why `_context.Cryptids` is called a *set* and not a list"*
