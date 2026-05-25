import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { CURRENCY_CONFIGS } from '../../hooks/useCurrencyDisplay.js'

export function AmountDisplay({ amount, currencyCode = 'WST', size = 'md', showCode = true }) {
  const cfg = CURRENCY_CONFIGS[currencyCode] ?? CURRENCY_CONFIGS.WST
  const dp  = currencyCode === 'WST' ? 2 : cfg.nativeDecimals
  const num = typeof amount === 'bigint' ? Number(amount) / Math.pow(10, cfg.decimals) : Number(amount ?? 0)
  const formatted = num.toLocaleString('en-WS', { minimumFractionDigits: dp, maximumFractionDigits: dp })

  const sizes = { sm: '12px', md: '14px', lg: '18px', xl: '24px' }
  const fontSize = sizes[size] ?? sizes.md

  return (
    <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize, display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ color: cfg.color, fontWeight: 600 }}>{formatted}</span>
      {showCode && (
        <span style={{ color: COLORS.textMuted, fontSize: `calc(${fontSize} - 2px)`, letterSpacing: '0.5px' }}>
          {currencyCode}
        </span>
      )}
    </span>
  )
}
