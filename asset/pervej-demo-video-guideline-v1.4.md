# Pervej.com — Demo Video Guideline: the brief → three LinkedIn posts, in one run

**v1.4 · Fri 9 Oct 2026 · Owner: Yeasir Pervej · Status: pilot — lock after the first demo's three posts**
Reads with: `pervej-demo-project-plan-v1.md` (rules, QA — the source of truth) · `pervej-demo-cycle-runbook-v1.md` v1.1 · `pervej-proof-content-ad-strategy-v1.md`
**Lives in:** `asset/` in both demo repos (pervej-woo and pervej-shopify, byte for byte the same), where Claude Code follows it, and in the Project. **Shareable with:** Asad and the VA. No pricing, pipeline or Upwork data in this file.
**Precedence:** on how the three demo posts (the video, the carousel and the insight post) and their copy get made, this file replaces what the demo plan, the runbook and the proof strategy say; §13 lists every difference. It never loosens a rule in the demo plan's §1.1.
**Who reads what:** Yeasir — §1, §3, §8, §9, §11 · the VA — §9 · Claude Code — all of it.

One question, answered simply: **Yeasir hands Claude Code a brief — how does it come back as a finished demo and three LinkedIn posts (the video, a carousel made from it, and an insight post), checked, audited and ready to publish, with nobody in the loop until the final go.**

Platform facts marked **[Cited]** are sourced in §15. They change, so re-check them whenever this file is reviewed.

---

## 1. What the posts are for

The demos exist to get Yeasir recognised by the people who might hire him. So every demo becomes three LinkedIn posts. Each has one job, and each makes sense to someone who never saw the other two.

| Post | Its job | Format | Goes out (§9) | Sponsorable later |
|---|---|---|---|---|
| **The video** | Proves the work: problem to handoff, with real times | 60–90 s square native video, voiced (§5, §6) | Tuesday of the week after the build | Yes |
| **The carousel** | Reaches people who scroll past video; the same story, read at their own pace | 8–10 square pages, one PDF (§7a) | Thursday, two days later | No: a post with a document can't be sponsored **[Cited]** |
| **The insight post** | Shows he understands their business: what the demo means for a store or an agency, not how it was built | One square image and text (§7b) | The following Monday | Yes |

All three come from the same demo folder and the same checked words. Nothing in the carousel is new; the insight post adds only a point of view, and at most one sourced outside figure (§7b).

### The video

One video per demo. 60–90 seconds, square, uploaded natively, and made to be understood with the sound off, because feed video autoplays muted **[Cited]**. With the sound on, Yeasir's own voice tells the same story over a quiet music bed (§10).

**Made for both screens.** The working assumption is that prospects mostly watch at their desks. Phones can't be ignored, though: estimates put between just over half and about three-quarters of all LinkedIn viewing there **[Cited]**. So the video is square, which plays in full on both, and never vertical: that is a phone format, and desktop LinkedIn shows it small, with empty space at the sides **[Cited]**.

The viewer is an agency owner or operations lead scrolling the feed. They don't doubt that a developer can fix a checkout. They fear three things, and each one gets its own evidence on screen:

| Their fear | What the video shows | Taken from |
|---|---|---|
| Slow turnaround | What was promised and when it was delivered, in real timestamps | the plan · `log.md` |
| Work that comes back needing redoing | The test order, the screen-size and browser checks, speed before and after | `qa.md` + the QA recording |
| Silence and unclear communication | The questions asked before starting, and what the agency receives at handoff | the brief's Q&A · `handoff.md` |

The format is an **evidence reel**: every frame shows either the real demo site or words and numbers taken from the demo's own files. It is not a tutorial, not a feature showcase, not an "after" video and not an advert.

**The files it draws on.** If the repo names one differently, the role is what matters.

| File | What the posts take from it |
|---|---|
| The brief | The client's ask in their words, the deadline, the shoot list, and the questions and answers with their times (kept in the brief file, or in `questions.md`) |
| The plan (`spec.md`) | What was promised: the work in one line and the delivery date |
| `log.md` | Every time shown on screen |
| `qa.md` | What was checked, the results, the before and after numbers |
| `handoff.md` | What changed, what the agency receives, the rollback note, what I'd flag to the client |

---

## 2. Rules

These sit on top of the demo plan's §1.1. None of them bends, and they apply to all three posts.

| Rule | Detail |
|---|---|
| **The label, always** | *"Practice build from a public job brief. Anonymised."* on every frame of the video and every page of the carousel, on the insight image whenever it shows anything from the demo, and in the copy of all three posts: line 2 of the video and carousel copy, and the line straight after the demo is mentioned in the insight copy (§7b). |
| **Nothing invented** | Every time, number and quote in the three posts is copied from a file in the demo folder, and the script, `carousel.md` or `insight.md` names that file. A scene or page with no real material is dropped, never filled: no question is written after the fact, no check is listed that wasn't run. The one outside fact allowed is a single sourced figure in the insight post, under §7b's rule. |
| **One script shoots before and after** | The same capture script records the starting state and the finished state: same steps, same framing. |
| **Real speed where speed is the claim** | Loading and checkout clips play uncut at real speed. Anything else that is sped up carries a visible "×2" mark. |
| **The promise kept, not the hours** | Show the delivery date promised and the time delivered. The times are the real ones from the log; effort is never totalled or headlined ("fixed in 40 minutes", hours spent). If the promise was missed, the posts say so or the demo isn't published. |
| **A kind of cause, not a product** | The problem was recreated on our own site. Naming the stack the demo really runs on (WooCommerce, Shopify, the theme) is fine; blaming a named plugin, theme, app or company for a fault we planted is not. |
| **The tools stay off screen** | No terminal, editor, prompts, file paths or usernames in frame, and nothing about how the code was produced (demo plan §1.1). In all three posts: no generated images, no stock footage or photos. |
| **One voice, one bed** | The voice is Yeasir's own, read from the checked Spoken words by his ElevenLabs voice clone (§10). Under it: one calm music bed, a soft click on each recorded click, quiet typing under typed text, all from the toolkit's library. Nothing else: no whooshes, pops, dings or other music. |
| **Everything local** | Capture and QA run on the local site, in the toolkit's browser or Claude's built-in browser: no tunnel, proxy, live URL or mail server, and nothing installed beyond the toolkit. Emails are read in the Email Log plugin; phone widths are emulated, Chrome only, and `qa.md` says so. Shopify has no local store: a Shopify demo is built, captured and checked on the person's own development store, on its unpublished before and after themes, behind the storefront password and never published. Its order emails are not checked: Shopify sends them, not the theme. |
| **Words that never appear** | In any of the three posts: "case study" · anything that presents the demo as paid work ("my client", "a recent project") · the name of any freelance marketplace (Upwork, Fiverr and the like) · prices, "free", terms, NDA, logins · AI, Claude or any AI tool · results that weren't measured. "The client" may only mean the client in the brief. |
| **Each post stands alone** | Each of the three makes sense to someone who saw neither of the others: no "as you saw in the video", no "part 2". The three posts' first lines are three different sentences. |
| **Nothing is posted without the audit and the go** | An independent audit passes every row of §8, then Yeasir gives one final go. The VA posts nothing before it. |

---

## 3. The flow — one run

Yeasir (or Asad) hands Claude Code the brief with one line (§11). From there Claude Code runs the whole demo and the post package without stopping, and the next thing anyone sees is a finished, audited package waiting for the go.

| # | When | Who | What |
|---|---|---|---|
| 1 | Brief received; setup done, starting state confirmed — off the clock | Claude Code | Write the capture script from the brief's shoot list. Record the **before** clips and numbers (§4). No build work starts until they exist. |
| 2 | Through the build | Claude Code | Plan, build, QA and hand off per the demo plan, without waiting for a plan approval or a delivery acceptance (§13). Write each `log.md` time from the system clock at the moment it happens. A missed time is taken from a record that has it (a commit, a file's own timestamp) or left blank. It is never estimated. |
| 3 | Build done, QA passing | Claude Code | Re-run the same capture script for the **after** clips. Record the QA run. |
| 4 | Handoff written | Claude Code | Go straight on to the post package; nobody has to ask for it. Draft `post/script.md` (with the Spoken column), `post/copy.md`, `post/carousel.md` and `post/insight.md`, and check the words (§8) before anything is voiced. |
| 5 | Words pass | Claude Code | Make the voice; render the video, cover and contact sheets, the carousel PDF and the insight image; run the full self-check and fix every fail. |
| 6 | Self-check passes | A separate reviewer | **The audit** (§8): a fresh reviewer that never saw the build or the drafting checks every row against the files and the rendered media. Claude Code fixes what it finds; a fresh reviewer checks again. |
| 7 | Audit passes | Claude Code | Copies `media/` to the drive (`node tools/video/drive.mjs <id>`, into the folder each machine names as `PERVEJ_DRIVE_DIR`; if none is set, the message says the package is still in `media/final/`) and sends Yeasir one short message: the demo ID, where the package is, the audit result, and any decision he should know about. |
| 8 | Ready | Yeasir | **The go** (§8): about five minutes at phone size. Go, or a note. |
| 9 | After the go | VA | Publish (§9): the video on Tuesday, the carousel on Thursday, the insight post the following Monday. |

**Ask only when blocked.** Claude Code stops for one of these and nothing else: a real ambiguity in the brief that changes what gets built (it goes to the project chat, where Claude answers as the client — runbook §5); something the run can't do on its own (a sign-in, a missing asset, a tool that won't install); or an audit that still fails after two rounds of fixes. Anything else — a wording choice, a framing, a slide that runs long — it decides, records the decision in `post/check.md`, and moves on. When it does stop, it asks one question, says what it needs, and carries on with whatever doesn't depend on the answer.

Steps 1–3 are why this can't be left until the project is finished: a video made only from the end state is an "after" video. If a before clip is ever missing, rebuild the starting state from `setup/` on a reset site and record it there. Never stage it on the finished site.

`capture/` and `post/` are committed on the demo's branch and reviewed in its PR like the rest of the demo.

---

## 4. Capture — during the build

Capture is scripted, not recorded by hand. Playwright drives the demo site and records only the page, so there are no tabs, bookmarks or notifications to leak, and any clip can be re-shot by running the script again.

| Captured | How |
|---|---|
| **Before clips** | One short clip per item on the shoot list, recorded before any build work. Before numbers (Lighthouse) go into `qa.md` straight away, and the reports are kept. |
| **After clips** | The same script, run again on the finished site. |
| **QA run** | The test order going through on desktop · the scoped items at 360, 390 and 768 px, emulated (the toolkit opens every width under 768 px as a phone: touch, mobile user agent) · after-Lighthouse. The order emails, read in Email Log, as stills (Shopify: no email stills). |
| **Everything else** | Not captured. The brief, questions, plan, timeline, QA sheet and handoff are drawn as slides from the files at edit time. |

**What "before" and "after" are, by kind of demo**

| Demo | Before | After |
|---|---|---|
| Fix | The symptom, happening | The same steps, working |
| Feature or section | The page as it stands without it | The feature in use |
| Build from a design | The design the client supplied | The built page, same framing |
| Speed or tracking | The numbers, or the event missing | The numbers, or the event firing on a test order |
| Redesign | The dated old site that `setup/` builds | The new one |
| Full build | Posted in stages (demo plan §9); each stage gets its own three posts | — |

A design or reference shown on screen has to be ours to show: the brief's own mock-up or a free-licence design, never a real store.

Capture rules:

- **The view the brief is about.** Desktop by default, at 1280 px wide. Phone width (390 px) only when the problem is a mobile one. If the brief covers both, the clips are desktop and the phone check shows in the QA scene.
- **Framed, never whole.** A full desktop page is unreadable once it sits in a feed, on any screen. So each desktop clip frames the part of the page that matters, enlarged until the text meets §6: with 16 px site text that is about 540 px of page width at a time. A clip may open on a still of the whole page for about a second, with the framed part outlined, to show where we are; nothing the viewer has to read sits in that wide shot. A phone-width page keeps its full width, as a centred column.
- **Sharp.** Footage has at least as many pixels as the space it fills in the final frame; it is never scaled up. Playwright's built-in recorder can't deliver that: it records the page at its CSS size whatever the device scale, so anything enlarged comes out soft, and it compresses at a fixed low bitrate **[Cited]**. The toolkit takes timestamped screenshots of the framed part at two to three times device scale instead and assembles them at their real timing. In tests on 30 Sep this was sharp, at roughly 12–20 frames a second (§15). The same screenshots are the stills the carousel and the insight image use.
- **Followable.** A visible tap marker, added by the capture script and never part of the deliverable, and about half a second between actions. The capture logs the time of every click and typed stretch; the render puts a soft click and quiet typing there.
- **Clean.** Storefront only, unless the work lives in the admin. Baseline test customers and orders only; no real names, emails or addresses; a neutral admin display name. Sign-ins happen before recording starts, passwords come from the environment and never sit in a script, and Shopify's password page and preview bar stay out of frame.
- **Measured the same way twice.** Before and after numbers use the same settings: three runs each, the middle value reported, and the slide says what was measured ("Lighthouse, mobile, local site"; Shopify: "Lighthouse, mobile, dev store preview"). A time or score quoted on screen comes from a run with no capture going on, because capturing slows the page a little.
- **Honest.** The clip shows what the site does when the script runs. If a run fails, fix the site or the script — never the footage.
- **Kept.** Scripts are committed in `capture/`. Clips go to `media/raw/`, which git ignores, and then to the drive.

---

## 5. The script — seven scenes

`post/script.md` is one table: a row per scene with its seconds, what is on screen, the line in the bottom band, what the voice says (the **Spoken** column, §10), and the source file.

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
- The first line of the video and the first line of the video's post are the same sentence.
- The close is always the approved ask, currently **"When the next one lands, message me."** Never a new one.

**Spoken words** (the voice, §10)

- One or two natural sentences per scene, the same facts as the screen, never a fact the screen and the files don't carry. At most 160 words across the video; a scene may say nothing ("—").
- Said, not read out: the voice tells, the screen shows. It never reads the label, a list or a slide row by row.
- Times in words ("Monday morning", "that afternoon"); the exact time stays on screen. A voice reads "15:00" as "fifteen hundred". Numbers that are in the files may be said ("51 to 80").
- `...` for a pause, at most one per scene before the key words. No exclamation marks, no URLs.
- The same banned words and voice as the lines (§2, §5): first person, past tense, plain.
- The last scene ends on the approved ask, word for word.

**Example** — invented values, to show the shape only:

| # | Sec | On screen | Line in the bottom band | Spoken | Source |
|---|---|---|---|---|---|
| 1 | 0–5 | Before clip, desktop: a still of the whole checkout with the order summary outlined, then the summary up close as a coupon is applied and the spinner keeps turning | Checkout spins forever when a coupon is applied. | Checkout spun forever whenever a coupon was applied. | brief |
| 2 | 5–13 | Slide: *Brief received Mon 10:04 · A marketing agency, for a skincare brand on WooCommerce · Needed by Wed, end of day* | The brief. | The brief came in on Monday morning, from an agency, needed by the end of Wednesday. | brief · `log.md` |
| 3 | 13–25 | Slide: *Every coupon, or only some? — Every coupon. · What changed last week? — One plugin update. · Answered Mon 14:10.* Then: *Delivery promised Wed, end of day* | Two questions before touching anything. | Before touching anything, I asked two questions... and promised delivery by the end of Wednesday. | brief Q&A · plan · `log.md` |
| 4 | 25–45 | Slide: *Two scripts were refreshing the order total at the same time.* Then the after clip: same framing, same steps, the coupon applies | One fix, in a small plugin. Nothing else on checkout changed. | Two scripts were refreshing the order total at once. One small fix, and nothing else on checkout changed. | `handoff.md` |
| 5 | 45–62 | QA clip: a test order placed with a coupon. Then: *Desktop and 360 · 390 · 768 px, emulated · Lighthouse mobile 71 before, 74 after · Tracking still fires* | Checked before the agency sees it. | Then a real test order with a coupon, every screen size, and the speed before and after. | `qa.md` |
| 6 | 62–78 | Timeline: *Brief Mon 10:04 → Questions answered Mon 14:10 → Staging Tue 18:30 → QA passed Wed 11:00 → Handed over Wed 15:10.* Then: *Staging link · Handover note · Rollback note* | Promised Wednesday, end of day. Delivered Wednesday 15:10. | Promised for the end of Wednesday... handed over that afternoon, with a rollback note. | `log.md` · `handoff.md` |
| 7 | 78–90 | Slide: *What I'd flag to the client: coupons failed for a week. Worth checking that week's abandoned carts.* Then the end card | When the next one lands, message me. | One thing worth flagging: coupons failed for a week. When the next one lands, message me. | `handoff.md` |

---

## 6. The edit

| | |
|---|---|
| **Canvas** | 1080 × 1080, square. It shows in full on desktop and mobile, and it sits inside LinkedIn's video-ad limits, so the post can be sponsored later without a re-cut **[Cited]**. Never vertical (§1). |
| **Length** | 60–90 seconds. Shorter if a scene was dropped; never longer. |
| **File** | MP4 · H.264 · 30 fps · AAC audio, 48 kHz stereo, −14 LUFS (±0.5), true peak ≤ −1 dBTP · under 200 MB |
| **Layout** | Top strip: the label, alone. Middle: footage or slide. Bottom band: the line. The line never sits on top of the footage. Desktop footage fills the middle from edge to edge; phone footage sits as a centred column. |
| **Look** | The pervej.com palette — navy `#0F172A`, white, pale grey `#F1F5F9`, and teal `#06C5BE` as the single accent for markers and outlines, never for text. One typeface: the site's (IBM Plex Sans unless the site shipped with another), bundled with the toolkit. Sentence case, no all-caps. The carousel and the insight image use the same look. |
| **Text sizes on the 1080 canvas** | Bottom-band line ≥ 48 px · slide text ≥ 36 px · label ≥ 30 px · site text inside footage ≥ 32 px: zoom in until it is, or cut the shot. A phone shows this canvas at about a third of its size, the smallest it will be seen; these minimums keep it readable there, and so on desktop too. |
| **Sound** | Yeasir's voice (§10), each scene's at its start; one calm music bed under the whole video, about 16 dB under the voice and ducked further while it speaks, faded in and out; a soft mouse click on every recorded click and quiet typing under typed text. Mixed by the render to −14 LUFS. The lines still carry everything with the sound off. |
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

## 7. The video's post copy

`post/copy.md` holds the video post's text, plus two alternative first lines Yeasir can swap in at the go. The carousel and the insight post have copy of their own (§7a, §7b).

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

Then a real test order with a coupon, desktop and three narrower widths, speed before and after.

Promised Wednesday, end of day. Handed over Wednesday 15:10, with a rollback note.

What I'd flag to the client: coupons failed for a week. That week's abandoned carts are worth a look.

When the next one lands, message me.

pervej.com
```

---

## 7a. The carousel

The same demo told as pages, for people who scroll past video and for anyone who wants to read at their own pace. It is a LinkedIn document post: one PDF that the feed shows page by page **[Cited]**. It stays organic: LinkedIn can't sponsor a post that carries a document **[Cited]**.

**Nothing new goes in.** Every page is drawn from the checked script and its source files, using the slide templates the video already uses and stills from the capture (§4). If a fact isn't in the video's files, it isn't in the carousel.

| | |
|---|---|
| **Pages** | 1080 × 1080, square: the video's own slide templates, so nothing is designed twice, and a square page shows in full in the desktop feed and on a phone (§1). 8 to 10 pages; fewer only when a page has nothing real behind it. |
| **File** | One PDF, every page the same size with no margins — LinkedIn needs one page size throughout **[Cited]** — under 10 MB (LinkedIn's limit is 100 MB and 300 pages **[Cited]**). |
| **Layout** | The video's three bands: the label alone in the top strip, the slide or still in the middle, the line in the bottom band. A page counter ("3/9") at the right of the top strip, at label size. |
| **Look and sizes** | §6's palette, typeface and text minimums, unchanged. At most 30 words on a page, the line included. |
| **Stills** | Frames from the capture, the same sharp, framed screenshots the video is built from: never re-shot, never scaled up. Before and after share the framing and are marked "Before" and "After". |

**The pages**

| # | Page | From |
|---|---|---|
| 1 | **Cover.** The before still, marked "Before", with the problem line from the brief in the band. Nothing else: no title card, logo or arrow | scene 1 · the brief |
| 2 | The brief: who asked (anonymised), what they need, when it arrived, when it's needed | scene 2 |
| 3 | The questions asked before starting, with the answers | scene 3 |
| 4 | The plan in one line and the delivery date promised | scene 3 |
| 5 | The cause in one sentence, or for a build the one decision that mattered | scene 4 |
| 6 | The after still, framed exactly like the cover, marked "After" | scene 4 |
| 7 | QA: what was checked, and the before and after numbers | scene 5 |
| 8 | The timeline, ending on promised against delivered | scene 6 |
| 9 | What the agency receives | scene 6 |
| 10 | What I'd flag to the client in the middle; the approved ask in the band; Yeasir Pervej · Senior WooCommerce and Shopify developer · pervej.com beneath it | scene 7 · end card |

A page drops out when its scene did: no questions asked, no questions page.

**The copy** — in `post/carousel.md`, under the pages table, with two alternative first lines and the document title.

| Part | Rule |
|---|---|
| **Line 1** | A different way into the same demo — the promise kept, or the question that mattered — never the video's first line. 80 characters at most. |
| **Line 2** | The label, in full. |
| **Body** | Two to four short lines: the problem in one sentence, and what the pages show. |
| **Close** | The approved ask, word for word. |
| **Link** | `pervej.com` on its own last line. |
| **Document title** | Typed in at upload; LinkedIn shows it with the document **[Cited]**. A short form of the problem line, under 60 characters. |

Rules: 40–90 words · the same voice, banned words and plain text as §7 · no "swipe", no asking for likes, comments or saves.

**Example** — same invented demo:

```
Promised Wednesday, end of day. Handed over Wednesday 15:10.
Practice build from a public job brief. Anonymised.

A coupon left checkout spinning forever.

The pages show the brief, the two questions I asked first, the plan, the fix, QA, the timeline and what I'd flag to the client.

When the next one lands, message me.

pervej.com
```

Document title: *Checkout spins when a coupon is applied*

---

## 7b. The insight post

The post that gets Yeasir recognised. The video and the carousel prove he can do the work; this one shows he understands what the work is for. It takes one thing the demo revealed and says what it means for a store's orders, a campaign's results or the agency's standing with its client, in his own voice, as an expert's observation. It is about their business, not the build.

**Where the point comes from**, first choice first:

1. What I'd flag to the client (`handoff.md`): the business consequence the demo already found.
2. A number or finding in `qa.md`: a speed change, an event that wasn't firing.
3. The cause (`handoff.md`), widened to the kind of problem it is ("plugin updates that touch checkout"), never a named product (§2).

| It is | It is not |
|---|---|
| One observation, what it costs or risks, and what Yeasir would check, in the first person ("I'd check…") | A tutorial: no "how to", no numbered tips, no "5 things", no lessons |
| About stores, checkouts, platforms, updates and campaigns | A claim about the reader: never "most agencies…" or "you probably…", nothing about what agencies do or don't do |
| Finished when the point is made | A pitch: no ask; the video and the carousel carry it |

**Facts.** Facts about the demo come from its files, like everything else. The demo is mentioned once, and the label follows that line, in full, on its own line. One outside figure is allowed, and only if Claude Code fetches it from its source while drafting: a platform's own documentation or a published study, named in the post in words ("Baymard's checkout research…"), with no link. `insight.md` records the source's name, the URL, the sentence the figure rests on and the date it was checked. A figure from memory, or one that can't be traced to its source, is dropped, and the post stands on the demo alone.

**The image** — one picture, made by the toolkit in the §6 look.

| | |
|---|---|
| **Canvas** | 1200 × 1200, square, PNG under 5 MB: LinkedIn's recommended size for a single image that shows on desktop and on phones, so the post can be sponsored as it is **[Cited]**. |
| **Layout** | **Still and line:** a framed still from the capture, the moment the point is about, with the insight line in the band below and the label in the top strip. **Or number and line:** one number from `qa.md` or the sourced figure, large, the insight line under it and a small source line ("Lighthouse, mobile, local site", or the outside source's name); the label strip whenever the number is from the demo. |
| **Words** | At most 20 on the image, not counting the label and the source line. |
| **Sizes on the 1200 canvas** | Insight line ≥ 60 px · a headline number ≥ 160 px · source line and label ≥ 34 px · site text inside a still ≥ 36 px |
| **Nothing else** | No generated images, stock photos, icons or illustrations: only the demo's own frames, numbers and words. |

**The copy** — in `post/insight.md`, with two alternative first lines, the image's words and layout, the alt text and any source.

| Part | Rule |
|---|---|
| **Line 1** | The point itself, as a plain statement. 80 characters at most. Never the problem line or the carousel's first line. |
| **Body** | Three to six short paragraphs: what the demo showed (the label on the next line), why it matters in orders, money or time, and what I'd check. |
| **Close** | Ends on the point. No ask. |
| **Link** | `pervej.com` on its own last line: it has to be in the post if the post is ever sponsored **[Cited]**. |
| **Alt text** | One plain sentence describing the image, for the upload screen. |

Rules: 100–180 words · plain text, short lines · no emoji, hashtags or tagging · no question to the reader, no asking for likes, comments or shares · no time words the publish date can make wrong ("last week", "yesterday") · the §2 banned words and voice.

**Example** — same invented demo. The image is a still and a line: the order summary with the spinner turning, and *"A broken coupon doesn't take a store down. It quietly loses orders."*

```
A broken checkout rarely looks like an outage. It looks like a slow week.

I recreated a coupon bug that left checkout spinning forever.
Practice build from a public job brief. Anonymised.

Nothing else looked wrong. The store stayed up, products loaded and every other page worked. The only symptom was the orders that never arrived: from shoppers holding a code, the people a promotion exists to bring in.

So the fix wasn't the end of it. What I'd flag to the client: coupons failed for a week, and that week's abandoned carts are worth a look before the next campaign goes out.

After any update that touches checkout, I'd place one test order with a coupon before calling it done.

pervej.com
```

---

## 8. Self-check, audit and the go

Three layers, in this order. None is skipped, and a fail is fixed or reported — never waved through.

**1 — The self-check (Claude Code).** Run twice: on the words before anything is voiced (the rows marked **W** below), then on everything once it is rendered. Results go in `post/check.md`, row by row, with every decision Claude Code made without asking (§3).

**2 — The audit (a separate reviewer).** A builder grading its own work misses its own mistakes, so the audit is done by a reviewer that has seen neither the build nor the drafting: a fresh Claude Code subagent given only this file, the demo folder and `media/final/`, never the build conversation. It checks every row below for itself — it reads the files and looks at the frames, pages and image rather than trusting `check.md`, and fetches an outside figure's URL again: if the sentence isn't there, the figure is dropped — and writes `post/audit.md`: each row passed or failed, with the evidence. Claude Code fixes the fails and a fresh reviewer audits again. If rows still fail after two rounds, Claude Code stops and tells Yeasir what is left.

**Hard stops.** Whatever else passes, a package with any of these is never handed over as ready: the label missing anywhere it belongs · a banned word (§2), above all a freelance marketplace's name or AI · a time, number or quote that isn't in the files · a leak in any frame, page or image · a missed promise the posts don't admit.

**3 — The go (Yeasir).** About five minutes, once per demo. He watches the video once at phone size with the sound off — on a phone, or in a window shrunk to about 400 px wide — and once with the sound on; flips through the carousel; looks at the insight image; reads the three copies. Phone size is the harder test: what reads there reads in the desktop feed. The contact sheets (a frame of the video every second, and every carousel page on one sheet) are there for a faster scan. Then he tells the VA "go", or gives Claude Code a note in plain words. A note is fixed (§10, §11), audited again, and comes back for the go. Each post's file holds two alternative first lines; swapping one in is a note like any other.

| Check | Passes when |
|---|---|
| Delivery | The before clip exists, every `qa.md` line passed, and `handoff.md` has the rollback note and the flag: everything the client would have checked at acceptance (demo plan §4.3) |
| Label | It is on every frame of the contact sheets and every carousel page, and on the insight image if the image shows the demo; it is line 2 of the video and carousel copy and the line after the demo is mentioned in the insight copy |
| Sources **W** | Every time, number and quote in the script, the Spoken words, the carousel and the insight post matches its source file exactly; an outside figure has its source, URL, sentence and date in `insight.md` |
| Timeline **W** | The times on screen are the times in `log.md`, unconverted; the promised date is the one in the plan |
| Banned words **W** | None of the §2 words in the script, the Spoken words, any copy, or any slide, page or image |
| Leaks | Every frame of the contact sheets, every carousel page and the insight image has been looked at: no terminal, editor, file path, username, password page, real name or email, and no product blamed for the fault |
| Before and after | Both came from the same capture script, in the same view and framing; speed clips are uncut and at real speed |
| View | Clips are desktop unless the brief's problem is a mobile one, and every desktop clip is framed on a part of the page |
| Legibility | Text sizes meet §6 (the insight image: §7b); no footage or still is scaled up |
| Spec | 1080 × 1080 · no longer than 90 s · MP4, H.264, 30 fps · audio track present · under 200 MB · cover under 2 MB · first frame readable |
| Carousel | Every page 1080 × 1080 · 8–10 pages, fewer only for a dropped scene · one PDF under 10 MB · at most 30 words a page · nothing that isn't in the video's files |
| Insight | 1200 × 1200 PNG under 5 MB · at most 20 words on the image · no how-to, numbered tips, claims about what agencies do, closing question or ask · no time words the publish date can make wrong |
| Stand-alone **W** | The three posts' first lines are three different sentences; each post makes sense without the other two |
| Voice | Every scene with Spoken words has a take made from the checked words, which speech-to-text heard word for word with no clipped ending; one loudness chain over the whole voice |
| Sound | AAC 48 kHz stereo · −14 LUFS (±0.5) · true peak ≤ −1 dBTP · the voice, the music bed, the clicks and typing in the mix |
| Word counts **W** | No more than 180 words on screen · no more than 160 spoken · video copy 80–130 · carousel copy 40–90 · insight copy 100–180 · lines 1 and 2 of the video copy under 150 characters together |

---

## 9. Publishing

**The week, with one demo a week**

| Day | Post | Format | Sponsorable later |
|---|---|---|---|
| **Monday** | The insight post from the demo before last | One image and text | Yes |
| **Tuesday** | The video from last week's demo | Native video | Yes |
| **Wednesday** | Free for a journey post (`pervej-journey-posts-v1.md`) or a release post | — | — |
| **Thursday** | The carousel from last week's demo | PDF document | No **[Cited]** |
| **Friday** | Free for a journey or release post | — | — |

So each demo goes out as its video on the Tuesday of the week after the build, its carousel two days later, and its insight post the following Monday. Every post goes out at the start of the live window (7 PM Dhaka), so comments are answered while it is fresh. Never more than one post a day, and no more than five in a week.

| Step | Who | Detail |
|---|---|---|
| **The go** | Yeasir | The VA posts nothing from a demo until Yeasir has said go for it (§8). |
| **Upload: video** | VA | From a desktop browser, as a native video — never a YouTube link. One video, nothing else attached, so the post stays eligible for sponsoring later **[Cited]**. Set the cover image as the thumbnail if the upload screen offers it. Leave the auto-captions toggle **[Cited]** off and upload no caption file: the lines are already in the picture, and the voice says the same facts. |
| **Upload: carousel** | VA | From a desktop browser: add a document, upload `<id>-carousel.pdf`, and type the document title from `carousel.md`. Once posted, the text can be edited but the document can't be changed **[Cited]**, so page through the PDF first. |
| **Upload: insight** | VA | From a desktop browser: `<id>-insight.png` as a single image, never with other images, which would stop the post being sponsored **[Cited]**. Add the alt text from `insight.md` if the upload screen offers it. |
| **Text** | VA | Paste the approved copy exactly: `<id>-copy.txt`, `<id>-carousel-copy.txt` or `<id>-insight-copy.txt`. The video and insight posts have to be right when they go out: a sponsored post can't have a link, headline or button added, and only the author can edit it **[Cited]**. |
| **Check** | VA | Before posting, preview on desktop and on a phone: first frame or first page readable, label visible, link present |
| **Reply** | Yeasir | Every comment, himself. The VA never replies. |
| **Record** | Yeasir | Each post's URL and date into the demo's `log.md` (they can ride in the next PR) |
| **Read** | Yeasir | Seven days after each post, in the Sunday scorecard: who reacted and commented. Count agency-side people, not totals, and any `saw_posts` = Y. Note which of the three posts each prospect engaged with. |

---

## 10. The voice

Every video is voiced, and nobody records anything. Yeasir's voice is an ElevenLabs voice clone of his own voice — the same clone, model and settings his other product videos use — made through the API by the toolkit, so publishing never waits on a recording session. Every word is checked against the demo's files before it is voiced and audited after, and Yeasir hears the result before anything is published (the go). The carousel and the insight post are not voiced.

1. **The words.** Claude Code writes the Spoken column with the script (§5) and checks it with the rest of the words (§8) before anything is voiced.
2. **The voice.** `node tools/video/voice.mjs <id>` reads the Spoken words — it refuses until the words check in `post/check.md` has passed — one take per scene, each joined to the previous one so the read flows. Every take is transcribed by speech-to-text and compared with the checked words; a take with a word missing, added or changed, or a clipped ending, gets up to two more. Tone is never retried by machine: Yeasir judges it at the go. Then one loudness chain over the whole voice, so every scene sits at one level. Everything is logged in `media/voice/takes.json`: seed, request id, the word check, the pick.
3. **The render** times each scene to its voice, then mixes the sound (§6).

**The locked choices** live in `tools/video/voice.json`: the clone (voice id), Eleven v4, Stability 0.5, Similarity 0.75, one take per scene, the loudness chain. Change one only to fix a problem, never in the middle of a video.

**The key** is an ElevenLabs API key restricted to Text to Speech and Speech to Text, with a monthly credit cap. It lives in the macOS Keychain (service `elevenlabs-api`) or, on Windows, a user environment variable `ELEVENLABS_API_KEY` — never in a file in the repo, never shown to Claude Code. The toolkit README has the one command for each. A video's voice costs a few hundred characters of credits; a retake costs one scene's.

**Notes at the go, and their one fix each** — after any fix, the audit runs again before the package comes back.

| Note | Fix |
|---|---|
| "Scene 3 sounds flat / rushed / odd" | `voice.mjs <id> --redo s3` (a new take; the old ones are kept, `--pick s3=t1` brings one back), then render |
| "It says WooCommerce wrong" | a `## Pronunciation` table under the script (`\| Term \| Say as \|`), re-checked, then `voice.mjs` (the scenes with that word are voiced again), then render |
| "Change this sentence" | the Spoken column, re-checked, then `voice.mjs` (only changed scenes are voiced again), then render |
| "The voice doesn't sound like me" | `voice.json` Stability / Similarity, then every scene again (`--redo` all) |
| "Music too loud / too quiet" | `tools/video/audio/audio.json` `mix.music_lufs` — a shared change, for every video — then render |
| "A click where there shouldn't be one" | the capture script's step (a `click` that should be a `hover`), re-capture, render |

**Disclosure: none** (owner decision, 7 Oct 2026). No "AI-generated voice" line on screen, in the copy or on a sponsored post: the voice is Yeasir's own, used with his consent, saying words he hears and releases at the go. For the record: LinkedIn has no AI-disclosure setting for posts or Thought Leader Ads; it labels images and videos that carry C2PA content credentials, which the render does not write, and its ad policies forbid deceptive content **[Cited]**. The EU AI Act's transparency duties, in force since 2 Aug 2026, cover AI-generated audio that resembles a real person **[Cited]**; the decision is revisited only if ads are ever aimed at a country whose rules require a label.

---

## 11. Files, setup, and what to say to Claude Code

```
<platform>/<id>/
  capture/        Playwright capture scripts — committed
  post/
    script.md     the seven scenes, with the Spoken column
    copy.md       the video post's text + two alternative first lines
    carousel.md   the pages, the carousel copy + two alternative first lines, the document title
    insight.md    the point, the image's words and layout, the copy + two alternative first lines,
                  the alt text, any outside source
    check.md      self-check results, and every decision made without asking
    audit.md      the independent audit, row by row, with evidence
  media/          git-ignored; copied to the drive as recordings/<platform>/<id>/
    raw/          <id>-before-* · <id>-after-* · <id>-qa-* · Lighthouse reports
    voice/        takes/ · takes.json · <id>-voice-s<N>.wav (the processed voice)
    final/        <id>-linkedin.mp4 · <id>-cover.png · <id>-contact-*.png
                  <id>-timeline.png · <id>-copy.txt
                  <id>-carousel.pdf · <id>-carousel-contact.png · <id>-carousel-copy.txt
                  <id>-insight.png · <id>-insight-copy.txt
```

`final/` is everything the VA needs in one place: the media for all three posts and their approved copy as plain text. `<id>-timeline.png` is the timeline scene as a still, used again as the carousel's timeline page.

**The toolkit** is `tools/video/` (its README is the reference): capture helpers, slide templates in the look of §6, the voice command, a render command, a carousel command (the checked `carousel.md` → pages from the same slide templates and capture stills → one PDF and its contact sheet), an image command (the checked `insight.md` → the insight PNG), a check command for §8's self-check (the audit reviewer runs it too, then looks for itself), and a doctor that confirms what is installed. It needs Node, ffmpeg and Playwright's Chromium, nothing else, and runs the same on macOS and Windows. Slides, pages and the image are small HTML pages photographed by Playwright, so Playwright and ffmpeg do everything; the music bed and UI sounds ship inside it (`tools/video/audio/`). The voice and every render read the checked files themselves, so what was checked is what gets voiced and rendered. The only paid service is ElevenLabs, for the voice. It is code like any other: reviewed line by line, merged by Yeasir. The carousel and image commands are new in v1.3 and are built, reviewed and merged before the first demo's post package.

**In the repo's `CLAUDE.md`:**

> Every demo follows the video guideline, from the brief to the three posts, in one run. No build work starts before the before clips exist. Log times come from the system clock at the moment they happen. Never voice words that haven't passed the self-check. Nothing is ready until a separate reviewer's audit passes. Ask only when blocked (video guideline §3).

**What to say to Claude Code**

| Moment | Say |
|---|---|
| Starting a demo | `/demo <id>` (the repo's drill, `.claude/skills/demo/SKILL.md`), or the brief and: "Run `<id>` per the demo plan and the video guideline, from setup to the audited post package. Ask only if you're blocked." Both mean the same run. |
| At the go, if something's off | The note, in plain words ("scene 3 sounds rushed", "page 4 is crowded", "use the second first line"). Claude Code applies its fix (§10 for the voice), the audit runs again, and the package comes back for the go. |

---

## 12. Done =

`check.md` and `audit.md` every row passed · the voice made from the checked words · video, cover, contact sheets, carousel PDF, insight image and all three copies in `media/final/` and on the drive · Yeasir's go · all three posts published and their URLs in `log.md`. **Missing any one: not done.**

---

## 13. What this changes elsewhere

| Where | Was | Now |
|---|---|---|
| Runbook v1.1 — the step where the log and footage notes come back to chat (step 8) | Claude drafts the posts (carousel, video script, captions) in project chat | Claude Code drafts all three posts — the video's script and copy, the carousel and the insight post — from the repo files, in the same run as the build. Project chat keeps the feed, the shortlist, the brief and the client's answers to questions that block the build. |
| Proof strategy §4.2 — the carousel template | 9–10 slides drafted in chat, including hours estimated and a walkthrough video in the handoff | The carousel of §7a: made by Claude Code from the checked script, 8–10 square pages. Effort is never totalled, and there is no walkthrough. |
| Proof strategy §4.3 | Screen recording with voice, captions on | Lines on screen for the muted feed; Yeasir's own voice from his voice clone, over one music bed (§10). Effort is never totalled on screen. |
| Proof strategy §4.4 — the timeline image | An alternative Thursday post | The timeline is a carousel page. The single-image post is the insight post (§7b). |
| Proof strategy §5, §10 and §13 — rhythm, scorecard, capacity | Tuesday carousel · Thursday video or timeline image; the scorecard counts "Tuesday + Thursday posts"; a short week runs conversations → Thursday post → Tuesday carousel | Monday insight post · Tuesday video · Thursday carousel, with Wednesday and Friday free for journey and release posts (§9); the scorecard counts three posts per demo; a short week runs conversations → video → carousel → insight post → everything else |
| Proof strategy §7.4 — what gets sponsored | The top two of the first four to six Thursday posts | The top two of the videos and insight posts. A carousel is never sponsored. |
| Checklist 6.2 and 6.3 | Templates once; a screen recorder set up | The templates are the toolkit. No screen recorder is needed. |
| Demo plan v1.0 — roles, OBS and `shots.md`, `post/captions.md`, the VA's edit, the handoff walkthrough, real devices and four browsers, the staging URL | The old method | **Done in demo plan v1.2** (7 Oct 2026), which describes this method: Claude Code captures, voices and renders; the VA files and publishes; one video per demo, no walkthrough; practice builds checked locally; the staging line "Practice build, runs locally; not publicly hosted." (Shopify: "Practice build on a Shopify development store; not publicly available."). |
| Demo plan v1.2 — §2 roles, §4.3, §5 `post/`, §7 steps 3, 6 and 8, §8.3, §10, §11, §12 `log.md` | Claude in the project chat drafts the Tuesday carousel and, as the client, approves the plan and accepts the delivery; Yeasir gives two video approvals; the outputs are the video, the carousel and a timeline image; Tuesday carousel and Thursday video; one post URL in the log | Claude Code runs from the brief to the audited post package in one run (§3). No plan approval or delivery acceptance is waited for: the promised date stands as written in `spec.md`, and the audit checks what acceptance checked (§8). Questions go to the chat only when they block the build. Yeasir's two approvals become one go; the VA publishes all three posts; `post/` gains `insight.md` and `audit.md`; §8.3's outputs are the three posts of §1; §10's days become Monday insight post · Tuesday video · Thursday carousel; done is §12 here; `log.md` records three post URLs. |

The code review and merge in the demo plan's §1.1 are untouched: the PR is still reviewed line by line and Yeasir still merges. They run alongside the go, not in place of it, and don't hold up the run.

The repo's own files — `docs/demo-procedure.md`, `docs/house-rules.md`, `demos/_templates/`, `CLAUDE.md` — follow this file. The runbook, the proof strategy and the demo plan are not edited for v1.4: their rows above are their amendment until they are next revised.

---

## 14. Pilot checks and parked items

The first demo's three posts are the pilot. Judge these, then lock v1.5:

1. **Sharpness and smoothness.** Is every word crisp, in the desktop feed and on a phone, and does movement look natural at the frame rate the capture reaches? If not, the capture method changes (§4); the rules here don't.
2. **Framing.** Does the zoomed desktop footage still feel like the real site, or does it need the wide still more often?
3. **Pace.** Do seven scenes fit in 90 seconds without rushing the reader, or does one have to go?
4. **The fold.** Does the label show before "see more" on the video and carousel posts, on desktop and on a phone?
5. **The label.** Does the strip read as honest, or as heavy? In the insight post, does the label line sit naturally?
6. **Your time.** Target: one line to hand the brief over, and a go of about five minutes (ten at most) per demo.
7. **The voice.** Does it sound like Yeasir, and like one sitting from scene to scene? Does the music stay under the voice on laptop speakers and on a phone?
8. **The carousel.** Does the cover read at phone size and make the problem plain? Do 8–10 pages hold attention, or should it be shorter?
9. **The insight post.** Does it read as an expert's observation — not a lesson, not a pitch? Do prospects react to it differently from the video?
10. **The week.** Do three demo posts plus journey and release posts fit the hours, at no more than five posts a week?
11. **The audit.** Write down everything you catch at the go that the audit passed. Each one becomes a new row in §8, so the go keeps getting shorter.
12. **The questions scene.** With questions asked only when they block the build, how many videos lose scene 3? It is the main evidence against the "silence" fear; if most videos lose it, revisit.

Until pervej.com is live, the link line in all three posts' copy, the carousel's last-page URL and the end-card URL are left out.

| Parked | Revisit when |
|---|---|
| A 20–30 second cut for ads | When the first post is picked for sponsoring (proof strategy §7.4). The ch repo's render already makes one; port it then |
| A 4:5 cut and 4:5 carousel pages | After four demos, and only if views are overwhelmingly mobile. Square is the safe default: 4:5 gets side bars on desktop, and vertical ads may be served to mobile only **[Cited]** |
| The 3–5 minute walkthrough | When a prospect asks for one, or for the site |
| Videos embedded on pervej.com | After build log #1 is posted |

---

## 15. Sources

| Claim | Source |
|---|---|
| Limits a sponsorable video must meet: MP4 · 3 seconds to 30 minutes · 75 KB to 500 MB · 360–1920 px per side · square up to 1920 × 1920 · 30 fps recommended · AAC audio · thumbnail JPG or PNG up to 2 MB, matching the video · 150 characters of introductory text recommended. The 200 MB cap in §6 is ours: well inside the limit, and the figure several guides still quote. | LinkedIn Marketing Solutions — Video Ads specs · business.linkedin.com/advertise/ads/sponsored-content/video-ads/specs |
| Thought Leader Ads: one image or one video; no headline, URL or button can be added, but a URL in the organic post stays clickable; only the author can edit the post; a post with several images, a poll or a document can't be promoted; posts with a video are sent to the same video specification | LinkedIn Marketing Solutions — Thought Leader Ads specs · business.linkedin.com/advertise/ads/sponsored-content/thought-leader-ads/specs |
| A document post: PPT, PPTX, DOC, DOCX or PDF, up to 100 MB and 300 pages; a title is added at upload; the post's text can be edited afterwards but the document can't be changed; pages of different sizes must be fitted to one page size; viewers can download it as a PDF | LinkedIn Help — Upload and share documents · linkedin.com/help/linkedin/answer/97459 |
| LinkedIn publishes no recommended pixel size for organic document posts; third-party guides suggest 1080 × 1080 or 1080 × 1350. The square in §7a is ours, to match the video | DreamPixelForge — LinkedIn carousel · dreampixelforge.com/blog/linkedin-carousel · PostNitro — LinkedIn post specs · postnitro.ai/blog/post/linkedin-post-specs |
| Single image: square (1:1) delivers to desktop and mobile, recommended 1200 × 1200; JPG, PNG or GIF up to 5 MB; vertical images deliver to mobile only | LinkedIn Marketing Solutions — Single Image Ads guide · business.linkedin.com/marketing-solutions/success/ads-guide/single-image-ads |
| Square shows in full on desktop and mobile; vertical video is shown small on desktop, with bars or empty space at the sides | Brandwatch — LinkedIn video specs · brandwatch.com/blog/linkedin-video-specs · Captions — LinkedIn video specs · captions.ai/blog-post/linkedin-video-specs |
| Phones carry between just over half and about three-quarters of LinkedIn viewing — third-party estimates that disagree with each other, all-user averages, none of them LinkedIn's own figure | SQ Magazine — LinkedIn mobile vs desktop statistics · sqmagazine.co.uk/linkedin-mobile-vs-desktop-statistics.md · GrowthSpree — 4:5 vertical vs square on LinkedIn · growthspreeofficial.com/blogs/linkedin-ads-4-5-vertical-vs-square-b2b-saas-2026 |
| Vertical video ads served to mobile only — a third-party report, not confirmed on LinkedIn's own pages | QuickFrame — LinkedIn video ad specs · quickframe.mountain.com/blog/linkedin-video-ad-specs |
| Feed video autoplays muted | ContentIn — video post glossary · contentin.io/glossary/video-post |
| Desktop upload offers an auto-captions toggle and SRT upload | Utah State University — LinkedIn accessibility guide · usu.edu/accessibility/social-media/linkedin.php |
| Playwright's Chromium recording runs at a fixed 1 Mbit/s with no quality setting — as reported in an open feature request | Playwright issue #31424 · github.com/microsoft/playwright/issues/31424 |
| LinkedIn labels images and videos that carry C2PA content credentials, showing whether AI generated or edited them; it cannot detect all AI content. Sponsored content is labelled the same way | LinkedIn Help — Content credentials · linkedin.com/help/linkedin/answer/a6282984 · MediaPost — LinkedIn begins labeling AI-generated content |
| LinkedIn's advertising policies prohibit fraudulent or deceptive ads; no separate AI-disclosure setting was found for ads (checked 7 Oct 2026) | LinkedIn Advertising Policies · linkedin.com/legal/ads-policy |
| The EU AI Act's Article 50 transparency duties — marking AI-generated audio and video, disclosing deep fakes that resemble real people — enforceable from 2 Aug 2026 | Regulation (EU) 2024/1689, Art. 50 · summarised in LinkedIn content-credentials coverage, gdprlocal.com/linkedin-content-credentials |
| ElevenLabs self-serve paid plans allow commercial use of generated music and sound effects online (ads, social media, product demos), no attribution | Eleven Music terms, checked 7 Oct 2026 (ch repo audio library); recorded in `tools/video/audio/audio.json` |
| The clone reads clock times as "fifteen hundred" / "ten o'clock", so the word check fails them: Spoken words say times in words | Own test, 7 Oct 2026 — Eleven v4, the toolkit's smoke test |
| Playwright's recorder ignores device scale: a 390 × 700 page at device scale 3 still records at 390 × 700, and a part of a desktop recording enlarged to fill the frame is visibly softer than a screenshot. Screenshots at device scale 2–3 are sharp and come at about 12–20 frames a second (a 540 × 405 part of a 1280 px desktop page: about 19 at scale 2, 14 at scale 3). They assemble with ffmpeg into a 1080 × 1080 H.264 MP4 at their real timing | Own tests, 30 Sep 2026 — Playwright 1.56, headless Chromium, test pages at 390 × 700 and 1280 × 800. The frame rate will differ by machine. |

The document, Thought Leader Ads and single-image rows were checked on 9 Oct 2026.

---

## 16. Changelog

- **v1.4 — 9 Oct 2026.** Owner decision: no approval drill. Yeasir hands Claude Code the brief and it runs in one go, from setup to the finished demo and all three posts (§3): no plan approval or delivery acceptance waited for in the chat, and questions only when they block the build. Yeasir's two approvals are replaced by three layers (§8): Claude Code's self-check (words before voicing, everything after rendering); an audit by a separate reviewer that never saw the build, written to `post/audit.md`, with hard stops that keep a package from being called ready; and one final go of about five minutes before the VA posts. The voice waits for the words check instead of Approval 1 (§10). `CLAUDE.md` line and what to say updated (§11); done (§12); §13's demo plan row extended, with the §1.1 code review and merge untouched. Scene 3's example no longer shows a plan approval. Pilot checks for the audit and the questions scene added; the pilot locks v1.5.
  *Repo edits, 9 Oct 2026:* the Shopify lines that v1.2 had and v1.3 dropped are back (§2 Everything local, §4 QA run and Measured); "Lives in" names `asset/` in both repos; step 7 copies through `drive.mjs` to a per-machine folder; `/demo <id>` starts the run (§11); the audit re-fetches any outside figure.
- **v1.3 — 9 Oct 2026.** Owner decision: every demo becomes three LinkedIn posts, because the demos exist to get Yeasir recognised by prospects — the video, a carousel made from it, and an image-and-text insight post (§1, §7a, §7b). Claude Code drafts all three from the demo's files and the same two approvals cover them (§3, §8), with new self-check rows for the carousel, the insight post and stand-alone first lines. The carousel: 8–10 square pages from the video's slides and stills, one PDF, organic only. The insight post: one observation from the demo and what it means for the business, in the first person, no tutorial and no ask, at most one outside figure with its source recorded, on a 1200 × 1200 image. Rhythm (§9): video on Tuesday, carousel on Thursday, insight post the following Monday; Wednesday and Friday free for journey and release posts; never more than one post a day or five a week. The toolkit gains a carousel and an image command (§11). §7's example no longer claims three browsers, matching Chrome-only QA. §13 amends the runbook, the proof strategy and demo plan v1.2; the parked carousel item is done; the pilot now covers all three posts and locks v1.4.
- **v1.2 — 7 Oct 2026.** Owner decision: every video is voiced, adopting the pipeline proven on the ch repo's V8. Yeasir's own ElevenLabs voice clone reads the approved Spoken column (§5, §10), checked word for word; one music bed, clicks and typing under it (§6); the render mixes to −14 LUFS; Voice and Sound rows in the self-check (§8); Approval 2 also heard with sound. "Everything local" (§2): QA without tunnels, mail servers or extra software — Email Log for emails, emulated phones, Chrome only. The handoff walkthrough is retired; the staging link reads "runs locally" (§13). The toolkit's own section replaces the one-time build instructions (§11). The same day: no AI-voice disclosure line (§10); demo plan v1.2 took over §13's plan rows; phone widths emulated, no separate phone capture (§4).
- **v1.1 — 30 Sep 2026.** Capture is desktop-first: clips show the view the brief is about (desktop by default, phone width only for a mobile problem), framed on the part of the page that matters, with an optional wide still to open. Square kept and vertical ruled out, with the reason in §1. Examples reworked to a desktop problem; capture re-tested at desktop width; pilot checks updated.
- **v1.0 — 30 Sep 2026.** First version, written before demo 1. One output per demo: a 60–90 second square LinkedIn video and its post copy, produced by Claude Code from the demo's own files. Scripted capture during the build; seven-scene script; silent first with an optional voice-over by Yeasir; two approvals and a self-check; publishing steps; one-time toolkit; changes to the runbook and demo plan listed in §13. Pilot on the first video, then lock.
