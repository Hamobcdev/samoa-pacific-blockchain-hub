import React, { useState } from 'react'
import { C, MONO, SANS, t } from '../../constants'
import { AviationQROutput } from './AviationQROutput'

let _depSeq = 310
function nextDepRef(): string {
  _depSeq += 1
  return `DEP-${new Date().getFullYear()}-${String(_depSeq).padStart(6, '0')}`
}

interface Props { lang: string }

export function PassengerDepartureDecl({ lang }: Props) {
  const [form, setForm] = useState({
    familyName:        '',
    givenNames:        '',
    passportNumber:    '',
    flightNumber:      '',
    departureDatetime: '',
    exportingCurrency: false,
    currencyExportAmount: '',
    currencyExportType:   'WST',
  })
  const [submitted, setSubmitted] = useState(false)
  const [ref, setRef]             = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRef(nextDepRef())
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AviationQROutput
        ref_={ref}
        name={`${form.familyName}, ${form.givenNames}`}
        passport={form.passportNumber}
        flight={form.flightNumber}
        date={form.departureDatetime}
        isArrival={false}
        onReset={() => { setSubmitted(false); setRef('') }}
      />
    )
  }

  const field = (id: string, label: string, value: string, onChange: (v: string) => void, type = 'text') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label htmlFor={id} style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>
        {label} <span style={{ color: C.critical }}>*</span>
      </label>
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} required
        style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 13, padding: '8px 12px', outline: 'none' }} />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
      <div style={{ fontFamily: MONO, fontSize: 12, color: C.gold, letterSpacing: '1px', textTransform: 'uppercase' }}>
        {t(lang as Parameters<typeof t>[0], 'departureDeclaration')}
      </div>

      <fieldset style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, margin: 0 }}>
        <legend style={{ fontFamily: MONO, fontSize: 11, color: C.gold, padding: '0 8px' }}>TRAVELLER</legend>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {field('dep-fam', 'Family Name', form.familyName, v => setForm(f => ({ ...f, familyName: v })))}
          {field('dep-giv', 'Given Names', form.givenNames, v => setForm(f => ({ ...f, givenNames: v })))}
          {field('dep-pp',  'Passport Number', form.passportNumber, v => setForm(f => ({ ...f, passportNumber: v })))}
          {field('dep-flt', 'Flight Number', form.flightNumber, v => setForm(f => ({ ...f, flightNumber: v })))}
        </div>
        {field('dep-dt', 'Departure (DD/MM/YYYY HH:MM WST)', form.departureDatetime, v => setForm(f => ({ ...f, departureDatetime: v })))}
      </fieldset>

      <fieldset style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, margin: 0 }}>
        <legend style={{ fontFamily: MONO, fontSize: 11, color: C.gold, padding: '0 8px' }}>CURRENCY EXPORT</legend>
        <label htmlFor="dep-curr" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: SANS, fontSize: 13, color: C.muted, marginBottom: 12 }}>
          <input id="dep-curr" type="checkbox" checked={form.exportingCurrency} onChange={e => setForm(f => ({ ...f, exportingCurrency: e.target.checked }))} style={{ accentColor: C.amber }} />
          Are you exporting currency over SAT 10,000 or equivalent?
        </label>
        {form.exportingCurrency && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {field('dep-ca', 'Amount', form.currencyExportAmount, v => setForm(f => ({ ...f, currencyExportAmount: v })), 'number')}
            {field('dep-ct', 'Currency Code', form.currencyExportType, v => setForm(f => ({ ...f, currencyExportType: v })))}
          </div>
        )}
      </fieldset>

      <button type="submit" style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '12px 24px', minHeight: 44, alignSelf: 'flex-start' }}>
        Submit Departure Declaration → Get QR
      </button>
    </form>
  )
}
