import React, { useEffect, useRef } from 'react'
import { C, MONO, SANS } from '../../constants'
import type { CBSGovernanceItem } from '../../types'

const SEV_COLOR: Record<string, string> = {
  CRITICAL: '#ff3b4e',
  HIGH:     '#f0b429',
  MEDIUM:   '#38bdf8',
  LOW:      '#6b7280',
}

interface Props {
  item:      CBSGovernanceItem
  onClose:   () => void
  variant?:  'default' | 'phase2'
}

export function CBSGovernanceModal({ item, onClose, variant = 'default' }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])

  const accentColor = variant === 'phase2' ? C.purple : C.purple
  const sc = SEV_COLOR[item.severity] ?? SEV_COLOR.LOW

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`CBS Governance Item ${item.itemNumber}: ${item.title}`}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      }}
    >
      <div style={{
        background:   C.surface,
        border:       `1px solid ${accentColor}40`,
        borderLeft:   `4px solid ${accentColor}`,
        borderRadius: 8,
        padding:      28,
        maxWidth:     540,
        width:        '100%',
        maxHeight:    '90vh',
        overflowY:    'auto',
        fontFamily:   SANS,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span aria-hidden="true" style={{ color: accentColor, fontSize: 14 }}>⊘</span>
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: accentColor }}>
                {variant === 'phase2' ? 'Phase 2 Feature' : 'Pending CBS Governance Decision'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: MONO, fontSize: 10, background: `${sc}20`, color: sc, border: `1px solid ${sc}40`, padding: '2px 8px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {item.severity}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>
                Item {item.itemNumber} of 6
              </span>
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close governance modal"
            style={{ background: 'none', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontFamily: MONO, fontSize: 11, minHeight: 32 }}
          >
            Close
          </button>
        </div>

        <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginBottom: 16 }}>
          Feature flag: {item.featureFlag} = false
        </div>

        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 18 }}>
          {item.title}
        </div>

        <Section label="What this function does">{item.whatItDoes}</Section>
        <Section label="Why this is pending">{item.whyPending}</Section>

        <div style={{ background: `${C.green}0a`, border: `1px solid ${C.green}25`, borderRadius: 6, padding: '14px', marginBottom: 18 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: C.green, marginBottom: 8 }}>
            When CBS decides — SBP will
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{item.whatHappensWhen}</div>
        </div>

        <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
          Contact: synergyblockchaintf@gmail.com · CBS Meeting: Tuesday 20 May 2026 — 3:30pm
        </div>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#6b7280', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}
