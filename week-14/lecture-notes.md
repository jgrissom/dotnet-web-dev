# Week 14 — Consuming Your API, Production, and Team Git

**What this covers:** calling your own API from your own pages with `fetch`, `async` and `await`; reading the status before the body; changing part of a page without a reload, safely; a form that sends JSON and lists the API's errors; a DELETE whose answer has no body; what changes when your app runs as Production; where each secret lives; CI and CD with GitHub Actions; and two people changing one app with branches, pull requests, reviews and a merge conflict.

**Keep this open while you work.** Every requirement in the homework has a section here, and the 🆘 section at the bottom of the homework links straight into it.

---

## Part 1: One fetch

Week 13 built the server half: your app answers programs at `/api`. Tonight the program is your own page. Its JavaScript asks your API for data and changes part of the page with the answer, and the rest of the page stays where it is.

You've already used a page that does this. `wwwroot/api-tester.html` sends whatever you ask it to, and its script comes down to three lines:

```js
const response = await fetch(path, options);   // send the request, and wait for the answer
response.status                                 // read the status
const text = await response.text();             // only then, read the body
```

Every script in this week has the same order: **send, read the status, then read the body if there is one.**

### `async` and `await`

`fetch` sends a request and gives back a **promise**: a value that isn't there yet. **`await` waits for it.** The function stops at that line until the answer arrives, and the rest of the page — scrolling, typing, other buttons — keeps working while it waits. When the answer comes, the function carries on from the same line.

**Only a function marked `async` can `await`.** That's the whole rule:

```js
const showMenu = async (card) => {
    const response = await fetch(`/api/trucks/${card.dataset.id}`);   // 1. send, and wait
    if (response.status !== 200) {                                    // 2. the status
        // say so, and stop
        return;
    }
    const truck = await response.json();                              // 3. then the body
};
```

If you've worked through week 8, this is the same idea as an `async` controller action: `await _context.Trucks.ToListAsync()` waits for the database the way `await fetch(…)` waits for the server.

`response.json()` is also something to wait for: it reads the rest of the body and turns the JSON into an object, so it gets its own `await`.

### Why the status comes first

`response.status` is the number from week 13 — `200`, `201`, `204`, `400`, `401`, `403`, `404`. **Some of those answers have no body at all**, and calling `.json()` on an empty body throws. [Part 4](#part-4-which-answers-have-a-body) has the list. The status is always there, so read it first.

---

## Part 2: Part of a page, from JSON

**The goal in the demo:** a **Show the menu** button under every truck's card. Clicking it lists that truck's specials under its card, and the page never reloads.

### The page: three things for the script to find

In `Views/Trucks/Index.cshtml`, the grid of cards becomes this — it replaces the `<div class="row …">` block that was there:

```cshtml
<div id="trucks" class="row row-cols-1 row-cols-md-3 g-4">
    @foreach (var truck in Model)
    {
        <div class="col d-flex flex-column" data-id="@truck.Id">
            <div class="flex-grow-1">
                <partial name="_TruckCard" model="truck" />
            </div>
            <div>
                <button type="button" class="btn btn-link px-0 show-menu">Show the menu</button>
            </div>
            <ul class="menu list-unstyled small"></ul>
        </div>
    }
</div>
```

- **`id="trucks"`** on the grid, so the script can find it with `document.querySelector("#trucks")`.
- **`data-id="@truck.Id"`** on each card's column. Any attribute starting with `data-` is yours to invent, and the script reads this one as `card.dataset.id`. It's how the script knows *which* truck was clicked.
- **An empty `<ul class="menu">`** under each card, for the specials to go in.
- **`type="button"`** on the button, so it never submits anything by itself.

`d-flex flex-column` and `flex-grow-1` are Bootstrap. They keep the button **under** its card: the partial's card is `h-100`, full height, so without them the button spills onto the next row.

### The script, in a file of its own

**`wwwroot/js/trucks.js`** — a new file. `wwwroot` is the only folder the browser can fetch from:

```js
// Week 14: the trucks page asks the API for data, and changes part of itself
// without a reload. Views/Trucks/Index.cshtml loads this file.

const trucks = document.querySelector("#trucks");

// GET /api/trucks/2, then list that truck's specials under its card.
const showMenu = async (card) => {
    const menu = card.querySelector(".menu");
    menu.textContent = "Loading…";

    const response = await fetch(`/api/trucks/${card.dataset.id}`);
    if (response.status !== 200) {
        menu.textContent = "That truck isn't on the street any more.";
        return;
    }

    const truck = await response.json();
    menu.textContent = truck.specials.length === 0 ? "Nothing on the menu yet." : "";
    for (const special of truck.specials) {
        const item = document.createElement("li");
        item.textContent = `${special.dish} · ${special.servedOn} · $${special.price.toFixed(2)}`;
        menu.append(item);
    }
};

// One listener for every card, including cards added later. closest() finds
// the card the click landed in.
trucks.addEventListener("click", (event) => {
    const card = event.target.closest("[data-id]");
    if (event.target.matches(".show-menu")) {
        showMenu(card);
    }
});
```

**One listener, on the grid.** A click on any button inside the grid reaches the grid's listener too, and `event.target` is the thing actually clicked. `matches(".show-menu")` asks whether it was the button; `closest("[data-id]")` walks up from it to the nearest element with a `data-id`, which is the card. This is called **event delegation**, and it's why a card the page adds *later* works without a listener of its own.

**The page loads the file** with week 5's `@section Scripts`, at the very bottom of `Views/Trucks/Index.cshtml`:

```cshtml
@section Scripts {
    <script src="~/js/trucks.js"></script>
}
```

`~/` means the root of `wwwroot`. The layout renders this section at the end of the page, after jQuery and Bootstrap, so every card already exists when the script runs.

> [!NOTE]
> **No restart for any of this.** Measured under `dotnet watch`: a new `.js` file, an edit to it and an edit to a view all go live while it runs, and **every open tab of the app reloads itself when you save.** The first request for a brand-new `.js` file prints a yellow `The static asset '/js/trucks.js' was not found in the built time manifest` in the terminal. It's harmless: the file is served anyway, it goes into the manifest at the next build, and the warning stops after a restart.

### `textContent`, never `innerHTML`

Everything the API sends goes onto the page with **`textContent`**. It puts the text in **as text**: a truck named `<b>Big</b> Truck` shows exactly those characters. `innerHTML` would have the browser read them as markup — and a name like `<img src=x onerror=…>` would run its script on every visitor's page. Anything a person typed, whether through your form or through your API, is untrusted.

`innerHTML` is fine for markup **you** wrote, with no data in it. Part 3's `cardFor` uses it that way, then fills the data in with `textContent`.

### Watching it work

**F12 → Network**, then click a button. The request your script sent is in the list — `2` for truck 2 — and clicking it shows the status, the headers and, under **Response**, the JSON. It's exactly what typing `/api/trucks/2` in the address bar shows, except that the page stayed put.

---

## Part 3: A form that sends JSON

**The goal in the demo:** a small form at the top of the list, for the admin only. It adds a truck through the API, and the new card appears with the others.

### The form

In `Views/Trucks/Index.cshtml`, inside the `@if (User.IsInRole("Admin"))` that holds the **＋ Add a truck** link, just below the link:

```cshtml
    <form id="quick-add" class="row g-2 mb-2">
        <div class="col-md-3"><input name="name" class="form-control" placeholder="Name" /></div>
        <div class="col-md-2"><input name="cuisine" class="form-control" placeholder="Cuisine" /></div>
        <div class="col-md-2"><input name="city" class="form-control" placeholder="City" /></div>
        <div class="col-md-2"><input name="rating" type="number" step="0.1" class="form-control" placeholder="Rating" /></div>
        <div class="col-md-3"><button class="btn btn-outline-primary w-100">Add without a reload</button></div>
    </form>
    <ul id="quick-add-errors" class="text-danger small mb-4"></ul>
```

**Each box's `name` is the API's name for that value** — `TruckInput`'s properties from week 13, with a small first letter. The form has **no `method` and no `asp-action`**, because the script sends it. It's inside the role check, so nobody else's page has it.

### The script

At the bottom of `wwwroot/js/trucks.js`. First, a card for a truck that arrives as JSON, built with the same markup the page uses:

```js
// A card for a truck that arrived as JSON. Its text goes in with textContent,
// never innerHTML, so whatever someone typed shows as text and never runs.
const cardFor = (truck) => {
    const card = document.createElement("div");
    card.className = "col d-flex flex-column";
    card.dataset.id = truck.id;
    card.innerHTML = `
        <div class="flex-grow-1"><div class="card h-100"><div class="card-body">
            <h5 class="card-title"></h5>
            <h6 class="card-subtitle mb-2 text-muted"></h6>
        </div></div></div>
        <div>
            <button type="button" class="btn btn-link px-0 show-menu">Show the menu</button>
        </div>
        <ul class="menu list-unstyled small"></ul>`;
    card.querySelector(".card-title").textContent = truck.name;
    card.querySelector(".card-subtitle").textContent = `${truck.cuisine} · ${truck.city}`;
    return card;
};
```

Then the form's handler:

```js
// POST /api/trucks, with the form's values as JSON. Only an admin's page has
// the form, so on anyone else's page there is nothing to set up.
const form = document.querySelector("#quick-add");
if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const errors = document.querySelector("#quick-add-errors");
        errors.textContent = "";

        const values = new FormData(form);
        const response = await fetch("/api/trucks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: values.get("name"),
                cuisine: values.get("cuisine"),
                city: values.get("city"),
                rating: Number(values.get("rating")),
            }),
        });

        if (response.status === 201) {
            // Read the new truck back from the address in the Location header.
            const saved = await fetch(response.headers.get("Location"));
            trucks.append(cardFor(await saved.json()));
            form.reset();
            return;
        }

        // Only a 400 has errors to list. A 401 or a 403 has no body at all, so
        // its status is the whole answer.
        if (response.status === 400) {
            const problem = await response.json();
            for (const messages of Object.values(problem.errors)) {
                for (const message of messages) {
                    const item = document.createElement("li");
                    item.textContent = message;
                    errors.append(item);
                }
            }
            return;
        }

        errors.textContent = "Only a signed-in admin can add a truck. Sign in again.";
    });
}
```

Line by line, the parts that are new:

- **`event.preventDefault()`** stops the browser sending the form the old way, which would reload the page. If you ever see the page reload and the address bar end in `?name=…`, this line never ran.
- **`new FormData(form)`** reads every box by its `name`. `values.get("name")` is what's in the Name box, **always as text**.
- **`Number(…)`** turns the rating's text into a number. Measured: the API accepts `"4.3"` as text, but an empty box sends `""`, and `""` can't become a number, so the API answers with an error about `$.rating` and `could not be converted` instead of your `[Range]` message. `Number("")` is `0`, which fails `[Range(1, 5)]` with your own message.
- **The POST is week 13's**, from a page instead of the tester: `method`, the `Content-Type` header (without it, `415`), and `JSON.stringify` to turn the object into JSON text.
- **On `201`, read it back.** The `Location` header names the new truck's address, `/api/trucks/8`. The script GETs it and draws the card from **what the server saved**, not from what was typed. Every write is followed by a GET.
- **On `400`, list the errors.** The body is the same `errors` object week 13 showed in the tester: one property per field, each holding a list of messages. Measured on this course's apps, its keys are the C# property names — `Name`, `Rating` — and a value that couldn't be converted is keyed by its JSON path, like `$.rating`. The script doesn't use the keys at all: `Object.values(problem.errors)` takes every list, and every message becomes an `<li>`.
- **`form.reset()`** empties the boxes.

### The line that didn't change

The page's own heading still says `7 trucks on the street.` after the new card appears. The server wrote that number when the page loaded, and nothing has asked it since. **A page that changes part of itself has to change every part that depends on the change.** Here that would mean a GET of `/api/trucks/count` after each add — week 13's minimal endpoint, finally with a job.

---

## Part 4: Which answers have a body

The handler above checks for `400` before it calls `.json()`. The first version in the demo didn't:

```js
        // Otherwise, list what the rules said.
        const problem = await response.json();
```

That works for a `400`. Then Ada signed out in another tab, with the list page still open, and sent the form again. The API answered `401` — and a `401` has **no body**. The console said:

```
Failed to load resource: the server responded with a status of 401 (Unauthorized)
SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input
```

and nothing appeared on the page, because the script had stopped at `.json()`.

| Status | The body | So the script… |
|---|---|---|
| `200` | the record | `.json()` |
| `201` | the new record, and a `Location` header | reads `Location` back |
| `204` | **nothing** | reads the record back with a GET |
| `400` | `errors` | `.json()`, and lists them |
| `401`, `403` | **nothing** | says so, from the status alone |
| `404` | a short JSON description of the problem | says the record is gone |

**Read the status first. Call `.json()` only when the status says there's a body.**

The `401` and `403` are empty **because of week 13's `UseWhen`**, which keeps the Missing page off `/api`. Without it, they'd carry a page of HTML, and `.json()` would throw a different error on that.

---

## Part 5: Remove, without a reload

**The goal in the demo:** a **Remove** button under each card, for the admin only.

The button, in `Views/Trucks/Index.cshtml`, just below **Show the menu** and inside the same `<div>`:

```cshtml
                @if (User.IsInRole("Admin"))
                {
                    <button type="button" class="btn btn-link text-danger remove">Remove</button>
                }
```

At the bottom of `wwwroot/js/trucks.js`:

```js
// DELETE /api/trucks/2. A 204 has no body, so read the truck back instead:
// once its address answers 404, take the card off the page.
const removeTruck = async (card) => {
    const name = card.querySelector(".card-title").textContent;
    if (!confirm(`Remove ${name}?`)) {
        return;
    }

    const response = await fetch(`/api/trucks/${card.dataset.id}`, { method: "DELETE" });
    if (response.status === 401 || response.status === 403) {
        alert("Only a signed-in admin can remove a truck. Sign in again.");
        return;
    }

    const check = await fetch(`/api/trucks/${card.dataset.id}`);
    if (check.status === 404) {
        card.remove();
    }
};
```

And the listener answers the new button too — it replaces the one from Part 2:

```js
// One listener for every card, including cards added later. closest() finds
// the card the click landed in.
trucks.addEventListener("click", (event) => {
    const card = event.target.closest("[data-id]");
    if (event.target.matches(".show-menu")) {
        showMenu(card);
    }
    if (event.target.matches(".remove")) {
        removeTruck(card);
    }
});
```

Last, a card the form adds should have the button too. In `cardFor`, just below the line with `show-menu`:

```js
            <button type="button" class="btn btn-link text-danger remove">Remove</button>
```

Only an admin can add a card, so every card `cardFor` draws gets one.

- **`confirm()`** shows the browser's own OK/Cancel box, and is `true` only for OK. It's week 8's [why delete asks first](../week-08/lecture-notes.md#why-delete-asks-first), in one line.
- **A `401` or `403` gets a message from its status alone.** No `.json()`: there's nothing to read.
- **A `204` has no body either**, so there's nothing to read the result *from*. The script asks for the truck again instead, and only when that answers `404` does the card come off the page. In **F12 → Network** that's a `DELETE` with `204`, then a GET with `404` — and the console prints the `404` in red as `Failed to load resource`. That red line is the read-back doing its job.

A second tab opened before the removal still shows the truck. Its **Show the menu** gets a `404`, and Part 2's status check says *That truck isn't on the street any more.* — the reason that check is there.

### The whole file

`wwwroot/js/trucks.js` at the end of the night, in this order: `trucks` and `showMenu` (Part 2), the listener (Part 5's version), `cardFor` and the form (Part 3), `removeTruck` (Part 5). **Order matters only for `const trucks`**, which the listener and the form both use as soon as the file runs. The functions are only *called* on a click, long after the whole file has run, so `removeTruck` can sit below the listener that calls it.

---

## Part 6: Your own app

The moves are the same; the names are yours. **Two names are not yours to choose**, because the self-check finds your work by them: `data-id` on each record's element, and the class `show-related` on its button.

| | Curbside | Your app |
|---|---|---|
| the list page | `/Trucks` | `/Trails`, `/Games`, whatever your navbar links to |
| its view | `Views/Trucks/Index.cshtml` | `Views/<YourWord>/Index.cshtml` |
| the script | `wwwroot/js/trucks.js` | **`wwwroot/js/list.js`** |
| each record's element | `data-id="@truck.Id"` | **`data-id="@item.Id"`**, with your own loop variable |
| the button that shows related rows | `class="… show-menu"` | **`class="… show-related"`** |
| the related rows | `truck.specials` | your API's list, whatever week 13 named it |
| the add form and Remove | inside `User.IsInRole("Admin")` | inside your role's check |

**If your list is a table**, the record's element is the `<tr>`: put `data-id` on it, the button in a cell, and the related rows in a `<ul>` inside another cell of the same row. `closest("[data-id]")` finds the row the same way it finds a card.

**The add form's boxes are your input DTO's properties**, with a small first letter. A `bool` property is a checkbox: send `values.get("isDogFriendly") === "on"`, because a checkbox's value is `"on"` when it's ticked and missing when it isn't — and measured, sending `"on"` itself to a `bool` is a `400`.

---

## Part 7: Development, and Production

Every ASP.NET Core app runs in an **environment**, named by the setting `ASPNETCORE_ENVIRONMENT`.

| | Development | Production |
|---|---|---|
| who sets it | `Properties/launchSettings.json`, when `dotnet watch` or `dotnet run` uses its launch profile | nothing — it's the name used when the setting isn't there |
| user secrets | **read** | **not read** |
| an unhandled exception | the developer page, with the code | `UseExceptionHandler("/Home/Error")` |
| `appsettings.{Environment}.json` | `appsettings.Development.json` | `appsettings.Production.json`, if there is one |

**On Azure, nothing sets it**, so your deployed app runs as Production — unless you add an app setting named `ASPNETCORE_ENVIRONMENT`, which you shouldn't.

**User secrets are Development only**, and that's the line that matters most. `WebApplication.CreateBuilder` adds them to the configuration only when the environment is Development. Week 7's notes said it in the configuration chain (*user secrets ← only when running in Development*); here's what it does. Run the app with no launch profile, from the folder with your `.csproj`:

```bash
dotnet run --no-launch-profile --urls http://localhost:5199
```

Nothing names the environment, so it's Production, and it doesn't read your user secrets. Measured on Curbside:

```
Unhandled exception. System.InvalidOperationException: The ConnectionString property has not been initialized.
```

Same code, same laptop, same secret sitting on disk. **That's what Azure sees on every deploy**, which is why your connection string there is an app setting.

---

## Part 8: Where each secret lives

| The secret | Kept in | Read by |
|---|---|---|
| your connection string, `Admin:Email` | **user secrets** | your app, on your laptop, in Development |
| the same two, spelled `ConnectionStrings__DefaultConnection` and `Admin__Email` | **Azure app settings** | your app, on Azure |
| the credential to deploy | **a GitHub repository secret** | the deploy workflow, on GitHub |

**Never in your repository, and never in a workflow file.** A workflow file is in your repository, which is public. It *names* a secret — `${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}` — and GitHub fills it in while the workflow runs, and hides it in the run's log.

### What a real project does

Week 7 said your laptop and your Azure app sharing one database isn't what a real project does. Here's what it does instead:

- **Two databases.** One to develop against, and one for production. A laptop's user secrets point at the first; the production app's settings point at the second, and **no laptop has the production connection string at all.**
- **Migrations reach production through the deploy**, not through someone typing `dotnet ef database update`. One common way: the pipeline runs `dotnet ef migrations script --idempotent`, which writes the SQL for every migration the database hasn't had yet, and applies it as a step, where it's logged and repeatable.
- **Usually a third place in between**, often called staging: a copy of production where a deploy is tried first.

This course keeps one database on purpose: your school SQL Server account is one database, and the point of week 7's exercise was seeing two computers share it.

---

## Part 9: CI and CD with GitHub Actions

**CI, continuous integration:** every push is built, and tested where there are tests, on a machine that isn't yours. A push that breaks the build shows up red for everyone, before anybody merges it.

**CD, continuous delivery:** when the build on `main` passes, it's deployed. `git push` becomes how your app reaches Azure.

**GitHub Actions** runs both, from a **workflow**: a YAML file in `.github/workflows/` in your repository.

### A build on every push

Curbside's, at `.github/workflows/build.yml` — `.github` is a folder at the top of the repository, starting with a dot:

```yaml
# Week 14: GitHub builds Curbside on every push to main and on every pull
# request, on a machine of its own. No secrets: a build connects to nothing.
name: Build

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 10.0.x
      - run: dotnet build
```

- **`on:`** — when it runs: every push to `main`, and every pull request.
- **`runs-on:`** — a fresh Ubuntu machine from GitHub, every time.
- **`steps:`** — `actions/checkout` fetches your code, `actions/setup-dotnet` installs .NET 10, and `run:` is any command you'd type.
- **YAML is indentation.** Each level is two spaces deeper than the one above it, and a tab breaks the file. Paste rather than type.

The lab's workflow is the same, with `dotnet test Cryptids.Checks` in place of `dotnet build`. It needs **no secrets**: the checks use an in-memory database (measured: all five pass with no user secrets anywhere).

Push, then open the repository's **Actions** tab: a run named after your commit, each step ticking off, ✅ or ❌ at the end. Click a failed step to read exactly what the command printed.

### A deploy on every push to main

**The deploy needs a credential**, so it has more setup than the build. Your homework does it, once:

1. **Turn on the deploy credential your app already has.** Apps made by `az webapp up` come with publishing credentials **switched off** — measured on three apps made that way this term. One command, from the folder with your `.csproj`, using your own app's name and resource group:

   ```bash
   az resource update --resource-group <YOUR-GROUP> --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<YOUR-APP> --name scm --set properties.allow=true
   ```

   Your group's name is in the `.azure/config` file that `az webapp up` wrote in your project folder, on the line `group = …`.

2. **Copy the credential.** This prints it — a block of XML called a **publish profile**:

   ```bash
   az webapp deployment list-publishing-profiles --name <YOUR-APP> --resource-group <YOUR-GROUP> --xml
   ```

   ⚠️ **It's a password.** Copy it straight into the next step and nowhere else.

3. **Give it to GitHub.** Your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`. Secret: paste. **Add secret**.

4. **The workflow**, at `.github/workflows/deploy.yml`:

   ```yaml
   # Week 14: every push to main deploys to Azure.
   name: Deploy

   on:
     push:
       branches: [ main ]
     workflow_dispatch:

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: azure/webapps-deploy@v3
           with:
             app-name: <YOUR-APP>
             publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
             package: .
   ```

   `actions/checkout` fetches your code, and `azure/webapps-deploy` sends it to your app, using the secret. **Azure builds it**, exactly the way it has every time you ran `az webapp up`: that command set an app setting, `SCM_DO_BUILD_DURING_DEPLOYMENT`, which tells Azure to build whatever it's sent. `workflow_dispatch` adds a **Run workflow** button on the Actions tab, for deploying without a new commit.

   ⚠️ **Most examples you'll find online run `dotnet publish` first and send the result.** On an app made by `az webapp up` that fails: Azure tries to build the already-built files and stops with `Couldn't detect a version for the platform 'dotnet' in the repo.` Measured. Send the code, as above.

Push, and the **Actions** tab shows a **Deploy** run. Measured on a free-tier app: about a minute and a half, then ✅ and the new code is live. A compile error turns the run red at `azure/webapps-deploy` — click it, and the log shows the same `error CS…` your terminal would, with the file and the line — **and your site keeps running the last version that built.**

**Your app settings aren't touched by a deploy.** The connection string and `Admin__Email` stay on Azure, where `az webapp config appsettings set` put them in weeks 7 and 12.

---

## Part 10: Team git

Git was built for many people changing one project at once. Four habits make it work:

1. **A branch for each change.** `git switch -c ada-heading` makes a branch and moves you onto it. Your commits go there, and `main` doesn't move.
2. **A pull request.** Push the branch (`git push -u origin ada-heading`), and GitHub offers **Compare & pull request**. A pull request asks for the branch to be merged into `main`, and it's where the build runs and where people read the change.
3. **A review.** **Files changed** shows every line. Hover over one and click **+** to comment on it; **Review changes → Approve** says it's ready. GitHub won't let you approve your own.
4. **A merge.** **Merge pull request** puts the branch's commits on `main`.

**Nobody works on `main`. It only changes through a pull request.** Real teams make GitHub enforce that, with a rule that a pull request needs a passing build and an approval before it can merge.

### A merge conflict

Two branches that change **the same line** can't both be merged without someone deciding. After the first merges, the second's pull request says **This branch has conflicts that must be resolved**. The person whose branch it is brings `main` into their branch and decides:

```bash
git pull --no-rebase origin main
```

```
CONFLICT (content): Merge conflict in Views/Home/Index.cshtml
Automatic merge failed; fix conflicts and then commit the result.
```

**`--no-rebase` matters.** It means *merge `main` into my branch*. Measured with git 2.50: a plain `git pull` here stops with `fatal: Need to specify how to reconcile divergent branches.`, unless your git has been configured with a default — which most classroom machines haven't.

Git writes **both** versions into the file, between markers:

```
<<<<<<< HEAD
    <h1 class="display-4">Curbside 🌮 — street food, found</h1>
=======
    <h1 class="display-4">Curbside 🌮 — Wisconsin's food trucks</h1>
>>>>>>> 0f3c2d1…
```

The top half is yours (`HEAD`); the bottom half came from `main`. VS Code shows them colored, with **Accept Current Change** (yours), **Accept Incoming Change** (main's), **Accept Both Changes** above them. Choose, or edit the lines into one you both want — then make sure no `<<<<<<<`, `=======` or `>>>>>>>` is left. Save, and finish the merge:

```bash
git add .
git commit --no-edit
git push
```

`--no-edit` keeps git's own message for the merge commit instead of opening an editor to ask for one. The pull request loses its conflict, and the build runs again on the two changes together — which neither person ever ran.

---

## Part 11: What this course leaves out

- **Frameworks for the page** — React, Vue, Angular, and libraries like htmx. They exist because a page that changes many parts of itself gets hard to keep in step by hand; you met the problem in Part 3's stale count. Plain `fetch` is what every one of them does underneath.
- **OpenID Connect for deploys** — the way Microsoft recommends a workflow sign in to Azure, with no stored password. It needs permission to register an application in your Azure directory, which a student subscription may not have. The publish profile needs none.
- **Deployment slots, staging and approvals** — paid App Service tiers, mostly.
- **`git rebase`** — the other way to bring `main` into a branch, by replaying your commits on top of it. It makes a straighter history and rewrites your commits to do it.
- **Branch protection rules** — making GitHub refuse a merge without a passing build and an approval.
- **CORS** — still not needed. Your pages and your API are the same site.

---

## Troubleshooting

**Clicking a button does nothing**
- **F12 → Console** first. A red error names the file and the line. No error at all usually means the page never loaded the script: check the `@section Scripts` line, and look for the `.js` file in **F12 → Network**.

**`Cannot read properties of null (reading 'addEventListener')`, or `(reading 'textContent')`**
- `querySelector` found nothing, so an id or class in the script doesn't match the page. `#trucks` in the script is `id="trucks"` on the page; `.menu` is `class="menu"`. Check both spellings.

**A `.js` file is a `404`**
- It isn't in `wwwroot`. Only `wwwroot` is served, and `~/js/list.js` means `wwwroot/js/list.js`.

**An edit to your `.js` file doesn't show**
- Reload the page. If it still doesn't, **Ctrl+Shift+R** reloads without the browser's cached copy.

**The page reloads when you submit, and the address bar ends in `?name=…`**
- The browser sent the form itself: the script didn't run, or `event.preventDefault()` is missing. [Part 3](#part-3-a-form-that-sends-json).

**`SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input`**
- `.json()` on an answer with no body: a `204`, a `401` or a `403`. Read the status first. [Part 4](#part-4-which-answers-have-a-body).

**`trail.reviews is not iterable`, or `Cannot read properties of undefined (reading 'length')`**
- The script used the body of a `404` as if it were the record. Check `response.status` before `.json()`, and stop if it isn't `200`. [Part 4](#part-4-which-answers-have-a-body).

**A `400` with `could not be converted` and a name like `$.miles`**
- A box sent `""` where the API wanted a number or a date. `Number(…)` for numbers, `|| null` for dates. [Part 3](#part-3-a-form-that-sends-json).

**A `400` naming a field you filled in**
- That box's `name` isn't the API's name for it.

**A checkbox is always `false`, or a `400` about a `Boolean`**
- `values.get("x") === "on"` — a ticked checkbox's value is `"on"`, and an unticked one isn't sent at all. [Part 6](#part-6-your-own-app).

**`415 Unsupported Media Type`**
- The `Content-Type: application/json` header is missing.

**Your admin's add or remove says to sign in again**
- Your sign-in ran out, you signed out in another tab, or your cookie is older than your role. Sign out and back in.

**A red `404` in the console after a remove**
- The read-back, saying the record is gone. Expected. [Part 5](#part-5-remove-without-a-reload).

**The page's count is wrong after an add or a remove**
- The server wrote it when the page loaded. [The line that didn't change](#the-line-that-didnt-change).

**`The ConnectionString property has not been initialized`, from `dotnet run --no-launch-profile` or on Azure**
- Production doesn't read user secrets. On Azure, the app setting `ConnectionStrings__DefaultConnection` has to be there. [Part 7](#part-7-development-and-production).

**The Actions tab shows no run**
- The workflow isn't in `.github/workflows/` at the top of the repository, the folder's name is missing its dot, or the push happened before the file existed. Commit and push again.

**A Deploy run fails at `azure/webapps-deploy` with `Unauthorized (CODE: 401)`**
- The log says `Unauthorized (CODE: 401)`: the publishing credentials are switched off. Run step 1 of [A deploy on every push to main](#a-deploy-on-every-push-to-main) again, then **Re-run failed jobs** on the run. Measured: the secret you already have works again.

**A Deploy run fails at `azure/webapps-deploy`, and the log shows `error CS…`**
- Your code doesn't build. It's the same error your own terminal would show, with the file and the line. Fix it, commit, push. Your site keeps the last version that built.

**A Deploy run fails with `Couldn't detect a version for the platform 'dotnet' in the repo.`**
- The workflow ran `dotnet publish` and sent the result. Send the code instead: copy `deploy.yml` from the homework again. [A deploy on every push to main](#a-deploy-on-every-push-to-main).

**A workflow run fails at `dotnet build` or `dotnet test`**
- Click the step. It's the same error your terminal would print. Fix it, commit, push.

**`fatal: Need to specify how to reconcile divergent branches.`**
- `git pull --no-rebase origin main`. [A merge conflict](#a-merge-conflict).

**`<<<<<<<` showing on a page**
- A conflict was committed with its markers still in. Take them out, commit, push.
