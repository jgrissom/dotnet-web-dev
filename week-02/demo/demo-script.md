# Week 2 Demo Script — building Common Grounds live

Edit-by-edit cue sheet for transforming `index.html` (your **scratch copy**) into `finished.html`, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste repeats from `finished.html`.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/script.html) has working checkboxes that survive refreshes — keep it open on your second screen and tick as you go (Reset button at the top for next time).

## 0 · Before class

- [ ] Scratch copy of `demo/index.html` open in VS Code (Teaching profile) + browser at half-width
- [ ] Hosted [before](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/before.html) / [after](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/) open in two tabs for the opening pitch

## 1 · The grid *(slides 5–6)*

- [ ] `<main>` → `<main class="container py-5">` — margins appear, content stops hugging the edges
- [ ] Hero: `<header id="home">` → add `class="text-center py-5 bg-light"`
- [ ] Hero: wrap its contents in `<div class="container py-4">`
- [ ] Hero: `h1` → `display-4` · `p` → `lead text-muted` · link → `btn btn-primary btn-lg mt-2`
- [ ] **✓ it suddenly looks like a website** — pause and enjoy the reaction
- [ ] Feature row: wrap the three `<section>`s in `<div class="row g-4 text-center">`
- [ ] Each `<section>` → `class="col-md-4"` · each `h2` → `fs-4` · each `p` → `text-muted`
  — *multi-cursor trick:* select `<section>`, then **Ctrl+Shift+L** (**Cmd+Shift+L** on Mac) puts a cursor on *every* match — or **Ctrl+D** (**Cmd+D**) grabs them *one at a time* (safer when there might be matches off-screen; **Ctrl+K Ctrl+D** skips one, Esc collapses). Same trick for the `h2`s and `p`s (and the six `<article>`s later). Narrate it; students love this one
- [ ] **✓ CHECKPOINT: resize slowly** — stacked on phone → thirds on desktop. This *is* the responsive lecture

## 2 · Components *(slides 7–10)*

### Navbar — from the docs, live

- [ ] Open [docs → Navbar](https://getbootstrap.com/docs/5.3/components/navbar/), copy the example **with a toggler**, replace the plain `<nav>`
- [ ] Adapt: brand → `Common Grounds` (`href="#home"`); links → Home `#home` (`.active`), Menu `#menu`, Visit `#visit`
- [ ] Point out the matched pair the docs example came with: the toggler's `data-bs-target="#navbarSupportedContent"` ↔ the collapse div's `id="navbarSupportedContent"` (name varies by example). Keep the docs' name or rename it — but **always change both halves together**; mismatch = silently dead hamburger
- [ ] On the `<nav>`: `navbar-expand-md bg-dark` + `data-bs-theme="dark"`
- [ ] **✓ shrink the window** — hamburger appears and *works*; point at the JS bundle `<script>` that makes it work
- [ ] *(optional theater)* comment the bundle out → dead hamburger → uncomment. The #1 lab bug, pre-lived

### Menu cards

- [ ] `<h2 id="menu">` → `class="mt-5 mb-4"`
- [ ] Wrap the six `<article>`s in `<div class="row g-4">`
- [ ] Transform **Espresso only, typing**:
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
- [ ] Paste the other five cards from `finished.html`
- [ ] **✓ resize:** 1 → 2 → 3 columns; `h-100` keeps heights even

### Form

- [ ] `<h2 id="visit">` → `class="mt-5 mb-4"`
- [ ] Wrap the form in `<div class="row"><div class="col-md-8">…</div></div>`
- [ ] Add above the form: `<div class="alert alert-info">Ordering online comes in week 14 — for now this form is just for looks.</div>`
- [ ] First field, typing: wrap in `<div class="mb-3">` · label → `form-label` (+ `for`/`id`) · input → `form-control`
- [ ] Paste the remaining fields · `select` → `form-select` · button → `btn btn-primary`

### Footer & polish

- [ ] `<footer>` → `class="text-center text-muted py-4 border-top"` · its `p` → `mb-0`
- [ ] Back-to-top `<p>`s → `class="text-end mt-3"` · links → `text-muted text-decoration-none`

### Icons *(slide 10)*

- [ ] Add to `<head>`: `<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">`
- [ ] `<i class="bi bi-cup-hot"></i>` inside the hero button and the footer text
- [ ] The showpiece — one icon `<div>` above each feature heading:
  ```html
  <div class="fs-1 text-danger"><i class="bi bi-fire"></i></div>    <!-- roasted -->
  <div class="fs-1 text-primary"><i class="bi bi-wifi"></i></div>   <!-- study -->
  <div class="fs-1 text-info"><i class="bi bi-moon-stars"></i></div><!-- late -->
  ```
- [ ] **✓ say it:** "two utility classes turn a character into artwork"

## 3 · Bootswatch *(slide 11)*

- [ ] Swap the Bootstrap `<link>` through themes, refreshing between each: `flatly` → `darkly` → `sketchy` (laugh) → take requests
- [ ] Land on `lux` (the finished page's theme)
- [ ] **✓ say it:** nothing else changed — same classes, same docs
- [ ] Dark-mode flip: DevTools → `<html>` → add `data-bs-theme="dark"`. One attribute; the toggle button is a lab stretch goal

## 4 · Google Fonts *(slide 12)*

- [ ] On [fonts.google.com](https://fonts.google.com): pick **Nunito** (400 + 700), copy the `<link>`, add to `<head>`
- [ ] Then:
  ```html
  <style>
    :root { --bs-body-font-family: "Nunito", system-ui, sans-serif; }
  </style>
  ```
- [ ] **✓ FINAL CHECKPOINT** — your page matches the hosted [after](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/). Leave both on screen going into the lab launch
