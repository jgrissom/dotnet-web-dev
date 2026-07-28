# Week 4 Demo Script — Curbside 🌮

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-04/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

## 0 · Before class

- [ ] Scratch folder ready; Teaching profile; terminal font sized for the projector
- [ ] Two terminals planned: one for `dotnet watch`, one free
- [ ] Decide now: you will **restore the route pattern** at the end of §1. Say it out loud when you break it

## 0b · Spin up Curbside — **live, opening the routing segment** *(60 seconds)*

> [!IMPORTANT]
> Do this **live at 0:05**, as the first thing after the 5-minute status check — not before class. Tonight's homework asks them to build a new app from an empty folder, so watching you do it is rehearsal, not repetition.

- [ ] VS Code → File → Open Folder → create a new empty **Curbside** and open it
- [ ] Integrated terminal:
  ```bash
  dotnet new mvc --no-https
  dotnet watch
  ```
- [ ] **✓ say it:** *"Two commands, same as last week — and this is exactly the first thing your homework asks you to do tonight."*
- [ ] Working site on `localhost`; park a browser tab on `/` — you'll be typing URLs into it in about a minute
- [ ] **Build it fresh** — don't reuse week 3's CommonGrounds app. §1's predict-then-run table assumes a pristine template (no extra controllers)

## 1 · Routing: read it, then break it *(slides 3–5)*

- [ ] Open `Program.cs`, scroll to the pattern, read it aloud slot by slot:
  ```csharp
  pattern: "{controller=Home}/{action=Index}/{id?}"
  ```
- [ ] **Predict-then-run** each URL — ask for *class + method* before pressing Enter:

  | URL | Ask the room | *(answer)* |
  |-----|--------------|------------|
  | `/` | which controller? | `HomeController.Index()` — both defaults fire |
  | `/Home/Privacy` | ? | `HomeController.Privacy()` |
  | `/Privacy` | ? | **404** — it looks for `PrivacyController` |
  | `/Home/Privacy/7` | does it break? | works — `7` matches `{id?}`, nothing catches it |
  | `/Trucks` | ? | **404** — no `TrucksController`… *yet* |

- [ ] `/Privacy` is the money question — most rooms guess it works. Let them be wrong, then explain: **the first slot is always the controller**
- [ ] **Break it #1** — change the default action, save, visit `/`:
  ```csharp
  pattern: "{controller=Home}/{action=Privacy}/{id?}"
  ```
  "The home page didn't move. The *default* moved." Change it back to `Index`
- [ ] **Break it #2** — delete `/{id?}` from the pattern, save, visit `/Home/Privacy/7` → **404**. Three segments, a two-segment pattern. **Restore it**
- [ ] **✓ CHECKPOINT:** routing is configuration, not magic — and the pattern is back to normal (check it!)

## 2 · A second controller, in two steps *(slides 6–7)*

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
- [ ] Now swap `Content("trucks!")` for `return View();` → refresh → **error: view not found**
- [ ] **Read the error out loud.** It lists every path it searched. "This error doesn't say *broken* — it says *I looked here, here, and here*"
- [ ] Create `Views/Trucks/Index.cshtml` — **type it**:
  ```html
  <h1>Curbside</h1>
  <p>Wisconsin's finest, on four wheels.</p>
  ```
- [ ] `/Trucks` works
- [ ] **Misname on purpose:** rename the folder `Views/Trucks` → `Views/Truck`, refresh → the error is back. Rename it to `Trucks` again. Three names must agree
- [ ] **✓ CHECKPOINT:** the room can say what `return View()` looks for, without hedging

## 3 · Razor playground *(slides 8–12)*

Everything here happens in `Views/Trucks/Index.cshtml`. **View Source after every beat** — `Ctrl+U`, or **`⌘⌥U` on a Mac** (plain `⌘U` won't do it in Chrome); right-click → *View Page Source* if you'd rather not think about it. That's the whole point of the section.

- [ ] **Expressions** — add and save:
  ```html
  <p>The time is @DateTime.Now</p>
  <p>Two plus two is @(2 + 2)</p>
  ```
- [ ] View Source: the *values* are there, no `@` anywhere. "The server did the math"
- [ ] Refresh a few times — the clock ticks. Server-rendered, every request
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

- [ ] View Source: **four `<li>` in the output, one in the source.** Land slide 10's line — *you no longer write a page, you write a rule for producing a page*
- [ ] Add a fifth cuisine to the array → the page grows. **Data changed, markup didn't**
- [ ] Callback to week 2: "the coffee shop's six menu cards were six hand-typed blocks. This is that job, done once"
- [ ] **Comments** — paste both, save, View Source:
  ```html
  @* Razor comment — the server strips this *@
  <!-- HTML comment — this ships to the browser -->
  ```
- [ ] Only one survives. "Notes-to-self go in `@* *@`" — small beat, real security lesson
- [ ] **✓ CHECKPOINT:** every student can answer "does the browser ever see a `foreach`?"

## 4 · The model arrives *(slides 13–14)*

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
- [ ] Update `TrucksController.Index` — **type it**:
  ```csharp
  public IActionResult Index()
  {
      return View(TruckData.All);
  }
  ```
- [ ] 🔴 **`TruckData` goes red** — the controller can't see the Models namespace yet. Don't just fix it silently; make it a beat: put the cursor on the squiggle, **`Ctrl/Cmd + .`**, and take the offered fix. It adds this line at the top:
  ```csharp
  using Curbside.Models;
  ```
  "The compiler told us exactly what was missing and offered to fix it — that lightbulb is your friend all semester." *(Students hit this same red squiggle in the lab.)*
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
- [ ] **The IntelliSense moment** — inside the loop, type `@truck.` and let the list pop up. Then break it: change `@truck.Name` to `@truck.Titel`, save → **red squiggle + a build error before the refresh**. "`ViewData` would have failed silently. This didn't." Fix it
- [ ] **✓ CHECKPOINT:** the room has seen typed data go from C# to a table without a single line of JavaScript

## 5 · Details, and an honest 404 *(slides 15–16)*

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
- [ ] **Now visit `/Trucks/Details/999`** → a clean **404**. "Not a crash. Not a blank page. *That truck doesn't exist*, said properly"
- [ ] *(Optional, if the room is with you)* comment out the null check, refresh `/999` → a **500** and a `NullReferenceException`. Restore the guard. "500 means my code. 404 means routing. Tonight you've now caused both on purpose"
- [ ] **Link the list to the details** — in `Index.cshtml`, replace the empty `<td></td>` at the end of each row:
  ```html
  <td><a href="/Trucks/Details/@truck.Id">Details</a></td>
  ```
- [ ] View Source: **six different hrefs**, each with its own id, generated by one line. Click through two or three
- [ ] **✓ the moment:** `/Trucks` → click a row → `/Trucks/Details/4` → back. "That's a website. You wrote the whole loop tonight"
- [ ] Segue to lab: "your turn — the *Cryptid Registry*, six checks, same moves, different data"
