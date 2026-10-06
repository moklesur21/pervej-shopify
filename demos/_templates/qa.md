# QA — <id>

The delivery checklist (demo plan §7, strategy §8.3) in rows 1–11, unchanged in order, then the Shopify additions from T7.2 in rows 12–18. Every line passes or the demo is not done; a known defect is not a pass. Evidence = a screenshot or a clip filename in `media/raw/`, or pasted output. Run it fresh, from this sheet, not from memory of the build (T7.2 §1.1).

Theme: `<id> · after` (#<theme id>) on <store> · Tester: <name> · Date: <date>

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Functional pass on the scoped items, including edge cases (list them; the Shopify set: empty metafield, sold-out variant, single-image product, 80-character title, no compare-at price, one-product collection, logged in and out) | | |
| 2 | Full purchase flow with a test order: add to cart (product page, quick add / drawer) → cart (qty, remove, discount code) → checkout → order placed with the test gateway (card `1`), order visible and correct in admin | | |
| 3 | Mobile 360 / 390 / 768 px + one real device (touch targets, sticky elements, drawer scroll-lock, keyboard over inputs) | | |
| 4 | Chrome, Safari, Firefox, iOS Safari | | |
| 5 | `tools/shopify/theme.sh check <id>` — zero errors; warnings fixed or listed | | |
| 6 | No hardcoded user-facing strings — `locales/en.default.json` / `en.default.schema.json`; prices through money filters | | |
| 7 | No console errors; no `Liquid error` in the rendered HTML of home, collection, product, cart | | |
| 8 | Lighthouse before and after (mobile, median of 3, same environment) — no regression | | |
| 9 | Cart and checkout scripts still fire (pixel / GA4 events, upsell blocks, shipping rates, discount codes, cart drawer events) | | |
| 10 | Rollback path confirmed (the before theme or a named backup can be published back) | | |
| 11 | Walkthrough recorded | | |
| 12 | Theme editor pass: every setting and block added — min/max blocks, presets, empty states — saved, reloaded, still there | | |
| 13 | App blocks and app embeds that rendered before still render | | |
| 14 | Accessibility floor: keyboard reach and exit, visible focus, `Esc` closes drawers and returns focus, correct `aria-*`; Lighthouse accessibility ≥ 90 | | |
| 15 | Store-state variants that apply: logged in / out, B2B company context, each Market | | |
| 16 | Structured data intact: one Product entity, valid JSON-LD | | |
| 17 | No debug leftovers: `console.log`, `\| json` dumps, `TODO`, placeholder copy or images | | |
| 18 | Scope diff clean: `tools/shopify/theme.sh diff <id> --stat` shows only in-scope files | | |

## Defects

ID · severity (S1 blocks purchase or breaks the theme · S2 scoped feature wrong · S3 minor · S4 cosmetic) · steps · expected vs actual · evidence · fix commit · re-test. S1–S2 always block; S3–S4 block unless descoped in writing. After every fix, re-run what it could touch **and** row 2.

| ID | Sev | Steps | Expected / actual | Evidence | Fix | Re-test |
|---|---|---|---|---|---|---|
| | | | | | | |
