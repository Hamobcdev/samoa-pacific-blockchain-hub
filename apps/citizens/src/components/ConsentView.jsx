import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { CL, FL } from '../theme.js'

// Phase 1 — simulated consent grants
// PHASE 2: replace with on-chain consent reads
const MOCK_CONSENTS = [
  {
    id:       1,
    ministry: 'Ministry of Finance',
    purpose:  'to verify your benefit eligibility',
    grantedOn: '15/05/2026',
  },
  {
    id:       2,
    ministry: 'Ministry of Health',
    purpose:  'to confirm your vaccination status',
    grantedOn: '03/03/2026',
  },
]

const T = {
  heading:    { sm: 'O ai e mafai ona vaai i au faamaumauga', en: 'Who can see your record' },
  given:      { sm: 'ua tu\'uina atu le avanoa i le', en: 'was given access on' },
  purpose:    { sm: 'mo le', en: 'to' },
  revoke:     { sm: 'Fa\'ato\'a le avanoa →', en: 'Revoke access →' },
  phase2:     { sm: 'O lenei mea e oo mai i Vaega 2', en: 'Coming in Phase 2' },
}

function ConsentCard({ consent }) {
  const { lang } = useLanguage()
  const t = (key) => T[key]?.[lang] ?? T[key]?.en ?? key
  const [showPhase2, setShowPhase2] = useState(false)

  return (
    <div style={{
      background:   CL.surface,
      border:       `1px solid ${CL.border}`,
      borderRadius: 10,
      padding:      '16px 18px',
      display:      'flex',
      flexDirection: 'column',
      gap:          8,
    }}>
      <div style={{ fontFamily: FL.ui, fontSize: 15, fontWeight: 700, color: CL.text }}>
        {consent.ministry}
      </div>
      <div style={{ fontFamily: FL.ui, fontSize: 13, color: CL.muted, lineHeight: 1.6 }}>
        {t('given')} {consent.grantedOn}<br />
        {t('purpose')} {consent.purpose}
      </div>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowPhase2(true)}
          onBlur={() => setShowPhase2(false)}
          style={{
            background:   'none',
            border:       `1px solid ${CL.border}`,
            borderRadius: 6,
            color:        CL.muted,
            cursor:       'pointer',
            fontFamily:   FL.ui,
            fontSize:     '13px',
            padding:      '8px 14px',
            minHeight:    '48px',
          }}
        >
          {t('revoke')}
        </button>
        {showPhase2 && (
          <span role="tooltip" style={{
            position:   'absolute',
            bottom:     'calc(100% + 6px)',
            left:       0,
            background: CL.text,
            color:      '#fff',
            fontFamily: FL.mono,
            fontSize:   '11px',
            padding:    '4px 10px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            zIndex:     99,
          }}>
            {t('phase2')}
          </span>
        )}
      </div>
    </div>
  )
}

export function ConsentView() {
  const { lang } = useLanguage()
  const t = (key) => T[key]?.[lang] ?? T[key]?.en ?? key

  return (
    <section aria-labelledby="consent-heading" style={{
      maxWidth:  640,
      margin:    '0 auto',
    }}>
      <h2 id="consent-heading" style={{ fontFamily: FL.display, fontSize: 20, fontWeight: 700, color: CL.primary, margin: '0 0 4px' }}>
        {t('heading')}
      </h2>
      <div style={{ height: 1, background: CL.border, margin: '8px 0 16px' }} />

      {/* PHASE 2: replace mock with on-chain consent reads via InteroperabilityHub */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MOCK_CONSENTS.map(c => <ConsentCard key={c.id} consent={c} />)}
      </div>
    </section>
  )
}
