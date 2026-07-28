# Week 4 Demo Canvas — Curbside 🌮

Week 4's demo is editor theater: you build **Curbside**, a food-truck directory, live from `dotnet new mvc` — routing gets read *and broken*, Razor grows from `@DateTime.Now` to a full data-driven table, and the night ends with a working Index → Details pair. **Deliberately different content from the lab:** you build Trucks; students build the *Cryptid Registry*.

- `demo-script.md` — the edit-by-edit cue sheet, keyed to slide numbers, with a [clickable hosted version](https://jgrissom.github.io/dotnet-web-dev/week-04/demo/script.html). Fully self-contained: every command and code block you type or paste is in it.
- No committed app here — the finished demo is ~80 lines of changes to a fresh template, and the script *is* the reference. Rehearse by running it once (≈20 min).

> [!IMPORTANT]
> §1 has you **edit the route pattern twice and restore it**. If you get interrupted mid-segment, the app 404s in ways that will confuse everyone including you. The script flags the restore both times — trust it, and re-read the pattern before moving to §2.

> [!TIP]
> The two beats worth protecting if you run short: the **`@foreach` → View Source** moment in §3 (one `<li>` in, six out) and the **`/Trucks/Details/999`** 404 in §5. Everything else is scaffolding around those two.
