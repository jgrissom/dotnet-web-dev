# Week 7 Homework

**Due:** before the start of Week 8's class.
**Submit via Canvas:** your **Azure URL** + your **GitHub repo URL**.

## Part 1 — Finish the Registry lab (nobody collects this)

All six checks green:

```bash
dotnet test Cryptids.Checks
# Passed! - Failed: 0, Passed: 6 ...
```

If class ended at check 5, that's `Add` and `SaveChanges` — [two lines and one deletion](lab/README.md#task-6-in-full).

> [!IMPORTANT]
> This isn't submitted and it isn't worth points. It's the guided version of the exact moves Part 2 asks you to make on your own app. Doing it first is what turns Part 2 into an hour.

> [!WARNING]
> **6/6 does not mean your connection string works.** The lab's checks run against an in-memory database on purpose, so they work with no network. Load `/Cryptids` in a browser and count six creatures — that's the part that proves you reached SQL Server.

## Part 2 — Your semester project gets a database (graded)

Same app you've been building since week 4. Its list has been a `static List<T>` for four weeks. This week it becomes a table.

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work.** Every requirement below links to the section that covers it, and the [troubleshooting appendix](lecture-notes.md#appendix-troubleshooting) names tonight's specific errors — including the silent one, where the form works perfectly and saves nothing.

It needs:

1. **[The two packages](lecture-notes.md#two-packages)** — `Microsoft.EntityFrameworkCore.SqlServer` and `Microsoft.EntityFrameworkCore.Design`, added from inside your web project folder. *(The lab handed these to you; here you run them yourself.)*
2. **[A `DbContext`](lecture-notes.md#the-dbcontext)** in a new `Data/` folder — a class deriving from `DbContext`, with a `DbSet<YourThing>` property and a constructor that takes `DbContextOptions`.
3. **[Your seed data on the model](lecture-notes.md#the-table-is-empty)** — the items that were in your `YourThingData.cs`, moved into `OnModelCreating` with `HasData`, **each with an explicit `Id`**. Keep the same ids they had, so existing details links still work.
4. **[A connection string in user secrets](lecture-notes.md#where-the-connection-string-lives)** — `dotnet user-secrets init` then `dotnet user-secrets set "ConnectionStrings:DefaultConnection" "..."`, using your own account on the school server. **Not in `appsettings.json`** — your repo is public. Commit the `<UserSecretsId>` line that `init` adds to your `.csproj`. **Yes, you already did this in the lab — do it again here.** [Secrets are stored per application](lecture-notes.md#what-those-two-commands-actually-did), so the lab's app and this one keep separate stores even on the same laptop.
5. **[Its own database](lecture-notes.md#naming-your-database)** — one per application, so **not** the `Cryptids_##_AAA` you used in the lab. Name yours after this app: `YourAppName_##_AAA`, with the course number and your initials. It doesn't exist until your first `dotnet ef database update`, which creates it.
6. **[The registration](lecture-notes.md#one-registration)** — one `AddDbContext` call in `Program.cs`, with `UseSqlServer`, reading the connection string **from configuration** rather than a string typed into the file.
7. **[A migration](lecture-notes.md#writing-a-model-doesnt-create-a-table)**, generated and applied: `dotnet ef migrations add InitialCreate` then `dotnet ef database update`. The `Migrations/` folder gets committed.
8. **[The controller reads and writes through the context](lecture-notes.md#asking-for-the-context)** — injected in the constructor, `ToList()` in your index, `FirstOrDefault` in your details, and **[`Add` + `SaveChanges()`](lecture-notes.md#writing)** in your POST.
9. **[The old static list class is deleted](lecture-notes.md#the-line-you-delete)**, along with the line that assigned an `Id` by hand.
10. **Everything from weeks 4–6 still works** — the nav link, the list, the details pages, the shared shell, your theme, the Create form and its validation.
11. **Deployed to Azure**, and **3+ meaningful commits** in your public GitHub repo.

### Your model isn't mine

The lab's `Cryptid` won't transfer, but the moves do. A few translations:

| If your model has | Expect |
|---|---|
| a `[StringLength(60)]` string | `nvarchar(60)` in the migration — your week-6 rule, as a column |
| a `[Required]` string with no `[StringLength]` | `nvarchar(max)` — nothing said how long it could be |
| a `double` | `float` in SQL Server. That's just its name for it |
| a `decimal` for money | it'll warn about precision; `[Column(TypeName = "decimal(18,2)")]` settles it |
| a `DateTime` | `datetime2`. Seed it with `new DateTime(2024, 5, 1)`, not `DateTime.Now` — seed data has to be the same every time |
| a `bool` | `bit` |

> [!CAUTION]
> **The compiler will find places you forgot — let it.** Delete your `YourThingData.cs` and build. Every error is somewhere that was still reading the old list.
>
> **The home page is the one people miss.** If `Views/Home/Index.cshtml` has a line like `var featured = TrailData.All.First(...)`, that's a *view* reading data directly. Inject the context into `HomeController`, do the query there, and pass the result to the view as a model.

> [!WARNING]
> **Seed data must not use `DateTime.Now`, `Guid.NewGuid()`, or anything else that changes.** EF Core compares your seed data against the last snapshot every time you add a migration; if the values move, every migration contains pointless updates. Hard-code them.

## Part 3 — Check your password isn't in your public repo 🔐

There is no work in this part. That's the point of it.

Because your connection string went into [user secrets](lecture-notes.md#where-the-connection-string-lives) rather than a file in your project, there is nothing to remove from git, nothing to add to `.gitignore`, and nothing sitting in your repo's history. Confirm it in about fifteen seconds:

```bash
git status
```

Nothing about your connection string appears, because there's nothing in the repo for it to appear as. Then look at your repo on GitHub and search it for `Password=` — you should find nothing.

> [!IMPORTANT]
> **If you *did* put it in `appsettings.json` first and commit it**, deleting it now is not enough — it stays in every commit you already pushed, and a public repo's history is public. Tell me, set a different password on your database, and move on. This is exactly the mistake the user-secrets step exists to make impossible, and it is much better to make it here than at work.

> [!NOTE]
> **`appsettings.json` stays in your repo**, same as it's been since week 3. It holds your logging settings and nothing secret. Don't gitignore it.

## Part 4 — Deploy it (graded)

This week it's **two commands, not one** — because your connection string is deliberately not in anything you deploy.

**1. Deploy**, same as the last four weeks. Follow **[week 3's deploy-guide](../week-03/deploy-guide.md)**. From inside your web project folder:

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

**2. Tell the deployed app where the database is.** Your secret is on your laptop; Azure has never seen it, and a deployed app doesn't read user secrets at all. Give it the [connection string as an app setting](lecture-notes.md#part-7-the-deployed-app-10-min):

```bash
az webapp config appsettings set --name your-app-XX1234 \
  --resource-group <YOUR-RESOURCE-GROUP> \
  --settings ConnectionStrings__DefaultConnection="Server=...;Database=...;User ID=...;Password=...;TrustServerCertificate=True"
```

**Two underscores**, not a colon. Azure hands that to your app as an environment variable, and `GetConnectionString("DefaultConnection")` finds it without a single line of your code changing.

> [!TIP]
> **Don't know your resource group?** You've never had to type it before — `az webapp up` made one for you and named it after your app. This prints it:
>
> ```bash
> az webapp list --query "[].{app:name, group:resourceGroup}" -o table
> ```
>
> A *resource group* is just a folder in your Azure account that your app and its plan live in. That's the whole concept.

> [!WARNING]
> **In that order.** `az webapp config appsettings set` needs an app that already exists — run it first and you get "resource not found". Between the two commands your site *will* error; that's expected, not a broken deploy.

> [!TIP]
> **Once per app, not once per deploy.** The setting lives on the Azure app, so it survives every later `az webapp up`. You won't do this again in weeks 8 and 9.

> [!WARNING]
> **Use the same US region that worked before.** Apps deployed to Canadian regions have never been able to reach the school's SQL Server. If your deployed app throws a 500 while localhost is fine, check the region first — then check the app setting above.

> [!IMPORTANT]
> **You don't run migrations against a separate production database.** Your laptop and your Azure app point at the *same* database, and you already migrated it. That's not what a real project does — week 15 covers what real projects do — but it's what makes the next part possible.

## Part 5 — The two minutes that are actually the point ⭐

Do this. It takes longer to read than to do, and it's the whole week:

1. Open your **deployed** app and add a record through your form.
2. Now run your app **locally** (`dotnet watch`) and open your list page.

**It's there.** Two applications, on two different computers, showing the same data — because the data isn't in either of them. Nothing you built in the first six weeks could do that.

Then restart your local app and reload. Still there.

## Part 6 — Check it when you're finished ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with.**

> [!IMPORTANT]
> **Only 6 of the 20 points are in that script this week, down from 14.** That isn't because this week is easier. It's because what you built is *invisible from outside*: a page backed by SQL Server and a page backed by a `static List<T>` serve byte-identical HTML, so no amount of fetching can tell them apart. The script checks your app **survived the rewrite**. The database itself is **11 points, read out of your repo** — see the rubric.

> [!CAUTION]
> **This one changes your data, and this week the change sticks.** It submits your form twice: once with rubbish, to check you refuse it, and once with a good record. That second one leaves an item called **`SelfCheck entry`** in your list — and unlike last week it will still be there tomorrow, because that's the point. Delete it by hand if you like; you don't need to.

**Open `Views/Home/Index.cshtml`.** Find last week's line and **replace it** — same place, same section, one character different:

```html
<script src="https://jgrissom.github.io/dotnet-web-dev/week-06/homework-checks.js"></script>
```

becomes

```html
<script src="https://jgrissom.github.io/dotnet-web-dev/week-07/homework-checks.js"></script>
```

*(Can't find the old line? Search your project for `week-06` — **Ctrl+Shift+F** / **⇧⌘F**.)*

> [!CAUTION]
> **Replace it. Don't add a second one.**
>
> Week 6's checker still works, and nothing you did this week broke any of its requirements — so it prints a full green report. Worse than last week: it's scored out of **14** and this week's is scored out of **6**, so the stale report looks *better* than the real one.
>
> **The tell is the first line.** `🔎 Week 6 self-check` is the wrong one; this week's says **`Week 7`**. If both are installed, this week's prints a red 🚨 above the score.

Then load your home page and open the console — **F12 → Console**.

```
🔎 Week 7 self-check — https://trailguide-ab1234.azurewebsites.net

✅ 1 pts  your list page still works — 6 records
✅ 1 pts  a details page still works — /Trails/Details/1
✅ 1 pts  your form still refuses a bad record
✅ 2 pts  a good record is accepted and lands in your list — 6 → 7
✅ 1 pts  the new record's id was assigned for you — 7

📋 5 of 5 checks green · 6 of 6 points  (controller: /Trails)
```

> [!TIP]
> **If your list page is empty**, the table exists but has no rows. Open your migration file: if there's no `InsertData` in it, you generated it before writing `HasData`. Delete the `Migrations` folder and generate it again.

> [!TIP]
> **If a good record "isn't accepted"** and you got a redirect anyway — you're missing `SaveChanges()`. `Add` only records an intention; nothing reaches the database until you save. No error is produced, which is what makes this one expensive.

> [!TIP]
> **If everything works locally and the deployed app 500s** — connection string or region. Check Azure's **Log stream** for the real exception. `A network-related or instance-specific error` from a deployed app almost always means a non-US region.

*(If you have Node installed, `node homework-checks.js <url>` does the same from a terminal. You don't need it.)*

## 🆘 Stuck?

- **`No project was found in the current working directory`** — `dotnet ef` runs from the folder with your `.csproj`, not the one above it.
- **`Login failed for user`** vs **`A network-related or instance-specific error`** — the first is your username/password, the second is your server name or your network. [Both explained here](lecture-notes.md#the-two-errors-you-will-actually-get).
- **The app won't start: `Value cannot be null. (Parameter 'connectionString')`** — run `dotnet user-secrets list` from your web project folder. If it says *"No secrets configured for this application"*, the likeliest cause is that **you set it for the lab's project, not this one** — secrets are per application, so your own app needs its own `init` and `set` even on the same laptop. After that: a second computer, or a lab PC that resets. If secrets *are* listed, read them closely — [two typos look like success](lecture-notes.md#when-you-type-it-wrong): a key of `ConnectionString` (singular) stores fine and is never found, and an unquoted value gets chopped at the first `;` so only `Server=...` is saved. `set` prints `Successfully saved` for both.
- **Localhost is fine, the deployed app 500s** — Azure doesn't read your user secrets. Check the app setting: `az webapp config appsettings list --name your-app-XX1234 --resource-group <YOUR-RESOURCE-GROUP>` should show `ConnectionStrings__DefaultConnection`, with **two underscores**.
- **`Invalid object name 'YourThings'`** — [you never ran `dotnet ef database update`](lecture-notes.md#applying-it).
- **`Unable to resolve service for type ... YourContext`** — the `AddDbContext` line is missing, or it's below `builder.Build()`.
- **The list is empty, no errors** — your seed data was written after the migration was generated. Check the migration for `InsertData`.
- **The form redirects and nothing is saved** — [no `SaveChanges()`](lecture-notes.md#writing). Silent, and the most common bug of the week.
- **`Cannot insert explicit value for identity column`** — [the old `Max(x => x.Id) + 1` line is still there](lecture-notes.md#the-line-you-delete).
- **`The model for context has pending changes`** — you changed the model after generating the migration. Add another one.
- **My home page broke when I deleted the old list class** — a view was reading it directly. Move the query into `HomeController` and pass a model.
- The [troubleshooting appendix](lecture-notes.md#appendix-troubleshooting) covers the rest.

## 📊 Grading (20 pts)

| Item | Points | Checked by |
|------|--------|------------|
| Your list page still works, with your seeded records (deployed) | 1 | `homework-checks.js` |
| A details page still works | 1 | `homework-checks.js` |
| Your form still refuses a bad record | 1 | `homework-checks.js` |
| A good record is accepted and lands in your list | 2 | `homework-checks.js` |
| The new record's id was assigned by the database | 1 | `homework-checks.js` |
| A `DbContext` with a `DbSet`, and seed data in `OnModelCreating` | 4 | your repo |
| `AddDbContext` + `UseSqlServer`, connection string read from config — **and no password committed anywhere in the repo** | 2 | your repo |
| A migration that creates your table **and** inserts your seed rows | 3 | your repo |
| The old static list class is deleted, and `SaveChanges()` is called | 2 | your repo |
| Public repo with 3+ meaningful commits | 3 | your repo |
| **Deductions:** dead submitted URL | −2 | |

*Reminder: the explain-it standard applies. Be ready to walk me through any line — especially "what's the difference between `Add` and `SaveChanges`?", "where did `nvarchar(60)` come from?", and "what would happen if you deleted your `Migrations` folder?"*

## 📖 Reading for next week (~15 min)

Week 8 is **the rest of CRUD** — edit and delete — and the framework writing most of it for you.

- Open your `Create.cshtml` and your POST action side by side. **Write down what would have to change to make them an *Edit* form instead.** Bring the list; we'll compare it against what the scaffolder generates.
- Then answer this one for yourself: when someone edits a record, how does the app know *which* record it's editing? Your Create form doesn't send an `Id`. Where would it come from?
- [Microsoft: Overview of Entity Framework Core — Saving data](https://learn.microsoft.com/en-us/ef/core/saving/) — the first page only. You've now met `Add` and `SaveChanges`; skim what sits next to them.
