# Week 2 — Lesson Plan

**Topic:** Bootstrap 5 — grid, components, utilities; Bootswatch themes; Google Fonts; deploy a styled site to GitHub Pages
**Session length:** 3h 45m

> The goal tonight is *taste plus speed*: students leave able to assemble a clean, responsive, personalized site in an hour using framework parts — the same skills they'll apply inside Razor layouts from week 5 on.

## Learning objectives

By the end of this session, students can:

1. Add Bootstrap to any page via CDN and explain what the CSS/JS bundles each provide.
2. Build responsive layouts with the grid (`container`, `row`, `col-*`) and breakpoint classes.
3. Assemble common components — navbar, cards, buttons, forms, alerts — from the docs.
4. Use spacing/color utilities instead of writing custom CSS for routine styling.
5. Re-theme a site with Bootswatch and a Google Fonts pairing, then deploy to GitHub Pages.

## Materials

- `slides.md` / `slides.html` — the deck (also hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` open on your second screen — the script, with the common-snags appendix
- Lab starter ships in this repo (`lab/starter/`, self-checking) — nothing to post
- A few student Pages URLs from week 1 homework queued up for the gallery walk

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 15 min | **Week 1 homework gallery walk** *(deck on title slide)*. Open 3–4 student Pages URLs on the projector (volunteers first). Triage any setup stragglers — pair them with a neighbor whose environment is green. |
| 0:15 | 20 min | **Why CSS frameworks; Bootstrap anatomy** *(slides 2–4)*. The problem Bootstrap solves (consistent, responsive, accessible-by-default UI without writing a design system). The two CDN tags: CSS bundle + JS bundle, and what needs which. Mobile-first mindset. |
| 0:35 | 45 min | **Live-code: the grid** *(slides 5–6)*. `container` vs `container-fluid`, `row`/`col`, auto vs numbered columns, breakpoints (`col-md-6` — resize the window constantly!), gutters, and the flex utilities (`d-flex`, `justify-content-*`, `align-items-*`). Build the lab site's homepage skeleton live. |
| 1:20 | 10 min | **☕ Break** |
| 1:30 | 45 min | **Live-code: components & utilities** *(slides 7–9)*. Navbar (with toggler — resize to show it collapse), cards in a grid, buttons and button variants, a form with `form-control`/`form-label`, alerts, badges. Then the utility classes that replace 90% of custom CSS: spacing (`mt-4`, `p-3`, `gap-3`), text (`text-center`, `fw-bold`), color (`bg-*`, `text-*`). Teach *reading the docs* as the core skill: find → copy → adapt. |
| 2:15 | 10 min | **☕ Break** |
| 2:25 | 15 min | **Bootswatch** *(slide 10)*. Swap the CDN link to Flatly → Darkly → Sketchy live; the whole site re-skins with zero markup changes. Key points: class names stay standard Bootstrap (skills transfer, docs still apply), and **pin the Bootswatch version to the Bootstrap version** (both 5.3.x). |
| 2:40 | 15 min | **Google Fonts** *(slide 11)*. Pick a pairing on fonts.google.com, add the `<link>`, override `--bs-body-font-family` (and heading font). Rules: two families max, only the weights you use. One-sentence pro aside: Google-hosted fonts are a third-party request, so privacy-conscious companies often self-host. |
| 2:55 | 40 min | **Lab: Bootstrap the site** *(slide 12)*. Launch with ~90 seconds of *what done looks like*: the finished 3-page site on screen, resized once to show the navbar collapse — a target, not a walkthrough (don't show markup). Then students take the unstyled starter and work the checklist in `lab/README.md`: navbar, hero, card grid, contact form, footer, then theme + fonts. Pairs fine; docs open is the whole point. |
| 3:35 | 10 min | **Wrap-up** *(slide 13)*. Homework: personalize + deploy to Pages. Preview week 3: HTTP, and their first ASP.NET Core MVC app — plus first Azure deploy, so **activate Azure for Students before next class** (link in homework). |

## Instructor notes

- Live-code with the window at half width and resize constantly — responsiveness only lands when they *see* columns reflow and the navbar collapse.
- Resist teaching CSS itself. When a student asks "how do I center this?", the answer is "search the Bootstrap docs for it" — building docs-reading reflexes now pays off all semester.
- The Bootswatch/fonts segments are deliberately late in the session: they're dessert, and they make the homework personal. Don't let them leak time from the grid segment, which is the load-bearing skill.
- Common lab snags: forgetting the JS bundle (navbar toggler silently does nothing), `col` outside a `row`, and the viewport `<meta>` tag missing (starter includes it — point it out).
- Week 3 needs Azure accounts active. The homework links the signup; mention it out loud twice.
