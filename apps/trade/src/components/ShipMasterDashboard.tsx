import React, { useState } from 'react'
import { C, MONO, SANS, DEMO_VESSELS } from '../constants'
import { VesselClearanceBoard } from './clearance/VesselClearanceBoard'
import { useClearanceStatus } from '../hooks/useClearanceStatus'
import { generateCertRef, generateISO20022Ref } from '../hooks/useOMWSubmission'
import { PortClearanceCert } from './maritime/PortClearanceCert'
import type { OMWAuthResult } from '../types'

const V        = DEMO_VESSELS[0]  // MV Pacific Star (NOA-2026-0042)
const VESSEL_REF = 'NOA-2026-0042'

// Stable cert and pay refs — generated module-level for determinism in demo
const CERT_REF = generateCertRef()
const PAY_REF  = generateISO20022Ref(V.imoNumber)
const FAKE_TX  = `0x${VESSEL_REF.replace(/\W/g, '')}${'a1b2c3d4e5f60000000000'}`

type MasterTab = 'clearance' | 'certificate' | 'voyage'

interface Props { session: OMWAuthResult }

export function ShipMasterDashboard({ session }: Props) {
  const [tab, setTab] = useState<MasterTab>('clearance')
  const { record }    = useClearanceStatus(VESSEL_REF)

  const AGENCY_CODES = ['customs', 'maf', 'portHealth', 'portAuth'] as const
  const agencies4    = AGENCY_CODES.map(c => record.ministryStatuses.find(ms => ms.code === c))
  const allCleared   = agencies4.every(ms => ms?.status === 'CLEARED')

  const certClearances = agencies4
    .filter(ms => ms?.status === 'CLEARED')
    .map(ms => ({ label: ms!.ministry, at: ms!.clearedAt ?? '—' }))

  const tabs: { id: MasterTab; label: string }[] = [
    { id: 'clearance',   label: 'CLEARANCE STATUS' },
    { id: 'certificate', label: 'PORT CLEARANCE CERT' },
    { id: 'voyage',      label: 'VOYAGE DETAILS' },
  ]

  return (
    <div style={{ fontFamily: SANS, color: C.text }}>

      {/* Role header */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: '#38bdf8', letterSpacing: '2px', marginBottom: 4 }}>
          ZONE 1 — READ ONLY
        </div>
        <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, color: C.text }}>
          {session.label}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: C.gold, marginTop: 2 }}>
          {V.vesselName} · IMO {V.imoNumber} · {V.flagState}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 4 }}>
          Auth: {new Date(session.authedAt).toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })} WST
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background:   tab === t.id ? C.surface2 : 'none',
              border:       'none',
              borderBottom: tab === t.id ? `2px solid ${C.flagBlue}` : '2px solid transparent',
              color:        tab === t.id ? C.text : C.muted,
              cursor:       'pointer',
              fontFamily:   MONO,
              fontSize:     10,
              letterSpacing:'1.5px',
              padding:      '10px 18px',
              transition:   'all 0.15s',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Clearance Status */}
      {tab === 'clearance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <VesselClearanceBoard
            vesselRef={VESSEL_REF}
            vesselName={V.vesselName}
            imoNumber={V.imoNumber}
            eta={V.estimatedArrival}
            flagState={V.flagState}
            masterName={V.masterName}
            showDues
          />
          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 14px', fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
            ℹ Submissions are handled by your Shipping Agent.
            Contact your agent for amendments to submitted forms.
          </div>
        </div>
      )}

      {/* Tab: Port Clearance Certificate */}
      {tab === 'certificate' && (
        <div>
          {allCleared ? (
            <PortClearanceCert
              certRef={CERT_REF}
              txHash={FAKE_TX.padEnd(42, '0')}
              payRef={PAY_REF}
              vesselName={V.vesselName}
              imoNumber={V.imoNumber}
              flagState={V.flagState}
              masterName={V.masterName}
              clearances={certClearances}
              duesAmount={record.duesAmount}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: `${C.amber}10`, border: `1px solid ${C.amberBdr}`, borderRadius: 8, padding: '20px 24px' }}>
                <div style={{ fontFamily: MONO, fontSize: 12, color: C.amber, fontWeight: 700, marginBottom: 8 }}>
                  ⏳ PORT CLEARANCE CERTIFICATE — PENDING
                </div>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                  The Port Clearance Certificate will be available here once all four
                  border agencies have completed their assessments and the
                  Samoa Port Authority has issued final clearance.
                </div>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: '1px', marginBottom: 10 }}>CURRENT CLEARANCE SUMMARY</div>
                <VesselClearanceBoard
                  vesselRef={VESSEL_REF}
                  vesselName={V.vesselName}
                  imoNumber={V.imoNumber}
                  eta={V.estimatedArrival}
                  flagState={V.flagState}
                  masterName={V.masterName}
                  showDues={false}
                  compact
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Voyage Details (read-only) */}
      {tab === 'voyage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px' }}>
              VESSEL DETAILS — READ ONLY
            </div>
            <div>
              {[
                ['Vessel Name',     V.vesselName],
                ['IMO Number',      V.imoNumber],
                ['Flag State',      V.flagState],
                ['Vessel Type',     V.vesselType],
                ['Gross Tonnage',   `${V.grossTonnage.toLocaleString()} GT`],
                ['Length Overall',  `${V.lengthOverall} m`],
                ['Master',          V.masterName],
                ['Shipping Agent',  V.shippingAgentName],
                ['Agent Licence',   V.agentLicenceNumber],
              ].map(([label, value], i) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>{label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: C.text }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px' }}>
              VOYAGE DETAILS — READ ONLY
            </div>
            <div>
              {[
                ['ETA / Berth',        `${V.estimatedArrival} WST · ${V.destinationBerth.replace('_', ' ')}`],
                ['Dangerous Goods',    V.hasDangerousGoods ? `Yes — Class ${V.dangerousGoodsClass}` : 'None declared'],
                ['Total Crew',         String(V.totalCrew)],
                ['Total Passengers',   String(V.totalPassengers)],
                ['Form Reference',     VESSEL_REF],
              ].map(([label, value], i) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>{label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: V.hasDangerousGoods && label === 'Dangerous Goods' ? C.amber : C.text }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, padding: '8px 0', lineHeight: 1.8 }}>
            All voyage details are read-only. Contact your Shipping Agent to request amendments.
            <br />
            Berth assignment is confirmed by Samoa Port Authority — see Clearance Status tab.
          </div>
        </div>
      )}
    </div>
  )
}
