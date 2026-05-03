'use client'
import { useState } from 'react'
import { Hole, HoleScore, HolePoints, PlayerScores, POINT_DEFS, PLAYERS, calcHolePoints, scoreLabel, handicapHole, initPlayerScores } from '@/lib/game'
import styles from './HoleCard.module.css'

interface Props {
  hole: Hole
  score: HoleScore
  points: HolePoints
  playerScores: PlayerScores
  onScoreChange: (team: 'girls' | 'boys', delta: number) => void
  onPointToggle: (pointId: string) => void
  onPlayerScoreChange: (playerId: string, delta: number) => void
}

export default function HoleCard({ hole, score, points, playerScores, onScoreChange, onPointToggle, onPlayerScoreChange }: Props) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'team' | 'players'>('team')
  const { g, b } = calcHolePoints(points)
  const isPar3 = hole.par === 3

  return (
    <div className={styles.card}>
      <div className={styles.holeHeader} onClick={() => setOpen(o => !o)}>
        <div className={styles.holeLeft}>
          <span className={styles.holeNum}>H{hole.n}</span>
          <div className={styles.holeInfo}>
            <span className={styles.parBadge}>Par {hole.par}</span>
            <span className={styles.hcp}>HCP {hole.hcp}</span>
            {handicapHole(hole.par) && <span className={styles.hcpNote}>⚡ +1 girls</span>}
          </div>
        </div>
        <div className={styles.holeRight}>
          <span className={styles.holePts}>G:{g} B:{b}</span>
          <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>▼</span>
        </div>
      </div>

      {open && (
        <div className={styles.body}>
          {/* Team / Players toggle */}
          <div className={styles.viewToggle}>
            <button className={`${styles.toggleBtn} ${view === 'team' ? styles.toggleActive : ''}`} onClick={() => setView('team')}>Team</button>
            <button className={`${styles.toggleBtn} ${view === 'players' ? styles.toggleActive : ''}`} onClick={() => setView('players')}>Players</button>
          </div>

          {view === 'team' && (
            <>
              <div className={styles.scoreRow}>
                <ScoreInput label="Linda's" value={score.girls} par={hole.par} colorClass={styles.girlsColor} onMinus={() => onScoreChange('girls', -1)} onPlus={() => onScoreChange('girls', 1)} />
                <ScoreInput label="Gagnaperrar" value={score.boys} par={hole.par} colorClass={styles.boysColor} onMinus={() => onScoreChange('boys', -1)} onPlus={() => onScoreChange('boys', 1)} />
              </div>

              <div className={styles.ptsSection}>
                <div className={styles.ptsTitle}>Award Points</div>
                <div className={styles.ptsGrid}>
                  {POINT_DEFS.filter(p => {
                    if ((p.id === 'closest_g' || p.id === 'closest_b') && !isPar3) return false
                    if ((p.id === 'fairway_g' || p.id === 'fairway_b' || p.id === 'longest_g' || p.id === 'longest_b') && isPar3) return false
                    return true
                  }).map(p => {
                    const checked = points[p.id] ?? false
                    const itemClass = p.team === 'girls' ? styles.girlsItem : styles.boysItem
                    return (
                      <label key={p.id} className={`${styles.ptsItem} ${itemClass} ${checked ? styles.checked : ''}`}>
                        <input type="checkbox" checked={checked} onChange={() => onPointToggle(p.id)} className={styles.cb} />
                        <span className={styles.ptsLabel}>{p.label}</span>
                        <span className={styles.ptsVal}>+{p.val}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className={styles.holeTotals}>
                <div className={styles.totalGirls}>
                  <div className={styles.totalLabel}>Linda's pts</div>
                  <div className={styles.totalVal}>{g}</div>
                </div>
                <div className={styles.totalBoys}>
                  <div className={styles.totalLabel}>Gagnaperrar pts</div>
                  <div className={styles.totalVal}>{b}</div>
                </div>
              </div>
            </>
          )}

          {view === 'players' && (
            <div className={styles.playersSection}>
              <div className={styles.playerGroup}>
                <div className={styles.playerGroupLabel} style={{ color: 'var(--girls)' }}>Linda's</div>
                {PLAYERS.girls.map(p => (
                  <ScoreInput
                    key={p.id}
                    label={p.name}
                    value={playerScores[p.id as keyof PlayerScores] ?? hole.par}
                    par={hole.par}
                    colorClass={styles.girlsColor}
                    onMinus={() => onPlayerScoreChange(p.id, -1)}
                    onPlus={() => onPlayerScoreChange(p.id, 1)}
                  />
                ))}
              </div>
              <div className={styles.playerGroup}>
                <div className={styles.playerGroupLabel} style={{ color: 'var(--boys)' }}>Gagnaperrar</div>
                {PLAYERS.boys.map(p => (
                  <ScoreInput
                    key={p.id}
                    label={p.name}
                    value={playerScores[p.id as keyof PlayerScores] ?? hole.par}
                    par={hole.par}
                    colorClass={styles.boysColor}
                    onMinus={() => onPlayerScoreChange(p.id, -1)}
                    onPlus={() => onPlayerScoreChange(p.id, 1)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ScoreInput({ label, value, par, colorClass, onMinus, onPlus }: {
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
