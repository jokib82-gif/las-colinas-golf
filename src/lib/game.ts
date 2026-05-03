export interface Hole {
  n: number
  par: number
  hcp: number
}

export interface PointDef {
  id: string
  label: string
  val: number
  team: 'girls' | 'boys'
}

export interface HoleScore {
  girls: number
  boys: number
}

export interface HolePoints {
  [pointId: string]: boolean
}

export interface PlayerScores {
  lindaR: number
  lindaF: number
  ingi: number
  johannes: number
}

export interface GameState {
  scores: Record<number, HoleScore>
  points: Record<number, HolePoints>
  playerScores: Record<number, PlayerScores>
}

export interface TournamentState {
  days: Record<number, GameState>
}

export const TEAM_NAMES = {
  girls: "Linda's",
  boys: 'Gagnaperrar',
}

export const PLAYERS = {
  girls: [
    { id: 'lindaR', name: 'Linda R' },
    { id: 'lindaF', name: 'Linda F' },
  ],
  boys: [
    { id: 'ingi',     name: 'Ingi'      },
    { id: 'johannes', name: 'Jóhannes'  },
  ],
}

export const DAYS = [
  { label: 'Sat 3', date: 'May 3' },
  { label: 'Sun 4', date: 'May 4' },
  { label: 'Mon 5', date: 'May 5' },
  { label: 'Tue 6', date: 'May 6' },
  { label: 'Wed 7', date: 'May 7' },
]

// Correct Las Colinas Golf & Country Club, Spain scorecard (Par 71)
export const HOLES: Hole[] = [
  { n: 1,  par: 4, hcp: 7  },
  { n: 2,  par: 4, hcp: 13 },
  { n: 3,  par: 5, hcp: 1  },
  { n: 4,  par: 4, hcp: 9  },
  { n: 5,  par: 3, hcp: 17 },
  { n: 6,  par: 4, hcp: 5  },
  { n: 7,  par: 3, hcp: 15 },
  { n: 8,  par: 4, hcp: 3  },
  { n: 9,  par: 4, hcp: 11 },
  { n: 10, par: 3, hcp: 16 },
  { n: 11, par: 5, hcp: 2  },
  { n: 12, par: 4, hcp: 10 },
  { n: 13, par: 4, hcp: 6  },
  { n: 14, par: 3, hcp: 18 },
  { n: 15, par: 5, hcp: 4  },
  { n: 16, par: 4, hcp: 8  },
  { n: 17, par: 3, hcp: 14 },
  { n: 18, par: 5, hcp: 12 },
]

export const POINT_DEFS: PointDef[] = [
  { id: 'best_indiv_g',    label: 'Best individual score', val: 1, team: 'girls' },
  { id: 'best_indiv_b',    label: 'Best individual score', val: 1, team: 'boys'  },
  { id: 'best_combined_g', label: 'Best combined score',   val: 1, team: 'girls' },
  { id: 'best_combined_b', label: 'Best combined score',   val: 1, team: 'boys'  },
  { id: 'fairway_g',       label: 'Fairway hit',           val: 1, team: 'girls' },
  { id: 'fairway_b',       label: 'Fairway hit',           val: 1, team: 'boys'  },
  { id: 'longest_g',       label: 'Longest drive',         val: 1, team: 'girls' },
  { id: 'longest_b',       label: 'Longest drive',         val: 1, team: 'boys'  },
  { id: 'closest_g',       label: 'Closest to hole',       val: 1, team: 'girls' },
  { id: 'closest_b',       label: 'Closest to hole',       val: 1, team: 'boys'  },
  { id: 'gir_g',           label: 'GIR',                   val: 1, team: 'girls' },
  { id: 'gir_b',           label: 'GIR',                   val: 1, team: 'boys'  },
  { id: 'sand_g',          label: 'Sand save',             val: 1, team: 'girls' },
  { id: 'sand_b',          label: 'Sand save',             val: 1, team: 'boys'  },
  { id: 'oneputt_g',       label: 'One-putt',              val: 1, team: 'girls' },
  { id: 'oneputt_b',       label: 'One-putt',              val: 1, team: 'boys'  },
  { id: 'string_g',        label: 'Putt from string',      val: 1, team: 'girls' },
  { id: 'string_b',        label: 'Putt from string',      val: 1, team: 'boys'  },
  { id: 'birdie_g',        label: 'Birdie',                val: 2, team: 'girls' },
  { id: 'birdie_b',        label: 'Birdie',                val: 2, team: 'boys'  },
  { id: 'eagle_g',         label: 'Eagle',                 val: 3, team: 'girls' },
  { id: 'eagle_b',         label: 'Eagle',                 val: 3, team: 'boys'  },
]

export function initHoleScore(par: number): HoleScore {
  return { girls: par, boys: par }
}

export function initPlayerScores(par: number): PlayerScores {
  return { lindaR: par, lindaF: par, ingi: par, johannes: par }
}

export function initHolePoints(): HolePoints {
  const pts: HolePoints = {}
  POINT_DEFS.forEach(p => { pts[p.id] = false })
  return pts
}

export function buildDayState(): GameState {
  const scores: Record<number, HoleScore> = {}
  const points: Record<number, HolePoints> = {}
  const playerScores: Record<number, PlayerScores> = {}
  HOLES.forEach(h => {
    scores[h.n] = initHoleScore(h.par)
    points[h.n] = initHolePoints()
    playerScores[h.n] = initPlayerScores(h.par)
  })
  return { scores, points, playerScores }
}

export function buildTournamentState(): TournamentState {
  const days: Record<number, GameState> = {}
  DAYS.forEach((_, i) => { days[i] = buildDayState() })
  return { days }
}

export function calcHolePoints(points: HolePoints): { g: number; b: number } {
  let g = 0, b = 0
  POINT_DEFS.forEach(p => {
    if (!points[p.id]) return
    if (p.team === 'girls') g += p.val
    if (p.team === 'boys')  b += p.val
  })
  return { g, b }
}

export function dayTotals(state: GameState): { g: number; b: number } {
  let g = 0, b = 0
  HOLES.forEach(h => {
    const pts = state.points[h.n] ?? initHolePoints()
    const s = calcHolePoints(pts)
    g += s.g; b += s.b
  })
  return { g, b }
}

export function tournamentTotals(state: TournamentState): { g: number; b: number } {
  let g = 0, b = 0
  DAYS.forEach((_, i) => {
    const day = state.days[i] ?? buildDayState()
    const t = dayTotals(day)
    g += t.g; b += t.b
  })
  return { g, b }
}

export function playerTotals(state: TournamentState): Record<string, number> {
  const totals: Record<string, number> = { lindaR: 0, lindaF: 0, ingi: 0, johannes: 0 }
  DAYS.forEach((_, i) => {
    const day = state.days[i] ?? buildDayState()
    HOLES.forEach(h => {
      const ps = day.playerScores?.[h.n] ?? initPlayerScores(h.par)
      Object.keys(totals).forEach(pid => {
        totals[pid] += ps[pid as keyof PlayerScores]
      })
    })
  })
  return totals
}

export function scoreLabel(score: number, par: number): string {
  const d = score - par
  if (d <= -2) return 'Eagle'
  if (d === -1) return 'Birdie'
  if (d === 0)  return 'Par'
  if (d === 1)  return 'Bogey'
  if (d === 2)  return 'Dbl Bogey'
  return '+' + d
}

export function handicapHole(par: number): boolean {
  return par === 4 || par === 5
}

const STORAGE_KEY = 'lcgolf_v3'

export function saveState(state: TournamentState): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

export function loadState(): TournamentState | null {
  try {
    const d = localStorage.getItem(STORAGE_KEY)
    return d ? JSON.parse(d) : null
  } catch { return null }
}
