import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

export function KPICard({ label, value, sub, color, dashed, icon }) {
  return (
    <div
      style={{
        background:    COLORS.surface2,
        border:        `1px solid ${dashed ? COLORS.blockedBorder : COLORS.border}`,
        borderStyle:   dashed ? 'dashed' : 'solid',
        borderRadius:  6,
        padding:       '16px 18px',
        display:       'flex',
        flexDirection: 'column',
        gap:           5,
        minWidth:      0,
        minHeight:     100,
        transition:    'border-color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = dashed ? COLORS.blocked : COLORS.border2 }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = dashed ? COLORS.blockedBorder : COLORS.border }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon && <span style={{ fontSize: 14 }} aria-hidden="true">{icon}</span>}
        <div style={{
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      11,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color:         COLORS.textMuted,
        }}>
          {label}
        </div>
      </div>
      <div style={{
        fontFamily: TYPOGRAPHY.mono,
        fontSize:   20,
        fontWeight: 700,
        color:      color || COLORS.text,
        lineHeight: 1.2,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontFamily: TYPOGRAPHY.mono,
          fontSize:   11,
          color:      COLORS.textDim,
        }}>
          {sub}
        </div>
      )}
    </div>
  )
}
