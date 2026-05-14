import React from 'react'
import { COLORS, TYPOGRAPHY, SEVERITY_COLORS } from '../../theme.js'
import { GOVERNMENT_NODES, OPERATIONAL_NODES } from '@samoa-dpi/contracts-abi'
import { AmountDisplay } from '../currency/AmountDisplay.jsx'
import { SkeletonPanel } from '../shared/SkeletonLoader.jsx'

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

export function OverviewPanel({ nodeHealth, governance, lang = 'EN' }) {
  if (nodeHealth.loading) return <SkeletonPanel rows={6} />

  const { summary } = nodeHealth
  const { pendingCount, critical } = governance

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        color:         COLORS.gold,
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      10,
        letterSpacing: '2px',
      }}>
        {lang === 'SM' ? 'Iloilo Aoao' : 'SYSTEM OVERVIEW'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        <StatCard icon="◎" label={lang === 'SM' ? 'Node Ola' : 'Operational Nodes'}
          value={summary.operational} color={COLORS.operational}
          sub={`of ${summary.total} total`} />
        <StatCard icon="⚠" label={lang === 'SM' ? 'Node Fa\'aletonu' : 'Degraded'}
          value={summary.degraded} color={summary.degraded > 0 ? COLORS.warning : COLORS.textDim} />
        <StatCard icon="✗" label={lang === 'SM' ? 'Node Leai' : 'Offline'}
          value={summary.offline} color={summary.offline > 0 ? COLORS.critical : COLORS.textDim} />
        <StatCard icon="⬡" label={lang === 'SM' ? 'Malo Faigaluega' : 'Gov Entities'}
          value={GOVERNMENT_NODES.length} color={COLORS.info} />
        <StatCard icon="⚖" label={lang === 'SM' ? 'Pulega Faatalitali' : 'Governance Pending'}
          value={pendingCount}
          color={critical.length > 0 ? COLORS.critical : pendingCount > 0 ? COLORS.warning : COLORS.operational}
          sub={critical.length > 0 ? `${critical.length} CRITICAL` : undefined} />
        <StatCard icon="◈" label={lang === 'SM' ? 'Node Fa\'atinoia' : 'Operational Registry'}
          value={OPERATIONAL_NODES.length} color={COLORS.gold} />
      </div>

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
    </div>
  )
}
