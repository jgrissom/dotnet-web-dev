# Week 8 — EF Core CRUD

The night the framework starts writing code — and the skill being taught is reading it. One command scaffolds a complete CRUD controller from the model and context they built over four weeks; the room reads every line of it (async arrives here, translated straight from the Promises they already know), ports Edit and Delete into their own controller, watches the gap between `Update()` and `SaveChangesAsync()` through an attached debugger, and grows a live table by two nullable columns. The Registry gets its corrections desk — and its six field-guide plates.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, the generated-code walkthrough, **troubleshooting appendix** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-08/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside gets the rest of CRUD* — picks up where week 7 left it; [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-08/demo/script.html) |
| In&nbsp;class,&nbsp;last&nbsp;50&nbsp;min | 🧪&nbsp;[lab/⁠](lab/) | *The Registry gets a corrections desk* — 6 `dotnet test` checks; 1/6 green out of the box (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check — the same checks the grader runs (**12 of the 20 pts are back in the script**; it runs the full CRUD cycle and cleans up after itself) |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | Their own app gets Edit + Delete + one new column, added forward; redeploy is one command; URL + repo via Canvas |

## What students walk out with

**The other two letters, and the ability to read generated code.** They can scaffold a controller and say what the tool read to write it; map `async`/`await`/`Task` onto the Promises they already know; explain how an edit knows which record (the hidden `Id`'s round trip, and the guard that 404s a mismatch); say what `[Bind]` does and why a property missing from it gets *erased*, not ignored; attach a debugger to a running process and inspect a bound model mid-request; explain why Delete is a GET that asks plus a POST that acts; and add a nullable column to a table with rows via an additive migration — knowing why delete-and-regenerate died the moment the table held data. And the Registry is illustrated.

## 📋 Before class, don't forget

- **Deployed-app gallery** — 2–3 student Azure URLs picked in advance; 2 minutes each. Their data survives the free-tier sleep now; worth noticing out loud
- Collect the reading in §1 — *"what would have to change to turn your Create form into an Edit form?"* — and hold its second question (*where does the Id come from?*) unanswered until slide 10
- ⚠️ **Copy `week-08/demo-starter/Curbside` out of the private answer-keys repo**, set your secret (`set` only — the id ships), then run `dotnet ef database drop --force` and `dotnet ef database update` *before* class. The shipped migrations refuse a database that remembers week 7's rehearsal
- **`dotnet tool install --global dotnet-aspnet-codegenerator`** before class — and one rehearsal pass, which also warms the NuGet cache for §2's live `dotnet add package`
- **mssql extension** signed in and tested, panel closed — two appearances tonight (§8's new column, the wrap-up)
- Terminal sized for the back row; the SQL log gains `UPDATE` and `DELETE` tonight
- Your finished week-8 Registry with `dotnet test` at 6/6 — **the plates debut at the lab launch, on localhost, nothing deployed**
- Remind students to `git pull` for the week-08 starter

**Prev:** [← Week 7 — EF Core & SQL Server](../week-07/README.md) · **Next:** Week 9 — Related Data *(coming)*
