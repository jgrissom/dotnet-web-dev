# Week 7 — Lesson Plan

**Topic:** EF Core & SQL Server — `DbContext`, connection strings, migrations, seeding, and pointing a deployed app at the school server
**Session length:** 3h 45m

> The night the data stops belonging to the process. Three moments carry the week: **§3's `Invalid object name 'Trucks'`** (describing a table doesn't create one), **§5's missing `SaveChanges`** (the form works perfectly and saves nothing), and **§6's restart** (the truck is still there). Everything else is the machinery that makes those three land. Tonight also answers a promise made out loud last week — *"one line changes"* — and the honest answer is "more than one, but the shape held," which is worth saying rather than glossing.

## Learning objectives

By the end of this session, students can:

1. Explain why a `static List<T>` isn't storage, and name what a database gives them that it can't.
2. Write a `DbContext` with a `DbSet<T>`, and say what that property means.
3. Put a connection string in `appsettings.json` and register the context with `AddDbContext` / `UseSqlServer`.
4. Explain the difference between `dotnet ef migrations add` and `dotnet ef database update`, and read a generated migration.
5. Point at a column in a migration and name the week-6 data annotation it came from.
6. Seed rows with `HasData`, and say why seeded rows need explicit `Id` values.
7. Inject a context into a controller and rewrite reads and writes against it.
8. Say what `Add` does, what `SaveChanges` does, and what happens when you forget the second one.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, with the two error messages and the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-07/demo/script.html))
- **Curbside**, copied out of the private answer-keys repo (`week-07/demo-starter/Curbside`) to a scratch folder — week 6's finished state, form and all — running under `dotnet watch`
- ⚠️ **Your own connection string filled in and tested before class**, and the demo database **dropped** (`dotnet ef database drop --force`) so the room watches it get created
- **VS Code `mssql` extension** installed, connected, tested, panel closed. You open it four times tonight
- **2–3 student Azure URLs** picked in advance for the gallery
- Your finished Registry with `dotnet test` at 6/6, ready to show at lab launch

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Deployed-app gallery** *(deck on title slide)*. 2–3 student apps, **2 minutes each, hard stop**. Collect last week's reading **while an app is on screen**: *"what would the columns of your hard-coded list be, and what type is each one?"* Take two answers out loud — you're building the intuition that a class is a table shape. Update the working-regions list. |
| 0:10 | 20 min | **Six trucks. Again.** *(slides 2–4, demo §1)*. **Open by filing a truck and restarting the app before any slide is up** — they've seen this, and watching it once more with the answer coming is different from watching it as a puzzle. Then the table of what a database buys, and **land the "two apps, same data" row** — it's collected in §7 and it's the one they can't imagine yet. Close with the three pieces: context, connection string, migration. |
| 0:30 | 30 min | **The context** *(slides 5–8, demo §2)*. Two packages, and open `.csproj` to show that's all `dotnet add package` did. Then the `DbContext` — **type all fifteen lines**; it's the centre of the week. Land `DbSet<Truck> Trucks` as *"this property is the table."* Then the connection string in `appsettings.json`, with the `TrustServerCertificate` sentence. Then one `AddDbContext` line, and **point back at `AddControllersWithViews()`** — that collection finally gets a name. |
| 1:00 | 10 min | **☕ Break** |
| 1:10 | 25 min | **Migrations** *(slides 9–12, demo §3)*. **Break #1 first:** load `/Trucks` with everything registered and get `Invalid object name 'Trucks'`. *Describing a table does not create one.* Then `migrations add`, and **open the generated file** — this is the load-bearing beat: `nvarchar(50)` came from last week's `[StringLength(50)]`, `nullable: false` from `[Required]`, and `Id` got `SqlServer:Identity`, which deletes a line of their code in forty minutes. Then `database update`, and the two tables in the mssql panel. |
| 1:35 | 15 min | **Seeding** *(slides 13–15, demo §4)*. The table is empty and that's correct. `HasData` in `OnModelCreating`, explicit `Id`s and why. **Reload and it's still empty** — let them answer with the snapshot rule from ten minutes ago. Second migration: nothing but `InsertData`. *You describe what you want; it works out the difference.* |
| 1:50 | 10 min | **☕ Break** |
| 2:00 | 25 min | **The controller barely changes** *(slides 16–19, demo §5)*. **Load-bearing.** Constructor injection, and say what's absent — no `new`, no server name. Reads: two changed lines, and **read the generated SQL in the terminal**. Then **break #2**: rewrite the POST *without* `SaveChanges`, don't announce it, and file a truck — form works, redirect happens, nothing saved, no error anywhere. Then the line they delete, and deleting `TruckData.cs` so the compiler finds the rest. |
| 2:25 | 10 min | **The payoff** *(slide 20, demo §6)*. Add a truck, `Ctrl+C`, restart, reload. **It's still there.** Then the mssql panel with the app stopped. Then point at the editor and list everything from week 6 that didn't change. |
| 2:35 | 10 min | **The deployed app** *(slides 21–22, demo §7)*. **Talk-through, nothing is deployed.** `az webapp up` ships the folder, not the git history — which is why `appsettings.json` can be gitignored and still arrive. US region. Then the exercise to do at home: add a record on the deployed site, look at it locally. And the `git rm --cached` half of the gitignore step. |
| 2:45 | 50 min | **Lab: the Registry gets a filing cabinet** *(slide 23)*. Launch with ~90 seconds of *what done looks like* — seven creatures after a restart, `dotnet test` printing **6 / 6**, **on localhost**. Then the setup, said once, and **the connection string warning**. **In-class target: checks 1–5.** |
| 3:35 | 10 min | **Wrap-up** *(slide 24, demo §9)*. The one-picture diagram. Answer last week's promise honestly. Homework: their own list moves into SQL Server. Then week 8: edit and delete, mostly written for them. |

## Instructor notes

- **Students watch the demo; they don't type along.** Same as every week, and enforced the same way: Curbside lives only in the private answer-keys repo, and the lab is a different app. Say it at the start. Tonight it matters more than usual — a room of fourteen people running `dotnet ef database update` against the school server *while you're mid-sentence* is a support queue you cannot clear.
- ⚠️ **Test your connection string before class, then drop the database.** `dotnet ef database drop --force`. If your own string is wrong at 1:10 you lose §3 and §4 both, and there is no way to fake your way forward — everything after that point needs a real database.
- **Use your own database, not a student's and not the lab answer key's.** You drop and recreate it twice tonight.
- **The terminal is the display surface all night, and unlike week 6 you never clear it.** Migration output, generated SQL, and two error messages. Size it for the back row and leave it up.
- ⚠️ **`Invalid object name 'Trucks'` is the single most valuable error of the night.** It is exactly what a student sees when they skip `database update`, the message is unusually honest, and showing it *deliberately* is what stops it being a twenty-minute panic in the lab. Do not skip §3's break to save time.
- **The migration file is the beat that ties the course together.** `nvarchar(50)` came from a *form validation rule* they wrote last week to stop someone typing a paragraph into a text box. Ask where 50 came from and wait — someone will get it, and it lands far better found than told.
- ⚠️ **Break #2 is the one to protect.** Forgetting `SaveChanges()` is the most common bug of the week and it is completely silent: the form submits, the guard passes, the redirect happens, and the record isn't there. Show it with the mssql panel open so the absence is visible, not asserted. **If §2 or §3 overran, take the time out of §7, not out of this.**
- **Don't teach `async`/`await` tonight.** Everything is synchronous — `ToList()`, `FirstOrDefault()`, `SaveChanges()` — and that is deliberate: it keeps the controller diff from week 6 down to what the promise said it would be. Week 8's scaffolding generates async controllers, and that's the honest moment to introduce it, with the compiler and the generated code both on your side. If someone asks tonight: *"there's an async version of all of these and next week's scaffolding will write them for you."* That's the whole answer.
- **Don't teach change tracking either.** It's rich, surprising, and nothing they type tonight behaves differently for knowing it. The one sentence that earns its place is *"`Add` records an intention; `SaveChanges` does the work,"* which is break #2 and is enough. Save the rest for week 8, where an edit makes it matter.
- **The debugger does not get its slot tonight** — the segment is already full and `Console.WriteLine`-grade evidence (the generated SQL, the mssql panel) covers everything tonight needs. **Week 8 is where it earns its keep**, on a tracked change during an edit, and that's where attach-to-process should be taught explicitly.
- **`Rating` is a `double` and becomes `float` in SQL Server**, which surprises people who expect a column called `double`. Don't volunteer it; if it's noticed, *"that's SQL Server's name for it"* is the whole answer.
- 🔗 **Two promises get collected tonight.** Week 6's *"one line changes"* — answer it honestly in the wrap-up rather than pretending — and week 6's closing *"next week the list becomes a table,"* which is §6. Students notice when a promise is kept and they notice more when one is fudged.
- **Say the public-repo problem in §2, not just at the end.** The connection string goes on screen with a real password in it, in front of a room whose homework repos are public. Flag it the moment it appears; the mechanics can wait for §7.
- ⚠️ **`git rm --cached` is the half everyone skips.** Adding `appsettings.json` to `.gitignore` does nothing on its own, because git is already tracking it. Say the two-command version out loud, and note the password stays in history regardless — which is why forming the habit before it's a credential that matters is the actual lesson.
- **The lab's checks never touch SQL Server** — they run the app against an in-memory database. Say so at launch, and say what it means: **6/6 does not prove their connection string works.** Their browser proves that. Both matter, and a student who gets 6/6 with a broken connection string and stops there will discover it during the homework instead.
- **The lab's EF packages are pre-installed in the starter**, so nobody is stuck behind NuGet on class wifi. The two `dotnet add package` commands are in the lecture notes and the homework, because their own app needs them — this is the one thing this week the lab doesn't make them do.
- **The lab has 50 minutes and task 1 is a connection string.** Watch for anyone still fighting it at the ten-minute mark and go to them; it is the only task tonight that cannot be unblocked by reading. Everything after it is C#.
- **Their own app may have more places reading the old list than Curbside does.** The home page is the usual suspect — a `var featured = TrailData.All.First(...)` in `Views/Home/Index.cshtml`. The homework answer key rewires a `HomeController` for exactly this reason, and it's worth naming in §5 while `TruckData.cs` is being deleted.
