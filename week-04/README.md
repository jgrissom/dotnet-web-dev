# Week 4 — Routing & Razor: Pages Built From Data

The night the app stops being a page and becomes a system. Routing gets read *and edited*, a second controller appears out of pure convention, and Razor grows from `@DateTime.Now` into a full data-driven table. Lab is the *Cryptid Registry* — the six creatures they hand-built in week 2, now with an Index, a Details, and an honest 404.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, predict-then-run answers, **troubleshooting appendix** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-04/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside* — a food-truck directory built live (different content than the lab); [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-04/demo/script.html) |
| In&nbsp;class,&nbsp;last&nbsp;30&nbsp;min | 🧪&nbsp;[lab/⁠](lab/) | *Cryptid Registry* — 6 `dotnet test` checks; 1/6 green out of the box (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check — included via `<script>` tag like a CDN; the same checks the grader runs (12 of the 20 pts) |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | Your own list-and-details site, deployed to Azure; URL + repo via Canvas |

## What students walk out with

The full chain, end to end: **URL → route → action → data → Razor → HTML → browser.** They can add a controller from conventions alone, loop a collection into a table, and explain why a missing record should be a 404 instead of a 500.

## 📋 Before class, don't forget

- Bring back the class **working regions** list — add any new wins/failures. *(No student apps on screen this week; showing their work starts in week 5, when every topic is different.)*
- `~/Repos/dotnet-web-dev-course-trial/instructor/` emptied for *Curbside* (week 3's app must not still be in it) — you create it **live** at the top of the routing segment (demo §0b, 60 seconds), since tonight's homework asks students to do the same thing
- ⚠️ The demo **breaks the route pattern twice on purpose** — the script flags both restores. Verify `/` still works before §2
- Remind students to `git pull` the starters repo for the week-04 folder

**Prev:** [← Week 3 — Hello, Server](../week-03/README.md) · **Next:** [Week 5 — Layouts & Partials →](../week-05/README.md)
