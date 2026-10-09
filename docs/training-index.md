# Training index — the T-series handbook, distilled

Every document in `docs/handbook/` with what it teaches, what it builds, the artifacts it leaves behind and the rule it adds. Full rules by topic: `docs/house-rules.md`; lookup tables and drifting platform facts: `docs/reference/shopify-surface-map.md`. Each tutorial has the same five parts: Concept → Woo bridge (the WooCommerce equivalent and where the mapping breaks) → Claude Code drill → Verification checklist → Done when (closed-book questions answered out loud, report-in to the lead). The series is written for a senior WooCommerce developer; the Woo bridge tables are the fastest way in.

Three rules baked into every tutorial: never build on a live theme · never ship unreviewed AI output · a checklist on everything, no known-defect passes.

**Where training happens.** Each person trains in their own sandbox outside this repo, exactly as T0.1 prescribes: a personal **training dev store** in the Partner organisation (`<name>-training`, separate from your demo store so lab experiments never leak into demos) and a personal folder with its own git repos — the tutorials create several (`dawn-playground`, `horizon-playground`, `checkout-extensions-lab`, `order-ping-middleware`…). Suggested: `/Applications/MAMP/htdocs/shopify-training-yeasir`, and the same shape on Asad's machine. Both trainees build the same labs with the same names, which is why labs never enter this repo. Each sandbox repo gets its own `CLAUDE.md` from the T0.3 template. Report in to your lead as each tutorial's "Done when" says.

## Strategy & process docs

| Doc | What it is | Use it for |
|---|---|---|
| `asset/white-label-dev-strategy.md` (v1.2) / `docs/handbook/0white-label-dev-strategy.md` (v1.4) | The venture's single source of truth: white-label WooCommerce + Shopify dev for marketing agencies. Service menu S1–S7, delivery system §8 (workflow, build standards, QA checklist, comms, definition of done), tools §9, the Shopify catch-up ramp (Appendix A), roadmap, risks. v1.3 locked block-first for WordPress; v1.4 locks Horizon for new Shopify builds, Dawn as fluency for existing Dawn stores. §6 pricing and §12 risks are internal-only; the T-series catalog says to share §8–§9 with a trainee. | The QA checklist and DoD every delivery is judged by; the service each demo maps to. |
| `asset/pervej-demo-project-plan-v1.md` (v1.2) | One practice build a week, run like a client job. Rules §1.1, roles §2, gates G1–G5 and score S1–S6 §3, the brief §4, repo/branch model §5, environments §6 (§6.2 is Shopify: two dev stores, Shopify work on the dev store, each demo two unpublished themes), the workflow and QA checked where the demo runs §7, shots and one video per demo §8, rhythm §10, done §11. | The operating manual for `demos/`. |
| `asset/pervej-demo-cycle-runbook-v1.md` (v1.1) | Feed file → published proof: the one rule (Upwork stops at the project chat), the flow, the one brief file, chat vs repo, mid-build questions. | What Claude Code receives (one brief) and what it never sees. |
| `asset/pervej-proof-content-ad-strategy-v1.md` (v1.0) | What gets published from each build and why; Thought Leader Ads; gates and kill criteria (its carousel template and rhythm are replaced by the video guideline v1.4 §13). | The carousel's shape and the proof each post carries. |
| `asset/pervej-demo-video-guideline-v1.4.md` (v1.4, pilot) | The brief → a finished demo and three LinkedIn posts in one run: the voiced video, a carousel made from it, an insight post. Rules §2 (each post stands alone; everything local, the Shopify way), the one-run flow and "ask only when blocked" §3, capture §4, the script §5, the edit §6, the video copy §7, the carousel §7a, the insight post §7b, self-check, audit and the go §8, publishing Mon · Tue · Thu §9, the voice §10, files and toolkit §11, done §12, §13 amendments, pilot §14. | The `/demo <id>` run (`.claude/skills/demo/SKILL.md`), the post package, the go, and `docs/demo-procedure.md`. Takes precedence on the posts and their copy. |
| `asset/content-engine-playbook.md` (v1.0) | Upwork-mined practice projects → weekly content. Until the developer clears **T2.1** (Shopify) / W2.4 (Woo), Yeasir sits in the build seat. | Honest-framing rules; who builds this week. |
| `docs/handbook/0shopify-training-catalog.md` (v1.0) | The T-series catalog: modules, pace (part-time 9–11 weeks; fast track to billable M0 → M1 → T2.1–T2.3 → M3 → M7, ~5–6 weeks), ground rules. | Order of tutorials; Module 0–1 order is fixed. |

## Module 0 — Setup & mental model

| ID | Teaches | Practice build | Artifacts | Rule added |
|---|---|---|---|---|
| T0.1 Environment setup (2–3 h) | Partner account, dev store, CLI (4.x, Node 22.12+), `theme init` / `dev` / `check` / `push --unpublished` / `pull` / `list`, Git from commit #1 ("Dawn baseline (untouched)"). | Dawn scaffolded, hot reload proven, pushed unpublished. | `dawn-playground` repo. | `theme dev` is private; never the live theme. |
| T0.2 The Shopify mental model (2–3 h) | Platform vs stack; where code runs (Liquid on Shopify's servers, JS in the browser, apps on your infra, Functions at sockets); hooks vs webhooks; GraphQL-first; options/variants; collections; customers vs staff; apps vs plugins. The extension surface map. Admin tour: product with 6 variants, automated collection, Bogus gateway, test order, refund. | Own Woo → Shopify map (12+ rows), critiqued by Claude; 3 past Woo builds placed on the map. | `woo-to-shopify-map.md`. | Ask "which surface?" before "which hook?". |
| T0.3 Claude Code for Shopify (1.5–2 h) | Why model memory is more dangerous here; three layers (toolkit/dev MCP, `CLAUDE.md`, your review); the litmus test; five prompting patterns; the seven-item review protocol. | Sandbox `CLAUDE.md`; announcement-bar subtext setting, end to end on a branch. | `CLAUDE.md` template. | Current docs over memory; review protocol on every change. |

## Module 1 — Liquid & theme architecture (sequential; don't skip or reorder)

| ID | Teaches | Practice build | Artifacts | Rule added |
|---|---|---|---|---|
| T1.1 Liquid fundamentals (3–4 h) | Objects, tags, filters; context; `render` vs `include`; `{% liquid %}`; the five PHP gotchas (truthiness, no inline math, cents, silent failure, "filter" means transform). | `product-spotlight` snippet in three styles (card by hand, row by AI, debug via `\| json`); planted silent failure. | Lab section + snippet. | `!= blank`; `\| money`; remove `\| json` before commit. |
| T1.2 Theme anatomy (3–4 h) | Seven folders; template JSON = manifest, section = markup; `content_for_header` / `content_for_layout`; the merchant writes JSON too; `theme dev` replaces the dev theme; alternate templates; `request.page_type`; `theme console`. | Render-path trace; `product.spotlight.json`; editor change pulled with `--development --only` and diffed. | `notes/render-path.md`. | Pull → diff → decide on merchant JSON. |
| T1.3 Sections & schema (3–4 h) | Setting-type catalog, `info`, blocks, `block.shopify_attributes`, presets, `enabled_on`/`disabled_on`, dynamic sources, Dawn's `section.id` scoping. | Testimonials section from a hand-written schema; the merchant test; `show_rating` change request. | `notes/testimonials-spec.md`. | Schema is a product; write it by hand first. |
| T1.4 Section groups & theme blocks (3–4 h) | Header/footer groups (`{% sections %}` vs `{% section %}`); section / theme / app blocks; `/blocks`, `{% content_for 'blocks' %}`, 8-level nesting, 300-block cap; theme-or-section-blocks exclusivity; `tag: null`. | Utility bar in the header group; badge + stack + flexible-content nested layout; the exclusivity collision. | `notes/blocks-decision.md`. | Never both block kinds in one section. |
| T1.5 Metafields & metaobjects (3–4 h) | Definitions, the type catalog, the `.value` dance, rich text filters, metaobjects (publishable, web pages), access limits, no `meta_query`, definitions live in the store. | FAQ metaobject: global section, per-product section via a list reference, dynamic-source tagline; draft = nil. | `notes/metafields-decision.md`. | Blank-guard everything; store setup is scope. |
| T1.6 Dawn vs Horizon (3–4 h) | Two generations; Horizon's ten-theme family, nested blocks, Shadow DOM, AI blocks; mobile performance gap; no migration path; updates overwrite; 60-second architecture detection. | The same feature strip in both; Horizon with stock blocks, then one custom block. | `notes/architecture-detection.md`, `notes/dawn-vs-horizon.md`. | Match the architecture you find. |

## Module 2 — Real feature work (service S3)

| ID | Teaches | Practice build | Artifacts | Rule added |
|---|---|---|---|---|
| T2.1 Figma → section workflow (4–5 h) | Intake → read (structure, theme mapping, schema) → extract → build loop → merchant-proof & QA → package. Map to what exists; gap lists, not "make it closer". | A real Figma frame to a section, timed; then five more reps. | Templates 1–3 (build spec, master prompt, delivery notes); retros. | Spec first; "list what you couldn't match". |
| T2.2 Theme JavaScript (4–5 h) | Liquid renders, JS enhances; the no-JS ladder; custom elements; per-section `defer`; editor events and `Shopify.designMode`; Liquid → JS data; the never-break rules; ARIA tabs. | Accessible `<tabbed-content>` with `:defined` progressive enhancement; four proofs. | `notes/js-component-skeleton.md`, `notes/js-review-additions.md`. | Never break the scripts that make money. |
| T2.3 AJAX cart & drawer (4–6 h) | Cart AJAX API (cents, `key`, `422`); the `sections` parameter; Dawn's drawer machine (product-form → cart-drawer → pubsub); enhance, never rebuild. | Free-shipping bar with zero JS; upsell slot through the theme's own `product-form`; test order through the drawer. | `notes/cart-flow.md`; delivery notes (demo-store material). | Liquid renders, JS couriers. |
| T2.4 Collections, search & filtering (4–5 h) | `paginate`; sorting as URL state; filters are Search & Discovery config; `facets.js` courier; predictive search; the `WP_Query` replacement map. | Quick-filter bar (colour swatches, in-stock toggle) inside the theme's facet form. | `notes/filtering-flow.md`, `notes/query-map.md`. | Enhance the platform's machinery, never beside it. |

## Module 3 — Performance (service S1)

| ID | Teaches | Practice build | Artifacts | Rule added |
|---|---|---|---|---|
| T3.1 The performance model (4–5 h) | What the platform owns; the four levers; field vs lab; the eight-pass audit; ghost code; triage levels. | Outside-in audit of a real public store; self-audit of your Module 2 work. | Template 4 `audit-findings.md`. | Audit before fixing; sell with field, diagnose with lab. |
| T3.2 The speed-fix workflow (5–6 h) | Baseline → ranked fixes, one per commit, re-measured → function QA → after → report; 3-run medians; same environment; the fix playbook. | Sabotage a theme with six crimes, then surgery with attribution. | Template 5 `speed-report.md` ("method sample — training simulation"). | One fix → one measurement → one commit. |

## Module 4 — Checkout & Functions (service S2; client checkout work waits for these reps)

| ID | Teaches | Practice build | Artifacts | Rule added |
|---|---|---|---|---|
| T4.1 Checkout Extensibility overview (3–4 h) | `checkout.liquid` and Scripts gone; six surfaces; plan gating as a daily checkpoint; classic vs new accounts; the walls; Woo hook map. | Checkout editor tour; buyer walk-through narrated in surfaces. | `notes/checkout-translation-map.md` + three scoping scripts. | Plan and surface first, verified that day. |
| T4.2 Checkout UI extension (4–6 h) | Extension-only apps; `app init / generate / dev / deploy`; versions; TOML targets, capabilities, settings; Polaris web components (React legacy); attributes → order. | Trust badges block placed in the checkout editor; delivery-note field found on the order. | `checkout-extensions-lab` repo + its `CLAUDE.md`. | The scaffold is syntax truth; no React-era code. |
| T4.3 Shopify Functions (4–6 h) | Wasm, pure input → output; input query → logic → operations; decimal-string money; sockets; deployed ≠ active; local runner and run logs. | Config-driven threshold discount (shop metafield), activated by GraphQL, changed without a deploy. | `notes/t4-3-spec.md`, `notes/functions-map.md`. | Fail closed; config in metafields. |

## Module 5 — Integrations & data (service S4)

| ID | Teaches | Practice build | Artifacts | Rule added |
|---|---|---|---|---|
| T5.1 Web pixels & GA4 (4–5 h) | Sandboxed pixels, standard events, Customer Privacy API; official app vs custom vs app pixel; `checkout_completed` once; double-counting; theme → pixel bridge. | Debug pixel; GA4 custom pixel from a hand-written map; DebugView verification; upsell event bridged. | `notes/pixel-events.md`, `notes/tracking-audit.md`. | Verification is the deliverable. |
| T5.2 Admin API, Storefront API & webhooks (5–6 h) | Which door; custom-app tokens and scopes; versioning; cost-based limits; webhook semantics (signed, at-least-once, unordered, impatient, retried); middleware and the Flow ladder. | `orders/create` → Node middleware → Discord, with replay, tamper, failure and miss proofs. | `order-ping-middleware` repo, `notes/integration-map.md`. | Raw-body HMAC; ack fast; idempotent; reconcile. |
| T5.3 Apps & theme app extensions (4–5 h) | Every surface an app touches; legacy flags; "is that a metaobject and a section?"; rent framing; measured evaluation; clean app-block integration. | A reviews app evaluated with a measured delta and an uninstall test. | Template 6 `app-evaluation.md`. | Measure apps; style the wrapper, never the internals. |

## Module 6 — Specialised services

| ID | Teaches | Practice build | Artifacts | Rule added |
|---|---|---|---|---|
| T6.1 B2B & wholesale (S5, 5–6 h) | Native B2B on non-Plus since April 2026; companies → locations → contacts; catalogs, quantity rules, volume pricing; terms and checkout-to-draft; new accounts required; the gaps as a custom menu. | Two-location company, two catalogs, Net 30 + draft flows, Quick Order List, gated `b2b-welcome` section. | `notes/b2b-map.md`. | Plan first; behaviour attaches to locations. |
| T6.2 Agent-ready storefronts (S6, 4–5 h) | Three layers (Catalog syndication, UCP, open web); what makes an agent skip a product; the honesty ladder; JSON-LD rules; `agents.md` restricted context; verify via UCP. | Audit as an agent; fix data at source; JSON-LD; `agents.md` ship-or-default; UCP proofs. | `docs/agent-readiness-report.md`, `docs/s6-agent-readiness-checklist.md`, `notes/agentic-layer-map.md`. | Data before code; never an invented rating. |

## Module 7 — Delivery to our standard

| ID | Teaches | Practice build | Artifacts | Rule added |
|---|---|---|---|---|
| T7.1 Git & theme workflow (4–5 h) | Theme state model; push is a data operation; pull JSON first, `--strict`, `--nodelete`; merchant wins JSON conflicts; duplicate-live backups; library cap; GitHub integration and the bot; CLI-only path; access; "the diff is the deliverable". | One change request end to end, both paths, with a merchant edit mid-project and a rehearsed rollback. | `docs/deploy-runbook.md`, `notes/theme-workflow-card.md`. | Never push to live; scope diff before every push. |
| T7.2 QA & handoff (4–5 h) | QA as a separate act; the 18-check Shopify list with evidence; defect discipline; the Loom; the handoff package; DoD; warranty triage. | Four planted defects found blind; fixed; Loom; handoff. | `docs/qa-checklist.md`, `notes/delivery-card.md`. | Evidence for every check; purchase flow after every fix. |

## Capstone

| ID | Teaches | Practice build | Artifacts |
|---|---|---|---|
| T8 Complete mini-store (25–35 h) | No walkthrough: a brief (Kiln & Cove for a fictional agency), 23 pass/fail deliverables, four gates reviewed by Yeasir, a live review. | The store, delivered: sections, metaobjects, drawer, filters, extension, Function, tracking, agent-readiness, Git workflow, QA, handoff. | Evidence pack, **AI ledger**, capstone report. |

## Notes from checking the handbook (6 Oct 2026)

- **CLI version.** T0.1 says CLI 4.x (current); the strategy doc and catalog still say 3.x. Yeasir's machine had 3.53.0 from Homebrew, which has no `theme push --strict` — the flag T7.1 and our tooling rely on (now 4.8.4 from npm). Update before Stage 0: `npm install -g @shopify/cli@latest`, after `brew uninstall shopify-cli` if Homebrew installed it — on macOS 14 the Homebrew formula builds its dependencies from source and can hang. `tools/shopify/theme.sh doctor` checks for it. `--strict`, `--nodelete`, `--unpublished` and `--json` on `theme push` were confirmed on shopify.dev the same day.
- **Base theme.** The series teaches on Dawn first (T0.1: the simpler learning base) and brings Horizon in at T1.6 — keep that order for training. For demos and client builds the house decision (strategy v1.4) is Horizon for new builds and Dawn only for existing Dawn-based stores, so T1.4 (theme blocks) and T1.6 carry extra weight. The series was written against Dawn 15.x; the latest tag is `v16.0.0`. Horizon publishes no tags — pin by commit; its internals move fastest, which is exactly where T1.6 says the toolkit lookup is least optional.
- **Toolkit.** T0.3 recommends the Shopify AI Toolkit plugin (`shopify-ai-toolkit@claude-plugins-official`) and accepts the standalone Dev MCP. This repo's `.mcp.json` ships the Dev MCP so every clone has current docs; install the plugin as well when you reach T6.2 (it carries the `ucp` skill) and decline the duplicate server if both load.
- **Catalog wording.** "Request tutorials one at a time by ID" dates from when the series was being written; all 26 are now in `docs/handbook/`. Progress is tracked below, not in the catalog's checklist.
- **T7.2** cites "W1.6's planted-bug method" — that tutorial lives in the W-series in `pervej-woo`.
- **Plan gating** (T4.1) is explicitly unsettled in the series itself: the Winter '26 expansion versus the API reference for info/shipping/payment-step extensions. Treat it as the per-client checkpoint the tutorial makes it.
- **Dev-store gates** (T6.2): password protection blocks the UCP endpoint and some Agentic pages; the tutorial's live-store fallback (read-only calls) applies.

## Progress (observed 6 Oct 2026 — update as tutorials are checked off)

| Person | Position | Evidence |
|---|---|---|
| Yeasir | Not started | No Shopify sandbox yet. Woo track: W1.3 in progress (`pervej-woo/docs/training-index.md`). |
| Asad | Not started | — |
| Claude | All 26 tutorials, the catalog and the six asset docs read in full; distilled into this index, `docs/house-rules.md` and `docs/reference/shopify-surface-map.md`; CLI flags confirmed on shopify.dev | This index, `CLAUDE.md`. Claude does not run the drills: they build the human reviewer's judgement on a dev store. Claude's side is the rules above plus current docs through the Dev MCP at build time. |
