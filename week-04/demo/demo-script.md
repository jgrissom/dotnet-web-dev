# Week 4 Demo Script — Curbside 🌮

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-04/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it's due. Everything that isn't a 🎞️ line happens in the other state, so **you don't need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

## 0 · Before class

**The set, at curtain:**

```
dotnet-web-dev-course/
└─ instructor/
   ├─ week-03/CommonGrounds.Web    ← last week's, left alone
   └─ week-04/                     ← EMPTY. §0b creates Curbside in it, live at 0:05
```

⚠️ **Tonight's Curbside is built from scratch, not from week 3's app.** §1's predict-then-run table assumes a pristine template — nothing but `HomeController` — and `CommonGrounds.Web` has `MenuController` alongside it, so `/Menu` answers there and 404s here. Its own week folder is what keeps them apart — **you don't delete week 3 to get there.**

- [ ] **Make tonight's folder** (harmless if it's already there):
  ```bash
  mkdir -p ~/Repos/dotnet-web-dev-course/instructor/week-04
  ```
- [ ] ⚠️ **Rehearsed already? Clear just this week's app**, or `dotnet new` refuses a folder that already holds a project:
  ```bash
  rm -rf ~/Repos/dotnet-web-dev-course/instructor/week-04/Curbside
  ```
  💡 **Check it took:** `ls ~/Repos/dotnet-web-dev-course/instructor/week-04` prints nothing.
- [ ] **Have VS Code's Open Folder dialog land somewhere sane** — open `~/Repos/dotnet-web-dev-course/instructor/week-04` once beforehand so the picker starts there in §0b, which happens live at 0:05 with the room watching
- [ ] **Teaching profile in VS Code** (gear, bottom-left → **Profiles** → *Teaching*): C# and mssql extensions only, **no C# Dev Kit** — so your editor matches theirs pixel for pixel. Bump both font sizes **in that profile** so they stick: `terminal.integrated.fontSize` (start around **18**) and `editor.fontSize` (around **16**)
- [ ] **Say it before you start: *"lids down for this part — you'll build your own tonight."*** They watch you build Curbside; their lab is the *Cryptid Registry* and their homework is a third app. **The predict-then-run tables are where they participate** — those only work if people are looking up
- [ ] ⚠️ **Know the one prompt that will bite you, and answer it `a` the first time.** Creating a *new* `.cshtml` — §2's `Index.cshtml`, then §5's `Details.cshtml` — is a change hot reload can't apply, so `dotnet watch` stops and asks **`Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`** in the terminal. Until you answer, the page keeps failing while the file on screen looks perfectly correct. Answer **`a`** at that first prompt and it never asks again all night
- [ ] Decide now: you will **restore the route pattern** at the end of §1. Say it out loud when you break it

## 0b · Spin up Curbside — **live, opening the routing segment** *(60 seconds)*

> [!IMPORTANT]
> Do this **live at 0:05**, as the first thing after the 5-minute status check — not before class. Tonight's homework asks them to build a new app from an empty folder, so watching you do it is rehearsal, not repetition.

- [ ] 🎞️ **GO TO SLIDE 2** — *Last week vs. tonight*
- [ ] 🎯 **Say the contrast on the slide before you open anything** — it's tonight in two lines: *"last week, one URL found one method. Tonight, an app is a set of URLs over a set of data."* The four bullets under it are the running order, and the last word on the slide — **typed** — is the one §4 comes back to
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course/instructor/week-04`, create a new empty **Curbside** and open it
- [ ] Integrated terminal:
  ```bash
  dotnet new mvc --no-https
  dotnet watch
  ```
- [ ] **✓ say it:** *"Two commands, same as last week — and this is exactly the first thing your homework asks you to do tonight."*
- [ ] Working site on `localhost`; park a browser tab on `/` — you'll be typing URLs into it in about a minute

## 1 · Routing: read it, then break it *(slides 3–5)*

### Read the pattern

- [ ] 🎞️ **GO TO SLIDE 3** — *The pattern, decoded*. Read the slots off the slide, then open the real `Program.cs`
- [ ] Open `Program.cs`, scroll to the pattern, read it aloud slot by slot:
  ```csharp
  pattern: "{controller=Home}/{action=Index}/{id?}"
  ```

### Predict-then-run

- [ ] 🎞️ **GO TO SLIDE 4** — *Predict before you press Enter*. **The slide is the exercise** — work the table off it, asking the room each time
- [ ] **Predict-then-run** each URL — ask for *class + method* before pressing Enter:

  | URL | Ask the room | *(answer)* |
  |-----|--------------|------------|
  | `/` | which controller? | `HomeController.Index()` — both defaults fire |
  | `/Home/Privacy` | ? | `HomeController.Privacy()` |
  | `/Privacy` | ? | **404** — it looks for `PrivacyController` |
  | `/Home/Privacy/7` | does it break? | works — `7` matches `{id?}`, nothing catches it |
  | `/Trucks` | ? | **404** — no `TrucksController`… *yet* |

- [ ] ⚠️ **The slide's last line promises that two of the five do something they won't expect — these are the two.** `/Privacy` **404s where they expect it to work**, and `/Home/Privacy/7` **works where they expect it to break**. The other three land where the room puts them, so move briskly through those and spend the minutes here. If you ever add a row, re-count the slide
- [ ] 🎞️ **GO TO SLIDE 5** — *The URL is not a file path*. Land it on the `/Privacy` answer they just got wrong
- [ ] `/Privacy` is the money question — most rooms guess it works. Let them be wrong, then explain: **the first slot is always the controller**
- [ ] **Break it #1** — change the default action, save, visit `/`:
  ```csharp
  pattern: "{controller=Home}/{action=Privacy}/{id?}"
  ```
  "The home page didn't move. The *default* moved." Change it back to `Index`
- [ ] **Break it #2** — delete `/{id?}` from the pattern, save, visit `/Home/Privacy/7` → **404**. Three segments, a two-segment pattern. **Restore it**
- [ ] **✓ CHECKPOINT:** routing is configuration, not magic — and the pattern is back to normal (check it!)

## 2 · A second controller, in two steps *(slides 6–7)*

### A controller with no view

- [ ] 🎞️ **GO TO SLIDE 6** — *Three names must agree*: `TrucksController` → `/Trucks` → `Views/Trucks/Index.cshtml`
- [ ] Create `Controllers/TrucksController.cs` — **type it**:
  ```csharp
  using Microsoft.AspNetCore.Mvc;

  namespace Curbside.Controllers;

  public class TrucksController : Controller
  {
      public IActionResult Index()
      {
          return Content("trucks!");
      }
  }
  ```
- [ ] Visit `/Trucks` → the word **trucks!** on a blank page. No view exists — *routing is proven on its own*

### Then the view

- [ ] 🎞️ **GO TO SLIDE 7** — *Prove one half at a time*. That's what `Content()` was for; now take the second half
- [ ] Now swap `Content("trucks!")` for `return View();` → refresh → **error: view not found**
- [ ] **Read the error out loud.** It names the two paths it searched — `/Views/Trucks/Index.cshtml`, then `/Views/Shared/Index.cshtml`. "This error doesn't say *broken* — it says *I looked here, and here*"
- [ ] Create `Views/Trucks/Index.cshtml` — **type it**:
  ```html
  <h1>Curbside</h1>
  <p>Wisconsin's finest, on four wheels.</p>
  ```
- [ ] ⚠️ **This is that first restart prompt** — `dotnet watch` is asking in the terminal because the file is new. Answer **`a`**, and `/Trucks` works
- [ ] **Misname on purpose:** rename the folder `Views/Trucks` → `Views/Truck`, refresh → the error is back. Rename it to `Trucks` again. Three names must agree
- [ ] **✓ CHECKPOINT:** the room can say what `return View()` looks for, without hedging

## 3 · Razor playground *(slides 8–12)*

Everything here happens in `Views/Trucks/Index.cshtml`.

> [!IMPORTANT]
> **Each beat is appended below the last** — keep the `<h1>Curbside</h1>` and the tagline from §2 at the top and let the file grow underneath. Nothing here is a rewrite; you're stacking experiments on one page so the room watches it accumulate. **§4 throws all of it away** and replaces the file with the real typed view, so don't polish anything.

**View Source after every beat** — `Ctrl+U`, or **`⌘⌥U` on a Mac** (plain `⌘U` won't do it in Chrome); right-click → *View Page Source* if you'd rather not think about it. That's the whole point of the section.

### Expressions

- [ ] 🎞️ **GO TO SLIDE 8** — *Razor: `@` is the door*
- [ ] 🎯 **Land the slide's bottom line, which is the half the page can't show:** *"if you have written a template literal in JavaScript, the `@` is the same instinct. The difference is where it runs — this one runs on the server, and by the time the browser sees the page the `@` is gone"*
- [ ] **Expressions** — add and save:
  ```html
  <p>The time is @DateTime.Now</p>
  <p>Two plus two is @(2 + 2)</p>
  ```
- [ ] View Source: the *values* are there, no `@` anywhere. "The server did the math"
- [ ] Refresh a few times — the clock ticks. Server-rendered, every request

### Blocks and branches

- [ ] 🎞️ **GO TO SLIDE 9** — *Blocks and branches*
- [ ] 🎯 **Name the two shapes off the slide before you paste them:** *"`@{ }` is a block that runs and prints nothing. `@if` is a branch that decides which HTML gets built. Both of those are C# living inside a page"* — the `else` is the next beat's business, don't spend it here
- [ ] **A code block + a conditional** — paste:

  <details><summary>📋 paste: block + if/else</summary>

  ```html
  @{
      var truckCount = 6;
      var isOpenLate = true;
  }

  <p>We track @truckCount trucks.</p>

  @if (isOpenLate)
  {
      <span class="badge bg-success">🌙 Open late</span>
  }
  else
  {
      <span class="badge bg-secondary">Closes at 8</span>
  }
  ```

  </details>

- [ ] Flip `isOpenLate` to `false`, save, refresh — **different HTML, same file**. View Source: only the branch that ran is there. The other one *never existed*
- [ ] Point at `else` — **no `@`**. "Once you open `@if`, you're in C# until the braces close." Predict the #1 typo of the night before it happens

### A loop

- [ ] **A loop** — paste:

  <details><summary>📋 paste: foreach over a plain array</summary>

  ```html
  @{
      var cuisines = new[] { "Korean", "Mexican", "Greek", "Polish" };
  }

  <ul>
      @foreach (var c in cuisines)
      {
          <li>@c</li>
      }
  </ul>
  ```

  </details>

- [ ] **Ask for the number before you scroll to it** — *"one `<li>` is in the file. How many are in what the browser got?"* Then View Source: **four `<li>` in the output, one in the source**
- [ ] 🎞️ **GO TO SLIDE 10** — *The big idea*. It now says the number they just counted, so land its bottom line: *"you no longer write a page. You write a rule for producing a page"*
- [ ] Add a fifth cuisine to the array → the page grows. **Data changed, markup didn't**
- [ ] 🎞️ **GO TO SLIDE 11** — *Week 2, revisited*
- [ ] Callback to week 2: "the coffee shop's six menu cards were six hand-typed blocks. This is that job, done once"

### Comments

- [ ] 🎞️ **GO TO SLIDE 12** — *What does the browser actually get?*
- [ ] 🎯 **Use the slide to close §3, then let the comments be the last case:** *"everything we wrote in this file — the `@`, the `foreach`, the `if` — is gone from what shipped. The browser got HTML and nothing else"*
- [ ] **Comments** — paste both, save, View Source:
  ```html
  @* Razor comment — the server strips this *@
  <!-- HTML comment — this ships to the browser -->
  ```
- [ ] Only one survives. "Notes-to-self go in `@* *@`" — small beat, real security lesson
- [ ] **✓ CHECKPOINT:** every student can answer "does the browser ever see a `foreach`?"

## 4 · The model arrives *(slides 13–16)*

### The model class

- [ ] 🎞️ **GO TO SLIDE 13** — *The model is just a class*
- [ ] 🎯 **Land the two lines under the code:** *"no base class, no attributes, nothing from ASP.NET. The M in MVC is plain C# — this is the least new thing tonight"*
- [ ] Create `Models/Truck.cs` — **type it** (it's a plain C# class; nothing web about it):
  ```csharp
  namespace Curbside.Models;

  public class Truck
  {
      public int Id { get; set; }
      public string Name { get; set; } = "";
      public string Cuisine { get; set; } = "";
      public string City { get; set; } = "";
      public double Rating { get; set; }
      public bool IsOpenLate { get; set; }
  }
  ```

### The seed data

- [ ] 🎞️ **GO TO SLIDE 14** — *Six trucks, no database*
- [ ] 🎯 **Land the `static`, which is the half the file itself won't explain:** *"a new controller object is created for every single request. An instance field would be gone before the next visitor arrived — `static` is what makes this behave like a data store"*
- [ ] Create `Models/TruckData.cs` — **paste**:

  <details><summary>📋 paste: the seeded list</summary>

  ```csharp
  namespace Curbside.Models;

  public static class TruckData
  {
      public static List<Truck> All { get; } = new()
      {
          new Truck { Id = 1, Name = "Roll Models",        Cuisine = "Korean",     City = "Madison",        Rating = 4.6, IsOpenLate = true  },
          new Truck { Id = 2, Name = "Cheese Curd Cartel", Cuisine = "Comfort",    City = "Green Bay",      Rating = 4.8, IsOpenLate = true  },
          new Truck { Id = 3, Name = "Taco Tornado",       Cuisine = "Mexican",    City = "Milwaukee",      Rating = 4.4, IsOpenLate = false },
          new Truck { Id = 4, Name = "The Gyro Wheel",     Cuisine = "Greek",      City = "Madison",        Rating = 4.2, IsOpenLate = true  },
          new Truck { Id = 5, Name = "Pierogi Party",      Cuisine = "Polish",     City = "Stevens Point",  Rating = 4.7, IsOpenLate = false },
          new Truck { Id = 6, Name = "Banh Mi Mobile",     Cuisine = "Vietnamese", City = "Milwaukee",      Rating = 4.5, IsOpenLate = false },
      };
  }
  ```

  </details>

- [ ] Say the week-7 line **now**, while it's on screen: *"this is a hard-coded list today. In week 7 it becomes a database table — and almost none of the code we're about to write changes"*

### Into the controller

- [ ] 🎞️ **GO TO SLIDE 15** — *Three ways in*
- [ ] **Read the three rows off the table** — *"a value out of the URL, a scrap in `ViewData`, or the model itself. All three happen tonight — and the starred one is the one that carries the page"*
- [ ] Update `TrucksController.Index` — **type it**:
  ```csharp
  public IActionResult Index()
  {
      return View(TruckData.All);
  }
  ```
- [ ] 🔎 **The controller needs `using Curbside.Models;` at the top** — without it this does not compile (`CS0103: The name 'TruckData' does not exist`). **Which of these you see depends on how you typed it:**

  <details><summary>🔴 <b>It went red</b> — you typed <code>TruckData</code> straight through</summary>

  Make it a beat rather than a silent fix: put the cursor on the squiggle, press **`Ctrl/Cmd + .`**, take the offered fix. *"The compiler told us exactly what was missing and offered to fix it — that lightbulb is your friend all semester."*

  </details>

  <details><summary>🟢 <b>Nothing went red</b> — you picked <code>TruckData</code> from the IntelliSense list</summary>

  Then VS Code **already added the using for you** when you accepted the completion. Don't skip past it — scroll to the top of `TrucksController.cs`, point at the new line, and say *"notice it wrote that for us the moment we accepted the suggestion. It had to: `Curbside.Controllers` can't see `Curbside.Models` on its own."*

  </details>

  Either way, land the point: **a namespace isn't visible just because it's in the same project.** *(Students hit this in the lab — the lab README warns them.)*

### Into the view

- [ ] 🎞️ **GO TO SLIDE 16** — *Strongly typed views*
- [ ] **Two halves, and they have to agree** — *"the controller hands something over, and the view declares what it is expecting on its first line. When those two disagree you get the error you are about to see me cause"*
- [ ] Replace the whole of `Views/Trucks/Index.cshtml` — **paste**:

  <details><summary>📋 paste: the typed Index view</summary>

  ```html
  @model List<Truck>
  @{
      ViewData["Title"] = "Trucks";
  }

  <h1>Curbside</h1>
  <p class="text-muted">@Model.Count trucks on the street.</p>

  <table class="table table-striped">
      <thead>
          <tr>
              <th>Name</th>
              <th>Cuisine</th>
              <th>City</th>
              <th>Rating</th>
              <th></th>
          </tr>
      </thead>
      <tbody>
          @foreach (var truck in Model)
          {
              <tr>
                  <td>@truck.Name</td>
                  <td>@truck.Cuisine</td>
                  <td>@truck.City</td>
                  <td>@truck.Rating</td>
                  <td>
                      @if (truck.IsOpenLate)
                      {
                          <span class="badge bg-success">🌙 Open late</span>
                      }
                  </td>
              </tr>
          }
      </tbody>
  </table>
  ```

  </details>

- [ ] Six rows, styled, from six objects. **Let it land.** Point at `@model` (line 1) and `@Model` (the `.Count`) and name the lowercase/capital difference
- [ ] **Now make the two halves disagree** — the error you promised a minute ago. In `TrucksController.Index`, hand the view *one* truck instead of the whole list:
  ```csharp
  return View(TruckData.All[0]);
  ```
- [ ] Refresh `/Trucks` → **500**. Read the message out loud; it names both types — *"the model item passed into the ViewDataDictionary is of type `Truck`, but this ViewDataDictionary instance requires a model item of type `List<Truck>`"*
- [ ] Land it: *"the controller and the view disagreed, and nothing caught it until someone asked for the page. Hold that thought"*
- [ ] **Restore it** — back to `return View(TruckData.All);` — and refresh until the six rows are back before you go on
- [ ] **The IntelliSense moment** — inside the loop, type `@truck.` and let the list pop up. Then break it: change `@truck.Name` to `@truck.Titel`, save → **red squiggle + a build error before the refresh**. "`ViewData` would have failed silently. This didn't." Fix it
- [ ] **Cash the contrast from a minute ago:** *"the mismatch needed a visitor to find it. The typo never even built. Same week, two different moments for something to go wrong"*
- [ ] **✓ CHECKPOINT:** the room has seen typed data go from C# to a table without a single line of JavaScript

## 5 · Details, and an honest 404 *(slides 17–18)*

### The Details action

- [ ] 🎞️ **GO TO SLIDE 17** — *The pair behind every site*
- [ ] 🎯 **Land it as the shape of the whole web:** *"a list, and a details page. That pair is most of the web — and tonight's lab is exactly those two pages"*
- [ ] Add to `TrucksController` — **type it**:
  ```csharp
  public IActionResult Details(int id)
  {
      var truck = TruckData.All.FirstOrDefault(t => t.Id == id);

      if (truck == null)
      {
          return NotFound();
      }

      return View(truck);
  }
  ```
- [ ] Create `Views/Trucks/Details.cshtml` — **paste**:

  <details><summary>📋 paste: the Details view</summary>

  ```html
  @model Truck
  @{
      ViewData["Title"] = Model.Name;
  }

  <h1>@Model.Name</h1>
  <p class="lead">@Model.Cuisine · @Model.City</p>
  <p>Rating: @Model.Rating / 5</p>

  @if (Model.IsOpenLate)
  {
      <p><span class="badge bg-success">🌙 Open late</span></p>
  }

  <a href="/Trucks">← Back to all trucks</a>
  ```

  </details>

- [ ] Visit `/Trucks/Details/2` → **Cheese Curd Cartel**. Then `/Trucks/Details/5` → Pierogi Party. *Same method, different URL, different page*
- [ ] Point at the URL: "where did the `2` come from? The **third route slot** — `{id?}`, from slide 3. That's what it was for"

### An honest 404

- [ ] 🎞️ **GO TO SLIDE 18** — *Guard the door*
- [ ] **Now visit `/Trucks/Details/999`** → a clean **404**. "Not a crash. Not a blank page. *That truck doesn't exist*, said properly"
- [ ] *(Optional, if the room is with you)* comment out the null check, refresh `/999` → a **500** and a `NullReferenceException`. Restore the guard. "500 means my code. 404 means routing. Tonight you've now caused both on purpose"
- [ ] **Link the list to the details** — in `Index.cshtml`, the last `<td>` of each row currently holds only the badge. Add the link **inside that same cell**, just below the `@if` block, so it reads:
  ```html
  <td>
      @if (truck.IsOpenLate)
      {
          <span class="badge bg-success">🌙 Open late</span>
      }
      <a href="/Trucks/Details/@truck.Id">Details</a>
  </td>
  ```
- [ ] View Source: **six different hrefs**, each with its own id, generated by one line. Click through two or three
- [ ] **✓ the moment:** `/Trucks` → click a row → `/Trucks/Details/4` → back. "That's a website. We built the whole loop tonight"
- [ ] Segue to lab: "your turn — the *Cryptid Registry*, six checks, same moves, different data"

## 6 · Hand off to the lab *(slide 19)*

- [ ] 🎞️ **GO TO SLIDE 19** — *Lab: Cryptid Registry 👻*. Leave it up for the whole lab; it's the task list
- [ ] Show **what done looks like** — the answer key **running on localhost** + `dotnet test Cryptids.Checks` printing **6 / 6**. That's `week-04/lab/solution` in the answer-keys repo; `dotnet run` from `Cryptids.Web`, `dotnet test` from the folder above it. ~90 seconds, a target not a walkthrough. **Nothing is deployed for this** — Azure is their homework, not tonight
- [ ] Setup on screen, said once: **`git -C dotnet-web-starters pull` → copy `week-04` out and rename it → open the folder holding *both* projects → `dotnet test Cryptids.Checks`** → **1 / 6**, and that 1 is the harness proving itself
- [ ] Say plainly: **nobody creates a project tonight.** The model and the seed data ship in the starter — *"the lab is controllers, views and routing. Nobody types six creatures"*
- [ ] **In-class target: checks 1–4.** Checks 5–6 and the deploy roll into the homework by design — say so
- [ ] **Say what they're rebuilding:** *"you built these six in flat HTML in week 2 — same creatures, same archive. Tonight the page comes off a model instead of being typed out six times"*

## 7 · Wrap-up, after the lab *(slides 20–21)*

- [ ] 🎞️ **GO TO SLIDE 20** — *Before next week*. The homework and the reading
- [ ] 🎯 **Spend the time on the second checkmark — it's the only one that outlives tonight:** *"the topic you pick this week is the app you keep extending for the rest of the semester. In week 9 you add a second related table to it, so pick something that can grow one"* — then land the slide's last line: **pick a topic you can live with**
- [ ] 🎞️ **GO TO SLIDE 21** — *The chain, complete*. Walk it once: URL → route → controller → model → view
