# Week 11 — Lesson Plan

**Topic:** ASP.NET Core Identity — a users table, registration, signing in and out, `[Authorize]`, and a user class with a property of your own
**Session length:** 3h 45m

> The night the app learns who its visitors are. Since week 6 anybody with the URL could create, edit and delete; tonight a write needs an account. Three moments carry it: **§3's row with no password in it** (the room watches a password go in and a hash come out), **§5's 302** (the Network tab shows a stranger being sent to `/Account/Login` with the page they wanted written into the URL), and **§6's blank name** (an account made before the column existed reads *Signed in as* and nothing — week 10's empty state, met somewhere new). And one honest debt, said out loud in §5: **signed in is not trusted.** Anyone can create an account. Week 12 is roles.

## Learning objectives

By the end of this session, students can:

1. Say the difference between authentication (who are you?) and authorization (what may you do?), and which of the two tonight's `[Authorize]` actually decides.
2. Make a user class of their own that inherits `IdentityUser`, and say why it exists before it has anything in it.
3. Turn a context into an `IdentityDbContext<TUser>`, and say what `base.OnModelCreating` is doing there.
4. Read a migration that creates Identity's tables, and find the column that is **not** there — the password.
5. Write a register action with `UserManager.CreateAsync`, and get Identity's own error messages onto the page.
6. Say what the sign-in cookie is, find it in DevTools, and say what signing out does to it.
7. Write a sign-in action with `PasswordSignInAsync`, and say why its error message doesn't say which half was wrong.
8. Say why signing out is a POST and never a link.
9. Lock a controller with `[Authorize]` and open its reads with `[AllowAnonymous]`, and say why the attribute goes on the class.
10. Add a property to their own user class, migrate it, and show it in the navbar — with a fallback for accounts made before it existed.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to the slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-11/demo/script.html))
- **Curbside**, copied out of the private answer-keys repo (`week-11/demo-starter/Curbside`) into `~/Repos/dotnet-web-dev-course/instructor/week-11/` — week 10's demo end state: a front door of its own, no Privacy page, a Missing page, empty states — running under `dotnet watch`
- **Two copy-in folders**, `week-11/demo-section3/Curbside` and `week-11/demo-section4/Curbside` in the answer-keys repo — the Register pair, then Login and Logout, each copied over the running app with one `cp`
- ⚠️ **Your connection string set (`set` only — the `<UserSecretsId>` ships), then `dotnet ef database drop --force` and `dotnet ef database update` run before class *and again after your rehearsal*.** A rehearsal leaves Identity's seven tables built and an account called `ada@example.com` in them, and §2 has nothing left to create
- **Two integrated terminals** — `dotnet watch` owns the first; `dotnet ef` runs in the second
- **mssql extension** signed in, tested, panel closed — two appearances (§2, the empty `AspNetUsers` table and its columns; §3, the row the register form wrote, with a hash where a password would be)
- **2–3 student Azure URLs** picked in advance for the gallery
- **Week 11's lab README** open in a browser tab — it goes on screen for every lab block. There is no lab slide

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Deployed-app gallery** *(deck on title slide)*. 2–3 student midterm apps, **2 minutes each, hard stop**. |
| 0:10 | 15 min | **The hole** *(slides 1–2, demo §1)*. The agenda on the title slide, still up from the gallery. Then `/Trucks/Delete/1` as anybody — *nothing asked who I am*. Take two or three splits from the room (week 10's reading: which pages should anyone see, and which should need an account). Slide 2: **who are you** is tonight; **what may you do** is tonight only as *signed in or not* — the rest is week 12. |
| 0:25 | 8 min | **Lab A · Setup and task 1** *(no slide — the lab README on screen)*. The launch speech lives here: ⚠️ **the task-1 database drop, with the why — and the fence: never on their own project**, *the checks never touch SQL Server*, and the target, checks 1–5. **Stop at `Passed: 1`**, `/Cryptids` showing six. |
| 0:33 | 20 min | **Identity goes in** *(slide 3, demo §2)*. The package, pinned. An **empty** `AppUser : IdentityUser` — slide 3 is the reason it exists before it has anything in it. The context becomes `IdentityDbContext<AppUser>`, plus `base.OnModelCreating`. ⚠️ **The context edit is the night's first restart prompt** (`ENC0014`, a base class changed) — **answer `a`**. `Program.cs`: `AddIdentity`, `UseAuthentication`. Generate `AddIdentity` live and read it: **seven tables**, and `AspNetUsers` has a `PasswordHash` column and no password column. Apply it; mssql: the columns, no rows. ⚠️ **Restart with Ctrl+R**, not Ctrl+C — Ctrl+C starts a new `watch` session and forgets the `a`. |
| 0:53 | 15 min | **Lab B · Task 2**. The same moves on the Registry: `Member : IdentityUser`, the context, `Program.cs`, `AddIdentity`, update, restart. **Stop at `Passed: 2`.** |
| 1:08 | 10 min | **☕ Break** |
| 1:18 | 20 min | **Register** *(slides 4–5, demo §3)*. **Copy in the Register pair with one `cp`** and look at three lines only: `CreateAsync`, the loop that copies Identity's errors into `ModelState`, and `SignInAsync`. Register with `password` — **three real messages**, unstaged. Register properly: **the page doesn't change**, because there is no navbar yet. Slide 4, then the evidence: the `AspNetUsers` row, with a hash. DevTools → Application → Cookies → `.AspNetCore.Identity.Application`. Slide 5: *the cookie is the login*. |
| 1:38 | 15 min | **Lab C · Task 3**. Paste the three files, register with a weak password first, then a real one, and find the cookie. **Stop at `Passed: 3`.** |
| 1:53 | 15 min | **Signed in, signed out** *(slide 6, demo §4)*. **Copy in Login and Logout with one `cp`**, then paste `_LoginPartial` and its one line in `_Layout` live: *Signed in as ada@example.com*. Sign out — the cookie goes. Sign in with the wrong password — one message that doesn't say which half. Slide 6: the two rules. |
| 2:08 | 12 min | **Lab D · Task 4**. Login, Logout, the partial, the layout line. **Stop at `Passed: 4`.** |
| 2:20 | 10 min | **☕ Break** |
| 2:30 | 15 min | **`[Authorize]`** *(slides 7–8, demo §5)*. Slide 7 is the plan: **lock the controller, open the reads.** Type the two attributes on `TrucksController`; ⚠️ **if the page doesn't change, Ctrl+R** — an attribute is the kind of edit hot reload can report as applied when it isn't. Signed out, click **＋ Add a truck**: Network shows **`302` → `/Account/Login?ReturnUrl=%2FTrucks%2FCreate`**. Sign in — and land on the form. Paste the same lines on Dishes and Specials. Slide 8: **signed in is not trusted**. |
| 2:45 | 12 min | **Lab E · Task 5**. `[Authorize]` on `CryptidsController`, `[AllowAnonymous]` on Index and Details — and **nothing on `SightingsController`**: the reports are the public half. **Stop at `Passed: 5`** — the in-class target. |
| 2:57 | 15 min | **Customizing the user** *(no slide, demo §6)*. `DisplayName` on `AppUser`; generate `AddDisplayName` live (one `AddColumn` on `AspNetUsers`), update, Ctrl+R. Change the partial to show it — **Ada's navbar reads *Signed in as* and nothing**: her account is older than the column. Ask what week 10 would do with an empty value; add the fallback. Then the field on the form, and a new account that shows its name. |
| 3:12 | 13 min | **Lab F · Task 6**. `FieldName` on `Member`, the migration, the form, the partial. **Stop at `Passed: 6`.** |
| 3:25 | 10 min | **Lab G · Catch up, or the stretch** *(no check)*. Anyone with a red check finishes it; anyone at six prefills the sighting form's *Reported by* from their own `FieldName`. **No stop.** |
| 3:35 | 10 min | **Wrap-up** *(slide 9, demo §7)*. Five rows, one sentence each; **signed in is not trusted** gets the emphasis. Homework: the same six moves on their own app. ⚠️ Say what the self-check leaves behind — one account — and that **it signs their browser out**. Week 12: roles. |

> [!NOTE]
> **The table sums to exactly 225 minutes: 100 of demo, 85 of lab in seven blocks, 20 of break, and 20 of gallery and wrap-up.** The longest stretch of watching is **20 minutes — §2 and §3** — and every demo segment is followed by a lab block of its own, so no two segments run back to back. The breaks sit after Lab B and after Lab D. **If the night runs long, the minutes come out of §6's last beat (a second account, made only to show its name), not out of a break, and never out of a lab block.** **If the demo runs fast, the time goes to Lab G.**

## Instructor notes

- **The lab comes in seven blocks, each one right after the demo segment it practices.** Every block but the last ends at an **In class, stop here** note in the lab README — that is where students look, so it's where the stops live. The cue sheet's `## Lab` sections say what to say, what to watch for, and which note each block stops at. Lab G has no stop.
- **Students watch the demo; they don't type along.** Curbside lives only in the private answer-keys repo and the lab is a different app. Say it in the first minute.
- ⚠️ **The first restart prompt is in §2, not at the first new view.** Changing the context's base class to `IdentityDbContext<AppUser>` is an edit hot reload can't make — `watch` prints `ENC0014: Updating the base class and/or base interface(s) of class requires restarting the application` and asks. **Answer `a`**, and every later edit that needs a restart gets one by itself: `Program.cs`, both copy-ins, and the new partial. Measured on a pty-driven `dotnet watch`.
- ⚠️ **Restart with Ctrl+R, not Ctrl+C + `dotnet watch`.** Both rebuild the app, but Ctrl+C ends the `watch` session, and *Always* belongs to the session: measured, after a Ctrl+C restart in §2, §3's copy-in stopped and asked again — and until it was answered, `/Account/Register` was a 404. Ctrl+R keeps the session and the answer. Say this out loud in §2; the lab README says the same for terminal 1.
- ⚠️ **Restart after each `database update` (§2, §6), and say why.** EF Core builds its model once, at startup — the same reason as week 9. The edits before it print `Hot reload succeeded`, and that does not rebuild the model.
- 🎯 **§3's page doesn't change after registering, and that is the beat.** There is no navbar partial until §4, so a successful registration redirects to the same front page. The evidence is somewhere else: the row in `AspNetUsers` and the cookie in DevTools. Say *the page can't tell you yet* before anyone asks whether it worked.
- 🎯 **The weak-password failure is real.** `password` is refused with three messages — no non-alphanumeric character, no digit, no uppercase — and it's Identity's default rules, not anything staged. It is also the reason the error loop exists: without it, the form comes back and says nothing.
- **`UseAuthentication()` is written, but it is not what makes sign-in work.** ASP.NET adds the authentication middleware itself if it's missing — measured: deleting the line changes nothing. What does break is putting it **after** `UseAuthorization()`: the navbar then says *Signed in as …* while every locked page still sends you to sign in. If a student's navbar and their redirects disagree, ask to see `Program.cs` first.
- ⚠️ **Signed in is not trusted, and week 11 has to say it.** Anyone with the URL can create an account, so tonight's lock stops anonymous clicks and nobody else. That is deliberate — week 12 is roles — and it is the same debt-named-early rhythm weeks 6–10 ran on. Slide 8 is where it lands.
- ⚠️ **The Registry has two halves, and task 5 is where they appear.** Creatures are the curated archive — a member writes them. Reports are what the public files — **nobody signs in to file one**, and check 5 fails if `SightingsController` is locked. Their homework may or may not have a public half; *admin-only writes, public reads* is the general rule.
- **The lab's watch-fors are task 2 and task 5.** Task 2 is the one with a silent trap: leave out `base.OnModelCreating` and **every page fails** with *"The entity type 'IdentityPasskeyData' requires a primary key to be defined"* — check 1 included, because the app can't start. Task 5 is the one people get half right: `[Authorize]` on the GET actions hides the forms and leaves the POSTs open, and check 5's message says so.
- ⚠️ **If the build prints yellow `NU1902`/`NU1903` warnings and two `Msbuild failed` lines** — the `System.Security.Cryptography.Pkcs` advisory from week 9, which every SQL Server project in the course carries. Identity's package doesn't add to it or fix it. **Since 2026-10-18 both starters carry the fix**, so expect to skip §1's conditional beat. Students' own apps get it from the homework's first step — `dotnet add package System.Security.Cryptography.Pkcs --version 10.0.13`, from the folder with their `.csproj`.
- **Don't teach claims, roles, email confirmation, password reset, lockout or external logins.** Roles are next week. The rest are real features this course doesn't need, and the hand-written `AccountController` doesn't have them — the notes say so in one paragraph, for anyone who meets Microsoft's scaffolded pages in a search.
- **Nothing you show is deployed.** Curbside runs on localhost all night.
