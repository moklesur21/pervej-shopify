# demos/ — one folder per practice build

The operating manual is `asset/pervej-demo-project-plan-v1.md` (rules, scoring, QA); the chat-to-repo handoff is `asset/pervej-demo-cycle-runbook-v1.md`; how the video and its post copy are made is `asset/pervej-demo-video-guideline-v1.1.md`, which takes precedence on that topic. This is the folder-level summary; the step-by-step is `docs/demo-procedure.md`.

## The one rule

**Upwork stops at the project chat.** The feed, screenshots, links, full job posts, the shortlist, the picks and the client fact sheet live only in the claude.ai project chat. This repo receives exactly one thing per demo: the finished brief, already anonymised, in our own format. Claude Code never sees any Upwork material and never invents a client answer.

## A demo on disk

```
demos/_briefs/s01-cart-drawer-lag.md   ← the brief as issued, queued on main until the demo starts
demos/s01-cart-drawer-lag/             ← paperwork (this folder)
  brief.md    from the project chat, moved in from _briefs/ (never copied): client brief · mini approach · shoot list · Q&A (only if a question was asked)
  spec.md     the builder's translation of the brief (six-stage method, stage 1) — tasks, hours, delivery date under "Agreed plan"
  log.md  qa.md  handoff.md
  setup/      README.md: what the "before" state plants (in the theme's setup commit and on the store), the store
              data it creates and how to remove it, and a one-line symptom check; planned from the mini approach
  brief-assets/  inputs the brief ships with (design frames, licences) — only when it has any
  capture/    Playwright capture scripts written from the brief's shoot list; one script records before, after and the QA run — committed
  post/       script.md · copy.md · check.md — drafted by Claude Code from this folder's files, two approvals by Yeasir · carousel.md from the project chat
  media/      git-ignored; copied to the drive as recordings/shopify/<id>/
    themes.json  the before/after theme IDs and preview links on *your* store (tools/shopify/theme.sh push)
    raw/      <id>-before-* · <id>-after-* · <id>-qa-* · Lighthouse reports
    voice/    optional voice-over take
    final/    <id>-linkedin.mp4 · <id>-cover.png · <id>-contact-*.png · <id>-timeline.png · <id>-copy.txt
shopify-dev/s01-cart-drawer-lag/  ← the deliverable: theme/ (and app/, middleware/, pixel/, data/ when the brief needs them)
```

Branch `s01-cart-drawer-lag`, tag `s01-cart-drawer-lag`, themes `s01-cart-drawer-lag · before` / `· after` on your store, drive folder `recordings/shopify/s01-cart-drawer-lag/`. Same ID everywhere.

## Starting one

The project chat turns the feed into **one brief file** named by demo ID (runbook §2); the rest of the scored posts go to `_backlog/candidates.md`, pasted here anonymised via a `chore/` branch. The brief waits in `_briefs/<id>.md` on `main` — added the same way, via a `chore/` branch, exactly as the chat issued it — so both builders can see what is next. If a queued brief's dates no longer fit its slot, the project chat reissues it; nobody edits the client's dates here. When the demo starts, the brief is **moved** (`git mv`, never copied) to `<id>/brief.md` on the demo branch; from then on reissues and Q&A answers land only there, and at the end of Stage 2a it is put on the current template — form only, §1 and §2 word for word. From that moment, follow **`docs/demo-procedure.md`** — every stage with the command to run, the exact ask to Claude Code, the log entry, and the capture or approval it ends with.

## Done means (procedure "Done", runbook §7, video guideline §12)

**Demo done, before the merge:** `brief.md` (with any Q&A), `spec.md`, `log.md` (every time from the system clock; setup and before clips marked off the clock), `qa.md` (every line passed) and `handoff.md` complete · `capture/` committed · `post/script.md` and `copy.md` approved, `check.md` every row passed with both approvals recorded · `media/final/` on the drive · PR merged and tagged · demo themes cleaned off your store and any store data undone. **Video done:** all of that, plus the post published and its URL in `log.md`. Missing any one: not done.

## Rules that never bend (§1.1)

Practice build, said so · the category, not the client's bug · Upwork stays invisible · real timestamps only · AI stays off screen · never on a live store — dev stores only · reviewed before it counts · IP hygiene (Dawn, Horizon, our own kits; licensed images only).
