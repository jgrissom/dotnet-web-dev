# Week 5 — Layouts & Partials: The Site Shell

The night the app stops looking like a template. Every page you built last week arrived wrapped in a file you've pasted into but never read — tonight you take it over, break it on purpose, move its footer into a partial, and re-skin the entire site with one line. Lab is the *Cryptid Registry* again, but the app arrives finished: all the work is in `Views/`.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, predict-then-run answers, **troubleshooting appendix** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-05/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside* gets a shell — picks up where week 4 left it; [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-05/demo/script.html) |
| In&nbsp;class,&nbsp;last&nbsp;35&nbsp;min | 🧪&nbsp;[lab/⁠](lab/) | *The Registry gets a shell* — 6 `dotnet test` checks; 1/6 green out of the box (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check — included via `@section Scripts`; the same checks the grader runs (12 of the 20 pts) |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | Your own app gets the same shell, deployed to Azure; URL + repo via Canvas |

## What students walk out with

The shell, end to end: **one layout wraps every page, two files they'd never opened explain why, partials kill copy-paste, sections let a page reach outside itself, and one `<link>` re-skins the lot.** They can say where a view's HTML actually goes, and why breaking one file breaks the whole site.

## 📋 Before class, don't forget

- **The deployed-app gallery starts tonight** — week 4 promised it. Pick 3–4 student Azure URLs in advance; 2 minutes each
- Collect last week's reading: *"two things in `_Layout.cshtml` you'd change site-wide."* **Write them on the board** — they're the night's agenda
- **Copy `week-05/demo-starter/Curbside` out of the private answer-keys repo** to a scratch folder — it's Curbside exactly where week 4 left it. `dotnet watch`, then park three browser tabs on `/`, `/Trucks`, `/Trucks/Details/2`
- ⚠️ The demo **breaks the layout four times on purpose**, and each one takes down every page. The script flags all four restores — trust it
- Your finished Registry running + `dotnet test` at 6/6, for the lab launch
- Remind students to `git pull` for the week-05 starter

**Prev:** [← Week 4 — Routing & Razor](../week-04/README.md) · **Next:** Week 6 — Forms & validation *(coming)*
