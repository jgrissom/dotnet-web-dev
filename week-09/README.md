# Week 9 — Related Data

The night one table becomes two — and the week turns on a failure with **no symptom**. A second model gets a foreign key and a navigation property, a migration creates the table and quietly chooses cascade delete on the strength of a missing `?`, and then the details page shows nothing at all while the database sits there holding the rows. `Include` is the answer twice: once for correctness, once for the eight queries a page issues when it asks row by row. A ViewModel arrives because one view needs more than one thing, a dropdown gets built from the students' own records, and the last beat pulls a repeated string into its own table — which turns the join into a many-to-many without anyone building a new relationship. The Registry gets its sightings log, and *"47 reports on file"* becomes three reports that exist.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, choosing your own second table, **troubleshooting appendix** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-09/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside grows relatives* — picks up where week 8 left it; [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-09/demo/script.html) |
| In&nbsp;class,&nbsp;last&nbsp;55&nbsp;min | 🧪&nbsp;[lab/⁠](lab/) | *The Registry gets a sightings log* — 6 `dotnet test` checks; 1/6 green out of the box (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check — the same checks the grader runs (12 of the 20 pts; **nothing runs on load — `recheck()` is the only path**, and it files one row it cannot take back) |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | Their own app gets a second related table, a form with a dropdown, and the `Include` that makes it visible; URL + repo via Canvas |

## What students walk out with

**A second table, and the instinct to ask where the related rows came from.** They can name the principal, the dependent and the foreign key, and say which of the three properties is a column; write the model pair and explain why the collection is initialized; read `onDelete: Cascade` in a migration and trace it back to a missing `?`; say what a navigation property holds before `Include` is called, and why that failure has no error message; read a query count off the terminal and recognize one query per row; say why `Include` is per query rather than per model; build a `SelectList` and explain that the `<option value>` is the foreign key; say what a ViewModel is for and why it never goes in the `DbContext`; and explain how a join entity that carries a payload is a many-to-many, walked in either direction with `ThenInclude`.

## 📋 Before class, don't forget

- **Deployed-app gallery** — 2–3 student Azure URLs picked in advance; 2 minutes each
- Collect the reading in §1 — principal, dependent, foreign key — by **asking for them**, not reading them off the slide
- ⚠️ **Copy `week-09/demo-starter/Curbside` out of the private answer-keys repo**, set your secret (`set` only — the id ships), then run `dotnet ef database drop --force` and `dotnet ef database update` — **after your last rehearsal**, as the final prep step. A rehearsal leaves `Specials` and `Dishes` already built and §2 has nothing left to create
- **Two integrated terminals** — `dotnet watch` in the first, `dotnet ef` in the second — and answer `a` at the first restart prompt
- **mssql extension** signed in and tested, panel closed — one appearance tonight (§3, reading the fourteen rows the migration inserted)
- ⚠️ **Protect §4's silence.** The empty list is the only bug this term with no symptom at all — don't announce it, and don't fix it in the same breath
- Your finished week-9 Registry with `dotnet test` at 6/6 — **on localhost, nothing deployed for it**
- Remind students to `git pull` the starters repo for the week-09 folder

**Prev:** [← Week 8 — EF Core CRUD](../week-08/README.md) · **Next:** Week 10 — Midterm Project *(coming)*
