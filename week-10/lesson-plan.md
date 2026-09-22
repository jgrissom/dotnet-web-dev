# Week 10 — Lesson Plan

**Topic:** the midterm project — nothing new is introduced; the application built since week 4 becomes something worth showing
**Session length:** 3h 45m

> The one night of the term with no new syntax, and the shape of the evening is inverted to match: **a short demo and a long studio block.** The teaching is concentrated in §1, where the room watches an app get looked at honestly for the first time, and the three fixes that follow are deliberately small — a front page, a 404 page, an `@if`. Everything after the second hour is students working on their own apps with you circulating. **The risk tonight is not running out of time. It is running out of material and filling the gap with talk** — the studio is where the value is, so protect it.

## Learning objectives

By the end of this session, students can:

1. Walk their own deployed application as a stranger would, and say why looking at it on a phone finds what a laptop hides.
2. Name the difference between *working* and *finished*, and say why only one of them can be checked by a script.
3. Say what a front page owes a first-time visitor, and write one.
4. Say what `NotFound()` sends as a response body, and what the browser does with that.
5. Give an application a 404 page of its own with `UseStatusCodePagesWithReExecute`, and say why the status code is left alone.
6. Say what a `@foreach` over an empty collection renders, and why they have never seen it.
7. Write an empty state that offers a way out rather than a dead end.
8. Look at a table in their own app and say how a new row gets into it from outside.
9. Read a report that carries no score, and say what it does not cover.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to the slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-10/demo/script.html))
- **Curbside**, copied out of the private answer-keys repo (`week-10/demo-starter/Curbside`) into `~/Repos/dotnet-web-dev-course/instructor/week-10/` — week 9's demo end state **plus the browsable dish list week 9 never typed** — running under `dotnet watch`
- ⚠️ **Your connection string set (`set` only — the `<UserSecretsId>` ships), then `dotnet ef database drop --force` and `dotnet ef database update` run before class *and again after your rehearsal*.** Your rehearsal adds a dish called **Elote Dog** in §4 and it will still be there
- **One integrated terminal** — `dotnet watch`. There is no `dotnet ef` tonight, so the second terminal weeks 7–9 needed is not required
- **One browser window, three tabs** (`/`, `/Trucks/Details/1`, `/Dishes`) — used for the whole night
- **2–3 student Azure URLs** picked in advance for the gallery
- Your finished week-10 Curbside ready for the studio launch — **on localhost. Nothing is deployed for it**

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Deployed-app gallery** *(deck on title slide)*. 2–3 student apps, **2 minutes each, hard stop**. Tonight this doubles as the warm-up for §1 — look at them the way §1 is about to look at Curbside, and say so. |
| 0:10 | 20 min | **The stranger's pass** *(slides 2–3, demo §1)*. **The slide is the exercise.** Then walk Curbside live and build the list on screen: the front page is Microsoft's, Privacy is a page nobody wrote, a wrong id is a blank browser page. ⚠️ **Let the blank page sit** — the room should name it, not you. Ends with three items written down. |
| 0:30 | 15 min | **The front door** *(slide 4, demo §2)*. Rewrite `Views/Home/Index.cshtml`; point out that every piece of it is week 4 or week 5. Then Privacy, deleted in **four** places, counted out loud. 🎯 *"a page you have not written is worse than no page."* |
| 0:45 | 15 min | **The blank page** *(slides 5–6, demo §3)*. Predict off slide 5 — *what does a browser draw when there is no body?* — then show it. ⚠️ **The delete connection is what earns this section**: every saved link to a record you deleted in week 8 lands here. A view, an action, then one line — ⚠️ **in that order, or every 404 becomes a 500 mid-demo.** Two of the edits need a restart; check the terminal and say why. |
| 1:00 | 10 min | **☕ Break** |
| 1:10 | 20 min | **A table nobody can add to** *(slides 7–8, demo §4)*. `/Dishes` is read-only from outside and nobody decided that. Build the Create pair, then **use it** — and the new dish's page is an empty bordered box. **Slide 7 asks the question; don't answer it before the browser does.** Then the `@if`, twice more by paste. |
| 1:30 | 10 min | **The pass, again** *(slide 9, demo §5)*. `recheck()` → *Nothing here a stranger would trip over* — then immediately undercut it. ⚠️ **The right-hand column is the assignment**, and 9 of the 20 points live in it. First week since 3 where the script does not count; say that out loud. |
| 1:40 | 5 min | **Studio launch** *(slide 10, demo §6)*. ~60 seconds of *what done looks like*: the finished Curbside **on localhost. Nothing is deployed for it.** ⚠️ Name the one thing not to do tonight — half-building a login. |
| 1:45 | 50 min | **Studio, part 1** *(slide 10 stays up)*. Their three things first. Circulate. |
| 2:35 | 10 min | **☕ Second break** |
| 2:45 | 50 min | **Studio, part 2** *(slide 10 stays up)*. Front door, empty states, wrong-id page, data, README. |
| 3:35 | 10 min | **Wrap-up** *(slide 11, demo §7)*. Five rows, one sentence each; **front door** gets the emphasis. Homework: finish, deploy, run the pass on the Azure URL. ⚠️ Name the two point-losers: the deleted `@section Scripts` block, and a README with no live URL. Week 11: Identity. |

## Instructor notes

- **Students watch the demo; they don't type along.** Curbside lives only in the private answer-keys repo. Say it in the first minute — and tonight it lands easily, because their keyboard time is most of the evening.
- ⚠️ **The studio is 100 minutes and that is deliberate, not padding.** This is the only week whose assignment *is* the class time. Two 50-minute blocks with a break between them, rather than one long one: a single 100-minute block drifts badly around the seventy-minute mark, and the break gives you a natural moment to ask the room what they have found.
- 🎯 **§1 is the whole lesson and it is the one that can be rushed by accident**, because it contains no code and feels like preamble. It is not preamble. Budget the full twenty minutes, ask the questions, and let the silences run — *"I have never seen this site before. What is it?"* only works if you wait.
- ⚠️ **Protect the blank page in §3.** Go to `/Trucks/Details/999` and stop talking. The room needs a second to register that the site has vanished. Naming it for them turns a realization into a slide.
- ⚠️ **The three fixes are deliberately unimpressive, and someone will say so.** That is a good conversation, not a problem: the honest answer is that finished is made of small things, and that the reason their app is not finished is not that the remaining work is hard. Have that answer ready rather than defending the material.
- 💡 **The `/Dishes` beat in §4 is the one that transfers furthest.** Most students have at least one table that can only be changed by seeding or by opening the mssql panel. The question — *how does a new row get into this table from outside?* — is worth asking at three or four desks during the studio.
- ⚠️ **Three edits tonight need a restart** — a brand-new `.cshtml` in §3, `Program.cs` in §3, and a second new `.cshtml` in §4. `dotnet watch` restarts for them but asks first, over in the terminal while you are typing in the editor. **Answer `a` in §0.** Say why to the room when it comes up: a correct fix that appears to do nothing is the single most expensive thing that can happen to someone working alone at 10pm.
- **The report carrying no score will be queried.** Expect *"so how do I know if I'm done?"* The answer is on slide 9's right-hand column and in the homework's rubric — and it is worth saying plainly that this is what every job after this one is like.
- ⚠️ **Do not let anyone start on authentication.** It will come up, because the stranger's pass surfaces it immediately. It is week 11's entire subject, it cannot be half-done, and an evening spent on it is an evening of the midterm lost. The homework says this too.
- **Circulating question, every desk, same one:** *"what are your three, and which one is the worst?"* It gets a student off their editor and back onto the assignment faster than looking at their code does.
- 📋 **Three students will not have brought a list.** Week 9's reading asked for it; some will have skipped it. Don't make it a thing — send them to their own deployed URL for ten minutes, phone included, and they will catch up.
