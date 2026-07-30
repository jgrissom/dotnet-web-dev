# Week 3 Demo Script — CommonGrounds goes dynamic

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-03/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> The projector has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it's due. Everything that isn't a 🎞️ line happens in the other state, so **you don't need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

## 0 · Before class

- [ ] Scratch folder ready; Teaching profile; terminal font sized for the projector
- [ ] **Say it before you start: *"lids down for this part — you'll build your own in the lab."*** You build *CommonGrounds*; their lab is *First Flight*. **The predict-then-run beats are where they participate**
- [ ] Azure app name chosen (`cg-web-XXXX`); logged out of `az` if demoing the login
- [ ] [Coffee page](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/) open in a tab for §1

## 1 · Real HTTP in DevTools *(slides 2–5)*

### The exchange, live

- [ ] 🎞️ **GO TO SLIDE 2** — *Tonight: the pivot*
- [ ] 🎞️ **GO TO SLIDE 3** — *HTTP is just text*
- [ ] On the hosted coffee page: F12 → **Network** → refresh
### Verbs and status codes

- [ ] 🎞️ **GO TO SLIDE 4** — *Verbs*, then find the verb live in the panel
- [ ] Click the first request → **Headers**: there's the verb, path, status, `content-type: text/html`
- [ ] 🎞️ **GO TO SLIDE 5** — *Status codes*
- [ ] Status says **`304` instead of `200`?** Even better — that's the browser asking "changed since last time?" and the server answering "use your cached copy" (no body sent). Hard-refresh (**Ctrl/Cmd+Shift+R**) to force a full `200` — show both, name the difference
- [ ] Click a CSS file's request: same anatomy, different `Content-Type` — *everything* is this exchange
- [ ] Type a garbage path (`…/demo/nope.html`) → **404** in the list, red. "Status codes are clue #1"
- [ ] **✓ say it:** two weeks of 'the browser asks' — tonight we build the thing that *answers*

## 2 · Create it, run it, tour it *(slides 6–8)*

### Two commands

- [ ] 🎞️ **GO TO SLIDE 6** — *Two commands to a working site*
- [ ] VS Code → File → Open Folder → create a new empty **CommonGrounds.Web** (in the scratch area) and open it
- [ ] Integrated terminal:
  ```bash
  dotnet new mvc --no-https
  dotnet watch
  ```
- [ ] Browser opens → a working, styled site from three commands. Let that breathe
### The anatomy tour

- [ ] 🎞️ **GO TO SLIDE 7** — *Project anatomy*. The folder map is on it; now walk the real thing
- [ ] **Anatomy tour in VS Code** (keep `dotnet watch` running): `Controllers/HomeController.cs` → `Views/Home/` → `Views/Shared/_Layout.cshtml` (point at the navbar markup — "week 2 classes, recognize them?") → `wwwroot/lib/bootstrap` ("the *locally bundled* delivery I promised")
- [ ] Prove the loop: in `Views/Home/Index.cshtml` change `Welcome` → `Common Grounds, now with a server` → save → browser refreshes itself (`dotnet watch`!)
### Program.cs, five acts

- [ ] 🎞️ **GO TO SLIDE 8** — *`Program.cs` — a five-act story*
- [ ] Open `Program.cs`, narrate the **five acts** — full script below; point at `builder.Build()` as the dividing line ("above: describing an app · below: configuring a real one")

  <details><summary>🎭 The five-act narration (read-aloud)</summary>

  1. **The shopping list** (`CreateBuilder` → `AddControllersWithViews`) — "we're starting a list of what this app will need; MVC goes on the list. Nothing is running — this is a recipe."
  2. **Build the machine** (`builder.Build()`) — "now a real web server is assembled from that list. Everything below configures a machine that exists."
  3. **The gauntlet** — "every request walks this pipeline in order. In *production* a crash shows a friendly error page — in dev you *want* the raw stack trace, that's the `if`. `UseRouting` reads the URL and decides where it's headed. `UseAuthorization` is the bouncer — bored until week 11, nobody has badges yet. `MapStaticAssets`: asking for a file in `wwwroot`? Just hand it over — that's how Bootstrap's CSS gets served with zero C#."
  4. **The map** 🥁 — "`MapControllerRoute` — the headliner. This one `pattern` turns URLs into method calls. The rest of tonight lives inside those braces."
  5. **Open the doors** (`app.Run()`) — "start listening, forever. Everything above was setup; this line *is* the server."

  *(The `partial class Program` coda: only if someone asks — "it lets the checks project see the app; leave it alone.")*

  </details>
- [ ] **✓ CHECKPOINT:** app running, room has seen every folder earn its name

## 3 · The MVC journey: Menu + a parameter *(slides 9–13)*

### Routing, predicted

- [ ] 🎞️ **GO TO SLIDE 9** — *The request's journey*
- [ ] 🎞️ **GO TO SLIDE 10** — *Routing: the pattern decoded*. **The slide is the exercise** — ask each URL off it before you type it
- [ ] Predict-then-run the routing table with URLs in the browser: `/` · `/Home/Privacy` · then `/Menu` → **404!** ("no `MenuController` exists — yet")
### The controller

- [ ] 🎞️ **GO TO SLIDE 11** — *Controllers and actions*
- [ ] Create `Controllers/MenuController.cs` — **type it**:
  ```csharp
  using Microsoft.AspNetCore.Mvc;

  namespace CommonGrounds.Web.Controllers;

  public class MenuController : Controller
  {
      public IActionResult Index()
      {
          ViewData["Title"] = "Menu";
          return View();
      }
  }
  ```
- [ ] Refresh `/Menu` → **500-ish error: no view.** Read the error out loud — it *tells you* where it looked. Convention, visible
### The view

- [ ] 🎞️ **GO TO SLIDE 12** — *Views and Razor — first taste*
- [ ] Create `Views/Menu/Index.cshtml` — **type it**:
  ```html
  @{
      ViewData["Title"] = "Menu";
  }
  <h1>Today's Menu</h1>
  <p>Espresso · Cold brew · Chai — proper data arrives in week 7.</p>
  ```
- [ ] `/Menu` works. **✓ say it:** URL → method → view, and nobody registered anything anywhere
- [ ] View Source on `/Menu`: no Razor in sight — the server rendered pure HTML
### A parameter

- [ ] 🎞️ **GO TO SLIDE 13** — *Passing data in*
- [ ] Add to `MenuController` — **type it**:
  ```csharp
  public IActionResult Special(string? item)
  {
      return Content($"Today's special: {item ?? "espresso"}!");
  }
  ```
- [ ] Predict-then-run: `/Menu/Special?item=chai` → `/Menu/Special` → `/Menu/Special?item=oat%20milk%20latte`
- [ ] **✓ CHECKPOINT:** the room can trace `?item=chai` from URL bar to `string? item` to the response

## 4 · Ship it *(slides 14–15)*

### What Azure is

- [ ] 🎞️ **GO TO SLIDE 14** — *Azure App Service*
- [ ] (If demoing login) `az login` → school account → subscription table prints
### az webapp up

- [ ] 🎞️ **GO TO SLIDE 15** — *One command to the cloud*
- [ ] Stop `dotnet watch`. From **inside** `CommonGrounds.Web/`:
  ```bash
  az webapp up --name cg-web-XXXX --sku F1 --os-type Linux \
    --runtime DOTNETCORE:10.0 --location northcentralus
  ```
- [ ] While it churns (~2–3 min), narrate what it's doing: zip → ship → a managed Linux server gets your app. Students start [deploy-guide](../deploy-guide.md) steps 1–2 now
- [ ] URL prints → open it → **`/Menu/Special?item=victory`** on the projector
- [ ] **✓ the moment:** phones out — everyone loads *your* URL. C# they watched being written, answering the whole room's requests
- [ ] Segue to lab: "your turn — First Flight, six checks, same moves"

## 5 · Hand off to the lab *(slide 16)*

- [ ] 🎞️ **GO TO SLIDE 16** — *Lab: First Flight*. Leave it up for the whole lab; it's the task list

## 6 · Wrap-up, after the lab *(slides 17–18)*

- [ ] 🎞️ **GO TO SLIDE 17** — *Before next week*. The homework and the reading
- [ ] 🎞️ **GO TO SLIDE 18** — *The semester, from tonight's summit*. Where the next thirteen weeks go
