# Week 1 Demo Script — Setup, and the Dialect We Speak 🎨

Console + browser cue sheet, in lecture order, keyed to the slides. **Tonight has no app to build** — the canvas is the browser console and the hosted playground, and the teaching is calibration rather than instruction.

> [!TIP]
> **Clickable version:** [the hosted script](https://jgrissom.github.io/dotnet-web-dev/week-01/demo/script.html) — checkboxes survive refreshes; Reset button for next run.

> [!TIP]
> **This sheet is the running order. The deck is a prop it tells you to pick up.**
>
> What you are showing has two states and you swipe between them: **the slides**, or **the browser with its console open**. This sheet stays private on your laptop or tablet.
>
> **🎞️ means swipe to the slides.** Every 🎞️ line says the same thing: *put that slide up, talk to it.* There are no exceptions. Everything that isn't a 🎞️ line happens in the other state, so **you don't need a cue to come back** — the next ordinary bullet is what to do there.
>
> Lost your place? **The nearest 🎞️ above you is the slide that should be showing** — and every slide's footer names the section and beat of this sheet it belongs to.

> [!IMPORTANT]
> **Tonight is the only session with no code to build and no `dotnet` command.** The whole evening is: prove the toolchain works, then re-calibrate their JavaScript to the idioms this course uses. **They already know this language.** Move fast, and let the predictions do the teaching — every `console.log` below is a bet before it is an answer.

## 0 · Before class

- [ ] **Teaching profile** in VS Code (gear → Profiles): C# and mssql extensions only, no C# Dev Kit — your editor matches theirs. Bump the font for the back row
- [ ] **Park two browser tabs:** the [setup guide](https://github.com/jgrissom/dotnet-web-dev/blob/main/week-01/setup-guide.md) and the [hosted playground](https://jgrissom.github.io/dotnet-web-dev/week-01/demo/). The guide goes on screen at 0:20; the playground is your home for the rest of the night
- [ ] ⚠️ **The playground tab is where your console lives, all evening — open it there now (F12) and dock it.** §4 and §5 never touch the page, only the console, so any tab would do; using this one means **§6 needs no setup at all**, because the page it manipulates is already under you
- [ ] ⚠️ **Not on the slides.** If the console is docked on the deck, putting the console on screen puts the deck on screen with it — and the whole sheet assumes those are two separate states you swipe between
- [ ] **Size the console text for the back row** — `Cmd/Ctrl +` inside DevTools raises it independently of the page
- [ ] ⚠️ **Print or queue the school SQL Server address + credentials handout.** §2 stops dead without it, and it is the one thing in this session you cannot improvise
- [ ] **Every console block below has a Copy button on the hosted sheet — paste, do not type.** Nothing tonight is taught by watching characters appear; the teaching is in the bet before each Enter
- [ ] *(Offline fallback: `demo/demo-script.js` holds the same blocks in slide order, for a night when Pages is unreachable.)*
- [ ] ⚠️ **Clear the console between sections** (the 🚫 button, or `Ctrl+L`). Tonight's scroll is not the story — the current answer is, and a screen of old output is where the back row loses you
- [ ] Sanity check: the playground loads, and `document.querySelector("#status")` returns the paragraph rather than `null`
- [ ] **Say it at the top: *"lids down for the lecture parts — you have a setup workshop and a lab tonight where the laptop is the point."*** Nobody codes along with a refresher

### Chrome console prep

⚠️ **Three settings, all once per Chrome profile, all of which stick.** Do them now. Each one costs a baffling thirty seconds if you meet it at 1:25 with a slide up, and the first two decide whether the predict-then-run beats work at all.

- [ ] 🛑 **Eager evaluation OFF.** DevTools → **F1** → Preferences → **Console** → untick **Eager evaluation**. Chrome previews the result of any complete expression *before* you press Enter, in grey, right under the line. Every bet in §4 and §5 dies the instant the room can read the answer — and **typing does not save you**, because the preview appears the moment the expression is syntactically complete either way
- [ ] 🛑 **AI autocomplete OFF — this one argues with the deck.** Same **F1** settings, in the AI section (headed *AI innovations* or *AI assistance*, depending on your Chrome). Untick everything in it. It offers a rewrite of what you paste, as grey ghost text: on §5's spread line it proposes `const updated = Object.assign({}, student, { gpa: 4.0 });` — which is the old-tutorial habit slide 8 says tonight exists to un-learn, on screen while slide 18 teaches the opposite. *(Section missing or greyed out means WCTC manages it: `chrome://policy`, look for `DevToolsGenAiSettings`. You cannot change it, but you will know to expect the ghost text.)*
- [ ] 🛑 **`allow pasting`.** Chrome and Edge block the first paste into the console until you type **`allow pasting`** and press Enter — a self-XSS guard, and every Copy button on this sheet hits it
- [ ] **✓ Verify all three with two pastes, neither of which you send.** No restart needed; the settings apply to the next line. First paste `1 + 1` — Chrome will ask for `allow pasting` here, so type it and paste again — and **stop, do not press Enter**: grey `2` underneath means eager evaluation is still on. Then paste the line below and again **do not press Enter** — grey text trailing it means the AI is still on. Nothing grey either time and you are set. *(Still there? Close and reopen DevTools — F12 twice — not the browser.)*

    ```js
    const updated = { ...student, gpa: 4.0 };
    ```


## 1 · Welcome and the shape of the course *(slides 2–7)*

### The arc

- [ ] 🎞️ **GO TO SLIDE 2** — *What you'll build in this course*. Read the six rows, don't dwell
- [ ] 🎞️ **GO TO SLIDE 3** — *Where you end up*
- [ ] 🎯 **Land the project thread — this is the line that pays off in week 4:** *"in week 4 you pick your own topic and build a small site from an empty folder. Every week after that extends that same app. In week 16 you present it. Start thinking about the topic now"*
- [ ] *"Nothing stays on localhost. Tonight your homework goes live on GitHub Pages. You graduate with URLs, not zip files"*

### The rules

- [ ] 🎞️ **GO TO SLIDE 4** — *The rules of the road*. All four, kindly but clearly
- [ ] ⚠️ **The last bullet is the one to mean.** *"Your work gets shown. From week 5, class opens with a few deployed apps on screen, and everyone's turn comes at least once. It is a rotation, not volunteers"*
- [ ] 🎯 **Say why, because it lands better than the rule does:** *"nobody should find out in week 7 that their work goes on a screen. And people finish things they know will be seen. It is the low-stakes version of a demo at work"*
- [ ] **Two promises to make and keep:** you show *working* software, and when you want a failure to look at, you use **your own** broken example

### The mental model

- [ ] 🎞️ **GO TO SLIDE 5** — *The one mental model*. Point at the two sides
- [ ] *"Weeks 1 and 2 live on the left. Week 3 onward we build the right"*

### Toolchain

- [ ] 🎞️ **GO TO SLIDE 6** — *Toolchain — install AND verify*
- [ ] 🎯 **The whole point of the slide is the second column:** *"it installed is not it works. Every row has a way to prove it, and that is what the next 45 minutes are"*
- [ ] 🎞️ **GO TO SLIDE 7** — *About that database…*
- [ ] **Head off the two questions before they arrive:** nothing to install, and it works from home. *"You each have an account on the school's SQL Server. There is no local database in this course, ever"*
- [ ] *"Azure for Students is free and you will need it — but not tonight. We activate it together in week 3, the night it gets used"*

## 2 · Setup workshop — the deck goes idle *(no slides)*

> [!IMPORTANT]
> **45 minutes, and the guide does the walking.** Your job is unblocking, not narrating. Put the guide's URL on screen and get out of the way.

- [ ] **Put the [setup guide](https://github.com/jgrissom/dotnet-web-dev/blob/main/week-01/setup-guide.md) URL on screen** and leave it there. Distribute the server address + credentials handout
- [ ] **Say the shape once:** *"five steps, each one ends with a way to prove it worked. Do not move on until yours passes. Raise a hand when stuck; if you finish early, help a classmate"*
- [ ] ⚠️ **Step 3 is where the room piles up** — the mssql connection. The three failures, in order of likelihood: a typo in the server address, **Windows Authentication selected instead of SQL Server Authentication**, and wifi. The [troubleshooting appendix](../lecture-notes.md#appendix-setup-troubleshooting) has the rest
- [ ] **Step 2's F5 breakpoint is the one people skip.** It is the only proof the debugger works, and it is the only time it gets checked before week 7
- [ ] ⚠️ **Anyone still broken at the end goes home with an email address.** Setup is part of the homework, and week 2 does not work without it — say that plainly rather than leaving it implied
- [ ] **✓ CHECKPOINT:** every laptop shows five green checks, or its owner knows exactly which one is red and what to do about it

## 3 · Why JavaScript is here *(slide 8)*

- [ ] 🎞️ **GO TO SLIDE 8** — *Why JavaScript in a .NET course?*
- [ ] 🎯 **Set the register for the next hour — this is the sentence that stops it feeling remedial:** *"tonight is calibration, not instruction — nobody is here to be taught JavaScript. We are agreeing on which dialect this course speaks, and flagging the habits from older tutorials that will bite you"*
- [ ] *"It shows up three times: validation feedback in week 6, sprinkles throughout, and in week 15 your JavaScript calls the Web API you built"*

## 4 · The dialect this course speaks *(slides 9–14)*

> [!IMPORTANT]
> **Rapid-fire, and every block is a bet before it is an answer.** Paste each block, **then stop before Enter** and take the prediction — that pause is the whole segment.
>
> **All of it happens in the playground tab's console**, the one you docked in §0. The page behind it is irrelevant until §6 — you are using it as a console and nothing more.
>
> ⚠️ **This segment only works with eager evaluation off** (§0). Leave it on and Chrome prints the answer in grey under every line before you press Enter, and there is nothing left to bet on. If the room is clearly solid, compress — the lab is the real diagnostic.

### Variables and types

- [ ] **Open cold — no slide yet:** *"first pair, `let` and `const`. Four lines; predict which one complains"*
- [ ] **Swipe to the playground tab** and paste this into its console — **then stop.** Ask which line throws before you press Enter:
  *(All four in one block on purpose — the room needs to see the other three to pick the fourth. Everything after this is one Copy button per Enter.)*

    ```js
    let score = 0;
    const maxScore = 100;
    score = 10;
    maxScore = 200;
    ```
- [ ] 🎞️ **GO TO SLIDE 9** — *Variables: `let` and `const`*

- [ ] **✓ say it:** *"`const` by default, `let` if it genuinely changes, `var` never. That is the house rule and the homework checks it"*
- [ ] C# bridge: *"`const` is closest to `readonly` — the binding is fixed, the contents are not"*
- [ ] *"Now what `typeof` says about five values. Call each one before I press Enter"*
- [ ] **One Copy button per line — paste, Enter, read it, next.** Take the bet before the fourth:

    ```js
    typeof 42
    ```

    ```js
    typeof "hello"
    ```

    ```js
    typeof undefined
    ```

    ```js
    typeof null
    ```

    ```js
    typeof [1, 2]
    ```
- [ ] **`typeof null` is `"object"`** — let the groan happen. *"A bug from 1995 that can never be fixed, because fixing it would break the web"*
  <details><summary>❓ <b>Why not fix it</b> — three minutes, and it changes nothing they write</summary>

  **It has been proposed as a fix, and rejected.** Not because it is hard — because an enormous amount of deployed code says `typeof x === "object"` and then rules out null separately with `x !== null`. Change what `typeof` returns and every one of those branches quietly starts behaving differently, on pages nobody maintains any more. The committee's standing constraint is *don't break the web*: a fix with no migration path and no way to audit the blast radius does not ship, however wrong the thing being fixed.

  </details>
- [ ] 🎞️ **GO TO SLIDE 10** — *Types live in values, not variables*

- [ ] **The half worth saying even when nobody asks:** *"`typeof` cannot detect `null` — it says `object` for both. When you mean null, `x === null` is the check"*
- [ ] *"`undefined` means never set. `null` means deliberately empty. That distinction matters in week 6"*

### Strings and comparison

- [ ] **Still no slide** — *"backticks instead of quotes. Watch what happens inside the curly braces"*
- [ ] Paste:

    ```js
    const name = "Ada";
    ```

    ```js
    `Hello, ${name}! You have ${3 + 4} messages.`
    ```
- [ ] 🎞️ **GO TO SLIDE 11** — *Template literals*

- [ ] C# bridge: *"it is `$"Hello, {name}"` with the dollar sign moved inside. Same idea, and it does arithmetic in there too"*
- [ ] *"Two lines that differ by one character. Call both before I run either"*
- [ ] ⚠️ **Predictions mandatory on both lines:**

    ```js
    1 == "1"
    ```

    ```js
    1 === "1"
    ```
- [ ] 🎞️ **GO TO SLIDE 12** — *Equality: always `===`*

- [ ] **✓ say it:** *"`==` converts before it compares, and the conversions are not always the ones you would pick. `===` checks type and value. This one is a deduction on your homework"*
- [ ] *"Four values through `Boolean()`. The last one splits the room every year"*
- [ ] **The last line is the trap — take a vote first:**

    ```js
    Boolean("")
    ```

    ```js
    Boolean(0)
    ```

    ```js
    Boolean("hi")
    ```

    ```js
    Boolean([])
    ```
- [ ] 🎞️ **GO TO SLIDE 13** — *Truthiness*

- [ ] *"An empty array is truthy. Everything is, except those six falsy values on the slide"*

### Functions

- [ ] **Still no slide** — *"one more piece of syntax, and this one has a C# twin"*
- [ ] Paste the two declarations, then call each one:

    ```js
    const add = (a, b) => a + b;
    const greet = (nm = "friend") => `Hello, ${nm}!`;
    ```

    ```js
    add(2, 3)
    ```

    ```js
    greet()
    ```

    ```js
    greet("Ada")
    ```

- [ ] *"`greet()` with nothing gets `friend` — that is a default parameter, and C# has had them for years"*

- [ ] C# bridge: *"`(a, b) => a + b` is valid C# too. Same syntax, both languages — this is the one that surprises people"*
- [ ] ⚠️ **Now show the difference that bites, rather than asserting it. Take a prediction first — C# would not compile this:**

    ```js
    add(2)
    ```

- [ ] **`NaN`.** *"No overloads, no type checking, and no error. The missing argument became `undefined`, `2 + undefined` is NaN — and that value is now travelling through your program looking like a number"*
- [ ] 🎞️ **GO TO SLIDE 14** — *Arrow functions = lambdas*
- [ ] **Point at the top line — the one thing here the console never showed you.** `function add(a, b) { return a + b; }` and the arrow underneath are the same function twice. *"the top one is the spelling most of us learned first. The bottom one is what this course writes — and it is the shape C# uses too"*
- [ ] **✓ CHECKPOINT:** the room can say why `===` and why `const`, without hedging

## 5 · Arrays and objects *(slides 15–20)*

### The big three

- [ ] 🎞️ **GO TO SLIDE 15** — *Arrays*
- [ ] **Read the two questions off the slide before you touch the console** — *"what does `scores[0]` give back, and after the `push`, did it change?"* Take both now.
- [ ] Paste, and **ask "did it change?" before the last line**:

    ```js
    const scores = [90, 85, 72, 100];
    ```

    ```js
    scores[0]
    ```

    ```js
    scores.push(65)
    ```

    ```js
    scores
    ```

- [ ] *"`const` stopped you reassigning the variable. It never stopped you changing what is inside it"*
- [ ] C# bridge: *"closer to `List<T>` than to an array — it resizes"*
- [ ] 🎞️ **GO TO SLIDE 16** — *The big three (this is LINQ!)*
- [ ] **Point at the three arrows first, before anything runs** — `Select`, `Where`, `FirstOrDefault`. *"You have probably seen all three in C#. Different names, same three ideas"* — the question is the last line
- [ ] **The console echoes each result — predict before every Enter:**

    ```js
    scores.map(s => s + 5)
    ```

    ```js
    scores.filter(s => s >= 80)
    ```

    ```js
    scores.find(s => s === 100)
    ```

    ```js
    scores
    ```

- [ ] 🎯 **Land the C# bridge hard, because it is the whole slide:** *"`map` is `Select`. `filter` is `Where`. `find` is `FirstOrDefault` - the same three ideas with different names"*
- [ ] **✓ say it:** *"and the original is untouched. All three hand you a new thing. That is the habit the homework is testing"*

### Objects, and the shape of everything

- [ ] **Still no slide** — *"an object literal. Braces, key colon value — and near enough this shape exists in most languages"*
- [ ] Paste:

    ```js
    const student = { name: "Ada", gpa: 3.9 };
    ```

    ```js
    student.name
    ```

    ```js
    student.year = 2;
    ```

    ```js
    student
    ```

- [ ] *"No class anywhere. You added a property to a thing that already existed, at runtime. C# will not let you do that, and week 4 is where you meet the version that will not"*
- [ ] 🎞️ **GO TO SLIDE 17** — *Objects*
- [ ] **Two ways in — dot and bracket — then the line that matters.** Point at `student.year = 2`: *"a property added to a thing that already exists, and there is no class anywhere on this slide"*
- [ ] **✓ say it:** *"this is the shape of JSON, and JSON is what every API in week 15 hands you"*
- [ ] 🎞️ **GO TO SLIDE 18** — _Destructuring: pulling values *out*_
- [ ] **Both shapes are up there** — braces unpack an object, brackets unpack an array. *"Instead of pulling out `student.name` then `student.gpa` one at a time, one line does both"* — then the question at the bottom
- [ ] Paste — **short, and the point is the shape**:

    ```js
    const { gpa } = student;
    ```

    ```js
    gpa
    ```

- [ ] *"I am about to copy an object and change one field on the way in. Two questions first"*
- [ ] **Two questions before you run it: which `gpa` wins, and does the original change?**

    ```js
    const updated = { ...student, gpa: 4.0 };
    ```

    ```js
    updated
    ```

    ```js
    student
    ```
- [ ] 🎞️ **GO TO SLIDE 19** — _Spread: copying everything *in*_

- [ ] *"Rightmost wins, and the original is untouched. Both of those are on your homework — exercise 8 fails on purpose if you mutate"*
- [ ] 🎞️ **GO TO SLIDE 20** — *Real data = arrays of objects*
- [ ] **This is the payoff slide — read the line under the code and mean it:** *"every database query result and every API response you touch this semester is this shape"*. Then the question: who made the honor roll?
- [ ] Paste, then chain it:

    ```js
    const students = [
      { name: "Ada", gpa: 3.9 },
      { name: "Linus", gpa: 3.4 },
      { name: "Grace", gpa: 4.0 },
    ];
    ```

    ```js
    students.filter(s => s.gpa >= 3.5).map(s => s.name)
    ```

- [ ] 🎯 **The sentence that connects tonight to the whole course:** *"every database query result and every API response you touch this semester is this shape. Learn to read it once"*
- [ ] **✓ CHECKPOINT:** the room can chain `filter` into `map` without being walked through it

## 6 · The DOM and fetch *(slides 21–22)*

> [!IMPORTANT]
> **A tour, not mastery.** They see these again in week 2 and for real in week 15. Do it **on the hosted playground** so the page visibly changes — a console with no page attached teaches nothing here.

### The DOM, on a real page

- [ ] **Same tab you have been in since §4 — but now make the page itself visible** alongside the console, because this is the segment where it changes. It has exactly two elements: a `#status` paragraph and a `#go` button
- [ ] 🎞️ **GO TO SLIDE 21** — *The DOM in three APIs*
- [ ] **Name the three APIs off the slide, in order** — select, write, listen. *"Three calls. That is the whole DOM for tonight"* — then do all three on the page underneath
- [ ] Back on the page, paste the three moves **one at a time, watching the page after each**:

    ```js
    const status = document.querySelector("#status");
    ```

    ```js
    status.textContent = "Ready.";
    ```

- [ ] **The paragraph changes on screen.** Let that land before moving on — *"select, then write. That is two of the three"*
- [ ] Now the third:

    ```js
    document.querySelector("#go").addEventListener("click", () => {
      status.textContent = "Clicked!";
    });
    ```

- [ ] **Click the button.** *"an event, and a lambda for the handler. If you have wired a C# event, this is that shape"*
- [ ] *"`querySelector` takes a CSS selector — the same `#id` and `.class` that go in a stylesheet. One syntax, two jobs"*

### fetch, and a look at week 15

- [ ] 🎞️ **GO TO SLIDE 22** — *fetch + async/await — a preview of week 15*
- [ ] **Read it top to bottom once, on the slide** — the `async` wrapper, the two `await`s, the `.json()`. *"Four lines. Then we run it one at a time and watch what each hands back"*
- [ ] **Line by line, and expand the result each time:**

    ```js
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    ```

    ```js
    response
    ```

    ```js
    const users = await response.json();
    ```

    ```js
    users
    ```

- [ ] **Expand the triangle on `users`** — *"arrays of objects. The shape from ten minutes ago, arriving over the network"*
- [ ] Finish with the chain, so the whole hour closes on itself:

    ```js
    users.map(u => u.name)
    ```

- [ ] 🎯 **The preview line:** *"`await` means wait here until the answer comes back — the network is not instant. In week 15 that URL is your own API, and the C# on the other end is what you spend twelve weeks learning to write"*
- [ ] ⚠️ **Do not teach `async`/`await` tonight.** It is a preview and it says so on the slide — the mechanism arrives in week 8, in C#, where it has somewhere to be used

## 7 · Hand off to the lab *(slide 23)*

- [ ] **Show what done looks like, ~90 seconds:** your finished copy of the gauntlet open in the browser, console reading **8 / 8 passing**. A target, not a walkthrough
- [ ] ⚠️ **Nothing is deployed for this** — it is a folder of three files open from your own machine, exactly like theirs will be
- [ ] 🎞️ **GO TO SLIDE 23** — *Lab: JS Refresher Gauntlet*. Leave it up for the whole lab; it is the task list
- [ ] **Setup on screen, said once:**

    ```bash
    git clone https://github.com/jgrissom/dotnet-web-starters.git
    ```

- [ ] **Then: copy the `week-01` folder out of the clone, open your copy, open `index.html` in the browser, console on.** *"Never work inside the clone — every week you pull it again"*
- [ ] **The rhythm, said once:** *"one ❌ at a time. Pick the first red one, fix that function, save, refresh. Do not write all eight and debug at the end"*
- [ ] **Pairs encouraged.** Review the two or three trickiest on screen in the last ten minutes
- [ ] ⚠️ **Exercises 7 and 8 roll into the homework if time runs out** — say so at the start, so nobody reads the clock as failure

## 8 · Wrap-up *(slide 24)*

- [ ] 🎞️ **GO TO SLIDE 24** — *Before next week*
- [ ] **The homework, in one sentence each:** the two setup screenshots, the eight roster functions, and it goes **live on GitHub Pages tonight**
- [ ] 🎯 **The deploy is the part to sell:** *"your code has an address by the end of the week. From week 3 every .NET assignment does too. That is why there are no zip files in this course"*
- [ ] ⚠️ **Say the setup deadline out loud:** *"if any of your five checks is still red, email me before next class. Week 2 does not work without them, and I would rather fix it Thursday than in the first ten minutes of the session"*
- [ ] **Preview week 2:** Bootstrap — a real, styled, multi-page site, deployed, and it becomes the portfolio the rest of the course links into
