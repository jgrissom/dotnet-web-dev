# Week 14 Demo Script — Curbside Calls Its Own API 🌮

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Paste from here; nothing tonight needs typing except a few values in a form.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-14/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it is due. Everything that is not a 🎞️ line happens in the other state, so **you do not need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

> [!IMPORTANT]
> **Tonight the lab comes in seven short blocks, one after each part of the demo that it practices**, and the sixth is team git. Each block has its own `## Lab` section below — what to say, what to watch for, and the README note it stops at. There is no lab slide.

> [!IMPORTANT]
> **One failure tonight is staged by the order of the pastes, and nothing needs undoing.** In §3 the first draft of the form's script calls `.json()` on a `401`, which has no body, and the console says `Unexpected end of JSON input`. The next paste is the fix. §5's crash is a command, not an edit: the same app run as Production can't find its connection string.

> [!IMPORTANT]
> **Once a file exists, every paste into it replaces the whole file:** click in it, **Cmd+A**, paste. Nothing to find. Each step names what's **New**, so you know where to point while you say it.

> [!IMPORTANT]
> **Every save reloads the page by itself.** `dotnet watch` refreshes every open tab of the app when a `.js` file or a view changes (measured). So a beat that needs a page **as it was**, like §3's signed-out form and §4's second tab, always comes **after** the last paste in its section.

## 0 · Before class

- [ ] ⚠️ **Re-rehearsing this week? Delete three things first:** the folders `instructor/week-14/Curbside` and `instructor/week-14/curbside-sam` in Finder, and the GitHub repository `curbside-week14` (**Settings → Delete this repository**). A rehearsal leaves all three in tonight's **end** state, and every beat below starts from week 13's. The next steps recreate them
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course/instructor/week-14`, create a new empty **folder** named `Curbside` and open it *(the dialog's **New Folder** button makes `week-14` too, the first time)*. **The folder stays empty — there is no `dotnet new` tonight;** the next step fills it with the starter
- [ ] Integrated terminal (**Ctrl+&#96;**) — fill the empty folder with tonight's starter. This is Curbside as week 13's demo left it: an API under `/api/trucks` with the Admin role on its writes, and the tester page:
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-14/demo-starter/Curbside/. .
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
- [ ] ⚠️ **Rebuild the database, once:**
  ```bash
  dotnet ef database drop --force
  dotnet ef database update
  ```
  Seven migrations replay. **No new migration tonight**, and no C#: tonight is JavaScript and two views
- [ ] **Rehearse the whole script once in a separate copy.** It is the only way to see §3's console error and §5's crash for yourself before the room does. Stop the rehearsal's `dotnet watch` when you're done — both copies use the same port
- [ ] 🚨 **After the rehearsal, two things.** Delete the GitHub repository `curbside-week14` (**Settings → Delete this repository**) and the `curbside-sam` folder, because §5 makes the repository again in front of the room. And check `/Trucks` shows **seven** trucks: §3's spoken line counts them, and a rehearsal that follows the sheet adds one and removes it again. If it shows eight, remove Lake Effect Lunch on its **Delete** page
- [ ] Run it, same terminal:
  ```bash
  dotnet watch
  ```
- [ ] **Register Ada.** Browse to `/Account/Register`: **Email** `ada@example.com`, **What should we call you?** `Ada`, `Curbside-2026` in **Password** and again in **Confirm password**. Click **Sign out**
- [ ] **Press Ctrl+R in the terminal.** The seeder hands out the role at startup, so Ada holds Admin only after a restart that comes after she registers
- [ ] **A second terminal** — the `+` in the terminal panel, left idle. It's for §5's one `dotnet run`, and for `git` in §5 and §6
- [ ] **Be signed in to github.com in the browser.** §5 makes a repository there, live
- [ ] ⚠️ **Know that there are no restarts tonight.** Measured on a pty-driven `dotnet watch`, one save per paste: a new `.js` file, edits to it and edits to a view all go live, and **every open tab of the app reloads itself on each save**. The first request for the new `trucks.js` prints a yellow `The static asset '/js/trucks.js' was not found in the built time manifest` in the terminal; it's harmless and stops at the next restart
- [ ] **Park three browser tabs**: `/` (Curbside's front page, **signed out**), `/Trucks`, and `/api-tester.html`
- [ ] **Say the no-typing line out loud in the first minute.** Tonight is watched, not typed along with: *"Nothing I type tonight is yours to type. Curbside is my app, and the Registry is yours. Your keyboard time is the lab blocks. There are seven of them tonight."*
- [ ] Teaching profile on, notifications off, editor font sized for the back of the room and for a small laptop screen

> [!NOTE]
> **🖥️ On screen, at curtain**
>
> - **VS Code** — left half, `instructor/week-14/Curbside` open, two integrated terminals: the first running `dotnet watch`, the second idle
> - **Browser** — right half, three tabs: `/` (Curbside's front page, **signed out**), `/Trucks`, and `/api-tester.html`

## 1 · One fetch *(slides 1–2)*

- [ ] 🎞️ **GO TO SLIDE 1** — *Week 14 — Your pages call your API* · it is still up from the gallery — talk to its list before you swipe away from it: *"Last week my app learned to answer programs. Tonight its own pages are the program. First, a food truck's menu that opens under its card without leaving the list or refreshing the page. Then a form that adds a truck, and a button that removes one, both without a reload. After that, what changes when an app runs for real: configuration and secrets. And last, two people changing the same line of code in a shared GitHub repository."*

### The one fetch you already have

- [ ] **Swipe to the editor.** Say the goal: *"There is already one page in this app that talks to the API: the tester. Let's look at how."* Open `wwwroot/api-tester.html`.
- [ ] Point at three lines, in order: **line 61** `const response = await fetch(path, options);` → **line 69** `` statusLine.textContent = `${response.status} ${response.statusText}`; `` → **line 75** `const text = await response.text();` — skip the redirect block between 61 and 69. *"It sends the request and waits. It reads the status. Only after that does it read the body. Every script tonight has that same order."*

### The shape *(slide 2)*

- [ ] 🎞️ **GO TO SLIDE 2** — *One fetch, three steps* · *"Here is the tester's order, written for one truck: send, read the status, then read the body. fetch sends the request. await makes this function wait for the answer, and the rest of the page keeps working while it waits. That is why the function is marked async: only an async function can wait. It is the same idea as the async actions you have written since week 8, now in JavaScript."*
- [ ] 🎯 Still on slide 2, the last line: *"The status comes first. It decides whether there is a body to read at all."*

## Lab A · Setup and task 1 — 5 minutes

- [ ] *"Tonight the lab comes in seven short blocks. After most parts of my demo, you do the same thing to your Registry. Every block but the last ends at a note that says In class, stop here."*
- [ ] *"The first block is setup and task 1. There is no database drop tonight. This starter has the same migrations as last week's, so your database, your account and your curator role all carry over."*
- [ ] *"Sign in with your own email, and check you can see Open a new file on the list. Tonight's target is all four checks, and two pull requests merged."*
- [ ] 👀 **Watch for:** `there is already an object named 'Cryptids'` — they never ran week 12's lab; the warning in Task 1 has the order. `The ConnectionString property has not been initialized` before `Now listening on:` — the secret is gone (a frozen lab PC); task 1 has the commands. `Could not find a MSBuild project file` — terminal 1 or 2 never ran `cd Cryptids.Web`
- [ ] **Stop:** the note after **Task 1 in full**. Where they should be: setup's `dotnet test` printed **`Passed: 1`**, the app is running in terminal 1, and they are signed in as their curator, with **＋ Open a new file** on `/Cryptids`

## 2 · A truck's menu, without leaving the list *(slide 3)*

### The page

- [ ] **Swipe to the editor.** Say the goal: *"I want an option to Show the menu under every truck's card. Clicking it will show that truck's specials under the card, and the list stays where it is. First the page needs three things the script can find."* Open `Views/Trucks/Index.cshtml` and **replace the whole file**: click in it, **Cmd+A**, paste. **New:** the grid at the bottom.
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

  <div id="trucks" class="row row-cols-1 row-cols-md-3 g-4">
      @foreach (var truck in Model)
      {
          <div class="col d-flex flex-column" data-id="@truck.Id">
              <div class="flex-grow-1">
                  <partial name="_TruckCard" model="truck" />
              </div>
              <div>
                  <button type="button" class="btn btn-link px-0 show-menu">Show the menu</button>
              </div>
              <ul class="menu list-group list-group-flush small"></ul>
          </div>
      }
  </div>
  ```
- [ ] **Say what it is, with it on screen:** *"The grid has an id, so the script can find it. Each card's column carries the truck's id in a data attribute, so the script knows which truck was clicked. Under each card there is a button, and an empty list for the specials. It looks like a link, but it's a button: it changes this page instead of going to another one."*
- [ ] The page reloads itself: a **Show the menu** under every card, doing nothing yet. *"Show the menu is there, and nothing answers it yet. That is the script's job."*

### The script

- [ ] Say the goal: *"Now the JavaScript, in a file of its own in wwwroot, where the browser can fetch it."* Create `wwwroot/js/trucks.js` and paste:
  ```js
  // Week 14: the trucks page asks the API for data, and changes part of itself
  // without a reload. Views/Trucks/Index.cshtml loads this file.

  const trucks = document.querySelector("#trucks");

  // GET /api/trucks/2, then list that truck's specials under its card.
  const showMenu = async (card) => {
      const menu = card.querySelector(".menu");
      menu.textContent = "Loading…";

      const response = await fetch(`/api/trucks/${card.dataset.id}`);
      if (response.status !== 200) {
          menu.textContent = "That truck isn't on the street any more.";
          return;
      }

      const truck = await response.json();
      menu.textContent =
          truck.specials.length === 0 ? "Nothing on the menu yet." : "";
      for (const special of truck.specials) {
          const item = document.createElement("li");
          item.className = "list-group-item";
          item.textContent = `${special.dish} · ${special.servedOn} · $${special.price.toFixed(2)}`;
          menu.append(item);
      }
  };

  // One listener for every card, including cards added later. closest() finds
  // the card the click landed in.
  trucks.addEventListener("click", (event) => {
      const card = event.target.closest("[data-id]");
      if (event.target.matches(".show-menu")) {
          showMenu(card);
      }
  });
  ```
- [ ] **Say what it is:** *"showMenu is slide 2's three steps. It asks the API for one truck, reads the status, and only then reads the JSON. Then it adds one list item per special, with textContent. At the bottom, one click listener on the whole grid. closest finds the card the click was in, and if the click was on the button, it shows that truck's menu."*
- [ ] Say the goal: *"Last, the page has to load trucks.js."* In `Views/Trucks/Index.cshtml`, **replace the whole file**: click in it, **Cmd+A**, paste. **New:** `@section Scripts` at the very bottom.
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

  <div id="trucks" class="row row-cols-1 row-cols-md-3 g-4">
      @foreach (var truck in Model)
      {
          <div class="col d-flex flex-column" data-id="@truck.Id">
              <div class="flex-grow-1">
                  <partial name="_TruckCard" model="truck" />
              </div>
              <div>
                  <button type="button" class="btn btn-link px-0 show-menu">Show the menu</button>
              </div>
              <ul class="menu list-group list-group-flush small"></ul>
          </div>
      }
  </div>

  @section Scripts {
      <script src="~/js/trucks.js"></script>
  }
  ```
- [ ] **Say what it is:** *"The Scripts section from week 5. The layout puts it at the end of the page, so the cards already exist when the script runs."*
- [ ] Terminal: `File added: ./wwwroot/js/trucks.js` and `Hot reload of static assets succeeded`, and the page reloads itself. *"A new file in wwwroot goes live without a restart."*

### Try it

- [ ] **Browser, `/Trucks`.** Click **Show the menu** under **Cheese Curd Cartel**. 🎯 **Three specials appear under its card**: `Cheese Curds · Friday · $7.00`, `Loaded Fries · Saturday · $8.50`, `Slider Trio · Sunday · $9.00`. *"Look at the address bar. It never changed. The page asked for one truck, and drew part of itself."*
- [ ] **F12 → Network**, then click **Show the menu** under **Roll Models**. Click the request named `1`: status `200`, and the **Response** tab. *"That is the request my script sent. It is the same JSON as typing api/trucks/1 in the address bar, but the page stayed where it was."*
- [ ] 🎞️ **GO TO SLIDE 3** — *Part of a page, from JSON* · *"Here is what happened in that click. The listener caught it, closest found the card, and the data attribute gave the id. fetch asked the API, the status came back 200, and json turned the body into an object. Then createElement and append added the list items."*
- [ ] Still on slide 3, the last line: *"Everything that came from the API goes onto the page with textContent, never innerHTML. With textContent, a truck named with HTML tags in it shows those tags as text. With innerHTML, the browser treats them as part of the page."*

## Lab B · Task 2 — 12 minutes

- [ ] *"Task 2 is the same move on your archive. A Quick look button under every creature's card, and its reports listed under the card. Three pastes: the grid, a new archive.js, and the line that loads it."*
- [ ] *"When it works, open F12, Network, and click a Quick look. Find the request your script sent."*
- [ ] 👀 **Watch for:** **nothing happens on a click** — F12 → Console first; no error usually means the page never loads the script (the `@section Scripts` line is missing, or `archive.js` isn't in `wwwroot/js`). `Cannot read properties of null (reading 'addEventListener')` — `#archive` in the script doesn't match `id="archive"` on the page. A `.js` request that's `404` — the file is in `wwwroot`, not `wwwroot/js`, or misnamed
- [ ] **Stop:** the note after **Task 2 in full**. Where they should be: **`Passed: 2`**, and The Hodag's three reports under its card on `/Cryptids`

## 3 · A form that sends JSON *(slide 4)*

### The form

- [ ] **Sign in** as `ada@example.com` with `Curbside-2026` on the `/` tab. Say the goal: *"Right now Ada adds a truck on the Create page, which takes her away from the list. I want a small form right on the list. It sends the truck to the API, and the new card appears with the others, without a reload."*
- [ ] **Swipe to the editor.** In `Views/Trucks/Index.cshtml`, **replace the whole file**: click in it, **Cmd+A**, paste. **New:** the form and its error list, below the `＋ Add a truck` link.
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

      <form id="quick-add" class="row g-2 mb-2">
          <div class="col-md-3"><input name="name" class="form-control" placeholder="Name" /></div>
          <div class="col-md-2"><input name="cuisine" class="form-control" placeholder="Cuisine" /></div>
          <div class="col-md-2"><input name="city" class="form-control" placeholder="City" /></div>
          <div class="col-md-2"><input name="rating" type="number" step="0.1" class="form-control" placeholder="Rating" /></div>
          <div class="col-md-3"><button class="btn btn-outline-primary w-100">Add without a reload</button></div>
      </form>
      <ul id="quick-add-errors" class="text-danger small mb-4"></ul>
  }

  @if (!Model.Any())
  {
      <p class="text-muted">No trucks on the street yet.</p>
  }

  <div id="trucks" class="row row-cols-1 row-cols-md-3 g-4">
      @foreach (var truck in Model)
      {
          <div class="col d-flex flex-column" data-id="@truck.Id">
              <div class="flex-grow-1">
                  <partial name="_TruckCard" model="truck" />
              </div>
              <div>
                  <button type="button" class="btn btn-link px-0 show-menu">Show the menu</button>
              </div>
              <ul class="menu list-group list-group-flush small"></ul>
          </div>
      }
  </div>

  @section Scripts {
      <script src="~/js/trucks.js"></script>
  }
  ```
- [ ] **Say what it is:** *"Four boxes and a button, inside the same Admin check as the Add a truck link, so only Ada sees them. Each box's name is the API's name for that value. There is no method and no action on the form, because the script sends it. Under the form, an empty list for errors."*

### The script

- [ ] Say the goal: *"Now the script that sends it. When the API says 201, the new truck goes on the page. Otherwise, the page lists what was wrong."* In `wwwroot/js/trucks.js`, **replace the whole file**: click in it, **Cmd+A**, paste. **New:** everything below the listener, `cardFor` and then the form's handler.
  ```js
  // Week 14: the trucks page asks the API for data, and changes part of itself
  // without a reload. Views/Trucks/Index.cshtml loads this file.

  const trucks = document.querySelector("#trucks");

  // GET /api/trucks/2, then list that truck's specials under its card.
  const showMenu = async (card) => {
      const menu = card.querySelector(".menu");
      menu.textContent = "Loading…";

      const response = await fetch(`/api/trucks/${card.dataset.id}`);
      if (response.status !== 200) {
          menu.textContent = "That truck isn't on the street any more.";
          return;
      }

      const truck = await response.json();
      menu.textContent =
          truck.specials.length === 0 ? "Nothing on the menu yet." : "";
      for (const special of truck.specials) {
          const item = document.createElement("li");
          item.className = "list-group-item";
          item.textContent = `${special.dish} · ${special.servedOn} · $${special.price.toFixed(2)}`;
          menu.append(item);
      }
  };

  // One listener for every card, including cards added later. closest() finds
  // the card the click landed in.
  trucks.addEventListener("click", (event) => {
      const card = event.target.closest("[data-id]");
      if (event.target.matches(".show-menu")) {
          showMenu(card);
      }
  });

  // A card for a truck that arrived as JSON. Its text goes in with textContent,
  // never innerHTML, so whatever someone typed shows as text and never runs.
  const cardFor = (truck) => {
      const card = document.createElement("div");
      card.className = "col d-flex flex-column";
      card.dataset.id = truck.id;
      card.innerHTML = `
          <div class="flex-grow-1"><div class="card h-100"><div class="card-body">
              <h5 class="card-title"></h5>
              <h6 class="card-subtitle mb-2 text-muted"></h6>
          </div></div></div>
          <div>
              <button type="button" class="btn btn-link px-0 show-menu">Show the menu</button>
          </div>
          <ul class="menu list-group list-group-flush small"></ul>`;
      card.querySelector(".card-title").textContent = truck.name;
      card.querySelector(".card-subtitle").textContent = `${truck.cuisine} · ${truck.city}`;
      return card;
  };

  // POST /api/trucks, with the form's values as JSON. Only an admin's page has
  // the form, so on anyone else's page there is nothing to set up.
  const form = document.querySelector("#quick-add");
  if (form) {
      form.addEventListener("submit", async (event) => {
          event.preventDefault();
          const errors = document.querySelector("#quick-add-errors");
          errors.textContent = "";

          const values = new FormData(form);
          const response = await fetch("/api/trucks", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  name: values.get("name"),
                  cuisine: values.get("cuisine"),
                  city: values.get("city"),
                  rating: Number(values.get("rating")),
              }),
          });

          if (response.status === 201) {
              // Read the new truck back from the address in the Location header.
              const saved = await fetch(response.headers.get("Location"));
              trucks.append(cardFor(await saved.json()));
              form.reset();
              return;
          }

          // Otherwise, list what the rules said.
          const problem = await response.json();
          for (const messages of Object.values(problem.errors)) {
              for (const message of messages) {
                  const item = document.createElement("li");
                  item.textContent = message;
                  errors.append(item);
              }
          }
      });
  }
  ```
- [ ] **Say what it is:** *"cardFor builds a card for a truck that arrived as JSON, with the same markup the page uses. Below it, the form's submit handler. preventDefault stops the browser sending the form itself. FormData reads the boxes, and fetch sends them as JSON, the same POST as the tester's. On a 201, the script reads the new truck back from the Location header and adds its card. Anything else, it lists the errors."*
- [ ] *"One detail in there: Number. Every box gives back text, and an empty box gives back an empty string. The API cannot turn an empty string into a rating, so Number turns it into a number first."*

### Try it

- [ ] **Browser, `/Trucks`** — it reloaded itself, and the form is there. Type `Lake Effect Lunch`, `Soup`, `Sheboygan`, `4.3`, click **Add without a reload**. 🎯 **Lake Effect Lunch appears as the last card, and the boxes empty.** *"The API said 201, the script read the truck back, and drew its card."*
- [ ] Point at the line at the top: `7 trucks on the street.` *"That line still says seven. The server wrote it when the page loaded, and nothing has asked it again since. A page that changes part of itself has to change every part that depends on the change. Updating that number is a Done early item in the lab."*
- [ ] Say the goal: *"Now I want proof the truck is in the database, not just on my screen."* **Reload the page.** 🎯 `8 trucks on the street.`, and **Lake Effect Lunch** is still on the list. *"This time the server drew every card, from the database. The script's card was the real thing."*
- [ ] Type `X` in **Name** and `9` in **Rating**, leave the rest empty, click **Add without a reload**. 🎯 Four messages in red under the form, among them `Ratings run from 1 to 5.` *"A 400, and its errors object, listed on the page. These are TruckInput's rules from last week."*

### Signed out, with the page still open

- [ ] Say the goal: *"Now the case I haven't handled. Ada's sign-in runs out while this page is still open in her browser."* On the `/` tab, **Sign out**. Back to the `/Trucks` tab, **don't reload it**: the form is still there
- [ ] Type `Week Fourteen Wagon`, `Test`, `Waukesha`, `3`, click **Add without a reload**. Nothing appears
- [ ] **F12 → Console.** 🎯 Red: `Failed to load resource: the server responded with a status of 401 (Unauthorized)`, then `SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input`
- [ ] **Ask — the answer is last week's §6:** *"I'm signed out. What did the API answer, and what was in the body?"* Take the answer: *"A 401, with an empty body. My script saw something that wasn't a 201, and asked an empty answer for its JSON."*
- [ ] 🎞️ **GO TO SLIDE 4** — *Which answers have a body?* · *"Here is every answer tonight, and whether it carries a body. A 200, a 201, a 400 and a 404 do. A 204, a 401 and a 403 do not. Call json on one of those, and it throws, which is the error you just saw."*
- [ ] 🎯 Still on slide 4, the last line: *"So the status decides. Read it first, and only call json when the status says there is a body."*

### The fix

- [ ] **Swipe to the editor.** Say the goal: *"Only a 400 has errors to list, so the code that lists them should only run for a 400."* In `wwwroot/js/trucks.js`, **replace the whole file**: click in it, **Cmd+A**, paste. **New:** near the bottom, the error list now sits inside `if (response.status === 400)`, with one sentence after it for anything else.
  ```js
  // Week 14: the trucks page asks the API for data, and changes part of itself
  // without a reload. Views/Trucks/Index.cshtml loads this file.

  const trucks = document.querySelector("#trucks");

  // GET /api/trucks/2, then list that truck's specials under its card.
  const showMenu = async (card) => {
      const menu = card.querySelector(".menu");
      menu.textContent = "Loading…";

      const response = await fetch(`/api/trucks/${card.dataset.id}`);
      if (response.status !== 200) {
          menu.textContent = "That truck isn't on the street any more.";
          return;
      }

      const truck = await response.json();
      menu.textContent =
          truck.specials.length === 0 ? "Nothing on the menu yet." : "";
      for (const special of truck.specials) {
          const item = document.createElement("li");
          item.className = "list-group-item";
          item.textContent = `${special.dish} · ${special.servedOn} · $${special.price.toFixed(2)}`;
          menu.append(item);
      }
  };

  // One listener for every card, including cards added later. closest() finds
  // the card the click landed in.
  trucks.addEventListener("click", (event) => {
      const card = event.target.closest("[data-id]");
      if (event.target.matches(".show-menu")) {
          showMenu(card);
      }
  });

  // A card for a truck that arrived as JSON. Its text goes in with textContent,
  // never innerHTML, so whatever someone typed shows as text and never runs.
  const cardFor = (truck) => {
      const card = document.createElement("div");
      card.className = "col d-flex flex-column";
      card.dataset.id = truck.id;
      card.innerHTML = `
          <div class="flex-grow-1"><div class="card h-100"><div class="card-body">
              <h5 class="card-title"></h5>
              <h6 class="card-subtitle mb-2 text-muted"></h6>
          </div></div></div>
          <div>
              <button type="button" class="btn btn-link px-0 show-menu">Show the menu</button>
          </div>
          <ul class="menu list-group list-group-flush small"></ul>`;
      card.querySelector(".card-title").textContent = truck.name;
      card.querySelector(".card-subtitle").textContent = `${truck.cuisine} · ${truck.city}`;
      return card;
  };

  // POST /api/trucks, with the form's values as JSON. Only an admin's page has
  // the form, so on anyone else's page there is nothing to set up.
  const form = document.querySelector("#quick-add");
  if (form) {
      form.addEventListener("submit", async (event) => {
          event.preventDefault();
          const errors = document.querySelector("#quick-add-errors");
          errors.textContent = "";

          const values = new FormData(form);
          const response = await fetch("/api/trucks", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  name: values.get("name"),
                  cuisine: values.get("cuisine"),
                  city: values.get("city"),
                  rating: Number(values.get("rating")),
              }),
          });

          if (response.status === 201) {
              // Read the new truck back from the address in the Location header.
              const saved = await fetch(response.headers.get("Location"));
              trucks.append(cardFor(await saved.json()));
              form.reset();
              return;
          }

          // Only a 400 has errors to list. A 401 or a 403 has no body at all, so
          // its status is the whole answer.
          if (response.status === 400) {
              const problem = await response.json();
              for (const messages of Object.values(problem.errors)) {
                  for (const message of messages) {
                      const item = document.createElement("li");
                      item.textContent = message;
                      errors.append(item);
                  }
              }
              return;
          }

          errors.textContent = "Only a signed-in admin can add a truck. Sign in again.";
      });
  }
  ```
- [ ] **Say what it is:** *"The errors are read only when the status is 400. Anything else gets one sentence, from the status alone."*
- [ ] The page reloaded itself, signed out, so the form is gone. To show the fix: on the `/` tab, **Sign in** as Ada, reload `/Trucks`, then on the `/` tab **Sign out** again. Back on `/Trucks`, type `Week Fourteen Wagon`, `Test`, `Waukesha`, `3`, **Add without a reload**. 🎯 `Only a signed-in admin can add a truck. Sign in again.` under the form. *"The same signed-out add, the same 401, and this time the page says so."*
- [ ] On the `/` tab, **Sign in** as Ada again, and reload `/Trucks`. §4 needs her

## Lab C · Task 3 — 15 minutes

- [ ] *"Task 3 is a report form on the creature's own page. Anybody can file a report, so the form is for everyone. When it works, the new report appears with the others, without a reload."*
- [ ] ⚠️ *"Your form's box names have to be the API's names: cryptidId, witness, location, seenOn and account. Check 3 fills in your form the way a person would and sends those names, and if the API says no, its message lists the names it sent."*
- [ ] *"Your script reads the status first, the same as mine now. A 400 lists its errors, and a 201 reads the creature back and redraws its accounts."*
- [ ] 👀 **Watch for:** **the page reloads and the address ends in `?witness=…`** — the script never ran, or `event.preventDefault()` is missing. A `400` naming a box they filled in — that box's `name` isn't the API's name. A `400` about `$.seenOn` — an empty date sent as `""`; the README's `|| null`. `415 Unsupported Media Type` — no `Content-Type` header
- [ ] **Stop:** the note after **Task 3 in full**. Where they should be: **`Passed: 3`**, and a report filed from Bigfoot's page without a reload

## ☕ Break

## 4 · Remove, without a reload

### The button and the script

- [ ] **Swipe to the editor.** Say the goal: *"Last, a Remove button under each card, for Ada only. It sends a DELETE, and once the truck is gone, the card goes."* In `Views/Trucks/Index.cshtml`, **replace the whole file**: click in it, **Cmd+A**, paste. **New:** the Remove button's `@if`, just below **Show the menu**.
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

      <form id="quick-add" class="row g-2 mb-2">
          <div class="col-md-3"><input name="name" class="form-control" placeholder="Name" /></div>
          <div class="col-md-2"><input name="cuisine" class="form-control" placeholder="Cuisine" /></div>
          <div class="col-md-2"><input name="city" class="form-control" placeholder="City" /></div>
          <div class="col-md-2"><input name="rating" type="number" step="0.1" class="form-control" placeholder="Rating" /></div>
          <div class="col-md-3"><button class="btn btn-outline-primary w-100">Add without a reload</button></div>
      </form>
      <ul id="quick-add-errors" class="text-danger small mb-4"></ul>
  }

  @if (!Model.Any())
  {
      <p class="text-muted">No trucks on the street yet.</p>
  }

  <div id="trucks" class="row row-cols-1 row-cols-md-3 g-4">
      @foreach (var truck in Model)
      {
          <div class="col d-flex flex-column" data-id="@truck.Id">
              <div class="flex-grow-1">
                  <partial name="_TruckCard" model="truck" />
              </div>
              <div>
                  <button type="button" class="btn btn-link px-0 show-menu">Show the menu</button>
                  @if (User.IsInRole("Admin"))
                  {
                      <button type="button" class="btn btn-link text-danger remove">Remove</button>
                  }
              </div>
              <ul class="menu list-group list-group-flush small"></ul>
          </div>
      }
  </div>

  @section Scripts {
      <script src="~/js/trucks.js"></script>
  }
  ```
- [ ] **Say what it is:** *"A Remove button on every card, inside the Admin check, so a visitor never sees it."*
- [ ] Say the goal: *"Now the script: a function that removes a truck, the listener answering the new button, and the button on the cards the form adds."* In `wwwroot/js/trucks.js`, **replace the whole file**: click in it, **Cmd+A**, paste. **New:** `removeTruck` at the very bottom, the Remove button in `cardFor`, and a second `if` in the listener.
  ```js
  // Week 14: the trucks page asks the API for data, and changes part of itself
  // without a reload. Views/Trucks/Index.cshtml loads this file.

  const trucks = document.querySelector("#trucks");

  // GET /api/trucks/2, then list that truck's specials under its card.
  const showMenu = async (card) => {
      const menu = card.querySelector(".menu");
      menu.textContent = "Loading…";

      const response = await fetch(`/api/trucks/${card.dataset.id}`);
      if (response.status !== 200) {
          menu.textContent = "That truck isn't on the street any more.";
          return;
      }

      const truck = await response.json();
      menu.textContent =
          truck.specials.length === 0 ? "Nothing on the menu yet." : "";
      for (const special of truck.specials) {
          const item = document.createElement("li");
          item.className = "list-group-item";
          item.textContent = `${special.dish} · ${special.servedOn} · $${special.price.toFixed(2)}`;
          menu.append(item);
      }
  };

  // One listener for every card, including cards added later. closest() finds
  // the card the click landed in.
  trucks.addEventListener("click", (event) => {
      const card = event.target.closest("[data-id]");
      if (event.target.matches(".show-menu")) {
          showMenu(card);
      }
      if (event.target.matches(".remove")) {
          removeTruck(card);
      }
  });

  // A card for a truck that arrived as JSON. Its text goes in with textContent,
  // never innerHTML, so whatever someone typed shows as text and never runs.
  const cardFor = (truck) => {
      const card = document.createElement("div");
      card.className = "col d-flex flex-column";
      card.dataset.id = truck.id;
      card.innerHTML = `
          <div class="flex-grow-1"><div class="card h-100"><div class="card-body">
              <h5 class="card-title"></h5>
              <h6 class="card-subtitle mb-2 text-muted"></h6>
          </div></div></div>
          <div>
              <button type="button" class="btn btn-link px-0 show-menu">Show the menu</button>
              <button type="button" class="btn btn-link text-danger remove">Remove</button>
          </div>
          <ul class="menu list-group list-group-flush small"></ul>`;
      card.querySelector(".card-title").textContent = truck.name;
      card.querySelector(".card-subtitle").textContent = `${truck.cuisine} · ${truck.city}`;
      return card;
  };

  // POST /api/trucks, with the form's values as JSON. Only an admin's page has
  // the form, so on anyone else's page there is nothing to set up.
  const form = document.querySelector("#quick-add");
  if (form) {
      form.addEventListener("submit", async (event) => {
          event.preventDefault();
          const errors = document.querySelector("#quick-add-errors");
          errors.textContent = "";

          const values = new FormData(form);
          const response = await fetch("/api/trucks", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  name: values.get("name"),
                  cuisine: values.get("cuisine"),
                  city: values.get("city"),
                  rating: Number(values.get("rating")),
              }),
          });

          if (response.status === 201) {
              // Read the new truck back from the address in the Location header.
              const saved = await fetch(response.headers.get("Location"));
              trucks.append(cardFor(await saved.json()));
              form.reset();
              return;
          }

          // Only a 400 has errors to list. A 401 or a 403 has no body at all, so
          // its status is the whole answer.
          if (response.status === 400) {
              const problem = await response.json();
              for (const messages of Object.values(problem.errors)) {
                  for (const message of messages) {
                      const item = document.createElement("li");
                      item.textContent = message;
                      errors.append(item);
                  }
              }
              return;
          }

          errors.textContent = "Only a signed-in admin can add a truck. Sign in again.";
      });
  }

  // DELETE /api/trucks/2. A 204 has no body, so read the truck back instead:
  // once its address answers 404, take the card off the page.
  const removeTruck = async (card) => {
      const name = card.querySelector(".card-title").textContent;
      if (!confirm(`Remove ${name}?`)) {
          return;
      }

      const response = await fetch(`/api/trucks/${card.dataset.id}`, { method: "DELETE" });
      if (response.status === 401 || response.status === 403) {
          alert("Only a signed-in admin can remove a truck. Sign in again.");
          return;
      }

      const check = await fetch(`/api/trucks/${card.dataset.id}`);
      if (check.status === 404) {
          card.remove();
      }
  };
  ```
- [ ] **Say what it is, at the bottom:** *"confirm asks first, the way the Delete page has since week 8. Then the DELETE. A 401 or a 403 gets a message from the status alone. A 204 has no body either, so instead of reading one, the script asks for the truck again. When that answers 404, the truck is gone, and so is the card."*
- [ ] **Scroll up to `cardFor`:** *"A card the form adds should have Remove under it too. Only an admin can add a card, so every card cardFor draws gets the button."*
- [ ] **Up again, to the listener:** *"The listener has to know about the new button. It's the same listener, with one more button it answers."*

### Try it

- [ ] Say the goal: *"I want a second copy of this page, open from before the truck goes. We'll come back to it."* Open `/Trucks` in a **new tab**, and leave it
- [ ] Back on the first `/Trucks` tab: **Remove** under **Lake Effect Lunch**. The browser asks `Remove Lake Effect Lunch?` — **OK**. 🎯 **The card goes.** Reload: it stays gone
- [ ] **F12 → Network**: a `DELETE` with `204`, then a GET of the same address with `404`. The console shows `Failed to load resource: the server responded with a status of 404 (Not Found)` in red. *"That red line is my read-back. The DELETE said 204, and the GET says the truck is gone."*
- [ ] **The second tab.** Lake Effect Lunch is still on it, because nothing has reloaded it. Click its **Show the menu**. 🎯 `That truck isn't on the street any more.` *"This is the status check in showMenu, from the first script tonight. The API answered 404, and the page said so instead of breaking."*
- [ ] On the `/` tab, **Sign out**. Back to the first `/Trucks` tab, don't reload: **Remove** under **Roll Models**, **OK**. 🎯 `Only a signed-in admin can remove a truck. Sign in again.`, and Roll Models stays. *"A 401 this time. No body, so the status alone decides the message."*

## Lab D · Task 4 — 10 minutes

- [ ] *"Task 4 is a Close the file button for curators. The button goes inside the Curator check, closeFile goes at the bottom of archive.js, and the listener is replaced, the same three moves as mine."*
- [ ] ⚠️ *"Make a test creature first with Open a new file, and close that one. A closed file takes its reports with it."*
- [ ] 👀 **Watch for:** the button does nothing — the listener wasn't replaced. `Only a signed-in curator…` for the curator — they signed out in another tab, or their cookie is older than their role. A red `404` in the console after a close — expected; the README says so
- [ ] **Stop:** the note after **Task 4 in full**. Where they should be: **`Passed: 4`**

## 5 · Production *(slides 5–6)*

### Development, and Production

- [ ] On the `/` tab, **Sign in** as Ada, so the page is as you left it
- [ ] 🎞️ **GO TO SLIDE 5** — *Development or Production?* · *"Since week 7, your connection string has lived in user secrets on your laptop and in app settings on Azure. Tonight, why it has to be that way. Every app runs in an environment, and ASPNETCORE_ENVIRONMENT says which. On my laptop, the launch profile says Development. Nothing on Azure sets it, and with nothing set, the app runs as Production. Two things change. The error page stops showing code, and the app stops reading user secrets."*
- [ ] Still on slide 5, the last row: *"Week 7 said user secrets are read in Development only. Here is what that means for this app."*
- [ ] **Swipe to the editor, the second terminal. Leave `dotnet watch` running in the first** — measured: this run uses its own port and crashes alone. Say the goal: *"I'll run the same app, on the same laptop, with no launch profile. That makes it Production."*
  ```bash
  dotnet run --no-launch-profile --urls http://localhost:5199
  ```
- [ ] 🎯 It stops: `Unhandled exception. System.InvalidOperationException: The ConnectionString property has not been initialized.` *"Same code, same laptop, same secret on disk. As Production, the app never read it. Azure runs your app as Production on every deploy, and that is why your connection string there is an app setting."*
- [ ] *"The first terminal is still running dotnet watch, and that app never stopped. The second one ran its own copy, and only that copy crashed."*

### Where each secret lives

- [ ] 🎞️ **GO TO SLIDE 6** — *Where each secret lives* · *"Two places hold secrets in this course, and the repository is never one of them. User secrets on your laptop, and app settings on Azure."*
- [ ] Still on slide 6, the last line: *"In week 7 I said your laptop and your Azure app sharing one database is not what a real project does. A real project has two: one to develop against and one for production, and nobody's laptop points at production. Changes to the production database are applied by the deploy, not by someone typing database update."*

### The repository, for team git

- [ ] **Second terminal.** Say the goal: *"Team git after the break needs Curbside on GitHub, so it needs a repository. These are the same steps you take in a few minutes with your Registry. First a .gitignore, so the build output stays out."*
  ```bash
  dotnet new gitignore
  ```
- [ ] Then the first commit, same terminal. *"Everything from tonight goes in one commit."*
  ```bash
  git init
  git add .
  git commit -m "Curbside: the trucks page talks to the API"
  ```
- [ ] **Browser, github.com → + → New repository.** Name `curbside-week14`, **Private**, and **no** README, `.gitignore` or license. **Create repository**. *"Private, because Curbside is my app's code. Empty, because everything comes from my laptop."*
- [ ] The empty repository's page shows three lines under **…or push an existing repository from the command line**. Copy them with the copy button beside them, and paste them into the second terminal. *"Those lines tell my copy where the repository is, name the branch main, and push."* They look like this:
  ```bash
  git remote add origin https://github.com/<YOUR-USERNAME>/curbside-week14.git
  git branch -M main
  git push -u origin main
  ```
- [ ] **Browser, reload the repository.** 🎯 Curbside's files, with the commit message beside them, and no `bin` or `obj`. *"My laptop's copy is on GitHub now. After the break, a second person gets a copy of their own."*

## Lab E · Task 5 — 10 minutes

- [ ] *"Task 5 is what I just did, with your Registry: your lab in a new private repository called cryptids-team. Team git runs on it after the break."*
- [ ] ⚠️ *"Run dotnet new gitignore before your first commit, or bin and obj go up with it."*
- [ ] 👀 **Watch for:** `bin` and `obj` on GitHub — `dotnet new gitignore` came after the first commit; the README's Stuck list has the fix. `git push` refusing a password — sign in through the browser window Git opens
- [ ] **Stop:** the note after **Task 5 in full**. Where they should be: **`Passed: 4`**, and their lab on GitHub in a private `cryptids-team` repository

## ☕ Break

## 6 · Two people, one line *(slide 7)*

### Two copies

- [ ] Say the goal: *"Team git is two people changing one app at the same time. I am going to play both. Ada works in this folder. Sam gets a copy of his own."* **Second terminal:**
  ```bash
  cd ..
  git clone https://github.com/<YOUR-USERNAME>/curbside-week14.git curbside-sam
  ```
- [ ] **Say what it is:** *"A second clone of the same repository, in a folder of its own. Two copies, one repository on GitHub."*

### Ada's change

- [ ] Second terminal, back in Ada's copy:
  ```bash
  cd Curbside
  git switch -c ada-heading
  ```
- [ ] Say the goal: *"Ada's change is the heading on the home page."* Open `Views/Home/Index.cshtml`, select the line `<h1 class="display-4">Curbside 🌮</h1>` and paste over it:
  ```cshtml
      <h1 class="display-4">Curbside 🌮 — Wisconsin's food trucks</h1>
  ```
- [ ] Second terminal:
  ```bash
  git commit -am "Ada: the home page heading"
  git push -u origin ada-heading
  ```
- [ ] **Browser, the repository tab.** **Compare & pull request** → **Create pull request**. *"A pull request asks for a branch to be merged into main. Before it is, somebody else reads it."*

### Sam's change, to the same line

- [ ] Second terminal, in Sam's copy:
  ```bash
  cd ../curbside-sam
  git switch -c sam-heading
  ```
- [ ] **File → Open File…** → `curbside-sam/Views/Home/Index.cshtml`. Say the goal: *"Sam changes the same line, a different way. Neither of them knows about the other."* Select the `<h1>` line and paste over it:
  ```cshtml
      <h1 class="display-4">Curbside 🌮 — street food, found</h1>
  ```
- [ ] Second terminal:
  ```bash
  git commit -am "Sam: the home page heading"
  git push -u origin sam-heading
  ```
- [ ] **Browser:** **Compare & pull request** → **Create pull request**

### The review, and the conflict

- [ ] Open **Ada's** pull request → **Files changed**. Hover over the new line, click the **+**, comment `Reads well.`, **Add single comment**. *"On a team, Sam would approve this. I am both of them, and GitHub won't let anyone approve their own pull request, so a comment stands in for it."*
- [ ] **Conversation** tab → **Merge pull request** → **Confirm merge**
- [ ] Open **Sam's** pull request. 🎯 **This branch has conflicts that must be resolved.** *"Ada's change is in main now. Sam's branch changes the same line, and git won't guess which one should stay."*
- [ ] Second terminal, still in Sam's copy. Say the goal: *"Sam brings main into his branch, and settles it on his own machine."*
  ```bash
  git pull --no-rebase origin main
  ```
  🎯 `CONFLICT (content): Merge conflict in Views/Home/Index.cshtml`, then `Automatic merge failed; fix conflicts and then commit the result.`
- [ ] *"No rebase means merge main into my branch. Without it, a recent git stops and asks you to choose first."*
- [ ] **Editor, Sam's `Index.cshtml`.** The two versions, marked: **Current Change** is Sam's, **Incoming Change** is Ada's. *"Git has kept both, and the markers show where. This decision is a person's, not git's."* Click **Accept Incoming Change**, save
- [ ] Second terminal:
  ```bash
  git add .
  git commit --no-edit
  git push
  ```
- [ ] **Browser, Sam's pull request.** 🎯 The conflict is gone. *"Sam settled it on his own machine, and pushed the result. Now his pull request can merge."* **Merge pull request** → **Confirm merge**
- [ ] 🎞️ **GO TO SLIDE 7** — *Two people, one line* · *"Here is the whole loop. A branch for each change. A pull request, which gets a review. A merge. And when two people change the same line, the second one pulls main into their branch, decides, and pushes again."*
- [ ] Still on slide 7, the last line: *"Nobody works on main. Main only changes through a pull request, after somebody has read it."*

## Lab F · Team git — 38 minutes

- [ ] *"Pairs now. One of you is A, and owns the repository you both use. The other is B, invited to it. Both of you change the home page's heading, on purpose, and A merges first."*
- [ ] *"No partner? The README has a section called On your own. You clone your own repository a second time, and play both people."*
- [ ] *"This has no check and no points. Nobody's grade depends on a partner."*
- [ ] 👀 **Watch for:** B can't push — the invitation was never accepted. `fatal: Need to specify how to reconcile divergent branches.` — `--no-rebase` was left off. Conflict markers left in the file, committed — open the file, take them out, commit, push. A solo student trying to **Approve** their own pull request — a comment instead
- [ ] **Stop:** both pull requests merged, and both copies on `main`, pulled

## Lab G · Catch up — 25 minutes

- [ ] *"This is the last block, and it has no stop. If any of your checks are red, finish those. If you're done, start your homework: the same three moves on your own app."*
- [ ] 👀 **Watch for:** anyone still red on check 3 — have them read the message; it names the box names it sent
- [ ] **No stop.** This block takes whatever time is left before the wrap-up. Anyone finished: **🚀 Done early?** at the bottom of the README, or help a classmate

## 7 · Wrap-up, after the lab *(slide 8)*

- [ ] 🎞️ **GO TO SLIDE 8** — *Tonight, in one picture* · walk the rows, one sentence each, and give the status row the emphasis: *"Read the status first. It tells you whether there is a body to read, and what to tell the person."*
- [ ] Homework: **the same three moves on their own app.** *"Your related rows, without leaving your list. An add form and a remove button for your role. Then deploy it, the way you have all semester."*
- [ ] Say what comes after it: *"This is the last homework of the term. Your final project is this same app, and nothing more is required. Week 15's stretch is optional. In week 16 you present the app, running live, so make sure your deployed site works and rehearse showing it."*
- [ ] ⚠️ Say what the self-check can't see: *"This week's self-check only reads. It opens your list page out of sight and clicks one Show related button, and you stay signed in. It cannot see your add or your remove, because they need your role. Trying both on your deployed site is the last step of the homework, and it's yours."*
- [ ] 💡 *"My Curbside is on localhost. Nothing is deployed for it. Yours is graded on its Azure URL."*
- [ ] 🔗 Week 15: *"Next week is the polish week: a message after a change, search, and pages."*
