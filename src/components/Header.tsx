import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.pattern} />
      <div className={styles.title}>Las Colinas Golf Cup</div>
      <div className={styles.sub}>Girls vs Boys · Lifetrack Scoring</div>
      <div className={styles.badges}>
        <span className={styles.badge}>♀ Girls</span>
        <span className={styles.badge}>♂ Boys</span>
      </div>
    </header>
  )
}
