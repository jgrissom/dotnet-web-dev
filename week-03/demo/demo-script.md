# Week 3 Demo Script — CommonGrounds goes dynamic

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-03/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it's due. Everything that isn't a 🎞️ line happens in the other state, so **you don't need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

## 0 · Before class

**The set, at curtain:**

```
dotnet-web-dev-course-trial/
└─ instructor/
   └─ week-03/                 ← EMPTY. §2 creates CommonGrounds.Web in it, live
```

Tonight's app does not exist yet — building it in front of the room *is* §2. **Every week keeps its own folder here**, so nothing is ever deleted to make room for the next one.

- [ ] **Make tonight's folder** (harmless if it's already there):
  ```bash
  mkdir -p ~/Repos/dotnet-web-dev-course-trial/instructor/week-03
  ```
- [ ] ⚠️ **Rehearsed already? Clear just this week's app**, or §2's `dotnet new mvc` refuses a folder that already holds a project:
  ```bash
  rm -rf ~/Repos/dotnet-web-dev-course-trial/instructor/week-03/CommonGrounds.Web
  ```
  💡 **Check it took:** `ls ~/Repos/dotnet-web-dev-course-trial/instructor/week-03` prints nothing.
- [ ] **Have VS Code's Open Folder dialog land somewhere sane** — open `~/Repos/dotnet-web-dev-course-trial/instructor/week-03` once beforehand so the picker starts there in §2 and you aren't navigating your home directory on the projector
- [ ] **Teaching profile in VS Code** (gear, bottom-left → **Profiles** → *Teaching*): C# and mssql extensions only, **no C# Dev Kit** — so your editor matches theirs pixel for pixel, with no Solution Explorer they don't have. Bump both font sizes **in that profile** so they stick: `terminal.integrated.fontSize` (start around **18** — §2 and §4 are read from the terminal all night) and `editor.fontSize` (around **16**)
- [ ] **Say it before you start: *"lids down for this part — everything I do to CommonGrounds, you'll do to First Flight in the lab."*** You build *CommonGrounds*; their lab is *First Flight*. **The predict-then-run beats are where they participate**
- [ ] Azure app name chosen (`cg-web-XXXX`); logged out of `az` if demoing the login
- [ ] [Coffee page](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/) open in a tab for §1

## 1 · Real HTTP in DevTools *(slides 2–5)*

### The exchange, live

- [ ] 🎞️ **GO TO SLIDE 2** — *Tonight: the pivot*
- [ ] **Land the word *pivot*:** *"two weeks on the client. Tonight we build the thing that answers it — and everything from here is the right-hand side"*
- [ ] 🎞️ **GO TO SLIDE 3** — *HTTP is just text*
- [ ] **The slide is the wire; the panel is a picture of it:** *"that is what actually travels — a verb and a path going out, a status and a body coming back. Everything I am about to open in DevTools is a nicer drawing of exactly these two blocks"*
- [ ] On the hosted coffee page: F12 → **Network** → refresh

### Verbs and status codes

- [ ] 🎞️ **GO TO SLIDE 4** — *Verbs*, then find the verb live in the panel
- [ ] **The third column is a calendar — say it:** *"every request in that panel tonight is a GET. POST turns up in week 6 when we build forms, and PUT and DELETE not until the Web API in week 14. One verb carries the whole night"*
- [ ] Click the first request → **Headers**: there's the verb, path, status, `content-type: text/html`
- [ ] 🎞️ **GO TO SLIDE 5** — *Status codes*
- [ ] **Read the right-hand column, not the codes:** *"two of these are promises. There will be a 404 tonight and I will cause it on purpose. And a 500 means my C# threw — that one is always mine, never the browser's"*
- [ ] Status says **`304` instead of `200`?** Even better — that's the browser asking "changed since last time?" and the server answering "use your cached copy" (no body sent). Hard-refresh (**Ctrl/Cmd+Shift+R**) to force a full `200` — show both, name the difference
- [ ] Click a CSS file's request: same anatomy, different `Content-Type` — *everything* is this exchange
- [ ] Type a garbage path (`…/demo/nope.html`) → **404** in the list, red. "Status codes are clue #1"
- [ ] **✓ say it:** two weeks of 'the browser asks' — tonight we build the thing that *answers*

## 2 · Create it, run it, tour it *(slides 6–8)*

### Two commands

- [ ] 🎞️ **GO TO SLIDE 6** — *Two commands to a working site*
- [ ] **The second command is the one that changes the day:** *"`dotnet new mvc` builds it, `dotnet watch` runs it and restarts on every save. If you used Live Server last week, it is that loop, ported to C#. And read the first bullet — a styled, working site before either of us writes a line"*
- [ ] VS Code → File → Open Folder → in `~/Repos/dotnet-web-dev-course-trial/instructor/week-03`, create a new empty **CommonGrounds.Web** and open it
- [ ] Integrated terminal:
  ```bash
  dotnet new mvc --no-https
  dotnet watch
  ```
- [ ] Browser opens → a working, styled site from **two commands**. Let that breathe *(the slide behind you says two — don't say three)*

### The anatomy tour

- [ ] 🎞️ **GO TO SLIDE 7** — *Project anatomy*. The folder map is on it; now walk the real thing
- [ ] **Anatomy tour in VS Code** (keep `dotnet watch` running): `Controllers/HomeController.cs` → `Views/Home/` → `Views/Shared/_Layout.cshtml` (point at the navbar markup — "week 2 classes, recognize them?") → `wwwroot/lib/bootstrap` ("the *locally bundled* delivery I promised")
- [ ] Prove the loop: in `Views/Home/Index.cshtml` change `Welcome` → `Common Grounds, now with a server` → save → browser refreshes itself (`dotnet watch`!)

### Program.cs, five acts

- [ ] 🎞️ **GO TO SLIDE 8** — *`Program.cs` — a five-act story*
- [ ] **Point at the five numbers on the slide first**, then open the real file and walk them. *"Five acts. Every ASP.NET app you ever open starts with these"*
- [ ] Open `Program.cs`, narrate the **five acts** — full script below; point at `builder.Build()` as the dividing line ("above: describing an app · below: configuring a real one")

  <details><summary>🎭 The five-act narration (read-aloud)</summary>

  1. **The shopping list** (`CreateBuilder` → `AddControllersWithViews`) — "we're starting a list of what this app will need; MVC goes on the list. Nothing is running — this is a recipe."
  2. **Build the machine** (`builder.Build()`) — "now a real web server is assembled from that list. Everything below configures a machine that exists."
  3. **The gauntlet** — "every request walks this pipeline in order. In *production* a crash shows a friendly error page — in dev you *want* the raw stack trace, that's the `if`. `UseRouting` reads the URL and decides where it's headed. `UseAuthorization` is the bouncer — bored until week 11, nobody has badges yet. `MapStaticAssets`: asking for a file in `wwwroot`? Just hand it over — that's how Bootstrap's CSS gets served with zero C#."
  4. **The map** 🥁 — "`MapControllerRoute` — the headliner. This one `pattern` turns URLs into method calls. The rest of tonight lives inside those braces."
  5. **Open the doors** (`app.Run()`) — "start listening, forever. Everything above was setup; this line *is* the server."

  *(**Not in this file** — a fresh `dotnet new mvc` has no `public partial class Program { }`. Their **lab starter** does, and the lab README tells them to leave it alone, so expect the question during the lab rather than here: "it lets the checks project see the app.")*

  </details>
- [ ] **✓ CHECKPOINT:** app running, room has seen every folder earn its name

## 3 · The MVC journey: Menu + a parameter *(slides 9–13)*

### Routing, predicted

- [ ] 🎞️ **GO TO SLIDE 9** — *The request's journey*
- [ ] 🎯 **Trace the arrow with your finger — this is the whole night in one picture:** *"URL comes in, routing picks a method, the method picks a view, HTML goes out. Everything after tonight is detail on top of this"*
- [ ] 🎞️ **GO TO SLIDE 10** — *Routing: the pattern decoded*. **The slide is the exercise** — ask each URL off it before you type it
- [ ] Predict-then-run the routing table with URLs in the browser: `/` · `/Home/Privacy` · then `/Menu` → **404!** ("no `MenuController` exists — yet")

### The controller

- [ ] 🎞️ **GO TO SLIDE 11** — *Controllers and actions*
- [ ] **Two bullets, and the second is the one that matters:** *"an action is just a public method. And there is no wiring, no registration, no config file — convention over configuration. That word `Menu` in the URL is what finds this class"*
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
- [ ] **Point at the `@`** — *"that is the only new character on the slide. Everything around it is ordinary HTML"*
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
- [ ] **Point at the parameter and the `??`** — *"the name in the query string has to match the name of the parameter. That is the entire mechanism, and the `??` is what makes it optional"*
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
- [ ] 🎯 **The one-line difference is the whole reason for tonight:** *"GitHub Pages handed out files. App Service runs the C# — same kind of public URL, but now there is a process on the other end executing a method every time somebody asks"*
- [ ] (If demoing login) `az login` → school account → subscription table prints

### az webapp up

- [ ] 🎞️ **GO TO SLIDE 15** — *One command to the cloud*
- [ ] ⚠️ **Read the comment on the first line out loud before anything else:** *"inside the web project folder. `az webapp up` ships the folder you are standing in, and standing in the wrong one is the single most common way this goes wrong"*
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
- [ ] Show **what done looks like** — the answer key **on your own machine**: `week-03/lab/solution`, `dotnet run` from `FirstFlight.Web`, then `dotnet test FirstFlight.Checks` from the folder above it, printing **6 / 6**. ~90 seconds, a target not a walkthrough. **Nothing is deployed for this** — the Azure URL from §4 is mine; theirs is the homework
- [ ] **Name tonight's target off the slide:** *"six checks, and the first one is free — it only proves the harness runs. Tonight I want you at four. Five, six and the deploy are the homework, by design"*

## 6 · Wrap-up, after the lab *(slides 17–18)*

- [ ] 🎞️ **GO TO SLIDE 17** — *Before next week*. The homework and the reading
- [ ] **Land the last line:** *"the Cryptid Registry you built out of flat HTML in week 2 — next week you build it again in C#, and this time the pages come off a model"*
- [ ] 🎞️ **GO TO SLIDE 18** — *The semester, from tonight's summit*. Where the next thirteen weeks go
- [ ] 🎯 **Trace the chain, then land the last line:** *"browser, HTTP, routing, C#, HTML, Azure — every link in that chain ran on screen tonight, and the last one is your homework. Week 7 adds a database. Everything between here and there is refinement of a pipeline you have already watched work"*
