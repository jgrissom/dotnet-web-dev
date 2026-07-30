# Week 6 Demo Script — Curbside Takes Orders 🌮

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-06/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!IMPORTANT]
> **Tonight you break things four times on purpose**, and unlike week 5 none of them takes the whole site down — each one produces a *wrong result* rather than an error page, which is exactly what makes them worth showing. Every break below has an explicit **restore** step. Do them.

## 0 · Before class

- [ ] **Copy `week-06/demo-starter/Curbside` out of the answer-keys repo** to a scratch folder. This is Curbside exactly as week 5's demo left it — branded, themed, card partial on two pages, a `@section Scripts` on Details
- [ ] `cd Curbside && dotnet watch`
- [ ] **Park two browser tabs**: `/Trucks` and `/Trucks/Details/2`
- [ ] **Dev tools open on the `/Trucks` tab, on the Network panel** — you're in it twice tonight and fumbling for it kills the beat
- [ ] Teaching profile; terminal font sized for the projector
- [ ] Sanity check: `/Trucks` shows six cards, `/Trucks/Details/1` shows the "Also in Madison" panel

> [!NOTE]
> **You will add trucks to a list that resets on restart.** `dotnet watch` restarts on every C# edit, so trucks you added five minutes ago will vanish mid-demo. That's not a problem — it's §5's punchline arriving early. If it happens, say so and move on.

## 1 · The round trip *(slides 3–7)*

### Frame it *(slide 2)*

- [ ] *"Five weeks, and every single page has been the same shape: the browser asks, we tell. Nothing has ever come the other way. Tonight it does — and three questions show up at once. How does their typing become a C# object, who decides if it's any good, and where does it go."*
- [ ] Slide 3 is the GET/POST table. **Land the third row** — *"refreshing a POST sends it again"*. **The orange `no` and the orange sentence underneath are deliberately the same colour: point at one, then the other.** *"That word is the entire reason tonight ends the way it does"* — then leave it hanging; you collect it at break #4, an hour and a half later

### A form with no help at all *(slide 4)*

- [ ] In `Controllers/TrucksController.cs`, below `Details`, **type** the GET action:
  ```csharp
  // GET /Trucks/Create
  public IActionResult Create()
  {
      return View();
  }
  ```
- [ ] Then the POST action — **type this one too**, and say what `Content()` is for: *"no view, no redirect, no cleverness. I just want to see what arrived"*:
  ```csharp
  [HttpPost]
  public IActionResult Create(Truck truck)
  {
      return Content($"You sent: {truck.Name}, {truck.Cuisine}, {truck.City}, rated {truck.Rating}");
  }
  ```
- [ ] Create `Views/Trucks/Create.cshtml` — **paste**. Say it out loud: *"this is week 2 HTML. No tag helpers, no `@model`, nothing you haven't written before"*

  <details><summary>📋 paste: Create.cshtml, plain HTML</summary>

  ```html
  @{
      ViewData["Title"] = "Add a truck";
  }

  <h1>Add a truck</h1>

  <form method="post">
      <label>Name <input name="Name" /></label>
      <label>Cuisine <input name="Cuisine" /></label>
      <label>City <input name="City" /></label>
      <label>Rating <input name="Rating" /></label>
      <button type="submit">Add it</button>
  </form>
  ```

  </details>

- [ ] Load `/Trucks/Create`. It's ugly. Fill it in — **`Wurst Case Scenario` / `German` / `Appleton` / `4.1`** — and submit:
  ```
  You sent: Wurst Case Scenario, German, Appleton, rated 4.1
  ```
- [ ] 🎯 **Point at it and stop.** *"A `Truck` object showed up in my method, fully filled in, and I wrote nothing to build it. That's the whole of Part 1 — why."*

### The Network tab *(slide 5)*

- [ ] Back, resubmit with the **Network** panel open. Click the `Create` request → **Payload**:
  ```
  Name=Wurst+Case+Scenario&Cuisine=German&City=Appleton&Rating=4.1
  ```
- [ ] **Week-3 callback:** *"that's the query-string format you already know — `key=value&key=value` — riding in the body instead of the URL. The form serialised itself and the server took it apart"*

### Break it #1 — the name attribute *(slide 6)*

- [ ] **Predict first:** *"I'm going to rename one input from `Cuisine` to `Food`, and change nothing else. Error, or something worse?"*
- [ ] In `Create.cshtml`, `name="Cuisine"` → `name="Food"`. Resubmit the same values:
  ```
  You sent: Wurst Case Scenario, , Appleton, rated 4.1
  ```
- [ ] **No error. An empty string.** *"Binding looked for something called Cuisine, didn't find it, and left the property alone. It is name-matching, and nothing else."*
- [ ] Say the payoff: *"when a field mysteriously arrives blank, this is always why"*
- [ ] **RESTORE `name="Cuisine"`** ⚠️
- [ ] Mention in passing, don't demo: binding is **case-insensitive**, and it's the same mechanism that filled `int id` from the route in week 4

### Break it #2 — two actions, one name *(slide 7)*

- [ ] Point at the two `Create` methods. *"C# is fine with these — they're overloads. Routing isn't; it only sees `/Trucks/Create`, and both of them answer to it"*
- [ ] Delete the `[HttpPost]` line and **just reload `/Trucks/Create`** — no need to submit:
  ```
  AmbiguousMatchException: The request matched multiple endpoints.
  ```
- [ ] *"A 500 on the page that worked a second ago. With no verb attribute, both actions claim every verb, and routing refuses to guess"*
- [ ] **RESTORE `[HttpPost]`. Reload and confirm the form comes back** ⚠️
- [ ] ⚠️ **Say the silent-failure version out loud, because it's the one they'll hit in the lab:** *"if you write only the GET action and no POST at all, clicking Submit gives you back a blank form. No error, nothing in the log — the POST just landed on the GET action. If your form 'does nothing', that's it."*
- [ ] **✓ CHECKPOINT:** the room can say what model binding matches on

## 2 · The same form, with tag helpers *(slides 8–11)*

- [ ] Frame it by counting what's wrong with the plain form: labels that will drift from the model, no `id` to click, a text box for a number, **and nowhere for an error to go**

### `asp-for`, one field at a time *(slide 8)*

- [ ] Replace **just the Name field** in `Create.cshtml` and add `@model Truck` at the top:
  ```html
  <label asp-for="Name" class="form-label"></label>
  <input asp-for="Name" class="form-control" />
  ```
- [ ] Refresh, **View Source**, find it:
  ```html
  <label class="form-label" for="Name">Name</label>
  <input class="form-control" type="text" id="Name" name="Name" value="" />
  ```
- [ ] Count the four jobs on your fingers: **the `name`** (the binding contract, now generated — it can't drift) · **the `id` and matching `for`** · **the label text, read off the model** · **`type="text"`, from the C# type**
- [ ] *"And the type isn't always text — watch the Open Late field in a minute"*
- [ ] Say it: **`asp-for="Name"` is a property name, not a string to print.** No `@`, no `Model.`. A typo is a *build* error

### The whole form *(slides 9–10)*

- [ ] Replace **all of** `Views/Trucks/Create.cshtml` — **paste**:

  <details><summary>📋 paste: Create.cshtml, tag helper version</summary>

  ```html
  @model Truck
  @{
      ViewData["Title"] = "Add a truck";
  }

  <h1>Add a truck</h1>

  <form asp-action="Create" method="post" class="col-md-6">
      <div asp-validation-summary="ModelOnly" class="text-danger"></div>

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

      <button type="submit" class="btn btn-primary">Add it</button>
      <a asp-action="Index" class="btn btn-link">Cancel</a>
  </form>
  ```

  </details>

- [ ] Refresh. **It's a real form now**, styled by the Bootswatch theme from last week, and you wrote no CSS
- [ ] **View Source** and land three things:
  - `IsOpenLate` is a **checkbox** — the `bool` chose that — plus a **hidden `IsOpenLate=false`** right after it. *"An unchecked box sends nothing at all, so without that hidden field a 'no' and a missing field would look identical. Razor sends false, and ticking the box overrides it"*
  - `Rating` is still `type="text"` *(the number box is for whole numbers)*, but it picked up **`data-val-number="The field Rating must be a number."`** — 🔗 *"that's the banana rule from twenty minutes ago, now written into the HTML. Nobody's reading it yet"*
  - the `<span>`s and the summary `<div>` rendered **empty**. *"Those are sockets. Part 3 plugs the errors in"*
- [ ] Resubmit the form to prove it still works — same `Content()` output as before

### The hidden field you didn't write *(slide 11)*

- [ ] In View Source, scroll to just inside `</form>`:
  ```html
  <input name="__RequestVerificationToken" type="hidden" value="CfDJ8L5JyJv3Gm..." />
  ```
- [ ] ⚠️ **Do not say the tag helper added it** — Razor adds it to **every** `<form method="post">`, including the hand-written one from §1. Worth saying explicitly, because it's the obvious wrong conclusion
- [ ] The one-paragraph why: *"without it, any other site could put a hidden form on their page pointing at your URL, and a logged-in visitor's browser would send it along with their cookies. The token is a value my server planted here and in a cookie; someone else's form can't produce a matching pair"*
- [ ] Add the attribute to the POST action — **type it**:
  ```csharp
  [HttpPost]
  [ValidateAntiForgeryToken]
  public IActionResult Create(Truck truck)
  ```
- [ ] *"The token was already in the page. This is what makes the server look."* Its failure mode is a **400 before your code runs** — worth recognising once
- [ ] **✓ CHECKPOINT:** everyone can say what `asp-for` writes into the HTML

## 3 · Rules that live on the model *(slides 12–18)* — **the load-bearing segment**

> [!IMPORTANT]
> If §1 or §2 ran long, take the time out of §4's second half, **not out of this**. The `ModelState.IsValid` break and the refresh-double-post break are the two moments that can't be recovered by reading the notes later.

### Where do the rules go? *(slide 12)*

- [ ] Submit the form with **no name and a rating of 9000**. The echo comes back cheerfully — *"You sent: , German, Appleton, rated 9000"*. **Nothing in the app has an opinion about any of it** *(the action is still the `Content()` echo — nothing is being stored yet, and nothing is being judged)*
- [ ] Ask it as a real question: *"somebody has to say what a valid truck is. Where does that live?"* Walk past the two wrong answers — **the view** (rules pasted into markup can't be reused, and a `Truck` gets made in more than one place) and **the controller** (every action grows the same block of ifs) — and land on **the model**

### Data annotations *(slides 13–14)*

- [ ] Open `Models/Truck.cs`. **Type the `using` and the first two attributes**, paste the rest:

  <details><summary>📋 paste: Truck.cs with annotations</summary>

  ```csharp
  using System.ComponentModel.DataAnnotations;

  namespace Curbside.Models;

  public class Truck
  {
      // Not on the form — the controller assigns it. Nothing to validate.
      public int Id { get; set; }

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

      [Display(Name = "Open late?")]
      public bool IsOpenLate { get; set; }
  }
  ```

  </details>

- [ ] Refresh the form. **The checkbox label now reads "Open late?"** — *"I changed the model and the form changed, because the label was reading the model the whole time"*
- [ ] **View Source on the Name input** and read the new attributes out: `data-val="true"`, `data-val-required="Every truck needs a name."`, `maxlength="50"`. *"My rules are in the HTML now. Park that — it pays off in twenty minutes"*
- [ ] Mention `{1}` and `{2}` in the Range message: the bounds fill themselves in, so the message can't drift from the rule
- [ ] ⚠️ **Say the implicit-required thing before it bites them:** *"`Rating` has no `[Required]`, but leave it blank and it'll complain anyway — a `double` has nowhere to put 'empty'. If you want a genuinely optional number, the property has to be `double?`"*

### ModelState *(slide 15)*

- [ ] Call back to §1: *"remember I said typing `banana` into Rating doesn't throw? Here's where that went"*
- [ ] *"While binding runs it keeps notes — every value it saw, every conversion it couldn't do, and now every rule that was broken. Those notes are called ModelState, and they're already on your controller"*
- [ ] Rewrite the POST action — **type the guard, paste the rest**:

  <details><summary>📋 paste: the real POST action</summary>

  ```csharp
  [HttpPost]
  [ValidateAntiForgeryToken]
  public IActionResult Create(Truck truck)
  {
      if (!ModelState.IsValid)
      {
          return View(truck);          // back to the form, with their input and the errors
      }

      truck.Id = TruckData.All.Max(t => t.Id) + 1;
      TruckData.All.Add(truck);

      return RedirectToAction(nameof(Index));
  }
  ```

  </details>

- [ ] Read it out: **`IsValid` is a question, not a command** — validation already ran during binding, before your first line · **`View(truck)`** hands back everything they typed · **the guard returns**, so everything below it can assume a good truck
- [ ] Submit a **good** truck — `Wurst Case Scenario / German / Appleton / 4.1`. It lands on `/Trucks` as a seventh card 🎉
- [ ] Submit a **bad** one — blank name, rating 9000. The form comes back, **their input still in it**, red messages beside two fields
- [ ] Point at where the messages landed: *"the empty spans from twenty minutes ago"*. And at the input itself — it picked up `input-validation-error` and Bootswatch outlined it red, and you wrote no CSS

### Break it #3 — delete the guard *(slides 16–17)*

- [ ] **Predict first:** *"if I comment out the IsValid check, what stops the bad truck?"*
- [ ] Comment out the whole `if (!ModelState.IsValid)` block. Submit the blank-name, 9000-rated truck again
- [ ] **It's on `/Trucks`.** A nameless card rated nine thousand
- [ ] 🎯 **The sentence:** *"The annotations did their job. They recorded the problem, and nobody read the record. **Attributes describe. The guard decides.**"*
- [ ] **RESTORE the block** ⚠️

### Break it #4 — the redirect *(slide 18)*

- [ ] *"Last line of the happy path is a redirect, and it looks like a pointless extra step. Watch."*
- [ ] Change the last line to:
  ```csharp
  return View("Index", TruckData.All);
  ```
- [ ] Submit a good truck — **it works**, the list appears. Now **point at the address bar**: it still says `/Trucks/Create`
- [ ] **Hit refresh.** Browser: *"Confirm Form Resubmission?"* → say yes → **two identical trucks in the list**
- [ ] **RESTORE `return RedirectToAction(nameof(Index));`** ⚠️ Submit another truck, then **refresh: nothing happens**, because the page you're on arrived by GET
- [ ] Name it: **POST-Redirect-GET**. *"It's why every form you have ever used bounces you to a different URL after you submit"*
- [ ] Show it in the **Network** panel: the POST comes back **302** with a `Location` header, then a separate GET. Two requests
- [ ] `nameof(Index)` over `"Index"` — renaming the action becomes a compile error instead of a 404
- [ ] **✓ CHECKPOINT:** the room can say what `ModelState.IsValid` is reading, and why a redirect follows a successful POST

## 4 · The same rules, in the browser *(slides 19–21)*

- [ ] Frame the cost: submit an empty form and count it out loud — *"click, wait, page reloads, red text. It works and it feels slow"*

### The partial week 5 promised *(slides 19–20)*

- [ ] Open `Views/Shared/_ValidationScriptsPartial.cshtml`. **The whole file:**
  ```html
  <script src="~/lib/jquery-validation/dist/jquery.validate.min.js"></script>
  <script src="~/lib/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.min.js"></script>
  ```
- [ ] 🔗 **Collect the week-5 promise:** *"a partial, containing scripts, meant to be rendered into a section. I pointed at this file twice last week and told you it would make sense tonight."*
- [ ] At the bottom of `Create.cshtml`, below `</form>` — **type it**:
  ```html
  @section Scripts {
      <partial name="_ValidationScriptsPartial" />
  }
  ```
- [ ] Refresh, submit the **empty** form: errors appear **instantly**. No reload, no round trip
- [ ] 🎯 *"Nothing in my C# changed. Those two scripts scan the page for the `data-val` attributes we watched appear twenty minutes ago, and enforce whatever they find. **One source of truth — `Models/Truck.cs` — enforced in two places.**"*
- [ ] Say why the section matters: dropped in the middle of the view it loads **before** jQuery and dies with `$ is not defined`. Week 5's section wasn't a formality

### Break it #5 — defeat it *(slide 21)*

> [!IMPORTANT]
> **This is the security beat of the night. Don't cut it, and don't rush the sentence at the end.**

- [ ] **Predict first:** *"if I switch the browser's validation off, does the truck get in?"*
- [ ] Dev tools → **Elements** → find the `<form>` → add a **`novalidate`** attribute to it *(double-click the tag, type it in)*
- [ ] Submit the empty form. **The browser lets it straight through** — no red text, a real POST goes out
- [ ] **And the server refuses it anyway**, with the same messages as before, because `ModelState.IsValid` never went anywhere
- [ ] 🎯 **Say this slowly:** *"Anything in the browser is a suggestion. It's someone else's computer — they can edit it, turn JavaScript off, or skip your page entirely and post to that URL from a terminal. The browser copy is for **speed**. The server copy is the one that's actually enforcing anything."*
- [ ] *"And that's why we did them in that order tonight. Do it the other way round and you learn to trust the wrong one"*
- [ ] **✓ CHECKPOINT:** nobody in the room thinks client-side validation is a security feature

## 5 · Where the truck actually went *(slide 22)*

- [ ] Show `/Trucks` with your added trucks on it. Seven, eight cards
- [ ] In the terminal: **`Ctrl+C`**, then `dotnet watch` again. Reload `/Trucks`
- [ ] **Six.** *"Gone."*
- [ ] Open `Models/TruckData.cs` and point at `static List<Truck>`. *"A variable in a running program. It lives exactly as long as the process does. Everything tonight was real — the form, the binding, the validation, the redirect. The **storage** is a placeholder, and it always has been. You just couldn't tell, because until tonight nothing ever changed"*
- [ ] ⚠️ **Warn them before the homework:** on Azure this is worse — a free-tier app **sleeps**, and wakes up with the hard-coded items only. If their test entries are missing when they check tomorrow, nothing is broken
- [ ] 🔗 **Week 7, pointing at the controller while you say it:** *"next week `TruckData.cs` is deleted and that list becomes a SQL Server table. And look at what changes in here — `ModelState.IsValid`, the guard, the redirect, all of it stays. One line changes: where the list comes from"*

## 6 · Hand off to the lab *(slide 23)*

- [ ] Show **what done looks like** — your finished Registry with a working form + `dotnet test` printing **6 / 6**. ~90 seconds, a target not a walkthrough
- [ ] Setup on screen, said once: **`git pull` → copy `week-06/lab/starter` out and rename it → open the folder holding *both* projects → `dotnet test Cryptids.Checks`**
- [ ] Say plainly: **the app arrives with last week's shell on it.** Nobody is blocked tonight by an unfinished week 5. Check 1 proves it
- [ ] **In-class target: checks 1–5.** Check 6 is a three-line paste and rolls into the homework
- [ ] Name the one exact string check 2 wants: **`[Display(Name = "First sighted")]`**
- [ ] ⚠️ **Warn them the checks post to their form.** Check 4 files a report called **The Beast of Bray Road**, and it stays in their registry until the app restarts. That's supposed to happen — without it the check can't know the form works
- [ ] ⚠️ **Say that their form is longer than mine.** Curbside has four fields; the Cryptid has five, and the year has a `[Range]` on it. The markup is all in the lab README as a paste — *"the task is the controller, not the typing"*
