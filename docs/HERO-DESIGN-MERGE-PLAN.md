# Wander Asia — Tour Page Design Merge Plan v2 (Sample B based)

**Date:** 2026-10-23 · **Status:** PROPOSAL v2 — supersedes the v1 (Sample A based) plan. No code until Adrian approves (design rule).
**Direction set by Adrian:** Sample B (`elephant-mountain-demo.html`) is the base design — editorial, premium, calm. Two elements are borrowed from Sample A. All content stays CMS-driven: a field that is empty in the CMS shows nothing (the Phase 1–2 pattern, confirmed by Adrian).

## The base design (B)

Warm paper background, deep-green ink, serif display headlines, hairline-separated sections. The page opens with a title block (breadcrumb, eyebrow line, big serif title, lede) **above** a captioned photo mosaic — not a photo banner. Below: a quiet facts row, story sections with soft highlight boxes, a step-by-step journey, a "good to know" section, a sticky booking aside, and a soft CTA band before the footer. It matches Wander Asia's green/gold brand and the premium positioning: confidence without sales noise.

## Borrowed from Sample A (only these two)

1. **Main-photo immersion.** B's mosaic main photo is enlarged beyond the demo's proportions (desktop main image ~440–520px tall) so the page still gets a cinematic photo moment.
2. **Info clarity.** The facts row keeps A's scannability discipline: every operational fact (duration, group, language, meeting) is a clear icon + bold value + small label — nothing important buried in prose.

## Section map (B element → real site → data source → when empty)

1. **Breadcrumb** — Taiwan / Taipei / category, derived from the tour's category + location fields; a segment that doesn't exist is dropped.
2. **Intro block** — eyebrow = category · area (already derived for the current hero chip); H1 = CMS title; lede = CMS **subtitle** (hidden when empty); rating line right-aligned = real CMS ratings only. B's "Guest reviews coming soon" placeholder is **not** adopted — with no ratings, the line simply doesn't appear.
3. **Photo mosaic** — main = cover photo, sides = CMS gallery photos, caption chip on the main photo from the photo's CMS caption, and a "View all N photos" chip opening the existing lightbox (TourGallery, already built). Layout adapts: 3+ photos = B's grid; 2 photos = main + one side; 1 photo = a single wide frame; 0 photos = the block is omitted entirely.
4. **Facts row** — meeting point, start time, duration (derived as today) + the CMS `facts` repeater (group size, language, …) in B's circled-icon style; an item appears only when its data exists.
5. **The experience** — CMS body copy + the highlights as soft tinted boxes (Elephant's CMS entry already holds 5 real highlights); no highlights → copy only.
6. **The journey** — body paragraphs as numbered steps (01/02/03, as built in Phase 2); the real CMS start time may label step 1 — no other clock times until T2 verifies them.
7. **Good to know** — the existing PracticalDetails content (included/not-included/bring lists, map link, hiking pack, important info) restyled to B's hairline section. B's invented Q&A is **not** adopted.
8. **Booking aside** — B's flat sticky card (thin border, small shadow, deep-green primary button) around the existing form behaviour: real USD price from the CMS, live total, date minimum, guest cap, Mode A / WhatsApp paths, honest confirmation copy. Trust lines under the button come only from real CMS policy data (e.g. free cancellation, already wired).
9. **Bottom CTA band** *(optional, decided at Adrian's review)* — one generic motivational line (new DICT key ×5) + a button back to the booking card.
10. **Ratings & related tours** — the existing Phase 2 blocks, restyled to the hairline sections; hidden when empty, as today.

## Not adopted

- From A: discount + strikethrough pricing, "spots left" urgency, fake ratings/reviews, "Instant Confirmation", the orange palette, the wishlist heart, the fake payment modal.
- From B itself: its NT$699 placeholder price (the real price is USD from the CMS), its invented FAQ answers, "Up to 10 guests" unless a CMS fact says so, and stock photos standing in for the tour's own — the mosaic uses only the tour's real CMS photos.

## Trade-offs approved with this plan

- **B is text-first.** On mobile the title block precedes the photos; A's photo-first punch is softened — partly offset by the enlarged main photo and the sticky booking bar.
- **The mosaic wants 3 photos.** Elephant Mountain has 2 today and Dongmen's gallery is empty (its tastings still render) — layouts degrade gracefully, and T1 photography remains the biggest single lever on how close the result feels to the samples.

## Build shape (when approved)

- `components/TourDetail.tsx`: photo hero replaced by the intro block + mosaic; sections re-ordered to B's flow. `components/TourGallery.tsx`: mosaic presentation reusing its lightbox. `components/TourFacts.tsx`: B facts-row styling. `components/TourExtras.tsx`: hairline section styling. `app/globals.css`: paper background, serif scale, B proportions — **tour pages only**; navbar, footer and other pages unchanged. No CMS or data-model changes; at most a couple of new DICT labels ×5.
- Verification as before: replica tsc/build + mock/live sweeps (Elephant rich page, Dongmen free tour, Night & Drink no-image), then Adrian's localhost design review (desktop + 390 px) **before** commit — the Phase-2-style checkpoint.
- Applies to all tours through the shared template; Dongmen is the second acceptance page.
