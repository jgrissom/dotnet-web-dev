# Week 2 Demo Script — building Common Grounds live

Beat-by-beat cue sheet for building Common Grounds live, in lecture order, keyed to the slides. **You do not hand-edit the file tonight** — the [step page](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/steps.html) shows each change as a diff and hands you the whole file to paste. This sheet is what you *say*; see §0.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/script.html) has working checkboxes that survive refreshes — keep it open on your second screen and tick as you go (Reset button at the top for next time).

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **VS Code and the browser side by side** (so the editor, the page and the terminal are all visible together — those never need a swipe between them). This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions and no cue that means "not yet" — if a slide would give away a punchline, its cue is further down, at the moment it's due. Everything that isn't a 🎞️ line happens in the other state, so **you don't need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to, so you can go the other way too.

## 0 · Before class

**🖥️ On screen, at curtain** *(what the checklist below adds up to — none of it exists until you run it)* — the projector's second state, side by side:

- **VS Code**, left half — `~/Repos/dotnet-web-dev-course/instructor/week-02/scratch.html`, in the Teaching profile
- **Browser**, right half — that same `scratch.html` opened from disk, so the page updates beside the editor. Behind it: the hosted *before* / *after* pages for the opening pitch, and the step page the room looks at

- [ ] **Make tonight's canvas** — one command. The `git show` half must run in the **course repo** `dotnet-web-dev` (not `dotnet-web`, the student folder — the `w02-step-*` tags live in the course repo and nowhere else); it writes the canvas out to `instructor/week-02/`, where every other week's demo lives:

  ```bash
  cd ~/Repos/dotnet-web-dev && mkdir -p ~/Repos/dotnet-web-dev-course/instructor/week-02 && git show w02-step-00:week-02/demo/index.html > ~/Repos/dotnet-web-dev-course/instructor/week-02/scratch.html
  ```

  Open that **`scratch.html`** in VS Code (Teaching profile), browser at half-width
  - ⚠️ **You never open `index.html`, and now you're never near it.** That file is what CI publishes as tonight's [before](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/before.html) page — a stray edit republishes a half-Bootstrapped "before" picture and the opening pitch is gone for good. Teaching out of `instructor/week-02/` means the file you edit isn't in the same folder as the one you must not touch
- [ ] **Say it before you start: *"lids down for this part — everything I do to this page, you'll do to the Cryptid Registry in the lab."*** You assemble the coffee shop; their lab is the Registry. Same patterns, fresh retrieval — which only works if they aren't typing along with you
- [ ] Hosted [before](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/before.html) / [after](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/) open in two tabs for the opening pitch
- [ ] **Open the step page** (below) and press `Home` — it remembers where you last were

### 📽️ The step page is what the room looks at

**[jgrissom.github.io/dotnet-web-dev/week-02/demo/steps.html](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/steps.html)** — one screen per beat, that beat's change as a red/green diff in projector type, `←` `→` to move.

The loop for every code beat is the same three moves:

1. **Show the diff** on the step page and talk to it — the talking points are in this sheet, under the matching beat.
2. **Copy whole file** (the blue button) — it puts that step's *entire* file on the clipboard, not the diff.
3. **Select all in `scratch.html`, paste, save.** The page updates in the browser beside it.

Nobody hunts for an insertion point, and the room sees the change isolated and labeled instead of buried in a file. Two of the twenty-seven steps show only the head of a long diff — the note says so on screen, and the button still copies the whole file.

⚠️ **The page remembers where you were** (per-browser). Before class, press `Home` to get back to step 1.

### 🛟 If it still goes wrong

**One command, and it never touches `index.html`.** Every beat is also a commit on the `demo/week-02` branch. The `git show` half runs in the **course repo** `dotnet-web-dev`, on `main`, without switching branches:

```bash
cd ~/Repos/dotnet-web-dev && git show w02-step-11:week-02/demo/index.html > ~/Repos/dotnet-web-dev-course/instructor/week-02/scratch.html
```

That overwrites your canvas with the state **after** that step. Save, refresh, carry on from the next beat. It writes outside the repo, so nothing here dirties the tree.

The number is the only thing you change. These are the ones worth memorising — the end of each section, so you can abandon a beat that is fighting you and rejoin at the next one:

| Jump to | You get |
|---|---|
| `w02-step-04` | after the hero |
| `w02-step-08` | after the feature row |
| `w02-step-09` | after the navbar |
| `w02-step-12` | after the menu cards |
| `w02-step-16` | after the form |
| `w02-step-19` | after the icons |
| `w02-step-23` | themed, on Lux |
| `w02-step-27` | the finished page |

Every individual step is also browsable as a red/green diff at [the commit list](https://github.com/jgrissom/dotnet-web-dev/commits/demo/week-02) — that is the whole demo, one commit per beat, in order.

## 0b · The opening pitch *(slides 2–4)*

- [ ] 🎞️ **GO TO SLIDE 2** — *Tonight*
- [ ] Read the six items, **don't dwell** — and land the last one: *"it ends with the site public on the internet. By the end of tonight you have something styled you would actually show someone"*
- [ ] 🎞️ **GO TO SLIDE 3** — *Why a CSS framework?*
- [ ] 🎯 **Land the two on the list nobody can show you:** *"spacing and responsive you are about to watch me do. Accessible components and browser quirks are the two you never see — already solved, by people who do this full time. This you get for free"*
- [ ] Then flip between the **before** and **after** tabs — same content, transformed almost entirely by classes
- [ ] 🎞️ **GO TO SLIDE 4** — *Setup: two tags via CDN*
- [ ] 🎯 **The two tags do different jobs — say which:** *"the top one is the look. The bottom one is the behavior, and everything that moves tonight comes from it. You need both for bootstrap to work properly"* — this is the #1 lab bug, and it gets said again at the lab launch
- [ ] Then swipe and point at the same two tags already sitting in your scratch copy

## 1 · The grid *(slides 5–7)*

> [!TIP]
> **Every step below is: show the diff → talk → Copy whole file → select all in `scratch.html`, paste, save.** The step page is on the projector; this sheet is not.

### Container and hero

- [ ] 🎞️ **GO TO SLIDE 5** — *The grid: 12 columns, 6 breakpoints*
- [ ] 🎯 **The one rule the whole grid rests on:** *"every row is twelve units wide. Always twelve. Eight and four on the slide — that is a full row. Add up past twelve and the extra wraps onto the next line, which is the rule working, not a bug"* — the 8/4 split lives only on this slide; the demo builds thirds
- [ ] **Step 1 — `<main>` gets a container.** One class, and the whole page stops hugging the edges. *"That is the first one. One class, and everything has margins"*
- [ ] **First time you say "hero", define it:** *"hero is the designer's word for the big opening band of a page. It is not an HTML tag — tonight it happens to sit inside the `<header>`"*
- [ ] **Step 2 — the hero gets its band.** *"The `<header>` sits *outside* `<main>`, so the tint runs edge to edge"*
- [ ] **Step 3 — wrap the hero's three children in a container.** *"Same class as `<main>` got. The band stays full width; the words line up with everything below"*
- [ ] **Step 4 — three classes on the three elements.** `display-4`, `lead text-muted`, `btn btn-primary btn-lg`
- [ ] **✓ it suddenly looks like a website** — pause and enjoy the reaction. This is the payoff slide of the whole night

### The feature row

- [ ] 🎞️ **GO TO SLIDE 6** — *Breakpoints*
- [ ] 🎯 **Read the table once — it is the only airing these numbers get tonight:** *"mobile-first means no prefix applies everywhere, and a prefix only adds behavior as the screen gets wider. `md` is 768 pixels — and every single column I write tonight has `md` in it"*
- [ ] **Step 5 — wrap the three `<section>`s in a row.** Nothing inside them changes yet; the wrapper goes around the lot
- [ ] 🎞️ **GO TO SLIDE 7** — *Reading a column recipe*. *"We are defining styles for phones, tablets and laptops with the classes from left to right."* Read the slide's `col-12 col-md-6 col-lg-4` left to right, then apply that same reading to the shorter `col-md-4` in the next step: full width on phones, one third from `md` up
- [ ] **Step 6 — the sections become columns.** Three identical class additions
  - *(optional, 20 seconds)* If you want to show **multi-cursor** rather than paste it: select `<section>`, **Ctrl+Shift+L** (**Cmd+Shift+L**) puts a cursor on every match, type once. Students love this one, and it is the only place tonight it fits
- [ ] **Step 7 — the headings.** `fs-4` — *"a heading is only big because of a class, so make it the size you want"*
- [ ] **Step 8 — the paragraphs.** `text-muted`
- [ ] **✓ CHECKPOINT: resize slowly** — stacked on phone → thirds on desktop. This *is* the responsive lecture

## 2 · Components *(slides 8–11)*

### Navbar — from the docs, live

- [ ] 🎞️ **GO TO SLIDE 8** — *Components: assembled from the docs*
- [ ] 🎯 **Land the numbered workflow — it is the actual skill tonight, not the class names:** *"use the documentation, copy the example, adapt it. That is still what I do. Nobody memorizes Bootstrap"*
- [ ] **Do this one in the browser first, because the docs visit IS the lesson.** Open [docs → Navbar](https://getbootstrap.com/docs/5.3/components/navbar/), scroll to the example **with a toggler**, and say what you would change: brand, three links, and the breakpoint
- [ ] Point at the matched pair the docs example ships with — the toggler's `data-bs-target="#..."` and the collapse div's `id="..."`. **Always change both halves together**; a mismatch is a silently dead hamburger
- [ ] **Step 9 — the adapted navbar.** Say what changed from the docs copy: *"`expand-lg` became `expand-md` so the hamburger shows up sooner, `bg-body-tertiary` became `bg-dark`, and `data-bs-theme` is an attribute rather than a class"*
- [ ] **✓ shrink the window** — hamburger appears and *works*; point at the JS bundle `<script>` that makes it work
- [ ] *(optional theater)* comment the bundle out → dead hamburger → uncomment. The #1 lab bug, pre-lived

### Menu cards

- [ ] 🎞️ **GO TO SLIDE 9** — *Cards in a grid*
- [ ] 🎯 **Say where this ends up — the file can never show it:** *"with static content, we are creating 6 individual cards. In week 4 this block gets written once — one loop, six cards. In week 7 the six stop being typed at all and come out of a database, one card per row. Every list page in the back half of this course follows this pattern"*
- [ ] **Step 10 — the menu heading, and a row around the six articles.** Same wrapper move as the feature row
- [ ] **Step 11 — the Espresso card.** This is the one to slow down on. Read the diff outward: *"the article is still the article. It gained `card h-100` (height-100), its contents moved inside a `card-body`, and the whole thing sits in a column. The `<span>` that said hot is now a badge — one class"*
- [ ] **Step 12 — the other five.** *"Same shape, five more times."* The diff shows the first and last; nobody needs the middle
- [ ] **✓ resize:** 1 → 2 → 3 columns; `h-100` keeps the heights even

### Form

- [ ] **Step 13 — the contact heading and the alert.** The alert is the week-6 promise: *"this form does not do anything tonight. It starts working in week 6"*
- [ ] **Step 14 — the form goes in a `col-md-8`.** *"The column is what stops a text input stretching across a 27-inch monitor"*
- [ ] **Step 15 — the first field.** *"Here we are applying style to our form fields."* Slow down here too: `form-label` on the label, `form-control` on the input, both inside an `mb-3` spacer. Note the `for`/`id` pair was already there — **that is plain HTML accessibility, not Bootstrap**
- [ ] **Step 16 — the rest of the fields.** `form-select` on the dropdown, `btn btn-primary` on the button. Same three-part shape each time

### Footer & polish

- [ ] 🎞️ **GO TO SLIDE 10** — *Utilities: the classes that replace custom CSS*
- [ ] 🎯 **Read the last line off the slide — it is a lab rule with points on it:** *"if you are writing custom CSS for spacing or alignment, there is almost certainly a utility for it already. Use the styling provided by bootstrap."*
- [ ] **Step 17 — the footer and both back-to-top lines.** Every class in this step is a utility: `text-center`, `text-muted`, `py-4`, `border-top`, `mb-0`, `text-end`, `mt-3`, `text-decoration-none`. *"Eight classes, no CSS file"*

### Icons *(slide 11)*

- [ ] 🎞️ **GO TO SLIDE 11** — *Icons: Bootstrap Icons*
- [ ] *"One more `<link>`, same CDN pattern as the top of the night. Two thousand icons and not a single image file to download"*
- [ ] **Step 18 — the icons link, plus an `<i>` in the hero button and the footer.** Point out that the icon is *inside* the button, before the text
- [ ] **Step 19 — the showpiece: one icon above each feature heading.** `fs-1` sizes it and `text-danger` colors it — **the same text utilities from two steps ago**
- [ ] **✓ say it:** *"two utility classes turn a character into artwork. They are font glyphs, so everything you know about styling text already works on them"*

## 3 · Bootswatch *(slide 12)*

- [ ] 🎞️ **GO TO SLIDE 12** — *Bootswatch: stop looking like every Bootstrap site*
- [ ] 🎯 **Point at the one line on the slide — the CSS link:** *"the whole site re-skins onto a different palette, different type, different button shapes, and that link is the only line that changes. That is what a framework buys you"*
- [ ] Show the gallery at [bootswatch.com](https://bootswatch.com) — this is where "take requests" shops
- [ ] **Step 20 — Flatly.** The diff is **one line**. Say that before you paste it, then refresh and let the reaction land
- [ ] **Steps 21, 22, 23 — Darkly, Sketchy, Lux.** Run these fast, back to back — each diff is **one word**. Sketchy gets the laugh; take a request between them if the room shouts one
- [ ] **✓ say it:** *"nothing else changed. Same classes, same markup, same docs — I only swapped a word in a URL"*
- [ ] **Step 24 — dark mode, one attribute.** `data-bs-theme="dark"` on `<html>`. Say *"the toggle button is a lab stretch goal, three lines of week-1 JavaScript"*
- [ ] **✓ let them spot it — don't tell them.** The hero is still a glowing light band. Wait for someone to say it. *"Why is that one bit still bright?"* — `bg-light` means **literally light, in every theme**. It said so all along
- [ ] **Step 25 — the fix.** *"bg-body-tertiary is slightly offset from the page background"*, so it follows the theme. **Semantic names beat literal names, part two** — same argument as `btn-primary` rather than `btn-blue`
- [ ] **Step 26 — back to light.** The hero now behaves in both. *"One attribute, and the whole page has two looks"*
- [ ] Bonus if anyone asks about icon colors: `text-primary` under Lux is **near-black** — a `text-primary` icon would vanish in dark mode. Semantic colors belong to the *theme*; that is the feature working as designed

## 4 · Google Fonts *(slide 13)*

- [ ] 🎞️ **GO TO SLIDE 13** — *Google Fonts: the finishing move*
- [ ] 🎯 **The concept before the shopping trip:** *"Bootstrap keeps its font in a CSS variable, so you never fight it — you set the variable and the whole site follows. Two families maximum, and only the weights you use."*
- [ ] On [fonts.google.com](https://fonts.google.com): pick **Lora** (400 + 700) and show the `<link>` it generates
  — *(deliberately a serif: Lux's own font is Nunito Sans, so a sans swap would be invisible — pick something the room can SEE)*
- [ ] **Step 27 — the font link and the variable override.** *"One link, one variable. Everything downstream follows"*
- [ ] **✓ prove it applied:** DevTools → select a paragraph → **Computed** → *Rendered Fonts* at the bottom says `Lora`. (Also show the Network tab's `fonts.gstatic.com` request — that is the font arriving.) This is how you check ANY font question forever
- [ ] **✓ FINAL CHECKPOINT** — your page matches the hosted [after](https://jgrissom.github.io/dotnet-web-dev/week-02/demo/). Leave both on screen going into the lab launch

## 5 · Hand off to the lab *(slide 14)*

- [ ] 🎞️ **GO TO SLIDE 14** — *Lab: The Cryptid Registry*. Leave it up for the whole lab; it's the task list
- [ ] Show **what done looks like** — the answer key **opened from disk on your own machine**: `week-02/lab/solution` in the answer-keys repo, `index.html` in the browser. Resize once so the navbar collapses, click through all three pages. ~90 seconds, a target not a walkthrough — **don't show the markup**. **Nothing is deployed for this** — GitHub Pages is their homework, not tonight
- [ ] Setup on screen, said once: **`git -C dotnet-web-starters pull` → copy the `week-02` folder out, next to the clone → rename the copy `cryptid-registry` → stay in `dotnet-web` and work there**. Why the rename: *"tonight's homework pushes this folder to a repo called `cryptid-registry` — same name, so nothing gets confusing later"*
- [ ] Say plainly: **the checker is already wired into all three pages.** F12 on any page and it scores that page — *"work one ❌ at a time, and check all three; each page has its own list"*
- [ ] **In-class target: `index.html` fully green, plus that navbar copied to the other two pages.** The projects grid, the contact form and make-it-yours roll into homework Part 1 **by design** — say so out loud, so nobody reads a half-finished site as falling behind

## 6 · Wrap-up, after the lab *(slide 15)*

- [ ] 🎞️ **GO TO SLIDE 15** — *Before next week*. The homework, the deploy, and the reading
