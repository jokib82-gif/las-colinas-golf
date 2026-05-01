'use client'
import { useState } from 'react'
import { Hole, HoleScore, HolePoints, POINT_DEFS, calcHolePoints, scoreLabel, handicapHole } from '@/lib/game'
import styles from './HoleCard.module.css'

interface Props {
  hole: Hole
  score: HoleScore
  points: HolePoints
  onScoreChange: (team: 'girls' | 'boys', delta: number) => void
  onPointToggle: (pointId: string) => void
}

export default function HoleCard({ hole, score, points, onScoreChange, onPointToggle }: Props) {
  const [open, setOpen] = useState(false)
  const { g, b } = calcHolePoints(points)
  const hasHandicap = handicapHole(hole.par)

  return (
    <div className={styles.card}>
      <div className={styles.holeHeader} onClick={() => setOpen(o => !o)}>
        <div className={styles.holeLeft}>
          <span className={styles.holeNum}>H{hole.n}</span>
          <div className={styles.holeInfo}>
            <span className={styles.parBadge}>Par {hole.par}</span>
            <span className={styles.hcp}>HCP {hole.hcp}</span>
            {hasHandicap && <span className={styles.hcpNote}>⚡ +1 girls</span>}
          </div>
        </div>
        <div className={styles.holeRight}>
          <span className={styles.holePts}>G:{g} B:{b}</span>
          <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>▼</span>
        </div>
      </div>

      {open && (
        <div className={styles.body}>
          {/* Score inputs */}
          <div className={styles.scoreRow}>
            <ScoreInput
              label="Girls Score"
              value={score.girls}
              par={hole.par}
              colorClass={styles.girlsColor}
              onMinus={() => onScoreChange('girls', -1)}
              onPlus={() => onScoreChange('girls', 1)}
            />
            <ScoreInput
              label="Boys Score"
              value={score.boys}
              par={hole.par}
              colorClass={styles.boysColor}
              onMinus={() => onScoreChange('boys', -1)}
              onPlus={() => onScoreChange('boys', 1)}
            />
          </div>

          {/* Points checkboxes */}
          <div className={styles.ptsSection}>
            <div className={styles.ptsTitle}>Award Points</div>
            <div className={styles.ptsGrid}>
              {POINT_DEFS.filter(p => {
                const isPar3 = hole.par === 3
                if ((p.id === 'closest_g' || p.id === 'closest_b') && !isPar3) return false
                if ((p.id === 'fairway_g' || p.id === 'fairway_b' || p.id === 'longest_g' || p.id === 'longest_b') && isPar3) return false
                return true
              }).map(p => {
                const checked = points[p.id] ?? false
                const itemClass = p.team === 'girls'
                  ? styles.girlsItem
                  : styles.boysItem
                return (
                  <label
                    key={p.id}
                    className={`${styles.ptsItem} ${itemClass} ${checked ? styles.checked : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onPointToggle(p.id)}
                      className={styles.cb}
                    />
                    <span className={styles.ptsLabel}>{p.label}</span>
                    <span className={styles.ptsVal}>+{p.val}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Hole total */}
          <div className={styles.holeTotals}>
            <div className={styles.totalGirls}>
              <div className={styles.totalLabel}>Girls pts</div>
              <div className={styles.totalVal}>{g}</div>
            </div>
            <div className={styles.totalBoys}>
              <div className={styles.totalLabel}>Boys pts</div>
              <div className={styles.totalVal}>{b}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ScoreInput({
  label, value, par, colorClass, onMinus, onPlus
}: {
  label: string; value: number; par: number
  colorClass: string; onMinus: () => void; onPlus: () => void
}) {
  return (
    <div className={styles.scoreInputGroup}>
      <div className={`${styles.scoreLabel} ${colorClass}`}>{label}</div>
      <div className={styles.scoreInput}>
        <button className={styles.ctrl} onClick={onMinus}>−</button>
        <div className={`${styles.scoreVal} ${colorClass}`}>{value}</div>
        <button className={styles.ctrl} onClick={onPlus}>+</button>
      </div>
      <div className={styles.scoreMeta}>{scoreLabel(value, par)}</div>
    </div>
  )
}
