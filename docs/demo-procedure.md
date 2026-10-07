# Demo procedure — one demo, from the brief to the finished video

The checklist for running one practice build from the brief file to the published LinkedIn video. Rules live in `CLAUDE.md` and `docs/house-rules.md`; the why is in `asset/pervej-demo-project-plan-v1.md`, `asset/pervej-demo-cycle-runbook-v1.md` and, for the video and its post copy, `asset/pervej-demo-video-guideline-v1.2.md`. This file only says **who does what, in what order, with which command or ask.**

Example ID throughout: `s01-cart-drawer-lag`. Replace it with yours — the ID is the name of the brief file waiting in `demos/_briefs/`.

**Never paste into Claude Code:** the Upwork feed, links, full job posts, poster names, the client fact sheet. Claude Code stops if it sees any of them. It receives `brief.md` and nothing else.

**Sessions.** One Claude Code session per stage, on the demo branch. The repo files carry all the state, so a fresh session at Stages 2, 3, 4 and 5 loses nothing and keeps each session small.

**Times.** Never type a time from memory. When an event happens, tell Claude Code to log it now — it reads the system clock and writes `log.md`. A missed time comes from a commit or a file's own timestamp, or stays blank. It is never estimated.

**Nothing is recorded by hand.** Playwright scripts in `capture/` record the before and after themes through their preview links; the brief, questions, plan, timeline, QA sheet and handoff become slides drawn from the files; the voice is made by the toolkit from the approved words, in Yeasir's own voice clone (guideline §10). No OBS, no screen recorder, no microphone, nothing of the tooling in frame — and Shopify's password page, preview bar and admin never in frame either.

**Stores.** Every store command runs against **your own** demo dev store (`SHOPIFY_STORE` in `tools/shopify/.env.local`). Nothing here ever touches a live theme or publishes one.

**Everything local, the Shopify way** (guideline §2, demo plan v1.2 §6.2). Shopify has no local store: a demo is built on your own dev store (`theme dev`) and captured and checked there, on its unpublished before and after themes — never through `theme dev`'s local preview. Nothing else: no tunnel, proxy, public URL, mail server or extra software; the toolkit's Chromium and Claude's built-in browser only. The order emails are read in the order's timeline in the admin; phone widths are emulated; Chrome only. The same steps work on macOS and on Windows (`docs/windows.md`, Asad's PC).

---

## Stage 0 — once, before the first demo · Yeasir

1. `main` up to date, templates current:

```bash
git checkout main && git pull
```

```bash
ls demos/_templates demos/_briefs
```

Expected: `brief.md handoff.md log.md qa.md spec.md` and the queued briefs.

2. **Stores** (demo plan §6.2). In the Partner organisation — never a personal login — create two development stores for the weekly demos, **demo store A** (Yeasir) and **demo store B** (Asad), and add Asad as a staff member of the organisation; check his access after creation. On each demo store: start with test data, activate the **Bogus gateway** (Settings → Payments), note the storefront password (Online Store → Preferences), switch the cart type to drawer (theme settings). Each person also creates their own `<name>-training` store for the T-series; labs never run on a demo store.

3. **Tools on each machine** — Node 22.19+, ffmpeg, the current Shopify CLI (4.x: `theme push --strict` must exist), and Playwright's browsers through the video toolkit's one command (Windows: `docs/windows.md`):

```bash
brew install node ffmpeg
```

```bash
npm install -g @shopify/cli@latest
```

(An old copy from Homebrew? Run `brew uninstall shopify-cli` first. npm can't replace its `shopify` link, and `brew upgrade` can hang building dependencies from source.) Then the local settings and the check:

```bash
cp tools/shopify/.env.example tools/shopify/.env.local
```

Fill in `SHOPIFY_STORE` and `SHOPIFY_STOREFRONT_PASSWORD`, then:

```bash
tools/shopify/theme.sh doctor
```

Every line `[ok]`. Then the voice key, once per machine that makes the voice: the person types it, Claude Code never sees it (toolkit README, "The voice key"; one key per machine serves both repos). In Claude Code, approve the `shopify-dev-mcp` server from `.mcp.json` (current Shopify docs for every session) and run the T0.3 litmus test once: *"Is `checkout.liquid` still the way to customize checkout?"* — the answer must say it is retired.

4. **Check the video toolkit against your store.** `tools/video/` was adapted to Shopify on `chore/shopify-capture`: it gets past the storefront password page the way Shopify's own Lighthouse CI does, records on the demo's preview themes, hides the preview bar, and fails with a clear message when a page shows the wrong theme. With step 3 done:

```bash
npm --prefix tools/video run doctor
```

The storefront-password line must say *accepted*; the ElevenLabs line says `[ok]` once the key is stored (step 3). Then one real capture, asked of Claude Code on a throwaway branch:

> Check the capture toolkit on my demo store: `tools/shopify/theme.sh new s00-capture-check` and `push s00-capture-check before`, a throwaway `demos/s00-capture-check/capture/shoot.mjs` with one clip on the home page that clicks once, one still at 390 px and one Lighthouse run, then `capture.mjs s00-capture-check before`. Show me a frame from the clip, the wide still and the 390 px still: no password page, no preview bar, the sidecar on the pushed theme with the click in its events. Then clean the theme off the store and delete the throwaway folders; commit nothing.

Anything the real store does differently from the mock in `tools/video/test/` is fixed in the toolkit, on a `chore/` branch, before the first demo.

5. **The baseline catalogue.** Both demo stores should hold the same products, so a demo set up on store A reproduces on store B. Ask, on a `chore/shopify-baseline` branch:

> Write `tools/shopify/baseline/`: a products CSV for the admin importer that covers the QA edge cases (a product with two options and six variants, one on sale with a compare-at price, one sold out, one low stock, one single-image product, one with an 80-character title, a gift card), and a checklist of the store settings every demo store needs (Bogus gateway, storefront password, drawer cart, collections, shipping, a `WELCOME10` discount). Verify the CSV columns against current Shopify docs. Plan mode first. Open a PR.

Then import it on both demo stores.

6. **The project chat's brief template.** Give the project chat the current `demos/_templates/brief.md`. The queued briefs (s01, s02) predate it: they say "← T0, the clock starts here" (the clock starts at `Brief received`, after setup and the before clips), and they have no View line and no Q&A table. Briefs issued from the current template arrive ready, and the Stage 2a template step becomes a quick tidy.

---

## Stage 1 — start the demo · builder · off the clock

1. Branch:

```bash
git checkout main && git pull
```

```bash
git checkout -b s01-cart-drawer-lag
```

2. Move the brief out of the inbox into the demo folder — moved, never copied, so there is only ever one brief — then add the other templates:

```bash
mkdir -p demos/s01-cart-drawer-lag && git mv demos/_briefs/s01-cart-drawer-lag.md demos/s01-cart-drawer-lag/brief.md
```

```bash
cp demos/_templates/{spec,log,qa,handoff}.md demos/s01-cart-drawer-lag/
```

The brief goes in exactly as the project chat issued it. From here on, reissues and Q&A answers land in `demos/s01-cart-drawer-lag/brief.md` on this branch, never in `demos/_briefs/`.

```bash
git add demos/s01-cart-drawer-lag && git commit -m "s01: brief"
```

3. The base theme — untouched, committed before anything else. **Horizon for a new build** (the house decision, strategy v1.4: `theme.sh new <id>` with no base); **Dawn when the brief's client store is Dawn-based** — fix and feature work happens in the architecture the store already has. s01's store is Dawn-based:

```bash
tools/shopify/theme.sh new s01-cart-drawer-lag dawn
```

Run the `git commit` line it prints (`s01: baseline — Dawn v16.0.0 (<sha>), untouched`). Every later diff then shows only our work. A brief that asks for a new build on Dawn is a question for the project chat, not a silent switch.

---

## Stage 2 — the "before" state and the before clips · Claude Code · off the clock

**2a. Plant the problem.** Open a session on the branch and ask, word for word:

> Read `demos/s01-cart-drawer-lag/brief.md`. Plan and build the before state: the planted changes in `shopify-dev/s01-cart-drawer-lag/theme/` as one commit, and `demos/s01-cart-drawer-lag/setup/README.md` saying what was planted, any store data it needs (and how to remove it at the reset), and a one-line check that the symptom is present. Plan mode first.

Claude plans, you approve, Claude writes it, you review the diff line by line. Then:

```bash
git add -A demos/s01-cart-drawer-lag shopify-dev/s01-cart-drawer-lag && git commit -m "s01: setup — planted before state (off the clock)"
```

```bash
tools/shopify/theme.sh push s01-cart-drawer-lag before
```

It prints the preview link of `s01-cart-drawer-lag · before`. Confirm the symptom yourself in the browser on that link.

Then, if the brief is not on the current template yet, ask:

> Put `demos/s01-cart-drawer-lag/brief.md` on the current template (`demos/_templates/brief.md`): the header clock line, the View line, the shoot list as steps a capture script can drive on the before theme `setup/` just built, Before you start, and an empty Q&A table. Sections 1 and 2 stay word for word. Anything the template needs that the brief does not say is a question for the project chat — list it, don't fill it.

Review the diff line by line — the client's words must not have moved — then:

```bash
git add demos/s01-cart-drawer-lag/brief.md && git commit -m "s01: brief on template"
```

**2b. Record the before clips.** Nothing is built until these exist. Ask:

> Write `demos/s01-cart-drawer-lag/capture/` from the brief's shoot list and record the before clips and the before-Lighthouse on the before theme per the video guideline §4, in the view the brief is about (desktop at 1280 px, framed on the part of the page that matters; 390 px only for a mobile problem), before anything is changed. Put the before numbers in `qa.md` row 8 and keep the reports in `media/raw/`.

Review `capture/` line by line. Watch one clip in `media/raw/s01-cart-drawer-lag-before-*` — the symptom has to be plain to see, and no password page or preview bar in frame. Then:

```bash
git add demos/s01-cart-drawer-lag && git commit -m "s01: capture"
```

(`media/` is git-ignored; only `capture/` and `qa.md` go in.)

**2c. Log, then start the clock.** Ask:

> Log `Setup complete (off the clock)` and `Before clips recorded (off the clock)` now.

Then, when you are ready to start:

> Log `Brief received` now.

**T0. The clock runs from here to `Handoff sent`.**

---

## Stage 3 — spec, plan, build · Claude Code, one session per task · on the clock

**3a. Spec.** New session:

> Write `demos/s01-cart-drawer-lag/spec.md` from the brief's mini approach: why, in scope, out of scope, testable done-means, the base theme and the surface for each piece, touchpoints with every Liquid object, schema setting, API or event verified against current Shopify docs, tasks with hours per task, total and delivery date. For section work include the T2.1 build spec.

Review it against the brief, then:

```bash
git add demos/s01-cart-drawer-lag/spec.md && git commit -m "s01: spec"
```

The delivery date in `spec.md` is the promise the video shows against `Handoff sent`.

**3b. Plan.** New session, plan mode:

> Plan the build from `demos/s01-cart-drawer-lag/spec.md`. Interrogate scope, the surface and the files for each piece (our own files first, any base-theme edit justified), platform facts verified against current docs, stages and the test plan.

Expect at least one pushback. Record the agreed plan and any pushback under "Agreed plan" in `spec.md`.

**3c. Build.** One stage per ask, spec pasted each time:

> Build stage A of `demos/s01-cart-drawer-lag/spec.md`: <one line naming the stage>. Nothing outside it. List anything you could not implement, and why.

The browser loop while building: `tools/shopify/theme.sh dev s01-cart-drawer-lag` (a private development theme on your store). After every stage, before committing:

```bash
tools/shopify/theme.sh check s01-cart-drawer-lag
```

- Console clean; no `Liquid error` on the pages touched.
- Behaviour checked in the browser, including a mobile width.
- Diff read line by line (review protocol, house rules §0).

```bash
git add -A shopify-dev/s01-cart-drawer-lag && git commit -m "s01 stage A: <what it did>"
```

After the first stage commit: *"Log `First commit` now."* When the feature works end to end: *"Log `Staging ready` now."*

**If Claude Code stops with a question for the client:** it never guesses. Yeasir puts the question to the project chat, pastes the answer into the `## Q&A` table in `brief.md` with both timestamps, commits `s01: client answer`, and asks *"Log `Questions answered` now."* Then amend `spec.md` if the answer changes scope, and continue. That exchange becomes the questions slide.

---

## Stage 4 — after clips, QA, handoff, pull request · builder, then reviewer

**4a. After theme, after clips and the QA run.** Push the finished theme:

```bash
tools/shopify/theme.sh push s01-cart-drawer-lag after
```

New session:

> Re-run `demos/s01-cart-drawer-lag/capture/` on the after theme for the after clips — same view, same framing, same steps — and record the QA run per the video guideline §4: the test order on desktop with an `@example.com` email, the scoped items at 360, 390 and 768 px (emulated), and the after-Lighthouse.

Check `media/raw/s01-cart-drawer-lag-after-*` and `-qa-*`. If a run fails, fix the theme or the script — never the footage.

The order emails live in the order's timeline in the admin, where no script signs in. Sign in to your store's admin yourself in Claude's built-in browser (Claude Code never types a password), then ask *"Read the test order's timeline and its emails into `qa.md` row 2."* — or take stills of the timeline and the opened email by hand into `media/raw/s01-cart-drawer-lag-qa-order-timeline.png` and `-qa-order-email.png`. The timeline lists each email sent to the customer; its **View email** shows the subject, the delivery status and the text (never press Resend). Evidence only: the admin never goes in the video.

**4b. QA sheet.** `qa.md`: all 17 rows, with evidence (a clip or screenshot filename in `media/raw/`, or pasted output). Includes the full purchase flow with a Bogus-gateway test order (card `1`) found in admin with its timeline, the theme editor pass and the scope diff (`tools/shopify/theme.sh diff s01-cart-drawer-lag --stat`). Every check is named as what it was ("360 / 390 / 768 px, emulated", "Chrome"); nothing claims a real device or a browser that was not run. A known defect is not a pass. Then: *"Log `QA passed` now."*

**4c. Handoff.** `handoff.md`: what changed · staging link ("Practice build on a Shopify development store; not publicly available." — no link: the store sits behind its password) · how to use it · rollback · what I'd flag to the client · warranty line. No walkthrough video (retired in guideline v1.2): the demo's one video is Stage 5's. Then: *"Log `Handoff sent` now."* **The clock stops.**

**4d. Pull request.** Cold read as a stranger:

```bash
tools/shopify/theme.sh diff s01-cart-drawer-lag
```

Fix nits as one `s01: polish` commit. Then:

```bash
git push -u origin s01-cart-drawer-lag
```

Open the PR. The other person reviews every line — from the commit after the baseline, so the untouched base theme stays out of the review. Nothing merges yet: the video package (Stage 5) lands on this branch first.

---

## Stage 5 — the video package · Claude Code drafts, Yeasir approves · off the clock

**5a. The words.** New session:

> Make the video package for `s01-cart-drawer-lag` per the video guideline. Stop at Approval 1.

Claude Code writes `post/script.md` (seven scenes with the Spoken column — what the voice says, guideline §5; every time, number and quote copied from a file in the folder, and the script names the file), `post/copy.md` (the post text plus two alternative first lines) and `post/check.md` (the self-check). A scene with no real material is dropped, never filled.

**Approval 1 — Yeasir.** Read `script.md` — the lines, the slides and the Spoken words — and `copy.md`. Pick the first line. Edit or approve. Write `Approved 1 — <Day HH:MM> · Yeasir` under an "Approvals" heading in `check.md`. Then:

```bash
git add demos/s01-cart-drawer-lag/post && git commit -m "s01: script and copy"
```

**5b. The voice and the cut.** Ask:

> Script and copy approved. Make the voice, render, run the self-check, stop at Approval 2.

Claude Code runs `node tools/video/voice.mjs s01-cart-drawer-lag` (the approved Spoken words in Yeasir's voice clone, each scene checked word for word; on the machine that holds the voice key) and then `node tools/video/render.mjs s01-cart-drawer-lag`, which renders `media/final/`: `s01-cart-drawer-lag-linkedin.mp4` (voiced, with the music bed, clicks and typing), `-cover.png`, `-contact-*.png`, `-timeline.png`, `-copy.txt`, and updates `check.md`. It looks at every contact-sheet frame and records the look.

**Approval 2 — Yeasir.** Watch the video once at phone size with the sound off (a window about 400 px wide), then once with the sound on. Scan the contact sheets — no password page, preview bar, admin, terminal or path in any frame. Every row of `check.md` passed — a fail is fixed or reported, never waved through. A note ("scene 3 sounds rushed", "music too loud") goes back to Claude Code in plain words; each kind has one fix (guideline §10) and a re-render of a few minutes. When it is right, write `Approved 2 — <Day HH:MM> · Yeasir` in `check.md`, then:

```bash
git add demos/s01-cart-drawer-lag/post && git commit -m "s01: video package"
```

Any later change to the words goes back to Approval 1, the voice and a re-render.

**5c. To the drive.** Copy the whole `media/` folder to `recordings/shopify/s01-cart-drawer-lag/` on the drive; put the path in `log.md`; tell the VA the demo ID.

**5d. Tuesday carousel** (still drafted in the project chat — guideline §13). Send `log.md`, `qa.md` and `handoff.md` to the chat; it returns the carousel. Approve it, save it as `post/carousel.md`:

```bash
git add demos/s01-cart-drawer-lag/post/carousel.md && git commit -m "s01: carousel" && git push
```

---

## Stage 6 — merge and clean up · Yeasir, then the builder

Review complete, both approvals in `check.md`, `media/final/` on the drive. Then:

```bash
git checkout main && git pull && git merge --no-ff s01-cart-drawer-lag && git push
```

```bash
git tag s01-cart-drawer-lag && git push origin --tags
```

```bash
git branch -d s01-cart-drawer-lag && git push origin --delete s01-cart-drawer-lag
```

Whoever pushed the demo's themes cleans their store — the theme library is capped — and undoes any store data `setup/README.md` lists:

```bash
tools/shopify/theme.sh clean s01-cart-drawer-lag
```

---

## Stage 7 — publish · VA, then Yeasir · Thursday of the following week

Per the video guideline §9, from `media/final/` on the drive:

- **VA, 7 PM Dhaka:** native video upload from a desktop browser, never a link · one video, nothing else attached · the cover image as the thumbnail if offered · auto-captions off, no caption file · paste `s01-cart-drawer-lag-copy.txt` exactly · preview on desktop and on a phone: first frame readable, label visible, link present.
- **Yeasir:** replies to every comment himself. Then records the post — the URL and date into `log.md` with one commit straight on `main`:

```bash
git checkout main && git pull && git add demos/s01-cart-drawer-lag/log.md && git commit -m "s01: published" && git push
```

This is the only direct-to-`main` commit the workflow allows.

- **Seven days later, Yeasir:** who reacted and commented — agency-side people, not totals — into the Sunday scorecard.

---

## Done — two gates

**Demo done** (before the merge):

- [ ] `brief.md` in the repo, anonymised, on the current template, with any Q&A and timestamps
- [ ] `spec.md` with the agreed plan, hours and delivery date
- [ ] `log.md` — every time from the system clock; setup and before clips marked off the clock
- [ ] `qa.md` — every row passed with evidence
- [ ] `handoff.md` — with rollback and "what I'd flag"
- [ ] `capture/` committed; before, after and QA clips in `media/raw/`
- [ ] `post/script.md` and `post/copy.md` approved, the voice made from them; `post/check.md` every row passed, both approvals recorded
- [ ] `media/final/` complete and on the drive; the VA has the ID
- [ ] PR reviewed line by line, merged by Yeasir, tagged, branch deleted
- [ ] The demo's themes cleaned off the store; any store data undone

**Video done** (guideline §12): all of the above, plus

- [ ] Published Thursday; post URL and date in `log.md`

## Log entries, in order

| Event | When |
|---|---|
| Setup complete (off the clock) | Stage 2a done |
| Before clips recorded (off the clock) | Stage 2b done, before T0 |
| Brief received | T0 |
| Questions answered | Only if a question went to the project chat |
| First commit | First build commit |
| Staging ready | Feature works end to end |
| QA passed | `qa.md` complete |
| Handoff sent | `handoff.md` done; the clock stops |
| Published | Post URL and date, the Thursday after; added on `main` by Yeasir |
