import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

const SETTLEMENT_STATES = {
  INITIATED:   { color: COLORS.settlementInitiated,  icon: '○', label: 'Initiated',   labelSM: "Amata" },
  CONFIRMING:  { color: COLORS.settlementConfirming, icon: '◑', label: 'Confirming',  labelSM: "Fa'amaonia" },
  FINAL:       { color: COLORS.settlementFinal,      icon: '●', label: 'Final',       labelSM: "Maea" },
  FAILED:      { color: COLORS.settlementFailed,     icon: '✗', label: 'Failed',      labelSM: "Ua Toilalo" },
  CBS_HELD:    { color: COLORS.settlementCBSHeld,    icon: '⏸', label: 'CBS Held',    labelSM: "Taofia e CBS" },
}

export function SettlementChip({ state, lang = 'EN' }) {
  const cfg = SETTLEMENT_STATES[state] ?? SETTLEMENT_STATES.INITIATED
  const label = lang === 'SM' ? cfg.labelSM : cfg.label

  return (
    <span
      role="status"
      aria-label={`Settlement status: ${label}`}
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          5,
        background:   `${cfg.color}18`,
        border:       `1px solid ${cfg.color}40`,
        borderRadius: 12,
        padding:      '2px 8px',
        fontFamily:   TYPOGRAPHY.mono,
        fontSize:     11,
        letterSpacing: '0.5px',
        color:        cfg.color,
        whiteSpace:   'nowrap',
      }}
    >
      <span aria-hidden="true">{cfg.icon}</span>
      {label}
    </span>
  )
}
