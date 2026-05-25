import React, { useState } from 'react'
import { C, MONO, SANS, DEMO_VESSELS, t } from '../../constants'
import { FormStep } from '../shared/FormStep'
import { generateNOARef } from '../../hooks/useOMWSubmission'

const VESSEL = DEMO_VESSELS[0]

interface Props {
  lang:     string
  onNext:   (ref: string) => void
}

export function NoticeOfArrival({ lang, onNext }: Props) {
  const [form, setForm] = useState({
    vesselName:         VESSEL.vesselName,
    imoNumber:          VESSEL.imoNumber,
    vesselType:         VESSEL.vesselType,
    flagState:          VESSEL.flagState,
    grossTonnage:       String(VESSEL.grossTonnage),
    lengthOverall:      String(VESSEL.lengthOverall),
    portOfDeparture:    'Noumea, New Caledonia',
    departureDate:      '15/05/2026 06:00',
    estimatedArrival:   VESSEL.estimatedArrival,
    destinationBerth:   VESSEL.destinationBerth,
    hasDangerousGoods:  false,
    totalCrew:          String(VESSEL.totalCrew),
    totalPassengers:    String(VESSEL.totalPassengers),
    shippingAgentName:  VESSEL.shippingAgentName,
    agentLicenceNumber: VESSEL.agentLicenceNumber,
    contactEmail:       'ops@samoashipping.ws',
    contactPhone:       '+685 21234',
  })
  const [submitted, setSubmitted] = useState(false)
  const [ref, setRef]             = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRef = generateNOARef()
    setRef(newRef)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ padding: '32px 0', maxWidth: 580 }}>
        <div style={{ background: `${C.green}10`, border: `1px solid ${C.greenBdr}`, borderRadius: 8, padding: '24px', marginBottom: 24 }}>
          <div style={{ color: C.green, fontFamily: MONO, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            ✓ NOTICE OF ARRIVAL SUBMITTED
          </div>
          <div style={{ color: C.text, fontFamily: MONO, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            {ref}
          </div>
          <div style={{ color: C.muted, fontFamily: SANS, fontSize: 14 }}>
            Vessel: {form.vesselName} · IMO {form.imoNumber}<br />
            ETA: {form.estimatedArrival} WST
          </div>
        </div>
        <button
          onClick={() => onNext(ref)}
          style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '12px 24px', minHeight: 44 }}
        >
          {t(lang as Parameters<typeof t>[0], 'next')} Continue to FAL Form 1
        </button>
      </div>
    )
  }

  const field = (id: string, label: string, value: string, onChange: (v: string) => void, type = 'text') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label htmlFor={id} style={{ fontFamily: SANS, fontSize: 13, color: C.muted, fontWeight: 500 }}>{label}</label>
      <input
        id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 13, padding: '8px 12px', outline: 'none' }}
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      <FormStep step={1} total={7} title={t(lang as Parameters<typeof t>[0], 'noticeOfArrival')}>
        <div style={{ color: C.muted, fontFamily: SANS, fontSize: 13, marginBottom: 8 }}>
          Submit at least 48–72 hours before estimated arrival. All fields are pre-populated with demo vessel data.
        </div>

        <fieldset style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '16px', margin: 0 }}>
          <legend style={{ fontFamily: MONO, fontSize: 11, color: C.gold, padding: '0 8px', letterSpacing: '1px' }}>VESSEL DETAILS</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {field('noa-vessel', 'Vessel Name', form.vesselName, v => setForm(f => ({ ...f, vesselName: v })))}
            {field('noa-imo', 'IMO Number (7 digits)', form.imoNumber, v => setForm(f => ({ ...f, imoNumber: v })))}
            {field('noa-flag', 'Flag State (ISO 3166-1)', form.flagState, v => setForm(f => ({ ...f, flagState: v })))}
            {field('noa-gt', 'Gross Tonnage (GT)', form.grossTonnage, v => setForm(f => ({ ...f, grossTonnage: v })), 'number')}
            {field('noa-loa', 'Length Overall (m)', form.lengthOverall, v => setForm(f => ({ ...f, lengthOverall: v })), 'number')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label htmlFor="noa-type" style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>Vessel Type</label>
              <select id="noa-type" value={form.vesselType} onChange={e => setForm(f => ({ ...f, vesselType: e.target.value as typeof form.vesselType }))}
                style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 13, padding: '8px 12px', outline: 'none' }}>
                {['CARGO','TANKER','PASSENGER','BULK','OTHER'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '16px', margin: 0 }}>
          <legend style={{ fontFamily: MONO, fontSize: 11, color: C.gold, padding: '0 8px', letterSpacing: '1px' }}>VOYAGE</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {field('noa-dep', 'Port of Departure', form.portOfDeparture, v => setForm(f => ({ ...f, portOfDeparture: v })))}
            {field('noa-depdt', 'Departure Date (DD/MM/YYYY HH:MM WST)', form.departureDate, v => setForm(f => ({ ...f, departureDate: v })))}
            {field('noa-eta', 'Estimated Arrival (DD/MM/YYYY HH:MM WST)', form.estimatedArrival, v => setForm(f => ({ ...f, estimatedArrival: v })))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label htmlFor="noa-berth" style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>Destination Berth</label>
              <select id="noa-berth" value={form.destinationBerth} onChange={e => setForm(f => ({ ...f, destinationBerth: e.target.value as typeof form.destinationBerth }))}
                style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 13, padding: '8px 12px', outline: 'none' }}>
                <option value="APIA_MAIN">Apia Main Wharf</option>
                <option value="APIA_DOMESTIC">Apia Domestic</option>
                <option value="SALELOLOGA">Salelologa</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '16px', margin: 0 }}>
          <legend style={{ fontFamily: MONO, fontSize: 11, color: C.gold, padding: '0 8px', letterSpacing: '1px' }}>CREW & CARGO</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {field('noa-crew', 'Total Crew', form.totalCrew, v => setForm(f => ({ ...f, totalCrew: v })), 'number')}
            {field('noa-pax', 'Total Passengers', form.totalPassengers, v => setForm(f => ({ ...f, totalPassengers: v })), 'number')}
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input id="noa-dg" type="checkbox" checked={form.hasDangerousGoods} onChange={e => setForm(f => ({ ...f, hasDangerousGoods: e.target.checked }))} />
            <label htmlFor="noa-dg" style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>Vessel is carrying dangerous goods (IMDG) — FAL Form 7 required</label>
          </div>
        </fieldset>

        <fieldset style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '16px', margin: 0 }}>
          <legend style={{ fontFamily: MONO, fontSize: 11, color: C.gold, padding: '0 8px', letterSpacing: '1px' }}>AGENT</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {field('noa-agent', 'Shipping Agent Name', form.shippingAgentName, v => setForm(f => ({ ...f, shippingAgentName: v })))}
            {field('noa-lic', 'Agent Licence Number', form.agentLicenceNumber, v => setForm(f => ({ ...f, agentLicenceNumber: v })))}
            {field('noa-email', 'Contact Email', form.contactEmail, v => setForm(f => ({ ...f, contactEmail: v })), 'email')}
            {field('noa-phone', 'Contact Phone', form.contactPhone, v => setForm(f => ({ ...f, contactPhone: v })))}
          </div>
        </fieldset>

        <button
          type="submit"
          style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '12px 24px', minHeight: 44, alignSelf: 'flex-start' }}
        >
          Submit Notice of Arrival
        </button>
      </FormStep>
    </form>
  )
}
