# Week 1 Lab — JS Refresher Gauntlet

Work through the 8 exercises in `starter/exercises.js`. Each one is a small function with a `// TODO` — your job is to make it work.

**Time:** ~35 minutes in class. Exercises 7–8 roll into homework if you run out of time.
**Pairs encouraged.** Talk through each one before typing.

## Setup

1. Clone the course repo (first time only — future weeks just need `git pull`):
   ```bash
   git clone https://github.com/jgrissom/dotnet-web-dev.git
   ```
2. **Copy** the `week-01/lab/starter` folder out of the clone into your own projects folder — never work inside the clone itself.
3. Open your copy in VS Code.
4. Open `index.html` in your browser (double-click is fine).
5. Open DevTools (**F12**) → **Console** tab.

The page runs a check for every exercise. The console shows ✅ or ❌ per exercise — refresh the browser after each save to re-run.

> [!TIP]
> **The goal — and the workflow:** take it one check at a time. Pick the first ❌, modify just that function, save, refresh, and watch it flip to ✅. Then move to the next one. Repeat until the console says **8 / 8 passing**. Don't try to write all eight and debug at the end — one red-to-green at a time is how real developers work too.

## The exercises

All in `starter/exercises.js`:

1. **`describeScore`** — template literal practice
2. **`isPassing`** — comparison + strict equality
3. **`curve`** — `map`
4. **`passingScores`** — `filter`
5. **`findStudent`** — `find` on an array of objects
6. **`honorRollNames`** — chain `filter` + `map`
7. **`formatStudent`** — destructuring + template literal
8. **`addStudent`** — spread (no mutation!)

## 🆘 Stuck?

Open this week's [lecture-notes.md](../lecture-notes.md) — every pattern these exercises need is in there, explained with examples. Find the pattern, understand it, then adapt it to the exercise (don't hunt for something to copy — the notes use different data on purpose). [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) is your second stop.

## Rules

> [!IMPORTANT]
> - `const`/`let` only — no `var`
> - `===` only — no `==`
> - Exercise 8: mutating the original array fails the check on purpose
>
> These same rules carry deductions on the homework — build the habit here where it's free.

## 🚀 Done early?

- Rewrite exercises 3–6 as classic `function` declarations, then back to arrows. Which reads better?
- Bonus: add a `classAverage(students)` function that returns the mean GPA using [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) — we didn't cover it; the docs are the exercise.
