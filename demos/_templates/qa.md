# QA — <id>

The delivery checklist (demo plan §7, strategy §8.3) in rows 1–10, unchanged in order, then the Shopify additions from T7.2 in rows 11–17. Every line passes or the demo is not done; a known defect is not a pass. Evidence = a screenshot or a clip filename in `media/raw/`, or pasted output. Run it fresh, from this sheet, not from memory of the build (T7.2 §1.1).

Checked where the demo runs, as the video guideline v1.2 §2 "Everything local" says: Shopify has no local store, so every check runs on the after theme on your own dev store, with nothing extra installed — no tunnel, public URL, mail server or other software. Name every check as what it was: phone widths are emulated (the toolkit opens widths under 768 px as a phone), Chrome is the only browser run; never "real device" or a browser that was not run. There is no walkthrough video (demo plan v1.2): the demo's one video is the LinkedIn video.

Theme: `<id> · after` (#<theme id>) on <store> · Tester: <name> · Date: <date>

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Functional pass on the scoped items, including edge cases (list them; the Shopify set: empty metafield, sold-out variant, single-image product, 80-character title, no compare-at price, one-product collection, logged in and out) | | |
| 2 | Full purchase flow with a test order: add to cart (product page, quick add / drawer) → cart (qty, remove, discount code) → checkout with an `@example.com` email → order placed with the test gateway (card `1`), order visible and correct in admin, its emails in the order's timeline (which email went to whom; View email: subject, delivery status, text — read in the admin by a person) | | |
| 3 | Mobile 360 / 390 / 768 px, emulated (touch targets, sticky elements, drawer scroll-lock) | | |
| 4 | Chrome | | |
| 5 | `tools/shopify/theme.sh check <id>` — zero errors; warnings fixed or listed | | |
| 6 | No hardcoded user-facing strings — `locales/en.default.json` / `en.default.schema.json`; prices through money filters | | |
| 7 | No console errors; no `Liquid error` in the rendered HTML of home, collection, product, cart | | |
| 8 | Lighthouse before and after (mobile, median of 3, dev store preview, same Lighthouse version) — no regression | | |
| 9 | Cart and checkout scripts still fire (pixel / GA4 events, upsell blocks, shipping rates, discount codes, cart drawer events) | | |
| 10 | Rollback path confirmed (the before theme or a named backup can be published back) | | |
| 11 | Theme editor pass: every setting and block added — min/max blocks, presets, empty states — saved, reloaded, still there | | |
| 12 | App blocks and app embeds that rendered before still render | | |
| 13 | Accessibility floor: keyboard reach and exit, visible focus, `Esc` closes drawers and returns focus, correct `aria-*`; Lighthouse accessibility ≥ 90 | | |
| 14 | Store-state variants that apply: logged in / out, B2B company context, each Market | | |
| 15 | Structured data intact: one Product entity, valid JSON-LD | | |
| 16 | No debug leftovers: `console.log`, `\| json` dumps, `TODO`, placeholder copy or images | | |
| 17 | Scope diff clean: `tools/shopify/theme.sh diff <id> --stat` shows only in-scope files | | |

## Defects

ID · severity (S1 blocks purchase or breaks the theme · S2 scoped feature wrong · S3 minor · S4 cosmetic) · steps · expected vs actual · evidence · fix commit · re-test. S1–S2 always block; S3–S4 block unless descoped in writing. After every fix, re-run what it could touch **and** row 2.

| ID | Sev | Steps | Expected / actual | Evidence | Fix | Re-test |
|---|---|---|---|---|---|---|
| | | | | | | |
