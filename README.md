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
  - Tours, shown in rows by category (free, food, night, hiking, special).
  - Categories: row names, descriptions, order and "coming soon" flags.
  - Services (private tours, airport transfer, car with driver, custom itineraries): a section on the home page and a page each at `/services/<slug>`. The Private Tours bubble, footer links and the hero's tour-type list use them too.
  - `CMS_API_URL` (set in `wrangler.jsonc`) points at the CMS. Without it, or when the CMS can't be reached, the built-in content in `lib/tours.ts` is shown.
  - Pages are rendered on each visit, so published CMS changes show up straight away.
- Languages: everything visitors read has English and Chinese (中文) text, switched in the browser. Chinese CMS fields fall back to English when empty; fixed labels live in the dictionary in `components/SiteProvider.tsx`. WhatsApp booking messages stay in English so the team always knows which tour is meant.
- SEO: tour and service pages use the SEO title and description set in the CMS (falling back to the title and short description). Set `SITE_URL` if the site is not served from https://wanderasia.tw.
- Logo files live in `public/` as SVG: `logo.svg` (full, light backgrounds), `logo-light.svg` (full, dark backgrounds), `logo-symbol.svg` and `logo-wordmark.svg` (header).
- `postcss.config.js` must be named exactly that — otherwise Tailwind/CSS is not compiled and the site renders unstyled.
