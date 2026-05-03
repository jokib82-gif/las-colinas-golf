'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  HOLES, DAYS, TournamentState, GameState, HoleScore, HolePoints, PlayerScores,
  initHoleScore, initHolePoints, initPlayerScores, buildDayState, buildTournamentState,
  saveState, loadState, dayTotals, tournamentTotals, TEAM_NAMES
} from '@/lib/game'
import Header from '@/components/Header'
import ScoreBar from '@/components/ScoreBar'
import HoleCard from '@/components/HoleCard'
import SummaryTab from '@/components/SummaryTab'
import StatsTab from '@/components/StatsTab'
import CourseTab from '@/components/CourseTab'
import styles from './page.module.css'

const INNER_TABS = ['Scorecard', 'Summary', 'Stats', 'Course']

export default function GolfApp() {
  const [tournament, setTournament] = useState<TournamentState>(buildTournamentState)
  const [activeDay, setActiveDay] = useState(0)
  const [innerTab, setInnerTab] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = loadState()
    if (saved) setTournament(saved)
    setHydrated(true)
  }, [])

  const updateTournament = useCallback((next: TournamentState) => {
    setTournament(next)
    saveState(next)
  }, [])

  const dayState: GameState = tournament.days[activeDay] ?? buildDayState()

  const handleScoreChange = (holeN: number, team: 'girls' | 'boys', delta: number) => {
    const day = tournament.days[activeDay] ?? buildDayState()
    const cur = day.scores[holeN] ?? initHoleScore(HOLES[holeN - 1].par)
    updateTournament({
      days: {
        ...tournament.days,
        [activeDay]: {
          ...day,
          scores: {
            ...day.scores,
            [holeN]: { ...cur, [team]: Math.max(1, Math.min(12, cur[team] + delta)) }
          }
        }
      }
    })
  }

  const handlePointToggle = (holeN: number, pointId: string) => {
    const day = tournament.days[activeDay] ?? buildDayState()
    const cur = day.points[holeN] ?? initHolePoints()
    updateTournament({
      days: {
        ...tournament.days,
        [activeDay]: {
          ...day,
          points: { ...day.points, [holeN]: { ...cur, [pointId]: !cur[pointId] } }
        }
      }
    })
  }

  const handlePlayerScoreChange = (holeN: number, playerId: string, delta: number) => {
    const day = tournament.days[activeDay] ?? buildDayState()
    const cur = day.playerScores?.[holeN] ?? initPlayerScores(HOLES[holeN - 1].par)
    const curVal = cur[playerId as keyof PlayerScores] ?? HOLES[holeN - 1].par
    updateTournament({
      days: {
        ...tournament.days,
        [activeDay]: {
          ...day,
          playerScores: {
            ...day.playerScores,
            [holeN]: { ...cur, [playerId]: Math.max(1, Math.min(12, curVal + delta)) }
          }
        }
      }
    })
  }

  const handleResetDay = () => {
    if (!window.confirm(`Reset scores for ${DAYS[activeDay].date}?`)) return
    updateTournament({ days: { ...tournament.days, [activeDay]: buildDayState() } })
  }

  const { g: dayG, b: dayB } = dayTotals(dayState)
  const { g: totalG, b: totalB } = tournamentTotals(tournament)

  if (!hydrated) return null

  return (
    <div className={styles.app}>
      <Header />

      <ScoreBar
        girlsTotal={totalG}
        boysTotal={totalB}
        girlsLabel={`${TEAM_NAMES.girls} total`}
        boysLabel={`${TEAM_NAMES.boys} total`}
      />

      {/* Day tabs */}
      <div className={styles.dayTabs}>
        {DAYS.map((d, i) => {
          const dt = dayTotals(tournament.days[i] ?? buildDayState())
          const hasData = dt.g > 0 || dt.b > 0
          return (
            <button
              key={i}
              className={`${styles.dayTab} ${activeDay === i ? styles.dayTabActive : ''}`}
              onClick={() => setActiveDay(i)}
            >
              <span className={styles.dayLabel}>{d.label}</span>
              {hasData && <span className={styles.dayScore}>{dt.g}–{dt.b}</span>}
            </button>
          )
        })}
      </div>

      <ScoreBar
        girlsTotal={dayG}
        boysTotal={dayB}
        girlsLabel={TEAM_NAMES.girls}
        boysLabel={TEAM_NAMES.boys}
        compact
      />

      <div className={styles.tabs}>
        {INNER_TABS.map((name, i) => (
          <button
            key={name}
            className={`${styles.tab} ${innerTab === i ? styles.tabActive : ''}`}
            onClick={() => setInnerTab(i)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {innerTab === 0 && HOLES.map(h => (
          <HoleCard
            key={h.n}
            hole={h}
            score={dayState.scores[h.n] ?? initHoleScore(h.par)}
            points={dayState.points[h.n] ?? initHolePoints()}
            playerScores={dayState.playerScores?.[h.n] ?? initPlayerScores(h.par)}
            onScoreChange={(team, delta) => handleScoreChange(h.n, team, delta)}
            onPointToggle={(pid) => handlePointToggle(h.n, pid)}
            onPlayerScoreChange={(pid, delta) => handlePlayerScoreChange(h.n, pid, delta)}
          />
        ))}
        {innerTab === 1 && <SummaryTab state={dayState} tournament={tournament} />}
        {innerTab === 2 && <StatsTab state={dayState} />}
        {innerTab === 3 && <CourseTab onReset={handleResetDay} dayLabel={DAYS[activeDay].date} />}
      </div>
    </div>
  )
}
