import React, { useState } from 'react'
import { COLORS, TYPOGRAPHY, SEVERITY_COLORS } from '../../theme.js'
import { ResearchLabel } from '../shared/ResearchLabel.jsx'

const SEVERITY_ICON = { CRITICAL: '✗', HIGH: '!', MEDIUM: '~', LOW: 'ℹ' }

function GovernanceCard({ item, lang, onView }) {
  const sc = SEVERITY_COLORS[item.severity] ?? SEVERITY_COLORS.LOW
  const icon = SEVERITY_ICON[item.severity] ?? 'ℹ'

  return (
    <div style={{
      background:   item.resolved ? COLORS.surface2 : sc.bg,
      border:       `1px solid ${item.resolved ? COLORS.border : sc.border}`,
      borderRadius: 6,
      padding:      '16px 18px',
      display:      'flex',
      flexDirection: 'column',
      gap:          8,
      opacity:      item.resolved ? 0.6 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            aria-label={`Severity: ${item.severity}`}
            style={{
              color:         sc.text,
              fontFamily:    TYPOGRAPHY.mono,
              fontSize:      10,
              letterSpacing: '1.5px',
              display:       'flex',
              alignItems:    'center',
              gap:           4,
            }}
          >
            <span aria-hidden="true">{icon}</span> {item.severity}
          </span>
          <span style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9 }}>{item.id}</span>
        </div>
        {item.resolved && (
          <span style={{ color: COLORS.operational, fontFamily: TYPOGRAPHY.mono, fontSize: 9, letterSpacing: '1px' }}>
            ✓ RESOLVED
          </span>
        )}
      </div>

      <div style={{ color: COLORS.text, fontFamily: TYPOGRAPHY.sans, fontSize: 14, fontWeight: 600 }}>
        {item.title}
      </div>

      <div style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.55 }}>
        {item.description}
      </div>

      <div style={{
        background:   COLORS.surface3,
        border:       `1px solid ${COLORS.border}`,
        borderRadius: 4,
        padding:      '8px 12px',
      }}>
        <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9, letterSpacing: '1px', marginBottom: 4 }}>
          {lang === 'SM' ? 'FESILI' : 'QUESTION FOR CBS'}
        </div>
        <div style={{ color: COLORS.text, fontSize: 12, fontStyle: 'italic' }}>{item.question}</div>
      </div>

      <div style={{ color: COLORS.info, fontSize: 11, fontFamily: TYPOGRAPHY.mono }}>
        ↳ {item.unlocks}
      </div>
    </div>
  )
}

export function CBSGovernancePanel({ governance, lang = 'EN' }) {
  const { items, pendingCount, critical } = governance

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} data-panel>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div data-panel-heading style={{ color: COLORS.gold, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '2px' }}>
          {lang === 'SM' ? 'PULEGA O LE CBS' : 'CBS GOVERNANCE DECISIONS'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: COLORS.textMuted, fontFamily: TYPOGRAPHY.mono, fontSize: 10 }}>
            {pendingCount} {lang === 'SM' ? 'faatalitali' : 'pending'} · {items.length - pendingCount} {lang === 'SM' ? "fa'amaeaina" : 'resolved'}
          </span>
          <button
            onClick={() => window.print()}
            data-print-hide
            aria-label="Print or export this panel"
            style={{
              fontFamily:   TYPOGRAPHY.mono,
              fontSize:     '11px',
              color:        COLORS.textMuted,
              background:   'none',
              border:       `1px solid ${COLORS.border}`,
              padding:      '4px 10px',
              borderRadius: '4px',
              cursor:       'pointer',
            }}
          >
            Export / Print
          </button>
        </div>
      </div>

      {critical.length > 0 && (
        <div style={{
          background:    SEVERITY_COLORS.CRITICAL.bg,
          border:        `1px solid ${SEVERITY_COLORS.CRITICAL.border}`,
          borderRadius:  5,
          color:         COLORS.critical,
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      10,
          letterSpacing: '1.5px',
          padding:       '10px 14px',
          display:       'flex',
          alignItems:    'center',
          gap:           8,
        }}>
          <span aria-hidden="true">✗</span>
          {lang === 'SM'
            ? `${critical.length} TULAGA TAUA — E LE'I AMATAINA VAEGA 2`
            : `${critical.length} CRITICAL ITEM(S) — PHASE 2 LAUNCH BLOCKED`}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <GovernanceCard key={item.id} item={item} lang={lang} />
        ))}
      </div>

      <div style={{
        color:         COLORS.textDim,
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      9,
        letterSpacing: '0.8px',
        paddingTop:    8,
        borderTop:     `1px solid ${COLORS.border}`,
      }}>
        {lang === 'SM'
          ? "Ia fa'afou e le CBS. E le'i fa'atonutonuina se tasi."
          : "Constitutional source — all items pending CBS confirmation. Do not add, remove, or reorder without explicit CBS instruction."}
      </div>

      <ResearchLabel />
    </div>
  )
}
