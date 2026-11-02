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

# Week 13 — Web API

.NET Web Development · Week 13 of 16

**Tonight: your app answers programs**

1. **The first endpoint** — a controller, then minimal
2. **One truck with its menu** — the loop, and DTOs
3. **Testing a write** — POST, and the tester
4. **Who may write** — PUT, DELETE, 401 and 403
5. **Why there's no token**

---

<!-- _footer: '🖥️ Demo §1 · same data, no page' -->

## One request, two answers

```html
<div class="card">
  <h5 class="card-title">Roll Models</h5>
  <p class="card-text">Korean · Madison</p>
  ...
```

```json
{ "id": 1, "name": "Roll Models", "cuisine": "Korean", "city": "Madison" }
```

A **web API** is a set of addresses that answer with data.
**The JSON shape is the object syntax from week 1.** Your pages stay.

---

<!-- _footer: '🖥️ Demo §2 · what’s different about it' -->

<style scoped>
  section table { font-size: 0.85em; }
</style>

## Two kinds of controller

| | A page | An API |
|---|---|---|
| inherits | `Controller` | `ControllerBase` |
| on the class | — | `[ApiController]` |
| its address | the pattern in `Program.cs` | `[Route("api/trucks")]` |
| an action returns | `View(...)` | the data |

**`[ApiController]` is a small attribute that changes a lot.**

---

<!-- _footer: '🖥️ Demo §3 · the same thing, minimal' -->

<style scoped>
  section pre { font-size: 0.62em; }
  section table { font-size: 0.8em; }
</style>

## Two ways to write an endpoint

```csharp
// a controller: a class, a constructor, an action
[HttpGet]
public async Task<List<Truck>> GetAll()
{
    return await _context.Trucks.ToListAsync();
}
```

```csharp
// minimal: one statement in Program.cs
app.MapGet("/api/trucks/count", async (CurbsideContext db) =>
    new { count = await db.Trucks.CountAsync() });
```

| One small endpoint | **minimal** |
|---|---|
| Several that share a route, a context and a rule | **a controller** |

---

<!-- _footer: '🖥️ Demo §4 · the cycle' -->

## The loop in the JSON

```
  Truck 2
   └─ Specials[0]
       └─ Truck        ← Truck 2 again
           └─ Specials[0]
               └─ Truck        ← and again
```

`JsonException: A possible object cycle was detected`

Your **model** is the shape of your tables.
A **DTO** is the shape of your JSON: a ViewModel for a program.

---

<!-- _footer: '🖥️ Demo §5 · the status is the answer' -->

<style scoped>
  section table { font-size: 0.82em; }
</style>

## Verbs and statuses

| Verb | Means | Status | Means |
|---|---|---|---|
| `GET` | read | `200` | here it is |
| `POST` | add | `201` | created, and `Location` says where |
| `PUT` | change | `204` | done, nothing to send back |
| `DELETE` | remove | `400` | your JSON broke a rule |
| | | `401` | who are you? |
| | | `403` | you can't do that |
| | | `404` | no such thing |

---

<!-- _footer: '🖥️ Demo §6 · three visitors' -->

## A page redirects. An API answers.

| Who sends the write | A page | The API |
|---|---|---|
| not signed in | `302` to `/Account/Login` | **`401`** |
| signed in, no role | `302` to `/Account/AccessDenied` | **`403`** |
| signed in, with the role | the form | **`201`, `204`** |

<br>

`[ApiController]` makes the change. **Week 10's Missing page** still prints itself behind the status, until `UseWhen` keeps it off `/api`.

---

<!-- _footer: '🖥️ Demo §7 · why no token' -->

<style scoped>
  section table { font-size: 0.8em; }
</style>

## Why no token?

| What a token stops | Why the API doesn't need one |
|---|---|
| another site posting **a form** | a form can't send JSON: `415` |
| your cookie going with it | `SameSite=Lax`: not on another site's POST |
| another site's **JavaScript** | the browser blocks it: no permission from this app |

**Pages keep their tokens. An API doesn't use them.**

---

<!-- _footer: '🖥️ Demo §8 · wrap-up' -->

## Tonight, in one picture

| | |
|---|---|
| **An endpoint** | an address that answers with data |
| **`[ApiController]`** | 404s in JSON, automatic 400s, 401 not a redirect |
| **Minimal** | one statement; a controller for several |
| **A DTO** | the shape of your JSON, in and out |
| **The status** | what a program reads first |
