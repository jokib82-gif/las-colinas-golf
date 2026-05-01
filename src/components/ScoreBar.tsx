import styles from './ScoreBar.module.css'

interface Props {
  girlsTotal: number
  boysTotal: number
}

export default function ScoreBar({ girlsTotal, boysTotal }: Props) {
  const diff = girlsTotal - boysTotal
  let leadLabel = 'All Square'
  let leadClass = styles.leadTied
  if (diff > 0) { leadLabel = `Girls lead +${diff}`; leadClass = styles.leadGirls }
  if (diff < 0) { leadLabel = `Boys lead +${Math.abs(diff)}`; leadClass = styles.leadBoys }

  return (
    <div className={styles.bar}>
      <div className={styles.teams}>
        <div className={`${styles.team} ${styles.teamGirls}`}>
          <div className={styles.name}>Girls</div>
          <div className={styles.pts}>{girlsTotal}</div>
        </div>
        <div className={styles.vs}>pts</div>
        <div className={`${styles.team} ${styles.teamBoys}`}>
          <div className={styles.name}>Boys</div>
          <div className={styles.pts}>{boysTotal}</div>
        </div>
      </div>
      <div className={styles.meta}>
        <span className={`${styles.lead} ${leadClass}`}>{leadLabel}</span>
      </div>
    </div>
  )
}
