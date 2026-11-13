# Week 14 Homework

**Topic:** your pages call your API, and `git push` deploys your app.
**Due:** before the start of Week 15's class. **This is the last homework of the term.**
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

If class ended at check 4, check 5 is the workflow — [Task 5 in full](lab/README.md#task-5-in-full). Team git needs no finishing: it was never collected.

> [!IMPORTANT]
> This isn't submitted and it isn't worth points. It's the same moves Part 2 asks you to make on your own app, with every file handed to you. Doing it first is what turns Part 2 into an hour.

## Part 2 — Your list page talks to your API (graded)

Same app you've been building since week 4, with week 13's API. This week your list page uses that API: a record's related rows open without leaving the page, and your role can add and remove records there too. Then GitHub deploys your app every time you push. **No table changes, no migration, and no C#.**

> [!TIP]
> **Keep [`lecture-notes.md`](lecture-notes.md) open while you work.** Every requirement below links to the section that shows it done, and the [troubleshooting section](lecture-notes.md#troubleshooting) names this week's specific errors.

> [!TIP]
> **Commit as you go, the way you have since week 3.** Three of tonight's twenty points are the history itself, and they're all-or-nothing: fewer than three commits scores zero. One commit per requirement you finish is the natural rhythm.

### Swap the self-check over first

Open `Views/Home/Index.cshtml`, find the **week-13** line, and **replace it**:

```html
@section Scripts {
    <script src="https://jgrissom.github.io/dotnet-web-dev/week-14/homework-checks.js"></script>
}
```

> [!CAUTION]
> **Replace it. Don't add a second one.** Last week's script still works, and that's the trap: it checks *last week's* requirements, and every one of them still passes. **The tell is the first line of the report** — this week's says **`Week 14`** and scores out of **12 points**. If both are installed, this week's prints a red 🚨 above the score.

> [!NOTE]
> **Nothing runs when the page loads.** Type `recheck()` in the console when you want it to run. **This one only reads**:
>
> - It opens your list page **out of sight, in your own browser**, and clicks **one** `show-related` button, the way you would. It never clicks a remove button, and it answers *no* to any `confirm()` your page asks.
> - It sends nothing but GETs, creates nothing, and **leaves you signed in** as whoever you were.
> - ⚠️ **It cannot see your add or your remove.** Both need your role, and it doesn't hold it. Requirement 6 is where you try them yourself.

### Then build it

**Two names below aren't yours to choose**, because the self-check finds your work by them: **`data-id`** on each record's element, and the class **`show-related`** on its button. Everything else is yours. All the commands run from the folder with your `.csproj`.

1. **A script of your own on your list page, and an id on every record.**
   - In your project, create a new file **`wwwroot/js/list.js`**. Open **[`list.js` on GitHub](https://github.com/jgrissom/dotnet-web-dev/blob/main/week-14/list.js)**, click the **Copy raw file** button at the top right of the code, paste it into your new file, and change **the four lines marked ✏️** to fit your app: your API's address from week 13, the name of the related-rows list in one record's JSON (open `/api/<your word>/1` in the address bar to see it), what one related row should say, and what a record is called.
   - In your list page's view, **`Views/<YourWord>/Index.cshtml`**, find the element your `@foreach` draws for each record — the card's `<div class="col">`, or the table's `<tr>` — and add **`data-id="@item.Id"`** to it, with your own loop variable in place of `item`.
   - At the very bottom of that same view:

     ```cshtml
     @section Scripts {
         <script src="~/js/list.js"></script>
     }
     ```

   → [Part of a page, from JSON](lecture-notes.md#part-2-part-of-a-page-from-json)
2. **A record's related rows, without leaving the page.** Inside that same element, a button and an empty list:

   ```cshtml
   <button type="button" class="btn btn-link px-0 show-related">Show reviews</button>
   <ul class="related list-unstyled small"></ul>
   ```

   with your own words on the button. Click it: the related rows appear under the record, and the address bar doesn't change. If a card's button lands on top of the next row, the card is `h-100` — [the lecture notes](lecture-notes.md#the-page-three-things-for-the-script-to-find) show the two Bootstrap classes that fix it. A table needs nothing. → [Part of a page, from JSON](lecture-notes.md#part-2-part-of-a-page-from-json)
3. **Add a record without leaving the page, as your role.** In the same view, just below your existing add link and **inside the same role check**, a form with **one box per property of your week-13 input DTO**, each `name` the property's name with a small first letter, then two empty lists:

   ```cshtml
   <form id="quick-add" class="row g-2 mb-2">
       <div class="col-md-3"><input name="name" class="form-control" placeholder="Name" /></div>
       <div class="col-md-2"><input name="miles" type="number" step="0.1" class="form-control" placeholder="Miles" /></div>
       <div class="col-md-2"><button class="btn btn-outline-primary w-100">Add it</button></div>
   </form>
   <ul id="quick-add-errors" class="text-danger small"></ul>
   <ul id="added" class="small mb-4"></ul>
   ```

   **A number property gets `type="number"`, a `bool` gets `type="checkbox"`, and a date gets `type="date"`** — `list.js` sends each the way your API reads it. Then try it, signed in with your role: add one, and **`Added`** appears with a link to its page; send the form empty, and your API's rules are listed in red. → [A form that sends JSON](lecture-notes.md#part-3-a-form-that-sends-json)
4. **Remove a record without leaving the page, as your role.** Inside each record's element, beside the button from requirement 2:

   ```cshtml
   @if (User.IsInRole("YourRole"))
   {
       <button type="button" class="btn btn-link text-danger remove">Remove</button>
   }
   ```

   Try it on a record you added in requirement 3: **OK**, and it goes; reload, and it stays gone. → [Remove, without a reload](lecture-notes.md#part-5-remove-without-a-reload)
5. **Your app deploys itself.** Four steps, once. Your resource group's name is on the `group =` line of the `.azure/config` file in your project folder, which `az webapp up` wrote.
   1. Turn on the deploy credential your app already has. Apps made by `az webapp up` come with it switched off:

      ```bash
      az resource update --resource-group <YOUR-GROUP> --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<YOUR-APP> --name scm --set properties.allow=true
      ```

   2. Print the credential, called a **publish profile**. ⚠️ **It's a password**: copy all of it straight into the next step, and nowhere else:

      ```bash
      az webapp deployment list-publishing-profiles --name <YOUR-APP> --resource-group <YOUR-GROUP> --xml
      ```

   3. On GitHub, your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. **Name:** `AZURE_WEBAPP_PUBLISH_PROFILE`. **Secret:** paste. **Add secret**.
   4. In your project, create **`.github/workflows/deploy.yml`** — a folder named `.github`, starting with a dot, with a `workflows` folder in it. Open **[`deploy.yml` on GitHub](https://github.com/jgrissom/dotnet-web-dev/blob/main/week-14/deploy.yml)**, click **Copy raw file**, paste, and change **the one line marked ✏️** to your app's name.

   Commit everything, and push. On GitHub, your repository's **Actions** tab shows a **Deploy** run; in about a minute and a half it's ✅, and your Azure URL is running what you pushed. Azure builds your code, the same way `az webapp up` always has. → [A deploy on every push to main](lecture-notes.md#a-deploy-on-every-push-to-main)
6. **Deployed, and tried as your role.** On your deployed site, signed in as yourself: **add a record** with your form, and open its page from the `Added` link; **show its related rows** (none yet); then **remove it**, and reload. List your API's addresses and this week's three buttons in your README. Everything from weeks 4–13 still works, and **3+ meaningful commits** are in your public repo. → [Where each secret lives](lecture-notes.md#part-8-where-each-secret-lives)

> [!IMPORTANT]
> **No restart this week.** A new `.js` file, an edit to it and an edit to a view all go live under `dotnet watch`, and the page reloads itself when you save. The terminal prints a yellow `The static asset '/js/list.js' was not found in the built time manifest` the first time the new file is asked for; that's harmless, and it stops at the next restart.

> [!WARNING]
> **Your secrets stay where they've been.** The connection string and `Admin__Email` are Azure app settings, and a deploy doesn't touch them. The publish profile is a GitHub secret. **None of the three ever goes in a file in your repository** — and that includes `deploy.yml`, which only *names* the secret.

### Your app isn't mine

Nothing above says what your records are called. The self-check doesn't know either. It finds your list page from your navbar, the way it has since week 4, and your API at the same word with `/api` in front, the way week 13's did. It finds the records by `data-id`, clicks `show-related`, and looks for the text of your related rows — whatever you called them — inside that record's element. If it can't find your list page in your navbar, `recheck("Trails")` with your own word tells it where to look.

## Part 3 — Check it as you go ✅

**[`homework-checks.js`](homework-checks.js) runs the same checks I grade with.** It looks at your list page the way a visitor's browser does.

> [!IMPORTANT]
> **Run it as you go.** It reports all four checks every time, and marks the ones it can't reach yet ⬜ instead of failing them — so a half-built app tells you *where you are*, not that you're broken. While anything is red, the report ends with one `👉 Next:` line naming the next thing to build.
>
> **Fixing things on localhost is much cheaper than fixing them on Azure**, which is why the tag goes in now. Then run it once more on your **deployed URL before you submit** — that's the run that counts.

**After each requirement, here is what moves.** Measured on a sample app built one requirement at a time:

| After requirement | What changes in the report |
|---|---|
| **before you start** — week 13's app | **0 of 12** — and a 🚨 if week 13's tag is still there |
| **1** — the script, and `data-id` | **4 of 12** |
| **2** — related rows | **12 of 12** |
| **3** and **4** — add and remove | **still 12** — they need your role, and the check doesn't hold it |
| **5** — the workflow | **still 12** — it's in your repo, and I read it there |
| **6** — deployed | run it once more on your Azure URL. That is the run I grade |

**You installed the tag in Part 2.** Run your app **locally** (`dotnet watch`), load your home page, open the console — **F12 → Console** — and type **`recheck()`**:

```
🔎 Week 14 self-check — https://tg-web-xx1234.azurewebsites.net

✅ 2 pts  your list page loads a script of your own — /js/list.js on /Trails
✅ 2 pts  every record on your list page carries its id, and your API knows each one — 6 on /Trails, all in /api/Trails
✅ 5 pts  a record's related rows appear without leaving the page — record 1, 3 of its "reviews" shown
✅ 3 pts  when your API answers anything but 200, the page says so instead of breaking — a 404 for record 1 shows "That one isn't here any more."

📋 4 of 4 checks green · 12 of 12 points  (controller: /Trails)
```

> [!TIP]
> **How does it test a 404 without breaking anything?** In the hidden copy of your page, it swaps `fetch` for one that answers 404, then clicks `show-related`. Nothing is sent to your app. Your page passes if it shows a message and doesn't throw — which is what reading the status first gets you.

> [!TIP]
> **If "related rows" says every record's list is empty**, and your record pages show related rows, week 13's one-record action has no `Include`. If it says a click "threw", open **F12 → Console** on your list page, click the button yourself, and read the red line.

> [!TIP]
> **Working offline?** Save [`homework-checks.js`](homework-checks.js) into your `wwwroot` folder and point the tag at it locally: `<script src="/homework-checks.js"></script>` — still inside the `@section Scripts` block.

*(If you happen to have Node installed, `node homework-checks.js <url>` does the same thing from a terminal, in Chromium. You don't need it.)*

**12 of the 20 points are in that script.** The other 8 I read out of your repo and its Actions tab — see the rubric.

## Part 4 — Deploy it (graded)

**This week the deploy is `git push`.** Requirement 5 set it up: push to `main`, and the **Deploy** run in your **Actions** tab publishes your app. **No migration and no new app setting.**

If a run fails, click it, then the red step: it prints exactly what went wrong. The 🆘 list below has the common ones. **`az webapp up` still works** if you need your site up while you sort a run out — but the workflow, and its last run, are 3 of your points.

Then, on your deployed site, signed in as yourself: requirement 6. And run the self-check on your Azure URL. That is the run I grade.

## 🆘 Stuck?

- **Clicking a button does nothing** — **F12 → Console**. A red line names the file and the line. No red line at all usually means the page never loads `list.js`: check the `@section Scripts` block, and look for `list.js` in **F12 → Network**. [Part of a page, from JSON](lecture-notes.md#part-2-part-of-a-page-from-json).
- **`list.js` is a `404`** — it isn't in `wwwroot/js`.
- **`Cannot read properties of undefined (reading 'length')`** — the ✏️ 2 line names a list your JSON doesn't have. Open `/api/<your word>/1` and copy the name exactly, small first letter included.
- **The related rows say `undefined`** — the ✏️ 3 line names properties your rows don't have. Same fix: read one row's JSON.
- **`SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input`** — something called `.json()` on an answer with no body: a `204`, a `401` or a `403`. [Which answers have a body](lecture-notes.md#part-4-which-answers-have-a-body).
- **The page reloads when you add, and the address bar ends in `?name=…`** — the script didn't run, so the browser sent the form itself.
- **The add says `400` and names a box you filled in** — that box's `name` isn't your input DTO's property name with a small first letter.
- **A `400` about `could not be converted`** — a number box without `type="number"`, or a date box without `type="date"`. A `bool` box needs `type="checkbox"`. [Your own app](lecture-notes.md#part-6-your-own-app).
- **The add or remove says to sign in again, and you're signed in** — your cookie is older than your role. Sign out and back in.
- **A red `404` in the console after a remove** — the read-back, saying it's gone. Expected.
- **The Actions tab shows no Deploy run** — `deploy.yml` isn't at `.github/workflows/` in the top folder of your repository, the `.github` folder lost its dot, or you pushed before you made it.
- **The Deploy run fails with `Unauthorized (CODE: 401)`** — the credential is switched off. Run step 5.1 again, then **Re-run failed jobs** on the run. [A deploy on every push to main](lecture-notes.md#a-deploy-on-every-push-to-main).
- **The Deploy run fails, and its log shows `error CS…`** — your code doesn't build. It's the same error your own terminal would show, with the file and the line. Fix it, commit, push. Your site keeps the last version that built.
- **The Deploy run fails with `Couldn't detect a version for the platform 'dotnet' in the repo.`** — your workflow runs `dotnet publish` and sends the result, like many examples online. Copy `deploy.yml` again from step 5.4: it sends your code, and Azure builds it.
- **`The ConnectionString property has not been initialized` on Azure** — your app setting is missing. It isn't in the workflow, and shouldn't be: [Development, and Production](lecture-notes.md#part-7-development-and-production).
- **The self-check banner says Week 13** — last week's script is still installed. This week's line replaces it.

## 📊 Grading (20 pts)

| What | Pts | Where it comes from |
|---|---|---|
| Your list page loads a script of your own | 2 | deployed URL |
| Every record on your list page carries its id, and your API knows each one | 2 | deployed URL |
| A record's related rows appear without leaving the page | 5 | deployed URL |
| When your API answers anything but 200, the page says so instead of breaking | 3 | deployed URL |
| A workflow that deploys to Azure on every push to main | 2 | your repo |
| Its last run on main succeeded | 1 | your repo's Actions tab |
| Your script adds (POST) and removes (DELETE) through your API | 2 | your repo |
| 3+ meaningful commits | 3 | your repo |
| **Deductions:** dead submitted URL | −2 | |

*Reminder: the explain-it standard applies. The ones I'll reach for: "why does your script read the status before calling .json()?", "what's in the body of a 401?", "why textContent and not innerHTML?", and "where does your publish profile live, and why not in deploy.yml?"*

## 📖 Reading for next week (~10 min)

Week 15 is the polish week: a message after a change, search, and pages. There's no homework.

- Open your list page and add a record with your form. **What tells you it worked?** Now add one through your old Create page. What tells you then?
