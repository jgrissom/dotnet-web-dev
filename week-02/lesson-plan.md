# Week 2 — Lesson Plan

**Topic:** Bootstrap 5 — grid, components, utilities; Bootswatch themes; Google Fonts; deploy a styled site to GitHub Pages
**Session length:** 3h 45m

> The goal tonight is *taste plus speed*: students leave able to assemble a clean, responsive, personalized site in an hour using framework parts — the same skills they'll apply inside Razor layouts from week 5 on.

## Learning objectives

By the end of this session, students can:

1. Add Bootstrap to any page via CDN and explain what the CSS/JS bundles each provide.
2. Build responsive layouts with the grid (`container`, `row`, `col-*`) and breakpoint classes.
3. Assemble common components — navbar, cards, buttons, forms, alerts — from the docs.
4. Use spacing/color utilities instead of writing custom CSS for routine styling — and Bootstrap Icons instead of image files.
5. Re-theme a site with Bootswatch and a Google Fonts pairing, then deploy to GitHub Pages.

## Materials

- `slides.md` / `slides.html` — the deck (also hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` open on your second screen — the script, with the common-snags appendix
- Lab starter ships in the starters repo (`dotnet-web-starters/week-02/`, self-checking) — nothing to post
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — edit-by-edit build order, keyed to slide numbers; keep it beside the lecture notes
- **Demo canvas:** a fresh copy of [`demo/index.html`](demo/index.html) (the coffee-shop page — deliberately *not* the lab site); `demo/finished.html` is the rehearsal reference (hosted: [after](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/) · [before](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/before.html) — two tabs = the "why Bootstrap" pitch)
- Your own [hosted unstyled coffee page](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/before.html) open in a tab — that's tonight's "before picture," not student work

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 5 min | **Status check** *(deck on title slide)*. **No student work on the projector** — showing each other's apps starts in week 5, once everyone has their own project. Tonight is triage: who's still fighting their environment from setup night? Pair them with a neighbor whose install is green *before* the live-coding starts. Say the "everyone shipped something public last week" line out loud — it lands fine without a projector. |
| 0:05 | 20 min | **Why CSS frameworks; Bootstrap anatomy** *(slides 2–4)*. The problem Bootstrap solves (consistent, responsive, accessible-by-default UI without writing a design system). The two CDN tags: CSS bundle + JS bundle, and what needs which. Mobile-first mindset. |
| 0:25 | 45 min | **Live-code: the grid** *(slides 5–7)*. `container` vs `container-fluid`, `row`/`col`, auto vs numbered columns, breakpoints (`col-md-6` — resize the window constantly!), gutters, and the flex utilities (`d-flex`, `justify-content-*`, `align-items-*`). Build the demo coffee-shop page (`demo/index.html`) live — different content from the lab on purpose, so the lab stays a fresh build. |
| 1:10 | 10 min | **☕ Break** |
| 1:20 | 45 min | **Live-code: components & utilities** *(slides 8–11)*. Navbar (with toggler — resize to show it collapse), cards in a grid, buttons and button variants, a form with `form-control`/`form-label`, alerts, badges. Then the utility classes that replace 90% of custom CSS: spacing (`mt-4`, `p-3`, `gap-3`), text (`text-center`, `fw-bold`), color (`bg-*`, `text-*`). Close with **Bootstrap Icons** (one more link; font glyphs styled by text utilities — demo a `bi-cup-hot` button and `bi-github` footer). Teach *reading the docs* as the core skill: find → copy → adapt. |
| 2:05 | 10 min | **☕ Break** |
| 2:15 | 15 min | **Bootswatch** *(slide 12)*. Swap the CDN link to Flatly → Darkly → Sketchy live; the whole site re-skins with zero markup changes. Key points: class names stay standard Bootstrap (skills transfer, docs still apply), and **pin the Bootswatch version to the Bootstrap version** (both 5.3.x). |
| 2:30 | 15 min | **Google Fonts** *(slide 13)*. Pick a pairing on fonts.google.com, add the `<link>`, override `--bs-body-font-family` (and heading font). Rules: two families max, only the weights you use. One-sentence pro aside: Google-hosted fonts are a third-party request, so privacy-conscious companies often self-host. |
| 2:45 | 50 min | **Lab: Bootstrap the site** *(slide 14)*. Launch with ~90 seconds of *what done looks like*: the finished 3-page site on screen, resized once to show the navbar collapse — a target, not a walkthrough (don't show markup). Then students take the unstyled starter and work the checklist in `lab/README.md`. **Realistic in-class target: index.html fully green + navbar shared to all pages** — the rest rolls into homework Part 1 by design; say so out loud so nobody panics. Pairs fine; docs open is the whole point. |
| 3:35 | 10 min | **Wrap-up** *(slide 15)*. Homework: personalize + deploy to Pages. Preview week 3: HTTP, and their first ASP.NET Core MVC app — plus first Azure deploy, so **activate Azure for Students before next class** (link in homework). |

## Instructor notes

- ⏱️ **This is a long night to deliver, and the live-coding segments run over.** The lab's 50 minutes is the shock absorber, not a promise — if the grid and components segments eat into it, that's the design working. Dropping the gallery bought 10 minutes for exactly this. The lab can still bank its habit in 30, and it ships with a checker, so students who run out of room can finish it at home without you.
- Live-code with the window at half width and resize constantly — responsiveness only lands when they *see* columns reflow and the navbar collapse.
- Resist teaching CSS itself. When a student asks "how do I center this?", the answer is "search the Bootstrap docs for it" — building docs-reading reflexes now pays off all semester.
- The Bootswatch/fonts segments are deliberately late in the session: they're dessert, and they make the homework personal. Don't let them leak time from the grid segment, which is the load-bearing skill.
- Common lab snags: forgetting the JS bundle (navbar toggler silently does nothing), `col` outside a `row`, and the viewport `<meta>` tag missing (starter includes it — point it out).
- Week 3 needs Azure accounts active. The homework links the signup; mention it out loud twice.
