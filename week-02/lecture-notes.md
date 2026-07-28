# Week 2 — Lecture Notes

## Part 1: Status check & why frameworks (25 min)

### Status check (5 min)

**No student work on the projector.** Showing each other's apps starts in week 5, once everyone has their own project to show. Tonight the five minutes go to triage:

- **Who's still fighting their environment?** Setup night was last week; anyone whose install is broken needs pairing with a neighbor *before* the live-coding starts, not during it.
- Say the point rather than projecting it: **everyone shipped something public last week**, which is already unusual for a course.
- For the "before picture," use **your own** [hosted unstyled coffee page](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/before.html) — it makes the same point as a wall of unstyled student pages, and it doesn't depend on anyone's deploy having worked.

### Why CSS frameworks (20 min)

Building a decent UI from scratch means hand-solving: consistent spacing/color/type, responsive layout, accessible components, and browser quirks. A CSS framework is a pre-made design system: battle-tested answers to all four, delivered as CSS classes.

Why Bootstrap specifically (vs Tailwind, Bulma, etc.): it's the one you'll meet in .NET shops — the MVC project template ships with it (week 5), and most internal line-of-business apps you'll maintain use it. Learn one framework well and the concepts transfer.

**The trade-off to name out loud:** default Bootstrap is recognizable at fifty paces. Tonight ends with Bootswatch + fonts precisely so nobody ships the default look.

### Setup — two tags

```html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <!-- content -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
```

- The **CSS** is the look. The **JS bundle** is behavior — navbar toggler, dropdowns, modals, tooltips.

> [!IMPORTANT]
> **The #1 lab bug tonight:** a missing JS-bundle tag — the navbar toggler just silently does nothing. Say it now; say it again at the lab launch.
- The `viewport` meta is what makes mobile rendering honest; without it, phones pretend to be 980px wide and nothing responsive works.
- We're using the **CDN** on purpose: zero install, great for static sites and Pages. In week 5 you'll meet the second delivery style — the MVC template ships Bootstrap *bundled locally* in `wwwroot/lib/`. Both are idiomatic; you'll have seen each where it belongs.

---

## Part 2: The grid (45 min live-code)

**Live-code the demo coffee-shop page (`demo/index.html` — work on a copy) while teaching.** It's deliberately different content from the lab, so students assemble their portfolio fresh instead of replaying your keystrokes. Keep the browser at half-width and resize constantly.

### The three-layer cake

```html
<div class="container">      <!-- centers content, sets max-width per breakpoint -->
  <div class="row">          <!-- a horizontal band of columns; handles gutters -->
    <div class="col-md-8">Main</div>
    <div class="col-md-4">Sidebar</div>
  </div>
</div>
```

> [!IMPORTANT]
> **Rules that prevent 90% of grid confusion:**
> - Columns live **directly inside rows**, rows live inside containers. A `col` outside a `row` misbehaves quietly.
> - Each row is 12 units wide. `col-md-8` + `col-md-4` = 12. Overflow wraps to the next line (sometimes what you want, often a bug).
> - Plain `col` = "share the space equally" — great for unknown counts.

### Mobile-first breakpoints

`col-md-6` reads as: *from the `md` breakpoint (≥768px) up, take 6 columns; below that, default to full width.*

```html
<div class="col-12 col-md-6 col-lg-4">…</div>
```

Phones: full width → tablets: half → laptops: a third.

> [!TIP]
> **Do this:** resize the window slowly and watch the columns reflow — that one line of classes *is* the responsive design lecture.

Breakpoints: `sm` 576, `md` 768, `lg` 992, `xl` 1200, `xxl` 1400. You'll use `md` and `lg` for nearly everything.

### Gutters and flex utilities

- `g-4` on the row controls gutter size (`gx-`/`gy-` for one axis). Card grids almost always want `g-4`.
- For one-off alignment jobs, skip the grid and use flex utilities: `d-flex justify-content-between align-items-center` — a navbar-ish bar in three classes. `gap-3` spaces flex children without margins.

**C# bridge for the room:** the grid is declarative layout — you describe *what* (8 columns at md+), never *how* (no pixel math). Same philosophy as Razor/LINQ: intent over mechanics.

---

## Part 3: Components & utilities (45 min live-code)

### The real skill: find → copy → adapt

Nobody memorizes navbar markup. Open getbootstrap.com/docs, search the component, copy the example, adapt content and classes.

> [!TIP]
> Model the find → copy → adapt workflow *explicitly* for every component tonight — the students who internalize docs-reading will cruise through the whole semester.

Walk these, in this order, into the coffee-shop page:

1. **Navbar** — copy the docs example with a toggler; shrink the window until it collapses into the hamburger. If clicking does nothing → JS bundle missing (told you).
2. **Cards in a grid** — the pattern of their lives:

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
  <!-- more col-md-4 cards -->
</div>
```

   `h-100` makes ragged-height cards equal.

> [!NOTE]
> **Week 8 preview — say it out loud:** each of these cards will be one row from their SQL Server database, stamped out by a Razor `foreach`.

3. **Buttons** — `btn btn-primary/secondary/outline-*`; sizes `btn-sm`/`btn-lg`. Semantic names (`danger`, not "red") — themes redefine the colors later tonight.
4. **Forms** — `form-label` + `form-control` per field, `form-select`, `form-check`. Just appearance tonight; these same classes wire into MVC model binding and validation styling in week 6 — this markup is a direct investment.

> [!NOTE]
> **Seen in the wild:** older tutorials wrap each field in `class="form-group"` — that's Bootstrap 4, removed in 5. The modern equivalent is exactly what we're typing: a plain `<div class="mb-3">` spacing wrapper. Same intent, utility class instead of special-purpose class.
5. **Alerts & badges** — `alert alert-warning`, `badge bg-success`. Ten seconds each.

### Utilities — the classes that replace custom CSS

- **Spacing:** `{m|p}{t|b|s|e|x|y}-{0..5}` → `mt-4`, `px-2`, `py-5`. The scale is rem-based and consistent — this is why Bootstrap sites feel tidy.
- **Text:** `text-center`, `fw-bold`, `text-muted`, `fs-4`.
- **Color:** `bg-primary`, `text-danger`, `bg-light` — semantic, theme-aware.

> [!IMPORTANT]
> **House rule: if you're writing custom CSS for spacing, alignment, or color, stop and check for a utility first.** Custom CSS is for identity (rare); utilities are for layout (constant).

### Bootstrap Icons (fold into the last 5 minutes of this segment)

Bootstrap's sibling icon library — one more CDN link, ~2,000 icons delivered as a font:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
```

```html
<i class="bi bi-github"></i>   <i class="bi bi-cup-hot"></i>   <i class="bi bi-envelope"></i>
```

- Because they're **font glyphs**, the text utilities you just taught style them for free: `fs-3` sizes, `text-danger` colors, no image files anywhere.
- Live-code on the coffee page: a `bi-cup-hot` inside the hero button, a `bi-github` in the footer — then the showpiece: an icon above each feature blurb (`bi-fire` / `bi-wifi` / `bi-moon-stars`) at `fs-1` with a `text-*` color. That's the proof they're font glyphs: two utility classes turn a character into artwork.
- [icons.getbootstrap.com](https://icons.getbootstrap.com) is searchable — same find → copy → adapt workflow, third time tonight.

---

## Part 4: Bootswatch (15 min)

Live demo with maximum theater: the site so far, in default Bootstrap. Swap one line —

```html
<link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/flatly/bootstrap.min.css" rel="stylesheet">
```

— refresh. Entire site re-skinned. Swap `flatly` → `darkly` → `sketchy` (always gets a laugh) → let the room call one out.

Three facts to land:

1. **Nothing else changed.** Same markup, same classes, same docs. Bootswatch is a *compiled* Bootstrap with different variables — your skills are 100% portable.
2. **Pin versions.** ⚠️ Bootswatch 5.3.x with Bootstrap 5.3.x markup — mixing majors is how you lose an evening.
3. **This is why we used semantic names.** `btn-primary` was blue in default, it's flat green in Flatly, it's crayon in Sketchy. Never name colors, name roles.

Week 5 callback (preview it now): swapping this same link inside `_Layout.cshtml` will re-theme an entire MVC app — one file, whole site. That's the payoff of layouts.

**One more flip while the room is warm:** open DevTools, add `data-bs-theme="dark"` to the `<html>` element — the whole site goes dark, live. That's Bootstrap 5.3 **color modes**, one attribute. A real toggle button is three lines of week-1 JS (it's a lab stretch goal), and it works with Bootswatch themes too.

**And the flip plants a deliberate bug:** the hero stays glowing light, because `bg-light` is *literal* — light in every theme. Let the room spot it, then fix it live: `bg-body-tertiary` ("slightly offset from the page background") is the theme-aware replacement, and the Bootstrap docs themselves migrated to it for this exact reason. It's the `btn-primary`-not-`btn-blue` argument, round two — name the role, not the appearance. (Related trap: under Lux, `text-primary` is near-black — a primary-colored icon vanishes in dark mode. The theme owns the semantic colors; pick roles whose theme values suit your surface.)

---

## Part 5: Google Fonts (15 min)

Many Bootswatch themes already pull a Google Font (Flatly ships Lato) — so you've been using this all evening. Now do it deliberately:

1. Browse fonts.google.com; pick a pairing (heading + body). Demo picking one live.
2. Copy the `<link>` tag it generates (choose only the weights you need — usually 400 + 700).
3. Point Bootstrap at it:

```css
:root {
  --bs-body-font-family: "Inter", system-ui, sans-serif;
}
h1, h2, h3, h4, h5, h6 { font-family: "Fraunces", Georgia, serif; }
```

Bootstrap reads its body font from the `--bs-body-font-family` CSS variable — override the variable, don't fight the framework. (First sighting of CSS custom properties; they'll reappear.)

> [!IMPORTANT]
> **Rules of taste (course-enforced):** two families max. Only the weights you use. Always keep the fallback stack after your font.

> [!NOTE]
> **Pro aside, one sentence:** fonts served from Google's CDN are a third-party request — there have been European privacy rulings about it — so many companies self-host font files instead; same fonts, different delivery.

---

## Wrap-up (10 min)

- **Tonight:** grid, components-from-docs, utilities, and a site that looks like *yours* — theme + fonts.
- **Homework:** personalize the lab site (your content, your theme, your fonts) and deploy to GitHub Pages. Plus: **activate Azure for Students** — takes 5 minutes, needs your school email, and week 3 doesn't work without it.
- **Next week:** how HTTP actually works (requests, responses, verbs, status codes), then `dotnet new mvc` — your first ASP.NET Core app, deployed to Azure the same night. C# land until finals.

---

## Appendix: common snags

**Navbar toggler does nothing** — the JS bundle `<script>` is missing or misspelled. It goes at the end of `<body>`.

**Columns don't sit side by side** — a `col-*` that isn't a direct child of a `row`, or widths summing past 12.

**Site isn't responsive on a real phone** — missing `<meta name="viewport" content="width=device-width, initial-scale=1">`.

**Bootswatch link works but looks broken** — version mismatch with the markup (check both are 5.3.x), or the link is placed *after* a plain Bootstrap link (last stylesheet wins).

**Google Font doesn't apply** — the `family=` name in the URL must match the `font-family` name exactly (spaces included); check DevTools → Network to confirm the font actually loaded.
