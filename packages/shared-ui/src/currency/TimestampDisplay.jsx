import React from 'react'

export function TimestampDisplay({ timestamp, format = 'datetime', compact = false }) {
  if (!timestamp) {
    return (
      <span style={{ color: 'var(--color-dim)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>——</span>
    )
  }

  const date = new Date(typeof timestamp === 'number' ? timestamp : timestamp)

  const opts = format === 'date'
    ? { timeZone: 'Pacific/Apia', year: 'numeric', month: '2-digit', day: '2-digit' }
    : { timeZone: 'Pacific/Apia', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }

  const formatted = new Intl.DateTimeFormat('en-WS', opts).format(date)
  const iso        = date.toISOString()

  return (
    <time
      dateTime={iso}
      title={`WST (Pacific/Apia): ${formatted}`}
      style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      compact ? 10 : 11,
        color:         'var(--color-muted)',
        letterSpacing: '0.3px',
        whiteSpace:    'nowrap',
      }}
    >
      {formatted}
    </time>
  )
}
