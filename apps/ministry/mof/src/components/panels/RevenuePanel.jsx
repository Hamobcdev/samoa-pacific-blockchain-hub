import React from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { KPICard } from '../shared/KPICard.jsx'
import { SectionHeader } from '../shared/SectionHeader.jsx'
import { DataTable } from '../shared/DataTable.jsx'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const REVENUE_SOURCES = [
  { name: 'VAGST (GST)',          val: 241.8, pct: 40.4, col: COLORS.govBlue },
  { name: 'Customs duties',       val: 89.4,  pct: 14.9, col: '#2d5a9b'      },
  { name: 'Income tax',           val: 67.0,  pct: 11.2, col: '#3a6aaa'      },
  { name: 'Grants — World Bank',  val: 58.2,  pct: 9.7,  col: COLORS.fiscal  },
  { name: 'Grants — ADB',         val: 44.8,  pct: 7.5,  col: '#2a7a4a'      },
  { name: 'Grants — bilateral',   val: 39.0,  pct: 6.5,  col: '#3a8a5a'      },
  { name: 'Fees & charges',       val: 32.1,  pct: 5.4,  col: COLORS.gold    },
  { name: 'Other',                val: 25.8,  pct: 4.3,  col: COLORS.textDim },
]

const MONTHLY_TREND = [
  { m: 'Jul', target: 55, tax: 32, total: 38  },
  { m: 'Aug', target: 55, tax: 41, total: 48  },
  { m: 'Sep', target: 55, tax: 44, total: 52  },
  { m: 'Oct', target: 60, tax: 48, total: 56  },
  { m: 'Nov', target: 60, tax: 52, total: 59  },
  { m: 'Dec', target: 65, tax: 62, total: 65  },
  { m: 'Jan', target: 60, tax: 58, total: 68  },
  { m: 'Feb', target: 55, tax: 50, total: 74  },
  { m: 'Mar', target: 55, tax: 51, total: 80  },
  { m: 'Apr', target: 68, tax: 70, total: 83  },
  { m: 'May', target: 68, tax: 73, total: 87  },
  { m: 'Jun', target: 72, tax: 78, total: 92  },
]

const COFOG_ROWS = [
  { type: 'Taxes on income, profits, capital gains', cofog: '1.1.1', amt: 67.0,  pct: '11.2%', trend: '↑' },
  { type: 'Taxes on goods and services (VAGST)',     cofog: '1.1.4', amt: 241.8, pct: '40.4%', trend: '→' },
  { type: 'Taxes on international trade (Customs)',  cofog: '1.1.5', amt: 89.4,  pct: '14.9%', trend: '↑' },
  { type: 'Other taxes',                             cofog: '1.1.6', amt: 12.8,  pct: '2.1%',  trend: '→' },
  { type: 'Social contributions',                    cofog: '1.2',   amt: 18.4,  pct: '3.1%',  trend: '→' },
  { type: "Grants from int'l organisations",         cofog: '1.3.1', amt: 103.0, pct: '17.2%', trend: '↑' },
  { type: 'Other revenue',                           cofog: '1.4',   amt: 65.8,  pct: '11.0%', trend: '→' },
]

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontFamily: TYPOGRAPHY.mono, fontSize: 12, padding: '8px 12px', boxShadow: '0 2px 8px rgba(26,58,107,0.1)' }}>
      <div style={{ color: COLORS.govBlue, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || COLORS.text, marginBottom: 2 }}>{p.name}: {p.value?.toFixed?.(1) ?? p.value}M</div>
      ))}
    </div>
  )
}

const COFOG_HEADERS = [
  { key: 'type',  label: 'Revenue Type' },
  { key: 'cofog', label: 'GFSM Code', mono: true },
  { key: 'amtFmt',label: 'Amount (WST M)', align: 'right', mono: true },
  { key: 'pct',   label: '% Total', align: 'right', mono: true },
  { key: 'trend', label: 'Trend', align: 'right', sortable: false },
]

function trendColor(t) {
  if (t === '↑') return COLORS.fiscal
  if (t === '↓') return COLORS.critical
  return COLORS.textMuted
}

export function RevenuePanel({ lang }) {
  const rows = COFOG_ROWS.map(r => ({
    ...r,
    amtFmt: r.amt.toFixed(1),
    trend: <span style={{ color: trendColor(r.trend), fontFamily: TYPOGRAPHY.mono, fontSize: 14, fontWeight: 700 }}>{r.trend}</span>,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <KPICard label="Total Revenue YTD"  value="WST 598.2M" sub="71.2% of annual target WST 840M" color={COLORS.fiscal}  icon="▲" />
        <KPICard label="VAGST (GST)"        value="WST 241.8M" sub="40.4% of total · Primary source" color={COLORS.govBlue} icon="◼" />
        <KPICard label="Customs & Trade"    value="WST 156.4M" sub="26.2% of total · MOR"            color={COLORS.govBlue} icon="⟳" />
        <KPICard label="Non-Tax Revenue"    value="WST 199.9M" sub="Grants WST 142M + fees WST 57.9M" color={COLORS.gold}   icon="◈" />
      </div>

      {/* Revenue sources horizontal bar */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="Revenue Breakdown by Source" subtitle="WST Millions · GFSM 2014 classification" />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            layout="vertical"
            data={REVENUE_SOURCES}
            margin={{ top: 0, right: 60, left: 160, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surface3} horizontal={false} />
            <XAxis type="number" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
            <YAxis dataKey="name" type="category" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} width={155} />
            <ReTooltip content={<ChartTip />} />
            <Bar dataKey="val" name="WST M" fill={COLORS.govBlue} radius={[0,3,3,0]}
              label={{ position: 'right', formatter: (v) => `${v.toFixed(1)}M`, fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly trend */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader
          title="Monthly Revenue Trend FY 2025/26"
          subtitle="WST Millions · Revenue target vs tax revenue vs total"
        />
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={MONTHLY_TREND} margin={{ top: 4, right: 16, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surface3} />
            <XAxis dataKey="m" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
            <YAxis tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
            <ReTooltip content={<ChartTip />} />
            <Line type="monotone" dataKey="target" name="Target"        stroke={COLORS.gold}    strokeWidth={2} strokeDasharray="4 2" dot={false} />
            <Line type="monotone" dataKey="tax"    name="Tax revenue"   stroke={COLORS.govBlue} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="total"  name="Total revenue" stroke={COLORS.fiscal}  strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontFamily: TYPOGRAPHY.mono, fontSize: 11 }}>
          {[
            { col: COLORS.gold,    label: '— Target (dashed)' },
            { col: COLORS.govBlue, label: '— Tax revenue' },
            { col: COLORS.fiscal,  label: '— Total revenue' },
          ].map(l => (
            <span key={l.label} style={{ color: l.col }}>{l.label}</span>
          ))}
        </div>
      </div>

      {/* COFOG table */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader
          title="COFOG Revenue Classification"
          subtitle="IMF GFSM 2014 · GFS standard revenue categories"
        />
        <DataTable headers={COFOG_HEADERS} rows={rows} />
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          marginTop: 10, padding: '8px 12px',
          background: COLORS.govBlueBg,
          borderRadius: 4,
          fontFamily: TYPOGRAPHY.mono, fontSize: 12, fontWeight: 700,
          color: COLORS.govBlue,
        }}>
          TOTAL: WST 598.2M
        </div>
      </div>

      {/* CBS RTGS cross-reference */}
      <div style={{
        background:   COLORS.govBlueBg,
        border:       `1px solid ${COLORS.govBlueBorder}`,
        borderLeft:   `4px solid ${COLORS.govBlue}`,
        borderRadius: 8,
        padding:      '16px 20px',
      }}>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, color: COLORS.govBlue, marginBottom: 8, letterSpacing: '1px' }}>
          REVENUE SETTLEMENT CROSS-REFERENCE: CBS RTGS
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.65, marginBottom: 10 }}>
          All tax revenue settlements confirmed via CBS Real-Time Gross Settlement system.
          Phase 2: automated CBS→MOF revenue feed via InteroperabilityHub cross-ministry workflow.
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim }}>
          MOF MinistryNode: 0xEcd8Af2929FaDC86aA5Bb85E05C95695df39F0Cf ·
          CBS MinistryNode: 0xE932E59dAAB4d403e011c4aB0554171BC5eb35B8
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, textAlign: 'center', lineHeight: 1.9, padding: '8px 0 4px', borderTop: `1px solid ${COLORS.border}` }}>
        IMF GFSM 2014 · COFOG classification · SBS economic review ·
        MOR customs data · Phase 1 Research Environment
      </div>
    </div>
  )
}
