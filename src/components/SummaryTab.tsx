import { HOLES, GameState, TournamentState, calcHolePoints, initHolePoints, dayTotals, TEAM_NAMES, PLAYERS, playerTotals, initPlayerScores } from '@/lib/game'
import styles from './SummaryTab.module.css'

interface Props { state: GameState; tournament: TournamentState }

export default function SummaryTab({ state, tournament }: Props) {
  const { g: totalG, b: totalB } = dayTotals(state)
  const pTotals = playerTotals(tournament)

  return (
    <div>
      {/* Hole by hole */}
      <div className={styles.sectionTitle}>Hole by Hole</div>
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thLeft}>Hole</th>
              <th>Par</th>
              <th className={styles.thGirls}>{TEAM_NAMES.girls}</th>
              <th className={styles.thBoys}>{TEAM_NAMES.boys}</th>
              <th>Lead</th>
            </tr>
          </thead>
          <tbody>
            {HOLES.map(h => {
              const pts = state.points[h.n] ?? initHolePoints()
              const { g, b } = calcHolePoints(pts)
              const winner = g > b ? TEAM_NAMES.girls : b > g ? TEAM_NAMES.boys : '—'
              const winClass = g > b ? styles.leadGirls : b > g ? styles.leadBoys : styles.leadTied
              return (
                <tr key={h.n}>
                  <td className={styles.holeCell}>H{h.n}</td>
                  <td>{h.par}</td>
                  <td className={styles.ptsG}>{g}</td>
                  <td className={styles.ptsB}>{b}</td>
                  <td><span className={`${styles.pill} ${winClass}`}>{winner}</span></td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className={styles.totalRow}>
              <td colSpan={2} className={styles.totalLabel}>Total</td>
              <td>{totalG}</td>
              <td>{totalB}</td>
              <td>{totalG > totalB ? TEAM_NAMES.girls : totalB > totalG ? TEAM_NAMES.boys : 'Tied'}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Player totals */}
      <div className={styles.sectionTitle} style={{ marginTop: 16 }}>Player Totals (Tournament)</div>
      <div className={styles.playerCards}>
        <div className={styles.playerGroup}>
          <div className={styles.playerGroupTitle} style={{ color: 'var(--girls)' }}>{TEAM_NAMES.girls}</div>
          {PLAYERS.girls.map(p => (
            <div key={p.id} className={styles.playerRow}>
              <span className={styles.playerName}>{p.name}</span>
              <span className={styles.playerScore} style={{ color: 'var(--girls)' }}>{pTotals[p.id]}</span>
            </div>
          ))}
        </div>
        <div className={styles.playerGroup}>
          <div className={styles.playerGroupTitle} style={{ color: 'var(--boys)' }}>{TEAM_NAMES.boys}</div>
          {PLAYERS.boys.map(p => (
            <div key={p.id} className={styles.playerRow}>
              <span className={styles.playerName}>{p.name}</span>
              <span className={styles.playerScore} style={{ color: 'var(--boys)' }}>{pTotals[p.id]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
