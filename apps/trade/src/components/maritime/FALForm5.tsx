import React, { useState } from 'react'
import { C, MONO, SANS, DEMO_VESSELS, t } from '../../constants'
import { FormStep } from '../shared/FormStep'
import type { CrewMember } from '../../types'

const V = DEMO_VESSELS[0]

const DEMO_CREW: CrewMember[] = [
  { rank: 'Master',       familyName: 'Faleolo',   givenNames: 'James',   nationality: 'WS', passportNumber: 'SW018421', passportExpiry: '12/2028', seafarersBookNumber: 'SB-WS-4521', placeOfBirth: 'Apia', dateOfBirth: '15/03/1978' },
  { rank: 'Chief Officer',familyName: 'Tuilagi',   givenNames: 'Sione',   nationality: 'WS', passportNumber: 'SW024881', passportExpiry: '06/2027', seafarersBookNumber: 'SB-WS-3812', placeOfBirth: 'Siusega', dateOfBirth: '22/07/1984' },
  { rank: 'Chief Engineer',familyName:'Palu',       givenNames: 'Tauese',  nationality: 'FJ', passportNumber: 'FP211034', passportExpiry: '03/2026', seafarersBookNumber: 'SB-FJ-9011', placeOfBirth: 'Suva',  dateOfBirth: '08/11/1980' },
]

interface Props { lang: string; onNext: () => void; onBack: () => void }

export function FALForm5({ lang, onNext, onBack }: Props) {
  const [crew]      = useState<CrewMember[]>(DEMO_CREW)
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div style={{ padding: '24px 0' }}>
        <div style={{ background: `${C.green}10`, border: `1px solid ${C.greenBdr}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
          <div style={{ color: C.green, fontFamily: MONO, fontSize: 12, fontWeight: 700 }}>✓ FAL FORM 5 SUBMITTED — CREW LIST ({V.totalCrew} crew members)</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'back')}
          </button>
          <button onClick={onNext} style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '10px 22px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'next')} Health Declaration
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '100%' }}>
      <FormStep step={3} total={7} title="FAL Form 5 — Crew List">
        <div style={{ color: C.muted, fontFamily: MONO, fontSize: 11, marginBottom: 4 }}>
          Vessel: {V.vesselName} · IMO {V.imoNumber} · Total crew: {V.totalCrew}
        </div>
        <div style={{ color: C.muted, fontFamily: SANS, fontSize: 13, marginBottom: 12 }}>
          Showing first 3 of {V.totalCrew} crew members (demo). Routes to Immigration (visa check) and Port Authority (seafarers' books).
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table role="table" style={{ width: '100%', borderCollapse: 'collapse', fontFamily: MONO, fontSize: 11 }}>
            <caption style={{ fontFamily: SANS, fontSize: 12, color: C.muted, textAlign: 'left', marginBottom: 8 }}>
              Crew list — {V.vesselName} — {new Date().toLocaleDateString('en-GB')}
            </caption>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Rank','Family Name','Given Names','Nationality','Passport No.','Expiry','Seafarers Book','DOB'].map(h => (
                  <th key={h} scope="col" style={{ color: C.muted, fontWeight: 600, letterSpacing: '0.5px', padding: '8px 12px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crew.map((m, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : `${C.surface2}50` }}>
                  <td style={{ color: C.gold, padding: '8px 12px', whiteSpace: 'nowrap' }}>{m.rank}</td>
                  <td style={{ color: C.text, padding: '8px 12px' }}>{m.familyName}</td>
                  <td style={{ color: C.text, padding: '8px 12px' }}>{m.givenNames}</td>
                  <td style={{ color: C.muted, padding: '8px 12px' }}>{m.nationality}</td>
                  <td style={{ color: C.text, padding: '8px 12px' }}>{m.passportNumber}</td>
                  <td style={{ color: m.passportExpiry < '01/2026' ? C.critical : C.muted, padding: '8px 12px' }}>{m.passportExpiry}</td>
                  <td style={{ color: C.muted, padding: '8px 12px' }}>{m.seafarersBookNumber}</td>
                  <td style={{ color: C.muted, padding: '8px 12px' }}>{m.dateOfBirth}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={8} style={{ color: C.dim, fontFamily: SANS, fontSize: 12, padding: '10px 12px', fontStyle: 'italic' }}>
                  + {V.totalCrew - crew.length} additional crew members (demo abbreviated)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="button" onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'back')}
          </button>
          <button type="button" onClick={() => setSubmitted(true)} style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '10px 22px', minHeight: 40 }}>
            Submit Crew List
          </button>
        </div>
      </FormStep>
    </div>
  )
}
