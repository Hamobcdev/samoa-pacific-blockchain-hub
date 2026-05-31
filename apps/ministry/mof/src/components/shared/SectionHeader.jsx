import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

export function SectionHeader({ title, subtitle, badge, badgeColor }) {
  return (
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
          <div style={{
            fontFamily: TYPOGRAPHY.mono,
            fontSize:   11,
            color:      COLORS.textMuted,
          }}>
            {subtitle}
          </div>
        )}
      </div>
      {badge && (
        <div style={{
          background:    badgeColor ? `${badgeColor}15` : COLORS.fiscalBg,
          border:        `1px solid ${badgeColor ? `${badgeColor}40` : COLORS.fiscalBorder}`,
          borderRadius:  4,
          color:         badgeColor || COLORS.fiscal,
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      11,
          letterSpacing: '0.5px',
          padding:       '3px 10px',
          whiteSpace:    'nowrap',
          fontWeight:    600,
        }}>
          {badge}
        </div>
      )}
    </div>
  )
}
