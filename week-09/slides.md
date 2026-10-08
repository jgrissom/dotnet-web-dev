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

<!-- _footer: '🖥️ Demo §1 · the three words' -->

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

<!-- _footer: '🖥️ Demo §5 · one JOIN' -->

## One JOIN

| | |
|---|---|
| **A query inside the loop** | 1 for the trucks + 1 per truck = **8** |
| **`Include`** | **1**, with a `LEFT JOIN` in it |

<br>

`Include` is **per query**.

It is not a setting on the model,

and it is not remembered for the next query.

---

<!-- _footer: '🖥️ Demo §6 · one view, two things' -->

## One view, two things

When a view needs more than one thing,

**give it a type that holds both.**

<br>

That type is a **ViewModel**.

- It has **no table**
- It never goes in the `DbContext`
- It lives in `ViewModels/`, not `Models/`

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

<!-- _footer: '🖥️ Demo §9 · the join was already there' -->

## One more foreign key

```
 Truck  1 ────── *  Special  * ────── 1  Dish
                    TruckId
                    DishId
                    Price · ServedOn
```

`Special` was a **detail of a truck**.

Now it is the **link** between a truck and a dish.

**That is a many-to-many** — and the join is its own class
because it carries the price and the day.

---

<!-- _footer: '🖥️ Demo §10 · wrap-up' -->

## Tonight, in one picture

| | |
|---|---|
| **Foreign key** | a column. `int` means required, and required means cascade |
| **Navigation** | not a column. Empty until `Include` asks |
| **`Include`** | per query. Adding it here does nothing over there |
| **ViewModel** | one view, more than one thing. No table, ever |
| **Join entity** | two foreign keys and a payload. A many-to-many with luggage |
