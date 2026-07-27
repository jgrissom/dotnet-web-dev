# Week 1 — Lesson Plan

**Topic:** Course introduction, environment setup, rapid JavaScript refresher
**Session length:** 3h 45m

> Students arrive knowing both C# and JavaScript — this session *calibrates* their JS to the modern idioms this course uses, it doesn't teach the language. Move fast; the refresher doubles as a diagnostic for who's rusty.

## Learning objectives

By the end of this session, students can:

1. Describe the course roadmap and what they'll build by week 16.
2. Verify a working toolchain: .NET 10 SDK, VS Code with the C# and mssql extensions (mssql connected to the school SQL Server), Git.
3. Write modern-idiom JavaScript: `const`/`let`, `===`, template literals, arrow functions, `map`/`filter`/`find`, destructuring, spread.
4. Select DOM elements, handle events, and make a `fetch` call with `async`/`await`.

## Materials

- `lecture-notes.md` (project on screen or convert to slides)
- `lab/` starter code pushed to the course repo/LMS before class
- Install links posted to LMS ahead of time (ask students to pre-install if possible)

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 20 min | **Welcome & syllabus.** Introductions, grading, late policy, course arc: "By week 16 you will have built a database-backed, secured web app and an API." Show a finished demo app if available. |
| 0:20 | 45 min | **Environment setup workshop.** Students work through [`setup-guide.md`](setup-guide.md) at their own pace — 5 steps, each with a ✓-verify checkpoint (.NET 10 SDK, VS Code + C# extension incl. an F5 breakpoint test, mssql extension → school SQL Server, Git + `git config`, GitHub account). Put the guide's URL on screen, **distribute the server address + credentials handout**, then circulate and troubleshoot — the guide does the walking, you do the unblocking. Mention Azure for Students exists but activation waits until week 3. Fast finishers help neighbors. |
| 1:05 | 10 min | **☕ Break** |
| 1:15 | 10 min | **Why JavaScript in a .NET course?** Where JS fits: browser is the client, .NET is the server; preview of week 15 where their JS calls their own API. |
| 1:25 | 35 min | **Refresher: modern JS idioms.** Rapid-fire — `const`/`let` (`var` is retired), `===` only, template literals, truthiness, arrow functions, default parameters. Frame as "the dialect this course speaks," not new material. Live-code in browser console. |
| 2:00 | 30 min | **Refresher: arrays & objects (the LINQ-shaped part).** `map`/`filter`/`find` as `Select`/`Where`/`FirstOrDefault`, destructuring, spread, arrays-of-objects as the shape of all future data. |
| 2:30 | 10 min | **☕ Break** |
| 2:40 | 25 min | **DOM & fetch highlights.** `querySelector`, `textContent`, `addEventListener`, then one complete `fetch` + `async`/`await` example against a public JSON API. Sets up week 15; keep it a tour, not a deep dive. |
| 3:05 | 30 min | **Lab: JS Refresher Gauntlet.** Launch with ~90 seconds of *what done looks like*: your finished copy in the browser, console showing **8 / 8 passing** — a target, not a walkthrough. Then students clone the course repo and work exercises 1–8 (`lab/README.md`). Work in pairs encouraged. Review 2–3 trickiest exercises on screen in the last 10 minutes. |
| 3:35 | 10 min | **Wrap-up.** Assign homework (`homework.md`) — emphasize Part 4: their code goes **live on GitHub Pages** tonight, and from week 3 every .NET assignment deploys to Azure. Preview week 2: **Bootstrap** — they'll build and deploy a styled, personalized site. Remind students setup must be working before next class. |

## Instructor notes

- Demo from your **"Teaching" VS Code profile** (gear icon → Profiles) — only the C# and mssql extensions enabled, no C# Dev Kit — so your editor matches the students' pixel-for-pixel (no Solution Explorer they don't have, same F5 flow). Bump the font size for the projector in that profile too.

- No local SQL Server install — students connect to the school SQL Server (it's externally accessible, so it works from home too). Common connect failures: typo in the server address, Windows Authentication selected instead of **SQL Server Authentication**, or school Wi-Fi quirks. Have the [setup troubleshooting appendix](lecture-notes.md#appendix-setup-troubleshooting) handy. Students who can't finish must complete setup before week 2 (it's part of the homework).
- Everything is VS Code on every platform (code via the C# extension, database via the mssql extension) — there are no macOS/Linux special cases this semester.
- Keep the JS material moving; they know C# *and* JS, so the C# bridges ("arrow functions are lambdas", "`map` is `Select`, `filter` is `Where`") are calibration, not instruction. If the room is clearly solid, compress the refresher blocks and start the lab early — the lab is the real diagnostic.
- The DOM/fetch segment is a highlights tour, not mastery — students see the patterns again in context during week 2 (Bootstrap interactivity) and week 15 (calling their own API).
- If time runs short, exercises 7–8 in the lab roll into homework.
