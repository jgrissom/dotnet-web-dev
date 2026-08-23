# Week 1 — Lecture Notes

## Part 1: Course introduction (20 min)

### What this course builds toward

- **Week 1:** rapid JavaScript refresher — the client side.
- **Week 2:** Bootstrap — build and deploy a styled site that looks like *yours*.
- **Weeks 3–6:** ASP.NET Core MVC — the server side: pages, forms, validation.
- **Weeks 7–10:** Entity Framework Core + SQL Server — real data, midterm project.
- **Weeks 11–13:** Identity — logins, roles, security, polish.
- **Weeks 14–16:** Web API + final project — your JavaScript calling your own API.

**The project thread — say this on night one.** In **week 4** each student picks their own topic and builds a small list-and-details site from an empty folder. Every week after that extends *that same app*: a real layout and theme, forms and validation, then the hard-coded data moves into SQL Server, then logins, then an API. It's what they present in week 16. Mentioning it now means week 4's "pick something you can live with" lands as a reminder rather than a surprise — and students start thinking about a topic three weeks early, which is exactly what you want.

**The pitch:** every job posting for a .NET developer asks for exactly this stack — C#, ASP.NET Core, EF Core, SQL Server, and enough JavaScript to be dangerous.

**And nothing stays on localhost.** Tonight your homework goes live on GitHub Pages. From week 3, every .NET assignment deploys to Azure (you get a free Azure for Students account). By finals, you'll have a portfolio of URLs, not a folder of zip files.

> [!IMPORTANT]
> **Say the "your work gets shown" rule tonight, and mean it** (slide 4, last bullet). From week 5 onward, class opens by putting a few students' deployed apps on the projector, and **everyone's turn comes at least once before the end of term** — it's a rotation, not volunteers.
>
> Announce it in week 1 for two reasons. First, fairness: nobody should discover in week 7 that their work is going on a screen. Second, it changes behavior *before* the first submission — people finish things they know will be seen. Frame it the way the industry does: demos, code review, and standups are all just showing your work to colleagues, and this is the low-stakes version.
>
> Two things to promise and keep: you show **working** software, not a debugging session on someone's broken app; and when you want to demonstrate a failure mode, you use **your own** broken example. Week 3's First Flight isn't in the rotation — everyone builds the same one, so there's nothing worth looking at. It starts in week 5, with week 4's apps, which are the first ones on a topic each student picked.

### One mental model to start

Everything in this course is a conversation between two programs:

```
Browser (client)  ── HTTP request ──►  Server (your ASP.NET app)
                  ◄── HTTP response ──          │
   runs JavaScript                     runs C#, talks to SQL Server
```

Weeks 1–2 live on the left side. Week 3 onward we add the right side — and keep writing the left, because an MVC app is where both meet: your C# answers the request, and the HTML, CSS and JavaScript it sends back are yours too.

---

## Part 2: Environment setup (45 min)

Students work through **[setup-guide.md](setup-guide.md)** at their own pace — it's the walkthrough, with a ✓-verify checkpoint per step. Your job is unblocking, not narrating. The table below is your at-a-glance version of the tool checks; verification matters more than installation — "it installed" ≠ "it works."

| Tool | Install | Verify |
|------|---------|--------|
| .NET 10 SDK | dotnet.microsoft.com/download (LTS) | `dotnet --version` → `10.x` |
| VS Code + **C#** extension | code.visualstudio.com, then Extensions panel → "C#" | `dotnet new console -o Hello`, open the folder in VS Code → IntelliSense works; set a breakpoint, press F5 → it hits |
| **SQL Server (mssql)** extension | VS Code Extensions panel → "SQL Server (mssql)" | Add a connection to the school SQL Server (address on the handout) with **SQL Server Authentication** + your student account; databases appear in the connection tree |
| Git | git-scm.com | `git --version` |
| GitHub account | github.com — sign up with school email ([Student Developer Pack](https://education.github.com/pack)) | Logged in; needed for tonight's homework |

> [!NOTE]
> **Azure:** students get a free **Azure for Students** account, but don't activate it tonight — we do that together in week 3 when the first .NET deploy happens.

> [!TIP]
> **Instructor:** see the [troubleshooting appendix](#appendix-setup-troubleshooting) at the bottom for the common failures.

---

## Part 3: Why JavaScript in a .NET course? (10 min)

- The browser only runs one language: JavaScript. Whatever the server is written in — C#, Python, Java — the interactive parts of a web page are JS.
- In this course JS shows up three times: form validation feedback (week 6), sprinkles of interactivity throughout, and the finale — **week 15, your JavaScript calls the Web API you built.**
- This is a refresher, not a lesson. The prerequisite is C#, and the course assumes some JavaScript — tonight calibrates everyone to the modern idioms this course uses, and flagging the places where JS habits from older tutorials (or a rusty memory) will bite.

Key differences to set expectations:

| | C# | JavaScript |
|---|---|---|
| Typing | Static — compiler checks | Dynamic — types checked at runtime |
| Where it runs | .NET runtime (server) | Browser (and Node.js) |
| Compile step | Yes | No — browser reads source directly |
| Variables | `int x = 5;` | `let x = 5;` |

---

## Part 4: Refresher — modern JS idioms (35 min live-code)

Run everything in the browser DevTools console (F12) first, then move to `.js` files in VS Code. **Pace: rapid-fire.** These are the course's house rules for JS, not new material.

### Variables: `let` and `const`

```js
let score = 0;        // reassignable
const maxScore = 100; // not reassignable

score = 10;      // fine
maxScore = 200;  // TypeError!
```

> [!IMPORTANT]
> **Course rule: `const` by default, `let` when you need to reassign, `var` never.** `var` is legacy (function-scoped, hoisting weirdness) — you'll see it in old tutorials; don't copy it.

- **C# bridge:** `let` ≈ a normal local variable; `const` ≈ `readonly` — the *binding* is fixed, not the contents. `const arr = [1,2]; arr.push(3);` is legal.

### Types and `typeof`

```js
typeof 42;          // "number"  — no int vs double; one number type
typeof "hello";     // "string"
typeof true;        // "boolean"
typeof undefined;   // "undefined"
typeof null;        // "object"  ← famous historical bug, memorize it
typeof { id: 1 };   // "object"
typeof [1, 2, 3];   // "object"  ← arrays are objects too
```

- Variables don't have types; **values** do. The same variable can hold a number, then a string. (Don't do this on purpose.)
- `undefined` = never assigned. `null` = deliberately empty. Rough C# analogy: `null` is `null`; `undefined` has no C# equivalent.
- ⚠️ **`typeof` cannot detect `null`.** It answers `"object"`, so `typeof x === "object"` is true for `null` as well as for real objects. When you mean null, write `x === null`.

<details>
<summary><b>Why is it <code>"object"</code>?</b> — the history, if you are curious</summary>

Early JavaScript stored each value as a small type tag plus a payload, and the tag for *object* was zero — while `null` was the null pointer, a word of all zeros. `typeof` read the tag, saw zero, and said `"object"`. It fell out of the memory layout; nobody chose it.

It has been proposed as a fix and rejected, because a great deal of deployed code branches on `typeof x === "object"` and rules out null separately. Changing the answer would silently alter those branches on pages nobody maintains. It is a 1995 implementation detail the web is now built on top of.

</details>

### Template literals

```js
const name = "Ada";
const greeting = `Hello, ${name}! You have ${3 + 4} messages.`;
```

- Backticks, not quotes. `${}` interpolation.
- **C# bridge:** exactly `$"Hello, {name}!"` — the dollar sign just moved inside.
- Multiline strings work without escapes.

### Equality: `===` always

```js
1 == "1";    // true  — == coerces types before comparing
1 === "1";   // false — === compares type AND value
```

> [!IMPORTANT]
> **Course rule: always `===` and `!==`.** `==` has a coercion table nobody memorizes.

### Truthiness

```js
if ("") { }        // falsy
if (0) { }         // falsy
if (null) { }      // falsy
if (undefined) { } // falsy
if ("hi") { }      // truthy — any non-empty string
if ([]) { }        // truthy — even an empty array!
```

- Falsy values: `false`, `0`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy.
- **C# bridge:** C# demands a real `bool` in an `if`; JS will take anything and coerce.

> [!TIP]
> `if (username) { ... }` checks "not null, not undefined, not empty" in one shot — you'll use this idiom constantly.

### Functions → arrow functions

```js
// Classic declaration
function add(a, b) {
  return a + b;
}

// Arrow function — the modern default
const add = (a, b) => {
  return a + b;
};

// Short form: single expression, implicit return
const add = (a, b) => a + b;

// Default parameters
const greet = (name = "friend") => `Hello, ${name}!`;
greet();        // "Hello, friend!"
greet("Ada");   // "Hello, Ada!"
```

- **C# bridge:** arrow functions ARE lambdas — `(a, b) => a + b` is valid in both languages.
- We'll use both forms; arrow functions dominate modern code and become essential with `fetch` in week 15.

> [!WARNING]
> Call a JS function with too few arguments and the missing ones are silently `undefined` — no compiler error. This is where dynamic typing bites; default parameters are the guard rail.

---

## Part 5: Refresher — arrays and objects (30 min live-code)

### Arrays

```js
const scores = [90, 85, 72, 100];

scores.length;      // 4
scores[0];          // 90
scores.push(65);    // add to end
scores.pop();       // remove from end

// Iteration — for...of is the workhorse
for (const s of scores) {
  console.log(s);
}
```

- Mixed types are legal (`[1, "two", true]`) — legal, and a bad idea.
- **C# bridge:** closer to `List<object>` than to an array — resizable, no fixed type.

### The big three: `map`, `filter`, `find`

These take a function as an argument — this is where arrow functions earn their keep.

```js
const scores = [90, 85, 72, 100];

const curved = scores.map(s => s + 5);      // [95, 90, 77, 105] — transform each
const passing = scores.filter(s => s >= 80); // [90, 85, 100]    — keep matches
const perfect = scores.find(s => s === 100); // 100              — first match (or undefined)
```

> [!NOTE]
> **This is LINQ!** `map` = `Select`, `filter` = `Where`, `find` = `FirstOrDefault` — if you've used LINQ, you already think this way.
- None of these mutate the original array — they return new ones.

### Objects

```js
const student = {
  name: "Ada",
  email: "ada@example.com",
  gpa: 3.9,
};

student.name;          // "Ada"      — dot access
student["email"];      // bracket access (needed for dynamic keys)
student.gpa = 4.0;     // mutate a property (fine even with const)
student.year = 2;      // add a property on the fly — no class needed!
```

- **C# bridge:** looks like an object initializer, but there is no class. Objects are bags of key/value pairs, closer to `Dictionary<string, object>`. This is exactly the shape of the JSON your Web API returns in week 14.

### Destructuring and spread

Two operations that look similar (both use unusual punctuation on object/array literals) but point in opposite directions — teach them as a pair on purpose:

**Destructuring pulls values *out* of a structure into variables:**

```js
const student = { name: "Ada", gpa: 3.9 };
const scores = [90, 85];

const { name, gpa } = student;   // name = "Ada", gpa = 3.9
const [first, second] = scores;  // first = 90, second = 85
```

- Without it: `const name = student.name; const gpa = student.gpa;` — one line per property. Destructuring is just that, compressed. The variable names must match the property names (for objects); array destructuring goes by position.

**Spread (`...`) copies everything *in* to a new structure:**

```js
const updated  = { ...student, gpa: 4.0 }; // { name: "Ada", gpa: 4.0 }
const combined = [...scores, 95];          // [90, 85, 95]
```

- Read `...student` as "everything student has, dumped here." Then `gpa: 4.0` after it *overrides* the spread-in value — **rightmost wins**. That's the standard "copy with one change" idiom.
- The originals are untouched — spread makes a *new* object/array. This is the no-mutation habit from the lab (exercise 8) in its natural form.
- You'll see destructuring constantly in real-world JS; introduce it now so it's not noise later.

### Arrays of objects — the shape of real data

```js
const students = [
  { name: "Ada",   gpa: 3.9 },
  { name: "Linus", gpa: 3.4 },
  { name: "Grace", gpa: 4.0 },
];

const honorRoll = students
  .filter(s => s.gpa >= 3.5)
  .map(s => s.name);        // ["Ada", "Grace"]
```

> [!IMPORTANT]
> Every database query result and every API response for the rest of this course is an **array of objects** — `filter`/`map` chains are how you'll process all of it.

---

## Part 6: DOM & fetch highlights (25 min live-code)

A fast tour, not a deep dive — you'll use these for real in week 2 (Bootstrap interactivity) and week 15 (calling your own API).

### The DOM in three APIs

**Demo against a real page** — open the hosted playground ([https://jgrissom.github.io/dotnet-web-dev/week-01/demo/](https://jgrissom.github.io/dotnet-web-dev/week-01/demo/)) with the console on and the page visible, so the class sees it change. Students can replay the whole demo from that same URL at home. The page has exactly these elements:

```html
<p id="status">Loading…</p>
<button id="go">Go</button>
```

```js
// 1. Select
const status = document.querySelector("#status");   // CSS selector syntax
const button = document.querySelector("#go");

// 2. Read/write
status.textContent = "Ready.";                       // text (safe)
status.innerHTML = "<strong>Ready.</strong>";        // HTML (careful — more on this in the security weeks)

// 3. Listen
button.addEventListener("click", () => {
  status.textContent = "Clicked!";
});
```

- `querySelector` takes any CSS selector: `"#id"`, `".class"`, `"nav a"`. There's also `querySelectorAll` (returns all matches).
> [!NOTE]
> Older tutorials and Stack Overflow answers use `document.getElementById("status")` — same result for ids, still perfectly valid, not deprecated. We standardize on `querySelector` because one API covers every selector you'll ever need; just don't be confused when you see the other one in the wild.
- **C# bridge:** `addEventListener` is wiring up an event handler — same idea as C# events, and the arrow function is the handler delegate.

### fetch + async/await — the shape of week 15

```js
const loadUsers = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();   // JSON → array of objects!

  const names = users.map(u => u.name);  // ...and our array skills apply
  document.querySelector("#status").textContent = names.join(", ");
};

loadUsers();
```

- `fetch` makes an HTTP request from JS. Teach `await` from scratch — "pause right here until the answer comes back" — and **don't lean on C# for this one**: a beginner C# course rarely reaches `async`/`await`, so assume this is their first encounter with the keyword. (If someone has seen C#'s version, confirm it's the same idea.) Keep it at the intuition level tonight; the mechanics come in week 15.
> [!TIP]
> **Delivery tip:** the console supports top-level `await`, so demo it line-by-line instead of pasting the whole function — `const response = await fetch(...)` ⏎, inspect `response`, `const users = await response.json()` ⏎, expand `users` in the console (triangle = "JSON is arrays of objects" made visible), then `users.map(u => u.name)`. Each Enter is a prediction moment. The slide's `async () =>` wrapper is the *file* form they'll write in week 15; mention that, don't retype it.
- Land this: the API returns **an array of objects** — everything from Part 5 applies. In week 15, the URL will be *your* API instead of a placeholder.
- Don't go deeper tonight (no error handling, no POST) — that arrives when they build against real endpoints.
- **"The action has been blocked" / CSP error:** someone ran the demo in the console of a Chrome-internal page (new tab, `chrome://settings`…). The console runs code *as the current page*, and Chrome's own pages block outside network requests. Fix: open the lab's `index.html` (or any normal website) first, then F12. Expect a few students to hit this.
- **Offline fallback:** if classroom internet (or jsonplaceholder) is down, paste a hardcoded `const users = [{ name: "Leanne Graham" }, { name: "Ervin Howell" }]` and run the same `.map` line — you lose the network moment but keep the JSON-is-arrays-of-objects point. The real fetch becomes a "try it at home."

---

## Wrap-up (10 min)

- **Today:** toolchain verified; JS recalibrated to modern idioms: `const`/`let`, `===`, arrows, `map`/`filter`/`find`, destructuring; DOM + `fetch` toured.
- **Next week:** **Bootstrap.** You'll build a real multi-page site — grid, navbar, cards, forms — pick a theme that makes it yours, and deploy it to GitHub Pages. Last stop before C# land: week 3 we run `dotnet new mvc` and stay there.
- **Homework:** `homework.md` — JS exercises + proof your environment works + your first Pages deploy. Environment must be green by next week.

---

## Appendix: Setup troubleshooting

**Can't connect to the school SQL Server**
- Double-check the server address against the handout — a single typo produces "server not found."
- Authentication must be **SQL Server Authentication** (username + password from your student account), *not* Windows Authentication.
- Passwords are case-sensitive; watch for auto-capitalization if you pasted from a phone.
- The server is externally accessible, so it works from home. If it connects at home but not on campus (or vice versa), it's a network issue — tell the instructor, don't fight it alone.
- Nothing before week 7 *requires* the database connection, but get it green now anyway.

**`dotnet` not recognized in terminal**
- Terminal was open during install — close and reopen it (PATH refresh).
- Verify with a brand-new terminal window, not the VS Code built-in one.

**macOS / Linux students**
- No differences this semester — VS Code, the C# extension, and the mssql extension are identical on every platform, and the database lives on the school server.

**Student's VS Code looks different from the projector (Solution Explorer panel, sign-in prompt)**
- They installed **C# Dev Kit** — the marketplace promotes it over the plain C# extension. Extensions panel → C# Dev Kit → **Disable**, reload the window. Everything course-related works identically without it.

**C# extension installed but no IntelliSense**
- Make sure a folder (not a single `.cs` file) is open: File → Open Folder on the project directory.
- Give the language server a moment after opening — watch the flame icon / status bar until the project finishes loading.
- If it never loads, check the Output panel (dropdown: "C#") for errors — usually a missing SDK or a folder with no `.csproj` in it.
