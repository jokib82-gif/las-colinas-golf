import { HOLES, GameState, calcHolePoints, initHolePoints, totalPoints, TEAM_NAMES } from '@/lib/game'
import styles from './SummaryTab.module.css'

interface Props { state: GameState }

export default function SummaryTab({ state }: Props) {
  const { g: totalG, b: totalB } = totalPoints(state)

  return (
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
            const winner = g > b ? '♀' : b > g ? '♂' : '—'
            const winClass = g > b ? styles.leadGirls : b > g ? styles.leadBoys : styles.leadTied
            return (
              <tr key={h.n}>
                <td className={styles.holeCell}>H{h.n}</td>
                <td>{h.par}</td>
                <td className={styles.ptsG}>{g}</td>
                <td className={styles.ptsB}>{b}</td>
                <td>
                  <span className={`${styles.pill} ${winClass}`}>{winner}</span>
                </td>
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
  )
}
