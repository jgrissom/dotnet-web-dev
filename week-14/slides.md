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

# Week 14 — Your pages call your API

.NET Web Development · Week 14 of 16

**Tonight: part of a page, without a reload**

1. **A truck's menu** — a GET from the page
2. **A form that sends JSON** — a POST, and its errors
3. **Remove** — a DELETE, and what has no body
4. **Production** — environments, secrets, CI and CD
5. **Team git** — two people, one line

---

<!-- _footer: '🖥️ Demo §1 · the shape' -->

<style scoped>
  section pre { font-size: 0.66em; }
</style>

## One fetch, three steps

```js
const showMenu = async (card) => {
    const response = await fetch(`/api/trucks/${card.dataset.id}`);  // 1. send, and wait
    if (response.status !== 200) { … }                              // 2. the status
    const truck = await response.json();                            // 3. then the body
};
```

- **`async`** marks a function that can wait
- **`await`** waits for the answer — the rest of the page keeps working
- The same idea as your **`async` actions since week 8**

**The status first. It decides whether there's a body to read.**

---

<!-- _footer: '🖥️ Demo §2 · try it' -->

<style scoped>
  section pre { font-size: 0.8em; }
</style>

## Part of a page, from JSON

```
click        →  event.target.closest("[data-id]")   →  the card, and its id
fetch        →  /api/trucks/2                        →  200
.json()      →  { name, specials: [ … ] }
createElement("li")  →  textContent  →  menu.append(…)
```

One listener on the grid answers **every** card, even ones added later.

**`textContent`, never `innerHTML`, for anything that came from the API.**

---

<!-- _footer: '🖥️ Demo §3 · signed out, with the page still open' -->

<style scoped>
  section table { font-size: 0.78em; }
</style>

## Which answers have a body?

| Status | The body | So the script… |
|---|---|---|
| `200` | the record | `.json()` |
| `201` | the new one, and `Location` | reads `Location` back |
| `204` | **nothing** | reads it back with a GET |
| `400` | `errors` | `.json()`, and lists them |
| `401` `403` | **nothing** | says so, from the status |
| `404` | what went wrong | says it's gone |

**Read the status first. Call `.json()` only when there's a body.**

---

<!-- _footer: '🖥️ Demo §5 · development, and production' -->

<style scoped>
  section table { font-size: 0.8em; }
</style>

## Development or Production?

| | Development | Production |
|---|---|---|
| who says so | `launchSettings.json` | nothing — it's the default |
| user secrets | **read** | **not read** |
| an exception | the page with the code | `/Home/Error` |
| where | your laptop, `dotnet watch` | Azure |

`ASPNETCORE_ENVIRONMENT` decides. **Week 7: user secrets are read in Development only.**

---

<!-- _footer: '🖥️ Demo §5 · where each secret lives' -->

<style scoped>
  section table { font-size: 0.72em; }
</style>

## Where each secret lives

| The secret | Kept in | Read by |
|---|---|---|
| connection string, `Admin:Email` | user secrets | your app, on your laptop |
| the same two, spelled with `__` | Azure app settings | your app, on Azure |
| the credential to deploy | a GitHub repository secret | the workflow, on GitHub |

**Never in the repository. Never in a workflow file.**

A real project has **two databases**, and only the deploy changes production's.

---

<!-- _footer: '🖥️ Demo §5 · a build on every push' -->

<style scoped>
  section pre { font-size: 0.6em; }
</style>

## CI, then CD

**CI:** every push is built, somewhere that isn't your laptop.
**CD:** when main's build passes, it deploys.

```yaml
on:
  push:
    branches: [ main ]
# … then two steps:
      - uses: actions/checkout@v4
      - uses: azure/webapps-deploy@v3
        with:
          app-name: tg-web-xx1234
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: .
```

The file **names** the secret. **Azure builds the code.**

---

<!-- _footer: '🖥️ Demo §6 · the review, and the conflict' -->

## Two people, one line

1. **A branch** for each change
2. **Push**, and open **a pull request** — the build runs
3. **A review**, then **merge**
4. Same line changed? `git pull --no-rebase origin main` — decide, commit, push, and the build runs again

**Nobody works on main. Main only changes through a pull request.**

---

<!-- _footer: '🖥️ Demo §7 · wrap-up' -->

## Tonight, in one picture

| | |
|---|---|
| **`fetch` + `await`** | ask the API, and wait for it |
| **The status** | read it first: is there a body? |
| **`textContent`** | data onto the page, as text |
| **Production** | no user secrets: app settings |
| **CI, CD** | every push built; main deployed |
| **A pull request** | a build and a review before main |
