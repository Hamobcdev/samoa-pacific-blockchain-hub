import React, { useState } from 'react'
import type { ResearchGateProps, ResearchDeliverable, ExternalIssue } from './types'

// ─── Status chip ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  complete:    { icon: '✓', label: 'Complete',    color: '#00c896', bg: 'rgba(0,200,150,0.08)',  border: 'rgba(0,200,150,0.25)' },
  'in-progress': { icon: '⚡', label: 'In Progress', color: '#f0b429', bg: 'rgba(240,180,41,0.08)', border: 'rgba(240,180,41,0.25)' },
  pending:     { icon: '○', label: 'Pending',     color: '#8c9ab8', bg: 'rgba(140,154,184,0.06)', border: 'rgba(140,154,184,0.18)' },
}

function StatusChip({ status }: { status: ResearchDeliverable['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span style={{
      display:       'inline-flex',
      alignItems:    'center',
      gap:           4,
      background:    cfg.bg,
      border:        `1px solid ${cfg.border}`,
      borderRadius:  12,
      padding:       '2px 9px',
      fontFamily:    'var(--font-mono, IBM Plex Mono, monospace)',
      fontSize:      10,
      color:         cfg.color,
      fontWeight:    600,
      letterSpacing: '0.3px',
      flexShrink:    0,
      whiteSpace:    'nowrap',
    }}>
      <span aria-hidden="true">{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  )
}

// ─── Platform badge ───────────────────────────────────────────────────────────

const PLATFORM_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  'Vercel':           { color: '#38bdf8', bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.25)' },
  'Polygon Amoy RPC': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
  'MetaMask':         { color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
}

function PlatformBadge({ platform }: { platform: string }) {
  const cfg = PLATFORM_COLORS[platform] ?? { color: '#8c9ab8', bg: 'rgba(140,154,184,0.06)', border: 'rgba(140,154,184,0.18)' }
  return (
    <span style={{
      display:       'inline-flex',
      alignItems:    'center',
      background:    cfg.bg,
      border:        `1px solid ${cfg.border}`,
      borderRadius:  4,
      padding:       '2px 8px',
      fontFamily:    'var(--font-mono, IBM Plex Mono, monospace)',
      fontSize:      10,
      color:         cfg.color,
      fontWeight:    600,
      letterSpacing: '0.5px',
      flexShrink:    0,
      whiteSpace:    'nowrap',
    }}>
      {platform}
    </span>
  )
}

// ─── Deliverable row ──────────────────────────────────────────────────────────

function DeliverableRow({ item }: { item: ResearchDeliverable }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{
      borderBottom: '1px solid var(--color-border, #1b2540)',
      padding:      '10px 14px',
    }}>
      <div style={{
        display:    'flex',
        alignItems: 'flex-start',
        gap:        10,
        cursor:     item.evidence ? 'pointer' : 'default',
      }} onClick={() => item.evidence && setExpanded((e: boolean) => !e)}>
        <span style={{
          fontFamily:    'var(--font-mono, IBM Plex Mono, monospace)',
          fontSize:      10,
          color:         'var(--color-dim, #3a4a6a)',
          minWidth:      28,
          paddingTop:    1,
          flexShrink:    0,
        }}>
          {item.id}
        </span>
        <span style={{
          flex:       1,
          fontFamily: 'var(--font-ui, DM Sans, sans-serif)',
          fontSize:   13,
          color:      'var(--color-text, #e8edf8)',
          lineHeight: 1.4,
        }}>
          {item.title}
        </span>
        <StatusChip status={item.status} />
        {item.evidence && (
          <span style={{ color: 'var(--color-dim, #3a4a6a)', fontSize: 10, paddingTop: 1, flexShrink: 0 }}>
            {expanded ? '↑' : '↓'}
          </span>
        )}
      </div>
      <div style={{
        display:    'flex',
        alignItems: 'center',
        gap:        8,
        marginTop:  4,
        paddingLeft: 38,
      }}>
        <span style={{
          fontFamily:    'var(--font-mono, IBM Plex Mono, monospace)',
          fontSize:      9,
          color:         'var(--color-dim, #3a4a6a)',
          letterSpacing: '0.5px',
        }}>
          {item.outputType} · {item.phase}
        </span>
      </div>
      {expanded && item.evidence && (
        <div style={{
          marginTop:  8,
          paddingLeft: 38,
          fontFamily: 'var(--font-mono, IBM Plex Mono, monospace)',
          fontSize:   10,
          color:      'var(--color-muted, #8c9ab8)',
          lineHeight: 1.6,
          background: 'var(--color-surface-2, #111830)',
          borderRadius: 4,
          padding:    '8px 12px',
        }}>
          {item.evidence}
        </div>
      )}
    </div>
  )
}

// ─── Issue row ────────────────────────────────────────────────────────────────

function IssueRow({ issue }: { issue: ExternalIssue }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{
      borderBottom: '1px solid var(--color-border, #1b2540)',
      padding:      '10px 14px',
    }}>
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}
        onClick={() => setExpanded((e: boolean) => !e)}
      >
        <span style={{
          fontFamily:    'var(--font-mono, IBM Plex Mono, monospace)',
          fontSize:      9,
          color:         'var(--color-dim, #3a4a6a)',
          minWidth:      36,
          paddingTop:    2,
          flexShrink:    0,
        }}>
          {issue.date.slice(0, 5)}
        </span>
        <PlatformBadge platform={issue.platform} />
        <span style={{
          flex:       1,
          fontFamily: 'var(--font-ui, DM Sans, sans-serif)',
          fontSize:   13,
          color:      'var(--color-text, #e8edf8)',
          lineHeight: 1.4,
        }}>
          {issue.description}
        </span>
        <span style={{ color: 'var(--color-dim, #3a4a6a)', fontSize: 10, paddingTop: 2, flexShrink: 0 }}>
          {expanded ? '↑' : '↓'}
        </span>
      </div>

      {expanded && (
        <div style={{
          marginTop:  10,
          paddingLeft: 46,
          display:    'flex',
          flexDirection: 'column',
          gap:        8,
        }}>
          <div style={{
            background:   'var(--color-surface-2, #111830)',
            border:       '1px solid var(--color-border, #1b2540)',
            borderLeft:   '3px solid #00c896',
            borderRadius: 4,
            padding:      '8px 12px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono, IBM Plex Mono, monospace)', fontSize: 9, color: '#00c896', letterSpacing: '1px', marginBottom: 4 }}>
              RESOLUTION
            </div>
            <div style={{ fontFamily: 'var(--font-mono, IBM Plex Mono, monospace)', fontSize: 11, color: 'var(--color-muted, #8c9ab8)', lineHeight: 1.6 }}>
              {issue.resolution}
            </div>
          </div>
          <div style={{
            background:   'var(--color-surface-2, #111830)',
            border:       '1px solid var(--color-border, #1b2540)',
            borderLeft:   '3px solid var(--color-gold, #C9A227)',
            borderRadius: 4,
            padding:      '8px 12px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono, IBM Plex Mono, monospace)', fontSize: 9, color: 'var(--color-gold, #C9A227)', letterSpacing: '1px', marginBottom: 4 }}>
              RESEARCH NOTE
            </div>
            <div style={{ fontFamily: 'var(--font-mono, IBM Plex Mono, monospace)', fontSize: 11, color: 'var(--color-muted, #8c9ab8)', lineHeight: 1.6 }}>
              {issue.researchNote}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function ResearchContextPanel(props: ResearchGateProps) {
  const { programme, institution, pi, advisor, technicalPartner, submissionDeadline, fundingRequested, deliverables, issueLog } = props

  const inProgress = deliverables.filter(d => d.status === 'in-progress')
  const pending    = deliverables.filter(d => d.status === 'pending')
  const complete   = deliverables.filter(d => d.status === 'complete')

  const [showAll, setShowAll] = useState(false)

  const prioritised = [...inProgress, ...complete, ...pending]
  const visible = showAll ? prioritised : prioritised.slice(0, 4)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} data-panel>

      {/* Header */}
      <div>
        <div style={{
          fontFamily:    'var(--font-mono, IBM Plex Mono, monospace)',
          fontSize:      10,
          fontWeight:    700,
          color:         'var(--color-gold, #C9A227)',
          letterSpacing: '2px',
          marginBottom:  4,
        }}>
          RESEARCH CONTEXT
        </div>
        <div style={{
          fontFamily: 'var(--font-ui, DM Sans, sans-serif)',
          fontSize:   16,
          fontWeight: 700,
          color:      'var(--color-text, #e8edf8)',
          lineHeight: 1.3,
        }}>
          {programme}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono, IBM Plex Mono, monospace)',
          fontSize:   11,
          color:      'var(--color-muted, #8c9ab8)',
          marginTop:  4,
        }}>
          {institution} · {pi}
        </div>
      </div>

      {/* Programme summary card */}
      <div style={{
        background:   'var(--color-surface, #0c1222)',
        border:       '1px solid var(--color-border, #1b2540)',
        borderLeft:   '3px solid var(--color-gold, #C9A227)',
        borderRadius: 6,
        overflow:     'hidden',
      }}>
        <div style={{
          padding:      '12px 16px',
          borderBottom: '1px solid var(--color-border, #1b2540)',
          fontFamily:   'var(--font-mono, IBM Plex Mono, monospace)',
          fontSize:     10,
          color:        'var(--color-gold, #C9A227)',
          letterSpacing:'1.5px',
          fontWeight:   700,
        }}>
          PROGRAMME STATUS — IN PROGRESS
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono, IBM Plex Mono, monospace)', fontSize: 11 }}>
          <tbody>
            {[
              ['Funding',         fundingRequested],
              ['Submission',      submissionDeadline],
              ['Advisor',         advisor],
              ['Tech Partner',    technicalPartner],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: '1px solid var(--color-border, #1b2540)' }}>
                <td style={{
                  color:       'var(--color-dim, #3a4a6a)',
                  padding:     '8px 16px',
                  whiteSpace:  'nowrap',
                  verticalAlign: 'top',
                  width:       120,
                  letterSpacing: '0.5px',
                }}>
                  {label}
                </td>
                <td style={{
                  color:   'var(--color-muted, #8c9ab8)',
                  padding: '8px 16px',
                  lineHeight: 1.5,
                }}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deliverables panel */}
      <div style={{
        background:   'var(--color-surface, #0c1222)',
        border:       '1px solid var(--color-border, #1b2540)',
        borderRadius: 6,
        overflow:     'hidden',
      }}>
        <div style={{
          padding:      '12px 16px',
          borderBottom: '1px solid var(--color-border, #1b2540)',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily:    'var(--font-mono, IBM Plex Mono, monospace)',
            fontSize:      10,
            fontWeight:    700,
            color:         'var(--color-muted, #8c9ab8)',
            letterSpacing: '1.5px',
          }}>
            DELIVERABLES D1–D10
          </div>
          <div style={{
            fontFamily: 'var(--font-mono, IBM Plex Mono, monospace)',
            fontSize:   10,
            color:      'var(--color-dim, #3a4a6a)',
          }}>
            {inProgress.length} in progress · {complete.length} complete · {pending.length} pending
          </div>
        </div>

        {visible.map(item => (
          <DeliverableRow key={item.id} item={item} />
        ))}

        {prioritised.length > 4 && (
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--color-border, #1b2540)' }}>
            <button
              onClick={() => setShowAll((s: boolean) => !s)}
              style={{
                background:    'none',
                border:        '1px solid var(--color-border, #1b2540)',
                borderRadius:  4,
                color:         'var(--color-muted, #8c9ab8)',
                cursor:        'pointer',
                fontFamily:    'var(--font-mono, IBM Plex Mono, monospace)',
                fontSize:      10,
                letterSpacing: '0.5px',
                padding:       '5px 12px',
              }}
            >
              {showAll ? '↑ Collapse' : `Show all ${prioritised.length} deliverables`}
            </button>
          </div>
        )}
      </div>

      {/* Infrastructure issues log */}
      <div style={{
        background:   'var(--color-surface, #0c1222)',
        border:       '1px solid var(--color-border, #1b2540)',
        borderRadius: 6,
        overflow:     'hidden',
      }}>
        <div style={{
          padding:      '12px 16px',
          borderBottom: '1px solid var(--color-border, #1b2540)',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily:    'var(--font-mono, IBM Plex Mono, monospace)',
            fontSize:      10,
            fontWeight:    700,
            color:         'var(--color-muted, #8c9ab8)',
            letterSpacing: '1.5px',
          }}>
            INFRASTRUCTURE ISSUES LOG
          </div>
          <div style={{
            fontFamily: 'var(--font-mono, IBM Plex Mono, monospace)',
            fontSize:   10,
            color:      'var(--color-dim, #3a4a6a)',
          }}>
            {issueLog.length} logged
          </div>
        </div>

        {issueLog.map((issue, i) => (
          <IssueRow key={i} issue={issue} />
        ))}

        <div style={{
          padding:    '8px 14px',
          fontFamily: 'var(--font-mono, IBM Plex Mono, monospace)',
          fontSize:   9,
          color:      'var(--color-dim, #3a4a6a)',
          letterSpacing: '0.5px',
          lineHeight: 1.6,
        }}>
          Infrastructure issues are logged for research purposes.
          Each entry includes a resolution and a research note mapping
          the issue to DPI deployment challenges in Pacific SIDS contexts.
        </div>
      </div>

      <div style={{
        fontFamily:    'var(--font-mono, IBM Plex Mono, monospace)',
        fontSize:      9,
        color:         'var(--color-dim, #3a4a6a)',
        paddingTop:    8,
        borderTop:     '1px solid var(--color-border, #1b2540)',
        letterSpacing: '0.5px',
      }}>
        NUS/ISOC Research Programme 2026 · Research environment — not production
      </div>
    </div>
  )
}
