import React, { useState } from 'react'
import { COLORS, TYPOGRAPHY, SEVERITY_COLORS } from '../../theme.js'
import { ResearchLabel } from '../shared/ResearchLabel.jsx'
import { FeatureGate } from '@samoa-dpi/shared-ui'
import CBSGovernanceGate from '../CBSGovernanceGate.jsx'

const SEVERITY_ICON = { CRITICAL: '✗', HIGH: '!', MEDIUM: '~', LOW: 'ℹ' }

const SEVERITY_COLOR = {
  CRITICAL: '#ff3b4e',
  HIGH:     '#f0b429',
  MEDIUM:   '#38bdf8',
  LOW:      '#6b7280',
}

// ─── GovernanceCard — existing detailed card ──────────────────────────────────

function GovernanceCard({ item, lang, onView }) {
  const sc = SEVERITY_COLORS[item.severity] ?? SEVERITY_COLORS.LOW
  const icon = SEVERITY_ICON[item.severity] ?? 'ℹ'

  return (
    <div style={{
      background:    item.resolved ? COLORS.surface2 : sc.bg,
      border:        `1px solid ${item.resolved ? COLORS.border : sc.border}`,
      borderRadius:  6,
      padding:       '16px 18px',
      display:       'flex',
      flexDirection: 'column',
      gap:           8,
      opacity:       item.resolved ? 0.6 : 1,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {item.resolved && (
            <span style={{ color: COLORS.operational, fontFamily: TYPOGRAPHY.mono, fontSize: 9, letterSpacing: '1px' }}>
              ✓ RESOLVED
            </span>
          )}
          {!item.resolved && onView && (
            <button
              onClick={() => onView(item)}
              style={{
                background:  'none',
                border:      `1px solid rgba(139,92,246,0.4)`,
                color:       '#8b5cf6',
                borderRadius:'4px',
                padding:     '3px 10px',
                cursor:      'pointer',
                fontFamily:  TYPOGRAPHY.mono,
                fontSize:    10,
                letterSpacing:'0.5px',
              }}
            >
              View details →
            </button>
          )}
        </div>
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

      {(item.technicalStatus || item.awaitingCBS) && (
        <div style={{
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      '10px',
          marginTop:     '6px',
          display:       'flex',
          flexDirection: 'column',
          gap:           '3px',
        }}>
          {item.technicalStatus && (
            <span style={{ color: COLORS.operational }}>
              ✓ Technical: {item.technicalStatus}
            </span>
          )}
          {item.awaitingCBS && (
            <span style={{ color: COLORS.blocked }}>
              ⊘ Awaiting CBS: {item.awaitingCBS}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Summary row in the at-a-glance panel ────────────────────────────────────

function SummaryRow({ item, onView }) {
  const sc = SEVERITY_COLOR[item.severity] ?? SEVERITY_COLOR.LOW
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => onView(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:         '100%',
        background:    hovered ? 'rgba(139,92,246,0.06)' : 'transparent',
        border:        'none',
        borderBottom:  `1px solid ${COLORS.border}`,
        borderRadius:  0,
        padding:       '10px 14px',
        display:       'flex',
        alignItems:    'center',
        gap:           12,
        cursor:        'pointer',
        textAlign:     'left',
        transition:    'background 0.15s',
      }}
    >
      <span style={{
        fontFamily:  TYPOGRAPHY.mono,
        fontSize:    10,
        color:       COLORS.textDim,
        minWidth:    18,
      }}>
        {item.itemNumber ?? '·'}
      </span>

      <span style={{
        fontFamily: TYPOGRAPHY.sans,
        fontSize:   13,
        fontWeight: 500,
        color:      COLORS.text,
        flex:       1,
        textAlign:  'left',
      }}>
        {item.title}
      </span>

      <span style={{
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      9,
        background:    `${sc}18`,
        color:         sc,
        border:        `1px solid ${sc}35`,
        padding:       '2px 7px',
        borderRadius:  3,
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        flexShrink:    0,
      }}>
        {item.severity}
      </span>

      <span style={{
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      9,
        color:         '#8b5cf6',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        flexShrink:    0,
      }}>
        ⊘ Pending
      </span>

      <span style={{ color: '#8b5cf6', fontSize: 12, flexShrink: 0 }}>→</span>
    </button>
  )
}

// ─── Main panel ──────────────────────────────────────────────────────────────

export function CBSGovernancePanel({ governance, lang = 'EN' }) {
  const { items, pendingCount, critical } = governance
  const [activeItem, setActiveItem] = useState(null)

  const pending = items.filter(i => !i.resolved)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} data-panel>

      {/* Panel heading */}
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
            {lang === 'SM' ? 'Tukuina / Lolomi' : 'Export / Print'}
          </button>
        </div>
      </div>

      {/* CRITICAL alert banner */}
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

      {/* ── Summary panel ── */}
      {pending.length > 0 && (
        <div style={{
          background:   COLORS.surface2,
          border:       '1px solid rgba(139,92,246,0.25)',
          borderLeft:   '3px solid #8b5cf6',
          borderRadius: 8,
          overflow:     'hidden',
        }}>
          {/* Summary header */}
          <div style={{
            padding:      '14px 16px',
            borderBottom: `1px solid ${COLORS.border}`,
            display:      'flex',
            alignItems:   'center',
            justifyContent:'space-between',
          }}>
            <div>
              <div style={{
                fontFamily:    TYPOGRAPHY.mono,
                fontSize:      11,
                fontWeight:    700,
                color:         '#8b5cf6',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom:  4,
              }}>
                {pending.length} Governance Decisions Pending
              </div>
              <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.textMuted }}>
                All technical implementations complete — awaiting CBS policy answers
              </div>
            </div>
          </div>

          {/* Clickable rows */}
          <div>
            {pending.map(item => (
              <SummaryRow key={item.id} item={item} onView={setActiveItem} />
            ))}
          </div>

          {/* Meeting note */}
          <div style={{
            padding:    '10px 16px',
            borderTop:  `1px solid ${COLORS.border}`,
            fontFamily: TYPOGRAPHY.mono,
            fontSize:   9,
            color:      COLORS.textDim,
            lineHeight: 1.7,
          }}>
            Contact: synergyblockchaintf@gmail.com<br />
            CBS Meeting: Tuesday 20 May 2026 — 3:30pm
          </div>
        </div>
      )}

      {/* Detailed cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <GovernanceCard key={item.id} item={item} lang={lang} onView={setActiveItem} />
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

      <FeatureGate flag="MULTISIG_ACTIVE">
        <div style={{
          background:    COLORS.surface2,
          border:        `1px solid ${COLORS.border2}`,
          borderRadius:  6,
          padding:       '16px 18px',
          display:       'flex',
          flexDirection: 'column',
          gap:           8,
        }}>
          <div style={{ color: COLORS.gold, fontFamily: TYPOGRAPHY.mono, fontSize: 9, letterSpacing: '2px' }}>
            MULTISIG GOVERNANCE — PHASE 2
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 12, fontFamily: TYPOGRAPHY.sans }}>
            {lang === 'SM'
              ? 'E manaʻomia le talia e le au pule e lua pe sili atu.'
              : 'Requires approval from two or more authorised signatories.'}
          </div>
        </div>
      </FeatureGate>

      <ResearchLabel />

      {/* Governance gate popup */}
      {activeItem && (
        <CBSGovernanceGate
          itemNumber={activeItem.itemNumber ?? '·'}
          featureFlag={activeItem.featureFlag ?? ''}
          title={activeItem.title}
          whatItDoes={activeItem.whatItDoes ?? activeItem.description}
          whyPending={activeItem.whyPending ?? activeItem.awaitingCBS}
          whatHappensWhen={activeItem.whatHappensWhen ?? activeItem.unlocks}
          severity={activeItem.severity}
          onClose={() => setActiveItem(null)}
        />
      )}
    </div>
  )
}
