# Week 5 Demo Canvas — Curbside Gets a Shell 🌮

Week 5's demo picks Curbside up exactly where week 4 dropped it and rebuilds everything *around* the pages: the layout gets read and broken, one card file ends up rendering on two different pages, and a single `<link>` re-skins the site. **Deliberately different content from the lab:** you shell Curbside; students shell the *Cryptid Registry*.

- `demo-script.md` — the edit-by-edit cue sheet, keyed to slide numbers, with a [clickable hosted version](https://jgrissom.github.io/dotnet-web-dev/week-05/demo/script.html). Every block you type or paste is in it.
- **The starting app is not in this repo.** Curbside's finished week-4 state lives in the private answer-keys repo at `week-05/demo-starter/Curbside` — copy it out to a scratch folder before class. It's kept out of the public repo because a worked list-and-details app is next year's week-4 lab answer.

> [!IMPORTANT]
> **You break the layout four times on purpose** — `@RenderBody()`, the page title, `Layout = null`, and `required: true`. Unlike week 4's route-pattern edits, each of these takes down **every page at once**, so a forgotten restore is instantly obvious *and* instantly derailing. The script flags all four; do the restores when it says to.

> [!TIP]
> The beat worth protecting if you run short is **§3's "one edit, both pages"** — changing `_TruckCard.cshtml` and refreshing two different URLs. If time is tight, cut the extra theme swaps in §5 rather than anything in §3; Bootswatch still lands in one swap, and the partials moment can't be recovered from the notes.

> [!TIP]
> **Hard-refresh at every theme swap** (⌘⇧R / Ctrl+Shift+R). A cached stylesheet is indistinguishable from a broken one, and it is the most reliable way to lose five minutes in §5.
