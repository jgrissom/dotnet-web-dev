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

# Week 15 — Polish

.NET Web Development · Week 15 of 16

**Tonight: the same app, easier to use and easier to read**

1. **A message after every change** — and why it needs `TempData`
2. **Search and a filter** — in the address bar
3. **Pages** — `Skip` and `Take`
4. **Services** — where `_context` has been coming from
5. **How long a service lasts** — `AddScoped` and its two neighbors

---

<!-- _footer: '🖥️ Demo §2 · one request, or until it’s read' -->

## One request, or until it's read

```
POST /Trucks/Create   sets the message, answers 302
GET  /Trucks          a second request: this one renders the page
```

| | Lives for | Survives a redirect? |
|---|---|---|
| `ViewData` | one request | no |
| **`TempData`** | **until it's read** | **yes** |

Week 6's redirect is why the message needs `TempData`.

---

<!-- _footer: '🖥️ Demo §3 · the address bar is the search' -->

## The address bar is the search

```
/Trucks?search=mil&city=Milwaukee
```

```csharp
public IActionResult Index(string? search, string? city)
```

Model binding, the same as week 3's `?name=Ada`.

**A GET, not a POST:** it changes nothing, so a result can be bookmarked, shared and reloaded, and reading stays public.

---

<!-- _footer: '🖥️ Demo §4 · a page is Skip and Take' -->

## A page is Skip and Take

| Page | `Skip((page - 1) * 3)` | `Take(3)` |
|---|---|---|
| 1 | 0 | rows 1–3 |
| 2 | 3 | rows 4–6 |
| 3 | 6 | rows 7–8 |

**The order matters:** `Where` → `Count` → `OrderBy` → `Skip` → `Take`

Search before you cut. Sort before you cut.

---

<!-- _footer: '🖥️ Demo §5 · where the context comes from' -->

## Where `_context` comes from

```
Program.cs                         a constructor asks
───────────────────────────        ─────────────────────────
AddDbContext<CurbsideContext>  ◀── CurbsideContext context
AddIdentity<AppUser, …>        ◀── UserManager<AppUser>
AddScoped<ITruckService, …>    ◀── ITruckService trucks
```

Everything registered in `Program.cs` goes in **the container**.
A class asks in its constructor, and the container builds it and hands it over.
That is **dependency injection**.

---

<!-- _footer: '🖥️ Demo §5 · one line changes' -->

## Why ask for the interface

```csharp
builder.Services.AddScoped<ITruckService, TruckService>();
builder.Services.AddScoped<ITruckService, EmptyTruckService>();
```

`TrucksController` asks for `ITruckService`. **It never names a class.**

Change one line in `Program.cs`, and every page that asks gets the new one.
The controller doesn't change.

---

<!-- _footer: '🖥️ Demo §6 · how long one lasts' -->

<style scoped>
  section table { font-size: 0.74em; }
</style>

## How long one lasts

| Registered with | You get | Use it for |
|---|---|---|
| `AddTransient` | a new one every time it's asked for | small, stateless helpers |
| **`AddScoped`** | **one per request** | **anything that holds the context** |
| `AddSingleton` | one for the whole app | something shared, with no context |

`AddDbContext` registers the context as **scoped**.
At startup there is no request, so the seeder needs **`CreateScope`**.

---

<!-- _footer: '🖥️ Demo §7 · wrap-up' -->

## Tonight, in one picture

| | |
|---|---|
| **The message** | `TempData`: survives the redirect, read once |
| **Search** | a GET, so the address bar holds the result |
| **Pages** | `Where`, `Count`, `OrderBy`, then `Skip` and `Take` |
| **A service** | the query moves out; the controller asks for an interface |
| **The container** | `Program.cs` decides what every constructor gets |
