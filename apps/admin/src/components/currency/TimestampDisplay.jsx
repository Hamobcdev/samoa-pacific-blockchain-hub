import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

export function TimestampDisplay({ timestamp, format = 'datetime', compact = false }) {
  if (!timestamp) return <span style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 11 }}>——</span>

  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)

  const opts = format === 'date'
    ? { timeZone: 'Pacific/Apia', year: 'numeric', month: '2-digit', day: '2-digit' }
    : { timeZone: 'Pacific/Apia', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }

  const formatted = new Intl.DateTimeFormat('en-WS', opts).format(date)
  const iso = date.toISOString()

  return (
    <time
      dateTime={iso}
      title={`WST (Pacific/Apia): ${formatted}`}
      style={{
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      compact ? 10 : 11,
        color:         COLORS.textMuted,
        letterSpacing: '0.3px',
        whiteSpace:    'nowrap',
      }}
    >
      {formatted}
    </time>
  )
}
