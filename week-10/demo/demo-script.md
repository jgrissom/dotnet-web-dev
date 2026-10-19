# Week 10 Demo Script — Curbside Gets Finished ✨

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Paste from here; nothing tonight needs typing.

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
> **Tonight there is no lab. After each part of the demo, students make the same move on their own midterm app, in a studio block.** Each block has its own `## Studio` section below — what to say, what to watch for, and the **In class, stop here** note in the homework it stops at. The homework is on screen for every block, because tonight the homework *is* the studio. There is no studio slide. The last block, Studio E, has no stop and runs to the wrap-up.

> [!IMPORTANT]
> **There is no new syntax tonight and one line of new API** — `UseStatusCodePagesWithReExecute`, in §4. There is **one** failure to debug, in §2, and it is not staged: a real defect Curbside has carried since week 5. The teaching is the noticing, not the typing, so the room should be talking.
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
  Five migrations replay. Then check `/Trucks` shows **seven** cards and `/Dishes` shows **ten** dishes
- [ ] **Rehearse the whole script once in a separate copy.** Tonight's demo is short; the risk is not running out of time, it is filling a quiet moment with talk. Time §1 in particular
- [ ] 🚨 **Then run the drop + rebuild above again — the rehearsal used the same database.** A separate *copy* is not a separate database: the `<UserSecretsId>` ships in the `.csproj`, so every copy reads one secret and points at one database. Your rehearsal added a dish called **Elote Dog** in §3, and it will still be there. **Last thing before class, always: drop, update, `/Dishes` shows ten**
- [ ] Run it, same terminal. `dotnet watch` owns terminal 1 all night — there is no `dotnet ef` in the demo:
  ```bash
  dotnet watch
  ```
- [ ] **Open a second integrated terminal** (the `+` on the terminal panel — it opens in the same folder). It runs **one** command tonight, §3's `cp`, because terminal 1 is busy with `dotnet watch`
- [ ] ⚠️ **If terminal 1 prints yellow `NU1902` and `NU1903` warnings, then two `msbuild: [Failure] Msbuild failed when processing the file …` lines after `Now listening on:`** — the same `System.Security.Cryptography.Pkcs` advisory as week 9, three levels under the SQL Server package. The build succeeded and the app is running. VS Code may also show the *There were problems loading project Curbside.csproj* toast — dismiss it. **The demo starter now carries the fix (2026-10-18), so expect no yellow lines — skip §1's warnings beat.** A student whose own app shows them: `dotnet add package System.Security.Cryptography.Pkcs --version 10.0.13`, from the folder with their `.csproj` — it was week 9's homework's first step
- [ ] ⚠️ **Know the one prompt tonight, and answer it `a`.** It first appears in **§2, when you delete `Privacy.cshtml`** — `Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`, in terminal 1. Answer **`a`** there and `watch` restarts by itself for every later edit that needs one: §3's copied-in view, §4's new view, and §4's `Program.cs` line. *(Measured: with `a` answered, the `Program.cs` edit prints `Restart is needed to apply the changes` and restarts on its own. With `y` answered instead, the same edit prints `⚠  Press "Ctrl + R" to restart.` and the line does nothing until you do.)*
- [ ] **One browser window all night, four tabs parked**: `/`, `/Trucks/Details/1`, `/Dishes`, and **week 10's homework** on github.com — it goes on screen for every studio block tonight
- [ ] **Say the no-typing line out loud in the first minute.** *"Nothing I type tonight is yours to type. Curbside is my app, and your midterm app is yours. After each part of my demo, you make the same change to your own app. Those studio blocks are most of tonight."*
- [ ] Teaching profile on, notifications off, editor font sized for the back of the room and for a small laptop screen

> [!NOTE]
> **🖥️ On screen, at curtain**
>
> - **VS Code** — left half, `instructor/week-10/Curbside` open, two integrated terminals: terminal 1 running `dotnet watch`, terminal 2 idle at the project root
> - **Browser** — right half, one window, four tabs: `/` (the stock template home page — that is the point), `/Trucks/Details/1`, `/Dishes`, and the week 10 homework

## 1 · The stranger's pass *(slides 1–3)*

- [ ] 🎞️ **GO TO SLIDE 1** — *Week 10 — The Midterm Project* · it is still up from the gallery — talk to its list before you swipe away from it: *"Here is tonight. First, I walk my own app as a stranger would and write down what is wrong. Then I fix it, one thing at a time: a front page of my own, lists that say something when they are empty, and a wrong id that lands somewhere. After each one, you do the same thing to your own app. The rest of the night is your three things."*

### Two different questions *(slide 2)*

- [ ] 🎞️ **GO TO SLIDE 2** — *Two questions* · *"Every week since week 4, the question has been: does it work? The checks answered it in the lab, and the self-check answered it on your URL. A script can answer that question with a yes or a no."*
- [ ] 🎯 Still on slide 2, the second question, slowly: *"Tonight's question is: would you send someone this link? No script can answer that. That is why this week's self-check prints what it finds and scores nothing."*
- [ ] 💡 Still on slide 2, the last line: *"Nothing new is introduced tonight. No package, no migration, no new table. There is one line you have not seen before, and I will point at it when we get there."*
- [ ] ⚠️ **Only if terminal 1 shows yellow `NU1902`/`NU1903` lines — otherwise skip this beat.** Swipe to the editor and point at them: *"These are the same warnings as last week: an advisory against a package the SQL Server package brings in. Read the line above them. Build succeeded. Your own app uses SQL Server too, so you may see them tonight. The fix is one command, and it was the first step of week 9's homework."*

### Walk it like you just arrived *(slide 3)*

- [ ] 🎞️ **GO TO SLIDE 3** — *Walk it like you just arrived* · *"This is the stranger's pass. Open your deployed URL, not localhost, because that is the one a stranger gets and the one I grade. Then open it on your phone. You built this app on a laptop or a PC, at a width you picked. A phone is the cheapest way to look at it differently."*
- [ ] Still on slide 3, the last line: *"Write it down before you fix anything. Once you start fixing the first thing, you are in the editor and the walk is over. The list is what you are making."*
- [ ] **Swipe to the browser, `/` tab.** Open a new file in VS Code for the list, or use the whiteboard, and **keep it on screen**. Ask the room, and wait: *"I have never seen this site before. What is it?"*
- [ ] The front page says **Welcome** and links to **learn.microsoft.com**. Let it sit, then: *"This is Microsoft's front page. I have built this app for seven weeks and never opened this file."*
- [ ] **Point at the browser tab:** *"The tab says Home Page - Curbside. That is what a bookmark gets called."*
- [ ] Click **Privacy** in the navbar: *"Use this page to detail your site's privacy policy, or get rid of it."*
- [ ] Click **Trucks**, then a truck, and be fair about it: *"This part is good. This is the part we built."*
- [ ] In the address bar, change the id to `999` and press Enter → **the browser's own error page.** Ask: *"What happened to my site?"* Take answers
- [ ] 💡 **Then drag the window narrow**, down to phone width, and let the room watch it reflow: *"I cannot reach localhost from my phone, so this is the phone half of the slide. Your phone can reach your deployed URL."*
- [ ] Write the list on screen, in the room's words. It should come out close to:
  1. the front page is Microsoft's, and its tab says Home Page
  2. there is a page in my navbar I never wrote
  3. a wrong id lands on the browser's error page
- [ ] *"Three things. I fix these three tonight, and after each one you fix the same thing on your app."*

### What the script sees

- [ ] **Now the self-check, to compare with the list.** In the editor, open `Views/Home/Index.cshtml` and paste this at the bottom of the file, below the `</div>`. **Curbside has never had a self-check** — the file is the stock template, with no `@section Scripts` — so on your app this is a fresh install; theirs replaces a week-9 line:
  ```cshtml
  @section Scripts {
      <script src="https://jgrissom.github.io/dotnet-web-dev/week-10/homework-checks.js"></script>
  }
  ```
- [ ] **Say what it is, with it on screen:** *"This loads this week's self-check on my home page. Your week 9 line is in this same file. You replace it with this one."*
- [ ] **Widen the window back, type `/` in the address bar** — your walk left this tab on `/Trucks/Details/999` — then open DevTools on the **Console** (**⌥⌘I** on your Mac — `F12` on Windows), and type `recheck()`
- [ ] ⚠️ **The findings print one at a time. Partway through, a red line appears just above the wrong-id finding**, naming `/Trucks/Details/1007` and `404 (Not Found)`. Get in front of it: *"That red line is the script asking for a truck that does not exist. It got a 404, and the browser logs every 404 in red. It is not an error in my page."*
- [ ] Scroll to the **`📋`** line under the last finding: **`📋 4 things a stranger would trip over`**. Then point from each finding to the list on screen: *"The template front page and the Home Page tab are my item one. The Privacy page is item two. The wrong id is item three. The script found what we found."*
- [ ] 🎯 *"It found them because a stranger can see them without knowing what my site is about. It will never find your three things. Those are about your app, and only you know what it is for."*

## Studio A · Your own pass — 20 minutes

- [ ] Put the **homework** on screen — the tab you parked in §0 — scrolled to **Part 1**
- [ ] ⚠️ **Say plainly that this is the homework, because nine weeks have trained them otherwise:** *"Since week 4, the lab was a different app from your homework, and it was never collected. Tonight is different. There is no lab. This is your midterm, on your own app. What you finish tonight is finished, and what you do not finish, you finish at home."*
- [ ] *"This block is the walk you just watched, on your own app. Walk your deployed URL, then walk it on your phone, and write down what you see."*
- [ ] *"Then swap the self-check. In Views/Home/Index.cshtml, replace your week 9 line with this week's. Run your app in terminal 1 with dotnet watch, open the console on localhost, and type recheck."*
- [ ] 🎯 **The line that keeps their three their own:** *"The front page, the page you never wrote, and the wrong id are on everybody's list. Everybody fixes those tonight. Your three things are three more, about your app, that I have not mentioned. Put a star next to them."*
- [ ] ⚠️ Before anyone starts: *"You will notice that anybody with your URL can delete your records. Leave it. That is next week's whole subject, and a midterm night spent on half a login is a night lost."*
- [ ] **On Zoom:** *"When you have your three, post them in the chat, to everyone. Reading other people's threes may help you find yours."* Keep the chat open — it is your map of who is stuck, and read two or three patterns back to the room. **In a room:** circulate and ask each person *"what are your three, and which one is the worst?"*
- [ ] 👀 **Watch for:** `recheck is not defined` — the script tag is not on the page they are on: it lives in `Views/Home/Index.cshtml`, so the console has to be on `/`. A banner saying **Week 9** — the old line is still there; this week's replaces it. An app that will not start on a lab PC — the user secret is gone after a reboot; set it again. Yellow `NU1902`/`NU1903` lines — the same advisory as Curbside's. A deployed site that takes a while to load — a free-tier app sleeps; the first page can take thirty seconds. And anyone already in the editor fixing things — send them back to the list
- [ ] **Stop:** the note at the end of **Swap the self-check over first**. Where they should be: a written list, with **three of their own starred**, and `recheck()` on localhost has printed its findings

## 2 · The front door *(slide 4)*

### What a front page owes you *(slide 4)*

- [ ] 🎞️ **GO TO SLIDE 4** — *What a front page owes a visitor* · *"One sentence about what this is, in the visitor's words. A truck is a Truck class to me, and a food truck to everyone else."*
- [ ] 🎯 Still on slide 4, the second row: *"A way in is a button, not a navbar link. That button has a name: a call to action. People stop looking at the navbar. A button in the middle of the page is the thing you are asking them to press."*
- [ ] 💡 Still on slide 4, the last line: *"A visitor gives a new site about ten seconds. So what a front page needs is a sentence and a way in, not a redesign."*
- [ ] **Swipe to the editor.** `Views/Home/Index.cshtml` — select everything in the file and paste the replacement:
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
      <a asp-controller="Dishes" asp-action="Index" class="btn btn-outline-secondary btn-lg ms-2">Start from a dish</a>
  </div>

  @section Scripts {
      <script src="https://jgrissom.github.io/dotnet-web-dev/week-10/homework-checks.js"></script>
  }
  ```
- [ ] **Say what it is, with it on screen:** *"This is my new front page: one sentence about what the site is, and two buttons into it. The title at the top is what the browser tab says."*
- [ ] ⚠️ **Point at the `@section Scripts` block at the bottom:** *"I replaced the whole file, and the self-check was in it. So the block goes back in at the bottom. If you rewrite your home page without it, your console goes quiet, and a quiet console looks like a clean report."*

### The headline nobody can read *(no slide — the browser is the reveal)*

> [!IMPORTANT]
> **This is the one real failure of the night and it is not staged** — the markup is correct, the page is a clean 200, and the front page is unreadable. Give it its time.

- [ ] **Reload the `/` tab.** The headline and the paragraph are **gone** — a pale panel with two buttons on it. Let it sit for a moment, then: *"I know it is not much to look at right now. There should be a headline and a sentence on that panel. Where did they go?"* Take answers. Somebody will say the text is white on white, and they are right
- [ ] 🎯 Then the point that earns the beat, before fixing anything: *"There is no error. The page loaded with a 200, and the markup is correct. The page just cannot be read. No script told me that. I had to look."*
- [ ] **Right-click the pale panel → Inspect.** That lands on the hero `<div>`; if you hit the invisible headline instead, the div is the line above it in the tree
- [ ] **Computed tab**, and type `color` in its filter box. Both numbers are next to each other:
  ```
  background-color    rgb(248, 249, 250)
  color               rgb(255, 255, 255)
  ```
- [ ] Point at the two values: *"The background is almost white. The text is white."*
- [ ] 🎯 The diagnosis: *"My theme, Darkly, makes the text white, but this panel's class still uses its light-mode color. If you picked a dark theme in week 5, this can happen to you."*
- [ ] **The fix is one attribute** — on the hero `<div>`:
  ```cshtml
  <div class="p-5 mb-4 bg-body-tertiary rounded-3" data-bs-theme="dark">
  ```
- [ ] *"This tells Bootstrap that this panel is in dark mode."* **Reload.** The headline reads
- [ ] ⚠️ **Point at the second button**, which is still hard to see: *"This button is a different problem. Its outline is a fixed dark grey, and dark mode does not change it."* Change its class:
  ```cshtml
  <a asp-controller="Dishes" asp-action="Index" class="btn btn-outline-light btn-lg ms-2">Start from a dish</a>
  ```
- [ ] **Reload.** Both buttons read. Point at the tab: *"The tab says Street food across Wisconsin now. That is what a bookmark gets called."*
- [ ] 💡 *"I am not teaching Bootstrap here. This panel would read fine on the default theme. I picked Darkly in week 5, and nothing told me which Bootstrap classes would stop working with it. That is what walking your own site is for."*

### The page you did not write

- [ ] Pose it as a choice: *"Privacy has two honest answers. Make it a real page, like an About page that says who built this and why. Or delete it. What I will not do is link to a page I never wrote."*
- [ ] *"I am deleting it, in four places, starting with the links, so nothing points at a page that is gone."* Open `Views/Shared/_Layout.cshtml` and delete **the Privacy `<li>` in the navbar** — **one**
- [ ] Same file, the footer — **two**. Replace the whole line inside the footer's `<div class="container">` with:
  ```cshtml
  &copy; 2026 Curbside 🌮 — a WCTC .NET Web Development project
  ```
- [ ] `Controllers/HomeController.cs` — delete the `Privacy()` action — **three**
- [ ] Delete the file `Views/Home/Privacy.cshtml` — **four**
- [ ] ⚠️ **Terminal 1 asks `Do you want to restart your app?` — answer `a`.** Say why while it restarts: *"Deleting a view is a change hot reload cannot make, so dotnet watch asks to restart. I answer a, for always, and it restarts by itself from now on. You will see the same question tonight. If a change seems to do nothing, look at the terminal."*
- [ ] **Reload.** The navbar is Home · Trucks · Dishes. 🎯 *"A page you have not written is worse than no page."*
- [ ] **Check it with the script** — Console, `recheck()`. **`📋 1 thing a stranger would trip over`**, and it is the wrong id: *"Three of the four are gone. The last one is item three on my list."*

## Studio B · Front door and Privacy — 15 minutes

- [ ] Homework on screen, scrolled to **Requirement 1**
- [ ] *"This block is requirements one and two. Rewrite your home page: what your site is, who it is for, and a button into your list page. Give it a title. Then deal with Privacy: make it real, or delete it in all four places."*
- [ ] ⚠️ *"Two things I just ran into. When you rewrite Views/Home/Index.cshtml, put the self-check block back at the bottom. And look at your page after you change it. If you picked a dark theme, you may have my white-on-white problem."*
- [ ] *"If you delete Privacy, take out the links and the action first and the file last. Deleting the file asks to restart. Answer a."*
- [ ] 👀 **Watch for:** a console that goes quiet — the `@section Scripts` block went with the old home page. A headline nobody can read — near-white text on a near-white panel; the fix is `data-bs-theme="dark"` on the panel. A **500** on `/Home/Privacy` — the view is gone and the action is not. A restart prompt left unanswered in terminal 1, while someone wonders why the page has not changed
- [ ] **Stop:** the note after **Requirement 2**. Where they should be: a front page of their own, which they have **looked at**, with a tab title that is not `Home Page`; Privacy real, or gone from all four places; and `recheck()` no longer lists the template front page, the tab title or Privacy

## ☕ Break

## 3 · A table nobody can add to *(slide 5)*

### Read-only from outside

- [ ] **Swipe to the `/Dishes` tab** — no slide for this part. Ten dishes, each with a truck count. Ask: *"This page is fine. Anything missing?"*
- [ ] Wait, then name it: *"I can browse the dishes, but there is no way to add one, not here and not anywhere. The specials form only offers dishes that already exist. From the outside, this table is read-only."*
- [ ] 🎯 Say why your app is the odd one out: *"Your apps will not have a table like this. Dishes came from the many-to-many I built in week 9, and that was not a homework requirement. Every table you built has a form. I am adding a form for dishes because a brand-new dish is the quickest way to show you what a new record looks like."*
- [ ] *"A Create pair is week 8. Typing it again teaches nothing, so I am copying it in."* **Terminal 2**, the one you opened in §0:
  ```bash
  cp -R ~/Repos/dotnet-web-dev-answer-keys/week-10/demo-section3/Curbside/. .
  ```
- [ ] Say it while it copies: *"These three files add a Create pair to the dishes controller, a form for a new dish, and a button on the dish list."*
- [ ] **Open `Controllers/DishesController.cs`** and point at the last line of the POST:
  ```csharp
  return RedirectToAction(nameof(Details), new { id = dish.Id });
  ```
  *"After a new dish is saved, this sends me straight to that dish's own page."*
- [ ] ⚠️ **Look at terminal 1.** The new view needs a restart, and because you answered `a` in §2, `watch` prints `Restart is needed to apply the changes` and restarts by itself. **If it is asking instead**, answer `a` now — until it restarts, `/Dishes/Create` is a 500 and the dish list shows no button
- [ ] **Reload `/Dishes`, click ＋ Add a dish**, and check the form renders. ⚠️ **Do not submit it yet** — the new dish's page is the payoff, and you only get it once. Go back to `/Dishes`

### What a new record looks like

- [ ] **Open `Views/Dishes/Details.cshtml`** in the editor and point at the `@foreach` under **Served by**. Ask — the answer is a loop with nothing to go over: *"This page lists every truck that serves this dish, one line for each truck. A dish I add tonight is not on any truck yet. What will this page show under Served by?"* Take answers
- [ ] **Swipe to the browser.** `/Dishes` → **＋ Add a dish** → `Elote Dog` → **Add it**
- [ ] You land on `/Dishes/Details/11`. **Let it sit before saying anything.** **Elote Dog**, *← All dishes*, **Served by** — and then nothing
- [ ] **Show the evidence:** right-click the empty space under *Served by* → **Inspect**. In the Elements panel, the list is there, with nothing inside it:
  ```html
  <ul class="list-group mb-4">
  </ul>
  ```
  *"The record saved, the query ran, and the page loaded with a 200. The loop ran zero times, so the list is empty, and an empty list draws nothing."*
- [ ] 🎯 *"This is every new record in your app. The first review of a trail, the first visit to a ballpark. Whatever this page does now is what everybody's first one looks like."*

### Two things, not one *(slide 5)*

- [ ] 🎞️ **GO TO SLIDE 5** — *An empty state is two things* · *"An empty page needs a sentence that says nothing is here yet. Everybody writes that half. It also needs a way to change it, and that is the half people skip."*
- [ ] Still on slide 5, the two quoted lines: *"A message without a CTA button is a dead end. Adding a CTA gives the visitor something to do."*
- [ ] 💡 Still on slide 5, the last line: *"You have never seen your own app empty. You seeded it in week 7, and it has had data every time you looked. It is empty for the first person who uses it."*
- [ ] **Swipe to the editor.** `Views/Dishes/Details.cshtml` — replace the whole `<ul>` block under the **Served by** heading:
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
- [ ] **Say what it is, with it on screen:** *"If the dish has specials, the page shows the same list as before. If it has none, the page says so and gives a button to put the dish on a truck."*
- [ ] **Reload `/Dishes/Details/11`.** *No truck is serving this yet*, and a button
- [ ] **The list pages need one too.** `Views/Dishes/Index.cshtml` — paste this **between the ＋ Add a dish button and the `<ul>`**:
  ```cshtml
  @if (!Model.Any())
  {
      <p class="text-muted">No dishes yet. <a asp-action="Create">Add the first one</a>.</p>
  }
  ```
- [ ] `Views/Trucks/Index.cshtml` — paste this **between the ＋ Add a truck button and the `<div class="row …">` that holds the cards**:
  ```cshtml
  @if (!Model.Any())
  {
      <p class="text-muted">No trucks on the street yet. <a asp-action="Create">Add the first one</a>.</p>
  }
  ```
- [ ] **Say what they are, with the second one on screen:** *"If there are no trucks, the page says so and links to the Add a truck form. The dish list does the same with the Add a dish form. The details page and the list pages are different views, so each one needs its own if."*
- [ ] ⚠️ **Somebody may point out that both lists already have a ＋ button.** *"They do, on my pages. On your app there may be no button at all. A sentence and a way out, every time."*
- [ ] *"I am not deleting every truck to show you the empty truck list. The if on each list page works the same way as the one on the details page."*

## Studio C · Empty states — 13 minutes

- [ ] Homework on screen, scrolled to **Requirement 3**
- [ ] *"This block is requirement three. First see the problem on your own app. Add a brand-new record through your form, and open its page. Look at the related list."*
- [ ] *"Then add an if to that related list on your details page, and one to your list page. Each one needs a sentence and a way to change it."*
- [ ] *"The record you just added is real data on your site. When you are done, delete it, or keep it if it reads like real content."*
- [ ] *"The script cannot see this one. It cannot empty your database. You have to look."*
- [ ] 👀 **Watch for:** `NullReferenceException` on `Model.Any()` or `.Count` — the collection property was never initialized; it needs `= new List<…>();` (week 9). An empty state on the list page only — the details page's related list is a different view. A record that will not save — the form is refusing it; switch the summary to `asp-validation-summary="All"` to see why. A form that is nowhere to be found — that is a finding for their list
- [ ] **Stop:** the note after **Requirement 3**. Where they should be: a brand-new record's page says something and offers a way to change it, and the list page has its own `@if`. `recheck()` has not changed, and that is expected

## 4 · The blank page *(slide 6)*

### Zero bytes

- [ ] **Swipe to the `/Trucks/Details/1` tab** — no slide for this part. Open DevTools on the **Network** tab first; it only records while it is open
- [ ] Change the id to `999` and press Enter. The browser's error page again. In the Network tab, click the `999` request: **Status `404`**. Then its **Response** tab: there is nothing in it. *"The server answered with a 404, and it sent nothing with it. That empty response is why the browser shows its own page."*
- [ ] **Swipe to the editor.** `Controllers/TrucksController.cs`, the `Details` action, and point at the guard:
  ```csharp
  if (truck == null)
  {
      return NotFound();
  }
  ```
  *"Every Details action we have written since week 4 has this guard, and it is right. A truck that does not exist should get a 404. But NotFound sends the 404 with no body at all. There is no page for the browser to show, so it shows its own."*
- [ ] 🎯 The reason this matters: *"This is not just someone typing a silly number. You built Delete in week 8. When you delete a record, every saved link to it lands here."*

### Three pieces *(slide 6)*

- [ ] 🎞️ **GO TO SLIDE 6** — *Three pieces, one of them a line* · *"This is the plan, in the order I build it: a view, an action that renders it, and one line that sends every empty 404 to it. You already know how to write the view and the action. The line is the new part."*
- [ ] Still on slide 6, the line at the bottom: *"The order matters. If the line goes in first, it sends every 404 to a view that does not exist yet, and every wrong id becomes a 500."*
- [ ] Still on slide 6, the middle block: *"Do not call the action NotFound. Controller already has a method with that name. It is the one sending the empty 404."*
- [ ] **Swipe to the editor.** New file, `Views/Home/Missing.cshtml`:
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
- [ ] **Say what it is, with it on screen:** *"This is the page a visitor sees when something is not found: a heading, one sentence, and a button back to the trucks. It is an ordinary view."*
- [ ] ⚠️ It is a new view, so terminal 1 prints `Restart is needed to apply the changes` and restarts by itself. Let it finish before the next step
- [ ] `Controllers/HomeController.cs` — paste the action where `Privacy()` used to be:
  ```csharp
  // Not called NotFound() — Controller already has a method by that name,
  // and it's the one that returns the blank page we're replacing.
  public IActionResult Missing()
  {
      return View();
  }
  ```
- [ ] **Say what it is, with it on screen:** *"This action renders the Missing view. It is named Missing because NotFound is taken."*
- [ ] **Show it before you wire it up** — browse to `/Home/Missing`. It is a real page: *"There is the page. Nothing sends anyone to it yet. The line in Program.cs does that, and it is the last piece."*
- [ ] `Program.cs` — paste this **just above `app.UseRouting();`**:
  ```csharp
  // A wrong id, or a URL nobody recognizes, used to be a blank browser page.
  // This re-runs the request through /Home/Missing and keeps the 404 status.
  app.UseStatusCodePagesWithReExecute("/Home/Missing");
  ```
- [ ] **Say what it is, with it on screen:** *"This is the new line. When a response is an error with no body, it runs the request again through /Home/Missing and uses that page as the body. The status code stays what it was. Here, that is a 404."*
- [ ] ⚠️ **Watch terminal 1.** `Program.cs` runs once, when the app starts, so this line needs a restart. With `a` answered, `watch` prints `Restart is needed to apply the changes` and restarts. **If it prints `Press "Ctrl + R" to restart.` instead, press Ctrl+R in terminal 1** — until then the line does nothing. Say it to the room: *"Program.cs only runs when the app starts, so this line needs a restart. If your wrong id is still blank after you add it, look at your terminal."*
- [ ] **Reload `/Trucks/Details/999`.** My page, my navbar, a way back. In the Network tab, the request still says **`404`**
- [ ] 🎯 *"The visitor gets a real page, and the browser and search engines still get a 404."*
- [ ] Try one more: `/Vendors` — a controller that has never existed. **Same page.** *"One line covers a wrong id, a misspelled URL, and every other empty 404."* Close DevTools

## Studio D · The wrong-id page — 12 minutes

- [ ] Homework on screen, scrolled to **Requirement 4**
- [ ] *"This block is requirement four. The same three pieces, in the same order: the view, the action, then the line in Program.cs."*
- [ ] *"Point the button on your Missing page at your own list page. After the Program.cs line, check terminal 1. If it asks to restart, answer a. If it says press Ctrl+R, press it."*
- [ ] *"Then change an id on your own app, and check the Network tab. It should still say 404."*
- [ ] 👀 **Watch for:** a compiler error naming `NotFound` — the action was given that name; call it `Missing`. Every wrong id suddenly a **500** with `The view 'Missing' was not found` — the `Program.cs` line went in before the view existed. A wrong id still blank — the app has not restarted since the `Program.cs` line. Their page showing with a status of **200** — they returned the view from inside the guard instead of leaving `NotFound()` there
- [ ] **Stop:** the note after **Requirement 4**. Where they should be: a wrong id on their app lands on their own page, the Network tab still says `404`, and `recheck()` no longer lists the blank wrong-id page

## ☕ Break

## 5 · The pass, again *(slide 7)*

- [ ] **Swipe to the `/` tab.** Console → `recheck()`. The same red `404` line first — it is the script's wrong-id request again
- [ ] Read the top line: **`📋 Nothing here a stranger would trip over`**, and the line under it: **`This is localhost. Run it again on your Azure URL`**
- [ ] ⚠️ **Don't undercut it here — the slide does that.** Ask, and let it sit: *"Zero findings. So is my app finished?"*

### What it can and cannot see *(slide 7)*

- [ ] 🎞️ **GO TO SLIDE 7** — *The script scores nothing* · the left column, quickly: *"These are things a stranger can see without knowing what your site is about. That is why a script can find them."*
- [ ] 🎯 Still on slide 7, the right column, slowly: *"None of these can be checked by a script. It cannot empty your database, so it has never seen your empty states. It cannot tell a real record from a placeholder. And it has no opinion about whether your app is any good."*
- [ ] Still on slide 7, the last line: *"Zero findings is not full marks. It means nothing is obviously broken. Nine of the twenty points are things this script never looks at."*
- [ ] 💡 *"This is the first week since week 3 where the script does not count. What is graded this week is judgement. You use yours tonight, and I use mine when I grade."*

## Studio E · Your three things — 50 minutes

- [ ] Homework on screen, scrolled to **Requirement 5**
- [ ] *"This is the last block, and it has no stop. Your three things first. They are worth more than anything on my list. Then your data: look for test rows, and especially a row called Week 7 Test or Week 9 Test. Then your README, with your live URL in it."*
- [ ] 🎯 **Push them to deploy before they leave:** *"If you get that far, deploy tonight. Push, run az webapp up, and run the check on your Azure URL while I am here. A deploy that breaks while I am here is a short problem. The same break at home can take your whole evening."* Then: *"My Curbside is on localhost. Nothing is deployed for it. Yours is graded on its Azure URL."*
- [ ] 🎯 *"Bring me your list, not your bugs. I would rather spend four minutes on whether your front page says the right thing than four minutes on a missing semicolon."*
- [ ] **Work the class for the rest of the block.** The question is the same either way — *"what are your three, and which one is the worst?"* **In a room**, circulate and ask it at each desk. **On Zoom**, run a queue: *"Put your name in the chat whenever you want me to look at something."* Take them in order, and ask each to share their screen. ⚠️ **Don't use breakout rooms** — everyone is working alone, so they only put distance between you and the person who needs you
- [ ] 👀 **Watch for:** a three-things list that is my list — send them back to their own app for three I did not mention. Anyone starting on a login — stop them; it is next week. A migration in their three things — `dotnet ef database update` before `az webapp up`, or every page that touches it throws `Invalid object name`. A README that is not at the root of the repo, or that has no live URL
- [ ] **No stop.** This block takes the time left before the wrap-up

## 6 · Wrap-up, after the studio *(slide 8)*

- [ ] 🎞️ **GO TO SLIDE 8** — *Tonight, in one picture* · five rows, one sentence each. **Front door** gets the emphasis: *"The front page is the one page every visitor sees, and nobody arrives on it already interested."*
- [ ] Homework: finish it, deploy it, run the pass on the Azure URL. ⚠️ **Name the two things people lose points on:** *"Two things are easy to lose points on. The self-check block deleted along with your old home page, and a README that never mentions your live URL."*
- [ ] 🔗 Week 11: *"Next week is Identity: registration, login, and the thing you noticed tonight and left alone."*
