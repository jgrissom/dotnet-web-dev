# Week 3 — Lesson Plan

**Topic:** How the web works; first ASP.NET Core MVC app; first Azure deploy
**Session length:** 3h 45m

> The pivot night: the biggest conceptual jump of the semester (client → server). Every segment ends with something *visibly working* — the demo app running, a URL binding to a method, code live on the internet. Momentum is the pedagogy tonight.

## Learning objectives

By the end of this session, students can:

1. Describe an HTTP request/response (verb, path, status code, body) and read one in DevTools.
2. Create and run an ASP.NET Core MVC app with `dotnet new mvc` / `dotnet watch`.
3. Trace a URL through the default route to a controller action and its view.
4. Add an action + view, and read a query parameter into an action.
5. Deploy an app to Azure App Service with `az webapp up`.

## Materials

- `slides.md` / `slides.html` — the deck (hosted at jgrissom.github.io/dotnet-web-dev)
- `lecture-notes.md` on your second screen — the script, with the troubleshooting appendix
- **Demo cue sheet:** [`demo/demo-script.md`](demo/demo-script.md) — keyed to slides ([clickable version](https://jgrissom.github.io/dotnet-web-dev/week-03/demo/script.html))
- [`deploy-guide.md`](deploy-guide.md) URL ready to put on screen for the Azure segment
- Terminal + VS Code (Teaching profile) ready; a scratch folder for the demo app
- Azure logged **out** before class if you want to demo the login flow honestly

## Timed agenda

| Time | Duration | Segment |
|------|----------|---------|
| 0:00 | 10 min | **Portfolio gallery walk** *(deck on title slide)*. 3–4 student portfolio URLs on the projector — themes and fonts make this one fun. Quietly collect anyone whose Azure activation (week 2 homework) failed; they pair with a neighbor for tonight's deploy segment. |
| 0:10 | 30 min | **How the web actually works** *(slides 3–5, demo §1)*. HTTP as text: request anatomy, response anatomy, verbs, status codes. Then DevTools Network tab on the hosted coffee page — real headers, real status codes. Land: 404 = routing, 500 = your code. |
| 0:40 | 40 min | **Your first server-side app** *(slides 6–8, demo §2)*. `dotnet new mvc` → `dotnet watch` → working site. Anatomy tour (Controllers, Views, wwwroot — wave at bundled Bootstrap). Program.cs read as a story; the `pattern` line gets its drumroll. |
| 1:20 | 10 min | **☕ Break** |
| 1:30 | 45 min | **The MVC pattern** *(slides 9–13, demo §3)*. The request's journey; routing table with predict-then-run URLs (include a 404); controllers/actions; Razor first taste + View Source proof; a parameter-reading action. This is the load-bearing segment — protect it. |
| 2:15 | 10 min | **☕ Break** |
| 2:25 | 35 min | **To the cloud** *(slides 14–15, demo §4)*. What App Service is; then you deploy the demo app **live** while students work [`deploy-guide.md`](deploy-guide.md) steps 1–2 (install `az`, login) on their own machines. End with the demo app's Azure URL on screen — and phones out, everyone loads it. **Start a visible "working regions" list** (board/shared doc) — region availability varies per subscription, and the class crowd-sources the good ones within a week. |
| 3:00 | 35 min | **Lab: First Flight** *(slide 16)*. Launch with ~90 seconds of *what done looks like*: your finished copy running + `dotnet test` printing **6 / 6** — a target, not a walkthrough. **In-class target: checks 1–4 green** (brand, About, nav). Checks 5–6 and the deploy roll into homework by design — say so. |
| 3:35 | 10 min | **Wrap-up** *(slides 17–18)*. Homework: 6/6 + deploy + URL via Canvas. The summit slide: they now own the whole pipeline — browser → HTTP → routing → C# → HTML → Azure. |

## Instructor notes

- Demo from your **Teaching profile**; terminal font up for the projector. The demo app (`CommonGrounds.Web`) is created live in a scratch folder — different content from the lab on purpose.
- **The Azure segment is the riskiest 35 minutes** (network, logins, name collisions). Your deploy happens first so the room sees success before attempting theirs; students only *install + login* in class — their own deploy is homework via the guide. If the classroom network fights `az login`, fall back to hotspot for the demo and move on.
- Free-tier cold starts: the deployed app's first load can take ~30s. Deploy early in the segment, keep talking, refresh when it's warm.
- The lab starter is two project folders side by side (no solution file — folders all the way down, like everything else). Students open the parent folder and run `dotnet test FirstFlight.Checks` from there; `dotnet watch` runs from inside `FirstFlight.Web`.
- If time runs short: the summit slide (18) survives anything; the lab can start at check 1 with as little as 25 minutes and still land the red-to-green habit.
