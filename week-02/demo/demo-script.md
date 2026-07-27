# Week 2 Demo Script — building Common Grounds live

The edit-by-edit cue sheet for transforming `index.html` (your scratch copy!) into `finished.html`. Steps are in lecture order and keyed to the slides. Type the *first* instance of every pattern; paste repeats from here or `finished.html`.

**Setup before class:** scratch copy of `index.html` open in VS Code + browser side by side (half-width — you'll resize constantly). The hosted [before](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/before.html) / [after](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/) pages in two tabs for the opening pitch.

## 1 · The grid *(slides 5–6)*

1. **Contain the page.** `<main>` → `<main class="container py-5">`
   *✓ margins appear; content stops hugging the edges.*
2. **Hero.** On `<header id="home">` → `class="text-center py-5 bg-light"`; wrap its contents in `<div class="container py-4">`; then `h1` → `class="display-4"`, `p` → `class="lead text-muted"`, the link → `class="btn btn-primary btn-lg mt-2"`.
   *✓ it suddenly looks like a website.*
3. **Feature row.** Wrap the three `<section>` blurbs in `<div class="row g-4 text-center">`; each section → `class="col-md-4"`; each `h2` → `class="fs-4"`, each `p` → `class="text-muted"`.
   *✓ CHECKPOINT — resize slowly: stacked on phone → thirds on desktop. This is the responsive lecture.*

## 2 · Components *(slides 7–10)*

4. **Navbar — from the docs, live.** Go to [docs → Navbar](https://getbootstrap.com/docs/5.3/components/navbar/), copy the example with a toggler, replace the plain `<nav>`. Adapt: brand → `Common Grounds` (`href="#home"`), links → Home `#home` (`.active`), Menu `#menu`, Visit `#visit`; keep `data-bs-target="#mainNav"` ↔ `id="mainNav"` matched. Use `navbar-expand-md bg-dark` + `data-bs-theme="dark"` on the nav.
   *✓ shrink the window — hamburger appears and **works** (the JS bundle is already at the bottom of the page — point at it).*
   *Optional theater: comment the bundle `<script>` out, click the dead hamburger, uncomment. That's the #1 lab bug, pre-lived.*
5. **Menu cards.** `<h2 id="menu">` → `class="mt-5 mb-4"`. Wrap the six `<article>`s in `<div class="row g-4">`. Transform **Espresso only, typing**:
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
   (the `<span>` becomes the badge — `bg-danger` hot · `bg-info text-dark` cold · `bg-success` food). Then paste the other five from `finished.html`.
   *✓ resize: 1 → 2 → 3 columns; `h-100` keeps them even.*
6. **Form.** `<h2 id="visit">` → `class="mt-5 mb-4"`. Wrap the form in `<div class="row"><div class="col-md-8">…`. Add above it: `<div class="alert alert-info">Ordering online comes in week 14 — for now this form is just for looks.</div>`. First field, typing: wrap in `<div class="mb-3">`, label → `class="form-label"` (+ `for`/`id`), input → `class="form-control"`. Paste the rest; `select` → `form-select`; button → `btn btn-primary`.
7. **Footer + polish utilities.** `<footer>` → `class="text-center text-muted py-4 border-top"`, its `p` → `class="mb-0"`. The two back-to-top `<p>`s → `class="text-end mt-3"`, their links → `class="text-muted text-decoration-none"`.
8. **Icons** *(slide 10)*. Add to `<head>`:
   ```html
   <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
   ```
   Then: `<i class="bi bi-cup-hot"></i>` inside the hero button and the footer text — and the showpiece, one icon `<div>` above each feature heading:
   ```html
   <div class="fs-1 text-danger"><i class="bi bi-fire"></i></div>    <!-- roasted -->
   <div class="fs-1 text-primary"><i class="bi bi-wifi"></i></div>   <!-- study -->
   <div class="fs-1 text-info"><i class="bi bi-moon-stars"></i></div><!-- late -->
   ```
   *✓ "two utility classes turn a character into artwork."*

## 3 · Bootswatch *(slide 11)*

9. Swap the Bootstrap `<link>` href through themes with maximum theater — refresh between each:
   `…bootswatch@5.3.3/dist/flatly/bootstrap.min.css` → `darkly` → `sketchy` (laugh) → take requests → land on `lux` (the finished page's theme).
   *✓ nothing else changed — same classes, same docs.*
10. **Dark mode flip.** DevTools → `<html>` → add `data-bs-theme="dark"`. Whole site goes dark. One attribute; toggle button is a lab stretch goal.

## 4 · Google Fonts *(slide 12)*

11. On [fonts.google.com](https://fonts.google.com) pick **Nunito** (400 + 700), copy the `<link>`, add to `<head>`, then:
    ```html
    <style>
      :root { --bs-body-font-family: "Nunito", system-ui, sans-serif; }
    </style>
    ```
    *✓ FINAL CHECKPOINT — your page should now match the hosted [after](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/) page. Leave both on screen going into the lab launch.*
