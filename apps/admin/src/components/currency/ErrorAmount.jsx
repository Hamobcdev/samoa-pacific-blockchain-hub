import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

export function ErrorAmount({ currencyCode = 'WST', message = 'Unavailable' }) {
  return (
    <span
      role="alert"
      aria-label={`Amount unavailable for ${currencyCode}: ${message}`}
      style={{
        display:    'inline-flex',
        alignItems: 'center',
        gap:        4,
        fontFamily: TYPOGRAPHY.mono,
        fontSize:   13,
        color:      COLORS.textDim,
      }}
    >
      <span aria-hidden="true" style={{ color: COLORS.critical }}>✗</span>
      <span>—— {currencyCode}</span>
    </span>
  )
}
