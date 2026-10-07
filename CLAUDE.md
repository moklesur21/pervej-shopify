# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

pervej.com Shopify practice builds ("demos", run exactly like client jobs) plus the house handbook and tooling behind them. Two people work here — Yeasir (lead, sole merger to `main`) and Asad (developer) — with Claude as the build engine. Every store is a Shopify **development store** in our Partner organisation; nothing here touches a live store. The WooCommerce twin is `pervej-woo` (same shape, same process). The full method is the T-series handbook in `docs/handbook/`; the distilled rulebook is `docs/house-rules.md`; lookup tables and platform facts that drift are `docs/reference/shopify-surface-map.md`; the demo process is `asset/pervej-demo-project-plan-v1.md`; the chat-to-repo handoff is `asset/pervej-demo-cycle-runbook-v1.md`; how the video and its post copy are made is `asset/pervej-demo-video-guideline-v1.2.md`, which takes precedence on that topic.

## Layout

- There is no local Shopify. Each person has their own **demo dev store** (Yeasir's "A", Asad's "B") set in their git-ignored `tools/shopify/.env.local`, plus a separate training store. A demo's theme moves between the repo and that store through `tools/shopify/theme.sh`; it is looked at through the unpublished theme's preview link.
- `demos/<id>/` — one folder per demo: `brief.md`, `spec.md`, `log.md`, `qa.md`, `handoff.md`, `setup/` (what the "before" plants and how to undo its store data), `capture/` (Playwright scripts, committed), `post/` (`script.md`, `copy.md`, `check.md`; `carousel.md` from the chat), `media/` (git-ignored: clips, renders, and `themes.json` with the theme IDs and preview links on *your* store). Start from `demos/_templates/`. Briefs from the project chat wait in `demos/_briefs/<id>.md` on `main` and are moved (`git mv`, never copied) to `demos/<id>/brief.md` when the demo starts; scored candidates wait in `demos/_backlog/candidates.md`.
- `shopify-dev/<id>/` — the demo's code: `theme/` is a full base-theme copy committed in a fixed order — `sNN: baseline — … untouched`, then `sNN: setup — …` (the planted before state), then the build stages; `app/`, `middleware/`, `pixel/`, `data/` only when the brief needs them. Merged demos stay as the kit library.
- `docs/` — `getting-started.md` (new developer setup), `workflow.md` (branches, collaboration, stores), `demo-procedure.md` (one demo start to finish: commands, the asks to Claude Code, log entries, captures, approvals), `windows.md` (the same pipeline on Asad's Windows PC), `house-rules.md` (every rule by topic), `training-index.md` (all 26 tutorials with takeaways, drift notes, progress), `reference/shopify-surface-map.md`, `handbook/` (catalog, strategy v1.4, T0.1–T8). Each person trains in their own sandbox outside this repo.
- `tools/shopify/` — `theme.sh` (new / dev / check / push / preview / list / clean / diff / doctor). `tools/video/` — the video toolkit (guideline §11): capture helpers, slide templates, `voice.mjs` (Yeasir's ElevenLabs voice clone, §10), `render.mjs` (with the music bed, clicks and typing in `audio/`), the §8 `check.mjs`. Same commands on macOS and Windows (`docs/windows.md`). Its README is the reference for writing `capture/`, `post/script.md` (with its Spoken column) and `post/copy.md`. Capture gets past the dev store's password page and records on the demo's preview themes (IDs from `demos/<id>/media/themes.json`).
- `asset/` — strategy v1.2, demo plan v1.2, content-engine playbook v1.0, proof-content ad strategy v1.0, demo cycle runbook v1.1, demo video guideline v1.2 — the same files as in `pervej-woo`. Read-only reference.

## Commands

```bash
tools/shopify/theme.sh doctor                    # Node, CLI 4.x (push --strict), .env.local, store
tools/shopify/theme.sh new <id> [horizon|dawn]   # untouched base theme into shopify-dev/<id>/theme/ — commit it first
tools/shopify/theme.sh dev <id>                  # shopify theme dev on your store (private development theme)
tools/shopify/theme.sh check <id>                # Theme Check — zero errors before any commit touching the theme
tools/shopify/theme.sh push <id> before|after    # unpublished theme "<id> · <label>", --strict --nodelete; preview link → demos/<id>/media/themes.json
tools/shopify/theme.sh preview <id>              # the recorded preview links
tools/shopify/theme.sh diff <id> [--stat]        # the review diff from the setup commit (base theme excluded)
tools/shopify/theme.sh clean <id>                # the demo's unpublished themes off your store (Stage 6)

npm --prefix tools/video run setup               # once per machine — toolkit packages + Chromium, then its doctor
node tools/video/capture.mjs <id> before|after|qa   # on the before / after preview theme — push it first
npm --prefix tools/video test                     # the capture side against a mock dev store, after any change to it
node tools/video/check.mjs <id>                  # the §8 self-check → post/check.md
node tools/video/voice.mjs <id>                  # only after Approval 1 is committed: the Spoken words in Yeasir's voice → media/voice/ (--dry first)
node tools/video/render.mjs <id>                 # after the voice → media/final/ (voiced, -14 LUFS)
```

Apps, extensions and Functions (only when a demo has `shopify-dev/<id>/app/`): `shopify app dev`, `shopify app generate extension`, `shopify app function run` (local fixtures before any deploy), `shopify app deploy` (a released version).

There is no automated test suite. Verification is evidence per acceptance criterion: Theme Check clean, a clean console and no `Liquid error` in rendered pages, a completed Bogus-gateway test order (card `1`) found in admin, Lighthouse mobile medians of three, and the demo's `qa.md` — all 17 rows — passed.

## Git model (why two people never conflict)

- `main` is shared truth and always mergeable. Only Yeasir merges to `main` (PR, reviewed line by line, `--no-ff`, tagged with the demo ID, branch deleted).
- One branch per demo, named by demo ID (`s01-cart-drawer-lag`), never by person. Every file of a demo lives under a path carrying its ID (`demos/<id>/`, `shopify-dev/<id>/`); each person pushes themes only to their own dev store, named `<id> · <label>`. Collaborating on one demo = both on that branch.
- Shared files (`CLAUDE.md`, `docs/`, `tools/`, `demos/_templates/`, `demos/_briefs/`, `demos/_backlog/`, `.gitignore`, `.mcp.json`, `README.md`) change only via a small `chore/<topic>` branch merged to `main`, never inside a demo branch. Demo branches `git merge main` to pick changes up. The only direct commit to `main` is the published-post line in a demo's `log.md` (Stage 7).
- Commit after every reviewed step. Review a demo from its setup commit (`theme.sh diff <id>`), never through the hundreds of base-theme files. Training labs are personal sandboxes and never enter this repo.
- Never commit `.env*`, Admin API tokens, Theme Access or storefront passwords, `shopify.theme.toml`, `.shopify/`, `node_modules/`, Function builds or a demo's `media/`. Store data (products, metafield definitions, discounts) is never "shared": a demo's `setup/` says how to reproduce and undo it.

## Hard rules (always on — the full set with reasons is `docs/house-rules.md`)

- **Never touch a live theme**: no push to it, no `--allow-live`, no CLI `--publish`. Work happens on `theme dev` or unpublished themes. Every push is a data operation — template, section-group and `settings_data.json` files are merchant data — so pushes run `--strict --nodelete`, and on any shared theme the JSON is pulled first; the merchant's JSON wins conflicts.
- **Current docs, not memory.** Verify every uncommon Liquid object/filter/tag, schema attribute, GraphQL field, CLI flag and any plan gating with the Shopify dev MCP before using it; never invent one. Stale patterns are review rejects: `checkout.liquid`, `{% include %}`, REST Admin snippets, jQuery, React-era checkout extensions (`useApi`, `@shopify/ui-extensions-react`).
- **Which surface first** (theme · settings/metafields/metaobjects · Function · checkout UI extension · pixel · app/API · config · not possible). "Is that a metaobject and a section?" before any app. Checkout work starts with "what plan, which surface?" verified that day.
- **Theme approach (strategy v1.4):** Horizon for new builds — our work in our own theme blocks, never edits to Horizon's files (its frequent updates overwrite them). Dawn only where the client's store already runs it. Match the architecture you find; a section takes theme blocks or section blocks, never both.
- Our code in our own files (sections, snippets, blocks, assets); any edit to a base-theme file is minimal and named in the spec. No house prefix inside themes — they are white-label.
- Liquid: only `nil`/`false` are falsy — test `!= blank`; money is cents, `| money` at output; `{% render %}` only; images via `image_url` + `image_tag`; `{{ content_for_header }}` is untouchable; every storefront string through `| t` from `locales/en.default.json` (setting labels in `en.default.schema.json`); `| json` probes never committed.
- Schema is written by hand before any prompt; `{{ block.shopify_attributes }}` on every block root; presets; per-instance scoping by `section.id` / `block.id`; reuse the theme's schemes, variables and classes — no parallel style system.
- JS: custom elements, one deferred asset per component loaded by its section, no libraries, no leaked globals; listeners cleaned up in `disconnectedCallback`; never intercept the checkout button, never wrap or rename the product form, publish cart changes through the theme's pubsub; keyboard and ARIA are in scope.
- Functions are pure (no network, clocks, randomness), money arrives as decimal strings, bad config fails closed, and deployed ≠ active. Extensions use only Shopify components and request no capability they don't use.
- Secrets (Admin API tokens, webhook secrets) come from env only; webhook HMAC over the raw body, timing-safe; ack fast, process async, idempotent.
- After any theme change: Theme Check clean, console clean, behaviour verified in the browser at a mobile width. No known-defect passes, ever.

## How to work with Claude here

- Plan mode first for anything non-trivial; one task per session; small scoped asks with the spec pasted in; every build ask ends with "list anything you could not implement, and why". No unrequested refactors or "while I was here" changes — they are reverted even when good; the scope diff (`theme.sh diff <id> --stat`) is checked before every push.
- Run read-only checks freely; show state-changing commands (pushes, deletes, `clean`, GraphQL mutations, admin changes) before running them. An AI-drafted write to a store is reviewed line by line before it runs.
- Features run the six-stage method (`docs/house-rules.md` §17): spec → interrogated plan (facts verified in current docs, at least one pushback) → staged build with a commit per stage → evidence per acceptance criterion → cold read → record "as built". Mid-build scope changes amend the spec first.
- Every diff is reviewed line by line by the developer before it counts. Anything corrected twice becomes a rule here (via a `chore/` branch).
- Demos have **two seats** (runbook §1). The *project chat* (claude.ai) mines the feed, scores candidates, holds the client fact sheet and the client role, writes the brief and drafts the Tuesday carousel. *Claude Code* (here) receives exactly one input per demo — `demos/<id>/brief.md` (client brief · mini approach · shoot list), already anonymised — and plans the rest itself: `setup/`, `capture/`, the build, and after handoff the video package.
- **Claude Code never invents client answers.** A real ambiguity goes back to the project chat; the answer is appended to `brief.md` under `## Q&A` with timestamps before `spec.md` changes. Putting a brief on the current template changes form only — §1 and §2 word for word, gaps listed for the chat. Queued briefs' dates are the chat's to reissue, never ours to edit.
- Claude Code never sees Upwork material. If a paste contains a job post, a feed, a poster's name or a marketplace link, stop and say so instead of using it.
- Every demo follows the video guideline. No build work starts before the before clips exist. Log times come from the system clock at the moment they happen — Claude Code writes them on "log X now", never from memory, never estimated. Never voice or render a video from an unapproved script. Every time, number and quote on screen comes from a file in the demo folder; a scene with no real material is dropped, never filled.
- Never touch `.gitignore`, `.mcp.json` or the shared tooling on a demo branch; propose the change instead.
- AI stays off screen: no mention of Claude or AI in briefs, handoffs, Looms, posts or any client-facing file; the terminal, editor, prompts, file paths, the store's password page, the preview bar and the admin never appear in a capture, a slide or a render.
- The voice is Yeasir's own ElevenLabs clone (guideline §10). The API key lives in the macOS Keychain or a user environment variable (`ELEVENLABS_API_KEY`); Claude Code never reads, prints or stores it — the toolkit reads it at run time.
- Everything local, the Shopify way (guideline §2, demo plan v1.2 §6.2): Shopify has no local store, so a demo is built (`theme dev`), captured and checked on your own dev store — capture and QA on its unpublished before and after themes, never through `theme dev`'s local preview, never published. Nothing else: no tunnel, proxy, public URL, mail server or extra software; the toolkit's Chromium and Claude's built-in browser only. Order emails are not checked — Shopify sends them, not the theme (a scope that changes an email is a scoped item); test orders use an `@example.com` email; phone widths are emulated, Chrome only, and `qa.md` names each check as what it was. The handoff has no walkthrough video and no link; its staging line reads "Practice build on a Shopify development store; not publicly available." The storefront password and the admin sign-in are typed by a person — in the built-in browser too — never by Claude Code.
