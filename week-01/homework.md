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

Create a file `homework.js`. Copy this data to the top:

```js
const courses = [
  { code: "WEB210", title: "Intro to Web", credits: 3, enrolled: 24, cap: 30 },
  { code: "WEB250", title: ".NET Web Dev", credits: 4, enrolled: 30, cap: 30 },
  { code: "DAT200", title: "SQL Fundamentals", credits: 3, enrolled: 12, cap: 25 },
  { code: "PRG115", title: "Intro to C#", credits: 4, enrolled: 28, cap: 30 },
];
```

Write the following functions.

> [!WARNING]
> **Rules, enforced in grading:** `const`/`let` only, `===` only, arrow functions, and no mutation of `courses`. Each `var`, `==`, or mutation costs a point — see the deductions row below.

1. `courseLine(course)` — returns `"WEB250: .NET Web Dev (4 credits)"` for the given course. Use destructuring + a template literal.
2. `isFull(course)` — returns `true` if `enrolled` equals `cap`.
3. `openCourses(courses)` — returns a new array of the course **objects** that are not full.
4. `courseTitles(courses)` — returns an array of just the titles.
5. `openCourseLines(courses)` — returns an array of `courseLine`-formatted strings for open courses only. Chain `filter` + `map`, reusing functions you already wrote.
6. `findCourse(courses, code)` — returns the course object with the given code, or `undefined`.
7. `addCourse(courses, newCourse)` — returns a **new** array with the course appended. No `.push()`.
8. `totalCredits(courses)` — returns the sum of all credits. Use the [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) docs — reading documentation for a method we didn't cover is part of the assignment.

At the bottom of the file, call each function once and `console.log` the result, e.g.:

```js
console.log(courseLine(courses[1]));      // "WEB250: .NET Web Dev (4 credits)"
console.log(openCourseLines(courses));    // ["WEB210: Intro to Web (3 credits)", ...]
console.log(totalCredits(courses));       // 14
```

### Check yourself before you submit

Same deal as the lab: copy [`homework-checks.js`](homework-checks.js) from the course repo into your homework folder, and load it in your `index.html` **after** your own script:

```html
<script src="homework.js"></script>
<script src="homework-checks.js"></script>
```

Refresh → the console grades all 8 functions ✅/❌ and warns about any `var`/`==` deductions.

> [!TIP]
> **This is the exact same check I grade with.** If your console says 8 / 8 and no deduction warnings, the function points are yours. Work it one ❌ at a time, just like the lab — and leave the checker in your repo when you submit; it doesn't affect anything.

## Part 4 — Ship it to GitHub Pages (graded)

In this course, nothing stays on your laptop. Your JavaScript work goes live on GitHub Pages; starting week 3, your .NET apps deploy to Azure.

1. Create a GitHub account if you don't have one (use your school email — it also qualifies you for the [GitHub Student Developer Pack](https://education.github.com/pack)).
2. Create a **public** repo named `web-dev-week01`.
3. In your homework folder, create an `index.html` that loads your script:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head><meta charset="UTF-8"><title>Week 1 Homework</title></head>
   <body>
     <h1>Week 1 Homework — YOUR NAME</h1>
     <p>Open the console (F12) to see the output.</p>
     <script src="homework.js"></script>
   </body>
   </html>
   ```
4. Push your work — and **commit as you go**, not once at the end:
   ```bash
   git init
   git add .
   git commit -m "Page skeleton and data"
   # ...write some functions, get them passing...
   git add .
   git commit -m "Functions 1-4 passing"
   # ...finish up...
   git add .
   git commit -m "All checks green"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/web-dev-week01.git
   git push -u origin main
   ```

> [!NOTE]
> **At least 3 meaningful commits.** Your commit history is the story of your work — a single giant "done" commit at 11:58pm tells a different story, and costs a point. A natural rhythm: commit every time the checker turns something green.
5. Enable Pages: repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
6. Wait ~1 minute, then visit `https://YOUR-USERNAME.github.io/web-dev-week01/` — open the console (F12) and confirm your output appears.
7. Submit that URL.

> [!IMPORTANT]
> **Test your URL in a private/incognito window before submitting** — if it 404s for you, it 404s for me, and a dead link grades as not submitted.

## 📊 Grading (24 pts)

| Item | Points |
|------|--------|
| Part 1 screenshots | 4 |
| Functions 1–7 correct (2 pts each) | 14 |
| Function 8 (`reduce`) | 2 |
| Part 4: Pages URL live, console output visible | 4 |
| **Deductions:** any use of `var` or `==`, or mutating `courses`; fewer than 3 meaningful commits | −1 each |

*Reminder: the explain-it standard applies — be ready to walk me through any line you submitted.*

## 📖 Reading for next week (~20 min)

Next week is **Bootstrap** — you'll build and deploy a styled multi-page site.

- [Bootstrap docs: Grid](https://getbootstrap.com/docs/5.3/layout/grid/) — skim the first few sections; we live-code it next class.
- Browse [bootswatch.com](https://bootswatch.com) and shortlist 2–3 themes you'd want for your own site.
- Browse [fonts.google.com](https://fonts.google.com) for 10 minutes — find a heading font and a body font you like together.
