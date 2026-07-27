# Week 2 Demo Script — building Common Grounds live

Edit-by-edit cue sheet for transforming `index.html` (your **scratch copy**) into `finished.html`, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste repeats from `finished.html`.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/script.html) has working checkboxes that survive refreshes — keep it open on your second screen and tick as you go (Reset button at the top for next time).

## 0 · Before class

- [ ] Scratch copy of `demo/index.html` open in VS Code (Teaching profile) + browser at half-width
- [ ] Hosted [before](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/before.html) / [after](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/) open in two tabs for the opening pitch

## 1 · The grid *(slides 5–7)*

- [ ] `<main>` → `<main class="container py-5">` — margins appear, content stops hugging the edges
- [ ] Hero: `<header id="home">` → add `class="text-center py-5 bg-light"`
- [ ] Hero: wrap its contents in `<div class="container py-4">`
- [ ] Hero: `h1` → `display-4` · `p` → `lead text-muted` · link → `btn btn-primary btn-lg mt-2`
- [ ] **✓ it suddenly looks like a website** — pause and enjoy the reaction
- [ ] Feature row: wrap the three `<section>`s in `<div class="row g-4 text-center">`
- [ ] Each `<section>` → `class="col-md-4"` · each `h2` → `fs-4` · each `p` → `text-muted`
  — *multi-cursor trick:* select `<section>`, then **Ctrl+Shift+L** (**Cmd+Shift+L** on Mac) puts a cursor on *every* match — or **Ctrl+D** (**Cmd+D**) grabs them *one at a time* (safer when there might be matches off-screen; **Ctrl+K Ctrl+D** skips one, Esc collapses). Same trick for the `h2`s and `p`s (and the six `<article>`s later). Narrate it; students love this one
- [ ] **✓ CHECKPOINT: resize slowly** — stacked on phone → thirds on desktop. This *is* the responsive lecture

## 2 · Components *(slides 8–11)*

### Navbar — from the docs, live

- [ ] Open [docs → Navbar](https://getbootstrap.com/docs/5.3/components/navbar/), copy the example **with a toggler**, replace the plain `<nav>`
- [ ] Adapt: brand → `Common Grounds` (`href="#home"`); links → Home `#home` (`.active`), Menu `#menu`, Contact `#contact`
- [ ] Point out the matched pair the docs example came with: the toggler's `data-bs-target="#navbarSupportedContent"` ↔ the collapse div's `id="navbarSupportedContent"` (name varies by example). Keep the docs' name or rename it — but **always change both halves together**; mismatch = silently dead hamburger
- [ ] On the `<nav>`: `navbar-expand-md bg-dark` + `data-bs-theme="dark"`
- [ ] **✓ shrink the window** — hamburger appears and *works*; point at the JS bundle `<script>` that makes it work
- [ ] *(optional theater)* comment the bundle out → dead hamburger → uncomment. The #1 lab bug, pre-lived

### Menu cards

- [ ] `<h2 id="menu">` → `class="mt-5 mb-4"`
- [ ] Wrap the six `<article>`s in `<div class="row g-4">`
- [ ] Transform the **Espresso `<article>` in place** — evolve what's there, don't retype the content:
  1. wrap the whole article in `<div class="col-md-6 col-lg-4">`
  2. the article itself → `class="card h-100"`
  3. wrap its contents in `<div class="card-body">`
  4. `h3` → `class="card-title fs-5"` · `p` → `class="card-text"`
  5. the `<span>` already inside the `h3` → `class="badge bg-danger"` — one class, label becomes badge

  Destination:
  ```html
  <div class="col-md-6 col-lg-4">
    <article class="card h-100">
      <div class="card-body">
        <h3 class="card-title fs-5">Espresso <span class="badge bg-danger">hot</span></h3>
        <p class="card-text">Double shot, house blend. The reason this place exists.</p>
      </div>
    </article>
  </div>
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

- [ ] `<h2 id="contact">` → `class="mt-5 mb-4"`
- [ ] Wrap the form in `<div class="row"><div class="col-md-8">…</div></div>`
- [ ] Add above the form: `<div class="alert alert-info">Ordering online comes in week 14 — for now this form is just for looks.</div>`
- [ ] First field, typing: wrap in `<div class="mb-3">` · label → `form-label` · input → `form-control` (the `for`/`id` wiring is already there — plain-HTML accessibility, not Bootstrap)
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

- [ ] `<footer>` → `class="text-center text-muted py-4 border-top"` · its `p` → `mb-0`
- [ ] Back-to-top `<p>`s → `class="text-end mt-3"` · links → `text-muted text-decoration-none`

### Icons *(slide 11)*

- [ ] Add to `<head>`: `<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">`
- [ ] `<i class="bi bi-cup-hot"></i>` inside the hero button and the footer text
- [ ] The showpiece — one icon `<div>` above each feature heading:
  ```html
  <div class="fs-1 text-danger"><i class="bi bi-fire"></i></div>    <!-- roasted -->
  <div class="fs-1 text-success"><i class="bi bi-wifi"></i></div>   <!-- study -->
  <div class="fs-1 text-info"><i class="bi bi-moon-stars"></i></div><!-- late -->
  ```
- [ ] **✓ say it:** "two utility classes turn a character into artwork"

## 3 · Bootswatch *(slide 12)*

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
