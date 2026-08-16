# Week 7 — EF Core & SQL Server

The night the data stops belonging to the process. For four weeks the list has been a `static List<T>` — a variable in a running program, wiped by every restart and every deploy, and last week ended by making that impossible to ignore. Tonight it moves into SQL Server: a `DbContext` describes the table, a connection string says where the server is, a migration builds it, and the controller changes less than you'd expect. Then you restart the app and the record is still there — and your laptop and your deployed app turn out to be looking at the same data.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content, the two connection errors, **troubleshooting appendix** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-07/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *Curbside gets a database* — picks up where week 6 left it; [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-07/demo/script.html) |
| In&nbsp;class,&nbsp;last&nbsp;50&nbsp;min | 🧪&nbsp;[lab/⁠](lab/) | *The Registry gets a filing cabinet* — 6 `dotnet test` checks; 1/6 green out of the box (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check — the same checks the grader runs (6 of the 20 pts; **the other 14 come from the repo this week**) |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | Their own app's list moves into SQL Server, deployed to Azure; URL + repo via Canvas |

## What students walk out with

**Data that outlives the process.** They can say why a `static List<T>` isn't storage; write a `DbContext` with a `DbSet<T>` and explain what that property means; put a connection string in configuration rather than in code; tell `migrations add` apart from `database update`; read a generated migration and point at the week-6 annotation each column came from; seed with `HasData`; and say what `Add` does, what `SaveChanges` does, and what happens when you forget the second one. And they've watched a record survive a restart.

## 📋 Before class, don't forget

- **Deployed-app gallery** — 2–3 student Azure URLs picked in advance; 2 minutes each
- Collect last week's reading — *"what would the columns of your hard-coded list be, and what type is each one?"* — **while an app is on screen**. It's the intuition the whole night is built on
- ⚠️ **Fill in your own connection string and test it before class**, then **drop the demo database** (`dotnet ef database drop --force`) so the room watches it get created. If your string is wrong at 1:10 you lose two segments and there is no way to fake forward
- **Copy `week-07/demo-starter/Curbside` out of the private answer-keys repo** into `~/Repos/dotnet-web-dev-course/instructor/week-07/` — Curbside exactly as week 6's demo left it. `dotnet watch`, then park tabs on `/Trucks` and `/Trucks/Create`
- **VS Code `mssql` extension** installed, connected, tested, panel closed — you open it four times tonight
- **Size the terminal for the back row and leave it up all night.** Unlike week 6 you never clear it: migration output, generated SQL and two error messages are the story
- Check `dotnet ef --version` matches your runtime — a skew warning on the projector invites a question you don't want
- Your finished Registry with `dotnet test` at 6/6, for the lab launch
- Remind students to `git pull` the starters repo for the week-07 folder

**Prev:** [← Week 6 — Forms & Validation](../week-06/README.md) · **Next:** [Week 8 — EF Core CRUD →](../week-08/README.md)
