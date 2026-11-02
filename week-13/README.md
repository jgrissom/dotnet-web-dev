# Week 13 — Dependency Injection, TempData, Paging, Filtering and Search

The flex week, and the polish night. The app works; tonight it gets easier to use, then easier to read. A curator adds a truck and the page says nothing, and `ViewData` can't fix that, because week 6's redirect is a second request — so `TempData` carries the message. The list gets a search box and a filter in the address bar, then pages, with `Skip` and `Take` in the one order that works. Then the index action has grown heavy enough to move: the query goes into a service behind an interface, the app refuses to start the page until the service is registered, and that error finally answers week 7's question of where `_context` has been coming from. **No table changes and no migration.** **In a 15-week semester this week is skipped, and nothing later depends on it.**

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, adapting it to your own app, **troubleshooting section** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-13/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside gets polished* — picks up where week 12 left it; [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-13/demo/script.html) |
| In&nbsp;class,&nbsp;95&nbsp;min&nbsp;in&nbsp;six&nbsp;blocks | 🧪&nbsp;[lab/⁠](lab/) | *The Registry gets polished* — 5 `dotnet test` checks; 1/5 green out of the box; each block follows the part of the demo it practices, and all but the last end at an *In class, stop here* note (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check — the same checks the grader runs (12 of the 20 pts; **nothing runs on load — `recheck()` is the only path**; it only reads, leaves the browser signed in, and **can't see the message or the service**) |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | Their own app gets a confirmation message, a search box, pages and one service; URL + repo via Canvas |

## What students walk out with

**A list a visitor can actually use, and an answer to where everything in a constructor comes from.** They can say why `ViewData` can't cross a redirect and use `TempData` instead; add a search and a filter with a GET form, so a result is a URL; build a query in stages and say when it runs; page a list in the one order that works, with a page number nobody can break; carry a search through its page links; move a query into a service behind an interface and register it; and say what the container is, what `AddTransient`, `AddScoped` and `AddSingleton` each give you, and why the seeder needed `CreateScope`.

## 📋 Before class, don't forget

- **Deployed-app gallery** — 2–3 student Azure URLs picked in advance; 2 minutes each
- ⚠️ **Copy `week-13/demo-starter/Curbside` out of the private answer-keys repo**, set your connection string and `Admin:Email` (`set` only — the id ships), then `dotnet ef database drop --force`, `dotnet ef database update`, `dotnet watch`, **register `ada@example.com`**, Ctrl+R, sign in again — **after your last rehearsal**. §4's page counts need exactly seven trucks at curtain
- **One integrated terminal** — `dotnet watch` owns it; nothing tonight needs a second
- ⚠️ **The one restart prompt is late: §5, at the `TrucksController` paste — answer `a`.** §2, §3 and §4 all hot-reload
- ⚠️ **In §5, delete `EmptyTruckService.cs` only after the `Program.cs` save has landed.** Both at once crashed `dotnet watch` on two runs of three
- 🎯 **§5's `Unable to resolve service` is the night's real lesson** — let the room read it before you open slide 5
- **Week 13's lab README in a browser tab** — it goes on screen for all six lab blocks; there is no lab slide
- **No mssql panel tonight** — nothing in the database changes shape
- Remind students to `git pull` the starters repo for the week-13 folder

**Prev:** [← Week 12 — Roles, Claims and Securing the Application](../week-12/README.md) · **Next:** Week 14 — Introduction to Web API *(coming)*
