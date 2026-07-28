# Week 3 — Hello, Server: HTTP, MVC & First Azure Deploy

The pivot night: HTTP demystified in DevTools, `dotnet new mvc` to a working server-side app, the URL→controller→view journey, and code live on Azure before the night ends. Lab is *First Flight* — the first `dotnet test` red-to-green build.

## Use in this order

| When | Document | What it is |
|------|----------|------------|
| Prep | 🗓️&nbsp;[lesson-⁠plan.md](lesson-plan.md) | Timed 3h45 agenda + instructor notes |
| Prep&nbsp;/⁠&nbsp;in-⁠class&nbsp;script | 📖&nbsp;[lecture-⁠notes.md](lecture-notes.md) | Full lecture content + **troubleshooting appendix** |
| Projected&nbsp;in&nbsp;class | 🎞️&nbsp;[slides.md](slides.md) | The deck (GFM, one slide per `##`) — [**present it live**](https://jgrissom.github.io/dotnet-web-dev/week-03/) (arrow keys, `F` for fullscreen) |
| In&nbsp;class,&nbsp;live-⁠coding | 🎨&nbsp;[demo/⁠](demo/) | *CommonGrounds.Web* built + deployed live (different content than the lab); [clickable cue sheet](https://jgrissom.github.io/dotnet-web-dev/week-03/demo/script.html) |
| Azure&nbsp;segment&nbsp;+&nbsp;homework | 🧭&nbsp;[deploy-⁠guide.md](deploy-guide.md) | Student walkthrough: install `az` → login → `az webapp up`, with ✓-checkpoints |
| In&nbsp;class,&nbsp;last&nbsp;35&nbsp;min | 🧪&nbsp;[lab/⁠](lab/) | *First Flight* — a solution with 6 `dotnet test` checks; 1/6 green out of the box (answer key in the private answer-keys repo) |
| With&nbsp;the&nbsp;homework | ✅&nbsp;[homework-⁠checks.js](homework-checks.js) | Student self-check for the **deployed** site — included via `<script>` tag; the same 6 points the grader awards |
| Assigned&nbsp;at&nbsp;wrap-⁠up | 📤&nbsp;[homework.md](homework.md) | 6/6 checks + GitHub repo + **deploy to Azure**, URL via Canvas |

## 📋 Before class, don't forget

- Know who failed Azure activation in week 2 — the 5-minute opener is triage, not a gallery *(showing student work starts in week 5)*
- Scratch folder + Azure app name ready for the demo (see [demo/README.md](demo/README.md))
- Know who failed Azure activation (week 2 homework screenshots) — pair them up for the deploy segment
- Remind students to `git pull` for the week-03 starter

**Prev:** [← Week 2 — Bootstrap](../week-02/README.md) · **Next:** [Week 4 — Routing & Razor →](../week-04/README.md)
