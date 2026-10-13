# wanderasia-web

Next.js 14 (App Router) + Tailwind site for Wander Asia. Tours come from the Plyndi CMS (separate `plyndi-cms` repo), with Sanity as the source until that is switched on.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

- Styles: `app/globals.css` (design tokens + component classes from the original HTML design).
- Tours are shown in rows by category (free, food, night, hiking, special). Pages read them through `lib/cms.ts`:
  - With `CMS_API_URL` set (e.g. `https://plyndi-cms.<account>.workers.dev`), tours come from the Plyndi CMS API.
  - Without it, they still come from Sanity (`lib/sanity.ts`, `tourPackage`). Sanity code and packages are removed once the CMS is live.
  - Either way, when the source has no published tours in these categories or can't be reached, the launch tours in `lib/tours.ts` are shown.
  - Pages refresh their data at most every 60 seconds, so CMS edits show up within about a minute.
- Logo files live in `public/` as SVG: `logo.svg` (full, light backgrounds), `logo-light.svg` (full, dark backgrounds), `logo-symbol.svg` and `logo-wordmark.svg` (header).
- `postcss.config.js` must be named exactly that — otherwise Tailwind/CSS is not compiled and the site renders unstyled.
