# Week 11 Homework

**Topic:** your application learns who its visitors are.
**Due:** before the start of Week 12's class.
**Submit via Canvas:** your **Azure URL** + your **GitHub repo URL**.

## Part 1 — Finish the Registry lab (nobody collects this)

All six checks green:

```bash
dotnet test Cryptids.Checks
```

```
Test Run Successful.
Total tests: 6
     Passed: 6
```

If class ended at check 5, check 6 is the field name — [Task 6 in full](lab/README.md#task-6-in-full).

> [!IMPORTANT]
> This isn't submitted and it isn't worth points. It's the same six moves Part 2 asks you to make on your own app, with every file handed to you. Doing it first is what turns Part 2 into an hour.

## Part 2 — Your semester project gets accounts (graded)

Same app you've been building since week 4. Since week 6 anyone with your URL could change your data; this week a change needs an account.

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work.** Every requirement below links to the section that shows it done, and the [troubleshooting section](lecture-notes.md#troubleshooting) names this week's specific errors.

> [!TIP]
> **Commit as you go, the way you have since week 3.** Three of tonight's twenty points are the history itself, and they're all-or-nothing: fewer than three commits scores zero. One commit per requirement you finish is the natural rhythm.

### Clear the yellow warnings first

Since week 9, every build of your app has probably printed yellow `NU1902` / `NU1903` warnings about `System.Security.Cryptography.Pkcs` — a package the SQL Server package brings in, with known security problems in the version it asks for. A fixed version exists. From the folder with your `.csproj`, once:

```bash
dotnet add package System.Security.Cryptography.Pkcs --version 10.0.13
```

Your version wins over the old one, and the warnings stop — along with the `msbuild: [Failure]` lines and the VS Code pop-up that came with them. One line appears in your `.csproj`; commit it like any other change. Already added it from week 9's 🆘 Stuck? Skip this.

### Swap the self-check over

Open `Views/Home/Index.cshtml`, find the **week-10** line, and **replace it**:

```html
@section Scripts {
    <script src="https://jgrissom.github.io/dotnet-web-dev/week-11/homework-checks.js"></script>
}
```

> [!CAUTION]
> **Replace it. Don't add a second one.** Last week's script still works, and that's the trap: it checks *last week's* requirements. **The tell is the first line of the report** — this week's says **`Week 11`** and scores out of **14 points**. If both are installed, this week's prints a red 🚨 above the score.

> [!WARNING]
> **Nothing runs when the page loads.** Type `recheck()` in the console when you want it to run, because it does two things to your site that you should know about first:
>
> - **It creates one account**, `week11-selfcheck@example.com`, and every run after the first **reuses** it. Delete it by hand in the mssql panel (`AspNetUsers`) if you want it gone.
> - **It signs your browser out.** It signs its own account in and out to test your login, so when it finishes you're signed out — even if you were signed in as yourself. Sign back in when it's done.

### Then build it

1. **Identity goes in.** The package, a user class of your own that inherits `IdentityUser` — empty for now — your context inheriting `IdentityDbContext<YourUser>` with `base.OnModelCreating(modelBuilder);` at the top of `OnModelCreating`, and `AddIdentity` plus `UseAuthentication()` in `Program.cs`. → [Identity goes in](lecture-notes.md#part-2-identity-goes-in)
2. **A migration that creates Identity's tables**, applied. It's additive — on top of the migrations you already have. Read it before you apply it: find `PasswordHash`, and find that there's no password column.
3. **A register page at `/Account/Register`.** An `AccountController` with a Register pair, a `RegisterViewModel` with `Email`, `Password` and `ConfirmPassword`, and `Views/Account/Register.cshtml`. A refused registration has to say why on the page. → [Registering](lecture-notes.md#part-3-registering)
4. **Sign in, sign out, and a navbar that knows which.** The Login pair at `/Account/Login`, a `[HttpPost]` Logout, `Views/Shared/_LoginPartial.cshtml`, and the one `<partial>` line in `_Layout.cshtml`. **Sign out is a form, never a link.** → [Signing in and out](lecture-notes.md#part-5-signing-in-and-out)
5. **`[Authorize]` on the class of every controller that changes your data**, with `[AllowAnonymous]` on its `Index` and `Details`. Use the split you wrote down for week 10's reading. Reading stays public; if your second table is something the public submits, its controller can stay open. → [`[Authorize]`](lecture-notes.md#part-6-authorize)
6. **A property of your own on your user class** — a display name, a handle, something your app would show — with its migration, a box for it on the register form, and the navbar showing it, falling back to the email when it's empty. → [Customizing the user](lecture-notes.md#part-7-customizing-the-user)
7. **Everything from weeks 4–10 still works**, deployed to Azure, with **3+ meaningful commits** in your public repo.

> [!IMPORTANT]
> **Restart after every `dotnet ef database update` — `Ctrl+R` in the terminal running `dotnet watch`.** EF Core works out your tables once, when the app starts. And when `dotnet watch` first asks *Do you want to restart your app?* — it will, at requirement 1's context edit — answer **`a`**.

### Your app isn't mine

Nothing above says what your user class is called or what's in it. The self-check doesn't know either. It finds your list page from your navbar, the way it has since week 4, and your forms at `/<YourThing>/Create`, `/<YourThing>/Edit/<id>` and `/<YourThing>/Delete/<id>`, the way they've been since week 8. Your register and sign-in pages stay at **`/Account/Register`** and **`/Account/Login`** — the framework's own default, and the reason the controller is called `Account`.

## Part 3 — Check it as you go ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with.** It creates an account through your register form, signs it in and out, and tries your locked pages both ways — signed out, and signed in.

> [!IMPORTANT]
> **Run it as you go.** It reports all nine checks every time, and marks the ones it can't reach yet ⬜ instead of failing them — so a half-built app tells you *where you are*, not that you're broken. While anything is red, the report ends with one `👉 Next:` line naming the next thing to build.
>
> **Fixing things on localhost is much cheaper than fixing them on Azure**, which is why the tag goes in now. Then run it once more on your **deployed URL before you submit** — that's the run that counts.

**After each requirement, here is what moves.** Measured on a sample app built one requirement at a time:

| After requirement | What changes in the report |
|---|---|
| **1–2** — Identity and its migration | **nothing yet** — 1 of 14. Your user class and your tables live in your repo; I read those there |
| **3** — register | **4 of 14** — the form is found, and an account can be created |
| **4** — sign in and out | **8 of 14** — the navbar knows, and sign-out, a wrong password and sign-in all work |
| **5** — `[Authorize]` | **12 of 14** — strangers are sent to sign in, and a signed-in visitor gets in |
| **6** — your own property | **14 of 14** |
| **7** — deployed | run it once more on your Azure URL. That is the run I grade |

**You installed the tag in Part 2.** Run your app **locally** (`dotnet watch`), load your home page, open the console — **F12 → Console** — and type **`recheck()`**:

```
🔎 Week 11 self-check — https://tg-web-xx1234.azurewebsites.net

✅  1 pts  anyone can still read your list and a record's page — /Trails
✅  1 pts  there's a registration form at /Account/Register — 4 fields
✅  2 pts  a visitor can create an account — week11-selfcheck@example.com
✅  2 pts  signed in, the navbar says so — and the way out is a form
✅  2 pts  sign out, sign back in — and a wrong password is refused
✅  3 pts  a stranger can't change your data — /Trails Create, Edit and Delete all ask for an account
✅  1 pts  signed in, your form opens — /Trails/Create
✅  1 pts  it asks for something of your own — TrailName
✅  1 pts  the navbar knows the name you registered with — "Week 11 Test"

📋 9 of 9 checks green · 14 of 14 points  (controller: /Trails)
```

> [!TIP]
> **If "a stranger can't change your data" names a POST**, your `[Authorize]` is on the GET actions instead of the class. That hides the forms and leaves the POSTs open — and a form isn't the only way to send one.

> [!TIP]
> **If "signed in, your form opens" fails while your navbar says you're signed in**, `app.UseAuthentication();` is below `app.UseAuthorization();` in `Program.cs`. Swap them.

> [!TIP]
> **Working offline?** Save [`homework-checks.js`](homework-checks.js) into your `wwwroot` folder and point the tag at it locally: `<script src="/homework-checks.js"></script>` — still inside the `@section Scripts` block.

*(If you happen to have Node installed, `node homework-checks.js <url>` does the same thing from a terminal. You don't need it.)*

**14 of the 20 points are in that script.** The other 6 I read out of your repo — see the rubric.

## Part 4 — Deploy it (graded)

**Migrate first, deploy second.** Your deployed app and your local one use the same school database, so from inside your web project folder:

```bash
dotnet ef database update
```

**Then** deploy:

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

Use your own app's name and region — the ones you have deployed to all term. ⚠️ **Keep `--os-type Linux` and `--runtime DOTNETCORE:10.0`.** Without them `az webapp up` assumes Windows and the newest .NET it knows, and refuses to deploy to your Linux app.

⚠️ **The order matters.** New code on an old schema throws `Invalid object name 'AspNetUsers'` on every page that touches it. If your deployed site 500s while localhost is fine, that's the first thing to check.

Then run the self-check on your Azure URL. That is the run I grade.

## 🆘 Stuck?

- **Every page fails, the home page included, with `The entity type 'IdentityPasskeyData' requires a primary key to be defined`** — `base.OnModelCreating(modelBuilder);` is missing. [The context](lecture-notes.md#the-context).
- **`dotnet watch` is asking `Do you want to restart your app?`** — answer `a`. If it keeps asking, you're restarting with `Ctrl+C`; use `Ctrl+R`. [The restart](lecture-notes.md#the-restart-and-the-question-it-asks).
- **`The view 'Register' was not found`, and the file is right there** — the same prompt, waiting in the terminal running `dotnet watch`. Answer `a`. Don't move the file.
- **A page fails right after `database update`** — `Ctrl+R` in the terminal running `dotnet watch`. EF Core builds its model once, at startup.
- **A registration is refused and the page says nothing** — the `foreach` that copies `result.Errors` into `ModelState` is missing, or the summary says `ModelOnly`. [The controller](lecture-notes.md#the-controller).
- **`Passwords must have …`** — Identity's default rules: an uppercase letter, a digit and a symbol. [Identity's own rules](lecture-notes.md#identitys-own-rules).
- **The navbar never changes** — the `<partial name="_LoginPartial" />` line isn't in `_Layout.cshtml`. [The navbar](lecture-notes.md#the-navbar).
- **Signed out, a locked page still opens over a correct `[Authorize]`** — hot reload can report an attribute as applied when it isn't. `Ctrl+R`.
- **The navbar says you're signed in, and locked pages still send you to sign in** — `UseAuthentication()` is below `UseAuthorization()`. [Program.cs](lecture-notes.md#programcs).
- **The navbar says *Signed in as* and nothing after it** — your account is older than your new column. [The fallback](lecture-notes.md#the-navbar-looks-you-up).
- **`The Entity Framework tools version … is older than that of the runtime`** — a warning, not an error. The command still worked.
- **Yellow `NU1902` / `NU1903` warnings about `System.Security.Cryptography.Pkcs`** — the advisory from weeks 9 and 10, not your code, and one command clears it. [Clear the yellow warnings first](#clear-the-yellow-warnings-first).
- **The deployed site throws `Invalid object name 'AspNetUsers'`** — migrate, then deploy. Part 4.
- **The self-check banner says Week 10** — last week's script is still installed. This week's line replaces it.
- **You're signed out and didn't sign out** — the self-check did, on purpose. Sign back in.

## 📊 Grading (20 pts)

| What | Pts | Where it comes from |
|---|---|---|
| Anyone can still read your list and a record's page | 1 | deployed URL |
| A registration form at `/Account/Register` | 1 | deployed URL |
| A visitor can create an account | 2 | deployed URL |
| Signed in, the navbar says so — and the way out is a form | 2 | deployed URL |
| Sign out, sign back in — and a wrong password is refused | 2 | deployed URL |
| **A stranger can't change your data** | 3 | deployed URL |
| Signed in, your form opens | 1 | deployed URL |
| It asks for something of your own | 1 | deployed URL |
| The navbar knows the name you registered with | 1 | deployed URL |
| A user class of your own, with a property of its own | 1 | your repo |
| Your context is an `IdentityDbContext` of that user | 1 | your repo |
| A migration that creates `AspNetUsers` | 1 | your repo |
| 3+ meaningful commits | 3 | your repo |
| **Deductions:** dead submitted URL | −2 | |

*The 3-point line is the week. It sends an empty POST to your Create action while signed out, because a lock on the GET alone hides the form and leaves the door open.*

*Reminder: the explain-it standard applies. The ones I'll reach for: "where is your password stored?", "why is Sign out a form and not a link?", "why does `[Authorize]` go on the class?", and "who can still change your data, and what fixes that?"*

## 📖 Reading for next week (~10 min)

Week 12 is **roles, claims and securing the application**.

- **Who can change your data right now?** Anyone who makes an account. Write down who *should* be able to — one person, a few, a kind of user — and which pages that applies to. Bring it.
- Open the `AspNetRoles` table in the mssql panel. It's been there since requirement 2, and it's empty. Roles are next week's subject.
