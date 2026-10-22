# Wander Asia — Premium Tour Experience
## Merged implementation spec (website)

**Status:** Working spec, agreed 2026-10-23. Merges three sources: (1) Adrian's "Master Implementation Prompt — Wander Asia Premium Tour Experience", (2) Hana's story-first design concept, (3) a verified audit of the actual codebase and live site. **Where this spec and the master prompt disagree, this spec wins** — it is the one written against the real system.

**Mission:** Make Wander Asia's tour pages demonstrably better than TourMeAway's — a premium, boutique, story-led experience that wins customers on attractiveness and trust, not on price or discounts. Do not copy TourMeAway's branding, layout, text, or assets. Never fabricate ratings, reviews, photos, policies, or availability.

---

## 1. Standing rules for this project (non-negotiable)

1. Work only inside `/Users/sainawlin/wanderasia-web` (branch `booking-work`). The `plyndi-cms` folder is a separate project — this spec is **website-only**; anything needing a CMS change is listed as a separate owner-approved task (§10).
2. The agent does **not** commit, push, or deploy. Changes stay uncommitted; Adrian commits/pushes/deploys himself, and client-facing go-live waits for James's agreement.
3. Keep `.env.local` exactly as it is (`BOOKING_DEMO=1`, `BLOG_DEMO=1` are needed for the localhost demo).
4. **Five languages, always.** Every user-visible string ships in EN, 繁中 (`/zh`), 简中 (`/zh-cn`), 日本語 (`/ja`), 한국어 (`/ko`) via the DICT in `lib/i18n.ts` and the `text()` pattern in `lib/cms.ts` (Simplified auto-converts from Traditional when the CMS sends none; JA/KO fall back to English). WhatsApp messages stay in English. New JA/KO strings go on the native-speaker check list in the final report.
5. Page copy lives in the CMS and belongs to the client. The agent does not rewrite published CMS copy; copy improvements are drafted for owner approval (§10, T6) or edited by the owner in the CMS.
6. Existing code style: plain-English comments, no new UI libraries, reuse existing components and CSS tokens. No unnecessary dependencies.
7. Design checkpoints: after Phase 1 and Phase 2 (§11), stop and let Adrian review on localhost before continuing. Small decisions inside an approved phase do not need separate approval.

## 2. Verified current state (audit summary, 2026-10-23)

- **Stack:** Next.js 15 (App Router) + Tailwind, Cloudflare Workers via OpenNext, CMS content from the Plyndi CMS over its API with built-in fallback content in `lib/tours.ts`.
- **Live:** wanderasia.tw runs the current build: five languages, `/services`, `/contact`, `/about`, and the tour photo gallery (deployed 2026-10-23).
- **Gallery (done):** `components/TourGallery.tsx` — cover + CMS `photos` + `videoUrl`, stage, thumbnails, counter, "View all photos", full-screen lightbox (arrows, keyboard, swipe), localized captions. It renders only when a tour has extra photos or a video.
- **The core problem is content, not features:** the Elephant Mountain CMS entry has **2 photos total** (both Taipei 101 scenery, no people, no captions, no video). The Dongmen entry has **no gallery photos at all** (only its 5 tasting images). No gallery design can sell with this little photography.
- **Booking is two-mode (already built):**
  - *Mode A — CMS booking engine:* when a tour has CMS departures, `BookingFlow` offers real dates/seats, a 30-minute hold, and Stripe/ECPay checkout states.
  - *Mode B — WhatsApp inquiry form:* `BookingForm` (name, optional date, guest stepper) opens WhatsApp with a pre-filled English message containing tour name, name, date (or "flexible") and guests, then shows a "we confirm personally" note. It does **not** show a price total.
- **SEO baseline (done):** per-language metadata, hreflang ×5 + x-default, sitemap ×5, `lib/seo.ts` organization/provider/breadcrumb JSON-LD and a trip object on tour pages.
- **Analytics: none.** No analytics or event tracking exists anywhere in the website today.
- **Deploy note:** `npm run deploy` currently needs the OpenNext build flag `--dangerouslyUseUnsupportedNextVersion` because Next 15's support window has ended. Long-term fix = a planned Next 16 upgrade (separate task, needs compatibility testing); until then the flag is the accepted workaround.

## 3. CMS → website data map (the biggest quick win)

The CMS tour form already collects far more than the website reads. Wiring these fields is Phase 1 — no CMS work needed.

| CMS field | Website today | Spec action |
|---|---|---|
| `title` | ✓ hero, cards | keep |
| `subtitle` | ✗ ignored | hero value line under the title |
| `badge` | ✗ ignored | small badge on cards + near price |
| `category`, `price`, `location` | ✓ | keep |
| `mainImage` | ✓ hero + gallery first item | keep |
| `photos` (repeater: image + caption) | ✓ gallery | reposition per §5 (S3) |
| `videoUrl` | ✓ gallery last item | also hero background option (S1) |
| `startTime`, `duration`, `meetingPoint` | ✓ TourFacts | move into the S1 facts strip |
| `mapUrl` | ✗ ignored | "Meeting point" map link in S5 |
| `description`, `body`, `highlights`, `note` | ✓ | keep; restyle in S4 |
| `facts` (repeater: icon + text) | ✗ ignored | key-facts row (group size, language, etc.) in S1/S5 |
| `included`, `notIncluded`, `bring` | ✗ ignored | S5 practical details |
| `importantInfo` ("Good to know") | ✗ ignored | S5 |
| `freeCancellation` + `cancelHours` | ✗ ignored | badge in S1 + booking card (S7) |
| `cancellationPolicy` | ✗ ignored | S7 policy block (+ existing `/terms`) |
| `ratings` (repeater: source, rating, count, url) | ✗ ignored | S1 rating band + S7 detail + JSON-LD (real data only) |
| `relatedTours` (slugs) | ✗ ignored | S9 related row |
| `tastings` (repeater) | ✓ | keep (S6) |
| Hiking pack: `difficulty`, `distanceKm`, `climbM`, `trailArea`, `fitness`, `gear`, `amenities`, `safety` | ✗ ignored | S5 hiking details, shown only when present |

## 4. Design direction (merged)

- **Story-first, but disciplined above the fold** (the master prompt's rule wins over a pure magazine cover): the first screen must already answer *what is this, why this one, how long, where does it start, what does it cost, how do I book* — photo-led, never a large decorative banner that pushes the essentials down.
- Editorial typography (Playfair Display headings + Montserrat body — already the site's fonts), generous whitespace, restrained Taiwan-landscape palette from the existing CSS tokens. Premium = calm and confident, not decorated.
- No discount-led design (no "% off" badges, no bundle pushes). No fake luxury, no excessive gradients/glows/animation, no emoji in UI copy. Subtle motion only, honoring `prefers-reduced-motion`.
- Photos are the product: large, edge-to-edge where the layout allows, real tour photography only. Stock-looking scenery alone is a content failure (§10, T1), not something design hides.
- Every section hides cleanly when its CMS data is empty — no empty shells, no placeholder text.

## 5. Flagship tour page — section spec

Elephant Mountain Sunset Hike is the acceptance test; the same components then serve every tour (§6). Sections in page order:

**S1 — Hero & essentials (above the fold)**
- Photo-led hero: cover image full-width; if `videoUrl` exists, a muted auto-looping embed/poster treatment is Phase-2-optional — default is the still photo (performance and honesty first).
- Breadcrumb (Home / Tours), category + location badge, H1 `title`, one-line `subtitle` as the value proposition.
- Facts strip: start time • duration • meeting point • group size/language (from `facts` when present).
- Rating band **only when `ratings` data exists**: per-source stars + counts, linking to the source URLs. No ratings data → no band, no placeholder.
- Price per person + primary CTA ("Book" → Mode A flow, or scroll to the booking card in Mode B); secondary link "See the journey" → S2.
- `freeCancellation` badge when set.

**S2 — The journey (visual itinerary)**
- Vertical steps with a photo and one or two lines each, alternating on desktop, stacked on mobile. V1 builds steps from `body` paragraphs paired with gallery photos/captions in order.
- **No invented timings.** Clock times appear only after the owner verifies the real itinerary (§10, T2); until then steps are sequenced without times. Never promise an exact sunset time.

**S3 — Photo river & gallery**
- The existing gallery/lightbox moves here as large full-bleed photos interleaved between sections; thumbnails + counter + "View all N photos" stay; alt text = caption, falling back to the tour title; images below the fold lazy-load.

**S4 — About & highlights**
- Existing `body` copy and `highlights` list, restyled editorially (numbered highlights already exist). Copy unchanged (see rule 5).

**S5 — Practical details**
- Two-column definition grid: meeting point (+ `mapUrl` link), start/duration, included ✓ / not included ✗ lists, what to bring, good to know, and the hiking pack (difficulty, distance, climb, trail area, who it suits, gear, on-trail amenities, safety & weather) when present. Each row hides when empty.

**S6 — Tastings** (food tours; exists — keep, align spacing with the new system).

**S7 — Trust & policies**
- Ratings detail (same real `ratings` data as S1, fuller presentation), cancellation policy text + free-cancellation terms, link to `/terms`, and an operator identity line linking to `/about` and `/contact`. Nothing here may be invented; absent data = absent section.

**S8 — FAQ — deferred by design**
- There is no FAQ field in the CMS and no verified Q&A source, so **v1 ships without an FAQ section** rather than inventing one. Phase-2 option: a CMS `faqs` repeater (separate CMS task, owner-approved) — decision D1.

**S9 — Related experiences**
- Cards for the tours listed in `relatedTours` (existing tour-card component, with `badge` + cover). Hides when the list is empty. No invented tours.

**S10 — Booking**
- Mode A (CMS departures): keep `BookingFlow` as is; verify totals, hold and honesty copy ("held for 30 minutes", payment states) in all five languages.
- Mode B (WhatsApp form) upgrades: live **total** (unit price × guests, formatted like the card price) shown before the button; guest stepper capped by the group-size fact when present; date input `min` = today; the WhatsApp message gains the total and the page language stays English-only per rule 4; keep the honest post-send state ("sent — we confirm every booking personally on WhatsApp"). Never label a Mode B request a confirmed reservation.
- Email fallback: the existing inquiry link stays under the card.

**S11 — Sticky mobile booking bar**
- On small screens, a slim bottom bar (price + primary CTA) appears after the hero and hides while the booking card is on screen (IntersectionObserver). Must not cover the floating WhatsApp button or page content — resolve spacing in QA (§9).

## 6. Template reuse

All S1–S11 pieces are components driven by the `Tour` data model, so every tour gets the new page automatically. **Dongmen Street Food Tour is the second acceptance page** (tastings + food journey). Tours with sparse data show fewer sections — that is correct behavior, and the fix is content (§10), not filler.

## 7. Site-wide alignment (after the flagship passes)

- Homepage: hero positioning + featured tours aligned to the new type/spacing; primary CTA clarity.
- Tour cards everywhere: cover, `badge`, rating mini-band when data exists, price line — one consistent card.
- Listings/category rows: same cards, no divergent styles.
- `/about`, `/contact`, `/services` (built 2026-10-21): visual alignment pass only.

## 8. SEO & performance

- Extend the tour JSON-LD: TouristTrip + `offers` from the real price; `aggregateRating` **only** from real CMS `ratings` (never invented). Keep hreflang/sitemap as they are (done).
- Alt text rule (S3) doubles as the image-SEO rule.
- Performance: hero image is the LCP — keep it a plain `<img>`/background as today, no client-side delay; gallery images lazy below the fold; CMS serves originals up to 5 MB, so the owner guidance stands: upload ≤ 2000px wide (the CMS photo field already hints this).
- No new dependencies for any of the above.

## 9. Analytics & measurement (owner decision first)

No tracking exists today. Event taxonomy to implement once the tool is chosen (decision D3 — e.g. Cloudflare Web Analytics + first-party event beacons; no cookies, no personal data):
tour page view • gallery open / photo advance • booking CTA click • date & guest selection • WhatsApp handoff click • email inquiry click • Mode A booking confirmed (from the booking system only — a WhatsApp click is never reported as a sale).
Baseline = the first 4 weeks after launch; report against it, never promise a conversion uplift.

## 10. Content & owner tasks (not agent code)

- **T1 — Photography (highest impact).** Per tour, 8–15 real photos in the CMS `photos` repeater with EN + 繁中 captions, people first. Elephant Mountain shot list, in priority order: (1) Taipei 101 sunset from the trail/viewpoint, (2) Six Giant Rocks viewpoint, (3) the trail and stairs, (4) sunset → blue hour transition, (5) guide + group (with guests' permission), (6) meeting point. Dongmen: street scenes, vendors, the group tasting — beyond the 5 tasting close-ups it already has.
- **T2 — Itinerary verification.** Owner confirms the real step timings for Elephant Mountain before any clock times appear in S2.
- **T3 — Reviews.** Collect real reviews from past guests (the CMS Steps workstream already handles review records); enter only genuine ratings in the CMS `ratings` repeater.
- **T4 — FAQ source material** (only if D1 = yes): owner supplies real Q&A.
- **T5 — Guide profiles:** no CMS field exists; a guides feature is a separate CMS task if the owner wants it. The website must not invent guide names/photos meanwhile.
- **T6 — Copy improvements:** drafted by the agent for approval, entered via the CMS by the owner. Includes an experience-led pass over the Elephant Mountain body copy that keeps every operational fact identical.

## 11. Phases & checkpoints

- **Phase 1 — Data wiring.** `lib/tours.ts` types + `lib/cms.ts` mappers for every ✗ row in §3 (with the standard 5-language fallbacks). *Checkpoint: Adrian verifies a tour with rich CMS data renders the new fields locally.*
- **Phase 2 — Flagship page.** S1–S11 components + TourDetail rebuild + CSS. *Checkpoint: Adrian reviews Elephant Mountain + Dongmen on localhost (desktop + 390px) and approves the design before Phase 3.*
- **Phase 3 — Template reuse.** Confirm all other tours render correctly through the new template; fix data-shape edge cases (no-image tours, coming-soon tours).
- **Phase 4 — Site-wide alignment** (§7).
- **Phase 5 — SEO, performance, analytics** (§8, §9 — analytics after D3).
- **Phase 6 — QA & report** (§12).
- **Deployment:** Adrian's steps (commit → push → `npm run deploy` with the §2 flag), after James's agreement.

## 12. QA checklist & definition of done

- `npx tsc --noEmit` and `npm run build` pass.
- Layout checked at ~360 / 390 / 768 / 1024 / 1440px: no horizontal scroll, no overlaps, sticky bar never covers content or the WhatsApp button.
- Booking tested in both modes end-to-end (Mode A demo booking to confirmation; Mode B WhatsApp message contents verified character-for-character).
- Keyboard navigation + visible focus on gallery, lightbox, forms, sticky bar; lightbox Esc/arrows; `prefers-reduced-motion` respected.
- All five languages spot-checked on the flagship page; new JA/KO strings listed for native review.
- No console errors; no broken links on the flagship pages.
- **Done means:** the flagship page is materially better (hierarchy, photography, trust, booking clarity), reusable across the catalog, honest in every claim, and the final report separates verified work from outstanding content/owner items (§10) in the master prompt's A–F report format.

## 13. Open decisions

- **D1:** FAQ — defer (recommended) or commission the CMS `faqs` repeater now?
- **D2:** Guide section — skip until a CMS guide field exists (recommended), or use a generic "local guide" block sourced from existing About copy?
- **D3:** Analytics tool choice (§9).
- **D4:** Next 16 upgrade — schedule as its own task after this spec ships (recommended), so the deploy flag can be dropped.
