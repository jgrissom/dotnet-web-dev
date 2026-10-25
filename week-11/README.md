# Week 11 — ASP.NET Core Identity

The night the app learns who its visitors are. Since week 6 anyone with the URL could create, edit and delete; tonight a change needs an account. A user class of the students' own goes in on top of `IdentityUser`, the context becomes an `IdentityDbContext`, and a migration builds seven tables — one of which has a `PasswordHash` column and no password column at all. A hand-written `AccountController` registers, signs in and signs out, the room watches the sign-in cookie appear and disappear in DevTools, and `[Authorize]` on a controller class sends a stranger to `/Account/Login` with the page they wanted written into the URL. Then the user gets a property of its own, and the first account on the site turns out to be older than the column. One debt is named out loud and left for week 12: **signed in is not trusted**, because anyone can make an account.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, adapting it to your own app, **troubleshooting section** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-11/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside gets members* — picks up where week 10 left it; [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-11/demo/script.html) |
| In&nbsp;class,&nbsp;85&nbsp;min&nbsp;in&nbsp;seven&nbsp;blocks | 🧪&nbsp;[lab/⁠](lab/) | *The Registry gets members* — 6 `dotnet test` checks; 1/6 green out of the box; each block follows the part of the demo it practices, and all but the last end at an *In class, stop here* note (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check — the same checks the grader runs (14 of the 20 pts; **nothing runs on load — `recheck()` is the only path**; it creates one account it reuses, and signs the browser out) |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | Their own app gets accounts, a lock on its writes, and a user property of its own; URL + repo via Canvas |

## What students walk out with

**An app that knows who its visitors are, and a clear view of what that does and doesn't protect.** They can say the difference between authentication and authorization; make a user class of their own on `IdentityUser` and say why it exists before it has anything in it; turn a context into an `IdentityDbContext` and say what `base.OnModelCreating` does there; find the column a migration leaves out — the password; register a user with `CreateAsync` and get Identity's own errors onto the page; find the sign-in cookie and say what signing out does to it; sign in with `PasswordSignInAsync` and say why its error doesn't say which half was wrong; say why signing out is a POST; lock a controller with `[Authorize]` and open its reads with `[AllowAnonymous]`; add a property to their own user and show it in the navbar, with a fallback for accounts older than the column; and say why *signed in* is not the same as *trusted*.

## 📋 Before class, don't forget

- **Deployed-app gallery** — 2–3 student Azure URLs picked in advance; 2 minutes each
- ⚠️ **Copy `week-11/demo-starter/Curbside` out of the private answer-keys repo**, set your secret (`set` only — the id ships), then `dotnet ef database drop --force` and `dotnet ef database update` — **after your last rehearsal**. A rehearsal leaves Identity's tables built and an account called `ada@example.com` in them
- **Two integrated terminals** — `dotnet watch` in the first, everything else in the second
- ⚠️ **The first restart prompt is in §2, at the context's base-class change — answer `a`.** And **every restart tonight is `Ctrl+R`**, not `Ctrl+C`: *Always* belongs to the `watch` session, and `Ctrl+C` ends it
- **Week 11's lab README in a browser tab** — it goes on screen for all seven lab blocks; there is no lab slide
- **mssql extension** signed in and tested, panel closed — three appearances (§2, the empty `AspNetUsers`; §3, the row with a hash in it; §6, the new `DisplayName` column)
- ⚠️ **Say *signed in is not trusted* out loud in §5.** Week 12 is roles
- Remind students to `git pull` the starters repo for the week-11 folder

**Prev:** [← Week 10 — The Midterm Project](../week-10/README.md) · **Next:** Week 12 — Roles, claims and securing the application *(coming)*
