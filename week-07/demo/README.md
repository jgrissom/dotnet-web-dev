# Week 7 Demo Canvas — Curbside Gets a Database 🗄️

Week 7's demo picks Curbside up where week 6 left it — form working, annotations on the model, trucks vanishing on every restart — and moves the list into SQL Server. **Deliberately different content from the lab:** you give Curbside a `CurbsideContext`; students give the *Cryptid Registry* a `CryptidContext`.

- `demo-script.md` — the edit-by-edit cue sheet, keyed to slide numbers, with a [clickable hosted version](https://jgrissom.github.io/dotnet-web-dev/week-07/demo/script.html). Every block you type or paste is in it, and every **🎞️ line means stop and switch to the projector** — it names the slide to put up and what to say to it, so the script alone is enough to run the night from. No cue ever means "not yet"; a slide that has to wait has its cue further down. Between two 🎞️ lines the deck stays put.
- **The starting app is not in this repo.** Curbside's finished week-6 state lives in the private answer-keys repo at `week-07/demo-starter/Curbside` — copy it out into `~/Repos/dotnet-web-dev-course-trial/instructor/week-07/` before class.

> [!CAUTION]
> **Fill in your own connection string before class and prove it works**, then drop the database so the class watches it get created:
>
> ```bash
> dotnet ef database drop --force
> ```
>
> Everything from §3 onwards needs a live database. If your connection string is wrong in front of the room you lose §3 and §4 both, and unlike week 6's breaks there is no way to keep going without it. Rehearse the whole thing once end to end.

> [!IMPORTANT]
> **One deliberate break tonight, not four — plus one moment that looks like a break and isn't.**
>
> **§3: the empty server.** Everything described, everything registered, and the mssql panel shows **no database of yours at all**. Not an empty table — nothing. Describing a table doesn't create one.
>
> This replaces an earlier version of the beat that loaded `/Trucks` and expected `Invalid object name 'Trucks'`. **That error cannot occur there:** `TrucksController` still reads `TruckData.All` until §5, and `AddDbContext` only registers a factory, so the page renders six trucks even with a connection string pointing at a server that doesn't exist. The error is still the most valuable one of the night — students meet it in the lab the moment they wire up the controller and forget `database update` — so §3 *names* it rather than staging it.
>
> **§5: the missing `SaveChanges()`.** Rewrite the POST action leaving it out, and *don't announce that you have*. The form submits, the guard passes, the redirect happens, and nothing is saved — no error, nowhere. Have the mssql panel open so the absence is visible rather than asserted. It is the most common bug of the week and it is completely silent.

> [!TIP]
> **The migration file is the beat that ties the whole course together.** Open `<timestamp>_InitialCreate.cs` and ask where `nvarchar(50)` came from. Nobody typed 50 tonight — it's `[StringLength(50, MinimumLength = 2)]`, written last week as a *form validation rule* to stop someone pasting a paragraph into a text box. It lands far better found than told, so ask and wait.

> [!NOTE]
> **The terminal is the display surface all night, and you never clear it.** Migration SQL, the `SELECT` on every page load, the `INSERT` when a truck is saved, and two error messages worth recognising on sight. This is the opposite of week 6, where a wiped terminal with one object in it was the point.

> [!TIP]
> **Nothing gets deployed tonight.** §7 is a talk-through of what *students* do for the homework — the only Azure deploy in the course is week 3's. Say so out loud when you get there, or "the deployed app" reads as something about to happen on screen.

> [!IMPORTANT]
> **Don't teach `async`/`await`, and don't teach change tracking.** Everything tonight is synchronous on purpose, which is what keeps the controller diff as small as week 6 promised it would be. Week 8's scaffolding generates async code and that's the honest moment for it. If asked: *"there's an async version of all of these, and next week's scaffolding will write them for you."* Same for change tracking — *"`Add` records an intention, `SaveChanges` does the work"* is the whole of what tonight needs, and it's break #2.
