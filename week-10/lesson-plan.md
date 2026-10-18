# Week 10 — Lesson Plan

**Topic:** the midterm project — nothing new is introduced; the application built since week 4 becomes something worth showing
**Session length:** 3h 45m

> The one night of the term with no new syntax. Five short demo segments, each followed by a **studio block** in which students make the same move on their own midterm app, then a long open block for the work only they can choose. The teaching is concentrated in §1, where the room watches an app get looked at honestly for the first time; the fixes that follow are deliberately small — a front page, an `@if`, a 404 page. **The risk tonight is not running out of time. It is filling a quiet moment with talk** — the studio is where the value is, so protect it.

## Learning objectives

By the end of this session, students can:

1. Walk their own deployed application as a stranger would, and say why looking at it on a phone finds what a laptop or a PC hides.
2. Name the difference between *working* and *finished*, and say why only one of them can be checked by a script.
3. Say what a front page owes a first-time visitor, and write one.
4. Look at a table in their own app and say how a new row gets into it from outside.
5. Say what a `@foreach` over an empty collection renders, and why they have never seen it.
6. Write an empty state that offers a way out rather than a dead end.
7. Say what `NotFound()` sends as a response body, and what the browser does with that.
8. Give an application a 404 page of its own with `UseStatusCodePagesWithReExecute`, and say why the status code is left alone.
9. Read a report that carries no score, and say what it does not cover.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to the slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-10/demo/script.html))
- **Curbside**, copied out of the private answer-keys repo (`week-10/demo-starter/Curbside`) into `~/Repos/dotnet-web-dev-course/instructor/week-10/` — week 9's demo end state **plus the browsable dish list week 9 never typed** — running under `dotnet watch`
- **§3's copy-in folder**, `week-10/demo-section3/Curbside` in the answer-keys repo — the Dishes Create pair, copied over the running app in one `cp`
- ⚠️ **Your connection string set (`set` only — the `<UserSecretsId>` ships), then `dotnet ef database drop --force` and `dotnet ef database update` run before class *and again after your rehearsal*.** Your rehearsal adds a dish called **Elote Dog** in §3 and it will still be there
- **Two integrated terminals** — `dotnet watch` owns the first; the second runs §3's one `cp`
- **One browser window, four tabs** (`/`, `/Trucks/Details/1`, `/Dishes`, and week 10's homework on github.com) — the homework goes on screen for every studio block. There is no studio slide
- **2–3 student Azure URLs** picked in advance for the gallery

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Deployed-app gallery** *(deck on title slide)*. 2–3 student apps, **2 minutes each, hard stop**. Tonight it doubles as the warm-up for §1 — look at them the way §1 is about to look at Curbside, and say so. |
| 0:10 | 20 min | **The stranger's pass** *(slides 1–3, demo §1)*. First the agenda on the title slide. Then slide 2's two questions, and **slide 3 is the method**. Walk Curbside live and build the list on screen, in the room's words: the front page and its tab are Microsoft's, Privacy is a page nobody wrote, a wrong id lands on the browser's error page. ⚠️ **Let the blank page sit** — the room should name it, not you. Then install this week's self-check and run `recheck()`: **4 findings**, and each one maps to the list. |
| 0:30 | 20 min | **Studio A · Your own pass** *(no slide — the homework on screen)*. ⚠️ **Say that this IS the homework.** Their deployed URL, then their phone, then the self-check swap and `recheck()` on localhost. **Their three are not your three** — star three more of their own. Don't start on login. On Zoom, collect the threes in the chat. **Stop:** a written list with three of their own starred, and `recheck()` has printed. |
| 0:50 | 15 min | **The front door** *(slide 4, demo §2)*. Paste a new `Views/Home/Index.cshtml` — the `@section Scripts` block goes back in at the bottom. Then **the one real failure of the night**: white on white under Darkly, found in DevTools' Computed tab, fixed with `data-bs-theme="dark"` and `btn-outline-light`. Then Privacy, deleted in **four** places, **links first, file last** — deleting the file is the night's first restart prompt; answer `a`. `recheck()`: **1 finding**. |
| 1:05 | 15 min | **Studio B · Front door and Privacy** — requirements 1 and 2. **Stop:** their own front page, looked at; a tab title; Privacy real or gone; three findings gone. |
| 1:20 | 10 min | **☕ Break** |
| 1:30 | 15 min | **A table nobody can add to** *(slide 5, demo §3)*. `/Dishes` is read-only from outside, and nobody decided that. **Copy in the Create pair with one `cp`** and look at the redirect line only. Ask against `Views/Dishes/Details.cshtml` what a brand-new dish's page draws, then add **Elote Dog** and Inspect the empty `<ul>`. Slide 5 for the rule, then the `@if` on Details and on both list pages. |
| 1:45 | 13 min | **Studio C · Empty states** — requirement 3. A brand-new record through their own form, its page, then both `@if`s. **Stop:** a new record's page that says something with a way out, and a list-page `@if`. The script can't see this. |
| 1:58 | 15 min | **The blank page** *(slide 6, demo §4)*. The wrong id with DevTools' Network tab open — `404`, nothing in the response — and the `NotFound()` guard in the editor. ⚠️ **The delete connection earns the section**: every saved link to a record deleted in week 8 lands here. Slide 6 is the plan. A view, an action, then one line — ⚠️ **in that order, or every 404 becomes a 500.** `Program.cs` needs a restart. |
| 2:13 | 12 min | **Studio D · The wrong-id page** — requirement 4. **Stop:** their own page on a wrong id, still `404` in Network, the finding gone. |
| 2:25 | 10 min | **☕ Break** |
| 2:35 | 10 min | **The pass, again** *(slide 7, demo §5)*. `recheck()` → *Nothing here a stranger would trip over* — ask whether that means finished, then slide 7 answers it. ⚠️ **The right-hand column is the assignment**, and 9 of the 20 points live in it. |
| 2:45 | 50 min | **Studio E · Your three things** *(no stop)*. Their three things first, then data, README, commits — and **deploy before they leave**, running the pass on the Azure URL. *Bring me your list, not your bugs.* Circulate, or run a chat queue on Zoom. |
| 3:35 | 10 min | **Wrap-up** *(slide 8, demo §6)*. Five rows, one sentence each; **front door** gets the emphasis. ⚠️ Name the two point-losers: the deleted `@section Scripts` block, and a README with no live URL. Week 11: Identity. |

> [!NOTE]
> **The table sums to exactly 225 minutes: 75 of demo, 110 of studio in five blocks, 20 of break, and 20 of gallery and wrap-up.** Two changes from the unchunked week, both by design: the 5-minute studio launch is gone (its lines open Studio A and Studio E), and the dishes segment drops from 20 to 15 because the Create pair is copied in rather than pasted. The demo order now matches the homework and the notes — front door, empty states, wrong id. **The longest stretch of watching is 20 minutes, §1**, where it used to be 105 minutes of demo, with one break, before the studio began; the gallery sits in front of §1, the same shape as week 9. **If the night runs long, the minutes come out of Studio E — the one block the homework finishes at home — never out of a break.** **If the demo runs fast, the time goes to Studio E.**

## Instructor notes

- **The studio comes in five blocks, each one right after the demo segment it mirrors.** Every block but the last ends at an **In class, stop here** note in `homework.md` — that is what is on screen, so it is where the stops live. A stop is a **state of the student's own app** plus what `recheck()` prints, because there are no checks to count. The cue sheet's `## Studio` sections say what to say, what to watch for, and which note each block stops at. Studio E has no stop.
- **Students watch the demo; they don't type along.** Curbside lives only in the private answer-keys repo. Say it in the first minute — tonight it lands easily, because their keyboard time is most of the evening.
- ⚠️ **The studio IS the homework, and you have to say so** — the line is the first beat of Studio A. Nine weeks have taught them that the lab is a different app and never collected; without the sentence, some will treat tonight as practice and start again at home.
- 🎯 **§1 is the whole lesson and it is the one that can be rushed by accident**, because it contains no code and feels like preamble. Budget the full twenty minutes, ask the questions, and let the silences run — *"I have never seen this site before. What is it?"* only works if you wait.
- 🎯 **§1 ends by running the script, and that order is the point.** The room makes the list first; the script then prints four findings and every one of them is already on the list. That is the evidence for §5's claim: the script finds what a stranger can see, and nothing a student's three things are about.
- ⚠️ **The restart prompt first appears in §2, when `Privacy.cshtml` is deleted** (`ENC0033: Deleting class … requires restarting`). Answer **`a`**, and every later edit that needs a restart gets one by itself: §3's copied-in `Create.cshtml`, §4's `Missing.cshtml`, and §4's `Program.cs` line. Measured on a pty-driven `dotnet watch`: with `y` answered at the first prompt instead, the `Program.cs` edit printed `⚠  Press "Ctrl + R" to restart.` and the wrong id stayed blank until Ctrl+R. Say what the prompt is when it first appears — the room meets the same one in Studio B.
- ⚠️ **Privacy comes out links first, file last.** Measured: deleting the view first, then restarting, leaves `/Home/Privacy` answering **500** until the action goes too. Links → action → view never leaves a link to a broken page.
- ⚠️ **Protect the blank page.** In §1, change the id to `999` and stop talking. The room needs a second to register that the site has vanished.
- ⚠️ **The fixes are deliberately unimpressive, and someone will say so.** The honest answer is that finished is made of small things, and that the reason an app is not finished is rarely that the remaining work is hard. Have that answer ready rather than defending the material.
- 💡 **§3's opening question transfers furthest:** *how does a new row get into this table from outside?* Most students have a table only a seed or the mssql panel can change. It is Studio C's early-finisher item, and worth asking at three or four desks.
- ⚠️ **If the build prints yellow `NU1902`/`NU1903` warnings and two `Msbuild failed` lines** — the `System.Security.Cryptography.Pkcs` advisory from week 9, which every SQL Server project in the course carries, Curbside and the students' own apps alike. §1 names it in one conditional beat. Every document says *if*, so nothing goes false when a fixed SQL Server package arrives.
- **The report carrying no score will be queried.** Expect *"so how do I know if I'm done?"* The answer is on slide 7's right-hand column and in the homework's rubric — and it is worth saying plainly that this is what every job after this one is like.
- ⚠️ **Do not let anyone start on authentication.** The stranger's pass surfaces it immediately. It is week 11's entire subject, it cannot be half-done, and an evening spent on it is an evening of the midterm lost. Studio A says so before anyone starts, and so does the homework.
- **One question, asked of everyone, however you are teaching:** *"what are your three, and which one is the worst?"* It gets a student off their editor and back onto the assignment faster than looking at their code does. **On Zoom, collect the threes in the chat during Studio A** — you get the set in writing, and it doubles as your map of who is stuck. In Studio E, run a queue in the chat and take screen-shares in order. Breakout rooms are the wrong tool: everyone is working alone, so they only move students further from you.
- ⚠️ **Their three cannot be your three.** The front door, the template pages, the empty states and the wrong-id page are the floor — everybody does them, and they are exactly what you demoed. Without the Studio A line, a student writes down your list and the 4 points meant to measure their own judgement measure their memory instead.
- 🎯 **Push them to deploy before they leave.** Nothing about `az webapp up` needs to happen at home, and a broken deploy is a five-minute problem with you present and an evening-ender without you. Studio E's launch says so.
- 📋 **Some students will not have brought a list.** Week 9's reading asked for it. Don't make it a thing — Studio A is twenty minutes of exactly that walk.
- **Nothing you show is deployed.** Curbside runs on localhost all night; Studio E's launch says so out loud, because the course's own rule is that the deployed app is the grade.
