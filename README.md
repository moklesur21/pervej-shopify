# pervej-shopify

Shopify practice builds for pervej.com — run exactly like client jobs, captured from the before state to the handoff and cut into a LinkedIn video — plus the house handbook and tooling behind them. Development stores only; nothing here touches a live store. WooCommerce work lives in its own repo (`pervej-woo`) with the same shape.

Who: **Yeasir** (lead; reviews and merges), **Asad** (developer), **Claude Code** (build engine; the client role lives in the project chat, never here).

Read in this order: [`CLAUDE.md`](CLAUDE.md) (rules that are always on) → [`docs/workflow.md`](docs/workflow.md) (branches, collaboration, stores) → [`docs/house-rules.md`](docs/house-rules.md) (the full rulebook) → [`docs/demo-procedure.md`](docs/demo-procedure.md) (one demo, step by step) → [`asset/pervej-demo-project-plan-v1.md`](asset/pervej-demo-project-plan-v1.md) (how a demo runs) → [`asset/pervej-demo-cycle-runbook-v1.md`](asset/pervej-demo-cycle-runbook-v1.md) (what the project chat does and what this repo receives) → [`asset/pervej-demo-video-guideline-v1.1.md`](asset/pervej-demo-video-guideline-v1.1.md) (how the video and its post copy are made).

New on the team? Start with [`docs/getting-started.md`](docs/getting-started.md): tools, Partner access, your dev stores, your first branch and pull request.

## Map

| Path | What |
|---|---|
| `demos/` | One folder per demo (brief, spec, log, qa, handoff, `setup/`, `capture/`, `post/`; git-ignored `media/` for clips, renders and your store's theme links). `demos/_templates/` to start one; `demos/_briefs/` for briefs from the project chat waiting for their slot; `demos/_backlog/candidates.md` for scored candidates. |
| `shopify-dev/` | The code of every demo: `shopify-dev/<id>/theme/` (a full Horizon copy for new builds, Dawn for Dawn-based client stores), plus `app/`, `middleware/`, `pixel/`, `data/` when a brief needs them. |
| `docs/` | `workflow.md`, `house-rules.md`, `training-index.md`, `reference/shopify-surface-map.md` (where every ask lives; platform facts that drift). |
| `docs/handbook/` | The T-series handbook: catalog, strategy v1.4, tutorials T0.1–T8. The training *sandbox* is personal and lives outside the repo — see `docs/training-index.md`. |
| `tools/shopify/` | `theme.sh`: base theme, dev loop, Theme Check, push to your store's unpublished themes, review diff, clean-up. |
| `tools/video/` | The video toolkit: capture helpers, slide templates, render, self-check. Install and usage in its README. |
| `asset/` | Strategy v1.2, demo-project plan v1.0, content-engine playbook v1.0, proof-content ad strategy v1.0, demo cycle runbook v1.1, demo video guideline v1.1. Read-only reference. |

## First-time setup (each machine, about fifteen minutes)

```bash
git clone https://github.com/moklesur21/pervej-shopify.git
cd pervej-shopify
npm install -g @shopify/cli@latest                 # the CLI must be 4.x
cp tools/shopify/.env.example tools/shopify/.env.local   # then set SHOPIFY_STORE and SHOPIFY_STOREFRONT_PASSWORD
tools/shopify/theme.sh doctor                      # every line [ok]
```

- Your demo store and training store are created in our Partner organisation (`docs/getting-started.md` §1, `docs/demo-procedure.md` Stage 0).
- In Claude Code, approve the `shopify-dev-mcp` server from `.mcp.json`: Claude then answers Shopify questions from current docs, not memory.

## Daily loop

```bash
git checkout main && git pull
git checkout -b s01-cart-drawer-lag                       # branch = demo ID, never a person
mkdir -p demos/s01-cart-drawer-lag && git mv demos/_briefs/s01-cart-drawer-lag.md demos/s01-cart-drawer-lag/brief.md
cp demos/_templates/{spec,log,qa,handoff}.md demos/s01-cart-drawer-lag/
tools/shopify/theme.sh new s01-cart-drawer-lag dawn       # horizon (default) for new builds; dawn because s01's store is Dawn-based
# baseline commit → planted setup → push "before" → before clips → spec → build → push "after" + QA → handoff → video package (two approvals) → PR
tools/shopify/theme.sh check s01-cart-drawer-lag          # Theme Check clean before any commit touching the theme
git push -u origin s01-cart-drawer-lag                    # open a PR; Yeasir reviews line by line and merges
```

Naming, the no-conflict rules and how to finish a demo: [`docs/workflow.md`](docs/workflow.md).

## Never commit

`.env*` (your store, passwords, tokens), `shopify.theme.toml`, `.shopify/`, `node_modules/`, Function builds, videos and every demo's `media/`, theme zips. `.gitignore` enforces it and needs no edits for a new demo.
