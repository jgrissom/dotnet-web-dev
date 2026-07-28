# Week 4 — Routing & Razor: Pages Built From Data

The night the app stops being a page and becomes a system. Routing gets read *and edited*, a second controller appears out of pure convention, and Razor grows from `@DateTime.Now` into a full data-driven table. Lab is the *Cryptid Registry* — six legendary creatures with an Index, a Details, and an honest 404.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️ [lesson-plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep / in-class script | 📖 [lecture-notes.md](lecture-notes.md) | Full lecture content, predict-then-run answers, **troubleshooting appendix** |
| Projected in class | 🎞️ [slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-04/) (arrow keys, `F` for fullscreen) |
| In class, live-coding | 🎨 [demo/](demo/) | *Curbside* — a food-truck directory built live (different content than the lab); [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-04/demo/script.html) |
| In class, last 30 min | 🧪 [lab/](lab/) | *Cryptid Registry* — 6 `dotnet test` checks; 1/6 green out of the box (answer key in the private answer-keys repo) |
| With the homework | ✅ [homework-checks.js](homework-checks.js) | Student self-check — the same checks the grader runs (12 of the 20 pts) |
| Assigned at wrap-up | 📤 [homework.md](homework.md) | Your own list-and-details site, deployed to Azure; URL + repo via Canvas |

## What students walk out with

The full chain, end to end: **URL → route → action → data → Razor → HTML → browser.** They can add a controller from conventions alone, loop a collection into a table, and explain why a missing record should be a 404 instead of a 500.

## 📋 Before class, don't forget

- Queue 3–4 student Azure URLs from week 3's homework for the gallery walk
- Bring back the class **working regions** list — add any new wins/failures
- Scratch folder ready for the *Curbside* demo (see [demo/README.md](demo/README.md))
- ⚠️ The demo **breaks the route pattern twice on purpose** — the script flags both restores. Verify `/` still works before §2
- Remind students to `git pull` for the week-04 starter

**Prev:** [← Week 3 — Hello, Server](../week-03/README.md) · **Next:** Week 5 — Layouts & partials *(coming)*
