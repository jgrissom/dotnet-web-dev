# Week 13 Lab — The Registry Gets Polished ✨

The Registry works. Nobody could call it easy to use: a curator files a creature and nothing says so, the list has no search box, and every query lives inside a controller.

Tonight it says what just happened, it can be searched and filtered, it comes in pages, and the queries move into a service that two controllers share. **No table changes, and there is no migration.**

**Time:** ~95 minutes in class, in six short blocks — each one follows the part of the demo it practices, and every block but the last ends at an **In class, stop here** note. The blocks are: **Setup and task 1** · task 2 · task 3 · task 4 · task 5 · and a last block for catching up or the stretch. **In-class target: all five checks green.**

## Setup

> [!IMPORTANT]
> **The app arrives as week 12 finished it** — a Curator role on the archive's writes, a seeder that reads `Admin:Email`, an AccessDenied page, and the buttons hidden from everyone but a curator. If your own week-12 lab never got to five, you are **not** behind. Check 1 passes before you touch anything.

**1. Update the starters clone.** Open `dotnet-web` in VS Code, then `` Ctrl+` `` for a terminal standing in it:

```bash
git -C dotnet-web-starters pull
```

`-C` tells git to work *in that folder* without moving your terminal into it — you stay in `dotnet-web`, which is where every other command belongs.

**2. Copy the `week-13` folder out of `dotnet-web-starters` and into `dotnet-web`** — next to the clone, never inside it — **and rename the copy.** `CryptidsPolish` works. (Never work inside the clone.)

```
CryptidsPolish/           ← in `dotnet-web`, the folder you copied and renamed
├─ Cryptids.Web/          ← your app — ALL your work happens in here
└─ Cryptids.Checks/       ← the checks — read-only, never edit
```

**3. Open `CryptidsPolish` in VS Code** — the folder that *contains* both project folders.

**4. Open three terminals** — `` Ctrl+` `` opens the first, then the `+` in the terminal panel (or `` Ctrl+Shift+` ``) twice more. They are terminals 1, 2 and 3 for the rest of the lab, and every command below names the one it runs in.

| Terminal | Where it stands | What runs in it |
|---|---|---|
| 1 | inside `Cryptids.Web` — `cd Cryptids.Web` | **nothing yet.** Task 1 starts `dotnet watch` here, and it runs for the rest of the lab |
| 2 | inside `Cryptids.Web` — `cd Cryptids.Web` | everything else: `dotnet user-secrets`, `dotnet ef` |
| 3 | `CryptidsPolish`, the folder holding **both** projects | `dotnet test Cryptids.Checks` |

**All three open in `CryptidsPolish`. Move terminals 1 and 2 — run this in each of them:**

```bash
cd Cryptids.Web
```

Terminal 3 stays in `CryptidsPolish`, because `dotnet test Cryptids.Checks` runs from the folder holding both projects.

**Don't start the app yet.** Task 1 checks your secrets first.

**5. In terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**1 / 5 passing.** Check 1 is the Registry you were handed, already working. The other four are tonight.

**Now carry straight on to [Task 1](#task-1-in-full)** — it's part of this first block, which ends at the **In class, stop here** note after it.

> [!IMPORTANT]
> **Tonight, restart the app with `Ctrl+R` in terminal 1 — not `Ctrl+C` and `dotnet watch` again.** Task 5 is where `dotnet watch` first asks *Do you want to restart your app?* and you answer `a`, for always. That answer belongs to the running `watch`, and `Ctrl+C` ends it.

## Where tonight's work happens

Every file you touch is in `Cryptids.Web`:

```
Cryptids.Web/
├─ Program.cs                       ← task 5 (one line, one using)
├─ Services/
│   ├─ ICryptidService.cs           ← task 5 (new)
│   └─ CryptidService.cs            ← task 5 (new)
├─ ViewModels/
│   └─ CryptidListViewModel.cs      ← tasks 3 and 4 (new)
├─ Controllers/
│   ├─ CryptidsController.cs        ← tasks 2, 3, 4 and 5
│   ├─ SightingsController.cs       ← task 2
│   └─ HomeController.cs            ← task 5
└─ Views/
    ├─ Shared/_Layout.cshtml        ← task 2
    └─ Cryptids/Index.cshtml        ← tasks 3 and 4
```

> [!NOTE]
> **The checks never connect to SQL Server** — in-memory, seeded from your `HasData`, no wifi needed. **5/5 does not prove your connection string works.** Your browser proves that. Do both.
>
> ⚠️ **One difference you'll see tonight:** SQL Server ignores capitals when it compares text, and the in-memory database doesn't. `hodag` finds The Hodag in your browser. The checks search with the right capitals, so this never fails a check.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 1 | *(check 1 is already green)* | Check your secrets, let `dotnet ef database update` confirm there's nothing to do, start the app and **sign in as yourself**. **No drop tonight.** **[Task 1 in full ↓](#task-1-in-full)** |
| 2 | `AConfirmationSurvivesTheRedirect` | **A message after every change** — the archive's three writes, and the public report form. **[Task 2 in full ↓](#task-2-in-full)** |
| 3 | `TheArchiveCanBeSearched` | **A search box and a status filter**, in the address bar. **[Task 3 in full ↓](#task-3-in-full)** |
| 4 | `TheListComesInPages` | **Three to a page**, with a numbered link for each page. **[Task 4 in full ↓](#task-4-in-full)** |
| 5 | `TheQueriesLiveInAService` | **A service** both controllers ask for. **[Task 5 in full ↓](#task-5-in-full)** |
| ⭐ | — | **Stretch: sort the list.** No check, no points. **[Stretch in full ↓](#stretch-sort-the-list)** |

### Task 1 in full

**Check 1 is already green** — this task is about your database, which the checks can't see but your browser needs.

**No database drop tonight, and here is why.** This starter has exactly the same migration files as last week's, so your database, your account and your curator role are all still valid. The `<UserSecretsId>` hasn't changed either, so your secrets carry over too.

**Look at your secrets — in terminal 2:**

```bash
dotnet user-secrets list
```

**Two lines:** `Admin:Email`, and `ConnectionStrings:DefaultConnection`. On a frozen lab PC they're gone; set them again:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=<SCHOOL-SQL-SERVER>;Database=Cryptids_<COURSE-NUMBER>_<YOUR-INITIALS>;User ID=<YOUR-USERNAME>;Password=<YOUR-PASSWORD>;TrustServerCertificate=True"
dotnet user-secrets set "Admin:Email" "<THE-EMAIL-YOU-JOINED-WITH>"
```

**Same database as week 12.** This is still the Cryptid Registry, and [one application gets one database](../../week-07/lecture-notes.md#naming-your-database).

**Then, still in terminal 2:**

```bash
dotnet ef database update
```

**It applies nothing.** Your database already has all five migrations.

> [!WARNING]
> **`there is already an object named 'Cryptids'`?** You never ran week 12's lab, so your database still has the migrations you made yourself in week 11, and they can't be mixed with this starter's. Only in that case, drop it — **and do these in this order**, because the drop empties `AspNetUsers` too:
>
> 1. In terminal 2: `dotnet ef database drop --force`, then `dotnet ef database update`
> 2. In terminal 1: `dotnet watch`
> 3. **Join** with the email in your `Admin:Email` secret
> 4. **`Ctrl+R` in terminal 1** — the seeder only hands the role out at startup
> 5. **Sign out and back in** — your cookie is older than your role
>
> ⚠️ **Never do this on your own project.** Your semester project has data you care about, and `database drop` does not ask twice. This is a throwaway lab database and that is the only reason it's safe here.

**Now start the app — in terminal 1:**

```bash
dotnet watch
```

**Sign in with your own email.** You should see **＋ Open a new file** on `/Cryptids`. That's your curator role, and task 2 needs it.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 1`** — the same as when you started. Check 2's message says the page after filing a creature shows no message. That's correct: task 2 adds it.

> [!NOTE]
> **In class, stop here.** Task 2 comes after the next part of the demo. Checks 2 to 5 are still red, and that's expected. Finished early? File a creature and look at what the site tells you. Nothing. That is what tonight starts with. Or help a classmate get signed in. Working at home? Carry straight on.

### Task 2 in full

**Check:** `Check2_AConfirmationSurvivesTheRedirect`

**In `Views/Shared/_Layout.cshtml`**, just above `@RenderBody()`:

```cshtml
            @if (TempData["Message"] != null)
            {
                <div class="alert alert-success" role="alert">@TempData["Message"]</div>
            }
```

In the layout, every page can show one.

**In `Controllers/CryptidsController.cs`**, each of the three writes sets a message, just before it redirects. Use the creature's name, and use your own words if you like:

| Action | Where the line goes | Example |
|---|---|---|
| POST `Create` | just above `return RedirectToAction` | `TempData["Message"] = $"{cryptid.Name} is on file.";` |
| POST `Edit` | just below `await _context.SaveChangesAsync();`, inside the `try` | `TempData["Message"] = $"The record for {cryptid.Name} is corrected.";` |
| `DeleteConfirmed` | just below `_context.Cryptids.Remove(cryptid);`, inside the `if` | `TempData["Message"] = $"The file on {cryptid.Name} is closed.";` |

**Now the part the demo didn't do: the public report form.** When a visitor files a sighting, they should get a message too, and it should name the creature. **Look at what the POST in `Controllers/SightingsController.cs` has to work with:** the form posted `form.Sighting.CryptidId`, a number, and nothing else about the creature. So after `SaveChangesAsync`, look the name up, then set the message.

<details>
<summary>Compare, once yours works (or if you're stuck)</summary>

```csharp
_context.Sightings.Add(form.Sighting);
await _context.SaveChangesAsync();

// The form only posted the creature's id, so look its name up.
var name = _context.Cryptids
    .Where(c => c.Id == form.Sighting.CryptidId)
    .Select(c => c.Name)
    .First();

TempData["Message"] = $"Your report on {name} is filed. Thank you.";
return RedirectToAction("Details", "Cryptids", new { id = form.Sighting.CryptidId });
```

</details>

**See it work.** File a creature, and the message is on the list. **Reload**: it's gone, because `TempData` is read once. Then **sign out** and file a sighting. The message is on the creature's page, for a visitor with no account.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 2`** — checks 1 and 2. Check 3's message says there's no search box. That's correct: task 3 builds it.

> [!NOTE]
> **In class, stop here.** Task 3 comes after the break and the next part of the demo. Checks 3 to 5 are still red, and that's expected. Finished early? Change `TempData` to `ViewData` in one action and in the layout, and watch the message disappear, then change them back. Or help a classmate. Working at home? Carry straight on.

### Task 3 in full

**Check:** `Check3_TheArchiveCanBeSearched`

**The page needs more than a list now, so it gets a ViewModel.** Create `ViewModels/CryptidListViewModel.cs`:

```csharp
using Cryptids.Web.Models;

namespace Cryptids.Web.ViewModels;

// What the list page needs: this page's creatures, plus the search that
// produced them, so the form can show what was typed.
public class CryptidListViewModel
{
    public List<Cryptid> Cryptids { get; set; } = new();
    public string? Search { get; set; }
    public string? Status { get; set; }
}
```

**In `Views/Cryptids/Index.cshtml`**, the first line becomes `@model CryptidListViewModel`, and everything that read `Model` as a list reads `Model.Cryptids` — the count line, the `@foreach`. Then add this form, just above the cards:

```cshtml
<form method="get" class="row g-2 mb-4">
    <div class="col-md-6">
        <input type="search" name="search" value="@Model.Search" class="form-control"
               placeholder="Name, region or Latin name" aria-label="Search the registry" />
    </div>
    <div class="col-md-4">
        <select name="status" class="form-select" aria-label="Filter by status">
            <option value="">Every creature</option>
            <option value="unconfirmed" selected="@(Model.Status == "unconfirmed")">Unconfirmed</option>
            <option value="debunked" selected="@(Model.Status == "debunked")">Debunked</option>
        </select>
    </div>
    <div class="col-md-2">
        <button class="btn btn-secondary w-100">Search</button>
    </div>
</form>
```

**In `Controllers/CryptidsController.cs`**, `Index` takes the two values. Build it the way the demo built its query: start with `.Include(c => c.Sightings).AsQueryable()`, add a `Where` for each box that was filled in, and run it once at `ToList`, sorted by name. Two things are different from the demo:

- **Search three columns:** `Name`, `Region` and `LatinName`. **`LatinName` is nullable**, so the compiler warns you (`CS8602`) until you check it isn't null first. That's a warning, not a crash: in the database a `NULL` simply doesn't match. Clear it anyway.
- **The dropdown's values aren't column values.** `status` is the word `unconfirmed` or `debunked`, or nothing. `IsDebunked` is a `bool`. Your `if` turns one into the other.

<details>
<summary>Compare, once yours works (or if you're stuck)</summary>

```csharp
    public IActionResult Index(string? search, string? status)
    {
        // Nothing runs yet: this builds the query, and each Where adds to it.
        var cryptids = _context.Cryptids
            .Include(c => c.Sightings)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            // LatinName is nullable: a creature filed through the form has none.
            cryptids = cryptids.Where(c => c.Name.Contains(search)
                                        || c.Region.Contains(search)
                                        || (c.LatinName != null && c.LatinName.Contains(search)));
        }

        if (status == "debunked")
        {
            cryptids = cryptids.Where(c => c.IsDebunked);
        }
        else if (status == "unconfirmed")
        {
            cryptids = cryptids.Where(c => !c.IsDebunked);
        }

        return View(new CryptidListViewModel
        {
            Cryptids = cryptids.OrderBy(c => c.Name).ToList(),
            Search = search,
            Status = status
        });
    }
```

</details>

> [!TIP]
> **The page shows a `500` between edits.** While the action and the view disagree about the model, you get `The model item passed into the ViewDataDictionary is of type …`. Finish both, then reload.

**See it work.** Search `hodag`, and read the address bar: `/Cryptids?search=hodag&status=`. Bookmark it if you like; it's only a URL. Search a Latin name. Pick **Debunked**. Then pick **Debunked** and search `hodag` and `mothman`: the two `Where`s add up.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 3`** — checks 1 to 3. Check 4's message says `/Cryptids` lists 6 creatures. That's correct: task 4 cuts it to three.

> [!NOTE]
> **In class, stop here.** Task 4 comes after the next part of the demo. Checks 4 and 5 are still red, and that's expected. Finished early? Add a line under the `<h1>` that says what's being searched for, only when something is. Or help a classmate whose search does nothing: the input's `name` has to match the action's parameter. Working at home? Carry straight on.

### Task 4 in full

**Check:** `Check4_TheListComesInPages`

**Three to a page.** Six creatures makes two pages.

**The ViewModel gets three numbers** — `ViewModels/CryptidListViewModel.cs`, the whole file:

```csharp
using Cryptids.Web.Models;

namespace Cryptids.Web.ViewModels;

// What the list page needs: this page's creatures, where it is in the list, plus the search that
// produced them, so the form can show what was typed.
public class CryptidListViewModel
{
    public List<Cryptid> Cryptids { get; set; } = new();
    public string? Search { get; set; }
    public string? Status { get; set; }
    public int Page { get; set; }
    public int TotalPages { get; set; }
    public int TotalCount { get; set; }
}
```

**In `Controllers/CryptidsController.cs`**, add `private const int PageSize = 3;` just below the `_context` field. Then `Index` takes `int page = 1`, and the end of it changes, in **this order**:

1. **`Count`** what matched, before anything cuts it down.
2. **Work out `totalPages`**, at least 1: `Math.Max(1, (int)Math.Ceiling(total / (double)PageSize))`.
3. **`Math.Clamp(page, 1, totalPages)`** — anyone can type a page number, and on SQL Server a negative one is an error.
4. **`OrderBy`, `Skip((page - 1) * PageSize)`, `Take(PageSize)`, `ToList`.** Sort before you cut.
5. **Fill in `Page`, `TotalPages` and `TotalCount`.**

<details>
<summary>Compare, once yours works (or if you're stuck)</summary>

```csharp
    public IActionResult Index(string? search, string? status, int page = 1)
    {
        // Nothing runs yet: this builds the query, and each Where adds to it.
        var cryptids = _context.Cryptids
            .Include(c => c.Sightings)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            // LatinName is nullable: a creature filed through the form has none.
            cryptids = cryptids.Where(c => c.Name.Contains(search)
                                        || c.Region.Contains(search)
                                        || (c.LatinName != null && c.LatinName.Contains(search)));
        }

        if (status == "debunked")
        {
            cryptids = cryptids.Where(c => c.IsDebunked);
        }
        else if (status == "unconfirmed")
        {
            cryptids = cryptids.Where(c => !c.IsDebunked);
        }

        // Count what matched, before cutting it down to one page.
        var total = cryptids.Count();
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)PageSize));
        page = Math.Clamp(page, 1, totalPages);

        return View(new CryptidListViewModel
        {
            Cryptids = cryptids
                .OrderBy(c => c.Name)
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .ToList(),
            Search = search,
            Status = status,
            Page = page,
            TotalPages = totalPages,
            TotalCount = total
        });
    }
```

</details>

**In `Views/Cryptids/Index.cshtml`**, the count line reads `Model.TotalCount`, so it still says 6 on a page of three.

**Now the pager, and it's different from the demo's.** The demo had Previous and Next. You want **a numbered link for every page**: a `for` loop from 1 to `Model.TotalPages`, using Bootstrap's `pagination` classes, with the current page marked `active`. **Every link carries `asp-route-page`, `asp-route-search` and `asp-route-status`**, or page 2 of a filtered list is page 2 of everything.

<details>
<summary>Compare, once yours works (or if you're stuck)</summary>

```cshtml

@if (Model.TotalPages > 1)
{
    <nav class="mt-4" aria-label="Pages">
        <ul class="pagination">
            @for (var p = 1; p <= Model.TotalPages; p++)
            {
                <li class="page-item @(p == Model.Page ? "active" : "")">
                    <a class="page-link" asp-route-page="@p" asp-route-search="@Model.Search" asp-route-status="@Model.Status">@p</a>
                </li>
            }
        </ul>
    </nav>
}
```

</details>

**See it work.** Page 1 is Bigfoot, Chupacabra and Mothman. Click **2**. Pick **Unconfirmed** and search `e`: four creatures, two pages. Click **2**, and read the address bar. Then type `/Cryptids?page=99` and `/Cryptids?page=0`: the nearest real page, and no error.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 4`** — checks 1 to 4. Check 5's message says there's no `ICryptidService`. That's correct: task 5 creates it.

> [!NOTE]
> **In class, stop here.** Task 5 comes after the break and the next part of the demo. Check 5 is still red, and that's expected. Finished early? Count the lines in `Index`. It only reads a list. That is what task 5 is for. Or help a classmate: if page 1 shows the wrong three, the `OrderBy` is missing or comes after `Take`. Working at home? Carry straight on.

### Task 5 in full

**Check:** `Check5_TheQueriesLiveInAService`

**Move the query out.** Create `Services/ICryptidService.cs`:

```csharp
using Cryptids.Web.Models;
using Cryptids.Web.ViewModels;

namespace Cryptids.Web.Services;

// What the app can ask of the archive. Controllers depend on this, not on the
// class underneath it.
public interface ICryptidService
{
    CryptidListViewModel GetList(string? search, string? status, int page);
    Task<Cryptid?> GetFeaturedAsync();
}
```

Two methods, not the demo's one: the list, and the featured creature your home page shows.

**Create `Services/CryptidService.cs`.** Move your list query out of `Index` and into `GetList`, along with `PageSize`. It asks for the context in its constructor, the same way the controller always did. `GetFeaturedAsync` is the query from `HomeController`.

<details>
<summary>Compare, once yours works (or if you're stuck)</summary>

```csharp
using Microsoft.EntityFrameworkCore;
using Cryptids.Web.Data;
using Cryptids.Web.Models;
using Cryptids.Web.ViewModels;

namespace Cryptids.Web.Services;

// The queries two controllers need. Each one asked for the context in its
// constructor; now this class does, and they ask for this.
public class CryptidService : ICryptidService
{
    private const int PageSize = 3;

    private readonly CryptidContext _context;

    public CryptidService(CryptidContext context)
    {
        _context = context;
    }

    public CryptidListViewModel GetList(string? search, string? status, int page)
    {
        // Nothing runs yet: this builds the query, and each Where adds to it.
        var cryptids = _context.Cryptids
            .Include(c => c.Sightings)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            // LatinName is nullable, so the compiler wants the null check. In the
            // database a NULL simply doesn't match.
            cryptids = cryptids.Where(c => c.Name.Contains(search)
                                        || c.Region.Contains(search)
                                        || (c.LatinName != null && c.LatinName.Contains(search)));
        }

        if (status == "debunked")
        {
            cryptids = cryptids.Where(c => c.IsDebunked);
        }
        else if (status == "unconfirmed")
        {
            cryptids = cryptids.Where(c => !c.IsDebunked);
        }

        // Count what matched, before cutting it down to one page.
        var total = cryptids.Count();
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)PageSize));
        page = Math.Clamp(page, 1, totalPages);

        return new CryptidListViewModel
        {
            Cryptids = cryptids
                .OrderBy(c => c.Name)
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .ToList(),
            Search = search,
            Status = status,
            Page = page,
            TotalPages = totalPages,
            TotalCount = total
        };
    }

    // One random record, chosen by the database: this becomes
    // ORDER BY NEWID() — one row comes back, not the whole table.
    public async Task<Cryptid?> GetFeaturedAsync()
    {
        return await _context.Cryptids
            .OrderBy(c => Guid.NewGuid())
            .FirstOrDefaultAsync();
    }
}
```

</details>

**Register it.** In `Program.cs`, add `using Cryptids.Web.Services;` at the top, and just above `var app = builder.Build();`:

```csharp
// Week 13: when anything asks for an ICryptidService, hand it a CryptidService.
// One per request, the same lifetime AddDbContext gives the context.
builder.Services.AddScoped<ICryptidService, CryptidService>();
```

> [!IMPORTANT]
> **Read terminal 1 after this save.** If it says `Press "Ctrl + R" to restart.`, press it: the line isn't live until you do. *(If you answered `a` earlier, it restarts by itself.)*

**`CryptidsController`:** add `using Cryptids.Web.Services;`, take `ICryptidService cryptids` in the constructor beside the context, keep it in a field called `_cryptids`, remove `PageSize`, and `Index` becomes one line:

```csharp
public IActionResult Index(string? search, string? status, int page = 1)
{
    return View(_cryptids.GetList(search, status, page));
}
```

> [!IMPORTANT]
> **Terminal 1 now stops and asks:** `ENC0004: Updating the modifiers of const field requires restarting the application`, then `Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`. **Answer `a`.**

**The part the demo didn't do: `HomeController`.** Its only query is the featured creature, and that's in the service now. So it asks for `ICryptidService` **instead of** the context. Remove the `_context` field, change the constructor, and `Index` becomes:

```csharp
public async Task<IActionResult> Index()
{
    return View(await _cryptids.GetFeaturedAsync());
}
```

Then remove the `using` lines nothing needs any more. **A controller with no context** is the point: two controllers share one query, and neither one writes it.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 5`** — all five, tonight's in-class target. 🎉 Check 5 doesn't read your code: it wraps your service in a recorder, loads `/Cryptids` and `/`, and checks your service was really called.

> [!NOTE]
> **In class, this is the last stop.** The rest of the demo comes next, then a last block for catching up or the stretch below. Finished early? Change `AddScoped` to `AddSingleton`, save, and read what terminal 1 says. Change it back. Or help a classmate. Working at home? You're done.

### Stretch: sort the list

**No check, no points, and nobody needs this for the homework.** In class this is the last block — and the block has no stop. If any of your checks are still red, finish those first.

Let a visitor sort by name or by year first sighted. It touches everything tonight:

1. A `<select name="sort">` in the form, with values `name` and `year`.
2. `string? sort` on the action, on `GetList`, on the interface, and a `Sort` property on the ViewModel.
3. Instead of `OrderBy(c => c.Name)`: `sort == "year" ? cryptids.OrderBy(c => c.FirstSighting) : cryptids.OrderBy(c => c.Name)`.
4. A third `asp-route-sort` on the page links.

Keep `Name` as a tiebreaker if you like, with `ThenBy`. **Notice what changed when the signature did:** the interface, the class and the one caller, and the compiler pointed at each.

## Rules

- **Never edit `Cryptids.Checks`.** If a check looks wrong, tell me.
- **Work in `Cryptids.Web` only.**
- `dotnet test Cryptids.Checks` runs from `CryptidsPolish`, the folder above both projects.
- **The checks don't need wifi or SQL Server** — they run your app against an in-memory database. 5/5 does **not** prove your connection string works. Your browser proves that.

## 🆘 Stuck?

- **The app stops before `Now listening on:` with `The ConnectionString property has not been initialized`** — the connection string secret is gone; frozen lab PCs wipe it. [Task 1 in full ↑](#task-1-in-full). The app reads the database as it starts, so this stops it outright.
- **The app stops before `Now listening on:` with `SqlException … A network-related or instance-specific error`** — the server name in your connection string, or no network.
- **`dotnet ef` says there's already an object named 'Cryptids'** — you never ran week 12's lab. The warning in [Task 1 in full ↑](#task-1-in-full) has the order. (Only ever in this lab — never on your own project's database.)
- **No ＋ Open a new file after signing in** — `dotnet user-secrets list` must show the email you joined with under `Admin:Email`. Then `Ctrl+R` in terminal 1, then sign out and back in.
- **No message after a change** — the block isn't in `_Layout.cshtml`, or one of the two still says `ViewData`. `ViewData` lives for one request, and a redirect is a second request. [Task 2 in full ↑](#task-2-in-full)
- **`The name 'name' does not exist in the current context`** in `SightingsController.cs` — the lookup has to come before the `TempData` line.
- **`The model item passed into the ViewDataDictionary is of type …`** — the action and the view disagree about the model. Finish both. [Task 3 in full ↑](#task-3-in-full)
- **The search box does nothing** — the input's `name` and the action's parameter have to match: `search` and `search`.
- **`CS8602: Dereference of a possibly null reference`** on `LatinName` — a warning, not an error. `c.LatinName != null && c.LatinName.Contains(search)`.
- **Page 1 shows the wrong three** — `OrderBy` is missing, or comes after `Take`. [Task 4 in full ↑](#task-4-in-full)
- **Check 4 says page 1 should still say 6 creatures on file** — the count line reads `Model.Cryptids.Count`. Use `Model.TotalCount`.
- **Page 2 of a search shows everything** — the page links need `asp-route-search` and `asp-route-status`.
- **`Unable to resolve service for type 'Cryptids.Web.Services.ICryptidService'`, and every check is red** — the `AddScoped` line is missing, it's below `builder.Build()`, or terminal 1 is waiting for `Ctrl+R`. [Task 5 in full ↑](#task-5-in-full)
- **`Cannot consume scoped service … from singleton`** — it's `AddSingleton`; use `AddScoped`. The service holds the context, and the context lives for one request.
- **A `500` over code you're sure is right** — terminal 1 may be asking `Do you want to restart your app?`. Answer `a`. If it says `Press "Ctrl + R" to restart.`, press it.
- **Your edit isn't showing up** — a compile error under `dotnet watch` can be silent: the app keeps serving the last good build. Run `dotnet test Cryptids.Checks` in terminal 3, which prints the file and line.
- **"Could not find a MSBuild project file"** — that terminal is standing in `CryptidsPolish`, which holds two projects. `dotnet watch`, `dotnet ef` and `dotnet user-secrets` need one: run `cd Cryptids.Web` in terminals 1 and 2.

## 🚀 Done early?

- **Do the stretch above.**
- **Show which page you're on in the title.** `ViewData["Title"]` can say *Field Reports — page 2*, which is what a bookmark and a browser tab show.
- **Prove the interface earns its place.** Write a `StubCryptidService` that returns one hard-coded creature, swap one line in `Program.cs`, and see `/Cryptids` change with no controller edit. Then swap it back, reload, and only then delete the file: `dotnet watch` can trip over a file that vanishes during a save.
