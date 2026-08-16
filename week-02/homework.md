# Week 2 Homework

**Due:** before the start of Week 3's class.
**Submit via Canvas:** your GitHub Pages URL + the Azure screenshot from Part 3.

**This is the lab, continued — not a new project.** Keep working in the same `cryptid-registry` folder you copied and renamed in class: the same three pages, nothing new to download and no new starter. Part 1 finishes the lab checklist, Part 2 makes the archive yours, Part 3 puts it online. The self-check came with the folder — `registry-checks.js`, already wired into all three pages — so it is the same one you were using in class. Once a page's checklist is green it unlocks a **Homework** block with Part 2's items in it.

## Part 1 — Finish the lab checklist

> [!IMPORTANT]
> **Start the git history before you start the work.** Three meaningful commits are graded, and they only exist if you make them as you go — a single "done" commit at 11:58pm costs a point, and by then the only fix is dishonest. In the VS Code terminal (`` Ctrl+` ``), from inside your `cryptid-registry` folder:
>
> ```bash
> git init
> git add .
> git commit -m "Lab starter"
> ```
>
> Then commit at each natural stopping point below. Part 3 pushes whatever history you built.

Complete every unchecked item in `lab/README.md` on all three pages: navbar, hero, feature row, card grid with badges, sighting form with alert, footer, and Bootstrap Icons on every page. Rules still apply — no custom CSS except the font override.

## Part 2 — Make the archive yours (graded)

Six creatures is what *I* put in the registry. Make it yours:

1. **A seventh cryptid — your own.** Pick a legend from your own state, country, or family, and add it as a seventh card with a name, a description in the Registry's voice, and a region badge. If you can't find one, invent it and say so on the card — an archive that admits things is the whole bit.

   **Don't draw anything.** The six plates were drawn by kids, and yours has no artist — so the starter ships the plate for exactly this, already in your folder:

   ```html
   <img src="img/cryptids/unillustrated.webp" class="card-img-top" alt="No known illustration">
   ```

   It's the same aged paper as the others, signed *artist unknown*. Use it as-is.
2. **Your theme.** Pick a [Bootswatch](https://bootswatch.com) theme — any except Flatly (that's the solution's, and I'll know). Keep the version at 5.3.x, and apply it to **all three pages**.
3. **Your fonts.** A [Google Fonts](https://fonts.google.com) pairing: one heading font, one body font, only the weights you use, fallback stacks kept. Both family names go in the Google URL; override `--bs-body-font-family` *and* add the heading rule, as shown in [the lecture notes](lecture-notes.md#part-5-google-fonts-15-min). On all three pages.
4. **One component we didn't cover in class**, found and adapted from the [Bootstrap docs](https://getbootstrap.com/docs/5.3/) — accordion, carousel, list group, tooltip, modal — or the dark-mode toggle from the lab's stretch goals — your call. It only has to appear on one page. This is a docs-reading exercise; expect it on future assignments too.

## Part 3 — Deploy + get ready for Azure

1. **Check the history first:** `git log --oneline` should already show 3+ commits — after the lab checklist, after your theme and fonts, after your extra component. Commit anything still outstanding now.
2. Push the site — your `cryptid-registry` folder in `dotnet-web` — to a **public** repo of the same name, and enable GitHub Pages (same flow as week 1).
3. Test the URL in a private/incognito window — check **all three pages** and the navbar links between them.

   > [!TIP]
   > **Do this on your phone too.** Your site is public now — pull it up on your own phone and hand it to someone. If the navbar hamburger doesn't work there, the JS bundle tag is missing on that page.

4. **Activate your Azure for Students account** at [azure.microsoft.com/free/students](https://azure.microsoft.com/free/students) using your school email — no credit card required. Screenshot the Azure Portal home page once you're in.

> [!IMPORTANT]
> **Week 3 does not work without an active Azure account** — your first .NET app deploys to Azure that night. If activation fails (usually a school-email verification issue), email me *before* class, not during it.

### When are you done?

Open the console on **each of the three pages** — every ❌ green across Required *and* Homework, no custom-CSS warnings. Then the two things the checker can't see: resize to phone width and verify the **responsive mechanics** — no horizontal scrollbar, navbar collapses to the hamburger, columns stack — and confirm your extra docs component actually works when clicked.

> [!TIP]
> **The checker is the same one I grade with.** Green on all three pages locks in the checklist and theme/fonts points; the responsive look, whether your extra component actually *works* when clicked, and the Azure screenshot are the human-graded remainder.

## 🆘 Stuck?

- **All green, but you are not done.** The self-check grades **only the page you are looking at** — that is what `check all 3 pages!` on the last line means. Open the console on `index.html`, `registry.html` *and* `report.html`; each has its own list.
- **`❌ current page marked .active in nav`** on a page that looks fine — `active` moves. Copy the same navbar to all three pages, then on each one put `active` on that page's own link and take it off the others.
- **`❌ footer: centered, muted, padded`** — three requirements behind one label, and it is nearly always the muted one. The check wants **`text-muted`**, which is what the notes and the demo use. If you went to the Bootstrap docs and picked up `text-body-secondary`, that is the 5.3 replacement and this check does not accept it — swap it back and the footer turns green.
- **`❌ Bootstrap JS bundle at end of body`**, or the hamburger does nothing on a narrow window — it has to be **`bootstrap.bundle.min.js`**, not `bootstrap.min.js`. The plain file leaves out the JavaScript the navbar toggler needs, and a dead toggler is also a deduction.
- **Your Bootswatch theme is not showing** — the theme link **replaces** the stock Bootstrap one, it does not join it. A Bootswatch URL ends in `bootstrap.min.css` too, so one link satisfies both *Bootstrap CSS linked* and *Bootswatch theme*. Keep both and whichever loads last wins.
- **`⚠️ custom CSS beyond the font override?`** — that is the deduction warning, and it means your `<style>` block has a rule that is not the `--bs-body-font-family` override. Everything else has to be Bootstrap utility classes on the elements.
- Everything else: the [appendix of common snags](lecture-notes.md#appendix-common-snags).

## 📊 Grading (20 pts)

| Item | Points |
|------|--------|
| Lab checklist complete on all 3 pages (navbar/hero/row/cards/form/footer) | 6 |
| A seventh cryptid of your own, with its own badge | 2 |
| Responsive mechanics at phone width: no horizontal scroll, navbar collapses, columns stack (I will resize) | 3 |
| Bootswatch theme + Google Fonts pairing applied on all pages | 3 |
| The extra docs component, working | 2 |
| Pages URL live, all pages reachable | 2 |
| Azure Portal screenshot | 2 |
| **Deductions:** custom CSS beyond the font override, broken navbar toggler, or fewer than 3 meaningful commits | −1 each |

*Reminder: the explain-it standard applies — be ready to walk me through any class or component you used.*

> [!NOTE]
> Everything in the table above is a checkable fact — design taste is not graded in this course.

## 📖 Reading for next week (~25 min)

Week 3 is the big pivot: how the web actually works, then your first ASP.NET Core MVC app — deployed to Azure the same night.

- [MDN: An overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) — read through "HTTP Messages." Come knowing what a request, response, verb, and status code are.
- [Microsoft: Overview of ASP.NET Core MVC](https://learn.microsoft.com/en-us/aspnet/core/mvc/overview) — skim the first half; don't worry about understanding the code yet.
