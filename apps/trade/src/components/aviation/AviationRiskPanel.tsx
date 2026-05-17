import React, { useState } from 'react'
// @ts-ignore
import { FeatureGate } from '@samoa-dpi/shared-ui'
import { C, MONO, SANS, DEMO_FLIGHTS, DEMO_PASSENGERS, CBS_GOVERNANCE_ITEMS } from '../../constants'
import { RiskFlag } from '../shared/RiskFlag'
import { ClearanceChip } from '../shared/ClearanceChip'
import { CBSGovernanceModal } from '../shared/CBSGovernanceModal'
import type { DemoPassenger } from '../../types'

// Risk scoring — illustrative for demo.
// Production risk engine is a CBS/Immigration decision — FATF-gated.
function deriveRisk(p: DemoPassenger): string {
  if (p.riskLevel) return p.riskLevel
  const amber = (p.carryingCurrency && Number(p.currencyAmount ?? 0) > 10000) || p.carryingAnimals || p.previousIllness
  const red   = p.carryingCurrency && p.carryingGoods
  if (red)   return 'RED'
  if (amber) return 'AMBER'
  return 'GREEN'
}

const FATF_ITEM = CBS_GOVERNANCE_ITEMS.find(i => i.id === 'FATF-1')!

export function AviationRiskPanel() {
  const [selectedFlight, setSelectedFlight] = useState(DEMO_FLIGHTS[0])
  const [selectedPax, setSelectedPax]       = useState<DemoPassenger | null>(null)
  const [actionDone, setActionDone]         = useState<string | null>(null)
  const [showGovFatf, setShowGovFatf]       = useState(false)

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
          Passenger Risk Assessment Board
        </div>

        {/* Flight selector */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DEMO_FLIGHTS.map(f => (
            <button
              key={f.flightNumber}
              onClick={() => setSelectedFlight(f)}
              aria-pressed={selectedFlight.flightNumber === f.flightNumber}
              style={{
                background:   selectedFlight.flightNumber === f.flightNumber ? C.flagBlue : C.surface2,
                border:       `1px solid ${selectedFlight.flightNumber === f.flightNumber ? C.flagBlue : C.border}`,
                borderRadius: 6,
                color:        C.text,
                cursor:       'pointer',
                fontFamily:   MONO,
                fontSize:     12,
                padding:      '8px 16px',
                minHeight:    36,
              }}
            >
              {f.flightNumber} · {f.origin} · {f.arrivalTime}
            </button>
          ))}
        </div>

        {/* Risk summary */}
        <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 14, color: C.text, fontWeight: 600 }}>
            Flight {selectedFlight.flightNumber} · {selectedFlight.arrivalDate} {selectedFlight.arrivalTime} WST · {selectedFlight.declared} pax declared
          </div>
          <div style={{ display: 'flex', gap: 0 }}>
            {[
              { level: 'GREEN' as const, count: selectedFlight.greenCount, label: 'Standard processing' },
              { level: 'AMBER' as const, count: selectedFlight.amberCount, label: 'Secondary check required' },
              { level: 'RED'   as const, count: selectedFlight.redCount,   label: 'Hold for officer' },
            ].map(r => (
              <div key={r.level} style={{ flex: 1, padding: '16px', borderRight: `1px solid ${C.border}` }}>
                <RiskFlag level={r.level} count={r.count} size="lg" />
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, marginTop: 8 }}>
                  {r.count} {r.count === 1 ? 'passenger' : 'passengers'} — {r.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Passenger list */}
        <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Declared Passengers — {selectedFlight.flightNumber} (demo: showing 3 of {selectedFlight.declared})
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table role="table" style={{ width: '100%', borderCollapse: 'collapse', fontFamily: MONO, fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Risk','Ref','Name','Nationality','Purpose','Declarations','Action'].map(h => (
                    <th key={h} scope="col" style={{ color: C.muted, fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '8px 12px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEMO_PASSENGERS.filter(p => p.flightNumber === selectedFlight.flightNumber).map((p, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : `${C.surface}40` }}>
                    <td style={{ padding: '10px 12px' }}>
                      <RiskFlag level={p.riskLevel} size="sm" />
                    </td>
                    <td style={{ padding: '10px 12px', color: C.gold }}>{p.ref}</td>
                    <td style={{ padding: '10px 12px', color: C.text, whiteSpace: 'nowrap' }}>{p.familyName}, {p.givenNames.split(' ')[0]}</td>
                    <td style={{ padding: '10px 12px', color: C.muted }}>{p.nationality}</td>
                    <td style={{ padding: '10px 12px', color: C.muted }}>{p.purposeOfVisit}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.carryingCurrency && <ClearanceChip status="FLAGGED" size="sm" />}
                        {p.carryingAnimals  && <span style={{ fontFamily: MONO, fontSize: 9, color: C.amber }}>🌿 Animal</span>}
                        {p.previousIllness  && <span style={{ fontFamily: MONO, fontSize: 9, color: C.amber }}>🏥 Illness</span>}
                        {!p.carryingCurrency && !p.carryingAnimals && !p.previousIllness && (
                          <span style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>None</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <button
                        onClick={() => { setSelectedPax(p); setActionDone(null) }}
                        aria-label={`View declaration for ${p.familyName}`}
                        style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 4, color: C.info, cursor: 'pointer', fontFamily: MONO, fontSize: 10, padding: '4px 10px', minHeight: 28 }}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={7} style={{ color: C.dim, fontFamily: SANS, fontSize: 12, padding: '10px 12px', fontStyle: 'italic' }}>
                    + {selectedFlight.declared - DEMO_PASSENGERS.filter(p => p.flightNumber === selectedFlight.flightNumber).length} additional passengers (demo abbreviated)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FATF stub */}
        <FeatureGate flag="FATF">
          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12 }}>
            FATF Suspicious Activity Panel
          </div>
        </FeatureGate>
        <button
          onClick={() => setShowGovFatf(true)}
          style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', fontFamily: MONO, fontSize: 10, textAlign: 'left', padding: '4px 0', display: 'flex', gap: 6 }}
          aria-label="AML/SAR reporting pending CBS policy approval"
        >
          <span aria-hidden="true">⊘</span>
          <span>AML/SAR reporting — pending CBS policy approval</span>
        </button>
      </div>

      {/* Passenger detail slide-in */}
      {selectedPax && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Passenger declaration: ${selectedPax.familyName}`}
          onClick={e => { if (e.target === e.currentTarget) setSelectedPax(null) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'flex-end', zIndex: 500 }}
        >
          <div style={{ background: C.surface, borderLeft: `1px solid ${C.border}`, width: '100%', maxWidth: 400, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: C.text }}>Passenger Declaration</div>
              <button onClick={() => setSelectedPax(null)} aria-label="Close" style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 4, color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 11, padding: '4px 10px', minHeight: 30 }}>
                Close
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <RiskFlag level={selectedPax.riskLevel} size="md" />
              <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>{selectedPax.ref}</span>
            </div>

            {[
              ['Name',        `${selectedPax.familyName}, ${selectedPax.givenNames}`],
              ['Nationality', selectedPax.nationality],
              ['Passport',    selectedPax.passportNumber],
              ['Flight',      selectedPax.flightNumber],
              ['Purpose',     selectedPax.purposeOfVisit],
              ['Stay',        `${selectedPax.stayDuration} nights`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>{l}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.text }}>{v}</span>
              </div>
            ))}

            {selectedPax.carryingCurrency && (
              <div style={{ background: `${C.amber}10`, border: `1px solid ${C.amberBdr}`, borderRadius: 6, padding: '10px 12px' }}>
                <div style={{ color: C.amber, fontFamily: MONO, fontSize: 11, fontWeight: 700 }}>⚠ Currency declared</div>
                <div style={{ color: C.muted, fontFamily: SANS, fontSize: 13 }}>{selectedPax.currencyAmount} {selectedPax.currencyType}</div>
              </div>
            )}
            {selectedPax.carryingGoods && (
              <div style={{ background: `${C.amber}10`, border: `1px solid ${C.amberBdr}`, borderRadius: 6, padding: '10px 12px' }}>
                <div style={{ color: C.amber, fontFamily: MONO, fontSize: 11, fontWeight: 700 }}>⚠ Goods declared</div>
                <div style={{ color: C.muted, fontFamily: SANS, fontSize: 13 }}>{selectedPax.goodsDescription} — est. WST {selectedPax.goodsValue}</div>
              </div>
            )}
            {selectedPax.riskOverrideNote && (
              <div style={{ color: C.dim, fontFamily: SANS, fontSize: 12, fontStyle: 'italic' }}>{selectedPax.riskOverrideNote}</div>
            )}

            {actionDone ? (
              <div style={{ background: `${C.green}10`, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: 12, color: C.green, fontFamily: MONO, fontSize: 12 }}>
                ✓ {actionDone} recorded
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setActionDone('APPROVED')} style={{ background: `${C.green}15`, border: `1px solid ${C.greenBdr}`, borderRadius: 6, color: C.green, cursor: 'pointer', fontFamily: SANS, fontSize: 13, fontWeight: 600, padding: '10px 12px', flex: 1, minHeight: 40 }}>
                  ✓ Clear
                </button>
                <button onClick={() => setActionDone('SECONDARY')} style={{ background: `${C.amber}15`, border: `1px solid ${C.amberBdr}`, borderRadius: 6, color: C.amber, cursor: 'pointer', fontFamily: SANS, fontSize: 13, fontWeight: 600, padding: '10px 12px', flex: 1, minHeight: 40 }}>
                  ⚠ Secondary
                </button>
                <button onClick={() => setActionDone('HOLD')} style={{ background: `${C.critical}15`, border: `1px solid ${C.critBdr}`, borderRadius: 6, color: C.critical, cursor: 'pointer', fontFamily: SANS, fontSize: 13, fontWeight: 600, padding: '10px 12px', flex: 1, minHeight: 40 }}>
                  ⛔ Hold
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showGovFatf && <CBSGovernanceModal item={FATF_ITEM} onClose={() => setShowGovFatf(false)} />}
    </>
  )
}
