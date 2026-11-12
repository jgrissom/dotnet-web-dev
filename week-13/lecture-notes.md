# Week 13 — Introduction to Web API

**What this covers:** what a web API is; writing one with a controller, and with a minimal API; why returning your model breaks, and what a DTO is; testing an endpoint with nothing to install; POST, PUT and DELETE, and the status each answers with; how an API refuses a visitor; keeping your Missing page off it; and why it needs no antiforgery token.

**Keep this open while you work.** Every requirement in the homework has a section here, and the 🆘 section at the bottom of the homework links straight into it.

---

## Part 1: One request, two answers

Every answer your app has given so far is a page. Open `/Trucks`, then **View Page Source**: the trucks are in there, somewhere between the navbar, the Bootstrap classes and the footer. That's right for a person, because the browser turns it into something to read. It's wrong for a program that only wants the truck names, which would have to dig them out.

A **web API** is a set of addresses that answer with data instead of pages. The data is **JSON**, the object syntax from week 1:

```json
{ "id": 1, "name": "Roll Models", "cuisine": "Korean", "city": "Madison" }
```

**An API doesn't replace your pages.** Your app keeps every one of them, and gains a second set of addresses, by convention under `/api`. Both sets read the same tables through the same context.

### Why an app with pages wants one

For a page that reloads every time you click, your views already do the job. An API is for two things a view can't do:

- **Changing part of a page without reloading it.** JavaScript on your own page can ask the API for data and update one part of the screen: a new report appearing in a list, a filter applied as you type. A view only ever sends a whole page, and a script has no use for one. That's week 14.
- **Serving something that isn't a web page.** A phone app, another site, or a script can't use your HTML, but it can use your JSON.

So tonight is the server half. Week 14 calls it from the page.

---

## Part 2: An API controller

**`Controllers/TrucksApiController.cs`** — this is the whole file, as it stands after the first step:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Curbside.Data;
using Curbside.Models;

namespace Curbside.Controllers;

// Week 13: the same trucks as TrucksController, answered as JSON.
[ApiController]
[Route("api/trucks")]
public class TrucksApiController : ControllerBase
{
    private readonly CurbsideContext _context;

    public TrucksApiController(CurbsideContext context)
    {
        _context = context;
    }

    // GET /api/trucks
    [HttpGet]
    public async Task<List<Truck>> GetAll()
    {
        return await _context.Trucks.ToListAsync();
    }
}
```

Four things differ from the controllers you've written since week 4:

| | A page | An API |
|---|---|---|
| inherits | `Controller` | `ControllerBase` — no views, so nothing view-shaped |
| on the class | — | `[ApiController]` |
| its address | the pattern in `Program.cs` | `[Route("api/trucks")]` on the class |
| an action returns | `View(...)` | the data |

`[HttpGet]` says this action answers a GET at the class's address. `async` and `await` are the same ones you've met in the scaffolded Edit since week 8 and in sign-in since week 11: the action waits for the database without holding up the server, and `Task<…>` wraps whatever it returns.

**It lives in the same app.** No new project, and `Program.cs` needs no changes: `AddControllersWithViews` finds it, and the route on the class gives it its address.

### What the JSON looks like

Open `/api/trucks`. Two things to notice:

- **The names changed.** `Name` in your C# is `name` in the JSON. The serializer does that by default, because JavaScript names start with a lowercase letter. You don't type it.
- **`"specials":[]`, for a truck that has specials.** Nothing loaded them, so the list is empty. [Part 4](#part-4-the-loop-and-dtos) fixes that.

---

## Part 3: A minimal API endpoint

There's a second way to write an endpoint, with no class around it. **In `Program.cs`, just above `app.Run();`:**

```csharp
// Week 13: a minimal API endpoint. The same kind of answer as a controller
// action, in one statement, with no class around it.
app.MapGet("/api/trucks/count", async (CurbsideContext db) =>
    new { count = await db.Trucks.CountAsync() });
```

`MapGet` takes an address and a function. The function's parameters are handed to it, the same way a controller's constructor is handed its context, and whatever it returns becomes the JSON. `new { count = … }` is an **anonymous object**: a throwaway shape with no class, which is plenty for one number. The answer is `{"count":7}`.

⚠️ **`Program.cs` runs once, when the app starts, so hot reload can't run it again.** `dotnet watch` prints `Press "Ctrl + R" to restart.` above `Hot reload succeeded`, and until you press it, the new address is a 404 over correct code. If `dotnet watch` has asked you to restart earlier in the session and you answered `a`, it restarts by itself instead.

### Which one to use

| | Use |
|---|---|
| one small endpoint | **minimal** |
| several that share a route, a context and a rule about who may use them | **a controller** |

Both run on the same app, and both reach the same context. Plenty of real apps use only one style. In this course, a thing with several actions gets a controller, and a one-off gets `MapGet`.

---

## Part 4: The loop, and DTOs

### A possible object cycle

Load a truck with its specials, the way the Details page does, and return it:

```csharp
// GET /api/trucks/2
[HttpGet("{id:int}")]
public async Task<ActionResult<Truck>> GetOne(int id)
{
    var truck = await _context.Trucks
        .Include(t => t.Specials)
            .ThenInclude(s => s.Dish)
        .FirstOrDefaultAsync(t => t.Id == id);

    if (truck == null)
    {
        return NotFound();
    }

    return truck;
}
```

This goes inside the controller. `{id:int}` makes the id part of the address, and only a whole number matches. `ActionResult<Truck>` says the action gives back a truck *or* a status.

`/api/trucks/2` is a 500:

```
System.Text.Json.JsonException: A possible object cycle was detected.
```

The serializer writes the truck, reaches `Specials`, writes the first special, and reaches its `Truck` property, which `Include` filled in. So it writes the truck again, and goes round until it gives up:

```
Truck 2
 └─ Specials[0]
     └─ Truck        ← Truck 2 again
         └─ Specials[0]
             └─ Truck        ← and again
```

⚠️ **The loop needs the related rows to be loaded.** Part 2's list returned the same `Truck` class and worked, because nothing filled in `Specials`.

### A DTO

Search that error and you'll find a one-line setting that makes it go away. It's the wrong fix, because it leaves the real problem in place: **your model is the shape of your tables, and your JSON is a promise to whoever calls you.** Those are different jobs. Tie them together and renaming a column breaks every program using your API, while every property you add to a model goes public whether you meant it to or not. With Identity it's worse: `AspNetUsers` has a `PasswordHash` column.

A **DTO**, a data transfer object, is a class whose only job is the shape of the JSON. It's a ViewModel for a program.

**`Dtos/SpecialDto.cs`** — this is the whole file:

```csharp
namespace Curbside.Dtos;

// One line of a truck's menu, as the API says it. The dish's name instead of
// a Dish object, and no way back to the truck.
public class SpecialDto
{
    public string Dish { get; set; } = "";
    public decimal Price { get; set; }
    public string ServedOn { get; set; } = "";
}
```

**`Dtos/TruckDto.cs`** — this is the whole file:

```csharp
namespace Curbside.Dtos;

// What the API says about a truck. A DTO is a class whose only job is the
// shape of the JSON, so the JSON stops being whatever the table looks like.
public class TruckDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Cuisine { get; set; } = "";
    public string City { get; set; } = "";
    public double Rating { get; set; }
    public bool IsOpenLate { get; set; }
    public string? Slogan { get; set; }
    public List<SpecialDto> Specials { get; set; } = new();
}
```

`SpecialDto` has no `Truck` property, so **there's nothing to loop through**. And it says `Dish`, a string, where the model has a whole object, because that's what a reader of the JSON wants.

**Then the controller changes in three places.** Add `using Curbside.Dtos;` at the top. Add a method at the bottom that copies one truck into a `TruckDto`:

```csharp
// inside TrucksApiController, at the bottom
private static TruckDto ToDto(Truck truck) => new TruckDto
{
    Id = truck.Id,
    Name = truck.Name,
    Cuisine = truck.Cuisine,
    City = truck.City,
    Rating = truck.Rating,
    IsOpenLate = truck.IsOpenLate,
    Slogan = truck.Slogan,
    Specials = truck.Specials
        .Select(s => new SpecialDto { Dish = s.Dish!.Name, Price = s.Price, ServedOn = s.ServedOn })
        .ToList()
};
```

And **both** actions change, so that each one loads the related rows and hands back DTOs instead of `Truck`. This replaces `GetAll` and `GetOne`, from the comment `// GET /api/trucks` to the end of `GetOne`:

```csharp
// inside TrucksApiController — both actions, replacing the old ones
// GET /api/trucks
[HttpGet]
public async Task<List<TruckDto>> GetAll()
{
    var trucks = await _context.Trucks
        .Include(t => t.Specials)
            .ThenInclude(s => s.Dish)
        .ToListAsync();

    return trucks.Select(ToDto).ToList();
}

// GET /api/trucks/2
[HttpGet("{id:int}")]
public async Task<ActionResult<TruckDto>> GetOne(int id)
{
    var truck = await _context.Trucks
        .Include(t => t.Specials)
            .ThenInclude(s => s.Dish)
        .FirstOrDefaultAsync(t => t.Id == id);

    if (truck == null)
    {
        return NotFound();
    }

    return ToDto(truck);
}
```

In both, the return type now names the DTO, and the last line builds it with `ToDto`. `GetAll` also gains the `Include`, so the list has the specials to copy; `GetOne` already had it. **Change `GetAll` too, not just `GetOne`.** Left alone, it keeps sending `Truck` with an empty `"specials": []`. The whole file is in [Part 7](#part-7-put-and-delete).

### At scale

Loading the rows and then copying them into DTOs is the clearest way to see what a DTO does, and it's what the demo and the lab both do. With thousands of rows, real APIs build the DTO inside the query itself, so the database sends only what the DTO needs, and they return the list a page at a time, which is week 15's paging.

### A 404 in JSON

`/api/trucks/999` reaches `return NotFound();`. On a class marked `[ApiController]`, that answers with a 404 **and a small JSON body**, rather than your Missing page:

```json
{ "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5", "title": "Not Found", "status": 404, "traceId": "…" }
```

---

## Part 5: Testing an endpoint

**A GET needs nothing:** type its address. The address bar is a perfectly good test tool for anything that only reads.

**A write needs something that can send a POST with JSON in it, and you have that too.** `wwwroot/api-tester.html` is one static page, already in your lab. Open **`/api-tester.html`**, pick a method, type a path, put the JSON in the box and click **Send**. It shows the status, the type of what came back, any `Location`, and the body.

It's a good tool for this course for three reasons:

- **There's nothing to install**, so it works on a frozen lab PC and on your deployed site alike.
- **It runs in your browser, on your site**, so if you're signed in, your cookie goes with the request. That's how you test as your admin.
- **It doesn't follow redirects.** It says *A redirect* out loud, where a browser would quietly land on the sign-in page and call it a `200`.

⚠️ **The file is a public page on your site, and that's fine.** Anyone who opens it can only send what they could already send. It gives nobody any access they didn't have.

**After every write, send a GET.** A `201` or a `204` says the server accepted the request; it doesn't show what was saved. Read the record back after a POST or a PUT, and after a DELETE, check that the same address is now a `404`.

**F12 → Network** shows the same requests from the outside: click one, and the verb, the status, your cookie and the JSON are all there.

*Elsewhere you'll meet **Postman**, **`curl`** and **`.http` files**, which do the same job from outside a browser. They're good tools, and `curl` is worth learning. This course doesn't use them because each one needs setting up, and none of them has your sign-in cookie.*

---

## Part 6: POST

### What a client may send

A POST needs a class for what it accepts. **Don't use your model.** Measured on Curbside with `Create(Truck truck)`: a body with `"id": 1` is a 500 from SQL Server, and a body with a `specials` list **saved the related rows**, then failed. This is week 8's `[Bind]` list, for JSON, and the fix is a DTO with only what a client may set.

**`Dtos/TruckInput.cs`** — this is the whole file:

```csharp
using System.ComponentModel.DataAnnotations;

namespace Curbside.Dtos;

// What the API accepts for a truck. The same rules as the Truck class, and
// only the properties a client may send: no Id, and no Specials.
public class TruckInput
{
    [Required(ErrorMessage = "Every truck needs a name.")]
    [StringLength(50, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [Required]
    [StringLength(30)]
    public string Cuisine { get; set; } = "";

    [Required]
    public string City { get; set; } = "";

    [Range(1, 5, ErrorMessage = "Ratings run from {1} to {2}.")]
    public double Rating { get; set; }

    public bool IsOpenLate { get; set; }

    [StringLength(80)]
    public string? Slogan { get; set; }
}
```

Anything else in the JSON is ignored. Send `"id": 1` and it never reaches your code.

### The action

```csharp
// inside TrucksApiController
// POST /api/trucks
// [ApiController] has already refused anything that breaks TruckInput's
// rules, with a 400, so there is no ModelState check here.
[HttpPost]
public async Task<ActionResult<TruckDto>> Create(TruckInput input)
{
    var truck = new Truck
    {
        Name = input.Name,
        Cuisine = input.Cuisine,
        City = input.City,
        Rating = input.Rating,
        IsOpenLate = input.IsOpenLate,
        Slogan = input.Slogan
    };

    _context.Trucks.Add(truck);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetOne), new { id = truck.Id }, ToDto(truck));
}
```

Two things it doesn't do, because `[ApiController]` does them:

- **It reads the JSON.** A complex parameter comes from the request body, and only JSON is accepted. Anything else is a **415**.
- **It runs the rules.** There's no `if (!ModelState.IsValid)`. A body that breaks `TruckInput`'s rules never reaches the action: the answer is a **400** with an `errors` object a program can read.

```json
{ "title": "One or more validation errors occurred.", "status": 400,
  "errors": { "City": ["The City field is required."], "Rating": ["Ratings run from 1 to 5."] } }
```

`CreatedAtAction` answers with a **201**, the new record in the body, and a `Location` header giving the address of `GetOne` for the new id.

### What the rules can't know

Validation attributes look at one value. They can't know whether a foreign key points at anything. If your input carries one, look it up at the top of the POST action, before anything is saved, and answer the same way the automatic 400 does. From `SightingsApiController`:

```csharp
if (!await _context.Cryptids.AnyAsync(c => c.Id == input.CryptidId))
{
    ModelState.AddModelError(nameof(input.CryptidId), "There is no creature with that id.");
    return ValidationProblem(ModelState);
}
```

Without it, SQL Server refuses the row and your API answers with a 500. ⚠️ **The in-memory database behind `dotnet test` has no foreign keys**, so there the same request saves happily. That's why the lab's check asks for the 400 directly.

⚠️ **A value type that's missing from the JSON isn't an error, it's a default.** A plain `DateTime` nobody sent is the year 1, and `[Required]` can't tell. Make it `DateTime?` with `[Required]`, and read `.Value` once it has passed.

---

## Part 7: PUT and DELETE

The address stays the same; the verb says what to do to it.

| Verb | Address | Means | When it works |
|---|---|---|---|
| `GET` | `/api/trucks` | read them all | `200` |
| `GET` | `/api/trucks/2` | read one | `200`, or `404` |
| `POST` | `/api/trucks` | add one | `201`, or `400` |
| `PUT` | `/api/trucks/2` | change one | `204`, `400`, or `404` |
| `DELETE` | `/api/trucks/2` | remove one | `204`, or `404` |

**204 No Content** means *it worked, and there's nothing to send back*. The client already has what it sent.

**`Controllers/TrucksApiController.cs`** — this is the whole file, finished:

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Curbside.Data;
using Curbside.Dtos;
using Curbside.Models;

namespace Curbside.Controllers;

// Week 13: the same trucks as TrucksController, answered as JSON. Every action
// needs the Admin role, except the two that only read.
[ApiController]
[Route("api/trucks")]
[Authorize(Roles = "Admin")]
public class TrucksApiController : ControllerBase
{
    private readonly CurbsideContext _context;

    public TrucksApiController(CurbsideContext context)
    {
        _context = context;
    }

    // GET /api/trucks
    [AllowAnonymous]
    [HttpGet]
    public async Task<List<TruckDto>> GetAll()
    {
        var trucks = await _context.Trucks
            .Include(t => t.Specials)
                .ThenInclude(s => s.Dish)
            .ToListAsync();

        return trucks.Select(ToDto).ToList();
    }

    // GET /api/trucks/2
    [AllowAnonymous]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TruckDto>> GetOne(int id)
    {
        var truck = await _context.Trucks
            .Include(t => t.Specials)
                .ThenInclude(s => s.Dish)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (truck == null)
        {
            return NotFound();
        }

        return ToDto(truck);
    }

    // POST /api/trucks
    // [ApiController] has already refused anything that breaks TruckInput's
    // rules, with a 400, so there is no ModelState check here.
    [HttpPost]
    public async Task<ActionResult<TruckDto>> Create(TruckInput input)
    {
        var truck = new Truck
        {
            Name = input.Name,
            Cuisine = input.Cuisine,
            City = input.City,
            Rating = input.Rating,
            IsOpenLate = input.IsOpenLate,
            Slogan = input.Slogan
        };

        _context.Trucks.Add(truck);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOne), new { id = truck.Id }, ToDto(truck));
    }

    // PUT /api/trucks/2
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, TruckInput input)
    {
        var truck = await _context.Trucks.FindAsync(id);
        if (truck == null)
        {
            return NotFound();
        }

        truck.Name = input.Name;
        truck.Cuisine = input.Cuisine;
        truck.City = input.City;
        truck.Rating = input.Rating;
        truck.IsOpenLate = input.IsOpenLate;
        truck.Slogan = input.Slogan;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/trucks/2
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var truck = await _context.Trucks.FindAsync(id);
        if (truck == null)
        {
            return NotFound();
        }

        _context.Trucks.Remove(truck);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static TruckDto ToDto(Truck truck) => new TruckDto
    {
        Id = truck.Id,
        Name = truck.Name,
        Cuisine = truck.Cuisine,
        City = truck.City,
        Rating = truck.Rating,
        IsOpenLate = truck.IsOpenLate,
        Slogan = truck.Slogan,
        Specials = truck.Specials
            .Select(s => new SpecialDto { Dish = s.Dish!.Name, Price = s.Price, ServedOn = s.ServedOn })
            .ToList()
    };
}
```

⚠️ **Load the record and copy across, in a PUT.** `_context.Update(new Truck { … })` would write *every* column, so anything your input doesn't carry is blanked. In the Registry that's the plate: `CryptidInput` has no `ImageUrl`.

---

## Part 8: Who may write

**The same rule as your pages, and it looks the same:** the role on the class, `[AllowAnonymous]` on what only reads. Week 11's reason still holds: an action someone adds later is covered without anyone remembering.

**What changes is the answer.** A page sends a refused visitor somewhere. A program can't do anything with a sign-in page, so an API answers with a number:

| Who sends the write | A page | The API |
|---|---|---|
| not signed in | `302` to `/Account/Login` | **`401`** |
| signed in, without the role | `302` to `/Account/AccessDenied` | **`403`** |
| signed in, with the role | the form | `201`, `204` |

Authentication is who you are, and **401** means *I don't know who you are*, whatever its official name says. Authorization is what you may do, and **403** means *I know who you are, and no*. Those are week 11's two questions.

⚠️ **An attribute is the kind of edit hot reload can report as applied when it isn't.** MVC works out each action's filters when the app starts. If a signed-out request still gets through over a correct `[Authorize]`, press `Ctrl+R` in the terminal running `dotnet watch` and send it again.

⚠️ **`[ApiController]` is what makes that change.** Measured on .NET 10: take it off the class and the same request is a `302` to the sign-in page. The tester says *A redirect*. A `401` still carries a `Location` header naming the sign-in page; a program ignores it, because the status is the answer.

⚠️ **The role is still read when you sign in.** A new role doesn't reach a signed-in cookie through an API either: [week 12's rule](../week-12/lecture-notes.md#part-5-the-role-is-read-when-you-sign-in), and a `403` for your own admin is usually that.

### The Missing page, behind the status

Sign out and send a DELETE. The status is `401`, which is correct, and the reply is a **whole page of HTML**. It's week 10's Missing page. `UseStatusCodePagesWithReExecute` answers every response that has a status and no body, and that now includes your API's refusals, and any address under `/api` that doesn't exist.

A program that gets a `401` wants the status. So the Missing page stops at the edge of the API. **In `Program.cs`, this line:**

```csharp
app.UseStatusCodePagesWithReExecute("/Home/Missing");
```

**becomes:**

```csharp
// Week 13: pages only. Under /api, a status is the whole answer, and a page
// of HTML in the body is no use to a program.
app.UseWhen(context => !context.Request.Path.StartsWithSegments("/api"), pages =>
    pages.UseStatusCodePagesWithReExecute("/Home/Missing"));
```

`UseWhen` runs a piece of the pipeline only when its condition is true. The line inside is the same line. People still get the Missing page; everything under `/api` gets its status alone. `/api-tester.html` doesn't count as under `/api`, because `StartsWithSegments` compares whole path segments.

⚠️ **`Program.cs` again, so press `Ctrl+R`.**

### Only a browser on your site has the cookie

Any application that speaks HTTP can **read** your API: a phone app, another server, a script. **Writing is different.** The role is checked against the sign-in cookie, and that cookie comes from your sign-in form. The browser stores it and sends it with every request to your site, which is why the tester and week 14's JavaScript can write as your admin: they run in your browser, on your site.

An application that isn't a browser on your site has no cookie to send. Real APIs serve those callers with a different mechanism: the caller signs in once, gets back a **JWT** (a signed string saying who it is and what roles it holds), and sends it with every request in an `Authorization` header. That's a second way of signing in, and this course doesn't build it. Your API reads for anyone and writes for a browser on your own site, which is exactly what week 14 needs.

### Why no token

Every POST since week 6 has carried `[ValidateAntiForgeryToken]`, and a POST to your API carries nothing and works. That's safe, for three reasons you can measure:

| What the token stops | Why an API doesn't need one |
|---|---|
| another site posting **a form** to you | a form can't send JSON, so it's a `415` and nothing runs |
| your cookie going along with that post | the sign-in cookie is `SameSite=Lax`: the browser leaves it off a POST that starts on another site |
| another site's **JavaScript** sending real JSON | the browser blocks it, because your app never gave that site permission |

That last row is **CORS**, cross-origin resource sharing. A page on one address can't read an answer from another unless the server says so, and yours doesn't. **JavaScript on your own site is the same origin and needs no setting at all.**

Keep the tokens on your pages. **Don't put `[ValidateAntiForgeryToken]` on an API action:** the token comes from a form, a program has no form, and your own POST gets a 400.

---

## Part 9: Your own app

The moves are the same; the names are yours.

| | Curbside | Your app |
|---|---|---|
| the list page | `/Trucks` | `/Trails`, `/Games`, whatever your navbar links to |
| the API | `/api/trucks` | **the same word**, with `/api` in front, singular or plural |
| one record | `/api/trucks/2`, with `specials` | yours, with your related rows |
| the count | `/api/trucks/count` | yours |
| the role | `Admin` | the one you chose in week 12 |
| who can POST | the admin | your role |

Your related rows are whatever your second table holds, and **the DTO for them leaves out the way back**. If your second table is something the public submits, a public POST like the Registry's is welcome. The homework asks for a POST that needs your role, whichever else you add.

### On Azure

**No migration, and no new setting:** `ConnectionStrings__DefaultConnection` and `Admin__Email` are already there. `az webapp up` publishes `wwwroot` too, so **`/api-tester.html` is live on your deployed site**. Sign in there as your admin, and send your real POST and DELETE from it.

---

## Part 10: What this course leaves out

Search for ASP.NET Core Web API and you'll find much more than tonight:

- **OpenAPI and Swagger** — a generated description of your API, and with Swagger, a page for trying it. `dotnet new webapi` sets up the description, and the page is another package to add. The tester already does what this course needs.
- **JWT in an `Authorization` header** — how an API knows who is writing when the caller isn't a browser on your site. [Only a browser on your site has the cookie](#only-a-browser-on-your-site-has-the-cookie) says why you'd need it. Same-site JavaScript doesn't.
- **A CORS policy** — letting a site on another address call your API. JavaScript on your own site doesn't need one.
- **`ReferenceHandler`** — the setting that silences the cycle error. It leaves your model as your API.
- **`PATCH`, versioning, paging, and `[FromQuery]` filters.** Real APIs grow all of them. A list, one record, and the verbs are the shape to learn first.
- **`[ProducesResponseType]` and typed results** — ways of documenting what an action can answer with.

---

## Troubleshooting

**A new address is a 404 or your Missing page, over a correct `Program.cs`**
- `dotnet watch` printed `Press "Ctrl + R" to restart.` above `Hot reload succeeded`. Press it. `Program.cs` runs once, at startup. [Part 3](#part-3-a-minimal-api-endpoint).

**A `500` with `A possible object cycle was detected`**
- You're returning a model with its related rows loaded, or a DTO has a property of a model type. Return DTOs, all the way down. [Part 4](#part-4-the-loop-and-dtos).

**A `500` with `NullReferenceException` right after you edited an action, and the code is right**
- Hot reload took the edit and the running action didn't survive it. Measured adding an `AnyAsync(c => …)` lookup to a working action: `Hot reload succeeded`, then a 500 until restart. Restart with `Ctrl+R`.

**`"specials": []`, or your own related rows are always empty**
- That query has no `Include`. [Part 4](#part-4-the-loop-and-dtos).

**A POST comes back `415 Unsupported Media Type`**
- There's no `Content-Type: application/json` on the request. The tester sends one for POST and PUT.

**A POST comes back `400` with `The input field is required`, or a message about a JSON token**
- The JSON is broken. Every property name and every string needs double quotes, and there's no trailing comma.

**A POST comes back `400` with no `errors` you recognize, and your input is fine**
- `[ValidateAntiForgeryToken]` is on the action. Take it off. [Why no token](#why-no-token).

**A `500` that mentions a `FOREIGN KEY`**
- The id your input carries doesn't exist. Look it up first. [What the rules can't know](#what-the-rules-cant-know).

**A record saves with the year 1**
- That property is a plain `DateTime`, and nobody sent it. Make it `DateTime?` with `[Required]`. [What the rules can't know](#what-the-rules-cant-know).

**A signed-out request gets through, over a correct `[Authorize]`**
- Hot reload can report an attribute as applied when it isn't. Restart with `Ctrl+R`. [Part 8](#part-8-who-may-write).

**The tester says `A redirect`, or a browser lands on the sign-in page**
- The class has no `[ApiController]`. [Part 8](#part-8-who-may-write).

**The status is right, and there's a page of HTML behind it**
- Week 10's Missing page. Wrap it in `UseWhen`, and press `Ctrl+R`. [The Missing page, behind the status](#the-missing-page-behind-the-status).

**Your admin gets a `403`**
- Your cookie is older than your role, or the role's spelling differs from your seeder's. Sign out and back in. [Part 8](#part-8-who-may-write).

**A PUT blanked a column**
- It saved a new object. Load the record and copy across. [Part 7](#part-7-put-and-delete).

**`/api-tester.html` is a 404 on Azure**
- It isn't in `wwwroot`, or that copy wasn't deployed. Run `az webapp up` again from the folder with your `.csproj`.
