# Week 9 — Lesson Plan

**Topic:** EF Core relationships — a second table, foreign keys and navigation properties, `Include`, ViewModels, and the many-to-many that falls out of a join carrying a payload
**Session length:** 3h 45m

> The night one table becomes two, and the whole week turns on a failure with **no symptom**. Three moments carry it: **§4's empty list** (the database has the rows, the page says *Nothing listed*, the terminal says nothing at all), **§5's eight queries** (the room guesses a number and the terminal prints it — collecting a promise made in week 7), and **§9's one more foreign key** (a repeated dish name pulled into its own table, which turns `Special` into a many-to-many without anyone building a new relationship). Tonight also collects week 8's reading question: what happens to the review when the trail is deleted.

## Learning objectives

By the end of this session, students can:

1. Name the principal, the dependent and the foreign key in a one-to-many, and say which of the three properties is an actual column.
2. Write the model pair for a one-to-many — `int ParentId`, `Parent?`, and `ICollection<Child>` — and say why the collection is initialized rather than left null.
3. Explain why EF Core chose cascade delete without being asked, from the absence of a `?`.
4. Say what a navigation property holds before `Include` is called, and why that failure has no symptom.
5. Read a query count off the terminal, recognize a query issued once per row, and fix it with `Include`.
6. Say why `Include` is per query rather than per model.
7. Build a `SelectList` in a controller and bind it to a `<select>`, and say what the `<option value>` actually is.
8. Say what a ViewModel is for, and why it never belongs in the `DbContext`.
9. Explain how a join entity carrying a payload makes a many-to-many, and walk the relationship in both directions with `ThenInclude`.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to the slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-09/demo/script.html))
- **Curbside**, copied out of the private answer-keys repo (`week-09/demo-starter/Curbside`) into `~/Repos/dotnet-web-dev-course/instructor/week-09/` — week 8's demo end state: full CRUD, a themed Edit and Delete, three migrations, slogans on the cards, no scaffold — running under `dotnet watch`
- ⚠️ **Your connection string set (`set` only — the `<UserSecretsId>` ships), then `dotnet ef database drop --force` and `dotnet ef database update` run before class *and again after your rehearsal*.** A rehearsal leaves the `Specials` and `Dishes` tables already built, and §2 has nothing left to create
- **Two integrated terminals** — `dotnet watch` owns the first; `dotnet ef` runs in the second
- **mssql extension** signed in, tested, panel closed — one appearance (§3, reading the fourteen rows the migration inserted)
- **2–3 student Azure URLs** picked in advance for the gallery
- Your finished week-9 Registry (`week-09/lab/solution`) with `dotnet test` at 6/6, ready for the lab launch — **on localhost. Nothing is deployed for it**

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Deployed-app gallery** *(deck on title slide)*. 2–3 student apps, **2 minutes each, hard stop**. Full CRUD on a public URL is worth a moment. |
| 0:10 | 15 min | **Where we left off** *(slides 2–3, demo §1)*. Restart, seven trucks, full CRUD — *"and every truck is still an island."* **Collect the reading** on slide 3: principal, dependent, foreign key. Ask for them rather than reading them out. Land the framing that isn't on the slide: principal and dependent are about **who can exist alone**, not importance. |
| 0:25 | 20 min | **The second table** *(slide 4, demo §2)*. Predict off the slide first: *"three properties, one is a column — which?"* Then type `Special`, add the collection to `Truck`, add the `DbSet`, paste the fourteen-row seed. **The initializer gets a beat** — an empty list, not null, so "no specials" reads as zero rather than crashing. ⚠️ **Do not point out the repeated dish names**; that's §9's reveal. |
| 0:45 | 15 min | **The migration** *(slide 5, demo §3)*. Predict its contents, then read the four operations: `CreateTable`, the FK constraint, `InsertData`, and the **index nobody asked for**. Then the line that earns the slide: `onDelete: Cascade`, **inferred from a missing `?`**. **Collect week 8's reading question** here — what happens to the review when the trail goes. Apply, then mssql: fourteen rows. |
| 1:00 | 10 min | **☕ Break** |
| 1:10 | 15 min | **Break #1 — the empty list** *(slide 6, demo §4)*. Render the specials on Details with **no `Include`**. Predict against a number they just saw in the mssql panel: *"Roll Models has two. What am I about to see?"* → **`Nothing listed.`** ⚠️ **Let it sit.** Walk the instruments out loud — 200, no error, no terminal line, rows in the database — *then* ask for the diagnosis. Slide 6 is the answer, not the setup. One line fixes it. |
| 1:25 | 20 min | **Break #2 — how many SELECTs** *(slides 7–8, demo §5)*. Write the per-truck count loop the honest way. **Slide 7 is the exercise** — hands up for one, seven, eight. Reload: **eight**. 🔗 **Week 7's promise lands here** — *"a query gets expensive and this terminal is how you'll notice."* Then `Include`: **one `LEFT JOIN`**. ⚠️ The rider is the exam question: **`Include` is per query**, and the one on Details did nothing for this page. |
| 1:45 | 25 min | **The ViewModel and the form** *(slides 9–11, demo §6–§7)*. Read the existing `(List<Truck>)ViewData["AlsoHere"]!` aloud — a cast **and** a `!` in a view. Build `ViewModels/`, ⚠️ **adding the `_ViewImports` using in the same breath** (a missing namespace breaks *every* view, and the errors point at files nobody touched). Then `SelectList`, the form, and **break #3**: a perfectly filled form refused with *"The Trucks field is required"*. Reach for `asp-validation-summary="All"` first — week 6's advice, still the fastest move — then fix with **one `?`**. |
| 2:10 | 10 min | **Delete takes the children** *(slide 12, demo §8)*. Ask before clicking: *"three specials — what happens to them?"* Answer against the slide, then tie it back to the `int` typed in §2. Build the warning. 💡 **Third `Include` of the night** — Details had one, Index had one, Delete still showed zero. |
| 2:20 | 15 min | **One more foreign key** *(slide 13, demo §9)*. Ask the room to find the defect in the seed — three trucks spelling `"Cheese Curds"`. Pull it into `Dish`, add `DishId`. Read the migration's **order** (`DropColumn`, `AddColumn`, `CreateTable`, fourteen `UpdateData`, *then* the FK — the constraint goes on last for a reason). `ThenInclude` gets named. Payoff: **Cheese Curds → three trucks**, the same rows read backwards. |
| 2:35 | 5 min | **Lab launch** *(slide 14, demo §10)*. ~90 seconds of *what done looks like*: the answer key **on localhost**, `dotnet test` printing **6/6**. **Nothing is deployed for this.** ⚠️ Name the Registry's odd first task — the `Sightings` **column comes out** and the number gets smaller and true. ⚠️ The task-1 database drop, with the why **and the fence: never on their own project**. **In-class target: checks 1–5.** |
| 2:40 | 55 min | **Lab: the Registry gets a sightings log** *(slide 14 stays up)*. Check 6 (the delete warning) rolls into the homework if the clock wins. |
| 3:35 | 10 min | **Wrap-up** *(slide 15, demo §11)*. Five rows, one sentence each; `Include` gets the emphasis. Homework: a second related table on their own app, **one-to-many is enough**. ⚠️ Say what the self-check leaves behind. Week 10: the midterm. |

## Instructor notes

- **Students watch the demo; they don't type along.** Curbside lives only in the private answer-keys repo and the lab is a different app. Say it in the first minute — tonight's paste blocks are large and the seed alone would eat the segment.
- ⚠️ **The three failures are the spine of the night, and none of them announces itself.** §4's empty list is the one that matters most, because it is the only bug this term with **no symptom at all** — no exception, no log line, no red page. Protect its silence: don't say "watch this" before reloading, and don't fix it in the same breath. The room has to sit in the gap where every instrument says fine.
- 🎯 **§4 and §5 teach opposite halves of the same word and are easy to blur.** §4 is *`Include` or the data isn't there*. §5 is *`Include` or the data costs too much*. Say the second one explicitly, because a student who only meets the first concludes `Include` is about correctness and never thinks about the query count again.
- ⚠️ **`Include` is per query, and it is the single most repeated idea tonight — three times, deliberately.** Details needs one, Index needs its own, Delete needs a third. Each time, say the word "again." Students who miss this ship a page that silently shows zero related rows, and the deployed checker takes three points for it.
- **The cascade beat is an inference, not a fact to memorize.** Walk it in order out loud: `int` with no `?` → the column can't be null → a special can't be orphaned → so it goes with the truck. Someone will ask whether they can change it; the answer is yes, with Fluent API, and that is a one-sentence answer and not a detour tonight.
- ⚠️ **Adding `@using ...ViewModels` to `_ViewImports.cshtml` before the namespace exists breaks every view in the project.** Thirteen errors, all pointing at files nobody edited. Create the folder, the class and the using together, and say why while you do it — the same trap is waiting in the lab and in their homework.
- **Break #3 rewards the debugging move before it rewards the fix.** The form fails silently under `ModelOnly`; switching to `asp-validation-summary="All"` is what makes the message appear. That ordering is the lesson — week 6's troubleshooting advice paying off — so don't jump straight to the `?`.
- **The many-to-many arrives as a fix for a defect, not as a topic.** Let the room find the repeated `"Cheese Curds"` themselves. If nobody sees it, ask *"who sells cheese curds, and how would the database answer that?"* Arriving at the join table from a real question is the difference between understanding it and memorizing a diagram.
- **Don't teach `AsNoTracking`, split queries, or lazy loading.** The N+1 in §5 is written by hand and fixed by hand, which is honest and enough. Lazy loading in particular would *undo* §4's lesson — it makes the missing `Include` silently work, at the cost of the N+1, and nothing they write this term turns it on.
- 🔗 **Two promises get collected tonight.** Week 7's *"in week 9 a query gets expensive and this terminal is how you'll notice"* (§5, with a real number), and week 8's reading question about the deleted trail (§3, answered by `onDelete: Cascade`). Students notice when a promise is kept.
- **The lab's watch-for is task 3, not task 1.** Task 1 is a model edit and task 2 is a migration — both familiar by now. Task 3 is `Include`, and its failure mode is a page that looks finished and shows nothing. **Sweep the room at task 3**, and when someone says "it's not working," ask what their Details action looks like before you ask anything else.
- ⚠️ **The lab's task 1 deletes a column.** That is deliberate and it is the Registry's own story — `Sightings` was a number somebody typed. Their *homework* adds a table without removing anything, so say the difference out loud or a few people will go looking for something of their own to delete.
- **Checks 1–5 in class, 6 rolling over, is the designed outcome.** Say it at launch. Check 6 is the delete warning: small, and the same move their homework needs.
- **Many-to-many is watched, not built.** The lab README carries it as a clearly-marked stretch task with a full paste block and **no check attached**, so nobody's grade touches it. The homework requires a one-to-many and nothing more — `Witness↔Cryptid` is the Registry's own story and does not generalize to games and publishers.
