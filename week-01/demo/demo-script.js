// Week 1 — console demo script, in slide order.
// NOT a runnable file: paste blocks into the browser console during the lecture
// when typing runs slow. Type (don't paste) the prediction moments — the room
// should guess before every Enter.

// ── Variables (slide 9) ──────────────────────────────────────
let score = 0;
const maxScore = 100;
score = 10;
maxScore = 200;      // TypeError — let them predict which line throws

// ── typeof (slide 10) — type these one at a time ─────────────
typeof 42
typeof "hello"
typeof undefined
typeof null          // pause for bets
typeof [1, 2]

// ── Template literals (slide 11) ─────────────────────────────
const name = "Ada";
`Hello, ${name}! You have ${3 + 4} messages.`

// ── Equality (slide 12) — predictions mandatory ──────────────
1 == "1"
1 === "1"

// ── Truthiness (slide 13) ────────────────────────────────────
Boolean("")
Boolean(0)
Boolean("hi")
Boolean([])          // the trap

// ── Arrow functions (slide 14) ───────────────────────────────
const add = (a, b) => a + b;
const greet = (nm = "friend") => `Hello, ${nm}!`;
greet()
greet("Ada")

// ── Arrays (slide 15) ────────────────────────────────────────
const scores = [90, 85, 72, 100];
scores[0]
scores.push(65)
scores               // did it change?

// ── The big three (slide 16) ─────────────────────────────────
scores.map(s => s + 5)
scores.filter(s => s >= 80)
scores.find(s => s === 100)
scores               // unchanged?

// ── Objects (slide 17) ───────────────────────────────────────
const student = { name: "Ada", gpa: 3.9 };
student.name
student.year = 2;    // no class — add on the fly
student

// ── Destructuring (slide 18) ─────────────────────────────────
const { gpa } = student;
gpa

// ── Spread (slide 19) ────────────────────────────────────────
const updated = { ...student, gpa: 4.0 };
updated              // which gpa won?
student              // original untouched?

// ── Arrays of objects (slide 20) ─────────────────────────────
const students = [
  { name: "Ada", gpa: 3.9 },
  { name: "Linus", gpa: 3.4 },
  { name: "Grace", gpa: 4.0 },
];
students.filter(s => s.gpa >= 3.5).map(s => s.name)

// ── DOM (slide 21) — on the demo page! ───────────────────────
const status = document.querySelector("#status");
status.textContent = "Ready.";
document.querySelector("#go").addEventListener("click", () => {
  status.textContent = "Clicked!";
});
// ...now click the button

// ── fetch (slide 22) — line by line, top-level await ─────────
const response = await fetch("https://jsonplaceholder.typicode.com/users");
response
const users = await response.json();
users                // expand the triangle: arrays of objects!
users.map(u => u.name)
