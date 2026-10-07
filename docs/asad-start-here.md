# Asad — start here

Your checklist from your Windows PC to ready for your first demo. Work top to bottom; each step says how to know it worked. This is the short version with your real values filled in. Every command runs in **Git Bash** unless it says PowerShell. The full background is in [windows.md](windows.md) (the pipeline on Windows), [getting-started.md](getting-started.md) (your setup guide) and [demo-stores-setup.md](demo-stores-setup.md) (how the stores were made).

If something on screen doesn't match, stop and send Yeasir the exact command and the exact output. Don't work around it.

## Already done for you

- You're in the **Pervej.com** Partner organisation.
- Your demo store **B** is ready: `pervej-demo-b.myshopify.com`, shop name **Oak & Thread**, Test payment gateway active, drawer cart on, a test order placed. Don't change its settings.
- Yeasir sends you its **storefront password** privately. It goes only into your `.env.local` (step 4), never into git, a chat, a commit or a script.

Store A (`pervej-demo-a`) is Yeasir's. You never use it.

## 1. Check your access (5 min)

- [ ] You can open https://github.com/moklesur21/pervej-shopify (a private repo). If not, ask Yeasir.
- [ ] At https://dev.shopify.com/dashboard → **Stores**, you see `pervej-demo-b` and can open its admin.

## 2. Tools on your PC (15 min)

Git, Node and ffmpeg are probably there already from `pervej-woo`: run the checks below first and install only what is missing (in PowerShell or Git Bash):

```bash
winget install --id Git.Git -e
winget install --id OpenJS.NodeJS.LTS -e
winget install --id Gyan.FFmpeg.Essentials -e
```

Then, in a new Git Bash window, the Shopify CLI — from npm, the only way we install it:

```bash
npm install -g @shopify/cli@latest
```

Open a new Git Bash window, then check:

```bash
node -v              # 22.19 or newer
shopify version      # 4.x
which -a shopify     # exactly one path
ffmpeg -version      # prints a version
```

Set your git name and email once (they go on every commit):

```bash
git config --global user.name "Asad <Surname>"
git config --global user.email "you@example.com"
```

## 3. Clone the repo

Next to `pervej-woo` is a good place (for example `C:\xampp\htdocs`, which Git Bash calls `/c/xampp/htdocs`); there is no local Shopify, so the folder needs no web server:

```bash
cd /c/xampp/htdocs
git clone https://github.com/moklesur21/pervej-shopify.git
cd pervej-shopify
```

Run every command below from this folder, in Git Bash.

## 4. Your settings file (2 min)

```bash
cp tools/shopify/.env.example tools/shopify/.env.local
```

Open `tools/shopify/.env.local` and set these two lines. Leave the rest commented out.

```bash
SHOPIFY_STORE=pervej-demo-b.myshopify.com
SHOPIFY_STOREFRONT_PASSWORD=the-password-Yeasir-sent-you
```

- No comment after a value: `PASSWORD=abc # mine` makes `abc # mine` the password.
- If the password has spaces or symbols, wrap it in quotes.

Check that git ignores the file. This must print a `.gitignore` rule:

```bash
git check-ignore -v tools/shopify/.env.local
```

## 5. Doctor, CLI login, first store command (5 min)

```bash
tools/shopify/theme.sh doctor
```

Six lines, all `[ok]`. `HTTP 302` on the store line is normal: it's the redirect to the password page.

Log the CLI in to Shopify:

```bash
shopify auth login
```

A browser opens. Check that the code on the page matches the one in the terminal, then sign in with the Shopify account you accepted Yeasir's invitation with. The terminal prints `Logged in`.

```bash
tools/shopify/theme.sh list
```

It lists store B's themes: `test-data` (live), `Horizon` and `debut-vintage-theme`. If it says you have no access to the store, tell Yeasir. He adds you as staff in store B's admin (Settings → Users), then you run it again.

## 6. Video toolkit (10 min, once per machine)

```bash
npm --prefix tools/video run setup
```

It installs the toolkit's packages and a Chromium (about 470 MB), then runs its doctor. The **Storefront password** line must say *accepted*.

The **ElevenLabs** line: the video's voice is made with a key that belongs to the PC, not the repo. If you stored it for `pervej-woo`, the line already reads `[ok]`. If it reads `warn`, follow [windows.md](windows.md) §5 (Yeasir sends you the key first, §1), then quit and reopen the Claude app and Git Bash. Never paste the key into a Claude chat.

## 7. Claude Code

- Install it as [T0.3](handbook/T0.3-claude-code-for-shopify.md) describes, with the account Yeasir gives you, then run `claude` from the repo root. It reads `CLAUDE.md` by itself.
- Use the **ask-first** mode (Shift+Tab until it shows the default mode). Never a mode that acts without asking.
- When asked, **approve `shopify-dev-mcp`** (current Shopify docs). Decline `phpstorm` unless you use PhpStorm.
- Litmus test, once: ask *"Is checkout.liquid still the way to customize checkout?"* The answer must say it's retired. If it explains checkout.liquid instead, the docs server isn't loaded (`/mcp` shows it). Fix that before any work.

## 8. Training store and sandbox

- Create your own training store: Dev Dashboard → **Stores** → **Create store** → **Dev**, name `asad-training`, plan **Basic**, tick **Generate test data for store**. T-series labs run only there, never on store B.
- Keep the lab repos in a folder of your own outside this repo, for example `C:\xampp\htdocs\shopify-training-asad\`.
- Start at the [training catalog](handbook/0shopify-training-catalog.md), then T0.1. Fast track: M0 → M1 → T2.1–T2.3 → M3 → M7. Progress and drift notes: [training-index.md](training-index.md).

## Done: send Yeasir

- [ ] The six `[ok]` lines from `theme.sh doctor` (paste them)
- [ ] `theme.sh list` showing store B's themes
- [ ] The video doctor's Storefront password line saying *accepted*, and its ElevenLabs line `[ok]`
- [ ] The litmus test passed
- [ ] `git status` clean: no `.env.local`, `shopify.theme.toml` or `.shopify/` listed

## Before your first demo

Read, in this order: `CLAUDE.md`, [workflow.md](workflow.md), [house-rules.md](house-rules.md), [demos/README.md](../demos/README.md), [demo-procedure.md](demo-procedure.md).

Yeasir gives you the demo ID; don't pick one yourself. The queued briefs wait in `demos/_briefs/`. A few Stage 0 items are still Yeasir's to finish before the first demo (the capture check on a real store, the shared product catalogue, the brief template), so train until he says go. Then start at Stage 1 of [demo-procedure.md](demo-procedure.md).

## Never

- Push to or publish a live theme, or use store A.
- Commit `.env.local`, passwords, tokens, `shopify.theme.toml`, `.shopify/` or a demo's `media/`.
- Commit to `main`. Push your branch and open a PR; Yeasir merges.
- Change shared files (`CLAUDE.md`, `docs/`, `tools/`, `.gitignore`, `.mcp.json`) on a demo branch. Use a `chore/<topic>` branch.
- Paste Upwork posts, links or poster names into Claude Code.
