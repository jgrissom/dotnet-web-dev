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
> **Tonight has two deliberate failures, and neither gets announced.** §6 saves an edit to a record that was deleted under it; §8 types a slogan into a form whose `[Bind]` list doesn't include it — and the save quietly **erases** the old value. That last one is the nastiest bug of the homework, met on your machine first. The terminal shares the stage with a new instrument tonight: **the debugger**, attached to a live process in §5.

## 0 · Before class

- [ ] **Copy `week-08/demo-starter/Curbside` out of the answer-keys repo** into `instructor/`. This is Curbside exactly as week 7's demo left it: context, two migrations, seven seeded trucks (`Sconnie Sliders` included), controller reading and writing through the context, `TruckData.cs` gone. Its own week folder, so nothing here collides with another week's `Curbside` and no previous demo gets deleted. The `rm` only matters if you **re-rehearse this week** — a rehearsal leaves the folder in tonight's **end** state:
  ```bash
  mkdir -p ~/Repos/dotnet-web-dev-course/instructor/week-08
  rm -rf ~/Repos/dotnet-web-dev-course/instructor/week-08/Curbside
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-08/demo-starter/Curbside ~/Repos/dotnet-web-dev-course/instructor/week-08/
  ```
  ⚠️ **The copy resets the files, not the database.** Curbside's data lives on the school SQL Server, and every copy carries the same `<UserSecretsId>` — so the drop-and-rebuild two bullets down is a *separate* reset and you need both.
- [ ] **Open that copy in VS Code** — **File → Open Folder** on `~/Repos/dotnet-web-dev-course/instructor/week-08/Curbside`. Everything below lives in this window: both terminals are its **integrated** ones (**Ctrl+`**, then the `+` on the terminal panel for the second), and the `mssql` panel is a sidebar in it. The restart prompt below fires in terminal 1 while you are typing in terminal 2, so you need both on screen at once
- [ ] **Set your connection string in your copy** — the `<UserSecretsId>` ships in the `.csproj`, so `set` alone is enough, no `init`:
  ```bash
  dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=...;User ID=...;Password=...;TrustServerCertificate=True"
  ```
- [ ] ⚠️ **Rebuild the database — before your rehearsal, and again after it:**
  ```bash
  dotnet ef database drop --force
  dotnet ef database update
  ```
  **The drop is what makes the update work.** The shipped migrations are new files with new ids — a database that still has your week-7 `__EFMigrationsHistory` refuses them with *"there is already an object named 'Trucks'"*. Same trap the lab's task 1 drop exists to avoid; better to meet it here than at 2:45. Then check `/Trucks` shows **seven** cards. Tonight nobody watches this get created — that was last week's show
- [ ] **Install the scaffolder tool now** — it's per-machine, it's boring, and it's not part of the show:
  ```bash
  dotnet tool install --global dotnet-aspnet-codegenerator
  ```
  *(Already have it? `dotnet tool update --global dotnet-aspnet-codegenerator` — a 9.x tool against a 10.x SDK fails with a runtime error, same family as last week's `dotnet ef` skew.)*
- [ ] **Rehearse the whole script once in a separate copy (≈40 min).** Besides finding what's broken, the rehearsal warms your NuGet cache — §2 adds two packages live, and a warm cache makes those commands instant on class wifi
- [ ] 🚨 **Then run the drop + rebuild above again — the rehearsal used the same database.** A separate *copy* is not a separate database: the `<UserSecretsId>` ships in the `.csproj`, so every copy reads one secret and points at one database. Forty minutes of rehearsal leaves it in tonight's **end** state — `Slogan` column added, Ghost Kitchen gone — and §8 has nothing left to add in front of the room. **Last thing before class, always: drop, update, `/Trucks` shows seven cards**
- [ ] Run it from there:
  ```bash
  cd ~/Repos/dotnet-web-dev-course/instructor/week-08/Curbside && dotnet watch
  ```
- [ ] **Open a second terminal in the same folder.** `dotnet watch` owns the first one all night; everything you type tonight goes in the second — §2's two `dotnet add package` commands and the scaffolder, then §8's `dotnet ef migrations add` and `dotnet ef database update`
- [ ] ⚠️ **Know the one prompt that will bite you, and answer it `a` the first time.** Creating a *new* `.cshtml` (§4's `Edit.cshtml`, §6's `Delete.cshtml`) is a change hot reload can't apply, so watch stops and asks **`Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`** — **in terminal 1, while you're typing in terminal 2.** Miss it and the page 500s with *"The view 'Edit' was not found"*, naming the exact path the file is sitting at. Answer **`a`** at the first prompt and it never asks again all night
- [ ] **Park two browser tabs**: `/Trucks` and `/Trucks/Details/2`
- [ ] **mssql extension** signed in, saved server connection tested, panel closed. It has **one** appearance tonight — §8, confirming the new column and its seven slogans — so it's a supporting actor this week, not the lead it was in week 7
- [ ] **Rehearse the §5 debugger attach once on this machine.** The first-ever *Attach to a .NET process* can stop to fetch debugger assets, and that download is not something you want between a breakpoint and a room full of people. Once it's cached, the attach is instant all term
- [ ] **Keep the terminal visible** (it's sized in the Teaching profile below). The generated SQL is still the evidence: tonight adds `UPDATE` and `DELETE` to the vocabulary, and §5 watches the gap between `Update()` and `SaveChangesAsync()` through it
- [ ] **Teaching profile in VS Code** (gear, bottom-left → **Profiles** → *Teaching*): C# and mssql extensions only, **no C# Dev Kit**. Bump both font sizes **in that profile** so they stick: `terminal.integrated.fontSize` (start around **18** — §5 reads the generated SQL from it) and `editor.fontSize` (around **16**)
- [ ] **Say it before you start: *"lids down — you'll run the scaffolder yourself in the lab."*** Curbside isn't in the public repo, so nobody can follow along, and tonight's paste blocks are big
- [ ] Sanity check: `/Trucks` shows **seven** cards, filing a truck works, a restart doesn't lose it

## 1 · Where we left off *(slides 2–4)*

### The payoff, retold *(slide 2)*

- [ ] **Before any slide:** on `/Trucks`, add nothing, change nothing — just `Ctrl+C` in the terminal, `dotnet watch` again, reload
- [ ] **Seven trucks.** *"Last week that reload was the whole show. This week it's just true — and that's what a foundation is."*
- [ ] 🎞️ **GO TO SLIDE 2** — *Seven trucks. Still there.* · *"You can read a table, show one row of it, and add to it. In CRUD terms you have C and R. Tonight is U and D — and most of it gets written for you."*

### Collect the reading *(slide 3)*

- [ ] 🎞️ **GO TO SLIDE 3** — *What Edit needs* · **collect the reading before revealing the list**: *"you put your Create form and your POST action side by side and wrote down what would have to change for Edit. What's on your list?"* Take three or four answers out loud
- [ ] Walk the slide's three, crediting the room for each one they found: the form arrives **pre-filled** · the app has to know **which record** · the save is an **UPDATE, not an INSERT**
- [ ] 🎯 **Then the reading's second question, and don't answer it:** *"when you hit Save on an edit, how does the app know which record you meant? Your Create form never sends an Id."* Take guesses. *"Hold that. The answer is on screen in about twenty minutes, and it's one line long"*

### The shape of the night *(slide 4)*

- [ ] 🎞️ **GO TO SLIDE 4** — *The other two letters*. Read the shape: **a tool writes it · we read what it wrote · we keep the parts that are ours**
- [ ] Say what doesn't change tonight, because the list is getting long and it's the point of the course: the model, the validation rules, the theme, the seed data, the database. *"Tonight adds neighbors. It rebuilds nothing"*
- [ ] **✓ CHECKPOINT:** the room can name the three things Edit needs that Create didn't

## 2 · The scaffolder *(slides 5–7)*

### Two packages and a tool *(slide 5)*

- [ ] 🎞️ **GO TO SLIDE 5** — *Two packages and a tool*
- [ ] **Two packages and one global tool** — *"and the tool is the one that goes back in the box before you commit. It is scaffolding in the builder's sense: up while you work, gone before anyone sees the house"*
- [ ] In the second terminal — **type the first, paste the second**:
  ```bash
  dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
  dotnet add package Microsoft.EntityFrameworkCore.Tools
  ```
- [ ] Name the split: **`CodeGeneration.Design`** is the scaffolder's templates · **`EntityFrameworkCore.Tools`** is the part that reads your `DbContext`. 🎯 *"Skip the second and the scaffolder stops with an error that names it — that's how I found out it was needed, too"*
- [ ] Mention the tool itself is already installed (per-machine, like `dotnet ef`): `dotnet-aspnet-codegenerator`. *"You'll install it once in the lab, and again every time a frozen lab PC forgets it"*
- [ ] Point at the `.csproj` — two more `<PackageReference>` lines, same as every package since week 7. *"Nothing magical arrived. A file changed"*
- [ ] ⚠️ **`dotnet watch` now prints yellow `NU1901` warnings — name them, don't skip past them:** *"NuGet audits every package you depend on, including the ones your packages depend on. `NuGet.Packaging` and `NuGet.Protocol` come in six levels under the scaffolder, and they've got a **low**-severity advisory against them. Read the line above it — **build succeeded**. Warnings, not errors"* — then plant the payoff: *"remember these. They go away tonight, and you'll see exactly why"* (§7 removes the packages)

### One command *(slide 6)*

- [ ] 🎞️ **GO TO SLIDE 6** — *One command* · **predict first, and make it sting a little:** *"since week 4 you've built a controller, five views, a form with validation, and the links between them. That took us four weeks. How much of it do you think this one command writes?"*
- [ ] Swipe back and run it — **paste, it's long**:
  ```bash
  dotnet aspnet-codegenerator controller -name TrucksScaffoldController -m Truck -dc CurbsideContext --relativeFolderPath Controllers --useDefaultLayout --referenceScriptLibraries
  ```
- [ ] Read the output out loud, all six lines: **one controller, five views.** *"Three seconds"*
- [ ] Browse to **`/TrucksScaffold`**. A working list — a table, not your cards, but every truck is in it
- [ ] **Click Edit on Cheese Curd Cartel, change the rating to 4.9, save.** It lands back on the scaffold's list, updated
- [ ] 🎯 **Now switch to the `/Trucks` tab and reload: 4.9.** *"Two UIs, one table. And notice what just happened — a record was edited and saved, tonight's whole topic, before we've read a single line of code. The framework's generated pages and your hand-built pages are the same kind of thing talking to the same database"*

### What it didn't write *(slide 7)*

- [ ] Ask the uncomfortable question yourself before someone else does: *"so why did you spend four weeks?"*
- [ ] 🎞️ **GO TO SLIDE 7** — *What it didn't write*. Walk the list: your **model and its rules** (week 6) · your **theme, layout, cards** (week 5) · your **seed data and migrations** (week 7) · **which app this even is** (week 4)
- [ ] 🎯 **The sentence:** *"it wrote the plumbing around your decisions. Every line it generated is a line you could now write yourself — which is exactly why you're allowed to let it. Week-4 you couldn't have read this code. Tonight-you can, and that's the next hour"*
- [ ] **✓ CHECKPOINT:** someone can say what the scaffolder read to do its work — the model, the context, and the annotations on them

## 3 · Read what it wrote *(slides 8–11)*

### Task is a Promise *(slide 8)*

- [ ] Open `Controllers/TrucksScaffoldController.cs`. **Skim the shape first:** *"before we read closely — this is your week-7 controller with armor on. Same constructor, same context, same actions, more checks"*
- [ ] Point at `Index`: `return View(await _context.Trucks.ToListAsync());` — one line, three changes: `async Task<IActionResult>`, `await`, `ToListAsync`
- [ ] 🎞️ **GO TO SLIDE 8** — *Task is a Promise* · 🎯 lean on what they know: *"if you have written `async`/`await` in JavaScript, you already know this shape. `Task<IActionResult>` is `Promise<result>`. `await` is `await`. The method gets marked `async`, the query methods grow an `Async` suffix, and that is the entire mechanical difference"*
- [ ] The *why*, one sentence, no more: *"while SQL Server is thinking, an `await`ed request lets go of its thread so the server can handle someone else. Under load that's the difference between queueing and keeping up"*
- [ ] The honest rule: *"your week-7 sync code is not wrong and does not need rewriting tonight. The scaffolder writes async, so what we write from tonight is async. Both run side by side in one controller without complaint"*
- [ ] 💡 If someone spots `Create()` GET is still sync: give them the point — *"nothing in it waits for anything. `async` isn't a costume; it marks a method that actually awaits"*

### The Edit pair *(slide 9)*

- [ ] 🎞️ **GO TO SLIDE 9** — *The Edit pair*. Then read it in the editor, GET half first
- [ ] Three stops in the GET: **`int? id`** — *"defensive: `/TrucksScaffold/Edit` with no number at all binds `null`, and null gets an honest 404 instead of a crash"* · **`FindAsync(id)`** — *"fetch one row by key; the async `FirstOrDefault` sibling you'll also see"* · **`return View(truck)`** — *"the whole pre-filled form is this line: look the record up, hand it to the view"*
- [ ] The POST signature: `Edit(int id, Truck truck)` — *"two arrivals: the id from the URL, the record from the form. First thing it does is check they agree"*

### The hidden Id *(slide 10)*

- [ ] Open `Views/TrucksScaffold/Edit.cshtml`. Let them look for a second — it's their Create form's shape in different clothes
- [ ] 🎯 **Point at line 15 and collect the reading question:**
  ```html
  <input type="hidden" asp-for="Id" />
  ```
- [ ] 🎞️ **GO TO SLIDE 10** — *The hidden Id* · *"There's the answer. The form carries the record's identity in its pocket. The GET put it there; the browser sends it back with everything else; the binder reads it into `truck.Id`. That's the whole mystery — one input with no pixels"*
- [ ] Trace the round trip out loud, finger on the screen: **URL id → `FindAsync` → model → hidden input → POST → `truck.Id`**
- [ ] 🔗 Connect it to the guard: *"and now `if (id != truck.Id) return NotFound();` makes sense — if the URL and the form disagree about which record this is, someone's tampering or something's broken, and either way the answer is no"*

### The guest list *(slide 11)*

- [ ] Back in the controller, POST `Edit`. **Read the generated comment out loud** — *"To protect from overposting attacks, enable the specific properties you want to bind to"* — *"the tool documents itself; let's take it up on that"*
- [ ] 🎞️ **GO TO SLIDE 11** — *The guest list* · **`[Bind("Id,Name,Cuisine,City,Rating,IsOpenLate")]`** — *"a guest list for model binding. Only names on the list are read out of the form. Everything else is ignored — no matter what a POST claims"*
- [ ] The one-sentence why: *"imagine `Truck` had an `IsAdmin` property. No box on your form — but a hand-written POST can send `IsAdmin=true` anyway, and the binder would happily set it. The list is what stops fields you didn't offer from being smuggled in"*
- [ ] ⚠️ **Plant the seed, don't spoil it:** *"a guest list has a failure mode, and it's silent. Hold onto that — it's the last thing that goes wrong tonight"*
- [ ] Then the body: `_context.Update(truck)` + `await _context.SaveChangesAsync()` — 🔗 *"the same two-step as `Add`: mark it, then write it. Update marks the whole record modified; the UPDATE runs at save"*
- [ ] And the `catch (DbUpdateConcurrencyException)`: *"the UPDATE went looking for the row and found nothing — the record was deleted while the form was open. The catch asks 'does it still exist?', and if not, 404. You'll watch this fire for real within the hour"*
- [ ] **✓ CHECKPOINT:** the room can say what travels in the hidden input, and what `[Bind]` does

## 4 · Port Edit *(slides 12–13)*

### Keep what's yours *(slide 12)*

- [ ] 🎞️ **GO TO SLIDE 12** — *Porting: keep what's yours* · *"The scaffold is a reference, not a foundation. We take the two Edit actions and the mechanics of the view, and we keep our theme, our markup, our names. At the end of the night the scaffold gets deleted"*
- [ ] In `Controllers/TrucksController.cs`, paste the pair below `Create` — and add `using Microsoft.EntityFrameworkCore;` up top when the editor complains about `DbUpdateConcurrencyException`:

  <details><summary>📋 paste: the Edit pair, into TrucksController</summary>

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

- [ ] 💡 One porting choice worth narrating: *"I flipped the guard to our house shape — `if (!ModelState.IsValid) return View(truck);` early-out, like our Create — instead of the scaffold's nested `if (ModelState.IsValid)`. Same logic. When you port code, you're allowed to make it yours"*
- [ ] ⚠️ **Point at `TruckExists` and say it out loud — this one emails you at 10pm otherwise:** *"three things crossed over, not two. The catch calls this little helper, and the scaffolder kept it private at the bottom of the file we're about to delete. Take the two actions and leave it behind and your project stops compiling — 'the name TruckExists does not exist'. It's in the paste; don't scroll past it"*
- [ ] Create `Views/Trucks/Edit.cshtml` — **paste, then point at what's different from the scaffold's version**: our `mb-3` spacing, our button labels, our partial. The mechanics — hidden `Id`, tag helpers, validation spans, Scripts section — are the scaffold's:

  <details><summary>📋 paste: Views/Trucks/Edit.cshtml</summary>

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

- [ ] ⚠️ **First new `.cshtml` of the night — terminal 1 is asking to restart.** Answer **`a`** (Always) and you won't see the prompt again tonight; §6 adds another view. Skip it and the Edit page 500s with *"The view 'Edit' was not found"*, listing the very path the file is at
- [ ] Add the link in `Views/Trucks/Details.cshtml`, under the badge block:
  ```html
  <p><a asp-action="Edit" asp-route-id="@Model.Id" class="btn btn-secondary">✏️ Edit this truck</a></p>
  ```

### Watch the UPDATE *(slide 13)*

- [ ] **File tonight's test subject** through the form: **`Ghost Kitchen` / `Fusion` / `Madison` / `4.9`**. *"This truck is going to have a long night"* — on a fresh database it lands as **Id 8**
- [ ] Open its Details → **Edit this truck**. 🎯 *"pre-filled — that is `FindAsync` and `View(truck)`, doing exactly what slide 9 said the GET half was for"*
- [ ] Change the rating to **4.7**. **Predict before saving:** *"what SQL is about to appear — and what will its WHERE clause say?"*
- [ ] Save. **Read the terminal:** an `UPDATE [Trucks] SET ... WHERE [Id] = @p...` 🎯 *"there's the hidden Id, arriving at SQL Server as a WHERE clause. One row touched"*
- [ ] 🎞️ **GO TO SLIDE 13** — *The UPDATE*
- [ ] 💡 **If someone asks "what if I leave the hidden `Id` out?"** — answer honestly, don't demo it: *"you'd probably get away with it here, and that's the interesting part. The binder looks for `Id` in the form and in the URL, and this form posts to `/Trucks/Edit/8` — so the URL answers and the edit saves. The line earns its keep when the URL can't answer: a form whose action carries no id posts `Id = 0`, and `Update()` treats an unset key as a **new** record. You don't get an error. You get a second truck"*

## 5 · The debugger, finally *(slides 14–15)*

### Attach to the process *(slide 14)*

- [ ] 🎞️ **GO TO SLIDE 14** — *The debugger, finally* · *"Since week 1 you've had a debugger and we've never needed it — `Console.WriteLine` and the SQL log answered everything. Tonight there's a question they can't answer: what does the object look like in the moment between the form and the database? Time to attach"*
- [ ] Say why it's *attach* and not F5: *"`dotnet watch` owns the app, so we don't launch a second copy — we attach to the one that's running"*
- [ ] **⇧⌘P → "Debug: Attach to a .NET 5+ or .NET Core process" → type `Curbside` → pick the process.** ⚠️ Two appear on some machines — `dotnet watch` and `Curbside`; you want **Curbside**, the app itself
- [ ] 🗣️ **Say the Windows shortcut, not the one you just pressed** — *"Ctrl+Shift+P for most of you"*. The slide shows both; almost everyone in the room is on Windows and you are not
- [ ] Set a breakpoint on the **`if (id != truck.Id)`** line of the ported Edit POST — click in the gutter, red dot
- [ ] ⚠️ **Attach *after* the last code edit** — a breakpoint set against a build the watcher has since replaced shows as a hollow circle and never fires. If that happens: detach (`Shift+F5`), let the rebuild finish, re-attach

### Update marks, SaveChanges writes *(slide 15)*

- [ ] In the browser: Edit **Ghost Kitchen**, change the rating to **4.8**, Save — **VS Code takes the screen mid-request**
- [ ] 🎯 **Open `truck` in the Variables panel and walk it:** Name `Ghost Kitchen`, Cuisine `Fusion`, City `Madison`, Rating `4.8`, Id `8`. *"That object did not exist a millisecond ago. Model binding built it out of the form — in week 6 you took that on faith, and there it is, live"*
- [ ] Hover `ModelState` → `IsValid: true`. *"The guard you're paused on is reading this"*
- [ ] **F10** — step over the guard, the `ModelState` check, down to `_context.Update(truck)`. **F10 past it**, then 🎯 **point at the terminal: no SQL.** *"Update ran. Nothing happened. Marked, not written — last week I could only assert that about `Add`; tonight you're watching the gap"*
- [ ] **F10 over `SaveChangesAsync`** — 🎯 **the UPDATE appears in the terminal.** *"There. That line is the database call. Everything else was bookkeeping"*
- [ ] **F5** to let the request finish; the browser gets its redirect
- [ ] ⚠️ **`Shift+F5` to detach — before §6, not optional.** Your breakpoint is on `if (id != truck.Id)`, the first line of the Edit POST, and **§6 submits an edit** to fire the concurrency 404. Stay attached and VS Code grabs the screen at the breakpoint instead — the beat dies for a reason that looks like nothing. Detaching is enough; the red dot can stay, it can't fire with nothing attached
- [ ] 🎞️ **GO TO SLIDE 15** — *Update marks. SaveChanges writes.* · recap on the slide what they just watched, because it goes on being true without a debugger attached: *"bind → guard → mark → write. You watched the space between the last two, which is where week 7's silent bug lived"*
- [ ] 💡 If asked "when would I use this myself?": *"any time the question is 'what is this object right now?' — a form that binds zeros, a guard that fails when you're sure it shouldn't. Attach, breakpoint, look. It's faster than ten `Console.WriteLine`s and it can't lie to you"*
- [ ] **✓ CHECKPOINT:** the room can say what `Update()` did and what `SaveChangesAsync()` did — having seen the gap between them

## 6 · Delete asks first *(slides 16–18)*

### Why Delete asks first *(slide 16)*

- [ ] **Predict before the slide:** *"Delete could be one link — click it, record's gone. Why doesn't anyone build it that way?"* Take answers
- [ ] 🎞️ **GO TO SLIDE 16** — *Why Delete asks first* · the rule underneath: **a GET must never change data.** Link previews, browser prefetch, crawlers, a curious extension — *"things you don't control follow links all day. If following a link deletes a truck, your data belongs to whoever renders your page"*
- [ ] So: **the GET shows a confirmation page — what's about to die, and a button. The POST does the deleting.** Two requests, on purpose

### The Delete pair *(slide 17)*

- [ ] 🎞️ **GO TO SLIDE 17** — *The Delete pair*. Read the scaffold's version in `TrucksScaffoldController.cs` first — one wrinkle worth a beat: **the POST is called `DeleteConfirmed`**
- [ ] 🎯 Say why: *"two methods named `Delete` taking the same `int` won't compile — same name, same signature. So the POST gets a new name, and `[ActionName("Delete")]` pins its URL back to `/Trucks/Delete`. The browser never learns the method's real name"*
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

### Deleted under you *(slide 18)*

- [ ] **Set up the two tabs, narrating as a story:** *"two people are looking at Ghost Kitchen at the same time. One of them starts fixing its rating—"* — **tab A: open its Edit form, change the rating, don't save**
- [ ] *"—and the other decides the whole truck is a mistake."* **Tab B: Details → Remove this truck** — the confirmation page renders for the first time; give it its beat: 🎯 *"this page is a GET, and it has deleted nothing. It shows you the victim and asks. Only the form's POST deletes"*
- [ ] **Remove it.** Seven trucks again; the terminal shows the `DELETE ... WHERE [Id] = @p0`
- [ ] **Predict, hands:** *"tab A's form is still open, still full of Ghost Kitchen. What happens when that person hits Save?"*
- [ ] **Tab A: Save.** → **404**
- [ ] 🎞️ **GO TO SLIDE 18** — *Deleted under you* · 🎯 *"that's the `catch` you read in §3, firing for real. The UPDATE went looking for row 8 and found nothing; EF threw; the catch asked 'does this truck still exist?'; no; NotFound. The scaffold shipped with the answer to a question you didn't know to ask yet"*
- [ ] **✓ CHECKPOINT:** someone can say why Delete is two requests, and what the GET half is allowed to do

## 7 · The scaffold comes down *(slide 19)*

- [ ] 🎞️ **GO TO SLIDE 19** — *The scaffold comes down* · *"the reference did its job. Everything worth keeping has been ported. Leaving it up means a second, unthemed admin UI at `/TrucksScaffold` that nobody maintains and everybody forgets"*
- [ ] Delete **`Controllers/TrucksScaffoldController.cs`** and the **`Views/TrucksScaffold/`** folder
- [ ] ⚠️ **Restart, don't trust the reload** — deleting a class is a rude edit, same as week 7: `dotnet watch` prints `ENC0033` and keeps serving the old build. `Ctrl+C`, `dotnet watch`
- [ ] `/Trucks` works, Edit works, `/TrucksScaffold` is an honest 404. *"In the lab, check 4 refuses to go green while your scaffold is still standing"*
- [ ] **Now take the tool out too** — in the second terminal:
  ```bash
  dotnet remove package Microsoft.VisualStudio.Web.CodeGeneration.Design
  dotnet remove package Microsoft.EntityFrameworkCore.Tools
  ```
- [ ] 🎯 **Watch the yellow `NU1901` warnings stop.** *"Those have been on screen since §2 — they came from packages the scaffolder dragged in. The scaffolder wrote our code, we kept what was worth keeping, and now the machinery goes back in the box. A build-time tool you've finished with is not a dependency; it's litter"*
- [ ] ⚠️ **Say what's still there and why:** *"`EntityFrameworkCore.Design` stays — that's what `dotnet ef` runs on, and §8 needs it in about four minutes. It came with week 7, not with the scaffolder"*

## 8 · A column on a live table *(slides 20–22)*

### A column on a live table *(slide 20)*

- [ ] 🎞️ **GO TO SLIDE 20** — *A column on a live table* · *"one more move tonight, and it's the one your own app needs this week: the model grows. Trucks are getting slogans"*
- [ ] In `Models/Truck.cs`, below `IsOpenLate` — **type it, it's two lines**:
  ```csharp
  [StringLength(80)]
  public string? Slogan { get; set; }
  ```
- [ ] 🎯 **Stop on the `?` and give it its beat:** *"the table already has seven rows, and none of them has a slogan. A non-nullable column demands an answer for rows that already exist. `string?` says what's true: some trucks have no slogan, and that's not an error"*
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

### The migration is a diff *(slide 21)*

- [ ] 🎞️ **GO TO SLIDE 21** — *The migration is a diff. Again.* Then generate it:
  ```bash
  dotnet ef migrations add AddSlogan
  ```
- [ ] ⚠️ **Read EF's warning line out loud** — *"An operation was scaffolded that may result in the loss of data"* — and defuse it: *"it's talking about the `Down` method. Undoing this migration would drop the column and every slogan in it. The `Up` is safe — going forward loses nothing"*
- [ ] **Open the file:** one `AddColumn`, seven `UpdateData`s. **No `CreateTable`.** 🎯 *"a diff again — and this time the diff includes data. It compared the seed against the snapshot and wrote seven updates"*
- [ ] 🎯 **The rule change, said in exactly these words:** *"last week I told you: migration wrong? Delete the folder, regenerate. **That reset button died tonight.** Your table has rows you care about, and your database remembers which migrations it has applied. From now on you fix a migration by adding another one. Forward only"*
- [ ] Apply it:
  ```bash
  dotnet ef database update
  ```
- [ ] **Refresh the mssql panel** → the `Slogan` column exists, seven slogans in it. One `ALTER TABLE`, seven `UPDATE`s in the terminal

### The guest list bites *(slide 22)*

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
- [ ] **Predict/collect:** *"I warned you a guest list has a failure mode. What happened?"* — let someone get close before you point at `[Bind("Id,Name,Cuisine,City,Rating,IsOpenLate")]`
- [ ] 🎞️ **GO TO SLIDE 22** — *The guest list bites* · walk the mechanism: *"Slogan isn't on the list, so the binder never set it — the posted truck arrived with `Slogan = null`. Then `Update` marked the **whole record** modified, and the save faithfully wrote every column, null included. The guest list didn't just ignore my field. It fed the database a blank one"*
- [ ] **Fix it** — add `Slogan` to the list:
  ```csharp
  [Bind("Id,Name,Cuisine,City,Rating,IsOpenLate,Slogan")]
  ```
- [ ] ⚠️ **Restart before re-testing — `Ctrl+C`, `dotnet watch`.** That edit changed *only* an attribute, and MVC works out each action's binding from its attributes at startup: hot reload prints success and keeps the old guest list on some runs. Skip the restart and the slogan can vanish a second time with nothing on screen to explain it — which destroys the beat you just built. Same family as week 7's rude edits
- [ ] Edit Roll Models again → **paste the same slogan** (still on your clipboard) → Save → 🎯 it sticks, and shows on the card
- [ ] 🎯 **The takeaway, for the lab and the homework:** *"when your model grows a property, three files care: the view that shows it, the form that edits it, and the `[Bind]` list that lets it through. Miss the third and the failure is silent — and destructive"*
- [ ] **✓ CHECKPOINT:** the room can say why the slogan vanished instead of just not saving

## 9 · Hand off to the lab *(slide 23)*

- [ ] 🎞️ **GO TO SLIDE 23** — *Lab: the Registry gets a corrections desk*. Leave it up for the whole lab; it's the task list
- [ ] Show **what done looks like** — the answer key **running on localhost**: `week-08/lab/solution` in the answer-keys repo, `dotnet run` from `Cryptids.Web`. **The plates land here:** the registry with six field-guide drawings on the cards, an *artist unknown* placeholder on anything filed by hand, a featured creature on the home page. Then `dotnet test Cryptids.Checks` from the folder above: **6 / 6**. ~90 seconds, a target not a walkthrough. **Nothing is deployed for this — it's localhost**; Azure is the homework
- [ ] Setup on screen, said once: **`git -C dotnet-web-starters pull` → copy `week-08` out and rename it → open the folder holding *both* projects → set your connection string with the same database name as last week → `dotnet ef database drop --force` → `dotnet ef database update` → `dotnet test Cryptids.Checks`** → **1 / 6**, and that 1 is the app you were handed
- [ ] ⚠️ **The drop is not optional, and say why:** *"your week-7 database's migration history is yours — your timestamps, your files. The starter ships mine. They can't mix: point the starter at that database and it fails with 'there is already an object named Cryptids'. Drop it, and one `database update` rebuilds the whole thing, creatures included. The fact that that works is what a migration IS"*
- [ ] ⚠️ **Then fence it, in the same breath** — *"you only ever drop a database you could rebuild from scratch — and tonight's is exactly that, a throwaway I can hand you again from a git clone. Your own project's database has records in it that nothing can hand back. There, a bad migration is fixed by adding another one"*
- [ ] ⚠️ **And separate it from the folder, because tonight is also the night the folder becomes sacred** — *"that drops the database. The `Migrations` folder stays — those files are what rebuild it. Drop the database, keep the files. Deleting the folder is the thing that stopped working this week"*
- [ ] **The scaffolder tool needs installing once per machine** — the command is task 2's first line. ⚠️ *"Frozen lab PCs: it's gone next boot, same as your secrets. Both restore in under a minute"*
- [ ] Say the packages are **already in the starter's `.csproj`** — nobody waits on NuGet for the two scaffolding packages. *"Your own app needs them added by hand this week; the commands are in the notes"*
- [ ] Same warning as every week, still true: **the checks never touch SQL Server** — in-memory, no wifi needed, and **6/6 does not prove your connection string works.** Your browser proves that
- [ ] **In-class target: checks 1–4** — Edit ported, Delete ported, scaffold deleted. **5 and 6 are the plates**, and they roll into the homework if the clock wins

## 10 · Wrap-up, after the lab *(slide 24)*

- [ ] 🎞️ **GO TO SLIDE 24** — *Tonight, in one picture*. Walk the four verbs, each with its two-step: Create (`Add`+save) · Read (`ToListAsync`/`FindAsync`) · Update (mark+save, hidden Id) · Delete (ask, then `Remove`+save)
- [ ] 🔗 **Collect week 7's promise:** *"I told you the Azure app setting was once per app, not once per deploy. This week you redeploy with one command — `az webapp up` — and the connection string is still there. That's the promise landing"*
- [ ] Homework: **same moves on your own app.** Scaffold a reference against your model, port Edit and Delete, delete the scaffold — and **your model grows one column of your choosing, additively.** The self-check runs your whole CRUD cycle and cleans up after itself
- [ ] ⚠️ Repeat the one that protects their data: *"when the model grows: view, form, **and the `[Bind]` list.** The third one is silent when you miss it"*
- [ ] 🔗 Week 9: *"your registry is one table, and every interesting app is at least two. Next week the records grow relatives — a second table that points back at this one — and you'll finally see why `_context.Cryptids` is called a *set* and not a list"*
