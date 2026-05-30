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
          color:         COLORS.gold,
          textTransform: 'uppercase',
          letterSpacing: '2px',
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
          background:    badgeColor ? `${badgeColor}18` : COLORS.fiscalBg,
          border:        `1px solid ${badgeColor ? `${badgeColor}44` : COLORS.fiscalBorder}`,
          borderRadius:  4,
          color:         badgeColor || COLORS.fiscal,
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      11,
          letterSpacing: '1px',
          padding:       '3px 10px',
          whiteSpace:    'nowrap',
        }}>
          {badge}
        </div>
      )}
    </div>
  )
}
