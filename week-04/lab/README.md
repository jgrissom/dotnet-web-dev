# Week 4 Lab — Roster 🧑‍🎓

A course catalog: a list page, a details page, and a 404 that tells the truth. Same rhythm as *First Flight* — run the checks, turn red into green.

**Time:** ~30 minutes in class — **in-class target: checks 1–4 green.** Checks 5–6 (and deploying it) roll into the homework by design.

## Setup

1. Update your clone of the course repo, then copy this week out (work on the copy, never in the clone):
   ```bash
   cd dotnet-web-dev && git pull
   ```
2. Copy the whole `week-04/lab/starter` folder into your own projects folder — two project folders side by side: your app (`Roster.Web`) and the read-only checks (`Roster.Checks`).
3. Open the copied parent folder in VS Code. From its terminal:
   ```bash
   dotnet test Roster.Checks
   ```

**1 / 6 passing.** Check 1 is free — it proves the harness works. The other five are the lab.

> [!TIP]
> Two terminals: in one, `cd Roster.Web` then `dotnet watch`; in the other, stay at the parent folder and re-run `dotnet test Roster.Checks` after each task. Browser for feel, checks for truth.

> [!NOTE]
> **The data is already written for you.** `Roster.Web/Models/Course.cs` and `CourseData.cs` ship with the starter — five courses, ready to use as `CourseData.All`. Tonight's work is controllers, views, and routing. Don't retype the seed data.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 2 | `CoursesPageExists` | Add a `CoursesController` with an `Index` action, and the matching view `Views/Courses/Index.cshtml`. [Three names must agree](../lecture-notes.md#conventions-three-names-that-must-agree) — get `/Courses` returning *anything* first. |
| 3 | `IndexListsEveryCourse` | Pass the list to the view (`return View(CourseData.All);`), declare it with [`@model List<Course>`](../lecture-notes.md#strongly-typed-views-with-model), and [loop it out](../lecture-notes.md#loops-in-a-view) with `@foreach`. All five titles on the page. |
| 4 | `DetailsShowsOneCourse` | Add a `Details(int id)` action + `Details.cshtml` so `/Courses/Details/2` shows **that one course** — its title *and* its code. [The Index → Details pair](../lecture-notes.md#index-and-details-the-classic-pair). |
| 5 | `BadIdIsNotFound` | `/Courses/Details/999` must return a **404**, not a crash and not a blank page. [`FirstOrDefault` + `NotFound()`](../lecture-notes.md#details-and-the-notfound-guard). |
| 6 | `IndexLinksToDetails` | Each row on the Index page links to its own details page — `href="/Courses/Details/@course.Id"` inside the loop. |

> [!TIP]
> Check 4 also asserts the details page does **not** show the whole catalog — if you pass `CourseData.All` to `Details.cshtml`, it'll fail. One course in, one course out.

## Rules

> [!IMPORTANT]
> - **Never edit `Roster.Checks`** — it's the grading contract. All work happens in `Roster.Web`.
> - Don't remove the `public partial class Program { }` line at the bottom of `Program.cs` — the checks need it to see your app.

## 🆘 Stuck?

- **404 on `/Courses`?** Route → action → view, in that order. Is the class `public` and named `CoursesController`? The [routing section](../lecture-notes.md#routing-the-pattern-decoded) explains why the URL finds the class.
- **"The view 'Index' was not found"?** Read the error — it lists every path it searched. Match the folder name to the controller name exactly.
- **"The model item passed into the ViewDataDictionary is of type…"?** Your controller and your `@model` line disagree. Make them match.
- The [troubleshooting appendix](../lecture-notes.md#appendix-troubleshooting) covers the rest — including the `@model` / `@Model` mix-up that gets almost everyone once.

## 🚀 Done early?

- Show credits as a total: `@Model.Sum(c => c.Credits)` at the top of the Index page.
- Sort the list — `CourseData.All.OrderBy(c => c.Code)` — without touching the view.
- Add a `Semester` property to `Course`, seed it, and show it on the details page.
- Add a `@if` to the Index loop: flag any course worth 4+ credits with a Bootstrap badge.
