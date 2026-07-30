// Week 1 Homework Self-Check
// Drop this file next to homework.js and add, AFTER your homework.js tag:
//   <script src="homework-checks.js"></script>
// Refresh and read the console. Green across the board = safe to submit.
// (Leaving this file in your repo is fine — it doesn't affect grading.)
(() => {
  const DATA = () => [
    { code: "WEB210", title: "Intro to Web", credits: 3, enrolled: 24, cap: 30 },
    { code: "WEB250", title: ".NET Web Dev", credits: 4, enrolled: 30, cap: 30 },
    { code: "DAT200", title: "SQL Fundamentals", credits: 3, enrolled: 12, cap: 25 },
    { code: "PRG115", title: "Intro to C#", credits: 4, enrolled: 28, cap: 30 },
  ];

  const results = [];
  const check = (num, label, fn) => {
    try { results.push({ num, label, pass: fn() === true }); }
    catch (e) { results.push({ num, label, pass: false, err: e.message }); }
  };

  check(1, "courseLine", () => courseLine(DATA()[1]) === "WEB250: .NET Web Dev (4 credits)");
  check(2, "isFull", () => isFull(DATA()[1]) === true && isFull(DATA()[2]) === false);
  check(3, "openCourses", () => {
    const r = openCourses(DATA());
    return Array.isArray(r) && r.length === 3 && r.every(c => c.code !== "WEB250") && typeof r[0] === "object";
  });
  check(4, "courseTitles", () => JSON.stringify(courseTitles(DATA())) ===
    JSON.stringify(["Intro to Web", ".NET Web Dev", "SQL Fundamentals", "Intro to C#"]));
  check(5, "openCourseLines", () => JSON.stringify(openCourseLines(DATA())) ===
    JSON.stringify(["WEB210: Intro to Web (3 credits)", "DAT200: SQL Fundamentals (3 credits)", "PRG115: Intro to C# (4 credits)"]));
  check(6, "findCourse", () =>
    findCourse(DATA(), "DAT200")?.title === "SQL Fundamentals" && findCourse(DATA(), "XX999") === undefined);
  check(7, "addCourse (no mutation!)", () => {
    const orig = DATA();
    const r = addCourse(orig, { code: "NEW100", title: "New", credits: 1, enrolled: 0, cap: 10 });
    return r.length === 5 && r[4].code === "NEW100" && orig.length === 4;
  });
  check(8, "totalCredits (reduce)", () => totalCredits(DATA()) === 14);

  console.log("%c── Week 1 Homework Self-Check ──", "font-weight: bold");
  for (const r of results) {
    console.log(`${r.pass ? "✅" : "❌"} ${r.num}. ${r.label}${r.err ? `  (error: ${r.err})` : ""}`);
  }
  const passed = results.filter(r => r.pass).length;
  console.log(`%c${passed} / ${results.length} functions passing`,
    passed === results.length ? "color: green; font-weight: bold" : "color: orange; font-weight: bold");

  // ── Deduction scan: -1 per var / == on the graded rubric ───────────────────
  // Two passes, because one of them can't always run. Opened as a local file
  // (file://), fetch is blocked by the browser — so the whole-file scan is only
  // available over http, i.e. Live Server or your published Pages URL. The
  // function scan works everywhere, because the functions are already in memory.
  const scan = (code) => {
    const flags = [];
    if (/\bvar\s/.test(code)) flags.push("var");
    if (/[^=!<>]==[^=]/.test(code)) flags.push("==");
    if (/[^=!]!=[^=]/.test(code)) flags.push("!=");
    return flags;
  };

  const NAMES = ["courseLine", "isFull", "openCourses", "courseTitles",
                 "openCourseLines", "findCourse", "addCourse", "totalCredits"];

  // Pass 1 — read the source of each function you wrote. Always works.
  const inFunctions = [];
  for (const name of NAMES) {
    let fn;
    try { fn = eval(name); } catch { continue; }        // not written yet
    if (typeof fn !== "function") continue;
    const bad = scan(fn.toString().replace(/\/\/[^\n]*/g, ""));
    if (bad.length) inFunctions.push(`${name}(): ${bad.join(", ")}`);
  }

  if (inFunctions.length) {
    console.log(`%c⚠️ deduction risk (−1 each on grading) — ${inFunctions.join(" · ")}`, "color: orange");
  } else {
    console.log("%c✅ no var/==/!= in your 8 functions", "color: green");
  }

  // Pass 2 — the whole file, with line numbers. Needs http, so it may not run.
  fetch("homework.js").then(r => r.text()).then(src => {
    const flags = [];
    src.split("\n").forEach((line, i) => {
      const bad = scan(line.split("//")[0]);
      bad.forEach(b => flags.push(`line ${i + 1}: ${b}`));
    });
    if (flags.length) {
      console.log(`%c⚠️ whole-file scan — ${flags.join(" · ")}`, "color: orange");
    } else {
      console.log("%c✅ whole-file scan clean — no rule deductions", "color: green");
    }
  }).catch(() => {
    console.log("%c… whole-file scan skipped: a page opened straight from disk (file://) "
      + "isn't allowed to read its own .js. The 8 functions above WERE scanned. For the "
      + "full check with line numbers, use VS Code's Live Server or your GitHub Pages URL.",
      "color: gray");
  });
})();
