# Week 6 Demo Canvas — Curbside Takes Orders 🌮

Week 6's demo picks Curbside up where week 5 left it and teaches it to *listen*: a hand-written HTML form first, so model binding is visibly just name-matching, then the same form rebuilt with tag helpers, then rules on the model and the guard that reads them. **Deliberately different content from the lab:** you add a truck to Curbside; students add a creature to the *Cryptid Registry*.

- `demo-script.md` — the edit-by-edit cue sheet, keyed to slide numbers, with a [clickable hosted version](https://jgrissom.github.io/dotnet-web-dev/week-06/demo/script.html). Every block you type or paste is in it, and every **🎞️ line means stop and switch to the projector** — it names the slide to put up and what to say to it, so the script alone is enough to run the night from. No cue ever means "not yet"; a slide that has to wait has its cue further down, at the moment it's due. Between two 🎞️ lines the deck stays put.
- **The starting app is not in this repo.** Curbside's finished week-5 state lives in the private answer-keys repo at `week-06/demo-starter/Curbside` — copy it out into `~/Repos/dotnet-web-dev-course-trial/instructor/` before class.

> [!IMPORTANT]
> **Start with the plain HTML form, not the tag helpers.** It costs four minutes and it is the difference between "model binding is a thing tag helpers do" and "model binding matches `name` attributes to properties, and tag helpers just write the names for you." Everything in §1 exists to make the rename-one-attribute break land, and that break is what students actually remember when a field arrives empty at 10pm.

> [!IMPORTANT]
> **You break things four times, and none of them shows an error page.** Unlike week 5, where a bad layout took the site down, tonight's breaks produce a *wrong result* that looks fine — an empty property, an unvalidated truck, a duplicate row. That's the whole point, and it's also why each one needs its explicit **restore** step. The script flags all four.

> [!TIP]
> The beat worth protecting if you run short is **§3's two breaks** — deleting the `ModelState.IsValid` guard, and swapping the redirect for a `View(...)` and hitting refresh. Take the time out of §4's second half if you must; client-side validation still lands in one paste. What can't be recovered from the notes is watching a nameless truck rated 9000 appear in the list.

> [!NOTE]
> **Trucks you add will vanish whenever `dotnet watch` restarts**, because `TruckData.All` is a `static List<Truck>`. It'll happen mid-demo the first time you edit a `.cs` file after adding one. Don't apologise for it — say "hold that thought" and collect it in §5, which is the beat that hands off to week 7.

> [!TIP]
> **Have the Network panel already open** on the `/Trucks` tab. You need it twice — once in §1 to show the POST body, once in §3 to show the 302 and the second GET — and hunting for it both times costs more than it sounds like.
