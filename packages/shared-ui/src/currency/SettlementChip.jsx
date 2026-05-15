import React from 'react'

const SETTLEMENT_STATES = {
  INITIATED:   { cssVar: 'var(--color-settlement-initiated)',   icon: '○', label: 'Initiated',   labelSM: 'Amata' },
  CONFIRMING:  { cssVar: 'var(--color-settlement-confirming)',  icon: '◑', label: 'Confirming',  labelSM: "Fa'amaonia" },
  FINAL:       { cssVar: 'var(--color-settlement-final)',       icon: '●', label: 'Final',       labelSM: 'Maea' },
  FAILED:      { cssVar: 'var(--color-settlement-failed)',      icon: '✗', label: 'Failed',      labelSM: 'Ua Toilalo' },
  CBS_HELD:    { cssVar: 'var(--color-settlement-cbs-held)',    icon: '⏸', label: 'CBS Held',    labelSM: 'Taofia e CBS' },
}

export function SettlementChip({ state, lang = 'EN' }) {
  const cfg   = SETTLEMENT_STATES[state] ?? SETTLEMENT_STATES.INITIATED
  const label = lang === 'SM' ? cfg.labelSM : cfg.label

  return (
    <span
      role="status"
      aria-label={`Settlement status: ${label}`}
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           5,
        background:    `color-mix(in srgb, ${cfg.cssVar} 10%, transparent)`,
        border:        `1px solid color-mix(in srgb, ${cfg.cssVar} 30%, transparent)`,
        borderRadius:  12,
        padding:       '2px 8px',
        fontFamily:    'var(--font-mono)',
        fontSize:      11,
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
