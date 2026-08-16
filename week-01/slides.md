---
marp: true
theme: gaia
class: invert
paginate: true
style: |
  section pre {
    background: #151b23;
    border-radius: 8px;
  }
  section pre code {
    background: transparent;
    color: #e6edf3;
  }
  section pre .hljs-keyword { color: #ff7b72; }
  section pre .hljs-string { color: #a5d6ff; }
  section pre .hljs-title, section pre .hljs-title.function_ { color: #d2a8ff; }
  section pre .hljs-comment { color: #9198a1; font-style: italic; }
  section pre .hljs-attr, section pre .hljs-attribute { color: #79c0ff; }
  section pre .hljs-number, section pre .hljs-literal { color: #79c0ff; }
  section pre .hljs-built_in { color: #ffa657; }
  section pre .hljs-name { color: #7ee787; }
  section pre .hljs-selector-class, section pre .hljs-selector-pseudo { color: #7ee787; }
  section footer { color: #9fb2c1; font-size: 0.6em; opacity: 0.85; }
---

<!-- _paginate: false -->

# Week 1 — Welcome & JavaScript Refresher

.NET Web Development · Week 1 of 16

---

<!-- _footer: '🖥️ Demo §1 · the arc' -->
## What you'll build in this course

- **Week 1** — rapid JavaScript refresher *(the client)*
- **Week 2** — Bootstrap: ship a styled site to GitHub Pages
- **Weeks 3–6** — ASP.NET Core MVC: pages, forms, validation *(the server)*
- **Weeks 7–10** — Entity Framework Core + SQL Server, midterm project *(the data)*
- **Weeks 11–13** — Identity: logins, roles, security
- **Weeks 14–16** — Web API + final project

---

<!-- _footer: '🖥️ Demo §1 · the arc' -->
## Where you end up

By week 16: a database-backed, secured web app **and** an API your own JavaScript calls.

**Week 4: you pick your topic** — then grow that same app all semester.

**Nothing stays on localhost:**
JS work ships to **GitHub Pages** (tonight!) · every .NET assignment deploys to **Azure** (week 3 on)

You graduate with **URLs, not zip files**.

---

<!-- _footer: '🖥️ Demo §1 · the rules' -->
## The rules of the road

- **AI (Copilot, ChatGPT, Claude):** using it to *explain* or *debug* — fine.
  Submitting code you can't explain — **not fine**.
- **The explain-it standard:** any week, I can ask you to walk me through any line you submitted. Can't explain it → not your work.
- **Commit as you go:** graded homework needs **3+ meaningful commits**.
- **Your work gets shown.** It's public with your name on it, and everyone's app goes on screen at least once this term.
  Build a portfolio you can **defend in an interview** — that's the game.

---

<!-- _footer: '🖥️ Demo §1 · the mental model' -->
## The one mental model

```
Browser (client)  ── HTTP request ──►  Server (ASP.NET app)
                  ◄── HTTP response ──         │
   runs JavaScript                    runs C#, talks to SQL Server
```

- Today and next week: the **left** side
- Week 3 onward: the **right** side

---

<!-- _footer: '🖥️ Demo §1 · toolchain' -->
## Toolchain — install AND verify

| Tool | Verify with |
|------|-------------|
| .NET 10 SDK | `dotnet --version` → `10.x` |
| VS Code + *C#* extension | IntelliSense + F5 breakpoint in a `dotnet new` project |
| *SQL Server (mssql)* extension | Connected to the **school SQL Server** — your account, SQL Server Authentication |
| Git | `git --version` |
| GitHub account | Logged in (school email) |

---

<!-- _footer: '🖥️ Demo §1 · toolchain' -->
## About that database…

- **"It installed" ≠ "it works."** Green checks on all five tools from the last slide, before week 2
- **No local SQL Server install** — ever
- You each have your own account on the **school SQL Server**
- It's reachable from home, too — same connection everywhere, all semester
- *(Azure for Students account: free, but we activate it together in week 3)*

---

<!-- _footer: '🖥️ Demo §3 · why JavaScript' -->
## Why JavaScript in a .NET course?

- The browser runs exactly one language — and it isn't C#
- JS appears three times in this course:
  1. Validation feedback & UI sprinkles
  2. Working alongside Bootstrap
  3. **Week 15: your JS calls your own Web API**
- Tonight is a **refresher**, not a lesson: calibrating to the modern idioms this course speaks, and un-learning old-tutorial habits.

---

<!-- _footer: '🖥️ Demo §4 · variables and types' -->
## Variables: `let` and `const`

```js
let score = 0;        // reassignable
const maxScore = 100; // not reassignable

score = 10;      // ✅
maxScore = 200;  // ❌ TypeError
```

- **Course rule:** `const` by default, `let` if reassigning, `var` never
- C# bridge: `const` ≈ `readonly` — binding is fixed, contents aren't

---

<!-- _footer: '🖥️ Demo §4 · variables and types' -->
## Types live in values, not variables

```js
typeof 42;        // "number" — one number type, no int/double
typeof "hello";   // "string"
typeof undefined; // "undefined" — never assigned
typeof null;      // "object"   — famous historical bug
typeof [1, 2];    // "object"   — arrays are objects
```

- `undefined` = never set · `null` = deliberately empty

---

<!-- _footer: '🖥️ Demo §4 · strings and comparison' -->
## Template literals

```js
const name = "Ada";
`Hello, ${name}! You have ${3 + 4} messages.`
```

- Backticks, `${}` interpolation, multiline allowed
- C# bridge: it's `$"Hello, {name}"` — the `$` moved inside

---

<!-- _footer: '🖥️ Demo §4 · strings and comparison' -->
## Equality: always `===`

```js
1 == "1";    // true  — coerces types first 😬
1 === "1";   // false — type AND value
```

**Course rule:** `===` / `!==` only.

---

<!-- _footer: '🖥️ Demo §4 · strings and comparison' -->
## Truthiness

Falsy: `false` · `0` · `""` · `null` · `undefined` · `NaN`
Everything else is truthy — even `[]`.

```js
if (username) {
  // one check for "not null, not undefined, not empty"
}
```

---

<!-- _footer: '🖥️ Demo §4 · functions' -->
## Arrow functions = lambdas

```js
function add(a, b) { return a + b; }   // classic

const add = (a, b) => a + b;           // modern default

const greet = (name = "friend") => `Hello, ${name}!`;
```

- Valid C# too: `(a, b) => a + b` — same syntax, both languages
- No overloads, no type checks: missing args become `undefined`

---

<!-- _footer: '🖥️ Demo §5 · the big three' -->
## Arrays

```js
const scores = [90, 85, 72, 100];

scores[0]        // predict, then type it
scores.push(65)
scores           // did it change?

for (const s of scores) {
  console.log(s);
}
```

C# bridge: closer to `List<T>` than an array — resizable.

---

<!-- _footer: '🖥️ Demo §5 · the big three' -->
## The big three (this is LINQ!)

```js
const scores = [90, 85, 72, 100];

scores.map(s => s + 5)       // ← Select
scores.filter(s => s >= 80)  // ← Where
scores.find(s => s === 100)  // ← FirstOrDefault

scores                       // after all that — changed or not?
```

- The console echoes each result — **predict before you press Enter**

---

<!-- _footer: '🖥️ Demo §5 · objects' -->
## Objects

```js
const student = { name: "Ada", gpa: 3.9 };

student.name;       // dot access
student["name"];    // bracket access
student.year = 2;   // add property on the fly — no class!
```

C# bridge: no class behind it — a bag of key/values, like `Dictionary<string, object>`. **This is the shape of JSON.**

---

<!-- _footer: '🖥️ Demo §5 · objects' -->
## Destructuring: pulling values *out*

```js
const student = { name: "Ada", gpa: 3.9 };
const scores = [90, 85];

const { name, gpa } = student;
const [first, second] = scores;

name      // what prints?
second
```

Instead of `student.name`, `student.gpa` one at a time — unpack in one line.

---

<!-- _footer: '🖥️ Demo §5 · objects' -->
## Spread: copying everything *in*

```js
const student = { name: "Ada", gpa: 3.9 };
const scores = [90, 85];

const updated  = { ...student, gpa: 4.0 };
const combined = [...scores, 95];

updated    // which gpa won?
student    // did the original change?
combined
```

`...` = "everything from the original" — and on a conflict, **rightmost wins**.

---

<!-- _footer: '🖥️ Demo §5 · objects' -->
## Real data = arrays of objects

```js
const students = [
  { name: "Ada",   gpa: 3.9 },
  { name: "Linus", gpa: 3.4 },
  { name: "Grace", gpa: 4.0 },
];

students.filter(s => s.gpa >= 3.5)
        .map(s => s.name)       // who made the honor roll?
```

Every DB query result and API response in this course is this shape.

---

<!-- _footer: '🖥️ Demo §6 · the DOM' -->
## The DOM in three APIs

Runs *against a page* — tonight's playground has `#status` and `#go`:

```js
const status = document.querySelector("#status"); // 1. select
status.textContent = "Ready.";                    // 2. write — watch the page
document.querySelector("#go")                     // 3. listen
  .addEventListener("click", () => {
    status.textContent = "Clicked!";
  });                                             // …now click the button
```

C# bridge: an event + a lambda for the handler.

---

<!-- _footer: '🖥️ Demo §6 · fetch' -->
## fetch + async/await — a preview of week 15

```js
const loadUsers = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();  // JSON → array of objects
  console.log(users.map(u => u.name));
};

loadUsers()   // ← type this to run it, then watch the console
```

- `await` = "wait here until the answer comes back" — the network isn't instant
- In week 15 the URL is **your own API**

---

<!-- _footer: '🖥️ Demo §7 · hand off' -->
## Lab: JS Refresher Gauntlet

- Copy `week-01/` into `dotnet-web`, beside the clone
- Fix the 8 functions in `exercises.js` — see the folder's README
- Pairs encouraged · answers live in the browser console

**⏱️ 30 minutes**

---

<!-- _footer: '🖥️ Demo §8 · wrap-up' -->
## Before next week

- ✅ Homework: JS exercises (`homework.md`) — **shipped live to GitHub Pages**
- ✅ Environment fully verified — screenshots required
- **Next week: Bootstrap.** Build a real multi-page site, pick a theme + fonts that make it *yours*, deploy it to Pages
