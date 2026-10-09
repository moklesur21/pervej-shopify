# Getting started — Asad's setup guide

Everything you need to go from an empty machine to your first commit on your own branch. Follow it top to bottom once; afterwards the "Daily loop" at the end is all you need. Written for macOS; Windows notes are in section 10.

Ask Yeasir when something here does not match what you see. Do not improvise around it — this repo is shared, and the rules exist so two people never break each other's work.

---

## 0. What you are setting up

- **There is no local Shopify.** Stores live in Shopify's cloud. You get your own **demo dev store** in our Partner organisation (the briefs call Yeasir's "dev store A" and yours "dev store B") and your own **training dev store**. Nothing to install server-side, no database, no MAMP needed.
- **The repo holds what we author:** the paperwork of every demo (`demos/<id>/`), its code (`shopify-dev/<id>/` — mostly a full theme copy), the handbook (`docs/`) and the tooling (`tools/`). Secrets, your store's settings and the Shopify CLI's state are git-ignored.
- **A demo's theme travels to your store through the CLI.** `tools/shopify/theme.sh` pushes it as an unpublished theme named after the demo; you look at it through its preview link. Nothing ever touches a live theme.
- **Work happens on branches.** The default branch is `main`. Nobody commits to `main` directly; Yeasir merges pull requests into it.
- **Training is separate.** The T-series handbook lives in `docs/handbook/`, but you do the tutorials in your own sandbox (section 7), not in this repo.

Read after this guide, in order: `CLAUDE.md` (rules that are always on), `docs/workflow.md` (branches and collaboration), `docs/house-rules.md` (the full rulebook), `demos/README.md` (how a demo runs), `docs/demo-procedure.md` (one demo step by step), `asset/pervej-demo-cycle-runbook-v1.md` (what the project chat does and what this repo receives), `asset/pervej-demo-video-guideline-v1.4.md` (how the video and its post copy are made).

---

## 1. Accounts and tools (one time)

| Need | How |
|---|---|
| GitHub account | The repo is **private**; Yeasir adds you as a collaborator on `moklesur21/pervej-shopify`. Sign in to git before cloning: over HTTPS git asks for your username and a personal access token (GitHub → Settings → Developer settings → Personal access tokens; the macOS keychain remembers it). Alternatives: GitHub CLI `gh auth login`, or SSH keys. |
| Shopify Partner access | Yeasir invites you as a **staff member of our Partner organisation** — never your own personal organisation, so nothing walks away if the arrangement changes. Your demo store and training store are created inside it (demo plan §6.2). |
| Git | `xcode-select --install` or `brew install git`. Then `git config --global user.name "Asad <Surname>"` and `git config --global user.email "you@example.com"`. |
| Homebrew | brew.sh — the package manager used below. |
| Node 22.19+ | `brew install node` — the Shopify CLI needs 22.12+, the video toolkit 22.19+. |
| Shopify CLI (current, 4.x) | `npm install -g @shopify/cli@latest`. Check `shopify version`. Older versions lack `theme push --strict`, which our tooling relies on. |
| ffmpeg | `brew install ffmpeg` — renders the demo video (video guideline §11). |
| Playwright browsers | Installed by the one command in the video toolkit README (`tools/video/`). |
| The voice key | Only on a machine that makes the video's voice: an ElevenLabs key from Yeasir, typed once into the Keychain (macOS) or a user environment variable (Windows) — never a file, never shown to Claude Code. The toolkit README, "The voice key", has the one command for each. |
| Claude Code | Yeasir tells you which account to use. Install per T0.3 in `docs/handbook/`, then run `claude` from the repo root. |

Open a new terminal and check: `node -v` shows 22.19+, `shopify version` prints 4.x, `ffmpeg -version` prints a version.

---

## 2. Clone the repo

```bash
cd /Applications/MAMP/htdocs        # or anywhere you like — no web server is involved
git clone https://github.com/moklesur21/pervej-shopify.git
cd pervej-shopify
```

---

## 3. Local settings file

```bash
cp tools/shopify/.env.example tools/shopify/.env.local
```

Open `tools/shopify/.env.local` (git-ignored, yours alone) and set:

- `SHOPIFY_STORE` — your demo store, e.g. `your-demo-store.myshopify.com`.
- `SHOPIFY_STOREFRONT_PASSWORD` — your demo store's storefront password (Online Store → Preferences). The capture toolkit enters it before recording.

Then:

```bash
tools/shopify/theme.sh doctor
```

Every line should read `[ok]`. The first command that talks to the store opens the CLI's browser login — sign in with the Partner account Yeasir invited.

---

## 4. Your demo store

Your demo store is set up once to the same baseline as Yeasir's (`docs/demo-procedure.md` Stage 0): test data, the Bogus test gateway (Settings → Payments), a storefront password, the drawer cart, and the shared baseline catalogue once `tools/shopify/baseline/` exists. Check it worked:

- The storefront opens after the password page and shows products.
- A test order goes through with card number `1` (`2` = declined, `3` = gateway error) and appears in admin → Orders.
- `tools/shopify/theme.sh list` shows the store's themes.
- `git status` is clean.

---

## 5. Claude Code in this repo

Run `claude` from the repo root. It reads `CLAUDE.md` automatically — those are the standing orders for every session. House rules from the handbook (T0.3):

- Work in the **ask-first** permission mode. Any mode that lets Claude act without asking is not used here.
- **Plan mode first** for anything non-trivial; one task per session; small scoped asks.
- **Review every diff line by line** before approving. You must be able to explain every line you commit.
- The repo ships a `.mcp.json`. **Approve `shopify-dev-mcp`** — it gives Claude current Shopify docs and validation, so its Liquid and API answers come from shopify.dev, not stale memory. `phpstorm` is optional; decline it if you don't use PhpStorm.
- Run the litmus test once: ask *"Is checkout.liquid still the way to customize checkout?"* The right answer says it is retired. If you get a checkout.liquid tutorial, the docs server isn't loaded — fix that before any work.

Keep the browser's devtools console open while you work. A change is not done while it shows errors, and Liquid errors render as text on the page — look for them.

---

## 6. Your first branch and pull request

Branches are named by **demo ID**, never by person. The ID and the brief come from Yeasir; the brief is written in the project chat, waits in `demos/_briefs/<id>.md` on `main`, and is moved into `demos/<id>/brief.md` when the demo starts (for example `s01-cart-drawer-lag`). For a small shared change (a doc fix, a rule) use `chore/<topic>`. For a pure experiment use `exp/<topic>` and delete it afterwards.

```bash
git checkout main
git pull                                   # always start from the latest main
git checkout -b s01-cart-drawer-lag        # the branch for this demo
mkdir -p demos/s01-cart-drawer-lag
git mv demos/_briefs/s01-cart-drawer-lag.md demos/s01-cart-drawer-lag/brief.md   # moved, never copied
cp demos/_templates/{spec,log,qa,handoff}.md demos/s01-cart-drawer-lag/
git add demos/s01-cart-drawer-lag && git commit -m "s01: brief"
tools/shopify/theme.sh new s01-cart-drawer-lag dawn   # horizon (the default) for a new build; dawn because s01's store is Dawn-based
```

Where things go:

- Paperwork (`brief.md`, `spec.md`, `log.md`, `qa.md`, `handoff.md`, `setup/`, `capture/`, `post/`; `media/` is git-ignored) → `demos/<id>/`. If something in the brief is genuinely ambiguous, ask Yeasir to put the question to the project chat; the answer is appended to `brief.md` under `## Q&A`. Never guess what the client would say.
- The deliverable → `shopify-dev/<id>/` — the theme in `theme/` (and `app/`, `middleware/`, `pixel/` or `data/` only when the brief needs them). New files of our own over edits to the base theme's files.
- Never push to or publish a live theme; never commit `.env*`, tokens, passwords, `shopify.theme.toml`, `.shopify/`, `node_modules/` or a demo's `media/`.
- Shared files (`CLAUDE.md`, `docs/`, `tools/`, `demos/_templates/`, `demos/_briefs/`, `demos/_backlog/`, `.gitignore`) are never changed on a demo branch. If one needs a change, make a `chore/…` branch from `main` for it.

Work in small reviewed steps:

```bash
tools/shopify/theme.sh dev s01-cart-drawer-lag        # browser loop on a private development theme
tools/shopify/theme.sh check s01-cart-drawer-lag      # Theme Check — zero errors before any commit touching the theme
git add demos/s01-cart-drawer-lag shopify-dev/s01-cart-drawer-lag
git diff --staged                                     # read it — you are signing this
git commit -m "s01 stage B: drawer re-renders only changed lines"
git push -u origin s01-cart-drawer-lag                # push often: backup and visibility
```

When the build is done (every row of `qa.md` passed, `handoff.md` written): open a pull request on GitHub from your branch into `main`. The video package (`docs/demo-procedure.md` Stage 5) lands on the same branch before the merge. Yeasir reviews it line by line and merges; the branch is then tagged with the demo ID and deleted, and you clean the demo's themes off your store with `tools/shopify/theme.sh clean <id>`. If you need something that landed on `main` while you were working: `git merge main` on your branch.

Collaborating on the same demo means both of you commit to the same branch (`git pull --rebase` before every push), and each of you pushes the theme to your own store to look at it.

---

## 7. Training (the handbook)

The tutorials are in `docs/handbook/` — start with `0shopify-training-catalog.md`, then T0.1. They are written for a senior WooCommerce developer: every tutorial has a "Woo bridge" table mapping what you know to what is different here. Fast track to billable work: M0 → M1 → T2.1–T2.3 → M3 → M7, then Modules 4–6 alongside demo work. Distilled rules and notes on where the handbook has drifted: `docs/training-index.md`.

Do the tutorials in a **sandbox of your own**, outside this repo: your own **training dev store** (`asad-training`, created in the Partner organisation) and a folder of your own (for example `/Applications/MAMP/htdocs/shopify-training-asad/`) holding the repos the tutorials create — `dawn-playground`, `horizon-playground`, `checkout-extensions-lab`, `order-ping-middleware`. Not in this repo: both of us build the same labs with the same names and they would collide. Start each sandbox repo's `CLAUDE.md` from the template in T0.3. Report in to Yeasir as each tutorial's "Done when" section says.

The tutorials teach on Dawn first, then Horizon at T1.6. Our demos and new builds use **Horizon** (Dawn only for stores that already run it), so give T1.4 and T1.6 real weight.

---

## 8. Daily loop

```bash
git checkout main && git pull
git checkout -b <demo-id>
# Stage 1–2 of docs/demo-procedure.md: brief moved in → base theme → planted setup → before theme pushed → before clips
# spec → build in shopify-dev/<demo-id>/ → after theme + QA → handoff → video package
tools/shopify/theme.sh check <demo-id>
git push -u origin <demo-id>      # then open the PR
```

---

## 9. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `shopify: command not found` | Open a new terminal; check npm's global bin is on PATH (`npm config get prefix`). |
| Doctor: "no push --strict" | The CLI is old: `npm install -g @shopify/cli@latest`. If an old Homebrew `shopify-cli` is installed, `brew uninstall shopify-cli` first — npm can't replace its `shopify` link, and on macOS 14 `brew install`/`upgrade shopify-cli` builds its dependencies from source and can hang. |
| Doctor: "SHOPIFY_STORE not set" | `tools/shopify/.env.local` is missing or the line is empty (section 3). |
| Login loop or the wrong account | `shopify auth logout`, then run the command again and sign in with the Partner account. |
| `push` fails with Theme Check errors | Correct — pushes run `--strict`. Fix the errors (`theme.sh check <id>`), then push again. |
| The preview shows the password page | Enter the storefront password once in that browser; the capture toolkit does it for itself. |
| Theme library full | `tools/shopify/theme.sh list`, then `clean` finished demos. Never delete a theme you didn't create. |
| `git status` shows `.env.local`, `shopify.theme.toml` or `.shopify/` | `.gitignore` was edited, or you are not at the repo root. Stop and ask before committing anything. |
| `git push` rejected on `main` | Correct — nobody pushes to `main`. Push your branch and open a PR. |
| Claude Code starts in an auto/accept mode | Press Shift+Tab until it shows the default ask-first mode. |
| Claude answers a Shopify question from memory | Say "check that against the Shopify docs (MCP) first"; if it keeps happening, the `shopify-dev-mcp` server isn't loaded — `/mcp` to check. |

---

## 10. Windows

Asad's machine is a Windows PC: `docs/windows.md` is its step-by-step setup — tools, the voice key, the toolkit, checking on the dev store — with a check after each step. In short:

- Install Git for Windows (it brings Git Bash), Node LTS (`winget install --id OpenJS.NodeJS.LTS -e`), ffmpeg (`winget install --id Gyan.FFmpeg.Essentials -e`), then `npm install -g @shopify/cli@latest` in a new terminal.
- Run `tools/shopify/theme.sh` from **Git Bash** (it is a bash script). The Shopify CLI itself works in PowerShell too.
- If `shopify` isn't found after install, open a new terminal (PATH refresh).
- `.gitattributes` normalises line endings, so you will not see whole-file diffs.
- Everything else in this guide is identical.

---

Stuck anywhere? Message Yeasir with the exact command you ran and the exact output. Never work around a problem by editing `.gitignore`, the shared tooling or a live theme.
