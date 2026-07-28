# Week 3 — First Azure Deploy Guide 🧭

Step-by-step from laptop to live URL. Same drill as setup night: every step ends with a **✓ Verify** — don't move on until it passes. Steps 1–2 happen in class; the deploy itself is part of the homework.

> [!NOTE]
> Prerequisite: your **Azure for Students** account, activated in week 2's homework. Not activated? Do that first: [azure.microsoft.com/free/students](https://azure.microsoft.com/free/students) — then email me if it fights you.

## 1. Install the Azure CLI

- **Windows:** `winget install Microsoft.AzureCLI` (or the installer at aka.ms/installazurecli)
- **macOS:** `brew install azure-cli`

> [!IMPORTANT]
> Close and reopen your terminal after installing — same PATH story as setup night.

**✓ Verify** — in a *new* terminal:

```bash
az version
```

JSON with a version number prints. (`az` not recognized → new terminal, really.)

## 2. Log in

```bash
az login
```

A browser opens — sign in with your **school account** (the one you activated Azure with).

**✓ Verify** — the terminal prints a small table including a subscription named like *Azure for Students*.

## 3. Deploy

From **inside your web project folder** — the one with the `.csproj`, not the solution folder:

```bash
cd FirstFlight.Web
az webapp up --name ff-web-XX1234 --sku F1 \\
  --runtime DOTNETCORE:10.0 --location northcentralus
```

- Replace `XX1234` with your initials + any 4 digits — the name becomes your URL and must be **globally unique**. Taken? Change the digits.
- `--sku F1` is the **free tier**. It sleeps when idle; the first request after a nap takes ~30 seconds. Normal.
- `--location northcentralus` (Chicago) is **required, not a suggestion** — left to its own devices Azure sometimes places student apps in Canada, and the school SQL Server (week 7+) rejects requests from outside the US. Everyone deploys to the same US region.
- First run takes a few minutes (it's creating the server). It prints progress; let it finish.

> [!IMPORTANT]
> **Wrong-folder deploys are the #1 failure.** `az webapp up` ships the folder you're standing in. If you deploy from the solution folder, Azure gets confused and serves an error page. `cd FirstFlight.Web` first, every time.

**✓ Verify** — the command's output ends with a JSON blob including your URL:

```
https://ff-web-XX1234.azurewebsites.net
```

Open it. Your app. On the internet. **Test it in a private/incognito window and on your phone** — and hit `/Home/About` and `/Home/Hello?name=you` too, since those are graded.

## 4. Redeploying (you'll do this a lot)

Changed your code? Same command, same folder:

```bash
az webapp up --name ff-web-XX1234 --sku F1 \\
  --runtime DOTNETCORE:10.0 --location northcentralus
```

It remembers the app and just ships the new build. That's the whole update story.

> [!WARNING]
> **Leave the app deployed until grades post** — grading visits your live URL. We delete everything together in week 16 (it costs you nothing meanwhile on the free tier).

## 🆘 If it goes sideways

- **Name taken:** pick new digits. Names are global across all of Azure.
- **"Location is not available" / region rejected:** your subscription's allowed free-tier regions are listed by `az appservice list-locations --sku F1 --output table`. Pick a **US** region — try `centralus`, then `eastus2`. Never accept a Canada region, even if Azure suggests it: the school SQL Server will block your app later in the course.
- **Runtime error / generic Azure page:** confirm the runtime value with `az webapp list-runtimes --os-type linux | grep -i dotnet` and that you deployed from the web project folder.
- **Login loops or picks the wrong account:** `az logout`, then `az login` again and choose the school account.
- **It worked yesterday, slow today:** free tier waking up. ~30 seconds, then normal.
- Anything else: copy the *last 10 lines* of terminal output into an email to me — that's where the real error lives.
