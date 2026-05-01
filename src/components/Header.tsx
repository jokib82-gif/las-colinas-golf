import { TEAM_NAMES } from '@/lib/game'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.pattern} />
      <div className={styles.title}>Las Colinas Golf Cup</div>
      <div className={styles.sub}>May 3–7 · Lifetrack Scoring</div>
      <div className={styles.badges}>
        <span className={styles.badge}>{TEAM_NAMES.girls}</span>
        <span className={styles.badgeVs}>vs</span>
        <span className={styles.badge}>{TEAM_NAMES.boys}</span>
      </div>
    </header>
  )
}
