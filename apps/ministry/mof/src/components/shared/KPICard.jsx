import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

export function KPICard({ label, value, sub, color, dashed, icon }) {
  return (
    <div
      style={{
        background:    '#ffffff',
        border:        `1px solid ${dashed ? COLORS.blockedBorder : COLORS.border}`,
        borderStyle:   dashed ? 'dashed' : 'solid',
        borderTop:     `3px solid ${dashed ? COLORS.blockedBorder : (color || COLORS.govBlue)}`,
        borderRadius:  6,
        padding:       '16px 18px',
        display:       'flex',
        flexDirection: 'column',
        gap:           5,
        minWidth:      0,
        minHeight:     100,
        transition:    'border-color 0.15s, box-shadow 0.15s',
        boxShadow:     '0 1px 3px rgba(26,58,107,0.06)',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,58,107,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(26,58,107,0.06)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon && <span style={{ fontSize: 13, color: color || COLORS.govBlue }} aria-hidden="true">{icon}</span>}
        <div style={{
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      11,
          letterSpacing: '1px',
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
