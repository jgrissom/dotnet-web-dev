# Week 9 — Related Data

**What this covers:** a second table that points at your first one; foreign keys and navigation properties; `Include` and why forgetting it is silent; ViewModels; a dropdown built from your own records; what happens to the children when a parent is deleted; and the many-to-many that appears when a join table carries a payload.

**Keep this open while you work.** Every requirement in the homework has a section here, and the 🆘 section at the bottom of the homework links straight into it.

---

## Part 1: One table is a list. Two tables is an application.

Since week 4 you have had one list. Week 7 moved it into SQL Server and week 8 gave it the rest of CRUD, but the shape never changed: rows that know nothing about each other.

Almost nothing real looks like that. A trail has reviews. A movie has showtimes. A creature has sightings. The second list is *about* the first one, and every row in it belongs to exactly one row over there.

That is a **one-to-many**, and it has three words worth learning because the documentation uses them constantly:

| Word | Means | In the demo |
|---|---|---|
| **Principal** | the row that can stand alone | `Truck` |
| **Dependent** | the row that needs a principal to make sense | `Special` |
| **Foreign key** | the column on the dependent naming which principal | `Special.TruckId` |

Principal and dependent are not about importance. They are about **who can exist alone**. A truck with no specials is still a truck. A special with no truck is a row nobody can explain.

---

## Part 2: Three properties, two classes

A one-to-many in C# is three properties spread across two classes. Only **one** of them is a column in the database.

This is the whole file — `Models/Special.cs`:

```csharp
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Curbside.Models;

public class Special
{
    public int Id { get; set; }

    [Required(ErrorMessage = "What's on offer?")]
    [StringLength(60, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [Precision(5, 2)]
    [Range(1, 30, ErrorMessage = "Specials run from ${1} to ${2}.")]
    public decimal Price { get; set; }

    [Display(Name = "Served on")]
    [Required(ErrorMessage = "Which day?")]
    [StringLength(10)]
    public string ServedOn { get; set; } = "";

    // The foreign key. THIS is the column that exists in the table.
    [Display(Name = "Truck")]
    public int TruckId { get; set; }

    // The navigation property. Not a column. EF fills it in when asked.
    public Truck? Truck { get; set; }
}
```

And the other end, which goes **inside the `Truck` class you already have** (`Models/Truck.cs`), alongside its other properties:

```csharp
public ICollection<Special> Specials { get; set; } = new List<Special>();
```

Three things about that are worth saying out loud.

**`TruckId` is the only column.** Open the table in the mssql panel after you migrate and you will see `Id`, `Name`, `Price`, `ServedOn`, `TruckId`. There is no `Truck` column and no `Specials` column. The navigation properties are conveniences for walking between objects in C#; the database knows nothing about them.

**The naming is a convention, and it is doing work.** `TruckId` is recognized as the foreign key for `Truck` because of the name. Call it `OwnerId` and EF stops connecting the two on its own, and you have to say so explicitly. Name it `<NavigationProperty>Id` and everything wires up for free.

**The collection is initialized, not left null.** `= new List<Special>()` means a truck with no specials has an empty list rather than a `null`. Miss it and `Model.Specials.Count` throws `NullReferenceException` on the first truck that has none — which is every truck, right up until you seed.

`decimal` for money, not `double`. `[Precision(5, 2)]` says how wide the column is; leave it off and EF picks `decimal(18, 2)` and tells you so in the build output.

### The `DbSet`

One line in your context, next to the one you already have — this goes **inside the context class** (`Data/CurbsideContext.cs`):

```csharp
public DbSet<Special> Specials => Set<Special>();
```

That is all it says: there is a `Specials` table. The *relationship* was declared in the model classes, not here.

---

## Part 3: The migration, and the cascade you did not choose

```bash
dotnet ef migrations add AddSpecials
dotnet ef database update
```

Open the generated migration and read it. There are four operations and each one is worth a look:

- **`CreateTable`** — the new table, with the columns you would expect.
- **A `ForeignKey` constraint** inside it, tying `TruckId` to `Trucks.Id`.
- **`InsertData`** — your seed rows, if you seeded.
- **`CreateIndex`** on `TruckId` — which you did not ask for. EF adds it because every query that asks "which specials belong to this truck" filters on that column, and an index is what keeps it fast.

Then there is this, inside the foreign key:

```csharp
onDelete: ReferentialAction.Cascade
```

**Nobody typed the word cascade.** It was inferred, and the chain is worth following:

1. You wrote `public int TruckId`, not `public int? TruckId`.
2. Not nullable means a special **must** have a truck.
3. So EF asks: what should happen to a special when its truck is deleted?
4. It cannot be left pointing at nothing, because the column will not accept a null.
5. Therefore it is deleted too.

**Delete a truck and its specials go with it, silently, and nothing asks you twice.** Week 8's reading asked you what happens to a review when its trail is deleted. That is the answer, and the framework made the decision on your behalf from a missing question mark.

> [!NOTE]
> You can change it — Fluent API in `OnModelCreating` lets you say `.OnDelete(DeleteBehavior.Restrict)` to refuse the delete instead. Nothing this term needs it. Know that the default was a decision, not a law.

---

## Part 4: `Include` — empty is not missing

This is the most important section in these notes, and the bug it describes is the only one this term with **no symptom at all**.

Write the details page so it lists the related rows. Inside `Views/Trucks/Details.cshtml`:

```cshtml
<h2 class="h5 mt-4">On the menu</h2>

@if (Model.Specials.Count > 0)
{
    <ul class="list-group mb-4">
        @foreach (var special in Model.Specials)
        {
            <li class="list-group-item d-flex justify-content-between">
                <span>@special.Name <span class="text-muted">· @special.ServedOn</span></span>
                <span>$@special.Price</span>
            </li>
        }
    </ul>
}
else
{
    <p class="text-muted">Nothing listed.</p>
}
```

Load the page for a truck you know has specials. You get **`Nothing listed.`**

Now look at what every instrument tells you:

- The page returns **200**. It rendered fine.
- There is **no exception**, and nothing red anywhere.
- The **terminal is clean** — no error, no warning.
- The **database has the rows**. You can see them in the mssql panel.

**A navigation property is empty until a query asks for it.** EF Core fetched a truck, because a truck is what the query asked for. It does not go and collect related rows in case you wanted them.

The fix is one line, and it goes **inside the `Details` action** in `Controllers/TrucksController.cs`:

```csharp
var truck = _context.Trucks
    .Include(t => t.Specials)
    .FirstOrDefault(t => t.Id == id);
```

> [!IMPORTANT]
> **An empty list looks exactly like a truck that has no specials.** That is what makes this dangerous. There is no error to search for and no line in a log. If related rows are not showing up, the first thing to check — before the seed, before the migration, before anything — is whether the query that fed the page said `Include`.

### `Include` is per query

This catches people twice. Adding `Include` to `Details` does **nothing** for `Index`, or for `Delete`, or for any other action. It is part of a query, not a setting on the model and not a property of the app.

The Curbside demo needed it in three separate places, and the Registry lab needs it in three too. Every page that shows related rows asks for them again:

```csharp
// Index — the cards show a count
return View(_context.Trucks
    .Include(t => t.Specials)
    .ToList());
```

---

## Part 5: `Include` and the cost of not using it

There is a second reason for `Include`, and it is the one week 7 promised you would meet.

Say the index page wants a specials count on each card. Here is a way to get it that works — this goes **inside the `Index` action**:

```csharp
var trucks = _context.Trucks.ToList();

var counts = new Dictionary<int, int>();
foreach (var truck in trucks)
{
    counts[truck.Id] = _context.Specials.Count(s => s.TruckId == truck.Id);
}
ViewData["Counts"] = counts;
```

That is correct. The page shows the right numbers. Load it and read the terminal.

**Seven trucks produce eight `SELECT` statements** — one for the trucks, then one more for every truck on the page. The page issues one extra query per row, and it always will: a hundred rows is a hundred and one queries.

Now the other version:

```csharp
return View(_context.Trucks
    .Include(t => t.Specials)
    .ToList());
```

```cshtml
<p class="small text-muted">@truck.Specials.Count specials</p>
```

Reload and read the terminal again. **One statement:**

```sql
SELECT t.Id, t.Name, ..., s.Id, s.Price, s.ServedOn
FROM Trucks AS t
LEFT JOIN Specials AS s ON t.Id = s.TruckId
ORDER BY t.Id
```

You did not write that join. You said `Include`, and EF wrote it — one trip to the server for the trucks and all of their specials.

> [!TIP]
> **This is what the terminal is for.** `appsettings.Development.json` leaves EF Core logging at Information, so every query your app makes prints while you work. A page that suddenly takes a second to load has an answer scrolling past in that window.

---

## Part 6: ViewModels — one view, more than one thing

By now the Curbside details page needs three things at once: the truck, its specials, and the other trucks in the same city. `Model` is one object, so the third one arrives in `ViewData`, and reading it back looks like this:

```cshtml
var alsoHere = (List<Truck>)ViewData["AlsoHere"]!;
```

A cast **and** a null-forgiving `!`, in a view. `ViewData` is a dictionary of `object`, so it forgets the type of everything you put in it, and the `!` is you promising the compiler something you have not proved.

**When a view needs more than one thing, give it a type that holds both.** That type is a **ViewModel**.

This is the whole file — `ViewModels/TruckDetailsViewModel.cs`:

```csharp
using Curbside.Models;

namespace Curbside.ViewModels;

public class TruckDetailsViewModel
{
    public Truck Truck { get; set; } = null!;
    public List<Truck> AlsoHere { get; set; } = new();
}
```

Then in the controller, **inside `Details`**, build one object and hand it over:

```csharp
var viewModel = new TruckDetailsViewModel
{
    Truck = truck,
    AlsoHere = _context.Trucks
        .Include(t => t.Specials)
        .Where(t => t.City == truck.City && t.Id != truck.Id)
        .ToList()
};

return View(viewModel);
```

And the view's first line becomes `@model TruckDetailsViewModel`, after which every `Model.Something` becomes `Model.Truck.Something`. The cast is deleted.

**A ViewModel is not an entity.** It has no table, it is never in your `DbContext`, and it does not belong in `Models/`. Put it in a `ViewModels/` folder — the separation is the point.

> [!WARNING]
> **Add the `@using` line at the same time you create the folder.** In `Views/_ViewImports.cshtml`:
> ```cshtml
> @using Curbside.ViewModels
> ```
> If that line names a namespace that does not exist yet, **every view in your project fails to compile** — not just the one you are working on. You get a screen of errors pointing at files you have never opened. Create the folder, the class and the `@using` together.

---

## Part 7: A dropdown built from your own records

A form that files a related record has to say **which** record it belongs to, and the person filling it in picks from a list. That list is a `SelectList`.

It takes three things: the rows, the property that becomes the `value`, and the property a human reads.

```csharp
new SelectList(_context.Trucks.OrderBy(t => t.Name).ToList(), "Id", "Name")
```

In the view:

```cshtml
<select asp-for="Special.TruckId" asp-items="Model.Trucks" class="form-select">
    <option value="">— pick a truck —</option>
</select>
```

**The `<option value>` is the foreign key.** That is the entire mechanism: the option a person clicks carries a truck's `Id`, the browser posts that number, and model binding puts it in `Special.TruckId`.

The form needs two things at once — the special being filled in and the list to choose from — so it gets a ViewModel too. This is the whole file, `ViewModels/SpecialFormViewModel.cs`:

```csharp
using Microsoft.AspNetCore.Mvc.Rendering;
using Curbside.Models;

namespace Curbside.ViewModels;

public class SpecialFormViewModel
{
    public Special Special { get; set; } = new();

    // The "?" is load-bearing. See below.
    public SelectList? Trucks { get; set; }
}
```

### Two things that will bite you here

**The dropdown is not posted back, so a rejected form has to rebuild it.** The browser sends the one option that was chosen. It never sends the list. So if `ModelState` is invalid and you return the view, the `SelectList` is gone and the redisplayed form has an empty dropdown:

```csharp
if (!ModelState.IsValid)
{
    form.Trucks = TruckChoices(form.Special.TruckId);   // rebuild it
    return View(form);
}
```

**The `SelectList` property must be nullable.** Write `public SelectList Trucks { get; set; }` and every submission is rejected with:

> The Trucks field is required.

...pointing at a dropdown that visibly has a truck selected. This is week 6's rule in a new place: **ASP.NET treats a non-nullable property as a required field**. `Trucks` is the list of *choices*, and the browser never posts it, so as far as model binding is concerned a required field arrived empty.

One character fixes it:

```csharp
public SelectList? Trucks { get; set; }
```

> [!TIP]
> When a form silently refuses and you cannot see why, change `asp-validation-summary="ModelOnly"` to `asp-validation-summary="All"`. `ModelOnly` shows model-level errors and hides property-level ones — which is exactly the category this failure lands in. That switch is the fastest debugging move you own, and it needs no tooling.

---

## Part 8: Deleting a parent

Because the foreign key was created with `onDelete: Cascade`, deleting a truck deletes its specials. Nothing warns you and nothing asks twice.

A page whose whole job is to ask *"are you sure?"* is not doing that job if it only shows the truck. Load the children in the `Delete` GET — **inside the `Delete` action**:

```csharp
var truck = await _context.Trucks
    .Include(t => t.Specials)
    .FirstOrDefaultAsync(t => t.Id == id);
```

...and say so on the page, inside `Views/Trucks/Delete.cshtml`:

```cshtml
@if (Model.Specials.Count > 0)
{
    <div class="alert alert-warning">
        This truck has <strong>@Model.Specials.Count</strong> special@(Model.Specials.Count == 1 ? "" : "s") on file.
        Removing the truck removes @(Model.Specials.Count == 1 ? "it" : "them") too.
    </div>
}
```

Note that this is the **third** `Include` in the app. Details had one. Index had one. The delete page showed a count of zero until it got its own.

---

## Part 9: When the join carries something

This part is worth reading and is **not** required by the homework. A one-to-many is all you need this week.

Look at the demo's seed and read the dish names. Three different trucks sell `"Cheese Curds"`, and each one has that string typed into its own row. So ask the database a reasonable question — *who sells cheese curds?* — and the only way to answer is to match a string and hope everyone spelled it the same way.

The fix is to pull the name into its own table:

```csharp
public class Dish
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public ICollection<Special> Specials { get; set; } = new List<Special>();
}
```

...and give `Special` a second foreign key, replacing its `Name`:

```csharp
public int DishId { get; set; }
public Dish? Dish { get; set; }
```

`Special` now has **two** foreign keys — one to `Truck`, one to `Dish` — and it still carries `Price` and `ServedOn`.

**That is a many-to-many.** Many trucks serve many dishes, and `Special` is the join between them. The reason it has to be a class of its own, rather than something EF hides for you, is that **it carries a payload**: the price is not a fact about the truck and not a fact about the dish. It is a fact about the pairing.

### `ThenInclude`

Loading two hops takes a second word:

```csharp
var dish = _context.Dishes
    .Include(d => d.Specials)
        .ThenInclude(s => s.Truck)
    .FirstOrDefault(d => d.Id == id);
```

`Include` gets you from a dish to its specials. `ThenInclude` keeps going, one hop further, to the truck each special names. That gives you the relationship read backwards — from a dish, every truck that serves it — **out of the same rows**, with nothing new added to the database.

---

## Part 10: Choosing your own second table

The homework asks for a second, related table on your own app. Nothing here is specific to food trucks or cryptids, so here is how to make the decision.

**Pick the thing that is naturally "many of" your existing thing.** Reviews for a trail. Showtimes for a movie. Players on a team. Sightings of a creature. Sessions for a course. If you can say *"one X has many Y"* out loud and it sounds true, you have it.

**Give it three or four columns of its own, plus the foreign key.** A row that is only a foreign key and a name is not really a second table. What makes a review a review is the rating and the text and the date.

**At least one of those columns needs a validation rule you typed** — a `[StringLength]`, a `[Range]`, something with a number in it. ASP.NET marks every non-nullable property required on its own, so "it rejects a blank form" proves nothing about your model. Week 6's attributes are what you want here.

**Name the foreign key `<Thing>Id`.** `TrailId`, `MovieId`, `TeamId`. Matching the navigation property's name is what wires the relationship up without extra configuration.

**Seed a few rows.** Not dozens — enough that your details pages have something on them and the count on your cards is not zero. The seed goes in `OnModelCreating` the same way your first table's did, and a migration carries it.

> [!NOTE]
> Week 4 told you to pick a topic that could grow a second, related list by week 9. If yours genuinely cannot, come and talk to me before you start rather than after.

---

## Troubleshooting

**The page shows nothing, but the database has rows.**
`Include`. This is Part 4, it is silent, and it accounts for more of this week's confusion than everything else combined. Check the query that fed *this specific page* — an `Include` somewhere else does not count.

**`NullReferenceException` on `Model.Something.Count`.**
Either the collection was never initialized (`= new List<Thing>()` on the property) or the query did not `Include` it and you are on a code path that assumed otherwise.

**`Object reference not set` on `special.Dish.Name` in a view.**
You included the specials but not the second hop. That is `ThenInclude`.

**"The Trucks field is required" — but a truck is selected.**
Your `SelectList` property is not nullable. Part 7. One `?`.

**The form is refused and no message appears.**
`asp-validation-summary="ModelOnly"` hides property-level errors. Switch it to `"All"` and the reason appears.

**The dropdown is empty after a failed submit.**
The `SelectList` is not posted back and has to be rebuilt inside the `if (!ModelState.IsValid)` branch before `return View(form)`.

**Every view in the project suddenly fails to compile.**
`_ViewImports.cshtml` names a namespace that does not exist yet. Create the `ViewModels` folder and a class in it, or take the `@using` out until you do.

**The migration says it "may result in the loss of data."**
Read it. If it is a `DropColumn` you meant to make, that is the warning doing its job. If you did not mean to drop anything, something in your model changed that you did not intend.

**`dotnet ef migrations add` fails with a foreign key error, or the update does.**
Adding a required foreign key to a table that already has rows needs those rows to get a value. If you seeded, EF generates `UpdateData` for the seeded rows and puts the constraint on last. If you have rows that are *not* seeded, EF cannot guess what they should point at — the honest fix in a course project is to drop the database and let the migrations replay.

**Deleting a parent throws instead of cascading.**
Your foreign key is nullable (`int?`), so EF chose `SetNull` or `Restrict` rather than `Cascade`. That is a legitimate design, but it means you handle the children yourself.
