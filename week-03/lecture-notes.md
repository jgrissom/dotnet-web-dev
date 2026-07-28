# Week 3 — Lecture Notes

## Part 1: How the web actually works (30 min)

The pivot night: for two weeks the browser did all the work. Tonight we build the other side of the conversation from week 1's diagram.

### A raw HTTP request and response

HTTP is just text. When the browser asks for the coffee shop page, it literally sends something like:

```
GET /week-02/demo/ HTTP/1.1
Host: jgrissom.github.io
Accept: text/html
```

And the server sends back:

```
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html> ...the whole page...
```

- A request has a **verb**, a **path**, and **headers**. A response has a **status code**, headers, and a **body**.
- Everything this semester — every page, every form post, every API call in week 14 — is this exchange, repeated.

> [!TIP]
> **Do this:** open the hosted coffee page, F12 → **Network** tab, refresh. Click the first request — there's the real request and response, headers and all. Click a CSS request too: same shape, different `Content-Type`. Demystified.

### Verbs and status codes

| Verb | Meaning | This course |
|------|---------|-------------|
| `GET` | "give me this" — safe, repeatable | every page view |
| `POST` | "here's data, do something" | forms (week 6), creating records (week 8) |
| `PUT` / `DELETE` | update / remove | Web API (week 14) |

| Code | Meaning | You'll meet it |
|------|---------|----------------|
| `200` | OK | constantly |
| `302` | redirect ("look over there") | after form posts, login (week 11) |
| `404` | not found | tonight, the first time a route doesn't match |
| `500` | server blew up | your first exception |

> [!IMPORTANT]
> Status codes are the server's **only** way to tell the browser how it went. When something breaks this semester, the code is your first clue: 404 = routing problem, 500 = your code threw, 302-loop = auth misconfiguration.

## Part 2: Your first ASP.NET Core app (40 min)

### dotnet new mvc

```bash
dotnet new mvc -o CommonGrounds.Web --no-https
cd CommonGrounds.Web
dotnet run
```

Open the printed `http://localhost:5xxx` — a working, styled site in three commands. (`--no-https` keeps localhost simple this semester; real deployments get HTTPS from Azure automatically.)

> [!TIP]
> `dotnet watch` instead of `dotnet run` = auto-restart on save. Worth teaching immediately — it's the refresh-after-save habit from weeks 1–2, ported to C#.

### Project anatomy

The template tour — connect every folder to something they already know:

```
CommonGrounds.Web/
├─ Program.cs            ← the app: pipeline + routing, ~20 lines
├─ Controllers/
│  └─ HomeController.cs  ← C# classes that answer requests
├─ Views/
│  ├─ Home/              ← one folder per controller
│  └─ Shared/_Layout.cshtml  ← THE site shell (week 5 lives here)
└─ wwwroot/              ← static files, served as-is
   └─ lib/bootstrap/     ← hey, it's your friend from week 2!
```

- `wwwroot/lib/bootstrap` is the **locally bundled** Bootstrap promised in week 2 — the second delivery style, as foretold.
- `_Layout.cshtml`: open it, point at the navbar and the Bootstrap classes they recognize. Don't linger — week 5 is the deep dive.

### Program.cs — the whole pipeline

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();

var app = builder.Build();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
```

- Read it as a story: build the app → requests flow through middleware (static files first!) → routing decides which controller answers → run forever.
- **C# bridge:** this is a normal C# `Main` — top-level statements, but still just a program that starts a server and waits.

> [!NOTE]
> That `pattern` line is the single most important line of the night — Part 3 is entirely about what it means.

## Part 3: The MVC pattern (45 min)

### The request's journey

```
GET /Menu/Special?item=chai
   │
   ▼ routing: {controller}/{action}
MenuController.Special(string item)     ← C# runs, decides things
   │
   ▼ returns a result
View (.cshtml) → rendered HTML  ─────►  browser
```

- **Model** = the data (arrives properly in week 6–7), **View** = the HTML template, **Controller** = the C# that connects them.
- Land this: the URL is not a file path anymore. `/Menu/Special` doesn't find a file — it finds a **method**.

### Routing: {controller}/{action}

`{controller=Home}/{action=Index}/{id?}` decodes as:

| URL | Controller class | Method |
|-----|-----------------|--------|
| `/` | `HomeController` | `Index()` |
| `/Home/Privacy` | `HomeController` | `Privacy()` |
| `/Menu` | `MenuController` | `Index()` |
| `/Menu/Special` | `MenuController` | `Special()` |

- The `Controller` suffix is added by convention; the defaults (`=Home`, `=Index`) explain why `/` works.
- **Predict-then-run material:** type URLs, ask the room which method runs — including one that 404s.

### Controllers and actions

```csharp
public class MenuController : Controller
{
    public IActionResult Index()
    {
        return View();          // renders Views/Menu/Index.cshtml — by convention
    }
}
```

- An **action** is just a public method on a controller. `return View()` finds the matching `.cshtml` by *name convention* — no wiring, no registration.
- Convention over configuration is the whole ASP.NET personality; say the phrase now, it recurs all semester.

### Views and Razor

```html
@{
    ViewData["Title"] = "Menu";
}
<h1>Today's Menu</h1>
<p>Everything is @ViewData["Title"] — rendered on the server.</p>
```

- Razor = HTML with `@` escape hatches into C#. This week: a taste. Week 4 is the deep dive (loops, conditionals, models in views).
- View Source in the browser: **there's no Razor in what the browser gets** — the server rendered pure HTML. That's the difference from weeks 1–2.

### Passing data: ViewData and parameters

```csharp
public IActionResult Special(string? item)
{
    return Content($"Today's special: {item ?? "espresso"}!");
}
```

- `/Menu/Special?item=chai` → the query string **binds** to the parameter by name. Magic named *model binding* — week 6 makes it a big deal; tonight it's one parameter.
- `Content(...)` returns raw text — the simplest possible action result, perfect for seeing binding work. `View()` and `Content()` are both `IActionResult`s: actions return *results*, not strings.
- **C# bridge:** `string? item` + `??` — the null-coalescing default they know, doing real web work.

## Part 4: To the cloud — Azure App Service (35 min)

### What App Service is

```
your laptop ── az webapp up ──►  Azure App Service ──►  https://your-app.azurewebsites.net
                (zips + ships)      (runs dotnet on         (public URL, HTTPS free)
                                     a managed server)
```

- Same idea as GitHub Pages was for static files — but this server **runs your C#**. Pages can't do that; this is why Azure enters the story now.
- Students activated Azure for Students in week 2's homework. Tonight verifies it paid off.

### az webapp up

Students follow **[deploy-guide.md](deploy-guide.md)** (install `az`, login, deploy — ✓-checkpoints like setup night). The command, from inside the web project folder:

```bash
az webapp up --name cg-web-XX1234 --sku F1 \
  --runtime DOTNETCORE:10.0 --location northcentralus
```

- `--name` becomes the public URL — globally unique, hence the initials+digits convention.
- `--sku F1` = the free tier. Fine for coursework; falls asleep when idle (first request after a nap is slow — that's normal, say it now).
- `--location northcentralus` is **non-negotiable**: unpinned student deployments sometimes land in Canada, and the school SQL Server geo-blocks non-US requests — invisible tonight, fatal in week 7. `az appservice list-locations --sku F1 --output table` shows what a subscription allows if the region is rejected.
- Re-running the same command later **redeploys** — that's the whole update story for homework.

> [!IMPORTANT]
> Run it from *inside* the web project folder (`FirstFlight.Web/`, not the solution folder) — `az webapp up` ships the folder it's standing in. Deploying the solution root is the #1 failure tonight.

> [!WARNING]
> Keep apps deployed until grades post — the grader visits the live URL. Semester cleanup (deleting resource groups) happens week 16, together.

## Wrap-up (10 min)

- **Tonight:** HTTP demystified, first server-side app, the MVC request journey, and code running on the actual internet.
- **Homework:** finish the lab to 6/6, deploy it, submit the URL. Same rhythm as ever: checker green → ship → submit.
- **Next week:** routing and Razor go deep — real pages with loops, conditionals, and multiple views.

## Appendix: Troubleshooting

**`dotnet new mvc` works but `dotnet run` shows a blank/error page**
- Check the terminal — the real error is printed there, not in the browser. (First taste of server-side debugging: the console is your friend now.)

**404 on a page that "should" exist**
- Route → action → view, in that order: does the URL match `{controller}/{action}`? Does that method exist and is it `public`? Does the view file exist in the right folder with the right name? One of the three is off.

**Changes don't show up**
- Using `dotnet run`? It doesn't watch files — restart it, or switch to `dotnet watch`.
- Browser cache on static files: hard refresh (Ctrl+Shift+R).

**`az` not recognized**
- Same story as `dotnet` on setup night: close and reopen the terminal after installing.

**`az webapp up` says the name is taken**
- Names are global across all of Azure. Add more digits; move on.

**Deployed site shows a generic Azure page or 500**
- Wrong folder deployed (run from the web project folder), or wrong runtime — `az webapp list-runtimes --os-type linux | grep -i dotnet` shows valid values.

**Free-tier app is asleep**
- First request after idle takes ~30s. Refresh once, wait, refresh again. Normal for F1.
