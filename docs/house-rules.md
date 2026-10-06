# House rules — the consolidated rulebook (Shopify)

Every rule here comes from the T-series handbook (`docs/handbook/`), the strategy doc (delivery system §8) or the demo plan / content playbook / demo cycle runbook / demo video guideline (`asset/`). The tutorial that teaches a rule is in brackets — go there for the why and the drill. `CLAUDE.md` carries the always-on subset; this file is the full set, by topic. Platform numbers that drift (limits, plan gating, API shapes) are collected in `docs/reference/shopify-surface-map.md` with the date they were last checked.

Three rules under everything: never build on a live theme · never ship unreviewed AI output · a checklist on everything, no known-defect passes.

## 0. Working with Claude Code [T0.3, T2.1, T2.2, T3.1]

- House mode is ask-first. Any mode that lets Claude act without asking is not used — the asking *is* the review. Plan mode first for anything non-trivial. One task per session; `/clear` between topics.
- **Current docs, not memory.** Shopify retires and replaces things on a schedule and the internet is full of stale advice (`checkout.liquid`, REST Admin snippets, `{% include %}`, React-era extensions). Claude Code has the Shopify dev MCP (`.mcp.json`) or the Shopify AI Toolkit plugin, and looks up anything uncommon — Liquid objects and filters, schema attributes, GraphQL fields, CLI flags, plan gating — before using it. Never invent an object, filter, tag, schema attribute, API field or flag.
- Ask small, the five patterns: anchor to exact files · state the schema (or behaviour spec, or event map) up front, hand-written · constrain the finish line ("Theme Check clean, strings in locales, match the theme's existing patterns, smallest possible diff") · use the Woo brain as the prompt ("in Woo I'd hook X — what's the idiomatic surface here?") · make it teach (explain any idiom that differs from PHP).
- Every build prompt ends with **"list anything you could not match or implement, and why"** — silent AI compromises become a visible list you triage [T2.1].
- Iterate with specific gaps ("card gap is 24, design shows 32"), never "make it closer to the design" [T2.1].
- **Review protocol on every diff** before approval: (1) every changed line read and explainable; (2) anything unfamiliar verified in the docs; (3) diff scope — nothing outside the expected files (`git diff` is the truth); (4) strings in locale files; (5) Theme Check clean; (6) behaviour verified in the browser, including a mobile width; (7) committed on the branch with a message saying what and why. **JS additions** [T2.2]: every `document`/`window` listener has a matching cleanup; no `preventDefault` that can reach beyond the component; ARIA state really updates (inspect, don't assume); `:defined` progressive-enhancement CSS present. **Performance clause** [T3.1]: images sized and lazy below the fold, scripts deferred, `width`/`height` present on anything we ship.
- Nothing unrequested — bonus refactors, "tidied" unrelated files and fixed typos nobody asked about are reverted, not shipped. The scope diff catches them [T7.1].
- Corrected twice → a written rule (`CLAUDE.md` or this file, through a `chore/` branch). `CLAUDE.md` = permanent rules, lean; `demos/<id>/brief.md` and `spec.md` = per-feature truth, pasted into the session when relevant.
- Claude runs read-only checks freely and shows state-changing commands (pushes, deletes, GraphQL mutations, admin changes) before running them. An AI-drafted write to a store is reviewed line by line — right IDs, right namespace/key/type, no collateral overwrites, safe to re-run — or it doesn't run [T6.2].
- Debugging: reproduce → read the evidence (console, Network tab, `| json`, Theme Check, Function run logs) → 2–3 ranked hypotheses with the cheapest probe for each → one probe → fix → verify. Probes (`| json` dumps, `console.log`, layout comments) are never committed.

## 1. Where code lives — the extension surface map [T0.2, T4.1, T5.3]

- First question on every ask: **which surface?** Storefront look/behaviour → **theme** (Liquid + CSS + JS) · merchant-editable content/data → **section settings, metafields, metaobjects** · discount/shipping/payment/validation logic → **Shopify Functions** · anything inside checkout UI → **checkout UI extension** (never theme code) · analytics → **web pixel** · sync, automation, external systems → **app: Admin API + webhooks** (after Flow and no-code) · none of these → possibly not possible; check, then say so early and plainly.
- There is no `functions.php`, no server, no database, no hooks that intercept a page render. Webhooks react after the fact; only Functions intercept, and only at the sockets Shopify opened.
- **"Is that a metaobject and a section?"** before any app. FAQs, size charts, lookbooks, trust badges, upsell slots, quick filters are afternoon builds with no monthly rent [T5.3].
- Update-safe = our code in our own files (sections, snippets, blocks, assets), merchant data in settings and metafields, minimal edits to the base theme's files — a core edit is called out in the spec. There are no child themes: the theme copy is a fork [T0.2, T1.2].
- **Match the architecture you find** — the 60-second detection: `/blocks` populated, `{% content_for 'blocks' %}` and `"@theme"` → theme-block world; schemas with their own `blocks` arrays → section-block world. Consistency beats preference on client work; preference only votes on greenfield builds [T1.6].
- **Theme approach (locked, strategy v1.4):** Horizon is the base for every new build and full redesign — custom work as our own theme blocks, never edits to Horizon's files, because its frequent (often weekly) updates overwrite direct customisations; code that has to touch its internals is quoted with maintenance care, and every Horizon build carries the T3 speed pass (default Horizon has trailed Dawn on mobile). Dawn stays a first-class fluency for the stores clients already run: a healthy, tuned Dawn store stays on Dawn; a messy Dawn fork blocking the merchandising team is a rebuild, quoted as a rebuild (no migration path exists) [T1.6].

## 2. Liquid [T1.1, T1.2]

- Liquid fails silently: a typo renders nothing. Defences: Theme Check, `| json` (removed before commit), view-source, your eyes.
- Only `nil` and `false` are falsy — `""` and `0` are truthy. "Has a value" is `!= blank`.
- Money is integer subunits (cents) everywhere; `| money` at output, comparisons in cents. No inline math or concatenation: math is filters, strings are `append` / `capture`.
- `{% render %}` (isolated scope) only — `{% include %}` is deprecated and a review flag. Pass everything explicitly.
- Escape merchant- or customer-supplied text (`| escape`). Images through `image_url: width:` + `image_tag` (srcset, sizes, width, height).
- Every storefront string through `| t` from `locales/en.default.json`; setting labels in `en.default.schema.json`. In a custom section, every piece of storefront text is a setting [T1.3].
- `{{ content_for_header }}` is never removed or moved; `{{ content_for_layout }}` is where the page goes. Templates (`templates/*.json`) are manifests — the markup is in the sections they name. Page type is `request.page_type`.
- No `WP_Query`: the query map in `docs/reference/shopify-surface-map.md` says which tool answers "I need products by X" [T2.4].

## 3. Sections, blocks and schema [T1.3, T1.4]

- **Schema is a product shipped to a non-developer.** Write it by hand before any prompt; labels, `info` lines, sensible defaults and `header` grouping are the deliverable. Compose from the fixed setting-type catalog — never invent controls or attributes.
- `{{ block.shopify_attributes }}` on every block's root element. `max_blocks` set. A preset makes a section addable; `enabled_on` / `disabled_on` fence it (e.g. keep it out of header and footer groups).
- Scope every instance: Dawn's `{% style %}` block keyed by `section.id` (mobile padding at 75%); in Horizon-style blocks, a unique ID from `block.id`. Larger CSS in a per-section asset loaded inside the section. Two instances on one page must not interfere.
- Prefer the theme's colour schemes, CSS variables, button classes and `page-width` container — never a parallel style system (rejected in review) [T2.1].
- Section groups (`{% sections 'header-group' %}`) carry merchant-composable header/footer areas; merchant edits land in that group's JSON.
- Theme blocks live in `/blocks`, need their own preset, nest up to 8 levels; a section accepts theme blocks **or** section blocks, never both. `"tag": null` means exactly one root element carrying `{{ block.shopify_attributes }}`.
- Merchant-proof every section: empty settings, long text, reorder, delete, two instances on a page, the 360 / 390 / 768 widths. "Editable but unbreakable": block limits, defaults, empty states, no free-form HTML settings for non-technical editors [T8 rule 6].

## 4. Custom data [T1.5]

- Metafields with **definitions** (Settings → Custom data): typed, validated, editable in admin, connectable as dynamic sources. Ad-hoc metafields are not delivery quality.
- The `.value` dance: metafield → `.value`; list metafield → `.value` is the array; metaobject entry → no `.value`; entry field → `.value`. Rich text through `| metafield_tag` or `| metafield_text`. Blank-guard everything; a draft metaobject entry is `nil`.
- No `meta_query`: model the data for its access pattern (references, lists, handles) or use the APIs.
- Definitions and entries live in the **store**, not the theme: theme code blank-guards, and store setup is part of the scope (and of a demo's `setup/README.md`).
- Editor road (dynamic sources into existing settings) when the markup already fits and the merchant owns the mapping; code road (sections reading metafields/metaobjects) for custom markup, lists, logic. Most builds use both.

## 5. Theme JavaScript [T2.2]

- Liquid renders, JS enhances: if the script fails, content stays usable. Walk the no-JS ladder first — CSS, then native HTML (`<details>`), then a small component.
- Components are custom elements (`connectedCallback` wires, `disconnectedCallback` cleans document/window listeners), self-initialising and editor-proof. One asset file per component, `defer`, loaded inside the section that needs it. No jQuery, no external libraries (no Swiper, no Slick), no leaked globals, no monkey-patching `window.Shopify` or `fetch`.
- Liquid → JS through data attributes (scalars) or a `<script type="application/json">` block (structures) — never interpolated into JS code.
- **Never-break rules:** no global click/submit handlers that `preventDefault`/`stopPropagation` outside the component's root · never remove, wrap or rename the product form, its inputs or platform script tags · extend cart behaviour through the theme's event bus (Dawn's `pubsub.js`) · after any JS work, the full add-to-cart flow still works and the console is clean.
- Editor delight: `shopify:block:select` reveals the block being edited, guarded by `Shopify.designMode`, listener cleaned up.
- Accessibility is in scope: ARIA roles and states, roving `tabindex`, keyboard (arrows, Home/End, `Esc`), visible focus. A component without keyboard support is a defect.

## 6. Cart and discovery [T2.3, T2.4]

- Cart AJAX API (`/cart.js`, `/cart/add.js`, `/cart/change.js`, `/cart/update.js`): amounts in cents, lines addressed by `key`, a `422` description is shown to the customer — never silence.
- Ask for re-rendered sections with the `sections` parameter and swap the HTML: Liquid stays the single renderer, JS is the courier. Anything rendered inside the drawer section updates on every cart change for free.
- On Dawn-shaped themes, **enhance the drawer, never rebuild it**: extend `product-form`, publish through pubsub, and never intercept the checkout button (a plain submit to `/checkout`).
- A free-shipping bar is marketing UI; actual free shipping is a shipping setting or a Function — sell them as one deliverable, know they are two systems. Multi-currency thresholds are a scoping question.
- Which filters exist is merchant config (Search & Discovery app), not code; a missing filter is usually missing data. Custom filter UI lives **inside** the theme's existing facet form so its fetch, swap and `pushState` drive it; the GET form keeps a no-JS fallback.
- `{% paginate %}` around collection loops (50 cap without it). Sorting and filtering are URL state.

## 7. Performance [T3.1, T3.2]

- The platform owns hosting, CDN, caching and checkout; a slow store is slow in the front end. The four levers: images · JavaScript · fonts · app bloat.
- Audit before fixing, eight passes: baseline · waterfall · images (find the LCP element) · JS (coverage, long tasks) · app attribution (embeds, ghost code) · fonts · CLS · triage (config / code / conversation, ranked impact × effort). No fixes during an audit. The findings doc (T3.1 template 4) ends in a plain-language summary an account manager can forward.
- Measure: Lighthouse mobile, incognito, **three runs, the median**, same environment before and after (a preview link, never localhost for client-facing numbers). Field data (CrUX, the admin Web performance report) sells; lab data diagnoses. Thresholds: LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms.
- Fix: one fix (or tight group) → review → commit → re-measure → attribution line. The LCP image is never lazy and gets priority (`preload_tag` or `fetchpriority: 'high'`); everything below the fold is lazy; everything has `width`/`height`.
- App surgery: toggle off unused app embeds **with client sign-off** (the app belongs to the client); remove ghost code one ghost per commit; say plainly that a live app's own code is its vendor's.
- Performance fixes must not regress function: full purchase flow after surgery. The report (T3.2 template 5) says honestly what didn't move, and its next-steps section is the next quote.

## 8. Checkout and Functions [T4.1, T4.2, T4.3]

- First question on any checkout job: **what plan is the store on, and which surface does the ask touch?** — verified against current docs that day. Plan gating is the most stale-memory-prone fact in the series. Client checkout work waits until the T4.2 and T4.3 reps are done.
- `checkout.liquid` and Shopify Scripts are gone. The six surfaces: checkout UI extensions · the checkout editor · branding · Functions · web pixels · thank-you / order-status / post-purchase extensions. Accounts fork: classic (Liquid `templates/customers/`) vs new (extensions and settings) — check the mode before quoting account work.
- The walls, said early: no reordering checkout steps · no arbitrary CSS or DOM on checkout · no scripts injected into checkout · no custom payment UI outside the sanctioned surfaces · no arbitrary surcharges (discount Functions only go down).
- Extensions ship inside an **extension-only app**, versioned with `shopify app deploy`; decide early whose Partner organisation owns a client's app (white-label). The TOML is the contract: targets, minimal capabilities (request none you don't use), merchant settings edited in the checkout editor.
- **The scaffold is the source of syntax truth**: current extensions use Polaris web components; React-era code (`useApi`, `@shopify/ui-extensions-react`, ≤ API 2025-07) is an automatic reject. Shopify components only, no DOM, no CSS overrides — merchant branding always wins. Checkout data goes through attributes or the note, which land on the order.
- Functions are pure: no network, no clocks, no randomness, tiny budgets. Everything the logic needs arrives in the input query; configuration lives in metafields/metaobjects so merchants change behaviour **without a deploy**. Money arrives as decimal strings — never casual float math. Bad or missing config fails closed: no operations, never an error. Local `shopify app function run` against fixtures before any deploy; Function run logs for forensics.
- **Deployed ≠ active**: a discount must be created that uses the function (admin UI or the GraphQL mutation).

## 9. Tracking [T5.1]

- Web pixels run sandboxed and subscribe to the standard event stream; they never touch the page. Plain "we want GA4" → install and verify the official Google & YouTube app. A custom pixel earns its keep for GTM, custom dimensions, extra destinations or an agency's measurement spec; an app pixel when it's productised.
- Watch the stream first with a debug pixel; write payload paths **from observation**, then hand-write the event map (Shopify event → GA4 event → params), then build strictly from it. Currency and value from the payload, never hardcoded. No PII.
- One source of truth per destination: the official app and a custom pixel both sending `purchase` to one property doubles revenue. Pixel inventory (Settings → Customer events) is an audit stop.
- Not done until the full funnel is watched landing in GA4 DebugView with `purchase` exactly once and correct `transaction_id`, `value`, `currency`, items — screenshots in the delivery notes. Custom theme features reach pixels through `Shopify.analytics.publish`.

## 10. APIs, webhooks and middleware [T5.2]

- Acting as the store or back office → Admin GraphQL API; acting as a shopper or building a buying surface → Storefront API. REST Admin is legacy.
- Client integrations authenticate through a custom app with **minimum scopes**; the token is a password to the business — env vars or a secret manager, never a repo, a chat message or client-side code. The API version is pinned in the URL and dated in the delivery notes. Rate limits are cost-based: read `throttleStatus`, back off on `THROTTLED`; bulk operations for big reads and writes.
- Webhook handlers: HMAC-SHA256 over the **raw body**, timing-safe compare, before trusting a byte (body parsing first is the #1 bug) · `200` fast, real work async · idempotent on the delivery ID · tolerant of any order · failures monitored · a reconciliation sweep through the Admin API for critical flows — webhooks notify, the API is truth.
- The ladder before code: Shopify Flow → Zapier/Make → middleware. Quoting middleware for a Flow-sized problem is billing for ego.

## 11. Apps [T5.3]

- An app = monthly rent + a performance cost on every visit + a data-custody question; custom = a build once + maintenance. Measure all three.
- Evaluate with T5.3's template 6: fit · integration surface verified on install · **measured Lighthouse delta (3-run medians)** · data custody and an **uninstall test** (embeds gone, refs dangling, weight back) · quality signals · cost math · plan interactions · verdict · forwardable summary.
- Integrate app blocks through the editor into `@app`-accepting sections; style the wrapper, never the internals; configure in the app's own settings; document app, config, placement and delta. ScriptTag injections and direct theme-code edits are flags on sight — they are where ghost code comes from.

## 12. B2B and wholesale [T6.1]

- Plan first. Since April 2026 non-Plus plans run native B2B (companies, up to 3 catalogs via Markets, terms, volume pricing, quantity rules, vaulted cards); Plus keeps unlimited catalogs, direct assignment to companies and locations, deposits and partial payments. Verify per client.
- The model is entities, not roles: company → locations (where catalogs, terms and checkout behaviour attach) → contacts with per-location permissions. B2B requires new customer accounts.
- Gated theme content uses the B2B context objects — verified with the dev MCP at build time; this corner drifts.
- The gaps are the custom menu: no public wholesale application form (form → middleware → Admin API → approval — the flagship S5 build), no real RFQ, rep tooling on Plus/apps.

## 13. Agent-ready storefronts [T6.2]

- Three layers, three owners: syndication (Catalog + Agentic Storefronts — the merchant flips switches, we fix the data, Shopify syndicates) · protocol (UCP — Shopify's; we only consume it to verify) · open web (theme JSON-LD, `robots.txt.liquid`, `agents.md.liquid` — ours).
- The work is product data, not code: taxonomy categories and category metafields, attributes as metafields not prose, barcode/vendor/type, factual descriptions, alt text, published policies, Combined Listings. Honesty ladder: platform default → data + theme readiness (S6) → Catalog Mapping → a custom assistant is an app build, not S6.
- JSON-LD through the `json` filter, never string-concatenated; exactly one Product entity per page; `aggregateRating` only from real review data, never invented. Allowing AI crawlers is the merchant's decision, surfaced with the trade-off. `agents.md.liquid` sees only `request` and `agents` — ship it only when the managed default is wrong, and record why.
- Verify through the store's UCP endpoint (`tools/list`, `search_catalog`, `get_product`) with before/after evidence; dev-store gates are logged as "verify on live after deploy".

## 14. Git, themes, deploy [T7.1]

- **Never edit or push to a live theme.** `--allow-live` and CLI `--publish` are banned on any store we work on. `tools/shopify/theme.sh` has no flag for either.
- Every push is a data operation: template, section-group and `settings_data.json` files are **merchant data** in the same folder as code. Pull JSON from the target theme before pushing to it; push `--strict` (Theme Check must pass) and `--nodelete`; `--only` for surgical pushes; in a JSON conflict the merchant's version wins unless the scope changed that setting.
- Only theme code stages (an unpublished theme on the same store). Products, discounts, shipping, checkout settings and apps are live on save — they need a staging store or a written runbook with export-before-change and a rollback; say which in the scope.
- Before any deploy: duplicate the live theme, named `YYYY-MM-DD · live backup · pre-<task>`. Rollback = publish the backup. Respect the theme library cap: keep the last two backups, retire older ones after their warranty.
- GitHub integration: two-way sync; the `shopify` bot commits every editor save to the connected branch — `git pull` before every session. One branch ↔ one theme; a disconnected branch can't reconnect. CLI-only path when the agency refuses the app: every task starts with `shopify theme pull --live` and a commit.
- **The diff is the deliverable**: `git diff --stat` against the base before any push; out-of-scope hunks are reverted and listed (an AI-assisted-build rule).
- Access through collaborator accounts with scoped permissions, or a Theme Access password for CLI-only work — never a shared owner password. No secrets in repos; never mix one client's code into another's.

## 15. QA, handoff, definition of done [T7.2, strategy §8.3–§8.5]

- QA is a separate act: fresh eyes, from the checklist, ideally the next day. AI-built code looks finished, which is exactly when attention switches off.
- The 18 checks (`demos/_templates/qa.md`): functional + edge cases · purchase flow with a test order · 360/390/768 + a real device · Chrome, Safari, Firefox, iOS Safari · Theme Check · no hardcoded strings · console and Liquid-error grep · Lighthouse medians · cart/checkout scripts · rollback · walkthrough · theme editor pass · app blocks and embeds · accessibility floor · store-state variants · structured data · debug leftovers · scope diff. Evidence for each — the agency should never have to trust us, only look.
- Test orders: the test gateway on dev stores (card `1` success · `2` declined · `3` error). On a client's live store, never flip Shopify Payments test mode without the agency's explicit go — it blocks real checkouts; propose a low-value order with a 100% discount code, tagged and refunded.
- Defects: ID · severity (S1 blocks purchase · S2 scoped feature wrong · S3 minor · S4 cosmetic) · steps · expected vs actual · evidence · fix commit · re-test. S1–S2 always block; S3–S4 block unless descoped in writing. A fix is a change: re-run what it touches **and** the purchase flow.
- Handoff Loom (3–5 min, preview theme, clean profile): the brief restated → the feature working, desktop then phone, with an edge case → how the merchant edits it → what was checked, shown → limits, backup name, warranty. The agency's name, "the team"/"we", never a personal brand, never a word about AI.
- Handoff package in the agency's voice: summary · what changed · how to use it · QA evidence · known limits / out of scope · backup and rollback · warranty dates · one optional next step.
- Done = scoped items delivered (nothing missing, nothing extra) · QA 100% with evidence · staging approved or the 5-business-day window elapsed · deployed with a backup · handoff and Loom sent · warranty clock started. 14-day warranty on delivered scope; a revision during staging review is not a strike; new behaviour is a change order; app updates and the merchant's own editor changes are diagnosed once, then quoted.

## 16. Demo projects and content [demo plan §1.1, §2, §3, §4, §6.2; playbook §1; runbook §1–§5; video guideline §2–§4, §8–§9]

- Every post, video and slide carries *"Practice build from a public job brief. Anonymised."* Never "client", never "case study", never an invented result. Recreate the category of problem, never the poster's bug; nothing identifying (store name, URL, brand, product line, verbatim text).
- Upwork is read-only and Yeasir-only; its interface never appears on screen or in a file; briefs are retyped and paraphrased. Asad and the VA never touch it.
- Real timestamps: the clock starts at "brief received" and stops at handoff; setup and the before clips run off the clock and are logged as such. Every time in `log.md` is written from the system clock at the moment it happens; a missed time comes from a commit or file timestamp or stays blank, never estimated. Times shown on screen are the log's, unconverted; the delivery date promised is the one in `spec.md`; effort is never totalled or headlined.
- AI stays off screen: the Claude Code terminal, editor, prompts, file paths and generated code never appear in a capture, a slide or a render; no AI mention in briefs, handoffs, Looms, posts or client-facing files. Shopify's password page, preview bar and admin username stay out of frame.
- Dev stores only — two Partner dev stores for the weekly demos, one each, created in the Partner organisation (never a personal login); full builds get a fresh dev store. Nothing from the day job or under NDA. Free or licensed bases only (Dawn, Horizon, our kits); no paid-theme code; no images or copy lifted from real stores.
- Reviewed before it counts: the other person reviews every PR line by line; Yeasir merges.
- Two seats, one seam. The **project chat** (claude.ai) mines the feed, scores candidates (gates G1–G5 all pass; S1–S6 scored 0–2; ≥ 9 build now, 6–8 backlog, ≤ 5 skip), holds the client fact sheet and the client role, writes the one brief file (client brief · mini approach · shoot list) and drafts the Tuesday carousel. **Claude Code** (the repo) receives that brief and nothing else; it plans `setup/`, `capture/`, the spec and the build itself, and after handoff drafts `post/script.md` and `post/copy.md` from the demo's own files, renders the video and runs the self-check into `post/check.md`. Claude Code never invents a client answer: a real ambiguity goes back to the chat and the answer is appended to `brief.md` `## Q&A` with timestamps before the spec changes.
- One brief, one copy. Briefs wait in `demos/_briefs/<id>.md` on `main` exactly as the chat issued them (added through a `chore/` branch). At Stage 1 the demo branch moves the brief (`git mv`, never a copy) to `demos/<id>/brief.md`; reissues and Q&A answers land only there. Putting it on the current template changes form only — §1 and §2 stay word for word, and anything the template needs that the brief does not say goes back to the chat. Queued briefs carry calendar dates; if a slot slips, the chat reissues the brief — nobody edits the client's dates here.
- Roles never cross: Yeasir sends the feed to the project chat, picks, hands the brief to the repo, reviews and merges, gives the two video approvals, approves all copy, replies to every comment; the builder (Asad once he clears T2.1 — Yeasir until then) runs setup, has the before, after and QA clips captured, writes the spec, builds, QAs, hands off, opens the PR, cleans up; the VA files by ID and publishes on the schedule, never replies and never changes copy.
- The video (guideline §2, §4, §6, §8): 60–90 seconds, square 1080 × 1080, never vertical; the label on every frame and as line 2 of the post · every time, number and quote on screen copied from a file in the demo folder, and the script names it; a scene with no real material is dropped · before and after from the same capture script, same view and framing, on the before and after preview themes · desktop-first at 1280 px, framed; 390 px only for a mobile problem · loading and checkout clips uncut at real speed · the promise kept, not the hours · a kind of cause, never a named app, theme or company blamed for a fault we planted · no synthetic voice, generated images, stock footage or music · banned on screen and in copy: "case study", anything presenting the demo as paid work, any freelance marketplace, prices, "free", terms, NDA, logins, AI or any AI tool, unmeasured results · two approvals by Yeasir with the self-check in `check.md` before each; never rendered from an unapproved script.

## 17. Building features — the six-stage method [strategy §8.1; T2.1; T7.1]

1. **Spec** before any session: why, in scope, out of scope (the change-order boundary), testable "done means", base theme and surface per piece, touchpoints. Section work adds the T2.1 build spec — structure read, theme-mapping read, hand-written schema, responsive story, assumptions list. The branch is born with the spec.
2. **Plan** in plan mode with the spec pasted; interrogate scope, surfaces, files, Liquid/API facts verified against current docs, stages, test plan; at least one pushback.
3. **Build** one stage per ask, spec injected; review protocol; Theme Check; commit per stage.
4. **Test** with evidence per acceptance criterion, a test order, a clean console.
5. **Cold read** the review diff (`tools/shopify/theme.sh diff <id>`) as a stranger's PR; one `polish` commit.
6. **Record** "as built", spec amendments and why, v2 / change-order notes, new rules.

Mid-build scope changes amend the spec first; code follows the spec, never leads it. The method scales down, never off.
