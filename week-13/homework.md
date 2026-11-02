# Week 13 Homework

**Topic:** your application says what it just did, can be searched, comes in pages, and has its first service.
**Due:** before the start of Week 14's class.
**Submit via Canvas:** your **Azure URL** + your **GitHub repo URL**.

## Part 1 — Finish the Registry lab (nobody collects this)

All five checks green:

```bash
dotnet test Cryptids.Checks
```

```
Test Run Successful.
Total tests: 5
     Passed: 5
```

If class ended at check 4, check 5 is the service — [Task 5 in full](lab/README.md#task-5-in-full).

> [!IMPORTANT]
> This isn't submitted and it isn't worth points. It's the same moves Part 2 asks you to make on your own app, with every file handed to you. Doing it first is what turns Part 2 into an hour.

## Part 2 — Your semester project gets polished (graded)

Same app you've been building since week 4. **Nothing about your tables changes, and there is no migration.** Everything this week is in your controllers, your views and one new service.

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work.** Every requirement below links to the section that shows it done, and the [troubleshooting section](lecture-notes.md#troubleshooting) names this week's specific errors.

> [!TIP]
> **Commit as you go, the way you have since week 3.** Three of tonight's twenty points are the history itself, and they're all-or-nothing: fewer than three commits scores zero. One commit per requirement you finish is the natural rhythm.

### Swap the self-check over first

Open `Views/Home/Index.cshtml`, find the **week-12** line, and **replace it**:

```html
@section Scripts {
    <script src="https://jgrissom.github.io/dotnet-web-dev/week-13/homework-checks.js"></script>
}
```

> [!CAUTION]
> **Replace it. Don't add a second one.** Last week's script still works, and that's the trap: it checks *last week's* requirements, and every one of them still passes. **The tell is the first line of the report** — this week's says **`Week 13`** and scores out of **12 points**. If both are installed, this week's prints a red 🚨 above the score.

> [!NOTE]
> **This one only reads.** Type `recheck()` in the console when you want it to run. Search and paging are public, so it signs nothing in, creates nothing, and **leaves you signed in**, which is new since week 11.
>
> ⚠️ **It cannot see your message or your service.** A message only shows up after a change, and a change needs your role, which the check doesn't hold. A service doesn't show from outside at all. I read both from your repo. Requirement 1 tells you how to test the message yourself.

### Then build it

1. **A message after every change.** Set `TempData["Message"]` in every POST that changes your data, naming the record, and show it in `_Layout.cshtml` above `@RenderBody()`. **Test it yourself:** sign in as your admin, change something, read the message, reload, and watch it go. → [A message that survives a redirect](lecture-notes.md#part-1-a-message-that-survives-a-redirect)
2. **A search box on your list page.** A `<form method="get">` with a text or search box, a parameter on your `Index` action with the same name, and a `Where` that looks at least in the property you show as the record's name. It keeps what was typed, and it says so when nothing matches. *Your reading asked what a visitor would want first; if a filter fits your data, add a dropdown beside the box. That's optional and it isn't scored.* → [Search and a filter](lecture-notes.md#part-2-search-and-a-filter)
3. **Pages.** Your list comes in pages, with a link to the next page, sorted so each record lands on exactly one page, and every page link keeps the search. **Your page size has to be smaller than your record count**, or there's no second page for anyone to look at. Week 4 had you seed at least five, so **a page size of 2 always works**. A page number nobody should type can't break it. → [Pages](lecture-notes.md#part-3-pages)
4. **One service.** Move your list query into a class in `Services/`, behind an interface. Register it with `AddScoped` in `Program.cs`, and have your controller ask for the interface in its constructor. → [Move the query out](lecture-notes.md#part-5-move-the-query-out)
5. **Deployed.** Everything from weeks 4–12 still works, and **3+ meaningful commits** are in your public repo. → [Your own app](lecture-notes.md#part-7-your-own-app)

> [!IMPORTANT]
> **When `dotnet watch` first asks *Do you want to restart your app?*** — requirement 4 is where it usually does — answer **`a`**. If it says `Press "Ctrl + R" to restart.` after you edit `Program.cs`, press it: that line isn't live until you do.

### Your app isn't mine

Nothing above says what your box or your page number is called. The self-check doesn't care. It finds your list page from your navbar, the way it has since week 4, reads the form on it to find your search box, and reads your links to find your page number, whether that's `?page=2`, `?p=2` or anything else. A record's name is whatever your Details page shows in its `<h1>`, the way it has since week 4.

## Part 3 — Check it as you go ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with.** It looks at your site as a visitor would, and that's all it does.

> [!IMPORTANT]
> **Run it as you go.** It reports all seven checks every time, and marks the ones it can't reach yet ⬜ instead of failing them — so a half-built app tells you *where you are*, not that you're broken. While anything is red or grey, the report ends with one `👉 Next:` line naming the next thing to build.
>
> **Fixing things on localhost is much cheaper than fixing them on Azure**, which is why the tag goes in now. Then run it once more on your **deployed URL before you submit** — that's the run that counts.

**After each requirement, here is what moves.** Measured on a sample app built one requirement at a time:

| After requirement | What changes in the report |
|---|---|
| **before you start** — week 12's app | **1 of 12** — reading is public, and there's no box yet |
| **1** — the message | **still 1** — nothing changes from outside; I read it in your repo. Test it yourself |
| **2** — search | **7 of 12** — the box, a record found by name, and a search that finds nothing |
| **3** — pages | **12 of 12** — and the search has to find a record that isn't on page 1 |
| **4** — the service | **still 12** — nothing changes from outside, which is the point of moving it |
| **5** — deployed | run it once more on your Azure URL. That is the run I grade |

**You installed the tag in Part 2.** Run your app **locally** (`dotnet watch`), load your home page, open the console — **F12 → Console** — and type **`recheck()`**:

```
🔎 Week 13 self-check — https://tg-web-xx1234.azurewebsites.net

✅  1 pts  anyone can still read your list and a record's page — /Trails
✅  1 pts  your list page has a search box that sends a GET — it's named search
✅  3 pts  searching finds a record by its name — Pewits finds "Pewits Nest Gorge", which isn't on page 1
✅  2 pts  a search that matches nothing lists nothing, and doesn't break — ?search=zqxjkvw
✅  3 pts  your list comes in pages, and every record is on exactly one — 6 records on 2 pages, ?page=
✅  1 pts  a page link remembers what was searched for — ?search=r
✅  1 pts  a page number nobody should type doesn't break the page — ?page=0 and -1 and 999999

📋 7 of 7 checks green · 12 of 12 points  (controller: /Trails)
```

> [!TIP]
> **A grey ⬜ on "your list comes in pages" means I found no link to a second page.** Either paging isn't built, or your page size is bigger than your list. It can't tell which, so it won't guess, and those points stay at zero until there's a second page to look at. **Lower your page size.**

> [!TIP]
> **If "searching finds a record" fails on a record that isn't on page 1**, your `Where` runs after `Skip` and `Take`, so it only searches the page you're on. Filter first.

> [!TIP]
> **Working offline?** Save [`homework-checks.js`](homework-checks.js) into your `wwwroot` folder and point the tag at it locally: `<script src="/homework-checks.js"></script>` — still inside the `@section Scripts` block.

*(If you happen to have Node installed, `node homework-checks.js <url>` does the same thing from a terminal. You don't need it.)*

**12 of the 20 points are in that script.** The other 8 I read out of your repo — see the rubric.

## Part 4 — Deploy it (graded)

**No migration this week, and no new app setting.** Just the deploy:

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

Use your own app's name and region — the ones you've used all term. ⚠️ **Keep `--os-type Linux` and `--runtime DOTNETCORE:10.0`.**

Then run the self-check on your Azure URL. That is the run I grade.

## 🆘 Stuck?

- **No message after a change** — `_Layout.cshtml` doesn't show it, or something still says `ViewData`. `ViewData` lives for one request, and a redirect is a second request. [Why `ViewData` can't do it](lecture-notes.md#why-viewdata-cant-do-it).
- **The message is still there after a reload** — something called `TempData.Keep` or `Peek`. Read it plainly and it goes.
- **`The model item passed into the ViewDataDictionary is of type …`** — your action and your view disagree. Change both. [The page's own model](lecture-notes.md#the-pages-own-model).
- **The search box does nothing** — the input's `name` and the action's parameter have to match. Then watch the address bar: does your term appear in it? [The form](lecture-notes.md#the-form).
- **`CS8602: Dereference of a possibly null reference`** in a `Where` — a nullable column. A warning, not a crash: check it isn't null first.
- **The self-check found no search box** — it wants a text or search box inside a `<form>` on your list page, and the form can't be a POST.
- **Page 1 changes between reloads, or a record is on two pages** — you're paging without `OrderBy`. [The order matters](lecture-notes.md#the-order-matters).
- **Page 2 of a search shows everything** — your page links need `asp-route-search`, and the same for any filter. [The links](lecture-notes.md#the-links).
- **A `500` on `?page=0`, with `The offset specified in a OFFSET clause may not be negative`** — `Math.Clamp`. [The order matters](lecture-notes.md#the-order-matters).
- **`Unable to resolve service for type`** — the `AddScoped` line is missing, or it's below `builder.Build()`. [Register it](lecture-notes.md#register-it).
- **`Cannot consume scoped service … from singleton`** — `AddSingleton`, on a service that holds your context. Use `AddScoped`. [How long one lasts](lecture-notes.md#part-6-how-long-one-lasts).
- **A `500` over code you're sure is right** — `dotnet watch` may be asking `Do you want to restart your app?`. Answer `a`. If it says `Press "Ctrl + R" to restart.`, press it.
- **The app stops before `Now listening on:` with `The ConnectionString property has not been initialized`** — your connection string secret is missing (a frozen lab PC wipes it). The app reads the database as it starts.
- **Yellow `NU1902` / `NU1903` warnings about `System.Security.Cryptography.Pkcs`** — the advisory week 9's homework fixed. If your app still shows them, from the folder with your `.csproj`, once: `dotnet add package System.Security.Cryptography.Pkcs --version 10.0.13`. One line appears in your `.csproj`; commit it.
- **The self-check banner says Week 12** — last week's script is still installed. This week's line replaces it.

## 📊 Grading (20 pts)

| What | Pts | Where it comes from |
|---|---|---|
| Anyone can still read your list and a record's page | 1 | deployed URL |
| Your list page has a search box that sends a GET | 1 | deployed URL |
| **Searching finds a record by its name** | 3 | deployed URL |
| A search that matches nothing lists nothing, and doesn't break | 2 | deployed URL |
| **Your list comes in pages, and every record is on exactly one** | 3 | deployed URL |
| A page link remembers what was searched for | 1 | deployed URL |
| A page number nobody should type doesn't break the page | 1 | deployed URL |
| `TempData` set in a controller | 1 | your repo |
| A view shows it | 1 | your repo |
| A service: an interface, and a class that implements it | 1 | your repo |
| Registered in `Program.cs` | 1 | your repo |
| A controller asks for the interface in its constructor | 1 | your repo |
| 3+ meaningful commits | 3 | your repo |
| **Deductions:** dead submitted URL | −2 | |

*Reminder: the explain-it standard applies. The ones I'll reach for: "why can't `ViewData` carry that message?", "why does the `Where` come before `Skip`?", "where does your controller's context come from?", and "why `AddScoped` and not `AddSingleton`?"*

## 📖 Reading for next week (~10 min)

Week 14 is **Web API**: controllers versus minimal APIs, JSON, and testing endpoints.

- Open any page of your app and view its source. All of that HTML is for a person. **What would a program that only wanted your records need from you instead?**
- Write down one thing someone could build on top of your data if your app answered with data rather than pages.
