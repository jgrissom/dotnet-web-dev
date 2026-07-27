# Week 2 Lab — Bootstrap the Site

The `starter/` folder is a working but completely unstyled 3-page portfolio site: `index.html`, `projects.html`, `contact.html`. Your job is to turn it into something you'd show someone — using Bootstrap classes, not custom CSS.

**Time:** ~40 minutes in class. Finishing (and personalizing) is the homework.
**Docs open the whole time:** [getbootstrap.com/docs](https://getbootstrap.com/docs/5.3/) — find → copy → adapt is the exercise.

## Setup

1. Update your clone of the course repo, then copy this week out (work on the copy, never in the clone):
   ```bash
   cd dotnet-web-dev && git pull
   ```
2. Copy the `week-02/lab/starter` folder into your own projects folder and open your copy in VS Code.
3. The Bootstrap CSS + JS CDN tags are already in each page (and the viewport meta — don't delete it).
4. Open `index.html` in the browser; keep the window at half width and resize as you go.

> [!TIP]
> **Each page grades itself.** A checker (`portfolio-checks.js`) is already wired into all three pages — open the console (F12) and it scores *that page's* checklist ✅/❌, plus the "make it yours" items and warnings about custom-CSS deductions. Same rhythm as week 1: work one ❌ at a time, and check **all three pages** — each has its own list.

## The checklist

Work top to bottom. Each item names the docs page you need.

### All three pages
- [ ] **Navbar** ([docs: Components → Navbar](https://getbootstrap.com/docs/5.3/components/navbar/)) — brand + links to all three pages, collapses to a hamburger on small screens. Mark the current page's link `active`. Same navbar on every page.
- [ ] **Footer** — a `<footer>` with muted, centered text and comfortable vertical padding (utilities only: `text-center`, `text-muted`, `py-4`).
- [ ] **Icons** ([icons.getbootstrap.com](https://icons.getbootstrap.com)) — add the Bootstrap Icons `<link>` to every page and use at least one icon per page (the footer is a natural spot; a button or navbar brand also works).

### index.html
- [ ] **Hero** — big heading, lead paragraph (`display-4`, `lead`), and a button linking to the projects page. Center it and give it generous vertical space (`text-center`, `py-5`).
- [ ] **Feature row** — the three `<section>` blurbs become a responsive row: full width on phones, thirds on `md` and up.

### projects.html
- [ ] **Card grid** ([docs: Components → Card](https://getbootstrap.com/docs/5.3/components/card/)) — the six project blurbs become cards in a responsive grid (`row g-4`, `col-md-6 col-lg-4`), each with a title, text, and a button. Use `h-100` so the cards line up.
- [ ] **Badges** — give each card a topic badge (`badge` + a `bg-*` you choose).

### contact.html
- [ ] **Form** ([docs: Forms → Overview](https://getbootstrap.com/docs/5.3/forms/overview/)) — name, email, message fields with `form-label` + `form-control`, a `form-select` for "how did you hear about us", and a submit button. Keep the form ≤ 8 columns wide on `md`+ (grid inside the page!).
- [ ] **Alert** — an `alert alert-info` above the form saying it isn't wired up yet (that's week 6's problem).

### Make it yours (if time — otherwise it's homework)
- [ ] **Bootswatch** ([bootswatch.com](https://bootswatch.com)) — swap the Bootstrap CSS link for a theme you like, on all three pages. Keep the version at 5.3.x.
- [ ] **Google Fonts** ([fonts.google.com](https://fonts.google.com)) — one heading font, one body font. Override `--bs-body-font-family` as shown in [the lecture notes](../lecture-notes.md#part-5-google-fonts-15-min).

## 🆘 Stuck?

The Bootstrap docs are stop one — find → copy → adapt is the exercise. Stop two is this week's [lecture-notes.md](../lecture-notes.md): the same patterns with fuller explanations, plus a **common snags appendix** at the bottom (navbar toggler dead? columns stacking? it's probably in there).

## Rules

> [!IMPORTANT]
> - **No custom CSS** except the font override block — everything else is Bootstrap classes. If you're fighting it, you've missed a utility; search the docs.
> - Don't remove the viewport meta or the JS bundle script — if your navbar hamburger does nothing, a missing JS bundle tag is why.

## 🚀 Done early?

- Add a Bootstrap **modal** to a project card ("More details") — [docs: Components → Modal](https://getbootstrap.com/docs/5.3/components/modal/). It needs the JS bundle; now you know why it's there.
- Try `navbar-expand-sm` vs `navbar-expand-lg` — when does the hamburger appear? Why would you choose each?
- **Dark mode toggle** — Bootstrap 5.3 [color modes](https://getbootstrap.com/docs/5.3/customize/color-modes/): a button plus three lines of week-1 JS:
  ```html
  <button class="btn btn-outline-secondary" id="themeToggle">🌓</button>
  <script>
    document.querySelector("#themeToggle").addEventListener("click", () => {
      const html = document.documentElement;
      html.setAttribute("data-bs-theme", html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark");
    });
  </script>
  ```
