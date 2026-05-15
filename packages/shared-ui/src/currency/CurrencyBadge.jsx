import React from 'react'
import { CURRENCY_CONFIGS } from './currencyConfigs.js'

export function CurrencyBadge({ currencyCode, size = 'sm' }) {
  const cfg = CURRENCY_CONFIGS[currencyCode]
  if (!cfg) return null

  const pad  = size === 'lg' ? '4px 10px' : '2px 7px'
  const font = size === 'lg' ? 12 : 10

  return (
    <span
      aria-label={`Currency: ${cfg.name}`}
      style={{
        display:       'inline-block',
        background:    `color-mix(in srgb, ${cfg.color} 10%, transparent)`,
        border:        `1px solid color-mix(in srgb, ${cfg.color} 30%, transparent)`,
        borderRadius:  3,
        color:         cfg.color,
        fontFamily:    'var(--font-mono)',
        fontSize:      font,
        fontWeight:    600,
        letterSpacing: '1px',
        padding:       pad,
        whiteSpace:    'nowrap',
      }}
    >
      {currencyCode}
    </span>
  )
}
