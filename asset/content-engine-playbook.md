# Content Engine Playbook — Upwork-Mined Practice Projects
## Real market demand → practice builds → weekly content, portfolio proof, and training reps

| | |
|---|---|
| **Owner** | Yeasir Pervej |
| **Version** | 1.0 — September 9, 2026 |
| **Works with** | Strategy doc v1.3 (delivery system 8.1–8.5) · Shopify T-series catalog · WooCommerce W-series catalog |
| **Sharing** | Safe to share with the developer in full — contains nothing from internal-only sections |

**What this solves:** the content engine needs build logs and teardowns, but there are no client deliveries yet. This playbook manufactures them honestly: real Upwork job posts define the work, practice builds execute it to full delivery standard, and every build feeds LinkedIn content, the proof kit, and the training trackers at the same time.

**One cycle produces:** 1 QA'd build · 1–2 training checkmarks · 2–3 content pieces · proof-kit material.
**Target pace:** one cycle per week.

---

## 1. Five hard rules — read first, every time

1. **Mining is read-only. C1 is absolute.** Browse Upwork job feeds in a logged-out / incognito window only. Never bid, save, favorite, message, or interact in any way. Screenshots only — zero account footprint.
2. **Job-post text never leaves the vault.** Briefs are rewritten from scratch by Claude. Published content never quotes, names, or references a job post, a poster, or Upwork itself.
3. **Practice builds are never case studies.** They feed build logs, teardowns, demos, Looms, and the portfolio — always framed honestly as demo/practice work. The case-study template is reserved for real paid deliveries. Never imply a paying client existed.
4. **Every build runs the real delivery discipline.** Dev store or local site only — never live. Line-by-line review of all AI output. Full QA checklist. Loom on everything. Every practice build is also a delivery rehearsal.
5. **AI is the engine, never the story.** Content shows the work and the reasoning. Claude Code stays out of the pitch and out of the posts — capture code and results, not the tooling.

---

## 2. Who does what

| Step | Yeasir | Developer | Claude (this project) |
|---|---|---|---|
| 1. Mine | Screenshots, batch, file | — | — |
| 2. Select | Final pick | — | Scores, shortlists, asks for missing details |
| 3. Brief | — | — | Writes the brief, acting as the agency client |
| 4. Quote | Reviews (adds private pricing practice) | Drafts scope/exclusions/timeline | Responds as client; occasionally tests scope creep |
| 5. Build | Reviews every line (or builds) | Builds in Claude Code | Build direction on request |
| 6. QA + Loom | Verifies | Runs checklist, records Loom | — |
| 7. Packet | — | Assembles (Appendix B) | — |
| 8. Write | Edits, approves | — | Drafts all content pieces |
| 9. Publish + log | Publishes, updates trackers | — | — |

**Track note — who sits in the build seat:**
Until the developer clears **W2.4** (Woo) / **T2.1** (Shopify), **Yeasir builds the weekly project himself.** Early tutorials (environment setup, security drills) aren't content-worthy, and the Shopify practice projects double as the Phase 0 ramp drills ("one Figma section per day"). The developer takes the build seat when he reaches the feature-work modules — from then on, **his tutorial position drives project selection.**

---

## 3. The pipeline — nine steps, one week

### Step 1 — MINE *(Yeasir · ~30 min · weekly or bi-weekly)*

- **Inventory first:** the existing September captures (21 detailed jobs + 2 feed screenshots) are cycle fuel already on hand. Fresh mining only when the inventory runs thin.
- **Where:** Upwork public job search, logged-out/incognito browser. Search the keyword sets in Appendix C.
- **What to capture:** the full job post — title, complete description, budget, posted date, proposals count. Crop or ignore anything identifying the client by name.
- **What makes a good capture:** specific requirements (a real feature spec, a named pain, a number), not "build me a store, $50." Specificity is what converts into a believable brief and a strong before/after.
- **Filing:** one folder per batch, named by date (`mining/2026-09-13/`). 5–15 captures per session.

### Step 2 — SELECT *(Claude + Yeasir · ~15 min)*

Feed the batch to Claude in this project using the mining-batch template (Section 7). Claude scores every job against the scorecard, asks for full details on any cut-off screenshot, and recommends **1 primary + 1 backup**. Yeasir makes the final call.

**The scorecard — needs 4 of 5 to proceed:**

| # | Check | Pass looks like |
|---|---|---|
| 1 | **Service fit** | Maps cleanly to one of services S1–S6 |
| 2 | **Training fit** | Matches a tutorial at or just ahead of the builder's tracker position |
| 3 | **Content value** | Yields a visible before/after, a hard number, or a 30-second demo |
| 4 | **$0 buildable** | Dev store / local site, free tooling only — no paid themes, plugins, or apps required |
| 5 | **Right-sized** | 2–8 focused hours — fits one Saturday block |

Oversized but valuable jobs → route to the **full-site track** (Section 5) or have Claude split them into weekly phases.

### Step 3 — BRIEF *(Claude, acting as the client)*

Claude rewrites the selected job as an anonymized agency brief in the standard intake shape (delivery workflow 8.1):

- Fictional agency + fictional end client (realistic, unrecognizable from the original post)
- Goal · scoped deliverables · explicit exclusions · constraints · assets provided · deadline

The brief arrives as if a real agency sent it. **Treat it exactly like a real brief** — that's the rehearsal.

### Step 4 — QUOTE *(builder · ~30 min · practice)*

Reply in writing with **deliverables, exclusions, and timeline** — the fixed-scope reflex, trained until it's automatic. (Yeasir practices the pricing layer privately; the developer's version stays price-free.)

Claude responds as the client — approving, or occasionally pushing **one out-of-scope request mid-project.** The correct answer is a polite written change-order, never silent extra work. This gets drilled on purpose.

### Step 5 — BUILD *(Claude Code · Saturday block)*

- **Optional but recommended:** request a build direction from Claude first — approach, file/section map, prompt sequence, and the review hotspots (the lines that deserve the closest human read).
- Ground rules from the catalogs apply in full: never live · Git from commit #1 · every AI-generated line reviewed before it counts · if the build maps to a tutorial, that tutorial's verification checklist must pass.
- **Capture as you go — Appendix A checklist.** The single biggest failure mode of this whole engine is building first and capturing later: the before-state is unrecoverable. **No before-capture, no build.**

### Step 6 — QA + LOOM *(builder · same block)*

- Run the **full delivery QA checklist (strategy doc 8.3)** — no known-defect passes, same as a paid job.
- Record a **3–5 minute Loom:** what was asked → what was built → one decision explained → the result shown working. Agencies buy the reasoning; the Loom practices exactly that.
- The best Woo Loom and best Shopify Loom get promoted to the **proof kit** (pervej.com + LinkedIn featured).

### Step 7 — CONTENT PACKET *(builder · 20 min · same day)*

Fill the Appendix B template — before/after numbers, screenshots, three decisions, one problem-and-fix, QA result, Loom link. Send it to Claude in this project with the packet template message (Section 7). A build without a packet produced **nothing** — the packet is part of "done."

### Step 8 — WRITE *(Claude)*

From one packet, Claude drafts the week's set:

| Piece | Pillar | Shape |
|---|---|---|
| **Build log** | Pillar 1 | Before/after led, number first, screenshots attached |
| **Teardown** | Pillar 2 | The general problem pattern behind the job — why it happens, the right fix |
| **Platform note** *(when relevant)* | Pillar 4 | If the build touched something new (checkout extensions, metaobjects, agentic layer) |

**Honest-framing rules for every piece:**
- Demo framing, stated plainly: *"Rebuilt this on a demo store"* / *"Took a slow demo checkout from 6.1s to 1.9s."*
- Never *"we recently helped a client…"* — no client existed.
- No Upwork, no job post, no AI tooling in the content.
- Written for **agency owners**, not developers — plain language, outcome first, hook in the first two lines.
- **Monthly:** the best-performing post gets expanded by Claude into a pervej.com article.

### Step 9 — PUBLISH + LOG *(Yeasir · Sunday review)*

- Slot posts into the weekly rhythm (Section 4).
- Check off the tutorial in the T/W progress tracker.
- Add the build to the portfolio/demo index.
- **Anything built for the second time → productization extraction list.** Log it.

---

## 4. Weekly cadence — where this fits the operating rhythm

The engine adds **zero new hours** — it fills existing Section-10 blocks with better raw material. Outreach blocks are untouched; they stay non-cancellable.

| Slot | Content-engine action |
|---|---|
| **Fri** (1h buffer) | Mining batch (30 min, when inventory is thin) + selection with Claude (15 min) → brief issued |
| **Sat** (deep block) | Build → QA → Loom (Steps 5–6) |
| **Sun** (2h) | Packet → Claude writes → schedule posts → update trackers (Steps 7–9) |
| **Thu** | Publish the build log |
| **Sun batch** | Teardown (+ platform note) queued for the week |

**Cycle 1 starts now:** the 21 existing captures mean no mining is needed this week — go straight to Step 2.

---

## 5. The full-site track

Same loop, bigger unit. Full sites are **phased into weekly briefs by Claude**, like a real agency phased project — each phase obeys the weekly cycle: one phase, one packet, one week.

**Flagship 1 — the public Shopify demo store** *(proof kit #1, Phase 0 exit criterion)*
Phases: store structure & core templates → custom sections (Figma → Dawn/Horizon) → AJAX cart drawer → checkout UI extension + polish + full QA.
Output: a 4–6 post series ending in the full-store reveal, linked from pervej.com.

**Flagship 2 — the Woo block-based demo** *(the v1.3 theme decision, made visible)*
Custom blocks + locked patterns/templates — the "editable but unbreakable" showcase. Maps to W3.5–W3.6. Output: the Woo proof-kit Loom + a strong Pillar-3 post (how agencies get client-safe editing without page-builder bloat).

**Capstones T8 and W8** run through this track when the developer reaches them — his proof-of-skill artifacts become content series too.

---

## 6. Asset routing — what goes where

| Output | Destination |
|---|---|
| Build log posts | LinkedIn (Pillar 1) |
| Teardown posts | LinkedIn (Pillar 2) |
| Best post of the month | pervej.com article (Claude expands it) |
| Best Woo Loom + best Shopify Loom | Proof kit — site + LinkedIn featured |
| Demo store / demo builds | pervej.com + LinkedIn featured |
| Components built twice | Productization extraction list |
| Case-study template (Appendix D) | **Paid deliveries only — nothing from this playbook** |

---

## 7. Message templates — talking to Claude

Run selection, briefs, build direction, and writing **inside this Claude project** — the strategy doc, both training catalogs, and progress state live here, so outputs stay consistent with them. A second AI is fine as an outside reader on drafts; the state lives here.

**Mining batch:**
> Mining batch [date]. Builder this week: [Yeasir / developer — position: W_._ / T_._]. Run the scorecard, shortlist, ask for anything missing, then issue the brief for the top pick.

**Build direction:**
> Brief accepted: [build name]. Give me the build direction — approach, file/section map, Claude Code prompt sequence, and review hotspots.

**Content packet:**
> Content packet — [build name]. [paste Appendix B]. Write the week's set: build log + teardown [+ platform note if relevant].

---

## Appendix A — Capture checklist (during every build)

**Before the first change — mandatory:**
- ☐ Full-page screenshots of every page you'll touch (desktop + mobile widths)
- ☐ Lighthouse scores, mobile + desktop — **screenshots, not memory**
- ☐ The baseline number the job cares about (load time, checkout steps, error, missing feature)
- ☐ Two lines describing the starting state

**During:**
- ☐ One-line log per meaningful decision or tradeoff
- ☐ Every problem hit + how it was fixed (scratch file is fine)
- ☐ Code/diff screenshots worth showing — **capture the code and the result, never the AI tooling; no secrets on screen**

**After:**
- ☐ Same screenshots, re-shot
- ☐ Lighthouse after (mobile + desktop)
- ☐ 30–60s screen recording of the feature working
- ☐ One-paragraph diff summary (what changed, where)

---

## Appendix B — Content packet template

```
BUILD:            [name] — [date] — [builder]
SOURCE JOB REF:   [internal folder/date ref only — never published]
SERVICE TAG:      S_
TUTORIAL:         W_._ / T_._  — checked off? [y/n]
GOAL (client's one line):
BEFORE:           [metrics] + [screenshot refs]
AFTER:            [metrics] + [screenshot refs]
3 DECISIONS:      1)  2)  3)
1 PROBLEM & FIX:
QA:               8.3 full pass [y/n] — exceptions: none allowed
LOOM:             [link] — proof-kit candidate? [y/n]
REPO / FILES:     [link]
REUSABLE COMPONENT? [y/n] → if y, add to extraction list
```

---

## Appendix C — Mining keyword sets (by service)

| Service | Search terms |
|---|---|
| S1 Speed | woocommerce speed · shopify slow · core web vitals · pagespeed · site optimization |
| S2 Checkout/cart | woocommerce checkout · shopify checkout · cart drawer · shipping rates · checkout field |
| S3 Features/sections | shopify section · figma to shopify · woocommerce custom · product configurator · custom fields |
| S4 Integrations | ga4 ecommerce · pixel shopify · woocommerce api · webhook · zapier woocommerce |
| S5 B2B | wholesale woocommerce · b2b shopify · tiered pricing · request a quote |
| S6 Agent-ready | ai agent store · llms.txt · structured data shopify *(rare — capture anything close)* |

Also capture: **"long-term developer" posts** — not for building, but as pattern evidence for Pillar-3 (agency POV) content.

---

*Maintenance: review this playbook in the Sunday weekly review whenever the loop snags; version-bump on any change. Same rule as everywhere else — the doc is the truth.*
