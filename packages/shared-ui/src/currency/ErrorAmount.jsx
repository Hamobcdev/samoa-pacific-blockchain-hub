import React from 'react'

export function ErrorAmount({ currencyCode = 'WST', message = 'Unavailable' }) {
  return (
    <span
      role="alert"
      aria-label={`Amount unavailable for ${currencyCode}: ${message}`}
      style={{
        display:    'inline-flex',
        alignItems: 'center',
        gap:        4,
        fontFamily: 'var(--font-mono)',
        fontSize:   13,
        color:      'var(--color-dim)',
      }}
    >
      <span aria-hidden="true" style={{ color: 'var(--color-critical)' }}>✗</span>
      <span>—— {currencyCode}</span>
    </span>
  )
}
