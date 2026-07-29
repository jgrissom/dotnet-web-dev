# Week 4 — Lesson Plan

**Topic:** Routing deep dive; a second controller; Razor syntax; passing data to views with `@model`
**Session length:** 3h 45m

> The night the app stops being a page and becomes a *system*. Last week one URL found one method; tonight one action serves many URLs and one view renders many rows. Two segments carry the week — Razor's `@foreach` and the `@model` handoff — and everything else exists to set them up.

## Learning objectives

By the end of this session, students can:

1. Read the default route pattern slot by slot, and predict which controller and action a given URL reaches — including why it 404s.
2. Edit the route pattern's defaults and optional segment, and describe the consequence.
3. Add a second controller with its view folder, using naming conventions alone.
4. Write Razor expressions, code blocks, conditionals, and loops, and explain (via View Source) that the browser receives only HTML.
5. Pass data into a view three ways — action parameter, `ViewData`, and `@model` — and choose `@model` for the page's subject.
6. Build an Index → Details pair, reading `id` from the route and guarding a missing record with `NotFound()`.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, with all predict-then-run answers and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-04/demo/script.html))
- A scratch folder for **Curbside**; terminal font sized for the projector
- The class **working regions** list from week 3, to update *(no student apps on the projector this week — that starts in week 5)*

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 5 min | **Deploy status check** *(deck on title slide)*. **No student apps on screen tonight** — everyone built the same First Flight, so there's nothing to compare and nothing to admire. Just take the temperature: hands up if your Azure URL works, note who's stuck and catch them during the lab, and update the class working-regions list with any new wins or failures. Showing student work starts in **week 5**, when everyone arrives with a different topic and it's actually worth looking at. |
| 0:05 | 40 min | **Routing deep dive** *(slides 3–5, demo §1)*. **Open with ~60 seconds of `dotnet new mvc` live** (demo §0b) — tonight's homework asks them to build a new app from an empty folder, so this is rehearsal, not repetition. Say so while you type. Slide 3 is the pattern slot by slot; **slide 4 is live** — you type each URL in the browser and the room predicts before you press Enter (protect the `/Privacy` beat, it's the one that lands). Slide 5 is where you edit the pattern: move the default action, delete `{id?}`, watch both break, **restore**. Close on 404-vs-500 as a diagnosis habit. |
| 0:45 | 30 min | **A second controller** *(slides 6–7, demo §2)*. Three names that must agree. Build it in two steps — `Content()` to prove routing, *then* the view. Misname the view folder on purpose and read the error page out loud. |
| 1:15 | 10 min | **☕ Break** |
| 1:25 | 45 min | **Razor for real** *(slides 8–12, demo §3)*. Expressions → code blocks → `@if` → `@foreach` → comments, with **View Source after every beat**. Load-bearing segment #1: the "one `<li>` in, six out" moment is the thesis of the entire week. Don't rush to the model. |
| 2:10 | 10 min | **☕ Break** |
| 2:20 | 35 min | **Passing data and `@model`** *(slides 13–18, demo §4–5)*. Three ways in; the typed handoff; the IntelliSense proof; then Index → Details, `FirstOrDefault`, and `/Details/999` on purpose. Load-bearing segment #2. |
| 2:55 | 40 min | **Lab: Cryptid Registry** *(slide 19)*. Launch with ~90 seconds of *what done looks like*: your finished copy running + `dotnet test` printing **6 / 6** — a target, not a walkthrough. Then put the three setup steps on screen and say them once, because this is where the room stalls: **`git pull` → copy `week-04/lab/starter` out and rename it → open that folder (the one holding *both* projects) → `dotnet test Cryptids.Checks`**. Nobody creates a project; it already exists. **In-class target: checks 1–4 green.** Checks 5–6 and the deploy roll into homework by design — say so. |
| 3:35 | 10 min | **Wrap-up** *(slides 20–21)*. Homework: own topic, Index + Details, deployed, URL + repo via Canvas — **and say clearly that this app is theirs for the rest of the semester** (see instructor notes; the topic-choice warning belongs here, not in the handout alone). The chain slide, then the week-7 promise: this list becomes a table and the `@model` line doesn't change. |

## Instructor notes

- **The route-pattern edits in §1 are the one real risk tonight.** You break routing twice on purpose. Restore it both times and *verify* `/` still works before moving on — a forgotten `{id?}` deletion will silently sabotage §5 forty minutes later, and you will not suspect the pattern.
- **Protect the `@foreach` beat.** If the routing segment runs long, cut the second pattern edit (`{id?}` deletion) rather than shortening Razor. Routing can be re-taught from the notes; the loop moment can't be recovered by reading.
- **Say the week-7 line while the seeded list is on screen** (demo §4): *this becomes a database table and the controller barely changes.* Students who hear it now find EF Core unsurprising instead of alarming.
- **Namespaces are taught, not graded** (lecture notes, Part 4). Worth knowing before you demo: C# doesn't require them, so a student who omits the `namespace` line never needs a `using` and never sees the red squiggle — and VS Code adds the `using` silently anyway if they pick the type from IntelliSense. Say the point out loud rather than relying on the squiggle appearing.
- `@model` vs `@Model` (lowercase declares, capital uses) will bite several students during the lab. Call it out during the demo, then again at lab launch — it's cheaper than debugging it six times.
- The starter's `CryptidData.cs` is **provided** — the lab is controllers, views, and routing, not typing seed data. Point at it during the launch so nobody rewrites it. The unused `IsDebunked` flag is deliberate: it's the "done early" badge exercise.
- **Show the homework self-checker at the wrap-up**, not just in the handout. Students add one `<script>` tag to their index view — *"exactly like the Bootstrap CDN in week 2, and exactly like week 1's checker"* — then F12 and read the console. It runs the same checks that earn 12 of the homework's 20 points, needs no install, and deliberately avoids the console-paste route: Chrome and Edge block the first paste until you type `allow pasting`, which would hit every student at once. Mention that the red `404` is on purpose, and that `recheck()` re-runs it without a refresh.
- 🔗 **This week's homework starts the semester project.** The app they build tonight is the one they extend in weeks 5 (layout + theme), 6 (forms + validation), 7 (into SQL Server), 8–9 (CRUD + a related table), and carry into the midterm. Say that out loud at the wrap-up — it turns "build the lab again with different nouns" into "start your project," which is a completely different assignment psychologically.
- ⚠️ **Push hard on topic choice at the wrap-up.** They must pick something that can plausibly grow a *second, related list* by week 9 — trails/reviews, games/publisher, players/team. A topic that can't (one flat list of unrelated things) means rebuilding in week 9. Thirty seconds of examples now saves that.
- Part 1 (finishing the Registry) is **not collected and not worth points** — a deliberate change from week 3, where the lab *was* the homework. Say so plainly rather than letting them discover it: it's the guided version of Part 2, and skipping it is what turns a one-hour assignment into a three-hour one.
- Tag helpers (`asp-controller`) appear in the navbar but we write plain `href`s in our own views tonight. If asked: same output, and forms make tag helpers genuinely worth it in week 6. The lecture notes have the one-paragraph answer.
- **If time runs short:** the lab can start at check 1 with 20 minutes and still bank the red-to-green habit. Slide 19 (the chain + week 7) survives anything — it's the one that makes tonight feel like a foundation instead of a detour.
