# Week 12 Lab — The Registry Gets a Curator 🔒

Since week 11, changing the Registry needs an account. Anybody can make one. So the lock stops visitors who haven't signed in, and nobody else.

Tonight the archive gets a curator. The lock asks for a **role**, not just an account; a member who isn't a curator is told so on a page of the Registry's own; the curator is named in configuration, never in code; the buttons nobody else can use disappear; and the sign-in cookie turns out to be carrying the role all along. Reading stays open to anybody. So does filing a report: **the archive is curated; the reports are not.**

**Time:** ~90 minutes in class, in seven short blocks — each one follows the part of the demo it practices, and every block but the last ends at an **In class, stop here** note. The blocks are: **Setup and task 1** · task 2 · task 3 · task 4 · task 5 · task 6 · and a last block for catching up or the stretch. **In-class target: checks 1–5 green.** Check 6 is a page listing your own claims; it rolls into Part 1 of the homework if the clock wins.

## Setup

> [!IMPORTANT]
> **The app arrives as week 11 finished it** — members can join, sign in and sign out, every member has a field name, and the archive's writes are behind a sign-in-only `[Authorize]`. If your own week-11 lab never got to six, you are **not** behind. Check 1 passes before you touch anything.

**1. Update the starters clone.** Open `dotnet-web` in VS Code, then `` Ctrl+` `` for a terminal standing in it:

```bash
git -C dotnet-web-starters pull
```

`-C` tells git to work *in that folder* without moving your terminal into it — you stay in `dotnet-web`, which is where every other command belongs.

**2. Copy the `week-12` folder out of `dotnet-web-starters` and into `dotnet-web`** — next to the clone, never inside it — **and rename the copy.** `CryptidsCurator` works. (Never work inside the clone.)

```
CryptidsCurator/           ← in `dotnet-web`, the folder you copied and renamed
├─ Cryptids.Web/          ← your app — ALL your work happens in here
└─ Cryptids.Checks/       ← the checks — read-only, never edit
```

**3. Open `CryptidsCurator` in VS Code** — the folder that *contains* both project folders.

**4. Open three terminals** — `` Ctrl+` `` opens the first, then the `+` in the terminal panel (or `` Ctrl+Shift+` ``) twice more. They are terminals 1, 2 and 3 for the rest of the lab, and every command below names the one it runs in.

| Terminal | Where it stands | What runs in it |
|---|---|---|
| 1 | inside `Cryptids.Web` — `cd Cryptids.Web` | **nothing yet.** Task 1 starts `dotnet watch` here, after your connection string is set, and it runs for the rest of the lab |
| 2 | inside `Cryptids.Web` — `cd Cryptids.Web` | everything else: `dotnet user-secrets`, `dotnet ef` |
| 3 | `CryptidsCurator`, the folder holding **both** projects | `dotnet test Cryptids.Checks` |

**All three open in `CryptidsCurator`. Move terminals 1 and 2 — run this in each of them:**

```bash
cd Cryptids.Web
```

Terminal 3 stays in `CryptidsCurator`, because `dotnet test Cryptids.Checks` runs from the folder holding both projects.

**Don't start the app yet.** It needs your connection string first, and task 1 sets it.

**5. In terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**1 / 6 passing.** Check 1 is the Registry you were handed, already working. The other five are tonight.

**Now carry straight on to [Task 1](#task-1-in-full)** — it's part of this first block, which ends at the **In class, stop here** note after it.

> [!IMPORTANT]
> **Tonight, restart the app with `Ctrl+R` in terminal 1 — not `Ctrl+C` and `dotnet watch` again.** Task 3 is where `dotnet watch` first asks *Do you want to restart your app?* and you answer `a`, for always. That answer belongs to the running `watch`. `Ctrl+C` ends it, and the next new file stops and asks all over again. `Ctrl+R` restarts the app and keeps the answer.

## Where tonight's work happens

Every file you touch is in `Cryptids.Web`:

```
Cryptids.Web/
├─ Program.cs                    ← task 4 (three lines)
├─ Data/RoleSeeder.cs            ← task 4 (new)
├─ Controllers/
│   ├─ CryptidsController.cs     ← task 2 (one attribute)
│   └─ AccountController.cs      ← tasks 3 and 6 (one action each)
└─ Views/
    ├─ Account/AccessDenied.cshtml ← task 3 (new)
    ├─ Account/Claims.cshtml     ← task 6 (new)
    └─ Cryptids/
        ├─ Index.cshtml          ← task 5
        └─ Details.cshtml        ← task 5
```

**No migration tonight.** The tables a role needs — `AspNetRoles`, and `AspNetUserRoles` for who holds one — came with week 11's `AddIdentity`. They've been empty since.

> [!NOTE]
> **The checks never connect to SQL Server** — in-memory, seeded from your `HasData`, no wifi needed. The members and roles they create live only as long as the test run, and **your own `Admin:Email` secret never reaches them**: check 4 sets its own. **6/6 does not prove your connection string works.** Your browser proves that. Do both.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 1 | *(check 1 is already green)* | Put your connection string in user secrets, **drop the lab database**, let one `dotnet ef database update` rebuild it, start the app, and **join with your own email**. **[Task 1 in full ↓](#task-1-in-full)** |
| 2 | `OnlyCuratorsCanChangeTheArchive` | **The role on the lock** — `[Authorize]` becomes `[Authorize(Roles = "Curator")]`. Reports stay open. **[Task 2 in full ↓](#task-2-in-full)** |
| 3 | `AMemberWhoIsNotACuratorIsToldSo` | **AccessDenied** — the page a signed-in member lands on without the role. **[Task 3 in full ↓](#task-3-in-full)** |
| 4 | `TheCuratorComesFromConfiguration` | **Make yourself the curator** — your email in a user secret, and a seeder that hands out the role. **[Task 4 in full ↓](#task-4-in-full)** |
| 5 | `OnlyCuratorsSeeTheButtons` | **Hide the archive's buttons** from everyone but a curator. **[Task 5 in full ↓](#task-5-in-full)** |
| 6 | `TheCookieCarriesTheRole` | **A claims page** — what your sign-in cookie says about you. **[Task 6 in full ↓](#task-6-in-full)** |
| ⭐ | — | **Stretch: a link to your claims.** No check, no points. **[Stretch in full ↓](#stretch-a-link-to-your-claims)** |

### Task 1 in full

**Check 1 is already green** — this task is about your database, which the checks can't see but your browser needs.

**First, the connection string** (frozen lab PC? this is the one that gets wiped). **In terminal 2** — the one step 4 left standing inside `Cryptids.Web`:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=<SCHOOL-SQL-SERVER>;Database=Cryptids_<COURSE-NUMBER>_<YOUR-INITIALS>;User ID=<YOUR-USERNAME>;Password=<YOUR-PASSWORD>;TrustServerCertificate=True"
```

**Same connection string as week 11 — same server, same database name.** This is still the Cryptid Registry, and [one application gets one database](../../week-07/lecture-notes.md#naming-your-database). The folder is new so week 11's work stays where it is; the database is not.

The `<UserSecretsId>` ships in the `.csproj`, so `set` on its own is enough — there is no `init` step.

**Now reset the database and rebuild it — two commands, still in terminal 2:**

```bash
dotnet ef database drop --force
dotnet ef database update
```

> [!WARNING]
> **The drop is not optional here, and you need to know why.** This starter ships its own migration files with their own ids. The database from your last lab still has *that* lab's `__EFMigrationsHistory` in it, and the two will not reconcile — you'd get *"there is already an object named 'Cryptids'"*.
>
> ⚠️ **Never do this on your own project.** Your semester project has data you care about, and `database drop` does not ask twice. This is a throwaway lab database and that is the only reason it's safe here.

Five migrations replay: the table with its six creatures, their Latin names and plates, week 9's sightings, and week 11's members and their field names.

**Now start the app — in terminal 1:**

```bash
dotnet watch
```

**Then join with your own email.** Click **Join**, use an email you'll remember, a field name, and a password with an uppercase letter, a digit and a symbol in it. **Task 4 makes this account the curator** — so remember the email exactly. The drop emptied `AspNetUsers`, which is why last week's account is gone.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 1`** — the same as when you started. Check 2's message says a member who isn't a curator opened `/Cryptids/Create`. That's correct: task 2 changes the lock.

> [!NOTE]
> **In class, stop here.** Task 2 comes after the next part of the demo. Checks 2 to 6 are still red, and that's expected. Finished early? You're signed in — open any creature and click **✏️ Correct the record**. It opens. So would anyone's account. That is what tonight closes. Or help a classmate get signed in. Working at home? Carry straight on.

### Task 2 in full

**Check:** `Check2_OnlyCuratorsCanChangeTheArchive`

**In `Controllers/CryptidsController.cs`**, week 11's attribute above the class gets a role. Replace the comment and the attribute with this:

```csharp
// Week 11 locked the archive to signed-in members; week 12 narrows it to
// curators. Every action, including any added later. The two that only read
// open themselves up.
[Authorize(Roles = "Curator")]
public class CryptidsController : Controller
```

**Still on the class, and still `[AllowAnonymous]` on `Index` and `Details`** — nothing else in the file changes. A role on the class covers every action, the POSTs too, the same reason week 11's attribute went there.

> [!WARNING]
> **Don't touch `SightingsController`.** Reports are the Registry's public half: anybody can file one, signed in or not, with or without a role. Check 2 fails if a visitor who isn't signed in can't.

> [!TIP]
> **Still signed in, and the form still opens over a correct attribute?** Press `Ctrl+R` in terminal 1 and try again. MVC works out each action's filters when the app starts, so an attribute is the kind of edit hot reload can report as applied when it isn't. A restart always applies it.

**See where you land.** You're still signed in from task 1. Go to `/Cryptids` and click **＋ File a report**. The address bar says **`/Account/AccessDenied?ReturnUrl=%2FCryptids%2FCreate`** — and the page says ***Not on file***. That is Identity's other default: a visitor who isn't signed in goes to `/Account/Login`, and a member who is signed in without the role goes to `/Account/AccessDenied`. Nothing answers there yet, so it's a 404, and every 404 gets the Registry's Missing page.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 2`** — checks 1 and 2. Check 3's message says `/Account/AccessDenied` came back 404. That's correct: task 3 writes it.

> [!NOTE]
> **In class, stop here.** Task 3 comes after the break and the next part of the demo. Checks 3 to 6 are still red, and that's expected. Finished early? Sign out, then click **＋ File a report** — you go to the sign-in page, not AccessDenied. Same lock, two visitors, two answers. Or help a classmate. Working at home? Carry straight on.

### Task 3 in full

**Check:** `Check3_AMemberWhoIsNotACuratorIsToldSo`

**The view first.** Create `Views/Account/AccessDenied.cshtml`:

```cshtml
@{
    ViewData["Title"] = "Curators only";
}

<div class="text-center py-5">
    <h1 class="display-5">Curators only 🔒</h1>
    <p class="lead text-muted">
        You're signed in, but changing the archive is for the Registry's curators.
    </p>
    <a asp-controller="Cryptids" asp-action="Index" class="btn btn-primary">Back to the registry</a>
</div>
```

> [!IMPORTANT]
> **Terminal 1 now stops and asks:** `ENC0021: Adding attribute requires restarting the application`, then `Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`. **Answer `a`.** A new view is a change hot reload can't make. With `a` answered, `watch` restarts by itself every time it has to for the rest of the lab.

Reload the AccessDenied tab: still *Not on file*. The view exists, and there is no action to show it yet.

**Then the action.** In `Controllers/AccountController.cs`, just above the comment `// POST /Account/Logout`:

```csharp
// GET /Account/AccessDenied — where [Authorize(Roles = "Curator")] sends a
// member who IS signed in but isn't a curator. Identity's own default,
// the same way a stranger is sent to /Account/Login.
public IActionResult AccessDenied()
{
    return View();
}
```

**Why the view went first:** an action that returns a view that isn't there yet is a `500` — *The view 'AccessDenied' was not found* — which is worse than the 404 it replaces. View, then action, is the same order as week 10's Missing page.

Reload. ***Curators only.*** A member who lands here knows the page isn't broken: this part of the site isn't theirs.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 3`** — checks 1 to 3. Check 4's message says there's no Curator role yet. That's correct: task 4 makes it.

> [!NOTE]
> **In class, stop here.** Task 4 comes after the next part of the demo. Checks 4 to 6 are still red, and that's expected. Finished early? In the mssql panel, run `SELECT * FROM AspNetRoles;` against your database. No rows. A role is a row in that table, and nobody has made one. Or help a classmate with their restart prompt. Working at home? Carry straight on.

### Task 4 in full

**Check:** `Check4_TheCuratorComesFromConfiguration`

**Your email, in configuration — in terminal 2.** The same email you joined with in task 1:

```bash
dotnet user-secrets set "Admin:Email" "<THE-EMAIL-YOU-JOINED-WITH>"
```

It prints `Successfully saved Admin:Email to the secret store.` **The email goes in configuration and never in code**, for the same reason as your connection string: the repo is public, and changing who the curator is shouldn't need a redeploy. On Azure the same value is an app setting called `Admin__Email` — your homework does that half.

**Now the code that reads it.** Create `Data/RoleSeeder.cs`:

```csharp
using Microsoft.AspNetCore.Identity;
using Cryptids.Web.Models;

namespace Cryptids.Web.Data;

// Runs once, when the app starts. Makes sure the Curator role exists, then
// gives it to the member whose email is in configuration under Admin:Email —
// a user secret on your machine, an app setting on Azure. No email set, or
// nobody has joined with it yet: the role exists, and nobody holds it.
public static class RoleSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<Member>>();
        var config = services.GetRequiredService<IConfiguration>();

        if (!await roleManager.RoleExistsAsync("Curator"))
        {
            await roleManager.CreateAsync(new IdentityRole("Curator"));
        }

        var email = config["Admin:Email"];
        if (string.IsNullOrEmpty(email))
        {
            return;
        }

        var member = await userManager.FindByEmailAsync(email);
        if (member != null && !await userManager.IsInRoleAsync(member, "Curator"))
        {
            await userManager.AddToRoleAsync(member, "Curator");
        }
    }
}
```

`RoleManager` makes roles; `UserManager` — the same one as week 11's register page — finds members and gives them roles; `IConfiguration` reads the email. Run it twice and nothing changes the second time. **`"Curator"` is spelled the same here as in task 2's attribute**, and it has to be: a role is matched by name.

**And in `Program.cs`, just below `var app = builder.Build();`:**

```csharp
// Week 12: the Curator role, and who holds it. Runs once, at startup.
using (var scope = app.Services.CreateScope())
{
    await RoleSeeder.SeedAsync(scope.ServiceProvider);
}
```

Terminal 1 prints `Restart is needed to apply the changes` and restarts on its own — that's task 3's `a`.

> [!WARNING]
> **From now on your app talks to the database the moment it starts** — the seeder runs before `Now listening on:`. If the connection string secret is gone (a frozen lab PC wipes it), the app stops there with `Unhandled exception. System.InvalidOperationException: The ConnectionString property has not been initialized.` Set it again, task 1's first command.

**Now try it.** You're still signed in. Click **＋ File a report.** ***Curators only.***

**That's correct, and it's the lesson.** The seeder gave you the role — in the mssql panel:

```sql
SELECT r.Name, u.Email
FROM AspNetUserRoles ur
JOIN AspNetRoles r ON r.Id = ur.RoleId
JOIN AspNetUsers u ON u.Id = ur.UserId;
```

One row: `Curator`, and your email. But **your cookie was made when you signed in, before you had the role**, and the lock reads the cookie, not the database. **Sign out, sign back in**, and click **＋ File a report** again. The form.

*(Identity also re-checks the cookie against the database every 30 minutes, so a role can arrive on its own. Signing in again is how you get it now.)*

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 4`** — checks 1 to 4. Check 5's message says a visitor sees the ＋ File a report button. That's correct: task 5 hides it.

> [!NOTE]
> **In class, stop here.** Task 5 comes after the break and the next part of the demo. Checks 5 and 6 are still red, and that's expected. Finished early? Run `dotnet user-secrets list` in terminal 2 — two lines, your connection string and your email. Nothing in your repo knows either one. Or help a classmate who keeps getting *Curators only*: ask them whether they signed out and back in. Working at home? Carry straight on.

### Task 5 in full

**Check:** `Check5_OnlyCuratorsSeeTheButtons`

**In `Views/Cryptids/Index.cshtml`**, the ＋ File a report button goes inside an `@if`:

```cshtml
@if (User.IsInRole("Curator"))
{
    <a asp-action="Create" class="btn btn-primary mb-4">＋ File a report</a>
}
```

**In `Views/Cryptids/Details.cshtml`**, the two buttons under the badge go inside one:

```cshtml
        @if (User.IsInRole("Curator"))
        {
            <div class="mt-4">
                <a asp-action="Edit" asp-route-id="@Model.Id" class="btn btn-secondary">✏️ Correct the record</a>
                <a asp-action="Delete" asp-route-id="@Model.Id" class="btn btn-outline-danger ms-2">🗑️ Close the file</a>
            </div>
        }
```

> [!WARNING]
> **👁️ Report a sighting stays outside the `@if`.** It's at the bottom of the same page, and it's for the public — check 5 fails if a visitor can't see it.

**See all three visitors.** As yourself, signed in: all three buttons. Sign out: none of them, and 👁️ Report a sighting still there. Then type **`/Cryptids/Create`** into the address bar — the sign-in page. **The `@if` decides what a visitor sees; the attribute decides what they can do.** A hidden button is a courtesy. If the attribute were missing, anybody with an account could still type the address.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 5`** — tonight's in-class target. 🎉 Check 6's message says `/Account/Claims` came back 404. That's correct: task 6 writes it.

> [!NOTE]
> **In class, stop here.** Task 6 comes after the next part of the demo. Check 6 is still red, and that's expected. Finished early? Join again with a second email, and look at a creature's page as that member: no buttons, the same as a visitor. Or help a classmate. Working at home? Carry straight on.

### Task 6 in full

**Check:** `Check6_TheCookieCarriesTheRole`

**In `Controllers/AccountController.cs`**, add the using at the top:

```csharp
using Microsoft.AspNetCore.Authorization;
```

and just above the comment `// POST /Account/Logout`:

```csharp
// GET /Account/Claims — what the sign-in cookie says about you. A role
// is one claim among the others.
[Authorize]
public IActionResult Claims()
{
    return View();
}
```

`[Authorize]` with no role: any signed-in member, because a visitor has no claims to show.

**Create `Views/Account/Claims.cshtml`:**

```cshtml
@{
    ViewData["Title"] = "What the cookie says";
}

<h1>What the cookie says</h1>
<p class="text-muted">Every row is a claim: one fact about you, written into the sign-in cookie when you signed in.</p>

<table class="table">
    <thead>
        <tr>
            <th>Type</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        @foreach (var claim in User.Claims)
        {
            <tr>
                <td><code>@claim.Type</code></td>
                <td>@claim.Value</td>
            </tr>
        }
    </tbody>
</table>
```

Terminal 1 restarts by itself for the new view.

**Open `/Account/Claims`.** Six rows — your id, your name, your email, a security stamp, `amr` (how you signed in: `pwd`, a password), and **`http://schemas.microsoft.com/ws/2008/06/identity/claims/role`**, with the value **`Curator`**. That last row is your role. `User.IsInRole("Curator")` and `[Authorize(Roles = "Curator")]` both read it, which is why signing in again was what made task 4 work: a new sign-in writes a new set of claims.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 6`** — all six. 🎉 The Registry has a curator, and you can see it in the cookie.

> [!NOTE]
> **In class, this is the last stop.** The last block — catching up, or the stretch below — follows straight on, with no demo in between. Or help a classmate. Working at home? You're done.

### Stretch: a link to your claims

**No check, no points, and nobody needs this for the homework.** In class this is the last block — and the block has no stop. If any of your checks are still red, finish those first.

Nobody can find `/Account/Claims` without typing it. In `Views/Shared/_LoginPartial.cshtml`, turn the *Signed in as* text into a link to it — replace the `<span class="navbar-text me-2">…</span>` line with:

```cshtml
<a class="nav-link" asp-controller="Account" asp-action="Claims">Signed in as @name</a>
```

Everything around it stays: the `var name` fallback from week 11 still decides what it says.

## Rules

- **Never edit `Cryptids.Checks`.** If a check looks wrong, tell me.
- **Work in `Cryptids.Web` only.**
- `dotnet test Cryptids.Checks` runs from `CryptidsCurator`, the folder above both projects.
- **The checks don't need wifi or SQL Server** — they run your app against an in-memory database. 6/6 does **not** prove your connection string works. Your browser proves that.

## 🆘 Stuck?

- **The app stops before `Now listening on:` with `The ConnectionString property has not been initialized`** — the connection string secret is gone; frozen lab PCs wipe it. Task 1's first command, in terminal 2. From task 4 on the app reads the database as it starts, so this now stops it outright. [Task 4 in full ↑](#task-4-in-full)
- **The app stops before `Now listening on:` with `SqlException … A network-related or instance-specific error`** — the server name in your connection string, or no network. The same reason: the seeder runs at startup.
- **You're the curator in `AspNetUserRoles`, and you still get *Curators only*** — your cookie is older than your role. Sign out and sign back in. [Task 4 in full ↑](#task-4-in-full)
- **Signed out and in again, and *still* *Curators only*** — the seeder never gave you the role. Check three spellings: `"Curator"` in the attribute and in `RoleSeeder.cs` must match; the secret's key must be exactly `Admin:Email`; and `dotnet user-secrets list` must show the email you joined with. Then `Ctrl+R` in terminal 1 — the seeder only runs at startup.
- **Signed in, and `/Cryptids/Create` still opens** — the attribute isn't `[Authorize(Roles = "Curator")]` yet, or hot reload hasn't applied it. `Ctrl+R` in terminal 1. [Task 2 in full ↑](#task-2-in-full)
- **Check 2 says a POST got through** — the role went on the GET actions instead of the class.
- **Check 2 says a visitor couldn't file a report** — `SightingsController` got an `[Authorize]`. Take it off; reports are public.
- **`/Account/AccessDenied` is *Not on file*, and the view is right there** — the `AccessDenied()` action isn't on `AccountController`, or terminal 1 is asking `Do you want to restart your app?` — answer `a`. Don't move the file.
- **A `500` with `The view 'AccessDenied' was not found`** — the action is there and the view isn't, or the restart prompt is still waiting in terminal 1. [Task 3 in full ↑](#task-3-in-full)
- **Check 5 says a visitor can't see 👁️ Report a sighting** — it went inside the `@if` with the archive's buttons. Move it out.
- **You're the curator and the buttons are gone for you too** — the name inside `IsInRole("…")` isn't `Curator`, or you haven't signed in again since task 4.
- **`The type or namespace name 'Authorize' could not be found`** in `AccountController.cs` — the `using Microsoft.AspNetCore.Authorization;` at the top. [Task 6 in full ↑](#task-6-in-full)
- **`/Account/Claims` has no role row** — you're not the curator yet, or your cookie is older than the role. Sign out and back in.
- **`dotnet ef` says there's already an object named 'Cryptids'** — you skipped the database drop in task 1. Run it in terminal 2, then `database update` again. (Only ever in this lab — never on your own project's database.)
- **"Could not find a MSBuild project file"** — that terminal is standing in `CryptidsCurator`, which holds two projects. `dotnet watch`, `dotnet ef` and `dotnet user-secrets` need one: run `cd Cryptids.Web` in terminals 1 and 2.

## 🚀 Done early?

- **Do the stretch task above.**
- **Make a second curator, and watch who decides.** Join with a second email, change `Admin:Email` to it, `Ctrl+R` in terminal 1. Now there are two rows in `AspNetUserRoles`: the seeder adds roles, it never takes one away. Taking the role back is `userManager.RemoveFromRoleAsync` — a page for that is a real admin feature, and one this course doesn't build.
- **Read the claim's type in full.** It's a URL from 2008, `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`, because claims started life in a Microsoft standard that put every type in a namespace. `ClaimTypes.Role` is the same string with a shorter name.
