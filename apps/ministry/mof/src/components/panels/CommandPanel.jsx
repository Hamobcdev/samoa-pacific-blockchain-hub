import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer, ReferenceLine,
  CartesianGrid,
} from 'recharts'
import { COLORS, TYPOGRAPHY, ROLES } from '../../theme.js'
import { KPICard } from '../shared/KPICard.jsx'
import { SectionHeader } from '../shared/SectionHeader.jsx'

const BUDGET_MONTHS = [
  { m:'Jul', app:85,  act:38  }, { m:'Aug', app:85,  act:52  },
  { m:'Sep', app:85,  act:61  }, { m:'Oct', app:90,  act:67  },
  { m:'Nov', app:90,  act:71  }, { m:'Dec', app:95,  act:78  },
  { m:'Jan', app:95,  act:72  }, { m:'Feb', app:100, act:80  },
  { m:'Mar', app:100, act:85  }, { m:'Apr', app:110, act:75  },
  { m:'May', app:110, act:68  }, { m:'Jun', app:115, act:72  },
]

const REVENUE_MONTHS = [
  { m:'Jul', target:45, actual:38  }, { m:'Aug', target:45, actual:48  },
  { m:'Sep', target:45, actual:52  }, { m:'Oct', target:48, actual:56  },
  { m:'Nov', target:48, actual:59  }, { m:'Dec', target:52, actual:65  },
  { m:'Jan', target:52, actual:68  }, { m:'Feb', target:55, actual:74  },
  { m:'Mar', target:55, actual:80  }, { m:'Apr', target:60, actual:83  },
  { m:'May', target:60, actual:87  }, { m:'Jun', target:65, actual:92  },
]

const ACTIVITY_EVENTS = [
  { text: 'MOF: Budget execution report anchored — #FA event',  color: COLORS.fiscal   },
  { text: 'AID TRACKER: Grant milestone verified — WST 2.4M',   color: COLORS.govBlue  },
  { text: 'CUSTOMS: Trade revenue posted to MOF node',          color: COLORS.gold     },
  { text: 'STEP: Procurement plan updated — 3 packages',        color: COLORS.info     },
  { text: 'PEFA: P17 Ops risk indicator updated',               color: COLORS.textMuted},
  { text: 'CBS → MOF: RTGS settlement confirmed',               color: COLORS.fiscal   },
  { text: 'OCDS: Contract award published — WST 890K',          color: COLORS.info     },
  { text: 'IMF: GFS quarterly submission due in 14 days',       color: COLORS.warning  },
  { text: 'ADB: SFSRDP disbursement request received',          color: COLORS.gold     },
  { text: 'MOF Oracle: Merkle root anchored — FY close',        color: COLORS.fiscal   },
]

const FISCAL_CALENDAR = [
  { m: 'Jun 2026', ev: 'Mid-year budget review (PFM Act S.23)',    c: COLORS.warning  },
  { m: 'Jul 2026', ev: 'FY 2026/27 budget preparation — MTEF',    c: COLORS.info     },
  { m: 'Aug 2026', ev: 'PEFA self-assessment scheduled',           c: COLORS.govBlue  },
  { m: 'Sep 2026', ev: 'World Bank STEP quarterly review',         c: COLORS.info     },
  { m: 'Oct 2026', ev: 'IMF Article IV consultation',              c: COLORS.warning  },
  { m: 'Nov 2026', ev: 'Auditor-General report — Parliament tabling', c: COLORS.critical },
  { m: 'Dec 2026', ev: 'ADB SFSRDP mid-term review',              c: COLORS.info     },
]

const INTEROP = [
  { src: 'CBS', dst: 'MOF RTGS',       status: 'LIVE',   ok: true  },
  { src: 'CUSTOMS', dst: 'Revenue',    status: 'LIVE',   ok: true  },
  { src: 'AID TRACKER', dst: 'Grants', status: 'LIVE',   ok: true  },
  { src: 'OMW', dst: 'Trade Revenue',  status: 'PHASE 2',ok: false },
  { src: 'OCDS', dst: 'Procurement',   status: 'LIVE',   ok: true  },
  { src: 'ORACLE #FA', dst: 'Sovereign', status: 'LIVE', ok: true  },
]

const ALERTS = [
  { text: 'PEFA P15 Business Risk: critical gap',  sev: 'crit' },
  { text: 'STEP: 3 procurements overdue review',   sev: 'warn' },
  { text: 'IMF Article IV: Oct 2026 consultation', sev: 'info' },
  { text: 'DSA: Debt trajectory within bounds',    sev: 'ok'   },
  { text: 'AG Report: Nov 2026 tabling due',        sev: 'warn' },
]

const REVENUE_PILLS = [
  { label: 'VAGST',    val: 'WST 142M' }, { label: 'Customs',  val: 'WST 89M' },
  { label: 'Other tax',val: 'WST 81M'  }, { label: 'Non-tax',  val: 'WST 42M' },
  { label: 'Grants',   val: 'WST 244M' },
]

function sevStyle(sev) {
  const map = {
    crit: { color: COLORS.critical, bg: COLORS.criticalBg, border: COLORS.criticalBorder },
    warn: { color: COLORS.warning,  bg: COLORS.warningBg,  border: COLORS.warningBorder  },
    info: { color: COLORS.info,     bg: COLORS.infoBg,     border: COLORS.infoBorder     },
    ok:   { color: COLORS.fiscal,   bg: COLORS.fiscalBg,   border: COLORS.fiscalBorder   },
  }
  return map[sev] || map.info
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background:   '#ffffff',
      border:       `1px solid ${COLORS.border}`,
      borderRadius: 4,
      fontFamily:   TYPOGRAPHY.mono,
      fontSize:     12,
      padding:      '8px 12px',
      boxShadow:    '0 2px 8px rgba(26,58,107,0.1)',
    }}>
      <div style={{ color: COLORS.govBlue, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || COLORS.text, marginBottom: 2 }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}M
        </div>
      ))}
    </div>
  )
}

export function CommandPanel({ roleId, lang }) {
  const [onChainEvents, setOnChainEvents] = useState(1247)
  const [feedItems,     setFeedItems]     = useState(ACTIVITY_EVENTS.slice(0, 7))
  const [feedIdx,       setFeedIdx]       = useState(0)

  useEffect(() => {
    const ev = setInterval(() => {
      if (Math.random() > 0.65) setOnChainEvents(n => n + 1)
    }, 25000 + Math.random() * 10000)
    return () => clearInterval(ev)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setFeedIdx(i => {
        const next = (i + 1) % ACTIVITY_EVENTS.length
        setFeedItems(prev => [
          { ...ACTIVITY_EVENTS[next], ts: new Date().toISOString() },
          ...prev.slice(0, 6),
        ])
        return next
      })
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const now = new Date().toLocaleString('en-WS', { timeZone: 'Pacific/Apia' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPI Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <KPICard label="Budget Utilisation" value="68.4%" sub="WST 847M of 1,240M"       color={COLORS.fiscal}  icon="◼" />
        <KPICard label="Revenue YTD"        value="WST 598M" sub="71.2% of target"       color={COLORS.fiscal}  icon="▲" />
        <KPICard label="Fiscal Deficit"     value="−WST 42M" sub="−3.1% of GDP"          color={COLORS.warning} icon="◐" />
        <KPICard label="Debt / GDP"         value="47.8%"   sub="DSA: Sustainable"       color={COLORS.govBlue} icon="◎" />
      </div>

      {/* KPI Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <KPICard label="Aid Disbursed"   value="WST 89M"  sub="14 active projects"        color={COLORS.info}    icon="◈" />
        <KPICard label="Procurement"     value="23 contracts" sub="WST 156M OCDS tracked" color={COLORS.govBlue} icon="◆" />
        <KPICard label="PEFA Average"    value="B+"       sub="18/31 indicators"           color={COLORS.warning} icon="✓" />
        <KPICard label="#FA Events"      value={String(onChainEvents)} sub="Fiscal anchors this FY" color={COLORS.fiscal} icon="#" />
      </div>

      {/* 3-col: Chart | Feed | Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '40% 32% 1fr', gap: 16 }}>

        {/* Budget BarChart */}
        <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
          <SectionHeader title="Budget Execution FY 2025/26" subtitle="WST Millions · Appropriated vs Actual" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BUDGET_MONTHS} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surface3} vertical={false} />
              <XAxis dataKey="m" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
              <YAxis tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
              <ReTooltip content={<ChartTip />} />
              <ReferenceLine y={100} stroke={COLORS.border2} strokeDasharray="3 3" />
              <Bar dataKey="app" name="Appropriated" fill={COLORS.govBlueBg} stroke={COLORS.govBlue} strokeWidth={1} radius={[2,2,0,0]} />
              <Bar dataKey="act" name="Actual"       fill={COLORS.fiscal}   radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live feed */}
        <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
          <SectionHeader title="Live Fiscal Activity" subtitle="Real-time events · DPI Interop" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {feedItems.map((ev, i) => (
              <div key={i} style={{
                display:    'flex',
                alignItems: 'flex-start',
                gap:        8,
                opacity:    1 - i * 0.1,
                animation:  i === 0 ? 'fadeIn 0.4s ease' : undefined,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: ev.color, flexShrink: 0, marginTop: 5 }} />
                <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: i === 0 ? COLORS.text : COLORS.textMuted, lineHeight: 1.45 }}>
                  {ev.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert centre */}
        <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
          <SectionHeader title="Alert Centre" subtitle="Active compliance items" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ALERTS.map((a, i) => {
              const s = sevStyle(a.sev)
              return (
                <div key={i} style={{
                  background:   s.bg,
                  border:       `1px solid ${s.border}`,
                  borderLeft:   `3px solid ${s.color}`,
                  borderRadius: 4,
                  padding:      '8px 10px',
                  fontFamily:   TYPOGRAPHY.mono,
                  fontSize:     11,
                  color:        s.color,
                  lineHeight:   1.45,
                  fontWeight:   600,
                }}>
                  {a.text}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Revenue line chart */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="Revenue Collection YTD — Cumulative" subtitle="WST Millions · Target vs Actual" />
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={REVENUE_MONTHS} margin={{ top: 4, right: 16, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surface3} />
            <XAxis dataKey="m" tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
            <YAxis tick={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fill: COLORS.textMuted }} />
            <ReTooltip content={<ChartTip />} />
            <Line type="monotone" dataKey="target" name="Target" stroke={COLORS.gold}   strokeWidth={2} strokeDasharray="4 2" dot={false} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke={COLORS.fiscal} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {REVENUE_PILLS.map(p => (
            <div key={p.label} style={{
              background:   COLORS.surface,
              border:       `1px solid ${COLORS.border}`,
              borderRadius: 4,
              padding:      '4px 10px',
              fontFamily:   TYPOGRAPHY.mono,
              fontSize:     11,
            }}>
              <span style={{ color: COLORS.textMuted }}>{p.label}: </span>
              <span style={{ color: COLORS.text, fontWeight: 600 }}>{p.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fiscal Calendar */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="Fiscal Calendar" subtitle="Key dates — PFM Act 2001 · IMF · ADB" />
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {FISCAL_CALENDAR.map((ev, i) => (
            <div key={i} style={{
              background:  '#ffffff',
              border:      `1px solid ${COLORS.border}`,
              borderTop:   `3px solid ${ev.c}`,
              borderRadius: 6,
              padding:     '12px 14px',
              minWidth:    160,
              flexShrink:  0,
              boxShadow:   '0 1px 3px rgba(26,58,107,0.05)',
            }}>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: ev.c, marginBottom: 6, fontWeight: 700 }}>{ev.m}</div>
              <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.textMuted, lineHeight: 1.45 }}>{ev.ev}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Ministry Interoperability */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="One Government Interoperability Status" subtitle="InteroperabilityHub · Real-time fiscal data flows" />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          {INTEROP.map((io, i) => (
            <div key={i} style={{
              background:   io.ok ? COLORS.fiscalBg : COLORS.blockedBg,
              border:       `1px solid ${io.ok ? COLORS.fiscalBorder : COLORS.blockedBorder}`,
              borderRadius: 6,
              padding:      '10px 14px',
              minWidth:     140,
            }}>
              <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>
                {io.src} <span style={{ color: COLORS.textDim }}>→</span> {io.dst}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {io.ok && <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.fiscal, animation: 'pulse 2s infinite' }} />}
                <span style={{
                  fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700,
                  color: io.ok ? COLORS.fiscal : COLORS.blocked,
                }}>
                  {io.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, lineHeight: 1.7 }}>
          Hub: 0xB4D3D4Ac59f0976Ee6b5A7d118df955c8E075bfd ·
          MOF: 0xEcd8Af2929FaDC86aA5Bb85E05C95695df39F0Cf ·
          AID: 0xbD7E00ECeE7A8d45D4720B54BbfD3295CF63455C
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, textAlign: 'center', lineHeight: 1.9, padding: '8px 0 4px', borderTop: `1px solid ${COLORS.border}` }}>
        Data: Simulated · Phase 1 Research Environment ·
        PFM Act 2001 · PEFA 2016 · GFSM 2014 · OCDS 1.1.5 ·
        UNCTAD 2029 · FY 2025/26 · {now}
      </div>
    </div>
  )
}
