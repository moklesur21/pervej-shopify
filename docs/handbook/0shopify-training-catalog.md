# Shopify Development for WooCommerce Developers
## Tutorial Series Catalog — Claude Code Edition

**Purpose:** Train a senior WooCommerce developer to deliver production Shopify work to our standard, using Claude Code as the build engine.
**Cost to run:** $0 — everything happens on a free Shopify Partner development store.
**Version:** 1.0 — September 8, 2026

> **In this repo** (`pervej-shopify`): all 26 tutorials are in `docs/handbook/`. The distilled index, drift notes and the progress table are `docs/training-index.md`; the rules by topic are `docs/house-rules.md`. Train in your own sandbox and training dev store, outside this repo. House decision since this catalog was written (strategy v1.4): new builds use Horizon; Dawn remains the learning base here and the fluency for existing Dawn stores.

---

## How this series works

Every tutorial follows the same five-part structure:

1. **Concept** — what this is in Shopify terms
2. **Woo bridge** — the WooCommerce equivalent you already know, and exactly where the mapping breaks
3. **Claude Code drill** — a guided build on the dev store, including the prompting approach
4. **Verification checklist** — proof it works (mirrors our delivery QA)
5. **Done when** — exit criteria before moving to the next tutorial

Request tutorials one at a time by ID (e.g., *"give me T1.3"*). Each arrives as its own `.md` file, named like `T1.3-sections-and-schema.md`. Keep them all in one folder — by the end, the series doubles as a permanent internal Shopify handbook.

**Three rules baked in from day one:** never build on a live theme · never ship unreviewed AI output · checklist on everything.

---

## Module 0 — Setup & Mental Model

| ID | Tutorial | Practice build |
|---|---|---|
| T0.1 | **Environment setup** — Shopify Partner account, dev store, Shopify CLI 3.x, Theme Check, Git | Scaffold Dawn locally, run `shopify theme dev`, push to the dev store |
| T0.2 | **The Shopify mental model for Woo devs** — hosted vs self-hosted, no PHP/server/database access, themes vs child themes, apps vs plugins, where data lives | Write your own Woo → Shopify mapping table; guided tour of the admin |
| T0.3 | **Claude Code for Shopify work** — connect `@shopify/dev-mcp`, set up the project `CLAUDE.md`, prompting patterns for Liquid, the line-by-line review discipline | Configure the project; make one AI-assisted edit and review it properly |

## Module 1 — Liquid & Theme Architecture
*The biggest conceptual delta from Woo. Sequential — don't skip or reorder.*

| ID | Tutorial | Practice build |
|---|---|---|
| T1.1 | **Liquid fundamentals** — objects, tags, filters vs PHP template tags and The Loop | A snippet that renders product data three different ways |
| T1.2 | **Theme anatomy** — layouts, JSON templates, sections, blocks, snippets, config, locales vs the Woo template hierarchy | Trace a product page's full render path, then alter it |
| T1.3 | **Sections & schema settings** — settings schema, presets, dynamic sources vs Customizer/ACF-driven parts | A custom section with merchant-editable settings |
| T1.4 | **Section groups & nested theme blocks** — header/footer JSON groups, block-in-block architecture | Rebuild a header as a section group; one nested-block layout |
| T1.5 | **Metafields & metaobjects** — vs post meta, ACF, and custom post types | A metaobject-driven feature (FAQ set or store locations) |
| T1.6 | **Dawn vs Horizon** — reference-theme conventions, web components, the shared architecture, when to use which | The same section built in both themes |

## Module 2 — Real Feature Work
*This is service S3 — the core billable skill.*

| ID | Tutorial | Practice build |
|---|---|---|
| T2.1 | **The Figma → section workflow with Claude Code** — our production method end to end | A complete section from a real Figma frame, Theme Check clean |
| T2.2 | **Theme JavaScript done right** — Dawn's web-component patterns, no jQuery, never breaking checkout/analytics scripts | An interactive component (tabs, accordion, or variant-picker UX) |
| T2.3 | **AJAX cart & cart drawer** — the Cart API vs Woo cart fragments | Cart drawer with free-shipping bar + upsell slot |
| T2.4 | **Collections, search & filtering** — storefront filters vs Woo product queries | A custom filtered collection experience |

## Module 3 — Performance
*Service S1.*

| ID | Tutorial | Practice build |
|---|---|---|
| T3.1 | **The Shopify performance model** — what you control here vs Woo (no server tuning, no cache plugins): images, JS, fonts, app bloat | Audit a store; written findings |
| T3.2 | **The speed-fix workflow** — Lighthouse before/after discipline, the common fixes, app-bloat surgery | Deliberately slow a theme, fix it, produce the before/after report |

## Module 4 — Checkout & Functions
*Service S2. Client checkout work waits until these reps are done — house rule.*

| ID | Tutorial | Practice build |
|---|---|---|
| T4.1 | **Checkout Extensibility overview** — what replaced checkout.liquid, what's possible on which plan, new vs classic customer accounts, all vs Woo checkout hooks | Map 5 common Woo checkout customizations to their Shopify equivalents |
| T4.2 | **Build a checkout UI extension** — first real extension | A working extension on the dev-store checkout (e.g., delivery-note field + trust badges) |
| T4.3 | **Shopify Functions** — discount and shipping logic vs Woo hooks/filters for the same | One working discount function |

## Module 5 — Integrations & Data
*Service S4.*

| ID | Tutorial | Practice build |
|---|---|---|
| T5.1 | **Tracking: web pixels & GA4** — vs Woo tracking plugins/GTM | A custom pixel; verify events fire through a full test order |
| T5.2 | **Admin API, Storefront API & webhooks** — vs WP REST + action hooks | A small webhook-driven integration through middleware |
| T5.3 | **Apps vs plugins & theme app extensions** — when theme code isn't enough, how to evaluate an app | Integrate an app block cleanly; document the evaluation |

## Module 6 — Specialized Services

| ID | Tutorial | Practice build |
|---|---|---|
| T6.1 | **B2B & wholesale on Shopify** (service S5) — companies, price lists, catalogs vs the Woo B2B plugin stack | Configure a working wholesale scenario |
| T6.2 | **Agent-ready storefronts** (service S6) — llms.txt / agents.md, structured data, storefront events, Catalog API | Make a dev store agent-ready |

## Module 7 — Delivery to Our Standard

| ID | Tutorial | Practice build |
|---|---|---|
| T7.1 | **Git & theme workflow discipline** — branches only, the duplicate-the-live-theme rule, GitHub theme integration, staging flow | Simulate a client change request end to end |
| T7.2 | **QA & handoff** — the full delivery checklist applied to Shopify, Loom walkthrough, definition of done | Full QA pass on an earlier build + a recorded handoff Loom |

## Capstone

| ID | Tutorial | Practice build |
|---|---|---|
| T8 | **Complete mini-store** — full page set, custom sections, cart drawer, one checkout extension, green Core Web Vitals, QA'd like a real client delivery | The store itself — his proof-of-skill artifact |

---

## Suggested pace

- **Part-time** (evenings + one weekend block): 2–3 tutorials per week → full series in roughly 9–11 weeks.
- **Fast track to billable** — matches our delivery rule (theme/section/speed work first, checkout work only after practice reps):
  **M0 → M1 → T2.1–T2.3 → M3 → M7** (~5–6 weeks part-time).
  After this he can take real section and speed tasks; M4–M6 continue alongside live work.
- Modules 4–6 can be reordered by client demand. Module 0–1 order is fixed.

## Ground rules (from our delivery standards)

- All work happens on a development store or a duplicated theme — never live.
- Claude Code output is reviewed line by line before it counts as done. **The review is the skill.**
- Every tutorial's verification checklist passes before it's checked off — no known-defect passes.
- Share strategy doc **Sections 8–9 only** (Delivery System, Tools) with him alongside this series; the rest of that document stays internal.

## Progress tracker

- [ ] T0.1 · [ ] T0.2 · [ ] T0.3
- [ ] T1.1 · [ ] T1.2 · [ ] T1.3 · [ ] T1.4 · [ ] T1.5 · [ ] T1.6
- [ ] T2.1 · [ ] T2.2 · [ ] T2.3 · [ ] T2.4
- [ ] T3.1 · [ ] T3.2
- [ ] T4.1 · [ ] T4.2 · [ ] T4.3
- [ ] T5.1 · [ ] T5.2 · [ ] T5.3
- [ ] T6.1 · [ ] T6.2
- [ ] T7.1 · [ ] T7.2
- [ ] T8 Capstone

---

*Maintenance: revisit this catalog after every Shopify Editions drop (winter/summer). Update titles here first, then write new tutorials — same "doc is the truth" rule as the strategy doc.*
