# Pervej.com — Demo-Project Plan

**v1.0 · Mon 28 Sep 2026 · Owner: Yeasir Pervej**
Reads with: `white-label-dev-strategy.md` v1.3 · `pervej-proof-content-ad-strategy-v1.md` · `content-engine-playbook.md` · the W / T / AW tutorial catalogs
**Shareable with:** Asad and the VA. Contains no pricing, pipeline or client data.

---

## 1. Purpose

One practice build a week, run exactly like a client job, recorded from problem to handoff.

White-label work can never be shown, so these builds are not a stopgap until client work exists — they are the venture's permanent public proof. What gets published is not the finished feature but the way it was done: the brief, the questions asked, the timeline, the QA, the handoff. Agencies don't doubt that a developer can code a checkout; they fear slow turnaround, work that comes back needing redoing, and silence. Every demo exists to counter those three fears with evidence: **real timestamps** (turnaround), **a passed QA sheet with edge cases listed** (no rework), **the questions asked before starting and the handoff note as written** (communication).

### 1.1 Rules that never bend

| Rule | Detail |
|---|---|
| **Practice build, said so** | Every post, video and slide carries the label *"Practice build from a public job brief. Anonymised."* Never "client", never "case study", never an invented result. |
| **The category, not the client's bug** | A job post never has enough to reproduce the exact issue. We recreate a realistic version of the *same kind* of problem on our own site and never imply we fixed that store. Nothing that identifies the poster: no store name, URL, brand, product line, or verbatim text. |
| **Upwork stays invisible** | Job posts are read by Yeasir only, read-only — no bidding, messaging or profile activity, ever. Asad and the VA never touch Upwork. The platform's interface never appears on screen or in a file; the brief is retyped in our own format, paraphrased. |
| **Real timestamps only** | The clock starts when the brief is issued and stops at handoff. Building the "before" state happens off the clock, and the log says so. Nothing is staged to look longer or shorter than it was. |
| **AI stays off screen** | Claude Code is the engine, not the show. The Claude Code terminal, prompts and generated code streams stay out of frame until open item 6 of the proof strategy (disclose the workflow or not) is decided. |
| **Never on a live site** | Local WordPress or a Partner dev store, always. Nothing from the day job, nothing under NDA. |
| **Reviewed before it counts** | Claude Code output is reviewed line by line before a commit counts as done. The review is the skill. |
| **IP hygiene** | Free or licensed bases only — Dawn, Horizon, WordPress.org plugins, our own kits. No paid-theme code, no nulled plugins, no images or copy lifted from real stores. |

---

## 2. Roles

| Who | Does | Never |
|---|---|---|
| **Yeasir** | Supplies the week's job list (screenshots or pasted text) · picks from the shortlist · approves the brief · reviews every PR line by line and merges · final QA pass · voice-over · approves all copy · holds every prospect conversation | Lets a demo through without the review |
| **Claude** | Scores candidates against §3 · writes the brief package and the setup script · **plays the client**: answers questions, approves the plan, accepts or rejects the delivery · drafts the content package from the real log | Skips a gate · reveals client facts Asad didn't ask for · accepts a delivery with a missing artefact |
| **Asad** | Runs setup and records the "before" · asks questions · plans and estimates · builds in Claude Code and reviews the diff · runs QA · writes the handoff · records raw footage · opens the PR · resets the environment | Touches Upwork · frames a demo as client work · merges to `main` |
| **VA** | Files recordings by ID · edits and captions · publishes on the schedule | Holds a conversation · changes copy without approval |

Either Yeasir or Asad can build a demo; the other one reviews the PR. Yeasir always merges.

---

## 3. Sourcing and selecting projects

Not every job becomes a demo. The feed is a source of *real agency problems in the client's words*; the selection below picks the ones that make the strongest proof for the least setup.

### 3.1 Pipeline

1. **Yeasir** pastes the week's job list into the project chat — screenshots or copied text, 10–30 posts, any mix of Woo and Shopify.
2. **Claude** scores every post against the gates (§3.3) and criteria (§3.4) and returns a ranked shortlist of 3–5, each with lane, score, the proposed first line, and a one-line setup plan.
3. **Yeasir** picks one. The rest go to `_backlog/candidates.md` with their scores, so a thin week pulls from the backlog instead of forcing a weak pick.
4. **Claude** writes the brief package (§4). Asad starts Monday.

### 3.2 Lanes and rotation

| Lane | What | Why agencies care |
|---|---|---|
| **A — Store fixes and features** | Checkout, cart, product page, shop page problems; account and dashboard views | Direct revenue impact for their client |
| **B — Agency staples** | Landing pages from Figma, GA4 / pixel / server-side tracking, speed and Core Web Vitals, theme sections, page-builder rescue | They sell the campaign; someone has to make the site fast and measurable |
| **C — Resellable builds** | Outputs of the AI-commerce catalog, and our own niche ideas | Something an agency would happily resell |

Rotate **A → B → A → C** so the feed never reads as one trick. Full builds (§9) take a lane too: a store from scratch is usually Lane A or C; a redesign is Lane B.

### 3.3 Gates — all five must pass

| # | Gate | Fails if |
|---|---|---|
| G1 | Platform | Not WooCommerce/WordPress or Shopify |
| G2 | A task an agency hands off | It's a hire ("full-time Shopify developer"), an app build, design-only, SEO content, ad management, data entry, or a large-catalog migration |
| G3 | Reproducible with what we have | Needs the client's data, a paid plugin or app we don't licence, their ERP/CRM, or their existing site |
| G4 | Anonymisable | The problem is so specific that recreating it identifies the poster (a unique product, a named brand) and can't be generalised |
| G5 | Fits the slot | More than ~8 build hours for a weekly demo — unless deliberately picked as a full build |

### 3.4 Score — six criteria, 0–2 each

| # | Criterion | 2 | 1 | 0 |
|---|---|---|---|---|
| S1 | **Agency demand** | Checkout/cart, speed, tracking, sections/features, page-builder rescue, B2B | Account/dashboard views, content layouts | Anything else |
| S2 | **Showable on screen** | A before/after number, a working thing you can click, a test order | Backend-only but provable through a test order or a log | Nothing visible |
| S3 | **Symptom clarity** | A concrete symptom in the post ("checkout hangs when a coupon is applied", "mobile score 34") | Category only ("need speed help") | Vague ("fix my site") |
| S4 | **Setup effort** | Planted from the baseline by script in under an hour | Needs a built environment (Elementor bloat, a plugin stack) | Can't be planted |
| S5 | **Service-menu fit** | Maps directly to a service line (checkout/cart, speed, features/sections, tracking/integrations, B2B, agent-ready) | Adjacent | Off-menu |
| S6 | **Reuse value** | The fix becomes a kit we'll use again (cart drawer, tracking setup, checkout-field pattern, speed recipe) | Reusable in part | One-off |

**≥ 9 → build now · 6–8 → backlog · ≤ 5 → skip.** Ties: prefer the lane that is due in the rotation, then the higher S3 — a concrete symptom gives the best first line.

### 3.5 Instant skips

- Hires and long-term roles — a signal of demand, not demo material
- "Urgent fix" posts with no symptom
- Anything needing a paid plugin or app we don't own — never a nulled copy
- Migrations, bulk data work, catalog uploads
- Anything where the post text identifies the client and can't be generalised
- Jobs whose value is design or copy rather than code

### 3.6 Worked example

Post, paraphrased: *WooCommerce store; checkout spins forever when a customer applies a coupon on mobile; started after a plugin update; classic checkout; ~400 products.*

G1–G5 pass. S1 2 · S2 2 (spinner → working checkout, test order) · S3 2 · S4 2 (plant a conflicting hook in a small mu-plugin, or a known-conflicting free-plugin combination) · S5 2 (checkout and cart) · S6 1 (the diagnosis pattern is reusable; the fix is one-off) = **11 → build**, Lane A.

First line for the post: *"Checkout spins forever when a coupon is applied — on mobile only."*

---

## 4. The brief — Claude as the client

### 4.1 The package

For the picked job, Claude produces the following in the demo's folder, on a new branch:

| File | What | Who |
|---|---|---|
| `brief.md` | The client's ask, anonymised and in the client's words; context; "done" from the client's side; constraints; deadline; deliverables; shot list | Asad reads |
| `setup/` | Script(s) that build the "before" state from the baseline, plus a one-line check that the symptom is present. Claude drafts; Asad runs and adjusts if the environment differs | Asad runs, off the clock |
| `questions.md` | Empty table for Asad's questions and the client's answers, with timestamps | Both |
| **Client fact sheet** | Held by Claude in the chat, not in the repo: theme, plugins, hosting, catalog size, what the client tried, what they would say if asked. Only what Asad asks gets revealed — that is what makes the "questions" slide honest | Claude only |

### 4.2 Brief template

```
# Brief — w03 · coupon-checkout-hang
Lane A · WooCommerce · Issued: Mon 28 Sep 2026 10:00 (Dhaka)   ← T0, the clock starts here
Client: a US marketing agency, for their client, a DTC skincare brand on WooCommerce
Practice build from a public job brief. Anonymised.

## The ask (in the client's words)
"Since a plugin update last week, checkout spins forever when someone applies a coupon
on mobile. Desktop seems fine. We're losing orders. Classic checkout, about 400 products."

## What we know
- Platform, theme, checkout type, catalog size
- What the client has already tried
- Access and hosting constraints (staging only; no plugin purchases)

## Done, from the client's side
- Coupons apply on mobile and desktop without the spinner
- A real test order completes with a coupon applied
- Nothing else on checkout changed; existing tracking still fires

## Constraints
- Deadline: Wed 30 Sep, end of day
- Budget: up to 6 hours
- No live site; no new paid plugins; nothing outside a child theme or plugin

## Deliverables
Staging link · walkthrough video (2 min) · handover note · rollback note · one thing to flag to the client

## Shot list
1 before (symptom + Lighthouse) · 2 plan + questions · 3 build · 4 QA run · 5 handoff

## Before you start
Reset to baseline, run setup/, confirm the symptom, record shot 1, then log "brief received".
Ask your questions in questions.md before planning. Nothing starts until the plan is approved.
```

### 4.3 Question, approval and acceptance protocol

1. Asad writes 2–3 questions in `questions.md` and posts them in the project chat. Claude answers as the client, from the fact sheet, in the same session. Both sides go into the file with timestamps.
2. Asad writes `plan.md` — tasks, hours, delivery date. Claude approves as the client, or pushes back once, as a real client sometimes does. The approval time is logged.
3. At handoff, Claude accepts or lists what is missing — once. A missing "before" clip, an empty QA line, or a handoff without a rollback note is not accepted.

---

## 5. Repo, folders, branches

One repo, `pervej-demos`. `main` only. One folder per demo, one short-lived branch per demo. Branches are named by demo ID, never by person — authorship is in the commits. Asad opens a PR; Yeasir reviews and merges; the branch is deleted; the merge commit is tagged with the ID. Two people never conflict, because they are never in the same folder.

```
pervej-demos/
  README.md
  _backlog/candidates.md          scored candidates waiting for a slot
  _templates/                     brief · questions · plan · log · qa · handoff · post
  _tools/
    wp/       baseline.sql.gz · reset.sh · break/  (reusable "make it broken" recipes)
    shopify/  push-unpublished.sh · publish.sh · cleanup.sh
  woocommerce/
    w03-coupon-checkout-hang/
      brief.md  questions.md  plan.md  log.md  qa.md  handoff.md
      src/        the deliverable — plugin or child theme
      setup/      builds the "before" state from the baseline
      db/         optional end-state dump, gzipped, 10 MB max
      post/       carousel.md · script.md · captions.md · timeline.md
  shopify/
    s02-cart-drawer-free-shipping/  same shape; src/ = the full theme
```

**Naming.** ID = platform letter + running number + slug: `w03-coupon-checkout-hang`, `s02-cart-drawer-free-shipping`. The same ID names the folder, the branch, the tag, the recording folder and every post file — the VA finds everything by ID.

**Git rules.** `main` is always mergeable · commit after every reviewed step, not once at the end · never commit videos, `node_modules`, uploads, secrets or `.env` · dumps over 10 MB go to the drive, not the repo · full theme copies per Shopify demo are fine (git stores identical files once, so thirty copies of Dawn cost about one).

---

## 6. Environments

### 6.1 WordPress

Two LocalWP sites per person:

- **`demo-fix`** — the weekly site. Reset to the golden baseline before every demo (`_tools/wp/reset.sh`: `wp db reset` → import `baseline.sql.gz` → `wp search-replace` → flush caches), then the demo's `setup/` builds the before state on top.
- **`demo-build`** — for full builds and anything that outlives a week.

**Golden baseline**, versioned and tagged in `_tools/wp/`: current WordPress and WooCommerce, a block theme, the WooCommerce sample products, a handful of test customers and orders, one admin user. Re-cut it after every WordPress or WooCommerce major release and put the versions in its filename.

**Setup scripts are the reusable asset.** Each demo's `setup/` plants its own problem; recipes worth keeping (Elementor bloat, a known plugin conflict, a slow theme) move to `_tools/wp/break/` for reuse. After ten demos this is a library of "make it broken" recipes, and no permanently broken site is ever needed. Setup always runs off the clock, before "brief received".

No separate installs per demo. No shared database with prefixes.

### 6.2 Shopify

- **Two Partner dev stores** for the weekly demos, one each. Both created under the Partner organisation with Asad as a staff member — never under a personal login — and team access checked after creation, so nothing walks away if the arrangement changes.
- **Each demo = a theme.** Duplicate Dawn or Horizon → `shopify theme push --unpublished` from the demo's `src/` → publish for the recording → unpublish and delete afterwards. The code lives in git; the store's theme library is capped.
- **`setup/` for Shopify** = the "before" theme (base theme plus the planted issue), pushed unpublished; shot 1 is recorded from its preview link.
- **Full store builds get a fresh dev store each**, since they need their own catalog, navigation and content. The organisation limit is 250 dev stores (shopify.dev); delete a store once its build is recorded and merged.
- **Staging link** = the theme preview link. Theme Check runs before every push.

---

## 7. The workflow, step by step

| Step | What | Log entry | Shot |
|---|---|---|---|
| 0 | Off the clock: branch from `main` → reset → run `setup/` → confirm the symptom → before-Lighthouse → commit | `setup complete (off the clock)` | 1 |
| 1 | Brief received; read it | `brief received` (T0) | — |
| 2 | Questions in `questions.md` → client answers | `questions sent` · `questions answered` | 2 |
| 3 | `plan.md` — tasks, hours, delivery date → client approval | `plan approved` | 2 |
| 4 | Build: spec in the task file → Claude Code builds → review the diff → commit. OBS running throughout | `first commit` · `staging ready` | 3 |
| 5 | QA per `qa.md` — the Playwright run is recorded | `QA passed` | 4 |
| 6 | `handoff.md` written; walkthrough recorded | `handoff sent` | 5 |
| 7 | PR opened; Yeasir reviews line by line and merges; tag with the ID | — | — |
| 8 | Raw footage and `shots.md` to the drive; Claude drafts `post/` from the real log | — | — |
| 9 | Reset the environment; optional `db/` dump | — | — |

**The QA sheet is the delivery checklist, unchanged:** functional pass on the scoped items including edge cases · full purchase flow with a test order · 360 / 390 / 768 px plus one real device · Chrome, Safari, Firefox, iOS Safari · Theme Check / PHPCS clean · no hardcoded user-facing strings · no console errors, no PHP notices · Lighthouse before and after, no regression · cart and checkout scripts still fire · rollback path confirmed · walkthrough recorded. A known defect is not a pass.

**The handoff note, in the shape an agency would receive:** what changed · staging link · walkthrough link · how to roll back · *what I'd flag to the client* — one insight the agency can take upstairs and look good with.

---

## 8. Recording and content

### 8.1 Shot list

| # | Shot | Captured by |
|---|---|---|
| 1 | The problem as it stands — symptom on screen, before-Lighthouse | Playwright `recordVideo` or OBS, **before anything is touched** |
| 2 | Plan and questions — the plan file, the Q&A | OBS |
| 3 | The build — staging site, commits, the hardest part solved | OBS, continuous; cut later |
| 4 | QA — the test run, the test order, after-Lighthouse | Playwright `recordVideo` |
| 5 | Handoff — the note, the staging link, the rollback line | OBS |

**Mechanics.** 1080p, screen plus mic where narration helps, no face. Leave OBS running for the whole session and cut later — starting and stopping at the right moment is the thing that goes wrong. Playwright records its own browser sessions, so shots 1 and 4 come out as clips with nobody pressing record. The Claude Code terminal stays out of frame (§1.1). The planting in `setup/` is never recorded. Asad does not need to judge "when to record": the shot list is a checklist, and the client does not accept a fix until the before-clip exists.

### 8.2 Files

Shared drive, mirroring the repo: `recordings/<platform>/<id>/raw/` (`w03-shot1-before.mp4`, `w03-shot3-build.mp4` …) and `/final/`. Asad adds `shots.md` listing each file and what it shows. The drive path goes into `log.md`.

### 8.3 Cuts and posts

| Output | Length | Where | Made by |
|---|---|---|---|
| **Walkthrough** — problem → plan → workflow → result | 3–5 min | YouTube as host only (unlisted or channel); embedded on pervej.com; linked in DMs | VA edits · Yeasir voices from Claude's script |
| **Thursday native video** | 60–90 s cut of the same recording | LinkedIn | VA · captions on |
| **Tuesday carousel** | 9–10 slides: cover · brief · questions · plan · timeline · build · QA · handoff · flag + CTA | LinkedIn document post | Claude drafts from the log · Yeasir approves |
| **Timeline image** | One graphic | LinkedIn, alternative Thursday post | VA |

Every output carries the practice-build label. Default cadence: build in week N, publish in week N+1.

---

## 9. Full builds — same track

A store from scratch, or a redesign of an old site, is a demo like any other: same brief, same questions, same log, same shots, same handoff. What differs:

- **Environment:** `demo-build` (WordPress) or a fresh dev store (Shopify); it outlives the weekly reset.
- **Scope in the brief:** home page in two or three directions (the way an agency presents options to a client), shop page, single product, cart and checkout, one or two content pages. Heavier work on the shop or product page when the brief calls for it.
- **Content and images:** supplied by the client — Claude generates the copy and a product CSV; images come from free-licence sources or the WooCommerce sample set. Nothing lifted from a real store.
- **Redesigns:** `setup/` builds a deliberately dated old site as the "before".
- **Duration:** two to three weeks part-time, run alongside the weekly fix so the feed stays fed; post in stages, one section or page per post, same format.

---

## 10. Weekly rhythm

| Day | Asad | Everyone else |
|---|---|---|
| Mon | Setup off the clock · brief received · questions · plan · start | Claude answers as the client and approves the plan |
| Tue | Build | Last week's carousel goes out |
| Wed | Build → staging ready → QA | — |
| Thu | Handoff · walkthrough · PR · raw footage to the drive | Yeasir reviews the PR · last week's video goes out |
| Fri | Reset · score next week's candidates with Claude · demo store or kit work | VA edits this week's cuts |

Capacity: one build a week; the content adds 2–3 hours. When the week is short, the order is: reply to conversations → Thursday video → Tuesday carousel → everything else.

---

## 11. Definition of done

A demo is done when all of these are true: `brief.md`, `questions.md`, `plan.md`, `log.md` (real timestamps, setup marked off the clock), `qa.md` (every line passed) and `handoff.md` complete · PR merged and tagged · raw footage and `shots.md` on the drive · `post/` drafted · the environment reset. Missing any one: not done.

---

## 12. Templates

**`questions.md`**

| # | Question | Asked | Answer | Answered |
|---|---|---|---|---|

**`plan.md`** — tasks · hours per task · total · delivery date · risks · out of scope · approved at

**`log.md`**

| Event | Time (Dhaka) |
|---|---|
| Setup complete (off the clock) | |
| Brief received | |
| Questions sent | |
| Questions answered | |
| Plan approved | |
| First commit | |
| Staging ready | |
| QA passed | |
| Handoff sent | |

Recordings: `<drive path>`

**`qa.md`** — the §7 checklist as a table: item · result · evidence (screenshot or clip)

**`handoff.md`** — what changed · staging link · walkthrough · rollback · what I'd flag to the client · warranty line

**`_backlog/candidates.md`**

| Date | Post (paraphrased) | Platform | Lane | G1–G5 | S1–S6 | Total | Decision |
|---|---|---|---|---|---|---|---|

---

## 13. Changelog

- **v1.0 — 28 Sep 2026.** First version: rules; roles; selection gates, scoring and lane rotation; the client-brief package and Q&A protocol; repo, folder and branch model; WordPress and Shopify environments; the nine-step workflow; shot list, files, cuts and posts; full builds on the same track; weekly rhythm; definition of done; templates.
