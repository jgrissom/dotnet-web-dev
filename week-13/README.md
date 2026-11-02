# Week 13 — Introduction to Web API

The night the app starts answering programs. Everything so far has been a page for a person; tonight the same data gets a second set of addresses under `/api`. An API controller answers with JSON in the address bar, and a minimal API endpoint does the same in one statement. Returning a truck with its specials dies with `A possible object cycle was detected`, which is the reason DTOs exist. A POST arrives from a one-file tester page and bad JSON is refused before the action starts. PUT and DELETE, promised since week 3, take the role from week 12, and a visitor gets a correct `401` with week 10's whole Missing page behind it until `UseWhen` keeps it off `/api`.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, adapting it to your own app, **troubleshooting section** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-13/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside answers in JSON* — picks up where week 12 left it; [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-13/demo/script.html) |
| In&nbsp;class,&nbsp;100&nbsp;min&nbsp;in&nbsp;six&nbsp;blocks | 🧪&nbsp;[lab/⁠](lab/) | *The Registry gets an API* — 5 `dotnet test` checks; 1/5 green out of the box; each block follows the part of the demo it practices, and all but the last end at an *In class, stop here* note (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check — the same checks the grader runs (14 of the 20 pts; **nothing runs on load — `recheck()` is the only path**; it changes none of their data, signs the browser out, and **can't see the admin succeed**) |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | Their own app answers in JSON: a list, one record with its related rows, a minimal count, and a POST and a DELETE that need their role; URL + repo via Canvas |

## What students walk out with

**An app with two sets of addresses, one for people and one for programs, and an API that week 14's JavaScript can call.** They can write an API controller and a minimal endpoint and say when each fits; say why returning a model with its related rows fails, and write DTOs for what goes out and what comes in; test any endpoint with the address bar and the tester; write `POST`, `PUT` and `DELETE` and name the status each answers with; put the same role on an API as on a page, and say why an API answers `401` and `403` where a page redirects; keep the Missing page off `/api`; and say why a JSON API needs no antiforgery token.

## 📋 Before class, don't forget

- **Deployed-app gallery** — 2–3 student Azure URLs picked in advance; 2 minutes each
- ⚠️ **Copy `week-13/demo-starter/Curbside` out of the private answer-keys repo**, set both secrets (`set` only — the id ships), then `dotnet ef database drop --force`, `dotnet ef database update`, **register Ada and Sam, and Ctrl+R** — **after your last rehearsal**. A rehearsal leaves a truck behind, and §5's new truck has to get id `8`
- **One integrated terminal** — `dotnet watch`
- ⚠️ **`Program.cs` needs Ctrl+R, twice: §3 and §6.** The terminal says so above `Hot reload succeeded`. There is no restart prompt tonight
- 🎯 **§4's cycle and §6's HTML behind a `401` are the night's two real lessons** — let each one land before the next paste
- **Week 13's lab README in a browser tab** — it goes on screen for all six lab blocks; there is no lab slide
- **`/api-tester.html` in a parked tab**
- ⚠️ **Say in the wrap-up that the self-check's red console lines are expected**
- Remind students to `git pull` the starters repo for the week-13 folder

**Prev:** [← Week 12 — Roles, Claims and Securing the Application](../week-12/README.md) · **Next:** Week 14 — Consuming your API *(coming)*
