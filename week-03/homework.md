# Week 3 Homework

**Due:** before the start of Week 4's class.
**Submit via Canvas:** your **Azure URL** + your **GitHub repo URL** for the lab solution.

## Part 1 — Finish First Flight (graded)

All six checks green:

```bash
dotnet test FirstFlight.Checks
# Passed! - Failed: 0, Passed: 6 ...
```

If class ended at check 4, that means finishing `Hello` (checks 5–6) — the [parameters section](lecture-notes.md#passing-data-viewdata-and-parameters) of the notes has the pattern.

## Part 2 — Put it on GitHub (graded)

1. Create a **public** repo named `first-flight` and push your solution folder to it.
2. **Commit as you go — at least 3 meaningful commits** (a natural rhythm: one per check you turn green; the `.gitignore` in the starter already keeps build output out).

## Part 3 — Deploy it (graded)

Follow **[deploy-guide.md](deploy-guide.md)** — install `az`, log in, and pick your US region (guide steps 1–3, done in class), then deploy from inside `FirstFlight.Web`:

```bash
az webapp up --name ff-web-XX1234 --sku F1 --os-type Linux \
  --runtime DOTNETCORE:10.0 --location "<YOUR-US-REGION>"
```

> [!IMPORTANT]
> Before submitting, test your live URL **in a private/incognito window**: the home page (branded), `/Home/About`, and `/Home/Hello?name=anything`. If it 404s or 500s for you, it does for me — and the deploy-guide's 🆘 section is where to look. Leave the app up until grades post.

## 📊 Grading (20 pts)

| Item | Points |
|------|--------|
| `dotnet test` 6 / 6 in your repo (I run it) | 10 |
| Deployed: home page branded | 2 |
| Deployed: `/Home/About` works | 2 |
| Deployed: `/Home/Hello?name=…` + default both work | 2 |
| Public repo with 3+ meaningful commits | 4 |
| **Deductions:** checks project edited, or dead submitted URL | −2 each |

*Reminder: the explain-it standard applies — be ready to walk me through any line, especially "why does `/Home/About` find your method?"*

## 📖 Reading for next week (~20 min)

Week 4 goes deep on routing and Razor — pages built from data.

- [Microsoft: Views in ASP.NET Core MVC](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/overview) — read the first half.
- Skim your own `FirstFlight.Web/Views/Shared/_Layout.cshtml` top to bottom and write down two things you recognize from week 2 and one thing you can't explain yet. Bring the list.
