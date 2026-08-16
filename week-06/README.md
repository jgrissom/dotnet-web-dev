# Week 6 — Forms & Validation

The night the app stops being a pamphlet. For five weeks data has only ever travelled one way — out of a list you typed by hand, through a view, onto a screen. Tonight it comes back: a form posts, model binding builds an object out of `name` attributes, annotations on the model say what "valid" means, and one guard decides whether any of it is allowed in. Then you add something, restart the app, and watch it vanish — which is next week's whole reason for existing.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, predict-then-run answers, **troubleshooting appendix** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-06/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside* takes orders — picks up where week 5 left it; [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-06/demo/script.html) |
| In&nbsp;class,&nbsp;last&nbsp;50&nbsp;min | 🧪&nbsp;[lab/⁠](lab/) | *The Registry takes reports* — 6 `dotnet test` checks; 1/6 green out of the box (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check — **it submits their form**; the same checks the grader runs (14 of the 20 pts) |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | Their own app gets a Create form, deployed to Azure; URL + repo via Canvas |

## What students walk out with

The round trip, end to end: **a form posts, binding fills an object by matching `name` attributes, annotations on the model describe what's valid, `ModelState.IsValid` is the guard that decides, and a redirect stops a refresh from filing it twice.** They can say why client-side validation is a courtesy and the server check is the real one — and they've watched a form be accepted with garbage in it because nobody read the rules.

## 📋 Before class, don't forget

- **Deployed-app gallery** — 2–3 student Azure URLs picked in advance; 2 minutes each. Week 5's themes make this a better-looking gallery than last week's
- Collect last week's reading: *"what do you think `_ValidationScriptsPartial.cshtml` is for?"* Take two guesses, **write them on the board**, and settle it at 2:15
- **Copy `week-06/demo-starter/Curbside` out of the private answer-keys repo** into `~/Repos/dotnet-web-dev-course/instructor/week-06/` — it's Curbside exactly as week 5's demo left it. `dotnet watch`, then park two browser tabs on `/Trucks` and `/Trucks/Details/2`
- **Open dev tools on the Network panel before you start.** You need it in §1 and again in §3
- ⚠️ The demo **breaks things four times**, and unlike week 5 none of them shows an error page — each produces a *wrong result* that looks fine. The script flags all four restores
- Your finished Registry with a working form + `dotnet test` at 6/6, for the lab launch
- Remind students to `git pull` the starters repo for the week-06 folder

**Prev:** [← Week 5 — Layouts & Partials](../week-05/README.md) · **Next:** [Week 7 — EF Core & SQL Server →](../week-07/README.md)
