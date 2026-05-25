import React from 'react'
import { C, MONO, SANS } from '../../constants'
import { QRCodeDisplay } from '../shared/QRCodeDisplay'

interface Props {
  ref_:    string
  name:    string
  passport:string
  flight:  string
  date:    string
  isArrival: boolean
  onReset: () => void
}

function maskPassport(n: string): string {
  if (n.length <= 4) return n.slice(0, 2) + '****'
  return n.slice(0, 2) + '****' + n.slice(-2)
}

export function AviationQROutput({ ref_, name, passport, flight, date, isArrival, onReset }: Props) {
  const qrData = `https://verify.dpi.gov.ws/passenger/${ref_}`

  const mailto = `mailto:?subject=Samoa ${isArrival ? 'Arrival' : 'Departure'} Declaration ${ref_}&body=Reference: ${ref_}%0AName: ${name}%0AFlight: ${flight}%0ADate: ${date}%0AVerify: ${qrData}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
      <div style={{ background: C.surface2, border: `2px solid ${C.gold}30`, borderRadius: 10, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: C.flagBlue, padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ color: '#fff', fontFamily: MONO, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 2 }}>
            SAMOA {isArrival ? 'ARRIVAL' : 'DEPARTURE'} DECLARATION
          </div>
          <div style={{ color: C.gold, fontFamily: SANS, fontSize: 15, fontWeight: 600 }}>
            Digital Clearance Reference
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <QRCodeDisplay data={qrData} label={ref_} size={150} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['Reference', ref_],
              ['Name',      name],
              ['Passport',  maskPassport(passport)],
              ['Flight',    flight],
              [isArrival ? 'Arrival' : 'Departure', date],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, textTransform: 'uppercase', letterSpacing: '1px' }}>{l}</div>
                <div style={{ fontFamily: MONO, fontSize: 13, color: l === 'Reference' ? C.gold : C.text, fontWeight: l === 'Reference' ? 700 : 400 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '10px 20px', borderTop: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 12, color: C.muted, textAlign: 'center' }}>
          Present this QR at {isArrival ? 'Immigration upon arrival' : 'check-in upon departure'}
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginTop: 2 }}>
            Samoa {isArrival ? 'Airports' : 'Customs'} Authority · dpi.gov.ws
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a
          href={mailto}
          aria-label="Email declaration to yourself"
          style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 16px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40 }}
        >
          ✉ Email to self
        </a>
        <div style={{ background: `${C.dim}20`, border: `1px solid ${C.border}`, borderRadius: 6, color: C.dim, fontFamily: SANS, fontSize: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, minHeight: 40 }}>
          Apple Wallet — Phase 3
        </div>
        <button
          onClick={onReset}
          aria-label="Submit another declaration"
          style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 16px', minHeight: 40 }}
        >
          ← New declaration
        </button>
      </div>
    </div>
  )
}
