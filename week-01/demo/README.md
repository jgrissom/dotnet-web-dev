# Week 1 Demo — Console Playground 🎨

Week 1's live-coding happens in the browser console, so the "canvas" is two things:

- `finished.html` — the **DOM & fetch playground**: a minimal page with the `#status` / `#go` elements the slide-22 demo selects. Hosted at **https://jgrissom.github.io/dotnet-web-dev/week-01/demo/** — open that in class (console on, page visible), and students can replay the demo from the same URL at home without cloning anything.
- `demo-script.js` — every console example in slide order, for pasting blocks when live-typing runs slow. **Type the prediction moments** (`typeof null`, `1 == "1"`, `updated`…) — the paste file is a safety net, not the performance.

> [!TIP]
> **Pages down? Keep a local copy of the playground.** `finished.html` is the whole canvas, so a copy at
> `~/Repos/dotnet-web-dev-course/instructor/week-01/playground.html` runs §6 from `file://` — DOM *and* `fetch`,
> since the API it calls allows a local file. Without it the offline fallback covers the console blocks but
> not the page they act on, and §6 is the one segment that needs the page.

The lecture's data (`scores`, `student`, Ada/Linus/Grace) is deliberately different from the lab's (`describeScore`, gauntlet) and the homework's (`courses`) — demos are worked examples; the lab and homework are fresh builds.
