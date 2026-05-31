import React from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { KPICard } from '../shared/KPICard.jsx'
import { SectionHeader } from '../shared/SectionHeader.jsx'
import { StatusBadge } from '../shared/StatusBadge.jsx'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CREDITORS = [
  { creditor: 'World Bank IDA',   type: 'Multilateral', outstanding: 484, pct: '26.2%', rate: '1.25%', maturity: '2041', dsa: 'GREEN'   },
  { creditor: 'Asian Dev Bank',   type: 'Multilateral', outstanding: 398, pct: '21.5%', rate: '1.50%', maturity: '2038', dsa: 'GREEN'   },
  { creditor: 'China EXIM Bank',  type: 'Bilateral',    outstanding: 284, pct: '15.4%', rate: '2.00%', maturity: '2035', dsa: 'MONITOR' },
  { creditor: 'Japan JICA',       type: 'Bilateral',    outstanding: 198, pct: '10.7%', rate: '0.10%', maturity: '2044', dsa: 'GREEN'   },
  { creditor: 'NZ / AUS bilateral',type:'Bilateral',    outstanding: 142, pct: '7.7%',  rate: '0.75%', maturity: '2036', dsa: 'GREEN'   },
  { creditor: 'OPEC Fund',        type: 'Multilateral', outstanding: 89,  pct: '4.8%',  rate: '1.00%', maturity: '2033', dsa: 'GREEN'   },
  { creditor: 'Domestic T-bills', type: 'Domestic',     outstanding: 252, pct: '13.6%', rate: '4.20%', maturity: '2027', dsa: 'GREEN'   },
]

const DEBT_SERVICE = [
  { y: '2026', principal: 42,  interest: 18 },
  { y: '2027', principal: 68,  interest: 22 },
  { y: '2028', principal: 85,  interest: 24 },
  { y: '2029', principal: 72,  interest: 21 },
  { y: '2030', principal: 58,  interest: 18 },
  { y: '2031', principal: 44,  interest: 14 },
  { y: '2032', principal: 39,  interest: 12 },
  { y: '2033', principal: 35,  interest: 10 },
  { y: '2034', principal: 28,  interest: 8  },
  { y: '2035', principal: 24,  interest: 7  },
]

const DEBT_HISTORY = [
  { y: '2021', actual: 44.2 }, { y: '2022', actual: 45.8 },
  { y: '2023', actual: 46.9 }, { y: '2024', actual: 47.2 },
  { y: '2025', actual: 47.5 }, { y: '2026', actual: 47.8 },
  { y: '2027', proj: 47.1  }, { y: '2028', proj: 46.4  },
]

const DSA_INDICATORS = [
  { indicator: 'PV of debt / GDP',       current: '38.4%', threshold: '55%',  status: 'GREEN'   },
  { indicator: 'PV of debt / Revenue',   current: '142%',  threshold: '250%', status: 'GREEN'   },
  { indicator: 'Debt service / Revenue', current: '14.1%', threshold: '20%',  status: 'GREEN'   },
  { indicator: 'Debt service / Exports', current: '11.2%', threshold: '25%',  status: 'GREEN'   },
  { indicator: 'External debt / GDP',    current: '33.2%', threshold: '40%',  status: 'MONITOR' },
  { indicator: 'Gross financing needs',  current: '6.8%',  threshold: '15%',  status: 'GREEN'   },
]

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontFamily: TYPOGRAPHY.mono, fontSize: 12, padding: '8px 12px', boxShadow: '0 2px 8px rgba(26,58,107,0.1)' }}>
      <div style={{ color: COLORS.govBlue, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || COLORS.text, marginBottom: 2 }}>{p.name}: {p.value?.toFixed?.(1) ?? p.value}{typeof p.value === 'number' && p.name?.includes?.('%') ? '%' : 'M'}</div>
      ))}
    </div>
  )
}

export function PublicDebtPanel({ lang }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <KPICard label="Total Public Debt" value="WST 1,847M" sub="47.8% of GDP · DSA: Sustainable" color={COLORS.govBlue} icon="◎" />
        <KPICard label="External Debt"     value="WST 1,284M" sub="69.5% of total public debt"      color={COLORS.warning}  icon="◐" />
        <KPICard label="Domestic Debt"     value="WST 563M"   sub="30.5% of total"                  color={COLORS.govBlue} icon="◼" />
        <KPICard label="Debt Service YTD"  value="WST 84.2M"  sub="4.6% of revenue · Manageable"   color={COLORS.fiscal}  icon="▲" />
      </div>

      {/* Creditor table */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="Creditor Breakdown" subtitle="IMF DSA Framework · PFM Act S.47 · World Bank debt data" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                {['Creditor','Type','Outstanding (WST M)','% Total','Interest Rate','Maturity','DSA Status'].map(h => (
                  <th key={h} style={{ padding: '9px 12px', background: COLORS.surface2, color: COLORS.govBlue, fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: h === 'Outstanding (WST M)' || h === '% Total' ? 'right' : 'left', borderBottom: `2px solid ${COLORS.border}`, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CREDITORS.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : COLORS.surface }}>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.text, fontWeight: 600, borderBottom: `1px solid ${COLORS.border}` }}>{row.creditor}</td>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{row.type}</td>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.text, textAlign: 'right', fontWeight: 600, borderBottom: `1px solid ${COLORS.border}` }}>{row.outstanding}</td>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.textMuted, textAlign: 'right', borderBottom: `1px solid ${COLORS.border}` }}>{row.pct}</td>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{row.rate}</td>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{row.maturity}</td>
                  <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}` }}>
                    <StatusBadge variant={row.dsa === 'GREEN' ? 'COMPLIANT' : 'MONITOR'} label={row.dsa} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Debt service schedule */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="Debt Service Schedule 2026–2035" subtitle="WST Millions · Principal + Interest by year" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={DEBT_SERVICE} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surface3} vertical={false} />
            <XAxis dataKey="y" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
            <YAxis tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
            <ReTooltip content={<ChartTip />} />
            <Bar dataKey="principal" name="Principal" fill={COLORS.govBlue} stackId="a" radius={[0,0,0,0]} />
            <Bar dataKey="interest"  name="Interest"  fill={COLORS.gold}    stackId="a" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* DSA indicators */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="IMF DSA Sustainability Thresholds" subtitle="Debt Sustainability Analysis · IMF DSA Framework 2018" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr>
                {['Indicator', 'Current', 'Threshold', 'Status'].map(h => (
                  <th key={h} style={{ padding: '9px 12px', background: COLORS.surface2, color: COLORS.govBlue, fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', borderBottom: `2px solid ${COLORS.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DSA_INDICATORS.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : COLORS.surface }}>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{row.indicator}</td>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, fontWeight: 700, color: row.status === 'GREEN' ? COLORS.fiscal : COLORS.warning, borderBottom: `1px solid ${COLORS.border}` }}>{row.current}</td>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{row.threshold}</td>
                  <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}` }}>
                    <StatusBadge variant={row.status === 'GREEN' ? 'COMPLIANT' : 'MONITOR'} label={row.status === 'GREEN' ? '✓ GREEN' : '⚠ MONITOR'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Debt/GDP trajectory */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="Public Debt / GDP Trajectory 2021–2028" subtitle="Actual + 3-year IMF DSA projection" />
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={DEBT_HISTORY} margin={{ top: 4, right: 16, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surface3} />
            <XAxis dataKey="y" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
            <YAxis domain={[30, 65]} tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} tickFormatter={v => `${v}%`} />
            <ReTooltip content={<ChartTip />} formatter={v => [`${v}%`]} />
            <ReferenceLine y={60} stroke={COLORS.critical} strokeDasharray="4 2" label={{ value: '60% IMF limit', position: 'insideTopRight', fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.critical }} />
            <ReferenceLine y={50} stroke={COLORS.warning}  strokeDasharray="3 2" label={{ value: '50% PFM Act limit', position: 'insideTopLeft', fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.warning }} />
            <Line type="monotone" dataKey="actual" name="Actual"     stroke={COLORS.govBlue} strokeWidth={2.5} dot={{ fill: COLORS.govBlue, r: 4 }} connectNulls={false} />
            <Line type="monotone" dataKey="proj"   name="Projection" stroke={COLORS.govBlue} strokeWidth={2} strokeDasharray="5 3" dot={{ fill: COLORS.govBlue, r: 3 }} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legislation reference */}
      <div style={{ background: COLORS.govBlueBg, border: `1px solid ${COLORS.govBlueBorder}`, borderLeft: `4px solid ${COLORS.govBlue}`, borderRadius: 8, padding: '16px 20px' }}>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, color: COLORS.govBlue, marginBottom: 8, letterSpacing: '1px' }}>
          PFM ACT 2001 — STATUTORY DEBT LIMIT
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.65 }}>
          PFM Act 2001 S.47: Minister of Finance must ensure total public debt does not exceed 50% of GDP
          without Parliamentary approval. <strong style={{ color: COLORS.fiscal }}>Current: 47.8% — within statutory limit.</strong>
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, marginTop: 8 }}>
          Next debt bulletin: Q2 2026 (Debt Management Division) ·
          IMF DSA last conducted: 2024
        </div>
      </div>
    </div>
  )
}
