---
name: demo
description: Run one practice demo in this session, from a queued brief in demos/_briefs/ to the finished theme work and its three LinkedIn posts (the voiced video, the carousel PDF, the insight image), self-checked and audited, on its own local branch and the person's own dev store. Use when asked to "work on <brief>", "run <id>", "start <id>" or /demo <id>.
argument-hint: <brief file name or demo id, e.g. s03-click-to-order-journey>
---

# The demo run — the brief to three posts, in one go (Shopify)

You are running one demo end to end, the way `asset/pervej-demo-video-guideline-v1.4.md` §3 describes it: Yeasir (or Asad) hands over the brief with one line, and the next thing anyone sees is a finished, audited package waiting for Yeasir's go. Everything below happens in this session, on this machine and the person's own demo dev store, without stopping — except for the reasons under **Ask only when blocked**. It is the twin of pervej-woo's run, translated: no local store, a base theme committed untouched, before and after as unpublished themes behind the storefront password.

Read before step 1, in this order: `CLAUDE.md` (the hard rules — all of them stay on), `asset/pervej-demo-video-guideline-v1.4.md` (the three posts, §3, §4–§8), `tools/video/README.md` and `tools/shopify/README.md` (the toolkits and every file format), `docs/house-rules.md` §17 (the six-stage method). The brief is `$ARGUMENTS` — a file name in `demos/_briefs/` or a demo ID; the ID is the file name without `.md`.

## Never, during the run

- Never touch a live store. On the person's own dev store, push only with `theme.sh push <id> before|after` (always `--strict --nodelete`, never `--allow-live`). If the demo needs a published theme — customer events, pixels and some extensions run only there — publish the demo's own theme with `theme.sh publish <id> after` (it records the theme that was live), record the decision, and `theme.sh restore <id>` before anything else touches that theme; `push` refuses a live theme, so a later change is restore → push → publish.
- Never push to git, merge, rebase, or commit to `main` or any branch but the demo's. The run ends on the local demo branch; Yeasir or Asad pushes and opens the PR.
- Never edit shared files on the demo branch: `CLAUDE.md`, `docs/`, `tools/`, `demos/_templates/`, `demos/_briefs/`, `.claude/`, `.gitignore`, `.mcp.json`. A needed shared change goes in the final message as a proposal.
- Never type the storefront password or an admin sign-in, anywhere — in the built-in browser too. The toolkit reads the storefront password from `tools/shopify/.env.local`; the admin is a person's.
- Never enter a card number, not even the test gateway's: the test checkout is a person's step (step 7).
- Never open `demos/_briefs/notes/`, anything marked internal, or a file the brief says not to open.
- Never write a time from memory: every `log.md` time comes from `node tools/video/now.mjs` at the moment it happens.
- Never present a decision as a client answer, and never call anything "approved" or "accepted" that wasn't.
- Never read, print or store the ElevenLabs key or any store token.
- Never stage with `git add -A` or `git add .` at the repo root: stage the demo's own paths only (`demos/<id>/`, `shopify-dev/<id>/`).
- Every uncommon Liquid object or filter, schema attribute, GraphQL field, CLI flag or plan gate is checked with the Shopify dev MCP before use, never from memory.
- AI stays off screen and out of every client-facing file; the password page, the preview bar and the admin never appear in a capture (guideline §2).

Inside the run, the demo's own state changes — `theme.sh new`, commits on the demo branch, `theme.sh push <id> before|after`, the setup's store data, captures, voice and renders — run without asking. That is the drill's exception to ask-first (`docs/house-rules.md` §0); nothing outside the demo is touched.

## Ask only when blocked (guideline §3)

Stop for one of these and nothing else:

1. **A real ambiguity in the brief that changes what gets built** — a fork the brief, its mini approach and the client's done-list don't settle.
2. **Something the run can't do on its own:** the Shopify CLI asks to log in, a store token or app credential is needed, a missing asset, a tool that won't install, `main` behind `origin/main`, a brief that needs a live store (never done: propose the replacement instead) — and **the person's steps at QA** (step 7).
3. **An audit that still fails after two rounds of fixes** (step 11).
4. **Marketplace material in the brief** — a job post, a feed, a poster's name, a marketplace link (`CLAUDE.md`): stop and say so; never use it.

When you stop: first do everything that doesn't depend on the answer (the base theme, the setup and the before clips are always independent of a client question). Then ask **one** message: what you need, why, and what happens next. A question for the client goes to the project chat through Yeasir; when the answer comes back, append it to `brief.md` `## Q&A` with both times, commit `<sid>: client answer`, log `Questions answered`, amend `spec.md` if scope moved, and carry on.

Everything else you **decide**: write the decision and its reason down — build decisions in `spec.md` `## Decisions made without asking`, post decisions in `post/check.md` `## Decisions` — list the ones the client should confirm in `handoff.md`, and move on. A brief step that waits on the client's approval — a plan approval, an acceptance — is not waited for (guideline §13): follow the brief's own done-list, write the decision down, log what actually happened. A brief line that breaks a house rule (a live store, a tunnel, edit Horizon's own files) loses to the house rule: record the replacement as a decision and flag it in the handoff. A brief that asks for a new build on Dawn: Horizon is the default (strategy v1.4) unless the brief says the client's store already runs Dawn — record which and why. Over the brief's hours: cut nothing; the real times show it and the handoff says so. AI is named when it is the brief's own subject (an AI-assisted build to audit, an AI feature to build), never as how the work was done. A demo that also needs WooCommerce runs it on localhost (pervej-woo's run); a Shopify→Woo event is replayed or polled, never tunnelled.

## The clock

Every `log.md` time is read from the system clock at the moment of the event, in Dhaka time:

```bash
node tools/video/now.mjs
```

Write the output as is (`Fri 9 Oct 10:42`) into the event's row. A missed time comes from a commit or a file's own timestamp, or stays blank. The events, in order: `Setup complete (off the clock)` · `Before clips recorded (off the clock)` · `Brief received` (T0) · `Questions answered` (only if one went to the chat) · `Plan written` · `First commit` · `Staging ready` · `QA passed` · `Handoff written` (the clock stops) · `Post package rendered` · `Audit passed`.

`<sid>` below is the short ID used in commit messages: `s03` for `s03-click-to-order-journey`.

## The run

### 0. Preflight

- `git fetch --quiet`, then `git status -sb`. On `main`, no changes to tracked files, `main` not behind `origin/main`. If branch `<id>` already exists, **resume** instead: `git switch <id>`, read `demos/<id>/log.md`, `spec.md`, `post/check.md` and `git log main..HEAD`, and continue from the first step not done. Never re-log an event that has a time.
- `demos/_briefs/<id>.md` exists. `demos/_briefs/notes/` does not exist (if it does, stop: private files are in the working tree).
- Read the brief once, whole. Scan it for marketplace names, links and poster names (stop reason 4). Note anything that is a stop reason 1 — but don't stop yet. The whole ID is unique, the number alone may not be: if another brief in `demos/_briefs/`, a folder in `demos/` or a tag uses the same number, `<sid>` below is the full ID (`theme.sh diff` finds either form).
- `tools/shopify/theme.sh doctor` and `npm --prefix tools/video run doctor`: every line `[ok]` — the store answers, the storefront password is accepted, the CLI is logged in. A CLI that wants a login is stop reason 2, now. A missing ElevenLabs key becomes a stop at step 10, after everything that doesn't need it.

### 1. Branch, brief and base theme (off the clock)

```bash
git switch -c <id>
mkdir -p demos/<id> && git mv demos/_briefs/<id>.md demos/<id>/brief.md
cp demos/_templates/{spec,log,qa,handoff}.md demos/<id>/ && mkdir -p demos/<id>/post && cp demos/_templates/post/*.md demos/<id>/post/
```

The brief stays word for word. Commit `<sid>: brief`. Then the base theme, untouched — Horizon unless the brief's store runs Dawn:

```bash
tools/shopify/theme.sh new <id>          # or: tools/shopify/theme.sh new <id> dawn
```

Run the `git commit` line it prints (`<sid>: baseline — … untouched`).

### 2. Setup — the before state (off the clock)

Plant the brief's starting state as one commit in `shopify-dev/<id>/theme/` (or record that the before is the untouched base), with `demos/<id>/setup/README.md` saying what was planted, any store data it needs and how to remove it at the reset, and the brief's one-line symptom check. Commit `<sid>: setup — planted before state (off the clock)`. Then:

```bash
tools/shopify/theme.sh push <id> before
```

Check the symptom on the before theme with the toolkit (a short capture or a Playwright check through `lib/storefront.mjs`, which passes the password page itself). Log `Setup complete (off the clock)`.

### 3. Before clips (off the clock)

Write `demos/<id>/capture/shoot.mjs` (and `qa.mjs`) from the brief's shoot list, per the toolkit README and guideline §4: the brief's view, framed on the part that matters, the same script for before and after, no password page or preview bar in frame. Then:

```bash
node tools/video/capture.mjs <id> before
```

Take the before numbers the brief asks for into `qa.md` (Lighthouse through `cap.lighthouse`, row 8). Look at one before clip's frames: the symptom must be plain to see. Capture stills (`cap.still`) for the carousel cover and the insight image while you are there. No build work starts before this. Commit `<sid>: before clips` (`capture/`, `qa.md`). Log `Before clips recorded (off the clock)`.

### 4. Brief received — the clock starts

Log `Brief received`. Write the same time into the brief's blank **Issued** line, and the deadline date the brief derives from it. If step 0 found a stop-reason-1 question, ask it now and wait for the answer.

### 5. Spec and plan (six-stage method, stages 1–2)

Write `spec.md` from the brief's mini approach: why, in scope, out of scope, testable done-means (the brief's done-list and acceptance cases, one by one), the surface for each piece ("which surface first", `CLAUDE.md`), touchpoints with every Liquid object, schema setting, API or event verified with the Shopify dev MCP (for section work the T2.1 build spec), risks, tasks with hours, total, and the delivery date — inside the deadline. Interrogate your own plan: at least one pushback, written under the plan with what changed. `## Decisions made without asking` holds every decision of the kind above. Commit `<sid>: spec`. Log `Plan written`. Nothing waits for an approval.

### 6. Build, stage by stage

One stage at a time, in the plan's order, our own files first. Look at the work through the after theme: `tools/shopify/theme.sh push <id> after` after a stage (re-push as often as needed; it stays unpublished), checked through the toolkit's browser at a desktop and a mobile width. After each stage, before its commit:

- `tools/shopify/theme.sh check <id>` — zero errors;
- console clean and no `Liquid error` on the pages touched;
- the stage's done-means checked — evidence written into `spec.md` `## Evidence`;
- the diff read line by line (`tools/shopify/theme.sh diff <id>`) against the hard rules: Liquid, schema, JS, the theme approach, our own files.

Commit `<sid> stage A: <what it did>` (stage `shopify-dev/<id>/` and `demos/<id>/`). After the first: log `First commit`. When the feature works end to end: log `Staging ready`. A mid-build scope change amends `spec.md` first.

### 7. After clips, QA, and the person's steps

```bash
tools/shopify/theme.sh push <id> after
node tools/video/capture.mjs <id> after
node tools/video/capture.mjs <id> qa
```

Same script, same view, same framing. The QA script records the storefront side of the purchase flow up to the checkout page, the scoped items at 360 / 390 / 768 px (emulated), collects console errors and `Liquid error`s from every page it opens (`page.on( 'console' )`, `page.on( 'pageerror' )`), and runs the after-Lighthouse exactly like the before. Fill every `qa.md` row you can, with evidence.

Then **stop once** (reason 2) for what only a person may do, in one message:

- place the test order on the after theme's preview link (`tools/shopify/theme.sh preview <id>`): an `@example.com` email, the test payment gateway, card `1`; reply with the order number;
- in the admin: check the order is correct and save a screenshot as `demos/<id>/media/raw/<id>-qa-admin-order.png`; do the theme editor pass (`qa.md` row 11) and save `<id>-qa-theme-editor.png`;
- if the scope changes an email: read it under View email in the order's timeline (never Resend) and say what it shows.

When the answer comes back, look at the screenshots, fill rows 2 and 11 (and any email item) with them, and finish `qa.md`: all 17 rows, each named as what it was. A known defect is not a pass: fix it, re-push `after`, re-run. If a capture fails, fix the theme or the script, never the footage. Commit `<sid>: QA`. Log `QA passed`.

### 8. Cold read and handoff

Hand the whole code diff (`tools/shopify/theme.sh diff <id>` and any `app/`) to a fresh review subagent with the hard rules (`CLAUDE.md`, `docs/house-rules.md`) and nothing of this conversation. Fix every real finding, re-run the affected checks, re-push `after`, commit `<sid>: polish`. Then write `spec.md` `## As built`, and `handoff.md`: what changed · the staging line exactly as the template has it (no link) · how to use it · how to roll back · what I'd flag to the client · decisions to confirm · warranty. Commit `<sid>: handoff`. Log `Handoff written` — the clock stops.

### 9. The words of the three posts

Draft, per guideline §5, §7, §7a and §7b and the formats in `tools/video/README.md`:

- `post/script.md` — the seven scenes with the Spoken column; scene 3 shows the questions only if one went to the chat, otherwise the decisions that mattered or the plan and the promised date; a scene with no real material is dropped, never filled;
- `post/copy.md` — the video post and two alternative first lines;
- `post/carousel.md` — 8–10 pages from the video's own files, its copy, two alternatives, the document title;
- `post/insight.md` — one observation from the handoff's flag, a `qa.md` number or the cause widened to its kind; the image's layout and words; the copy; two alternatives; the alt text. An outside figure only if you fetch it from its source now (WebFetch) and record source, URL, sentence and date; otherwise the post stands on the demo alone.

Every time, number and quote comes from a file in the demo folder. Then:

```bash
node tools/video/check.mjs <id> --words
```

Fix and repeat until it passes. Record wording decisions under `post/check.md` `## Decisions`. Commit `<sid>: post words` — the gate wants the four files committed as they stand.

### 10. Voice and renders

```bash
node tools/video/voice.mjs <id> --dry
node tools/video/voice.mjs <id>
node tools/video/render.mjs <id>
node tools/video/carousel.mjs <id>
node tools/video/insight.mjs <id>
```

No key on this machine: stop here (reason 2). A take that fails the word check after its retries: read the differences, fix, re-check the words, commit, `voice.mjs` again — only changed scenes are re-voiced. Then look at every frame of the video's contact sheets, every carousel page (its contact sheet) and the insight image — the Read tool shows PNGs — for leaks: no terminal, editor, path, store domain, preview link, password page, preview bar, admin, real name or email, no product blamed. Record one row per hash under `## Looked at` (`| Leaks | <hash> | PASS | Claude Code · <clock> | <what was seen> |`). Then:

```bash
node tools/video/check.mjs <id>
```

Every row PASS — none FAIL, none LOOK, none `—`. Commit `<sid>: post package` (the post files and `check.md`; `media/` is git-ignored). Log `Post package rendered`.

### 11. The audit — a separate reviewer (guideline §8)

Spawn a **fresh** subagent (Agent tool, general-purpose) and give it only this, filled in — never the build conversation, never your own conclusions:

> You are auditing a demo's three LinkedIn posts before the owner sees them. You have not seen the build or the drafting, and you trust nothing you are told about it. Read `asset/pervej-demo-video-guideline-v1.4.md` (§2, §5–§8) and `tools/video/README.md`. The demo folder is `demos/<id>/`; the rendered files are in `demos/<id>/media/final/`. Check every row of §8's table for yourself, plus the hard stops: read the files, look at every contact-sheet frame, every carousel page and the insight image (the Read tool shows PNGs) — on a Shopify demo also for the store's password page, the preview bar, the admin, a store domain or a preview link — run `node tools/video/check.mjs <id>` and compare what it says with what you see, and if `post/insight.md` has an outside figure, fetch its URL and find the sentence. Do not edit anything but `demos/<id>/post/audit.md`: write it as a table — Row · Result (PASS/FAIL) · Evidence (file and line, frame, page, or what you saw) — then a line "Audit: passed" or "Audit: failed — N rows". End your reply with that line.

Read `post/audit.md`. Fix every FAIL (words → check `--words`, commit, voice the changed scenes, re-render what changed; then the full check), and audit again with a **new** subagent. Two rounds of fixes and still failing: stop (reason 3) with what is left. Passed: commit `<sid>: audit`. Log `Audit passed`.

### 12. To the drive, and the message to Yeasir

```bash
node tools/video/drive.mjs <id>
```

Write the destination it prints (or "not set") on `log.md`'s Recordings line; commit `<sid>: package ready`. Then end the run with **one short message** — the guideline's step 7 — and nothing after it:

- the demo ID and branch, the after theme's name on the store, and where the package is (`media/final/` and the drive path, or "drive not set on this machine");
- the audit result, and the self-check line;
- the decisions he should know about, most important first, and anything the client should confirm;
- for the go (about five minutes): watch `<id>-linkedin.mp4` once at phone size muted and once with sound, flip through `<id>-carousel.pdf`, look at `<id>-insight.png`, read the three `-copy.txt` files — then "go" to the VA, or a note in plain words;
- the next commands for the person, each in its own block: `git push -u origin <id>` and `gh pr create --fill` — the PR is reviewed line by line and merged by Yeasir, alongside the go; after the merge, `tools/shopify/theme.sh restore <id>` if the run published a theme, then `tools/shopify/theme.sh clean <id>` and the store-data undo in `setup/README.md`;
- the time from `Brief received` to `Handoff written`, against the brief's hours.

## A note at the go

When Yeasir comes back with a note ("scene 3 sounds rushed", "page 4 is crowded", "use the second first line"), apply its one fix (guideline §10, §11), re-check, commit, re-voice or re-render only what changed, run the full check, audit again with a fresh subagent, and send the same short message.
