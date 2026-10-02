# wanderasia-web

Next.js 14 (App Router) + Tailwind + Sanity site for Wander Asia.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

- Styles: `app/globals.css` (design tokens + component classes from the original HTML design).
- Tours come from Sanity (`tourPackage`). If Sanity has no published tours, `lib/tours.ts` fallback data is shown.
- `postcss.config.js` must be named exactly that — otherwise Tailwind/CSS is not compiled and the site renders unstyled.
