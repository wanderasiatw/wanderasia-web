# wanderasia-web

Next.js 15 (App Router) + Tailwind site for Wander Asia, hosted on Cloudflare Workers with [OpenNext](https://opennext.js.org/cloudflare). Content comes from the Plyndi CMS (separate `plyndi-cms` repo).

```bash
npm install
npm run dev       # http://localhost:3000
npm run preview   # build for Cloudflare and run it locally in the Workers runtime
npm run deploy    # build and deploy to Cloudflare (wrangler must be signed in to Wander Asia's account)
```

- Cloudflare settings are in `wrangler.jsonc`: the Worker name, `CMS_API_URL`, `SITE_URL`, and a service binding called `CMS` that connects the site directly to the `wanderasia-cms` Worker in the same account.

- Styles: `app/globals.css` (design tokens + component classes from the original HTML design).
- Content comes from the Plyndi CMS (separate `plyndi-cms` repo) through `lib/cms.ts`:
  - Tours, shown in rows by category (free, food, night, hiking, special). Only tours with published details get a card; categories with nothing ready yet (flagged "coming soon", or only holding "coming soon" tours) are listed in one "Coming soon" strip of WhatsApp "ask us" links. Each tour card links to its page at `/tours/<slug>`.
  - Categories: row names, descriptions, order and "coming soon" flags.
  - Services (private tours, airport transfer, car with driver, custom itineraries): a section on the home page, a listing page at `/services`, and a page each at `/services/<slug>`. The Private Tours bubble, footer links and the hero's tour-type list use them too. There are also dedicated pages at `/contact` (WhatsApp, email and the inquiry form — no office address and no phone number, as the client asked) and `/about`.
  - `CMS_API_URL` (set in `wrangler.jsonc`) points at the CMS. Without it, or when the CMS can't be reached, the built-in content in `lib/tours.ts` is shown.
  - Pages are rendered on each visit, so published CMS changes show up straight away.
- Languages: the site is in five languages, and each language has its own address. English pages have no prefix (`/tours/...`); the others start with their prefix: Traditional Chinese `/zh` (unchanged, so existing links and Google results keep working), Simplified Chinese `/zh-cn`, Japanese `/ja`, Korean `/ko`. The language switch in the header is a dropdown (EN, 繁中， 简中， 日本語, 한국어) that links to the same page in each language. All pages live under `app/[lang]/`, and `middleware.ts` serves English addresses from `/en` internally (and redirects `/en/...` to the prefix-free address). Use `href()` from `useSite()` (or `localePath()` in `lib/i18n.ts`) for internal links so they stay in the page's language. Fixed labels for all five languages live in the dictionary in `lib/i18n.ts`. CMS text fields follow one pattern (shown for `title` in the comment at the top of `lib/cms.ts`): `title` is English and `titleZh` is Traditional Chinese; `titleZhHans` (Simplified Chinese), `titleJa` and `titleKo` are optional — Simplified Chinese is converted automatically from the Traditional text (opencc-js) when the CMS sends none, and Japanese and Korean fall back to English. Form labels are objects with the same pattern (`{ en, zh, zhHans, ja, ko }`). WhatsApp booking messages stay in English so the team always knows which tour is meant.
- SEO (`lib/seo.ts`):
  - Every page has a canonical address and `hreflang` links to its other-language version.
  - English tour, service and blog pages use the SEO title and description set in the CMS (falling back to the title and short description); pages in the other languages use that language's own title and summary.
  - Structured data for Google: the business (TravelAgency) on the home page, TouristTrip or Service plus breadcrumbs on tour and service pages.
  - `/sitemap.xml` lists every page in all five languages, each with `hreflang` alternates for the other four plus `x-default` (English); tours still "coming soon" are left out, and their pages are marked noindex; `/robots.txt` points to it.
  - Set `SITE_URL` if the site is not served from https://wanderasia.tw.
- Logo files live in `public/` as SVG: `logo.svg` (full, light backgrounds), `logo-light.svg` (full, dark backgrounds), `logo-symbol.svg` and `logo-wordmark.svg` (header).
- `postcss.config.js` must be named exactly that — otherwise Tailwind/CSS is not compiled and the site renders unstyled.

## Online booking

Tour page **Book now** → `/tours/<slug>/book` (Date → Guests → Details → Review) → `/booking/<ref>?t=<token>` (Payment, then the confirmation). Booking terms are at `/terms` (text in `lib/terms.ts`, still a draft for Wander Asia to confirm).

- The CMS owns departures, seats, bookings and payments. The website only shows them and passes requests on: `lib/booking/server.ts` lists the CMS API it expects (departures, create booking, get booking, start checkout with Stripe or ECPay). The payment provider's webhook goes to the CMS, which marks the booking paid.
- A tour shows **Book now** only when the CMS returns departures for it. Until then (and on the live site today) the tour page keeps the WhatsApp booking form, so nothing changes for visitors.
- **Demo mode** for showing the flow on localhost: `.env.local` has `BOOKING_DEMO=1`. It uses sample dates, seats and prices (`lib/booking/demo.ts`; `BOOKING_DEMO_PRICE` sets the sample price for tours without one, default 35), a stand-in payment page, and keeps bookings in memory until the dev server restarts. Every booking page shows a "Demo mode" notice. Never set `BOOKING_DEMO` on Cloudflare.
- Spam protection: a hidden field and a minimum fill time are always on. Cloudflare Turnstile switches on when `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set.

## Blog

`/blog` lists posts with tabs for Tour stories, Guest stories and Travel tips; each post is at `/blog/<slug>` with its photos, the tour it's about, and a "Share your story" box (email or WhatsApp). The home page shows the three newest posts. Menu order: Tours, Services, Blog, Contact, About Us (with a menu button on phones).

- Posts come from the CMS: `lib/blog.ts` lists the API it expects (`/api/v1/posts`, `/api/v1/posts/:slug`) and the fields.
- Demo mode: `BLOG_DEMO=1` in `.env.local` shows four sample posts, labelled "Sample", kept out of the sitemap and search results. Without it and without CMS posts, the blog shows "Stories from our tours are coming soon" and the home page hides the section.
