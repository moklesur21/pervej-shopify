# Pervej.com — Demo Video Guideline: finished build → LinkedIn video + post copy

**v1.1 · Wed 30 Sep 2026 · Owner: Yeasir Pervej · Status: pilot — lock after the first video**
Reads with: `pervej-demo-project-plan-v1.md` (rules, QA — the source of truth) · `pervej-demo-cycle-runbook-v1.md` v1.1 · `pervej-proof-content-ad-strategy-v1.md`
**Lives in:** the demos repo root, where Claude Code follows it, and in the Project. **Shareable with:** Asad and the VA. No pricing, pipeline or Upwork data in this file.
**Precedence:** on how the video and its post copy get made, this file replaces what the demo plan and the runbook say; §13 lists every difference. It never loosens a rule in the demo plan's §1.1.
**Who reads what:** Yeasir — §3, §8, §11 · the VA — §9 · Claude Code — all of it.

One question, answered simply: **a demo is built — how does it become Thursday's LinkedIn video, with the post copy attached.**

Platform facts marked **[Cited]** are sourced in §15. They change, so re-check them whenever this file is reviewed.

---

## 1. What the video is for

One video per demo: the Thursday LinkedIn post. 60–90 seconds, square, uploaded natively, and made to be understood with the sound off, because feed video autoplays muted **[Cited]**.

**Made for both screens.** The working assumption is that prospects mostly watch at their desks. Phones can't be ignored, though: estimates put between just over half and about three-quarters of all LinkedIn viewing there **[Cited]**. So the video is square, which plays in full on both, and never vertical: that is a phone format, and desktop LinkedIn shows it small, with empty space at the sides **[Cited]**.

The viewer is an agency owner or operations lead scrolling the feed. They don't doubt that a developer can fix a checkout. They fear three things, and each one gets its own evidence on screen:

| Their fear | What the video shows | Taken from |
|---|---|---|
| Slow turnaround | What was promised and when it was delivered, in real timestamps | the plan · `log.md` |
| Work that comes back needing redoing | The test order, the screen-size and browser checks, speed before and after | `qa.md` + the QA recording |
| Silence and unclear communication | The questions asked before starting, and what the agency receives at handoff | the brief's Q&A · `handoff.md` |

The format is an **evidence reel**: every frame shows either the real demo site or words and numbers taken from the demo's own files. It is not a tutorial, not a feature showcase, not an "after" video and not an advert.

**The files it draws on.** If the repo names one differently, the role is what matters.

| File | What the video takes from it |
|---|---|
| The brief | The client's ask in their words, the deadline, the shoot list, and the questions and answers with their times (kept in the brief file, or in `questions.md`) |
| The plan (`plan.md`) | What was promised: the work in one line and the delivery date |
| `log.md` | Every time shown on screen |
| `qa.md` | What was checked, the results, the before and after numbers |
| `handoff.md` | What changed, what the agency receives, the rollback note, what I'd flag to the client |

---

## 2. Rules

These sit on top of the demo plan's §1.1. None of them bends.

| Rule | Detail |
|---|---|
| **The label, always** | *"Practice build from a public job brief. Anonymised."* on every frame of the video and as the second line of the post. |
| **Nothing invented** | Every time, number and quote on screen is copied from a file in the demo folder, and the script names that file. A scene with no real material is dropped, never filled: no question is written after the fact, no check is listed that wasn't run. |
| **One script shoots before and after** | The same capture script records the starting state and the finished state: same steps, same framing. |
| **Real speed where speed is the claim** | Loading and checkout clips play uncut at real speed. Anything else that is sped up carries a visible "×2" mark. |
| **The promise kept, not the hours** | Show the delivery date promised and the time delivered. The times are the real ones from the log; effort is never totalled or headlined ("fixed in 40 minutes", hours spent). If the promise was missed, the video says so or the demo isn't published. |
| **A kind of cause, not a product** | The problem was recreated on our own site. Naming the stack the demo really runs on (WooCommerce, Shopify, the theme) is fine; blaming a named plugin, theme, app or company for a fault we planted is not. |
| **The tools stay off screen** | No terminal, editor, prompts, file paths or usernames in frame, and nothing about how the code was produced (demo plan §1.1). In the video itself: no synthetic voice, no generated images, no stock footage, no music. |
| **Words that never appear** | "Case study" · anything that presents the demo as paid work ("my client", "a recent project") · the name of any freelance marketplace (Upwork, Fiverr and the like) · prices, "free", terms, NDA, logins · AI, Claude or any AI tool · results that weren't measured. "The client" may only mean the client in the brief. |
| **Nothing is posted unapproved** | Two approvals by Yeasir (§8). |

---

## 3. The flow

| # | When | Who | What |
|---|---|---|---|
| 1 | Setup done, starting state confirmed — off the clock | Claude Code | Write the capture script from the brief's shoot list. Record the **before** clips and numbers (§4). No build work starts until they exist. |
| 2 | Through the build | Claude Code | Write each `log.md` time from the system clock at the moment it happens. A missed time is taken from a record that has it (a commit, a file's own timestamp) or left blank. It is never estimated. |
| 3 | Build done, QA passing | Claude Code | Re-run the same capture script for the **after** clips. Record the QA run. |
| 4 | Handoff written | Yeasir or Asad | Asks for the video package (§11). |
| 5 | — | Claude Code | Drafts `post/script.md` and `post/copy.md`, runs the self-check. **Approval 1: the words.** |
| 6 | — | Claude Code | Renders the video, cover and contact sheets, runs the self-check. **Approval 2: the cut.** |
| 7 | Cut approved | Yeasir or Asad | Copies `media/` to the drive and tells the VA the demo ID. |
| 8 | Thursday of the following week | VA · Yeasir | Publish (§9). |

Steps 1–3 are why this can't be left until the project is finished: a video made only from the end state is an "after" video. If a before clip is ever missing, rebuild the starting state from `setup/` on a reset site and record it there. Never stage it on the finished site.

`capture/` and `post/` are committed on the demo's branch and reviewed in its PR like the rest of the demo.

---

## 4. Capture — during the build

Capture is scripted, not recorded by hand. Playwright drives the demo site and records only the page, so there are no tabs, bookmarks or notifications to leak, and any clip can be re-shot by running the script again.

| Captured | How |
|---|---|
| **Before clips** | One short clip per item on the shoot list, recorded before any build work. Before numbers (Lighthouse) go into `qa.md` straight away, and the reports are kept. |
| **After clips** | The same script, run again on the finished site. |
| **QA run** | The test order going through on desktop · the scoped items at 360, 390 and 768 px · after-Lighthouse. |
| **Everything else** | Not captured. The brief, questions, plan, timeline, QA sheet and handoff are drawn as slides from the files at edit time. |

**What "before" and "after" are, by kind of demo**

| Demo | Before | After |
|---|---|---|
| Fix | The symptom, happening | The same steps, working |
| Feature or section | The page as it stands without it | The feature in use |
| Build from a design | The design the client supplied | The built page, same framing |
| Speed or tracking | The numbers, or the event missing | The numbers, or the event firing on a test order |
| Redesign | The dated old site that `setup/` builds | The new one |
| Full build | Posted in stages (demo plan §9); each stage gets its own video | — |

A design or reference shown on screen has to be ours to show: the brief's own mock-up or a free-licence design, never a real store.

Capture rules:

- **The view the brief is about.** Desktop by default, at 1280 px wide. Phone width (390 px) only when the problem is a mobile one. If the brief covers both, the clips are desktop and the phone check shows in the QA scene.
- **Framed, never whole.** A full desktop page is unreadable once it sits in a feed, on any screen. So each desktop clip frames the part of the page that matters, enlarged until the text meets §6: with 16 px site text that is about 540 px of page width at a time. A clip may open on a still of the whole page for about a second, with the framed part outlined, to show where we are; nothing the viewer has to read sits in that wide shot. A phone-width page keeps its full width, as a centred column.
- **Sharp.** Footage has at least as many pixels as the space it fills in the final frame; it is never scaled up. Playwright's built-in recorder can't deliver that: it records the page at its CSS size whatever the device scale, so anything enlarged comes out soft, and it compresses at a fixed low bitrate **[Cited]**. The toolkit takes timestamped screenshots of the framed part at two to three times device scale instead and assembles them at their real timing. In tests on 30 Sep this was sharp, at roughly 12–20 frames a second (§15).
- **Followable.** A visible tap marker, added by the capture script and never part of the deliverable, and about half a second between actions.
- **Clean.** Storefront only, unless the work lives in the admin. Baseline test customers and orders only; no real names, emails or addresses; a neutral admin display name. Sign-ins happen before recording starts, passwords come from the environment and never sit in a script, and Shopify's password page and preview bar stay out of frame.
- **Measured the same way twice.** Before and after numbers use the same settings: three runs each, the middle value reported, and the slide says what was measured ("Lighthouse, mobile, local site"). A time or score quoted on screen comes from a run with no capture going on, because capturing slows the page a little.
- **Honest.** The clip shows what the site does when the script runs. If a run fails, fix the site or the script — never the footage.
- **Kept.** Scripts are committed in `capture/`. Clips go to `media/raw/`, which git ignores, and then to the drive.

---

## 5. The script — seven scenes

`post/script.md` is one table: a row per scene with its seconds, what is on screen, the line in the bottom band, and the source file.

| # | Scene | Seconds (guide) | On screen | Proves | Source |
|---|---|---|---|---|---|
| 1 | The problem | 0–5 | The before clip, playing, with the problem line from the brief | It's their problem | the brief |
| 2 | The brief | 5–13 | Slide: who asked (anonymised), what they need, when it arrived, when it's needed | Context | the brief · `log.md` |
| 3 | Questions and plan | 13–25 | Slide: the two or three questions asked before starting, with the answers; then the plan in one line and the delivery date promised | Communication | the brief's Q&A · the plan |
| 4 | The hardest part | 25–45 | The cause in one sentence — or, for a build, the one decision that mattered — then the after clip | Competence, briefly | `handoff.md` |
| 5 | QA | 45–62 | The QA clip, then the checklist | No rework | `qa.md` |
| 6 | Handoff | 62–78 | The timeline, then what the agency receives | Turnaround; the promise kept | `log.md` · `handoff.md` |
| 7 | The flag and the close | 78–90 | What I'd flag to the client, then the end card | The agency looks good upstairs | `handoff.md` |

The brief's shoot list maps straight on: before → scene 1 · the plan → scene 3 · the hardest part solved → scene 4 · QA passing → scene 5 · the handoff → scene 6.

The first thing on screen is the problem itself — never a title card, a logo or a greeting. A scene with nothing real behind it is dropped and the video runs shorter: if no questions were asked, there is no questions slide. The handoff scene lists only what is actually in the folder. The QA scene says what was actually checked: a screen width is not a phone, and Playwright's WebKit is not Safari, so a device or browser is named only when `qa.md` records a check on it.

**Writing rules**

- First person, past tense, plain words. Times and numbers instead of adjectives.
- One idea per line in the bottom band: two lines at most, about twelve words.
- Readable at a glance: no more than 180 words on screen across the whole video, slides included, and every slide stays up for at least one second per three words, never under 2.5 seconds. If it doesn't fit, cut detail, not reading time.
- It reports a job; it doesn't teach. No "how to", no tips, no lessons.
- An expert's voice: no "excited", no "I'd love to", no "available for work", no claims about what agencies do or don't do.
- The first line of the video and the first line of the post are the same sentence.
- The close is always the approved ask, currently **"When the next one lands, message me."** Never a new one.

**Example** — invented values, to show the shape only:

| # | Sec | On screen | Line in the bottom band | Source |
|---|---|---|---|---|
| 1 | 0–5 | Before clip, desktop: a still of the whole checkout with the order summary outlined, then the summary up close as a coupon is applied and the spinner keeps turning | Checkout spins forever when a coupon is applied. | brief |
| 2 | 5–13 | Slide: *Brief received Mon 10:04 · A marketing agency, for a skincare brand on WooCommerce · Needed by Wed, end of day* | The brief. | brief · `log.md` |
| 3 | 13–25 | Slide: *Every coupon, or only some? — Every coupon. · What changed last week? — One plugin update. · Answered Mon 14:10.* Then: *Plan approved Mon 15:00 · Delivery promised Wed, end of day* | Two questions before touching anything. | brief Q&A · plan · `log.md` |
| 4 | 25–45 | Slide: *Two scripts were refreshing the order total at the same time.* Then the after clip: same framing, same steps, the coupon applies | One fix, in a small plugin. Nothing else on checkout changed. | `handoff.md` |
| 5 | 45–62 | QA clip: a test order placed with a coupon. Then: *Desktop and 360 · 390 · 768 px · Chrome, Safari, Firefox · Lighthouse mobile 71 before, 74 after · Tracking still fires* | Checked before the agency sees it. | `qa.md` |
| 6 | 62–78 | Timeline: *Brief Mon 10:04 → Questions answered Mon 14:10 → Staging Tue 18:30 → QA passed Wed 11:00 → Handed over Wed 15:10.* Then: *Staging link · Handover note · Rollback note* | Promised Wednesday, end of day. Delivered Wednesday 15:10. | `log.md` · `handoff.md` |
| 7 | 78–90 | Slide: *What I'd flag to the client: coupons failed for a week. Worth checking that week's abandoned carts.* Then the end card | When the next one lands, message me. | `handoff.md` |

---

## 6. The edit

| | |
|---|---|
| **Canvas** | 1080 × 1080, square. It shows in full on desktop and mobile, and it sits inside LinkedIn's video-ad limits, so the post can be sponsored later without a re-cut **[Cited]**. Never vertical (§1). |
| **Length** | 60–90 seconds. Shorter if a scene was dropped; never longer. |
| **File** | MP4 · H.264 · 30 fps · AAC audio (a silent track when there is no voice-over) · under 200 MB |
| **Layout** | Top strip: the label, alone. Middle: footage or slide. Bottom band: the line. The line never sits on top of the footage. Desktop footage fills the middle from edge to edge; phone footage sits as a centred column. |
| **Look** | The pervej.com palette — navy `#0F172A`, white, pale grey `#F1F5F9`, and teal `#06C5BE` as the single accent for markers and outlines, never for text. One typeface: the site's (IBM Plex Sans unless the site shipped with another), bundled with the toolkit. Sentence case, no all-caps. |
| **Text sizes on the 1080 canvas** | Bottom-band line ≥ 48 px · slide text ≥ 36 px · label ≥ 30 px · site text inside footage ≥ 32 px: zoom in until it is, or cut the shot. A phone shows this canvas at about a third of its size, the smallest it will be seen; these minimums keep it readable there, and so on desktop too. |
| **Sound** | None by default. With a voice-over (§10): the voice and nothing else. |
| **First frame and cover** | The first frame is complete and readable: the before clip with the problem line in the band below it. The cover image is exported on its own: the zoomed frame where the problem is plain to see. |
| **End card** | 3–4 seconds: the closing line · Yeasir Pervej · Senior WooCommerce and Shopify developer · pervej.com · the label |

Editing rules:

- Cuts only. No transitions, animation, stickers, emoji or stock anything.
- Nothing sits unchanged for more than about five seconds, and no scene runs past 20 seconds. A slide with several rows shows them one at a time, each by a cut.
- One highlight at a time: a teal outline or a zoom on the thing the line describes.
- Before and after share the same framing and are marked "Before" and "After".
- Numbers appear exactly as they are in the files. No rounding up.
- Waiting time is cut, except where the wait is the point (§2).
- No code on screen. The cause is one sentence.

---

## 7. The post copy

`post/copy.md` holds the post text, plus two alternative first lines for Yeasir to choose from.

| Part | Rule |
|---|---|
| **Line 1** | The problem line from the brief, the same sentence that opens the video. 80 characters at most. |
| **Line 2** | The label, in full. LinkedIn recommends 150 characters of introductory text for video ads **[Cited]**; with lines 1 and 2 inside that, both should show before "see more". |
| **Body** | Four to six short lines: what I asked first · what was promised · when it was delivered · what QA covered · what I'd flag. |
| **Close** | The approved ask, word for word as in the video. |
| **Link** | `pervej.com` on its own last line. The link has to be in the post itself: nothing can be added if the post is sponsored later **[Cited]**. |

Rules: 80–130 words · plain text, short lines · no emoji, no hashtags, no tagging · the same voice and banned words as the script · every fact matches the video and the files · no asking for likes, comments or "watch to the end".

**Example** — same invented demo:

```
Checkout spins forever when a coupon is applied.
Practice build from a public job brief. Anonymised.

The brief landed Monday at 10:04, needed by Wednesday.

Before touching anything I asked two questions: does it fail with every coupon, and what changed last week?

The cause: two scripts refreshing the order total at once. One small fix, nothing else on checkout touched.

Then a real test order with a coupon, four screen sizes, three browsers, speed before and after.

Promised Wednesday, end of day. Handed over Wednesday 15:10, with a rollback note.

What I'd flag to the client: coupons failed for a week. That week's abandoned carts are worth a look.

When the next one lands, message me.

pervej.com
```

---

## 8. Approvals and self-check

**Approval 1 — the words.** Yeasir reads `script.md` and `copy.md`, picks the first line, and edits or approves. Nothing renders before this. Any later change to the words comes back here.

**Approval 2 — the cut.** Yeasir watches the video once at phone size with the sound off — on a phone, or in a window shrunk to about 400 px wide. Phone size is the harder test: what reads there reads in the desktop feed. If it can't be followed that way, it isn't done. The contact sheets (a frame every second) are there for a faster scan.

Before each approval Claude Code runs the self-check and writes the result to `post/check.md`. A fail is fixed or reported — never waved through.

| Check | Passes when |
|---|---|
| Label | It is on every frame of the contact sheets and is line 2 of the copy |
| Sources | Every time, number and quote in the script matches its source file exactly |
| Timeline | The times on screen are the times in `log.md`, unconverted; the promised date is the one in the plan |
| Banned words | None of the §2 words in the script, the copy or any slide |
| Leaks | Every frame of the contact sheets has been looked at: no terminal, editor, file path, username, password page, real name or email, and no product blamed for the fault |
| Before and after | Both came from the same capture script, in the same view and framing; speed clips are uncut and at real speed |
| View | Clips are desktop unless the brief's problem is a mobile one, and every desktop clip is framed on a part of the page |
| Legibility | Text sizes meet §6; no footage is scaled up |
| Spec | 1080 × 1080 · no longer than 90 s · MP4, H.264, 30 fps · audio track present · under 200 MB · cover under 2 MB · first frame readable |
| Word counts | No more than 180 words on screen · copy 80–130 · lines 1 and 2 of the copy under 150 characters together |

---

## 9. Publishing

| Step | Who | Detail |
|---|---|---|
| **When** | — | Thursday of the week after the build, at the start of the live window (7 PM Dhaka), so comments are answered while the post is fresh |
| **Upload** | VA | From a desktop browser, as a native video — never a YouTube link. One video, nothing else attached, so the post stays eligible for sponsoring later **[Cited]**. |
| **Settings** | VA | Set the cover image as the thumbnail if the upload screen offers it. Leave the auto-captions toggle **[Cited]** off and upload no caption file: the lines are already in the picture. |
| **Text** | VA | Paste the approved copy exactly. It has to be right when it goes out: a sponsored post can't have a link, headline or button added, and only the author can edit it **[Cited]**. |
| **Check** | VA | Before posting, preview on desktop and on a phone: first frame readable, label visible, link present |
| **Reply** | Yeasir | Every comment, himself. The VA never replies. |
| **Record** | Yeasir | Post URL and date into the demo's `log.md` (it can ride in the next PR) |
| **Read** | Yeasir | After seven days, in the Sunday scorecard: who reacted and commented. Count agency-side people, not totals, and any `saw_posts` = Y. |

---

## 10. Voice-over (optional)

The video ships silent, so publishing never waits on a recording. For any video that will be pinned, featured or sponsored, Yeasir adds his own voice — about ten minutes:

1. Claude Code adds a *Spoken* column to `script.md`: one natural sentence per scene, same facts, 160 words at most. Yeasir approves it.
2. Yeasir plays the approved cut and reads the column in one take, with a one-second pause between scenes. A phone voice memo in a quiet room is enough. Saved as `media/voice/<id>-vo.m4a`.
3. Claude Code splits the take at the pauses, fits each part to its scene, evens out the loudness, keeps the on-screen lines, and re-runs the self-check. Approval 2 again.

Never a synthetic or cloned voice. A real voice shows that communication will be easy; a generated one shows the opposite.

---

## 11. Files, setup, and what to say to Claude Code

```
<platform>/<id>/
  capture/        Playwright capture scripts — committed
  post/
    script.md     the seven scenes — Approval 1
    copy.md       the LinkedIn post text + two alternative first lines — Approval 1
    check.md      self-check results
  media/          git-ignored; copied to the drive as recordings/<platform>/<id>/
    raw/          <id>-before-* · <id>-after-* · <id>-qa-* · Lighthouse reports
    voice/        optional voice-over take
    final/        <id>-linkedin.mp4 · <id>-cover.png · <id>-contact-*.png
                  <id>-timeline.png · <id>-copy.txt
```

`final/` is everything the VA needs in one place: the video, the cover, and the approved copy as plain text. `<id>-timeline.png` is the timeline scene as a still — the alternative Thursday post from the proof strategy, at no extra work.

**One-time setup, before demo 1.** Claude Code builds a small toolkit in `_tools/video/`: shared capture helpers, slide templates in the look of §6, a render command, a check command for §8, and a README that lists what must be installed (Node, Playwright's browsers, ffmpeg) with one command that confirms it. Slides are small HTML pages photographed by Playwright, so Playwright and ffmpeg do everything. The render reads the approved `script.md` itself, so what was approved is what gets rendered. Free, openly licensed tools only. It is code like any other: reviewed line by line, merged by Yeasir.

**Add to the repo's `CLAUDE.md`:**

> Every demo follows `pervej-demo-video-guideline-v1.md`. No build work starts before the before-clips exist. Log times come from the system clock at the moment they happen. Never render a video from an unapproved script.

**What to say to Claude Code**

| Moment | Say |
|---|---|
| Once, before demo 1 | "Build the video toolkit in `_tools/video/` per the video guideline §11. Open a PR." |
| Starting a demo, with the brief | "Record the before clips per the video guideline before you change anything." |
| After handoff | "Make the video package for `<id>` per the video guideline. Stop at Approval 1." |
| Words approved | "Script and copy approved. Render, run the self-check, stop at Approval 2." |
| Voice wanted | "Add the Spoken column for `<id>`." Then, once recorded: "The voice-over is in `media/voice/`. Fit it and stop at Approval 2." |

---

## 12. Done =

`script.md` and `copy.md` approved · `check.md` all passed · video, cover, contact sheets and copy in `media/final/` and on the drive · cut approved at phone size · post published and its URL in `log.md`. **Missing any one: not done.**

---

## 13. What this changes elsewhere

| Where | Was | Now |
|---|---|---|
| Runbook v1.1 — the step where the log and footage notes come back to chat (step 8) | Claude drafts the video script and captions in project chat | Claude Code drafts the video script and post copy from the repo files. Project chat keeps the feed, the shortlist, the brief and the client's answers. The carousel stays where it is. |
| Demo plan §2 (roles) | Asad records raw footage; the VA edits and captions | Claude Code captures and renders; the VA files by ID and publishes. |
| Demo plan §7 step 4 and §8.1 | OBS runs throughout; shots 2, 3 and 5 are OBS recordings | Shots 1 and 4 are scripted captures and shot 3 is the after clip from the same script. The plan, questions and handoff (shots 2 and 5) become slides drawn from the files. No OBS for this video. |
| Demo plan §7 step 8, §8.2 and §11 | `shots.md` lists the raw files | Not needed: the file names say what each clip shows. |
| Demo plan §8.3 | The VA edits; a 3–5 minute walkthrough plus a 60–90 second cut | Claude Code renders the 60–90 second video; the VA publishes. The 3–5 minute walkthrough is parked. |
| Demo plan §5 | `post/captions.md` | `post/copy.md` holds the post text; the on-screen lines live in `post/script.md`. New folders: `capture/` and `media/`. |
| Proof strategy §4.3 | Screen recording with voice, captions on | Silent first, lines on screen, own voice optional. Effort is never totalled on screen. |
| Checklist 6.2 and 6.3 | Templates once; a screen recorder set up | The templates are the toolkit. No screen recorder is needed for this video. |

**Not changed:** the 2-minute walkthrough in the brief's deliverables — the one the agency would receive at handoff. It is part of the build and is made as the demo plan says. Scene 6 lists it only if it exists.

The other files are not edited yet. Update them when this one is locked after the pilot.

---

## 14. Pilot checks and parked items

The first video is the pilot. Judge these, then lock v1.2:

1. **Sharpness and smoothness.** Is every word crisp, in the desktop feed and on a phone, and does movement look natural at the frame rate the capture reaches? If not, the capture method changes (§4); the rules here don't.
2. **Framing.** Does the zoomed desktop footage still feel like the real site, or does it need the wide still more often?
3. **Pace.** Do seven scenes fit in 90 seconds without rushing the reader, or does one have to go?
4. **The fold.** Does the label show before "see more", on desktop and on a phone?
5. **The label.** Does the strip read as honest, or as heavy?
6. **Your time.** Target: under 30 minutes per video across both approvals.

Until pervej.com is live, the link line and the end-card URL are left out.

**Open:** who makes the 2-minute handoff walkthrough now that the rest of the footage is scripted. The toolkit could cut it from the after and QA clips. Decide after the pilot.

| Parked | Revisit when |
|---|---|
| A 4:5 cut | After four videos, and only if views are overwhelmingly mobile. Square is the safe default: 4:5 gets side bars on desktop, and vertical ads may be served to mobile only **[Cited]** |
| The Tuesday carousel from the same slides | After the pilot |
| The 3–5 minute walkthrough | When a prospect asks for one, or for the site |
| Videos embedded on pervej.com | After build log #1 is posted |

---

## 15. Sources

| Claim | Source |
|---|---|
| Limits a sponsorable video must meet: MP4 · 3 seconds to 30 minutes · 75 KB to 500 MB · 360–1920 px per side · square up to 1920 × 1920 · 30 fps recommended · AAC audio · thumbnail JPG or PNG up to 2 MB, matching the video · 150 characters of introductory text recommended. The 200 MB cap in §6 is ours: well inside the limit, and the figure several guides still quote. | LinkedIn Marketing Solutions — Video Ads specs · business.linkedin.com/advertise/ads/sponsored-content/video-ads/specs |
| Thought Leader Ads: one image or one video; no headline, URL or button can be added; only the author can edit the post; posts with a video are sent to the same video specification | LinkedIn Marketing Solutions — Thought Leader Ads specs · business.linkedin.com/advertise/ads/sponsored-content/thought-leader-ads/specs |
| Square shows in full on desktop and mobile; vertical video is shown small on desktop, with bars or empty space at the sides | Brandwatch — LinkedIn video specs · brandwatch.com/blog/linkedin-video-specs · Captions — LinkedIn video specs · captions.ai/blog-post/linkedin-video-specs |
| Phones carry between just over half and about three-quarters of LinkedIn viewing — third-party estimates that disagree with each other, all-user averages, none of them LinkedIn's own figure | SQ Magazine — LinkedIn mobile vs desktop statistics · sqmagazine.co.uk/linkedin-mobile-vs-desktop-statistics.md · GrowthSpree — 4:5 vertical vs square on LinkedIn · growthspreeofficial.com/blogs/linkedin-ads-4-5-vertical-vs-square-b2b-saas-2026 |
| Vertical video ads served to mobile only — a third-party report, not confirmed on LinkedIn's own pages | QuickFrame — LinkedIn video ad specs · quickframe.mountain.com/blog/linkedin-video-ad-specs |
| Feed video autoplays muted | ContentIn — video post glossary · contentin.io/glossary/video-post |
| Desktop upload offers an auto-captions toggle and SRT upload | Utah State University — LinkedIn accessibility guide · usu.edu/accessibility/social-media/linkedin.php |
| Playwright's Chromium recording runs at a fixed 1 Mbit/s with no quality setting — as reported in an open feature request | Playwright issue #31424 · github.com/microsoft/playwright/issues/31424 |
| Playwright's recorder ignores device scale: a 390 × 700 page at device scale 3 still records at 390 × 700, and a part of a desktop recording enlarged to fill the frame is visibly softer than a screenshot. Screenshots at device scale 2–3 are sharp and come at about 12–20 frames a second (a 540 × 405 part of a 1280 px desktop page: about 19 at scale 2, 14 at scale 3). They assemble with ffmpeg into a 1080 × 1080 H.264 MP4 at their real timing | Own tests, 30 Sep 2026 — Playwright 1.56, headless Chromium, test pages at 390 × 700 and 1280 × 800. The frame rate will differ by machine. |

---

## 16. Changelog

- **v1.1 — 30 Sep 2026.** Capture is desktop-first: clips show the view the brief is about (desktop by default, phone width only for a mobile problem), framed on the part of the page that matters, with an optional wide still to open. Square kept and vertical ruled out, with the reason in §1. Examples reworked to a desktop problem; capture re-tested at desktop width; pilot checks updated.
- **v1.0 — 30 Sep 2026.** First version, written before demo 1. One output per demo: a 60–90 second square LinkedIn video and its post copy, produced by Claude Code from the demo's own files. Scripted capture during the build; seven-scene script; silent first with an optional voice-over by Yeasir; two approvals and a self-check; publishing steps; one-time toolkit; changes to the runbook and demo plan listed in §13. Pilot on the first video, then lock.
