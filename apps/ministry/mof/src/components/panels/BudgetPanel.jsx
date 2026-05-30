import React from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer,
} from 'recharts'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { KPICard } from '../shared/KPICard.jsx'
import { SectionHeader } from '../shared/SectionHeader.jsx'
import { StatusBadge } from '../shared/StatusBadge.jsx'
import { DataTable } from '../shared/DataTable.jsx'

const BUDGET_MINISTRIES = [
  { name: 'Health',           vote: 'Vote 14', approp: 142.3, actual: 108.5, pct: 76, status: 'On track' },
  { name: 'Education',        vote: 'Vote 05', approp: 118.7, actual: 89.2,  pct: 75, status: 'On track' },
  { name: 'Infrastructure',   vote: 'Vote 08', approp: 95.4,  actual: 68.1,  pct: 71, status: 'Monitor'  },
  { name: 'Finance',          vote: 'Vote 06', approp: 45.2,  actual: 38.9,  pct: 86, status: 'On track' },
  { name: 'Police & Justice', vote: 'Vote 11', approp: 38.6,  actual: 29.4,  pct: 76, status: 'On track' },
  { name: 'Agriculture',      vote: 'Vote 02', approp: 32.1,  actual: 21.8,  pct: 68, status: 'Monitor'  },
  { name: 'Other Ministries', vote: 'Various', approp: 370.2, actual: 276.0, pct: 75, status: 'On track' },
]

const COFOG_DATA = [
  { name: 'General services',   val: 98.4  },
  { name: 'Defence',            val: 12.1  },
  { name: 'Public order',       val: 29.4  },
  { name: 'Economic affairs',   val: 145.2 },
  { name: 'Environment',        val: 18.3  },
  { name: 'Housing',            val: 22.7  },
  { name: 'Health',             val: 108.5 },
  { name: 'Recreation',         val: 8.6   },
  { name: 'Education',          val: 89.2  },
  { name: 'Social protection',  val: 66.1  },
]

const MTEF = [
  { y: 'FY25/26', rev: 598, exp: 840, bal: -42 },
  { y: 'FY26/27', rev: 640, exp: 865, bal: -25 },
  { y: 'FY27/28', rev: 685, exp: 890, bal: -5  },
]

function pctColor(pct) {
  if (pct >= 75) return COLORS.operational
  if (pct >= 50) return COLORS.warning
  return COLORS.critical
}

function statusVariant(st) {
  if (st === 'On track') return 'COMPLIANT'
  if (st === 'Monitor')  return 'MONITOR'
  return 'AT-RISK'
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: COLORS.surface2, border: `1px solid ${COLORS.border}`,
      borderRadius: 4, fontFamily: TYPOGRAPHY.mono, fontSize: 11, padding: '8px 12px',
    }}>
      <div style={{ color: COLORS.gold, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || COLORS.text, marginBottom: 2 }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}M
        </div>
      ))}
    </div>
  )
}

const TABLE_HEADERS = [
  { key: 'name',   label: 'Ministry' },
  { key: 'vote',   label: 'Vote', mono: true },
  { key: 'approp', label: 'Appropriation (WST M)', align: 'right', mono: true },
  { key: 'actual', label: 'Expended (WST M)',       align: 'right', mono: true },
  { key: 'pctBar', label: '% Used',                 align: 'right', sortable: false },
  { key: 'badge',  label: 'Status',                 sortable: false },
]

export function BudgetPanel({ lang }) {
  const rows = BUDGET_MINISTRIES.map(r => ({
    ...r,
    approp: r.approp.toFixed(1),
    actual: r.actual.toFixed(1),
    pctBar: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: TYPOGRAPHY.mono, color: pctColor(r.pct) }}>{r.pct}%</span>
        <div style={{ width: 48, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${r.pct}%`, background: pctColor(r.pct), borderRadius: 2 }} />
        </div>
      </div>
    ),
    badge: <StatusBadge variant={statusVariant(r.status)} label={r.status} />,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <KPICard label="Approved Budget"     value="WST 842.5M" sub="FY 2025/26 total"          color={COLORS.text}        icon="◼" />
        <KPICard label="Expenditure to Date" value="WST 631.9M" sub="75% of approved budget"    color={COLORS.fiscal}      icon="▲" />
        <KPICard label="Revenue Collected"   value="WST 598.2M" sub="71% of approved budget"    color={COLORS.fiscal}      icon="◎" />
        <KPICard label="Fiscal Balance"      value="−WST 33.7M" sub="Deficit · PEFA PI-3"       color={COLORS.warning}     icon="◐" />
      </div>

      {/* Ministry vote table */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px' }}>
        <SectionHeader
          title="Ministry Vote-Level Expenditure"
          subtitle="PEFA PI-1, PI-2 · Appropriation vs Actual · Click row for sub-vote"
        />
        <DataTable
          headers={TABLE_HEADERS}
          rows={rows}
          expandedRender={row => (
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, lineHeight: 1.8 }}>
              {row.name} — Sub-vote breakdown: Phase 2 integration pending MOF FMIS connection.
              PEFA PI-2 (Expenditure composition): monitoring active.
            </div>
          )}
        />
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, marginTop: 10 }}>
          Simulated · Phase 1 research environment · PEFA PI-1 to PI-3
        </div>
      </div>

      {/* COFOG breakdown */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px' }}>
        <SectionHeader
          title="COFOG Expenditure Breakdown"
          subtitle="Classification of Functions of Government · IMF GFSM 2014"
        />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            layout="vertical"
            data={COFOG_DATA}
            margin={{ top: 0, right: 20, left: 100, bottom: 0 }}
          >
            <XAxis type="number" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
            <YAxis dataKey="name" type="category" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} width={100} />
            <ReTooltip content={<ChartTip />} />
            <Bar dataKey="val" name="Expenditure (WST M)" fill={COLORS.fiscal} radius={[0,2,2,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* MTEF */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px' }}>
        <SectionHeader
          title="Medium-Term Expenditure Framework · MTEF 2026–2028"
          subtitle="3-year projections · PFM Act 2001 S.14 · IMF DSA framework"
        />
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={MTEF} margin={{ top: 4, right: 16, left: -18, bottom: 0 }}>
            <XAxis dataKey="y" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
            <YAxis tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
            <ReTooltip content={<ChartTip />} />
            <Line type="monotone" dataKey="rev" name="Revenue target"       stroke={COLORS.fiscal}   strokeWidth={2} dot={{ fill: COLORS.fiscal }} />
            <Line type="monotone" dataKey="exp" name="Expenditure ceiling"  stroke={COLORS.govBlue}  strokeWidth={2} dot={{ fill: COLORS.govBlue }} />
            <Line type="monotone" dataKey="bal" name="Fiscal balance"       stroke={COLORS.warning}  strokeWidth={2} strokeDasharray="4 2" dot={{ fill: COLORS.warning }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* PEFA note */}
      <div style={{
        background:    COLORS.surface,
        border:        `1px solid ${COLORS.border}`,
        borderLeft:    `4px solid ${COLORS.fiscal}`,
        borderRadius:  8,
        padding:       '16px 20px',
      }}>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, color: COLORS.fiscal, marginBottom: 8, letterSpacing: '1px' }}>
          PEFA MONITORING ACTIVE
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, lineHeight: 1.8 }}>
          PEFA PI-1 (Aggregate expenditure outturn): monitoring active · Score B<br />
          PEFA PI-2 (Expenditure composition outturn): monitoring active · Score C<br />
          PEFA PI-3 (Revenue outturn): monitoring active · Score B<br />
          Live data: Phase 2 — direct MOF FMIS connection
        </div>
      </div>
    </div>
  )
}
