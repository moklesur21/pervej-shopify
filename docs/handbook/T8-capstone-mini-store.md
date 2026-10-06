# T8 — Capstone: The Complete Mini-Store
**Capstone · Tutorial 26 of 26 · Est. 25–35 hours over 2–3 weeks part-time**

**Goal:** Build and deliver one complete Shopify store exactly as if a paying agency had briefed it — scoped, branched, built with Claude Code and reviewed line by line, performance-tuned, QA'd with evidence, and handed off with a Loom and a warranty — and come out with a **proof-of-skill artifact** that stands in for a portfolio. Every module in the series shows up here; nothing new is taught. The capstone is where the twenty-five tutorials become one habit.

**Prerequisites:** T0.1 through T7.2, all checklists passed. Read the whole document before touching the store. Then read strategy doc **Sections 8–9** once more — they are the standard you are delivering to.

**How this differs from the other tutorials:** there is no Concept section and no Woo bridge. There is a brief, a set of acceptance criteria, a plan with four review gates, and a final review. You are the developer; I (Yeasir) am the agency. Treat the gates as client reviews — you send, I approve or send it back.

---

## 1. What the capstone is — and isn't

**It is** a complete, client-ready store: full page set, polished content and imagery, custom sections, a cart drawer, filtering, one checkout UI extension, one Shopify Function, tracking verified through a test order, green mobile Lighthouse on the three key pages, structured data and agent-readiness, all under Git with the GitHub integration, delivered with the T7.2 package. Agencies judge *finish*, not cleverness — so does this review.

**It isn't** a component showcase, a tech demo, a theme built from scratch, or a race. It is not our public demo store on pervej.com (that decision is mine and comes later, if the finish warrants it). And it is not a place for unreviewed AI output: the **AI ledger** (Section 6) makes the review visible, because the review is the skill.

**What it proves, service by service:**

| Deliverable | Proves service | Series module |
|---|---|---|
| Custom sections from a design; metaobject-driven content | S3 Custom features & sections | M1, M2 |
| Cart drawer with free-shipping bar and upsell slot; collection filters | S2 Checkout & cart · S3 | M2 |
| Green mobile Lighthouse with before/after evidence | S1 Speed & Core Web Vitals | M3 |
| Checkout UI extension + one Function | S2 Checkout & cart | M4 (counts as a practice rep toward the checkout house rule) |
| Custom pixel verified end to end | S4 Integrations & tracking | M5 |
| Taxonomy, metafields, JSON-LD, agents.md decision | S6 Agent-ready storefronts | M6 |
| Company + price list (stretch) | S5 B2B / wholesale | M6 |
| Git workflow, QA evidence, handoff, Loom, warranty | Delivery standard (8.1–8.5) | M7 |

---

## 2. The brief

*(Fictional agency and client. If you'd rather a different niche, propose it at Gate 0 with a reason — the niche is negotiable, the deliverables are not.)*

> **From:** Meridian Growth Partners (digital marketing agency, 12 people, Manchester)
> **Client:** **Kiln & Cove** — small-batch stoneware tableware. Sells direct to consumers and, increasingly, to cafés and restaurants who buy in sets.
> **Situation:** They're moving from a marketplace to their own store. We're handling brand, photography direction, ads and email. We need a developer for the store build. We have a design direction (below) rather than full Figma frames — you'll be translating it into sections we can hand to the client to edit themselves.
>
> **What the client needs**
> - A store that feels premium and calm; big imagery; the product does the talking.
> - Products are organised in **ranges** (e.g., "Tidal", "Ember", "Chalk") — each range has a story, a colour palette and 6–12 pieces. Customers shop by range as often as by product type.
> - Every product carries **care instructions** and **dimensions**; customers ask about dishwasher/oven safety constantly.
> - Cafés want to buy **sets** — a "complete the set" nudge in the cart would help, and they'd like a small discount when someone buys four or more of the same piece.
> - Pieces are fragile: at checkout, customers should be able to leave **delivery instructions**, and we want a short **"packed by hand, insured in transit"** reassurance visible at checkout.
> - A **"Trade" page** explaining wholesale, with a way to request an account. If wholesale pricing can work natively that's a bonus, not a requirement.
> - Fast. Their last site was slow on phones and they blame it for lost sales. We'll be running paid social to it — mobile speed matters more than anything else on this list.
> - The client's marketing manager will edit the homepage, ranges and FAQs herself. She is not technical and must not be able to break the layout.
>
> **Design direction:** warm off-white background, one dark accent from the clay palette, a serif display face paired with a clean sans, generous spacing, imagery edge to edge on the homepage, product grids at 2-up mobile / 4-up desktop. Restraint — no gradients, no badges everywhere, no chat widget.
>
> **Content:** We'll supply photography direction, not photos; use licensed free imagery for the build and note the licences. Write real copy — no lorem ipsum anywhere at handoff.
>
> **Tracking:** GA4 events for view item, add to cart, begin checkout and purchase, verified with a test order before we start ads.
>
> **Timeline:** three weeks. Fixed scope — anything outside this brief is a change order.

---

## 3. Deliverables and acceptance criteria

Each line is pass/fail. "Done" for the capstone is every line passing with evidence in the pack.

### 3.1 Store and theme

| # | Deliverable | Acceptance criteria |
|---|---|---|
| D1 | **Theme choice** — Dawn or Horizon, with a written rationale (T1.6) | Half a page in `docs/decisions.md`: why this base for this client, what the other would have cost |
| D2 | **Full page set** — home, collection (with filters), product, cart page, search, blog + one article, About/story, FAQ, Trade, contact, policies (all four), 404 | Every page reachable from navigation or footer; no page with placeholder copy or empty state showing by accident |
| D3 | **Content** — real copy, licensed imagery, alt text everywhere | `docs/content-licences.md` lists every image source and licence; `grep -ri lorem` returns nothing |
| D4 | **Header/footer as section groups**; announcement bar with rotating messages | Editable in the theme editor; header stable on mobile |

### 3.2 Custom sections (minimum five, all merchant-editable, all Theme Check clean)

| # | Section | Acceptance criteria |
|---|---|---|
| D5 | **Hero** — edge-to-edge image, headline, dual CTA | Image sizes/`srcset` correct; LCP element preloaded; no CLS |
| D6 | **Shop by range** — metaobject-driven (range name, story, palette, image, linked collection) | Adding a range in the admin adds a card with zero code change; empty-state handled |
| D7 | **Product feature grid** — icon + short text blocks (dishwasher safe, oven to table, handmade…) | Block limits set; icons from a curated set in settings, not uploaded per block |
| D8 | **Testimonials / press** — blocks with quote, name, optional logo | Renders sensibly with 1, 3 and 6 blocks |
| D9 | **FAQ accordion** — metaobject-driven (T1.5) | Accessible disclosure pattern: keyboard operable, `aria-expanded` correct |
| D10 | **Product page**: variant picker UX (T2.2), care & dimensions from metafields, **"complete the set"** block showing the other pieces in the same range | Pieces resolved by range metafield/metaobject, not hand-picked lists; sold-out pieces handled |

### 3.3 Cart, checkout, commerce logic

| # | Deliverable | Acceptance criteria |
|---|---|---|
| D11 | **Cart drawer** (T2.3) — free-shipping progress bar, "complete the set" upsell slot, order-note field | Cart API only; no full-page reload; events dispatched for pixels; scroll-lock and focus handling correct on iOS |
| D12 | **Collection filters** (T2.4) — by range, type, colour, price; availability toggle | Storefront filtering, URL-addressable, no custom JS fetching products |
| D13 | **Checkout UI extension** (T4.2) — delivery-instructions field saved to the order + the "packed by hand, insured in transit" notice | Appears on the dev-store checkout; the note is visible on the order in admin |
| D14 | **Shopify Function** (T4.3) — 10% off when four or more of the same product are in the cart | Applies and removes correctly as quantities change; visible at checkout |
| D15 | **Trade page** with an account-request form; **stretch:** one company with a price list so a logged-in café sees trade pricing (T6.1) | Form submits and reaches the store email; stretch verified with a company customer |

### 3.4 Performance, tracking, agent-readiness

| # | Deliverable | Acceptance criteria |
|---|---|---|
| D16 | **Performance** (T3.1–3.2) — mobile Lighthouse, three-run median, home/collection/product | Performance ≥ 90 on all three; lab LCP < 2.5 s, CLS < 0.1, TBT < 200 ms; before/after report from the first working build to the final |
| D17 | **Tracking** (T5.1) — custom pixel or GA4 setup emitting view_item, add_to_cart, begin_checkout, purchase | All four verified through a test order with debug evidence |
| D18 | **Agent-ready** (T6.2) — taxonomy categories + category metafields on all products, policies published, Product/Organization/Breadcrumb JSON-LD valid, `agents.md` ship-or-default decision written | UCP `search_catalog` returns an enriched product (or the dev-store gate is documented); validator clean |

### 3.5 Delivery

| # | Deliverable | Acceptance criteria |
|---|---|---|
| D19 | **Repo** — private GitHub, GitHub integration connected, `main` published on the dev store, feature branches per deliverable, `CLAUDE.md`, `.shopifyignore`, `shopify.theme.toml` (T7.1) | Every deliverable traceable to a branch and a merge; the `shopify` bot's commits present and pulled |
| D20 | **Deploy runbook** applied — backup theme before each publish; one rehearsed rollback | Backup names in the log; rollback timing recorded |
| D21 | **QA pass** (T7.2) — the 18-item checklist with evidence folder; defect log with severities and re-tests | Zero known defects at handoff; purchase flow re-run after the last fix |
| D22 | **Handoff package** — `handoff.md`, merchant editing guide with screenshots, Loom (5–7 min), warranty note | Written in the agency's voice; no AI mention; definition of done walked with evidence pointers |
| D23 | **AI ledger** and **capstone report** (Section 6) | Both complete and honest |

---

## 4. The plan — four gates

Work in the order the house rule prescribes (theme, sections and speed before checkout). Record hours per phase in `docs/timesheet.md` — I need real numbers, not heroic ones; they feed pricing.

### Gate 0 — Kickoff *(week 1, day 1–2 · ~3 h)*
Send me: the written scope (deliverables, exclusions, the stretch marked as stretch), the theme choice with rationale (D1), a phase plan with hour estimates, the metaobject and metafield design (ranges, FAQs, care/dimensions, range-membership for "complete the set"), and the repo link with `CLAUDE.md` in place. **I approve or send it back within a day.** No building before approval — that's rule 3 of the offer (fixed scope, written, always).

### Gate 1 — Skeleton *(week 1 · ~8 h)*
Theme scaffolded on the dev store, GitHub connected and `main` published, section groups in place, metaobject definitions created with 3 ranges and 12 products of sample data entered, page set created (empty is fine), first Lighthouse baseline captured. Send a 3-minute Loom walking the structure. This is the "trace the render path" moment from T1.2 applied to your own store — I'll ask you to explain one page's render path on the review.

### Gate 2 — Feature complete on preview *(weeks 1–2 · ~14 h)*
All sections (D5–D10), cart drawer (D11), filters (D12), extension (D13), function (D14), Trade page (D15), tracking (D17), agent-readiness data (D18) — on the preview theme, Theme Check clean, scope diff clean per branch. Send the preview link and a 5-minute Loom in the T7.2 structure. Expect me to send back at least two revisions; that's normal and it's not a strike.

### Gate 3 — Delivered *(week 3 · ~8 h)*
Performance pass to targets (D16), full QA pass with evidence (D21), backup + publish on the dev store + one rehearsed rollback (D20), handoff package and final Loom (D22), AI ledger and report (D23). This is the delivery. Hand it off as if the warranty clock starts now.

### Capstone review *(1 hour, live)*
Section 7.

---

## 5. Rules

The three rules from day one, plus the ones a real delivery adds:

1. **Never build on a live theme.** The dev store's published theme is "live" for this project. Backup before every publish.
2. **Never ship unreviewed AI output.** Every Claude Code result reviewed line by line; the AI ledger records it.
3. **Checklist on everything.** Each deliverable's own checklist (from its tutorial) passes before it's merged; the full T7.2 checklist passes before Gate 3.
4. **IP hygiene (8.2):** free bases only (Dawn/Horizon), no code from paid themes or other stores' repos, licensed imagery with the licence recorded.
5. **Fixed scope.** Anything not in the brief is written up as a change order — even if it's a good idea, *especially* if it's a good idea. Put it in `docs/change-orders.md` and don't build it.
6. **Editable but unbreakable.** The marketing manager must be able to edit every content surface and unable to break the layout: block limits, sensible defaults, empty states, no free-form HTML settings.
7. **No AI in the pitch, ever.** Nothing in the store, the Loom or the handoff mentions how the code was produced. The AI ledger is internal.
8. **Timebox honestly.** If a phase runs 50% over its estimate, stop and tell me before continuing — the same day. Bad news travels fast (8.4).

---

## 6. The evidence pack

Everything below lives in the repo under `docs/` and `qa/`, and is linked from `handoff.md`:

- `scope.md` · `decisions.md` (theme choice, data model, anything non-obvious) · `timesheet.md` · `change-orders.md`
- `content-licences.md`
- `performance/` — baseline and final Lighthouse medians, the before/after report (T3.2 format)
- `qa/` — the 18-check evidence folder, `defects.md`
- `deploy-runbook.md` as applied — backup names, publish times, the rollback rehearsal
- `handoff.md` · `merchant-guide.md` (with screenshots) · the Loom link
- **`ai-ledger.md`** — one line per Claude Code task: what was asked, what came back, **what you changed in review and why**, and any defect the review caught before it shipped. This is the single most important document in the pack for me. A ledger with nothing changed in review means the review didn't happen.
- **`capstone-report.md`** — two pages: what you'd build differently now, where the estimates were wrong and why, which tutorial you'd rewrite, and what you think you're ready to take on for real clients versus what needs more reps. Honest, not modest.

---

## 7. Capstone review

One hour, live, screen shared. The store first, then the questions — drawn from the whole series, no notes:

1. Walk one product page's render path from request to HTML (T1.2), and show where your care-instructions metafield enters it.
2. Why this base theme for this client, and what would the other one have cost you? (T1.6)
3. Show me the "complete the set" block. How does it resolve the pieces, and what happens when a range has one product? (T1.5, T2.1)
4. Open the cart drawer on your phone. What did you do about scroll-lock and focus, and which pixel event fires on add-to-cart? (T2.3, T5.1)
5. Your Lighthouse went from X to Y. Name the three changes that moved it most, in order. (T3.2)
6. The checkout extension: which plan does it need, where is the delivery note stored, and what would you tell an agency whose client is on Basic? (T4.1–T4.2)
7. Show me the Function applying and then un-applying as I change a quantity. Where would you put a "trade customers excluded" rule? (T4.3, T6.1)
8. Show me an agent's view of one product. What's in `metadata`, and what was the agents.md decision? (T6.2)
9. Show me the `shopify` bot's commits. What did you do the first time one landed on your feature branch? (T7.1)
10. Show me the defect log. Which defect would have reached the client without the checklist, and which check caught it? (T7.2)
11. Open the AI ledger. Pick the entry where review changed the most, and tell me what would have shipped otherwise. (T0.3)
12. If Meridian asked for a second store like this next month — what's your estimate, and what's the first thing you'd do differently?

---

## 8. After the capstone

Per the catalog's delivery rule, you are now billable for **section, feature and speed work** (S1, S3, S4). Checkout work (S2) opens after one or two more practice reps — the capstone counts as one. B2B (S5) and agent-readiness (S6) can be taken on with review.

Three habits carry forward: the `.md` folder is now the internal Shopify handbook — keep filing notes into it; after every Shopify Editions drop (two a year) spend half a day on the changelog and update the catalog before anything else; and the AI ledger continues on real client work, per task — the review is still the skill, and the ledger is how we both know it happened.

Well done reaching this point. Now build the store.

---

*T8 · v1.0 · Sept 12, 2026 — Capstone brief; no new platform facts. Acceptance thresholds follow the series' verified sources: Lighthouse lab proxies for Core Web Vitals (LCP 2.5 s, CLS 0.1, TBT as the INP proxy), Theme Check zero errors, checkout UI extensions on all paid plans (T4.1), UCP verification method (T6.2), GitHub integration semantics (T7.1). The niche, the fictional agency and the client are placeholders — swap them, keep the deliverables.*
