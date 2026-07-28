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

# Week 3 — Hello, Server

.NET Web Development · Week 3 of 16

---

## Tonight: the pivot

- Two weeks on the **client** side. Tonight we build the **server**.
- How HTTP actually works — the text under everything
- `dotnet new mvc` — your first server-side app
- The MVC pattern: URL → C# method → HTML
- **Your code, live on Azure, before you leave**

---

## HTTP is just text

The browser sends:

```
GET /week-02/demo/ HTTP/1.1
Host: jgrissom.github.io
```

The server answers:

```
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html> ...
```

Verb + path in · status + body out. That's the whole internet.

---

## Verbs

| Verb | Meaning | You'll use it |
|------|---------|---------------|
| `GET` | "give me this" | every page view |
| `POST` | "here's data" | forms — week 6 |
| `PUT` / `DELETE` | update / remove | Web API — week 14 |

---

<!-- _footer: '🎨 demo time — script §1: watch real HTTP in DevTools' -->

## Status codes

| Code | Meaning | First sighting |
|------|---------|----------------|
| `200` | OK | constantly |
| `302` | redirect | after form posts |
| `404` | no route matched | tonight, probably |
| `500` | your code threw | eventually, definitely |

When it breaks: **the status code is clue #1.**

---

## Two commands to a working site

```bash
# VS Code: File → Open Folder → a new, empty  CommonGrounds.Web
dotnet new mvc --no-https    # scaffolds into THIS folder — name = folder name
dotnet watch                 # runs + restarts on every save
```

- A styled, working site on `localhost` — before you write any code
- `dotnet watch` = your refresh-after-save habit, ported to C#

---

## Project anatomy

```
CommonGrounds.Web/
├─ Program.cs             ← the app, ~20 lines
├─ Controllers/           ← C# classes that answer requests
├─ Views/                 ← .cshtml templates (one folder per controller)
│  └─ Shared/_Layout.cshtml   ← the site shell (week 5)
└─ wwwroot/               ← static files
   └─ lib/bootstrap/      ← week 2's friend, bundled locally!
```

---

<!-- _footer: '🎨 demo time — script §2: create it, run it, tour it' -->

## Program.cs — a five-act story

```csharp
var builder = WebApplication.CreateBuilder(args);   // 1 shopping list
builder.Services.AddControllersWithViews();
var app = builder.Build();                          // 2 build the machine
if (!app.Environment.IsDevelopment())
    app.UseExceptionHandler("/Home/Error");         // 3 the gauntlet…
app.UseRouting();
app.UseAuthorization();
app.MapStaticAssets();
app.MapControllerRoute(                             // 4 THE map 🥁
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();
app.Run();                                          // 5 open the doors
```

---

## The request's journey

```
GET /Menu/Special?item=chai
   │
   ▼  routing: {controller}/{action}
MenuController.Special(string item)      ← C# decides
   │
   ▼
View (.cshtml) → rendered HTML → browser
```

The URL doesn't find a **file** anymore. It finds a **method**.

---

## Routing: the pattern decoded

`{controller=Home}/{action=Index}/{id?}`

| URL | Class | Method |
|-----|-------|--------|
| `/` | `HomeController` | `Index()` |
| `/Home/Privacy` | `HomeController` | `Privacy()` |
| `/Menu` | `MenuController` | `Index()` |
| `/Menu/Special` | `MenuController` | `Special()` |

Predict before each Enter — including the one that 404s.

---

## Controllers and actions

```csharp
public class MenuController : Controller
{
    public IActionResult Index()
    {
        return View();   // finds Views/Menu/Index.cshtml — by convention
    }
}
```

- An **action** = a public method on a controller
- No wiring, no registration — **convention over configuration**

---

## Views and Razor — first taste

```html
@{
    ViewData["Title"] = "Menu";
}
<h1>Today's Menu</h1>
<p>Everything is @ViewData["Title"] — rendered on the server.</p>
```

- Razor = HTML with `@` escape hatches into C#
- **View Source:** the browser receives pure HTML. No Razor survives.

---

<!-- _footer: '🎨 demo time — script §3: a new page + a greeting with a parameter' -->

## Passing data in

```csharp
public IActionResult Special(string? item)
{
    return Content($"Today's special: {item ?? "espresso"}!");
}
```

- `/Menu/Special?item=chai` — the query string **binds** to the parameter
- `Content()` = raw text result; `View()` = HTML result — actions return *results*

---

## Azure App Service

```
laptop ── az webapp up ──► App Service ──► https://you.azurewebsites.net
           (zips + ships)    (runs your C#)     (public, HTTPS free)
```

- GitHub Pages served your *files*. App Service runs your *code*.
- You activated Azure for Students last week — tonight it pays off

---

<!-- _footer: '🎨 demo time — script §4: ship it to Azure, live' -->

## One command to the cloud

```bash
cd FirstFlight.Web        # ← INSIDE the web project folder
az webapp up --name ff-web-XX1234 --sku F1 \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

- `--name` = your public URL — globally unique (initials + digits)
- `--sku F1` = free tier (naps when idle; first wake-up is slow — normal)
- `--location` = **your US region** (guide step 3 finds it) — non-US regions have never worked with the school DB

---

## Lab: First Flight

- Copy `week-03/lab/starter/` out of the repo clone
- `dotnet test` → **1 / 6 passing** — turn the other five green
- Brand it · add an About page · put it in the nav · greet by name
- Same rhythm as always: one ❌ at a time

---

## Before next week

- ✅ Lab to **6 / 6** (`dotnet test`)
- ✅ **Deploy it** — `deploy-guide.md` walks every step; submit your Azure URL
- ✅ 3+ meaningful commits, pushed
- **Next week:** Razor for real — loops, conditionals, and pages built from data

---

## The semester, from tonight's summit

- Week 4–6: better pages, real forms, validation
- Week 7: the database arrives
- Tonight you own the whole pipeline: **browser → HTTP → routing → C# → HTML → Azure**

Everything else is refinement.
