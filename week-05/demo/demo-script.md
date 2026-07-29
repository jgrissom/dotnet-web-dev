# Week 5 Demo Script — Curbside Gets a Shell 🌮

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-05/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!IMPORTANT]
> **Tonight you break the layout four times on purpose.** Every one of them takes down *every page at once* — that's the lesson, and it's also the risk. Each break below has an explicit **restore** step. Do them.

## 0 · Before class

- [ ] **Copy `week-05/demo-starter/Curbside` out of the answer-keys repo** to a scratch folder. This is Curbside exactly where week 4 left it — plus the `Trucks` nav link, which week 4's homework asked students to add, so it matches what they have
- [ ] `cd Curbside && dotnet watch`
- [ ] **Park three browser tabs**: `/`, `/Trucks`, `/Trucks/Details/2`. Nearly every beat tonight changes all three — the tabs *are* the demo
- [ ] Teaching profile; terminal font sized for the projector
- [ ] Sanity check before you start: `/Trucks` shows six trucks in a table, `/Trucks/Details/999` is a 404

## 1 · The shell you've been ignoring *(slides 3–7)*

### The gap, shown live *(slide 3)* — **do this before saying anything about layouts**

Don't ask the question rhetorically; make them look at both halves. Use the **home page** — it's the smallest file in the project, so the gap is the widest and the whole thing fits on screen without scrolling. Two windows, thirty seconds.

- [ ] **Editor:** open `Views/Home/Index.cshtml`. **The whole file is 8 lines**, and only 4 of them are markup — a `div`, an `h1`, a `p`. No scrolling; the room can see all of it at once. Say it: *no `<html>`, no `<head>`, no navbar, no footer*
- [ ] **Browser:** the `/` tab → **View Source** (`⌘⌥U` on a Mac — plain `⌘U` won't do it in Chrome; right-click → *View Page Source* always works)
- [ ] Scroll to the **top**: `<!DOCTYPE html>`, `<head>`, the stylesheet, the navbar. **None of it was in the file you just read**
- [ ] `⌘F` / `Ctrl+F` for `display-4` — their content is **lines 40–43**, of **58**
- [ ] **Say the numbers:** *"Four lines of that page are yours. Fifty-four aren't."*
- [ ] **Point at the rendered page, not just the source** — a navbar, one centred heading, a footer. *"Almost everything you're looking at came from somewhere else."* On the home page the shell **is** the page, which is why we're starting here
- [ ] **Now ask it:** *"So who wrote it?"* — let the room answer before you open anything

### One more tab, so nobody thinks it's a home-page thing *(15 seconds)*

- [ ] Switch to `/Trucks` → View Source → same `<!DOCTYPE`, same navbar, same footer. **39 lines above their content and 15 below — identical to the home page.** Only the middle changed
- [ ] *"Two pages, same 54 lines of wrapper. That's not a coincidence, it's a file."* — then open `_Layout.cshtml`

> [!NOTE]
> Those counts are exact for the demo starter **as shipped**, and they shift the moment you start editing in a minute. If you rehearsed on a branded copy, re-check them rather than reading these aloud.

- [ ] Open `Views/Shared/_Layout.cshtml`. *"Here it is."* Scroll it top to bottom **once**, slowly, without editing. Name three things: `Views/Shared/` is for what belongs to no single page · the `_` prefix means "a piece, not a page" · it's all just Razor
- [ ] **Tie it back:** the 39 lines above and 15 below are literally this file, wrapped around their table
- [ ] Point at `@RenderBody()` inside `<main>`

### Break it #1 — `@RenderBody()`

- [ ] **Predict first:** *"I'm about to delete this line. Blank page, or error?"* Take a show of hands — most rooms say blank page
- [ ] Delete the `@RenderBody()` line, save, refresh any tab:
  ```
  InvalidOperationException: RenderBody has not been called for the page at
  '/Views/Shared/_Layout.cshtml'. To ignore call IgnoreBody().
  ```
- [ ] **Read it out loud.** The framework treats "a layout that never renders its body" as a bug and names it. Land the week-4 callback: **500 means my code** — and one line here broke *all three tabs*
- [ ] **RESTORE the line. Refresh and confirm a page loads before moving on** ⚠️

### The title, both halves

- [ ] Point at the layout: `<title>@ViewData["Title"] - Curbside</title>`. Then at `Views/Trucks/Details.cshtml`: `ViewData["Title"] = Model.Name;`
- [ ] *"The view runs first and puts a value in. The layout runs second and reads it. That's the whole mechanism."*

### Break it #2 — the title

- [ ] Delete the `@{ ViewData["Title"] = Model.Name; }` block from `Details.cshtml`, save, refresh `/Trucks/Details/2`
- [ ] **Point at the browser tab**: `- Curbside`, dangling dash, nothing in front. The layout printed its half; the view stopped supplying the other
- [ ] **RESTORE it** — put the block back:
  ```html
  @{
      ViewData["Title"] = Model.Name;
  }
  ```
- [ ] Tab reads **Cheese Curd Cartel - Curbside**. *"That's a small thing that makes an app feel finished — and it's in your homework"*

### Brand it

- [ ] In `_Layout.cshtml`, change **two** things — the `<title>` suffix and the `navbar-brand` text — to `Curbside 🌮`
- [ ] Click through all three tabs. **Nothing else changed, and every page is different**
- [ ] **✓ CHECKPOINT:** the room can point at the file that owns the navbar

## 2 · The two files nobody opens *(slides 8–9)*

- [ ] Open `Views/_ViewStart.cshtml` — the entire file:
  ```html
  @{
      Layout = "_Layout";
  }
  ```
- [ ] *"Nothing in your Index view mentions a layout. This is why it gets one — one file, every view below it"*

### Break it #3 — opt a page out

- [ ] Open `Views/Home/Privacy.cshtml` and add `Layout = null;`:
  ```html
  @{
      ViewData["Title"] = "Privacy Policy";
      Layout = null;
  }
  ```
- [ ] Refresh `/Home/Privacy` → an `<h1>` and a `<p>` on a white page. No navbar, no footer, no Bootstrap
- [ ] **View Source** — there isn't even an `<html>` tag. *"A view produces a fragment. The layout is what makes it a document"*
- [ ] **RESTORE** — delete the `Layout = null;` line ⚠️
- [ ] Open `Views/_ViewImports.cshtml`:
  ```html
  @using Curbside
  @using Curbside.Models
  @addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
  ```
- [ ] The `@using` lines answer week 4's "where do views get their imports?" — **and `@addTagHelper` is why `asp-controller` works.** Flag it forward: *"it's also why the thing we're about to write in ten minutes works at all"*
- [ ] **✓ CHECKPOINT:** nobody thinks the layout is magic anymore

## 3 · Partials *(slides 10–13)* — **the load-bearing segment**

> [!IMPORTANT]
> If §1 or §2 ran long, take the time out of §5 (drop the extra theme swaps), **not out of this**. The "one file, two places" moment is the one that can't be recovered by reading the notes later.

> [!NOTE]
> **We skip the classic footer partial.** If you've taught this before, the reflex is to cut the `<footer>` out of the layout first because it's easy. Don't: the layout is already on every page, so that partial has **one call site** and proves nothing — and it silently breaks the footer's styling, because `_Layout.cshtml.css` is scoped and its rules stop matching markup the layout no longer renders. Go straight to the card.

### The card, with a model

- [ ] Frame the problem: *"you want that truck block on the index page as a card, and again in a 'nearby trucks' panel. The obvious move is copy-paste, and it's wrong for the obvious reason — two copies, two places to fix, and they drift"*

- [ ] Create `Views/Shared/_TruckCard.cshtml` — **paste**:

  <details><summary>📋 paste: _TruckCard.cshtml</summary>

  ```html
  @model Truck

  <div class="card h-100">
      <div class="card-body">
          <h5 class="card-title">@Model.Name</h5>
          <h6 class="card-subtitle mb-2 text-muted">@Model.Cuisine · @Model.City</h6>
          <p class="card-text">Rating: @Model.Rating / 5</p>
          @if (Model.IsOpenLate)
          {
              <span class="badge bg-success">🌙 Open late</span>
          }
      </div>
      <div class="card-footer">
          <a href="/Trucks/Details/@Model.Id">Details</a>
      </div>
  </div>
  ```

  </details>

- [ ] **Point at line 1**: `@model Truck` — *one* truck, not a list. A partial is strongly typed exactly like a page
- [ ] Three things while it's on screen: `name` will be a **file name, not a path** (`Views/Shared/` is searched) · underscore in, `.cshtml` out · **`<partial />` is a tag helper** — callback to `_ViewImports` from four minutes ago
- [ ] Replace **all of** `Views/Trucks/Index.cshtml` — **paste**:

  <details><summary>📋 paste: Index.cshtml, table → card grid</summary>

  ```html
  @model List<Truck>
  @{
      ViewData["Title"] = "Trucks";
  }

  <h1>Curbside</h1>
  <p class="text-muted">@Model.Count trucks on the street.</p>

  <div class="row row-cols-1 row-cols-md-3 g-4">
      @foreach (var truck in Model)
      {
          <div class="col">
              <partial name="_TruckCard" model="truck" />
          </div>
      }
  </div>
  ```

  </details>

- [ ] Six cards, three across. **`model="truck"` is the handoff** — the loop variable goes in, the partial's `@Model` is that one truck
- [ ] Say the mismatch out loud: **the page's model is `List<Truck>`, the partial's is `Truck`.** They don't have to match. This is the part that confuses people
- [ ] Week-2 callback: `row-cols-md-3` is the card grid they already know, finally pointed at real data
- [ ] Now the second location — at the **bottom** of `Views/Trucks/Details.cshtml`, below the "Back to all trucks" link — **paste**:

  <details><summary>📋 paste: "Also in this city" panel</summary>

  ```html
  @{
      var alsoHere = TruckData.All.Where(t => t.City == Model.City && t.Id != Model.Id).ToList();
  }

  @if (alsoHere.Count > 0)
  {
      <h2 class="h5 mt-4">Also in @Model.City</h2>
      <div class="row row-cols-1 row-cols-md-3 g-4">
          @foreach (var other in alsoHere)
          {
              <div class="col">
                  <partial name="_TruckCard" model="other" />
              </div>
          }
      </div>
  }
  ```

  </details>

- [ ] `/Trucks/Details/1` (Roll Models, Madison) → **"Also in Madison: The Gyro Wheel"**, rendered by the same card file
- [ ] `TruckData` resolves in the view because of `@using Curbside.Models` in `_ViewImports` — **the payoff lands inside the hour**
- [ ] `/Trucks/Details/5` (Pierogi Party, alone in Stevens Point) → no panel. The `@if` guard. *"'What if there are none' is a question worth always asking"*
- [ ] 🎯 **THE MOMENT** — open `_TruckCard.cshtml`, change one obvious thing (`text-primary` on the title, or an emoji), save, and refresh **both** `/Trucks` and `/Trucks/Details/1`. **One edit, both pages.** Stop talking for a second and let it land
- [ ] **✓ CHECKPOINT:** the room can say the difference between a layout and a partial — one wraps around, one drops inside

## 4 · Sections *(slides 14–15)*

- [ ] Scroll to the last line inside the layout's `<body>` — *"you've scrolled past this for three weeks"*:
  ```html
  @await RenderSectionAsync("Scripts", required: false)
  ```
- [ ] *"`@RenderBody()` is the one required, unnamed hole. This is an optional, named one"*
- [ ] Add to the bottom of `Views/Trucks/Details.cshtml` — **type it**:
  ```html
  @section Scripts {
      <script>
          console.log("Truck file loaded: @Model.Name");
      </script>
  }
  ```
- [ ] Refresh `/Trucks/Details/2`, **View Source**, scroll to the bottom: the script is **below the footer and below jQuery** — not where you typed it. *"The layout decided where it goes"*
- [ ] Open the console: `Truck file loaded: Cheese Curd Cartel`. **The section can see the model** — it's still Razor, still in the view's context
- [ ] Load `/Trucks` and View Source: nothing extra. Optional means optional

### Break it #4 — `required`

- [ ] In `_Layout.cshtml`, change `required: false` → `required: true`, save
- [ ] Visit `/Trucks` (no section) → **500**:
  ```
  InvalidOperationException: The layout page '/Views/Shared/_Layout.cshtml' cannot find
  the section 'Scripts' in the content page '/Views/Trucks/Index.cshtml'.
  ```
- [ ] Now visit `/Trucks/Details/2` → **still works**, because that page has the section. *"Same layout, two pages, one broken. That's what `required` means"*
- [ ] **RESTORE `required: false`** ⚠️
- [ ] 🔗 **Say the week-6 line now.** Open `Views/Shared/` and point at `_ValidationScriptsPartial.cshtml`, sitting there unused: *"a partial, meant to be rendered inside a Scripts section. Next week you build a form, and tonight's two ideas do a real job together"*
- [ ] **✓ CHECKPOINT:** everyone can say why scripts belong in a section rather than in the middle of the page

## 5 · Bootswatch — one link, whole site *(slides 16–18)*

- [ ] Open [bootswatch.com](https://bootswatch.com) on the projector and scroll the themes for ten seconds
- [ ] Frame it: **not a different framework — the same Bootstrap, recompiled with different variables.** Every class from week 2 still works
- [ ] In `_Layout.cshtml`, **replace** the Bootstrap line:
  ```html
  <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.min.css" />
  ```
  with:
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/united/bootstrap.min.css" />
  ```
- [ ] **Hard-refresh** (⌘⇧R / Ctrl+Shift+R). Whole site, different site
- [ ] ⚠️ **Hard-refresh at every single swap.** A cached stylesheet looks exactly like "it didn't work" and will eat five minutes if you let it
- [ ] Swap the theme name only — `darkly`, then `vapor` — hard-refreshing each time. *"One path segment"*
- [ ] Land three points: **`5.3.3` is pinned to match the Bootstrap already in `wwwroot/lib`** — version numbers in CDN URLs aren't decoration · **it replaces, it doesn't add** (leave both and they fight — the lab checks this) · **only the CSS moved**, the local `bootstrap.bundle.min.js` is untouched, so dropdowns still work
- [ ] The navbar looks wrong on a dark theme — because the template hard-coded it. Fix it inside the `<nav>` you already have:
  ```html
  <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-dark bg-primary mb-3">
  ```
  and drop `text-dark` from each `nav-link`
- [ ] **The reassurance, said out loud:** *"your Bootstrap knowledge is intact. The theme changed the variables. These are the same utility classes from week 2 and you still steer them"*
- [ ] **Week-2 callback:** *"you put a CDN link in one HTML file and styled one page. Same link tonight, and it styled a whole site — because now you know which file every page comes from"*
- [ ] **✓ CHECKPOINT:** the payoff has landed. Everyone wants to go pick a theme, which is exactly the right mood for the lab

## 6 · Hand off to the lab

- [ ] Show **what done looks like** — your finished Registry running + `dotnet test` printing **6 / 6**. ~90 seconds, a target not a walkthrough
- [ ] Setup on screen, said once: **`git pull` → copy `week-05/lab/starter` out and rename it → open the folder holding *both* projects → `dotnet test Cryptids.Checks`**
- [ ] Say plainly: **the app arrives finished.** Nobody is blocked tonight by an unfinished week 4. Check 1 proves it
- [ ] **In-class target: checks 1–4.** Checks 5–6 roll into homework by design
- [ ] Name the three exact strings the checks want: `Cryptid Registry`, `Field Reports Since 1893`, `Cryptid file loaded`
