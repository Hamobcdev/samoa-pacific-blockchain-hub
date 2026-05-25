import React, { useEffect } from 'react'

const SEVERITY_COLOR = {
  CRITICAL: '#ff3b4e',
  HIGH:     '#f0b429',
  MEDIUM:   '#38bdf8',
  LOW:      '#6b7280',
}

export default function CBSGovernanceGate({
  itemNumber,
  featureFlag,
  title,
  whatItDoes,
  whyPending,
  whatHappensWhen,
  severity = 'HIGH',
  onClose,
  role = 'CBS Officer',
}) {
  useEffect(() => {
    console.log(`CBS Governance Item ${itemNumber} viewed by ${role} at ${new Date().toISOString()}`)
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const sc = SEVERITY_COLOR[severity] ?? SEVERITY_COLOR.LOW

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`CBS Governance Item ${itemNumber}: ${title}`}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px',
      }}
    >
      <div style={{
        background:   '#0c1222',
        border:       '1px solid rgba(139,92,246,0.4)',
        borderLeft:   '4px solid #8b5cf6',
        borderRadius: '8px',
        padding:      '28px',
        maxWidth:     '540px',
        width:        '100%',
        maxHeight:    '90vh',
        overflowY:    'auto',
        fontFamily:   'IBM Plex Sans, sans-serif',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ color: '#8b5cf6', fontSize: '14px' }}>⊘</span>
              <span style={{
                fontFamily:    'IBM Plex Mono, monospace',
                fontSize:      '11px', fontWeight: '700',
                textTransform: 'uppercase', letterSpacing: '1.2px',
                color:         '#8b5cf6',
              }}>
                Pending CBS Governance Decision
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{
                fontFamily:    'IBM Plex Mono, monospace',
                fontSize:      '10px',
                background:    `${sc}20`,
                color:         sc,
                border:        `1px solid ${sc}40`,
                padding:       '2px 8px', borderRadius: '3px',
                textTransform: 'uppercase', letterSpacing: '0.8px',
              }}>{severity}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: '#6b7280' }}>
                Item {itemNumber} of 6
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background:  'none',
              border:      '1px solid #2a2f3e',
              color:       '#6b7280',
              borderRadius:'4px',
              padding:     '4px 12px',
              cursor:      'pointer',
              fontFamily:  'IBM Plex Mono, monospace',
              fontSize:    '11px',
              minHeight:   '32px',
            }}
          >
            Close
          </button>
        </div>

        {/* Feature flag */}
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize:   '10px', color: '#4a5568',
          marginBottom: '16px',
        }}>
          Feature flag: {featureFlag} = false
        </div>

        {/* Title */}
        <div style={{ fontSize: '15px', fontWeight: '600', color: '#e2e6f0', marginBottom: '18px' }}>
          {title}
        </div>

        {/* What it does */}
        <Section label="What this function does" color="#9ca3af">
          {whatItDoes}
        </Section>

        {/* Why pending */}
        <Section label="Why this is pending" color="#9ca3af">
          {whyPending}
        </Section>

        {/* What happens when resolved */}
        <div style={{
          background:   'rgba(0,200,150,0.05)',
          border:       '1px solid rgba(0,200,150,0.15)',
          borderRadius: '6px',
          padding:      '14px',
          marginBottom: '18px',
        }}>
          <div style={{
            fontFamily:    'IBM Plex Mono, monospace',
            fontSize:      '10px', fontWeight: '600',
            textTransform: 'uppercase', letterSpacing: '1px',
            color:         '#00c896', marginBottom: '8px',
          }}>
            When CBS decides — SBP will
          </div>
          <div style={{ fontSize: '13px', color: '#b0b8cc', lineHeight: '1.65' }}>
            {whatHappensWhen}
          </div>
        </div>

        {/* Contact */}
        <div style={{
          fontFamily:  'IBM Plex Mono, monospace',
          fontSize:    '11px', color: '#4a5568',
          borderTop:   '1px solid #1b2540',
          paddingTop:  '12px',
        }}>
          Contact: synergyblockchaintf@gmail.com ·{' '}
          CBS Meeting: Tuesday 20 May 2026 — 3:30pm
        </div>
      </div>
    </div>
  )
}

function Section({ label, color, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        fontFamily:    'IBM Plex Mono, monospace',
        fontSize:      '10px', fontWeight: '600',
        textTransform: 'uppercase', letterSpacing: '1px',
        color:         '#6b7280', marginBottom: '6px',
      }}>
        {label}
      </div>
      <div style={{ fontSize: '13px', color: '#b0b8cc', lineHeight: '1.65' }}>
        {children}
      </div>
    </div>
  )
}
