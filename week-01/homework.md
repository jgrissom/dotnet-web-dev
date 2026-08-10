# Week 1 Homework

**Due:** before the start of Week 2's class.
**Submit via Canvas:** the two screenshots from Part 1 + your **GitHub Pages URL** from Part 4 (your code is graded from your repo — no file uploads).

## Part 1 — Environment proof (required, not graded on style)

Your toolchain **must** be working before week 2. Submit two screenshots:

1. A terminal showing the output of `dotnet --version` (must start with `10.`) **and** `git --version`.
2. VS Code with the **SQL Server (mssql)** extension connected to the school SQL Server using your own account — the connection tree with databases visible.

> [!IMPORTANT]
> Stuck? Rework the step in [setup-guide.md](setup-guide.md), check the troubleshooting appendix at the bottom of `lecture-notes.md`, then **email me before class** — don't show up to week 2 broken. Every week from here builds on a working toolchain.

## Part 2 — Finish the lab

If you didn't finish exercises 1–8 in class, finish them. The console must show **8 / 8 passing**. (You don't submit this — the skills reappear in Part 3.)

## Part 3 — Roster functions (graded)

Set up a homework folder the same way the lab worked — a page that loads your script, so the browser console is your test loop from the first line you write:

1. **In `dotnet-web`, create a folder named `web-dev-week01`** — the same name as the repo you push it to in Part 4 — holding three files: `index.html`, an empty `homework.js`, and a copy of **`homework-checks.js`**.

   You don't have the course repo on your machine — you read it in the browser — so download that one file: open [`homework-checks.js`](homework-checks.js), click **Download raw file** (the ⤓ button above the code), and move it into your folder next to the other two.
2. `index.html`:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head><meta charset="UTF-8"><title>Week 1 Homework</title></head>
   <body>
     <h1>Week 1 Homework — YOUR NAME</h1>
     <p>Open the console (F12) to see the output.</p>
     <script src="homework.js"></script>
     <script src="homework-checks.js"></script>
   </body>
   </html>
   ```
3. Open `index.html` in the browser, console on (**F12**). It says **0 / 8 functions passing** — the assignment is turning those green, one at a time, refreshing after every save. Same rhythm as the lab.

> [!TIP]
> **Recommended: open it with Live Server instead of double-clicking.** In VS Code, Extensions → search **Live Server** (by Ritwick Dey) → Install. Then right-click `index.html` → **Open with Live Server**. It serves the page at `http://127.0.0.1:5500` and reloads the browser every time you save, so you stop alt-tabbing to hit refresh.
>
> It also unlocks the checker's **whole-file scan**. A page opened straight from disk (`file://`) isn't allowed by the browser to read its own `.js`, so that scan can't run — the checker will say so and still scan your eight functions. Over Live Server you get the full check with line numbers. It's optional; nothing is graded on it. You'll want it again in week 2.

Now, in `homework.js`, copy this data to the top:

```js
const courses = [
  { code: "WEB210", title: "Intro to Web", credits: 3, enrolled: 24, cap: 30 },
  { code: "WEB250", title: ".NET Web Dev", credits: 4, enrolled: 30, cap: 30 },
  { code: "DAT200", title: "SQL Fundamentals", credits: 3, enrolled: 12, cap: 25 },
  { code: "PRG115", title: "Intro to C#", credits: 4, enrolled: 28, cap: 30 },
];
```

**Now start the git history — before you write a single function.** Three meaningful commits are part of the grade, and they only exist if you make them as you go. In the VS Code terminal (`` Ctrl+` ``), from inside `web-dev-week01`:

```bash
git init
git add .
git commit -m "Page skeleton and data"
```

Then commit each time the checker turns something green. One commit per function is a perfectly good rhythm — **three is the floor, not the target**, so more and smaller is always the safer side to be on. Part 4 pushes whatever history you built here.

> [!WARNING]
> **This is the one part of the homework you cannot go back and do.** A single "done" commit at 11:58pm costs a point, and by then the only fix is dishonest. It is two seconds each time.

Write the following functions. Some come with a hint; some deliberately don't — for those, *choosing* the right tool from [the big three](lecture-notes.md#the-big-three-map-filter-find) is part of the exercise.

> [!WARNING]
> **Rules, enforced in grading:** `const`/`let` only, `===` only, arrow functions, and no mutation of `courses`. Each `var`, `==`, or mutation costs a point — see the deductions row below.

1. `courseLine(course)` — returns `"WEB250: .NET Web Dev (4 credits)"` for the given course. Use [destructuring](lecture-notes.md#destructuring-and-spread) + a [template literal](lecture-notes.md#template-literals).
2. `isFull(course)` — returns `true` if `enrolled` equals `cap` (remember [`===`](lecture-notes.md#equality--always)).
3. `openCourses(courses)` — returns a new array of the course **objects** that are not full.
4. `courseTitles(courses)` — returns an array of just the titles.
5. `openCourseLines(courses)` — returns an array of `courseLine`-formatted strings for open courses only. Don't start from scratch: `openCourses` and `courseLine` already do the heavy lifting — chain them together with [`map`](lecture-notes.md#the-big-three-map-filter-find). This one can be a single short line.
6. `findCourse(courses, code)` — returns the course object with the given code, or `undefined`.
7. `addCourse(courses, newCourse)` — returns a **new** array with the course appended. No `.push()` — this is [spread](lecture-notes.md#destructuring-and-spread). A course to test with:
   ```js
   { code: "WEB300", title: "Advanced Web Topics", credits: 4, enrolled: 0, cap: 30 }
   ```
   **⚠️ Afterward, check `courses` in the console — still 4 courses? It'd better be.**
8. `totalCredits(courses)` — returns the sum of all credits. Use the [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) docs — reading documentation for a method we didn't cover is part of the assignment.

At the bottom of the file, call each function once and `console.log` the result, e.g.:

```js
console.log(courseLine(courses[1]));      // "WEB250: .NET Web Dev (4 credits)"
console.log(openCourseLines(courses));    // ["WEB210: Intro to Web (3 credits)", ...]
console.log(totalCredits(courses));       // 14
```

### When are you done?

When the console says **8 / 8 functions passing** and the scan under it is clean — it names any `var`, `==` or `!=` it finds in your eight functions.

If you're running from `file://`, the checker will also tell you the *whole-file* scan was skipped; that's expected, and it runs on Live Server or once your page is on GitHub Pages. Either way, anything inside your eight functions is caught wherever you open it.

> [!TIP]
> **The checker is the exact same check I grade with.** 8 / 8 and no warnings means the function points are yours. Leave `homework-checks.js` in your repo when you submit — it doesn't affect anything.

## Part 4 — Ship it to GitHub Pages (graded)

In this course, nothing stays on your laptop. Your JavaScript work goes live on GitHub Pages; starting week 3, your .NET apps deploy to Azure.

1. Create a GitHub account if you don't have one (use your school email — it also qualifies you for the [GitHub Student Developer Pack](https://education.github.com/pack)).
2. Create a **public** repo named `web-dev-week01`.
3. **Check the history first.** `git log --oneline` should show **at least three** commits reading like the work happening, not one giant "done". Commit whatever is still outstanding:
   ```bash
   git add .
   git commit -m "All checks green"
   ```
4. Now push it:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/web-dev-week01.git
   git push -u origin main
   ```
5. Enable Pages: repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
6. Wait ~1 minute, then visit `https://YOUR-USERNAME.github.io/web-dev-week01/` — open the console (F12) and confirm your output appears.
7. Submit that URL.

> [!IMPORTANT]
> **Test your URL in a private/incognito window before submitting** — if it 404s for you, it 404s for me, and a dead link grades as not submitted.

## 📊 Grading (20 pts)

| Item | Points |
|------|--------|
| Part 1 screenshots | 2 |
| Functions 1–7 correct (2 pts each) | 14 |
| Function 8 (`reduce`) | 2 |
| Part 4: Pages URL live, console output visible | 2 |
| **Deductions:** any use of `var` or `==`, or mutating `courses`; fewer than 3 meaningful commits | −1 each |

*Reminder: the explain-it standard applies — be ready to walk me through any line you submitted.*

## 📖 Reading for next week (~20 min)

Next week is **Bootstrap** — you'll build and deploy a styled multi-page site.

- [Bootstrap docs: Grid](https://getbootstrap.com/docs/5.3/layout/grid/) — skim the first few sections; we live-code it next class.
- Browse [bootswatch.com](https://bootswatch.com) and shortlist 2–3 themes you'd want for your own site.
- Browse [fonts.google.com](https://fonts.google.com) for 10 minutes — find a heading font and a body font you like together.
