# Week 14 — Consuming Your API, Production, and Team Git

The night the pages call the API. Last week the app learned to answer programs; tonight its own pages are the program. A truck's menu opens under its card without leaving the list, a form adds a truck and lists the API's errors, and a button removes one. The form's first draft calls `.json()` on a `401`, which has no body, and that's the night's rule: read the status first. Then the same app run as Production can't find its connection string, a workflow builds every push on GitHub, and two clones of one repository change the same line on purpose.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, adapting it to your own app, **troubleshooting section** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-14/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside calls its own API* — picks up where week 13 left it; [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-14/demo/script.html) |
| In&nbsp;class,&nbsp;110&nbsp;min&nbsp;in&nbsp;seven&nbsp;blocks | 🧪&nbsp;[lab/⁠](lab/) | *The Registry calls its own API* — 5 `dotnet test` checks; 1/5 green out of the box; each block follows the part of the demo it practices, and the sixth is **team git, ungraded** (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check — the same checks the grader runs (12 of the 20 pts; **nothing runs on load — `recheck()` is the only path**; it only reads, opens the list page out of sight, leaves the browser signed in, and **can't see the add or the remove**) |
| Copied&nbsp;by&nbsp;the&nbsp;homework | 📄&nbsp;[list.js](list.js)&nbsp;·&nbsp;[deploy.yml](deploy.yml) | The script and the workflow students copy raw, each with ✏️ lines to change |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | **The last homework.** Their own list page calls their own API — related rows, an add and a remove — and a workflow deploys on every push; URL + repo via Canvas |

## What students walk out with

**A list page that talks to its own API, and an app that deploys when they push.** They can call an API with `fetch`, `async` and `await`, and say what `await` waits for; read the status before the body, and say which answers have none; change part of a page with `data-id`, one listener and `textContent`, and say why not `innerHTML`; send a form as JSON, list a `400`'s errors, and read a `201` back; confirm a DELETE with a GET; say what Production changes and where each secret lives; write a workflow that builds or tests every push, and one that deploys; and work through a branch, a pull request, a review and a merge conflict.

## 📋 Before class, don't forget

- **Deployed-app gallery** — 2–3 student Azure URLs picked in advance; 2 minutes each
- ⚠️ **Copy `week-14/demo-starter/Curbside` out of the private answer-keys repo**, set both secrets (`set` only — the id ships), then `dotnet ef database drop --force`, `dotnet ef database update`, **register Ada and Sam, and Ctrl+R** — **after your last rehearsal**. §3's new truck has to get id `8`
- ⚠️ **A private GitHub repository `curbside-week14`, with the starter's first commit pushed** — §5 and §6 run on it. After a rehearsal, delete it and the two folders, and make them again
- **Two integrated terminals** — `dotnet watch`, and one for `git`
- ⚠️ **No restarts tonight, and every save reloads the page by itself.** That's why §3's signed-out test and §4's second tab come after the last paste of their sections
- 🎯 **§3's `Unexpected end of JSON input` is the night's real lesson** — let the room answer *what was in the body of that 401?* before slide 4
- **Week 14's lab README in a browser tab** — it goes on screen for all seven lab blocks; there is no lab slide
- **Team git needs pairs** — and the README's *On your own* note for anyone without one
- Remind students to `git pull` the starters repo for the week-14 folder
- **Say this is the last homework**

**Prev:** [← Week 13 — Introduction to Web API](../week-13/README.md) · **Next:** [Week 15 — Dependency Injection, TempData, Paging, Filtering and Search →](../week-15/README.md)
