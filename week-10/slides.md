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

# Week 10 — The Midterm Project

.NET Web Development · Week 10 of 16

---

<!-- _footer: '🖥️ Demo §1 · two different questions' -->

## Two questions

**Does it work?**
`dotnet test`. The self-check. A yes or a no.

<br>

**Would you send someone this link?**

<br>

Tonight is the second one — and **nothing new gets introduced.**

---

<!-- _footer: '🖥️ Demo §1 · walk it like you just arrived' -->

## Walk it like you just arrived

In a **private window**, on your **deployed** URL:

1. The front page — what is this, and what can I do?
2. Every link in the navbar. All of them.
3. One record's page — is there a way onward?
4. The browser tab. What does it say?
5. An id in the URL that doesn't exist.

**Write it down before you fix anything.**

---

<!-- _footer: '🖥️ Demo §2 · what a front page owes you' -->

## What a front page owes a visitor

| | |
|---|---|
| **What this is** | one sentence, in their words |
| **A way in** | a button, not a navbar link |
| **Why bother** | one more sentence |

<br>

Ten seconds of patience. That's the whole budget.

---

<!-- _footer: '🖥️ Demo §3 · zero bytes' -->

## What does the browser draw?

Every guard you've written does this:

```csharp
if (trail == null)
{
    return NotFound();
}
```

<br>

404 — correct, honest, **and zero bytes of body.**

**So what's on the screen?**

---

<!-- _footer: '🖥️ Demo §3 · three pieces' -->

## Three pieces, one of them a line

```csharp
// Program.cs, above app.UseRouting()
app.UseStatusCodePagesWithReExecute("/Home/Missing");
```

```csharp
// HomeController — NOT called NotFound(). That name is taken.
public IActionResult Missing() => View();
```

<br>

...and `Views/Home/Missing.cshtml`, an ordinary view.

**The status stays 404. The page is yours.**

---

<!-- _footer: '🖥️ Demo §4 · what does this draw' -->

## `Model` is empty. Now what?

```cshtml
<ul class="list-group">
    @foreach (var dish in Model)
    {
        <li class="list-group-item">@dish.Name</li>
    }
</ul>
```

<br>

No exception. A `foreach` over nothing is perfectly happy.

**You have never seen this. You seeded your data in week 7.**

---

<!-- _footer: '🖥️ Demo §4 · two things, not one' -->

## An empty state is two things

**A sentence** — nothing here yet.

**A way to change that** — and this is the half people skip.

<br>

> *No reviews yet.*  → a dead end
> *No reviews yet — be the first* + a button  → a page

---

<!-- _footer: '🖥️ Demo §5 · what it can and cannot see' -->

## The script scores nothing

| It sees | It cannot see |
|---|---|
| the template front page | your empty states |
| a link that goes nowhere | whether your data reads like content |
| a wrong id with no body | whether anyone can tell what this is |
| last week's `Week N Test` row | whether it's any good |

<br>

**Zero findings is not full marks.**

---

<!-- _footer: '🖥️ Demo §6 · hand off to the studio' -->

## Studio: your app, tonight

- Your three things from week 9's walk
- The front door · the empty states · the wrong-id page
- Real data · a README with the live URL

<br>

I'm circulating. **Bring me your list, not your bugs.**

<br>

**⏱️ 100 minutes, with a break at the halfway point.**

---

<!-- _footer: '🖥️ Demo §7 · wrap-up' -->

## Tonight, in one picture

| | |
|---|---|
| **Front door** | the first page is the only one everyone sees |
| **Empty** | every list is empty for somebody |
| **Missing** | `NotFound()` sends no body. The browser fills it |
| **Dead end** | every page needs a way onward |
| **README** | the repo is half of what you submit |
