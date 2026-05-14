import React from 'react'
import { COLORS, TYPOGRAPHY, NODE_STATUS } from '../../theme.js'
import { SkeletonPanel } from '../shared/SkeletonLoader.jsx'
import { TimestampDisplay } from '../currency/TimestampDisplay.jsx'

function NodeRow({ node, lang }) {
  const s = NODE_STATUS[node.status] ?? NODE_STATUS.OFFLINE

  return (
    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <td style={{ padding: '9px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.gold, whiteSpace: 'nowrap' }}>
        {node.code}
      </td>
      <td style={{ padding: '9px 12px', fontSize: 12, color: COLORS.text, maxWidth: 200 }}>
        {node.name}
      </td>
      <td style={{ padding: '9px 12px' }}>
        <span
          role="status"
          aria-label={`Node ${node.code}: ${lang === 'SM' ? s.labelSM : s.label}`}
          style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          5,
            color:        s.color,
            fontFamily:   TYPOGRAPHY.mono,
            fontSize:     10,
            letterSpacing: '0.5px',
            whiteSpace:   'nowrap',
          }}
        >
          <span aria-hidden="true">{s.icon}</span>
          {lang === 'SM' ? s.labelSM : s.label}
        </span>
      </td>
      <td style={{ padding: '9px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, textAlign: 'right' }}>
        {node.latencyMs}ms
      </td>
      <td style={{ padding: '9px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textDim, textAlign: 'right' }}>
        {node.peers}
      </td>
      <td style={{ padding: '9px 12px', textAlign: 'right' }}>
        <TimestampDisplay timestamp={node.lastSeen} format="datetime" compact />
      </td>
    </tr>
  )
}

export function NodeHealthMatrix({ nodeHealth, lang = 'EN' }) {
  if (nodeHealth.loading) return <SkeletonPanel rows={8} />

  const { nodes, summary, lastPoll } = nodeHealth

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ color: COLORS.gold, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '2px' }}>
          {lang === 'SM' ? 'SOIFUA O NODE' : 'NODE HEALTH MATRIX'}
        </div>
        <div style={{ display: 'flex', gap: 12, fontFamily: TYPOGRAPHY.mono, fontSize: 10 }}>
          <span style={{ color: COLORS.operational }}>✓ {summary.operational}</span>
          <span style={{ color: summary.degraded > 0 ? COLORS.warning : COLORS.textDim }}>⚠ {summary.degraded}</span>
          <span style={{ color: summary.offline > 0 ? COLORS.critical : COLORS.textDim }}>✗ {summary.offline}</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: TYPOGRAPHY.sans }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${COLORS.border2}` }}>
              {['Code', lang === 'SM' ? 'Igoa' : 'Name', lang === 'SM' ? 'Tulaga' : 'Status', 'Latency', 'Peers', lang === 'SM' ? 'Vaai Mulimuli' : 'Last Seen'].map(h => (
                <th key={h} style={{
                  color:         COLORS.textDim,
                  fontFamily:    TYPOGRAPHY.mono,
                  fontSize:      9,
                  letterSpacing: '1px',
                  padding:       '6px 12px',
                  textAlign:     h === 'Code' || h === 'Igoa' || h === lang === 'SM' ? 'Igoa' : 'Name' ? 'left' : 'right',
                  whiteSpace:    'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nodes.map(node => (
              <NodeRow key={node.code} node={node} lang={lang} />
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9, textAlign: 'right' }}>
        {lang === 'SM' ? 'Siaki 12s' : 'Polled every 12s'} · <TimestampDisplay timestamp={lastPoll} compact />
      </div>
    </div>
  )
}
