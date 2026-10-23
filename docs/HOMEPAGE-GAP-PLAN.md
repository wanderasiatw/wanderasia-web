# Wander Asia — Homepage Gap Plan

**Date:** 2026-10-23 · **Status:** PROPOSAL — no code until Adrian approves (design rule).
**Basis:** the live homepage at wanderasia.tw, read in full on 2026-10-23, checked against a generic travel-site best-practice analysis Adrian shared. Roughly half of that analysis describes things the site already has; this plan covers only the real gaps, split by who can close them.

## Already on the live homepage (no action)

- Hero with a value proposition ("Taipei, the way locals live it", local-guides eyebrow, local-led sub-line) and the tour **search form**.
- A mini trust row under the hero (Local Guides · 24/7 WhatsApp Support).
- Tours grouped by category (Food Tours, Hiking Tours), cards with photo, location, start time and duration; badge and rating lines already wired to CMS data.
- "How it works" (3 honest steps, WhatsApp request flow), a Private Tours callout, and "Why Choose Wander Asia?" with four USPs.

## Real gaps — CODE (website only, built by Hana on approval)

- **G1 · Homepage proof strip.** Tour-level ratings, once filled in the CMS, appear on cards, tour pages and Google rich results — but the homepage itself has no place where proof can surface. Build a slim strip under the hero that renders **only real CMS rating data** (stars, score, review count, source, link out — the same data rule as the tour pages' `tourAggregateRating`) and renders nothing at all while every tour's ratings are empty.
- **G2 · Guest reviews section.** A homepage section listing the rating rows from all tours (platform, score, count, link). Written testimonial quotes are deliberately excluded — the CMS stores scores and counts, not review text (see decision D-H2).
- **G3 · Card price check.** Verify the price shows on the homepage category cards exactly as it does on /tours cards; if the homepage blocks use a slimmer card without it, align them. Audit-and-align only — no redesign.
- **G4 · Hero photo crossfade (Adrian's choice, 2026-10-23).** The hero background becomes a slow crossfade of up to **3 photos managed in the CMS admin** — fade only, no sliding or swiping (the fast 3–5-second auto-slideshow form stays rejected: it fights the search form for attention). One photo every ~6–7 seconds; the headline, sub-line and search form stay fixed and unchanged above the photos. Rules: with a single photo the hero is static; the rotation pauses on hover, touch and keyboard focus, and when the tab is hidden; no motion at all for visitors with `prefers-reduced-motion`; small dot indicators only, no arrows. Performance: the first photo loads eagerly (it is the page's largest element), the rest lazy-load after first paint, all under the existing dark overlay so the text stays legible; an optional per-photo caption/credit line (from the CMS) keeps attribution possible while any stock photo remains. CMS scope: first verify whether the existing Gallery module can source the slides; if it cannot, add a small hero-slides list (photo + optional caption) to the CMS as a separate, minimal step — nothing else in the CMS changes. This does not replace C1: three of the client's own photos in the crossfade is the goal; three stock photos rotating is not.

## Real gaps — CONTENT (client / James; no code can substitute)

- **C1 · The hero photo is third-party stock.** The homepage opens with a Jiufen photo from Wikimedia Commons (CC BY 3.0, credited on the page). A premium brand should open with its own photography: replace it with the client's best wide shot (part of content task T1). With G4, the ask becomes up to three own wide shots — one per crossfade slide.
- **C2 · Real reviews into the CMS (task T3).** Fill each tour's ratings (platform, score, count, link) from the client's real Google / Tripadvisor presence. G1 and G2 light up automatically the moment this exists — for every tour, not just Elephant Mountain.
- **C3 · Guest photos with permission**, for a future testimonials area; same pipeline as T1.

## Considered and rejected (do not build)

- An invented trust bar ("Rated 4.9/5 by 1,000+ travelers") — no such data exists; fabrication breaks the premium positioning and the honesty rule.
- "Top-selling / bestseller" labels — there is no sales data to rank by.
- "Instant booking" wording — bookings are WhatsApp requests confirmed by a person; the current copy says so honestly.
- Invented tours in the grid (e.g. a "Jiufen Sunset" tour) — the catalog has three tours.
- A mobile bottom navigation bar — considered; the site has a mobile menu, a floating WhatsApp button, and sticky booking bars on tour pages. Not needed now.

## Decisions for Adrian / James

- **D-H1 · Hero headline.** Keep "Taipei, the way locals live it", or test a sharper alternative? Copy-only change; the wording is the client's call.
- **D-H2 · Written testimonials.** If James wants guest quotes on the site, the CMS needs a review-text field — a separate CMS workstream, scoped only on a yes here.
- **D-H3 · Instagram strip.** Possible later with the client's account and real posts; deferred by default (third-party weight, low conversion value next to C1/C2).

## Build shape (when approved)

- One small website round: homepage components + CSS + a few DICT keys ×5 languages. No CMS schema change for G1–G3, no other pages touched.
- Verification: replica build + mock ratings (strip and section appear, correctly formatted in all five languages) + live data (both stay hidden until C2 lands — that hidden state is the correct behaviour today), then Adrian's commit/push/deploy and live check, as with the tour-page redesign.
