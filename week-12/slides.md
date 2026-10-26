---
marp: true
theme: gaia
class: invert
paginate: true
style: |
  section pre {
    background: #151b23;
    border-radius: 8px;
  }
  section pre code {
    background: transparent;
    color: #e6edf3;
  }
  section pre .hljs-keyword { color: #ff7b72; }
  section pre .hljs-string { color: #a5d6ff; }
  section pre .hljs-title, section pre .hljs-title.function_ { color: #d2a8ff; }
  section pre .hljs-comment { color: #9198a1; font-style: italic; }
  section pre .hljs-attr, section pre .hljs-attribute { color: #79c0ff; }
  section pre .hljs-number, section pre .hljs-literal { color: #79c0ff; }
  section pre .hljs-built_in { color: #ffa657; }
  section pre .hljs-name { color: #7ee787; }
  section pre .hljs-selector-class, section pre .hljs-selector-pseudo { color: #7ee787; }
  section footer { color: #9fb2c1; font-size: 0.6em; opacity: 0.85; }
---


<!-- _paginate: false -->

# Week 12 — Roles

.NET Web Development · Week 12 of 16

**Tonight: signed in as whom?**

1. **A role on the lock** — and the page a refusal lands on
2. **Who gets the role** — and where that's written down
3. **Hiding what you can't use** — which is not the lock
4. **Claims** — what the cookie says about you
5. **What's already secured**, weeks 6 to 12

---

<!-- _footer: '🖥️ Demo §1 · signed in as whom' -->

## Signed in as whom?

| | Week 11 | Tonight |
|---|---|---|
| Not signed in | can read | can read |
| **Anyone with an account** | **can write** | can read |
| **Someone with the role** | — | **can write** |

<br>

Anyone can make an account.
**A role is something only you can give out.**

---

<!-- _footer: '🖥️ Demo §2 · three visitors, three answers' -->

## A role on the lock

```csharp
[Authorize(Roles = "Admin")]
public class TrucksController : Controller
```

| Who clicks ＋ Add a truck | Where they land |
|---|---|
| not signed in | `/Account/Login` |
| signed in, **not** an Admin | `/Account/AccessDenied` |
| signed in as an Admin | the form |

Both are **Identity's defaults**. You write the pages.

---

<!-- _footer: '🖥️ Demo §4 · the email lives in configuration' -->

## Who gets the role

The role is made in code. **Who holds it is not.**

| | Where `Admin:Email` lives |
|---|---|
| your machine | `dotnet user-secrets set "Admin:Email" "…"` |
| Azure | an app setting named `Admin__Email` |

<br>

The same store as your connection string.
**No email and no password in the repo.**

---

<!-- _footer: '🖥️ Demo §4 · read when you sign in' -->

## The role is read when you sign in

```
  sign in   ─▶  cookie: name, email, … roles: (none)
  restart   ─▶  database: Ada is an Admin
  next page ─▶  cookie: … roles: (none)   ← still
  sign in   ─▶  cookie: … roles: Admin
```

`[Authorize]` reads the **cookie**, not the database.

A new role takes effect the next time you sign in.
*(Identity also re-checks the cookie every 30 minutes, so it can arrive on its own. Don't wait for it.)*

---

<!-- _footer: '🖥️ Demo §5 · not the lock' -->

## Hiding a link is not security

```cshtml
@if (User.IsInRole("Admin")) { ... }  // in the view
[Authorize(Roles = "Admin")]          // on the controller
```

| | Decides | Without it |
|---|---|---|
| **the `@if`** | what you **see** | a button that leads to a refusal |
| **the attribute** | what you can **do** | **anyone signed in can write** |

The address bar doesn't need a button.
**Hide the button for the visitor. Lock the controller for the data.**

---

<!-- _footer: '🖥️ Demo §6 · a role is a claim' -->

## A role is a claim

A **claim** is one fact about you, written into the cookie when you sign in.

```
…/claims/name          ada@example.com
…/claims/emailaddress  ada@example.com
…/claims/role          Admin
```

`User.IsInRole("Admin")` and `[Authorize(Roles = "Admin")]`
both read **that one row**.

---

<!-- _footer: '🖥️ Demo §7 · already secured' -->

<style scoped>
  section table { font-size: 0.78em; }
</style>

## What's already secured

| Week | What | It stops |
|---|---|---|
| 6 | `[ValidateAntiForgeryToken]` | another site posting your forms |
| 8 | the `[Bind]` list | fields nobody put on the form |
| 11 | `PasswordHash` | a stolen table giving up passwords |
| 11 | sign-out is a POST | any page signing you out |
| 11 | `LocalRedirect` | `?ReturnUrl=` sending you off-site |
| 11 | `[Authorize]` on the class | an action someone forgot |
| **12** | **a role on it** | **strangers who made an account** |

---

<!-- _footer: '🖥️ Demo §8 · wrap-up' -->

## Tonight, in one picture

| | |
|---|---|
| **The lock** | `[Authorize(Roles = "…")]`, still on the class |
| **Refused, signed in** | `/Account/AccessDenied` — a page you write |
| **Who has the role** | configuration, not code. A seeder hands it out at startup |
| **The cookie** | carries the role. Sign in again to get a new one |
| **A hidden button** | is a courtesy. The attribute is the lock |
