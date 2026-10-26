# Week 12 — Lesson Plan

**Topic:** Identity, part two — a role on the lock, the page a refused visitor lands on, who gets the role and where that's written down, hiding the buttons a visitor can't use, and the claims the sign-in cookie carries
**Session length:** 3h 45m

> The night week 11's debt gets paid. **Signed in is not trusted** — anyone can make an account — so tonight the lock asks *signed in as whom*. Three moments carry it: **§2's wrong page** (a signed-in stranger clicks ＋ Add a truck and lands on `/Account/AccessDenied`, which Curbside doesn't have, so week 10's *Keep on Truckin'* page answers), **§4's refusal that shouldn't happen** (the database says Ada is an Admin, and Ada is still refused — the role was read when she signed in, before she had it), and **§5's hidden button that isn't a lock** (Sam can't see ＋ Add a truck, types the URL anyway, and the attribute turns him away). And one rule, said out loud in §5: **hiding a link is not security; the attribute is.**

## Learning objectives

By the end of this session, students can:

1. Say why *signed in* is not enough to trust a visitor, and change a controller's `[Authorize]` to `[Authorize(Roles = "…")]`.
2. Say where Identity sends a signed-in visitor who lacks the role — `/Account/AccessDenied`, a default like `/Account/Login` — and write that page.
3. Write a seeder that creates a role and hands it to the email in configuration, and say why the email lives in user secrets and an app setting and never in code.
4. Say why granting a role to someone who is already signed in changes nothing until they sign in again.
5. Hide the buttons a visitor can't use with `User.IsInRole`, and say why that is not what protects the data.
6. Say what a claim is, list a signed-in user's claims, and point at the one a role becomes.
7. Name what weeks 6–11 already secured, and the one thing each of them protects.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to the slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-12/demo/script.html))
- **Curbside**, copied out of the private answer-keys repo (`week-12/demo-starter/Curbside`) into `~/Repos/dotnet-web-dev-course/instructor/week-12/` — week 11's demo end state: accounts, a navbar that knows who you are, and a sign-in-only `[Authorize]` on every write — running under `dotnet watch`
- ⚠️ **Your connection string set (`set` only — the `<UserSecretsId>` ships), then `dotnet ef database drop --force`, `dotnet ef database update`, and Ada registered through the form — before class *and again after your rehearsal*.** A rehearsal leaves an `Admin:Email` secret, an `Admin` role and a second account behind, and §4 has nothing left to show
- **Two integrated terminals** — `dotnet watch` owns the first; `dotnet user-secrets` runs in the second
- **mssql extension** signed in, tested, panel closed — two appearances, both in §4 (`AspNetRoles` empty, then the role and Ada's row in `AspNetUserRoles`)
- **2–3 student Azure URLs** picked in advance for the gallery
- **Week 12's lab README** open in a browser tab — it goes on screen for every lab block. There is no lab slide

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Deployed-app gallery** *(deck on title slide)*. 2–3 student apps from week 11, **2 minutes each, hard stop**. |
| 0:10 | 15 min | **The gap** *(slides 1–2, demo §1)*. The agenda on the title slide. Then the hole week 11 named: register `sam@example.com` live — a stranger with an email address — click **＋ Add a truck**, and the form opens. Slide 2: *signed in as whom*. |
| 0:25 | 8 min | **Lab A · Setup and task 1** *(no slide — the lab README on screen)*. ⚠️ **The task-1 database drop, with the why — and the fence: never on their own project.** Then **Join with your own email**: task 4 makes that account the curator. **Stop at `Passed: 1`.** |
| 0:33 | 15 min | **The role on the lock** *(slide 3, demo §2)*. `[Authorize]` → `[Authorize(Roles = "Admin")]` on `TrucksController`; ⚠️ **if the page doesn't change, Ctrl+R**. Ask first: *I'm signed in — what should happen instead of the sign-in page?* Sam clicks ＋ Add a truck: `/Account/AccessDenied` in the address bar, and *Keep on Truckin'* on the page. Ask second: *why that page?* — week 10's Missing page answers every 404. Slide 3 after the reveal. The same attribute on Dishes and Specials. |
| 0:48 | 12 min | **Lab B · Task 2**. `[Authorize(Roles = "Curator")]` on `CryptidsController`, and **nothing on `SightingsController`**. **Stop at `Passed: 2`.** |
| 1:00 | 10 min | **☕ Break** |
| 1:10 | 10 min | **AccessDenied** *(no slide, demo §3)*. **The view first** — `Views/Account/AccessDenied.cshtml` is the night's one restart prompt (`ENC0021`): **answer `a`**. Still a 404: there's no action yet. Then the action. Sam sees *Admins only*. |
| 1:20 | 10 min | **Lab C · Task 3**. The view, then the action. **Stop at `Passed: 3`.** |
| 1:30 | 22 min | **Who gets the role** *(slides 4–5, demo §4)*. Sign out Sam, sign in as Ada — refused too: **nobody** is an admin, and mssql shows `AspNetRoles` empty. Slide 4: the email lives in configuration. `dotnet user-secrets set "Admin:Email" "ada@example.com"`, paste `RoleSeeder.cs`, paste its three lines into `Program.cs` — `watch` restarts by itself. mssql: the role, and Ada's row in `AspNetUserRoles`. 🎯 **Ada clicks ＋ Add a truck — and is still refused.** Slide 5: the role is read when you sign in. Sign out, sign in — the form. |
| 1:52 | 15 min | **Lab D · Task 4**. The secret with **their own email**, the seeder, the three lines — and the refusal that doesn't make sense until they sign out and back in. **Stop at `Passed: 4`.** |
| 2:07 | 10 min | **☕ Break** |
| 2:17 | 15 min | **Hide what you can't use** *(slide 6, demo §5)*. `User.IsInRole("Admin")` around every write button on four views, pasted whole. Ada sees them; signed out, nobody does; Sam doesn't either. 🎯 **Sam types `/Trucks/Create` into the address bar — *Admins only*.** Slide 6: **hiding a link is not security; the attribute is.** |
| 2:32 | 12 min | **Lab E · Task 5**. The archive's buttons inside the `@if` — and **👁️ Report a sighting outside it**. **Stop at `Passed: 5`** — the in-class target. |
| 2:44 | 10 min | **A role is a claim** *(slide 7, demo §6)*. `/Account/Claims`: Ada's six rows, one of them `…/claims/role` = `Admin`. Sam's five. Slide 7: `User.IsInRole` reads that row. |
| 2:54 | 13 min | **Lab F · Task 6**. The claims page, with `[Authorize]` on its one action. **Stop at `Passed: 6`.** |
| 3:07 | 8 min | **What's already secured** *(slide 8, demo §7)*. Seven rows, weeks 6–12, each one line: what it is, what it stops. No code. |
| 3:15 | 20 min | **Lab G · Catch up, or the stretch** *(no check)*. Anyone red finishes; anyone at six links the navbar's *Signed in as* to their claims page. **No stop.** |
| 3:35 | 10 min | **Wrap-up** *(slide 9, demo §8)*. Five rows, one sentence each. Homework: the same four moves on their own app, with a role they choose. ⚠️ Say what the self-check can't see — **your admin succeeding** — and that it signs their browser out. |

> [!NOTE]
> **The table sums to exactly 225 minutes: 95 of demo, 90 of lab in seven blocks, 20 of break, and 20 of gallery and wrap-up.** The longest stretch of watching is **22 minutes — §4** — and every demo segment is followed by a lab block of its own, so no two segments run back to back. The breaks sit after Lab B and after Lab D. **If the night runs long, the minutes come out of Lab G and §7's last rows, not out of a break, and never out of a lab block before Lab E.** **If the demo runs fast, the time goes to Lab G.**

## Instructor notes

- **The lab comes in seven blocks, each one right after the demo segment it practices.** Every block but the last ends at an **In class, stop here** note in the lab README. The cue sheet's `## Lab` sections say what to say, what to watch for, and which note each block stops at. Lab G has no stop.
- **Students watch the demo; they don't type along.** Curbside lives only in the private answer-keys repo and the lab is a different app. Say it in the first minute.
- ⚠️ **The first restart prompt is in §3, at the first new view.** §2's attribute edit and §3's new action both hot-reload — measured on a pty-driven `dotnet watch`. Creating `Views/Account/AccessDenied.cshtml` prints `ENC0021: Adding attribute requires restarting the application` and asks. **Answer `a`**, and §4's `Program.cs` and §6's new view restart by themselves.
- ⚠️ **Restart with Ctrl+R, not Ctrl+C + `dotnet watch`** — same as week 11: *Always* belongs to the `watch` session.
- ⚠️ **An attribute edit can hot-reload as applied when it isn't**, and §2 is one. Measured twice, it applied both times — but the course has seen it go the other way. If Sam still gets the form after the edit, Ctrl+R, and say why.
- 🎯 **§4's refusal is the night's real lesson, and it is not staged.** The seeder runs at startup, gives Ada the role, and writes the row. Ada's cookie was made when she signed in, before she had it, and **the cookie is what `[Authorize]` reads**. Measured on the walk: the row exists, Ada's next request still goes to `/Account/AccessDenied`, and after sign-out and sign-in she gets the form. **Identity also re-checks the cookie against the database every 30 minutes by default**, so a role *can* arrive on its own — say "sign out and back in" as the reliable path, never "it never updates".
- ⚠️ **No migration tonight.** `AspNetRoles` and `AspNetUserRoles` have existed since week 11's `AddIdentity`. Measured: `dotnet ef migrations has-pending-model-changes` on the finished Curbside and the finished Registry both print *No changes have been made to the model since the last migration.*
- ⚠️ **From tonight the app touches the database the moment it starts.** The seeder runs before `Now listening on:`. Measured: no connection string → `The ConnectionString property has not been initialized`, exit in 2 s; an unreachable server → `SqlException … A network-related or instance-specific error`, exit after the timeout. Before tonight the app started and failed on the first page. **This is the frozen-lab-PC trap**: a wiped secret now stops the app outright. The lab's 🆘 says so.
- **The checks never see SQL Server, and they restart the app themselves.** Check 4 joins with an email, starts a *second* copy of the app with `Admin:Email` set to it, and signs in there — the same sequence as §4, done in memory. A student's own `Admin:Email` secret never reaches the checks.
- ⚠️ **The Registry has two halves, and tonight both are tested.** Creatures need a curator; **reports need nobody** — check 2 fails if `SightingsController` is locked, and check 5 fails if 👁️ *Report a sighting* is hidden.
- **The lab's watch-fors are task 4 and task 5.** Task 4: a student who sets the secret, restarts, and is still refused has done it right — they need to sign out and back in. A student who is *never* let in has a typo in the role name or the config key. Task 5: the sighting link swept into the `@if` with the others.
- **Don't teach policies, `[Authorize(Policy = …)]`, custom claims, a role-management page, or more than one admin.** One role, one admin, set by configuration, is the whole of tonight. The notes say so in one paragraph for anyone who meets the rest in a search.
- **Nothing you show is deployed.** Curbside runs on localhost all night.
