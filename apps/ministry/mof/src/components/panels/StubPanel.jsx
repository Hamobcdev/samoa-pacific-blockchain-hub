import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { KPICard } from '../shared/KPICard.jsx'

export function StubPanel({ title, standard, sprint, onChain, kpis, note }) {
  const defaultKpis = kpis || [
    { label: 'KPI 1', value: '—', sub: 'Phase 2' },
    { label: 'KPI 2', value: '—', sub: 'Phase 2' },
    { label: 'KPI 3', value: '—', sub: 'Phase 2' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{
        background:    COLORS.surface,
        border:        `1px solid ${COLORS.border}`,
        borderLeft:    `4px solid ${COLORS.blocked}`,
        borderRadius:  8,
        padding:       '20px 24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 4 }}>
              {title}
            </div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, marginBottom: 6 }}>
              {standard}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{
              background:    COLORS.blockedBg,
              border:        `1px solid ${COLORS.blockedBorder}`,
              borderRadius:  4,
              color:         COLORS.blocked,
              fontFamily:    TYPOGRAPHY.mono,
              fontSize:      11,
              letterSpacing: '1px',
              padding:       '3px 10px',
            }}>
              PHASE 2
            </span>
            {sprint && (
              <span style={{
                background:    COLORS.surface2,
                border:        `1px solid ${COLORS.border}`,
                borderRadius:  4,
                color:         COLORS.textMuted,
                fontFamily:    TYPOGRAPHY.mono,
                fontSize:      11,
                letterSpacing: '0.5px',
                padding:       '3px 10px',
              }}>
                Sprint {sprint}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Placeholder KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {defaultKpis.map((k, i) => (
          <KPICard key={i} label={k.label} value={k.value || '—'} sub={k.sub || 'Phase 2'} color={COLORS.textDim} dashed />
        ))}
      </div>

      {/* Centre message */}
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        minHeight:      200,
        gap:            12,
        opacity:        0.7,
      }}>
        <div style={{
          background:    COLORS.blockedBg,
          border:        `1px dashed ${COLORS.blockedBorder}`,
          borderRadius:  8,
          padding:       '28px 40px',
          textAlign:     'center',
          maxWidth:      480,
        }}>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.blocked, letterSpacing: '2px', marginBottom: 10 }}>
            PHASE 2 — PENDING MOF ENGAGEMENT
          </div>
          <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.65, marginBottom: 12 }}>
            This panel will be activated upon direct engagement with the Ministry of Finance
            and integration with live fiscal data systems.
          </div>
          {onChain && (
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim }}>
              On-chain: {onChain}
            </div>
          )}
          {note && (
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, marginTop: 6 }}>
              {note}
            </div>
          )}
        </div>
      </div>

      <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, textAlign: 'center' }}>
        Phase 1 Research Environment · NUS / ISOC Foundation Research Programme 2026
      </div>
    </div>
  )
}
