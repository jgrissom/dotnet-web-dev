# Week 15 — Lesson Plan

**Topic:** The flex week — a confirmation message that survives a redirect, search and a filter in the address bar, a list that comes in pages, and where everything a constructor asks for has been coming from

**Session length:** 3h 45m

> The polish night. Nothing new is stored and no table changes: the app gets easier to use, then easier to read. Four moments carry it: **§2's missing message** (`ViewData` is set, the truck is saved, and nothing appears, because week 6's redirect is a second request), **§3's address bar** (a search is a GET, so the result is a URL), **§4's link that forgets** (page 2 of a search shows page 2 of everything until the links carry it), and **§5's constructor nobody can fill** (`ITruckService` isn't registered, and the error names the thing that has been handing out `_context` since week 7).

> [!IMPORTANT]
> **This is the flex week, and it is last on purpose.** Lost a session anywhere before it, to a sick day or a short semester? Skip it, and week 16 stays where it belongs. Nothing depends on it and **there is no homework**, so skipping it costs no points. It runs on week 12's apps: **no migration, no model change**, and none of weeks 13–14's Web API.

## Learning objectives

By the end of this session, students can:

1. Say why `ViewData` can't carry a message past a redirect, and use `TempData` to show one.
2. Add a search box and a filter to a list with a GET form, so a result can be bookmarked.
3. Build a query in stages with `AsQueryable` and `Where`, and say when it runs.
4. Page a list with `Skip` and `Take`, in the right order, with a page number nobody can break.
5. Carry a search through its page links with `asp-route-…`.
6. Move a query into a service behind an interface, and register it with `AddScoped`.
7. Say where `_context` comes from, what `AddTransient`, `AddScoped` and `AddSingleton` each give you, and why the seeder needs `CreateScope`.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to the slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-15/demo/script.html))
- **Curbside**, copied out of the private answer-keys repo (`week-15/demo-starter/Curbside`) into `~/Repos/dotnet-web-dev-course/instructor/week-15/` — week 12's demo end state: an Admin role on every write, a seeder that reads `Admin:Email`, hidden buttons and a claims page — running under `dotnet watch`
- ⚠️ **Your connection string and `Admin:Email` set, then `dotnet ef database drop --force` and `dotnet ef database update`, before class *and again after your rehearsal*.** A rehearsal leaves extra trucks behind and §4's page counts stop matching the sheet
- **One integrated terminal** — `dotnet watch` owns it all night. Nothing tonight needs a second one
- **2–3 student Azure URLs** picked in advance for the gallery
- **Week 15's lab README** open in a browser tab — it goes on screen for every lab block. There is no lab slide

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Deployed-app gallery** *(deck on title slide)*. 2–3 student apps from week 14, **2 minutes each, hard stop**. |
| 0:10 | 12 min | **The silent save** *(slide 1, demo §1)*. The agenda on the title slide. Ada adds a truck and the page says nothing about it. |
| 0:22 | 8 min | **Lab A · Setup and task 1** *(no slide — the lab README on screen)*. **No database drop tonight**: the migrations are the same as week 12's. Sign in as themselves. **Stop at `Passed: 1`.** |
| 0:30 | 15 min | **A message that survives** *(slide 2, demo §2)*. `ViewData` in the POST, the block in `_Layout`: 🎯 **no message**. Slide 2: a redirect is a second request. `TempData`: the message, then reload, and it's gone. Edit and Delete get a line each. |
| 0:45 | 15 min | **Lab B · Task 2**. All three writes, then the **public** report form, whose POST only has an id. **Stop at `Passed: 2`.** |
| 1:00 | 10 min | **☕ Break** |
| 1:10 | 18 min | **Search and a filter** *(slide 3, demo §3)*. `TruckListViewModel`, the form, the query built in stages. Search `korean`, watch the address bar. Slide 3: the address bar is the search. Pick a city; the two `Where`s add up. |
| 1:28 | 17 min | **Lab C · Task 3**. A search across three columns, one nullable, and a status dropdown whose values aren't column values. **Stop at `Passed: 3`.** |
| 1:45 | 17 min | **Pages** *(slide 4, demo §4)*. Slide 4 first: the arithmetic and the order. `Skip`, `Take`, `Count`, `Math.Clamp`. ⚠️ **Ctrl+R before the first reload.** 🎯 **Search, click Next: the address bar still holds the search**, because the link carries it. Say what it would do without `asp-route-search`. |
| 2:02 | 15 min | **Lab D · Task 4**. Numbered links with a `for` loop, carrying **two** parameters. **Stop at `Passed: 4`.** |
| 2:17 | 10 min | **☕ Break** |
| 2:27 | 18 min | **Where `_context` comes from** *(slides 5–6, demo §5)*. The action has grown. `ITruckService`, `TruckService`, the constructor: ⚠️ **the first restart prompt, answer `a`**. 🎯 `Unable to resolve service`. Slide 5. `AddScoped`. Then one line swaps in `EmptyTruckService`, and back. Slide 6. |
| 2:45 | 15 min | **Lab E · Task 5**. The service, and then `HomeController` uses it too and **loses its context**. **Stop at `Passed: 5`** — all five, the in-class target. |
| 3:00 | 10 min | **How long one lasts** *(slide 7, demo §6)*. `AddSingleton`: the app won't start, and the message says why. Back to `AddScoped`. Slide 7: the three lifetimes, and why the seeder needs `CreateScope`. |
| 3:10 | 25 min | **Lab F · Catch up, or the stretch** *(no check)*. Anyone red finishes; anyone at five adds a sort order. **No stop.** |
| 3:35 | 10 min | **Wrap-up** *(slide 8, demo §7)*. Five rows, one sentence each. **No homework**: the same four moves are an optional stretch, worth no points. Say what its self-check can't see — **the message and the service**. |

> [!NOTE]
> **The table sums to exactly 225 minutes: 90 of demo, 95 of lab in six blocks, 20 of break, and 20 of gallery and wrap-up.** The longest stretch of watching is **18 minutes** — §3 and §5 — and every demo segment is followed by a lab block of its own. The breaks sit after Lab B and after Lab D. **If the night runs long, the minutes come out of Lab F, not out of a break, and never out of a lab block before Lab E.** **If the demo runs fast, the time goes to Lab F.**

## Instructor notes

- **The lab comes in six blocks, each one right after the demo segment it practices.** Every block but the last ends at an **In class, stop here** note in the lab README. The cue sheet's `## Lab` sections say what to say, what to watch for, and which note each block stops at. Lab F has no stop.
- **Students watch the demo; they don't type along.** Curbside lives only in the private answer-keys repo and the lab is a different app. Say it in the first minute.
- ⚠️ **§4 needs a Ctrl+R you press yourself.** Measured with one save per paste: properties added to a ViewModel, then a view reading them, prints `Hot reload succeeded` and every request is a 500, `Token 2000000 is not valid in the scope of module`. Ctrl+R cleared it every time. Lab task 4 hits the same thing, so its README says to press it first. **This may be the persistent 500 from earlier walks.**
- ⚠️ **There is one restart prompt tonight, and it is late: §5, at the controller.** Removing `PageSize` from `TrucksController` prints `ENC0004: Updating the modifiers of const field requires restarting the application`, then asks. **Answer `a`**, and every later `Program.cs` edit restarts by itself. **Make all three controller edits, then save once:** the file doesn't compile between them, and answering the prompt mid-paste leaves the app down until the next save.
- ⚠️ **Don't delete `EmptyTruckService.cs` in the same breath as the `Program.cs` edit.** Doing both at once crashed `dotnet watch` itself on two runs out of three (`FileNotFoundException` while it read the changed files). Save `Program.cs`, reload the page, then delete the file. Measured clean that way.
- ⚠️ **`AddSingleton` stops the app** with `Cannot consume scoped service 'Curbside.Data.CurbsideContext' from singleton 'Curbside.Services.ITruckService'`, and `watch` prints `Waiting for a file to change before restarting`. Changing the line back is what restarts it. That validation only runs in Development: on Azure the same mistake starts and shares one context between requests, which is why it is worth seeing here.
- **Search is case-insensitive on SQL Server** — measured on a real 2022 container: `korean` finds Korean — **because of the database's collation, not the code.** The in-memory database behind `dotnet test` matches case exactly, so the checks search with the right capitals. Check 3 will not catch a student's lowercase typing; their browser will work.
- **The null check on `LatinName` silences a compiler warning (`CS8602`). It doesn't prevent a crash.** Measured: without it the query still runs, on SQL Server and in memory, because a `NULL` simply doesn't match. Don't tell the room it would throw.
- **A negative page number is a 500 on SQL Server** — `The offset specified in a OFFSET clause may not be negative` — measured with `Math.Clamp` removed. The in-memory database lets it through, so check 4 tests the *outcome* (lands on the nearest real page) and the homework's self-check tests it on the real database.
- **The lab's watch-fors are task 2's public form and task 5's `Program.cs`.** Task 2: a report's POST only carries `CryptidId`, so the name has to be looked up. Task 5: if every check goes red at once, the app can't build `ICryptidService` — read check 5's message.
- **The checks can't see SQL Server.** Same as every week since 7: `dotnet test` proves the code, the browser proves the connection.
- **Don't teach sorting in the demo, `IEnumerable` versus `IQueryable` in depth, a generic repository, `IServiceProvider` beyond the seeder, keyed services, or `PagedList` packages.** The notes name what was left out in one paragraph for anyone who meets it in a search.
- **Nothing you show is deployed.** Curbside runs on localhost all night.
