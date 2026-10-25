# Week 11 Lab — The Registry Gets Members 🔑

Since week 6, anybody with the Registry's URL could open a new file, correct an old one, or close one for good. Nothing ever asked who they were.

Tonight the Registry gets members. A table to keep them in, a way to join, a way to sign in and out — and a lock on the archive, so that changing it needs an account. Reading it stays open to anybody. So does filing a report: **the archive is curated; the accounts are not.**

**Time:** ~85 minutes in class, in seven short blocks — each one follows the part of the demo it practices, and every block but the last ends at an **In class, stop here** note. The blocks are: **Setup and task 1** · task 2 · task 3 · task 4 · task 5 · task 6 · and a last block for catching up or the stretch. **In-class target: checks 1–5 green.** Check 6 is a field name for every member; it's the same move your homework's last requirement needs, and it rolls into it if the clock wins.

## Setup

> [!IMPORTANT]
> **The app arrives as week 9 finished it, plus three fixes from the midterm** — the Privacy page is gone, a wrong id lands on the Registry's own *Not on file* page, and `/Cryptids` says *1 creature*, not *1 creatures*. Week 10 had no lab, so they're done for you; none of tonight's work touches them. If your own week-9 lab never got finished, you are **not** behind. Check 1 passes before you touch anything.
>
> **The yellow `NU1902` / `NU1903` warnings from weeks 9 and 10 are fixed in this starter.** They were security advisories against `System.Security.Cryptography.Pkcs`, a package the SQL Server package brings in, and `Cryptids.Web.csproj` now asks for the fixed version itself — that's the `System.Security.Cryptography.Pkcs` line. Your semester project needs the same line; the homework's first step adds it.

**1. Update the starters clone.** Open `dotnet-web` in VS Code, then `` Ctrl+` `` for a terminal standing in it:

```bash
git -C dotnet-web-starters pull
```

`-C` tells git to work *in that folder* without moving your terminal into it — you stay in `dotnet-web`, which is where every other command belongs.

**2. Copy the `week-11` folder out of `dotnet-web-starters` and into `dotnet-web`** — next to the clone, never inside it — **and rename the copy.** `CryptidsMembers` works. (Never work inside the clone.)

```
CryptidsMembers/           ← in `dotnet-web`, the folder you copied and renamed
├─ Cryptids.Web/          ← your app — ALL your work happens in here
└─ Cryptids.Checks/       ← the checks — read-only, never edit
```

**3. Open `CryptidsMembers` in VS Code** — the folder that *contains* both project folders.

**4. Open three terminals** — `` Ctrl+` `` opens the first, then the `+` in the terminal panel (or `` Ctrl+Shift+` ``) twice more. They are terminals 1, 2 and 3 for the rest of the lab, and every command below names the one it runs in.

| Terminal | Where it stands | What runs in it |
|---|---|---|
| 1 | inside `Cryptids.Web` — `cd Cryptids.Web` | **nothing yet.** Task 1 starts `dotnet watch` here, after your connection string is set, and it runs for the rest of the lab |
| 2 | inside `Cryptids.Web` — `cd Cryptids.Web` | everything else: `dotnet user-secrets`, `dotnet add package`, `dotnet ef` |
| 3 | `CryptidsMembers`, the folder holding **both** projects | `dotnet test Cryptids.Checks` |

**All three open in `CryptidsMembers`. Move terminals 1 and 2 — run this in each of them:**

```bash
cd Cryptids.Web
```

Terminal 3 stays in `CryptidsMembers`, because `dotnet test Cryptids.Checks` runs from the folder holding both projects.

**Don't start the app yet.** It needs your connection string first, and task 1 sets it.

**5. In terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**1 / 6 passing.** Check 1 is the Registry you were handed, already working. The other five are tonight.

**Now carry straight on to [Task 1](#task-1-in-full)** — it's part of this first block, which ends at the **In class, stop here** note after it.

> [!IMPORTANT]
> **Tonight, restart the app with `Ctrl+R` in terminal 1 — not `Ctrl+C` and `dotnet watch` again.** Task 2 is where `dotnet watch` first asks *Do you want to restart your app?* and you answer `a`, for always. That answer belongs to the running `watch`. `Ctrl+C` ends it, and the next new file stops and asks all over again — while your page shows a `404` for a file that is sitting right there. `Ctrl+R` restarts the app and keeps the answer.

## Where tonight's work happens

Every file you touch is in `Cryptids.Web`:

```
Cryptids.Web/
├─ Cryptids.Web.csproj         ← task 2 (one package)
├─ Program.cs                  ← task 2
├─ Models/Member.cs            ← tasks 2 and 6 (new)
├─ Data/CryptidContext.cs      ← task 2
├─ Migrations/                 ← tasks 2 and 6 (one new migration each, generated)
├─ ViewModels/
│   ├─ RegisterViewModel.cs    ← tasks 3 and 6 (new)
│   └─ LoginViewModel.cs       ← task 4 (new)
├─ Controllers/
│   ├─ AccountController.cs    ← tasks 3, 4 and 6 (new)
│   └─ CryptidsController.cs   ← task 5
└─ Views/
    ├─ Account/Register.cshtml ← tasks 3 and 6 (new)
    ├─ Account/Login.cshtml    ← task 4 (new)
    └─ Shared/
        ├─ _LoginPartial.cshtml ← tasks 4 and 6 (new)
        └─ _Layout.cshtml       ← task 4 (one line)
```

> [!NOTE]
> **The checks never connect to SQL Server** — in-memory, seeded from your `HasData`, no wifi needed. The accounts they create live only as long as the test run. **6/6 does not prove your connection string works.** Your browser proves that. Do both.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 1 | *(check 1 is already green)* | Put your connection string in user secrets, **drop the lab database**, let one `dotnet ef database update` rebuild it, and start the app. **[Task 1 in full ↓](#task-1-in-full)** |
| 2 | `TheRegistryHasAPlaceToKeepItsMembers` | **Identity goes in** — the package, a `Member` class, the context, `Program.cs`, and a migration. **[Task 2 in full ↓](#task-2-in-full)** |
| 3 | `AVisitorCanCreateAnAccount` | **Join** — a register page that creates a member and signs them in. **[Task 3 in full ↓](#task-3-in-full)** |
| 4 | `AMemberCanSignOutAndBackIn` | **Sign in, sign out**, and a navbar that knows which. **[Task 4 in full ↓](#task-4-in-full)** |
| 5 | `OnlyMembersCanChangeTheArchive` | **The lock** — `[Authorize]` on the archive, and the reports left open. **[Task 5 in full ↓](#task-5-in-full)** |
| 6 | `TheRegistryKnowsItsMembersByName` | **A field name** for every member, in the navbar. **[Task 6 in full ↓](#task-6-in-full)** |
| ⭐ | — | **Stretch: sign your reports.** No check, no points. **[Stretch in full ↓](#stretch-sign-your-reports)** |

### Task 1 in full

**Check 1 is already green** — this task is about your database, which the checks can't see but your browser needs.

**First, the connection string** (frozen lab PC? this is the one that gets wiped). **In terminal 2** — the one step 4 left standing inside `Cryptids.Web`:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=<SCHOOL-SQL-SERVER>;Database=Cryptids_<COURSE-NUMBER>_<YOUR-INITIALS>;User ID=<YOUR-USERNAME>;Password=<YOUR-PASSWORD>;TrustServerCertificate=True"
```

**Same connection string as week 9 — same server, same database name.** This is still the Cryptid Registry, and [one application gets one database](../../week-07/lecture-notes.md#naming-your-database). The folder is new so week 9's work stays where it is; the database is not.

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

Three migrations replay: the table with its six creatures, their Latin names and plates, and week 9's sightings.

**Now start the app — in terminal 1:**

```bash
dotnet watch
```

Open `/Cryptids` and count six. Then leave it running.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 1`** — the same as when you started. Task 1 changed your database, and the checks never look at it. Check 2's message says `CryptidContext` still inherits plain `DbContext`. That's correct: task 2 changes it.

> [!NOTE]
> **In class, stop here.** Task 2 comes after the next part of the demo. Checks 2 to 6 are still red, and that's expected — the rest of tonight turns them green. Finished early? Open any creature's page and click **✏️ Correct the record**. Nothing asks who you are. That is what tonight closes. Or help a classmate get to six creatures on `/Cryptids`. Working at home? Carry straight on.

### Task 2 in full

**Check:** `Check2_TheRegistryHasAPlaceToKeepItsMembers`

**The package — in terminal 2.** The version is pinned to match the EF Core the starter already uses:

```bash
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 10.0.10
```

*(Without `--version` you'd get the newest Identity, which pulls a newer EF Core in under the starter's, and every `dotnet ef` command after it warns that `The Entity Framework tools version … is older than that of the runtime`. It still works — but the pinned version keeps the lab's packages matching. Your homework doesn't pin; your own app isn't frozen.)*

**Create `Models/Member.cs`.** This is the whole file:

```csharp
using Microsoft.AspNetCore.Identity;

namespace Cryptids.Web.Models;

// A member of the Registry. Everything Identity needs — the email, the
// password hash, the lockout counters — comes from IdentityUser. This class
// is where the Registry's own facts about a member will go.
public class Member : IdentityUser
{
}
```

It's empty on purpose. `IdentityUser` already has everything signing in needs — the email, the password hash, the lockout counters. **`Member` exists so that every file that names the user names *your* class from the start**; task 6 gives it something of its own, in one line.

**Now `Data/CryptidContext.cs`. First, at the very top of `OnModelCreating`**, above the `Cryptid` seed:

```csharp
// Identity's seven tables are configured here. Leave it out and the
// app can't start: "requires a primary key to be defined".
base.OnModelCreating(modelBuilder);
```

**Then the class line, and its using at the top of the file:**

```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
```

```csharp
public class CryptidContext : IdentityDbContext<Member>
```

> [!IMPORTANT]
> **Terminal 1 now stops and asks:** `ENC0014: Updating the base class and/or base interface(s) of class requires restarting the application`, then `Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`. **Answer `a`.** Changing what a class inherits from is a change hot reload can't make. With `a` answered, `watch` restarts by itself every time it has to for the rest of the lab.

**Now `Program.cs`.** Two usings at the top:

```csharp
using Microsoft.AspNetCore.Identity;
using Cryptids.Web.Models;
```

**Just above `var app = builder.Build();`:**

```csharp
// Identity: who the members are, and the sign-in cookie that remembers them.
// The users live in CryptidContext, in the same database as the creatures.
builder.Services.AddIdentity<Member, IdentityRole>()
    .AddEntityFrameworkStores<CryptidContext>();
```

**And just above `app.UseAuthorization();`:**

```csharp
app.UseAuthentication();
```

It reads the sign-in cookie on every request. **It has to come before `UseAuthorization()`** — the lock needs to know who you are before it decides whether to let you in.

Terminal 1 prints `Restart is needed to apply the changes` and restarts on its own — that's the `a`.

**The migration — in terminal 2:**

```bash
dotnet ef migrations add AddIdentity
```

**Open the generated file and read it before you apply it.** Count the `CreateTable` calls in `Up`: **seven**, all starting `AspNet`. Then open the one for `AspNetUsers` and read down its columns. There's a `PasswordHash`. **There is no column called `Password`, and there never will be.**

**Apply it — still in terminal 2:**

```bash
dotnet ef database update
```

> [!IMPORTANT]
> **Now restart the app — `Ctrl+R` in terminal 1.** EF Core works out what your tables look like **once, when the app starts**, and seven of them just arrived. Hot reload printed `succeeded` for every file you saved, and that isn't enough for this change.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 2`** — checks 1 and 2. Check 3's message says `/Account/Register` came back `404`. That's correct: task 3 builds it.

> [!NOTE]
> **In class, stop here.** Task 3 comes after the break and the next part of the demo. Checks 3 to 6 are still red, and that's expected. Finished early? In the mssql panel, run `SELECT * FROM AspNetUsers;` against your database — every column a member needs, and no rows. Find `PasswordHash`. Or help a classmate with their restart prompt. Working at home? Carry straight on.

### Task 3 in full

**Check:** `Check3_AVisitorCanCreateAnAccount`

**Create `ViewModels/RegisterViewModel.cs`:**

```csharp
using System.ComponentModel.DataAnnotations;

namespace Cryptids.Web.ViewModels;

// What the registration form posts. It is not the Member: the password
// arrives here once, gets hashed by Identity, and is never stored.
public class RegisterViewModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; } = "";

    [Required]
    [DataType(DataType.Password)]
    [Display(Name = "Confirm password")]
    [Compare(nameof(Password), ErrorMessage = "The two passwords don't match.")]
    public string ConfirmPassword { get; set; } = "";
}
```

**Create `Controllers/AccountController.cs`:**

```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Cryptids.Web.Models;
using Cryptids.Web.ViewModels;

namespace Cryptids.Web.Controllers;

public class AccountController : Controller
{
    // Identity's two workers. UserManager creates and finds members;
    // SignInManager signs them in and out — it is what sets the cookie.
    private readonly UserManager<Member> _userManager;
    private readonly SignInManager<Member> _signInManager;

    public AccountController(UserManager<Member> userManager, SignInManager<Member> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    // GET /Account/Register
    public IActionResult Register()
    {
        return View();
    }

    // POST /Account/Register
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(RegisterViewModel form)
    {
        if (!ModelState.IsValid)
        {
            return View(form);
        }

        var member = new Member { UserName = form.Email, Email = form.Email };

        // The password goes in; a hash is what gets saved.
        var result = await _userManager.CreateAsync(member, form.Password);

        if (!result.Succeeded)
        {
            // Identity's own reasons — a weak password, an email already taken.
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }
            return View(form);
        }

        await _signInManager.SignInAsync(member, isPersistent: false);
        return RedirectToAction("Index", "Home");
    }
}
```

Three lines in the POST are the whole of it. **`CreateAsync`** makes the member — the password goes in, and a hash is what gets saved. **The `foreach`** copies Identity's own reasons for refusing onto the form, through the same `ModelState` as week 6. **`SignInAsync`** signs the new member in.

**Create `Views/Account/Register.cshtml`:**

```cshtml
@model RegisterViewModel
@{
    ViewData["Title"] = "Join the Registry";
}

<h1>Join the Registry</h1>
<p class="text-muted">Members can open, correct and close the Registry's files.</p>

<form asp-action="Register" method="post" class="col-md-6">
    <div asp-validation-summary="All" class="text-danger"></div>

    <div class="mb-3">
        <label asp-for="Email" class="form-label"></label>
        <input asp-for="Email" class="form-control" autocomplete="username" />
        <span asp-validation-for="Email" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="Password" class="form-label"></label>
        <input asp-for="Password" class="form-control" autocomplete="new-password" />
        <span asp-validation-for="Password" class="text-danger"></span>
    </div>

    <div class="mb-3">
        <label asp-for="ConfirmPassword" class="form-label"></label>
        <input asp-for="ConfirmPassword" class="form-control" autocomplete="new-password" />
        <span asp-validation-for="ConfirmPassword" class="text-danger"></span>
    </div>

    <button type="submit" class="btn btn-primary">Join</button>
</form>

@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

`dotnet watch` restarts by itself for the new files — that's task 2's `a`. *(If terminal 1 is asking instead, you restarted with `Ctrl+C` somewhere along the way. Answer `a`.)*

**Join, badly first.** Browse to `/Account/Register` — there's no link to it yet. An email, and **`password`** in both boxes. Submit. Three messages come back, and you wrote none of them:

```
Passwords must have at least one non alphanumeric character.
Passwords must have at least one digit ('0'-'9').
Passwords must have at least one uppercase ('A'-'Z').
```

They're Identity's default rules, and they're on the page because of the `foreach`.

**Now join properly** — a password with an uppercase letter, a digit and a symbol in it. Submit. You land on the front page, **and the page looks exactly the same.** Your navbar doesn't know about signing in yet; task 4 teaches it. So look somewhere else: **DevTools → Application → Cookies → `http://localhost:…`**. There's a cookie called **`.AspNetCore.Identity.Application`**, with **HttpOnly** ticked. That's you, signed in.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 3`** — checks 1 to 3. Check 4's message says the navbar doesn't offer a way out. That's correct: task 4 builds it.

> [!NOTE]
> **In class, stop here.** Task 4 comes after the next part of the demo. Checks 4 to 6 are still red, and that's expected. Finished early? In the mssql panel, run `SELECT UserName, PasswordHash FROM AspNetUsers;`. Your row is there, and its hash is a long string that starts `AQAAAA`. Join again with a second email and **the same password**, and compare the two hashes — they are different. Each one is salted. Or help a classmate find their cookie. Working at home? Carry straight on.

### Task 4 in full

**Check:** `Check4_AMemberCanSignOutAndBackIn`

**Create `ViewModels/LoginViewModel.cs`:**

```csharp
using System.ComponentModel.DataAnnotations;

namespace Cryptids.Web.ViewModels;

public class LoginViewModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; } = "";

    [Display(Name = "Keep me signed in")]
    public bool RememberMe { get; set; }
}
```

**Replace the whole of `Controllers/AccountController.cs`** with this one. It's task 3's file with the Login pair and Logout added at the bottom:

```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Cryptids.Web.Models;
using Cryptids.Web.ViewModels;

namespace Cryptids.Web.Controllers;

public class AccountController : Controller
{
    // Identity's two workers. UserManager creates and finds members;
    // SignInManager signs them in and out — it is what sets the cookie.
    private readonly UserManager<Member> _userManager;
    private readonly SignInManager<Member> _signInManager;

    public AccountController(UserManager<Member> userManager, SignInManager<Member> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    // GET /Account/Register
    public IActionResult Register()
    {
        return View();
    }

    // POST /Account/Register
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(RegisterViewModel form)
    {
        if (!ModelState.IsValid)
        {
            return View(form);
        }

        var member = new Member { UserName = form.Email, Email = form.Email };

        // The password goes in; a hash is what gets saved.
        var result = await _userManager.CreateAsync(member, form.Password);

        if (!result.Succeeded)
        {
            // Identity's own reasons — a weak password, an email already taken.
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }
            return View(form);
        }

        await _signInManager.SignInAsync(member, isPersistent: false);
        return RedirectToAction("Index", "Home");
    }

    // GET /Account/Login — and where [Authorize] sends a visitor, with the
    // page they were trying to reach in ?ReturnUrl=
    public IActionResult Login(string? returnUrl = null)
    {
        ViewData["ReturnUrl"] = returnUrl;
        return View();
    }

    // POST /Account/Login
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel form, string? returnUrl = null)
    {
        ViewData["ReturnUrl"] = returnUrl;
        if (!ModelState.IsValid)
        {
            return View(form);
        }

        var result = await _signInManager.PasswordSignInAsync(
            form.Email, form.Password, form.RememberMe, lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            // One message for both mistakes. Saying "wrong password" would tell
            // a stranger that the email has an account.
            ModelState.AddModelError("", "That email and password don't match a member.");
            return View(form);
        }

        // LocalRedirect refuses a ReturnUrl that points at another site.
        return LocalRedirect(returnUrl ?? "/");
    }

    // POST /Account/Logout — a POST, never a link. Any page on the internet
    // can make a browser send a GET.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return RedirectToAction("Index", "Home");
    }
}
```

**`PasswordSignInAsync`** checks the password against the stored hash and, if they match, sets the same cookie as before. Its one error message doesn't say whether the email or the password was wrong — saying *"wrong password"* would tell a stranger that the email has an account here. **`Logout` is `[HttpPost]`**, never a link: any page on the internet can make your browser send a GET.

**Create `Views/Account/Login.cshtml`:**

```cshtml
@model LoginViewModel
@{
    ViewData["Title"] = "Sign in";
}

<h1>Sign in</h1>

<form asp-action="Login" asp-route-returnUrl="@ViewData["ReturnUrl"]" method="post" class="col-md-6">
    <div asp-validation-summary="All" class="text-danger"></div>

    <div class="mb-3">
        <label asp-for="Email" class="form-label"></label>
        <input asp-for="Email" class="form-control" autocomplete="username" />
    </div>

    <div class="mb-3">
        <label asp-for="Password" class="form-label"></label>
        <input asp-for="Password" class="form-control" autocomplete="current-password" />
    </div>

    <div class="mb-3 form-check">
        <input asp-for="RememberMe" class="form-check-input" />
        <label asp-for="RememberMe" class="form-check-label"></label>
    </div>

    <button type="submit" class="btn btn-primary">Sign in</button>
    <a asp-action="Register" class="btn btn-link">Not a member? Join</a>
</form>

@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

**Now the navbar. Create `Views/Shared/_LoginPartial.cshtml`:**

```cshtml
<ul class="navbar-nav align-items-sm-center">
@if (User.Identity?.IsAuthenticated == true)
{
    <li class="nav-item">
        <span class="navbar-text me-2">Signed in as @User.Identity.Name</span>
    </li>
    <li class="nav-item">
        <form asp-controller="Account" asp-action="Logout" method="post">
            <button type="submit" class="btn btn-link nav-link">Sign out</button>
        </form>
    </li>
}
else
{
    <li class="nav-item">
        <a class="nav-link" asp-controller="Account" asp-action="Register">Join</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" asp-controller="Account" asp-action="Login">Sign in</a>
    </li>
}
</ul>
```

**And in `Views/Shared/_Layout.cshtml`, put this between the navbar's `</ul>` and the `</div>` under it:**

```cshtml
<partial name="_LoginPartial" />
```

Reload. **The navbar says *Signed in as* and your email** — you've been signed in since task 3.

**Watch the cookie go.** DevTools → Application → Cookies, then click **Sign out**. The navbar changes to **Join · Sign in**, and `.AspNetCore.Identity.Application` is gone from the list. Click **Sign in**, try a wrong password, read the message — then the right one. The cookie is back.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 4`** — checks 1 to 4. Check 5's message says a visitor who isn't signed in opened `/Cryptids/Create`. That's correct: task 5 locks it.

> [!NOTE]
> **In class, stop here.** Task 5 comes after the break and the next part of the demo. Checks 5 and 6 are still red, and that's expected. Finished early? Sign out, then open `/Cryptids/Create` — the form opens. Signing in changes nothing yet, and that's what task 5 is for. Or help a classmate whose navbar won't change. Working at home? Carry straight on.

### Task 5 in full

**Check:** `Check5_OnlyMembersCanChangeTheArchive`

**In `Controllers/CryptidsController.cs`**, the using at the top:

```csharp
using Microsoft.AspNetCore.Authorization;
```

**Above the class:**

```csharp
// Week 11: the whole archive needs a signed-in member — every action,
// including any added later. The two that only read open themselves up.
[Authorize]
public class CryptidsController : Controller
```

**And above `public IActionResult Index()`, and again above `public IActionResult Details(int id)`:**

```csharp
[AllowAnonymous]
```

**Why the class, and not each action:** on the class, every action is locked — the POSTs as well as the GETs, and any action anybody adds later. Put it on the GET actions instead and you've hidden the forms while leaving the POSTs open, and a form is not the only way to send a POST. Check 5 sends one.

> [!WARNING]
> **Don't touch `SightingsController`.** Reports are the Registry's public half: anybody can file one, signed in or not. Check 5 fails if a visitor who isn't signed in can't.

> [!TIP]
> **Signed out, and the form still opens over a correct `[Authorize]`?** Press `Ctrl+R` in terminal 1 and try again. MVC works out each action's filters when the app starts, so an attribute is the kind of edit hot reload can report as applied when it isn't. A restart always applies it.

**See the lock.** Sign out, open DevTools on the **Network** tab, then go to `/Cryptids` and click **＋ File a report**. You land on the Sign in page. The first request in the Network tab is `Create`, status **`302`**, and its `location` header says `/Account/Login?ReturnUrl=%2FCryptids%2FCreate`. Sign in — and you land on the form you wanted, not the front page. That's what `ReturnUrl` is for.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 5`** — tonight's in-class target. 🎉 Check 6's message says your `Member` has nothing of its own yet. That's correct: task 6 adds it.

> [!NOTE]
> **In class, stop here.** Task 6 comes after the next part of the demo. Check 6 is still red, and that's expected. Finished early? Sign out and file a sighting at `/Sightings/Create` — no account needed, and that's on purpose. Or help a classmate. Working at home? Carry straight on.

### Task 6 in full

**Check:** `Check6_TheRegistryKnowsItsMembersByName`

**In `Models/Member.cs`**, a property of the Registry's own — the name a member signs their reports with. Add the using at the top and the property inside the class:

```csharp
using System.ComponentModel.DataAnnotations;
```

```csharp
// The name a member signs their reports with. A new column on AspNetUsers.
[StringLength(40)]
public string FieldName { get; set; } = "";
```

**The migration — in terminal 2:**

```bash
dotnet ef migrations add AddFieldName
```

Open it. **One `AddColumn` on `AspNetUsers`, with `defaultValue: ""`** — that's what every member who joined before tonight gets in the new column: nothing. Apply it, still in terminal 2:

```bash
dotnet ef database update
```

**Then `Ctrl+R` in terminal 1** — a new column, the same restart as task 2.

**Now the navbar shows it.** Replace the whole of `Views/Shared/_LoginPartial.cshtml` with this. What's new is the two lines at the top, and the `var member` line — with its comment — inside the `@if`:

```cshtml
@using Microsoft.AspNetCore.Identity
@inject UserManager<Member> UserManager

<ul class="navbar-nav align-items-sm-center">
@if (User.Identity?.IsAuthenticated == true)
{
    // The cookie says WHO is signed in. Anything else about them — the
    // field name — is a column, so the partial looks the member up.
    var member = await UserManager.GetUserAsync(User);
    <li class="nav-item">
        <span class="navbar-text me-2">Signed in as @member?.FieldName</span>
    </li>
    <li class="nav-item">
        <form asp-controller="Account" asp-action="Logout" method="post">
            <button type="submit" class="btn btn-link nav-link">Sign out</button>
        </form>
    </li>
}
else
{
    <li class="nav-item">
        <a class="nav-link" asp-controller="Account" asp-action="Register">Join</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" asp-controller="Account" asp-action="Login">Sign in</a>
    </li>
}
</ul>
```

The cookie says *who* is signed in, but not their field name — that's a column, so the partial looks the member up.

**Reload. Your navbar says *Signed in as* — and nothing.** You joined in task 3, before the column existed, and the migration gave you an empty string. That's week 10's empty state in a new place, and the fix is the same: show something else when there's nothing to show. Replace the whole file again — the `var name` line is new, and the `<span>` shows it:

```cshtml
@using Microsoft.AspNetCore.Identity
@inject UserManager<Member> UserManager

<ul class="navbar-nav align-items-sm-center">
@if (User.Identity?.IsAuthenticated == true)
{
    // The cookie says WHO is signed in. Anything else about them — the
    // field name — is a column, so the partial looks the member up.
    var member = await UserManager.GetUserAsync(User);
    var name = string.IsNullOrEmpty(member?.FieldName) ? User.Identity.Name : member.FieldName;
    <li class="nav-item">
        <span class="navbar-text me-2">Signed in as @name</span>
    </li>
    <li class="nav-item">
        <form asp-controller="Account" asp-action="Logout" method="post">
            <button type="submit" class="btn btn-link nav-link">Sign out</button>
        </form>
    </li>
}
else
{
    <li class="nav-item">
        <a class="nav-link" asp-controller="Account" asp-action="Register">Join</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" asp-controller="Account" asp-action="Login">Sign in</a>
    </li>
}
</ul>
```

Reload: your email again. Now give new members a field name when they join — three small edits.

**`ViewModels/RegisterViewModel.cs`, under `Email`:**

```csharp
[Required]
[Display(Name = "Field name")]
[StringLength(40, MinimumLength = 2)]
public string FieldName { get; set; } = "";
```

**`Views/Account/Register.cshtml`, between the Email block and the Password block:**

```cshtml
<div class="mb-3">
    <label asp-for="FieldName" class="form-label"></label>
    <input asp-for="FieldName" class="form-control" />
    <div class="form-text">The name you sign your reports with.</div>
    <span asp-validation-for="FieldName" class="text-danger"></span>
</div>
```

**`Controllers/AccountController.cs`, the Register POST** — the line that makes the member:

```csharp
var member = new Member { UserName = form.Email, Email = form.Email, FieldName = form.FieldName };
```

Sign out, then **Join** again with a new email and a field name. The navbar says *Signed in as* and your field name.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 6`** — all six. 🎉 The Registry knows its members by name.

> [!NOTE]
> **In class, this is the last stop.** The last block — catching up, or the stretch below — follows straight on, with no demo in between. Or help a classmate. Working at home? You're done.

### Stretch: sign your reports

**No check, no points, and nobody needs this for the homework.** In class this is the last block — and the block has no stop. If any of your checks are still red, finish those first.

A member who files a report shouldn't have to type their own name. Fill in **Reported by** for them, when they're signed in. In `Controllers/SightingsController.cs`, add `using Microsoft.AspNetCore.Identity;`, ask for a `UserManager<Member>` in the constructor alongside the context, then in the GET `Create`, just above `return View(form);`:

```csharp
var member = await _userManager.GetUserAsync(User);
if (member != null && member.FieldName != "")
{
    form.Sighting.Witness = member.FieldName;
}
```

The GET has to become `async Task<IActionResult>` to `await`. **Nothing gets locked** — a visitor who isn't signed in still gets an empty box, and still files.

## Rules

- **Never edit `Cryptids.Checks`.** If a check looks wrong, tell me.
- **Work in `Cryptids.Web` only.**
- `dotnet test Cryptids.Checks` runs from `CryptidsMembers`, the folder above both projects.
- **The checks don't need wifi or SQL Server** — they run your app against an in-memory database. 6/6 does **not** prove your connection string works. Your browser proves that.

## 🆘 Stuck?

- **Every page fails, check 1 included, with `The entity type 'IdentityPasskeyData' requires a primary key to be defined`** — `base.OnModelCreating(modelBuilder);` is missing from the top of `OnModelCreating`. [Task 2 in full ↑](#task-2-in-full)
- **`The view 'Register' was not found`, and the file is right there** — look at terminal 1. `dotnet watch` is asking **`Do you want to restart your app?`**, and until you answer it the app keeps serving the build from before your file existed. Press **`a`**. Don't move the file. *(It's asking again because the app was restarted with `Ctrl+C` — use `Ctrl+R`.)*
- **A page fails right after `database update` with something about `AspNetUsers` or `FieldName`** — the app is still running the model from before the migration. `Ctrl+R` in terminal 1. EF Core works out your tables once, at startup.
- **Yellow `NU1902` / `NU1903` warnings, or `msbuild: [Failure] Msbuild failed when processing the file`** — not a failed build. It's the `System.Security.Cryptography.Pkcs` advisory from Setup, and it means your copy of the starter is older than the fix. From `Cryptids.Web`, once:

  ```bash
  dotnet add package System.Security.Cryptography.Pkcs --version 10.0.13
  ```
- **`NU1605: Detected package downgrade`**, or `The Entity Framework tools version … is older than that of the runtime`, after adding the Identity package — it went in without `--version 10.0.10`. Run task 2's `dotnet add package` line again, exactly as written.
- **A registration is refused and the page says nothing** — the `foreach` that copies `result.Errors` into `ModelState` is missing, or the summary says `ModelOnly`. Use `asp-validation-summary="All"`.
- **`Username '…' is already taken.`** — that email has joined already. It worked the first time.
- **The navbar never changes** — the `<partial name="_LoginPartial" />` line isn't in `_Layout.cshtml`, or it's outside the navbar's `<div>`.
- **Sign out does nothing, or gives a `405`** — the partial's form and the `Logout` action disagree: one of them isn't a POST. Check 4 fails outright if Sign out is a link, and says why.
- **Signed out, `/Cryptids/Create` still opens** — `[Authorize]` isn't on the class yet, or hot reload hasn't applied it. `Ctrl+R` in terminal 1. [Task 5 in full ↑](#task-5-in-full)
- **The navbar says *Signed in as …* and the locked pages still send you to sign in** — in `Program.cs`, `app.UseAuthentication();` is **below** `app.UseAuthorization();`. Swap them.
- **Signed out, `/Cryptids` or a creature's page sends you to sign in** — `[AllowAnonymous]` is missing from `Index` or `Details`.
- **Check 5 says a visitor couldn't file a report** — `SightingsController` got an `[Authorize]`. Take it off; reports are public.
- **The navbar says *Signed in as* and nothing after it** — your account is older than the `FieldName` column. That's task 6's fallback. [Task 6 in full ↑](#task-6-in-full)
- **`dotnet ef` says there's already an object named 'Cryptids'** — you skipped the database drop in task 1. Run it in terminal 2, then `database update` again. (Only ever in this lab — never on your own project's database.)
- **"Could not find a MSBuild project file"** — that terminal is standing in `CryptidsMembers`, which holds two projects. `dotnet watch`, `dotnet ef` and `dotnet user-secrets` need one: run `cd Cryptids.Web` in terminals 1 and 2.

## 🚀 Done early?

- **Do the stretch task above.**
- **Hide the buttons strangers can't use.** On `/Cryptids` and a creature's page, wrap **＋ File a report**, **✏️ Correct the record** and **🗑️ Close the file** in `@if (User.Identity?.IsAuthenticated == true) { … }`. The lock is still the `[Authorize]` — a hidden button is a courtesy, not security.
- **Read the cookie's expiry.** Sign in without **Keep me signed in**, and the cookie's *Expires* column in DevTools says *Session* — it dies with the browser. Sign in with it ticked, and the cookie carries a date two weeks out.
