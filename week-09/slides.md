---
marp: true
theme: gaia
class: invert
paginate: true
style: |
  section pre {
    background: #151b23;
    border-radius: 8px;
  }
  section pre code {
    background: transparent;
    color: #e6edf3;
  }
  section pre .hljs-keyword { color: #ff7b72; }
  section pre .hljs-string { color: #a5d6ff; }
  section pre .hljs-title, section pre .hljs-title.function_ { color: #d2a8ff; }
  section pre .hljs-comment { color: #9198a1; font-style: italic; }
  section pre .hljs-attr, section pre .hljs-attribute { color: #79c0ff; }
  section pre .hljs-number, section pre .hljs-literal { color: #79c0ff; }
  section pre .hljs-built_in { color: #ffa657; }
  section pre .hljs-name { color: #7ee787; }
  section pre .hljs-selector-class, section pre .hljs-selector-pseudo { color: #7ee787; }
  section footer { color: #9fb2c1; font-size: 0.6em; opacity: 0.85; }
---


<!-- _paginate: false -->

# Week 9 — Related Data

.NET Web Development · Week 9 of 16

---

<!-- _footer: '🖥️ Demo §1 · the payoff, retold' -->

## One table. Every app is at least two.

Seven trucks. Full CRUD. A column added to a live table.

<br>

And every truck is still an **island**.

<br>

Tonight the records grow **relatives** —

and you find out why `_context.Trucks` is a **set**, not a list.

---

<!-- _footer: '🖥️ Demo §1 · collect the reading' -->

## What a relationship is

| | |
|---|---|
| **Principal** | the one that stands alone — `Truck` |
| **Dependent** | the one that needs it — `Special` |
| **Foreign key** | the column on the dependent that names the principal |

<br>

One truck has **many** specials.

A special belongs to **one** truck.

---

<!-- _footer: '🖥️ Demo §2 · three properties, two classes' -->

## Three properties, two classes

```csharp
public class Special
{
    public int TruckId { get; set; }   // the column
    public Truck? Truck { get; set; }  // NOT a column
}

public class Truck
{
    public ICollection<Special> Specials { get; set; } = new List<Special>();
}
```

**One** of those three properties is a column in the database.

---

<!-- _footer: '🖥️ Demo §3 · cascade is chosen for you' -->

## Cascade is chosen for you

`int TruckId` — required. So EF picks:

```csharp
onDelete: ReferentialAction.Cascade
```

<br>

**Delete the truck, and its specials go with it.**

Nobody typed that. It was inferred from a missing `?`.

---

<!-- _footer: '🖥️ Demo §4 · empty is not missing' -->

## Empty is not missing

A navigation property is **empty until the query asks**.

```csharp
_context.Trucks
    .Include(t => t.Specials)
    .FirstOrDefault(t => t.Id == id);
```

<br>

No exception. No warning. No log line.

**An empty list looks exactly like a truck with no specials.**

---

<!-- _footer: '🖥️ Demo §5 · predict the count' -->

## How many SELECTs?

Seven trucks on the page. Each card wants a count.

```csharp
foreach (var truck in trucks)
{
    counts[truck.Id] = _context.Specials.Count(s => s.TruckId == truck.Id);
}
```

<br>

**The terminal is about to tell you. Guess first.**

---

<!-- _footer: '🖥️ Demo §5 · one JOIN' -->

## One JOIN

```csharp
_context.Trucks.Include(t => t.Specials).ToList()
```

```sql
SELECT t.Id, t.Name, ..., s.Id, s.Price, s.ServedOn
FROM Trucks AS t
LEFT JOIN Specials AS s ON t.Id = s.TruckId
ORDER BY t.Id
```

**Eight queries became one.** `Include` is per query — it is
not a setting, and it is not remembered for the next one.

---

<!-- _footer: '🖥️ Demo §6 · one view, two things' -->

## One view, two things

```csharp
var alsoHere = (List<Truck>)ViewData["AlsoHere"]!;
```

A cast **and** a `!`, in a view, to get one list out of a bag of `object`.

<br>

When a view needs more than one thing, **give it a type that holds both**.

That type is a **ViewModel**. It has no table, and it never goes in the `DbContext`.

---

<!-- _footer: '🖥️ Demo §7 · the dropdown' -->

## SelectList

Three things: the rows, the value, the words a human reads.

```csharp
new SelectList(_context.Trucks.OrderBy(t => t.Name), "Id", "Name")
```

```html
<select asp-for="Special.TruckId" asp-items="Model.Trucks">
```

<br>

The `<option value>` is the **foreign key**. That is the whole mechanism.

---

<!-- _footer: '🖥️ Demo §7 · the list is not an answer' -->

## The list is not an answer

> The Trucks field is required.

...pointing at a dropdown with a truck plainly selected.

<br>

Week 6's rule, in a new place: **a non-nullable property is a required field.**
The list of choices is never posted back. It is not an answer.

```csharp
public SelectList? Trucks { get; set; }
```

---

<!-- _footer: '🖥️ Demo §8 · closing a file takes the children' -->

## Closing a file takes the children

Week 8's reading asked it: *what happens to the review if the trail is deleted?*

<br>

**It is deleted too**, and nothing asks twice.

<br>

You did not choose that. `int` chose it for you back on slide 5.

A page that asks *"are you sure"* has to say **what else is about to go**.

---

<!-- _footer: '🖥️ Demo §9 · the join was already there' -->

## One more foreign key

Three trucks type `"Cheese Curds"`. Nobody can ask *who serves it*.

```csharp
public int DishId { get; set; }   // one line
```

<br>

`Special` was a **detail of a truck**. Now it is the **link** between a truck
and a dish, carrying the price and the day.

**That is a many-to-many** — and the join has to be its own class
precisely because it carries something.

---

<!-- _footer: '🖥️ Demo §10 · hand off to the lab' -->

## Lab: the Registry gets a sightings log

1. `Sighting`, and the count stops being a number you typed
2. Migrate and seed the accounts
3. `Include` — make them appear
4. The report form, with its creature dropdown
5. Closing a file says what goes with it

<br>

**⏱️ 55 minutes · target tonight: 1–5 green.**

---

<!-- _footer: '🖥️ Demo §11 · wrap-up' -->

## Tonight, in one picture

| | |
|---|---|
| **Foreign key** | a column. `int` means required, and required means cascade |
| **Navigation** | not a column. Empty until `Include` asks |
| **`Include`** | per query. Adding it here does nothing over there |
| **ViewModel** | one view, more than one thing. No table, ever |
| **Join entity** | two foreign keys and a payload. A many-to-many with luggage |
