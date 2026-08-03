# Week 8 Homework

**Due:** before the start of Week 9's class.
**Submit via Canvas:** your **Azure URL** + your **GitHub repo URL**.

## Part 1 — Finish the corrections desk (nobody collects this)

All six checks green:

```bash
dotnet test Cryptids.Checks
# Passed! - Failed: 0, Passed: 6 ...
```

If class ended at check 4, that's on schedule — checks 5 and 6 are [the plates](lab/README.md#task-5-in-full), and they're the same two moves Part 2 asks for on your own app: an additive migration, and views that catch up with the model.

> [!IMPORTANT]
> This isn't submitted and it isn't worth points. It's the guided version of exactly what Part 2 asks you to do alone. Doing it first is what turns Part 2 into an hour.

## Part 2 — Your semester project gets the rest of CRUD (graded)

Same app you've been building since week 4. It can create records and show them. By next week it can **correct** them and **close** them — and its model grows a column of your choosing.

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work.** Every requirement links to the section that covers it, and the [troubleshooting appendix](lecture-notes.md#appendix-troubleshooting) names this week's specific errors — including the two silent ones.

It needs:

1. **[The two packages and the tool](lecture-notes.md#two-packages-and-a-tool)** — `Microsoft.VisualStudio.Web.CodeGeneration.Design` and `Microsoft.EntityFrameworkCore.Tools` added to your web project, and `dotnet-aspnet-codegenerator` installed globally. *(The lab handed you the packages; here you run the commands yourself.)* **Take both back out once you've scaffolded** — [same as the lab](lecture-notes.md#and-the-tool-goes-back-in-the-box); it stops the `NU1901` warnings, and `EntityFrameworkCore.Design` stays behind for `dotnet ef`.
2. **[A scaffolded reference controller](lecture-notes.md#the-command-piece-by-piece)** — run the scaffolder against **your** model and context (`-m YourThing -dc YourContext`, name it `YourThingsScaffoldController`). Browse it once; read it once.
3. **[The Edit pair, ported](lecture-notes.md#the-edit-pair)** — both `Edit` actions in your real controller, **async**, with an `Edit.cshtml` in your app's own style. The **[hidden `Id`](lecture-notes.md#the-hidden-id)** is what lets the form carry its own identity, and an **Edit link** on your details page (or your cards) is the way in.
4. **[The Delete pair, ported](lecture-notes.md#the-delete-pair)** — a GET that shows a confirmation page and changes nothing, a `DeleteConfirmed` POST that deletes, a `Delete.cshtml`, and a Delete link. [Why it's two requests](lecture-notes.md#why-delete-asks-first) is the kind of thing I ask about in person.
5. **The scaffold deleted again** — controller and views both, before you commit. It was a reference. *(Restart after — deleting a class is a rude edit, week 7's lesson.)*
6. **[One new column, added forward](lecture-notes.md#the-additive-migration)** — your model grows **one property of your choosing** (a nullable `string?` is the easy win — a note, a tagline, a location detail; [why nullable](lecture-notes.md#nullable-and-why)). Then `dotnet ef migrations add AddWhatever` + `database update`. **Additive** — your `Migrations` folder only grows now. Seeding values for your existing records with `HasData` is optional but makes your list look finished.
7. **[Three files catch up with the model](lecture-notes.md#three-files-care)** — the new property shows somewhere (card or details), it's editable on your Edit form, **and its name is in the `[Bind]` list.** That third one is the silent, destructive miss — the self-check tests for it through your own form.
8. **Everything from weeks 4–7 still works** — nav link, list, details, shell, theme, Create form and its validation, your seeded data.
9. **Deployed to Azure**, and **3+ meaningful commits** in your public GitHub repo.

### Your model isn't mine

The lab's moves transfer one-for-one; only the names change. Translations that catch people:

| The lab did | You do |
|---|---|
| `-m Cryptid -dc CryptidContext` | your model, your context — the scaffolder reads *your* annotations |
| `[Bind("Id,Name,Region,...")]` | **your** property names, exactly, comma-separated, no spaces needed |
| `FindAsync(id)` on `_context.Cryptids` | the same call on your `DbSet` |
| added `LatinName` + `ImageUrl` | **one** property is enough — your topic decides what it is |
| Latin names in `HasData` | optional for yours; if you seed values, the migration gains `UpdateData` rows |

> [!CAUTION]
> **The two silent failures, one more time, because they will both visit somebody this week:**
>
> - **An edit files a second record instead of correcting the first** → the hidden `Id` input is missing from your Edit form.
> - **Saving an edit *erases* your new column's value** → the property isn't in the `[Bind]` list, so the binder left it `null` and `Update` wrote the null. [The mechanism](lecture-notes.md#the-guest-list-bites) is worth being able to explain, not just fix.

> [!WARNING]
> **Do not delete your `Migrations` folder to "start clean."** Your database's `__EFMigrationsHistory` remembers your old migration files by name; regenerated files can never be applied to it. [Forward only](lecture-notes.md#forward-only) — a wrong migration is fixed by adding another one. (A migration you generated but never applied is the exception: `dotnet ef migrations remove` unwinds it safely.)

## Part 3 — Deploy it (graded, and shorter than it has ever been)

**Apply the migration first.** Your laptop and your Azure app share one database, so:

```bash
dotnet ef database update
```

run locally is also the production migration. *(That's the course's single-database setup doing you a favor — week 15 covers what real teams do instead.)*

**Then deploy — one command:**

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

That's it. **No second command this week.** Last week's `az webapp config appsettings set` was *once per app, ever* — the connection string is still sitting on your Azure app, and this deploy inherits it. That's the promise from week 7's slides, collected.

> [!TIP]
> **Deploy order matters a little this week:** migrate, then deploy. Between the two, your *old* deployed code runs against the *new* schema — which is fine, because it never asks for the column it doesn't know about. The reverse gap (new code, old schema) throws `Invalid column name` — and if your deployed site 500s while localhost is fine, that's the first thing to check: did `database update` actually run?

## Part 4 — Check it when you're finished ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with — and this week it exercises your whole CRUD cycle.**

> [!IMPORTANT]
> **The points moved back: 12 of 20 are in the script this week**, up from 6. Week 7's work was invisible from outside — a database-backed page renders the same HTML as a hard-coded one. Edit and delete are *visible*: a checker can watch a record change and disappear. So it does.

> [!NOTE]
> **What it does to your data: nothing, if Delete works.** It files a record through your form, edits it into `SelfCheck entry (edited)`, tries a bad edit (which you should refuse), then **deletes it through your own confirmation flow** — leaving your list exactly as it found it. The deletion isn't just cleanup; it's the D being graded. If the delete step fails, the test record stays until your Delete works (run it again) or you remove it by hand.

**Open `Views/Home/Index.cshtml`.** Find last week's line and **replace it** — same place, one character different:

```html
<script src="https://jgrissom.github.io/dotnet-web-dev/week-07/homework-checks.js"></script>
```

becomes

```html
<script src="https://jgrissom.github.io/dotnet-web-dev/week-08/homework-checks.js"></script>
```

*(Can't find it? Search the project for `week-07` — **Ctrl+Shift+F** / **⇧⌘F**.)*

> [!CAUTION]
> **Replace it. Don't add a second one.** Week 7's checker still passes — nothing this week breaks last week's requirements — so it prints a reassuring green report about the wrong week. The tell is the first line: it should say **`Week 8`**. If both are installed, this week's prints a red 🚨 above the score.

Then load your home page and open the console — **F12 → Console**:

```
🔎 Week 8 self-check — https://trailguide-ab1234.azurewebsites.net

✅ 1 pts  your list page still works — 6 records
✅ 1 pts  a new record can still be filed — id 9
✅ 2 pts  the Edit form shows the record, pre-filled — /Trails/Edit/9
✅ 3 pts  a correction is saved — as an update, not a copy
✅ 1 pts  a bad correction is refused
✅ 1 pts  Delete asks before deleting — /Trails/Delete/9
✅ 3 pts  the record can be deleted — and your data is back exactly as I found it

📋 7 of 7 checks green · 12 of 12 points  (controller: /Trails)
```

> [!TIP]
> **If the correction "saves" but nothing changed** — missing `SaveChangesAsync`. **If your list *grew*** — either the POST calls `Add` instead of `Update`, or the hidden `Id` is missing and `Update` filed an unset key as new. **If delete returns 405** — the `DeleteConfirmed` + `[ActionName("Delete")]` pair didn't port intact. Each check's ↳ hint says which.

*(If you have Node installed, `node homework-checks.js <url>` does the same from a terminal. You don't need it.)*

## 🆘 Stuck?

- **The scaffolder won't run at all** — [tool not installed](lecture-notes.md#two-packages-and-a-tool) (`dotnet tool install --global dotnet-aspnet-codegenerator`), or you're not in your web project folder.
- **`...install Entity Framework core packages... Microsoft.EntityFrameworkCore.Tools`** — requirement 1's second package is missing. This is the one your app never calls, which is why it's easy to skip.
- **`Scaffolding failed: Build failed`** — your project has to compile before the scaffolder will touch it. `dotnet build`, read the error, fix, retry.
- **`The view 'Edit' was not found` — and the error names the exact path your file is at** — look at the `dotnet watch` terminal: a *new* `.cshtml` can't be hot-reloaded, so watch stopped and asked **`Do you want to restart your app? Yes (y) / No (n) / Always (a)`**. Until you answer, the running app is the one built before your file existed. Press **`a`**. **Don't move the file** — it's already in the right place.
- **Saving an edit files a duplicate instead of correcting the record** — [the hidden `Id`](lecture-notes.md#the-hidden-id) is missing and your form's action carries no id either, so `Update()` filed an unset key as a new record. The quiet one this week, after `[Bind]`.
- **`The name 'SomethingExists' does not exist in the current context`** — you ported the scaffold's catch, which calls a helper the scaffold kept `private` to itself. Either copy that little method into your controller too, or [inline it](lecture-notes.md#what-porting-means): `if (!_context.YourThings.Any(x => x.Id == thing.Id))`. Both are fine — porting the call without the method isn't.
- **An edit redirects but changes nothing** — no `await SaveChangesAsync()`. Marked, never written.
- **An edit *added* a record** — `Add` where `Update` belongs.
- **Saving an edit erased a field** — [the `[Bind]` list](lecture-notes.md#the-guest-list-bites). Your new property's name has to be on it. **Then restart before re-testing** (`Ctrl+C`, `dotnet watch`): that's an attribute-only edit, hot reload can keep the old list, and the erase happening *again* after a correct fix is how people end up rewriting code that was already right.
- **Delete POST → 405** — the POST half needs `[HttpPost, ActionName("Delete")]` on `DeleteConfirmed`.
- **"already defines a member called 'Delete'"** — that's *why* it's `DeleteConfirmed`. [The one-attribute fix](lecture-notes.md#deleteconfirmed-and-why-its-named-that).
- **`There is already an object named '...'`** — you regenerated migrations against a database that remembers the old ones. [Forward only](lecture-notes.md#forward-only) — and if you already deleted the folder, come talk to me; it's recoverable but fiddly.
- **Deployed app 500s, localhost fine, log says `Invalid column name`** — the shared database never got this week's migration. `dotnet ef database update` locally, then reload the deployed site.
- The [troubleshooting appendix](lecture-notes.md#appendix-troubleshooting) covers the rest.

## 📊 Grading (20 pts)

| Item | Points | Checked by |
|------|--------|------------|
| Your list page still works, seeded records intact (deployed) | 1 | `homework-checks.js` |
| A new record can still be filed | 1 | `homework-checks.js` |
| The Edit form shows the record, pre-filled | 2 | `homework-checks.js` |
| A correction is saved — as an update, not a copy | 3 | `homework-checks.js` |
| A bad correction is refused, with messages | 1 | `homework-checks.js` |
| Delete shows a confirmation and the GET deletes nothing | 1 | `homework-checks.js` |
| The record can be deleted, details 404s after | 3 | `homework-checks.js` |
| Edit + Delete actions are async; `Update`/`Remove` + `SaveChangesAsync` | 2 | your repo |
| A **new, additive** migration that `AddColumn`s your new property | 3 | your repo |
| Public repo with 3+ meaningful commits | 3 | your repo |
| **Deductions:** dead submitted URL | −2 | |

*Reminder: the explain-it standard applies. The ones I'll reach for: "how does the POST know which record it's editing?", "what happens to a property that isn't in the `[Bind]` list — and why is it worse than nothing?", "why is Delete two requests?", and "why can't you delete your `Migrations` folder any more?"*

## 📖 Reading for next week (~15 min)

Week 9 is **the second table** — records that point at other records, and the queries that join them.

- Week 4 told you to pick a topic that could grow a *second, related list* by week 9. That bill is due. **Write down what yours is** — sightings for creatures, reviews for trails, showtimes for movies — and sketch its columns the way you did in week 7's reading: name and type, one line per column.
- Then answer this for yourself: **which column ties your second table to your first one?** If a review belongs to a trail, something in the review row has to say *which* trail. What type is that column, and what happens to the review if the trail gets deleted? (You built the delete button this week. That question just became real.)
- [Microsoft: Relationships in EF Core](https://learn.microsoft.com/en-us/ef/core/modeling/relationships) — the first page only, down through "one-to-many." Skim for shape, not detail; the vocabulary (*principal*, *dependent*, *foreign key*) is what week 9 will use.
