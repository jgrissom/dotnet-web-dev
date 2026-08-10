# Week 1 — Environment Setup Guide

Work through this top to bottom. Each step ends with a **✓ Verify** — don't move on until it passes. Raise a hand when stuck; if you finish early, help a classmate.

> [!NOTE]
> Windows, macOS, and Linux all work this semester — the steps below are identical except where marked. You need permission to install software on your machine (personal laptops: you're fine; locked-down work laptops: see me).

## 1. .NET 10 SDK

1. Download the **.NET 10 SDK** (not "runtime") for your OS: https://dotnet.microsoft.com/download
2. Run the installer with default options.

> [!IMPORTANT]
> After installing, **close and reopen your terminal** — a terminal that was open during the install can't see `dotnet` yet. This one bites someone every semester.

**✓ Verify** — in a *new* terminal:

```bash
dotnet --version
```

You should see a version starting with `10.`

## 2. VS Code + the C# extension

1. Install **VS Code**: https://code.visualstudio.com
2. Open it → Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`) → search **C#** → install the one named exactly **"C#"** by Microsoft.

> [!IMPORTANT]
> **Not "C# Dev Kit."** The marketplace will push it at you — it's the top search result, and VS Code will pop up "install C# Dev Kit?" suggestions later. We use the plain **C#** extension in this course so everyone's editor behaves identically (and there's no sign-in). If Dev Kit is already installed or sneaks in: Extensions panel → C# Dev Kit → **Disable** (no need to uninstall). Dismiss any install prompts with "Don't ask again."

**✓ Verify** — prove the whole chain works, including the debugger:

```bash
dotnet new console -o Hello
```

1. In VS Code: **File → Open Folder** → the `Hello` folder (say Yes if asked to trust it).
2. Open `Program.cs`, wait for the status bar to finish loading the project.
3. Click in the margin left of the `Console.WriteLine` line — a red dot (breakpoint) appears.
4. Press **F5** (pick "C#" if prompted). The program starts and **pauses on your red dot**.
5. Press F5 again to let it finish. That's your toolchain proving it can stop your code mid-run — the editor, the SDK and the debugger all talking to each other. *(We come back to what else the debugger can do later in the semester, when there's something worth stopping to look at.)*

> [!TIP]
> No IntelliSense or the breakpoint won't hit? Make sure you opened the **folder** (not just the file), then give the C# extension a moment — watch the flame icon in the status bar.

> [!NOTE]
> **Optional, but grab it while you're here: Live Server.** Extensions → search **Live Server** (by Ritwick Dey) → Install. Right-click any `.html` file → **Open with Live Server** and it serves the page at `http://127.0.0.1:5500`, reloading the browser every time you save.
>
> You'll use it for tonight's homework and heavily in week 2. It isn't on the checklist and nothing is graded on it — but a page opened straight from disk can't do everything a served page can, and the homework checker says so when it hits that limit.

## 3. SQL Server (mssql) extension

No database install this semester — you each have an account on the **school SQL Server**, and it works from home too.

1. In VS Code: Extensions → search **SQL Server (mssql)** → install.
2. Click the new server icon in the left sidebar → **Add Connection**.
3. Fill in from the handout:
   - **Server name:** *(on the handout)*
   - **Authentication type:** **SQL Login** — *not* Windows Authentication
   - **Username / Password:** your student account *(on the handout)*
   - If asked about the server certificate, choose **Trust server certificate**.

**✓ Verify** — the connection appears in the sidebar and expands to show **Databases**.

> [!IMPORTANT]
> Passwords are case-sensitive, and the #1 failure here is selecting Windows Authentication instead of **SQL Login**. Second-most common: a typo in the server name — copy it exactly from the handout.

## 4. Git

1. Install: https://git-scm.com/downloads (Windows: default options are fine. macOS: if `git --version` prompts to install Command Line Tools, accept — that *is* the install.)
2. Introduce yourself to Git — in a terminal, with **your** name and school email:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@school.edu"
```

**✓ Verify:**

```bash
git --version
git config user.name
```

Version prints, and your name comes back.

## 5. GitHub account

1. Sign up at https://github.com with your **school email**.
2. Same email qualifies you for the free [GitHub Student Developer Pack](https://education.github.com/pack) — apply; it takes two minutes.

**✓ Verify** — you're logged in at github.com.

> [!NOTE]
> Tonight's homework pushes code to GitHub and puts it **live on the internet** via GitHub Pages. The account isn't optional.

## 🏁 Final checklist

| # | Check | Proof |
|---|-------|-------|
| 1 | `dotnet --version` → `10.x` | new terminal |
| 2 | Breakpoint hit under F5 in the `Hello` project | red dot pauses execution |
| 3 | mssql extension connected to the school server | Databases visible in sidebar |
| 4 | `git --version` + `git config user.name` | both answer |
| 5 | Logged in to GitHub | avatar top-right |

All five green? 🎉 You're done for the whole semester — this is the only install night. Help a classmate or start the lab early.

> [!IMPORTANT]
> Couldn't finish in class? This **must** be working before week 2 — it's Part 1 of tonight's homework. Use the [troubleshooting appendix](lecture-notes.md#appendix-setup-troubleshooting), then email me.
