# Pervej.com — Demo-Project Plan

**v1.2 · Wed 7 Oct 2026 · Owner: Yeasir Pervej**
Reads with: `white-label-dev-strategy.md` v1.3 · `pervej-proof-content-ad-strategy-v1.md` · `content-engine-playbook.md` · `pervej-demo-cycle-runbook-v1.md` v1.1 (what the project chat does and what the repo receives) · `pervej-demo-video-guideline-v1.2.md` (the video and its post copy — it takes precedence there) · the W / T / AW tutorial catalogs
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
| **Yeasir** | Supplies the week's job list (screenshots or pasted text) · picks from the shortlist · approves the brief · reviews every PR line by line and merges · final QA pass · gives the two video approvals (the words, then the cut) · approves all copy · holds every prospect conversation | Lets a demo through without the review |
| **Claude** (the project chat) | Scores candidates against §3 · writes the brief · **plays the client**: answers questions, approves the plan, accepts or rejects the delivery · drafts the Tuesday carousel from the real log | Skips a gate · reveals client facts Asad didn't ask for · accepts a delivery with a missing artefact |
| **Claude Code** (the repo) | Plans `setup/`, the spec and the build from `brief.md` · captures the before, after and QA clips · writes every log time from the system clock · after handoff drafts the video script and post copy, makes the voice, renders the video and runs the self-check | Invents a client answer · sees Upwork material · voices or renders words that are not approved |
| **Asad** | Runs setup and has the before clips captured · asks questions · plans and estimates · builds in Claude Code and reviews the diff · runs QA · writes the handoff · opens the PR · resets the environment | Touches Upwork · frames a demo as client work · merges to `main` |
| **VA** | Files the finished video by ID · publishes on the schedule | Holds a conversation · changes copy without approval |

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

For the picked job, Claude writes one brief file (runbook §3). It waits in `demos/_briefs/<id>.md` on `main` and is moved to `demos/<id>/brief.md` when the demo starts. Around it:

| File | What | Who |
|---|---|---|
| `brief.md` | The client's ask, anonymised and in the client's words; context; "done" from the client's side; constraints; deadline; deliverables; mini approach; shoot list | Claude writes · Asad reads |
| `setup/` | Script(s) that build the "before" state on the baseline, plus a one-line check that the symptom is present | Claude Code writes from the brief · Asad runs, off the clock |
| `## Q&A` in `brief.md` | Asad's questions and the client's answers, with timestamps — only when a real ambiguity goes back to the chat | Both |
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
Staging link · handover note · rollback note · one thing to flag to the client

## Mini approach
4–6 bullets — the path to the fix, no code

## Shoot list
1 before (symptom + Lighthouse) · 2 plan + questions · 3 build · 4 QA run · 5 handoff

## Before you start
Reset to baseline, run setup/, confirm the symptom, capture the before clips, then log "brief received".
A real ambiguity goes to the chat; the answer lands in ## Q&A. Nothing starts until the plan is approved.

## Q&A
| # | Question | Asked | Answer | Answered |
```

The full template, with the field notes, is `demos/_templates/brief.md` in the repo.

### 4.3 Question, approval and acceptance protocol

1. When a real ambiguity comes up, Asad puts 2–3 questions to the project chat. Claude answers as the client, from the fact sheet, in the same session. Both sides go into `brief.md` `## Q&A` with timestamps, before `spec.md` changes.
2. Asad writes `spec.md` — scope, testable done-means, tasks, hours, delivery date. Claude approves as the client, or pushes back once, as a real client sometimes does. The approval goes into `## Q&A` with its time.
3. At handoff, Claude accepts or lists what is missing — once. A missing "before" clip, an empty QA line, or a handoff without a rollback note is not accepted. A walkthrough video is not a deliverable and is never counted as missing, including in briefs written before 7 Oct 2026 that still list one. The client never asks for a live URL, a real device or another browser (§7).

---

## 5. Repo, folders, branches

Two repos with the same shape: `pervej-woo` (WooCommerce — its root is the local WordPress site) and `pervej-shopify`. `main` is shared truth. One folder per demo, one short-lived branch per demo. Branches are named by demo ID, never by person — authorship is in the commits. Asad opens a PR; Yeasir reviews and merges; the branch is deleted; the merge commit is tagged with the ID. Two people never conflict, because they are never in the same folder. Shared files (rules, docs, tooling, templates) change only on a small `chore/` branch. Each repo's `CLAUDE.md` and `docs/workflow.md` hold the detail.

```
pervej-woo/                       the WordPress site; only authored code is tracked
  demos/
    _briefs/<id>.md               briefs from the project chat, waiting for their slot
    _backlog/candidates.md        scored candidates waiting for a slot
    _templates/                   brief · spec · log · qa · handoff
    w03-coupon-checkout-hang/
      brief.md  spec.md  log.md  qa.md  handoff.md
      setup/      builds the "before" state on the baseline
      capture/    the capture scripts: before, after, QA
      post/       script.md · copy.md · check.md · carousel.md
      media/      clips, voice and the finished video — never in git; copied to the drive
      db/         optional end-state dump, gzipped, 10 MB max
  wp-content/plugins/pervej-w03-coupon-checkout-hang/   the deliverable (a child theme: themes/pervej-<id>/)
  tools/wp/       baseline.sh — the golden baseline · seed-store.php
  tools/video/    capture, voice, render and the self-check (video guideline §11)
```

`pervej-shopify` keeps the same `demos/<id>/` shape for Shopify. A demo's deliverable is its theme: a full copy of the base theme in `shopify-dev/<id>/theme/`, committed untouched first, then the planted before state, then the build (with `app/`, `pixel/` and the like only when the brief needs them). There is no local Shopify: `tools/shopify/theme.sh` moves the theme between the repo and each person's own dev store, and `media/themes.json` records the before and after themes there.

**Naming.** ID = platform letter + running number + slug: `w03-coupon-checkout-hang`, `s02-cart-drawer-free-shipping`. The same ID names the folder, the branch, the tag, the recording folder and every post file — the VA finds everything by ID.

**Git rules.** `main` is always mergeable · commit after every reviewed step, not once at the end · never commit videos, `node_modules`, uploads, secrets or `.env` · dumps over 10 MB go to the drive, not the repo · full theme copies per Shopify demo are fine (git stores identical files once, so thirty copies of Dawn cost about one).

---

## 6. Environments

### 6.1 WordPress

One local site per person, at the repo root: MAMP on macOS, XAMPP (or Local) on Windows, at `http://localhost/pervej-woo`. Before every demo, `tools/wp/baseline.sh --reset` rebuilds the golden baseline, then the demo's `setup/` builds the before state on top. Full builds use the same site; their `setup/` builds the starting state.

**Golden baseline**, built by script from the repo, never shared as a dump: current WordPress and WooCommerce, a block theme, a seeded catalog (simple, variable, sale, out of stock, backorder, virtual), a coupon, test customers and orders, Cash on delivery, HPOS on, Query Monitor and Email Log. Each person's database is local. When WordPress or WooCommerce ships a major release, the script is updated on a `chore/` branch.

**Setup scripts are the reusable asset.** Each demo's `setup/` plants its own problem; recipes worth keeping (Elementor bloat, a known plugin conflict, a slow theme) move into the shared tooling for reuse. After ten demos this is a library of "make it broken" recipes, and no permanently broken site is ever needed. Setup always runs off the clock, before "brief received".

No separate installs per demo. No shared database with prefixes.

### 6.2 Shopify

- **Two Partner dev stores** for the weekly demos, one each. Both created under the Partner organisation with Asad as a staff member — never under a personal login — and team access checked after creation, so nothing walks away if the arrangement changes.
- **Shopify work happens on the dev store.** A WooCommerce demo runs entirely on localhost; Shopify has no local store. Every Shopify demo is built, captured and checked on the person's own development store, reached over the internet behind its storefront password. Where this plan says "local" for Shopify, it means nothing beyond your own machine and your own dev store.
- **Each demo = two unpublished themes.** `tools/shopify/theme.sh new <id>` copies the untouched base theme (Horizon for a new build, Dawn when the brief's store runs it) into `shopify-dev/<id>/theme/`. The build runs on `theme.sh dev` (a private development theme on the store); `theme.sh push <id> before|after` pushes the planted and the finished state as unpublished themes. Capture and QA record them through their preview, past the storefront password, with the preview bar hidden. Nothing is ever published and the live theme is never touched; `theme.sh clean <id>` deletes the demo's themes after the merge. The code lives in git; the store's theme library is capped.
- **`setup/` for Shopify** = `setup/README.md`: what the theme's setup commit plants, any store data it needs and how to undo it, and a one-line check that the symptom is present. The before theme is pushed unpublished, and shot 1 is recorded on its preview.
- **Full store builds get a fresh dev store each**, since they need their own catalog, navigation and content. The organisation limit is 250 dev stores (shopify.dev); delete a store once its build is recorded and merged.
- **Staging link** in the handoff reads *"Practice build on a Shopify development store; not publicly available."* — no link: dev stores sit behind a password. Theme Check runs before every push.

---

## 7. The workflow, step by step

| Step | What | Log entry | Captured |
|---|---|---|---|
| 0 | Off the clock: branch from `main` → reset → run `setup/` → confirm the symptom → before clips and before-Lighthouse → commit | `setup complete (off the clock)` · `before clips recorded (off the clock)` | before clips |
| 1 | Brief received; read it | `brief received` (T0) | — |
| 2 | Questions to the project chat, only for a real ambiguity → answers in `brief.md` `## Q&A` | `questions answered` | — |
| 3 | `spec.md` — scope, done-means, tasks, hours, delivery date → client approval | — | — |
| 4 | Build: one stage per ask, the spec pasted → Claude Code builds → review the diff → commit | `first commit` · `staging ready` | — |
| 5 | After clips (the same capture script) and the QA run → QA per `qa.md` | `QA passed` | after clips · QA run |
| 6 | `handoff.md` written and sent | `handoff sent` | — |
| 7 | PR opened; the other person reviews line by line | — | — |
| 8 | The video package on the branch: script and copy (Approval 1), voice and render (Approval 2); `media/` to the drive (video guideline) | — | the video |
| 9 | Yeasir merges and tags with the ID; the environment is reset; optional `db/` dump | — | — |

For Shopify, step 0's reset is the base theme committed untouched, `setup/` ends with the planted theme pushed as the before theme, and step 9's reset is `theme.sh clean` plus undoing the store data `setup/` lists.

**The QA sheet is the delivery checklist:** functional pass on the scoped items including edge cases · full purchase flow with a test order, its emails checked in Email Log (Shopify: not checked — Shopify sends them and the theme never touches them; a scope that changes what an email shows is checked as a scoped item, under View email in the order's timeline; test orders use an `@example.com` address) · 360 / 390 / 768 px, emulated · Chrome · Theme Check / PHPCS clean · no hardcoded user-facing strings · no console errors, no PHP notices (Shopify: no `Liquid error`) · Lighthouse before and after, no regression · cart and checkout scripts still fire · rollback path confirmed. A known defect is not a pass.

**Checked where they run (since 7 Oct 2026).** Practice builds are checked where they run — the local site, or for Shopify the demo's unpublished themes on the person's own development store — never on a public site, and nothing extra is installed to check them: emails in Email Log (Shopify: not checked unless the scope changes one), phone widths emulated, Chrome only. Lighthouse numbers say where they were measured ("local site", or "dev store preview"). No live URL, tunnel, real device or other browser is asked for, and none is claimed in `qa.md`, the video or the post.

**The handoff note, in the shape an agency would receive:** what changed · staging link, which for a practice build reads *"Practice build, runs locally; not publicly hosted."* (Shopify: *"Practice build on a Shopify development store; not publicly available."*) · how to roll back · *what I'd flag to the client* — one insight the agency can take upstairs and look good with.

---

## 8. Recording and content

### 8.1 Shoot list

Nothing is recorded by hand: no OBS, no screen recorder, no microphone. Claude Code writes the capture scripts from the brief's shoot list, and the rest becomes slides drawn from the demo's files (video guideline §4–§5).

| # | Shot | How |
|---|---|---|
| 1 | The problem as it stands — the before clip, before-Lighthouse | `capture/` script, **before anything is touched** |
| 2 | The brief, the questions and the plan | slides from `brief.md`, its Q&A and `spec.md` |
| 3 | The hardest part solved — the after clip | the same capture script, on the finished site: same steps, same framing |
| 4 | QA — the test order, the phone widths, after-Lighthouse | the QA capture script |
| 5 | Handoff — the timeline and what the agency receives | slides from `log.md` and `handoff.md` |

**Mechanics.** The capture records only the page, sharp and framed, so nothing of the tooling is ever in frame (§1.1). The planting in `setup/` is never recorded. Nobody judges "when to record": the shoot list is a checklist, and the client does not accept a fix until the before clip exists. The voice is Yeasir's, made from the approved script (video guideline §10).

### 8.2 Files

Each demo's `media/` folder — clips, Lighthouse reports, the voice, the finished video, cover and copy — is copied to the shared drive as `recordings/<platform>/<id>/`. The file names say what each file is. The drive path goes into `log.md`.

### 8.3 Cuts and posts

**One video per demo (since 7 Oct 2026).** There is no separate handoff walkthrough. The square LinkedIn video tells the whole story.

| Output | Length | Where | Made by |
|---|---|---|---|
| **The demo video** — the problem before · the brief · the questions and plan · the fix with before/after · QA · the timeline · the flag | 60–90 s, square | LinkedIn, native, Thursday | Claude Code, after handoff, from the demo's files (video guideline) · in Yeasir's voice |
| **Tuesday carousel** | 9–10 slides: cover · brief · questions · plan · timeline · build · QA · handoff · flag + CTA | LinkedIn document post | Claude drafts from the log · Yeasir approves |
| **Timeline image** | One graphic | LinkedIn, alternative Thursday post | the render, from the video's timeline scene |

Every output carries the practice-build label. Default cadence: build in week N, publish in week N+1.

---

## 9. Full builds — same track

A store from scratch, or a redesign of an old site, is a demo like any other: same brief, same questions, same log, same shots, same handoff. What differs:

- **Environment:** the same local site, not reset until the build is merged (WordPress), or a fresh dev store (Shopify).
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
| Thu | Handoff · PR | Yeasir reviews the PR · last week's video goes out |
| Fri | Score next week's candidates with Claude · demo store or kit work · reset after the merge | Claude Code: this week's video package — Yeasir's two approvals; `media/` to the drive |

Capacity: one build a week; the content adds 2–3 hours. When the week is short, the order is: reply to conversations → Thursday video → Tuesday carousel → everything else.

---

## 11. Definition of done

A demo is done when all of these are true: `brief.md` (with any Q&A), `spec.md`, `log.md` (real timestamps, setup and before clips marked off the clock), `qa.md` (every line passed) and `handoff.md` complete · `capture/` committed · `post/` script and copy approved, the voice made, `check.md` every row passed with both approvals · `media/` on the drive · PR merged and tagged · the environment reset. Missing any one: not done. The video is done when the post is live and its URL is in `log.md`.

---

## 12. Templates

The working templates are `demos/_templates/` in the repo; in short:

**`brief.md`** — §4.2, ending in the `## Q&A` table:

| # | Question | Asked | Answer | Answered |
|---|---|---|---|---|

**`spec.md`** — why · in scope · out of scope · testable done-means · touchpoints · risks · the agreed plan: tasks, hours per task, total, delivery date

**`log.md`**

| Event | Time (Dhaka) |
|---|---|
| Setup complete (off the clock) | |
| Before clips recorded (off the clock) | |
| Brief received | |
| Questions answered (only if a question went to the chat) | |
| First commit | |
| Staging ready | |
| QA passed | |
| Handoff sent | |
| Published — the post URL (the Thursday after) | |

Recordings: `<drive path>`

**`qa.md`** — the §7 checklist as a table: item · result · evidence (screenshot or clip)

**`handoff.md`** — what changed · staging link (the practice-build line, §7) · rollback · what I'd flag to the client · warranty line

**`_backlog/candidates.md`**

| Date | Post (paraphrased) | Platform | Lane | G1–G5 | S1–S6 | Total | Decision |
|---|---|---|---|---|---|---|---|

---

## 13. Changelog

- **v1.2 — 7 Oct 2026.** The plan now describes the repo and the video as they are built: the video guideline v1.2 §13 amendments folded in — Claude Code captures, voices and renders; no OBS, `shots.md` or `captions.md`; the VA files and publishes (§2, §5, §7, §8, §10, §11) — and the runbook v1.1 model: one brief file with its Q&A, `spec.md` for the plan, `pervej-woo` / `pervej-shopify` with `demos/<id>/`, one local site rebuilt by `tools/wp/baseline.sh` (§4, §5, §6.1, §9, §12). Shopify's staging line: "Practice build on a Shopify development store; not publicly available."; Shopify emails are checked in the order's timeline (§6.2, §7). The same day, Shopify as `pervej-shopify` builds it (§5, §6.2, §7): Shopify work happens on each person's own dev store, not locally; the theme lives in `shopify-dev/<id>/theme/`; each demo is two unpublished themes recorded through their preview and never published; `setup/` is a README; Shopify order emails are not checked (owner decision): Shopify sends them and the theme never touches them, so only a scope that changes one checks it, under View email in the order's timeline; test orders use an `@example.com` address.
- **v1.1 — 7 Oct 2026** (the project chat). One video per demo: the separate 2–3 minute handoff walkthrough is dropped from the deliverables (§4.2, §7, §8.3, §10, §12). The square LinkedIn video, made after handoff from the demo's files and narrated by Yeasir, tells the whole story. A missing walkthrough is never counted at acceptance, including in briefs that still list one (§4.3). Practice builds are checked locally: the staging link reads "Practice build, runs locally; not publicly hosted.", emails are checked in Email Log, phone widths are emulated, Chrome only (§6.2, §7).
- **v1.0 — 28 Sep 2026.** First version: rules; roles; selection gates, scoring and lane rotation; the client-brief package and Q&A protocol; repo, folder and branch model; WordPress and Shopify environments; the nine-step workflow; shot list, files, cuts and posts; full builds on the same track; weekly rhythm; definition of done; templates.
