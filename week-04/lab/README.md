# Week 4 Lab — Cryptid Registry 👻

Six legendary creatures, one archive. A list page, a details page, and a 404 that tells the truth. Same rhythm as *First Flight* — run the checks, turn red into green.

**Time:** ~30 minutes in class — **in-class target: checks 1–4 green.** Checks 5–6 (and deploying it) roll into the homework by design.

## Setup

> [!NOTE]
> **You don't create anything.** Both projects already exist in the starter — you're copying a folder, not scaffolding a new app. `dotnet new` is not part of this lab.

**1. Update your clone of the course repo:**

```bash
cd dotnet-web-dev && git pull
```

**2. Copy the `week-04/lab/starter` folder out to wherever you keep your projects, and rename the copy** to something meaningful — `CryptidRegistry` works. (Copy it *out*; never work inside the clone, or next week's `git pull` will fight you.)

You should end up with exactly this:

```
CryptidRegistry/            ← the folder you copied and renamed
├─ Cryptids.Web/           ← your app — ALL your work happens in here
└─ Cryptids.Checks/        ← the checks — read-only, never edit
```

**3. Open `CryptidRegistry` in VS Code** — the folder that *contains* both project folders, not one of the projects themselves. (File → Open Folder → pick `CryptidRegistry`.)

**4. In the VS Code terminal, from that same folder:**

```bash
dotnet test Cryptids.Checks
```

**1 / 6 passing.** Check 1 is free — it proves the harness works. The other five are the lab.

> [!WARNING]
> Seeing `error MSB1009: Project file does not exist`? You're one folder too deep — probably inside `Cryptids.Web`. Run `cd ..` and try again; the command goes in the folder that holds *both* projects.

> [!TIP]
> **Git fighting you at the worst moment?** Don't lose lab time to it. On the [repo page](https://github.com/jgrissom/dotnet-web-dev), click **Code → Download ZIP**, unzip it, and copy `week-04/lab/starter` out of that instead. Same files. Sort the clone out afterwards — cloning is still how you'll get every other week.

> [!TIP]
> Two terminals: in one, `cd Cryptids.Web` then `dotnet watch`; in the other, stay at the parent folder and re-run `dotnet test Cryptids.Checks` after each task. Browser for feel, checks for truth.

> [!NOTE]
> **The archive is already written for you.** `Cryptids.Web/Models/Cryptid.cs` and `CryptidData.cs` ship with the starter — six creatures, ready to use as `CryptidData.All`. Tonight's work is controllers, views, and routing. Don't retype the data.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 2 | `CryptidsPageExists` | Add a `CryptidsController` with an `Index` action, and the matching view `Views/Cryptids/Index.cshtml`. **What's in the view doesn't matter yet** — `<h1>Cryptid Registry 👻</h1>` is plenty (an empty file would pass too). This check only proves the wiring: [three names must agree](../lecture-notes.md#conventions-three-names-that-must-agree). |
| 3 | `IndexListsEveryCryptid` | Pass the archive to the view (`return View(CryptidData.All);`), declare it with [`@model List<Cryptid>`](../lecture-notes.md#strongly-typed-views-with-model), and [loop it out](../lecture-notes.md#loops-in-a-view) with `@foreach`. Every creature on the page. |
| 4 | `DetailsShowsOneCryptid` | Add a `Details(int id)` action + `Details.cshtml` so `/Cryptids/Details/2` shows **that one creature** — its name *and* its region. [The Index → Details pair](../lecture-notes.md#index-and-details-the-classic-pair). |
| 5 | `BadIdIsNotFound` | `/Cryptids/Details/999` must return a **404**, not a crash and not a blank page. [`FirstOrDefault` + `NotFound()`](../lecture-notes.md#details-and-the-notfound-guard). |
| 6 | `IndexLinksToDetails` | Each row links to its own details page — `href="/Cryptids/Details/@cryptid.Id"` inside the loop. |

> [!TIP]
> **Your controller needs `using Cryptids.Web.Models;` at the top** before it can see `CryptidData`. Being in the same project isn't enough — a namespace has to be imported.
>
> If `CryptidData` goes **red**, put your cursor on it and press **Ctrl/Cmd + .** — VS Code offers to add the line for you. If it *doesn't* go red, you probably picked `CryptidData` from the IntelliSense list, and VS Code already added the `using` when you accepted it. Scroll up and look: it's there.

> [!TIP]
> Check 4 also asserts the details page does **not** show the whole archive — if you pass `CryptidData.All` to `Details.cshtml`, it'll fail. One creature in, one creature out.

## Rules

> [!IMPORTANT]
> - **Never edit `Cryptids.Checks`** — it's the grading contract. All work happens in `Cryptids.Web`.
> - Don't remove the `public partial class Program { }` line at the bottom of `Program.cs` — the checks need it to see your app.

## 🆘 Stuck?

- **404 on `/Cryptids`?** Route → action → view, in that order. Is the class `public` and named `CryptidsController`? The [routing section](../lecture-notes.md#routing-the-pattern-decoded) explains why the URL finds the class.
- **"The view 'Index' was not found"?** Read the error — it lists every path it searched. Match the folder name to the controller name exactly.
- **"The model item passed into the ViewDataDictionary is of type…"?** Your controller and your `@model` line disagree. Make them match.
- The [troubleshooting appendix](../lecture-notes.md#appendix-troubleshooting) covers the rest — including the `@model` / `@Model` mix-up that gets almost everyone once.

## 🚀 Done early?

- **Add the verdict badge.** Every creature has an `IsDebunked` flag nothing is using yet. Put a `@if` in your details page: 🚫 *Debunked* or 👀 *Unconfirmed*. (The Hodag really was a hoax — Eugene Shepard admitted it in 1893.)
- Flag the debunked ones right in the list, too — same `@if`, inside the loop.
- Show the oldest sighting at the top: `CryptidData.All.OrderBy(c => c.FirstSighting)` — without touching the view.
- Total the reports: `@Model.Sum(c => c.Sightings)` above the table.
