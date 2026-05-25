import React from 'react'

const CONFIGS = {
  operational: { cssVar: 'var(--color-operational)', icon: '✓', label: 'Operational', labelSM: 'Ola' },
  degraded:    { cssVar: 'var(--color-warning)',      icon: '⚠', label: 'Degraded',    labelSM: "Fa'aletonu" },
  offline:     { cssVar: 'var(--color-critical)',     icon: '✗', label: 'Offline',     labelSM: 'Leai' },
  syncing:     { cssVar: 'var(--color-blocked)',      icon: '↻', label: 'Syncing',     labelSM: "Fa'aleleia" },
  observer:    { cssVar: 'var(--color-info)',         icon: '◎', label: 'Observer',    labelSM: "Mata'ita'i" },
  pending:     { cssVar: 'var(--color-warning)',      icon: '○', label: 'Pending',     labelSM: 'Faatali' },
}

export function StatusBadge({ status, lang = 'EN', size = 'sm' }) {
  const key = (status ?? '').toLowerCase()
  const cfg = CONFIGS[key] ?? CONFIGS.operational
  const label = lang === 'SM' ? cfg.labelSM : cfg.label
  const font  = size === 'lg' ? 12 : 10
  const pad   = size === 'lg' ? '3px 10px' : '2px 7px'

  return (
    <span
      role="status"
      aria-label={`Status: ${label}`}
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           4,
        background:    `color-mix(in srgb, ${cfg.cssVar} 12%, transparent)`,
        border:        `1px solid color-mix(in srgb, ${cfg.cssVar} 35%, transparent)`,
        borderRadius:  12,
        padding:       pad,
        fontFamily:    'var(--font-mono)',
        fontSize:      font,
        letterSpacing: 'var(--letter-spacing-mono)',
        color:         cfg.cssVar,
        whiteSpace:    'nowrap',
      }}
    >
      <span aria-hidden="true">{cfg.icon}</span>
      {label}
    </span>
  )
}
