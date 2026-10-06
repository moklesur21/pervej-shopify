# Workflow — branches, folders, stores, collaboration

How two people (and Claude) work in one repo without ever conflicting. Short version: **one branch per project, every file of a project carries its ID, shared files change only on `main`, and each person pushes themes to their own dev store.**

## 1. Three kinds of work

| Kind | Where it lives | Branch | Merged? |
|---|---|---|---|
| **Demo / project build** | `demos/<id>/` (paperwork) + `shopify-dev/<id>/` (code: `theme/`, and `app/`, `middleware/`, `pixel/`, `data/` when needed) | `<id>`, e.g. `s01-cart-drawer-lag` | Yes — PR reviewed line by line and merged by Yeasir, tagged `<id>`, branch deleted |
| **Shared change** — rules, docs, tooling, templates, the brief inbox, backlog, `.gitignore` | `CLAUDE.md`, `docs/`, `tools/`, `demos/_templates/`, `demos/_briefs/`, `demos/_backlog/`, root files | `chore/<topic>` | Yes — small and fast, merged by Yeasir |
| **Training** — T-series labs | Your own sandbox folder and training dev store, outside this repo, with its own git (T0.1) | — | Never |

## 2. IDs and names

- ID = platform letter + running number + slug: `s01-cart-drawer-lag`. The same ID names the brief file, the branch, `demos/<id>/`, `shopify-dev/<id>/`, the themes on your store (`<id> · before`, `<id> · after`), the tag and the recordings folder on the drive. `sNN` is the short form in commit messages. Next number: look at `demos/_briefs/`, `demos/` and `git tag`. WooCommerce demos (`wNN`) live in `pervej-woo`.
- Inside a theme there is no house prefix — the theme is the client's, white-label. Name our files for what they do (`sections/cart-drawer-progress.liquid`); the scope diff shows which files are ours.
- Lanes rotate A → B → A → C (demo plan §3.2); the lane is in the brief.

## 3. Starting a project

```bash
git checkout main && git pull
git checkout -b s01-cart-drawer-lag
mkdir -p demos/s01-cart-drawer-lag && git mv demos/_briefs/s01-cart-drawer-lag.md demos/s01-cart-drawer-lag/brief.md   # moved, never copied
cp demos/_templates/{spec,log,qa,handoff}.md demos/s01-cart-drawer-lag/
git add demos/s01-cart-drawer-lag && git commit -m "s01: brief"
tools/shopify/theme.sh new s01-cart-drawer-lag dawn          # untouched base: horizon (the default) for a new build, dawn when the client's store is Dawn-based (s01's is)
git add shopify-dev/s01-cart-drawer-lag/theme && git commit -m "s01: baseline — Dawn v16.0.0 (<sha>), untouched"
```

The full stage list — setup, before clips, spec, build, after clips and QA, handoff, video package, merge, publish — with the exact asks to Claude Code is `docs/demo-procedure.md`.

## 4. During the build

- Commit after every reviewed step (`s01 stage B: drawer re-renders only changed lines`). Push the branch often — backup and visibility for the reviewer.
- Theme Check before every commit that touches the theme: `tools/shopify/theme.sh check <id>`. The browser loop is `tools/shopify/theme.sh dev <id>` (a private development theme on your store).
- Need a shared change (a new rule, a template fix, a tooling fix)? Commit or stash, `git checkout -b chore/<topic> main`, make the change, open a PR, and back on the project branch run `git merge main` once it lands. Never edit shared files on the project branch.
- Collaborating on the same demo: both commit to the same branch, `git pull --rebase` before every push. Each of you pushes the theme to your **own** dev store to look at it — theme IDs and preview links are per store and live in your git-ignored `demos/<id>/media/themes.json`.
- Claude sessions: one task per session; paste the spec or brief into the session rather than relying on memory; `docs/house-rules.md` §0 for the ask patterns.

## 5. Finishing

1. Cold read the whole thing as a stranger's PR: `tools/shopify/theme.sh diff <id>` (from the setup commit; `baseline` to include the planted state). On GitHub, review the PR from the commit after the baseline — the untouched base theme is hundreds of files nobody needs to read. Fix nits as one `polish` commit.
2. Open the PR (GitHub UI). The other person reviews line by line; Yeasir merges (`--no-ff`).
3. Tag and clean up:
   ```bash
   git checkout main && git pull
   git tag s01-cart-drawer-lag && git push origin --tags
   git branch -d s01-cart-drawer-lag && git push origin --delete s01-cart-drawer-lag
   tools/shopify/theme.sh clean s01-cart-drawer-lag      # the demo's themes off your store
   ```
4. Undo any store data the demo created, as its `setup/README.md` lists. Merged demo code stays in `shopify-dev/` — that is the kit library.
5. Definition of done, two gates (`docs/demo-procedure.md` "Done"). Missing any one: not done.

## 6. What never enters git

`.env*` (except `.env.example`) — including `tools/shopify/.env.local` · Admin API tokens, Theme Access passwords, storefront passwords, webhook secrets · `shopify.theme.toml` and `.shopify/` (per-developer CLI state) · `node_modules/`, Function build output · videos and every demo's `media/` (clips, Lighthouse reports, voice, renders, `themes.json`) · Playwright `test-results/` · theme zips · Upwork material · `.idea/`, `.vscode/`. There is no database to share: each person's store lives in Shopify's cloud, and a demo's store state is reproduced by its `setup/`, never by copying stores.

## 7. Why this cannot conflict

- Two project branches only ever add files under two different IDs (`demos/<id>/`, `shopify-dev/<id>/`), and each moves its own brief out of `demos/_briefs/`.
- Shared files are edited on `main` only, one small change at a time.
- Each person pushes themes to their own dev store; theme names carry the demo ID. Nobody's preview overwrites anybody else's.
- Training labs share names (`dawn-playground`, `checkout-extensions-lab`…) — which is exactly why they live in personal sandboxes outside this repo and are never merged.
- `.gitattributes` normalises line endings, so a Windows clone never rewrites every file.
- Everything per-machine or per-person (store, passwords, tokens, CLI state) is git-ignored.

## 8. Stores

| Store | Whose | For |
|---|---|---|
| Demo store A | Yeasir | Weekly demos (briefs say "dev store A") |
| Demo store B | Asad | Weekly demos ("dev store B") |
| `<name>-training` | each person | T-series labs only |
| A fresh dev store | per full build | Full store builds (demo plan §6.2, §9); delete once recorded and merged |

All created in the Partner organisation — never under a personal login — with Asad as a staff member, so nothing walks away if the arrangement changes (demo plan §6.2).

## 9. Training in parallel

Both people train at their own pace in their own sandbox (T0.1), reading the handbook from this repo's `docs/handbook/` and reporting in as each tutorial says. Progress is tracked in `docs/training-index.md`. The fast track to billable work is M0 → M1 → T2.1–T2.3 → M3 → M7, then Modules 4–6 alongside demos; client checkout work waits for the T4.2 and T4.3 reps. Until Asad clears T2.1, Yeasir sits in the build seat for the weekly Shopify demo (playbook §2), and the Shopify demos double as Yeasir's Phase 0 ramp drills.
