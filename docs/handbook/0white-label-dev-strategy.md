# White-Label Dev Partner — Strategy & Operations
**Single Source of Truth**

| | |
|---|---|
| **Owner** | Yeasir Pervej |
| **Brand / domain** | pervej.com |
| **Version** | 1.4 — October 6, 2026 |
| **Status** | Active — Phase 0 |
| **Review cadence** | Update Decision Log on every decision; full review monthly |

**How to use this doc:** This is the living reference for the venture. Every plan, pitch, hire, and pivot should be consistent with it — or the doc gets updated first. Sections 6 (Pricing) and 12 (Risks) are internal-only; Sections 8–9 (Delivery, Tools) can be shared with subcontractors when they join.

*v1.1: operational hardening from external review (Meta AI / Gemini / Perplexity) — accepted and declined changes logged in Section 15.*
*v1.2: LinkedIn headline locked; Appendix C rewritten (expertise-first headline; white-label framing moved to About + site hero).*
*v1.3: theme-approach decision locked — Gutenberg/block-first for new builds; Elementor retained as rescue-work fluency only.*
*v1.4: Shopify theme decision locked — Horizon for new builds; Dawn retained as first-class fluency for existing Dawn-based client stores.*

---

## 1. What This Is

A **white-label WooCommerce + Shopify development service for digital marketing agencies.** Agencies sell the work under their brand; I am their invisible senior developer — building the custom features, checkout logic, speed fixes, and integrations their in-house team doesn't have the bandwidth or depth for.

**The one-liner:**
> "I build the custom WooCommerce and Shopify work your team doesn't have bandwidth for — checkout fixes, speed, custom features. White-label, senior-reviewed, fixed scope."

**What makes this work:**
- AI-accelerated delivery (Claude Code) = agency-grade speed at solo-developer cost. AI is the internal margin multiplier — **never the pitch**.
- Dual-platform coverage (Woo + Shopify) = one partner for an agency's whole client book, instead of two freelancers.
- "Extra hand" is the **relationship** we grow into (retainers); a concrete deliverable is always the **cold-open**.

---

## 2. Goals

### Primary goal (6 months)
Stable secondary income of **USD 2,500–3,000/month** from **2–3 agency retainers**, running alongside the full-time job, with **zero dependency on Upwork or Fiverr**.

### Secondary goal (12 months)
Extract the most-repeated client component into a **plugin under PureDevs** (service-to-product flywheel). The agency clients become the first beta users and distribution channel.

### Non-goals (explicitly out of scope)
- Competing for end clients under my own brand (that's Launch My Boutique's lane, not this one).
- Building a SaaS from zero while holding a full-time job.
- Any activity on Upwork or Fiverr (see Constraint C1).
- Design, SEO content, or ad management services.

### Milestones

| Target date | Milestone | Done? |
|---|---|---|
| Day 14 | Shopify ramp complete + public demo store live | ☐ |
| Day 21 | pervej.com relaunched + LinkedIn profile repositioned | ☐ |
| Day 30 | 150-agency target list built; 40+ outreach messages sent | ☐ |
| Day 45 | First paid pilot delivered | ☐ |
| Day 75 | First monthly retainer signed | ☐ |
| Month 4 | 2 retainers active | ☐ |
| Month 6 | 3 retainers active; income target hit | ☐ |
| Month 6–7 | First subcontractor onboarded (only if capacity forces it) | ☐ |
| Month 9 | First extracted PureDevs plugin in private beta with agency clients | ☐ |

> Numbers are working targets, not fantasies — adjust after the first 5 real agency conversations, and log the change in Section 15.

---

## 3. Context, Constraints & Assets

### Constraints
- **C1 — Upwork is permanently off-limits for this venture.** The full-time employer pays through Upwork; any risk to that profile risks the primary income. A second account would violate Upwork's one-account rule and endanger both. All acquisition runs through **LinkedIn + pervej.com**; all payment through **Payoneer** (backup: Wise).
- **C2 — Time budget:** roughly **15–20 hrs/week** around the full-time job (set the real number in the weekly rhythm, Section 10, and protect it).
- **C3 — Timezone:** Asia/Dhaka (UTC+6). This is an *advantage*, not a liability: evening work hours in Bangladesh (7–11 PM) overlap with US East Coast mornings — agencies get same-day responses and "overnight" delivery. Operate async-first regardless.
- **C4 — Employment contract:** confirm the current job's contract has no side-work/non-compete clause that conflicts. *(Open item — see Section 15.)*

### Assets already in hand
- **Deep WooCommerce expertise + daily Claude Code fluency** — the review judgment that makes white-label QA credible.
- **PureDevs / Customer History** — a shipped, self-hosted WooCommerce plugin ("your data stays yours"). Proof of plugin-grade code quality, and the ready-made vessel for Phase 3 productization.
- **Launch My Boutique** — proof of fast, complete store delivery (48-hour builds).
- **pervej.com** — clean, aged domain (2014) for the landing page.
- **Developer network** — capacity for later scaling (not used in Phase 1; see Section 11).

### Known gap
- **Shopify, 2022 → now.** Not starting from zero: OS 2.0, Dawn, JSON templates, and sections are already known (shipped 2021). The delta is specific and closable in the 2-week Phase 0 ramp (Appendix A): CLI 3.x workflow, section groups, metaobjects, theme blocks + Horizon, Checkout Extensibility (checkout.liquid is fully retired), Shopify Functions, new customer accounts, and the 2026 agentic-commerce layer.

---

## 4. Positioning & Offer

### Ideal Client Profile (ICP)
- **Digital marketing agencies** first; design-led web agencies second.
- 5–20 people; active client work visible (recent launches, case studies).
- Client book includes WooCommerce and/or Shopify stores.
- **Priority filter:** agencies *managing existing client sites* that visibly underperform (slow, dated, page-builder-heavy) — optimization and feature work recurs. **Deprioritize** shops selling only cheap one-off store setups; they price-shop and don't retain.
- Geography: US, UK, EU, AU, Canada (Payoneer-friendly, retainer-culture markets).
- Signals they need us: job posts for freelance devs, "we're hiring" churn, heavy use of page builders, slow client sites, service pages listing web/ecom work without a named dev team.

### Positioning statement
*For digital marketing agencies whose developers are maxed out (or missing), I am the white-label WooCommerce + Shopify partner who delivers senior-reviewed custom work under their brand — fixed scope, fast turnaround, no bloat.*

### Service menu

| # | Service | Typical scope | Turnaround |
|---|---|---|---|
| S1 | **Speed & Core Web Vitals fix** | Audit + implementation, before/after Lighthouse report | 3–5 days |
| S2 | **Checkout & cart work** | Bug fixes, cart drawers, shipping logic (USPS/UPS etc.), checkout UI extensions (now available on all Shopify paid plans), Woo checkout hooks | 3–7 days |
| S3 | **Custom features & sections** | Figma → Dawn/Horizon sections; Woo custom functionality via hooks/plugins; product configurators | 5–10 days |
| S4 | **Integrations & tracking** | GA4, pixels, server-side tracking, API/webhook middleware, ShopWP-style Woo↔Shopify bridges | 3–7 days |
| S5 | **B2B / wholesale builds** | Woo: roles, tiered pricing, request-a-quote, bulk order forms. Shopify: native B2B setup | 1–3 weeks |
| S6 | **Agent-ready storefronts** *(emerging)* | llms.txt / agents.md, structured data, standardized storefront events, Catalog API integrations for AI-agent commerce | 2–5 days |
| S7 | **Dev bench retainer** | Ongoing monthly capacity — the destination for every client above | monthly |

S6 is the differentiation wedge: almost no agency has capacity for agentic-commerce readiness yet, and for *marketing* agencies it's a discovery/traffic story they can resell to every client.

### Rules of the offer
1. **Never market "AI-generated code."** Sell senior-reviewed reliability, clean code, and turnaround. Several clients in the researched job feed explicitly welcome AI-assisted dev — fine to confirm if asked, never the headline.
2. **White-label by default.** Their brand on everything. No portfolio use without written permission (ask for anonymized case-study rights in the agreement).
3. **Fixed scope, written quote, change-order for anything outside it.** No open-ended hourly drift on projects.
4. **The two-regression rule (internal):** what kills agency trust is *regressions and defects in scoped work* reaching them — twice, and we're quietly dropped. A new edge case surfaced during staging review is a normal revision, not a strike. QA (Section 8) exists so strikes never happen.

---

## 5. Why This Works — Market Evidence (condensed)

From the analyzed Upwork feed (21 detailed captures + two feed screenshots, Sept 2026) and platform research:

- **Demand concentrates exactly where we're strong:** checkout (37 mentions), upsell/funnels (23), performance/speed (26), and "ongoing" work (19) — recurring, not one-off.
- **Competition asymmetry:** generic Shopify/Dawn listings draw 50+ proposals; specialist Woo work (B2B rebuilds, shipping/checkout logic, product configurators, "long-term specialist" roles) draws far fewer bidders at higher budgets.
- **Clients accept AI-assisted delivery** when a human owns quality — multiple listings name Claude/Cursor/Copilot explicitly.
- **Platform timing:** Checkout UI extensions opened to all Shopify paid plans (Winter '26), expanding the checkout-customization market beyond Plus stores. Spring '26's agentic-commerce push (Universal Commerce Protocol, storefront events, llms.txt) created a brand-new service category with near-zero supply.
- **The model itself is proven:** white-label development for agencies is an established industry; agencies routinely bill white-label work at 2–3× partner cost and value reliability over price.

---

## 6. Pricing & Money *(internal only)*

Starting points — validate against the first 5 agency conversations, then lock and log.

### Project pricing (fixed scope)

| Tier | Examples | Price band (USD) |
|---|---|---|
| Small fix | Bug fix, tracking install, single section | $150–400 |
| Feature build | Cart drawer, checkout extension, Figma section set, integration | $500–1,500 |
| Custom build | B2B store logic, configurator, multi-feature project | $1,500–4,000 |

### Retainers (the real product)

| Tier | Monthly capacity | Price (USD/mo) |
|---|---|---|
| Starter | ~10 hrs equivalent | $800 |
| Growth | ~20 hrs equivalent | $1,500 |
| Partner | ~35 hrs equivalent + priority SLA | $2,500 |

Unused capacity rolls over one month max. Retainer clients get priority queue + faster SLA.

### How to sell the price
- **Anchor against the alternative, not against hours:** an in-house senior ecom developer costs an agency ~$8–10k/month fully loaded. A retainer is *fractional senior capacity* with zero management overhead — frame it that way in every proposal.
- Quote fixed prices for defined outcomes. The hourly floor below is an internal sanity check, **not** a rate card shown to anyone.

### Terms
- Pilots/projects: **50% upfront**, 50% on delivery. Retainers: **billed on the 1st, Net-7**.
- **IP in delivered work transfers to the agency on final payment** — clean handoff for them, natural leverage for us.
- Payment: Payoneer invoice in USD (backup: Wise). No work continues past an unpaid invoice older than 14 days.
- Floor: never price below ~$25/hr equivalent — agencies distrust bottom-dollar white-label partners, and the markup they add (2–3×) means underpricing helps no one.
- Later subcontracting margin target: **≥ 40%** after paying devs.
- Bangladesh side: business registration + tax treatment of Payoneer income → consult a local accountant. *(Open item — Section 15.)*

---

## 7. Client Acquisition System

### 7.1 Foundation assets (build once, Phase 0)
- **LinkedIn profile** repositioned (draft in Appendix C).
- **pervej.com one-pager:** hero one-liner → who it's for (agencies) → service menu → proof → how it works (3 steps) → CTA ("Book a 15-min intro" via Calendly link / email). No blogspam, no stock photos. One page, fast, clean — the site itself is a speed demo (aim for green Core Web Vitals as a selling point).
- **Proof kit:**
  - Public Shopify demo store — a **complete, client-ready store** (real niche, full page set, polished content and imagery), not a component showcase. Agencies judge finish, not cleverness. Built in the Phase 0 ramp: custom Dawn/Horizon sections + cart drawer + one checkout UI extension.
  - Customer History (PureDevs) — plugin-grade Woo code, live product.
  - Launch My Boutique builds — fast-delivery evidence.
  - 2 Loom walkthroughs (one Woo, one Shopify) showing the work and the reasoning — agencies buy the reasoning.
- **Case study template** (Appendix D). Write one per completed project, anonymized unless permission granted.

### 7.2 List building
- Target: **150 qualified agencies in the first 30 days.**
- Sources: LinkedIn search ("digital marketing agency" + geo + headcount filter), Clutch.co, Sortlist, local agency directories in target geos, "we're hiring a developer" posts (an agency hiring a freelancer is an agency with overflow *right now* — highest-intent signal).
- Apply the ICP priority filter (Section 4): existing underperforming client sites in their portfolio > agencies selling cheap setups.
- Tracker (Notion or Google Sheet), one row per agency: name, site, geo, size, platform signals (Woo/Shopify clients spotted), contact person, personalization note, status (cold → messaged → replied → call → pilot → retainer → dormant), dates.

### 7.3 Outreach process
- **Volume:** 10–15 genuinely personalized messages/week. Quality over spray — one specific observation about *their* agency or a client site per message.
- **Sequence:** initial message → follow-up at +4 days → follow-up at +10 days → move to quarterly nurture (engage with their content, no pitching).
- **Templates:** Appendix B. Rewrite in own voice; never send unedited.
- **Reply goal:** a 15-minute intro call. **Call goal:** one small paid pilot (S1–S4 scope, $150–500) — priced to be an easy yes, delivered to be unforgettable.
- **Conversion path:** pilot → 2nd project → propose retainer at the moment of a successful delivery (highest-trust moment). Script: *"Instead of quoting each task, I can hold X hrs/month for you at $Y — you get priority and a predictable line item."*

### 7.4 Content engine (LinkedIn)
- **Frequency:** 2–3 posts/week + 15 min/day commenting on agency owners' and ecom founders' posts (comments build more pipeline than posts early on).
- **Pillars:**
  1. **Build logs** — before/after speed scores, short demos of features shipped, "how I fixed X" (client-anonymous).
  2. **Teardowns** — common Woo/Shopify problems agencies inherit (slow checkouts, plugin bloat, broken cart AJAX) and the right fix.
  3. **Agency POV** — how agencies can scale dev capacity without hiring; what white-label done right looks like.
  4. **Platform news translated** — e.g., "Checkout extensions now on all Shopify plans — here's what your agency can now sell"; agentic commerce explainers. Positions us as the person who reads the changelogs so they don't have to.
- **Repurpose:** best post each month → article on pervej.com.

### 7.5 Referrals & partnerships
- Ask for a referral at every successful delivery: *"Know one other agency drowning in dev backlog?"*
- Partner (non-competing) with freelance designers, SEO/ads specialists — they meet agencies daily and need a dev to hand work to. Reciprocal referrals.

### 7.6 Pipeline metrics (tracked weekly, Section 14)
Messages sent → reply % (target ≥ 10%) → calls booked → pilots won → pilot→retainer conversion (target ≥ 1 in 3).

---

## 8. Delivery System

### 8.1 Workflow (every project)
1. **Brief in** — agency fills a short intake (goal, URLs, access, assets, deadline).
2. **Scope out** — written fixed-scope quote within 48h: deliverables, exclusions, price, timeline.
3. **Approval + invoice** (50% for projects).
4. **Build** — on staging/dev copy, never live. Claude Code + human review on every line shipped.
5. **QA** — full checklist (8.3). No delivery with a known defect.
6. **Staging review** — agency approves on a preview link + Loom walkthrough. **Review window: 5 business days** — if no response, the delivery is invoiced as accepted (14-day warranty unaffected). Stated politely in the agreement so invoices don't stall on end-client silence.
7. **Deploy** — with backup taken first; deploy window agreed.
8. **Handoff + warranty** — summary of what changed, docs if needed, **14-day bug warranty** on delivered scope.

**SLAs:** first response < 12 business hours; scoping < 48h; status update at end of every active work day. Retainer clients: response < 6 business hours.

### 8.2 Build standards
- Everything in **Git** (private GitHub repos per client).
- **WooCommerce:** local dev via wp-env/LocalWP; changes via child theme or custom plugin only — never core/parent edits; WordPress coding standards; PHP error log clean; plugin-conflict check before handoff.
- **Shopify:** Shopify CLI + Theme Check on every build; always duplicate the live theme and work on the copy; GitHub theme integration where the agency allows; **Shopify dev MCP server (`@shopify/dev-mcp`) connected to Claude Code** so AI output follows current platform docs, not stale training data.
- **IP hygiene:** build on free/licensed bases only (Dawn and Horizon are free to customize under Shopify's license). Never copy code from paid third-party themes, nulled plugins, or one client's repo into another's.
- No secrets in repos; access via agency-provided collaborator/staff accounts, never shared owner passwords.

### 8.3 QA checklist (run on 100% of deliveries)
- ☐ Functional pass on the exact scoped items, including edge cases
- ☐ Full purchase flow test (add to cart → cart → checkout → order placed) with a test order
- ☐ Mobile: 360px, 390px, 768px breakpoints + at least one **real device** test (Android and iOS where possible)
- ☐ Cross-browser: Chrome, Safari, Firefox (+ iOS Safari)
- ☐ Linters clean: `shopify theme check` / PHPCS (WPCS) pass
- ☐ No hardcoded user-facing strings — locale files (`en.default.json` / i18n functions) used
- ☐ No console errors; no PHP notices/warnings in log
- ☐ Lighthouse before/after — performance must not regress (screenshot both)
- ☐ Cart/checkout scripts unbroken (analytics, upsells, shipping calc still fire)
- ☐ Backup exists and rollback path confirmed
- ☐ Loom walkthrough recorded

### 8.4 Communication norms (white-label discipline)
- Their brand everywhere; never contact the end client unless the agency explicitly invites it, and then as "part of {agency}'s team."
- Async-first: written updates + Looms; calls only for kickoff and complex scoping.
- Plug into **their** stack (Slack, ClickUp, Trello, whatever they run) — the pitch line is real: an extra senior dev with zero management overhead.
- Bad news travels fast: any slip or blocker is flagged the day it's known, with a recovery plan — never discovered by the agency.

### 8.5 Definition of done
Scoped items delivered · QA checklist 100% · staging approved (or 5-day window elapsed) · deployed with backup · handoff Loom sent · warranty clock started.

---

## 9. Tools & Platform Stack

| Category | Tool | Notes |
|---|---|---|
| AI dev | **Claude Code** | Core leverage; + Shopify dev MCP server |
| Shopify | Shopify CLI 3.x, Theme Check, dev/partner stores | Free |
| WordPress | wp-env or LocalWP, WP-CLI, Query Monitor, WPCS | Free |
| Version control | GitHub (private repos) | Free tier fine |
| QA | Browser devtools, Lighthouse/PageSpeed, real mobile devices; BrowserStack if needed later | Mostly free |
| Video | Loom (or free alternative) | Demos, handoffs, proposals |
| Scheduling | Calendly (free tier) | "Book a 15-min intro" link on site + LinkedIn |
| CRM/PM | Notion or Google Sheet (pipeline) + Trello/Notion board (delivery) | Keep it lightweight |
| Comms | Email + agency's Slack (join theirs; don't make them join ours) | |
| Finance | Payoneer (invoicing + receiving), Wise backup, simple income sheet | |
| Design handoff | Figma (viewer) | Agencies supply designs |
| Contracts | Simple service agreement + NDA template; subcontractor agreement (Phase 2) | One-time setup |
| Site | pervej.com — fast static/lightweight WP one-pager | Own hosting |

Total new monthly cost at start: ~$0–30. Keep it that way until retainer #2.

---

## 10. Weekly Operating Rhythm

Template around the full-time job — adjust the slots, protect the totals. (~16 hrs/week)

| Day | Block | Focus |
|---|---|---|
| Mon | 1.5h evening | Delivery work |
| Tue | 1h evening | Outreach (5 messages) + follow-ups |
| Wed | 1.5h evening | Delivery work |
| Thu | 1h evening | Outreach (5 messages) + 1 content post |
| Fri | 1h evening | Delivery buffer / client comms / light admin |
| Sat | 4–5h | Deep delivery work (the big block) |
| Sun | 2h | Content batch (2 posts) + case study/demo upkeep + **30-min weekly review** (metrics, pipeline, next week's plan) |
| Daily | 15 min | LinkedIn commenting/engagement |

**Weekly review questions:** Did outreach volume happen? Any client at risk (two-regression rule)? Anything built twice that should go on the productization list? Is any single client > 40% of income?

---

## 11. Roadmap

### Phase 0 — Ramp & Assets (Weeks 1–2)
- Complete the Shopify catch-up syllabus (Appendix A) → output = public demo store.
- Relaunch pervej.com one-pager; reposition LinkedIn; record 2 Looms; set up tracker, invoice template, service agreement.
- **Exit criteria:** demo live, site live, first 25 agencies listed.

### Phase 1 — Validation (Months 1–3)
- Full outreach + content rhythm. Land and over-deliver 3–6 pilots. Convert ≥ 1 to retainer.
- Take Shopify theme/section/speed work immediately; hold checkout-extension-heavy jobs until 2–3 reps done.
- **Exit criteria:** first retainer signed; pricing validated and locked; ≥ 2 case studies written.

### Phase 2 — Retainers & Leverage (Months 3–6)
- Grow to 2–3 retainers. Raise project prices ~20% once demand proves out.
- **Subcontractors only when capacity forces it** (delivery slots full 3 weeks running). Solo + Claude Code stays default — a junior layer adds management overhead and QA risk that AI has partly obsoleted.
- **Subcontractor operating rules (when they start):**
  - Paid test task first; written agreement covering scope, confidentiality, **non-solicitation** (of agencies and end clients), IP assignment, quality/redo terms (defects fixed at their cost within an agreed turnaround), and liability.
  - **Repo discipline:** devs work on branches only; I am the only one who merges to main. I remain the QA gate on 100% of shipped code — that review *is* the product.
  - **Payment sequencing:** pay per accepted task (not revenue share); time payouts to follow agency payment receipt where possible, so cash-flow risk isn't carried alone.
  - **Bench depth:** before relying on subcontractors for deadlines, keep **two vetted devs per skill area** (Woo/PHP, Shopify/Liquid) so one absence can't sink a delivery.
- **Exit criteria:** income target hit; capacity model stable; productization list has ≥ 3 candidates.

### Phase 3 — Productize via PureDevs (Months 6–12)
- **Trigger rule:** any component built **3+ times** for clients goes on the extraction list (likely candidates based on market data: request-a-quote/B2B logic, cart drawer kit, checkout extension pack, agent-readiness kit).
- Extract the strongest candidate into a PureDevs plugin: free lite version on WordPress.org (lead magnet) + pro license sold on PureDevs/pervej.com.
- Agency clients = beta testers and first customers. Distribution exists before the product does — the opposite of SaaS-from-zero.
- Service continues; product compounds beside it.

---

## 12. Risk Register *(internal only)*

| # | Risk | Mitigation |
|---|---|---|
| R1 | Upwork profile / employer conflict | Absolute rule C1: zero Upwork activity for this venture. Confirm employment contract permits side work (open item). |
| R2 | Client concentration (new single point of failure, same trap as Upwork) | No agency > 40% of venture income once at 2+ clients; minimum stable state = 2–3 retainers; keep outreach running even when full. |
| R3 | Quality failure → agency churn | Two-regression rule; QA checklist on 100% of deliveries; never ship unreviewed AI output; 14-day warranty honored fast. |
| R4 | Scope creep on fixed-scope work | Written scope with exclusions; change-order for anything outside; polite, immediate. |
| R5 | Non-payment / stalled approvals | 50% upfront on projects; Net-7 retainers; 5-day staging acceptance window; stop-work at 14 days unpaid; Payoneer invoicing trail; IP transfers only on final payment. |
| R6 | Subcontractor damage (their bugs are legally mine) | Phase-2 agreement (confidentiality, non-solicit, IP, redo terms); paid test task; branch-only access; 2-dev bench per skill; I QA everything shipped. |
| R7 | Burnout / day-job interference | Time budget C2 is a ceiling; max 2 concurrent projects + retainer queue; raise prices before raising hours. |
| R8 | Platform shifts (Shopify Editions 2×/yr; Woo/WP releases) | Half-day review after every Editions drop + WP major release; turn changes into content (pillar 4) and new offers — shifts are opportunities here, not threats. |
| R9 | "AI code" perception damages trust | AI never in the pitch; human review guarantee explicit; quality record does the talking. |
| R10 | Pipeline drought (the historic bottleneck across ventures) | Outreach + content are **non-cancellable** weekly blocks — they get cut last, not first, even when delivery is busy. |
| R11 | IP contamination (copied code from paid themes/nulled plugins entering client work) | IP-hygiene rule in 8.2; applies doubly to subcontractor code — spot-check origins during review. |

---

## 13. Operating Principles (non-negotiables)

1. **No Upwork. No Fiverr. Ever** — for this venture.
2. **Sell reliability, not AI.** Claude Code is the engine, never the brand.
3. **Distribution before build.** Outreach and content hours are protected before delivery hours — build capacity was never the bottleneck; pipeline was.
4. **Fixed scope, written, always.**
5. **Two regressions is one too many.** QA checklist on everything.
6. **White-label discipline:** their brand, their client, my silence.
7. **Never one client from being broke:** 2–3 retainer minimum, 40% concentration cap.
8. **Everything built twice is a product candidate.** Keep the extraction list current.
9. **Raise prices before raising hours.**
10. **This doc is the truth.** If reality changes, change the doc.

---

## 14. KPIs & Review Cadence

**Weekly (Sunday review):** outreach sent · reply % · calls booked · active projects · on-time delivery % · defects caught by client (target: 0) · hours spent vs. C2 budget.

**Monthly:** revenue vs. target · pilot→retainer conversion · pipeline size (agencies in "replied+" status) · content published · productization list additions · concentration % per client.

**Quarterly:** pricing review · ICP review (niche down further?) · Phase gate check against Section 11 · Editions/platform review.

---

## 15. Decision Log & Open Questions

### Decisions
| Date | Decision | Rationale |
|---|---|---|
| 2026-09-07 | White-label service model for agencies (not SaaS-first, not direct-to-client) | Fastest path to stable income around a full-time job; proven model; agencies bring repeat flow — fixes the pipeline bottleneck seen in prior ventures |
| 2026-09-07 | Dual platform: WooCommerce + Shopify | ICP (marketing agencies) has mixed client books; "one partner for both" is a real differentiator; Shopify gap closable in 2 weeks given pre-2022 OS 2.0/Dawn familiarity |
| 2026-09-07 | ICP: digital marketing agencies (primary) | Recurring dev needs (speed, tracking, checkout, sections) suit retainers; they resell dev work at markup |
| 2026-09-07 | Acquisition: LinkedIn + pervej.com; payment: Payoneer | Upwork off-limits (employer dependency, C1) |
| 2026-09-07 | Solo + Claude Code in Phase 1; subcontractors only when capacity forces it | Higher margin and quality; management layer partly obsoleted by AI |
| 2026-09-07 | Product path = extract from repeated service work into PureDevs (Phase 3) | Distribution-first productization; PureDevs already exists as the vessel |
| 2026-09-07 | **v1.1 hardening** (from Meta AI / Gemini / Perplexity review): two-regression rule; 5-business-day staging acceptance window; IP-transfer-on-final-payment term; demo store = complete polished store; ICP priority filter (existing underperforming sites); pricing anchored vs. in-house senior cost; subcontractor ops (branch-only, pay-after-receipt, 2-dev bench, rework-at-cost); QA additions (linters, locale strings, real devices); Catalog API in S6; IP-hygiene rule | Convergent external feedback; operational hardening, no strategy change |
| 2026-09-07 | **Declined:** Woo-B2B-only niche (Meta) and 10 messages/day volume (Meta) | Marketing-agency ICP has mixed platform books — dual coverage is the differentiator; B2B stays prominent as S5 + likely demo niche (O4); niche-down revisited with real data at O5. Personalization quality beats volume under C2 time budget |
| 2026-09-07 | LinkedIn headline locked (v1.2): "Senior WooCommerce & Shopify Developer \| Checkout, Speed & Custom Features for Marketing Agencies \| pervej.com" | Expertise-first reads credible, not salesy; keeps audience + search keywords; offer mechanics ("white-label", "your brand, my code") moved to About opener and pervej.com hero |
| 2026-09-09 | **Theme approach locked (v1.3):** Gutenberg/block-based is the default for every new WordPress/Woo build — custom blocks + locked patterns/templates ("editable but unbreakable" is part of the agency pitch). Elementor is never chosen for new builds; it stays a fluency for rescuing and speeding up existing page-builder sites (S1 revenue), or when an agency insists (their call, priced for the bloat). Client-opinion answer: native blocks — faster, no license dependency, WordPress's own direction | Elementor stores layouts as JSON in the database — breaks Git discipline (8.2) and neutralizes Claude Code leverage; block builds are plain files in a repo (max AI speed), keep Core Web Vitals green, and locked patterns give agency staff safe editing without layout-breaking risk; the ICP's Elementor-heavy client sites are rescue revenue, not a build standard |
| 2026-10-06 | **Shopify theme approach locked (v1.4):** Horizon is the default base for every new Shopify build — custom work as theme blocks in its nested-block architecture, "editable but unbreakable" for the merchant's team, Combined Listings, and where the platform is heading. Dawn stays a first-class fluency, not a build choice: most agency clients arrive on existing Dawn-based stores, and that is rescue and feature revenue (S1, S2, S3), done in the architecture the store already has. | Mirrors the v1.3 Gutenberg/Elementor call. **Trade-offs stated:** Horizon ships updates at a weekly pace and its updates have overwritten direct customisations, so custom code lives in our own blocks and never edits Horizon's files, and any code touching its internals is quoted with maintenance care; default Horizon has trailed default Dawn on mobile PageSpeed in third-party tests (T1.6), so every Horizon build carries the T3 speed pass and a Lighthouse before/after. |

### Open questions
| # | Item | Owner | Resolve by |
|---|---|---|---|
| O1 | Confirm employment contract permits side work | Yeasir | Before first outreach |
| O2 | BD business registration + tax treatment of Payoneer income (consult local accountant) | Yeasir | Month 1 |
| O3 | Final pricing lock (after 5 agency conversations) | Yeasir | Month 2 |
| O4 | Demo store niche (suggestion: a B2B/wholesale demo — maps to highest-value feed demand) | Yeasir | Phase 0 |
| O5 | Niche the ICP further later (vertical? geo?) | — | Quarterly review |
| O6 | Case-study permission language in service agreement | Yeasir | Before pilot #1 |

---

## Appendix A — Shopify Catch-Up Ramp (2 Weeks)

**Setup (Day 1):** Shopify Partner account + dev store · Shopify CLI 3.x · Theme Check · connect **`@shopify/dev-mcp`** to Claude Code (AI works from current docs, not stale training data).

**Week 1 — Theme architecture delta:**
- CLI workflow: `shopify theme dev`, push/pull, GitHub theme integration.
- Section groups (header/footer JSON groups) · metafields/metaobjects as dynamic sources · **theme blocks** (nested) · **Horizon** theme system (Fabric, Ritual, Vessel — one shared architecture) alongside Dawn.
- Drill: rebuild **one Figma section per day** into Dawn or Horizon with Claude Code; build **one AJAX cart drawer** (free-shipping bar, upsell slot, clean event handling that doesn't break checkout scripts).

**Week 2 — Checkout & the demo:**
- Checkout Extensibility (checkout.liquid is fully retired): build **one checkout UI extension** — available on **all paid plans** since Winter '26, so this market now extends far beyond Plus stores.
- **One Shopify Function** (discount or shipping customization).
- New customer accounts (vs. classic) — know the difference.
- Skim the agentic-commerce layer (Spring '26): llms.txt / agents.md, standardized storefront events, Catalog API — enough to sell S6, deepen later.
- **Ship the public demo store** (Proof Kit item #1): a complete, client-ready store — custom sections + cart drawer + checkout extension, full page set, polished content, green Core Web Vitals — linked from pervej.com.

**Delivery-risk rule for early Shopify work:** take theme/section/speed jobs immediately; hold checkout-extension-heavy client work until 2–3 practice reps are done.

---

## Appendix B — Outreach Templates (rewrite in own voice)

**Initial message (LinkedIn DM or email):**
> Hi {Name} — came across {Agency} through {specific thing: a client launch, a post, their portfolio}. {One genuine, specific observation — e.g., "The {client} store looks great, though I noticed the mobile checkout takes ~6s to load."}
>
> I run a white-label dev service for marketing agencies: I build the custom WooCommerce/Shopify work your team doesn't have bandwidth for — checkout fixes, speed, custom features, integrations. Fixed scope, senior-reviewed, your brand on everything — I plug into your Slack or PM tool, so there's zero management overhead.
>
> If there's a dev task that's been stuck in your backlog, I'd be glad to quote a small pilot so you can see how I work. Worth a 15-minute chat?

**Follow-up 1 (+4 days):**
> Hi {Name} — floating this back up. If it helps: here's a 2-min walkthrough of a recent {Woo/Shopify} build → {Loom link}. If dev capacity isn't a pinch right now, no worries at all.

**Follow-up 2 (+10 days):**
> Last note from me, {Name} — I'll leave you with this: {one useful, specific tip relevant to their stack or a client site}. If overflow dev ever becomes a headache, you know where I am.

Then quarterly nurture only (comment on their content; share something useful; never pitch).

---

## Appendix C — LinkedIn Positioning (locked)

**Headline (locked 2026-09-07):**
> Senior WooCommerce & Shopify Developer | Checkout, Speed & Custom Features for Marketing Agencies | pervej.com

*Why this shape:* expertise first, audience second, no offer mechanics — the headline states, it doesn't sell. The identity clause leads because LinkedIn truncates headlines to roughly 60 characters in DMs and search results. "White-label" and "your brand, my code" live one level deeper: the About opener and the pervej.com hero. Don't reintroduce them into the headline.

**About (ready-to-paste draft — adjust to own voice before publishing):**

> I'm the white-label developer behind marketing agencies' WooCommerce and Shopify work — your brand on everything, my code underneath.
>
> If your dev queue is longer than your dev team, that's the gap I fill: checkout and cart work, speed and Core Web Vitals fixes, custom features and sections (Figma → Dawn/Horizon), tracking and API integrations, B2B/wholesale builds, and AI-agent-ready storefront setup.
>
> Background: 10+ years full-stack. Founder of PureDevs — Customer History, a self-hosted WooCommerce analytics plugin — plus a track record of complete store builds delivered in days, not months.
>
> How it works: send me a brief → fixed-scope quote within 48 hours → I build on staging → QA'd delivery with a Loom walkthrough → 14-day warranty. I work inside your Slack or PM tool, so there's zero management overhead on your side.
>
> DM me one stuck backlog item — I'll quote a small pilot so you can see how I work.

**Featured section:** pervej.com · demo store · 2 Looms · Customer History page.

**Small settings that matter:** turn on "Providing services" (Web Development, E-commerce Development) · banner image = the one-liner + pervej.com · custom profile URL.

---

## Appendix D — Case Study Template

1. **Client type** (anonymized unless permitted): "A US marketing agency's DTC skincare client on WooCommerce."
2. **Problem** — in the agency's words, with a number if possible.
3. **Constraint** — deadline, budget, legacy mess.
4. **Build** — what was done, stack, in 3–5 sentences (no AI mention needed).
5. **Result** — number first: speed score, conversion lift, delivery time, bugs post-launch (zero).
6. **Agency quote** — ask for one line at handoff, every time.

---

*End of v1.4 — update the Decision Log before acting outside this document.*
