# Week 3 Demo Script — CommonGrounds goes dynamic

Terminal + VS Code cue sheet, in lecture order, keyed to the slides. Type the *first* instance of every pattern; paste the rest from here.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-03/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

## 0 · Before class

- [ ] Scratch folder ready; Teaching profile; terminal font sized for the projector
- [ ] Azure app name chosen (`cg-web-XXXX`); logged out of `az` if demoing the login
- [ ] [Coffee page](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/) open in a tab for §1

## 1 · Real HTTP in DevTools *(slide 5)*

- [ ] On the hosted coffee page: F12 → **Network** → refresh
- [ ] Click the first request → **Headers**: there's the verb, path, status, `content-type: text/html`
- [ ] Status says **`304` instead of `200`?** Even better — that's the browser asking "changed since last time?" and the server answering "use your cached copy" (no body sent). Hard-refresh (**Ctrl/Cmd+Shift+R**) to force a full `200` — show both, name the difference
- [ ] Click a CSS file's request: same anatomy, different `Content-Type` — *everything* is this exchange
- [ ] Type a garbage path (`…/demo/nope.html`) → **404** in the list, red. "Status codes are clue #1"
- [ ] **✓ say it:** two weeks of 'the browser asks' — tonight we build the thing that *answers*

## 2 · Create it, run it, tour it *(slides 6–8)*

- [ ] VS Code → File → Open Folder → create a new empty **CommonGrounds.Web** (in the scratch area) and open it
- [ ] Integrated terminal:
  ```bash
  dotnet new mvc --no-https
  dotnet watch
  ```
- [ ] Browser opens → a working, styled site from three commands. Let that breathe
- [ ] **Anatomy tour in VS Code** (keep `dotnet watch` running): `Controllers/HomeController.cs` → `Views/Home/` → `Views/Shared/_Layout.cshtml` (point at the navbar markup — "week 2 classes, recognize them?") → `wwwroot/lib/bootstrap` ("the *locally bundled* delivery I promised")
- [ ] Prove the loop: in `Views/Home/Index.cshtml` change `Welcome` → `Common Grounds, now with a server` → save → browser refreshes itself (`dotnet watch`!)
- [ ] Open `Program.cs`, narrate the **five acts** (notes Part 2 has the script): shopping list → build → the gauntlet → **the map (drumroll)** → open the doors. Mention the `partial class Program` coda only if someone asks
- [ ] **✓ CHECKPOINT:** app running, room has seen every folder earn its name

## 3 · The MVC journey: Menu + a parameter *(slides 9–13)*

- [ ] Predict-then-run the routing table with URLs in the browser: `/` · `/Home/Privacy` · then `/Menu` → **404!** ("no `MenuController` exists — yet")
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

- [ ] (If demoing login) `az login` → school account → subscription table prints
- [ ] Stop `dotnet watch`. From **inside** `CommonGrounds.Web/`:
  ```bash
  az webapp up --name cg-web-XXXX --sku F1 \
    --runtime DOTNETCORE:10.0 --location northcentralus
  ```
- [ ] While it churns (~2–3 min), narrate what it's doing: zip → ship → a managed Linux server gets your app. Students start [deploy-guide](../deploy-guide.md) steps 1–2 now
- [ ] URL prints → open it → **`/Menu/Special?item=victory`** on the projector
- [ ] **✓ the moment:** phones out — everyone loads *your* URL. C# they watched being written, answering the whole room's requests
- [ ] Segue to lab: "your turn — First Flight, six checks, same moves"
