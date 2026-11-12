# Week 13 Homework

**Topic:** your application answers programs as well as people.
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

If class ended at check 4, check 5 is the curator's PUT and DELETE — [Task 5 in full](lab/README.md#task-5-in-full).

> [!IMPORTANT]
> This isn't submitted and it isn't worth points. It's the same moves Part 2 asks you to make on your own app, with every file handed to you. Doing it first is what turns Part 2 into an hour.

## Part 2 — Your semester project gets an API (graded)

Same app you've been building since week 4. Everything it knows is wrapped in a page. This week the same data gets a second set of addresses, for programs. **No table changes, and no migration.**

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
> **Replace it. Don't add a second one.** Last week's script still works, and that's the trap: it checks *last week's* requirements, and every one of them still passes. **The tell is the first line of the report** — this week's says **`Week 13`** and scores out of **14 points**. If both are installed, this week's prints a red 🚨 above the score.

> [!WARNING]
> **Nothing runs when the page loads.** Type `recheck()` in the console when you want it to run, because:
>
> - **It signs in as week 11's self-check account**, `week11-selfcheck@example.com`, which your site already has if you ran either of the last two checks. If it doesn't, it makes it, once. **Never give that account your role.**
> - **It signs your browser out.** Sign back in when it's done.
> - **It changes none of your data.** The POST it sends is broken JSON and the DELETE names an id that can't exist, so even an API with no protection can't lose anything. That account is the only thing it can leave behind.
> - ⚠️ **It cannot see your admin succeed.** It doesn't know your admin's email or password, and it never should. Requirement 6 is yours to do.
> - **Red `Failed to load resource` lines in the console are expected.** They're the 401s, 403s and 404s it asked for. Read the report, not the red lines.

### Copy the tester in

`api-tester.html` comes from the starters clone, which sits next to your project in `dotnet-web`. In a terminal in your project's folder, the one with your `.csproj`, update the clone, then copy the file into your `wwwroot`:

```bash
git -C ../dotnet-web-starters pull
cp ../dotnet-web-starters/week-13/Cryptids.Web/wwwroot/api-tester.html wwwroot/
```

`../` means the folder above yours, which is `dotnet-web`. That's the whole install: open `/api-tester.html` on your running app. It goes live without a restart. → [Testing an endpoint](lecture-notes.md#part-5-testing-an-endpoint)

### Then build it

**Your API lives at the same word as your list page, with `/api` in front.** If your navbar links to `/Trails`, your API is `/api/trails`. Routing ignores capitals.

1. **Your list, as JSON.** An API controller with `[ApiController]`, `[Route("api/…")]` and `ControllerBase`, and an `[HttpGet]` action anyone can use that returns every record as a DTO. Each one needs its `id`. → [An API controller](lecture-notes.md#part-2-an-api-controller)
2. **One record, with its related rows.** `[HttpGet("{id:int}")]`: the record, and a list of its second-table rows inside it, through DTOs that can't loop. A record that doesn't exist is `NotFound()`. → [The loop, and DTOs](lecture-notes.md#part-4-the-loop-and-dtos)
3. **A count, with a minimal API.** `app.MapGet("/api/…/count", …)` in `Program.cs`, answering `{ "count": 6 }` with however many you have. → [A minimal API endpoint](lecture-notes.md#part-3-a-minimal-api-endpoint)
4. **Writes that need your role.** An `[HttpPost]` that takes an input DTO and answers `201`, and an `[HttpDelete("{id:int}")]` that answers `204`. `[Authorize(Roles = "YourRole")]` goes on the class, and `[AllowAnonymous]` on your two GETs. → [POST](lecture-notes.md#part-6-post) · [Who may write](lecture-notes.md#part-8-who-may-write)
5. **The Missing page stays off your API.** Your `UseStatusCodePagesWithReExecute` line goes inside `app.UseWhen`, so a refusal is a status and nothing else. → [The Missing page, behind the status](lecture-notes.md#the-missing-page-behind-the-status)
6. **Deployed, with your admin working there.** On your deployed site, signed in as yourself, open `/api-tester.html` and **send a real POST and a real DELETE**. List your API's addresses in your README. Everything from weeks 4–12 still works, and **3+ meaningful commits** are in your public repo. → [On Azure](lecture-notes.md#on-azure)

> [!IMPORTANT]
> **Press `Ctrl+R` after every edit to `Program.cs`** — requirements 3 and 5. The terminal running `dotnet watch` prints `Press "Ctrl + R" to restart.` above `Hot reload succeeded`, and the edit isn't live until you do. If it says `Restart is needed to apply the changes` instead, you answered `a` earlier and it's restarting by itself.

### Your app isn't mine

Nothing above says what your records are called. The self-check doesn't know either. It finds your list page from your navbar, the way it has since week 4, and adds `/api` in front. It finds your related rows by looking for an array inside a record, whatever you called it. **So your API has to use the same word as your list page.** If it can't find your list page in your navbar, `recheck("Trails")` with your own word tells it where to look, and that word is used for both.

## Part 3 — Check it as you go ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with.** It asks your API the way a program would: signed out, and signed in **without** your role.

> [!IMPORTANT]
> **Run it as you go.** It reports all six checks every time, and marks the ones it can't reach yet ⬜ instead of failing them — so a half-built app tells you *where you are*, not that you're broken. While anything is red, the report ends with one `👉 Next:` line naming the next thing to build.
>
> **Fixing things on localhost is much cheaper than fixing them on Azure**, which is why the tag goes in now. Then run it once more on your **deployed URL before you submit** — that's the run that counts.

**After each requirement, here is what moves.** Measured on a sample app built one requirement at a time:

| After requirement | What changes in the report |
|---|---|
| **before you start** — week 12's app | **0 of 14** — nothing answers at `/api/…` yet |
| **1** — your list | **3 of 14** |
| **2** — one record | **8 of 14** — the record, and the 404 that came with it |
| **3** — the count | **10 of 14** |
| **4** — the writes | **still 10** — the statuses are right, and the Missing page is printing itself behind them |
| **5** — `UseWhen` | **14 of 14** |
| **6** — deployed | run it once more on your Azure URL. That is the run I grade |

**You installed the tag in Part 2.** Run your app **locally** (`dotnet watch`), load your home page, open the console — **F12 → Console** — and type **`recheck()`**:

```
🔎 Week 13 self-check — https://tg-web-xx1234.azurewebsites.net

✅  3 pts  your list answers in JSON, to anyone — /api/Trails, 6 records
✅  3 pts  one record answers in JSON, with its related rows — /api/Trails/1, "reviews" has 3
✅  2 pts  a record that isn't there is a 404 in JSON — /api/Trails/999999999
✅  2 pts  your count answers in JSON — /api/Trails/count says 6
✅  2 pts  signed out, a POST and a DELETE get a 401 — /api/Trails
✅  2 pts  signed in without your role, a POST and a DELETE get a 403 — /api/Trails

📋 6 of 6 checks green · 14 of 14 points  (controller: /Trails)
```

> [!TIP]
> **If "one record" says every record has an empty list**, and your record pages show related rows, that query has no `Include`. A model with nothing loaded prints an empty list, so I look at up to eight records before saying so. If none of those eight has a related row, add one.

> [!TIP]
> **If the 401 line says a POST got a redirect**, the class has no `[ApiController]`. Without it, a refusal is a page's answer.

> [!TIP]
> **If the 403 line fails and you're sure the attribute is right**, check you didn't give your role to `week11-selfcheck@example.com`. It has to be your own email.

> [!TIP]
> **Working offline?** Save [`homework-checks.js`](homework-checks.js) into your `wwwroot` folder and point the tag at it locally: `<script src="/homework-checks.js"></script>` — still inside the `@section Scripts` block.

*(If you happen to have Node installed, `node homework-checks.js <url>` does the same thing from a terminal. You don't need it.)*

**14 of the 20 points are in that script.** The other 6 I read out of your repo — see the rubric.

## Part 4 — Deploy it (graded)

**No migration and no new app setting this week.** Your connection string and `Admin__Email` are already on Azure. So it's just the deploy:

```bash
az webapp up --name your-app-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

Use your own app's name and region — the ones you've used all term. ⚠️ **Keep `--os-type Linux` and `--runtime DOTNETCORE:10.0`.**

Then, on your deployed site: sign in as your admin, open **`/api-tester.html`**, **POST** a new record to your API, and **DELETE** it. A `201`, then a `204`. That's requirement 6, and it's the only proof your admin works — the self-check can't see it.

Then run the self-check on your Azure URL. That is the run I grade.

## 🆘 Stuck?

- **A new address is a 404 or your Missing page, over a correct `Program.cs`** — press `Ctrl+R` in the terminal running `dotnet watch`. `Program.cs` runs once, at startup. [A minimal API endpoint](lecture-notes.md#part-3-a-minimal-api-endpoint).
- **A `500` with `A possible object cycle was detected`** — you're returning a model with its related rows loaded, or a DTO has a property of a model type. [The loop, and DTOs](lecture-notes.md#part-4-the-loop-and-dtos).
- **A `500` with `NullReferenceException` right after you edited an action, and the code is right** — `Ctrl+R`. `Hot reload succeeded` can still leave a running action broken.
- **Your related rows are an empty list** — that query has no `Include`.
- **A POST comes back `415`** — no `Content-Type: application/json`. The tester sends one.
- **A POST comes back `400` and your JSON looks right** — is `[ValidateAntiForgeryToken]` on it? Take it off. [Why no token](lecture-notes.md#why-no-token).
- **A `500` that mentions a `FOREIGN KEY`** — your input's id points at nothing. [What the rules can't know](lecture-notes.md#what-the-rules-cant-know).
- **Your admin gets a `403`** — your cookie is older than your role, or the role's spelling differs from your seeder's. Sign out and back in. [Who may write](lecture-notes.md#part-8-who-may-write).
- **A signed-out request gets through, over a correct `[Authorize]`** — hot reload can report an attribute as applied when it isn't. `Ctrl+R` in the terminal running `dotnet watch`. [Who may write](lecture-notes.md#part-8-who-may-write).
- **The tester says `A redirect`** — the class has no `[ApiController]`.
- **The status is right, with a page of HTML behind it** — requirement 5, then `Ctrl+R`. [The Missing page, behind the status](lecture-notes.md#the-missing-page-behind-the-status).
- **Yellow `NU1902` / `NU1903` warnings about `System.Security.Cryptography.Pkcs`** — the advisory week 9's homework fixed. If your app still shows them, from the folder with your `.csproj`, once: `dotnet add package System.Security.Cryptography.Pkcs --version 10.0.13`. One line appears in your `.csproj`; commit it.
- **The self-check banner says Week 12** — last week's script is still installed. This week's line replaces it.
- **You're signed out and didn't sign out** — the self-check did, on purpose. Sign back in.

## 📊 Grading (20 pts)

| What | Pts | Where it comes from |
|---|---|---|
| Your list answers in JSON, to anyone | 3 | deployed URL |
| One record answers in JSON, with its related rows | 3 | deployed URL |
| A record that isn't there is a 404 in JSON | 2 | deployed URL |
| Your count answers in JSON | 2 | deployed URL |
| Signed out, a POST and a DELETE get a 401 | 2 | deployed URL |
| Signed in without your role, a POST and a DELETE get a 403 | 2 | deployed URL |
| `[ApiController]` on a controller class | 1 | your repo |
| A minimal API endpoint | 1 | your repo |
| DTOs: your API returns and accepts classes of its own | 1 | your repo |
| 3+ meaningful commits | 3 | your repo |
| **Deductions:** dead submitted URL | −2 | |

*Reminder: the explain-it standard applies. The ones I'll reach for: "why did returning your model fail, and what did you do about it?", "what's the difference between a 401 and a 403?", "where's your ModelState check?", and "why is there no antiforgery token on your POST?"*

## 📖 Reading for next week (~10 min)

Week 14 is **consuming your API with JavaScript**, then production concerns and team git.

- Open `wwwroot/api-tester.html` and find the one `fetch` call in it. **What does it do with the answer before it shows you anything?**
- Write down one page of your app that would be better if it could change without a full reload.
