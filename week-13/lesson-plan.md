# Week 13 — Lesson Plan

**Topic:** Introduction to Web API — controllers versus minimal APIs, JSON, and testing endpoints
**Session length:** 3h 45m

> The night the app starts answering programs. Everything so far has been a page for a person; tonight the same data gets a second set of addresses under `/api`. Three moments carry it: **§4's cycle** (returning a truck with its specials loaded dies with `A possible object cycle was detected`, which is the reason DTOs exist), **§5's POST with no `ModelState` check** (`[ApiController]` refuses bad JSON with a 400 before the action starts), and **§6's right status with the wrong body** (a visitor gets a correct `401` with week 10's whole Missing page behind it). And one rule, said out loud in §8: **a DTO is what your API promises; your model is how you store it.**

## Learning objectives

By the end of this session, students can:

1. Say what a web API is, and write an API controller with `[ApiController]`, `[Route]` and `ControllerBase`.
2. Write a minimal API endpoint with `app.MapGet`, and say when a controller is the better choice.
3. Say why returning a model with its related rows fails, and write DTOs for output and input.
4. Test any endpoint: GETs in the address bar, and writes with the tester page.
5. Write `POST`, `PUT` and `DELETE` actions, and name the status each answers with: `201`, `204`, `400`, `404`.
6. Protect an API with the same role as the pages, and say why it answers `401` and `403` where a page redirects.
7. Keep week 10's Missing page off `/api`, and say why it was there.
8. Say why a JSON API doesn't use an antiforgery token.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to the slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-13/demo/script.html))
- **Curbside**, copied out of the private answer-keys repo (`week-13/demo-starter/Curbside`) into `~/Repos/dotnet-web-dev-course/instructor/week-13/` — week 12's demo end state plus `wwwroot/api-tester.html` — running under `dotnet watch`
- ⚠️ **Both secrets set, then `dotnet ef database drop --force`, `dotnet ef database update`, Ada and Sam registered through the form, and Ctrl+R — before class *and again after your rehearsal*.** A rehearsal leaves a truck behind, and §5's new truck has to get id `8`
- **One integrated terminal** — `dotnet watch`. Nothing else runs in a terminal tonight
- **2–3 student Azure URLs** picked in advance for the gallery
- **Week 13's lab README** open in a browser tab — it goes on screen for every lab block. There is no lab slide

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Deployed-app gallery** *(deck on title slide)*. 2–3 student apps from week 12, **2 minutes each, hard stop**. |
| 0:10 | 12 min | **One request, two answers** *(slides 1–2, demo §1)*. The agenda. View Source on `/Trucks`: the trucks are in there somewhere. Slide 2: the same truck as JSON. |
| 0:22 | 8 min | **Lab A · Setup and task 1** *(no slide — the lab README on screen)*. **No database drop tonight.** Sign in as their curator. **Stop at `Passed: 1`.** |
| 0:30 | 12 min | **The first endpoint** *(slide 3, demo §2)*. `TrucksApiController` with `GetAll`. Seven trucks in the address bar. `"specials":[]` noticed and left. Slide 3: two kinds of controller. |
| 0:42 | 8 min | **The same thing, minimal** *(slide 4, demo §3)*. `app.MapGet("/api/trucks/count", …)`. ⚠️ **`Program.cs` needs Ctrl+R.** Slide 4: when each one fits. |
| 0:50 | 12 min | **Lab B · Task 2**. The archive as JSON, with `reportCount`, and the minimal count. **Stop at `Passed: 2`.** |
| 1:02 | 10 min | **☕ Break** |
| 1:12 | 15 min | **One truck, with its menu** *(slide 5, demo §4)*. 🎯 **The cycle.** Slide 5: the loop, and DTOs. `SpecialDto`, `TruckDto`, `ToDto`. The menu arrives. `/api/trucks/999` is a 404 in JSON. |
| 1:27 | 12 min | **Lab C · Task 3**. One creature with its reports. **Stop at `Passed: 3`.** |
| 1:39 | 15 min | **Testing a write** *(slide 6, demo §5)*. The tester. Ada signs in. `TruckInput`, the role on the class, the POST. 🎯 **`201`, then a `400` with no `ModelState` check, then an `id` that gets ignored.** Slide 6: verbs and statuses. |
| 1:54 | 15 min | **Lab D · Task 4**. The public POST, and the creature lookup the demo didn't need. **Stop at `Passed: 4`.** |
| 2:09 | 10 min | **☕ Break** |
| 2:19 | 15 min | **Who may write** *(slide 7, demo §6)*. PUT and DELETE. Signed out: 🎯 **a `401` with the Missing page behind it.** Sam: a `403`. Slide 7. `UseWhen`, ⚠️ **Ctrl+R**, and the status alone. |
| 2:34 | 15 min | **Lab E · Task 5**. PUT and DELETE for curators, the plate left alone, and the Missing page off `/api`. **Stop at `Passed: 5`** — all five, the in-class target. |
| 2:49 | 8 min | **Why no token** *(slide 8, demo §7)*. No code. |
| 2:57 | 38 min | **Lab F · Catch up, or the stretch** *(no check)*. Anyone red finishes; anyone at five builds a curator's POST. **No stop.** |
| 3:35 | 10 min | **Wrap-up** *(slide 9, demo §8)*. One sentence per row. Homework: the same moves on their own app. ⚠️ Say what the self-check can't see — **your admin succeeding** — that it signs their browser out, and that its red console lines are expected. |

> [!NOTE]
> **The table sums to exactly 225 minutes: 85 of demo, 100 of lab in six blocks, 20 of break, and 20 of gallery and wrap-up.** The longest stretch of watching is **20 minutes — §2 and §3**, which run back to back because they are two ways of writing one thing and share Lab B. The breaks sit after Lab B and after Lab D. **If the night runs long, the minutes come out of Lab F and §7, not out of a break, and never out of a lab block before Lab E.** **If the demo runs fast, the time goes to Lab F.**

## Instructor notes

- **The lab comes in six blocks, each one right after the demo segment it practices.** Every block but the last ends at an **In class, stop here** note in the lab README. The cue sheet's `## Lab` sections say what to say, what to watch for, and which note each block stops at. Lab F has no stop.
- **Students watch the demo; they don't type along.** Curbside lives only in the private answer-keys repo and the lab is a different app. Say it in the first minute.
- ⚠️ **There is no restart prompt tonight**, because nothing adds a view. Measured on a pty-driven `dotnet watch`, one save per paste: new controllers, new DTOs and whole-file controller pastes all print `Hot reload succeeded` and go live. **The exception is `Program.cs`, in §3 and §6:** the terminal prints `Press "Ctrl + R" to restart.` above `Hot reload succeeded`, and the page stays a 404 until you press it. It runs once at startup, so hot reload can't run it again.
- ⚠️ **§5's attribute hot-reloaded in both measured runs**, and an attribute is the kind of edit that can report as applied when it isn't. The sheet carries the Ctrl+R in case it does.
- 🎯 **§4's cycle only happens because of `Include`.** §2's list returns the same `Truck` class and works, with `"specials":[]`. Don't let anyone conclude that returning a model always fails; it fails once the related rows are loaded. The DTO is the better design either way.
- ⚠️ **The status and the body are two different things, and §6 turns on it.** Measured on .NET 10: `[ApiController]` turns the cookie's redirect into a `401` or a `403`. Without it, the same request is a `302` to the sign-in page. With it, `UseStatusCodePagesWithReExecute` still runs on the empty response and prints the Missing page behind the correct status. `UseWhen` stops that.
- **A `401` still carries a `Location` header naming `/Account/Login`.** It's harmless and the tester shows it. If someone asks: a program ignores it, because the status is the answer.
- ⚠️ **No antiforgery token, and that is safe for a specific reason.** Measured: Ada's POST with no token is a `201`; a `text/plain` or form-encoded POST is a `415`; the cookie is `samesite=lax; httponly`; JavaScript on another origin is blocked by the browser, and this app sets no CORS policy. Same-origin JavaScript needs none, which is what week 14 is. **Don't configure CORS tonight.**
- **The tester is a static file, not a tool anyone installs.** It's one page in `wwwroot`, same origin, so it carries the sign-in cookie, and it walks past Chrome's `allow pasting`. Students copy the same file from their lab into their own app. `curl`, Postman and `.http` files get one paragraph in the notes.
- ⚠️ **The Registry has two halves, and tonight both are tested.** `POST /api/sightings` needs nobody; `PUT` and `DELETE` on `/api/cryptids` need a curator. Check 4 fails if the report needs a sign-in, and check 5 fails if the archive doesn't.
- **The checks never see SQL Server.** The in-memory database has no foreign keys, so a report on a creature that doesn't exist saves happily there. Check 4 asserts the 400 directly. On SQL Server the same request with no lookup is a `500`: measured.
- **The lab's watch-fors are task 2's Ctrl+R, task 4's lookup and task 5's plate.**
- **Don't teach `PATCH`, API versioning, Swagger/OpenAPI, tokens/JWT, CORS policies, `[FromQuery]` filtering, or `ReferenceHandler` as a fix for the cycle.** The notes say so in one paragraph for anyone who meets them in a search.
- **Nothing you show is deployed.** Curbside runs on localhost all night.
