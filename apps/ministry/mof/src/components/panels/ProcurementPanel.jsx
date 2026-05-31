import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { KPICard } from '../shared/KPICard.jsx'
import { SectionHeader } from '../shared/SectionHeader.jsx'
import { StatusBadge } from '../shared/StatusBadge.jsx'
import { DataTable } from '../shared/DataTable.jsx'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CONTRACTS = [
  { ocid:'OC-WS-001', desc:'Road rehabilitation Phase 2',    ministry:'MOF/MPWT', value:12.4,  stage:'Award',          step:'✓ STEP', chain:'✓ On-chain', status:'ACTIVE'  },
  { ocid:'OC-WS-002', desc:'Health centre construction',     ministry:'MOH',      value:8.9,   stage:'Implementation', step:'✓ STEP', chain:'✓ On-chain', status:'ACTIVE'  },
  { ocid:'OC-WS-003', desc:'IT system upgrade MCIT',         ministry:'MCIT',     value:3.2,   stage:'Tender',         step:'✓ STEP', chain:'◑ Phase 2',  status:'ACTIVE'  },
  { ocid:'OC-WS-004', desc:'Fisheries vessel procurement',   ministry:'MFAT',     value:18.7,  stage:'Planning',       step:'✓ STEP', chain:'◑ Phase 2',  status:'ACTIVE'  },
  { ocid:'OC-WS-005', desc:'School furniture supply',        ministry:'MESC',     value:1.8,   stage:'Award',          step:'✗ OVERDUE', chain:'◑ Phase 2', status:'MONITOR' },
  { ocid:'OC-WS-006', desc:'Airport terminal expansion',     ministry:'CAAS',     value:24.3,  stage:'Tender',         step:'✓ STEP', chain:'✓ On-chain', status:'ACTIVE'  },
  { ocid:'OC-WS-007', desc:'Water system rehabilitation',    ministry:'MNR',      value:6.7,   stage:'Award',          step:'✓ STEP', chain:'◑ Phase 2',  status:'ACTIVE'  },
  { ocid:'OC-WS-008', desc:'Customs IT modernisation',       ministry:'MFAT',     value:4.1,   stage:'Contract',       step:'✓ STEP', chain:'✓ On-chain', status:'ACTIVE'  },
  { ocid:'OC-WS-009', desc:'Solar power rural villages',     ministry:'METI',     value:9.8,   stage:'Implementation', step:'✓ STEP', chain:'✓ On-chain', status:'ACTIVE'  },
  { ocid:'OC-WS-010', desc:'Medical equipment — TTM',        ministry:'MOH',      value:5.2,   stage:'Award',          step:'✗ OVERDUE', chain:'◑ Phase 2', status:'MONITOR' },
  { ocid:'OC-WS-011', desc:'NDIDS infrastructure',           ministry:'MCIT',     value:11.4,  stage:'Tender',         step:'✓ STEP', chain:'✓ On-chain', status:'ACTIVE'  },
]

const STAGES = [
  { stage: 'Planning',       count: 2,  value: 'WST 36.0M'  },
  { stage: 'Tender',         count: 4,  value: 'WST 29.2M'  },
  { stage: 'Award',          count: 6,  value: 'WST 31.5M'  },
  { stage: 'Contract',       count: 2,  value: 'WST 7.3M'   },
  { stage: 'Implementation', count: 3,  value: 'WST 52.4M'  },
]

const STEP_PROJECTS = [
  { project: 'SFSRDP',   stepId: 'P-167876', plan: 'Approved', updated: 'May 2026', overdue: 0, status: 'COMPLIANT' },
  { project: 'ADB-PTI',  stepId: 'P-178923', plan: 'Approved', updated: 'Apr 2026', overdue: 2, status: 'MONITOR'   },
  { project: 'EU-IMPACT', stepId: 'P-192340', plan: 'Pending', updated: 'Mar 2026', overdue: 1, status: 'MONITOR'   },
]

function statusVariant(s) {
  if (s === 'ACTIVE')   return 'COMPLIANT'
  if (s === 'MONITOR')  return 'MONITOR'
  return 'PENDING'
}

function chainColor(c) {
  if (c.startsWith('✓')) return COLORS.fiscal
  return COLORS.blocked
}

function stepColor(s) {
  if (s.startsWith('✓')) return COLORS.fiscal
  if (s.startsWith('✗')) return COLORS.critical
  return COLORS.textMuted
}

const HEADERS = [
  { key: 'ocid',     label: 'OCID',        mono: true },
  { key: 'desc',     label: 'Description' },
  { key: 'ministry', label: 'Ministry',    mono: true },
  { key: 'valueFmt', label: 'Value (WST M)', align: 'right', mono: true },
  { key: 'stage',    label: 'Stage',        mono: true },
  { key: 'stepBadge',label: 'STEP',         sortable: false },
  { key: 'chainBadge',label: 'On-Chain',    sortable: false },
  { key: 'statusBadge',label: 'Status',     sortable: false },
]

export function ProcurementPanel({ lang }) {
  const rows = CONTRACTS.map(c => ({
    ...c,
    valueFmt:    c.value.toFixed(1),
    stepBadge:   <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, color: stepColor(c.step), whiteSpace: 'nowrap' }}>{c.step}</span>,
    chainBadge:  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 600, color: chainColor(c.chain) }}>{c.chain}</span>,
    statusBadge: <StatusBadge variant={statusVariant(c.status)} label={c.status} />,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <KPICard label="Active Contracts"  value="23"   sub="WST 156.4M total value"        color={COLORS.govBlue}  icon="◆" />
        <KPICard label="OCDS Published"    value="18"   sub="78.3% OCDS compliance rate"    color={COLORS.fiscal}   icon="✓" />
        <KPICard label="On-Chain Hashed"   value="14"   sub="Immutable procurement records" color={COLORS.fiscal}   icon="#" />
        <KPICard label="STEP Overdue"      value="3"    sub="World Bank review pending"     color={COLORS.critical} icon="⚠" />
      </div>

      {/* Procurement table */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader
          title="Active Procurement Register"
          subtitle="OCDS 1.1.5 · World Bank STEP · Click row for OCDS release detail"
        />
        <DataTable
          headers={HEADERS}
          rows={rows}
          expandedRender={row => (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.govBlue, fontWeight: 700, marginBottom: 8, letterSpacing: '1px' }}>
                  OCDS RELEASE DATA
                </div>
                {[
                  { k: 'OCID',          v: row.ocid  },
                  { k: 'Tender notice', v: 'Published' },
                  { k: 'Award date',    v: 'May 2026' },
                  { k: 'Supplier',      v: 'Awarded — Phase 2 disclosure' },
                  { k: 'Currency',      v: 'WST'      },
                ].map(item => (
                  <div key={item.k} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, minWidth: 110 }}>{item.k}:</span>
                    <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.text }}>{item.v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.fiscal, fontWeight: 700, marginBottom: 8, letterSpacing: '1px' }}>
                  ON-CHAIN RECORD
                </div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, lineHeight: 1.7 }}>
                  {row.chain.startsWith('✓')
                    ? `Hash: 0x${Math.random().toString(16).slice(2,8)}...${Math.random().toString(16).slice(2,6)}\nBlock: Polygon Amoy\nStatus: FINAL — tamper-evident`
                    : 'On-chain anchoring scheduled for Phase 2 activation.'}
                </div>
              </div>
            </div>
          )}
        />
      </div>

      {/* Stage pipeline */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="Procurement Pipeline — OCDS Stages" subtitle="Open Contracting Data Standard 1.1.5 lifecycle" />
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
          {STAGES.map((s, i) => {
            const shade = `rgba(26,58,107,${0.18 + i * 0.15})`
            return (
              <React.Fragment key={s.stage}>
                <div style={{
                  flex:           1,
                  background:     shade,
                  padding:        '14px 12px',
                  textAlign:      'center',
                  borderRadius:   i === 0 ? '6px 0 0 6px' : i === STAGES.length - 1 ? '0 6px 6px 0' : 0,
                  borderRight:    i < STAGES.length - 1 ? 'none' : undefined,
                }}>
                  <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: '#ffffff', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 6 }}>
                    {s.stage.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                    {s.count}
                  </div>
                  <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>
                    {s.value}
                  </div>
                </div>
                {i < STAGES.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', color: COLORS.govBlue, fontSize: 18, flexShrink: 0, zIndex: 1 }}>›</div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* STEP compliance */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="World Bank STEP Compliance" subtitle="Systematic Tracking of Exchanges in Procurement · Active IPF projects" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Project','STEP ID','Procurement Plan','Last Update','Overdue Items','Status'].map(h => (
                  <th key={h} style={{ padding: '9px 12px', background: COLORS.surface2, color: COLORS.govBlue, fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', borderBottom: `2px solid ${COLORS.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STEP_PROJECTS.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : COLORS.surface }}>
                  <td style={{ padding:'10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, fontWeight: 600, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{r.project}</td>
                  <td style={{ padding:'10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{r.stepId}</td>
                  <td style={{ padding:'10px 12px', fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{r.plan}</td>
                  <td style={{ padding:'10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{r.updated}</td>
                  <td style={{ padding:'10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, fontWeight: 700, color: r.overdue > 0 ? COLORS.critical : COLORS.fiscal, borderBottom: `1px solid ${COLORS.border}`, textAlign: 'center' }}>{r.overdue}</td>
                  <td style={{ padding:'10px 12px', borderBottom: `1px solid ${COLORS.border}` }}><StatusBadge variant={r.status === 'COMPLIANT' ? 'COMPLIANT' : 'MONITOR'} label={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blockchain transparency note */}
      <div style={{ background: COLORS.fiscalBg, border: `1px solid ${COLORS.fiscalBorder}`, borderLeft: `4px solid ${COLORS.fiscal}`, borderRadius: 8, padding: '18px 22px' }}>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, color: COLORS.fiscal, marginBottom: 12, letterSpacing: '1px' }}>
          OCDS ON-CHAIN ANCHORING
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.65, marginBottom: 10 }}>
          Every contract award generates an OCDS release hashed and recorded on the InteroperabilityHub.
          Procurement records are tamper-evident and permanently verifiable.
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, color: COLORS.govBlue, marginBottom: 6, letterSpacing: '1px' }}>
          OPEN CONTRACTING DATA STANDARD 1.1.5
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.65, marginBottom: 10 }}>
          Samoa is implementing OCDS as the first Pacific SIDS to publish procurement data in globally
          interoperable format. Phase 2: automated OCDS feed from procurement system.
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim }}>
          InteroperabilityHub: 0xB4D3D4Ac59f0976Ee6b5A7d118df955c8E075bfd ·
          MOF MinistryNode: 0xEcd8Af2929FaDC86aA5Bb85E05C95695df39F0Cf
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, textAlign: 'center', lineHeight: 1.9, padding: '8px 0 4px', borderTop: `1px solid ${COLORS.border}` }}>
        OCDS 1.1.5 · World Bank STEP · UNCITRAL Model Law ·
        Open Contracting Partnership · Phase 1 Research Environment
      </div>
    </div>
  )
}
