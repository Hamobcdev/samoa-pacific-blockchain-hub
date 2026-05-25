import React from 'react'
import { TYPOGRAPHY } from '../../theme.js'
import { CURRENCY_CONFIGS } from '../../hooks/useCurrencyDisplay.js'

export function CurrencyBadge({ currencyCode, size = 'sm' }) {
  const cfg = CURRENCY_CONFIGS[currencyCode]
  if (!cfg) return null

  const pad  = size === 'lg' ? '4px 10px' : '2px 7px'
  const font = size === 'lg' ? 12 : 10

  return (
    <span
      aria-label={`Currency: ${cfg.name}`}
      style={{
        display:      'inline-block',
        background:   `${cfg.color}18`,
        border:       `1px solid ${cfg.color}40`,
        borderRadius: 3,
        color:        cfg.color,
        fontFamily:   TYPOGRAPHY.mono,
        fontSize:     font,
        fontWeight:   600,
        letterSpacing: '1px',
        padding:      pad,
        whiteSpace:   'nowrap',
      }}
    >
      {currencyCode}
    </span>
  )
}
