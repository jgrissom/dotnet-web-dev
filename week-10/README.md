# Week 10 — The Midterm Project

The one night with nothing new in it. No package, no migration, no syntax — instead, the application everyone has been extending since week 4 gets looked at honestly for the first time and then finished. The demo does on Curbside exactly what the homework asks: walk it like a stranger, write down what is wrong, and fix it. Three things come out of that walk and all three are universal — a front page that still belongs to Microsoft, a page in the navbar nobody ever wrote, and a wrong id that lands on a blank browser page because `NotFound()` sends no body at all. Along the way a table turns out to be read-only from the outside, a brand-new record turns out to render as a heading with nothing under it, and the self-check — for the first time since week 3 — **scores nothing**, because what is being graded this week is judgement and no script has any.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, choosing your own three things, **troubleshooting appendix** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-10/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside gets finished* — picks up where week 9 left it; [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-10/demo/script.html) |
| In&nbsp;class,&nbsp;last&nbsp;100&nbsp;min | 🛠️&nbsp;**Studio** | **No lab this week.** Students work on their own app, in two 50-minute blocks with a break — see the timing table |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | *The stranger's pass* — **scores nothing**, prints findings; **read-only**, submits nothing and writes no rows |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | The midterm: their own app becomes something worth showing; URL + repo via Canvas |

> [!NOTE]
> **There is no lab, no `*.Checks` project and no starter to pull this week** — so nothing to `git pull` from `dotnet-web-starters`, and no `dotnet test`. A red-to-green ladder on a shared starter is the wrong instrument for a midterm that lives in a dozen-plus different codebases. The session's hands-on time is the studio block, on their own apps.

## What students walk out with

**The habit of looking at their own work from outside it.** They can walk a deployed application as a stranger and say why looking at it on a phone finds what a laptop hides; name the difference between *working* and *finished*; say what a front page owes a first-time visitor and write one; say what `NotFound()` sends as a body and what a browser does with nothing; give an app a 404 page of its own while leaving the status code alone; say what a `@foreach` over an empty collection renders and why they have never seen it; write an empty state that offers a way out instead of a dead end; look at a table and ask how a new row gets into it from outside; and read a report that carries no score without mistaking a clean one for a finished one.

## 📋 Before class, don't forget

- **Deployed-app gallery** — 2–3 student Azure URLs picked in advance; 2 minutes each. Tonight it doubles as the warm-up for §1 — look at them the way §1 is about to look at Curbside, and say so
- ⚠️ **Copy `week-10/demo-starter/Curbside` out of the private answer-keys repo**, set your secret (`set` only — the id ships), then `dotnet ef database drop --force` and `dotnet ef database update` — **after your last rehearsal**. Your rehearsal adds a dish called **Elote Dog** in §4 and it will still be there
- **One browser window, three tabs** (`/`, `/Trucks/Details/1`, `/Dishes`) — used all night
- **One terminal is enough** — `dotnet watch`. There is no `dotnet ef` tonight
- ⚠️ **Answer `a` at the first restart prompt.** Three edits tonight force a restart — a new `.cshtml` in §3 and another in §4, plus `Program.cs`, which only runs at startup. ⚠️ **§3 builds view → action → middleware, and that order matters** — wiring it up first makes every wrong-id URL a `500`
- ⚠️ **Protect the blank page in §3.** Go to `/Trucks/Details/999` and stop talking; the room needs a second to register that the site has vanished
- 🎯 **Budget the full twenty minutes for §1.** It contains no code and feels like preamble. It is the lesson
- ⚠️ **Nobody starts on authentication tonight.** The stranger's pass surfaces it immediately; it is week 11's whole subject and cannot be half-done
- Your finished week-10 Curbside ready for the studio launch — **on localhost, nothing deployed for it**

**Prev:** [← Week 9 — Related Data](../week-09/README.md) · **Next:** Week 11 — ASP.NET Core Identity *(coming)*
