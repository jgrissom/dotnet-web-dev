# Week 6 Demo Script — Curbside Takes Orders 🌮

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-06/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it's due. Everything that isn't a 🎞️ line happens in the other state, so **you don't need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

> [!IMPORTANT]
> **Tonight you break things four times on purpose**, and unlike week 5 none of them takes the whole site down — each one produces a *wrong result* rather than an error page, which is exactly what makes them worth showing. Every break below has an explicit **restore** step. Do them.

## 0 · Before class

- [ ] ⚠️ **Re-rehearsing this week? Delete `instructor/week-06/Curbside` first** — a rehearsal leaves it in tonight's **end** state, and every beat below starts from week 5's. Deleting the folder in Finder is enough; the next step recreates it
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course/instructor/week-06`, create a new empty **Curbside** and open it *(the dialog's **New Folder** button makes `week-06` too, the first time)*. Its own week folder, so nothing here collides with another week's `Curbside` and no previous demo gets deleted
- [ ] Integrated terminal (**Ctrl+&#96;**) — fill the empty folder with tonight's starter. This is Curbside as week 5's demo left it — branded, themed, card partial on two pages, a `@section Scripts` on Details — **plus one thing week 5 didn't have: an `＋ Add a truck` button on `/Trucks` that goes nowhere.** It 404s until §1 builds the action behind it. That's deliberate; it's tonight's job, and from §1 on it's how you get to the form instead of retyping the URL:
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-06/demo-starter/Curbside/. .
  ```
  The trailing `/.` copies the *contents* in, so the project lands at the top of the window you already have open — no folder inside a folder
- [ ] Run it, same terminal:
  ```bash
  dotnet watch
  ```
- [ ] **Set the Port box at the top of this page** to whatever `dotnet watch` just printed — `Now listening on: http://localhost:5164`. Every `localhost` URL in this sheet retargets to match, including what the **Copy** buttons put on your clipboard, and it's remembered next time. §2's `curl` is the one that cares
- [ ] **Park two browser tabs**: `/Trucks` and `/Trucks/Details/2`
- [ ] **Dev tools open on the `/Trucks` tab, on the Network panel** — you're in it twice tonight and fumbling for it kills the beat
- [ ] **Keep the terminal visible** (it's sized in the Teaching profile below). In §1 it stops being where the app runs and becomes the thing everyone is looking at
- [ ] **Learn how to clear it before you need it — you can't type `clear`.** `dotnet watch` is running in that terminal, so the shell is *not* at a prompt and your keystrokes go to the watcher, not to a shell. Clear it from the **editor** instead:
  - **Mac:** focus the terminal, press **⌘K**
  - **Windows / Linux:** **right-click the terminal → Clear** *(there's no default shortcut)*
  - **Either:** Command Palette (**⇧⌘P** / **Ctrl+Shift+P**) → *Terminal: Clear*
  
  You need it twice tonight — once in §1 and once in §3 — and a wiped terminal with exactly one object in it reads instantly from the back row
- [ ] **Teaching profile in VS Code** (gear, bottom-left → **Profiles** → *Teaching*): C# and mssql extensions only, **no C# Dev Kit**. Bump both font sizes **in that profile** so they stick: `terminal.integrated.fontSize` (start around **18** — §1 turns the terminal into the thing everyone is looking at) and `editor.fontSize` (around **16**)
- [ ] **Say it before you start: *"lids down for this part — you'll build it yourself in the lab."*** Nobody can follow along tonight even if they want to; Curbside isn't in the public repo. And the four breaks below would take fourteen machines down with them. **The predict-then-run moments are where they participate** — those only work if people are looking up
- [ ] Sanity check: `/Trucks` shows six cards **and the `＋ Add a truck` button**, `/Trucks/Details/1` shows the "Also in Madison" panel. **Don't click the button yet** — a 404 during setup is expected, but you want its first press to be the one in §1 that works

> [!NOTE]
> **You will add trucks to a list that resets on restart.** `dotnet watch` restarts on every C# edit, so trucks you added five minutes ago will vanish mid-demo. That's not a problem — it's §5's punchline arriving early. If it happens, say so and move on.

**🖥️ On screen, at curtain** — checklist above done, this is what the room walks in to; the projector's second state, side by side:

- **VS Code**, left half — folder `~/Repos/dotnet-web-dev-course/instructor/week-06/Curbside`, with `dotnet watch` in its integrated terminal and that terminal kept visible
- **Browser**, right half — two tabs: `/Trucks` (dev tools open, on the Network panel) and `/Trucks/Details/2`

## 1 · The round trip *(slides 2–7)*

### Frame it *(slides 2–3)*

- [ ] 🎞️ **GO TO SLIDE 2** — *Five weeks, one direction*
- [ ] *"Five weeks, and every single page has been the same shape: the browser asks, we tell. Nothing has ever come the other way. Tonight it does — and three questions show up at once. How does their typing become a C# object, who decides if it's any good, and where does it go."*
- [ ] 🎞️ **GO TO SLIDE 3** — *GET vs. POST*. **Land the third row** — *"refreshing a POST sends it again"*. **The orange `no` and the orange sentence underneath are deliberately the same color: point at one, then the other.** *"That word is the entire reason tonight ends the way it does"* — then leave it hanging; you collect it at break #4, an hour and a half later

### A form with no help at all *(slide 4)*

- [ ] 🎞️ **GO TO SLIDE 4** — *A form, with no help at all*. **Read it off the slide, then swipe back and type it** — both blocks are on it, so anyone who falls behind can catch up here rather than from your screen
- [ ] In `Controllers/TrucksController.cs`, below `Details`, **type** the GET action:
  ```csharp
  // GET /Trucks/Create
  public IActionResult Create()
  {
      return View();
  }
  ```
- [ ] Then the POST action — **type this one too**. Say what it's for: *"no view, no redirect, no cleverness. I just want to print what arrived and look at it"*:
  ```csharp
  [HttpPost]
  public IActionResult Create(Truck truck)
  {
      Console.WriteLine($"── model binding built a {truck.GetType().Name} ──");
      Console.WriteLine($"   Name      {truck.Name}");
      Console.WriteLine($"   Cuisine   {truck.Cuisine}");
      Console.WriteLine($"   City      {truck.City}");
      Console.WriteLine($"   Rating    {truck.Rating}   (x2 = {truck.Rating * 2})");
      Console.WriteLine($"   Open late {truck.IsOpenLate}");

      return Content("Submitted — look at the terminal 👀");
  }
  ```
- [ ] Point at two of the things you just typed **before you run it**, so they're primed: `GetType().Name`, and `Rating * 2`. *"Hold onto that times-two"*
- [ ] `Open late` will print `False` and there's no such box on the form yet — **leave it alone for now**; the checkbox arrives in §2 and this line is what proves it binds
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

- [ ] **Clear the terminal** (⌘K, or right-click → Clear), then go to `/Trucks` and **click `＋ Add a truck`** — the dead button from setup now goes somewhere. *"One action, one view, and the link that's been 404ing works. That's the whole of last week's routing still doing its job"*. It's ugly. Fill it in — **`Wurst Case Scenario` / `German` / `Appleton` / `4.1`** — and submit
- [ ] Browser says *"look at the terminal 👀"* — and the terminal is right there beside it. **Read it out:**
  ```
  ── model binding built a Truck ──
     Name      Wurst Case Scenario
     Cuisine   German
     City      Appleton
     Rating    4.1   (x2 = 8.2)
     Open late False
  ```
- [ ] 🎯 **Point at it and stop.** *"A `Truck` object showed up in my method, fully filled in, and I wrote nothing to build it. That's the whole of Part 1 — why."*
- [ ] Then the second half, and **don't rush it**: *"look at the top line — `built a Truck`. Not a bag of strings, an instance of the class you wrote in week 4. And look at the bottom — **you cannot multiply a string.** The browser sent me the characters four-point-one. What arrived was a number."*

### The Network tab *(slide 5)*

- [ ] 🎞️ **GO TO SLIDE 5** — *What arrived — in the terminal*, with the raw payload underneath. Up now; the live Network tab below is the proof
- [ ] Back, resubmit with the **Network** panel open. Click the `Create` request → **Payload**:
  ```
  Name=Wurst+Case+Scenario&Cuisine=German&City=Appleton&Rating=4.1
  ```
- [ ] **Week-3 callback:** *"that's the query-string format from week 3 — `key=value&key=value` — riding in the body instead of the URL. The form serialized itself and the server took it apart"*

### Break it #1 — two silent failures *(slide 6)*

> [!IMPORTANT]
> **Do NOT clear the terminal for this one.** The good result from a minute ago has to stay on screen — the whole beat is the two blocks sitting one above the other.

- [ ] 🎞️ **GO TO SLIDE 6** — *Two silent failures* · **predict both, show of hands, then touch nothing until they answer:** *"I'm going to rename one input from `Cuisine` to `Food`. And this time I'll type `banana` into Rating. Neither is going to be an error — so what do I get?"*
- [ ] In `Create.cshtml`, `name="Cuisine"` → `name="Food"`. **Watch `dotnet watch` hot-reload it** — two lines, no restart
- [ ] Back in the browser: fill the form in again, **`banana` in the Rating box**, submit. The new block lands in the terminal right under the good one:
  ```
  ── model binding built a Truck ──
     Name      Wurst Case Scenario
     Cuisine   German
     City      Appleton
     Rating    4.1   (x2 = 8.2)
     Open late False
  dotnet watch ⌚ Files updated: ./Views/Trucks/Create.cshtml
  dotnet watch 🔥 Hot reload succeeded.
  ── model binding built a Truck ──
     Name      Wurst Case Scenario
     Cuisine
     City      Appleton
     Rating    0   (x2 = 0)
     Open late False
  ```
- [ ] 🎯 **Two fingers, one on each block.** *"No error. No warning. Two properties quietly wrong — and for two completely different reasons."*
- [ ] **`Cuisine` is empty** — binding went looking for a value called `Cuisine`, found nothing, left the property alone. *"It is name-matching, and nothing else."*
- [ ] **`Rating` is `0`** — `banana` isn't a number, so it couldn't convert and kept the default. And `x2 = 0` proves *a number* is sitting there, not the word they typed
- [ ] Say the payoff: *"when a field mysteriously arrives blank or zero, it's one of these two. Every time."*
- [ ] **RESTORE `name="Cuisine"`** ⚠️
- [ ] 🔗 **Plant it:** *"neither of those threw — but neither went unrecorded either. Something wrote both down. You meet it after the break."*
- [ ] Mention in passing, don't demo: binding is **case-insensitive**, and it's the same mechanism that filled `int id` from the route in week 4

### Break it #2 — two actions, one name *(slide 7)*

- [ ] 🎞️ **GO TO SLIDE 7** — *Two actions, one name*. Both signatures and the exception are on it; talk to the slide, then break it live
- [ ] Point at the two `Create` methods. *"C# is fine with these — they're overloads. Routing isn't; it only sees `/Trucks/Create`, and both of them answer to it"*
- [ ] Delete the `[HttpPost]` line and **just reload `/Trucks/Create`** — no need to submit:
  ```
  AmbiguousMatchException: The request matched multiple endpoints.
  ```
- [ ] *"A 500 on the page that worked a second ago. With no verb attribute, both actions claim every verb, and routing refuses to guess"*
- [ ] ⚠️ **RESTORE `[HttpPost]` — then `Ctrl+R` in the watch pane before you reload.** Same reason as the antiforgery beat later tonight: this is an attribute-only edit, MVC works out each action's verb at startup, and hot reload applies it only *sometimes*. **The restore is the dangerous half** — on a bad roll the exception survives a correct file, and you are debugging a non-bug in front of the room. Restart, reload, confirm the form is back
- [ ] ⚠️ **Say the silent-failure version out loud, because it's the one they'll hit in the lab:** *"if you write only the GET action and no POST at all, clicking Submit gives you back a blank form. No error, nothing in the log — the POST just landed on the GET action. If your form 'does nothing', that's it."*
- [ ] **✓ CHECKPOINT:** the room can say what model binding matches on

## 2 · The same form, with tag helpers *(slides 8–11)*

- [ ] Frame it by counting what's wrong with the plain form: labels that will drift from the model, no `id` to click, nothing that knows `Rating` is meant to be a number, **and nowhere for an error to go**

### `asp-for`, one field at a time *(slide 8)*

- [ ] 🎞️ **GO TO SLIDE 8** — *`asp-for` — one attribute, four jobs*. The before-and-after markup is on it; you're about to prove it in View Source
- [ ] Replace **just the Name field** in `Create.cshtml` and add `@model Truck` at the top:
  ```html
  <label asp-for="Name" class="form-label"></label>
  <input asp-for="Name" class="form-control" />
  ```
- [ ] Refresh, **View Source**, find it:
  ```html
  <label class="form-label" for="Name">Name</label>
  <input class="form-control" type="text" data-val="true"
         data-val-required="The Name field is required." id="Name" name="Name" value="" />
  ```
- [ ] Count the four jobs on your fingers: **the `name`** (the binding contract, now generated — it can't drift) · **the `id` and matching `for`** · **the label text, read off the model** · **`type="text"`, from the C# type**
- [ ] **The two `data-val` attributes are not one of the four — park them out loud, because they're on screen and somebody will ask.** There is no annotation anywhere on the model yet, and that message was written by a compiler. 🔗 *"Nobody is reading those yet. Part 3 is where they start saying what I want them to say"*
- [ ] *"And the type isn't always text — watch the Open Late field in a minute"*
- [ ] Say it: **`asp-for="Name"` is a property name, not a string to print.** No `@`, no `Model.`. A typo is a *build* error

### The whole form *(slides 9–10)*

- [ ] 🎞️ **GO TO SLIDE 9** — *Three sockets per field*. Point at the empty `<span>`: *"remember that one — Part 3 fills it in"*
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
  - `IsOpenLate` is a **checkbox** — the `bool` chose that — with `value="true"`. ⚠️ **The companion `<input name="IsOpenLate" type="hidden" value="false" />` is not beside it — Razor parks it at the *bottom of the form*, just inside `</form>`. Scroll down for it** (it's the last thing in the form; you'll be back here in a minute for the token, which sits right before it). *"An unchecked box sends nothing at all, so without that hidden field a 'no' and a missing field would look identical. Razor sends false, and ticking the box overrides it"*
  - `Rating` is still `type="text"` *(the number box is for whole numbers)*, but it picked up **`data-val-number="The field Rating must be a number."`** — 🔗 *"that's the banana rule from twenty minutes ago, now written into the HTML. Nobody's reading it yet"*
  - the `<span>`s and the summary `<div>` rendered **empty**. *"Those are sockets. Part 3 plugs the errors in"*
- [ ] 🎞️ **GO TO SLIDE 10** — *A checkbox casts a shadow* — straight after you've found the hidden field in View Source, while it's still fresh
- [ ] **Clear the terminal**, then resubmit — **with the box ticked**. The page just says *"look at the terminal 👀"* as always, so **read the terminal**, and the last line is the new one:
  ```
     Open late True
  ```
- [ ] *"Nothing about the controller changed. I replaced the whole form and the same `Truck` still turns up — because `asp-for` wrote the same `name` attributes I typed by hand, and one I couldn't have: a `bool` from a checkbox"*
- [ ] Submit once more with the box **unticked** → `Open late False`, and 🔗 *"that `False` is the hidden field arriving. An unchecked box on its own sends nothing"*

### The hidden field you didn't write *(slide 11)*

- [ ] 🎞️ **GO TO SLIDE 11** — *The field you didn't write*
- [ ] In View Source, scroll to just inside `</form>` — back where you found the checkbox's shadow. **Two hidden fields sit there, the token first:**
  ```html
  <input name="__RequestVerificationToken" type="hidden" value="CfDJ8L5JyJv3Gm..." /><input name="IsOpenLate" type="hidden" value="false" />
  ```
- [ ] ⚠️ **Do not say the tag helper added it** — Razor adds it to **every** `<form method="post">`, including the hand-written one from §1. Worth saying explicitly, because it's the obvious wrong conclusion
- [ ] The one-paragraph why: *"without it, any other site could put a hidden form on their page pointing at your URL, and a logged-in visitor's browser would send it along with their cookies. The token is a value my server planted here and in a cookie; someone else's form can't produce a matching pair"*
- [ ] **Don't add the attribute yet.** First show that the door is open — **the same request, before and after** [§2 the curl, before and after ↓](#2-the-curl-before-and-after)
- [ ] **✓ CHECKPOINT:** everyone can say what `asp-for` writes into the HTML

### §2 the curl, before and after

You can't stage this attack in the browser — the browser is *on your site*, so Razor keeps putting a valid token in the page. `curl` is the other site: a request from nowhere, no page, no token. Same command twice, one line of C# in between. Budget two minutes.

- [ ] **Split the terminal — don't kill `dotnet watch`.** ⌃⇧5 in VS Code, or the split icon on the terminal pane. You want the watch output still visible in the other pane; **that pane is the evidence**, both times
- [ ] ⚠️ **The port below is whatever the Port box at the top says** — set it in §0 and the `curl` is already correct. If you're reading this as raw Markdown on GitHub there's no box, so check the command against the watch output before you paste it

**Before — the attribute is not there yet:**

- [ ] **Predict first, show of hands:** *"nothing on my site sent this. No form, no browser, no token. Does it work?"*
- [ ] In the new pane — **paste**:
  ```bash
  curl -i -X POST http://localhost:5164/Trucks/Create \
    -d "Name=Totally Legit&Cuisine=Fake&City=Nowhere&Rating=5"
  ```
  ```
  HTTP/1.1 200 OK
  Content-Length: 39

  Submitted — look at the terminal 👀
  ```
- [ ] 🎯 **Point at the other pane** — a whole truck, built from a request that never loaded your page:
  ```
  ── model binding built a Truck ──
     Name      Totally Legit
     Cuisine   Fake
     City      Nowhere
     Rating    5   (x2 = 10)
     Open late False
  ```
- [ ] *"That's the paragraph I just read you, actually happening. Anyone who can guess this URL can post to it."*

**After — one line of C#:**

- [ ] Add the attribute to the POST action — **type it**:
  ```csharp
  [HttpPost]
  [ValidateAntiForgeryToken]
  public IActionResult Create(Truck truck)
  ```
- [ ] ⚠️ **`Ctrl+R` in the watch pane to restart — don't trust hot reload for this one.** MVC builds each action's filter list at startup, and a metadata-only edit rebuilds it only *sometimes*: in testing this went live on two runs out of three and was silently inert on the third, with `Hot reload succeeded` printed every time. **On the bad roll your "after" is identical to your "before" in front of the room, with nothing on screen to explain why.** The restart costs nothing here — the action still returns `Content()`, so there are no trucks in the list to wipe yet
- [ ] **Re-run the exact same `curl`** — ⬆ in that pane:
  ```
  HTTP/1.1 400 Bad Request
  Content-Length: 0
  ```
- [ ] 🎯 **Point at the other pane again — and this time at the *absence*.** *"No `built a Truck`. Not a bad truck, not an empty truck. My method never ran at all. It was refused before it got there."*
- [ ] **`Content-Length: 0`** — say it: *"a 400 with an empty body, and nothing in the log either. In a browser that's a blank white page. If you ever submit a form and get a blank page, this is a candidate"*
- [ ] Now **submit the real form in the browser** — it still works. *"Same server, same action. The difference is that this request came from a page that had the token in it."*

> [!TIP]
> Short on time? Cut this whole section — it's a recognition item, not a mental model, and §3 needs the minutes more. Type the attribute anyway (it's on slide 11), say the 400 out loud, and move on: nothing later in the demo depends on the filter actually being live, because every submission from here on comes from a real page with a real token.

## 3 · Rules that live on the model *(slides 12–18)* — **the load-bearing segment**

> [!IMPORTANT]
> If §1 or §2 ran long, take the time out of §4's second half, **not out of this**. The `ModelState.IsValid` break and the refresh-double-post break are the two moments that can't be recovered by reading the notes later.

### Where do the rules go? *(slide 12)*

- [ ] **Clear the terminal** (⌘K, or right-click → Clear), then submit the form with **no name, no city, and a rating of 9000**:
  ```
  ── model binding built a Truck ──
     Name
     Cuisine   German
     City
     Rating    9000   (x2 = 18000)
  ```
- [ ] *"A nameless truck, in no city, rated nine thousand out of five."* **Nothing in the app has an opinion about any of it** *(the action still just prints — nothing is stored yet, and nothing is judged)*
- [ ] 🎞️ **GO TO SLIDE 12** — *Where do the rules live?* · ask it as a real question: *"somebody has to say what a valid truck is. Where does that live?"* Work through the two wrong answers on the slide out loud — **the view** (rules pasted into markup can't be reused, and a `Truck` gets made in more than one place) and **the controller** (every action grows the same block of ifs) — and land on **the model**

### Data annotations *(slides 13–14)*

- [ ] 🎞️ **GO TO SLIDE 13** — *Data annotations*. Read the attributes off the slide, then swipe back and type them
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
- [ ] 🎞️ **GO TO SLIDE 14** — *...and they end up in the HTML* · then **View Source on the Name input** and put it next to the one from §2: `maxlength="50"` and `data-val-length` are new, and `data-val-required` has stopped saying *"The Name field is required."* and started saying **mine**. *"My rules are in the HTML now, in my words. Park that — it pays off in twenty minutes"*
- [ ] Mention `{1}` and `{2}` in the Range message: the bounds fill themselves in, so the message can't drift from the rule
- [ ] ⚠️ **Say the implicit-required thing before it bites them:** *"`Rating` has no `[Required]`, but leave it blank and it'll complain anyway — a `double` has nowhere to put 'empty'. If you want a genuinely optional number, the property has to be `double?`"*

### ModelState *(slide 15)*

- [ ] 🎞️ **GO TO SLIDE 15** — *The guard*. The whole action is on it; talk it through before you type it
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
- [ ] You're on `/Trucks` now — **click `＋ Add a truck`** and submit a **bad** one: blank name, rating 9000. The form comes back, **their input still in it**, red messages beside two fields
- [ ] Point at where the messages landed: *"the empty spans from twenty minutes ago"*. And at the input itself — it picked up `input-validation-error` and Bootswatch outlined it red, and you wrote no CSS

### Break it #3 — delete the guard *(slides 16–17)*

- [ ] 🎞️ **GO TO SLIDE 16** — *Delete the guard* · the question slide again — **predict first, then go to the editor:** *"if I comment out the IsValid check, what stops the bad truck?"*
- [ ] Comment out the whole `if (!ModelState.IsValid)` block. Submit the blank-name, 9000-rated truck again
- [ ] **It's on `/Trucks`.** A nameless card rated nine thousand
- [ ] 🎞️ **GO TO SLIDE 17** — *Attributes describe. The guard decides.* · 🎯 leave the nameless truck on screen for a beat, then swipe to the deck and **say the setup; let the slide land the punchline:** *"The annotations did their job. They recorded the problem, and nobody read the record."*
- [ ] **RESTORE the block** ⚠️

### Break it #4 — the redirect *(slide 18)*

- [ ] 🎞️ **GO TO SLIDE 18** — *Redirect, don't render*. 🔗 **This is where slide 3's orange `no` gets collected** — say so
- [ ] *"Last line of the happy path is a redirect, and it looks like a pointless extra step. Watch."*
- [ ] Change the last line to:
  ```csharp
  return View("Index", TruckData.All);
  ```
- [ ] **Click `＋ Add a truck`** (the C# edit just restarted the app, so you're back to six trucks) and submit a good one — **it works**, the list appears. Now **point at the address bar**: it still says `/Trucks/Create`
- [ ] **Hit refresh.** Browser: *"Confirm Form Resubmission?"* → say yes → **two identical trucks in the list**
- [ ] **RESTORE `return RedirectToAction(nameof(Index));`** ⚠️ The page still shows the *list* at `/Trucks/Create`, so **click `＋ Add a truck`** to get a real form back. Submit another truck, then **refresh: nothing happens**, because the page you're on arrived by GET
- [ ] Name it: **POST-Redirect-GET**. *"It's why every form you have ever used bounces you to a different URL after you submit"*
- [ ] Show it in the **Network** panel: the POST comes back **302** with a `Location` header, then a separate GET. Two requests
- [ ] `nameof(Index)` over `"Index"` — renaming the action becomes a compile error instead of a 404
- [ ] **✓ CHECKPOINT:** the room can say what `ModelState.IsValid` is reading, and why a redirect follows a successful POST

## 4 · The same rules, in the browser *(slides 19–21)*

- [ ] Frame the cost: submit an empty form and count it out loud — *"click, wait, page reloads, red text. It works and it feels slow"*

### The partial week 5 promised *(slides 19–20)*

- [ ] 🎞️ **GO TO SLIDE 19** — *The partial from last week*. Both blocks are on it; then swipe back and open the real file
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
- [ ] 🎞️ **GO TO SLIDE 20** — *One source of truth* · 🎯 leave the two-arrow diagram up and say: *"Nothing in my C# changed. Those two scripts scan the page for the `data-val` attributes we watched appear twenty minutes ago, and enforce whatever they find. **One source of truth — `Models/Truck.cs` — enforced in two places**."*
- [ ] Say why the section matters: dropped in the middle of the view it loads **before** jQuery and dies with `$ is not defined`. Week 5's section wasn't a formality

### Why both *(slide 21)*

> [!IMPORTANT]
> **This is the security beat of the night, and it's the one place tonight where the payoff is a sentence rather than a screen.** Nothing to type, nothing to break — you're collecting evidence the room has already seen. Slow down and say it properly.

- [ ] 🎞️ **GO TO SLIDE 21** — *Why both* · **ask it before you answer it:** *"the server already throws out a bad truck. So why did I just spend twenty minutes putting a second copy of the same rules in the browser?"*
- [ ] The easy half: **the browser copy is for speed.** No round trip, no wait, red text the instant you leave the box. *"That's a courtesy to honest people, and it's most of what your users will ever notice."*
- [ ] The half that matters: **it enforces nothing.** 🔗 **Collect §2's `curl` — this is what it was for.** *"You already watched a request reach that action with no browser, no page and no JavaScript anywhere near it. Whatever the browser was checking, that request never went past it."*
- [ ] 🎯 **Say this slowly:** *"Anything in the browser is a suggestion. It's someone else's computer — they can edit it, turn JavaScript off, or skip your page entirely and post to that URL from a terminal, which is exactly what I did in front of you. The browser copy is for **speed**. The server copy is the one that's actually enforcing anything."*
- [ ] **Land it as one sentence: client-side for convenience, server-side for security — you need both, and they don't substitute for each other**
- [ ] *"And that's why we did them in that order tonight. Do it the other way round and you learn to trust the wrong one"*
- [ ] 💡 **If someone asks "can't you just switch the browser's validation off and show us?"** — answer it, don't demo it. Three reasons it isn't worth the minutes: `novalidate` does nothing (jQuery Validate already put it on the form itself, and it only governs the browser's *built-in* validation, which `asp-for` never uses — it emits `data-val-*`, not `required`); deleting `data-val="true"` does nothing either, because unobtrusive read the rules once at page load; and the only real switch, disabling JavaScript, proves it by way of a page round trip that is **invisible on a fast connection** — the form comes back looking almost exactly like the client-side version. The `curl` showed the same thing an hour ago and showed it better
- [ ] **✓ CHECKPOINT:** nobody in the room thinks client-side validation is a security feature

## 5 · Where the truck actually went *(slide 22)*

- [ ] Show `/Trucks` with your added trucks on it. Seven, eight cards **(stay in the browser — the slide is the answer, and it would give this away)**
- [ ] In the terminal: **`Ctrl+C`**, then `dotnet watch` again. Reload `/Trucks`
- [ ] **Six.** *"Gone."*
- [ ] 🎞️ **GO TO SLIDE 22** — *Where did the truck go?* Now — straight off the six cards they just watched vanish
- [ ] Open `Models/TruckData.cs` and point at `static List<Truck>`. *"A variable in a running program. It lives exactly as long as the process does. Everything tonight was real — the form, the binding, the validation, the redirect. The **storage** is a placeholder, and it always has been. You just couldn't tell, because until tonight nothing ever changed"*
- [ ] ⚠️ **Warn them before the homework:** on Azure this is worse — a free-tier app **sleeps**, and wakes up with the hard-coded items only. If their test entries are missing when they check tomorrow, nothing is broken
- [ ] 🔗 **Week 7, pointing at the controller while you say it:** *"next week `TruckData.cs` is deleted and that list becomes a SQL Server table. And look at what changes in here — `ModelState.IsValid`, the guard, the redirect, all of it stays. One line changes: where the list comes from"*

## 6 · Hand off to the lab *(slide 23)*

- [ ] 🎞️ **GO TO SLIDE 23** — *Lab: the Registry takes reports*. Leave it up for the whole lab; it's the task list
- [ ] Show **what done looks like** — the answer key **running on localhost**, form working, and `dotnet test Cryptids.Checks` printing **6 / 6**. That's `week-06/lab/solution` in the answer-keys repo; `dotnet run` from `Cryptids.Web`, `dotnet test` from the folder above it. ~90 seconds, a target not a walkthrough. **Nothing is deployed for this** — Azure is their homework, not tonight
- [ ] Setup on screen, said once: **`git -C dotnet-web-starters pull` → copy `week-06` out and rename it → open the folder holding *both* projects → `dotnet test Cryptids.Checks`**
- [ ] Say plainly: **the app arrives with last week's shell on it.** Nobody is blocked tonight by an unfinished week 5. Check 1 proves it
- [ ] **In-class target: checks 1–5.** Check 6 is a three-line paste and rolls into the homework
- [ ] Name the one exact string check 2 wants: **`[Display(Name = "First sighted")]`**
- [ ] ⚠️ **Warn them the checks post to their form.** Check 4 files a report called **The Beast of Bray Road**, and it stays in their registry until the app restarts. That's supposed to happen — without it the check can't know the form works
- [ ] ⚠️ **Say that their form is longer than mine.** Curbside has four fields; the Cryptid has five, and the year has a `[Range]` on it. The markup is all in the lab README as a paste — *"the task is the controller, not the typing"*

## 7 · Wrap-up, after the lab *(slide 24)*

- [ ] 🎞️ **GO TO SLIDE 24** — *Tonight, in one picture*. The round-trip diagram; walk it once, top to bottom
- [ ] Homework: **their own app gets a Create form** — same moves, their model
- [ ] 🔗 Week 7: *"the list stops being a variable"* — and almost none of tonight's controller changes
