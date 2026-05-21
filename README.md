# SortRight

A friendly, gamified guide to sorting waste and living sustainably.

- **Stack**: Next.js 15 (App Router) · TypeScript · Tailwind v3 · framer-motion · zustand · Leaflet
- **Aesthetic**: organic / earthy — sage greens, terracotta clays, cream paper, Fraunces serif headings

## Run it

```bash
cd SortRight
npm install      # already done if you got the project here
cp .env.example .env.local   # optional — Earth911 key
npm run dev
```

Open http://localhost:3000.

## Scripts

| script | what |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run start` | production server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `next lint` |

## Routes

| route | what |
| --- | --- |
| `/` | landing — hero, four bins overview, features, EPA stats, common mistakes |
| `/sort` | drag-and-drop sorting game (10-item rounds, streaks, badges) |
| `/learn` | searchable item directory with bin / category filters (`?bin=recycle` deep link) |
| `/learn/[id]` | per-item detail with prep tips, alternatives, related items |
| `/quiz` | three quiz levels (Greenhorn / Sorter / Master) — earns `quiz-greenhorn`, `quiz-sorter`, `quiz-master` |
| `/locate` | geolocation + Leaflet map + nearby drop-offs (Earth911 with stub fallback) |
| `/challenges` | 3 daily eco-challenges + streak tracking |
| `/impact` | CO₂ + landfill saved, badges, recent activity, comparison vs national average |
| `/sustainable-living` | editorial tips by area (kitchen, bath, wardrobe, tech, transport, community) |

## API

| endpoint | purpose | source |
| --- | --- | --- |
| `GET /api/dropoffs?lat&lng&material&radius` | nearby recycling/HHW/compost centers | Earth911 (if key) → curated stub of ~47 metros |
| `GET /api/stats` | EPA Facts & Figures 2018 totals | static (`s-maxage=86400`) |

## Configuration

Environment variables (see `.env.example`):

- `EARTH911_API_KEY` (optional) — when set, `/api/dropoffs` proxies to Earth911. Without it the route silently returns curated stub data.

## Project structure

```
src/
  app/
    api/{dropoffs,stats}/route.ts
    {sort,learn,quiz,locate,challenges,impact,sustainable-living}/page.tsx
    layout.tsx · page.tsx · globals.css
  components/
    landing/ · sort/ · learn/ · quiz/ · locate/ · challenges/ · impact/
    site-header.tsx · site-footer.tsx · motion-primitives.tsx
    ui/{button,card}.tsx
  lib/
    bins.ts · items.ts · store.ts · api.ts · utils.ts
    sort-game.ts · quiz-data.ts · challenges-data.ts
    dropoff-mock.ts · stats-data.ts
```

## Design tokens

Tailwind config exposes `sage` (50–900), `clay` (50–900), `cream`, `ink` (DEFAULT/soft/muted), plus accent colors `moss`, `bark`, `leaf`, `berry`, `sun`. Custom radii (`rounded-organic`), shadows (`shadow-soft`, `shadow-leaf`), and animations (`animate-drift`, `animate-sway`).

Motion is centralized in `src/components/motion-primitives.tsx` (`FadeUp`, `Drift`, `easeOrganic`, `driftSpring`).

## State

Persisted to `localStorage` under `sortright:store:v1` via zustand:

- `totalScore`, `currentStreak`, `highestStreak`
- `badges[]`, `completedChallenges[]`, `quizLevels{}`, `impactLog[]`

Always read via `useHydrated()` (in `src/lib/api.ts`) to avoid SSR mismatch.

## Mobile

Layout is mobile-first throughout. A future React Native / Expo port can reuse the data layer (`src/lib/{bins,items,store,sort-game,quiz-data,challenges-data}.ts`) verbatim — those are framework-agnostic.
