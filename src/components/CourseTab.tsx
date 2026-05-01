import styles from './CourseTab.module.css'

interface Props { onReset: () => void }

const RULES = [
  { label: 'Best individual score', val: '1 pt' },
  { label: 'Best combined team score', val: '1 pt' },
  { label: 'Fairway hit', val: '1 pt' },
  { label: 'Longest drive on fairway', val: '1 pt' },
  { label: 'Green in Regulation (GIR)', val: '1 pt' },
  { label: 'Sand save', val: '1 pt' },
  { label: 'One-putt', val: '1 pt' },
  { label: 'Putt holed from string', val: '1 pt' },
  { label: 'Birdie', val: '2 pts' },
  { label: 'Eagle', val: '3 pts' },
]

export default function CourseTab({ onReset }: Props) {
  return (
    <div>
      <div className={styles.courseCard}>
        <div className={styles.courseName}>Las Colinas Golf & Country Club</div>
        <div className={styles.courseDetail}>📍 Murcia, Spain</div>
        <div className={styles.courseDetail}>18 holes · Par 71 · 6,432m</div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Format & Handicap</div>
        <div className={styles.formatNote}>
          ⚡ Girls receive <strong>+1 stroke</strong> on all Par 4 &amp; Par 5 holes
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Points System</div>
        {RULES.map(r => (
          <div key={r.label} className={styles.ruleRow}>
            <span className={styles.ruleLabel}>{r.label}</span>
            <span className={styles.ruleVal}>{r.val}</span>
          </div>
        ))}
      </div>

      <button className={styles.resetBtn} onClick={onReset}>
        Reset all scores
      </button>
    </div>
  )
}
