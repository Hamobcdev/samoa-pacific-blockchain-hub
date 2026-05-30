import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { KPICard } from '../shared/KPICard.jsx'
import { SectionHeader } from '../shared/SectionHeader.jsx'
import { StatusBadge } from '../shared/StatusBadge.jsx'
import { DataTable } from '../shared/DataTable.jsx'

const DONORS = [
  { donor: 'World Bank',        programme: 'Finance Sector Resilience (SFSRDP)', committed: 21.0, disbursed: 4.2,  pct: 20, rate: 'On schedule', iati: 'Yes',     onChain: true  },
  { donor: 'ADB',               programme: 'Pacific Transport Infrastructure',   committed: 18.5, disbursed: 11.1, pct: 60, rate: 'On schedule', iati: 'Yes',     onChain: true  },
  { donor: 'New Zealand MFAT',  programme: 'Samoa Development Programme',        committed: 12.3, disbursed: 9.8,  pct: 80, rate: 'Ahead',       iati: 'Yes',     onChain: true  },
  { donor: 'Australia DFAT',    programme: 'Pacific Climate Infrastructure',     committed: 8.7,  disbursed: 3.5,  pct: 40, rate: 'Behind',      iati: 'Partial', onChain: false },
  { donor: 'European Union',    programme: 'Pacific Trade IMPACT',               committed: 6.2,  disbursed: 1.9,  pct: 31, rate: 'On schedule', iati: 'Yes',     onChain: true  },
  { donor: 'Japan JICA',        programme: 'Disaster Risk Reduction',            committed: 5.1,  disbursed: 3.8,  pct: 75, rate: 'On schedule', iati: 'Partial', onChain: false },
]

const MILESTONES = [
  { grant: 'SFSRDP-WB', donor: 'World Bank', total: 'WST 21M', milestone: 'NDIDS vendor procurement',    due: 'Jun 2026', status: 'In progress', pct: 45,  hash: '0x3fa8...c291' },
  { grant: 'SFSRDP-WB', donor: 'World Bank', total: 'WST 21M', milestone: 'CBS payment systems upgrade', due: 'Sep 2026', status: 'Pending',     pct: 10,  hash: null },
  { grant: 'ADB-PTI',   donor: 'ADB',        total: 'WST 18M', milestone: 'Road rehabilitation Phase 1', due: 'Mar 2026', status: 'Complete',    pct: 100, hash: '0x7bc2...a447' },
  { grant: 'ADB-PTI',   donor: 'ADB',        total: 'WST 18M', milestone: "Bridge construction Savai'i", due: 'Dec 2026', status: 'In progress', pct: 35,  hash: null },
  { grant: 'NZ-SDP',    donor: 'NZ MFAT',    total: 'WST 12M', milestone: 'Education quality programme', due: 'Jun 2026', status: 'In progress', pct: 68,  hash: null },
  { grant: 'EU-IMPACT', donor: 'EU',         total: 'WST 6M',  milestone: 'Single Window design',        due: 'Aug 2026', status: 'In progress', pct: 55,  hash: null },
]

const IATI_PUBLISHERS = [
  { donor: 'World Bank',       publisher: 'Yes', freq: 'Monthly',   quality: 'High', link: 'iati.worldbank.org' },
  { donor: 'ADB',              publisher: 'Yes', freq: 'Quarterly', quality: 'High', link: 'iati.adb.org' },
  { donor: 'New Zealand MFAT', publisher: 'Yes', freq: 'Quarterly', quality: 'High', link: 'iati.govt.nz' },
  { donor: 'Australia DFAT',   publisher: 'Yes', freq: 'Quarterly', quality: 'High', link: 'devtracker.dfat.gov.au' },
  { donor: 'European Union',   publisher: 'Yes', freq: 'Monthly',   quality: 'High', link: 'ec.europa.eu/europeaid' },
]

const PARIS_INDICATORS = [
  { name: 'Ownership',            desc: 'Government leads development strategy',     status: 'Met'         },
  { name: 'Alignment',            desc: 'Donors align to government systems',        status: 'Partial'     },
  { name: 'Harmonisation',        desc: 'Donors coordinate among themselves',        status: 'Partial'     },
  { name: 'Managing for results', desc: 'Focus on development outcomes',             status: 'In progress' },
  { name: 'Mutual accountability',desc: 'Joint review of commitments',              status: 'In progress' },
]

function rateColor(rate) {
  if (rate === 'Ahead')       return COLORS.info
  if (rate === 'On schedule') return COLORS.operational
  if (rate === 'Behind')      return COLORS.critical
  return COLORS.warning
}

function msColor(status) {
  if (status === 'Complete')    return COLORS.operational
  if (status === 'In progress') return COLORS.info
  return COLORS.warning
}

function parisColor(status) {
  if (status === 'Met')         return COLORS.operational
  if (status === 'Partial')     return COLORS.warning
  return COLORS.info
}

export function AidDonorsPanel({ lang }) {
  const totalCommitted = DONORS.reduce((s, d) => s + d.committed, 0)
  const totalDisbursed = DONORS.reduce((s, d) => s + d.disbursed, 0)

  const donorRows = DONORS.map(d => ({
    ...d,
    committedFmt: d.committed.toFixed(1),
    disbursedFmt: d.disbursed.toFixed(1),
    pctFmt: `${d.pct}%`,
    rateBadge: (
      <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: rateColor(d.rate) }}>{d.rate}</span>
    ),
    iatiChip: (
      <span style={{
        background: d.iati === 'Yes' ? COLORS.operationalBg : COLORS.warningBg,
        border: `1px solid ${d.iati === 'Yes' ? COLORS.operationalBorder : COLORS.warningBorder}`,
        borderRadius: 3, color: d.iati === 'Yes' ? COLORS.operational : COLORS.warning,
        fontFamily: TYPOGRAPHY.mono, fontSize: 11, padding: '1px 6px',
      }}>{d.iati}</span>
    ),
    onChainChip: (
      <span style={{
        fontFamily: TYPOGRAPHY.mono,
        fontSize:   11,
        color:      d.onChain ? COLORS.operational : COLORS.blocked,
      }}>
        {d.onChain ? '✓ LIVE' : '◑ Ph2'}
      </span>
    ),
  }))

  const donorHeaders = [
    { key: 'donor',        label: 'Donor',                 mono: true },
    { key: 'programme',    label: 'Programme' },
    { key: 'committedFmt', label: 'Committed (USD M)',  align: 'right', mono: true },
    { key: 'disbursedFmt', label: 'Disbursed (USD M)',  align: 'right', mono: true },
    { key: 'pctFmt',       label: '%',                 align: 'right', mono: true },
    { key: 'rateBadge',    label: 'Rate',              sortable: false },
    { key: 'iatiChip',     label: 'IATI',              sortable: false },
    { key: 'onChainChip',  label: 'On-chain',          sortable: false },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <KPICard label="Active Projects"     value="14"                    sub="Multi-donor programmes"        color={COLORS.text}    icon="◎" />
        <KPICard label="Total Committed"     value={`USD ${totalCommitted.toFixed(1)}M`} sub="All active programmes" color={COLORS.fiscal} icon="◼" />
        <KPICard label="Disbursed YTD"       value={`USD ${totalDisbursed.toFixed(1)}M`} sub={`${Math.round(totalDisbursed/totalCommitted*100)}% of committed`} color={COLORS.fiscal} icon="▲" />
        <KPICard label="On-chain Verified"   value="6 grants"              sub="AIDisbursementTracker"         color={COLORS.info}    icon="◈" />
      </div>

      {/* Donor portfolio table */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px' }}>
        <SectionHeader
          title="Donor Portfolio Matrix"
          subtitle="OECD DAC · IATI v2.03 · AIDisbursementTracker: 0xbD7E00ECeE7A8d45D4720B54BbfD3295CF63455C"
        />
        <DataTable headers={donorHeaders} rows={donorRows} />
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 24,
          marginTop: 10, padding: '8px 10px',
          background: 'rgba(255,255,255,0.03)', borderRadius: 4,
          fontFamily: TYPOGRAPHY.mono, fontSize: 11,
        }}>
          <span style={{ color: COLORS.textMuted }}>TOTAL COMMITTED: <strong style={{ color: COLORS.text }}>USD {totalCommitted.toFixed(1)}M</strong></span>
          <span style={{ color: COLORS.textMuted }}>TOTAL DISBURSED: <strong style={{ color: COLORS.text }}>USD {totalDisbursed.toFixed(1)}M</strong></span>
        </div>
      </div>

      {/* Grant milestone tracker */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px' }}>
        <SectionHeader
          title="Grant Milestone Tracker"
          subtitle="World Bank OP 14.10 · ADB Financial Management · IATI Standard v2.03"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MILESTONES.map((ms, i) => (
            <div key={i} style={{
              background:   COLORS.surface2,
              border:       `1px solid ${COLORS.border}`,
              borderLeft:   `3px solid ${msColor(ms.status)}`,
              borderRadius: 6,
              padding:      '12px 16px',
              display:      'flex',
              gap:          16,
              alignItems:   'flex-start',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.gold, fontWeight: 700 }}>{ms.grant}</span>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted }}>{ms.donor}</span>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim }}>{ms.total}</span>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim }}>Due: {ms.due}</span>
                </div>
                <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.text, marginBottom: 6 }}>{ms.milestone}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', maxWidth: 160 }}>
                    <div style={{ height: '100%', width: `${ms.pct}%`, background: msColor(ms.status), borderRadius: 2 }} />
                  </div>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted }}>{ms.pct}%</span>
                  {ms.hash && (
                    <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim }}>
                      #{ms.hash}
                    </span>
                  )}
                </div>
              </div>
              <span style={{
                fontFamily:    TYPOGRAPHY.mono,
                fontSize:      11,
                fontWeight:    700,
                color:         msColor(ms.status),
                background:    `${msColor(ms.status)}18`,
                border:        `1px solid ${msColor(ms.status)}44`,
                borderRadius:  3,
                padding:       '2px 8px',
                whiteSpace:    'nowrap',
              }}>
                {ms.status}
              </span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, marginTop: 10 }}>
          AIDisbursementTracker: 0xbD7E00ECeE7A8d45D4720B54BbfD3295CF63455C · Phase 2: automated IATI feed
        </div>
      </div>

      {/* IATI compliance */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px' }}>
        <SectionHeader
          title="IATI Compliance Status"
          subtitle="International Aid Transparency Initiative Standard v2.03 · Open Data for Aid Effectiveness"
        />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr>
                {['Publisher', 'IATI Publisher', 'Frequency', 'Data Quality', 'Link'].map(h => (
                  <th key={h} style={{ padding: '7px 10px', background: 'rgba(255,255,255,0.03)', color: COLORS.textMuted, fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', borderBottom: `1px solid ${COLORS.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {IATI_PUBLISHERS.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                  <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.text, borderBottom: `1px solid rgba(255,255,255,0.03)` }}>{row.donor}</td>
                  <td style={{ padding: '8px 10px', borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                    <StatusBadge variant="COMPLIANT" label={row.publisher} />
                  </td>
                  <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.textMuted, borderBottom: `1px solid rgba(255,255,255,0.03)` }}>{row.freq}</td>
                  <td style={{ padding: '8px 10px', borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                    <StatusBadge variant="COMPLIANT" label={row.quality} />
                  </td>
                  <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, borderBottom: `1px solid rgba(255,255,255,0.03)` }}>{row.link}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{
          background:   COLORS.surface2,
          border:       `1px solid ${COLORS.border}`,
          borderRadius: 4,
          fontFamily:   TYPOGRAPHY.mono,
          fontSize:     11,
          color:        COLORS.textMuted,
          lineHeight:   1.7,
          marginTop:    14,
          padding:      '10px 14px',
        }}>
          Samoa MOF is establishing IATI publishing capability under SFSRDP Component 3.
          Target: Q4 2026. Phase 2: automated IATI feed from AIDisbursementTracker events.
        </div>
      </div>

      {/* Paris Declaration */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px' }}>
        <SectionHeader
          title="Paris Declaration Indicators"
          subtitle="OECD DAC 2005 · Samoa PFM alignment status"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PARIS_INDICATORS.map(ind => (
            <div key={ind.name} style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'flex-start',
              gap:            12,
              padding:        '10px 0',
              borderBottom:   `1px solid rgba(255,255,255,0.04)`,
            }}>
              <div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{ind.name}</div>
                <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.textMuted }}>{ind.desc}</div>
              </div>
              <span style={{
                background:  `${parisColor(ind.status)}18`,
                border:      `1px solid ${parisColor(ind.status)}44`,
                borderRadius: 3,
                color:       parisColor(ind.status),
                fontFamily:  TYPOGRAPHY.mono,
                fontSize:    11,
                fontWeight:  700,
                padding:     '2px 8px',
                whiteSpace:  'nowrap',
              }}>
                {ind.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
