# Week 10 Homework — The Midterm Project

**Topic:** your application becomes something you would show someone.
**Due:** before the start of Week 11's class.

This is the midterm. **Nothing new gets introduced** — there is no new syntax below, no new package and no new table. You take the application you have been building since week 4 and you finish it.

**Keep [the lecture notes](lecture-notes.md) open while you work.** Every requirement below links to the section that shows it done.

## Part 1 — The stranger's pass (nobody collects this, and it decides everything else)

Week 9's reading asked you to click through your own app as a stranger would and write down the three things that look worst. **That list is your midterm.** If you have it, get it out. If you don't, do it now — it takes ten minutes and the rest of the evening depends on it.

**Open your deployed URL — then open it again on your phone** — and walk it both times: the front page, every navbar link, one record's page, your form, the browser tab, and a details URL with the id changed to something that doesn't exist. Write down what you see, not what you meant. → [The stranger's pass](lecture-notes.md#part-2-the-strangers-pass)

**This is worth zero points and it is the best ten minutes you can spend.** Everything in Part 2 is easier once you have looked.

> [!NOTE]
> **One thing you will notice, and you are not fixing it tonight: anyone with your URL can add, edit and delete your records.** There is no login. That has been true since week 6, it is deliberate, and it is week 11's subject. Don't spend midterm time on it.

## Part 2 — Make it finished (graded)

### Swap the self-check over first

Open `Views/Home/Index.cshtml`, find the **week-09** line, and **replace it**:

```html
@section Scripts {
    <script src="https://jgrissom.github.io/dotnet-web-dev/week-10/homework-checks.js"></script>
}
```

⚠️ **Replace it — do not add a second line.** Last week's script is still installed and it still passes, so left in place it prints a green report about **week 9** and you will read it as good news. The banner says which week; check it.

⚠️ **Requirement 1 rewrites this exact file.** The `@section Scripts` block goes back in at the bottom when you do, or the script stops loading and the silence reads like a clean report.

⚠️ **Nothing runs when the page loads.** Open the console (F12) and type `recheck()` when you want it to look. Unlike weeks 6–9, **this one only reads** — it submits nothing and writes no rows, so run it as often as you like.

### Then build it

Each requirement links to the section of the notes that shows it done.

> [!IMPORTANT]
> **This week's script prints findings, not a score.** It starts by telling you how many things it tripped over and your job is to get that to zero — but zero is not full marks, and three of the seven requirements below are things it cannot see at all. Each one says so.

1. **A front door of your own.** Rewrite `Views/Home/Index.cshtml`: what this site is, who it's for, and a button into your list page. Set `ViewData["Title"]` on it — and on your other views — to something that isn't `"Home Page"`. ⚠️ **Then look at it.** If you picked a dark theme in week 5, some Bootstrap classes will paint a near-white panel under your near-white text and nothing will warn you. → [The front door](lecture-notes.md#part-3-the-front-door)

   🔎 **The script sees this one.** Two of its findings go away — but **not** an unreadable page. It reads your HTML, not your colors. That one is yours to look at.

2. **Deal with the pages you didn't write, and the links that go nowhere.** The stock **Privacy** page is linked from your navbar and your footer and says *"Use this page to detail your site's privacy policy."* Either make it real — an About page for your project is the usual answer — or delete it: the view, the action, and **both** links in `_Layout.cshtml`. Then click **every** remaining link and make sure it lands somewhere: a dead link in the navbar is on every page of your site at once. → [The page you did not write](lecture-notes.md#the-page-you-did-not-write) · [Dead ends](lecture-notes.md#part-6-dead-ends)

   🔎 **The script sees both halves** — the stock Privacy text, and any link on your front page that comes back 404 or throws.

3. **Empty lists say something.** Every list you render will be empty for somebody, and right now it draws an empty bordered box under a heading. Put an `@if (!Model.Any())` on your list page **and** on the related list on your details page, each with a sentence and a way to change it. → [When there is nothing there yet](lecture-notes.md#part-4-when-there-is-nothing-there-yet)

   📋 **The script cannot see this** — it can't empty your database. I read it in your repo. To see it yourself, create a brand-new record through your form and look at its page.

4. **A wrong id lands somewhere.** Change a details URL to an id that doesn't exist. You get a blank browser page, because `NotFound()` sends no body — which is what every saved link to a record you deleted now does. Three pieces: a view, an action, and one line in `Program.cs` — **built in that order**, or there is a window where every wrong-id URL answers `500` instead. → [The page a wrong id lands on](lecture-notes.md#part-5-the-page-a-wrong-id-lands-on)

   🔎 **The script sees this one.** ⚠️ Both halves need a **restart** — read the note in that section before you decide it didn't work.

5. **Your three things, fixed.** The ones from Part 1. They are yours, they are not on this list, and they are worth more than anything that is. Name them in your README (requirement 7) so I know what you chose. → [Choosing your three things](lecture-notes.md#part-10-choosing-your-three-things)

   📋 **The script cannot see these.** They're yours.

6. **Data that reads like content.** Walk your records and remove anything you typed while testing — `test`, `asdf`, a rating of 0. **Check specifically for a `Week 7 Test` or `Week 9 Test` row**: those self-checks filed one through your own form and had no way to take it back, so there is a good chance one is on your public site. → [Data that reads like data](lecture-notes.md#part-7-data-that-reads-like-data)

   🔎 **The script sees the `Week N Test` row.** It cannot judge whether the rest of your data reads well.

7. **A README a stranger can act on.** At the **root** of your repo, `README.md`: what the project is, **the live URL**, what it does, what it's built with, and how to run it. Name your three things from requirement 5 in it. → [The README a stranger reads](lecture-notes.md#part-8-the-readme-a-stranger-reads)

   📋 **The script cannot see this** — it never opens your repo. I do.

### Your app isn't mine

Nothing above says what your topic is or what your tables are called. The script doesn't know either — everything it looks at is something a visitor can see without knowing what your site is about.

## Part 3 — Check it as you go ✅

Type `recheck()` in the console. **It reads only** — no forms submitted, no rows written, nothing left behind. Run it whenever.

You installed the tag in Part 2, so run your app **locally** (`dotnet watch`) and check as you go. The deployed run is the one that counts, and it comes last.

**After each requirement, here is what moves:**

| After requirement | What changes in the report |
|---|---|
| **1** — the front door | **two findings go** — the template home page and the `Home Page` tab title |
| **2** — Privacy | **one goes** |
| **3** — empty states | **nothing.** It cannot empty your database to look. This one is read from your repo |
| **4** — the wrong-id page | **one goes.** If it doesn't, the restart is what's missing, not the code |
| **5** — your three things | **nothing** unless one of them happens to be something it checks |
| **6** — the test row | **one goes**, if you had one |
| **7** — the README | **nothing.** It never opens your repo |
| **8–9** — deployed | run it once more on your Azure URL. That's the run I open |

Sample output, from a run against a site with two things left:

```
🔎 Week 10 — the stranger's pass — https://tg-web-xx1234.azurewebsites.net
   Reading only. Nothing is submitted and nothing is written.

⚠️  The stock Privacy page is still linked
      /Home/Privacy — it says "Use this page to detail your site's privacy policy" — a page you didn't write, advertised in your navbar and your footer.
      → Either make it a real page about your project, or delete it: the view, the action, and both links in _Layout.cshtml. A page you haven't written is worse than no page.

⚠️  A wrong id lands on a blank browser page
      /Trails/Details/1007 — it came back 404 with an empty body — so the browser draws its own error page. No navbar, no way back, nothing that looks like your site.
      → Give your app a page for it. One line in Program.cs, before app.UseRouting():
            app.UseStatusCodePagesWithReExecute("/Home/Missing");

📋 2 things a stranger would trip over  ·  13 pages walked  (list page: /Trails)
```

> [!NOTE]
> **Getting to zero is not the assignment.** Three of the seven requirements are invisible to the script, and they are worth **9 of the 20 points**. A clean report means nothing is obviously broken — it says nothing about whether the thing is any good. That judgement is the midterm.

**Working offline?** Everything except the deployed run works against `localhost`. The script prints a reminder when it notices.

⚠️ **The deployed URL is the one I open.** A site that is perfect on localhost and 500s on Azure scores what Azure shows.

## Part 4 — Deploy it (graded)

8. **Push your work**, in **3 or more meaningful commits**. Check the history before you push: `git log --oneline`.

9. **Deploy, then run the stranger's pass on your Azure URL.**

```bash
az webapp up
```

You are not adding a table this week, so there is probably no migration to apply. **If one of your three things did change the model**, migrate first and deploy second — `dotnet ef database update`, then `az webapp up`. New code on an old schema throws `Invalid object name` on every page that touches it.

## 🆘 Stuck?

- **My new front page is blank / the headline vanished** — near-white text on a near-white panel, which a dark Bootswatch theme causes and nothing reports. F12 → Elements → click the element → compare `background-color` and `color`. [Part 3](lecture-notes.md#part-3-the-front-door).
- **I rewrote my home page and the console went quiet** — the `@section Scripts` block lived in that file and you replaced it. [Put it back](lecture-notes.md#part-3-the-front-door).
- **`NotFound` gives a compiler error when I add the action** — `Controller` already has a method by that name. Call yours `Missing`. [Part 5](lecture-notes.md#part-5-the-page-a-wrong-id-lands-on).
- **I added the `Program.cs` line and a wrong id is still blank** — `Program.cs` only runs at startup, so this needs a restart, and so does the new `.cshtml`. `dotnet watch` asks first, in the terminal it is running in — while you are typing in the editor. Look there for `Do you want to restart your app?` and answer `a`. [Part 5](lecture-notes.md#part-5-the-page-a-wrong-id-lands-on).
- **Every wrong id suddenly 500s, and the error names a view** — you added the `Program.cs` line before writing `Views/Home/Missing.cshtml`. Build the view and the action first. [Part 5](lecture-notes.md#part-5-the-page-a-wrong-id-lands-on).
- **My 404 page shows but the status is 200** — you returned the view from inside the guard instead of letting the middleware do it. [Part 5](lecture-notes.md#part-5-the-page-a-wrong-id-lands-on).
- **The empty state never appears** — a list page and the related list on a details page are two different views. Both need their own `@if`. [Part 4](lecture-notes.md#part-4-when-there-is-nothing-there-yet).
- **`Model.Any()` throws `NullReferenceException`** — the collection property was never initialized. [Week 9, Part 2](../week-09/lecture-notes.md#part-2-three-properties-two-classes).
- **A `Week 9 Test` row is on my site and that table has no Delete** — delete it by hand in the mssql panel. [Part 7](lecture-notes.md#part-7-data-that-reads-like-data).
- **GitHub isn't rendering my README** — it has to be `README.md` at the repository **root**. [Part 8](lecture-notes.md#part-8-the-readme-a-stranger-reads).
- **The self-check banner says Week 9** — last week's script is still installed. This week's line replaces it.

## 📊 Grading (20 pts)

**There is no self-check score this week.** I grade this one by hand, with your site open in one window and your repo in another.

| What | Pts | Where it comes from |
|---|---|---|
| A front door of your own — says what it is, gets you in, isn't the template's | 3 | deployed URL |
| **Your three things, fixed and named in your README** | 4 | repo + URL |
| Nothing a visitor can reach is broken — no dead links, no 500s, no blank wrong-id page | 3 | deployed URL |
| Empty lists say something, with a way out | 2 | your repo |
| Your data reads like content — no test rows, no placeholders | 2 | deployed URL |
| A README a stranger can act on, with the live URL on it | 3 | your repo |
| 3+ meaningful commits | 3 | your repo |
| **Deductions:** dead submitted URL | −2 | |

*The three-things line is the biggest on the page, and it is deliberately the one I can't specify in advance. It is worth the most because choosing well is the thing being assessed — a well-chosen, properly finished fix beats three items copied off this list.*

*Requirements 3 and 7 are graded from the repo because no checker can reach them: emptying your database isn't something a script gets to do, and the README isn't on your website.*

*Reminder: the explain-it standard applies. The ones I'll reach for: "which three things did you pick, and why those?", "show me what your list page looks like with no rows on it", "what does `UseStatusCodePagesWithReExecute` actually do to the request?", and "what would you fix next, if you had another evening?"*

## 📖 Reading for next week (~10 min)

Week 11 is **ASP.NET Core Identity** — registration, login, and customizing the user.

- **The hole you were told not to fix tonight is next week's subject.** Open your own deployed app and go to your Delete page for any record. Notice that nothing asked who you are.
- Think about your own app: **which pages should anyone be able to see, and which should need an account?** Write down the split. Most projects land on "everyone reads, one person writes" — but not all of them, and yours is yours.
- No new reading. Bring the split.
