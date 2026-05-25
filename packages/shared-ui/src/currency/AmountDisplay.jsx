import React from 'react'
import Decimal from 'decimal.js'
import { CURRENCY_CONFIGS } from './currencyConfigs.js'

export function AmountDisplay({ amount, currencyCode = 'WST', size = 'md', showCode = true }) {
  const cfg = CURRENCY_CONFIGS[currencyCode] ?? CURRENCY_CONFIGS.WST
  const dp  = currencyCode === 'WST' ? 2 : cfg.nativeDecimals

  let formatted
  try {
    const raw = typeof amount === 'bigint'
      ? new Decimal(amount.toString()).div(new Decimal(10).pow(cfg.decimals))
      : new Decimal(String(amount ?? 0))
    formatted = raw.toFixed(dp).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch {
    formatted = '——'
  }

  const sizes = { sm: '12px', md: '14px', lg: '18px', xl: '24px' }
  const fs = sizes[size] ?? sizes.md

  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: fs, display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ color: cfg.color, fontWeight: 600 }}>{formatted}</span>
      {showCode && (
        <span style={{ color: 'var(--color-muted)', fontSize: `calc(${fs} - 2px)`, letterSpacing: 'var(--letter-spacing-mono)' }}>
          {currencyCode}
        </span>
      )}
    </span>
  )
}
