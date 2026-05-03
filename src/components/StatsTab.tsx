import { HOLES, GameState, TournamentState, POINT_CATEGORIES, ALL_PLAYERS, PLAYERS, initHolePoints, dayTotals, TEAM_NAMES, pointId } from '@/lib/game'
import styles from './StatsTab.module.css'

interface Props { state: GameState }

export default function StatsTab({ state }: Props) {
  const { g: totalG, b: totalB } = dayTotals(state)
  const total = totalG + totalB || 1

  // Count per player per category for this day
  const playerCatCounts: Record<string, Record<string, number>> = {}
  ALL_PLAYERS.forEach(p => { playerCatCounts[p.id] = {} })

  HOLES.forEach(h => {
    const pts = state.points[h.n] ?? initHolePoints()
    ALL_PLAYERS.forEach(player => {
      POINT_CATEGORIES.forEach(cat => {
        const pid = pointId(player.id, cat.key)
        if (pts[pid]) {
          playerCatCounts[player.id][cat.key] = (playerCatCounts[player.id][cat.key] ?? 0) + 1
        }
      })
    })
  })

  return (
    <div>
      {/* Per-category breakdown */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>Points by Category (Today)</div>
        {POINT_CATEGORIES.map(cat => {
          const girlsTotal = PLAYERS.girls.reduce((s, p) => s + (playerCatCounts[p.id][cat.key] ?? 0) * cat.val, 0)
          const boysTotal  = PLAYERS.boys.reduce((s, p)  => s + (playerCatCounts[p.id][cat.key] ?? 0) * cat.val, 0)
          const max = Math.max(girlsTotal, boysTotal, 1)
          return (
            <div key={cat.key} className={styles.catBlock}>
              <div className={styles.catLabel}>{cat.label}</div>
              <div className={styles.barRow}>
                <span className={`${styles.barTeam} ${styles.barTeamG}`}>{TEAM_NAMES.girls}</span>
                <div className={styles.barWrap}>
                  <div className={`${styles.barFill} ${styles.fillGirls}`} style={{ width: `${(girlsTotal / max) * 100}%` }} />
                </div>
                <span className={`${styles.barVal} ${styles.valGirls}`}>{girlsTotal}</span>
              </div>
              <div className={styles.barRow}>
                <span className={`${styles.barTeam} ${styles.barTeamB}`}>{TEAM_NAMES.boys}</span>
                <div className={styles.barWrap}>
                  <div className={`${styles.barFill} ${styles.fillBoys}`} style={{ width: `${(boysTotal / max) * 100}%` }} />
                </div>
                <span className={`${styles.barVal} ${styles.valBoys}`}>{boysTotal}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Player breakdown */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>Player Points Breakdown (Today)</div>
        {ALL_PLAYERS.map(player => {
          const isGirls = player.team === 'girls'
          const color = isGirls ? 'var(--girls)' : 'var(--boys)'
          const totalPts = POINT_CATEGORIES.reduce((s, cat) => s + (playerCatCounts[player.id][cat.key] ?? 0) * cat.val, 0)
          return (
            <div key={player.id} className={styles.playerStatBlock}>
              <div className={styles.playerStatHeader}>
                <span className={styles.playerStatName} style={{ color }}>{player.name}</span>
                <span className={styles.playerStatPts} style={{ color }}>{totalPts} pts</span>
              </div>
              <div className={styles.playerCatGrid}>
                {POINT_CATEGORIES.map(cat => {
                  const count = playerCatCounts[player.id][cat.key] ?? 0
                  if (count === 0) return null
                  return (
                    <div key={cat.key} className={styles.playerCatItem} style={{ borderLeftColor: color }}>
                      <span className={styles.playerCatLabel}>{cat.label}</span>
                      <span className={styles.playerCatVal} style={{ color }}>×{count} = {count * cat.val}pt</span>
                    </div>
                  )
                })}
                {POINT_CATEGORIES.every(cat => !playerCatCounts[player.id][cat.key]) && (
                  <div className={styles.noPoints}>No points yet</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Points share */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>Points Share (Today)</div>
        <div className={styles.shareBar}>
          <div className={styles.shareGirls} style={{ width: `${(totalG / total) * 100}%` }} />
          <div className={styles.shareBoys}  style={{ width: `${(totalB / total) * 100}%` }} />
        </div>
        <div className={styles.shareLegend}>
          <span className={styles.legGirls}>{TEAM_NAMES.girls}: {totalG} pts ({Math.round((totalG / total) * 100)}%)</span>
          <span className={styles.legBoys}>{TEAM_NAMES.boys}: {totalB} pts ({Math.round((totalB / total) * 100)}%)</span>
        </div>
      </div>
    </div>
  )
}
