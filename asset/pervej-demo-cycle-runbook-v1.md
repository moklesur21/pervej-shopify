# Pervej.com — Demo Cycle Runbook: feed file → published proof

**v1.1 · Wed 30 Sep 2026 · Owner: Yeasir Pervej**
Reads with: `pervej-demo-project-plan-v1.md` (rules, scoring, QA — the source of truth) · `white-label-dev-strategy.md` v1.3
**Shareable with:** Asad and the VA. No pricing, pipeline or Upwork data in this file.

One question, answered simply: **you hand Claude (project chat) an `upwork-feed.md` — what happens next, until the demo is published.**

---

## 1. The one rule

**Upwork stops at Claude-in-chat.** The feed, screenshots, links and full job posts live only in this chat. Claude Code never sees any of it — it receives exactly one thing: the finished project brief, already anonymised, in our own format. Nothing to scrub downstream, because nothing crosses.

---

## 2. The flow

| # | Who | What |
|---|---|---|
| 1 | **You** | Send `upwork-feed.md` (or screenshots) here |
| 2 | **Claude** | Returns a **numbered shortlist** — one line per post: platform · lane · the problem. Only posts that pass the demo plan's gates make the list |
| 3 | **You** | Reply with the numbers to keep |
| 4 | **Claude** | Returns the **picks file with Upwork links** so you can open the full posts. *This file stays in chat — never committed anywhere* |
| 5 | **You** | For one pick: paste the full job post + any attached assets |
| 6 | **Claude** | Returns **one project brief file** (format in §3) |
| 7 | **You / Asad** | Feed the brief to Claude Code → build, QA, commit, merge — per the demo plan |
| 8 | **You** | Send the log + footage notes back here → Claude drafts the posts (carousel, video script, captions) |
| 9 | — | Next pick → back to step 5 |

---

## 3. The project brief — one file, three sections

Named by demo ID: `w04-shipping-logic.md`, `s02-cart-drawer.md`. This is the only input Claude Code gets.

**1. Client brief** *(written as the client)*
Who the client is (anonymised) · the issue in their own words · what they expect · what "done" looks like · deadline. Carries the label: *Practice build from a public job brief. Anonymised.*

**2. Mini approach**
4–6 bullets — the path to the fix. No code, no detailed steps; Claude Code plans the rest itself.

**3. Shoot list**
The 4–5 moments to capture: the problem as it stands (before) · the plan · the hardest part solved · QA passing · the handoff.

---

## 4. Where things live

| Stays in this chat, forever | Goes to the repo |
|---|---|
| `upwork-feed.md` · screenshots · shortlist · picks file with links · full job posts | The project brief · the build · `log.md` · `qa.md` · handoff · `post/` |

---

## 5. Mid-build questions

CLAUDE.md rule in the demos repo: *"Claude Code never invents client answers."* If a real ambiguity comes up mid-build, the question comes back to this chat; Claude answers **as the client**; the exchange goes into the brief file with timestamps. That Q&A is proof content — it shows how questions get asked before assumptions get made.

---

## 6. Rules that still bind (from the demo plan — read it once)

- Every public output carries the practice-build label. Never "client", never "case study".
- Real timestamps only; environment setup happens off the clock and says so.
- Local sites and dev stores only. Never live, nothing from the day job, nothing under NDA.
- Claude Code output is reviewed line by line; Yeasir always merges.
- The QA checklist passes in full — a known defect is not a pass.

---

## 7. Done =

Brief file · build merged and tagged · `log.md` with real timestamps · QA passed · footage on the drive · posts drafted and approved. **Missing any one: not done.**

---

## 8. Changelog

- **v1.1 — 30 Sep 2026.** Simplified to the agreed flow: numbered shortlist → picks file with links (chat-only) → one brief file per project (client brief · mini approach · shoot list) → straight to Claude Code. Dropped the six-message protocol, the seat tables and the day-by-day sequence; the demo plan keeps the detailed rules.
- **v1.0 — 30 Sep 2026.** First version.
