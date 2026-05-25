import React from 'react'
import { C, MONO } from '../../constants'
import type { ClearanceStatus, MinistryStatus } from '../../types'

type ChipStatus = ClearanceStatus | MinistryStatus

const CHIP_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string; label: string }> = {
  PENDING:        { color: C.amber,    bg: C.amberBg,  border: C.amberBdr,  icon: '⏳', label: 'PENDING' },
  APPROVED:       { color: C.green,    bg: C.greenBg,  border: C.greenBdr,  icon: '✓',  label: 'APPROVED' },
  CLEARED:        { color: C.green,    bg: C.greenBg,  border: C.greenBdr,  icon: '✓',  label: 'CLEARED' },
  SUBMITTED:      { color: C.green,    bg: C.greenBg,  border: C.greenBdr,  icon: '✓',  label: 'SUBMITTED' },
  FLAGGED:        { color: C.critical, bg: C.critBg,   border: C.critBdr,   icon: '⚠',  label: 'FLAGGED' },
  AWAITING_DOCS:  { color: C.purple,   bg: C.purpleBg, border: C.purpleBdr, icon: '⏸',  label: 'AWAITING DOCS' },
  AWAITING_PRIOR: { color: C.muted,    bg: C.surface2, border: C.border,    icon: '🔒', label: 'AWAITING PRIOR' },
  CBS_HELD:       { color: C.amber,    bg: C.amberBg,  border: C.amberBdr,  icon: '⊘',  label: 'CBS-HELD' },
  NOT_REQUIRED:   { color: C.dim,      bg: C.surface2, border: C.border,    icon: '➖', label: 'NOT REQUIRED' },
  PARTIAL:        { color: C.amber,    bg: C.amberBg,  border: C.amberBdr,  icon: '◑',  label: 'PARTIAL' },
}

interface Props {
  status:    ChipStatus
  size?:     'sm' | 'md'
  tooltip?:  string
}

export function ClearanceChip({ status, size = 'md', tooltip }: Props) {
  const cfg = CHIP_CONFIG[status] ?? CHIP_CONFIG['PENDING']
  const fs  = size === 'sm' ? 10 : 11

  return (
    <span
      role="status"
      aria-label={`Status: ${cfg.label}`}
      title={tooltip}
      style={{
        display:     'inline-flex',
        alignItems:  'center',
        gap:         4,
        background:  cfg.bg,
        border:      `1px solid ${cfg.border}`,
        borderRadius: 4,
        color:       cfg.color,
        fontFamily:  MONO,
        fontSize:    fs,
        fontWeight:  600,
        letterSpacing: '0.6px',
        padding:     size === 'sm' ? '2px 6px' : '3px 8px',
        whiteSpace:  'nowrap',
      }}
    >
      <span aria-hidden="true">{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}
