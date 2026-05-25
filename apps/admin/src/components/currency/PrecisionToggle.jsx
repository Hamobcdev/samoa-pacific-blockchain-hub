import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { t } from '../../i18n.js'

export function PrecisionToggle({ precision, onToggle, lang = 'EN' }) {
  const isNative = precision === 'native'

  return (
    <button
      onClick={onToggle}
      aria-pressed={!isNative}
      aria-label={`Precision mode: ${isNative ? t(lang, 'currency.native') : t(lang, 'currency.tech')}. Click to toggle.`}
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          6,
        background:   COLORS.surface2,
        border:       `1px solid ${COLORS.border2}`,
        borderRadius: 4,
        color:        COLORS.textMuted,
        cursor:       'pointer',
        fontFamily:   TYPOGRAPHY.mono,
        fontSize:     10,
        letterSpacing: '1px',
        padding:      '4px 10px',
        transition:   'border-color 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.gold}
      onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border2}
    >
      <span aria-hidden="true" style={{ color: COLORS.gold }}>◈</span>
      {isNative ? t(lang, 'currency.native') : t(lang, 'currency.tech')}
    </button>
  )
}
