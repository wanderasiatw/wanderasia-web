# wanderasia-web

Next.js 14 (App Router) + Tailwind + Sanity site for Wander Asia.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

- Styles: `app/globals.css` (design tokens + component classes from the original HTML design).
- Tours come from Sanity (`tourPackage`), shown in rows by category (free, food, night, hiking, special). If Sanity has no published tours with one of those categories, the launch tours in `lib/tours.ts` are shown.
- Logo files live in `public/` as SVG: `logo.svg` (full, light backgrounds), `logo-light.svg` (full, dark backgrounds), `logo-symbol.svg` and `logo-wordmark.svg` (header).
- `postcss.config.js` must be named exactly that — otherwise Tailwind/CSS is not compiled and the site renders unstyled.
