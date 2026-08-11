---
marp: true
theme: gaia
class: invert
paginate: true
style: |
  section pre {
    background: #151b23;
    border-radius: 8px;
  }
  section pre code {
    background: transparent;
    color: #e6edf3;
  }
  section pre .hljs-keyword { color: #ff7b72; }
  section pre .hljs-string { color: #a5d6ff; }
  section pre .hljs-title, section pre .hljs-title.function_ { color: #d2a8ff; }
  section pre .hljs-comment { color: #9198a1; font-style: italic; }
  section pre .hljs-attr, section pre .hljs-attribute { color: #79c0ff; }
  section pre .hljs-number, section pre .hljs-literal { color: #79c0ff; }
  section pre .hljs-built_in { color: #ffa657; }
  section pre .hljs-name { color: #7ee787; }
  section pre .hljs-selector-class, section pre .hljs-selector-pseudo { color: #7ee787; }
  section footer { color: #9fb2c1; font-size: 0.6em; opacity: 0.85; }
---

<!-- _paginate: false -->

# Week 2 — Bootstrap: Build Something That Looks Good

.NET Web Development · Week 2 of 16

---

<!-- _footer: '🖥️ Demo §0b' -->

## Tonight

1. Why CSS frameworks exist
2. **The grid** — responsive layout without writing CSS
3. **Components** — navbar, cards, forms, from the docs
4. **Utilities** — spacing, color, text helpers
5. **Make it yours** — Bootswatch themes + Google Fonts
6. Ship it to GitHub Pages

---

<!-- _footer: '🖥️ Demo §0b' -->

## Why a CSS framework?

Writing a design system from scratch means solving:

- Consistent spacing, colors, and type across every page
- Responsive behavior on every screen size
- Accessible components (keyboard nav, contrast, ARIA)
- Browser quirks

Bootstrap solves all four for the price of two `<link>`/`<script>` tags.
**Trade-off:** every default Bootstrap site looks the same — we fix that tonight too.

---

<!-- _footer: '🖥️ Demo §0b' -->

## Setup: two tags via CDN

```html
<!-- in <head> -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet">

<!-- last thing before </body> -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
</script>
```

- CSS = the look · JS bundle = behavior (toggler, dropdowns, modals)
- The viewport `<meta>` is required for responsive behavior
- Week 5: the *locally bundled* copy inside the MVC template

---

<!-- _footer: '🖥️ Demo §1 · container and hero' -->

## The grid: 12 columns, 6 breakpoints

```html
<div class="container">
  <div class="row">
    <div class="col-md-8">Main content</div>
    <div class="col-md-4">Sidebar</div>
  </div>
</div>
```

- `container` centers with margins; `row` starts a grid line; columns add to 12
- `col-md-8` = "8 of 12 columns *at medium screens and up*" — below that, full width

---

<!-- _footer: '🖥️ Demo §1 · the feature row' -->

## Breakpoints

**Mobile-first:** unprefixed = all sizes; prefixes add behavior at wider screens.

| Prefix | Min width | Think |
|--------|-----------|-------|
| *(none)* | 0 | phones |
| `sm` | 576px | big phones |
| `md` | 768px | tablets |
| `lg` | 992px | laptops |
| `xl` / `xxl` | 1200 / 1400px | desktops |

---

<!-- _footer: '🖥️ Demo §1 · the feature row' -->

## Reading a column recipe

```html
<div class="col-12 col-md-6 col-lg-4">…</div>
<!-- full width on phones, half on tablets, third on laptops -->
```

- Read it left to right: phones → tablets → laptops
- One line of classes = the whole responsive plan

---

<!-- _footer: '🖥️ Demo §2 · navbar' -->

## Components: assembled from the docs

The workflow — the *actual skill* of tonight:

1. **Find** it in the docs (getbootstrap.com → search "card")
2. **Copy** the example markup
3. **Adapt** the content and classes

Navbar · Cards · Buttons · Forms · Alerts · Badges — all tonight, all copy-adapt.

**No memorizing markup.** Professionals read docs.

---

<!-- _footer: '🖥️ Demo §2 · menu cards' -->

## Cards in a grid

```html
<div class="row g-4">
  <div class="col-md-4">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">Espresso</h5>
        <p class="card-text">Double shot, house blend.</p>
        <a href="#" class="btn btn-primary">Order</a>
      </div>
    </div>
  </div>
</div>
```

The pattern you'll use forever — week 8: each card = a **database row**.

---

<!-- _footer: '🖥️ Demo §2 · footer & polish' -->

## Utilities: the classes that replace custom CSS

```html
<h1 class="text-center mt-5">Centered, spaced</h1>
<div class="d-flex justify-content-between align-items-center p-3">
  <span class="fw-bold">Left</span>
  <span class="badge bg-success">Right</span>
</div>
```

- Spacing: `m`/`p` + side + size → `mt-4`, `px-2`, `gap-3` (scale 0–5)
- Text: `text-center`, `fw-bold`, `text-muted`
- Color: `bg-primary`, `text-danger`, …

If you're writing custom CSS for spacing or alignment, there's probably a utility.

---

<!-- _footer: '🖥️ Demo §2 · icons' -->

## Icons: Bootstrap Icons

One more `<link>` — 2,000+ icons, no image files:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      rel="stylesheet">
```

```html
<a href="#"><i class="bi bi-github"></i> GitHub</a>
<button class="btn btn-primary"><i class="bi bi-cup-hot"></i> Order</button>
```

- Icons are a **font** — style them with text utilities: `fs-3`, `text-danger`
- Names live at [icons.getbootstrap.com](https://icons.getbootstrap.com) — find → copy → adapt

---

<!-- _footer: '🖥️ Demo §3' -->

## Bootswatch: stop looking like every Bootstrap site

Swap **one line** — the CSS link:

```html
<link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/flatly/bootstrap.min.css"
      rel="stylesheet">
```

- 25+ free themes: bootswatch.com — Flatly, Darkly, Lux, Sketchy…
- All class names stay **standard Bootstrap** — your skills and the docs still apply
- **Pin the version** to your Bootstrap version (5.3.x ↔ 5.3.x)

---

<!-- _footer: '🖥️ Demo §4' -->

## Google Fonts: the finishing move

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
      rel="stylesheet">
```

```css
:root {
  --bs-body-font-family: "Inter", system-ui, sans-serif;
}
```

- Bootstrap reads its fonts from CSS variables — override, don't fight
- **Rules:** two families max (heading + body), only the weights you use
- Pro aside: a third-party request — privacy-minded firms self-host

---

<!-- _footer: '🖥️ Demo §5' -->

## Lab: Bootstrap the site

- Starter: an unstyled 3-page site (`lab/README.md` has the checklist)
- Navbar → hero → card grid → contact form → footer
- Then: pick your Bootswatch theme + font pairing
- **Docs open the whole time — that's the exercise**

**⏱️ 50 minutes**

---

<!-- _footer: '🖥️ Demo §6' -->

## Before next week

- ✅ Homework: personalize the site and **deploy it to GitHub Pages**
- ✅ **Activate your Azure for Students account** (link in homework) — week 3 is your first Azure deploy
- **Next week:** how HTTP actually works, then `dotnet new mvc` — C# land until finals
