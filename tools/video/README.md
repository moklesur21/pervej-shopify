# tools/video — the video toolkit

Turns a finished demo into its three LinkedIn posts — the voiced video, the carousel and the insight post — as `asset/pervej-demo-video-guideline-v1.4.md` describes (§4 capture, §5 script, §6 the edit, §7a the carousel, §7b the insight post, §8 the self-check, §10 the voice, §11 this toolkit). **capture** records the storefront on the demo's preview themes; **check** writes the self-check into `post/check.md` (words first, then everything); **voice** reads the checked Spoken words in Yeasir's own voice; **render** cuts the script into the voiced video; **carousel** turns `post/carousel.md` into one PDF; **insight** turns `post/insight.md` into the insight image; **drive** copies the package to this machine's drive folder. The `/demo <id>` run (`.claude/skills/demo/SKILL.md`, `docs/demo-procedure.md`) calls them in order. It runs the same on macOS and Windows; `docs/windows.md` is the Windows (XAMPP) setup.

Free, openly licensed tools: Playwright and Lighthouse (Apache-2.0), ffmpeg (LGPL/GPL), IBM Plex Sans (SIL OFL 1.1, bundled in `slides/fonts/` with its licence). One paid service: ElevenLabs, on Yeasir's account, for the voice. The music bed, clicks and typing in `audio/` were made with it and are licensed for commercial use (`audio/audio.json`).

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

Every line should read `[ok]`. Some lines are only warnings: the store lines (rendering does not need the store, capturing does) and the ElevenLabs key (only the voice needs it). With `tools/shopify/.env.local` filled in, the storefront-password line proves a fresh browser gets past your dev store's password page. If the Node line says it is too old, upgrade Node (`brew upgrade node` · `winget upgrade --id OpenJS.NodeJS.LTS -e`), open a new terminal, then `npm --prefix tools/video ci`.

Nothing else is installed: no other browser, no mail server, no tunnel, no Python. Phone checks are the 360, 390 and 768 px widths in the same Chromium, which opens every width under 768 px as a phone (touch, mobile user agent) — looked at by eye in Claude's built-in browser if wanted.

**The voice key — once per machine that makes the voice.** Yeasir creates an API key in ElevenLabs restricted to **Text to Speech** and **Speech to Text**, with a monthly credit cap (one key per machine, so one can be revoked alone). It never goes in a file in the repo and is never shown to Claude Code; the person types it once:

| macOS — the Keychain (the same entry the ch repo uses) | Windows — a user environment variable, in PowerShell, then open a new terminal |
|---|---|
| `security add-generic-password -a "$USER" -s elevenlabs-api -w` | `$k = Read-Host "ElevenLabs key" -AsSecureString; [Environment]::SetEnvironmentVariable("ELEVENLABS_API_KEY", [Net.NetworkCredential]::new("", $k).Password, "User")` |

Both ask for the key, so it stays out of the shell history. The doctor says where it found one, never what it is. The key belongs to the machine, not the repo: one stored for `pervej-woo` already works here.

**Windows notes**
- winget puts ffmpeg on the user PATH, which terminals opened before the install don't see. The toolkit also looks in winget's install folder itself; `FFMPEG_PATH` / `FFPROBE_PATH` override both.
- Short of space on C:? Set `PLAYWRIGHT_BROWSERS_PATH` to a folder on another drive (as a user environment variable, so it stays set) before running setup.
- Git Bash rewrites arguments that start with `/` into Windows paths. No command here needs one; if you ever pass one, prefix the command with `MSYS2_ARG_CONV_EXCL='*'`.

## Commands

| When (guideline §3) | Command | Writes |
|---|---|---|
| Before clips, before anything is built | `node tools/video/capture.mjs <id> before` | `media/raw/<id>-before-*` |
| After clips, same script | `node tools/video/capture.mjs <id> after` | `media/raw/<id>-after-*` |
| The QA run | `node tools/video/capture.mjs <id> qa` | `media/raw/<id>-qa-*` |
| The four post files drafted: the words check | `node tools/video/check.mjs <id> --words` | `post/check.md` |
| Words passed and committed: the voice | `node tools/video/voice.mjs <id>` (`--dry` first shows what it will send) | `media/voice/` |
| The video | `node tools/video/render.mjs <id>` | `media/final/`, `media/render/`, `post/check.md` |
| The carousel | `node tools/video/carousel.mjs <id>` | `media/final/<id>-carousel*`, `media/carousel/`, `post/check.md` |
| The insight image | `node tools/video/insight.mjs <id>` | `media/final/<id>-insight*`, `media/insight/`, `post/check.md` |
| Everything rendered: the full self-check | `node tools/video/check.mjs <id>` | `post/check.md` |
| Audit passed: to the drive | `node tools/video/drive.mjs <id>` | `$PERVEJ_DRIVE_DIR/shopify/<id>/` |
| Any log event: the time now, in Dhaka | `node tools/video/now.mjs` | — (prints `Fri 9 Oct 10:42`) |

Capture runs on the preview themes on **your** dev store: push them first — `tools/shopify/theme.sh push <id> before` before the before clips, `… push <id> after` before the after and QA clips. Capture reads their IDs from `media/themes.json` and refuses to start without them.

`<id>` is the demo ID (`s01-cart-drawer-lag` → `demos/s01-cart-drawer-lag/`) or a path to a demo folder. Capture options: `--only drawer,lighthouse` (run only those clips, stills or Lighthouse pages; prefix match — the steps between them still run), `--theme <label|id|live>` (another theme than the phase's: `before` captures the before theme, `after` and `qa` the after theme), `--script <file>`, `--headed` (watch it, for writing the script; never for the real take). Setup installs only the headless browser, so `--headed` needs the full Chromium once: `npm --prefix tools/video exec -- playwright install chromium`.

Exit codes: 0 when everything passed, 1 otherwise. Render, carousel and insight run the check themselves at the end; until every file is rendered, the rows for the others show `—`.

**The words gate.** Voice, render, carousel and insight refuse until the words check passes — run live, not read from `check.md` — and until `post/script.md`, `copy.md`, `carousel.md` and `insight.md` are committed as they stand. What is voiced and rendered is always what is in git; a changed word means: check, commit, then voice (only changed scenes) and render again. There is no approval line: the audit by a separate reviewer and Yeasir's go come after the renders (§8).

## Capture — `demos/<id>/capture/`

Two scripts per demo: `shoot.mjs` records before **and** after (the same file, run twice — guideline §2 "one script shoots before and after"), `qa.mjs` records the QA run. Each exports one function; the toolkit owns the browser, the file names and the clean-up. An illustration with invented selectors:

```js
// demos/s01-cart-drawer-lag/capture/shoot.mjs
export default async function ( cap ) {
	const page = await cap.open(); // desktop, 1280 × 800 at 2× — past the password page, on this phase's theme
	await page.goto( cap.url( '/products/stoneware-mug' ) );
	await cap.clip( page, 'drawer-add', { frame: 'cart-drawer', wide: true, speed: true }, async ( act ) => {
		await act.click( 'product-form button[name="add"]' );
		await act.wait( 5000 ); // the wait is the point: this clip plays uncut at real speed
	} );
	await cap.lighthouse( '/products/stoneware-mug' ); // after the clips, never during one
}
```

| Call | What it does |
|---|---|
| `cap.open( { view, scale, signIn, device } )` | A fresh browser context (clean profile), already past the store's password page and on this phase's preview theme, open on the home page. `view`: `'desktop'` (1280 × 800, the default), `'phone'` (390, only for a mobile problem), `'tablet'` (768) or a QA width (`360`, `390`, `768`). `scale`: 2 (default) or 3. `signIn: 'customer'` signs a classic-accounts test customer in before anything is recorded; new customer accounts (a code by email) and the Shopify admin can't be scripted, and say so. Shopify's preview bar is always hidden. `device`: an emulated phone or tablet by Playwright's name (`'iPhone 15'`, `'Pixel 7'`, `'iPad Mini'`) — its screen size, touch and user agent, in place of `view`. Optional: the 360 / 390 / 768 widths already open as a phone. |
| `cap.clip( page, name, options, async ( act ) => { … } )` | Records `media/raw/<id>-<phase>-<name>.mp4` and a `.json` sidecar. Same name, same steps in every phase. Refuses to keep footage when the page is on the password page or on another theme than the phase's, before or after the steps; the sidecar records the theme. |
| `cap.still( page, name, { frame } \| { fullPage: true } )` | A PNG for evidence in `qa.md`. |
| `cap.lighthouse( path, { runs, categories, name } )` | Three runs (odd numbers only), each in a fresh browser profile that first gets past the password page and opens the preview theme, then measures in that same browser (the method of Shopify's own Lighthouse CI): mobile, Lighthouse's default simulated throttling, dev store preview. Keeps every report and writes `<id>-<phase>-lighthouse-<page>.json` with the middle score; prints the line for `qa.md` row 8. |
| `cap.url( path )`, `cap.id`, `cap.phase`, `cap.theme` | The store URL on this phase's preview theme (`SHOPIFY_STORE` plus `?preview_theme_id=…&_fd=0&pb=0`) — open every page through it, or the page leaves the theme; the demo ID; `before` / `after` / `qa`; the theme `{ id, label, name }`. |

**Clip options.**
- `frame` — what to frame (§4 "Framed, never whole"). A desktop clip must have one:
  - `'<selector>'` — 540 × 405 px centred on the element. At 2× that is exactly 1080 × 810, so 16 px site text lands at 32 px.
  - `{ selector, width, anchor, dx, dy }` — wider or narrower, keeping 4:3. `anchor` is `center`, `top`, `left` or `top-left`.
  - `'column'` or `{ column: true, selector }` — the full width of a phone page, 405 px tall, shown as a centred column.
  - `{ x, y, width, height }` — an explicit rectangle in viewport px.
- `wide: true` — before recording, a still of the whole view with the frame outlined in teal, for the one-second opener.
- `speed: true` — a loading or checkout clip. The check makes sure it plays uncut, at real speed.
- `pace` (500 ms between actions), `lead` (600 ms before the first action), `tail` (800 ms after the last).

**Actions** (`act.*`): `click`, `type` (key by key), `fill`, `select`, `check`, `hover`, `press`, `scroll( px \| selector )`, `goto`, `wait( ms )`, `waitFor`, `outline( selector )` (the one teal highlight; a new one replaces the last), `clearOutline`, and `act.page` for anything else. Each click shows a teal tap marker drawn into the page during capture only, never into site code. The sidecar's `events` log the time of every tap (`click`, `type`, `fill`, `select`, `check`) and every typed stretch (`type`); the render puts a soft click and quiet typing there. A clip captured before this existed simply has no click sounds.

**QA on your dev store, nothing extra.** Shopify has no local store: the QA run (`capture/qa.mjs`) runs where the after clips do, on the after theme on your own dev store, behind its password — never through `theme dev`'s local preview, which is for building. Phones: `cap.open( { view: 360 } )`, `390` and `768` — emulated widths, which `qa.md` calls "emulated"; `device: 'iPhone 15'` is there if a brief ever needs one named phone, never required. Emails: not checked — Shopify sends them, not the theme; a scope that changes what an email shows is a scoped item, read under View email in the order's timeline by a person signed in to the admin (no script signs in there). Place the test order with an `@example.com` customer email, so no real address is ever in a capture. Browsers: Chrome (the toolkit's Chromium); nothing else is installed. No tunnel, proxy or public URL, ever.

**What it enforces.** Frames are timestamped screenshots at 2–3× device scale, assembled by ffmpeg at their real timing (§4 "Sharp"); Playwright's video recorder is never used. A frame that would need scaling up is refused. A step that throws discards the footage (§4 "Honest"). Every clip prints its frame rate, its longest single frame (a page load shows up there), and the smallest site text inside the frame. If that text lands under 32 px on the canvas, frame narrower or cut the shot: a 400 px frame at `{ scale: 3 }` puts 16 px text at 43 px.

**One machine per demo.** Record a demo's before, after and QA clips on the same machine. macOS and Windows draw the same page with different fonts, and each person captures on their own dev store. The sidecar records the platform, and the check fails a before/after pair that came from two machines.

**Store, password, sign-in.** All from the environment, never from a script (§4 "Clean"): `SHOPIFY_STORE` and `SHOPIFY_STOREFRONT_PASSWORD` from `tools/shopify/.env.local` (see `tools/shopify/README.md`), and `PERVEJ_CAPTURE_USER` / `PERVEJ_CAPTURE_PASS` for a classic-accounts test customer when a clip needs one. In a git worktree, the main checkout's `.env.local` is used. The password page is passed the way Shopify's own Lighthouse CI does it — the password put into the store's own form in the browser — so no cookie is copied by name (Shopify replaced its old password cookie with an opaque one in 2025).

## The script the render reads — `post/script.md`

It is still the guideline's one table, a row per scene. The **On screen** cell is written so the render can follow it exactly, and the **Spoken** cell is exactly what the voice reads. That way, what passes the words check is what gets voiced and rendered. The guideline's §5 example (invented values, to show the shape only):

| # | Sec | On screen | Line in the bottom band | Spoken | Source |
|---|---|---|---|---|---|
| 1 | 0–5 | Clip before-coupon-spins (wide first) — a still of the whole checkout with the summary outlined, then the summary up close as the spinner keeps turning | Checkout spins forever when a coupon is applied. | Checkout spun forever whenever a coupon was applied. | brief |
| 2 | 5–13 | Slide: *Brief received Mon 10:04* *A marketing agency, for a skincare brand on WooCommerce* *Needed by Wed, end of day* | The brief. | The brief came in on Monday morning, from an agency, needed by the end of Wednesday. | brief · `log.md` |
| 3 | 13–25 | Questions: *Every coupon, or only some? — Every coupon.* *What changed last week? — One plugin update.* *Answered Mon 14:10* Then Slide: *Delivery promised Wed, end of day* | Two questions before touching anything. | Before touching anything, I asked two questions... and promised delivery by the end of Wednesday. | brief · plan · `log.md` |
| 4 | 25–45 | Slide: *Two scripts were refreshing the order total at the same time.* Then Clip after-coupon-spins | One fix, in a small plugin. Nothing else on checkout changed. | Two scripts were refreshing the order total at once. One small fix, and nothing else on checkout changed. | `handoff.md` |
| 5 | 45–62 | Clip qa-test-order Then Checklist: *Desktop and 360 · 390 · 768 px* *Lighthouse mobile 71 before, 74 after* *Tracking still fires* | Checked before the agency sees it. | Then a real test order with a coupon, every screen size, and the speed before and after. | `qa.md` |
| 6 | 62–78 | Timeline: *Brief Mon 10:04* *Questions answered Mon 14:10* *Staging Tue 18:30* *QA passed Wed 11:00* *Handed over Wed 15:10* Then Checklist: *Staging link* *Handover note* *Rollback note* | Promised Wednesday, end of day. Delivered Wednesday 15:10. | Promised for the end of Wednesday... handed over that afternoon, with a rollback note. | `log.md` · `handoff.md` · plan |
| 7 | 78–90 | Slide: *What I'd flag to the client: coupons failed for a week. Worth checking that week's abandoned carts.* Then End card | When the next one lands, message me. | One thing worth flagging: coupons failed for a week. When the next one lands, message me. | `handoff.md` |

Cover: before-coupon-spins at 4 s

**Shots.** A cell holds one or more shots, in order. Each one after the first starts with `Then` and its keyword.

**Clip `<name>`.** The name is the clip's file name without `<id>-` and `.mp4` (`before-…`, `after-…`, `qa-…`). The Before/After mark comes from the name. Options go in brackets:
- `wide first`
- `from N s` and `to N s`
- `×2` — anything sped up carries the mark. It is never allowed on a speed clip.

Anything after the brackets describes the clip for the reader and is never shown.

**Slide.** Each `*italic run*` is one row, shown exactly as written. Rows appear one at a time, each by a cut (§6). A single row is drawn as a statement. Text outside the italics is refused, so nothing checked goes unshown.

**Questions, Checklist and Timeline** are slide variants:
- **Questions:** rows are `question — answer`, with a spaced em dash.
- **Checklist:** teal check markers.
- **Timeline:** teal markers on a rail. The full timeline is also saved as `<id>-timeline.png`.

`(N s)` after any slide keyword makes each of its steps at least N seconds.

**End card.** Name and title come from `brand.json`, plus the URL once it has one (guideline §14: left out until pervej.com is live). The scene's line is the closing line, so it must be the approved ask.

**Line in the bottom band.** At most two lines at 48 px. The render refuses a line that runs longer.

**Spoken.** What the voice says over the scene (guideline §5, §10): one or two natural sentences, the same facts as the screen, at most 160 words in all; `—` for a scene with nothing said. Times in words ("Monday morning") — the script refuses a clock time, which the voice reads as "fifteen hundred". `...` for a pause. No exclamation marks. The last scene's words end on the approved ask. A name the voice gets wrong goes in a table under the script, then the words check again:

```markdown
## Pronunciation

| Term | Say as |
|---|---|
| WooCommerce | Woo Commerce |
```

The voice is sent "Say as"; the word check still listens for the term.

**Source.** `brief`, `plan` (meaning `spec.md`), `log`, `qa`, `handoff`, or file names in backticks. The check looks for every number, time and quote of that scene, on screen and in the Spoken words, in these files.

**Timing** is computed, never typed:
- A slide step stays up one second per three words, never under 2.5 s.
- A clip runs its real length; `×2` halves it.
- A wide still runs 1 s; the end card 3.5 s.
- A scene too short to read its line in, or to fit its voice (0.3 s in, 0.5 s after), is lengthened: across its slide steps, or by holding its last clip frame.

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

The fenced block is the post, exactly as the VA pastes it. The render copies it to `<id>-copy.txt`. Yeasir can swap in an alternative first line at the go; it is a note like any other (§8).

## The carousel — `post/carousel.md`

The pages table first — one row per page, 8 to 10 (one fewer when the video has no questions scene) — then the copy, as in `copy.md`, then the document title (§7a):

~~~markdown
# Carousel — w01-coupon-checkout-hang

| # | Middle | Band | Source |
|---|---|---|---|
| 1 | Still before-coupon-spins | Checkout spins forever when a coupon is applied. | brief |
| 2 | Slide: *A marketing agency, for a skincare brand* *Needed by Wed, end of day* | The brief. | brief |
| 3 | Questions: *Every coupon, or only some? — Every coupon.* | Two questions before touching anything. | brief |
| 6 | Clip after-coupon-spins at 4.5 s | One fix, in a small plugin. | `handoff.md` |
| 10 | End card: *Coupons failed for a week. Worth checking that week's abandoned carts.* | When the next one lands, message me. | `handoff.md` |

## Post

```text
Promised Wednesday, end of day. Handed over Wednesday 15:10.
Practice build from a public job brief. Anonymised.
…
When the next one lands, message me.
```

## Alternative first lines

1. …
2. …

## Document title

Checkout spins when a coupon is applied
~~~

**Middle** is one of: `Still <name>` — `media/raw/<id>-<name>.png`, as `cap.still` names it (`before-checkout` → `<id>-before-checkout.png`) or a clip's wide still (`before-home-wide`); `Clip <name> at N s` — that frame of the clip; `Slide:`, `Questions:`, `Checklist:` or `Timeline:` with every row shown at once; `End card`, optionally with `: *lead*` — the flag above the name, on the last page. A still or frame is never scaled up, and a name starting `before-`/`after-` is marked Before/After. Page 1 is the before still. **Band** is the page's line, as in the video. **Source** works as in `script.md`. At most 30 words on a page, the line included.

`carousel.mjs` draws each page with the video's frame page — label and page counter ("3/9") in the strip — prints them into one PDF, every page 1080 × 1080, and writes to `media/final/`: `<id>-carousel.pdf`, `<id>-carousel-contact.png` (every page on one sheet, titled with the carousel hash), `<id>-carousel-copy.txt` and `<id>-carousel-title.txt` (typed in at upload). The pages and `manifest.json` are in `media/carousel/`.

## The insight post — `post/insight.md`

One image, its copy, the alt text, and any outside figure (§7b):

~~~markdown
# Insight — w01-coupon-checkout-hang

## Image

Layout: still
Still: before-coupon-spins
Line: A broken coupon doesn't take a store down. It quietly loses orders.
Source: handoff

## Post

```text
A broken checkout rarely looks like an outage. It looks like a slow week.
…
```

## Alternative first lines

1. …
2. …

## Alt text

The checkout's order summary with a spinner that never stops.
~~~

**Layout** is `still` (with `Still: <name>` or `Still: Clip <name> at N s`) or `number` (with `Number: 4.1 s → 1.6 s` and `Source line: Lighthouse, mobile, dev store preview`). `Line:` is the insight line; at most 20 words on the image, not counting the label and the source line. `Source:` names the demo files the number and the line come from. An outside figure, if any, is one row of a `## Outside figure` table — `| Source | URL | Sentence | Checked |` — fetched from its source while drafting; the check wants all four cells, and the audit fetches the URL again.

`insight.mjs` draws the 1200 × 1200 PNG — the label strip whenever the image shows the demo; a still in the middle and the line in the band (≥ 60 px), or the number (≥ 160 px), the line and the source line — and writes `<id>-insight.png`, `<id>-insight-copy.txt` and `<id>-insight-alt.txt` to `media/final/`, its manifest to `media/insight/`.

## The self-check — `post/check.md`

`check.mjs` rewrites only the block between its `check:begin` and `check:end` markers. It never touches the rest of the file:
- `## Looked at` — checks done by eye, each for the hash it names.
- `## Decisions` — every decision made without asking (§3): what was decided and why.

`--words` runs the words rows only (Label's copy part, Sources, Timeline, Banned words, Leaks in text, Carousel and Insight words, Stand-alone, Word counts, First line and close): the gate before any voice or render. Without it, everything. The rows are §8's, plus two from the writing and editing rules:

| Row | Passes when |
|---|---|
| Delivery | A before clip exists, every `qa.md` line passed, and `handoff.md` has the rollback note and the flag: what acceptance used to check. |
| Label | Line 2 of the video and carousel copy is the label; the insight copy has it on its own line. After the renders: the label strip matches on a frame sampled every second, is on every carousel page, and on the insight image when it shows the demo. |
| Sources | Every number, time and quote on screen, on a carousel page and on the insight image is found verbatim in its source files. Numbers in the three copies are in the demo's files or on screen — or, for the insight post, the one outside figure, recorded with its source. |
| Timeline | Every time shown is in `log.md`, unconverted. The promised day and date are in `spec.md`. |
| Banned words | None of §2's words (case study, paid-work phrasing, marketplaces, prices, "free", terms, NDA, logins, AI and its tools, totalled effort) or §5's voice and teaching phrases. No emoji, hashtags or tags in the copy. |
| Leaks | No path, URL or email in any text. After each render: **LOOK** — every frame of the contact sheets, every carousel page (its contact sheet) and the insight image, looked at and recorded under "Looked at" with that file's hash. A look counts only for the hash it names. |
| Before and after | Each before/after pair has the same capture script, steps, view, scale and frame, recorded on the same platform. Speed clips are used once, at ×1. |
| View | The clips match the brief's **View:** line. Every desktop clip is framed. |
| Legibility | Site text inside every frame is ≥ 32 px on the canvas, and no footage is scaled up. After the renders: label and page counter ≥ 30 px, line ≥ 48, slides and marks ≥ 36; on the insight image, label and source ≥ 34, line ≥ 60, number ≥ 160; no still scaled up. |
| Spec | After the render: 1080 × 1080, ≤ 90 s, H.264 yuv420p, 30 fps, AAC track, under 200 MB, cover under 2 MB, and the first frame is scene 1 footage with the problem line. |
| Carousel | 8–10 pages (one fewer without a questions scene), page 1 the before still, every still and clip there. After `carousel.mjs`: one PDF under 10 MB with as many pages as the table, every page 1080 × 1080. |
| Insight | No question, no ask, no numbered tips, no claim about the reader, no time word the publish date can make wrong; alt text set; at most one outside figure. After `insight.mjs`: 1200 × 1200, under 5 MB. |
| Stand-alone | The three posts open on three different sentences (the insight post never on the problem line), and no copy points at another post. |
| Voice | The script has Spoken words; every scene's pick was made from the checked words and heard word for word by speech-to-text (≥ 98 %, no clipped ending); one loudness chain. `—` until `voice.mjs` has run. |
| Sound | After the render: AAC 48 kHz stereo, −14 LUFS ±0.5, true peak ≤ −1 dBTP, with the voice, the music bed, clicks and typing in it. |
| Word counts | ≤ 180 words on screen, ≤ 160 spoken. Video copy 80–130 words, carousel copy 40–90, insight copy 100–180. Each copy's line 1 ≤ 80 characters; the video's lines 1 and 2 together under 150. ≤ 30 words on a carousel page, ≤ 20 on the insight image. |
| First line and close | The video and its copy open on the same sentence and close on the approved ask, on screen and in the Spoken words; the carousel copy closes on it too. The video ends on the end card. Two alternative first lines for each post; the document title under 60 characters. The link line only once pervej.com is live. |
| Pace | Every slide step gets its reading time. Nothing still sits unchanged for much more than 5 s. Scene timings are shown against the guide. |

A **LOOK** row is recorded like this, under `## Looked at`:

```markdown
| Leaks | 98c7b9a | PASS | Claude Code · Thu 16:10 | 5 sheets, 67 frames: no tooling, paths, names or emails |
```

## The voice — `voice.mjs`

```bash
node tools/video/voice.mjs <id> --dry          # the scenes and the characters it will send; no API call
node tools/video/voice.mjs <id>                # a take per scene → word check → one loudness chain
node tools/video/voice.mjs <id> --redo s3      # a new take for scene 3 (old takes kept)
node tools/video/voice.mjs <id> --pick s3=t1   # bring back a stored take (no API call)
node tools/video/voice.mjs <id> --process      # the loudness chain only
```

It refuses until the words check passes and the four post files are committed as they stand (the words gate, above). Each scene's Spoken words go to ElevenLabs with Yeasir's clone and the locked choices in `voice.json` (Eleven v4, Stability 0.5, Similarity 0.75, the `[thoughtful]` delivery tag), a fixed seed, and the previous scene's take (request stitching, so the read flows). Every take is transcribed and compared word for word with the checked words — numbers and spelled-out names normalised, so "51" matches "fifty-one". A take with a word missing, added or changed, or a clipped ending gets up to two more; tone is never retried by machine. Then one gate → compressor → gain → limiter chain over the whole voice, joined, trimmed to −14 LUFS and split back per scene.

Only scenes whose words changed get new takes, so a one-sentence change costs one scene. Everything lands in `media/voice/` (git-ignored): `takes/s<N>-tN.mp3`, `takes.json` (seeds, request ids, credits, the word check, the pick), and `<id>-voice-s<N>.wav`. A run prints what to listen to if any pick carries a note.

## Render

Render refuses unless all of these hold:
- The words check passes and the four post files are committed as they stand (the words gate).
- The voice was made from those words, every scene's pick passed the word check (when the script has Spoken words — every video does, §10).
- Every named clip exists in `media/raw/`.
- Every line and slide fits at its minimum size.

It writes to `media/final/` (§11):

| File | What |
|---|---|
| `<id>-linkedin.mp4` | 1080 × 1080, H.264 (CRF 16, yuv420p, BT.709), 30 fps, AAC 48 kHz stereo at −14 LUFS, faststart |
| `<id>-cover.png` | The cover frame, with the label and the problem line |
| `<id>-contact-N.png` | A frame every second, 16 to a sheet, each sheet printed with the render hash |
| `<id>-timeline.png` | The full timeline slide, when the script has one |
| `<id>-copy.txt` | The video post, as plain text |

`media/render/` holds the drawn frames and `manifest.json`, which the check reads. It is rebuilt on every render. On one machine, the same script and clips always give the same render hash. Another machine (other ffmpeg or Chromium builds) gives another hash, so a render made there needs its own look under "Looked at".

The frame (§6, numbers in `lib/layout.mjs`):
- **Top strip:** 80 px, the label alone at 30 px.
- **Middle:** 1080 × 810. Desktop footage fills it edge to edge; phone footage is a centred column on pale grey.
- **Bottom band:** 190 px, the line at 48 px.

Palette: navy `#0F172A`, white, pale grey `#F1F5F9`, and teal `#06C5BE` for markers and outlines only. One typeface: IBM Plex Sans. Each shot is encoded once with identical settings, and the shots are joined without re-encoding.

**The sound** (§6, levels in `audio/audio.json` → `mix`): each scene's voice starts 0.3 s into its scene; the music bed (`audio/music/`) runs under the whole video at −30 LUFS, faded in over 1.5 s and out over the last 3 s, and ducked by the voice (sidechain compression); a click (the three in `audio/sfx/`, in turn) peaks at −20 dBFS on every logged tap; the typing loop sits at −36 LUFS under every typed stretch; both follow each shot's trim and ×2. The mix is normalised to −14 LUFS, true peak −1.5 dBTP, in two linear passes, then muxed with the picture, which is copied untouched. The graph is kept as `media/render/soundtrack.filter.txt`. Changing a level is a shared change: it applies to every video.

## Files here

| Path | What |
|---|---|
| `capture.mjs`, `check.mjs`, `voice.mjs`, `render.mjs`, `carousel.mjs`, `insight.mjs`, `drive.mjs`, `now.mjs`, `doctor.mjs` | The commands |
| `brand.json` | The label, the approved ask, the end card (name, title, URL — `null` until pervej.com is live) |
| `voice.json` | The voice's locked choices: the clone, model, settings, takes, the word-check bar, the loudness chain. No secrets |
| `audio/` | The music bed, clicks and typing, with `audio.json`: each file's prompt, level and licence, and the mix levels |
| `lib/elevenlabs.mjs`, `lib/voice.mjs`, `lib/audio.mjs` | The API and the word check; the voice state the render and check read; loudness, the voice chain and the mix |
| `lib/layout.mjs` | Every size, colour and pace number |
| `lib/capture-kit.mjs`, `lib/lighthouse.mjs` | Capture helpers |
| `lib/script.mjs`, `lib/package.mjs` | Reading `script.md`, `copy.md`, `carousel.md` and `insight.md`; timing the shots |
| `lib/gate.mjs` | The words gate |
| `lib/slides.mjs`, `slides/` | The frame page (`frame.html`, `frame.css`, `frame.js`) Playwright photographs — frames, carousel pages, the insight image — the PDF print, and the bundled font |
| `lib/pictures.mjs` | A still or a clip's frame, placed for a carousel page or the insight image |
| `lib/checks.mjs` | The self-check |
| `lib/storefront.mjs` | The Shopify side of capture: the password page, the preview query, the theme check, the preview bar |
| `lib/ffmpeg.mjs`, `lib/paths.mjs`, `lib/env.mjs` | Plumbing; `env.mjs` reads `tools/shopify/.env.local` and the demo's `media/themes.json` |
| `test/` | `npm --prefix tools/video test`: the capture side against a mock password-protected dev store (`shopify.test.mjs`), and the post side — carousel and insight parsing, the words check, the words gate — on a throwaway demo (`post.test.mjs`). Run it after any change to capture or the post side; the real store stays the final proof. |

Changing the look, the words in `brand.json` or a rule is a shared change: a `chore/` branch from `main`, reviewed and merged by Yeasir.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `ffmpeg not found` | Install it (above), open a new terminal, or set `FFMPEG_PATH` / `FFPROBE_PATH`. |
| `Chromium … does not launch` | `npm --prefix tools/video run setup` |
| "The storefront password was rejected" | `SHOPIFY_STOREFRONT_PASSWORD` in `tools/shopify/.env.local` doesn't match the store's (Online Store → Preferences). |
| "the store's password page is showing" | The store is password-protected and `SHOPIFY_STOREFRONT_PASSWORD` is empty. |
| "No …/themes.json" or "has no "after" theme" | Push the theme first: `tools/shopify/theme.sh push <id> after`. |
| "the page shows theme … not …" | A page left the demo's preview theme: open every page with `cap.url()`. If the theme was deleted from the store, push it again. |
| The preview bar shows in a frame | Shopify changed it. It is hidden by `pb=0` and by the CSS in `lib/storefront.mjs` (`#PBarNextFrameWrapper`, `#preview-bar-iframe`): find its new element in devtools, add it there, re-run `npm --prefix tools/video test`, re-shoot. |
| "this store uses new customer accounts" | Customer sign-in needs classic accounts on the dev store (Settings → Customer accounts); otherwise record the clip signed out. |
| "no password form this toolkit recognises" | The theme's password template has no `form[action*="password"]`; the standard Dawn and Horizon templates have one. |
| "smallest text … under 32" | Frame narrower (`{ selector, width: 400 }` with `cap.open( { scale: 3 } )`) or drop the shot. |
| Low fps or a long single frame | A page load holds the last frame. Judge it at the pilot (§14.1); the sidecar keeps `fps` and `maxGap`. |
| `Not rendered — …` / `Not made — …` | The message says what to fix: an unparsed shot or page, a missing clip or still, the words check not passed, post files changed since their last commit, the voice missing or made from other words, too long. |
| `Not copied: PERVEJ_DRIVE_DIR is not set` | Add `PERVEJ_DRIVE_DIR=<the recordings folder of your synced drive>` to `tools/shopify/.env.local` (or the environment). Until then the package stays in `media/final/`. |
| `No ElevenLabs API key on this machine` | Store it once (Install, above). The doctor shows whether one is found. |
| `ElevenLabs … 401` | The key lacks a permission: it needs Text to Speech and Speech to Text. |
| A scene fails the word check after its retries | Read the differences printed: a transcription spelling of a name (add it to `keyterms` in `voice.json`, a shared change) or a real dropped word (`--redo` the scene). A clock time in Spoken is refused before anything is sent. |
| "say a time in words in Spoken" | Write the time as words ("Wednesday afternoon"); the exact time stays on screen. |
