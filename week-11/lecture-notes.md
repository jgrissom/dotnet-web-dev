# Week 11 — ASP.NET Core Identity

**What this covers:** a users table and a user class of your own; registering, where a password goes in and only a hash is saved; signing in and out, and the cookie that remembers you; `[Authorize]`, which makes a change to your data need an account; and a property of your own on the user.

**Keep this open while you work.** Every requirement in the homework has a section here, and the 🆘 section at the bottom of the homework links straight into it.

---

## Part 1: Two questions

Since week 6 anyone with your URL could add a record. Since week 8 they could edit one and delete one. Nothing ever asked who they were, because there was nothing to ask with.

Two different questions get asked about a visitor, and they sound alike:

| | Asks | This week |
|---|---|---|
| **Authentication** | *who are you?* | an account, a password, a sign-in |
| **Authorization** | *what may you do?* | only **signed in, or not** |

This week builds the first one properly and the second one in its simplest form: a signed-in visitor can change your data, and anyone else can read it. Week 12 is roles — *signed in as whom*.

ASP.NET Core's answer to the first question is **Identity**: a set of tables for users, and the classes that create users, check passwords and set the cookie that remembers them. You bring a user class and a database to put it in.

---

## Part 2: Identity goes in

Four pieces, in this order: a package, a user class, the context, and `Program.cs`. Then a migration.

### The package

From inside your web project folder:

```bash
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
```

It is Identity's database half — the tables, and the code that reads and writes them. *(The demo and the lab pin `--version 10.0.10`, because their starters are frozen at that version of EF Core. Your own app isn't frozen, so don't pin; if `dotnet ef` then warns that `The Entity Framework tools version … is older than that of the runtime`, it still works.)*

### Your own user class, even empty

This is the whole of `Models/AppUser.cs` as the demo first writes it:

```csharp
using Microsoft.AspNetCore.Identity;

namespace Curbside.Models;

public class AppUser : IdentityUser
{
}
```

`IdentityUser` already has everything signing in needs: an `Id`, the `UserName`, the `Email`, the `PasswordHash`, lockout counters and more. `AppUser` inherits all of it and adds nothing — yet.

**Why have it at all, then?** Because by the end of this week four files name the user type: the context, `Program.cs`, the account controller and the navbar partial. If they all said `IdentityUser`, adding a property of your own later would mean changing every one of them. Because they say `AppUser`, it means adding one line to one class — which is [Part 7](#part-7-customizing-the-user). Make the class on day one.

Name yours for your app: `Hiker`, `Member`, `Fan`, `AppUser`. Nothing depends on the name.

### The context

Two changes in your context file. First, at the very top of `OnModelCreating`:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // ...your HasData seed, unchanged
}
```

Then the class line, with its using at the top of the file:

```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
```

```csharp
public class CurbsideContext : IdentityDbContext<AppUser>
```

**`IdentityDbContext<AppUser>` is Microsoft's own `DbContext`, with a `DbSet` already declared for each of Identity's seven tables** — `Users`, `Roles`, `UserRoles`, `UserClaims`, `UserLogins`, `UserTokens` and `RoleClaims`. Inheriting from it instead of plain `DbContext` gives your context those seven, and it keeps every `DbSet` it already had: one context, one database, your data and your users together. `AddEntityFrameworkStores<CurbsideContext>()` in `Program.cs` is what tells Identity to use it. **`base.OnModelCreating` is what configures Identity's seven tables** — their keys, their indexes, how they point at each other. Leave it out and nothing complains until the first time anything touches the database, and then everything does:

```
The entity type 'IdentityPasskeyData' requires a primary key to be defined.
```

### Program.cs

Two usings at the top — your own namespace for the second:

```csharp
using Microsoft.AspNetCore.Identity;
using Curbside.Models;
```

Just above `var app = builder.Build();`:

```csharp
// Identity: the users, and the cookie that remembers who is signed in.
builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<CurbsideContext>();
```

And just above `app.UseAuthorization();`:

```csharp
app.UseAuthentication();
```

`AddIdentity` turns Identity on for your user class and keeps the users in your context. `IdentityRole` is the roles half, which nothing uses until week 12.

`UseAuthentication()` reads the sign-in cookie on every request and works out who it belongs to. **Order matters:** it has to come before `UseAuthorization()`, because the lock needs to know who you are before it decides whether to let you in. Put it after, and you get the most confusing failure of the week — your navbar says *Signed in as …* while every locked page still sends you to sign in. *(If you leave the line out altogether, ASP.NET adds the middleware for you and everything works. Write it anyway; then `Program.cs` says what the app does.)*

### The migration

```bash
dotnet ef migrations add AddIdentity
```

Read it before you apply it. Count the `CreateTable` calls in `Up`: **seven** — `AspNetRoles`, `AspNetUsers`, `AspNetRoleClaims`, `AspNetUserClaims`, `AspNetUserLogins`, `AspNetUserRoles` and `AspNetUserTokens` — with seven indexes after them. This week uses `AspNetUsers`. Open its block and read down the columns: there's a `PasswordHash`. **There is no column called `Password`.**

```bash
dotnet ef database update
```

It's additive, like every migration since week 7 — your own tables are untouched.

### The restart, and the question it asks

Two things about `dotnet watch` this week, both measured:

- **The context edit asks.** Changing what a class inherits from is a change hot reload can't make, so `watch` prints `ENC0014: Updating the base class and/or base interface(s) of class requires restarting the application` and then **`Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`**. Answer **`a`**, and every later edit that needs a restart gets one by itself — `Program.cs`, new views, new controllers.
- **After `database update`, restart with `Ctrl+R`** in the terminal running `dotnet watch`. EF Core works out your tables once, when the app starts, and seven just arrived. Use `Ctrl+R` rather than `Ctrl+C` and `dotnet watch` again: *Always* belongs to the running `watch`, and `Ctrl+C` ends it — the next new file stops and asks all over again.

---

## Part 3: Registering

A register page is a Create pair — the same shape as every one since week 6 — that makes a user instead of a row of your own.

### The ViewModel

`ViewModels/RegisterViewModel.cs`, the whole file:

```csharp
using System.ComponentModel.DataAnnotations;

namespace Curbside.ViewModels;

// What the registration form posts. It is not the user: the password
// arrives here once, Identity hashes it, and it is never stored.
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

It only carries what the form sends — it is **not** your user class, and it never gets saved. The password reaches it once, Identity turns it into a hash, and the password itself is never stored. That's why it's a ViewModel, and why `Password` is never a property on your user class. `[Compare]` checks the two password boxes match. [Part 7](#on-the-form) adds one more property to it.

### The controller

`Controllers/AccountController.cs` — the top of the file, and the Register pair:

```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Curbside.Models;
using Curbside.ViewModels;

namespace Curbside.Controllers;

public class AccountController : Controller
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;

    public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public IActionResult Register()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(RegisterViewModel form)
    {
        if (!ModelState.IsValid)
        {
            return View(form);
        }

        var user = new AppUser { UserName = form.Email, Email = form.Email };
        var result = await _userManager.CreateAsync(user, form.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }
            return View(form);
        }

        await _signInManager.SignInAsync(user, isPersistent: false);
        return RedirectToAction("Index", "Home");
    }
}
```

Identity hands you two workers through the constructor, the same way week 7 handed you the context. **`UserManager`** creates and finds users. **`SignInManager`** signs them in and out.

Three lines in the POST are the whole of it:

- **`CreateAsync(user, form.Password)`** makes the user. The password goes in; Identity hashes it, and the hash is what's saved.
- **The `foreach`** — when Identity refuses, `result.Errors` says why, and this copies each reason into `ModelState`, the same one week 6's validation uses. Without it the form comes back and says nothing.
- **`SignInAsync`** signs the new user in, so registering leaves you signed in.

`UserName = form.Email` — Identity needs a user name, and an email is a user name nobody has to invent.

### The view

`Views/Account/Register.cshtml` — an ordinary week-6 form, the whole file:

```cshtml
@model RegisterViewModel
@{
    ViewData["Title"] = "Create an account";
}

<h1>Create an account 🌮</h1>

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

    <button type="submit" class="btn btn-primary">Create the account</button>
</form>

@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

There's nothing linking to it yet; browse to `/Account/Register`. Part 5's navbar adds the link.

### Identity's own rules

Register with the password `password` and three messages come back, none of which you wrote:

```
Passwords must have at least one non alphanumeric character.
Passwords must have at least one digit ('0'-'9').
Passwords must have at least one uppercase ('A'-'Z').
```

Those are Identity's defaults: six characters or more, with an uppercase letter, a lowercase letter, a digit and a symbol. Register the same email twice and you get `Username '…' is already taken.` Both arrive through `result.Errors`.

### The password is never stored

After a successful registration, the row in `AspNetUsers` has your email in it and a `PasswordHash` that is 84 characters long and starts `AQAAAAIAAYagAAAAE`. That is all the database knows about your password.

A **hash** is one-way: a password can be checked against it, and it can't be turned back into the password. Identity also **salts** each one — mixes in random bytes before hashing — so two users with the same password get different hashes, and a stolen table doesn't say who shares one. Measured: hashing `Curbside-2026` twice gives two different 84-character strings, and both check out against it.

---

## Part 4: The cookie is the login

HTTP remembers nothing from one request to the next. So when you sign in, the server sends a **cookie**, and your browser sends it back with every request after that. Every page reads it, and that is how every page knows it's you.

See it for yourself: **DevTools → Application → Cookies → your site.** After registering or signing in there's one called **`.AspNetCore.Identity.Application`**. Its **HttpOnly** box is ticked, which means the page's own JavaScript can't read it — a script injected into your page can't steal it. Signing out deletes it.

**Keep me signed in** changes how long it lasts. Without it, the cookie's *Expires* column says *Session* — it goes when the browser closes. With it, the cookie carries a date two weeks out.

The cookie holds who you are, signed by the server so it can't be edited. It does **not** hold anything you add to your user class — that's a column in the database, and [Part 7](#part-7-customizing-the-user) looks it up.

---

## Part 5: Signing in and out

### The rest of the controller

Below the Register pair, inside the same class:

```csharp
public IActionResult Login(string? returnUrl = null)
{
    ViewData["ReturnUrl"] = returnUrl;
    return View();
}

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
        ModelState.AddModelError("", "That email and password don't match an account.");
        return View(form);
    }

    return LocalRedirect(returnUrl ?? "/");
}

[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Logout()
{
    await _signInManager.SignOutAsync();
    return RedirectToAction("Index", "Home");
}
```

**`PasswordSignInAsync`** checks the password against the stored hash and, if they match, sets the same cookie registering did. **`SignOutAsync`** deletes it.

`returnUrl` is where the visitor was trying to go when [Part 6's lock](#part-6-authorize) sent them here. **`LocalRedirect`** sends them back — and refuses a `returnUrl` that points at somebody else's site, so a link built to sign people in on your site and drop them on a fake one doesn't work.

### Two rules for a sign-in form

**1. Never say which half was wrong.** One message covers a wrong email and a wrong password. *"Wrong password"* would tell a stranger that the email has an account on your site.

**2. Signing out is a POST — never a link.** A link sends a GET, and any page on the internet can make your browser send a GET to your site — an `<img>` tag is enough. If a GET signed people out, any page they visited could sign them out of yours. `[HttpPost]` on `Logout`, a form in the navbar.

### The ViewModel and the view

`ViewModels/LoginViewModel.cs`, the whole file:

```csharp
using System.ComponentModel.DataAnnotations;

namespace Curbside.ViewModels;

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

`Views/Account/Login.cshtml`, the whole file:

```cshtml
@model LoginViewModel
@{
    ViewData["Title"] = "Sign in";
}

<h1>Sign in 🌮</h1>

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
    <a asp-action="Register" class="btn btn-link">No account yet? Create one</a>
</form>

@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

`asp-route-returnUrl` keeps the `returnUrl` on the form's address, so the POST receives it too.

### The navbar

`Views/Shared/_LoginPartial.cshtml`. This is the first version, before Part 7 — it shows the email the cookie carries:

```cshtml
<ul class="navbar-nav">
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
        <a class="nav-link" asp-controller="Account" asp-action="Register">Create an account</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" asp-controller="Account" asp-action="Login">Sign in</a>
    </li>
}
</ul>
```

`User` is available in every view, and `User.Identity.IsAuthenticated` is true when the cookie says someone is signed in. Then, in `Views/Shared/_Layout.cshtml`, **between the navbar's `</ul>` and the `</div>` under it**:

```cshtml
<partial name="_LoginPartial" />
```

---

## Part 6: `[Authorize]`

### Lock the controller, open the reads

The using at the top of your controller:

```csharp
using Microsoft.AspNetCore.Authorization;
```

Then `[Authorize]` on the **class**, and `[AllowAnonymous]` on the two actions that only read:

```csharp
[Authorize]
public class TrucksController : Controller
{
    [AllowAnonymous]
    public IActionResult Index() { ... }

    [AllowAnonymous]
    public IActionResult Details(int id) { ... }

    // Create, Edit, Delete — all locked
}
```

**Why the class and not each action:** on the class, every action needs a signed-in visitor — the POSTs as well as the GETs, and any action you add next month. Put `[Authorize]` on the GET actions instead and you've hidden the forms while leaving the POSTs open, and a form is not the only way to send a POST. The first action you forget to mark is open; with the class locked, the first action you forget to *open* is merely locked.

⚠️ **An attribute is the kind of edit hot reload can report as applied when it isn't.** MVC works out each action's filters when the app starts. If a signed-out visitor still gets into a locked page over correct code, press `Ctrl+R` in the terminal running `dotnet watch` and try again.

### Where a stranger goes

Sign out, open DevTools on the **Network** tab, and click a locked link. You land on the sign-in page, and the first request in the list is a **`302`** whose `location` header says:

```
/Account/Login?ReturnUrl=%2FTrucks%2FCreate
```

You never told it where the sign-in page is. `AddIdentity` sends people to `/Account/Login` unless you configure otherwise — which is why the controller is called `Account` and the action is called `Login`. `ReturnUrl` is the page they wanted, and Part 5's `LocalRedirect` takes them there once they've signed in.

### Signed in is not trusted

**Anyone can create an account.** All it takes is an email address. So this week's lock keeps out visitors who haven't signed in — not strangers who have. That's deliberate: week 12 is roles, where the lock asks *who* you're signed in as. It's the same known-debt rhythm as week 6's forms: named now, paid next week.

### Your app's public half

Not every write belongs behind the lock. In the lab, the Registry's creatures are its curated archive — a member edits them — but **anyone can file a sighting**, signed in or not, so `SightingsController` gets no `[Authorize]` at all. The general rule is *writes need an account, reads are public*; if your second table is something the public submits, leave its controller open and say so in your README. Use the split you wrote down for week 10's reading.

---

## Part 7: Customizing the user

### A property of your own

This is `Models/AppUser.cs` as it ends the week:

```csharp
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Curbside.Models;

// Curbside's own user. IdentityUser already has the email, the password
// hash and everything else sign-in needs; what is added here is Curbside's.
public class AppUser : IdentityUser
{
    // What the navbar calls you. A new column on AspNetUsers.
    [StringLength(40)]
    public string DisplayName { get; set; } = "";
}
```

`AspNetUsers` is an ordinary table, so a new property is a new column, and a new column is a migration:

```bash
dotnet ef migrations add AddDisplayName
dotnet ef database update
```

The migration is one `AddColumn` on `AspNetUsers`, with `defaultValue: ""`. As SQL it's:

```sql
ALTER TABLE [AspNetUsers] ADD [DisplayName] nvarchar(40) NOT NULL DEFAULT N'';
```

**Every account that existed before the migration gets an empty string.** Then `Ctrl+R` — a new column, the same restart as Part 2.

### The navbar looks you up

The cookie says *who* is signed in, but not their display name — that's a column. So the partial asks `UserManager` for the user and reads it. This is the whole of `Views/Shared/_LoginPartial.cshtml` as it ends the week:

```cshtml
@using Microsoft.AspNetCore.Identity
@inject UserManager<AppUser> UserManager

<ul class="navbar-nav">
@if (User.Identity?.IsAuthenticated == true)
{
    var user = await UserManager.GetUserAsync(User);
    var name = string.IsNullOrEmpty(user?.DisplayName) ? User.Identity.Name : user.DisplayName;
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
        <a class="nav-link" asp-controller="Account" asp-action="Register">Create an account</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" asp-controller="Account" asp-action="Login">Sign in</a>
    </li>
}
</ul>
```

`@inject` hands the view a `UserManager`, the same way a constructor hands one to a controller. `GetUserAsync(User)` turns the cookie into the row.

**The fallback line is week 10's empty state in a new place.** An account made before the column existed has an empty `DisplayName`, and without the fallback its navbar reads *Signed in as* and nothing. With it, a user with no display name sees their email instead.

### On the form

Three small edits put it on registration. `ViewModels/RegisterViewModel.cs`, under `Email`:

```csharp
[Required]
[Display(Name = "What should we call you?")]
[StringLength(40, MinimumLength = 2)]
public string DisplayName { get; set; } = "";
```

`Views/Account/Register.cshtml`, between the Email block and the Password block:

```cshtml
<div class="mb-3">
    <label asp-for="DisplayName" class="form-label"></label>
    <input asp-for="DisplayName" class="form-control" />
    <span asp-validation-for="DisplayName" class="text-danger"></span>
</div>
```

And in `Controllers/AccountController.cs`, the Register POST, the line that makes the new user:

```csharp
var user = new AppUser { UserName = form.Email, Email = form.Email, DisplayName = form.DisplayName };
```

**Add the property before the box.** A view that says `asp-for="DisplayName"` while the ViewModel has no `DisplayName` doesn't compile: `CS1061: 'RegisterViewModel' does not contain a definition for 'DisplayName'`.

`[StringLength]` on the ViewModel is a rule you typed, so the form refuses a one-letter name in the browser and on the server.

---

## Part 8: Your own app

The moves are the same six; only the names change.

| | Curbside | Your app |
|---|---|---|
| user class | `AppUser` | `Hiker`, `Member`, `Fan` — yours |
| your property | `DisplayName` | a trail name, a handle, a home park — something your app would show |
| locked controller | `TrucksController` (and Dishes, Specials) | the controller behind your list page, and any other that writes |
| open actions | `Index`, `Details` | the same two, on each locked controller |
| public half | none | your second table, if the public submits it |

The register and sign-in pages stay at **`/Account/Register`** and **`/Account/Login`** — the framework's default, and where the self-check looks for them.

**Deploying:** the migration has to reach the database before the code that needs it, exactly as in week 9. Your deployed app and your local one use the same school database, so `dotnet ef database update` from your project folder, **then** `az webapp up`. The other way round, every page that touches `AspNetUsers` throws `Invalid object name`.

---

## Part 9: What Microsoft's tutorials do differently

Search for ASP.NET Core Identity and most of what you find uses the **default Identity UI**: a package (`Microsoft.AspNetCore.Identity.UI`) whose register, sign-in and account pages live inside the package, at `/Identity/Account/Login`, written as Razor Pages rather than controllers. To change one — to add a field to registration, say — you *scaffold* it into your project with `dotnet aspnet-codegenerator identity`, and edit the generated file.

That's a fine way to build a real site, and it does things this course's `AccountController` doesn't: email confirmation, password reset, two-factor sign-in, external logins. This course writes the controller instead because every line of it is a shape you've built since week 6, so you can read all of it. The Identity underneath — `UserManager`, `SignInManager`, the tables, the cookie, `[Authorize]` — is identical either way.

### Why every app keeps its own users

Curbside, the Registry and your own app each keep their users in their own database. It's tempting to point all three at one shared users database, so one account works everywhere. It wouldn't — not on its own:

- **Sharing the users isn't sharing the sign-in.** Each app sets its own cookie, on its own site, encrypted with its own keys. A user who existed in all three would still sign in to each one separately.
- **Roles would leak between apps.** `AspNetRoles` is one table, so a *Curator* in one app would be a *Curator* in all of them.
- **Three apps would be migrating one set of tables**, and one of them changing the schema can break the other two.

Real sites that share sign-in across several applications — *Sign in with Microsoft*, *Sign in with Google*, one company login for every internal tool — don't share a database. They use an **identity provider**: one service that signs people in and tells each app who they are, using a standard called OpenID Connect. Each app still keeps its own data, and still decides for itself what a signed-in user may do there.

---

## Troubleshooting

**Every page fails, the home page included, with `The entity type 'IdentityPasskeyData' requires a primary key to be defined`**
- `base.OnModelCreating(modelBuilder);` is missing from the top of `OnModelCreating`. [Part 2](#the-context).

**`The type or namespace name 'IdentityDbContext<>' could not be found`**
- `using Microsoft.AspNetCore.Identity.EntityFrameworkCore;` at the top of the context file — or the package isn't installed.

**`dotnet watch` is asking `Do you want to restart your app?` and nothing has changed on the page**
- Answer `a`. It asks once per `watch` session; if it keeps asking, you've been restarting with `Ctrl+C` — use `Ctrl+R`. [Part 2](#the-restart-and-the-question-it-asks).

**`The view 'Register' was not found`, and the file is right there**
- The same prompt, unanswered, in the terminal running `dotnet watch`. Answer `a`. Don't move the file.

**A page fails right after `database update`, naming `AspNetUsers` or your new column**
- The app is still running the model from before the migration. `Ctrl+R` in the terminal running `dotnet watch`.

**`Invalid object name 'AspNetUsers'` on the deployed site, while localhost is fine**
- The migration never reached the database the deployed app uses. `dotnet ef database update`, then deploy again. [Part 8](#part-8-your-own-app).

**A registration is refused and the page says nothing**
- The `foreach` that copies `result.Errors` into `ModelState` is missing, or the summary is `asp-validation-summary="ModelOnly"`. Use `"All"`. [Part 3](#the-controller).

**`Passwords must have …`**
- Identity's default rules, working. Use an uppercase letter, a digit and a symbol. [Part 3](#identitys-own-rules).

**`Username '…' is already taken.`**
- That email already has an account. It worked the first time.

**The navbar never changes**
- `<partial name="_LoginPartial" />` isn't in `_Layout.cshtml`, or it's outside the navbar's `<div>`. [Part 5](#the-navbar).

**Sign out does nothing, or gives a `405`**
- The partial's form and the `Logout` action disagree about the verb: both must be POST. [Part 5](#two-rules-for-a-sign-in-form).

**Signed out, a locked page still opens**
- `[Authorize]` isn't on the controller class, or hot reload hasn't applied it. `Ctrl+R`. [Part 6](#lock-the-controller-open-the-reads).

**The navbar says *Signed in as …* and locked pages still send you to sign in**
- `app.UseAuthentication();` is below `app.UseAuthorization();` in `Program.cs`. Swap them. [Part 2](#programcs).

**Signed out, your list page or a details page sends you to sign in**
- `[AllowAnonymous]` is missing from `Index` or `Details`.

**`NullReferenceException` in `_LoginPartial`**
- The partial reads `user.DisplayName` without the `?`. Use `user?.DisplayName` — `GetUserAsync` returns null when the signed-in account no longer exists.

**The navbar says *Signed in as* and nothing after it**
- Your account is older than the column. [The fallback line](#the-navbar-looks-you-up).

**`The Entity Framework tools version … is older than that of the runtime`**
- A warning, not an error: the Identity package brought a newer EF Core than your `dotnet ef` tool. The command still did its job — read the line after it.
