import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

// ─── ROLE CONFIGURATION ──────────────────────────────────────────────────────

const ROLES = {
  'CBS-GOVERNOR-2026': {
    level: 1, label: 'Governor',
    hsm: true, tabs: 'all',
    write: ['monetary', 'cbdc-mint', 'cbdc-burn'],
  },
  'CBS-DEPUTY-2026': {
    level: 2, label: 'Deputy Governor',
    hsm: true, tabs: 'all',
    write: [],
  },
  'CBS-CFO-2026': {
    level: 3, label: 'Chief Financial Officer',
    hsm: true,
    tabs: ['command','monetary','macro','banking','payments','cbdc','digital','compliance','pacific'],
    write: ['cbdc-sign'],
  },
  'CBS-ANALYST-2026': {
    level: 4, label: 'Senior Analyst',
    hsm: false,
    tabs: ['command','monetary','macro','banking','payments','crypto','compliance','pacific'],
    write: [],
  },
  'CBS-AUDITOR-2026': {
    level: 5, label: 'Auditor',
    hsm: false,
    tabs: ['fcu','crypto','compliance','security'],
    write: ['export'],
  },
  'CBS-IT-2026': {
    level: 6, label: 'IT Platform Officer',
    hsm: false,
    tabs: ['security'],
    write: ['platform'],
  },
}

const ALL_TABS = [
  { id: 'command',    label: 'Command'               },
  { id: 'monetary',  label: 'Monetary Policy'        },
  { id: 'macro',     label: 'Macro Economy'          },
  { id: 'banking',   label: 'Banking Supervision'    },
  { id: 'payments',  label: 'Payments & Distribution'},
  { id: 'cbdc',      label: 'CBDC Governance'        },
  { id: 'fcu',       label: 'Financial Crimes'       },
  { id: 'crypto',    label: 'Digital Asset Intel'    },
  { id: 'digital',   label: 'Reserve Strategy'       },
  { id: 'compliance',label: 'Compliance'             },
  { id: 'security',  label: 'Security & Platform'    },
  { id: 'pacific',   label: 'Pacific & Intl'         },
]

const LEVEL_COLORS = {
  1: '#0d9488',
  2: '#2563eb',
  3: '#7c3aed',
  4: '#d97706',
  5: '#dc2626',
  6: '#6b7280',
}

const ACTIVITY_EVENTS = [
  { text: 'NDIDS: New citizen registration', color: COLORS.info },
  { text: 'MOF: Grant milestone — tranche released', color: COLORS.operational },
  { text: 'Customs: FAL submission received', color: COLORS.gold },
  { text: 'SBS: CRVS sync completed', color: COLORS.info },
  { text: 'CBS: FX rate broadcast — NZD corridor', color: COLORS.gold },
  { text: 'Audit: Access event logged — Zone 3', color: COLORS.warning },
  { text: 'Hub: Cross-ministry workflow complete', color: COLORS.operational },
  { text: 'MCIT: Node health check — all green', color: COLORS.textMuted },
  { text: 'FCU: International alert received — FATF', color: COLORS.critical },
  { text: 'NDIDS: Registration batch — 12 records', color: COLORS.info },
  { text: 'MOF: PEFA indicator updated', color: COLORS.operational },
  { text: 'CBS: Policy rate broadcast confirmed', color: COLORS.gold },
]

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

function KPICard({ label, value, sub, color, dashed, icon }) {
  return (
    <div style={{
      background:    COLORS.surface2,
      border:        `1px solid ${dashed ? COLORS.blockedBorder : COLORS.border}`,
      borderStyle:   dashed ? 'dashed' : 'solid',
      borderRadius:  6,
      padding:       '14px 16px',
      display:       'flex',
      flexDirection: 'column',
      gap:           4,
      minWidth:      0,
    }}>
      <div style={{
        color: COLORS.textMuted, fontFamily: TYPOGRAPHY.mono, fontSize: 9,
        letterSpacing: '1.2px', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        {icon && <span aria-hidden="true">{icon}</span>} {label}
      </div>
      <div style={{ color: color ?? COLORS.text, fontFamily: TYPOGRAPHY.mono, fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
        {value}
      </div>
      {sub && <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9 }}>{sub}</div>}
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        fontFamily: TYPOGRAPHY.mono, fontSize: 10, fontWeight: 700,
        color: COLORS.gold, letterSpacing: '2px', textTransform: 'uppercase',
      }}>{title}</div>
      {subtitle && (
        <div style={{
          fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted,
          marginTop: 3, lineHeight: 1.5,
        }}>{subtitle}</div>
      )}
    </div>
  )
}

function ProgressBar({ value, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const c = pct < 30 ? COLORS.critical : pct < 50 ? COLORS.warning : COLORS.operational
  return (
    <div style={{ height: 5, background: COLORS.border, borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: c, borderRadius: 3 }} />
    </div>
  )
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: COLORS.surface2, border: `1px solid ${COLORS.border}`,
      borderRadius: 4, padding: '6px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 10,
    }}>
      {label && <div style={{ color: COLORS.textMuted, marginBottom: 3 }}>{label}</div>}
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color ?? COLORS.gold }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(typeof p.value === 'number' && p.value > 100 ? 0 : 4) : p.value}
        </div>
      ))}
    </div>
  )
}

function AccessDenied() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: 300, gap: 16,
    }}>
      <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 40, color: COLORS.critical }}>⊘</div>
      <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 13, color: COLORS.critical, letterSpacing: '1px' }}>
        ACCESS RESTRICTED
      </div>
      <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted, textAlign: 'center', maxWidth: 380, lineHeight: 1.6 }}>
        This tab requires L1 Governor, L2 Deputy Governor, or L5 Auditor clearance.
        Contact CBS IT Platform Officer to request elevated access.
      </div>
    </div>
  )
}

// ─── TAB 1: COMMAND ───────────────────────────────────────────────────────────

function CommandTab({ fxRates, ndids, blockHeight, workflows, activityFeed }) {
  const histRef = useRef([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const pt = { x: histRef.current.length, rate: parseFloat(fxRates.nzd.toFixed(4)) }
    histRef.current = [...histRef.current.slice(-29), pt].map((p, i) => ({ ...p, x: i }))
    setChartData([...histRef.current])
  }, [fxRates.nzd])

  const alerts = [
    { text: '6 governance items pending', sev: 'warn' },
    { text: 'FATF: 2 new international alerts', sev: 'crit' },
    { text: 'BIS PFMI: P15 critical gap', sev: 'crit' },
    { text: 'IMF Article IV: Next — Q4 2026', sev: 'info' },
    { text: 'PFTAC technical assistance: active', sev: 'ok' },
  ]
  const sevStyle = s => ({
    ok:   { color: COLORS.operational, bg: COLORS.operationalBg, border: COLORS.operationalBorder },
    warn: { color: COLORS.warning,     bg: COLORS.warningBg,     border: COLORS.warningBorder     },
    crit: { color: COLORS.critical,    bg: COLORS.criticalBg,    border: COLORS.criticalBorder    },
    info: { color: COLORS.info,        bg: COLORS.infoBg,        border: COLORS.infoBorder        },
  }[s])

  const calendar = [
    { m: 'Jun 2026', ev: 'SFSRDP NDIDS vendor procurement',          c: COLORS.info       },
    { m: 'Jul 2026', ev: 'SBS NDIDS Division staffing complete',      c: COLORS.operational },
    { m: 'Aug 2026', ev: 'EU Trade IMPACT Single Window review',      c: COLORS.warning    },
    { m: 'Sep 2026', ev: 'FATF mutual evaluation preparation',        c: COLORS.critical   },
    { m: 'Oct 2026', ev: 'IMF Article IV consultation',               c: COLORS.info       },
    { m: 'Dec 2026', ev: 'Basel III Phase 2 implementation review',   c: COLORS.gold       },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        <KPICard label="WST/NZD" value={fxRates.nzd.toFixed(4)} sub="Live · NZD per WST" color={COLORS.currencyWST} icon="◈" />
        <KPICard label="WST/USD" value={fxRates.usd.toFixed(4)} sub="Live · USD per WST" color={COLORS.currencyWST} icon="◈" />
        <KPICard label="Policy Rate" value="2.5%" sub="Official Cash Rate" color={COLORS.gold} icon="⚖" />
        <KPICard label="CPI Headline" value="3.2%" sub="YoY · SBS 2025" color={COLORS.warning} icon="▲" />
        <KPICard label="FX Reserves" value="WST 847M" sub="6.2 months import cover" color={COLORS.operational} icon="◎" />
        <KPICard label="NDIDS Registered" value={ndids.toLocaleString()} sub="Live · NDIDS Phase 1" color={COLORS.info} icon="◉" />
        <KPICard label="DPI Nodes" value="33 / 56" sub="Live network" color={COLORS.operational} icon="⬡" />
        <KPICard label="WST-DPI Supply" value="Phase 2" sub="Pending CBS governance" color={COLORS.blocked} icon="◑" dashed />
      </div>

      {/* Chart + Feed + Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '40% 1fr 26%', gap: 10 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: '14px 16px' }}>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: '1.5px', marginBottom: 10, textTransform: 'uppercase' }}>
            WST/NZD Live · Rolling 30 pts
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={chartData}>
              <XAxis dataKey="x" hide />
              <YAxis domain={['auto','auto']} hide />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="rate" stroke={COLORS.gold} strokeWidth={1.5} dot={false} name="WST/NZD" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: '14px 16px', overflow: 'hidden' }}>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: '1.5px', marginBottom: 10, textTransform: 'uppercase' }}>
            Live Activity Feed
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {activityFeed.slice(0, 7).map((ev, i) => (
              <div key={i} style={{
                background: COLORS.surface2, border: `1px solid ${COLORS.border}`,
                borderRadius: 3, padding: '5px 8px',
                fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted,
                display: 'flex', gap: 6, alignItems: 'center',
                opacity: Math.max(0.3, 1 - i * 0.1),
              }}>
                <span style={{ color: ev.color, minWidth: 8 }}>●</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.text}</span>
                <span style={{ color: COLORS.textDim, fontSize: 8, flexShrink: 0 }}>{ev.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: '14px 16px' }}>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: '1.5px', marginBottom: 10, textTransform: 'uppercase' }}>
            Alert Centre
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {alerts.map((a, i) => {
              const st = sevStyle(a.sev)
              return (
                <div key={i} style={{
                  background: st.bg, border: `1px solid ${st.border}`,
                  borderLeft: `3px solid ${st.color}`, borderRadius: 3, padding: '6px 8px',
                  fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: st.color, lineHeight: 1.4,
                }}>{a.text}</div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Regulatory Calendar */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: '14px 16px' }}>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: '1.5px', marginBottom: 12, textTransform: 'uppercase' }}>
          Regulatory Calendar · Next 6 Months
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {calendar.map((item, i) => (
            <div key={i} style={{
              background: COLORS.surface2, border: `1px solid ${COLORS.border}`,
              borderTop: `3px solid ${item.c}`, borderRadius: 4,
              padding: '10px 12px', minWidth: 156, flexShrink: 0,
            }}>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: item.c, fontWeight: 600, marginBottom: 4 }}>{item.m}</div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, lineHeight: 1.5 }}>{item.ev}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>
        Block #{blockHeight.toLocaleString()} · {workflows} active workflows · Simulated data · Phase 1 Research Environment
      </div>
    </div>
  )
}

// ─── TAB 2: MONETARY POLICY ───────────────────────────────────────────────────

function MonetaryTab({ fxRates, canWrite }) {
  const [rateChange, setRateChange] = useState(0)
  const [horizon, setHorizon] = useState(12)
  const [scenario, setScenario] = useState('Base')

  const impact = useMemo(() => {
    const m = scenario === 'Bull' ? 0.15 : scenario === 'Base' ? 0.25 : 0.4
    return {
      cpi:       (-(rateChange * m)).toFixed(2),
      m1:        (-(rateChange * 1.8)).toFixed(1),
      credit:    (-(rateChange * 2.1)).toFixed(1),
      fxPressure:(rateChange * 15).toFixed(0),
      remit:     (rateChange * 0.8).toFixed(1),
      tourism:   (rateChange * 1.2).toFixed(1),
      debt:      (rateChange * 2.4).toFixed(1),
      velocity:  (-rateChange * 3.5).toFixed(1),
    }
  }, [rateChange, scenario])

  const tlColor = v => {
    const n = Math.abs(parseFloat(v))
    return n < 0.3 ? COLORS.operational : n < 1 ? COLORS.warning : COLORS.critical
  }

  const mSupply = [
    { name: 'M0', value: 284 },
    { name: 'M1', value: 482 },
    { name: 'M2', value: 1240 },
    { name: 'M3', value: 1890 },
  ]

  const instruments = [
    { label: 'Official Cash Rate',         value: '2.5%',     editable: canWrite('monetary') },
    { label: 'Interbank Overnight Rate',   value: '2.48%',    editable: false },
    { label: 'Reserve Requirement Ratio',  value: '10%',      editable: canWrite('monetary') },
    { label: 'Standing Lending Facility',  value: '3.0%',     editable: false },
    { label: 'Standing Deposit Facility',  value: '2.0%',     editable: false },
    { label: 'Credit Growth Rate',         value: '4.2% YoY', editable: false },
    { label: 'Monetary Base',              value: 'WST 284M', editable: false },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
            <SectionHeader title="Policy Instruments" subtitle="CBS Official Monetary Parameters" />
            {instruments.map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 0', borderBottom: `1px solid ${COLORS.border}`,
              }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted }}>{item.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.gold, fontWeight: 600 }}>{item.value}</span>
                  {item.editable && <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.info, cursor: 'pointer' }}>✎</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
            <SectionHeader title="Money Supply" subtitle="M0–M3 · WST Millions" />
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={mSupply} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="name" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="value" name="WST M" fill={COLORS.gold} radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, marginTop: 6 }}>
              {mSupply.map(m => (
                <div key={m.name} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textMuted }}>{m.name}</div>
                  <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.gold, fontWeight: 600 }}>
                    {m.value >= 1000 ? (m.value/1000).toFixed(2)+'B' : m.value+'M'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Scenario Calculator */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="Policy Rate Impact Simulator" subtitle="Governor clearance required · Scenario modelling only" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 5 }}>
                Rate Change: {rateChange > 0 ? '+' : ''}{rateChange.toFixed(2)}%
              </div>
              <input type="range" min={-2} max={2} step={0.25} value={rateChange}
                onChange={e => setRateChange(parseFloat(e.target.value))}
                disabled={!canWrite('monetary')}
                style={{ width: '100%', accentColor: COLORS.gold }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>
                <span>-2%</span><span>0%</span><span>+2%</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 4 }}>Horizon</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[6,12,24].map(h => (
                    <button key={h} onClick={() => setHorizon(h)} style={{
                      flex: 1, padding: '4px 0', cursor: 'pointer',
                      background: horizon === h ? COLORS.gold : COLORS.surface2,
                      color: horizon === h ? COLORS.bg : COLORS.textMuted,
                      border: `1px solid ${COLORS.border}`, borderRadius: 3,
                      fontFamily: TYPOGRAPHY.mono, fontSize: 9,
                    }}>{h}mo</button>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 4 }}>Scenario</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['Bear','Base','Bull'].map(s => (
                    <button key={s} onClick={() => setScenario(s)} style={{
                      flex: 1, padding: '4px 0', cursor: 'pointer',
                      background: scenario === s ? COLORS.gold : COLORS.surface2,
                      color: scenario === s ? COLORS.bg : COLORS.textMuted,
                      border: `1px solid ${COLORS.border}`, borderRadius: 3,
                      fontFamily: TYPOGRAPHY.mono, fontSize: 9,
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
            {[
              { label: 'Projected CPI impact',        val: `${impact.cpi}%`       },
              { label: 'M1/M2 change',                val: `${impact.m1}%`        },
              { label: 'Credit growth effect',        val: `${impact.credit}%`    },
              { label: 'WST/NZD pressure',            val: `${impact.fxPressure} bps` },
              { label: 'Remittance cost corridor',    val: `${impact.remit}%`     },
              { label: 'Tourism credit cost',         val: `${impact.tourism}%`   },
              { label: 'Govt debt servicing',         val: `WST ${impact.debt}M`  },
              { label: 'WST-DPI velocity change',     val: `${impact.velocity}%`  },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '6px 10px',
                background: i % 2 === 0 ? 'transparent' : COLORS.surface2,
                borderBottom: `1px solid ${COLORS.border}`,
              }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{row.label}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, fontWeight: 600, color: rateChange === 0 ? COLORS.textDim : tlColor(row.val) }}>
                  {rateChange === 0 ? '—' : row.val}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            background: COLORS.warningBg, border: `1px solid ${COLORS.warningBorder}`,
            borderLeft: `3px solid ${COLORS.warning}`, borderRadius: 3, padding: '8px 10px',
            fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.warning, lineHeight: 1.5,
          }}>
            ⚠ Scenario modelling only. No commitment implied. Governor + Deputy sign-off required for policy change.
          </div>
        </div>
      </div>

      {/* FX Rates */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="FX Rates — Live" subtitle="WST cross-rates · CBS reference rates · drift simulation" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
          {Object.entries(fxRates).map(([ccy, rate]) => (
            <div key={ccy} style={{
              background: COLORS.surface2, border: `1px solid ${COLORS.border}`,
              borderRadius: 4, padding: '10px 12px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>
                WST/{ccy.toUpperCase()}
              </div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 14, color: COLORS.gold, fontWeight: 700 }}>
                {rate.toFixed(4)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TAB 3: MACRO ECONOMY ─────────────────────────────────────────────────────

function MacroTab() {
  const indicators = [
    { label: 'GDP Real Growth',       value: '2.8%',      sub: '2025 est',          color: COLORS.operational },
    { label: 'GDP Per Capita',        value: 'WST 8,420', sub: 'IMF estimate',      color: COLORS.text        },
    { label: 'Tourism Receipts',      value: 'WST 312M',  sub: 'YTD 2025',          color: COLORS.operational },
    { label: 'Remittances',           value: 'WST 186M',  sub: 'YTD · ~20% of GDP', color: COLORS.gold        },
    { label: 'Trade Balance',         value: 'WST -42M',  sub: 'Deficit',           color: COLORS.warning     },
    { label: 'Current Account / GDP', value: '-8.2%',     sub: 'IMF threshold: -10%',color: COLORS.warning    },
    { label: 'Budget Deficit / GDP',  value: '-3.1%',     sub: 'MOF target: -2%',   color: COLORS.warning     },
    { label: 'Public Debt / GDP',     value: '47.8%',     sub: 'IMF DSA: sustainable',color: COLORS.operational},
    { label: 'External Debt / GDP',   value: '28.4%',     sub: 'Green zone',        color: COLORS.operational },
    { label: 'Import Cover',          value: '6.2 months',sub: 'Threshold: 3 months',color: COLORS.operational},
  ]

  const gdpHist = [
    { year: '2021', gdp: -7.1 },
    { year: '2022', gdp: 0.5  },
    { year: '2023', gdp: 1.8  },
    { year: '2024', gdp: 2.4  },
    { year: '2025', gdp: 2.8  },
  ]

  const remitCosts = [
    { ccy: 'NZD', cost: 8.2 },
    { ccy: 'AUD', cost: 6.8 },
    { ccy: 'USD', cost: 7.1 },
    { ccy: 'FJD', cost: 5.4 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="Economic Indicators" subtitle="IMF · SBS estimates · 2025" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 5 }}>
          {indicators.map((ind, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '7px 10px', borderRadius: 3,
              background: i % 2 === 0 ? COLORS.surface2 : 'transparent',
              border: `1px solid ${COLORS.border}`,
            }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted }}>{ind.label}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: ind.color, fontWeight: 600 }}>{ind.value}</div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>{ind.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="GDP Real Growth" subtitle="5-year history · %" />
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={gdpHist}>
              <XAxis dataKey="year" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <ReferenceLine y={0} stroke={COLORS.border2} />
              <Bar dataKey="gdp" name="GDP %" fill={COLORS.operational} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="Remittance Cost Corridors" subtitle="% of transfer · WST-DPI target: <2%" />
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={remitCosts} layout="vertical">
              <XAxis type="number" domain={[0,12]} tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="ccy" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, fill: COLORS.textMuted }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<ChartTip />} />
              <ReferenceLine x={2} stroke={COLORS.operational} strokeDasharray="3 3" />
              <Bar dataKey="cost" name="Cost %" fill={COLORS.warning} radius={[0,2,2,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.operational, marginTop: 4 }}>
            ← WST-DPI Phase 2 target: &lt;2% (dashed line)
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="Financial Inclusion" subtitle="SBS · World Bank Findex 2022" />
          {[
            { label: 'Population with bank account', value: '42%',     color: COLORS.warning  },
            { label: 'Unbanked — Upolu',             value: '28%',     color: COLORS.warning  },
            { label: "Unbanked — Savai'i",           value: '51%',     color: COLORS.critical },
            { label: 'Mobile money users',           value: '18%',     color: COLORS.info     },
            { label: 'WST-DPI adoption',             value: 'Phase 2', color: COLORS.blocked  },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted }}>{item.label}</span>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: item.color, fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim, lineHeight: 1.5 }}>
            Source: SBS · World Bank Findex 2022. Phase 2: live NDIDS-linked metrics.
          </div>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="Climate & NGFS Risk" subtitle="Network for Greening the Financial System · Pacific SIDS" />
          {[
            { label: 'NGFS membership status',   value: 'Under consideration', color: COLORS.warning  },
            { label: 'Physical climate risk',    value: 'EXTREME',             color: COLORS.critical },
            { label: 'Sea level rise exposure',  value: 'Critical infra',      color: COLORS.critical },
            { label: 'Agri credit risk',         value: 'HIGH',                color: COLORS.high     },
            { label: 'Energy transition risk',   value: 'MODERATE',            color: COLORS.warning  },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted }}>{item.label}</span>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: item.color, fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim, lineHeight: 1.5 }}>
            BIS: climate risk now part of central bank mandate globally.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TAB 4: BANKING SUPERVISION ───────────────────────────────────────────────

function BankingTab() {
  const [expanded, setExpanded] = useState(null)

  const banks = [
    { name: 'ANZ Bank Samoa',         car: 16.2, npl: 1.8, lcr: 142, nsfr: 118, roa: 1.4, roe: 12.1, status: 'COMPLIANT', alert: '—',       stress: 'PASS',        complaints: 12, fatf: 'COMPLIANT', iso: 'In progress'  },
    { name: 'BSP Samoa',              car: 14.8, npl: 2.4, lcr: 128, nsfr: 112, roa: 1.1, roe:  9.8, status: 'COMPLIANT', alert: '—',       stress: 'PASS',        complaints:  8, fatf: 'COMPLIANT', iso: 'Planning'     },
    { name: 'Samoa Commercial Bank',  car: 13.1, npl: 3.9, lcr: 118, nsfr: 108, roa: 0.8, roe:  7.2, status: 'MONITOR',   alert: 'NPL↑',    stress: 'CONDITIONAL', complaints: 23, fatf: 'MONITOR',   iso: 'In progress'  },
    { name: 'National Bank of Samoa', car: 15.6, npl: 2.1, lcr: 135, nsfr: 115, roa: 1.2, roe: 10.4, status: 'COMPLIANT', alert: '—',       stress: 'PASS',        complaints:  6, fatf: 'COMPLIANT', iso: 'Not started'  },
    { name: 'Development Bank Samoa', car: 12.4, npl: 5.2, lcr: 104, nsfr:  98, roa: 0.4, roe:  3.8, status: 'WATCH',     alert: 'LCR/NPL', stress: 'FAIL',        complaints:  4, fatf: 'WATCH',     iso: 'Not started'  },
  ]

  const carC  = v => v < 12 ? COLORS.critical : v < 14 ? COLORS.warning : COLORS.operational
  const nplC  = v => v > 5  ? COLORS.critical : v > 3  ? COLORS.warning : COLORS.operational
  const lcrC  = v => v < 100? COLORS.critical : v < 110? COLORS.warning : COLORS.operational
  const stC   = s => s === 'COMPLIANT' ? COLORS.operational : s === 'MONITOR' ? COLORS.warning : COLORS.critical
  const stBg  = s => s === 'COMPLIANT' ? COLORS.operationalBg : s === 'MONITOR' ? COLORS.warningBg : COLORS.criticalBg
  const stBdr = s => s === 'COMPLIANT' ? COLORS.operationalBorder : s === 'MONITOR' ? COLORS.warningBorder : COLORS.criticalBorder

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="Licensed Financial Institutions" subtitle="CBS Supervisory Data · Basel III metrics · click row to expand" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Institution','CAR','NPL','LCR','NSFR','ROA','ROE','Status','Alert'].map(h => (
                  <th key={h} style={{
                    fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textMuted,
                    padding: '6px 10px', borderBottom: `1px solid ${COLORS.border}`,
                    textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left',
                    background: COLORS.surface, whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {banks.map((bank, i) => (
                <React.Fragment key={bank.name}>
                  <tr
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    style={{ background: expanded === i ? COLORS.surface3 : i % 2 === 0 ? 'transparent' : COLORS.surface2, cursor: 'pointer' }}
                  >
                    <td style={{ padding: '8px 10px', color: COLORS.text, fontSize: 12, borderBottom: `1px solid ${COLORS.border}`, fontFamily: TYPOGRAPHY.sans }}>{bank.name}</td>
                    <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 600, color: carC(bank.car), borderBottom: `1px solid ${COLORS.border}` }}>{bank.car}%</td>
                    <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 600, color: nplC(bank.npl), borderBottom: `1px solid ${COLORS.border}` }}>{bank.npl}%</td>
                    <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 600, color: lcrC(bank.lcr), borderBottom: `1px solid ${COLORS.border}` }}>{bank.lcr}%</td>
                    <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{bank.nsfr}%</td>
                    <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{bank.roa}%</td>
                    <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{bank.roe}%</td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, fontWeight: 600, padding: '2px 6px', borderRadius: 3, background: stBg(bank.status), color: stC(bank.status), border: `1px solid ${stBdr(bank.status)}` }}>
                        {bank.status}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: bank.alert === '—' ? COLORS.textDim : COLORS.warning, borderBottom: `1px solid ${COLORS.border}` }}>{bank.alert}</td>
                  </tr>
                  {expanded === i && (
                    <tr>
                      <td colSpan={9} style={{ padding: '12px 20px', background: COLORS.surface3, borderBottom: `1px solid ${COLORS.border}` }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                          {[
                            { label: 'Last Stress Test',      value: bank.stress,                 color: bank.stress === 'PASS' ? COLORS.operational : bank.stress === 'CONDITIONAL' ? COLORS.warning : COLORS.critical },
                            { label: 'Consumer Complaints YTD',value: `${bank.complaints} cases`, color: COLORS.text     },
                            { label: 'FATF AML Rating',       value: bank.fatf,                   color: stC(bank.fatf)  },
                            { label: 'ISO 20022 Migration',   value: bank.iso,                    color: COLORS.info     },
                          ].map((d, j) => (
                            <div key={j} style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9 }}>
                              <div style={{ color: COLORS.textMuted, marginBottom: 3 }}>{d.label}</div>
                              <div style={{ color: d.color, fontWeight: 600 }}>{d.value}</div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="Basel III Thresholds" subtitle="CBS requirements exceed Basel III minima" />
          {[
            { label: 'CBS Minimum CAR',    value: '12.0%',  note: 'Samoa CBS requirement',      color: COLORS.gold  },
            { label: 'Basel III Minimum',  value: '10.5%',  note: 'With conservation buffer',   color: COLORS.info  },
            { label: 'SIFI Buffer',        value: '+1.0%',  note: 'If applicable',              color: COLORS.warning},
          ].map((item, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted }}>{item.label}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: item.color, fontWeight: 700 }}>{item.value}</span>
              </div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim, marginTop: 2 }}>{item.note}</div>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="Early Warning Indicators" subtitle="Macroprudential surveillance" />
          {[
            { label: 'Credit to GDP Gap',     value: '+2.3%', note: 'Within range',   color: COLORS.operational },
            { label: 'Property Price Growth', value: '+8.1%', note: 'Elevated',        color: COLORS.warning     },
            { label: 'Household Debt / GDP',  value: '31%',   note: 'Comfortable',     color: COLORS.operational },
            { label: 'FX Lending Ratio',      value: '12%',   note: 'Low',             color: COLORS.operational },
          ].map((item, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted }}>{item.label}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: item.color, fontWeight: 700 }}>{item.value}</span>
              </div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim, marginTop: 2 }}>{item.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TAB 5: PAYMENTS & DISTRIBUTION ──────────────────────────────────────────

function PaymentsTab() {
  const hourly = Array.from({ length: 24 }, (_, h) => ({
    h: `${h.toString().padStart(2,'0')}:00`,
    vol: h < 8 ? Math.floor(15 + h * 2) : h < 17 ? Math.floor(40 + h * 4) : Math.floor(30 - (h-17)*3 + 10),
  }))

  const tier2 = [
    { code: 'ANZ-WS', name: 'ANZ Bank Samoa',         limit: 500000, iso: 'In progress', wst: 'Partial'  },
    { code: 'BSP-WS', name: 'BSP Samoa',              limit: 300000, iso: 'Planning',    wst: 'No'       },
    { code: 'SCB-WS', name: 'Samoa Commercial Bank',  limit: 200000, iso: 'In progress', wst: 'Partial'  },
    { code: 'NBS-WS', name: 'National Bank of Samoa', limit: 200000, iso: 'Not started', wst: 'No'       },
    { code: 'DBS-WS', name: 'Development Bank Samoa', limit: 150000, iso: 'Not started', wst: 'No'       },
  ]

  const FINALITY = [
    { label: 'Initiated',  color: COLORS.settlementInitiated  },
    { label: 'Confirming', color: COLORS.settlementConfirming },
    { label: 'Final',      color: COLORS.settlementFinal      },
    { label: 'Failed',     color: COLORS.settlementFailed     },
    { label: 'CBS-Held',   color: COLORS.settlementCBSHeld    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="RTGS Operations — Live" subtitle="Real-Time Gross Settlement · CBS oversight" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Transactions today', value: '842',        color: COLORS.text        },
            { label: 'Settlement value',   value: 'WST 124.3M', color: COLORS.gold        },
            { label: 'Success rate',       value: '99.97%',     color: COLORS.operational },
            { label: 'Avg settlement',     value: '4.2 sec',    color: COLORS.operational },
            { label: 'System uptime',      value: '100%',       color: COLORS.operational },
            { label: 'Failed tx',          value: '3',          color: COLORS.warning     },
          ].map((k, i) => (
            <div key={i} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>{k.label}</div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 13, color: k.color, fontWeight: 700 }}>{k.value}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 6 }}>Hourly transaction volume</div>
        <ResponsiveContainer width="100%" height={90}>
          <BarChart data={hourly} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="h" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 7, fill: COLORS.textDim }} axisLine={false} tickLine={false} interval={3} />
            <YAxis hide />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="vol" name="Transactions" fill={COLORS.info} radius={[1,1,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="ISO 20022 Migration Status" subtitle="SWIFT migration deadline: Nov 2025 (extended to 2026 for Pacific). All institutions must comply." />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Institution','Format','ISO 20022','SWIFT Migration','WST-DPI'].map(h => (
                <th key={h} style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textMuted, padding: '6px 10px', borderBottom: `1px solid ${COLORS.border}`, textTransform: 'uppercase', textAlign: 'left', background: COLORS.surface }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tier2.map((b, i) => (
              <tr key={b.code} style={{ background: i % 2 === 0 ? 'transparent' : COLORS.surface2 }}>
                <td style={{ padding: '7px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.gold, fontWeight: 600, borderBottom: `1px solid ${COLORS.border}` }}>{b.code}</td>
                <td style={{ padding: '7px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>MT103/MT202</td>
                <td style={{ padding: '7px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 10, borderBottom: `1px solid ${COLORS.border}`, color: b.iso === 'Not started' ? COLORS.critical : b.iso === 'Planning' ? COLORS.warning : COLORS.info }}>{b.iso}</td>
                <td style={{ padding: '7px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>Q3–Q4 2026</td>
                <td style={{ padding: '7px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 10, borderBottom: `1px solid ${COLORS.border}`, color: b.wst === 'Partial' ? COLORS.warning : COLORS.critical }}>{b.wst}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 10, background: COLORS.criticalBg, border: `1px solid ${COLORS.criticalBorder}`, borderLeft: `3px solid ${COLORS.critical}`, borderRadius: 3, padding: '8px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.critical, lineHeight: 1.5 }}>
          DBS ISO 20022 gap is critical for WST-DPI retail distribution layer. Integration timeline: Phase 2 dependent on DBS system upgrade.
        </div>
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="WST-DPI Wholesale & Retail Distribution" subtitle="CBS Supervisory Function · 2-tier distribution model" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div style={{ border: `1px dashed ${COLORS.blockedBorder}`, borderRadius: 4, padding: 12 }}>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.blocked, marginBottom: 8, fontWeight: 600 }}>TIER 1 — WHOLESALE (CBS → Banks) · Phase 2</div>
            {['CBS Vault holdings','Daily CBS→Bank settlements','Wholesale limit per institution'].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{r}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.blocked }}>Phase 2</span>
              </div>
            ))}
          </div>
          <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: 12 }}>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.gold, marginBottom: 8, fontWeight: 600 }}>TIER 2 — RETAIL (Banks → Citizens)</div>
            {tier2.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.gold }}>{b.code}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>WST {(b.limit/1000).toFixed(0)}K/day</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.operational }}>✓ ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>Settlement finality states:</span>
          {FINALITY.map(s => (
            <span key={s.label} style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, padding: '2px 8px', borderRadius: 3, background: COLORS.surface2, color: s.color, border: `1px solid ${COLORS.border}` }}>{s.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TAB 6: CBDC GOVERNANCE ───────────────────────────────────────────────────

function CBDCTab({ canWrite, roleLevel }) {
  const controls = [
    { label: 'WST-DPI Issuance Authority',  desc: 'CBS-only mint rights, enforced via multisig', locked: true                  },
    { label: 'Mint Authorisation',          desc: 'Governor + Deputy + CFO quorum required',     locked: !canWrite('cbdc-mint') },
    { label: 'Burn Authorisation',          desc: 'Governor + Deputy quorum required',           locked: !canWrite('cbdc-burn') },
    { label: 'Distribution Tier Approval',  desc: 'CBS Board resolution required',               locked: true                  },
    { label: 'Emergency Halt',              desc: 'Any L1-L2 keyholder can pause',              locked: roleLevel > 2          },
    { label: 'Key Rotation Protocol',       desc: 'HSM ceremony — all 3 keyholders present',    locked: true                  },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="DPI Governance & Monetary Controls" subtitle="Required for live fiat DPI infrastructure NOW — not conditional on CBDC deployment. CBS is the monetary authority." />
        <div style={{ background: COLORS.infoBg, border: `1px solid ${COLORS.infoBorder}`, borderLeft: `3px solid ${COLORS.info}`, borderRadius: 3, padding: '10px 14px', marginBottom: 14, fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.info, lineHeight: 1.7 }}>
          <strong>CBS Internal Multisig Configuration</strong><br />
          CBS-GOVERNOR-2026 + CBS-DEPUTY-2026 + CBS-CFO-2026<br />
          2-of-3 quorum required for all governance operations · Each keyholder requires HSM authentication.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {controls.map((ctrl, i) => (
            <div key={i} style={{
              background: ctrl.locked ? COLORS.surface2 : COLORS.operationalBg,
              border: `1px solid ${ctrl.locked ? COLORS.border : COLORS.operationalBorder}`,
              borderLeft: `3px solid ${ctrl.locked ? COLORS.textDim : COLORS.operational}`,
              borderRadius: 4, padding: '10px 14px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: ctrl.locked ? COLORS.textMuted : COLORS.operational, fontWeight: 600 }}>{ctrl.label}</div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textDim, marginTop: 2 }}>{ctrl.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {ctrl.locked ? (
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>CBS GOVERNANCE REQUIRED — pending CBS internal decision</span>
                ) : (
                  <button style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, padding: '4px 12px', borderRadius: 3, cursor: 'pointer', background: COLORS.operational, color: COLORS.bg, border: 'none', fontWeight: 600 }}>
                    AUTHORISE
                  </button>
                )}
                <span style={{ fontSize: 14 }}>{ctrl.locked ? '🔒' : '🔓'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.blockedBorder}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="Phase 2 — CBDC Operational Metrics" subtitle="When Phase 2 activates, CBS retains sole monetary authority over WST-DPI issuance via internal multisig. No external party holds mint or burn authority." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {['Total WST-DPI Supply','CBS Reserve Backing Ratio','Daily Mint Volume','Daily Burn Volume','Circulating Supply','Velocity (7-day avg)'].map((m, i) => (
            <div key={i} style={{ background: COLORS.blockedBg, border: `1px dashed ${COLORS.blockedBorder}`, borderRadius: 4, padding: '12px 14px' }}>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textDim, marginBottom: 6 }}>{m}</div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 14, color: COLORS.blocked, fontWeight: 700 }}>— Phase 2</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { title: 'Token Standard',  value: 'ERC-20 · ISO 20022 compatible', sub: 'Polygon Amoy testnet'   },
          { title: 'Reserve Backing', value: '100% WST fiat reserve',         sub: 'CBS custody requirement' },
          { title: 'Privacy Model',   value: 'NDIDS hash-based identity',     sub: 'Zero PII on-chain'      },
        ].map((c, i) => (
          <div key={i} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '12px 14px' }}>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 4 }}>{c.title}</div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.gold, fontWeight: 600 }}>{c.value}</div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim, marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TAB 7: FINANCIAL CRIMES UNIT ─────────────────────────────────────────────

function FCUTab({ roleLevel }) {
  const [alertIdx, setAlertIdx] = useState(0)

  const intlAlerts = [
    { src: 'INTERPOL',     text: 'Cryptocurrency romance scam network — Pacific region',       sev: 'HIGH',   type: 'CRYPTO' },
    { src: 'ACCC',         text: 'Investment fraud targeting Pacific diaspora communities',    sev: 'HIGH',   type: 'FRAUD'  },
    { src: 'FCA UK',       text: 'Unregistered crypto exchange targeting Samoa nationals',     sev: 'MEDIUM', type: 'CRYPTO' },
    { src: 'FinCEN',       text: 'Suspicious bulk cash via Pacific remittance corridors',      sev: 'HIGH',   type: 'AML'    },
    { src: 'FATF',         text: 'Updated guidance on virtual asset red flags — R.15',         sev: 'MEDIUM', type: 'CRYPTO' },
    { src: 'NZ Police',    text: 'Online investment scam — NZD to crypto — Pacific victims',  sev: 'HIGH',   type: 'SCAM'   },
    { src: 'AUSTRAC',      text: 'Suspicious remittance pattern — Samoa-AUS corridor',        sev: 'MEDIUM', type: 'AML'    },
    { src: 'Egmont Group', text: 'Terrorist financing typology update — Pacific SIDS',        sev: 'LOW',    type: 'AML'    },
  ]

  useEffect(() => {
    const id = setInterval(() => setAlertIdx(i => (i + 1) % intlAlerts.length), 15000)
    return () => clearInterval(id)
  }, [intlAlerts.length])

  const visible = Array.from({ length: 4 }, (_, i) => intlAlerts[(alertIdx + i) % intlAlerts.length])
  const sevC  = s => s === 'HIGH' ? COLORS.critical : s === 'MEDIUM' ? COLORS.warning : COLORS.info
  const sevBg = s => s === 'HIGH' ? COLORS.criticalBg : s === 'MEDIUM' ? COLORS.warningBg : COLORS.infoBg

  if (![1, 2, 5].includes(roleLevel)) return <AccessDenied />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        <KPICard label="STR/SAR filings" value="4"        sub="This month"          color={COLORS.warning}  icon="⚠" />
        <KPICard label="Intl alerts"     value="12"       sub="Active period"       color={COLORS.critical} icon="◉" />
        <KPICard label="Investigations"  value="2"        sub="Active · confidential" color={COLORS.high}   icon="⟳" />
        <KPICard label="FATF eval"       value="14 months" sub="Oct 2027 estimate"  color={COLORS.info}     icon="⚖" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="International Alert Feed" subtitle="Live · Rotating every 15s · INTERPOL · FATF · ACCC · FinCEN" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {visible.map((a, i) => (
              <div key={i} style={{ background: sevBg(a.sev), border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${sevC(a.sev)}`, borderRadius: 3, padding: '8px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: sevC(a.sev), fontWeight: 600 }}>{a.src}</span>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>{a.sev} · {a.type}</span>
                </div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, lineHeight: 1.5 }}>{a.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
            <SectionHeader title="Local FCU Metrics" subtitle="Q2 2026 · Samoa FIU" />
            {[
              { label: 'Consumer fraud complaints', value: '18', color: COLORS.warning  },
              { label: 'Mobile money fraud',        value: '6',  color: COLORS.warning  },
              { label: 'Online scam reports',       value: '8',  color: COLORS.warning  },
              { label: 'Suspicious wire transfers', value: '4',  color: COLORS.critical },
              { label: 'CTRs >WST 10,000',          value: '23', color: COLORS.info     },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{item.label}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: item.color, fontWeight: 700 }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
            <SectionHeader title="FIU Liaison" subtitle="Egmont Group member" />
            {[
              { label: 'Egmont Group',     value: 'MEMBER',        color: COLORS.operational },
              { label: 'Last report',      value: 'March 2026',    color: COLORS.text        },
              { label: 'Next report due',  value: 'Sep 2026',      color: COLORS.warning     },
              { label: 'Mutual eval',      value: 'Oct 2027 est.', color: COLORS.info        },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{item.label}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: item.color, fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="FATF Compliance Status" subtitle="Selected recommendations · Samoa self-assessment" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            { r: 'R.15 Virtual assets',         status: 'PARTIALLY COMPLIANT', color: COLORS.warning     },
            { r: 'R.13 Correspondent banking',  status: 'COMPLIANT',            color: COLORS.operational },
            { r: 'R.16 Travel rule',            status: 'IN PROGRESS',          color: COLORS.warning     },
            { r: 'R.20 STR reporting',          status: 'COMPLIANT',            color: COLORS.operational },
            { r: 'R.26 Regulation/supervision', status: 'COMPLIANT',            color: COLORS.operational },
            { r: 'R.35 Sanctions',              status: 'MONITOR',              color: COLORS.warning     },
          ].map((f, i) => (
            <div key={i} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '10px 12px' }}>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 4 }}>{f.r}</div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: f.color, fontWeight: 600 }}>{f.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TAB 8: DIGITAL ASSET INTELLIGENCE ───────────────────────────────────────

function CryptoTab() {
  const [prices, setPrices] = useState({ BTC: 107240, ETH: 3847, USDC: 1.0000, USDT: 0.9998, PAXG: 2412, XAG: 31.42 })
  const [dirs,   setDirs]   = useState({ BTC: 0, ETH: 0, USDC: 0, USDT: 0, PAXG: 0, XAG: 0 })

  useEffect(() => {
    const id = setInterval(() => {
      setPrices(p => {
        const next = {
          BTC:  parseFloat((p.BTC  * (1 + (Math.random()-0.5)*0.006)).toFixed(0)),
          ETH:  parseFloat((p.ETH  * (1 + (Math.random()-0.5)*0.006)).toFixed(1)),
          USDC: parseFloat((1 + (Math.random()-0.5)*0.0001).toFixed(4)),
          USDT: parseFloat((0.9998 + (Math.random()-0.5)*0.0002).toFixed(4)),
          PAXG: parseFloat((p.PAXG * (1 + (Math.random()-0.5)*0.004)).toFixed(1)),
          XAG:  parseFloat((p.XAG  * (1 + (Math.random()-0.5)*0.004)).toFixed(2)),
        }
        setDirs({ BTC: Math.sign(next.BTC-p.BTC), ETH: Math.sign(next.ETH-p.ETH), USDC: Math.sign(next.USDC-p.USDC), USDT: Math.sign(next.USDT-p.USDT), PAXG: Math.sign(next.PAXG-p.PAXG), XAG: Math.sign(next.XAG-p.XAG) })
        return next
      })
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const arrow = d => d > 0 ? { sym: '▲', color: COLORS.operational } : d < 0 ? { sym: '▼', color: COLORS.critical } : { sym: '◆', color: COLORS.textMuted }

  const nodes = [
    { id:1, cx:80,  cy:60,  st:'clean'       }, { id:2,  cx:200, cy:45,  st:'review'      },
    { id:3, cx:320, cy:70,  st:'clean'        }, { id:4,  cx:140, cy:140, st:'flagged'     },
    { id:5, cx:260, cy:130, st:'clean'        }, { id:6,  cx:380, cy:110, st:'review'      },
    { id:7, cx:60,  cy:220, st:'clean'        }, { id:8,  cx:180, cy:210, st:'blacklisted' },
    { id:9, cx:310, cy:200, st:'clean'        }, { id:10, cx:420, cy:170, st:'review'      },
    { id:11,cx:90,  cy:290, st:'clean'        }, { id:12, cx:240, cy:280, st:'flagged'     },
    { id:13,cx:380, cy:270, st:'clean'        }, { id:14, cx:150, cy:350, st:'clean'       },
    { id:15,cx:330, cy:340, st:'review'       },
  ]
  const edges = [[1,2],[1,4],[2,3],[2,6],[3,5],[4,8],[5,9],[6,10],[7,11],[8,12],[9,13],[10,15],[11,14],[12,15],[4,2],[8,4]]
  const nc = s => s==='clean' ? COLORS.textDim : s==='review' ? COLORS.warning : s==='flagged' ? COLORS.critical : COLORS.blocked
  const gn = id => nodes.find(n => n.id === id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: COLORS.infoBg, border: `1px solid ${COLORS.infoBorder}`, borderLeft: `3px solid ${COLORS.info}`, borderRadius: 4, padding: '10px 14px', fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.info, lineHeight: 1.6 }}>
        <strong>EMERGING DIGITAL ASSET MONITORING FRAMEWORK</strong> · Monitoring: ACTIVE<br />
        Blockchain-based monitoring for blockchain-based assets. FATF R.15 · FSB CBDC Framework · IMF Digital Money Landscape · BIS Working Papers.
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="Digital Asset Market Monitor" subtitle="Live simulated drift · 5-second updates" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
          {Object.entries(prices).map(([sym, price]) => {
            const { sym: arrSym, color } = arrow(dirs[sym] ?? 0)
            return (
              <div key={sym} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 4 }}>{sym}/USD</div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 13, color: COLORS.text, fontWeight: 700 }}>
                  {price >= 100 ? price.toLocaleString() : price.toFixed(4)}
                </div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color }}>{arrSym}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="Samoa Estimated Crypto Activity" subtitle="Derived from remittance data · peer country analysis · Pacific diaspora modelling" />
          {[
            { label: 'Est monthly crypto remittances', value: 'WST 1.2–3.8M',  color: COLORS.warning, note: 'Wide range = data gap'  },
            { label: 'Est Samoa crypto users',         value: '800–2,400',      color: COLORS.warning, note: 'SBS projection'          },
            { label: 'Fiji (% population)',            value: '0.8%',           color: COLORS.info,    note: 'Pacific peer'           },
            { label: 'Tonga (% population)',           value: '1.2%',           color: COLORS.info,    note: 'Pacific peer'           },
            { label: 'PNG (% population)',             value: '0.4%',           color: COLORS.info,    note: 'Pacific peer'           },
            { label: 'VASP registrations Samoa',       value: '0 — no framework',color:COLORS.critical, note: 'FATF R.15 gap'         },
          ].map((item, i) => (
            <div key={i} style={{ padding: '6px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{item.label}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: item.color, fontWeight: 600 }}>{item.value}</span>
              </div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>{item.note}</div>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="AI Graph Wallet Analysis" subtitle="Phase 2 — Monash University AI compliance system" />
          <svg width="100%" viewBox="0 0 480 400" style={{ background: COLORS.surface2, borderRadius: 4, marginBottom: 8 }}>
            {edges.map(([a, b], i) => {
              const na = gn(a), nb = gn(b)
              if (!na || !nb) return null
              return <line key={i} x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy} stroke={COLORS.border2} strokeWidth={1} />
            })}
            {nodes.map(n => (
              <g key={n.id}>
                <circle cx={n.cx} cy={n.cy} r={8} fill={nc(n.st)} opacity={0.85} />
                <text x={n.cx} y={n.cy+20} textAnchor="middle" fontFamily={TYPOGRAPHY.mono} fontSize={7} fill={COLORS.textDim}>
                  {`0x${n.id}f...`}
                </text>
              </g>
            ))}
          </svg>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[['Clean',COLORS.textDim],['Under Review',COLORS.warning],['Flagged',COLORS.critical],['Blacklisted',COLORS.blocked]].map(([lbl,c]) => (
              <span key={lbl} style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: c, display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />{lbl}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="VASP Registry Readiness" subtitle="FATF R.15 · IMF VASP guidance · FSB framework · 4-phase pathway" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            {[
              { phase: 'Phase 1 (Now)',         status: 'ACTIVE',   desc: 'Monitoring infrastructure active',                    color: COLORS.operational },
              { phase: 'Phase 2 (6-12 mo)',     status: 'PLANNED',  desc: 'Domestic data collection, VASP framework design',     color: COLORS.warning     },
              { phase: 'Phase 3 (12-24 mo)',    status: 'CONCEPT',  desc: 'VASP registration, Travel Rule, supervised access',   color: COLORS.info        },
              { phase: 'Phase 4 (24-36 mo)',    status: 'CONCEPT',  desc: 'Full framework, CBS-supervised digital asset market', color: COLORS.blocked     },
            ].map((p, i) => (
              <div key={i} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${p.color}`, borderRadius: 3, padding: '8px 12px', marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: p.color, fontWeight: 600 }}>{p.phase}</span>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: p.color }}>{p.status}</span>
                </div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 8 }}>Pacific peer comparison</div>
            {[
              { country: 'New Zealand', status: 'VASP registration (DIA)',  color: COLORS.operational },
              { country: 'Australia',   status: 'AUSTRAC registration',     color: COLORS.operational },
              { country: 'Fiji',        status: 'FATF assessment pending',  color: COLORS.warning     },
              { country: 'PNG',         status: 'No framework',             color: COLORS.critical    },
              { country: 'Tonga',       status: 'Considering 2026',         color: COLORS.warning     },
              { country: 'Samoa',       status: '0 VASPs — no framework',   color: COLORS.critical    },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.surface2 : 'transparent' }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{v.country}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: v.color }}>{v.status}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.info, lineHeight: 1.5 }}>
              Samoa can be first Pacific SIDS with a comprehensive, blockchain-native VASP framework.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TAB 9: RESERVE STRATEGY ──────────────────────────────────────────────────

function ReserveTab({ canWrite }) {
  const [monthlyAlloc, setMonthlyAlloc] = useState(50000)
  const [timeHorizon, setTimeHorizon]   = useState(10)
  const [allocPct, setAllocPct]         = useState(1)

  const BTC_WST  = 107240 * 2.7312  // BTC price in WST
  const FX_RES   = 847000000        // total FX reserves in WST
  const PAXG_WST = 2412 * 2.7312
  const XAG_WST  = 31.42 * 2.7312

  const dcaResult = useMemo(() => {
    const months  = timeHorizon * 12
    const bearR   = 0
    const baseR   = Math.pow(1.25, 1/12) - 1
    const bullR   = Math.pow(1.55, 1/12) - 1
    let btcB = 0, btcBs = 0, btcBl = 0, cost = 0
    const data = []
    for (let k = 1; k <= months; k++) {
      const pb = BTC_WST * Math.pow(1 + bearR, k)
      const ps = BTC_WST * Math.pow(1 + baseR, k)
      const pl = BTC_WST * Math.pow(1 + bullR, k)
      btcB  += monthlyAlloc / pb
      btcBs += monthlyAlloc / ps
      btcBl += monthlyAlloc / pl
      cost  += monthlyAlloc
      if (k % 12 === 0 || k === months) {
        data.push({
          yr: `Y${Math.round(k/12)}`,
          bear: parseFloat((btcB  * pb  / 1e6).toFixed(2)),
          base: parseFloat((btcBs * ps  / 1e6).toFixed(2)),
          bull: parseFloat((btcBl * pl  / 1e6).toFixed(2)),
          cost: parseFloat((cost       / 1e6).toFixed(2)),
        })
      }
    }
    const finalBear = btcB  * BTC_WST
    const finalBase = btcBs * BTC_WST * Math.pow(1.25, timeHorizon)
    const finalBull = btcBl * BTC_WST * Math.pow(1.55, timeHorizon)
    return { data, btcB, btcBs, btcBl, cost, finalBear, finalBase, finalBull }
  }, [monthlyAlloc, timeHorizon, BTC_WST])

  const strategicAlloc = useMemo(() => {
    const wst = FX_RES * allocPct / 100
    const btc = wst / BTC_WST
    return {
      wst, btc,
      bear5yr: btc * BTC_WST,
      base5yr: btc * BTC_WST * Math.pow(1.25, 5),
      bull5yr: btc * BTC_WST * Math.pow(1.55, 5),
    }
  }, [allocPct, BTC_WST])

  const fmt = (n, dec = 2) => n >= 1e6 ? `WST ${(n/1e6).toFixed(dec)}M` : n >= 1000 ? `WST ${(n/1000).toFixed(1)}K` : `WST ${n.toFixed(0)}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: COLORS.infoBg, border: `1px solid ${COLORS.infoBorder}`, borderLeft: `3px solid ${COLORS.info}`, borderRadius: 4, padding: '10px 14px', fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.info, lineHeight: 1.6 }}>
        <strong>SOVEREIGN DIGITAL ASSET RESERVE STRATEGY</strong><br />
        Forward-looking analysis · Blockchain-enabled monetary sovereignty and economic resilience · No commitment implied — strategic planning tool
      </div>

      {/* Current position */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="Current Digital Reserve Position" subtitle="Phase 1 baseline" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
          {[
            { label: 'BTC Holdings', value: '0 BTC', sub: 'Monitoring: Active', color: COLORS.warning   },
            { label: 'PAXG (Gold)',  value: '0 oz',  sub: 'Framework ready',    color: COLORS.gold      },
            { label: 'Silver (XAG)', value: '0 oz',  sub: 'Emerging protocols', color: COLORS.textMuted },
            { label: 'Energy tokens',value: 'N/A',   sub: 'Concept stage',      color: COLORS.textDim   },
            { label: 'Total FX Res', value: 'WST 847M',sub:'For reference',     color: COLORS.operational},
          ].map((c, i) => (
            <div key={i} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textMuted, marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 13, color: c.color, fontWeight: 700 }}>{c.value}</div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim, marginTop: 2 }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BTC DCA Calculator */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="Bitcoin Accumulation Scenario — DCA Model" subtitle="Dollar Cost Averaging · systematic reserve building" />
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
          <div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 5 }}>
                Monthly allocation: {fmt(monthlyAlloc)}
              </div>
              <input type="range" min={10000} max={500000} step={10000} value={monthlyAlloc}
                onChange={e => setMonthlyAlloc(+e.target.value)}
                disabled={!canWrite('monetary')}
                style={{ width: '100%', accentColor: COLORS.gold }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>
                <span>WST 10K</span><span>WST 500K/mo</span>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 5 }}>Time horizon</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[5,10,15,20].map(y => (
                  <button key={y} onClick={() => setTimeHorizon(y)} style={{
                    flex: 1, padding: '4px 0', cursor: 'pointer',
                    background: timeHorizon === y ? COLORS.gold : COLORS.surface2,
                    color: timeHorizon === y ? COLORS.bg : COLORS.textMuted,
                    border: `1px solid ${COLORS.border}`, borderRadius: 3,
                    fontFamily: TYPOGRAPHY.mono, fontSize: 9,
                  }}>{y}yr</button>
                ))}
              </div>
            </div>
            <div style={{ background: COLORS.surface2, borderRadius: 4, padding: 10, border: `1px solid ${COLORS.border}` }}>
              {[
                { label: 'Total BTC accumulated', value: `${dcaResult.btcBs.toFixed(4)} BTC` },
                { label: 'Total cost basis',      value: fmt(dcaResult.cost) },
                { label: 'Portfolio Bear (0%)',   value: fmt(dcaResult.finalBear) },
                { label: 'Portfolio Base (25%)',  value: fmt(dcaResult.finalBase), highlight: true },
                { label: 'Portfolio Bull (55%)',  value: fmt(dcaResult.finalBull) },
                { label: '% of FX reserves',      value: `${((dcaResult.cost/FX_RES)*100).toFixed(2)}%` },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{r.label}</span>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: r.highlight ? COLORS.gold : COLORS.text, fontWeight: r.highlight ? 700 : 400 }}>{r.value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim, lineHeight: 1.5 }}>
              Next halving: ~April 2028 · CAGR scenarios based on historical 10yr averages.<br />
              El Salvador: ~2,400 BTC · Bhutan: ~13,000 BTC · US Strategic Reserve: 200,000+ BTC
            </div>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dcaResult.data}>
                <XAxis dataKey="yr" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, fill: COLORS.textMuted }} axisLine={false} tickLine={false} unit="M" />
                <Tooltip content={<ChartTip />} />
                <Line type="monotone" dataKey="bear" stroke={COLORS.critical}     strokeWidth={1.5} dot={false} name="Bear (0%)"  />
                <Line type="monotone" dataKey="base" stroke={COLORS.gold}         strokeWidth={2}   dot={false} name="Base (25%)" />
                <Line type="monotone" dataKey="bull" stroke={COLORS.operational}  strokeWidth={1.5} dot={false} name="Bull (55%)" />
                <Line type="monotone" dataKey="cost" stroke={COLORS.textDim}      strokeWidth={1}   dot={false} name="Cost basis" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strategic allocation */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="Bitcoin Strategic Allocation Model" subtitle="One-time allocation from existing FX reserves" />
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
          <div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 5 }}>
              % of FX reserves: {allocPct.toFixed(1)}%
            </div>
            <input type="range" min={0.1} max={5} step={0.1} value={allocPct}
              onChange={e => setAllocPct(+e.target.value)}
              disabled={!canWrite('monetary')}
              style={{ width: '100%', accentColor: COLORS.gold }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim, marginBottom: 10 }}>
              <span>0.1%</span><span>5%</span>
            </div>
            {[
              { label: 'WST allocated',    value: fmt(strategicAlloc.wst)                     },
              { label: 'BTC purchasable',  value: `${strategicAlloc.btc.toFixed(4)} BTC`      },
              { label: '5yr Bear value',   value: fmt(strategicAlloc.bear5yr)                 },
              { label: '5yr Base value',   value: fmt(strategicAlloc.base5yr), highlight: true },
              { label: '5yr Bull value',   value: fmt(strategicAlloc.bull5yr)                 },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{r.label}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: r.highlight ? COLORS.gold : COLORS.text, fontWeight: r.highlight ? 700 : 400 }}>{r.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, background: COLORS.warningBg, border: `1px solid ${COLORS.warningBorder}`, borderRadius: 3, padding: '6px 8px', fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.warning, lineHeight: 1.5 }}>
              High volatility asset. Recommend max 1-2% of reserves in Phase 1. Standard practice for sovereign reserve diversification.
            </div>
          </div>
          <div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 8 }}>PAXGOLD Tokenized Gold Reserve</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Gold spot (PAXG)',  value: `WST ${PAXG_WST.toFixed(2)}/oz`, sub: '1 PAXG = 1 troy oz · Brink\'s vaulted'  },
                { label: 'DeFi APY (Aave)',   value: '2–4%',                          sub: 'Collateral lending yield'                },
                { label: 'WST 5M → Borrow',   value: 'WST 3.75M',                     sub: '75% LTV on Aave'                        },
                { label: 'vs IMF SBA rate',   value: '4.5–5.5%',                      sub: 'With conditionality'                    },
              ].map((c, i) => (
                <div key={i} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '10px 12px' }}>
                  <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textMuted, marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.gold, fontWeight: 600 }}>{c.value}</div>
                  <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>{c.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textMuted, lineHeight: 1.5 }}>
              Silver (XAG): WST {XAG_WST.toFixed(2)}/oz · Tokenized protocols: emerging — review 12-24 months.<br />
              Tokenized oil: No established liquid protocol as of 2026. CBS monitoring energy token market development.<br />
              Samoa annual oil imports: ~WST 180M · 1% oil token reserve = WST 1.8M import hedge capacity.
            </div>
          </div>
        </div>
      </div>

      {/* National Digital Reserve Authority */}
      <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.blockedBorder}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="National Digital Reserve Authority — Concept" subtitle="Blockchain-enabled sovereign wealth infrastructure" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 10 }}>
              Proposed governance: CBS + MOF + Attorney General (3-of-5 multisig)<br />
              Auditor: Independent annual proof-of-reserve + Big 4 audit<br />
              Transparency: On-chain proof of reserves, publicly verifiable<br />
              Legal basis: CBS Act amendment + National Reserve Act (new)
            </div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 6 }}>Funding pathways:</div>
            {[
              '1. % of annual budget surplus',
              '2. Tourism levy (0.5% of receipts ≈ WST 1.56M/yr)',
              '3. Remittance corridor savings via WST-DPI',
              '4. Development partner co-investment (World Bank DRF)',
              '5. Diaspora bond issuance (blockchain-native bonds)',
            ].map((p, i) => (
              <div key={i} style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, padding: '3px 0', borderBottom: `1px solid ${COLORS.border}` }}>{p}</div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 8 }}>Pacific Monetary Settlement Network</div>
            {[
              { label: 'WST-DPI ↔ USDC corridor',    status: 'Phase 2 design', color: COLORS.blocked     },
              { label: 'WST-DPI ↔ USDT corridor',    status: 'Phase 2 design', color: COLORS.blocked     },
              { label: 'WST-DPI ↔ FJD CBDC',         status: 'Phase 3',        color: COLORS.textDim     },
              { label: 'WST-DPI ↔ PGK CBDC',         status: 'Phase 3',        color: COLORS.textDim     },
              { label: 'BIS Project Nexus alignment', status: 'Monitoring',     color: COLORS.info        },
              { label: 'ISO 20022 compatibility',     status: 'Required',       color: COLORS.warning     },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{c.label}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: c.color }}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TAB 10: COMPLIANCE ───────────────────────────────────────────────────────

function ComplianceTab() {
  const pfmi = [
    { p:'P1 Legal basis', v:60 },  { p:'P2 Governance', v:45 },    { p:'P3 Framework', v:55 },
    { p:'P4 Credit risk', v:40 },  { p:'P5 Collateral', v:35 },    { p:'P6 Margin', v:null },
    { p:'P7 Liquidity', v:50 },    { p:'P8 Settlement', v:40 },    { p:'P9 Money', v:55 },
    { p:'P10 Physical', v:45 },    { p:'P11 Legal', v:30 },         { p:'P12 Exchange', v:40 },
    { p:'P13 Rules', v:60 },        { p:'P14 Segregation', v:35 },  { p:'P15 Business', v:20 },
    { p:'P16 Custody', v:40 },      { p:'P17 Ops risk', v:25 },     { p:'P18 Access', v:50 },
    { p:'P19 Tiered', v:45 },       { p:'P20 FMI links', v:35 },    { p:'P21 Efficiency', v:55 },
    { p:'P22 Comms', v:50 },        { p:'P23 Disclosure', v:45 },   { p:'P24 Trade rep', v:null },
  ]

  const pcColor = v => v == null ? COLORS.textDim : v < 30 ? COLORS.critical : v < 50 ? COLORS.warning : COLORS.operational

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* BIS PFMI */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="BIS PFMI — All 24 Principles" subtitle="Principles for Financial Market Infrastructures · Self-assessment 2026" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {pfmi.map((p, i) => (
            <div key={i} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '8px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textMuted }}>{p.p}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: pcColor(p.v), fontWeight: 600 }}>
                  {p.v == null ? 'N/A' : `${p.v}%`}
                </span>
              </div>
              {p.v != null && <ProgressBar value={p.v} />}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 12, fontFamily: TYPOGRAPHY.mono, fontSize: 8 }}>
          <span style={{ color: COLORS.critical }}>■ &lt;30% critical</span>
          <span style={{ color: COLORS.warning  }}>■ 30–50% in progress</span>
          <span style={{ color: COLORS.operational }}>■ &gt;50% on track</span>
        </div>
      </div>

      {/* IMF SDDS + FSI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="IMF SDDS Reporting" subtitle="Special Data Dissemination Standard" />
          {[
            { label: 'National accounts',         freq: 'Quarterly (SBS)',  status: 'COMPLIANT',    color: COLORS.operational },
            { label: 'Government finance',        freq: 'Monthly (MOF)',    status: 'COMPLIANT',    color: COLORS.operational },
            { label: 'Monetary statistics',       freq: 'Monthly (CBS)',    status: 'COMPLIANT',    color: COLORS.operational },
            { label: 'Balance of payments',       freq: 'Quarterly',        status: 'COMPLIANT',    color: COLORS.operational },
            { label: 'External debt',             freq: 'Quarterly',        status: 'MONITOR',      color: COLORS.warning     },
            { label: 'Financial soundness (FSI)', freq: 'Quarterly',        status: 'IN PROGRESS',  color: COLORS.warning     },
          ].map((r, i) => (
            <div key={i} style={{ padding: '6px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{r.label}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: r.color, fontWeight: 600 }}>{r.status}</span>
              </div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>{r.freq}</div>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="Regulatory Calendar" subtitle="Upcoming compliance milestones" />
          {[
            { date: 'Aug 2026',  ev: 'BIS PFMI self-assessment due',          color: COLORS.warning     },
            { date: 'Oct 2026',  ev: 'IMF Article IV consultation',            color: COLORS.info        },
            { date: 'Nov 2026',  ev: 'SWIFT ISO 20022 deadline (Samoa ext.)',  color: COLORS.critical    },
            { date: 'Jan 2027',  ev: 'Basel III Phase 2 implementation',       color: COLORS.warning     },
            { date: 'Mar 2027',  ev: 'PFTAC financial sector TA begins',       color: COLORS.operational },
            { date: 'Oct 2027',  ev: 'FATF mutual evaluation (estimated)',     color: COLORS.critical    },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: item.color, fontWeight: 600, minWidth: 72 }}>{item.date}</span>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{item.ev}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PFTAC */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="PFTAC Engagement" subtitle="Pacific Financial Technical Assistance Centre" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            { prog: 'PFM Reform',           status: 'Active',           color: COLORS.operational },
            { prog: 'Revenue Administration',status: 'Active',          color: COLORS.operational },
            { prog: 'Financial Sector TA',  status: 'Planned Q3 2026',  color: COLORS.info        },
          ].map((p, i) => (
            <div key={i} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '10px 12px' }}>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted, marginBottom: 4 }}>{p.prog}</div>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: p.color, fontWeight: 600 }}>{p.status}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>
          Active TA programmes: 3 · Next review: Q3 2026
        </div>
      </div>
    </div>
  )
}

// ─── TAB 11: SECURITY & PLATFORM ─────────────────────────────────────────────

function SecurityTab({ nodeHealth, roleLevel }) {
  const NODES_TOTAL = 56
  const nodeStatuses = Array.from({ length: NODES_TOTAL }, (_, i) => {
    const r = (i * 7 + 3) % 17
    return r < 1 ? 'offline' : r < 3 ? 'degraded' : r < 5 ? 'syncing' : 'operational'
  })
  const statusColor = s => s === 'operational' ? COLORS.operational : s === 'degraded' ? COLORS.warning : s === 'offline' ? COLORS.critical : COLORS.info

  const contracts = [
    { name: 'NDIDSRegistry',         addr: '0x7f3a...4e1b', status: 'LIVE'    },
    { name: 'MinistryNode (CBS)',     addr: '0x2c8d...9f2a', status: 'LIVE'    },
    { name: 'MinistryNode (MOF)',     addr: '0x4b1e...7c3d', status: 'LIVE'    },
    { name: 'MinistryNode (MCIT)',    addr: '0x8a5f...1e4b', status: 'LIVE'    },
    { name: 'MinistryNode (MCIL)',    addr: '0x3d9b...6a2c', status: 'LIVE'    },
    { name: 'MinistryNode (Customs)', addr: '0x6e2a...4d8f', status: 'LIVE'    },
    { name: 'MinistryNode (Educ.)',   addr: '0x1c7e...3b9d', status: 'LIVE'    },
    { name: 'MinistryNode (SBS)',     addr: '0x9f4a...7c1e', status: 'LIVE'    },
    { name: 'AIDisbursementTracker', addr: '0x5b8d...2f6a', status: 'LIVE'    },
    { name: 'InteroperabilityHub',   addr: '0xa3c1...8e4b', status: 'LIVE'    },
  ]

  const accessLog = Array.from({ length: 15 }, (_, i) => ({
    ts: new Date(Date.now() - i * 180000).toLocaleTimeString('en-US', { hour12: false }),
    level: ['L1','L2','L3','L4','L5'][i % 5],
    tab: ['command','monetary','compliance','banking','security'][i % 5],
    action: ['VIEW','VIEW','EXPORT','VIEW','VIEW'][i % 5],
    result: 'SUCCESS',
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Node health grid */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title={`Node Health Matrix — ${NODES_TOTAL} Nodes`} subtitle="Polygon Amoy testnet · All ministry nodes · Live status" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {nodeStatuses.map((s, i) => (
            <div key={i} title={`Node ${i+1}: ${s}`} style={{
              width: 16, height: 16, borderRadius: 2,
              background: statusColor(s),
              opacity: 0.85,
            }} />
          ))}
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 12, fontFamily: TYPOGRAPHY.mono, fontSize: 8 }}>
          {[['Operational',COLORS.operational],['Degraded',COLORS.warning],['Offline',COLORS.critical],['Syncing',COLORS.info]].map(([lbl,c]) => (
            <span key={lbl} style={{ color: c }}>■ {lbl}</span>
          ))}
        </div>
      </div>

      {/* Smart contract registry */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="Smart Contract Registry" subtitle="Polygon Amoy testnet · All 10 contracts" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
          {contracts.map((c, i) => (
            <div key={i} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.gold }}>{c.name}</div>
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>{c.addr}</div>
              </div>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.operational, padding: '2px 6px', background: COLORS.operationalBg, borderRadius: 3, border: `1px solid ${COLORS.operationalBorder}` }}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Audit log + MFA status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {roleLevel <= 5 && (
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
            <SectionHeader title="Access Audit Log" subtitle="Last 15 events · In-memory · L5 Auditor access" />
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Time','Level','Tab','Action','Result'].map(h => (
                      <th key={h} style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textMuted, padding: '5px 8px', borderBottom: `1px solid ${COLORS.border}`, textTransform: 'uppercase', textAlign: 'left', background: COLORS.surface }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accessLog.map((l, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : COLORS.surface2 }}>
                      <td style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim, padding: '4px 8px', borderBottom: `1px solid ${COLORS.border}` }}>{l.ts}</td>
                      <td style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.gold, padding: '4px 8px', borderBottom: `1px solid ${COLORS.border}` }}>{l.level}</td>
                      <td style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textMuted, padding: '4px 8px', borderBottom: `1px solid ${COLORS.border}` }}>{l.tab}</td>
                      <td style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.info, padding: '4px 8px', borderBottom: `1px solid ${COLORS.border}` }}>{l.action}</td>
                      <td style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.operational, padding: '4px 8px', borderBottom: `1px solid ${COLORS.border}` }}>{l.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
            <SectionHeader title="MFA / HSM Status" subtitle="Phase 2: hardware wallet signing for all L1-L3" />
            {[
              { role: 'CBS-GOVERNOR', hsm: true  },
              { role: 'CBS-DEPUTY',   hsm: true  },
              { role: 'CBS-CFO',      hsm: true  },
              { role: 'CBS-ANALYST',  hsm: false },
              { role: 'CBS-AUDITOR',  hsm: false },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{r.role}</span>
                <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: r.hsm ? COLORS.operational : COLORS.textDim }}>
                  {r.hsm ? '✓ HSM provisioned' : '◆ Software MFA only'}
                </span>
              </div>
            ))}
          </div>

          {roleLevel <= 2 && (
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
              <SectionHeader title="Crisis Protocols" subtitle="L1/L2 Governor access only" />
              {[
                { label: 'Lender of Last Resort (LOLR)', value: 'WST 280M est.', note: 'CBS Governor + Deputy activation' },
                { label: 'Emergency Liquidity Assistance', value: 'CBS Act S.47', note: 'Single bank liquidity crisis trigger' },
                { label: 'Financial Stability Committee', value: 'Never convened', note: 'CBS · MOF · MCIT · AGO' },
              ].map((c, i) => (
                <div key={i} style={{ padding: '6px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{c.label}</span>
                    <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.warning, fontWeight: 600 }}>{c.value}</span>
                  </div>
                  <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim }}>{c.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── TAB 12: PACIFIC & INTERNATIONAL ─────────────────────────────────────────

function PacificTab() {
  const correspondents = [
    { bank: 'ANZ (NZD corridor)',          status: 'ACTIVE',    risk: 'Low',    review: 'Mar 2026', color: COLORS.operational },
    { bank: 'ANZ (USD clearing)',          status: 'ACTIVE',    risk: 'Low',    review: 'Mar 2026', color: COLORS.operational },
    { bank: 'Westpac (AUD)',               status: 'ACTIVE',    risk: 'Low',    review: 'Jan 2026', color: COLORS.operational },
    { bank: 'BSP (PGK)',                   status: 'ACTIVE',    risk: 'Medium', review: 'Nov 2025', color: COLORS.warning     },
    { bank: 'USD Alternate (unnamed)',     status: 'WITHDRAWN', risk: 'CRITICAL',review: '2024',    color: COLORS.critical    },
  ]

  const intlOrgs = [
    { org: 'World Bank',    engagement: 'Active — DPI partnership', color: COLORS.operational },
    { org: 'UNICEF',        engagement: 'Active — Venture Fund 2026 submission', color: COLORS.operational },
    { org: 'ADB',           engagement: 'Pacific SIDS programme', color: COLORS.info          },
    { org: 'PFTAC/IMF',     engagement: 'Technical assistance — 3 programmes', color: COLORS.operational },
    { org: 'PIFS',          engagement: 'Regional coordination', color: COLORS.info           },
    { org: 'BIS',           engagement: 'CPMI monitoring', color: COLORS.info                 },
    { org: 'FATF',          engagement: 'Mutual evaluation Oct 2027', color: COLORS.warning    },
    { org: 'Egmont Group',  engagement: 'FIU member', color: COLORS.operational               },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* De-risking monitor */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader
          title="Correspondent Banking De-Risking Monitor"
          subtitle="Existential risk for Pacific SIDS · World Bank/PIFS tracking · 3 USD correspondents lost in Pacific region 2022-2024"
        />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Correspondent','Status','Risk Level','Last Review'].map(h => (
                <th key={h} style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textMuted, padding: '6px 10px', borderBottom: `1px solid ${COLORS.border}`, textTransform: 'uppercase', textAlign: 'left', background: COLORS.surface }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {correspondents.map((c, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : COLORS.surface2 }}>
                <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{c.bank}</td>
                <td style={{ padding: '8px 10px', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, fontWeight: 600, padding: '2px 6px', borderRadius: 3, background: c.status === 'ACTIVE' ? COLORS.operationalBg : COLORS.criticalBg, color: c.color, border: `1px solid ${c.status === 'ACTIVE' ? COLORS.operationalBorder : COLORS.criticalBorder}` }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: c.color, borderBottom: `1px solid ${COLORS.border}` }}>{c.risk}</td>
                <td style={{ padding: '8px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{c.review}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 10, background: COLORS.infoBg, border: `1px solid ${COLORS.infoBorder}`, borderLeft: `3px solid ${COLORS.info}`, borderRadius: 3, padding: '8px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.info, lineHeight: 1.5 }}>
          WST-DPI Phase 2 note: Digital Tala enables domestic settlement without correspondent banking for domestic transactions.
          Reduces but does not eliminate de-risking exposure for international trade settlement.
        </div>
      </div>

      {/* International organisations */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
        <SectionHeader title="International Organisation Engagement" subtitle="CBS active relationships" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
          {intlOrgs.map((o, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: COLORS.surface2, borderRadius: 3, border: `1px solid ${COLORS.border}` }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.gold, minWidth: 100 }}>{o.org}</span>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: o.color }}>{o.engagement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pacific DPI network */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="Pacific DPI Network" subtitle="NDIDS interoperability · Pacific SIDS" />
          {[
            { country: 'Samoa (DPI)',       status: 'LIVE — Phase 1',      color: COLORS.operational },
            { country: 'Fiji',              status: 'No DPI framework',    color: COLORS.textDim     },
            { country: 'Tonga',             status: 'Exploring',           color: COLORS.warning     },
            { country: 'PNG',               status: 'BSP partner',         color: COLORS.info        },
            { country: 'Vanuatu',           status: 'Monitoring',          color: COLORS.textDim     },
            { country: 'Solomon Islands',   status: 'Monitoring',          color: COLORS.textDim     },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{c.country}</span>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: c.color }}>{c.status}</span>
            </div>
          ))}
        </div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
          <SectionHeader title="Pacific Economic Context" subtitle="PIFS · ADB · World Bank Pacific" />
          {[
            { label: 'Pacific de-risking incidents 2022-24', value: '3 banks', color: COLORS.critical  },
            { label: 'Pacific DPI initiatives active',        value: '1 (Samoa)', color: COLORS.operational },
            { label: 'Pacific CBDC pilots',                  value: '0 live',    color: COLORS.textDim     },
            { label: 'Pacific remittance total (annual)',    value: '~USD 2.8B', color: COLORS.gold         },
            { label: 'SIDS climate vulnerability index',     value: 'EXTREME',   color: COLORS.critical    },
            { label: 'Pacific FATF evaluations pending',     value: '4',         color: COLORS.warning     },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textMuted }}>{item.label}</span>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: item.color, fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function GovernorCommandDashboard({ userRole }) {
  const ROLE_NORM = {'CBS_GOVERNOR':'CBS-GOVERNOR-2026','CBS_ANALYST':'CBS-ANALYST-2026','CBS_AUDITOR':'CBS-AUDITOR-2026','MOF_ADMIN':'CBS-ANALYST-2026','MCIT_ADMIN':'CBS-ANALYST-2026'};
  const role = ROLES[ROLE_NORM[userRole] ?? userRole] || ROLES['CBS-GOVERNOR-2026']
  const visibleTabs = role.tabs === 'all' ? ALL_TABS : ALL_TABS.filter(t => role.tabs.includes(t.id))
  const canWrite   = (action) => role.write.includes(action)
  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id)

  // ── Live shared data ──
  const [fxRates, setFxRates] = useState({ nzd:1.8203, usd:2.7312, aud:1.7845, eur:2.9521, jpy:0.01873, fjd:1.2104 })
  const [ndids, setNdids]             = useState(18421)
  const [blockHeight, setBlockHeight] = useState(39018442)
  const [workflows, setWorkflows]     = useState(127)
  const [activityFeed, setActivityFeed] = useState([])
  const [wstTime, setWstTime]         = useState('')
  const eventIdxRef = useRef(0)

  useEffect(() => {
    // Live clock — WST = UTC+13
    const clockId = setInterval(() => {
      const d = new Date()
      const wst = new Date(d.getTime() + (13 * 60 - d.getTimezoneOffset()) * 60000)
      setWstTime(wst.toLocaleTimeString('en-US', { hour12: false }))
    }, 1000)

    // FX drift every 3 seconds
    const fxId = setInterval(() => {
      setFxRates(r => ({
        nzd: parseFloat((r.nzd * (1 + (Math.random()-0.5)*0.006)).toFixed(4)),
        usd: parseFloat((r.usd * (1 + (Math.random()-0.5)*0.006)).toFixed(4)),
        aud: parseFloat((r.aud * (1 + (Math.random()-0.5)*0.006)).toFixed(4)),
        eur: parseFloat((r.eur * (1 + (Math.random()-0.5)*0.006)).toFixed(4)),
        jpy: parseFloat((r.jpy * (1 + (Math.random()-0.5)*0.006)).toFixed(5)),
        fjd: parseFloat((r.fjd * (1 + (Math.random()-0.5)*0.006)).toFixed(4)),
      }))
    }, 3000)

    // NDIDS +1 at 30% every 8 seconds
    const ndidsId = setInterval(() => {
      if (Math.random() < 0.3) setNdids(n => n + 1)
    }, 8000)

    // Block height +1-3 every 5 seconds
    const blockId = setInterval(() => {
      setBlockHeight(b => b + Math.floor(Math.random() * 3) + 1)
    }, 5000)

    // Activity feed every 2.5 seconds
    const feedId = setInterval(() => {
      const ev = ACTIVITY_EVENTS[eventIdxRef.current % ACTIVITY_EVENTS.length]
      eventIdxRef.current += 1
      const now = new Date()
      setActivityFeed(prev => [
        { ...ev, time: now.toLocaleTimeString('en-US', { hour12: false }) },
        ...prev.slice(0, 19),
      ])
    }, 2500)

    return () => {
      clearInterval(clockId)
      clearInterval(fxId)
      clearInterval(ndidsId)
      clearInterval(blockId)
      clearInterval(feedId)
    }
  }, [])

  const renderTab = () => {
    switch (activeTab) {
      case 'command':    return <CommandTab fxRates={fxRates} ndids={ndids} blockHeight={blockHeight} workflows={workflows} activityFeed={activityFeed} />
      case 'monetary':   return <MonetaryTab fxRates={fxRates} canWrite={canWrite} />
      case 'macro':      return <MacroTab />
      case 'banking':    return <BankingTab />
      case 'payments':   return <PaymentsTab />
      case 'cbdc':       return <CBDCTab canWrite={canWrite} roleLevel={role.level} />
      case 'fcu':        return <FCUTab roleLevel={role.level} />
      case 'crypto':     return <CryptoTab />
      case 'digital':    return <ReserveTab canWrite={canWrite} />
      case 'compliance': return <ComplianceTab />
      case 'security':   return <SecurityTab roleLevel={role.level} />
      case 'pacific':    return <PacificTab />
      default:           return null
    }
  }

  const levelColor = LEVEL_COLORS[role.level] ?? COLORS.textMuted

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, fontFamily: TYPOGRAPHY.sans }}>
      {/* ── Header ── */}
      <div style={{
        background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
        padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: COLORS.flagBlue, color: '#fff', fontFamily: TYPOGRAPHY.mono,
            fontSize: 9, fontWeight: 700, padding: '4px 8px', borderRadius: 3, letterSpacing: '1.5px',
          }}>CBS</div>
          <div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.gold, fontWeight: 700, letterSpacing: '2px' }}>
              CBS GOVERNOR COMMAND CENTRE
            </div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.textDim, marginTop: 1 }}>
              Central Bank of Samoa · Monetary Authority
            </div>
          </div>
        </div>

        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.text, fontWeight: 600 }}>
          {wstTime || '—'} <span style={{ color: COLORS.textDim, fontSize: 9 }}>WST</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {role.hsm && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: COLORS.operationalBg, border: `1px solid ${COLORS.operationalBorder}`, borderRadius: 3, padding: '3px 8px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.operational, display: 'inline-block' }} />
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.operational }}>HSM AUTHENTICATED</span>
            </div>
          )}
          <div style={{ background: levelColor + '22', border: `1px solid ${levelColor}55`, borderRadius: 3, padding: '3px 8px' }}>
            <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: levelColor, fontWeight: 600 }}>L{role.level} — {role.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.operational, display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.operational }}>DPI LIVE</span>
          </div>
          <div style={{ background: COLORS.criticalBg, border: `1px solid ${COLORS.criticalBorder}`, borderRadius: 3, padding: '3px 8px' }}>
            <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 8, color: COLORS.critical, fontWeight: 700 }}>6 GOV ITEMS</span>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        background: COLORS.surface2, borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex', overflowX: 'auto', flexShrink: 0,
        scrollbarWidth: 'thin',
        scrollbarColor: '#363d52 transparent',
        WebkitOverflowScrolling: 'touch',
      }}>
        {visibleTabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              background:   'transparent',
              border:       'none',
              borderBottom: isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              color:        isActive ? COLORS.text : COLORS.textMuted,
              cursor:       'pointer',
              fontFamily:   TYPOGRAPHY.mono,
              fontSize:     11,
              letterSpacing:'0.5px',
              padding:      '10px 12px',
              whiteSpace:   'nowrap',
              transition:   'color 0.1s',
              flexShrink:   0,
            }}>
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, minWidth: 0 }}>
        {renderTab()}
      </div>
    </div>
  )
}
