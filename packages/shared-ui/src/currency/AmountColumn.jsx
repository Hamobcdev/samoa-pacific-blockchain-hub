import React from 'react'
import { AmountDisplay } from './AmountDisplay.jsx'
import { CurrencyBadge } from './CurrencyBadge.jsx'

export function AmountColumn({ amount, currencyCode = 'WST', subLabel, align = 'right' }) {
  const alignItems = align === 'right' ? 'flex-end' : 'flex-start'
  return (
    <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', gap: 2, alignItems }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <AmountDisplay amount={amount} currencyCode={currencyCode} showCode={false} />
        <CurrencyBadge currencyCode={currencyCode} />
      </div>
      {subLabel && (
        <span style={{ color: 'var(--color-dim)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 'var(--letter-spacing-mono)' }}>
          {subLabel}
        </span>
      )}
    </div>
  )
}
