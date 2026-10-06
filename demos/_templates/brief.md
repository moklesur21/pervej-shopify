# Brief — <id> · <slug>

Lane <A|B|C> · Shopify · Issued: <Day DD Mon YYYY HH:MM (Dhaka)> — the clock starts at `Brief received` in `log.md`, after setup and the before clips
Client: <a US marketing agency, for their client, a DTC skincare brand on Shopify>
Practice build from a public job brief. Anonymised.

Written in the project chat (runbook §3); it waits in `demos/_briefs/<id>.md` on `main` and is moved (`git mv`, never copied) to `demos/<id>/brief.md` when the demo starts. This file is the only input Claude Code gets. No store name, URL, brand, product line, poster name or verbatim job-post text anywhere in it.

## 1. Client brief

**The issue, in the client's words**

"<paraphrased, anonymised>"

**What we know**

- Theme (Dawn, Horizon or Dawn-shaped; version if known), plan (the checkout and B2B answers depend on it), customer accounts (classic or new), apps involved, catalogue size
- What the client has already tried
- Access and constraints (duplicate theme only, never live; no new apps; collaborator access)

**What they expect / done, from the client's side**

- <symptom gone / feature works, in the client's terms>
- A test order completes
- Nothing else changed; existing tracking still fires

**Deadline and constraints**

- Deadline: <date> · Budget: up to <n> hours
- Duplicate theme only, never the live one; no new paid apps; nothing outside the theme unless the brief says so
- Deliverables: preview link · walkthrough video (2 min) · handover note · rollback note · one thing to flag to the client

## 2. Mini approach

4–6 bullets — the path to the fix. No code, no detailed steps; Claude Code plans the rest (including `setup/`) itself.

-
-
-
-

## 3. Shoot list

The capture script (`capture/`) is written from this list and the video is cut from what it records (video guideline §4–§5). Name steps a script can drive.

**View:** <desktop, 1280 px, framed on the part of the page that matters — the default · or phone, 390 px, only because the problem is a mobile one> — <the reason, from the brief>

1. Before — the symptom, as steps: <page → action → what goes wrong>. Recorded on the before theme's preview, before anything is changed. Scene 1.
2. After — the same steps on the after theme's preview, working, same framing. Scene 4.
3. QA — the test order on desktop · the scoped items at 360, 390 and 768 px · after-Lighthouse. Scene 5.
4. Slides, not recorded — the brief and any Q&A (scenes 2–3), the plan and delivery date from `spec.md` (scene 3), the timeline from `log.md` and the handoff from `handoff.md` (scene 6), what I'd flag (scene 7).

## Before you start

Baseline theme committed; write and commit the planted before state off the clock (`setup/`); push it as the `before` theme; confirm the symptom on its preview link; have Claude Code write `capture/` and record the before clips and before-Lighthouse; log "setup complete (off the clock)" and "before clips recorded (off the clock)"; then log "brief received". Write `spec.md` from §2 before the first plan-mode session.

## Q&A

Filled only when a real ambiguity goes back to the project chat. Claude Code never invents a client answer. Timestamps in Dhaka time; the answer lands here before `spec.md` changes.

| # | Question | Asked | Answer | Answered |
|---|---|---|---|---|
| | | | | |
