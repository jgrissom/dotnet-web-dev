# Week 13 Lab — The Registry Gets an API 📡

The Registry has only ever answered people. Everything it knows comes back wrapped in a navbar, a layout and a footer.

Tonight it answers programs too. The archive answers in JSON, a creature comes with its reports, anybody can file a report with a POST, and only a curator can change the archive. **No table changes, and there is no migration.** The pages stay exactly as they are: **the API is a second set of addresses, not a replacement.**

**Time:** ~100 minutes in class, in six short blocks — each one follows the part of the demo it practices, and every block but the last ends at an **In class, stop here** note. The blocks are: **Setup and task 1** · task 2 · task 3 · task 4 · task 5 · and a last block for catching up or the stretch. **In-class target: all five checks green.**

## Setup

> [!IMPORTANT]
> **The app arrives as week 12 finished it, plus one new file, `wwwroot/api-tester.html`** — a page for testing an API, which you'll meet in task 4. It has a Curator role on the archive's writes, a seeder that reads `Admin:Email`, an AccessDenied page, and the buttons hidden from everyone but a curator. If your own week-12 lab never got to five, you are **not** behind. Check 1 passes before you touch anything.

**1. Update the starters clone.** Open `dotnet-web` in VS Code, then `` Ctrl+` `` for a terminal standing in it:

```bash
git -C dotnet-web-starters pull
```

`-C` tells git to work *in that folder* without moving your terminal into it — you stay in `dotnet-web`, which is where every other command belongs.

**2. Copy the `week-13` folder out of `dotnet-web-starters` and into `dotnet-web`** — next to the clone, never inside it — **and rename the copy.** `CryptidsApi` works. (Never work inside the clone.)

```
CryptidsApi/              ← in `dotnet-web`, the folder you copied and renamed
├─ Cryptids.Web/          ← your app — ALL your work happens in here
└─ Cryptids.Checks/       ← the checks — read-only, never edit
```

**3. Open `CryptidsApi` in VS Code** — the folder that *contains* both project folders.

**4. Open three terminals** — `` Ctrl+` `` opens the first, then the `+` in the terminal panel (or `` Ctrl+Shift+` ``) twice more. They are terminals 1, 2 and 3 for the rest of the lab, and every command below names the one it runs in.

| Terminal | Where it stands | What runs in it |
|---|---|---|
| 1 | inside `Cryptids.Web` — `cd Cryptids.Web` | **nothing yet.** Task 1 starts `dotnet watch` here, and it runs for the rest of the lab |
| 2 | inside `Cryptids.Web` — `cd Cryptids.Web` | everything else: `dotnet user-secrets`, `dotnet ef` |
| 3 | `CryptidsApi`, the folder holding **both** projects | `dotnet test Cryptids.Checks` |

**All three open in `CryptidsApi`. Move terminals 1 and 2 — run this in each of them:**

```bash
cd Cryptids.Web
```

Terminal 3 stays in `CryptidsApi`, because `dotnet test Cryptids.Checks` runs from the folder holding both projects.

**Don't start the app yet.** Task 1 checks your secrets first.

**5. In terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**1 / 5 passing.** Check 1 is the Registry you were handed, already working. The other four are tonight.

**Now carry straight on to [Task 1](#task-1-in-full)** — it's part of this first block, which ends at the **In class, stop here** note after it.

> [!IMPORTANT]
> **Tonight's one restart is `Ctrl+R` in terminal 1, and you press it after every edit to `Program.cs`.** There are two: task 2 and task 5. `Program.cs` runs once, when the app starts, so hot reload can't run it again. Terminal 1 tells you when: it prints `Press "Ctrl + R" to restart.` above `Hot reload succeeded`, and the edit isn't live until you do.

## Where tonight's work happens

Every file you touch is in `Cryptids.Web`:

```
Cryptids.Web/
├─ Program.cs                       ← tasks 2 and 5
├─ Dtos/                            ← a new folder
│   ├─ CryptidDto.cs                ← task 3 (new)
│   ├─ SightingDto.cs               ← task 3 (new)
│   ├─ CryptidDetailsDto.cs         ← task 3 (new)
│   ├─ SightingInput.cs             ← task 4 (new)
│   └─ CryptidInput.cs              ← task 5 (new)
└─ Controllers/
    ├─ CryptidsApiController.cs     ← tasks 2, 3 and 5 (new)
    └─ SightingsApiController.cs    ← task 4 (new)
```

**No migration tonight.** An API reads and writes the tables you already have.

> [!NOTE]
> **The checks never connect to SQL Server** — in-memory, seeded from your `HasData`, no wifi needed. Whatever they create lives only as long as the test run. **5/5 does not prove your connection string works.** Your browser proves that. Do both.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 1 | *(check 1 is already green)* | Check your secrets, let `dotnet ef database update` confirm there's nothing to do, start the app and **sign in as yourself**. **No drop tonight.** **[Task 1 in full ↓](#task-1-in-full)** |
| 2 | `TheArchiveAnswersInJson` | **The list, and the count** — an API controller, and a minimal endpoint. **[Task 2 in full ↓](#task-2-in-full)** |
| 3 | `ACreatureComesWithItsReports` | **One creature, and a list that counts** — with its reports, through DTOs that can't loop. **[Task 3 in full ↓](#task-3-in-full)** |
| 4 | `AnyoneCanFileAReportWithJson` | **The public POST** — and the creature lookup its rules can't do. **[Task 4 in full ↓](#task-4-in-full)** |
| 5 | `OnlyCuratorsCanChangeTheArchiveByApi` | **PUT and DELETE, for curators** — and the Missing page kept off `/api`. **[Task 5 in full ↓](#task-5-in-full)** |
| ⭐ | — | **Stretch: a POST for curators.** No check, no points. **[Stretch in full ↓](#stretch-a-post-for-curators)** |

### Task 1 in full

**Check 1 is already green** — this task is about your database, which the checks can't see but your browser needs.

**No database drop tonight, and here is why.** This starter has exactly the same migration files as week 12's, so your database, your account and your curator role are all still valid. The `<UserSecretsId>` hasn't changed either, so your secrets carry over too.

**Look at your secrets — in terminal 2:**

```bash
dotnet user-secrets list
```

**Two lines:** `Admin:Email`, and `ConnectionStrings:DefaultConnection`. On a frozen lab PC they're gone; set them again. The connection string first:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=<SCHOOL-SQL-SERVER>;Database=Cryptids_<COURSE-NUMBER>_<YOUR-INITIALS>;User ID=<YOUR-USERNAME>;Password=<YOUR-PASSWORD>;TrustServerCertificate=True"
```

Then your email:

```bash
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

**Sign in with your own email.** You should see **＋ Open a new file** on `/Cryptids`. That's your curator role, and task 5 needs it.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 1`** — the same as when you started. Check 2's message says `GET /api/cryptids` came back 404. That's correct: task 2 creates it.

> [!NOTE]
> **In class, stop here.** Task 2 comes after the next part of the demo. Checks 2 to 5 are still red, and that's expected. Finished early? Open `/Cryptids`, then **View Page Source**, and find The Hodag's name in there. That digging is what tonight makes unnecessary. Or help a classmate get signed in. Working at home? Carry straight on.

### Task 2 in full

**Check:** `Check2_TheArchiveAnswersInJson`

**The controller.** Create `Controllers/CryptidsApiController.cs`:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cryptids.Web.Data;
using Cryptids.Web.Models;

namespace Cryptids.Web.Controllers;

// Week 13: the archive, answered as JSON.
[ApiController]
[Route("api/cryptids")]
public class CryptidsApiController : ControllerBase
{
    private readonly CryptidContext _context;

    public CryptidsApiController(CryptidContext context)
    {
        _context = context;
    }

    // GET /api/cryptids
    [HttpGet]
    public async Task<List<Cryptid>> GetAll()
    {
        return await _context.Cryptids.ToListAsync();
    }
}
```

`ControllerBase`, because an API has no views. `[ApiController]`, which you'll see earn its place in the next three tasks. `[Route("api/cryptids")]` on the class gives it its address, and `[HttpGet]` says this action answers a GET there. It returns the data; there is no `View()`.

**Try it.** In your browser, go to **`/api/cryptids`**. Six creatures as JSON, and nothing else: no navbar, no layout. Notice the names: `Name` in your C# is `name` in the JSON. The serializer does that. **And notice `"sightings": []` on every creature.** The Hodag's page shows three reports. Nothing loaded them. Task 3 fixes that.

**Then the count, the other way.** In `Program.cs`, just above `app.Run();`:

```csharp
// Week 13: a minimal API endpoint. The same kind of answer as a controller
// action, in one statement, with no class around it.
app.MapGet("/api/cryptids/count", async (CryptidContext db) =>
    new { count = await db.Cryptids.CountAsync() });
```

No class, no constructor. `MapGet` takes an address and a function, the function asks for what it needs, and whatever it returns becomes the JSON.

> [!IMPORTANT]
> **Terminal 1 prints `Press "Ctrl + R" to restart.` above `Hot reload succeeded`. Press `Ctrl+R` in terminal 1.** `Program.cs` runs once, at startup. Until you restart, `/api/cryptids/count` is the *Not on file* page, over correct code.

Go to **`/api/cryptids/count`**: `{"count":6}`.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 2`** — checks 1 and 2. Check 3's message says `GET /api/cryptids/1` came back 404. That's correct: task 3 writes it.

> [!NOTE]
> **In class, stop here.** Task 3 comes after the break and the next part of the demo. Checks 3 to 5 are still red, and that's expected. Finished early? At `/api/cryptids`, find The Hodag's empty `"sightings"`, then open its page and count its reports. The next part of the demo is about why the list doesn't simply load them. Or help a classmate find their Ctrl+R. Working at home? Carry straight on.

### Task 3 in full

**Check:** `Check3_ACreatureComesWithItsReports`

**First, see the problem.** In `Controllers/CryptidsApiController.cs`, paste this just below `GetAll`, inside the class. It loads one creature with its reports, the same way the Details page does, and returns the `Cryptid` itself:

```csharp
    // GET /api/cryptids/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Cryptid>> GetOne(int id)
    {
        return await _context.Cryptids.Include(c => c.Sightings).FirstAsync(c => c.Id == id);
    }
```

Go to **`/api/cryptids/1`** and read what comes back. **The page starts with a run of JSON**, because the serializer had already begun writing. Scroll down to the error page below it.

`A possible object cycle was detected`. A `Cryptid` has `Sightings`; each `Sighting` has a `Cryptid`, which `Include` filled in; so the serializer goes round until it gives up. Leave the action where it is: you replace it below.

**The fix is DTOs: classes whose only job is the shape of the JSON, built by hand, so nothing can point back.** Three of them.

**What the list should say.** A list of creatures needs each one's facts and how many reports it has, not the reports themselves. Create `Dtos/CryptidDto.cs`:

```csharp
namespace Cryptids.Web.Dtos;

// What /api/cryptids says about each creature: the facts, and how many reports
// are on file. The reports themselves are on the creature's own address.
public class CryptidDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Region { get; set; } = "";
    public int FirstSighting { get; set; }
    public bool IsDebunked { get; set; }
    public string? LatinName { get; set; }
    public int ReportCount { get; set; }
}
```

**Then one report.** Create `Dtos/SightingDto.cs`:

```csharp
namespace Cryptids.Web.Dtos;

// One report, as the API says it. It names its creature with a number, so
// there is no Cryptid object here to lead back to the creature's reports.
public class SightingDto
{
    public int Id { get; set; }
    public int CryptidId { get; set; }
    public string Witness { get; set; } = "";
    public string Location { get; set; } = "";
    public DateTime SeenOn { get; set; }
    public string Account { get; set; } = "";
}
```

and `Dtos/CryptidDetailsDto.cs`:

```csharp
namespace Cryptids.Web.Dtos;

// What /api/cryptids/1 says: the same facts as the list, and the reports.
public class CryptidDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Region { get; set; } = "";
    public int FirstSighting { get; set; }
    public bool IsDebunked { get; set; }
    public string? LatinName { get; set; }
    public List<SightingDto> Sightings { get; set; } = new();
}
```

**Now the controller,** in two pastes in `Controllers/CryptidsApiController.cs`. At the top, with the other usings:

```csharp
using Cryptids.Web.Dtos;
```

Then select both actions, from the comment `// GET /api/cryptids` down to the closing brace of `GetOne`, and paste over them:

```csharp
    // GET /api/cryptids
    [HttpGet]
    public async Task<List<CryptidDto>> GetAll()
    {
        var cryptids = await _context.Cryptids
            .Include(c => c.Sightings)
            .ToListAsync();

        return cryptids.Select(c => new CryptidDto
        {
            Id = c.Id,
            Name = c.Name,
            Region = c.Region,
            FirstSighting = c.FirstSighting,
            IsDebunked = c.IsDebunked,
            LatinName = c.LatinName,
            ReportCount = c.Sightings.Count
        }).ToList();
    }

    // GET /api/cryptids/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CryptidDetailsDto>> GetOne(int id)
    {
        var cryptid = await _context.Cryptids
            .Include(c => c.Sightings)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (cryptid == null)
        {
            return NotFound();
        }

        return new CryptidDetailsDto
        {
            Id = cryptid.Id,
            Name = cryptid.Name,
            Region = cryptid.Region,
            FirstSighting = cryptid.FirstSighting,
            IsDebunked = cryptid.IsDebunked,
            LatinName = cryptid.LatinName,
            Sightings = cryptid.Sightings
                .Select(s => new SightingDto
                {
                    Id = s.Id,
                    CryptidId = s.CryptidId,
                    Witness = s.Witness,
                    Location = s.Location,
                    SeenOn = s.SeenOn,
                    Account = s.Account
                })
                .ToList()
        };
    }
```

`GetAll` now loads the reports with `Include` and hands back a `CryptidDto` for each creature, with `c.Sightings.Count` as its `reportCount`. `GetOne` now loads the same creature and returns a `CryptidDetailsDto`, so nothing loops. `{id:int}` makes the id part of the address, and only a whole number matches. `ActionResult<CryptidDetailsDto>` says this action gives back either that DTO or a status. Returning `NotFound()` on a class marked `[ApiController]` answers with a 404 **in JSON**, not with your *Not on file* page.

**Try it.** **`/api/cryptids`**: every creature has a `reportCount`, and The Hodag's is 3. **`/api/cryptids/1`**: The Hodag, with three reports. **`/api/cryptids/999`**: a 404, as JSON.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 3`** — checks 1 to 3. Check 4's message says a good report POSTed to `/api/sightings` got a 405: nothing takes a POST there yet. That's correct: task 4 creates it.

> [!NOTE]
> **In class, stop here.** Task 4 comes after the next part of the demo. Checks 4 and 5 are still red, and that's expected. Finished early? Try `/api/cryptids/abc`. Why is that a 404, when `/api/cryptids/999` reached your action? Hint: `:int`. Or help a classmate with their `using`. Working at home? Carry straight on.

### Task 4 in full

**Check:** `Check4_AnyoneCanFileAReportWithJson`

**A POST needs a class for what it accepts.** Create `Dtos/SightingInput.cs`:

```csharp
using System.ComponentModel.DataAnnotations;

namespace Cryptids.Web.Dtos;

// What anyone may send to file a report. The same rules as the Sighting class,
// and no Id: the database picks that.
public class SightingInput
{
    public int CryptidId { get; set; }

    [Required(ErrorMessage = "Who is reporting this?")]
    [StringLength(60, MinimumLength = 2)]
    public string Witness { get; set; } = "";

    [Required(ErrorMessage = "Where did you see it?")]
    [StringLength(80)]
    public string Location { get; set; } = "";

    // Nullable so that [Required] can tell a date nobody sent from a real one.
    // A plain DateTime would quietly become the year 1.
    [Required(ErrorMessage = "When did you see it?")]
    public DateTime? SeenOn { get; set; }

    [Required(ErrorMessage = "Say what you saw.")]
    [StringLength(400, MinimumLength = 10, ErrorMessage = "Give us at least {2} characters.")]
    public string Account { get; set; } = "";
}
```

Same rules as the `Sighting` class, and no `Id`, because the database picks that. If a client sends an `id`, it's ignored: this is week 8's `[Bind]` list, for JSON.

**Then a controller of its own**, because this one has no `[Authorize]` and never will. Create `Controllers/SightingsApiController.cs`:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cryptids.Web.Data;
using Cryptids.Web.Dtos;
using Cryptids.Web.Models;

namespace Cryptids.Web.Controllers;

// Week 13: the public half, as JSON. No [Authorize]: anybody can file a report,
// the same as SightingsController.
[ApiController]
[Route("api/sightings")]
public class SightingsApiController : ControllerBase
{
    private readonly CryptidContext _context;

    public SightingsApiController(CryptidContext context)
    {
        _context = context;
    }

    // POST /api/sightings
    [HttpPost]
    public async Task<ActionResult<SightingDto>> Create(SightingInput input)
    {
        // The rules on SightingInput can't know which creatures exist. Without
        // this, a made-up id reaches the database and comes back as a 500.
        if (!await _context.Cryptids.AnyAsync(c => c.Id == input.CryptidId))
        {
            ModelState.AddModelError(nameof(input.CryptidId), "There is no creature with that id.");
            return ValidationProblem(ModelState);
        }

        var sighting = new Sighting
        {
            CryptidId = input.CryptidId,
            Witness = input.Witness,
            Location = input.Location,
            SeenOn = input.SeenOn!.Value,
            Account = input.Account
        };

        _context.Sightings.Add(sighting);
        await _context.SaveChangesAsync();

        var filed = new SightingDto
        {
            Id = sighting.Id,
            CryptidId = sighting.CryptidId,
            Witness = sighting.Witness,
            Location = sighting.Location,
            SeenOn = sighting.SeenOn,
            Account = sighting.Account
        };

        return Created($"/api/cryptids/{sighting.CryptidId}", filed);
    }
}
```

There is no `if (!ModelState.IsValid)`. **`[ApiController]` runs the rules on `SightingInput` and answers with a 400 before your action starts.**

**The check it can't do is yours.** The rules can't know which creatures exist. Without the lookup, a made-up `cryptidId` reaches SQL Server, the foreign key refuses it, and your API answers with a 500. `ValidationProblem(ModelState)` makes your error look exactly like the automatic ones. `Created(…)` answers with a 201 and a `Location` saying where the report can be read.

**Test it.** The address bar can only send a GET, so go to **`/api-tester.html`**. It's one file in `wwwroot`, and it sends whatever you tell it from your own browser. Pick **POST**, type **`/api/sightings`**, paste this in the box, and click **Send**:

```json
{ "cryptidId": 2, "witness": "A passing stranger", "location": "Rhinelander, Wisconsin", "seenOn": "2026-11-17", "account": "Green wood smoke and a sound like something heavy turning over." }
```

**`201 Created`**, a `Location` of `/api/cryptids/2`, and the new report with its id. Open Bigfoot's page: it's there. Same table, two ways in.

Now send this, a report on a creature that doesn't exist:

```json
{ "cryptidId": 999, "witness": "A passing stranger", "location": "Rhinelander, Wisconsin", "seenOn": "2026-11-17", "account": "Green wood smoke and a sound like something heavy turning over." }
```

**`400 Bad Request`**, with `errors` naming `CryptidId`.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 4`** — checks 1 to 4. Check 5's message says a visitor sent a PUT to `/api/cryptids/6` and got 405: there's no such action yet. That's correct: task 5 adds it.

> [!NOTE]
> **In class, stop here.** Task 5 comes after the break and the next part of the demo. Check 5 is still red, and that's expected. Finished early? Send the first JSON again with `"seenOn"` taken out. Read the 400. Then look at why `SeenOn` is `DateTime?`, not `DateTime`. Or help a classmate get a 201. Working at home? Carry straight on.

### Task 5 in full

**Check:** `Check5_OnlyCuratorsCanChangeTheArchiveByApi`

**A class for what a curator can send.** Create `Dtos/CryptidInput.cs`:

```csharp
using System.ComponentModel.DataAnnotations;

namespace Cryptids.Web.Dtos;

// What a curator may change through the API. No Id, no reports, and no plate:
// a PUT leaves the creature's image exactly where it is.
public class CryptidInput
{
    [Required(ErrorMessage = "Every creature needs a name.")]
    [StringLength(60, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [Required(ErrorMessage = "Where was it seen?")]
    [StringLength(80)]
    public string Region { get; set; } = "";

    [Range(500, 2026, ErrorMessage = "First sighted has to be a year between {1} and {2}.")]
    public int FirstSighting { get; set; }

    public bool IsDebunked { get; set; }

    [StringLength(80)]
    public string? LatinName { get; set; }
}
```

**In `Controllers/CryptidsApiController.cs`**, the same shape as `CryptidsController`. Add the using at the top:

```csharp
using Microsoft.AspNetCore.Authorization;
```

Add the role to the attributes above the class, and change the comment to match:

```csharp
// Week 13: the archive, answered as JSON. Reading stays open to anybody, and
// changing it needs a curator, the same as the pages.
[ApiController]
[Route("api/cryptids")]
[Authorize(Roles = "Curator")]
public class CryptidsApiController : ControllerBase
```

Put `[AllowAnonymous]` on the line above `[HttpGet]` on **both** GET actions. Then, just below `GetOne`:

```csharp
    // PUT /api/cryptids/1
    // CryptidInput has no ImageUrl, and nothing here touches it, so the plate stays.
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CryptidInput input)
    {
        var cryptid = await _context.Cryptids.FindAsync(id);
        if (cryptid == null)
        {
            return NotFound();
        }

        cryptid.Name = input.Name;
        cryptid.Region = input.Region;
        cryptid.FirstSighting = input.FirstSighting;
        cryptid.IsDebunked = input.IsDebunked;
        cryptid.LatinName = input.LatinName;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/cryptids/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var cryptid = await _context.Cryptids.FindAsync(id);
        if (cryptid == null)
        {
            return NotFound();
        }

        _context.Cryptids.Remove(cryptid);
        await _context.SaveChangesAsync();
        return NoContent();
    }
```

> [!WARNING]
> **Load the creature and copy across. Don't `_context.Update(new Cryptid { … })`.** `CryptidInput` has no `ImageUrl`, so a new `Cryptid` would save with no plate. It's the same trap as week 8's `[Bind]` list. Check 5 fails if the plate is gone.

> [!WARNING]
> **Don't put `[ValidateAntiForgeryToken]` on these.** The token comes from a form, and a program has no form. Your own PUT would get a 400. The notes say [why an API doesn't need it](../lecture-notes.md#why-no-token).

> [!TIP]
> **Signed out, and a request still gets through over a correct attribute?** Press `Ctrl+R` in terminal 1 and send it again. MVC works out each action's filters when the app starts, so an attribute is the kind of edit hot reload can report as applied when it isn't. A restart always applies it.

**Try all three visitors,** with the tester. Signed in as yourself, **PUT** to **`/api/cryptids/6`**:

```json
{ "name": "Chupacabra", "region": "Puerto Rico", "firstSighting": 1995, "isDebunked": true, "latinName": "Caprivorus portoricensis" }
```

**`204 No Content`**. Now sign out and send it again. **`401 Unauthorized`** — and a whole page of HTML in the reply. Scroll down: *Not on file*.

**The status is right and the body is wrong.** That's week 10's Missing page: it answers every status that has no body, and that now includes your API's. A program has no use for it. In `Program.cs`, this line:

```csharp
app.UseStatusCodePagesWithReExecute("/Home/Missing");
```

becomes:

```csharp
// Week 13: pages only. Under /api, a status is the whole answer, and a page
// of HTML in the body is no use to a program.
app.UseWhen(context => !context.Request.Path.StartsWithSegments("/api"), pages =>
    pages.UseStatusCodePagesWithReExecute("/Home/Missing"));
```

**Press `Ctrl+R` in terminal 1**, the same as task 2. Send it again: **`401`**, and `no Content-Type: the body is empty`. Then type `/nope` in the address bar: people still get *Not on file*.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 5`** — all five, tonight's in-class target. 🎉 The Registry has an API.

> [!NOTE]
> **In class, this is the last stop.** The rest of the demo comes next, then a last block for catching up or the stretch below. Finished early? Join with a second email, and send a DELETE as that member: a `403`, where signed out was a `401`. Or help a classmate. Working at home? You're done.

### Stretch: a POST for curators

**No check, no points, and nobody needs this for the lab.** Your homework does need one, so this is a good place to try it first. In class this is the last block — and the block has no stop. If any of your checks are still red, finish those first.

**In `CryptidsApiController.cs`**, add `using Cryptids.Web.Models;` at the top, and just below `GetOne`:

```csharp
    // POST /api/cryptids
    [HttpPost]
    public async Task<ActionResult<CryptidDto>> Create(CryptidInput input)
    {
        var cryptid = new Cryptid
        {
            Name = input.Name,
            Region = input.Region,
            FirstSighting = input.FirstSighting,
            IsDebunked = input.IsDebunked,
            LatinName = input.LatinName
        };

        _context.Cryptids.Add(cryptid);
        await _context.SaveChangesAsync();

        var filed = new CryptidDto
        {
            Id = cryptid.Id,
            Name = cryptid.Name,
            Region = cryptid.Region,
            FirstSighting = cryptid.FirstSighting,
            IsDebunked = cryptid.IsDebunked,
            LatinName = cryptid.LatinName,
            ReportCount = 0
        };

        return CreatedAtAction(nameof(GetOne), new { id = cryptid.Id }, filed);
    }
```

The class's `[Authorize(Roles = "Curator")]` already covers it. `CreatedAtAction` answers with a 201, and its `Location` is the address of `GetOne` for the new id.

**Test it** as yourself, with the tester, **POST** to **`/api/cryptids`**:

```json
{ "name": "The Beast of Bray Road", "region": "Elkhorn, Wisconsin", "firstSighting": 1989, "isDebunked": false, "latinName": "Canis elkhornensis" }
```

**`201`**, then `/Cryptids` lists it, with the *artist unknown* plate.

## Rules

- **Never edit `Cryptids.Checks`.** If a check looks wrong, tell me.
- **Work in `Cryptids.Web` only.**
- `dotnet test Cryptids.Checks` runs from `CryptidsApi`, the folder above both projects.
- **The checks don't need wifi or SQL Server** — they run your app against an in-memory database. 5/5 does **not** prove your connection string works. Your browser proves that.

## 🆘 Stuck?

- **The app stops before `Now listening on:` with `The ConnectionString property has not been initialized`** — the connection string secret is gone; frozen lab PCs wipe it. [Task 1 in full ↑](#task-1-in-full). The app reads the database as it starts, so this stops it outright.
- **`/api/cryptids/count` is *Not on file*, over a correct `Program.cs`** — terminal 1 is waiting for `Ctrl+R`. Press it. [Task 2 in full ↑](#task-2-in-full)
- **`/api/cryptids` is *Not on file*, and the controller is right there** — press `Ctrl+R` in terminal 1. A new controller usually goes live by itself, and a restart always does it.
- **A `500` with `A possible object cycle was detected`** — the action returns `Cryptid` objects with their reports loaded, or a DTO carries a `Cryptid` property. Return the DTOs. [Task 3 in full ↑](#task-3-in-full)
- **A `500` with `NullReferenceException` from code that looks right, just after you edited that action** — press `Ctrl+R` in terminal 1 and send it again. Terminal 1 said `Hot reload succeeded`, and adding a `=>` lookup to an action that's already running can still leave it broken until a restart.
- **`reportCount` is 0, or `sightings` is empty** — that query has no `.Include(c => c.Sightings)`.
- **`The type or namespace name 'CryptidDto' could not be found`** — `using Cryptids.Web.Dtos;` at the top of the controller.
- **`The type or namespace name 'Authorize' could not be found`** — `using Microsoft.AspNetCore.Authorization;` at the top of the controller.
- **A POST comes back `415 Unsupported Media Type`** — the request has no `Content-Type: application/json`. The tester sends one for POST and PUT.
- **A POST comes back `400` with `"The input field is required."`, or an error about a JSON token** — the box holds broken JSON. Every name and every string needs double quotes.
- **A report saves with the year 1** — `SeenOn` on `SightingInput` is `DateTime`, not `DateTime?`. [Task 4 in full ↑](#task-4-in-full)
- **A `500` on a report, and SQL Server's message mentions a `FOREIGN KEY`** — the `cryptidId` doesn't exist and the lookup is missing. [Task 4 in full ↑](#task-4-in-full)
- **Check 4 says a visitor got a 401** — `SightingsApiController` got an `[Authorize]`. Take it off; reports are public.
- **Check 5 says a visitor got through** — the role isn't on the `CryptidsApiController` class, or it's a plain `[Authorize]`.
- **The tester lets a signed-out visitor through, over a correct attribute** — hot reload can report an attribute as applied when it isn't. `Ctrl+R` in terminal 1. [Task 5 in full ↑](#task-5-in-full)
- **You're the curator and the tester says `403`** — your cookie is older than your role. Sign out and back in. Or the spelling: `"Curator"` in the attribute, the same as the seeder.
- **The tester says `A redirect`** — the class has no `[ApiController]`. Without it, a refusal is a page's answer.
- **Check 5 says the plate changed** — the PUT saved a new `Cryptid`. Load the creature and copy the five properties across. [Task 5 in full ↑](#task-5-in-full)
- **The `401` still has HTML behind it, and `UseWhen` is in `Program.cs`** — `Ctrl+R` in terminal 1.
- **Check 1 says the Not on file page is gone** — you deleted the Missing line instead of wrapping it. People still need it. [Task 5 in full ↑](#task-5-in-full)
- **`dotnet ef` says there's already an object named 'Cryptids'** — you never ran week 12's lab. The warning in [Task 1 in full ↑](#task-1-in-full) has the order. (Only ever in this lab — never on your own project's database.)
- **"Could not find a MSBuild project file"** — that terminal is standing in `CryptidsApi`, which holds two projects. `dotnet watch`, `dotnet ef` and `dotnet user-secrets` need one: run `cd Cryptids.Web` in terminals 1 and 2.

## 🚀 Done early?

- **Do the stretch task above.**
- **Watch a request go by.** Open **F12 → Network**, send something with the tester, and click the request. The verb, the status, your cookie and the JSON are all there.
- **Read the tester.** Open `wwwroot/api-tester.html`. The part that talks to the server is one `fetch` call.
