import React, { useState } from 'react'
import { C, MONO, SANS, t } from '../../constants'
import { AviationQROutput } from './AviationQROutput'
import type { PurposeCode } from '../../types'

let _arrSeq = 191
function nextArrRef(): string {
  _arrSeq += 1
  return `ARR-${new Date().getFullYear()}-${String(_arrSeq).padStart(6, '0')}`
}

interface Props { lang: string }

export function PassengerArrivalDecl({ lang }: Props) {
  const [form, setForm] = useState({
    familyName:     '',
    givenNames:     '',
    dateOfBirth:    '',
    nationality:    '',
    passportNumber: '',
    passportExpiry: '',
    flightNumber:   'FJ411',
    departureAirport:'NAN',
    arrivalDate:    '17/05/2026',
    accommodationAddress: '',
    purposeOfVisit: 'TOURISM' as PurposeCode,
    stayDuration:   '14',
    carryingGoods:  false,
    carryingCurrency: false,
    carryingAnimals:  false,
    previousIllness:  false,
    goodsValue:       '',
    currencyAmount:   '',
    currencyType:     'NZD',
  })
  const [submitted, setSubmitted] = useState(false)
  const [ref, setRef]             = useState('')
  const [errors, setErrors]       = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.familyName)     e.familyName     = 'Family name is required'
    if (!form.passportNumber) e.passportNumber = 'Passport number is required'
    if (!form.flightNumber.match(/^[A-Z]{2}\d{1,4}$/i)) e.flightNumber = 'Format: 2 letters + 1–4 digits (e.g. FJ411)'
    if (!form.accommodationAddress) e.accommodationAddress = 'First night accommodation is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const newRef = nextArrRef()
    setRef(newRef)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AviationQROutput
        ref_={ref}
        name={`${form.familyName}, ${form.givenNames}`}
        passport={form.passportNumber}
        flight={form.flightNumber}
        date={form.arrivalDate}
        isArrival={true}
        onReset={() => { setSubmitted(false); setRef('') }}
      />
    )
  }

  const field = (id: string, label: string, value: string, onChange: (v: string) => void, type = 'text', required = true) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label htmlFor={id} style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>
        {label}{required && <span style={{ color: C.critical }}> *</span>}
      </label>
      <input
        id={id} type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        aria-describedby={errors[id] ? `${id}-err` : undefined}
        aria-invalid={!!errors[id]}
        style={{ background: C.surface2, border: `1px solid ${errors[id] ? C.critical : C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 13, padding: '8px 12px', outline: 'none' }}
      />
      {errors[id] && <span id={`${id}-err`} role="alert" aria-live="polite" style={{ color: C.critical, fontFamily: SANS, fontSize: 12 }}>{errors[id]}</span>}
    </div>
  )

  const yesno = (id: string, label: string, key: keyof typeof form, warningIf = true) => {
    const val = Boolean(form[key])
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
        <label style={{ fontFamily: SANS, fontSize: 13, color: val === warningIf ? C.amber : C.muted, flex: 1 }}>{label}</label>
        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ display: 'flex', gap: 4, alignItems: 'center', cursor: 'pointer' }}>
            <input type="radio" name={id} checked={val} onChange={() => setForm(f => ({ ...f, [key]: true }))} style={{ accentColor: C.amber }} />
            <span style={{ fontFamily: MONO, fontSize: 12, color: C.text }}>YES</span>
          </label>
          <label style={{ display: 'flex', gap: 4, alignItems: 'center', cursor: 'pointer' }}>
            <input type="radio" name={id} checked={!val} onChange={() => setForm(f => ({ ...f, [key]: false }))} />
            <span style={{ fontFamily: MONO, fontSize: 12, color: C.text }}>NO</span>
          </label>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
      <div style={{ fontFamily: MONO, fontSize: 12, color: C.gold, letterSpacing: '1px', textTransform: 'uppercase' }}>
        {t(lang as Parameters<typeof t>[0], 'arrivalDeclaration')}
      </div>

      <fieldset style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, margin: 0 }}>
        <legend style={{ fontFamily: MONO, fontSize: 11, color: C.gold, padding: '0 8px' }}>PERSONAL DETAILS</legend>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {field('arr-fam', 'Family Name', form.familyName, v => setForm(f => ({ ...f, familyName: v })))}
          {field('arr-giv', 'Given Names', form.givenNames, v => setForm(f => ({ ...f, givenNames: v })))}
          {field('arr-dob', 'Date of Birth (DD/MM/YYYY)', form.dateOfBirth, v => setForm(f => ({ ...f, dateOfBirth: v })))}
          {field('arr-nat', 'Nationality (ISO 3166-1)', form.nationality, v => setForm(f => ({ ...f, nationality: v })))}
          {field('arr-pp', 'Passport Number', form.passportNumber, v => setForm(f => ({ ...f, passportNumber: v })))}
          {field('arr-ppx', 'Passport Expiry (DD/MM/YYYY)', form.passportExpiry, v => setForm(f => ({ ...f, passportExpiry: v })))}
        </div>
      </fieldset>

      <fieldset style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, margin: 0 }}>
        <legend style={{ fontFamily: MONO, fontSize: 11, color: C.gold, padding: '0 8px' }}>TRAVEL DETAILS</legend>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {field('arr-flt', 'Flight Number (e.g. FJ411)', form.flightNumber, v => setForm(f => ({ ...f, flightNumber: v })))}
          {field('arr-iata', 'Departure Airport (IATA code)', form.departureAirport, v => setForm(f => ({ ...f, departureAirport: v })))}
          {field('arr-date', 'Arrival Date (DD/MM/YYYY)', form.arrivalDate, v => setForm(f => ({ ...f, arrivalDate: v })))}
          {field('arr-acc', 'First Night Accommodation Address', form.accommodationAddress, v => setForm(f => ({ ...f, accommodationAddress: v })))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label htmlFor="arr-pur" style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>Purpose of Visit</label>
            <select id="arr-pur" value={form.purposeOfVisit} onChange={e => setForm(f => ({ ...f, purposeOfVisit: e.target.value as PurposeCode }))}
              style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 13, padding: '8px 12px', outline: 'none' }}>
              {(['TOURISM','BUSINESS','TRANSIT','RESIDENT','OTHER'] as PurposeCode[]).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          {field('arr-stay', 'Stay Duration (nights)', form.stayDuration, v => setForm(f => ({ ...f, stayDuration: v })), 'number')}
        </div>
      </fieldset>

      <fieldset style={{ border: `1px solid ${C.amberBdr}`, borderRadius: 6, padding: 16, margin: 0 }}>
        <legend style={{ fontFamily: MONO, fontSize: 11, color: C.amber, padding: '0 8px' }}>CUSTOMS QUESTIONS (explicit YES / NO required)</legend>
        {yesno('arr-goods', 'Are you carrying goods over the duty-free allowance?',       'carryingGoods')}
        {yesno('arr-curr',  'Are you carrying currency over SAT 10,000 or equivalent?',   'carryingCurrency')}
        {yesno('arr-anim',  'Are you carrying animals, plants, or food items?',            'carryingAnimals')}
        {yesno('arr-ill',   'Have you been ill in the last 30 days?',                      'previousIllness')}
        {form.carryingCurrency && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 12 }}>
            {field('arr-camount', 'Currency Amount', form.currencyAmount, v => setForm(f => ({ ...f, currencyAmount: v })), 'number', false)}
            {field('arr-ctype', 'Currency Code (e.g. NZD)', form.currencyType, v => setForm(f => ({ ...f, currencyType: v })), 'text', false)}
          </div>
        )}
        {form.carryingGoods && (
          <div style={{ paddingTop: 12 }}>
            {field('arr-gval', 'Estimated Goods Value (WST)', form.goodsValue, v => setForm(f => ({ ...f, goodsValue: v })), 'number', false)}
          </div>
        )}
      </fieldset>

      <button type="submit" style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '12px 24px', minHeight: 44, alignSelf: 'flex-start' }}>
        Submit Declaration → Get QR Code
      </button>
    </form>
  )
}
