# Brief — s01 · cart-drawer-lag

**Lane A · Shopify · Weekly fix · Issued: Mon 16 Nov 2026, 10:00 Dhaka** ← T0, the clock starts here
**Client:** a US marketing agency, for their client, a DTC kitchen-accessories brand on Shopify
*Practice build from a public job brief. Anonymised.*

---

## 1. Client brief

*(as the client wrote it)*

"Our client's cart drawer has gone slow. Adding an item takes a couple of seconds to show up, removing one can take four or five, and the whole drawer blinks while it does it. The drawer has a free-shipping progress bar, an upsell row, a subscribe-and-save toggle and a small product slider inside it, and all of those have to stay.

Our previous developer tried to speed it up and we think it got worse — he mentioned the drawer 'redrawing itself too often' but never pinned it down. We're a week out from a promo and this is exactly where customers drop off. Fix it cleanly, and don't break anything in there."

**What we know**
- Dawn-based theme with a custom cart drawer (web components, section rendering)
- Everything inside the drawer is theme code, not apps
- Full theme file access; a duplicate theme for staging
- Nothing measured yet — "it feels slow"

**Done, from the client's side**
- Add and remove feel instant, with the same actions timed before and after
- Progress bar, upsell row, subscription toggle and slider all still work
- No console errors; a test order completes from the drawer
- Nothing else on the storefront changed

**Constraints**
- Duplicate theme only, never live · no new apps
- **Deadline:** Wed 18 Nov, end of day · Budget: up to 6 hours

**Deliverables**
Preview link · walkthrough video (2 min) · handover note · rollback note · one thing to flag to the client

---

## 2. Mini approach

- Measure first: time add and remove in the drawer, note what re-renders and how many requests each action fires.
- Find the cause in the drawer's update cycle — how much is redrawn per change, what is re-initialised per change, what runs that shouldn't.
- Fix at the cause: update only what changed, initialise widgets once, keep open/close out of the update path.
- Re-check each embedded feature after the fix, one at a time.
- Same measurements again — the before/after numbers are the deliverable.
- Theme Check clean; test order through checkout.

---

## 3. Shoot list

1. **The before** — adding and removing items with a timer on screen; the flicker.
2. **The plan** — the measurements and the suspected cause in one line.
3. **The hardest part** — the update cycle fixed; the same action, now instant.
4. **QA** — each drawer feature exercised; the test order; Theme Check.
5. **The handoff** — the note with before/after numbers and the rollback line.

---

**Before you start (off the clock):** on dev store A, push the `setup/` "before" theme unpublished — a Dawn duplicate with the planted slow drawer (full redraw on every change, widgets re-initialised on every update, drawer re-opened on every render) — confirm the lag, record shot 1 from the preview link, then log `brief received`.
