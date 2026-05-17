import React, { useState } from 'react'
import { C, MONO, SANS, DEMO_VESSELS, t } from '../../constants'
import { FormStep } from '../shared/FormStep'

const V = DEMO_VESSELS[2] // Savaii Explorer — has dangerous goods

interface Props { lang: string; onNext: () => void; onBack: () => void; shown?: boolean }

export function FALForm7({ lang, onNext, onBack, shown = true }: Props) {
  const [submitted, setSubmitted] = useState(false)

  if (!shown) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 0' }}>
        <div style={{ background: `${C.green}08`, border: `1px solid ${C.border}`, borderRadius: 6, padding: '12px 16px', color: C.muted, fontFamily: MONO, fontSize: 12 }}>
          ➖ FAL Form 7 — NOT REQUIRED · No dangerous goods declared for this vessel.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
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

  if (submitted) {
    return (
      <div style={{ padding: '24px 0' }}>
        <div style={{ background: `${C.amber}10`, border: `1px solid ${C.amberBdr}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
          <div style={{ color: C.amber, fontFamily: MONO, fontSize: 12, fontWeight: 700 }}>⚠ FAL FORM 7 SUBMITTED — DANGEROUS GOODS MANIFEST</div>
          <div style={{ color: C.muted, fontFamily: SANS, fontSize: 13, marginTop: 8 }}>
            Routed to: MAF / Biosecurity for cargo risk assessment and Port Authority for berth assignment.
          </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      <FormStep step={4} total={7} title="FAL Form 7 — Dangerous Goods Manifest">
        <div style={{ background: `${C.critical}10`, border: `1px solid ${C.critBdr}`, borderRadius: 6, padding: '10px 14px', marginBottom: 8 }}>
          <div style={{ color: C.critical, fontFamily: MONO, fontSize: 11, fontWeight: 700 }}>⚠ DANGEROUS GOODS DECLARED — IMDG compliance required</div>
          <div style={{ color: C.muted, fontFamily: SANS, fontSize: 13, marginTop: 4 }}>
            Vessel: {V.vesselName} · IMO {V.imoNumber}
          </div>
        </div>

        <table role="table" style={{ width: '100%', borderCollapse: 'collapse', fontFamily: MONO, fontSize: 11 }}>
          <caption style={{ fontFamily: SANS, fontSize: 12, color: C.muted, textAlign: 'left', marginBottom: 8 }}>
            Dangerous goods manifest — {V.vesselName}
          </caption>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['IMDG Class','UN No.','Proper Shipping Name','Qty','Unit','Flashpoint'].map(h => (
                <th key={h} scope="col" style={{ color: C.muted, fontWeight: 600, fontSize: 10, textTransform: 'uppercase', padding: '8px 10px', textAlign: 'left', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <td style={{ color: C.critical, padding: '8px 10px' }}>Class 3</td>
              <td style={{ color: C.text, padding: '8px 10px' }}>UN1203</td>
              <td style={{ color: C.text, padding: '8px 10px' }}>Motor spirit (Petrol/Gasoline)</td>
              <td style={{ color: C.text, padding: '8px 10px' }}>25,000</td>
              <td style={{ color: C.muted, padding: '8px 10px' }}>L</td>
              <td style={{ color: C.amber, padding: '8px 10px' }}>-43°C</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <input id="f7-decl" type="checkbox" style={{ marginTop: 2, accentColor: C.amber }} />
          <label htmlFor="f7-decl" style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>
            I, the Master, declare that the dangerous goods described above are properly packaged, marked, labelled, and placarded in accordance with the IMDG Code.
          </label>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'back')}
          </button>
          <button type="button" onClick={() => setSubmitted(true)} style={{ background: C.amber, border: 'none', borderRadius: 6, color: C.bg, cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 700, padding: '10px 22px', minHeight: 40 }}>
            Submit FAL Form 7
          </button>
        </div>
      </FormStep>
    </div>
  )
}
