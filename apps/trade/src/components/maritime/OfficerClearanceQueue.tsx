import React, { useState } from 'react'
// @ts-ignore
import { FeatureGate } from '@samoa-dpi/shared-ui'
import { C, MONO, SANS, DEMO_VESSELS, DEMO_OFFICER_CREDENTIALS, CBS_GOVERNANCE_ITEMS } from '../../constants'
import { ClearanceChip } from '../shared/ClearanceChip'
import { OfficerCredentialInput } from '../shared/OfficerCredentialInput'
import { AsycudaStubPopup } from '../shared/AsycudaStubPopup'
import { CBSGovernanceModal } from '../shared/CBSGovernanceModal'
import type { OfficerSubRole } from '../../types'

const FATF_ITEM     = CBS_GOVERNANCE_ITEMS.find(i => i.id === 'FATF-1')!
const MULTISIG_ITEM = CBS_GOVERNANCE_ITEMS.find(i => i.id === 'AC-2-multisig')!

interface QueueRow {
  vessel:   string
  imo:      string
  eta:      string
  formRef:  string
  status:   'PENDING' | 'APPROVED' | 'FLAGGED' | 'AWAITING_DOCS'
}

const QUEUE_ROWS: QueueRow[] = [
  { vessel: 'MV Pacific Star',   imo: '9234567', eta: '17/05 14:00', formRef: 'NOA-2026-0042', status: 'PENDING' },
  { vessel: 'MV Ofu Cargo',      imo: '8812345', eta: '18/05 09:00', formRef: 'NOA-2026-0043', status: 'APPROVED' },
  { vessel: 'MV Savaii Explorer', imo: '7654321', eta: '19/05 06:30', formRef: 'NOA-2026-0044', status: 'FLAGGED' },
]

interface Props { officerSubRole: OfficerSubRole }

export function OfficerClearanceQueue({ officerSubRole }: Props) {
  const [selected, setSelected]     = useState<QueueRow | null>(null)
  const [credHash, setCredHash]      = useState(DEMO_OFFICER_CREDENTIALS[officerSubRole]?.credHash ?? '')
  const [actionDone, setActionDone]  = useState<string | null>(null)
  const [showGovFatf, setShowGovFatf] = useState(false)
  const [showGovMulti, setShowGovMulti] = useState(false)

  const cred = DEMO_OFFICER_CREDENTIALS[officerSubRole]

  const subRoleLabels: Record<OfficerSubRole, string> = {
    customs:    'Customs & Revenue Authority',
    immigration:'Immigration',
    maf:        'MAF / Biosecurity',
    portHealth: 'Port Health',
    portAuth:   'Samoa Port Authority',
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Officer identity */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.gold, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Clearance Queue
            </div>
            <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, color: C.text }}>
              {subRoleLabels[officerSubRole]}
            </div>
            {cred && (
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>{cred.name} · {cred.credHash}</div>
            )}
          </div>
          {officerSubRole === 'customs' && (
            <AsycudaStubPopup label="Connect to ASYCUDA World" triggerLabel="Import Customs Declaration" />
          )}
        </div>

        {/* FATF panel stub */}
        {(officerSubRole === 'customs' || officerSubRole === 'maf') && (
          <FeatureGate flag="FATF">
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12 }}>
              AML / SAR Reporting Panel (FATF R.15)
            </div>
          </FeatureGate>
        )}
        {(officerSubRole === 'customs' || officerSubRole === 'maf') && (
          <button
            onClick={() => setShowGovFatf(true)}
            style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', fontFamily: MONO, fontSize: 10, textAlign: 'left', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 6 }}
            aria-label="AML/SAR reporting — pending CBS policy approval. View details."
          >
            <span aria-hidden="true">⊘</span>
            <span>AML/SAR reporting — pending CBS policy approval</span>
          </button>
        )}

        {/* Queue table */}
        <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table role="table" style={{ width: '100%', borderCollapse: 'collapse', fontFamily: MONO, fontSize: 12 }}>
              <caption style={{ fontFamily: SANS, fontSize: 12, color: C.muted, textAlign: 'left', padding: '10px 16px', borderBottom: `1px solid ${C.border}` }}>
                Pending clearance submissions — {subRoleLabels[officerSubRole]}
              </caption>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Vessel','IMO','ETA','Form Ref','Status','Action'].map(h => (
                    <th key={h} scope="col" style={{ color: C.muted, fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '10px 16px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {QUEUE_ROWS.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : `${C.surface}40` }}>
                    <td style={{ padding: '10px 16px', color: C.text, whiteSpace: 'nowrap' }}>{row.vessel}</td>
                    <td style={{ padding: '10px 16px', color: C.muted }}>{row.imo}</td>
                    <td style={{ padding: '10px 16px', color: C.muted, whiteSpace: 'nowrap' }}>{row.eta}</td>
                    <td style={{ padding: '10px 16px', color: C.gold }}>{row.formRef}</td>
                    <td style={{ padding: '10px 16px' }}><ClearanceChip status={row.status} size="sm" /></td>
                    <td style={{ padding: '10px 16px' }}>
                      {row.status !== 'APPROVED' && (
                        <button
                          onClick={() => { setSelected(row); setActionDone(null) }}
                          aria-label={`Review ${row.vessel}`}
                          style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 4, color: C.info, cursor: 'pointer', fontFamily: MONO, fontSize: 10, padding: '4px 10px', minHeight: 28 }}
                        >
                          Review →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review slide-in panel */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Review: ${selected.vessel}`}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'flex-end', zIndex: 500 }}
        >
          <div style={{ background: C.surface, borderLeft: `1px solid ${C.border}`, width: '100%', maxWidth: 440, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, color: C.text }}>Review Submission</div>
              <button onClick={() => setSelected(null)} aria-label="Close review panel" style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 4, color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 11, padding: '4px 10px', minHeight: 30 }}>
                Close
              </button>
            </div>

            {/* Vessel summary */}
            {[
              ['Vessel',   selected.vessel],
              ['IMO',      selected.imo],
              ['ETA',      selected.eta],
              ['Form Ref', selected.formRef],
              ['Status',   selected.status],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>{l}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.text }}>{v}</span>
              </div>
            ))}

            {/* Vessel data from DEMO_VESSELS */}
            {(() => {
              const vessel = DEMO_VESSELS.find(v => v.imoNumber === selected.imo)
              if (!vessel) return null
              return (
                <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: C.gold, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>Vessel Details</div>
                  {[
                    ['Type',       vessel.vesselType],
                    ['GT',         `${vessel.grossTonnage.toLocaleString()} GT`],
                    ['Flag',       vessel.flagState],
                    ['Crew',       String(vessel.totalCrew)],
                    ['DG Cargo',   vessel.hasDangerousGoods ? `⚠ YES — Class ${vessel.dangerousGoodsClass}` : 'None'],
                    ['Dues',       `WST ${vessel.duesOwed}`],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>{l}</span>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: l === 'DG Cargo' && vessel.hasDangerousGoods ? C.amber : C.text }}>{v}</span>
                    </div>
                  ))}
                </div>
              )
            })()}

            <OfficerCredentialInput id="officer-cred-review" value={credHash} onChange={setCredHash} />

            {/* Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label htmlFor="review-notes" style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>Notes (required for rejection)</label>
              <textarea id="review-notes" rows={3} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: SANS, fontSize: 13, padding: '8px 12px', resize: 'vertical', outline: 'none' }} />
            </div>

            {actionDone ? (
              <div style={{ background: `${C.green}10`, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: 12, color: C.green, fontFamily: MONO, fontSize: 12 }}>
                ✓ {actionDone} recorded (demo mode)
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setActionDone('APPROVED')} style={{ background: `${C.green}15`, border: `1px solid ${C.greenBdr}`, borderRadius: 6, color: C.green, cursor: 'pointer', fontFamily: SANS, fontSize: 13, fontWeight: 600, padding: '10px 14px', flex: 1, minHeight: 40 }}>
                  ✓ Approve
                </button>
                <button onClick={() => setActionDone('FLAGGED')} style={{ background: `${C.amber}15`, border: `1px solid ${C.amberBdr}`, borderRadius: 6, color: C.amber, cursor: 'pointer', fontFamily: SANS, fontSize: 13, fontWeight: 600, padding: '10px 14px', flex: 1, minHeight: 40 }}>
                  ⚠ Flag
                </button>
                <button onClick={() => setActionDone('REJECTED')} style={{ background: `${C.critical}15`, border: `1px solid ${C.critBdr}`, borderRadius: 6, color: C.critical, cursor: 'pointer', fontFamily: SANS, fontSize: 13, fontWeight: 600, padding: '10px 14px', flex: 1, minHeight: 40 }}>
                  ✗ Reject
                </button>
              </div>
            )}

            {/* Multisig quorum note */}
            <button onClick={() => setShowGovMulti(true)} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', fontFamily: MONO, fontSize: 10, textAlign: 'left', padding: '4px 0', display: 'flex', gap: 6 }}>
              <span aria-hidden="true">⊘</span>
              <span>Approval quorum (multi-sig) — pending CBS policy approval</span>
            </button>
          </div>
        </div>
      )}

      {showGovFatf  && <CBSGovernanceModal item={FATF_ITEM}     onClose={() => setShowGovFatf(false)} />}
      {showGovMulti && <CBSGovernanceModal item={MULTISIG_ITEM} onClose={() => setShowGovMulti(false)} />}
    </>
  )
}
