# Wander Asia — Premium Tour (Phases 1–5): Review, Commit & Deploy Checklist

For Adrian, on the Mac. Work top to bottom; stop and message Hana if anything looks wrong.
Everything happens in Terminal, in `/Users/sainawlin/wanderasia-web`, on branch `booking-work`.

**One thing to know first:** your `.env.local` has no `CMS_API_URL`, so a plain local run shows the site's *built-in* tours, not the live CMS tours. Step 2 starts the server pointed at the live CMS so you can review the real Elephant Mountain page. Don't edit `.env.local`.

---

## Part 1 — Open Terminal and go to the project

1. Spotlight (Cmd+Space) → type `Terminal` → Enter.
2. Run:
   ```
   cd /Users/sainawlin/wanderasia-web
   ```
3. Check you're on the right branch:
   ```
   git branch --show-current
   ```
   It must say `booking-work`. If it doesn't, stop and tell Hana.

## Part 2 — Localhost review (the visual check Hana cannot do)

1. Start the site with live CMS data:
   ```
   CMS_API_URL=https://wanderasia-cms.wanderasia.workers.dev npm run dev
   ```
   Wait for `Ready`. (First page loads can be slow while it compiles — that's normal.)
2. Open http://localhost:3000/tours/elephant-mountain-sunset-hike and check:
   - [ ] A slim **essentials band** under the hero photo (meeting point / start / duration).
   - [ ] A **"Tour details"** panel that now includes the hiking rows: **Difficulty: Easy · Distance: 2.5 km · Climb: 180 m**, the gear list, amenities and the safety note. *(This is the content that never reached the page before.)*
   - [ ] The story paragraphs carry small **01 / 02 / 03** step numbers.
   - [ ] The photo gallery sits under the hero; clicking a photo opens the lightbox; **Esc** closes it, arrow keys move.
   - [ ] Sections for subtitle, ratings, included lists etc. are *absent* — correct: those CMS fields are still empty, and the page hides them rather than faking them.
3. Check the other two tours:
   - [ ] http://localhost:3000/tours/dongmen-street-food-tour — tastings grid shows; it's a free tour, so the booking side is an inquiry, not a price.
   - [ ] http://localhost:3000/tours/night-drink-tour — plain hero with no photo and **no** sticky bar (coming-soon tour). Expected.
4. Mobile width — narrow the browser window to about 390 px (or DevTools device toolbar, Cmd+Shift+M):
   - [ ] On the Elephant page, scroll down: a **booking bar** appears at the bottom; scroll back to the booking card and it hides again.
   - [ ] The green **WhatsApp button floats above** the booking bar — they must not overlap.
   - [ ] Nothing scrolls sideways; text isn't cut off.
5. Desktop width: repeat the scroll check at full width — the sticky bar should *not* appear (mobile only).
6. Console check: DevTools (Cmd+Option+J) → Console tab → reload the Elephant page. Red errors? Screenshot them for Hana. Yellow warnings are fine.
7. Stop the server: click the Terminal window, press **Ctrl+C**.

**If the pages look broken here, do not continue.** Send Hana a screenshot first.

## Part 3 — Commit

1. One-time dependency refresh (the opencc-js lock-file fix):
   ```
   npm install
   ```
2. Look at what changed:
   ```
   git status
   ```
   Expect the Phase 1–5 files (`lib/`, `components/`, `app/`, `docs/`). You will also see `plyndi-cms/` changes — that's the separate CMS workstream; **leave it alone** in this commit. `.env.local` must not appear.
3. Stage only the website files:
   ```
   git add app components lib docs middleware.ts package.json package-lock.json README.md
   ```
4. Commit:
   ```
   git commit -m "Premium tour experience: CMS data wiring, flagship tour page, card upgrades, SEO (Phases 1-5)"
   ```
5. Push:
   ```
   git push origin booking-work
   ```

## Part 4 — Deploy

Do **not** use `npm run deploy` — its build step fails on the Next.js 15.5.27 support-window check. Use the two commands with the flag instead (the same workaround as the gallery deploy):

1. ```
   npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion
   ```
2. ```
   npx opennextjs-cloudflare deploy
   ```
   Wait for the success message with the workers.dev URL. If either step errors, copy the error text to Hana — don't retry in a loop.

## Part 5 — Check the live site

1. https://wanderasia.tw/tours/elephant-mountain-sunset-hike — the essentials band and the hiking details (Easy · 2.5 km · 180 m · gear · safety) are now visible on the live page.
2. https://wanderasia.tw/tours/dongmen-street-food-tour — tastings show; on your phone, the sticky bar behaves as in Part 2.
3. https://wanderasia.tw — home page and tour cards look normal.

## Part 6 — James demo (after the live check passes)

- Send James the Elephant Mountain link. Talking point: the page now carries the full hiking details his CMS entry already had — difficulty, distance, gear, safety.
- The honest next step to name: **photos** (content task T1) — the Elephant gallery still has just 2 photos and Dongmen none; that's now the biggest lever on the page.

## Still open after this (not blocking the deploy)

- Decisions **D1** FAQ · **D2** guide section · **D3** analytics tool · **D4** Next 16 upgrade.
- Japanese/Korean native-speaker check of the Hana-authored strings.
- Content tasks T1–T6 (photos first) — see `docs/PREMIUM-TOUR-FINAL-REPORT.md`, section D.
