import React, { useState, useEffect } from 'react'
import { ClassificationBand } from '@samoa-dpi/shared-ui'
import { getSession, parseZoneFromToken, parseRoleFromToken } from './lib/gov-auth'

const MONO = "'IBM Plex Mono', monospace"
const SANS = "'DM Sans', sans-serif"

const C = {
  bg:          '#070910',
  surface:     '#0c1222',
  surface2:    '#111827',
  border:      '#1b2540',
  border2:     'rgba(255,255,255,0.06)',
  text:        '#e8edf8',
  muted:       '#8c9ab8',
  dim:         '#3a4a6a',
  green:       '#00A651',
  greenBg:     'rgba(0, 166, 81, 0.06)',
  greenBorder: 'rgba(0, 166, 81, 0.2)',
  gold:        '#C9A227',
  blue:        '#003087',
  red:         '#CE1126',
  accent:      '#4488ff',
  orange:      '#F97316',
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const BUDGET_MINISTRIES = [
  { name: 'Health',          approp: 142.3, actual: 108.5, pct: 76, status: 'On track' },
  { name: 'Education',       approp: 118.7, actual: 89.2,  pct: 75, status: 'On track' },
  { name: 'Infrastructure',  approp: 95.4,  actual: 68.1,  pct: 71, status: 'Monitor'  },
  { name: 'Finance',         approp: 45.2,  actual: 38.9,  pct: 86, status: 'On track' },
  { name: 'Police & Justice',approp: 38.6,  actual: 29.4,  pct: 76, status: 'On track' },
  { name: 'Agriculture',     approp: 32.1,  actual: 21.8,  pct: 68, status: 'Monitor'  },
  { name: 'Other',           approp: 370.2, actual: 276.0, pct: 75, status: 'On track' },
]

const PEFA_DATA = [
  {
    pillar: 'Budget Reliability',
    indicators: [
      { id: 'PI-1',  name: 'Aggregate expenditure outturn',     score: 'B', status: 'Adequate'          },
      { id: 'PI-2',  name: 'Expenditure composition outturn',   score: 'C', status: 'Needs improvement' },
      { id: 'PI-3',  name: 'Revenue outturn',                   score: 'B', status: 'Adequate'          },
    ],
  },
  {
    pillar: 'Transparency of Public Finances',
    indicators: [
      { id: 'PI-4',  name: 'Budget classification',             score: 'A', status: 'Strong'            },
      { id: 'PI-5',  name: 'Budget documentation',              score: 'B', status: 'Adequate'          },
      { id: 'PI-6',  name: 'Central government operations',     score: 'B', status: 'Adequate'          },
      { id: 'PI-7',  name: 'Transfers to subnational',          score: 'C', status: 'Needs improvement' },
    ],
  },
  {
    pillar: 'Management of Assets and Liabilities',
    indicators: [
      { id: 'PI-10', name: 'Fiscal risk reporting',             score: 'C', status: 'Needs improvement' },
      { id: 'PI-11', name: 'Public investment management',      score: 'B', status: 'Adequate'          },
      { id: 'PI-12', name: 'Public asset management',           score: 'C', status: 'Needs improvement' },
    ],
  },
  {
    pillar: 'Revenue Management',
    indicators: [
      { id: 'PI-19', name: 'Revenue administration',            score: 'B', status: 'Adequate'          },
      { id: 'PI-20', name: 'Accounting for revenue',            score: 'A', status: 'Strong'            },
    ],
  },
]

const DONORS = [
  { donor: 'World Bank',        programme: 'Finance Sector Resilience (SFSRDP)', committed: 21.0, disbursed: 4.2,  pct: 20, rate: 'On schedule', iati: 'Yes'     },
  { donor: 'ADB',               programme: 'Pacific Transport Infrastructure',   committed: 18.5, disbursed: 11.1, pct: 60, rate: 'On schedule', iati: 'Yes'     },
  { donor: 'New Zealand MFAT',  programme: 'Samoa Development Programme',        committed: 12.3, disbursed: 9.8,  pct: 80, rate: 'Ahead',       iati: 'Yes'     },
  { donor: 'Australia DFAT',    programme: 'Pacific Climate Infrastructure',     committed: 8.7,  disbursed: 3.5,  pct: 40, rate: 'Behind',      iati: 'Partial' },
  { donor: 'European Union',    programme: 'Pacific Trade IMPACT',               committed: 6.2,  disbursed: 1.9,  pct: 31, rate: 'On schedule', iati: 'Yes'     },
  { donor: 'Japan JICA',        programme: 'Disaster Risk Reduction',            committed: 5.1,  disbursed: 3.8,  pct: 75, rate: 'On schedule', iati: 'Partial' },
]

const PARIS_INDICATORS = [
  { name: 'Ownership',           desc: 'Government leads development strategy',          status: 'Met'         },
  { name: 'Alignment',           desc: 'Donors align to government systems',             status: 'Partial'     },
  { name: 'Harmonisation',       desc: 'Donors coordinate among themselves',             status: 'Partial'     },
  { name: 'Managing for results',desc: 'Focus on development outcomes',                  status: 'In progress' },
  { name: 'Mutual accountability',desc: 'Joint review of commitments',                   status: 'In progress' },
]

const MILESTONES = [
  { grant: 'SFSRDP-WB', milestone: 'NDIDS vendor procurement',       due: 'Jun 2026', status: 'In progress', pct: 45  },
  { grant: 'SFSRDP-WB', milestone: 'CBS payment systems upgrade',    due: 'Sep 2026', status: 'Pending',     pct: 10  },
  { grant: 'ADB-PTI',   milestone: 'Road rehabilitation Phase 1',    due: 'Mar 2026', status: 'Complete',    pct: 100 },
  { grant: 'ADB-PTI',   milestone: "Bridge construction Savai'i",    due: 'Dec 2026', status: 'In progress', pct: 35  },
  { grant: 'NZ-SDP',    milestone: 'Education quality programme',    due: 'Jun 2026', status: 'In progress', pct: 68  },
  { grant: 'EU-IMPACT', milestone: 'Single Window design',           due: 'Aug 2026', status: 'In progress', pct: 55  },
]

const FIDUCIARY_RISKS = [
  { programme: 'SFSRDP',    fm: 'Moderate', proc: 'Moderate', overall: 'Moderate', review: 'Oct 2024' },
  { programme: 'ADB-PTI',   fm: 'Low',      proc: 'Low',      overall: 'Low',      review: 'Mar 2025' },
  { programme: 'NZ-SDP',    fm: 'Low',      proc: 'Moderate', overall: 'Low',      review: 'Jan 2025' },
  { programme: 'EU-IMPACT', fm: 'Moderate', proc: 'Moderate', overall: 'Moderate', review: 'Nov 2024' },
]

const IATI_PUBLISHERS = [
  { donor: 'World Bank',       publisher: 'Yes', freq: 'Monthly',   quality: 'High', link: 'iati.worldbank.org'          },
  { donor: 'ADB',              publisher: 'Yes', freq: 'Quarterly', quality: 'High', link: 'iati.adb.org'                },
  { donor: 'New Zealand MFAT', publisher: 'Yes', freq: 'Quarterly', quality: 'High', link: 'iati.govt.nz'                },
  { donor: 'Australia DFAT',   publisher: 'Yes', freq: 'Quarterly', quality: 'High', link: 'devtracker.dfat.gov.au'      },
  { donor: 'European Union',   publisher: 'Yes', freq: 'Monthly',   quality: 'High', link: 'ec.europa.eu/europeaid'      },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function AmberNotice({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background:   'rgba(201,162,39,0.08)',
      border:       `1px solid rgba(201,162,39,0.25)`,
      borderLeft:   `3px solid ${C.gold}`,
      borderRadius: 6,
      padding:      '10px 14px',
      fontFamily:   MONO,
      fontSize:     10,
      color:        C.gold,
      lineHeight:   1.65,
      marginBottom: 16,
    }}>
      {children}
    </div>
  )
}

function ProgressBar({ pct, color = C.green }: { pct: number; color?: string }) {
  return (
    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 2, transition: 'width 0.3s' }} />
    </div>
  )
}

function PefaScore({ score }: { score: string }) {
  const map: Record<string, [string, string]> = {
    A: [C.green, 'rgba(0,166,81,0.12)'],
    B: [C.accent, 'rgba(68,136,255,0.12)'],
    C: [C.gold,   'rgba(201,162,39,0.12)'],
    D: [C.red,    'rgba(206,17,38,0.12)'],
  }
  const [color, bg] = map[score] || [C.muted, 'transparent']
  return (
    <span style={{ background: bg, color, border: `1px solid ${color}44`, padding: '2px 9px', borderRadius: 3, fontFamily: MONO, fontSize: 12, fontWeight: 700 }}>
      {score}
    </span>
  )
}

function Chip({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ background: bg, color, border: `1px solid ${color}44`, padding: '1px 8px', borderRadius: 3, fontFamily: MONO, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function statusChip(status: string) {
  const map: Record<string, [string, string]> = {
    'On track':    [C.green,  'rgba(0,166,81,0.1)'],
    'Monitor':     [C.gold,   'rgba(201,162,39,0.1)'],
    'Complete':    [C.green,  'rgba(0,166,81,0.1)'],
    'In progress': [C.accent, 'rgba(68,136,255,0.1)'],
    'Pending':     [C.gold,   'rgba(201,162,39,0.1)'],
    'Behind':      [C.red,    'rgba(206,17,38,0.1)'],
    'At risk':     [C.orange, 'rgba(249,115,22,0.1)'],
    'On schedule': [C.green,  'rgba(0,166,81,0.1)'],
    'Ahead':       [C.accent, 'rgba(68,136,255,0.1)'],
    'Met':         [C.green,  'rgba(0,166,81,0.1)'],
    'Partial':     [C.gold,   'rgba(201,162,39,0.1)'],
  }
  const [color, bg] = map[status] || [C.muted, 'transparent']
  return <Chip label={status} color={color} bg={bg} />
}

function riskChip(level: string) {
  const map: Record<string, [string, string]> = {
    'Low':      [C.green, 'rgba(0,166,81,0.1)'],
    'Moderate': [C.gold,  'rgba(201,162,39,0.1)'],
    'High':     [C.red,   'rgba(206,17,38,0.1)'],
  }
  const [color, bg] = map[level] || [C.muted, 'transparent']
  return <Chip label={level} color={color} bg={bg} />
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{
      padding:       '7px 10px',
      background:    'rgba(255,255,255,0.04)',
      color:         C.muted,
      fontFamily:    MONO,
      fontSize:      9,
      fontWeight:    700,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      textAlign:     'left',
      borderBottom:  `1px solid ${C.border}`,
      whiteSpace:    'nowrap',
    }}>
      {children}
    </th>
  )
}

function Td({ children, mono, right }: { children: React.ReactNode; mono?: boolean; right?: boolean }) {
  return (
    <td style={{
      padding:      '8px 10px',
      borderBottom: `1px solid rgba(255,255,255,0.03)`,
      fontFamily:   mono ? MONO : SANS,
      fontSize:     11,
      color:        C.text,
      verticalAlign:'top',
      textAlign:    right ? 'right' : 'left',
    }}>
      {children}
    </td>
  )
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
        {children}
      </table>
    </div>
  )
}

function PanelCard({ accentColor = C.green, children }: { accentColor?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background:   C.surface,
      border:       `1px solid ${C.border}`,
      borderLeft:   `4px solid ${accentColor}`,
      borderRadius: 10,
      padding:      '24px 28px',
      marginBottom: 20,
    }}>
      {children}
    </div>
  )
}

function PanelTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted }}>
        {subtitle}
      </div>
    </div>
  )
}

function CollapsibleRow({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden', marginTop: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: open ? 'rgba(255,255,255,0.03)' : 'transparent',
          border: 'none', padding: '12px 16px', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{title}</div>
          {subtitle && <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginTop: 2 }}>{subtitle}</div>}
        </div>
        <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim, flexShrink: 0, marginLeft: 12 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── PANEL A — BUDGET EXECUTION ───────────────────────────────────────────────

function BudgetPanel() {
  const metrics = [
    { label: 'Approved Budget',        value: 'WST 842.5M', sub: null,    color: C.text,  pct: null },
    { label: 'Expenditure to date',    value: 'WST 631.9M', sub: '75%',   color: C.green, pct: 75   },
    { label: 'Revenue collected',      value: 'WST 598.2M', sub: '71%',   color: C.accent, pct: 71  },
    { label: 'Fiscal balance',         value: 'WST -33.7M', sub: 'Deficit',color: C.gold,  pct: null },
  ]

  return (
    <PanelCard accentColor={C.green}>
      <PanelTitle
        title="Budget Execution — Fiscal Year 2025/2026"
        subtitle="IMF Fiscal Transparency Code · PEFA PI-1 to PI-3 · Ministry of Finance"
      />
      <AmberNotice>
        Live budget data: Phase 2. Figures below are illustrative for research purposes.
        Phase 2: direct connection to MOF financial systems.
      </AmberNotice>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 20 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: m.color, lineHeight: 1 }}>{m.value}</div>
            {m.sub && <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginTop: 4 }}>{m.sub} of approved budget</div>}
            {m.pct !== null && <ProgressBar pct={m.pct} color={m.color} />}
          </div>
        ))}
      </div>

      {/* Ministry allocation table — collapsible */}
      <CollapsibleRow title="Expenditure by Ministry" subtitle="Appropriation vs. actual spend">
        <TableWrap>
          <thead>
            <tr>
              <Th>Ministry</Th>
              <Th>Appropriation (WST M)</Th>
              <Th>Actual (WST M)</Th>
              <Th>% Executed</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {BUDGET_MINISTRIES.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <Td>{row.name}</Td>
                <Td mono right>{row.approp.toFixed(1)}</Td>
                <Td mono right>{row.actual.toFixed(1)}</Td>
                <Td mono right>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                    <span>{row.pct}%</span>
                    <div style={{ width: 48, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${row.pct}%`, background: row.pct >= 75 ? C.green : C.gold, borderRadius: 2 }} />
                    </div>
                  </div>
                </Td>
                <Td>{statusChip(row.status)}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 10 }}>
          Simulated · Phase 1 research environment
        </div>
      </CollapsibleRow>
    </PanelCard>
  )
}

// ─── PANEL B — PEFA SCORECARD ─────────────────────────────────────────────────

function PefaPanel() {
  return (
    <PanelCard accentColor={C.accent}>
      <PanelTitle
        title="PEFA Framework — Public Financial Management"
        subtitle="Public Expenditure and Financial Accountability Framework 2016 · IMF / World Bank / European Commission"
      />
      <AmberNotice>
        Scores below are illustrative. Phase 2: live PEFA assessment integration.
      </AmberNotice>

      {PEFA_DATA.map(pillar => (
        <div key={pillar.pillar} style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
            {pillar.pillar}
          </div>
          <TableWrap>
            <thead>
              <tr>
                <Th>Indicator</Th>
                <Th>Score</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {pillar.indicators.map((ind, i) => (
                <tr key={ind.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                  <Td>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginRight: 8 }}>{ind.id}</span>
                    <span>{ind.name}</span>
                  </Td>
                  <Td><PefaScore score={ind.score} /></Td>
                  <Td>{statusChip(ind.status)}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </div>
      ))}

      <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 14px', fontFamily: MONO, fontSize: 10, color: C.muted, lineHeight: 1.7 }}>
        PEFA assessments are conducted every 3–4 years. Last assessment: 2022. Next: 2025/2026.
        Source: pefa.org
      </div>
    </PanelCard>
  )
}

// ─── PANEL C — DONOR FUND MATRIX ──────────────────────────────────────────────

function DonorPanel() {
  const totalCommitted  = DONORS.reduce((s, d) => s + d.committed, 0)
  const totalDisbursed  = DONORS.reduce((s, d) => s + d.disbursed, 0)
  const avgPct          = Math.round(totalDisbursed / totalCommitted * 100)

  return (
    <PanelCard accentColor={C.gold}>
      <PanelTitle
        title="Donor Fund Allocation Matrix"
        subtitle="OECD DAC Aid Effectiveness Principles · Paris Declaration 2005 · Busan Partnership 2011"
      />
      <AmberNotice>
        Live donor data: Phase 2. Figures are illustrative for research purposes.
      </AmberNotice>

      <TableWrap>
        <thead>
          <tr>
            <Th>Donor</Th>
            <Th>Programme</Th>
            <Th>Committed (USD M)</Th>
            <Th>Disbursed (USD M)</Th>
            <Th>%</Th>
            <Th>Rate</Th>
            <Th>IATI</Th>
          </tr>
        </thead>
        <tbody>
          {DONORS.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <Td mono>{row.donor}</Td>
              <Td>{row.programme}</Td>
              <Td mono right>{row.committed.toFixed(1)}</Td>
              <Td mono right>{row.disbursed.toFixed(1)}</Td>
              <Td mono right>{row.pct}%</Td>
              <Td>{statusChip(row.rate)}</Td>
              <Td>
                <Chip
                  label={row.iati}
                  color={row.iati === 'Yes' ? C.green : C.gold}
                  bg={row.iati === 'Yes' ? 'rgba(0,166,81,0.1)' : 'rgba(201,162,39,0.1)'}
                />
              </Td>
            </tr>
          ))}
          {/* Totals row */}
          <tr style={{ background: 'rgba(255,255,255,0.04)', borderTop: `1px solid ${C.border}` }}>
            <Td mono><strong style={{ color: C.text }}>TOTAL</strong></Td>
            <Td><span style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>6 programmes</span></Td>
            <Td mono right><strong style={{ color: C.text }}>{totalCommitted.toFixed(1)}</strong></Td>
            <Td mono right><strong style={{ color: C.text }}>{totalDisbursed.toFixed(1)}</strong></Td>
            <Td mono right><strong style={{ color: C.text }}>{avgPct}% avg</strong></Td>
            <Td /><Td />
          </tr>
        </tbody>
      </TableWrap>

      {/* Paris Declaration indicators */}
      <CollapsibleRow
        title="Paris Declaration Indicators"
        subtitle="OECD DAC 2005 · Samoa PFM alignment status"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          {PARIS_INDICATORS.map(ind => (
            <div key={ind.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '8px 0', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, color: C.text }}>{ind.name}</div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, marginTop: 2 }}>{ind.desc}</div>
              </div>
              <div style={{ flexShrink: 0 }}>{statusChip(ind.status)}</div>
            </div>
          ))}
        </div>
      </CollapsibleRow>
    </PanelCard>
  )
}

// ─── PANEL D — GRANT MILESTONE TRACKER ───────────────────────────────────────

function MilestonePanel() {
  return (
    <PanelCard accentColor={C.accent}>
      <PanelTitle
        title="Active Grant Milestone Status"
        subtitle="World Bank OP 14.10 · ADB Financial Management · IATI Standard v2.03"
      />
      <AmberNotice>
        Live milestone data: Phase 2. Data below is illustrative for research purposes.
      </AmberNotice>

      <TableWrap>
        <thead>
          <tr>
            <Th>Grant</Th>
            <Th>Milestone</Th>
            <Th>Due</Th>
            <Th>Status</Th>
            <Th>% Complete</Th>
          </tr>
        </thead>
        <tbody>
          {MILESTONES.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <Td mono>
                <span style={{ color: C.gold }}>{row.grant}</span>
              </Td>
              <Td>{row.milestone}</Td>
              <Td mono>{row.due}</Td>
              <Td>{statusChip(row.status)}</Td>
              <Td mono right>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                  <span>{row.pct}%</span>
                  <div style={{ width: 48, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${row.pct}%`, background: row.status === 'Complete' ? C.green : row.status === 'Pending' ? C.gold : C.accent, borderRadius: 2 }} />
                  </div>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      {/* Fiduciary risk matrix */}
      <CollapsibleRow
        title="Fiduciary Risk Assessment"
        subtitle="World Bank / ADB Financial Management Standards"
      >
        <TableWrap>
          <thead>
            <tr>
              <Th>Programme</Th>
              <Th>FM Risk</Th>
              <Th>Procurement Risk</Th>
              <Th>Overall</Th>
              <Th>Last Review</Th>
            </tr>
          </thead>
          <tbody>
            {FIDUCIARY_RISKS.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <Td mono>{row.programme}</Td>
                <Td>{riskChip(row.fm)}</Td>
                <Td>{riskChip(row.proc)}</Td>
                <Td>{riskChip(row.overall)}</Td>
                <Td mono>{row.review}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </CollapsibleRow>
    </PanelCard>
  )
}

// ─── PANEL E — IATI COMPLIANCE ────────────────────────────────────────────────

function IatiPanel() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.green}`, borderRadius: 10, marginBottom: 20, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: 'transparent', border: 'none', padding: '20px 28px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.8px' }}>IATI Compliance Status</div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginTop: 3 }}>International Aid Transparency Initiative Standard v2.03 · Open Data for Aid Effectiveness</div>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginLeft: 16 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '0 28px 24px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ marginBottom: 16, marginTop: 16 }}>
            <AmberNotice>
              IATI data: Phase 2. Status below is illustrative.
            </AmberNotice>
          </div>

          <TableWrap>
            <thead>
              <tr>
                <Th>Donor</Th>
                <Th>IATI Publisher</Th>
                <Th>Last Published</Th>
                <Th>Data Quality</Th>
                <Th>Link</Th>
              </tr>
            </thead>
            <tbody>
              {IATI_PUBLISHERS.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                  <Td mono>{row.donor}</Td>
                  <Td>
                    <Chip label={row.publisher} color={C.green} bg="rgba(0,166,81,0.1)" />
                  </Td>
                  <Td>{row.freq}</Td>
                  <Td>
                    <Chip label={row.quality} color={C.green} bg="rgba(0,166,81,0.1)" />
                  </Td>
                  <Td mono>
                    <span style={{ color: C.muted }}>{row.link}</span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 14px', fontFamily: MONO, fontSize: 10, color: C.muted, lineHeight: 1.7, marginTop: 14 }}>
            Samoa MOF is establishing IATI publishing capability under SFSRDP Component 3.
            Target: Q4 2026.
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PANEL F — IMF & INTERNATIONAL REFERENCE ──────────────────────────────────

function ImfPanel() {
  const [open, setOpen] = useState(false)
  const cards = [
    {
      title: 'IMF Fiscal Transparency Code (FTC)',
      body:  'The IMF FTC provides a framework for assessing fiscal transparency across four pillars: fiscal reporting, fiscal forecasting and budgeting, fiscal risk analysis and management, and resource revenue management. Samoa\'s last FTC assessment aligned with basic practices across most pillars.',
      link:  'imf.org/fiscal-transparency',
      color: C.accent,
    },
    {
      title: 'OECD DAC Blended Finance Principles',
      body:  'The OECD DAC Blended Finance Principles guide the use of concessional public finance to mobilise private investment for development in developing countries — directly relevant to WST-DPI Digital Tala and DBS distribution architecture.',
      link:  'oecd.org/dac/blended-finance',
      color: C.gold,
    },
    {
      title: 'Pacific Financial Technical Assistance Centre (PFTAC)',
      body:  'PFTAC provides technical assistance to Pacific island countries on PFM reform, revenue administration, financial sector supervision, and macroeconomic statistics. Samoa is a PFTAC member country.',
      link:  'pftac.org',
      color: C.green,
    },
  ]

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.gold}`, borderRadius: 10, marginBottom: 20, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: 'transparent', border: 'none', padding: '20px 28px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.8px' }}>International Fiscal Standards</div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginTop: 3 }}>Reference frameworks for Samoa PFM</div>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginLeft: 16 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '0 28px 24px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 20 }}>
            {cards.map(card => (
              <div key={card.title} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderTop: `3px solid ${card.color}`, borderRadius: 8, padding: '16px' }}>
                <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: card.color, marginBottom: 8, lineHeight: 1.4 }}>{card.title}</div>
                <p style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.65, margin: '0 0 10px' }}>{card.body}</p>
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>{card.link}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SECTION CARD (unchanged) ─────────────────────────────────────────────────

function SectionCard({
  icon, title, description, chipLabel, chipClass,
}: {
  icon: string
  title: string
  description: string
  chipLabel: string
  chipClass: string
}) {
  return (
    <div style={{
      background:    C.surface,
      border:        `1px solid ${C.border}`,
      borderLeft:    `4px solid ${C.green}`,
      borderRadius:  10,
      padding:       '24px 28px',
      display:       'flex',
      flexDirection: 'column',
      gap:           12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
          <h2 style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
            {title}
          </h2>
        </div>
        <span className={`status-chip ${chipClass}`}>{chipLabel}</span>
      </div>
      <p style={{ fontFamily: SANS, fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>
        {description}
      </p>
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [gatewaySession, setGatewaySession] = useState<{ zone: 1|2|3; role: string } | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get('token')

    if (urlToken) {
      const zone = parseZoneFromToken(urlToken) as 1|2|3
      const role = parseRoleFromToken(urlToken)
      sessionStorage.setItem('gov_session', JSON.stringify({
        sessionToken: urlToken,
        zone,
        role,
        storedAt: Date.now(),
        portalUrl: '',
      }))
      window.history.replaceState({}, '', window.location.pathname)
    }

    if (import.meta.env.DEV) return

    const session = getSession()
    if (!session) {
      window.location.href = 'https://landing-alpha-seven-82.vercel.app/government'
      return
    }

    setGatewaySession({ zone: session.zone, role: session.role })
  }, [])

  return (
    <>
      {gatewaySession && (
        <ClassificationBand zone={gatewaySession.zone} role={gatewaySession.role} />
      )}
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: SANS }}>

        {/* Header */}
        <header style={{
          background:   C.surface,
          borderBottom: `1px solid ${C.border}`,
          padding:      '0 32px',
          display:      'flex',
          alignItems:   'center',
          height:       64,
          gap:          16,
          position:     'sticky',
          top:          0,
          zIndex:       50,
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 20, height: 4, background: C.red,  borderRadius: 2 }} />
            <div style={{ width: 20, height: 4, background: C.blue, borderRadius: 2 }} />
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '2px', color: C.green, marginBottom: 2 }}>
              MOF · SAMOA DPI
            </div>
            <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.text }}>
              Ministry of Finance — Fiscal Oversight Portal
            </div>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 9, color: C.dim, letterSpacing: '1px' }}>
            PHASE 1 STUB · PENDING MOF ENGAGEMENT
          </div>
        </header>

        <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px' }}>

          {/* Hero */}
          <div style={{ marginBottom: 40 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.greenBg, border: `1px solid ${C.greenBorder}`,
              borderRadius: 6, padding: '4px 14px',
              fontFamily: MONO, fontSize: 10, color: C.green, letterSpacing: '1px', marginBottom: 20,
            }}>
              <span>◎</span> SAMOA DIGITAL PUBLIC INFRASTRUCTURE
            </div>
            <h1 style={{ fontFamily: SANS, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, color: C.text, margin: '0 0 12px', lineHeight: 1.2 }}>
              Ministry of Finance
            </h1>
            <p style={{ fontFamily: SANS, fontSize: 16, color: C.muted, margin: 0, lineHeight: 1.6, maxWidth: 580 }}>
              Fiscal Oversight Portal · Samoa Digital Public Infrastructure
            </p>
          </div>

          {/* Constitutional mandate notice */}
          <div style={{
            background: C.greenBg, border: `1px solid ${C.greenBorder}`,
            borderRadius: 8, padding: '16px 20px', marginBottom: 32,
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 18, color: C.green, flexShrink: 0, marginTop: 2 }}>⚖</span>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.green, letterSpacing: '1px', marginBottom: 6 }}>
                CONSTITUTIONAL MANDATE
              </div>
              <p style={{ fontFamily: SANS, fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.65 }}>
                The Ministry of Finance holds constitutional authority over all government fiscal
                operations: grant approvals, budget execution, disbursement tracking, and donor
                fund management. These functions are separate from the monetary policy authority
                vested in the Central Bank of Samoa.
              </p>
            </div>
          </div>

          {/* ── REFERENCE DATA PANELS ────────────────────────────────────── */}
          <BudgetPanel />
          <PefaPanel />
          <DonorPanel />
          <MilestonePanel />
          <IatiPanel />
          <ImfPanel />

          {/* ── SECTION SEPARATOR ────────────────────────────────────────── */}
          <div style={{ margin: '36px 0 24px', borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.green, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>
              MOF OPERATIONAL MODULES
            </div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>
              Phase 2: live ministry system integration pending MOF engagement
            </div>
          </div>

          {/* ── EXISTING MODULE CARDS ────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SectionCard
              icon="📊"
              title="Government Disbursement Oversight"
              description="AIDisbursementTracker — government grant lifecycle monitoring. Tranche approvals, milestone verification, and audit trail. Full integration with the on-chain disbursement tracker contract."
              chipLabel="Pending MOF engagement"
              chipClass="pending"
            />
            <SectionCard
              icon="✅"
              title="Grant Approval Workflow"
              description="Cross-ministry grant creation, MOF approval authority, and CBS settlement coordination. Milestone-based tranche release with cryptographic verification."
              chipLabel="Pending MOF engagement"
              chipClass="pending"
            />
            <SectionCard
              icon="🌐"
              title="Donor Fund Management"
              description="International donor programme oversight, reporting, and on-chain milestone verification for donor compliance. Supports UNICEF, World Bank, ADB, and bilateral donor requirements."
              chipLabel="Pending MOF engagement"
              chipClass="pending"
            />
            <SectionCard
              icon="📋"
              title="Budget Execution Tracking"
              description="Government expenditure tracking and World Bank STEP procurement integration (Phase 2). Provides real-time visibility into budget utilisation across all ministries."
              chipLabel="Phase 2 — post-pilot"
              chipClass="phase2"
            />
          </div>

          {/* Research note */}
          <div style={{
            marginTop: 40, padding: '16px 20px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.gold}`, borderRadius: 6,
          }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px', marginBottom: 8 }}>
              RESEARCH CONTEXT
            </div>
            <p style={{ fontFamily: MONO, fontSize: 11, color: C.dim, margin: 0, lineHeight: 1.7 }}>
              NUS/ISOC Foundation Research Programme 2026 · USD $500,000 over 24 months ·
              PI: Dr. Edna Temese (National University of Samoa) ·
              Technical Partner: Synergy Blockchain Pacific
            </p>
          </div>
        </main>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer style={{
          borderTop:  `1px solid ${C.border}`,
          padding:    '24px 32px',
          background: C.surface,
          fontFamily: MONO,
          fontSize:   10,
          color:      C.dim,
          textAlign:  'center',
          lineHeight: 1.9,
        }}>
          <div style={{ color: C.muted, fontWeight: 600, marginBottom: 4 }}>
            Ministry of Finance — Samoa Digital Public Infrastructure
          </div>
          <div>
            Aligned with: IMF Fiscal Transparency Code · PEFA Framework 2016 · OECD DAC Paris Declaration ·
            World Bank OP 14.10 · IATI Standard v2.03 · ADB Financial Management Assessment Framework
          </div>
          <div style={{ marginTop: 6 }}>
            Phase 1 Research Environment · NUS / ISOC Research Programme 2026 · Not an operational system
          </div>
          <div style={{ marginTop: 4 }}>
            Enquiries: synergyblockchaintf@gmail.com
          </div>
        </footer>
      </div>
    </>
  )
}
