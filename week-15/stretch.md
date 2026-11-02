# Week 15 Stretch — The Same Four Moves on Your Own App

**Optional. There is no homework this week, nothing is collected, and this is worth no points.**

Your project and your presentation come first. If you have time, and your list page could use it, these are the moves from tonight's lab, on your own app. Any of them can go in your final project.

Same app you've been building since week 4. **Nothing about your tables changes, and there is no migration.**

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work.** Every item below links to the section that shows it done, and the [troubleshooting section](lecture-notes.md#troubleshooting) names the specific errors.

## The self-check

Open `Views/Home/Index.cshtml`, find the line that loads last week's self-check, and **replace it**:

```html
@section Scripts {
    <script src="https://jgrissom.github.io/dotnet-web-dev/week-15/homework-checks.js"></script>
}
```

> [!NOTE]
> **This one only reads.** Type `recheck()` in the console when you want it to run. Search and paging are public, so it signs nothing in, creates nothing, and **leaves you signed in**.
>
> ⚠️ **It cannot see your message or your service.** A message only shows up after a change, and a change needs your role, which the check doesn't hold. A service doesn't show from outside at all. Item 1 tells you how to test the message yourself.

## The four moves

1. **A message after every change.** Set `TempData["Message"]` in every POST that changes your data, naming the record, and show it in `_Layout.cshtml` above `@RenderBody()`. **Test it yourself:** sign in as your admin, change something, read the message, reload, and watch it go. → [A message that survives a redirect](lecture-notes.md#part-1-a-message-that-survives-a-redirect)
2. **A search box on your list page.** A `<form method="get">` with a text or search box, a parameter on your `Index` action with the same name, and a `Where` that looks at least in the property you show as the record's name. It keeps what was typed, and it says so when nothing matches. *If a filter fits your data, add a dropdown beside the box.* → [Search and a filter](lecture-notes.md#part-2-search-and-a-filter)
3. **Pages.** Your list comes in pages, with a link to the next page, sorted so each record lands on exactly one page, and every page link keeps the search. **Your page size has to be smaller than your record count**, or there's no second page for anyone to look at. Week 4 had you seed at least five, so **a page size of 2 always works**. A page number nobody should type can't break it. → [Pages](lecture-notes.md#part-3-pages)
4. **One service.** Move your list query into a class in `Services/`, behind an interface. Register it with `AddScoped` in `Program.cs`, and have your controller ask for the interface in its constructor. → [Move the query out](lecture-notes.md#part-5-move-the-query-out)

> [!IMPORTANT]
> **When `dotnet watch` first asks *Do you want to restart your app?*** — item 4 is where it usually does — answer **`a`**. If it says `Press "Ctrl + R" to restart.` after you edit `Program.cs`, press it: that line isn't live until you do.

## Your app isn't mine

Nothing above says what your box or your page number is called. The self-check doesn't care. It finds your list page from your navbar, the way it has since week 4, reads the form on it to find your search box, and reads your links to find your page number, whether that's `?page=2`, `?p=2` or anything else. A record's name is whatever your Details page shows in its `<h1>`, the way it has since week 4.

## Check it as you go ✅

**[`homework-checks.js`](homework-checks.js)** looks at your site as a visitor would, and that's all it does.

> [!IMPORTANT]
> **Run it as you go.** It reports all seven checks every time, and marks the ones it can't reach yet ⬜ instead of failing them — so a half-built app tells you *where you are*, not that you're broken. While anything is red or grey, the report ends with one `👉 Next:` line naming the next thing to build.
>
> **Run it on localhost as you go.** If you deploy, run it once more on your Azure URL.

**After each item, here is what moves.** Measured on a sample app built one item at a time: search takes it from 1 to 4 checks green, and pages take it to 7. The message and the service change nothing from outside.

**You installed the tag above.** Run your app **locally** (`dotnet watch`), load your home page, open the console — **F12 → Console** — and type **`recheck()`**:

```
🔎 Week 15 self-check — https://tg-web-xx1234.azurewebsites.net

✅  anyone can still read your list and a record's page — /Trails
✅  your list page has a search box that sends a GET — it's named search
✅  searching finds a record by its name — Pewits finds "Pewits Nest Gorge", which isn't on page 1
✅  a search that matches nothing lists nothing, and doesn't break — ?search=zqxjkvw
✅  your list comes in pages, and every record is on exactly one — 6 records on 2 pages, ?page=
✅  a page link remembers what was searched for — ?search=r
✅  a page number nobody should type doesn't break the page — ?page=0 and -1 and 999999

📋 7 of 7 checks green  (controller: /Trails)
```

> [!TIP]
> **A grey ⬜ on "your list comes in pages" means I found no link to a second page.** Either paging isn't built, or your page size is bigger than your list. It can't tell which, so it won't guess. **Lower your page size.**

> [!TIP]
> **If "searching finds a record" fails on a record that isn't on page 1**, your `Where` runs after `Skip` and `Take`, so it only searches the page you're on. Filter first.

> [!TIP]
> **Working offline?** Save [`homework-checks.js`](homework-checks.js) into your `wwwroot` folder and point the tag at it locally: `<script src="/homework-checks.js"></script>` — still inside the `@section Scripts` block.

*(If you happen to have Node installed, `node homework-checks.js <url>` does the same thing from a terminal. You don't need it.)*

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
- **A `500` with `Token 2000000 is not valid in the scope of module`** — hot reload after a ViewModel change. `Ctrl+R` in the terminal running `dotnet watch`. Your code is fine.
- **A `500` over code you're sure is right** — `dotnet watch` may be asking `Do you want to restart your app?`. Answer `a`. If it says `Press "Ctrl + R" to restart.`, press it.
- **The app stops before `Now listening on:` with `The ConnectionString property has not been initialized`** — your connection string secret is missing (a frozen lab PC wipes it). The app reads the database as it starts.
- **Yellow `NU1902` / `NU1903` warnings about `System.Security.Cryptography.Pkcs`** — the advisory week 9's homework fixed. If your app still shows them, from the folder with your `.csproj`, once: `dotnet add package System.Security.Cryptography.Pkcs --version 10.0.13`. One line appears in your `.csproj`; commit it.
- **The self-check banner names another week** — an older script is still installed. This one replaces it.
