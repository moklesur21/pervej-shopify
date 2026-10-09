# Demo procedure — one demo, from the brief to three published posts

What the people do around one demo run. The run itself — every step Claude Code takes, in order — is `.claude/skills/demo/SKILL.md`; the rules are `CLAUDE.md` and `docs/house-rules.md`; the why is `asset/pervej-demo-video-guideline-v1.4.md` (the brief to the three posts, in one run) and `asset/pervej-demo-project-plan-v1.md`.

Example ID throughout: `s03-click-to-order-journey`. Replace it with yours — the ID is the name of the brief file waiting in `demos/_briefs/`.

**Never paste into Claude Code:** the Upwork feed, links, full job posts, poster names, the client fact sheet. Claude Code stops if it sees any of them. It receives `brief.md` and nothing else. Private files live outside the repo (`~/pervej-private/`), never in the working tree.

**One run, one session.** The demo is one task: a new Claude Code session, one line, and the next thing you see is a finished, audited package — with one stop at QA for what only a person may do. Auto mode is fine for a demo run (it is the one exception to ask-first, house rules §0); the repo's `.claude/settings.json` already allows the run's own commands and denies git push, theme publish and theme delete.

**Stores.** Every store command runs against **your own** demo dev store (`SHOPIFY_STORE` in `tools/shopify/.env.local`). Nothing here ever touches a live theme or publishes one. The storefront password and the admin sign-in are typed by a person, never by Claude Code; the toolkit reads the storefront password from `.env.local` itself.

**Everything local, the Shopify way** (guideline §2, demo plan v1.2 §6.2). Shopify has no local store: a demo is built and checked on your own dev store, on its unpublished before and after themes. Nothing else: no tunnel, proxy, public URL, mail server or extra software; the toolkit's Chromium and Claude's built-in browser only. Order emails are not checked — Shopify sends them, not the theme; phone widths are emulated, Chrome only.

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

## Stage 1 — start the run · Yeasir or Asad

1. Once per machine, on top of Stage 0: `PERVEJ_DRIVE_DIR=<the recordings folder of your synced drive>` in `tools/shopify/.env.local`, so the run can copy the package there (without it the package stays in `demos/<id>/media/final/`). `npm --prefix tools/video run doctor` — every line `[ok]`, including PDF printing, the storefront password and the ElevenLabs key — and `tools/shopify/theme.sh doctor`, with the CLI logged in.

2. `main` up to date, nothing uncommitted:

```bash
git checkout main && git pull
```

3. A new Claude Code session in the repo, and one line:

> /demo s03-click-to-order-journey

("Work on s03-click-to-order-journey" means the same.) The run branches, commits the base theme, plants and pushes the before theme, records the before clips, starts the clock, plans, builds through the after theme, QAs, hands off, drafts and renders the three posts, has them audited, copies the package to the drive and ends with one short message.

**It stops only when blocked** (guideline §3), with one question:

| Stop | What you do |
|---|---|
| **QA — the person's steps** (every demo) | On the after theme's preview link: place the test order with an `@example.com` email, the test payment gateway, card `1`; in the admin, screenshot the order and do the theme-editor pass, saving the files under the names it gives; reply with the order number. |
| An ambiguity in the brief that changes what gets built | Put the question to the project chat, paste the answer back. The run writes it into `brief.md` `## Q&A` with both times and carries on. |
| Something it can't do itself — the CLI wants a login, a token, a missing asset, `main` behind `origin` | Do it, say "done". |
| The audit still fails after two rounds of fixes | Read what's left in `post/audit.md`; decide. |
| Marketplace material in the brief | The brief goes back to the project chat. |

Everything else it decides and writes down: build decisions in `spec.md`, wording decisions in `post/check.md`, and the ones the client should confirm in `handoff.md`. No plan approval or delivery acceptance is waited for (guideline §13).

---

## Stage 2 — the go · Yeasir · about five minutes

The run's last message names the package, the audit result and the decisions worth knowing. Then:

- Watch `s03-click-to-order-journey-linkedin.mp4` once at phone size with the sound off (a window about 400 px wide), once with it on.
- Flip through `s03-click-to-order-journey-carousel.pdf`; look at `s03-click-to-order-journey-insight.png`.
- Read the three copies: `-copy.txt`, `-carousel-copy.txt`, `-insight-copy.txt`.

Then tell the VA **go**, or give Claude Code a note in plain words ("scene 3 sounds rushed", "page 4 is crowded", "use the second first line"). It applies the fix, audits again, and comes back for the go.

---

## Stage 3 — push, review, merge, clean up · Yeasir or Asad, then Yeasir

Alongside the go, not instead of it:

```bash
git push -u origin s03-click-to-order-journey
```

```bash
gh pr create --fill
```

The PR is read line by line — from the setup commit (`tools/shopify/theme.sh diff s03-click-to-order-journey`), the spec's decisions, the post files. Yeasir merges:

```bash
git checkout main && git pull && git merge --no-ff s03-click-to-order-journey && git push
```

```bash
git tag s03-click-to-order-journey && git push origin --tags
```

```bash
git branch -d s03-click-to-order-journey && git push origin --delete s03-click-to-order-journey
```

Whoever ran the demo cleans their store — the theme library is capped — and undoes any store data `setup/README.md` lists:

```bash
tools/shopify/theme.sh clean s03-click-to-order-journey
```

---

## Stage 4 — publish · VA, then Yeasir

Per guideline §9, from `media/final/` on the drive, 7 PM Dhaka, never more than one post a day:

- **Monday** — the insight post: `-insight.png`, `-insight-copy.txt` pasted exactly, `-insight-alt.txt` as the alt text.
- **Tuesday** — the video: native upload from a desktop browser, the cover as thumbnail if offered, `-copy.txt` pasted exactly.
- **Thursday** — the carousel: `-carousel.pdf` as a document, `-carousel-title.txt` as its title, `-carousel-copy.txt` pasted exactly.

Yeasir replies to every comment himself, and records each post's URL and date in `log.md` with one commit straight on `main` — the only direct-to-`main` commit the workflow allows:

```bash
git checkout main && git pull && git add demos/s03-click-to-order-journey/log.md && git commit -m "s03: published" && git push
```

Seven days after each post: who reacted and commented — agency-side people, not totals — into the Sunday scorecard.

---

## Done — two gates

**Demo done** (guideline §12, before the merge):

- [ ] `brief.md` in the repo, anonymised, with any Q&A and timestamps
- [ ] `spec.md` with the plan, the delivery date and every decision made without asking
- [ ] `log.md` — every time from the system clock; setup, before clips and the post package marked off the clock
- [ ] `qa.md` — all 17 rows passed with evidence
- [ ] `handoff.md` — with rollback, "what I'd flag" and the decisions to confirm
- [ ] the baseline, setup and stage commits in `shopify-dev/<id>/`; `capture/` committed; before, after and QA clips in `media/raw/`
- [ ] the four post files; `post/check.md` and `post/audit.md` every row passed
- [ ] `media/final/` complete and on the drive
- [ ] Yeasir's go
- [ ] PR reviewed line by line, merged by Yeasir, tagged, branch deleted; the store cleaned

**Posts done:** all of the above, plus all three published and their URLs in `log.md`.

## Log entries, in order

| Event | When |
|---|---|
| Setup complete (off the clock) | The before theme is pushed and its check passes |
| Before clips recorded (off the clock) | Before anything is built |
| Brief received | T0 — the clock starts |
| Questions answered | Only if a question went to the project chat |
| Plan written | `spec.md` done, delivery date set |
| First commit | First build commit |
| Staging ready | Feature works end to end on the after theme |
| QA passed | `qa.md` complete, the person's steps included |
| Handoff written | `handoff.md` done; the clock stops |
| Post package rendered (off the clock) | Video, carousel and insight image rendered, self-check passed |
| Audit passed (off the clock) | `post/audit.md` passed |
| Published × 3 | Each post's URL and date; added on `main` by Yeasir |
