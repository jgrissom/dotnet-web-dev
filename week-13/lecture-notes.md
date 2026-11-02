# Week 13 — Dependency Injection, TempData, Paging, Filtering and Search

**What this covers:** a confirmation message that survives a redirect; a search box and a filter that live in the address bar; a list that comes in pages; moving a query into a service behind an interface; where every constructor's arguments have been coming from since week 7; and how long each of those things lasts.

**Nothing here changes your tables.** There is no migration this week.

**Keep this open while you work.** Every requirement in the homework has a section here, and the 🆘 section at the bottom of the homework links straight into it.

---

## Part 1: A message that survives a redirect

A curator adds a truck, the page reloads, and the site says nothing. The truck is there if you know where to look. With a longer list, you wouldn't know whether your click did anything.

### Why `ViewData` can't do it

The obvious tool is `ViewData`: set it in the POST, show it in the layout. It doesn't work, and the reason is two things you already know:

- **`ViewData` lasts for one request** (week 4).
- **`RedirectToAction` ends that request** (week 6). The POST answers with a 302, and the browser sends a brand new GET. That GET is what draws the page.

```
POST /Trucks/Create    sets ViewData, answers 302     ViewData is gone
GET  /Trucks           a new request, a new ViewData  the page, with no message
```

The redirect isn't the problem. It's what stops a refresh filing the form twice, and it stays.

### `TempData`

**`TempData` lives until something reads it.** It looks exactly like `ViewData`, and ASP.NET carries it between the two requests in a cookie.

**In the POST, just above the redirect** — this goes inside the `Create` action you already have:

```csharp
_context.Trucks.Add(truck);
_context.SaveChanges();

TempData["Message"] = $"{truck.Name} is on the street.";
return RedirectToAction(nameof(Index));
```

**In `Views/Shared/_Layout.cshtml`, just above `@RenderBody()`,** so that every page can show one:

```cshtml
            @if (TempData["Message"] != null)
            {
                <div class="alert alert-success" role="alert">@TempData["Message"]</div>
            }
```

| | Lives for | Survives a redirect? |
|---|---|---|
| `ViewData` | one request | no |
| `TempData` | until it's read | yes |

Reading it removes it, so **reload the page and the message is gone**, which is what you want from a confirmation. `TempData.Keep()` and `TempData.Peek()` exist to keep one around; you don't need either.

Edit and Delete get a line each. In `DeleteConfirmed`, put it inside the `if`, so the message only appears when something was really removed.

`TempData` holds small, simple values. It's a cookie, so it's a poor place for a whole object.

**A form that only posts an id** has only the id. The Registry's report form posts `CryptidId`, so to name the creature in a message, look the name up first:

```csharp
var name = _context.Cryptids
    .Where(c => c.Id == form.Sighting.CryptidId)
    .Select(c => c.Name)
    .First();
```

---

## Part 2: Search and a filter

### The page's own model

The list page used to need one thing: a list. Now it needs what was searched for too, so the box can keep showing it. **A page that needs several things gets a ViewModel**, the same as week 9.

**`ViewModels/TruckListViewModel.cs`** — this is the whole file for now; Part 3 adds to it:

```csharp
using Curbside.Models;

namespace Curbside.ViewModels;

// What the list page needs: this page's trucks, plus the search that produced
// them, so the form can show what was typed.
public class TruckListViewModel
{
    public List<Truck> Trucks { get; set; } = new();
    public string? Search { get; set; }
    public string? City { get; set; }
    public List<string> Cities { get; set; } = new();
}
```

Change the view's first line to match: `@model TruckListViewModel`, and `Model.Trucks` wherever it used `Model` as a list. **Until the action and the view agree**, you get `The model item passed into the ViewDataDictionary is of type …`.

### The form

**In `Views/Trucks/Index.cshtml`, above the cards:**

```cshtml
<form method="get" class="row g-2 mb-4">
    <div class="col-md-6">
        <input type="search" name="search" value="@Model.Search" class="form-control"
               placeholder="Name, cuisine or city" aria-label="Search trucks" />
    </div>
    <div class="col-md-4">
        <select name="city" class="form-select" aria-label="Filter by city">
            <option value="">Every city</option>
            @foreach (var city in Model.Cities)
            {
                <option value="@city" selected="@(city == Model.City)">@city</option>
            }
        </select>
    </div>
    <div class="col-md-2">
        <button class="btn btn-secondary w-100">Search</button>
    </div>
</form>
```

**`method="get"` is the whole design.** A POST is for changing something. A search changes nothing, so it's a GET, and a GET puts its fields in the address bar:

```
/Trucks?search=mil&city=Milwaukee
```

So a result can be bookmarked, reloaded and sent to someone, and it needs no sign-in, because `Index` is still `[AllowAnonymous]`. There's no `action` on the form, so it goes back to the page it's on. There's no antiforgery token either: those protect POSTs.

The box's `name` is what the action's parameter has to match. That's week 3's model binding: `?name=Ada` filled in `string name`, and `?search=mil` fills in `string? search`. It's `string?` because a visitor who hasn't searched sends nothing.

`value="@Model.Search"` puts what they typed back in the box. `selected="@(city == Model.City)"` does the same for the dropdown: Razor leaves the attribute out when it's false.

### A query built in stages

**Inside `TrucksController`, replacing the `Index` method:**

```csharp
    public IActionResult Index(string? search, string? city)
    {
        // Nothing runs yet: this builds the query, and each Where adds to it.
        var trucks = _context.Trucks
            .Include(t => t.Specials)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            trucks = trucks.Where(t => t.Name.Contains(search)
                                    || t.Cuisine.Contains(search)
                                    || t.City.Contains(search));
        }

        if (!string.IsNullOrEmpty(city))
        {
            trucks = trucks.Where(t => t.City == city);
        }

        return View(new TruckListViewModel
        {
            Trucks = trucks.OrderBy(t => t.Name).ToList(),
            Search = search,
            City = city,
            Cities = _context.Trucks.Select(t => t.City).Distinct().OrderBy(c => c).ToList()
        });
    }
```

**A query isn't run when you write it.** `_context.Trucks.Include(…)` describes one, and `AsQueryable()` lets you add to the description. Each `Where` narrows what the one before it left. Only `ToList()` sends anything to the database, and by then it's one SQL statement with one `WHERE`.

`Where` with `Contains` becomes `LIKE '%…%'`. **Whether capitals matter is the database's decision, not your code's:** SQL Server's default ignores them, so `korean` finds Korean. The in-memory database behind `dotnet test` doesn't ignore them.

`Select(t => t.City).Distinct()` asks the database for each city once, which is how the dropdown gets its options without anyone typing them.

**A nullable column** needs one more check, or the compiler warns `CS8602`: `c.LatinName != null && c.LatinName.Contains(search)`. It's a warning, not a crash. In the database a `NULL` simply doesn't match.

### A filter's values don't have to be column values

The Registry's status dropdown offers *Unconfirmed* and *Debunked*, and the column is a `bool`:

```csharp
if (status == "debunked")
{
    cryptids = cryptids.Where(c => c.IsDebunked);
}
else if (status == "unconfirmed")
{
    cryptids = cryptids.Where(c => !c.IsDebunked);
}
```

Anything else, including nothing, leaves the list alone.

---

## Part 3: Pages

### The order matters

Three to a page means two numbers: how many rows to **skip**, and how many to **take**.

| Page | `Skip((page - 1) * 3)` | `Take(3)` |
|---|---|---|
| 1 | 0 | rows 1–3 |
| 2 | 3 | rows 4–6 |
| 3 | 6 | rows 7–9 |

Those two lines are short. Getting them in the right place is the actual work:

**`Where` → `Count` → `OrderBy` → `Skip` → `Take` → `ToList`**

- **`Where` first,** or you only search the page you're on.
- **`Count` before `Skip`,** or you only count the page you're on, and you can't work out how many pages there are.
- **`OrderBy` before `Skip`.** A database promises no order without one, so a row can turn up on two pages, or none. EF Core warns you in the terminal: `The query uses a row limiting operator ('Skip'/'Take') without an 'OrderBy' operator`.
- **`Math.Clamp(page, 1, totalPages)`.** Anybody can type a page number. Page 0 means skipping −3 rows, and SQL Server answers with `The offset specified in a OFFSET clause may not be negative`, which is a 500. Clamping lands them on the nearest real page.

**The ViewModel gets three numbers** — `ViewModels/TruckListViewModel.cs`, the whole file:

```csharp
using Curbside.Models;

namespace Curbside.ViewModels;

// What the list page needs: this page's trucks, where it is in the list, plus the search that produced
// them, so the form can show what was typed.
public class TruckListViewModel
{
    public List<Truck> Trucks { get; set; } = new();
    public string? Search { get; set; }
    public string? City { get; set; }
    public List<string> Cities { get; set; } = new();
    public int Page { get; set; }
    public int TotalPages { get; set; }
    public int TotalCount { get; set; }
}
```

**Inside `TrucksController`:** one line just below the `_context` field, `private const int PageSize = 3;`, and this `Index`:

```csharp
    public IActionResult Index(string? search, string? city, int page = 1)
    {
        // Nothing runs yet: this builds the query, and each Where adds to it.
        var trucks = _context.Trucks
            .Include(t => t.Specials)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            trucks = trucks.Where(t => t.Name.Contains(search)
                                    || t.Cuisine.Contains(search)
                                    || t.City.Contains(search));
        }

        if (!string.IsNullOrEmpty(city))
        {
            trucks = trucks.Where(t => t.City == city);
        }

        // Count what matched, before cutting it down to one page.
        var total = trucks.Count();
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)PageSize));
        page = Math.Clamp(page, 1, totalPages);

        return View(new TruckListViewModel
        {
            Trucks = trucks
                .OrderBy(t => t.Name)
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .ToList(),
            Search = search,
            City = city,
            Cities = _context.Trucks.Select(t => t.City).Distinct().OrderBy(c => c).ToList(),
            Page = page,
            TotalPages = totalPages,
            TotalCount = total
        });
    }
```

`int page = 1` is a default: `/Trucks` with no page number is page 1. `Math.Ceiling` rounds up, because eight trucks at three to a page is three pages, not 2.67. `Math.Max(1, …)` means an empty result still has one page.

⚠️ **Your page size has to be smaller than your record count**, or there is nothing to page through. With a handful of records, 2 works fine; it's a constant, and it's one line to change as the app grows.

### The links

**In `Views/Trucks/Index.cshtml`, below the cards:**

```cshtml
@if (Model.TotalPages > 1)
{
    <nav class="d-flex justify-content-between align-items-center mt-4" aria-label="Pages">
        @if (Model.Page > 1)
        {
            <a asp-route-page="@(Model.Page - 1)" asp-route-search="@Model.Search" asp-route-city="@Model.City"
               class="btn btn-outline-secondary">← Previous</a>
        }
        else
        {
            <span></span>
        }

        <span class="text-muted">Page @Model.Page of @Model.TotalPages</span>

        @if (Model.Page < Model.TotalPages)
        {
            <a asp-route-page="@(Model.Page + 1)" asp-route-search="@Model.Search" asp-route-city="@Model.City"
               class="btn btn-outline-secondary">Next →</a>
        }
        else
        {
            <span></span>
        }
    </nav>
}
```

An `asp-route-…` attribute goes into the link's query string. Asking for `asp-route-page="2"` gives `/Trucks?page=2`, and an empty one is left out altogether.

⚠️ **Every page link carries the search and every filter.** Leave `asp-route-search` off, and clicking **Next** on a search result shows page 2 of everything. The form doesn't have this problem: it sends no page number, so a new search starts at page 1.

The count at the top reads `Model.TotalCount`, so it still says eight on a page of three.

**A numbered pager** is the same idea in a `for` loop, using Bootstrap's `pagination` classes:

```cshtml

@if (Model.TotalPages > 1)
{
    <nav class="mt-4" aria-label="Pages">
        <ul class="pagination">
            @for (var p = 1; p <= Model.TotalPages; p++)
            {
                <li class="page-item @(p == Model.Page ? "active" : "")">
                    <a class="page-link" asp-route-page="@p" asp-route-search="@Model.Search" asp-route-status="@Model.Status">@p</a>
                </li>
            }
        </ul>
    </nav>
}
```

---

## Part 4: Where `_context` comes from

Since week 7, every controller has started like this:

```csharp
private readonly CurbsideContext _context;

public TrucksController(CurbsideContext context)
{
    _context = context;
}
```

**Nothing in your code has ever written `new TrucksController(…)`, or `new CurbsideContext(…)`.** Something else makes them, and it fills in that constructor. That something is the **container**, and you've been adding to it all term:

```csharp
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<CurbsideContext>(…);
builder.Services.AddIdentity<AppUser, IdentityRole>()…
```

`builder.Services` is a list of what the app knows how to build. When a request needs a controller, ASP.NET looks at the constructor, finds each thing it asks for in the container, builds those (and whatever *they* ask for), and hands them over. **A class says what it needs, and something else provides it. That's dependency injection.**

So that's the answer to week 12's question too. `RoleManager` and `UserManager` came from `AddIdentity`, and `IConfiguration` is registered by the framework. The seeder's `GetRequiredService` is the same container, asked by hand, because at startup there's no constructor for it to fill in.

---

## Part 5: Move the query out

`Index` is nearly forty lines now, and all it does is read a list. A controller's job is to take a request and return a page. A class that does the work behind it is a **service**.

### An interface, and a class

**`Services/ITruckService.cs`** — this is the whole file:

```csharp
using Curbside.ViewModels;

namespace Curbside.Services;

// What the app can ask of a truck service. Controllers depend on this, not on
// the class underneath it.
public interface ITruckService
{
    TruckListViewModel GetList(string? search, string? city, int page);
}
```

**`Services/TruckService.cs`** — this is the whole file:

```csharp
using Microsoft.EntityFrameworkCore;
using Curbside.Data;
using Curbside.ViewModels;

namespace Curbside.Services;

// The list query, moved out of TrucksController. It asks for the context in its
// constructor, the same way the controller did.
public class TruckService : ITruckService
{
    private const int PageSize = 3;

    private readonly CurbsideContext _context;

    public TruckService(CurbsideContext context)
    {
        _context = context;
    }

    public TruckListViewModel GetList(string? search, string? city, int page)
    {
        // Nothing runs yet: this builds the query, and each Where adds to it.
        var trucks = _context.Trucks
            .Include(t => t.Specials)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            trucks = trucks.Where(t => t.Name.Contains(search)
                                    || t.Cuisine.Contains(search)
                                    || t.City.Contains(search));
        }

        if (!string.IsNullOrEmpty(city))
        {
            trucks = trucks.Where(t => t.City == city);
        }

        // Count what matched, before cutting it down to one page.
        var total = trucks.Count();
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)PageSize));
        page = Math.Clamp(page, 1, totalPages);

        return new TruckListViewModel
        {
            Trucks = trucks
                .OrderBy(t => t.Name)
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .ToList(),
            Search = search,
            City = city,
            Cities = _context.Trucks.Select(t => t.City).Distinct().OrderBy(c => c).ToList(),
            Page = page,
            TotalPages = totalPages,
            TotalCount = total
        };
    }
}
```

It's the same query. The only new part is the top: the service asks for the context in its constructor, because the container will fill that in too.

**In `TrucksController`:** add `using Curbside.Services;`, remove `PageSize`, ask for the interface alongside the context, and `Index` is one line:

```csharp
    private readonly CurbsideContext _context;

    // Week 13: the list comes from a service. Same move as the context: ask
    // for it in the constructor, and it is handed over.
    private readonly ITruckService _trucks;

    public TrucksController(CurbsideContext context, ITruckService trucks)
    {
        _context = context;
        _trucks = trucks;
    }
```

```csharp
    public IActionResult Index(string? search, string? city, int page = 1)
    {
        return View(_trucks.GetList(search, city, page));
    }
```

The context stays, because the writes still use it. Moving those is a fair next step, and you don't need it this week.

### Register it

Run that, and you get a 500:

```
Unable to resolve service for type 'Curbside.Services.ITruckService'
while attempting to activate 'Curbside.Controllers.TrucksController'.
```

That message is the whole of Part 4 in one line: ASP.NET tried to build the controller, looked at the constructor, and the container had no such thing. **In `Program.cs`, just above `var app = builder.Build();`,** with `using Curbside.Services;` at the top:

```csharp
// Week 13: when anything asks for an ITruckService, hand it a TruckService.
// One per request, the same lifetime AddDbContext gives the context.
builder.Services.AddScoped<ITruckService, TruckService>();
```

⚠️ **It has to go above `builder.Build()`.** After that, the list is closed.

⚠️ **`dotnet watch`:** removing `PageSize` from the controller is a change hot reload can't make, so it asks `Do you want to restart your app?` — answer **`a`**. A `Program.cs` edit isn't live until the app restarts: if the terminal says `Press "Ctrl + R" to restart.`, press it.

### Why an interface

The controller asks for `ITruckService` and never names a class. That means one line in `Program.cs` decides what it gets:

```csharp
builder.Services.AddScoped<ITruckService, EmptyTruckService>();
```

Swap that in, with a class that returns an empty list, and the page changes without the controller changing. It's how a test hands a controller a fake, and how a new version replaces an old one.

**A service also earns its place when two controllers need the same query.** The Registry's home page and its list both read creatures, so `HomeController` asks for the same service, and needs no context at all.

---

## Part 6: How long one lasts

`AddScoped` is one of three, and the word decides a service's **lifetime**:

| Registered with | You get | Use it for |
|---|---|---|
| `AddTransient` | a new one every time it's asked for | small, stateless helpers |
| `AddScoped` | one per request | anything that holds the context |
| `AddSingleton` | one for the whole app, shared by every visitor | something shared, with no context |

**`AddDbContext` registers the context as scoped.** It remembers what it has loaded, and that shouldn't leak from one visitor's request into another's. So anything that holds a context is scoped too.

Try `AddSingleton` on `TruckService`, and the app won't start:

```
Cannot consume scoped service 'Curbside.Data.CurbsideContext'
from singleton 'Curbside.Services.ITruckService'.
```

⚠️ **That check only runs in Development.** On Azure the same mistake starts, and every visitor shares one context, so the place to catch it is on your machine.

### Why the seeder needed `CreateScope`

A scope is what a request gets automatically. **At startup there is no request**, so there's no scope, and something scoped has nowhere to live. These lines from week 12 make one by hand, and throw it away at the closing brace:

```csharp
using (var scope = app.Services.CreateScope())
{
    await RoleSeeder.SeedAsync(scope.ServiceProvider);
}
```

---

## Part 7: Your own app

The moves are the same four; the names are yours.

| | Curbside | Your app |
|---|---|---|
| the message | `TempData["Message"]`, in `_Layout` | the same, in your words, on every POST that changes your data |
| the search | name, cuisine, city | at least the property you show as the record's name |
| the filter | a city dropdown | optional: whatever a visitor would want, if your data has one |
| page size | 3 | smaller than your record count: **2 always works** |
| the service | `ITruckService`, `TruckService` | `IYourThingService`, `YourThingService`, in `Services/` |

The self-check reads your form and your links to find your parameter names, so call them what you like. **It can't see your message or your service**, so test the message yourself: sign in as your admin, change something, read it, reload.

**No migration and no new app setting**, so deploying is the plain `az webapp up` you've used all term.

---

## Part 8: What this course leaves out

Search for these topics and you'll find much more than tonight:

- **Sort links.** A header you click to sort by a column. It's one more parameter that every link has to carry.
- **Paging packages,** like `X.PagedList`. They wrap what you just wrote.
- **Full-text search.** `Contains` scans every row, which is fine at this size. Past a few hundred thousand rows, databases have purpose-built indexes for it.
- **A repository for every table.** Many tutorials wrap each `DbSet` in a generic repository. EF's context is already close to that, so a service written for what your pages need goes further.
- **Moving every write into a service.** Reasonable, and worth doing as an app grows. One service is enough to learn the shape.

---

## Troubleshooting

**No message after a change**
- `_Layout.cshtml` doesn't show it, or something still says `ViewData`. [Why `ViewData` can't do it](#why-viewdata-cant-do-it).

**The message is still there after a reload**
- Something called `TempData.Keep` or `TempData.Peek`. Reading it plainly removes it.

**`The model item passed into the ViewDataDictionary is of type …`**
- The action and the view disagree about the model. Change both. [The page's own model](#the-pages-own-model).

**The search box does nothing**
- The input's `name` and the action's parameter have to match. Search, then read the address bar: is your term in it? [The form](#the-form).

**`CS8602: Dereference of a possibly null reference` in a `Where`**
- A nullable column. Check it isn't null first. A warning, not a crash.

**A search only finds what's on the current page**
- The `Where` runs after `Skip` and `Take`. [The order matters](#the-order-matters).

**Page 1 changes between reloads, or a record is on two pages**
- There's no `OrderBy`, or it comes after `Take`. [The order matters](#the-order-matters).

**A `500` on `?page=0`, with `The offset specified in a OFFSET clause may not be negative`**
- `Math.Clamp(page, 1, totalPages)`, after working out `totalPages`.

**Page 2 of a search shows everything**
- The page links need `asp-route-search`, and the same for each filter. [The links](#the-links).

**There's no second page**
- Your page size is bigger than your list. Lower it.

**`Unable to resolve service for type …`**
- The `AddScoped` line is missing, or it's below `builder.Build()`. [Register it](#register-it). If the line is there, the app hasn't restarted: `Ctrl+R`.

**`Cannot consume scoped service … from singleton …`**
- `AddSingleton` on a service that holds the context. Use `AddScoped`. [How long one lasts](#part-6-how-long-one-lasts).

**A `500` over code you're sure is right**
- `dotnet watch` may be asking `Do you want to restart your app?`. Answer `a`. If it says `Press "Ctrl + R" to restart.`, press it.

**The app stops before `Now listening on:` with `The ConnectionString property has not been initialized`**
- The connection string secret is missing — a frozen lab PC wipes it. The app reads the database as it starts.
