# tools/video — the video toolkit

> **Status in this repo.** The toolkit came over from `pervej-woo`. Render, slides and the self-check are platform-neutral and work as described. The capture side is still WordPress-shaped — `signIn` goes through `wp-login.php`, `adminBar` hides the WordPress admin bar, settings come from `tools/wp/.env.local`, and Lighthouse checks for WooCommerce's Coming soon page — until the Stage 0 `chore/shopify-capture` PR adapts it to dev stores (storefront password, preview theme, Shopify's preview bar), as `docs/demo-procedure.md` Stage 0 step 4 describes. Read the WordPress details below with that in mind.

Turns a finished demo into Thursday's LinkedIn video, as `asset/pervej-demo-video-guideline-v1.1.md` describes (§4 capture, §5 script, §6 the edit, §8 the self-check, §11 this toolkit). Three commands do it: **capture** records the site, **render** cuts the approved script into the video, **check** writes the self-check into `post/check.md`. When and by whom each runs is `docs/demo-procedure.md` (Stages 2b, 4a, 5).

Free, openly licensed tools only: Playwright and Lighthouse (Apache-2.0), ffmpeg (LGPL/GPL), IBM Plex Sans (SIL OFL 1.1, bundled in `slides/fonts/` with its licence).

## Install — once per machine

| What | Why | macOS | Windows |
|---|---|---|---|
| Node 22.19+ | runs the toolkit (Lighthouse 13 needs it) | `brew install node` | `winget install --id OpenJS.NodeJS.LTS -e` |
| ffmpeg 6+ with libx264 | assembles clips, renders the video | `brew install ffmpeg` | `winget install --id Gyan.FFmpeg.Essentials -e`, then open a new terminal |
| Playwright's Chromium and the npm packages | capture, slides, Lighthouse | the one command below | the one command below |

Then, from the repo root, the one command (Git Bash, PowerShell, Terminal — all the same):

```bash
npm --prefix tools/video run setup
```

It installs the pinned packages into `tools/video/node_modules/` (git-ignored, about 200 MB), Playwright's Chromium headless shell (about 270 MB, in `~/Library/Caches/ms-playwright` on macOS, `%LOCALAPPDATA%\ms-playwright` on Windows), then runs the doctor. To confirm everything works at any time:

```bash
npm --prefix tools/video run doctor
```

Every line should read `[ok]`. The site line is only a warning: rendering does not need the site, capturing does.

**Windows notes**
- winget puts ffmpeg on the user PATH, which terminals opened before the install don't see. The toolkit also looks in winget's install folder itself; `FFMPEG_PATH` / `FFPROBE_PATH` override both.
- Short of space on C:? Set `PLAYWRIGHT_BROWSERS_PATH` to a folder on another drive (as a user environment variable, so it stays set) before running setup.
- Git Bash rewrites arguments that start with `/` into Windows paths. No command here needs one; if you ever pass one, prefix the command with `MSYS2_ARG_CONV_EXCL='*'`.

## Commands

| Procedure | Command | Writes |
|---|---|---|
| 2b — before clips, before anything is built | `node tools/video/capture.mjs <id> before` | `media/raw/<id>-before-*` |
| 4a — after clips, same script | `node tools/video/capture.mjs <id> after` | `media/raw/<id>-after-*` |
| 4a — the QA run | `node tools/video/capture.mjs <id> qa` | `media/raw/<id>-qa-*` |
| 5a — the self-check before Approval 1 | `node tools/video/check.mjs <id>` | `post/check.md` |
| 5b — after Approval 1 | `node tools/video/render.mjs <id>` | `media/final/`, `media/render/`, `post/check.md` |

`<id>` is the demo ID (`w01-coupon-checkout-hang` → `demos/w01-coupon-checkout-hang/`) or a path to a demo folder. Capture options: `--only coupon,lighthouse` (run only those clips, stills or Lighthouse pages; prefix match — the steps between them still run), `--script <file>`, `--headed` (watch it, for writing the script; never for the real take). Setup installs only the headless browser, so `--headed` needs the full Chromium once: `npm --prefix tools/video exec -- playwright install chromium`.

Exit codes: 0 when everything passed, 1 otherwise. Render runs the check itself at the end.

## Capture — `demos/<id>/capture/`

Two scripts per demo: `shoot.mjs` records before **and** after (the same file, run twice — guideline §2 "one script shoots before and after"), `qa.mjs` records the QA run. Each exports one function; the toolkit owns the browser, the file names and the clean-up. An illustration with invented selectors:

```js
// demos/w01-coupon-checkout-hang/capture/shoot.mjs
export default async function ( cap ) {
	const page = await cap.open(); // desktop, 1280 × 800 at 2×
	await page.goto( cap.url( '/checkout/' ) );
	await cap.clip( page, 'coupon-spins', { frame: '.wc-block-components-order-summary', wide: true, speed: true }, async ( act ) => {
		await act.click( '.wc-block-components-totals-coupon .wc-block-components-panel__button' );
		await act.type( '.wc-block-components-totals-coupon__input input', 'WELCOME10' );
		await act.click( '.wc-block-components-totals-coupon__button' );
		await act.wait( 6000 ); // the wait is the point: this clip plays uncut at real speed
	} );
	await cap.lighthouse( '/checkout/' ); // after the clips, never during one
}
```

| Call | What it does |
|---|---|
| `cap.open( { view, scale, signIn, adminBar } )` | A fresh browser context (clean profile). `view`: `'desktop'` (1280 × 800, the default), `'phone'` (390, only for a mobile problem), `'tablet'` (768) or a QA width (`360`, `390`, `768`). `scale`: 2 (default) or 3. `signIn`: `'admin'` or `'customer'`, done before anything is recorded. The WordPress admin bar is hidden unless `adminBar: true` (only when the work lives in the admin). |
| `cap.clip( page, name, options, async ( act ) => { … } )` | Records `media/raw/<id>-<phase>-<name>.mp4` and a `.json` sidecar. Same name, same steps in every phase. |
| `cap.still( page, name, { frame } \| { fullPage: true } )` | A PNG for evidence in `qa.md`. |
| `cap.lighthouse( path, { runs, categories, name } )` | Three runs (odd numbers only), each in a fresh browser: mobile, Lighthouse's default simulated throttling, local site. Keeps every report and writes `<id>-<phase>-lighthouse-<page>.json` with the middle score; prints the line for `qa.md` row 8. |
| `cap.url( path )`, `cap.id`, `cap.phase` | Site URL (from `WP_URL`, default `http://localhost/pervej-woo`), demo ID, `before` / `after` / `qa`. |

**Clip options.**
- `frame` — what to frame (§4 "Framed, never whole"). A desktop clip must have one:
  - `'<selector>'` — 540 × 405 px centred on the element. At 2× that is exactly 1080 × 810, so 16 px site text lands at 32 px.
  - `{ selector, width, anchor, dx, dy }` — wider or narrower, keeping 4:3. `anchor` is `center`, `top`, `left` or `top-left`.
  - `'column'` or `{ column: true, selector }` — the full width of a phone page, 405 px tall, shown as a centred column.
  - `{ x, y, width, height }` — an explicit rectangle in viewport px.
- `wide: true` — before recording, a still of the whole view with the frame outlined in teal, for the one-second opener.
- `speed: true` — a loading or checkout clip. The check makes sure it plays uncut, at real speed.
- `pace` (500 ms between actions), `lead` (600 ms before the first action), `tail` (800 ms after the last).

**Actions** (`act.*`): `click`, `type` (key by key), `fill`, `select`, `check`, `hover`, `press`, `scroll( px \| selector )`, `goto`, `wait( ms )`, `waitFor`, `outline( selector )` (the one teal highlight; a new one replaces the last), `clearOutline`, and `act.page` for anything else. Each click shows a teal tap marker drawn into the page during capture only, never into site code.

**What it enforces.** Frames are timestamped screenshots at 2–3× device scale, assembled by ffmpeg at their real timing (§4 "Sharp"); Playwright's video recorder is never used. A frame that would need scaling up is refused. A step that throws discards the footage (§4 "Honest"). Every clip prints its frame rate, its longest single frame (a page load shows up there), and the smallest site text inside the frame. If that text lands under 32 px on the canvas, frame narrower or cut the shot: a 400 px frame at `{ scale: 3 }` puts 16 px text at 43 px.

**One machine per demo.** Record a demo's before, after and QA clips on the same machine. macOS and Windows draw the same page with different fonts, and each person's database is local. The sidecar records the platform, and the check fails a before/after pair that came from two machines.

**Sign-in.** Credentials come from the environment, never from a script (§4 "Clean"): `WP_ADMIN_USER` / `WP_ADMIN_PASS` (already in `tools/wp/.env.local`) and `PERVEJ_CAPTURE_USER` / `PERVEJ_CAPTURE_PASS` for a test customer. Add those two to `tools/wp/.env.local` or export them. In a git worktree, the main checkout's `tools/wp/.env.local` is used.

## The script the render reads — `post/script.md`

It is still the guideline's one table, a row per scene. The **On screen** cell is written so the render can follow it exactly. That way, what Yeasir approves is what gets rendered. The guideline's §5 example (invented values, to show the shape only):

| # | Sec | On screen | Line in the bottom band | Source |
|---|---|---|---|---|
| 1 | 0–5 | Clip before-coupon-spins (wide first) — a still of the whole checkout with the summary outlined, then the summary up close as the spinner keeps turning | Checkout spins forever when a coupon is applied. | brief |
| 2 | 5–13 | Slide: *Brief received Mon 10:04* *A marketing agency, for a skincare brand on WooCommerce* *Needed by Wed, end of day* | The brief. | brief · `log.md` |
| 3 | 13–25 | Questions: *Every coupon, or only some? — Every coupon.* *What changed last week? — One plugin update.* *Answered Mon 14:10* Then Slide: *Plan approved Mon 15:00* *Delivery promised Wed, end of day* | Two questions before touching anything. | brief · plan · `log.md` |
| 4 | 25–45 | Slide: *Two scripts were refreshing the order total at the same time.* Then Clip after-coupon-spins | One fix, in a small plugin. Nothing else on checkout changed. | `handoff.md` |
| 5 | 45–62 | Clip qa-test-order Then Checklist: *Desktop and 360 · 390 · 768 px* *Lighthouse mobile 71 before, 74 after* *Tracking still fires* | Checked before the agency sees it. | `qa.md` |
| 6 | 62–78 | Timeline: *Brief Mon 10:04* *Questions answered Mon 14:10* *Staging Tue 18:30* *QA passed Wed 11:00* *Handed over Wed 15:10* Then Checklist: *Staging link* *Handover note* *Rollback note* | Promised Wednesday, end of day. Delivered Wednesday 15:10. | `log.md` · `handoff.md` · plan |
| 7 | 78–90 | Slide: *What I'd flag to the client: coupons failed for a week. Worth checking that week's abandoned carts.* Then End card | When the next one lands, message me. | `handoff.md` |

Cover: before-coupon-spins at 4 s

**Shots.** A cell holds one or more shots, in order. Each one after the first starts with `Then` and its keyword.

**Clip `<name>`.** The name is the clip's file name without `<id>-` and `.mp4` (`before-…`, `after-…`, `qa-…`). The Before/After mark comes from the name. Options go in brackets:
- `wide first`
- `from N s` and `to N s`
- `×2` — anything sped up carries the mark. It is never allowed on a speed clip.

Anything after the brackets describes the clip for the reader and is never shown.

**Slide.** Each `*italic run*` is one row, shown exactly as written. Rows appear one at a time, each by a cut (§6). A single row is drawn as a statement. Text outside the italics is refused, so nothing approved goes unshown.

**Questions, Checklist and Timeline** are slide variants:
- **Questions:** rows are `question — answer`, with a spaced em dash.
- **Checklist:** teal check markers.
- **Timeline:** teal markers on a rail. The full timeline is also saved as `<id>-timeline.png`.

`(N s)` after any slide keyword makes each of its steps at least N seconds.

**End card.** Name and title come from `brand.json`, plus the URL once it has one (guideline §14: left out until pervej.com is live). The scene's line is the closing line, so it must be the approved ask.

**Line in the bottom band.** At most two lines at 48 px. The render refuses a line that runs longer.

**Source.** `brief`, `plan` (meaning `spec.md`), `log`, `qa`, `handoff`, or file names in backticks. The check looks for every number, time and quote of that scene in these files.

**Timing** is computed, never typed:
- A slide step stays up one second per three words, never under 2.5 s.
- A clip runs its real length; `×2` halves it.
- A wide still runs 1 s; the end card 3.5 s.
- A scene too short to read its line in is lengthened.

The Sec column is a guide; the check reports the real timings. The render refuses any scene over 20 s and any video over 90 s.

**Cover** (optional, under the table): the frame of a clip to export as `<id>-cover.png`. The default is the last frame of the first clip.

## The copy — `post/copy.md`

~~~markdown
# Copy — w01-coupon-checkout-hang

## Post

```text
Checkout spins forever when a coupon is applied.
Practice build from a public job brief. Anonymised.

…four to six short lines…

When the next one lands, message me.
```

## Alternative first lines

1. …
2. …
~~~

The fenced block is the post, exactly as the VA pastes it. The render copies it to `<id>-copy.txt`. Yeasir picks the first line by editing the block.

## The self-check — `post/check.md`

`check.mjs` rewrites only the block between its `check:begin` and `check:end` markers. It never touches the rest of the file:
- `## Looked at` — checks a person has done by eye.
- `## Approvals` — where Yeasir writes `Approved 1 — <Day HH:MM> · Yeasir` and, later, `Approved 2 — …`.

The rows are the ten of §8, plus two from the writing and editing rules:

| Row | Passes when |
|---|---|
| Label | Line 2 of the copy is the label. After the render: the label strip matches a reference on a frame sampled every second. |
| Sources | Every number, time and quote on screen is found verbatim in the scene's source files. Numbers in the copy are in the demo's files or on screen. |
| Timeline | Every time shown is in `log.md`, unconverted. The promised day and date are in `spec.md`. |
| Banned words | None of §2's words (case study, paid-work phrasing, marketplaces, prices, "free", terms, NDA, logins, AI and its tools, totalled effort) or §5's voice and teaching phrases. No emoji, hashtags or tags in the copy. |
| Leaks | No path, URL or email in any text. After the render: **LOOK** — every frame of the contact sheets, looked at by a person (or Claude Code) and recorded under "Looked at" with the render hash. A look counts only for the render it names. |
| Before and after | Each before/after pair has the same capture script, steps, view, scale and frame, recorded on the same platform. Speed clips are used once, at ×1. |
| View | The clips match the brief's **View:** line. Every desktop clip is framed. |
| Legibility | Site text inside every frame is ≥ 32 px on the canvas, and no footage is scaled up. After the render: label ≥ 30 px, line ≥ 48, slides and marks ≥ 36. |
| Spec | After the render: 1080 × 1080, ≤ 90 s, H.264 yuv420p, 30 fps, AAC track, under 200 MB, cover under 2 MB, and the first frame is scene 1 footage with the problem line. |
| Word counts | ≤ 180 words on screen. Copy is 80–130 words. Copy line 1 is ≤ 80 characters, and lines 1 and 2 together are under 150. |
| First line and close | The video and the copy open on the same sentence and close on the approved ask. The video ends on the end card. There are two alternative first lines. |
| Pace | Every slide step gets its reading time. Nothing still sits unchanged for much more than 5 s. Scene timings are shown against the guide. |

A **LOOK** row is recorded like this, under `## Looked at`:

```markdown
| Leaks | 98c7b9a | PASS | Claude Code · Thu 16:10 | 5 sheets, 67 frames: no tooling, paths, names or emails |
```

## Render

Render refuses unless all of these hold:
- `post/check.md` has an `Approved 1` line that is committed.
- `post/script.md` and `post/copy.md` are unchanged since that commit (any change to the words goes back to Approval 1).
- Every named clip exists in `media/raw/`.
- Every line and slide fits at its minimum size.

It writes to `media/final/` (§11):

| File | What |
|---|---|
| `<id>-linkedin.mp4` | 1080 × 1080, H.264 (CRF 16, yuv420p, BT.709), 30 fps, silent AAC track, faststart |
| `<id>-cover.png` | The cover frame, with the label and the problem line |
| `<id>-contact-N.png` | A frame every second, 16 to a sheet, each sheet printed with the render hash |
| `<id>-timeline.png` | The full timeline slide, when the script has one |
| `<id>-copy.txt` | The approved post, as plain text |

`media/render/` holds the drawn frames and `manifest.json`, which the check reads. It is rebuilt on every render. On one machine, the same approved script and clips always give the same render hash. Another machine (other ffmpeg or Chromium builds) gives another hash, so a render made there needs its own look under "Looked at".

The frame (§6, numbers in `lib/layout.mjs`):
- **Top strip:** 80 px, the label alone at 30 px.
- **Middle:** 1080 × 810. Desktop footage fills it edge to edge; phone footage is a centred column on pale grey.
- **Bottom band:** 190 px, the line at 48 px.

Palette: navy `#0F172A`, white, pale grey `#F1F5F9`, and teal `#06C5BE` for markers and outlines only. One typeface: IBM Plex Sans. Each shot is encoded once with identical settings, and the shots are joined without re-encoding.

Voice-over fitting (§10) is not built yet: the video ships silent.

## Files here

| Path | What |
|---|---|
| `capture.mjs`, `render.mjs`, `check.mjs`, `doctor.mjs` | The commands |
| `brand.json` | The label, the approved ask, the end card (name, title, URL — `null` until pervej.com is live) |
| `lib/layout.mjs` | Every size, colour and pace number |
| `lib/capture-kit.mjs`, `lib/lighthouse.mjs` | Capture helpers |
| `lib/script.mjs`, `lib/package.mjs` | Reading `script.md` and `copy.md`, timing the shots |
| `lib/approvals.mjs` | The Approval 1 gate |
| `lib/slides.mjs`, `slides/` | The frame page (`frame.html`, `frame.css`, `frame.js`) Playwright photographs, and the bundled font |
| `lib/checks.mjs` | The self-check |
| `lib/ffmpeg.mjs`, `lib/paths.mjs`, `lib/env.mjs` | Plumbing |

Changing the look, the words in `brand.json` or a rule is a shared change: a `chore/` branch from `main`, reviewed and merged by Yeasir.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `ffmpeg not found` | Install it (above), open a new terminal, or set `FFMPEG_PATH` / `FFPROBE_PATH`. |
| `Chromium … does not launch` | `npm --prefix tools/video run setup` |
| Storefront shows "Great things are on the horizon" | WooCommerce's Coming soon mode is on (Settings → Site visibility). Signed-out capture needs it off; signed in as admin, the page shows a banner instead. Lighthouse always runs signed out, so it refuses to measure until the store is live. |
| "smallest text … under 32" | Frame narrower (`{ selector, width: 400 }` with `cap.open( { scale: 3 } )`) or drop the shot. |
| Low fps or a long single frame | A page load holds the last frame. Judge it at the pilot (§14.1); the sidecar keeps `fps` and `maxGap`. |
| `Not rendered — …` | The message says what to fix: an unparsed shot, a missing clip, a missing or uncommitted approval, words changed since approval, too long. |
