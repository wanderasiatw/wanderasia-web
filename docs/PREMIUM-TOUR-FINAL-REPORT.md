# Wander Asia — Premium Tour Experience: Final Report

**Date:** 2026-10-23 · **Spec:** `docs/PREMIUM-TOUR-SPEC.md` · **Scope:** website only (`/Users/sainawlin/wanderasia-web`, branch `booking-work`)
**Status:** Phases 1–5 implemented, Phase 6 QA complete. All Phase 1–5 changes are **uncommitted** on the Mac; commit/push/deploy is Adrian's step, after James's agreement.

## A. Audit summary (starting state)

The merged spec's verified audit found: a working tour gallery whose live content was 2 photos on the flagship tour and none on the second; a CMS tour form collecting 12+ fields the website never read (subtitle, badge, facts, included lists, cancellation, ratings, related tours, the full hiking pack) — Elephant Mountain's entry already held a complete hiking pack that never reached the page; a two-mode booking system (CMS booking engine + WhatsApp inquiry form without a price total); an SEO baseline already in place (metadata, hreflang ×5, sitemap, JSON-LD without ratings); and no analytics anywhere.

## B. Changes made

- **Phase 1 — Data wiring.** `lib/tours.ts`: `Tour` gained all §3 fields plus `TourFact` / `TourRating` / `TourHiking` types; built-in tours got empty defaults. `lib/cms.ts`: `toTour` + new `toHiking` map the full CMS form with the standard five-language fallbacks.
- **Phase 2 — Flagship page.** `components/TourDetail.tsx`: hero subtitle + CMS badge chip, essentials band, journey step numbers on the story paragraphs, free-cancellation line in the booking card (`id="book"`). `components/TourFacts.tsx` rewritten as the essentials strip (meeting/start/duration + facts repeater with an icon map). **New** `components/TourExtras.tsx`: `RatingChips`, `RatingsBlock`, `PracticalDetails` (lists, map link, hiking pack with translated difficulty), `PoliciesBlock`, `RelatedTours`. **New** `components/StickyBookBar.tsx`: mobile booking bar that hides while the booking card is on screen. `components/BookingForm.tsx`: live total (+ total in the WhatsApp message), date `min` = today, guest cap from the group-size fact (else 30). Tour page resolves `relatedTours`; `TourCard` exported for reuse. `lib/i18n.ts`: +28 keys × 5 languages. `app/globals.css`: premium-page styles.
- **Phase 3 — Template reuse.** Verification only; no code changes were needed (see C).
- **Phase 4 — Site-wide alignment.** `TourCard` shows the CMS badge as a cover chip and a rating line (first numeric score + count) — applies to home featured tours, listings and related tours automatically. Service cards already shared the card shell; the homepage hero was deliberately left unchanged (its search form is the CTA; changing it is a design decision, not alignment).
- **Phase 5 — SEO & performance.** `lib/seo.ts` `tourAggregateRating` + tour JSON-LD: `aggregateRating` emitted **only** from real CMS ratings (the row with the most reviews; absent otherwise). Lazy loading added to card covers and tasting images (`loading="lazy"`, `decoding="async"`); gallery thumbnails were already lazy; the hero stays as-is per spec. Analytics not implemented — the tool decision (D3) is still open.
- Earlier in the same program and already live (deployed 2026-10-23): the tour photo gallery + lightbox (`components/TourGallery.tsx`).

## C. Verification (what was actually checked)

- `npx tsc --noEmit` clean and `npm run build` passing at every phase, including a fresh final run for this report.
- Mock-CMS end-to-end: every Phase 1 field reaches the page payload; Phase 2 sections render with rich data in EN, JA and Simplified Chinese; the WhatsApp form shows the total row and the date minimum; JSON-LD carries `AggregateRating` 4.9 / 103 reviews with ratings data and omits it without.
- Live-CMS sweep (the real catalog): all 3 tours render correctly through the new template — Elephant Mountain with its full hiking pack (Easy · 2.5 km · 180 m · gear · safety), Dongmen as a free tour with tastings, Night & Drink as a no-image coming-soon tour (plain hero, no sticky bar). Flagship page returns 200 with correctly localized section headings in all five languages; home, tours, services, about, contact and blog all return 200 with no application errors in the server log.
- Internal links on the flagship page and home: 23 checked, 20 return 200. The 3 exceptions are the logo SVGs, which 404 only inside the test replica (its `public/` folder isn't copied there); the files are verified present on the Mac and live.
- Code-level accessibility: lightbox keyboard (Esc / arrows) and swipe; sticky bar `aria-hidden` + tab-index management and a `prefers-reduced-motion` rule; focus-visible outlines on cards and the booking calendar.
- **Not verified** (needs Adrian or a real browser): visual layout at 360/390/768/1024/1440 px, including the sticky bar vs. WhatsApp button in real rendering; browser console errors; real-device behavior; Lighthouse scores (not run — no numbers are claimed); native-speaker review of the Japanese/Korean strings (the 28 new keys join the earlier Hana-authored sets on that list).

## D. Outstanding

- **Content (client/owner — spec §10):** T1 per-tour photography (Elephant Mountain has 2 photos; Dongmen has no gallery photos) with captions — the single highest-impact remaining item; T2 itinerary timing verification; T3 entering real ratings (every live ratings list is empty, so all rating UI correctly stays hidden); T4 FAQ source material if D1 is approved; T5 guide profiles (needs separate CMS work); T6 CMS copy and translations — live tours are English-only in the CMS, and subtitle/badge/facts/included/cancellation/related are empty on the live entries, so those sections stay hidden until filled.
- **Decisions:** D1 FAQ (defer recommended), D2 guide section, D3 analytics tool, D4 Next 16 upgrade timing.
- **Process:** Adrian's localhost visual review of Phases 2–5; commit → push → deploy; James's agreement before client-facing go-live.

## E. Deployment state

Nothing from Phases 1–5 is deployed. Every changed file sits uncommitted in `/Users/sainawlin/wanderasia-web` on `booking-work`, each verified byte-identical to the tested replica. The gallery work from earlier in the program is live on wanderasia.tw (deployed 2026-10-23). Deploy sequence for Adrian: commit → push → `npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion` → `npx opennextjs-cloudflare deploy` (the flag is needed until the Next 16 upgrade, D4).

## F. Next 3 priorities

1. **Photography + CMS content for Elephant Mountain** (T1 + filling subtitle, facts, included, cancellation, related): turns on most of the new page with content that already has a home in the CMS.
2. **Adrian's visual review, then commit/deploy of Phases 1–5**, followed by the James demo.
3. **Decide D3 (analytics)** so measurement starts with the launch baseline; schedule D4 (Next 16) as its own task.
