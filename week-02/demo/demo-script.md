# Week 2 Demo Script — building Common Grounds live

Edit-by-edit cue sheet for transforming your **scratch copy** of `index.html` (see §0) into `finished.html`, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste repeats from `finished.html`.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/script.html) has working checkboxes that survive refreshes — keep it open on your second screen and tick as you go (Reset button at the top for next time).

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it's due. Everything that isn't a 🎞️ line happens in the other state, so **you don't need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

## 0 · Before class

- [ ] **Make tonight's canvas:** duplicate `demo/index.html` → `demo/scratch.html`, open **that** in VS Code (Teaching profile), browser at half-width. It's gitignored, so it won't clutter `git status` while you teach
  - ⚠️ **Edit the copy, never `index.html` itself.** That file is what CI publishes as tonight's [before](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/before.html) page — a stray edit republishes a half-Bootstrapped "before" picture, and the opening pitch is gone for good
- [ ] **Say it before you start: *"lids down for this part — you'll do it to your own site in the lab."*** You assemble the coffee shop; their lab is their portfolio. Same patterns, fresh retrieval — which only works if they aren't typing along with you
- [ ] Hosted [before](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/before.html) / [after](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/) open in two tabs for the opening pitch
- [ ] **Two things that make the live edits comfortable — try both once before class:**
  - **Never scroll to find an edit — `Ctrl+F` for `DEMO`.** Every place you touch tonight is marked in `scratch.html` as `DEMO 1 · the feature row`, `DEMO 2 · menu cards` — the slide footer's beat name, spelled so you can actually type it. Search `DEMO` and `Enter` walks every edit in the file top to bottom; search `DEMO 2` for one section, or just the beat name (`menu cards`) for one spot. `finished.html` carries the identical tokens, so the same search shows the destination
  - **Six edits tonight are "wrap these elements in a div" — let VS Code do it.** Select the elements → `Ctrl+Shift+P` → **Wrap with Abbreviation** → type the abbreviation → `Enter`. It writes both tags and re-indents. Every wrap beat below gives you the abbreviation to type; `div.row.g-4` becomes `<div class="row g-4">`

### The file at a glance

Where each section lands. `<head>` is the jumpy one — you go back to it four times.

Each line below is a comment you can `Ctrl+F` for, spelled exactly as it appears in the file.

```
<head>       DEMO 0b two tags · DEMO 2 icons · DEMO 3 bootswatch · DEMO 4 font
  <nav>      DEMO 2 · navbar
  <header>   DEMO 1 · container and hero
  <main>     DEMO 1 · container and hero   (main gets its container first)
    section×3  DEMO 1 · the feature row
    article×6  DEMO 2 · menu cards
    <p>        DEMO 2 · footer & polish    ← back-to-top, 1 of 2
    <form>     DEMO 2 · form
    <p>        DEMO 2 · footer & polish    ← back-to-top, 2 of 2 (wrapped with the form)
  <footer>   DEMO 2 · footer & polish
```

## 0b · The opening pitch *(slides 2–4)*

- [ ] 🎞️ **GO TO SLIDE 2** — *Tonight*
- [ ] Read the six items, **don't dwell** — and land the last one: *"it ends with the site public on the internet. By the end of tonight you have something styled you would actually show someone"*
- [ ] 🎞️ **GO TO SLIDE 3** — *Why a CSS framework?*
- [ ] 🎯 **Land the two on the list nobody can show you:** *"spacing and responsive you are about to watch me do. Accessible components and browser quirks are the two you never see — already solved, by people who do this full time. That is most of what you are buying"*
- [ ] Then flip between the **before** and **after** tabs — same content, transformed almost entirely by classes
- [ ] 🎞️ **GO TO SLIDE 4** — *Setup: two tags via CDN*
- [ ] 🎯 **The two tags do different jobs — say which:** *"the top one is the look. The bottom one is the behavior, and everything that moves tonight comes from it. Leave it out and your page looks perfect and does nothing"* — this is the #1 lab bug, and it gets said again at the lab launch
- [ ] Then swipe and point at the same two tags already sitting in your scratch copy

## 1 · The grid *(slides 5–7)*

### Container and hero

- [ ] 🎞️ **GO TO SLIDE 5** — *The grid: 12 columns, 6 breakpoints*
- [ ] 🎯 **The one rule the whole grid rests on:** *"every row is twelve units wide. Always twelve. Eight and four on the slide — that is a full row. Add up past twelve and the extra wraps onto the next line, which is the rule working, not a bug"* — the 8/4 split lives only on this slide; the demo builds thirds
- [ ] `<main>` first — margins appear, content stops hugging the edges

  ```diff
  -  <main>
  +  <main class="container py-5">
  ```
- [ ] The hero is `<header id="home">`, sitting **above** `<main>` — the `h1`, the tagline `<p>`, and the "See the menu" link. Give it the band:

  ```diff
  -  <header id="home">
  +  <header id="home" class="text-center py-5 bg-light">
  ```
- [ ] Hero: select its three children → **Wrap with Abbreviation** → `div.container.py-4`. The header is outside the container you just put on `<main>`, so the tinted band runs edge to edge while the text inside lines up with the rest of the page

  ```diff
     <header id="home" class="text-center py-5 bg-light">
  +    <div class="container py-4">
         <h1>Common Grounds Coffee</h1>
         <p>Campus coffee, roasted around the corner, open until midnight during finals.</p>
         <a href="#menu">See the menu</a>
  +    </div>
     </header>
  ```
- [ ] Hero: now the three classes

  ```diff
  -      <h1>Common Grounds Coffee</h1>
  -      <p>Campus coffee, roasted around the corner, open until midnight during finals.</p>
  -      <a href="#menu">See the menu</a>
  +      <h1 class="display-4">Common Grounds Coffee</h1>
  +      <p class="lead text-muted">Campus coffee, roasted around the corner, open until midnight during finals.</p>
  +      <a href="#menu" class="btn btn-primary btn-lg mt-2">See the menu</a>
  ```
- [ ] **✓ it suddenly looks like a website** — pause and enjoy the reaction

### The feature row

- [ ] 🎞️ **GO TO SLIDE 6** — *Breakpoints*
- [ ] 🎯 **Read the table once — it is the only airing these numbers get tonight:** *"mobile-first means no prefix applies everywhere, and a prefix only adds behavior as the screen gets wider. `md` is 768 pixels — and every single column I write tonight has `md` in it"*
- [ ] Feature row: select all three `<section>`s → **Wrap with Abbreviation** → `div.row.g-4.text-center`. Nothing inside them changes yet — the wrapper goes around the lot, and Emmet indents them for you

  ```diff
  +    <div class="row g-4 text-center">
         <section>
           <h2>Locally roasted</h2>
           <p>Beans from the roastery two blocks over, delivered every Tuesday.</p>
         </section>
         …two more sections…
  +    </div>
  ```
- [ ] 🎞️ **GO TO SLIDE 7** — *Reading a column recipe*. Read the slide's `col-12 col-md-6 col-lg-4` left to right, then apply that same reading to the shorter `col-md-4` you're about to type: full width on phones, one third from `md` up
- [ ] **The `<section>`s** — select `<section>`, then **Ctrl+Shift+L** (**Cmd+Shift+L** on Mac) puts a cursor on *every* match; type the class once and all three take it

  ```diff
  -      <section>
  +      <section class="col-md-4">
  ```
  — narrate the trick as you do it; students love this one. **Ctrl+D** (**Cmd+D**) grabs matches *one at a time* instead — safer when there might be matches off-screen (**Ctrl+K Ctrl+D** skips one, Esc collapses)
- [ ] **The `h2`s** — same move, three cursors again

  ```diff
  -        <h2>Locally roasted</h2>
  +        <h2 class="fs-4">Locally roasted</h2>
  ```
- [ ] **The `p`s** — third time, and by now the room is ahead of you

  ```diff
  -        <p>Beans from the roastery two blocks over, delivered every Tuesday.</p>
  +        <p class="text-muted">Beans from the roastery two blocks over, delivered every Tuesday.</p>
  ```
  — same trick again on the six `<article>`s in §2
- [ ] **✓ CHECKPOINT: resize slowly** — stacked on phone → thirds on desktop. This *is* the responsive lecture

## 2 · Components *(slides 8–11)*

### Navbar — from the docs, live

- [ ] 🎞️ **GO TO SLIDE 8** — *Components: assembled from the docs*
- [ ] 🎯 **Land the numbered workflow — it is the actual skill tonight, not the class names:** *"find it in the docs, copy the example, adapt it. That is still what I do. Nobody memorizes Bootstrap"*
- [ ] Open [docs → Navbar](https://getbootstrap.com/docs/5.3/components/navbar/), copy the example **with a toggler**, replace the plain `<nav>`
- [ ] Adapt: brand → `Common Grounds` (`href="#home"`); links → Home `#home` (`.active`), Menu `#menu`, Contact `#contact`
- [ ] Point out the matched pair the docs example came with: the toggler's `data-bs-target="#navbarSupportedContent"` ↔ the collapse div's `id="navbarSupportedContent"` (name varies by example). Keep the docs' name or rename it — but **always change both halves together**; mismatch = silently dead hamburger
- [ ] Now adjust the `<nav>` tag the docs gave you — this is **two edits and one addition**, not three new classes: the breakpoint drops `lg` → `md` (the hamburger then appears sooner, which is what you're about to show), `bg-body-tertiary` is **replaced** by `bg-dark`, and `data-bs-theme="dark"` is a new **attribute**, not a class

  ```diff
  -  <nav class="navbar navbar-expand-lg bg-body-tertiary">
  +  <nav class="navbar navbar-expand-md bg-dark" data-bs-theme="dark">
  ```
- [ ] **✓ shrink the window** — hamburger appears and *works*; point at the JS bundle `<script>` that makes it work
- [ ] *(optional theater)* comment the bundle out → dead hamburger → uncomment. The #1 lab bug, pre-lived

### Menu cards

- [ ] 🎞️ **GO TO SLIDE 9** — *Cards in a grid*
- [ ] 🎯 **Say where this ends up — the typing can never show it:** *"tonight there are six cards and I put all six in the file myself. In week 8 this block gets written once and the database supplies the rest — one card per row. Every list page in the back half of this course is this pattern"*
- [ ] The `<h2>` first

  ```diff
  -    <h2 id="menu">Menu</h2>
  +    <h2 id="menu" class="mt-5 mb-4">Menu</h2>
  ```
- [ ] Then select all six `<article>`s → **Wrap with Abbreviation** → `div.row.g-4`. The wrapper goes around all six; the articles themselves are untouched until the next beat

  ```diff
  +    <div class="row g-4">
         <article>
           <h3>Espresso <span>hot</span></h3>
           <p>Double shot, house blend. The reason this place exists.</p>
         </article>
         …five more articles…
  +    </div>
  ```
- [ ] Transform the **Espresso `<article>` in place** — evolve what's there, don't retype the content:
  1. wrap the whole article — **Wrap with Abbreviation**, `div.col-md-6.col-lg-4`
  2. the article itself → `class="card h-100"`
  3. select the `h3` and the `p` inside it → **Wrap with Abbreviation** → `div.card-body`
  4. `h3` → `class="card-title fs-5"` · `p` → `class="card-text"`
  5. the `<span>` already inside the `h3` → `class="badge bg-danger"` — one class, label becomes badge

  All five steps as one change:

  ```diff
  -      <article>
  -        <h3>Espresso <span>hot</span></h3>
  -        <p>Double shot, house blend. The reason this place exists.</p>
  -      </article>
  +      <div class="col-md-6 col-lg-4">
  +        <article class="card h-100">
  +          <div class="card-body">
  +            <h3 class="card-title fs-5">Espresso <span class="badge bg-danger">hot</span></h3>
  +            <p class="card-text">Double shot, house blend. The reason this place exists.</p>
  +          </div>
  +        </article>
  +      </div>
  ```
- [ ] Badge colors as you go: `bg-danger` hot · `bg-info text-dark` cold · `bg-success` food
- [ ] Paste the other five cards — copy straight from here:

  <details><summary>📋 Cards 2–6 (Cappuccino, Cold brew, Chai, Muffin, Bagel)</summary>

  ```html
  <div class="col-md-6 col-lg-4">
    <article class="card h-100">
      <div class="card-body">
        <h3 class="card-title fs-5">Cappuccino <span class="badge bg-danger">hot</span></h3>
        <p class="card-text">Equal parts espresso, steamed milk, and foam art we're proud of.</p>
      </div>
    </article>
  </div>
  <div class="col-md-6 col-lg-4">
    <article class="card h-100">
      <div class="card-body">
        <h3 class="card-title fs-5">Cold brew <span class="badge bg-info text-dark">cold</span></h3>
        <p class="card-text">Steeped 18 hours. Stronger than your deadline.</p>
      </div>
    </article>
  </div>
  <div class="col-md-6 col-lg-4">
    <article class="card h-100">
      <div class="card-body">
        <h3 class="card-title fs-5">Chai latte <span class="badge bg-danger">hot</span></h3>
        <p class="card-text">House spice mix, oat milk by default.</p>
      </div>
    </article>
  </div>
  <div class="col-md-6 col-lg-4">
    <article class="card h-100">
      <div class="card-body">
        <h3 class="card-title fs-5">Blueberry muffin <span class="badge bg-success">food</span></h3>
        <p class="card-text">Baked mornings; gone by noon.</p>
      </div>
    </article>
  </div>
  <div class="col-md-6 col-lg-4">
    <article class="card h-100">
      <div class="card-body">
        <h3 class="card-title fs-5">Bagel &amp; schmear <span class="badge bg-success">food</span></h3>
        <p class="card-text">Toasted, with plain or scallion cream cheese.</p>
      </div>
    </article>
  </div>
  ```

  </details>
- [ ] **✓ resize:** 1 → 2 → 3 columns; `h-100` keeps heights even

### Form

- [ ] The `<h2>` — same two classes as the menu heading

  ```diff
  -    <h2 id="contact">Get in touch</h2>
  +    <h2 id="contact" class="mt-5 mb-4">Get in touch</h2>
  ```
- [ ] Add the alert directly under that `<h2>`, above the `<form>`

  ```diff
  +    <div class="alert alert-info">This form is not wired up yet — forms start working in week 6.</div>
  ```
- [ ] Select **the alert, the whole form, and the back-to-top line under it** → **Wrap with Abbreviation** → `div.row>div.col-md-8` (one abbreviation, both divs) — the column is what stops a text input stretching across a 27-inch monitor

  ```diff
  +    <div class="row">
  +      <div class="col-md-8">
         <div class="alert alert-info">This form is not wired up yet — forms start working in week 6.</div>
         <form>
           …the whole form…
         </form>
         <p><a href="#home">Back to top ↑</a></p>
  +      </div>
  +    </div>
  ```
- [ ] First field, by hand: select the label + input → **Wrap with Abbreviation** → `div.mb-3` · then the two classes (the `for`/`id` wiring is already there — plain-HTML accessibility, not Bootstrap)

  ```diff
  -      <label for="name">Name</label>
  -      <input type="text" id="name">
  +      <div class="mb-3">
  +        <label for="name" class="form-label">Name</label>
  +        <input type="text" class="form-control" id="name">
  +      </div>
  ```
- [ ] Paste the remaining fields — copy from here (`select` → `form-select`, button → `btn btn-primary`):

  <details><summary>📋 Email, dropdown, message, button</summary>

  ```html
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email">
  </div>
  <div class="mb-3">
    <label for="topic" class="form-label">What's this about?</label>
    <select class="form-select" id="topic">
      <option selected>Choose…</option>
      <option>Catering an event</option>
      <option>Study group reservation</option>
      <option>Feedback</option>
    </select>
  </div>
  <div class="mb-3">
    <label for="message" class="form-label">Message</label>
    <textarea class="form-control" id="message" rows="3"></textarea>
  </div>
  <button type="submit" class="btn btn-primary">Send</button>
  ```

  </details>

### Footer & polish

- [ ] 🎞️ **GO TO SLIDE 10** — *Utilities: the classes that replace custom CSS*. Everything in this beat is utilities
- [ ] 🎯 **Read the last line off the slide — it is a lab rule with points on it:** *"if you are writing custom CSS for spacing or alignment, there is almost certainly a utility for it already. Tonight that is a house rule, not advice — custom CSS beyond the font override costs you a point, and the self-check warns you about it"*
- [ ] `<footer>` and its `p`

  ```diff
  -  <footer>
  -    <p>© 2026 Common Grounds Coffee · campus & main</p>
  +  <footer class="text-center text-muted py-4 border-top">
  +    <p class="mb-0">© 2026 Common Grounds Coffee · campus & main</p>
     </footer>
  ```
- [ ] Both back-to-top `<p>`s — one above the form, one below it

  ```diff
  -    <p><a href="#home">Back to top ↑</a></p>
  +    <p class="text-end mt-3"><a href="#home" class="text-muted text-decoration-none">Back to top ↑</a></p>
  ```

### Icons *(slide 11)*

- [ ] 🎞️ **GO TO SLIDE 11** — *Icons: Bootstrap Icons*
- [ ] *"One more `<link>`, same CDN pattern as the top of the night. Two thousand icons and not a single image file to download"*
- [ ] Add to `<head>`, straight under the Bootstrap CSS link

  ```diff
  +  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  ```
- [ ] Now two `<i>`s, in two places you've already been. The hero button first — `Ctrl+F` for `DEMO 1 · container and hero`

  ```diff
  -      <a href="#menu" class="btn btn-primary btn-lg mt-2">See the menu</a>
  +      <a href="#menu" class="btn btn-primary btn-lg mt-2"><i class="bi bi-cup-hot"></i> See the menu</a>
  ```
- [ ] Then the footer text — `Ctrl+F` for `DEMO 2 · footer & polish`

  ```diff
  -    <p class="mb-0">© 2026 Common Grounds Coffee · campus & main</p>
  +    <p class="mb-0"><i class="bi bi-cup-hot"></i> © 2026 Common Grounds Coffee · campus & main</p>
  ```
- [ ] The showpiece — one icon `<div>` above each feature heading:
  ```html
  <div class="fs-1 text-danger"><i class="bi bi-fire"></i></div>    <!-- roasted -->
  <div class="fs-1 text-success"><i class="bi bi-wifi"></i></div>   <!-- study -->
  <div class="fs-1 text-info"><i class="bi bi-moon-stars"></i></div><!-- late -->
  ```
- [ ] **✓ say it:** "two utility classes turn a character into artwork"

## 3 · Bootswatch *(slide 12)*

- [ ] 🎞️ **GO TO SLIDE 12** — *Bootswatch: stop looking like every Bootstrap site*
- [ ] 🎯 **Point at the one line on the slide — the CSS link:** *"the whole site re-skins onto a different palette, different type, different button shapes, and that link is the only line that changes. That is what a framework buys you"*
- [ ] Show the gallery at [bootswatch.com](https://bootswatch.com) — this is where "take requests" shops
- [ ] Replace the Bootstrap `<link>` with the Bootswatch CDN version (the site itself only offers downloads — the CDN pattern is ours to teach):
  ```html
  <link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/flatly/bootstrap.min.css" rel="stylesheet">
  ```
- [ ] Swap themes by changing **just the theme name in the path** (`flatly` → `darkly` → `sketchy`…), refreshing between each: `flatly` → `darkly` → `sketchy` (laugh) → take requests
- [ ] Land on `lux` (the finished page's theme)
- [ ] **✓ say it:** nothing else changed — same classes, same docs
- [ ] Dark-mode flip: DevTools → `<html>` → add `data-bs-theme="dark"`. One attribute; the toggle button is a lab stretch goal
- [ ] **✓ let them spot it:** the hero is still a glowing light band. Why? `bg-light` means *literally light, in every theme* — it said so all along
- [ ] Fix live: hero `bg-light` → `bg-body-tertiary` ("slightly offset from the page background" — theme-aware). Flip dark/light again: now the whole page adapts. **Semantic names > literal names, part two**
- [ ] Bonus observation if anyone asks about icon colors: `text-primary` under Lux is **near-black** (Lux's whole look) — a `text-primary` icon would vanish in dark mode. Semantic colors belong to the *theme*; that's the feature working as designed

## 4 · Google Fonts *(slide 13)*

- [ ] 🎞️ **GO TO SLIDE 13** — *Google Fonts: the finishing move*
- [ ] 🎯 **The concept before the shopping trip:** *"Bootstrap keeps its font in a CSS variable, so you never fight it — you set the variable and the whole site follows. Two families maximum, and only the weights you use. Those two are rules in this course, not taste"*
- [ ] On [fonts.google.com](https://fonts.google.com): pick **Lora** (400 + 700), copy the `<link>`, add to `<head>`
  — *(deliberately a serif: Lux's built-in font is Nunito Sans, so a sans swap would be invisible — pick something the room can SEE)*
- [ ] Then:
  ```html
  <style>
    :root { --bs-body-font-family: "Lora", Georgia, serif; }
  </style>
  ```
- [ ] **✓ prove it applied:** DevTools → select a paragraph → **Computed** panel → *Rendered Fonts* at the bottom says `Lora`. (Also show the Network tab's `fonts.gstatic.com` request — that's the font arriving.) This is how you check ANY font question forever
- [ ] **✓ FINAL CHECKPOINT** — your page matches the hosted [after](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/). Leave both on screen going into the lab launch

## 5 · Hand off to the lab *(slide 14)*

- [ ] 🎞️ **GO TO SLIDE 14** — *Lab: Bootstrap the site*. Leave it up for the whole lab; it's the task list
- [ ] Show **what done looks like** — the answer key **opened from disk on your own machine**: `week-02/lab/solution` in the answer-keys repo, `index.html` in the browser. Resize once so the navbar collapses, click through all three pages. ~90 seconds, a target not a walkthrough — **don't show the markup**. **Nothing is deployed for this** — GitHub Pages is their homework, not tonight
- [ ] Setup on screen, said once: **`cd dotnet-web-starters && git pull` → copy the `week-02` folder out, next to the clone → stay in `dotnet-web` and work there**
- [ ] Say plainly: **the checker is already wired into all three pages.** F12 on any page and it scores that page — *"work one ❌ at a time, and check all three; each page has its own list"*
- [ ] **In-class target: `index.html` fully green, plus that navbar copied to the other two pages.** The projects grid, the contact form and make-it-yours roll into homework Part 1 **by design** — say so out loud, so nobody reads a half-finished site as falling behind

## 6 · Wrap-up, after the lab *(slide 15)*

- [ ] 🎞️ **GO TO SLIDE 15** — *Before next week*. The homework, the deploy, and the reading
