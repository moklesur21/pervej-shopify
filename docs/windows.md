# Windows — the demo pipeline on Asad's PC

What differs on a Windows PC, done once, plus how a demo runs there. The pipeline is the same on both machines — the same `/demo <id>` run, commands and files; Yeasir works on a Mac, Asad on Windows. The rules are `asset/pervej-demo-video-guideline-v1.4.md` and `asset/pervej-demo-project-plan-v1.md` v1.2, the steps of one demo `docs/demo-procedure.md`, the toolkit `tools/video/README.md`. Asad's first-time checklist, with his real values, is `docs/asad-start-here.md`; this file is the detail behind its Windows steps.

**Since 7 Oct 2026:** every demo video is voiced with Yeasir's own ElevenLabs voice clone, made by the toolkit; nobody records anything. Shopify has no local store: a demo is built, captured and checked on your own dev store (store B), on its unpublished before and after themes, with what the PC already has — no tunnel, proxy, mail server or extra browser, ever.

**One machine per demo.** A demo is captured, voiced and rendered on the machine it was built on: Windows and macOS draw fonts differently, and each person captures on their own store. A demo built on this PC is finished on this PC.

Every command below runs in **Git Bash** from the repo root (the `pervej-shopify` folder), unless it says PowerShell. Claude Code on this PC can run all of them except §1 and §5, which need a person.

---

## 1. Yeasir, once: the voice key for this PC

One key per machine serves both repos. If this PC already has one for `pervej-woo` (its `docs/windows.md` §1 and §7), skip this and §5: the doctor will find it.

In ElevenLabs (signed in to the account that holds the voice clone):

1. **Developers** (bottom-left) → **API Keys** → **+ Create Key**.
2. Name it after the PC, e.g. `asad-pc`, so it can be revoked on its own.
3. **Restrict the key:** Text to Speech → *Access*; Speech to Text → *Access*; everything else → *No access*.
4. **Credit quota:** a monthly limit; 2,000 credits is ample (one video's voice uses about 100–300, retakes included).
5. Create it, copy the key once, and send it to Asad privately — never in the repo, in a chat with Claude, or in a file.

## 2. The tools — check, install only what is missing

| Tool | Check | Expected |
|---|---|---|
| Git and Git Bash | `git --version` | any recent version |
| Node | `node --version` | v22.19 or newer |
| ffmpeg | `ffmpeg -version` | version 6 or newer |
| Shopify CLI | `shopify version` | 4.x |
| One CLI only | `which -a shopify` | exactly one path |

Only if one is missing: Git `winget install --id Git.Git -e`, Node `winget install --id OpenJS.NodeJS.LTS -e`, ffmpeg `winget install --id Gyan.FFmpeg.Essentials -e`, then open a new terminal; the CLI `npm install -g @shopify/cli@latest`. Nothing else is ever installed for the pipeline: no XAMPP, PHP or Composer for this repo — there is no local Shopify.

`tools/shopify/theme.sh` is a bash script: run it in Git Bash. The Shopify CLI itself also works in PowerShell. `.gitattributes` normalises line endings, so a Windows clone never shows whole-file diffs.

## 3. Local settings — `tools/shopify/.env.local`

The file exists from the first setup (`docs/asad-start-here.md` §4) and stays out of git. **Check** it has the names, without printing the values:

```bash
grep -o '^[A-Z_]*' tools/shopify/.env.local
```

Expected among them: `SHOPIFY_STORE` (`pervej-demo-b.myshopify.com`) and `SHOPIFY_STOREFRONT_PASSWORD`. `PERVEJ_CAPTURE_USER` / `PERVEJ_CAPTURE_PASS` only once a brief needs a signed-in customer.

## 4. The toolkit

```bash
npm --prefix tools/video run setup
```

It installs the toolkit's packages and Playwright's Chromium, then runs the doctor. **Check:** every line reads `[ok]` — the store line and *Storefront password — accepted* included — except the ElevenLabs line, which reads `warn` until §5 is done. Run the doctor again at any time:

```bash
npm --prefix tools/video run doctor
```

## 5. Asad, once: store the voice key

Skip if the doctor's ElevenLabs line already reads `[ok]` (the key from `pervej-woo`). Otherwise, in **PowerShell** — it asks for the key, so the key stays out of the history:

```powershell
$k = Read-Host "ElevenLabs key" -AsSecureString; [Environment]::SetEnvironmentVariable("ELEVENLABS_API_KEY", [Net.NetworkCredential]::new("", $k).Password, "User")
```

Then **quit and reopen the Claude desktop app and every terminal**: a running program does not see a new variable.

**Check:** the doctor's line reads `[ok] ElevenLabs key — found in the environment (not shown)`. Claude Code never reads, prints or stores the key; the toolkit reads it at run time. Never paste it into a Claude chat.

## 6. Ready — all four true

- [ ] `tools/shopify/theme.sh doctor`: every line `[ok]`.
- [ ] The video doctor: every line `[ok]`, the ElevenLabs line included.
- [ ] `tools/shopify/theme.sh list` lists store B's themes.
- [ ] `git status` on `main` is clean.

---

## 7. Claude's built-in browser

The Claude desktop app has its own browser pane, on Windows as on the Mac. It opens store B's preview links and admin directly — no tunnel — and can show a page at phone size: ask Claude Code to open the page "at phone size in your browser". Two things only a person types there, once each, and the pane remembers them: the **storefront password** (on the password page) and the **admin sign-in** (with its two-step code). Claude Code never types either. The evidence in `qa.md` still comes from the capture scripts and the files, so every still and clip lands in `media/raw/` with its name.

## 8. Every demo

The steps are `docs/demo-procedure.md`, unchanged on Windows. The commands:

```bash
tools/shopify/theme.sh push <id> before|after
node tools/video/capture.mjs <id> before|after|qa
node tools/video/check.mjs <id> --words
node tools/video/voice.mjs <id> --dry
node tools/video/voice.mjs <id>
node tools/video/render.mjs <id>
node tools/video/carousel.mjs <id>
node tools/video/insight.mjs <id>
node tools/video/check.mjs <id>
node tools/video/drive.mjs <id>
tools/shopify/theme.sh clean <id>
```

`/demo <id>` in a new Claude Code session runs them in order; `PERVEJ_DRIVE_DIR` in `tools/shopify/.env.local` names this PC's recordings folder (for example `PERVEJ_DRIVE_DIR=G:/My Drive/recordings`).

`voice.mjs`, `render.mjs`, `carousel.mjs` and `insight.mjs` refuse until the words check passes and the post files are committed. A render here has its own hashes, so its contact sheets, carousel and insight image get their own looks under "Looked at" in `check.md`. The voice and the music sound the same as on the Mac: the same clone and settings (`tools/video/voice.json`), the music and UI sounds in the repo (`tools/video/audio/`).

**QA, checked on the dev store** (demo plan v1.2 §7):

| `qa.md` row | How | Written as |
|---|---|---|
| 3 — phones | `cap.open( { view: 360 } )`, `390` and `768` in the QA capture: the toolkit opens every width under 768 px as a phone (touch, mobile user agent) | "Mobile 360 / 390 / 768 px, emulated" |
| 4 — browsers | Chrome only | "Chrome" |
| The handoff's staging link | — | "Practice build on a Shopify development store; not publicly available." |

Order emails are not checked: Shopify sends them, not the theme (demo plan v1.2 §7). The test order still uses an `@example.com` email, so no real address is ever in a capture.

There is no walkthrough video: the demo's one video is Stage 5's square LinkedIn video.

## 9. Never, for a demo

A tunnel (cloudflared, ngrok) or a proxy · `theme dev`'s local preview as QA evidence (it is for building) · a published theme, `--publish` or `--allow-live` · a mail server or mail catcher · another browser or a cloud browser service · Python. If a step seems to need one, it is the wrong step — §8 has the dev-store way. If a brief truly cannot be checked on the dev store, the question goes to the project chat.

## 10. Troubleshooting

| Symptom | Fix |
|---|---|
| `shopify: command not found` after install | Open a new Git Bash window (PATH refresh) |
| `which -a shopify` shows two paths | An older copy is earlier on the PATH: remove it (`npm uninstall -g @shopify/cli` for a second npm copy, or Apps → Installed apps), then reinstall once |
| `No ElevenLabs API key on this machine` | §5, then quit and reopen the Claude app and the terminal |
| `ElevenLabs … 401` | The key lacks a permission: §1 step 3 |
| `ffmpeg not found` | §2, then a new terminal; or set `FFMPEG_PATH` / `FFPROBE_PATH` |
| The doctor's audio-filters line fails | That ffmpeg build lacks a filter the mix needs: reinstall from winget (§2) |
| "The storefront password was rejected" | `SHOPIFY_STOREFRONT_PASSWORD` in `tools/shopify/.env.local` doesn't match store B's (Online Store → Preferences) |
| "No …/themes.json" or "has no "after" theme" | Push the theme first: `tools/shopify/theme.sh push <id> after` |
| `theme.sh list` says you have no access | Yeasir adds you as staff in store B's admin (Settings → Users) |
| A Git Bash argument starting with `/` turns into a Windows path | Prefix the command with `MSYS2_ARG_CONV_EXCL='*'` |
| Anything else | Message Yeasir the exact command and the exact output |
