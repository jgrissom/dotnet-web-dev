# Week 12 — Roles, Claims and Securing the Application

The night week 11's debt gets paid. Since week 11 a change needs an account, and anyone can make one; tonight it needs a **role**, one that only the site's owner hands out. `[Authorize]` becomes `[Authorize(Roles = "…")]` on the same class, and a signed-in stranger who clicks ＋ Add a truck lands on `/Account/AccessDenied` — Identity's other default, which nobody has written yet, so week 10's Missing page answers it. A seeder gives the role to the email in configuration, never in code — and the room watches the database say Ada is an admin while Ada is still refused, because her cookie is older than her role. Then the buttons nobody else can use disappear, the address bar shows why hiding one isn't the lock, the claims page shows the role sitting in the cookie, and one slide lists everything weeks 6–12 have secured between them.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, adapting it to your own app, **troubleshooting section** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-12/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside gets an admin* — picks up where week 11 left it; [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-12/demo/script.html) |
| In&nbsp;class,&nbsp;90&nbsp;min&nbsp;in&nbsp;seven&nbsp;blocks | 🧪&nbsp;[lab/⁠](lab/) | *The Registry gets a curator* — 6 `dotnet test` checks; 1/6 green out of the box; each block follows the part of the demo it practices, and all but the last end at an *In class, stop here* note (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check — the same checks the grader runs (14 of the 20 pts; **nothing runs on load — `recheck()` is the only path**; it signs in as week 11's self-check account, signs the browser out, and **can't see the admin succeed**) |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | Their own app gets a role of their choosing, an AccessDenied page, an admin named in configuration, and hidden buttons; URL + repo via Canvas |

## What students walk out with

**An app where an account is no longer enough to change anything — and a clear line between what a visitor sees and what they can do.** They can say why *signed in* is not trusted, and put a role on a controller's `[Authorize]`; say where Identity sends a signed-in visitor without the role, and write that page — view first; write a seeder that creates a role and hands it to the email in configuration, and say why neither the email nor any password belongs in code; say why a role granted to someone already signed in doesn't reach them until they sign in again; hide a write button with `User.IsInRole`, and say why that is a courtesy and the attribute is the lock; list a user's claims and point at the one a role becomes; and name what weeks 6–12 each secured, in one line apiece.

## 📋 Before class, don't forget

- **Deployed-app gallery** — 2–3 student Azure URLs picked in advance; 2 minutes each
- ⚠️ **Copy `week-12/demo-starter/Curbside` out of the private answer-keys repo**, set your connection string (`set` only — the id ships), check `dotnet user-secrets list` shows **no `Admin:Email`**, then `dotnet ef database drop --force`, `dotnet ef database update`, and **register `ada@example.com`** — **after your last rehearsal**. A rehearsal leaves the email secret, the Admin role and Sam behind
- **Two integrated terminals** — `dotnet watch` in the first, `dotnet user-secrets` in the second
- ⚠️ **The first restart prompt is in §3, at the new `AccessDenied.cshtml` — answer `a`.** §2's attribute edit hot-reloads; if Sam still gets the form, Ctrl+R
- 🎯 **§4's refusal after the role is granted is the night's real lesson** — let it land before you sign Ada out and back in
- **Week 12's lab README in a browser tab** — it goes on screen for all seven lab blocks; there is no lab slide
- **mssql extension** signed in and tested, panel closed — two appearances, both in §4
- ⚠️ **Say *hiding a link is not security* out loud in §5**, with Sam typing the URL
- Remind students to `git pull` the starters repo for the week-12 folder

**Prev:** [← Week 11 — ASP.NET Core Identity](../week-11/README.md) · **Next:** Week 13 — The flex week: services, TempData, paging and search *(coming)*
