# Week 14 — Lesson Plan

**Topic:** Consuming your API with JavaScript · production: configuration, secrets and CI/CD · team git
**Session length:** 3h 45m

> Three topics in one night, so each gets one move done properly. **JavaScript gets most of it** — three demo segments and three lab blocks — because it's the graded homework. Production gets one segment and one block, and team git gets one segment and the longest block, ungraded, on a throwaway repository. The night's one real failure is **§3's `.json()` on a `401`**: the first draft of the form's script asks an empty answer for its JSON, and the console says `Unexpected end of JSON input`. And one rule, said out loud in §7: **read the status first.**

## Learning objectives

By the end of this session, students can:

1. Call their own API from their own page with `fetch`, `async` and `await`, and say what `await` waits for.
2. Read `response.status` before the body, and say which answers have no body.
3. Change part of a page without a reload, with `data-id`, one delegated listener, `createElement` and `textContent`, and say why not `innerHTML`.
4. Send a form as JSON, list the API's `400` errors, and read a `201`'s `Location` back.
5. Send a DELETE, and confirm it with a GET that answers `404`.
6. Say what changes when an app runs as Production, and where each secret lives.
7. Write a GitHub Actions workflow that builds or tests on every push, and say what CD adds.
8. Work on a branch, open and review a pull request, and resolve a merge conflict.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to the slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-14/demo/script.html))
- **Curbside**, copied out of the private answer-keys repo (`week-14/demo-starter/Curbside`) into `~/Repos/dotnet-web-dev-course/instructor/week-14/` — week 13's demo end state — running under `dotnet watch`
- ⚠️ **Both secrets set, then `dotnet ef database drop --force`, `dotnet ef database update`, Ada and Sam registered through the form, and Ctrl+R — before class *and again after your rehearsal*.** §3's new truck has to get id `8`
- ⚠️ **A private GitHub repository, `curbside-week14`, with Curbside's first commit pushed to it** — §5 and §6 run on it. A rehearsal leaves branches, pull requests and a second clone behind: delete the repository and both folders, and make them again
- **Two integrated terminals** — `dotnet watch` in the first; `git` and one `dotnet run` in the second
- **2–3 student Azure URLs** picked in advance for the gallery
- **Week 14's lab README** open in a browser tab — it goes on screen for every lab block. There is no lab slide

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Deployed-app gallery** *(deck on title slide)*. 2–3 student apps from week 13, **2 minutes each, hard stop**. |
| 0:10 | 10 min | **One fetch** *(slides 1–2, demo §1)*. The agenda. The tester's one `fetch`. Slide 2: send, the status, then the body; `async` and `await`. |
| 0:20 | 5 min | **Lab A · Setup and task 1** *(no slide — the lab README on screen)*. **No database drop tonight.** Sign in as their curator. **Stop at `Passed: 1`.** |
| 0:25 | 12 min | **A truck's menu, without leaving the list** *(slide 3, demo §2)*. The grid, `trucks.js`, the `<script>` line. Three specials under a card. F12 → Network. Slide 3: textContent, never innerHTML. |
| 0:37 | 12 min | **Lab B · Task 2**. The quick look at a creature's reports. **Stop at `Passed: 2`.** |
| 0:49 | 16 min | **A form that sends JSON** *(slide 4, demo §3)*. The form, the handler, a `201`, the stale count, a `400`. 🎯 **Signed out with the page open: `.json()` on a `401`.** Slide 4, the fix. |
| 1:05 | 15 min | **Lab C · Task 3**. A report filed from the creature's page. **Stop at `Passed: 3`.** |
| 1:20 | 10 min | **☕ Break** |
| 1:30 | 8 min | **Remove, without a reload** *(demo §4)*. The button, `removeTruck`, the listener. A `204` read back as a `404`; the second tab; a `401`. |
| 1:38 | 10 min | **Lab D · Task 4**. Close a file from the list. **Stop at `Passed: 4`.** |
| 1:48 | 15 min | **Production** *(slides 5–7, demo §5)*. Slide 5. 🎯 **`dotnet run --no-launch-profile`: the connection string is gone.** Slide 6. A build workflow, a push, a ✅. Slide 7: CD. |
| 2:03 | 15 min | **Lab E · Task 5**. The checks workflow, and the lab in a private repository. **Stop at `Passed: 5`** and a ✅ run. |
| 2:18 | 10 min | **☕ Break** |
| 2:28 | 14 min | **Two people, one line** *(slide 8, demo §6)*. A second clone. Two branches, two pull requests, a comment, a merge, a conflict, `--no-rebase`, resolved. |
| 2:42 | 38 min | **Lab F · Team git** *(no check)*. Pairs, or alone with two clones. **Stop when both pull requests are merged.** |
| 3:20 | 15 min | **Lab G · Catch up** *(no check)*. Anyone red finishes; anyone done starts the homework. **No stop.** |
| 3:35 | 10 min | **Wrap-up** *(slide 9, demo §7)*. One sentence per row. Homework: the same moves on their own app, and a deploy workflow. ⚠️ Say what the self-check can't see — **their add and their remove**. |

> [!NOTE]
> **The table sums to exactly 225 minutes: 75 of demo, 110 of lab in seven blocks, 20 of break, and 20 of gallery and wrap-up.** The longest stretch of watching is **16 minutes — §3**. The breaks sit after Lab C and after Lab E, so team git starts fresh. **If the night runs long, the minutes come out of Lab G, then Lab F — never out of a break, and never out of a lab block before Lab E.** Team git is ungraded and can be finished at home with two clones; the homework can't do without tasks 2–4.

## Instructor notes

- **The lab comes in seven blocks, each right after the demo segment it practices.** Every block but the last ends at an **In class, stop here** note. The cue sheet's `## Lab` sections say what to say, what to watch for, and which note each block stops at.
- **Students watch the demo; they don't type along.** Curbside lives only in the private answer-keys repo, and the lab is a different app. Say it in the first minute.
- ⚠️ **No restarts tonight, and every save reloads the page.** Measured on a pty-driven `dotnet watch`, one save per paste: a new `.js` file, edits to it and edits to a view all go live, and every open tab of the app reloads itself on each save. **So a beat that needs a page as it was** — §3's signed-out form, §4's second tab — **always comes after the last paste of its section.** The cue sheet is in that order; keep it.
- 🎯 **§3's failure is the night's real lesson.** The first draft reads `errors` for any answer that isn't a `201`. With the page still open and Ada signed out in another tab, the API answers `401`, which has no body, and the console prints `SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input`. Measured in Chromium. The `401` is empty **because of week 13's `UseWhen`**.
- **§3's stale count is deliberate.** `7 trucks on the street.` doesn't change when a card is added: the server wrote it. Say so; it's a Done-early item.
- **The `400`'s `errors` keys are the C# property names** (`Name`, `Rating`), and a value that couldn't be converted is keyed `$.rating`. Measured. The scripts list every message and never use the keys, so the case never matters.
- **A form's values are text.** Measured: the API accepts `"4.3"` for a `double`, but `""` is a `400` about converting, and a checkbox's `"on"` is a `400` for a `bool`. That's why the scripts use `Number(…)`, `|| null` for a date, and `.checked`.
- **§4's red `404` in the console is the read-back.** A `204` has no body, so the script GETs the truck again; the `404` means it's gone.
- **§5's crash is safe to run beside `dotnet watch`.** Measured: `dotnet run --no-launch-profile` in the same folder builds, crashes with `The ConnectionString property has not been initialized`, and the watched app keeps the same process and keeps serving.
- ⚠️ **Apps made by `az webapp up` have their publishing credentials switched off** (measured on three). The homework's deploy turns them on with one command before it copies the publish profile. **And the workflow sends the code, not a `dotnet publish` build:** `az webapp up` set `SCM_DO_BUILD_DURING_DEPLOYMENT`, so Azure builds what it's sent, and a published package fails with `Couldn't detect a version for the platform 'dotnet'`. Most examples online publish first, so expect a student who copied one. Measured green in 1m37s on a free-tier app. **Students deploy; you don't.** Curbside's workflow only builds.
- **The checks' CI needs no secrets.** Measured: all five pass with no user-secrets store at all.
- ⚠️ **`git pull` alone fails in §6 and in team git.** Measured on git 2.50: with diverged branches and no `pull.rebase` set, it stops with `fatal: Need to specify how to reconcile divergent branches.` Every document says `git pull --no-rebase origin main`.
- **GitHub won't let anyone approve their own pull request.** You're both people in §6, so a comment stands in for the approval. Solo students do the same.
- **The lab's watch-fors are task 2's missing `<script>` line, task 3's box names, task 5's `.github` folder, and team git's `--no-rebase`.**
- **Don't teach React or other frameworks, `git rebase`, branch protection, OpenID Connect deploys, staging slots, or CORS.** The notes say so in one paragraph each.
- **Nothing you show is deployed.** Curbside runs on localhost all night, and its repository only builds.
