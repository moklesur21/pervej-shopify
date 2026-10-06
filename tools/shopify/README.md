# tools/shopify — the demo theme loop

There is no local Shopify (T0.1): each person has their own **demo dev store** in our Partner organisation, and a demo's theme lives in git under `shopify-dev/<id>/theme/`. `theme.sh` moves that theme between the repo and *your* store without ever touching the live theme. When and by whom each command runs is `docs/demo-procedure.md`.

## Once per machine

```bash
npm install -g @shopify/cli@latest      # or: brew upgrade shopify-cli — the CLI must be 4.x (push --strict)
cp tools/shopify/.env.example tools/shopify/.env.local
# edit .env.local: SHOPIFY_STORE (your demo store), SHOPIFY_STOREFRONT_PASSWORD
tools/shopify/theme.sh doctor            # every line [ok]; the first store command opens the CLI's browser login
```

`.env.local` is git-ignored and yours alone. In a git worktree the script falls back to the main checkout's copy.

## Commands

| Procedure | Command | What it does |
|---|---|---|
| Stage 1 | `tools/shopify/theme.sh new <id> [horizon\|dawn] [ref]` | Copies an untouched base theme into `shopify-dev/<id>/theme/`: **Horizon by default** (house decision, strategy v1.4 — it has no release tags, so its current `main` commit, SHA printed for the commit message); `dawn` (`v16.0.0`) when the brief's client store is Dawn-based. Commit it as the baseline before any change. |
| Build loop | `tools/shopify/theme.sh dev <id>` | `shopify theme dev` on your store: a private development theme with hot reload. |
| After every stage | `tools/shopify/theme.sh check <id>` | Theme Check on the demo's theme. Zero errors. |
| Stage 2a, 4a | `tools/shopify/theme.sh push <id> before` · `… push <id> after` | Pushes to the unpublished theme `<id> · <label>` (creates it the first time, updates it after) with `--strict --nodelete`. The theme ID and preview link go to `demos/<id>/media/themes.json` (git-ignored) for capture, QA and the handoff. |
| Any time | `tools/shopify/theme.sh preview <id> [label]` | Prints the recorded preview link(s). |
| Any time | `tools/shopify/theme.sh list [<id>]` | The store's themes; the library is capped (20 on standard plans), so keep it clean. |
| Cold read | `tools/shopify/theme.sh diff <id> [setup\|baseline] [--stat]` | `git diff` from the demo's `"<sNN>: setup"` commit (default) or `"<sNN>: baseline"` commit to `HEAD` — the review range without the untouched base theme. |
| Stage 6 | `tools/shopify/theme.sh clean <id>` | Deletes this demo's unpublished themes from your store, after listing them and asking. Never the live or a development theme. |

What it will not do: push to the live theme, publish a theme, or delete anything it did not name. There are no flags for those — they are house-rule bans (`docs/house-rules.md` §14), not options.

## Conventions it relies on

- Demo ID = letter + number + slug (`s01-cart-drawer-lag`); `sNN` is its short form in commit messages.
- Commit subjects `sNN: baseline — …` and `sNN: setup — …` mark the two commits `diff` measures from.
- Theme names on the store: `<id> · <label>`. Two people never collide: each pushes to their own store.

Changing this script is a shared change: a `chore/` branch from `main`, reviewed and merged by Yeasir.
