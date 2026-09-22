# Week 10 — The Midterm Project

**What this covers:** nothing new. It covers how to look at an application you built yourself and see it the way somebody else does — and then the specific, unglamorous moves that turn *working* into *finished*: a front door of your own, pages that say something when there is nothing to show, a wrong id that lands somewhere instead of nowhere, data that reads like content, and a README a stranger can act on.

**Keep this open while you work.** Every requirement in the homework has a section here, and the 🆘 section at the bottom of the homework links straight into it.

> [!NOTE]
> **There is no lab this week and no new syntax.** Every technique below is something you have already used — a Razor `@if`, a view, a controller action, an attribute, a line in `Program.cs`. The hard part of tonight is not the code. It is deciding what is worth doing.

---

## Part 1: Working and finished are different questions

Since week 4 you have been answering one question every week: *does it work?* `dotnet test` answered it in the lab, and the self-check answered it on your deployed URL. That question has a yes or no, and a script can ask it.

This week asks a different one: **would you send someone this link?**

That question has no script, which is why this week's self-check scores nothing. It is also the question that decides whether anything you built matters to anyone but you. An application that works and that nobody can make sense of is, from the outside, indistinguishable from one that does not work.

The gap between the two is usually not big. It is a handful of small things, each of which takes ten minutes, and which you stopped seeing around week 6 because you have looked at your own app four hundred times.

**That last part is the real problem, and it has a name: you cannot see your own front door.** You know the app is about trails. You know the list is at `/Trails`. You know that the number by each name is a review count. None of that is on the screen. A stranger arrives with none of it and has about ten seconds of patience.

---

## Part 2: The stranger's pass

Here is the method, and it is worth doing deliberately rather than from memory.

**Open your deployed URL.** Not localhost — the deployed one, because that is the one a stranger gets and the one I open. And not the tab you have had open since September; load it fresh, so you are looking at what is actually deployed rather than what was deployed in October.

**Then open it on your phone.** This is the part that does the real work. You have built this thing on a laptop, at a width you chose, with the code in the next window — and you have almost certainly never once looked at it on the device half your visitors would use. Different width, bigger tap targets, no developer tools to explain anything away. Week 2 asked you to do this to your static Registry and graded it; nothing since has made it less true.

Then walk it, and write down what you see. Not what you meant:

1. **The front page.** Read it as though you arrived from a link somebody sent you. What is this site? What is it for? What can you do here? If the answer takes longer than a sentence, that is finding number one.
2. **Click the first thing you would click.** Did it go where you expected?
3. **Every link in the navbar.** All of them. Including the ones you have never clicked because you know they are the template's.
4. **One record's page.** Is there a way onward from it, or is it a dead end? Can you get back?
5. **Your form.** Could a person find it without you telling them where it is?
6. **The browser tab.** What does it say? That is what a bookmark gets named.
7. **Edit the URL** — change the id at the end to something that does not exist. What happens?
8. **Your repo link.** Click it. What does GitHub show a person who has never met you?

> [!NOTE]
> **One finding is deliberate, and you are not fixing it this week.** Nothing in your app asks who anybody is — a visitor with your URL can add, edit and delete records. That has been true since week 6, when you built the first form, and it stays true through the midterm. It is next week's subject, and spending midterm time on it means spending it on something you are about to be taught properly.

> [!TIP]
> **Write the list down before you fix anything.** The temptation is to fix the first thing you notice, and then you are inside the code and the pass is over. The list is the deliverable; the fixes come after.

Week 9's homework already had you do this once. **Bring that list** — the three things you wrote down are the spine of your midterm, and the homework asks you to name them.

---

## Part 3: The front door

The single most common finding, in every cohort, is this one: **the home page is still the one `dotnet new mvc` wrote.**

```html
<div class="text-center">
    <h1 class="display-4">Welcome</h1>
    <p>Learn about <a href="https://learn.microsoft.com/aspnet/core">building Web apps with ASP.NET Core</a>.</p>
</div>
```

This is not anybody's fault. The semester project started in week 4 with a controller and a list, and nothing since has had a reason to send you back to `Views/Home/Index.cshtml`. But it is the first page every visitor sees, and it currently advertises Microsoft's documentation.

A front page that does its job answers three things, and it can do it in six lines:

- **What this is.** One sentence, in the language a visitor would use, not the language your model uses.
- **A way in.** A button to your list page. Not a link in the navbar — a button, on the page, that is obviously the thing to press.
- **Why it is worth a click.** One more sentence, optional, and usually the difference between a page and a poster.

Here is the whole file, as the demo's version ends up — `Views/Home/Index.cshtml`:

```cshtml
@{
    ViewData["Title"] = "Street food across Wisconsin";
}

<div class="p-5 mb-4 bg-body-tertiary rounded-3" data-bs-theme="dark">
    <h1 class="display-4">Curbside 🌮</h1>
    <p class="lead">
        Every food truck worth chasing in Wisconsin — what they cook, where they
        park, and what's on today.
    </p>
    <a asp-controller="Trucks" asp-action="Index" class="btn btn-primary btn-lg">Browse the trucks</a>
    <a asp-controller="Dishes" asp-action="Index" class="btn btn-outline-light btn-lg">Start from a dish</a>
</div>

@section Scripts {
    <script src="https://jgrissom.github.io/dotnet-web-dev/week-10/homework-checks.js"></script>
}
```

Nothing there is new. It is Bootstrap classes from week 2 and two anchor tag helpers from week 4.

> [!WARNING]
> **If your theme is a dark one, two of those classes will betray you — and the page will not tell you.** This is worth reading even if your site looks fine, because the failure is silent.
>
> Week 2 taught you that `bg-light` is *literally* light in every theme, and that `bg-body-tertiary` is the theme-aware replacement. **That was true and it still is.** But it follows **Bootstrap's** light/dark switch — `data-bs-theme` — and a Bootswatch theme does not throw that switch. Week 2's site was on a light theme, so it never came up. In week 5 you picked a theme, and a dark one changes the body colors while leaving those surface tints at their light-mode values.
>
> Measured on the demo app, which is on **darkly**:
>
> | | background | text | contrast |
> |---|---|---|---|
> | the hero, as written above without `data-bs-theme` | `#f8f9fa` | `#fff` | **1.05 : 1** |
> | the same hero with `data-bs-theme="dark"` | `#292929` | `#fff` | **14.55 : 1** |
> | the rest of the page | `#222` | `#fff` | 15.91 : 1 |
>
> Anything under about **4.5 : 1** is unreadable body text. `1.05` is invisible.
>
> **And the second button is a different bug with the same symptom.** `btn-outline-secondary` takes its color from the theme's *brand* palette, and in a dark theme `secondary` is a dark gray. `data-bs-theme` does not touch brand colors, so that one stays a ghost until you change the class itself — `btn-outline-light` reads at 7.01 : 1 there.
>
> **The same file on a light theme is fine.** The answer key's other app is on `flatly` and the identical markup measures **14.63 : 1**. Nothing is wrong with the class. What is wrong is assuming it still fits an app you changed two months ago.
>
> 🔎 **How to check your own — you do not need DevTools for this.** Open your deployed front page and read it. If you are squinting, that is the finding. DevTools is for explaining *why*, not for noticing.
>
> **To see the numbers:** right-click the panel → **Inspect** → **Computed** tab → type `color` in its filter box. Both values are there together, because a computed style includes what an element inherits:
>
> ```
> background-color    rgb(248, 249, 250)
> color               rgb(255, 255, 255)
> ```
>
> **To see the cause**, stay on that element and look at the **Styles** pane instead. The background is not written as a color at all:
>
> ```css
> background-color: rgba(var(--bs-tertiary-bg-rgb), var(--bs-bg-opacity)) !important
> ```
>
> and further down, under **Inherited from body**, `color: var(--bs-body-color)`. **Both are variables, and your theme filled in one of them and not the other** — that is the whole bug on one screen. `data-bs-theme="dark"` is what fills in the first one.

> [!IMPORTANT]
> **Your self-check `<script>` tag lives in this file.** If you rewrite `Views/Home/Index.cshtml` from scratch you will delete it, the console will go quiet, and it is very easy to read that as *"no findings"*. Put the block back at the bottom:
>
> ```cshtml
> @section Scripts {
>     <script src="https://jgrissom.github.io/dotnet-web-dev/week-10/homework-checks.js"></script>
> }
> ```

### The browser tab

At the top of every view is a line you have been copying since week 4:

```cshtml
@{
    ViewData["Title"] = "Home Page";
}
```

`"Home Page"` is the template's. It is what `_Layout.cshtml` drops into `<title>`, which is what names a bookmark, what shows in a tab, and what appears when somebody pastes your link into a chat. Set it on every view to something that describes that page.

### The page you did not write

The template ships a **Privacy** page. It says:

> Use this page to detail your site's privacy policy.

It is linked from your navbar and from your footer, so it is on every page of your site, and it is a page you have never opened. A stranger who clicks it learns that nobody is home.

Two honest options, and both are fine:

- **Delete it.** The view (`Views/Home/Privacy.cshtml`), the action on `HomeController`, and **both** links in `_Layout.cshtml` — navbar and footer. Four small deletions.
- **Make it an About page.** Same file, real content: what this project is, who built it, what it is for. On a course project this is often the better answer, because it gives you somewhere to say "this is a student project" out loud.

**A page you have not written is worse than no page at all**, because the link promises something.

---

## Part 4: When there is nothing there yet

Every list page you have built renders like this:

```cshtml
<ul class="list-group">
    @foreach (var dish in Model)
    {
        <li class="list-group-item">@dish.Name</li>
    }
</ul>
```

Ask what that draws when `Model` is empty. Not an error — a `@foreach` over an empty list is perfectly happy. It draws **`<ul class="list-group"></ul>`** — and Bootstrap puts its border on `.list-group-item`, not on the list, so with no items there is no border, no background and **no height at all**. What a visitor gets is your heading, and then empty space.

You have almost certainly never seen this, and that is exactly why it is worth a section. **You seeded your data in week 7 and it has been there ever since.** Your app has never been empty on your machine. It will be empty for the first person who uses it.

The fix is a Razor `@if`, which you have had since week 4:

```cshtml
@if (!Model.Any())
{
    <p class="text-muted">No dishes yet. <a asp-action="Create">Add the first one</a>.</p>
}
else
{
    <ul class="list-group">
        @foreach (var dish in Model)
        {
            <li class="list-group-item">@dish.Name</li>
        }
    </ul>
}
```

**An empty state is two things, and the second one is the one people forget:** a sentence saying nothing is here, and **a way to change that**. "No reviews yet" is a dead end. "No reviews yet — be the first" with a button is a page that works.

The same goes for a *related* list on a details page, and that one you can actually reach: create a brand-new record through your form and look at its page. A dish nobody serves, a trail with no reviews, a creature with no sightings. Whatever your app renders there right now is what every new record looks like.

```cshtml
@if (Model.Specials.Any())
{
    ...the list...
}
else
{
    <p class="text-muted">No truck is serving this yet.</p>
    <p><a asp-controller="Specials" asp-action="Create" class="btn btn-primary">＋ Put it on a truck</a></p>
}
```

> [!NOTE]
> `Any()` and `Count > 0` both work and neither is wrong. `Any()` reads better and stops at the first row; on a collection already loaded into memory by `Include` the difference does not matter.

---

## Part 5: The page a wrong id lands on

Try this on your own deployed site right now: take a details URL and change the number to something enormous.

```
/Trails/Details/99999
```

Every controller you have written guards against this, and correctly:

```csharp
var trail = _context.Trails.FirstOrDefault(t => t.Id == id);

if (trail == null)
{
    return NotFound();
}
```

So the request comes back **404** — which is the right status, and is honest. The problem is what `NotFound()` sends as the body, which is **nothing at all. Zero bytes.** With no body to draw, the browser falls back to its own error page: grey, unstyled, in the browser's language rather than yours, with no navbar, no link home, and nothing to suggest the site still exists.

**This is not a hypothetical.** It is what happens to every saved link, every bookmark and every URL anyone has shared the moment you delete that record. You built Delete in week 8. This is its other end.

The fix is three small pieces. **Build them in this order — view, action, then the line that wires them up.**

> [!WARNING]
> **The order is not cosmetic.** Add the `Program.cs` line first and there is a window where the app is told to render a page you have not written yet. In that window **every wrong-id URL answers `500`** — worse than the blank page you are fixing, and the error names a view rather than the thing you actually changed. Built bottom-up, every half-finished state is harmless.

**First, `Views/Home/Missing.cshtml`** — an ordinary view that wears your layout like every other page. Nothing routes to it yet, so nothing changes:

```cshtml
@{
    ViewData["Title"] = "Not found";
}

<div class="text-center py-5">
    <h1 class="display-5">Keep on Truckin' 🌮</h1>
    <p class="lead text-muted">
        That page doesn't exist — or it did, and the truck moved on.
    </p>
    <a asp-controller="Trucks" asp-action="Index" class="btn btn-primary">See every truck</a>
</div>
```

**Then the action on `HomeController` that renders it:**

```csharp
public IActionResult Missing()
{
    return View();
}
```

At this point browse to `/Home/Missing` — it is a real page already. Nothing sends anyone there yet.

**Last, one line in `Program.cs`**, above `app.UseRouting()`, which is what sends them:

```csharp
// A wrong id, or a URL nobody recognizes, used to be a blank browser page.
// This re-runs the request through /Home/Missing and keeps the 404 status.
app.UseStatusCodePagesWithReExecute("/Home/Missing");

app.UseRouting();
```

That is the whole change, and it covers more than the case you tested. It catches a bad id, a misspelled controller, a route that never existed. The status stays whatever it was, which matters: the page apologizes to a person *and* still tells a machine the truth.

**Two conditions, and it is worth knowing both:**

- **The status is anywhere from 400 to 599.** Not just 404 — measured, every 4xx *and* every 5xx re-executes through your page. A 200 or a 301 passes straight through, as it should.
- **The body has to be empty.** If something already wrote a response body, the middleware leaves it completely alone.

That second condition is what keeps this from colliding with the `app.UseExceptionHandler("/Home/Error")` line that has been in your `Program.cs` since week 3. An exception that reaches the top writes the Error page's body, so status-code pages never touches it. Measured on the demo app:

| what happened | which one handles it | what the visitor gets |
|---|---|---|
| a thrown exception | `UseExceptionHandler` | the Error page, 500 |
| `NotFound()` with no body | `UseStatusCodePagesWithReExecute` | your Missing page, 404 |

> [!NOTE]
> One consequence worth noticing rather than fixing: a bare `return StatusCode(500)` with no body *would* land on your Missing page, which says the page does not exist — the wrong sentence for a server error. Nothing in this course returns one, so it is a curiosity rather than a bug. If you ever do write one, give it its own body.

> [!WARNING]
> **Do not call the action `NotFound()`.** `Controller` already has a method by that name — it is the one returning the blank page you are replacing — and yours would shadow it. Name it `Missing`, `Gone`, `PageNotFound`, anything else.

> [!IMPORTANT]
> **Both halves of this are edits `dotnet watch` cannot hot-reload.** `Program.cs` only ever runs at startup, and a brand-new `.cshtml` is a change the running app cannot absorb. `watch` handles it by **restarting** — and in the integrated terminal it asks first:
>
> ```
> Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)
> ```
>
> That prompt appears in the terminal `dotnet watch` is running in, while you are typing in the editor. **If your wrong-id URL still comes back blank after the edit, go and look at that terminal — the prompt is probably sitting there unanswered.** Answer `a` once and it stops asking for the rest of the session.

---

## Part 6: Dead ends

A **dead end** is any page a visitor can reach that offers nothing to do next. They are easy to build and invisible from the inside, because you never arrive at a page — you always arrive *from* somewhere, knowing where you came from.

Three shapes worth checking for:

**A details page with no way onward.** It shows the record and stops. No link back to the list, no link to the related records, no edit. The visitor's only move is the back button.

**A list with nothing on it to click.** Every row should go somewhere. If a row on your list page is plain text, ask why it is on a list page at all.

**A form nobody can find.** This one is graded elsewhere too — week 9 required the link, and it is worth restating: a form that works perfectly and is reachable only by typing `/Reviews/Create` into the address bar does not exist as far as a visitor is concerned. Put the link where the action makes sense, which is usually on the page showing the thing it relates to.

**And the inverse: a table nobody can add to.** Look at each of your tables and ask how a new row gets there. If the honest answer is "I seed it, or I open the mssql panel", then from the outside that part of your app is read-only. That may be a legitimate decision — but it should be a decision.

---

## Part 7: Data that reads like data

Your seed data is content. On a deployed site it is the only content, and a visitor cannot tell the difference between a placeholder and a choice.

**Check your records for anything you typed while testing.** `test`, `test 2`, `asdf`, `aaa`, a rating of 0, a date in 1900, a description that says "TODO". Every one of these is on your public site.

**And check for this one specifically:** weeks 6 through 9 each shipped a self-check that filed a record through your own form, marked **`Week 6 Test`**, `Week 7 Test`, and so on. Weeks 7 and 9's could not take it back — nothing in those weeks asked you to build a Delete for the second table. **There is a good chance one of those rows is sitting on your list page right now.** Delete it, through your own Delete action or by hand in the mssql panel.

**Real-ish is enough.** Nobody expects a class project to carry a real dataset. Six plausible records beat sixty invented ones, and both beat three rows called `test`.

---

## Part 8: The README a stranger reads

Your submission is two links: a deployed URL and a repo URL. **I open both, and so would anyone else you sent them to.** Right now your repo's front page is a file listing, because week 1 told you not to add a README when you created the repo — that was about avoiding a push conflict on an empty repo, not a judgment about READMEs.

This is where it gets written. Create `README.md` at the root of your project repo. It needs four things and it fits on one screen:

```markdown
# Trail Guide

A catalog of hiking trails in southern Wisconsin, with trail conditions
and visitor reviews. Built for .NET Web Development at WCTC.

**Live:** https://tg-web-xx1234.azurewebsites.net

## What it does

- Browse trails by difficulty and length
- Open a trail to see its details and everything people have said about it
- File a review against a trail

## The three things I fixed for the midterm

1. The front page said the site's name and nothing else — no way in.
2. The Privacy page was the template's. It's an About page now.
3. A wrong id was a blank browser page. It lands on a page of mine.

## Built with

ASP.NET Core MVC (.NET 10), Entity Framework Core, SQL Server, Bootstrap.

## Running it locally

The connection string lives in user secrets, not in this repo:

    dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your connection string>"
    dotnet ef database update
    dotnet watch
```

⚠️ **The three-things section is not decoration — it is a graded requirement**, and it is the only place you tell me what you chose. Name them, one line each.

**The live URL is the part people most often leave out**, and it is the most valuable line in the file — it is what turns a repo into something a person can look at rather than read.

> [!TIP]
> GitHub renders `README.md` on the repo's front page automatically. Name it exactly that, at the repository root, and it appears with no further work.

---

## Part 9: What the self-check can and cannot see

This week's script is different from every one since week 3: **it scores nothing.** It walks your deployed site the way a visitor would and prints what it trips over. There is no number in it and no number behind it.

What it can see, because these are visible from outside without knowing your topic:

- your front page is still the template's
- your browser tab still says `Home Page`
- the stock Privacy page is still linked
- a link in your navbar goes nowhere, or throws
- a record on your list page cannot be opened
- a wrong id comes back with an empty body
- a `Week N Test` row is on your public site
- an older week's self-check script is still installed

What it **cannot** see, and this is most of the midterm:

- whether your list pages say anything useful when they are empty — it cannot empty your database
- whether your records read like content or like placeholders
- whether a visitor can work out what your site is for
- whether anything is a dead end
- whether anything is ugly

**A clean report is a good sign and it is not a grade.** The rubric is in the homework, and I read it with the site open.

---

## Part 10: Choosing your three things

The homework asks you to name three things you fixed. Not five, not everything — three, chosen and written down.

**Pick the ones a stranger hits first.** The front page beats an edge case on a details view every time, because everyone sees the front page and almost nobody reaches the edge case.

**Prefer finishing one thing to starting three.** An empty state on every list page, done properly, is a better answer than three half-fixes.

**A fix you can explain is worth more than a fix you copied.** The explain-it standard applies to the midterm the same as every week: I will ask what you changed and why that was the right thing to change.

> [!NOTE]
> **If your three things are genuinely small, say so and pick bigger ones.** "I changed the navbar color" is not a midterm. If you walk your app and honestly cannot find three things worth doing, walk it with someone else's eyes — that is what the stranger's pass is for, and if it still comes up empty, come and talk to me.

---

## Troubleshooting

**I rewrote my home page and the console went quiet.**
The `@section Scripts` block with the self-check `<script>` tag lived in `Views/Home/Index.cshtml`, and you replaced the file. Put it back at the bottom. Part 3.

**I added the `Missing` action and got a compiler error about `NotFound`.**
You named the action `NotFound`. `Controller` already has a method by that name. Rename yours. Part 5.

**I added the `Program.cs` line and a wrong id is still blank.**
`Program.cs` runs once, at startup, so this edit needs a restart — and creating `Missing.cshtml` needs one too. `dotnet watch` asks before restarting, in the terminal it is running in — while you are typing in the editor. Look there for `Do you want to restart your app?` and answer `a`. Part 5.

**Every wrong id suddenly returns `500`, and the error names a view.**
You added the `Program.cs` line before the view existed, so the app is re-running the request through a page that isn't there yet. Create `Views/Home/Missing.cshtml` and the action, and it clears. Part 5 — this is why that section builds bottom-up.

**My 404 page renders, but the status is now 200.**
You returned a view directly from the action instead of letting `UseStatusCodePagesWithReExecute` do it. The middleware preserves the original status code; returning `View("Missing")` from inside a guard does not. Part 5.

**The empty state never shows, even with no rows.**
Check you are testing the page you edited. A related list on a details page and the list page itself are two different views, and both need their own `@if`.

**`Model.Any()` throws a `NullReferenceException`.**
The collection property was never initialized. `public ICollection<Review> Reviews { get; set; } = new List<Review>();` — week 9, Part 2.

**My deployed site shows a `Week 9 Test` row and I can't delete it.**
If that table has no Delete action, delete the row by hand in the mssql panel. Part 7.

**GitHub isn't showing my README.**
It has to be named `README.md`, at the **root** of the repository — not inside the project folder, if your repo has the `.sln`/project one level down. Part 8.

**The self-check prints a banner that says Week 9.**
Last week's script is still installed. This week's `<script>` line **replaces** it; it does not go underneath it. Part 9.
