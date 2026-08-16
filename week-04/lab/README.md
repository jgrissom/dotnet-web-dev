# Week 4 Lab — Cryptid Registry 👻

Six legendary creatures, one archive — **the same six you hand-built in flat HTML back in week 2.** Tonight it stops being three static pages and becomes an app: a list page, a details page, and a 404 that tells the truth. Same rhythm as *First Flight* — run the checks, turn red into green.

**Time:** ~30 minutes in class — **in-class target: checks 1–4 green.** Checks 5–6 (and deploying it) roll into the homework by design.

## Setup

> [!NOTE]
> **You don't create anything.** Both projects already exist in the starter — you're copying a folder, not scaffolding a new app. `dotnet new` is not part of this lab.

**1. Update the starters clone.** Open `dotnet-web` in VS Code, then `` Ctrl+` `` for a terminal standing in it:

```bash
git -C dotnet-web-starters pull
```

`-C` tells git to work *in that folder* without moving your terminal into it — you stay in `dotnet-web`, which is where every other command belongs.

**2. Copy the `week-04` folder into `dotnet-web`** — next to the clone, never inside it — **and rename the copy** to something meaningful. `CryptidRegistry` works. (Copy it *out*; never work inside the clone, or next week's `git pull` will fight you.)

You should end up with exactly this:

```
CryptidRegistry/            ← in `dotnet-web`, the folder you copied and renamed
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
> **Git fighting you at the worst moment?** Don't lose lab time to it. On the [starters repo page](https://github.com/jgrissom/dotnet-web-starters), click **Code → Download ZIP**, unzip it, and copy `week-04` out of that instead. Same files. Sort the clone out afterwards — cloning is still how you'll get every other week.

> [!TIP]
> Two terminals: in one, `cd Cryptids.Web` then [`dotnet watch`](../../week-03/lecture-notes.md#dotnet-new-mvc); in the other, stay at the parent folder and re-run `dotnet test Cryptids.Checks` after each task. Browser for feel, checks for truth.

## What you're given

**The model and the data already exist** — don't write them, and don't retype them. Tonight's work is controllers, views, and routing. (The notes explain [what a model class is](../lecture-notes.md#the-model-a-plain-c-class) and [why the list is `static`](../lecture-notes.md#the-seeded-list-a-database-that-isnt-one-yet) — worth reading before the homework, where you write your own.)

`Cryptids.Web/Models/Cryptid.cs`:

```csharp
public class Cryptid
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Region { get; set; } = "";
    public int FirstSighting { get; set; }
    public int Sightings { get; set; }
    public bool IsDebunked { get; set; }
}
```

`Cryptids.Web/Models/CryptidData.cs` — six creatures, reachable anywhere as **`CryptidData.All`**:

```csharp
public static class CryptidData
{
    public static List<Cryptid> All { get; } = new()
    {
        new Cryptid { Id = 1, Name = "The Hodag", Region = "Rhinelander, Wisconsin", FirstSighting = 1893, Sightings = 47, IsDebunked = true },
        // ...Bigfoot, Mothman, the Loch Ness Monster, the Jersey Devil, Chupacabra
    };
}
```

> [!TIP]
> `CryptidData.All` is a `List<Cryptid>` — that's the thing you hand to the view in check 3, and the thing you search with `FirstOrDefault` in checks 4 and 5. Open both files and read them before you start; it takes a minute and everything after makes more sense.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 2 | `CryptidsPageExists` | Add a `CryptidsController` with an `Index` action, and the matching view `Views/Cryptids/Index.cshtml`. **What's in the view doesn't matter yet** — `<h1>Cryptid Registry 👻</h1>` is plenty (an empty file would pass too). This check only proves the wiring: [three names must agree](../lecture-notes.md#conventions-three-names-that-must-agree). |
| 3 | `IndexListsEveryCryptid` | Pass the archive to the view (`return View(CryptidData.All);`), declare it with [`@model List<Cryptid>`](../lecture-notes.md#strongly-typed-views-with-model), and [loop it out](../lecture-notes.md#loops-in-a-view) with `@foreach`. **The check only looks for each creature's `Name`** — the other properties are your call. A `<table>` with Name, Region and Sightings is the obvious build, and check 6 will want one more cell for the link. |
| 4 | `DetailsShowsOneCryptid` | Add a `Details(int id)` action + `Details.cshtml` so `/Cryptids/Details/2` shows **that one creature** — its name *and* its region. [The Index → Details pair](../lecture-notes.md#index-and-details-the-classic-pair). |
| 5 | `BadIdIsNotFound` | `/Cryptids/Details/999` must return a **404**, not a crash and not a blank page. [`FirstOrDefault` + `NotFound()`](../lecture-notes.md#details-and-the-notfound-guard). |
| 6 | `IndexLinksToDetails` | Each row links to its own details page — `href="/Cryptids/Details/@cryptid.Id"` inside the loop. |

> [!TIP]
> **Your controller needs `using Cryptids.Web.Models;` at the top** before it can see `CryptidData`. Being in the same project isn't enough — [a namespace has to be imported](../lecture-notes.md#namespaces-and-the-using-they-require).
>
> If `CryptidData` goes **red**, put your cursor on it and press **Ctrl/Cmd + .** — VS Code offers to add the line for you. If it *doesn't* go red, you probably picked `CryptidData` from the IntelliSense list, and VS Code already added the `using` when you accepted it. Scroll up and look: it's there.

> [!TIP]
> Check 4 also asserts the details page does **not** show the whole archive — if you pass `CryptidData.All` to `Details.cshtml`, it'll fail. One creature in, one creature out.

## Rules

> [!IMPORTANT]
> - **Never edit `Cryptids.Checks`** — it's the grading contract. All work happens in `Cryptids.Web`.
> - Don't remove the `public partial class Program { }` line at the bottom of `Program.cs` — the checks need it to see your app.

## 🆘 Stuck?

- **404 on `/Cryptids`?** Route → action → view, in that order. Is the class `public` and named `CryptidsController`? The [routing section](../lecture-notes.md#routing-the-pattern-decoded) explains why the URL finds the class, and week 3 covers [what a 404 versus a 500 is telling you](../../week-03/lecture-notes.md#verbs-and-status-codes).
- **"The view 'Index' was not found"?** Read the error — it lists every path it searched. Match the folder name to the controller name exactly.
- **"The model item passed into the ViewDataDictionary is of type…"?** Your controller and your [`@model` line](../lecture-notes.md#strongly-typed-views-with-model) disagree — one is passing a list, the other expects a single item, or the reverse. Make them match.
- The [troubleshooting appendix](../lecture-notes.md#appendix-troubleshooting) covers the rest — including the `@model` / `@Model` mix-up that gets almost everyone once.

## 🚀 Done early?

- **Add the verdict badge.** Every creature has an `IsDebunked` flag nothing is using yet. Put a `@if` in your details page: 🚫 *Debunked* or 👀 *Unconfirmed*. (The Hodag really was a hoax — Eugene Shepard admitted it in 1893.)
- Flag the debunked ones right in the list, too — same `@if`, inside the loop.
- Show the oldest sighting at the top: `CryptidData.All.OrderBy(c => c.FirstSighting)` — without touching the view.
- Total the reports: `@Model.Sum(c => c.Sightings)` above the table.
