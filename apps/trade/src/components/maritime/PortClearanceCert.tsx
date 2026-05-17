import React, { useState } from 'react'
import { C, MONO, SANS, DEMO_VESSELS } from '../../constants'
import { QRCodeDisplay } from '../shared/QRCodeDisplay'
import { FormStep } from '../shared/FormStep'

const V       = DEMO_VESSELS[0]
const CERT_NO = 'PCX-2026-000042'
const TX_HASH = '0x7f4a3b8c9d21e04f5a6b7c8d9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f3c19'

interface Props { lang: string; payRef: string; onBack: () => void }

const CLEARANCES = [
  { label: 'Customs & Revenue Authority', at: '14/05/2026 11:45 WST' },
  { label: 'Immigration',                 at: '14/05/2026 12:10 WST' },
  { label: 'MAF / Biosecurity',           at: '14/05/2026 12:30 WST' },
  { label: 'Port Health',                 at: '14/05/2026 13:00 WST' },
  { label: 'Samoa Port Authority',        at: '14/05/2026 13:15 WST' },
]

export function PortClearanceCert({ lang, payRef, onBack }: Props) {
  const [copied, setCopied] = useState(false)

  const qrData = `https://verify.dpi.gov.ws/omw/${CERT_NO}`

  const copyHash = () => {
    navigator.clipboard.writeText(TX_HASH).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
      <FormStep step={7} total={7} title={lang === 'SM' ? 'Tusi Faatagaga o le Uafu' : 'Port Clearance Certificate'}>

        {/* Certificate */}
        <div style={{
          background:   C.surface2,
          border:       `2px solid ${C.gold}40`,
          borderRadius: 10,
          overflow:     'hidden',
          fontFamily:   SANS,
        }}>
          {/* Header bar */}
          <div style={{ background: C.flagBlue, padding: '20px 24px', textAlign: 'center' }}>
            {/* Samoa coat of arms placeholder */}
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${C.gold}60`, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span aria-label="Samoa coat of arms placeholder" style={{ fontSize: 22 }}>★</span>
            </div>
            <div style={{ color: '#fff', fontFamily: MONO, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>
              INDEPENDENT STATE OF SAMOA
            </div>
            <div style={{ color: C.gold, fontFamily: SANS, fontSize: 18, fontWeight: 700 }}>
              PORT CLEARANCE CERTIFICATE
            </div>
          </div>

          {/* Certificate body */}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', marginBottom: 16 }}>
              {[
                ['Certificate No.',  CERT_NO],
                ['Issued',           '17/05/2026 14:23 WST'],
                ['Valid Until',      '19/05/2026 23:59 WST (48hr)'],
                ['',                 ''],
                ['Vessel',           V.vesselName],
                ['IMO Number',       V.imoNumber],
                ['Flag State',       'Marshall Islands'],
                ['Master',           V.masterName],
              ].map(([label, value], i) => label ? (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 13, color: label === 'Certificate No.' ? C.gold : C.text, fontWeight: 600 }}>{value}</span>
                </div>
              ) : <div key={i} />)}
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginBottom: 14 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
                Clearances Obtained
              </div>
              {CLEARANCES.map(cl => (
                <div key={cl.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: SANS, fontSize: 13, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span aria-hidden="true" style={{ color: C.green }}>✅</span> {cl.label}
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>{cl.at}</span>
                </div>
              ))}
            </div>

            <div style={{ background: `${C.green}08`, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: '10px 14px', marginBottom: 14 }}>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.text }}>
                <strong style={{ color: C.gold }}>HARBOUR DUES:</strong> WST {V.duesOwed} · {' '}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 12, color: C.green, fontWeight: 700 }}>PAID (DEMO)</span>
              <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted, marginTop: 4 }}>Receipt Ref: {payRef}</div>
            </div>

            {/* QR + hash */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <QRCodeDisplay data={qrData} label={CERT_NO} size={160} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted, marginBottom: 6 }}>On-chain verification reference:</div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: C.info, wordBreak: 'break-all', marginBottom: 10 }}>{TX_HASH.slice(0, 16)}…{TX_HASH.slice(-6)}</div>
                <button onClick={copyHash} style={{ background: copied ? `${C.green}20` : C.surface2, border: `1px solid ${copied ? C.greenBdr : C.border}`, borderRadius: 4, color: copied ? C.green : C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 10, padding: '5px 12px', minHeight: 30, marginBottom: 8 }}>
                  {copied ? '✓ Copied' : '⎘ Copy hash'}
                </button>
                <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>
                  Verify at: verify.dpi.gov.ws
                </div>
              </div>
            </div>

            {/* Legal footer */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 14, fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
              This certificate is issued under the authority of the Independent State of Samoa Port Authority Act and is recorded on the Samoa Digital Public Infrastructure.
              <br />
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>
                Issued under the authority of the Samoa DPI · Verified: {TX_HASH.slice(0, 10)}…
                {/* Hook for future CulturalWitnessRegistry.sol integration */}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}>
            ← Back
          </button>
          <button onClick={() => window.print()} style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '10px 22px', minHeight: 40 }}>
            ⬇ Download / Print Certificate
          </button>
        </div>
      </FormStep>
    </div>
  )
}
