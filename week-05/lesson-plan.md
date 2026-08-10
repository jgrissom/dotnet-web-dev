# Week 5 — Lesson Plan

**Topic:** Razor layouts and partials — the site shell; `_ViewStart` / `_ViewImports`; sections; the Bootswatch swap
**Session length:** 3h 45m

> The night students stop being tenants of the template and become its landlord. Last week they generated pages from data; every one of those pages arrived wrapped in a file they've been into twice and never read. Tonight they open it, break it four times, and leave with a site that looks like theirs. Two segments carry the week — **partials** (§3, the load-bearing one) and **Bootswatch** (§5, the payoff) — and everything else exists to earn them.

## Learning objectives

By the end of this session, students can:

1. Explain what `_Layout.cshtml` is and trace where a view's HTML ends up, via `@RenderBody()`.
2. Name the shell files — `_Layout`, `_ViewStart`, `_ViewImports`, `Views/Shared/` — and say what each does without opening them.
3. Set a per-page title with `ViewData["Title"]`, including a data-driven one on a details page.
4. Extract repeated markup into a partial view, pass it a model, and render it from **two different views**.
5. Use `@section Scripts` to inject page-specific markup into the layout's slot, and explain `required: false`.
6. Re-theme an entire site by swapping one stylesheet link, and explain why every page changes.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, with all predict-then-run answers and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-05/demo/script.html))
- **Curbside**, copied out of the private answer-keys repo (`week-05/demo-starter/Curbside`) to a scratch folder, running under `dotnet watch`, with **three browser tabs parked** on `/`, `/Trucks`, `/Trucks/Details/2`
- **3–4 student Azure URLs** picked in advance for the gallery — *this is the first week student work goes on the projector*
- Your finished Registry + `dotnet test` at 6/6, ready to show at lab launch

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Deployed-app gallery** *(deck on title slide)*. **First one — week 4 promised it.** 2–3 student apps, **2 minutes each, hard stop** — with 12 sessions left you cover the whole class by week 9 at that rate, so there is no need to rush more in. Collect last week's reading **while an app is on screen**, not after: *"two things in `_Layout.cshtml` you'd change site-wide."* **Write the answers on the board** — they are tonight's agenda, and you tick them off as the night covers them. Update the working-regions list. |
| 0:10 | 35 min | **The shell you've been ignoring** *(slides 2–6, demo §1)*. **Open live, not rhetorically** — and use the **home page**, the smallest file in the project: `Views/Home/Index.cshtml` (8 lines, fits on screen, no `<html>`) next to View Source on `/` (58 lines). *Four lines are yours, 54 aren't* — then point at the rendered page, where the shell visibly **is** the page. One tab over to `/Trucks` shows the identical 39-above/15-below, so nobody thinks it's a home-page quirk. Then read `_Layout.cshtml` top to bottom without editing. Then **slide 5 is live**: predict, then delete `@RenderBody()` — it's a **500**, not a blank page, and the exception names itself. **Restore and verify.** Then the title's two halves, break-and-restore, and branding the navbar. |
| 0:45 | 15 min | **The two files nobody opens** *(slides 7–8, demo §2)*. `_ViewStart` — why no view asks for a layout. `Layout = null;` on Privacy, View Source, *not even an `<html>` tag*, **restore**. `_ViewImports` — why `asp-controller` resolves, and flag it forward: it's why `<partial />` will work in ten minutes. Short and demystifying. |
| 1:00 | 10 min | **☕ Break** |
| 1:10 | 45 min | **Partials** *(slides 9–13, demo §3)*. **Load-bearing.** Straight to the case with real reuse: `_TruckCard.cshtml` with `@model Truck`, rendered in the index loop **and** in an "Also in this city" panel on Details. Finish by editing the card once and refreshing both pages. **Do not rush this**, and see the instructor note about why we don't do the footer. |
| 1:55 | 10 min | **☕ Break** |
| 2:05 | 20 min | **Sections** *(slides 14–15, demo §4)*. The slot that was always there. Add `@section Scripts`, View Source, find it below the footer and below jQuery. Then `required: true` → index 500s, details still fine. **Restore.** **Say the week-6 line here**, pointing at `_ValidationScriptsPartial.cshtml`. |
| 2:25 | 25 min | **Bootswatch** *(slides 16–18, demo §5)*. **The payoff.** One `<link>`, hard-refresh, different site. Cycle two or three themes. Pinned version, replaces-not-adds, only-the-CSS-moved. Fix the navbar classes, and say the reassurance out loud: *your Bootstrap knowledge is intact*. Close on the week-2 callback. |
| 2:50 | 45 min | **Lab: the Registry gets a shell** *(slide 19)*. Launch with ~90 seconds of *what done looks like* — finished copy + `dotnet test` printing **6 / 6**. Then the setup, said once: **`cd dotnet-web-starters && git pull` → copy `week-05` out and rename → open the folder holding *both* projects → `dotnet test Cryptids.Checks`**. **In-class target: checks 1–4 green.** |
| 3:35 | 10 min | **Wrap-up** *(slide 20)*. The shell diagram. Homework: their own app gets the same five moves. Then week 6: the shell holds a **form**, and the Scripts slot is how validation arrives. |

## Instructor notes

- **You break the layout four times tonight, and every break takes down every page at once.** That's the lesson *and* the risk — unlike week 4's route edits, a forgotten restore is instantly visible but also instantly derailing. The script flags all four restores: `@RenderBody()`, the page title, `Layout = null`, `required: true`. **Verify a page loads after each.**
- **The `@RenderBody()` deletion is the best 20 seconds of the night — and the answer surprises people.** Take a show of hands on "blank page or error" first. It's a **500** with `RenderBody has not been called for the page at '/Views/Shared/_Layout.cshtml'`. Rooms guess blank page. Let them be wrong, then read the exception aloud: the framework treats a layout that never renders its body as a bug and says so by name.
- **Don't teach the view-before-layout execution order — but have the answer ready.** Someone sharp may object that the layout must run first, since the finished page nests the view inside it. It doesn't: the view's output is buffered, and `@RenderBody()` writes it out later. Nothing they build this week depends on knowing that, and the intuitive picture predicts everything correctly, so it's a two-sentence aside and not a segment. The answer is in the notes next to `ViewData["Title"]`.
- **Protect the partials segment.** If §1 or §2 runs long, take it out of §5 — drop the extra theme swaps. Bootswatch lands fine in a single swap; the "one file, two pages" moment cannot be recovered by reading the notes later.
- **Hard-refresh at every theme swap** (⌘⇧R / Ctrl+Shift+R). A cached stylesheet is indistinguishable from a broken one and it will eat five minutes. Say it to the room too, because they'll hit it in the lab.
- **"The same Bootstrap, recompiled with different variables"** is the sentence that keeps week 2 intact. Without it, a few students conclude their Bootstrap knowledge just expired. Say it, then prove it by fixing the navbar with the same utility classes they already know.
- **The page's model and the partial's model don't have to match** (`List<Truck>` vs `Truck`). This is the single most confusing thing in §3. Name it explicitly rather than letting them infer it.
- **The underscore prefix is convention, not enforcement.** `TruckCard.cshtml` would render fine. Someone will otherwise believe the framework requires it.
- **We deliberately don't do the classic footer partial**, and it's worth knowing why in case someone asks or you've taught it before. The footer already lives in the layout, and the layout is already on every page — so extracting it produces a partial with exactly **one call site**, which shows the syntax and none of the point. It also quietly breaks the template's footer styling: `_Layout.cshtml.css` is a *scoped* stylesheet, and its `.footer { position: absolute; bottom: 0 }` rule stops matching once the markup is no longer rendered by the layout. Real cost, no benefit. The card is the honest example, and the lab and homework both require **two** call sites for the same reason.
- **`<partial />` vs `@await Html.PartialAsync(...)`** — both work, the tag helper is current, they'll meet the old one in Stack Overflow answers. One-paragraph answer is in the notes.
- **The lab starter arrives finished**, so nobody is blocked tonight by an unfinished week 4 — say that at lab launch, it visibly relaxes the room. But their *homework* needs their own week-4 app working; catch anyone in that hole during the lab.
- **Name the three exact strings the lab checks want** — `Cryptid Registry`, `Field Reports Since 1893`, `Cryptid file loaded`. They're in the lab README, but saying them once prevents a run of confused failures.
- 🔗 **Week 6 is set up twice tonight** — once at the sections beat (`_ValidationScriptsPartial.cshtml` is a partial meant for a Scripts section) and once at the wrap-up. It's the cleanest hand-off the course has; don't skip it.
- **The homework's requirement 5 is installing the self-check itself**, via `@section Scripts`. Show that at wrap-up: it's the honest use of a section, it's worth 2 points, and it means they can't skip the checker without noticing.
- **If time runs short, take it out of §5, not the lab.** Bootswatch lands in a single theme swap; the extra two are garnish. The lab is where task 4 — one card partial, two call sites — gets practised, and that's the load-bearing idea of the night. Losing it means partials were watched and never done.
- **The lab has 45 minutes, more than week 4's 40, deliberately.** Tasks 2 and 3 are quick edits; task 4 is the real work. Slide 20 (the diagram + the week-6 hook) survives anything.
