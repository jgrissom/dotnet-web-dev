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

# Week 11 — Identity

.NET Web Development · Week 11 of 16

**Tonight: the app learns who you are**

1. A **users table**, and a user class of your own
2. **Registering** — a password goes in, a hash comes out
3. **Signing in and out** — the cookie
4. **`[Authorize]`** — a write needs an account
5. **Customizing the user** — a property of your own

---

<!-- _footer: '🖥️ Demo §1 · two questions' -->

## Two questions

| | | |
|---|---|---|
| **Authentication** | *who are you?* | tonight |
| **Authorization** | *what may you do?* | tonight: **signed in, or not** |

<br>

Week 12: *signed in as **whom***.

---

<!-- _footer: '🖥️ Demo §2 · your own user class' -->

## Your own user class, even empty

```csharp
public class AppUser : IdentityUser
{
}
```

`IdentityUser` already has the email, the password hash, the lockout counters.

**The class is here so every file names *your* user from the start.**
Changing it later means changing all of them.

---

<!-- _footer: '🖥️ Demo §3 · never stored' -->

## The password is never stored

```csharp
await _userManager.CreateAsync(user, form.Password);
```

The password goes **in**. A **hash** is what gets saved.

<br>

`AspNetUsers` has a `PasswordHash` column — and no password column at all.

A hash can be checked against a password. It can't be turned back into one.

---

<!-- _footer: '🖥️ Demo §3 · the cookie is the login' -->

## The cookie is the login

```
  browser                                       server
     │  POST /Account/Register  (or /Login)       │
     │ ─────────────────────────────────────────▶ │  signs you in
     │ ◀─── Set-Cookie: .AspNetCore.Identity… ─── │
     │                                            │
     │  every request after that  + the cookie    │
     │ ─────────────────────────────────────────▶ │  "signed in"
```

HTTP remembers nothing. **Every request carries the cookie.**
Signing out deletes it.

---

<!-- _footer: '🖥️ Demo §4 · two rules' -->

## Two rules for a sign-in form

**1. Never say which half was wrong.**

> That email and password don't match an account.

*"Wrong password"* tells a stranger the email has an account.

<br>

**2. Signing out is a POST — never a link.**

Any page on the internet can make your browser send a GET.

---

<!-- _footer: '🖥️ Demo §5 · lock the controller' -->

## Lock the controller, open the reads

```csharp
[Authorize]
public class TrucksController : Controller
{
    [AllowAnonymous]
    public IActionResult Index() { … }

    [AllowAnonymous]
    public IActionResult Details(int id) { … }
```

On the **class**: every action is locked, including the POSTs, including **actions added later**.

---

<!-- _footer: '🖥️ Demo §5 · signed in is not trusted' -->

## Signed in is not trusted

| Tonight | |
|---|---|
| A visitor, not signed in | can read |
| **Anyone who made an account** | **can write** |

**Anyone** can create an account.
Tonight's lock keeps out visitors who haven't signed in —
not strangers who have.

**Week 12 is roles.**

---

<!-- _footer: '🖥️ Demo §7 · wrap-up' -->

## Tonight, in one picture

| | |
|---|---|
| **The user** | your class, built on `IdentityUser`. Yours from the start |
| **The password** | goes in, never comes out. A hash is stored |
| **The cookie** | is the login. Signing out deletes it |
| **`[Authorize]`** | on the class. `[AllowAnonymous]` on the reads |
| **Signed in** | is not trusted. Week 12 |
