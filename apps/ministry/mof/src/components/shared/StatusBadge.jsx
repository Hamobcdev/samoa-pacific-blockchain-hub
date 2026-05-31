import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

const VARIANTS = {
  COMPLIANT: { color: COLORS.operational,  bg: COLORS.operationalBg,  border: COLORS.operationalBorder, label: 'COMPLIANT'  },
  MONITOR:   { color: COLORS.warning,      bg: COLORS.warningBg,      border: COLORS.warningBorder,     label: 'MONITOR'    },
  'AT-RISK':  { color: COLORS.critical,    bg: COLORS.criticalBg,     border: COLORS.criticalBorder,    label: 'AT RISK'    },
  'PHASE-2':  { color: COLORS.blocked,     bg: COLORS.blockedBg,      border: COLORS.blockedBorder,     label: 'PHASE 2'    },
  LIVE:      { color: COLORS.operational,  bg: COLORS.operationalBg,  border: COLORS.operationalBorder, label: 'LIVE'       },
  PENDING:   { color: COLORS.warning,      bg: COLORS.warningBg,      border: COLORS.warningBorder,     label: 'PENDING'    },
  INFO:      { color: COLORS.info,         bg: COLORS.infoBg,         border: COLORS.infoBorder,        label: 'INFO'       },
  OK:        { color: COLORS.operational,  bg: COLORS.operationalBg,  border: COLORS.operationalBorder, label: 'OK'         },
  GREEN:     { color: COLORS.operational,  bg: COLORS.operationalBg,  border: COLORS.operationalBorder, label: 'GREEN'      },
}

export function StatusBadge({ variant = 'INFO', label, style: extraStyle }) {
  const v = VARIANTS[variant] || VARIANTS.INFO
  return (
    <span style={{
      background:    v.bg,
      border:        `1px solid ${v.border}`,
      borderRadius:  4,
      color:         v.color,
      fontFamily:    TYPOGRAPHY.mono,
      fontSize:      11,
      fontWeight:    700,
      letterSpacing: '0.5px',
      padding:       '2px 8px',
      textTransform: 'uppercase',
      whiteSpace:    'nowrap',
      ...extraStyle,
    }}>
      {label || v.label}
    </span>
  )
}
