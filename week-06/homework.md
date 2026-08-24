# Week 6 Homework

**Due:** before the start of Week 7's class.
**Submit via Canvas:** your **Azure URL** + your **GitHub repo URL**.

## Part 1 — Finish the Registry lab (nobody collects this)

All six checks green:

```bash
dotnet test Cryptids.Checks
# Passed! - Failed: 0, Passed: 6 ...
```

If class ended at check 5, that's the browser-side validation — [one `@section Scripts` block](lab/README.md#task-6-in-full).

> [!IMPORTANT]
> This isn't submitted and it isn't worth points. It's the guided version of the exact moves Part 2 asks you to make on your own app, with the markup handed to you. Doing it first is what turns Part 2 into a 45-minute assignment.

## Part 2 — Your semester project takes input (graded)

Same app you've been building since week 4. It can show people your list; this week it starts accepting additions to it.

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work.** Every requirement below links to the section that covers it, and the [troubleshooting appendix](lecture-notes.md#appendix-troubleshooting) names tonight's specific errors — including the two silent ones, where nothing breaks and nothing works.

It needs:

1. **[Rules on your model](lecture-notes.md#data-annotations)** — data annotations in your `Models/YourThing.cs`: **at least three, across at least two properties**, and at least two of them real rules rather than labels. `[Required]` on the text that matters, `[StringLength]` on your strings, `[Range]` on your numbers. Add `using System.ComponentModel.DataAnnotations;` at the top.
2. **A Create page at `/YourThing/Create`** — a `Create()` action and a `Views/YourThing/Create.cshtml` [built with tag helpers](lecture-notes.md#the-whole-form-field-by-field): `asp-for` on every label and input, an `asp-validation-for` span beside each one, and an `asp-validation-summary` at the top. **The action has to be called `Create`** — it's the name the framework's own scaffolding uses, week 8 assumes it, and it's where the checker looks.
3. **[A link to it from your list page](lecture-notes.md#getting-to-the-form)** — a button at the top of the page your nav link opens (`Views/YourThing/Index.cshtml`), **not** your site's home page. A page nobody can reach is a page nobody uses.
4. **The POST action** — a *second* `Create`, marked `[HttpPost]`, taking your model as a parameter. Give the new item an id (`Max(x => x.Id) + 1`), add it to your static list, and **[redirect](lecture-notes.md#redirect-dont-render)** with `RedirectToAction(nameof(Index))`.
5. **[The guard](lecture-notes.md#modelstate-the-notes-the-binder-was-already-taking)** — `if (!ModelState.IsValid) { return View(item); }`, above the id assignment. A bad submission must come back as the form, **with the messages showing and their input still in the boxes**.
6. **[Client-side validation](lecture-notes.md#the-partial-week-5-promised)** — `_ValidationScriptsPartial` rendered inside a `@section Scripts` block at the bottom of your Create view.
7. **Everything from weeks 4 and 5 still works** — the nav link, the list, the details page, the shared shell, your theme.
8. **Deployed to Azure**, and **3+ meaningful commits** in your public GitHub repo.

### Your model isn't mine

Every requirement above is about *your* properties, and the lab's exact attributes won't transfer. A few translations:

| If your property is | Reach for |
|---|---|
| a name, title, or short text | `[Required]` + `[StringLength(60, MinimumLength = 2)]` |
| a longer description | `[StringLength(500)]`, and render it with `<textarea asp-for="Notes" class="form-control"></textarea>` |
| a whole number — a year, a count | `[Range(1900, 2026)]` — pick bounds that are actually true of your topic |
| a price or a rating | `[Range(0.0, 5.0)]` — works on `double` and `decimal` too |
| a date | `[DataType(DataType.Date)]`, which gets you a real date picker |
| anything whose name isn't English | `[Display(Name = "First sighted")]` — changes the label everywhere at once |

> [!NOTE]
> **Don't put anything on your `Id`.** It isn't on the form and the controller assigns it, so there's nothing to validate.

> [!WARNING]
> **A non-nullable number is required whether you say so or not.** Leave an `int` or `double` box blank and you'll get *"The X field is required"* with no `[Required]` in sight — there's nowhere for an `int` to put "empty". If a number on your form is genuinely optional, the property has to be `int?`.

## Part 3 — Check it when you're finished ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with.** It finds your controller from your navbar, finds your form from your list page, and then **fills the form in and submits it** — reading your own validation rules out of the HTML to decide what to type.

> [!CAUTION]
> **This one changes your data.** It submits your form twice: once with deliberate rubbish, to check you refuse it, and once with a good record, to check you accept it. That second submission leaves a real item called **`SelfCheck entry`** in your list.
>
> That's supposed to happen — it's the only way to prove from outside that your form actually works. It disappears the next time your app restarts, which is [this week's closing lesson](lecture-notes.md#part-5-where-the-truck-actually-went-10-min) and next week's whole reason for existing. Restart your app if you want it gone sooner; you don't need to.

> [!IMPORTANT]
> **This is a finish line, not a progress bar.** It has nothing useful to say until there's a form to submit. Build first. **Run it twice:**
>
> 1. **When you think you're done locally** — cheap to fix things now
> 2. **Again on your deployed Azure URL, before you submit** — that's the run that counts

**Open `Views/Home/Index.cshtml`.** Find last week's line and **replace it** — same place, same section, one character different:

```html
<script src="https://jgrissom.github.io/dotnet-web-dev/week-05/homework-checks.js"></script>
```

becomes

```html
<script src="https://jgrissom.github.io/dotnet-web-dev/week-06/homework-checks.js"></script>
```

It stays inside the `@section Scripts { }` block you added last week. *(Can't find the old line? Search your project for `week-05` — VS Code's **Ctrl+Shift+F** / **⇧⌘F** finds it wherever it landed.)*

> [!CAUTION]
> **Replace it. Don't add a second one.**
>
> Week 5's checker still works, and that's the trap: it checks *week 5's* requirements, and nothing you did this week broke any of them. Leave it in and you'll load a page, see a screen of green ticks, and submit an assignment that was never actually checked.
>
> **The tell is the first line of the report.** `🔎 Week 5 self-check` is the wrong one — this week's says **`Week 6`** and scores out of **14 points**. If both are installed, this week's prints a red 🚨 above the score telling you so.

Then load your home page and open the console — **F12 → Console**. It runs automatically.

```
🔎 Week 6 self-check — https://trailguide-ab1234.azurewebsites.net

✅ 2 pts  a link from your list page to your form — /Trails/Create
✅ 2 pts  your form page is a real form that posts — 5 fields
✅ 3 pts  your fields carry your model's rules — data-val-length, data-val-range
✅ 3 pts  a bad submission is refused, with messages
✅ 2 pts  a good submission is accepted and lands in your list — 6 → 7
✅ 2 pts  validation runs in the browser too

📋 6 of 6 checks green · 14 of 14 points  (controller: /Trails)
```

> [!NOTE]
> It checks **whatever site it's loaded on** — so put the tag in *your* app, not on this page. `recheck()` re-runs it without reloading.

> [!TIP]
> **If it says your fields carry no rules** — you probably only have `[Required]`. That one is free: ASP.NET marks every non-nullable property required whether you ask or not, so it can't prove you wrote anything. Add a `[StringLength]` or a `[Range]`.

> [!TIP]
> **If a good submission "isn't accepted"** — the checker fills every box using your own limits, so it's rarely the data. Two likelier causes: your action returns a `View(...)` instead of redirecting, or the new item never gets an `Id`, so it goes in as 0 and would collide with the next one.

> [!TIP]
> **If it can't find your controller**, your nav link from week 4 is missing or points somewhere else. You can tell it where to look — `recheck("Trails")` with *your* controller's name — but fix the link; it's been a requirement for three weeks.

> [!TIP]
> **Working offline?** Save [`homework-checks.js`](homework-checks.js) into your `wwwroot` folder and point the tag at it locally: `<script src="/homework-checks.js"></script>` — still inside the `@section Scripts` block.

*(If you happen to have Node installed, `node homework-checks.js <url>` does the same thing from a terminal. You don't need it.)*

**14 of the 20 points are in that script.** The other 6 I read out of your repo — see the rubric.

> [!IMPORTANT]
> Run it against your **deployed** URL, not just localhost. "It worked on my machine" is not worth points, and a broken deploy is the single most common way to lose them.

## Part 4 — Deploy it (graded)

Same as the last three weeks. Follow **[week 3's deploy-guide](../week-03/deploy-guide.md)**, or [the notes on `az webapp up`](../week-03/lecture-notes.md#az-webapp-up) for what the command is actually doing. From inside your web project folder:

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

Use the **same US region** that worked for you before — it's on the class list. Leave the app up until grades post.

> [!WARNING]
> **Anything you add through the deployed form will vanish, and that's not a bug.** Your data is still a `static List<T>` living in memory, and a free-tier Azure app goes to sleep when nobody's using it. It wakes up with exactly the items you hard-coded. Don't try to fix this — **fixing it is week 7**, and it's the whole reason week 7 exists.

## 🆘 Stuck?

- **The build fails with `CS1963: An expression tree may not contain a dynamic operation`** — your view has no `@model` line, so its model is `dynamic` and `asp-for` has no type to check against. Add `@model YourThing` as the **first line** of the view. The error points into generated code under `obj/` rather than at your file, and there is one per `asp-for` attribute — ten errors on a five-field form, all with the same single cause.
- **`InvalidOperationException: The view 'Create' was not found`, on a file you just created** — `dotnet watch` can't hot-reload a brand-new `.cshtml`. Look at the terminal running it: there's a question waiting — `Do you want to restart your app? Yes (y) / No (n) / Always (a) / Never (v)`. Answer `a`. The red `❌ ... error ENC0021: Adding attribute requires restarting the application` just above it belongs to that same notice; it is not a mistake in your file. Until you answer, the page keeps 500ing on markup that's already correct.
- **Clicking Submit does nothing — the same blank form comes back** — you have a GET `Create()` and no `[HttpPost]` one, so the POST landed on the GET action. [An action with no verb attribute answers every verb](lecture-notes.md#two-actions-one-name).
- **`AmbiguousMatchException: The request matched multiple endpoints`** — two actions named `Create` and neither has `[HttpPost]`. Add it to the one with the parameter. **Still there after you added it? Press `Ctrl+R` in the terminal running `dotnet watch`.** MVC works out each action's verb when the app *starts*, and hot reload applies an attribute-only edit only sometimes — it says `Hot reload succeeded` either way, so a correct fix can look like it did nothing.
- **A 400, with nothing of yours in the error** — antiforgery. Your action has `[ValidateAntiForgeryToken]` but the form isn't sending a token. Use `<form asp-action="Create" method="post">`.
- **One field always arrives empty** — [the input's `name` and the property name don't match](lecture-notes.md#model-binding-is-name-matching-and-nothing-else). `asp-for` can't get this wrong; hand-written HTML can.
- **`ModelState.IsValid` is false and you can't see why** — temporarily switch your summary to `asp-validation-summary="All"`, which lists every error including the per-field ones.
- **The form comes back but with no messages** — the `<span asp-validation-for="...">` elements are missing, or the action returns `View()` with no argument.
- **The errors only show after a page reload** — that's requirement 6; the browser-side scripts aren't loaded yet.
- **`$ is not defined` in the console** — the validation partial is outside `@section Scripts`, so it ran before jQuery.
- **Refreshing after a submit adds a duplicate** — [the action rendered instead of redirecting](lecture-notes.md#redirect-dont-render).
- **Everything I add disappears** — working as designed. Week 7.
- The [troubleshooting appendix](lecture-notes.md#appendix-troubleshooting) covers the rest.

## 📊 Grading (20 pts)

| Item | Points | Checked by |
|------|--------|------------|
| Your list page links to a working `/YourThing/Create` (deployed) | 2 | `homework-checks.js` |
| The Create page is a real form that posts, with more than one field | 2 | `homework-checks.js` |
| Your fields carry rules from your model, beyond the free `required` | 3 | `homework-checks.js` |
| A bad submission is refused, with messages, and nothing is added | 3 | `homework-checks.js` |
| A good submission is accepted, redirects, and lands in your list with an id of its own | 2 | `homework-checks.js` |
| Client-side validation loads, through the Scripts section | 2 | `homework-checks.js` |
| Data annotations on your model: 3+, across 2+ properties, 2+ of them rules | 3 | your repo |
| Public repo with 3+ meaningful commits | 3 | your repo |
| **Deductions:** dead submitted URL | −2 | |

*Reminder: the explain-it standard applies. Be ready to walk me through any line — especially "how does what someone typed end up in that object?" and "what would happen if you deleted the `ModelState.IsValid` check?"*

## 📖 Reading for next week (~15 min)

Week 7 is **the database** — the week your data stops disappearing.

- Open your own `Models/YourThingData.cs` (or whatever you called it) and look at the hard-coded list. **Write down what the columns of that table would be**, and what type each one is. Bring it to class; that's the first thing we build.
- Then add something through your form, stop the app (`Ctrl+C`) and start it again, and reload your list. **It's gone.** It's a two-minute exercise and it makes next week's first slide land.
- [Microsoft: Overview of Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/) — read the first page only, as far as "The model". Don't try to follow the code yet.
