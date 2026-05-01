# Las Colinas Golf Cup

Girls vs Boys tournament scoring app — Lifetrack format.

Built with **Next.js 14** (App Router) + **TypeScript**, ready to deploy on **Vercel**.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (or on your phone via local network).

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
# Install Vercel CLI once
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts — it auto-detects Next.js
# Your app will be live at https://your-app.vercel.app
```

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Vercel auto-detects Next.js — click **Deploy**

---

## Project Structure

```
src/
  app/
    layout.tsx      # Root layout (fonts, metadata, viewport)
    page.tsx        # Main app shell — tabs, state management
    page.module.css
    globals.css     # CSS variables & reset
  components/
    Header.tsx/.module.css      # Green header with course name
    ScoreBar.tsx/.module.css    # Live score totals (Girls vs Boys)
    HoleCard.tsx/.module.css    # Per-hole scoring + points
    SummaryTab.tsx/.module.css  # Hole-by-hole table
    StatsTab.tsx/.module.css    # Category bar charts
    CourseTab.tsx/.module.css   # Course info + rules + reset
  lib/
    game.ts         # All types, constants, pure logic, localStorage
```

---

## Scoring Rules

| Category | Points |
|---|---|
| Best individual score | 1 |
| Best combined team score | 1 |
| Fairway hit | 1 |
| Longest drive on fairway | 1 |
| Green in Regulation (GIR) | 1 |
| Sand save | 1 |
| One-putt | 1 |
| Putt holed from string | 1 |
| Birdie | 2 |
| Eagle | 3 |

**Handicap:** Girls receive +1 stroke on all Par 4 and Par 5 holes.

---

## Customizing

- **Course holes:** Edit `HOLES` array in `src/lib/game.ts`
- **Point definitions:** Edit `POINT_DEFS` in `src/lib/game.ts`
- **Colors:** All CSS variables are in `src/app/globals.css`
- **Fonts:** Loaded via Google Fonts in `globals.css`

---

## Tech Stack

- [Next.js 14](https://nextjs.org) — App Router
- [TypeScript](https://www.typescriptlang.org)
- CSS Modules — scoped styles, zero dependencies
- localStorage — scores persist across sessions
- [Vercel](https://vercel.com) — deployment
