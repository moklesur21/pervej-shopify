# Brief — s03 · click-to-order-journey

**Lane B · Shopify · Weekly feature build · Issued: Wed 7 Oct 2026, 10:00 Dhaka** ← T0, the clock starts here
**Client:** a UK paid-media agency, for their client, a DTC outdoor-apparel brand that moved from WooCommerce to Shopify last month
*Practice build. Anonymised.*

---

## 1. Client brief

*(as the client wrote it)*

"We run paid media for this client: Google, Meta and a bit of TikTok. They moved from WooCommerce to Shopify last month, and we lost something we didn't know we relied on. On WooCommerce, every order showed where the customer came from. On Shopify we get a short conversion summary with the first and last visit, and that's it. Each ad platform claims the sale, the client's numbers don't match ours, and we can't show which campaign actually brought a customer in.

We want the whole journey, from the first ad click to the purchase, recorded on the order in Shopify: where they first came from, what brought them back, what they looked at on the way, and how long it took. Our team should be able to open any order and see it, and pull it into a report. If the same purchase can reach GA4 with the same source attached, even better.

The store runs a cookie banner, so whatever you build has to respect it. Show us it working on a test store first."

**What we know**
- Shopify, Horizon-based theme set up during the migration · checkout and thank-you page on Shopify's current versions (no checkout.liquid, no additional scripts)
- Traffic: Google Ads, Meta ads, TikTok ads, an email newsletter, organic
- The old WooCommerce store showed the order's origin on every order; nothing like it on Shopify beyond the built-in conversion summary
- GA4 property exists; since the move, most purchases there show up as direct or unassigned
- Cookie banner via Shopify's own customer privacy settings
- Nothing tried yet

**Done, from the client's side**
- Open any test order in Shopify admin and see the journey: first touch (source, medium, campaign, ad click ID, landing page, time), the last touch before purchase, number of visits, products viewed, days from first click to order
- First and last touch kept apart: a customer who first clicks a Meta ad and comes back from a Google ad shows both, each in its place
- The same data in the standard orders export and through the Admin API, so a dashboard can pull it later
- The purchase reaches GA4 (test property, DebugView) with the same source and campaign, not as direct
- With tracking declined in the cookie banner, the build stores nothing it shouldn't, shown on a test
- Checkout, thank-you page and storefront speed unaffected; no console errors; a test order completes

**Constraints**
- Dev store only, never live · test payments only · no paid apps · current checkout only: nothing that needs checkout.liquid or additional scripts
- Consent respected through Shopify's customer privacy settings · verify current Shopify customer events and Admin API behaviour at build time
- Out of scope: sending purchases to Meta and Google Ads server-side. The click IDs on the order are what that step would use; name it in the handoff as the next step
- **Deadline:** Sat 10 Oct, end of day · Budget: up to 8 hours

**Deliverables**
Dev-store link · walkthrough video (2–3 min) · handover note with a "what each field means" table · rollback note · one thing to flag to the client

---

## 2. Mini approach

- Map what Shopify already records on each order (the conversion summary) against what the agency wants; the gap is the scope. Don't rebuild what Shopify already gives.
- Capture in the theme on landing: UTMs, ad click IDs (gclid, fbclid, ttclid), referrer, landing page and time. Keep the first touch, update the last touch on each return visit, and only when the visitor's consent allows it.
- Carry the journey on the cart so it lands on the order as order details: no app, no checkout code.
- Steps in between from Shopify's customer events (product views, add to cart, checkout started), stored as a compact summary, not a raw log.
- Purchase to GA4 through a custom pixel with the same source and campaign, joining the visitor's existing GA4 session rather than arriving as a new, sourceless one.
- Prove it with simulated ad-link journeys, each ending in a test order, and compare every order against Shopify's own conversion summary.

---

## 3. Shoot list

1. **The before**: a click on a simulated Meta ad link, a test order, then the order screen showing only Shopify's short conversion summary, with the click ID nowhere.
2. **The plan**: what Shopify records vs what the agency needs, as a two-column gap list.
3. **The hardest part**: a two-visit journey (Meta click first, Google click on the return, then purchase) with both touches landing correctly on one order.
4. **QA**: the order screen, the orders export and GA4 DebugView all showing the same source; the cookie-declined test; a test order through checkout.
5. **The handoff**: the note, the field table, and the next step for the ad platforms.

---

**Before you start (off the clock):** on dev store A, publish the `setup/` "before" theme: Horizon, sample catalogue loaded, test payment gateway on, cookie banner on, a free GA4 test property created. Add `setup/clicks.md` with the simulated ad links: Meta (fbclid), Google (gclid), TikTok (ttclid), newsletter (UTMs only) and direct. Publish the theme rather than previewing it, since customer events need the dev store's storefront (verify). Place one test order from the Meta link, record shot 1 on its order screen, then log `brief received`.
