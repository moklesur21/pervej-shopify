# Brief — s02 · figma-home-sections

**Lane B · Shopify · Weekly feature build · Issued: Mon 23 Nov 2026, 10:00 Dhaka** ← T0, the clock starts here
**Client:** a US marketing agency, for their client, a premium home-fragrance brand launching on Shopify
*Practice build from a public job brief. Anonymised.*

---

## 1. Client brief

*(as the client wrote it)*

"The design is done. Our designer has finished the home page in Figma, desktop and mobile, and the brand is signed off. We now need it built on Dawn exactly as designed, with the sections set up so our team can swap copy and images in the theme editor without a developer.

Mobile is where this client's customers are, so the mobile frames matter more than desktop. It also has to be fast — the last store we launched scored badly and the client heard about it. Home page first; if it goes well, the rest of the pages follow."

**What we know**
- Dawn, current version, on a fresh store; no apps installed
- Home page only for now: hero, three-benefit strip, featured collection, brand story, reviews, newsletter — desktop 1440 and mobile 390 frames in `brief-assets/`
- Fonts and colours are in the frames; images supplied (free-licence)
- A sample catalogue is already on the store

**Done, from the client's side**
- The home page matches the frames at 1440 and 390 — a side-by-side holds up
- Every section editable in the theme editor: copy, images, products
- Lighthouse mobile 90 or better on the dev store; Theme Check clean
- Nothing custom outside the theme

**Constraints**
- Dawn duplicate, pushed unpublished · no apps
- **Deadline:** Fri 27 Nov, end of day · Budget: up to 8 hours

**Deliverables**
Preview link · walkthrough video (2 min) · handover note · rollback note · one thing to flag to the client

---

## 2. Mini approach

- Map each frame to a section: reuse a Dawn section where it already fits, build a custom one where it doesn't; list the map before building.
- Build mobile-first, one section at a time, with schema settings for everything editable; check against the mobile frame before the desktop one.
- Images and fonts handled for speed: sized, lazy below the fold, no font files beyond the two in the design.
- Overlay comparison at 390 and 1440 per section; fix drift before moving on.
- Theme Check, Lighthouse, then a walk through the theme editor the way the client's team will use it.

---

## 3. Shoot list

1. **The before** — the frames beside plain Dawn.
2. **The plan** — the section map.
3. **The hardest part** — the trickiest section reaching the frame on mobile, shown as an overlay.
4. **QA** — side-by-side at 390; Lighthouse mobile.
5. **The handoff** — a copy and image swap in the theme editor, no developer needed.

---

**Before you start (off the clock):** the design must be ours to show — a free-licence Figma Community home-page design (CC0 or CC BY, licence noted in `brief-assets/`), frames exported at 1440 and 390. On dev store B: Dawn duplicate pushed unpublished, sample catalogue loaded. Shot 1 is the frames beside plain Dawn. Then log `brief received`.
