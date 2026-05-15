import React, { useRef, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts'
import { COLORS, TYPOGRAPHY, SEVERITY_COLORS } from '../../theme.js'
import { GOVERNMENT_NODES, OPERATIONAL_NODES } from '@samoa-dpi/contracts-abi'
import { SkeletonPanel } from '../shared/SkeletonLoader.jsx'
import { ResearchLabel } from '../shared/ResearchLabel.jsx'

const MAX_HISTORY = 20

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background:   COLORS.surface2,
      border:       `1px solid ${COLORS.border}`,
      borderRadius: 6,
      padding:      '16px 20px',
      display:      'flex',
      flexDirection: 'column',
      gap:          4,
    }}>
      <div style={{ color: COLORS.textMuted, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span aria-hidden="true">{icon}</span> {label}
      </div>
      <div style={{ color: color ?? COLORS.text, fontFamily: TYPOGRAPHY.mono, fontSize: 24, fontWeight: 700 }}>
        {value}
      </div>
      {sub && <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 10 }}>{sub}</div>}
    </div>
  )
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '6px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 10 }}>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

export function OverviewPanel({ nodeHealth, governance, lang = 'EN' }) {
  const historyRef = useRef([])

  useEffect(() => {
    if (!nodeHealth.loading && nodeHealth.summary.total > 0) {
      const { operational, degraded, offline } = nodeHealth.summary
      historyRef.current = [
        ...historyRef.current.slice(-(MAX_HISTORY - 1)),
        { t: historyRef.current.length, operational, degraded, offline },
      ]
    }
  }, [nodeHealth.summary, nodeHealth.loading])

  if (nodeHealth.loading) return <SkeletonPanel rows={6} />

  const { summary } = nodeHealth
  const { pendingCount, critical } = governance
  const history = historyRef.current

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} data-panel>
      <div
        data-panel-heading
        style={{ color: COLORS.gold, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '2px' }}
      >
        {lang === 'SM' ? 'Iloilo Aoao' : 'SYSTEM OVERVIEW'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        <StatCard icon="◎" label={lang === 'SM' ? 'Node Ola' : 'Operational Nodes'}
          value={summary.operational} color={COLORS.operational}
          sub={`of ${summary.total} total`} />
        <StatCard icon="⚠" label={lang === 'SM' ? "Node Fa'aletonu" : 'Degraded'}
          value={summary.degraded} color={summary.degraded > 0 ? COLORS.warning : COLORS.textDim} />
        <StatCard icon="✗" label={lang === 'SM' ? 'Node Leai' : 'Offline'}
          value={summary.offline} color={summary.offline > 0 ? COLORS.critical : COLORS.textDim} />
        <StatCard icon="⬡" label={lang === 'SM' ? 'Malo Faigaluega' : 'Gov Entities'}
          value={GOVERNMENT_NODES.length} color={COLORS.info} />
        <StatCard icon="⚖" label={lang === 'SM' ? 'Pulega Faatalitali' : 'Governance Pending'}
          value={pendingCount}
          color={critical.length > 0 ? COLORS.critical : pendingCount > 0 ? COLORS.warning : COLORS.operational}
          sub={critical.length > 0 ? `${critical.length} CRITICAL` : undefined} />
        <StatCard icon="◈" label={lang === 'SM' ? "Node Fa'atinoia" : 'Operational Registry'}
          value={OPERATIONAL_NODES.length} color={COLORS.gold} />
      </div>

      {/* Node health trend — last 20 polls (~240s) */}
      {history.length >= 2 && (
        <div style={{ position: 'relative' }}>
          <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9, letterSpacing: '1px', marginBottom: 6 }}>
            {lang === 'SM' ? 'TALA O NODE (20 SIAKI)' : 'NODE HEALTH TREND (LAST 20 POLLS)'}
          </div>

          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={history} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, summary.total]} tick={{ fontSize: 9, fill: COLORS.textDim, fontFamily: TYPOGRAPHY.mono }} />
              <ReTooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="operational" name="Operational" stroke={COLORS.operational} dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="degraded"    name="Degraded"    stroke={COLORS.warning}     dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="offline"     name="Offline"     stroke={COLORS.critical}    dot={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>

          {/* Screen-reader accessible table — visually hidden */}
          <table aria-hidden="false" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            <caption>{lang === 'SM' ? 'Tala o node' : 'Node health history'}</caption>
            <thead><tr><th>Poll</th><th>Operational</th><th>Degraded</th><th>Offline</th></tr></thead>
            <tbody>
              {history.map((row, i) => (
                <tr key={i}><td>{i + 1}</td><td>{row.operational}</td><td>{row.degraded}</td><td>{row.offline}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {critical.length > 0 && (
        <div style={{
          background:   SEVERITY_COLORS.CRITICAL.bg,
          border:       `1px solid ${SEVERITY_COLORS.CRITICAL.border}`,
          borderRadius: 6,
          padding:      '14px 18px',
          display:      'flex',
          alignItems:   'flex-start',
          gap:          12,
        }}>
          <span aria-hidden="true" style={{ color: COLORS.critical, fontSize: 16, flexShrink: 0 }}>✗</span>
          <div>
            <div style={{ color: COLORS.critical, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '1.5px', marginBottom: 4 }}>
              PHASE 2 BLOCKED — CRITICAL GOVERNANCE REQUIRED
            </div>
            {critical.map(item => (
              <div key={item.id} style={{ color: COLORS.text, fontSize: 13, marginBottom: 2 }}>
                {item.title}
              </div>
            ))}
          </div>
        </div>
      )}

      <ResearchLabel />
    </div>
  )
}
