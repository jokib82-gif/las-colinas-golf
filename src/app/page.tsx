'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  HOLES, GameState, HoleScore, HolePoints,
  initHoleScore, initHolePoints,
  saveState, loadState, totalPoints
} from '@/lib/game'
import Header from '@/components/Header'
import ScoreBar from '@/components/ScoreBar'
import HoleCard from '@/components/HoleCard'
import SummaryTab from '@/components/SummaryTab'
import StatsTab from '@/components/StatsTab'
import CourseTab from '@/components/CourseTab'
import styles from './page.module.css'

const TABS = ['Scorecard', 'Summary', 'Stats', 'Course']

function buildInitialState(): GameState {
  const scores: Record<number, HoleScore> = {}
  const points: Record<number, HolePoints> = {}
  HOLES.forEach(h => {
    scores[h.n] = initHoleScore(h.par)
    points[h.n] = initHolePoints()
  })
  return { scores, points }
}

export default function GolfApp() {
  const [state, setState] = useState<GameState>(buildInitialState)
  const [tab, setTab] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = loadState()
    if (saved) setState(saved)
    setHydrated(true)
  }, [])

  const updateState = useCallback((next: GameState) => {
    setState(next)
    saveState(next)
  }, [])

  const handleScoreChange = (holeN: number, team: 'girls' | 'boys', delta: number) => {
    const next = { ...state, scores: { ...state.scores } }
    const cur = next.scores[holeN] ?? initHoleScore(HOLES[holeN - 1].par)
    next.scores[holeN] = {
      ...cur,
      [team]: Math.max(1, Math.min(12, cur[team] + delta))
    }
    updateState(next)
  }

  const handlePointToggle = (holeN: number, pointId: string) => {
    const next = { ...state, points: { ...state.points } }
    const cur = next.points[holeN] ?? initHolePoints()
    next.points[holeN] = { ...cur, [pointId]: !cur[pointId] }
    updateState(next)
  }

  const handleReset = () => {
    if (!window.confirm('Reset all scores and points?')) return
    const fresh = buildInitialState()
    updateState(fresh)
  }

  const { g, b } = totalPoints(state)

  if (!hydrated) return null

  return (
    <div className={styles.app}>
      <Header />
      <ScoreBar girlsTotal={g} boysTotal={b} />

      <div className={styles.tabs}>
        {TABS.map((name, i) => (
          <button
            key={name}
            className={`${styles.tab} ${tab === i ? styles.tabActive : ''}`}
            onClick={() => setTab(i)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === 0 && HOLES.map(h => (
          <HoleCard
            key={h.n}
            hole={h}
            score={state.scores[h.n] ?? initHoleScore(h.par)}
            points={state.points[h.n] ?? initHolePoints()}
            onScoreChange={(team, delta) => handleScoreChange(h.n, team, delta)}
            onPointToggle={(pid) => handlePointToggle(h.n, pid)}
          />
        ))}
        {tab === 1 && <SummaryTab state={state} />}
        {tab === 2 && <StatsTab state={state} />}
        {tab === 3 && <CourseTab onReset={handleReset} />}
      </div>
    </div>
  )
}
