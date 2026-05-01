import styles from './ScoreBar.module.css'

interface Props {
  girlsTotal: number
  boysTotal: number
  girlsLabel?: string
  boysLabel?: string
  compact?: boolean
}

export default function ScoreBar({ girlsTotal, boysTotal, girlsLabel = "Linda's", boysLabel = 'Gagnaperrar', compact }: Props) {
  const diff = girlsTotal - boysTotal
  let leadLabel = 'All Square'
  let leadClass = styles.leadTied
  if (diff > 0) { leadLabel = `${girlsLabel} lead +${diff}`; leadClass = styles.leadGirls }
  if (diff < 0) { leadLabel = `${boysLabel} lead +${Math.abs(diff)}`; leadClass = styles.leadBoys }

  if (compact) {
    return (
      <div className={styles.compact}>
        <div className={`${styles.compactTeam} ${styles.teamGirls}`}>
          <span className={styles.compactName}>{girlsLabel}</span>
          <span className={styles.compactPts}>{girlsTotal}</span>
        </div>
        <span className={`${styles.lead} ${leadClass}`}>{leadLabel}</span>
        <div className={`${styles.compactTeam} ${styles.teamBoys}`}>
          <span className={styles.compactPts}>{boysTotal}</span>
          <span className={styles.compactName}>{boysLabel}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.bar}>
      <div className={styles.teams}>
        <div className={`${styles.team} ${styles.teamGirls}`}>
          <div className={styles.name}>{girlsLabel}</div>
          <div className={styles.pts}>{girlsTotal}</div>
        </div>
        <div className={styles.vs}>pts</div>
        <div className={`${styles.team} ${styles.teamBoys}`}>
          <div className={styles.name}>{boysLabel}</div>
          <div className={styles.pts}>{boysTotal}</div>
        </div>
      </div>
      <div className={styles.meta}>
        <span className={`${styles.lead} ${leadClass}`}>{leadLabel}</span>
      </div>
    </div>
  )
}
