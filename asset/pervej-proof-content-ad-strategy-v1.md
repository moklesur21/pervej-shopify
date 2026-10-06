# Pervej.com — Proof Content & LinkedIn Ad Strategy

**Version:** v1.0 · **Date:** 18 Sep 2026 · **Status:** Draft for sign-off · **Owner:** Yeasir
**Plan window:** Mon 21 Sep → Sun 15 Nov 2026 (8 weeks) · **Verdict date:** Mon 16 Nov 2026
**Reads with:** `white-label-dev-strategy.md` v1.3 (source of truth) · `content-engine-playbook.md` · the W / T / AW tutorial catalogs (practice builds double as training reps)

**Evidence tiers:** **[Cited]** external source (§14) · **[Observed]** from the existing strategy, playbook or operations · **[Uncertain]** planning assumption, replace with real numbers.

**Precedence:** this file **extends** the strategy doc and the content-engine playbook. It changes the output format of the weekly build and adds a paid layer. It does not change positioning, outreach volume, the job-safety rules or the theme approach.

---

## 1. The decision in one paragraph

The weekly practice build stays exactly as locked on 9 Sep. What changes is what gets published from it: not a showcase of the finished feature, but a **build log that proves how Yeasir works** — the brief, the questions asked, the timeline, the QA, the handoff. Agencies do not doubt that a developer can code a checkout; they fear slow turnaround, work that comes back needing as much effort again, and silence **[Cited]**. After four to six build logs exist, the best-performing single-image or video posts are sponsored as Thought Leader Ads to the same kind of agency owners the VA is contacting, so a connection request arrives from someone whose work they have already seen. Ads multiply the outbound. They never replace it.

**One structural fact:** white-label work is invisible by definition. Practice builds are therefore not a stopgap until client work can be shown — they are the **permanent** public proof system. Third-party proof comes from agency owners' words, never from their clients' projects.

---

## 2. What stays, what changes

| | Item |
|---|---|
| **Stays [Observed]** | Positioning: WooCommerce + Shopify developer for digital marketing agencies, ongoing "extra hand" capacity · 12 connection requests a day · VA sources via Sales Navigator, two days of warming, outreach on day 3 · Yeasir writes content and holds every conversation · Gutenberg/block-based default, Elementor only for rescue work · minimal single-tab tracking sheet |
| **Stays — job safety [Observed]** | Upwork is mined **read-only**. No bidding, messaging or profile activity for this venture. Briefs are anonymised dummy briefs. Practice builds are **never** framed as case studies. Nothing from the employer's work appears anywhere |
| **Changes** | Output standard = build log, not feature showcase (§4) · two posts per build, one of them sponsorable (§5) · Thought Leader Ads from Week 5 (§7) · one shared build also feeds LMB (§6) |

---

## 3. The buyer and the proof they need

**Buyer:** owner or operations lead of a digital marketing agency, 2–50 people, that sells web or ecommerce work it cannot always staff.

| Their fear | Evidence | What proves the opposite | Where it shows |
|---|---|---|---|
| Slow turnaround holds up campaigns that depend on the site | **[Cited: SEO Experts Company India]** | Real timestamps: brief received → staging link → handoff | Timeline slide / timeline image |
| Work comes back needing as much effort again | **[Cited: The White Label Agency partner quote]** | QA checklist passed, before/after speed scores, edge cases listed, rollback note | QA slide, walkthrough video |
| Poor communication, errors from unclear instructions | **[Cited: Millo]** | The clarifying questions asked **before** starting; the handoff note as written | Questions slide, handoff slide |
| Partner goes around them to the client | **[Uncertain — common objection]** | Stated rules: NDA first, agency-branded handoff, no contact with the end client, no portfolio use | "How I work with agencies" page |
| Capacity disappears when they need it | **[Uncertain]** | Honest availability window and response time: **[AVAILABILITY-WINDOW]**, **[RESPONSE-SLA]** | Same page, pinned post |

**The four silent questions**
| Question | Answer | Asset |
|---|---|---|
| Is this my problem? | The post opens with the client's problem in the client's words | Slide 1 / first line |
| Is it real? | Staging link, screen recording, timestamps | Walkthrough video |
| Did it work for someone like me? | **Today:** none — say nothing rather than imply. **Soon:** one agency owner's sentence after a test task | Featured section |
| What do I do next? | One small, low-risk step | The test task (§8) |

---

## 4. The build log — output standard

### 4.1 Topic selection (unchanged method, sharper filter)
Pick jobs that marketing agencies actually hand off:

| Lane | Examples | Why agencies care |
|---|---|---|
| A — Store fixes and features | Checkout, cart, product page, shop page problems; account and dashboard views | Direct revenue impact for their client |
| B — Agency staples | Landing pages from Figma, GA4 / pixel / server-side tracking, speed and Core Web Vitals, theme sections, page-builder rescue | They sell the campaign; someone has to make the site measurable and fast |
| C — Resellable builds | Outputs of the AI-commerce catalog (e.g. ROI dashboard, retention features) | Something an agency would happily resell **[Observed — AW-series principle]** |

Rotate A → B → A → C so the feed never reads as one trick.

### 4.2 Carousel template (LinkedIn document post, 9–10 slides) — **organic only**
1. **Cover:** the problem in the client's words + the label *"Practice build from a public job brief. Anonymised."*
2. **The brief** as received — three lines.
3. **Questions I asked before starting** — two or three. *(Proves communication.)*
4. **Plan and estimate** — tasks, hours, delivery date.
5. **Timeline** — real timestamps from brief to handoff. *(Proves turnaround.)*
6. **The build** — before/after or the key screen (one or two slides).
7. **QA passed** — mobile, browsers, speed before/after, edge cases. *(Proves no rework.)*
8. **Handoff** — what the agency receives: staging link, walkthrough video, notes, rollback.
9. **What I'd flag to the client** — one insight the agency can take upstairs and look good with. Then the CTA (§8).

### 4.3 Walkthrough video (60–90 s, native upload) — **sponsorable**
Brief in one sentence → staging site → the hardest part, solved → QA result on screen → the handoff package → one CTA line. Screen recording with voice, captions on.

### 4.4 Timeline image (single image) — **sponsorable**
One graphic: `Brief Mon 10:00 → Questions answered Mon 14:00 → Staging Tue 18:30 → QA Wed 11:00 → Handoff Wed 15:00`. Four lines of text above it: the problem, the constraint, the result, the link to pervej.com.

### 4.5 Honesty and AI
- Every piece carries the practice-build label. No "client", no "case study", no invented results.
- AI may draft the write-up **from the real log**. The timestamps, screenshots, questions and decisions must be real. This is what LinkedIn now rewards: a July 2026 sample found over four in five long posts were likely AI-written, LinkedIn says it reduces distribution of generic AI-looking content, and posts flagged as likely AI drew roughly 45% less engagement — while AI-*assisted* posts in Buffer's 1.2M-post analysis did about 10% better. **[Cited: Originality.ai — an AI-detector vendor, directional; Buffer via LinkedGrow]**
- Whether to state that builds are Claude Code–assisted with human review is an open decision (§13).

---

## 5. Publishing rhythm

| Day | Post | Format | Sponsorable? |
|---|---|---|---|
| Tue | Build log | Document carousel (§4.2) | **No** — Thought Leader Ads cannot sponsor documents, multi-image posts or polls **[Cited: LinkedIn]** |
| Thu | Walkthrough **or** timeline image | Native video / single image (§4.3–4.4) | **Yes** |
| Daily | Comments on prospects' posts | AI-drafted from screenshots, per the existing warming workflow **[Observed]** | — |

Put the pervej.com link in the Thursday post's own text: a sponsored post cannot have a URL, headline or CTA button added by the advertiser. **[Cited: LinkedIn]**

**Profile as landing page**
- Headline states who it is for: *WooCommerce + Shopify developer for marketing agencies · white-label · [AVAILABILITY-WINDOW]*.
- Featured: the three best build logs + "How I work with agencies".
- **pervej.com — one page:** who it is for · the five rules (NDA first, your brand on everything, no contact with your client, no portfolio use, fixed scope in writing) · process · build logs · availability · test-task terms · contact.

---

## 6. Shared work with Launch My Boutique — one build, two cuts

| This week's build | Pervej.com cut | LMB cut |
|---|---|---|
| Boutique skin swap | "One skeleton, many brands: how a tokenised store is resold" | P3 reel |
| Pay-by-link / checkout flow | Build log | P1 or P2 variant |
| Order list / account view | Build log | P4 reel |
| Tracking, speed, theme sections, page-builder rescue | Build log | **None** |

Same build, different buyer, different proof. Agency content never appears on the LMB profile and boutique reels never appear here.

---

## 7. Paid — LinkedIn Thought Leader Ads only

### 7.1 Why this format and no other
2026 benchmark data from 211 B2B companies and $5.5M of spend: single-image ads ≈ **$13.23 CPC, 0.42% CTR**; Thought Leader Ads ≈ **$2.29 CPC, 2.68% CTR**. **[Cited: ZenABM, via Datavinity]** Standard LinkedIn CPCs run $5.50–8.50 with CPMs of $30–50. **[Cited: Percuity]** For a one-person service, every other format is unaffordable.

**Not used:** lead-gen forms, brand single-image ads, message or conversation ads, document ads.

### 7.2 Mechanics **[Cited: LinkedIn Help]**
1. Create a **Company Page** (Pervej.com) and a Campaign Manager ad account tied to it. Do this in Week 1 even though ads start in Week 5.
2. Classic ad set · objective **Engagement** (or Brand awareness) · ad format must match the post: single image **or** video.
3. Browse existing content → LinkedIn members → find your own post by URL → request approval → approve it as the author.
4. Only posts with one image or one video qualify.
5. Minimum audience is 300 members; location is a required facet.

### 7.3 Define the audience once, use it twice
Write one ICP filter set and use it in **both** Sales Navigator (for the VA) and Campaign Manager (for ads). Then the people being messaged are, by construction, inside the audience seeing the posts.

| Facet | Value |
|---|---|
| Location | **[GEO-LIST]** — for ads, start with **one** country so frequency concentrates |
| Company industry | Advertising Services · Marketing Services **[CONFIRM names in the UI]** |
| Company size | 2–10 · 11–50 |
| Seniority / titles | Owner, Partner, CXO, Director · Founder, Co-Founder, Managing Director, Head of Operations, Head of Delivery, Technical Director |
| Target size | roughly 5,000–15,000 members **[Uncertain]** |

**Frequency check [Uncertain]:** $300 a month at a $40–60 CPM buys about 5,000–7,500 impressions. For people to see a post three times a month, the actively served audience is about 1,700–2,500. A tight audience is a feature here, not a problem.

**The VA's list as a matched audience — later, not now.** A company-list upload needs at least 300 rows and must match at least 300 members; LinkedIn recommends 1,000+ companies and takes up to 48 hours to process. **[Cited: LinkedIn Help]** At 12 requests a day the list passes 300 rows around Week 5–6. Upload it then and add it to the attribute audience with OR. Include each agency's LinkedIn Page URL to lift the match rate. **[Cited: LinkedIn Help]**

### 7.4 What gets sponsored
Only posts that already worked organically — sponsor winners, do not rescue losers. **[Cited: Postiv]** Rule: after four to six Thursday posts, take the top two by engagement **from agency people** (check who reacted, not how many). Replace a sponsored post when its CTR drops below 1% or after four weeks.

### 7.5 Budget
**$10/day** — LinkedIn's practical floor — from Week 5: about $280 inside this window. **[Uncertain — your call]** Agencies quote $1,500–3,000 a month as the "effective" minimum for this format **[Cited: LinkedOtter]**; that assumes pipeline attribution at scale. The job here is smaller: be familiar to a few thousand agency owners before a DM arrives.

### 7.6 How to read the ads
Do **not** judge on clicks or leads; the supported objectives are awareness and engagement, not direct response. **[Cited: LinkedIn; ContentIn]** Judge on:
1. **Outbound lift:** connection acceptance rate and reply rate, four weeks before ads vs four weeks with ads. If outreach covers more than one country, run ads in only one and compare.
2. **Who engaged:** Campaign Manager's demographics report — are the reactions from agency owners and ops leads?
3. **Mentions:** tally every conversation where the prospect brings up a post unprompted. Add one column to the sheet: `saw_posts` (Y/N).

---

## 8. The next step you ask for

Agencies test a new partner with something small. Make that the offer instead of "let's have a call":

> Agencies: send me one task you've been putting off. Fixed price, **[TEST-TASK-TURNAROUND]**, NDA first. If it isn't right, you don't pay.

**[CONFIRM against `white-label-dev-strategy.md` v1.3 — this is a recommendation, not yet a locked term.]** It answers "what do I do next?", it turns the reliability claim into a live demonstration, and the agency owner's one-sentence reaction afterwards is the third-party proof this plan otherwise lacks.

**DM line that uses the content (day 3):**
> Saw you're running [client type] campaigns. I did a practice build last week on exactly that checkout problem — timeline and QA are in the post. If you ever need an extra pair of hands on Woo or Shopify, I take one test task per agency, fixed price.

---

## 9. Unit economics

```
LTV          = [MONTHLY-VALUE-PER-AGENCY] × [EXPECTED-MONTHS]
Allowable CAC = 10–15% of LTV
```
Example **[Uncertain]:** $1,200 a month × 8 months = $9,600 → allowable CAC ≈ $960–1,440. At $300 a month in ads, one retained agency every three to four months keeps the channel inside that line. LinkedIn is usually advised only for high contract values **[Cited: The Smarketers]**; a retained agency relationship is the only thing that makes it reasonable here. One-off small fixes do not justify the spend.

---

## 10. Weekly scorecard

| Area | Metric |
|---|---|
| Outcome | Test tasks started · agencies retained |
| Outbound | Requests sent · accepted · replies · real conversations · calls · `saw_posts` = Y |
| Content | Builds shipped · Tuesday + Thursday posts published · engagement **from ICP titles** |
| Ads | Spend · impressions · CTR · CPC · share of engagement from agency owners |

Follower count and total likes are not on the scorecard.

---

## 11. Gates and kill criteria

| Gate | Check | If missed |
|---|---|---|
| **G1 Consistency** — end of Week 4 | Four builds shipped, eight posts live, Company Page + ad account ready | Capacity problem. Go to one build a fortnight. Delay ads; add nothing |
| **G2 Organic signal** — end of Week 4 | At least two Thursday posts with reactions or comments from agency-side people | The problem chosen or the first line is wrong, not the channel. Re-pick topics from Lane B |
| **G3a Ads** — at $150 | CTR ≥ 1% (format median is 2.68% **[Cited]**) | Swap the post. If the second post also fails, the audience is too broad — narrow size or titles |
| **G3b Ads** — at $280 | CPC ≤ $8 and most engagement from ICP titles | Pause, fix the audience definition, relaunch once |
| **G4 Outbound lift** — after four weeks of ads | Acceptance **or** reply rate up ≥ 20% relative to the pre-ads baseline | Stop ads. Content and outbound continue unchanged |

**Standing rule [Observed — confirm it still applies]:** the LinkedIn outbound arm cannot be killed before **100 real post-acceptance conversations**, whatever the ads or the other ventures are doing. LinkedIn's invitation limits make this arm structurally slow; slow is not the same as weak demand.

**Planning numbers for the window [Uncertain]:** 12 requests × 5 days × 8 weeks ≈ 480 sent → 25–35% accepted ≈ 120–170 → 15–25% reply ≈ 18–42 conversations → 2–8 calls → 1–2 test tasks.

**Verdict on 16 Nov**
- **≥ 1 test task started →** continue everything; the agency's reaction becomes featured proof.
- **Conversations happening, no test tasks →** the offer or the ask is the problem. Rework §8 before producing more content.
- **Few conversations despite acceptances →** the DM, not the content. Review the day-3 message.
- Ads are judged separately by G4 and can stop without touching the rest.

---

## 12. Eight-week plan

| Week | Dates | Work |
|---|---|---|
| 1 | 21–27 Sep | Build 1 (Lane A) · headline + Featured · create Company Page and ad account · write the ICP filter set once (§7.3) · start logging acceptance and reply rates weekly |
| 2 | 28 Sep–4 Oct | Build 2 (Lane B) · pervej.com one-pager live · confirm test-task terms |
| 3 | 5–11 Oct | Build 3 (Lane A — shared with LMB where §6 allows) |
| 4 | 12–18 Oct | Build 4 (Lane C) · pick the two posts to sponsor · **G1, G2** |
| 5 | 19–25 Oct | Build 5 · **launch Thought Leader Ads** ($10/day, one country, engagement objective) |
| 6 | 26 Oct–1 Nov | Build 6 · upload the VA list if ≥ 300 rows · **G3a** |
| 7 | 2–8 Nov | Build 7 · rotate the sponsored post if needed · agencies are at peak load before BFCM — lead with overflow capacity |
| 8 | 9–15 Nov | Build 8 · **G3b** · pull the scorecard · **verdict 16 Nov** (G4 reads one week later) |

**Floor budget for the window [Uncertain]:** ≈ **$280**.

---

## 13. Capacity rule and open items

**Capacity:** one build a week, cut two ways (§6). The build is developer and training time already planned; the content adds about 2–3 hours. When the week is short: **reply to conversations → ship the Thursday post → ship the Tuesday carousel → skip the week's ad changes.**

**Open items**
1. **[GEO-LIST]** and which single country runs ads first.
2. **[AVAILABILITY-WINDOW]** and **[RESPONSE-SLA]** — must be true alongside the day job.
3. Test-task terms (§8) against the strategy doc.
4. **[MONTHLY-VALUE-PER-AGENCY]** and **[EXPECTED-MONTHS]** for §9.
5. Whether the 100-conversation rule from the earlier three-arm test still binds this venture.
6. Whether to disclose the Claude Code–assisted workflow in content. Agencies increasingly expect AI-assisted delivery **[Cited: ColorWhistle]**; disclosure with "human-reviewed, fixed QA checklist" may be a strength.
7. LinkedIn industry names as they appear in Sales Navigator and Campaign Manager.

---

## 14. Sources
| Claim | Source |
|---|---|
| Slow turnaround is a top agency fear | SEO Experts Company India — white-label design and development page |
| Work that turns out to be double the effort | The White Label Agency — partner testimonial |
| Quality control and communication risk | Millo — white label website solutions |
| Agencies expected to integrate AI-assisted workflows | ColorWhistle — white label website development guide |
| 4 in 5 long posts likely AI; LinkedIn reducing generic AI content | Originality.ai, Jul 2026 — originality.ai/blog/ai-content-published-linkedin |
| ~45% less engagement for likely-AI posts | Originality.ai 2025 study, via SocialNexis |
| AI-assisted posts ~10% higher engagement | Buffer analysis, via LinkedGrow |
| TLA vs single-image CPC / CTR | ZenABM 2026 benchmarks — zenabm.com/blog/linkedin-ads-benchmarks · Datavinity |
| Average LinkedIn CPC / CPM | Percuity — LinkedIn Ads benchmarks 2026 |
| TLA eligibility, objectives, permissions, no added URL or CTA | LinkedIn Help a1399568 · LinkedIn TLA specs · ContentIn |
| Matched audience minimums, 1,000+ companies, 48 h, Page URLs | LinkedIn Help 106247 · a423102 |
| Sponsor posts that already performed | Postiv — LinkedIn thought leadership ads |
| $1,500–3,000 "effective" monthly minimum | LinkedOtter |
| LinkedIn advised mainly for high contract values | The Smarketers — LinkedIn Ads benchmarks 2026 |

---

## 15. Changelog
- **v1.0 — 18 Sep 2026.** First version. Keeps the 9 Sep weekly practice-build system; changes the output standard to build logs that prove reliability; adds the Tuesday carousel / Thursday sponsorable-post rhythm; adds Thought Leader Ads from Week 5 with a shared ICP filter set; proposes the test-task offer; sets gates and the eight-week freeze.
