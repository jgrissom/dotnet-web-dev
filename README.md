# .NET Web Development — 16-Week Course

Full-stack web development with **ASP.NET Core MVC on .NET 10**, **Entity Framework Core**, **SQL Server**, **ASP.NET Core Identity**, and **Bootstrap 5**, ending with an introduction to **Web API**.

**Format:** 16 weeks · 1 meeting/week · 3 hours 45 minutes per session
**Prerequisite:** C# programming course

## Course Map

| Week | Topic | Folder | Status |
|------|-------|--------|--------|
| 1 | Course intro, environment setup, rapid JavaScript refresher (fundamentals, arrays/objects, DOM & fetch highlights) | `week-01/` | ✅ Ready |
| 2 | Bootstrap 5: grid, components, utilities; Bootswatch themes; Google Fonts; build & deploy a static site to GitHub Pages | `week-02/` | ✅ Ready |
| 3 | How the web works (HTTP, client/server); ASP.NET Core MVC fundamentals: project anatomy, MVC pattern, first controller & view; first deploy to Azure App Service | `week-03/` | 🚧 Planned |
| 4 | Routing, controllers, passing data to views; Razor syntax deep dive | `week-04/` | 🚧 Planned |
| 5 | Razor layouts & partials: the site shell — applying the Bootstrap you already know; Bootswatch swap in `_Layout.cshtml` | `week-05/` | 🚧 Planned |
| 6 | Models, forms, model binding, validation (data annotations) | `week-06/` | 🚧 Planned |
| 7 | EF Core + SQL Server: DbContext, migrations, seeding; pointing deployed apps at the school SQL Server | `week-07/` | 🚧 Planned |
| 8 | EF Core CRUD: scaffolding, full create/read/update/delete flows | `week-08/` | 🚧 Planned |
| 9 | EF Core relationships (1-many, many-many), LINQ queries, ViewModels | `week-09/` | 🚧 Planned |
| 10 | Midterm project: guided build tying weeks 3–9 together | `week-10/` | 🚧 Planned |
| 11 | ASP.NET Core Identity: registration, login, customizing IdentityUser | `week-11/` | 🚧 Planned |
| 12 | Identity pt. 2: roles, claims, `[Authorize]`, securing the app | `week-12/` | 🚧 Planned |
| 13 | Polish topics: dependency injection & services, TempData, paging/filtering/search | `week-13/` | 🚧 Planned |
| 14 | Intro to Web API: controllers vs. minimal APIs, JSON, testing endpoints | `week-14/` | 🚧 Planned |
| 15 | Consuming your API with JavaScript fetch; production concerns (config, secrets, CI/CD with GitHub Actions) | `week-15/` | 🚧 Planned |
| 16 | Final project work & presentations | `week-16/` | 🚧 Planned |

## How to use this repo

**Tap/click a week folder** (or the link in the course map above) — each one opens to its own index page with the documents in the order you use them.

**Students:** clone this repo once (`git clone https://github.com/jgrissom/dotnet-web-dev.git`), then `git pull` at the start of each week. Copy the week's `lab/starter/` folder out into your own projects folder and work on the copy — never inside the clone. Slides are also hosted at **https://jgrissom.github.io/dotnet-web-dev/**.

**Instructors** — the weekly rhythm:

1. **Prep (before class):** read `lesson-plan.md` for the timed agenda, then skim `lecture-notes.md` — the expanded, speakable version of the slides, with asides and a troubleshooting appendix.
2. **In class:** present the slides — `slides.md` in VS Code with the **Marp for VS Code** extension, the exported `slides.html` in any browser (`F` for fullscreen, arrow keys — works offline), or the hosted Pages site. Keep `lecture-notes.md` open on a second screen as your script.
3. **After class:** `homework.md` is the assignment. Lab answer keys live in the **private** [dotnet-web-dev-answer-keys](https://github.com/jgrissom/dotnet-web-dev-answer-keys) repo — never in this one.
4. **Drafting future weeks:** work on a branch; merge to `main` when the week goes live. Everything on `main` is public immediately.

## Weekly Package

Each `week-NN/` folder contains:

- `README.md` — index for that week: what's here, in what order
- `lesson-plan.md` — timed instructor agenda for the 3h45m session *(instructor)*
- `slides.md` — slide deck in GitHub-flavored markdown, one slide per `##` section, Marp-enabled *(projected)*
- `slides.html` — standalone exported deck for presenting. Regenerated **automatically** by the `Export and publish slide decks` workflow whenever a `slides.md` is pushed; decks are also published to **https://jgrissom.github.io/dotnet-web-dev/**
- `lecture-notes.md` — full lecture content with code examples *(instructor script)*
- `lab/` — in-class lab: `README.md` instructions and `starter/` code *(answer keys live in the private answer-keys repo)*
- `homework.md` — assignment due before the next session *(student-facing)*

## Toolchain

- .NET 10 SDK (LTS)
- VS Code with the **C#** extension (projects are created/run with the `dotnet` CLI; no C# Dev Kit)
- VS Code **SQL Server (mssql)** extension — no local SQL Server install; students connect to the **school SQL Server** (externally accessible, each student has their own account) for both dev and deployed apps
- A modern browser with dev tools (Chrome/Edge recommended)
- Git + GitHub account
- **Azure for Students** account (free — students activate it in week 3)

## Deployment story

Nothing in this course stays on localhost — every assignment ships:

| What | Where | Starting |
|------|-------|----------|
| JavaScript review work (weeks 1–2) | **GitHub Pages** | Week 1 homework |
| All .NET homework (MVC, Identity, API) | **Azure App Service** (VS Code Azure extension / `az webapp up`) | Week 3 homework |
| Databases (dev **and** deployed) | **School SQL Server** — externally accessible, per-student accounts | Week 7 |
