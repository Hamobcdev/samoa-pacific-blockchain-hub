import React, { useState } from 'react'
import { C, MONO, SANS, DEMO_VESSELS, t } from '../../constants'
import { FormStep } from '../shared/FormStep'

const V = DEMO_VESSELS[0]

interface Props { lang: string; onNext: () => void; onBack: () => void }

export function MaritimeHealthDecl({ lang, onNext, onBack }: Props) {
  const [form, setForm] = useState({
    deratCert:           'DER-WS-2024-0098',
    deratExpiry:         '30/09/2026',
    illnessOnBoard:      false,
    deathOnBoard:        false,
    animalOnBoard:       false,
    sanitaryMeasures:    true,
    crewHealthDecl:      false,
  })
  const [submitted, setSubmitted] = useState(false)

  const check = (id: string, label: string, key: keyof typeof form) => (
    <label htmlFor={id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontFamily: SANS, fontSize: 13, color: C.muted }}>
      <input id={id} type="checkbox" checked={Boolean(form[key])} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} style={{ marginTop: 2, accentColor: C.flagBlue }} />
      {label}
    </label>
  )

  const yesno = (id: string, label: string, key: keyof typeof form, warningIf: boolean) => {
    const val = Boolean(form[key])
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontFamily: SANS, fontSize: 13, color: val === warningIf ? C.amber : C.muted }}>{label}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <input type="radio" name={id} checked={val} onChange={() => setForm(f => ({ ...f, [key]: true }))} style={{ accentColor: val && warningIf ? C.amber : C.flagBlue }} />
            <span style={{ fontFamily: MONO, fontSize: 12, color: val ? (warningIf ? C.amber : C.text) : C.dim }}>YES</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <input type="radio" name={id} checked={!val} onChange={() => setForm(f => ({ ...f, [key]: false }))} />
            <span style={{ fontFamily: MONO, fontSize: 12, color: !val ? C.text : C.dim }}>NO</span>
          </label>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={{ padding: '24px 0' }}>
        <div style={{ background: `${C.green}10`, border: `1px solid ${C.greenBdr}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
          <div style={{ color: C.green, fontFamily: MONO, fontSize: 12, fontWeight: 700 }}>✓ MARITIME HEALTH DECLARATION SUBMITTED — Routed to Port Health</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'back')}
          </button>
          <button onClick={onNext} style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '10px 22px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'next')} Harbour Dues
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
      <FormStep step={5} total={7} title={t(lang as Parameters<typeof t>[0], 'healthDeclaration')}>
        <div style={{ color: C.muted, fontFamily: MONO, fontSize: 11, marginBottom: 4 }}>WHO International Health Regulations · IHR Annex 9 · Routes to Port Health authority</div>

        <fieldset style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '14px', margin: 0 }}>
          <legend style={{ fontFamily: MONO, fontSize: 11, color: C.gold, padding: '0 8px' }}>DERATISATION</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label htmlFor="hd-cert" style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>Deratisation Certificate No.</label>
              <input id="hd-cert" value={form.deratCert} onChange={e => setForm(f => ({ ...f, deratCert: e.target.value }))}
                style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '7px 10px', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label htmlFor="hd-expiry" style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>Certificate Expiry (DD/MM/YYYY)</label>
              <input id="hd-expiry" value={form.deratExpiry} onChange={e => setForm(f => ({ ...f, deratExpiry: e.target.value }))}
                style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '7px 10px', outline: 'none' }} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '14px', margin: 0 }}>
          <legend style={{ fontFamily: MONO, fontSize: 11, color: C.gold, padding: '0 8px' }}>HEALTH QUESTIONS (explicit YES / NO required)</legend>
          {yesno('illness',   'Is there any illness on board?',                       'illnessOnBoard',   true)}
          {yesno('death',     'Has there been any death (non-accidental) on board?',  'deathOnBoard',     true)}
          {yesno('animal',    'Are there any animals, plants, or food items on board?','animalOnBoard',   true)}
          {yesno('sanitary',  'Have sanitary measures (fumigation, disinfection) been applied?', 'sanitaryMeasures', false)}
        </fieldset>

        <div style={{ marginTop: 4 }}>
          {check('hd-crew-decl', 'All crew members are in good health. No crew member has been exposed to a communicable disease in the last 30 days.', 'crewHealthDecl')}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'back')}
          </button>
          <button type="button" onClick={() => setSubmitted(true)} style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '10px 22px', minHeight: 40 }}>
            Submit Health Declaration
          </button>
        </div>
      </FormStep>
    </div>
  )
}
