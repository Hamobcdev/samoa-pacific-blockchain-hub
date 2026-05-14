import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { AmountDisplay } from './AmountDisplay.jsx'
import { CurrencyBadge } from './CurrencyBadge.jsx'

export function AmountColumn({ amount, currencyCode = 'WST', subLabel, align = 'right' }) {
  return (
    <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', gap: 2, alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <AmountDisplay amount={amount} currencyCode={currencyCode} showCode={false} />
        <CurrencyBadge currencyCode={currencyCode} />
      </div>
      {subLabel && (
        <span style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '0.5px' }}>
          {subLabel}
        </span>
      )}
    </div>
  )
}
