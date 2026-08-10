# Week 2 Homework

**Due:** before the start of Week 3's class.
**Submit via Canvas:** your GitHub Pages URL + the Azure screenshot from Part 3.

## Part 1 — Finish the lab checklist

Complete every unchecked item in `lab/README.md` on all three pages: navbar, hero, feature row, card grid with badges, contact form with alert, footer, and Bootstrap Icons on every page. Rules still apply — no custom CSS except the font override.

## Part 2 — Make it genuinely yours (graded)

This site becomes your portfolio — by finals it will link to deployed .NET apps. So:

1. **Real content.** Your name, a real sentence or two about you, honest descriptions of the week 1 project and this site. The placeholder cards for future projects can stay (they're a roadmap).
2. **Your theme.** Pick a [Bootswatch](https://bootswatch.com) theme — any except Flatly (that's the solution's, and I'll know). Keep the version at 5.3.x.
3. **Your fonts.** A [Google Fonts](https://fonts.google.com) pairing: one heading font, one body font, only the weights you use, fallback stacks kept. Override `--bs-body-font-family` as shown in [the lecture notes](lecture-notes.md#part-5-google-fonts-15-min).
4. **One component we didn't cover in class**, found and adapted from the [Bootstrap docs](https://getbootstrap.com/docs/5.3/) — accordion, carousel, list group, tooltip, modal — or the dark-mode toggle from the lab's stretch goals — your call. This is a docs-reading exercise; expect it on future assignments too.

## Part 3 — Deploy + get ready for Azure

1. Push the site — your `week-02` copy in `dotnet-web` — to a **public** repo named `portfolio`, and enable GitHub Pages (same flow as week 1). **Commit as you go — at least 3 meaningful commits** (e.g., after the lab checklist, after your theme + fonts, after your extra component).
2. Test the URL in a private/incognito window — check **all three pages** and the navbar links between them.

> [!TIP]
> **Do this on your phone too.** Your site is public now — pull it up on your own phone and hand it to someone. If the navbar hamburger doesn't work there, the JS bundle tag is missing on that page.
3. **Activate your Azure for Students account** at [azure.microsoft.com/free/students](https://azure.microsoft.com/free/students) using your school email — no credit card required. Screenshot the Azure Portal home page once you're in.

> [!IMPORTANT]
> **Week 3 does not work without an active Azure account** — your first .NET app deploys to Azure that night. If activation fails (usually a school-email verification issue), email me *before* class, not during it.

### When are you done?

Open the console on **each of the three pages** — every ❌ green across Required *and* Make-it-yours, no custom-CSS warnings. Then the two things the checker can't see: resize to phone width and verify the **responsive mechanics** — no horizontal scrollbar, navbar collapses to the hamburger, columns stack — and confirm your extra docs component actually works when clicked.

> [!TIP]
> **The checker is the same one I grade with.** Green on all three pages locks in the checklist and theme/fonts points; the responsive look, your extra component, and the Azure screenshot are the human-graded remainder.

## 📊 Grading (20 pts)

| Item | Points |
|------|--------|
| Lab checklist complete on all 3 pages (navbar/hero/row/cards/form/footer) | 8 |
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
