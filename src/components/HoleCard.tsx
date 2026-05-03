'use client'
import { useState } from 'react'
import {
  Hole, HoleScore, HolePoints, PlayerScores,
  POINT_CATEGORIES, PLAYERS, ALL_PLAYERS,
  calcHolePoints, scoreLabel, handicapHole, pointId
} from '@/lib/game'
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

export default function HoleCard({
  hole, score, points, playerScores,
  onScoreChange, onPointToggle, onPlayerScoreChange
}: Props) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'team' | 'players'>('players')
  const { g, b, byPlayer } = calcHolePoints(points)
  const isPar3 = hole.par === 3

  const visibleCats = POINT_CATEGORIES.filter(cat => {
    if (cat.par3only && !isPar3) return false
    if (cat.nopar3 && isPar3) return false
    return true
  })

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
          <div className={styles.viewToggle}>
            <button className={`${styles.toggleBtn} ${view === 'players' ? styles.toggleActive : ''}`} onClick={() => setView('players')}>Players</button>
            <button className={`${styles.toggleBtn} ${view === 'team' ? styles.toggleActive : ''}`} onClick={() => setView('team')}>Team scores</button>
          </div>

          {/* PLAYERS VIEW — scores + per-player points */}
          {view === 'players' && (
            <div className={styles.playersSection}>
              {/* Girls */}
              <div className={styles.playerGroupBlock}>
                <div className={styles.playerGroupTitle} style={{ color: 'var(--girls)' }}>Linda's</div>
                {PLAYERS.girls.map(player => {
                  const pScore = playerScores[player.id as keyof PlayerScores] ?? hole.par
                  const pPts = byPlayer[player.id] ?? 0
                  return (
                    <div key={player.id} className={styles.playerBlock}>
                      <div className={styles.playerBlockHeader}>
                        <span className={styles.playerBlockName} style={{ color: 'var(--girls)' }}>{player.name}</span>
                        <span className={styles.playerBlockPts} style={{ color: 'var(--girls)' }}>{pPts} pts</span>
                      </div>
                      {/* Score */}
                      <div className={styles.playerScoreRow}>
                        <div className={styles.scoreInputGroup}>
                          <div className={`${styles.scoreLabel} ${styles.girlsColor}`}>Score</div>
                          <div className={styles.scoreInput}>
                            <button className={styles.ctrl} onClick={() => onPlayerScoreChange(player.id, -1)}>−</button>
                            <div className={`${styles.scoreVal} ${styles.girlsColor}`}>{pScore}</div>
                            <button className={styles.ctrl} onClick={() => onPlayerScoreChange(player.id, 1)}>+</button>
                          </div>
                          <div className={styles.scoreMeta}>{scoreLabel(pScore, hole.par)}</div>
                        </div>
                      </div>
                      {/* Points */}
                      <div className={styles.playerPtsGrid}>
                        {visibleCats.map(cat => {
                          const pid = pointId(player.id, cat.key)
                          const checked = points[pid] ?? false
                          return (
                            <label key={cat.key} className={`${styles.ptsItem} ${styles.girlsItem} ${checked ? styles.checked : ''}`}>
                              <input type="checkbox" checked={checked} onChange={() => onPointToggle(pid)} className={styles.cb} />
                              <span className={styles.ptsLabel}>{cat.label}</span>
                              <span className={styles.ptsVal}>+{cat.val}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Boys */}
              <div className={styles.playerGroupBlock}>
                <div className={styles.playerGroupTitle} style={{ color: 'var(--boys)' }}>Gagnaperrar</div>
                {PLAYERS.boys.map(player => {
                  const pScore = playerScores[player.id as keyof PlayerScores] ?? hole.par
                  const pPts = byPlayer[player.id] ?? 0
                  return (
                    <div key={player.id} className={styles.playerBlock}>
                      <div className={styles.playerBlockHeader}>
                        <span className={styles.playerBlockName} style={{ color: 'var(--boys)' }}>{player.name}</span>
                        <span className={styles.playerBlockPts} style={{ color: 'var(--boys)' }}>{pPts} pts</span>
                      </div>
                      <div className={styles.playerScoreRow}>
                        <div className={styles.scoreInputGroup}>
                          <div className={`${styles.scoreLabel} ${styles.boysColor}`}>Score</div>
                          <div className={styles.scoreInput}>
                            <button className={styles.ctrl} onClick={() => onPlayerScoreChange(player.id, -1)}>−</button>
                            <div className={`${styles.scoreVal} ${styles.boysColor}`}>{pScore}</div>
                            <button className={styles.ctrl} onClick={() => onPlayerScoreChange(player.id, 1)}>+</button>
                          </div>
                          <div className={styles.scoreMeta}>{scoreLabel(pScore, hole.par)}</div>
                        </div>
                      </div>
                      <div className={styles.playerPtsGrid}>
                        {visibleCats.map(cat => {
                          const pid = pointId(player.id, cat.key)
                          const checked = points[pid] ?? false
                          return (
                            <label key={cat.key} className={`${styles.ptsItem} ${styles.boysItem} ${checked ? styles.checked : ''}`}>
                              <input type="checkbox" checked={checked} onChange={() => onPointToggle(pid)} className={styles.cb} />
                              <span className={styles.ptsLabel}>{cat.label}</span>
                              <span className={styles.ptsVal}>+{cat.val}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Hole totals */}
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
            </div>
          )}

          {/* TEAM VIEW — team scores only */}
          {view === 'team' && (
            <>
              <div className={styles.scoreRow}>
                <div className={styles.scoreInputGroup}>
                  <div className={`${styles.scoreLabel} ${styles.girlsColor}`}>Linda's</div>
                  <div className={styles.scoreInput}>
                    <button className={styles.ctrl} onClick={() => onScoreChange('girls', -1)}>−</button>
                    <div className={`${styles.scoreVal} ${styles.girlsColor}`}>{score.girls}</div>
                    <button className={styles.ctrl} onClick={() => onScoreChange('girls', 1)}>+</button>
                  </div>
                  <div className={styles.scoreMeta}>{scoreLabel(score.girls, hole.par)}</div>
                </div>
                <div className={styles.scoreInputGroup}>
                  <div className={`${styles.scoreLabel} ${styles.boysColor}`}>Gagnaperrar</div>
                  <div className={styles.scoreInput}>
                    <button className={styles.ctrl} onClick={() => onScoreChange('boys', -1)}>−</button>
                    <div className={`${styles.scoreVal} ${styles.boysColor}`}>{score.boys}</div>
                    <button className={styles.ctrl} onClick={() => onScoreChange('boys', 1)}>+</button>
                  </div>
                  <div className={styles.scoreMeta}>{scoreLabel(score.boys, hole.par)}</div>
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
        </div>
      )}
    </div>
  )
}
