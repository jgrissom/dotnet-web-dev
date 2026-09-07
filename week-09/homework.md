# Week 9 Homework

**Topic:** your application gets a second, related table.
**Due:** before the start of Week 10's class.

Week 4 told you to pick a topic that could grow a *second, related list* by week 9. That bill is due tonight.

**Keep [the lecture notes](lecture-notes.md) open while you work.** Every requirement below links to the section that shows it done.

## Part 1 — Finish the sightings log (nobody collects this)

If checks 5 and 6 didn't go green in the lab, finish them now. [The lab README](lab/README.md) has every task in full, and `dotnet test Cryptids.Checks` tells you where you are.

**This is worth zero points and it is the best hour you can spend.** Everything in Part 2 is the same five moves against your own model, and doing them once with the checks answering you makes the second time about an hour.

## Part 2 — Your semester project gets a second table (graded)

### Swap the self-check over first

Open `Views/Home/Index.cshtml`, find the **week-08** line, and **replace it**:

```html
@section Scripts {
    <script src="https://jgrissom.github.io/dotnet-web-dev/week-09/homework-checks.js"></script>
}
```

⚠️ **Replace it — do not add a second line.** Last week's script is still installed and it still passes, because nothing this week breaks last week's requirements. Left in place it prints a full green report about **week 8** and you will read it as good news. The banner says which week; check it.

⚠️ **Nothing runs when the page loads.** Open the console (F12) and type `recheck()` when you want it to run. It submits your form, so it waits to be asked.

### Then build it

Each requirement links to the section of the notes that shows it done.

1. **A second model class**, with a **foreign key** and a **navigation property**. One of your existing records has many of these: reviews for a trail, showtimes for a movie, players on a team. Give it three or four columns of its own plus the key, and name the key `<Thing>Id` so it wires up on its own. → [Three properties, two classes](lecture-notes.md#part-2-three-properties-two-classes)

2. **The collection on your first model** — `public ICollection<Child> Children { get; set; } = new List<Child>();` — so a parent can be asked for its children. **Initialize it**, or the first parent with none throws. → [Three properties, two classes](lecture-notes.md#part-2-three-properties-two-classes)

3. **A `DbSet`, a migration that creates the table, and a few seeded rows.** The migration is additive — it goes on top of the ones you already have, and you do not delete anything. Read it before you apply it; the `onDelete` line is a decision the framework made for you. → [The migration, and the cascade you did not choose](lecture-notes.md#part-3-the-migration-and-the-cascade-you-did-not-choose)

4. **The related rows appear on a record's own details page.** This is the one that fails silently — the rows are in the database, the page is a clean 200, and nothing shows. → [`Include` — empty is not missing](lecture-notes.md#part-4-include--empty-is-not-missing)

5. **A form that files one**, with a **dropdown of your existing records** so a new row can say which one it belongs to. It needs a ViewModel (the form needs two things at once), a `SelectList` built in the controller, and a link to it from somewhere a visitor can find. → [A dropdown built from your own records](lecture-notes.md#part-7-a-dropdown-built-from-your-own-records)

6. **At least one validation rule you typed** on the second model — a `[StringLength]`, a `[Range]`, something with a number in it. ASP.NET marks every non-nullable property required on its own, so a blank-form rejection proves nothing about your model. → [Choosing your own second table](lecture-notes.md#part-10-choosing-your-own-second-table)

### Your model isn't mine

Nothing above says what your table is called or what is in it. The self-check does not know either — it finds your second form by looking for **a dropdown whose values are the ids of records on your list page**, because that dropdown *is* the foreign key, whatever you named it.

What that means in practice: the link to your form has to be **findable**. Put it on a record's details page, or in the navbar. A form nobody can reach from a page scores nothing, however well it works.

## Part 3 — Check it as you go ✅

Type `recheck()` in the console. **12 of the 20 points are in that script**, so run it before you decide you are finished.

⚠️ **It files one report through your form and cannot take it back.** Nothing this week asks you to build a delete for the second table, so the script files **one** row marked `Week 9 Test` against your first record — and every run after that **reuses that same row** instead of adding another. It stays at one no matter how many times you check. Delete it by hand in the mssql panel if you want it gone.

**After each requirement, here is what moves:**

| After requirement | What changes in the report |
|---|---|
| **1–2** — the model pair | **nothing.** Neither of them is visible from outside; they're scored from your repo |
| **3** — `DbSet`, migration, seed | **still nothing on the deployed report** — but if your list page *drops* to zero records, the migration never reached the database your app is actually using |
| **4** — `Include` | **nothing yet.** This one can't be judged until requirement 5 exists, because the script has to file a report before it can look for one |
| **5** — the form | **four go green at once** — the form is found, the dropdown offers your records, a good entry saves, and *"it appears on that record's own page"* finally answers requirement 4. If that last one stays red, your form works and your `Include` is missing |
| **6** — a real validation rule | **the last one: 6 of 6** |
| **7–8** — deployed | run it once more on your Azure URL. That is the run I grade |

> [!NOTE]
> **Requirement 4 is graded by the check that runs last.** That is not a mistake — a checker cannot see an `Include` in your source, only its consequence. It files a report, then goes looking for it on the parent's page. If the report saved but never appeared, the `Include` is missing and that check is the only thing in the course that can tell you.

## Part 4 — Deploy it (graded)

7. **Push your work**, in **3 or more meaningful commits**. Check the history before you push: `git log --oneline`.

8. **Redeploy, and apply the migration to the deployed database.**

```bash
az webapp up
```

⚠️ **A redeploy does not run your migration.** The connection string is an app setting and it survives — that was week 7's promise and it still holds — but the deployed database has no idea your new table exists until the migration is applied to it. Run `dotnet ef database update` against the *deployed* connection string, or your live site throws `Invalid object name` on every page that touches the second table.

9. **Run the self-check on your Azure URL** and read the report. That is the run I grade.

## 🆘 Stuck?

- **Related rows don't show, but the database has them** — [`Include`](lecture-notes.md#part-4-include--empty-is-not-missing). Silent, no error, accounts for most of this week's confusion.
- **They show on one page and not another** — [`Include` is per query](lecture-notes.md#include-is-per-query). Every page asks again.
- **`NullReferenceException` on `.Count`** — the collection isn't initialized on the property.
- **Every view fails to compile at once** — `_ViewImports.cshtml` names a `ViewModels` namespace that doesn't exist yet. [Part 6](lecture-notes.md#part-6-viewmodels--one-view-more-than-one-thing).
- **"The X field is required" pointing at a full dropdown** — your `SelectList` property needs a `?`. [Two things that will bite you here](lecture-notes.md#two-things-that-will-bite-you-here).
- **The form refuses with no message on screen** — `asp-validation-summary="All"`, not `"ModelOnly"`.
- **The dropdown is empty after a rejected submit** — rebuild the `SelectList` before `return View(form)`.
- **`Object reference not set` on `child.Parent.Name` in a view** — that's a second hop, and it needs [`ThenInclude`](lecture-notes.md#theninclude).
- **The deployed site throws but localhost is fine** — the migration hasn't been applied to the deployed database. Part 4, requirement 8.
- **The self-check says it can't find a second form** — it looks at every link on your first record's details page and at `/Create` on every controller in your navbar. If your form isn't reachable from either, it can't be found.

## 📊 Grading (20 pts)

| What | Pts | Where it comes from |
|---|---|---|
| Your list page still works | 1 | deployed URL |
| There's a form for filing a related record | 2 | deployed URL |
| It asks which record the new one belongs to | 2 | deployed URL |
| A bad entry is refused | 2 | deployed URL |
| A good entry is saved | 2 | deployed URL |
| **And it appears on that record's own page** | 3 | deployed URL |
| The model pair — foreign key, navigation, collection back | 2 | your repo |
| A migration that creates the second table | 2 | your repo |
| The foreign key is settable on the deployed form | 1 | repo + URL together |
| 3+ meaningful commits | 3 | your repo |
| **Deductions:** dead submitted URL | −2 | |

*Requirements 1 and 2 are the "model pair" line — a foreign key with no collection pointing back is a half-declared relationship that still compiles. Requirement 4 is the "appears on that record's own page" line, and it is worth the most single item on the page because it is the one that fails silently.*

*The "settable on the deployed form" line is the one neither half can judge alone: your repo says what the foreign key is called, and only the deployed page can show that anything can set it. A relationship modeled, migrated, and never put on a form scores zero there.*

*Reminder: the explain-it standard applies. The ones I'll reach for: "which of your three new properties is actually a column?", "what does your page show if you take the `Include` out — and what does the error say?", "why does your `SelectList` property have a question mark on it?", and "what happens to your second table's rows when you delete a parent, and who decided that?"*

## 📖 Reading for next week (~10 min)

Week 10 is the **midterm project**. Nothing new gets introduced — you take what you have and make it something you would be willing to show someone.

- **Open your own app and click through it as a stranger would.** Write down the three things that look worst. That list is your midterm.
- Re-read your week 4 topic choice. You have layout, forms, validation, a database, full CRUD and now a second table on it. **What is it missing that a person would expect?**
- No new reading. Bring the list.
