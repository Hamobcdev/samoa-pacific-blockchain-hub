import React, { useState } from 'react'
// @ts-ignore
import { FeatureGate } from '@samoa-dpi/shared-ui'
import { C, MONO, SANS, DEMO_VESSELS, CBS_GOVERNANCE_ITEMS, t } from '../../constants'
import { useHarbourDues } from '../../hooks/useHarbourDues'
import { useOMWSubmission, generateISO20022Ref } from '../../hooks/useOMWSubmission'
import { FormStep } from '../shared/FormStep'
import { ISO20022Ref } from '../shared/ISO20022Ref'
import { ClearanceChip } from '../shared/ClearanceChip'
import { CBSGovernanceModal } from '../shared/CBSGovernanceModal'

const V       = DEMO_VESSELS[0]
const DAYS    = 3
const TIMELOCK_ITEM = CBS_GOVERNANCE_ITEMS.find(i => i.id === 'AC-3-timelock')!

interface Props { lang: string; onNext: (ref: string) => void; onBack: () => void }

export function HarbourDuesPayment({ lang, onNext, onBack }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<'wst' | 'swift' | 'invoice'>('wst')
  const [showGov, setShowGov]             = useState(false)
  const [submitted, setSubmitted]         = useState(false)
  const { submit, submitting }            = useOMWSubmission()
  const { formatted, rateDisplay }        = useHarbourDues(V.grossTonnage, V.vesselType, DAYS)
  const payRef                            = generateISO20022Ref(V.imoNumber)

  const handleSubmit = async () => {
    await submit(V.imoNumber)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ padding: '24px 0' }}>
        <div style={{ background: `${C.purple}10`, border: `1px solid ${C.purpleBdr}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
          <div style={{ color: C.purple, fontFamily: MONO, fontSize: 12, fontWeight: 700 }}>⊘ HARBOUR DUES — CBS-HELD</div>
          <div style={{ color: C.muted, fontFamily: SANS, fontSize: 13, marginTop: 8 }}>
            Amount calculated: {formatted}. Payment is pending CBS timelock policy approval before on-chain settlement can occur.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'back')}
          </button>
          <button onClick={() => onNext(payRef)} style={{ background: C.flagBlue, border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: '10px 22px', minHeight: 40 }}>
            {t(lang as Parameters<typeof t>[0], 'next')} View Clearance Status
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
        <FormStep step={6} total={7} title={t(lang as Parameters<typeof t>[0], 'harbourDues')}>

          {/* Calculation table */}
          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 11, color: C.gold, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Harbour Dues Calculation
            </div>
            <div style={{ padding: '4px 0' }}>
              {[
                ['Vessel',            V.vesselName],
                ['IMO Number',        V.imoNumber],
                ['Vessel Type',       V.vesselType],
                ['Gross Tonnage',     `${V.grossTonnage.toLocaleString()} GT`],
                ['Estimated Stay',    `${DAYS} days`],
                ['Rate',              rateDisplay],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>{label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 13, color: C.text }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: `${C.gold}08` }}>
                <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.gold }}>TOTAL HARBOUR DUES</span>
                <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.gold }}>{formatted}</span>
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>ISO 20022 Payment Reference</div>
              <ISO20022Ref reference={payRef} />
            </div>
          </div>

          {/* Payment method */}
          <fieldset style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, margin: 0 }}>
            <legend style={{ fontFamily: MONO, fontSize: 11, color: C.gold, padding: '0 8px', letterSpacing: '1px' }}>PAYMENT METHOD</legend>
            {[
              { id: 'wst',     label: 'WST-DPI (Digital Tālā)',  tag: 'PRIMARY',   tagColor: C.gold },
              { id: 'swift',   label: 'Bank Transfer (SWIFT)',   tag: 'SECONDARY', tagColor: C.muted },
              { id: 'invoice', label: 'Manual Invoice',          tag: 'FALLBACK',  tagColor: C.dim },
            ].map(m => (
              <label key={m.id} htmlFor={`pm-${m.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${C.border}`, cursor: 'pointer' }}>
                <input id={`pm-${m.id}`} type="radio" name="paymethod" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id as typeof paymentMethod)} style={{ accentColor: C.flagBlue }} />
                <span style={{ fontFamily: SANS, fontSize: 13, color: paymentMethod === m.id ? C.text : C.muted, flex: 1 }}>{m.label}</span>
                <span style={{ fontFamily: MONO, fontSize: 9, color: m.tagColor, border: `1px solid ${m.tagColor}40`, padding: '1px 6px', borderRadius: 3 }}>{m.tag}</span>
              </label>
            ))}
          </fieldset>

          {/* Status chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>Payment Status:</span>
            <ClearanceChip
              status="CBS_HELD"
              tooltip="On-chain settlement is pending CBS timelock policy confirmation. Click below to learn more."
            />
          </div>

          {/* Confirm button — gated behind VITE_FLAG_TIMELOCK */}
          <FeatureGate flag="TIMELOCK">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ background: C.green, border: 'none', borderRadius: 6, color: C.bg, cursor: 'pointer', fontFamily: SANS, fontSize: 14, fontWeight: 700, padding: '12px 24px', minHeight: 44 }}
            >
              {submitting ? 'Processing…' : `Confirm Payment — ${formatted}`}
            </button>
          </FeatureGate>

          {/* Gate is closed → show CBS explain button */}
          <button
            onClick={() => setShowGov(true)}
            aria-label="View CBS governance item: Timelock on Fund Release"
            style={{ background: `${C.purple}10`, border: `1px solid ${C.purpleBdr}`, borderRadius: 6, color: C.purple, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span aria-hidden="true">⊘</span>
            {t(lang as Parameters<typeof t>[0], 'pendingCBSApproval')} — Payment settlement awaiting CBS timelock decision
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}>
              {t(lang as Parameters<typeof t>[0], 'back')}
            </button>
            <button onClick={handleSubmit} disabled={submitting} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}>
              {submitting ? 'Processing…' : 'Record dues (demo) →'}
            </button>
          </div>
        </FormStep>
      </div>

      {showGov && <CBSGovernanceModal item={TIMELOCK_ITEM} onClose={() => setShowGov(false)} />}
    </>
  )
}
