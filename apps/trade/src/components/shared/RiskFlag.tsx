import React from 'react'
import { C, MONO } from '../../constants'
import type { RiskLevel } from '../../types'

const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string; border: string; icon: string; label: string; ariaLabel: string }> = {
  GREEN: { color: C.green,    bg: C.greenBg,  border: C.greenBdr,  icon: '●', label: '✓ Standard',         ariaLabel: 'Green — Standard processing' },
  AMBER: { color: C.amber,    bg: C.amberBg,  border: C.amberBdr,  icon: '▲', label: '⚠ Secondary Check',  ariaLabel: 'Amber — Secondary check required' },
  RED:   { color: C.critical, bg: C.critBg,   border: C.critBdr,   icon: '■', label: '⛔ Hold',            ariaLabel: 'Red — Hold for officer' },
}

interface Props {
  level:  RiskLevel
  size?:  'sm' | 'md' | 'lg'
  count?: number
}

export function RiskFlag({ level, size = 'md', count }: Props) {
  const cfg = RISK_CONFIG[level]
  const fs  = size === 'lg' ? 14 : size === 'sm' ? 10 : 12

  return (
    <span
      role="img"
      aria-label={cfg.ariaLabel}
      style={{
        display:     'inline-flex',
        alignItems:  'center',
        gap:         6,
        background:  cfg.bg,
        border:      `1px solid ${cfg.border}`,
        borderRadius: 4,
        color:       cfg.color,
        fontFamily:  MONO,
        fontSize:    fs,
        fontWeight:  600,
        padding:     size === 'sm' ? '2px 8px' : '4px 12px',
        whiteSpace:  'nowrap',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: size === 'lg' ? 12 : 10 }}>{cfg.icon}</span>
      {cfg.label}
      {count !== undefined && (
        <span style={{ marginLeft: 4, opacity: 0.8 }}>({count})</span>
      )}
    </span>
  )
}
