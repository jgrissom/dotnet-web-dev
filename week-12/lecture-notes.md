# Week 12 — Roles, Claims and Securing the Application

**What this covers:** a role on the lock, so *signed in* is no longer enough; the page a signed-in visitor lands on when the lock says no; who gets the role, and why that's written in configuration instead of code; why a new role doesn't reach someone who is already signed in; hiding the buttons a visitor can't use, and why that isn't security; what a claim is; and everything weeks 6–12 have secured between them.

**Keep this open while you work.** Every requirement in the homework has a section here, and the 🆘 section at the bottom of the homework links straight into it.

---

## Part 1: Signed in as whom

Week 11 locked every write behind `[Authorize]` and said, out loud, what that didn't fix: **anyone can create an account.** All it takes is an email address. So the lock kept out visitors who hadn't signed in, and let in anybody who had.

| | Week 11 | This week |
|---|---|---|
| a visitor, not signed in | can read | can read |
| **anyone with an account** | **can write** | can read |
| **someone with the role** | — | **can write** |

A **role** is a name — *Admin*, *Curator*, *Ranger* — that some users hold and others don't. The difference from an account is who hands it out: anyone can make an account, and **only you can give out a role**. The question the lock asks changes from *are you signed in?* to *are you signed in as someone with this role?* — authorization, the second of week 11's two questions, finally asked properly.

---

## Part 2: A role on the lock

### One word in the attribute

The attribute stays exactly where week 11 put it — on the controller **class** — and gets a role:

```csharp
[Authorize(Roles = "Admin")]
public class TrucksController : Controller
{
    [AllowAnonymous]
    public IActionResult Index() { ... }

    [AllowAnonymous]
    public IActionResult Details(int id) { ... }

    // Create, Edit, Delete — all need the Admin role now
}
```

Nothing else in the controller changes. It still needs a signed-in visitor, and now that visitor also has to hold the role. `[AllowAnonymous]` still opens the two actions that only read, and the class still covers every POST and every action added later — week 11's reason for putting it there hasn't moved.

⚠️ **An attribute is the kind of edit hot reload can report as applied when it isn't.** MVC works out each action's filters when the app starts. If a signed-in visitor without the role still gets the form over correct code, press `Ctrl+R` in the terminal running `dotnet watch` and try again.

### Where a signed-in visitor goes

Sign in as anyone without the role and click a locked link. The address bar says:

```
/Account/AccessDenied?ReturnUrl=%2FTrucks%2FCreate
```

That's Identity's **other** default. You've met the first one:

| Who clicks a locked link | Where `AddIdentity` sends them |
|---|---|
| not signed in | `/Account/Login` |
| signed in, without the role | `/Account/AccessDenied` |
| signed in, with the role | the page |

Neither address is configured anywhere. You write the pages; Identity sends people to them. And until you write this one, **it's a 404** — so the page that actually shows is your week-10 *Missing* page, which answers every 404 on the site. A signed-in visitor clicks a button and is told the page doesn't exist. Part 3 fixes that.

---

## Part 3: The AccessDenied page

Two pieces, **view first, then the action** — the same order as week 10's Missing page, and for the same reason.

**`Views/Account/AccessDenied.cshtml`** — this is the whole file:

```cshtml
@{
    ViewData["Title"] = "Admins only";
}

<div class="text-center py-5">
    <h1 class="display-5">Admins only 🔒</h1>
    <p class="lead text-muted">
        You're signed in, but changing Curbside's trucks, dishes and specials is for its admins.
    </p>
    <a asp-controller="Trucks" asp-action="Index" class="btn btn-primary">See every truck</a>
</div>
```

Say **who the page is for**. A visitor who lands here should be able to tell the site isn't broken — this part of it just isn't theirs.

⚠️ **A new view is a change hot reload can't make.** `dotnet watch` prints `ENC0021: Adding attribute requires restarting the application` and asks *Do you want to restart your app?* Answer **`a`**, and it restarts by itself from then on. Until it restarts, the app keeps serving the build from before your file existed.

**Then the action, inside `AccountController`** — anywhere in the class; Curbside puts it just above `Logout`:

```csharp
// GET /Account/AccessDenied — where [Authorize(Roles = "Admin")] sends someone
// who IS signed in but isn't an admin. Identity's own default, the same
// way a stranger is sent to /Account/Login.
public IActionResult AccessDenied()
{
    return View();
}
```

**Why the view goes first:** an action that returns a view that isn't there yet answers with a **500** — *The view 'AccessDenied' was not found* — which is worse than the 404 it's replacing. With the view already in place, adding the action is the moment the page appears.

---

## Part 4: Who gets the role

A role is a row in `AspNetRoles`. Holding one is a row in `AspNetUserRoles`, joining a user to a role. **Both tables came with week 11's `AddIdentity` migration**, and they've been empty ever since — which is why this week needs **no migration**: the tables exist, and nothing has put rows in them.

### The email lives in configuration

The role itself can be made in code: it's the same on every machine, and it isn't a secret. **Who holds it is different**, and it does not go in code:

- your repo is **public**, and an admin's email is personal information;
- changing who the admin is should be a setting, not an edit, a commit and a redeploy;
- and putting a *password* in code — the shape you'll find in many tutorials, a seeded admin user with a password in a `HasData` or a startup method — puts that password in your git history forever.

So the admin **registers through your own form, like anybody else**, and configuration says which email gets the role. It lives in the same store as your connection string, under the key **`Admin:Email`**:

| | Where `Admin:Email` lives | How you set it |
|---|---|---|
| your machine | user secrets | `dotnet user-secrets set "Admin:Email" "you@example.com"` |
| Azure | an app setting | `Admin__Email` — [Part 9](#on-azure) |

Two underscores on Azure, the same as `ConnectionStrings__DefaultConnection` in [week 7](../week-07/lecture-notes.md#part-7-the-deployed-app-10-min): an environment variable can't contain a colon everywhere, so `__` stands in for `:`.

### The seeder

**`Data/RoleSeeder.cs`** — this is the whole file:

```csharp
using Microsoft.AspNetCore.Identity;
using Curbside.Models;

namespace Curbside.Data;

// Runs once, when the app starts. Makes sure the Admin role exists, then
// gives it to the user whose email is in configuration under Admin:Email —
// a user secret on my machine, an app setting on Azure. No email set, or
// nobody has registered with it yet: the role exists, and nobody holds it.
public static class RoleSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var config = services.GetRequiredService<IConfiguration>();

        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        var email = config["Admin:Email"];
        if (string.IsNullOrEmpty(email))
        {
            return;
        }

        var user = await userManager.FindByEmailAsync(email);
        if (user != null && !await userManager.IsInRoleAsync(user, "Admin"))
        {
            await userManager.AddToRoleAsync(user, "Admin");
        }
    }
}
```

Three workers, all handed over by the app the same way a controller is handed its context:

- **`RoleManager<IdentityRole>`** makes roles. `AddIdentity<AppUser, IdentityRole>()` registered it in week 11 — that's what the second type in that line was for.
- **`UserManager<AppUser>`** finds users and gives them roles. It's the same one week 11's register page used to create them.
- **`IConfiguration`** reads `Admin:Email` from wherever it lives: user secrets, an app setting, an environment variable — the provider chain from week 7.

Every step checks before it acts, so **running it twice changes nothing the second time**, and it runs every time the app starts. No email, or an email nobody has registered with yet: the role is made, and nobody holds it. That's not an error — register, then restart.

`"Admin"` appears three times here and once in the attribute. **A role is matched by its name**, so all four have to agree — `"Admins"` in one place and `"Admin"` in another is an admin who is never let in.

### Running it at startup

**In `Program.cs`, just below `var app = builder.Build();`:**

```csharp
// Week 12: the Admin role, and who holds it. Runs once, at startup.
using (var scope = app.Services.CreateScope())
{
    await RoleSeeder.SeedAsync(scope.ServiceProvider);
}
```

`CreateScope` is there because `RoleManager` and `UserManager` live for one request at a time — the same lifetime as your context — and at startup there is no request, so the code makes a scope of its own and lets it go when it's done. `await` works here because `Program.cs` is allowed to await at the top level.

⚠️ **Your app now talks to the database the moment it starts.** Before this, it started without touching the database and failed on the first page that needed it. Now the seeder runs before `Now listening on:`, so:

- **no connection string** → `Unhandled exception. System.InvalidOperationException: The ConnectionString property has not been initialized.` — and the app stops;
- **a server it can't reach** → `SqlException … A network-related or instance-specific error occurred while establishing a connection to SQL Server`, after the timeout — and the app stops.

On a lab PC that wipes your secrets, that's the first thing you'll see. Set the connection string again. **`dotnet ef` is unaffected**: its commands build the app without running it, so `migrations add` and `database update` never reach the seeder.

---

## Part 5: The role is read when you sign in

Here is the order of events that will happen to you, and it looks like a bug:

1. You register, and you're signed in.
2. You set `Admin:Email` to your email and restart. The seeder runs and gives you the role — **the row is in `AspNetUserRoles`**.
3. You click a locked link. **Refused.**

Nothing is broken. When you signed in, Identity wrote a **cookie**, and into it went the facts about you that every request needs — your id, your name, your email, **and your roles**. At that moment you had none. The seeder changed the database afterwards; your cookie still says what it said when you signed in. **`[Authorize]` reads the cookie, not the database.**

So: **a new role takes effect the next time you sign in.** Sign out, sign back in, and the new cookie carries it.

*(Identity also re-checks the cookie against the database every 30 minutes by default, and rebuilds it if the account changed — so a role **can** arrive on its own, eventually. Signing in again is how you get it now.)*

It works the other way round too, which is worth knowing even though this course never takes a role away: someone who loses a role keeps it in their cookie until they sign in again or that re-check comes round.

---

## Part 6: Hide what you can't use

With the lock on, a visitor without the role still sees **＋ Add a truck**, clicks it, and is refused. A button that only ever leads to a refusal shouldn't be there. **`User.IsInRole("…")`** asks the same question the attribute does, and a view can use it to decide what to show.

**`Views/Trucks/Index.cshtml`** — this is the whole file:

```cshtml
@model List<Truck>
@{
    ViewData["Title"] = "Trucks";
}

<h1>Curbside</h1>
<p class="text-muted">@Model.Count trucks on the street.</p>

@if (User.IsInRole("Admin"))
{
    <a asp-action="Create" class="btn btn-primary mb-4">＋ Add a truck</a>
}

@if (!Model.Any())
{
    <p class="text-muted">No trucks on the street yet.</p>
}

<div class="row row-cols-1 row-cols-md-3 g-4">
    @foreach (var truck in Model)
    {
        <div class="col">
            <partial name="_TruckCard" model="truck" />
        </div>
    }
</div>
```

Notice the empty state lost its *Add the first one* link too: most people who read it can't. On a record's page, the same `@if` goes around Edit and Delete — one `@if` can hold both buttons. **Every page with a write button needs it**: Curbside has four.

**Leave a public action's button outside the `@if`.** If your second table is something the public submits — the Registry's 👁️ *Report a sighting*, TrailGuide's *Write a review* — its button stays where everyone can see it.

### Hiding a link is not security

Sign in as someone without the role, look at a page with no buttons on it, and type the address yourself: **`/Trucks/Create`**. *Admins only.* The address bar doesn't need a button.

| | Decides | If it's missing |
|---|---|---|
| `@if (User.IsInRole("Admin"))` | what a visitor **sees** | a button that leads to a refusal |
| `[Authorize(Roles = "Admin")]` | what a visitor can **do** | **anyone signed in can write** |

The two are not alternatives. **Hide the button for the visitor; lock the controller for the data.** A site that hides its buttons and forgets the attribute looks locked and isn't — and that's the version that gets past a quick look, because every page looks right.

---

## Part 7: A role is a claim

Part 5 said the cookie carries facts about you. Each of those facts is a **claim**: a *type* and a *value*. You can list them — `User.Claims` is every claim in the current visitor's cookie.

**Inside `AccountController`** — and it needs `using Microsoft.AspNetCore.Authorization;` at the top of the file:

```csharp
// GET /Account/Claims — what the sign-in cookie says about you. A role
// is one claim among the others.
[Authorize]
public IActionResult Claims()
{
    return View();
}
```

`[Authorize]` with no role: anyone signed in, because a visitor who isn't has no claims to list.

**`Views/Account/Claims.cshtml`** — this is the whole file:

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

Signed in with a password, an admin sees six rows:

| Type | Value |
|---|---|
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier` | the user's id — the `Id` column in `AspNetUsers` |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name` | `ada@example.com` |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` | `ada@example.com` |
| `AspNet.Identity.SecurityStamp` | a value Identity changes when the account does — Part 5's 30-minute re-check compares it |
| `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` | **`Admin`** |
| `amr` | `pwd` — *how* they signed in: with a password |

Someone without the role sees the same list minus the `role` row. **A role is a claim whose type is `role`**, and `User.IsInRole("Admin")` and `[Authorize(Roles = "Admin")]` both read that row. That's the whole of Part 5's puzzle in one table: the row is written when you sign in, so signing in again is what writes a new one.

*The long types are URLs from a Microsoft standard that gave every claim type a namespace. In code you rarely type them — `ClaimTypes.Role` is the same string with a shorter name.*

The navbar's *Signed in as* has been reading a claim since week 11: `User.Identity.Name` is the `name` claim. The display name was a database lookup, because it isn't in the cookie — and that's a choice, not a rule. You can put your own facts into the cookie as claims, and real sites do. This course doesn't, because the lookup already works and a claim of your own is one more thing that goes stale until the next sign-in.

---

## Part 8: What's already secured

Securing an application isn't one feature. It's a set of small defenses, each against one specific thing. This course has been adding them since week 6:

| Week | What | It stops |
|---|---|---|
| 6 | `[ValidateAntiForgeryToken]` on every POST | another website making your browser post one of your forms |
| 8 | the `[Bind]` list on Edit | a field nobody put on the form being slipped into the post |
| 11 | `PasswordHash`, never a password | a stolen copy of the table giving up anyone's password |
| 11 | sign-out is a POST | any page on the internet signing you out with an `<img>` tag |
| 11 | `LocalRedirect(returnUrl)` | a crafted `?ReturnUrl=` sending someone to another site after they sign in |
| 11 | `[Authorize]` on the class | an action somebody adds next month being open by default |
| **12** | **a role on the attribute** | **strangers who made an account** |

And three that came with the framework without your writing a line: Razor **encodes** everything it prints, so a cryptid named `<script>` shows up as text rather than running; Entity Framework **parameterizes** every query, so a name with a quote in it can't change your SQL; and the sign-in cookie is **`HttpOnly`**, so the page's own JavaScript can't read it.

None of these is the whole story, and none of them is new tonight except the last row. The point of the table is that each defense has a reason you can say in one line — and that's what the explain-it standard asks for.

---

## Part 9: Your own app

The moves are the same four; the names are yours.

| | Curbside | Your app |
|---|---|---|
| the role | `Admin` | a name that says what that person *does* in your app — `Ranger`, `Editor`, `Curator`, `Coach` |
| locked controllers | `TrucksController`, `DishesController`, `SpecialsController` | every controller that changes your data — each one carrying week 11's `[Authorize]` today |
| public half | none | your second table, if the public submits it — its controller stays open, and its button stays visible |
| the admin | `ada@example.com` | **your own email**, the one you registered with |

### Picking a role name

Pick one name and use it everywhere: the attribute on every locked controller, `RoleExistsAsync`, `CreateAsync`, `AddToRoleAsync`, `IsInRoleAsync` and every `User.IsInRole` in your views. They are matched as strings. The homework asks you to say what your role is in your README, for the same reason the Registry's is called *Curator*: a reader should know who it's for.

### On Azure

Your deployed app reads configuration too, and it has never seen your user secrets. Give it the email as an **app setting** — the same command as week 7's connection string, with a different name:

```bash
az webapp config appsettings set --name your-app-XX1234 \
  --resource-group <YOUR-RESOURCE-GROUP> \
  --settings Admin__Email="you@example.com"
```

**Setting an app setting restarts the app**, and a restart is exactly when the seeder runs. So the order on Azure is the same as on your machine: **register** on your deployed site with that email (if you haven't), **set the app setting**, wait for the restart (the free tier can take 30 seconds or more), then **sign out and sign back in** — Part 5, again — and make one change as your admin.

**No migration** this week, so there is nothing to `database update` before you deploy. Your deployed app and your local one share the school database, so the role the seeder made locally is already there — but **who holds it is per row, not per machine**: if your local and deployed `Admin:Email` are the same email, the same account is the admin in both places.

---

## Part 10: What this course leaves out

Search for ASP.NET Core authorization and you'll find much more than tonight:

- **Policies** — `[Authorize(Policy = "…")]`, where a policy is a named rule in `Program.cs` that can check a role, a claim, or anything you can write in C#. Roles are the simplest policy there is, and every `Roles = …` you've written is one.
- **A page for managing roles** — granting and revoking from inside the app, with `AddToRoleAsync` and `RemoveFromRoleAsync` behind a form that only an admin can open. Real sites have one. Here, configuration decides, and changing the admin is a setting and a restart.
- **More than one role, or more than one admin.** `Roles = "Admin,Editor"` lets in either; `AddToRoleAsync` can be called for as many users as you like. One role and one admin is enough to learn the shape.
- **Seeded admin accounts with passwords.** Many tutorials create the admin in code, password and all. That works on a laptop and puts a password in your git history. Registering through your own form costs one extra step and keeps every password where week 11 put it: hashed, in `AspNetUsers`, typed by nobody but its owner.

---

## Troubleshooting

**The app stops before `Now listening on:` with `The ConnectionString property has not been initialized`**
- The connection string secret is missing — a frozen lab PC wipes it. `dotnet user-secrets set "ConnectionStrings:DefaultConnection" "…"` again. From this week the app reads the database as it starts, so a missing string stops it outright. [Running it at startup](#running-it-at-startup).

**The app stops before `Now listening on:` with `SqlException … A network-related or instance-specific error`**
- The server name in the connection string, or no network. The same reason: the seeder runs at startup.

**You're in `AspNetUserRoles`, and you're still refused**
- Your cookie is older than your role. Sign out and sign back in. [Part 5](#part-5-the-role-is-read-when-you-sign-in).

**You've signed out and back in, and you're still refused**
- The seeder never gave you the role, or gave you a different one. The role's name must be identical in the attribute and in the seeder; the key must be `Admin:Email`; and `dotnet user-secrets list` must show the email you registered with. Then restart — the seeder only runs at startup. [The seeder](#the-seeder).

**A signed-in visitor without the role still gets the form**
- The attribute is still week 11's `[Authorize]`, or hot reload hasn't applied the change. Restart with `Ctrl+R`. [Part 2](#one-word-in-the-attribute).

**A signed-in visitor without the role lands on your Missing page, at `/Account/AccessDenied`**
- There's no `AccessDenied()` action on `AccountController` yet. [Part 3](#part-3-the-accessdenied-page).

**A `500` with `The view 'AccessDenied' was not found`, and the file is right there**
- `dotnet watch` is asking `Do you want to restart your app?` in its terminal, and until you answer it the app is serving the build from before the file existed. Answer `a`. Don't move the file.

**Your admin can't see the buttons either**
- The name inside `User.IsInRole("…")` doesn't match the role, or the admin hasn't signed in again since getting it. [Part 6](#part-6-hide-what-you-cant-use).

**`The type or namespace name 'Authorize' could not be found`**
- `using Microsoft.AspNetCore.Authorization;` at the top of the file.

**Localhost works, and on Azure your admin is refused**
- Azure doesn't read your user secrets. Set `Admin__Email` as an app setting — two underscores — wait for the restart, then sign out and back in on the deployed site. [On Azure](#on-azure).
