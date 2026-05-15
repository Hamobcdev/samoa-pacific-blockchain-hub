import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { ResearchLabel } from '../shared/ResearchLabel.jsx'

const FRAMEWORKS = [
  {
    id: 'BIS-PFMI-P9',
    name: 'BIS PFMI Principle 9',
    area: 'Money Settlements',
    status: 'PENDING',
    detail: 'TimelockController implementation ready. Awaiting CBS timelock window decision (AC-3).',
    blockedBy: 'AC-3-timelock',
  },
  {
    id: 'BIS-PFMI-P17',
    name: 'BIS PFMI Principle 17',
    area: 'Operational Risk',
    status: 'PENDING',
    detail: 'OpenZeppelin Pausable deployed on all 4 contracts. Pause authority address unset. Awaiting CBS circuit breaker decision.',
    blockedBy: 'PAUSABLE',
  },
  {
    id: 'FATF-R15',
    name: 'FATF Recommendation 15',
    area: 'AML / CFT',
    status: 'PENDING',
    detail: 'flagService() function architecture drafted. SAR workflow and receiving authority unconfirmed.',
    blockedBy: 'FATF-1',
  },
  {
    id: 'GOVSTACK',
    name: 'GovStack Interoperability',
    area: 'Citizen Consent',
    status: 'PENDING',
    detail: 'EIP-712 citizen signature implementation drafted. Administrative mediation model unresolved.',
    blockedBy: 'AC-1-consent',
  },
  {
    id: 'GNOSIS-SAFE',
    name: 'Multisig Governance',
    area: 'Key Management',
    status: 'CRITICAL',
    detail: 'Single EOA controls all 4 contracts. Gnosis Safe 2-of-3 deployment scripts ready. Keyholders unconfirmed.',
    blockedBy: 'AC-2-multisig',
  },
]

const STATUS_STYLE = {
  READY:   { color: '#00c896', icon: '✓', bg: '#021a12', border: '#054030' },
  PENDING: { color: '#f0b429', icon: '⏳', bg: '#130f00', border: '#352a00' },
  CRITICAL:{ color: '#ff3b4e', icon: '✗', bg: '#180a0c', border: '#3a1018' },
}

export function CompliancePanel({ lang = 'EN' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} data-panel>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div data-panel-heading style={{ color: COLORS.gold, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '2px' }}>
          {lang === 'SM' ? 'USOGA TULAFONO' : 'REGULATORY COMPLIANCE STATUS'}
        </div>
        <button
          onClick={() => window.print()}
          data-print-hide
          aria-label="Print or export this panel"
          style={{
            fontFamily:   TYPOGRAPHY.mono,
            fontSize:     '11px',
            color:        COLORS.textMuted,
            background:   'none',
            border:       `1px solid ${COLORS.border}`,
            padding:      '4px 10px',
            borderRadius: '4px',
            cursor:       'pointer',
          }}
        >
          Export / Print
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FRAMEWORKS.map(fw => {
          const s = STATUS_STYLE[fw.status]
          return (
            <div key={fw.id} style={{
              background:   s.bg,
              border:       `1px solid ${s.border}`,
              borderRadius: 6,
              padding:      '14px 18px',
              display:      'grid',
              gridTemplateColumns: '1fr auto',
              gap:          '8px 16px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span aria-label={`Status: ${fw.status}`} style={{ color: s.color, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span aria-hidden="true">{s.icon}</span> {fw.status}
                  </span>
                  <span style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9 }}>{fw.id}</span>
                </div>
                <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{fw.name}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 11, fontFamily: TYPOGRAPHY.mono, marginBottom: 6 }}>
                  {fw.area}
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 12, lineHeight: 1.5 }}>{fw.detail}</div>
              </div>
              <div style={{
                color:         COLORS.blocked,
                fontFamily:    TYPOGRAPHY.mono,
                fontSize:      9,
                letterSpacing: '1px',
                whiteSpace:    'nowrap',
                alignSelf:     'start',
              }}>
                ↳ {fw.blockedBy}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9, letterSpacing: '0.8px' }}>
        {lang === 'SM'
          ? "E manaomia mea uma i luga mo le amata o Vaega 2."
          : "All frameworks above must reach READY status before Phase 2 launch. Status is derived from CBS governance decisions."}
      </div>

      <ResearchLabel />
    </div>
  )
}
