# Week 5 Homework

**Due:** before the start of Week 6's class.
**Submit via Canvas:** your **Azure URL** + your **GitHub repo URL**.

## Part 1 — Finish the Registry lab (nobody collects this)

All six checks green:

```bash
dotnet test Cryptids.Checks
# Passed! - Failed: 0, Passed: 6 ...
```

If class ended at check 4, that's the `@section Scripts` block and the Bootswatch swap — [sections](lecture-notes.md#the-slot-that-was-always-there) and [themes](lecture-notes.md#the-payoff) in the notes.

> [!IMPORTANT]
> This isn't submitted and it isn't worth points. It's the guided version of the exact five moves Part 2 asks you to make on your own app. Doing it first is what turns Part 2 into a 40-minute assignment.

## Part 2 — Your semester project gets a shell (graded)

Same app you built last week — the one you'll still be extending in week 9. This week it stops looking like a `dotnet new` template.

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work.** Every requirement below links to the section that covers it, and the [troubleshooting appendix](lecture-notes.md#appendix-troubleshooting) names tonight's specific errors — which are all new, because this is the first week you're editing a file that every page depends on.

> [!WARNING]
> **Commit before you start.** [One bad line in the layout breaks every page at once](lecture-notes.md#renderbody-where-your-page-lands) — that's the trade you make for a shared shell. A clean commit to fall back to is worth thirty seconds.

It needs:

1. **[A branded shell](lecture-notes.md#branding-the-shell)** — three edits, all in `Views/Shared/_Layout.cshtml`: the `navbar-brand` text, the `<title>` suffix, and the **footer**, which should carry your name and the year. Leave the footer where it is — it's already on every page, because the layout is.
2. **[A title on every page](lecture-notes.md#viewdatatitle-and-the-browser-tab)** — `ViewData["Title"]` set in your home view, your index view, and your details view, all three different. **The details page's title must be data-driven** — `ViewData["Title"] = Model.Name;` (or whatever your item's name property is), so each item's page names itself in the browser tab.
3. **[A partial, rendered from two different views](lecture-notes.md#passing-a-model-to-a-partial)** — a card for one of your items: `Views/Shared/_ThingCard.cshtml` with `@model Thing` on the first line. Render it from your **index**, inside the loop, and from **one other view** — featuring a single item on your home page is the easy second. *Two* views is the requirement, not one: a partial called from a single place is the same markup with an extra step, and it doesn't demonstrate anything.
4. **[A Bootswatch theme](lecture-notes.md#the-payoff)** replacing the template's Bootstrap `<link>`. **Delete the original line** — leaving both means the two stylesheets fight and the theme only half applies.
5. **The self-check script, included via [`@section Scripts`](lecture-notes.md#the-slot-that-was-always-there)** in your index view — see Part 3. This is the one requirement that grades *how* you added something rather than that you added it.
6. **Everything from week 4 still works** — the nav link to your index, the index list, the details page, and the 404 guard on a bad id.
7. **Deployed to Azure**, and **3+ meaningful commits** in your public GitHub repo.

> [!NOTE]
> **Design isn't graded, and it isn't the point.** The rubric asks whether a theme loads, not whether it's a good one. Pick a Bootswatch theme that suits your topic and move on — I'll still tell you what I think of it when yours is on the projector.

> [!TIP]
> **Nothing here needs a controller change.** If you find yourself in `Controllers/`, you've probably wandered off the assignment.

## Part 3 — Check it when you're finished ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with.** It reads your shell off three different pages — your home page, your index, and one details page — and compares them, which is the only way to prove from outside that a shell is really shared.

> [!IMPORTANT]
> **This is a finish line, not a progress bar.** It has nothing useful to say until the shell exists on all three pages. Build first. **Run it twice:**
>
> 1. **When you think you're done locally** — cheap to fix things now
> 2. **Again on your deployed Azure URL, before you submit** — that's the run that counts

**Installing it *is* requirement 5.** Last week you dropped a `<script>` tag at the bottom of a view. This week it goes in the layout's Scripts slot instead — which is exactly what that slot is for, and it's worth 2 points.

At the bottom of **your index view** (e.g. `Views/Trails/Index.cshtml`):

```html
@section Scripts {
    <script src="https://jgrissom.github.io/dotnet-web-dev/week-05/homework-checks.js"></script>
}
```

Then load that page and open the console — **F12 → Console**. It runs automatically.

```
🔎 Week 5 self-check — https://trailguide-ab1234.azurewebsites.net
✅ 2 pts  nav link to your index page — found /Trails
✅ 2 pts  your index and details pages still work — /Trails, /Trails/Details/1
✅ 3 pts  the shell is on every page — "© 2026 - Wisconsin TrailGuide - built by Jeff Gr"
✅ 3 pts  every page has its own title — "Trails - Wisconsin TrailGuide"
✅ 2 pts  a theme, not the default stylesheet

📋 5 of 5 checks green · 12 of 12 points  (controller: /Trails)
```

> [!NOTE]
> It checks **whatever site it's loaded on** — so put the section in *your* app, not on this page. `recheck()` re-runs it without reloading.

> [!TIP]
> **If it says your footer is "still the template's default line"** — that's requirement 1. The stock footer reads `© 2026 - YourProject - Privacy`; it's identical on every page already, so it can't prove you built anything. Put your own name and the year in it, in `_Layout.cshtml`.

> [!TIP]
> **If it can't find your controller**, your nav link from week 4 is missing or points somewhere else — easy to lose while rebuilding a navbar. You can tell it where to look instead — `recheck("Trails")` with *your* controller's name — but that link is worth 2 points on its own, so fix it rather than working around it.

> [!TIP]
> **Working offline?** Save [`homework-checks.js`](homework-checks.js) into your `wwwroot` folder and point the tag at it locally: `<script src="/homework-checks.js"></script>` — still inside the `@section Scripts` block.

*(If you happen to have Node installed, `node homework-checks.js <url>` does the same thing from a terminal. You don't need it.)*

**12 of the 20 points are in that script.** The other 8 I read out of your repo — see the rubric.

> [!IMPORTANT]
> Run it against your **deployed** URL, not just localhost. "It worked on my machine" is not worth points, and a broken deploy is the single most common way to lose them.

## Part 4 — Deploy it (graded)

Same as the last two weeks. Follow **[week 3's deploy-guide](../week-03/deploy-guide.md)**, or [the notes on `az webapp up`](../week-03/lecture-notes.md#az-webapp-up) for what the command is actually doing. From inside your web project folder:

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

Use the **same US region** that worked for you before — it's on the class list. Leave the app up until grades post.

> [!TIP]
> **Your theme comes from a CDN now.** That's fine on Azure — but it does mean a page that looked right on localhost can look unstyled if you typo the URL. Load your deployed site once and actually look at it before you submit.

## 🆘 Stuck?

- **Every page broke at once** — you edited the layout. That's expected; that's what a shared shell means. The `dotnet watch` terminal has the real exception, and [the appendix](lecture-notes.md#appendix-troubleshooting) lists tonight's by name.
- **`RenderBody has not been called`** — [you deleted the line your pages render into](lecture-notes.md#renderbody-where-your-page-lands). Put `@RenderBody()` back inside `<main>`.
- **`The partial view '_ThingCard' was not found`** — it has to be in `Views/Shared/`, and the `name` keeps the underscore but drops `.cshtml`.
- **`The model item passed into the ViewDataDictionary is of type ... but requires ...`** — a partial got the wrong thing. [Pass it one item](lecture-notes.md#passing-a-model-to-a-partial): `model="item"`.
- **`cannot find the section 'Scripts'`** — your layout says `required: true`. It should be [`required: false`](lecture-notes.md#what-required-false-actually-does), which is how the template ships.
- **The theme didn't change** — hard-refresh (⌘⇧R / Ctrl+Shift+R), then check you deleted the old `<link>`.
- **One page has no styling** — a stray `Layout = null;` left in that view.

## 📊 Grading (20 pts)

| Item | Points | Checked by |
|------|--------|------------|
| Nav link to your index page still works (deployed) | 2 | `homework-checks.js` |
| Index and details pages still work (deployed) | 2 | `homework-checks.js` |
| The shell is on every page — same footer, all three pages, not the default | 3 | `homework-checks.js` |
| Every page has its own title, none of them the default | 3 | `homework-checks.js` |
| A theme loads, and the stock stylesheet is gone | 2 | `homework-checks.js` |
| A partial in `Views/Shared/`, rendered from **two different views** | 3 | your repo |
| The self-check script is included via `@section Scripts` | 2 | your repo |
| Public repo with 3+ meaningful commits | 3 | your repo |
| **Deductions:** dead submitted URL | −2 | |

*Reminder: the explain-it standard applies. Be ready to walk me through any line — especially "what does `@RenderBody()` do?" and "why is your footer in its own file instead of in the layout?"*

## 📖 Reading for next week (~15 min)

Week 6 is **forms** — the first time your app takes input instead of just showing things.

- Open `Views/Shared/` in your own project and find **`_ValidationScriptsPartial.cshtml`**. You didn't write it, nothing currently uses it, and after tonight you can read its name and know exactly what it is: a partial, meant to be rendered inside a `@section Scripts` block. Open it. Guess what it's for.
- [Microsoft: Model validation in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/mvc/models/validation) — skim the first section only, as far as the list of built-in attributes.
