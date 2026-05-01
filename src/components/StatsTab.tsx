import { HOLES, GameState, POINT_DEFS, initHolePoints, totalPoints } from '@/lib/game'
import styles from './StatsTab.module.css'

interface Props { state: GameState }

const CATEGORIES = [
  { label: 'Best individual',  gid: 'best_indiv_g',    bid: 'best_indiv_b'    },
  { label: 'Best combined',    gid: 'best_combined_g', bid: 'best_combined_b' },
  { label: 'Fairway hits',     gid: 'fairway_g',       bid: 'fairway_b'       },
  { label: 'Closest to hole',  gid: 'closest_g',       bid: 'closest_b'       },
  { label: 'GIR',              gid: 'gir_g',           bid: 'gir_b'           },
  { label: 'Sand saves',       gid: 'sand_g',          bid: 'sand_b'          },
  { label: 'One-putts',        gid: 'oneputt_g',       bid: 'oneputt_b'       },
  { label: 'String putts',     gid: 'string_g',        bid: 'string_b'        },
  { label: 'Birdies',          gid: 'birdie_g',        bid: 'birdie_b'        },
  { label: 'Eagles',           gid: 'eagle_g',         bid: 'eagle_b'         },
]

export default function StatsTab({ state }: Props) {
  const { g: totalG, b: totalB } = totalPoints(state)
  const total = totalG + totalB || 1

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Performance by Category</div>
        {CATEGORIES.map(cat => {
          let g = 0, b = 0
          HOLES.forEach(h => {
            const pts = state.points[h.n] ?? initHolePoints()
            if (pts[cat.gid]) g++
            if (pts[cat.bid]) b++
          })
          const max = Math.max(g, b, 1)
          return (
            <div key={cat.label} className={styles.catBlock}>
              <div className={styles.catLabel}>{cat.label}</div>
              <div className={styles.barRow}>
                <span className={`${styles.barTeam} ${styles.barTeamG}`}>Girls</span>
                <div className={styles.barWrap}>
                  <div className={`${styles.barFill} ${styles.fillGirls}`} style={{ width: `${(g / max) * 100}%` }} />
                </div>
                <span className={`${styles.barVal} ${styles.valGirls}`}>{g}</span>
              </div>
              <div className={styles.barRow}>
                <span className={`${styles.barTeam} ${styles.barTeamB}`}>Boys</span>
                <div className={styles.barWrap}>
                  <div className={`${styles.barFill} ${styles.fillBoys}`} style={{ width: `${(b / max) * 100}%` }} />
                </div>
                <span className={`${styles.barVal} ${styles.valBoys}`}>{b}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Points Share</div>
        <div className={styles.shareBar}>
          <div className={styles.shareGirls} style={{ width: `${(totalG / total) * 100}%` }} />
          <div className={styles.shareBoys}  style={{ width: `${(totalB / total) * 100}%` }} />
        </div>
        <div className={styles.shareLegend}>
          <span className={styles.legGirls}>♀ Girls: {totalG} pts ({Math.round((totalG / total) * 100)}%)</span>
          <span className={styles.legBoys}>♂ Boys: {totalB} pts ({Math.round((totalB / total) * 100)}%)</span>
        </div>
      </div>
    </div>
  )
}
