import React, { useState } from 'react'
import { C, MONO, SANS } from '../../constants'
import { PassengerArrivalDecl } from './PassengerArrivalDecl'
import { PassengerDepartureDecl } from './PassengerDepartureDecl'
import { AviationRiskPanel } from './AviationRiskPanel'
import type { TopRole } from '../../types'

interface Props {
  role: TopRole
  lang: string
}

type AviationSection = 'arrival' | 'departure'

export function AviationDashboard({ role, lang }: Props) {
  const [section, setSection] = useState<AviationSection>('arrival')

  if (role === 'officer') {
    return (
      <div style={{ padding: '24px' }}>
        <AviationRiskPanel />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Sub-tab selector for passenger */}
      <div style={{ display: 'flex', gap: 0, border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden', alignSelf: 'flex-start' }}>
        {([
          { key: 'arrival',   label: lang === 'SM' ? 'Taunuuga' : 'Arrival Declaration' },
          { key: 'departure', label: lang === 'SM' ? 'Malaga'   : 'Departure Declaration' },
        ] as { key: AviationSection; label: string }[]).map(s => (
          <button
            key={s.key}
            role="tab"
            aria-selected={section === s.key}
            onClick={() => setSection(s.key)}
            style={{
              background:  section === s.key ? C.flagBlue : C.surface2,
              border:      'none',
              borderRight: `1px solid ${C.border}`,
              color:       section === s.key ? '#fff' : C.muted,
              cursor:      'pointer',
              fontFamily:  MONO,
              fontSize:    12,
              fontWeight:  section === s.key ? 700 : 400,
              padding:     '10px 20px',
              minHeight:   40,
              letterSpacing: '0.3px',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span aria-hidden="true" style={{ fontSize: 16, flexShrink: 0 }}>ℹ</span>
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
          {section === 'arrival'
            ? 'Complete this form before your flight lands at Faleolo International Airport. Present the QR code to Immigration on arrival.'
            : 'Complete this form before checking in for your departing flight. Declare all currency exports over SAT 10,000 or equivalent.'}
        </div>
      </div>

      {section === 'arrival'
        ? <PassengerArrivalDecl lang={lang} />
        : <PassengerDepartureDecl lang={lang} />
      }
    </div>
  )
}
