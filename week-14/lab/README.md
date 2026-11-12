# Week 14 Lab — The Registry Calls Its Own API 📞

Last week the Registry learned to answer programs. Tonight its own pages are the program.

A creature's reports open under its card without leaving the list. A report gets filed from the creature's own page and appears there without a reload. A curator closes a file from the list, and the card goes. Then GitHub runs your checks on every push, and you and a classmate change the same line on purpose to see what a merge conflict looks like. **No table changes, no migration, and no C# to write**: the API is week 13's, unchanged. Tonight is JavaScript, two views and one workflow file.

**Time:** ~113 minutes in class, in seven blocks. Each of the first six follows the part of the demo it practices, and every block but the last ends at an **In class, stop here** note. The blocks are: **Setup and task 1** · task 2 · task 3 · task 4 · task 5 · **team git** · a last block for catching up. **In-class target: all five checks green, and two pull requests merged.**

## Setup

> [!IMPORTANT]
> **The app arrives as week 13 finished it**: the archive answers in JSON at `/api/cryptids`, anyone can file a report with a POST to `/api/sightings`, and only a curator can change the archive. If your own week-13 lab never got to five, you are **not** behind. Check 1 passes before you touch anything.

**1. Update the starters clone.** Open `dotnet-web` in VS Code, then `` Ctrl+` `` for a terminal standing in it:

```bash
git -C dotnet-web-starters pull
```

`-C` tells git to work *in that folder* without moving your terminal into it — you stay in `dotnet-web`, which is where every other command belongs.

**2. Copy the `week-14` folder out of `dotnet-web-starters` and into `dotnet-web`** — next to the clone, never inside it — **and rename the copy.** `CryptidsJs` works. (Never work inside the clone.)

```
CryptidsJs/               ← in `dotnet-web`, the folder you copied and renamed
├─ Cryptids.Web/          ← your app — ALL your code changes happen in here
└─ Cryptids.Checks/       ← the checks — read-only, never edit
```

**3. Open `CryptidsJs` in VS Code** — the folder that *contains* both project folders.

**4. Open three terminals** — `` Ctrl+` `` opens the first, then the `+` in the terminal panel (or `` Ctrl+Shift+` ``) twice more. They are terminals 1, 2 and 3 for the rest of the lab, and every command below names the one it runs in.

| Terminal | Where it stands | What runs in it |
|---|---|---|
| 1 | inside `Cryptids.Web` — `cd Cryptids.Web` | **nothing yet.** Task 1 starts `dotnet watch` here, and it runs for the rest of the lab |
| 2 | inside `Cryptids.Web` — `cd Cryptids.Web` | `dotnet user-secrets`, `dotnet ef` |
| 3 | `CryptidsJs`, the folder holding **both** projects | `dotnet test Cryptids.Checks`, and every `git` command tonight |

**All three open in `CryptidsJs`. Move terminals 1 and 2 — run this in each of them:**

```bash
cd Cryptids.Web
```

Terminal 3 stays in `CryptidsJs`.

**Don't start the app yet.** Task 1 checks your secrets first.

**5. In terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**1 / 5 passing.** Check 1 is the Registry you were handed, already working. The other four are tonight.

**Now carry straight on to [Task 1](#task-1-in-full)** — it's part of this first block, which ends at the **In class, stop here** note after it.

> [!IMPORTANT]
> **No restarts tonight.** Everything you change is a `.js` file or a view, and `dotnet watch` applies both while it runs. Measured: a new file in `wwwroot/js`, an edit to it, and an edit to a view each go live with no `Ctrl+R`, and **the page in your browser reloads itself every time you save.** The first request for a brand-new `.js` file prints a yellow `The static asset '/js/archive.js' was not found in the built time manifest` in terminal 1. That's harmless: the file is served anyway, and the warning stops at the next restart.

## Where tonight's work happens

```
CryptidsJs/
├─ .github/
│   └─ workflows/
│       └─ checks.yml               ← task 5 (new)
└─ Cryptids.Web/
    ├─ Views/Cryptids/
    │   ├─ Index.cshtml             ← tasks 2 and 4
    │   └─ Details.cshtml           ← task 3
    └─ wwwroot/js/
        ├─ archive.js               ← tasks 2 and 4 (new)
        └─ report.js                ← task 3 (new)
```

**No C#, and no migration tonight.** The API from week 13 already does everything the pages ask for.

> [!NOTE]
> **The checks can't click a button.** Nothing in `Cryptids.Checks` runs your JavaScript. What they *can* check is that your page and your script agree: the script is served, everything it looks for is on the page, and the form's box names are the names the API reads. **Your browser is where you watch it work.** Do both.

## The tasks

| # | Check | What to do |
|---|-------|------------|
| 1 | *(check 1 is already green)* | Check your secrets, let `dotnet ef database update` confirm there's nothing to do, start the app and **sign in as yourself**. **No drop tonight.** **[Task 1 in full ↓](#task-1-in-full)** |
| 2 | `AQuickLookNeedsNoReload` | **A creature's reports, under its card** — a GET, without leaving the list. **[Task 2 in full ↓](#task-2-in-full)** |
| 3 | `AReportFilesWithoutLeavingThePage` | **File a report from the creature's page** — a POST, its errors, and the report read back. **[Task 3 in full ↓](#task-3-in-full)** |
| 4 | `OnlyACuratorCanCloseAFileFromTheList` | **Close a file from the list, as a curator** — a DELETE, and the 401 and 403 it can get. **[Task 4 in full ↓](#task-4-in-full)** |
| 5 | `TheChecksRunOnEveryPush` | **GitHub runs your checks** — a workflow, and your lab in a repository of its own. **[Task 5 in full ↓](#task-5-in-full)** |
| 👥 | — | **Team git: a branch, a pull request, a review and a merge conflict**, with a classmate or on your own. No check, no points. **[Team git in full ↓](#team-git-in-full)** |

### Task 1 in full

**Check 1 is already green** — this task is about your database, which the checks can't see but your browser needs.

**No database drop tonight, and here is why.** This starter has exactly the same migration files as weeks 12 and 13, so your database, your account and your curator role are all still valid. The `<UserSecretsId>` hasn't changed either, so your secrets carry over too.

**Look at your secrets — in terminal 2:**

```bash
dotnet user-secrets list
```

**Two lines:** `Admin:Email`, and `ConnectionStrings:DefaultConnection`. On a frozen lab PC they're gone; set them again. The connection string first:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=<SCHOOL-SQL-SERVER>;Database=Cryptids_<COURSE-NUMBER>_<YOUR-INITIALS>;User ID=<YOUR-USERNAME>;Password=<YOUR-PASSWORD>;TrustServerCertificate=True"
```

Then your email:

```bash
dotnet user-secrets set "Admin:Email" "<THE-EMAIL-YOU-JOINED-WITH>"
```

**Same database as weeks 12 and 13.** This is still the Cryptid Registry, and [one application gets one database](../../week-07/lecture-notes.md#naming-your-database).

**Then, still in terminal 2:**

```bash
dotnet ef database update
```

**It applies nothing.** Your database already has all five migrations.

> [!WARNING]
> **`there is already an object named 'Cryptids'`?** You never ran week 12's lab, so your database still has the migrations you made yourself in week 11, and they can't be mixed with this starter's. Only in that case, drop it — **and do these in this order**, because the drop empties `AspNetUsers` too:
>
> 1. In terminal 2: `dotnet ef database drop --force`, then `dotnet ef database update`
> 2. In terminal 1: `dotnet watch`
> 3. **Join** with the email in your `Admin:Email` secret
> 4. **`Ctrl+R` in terminal 1** — the seeder only hands the role out at startup
> 5. **Sign out and back in** — your cookie is older than your role
>
> ⚠️ **Never do this on your own project.** Your semester project has data you care about, and `database drop` does not ask twice. This is a throwaway lab database and that is the only reason it's safe here.

**Now start the app — in terminal 1:**

```bash
dotnet watch
```

**Sign in with your own email.** You should see **＋ Open a new file** on `/Cryptids`. That's your curator role, and task 4 needs it.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 1`** — the same as when you started. Check 2's message says `/Cryptids loads no script of yours yet`. That's correct: task 2 writes one.

> [!NOTE]
> **In class, stop here.** Task 2 comes after the next part of the demo. Checks 2 to 5 are still red, and that's expected. Finished early? Open `wwwroot/api-tester.html` and find its one `fetch` call. Which line reads the status, and which reads the body? Or help a classmate get signed in. Working at home? Carry straight on.

### Task 2 in full

**Check:** `Check2_AQuickLookNeedsNoReload`

**The goal:** a **👀 Quick look** button under every creature's card. Clicking it asks the API for that creature, and lists its reports under the card. The page never reloads.

**First, the page.** In `Views/Cryptids/Index.cshtml`, select the whole grid — from `<div class="row row-cols-1 row-cols-md-3 g-4">` down to its closing `</div>` — and paste over it:

```cshtml
<div id="archive" class="row row-cols-1 row-cols-md-3 g-4">
    @foreach (var cryptid in Model)
    {
        <div class="col d-flex flex-column" data-id="@cryptid.Id">
            <div class="flex-grow-1">
                <partial name="_CryptidCard" model="cryptid" />
            </div>
            <div>
                <button type="button" class="btn btn-link px-0 quick-look">👀 Quick look</button>
            </div>
            <ul class="reports list-unstyled small"></ul>
        </div>
    }
</div>
```

Three things the script needs: `id="archive"` on the grid, so it can find it; `data-id="@cryptid.Id"` on each card's column, so it knows which creature was clicked; and an empty `<ul class="reports">` under each card, for the reports to go in. `d-flex flex-column` and `flex-grow-1` keep the button under its card instead of on top of the next row.

Save. The page reloads itself, and every card has a **👀 Quick look** button that does nothing yet.

**Then the script.** Create **`wwwroot/js/archive.js`** — `wwwroot` is the folder the browser can see, and `js` is already in it:

```js
// Week 14: the archive asks the API for data, and changes part of itself
// without a reload. Views/Cryptids/Index.cshtml loads this file.

const archive = document.querySelector("#archive");

// GET /api/cryptids/1, then list that creature's reports under its card.
const quickLook = async (card) => {
    const reports = card.querySelector(".reports");
    reports.textContent = "Loading…";

    const response = await fetch(`/api/cryptids/${card.dataset.id}`);
    if (response.status !== 200) {
        reports.textContent = "This file has been closed.";
        return;
    }

    const cryptid = await response.json();
    reports.textContent = cryptid.sightings.length === 0 ? "Nothing on file yet." : "";
    for (const sighting of cryptid.sightings) {
        const item = document.createElement("li");
        item.textContent = `${sighting.witness}, ${sighting.location}`;
        reports.append(item);
    }
};

// One listener for every card. closest() finds the card the click landed in.
archive.addEventListener("click", (event) => {
    const card = event.target.closest("[data-id]");
    if (event.target.matches(".quick-look")) {
        quickLook(card);
    }
});
```

`quickLook` is an `async` arrow function, so it can `await`. **`await fetch(…)` sends the GET and waits for the answer** without freezing the page. It reads the **status first**: anything but a 200 gets a message and stops. Only then does it call `.json()` for the body, and add one `<li>` per report with `textContent`. `card.dataset.id` reads the card's `data-id`. **One listener on the whole grid** handles every button, and `closest("[data-id]")` finds the card the click was in.

**Last, load the script.** At the very bottom of `Views/Cryptids/Index.cshtml`, below everything:

```cshtml
@section Scripts {
    <script src="~/js/archive.js"></script>
}
```

The layout puts `@section Scripts` at the end of the page, after jQuery and Bootstrap, so the cards already exist when the script runs.

**Try it.** On `/Cryptids`, click **👀 Quick look** under The Hodag: three reports appear under its card, and the address bar hasn't changed. Now open **F12 → Network**, click **👀 Quick look** under Bigfoot, and click the request named `2`: status `200`, and the **Response** tab shows the same JSON as `/api/cryptids/2` in the address bar. That's the GET your script sent.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 2`** — checks 1 and 2. Check 3's message says `/Cryptids/Details/2 loads no script of yours yet`. That's correct: task 3 writes one.

> [!NOTE]
> **In class, stop here.** Task 3 comes after the next part of the demo. Checks 3 to 5 are still red, and that's expected. Finished early? The line at the top still says how many creatures are on file. Where did that number come from: the server, or your script? Or help a classmate find a misspelled id. Working at home? Carry straight on.

### Task 3 in full

**Check:** `Check3_AReportFilesWithoutLeavingThePage`

**The goal:** a form on the creature's own page that files a report with a POST to `/api/sightings`, lists the API's errors when it's refused, and shows the new report with the others — without a reload. **Anyone can file a report**, so this form is for everyone, signed in or not.

**First, the page.** In `Views/Cryptids/Details.cshtml`, select the accounts — from `@if (Model.Sightings.Count > 0)` down to the closing `}` of its `else` — and paste over them:

```cshtml
@* Week 14: always drawn, even empty, so the script has somewhere to put a new report. *@
<div id="accounts" class="list-group mb-4">
    @foreach (var sighting in Model.Sightings)
    {
        <div class="list-group-item">
            <div class="d-flex justify-content-between">
                <strong>@sighting.Witness</strong>
                <span class="text-muted small">@sighting.SeenOn.ToString("MMMM d, yyyy")</span>
            </div>
            <div class="text-muted small mb-2">@sighting.Location</div>
            <p class="mb-0">@sighting.Account</p>
        </div>
    }
</div>
@if (Model.Sightings.Count == 0)
{
    <p id="no-accounts" class="text-muted">Nothing on file. Nobody has reported this one yet.</p>
}

<h2 class="h5 mt-4">File a report without leaving the page</h2>
<form id="report-form" class="mb-2">
    <input type="hidden" name="cryptidId" value="@Model.Id" />
    <div class="row g-2">
        <div class="col-md-4"><input name="witness" class="form-control" placeholder="Your name" /></div>
        <div class="col-md-5"><input name="location" class="form-control" placeholder="Where you saw it" /></div>
        <div class="col-md-3"><input name="seenOn" type="date" class="form-control" /></div>
        <div class="col-12"><textarea name="account" class="form-control" rows="2" placeholder="What you saw"></textarea></div>
        <div class="col-12"><button class="btn btn-primary">👁️ File it</button></div>
    </div>
</form>
<ul id="report-errors" class="text-danger small mb-4"></ul>
```

The list of accounts now has an id, `accounts`, and is always drawn, so the script has a place to put a report even on a creature with none. **The form's box names are the API's names** — `cryptidId`, `witness`, `location`, `seenOn`, `account` — the same as `SightingInput`'s properties with a small first letter, because the script copies each box into the JSON under its own name. The hidden box carries the creature's id. And this form has no `method="post"` and no `asp-action`: the script sends it, not the browser.

**Then the script.** Create **`wwwroot/js/report.js`**:

```js
// Week 14: file a report from the creature's own page, without a reload.
// Views/Cryptids/Details.cshtml loads this file.

const form = document.querySelector("#report-form");
const errors = document.querySelector("#report-errors");
const accounts = document.querySelector("#accounts");

// One account, drawn the same way the page draws it. Everything a person typed
// goes in with textContent, never innerHTML, so it shows as text and never runs.
const accountFor = (sighting) => {
    const item = document.createElement("div");
    item.className = "list-group-item";
    item.innerHTML = `
        <div class="d-flex justify-content-between">
            <strong class="witness"></strong>
            <span class="text-muted small seen-on"></span>
        </div>
        <div class="text-muted small mb-2 where"></div>
        <p class="mb-0 account"></p>`;
    item.querySelector(".witness").textContent = sighting.witness;
    item.querySelector(".seen-on").textContent = new Date(sighting.seenOn)
        .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    item.querySelector(".where").textContent = sighting.location;
    item.querySelector(".account").textContent = sighting.account;
    return item;
};

// POST /api/sightings, with the form's values as JSON.
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errors.textContent = "";

    const values = new FormData(form);
    const response = await fetch("/api/sightings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cryptidId: Number(values.get("cryptidId")),
            witness: values.get("witness"),
            location: values.get("location"),
            seenOn: values.get("seenOn") || null,     // an empty date box sends no date
            account: values.get("account"),
        }),
    });

    // Only a 400 has errors to list.
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

    if (response.status !== 201) {
        errors.textContent = `Not filed: the server answered ${response.status}.`;
        return;
    }

    // The Location header names the creature. Read it back, and redraw its accounts.
    const saved = await fetch(response.headers.get("Location"));
    const cryptid = await saved.json();
    accounts.textContent = "";
    for (const sighting of cryptid.sightings) {
        accounts.append(accountFor(sighting));
    }
    document.querySelector("#no-accounts")?.remove();
    form.reset();
});
```

**`event.preventDefault()` stops the browser sending the form itself**, so the page stays where it is. `FormData` reads the boxes by name. The POST is week 13's, from a page instead of the tester: `method`, the `Content-Type` header, and `JSON.stringify` for the body. `Number(…)` turns the hidden box's text into a number, and `|| null` sends no date at all when the date box is empty, so the API's `[Required]` message comes back instead of an error about converting `""`.

**The status decides what happens next.** A `400` carries `errors`, one list of messages per property, and each message becomes an `<li>`. Anything that isn't a `201` gets a message. A `201`'s `Location` header names the creature the report belongs to, `/api/cryptids/2`, so the script **reads that address back** and redraws the accounts from what the server now has. `?.` after `querySelector("#no-accounts")` means "if there is one".

**Last, load it.** At the bottom of `Views/Cryptids/Details.cshtml` there's already a `@section Scripts` with a `console.log` in it. Add one line inside it, below the `</script>` that's there:

```cshtml
    <script src="~/js/report.js"></script>
```

**Try it.** Open **Bigfoot's page**, fill in all four boxes and click **👁️ File it**. Your report appears with the others, the boxes empty, and the address bar hasn't changed. In **F12 → Network**: a `sightings` request that says `201`, then a `2` that says `200`, which is the read-back. Then click **👁️ File it** with every box empty:

```
When did you see it?
Say what you saw.
Give us at least 10 characters.
Who is reporting this?
The field Witness must be a string with a minimum length of 2 and a maximum length of 60.
Where did you see it?
```

Six messages from four empty boxes: an empty name breaks both `[Required]` and `[StringLength]`, and so does an empty account. They're `SightingInput`'s rules from week 13, now listed on the page, in the order the API sends them.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 3`** — checks 1 to 3. Check 4's message says the script never sends a DELETE to `/api/cryptids/…`. That's correct: task 4 adds it.

> [!NOTE]
> **In class, stop here.** Task 4 comes after the break and the next part of the demo. Checks 4 and 5 are still red, and that's expected. Finished early? File a report with **Your name** set to `<b>Me</b>`. It shows as those exact characters, not in bold. Which line in `accountFor` is the reason? Or help a classmate with a `400`. Working at home? Carry straight on.

### Task 4 in full

**Check:** `Check4_OnlyACuratorCanCloseAFileFromTheList`

**The goal:** a **🗑️ Close the file** button under each card, **for curators only**, that sends a DELETE, and takes the card off the page once the creature is gone. A visitor never sees the button, and a curator whose sign-in has run out gets told so.

**The button.** In `Views/Cryptids/Index.cshtml`, just below the **👀 Quick look** button, inside the same `<div>`:

```cshtml
                @if (User.IsInRole("Curator"))
                {
                    <button type="button" class="btn btn-link text-danger close-file">🗑️ Close the file</button>
                }
```

**The DELETE.** At the very bottom of `wwwroot/js/archive.js`:

```js

// DELETE /api/cryptids/1. A 204 has no body, so read the creature back
// instead: once its address answers 404, take the card off the page.
const closeFile = async (card) => {
    const name = card.querySelector(".card-title").textContent;
    if (!confirm(`Close the file on ${name}? Its reports go with it.`)) {
        return;
    }

    const response = await fetch(`/api/cryptids/${card.dataset.id}`, { method: "DELETE" });
    if (response.status === 401 || response.status === 403) {
        alert("Only a signed-in curator can close a file. Sign in again.");
        return;
    }

    const check = await fetch(`/api/cryptids/${card.dataset.id}`);
    if (check.status === 404) {
        card.remove();
    }
};
```

**Then the listener**, so the new button does something. In `wwwroot/js/archive.js`, select the listener — from `// One listener for every card.` down to its closing `});` — and paste over it:

```js
// One listener for every card. closest() finds the card the click landed in.
archive.addEventListener("click", (event) => {
    const card = event.target.closest("[data-id]");
    if (event.target.matches(".quick-look")) {
        quickLook(card);
    }
    if (event.target.matches(".close-file")) {
        closeFile(card);
    }
});
```

`confirm()` asks first, the way week 8's Delete page did. The DELETE is week 13's. **A `401` or `403` has no body**, so the script answers those by their status alone and never calls `.json()`. **A `204` has no body either**, so instead of reading one, it asks for the creature again: once that answers `404`, the creature is gone, and the card goes too.

**Try it.** Don't close a creature you want to keep. Click **＋ Open a new file**, add a test creature, then on `/Cryptids` click **🗑️ Close the file** under it and **OK**. The card goes. Reload, and it stays gone. In **F12 → Network**: a `DELETE` that says `204`, then a GET of the same address that says `404`. The console prints `Failed to load resource: the server responded with a status of 404` for it, **in red, and that's expected**: it's the read-back saying the creature is gone.

Now **Sign out**. The buttons go, because the page is drawn again for a visitor.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 4`** — checks 1 to 4. Check 5's message says there's no workflow in `CryptidsJs/.github/workflows/`. That's correct: task 5 adds one.

> [!NOTE]
> **In class, stop here.** Task 5 comes after the next part of the demo. Check 5 is still red, and that's expected. Finished early? Sign in, open `/Cryptids` in **two** tabs, close a test creature's file in one, then click **👀 Quick look** on the same creature in the other. Which line answers? Or help a classmate. Working at home? Carry straight on.

### Task 5 in full

**Check:** `Check5_TheChecksRunOnEveryPush`

**The goal:** GitHub runs `dotnet test Cryptids.Checks` on a machine of its own, every time you push and on every pull request. That's **CI**, continuous integration: nobody merges code whose checks are red, because everybody can see them.

**The workflow.** In `CryptidsJs` — the folder holding both projects, **not** inside `Cryptids.Web` — create a folder named **`.github`**, with a **`workflows`** folder inside it, and in that a file named **`checks.yml`**:

```yaml
# Week 14: GitHub runs the Registry's checks on every push to main and on
# every pull request, on a machine of its own. No secrets: the checks use an
# in-memory database, so there is nothing to connect to.
name: Checks

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 10.0.x
      - run: dotnet test Cryptids.Checks
```

**Spaces matter in YAML.** Each level is indented two spaces more than the one above it, and a tab breaks the file. Paste rather than type.

`on:` says when it runs. `runs-on:` asks GitHub for a fresh Ubuntu machine. The steps fetch your code, install .NET 10, and run the same command you run in terminal 3. **It needs no secrets**: the checks never connect to SQL Server.

**Run the checks, in terminal 3:**

```bash
dotnet test Cryptids.Checks
```

**`Passed: 5`** — all five. 🎉

**Now put it on GitHub, where the workflow runs.** This is a **throwaway repository**, for tonight and for team git — not your semester project.

1. On github.com, **+** → **New repository**. Name it **`cryptids-team`**, choose **Private**, and **don't** add a README, a `.gitignore` or a license. **Create repository**.
2. **In terminal 3**, in `CryptidsJs`, make the `.gitignore` first, so `bin` and `obj` stay out:

   ```bash
   dotnet new gitignore
   ```

3. Then the first commit, still in terminal 3:

   ```bash
   git init
   git add .
   git commit -m "The Registry, with its checks running on GitHub"
   ```

4. GitHub's empty-repository page shows three lines under **…or push an existing repository from the command line**. Copy them with the copy button beside them, and paste them into terminal 3. They look like this, with your own name in the address:

   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/cryptids-team.git
   git branch -M main
   git push -u origin main
   ```

5. On GitHub, open your repository's **Actions** tab. A run named after your commit message is in progress; click it. When it finishes it turns ✅, and the `dotnet test` step says `Passed: 5`.

> [!NOTE]
> **In class, stop here.** Team git comes after the break and the next part of the demo, and it runs on this repository. Finished early? Find your classmate for team git, and swap GitHub usernames. Working at home? Team git needs two people, or two folders: [Team git in full](#team-git-in-full) shows both.

### Team git in full

**No check, no points, and nobody's grade depends on a partner turning up.** Work in pairs: **A** owns the repository, **B** is invited to it. No partner tonight? Play both — the [on your own](#on-your-own) note says how.

**Use A's `cryptids-team`.** Both of you change **the same line** on purpose, so the second merge has a conflict to resolve.

**1. A invites B.** On A's repository: **Settings** → **Collaborators** → **Add people** → B's GitHub username. **B accepts** the invitation, from the email GitHub sends or from github.com/notifications.

**2. B gets a copy.** In terminal 3, from `dotnet-web` (one folder up from `CryptidsJs`):

```bash
cd ..
git clone https://github.com/<A-USERNAME>/cryptids-team.git
```

Open the new `cryptids-team` folder in VS Code (**File → Open Folder**) and use its terminal from here on.

**3. Each of you, a branch.** A, in `CryptidsJs`; B, in `cryptids-team`:

```bash
git switch -c <YOUR-NAME>-heading
```

**4. Each of you changes the same line, differently.** In `Cryptids.Web/Views/Home/Index.cshtml`, the heading is `<h1 class="display-4">Cryptid Registry</h1>`. Change the words between the tags to something of your own, save, then:

```bash
git commit -am "<YOUR-NAME>: the home page heading"
git push -u origin <YOUR-NAME>-heading
```

**5. Each of you, a pull request.** On the repository's page, GitHub shows **Compare & pull request** for your branch: click it, then **Create pull request**. Under it, the **Checks** workflow runs on your branch, and turns ✅.

**6. Review the other one's.** Open your partner's pull request → **Files changed**. Hover over the changed line, click the **+** that appears, and leave a comment. Then **Review changes** → **Approve** → **Submit review**.

**7. A merges first.** A's pull request → **Merge pull request** → **Confirm merge**. Now look at B's: GitHub says **This branch has conflicts that must be resolved**. Both changed the same line, and git won't guess which one is right.

**8. B brings main in, and resolves it.** In B's terminal:

```bash
git pull --no-rebase origin main
```

```
CONFLICT (content): Merge conflict in Cryptids.Web/Views/Home/Index.cshtml
Automatic merge failed; fix conflicts and then commit the result.
```

**`--no-rebase` is not optional here.** Without it, a recent git stops with `fatal: Need to specify how to reconcile divergent branches.` and does nothing. It means *merge main into my branch*.

Open `Index.cshtml`. VS Code marks the two versions: **Current Change** is yours, **Incoming Change** is what came from main. Choose one with **Accept Current Change** or **Accept Incoming Change**, or edit the line into a third version you both like, and make sure no `<<<<<<<`, `=======` or `>>>>>>>` lines are left. Save, then:

```bash
git add .
git commit --no-edit
git push
```

`--no-edit` keeps git's own message for the merge, instead of opening an editor to ask for one.

**9. Finish it.** B's pull request no longer has a conflict, and the **Checks** workflow runs again on the merged code. When it's ✅, A merges it. Both of you: switch back to `main` and pull, and your copies match:

```bash
git switch main
git pull
```

#### On your own

Do every step yourself, as both people. Your second copy is a second clone: in step 2, clone your own repository into a folder with another name — `git clone https://github.com/<YOUR-USERNAME>/cryptids-team.git cryptids-team-b` — and do B's steps there. Skip step 1. **GitHub won't let you approve your own pull request**, so in step 6 leave a comment instead.

> [!NOTE]
> **In class, stop here** when both pull requests are merged and your copies match. The last block is for catching up. Working at home? You're done.

## Rules

- **Never edit `Cryptids.Checks`.** If a check looks wrong, tell me.
- **Your code changes are in `Cryptids.Web` only.** Task 5's workflow is the one file outside it, in `CryptidsJs/.github/workflows/`.
- `dotnet test Cryptids.Checks` runs from `CryptidsJs`, the folder above both projects.
- **The checks don't need wifi or SQL Server**, and they don't run your JavaScript. 5/5 does **not** prove your connection string works, or that a button does anything. Your browser proves both.

## 🆘 Stuck?

- **The app stops before `Now listening on:` with `The ConnectionString property has not been initialized`** — the connection string secret is gone; frozen lab PCs wipe it. [Task 1 in full ↑](#task-1-in-full).
- **Clicking a button does nothing** — open **F12 → Console**. A red error names the file and the line. No error at all usually means the page never loaded the script: look for the `<script src="~/js/…">` line, and in **F12 → Network** for the `.js` file's request.
- **`Cannot read properties of null (reading 'addEventListener')`** — `querySelector` found nothing, so an id or a class in the script doesn't match the page. `#archive` in the script is `id="archive"` on the page. Check 2's or 3's message names the one that's missing.
- **A `.js` file comes back `404`** — it isn't in `wwwroot/js`. Only `wwwroot` is served.
- **Your edit to a `.js` file doesn't show** — reload the page. If it still doesn't, **Ctrl+Shift+R** reloads without the browser's cached copy.
- **The page reloads when you click 👁️ File it, and the address bar ends in `?witness=…`** — the script never ran, or `event.preventDefault()` is missing, so the browser sent the form itself.
- **`SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input`** — the script called `.json()` on an answer with no body: a `204`, a `401` or a `403`. Read `response.status` first, and only call `.json()` when the status says there's a body.
- **`400` with an error about `$.seenOn` or `could not be converted`** — a box sent `""` where the API wanted a date or a number. `|| null` for the date, `Number(…)` for a number. [Task 3 in full ↑](#task-3-in-full).
- **`400` naming a box you filled in** — the box's `name` isn't the API's name for it. Check 3's message lists the names it found.
- **`415 Unsupported Media Type`** — the `Content-Type: application/json` header is missing.
- **The report saves, then shows on the wrong creature** — the hidden `cryptidId` isn't `@Model.Id`.
- **🗑️ Close the file says `Only a signed-in curator…`, and you're the curator** — your cookie is older than your role, or you signed out in another tab. Sign out and back in.
- **A red `404` in the console after closing a file** — that's the read-back saying the creature is gone. Expected.
- **Check 5 says there's no workflow** — `.github` belongs in `CryptidsJs`, next to `Cryptids.Web`, and its name starts with a dot.
- **GitHub's Actions tab shows nothing** — the workflow isn't at `.github/workflows/checks.yml` in the repository, or you pushed before you made it. Make it, commit, push.
- **The Actions run fails at `dotnet test`** — click the failed step: it prints the same check messages you get in terminal 3.
- **`git push` asks for a password and refuses it** — GitHub doesn't take passwords. Sign in through the browser window Git opens, the way you did in week 3.
- **`fatal: Need to specify how to reconcile divergent branches.`** — use `git pull --no-rebase origin main`. [Team git in full ↑](#team-git-in-full).
- **"Could not find a MSBuild project file"** — that terminal is standing in `CryptidsJs`, which holds two projects. `dotnet watch`, `dotnet ef` and `dotnet user-secrets` need one: run `cd Cryptids.Web` in terminals 1 and 2.

## 🚀 Done early?

- **Keep the count honest.** The line at the top of `/Cryptids` still says how many creatures are on file after you close one. Give it an id, and after a close, set its text from `/api/cryptids/count`.
- **Update the report count on the creature's page** after a report is filed, from the `sightings` the read-back returns.
- **Watch the script work.** In **F12 → Sources**, open `archive.js`, click the line number beside `const response = await fetch(…)` to set a breakpoint, and click **👀 Quick look**. Step over it with **F10** and watch `response` appear in **Scope**.
