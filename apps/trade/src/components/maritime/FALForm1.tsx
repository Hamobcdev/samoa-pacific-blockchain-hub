import React, { useState } from 'react'
import { C, MONO, SANS, DEMO_VESSELS, t } from '../../constants'
import { FormStep } from '../shared/FormStep'
import { OfficerCredentialInput } from '../shared/OfficerCredentialInput'

const V = DEMO_VESSELS[0]

interface Props { lang: string; onNext: () => void; onBack: () => void }

export function FALForm1({ lang, onNext, onBack }: Props) {
  const [form, setForm] = useState({
    arrivalPort: 'Port of Apia, Independent State of Samoa',
    vesselName:  V.vesselName,
    imoNumber:   V.imoNumber,
    callSign:    'V7GH4',
    flagState:   V.flagState,
    lastPort:    'Noumea, New Caledonia',
    nextPort:    'Suva, Fiji',
    masterName:  V.masterName,
    masterNationality: 'WS',
    safetyMgmtCert: 'SMC-2024-WS-00341',
    declarationAccurate: false,
    noContraband:        false,
    noStowaways:         false,
    sigHashCred:   '',
  })
  const [submitted, setSubmitted] = useState(false)

  const check = (id: string, label: string, checked: boolean, onChange: (v: boolean) => void) => (
    <label htmlFor={id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontFamily: SANS, fontSize: 13, color: C.muted }}>
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ marginTop: 2, accentColor: C.flagBlue }} />
      {label}
    </label>
  )

  const field = (id: string, num: string, label: string, value: string, onChange: (v: string) => void) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label htmlFor={id} style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>
        <span style={{ fontFamily: MONO, color: C.gold, fontSize: 11 }}>{num}.</span> {label}
      </label>
      <input id={id} value={value} onChange={e => onChange(e.target.value)}
        style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '7px 10px', outline: 'none' }} />
    </div>
  )

  if (submitted) {
    return (
      <div style={{ padding: '24px 0' }}>
        <div style={{ background: `${C.green}10`, border: `1px solid ${C.greenBdr}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
          <div style={{ color: C.green, fontFamily: MONO, fontSize: 12, fontWeight: 700 }}>✓ FAL FORM 1 SUBMITTED — GENERAL DECLARATION</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'back')}
          </button>
          <button onClick={onNext} style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '10px 22px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'next')} Crew List
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      <FormStep step={2} total={7} title="FAL Form 1 — General Declaration">
        <div style={{ color: C.muted, fontFamily: MONO, fontSize: 11, marginBottom: 4 }}>IMO FAL Convention · Form 1 · International Maritime Organization standard</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {field('f1-port',    '1', 'Port of Arrival',            form.arrivalPort,     v => setForm(f => ({ ...f, arrivalPort: v })))}
          {field('f1-vessel',  '2', 'Name of Ship',               form.vesselName,      v => setForm(f => ({ ...f, vesselName: v })))}
          {field('f1-imo',     '4', 'IMO Number',                 form.imoNumber,       v => setForm(f => ({ ...f, imoNumber: v })))}
          {field('f1-call',    '5', 'Call Sign',                  form.callSign,        v => setForm(f => ({ ...f, callSign: v })))}
          {field('f1-flag',    '3', 'Flag State',                 form.flagState,       v => setForm(f => ({ ...f, flagState: v })))}
          {field('f1-last',    '6', 'Last Port of Call',          form.lastPort,        v => setForm(f => ({ ...f, lastPort: v })))}
          {field('f1-next',    '7', 'Next Port of Call',          form.nextPort,        v => setForm(f => ({ ...f, nextPort: v })))}
          {field('f1-master',  '8', 'Master / Commanding Officer',form.masterName,      v => setForm(f => ({ ...f, masterName: v })))}
          {field('f1-nat',     '9', 'Master Nationality',         form.masterNationality, v => setForm(f => ({ ...f, masterNationality: v })))}
          {field('f1-smc',    '10', 'Safety Management Certificate', form.safetyMgmtCert, v => setForm(f => ({ ...f, safetyMgmtCert: v })))}
        </div>

        <fieldset style={{ border: `1px solid ${C.amberBdr}`, borderRadius: 6, padding: 14, margin: '4px 0' }}>
          <legend style={{ fontFamily: MONO, fontSize: 11, color: C.amber, padding: '0 8px', letterSpacing: '1px' }}>MASTER DECLARATIONS (explicit YES required)</legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {check('f1-decl', 'I declare the information in this form to be correct.', form.declarationAccurate, v => setForm(f => ({ ...f, declarationAccurate: v })))}
            {check('f1-contra', 'No contraband goods are on board.', form.noContraband, v => setForm(f => ({ ...f, noContraband: v })))}
            {check('f1-stow', 'No stowaways have been found on board.', form.noStowaways, v => setForm(f => ({ ...f, noStowaways: v })))}
          </div>
        </fieldset>

        <OfficerCredentialInput id="f1-cred" value={form.sigHashCred} onChange={v => setForm(f => ({ ...f, sigHashCred: v }))} label="Master Signature Credential Hash" />

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'back')}
          </button>
          <button type="submit" style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '10px 22px', minHeight: 40 }}>
            Submit FAL Form 1
          </button>
        </div>
      </FormStep>
    </form>
  )
}
