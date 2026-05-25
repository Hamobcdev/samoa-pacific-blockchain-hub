import React from 'react'

const LABELS = {
  native: { EN: 'Native', SM: "Fa'avasega" },
  tech:   { EN: 'Technical', SM: "Fa'apitoa" },
}

export function PrecisionToggle({ precision, onToggle, lang = 'EN' }) {
  const isNative = precision === 'native'
  const label    = isNative ? LABELS.native[lang] ?? LABELS.native.EN : LABELS.tech[lang] ?? LABELS.tech.EN

  return (
    <button
      onClick={onToggle}
      aria-pressed={!isNative}
      aria-label={`Precision mode: ${label}. Click to toggle.`}
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           6,
        background:    'var(--color-surface-2)',
        border:        '1px solid var(--color-border-2)',
        borderRadius:  'var(--radius-sm)',
        color:         'var(--color-muted)',
        cursor:        'pointer',
        fontFamily:    'var(--font-mono)',
        fontSize:      10,
        letterSpacing: '1px',
        padding:       '4px 10px',
        transition:    'border-color var(--transition-fast)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-gold)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border-2)'}
    >
      <span aria-hidden="true" style={{ color: 'var(--color-gold)' }}>◈</span>
      {label}
    </button>
  )
}
