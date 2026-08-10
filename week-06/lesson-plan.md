# Week 6 — Lesson Plan

**Topic:** Forms, model binding, data annotations, `ModelState`, POST-Redirect-GET, client-side validation
**Session length:** 3h 45m

> The night the app stops being a pamphlet. For five weeks data has travelled one way — out of a hard-coded list, through a view, onto a screen — and tonight it comes back the other way for the first time. Three segments carry the week: **§1's plain HTML form** (which makes model binding visibly just name-matching), **§3's two breaks** (a nameless truck rated 9000 getting filed, and a refresh creating a duplicate), and **§4's last two minutes** (defeating client-side validation and watching the server refuse anyway). Everything else exists to earn those.

## Learning objectives

By the end of this session, students can:

1. Explain how model binding turns a form submission into a C# object, and name what it matches on.
2. Write a form with `asp-for`, `asp-validation-for` and `asp-validation-summary`, and say what each generates.
3. Write a GET/POST action pair and explain why `[HttpPost]` is required.
4. Put `[Required]`, `[StringLength]`, `[Range]` and `[Display]` on a model and describe what each produces in the HTML.
5. Guard an action with `ModelState.IsValid`, re-render the form with the user's input intact, and explain why attributes alone enforce nothing.
6. Explain POST-Redirect-GET by describing what a refresh does without it.
7. Say why client-side validation is not a substitute for the server check.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, with all predict-then-run answers and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-06/demo/script.html))
- **Curbside**, copied out of the private answer-keys repo (`week-06/demo-starter/Curbside`) to a scratch folder, running under `dotnet watch`, with **two browser tabs parked** on `/Trucks` and `/Trucks/Details/2`
- **Dev tools open on the Network panel** before you start — you need it in §1 and again in §3
- **2–3 student Azure URLs** picked in advance for the gallery
- Your finished Registry with a working form + `dotnet test` at 6/6, ready to show at lab launch

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Deployed-app gallery** *(deck on title slide)*. 2–3 student apps, **2 minutes each, hard stop** — week 5's themes make this a better gallery than last week's. Collect last week's reading **while an app is on screen**: *"what do you think `_ValidationScriptsPartial.cshtml` is for?"* Take two guesses, write them on the board, and tell them you'll settle it at 2:15. Update the working-regions list. |
| 0:10 | 30 min | **The round trip** *(slides 2–7, demo §1)*. **Start with the plain HTML form** — no tag helpers, no `@model`, week-2 markup — and a POST action that does nothing but `Console.WriteLine` what arrived. The whole segment is one moment: *a `Truck` arrived fully populated and I wrote nothing to build it.* Then the Network tab (the payload is week 3's query-string format, in the body), then **break #1**: rename one `name` attribute **and** type `banana` into Rating, so both silent failures land in the terminal underneath the good result. Then **break #2**: delete `[HttpPost]` and the page 500s with `AmbiguousMatchException`. **Both restores are in the script.** |
| 0:40 | 35 min | **The same form, with tag helpers** *(slides 8–11, demo §2)*. Rebuild one field with `asp-for` and View Source it: four jobs from one attribute. Then the whole form as a paste. Land the checkbox and its hidden companion field. Then the antiforgery token — **and say explicitly that Razor puts it in *every* post form**, including §1's hand-written one, because "the tag helper added it" is the obvious wrong conclusion. |
| 1:15 | 10 min | **☕ Break** |
| 1:25 | 40 min | **Rules that live on the model** *(slides 12–18, demo §3)*. **Load-bearing.** Ask where validation belongs and walk past the two wrong answers before landing on the model. Annotations, then refresh and watch the *label* change and `data-val-*` appear in the HTML — park that, it pays off in §4. Then `ModelState.IsValid` and the guard. Then **break #3** (delete the guard, file a nameless truck rated 9000) and **break #4** (return `View(...)` instead of redirecting, then hit refresh and get two trucks). See the instructor notes. |
| 2:05 | 10 min | **☕ Break** |
| 2:15 | 20 min | **The same rules, in the browser** *(slides 19–21, demo §4)*. Open `_ValidationScriptsPartial.cshtml` and **collect week 5's promise out loud** — and settle the guesses from the board. One `@section Scripts` block, and the errors appear instantly. Then **break #5**: add `novalidate` in dev tools, submit, and the server refuses it anyway. **Do not rush the sentence at the end of that.** |
| 2:35 | 10 min | **Where the truck actually went** *(slide 22, demo §5)*. Add a truck, `Ctrl+C`, restart, reload. It's gone. `static List<T>` lives as long as the process. Warn them about free-tier Azure sleeping before the homework. Hand off to week 7 pointing at the controller: *one line changes.* |
| 2:45 | 50 min | **Lab: the Registry takes reports** *(slide 23)*. Launch with ~90 seconds of *what done looks like* — a working form + `dotnet test` printing **6 / 6**. Then the setup, said once: **`git pull` → copy `week-06` out and rename → open the folder holding *both* projects → `dotnet test Cryptids.Checks`**. **In-class target: checks 1–5.** |
| 3:35 | 10 min | **Wrap-up** *(slide 24, demo §7)*. The round-trip diagram. Homework: their own app gets a Create form. Then week 7: the list becomes a table. |

## Instructor notes

- **Students watch the demo; they don't type along.** That's the model for every week, and it's enforced here twice over: Curbside lives only in the private answer-keys repo, and the lab is a different app on a different topic. Say it out loud at the start — otherwise a few people open VS Code, hit §2's paste block, and spend the rest of the segment catching up instead of listening. Their keyboard time is the 50-minute lab, where `dotnet test` answers them and you're in the room.
- **Do not skip the plain HTML form in §1, even though it's throwaway.** It is four minutes, and it is the entire reason the rename-a-`name`-attribute break means anything. Teach `asp-for` first and students conclude that binding is something tag helpers do — then, when a field arrives empty in the lab, they have no model for why. The order is the lesson.
- **The terminal is a display surface in §1, not just where the app runs.** Size it for the back row, and clear it deliberately: wipe it before the good submission so one object is on screen, then **leave it alone** through break #1 so the broken result lands directly underneath. *(Clearing is **⌘K** or right-click → Clear — typing `clear` does nothing, because `dotnet watch` has that terminal and the shell isn't at a prompt.)* The two blocks side by side are the beat — `Content()` could never do that, because it only ever shows the latest submission.
- **`Console.WriteLine` is doing real work in §1.** No view, no redirect, no validation — just "print what arrived and look at it." It keeps the first ten minutes about *one* idea. Resist the urge to wire up the real action early.
- **`x2 = {truck.Rating * 2}` is not filler.** It's the only proof on offer that binding *converted* rather than copied — you cannot multiply a string. Without it, "a `Truck` object arrived" is something they take on your word. Say the sentence: *"the browser sent me the characters four-point-one; what arrived was a number."*
- **Don't volunteer `ILogger`.** `Console.WriteLine` in a controller isn't what production code does, and someone may ask. If they do: *"real apps log through `ILogger` — same idea, more machinery."* That's the whole answer. Logging is taught nowhere in this course, nothing they build this term behaves differently for knowing it, and the sentence costs you a tangent in the tightest segment of the night.
- **The two §3 breaks are the ones to protect.** If §1 or §2 overran, take it out of §4's second half, not out of these. *"The annotations did their job — they recorded the problem and nobody read the record"* is the sentence the whole segment is built on, and it only works after they've watched the nameless truck appear.
- **Break #4 needs the address bar on screen.** The point isn't that `View("Index", …)` fails — it works, and the list appears. The point is that the URL still says `/Trucks/Create`, so the browser thinks the page it's showing *is* the POST. Point at the address bar before you hit refresh, or the duplicate looks like magic.
- **Say the silent failure out loud in §1**, even though you don't demo it: writing only the GET `Create()` and no POST action means clicking Submit returns a **blank form** with no error and nothing in the log. It's the single most common way this lab stalls, and thirty seconds of warning saves five minutes of table-visiting.
- **Razor adds the antiforgery token to every `<form method="post">`.** Say it explicitly in §2. Everyone's natural conclusion is that `asp-action` bought it, and the honest version is better: it's free, and `[ValidateAntiForgeryToken]` is what makes the server actually *look*.
- **`Rating` is a `double`, so it renders `type="text"`, not `type="number"`** — the number box is for integral types. Don't promise otherwise. What it *does* gain is `data-val-number`, which is a nicer callback anyway: it's the "what if they type banana" question from §1, now visible in the HTML. *(The Cryptid's `FirstSighting` is an `int` and does get `type="number"`, so the lab shows the other half.)*
- **Warn about the implicit required before it bites.** A non-nullable `int` or `double` complains when left blank even with no `[Required]`, because there's nowhere to put "empty". The actionable half is short: make it `int?` if it's genuinely optional. Say that and move on; the type theory behind it is not worth the minutes.
- **§4's closing sentence is the security lesson of the course so far.** *"Anything in the browser is a suggestion — it's someone else's computer."* Say it slowly, and connect it to the order you taught in: server first, browser second, deliberately.
- 🔗 **Week 5 set this week up twice and both promises get collected tonight** — `_ValidationScriptsPartial` in §4, and the `@section Scripts` mechanism that delivers it. Collect them out loud; it's the tightest hand-off in the course and students notice when a promise is kept.
- **The lab's checks post to their form.** Check 4 files a report called *The Beast of Bray Road* and it stays in their registry until the app restarts. Say so at lab launch — otherwise the first person to notice a creature they didn't create will think they broke something.
- **The lab starter arrives with week 5's shell on it**, so nobody is blocked tonight by an unfinished week 5 — say that at launch, it visibly relaxes the room. But their *homework* needs their own week-5 app working; catch anyone in that hole during the lab.
- **Name the one exact string the checks want** — `[Display(Name = "First sighted")]`. It's in the lab README, but saying it once prevents a run of confused failures.
- **The lab has 50 minutes, more than week 5's 45**, because there are five tasks rather than four and two of them are controller code. Tasks 5 and 6 are three lines each; the real work is tasks 3 and 4. **If time runs short, take it out of §4, not the lab** — a student who never wrote a POST action in class will not write one alone at 10pm.
