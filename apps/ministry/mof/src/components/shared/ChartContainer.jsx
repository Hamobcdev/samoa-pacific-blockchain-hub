import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

export function ChartContainer({ title, subtitle, badge, children, minHeight = 200 }) {
  return (
    <div style={{
      background:   '#ffffff',
      border:       `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding:      '20px 24px',
      marginBottom: 20,
      boxShadow:    '0 1px 3px rgba(26,58,107,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{
            fontFamily:    TYPOGRAPHY.mono,
            fontSize:      11,
            fontWeight:    700,
            color:         COLORS.govBlue,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom:  3,
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted }}>
              {subtitle}
            </div>
          )}
        </div>
        {badge && (
          <span style={{
            background:    COLORS.fiscalBg,
            border:        `1px solid ${COLORS.fiscalBorder}`,
            borderRadius:  4,
            color:         COLORS.fiscal,
            fontFamily:    TYPOGRAPHY.mono,
            fontSize:      11,
            letterSpacing: '0.5px',
            padding:       '2px 8px',
            fontWeight:    600,
          }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ minHeight }}>
        {children}
      </div>
    </div>
  )
}
