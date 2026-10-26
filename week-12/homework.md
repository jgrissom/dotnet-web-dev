# Week 12 Homework

**Topic:** your application learns *which* visitors may change it.
**Due:** before the start of Week 13's class.
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

If class ended at check 5, check 6 is the claims page — [Task 6 in full](lab/README.md#task-6-in-full).

> [!IMPORTANT]
> This isn't submitted and it isn't worth points. It's the same moves Part 2 asks you to make on your own app, with every file handed to you. Doing it first is what turns Part 2 into an hour.

## Part 2 — Your semester project gets a role (graded)

Same app you've been building since week 4. Since week 11 a change needs an account — and anyone can make one. This week a change needs a **role**, one that only you hand out.

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work.** Every requirement below links to the section that shows it done, and the [troubleshooting section](lecture-notes.md#troubleshooting) names this week's specific errors.

> [!TIP]
> **Commit as you go, the way you have since week 3.** Three of tonight's twenty points are the history itself, and they're all-or-nothing: fewer than three commits scores zero. One commit per requirement you finish is the natural rhythm.

### Swap the self-check over first

Open `Views/Home/Index.cshtml`, find the **week-11** line, and **replace it**:

```html
@section Scripts {
    <script src="https://jgrissom.github.io/dotnet-web-dev/week-12/homework-checks.js"></script>
}
```

> [!CAUTION]
> **Replace it. Don't add a second one.** Last week's script still works, and that's the trap: it checks *last week's* requirements, and every one of them still passes. **The tell is the first line of the report** — this week's says **`Week 12`** and scores out of **14 points**. If both are installed, this week's prints a red 🚨 above the score.

> [!WARNING]
> **Nothing runs when the page loads.** Type `recheck()` in the console when you want it to run, because:
>
> - **It signs in as week 11's self-check account**, `week11-selfcheck@example.com`, which your site already has if you ran last week's check. If it doesn't, it makes it, once. **Never give that account your role** — it's the visitor *without* the role that this check needs.
> - **It signs your browser out.** You'll very likely be signed in as your own admin when you run it; it signs you out first, and leaves you signed out. Sign back in when it's done.
> - ⚠️ **It cannot see your admin succeed.** It doesn't know your admin's email or password, and it never should. It checks that everyone *else* is refused. Signing in as yourself and making a change is requirement 5, and it's yours to do.

### Then build it

1. **A role on the lock.** On every controller that changes your data, week 11's `[Authorize]` becomes **`[Authorize(Roles = "YourRole")]`** — still on the class, with `[AllowAnonymous]` still on `Index` and `Details`. Pick a role name that says what that person does in your app, and use it everywhere. If your second table is something the public submits, its controller stays open. → [A role on the lock](lecture-notes.md#part-2-a-role-on-the-lock)
2. **An AccessDenied page** at `/Account/AccessDenied` — the view first, then an `AccessDenied()` action on your `AccountController`. It says who that part of your site is for. → [The AccessDenied page](lecture-notes.md#part-3-the-accessdenied-page)
3. **Who gets the role, from configuration.** A `Data/RoleSeeder.cs` that creates your role if it's missing and gives it to the user whose email is in **`Admin:Email`**, and the three lines in `Program.cs` that run it at startup. Set the secret locally with **your own email** — `dotnet user-secrets set "Admin:Email" "you@example.com"` — register with that email if you haven't, restart, then **sign out and back in**. No email and no password in your code. → [Who gets the role](lecture-notes.md#part-4-who-gets-the-role)
4. **Hide what visitors can't use.** Every write button on your list and your record pages goes inside `@if (User.IsInRole("YourRole")) { … }`. A public action's button stays outside it. → [Hide what you can't use](lecture-notes.md#part-6-hide-what-you-cant-use)
5. **Deployed, with your admin working there.** `Admin__Email` as an app setting on Azure, then — signed in on your deployed site as yourself — **make one change**. Say in your README what your role is called and who it's for. Everything from weeks 4–11 still works, and **3+ meaningful commits** are in your public repo. → [On Azure](lecture-notes.md#on-azure)

> [!IMPORTANT]
> **A new role reaches you the next time you sign in.** Your sign-in cookie carries your roles, and it was made before the seeder gave you one. Restart, then **sign out and sign back in** — on your machine in requirement 3, and again on Azure in requirement 5. And when `dotnet watch` first asks *Do you want to restart your app?* — it will, at requirement 2's new view — answer **`a`**.

### Your app isn't mine

Nothing above says what your role is called or which controllers you lock. The self-check doesn't know either. It finds your list page from your navbar, the way it has since week 4, and your forms at `/<YourThing>/Create`, `/<YourThing>/Edit/<id>` and `/<YourThing>/Delete/<id>`, the way they've been since week 8. Your AccessDenied page stays at **`/Account/AccessDenied`** — the framework's own default, next to `/Account/Login`.

## Part 3 — Check it as you go ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with.** It looks at your site twice: as a visitor who isn't signed in, and as a visitor who is signed in **without** your role.

> [!IMPORTANT]
> **Run it as you go.** It reports all six checks every time, and marks the ones it can't reach yet ⬜ instead of failing them — so a half-built app tells you *where you are*, not that you're broken. While anything is red, the report ends with one `👉 Next:` line naming the next thing to build.
>
> **Fixing things on localhost is much cheaper than fixing them on Azure**, which is why the tag goes in now. Then run it once more on your **deployed URL before you submit** — that's the run that counts.

**After each requirement, here is what moves.** Measured on a sample app built one requirement at a time:

| After requirement | What changes in the report |
|---|---|
| **before you start** — week 11's app | **4 of 14** — reading is public, strangers are sent to sign in, and the check can sign in. Every write still lets that signed-in visitor in |
| **1** — the role on the lock | **8 of 14** — a signed-in visitor without your role is refused everything |
| **2** — AccessDenied | **11 of 14** — and lands on a page of your own, not your Missing page |
| **3** — the seeder | **still 11** — nothing changes from outside; I read the seeder in your repo. Check it yourself: sign out, sign in, make a change |
| **4** — hidden buttons | **14 of 14** |
| **5** — deployed | run it once more on your Azure URL. That is the run I grade |

**You installed the tag in Part 2.** Run your app **locally** (`dotnet watch`), load your home page, open the console — **F12 → Console** — and type **`recheck()`**:

```
🔎 Week 12 self-check — https://tg-web-xx1234.azurewebsites.net

✅  1 pts  anyone can still read your list and a record's page — /Trails
✅  2 pts  a visitor who isn't signed in is still sent to sign in — /Trails Create, Edit and Delete
✅  1 pts  the self-check can sign in — as week11-selfcheck@example.com, week 11's account
✅  4 pts  signed in without your role, every change is refused — /Trails Create, Edit, Delete and a POST
✅  3 pts  the refusal lands on a page of your own — /Account/AccessDenied
✅  3 pts  nobody without your role sees a button for a change — /Trails and /Trails/Details/1

📋 6 of 6 checks green · 14 of 14 points  (controller: /Trails)
```

> [!TIP]
> **If "every change is refused" names a POST**, your role is on the GET actions instead of the class. That hides the forms and leaves the POSTs open — and a form isn't the only way to send one.

> [!TIP]
> **If "every change is refused" fails and you're sure the attribute is right**, check you didn't give your role to `week11-selfcheck@example.com`. It has to be your own email.

> [!TIP]
> **Working offline?** Save [`homework-checks.js`](homework-checks.js) into your `wwwroot` folder and point the tag at it locally: `<script src="/homework-checks.js"></script>` — still inside the `@section Scripts` block.

*(If you happen to have Node installed, `node homework-checks.js <url>` does the same thing from a terminal. You don't need it.)*

**14 of the 20 points are in that script.** The other 6 I read out of your repo — see the rubric.

## Part 4 — Deploy it (graded)

**No migration this week** — your roles tables came with week 11's. So it's deploy, then the app setting:

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

```bash
az webapp config appsettings set --name your-app-XX1234 \
  --resource-group <YOUR-RESOURCE-GROUP> \
  --settings Admin__Email="you@example.com"
```

Use your own app's name, region and resource group — the ones you've used all term. ⚠️ **Keep `--os-type Linux` and `--runtime DOTNETCORE:10.0`.** **Two underscores** in `Admin__Email`, the same as `ConnectionStrings__DefaultConnection` in week 7.

**Setting it restarts your app**, and the restart is when the seeder runs. Give the free tier its 30 seconds. Then, on your deployed site: register with that email if that account isn't there yet, **sign out, sign back in, and make one change.** That's requirement 5, and it's the only proof your admin works — the self-check can't see it.

*(Registered on Azure after the restart? The seeder already ran without you. Run `az webapp restart --name your-app-XX1234 --resource-group <YOUR-RESOURCE-GROUP>`, then sign out and back in.)*

Then run the self-check on your Azure URL. That is the run I grade.

## 🆘 Stuck?

- **The app stops before `Now listening on:` with `The ConnectionString property has not been initialized`** — your connection string secret is missing (a frozen lab PC wipes it). From this week the app reads the database as it starts. [Running it at startup](lecture-notes.md#running-it-at-startup).
- **You're in `AspNetUserRoles`, and still refused** — your cookie is older than your role. Sign out and back in. [The role is read when you sign in](lecture-notes.md#part-5-the-role-is-read-when-you-sign-in).
- **Signed out and in again, and still refused** — the role's name differs between the attribute and the seeder, the key isn't exactly `Admin:Email`, or `dotnet user-secrets list` shows a different email from the one you registered with. Then `Ctrl+R` — the seeder only runs at startup. [The seeder](lecture-notes.md#the-seeder).
- **A signed-in visitor without your role still gets the form, over a correct attribute** — hot reload can report an attribute as applied when it isn't. `Ctrl+R` in the terminal running `dotnet watch`.
- **Refused visitors land on your Missing page, at `/Account/AccessDenied`** — there's no `AccessDenied()` action yet. [The AccessDenied page](lecture-notes.md#part-3-the-accessdenied-page).
- **A `500` with `The view 'AccessDenied' was not found`, and the file is right there** — `dotnet watch` is asking `Do you want to restart your app?`. Answer `a`. Don't move the file.
- **Your own buttons disappeared too** — the name in `User.IsInRole("…")` doesn't match your role, or you haven't signed in again since you got it.
- **Localhost works, and on Azure you're refused** — Azure doesn't read user secrets. The `Admin__Email` app setting, two underscores, then sign out and back in on the deployed site. [On Azure](lecture-notes.md#on-azure).
- **Yellow `NU1902` / `NU1903` warnings about `System.Security.Cryptography.Pkcs`** — the advisory week 9's homework fixed. If your app still shows them, from the folder with your `.csproj`, once: `dotnet add package System.Security.Cryptography.Pkcs --version 10.0.13`. One line appears in your `.csproj`; commit it.
- **The self-check banner says Week 11** — last week's script is still installed. This week's line replaces it.
- **You're signed out and didn't sign out** — the self-check did, on purpose. Sign back in.

## 📊 Grading (20 pts)

| What | Pts | Where it comes from |
|---|---|---|
| Anyone can still read your list and a record's page | 1 | deployed URL |
| A visitor who isn't signed in is still sent to sign in | 2 | deployed URL |
| The self-check can sign in — as someone without your role | 1 | deployed URL |
| **Signed in without your role, every change is refused** | 4 | deployed URL |
| The refusal lands on a page of your own | 3 | deployed URL |
| Nobody without your role sees a button for a change | 3 | deployed URL |
| `[Authorize(Roles = "…")]` on a controller class | 1 | your repo |
| A seeder that creates your role and gives it out with `AddToRoleAsync` | 1 | your repo |
| The email it gives the role to comes from configuration, not your code | 1 | your repo |
| 3+ meaningful commits | 3 | your repo |
| **Deductions:** dead submitted URL | −2 | |

*The 4-point line is the week. It signs in as an account with no role and tries every write, including an empty POST to Create, because a role on the GET alone hides the form and leaves the door open.*

*Reminder: the explain-it standard applies. The ones I'll reach for: "who can change your data now, and how did they get that?", "you had the role and were still refused — why?", "if you hide the button, why do you still need the attribute?", and "where is your admin's email, and why not in your code?"*

## 📖 Reading for next week (~10 min)

Week 13 is the **flex week**: dependency injection and services, `TempData`, and paging, filtering and search.

- **Your list page — how long is it now?** Count the records. Write down how long it would be with a hundred times as many, and what a visitor would want to do on it first: search, filter, or page through.
- Open one of your controllers and find the `_context` it's handed in its constructor. Week 13 asks where that comes from.
