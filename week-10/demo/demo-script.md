# Week 10 Demo Script — Curbside Gets Finished ✨

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-10/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it is due. Everything that is not a 🎞️ line happens in the other state, so **you do not need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

> [!IMPORTANT]
> **Tonight is the odd one out and it is worth saying so to yourself before you start.** There is no new syntax, no migration and no package. There is **one** failure to debug, in §2 — and it is not staged. It is a real defect the app has been carrying, which is the most on-message thing that could have happened to this week. What there is instead is **a list, written on screen in §1, and then worked through**. The teaching is the noticing, not the typing — so the pace is slower than it looks on paper, and the room should be talking. Three of the beats below are questions you ask and wait for.
>
> ⚠️ **Nothing tonight gets broken and put back.** Every change is forward. If you lose your place, nothing needs undoing.

## 0 · Before class

- [ ] ⚠️ **Re-rehearsing this week? Delete `instructor/week-10/Curbside` first** — a rehearsal leaves it in tonight's **end** state, and every beat below starts from week 9's. Deleting the folder in Finder is enough; the next step recreates it
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course/instructor/week-10`, create a new empty **folder** named `Curbside` and open it *(the dialog's **New Folder** button makes `week-10` too, the first time)*. **The folder stays empty — there is no `dotnet new` tonight;** the next step fills it with the starter
- [ ] Integrated terminal (**Ctrl+&#96;**) — fill the empty folder with tonight's starter. This is Curbside as week 9's demo left it, **plus a browsable dish list** that week 9 never typed:
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-10/demo-starter/Curbside/. .
  ```
  The trailing `/.` copies the *contents* in, so the project lands at the top of the window you already have open — no folder inside a folder
- [ ] **Set your connection string in your copy** — the `<UserSecretsId>` ships in the `.csproj`, so `set` alone is enough, no `init`:
  ```bash
  dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=...;User ID=...;Password=...;TrustServerCertificate=True"
  ```
- [ ] ⚠️ **Rebuild the database — before your rehearsal, and again after it:**
  ```bash
  dotnet ef database drop --force
  dotnet ef database update
  ```
  Five migrations replay. Then check `/Trucks` shows **seven** cards, each with a specials count on it
- [ ] **Rehearse the whole script once in a separate copy (≈30 min).** Tonight is shorter than most weeks and the risk is the opposite of usual — not running out of time, but running out of *material* and filling it with waffle. Time §1 in particular
- [ ] 🚨 **Then run the drop + rebuild above again — the rehearsal used the same database.** A separate *copy* is not a separate database: the `<UserSecretsId>` ships in the `.csproj`, so every copy reads one secret and points at one database. Your rehearsal will have added a dish called **Elote Dog** in §4, and it will still be there. **Last thing before class, always: drop, update, `/Dishes` shows ten**
- [ ] Run it, same terminal:
  ```bash
  dotnet watch
  ```
- [ ] ⚠️ **Know the one prompt that will bite you, and answer it `a` the first time.** Tonight makes **three** edits hot reload cannot apply — two brand-new `.cshtml` files (§3 and §4) and `Program.cs` in §3, which only ever runs at startup. `watch` handles both by restarting, and it **asks first**: **`Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`**. Answer **`a`** at the first prompt and it never asks again all night. Miss it and §3's payoff silently doesn't happen
- [ ] **One browser window all night, three tabs parked**: `/`, `/Trucks/Details/1` and `/Dishes`. One window means no *"which one was that in?"* mid-demo
- [ ] **Say the no-typing line out loud in the first minute.** Tonight is watched, not typed along with: *"nothing tonight is yours to type. Curbside is my app and yours is yours — and tonight your app is the whole assignment, so your keyboard time is the studio block, which is most of the evening"*
- [ ] Teaching profile on, notifications off, editor font sized for the back of the room and for a small laptop screen

> [!NOTE]
> **🖥️ On screen, at curtain**
>
> - **VS Code** — left half, `instructor/week-10/Curbside` open, one integrated terminal running `dotnet watch`
> - **Browser** — right half, one window, three tabs: `/` (the stock template home page — that is the point), `/Trucks/Details/1` and `/Dishes`

## 1 · The stranger's pass *(slides 2–3)*

### Two different questions *(slide 2)*

- [ ] 🎞️ **GO TO SLIDE 2** — *Two questions*
- [ ] Name what has been true for six weeks, and then the turn: *"every week since week 4, the question has been: does it work. `dotnet test` answered it in the lab and the self-check answered it on your URL. Both of those have a yes or a no, and a script can ask them"*
- [ ] 🎯 Then the second question, slowly, because it is the whole evening: *"tonight's question is: would you send someone this link. There is no script for that one. That is why this week's self-check scores nothing — every week since week 3 has handed you a script that counted points, and this is the first that doesn't"*
- [ ] 💡 Close on the line at the foot of the slide: *"nothing new gets introduced tonight. No package, no migration, no new table. There is exactly one line all evening you have not met before, and I will point at it when we get there. Everything else is a view, a controller and an if — the hard part is deciding it is worth doing"*

### Walk it like you just arrived *(slide 3)*

- [ ] 🎞️ **GO TO SLIDE 3** — *Walk it like you just arrived*
- [ ] **The slide is the exercise.** Say why both halves of that first line are on it: *"the deployed URL, not your localhost — that is the one I open and the one a stranger gets. And then your phone, which is the half that does the real work. You built this on a laptop at a width you picked. You have probably never once looked at it on the thing half your visitors are holding"*
- [ ] 🎯 Be honest about why the phone and not some ritual: *"there is no trick for un-knowing your own app. You cannot clear your memory of where the nav link goes. What you can do is change the screen underneath it, and a phone is the cheapest way to do that"*
- [ ] Land the last line as an instruction rather than advice: *"write it down before you fix anything. The moment you fix the first thing you noticed, you are in the editor and the pass is over. The list is what you are making right now"*
- [ ] 🔗 Connect it back: *"week 9's reading asked you to do exactly this and bring three things. If you brought them, that list is your midterm and you already started"*

- [ ] **Swipe to the browser, `/` tab.** Walk Curbside out loud, and **keep a real list on screen** — a new file in VS Code, or the whiteboard. Ask the room rather than telling them: *"I have never seen this site before. What is it?"*
  - The front page says **Welcome** and links to **learn.microsoft.com**. Let that sit for a second before naming it: *"this is Microsoft's front page. I have been building this app for seven weeks and I have never once opened this file"*
  - Click **Privacy** in the navbar: *"Use this page to detail your site's privacy policy"*
  - Read the browser tab out loud: **Home Page - Curbside 🌮**
  - Click **Trucks**, then a truck, and be fair about it: *"this part is good. This is the part we built"*
  - In the address bar, change the id to `999` → **a blank browser page.** Ask: *"what happened to my site?"*
  - 💡 **Then drag the window narrow**, down to phone width, and let them watch it reflow. This is the phone half of slide 3, done on screen — you cannot reach localhost from a phone, so this is the demonstrable version: *"this is week 2's move, and it is the one thing tonight you can do to your own app in ten seconds"*
- [ ] Write the list on screen, in the room's words. It should come out close to:
  1. the front page is not mine
  2. there is a page in my navbar I have never written
  3. a wrong id is a blank browser page
- [ ] 🎯 Say what the list is for before leaving it up: *"three things. Not thirty. I am going to fix these three before the break and a bit after it, and then the app is done — and the same is true of yours, which is why I asked you for three and not for a plan"*

## 2 · The front door *(slide 4)*

### What a front page owes you *(slide 4)*

- [ ] 🎞️ **GO TO SLIDE 4** — *What a front page owes a visitor*
- [ ] Take the three rows in order, and say the thing the table cannot: *"one sentence in their words, not your model's. A truck is a `Truck` to me and a food truck to everybody else"*
- [ ] 🎯 The second row is the one worth pressing: *"a button, not a navbar link. The navbar is furniture — people stop seeing it by the second page. A button in the middle of the page is the thing you are asking them to press"*
- [ ] 💡 Close on the budget line at the foot: *"a visitor gives you about ten seconds. That is not me being dramatic — that is the whole budget, and it is why the answer is a sentence and a way in, not a redesign"*

- [ ] **Swipe to the editor.** Open `Views/Home/Index.cshtml` — the whole file, so the room sees how little is there
- [ ] Paste the replacement:
  ```cshtml
  @{
      ViewData["Title"] = "Street food across Wisconsin";
  }

  <div class="p-5 mb-4 bg-body-tertiary rounded-3">
      <h1 class="display-4">Curbside 🌮</h1>
      <p class="lead">
          Every food truck worth chasing in Wisconsin — what they cook, where they
          park, and what's on today.
      </p>
      <a asp-controller="Trucks" asp-action="Index" class="btn btn-primary btn-lg">Browse the trucks</a>
      <a asp-controller="Dishes" asp-action="Index" class="btn btn-outline-secondary btn-lg">Start from a dish</a>
  </div>

  @section Scripts {
      <script src="https://jgrissom.github.io/dotnet-web-dev/week-10/homework-checks.js"></script>
  }
  ```
- [ ] ⚠️ **Stop on that `@section Scripts` block for ten seconds.** It is the only part of the paste that is not about the front page, and it is a graded trap in tonight's homework: *"this is where your self-check lives. Requirement one has you rewrite this exact file — and if you rewrite it without putting this block back, your console goes quiet, and the silence reads exactly like a clean report"*
  - 💡 Curbside has never had one, so this is a fresh install. **Theirs is a replacement** — their week-9 line is sitting in that file right now
- [ ] Point at what is *not* new in it before reloading: *"Bootstrap classes from week 2, two anchor tag helpers from week 4, and a `ViewData` title from week 4. There is nothing here you have not typed"*

### The headline nobody can read *(no slide — the browser is the reveal)*

> [!IMPORTANT]
> **This is the one real failure of the night and it is not staged** — the markup is correct, the page is a clean 200, every check this course owns stays green, and the front page is unreadable. That is the week's whole thesis arriving by accident, so give it the ninety seconds.

- [ ] **Reload the `/` tab.** The headline and the paragraph are **gone** — a pale slab with a blue button floating on it. **Say nothing.** Let them find it
- [ ] Ask it straight: *"what happened to my front page?"* Take answers. Somebody will say the text is white on white, and they are right
- [ ] 🎯 Then make the point that earns the beat, before fixing anything: *"and notice what did not happen. No error. No red. The markup is correct — I could show you the HTML and you would sign it off. Every check this course has ever given you is still green. The page just cannot be read. That is the entire reason this week exists"*
- [ ] **Right-click the pale slab → Inspect.** The slab *is* the hero `<div>`, so that lands on it directly — if you hit the invisible headline instead, the div is the line above it in the tree
- [ ] **Computed tab**, and type `color` in its filter box. Both numbers are sitting next to each other:
  ```
  background-color    rgb(248, 249, 250)
  color               rgb(255, 255, 255)
  ```
- [ ] 🎯 Read them out and let the room do the arithmetic: *"near-white behind. White in front. Nothing is broken — those are just two numbers that should never have met"*
- [ ] 🎯 The diagnosis, and it is a callback: *"week 2 taught you this exact class. `bg-light` is literally light in every theme; `bg-body-tertiary` follows the theme. That was true, and it is still true — but it follows **Bootstrap's** light-or-dark switch, and nothing on this page has ever thrown that switch. Darkly filled in the body color and left the surface tint at the value it ships with, which is a light-mode value. Week 2's site was on a light theme, so it never came up. In week 5 you picked a theme, and some of us picked a dark one"*
- [ ] **The fix is one attribute, and week 2 already showed you it.** On the hero div:
  ```cshtml
  <div class="p-5 mb-4 bg-body-tertiary rounded-3" data-bs-theme="dark">
  ```
- [ ] **Reload.** Readable — the hero is now a shade lighter than the page instead of a slab
- [ ] ⚠️ **Now point at the second button**, which is still a ghost: *"the outline button did not come back. That one is not the same bug. `secondary` is a **brand** color, and in this theme it is a dark grey — `data-bs-theme` does not touch brand colors, only the page surfaces"*
  ```cshtml
  <a asp-controller="Dishes" asp-action="Index" class="btn btn-outline-light btn-lg">Start from a dish</a>
  ```
- [ ] **Reload.** Both buttons read
- [ ] 💡 Close the beat on the transferable line, not the CSS: *"I am not teaching you Bootstrap here. The rule you learned in week 2 was right. What changed was the app underneath it, and nobody sends you a notice when that happens. That is what walking your own site is for"*

- [ ] Read the new browser tab out loud — *"Street food across Wisconsin"* — and say why that line matters: *"that is what a bookmark gets called, and what shows up when somebody pastes this into a chat"*

- [ ] Now **Privacy**, and pose it as a choice rather than a fix: *"two honest answers. Make it real — an About page, who built this and why — or delete it. What I will not do is leave a link in my navbar to a page I have never written"*
- [ ] Delete it in front of them, and count the places out loud as you go — **four**:
  - `Views/Home/Privacy.cshtml` — delete the file
  - the `Privacy()` action on `Controllers/HomeController.cs`
  - the navbar `<li>` in `Views/Shared/_Layout.cshtml`
  - the footer link, in the same file
- [ ] While in the footer, replace what is left:
  ```cshtml
  &copy; 2026 Curbside 🌮 — a WCTC .NET Web Development project
  ```
- [ ] **Reload.** Navbar is Home · Trucks · Dishes. 🎯 *"a page you have not written is worse than no page"*

## 3 · The blank page *(slides 5–6)*

### Zero bytes *(slide 5)*

- [ ] 🎞️ **GO TO SLIDE 5** — *What does the browser draw?*
- [ ] Read the guard off the slide and give it credit first: *"this is in every controller you have written, and it is right. A record that is not there should be a 404 — that is the honest answer"*
- [ ] 🎯 Then the sentence the slide is built around: *"the status is correct. What `NotFound()` sends as the **body** is nothing at all. Zero bytes"*
- [ ] **Ask the question on the slide and wait for an answer:** *"so what is on the screen? There is no page. What does a browser put there?"* Take a couple of guesses before moving
- [ ] **Swipe to the browser.** That tab is still on `/Trucks/Details/999` from §1 — reload it. This time do not move on: walk what is missing, out loud, item by item. *"No navbar. No Curbside. Nothing on this screen says my site still exists. And that is Chrome's wording, not mine — a visitor cannot tell whether I am broken or gone"*
- [ ] 🎯 Make it real rather than hypothetical — this is the beat that earns the section: *"and this is not me typing a silly number. You built Delete in week 8. The moment you delete a record, every saved link to it — every bookmark, everything anyone shared — comes **here**"*

### Three pieces *(slide 6)*

- [ ] 🎞️ **GO TO SLIDE 6** — *Three pieces, one of them a line*
- [ ] **The code on this slide does not exist yet** — read it as a plan, bottom-up, which is the order you are about to build it in: *"a view, an action to render it, and one line to send every empty 404 there. Two of those three you already know how to write — the line is the new thing"*
- [ ] Say what `UseStatusCodePagesWithReExecute` actually does, because the name does not: *"when a response comes back in the four hundreds or the five hundreds **with nothing in the body**, this re-runs the request through that path and uses what comes back as the body. The status code is left alone"*
- [ ] ⚠️ **Both halves of that matter, and somebody will ask about one of them.** It is not only 404s — anything from 400 to 599 with an empty body lands here. And it is *only* the empty ones: a response that already wrote a body keeps it, which is why your real exceptions still get `/Home/Error` rather than this page
- [ ] ⚠️ The middle block is on the slide for one reason — say it: *"do not call the action `NotFound`. `Controller` already has a method by that name, and it is the one returning the blank page we are replacing. Yours would shadow it and the compiler will tell you so"*

> [!IMPORTANT]
> **Build it bottom-up: view, then action, then the line that wires them together.** The order is not cosmetic. Go the other way — middleware first — and there is a window where the app is told to render a page that does not exist yet, and **every wrong-id URL answers `500`** instead of the blank page you are trying to replace. Measured. Built in this order, every intermediate state is harmless.

- [ ] **Swipe to the editor.** New file, `Views/Home/Missing.cshtml` — an ordinary view, nothing routes to it yet:
  ```cshtml
  @{
      ViewData["Title"] = "Not found";
  }

  <div class="text-center py-5">
      <h1 class="display-5">Keep on Truckin' 🌮</h1>
      <p class="lead text-muted">
          That page doesn't exist — or it did, and the truck moved on.
      </p>
      <a asp-controller="Trucks" asp-action="Index" class="btn btn-primary">See every truck</a>
  </div>
  ```
- [ ] `Controllers/HomeController.cs` — the action that renders it:
  ```csharp
  // Not called NotFound() — Controller already has a method by that name,
  // and it's the one that returns the blank page we're replacing.
  public IActionResult Missing()
  {
      return View();
  }
  ```
- [ ] 💡 **Show it before you wire it up** — browse to `/Home/Missing`. It is a real page already, and nothing is routed to it: *"there is the page. Nothing sends anyone to it yet. That is the last line"*
- [ ] Now `Program.cs`, above `app.UseRouting()`:
  ```csharp
  // A wrong id, or a URL nobody recognizes, used to be a blank browser page.
  // This re-runs the request through /Home/Missing and keeps the 404 status.
  app.UseStatusCodePagesWithReExecute("/Home/Missing");
  ```
- [ ] Say why the position matters: *"above `UseRouting`. It has to be in the pipeline before the thing that produces the 404, or there is nothing for it to catch"*
- [ ] ⚠️ **Check the terminal before you reload.** Two of those edits are ones hot reload cannot apply — a brand-new `.cshtml`, and `Program.cs`, which only runs at startup. `dotnet watch` restarts for them, and if you did not answer `a` in §0 the prompt is sitting there waiting. **Say it to the room while you check**, because they will hit the same thing tonight: *"two of the three things I just typed need the app to restart. Watch will do it — but it asks first, over in the terminal, while I am typing in the editor. That is the single most common reason a correct fix looks like it did nothing"*
- [ ] **Reload `/Trucks/Details/999`.** Your page, your navbar, a way home
- [ ] 🎯 Then the part that is easy to miss, and worth pointing at: *"and it is still a 404. Check the Network tab if you want — the page apologizes to a person and still tells the truth to a machine. Those are two different audiences and you can serve both"*
- [ ] Try one more, to show the reach: type `/Vendors` — a controller that has never existed. **Same page.** *"one line covered a wrong id, a misspelled URL, and everything else that ends in a 404 with nothing in it"*

## 4 · A table nobody can add to *(slides 7–8)*

- [ ] **Swipe to the `/Dishes` tab.** Ten dishes, each with a truck count. Ask: *"this page is fine. What can I do on it?"*
- [ ] Wait, then name it: *"I can read. There is no way to add a dish — not here, not anywhere. The dropdown on the specials form only offers dishes that already exist. This table is read-only from the outside"*
- [ ] 🎯 Generalize it before fixing it, because this is the part that transfers: *"go through your own tables tonight and ask how a new row gets in. If the honest answer is 'I seed it' or 'I open the mssql panel', that part of your app is read-only to everybody else. That might be the right call — but it should be a call"*

- [ ] **Swipe to the editor.** `Controllers/DishesController.cs` — the Create pair, same shape as week 8's:
  ```csharp
  // GET /Dishes/Create — a hand-written pair, same shape as Trucks.
  public IActionResult Create()
  {
      return View();
  }

  // POST /Dishes/Create
  [HttpPost]
  [ValidateAntiForgeryToken]
  public async Task<IActionResult> Create(Dish dish)
  {
      if (!ModelState.IsValid)
      {
          return View(dish);
      }

      _context.Dishes.Add(dish);
      await _context.SaveChangesAsync();

      return RedirectToAction(nameof(Details), new { id = dish.Id });
  }
  ```
- [ ] ⚠️ `Dish` lives in `Curbside.Models` and this file does not have the using yet — add it at the top with the others: `using Curbside.Models;`
- [ ] New file, `Views/Dishes/Create.cshtml`:
  ```cshtml
  @model Dish
  @{
      ViewData["Title"] = "Add a dish";
  }

  <h1>Add a dish</h1>

  <form asp-action="Create" method="post" class="col-md-6">
      <div asp-validation-summary="All" class="text-danger"></div>

      <div class="mb-3">
          <label asp-for="Name" class="form-label"></label>
          <input asp-for="Name" class="form-control" />
          <span asp-validation-for="Name" class="text-danger"></span>
      </div>

      <button type="submit" class="btn btn-primary">Add it</button>
      <a asp-action="Index" class="btn btn-link">Cancel</a>
  </form>

  @section Scripts {
      <partial name="_ValidationScriptsPartial" />
  }
  ```
- [ ] And the way in, in `Views/Dishes/Index.cshtml`, above the `<ul>`:
  ```cshtml
  <a asp-action="Create" class="btn btn-primary mb-4">＋ Add a dish</a>
  ```
- [ ] ⚠️ **That is the second new `.cshtml` tonight, so the app has to restart again.** Answered `a` in §0? `watch` is doing it now — give it a few seconds. Did not? The prompt is sitting in the terminal waiting for you
- [ ] 🚨 **Prove it works before you put the slide up.** Reload `/Dishes`, click **＋ Add a dish**, and check that the form renders. ⚠️ **Do not fill it in and do not submit it** — landing on a brand-new dish's page is the payoff after slide 7, and you only get it once. Look at the form, then leave
  - ⚠️ **Clicking through is the check; seeing the button is not.** Adding that button edited an *existing* view, which hot reload applies happily. The thing that needed the restart is the **new** `Create.cshtml`, and the only way to know it is there is to ask for it
  - ⚠️ **A 500 saying *"The view 'Create' was not found"* means the restart has not happened.** The file is fine and it is in the right place — **do not go looking for it.** Answer the prompt in the terminal, or press **Ctrl+R** there, then reload
  - 💡 Fifteen seconds, and it is the one check worth making in this section: skip it and a missing restart surfaces **after** slide 7 has asked the room a question, with you debugging in the middle of your own setup
- [ ] **Back to `/Dishes`** — still ten dishes, nothing added. That is where slide 7 wants the room looking

### What does this draw *(slide 7)*

- [ ] 🎞️ **GO TO SLIDE 7** — *`Model` is empty. Now what?*
- [ ] **Ask the question on the slide before you run anything, and wait.** *"a `foreach` over an empty list. No error — that is legal and it is fine. But what is on the page?"*
- [ ] 🎯 Then the line at the foot of the slide, which is the reason the room has never thought about this: *"you have never seen your own app empty. You seeded it in week 7 and it has had data in it every single time you have looked. It will be empty for the first person who uses it"*

- [ ] **Swipe to the browser.** `/Dishes` → **＋ Add a dish** → type `Elote Dog` → **Add it**
- [ ] You land on `/Dishes/Details/11`. **Let it sit before saying anything.** The page reads: **Elote Dog**, *← All dishes*, **Served by** — and then **nothing at all.** A heading with empty space under it
- [ ] Ask what they are looking at: *"is that broken? It is not. The record saved, the query ran, the page is a clean 200. There is a heading that says Served by, and underneath it there is nothing — because a `foreach` over an empty list draws exactly nothing"*
- [ ] 🎯 *"and this is every new record in your app. The first review of a trail, the first sighting of a creature. Whatever that page does right now is what everybody's first one looks like"*

### Two things, not one *(slide 8)*

- [ ] 🎞️ **GO TO SLIDE 8** — *An empty state is two things*
- [ ] Give the first half quickly and spend the time on the second: *"a sentence saying nothing is here — everybody gets that one. A way to change it — that is the half people skip"*
- [ ] Read the two lines at the foot as the contrast they are: *"'No reviews yet' is a dead end. It is a sign on a locked door. 'No reviews yet — be the first', with a button, is a page that does something"*

- [ ] **Swipe to the editor.** `Views/Dishes/Details.cshtml` — wrap the list:
  ```cshtml
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
      <p><a asp-controller="Specials" asp-action="Create" class="btn btn-primary">＋ Put it on a truck</a></p>
  }
  ```
- [ ] **Reload `/Dishes/Details/11`.** *"No truck is serving this yet"* and a button
- [ ] Then the same move twice more, fast — **paste both, they are the same shape**. `Views/Dishes/Index.cshtml` and `Views/Trucks/Index.cshtml`, above each loop:
  ```cshtml
  @if (!Model.Any())
  {
      <p class="text-muted">No dishes yet. <a asp-action="Create">Add the first one</a>.</p>
  }
  ```
- [ ] ⚠️ **Somebody will point out that the ＋ button is already right above it.** Answer it, because the answer is the rule from the slide: *"it is — on this page. The empty state still gets its own link, because when it fires it is the only thing on the page, and on your app there may be no button above it at all. A sentence and a way out. Both, every time"*
- [ ] Say why you are not demonstrating these two: *"I would have to delete every truck to show you this one working, and I am not wrecking my own demo to prove a point. But it is the same `@if`, and your list page needs it as much as your details page does"*

## 5 · The pass, again *(slide 9)*

- [ ] **Swipe to the `/` tab.** F12 → Console → type `recheck()`
- [ ] ⚠️ **Before the report there is a block of red, and you should get in front of it rather than let the room read it as a crash.** Seven or so lines of stack trace, starting `GET /Trucks/Details/1007 404 (Not Found)`. **It is the script doing its job** — and it is a callback worth making: *"that is the wrong-id check running. It asked for a truck that does not exist, and it got a 404 — which is exactly what we built twenty minutes ago. The red is the browser noting the status, not an error in the page"*
- [ ] Then read the top line out loud: **`Nothing here a stranger would trip over`**
- [ ] ⚠️ **Do not undercut it here — the undercut is on the slide, four lines from now.** Ask the question and let it sit instead: *"zero findings. So is it finished?"*

### What it can and cannot see *(slide 9)*

- [ ] 🎞️ **GO TO SLIDE 9** — *The script scores nothing*
- [ ] Take the left column first and fast — *"these are the things a stranger can see without knowing what your site is about, which is why a script can find them"*
- [ ] 🎯 Then the right column slowly, because it is the assignment: *"none of these can be checked by anything. It cannot empty your database, so it has never seen your empty states. It cannot tell a real record from a placeholder. And it has no opinion at all about whether the thing is any good"*
- [ ] Land the line at the foot: *"zero findings is not full marks. It means nothing is obviously broken. Nine of the twenty points are things this script never looks at"*
- [ ] 💡 Be straight about the change of instrument: *"this is the first week since week 3 where the script does not count. That is deliberate. What is being graded this week is judgment — you use your judgment when completing the studio, then I'll use mine when grading"*

## 6 · Hand off to the studio *(slide 10)*

- [ ] 🎞️ **GO TO SLIDE 10** — *Studio: your app, tonight*
- [ ] ~60 seconds of *what done looks like*: put the finished Curbside up — the new front page, a wrong id landing on your own page, `/Dishes/Details/11` saying *No truck is serving this yet*. ⚠️ **This is on localhost. Nothing is deployed for tonight's demo** — say so, because the course's own rule is that the deployed app is the grade and "my finished Curbside" reads as an Azure app otherwise
- [ ] Walk the three bullets as the evening's shape: *"your three things first — they are worth more than anything on my list. Then the front door, the empty states and the wrong-id page, which everybody needs. Then real data and a README with the live URL on it"*
- [ ] 🎯 Say the line at the foot and mean it: *"bring me your list, not your bugs. I would rather spend four minutes arguing about whether your front page says the right thing than four minutes on a missing semicolon"*
- [ ] ⚠️ Name the one thing not to do tonight, before anyone starts: *"you are going to notice that anybody with your URL can delete your records. Leave it. That is week 11, it is the whole week, and a midterm evening spent half-building a login is an evening wasted"*
- [ ] **Circulate.** The useful question at each desk is the same one every time: *"what are your three, and which one is the worst?"*

## 7 · Wrap-up, after the studio *(slide 11)*

- [ ] 🎞️ **GO TO SLIDE 11** — *Tonight, in one picture*
- [ ] Five rows, one sentence each. **Front door** gets the emphasis — *"it is the page you can least afford to get wrong, because it is the one nobody arrives already interested"*
- [ ] Homework: finish it, deploy it, run the pass on the Azure URL. ⚠️ **Say the two things people lose points on**: the `@section Scripts` block deleted along with the old home page, and a README that never mentions the live URL
- [ ] 🔗 Week 11: *"Identity. Registration, login, and the thing you noticed tonight and left alone"*
