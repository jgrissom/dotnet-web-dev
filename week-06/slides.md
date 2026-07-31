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

# Week 6 — Forms & Validation

.NET Web Development · Week 6 of 16

---

<!-- _footer: '🖥️ Demo §1 · frame it' -->

## Five weeks, one direction

The browser asked. You told.

<br>

**Tonight it comes back the other way** — and three questions arrive with it:

- How does their typing become a C# object?
- Who decides whether it's any good?
- Where does it go?

---

<!-- _footer: '🖥️ Demo §1 · frame it' -->

## GET vs. POST

<style scoped>
  /* the "no" and the sentence it causes, in one colour — they are one idea */
  tbody tr:last-child strong,
  section p strong { color: #ffa657; }
</style>

| | GET | POST |
|---|---|---|
| Means | "give me this" | "here, take this" |
| Data rides | in the URL | in the **body** |
| Repeat safely? | yes | **no** |

<br>

**That last row is why tonight ends with a redirect.**

---

<!-- _footer: '🖥️ Demo §1 · the plain form' -->

## A form, with no help at all

```html
<form method="post">
    <label>Name <input name="Name" /></label>
    <label>Cuisine <input name="Cuisine" /></label>
    <button type="submit">Add it</button>
</form>
```

```csharp
[HttpPost]
public IActionResult Create(Truck truck)
{
    Console.WriteLine($"built a {truck.GetType().Name}");
    Console.WriteLine($"Rating {truck.Rating}  x2 = {truck.Rating * 2}");
    return Content("look at the terminal 👀");
}
```

---

<!-- _footer: '🖥️ Demo §1 · the Network tab' -->

## What arrived — in the terminal

```
── model binding built a Truck ──
   Name      Wurst Case Scenario
   Cuisine   German
   Rating    4.1   (x2 = 8.2)
```

**You wrote nothing to build that** — and you can't multiply a string.

<br>

The browser only ever sent text:

```
Name=Wurst+Case+Scenario&Cuisine=German&City=Appleton
```

---

<!-- _footer: '🖥️ Demo §1 · break #1' -->

## Two silent failures

```html
<input name="Food" />     <!-- was name="Cuisine" -->
```

...and someone types `banana` into Rating.

<br>

### Neither one is an error. So what do you get?

---

<!-- _footer: '🖥️ Demo §1 · break #2' -->

## Two actions, one name

```csharp
public IActionResult Create()            // GET
[HttpPost]
public IActionResult Create(Truck truck) // POST
```

C# calls these overloads. **Routing only sees `/Trucks/Create`.**

<br>

Drop `[HttpPost]` and both claim every verb:
`AmbiguousMatchException`

---

<!-- _footer: '🖥️ Demo §2 · asp-for' -->

## `asp-for` — one attribute, four jobs

```html
<label asp-for="Name" class="form-label"></label>
<input asp-for="Name" class="form-control" />
```

becomes

```html
<label class="form-label" for="Name">Name</label>
<input class="form-control" type="text" id="Name" name="Name" />
```

**name** · **id + for** · **label text** · **input type**

---

<!-- _footer: '🖥️ Demo §2 · the whole form' -->

## Three sockets per field

```html
<div class="mb-3">
    <label asp-for="Name" class="form-label"></label>
    <input asp-for="Name" class="form-control" />
    <span asp-validation-for="Name" class="text-danger"></span>
</div>
```

<br>

The `<span>` renders **empty**. It's where the error will go.

---

<!-- _footer: '🖥️ Demo §2 · the whole form' -->

## A checkbox casts a shadow

```html
<input type="checkbox" name="IsOpenLate" value="true" />
<input type="hidden"   name="IsOpenLate" value="false" />
```

<br>

An unchecked box sends **nothing at all**.

Without the hidden field, "no" and "missing" look identical.

---

<!-- _footer: '🖥️ Demo §2 · the hidden field' -->

## The field you didn't write

```html
<input name="__RequestVerificationToken" type="hidden" ... />
```

Razor adds it to **every** `<form method="post">`.

<br>

It's already in the page. This is what makes the server *look*:

```csharp
[HttpPost]
[ValidateAntiForgeryToken]
```

---

<!-- _footer: '🖥️ Demo §3 · where rules live' -->

## Where do the rules live?

Somebody has to say what a valid `Truck` is.

- **In the view?** Rules in markup can't be reused
- **In the controller?** Every action grows the same `if`s

<br>

### On the model. One description, everyone reads it.

---

<!-- _footer: '🖥️ Demo §3 · annotations' -->

## Data annotations

```csharp
[Required(ErrorMessage = "Every truck needs a name.")]
[StringLength(50, MinimumLength = 2)]
public string Name { get; set; } = "";

[Range(1, 5, ErrorMessage = "Ratings run from {1} to {2}.")]
public double Rating { get; set; }

[Display(Name = "Open late?")]
public bool IsOpenLate { get; set; }
```

---

<!-- _footer: '🖥️ Demo §3 · annotations' -->

## ...and they end up in the HTML

```html
<input data-val="true"
       data-val-required="Every truck needs a name."
       maxlength="50" name="Name" />
```

<br>

Nobody is reading those yet.

**Remember them — they come back in twenty minutes.**

---

<!-- _footer: '🖥️ Demo §3 · ModelState' -->

## The guard

```csharp
[HttpPost]
public IActionResult Create(Truck truck)
{
    if (!ModelState.IsValid)
        return View(truck);      // their input + the errors

    truck.Id = TruckData.All.Max(t => t.Id) + 1;
    TruckData.All.Add(truck);
    return RedirectToAction(nameof(Index));
}
```

`IsValid` is a **question**. Validation already ran.

---

<!-- _footer: '🖥️ Demo §3 · break #3' -->

## Delete the guard

Submit a truck with **no name**, rated **9000**.

<br>

### What stops it?

---

<!-- _footer: '🖥️ Demo §3 · break #3' -->

## Attributes describe. The guard decides.

The annotations worked perfectly.

They wrote the problem down, and nobody read it.

---

<!-- _footer: '🖥️ Demo §3 · break #4' -->

## Redirect, don't render

```csharp
return View("Index", TruckData.All);   // works!
```

The list appears. The URL still says `/Trucks/Create`.

<br>

### Now hit refresh.

**POST → Redirect → GET.** It's why every form bounces you.

---

<!-- _footer: '🖥️ Demo §4 · the validation partial' -->

## The partial from last week

`Views/Shared/_ValidationScriptsPartial.cshtml`

```html
<script src="~/lib/jquery-validation/dist/jquery.validate.min.js"></script>
<script src="~/lib/jquery-validation-unobtrusive/..."></script>
```

```html
@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

A partial. In a section. Both of last week's ideas, one job.

---

<!-- _footer: '🖥️ Demo §4 · the validation partial' -->

## One source of truth

Those scripts read the **`data-val-*` attributes** from twenty minutes ago.

<br>

`Models/Truck.cs` → the HTML → the browser
`Models/Truck.cs` → `ModelState` → the server

**One file. Two enforcers.**

---

<!-- _footer: '🖥️ Demo §4 · why both' -->

## Why both

**Client-side** — instant feedback, no round trip. A courtesy.

<br>

**Server-side** — the only copy that enforces anything.

<br>

### Anything in the browser is a suggestion.

It's someone else's computer.

---

<!-- _footer: '🖥️ Demo §5' -->

## Where did the truck go?

`Ctrl+C`. Restart. Reload.

<br>

**Six trucks.**

```csharp
public static List<Truck> All { get; } = new() { ... };
```

A variable in a running program. **Next week: a table.**

---

<!-- _footer: '🖥️ Demo §6' -->

## Lab: the Registry takes reports

- **2** — rules on `Cryptid.cs`
- **3** — the form page, and a link to it
- **4** — the POST action: id, add, redirect
- **5** — the `ModelState.IsValid` guard
- **6** — validation in the browser

**⏱️ 50 minutes · target tonight: 1–5 green.**

---

<!-- _footer: '🖥️ Demo §7' -->

## Tonight, in one picture

```
GET  /Create → empty form
POST /Create → binding  (by name attribute)
             → ModelState  (from the annotations)
   invalid?  → View(truck)      same form, red messages
   valid?    → Add + Redirect → GET /Trucks
```

- **Homework:** your app gets a Create form
- **Next week:** the list becomes a SQL Server table
