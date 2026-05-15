import React, { useState, useCallback } from 'react'
import { COLORS, TYPOGRAPHY, NODE_STATUS } from '../../theme.js'
import { GOVERNMENT_NODES } from '@samoa-dpi/contracts-abi'
import { SkeletonPanel } from '../shared/SkeletonLoader.jsx'
import { ResearchLabel } from '../shared/ResearchLabel.jsx'

const BRANCHES = ['REGULATORY', 'EXECUTIVE', 'LEGISLATIVE', 'JUDICIAL', 'SOE']
const BRANCH_LABELS = {
  REGULATORY: 'Regulatory Authorities',
  EXECUTIVE:  'Executive Ministries',
  LEGISLATIVE: 'Legislative Branch',
  JUDICIAL:   'Judicial Branch',
  SOE:        'State-Owned Enterprises',
}
const BRANCH_LABELS_SM = {
  REGULATORY: 'Pulega Fa\'amaonia',
  EXECUTIVE:  'Matagaluega Fa\'atonu',
  LEGISLATIVE: 'Fono',
  JUDICIAL:   'Faamasinoga',
  SOE:        'Kamupani a le Malo',
}

function truncateAddress(addr) {
  if (!addr || addr.length < 12) return addr || '—'
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback((e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [value])

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy address to clipboard"
      style={{
        background:    'none',
        border:        'none',
        cursor:        'pointer',
        padding:       '0 4px',
        color:         copied ? COLORS.gold : COLORS.textMuted,
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      10,
        letterSpacing: copied ? '0.5px' : 0,
        transition:    'color 0.2s',
      }}
    >
      {copied ? 'Copied!' : '⎘'}
    </button>
  )
}

function NodeCard({ node, lang }) {
  const [expanded, setExpanded] = useState(false)
  const s = NODE_STATUS[node.status] ?? NODE_STATUS.OFFLINE

  const statusBg = {
    OPERATIONAL: COLORS.operationalBg,
    DEGRADED:    COLORS.warningBg,
    OFFLINE:     COLORS.criticalBg,
    OBSERVER:    COLORS.infoBg,
    SYNCING:     COLORS.blockedBg,
  }[node.status] ?? COLORS.surface2

  const statusBorder = {
    OPERATIONAL: COLORS.operationalBorder,
    DEGRADED:    COLORS.warningBorder,
    OFFLINE:     COLORS.criticalBorder,
    OBSERVER:    COLORS.infoBorder,
    SYNCING:     COLORS.blockedBorder,
  }[node.status] ?? COLORS.border

  const blockDisplay = node.blockHeight
    ? `B#${node.blockHeight.toLocaleString()}`
    : '—'

  const lastSeenDate = node.lastSeen
    ? new Date(node.lastSeen).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'Pacific/Apia',
      }) + ' WST'
    : '—'

  return (
    <div
      role="article"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={() => setExpanded(e => !e)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(v => !v) } }}
      style={{
        background:   COLORS.surface2,
        border:       `1px solid ${COLORS.border}`,
        borderRadius: 6,
        padding:      '12px 14px',
        cursor:       'pointer',
        outline:      'none',
        transition:   'border-color 0.15s',
      }}
      onFocus={e => { e.currentTarget.style.borderColor = COLORS.gold }}
      onBlur={e => { e.currentTarget.style.borderColor = COLORS.border }}
    >
      {/* Collapsed row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 12, fontWeight: 700, color: COLORS.gold }}>
          {node.code}
        </div>
        <span
          aria-label={`Status: ${lang === 'SM' ? s.labelSM : s.label}`}
          style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          4,
            background:   statusBg,
            border:       `1px solid ${statusBorder}`,
            borderRadius: 3,
            padding:      '2px 6px',
            color:        s.color,
            fontFamily:   TYPOGRAPHY.mono,
            fontSize:     9,
            letterSpacing: '0.5px',
            whiteSpace:   'nowrap',
          }}
        >
          <span aria-hidden="true">{s.icon}</span>
          {lang === 'SM' ? s.labelSM : s.label}
        </span>
      </div>

      <div style={{ marginTop: 6, color: COLORS.textMuted, fontFamily: TYPOGRAPHY.mono, fontSize: 10 }}>
        {node.latencyMs}ms · <span style={{ color: COLORS.textDim }}>{blockDisplay}</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted }}>
              {truncateAddress(node.address || '0x0000…0000')}
            </span>
            <CopyButton value={node.address || '0x0000000000000000000000000000000000000000'} />
          </div>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textDim }}>
            Peers: {node.peers ?? '—'} · Block: {blockDisplay}
          </div>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textDim }}>
            Last seen: {lastSeenDate}
          </div>
        </div>
      )}
    </div>
  )
}

function BranchSection({ branch, nodes, lang, filter }) {
  const filtered = filter === 'ALL'
    ? nodes
    : nodes.filter(n => n.status === filter)

  if (filtered.length === 0) return null

  const opCount = nodes.filter(n => n.status === 'OPERATIONAL').length
  const allOp   = opCount === nodes.length
  const healthColor = allOp ? COLORS.operational : opCount < nodes.length / 2 ? COLORS.critical : COLORS.warning
  const healthIcon  = allOp ? '✓' : opCount < nodes.length / 2 ? '✗' : '⚠'

  const label = lang === 'SM' ? (BRANCH_LABELS_SM[branch] ?? branch) : (BRANCH_LABELS[branch] ?? branch)

  return (
    <div style={{
      borderLeft:  `3px solid ${COLORS.gold}`,
      paddingLeft: 12,
      marginBottom: 20,
    }}>
      <div
        role="heading"
        aria-level={3}
        style={{
          display:       'flex',
          alignItems:    'center',
          gap:           12,
          marginBottom:  10,
        }}
      >
        <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '2px', color: COLORS.textMuted, textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: healthColor }}>
          {healthIcon} {opCount}/{nodes.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
        {filtered.map(node => (
          <NodeCard key={node.code} node={node} lang={lang} />
        ))}
      </div>
    </div>
  )
}

export function NodeHealthMatrix({ nodeHealth, lang = 'EN' }) {
  const [filter, setFilter] = useState('ALL')
  const [observerOpen, setObserverOpen] = useState(false)

  if (nodeHealth.loading) return <SkeletonPanel rows={8} />

  const { nodes, summary, lastPoll } = nodeHealth

  // Group by branch — exclude OBSERVER-type nodes from main sections
  const mainNodes  = nodes.filter(n => n.nodeType !== 'OBSERVER')
  const observerNodes = nodes.filter(n => n.nodeType === 'OBSERVER')

  const byBranch = {}
  for (const branch of BRANCHES) {
    byBranch[branch] = mainNodes.filter(n => n.branch === branch)
  }

  const FILTERS = [
    { key: 'ALL',         label: `All ${summary.total}`,           color: COLORS.textMuted },
    { key: 'OPERATIONAL', label: `✓ Operational ${summary.operational}`, color: COLORS.operational },
    { key: 'DEGRADED',    label: `⚠ Degraded ${summary.degraded}`,  color: COLORS.warning },
    { key: 'OFFLINE',     label: `✗ Offline ${summary.offline}`,    color: COLORS.critical },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ color: COLORS.gold, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '2px' }}>
          {lang === 'SM' ? 'SOIFUA O NODE' : 'NODE HEALTH MATRIX'}
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 9, color: COLORS.textDim }}>
          {lang === 'SM' ? 'Siaki 12s' : 'Polled every 12s'}
        </div>
      </div>

      {/* Filter strip */}
      <div
        data-print-hide
        style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}
      >
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            style={{
              background:    filter === f.key ? COLORS.surface3 : COLORS.surface2,
              border:        `1px solid ${filter === f.key ? COLORS.gold : COLORS.border}`,
              borderRadius:  4,
              color:         filter === f.key ? f.color : COLORS.textMuted,
              cursor:        'pointer',
              fontFamily:    TYPOGRAPHY.mono,
              fontSize:      10,
              letterSpacing: '0.5px',
              padding:       '4px 10px',
              whiteSpace:    'nowrap',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Branch sections */}
      {BRANCHES.map(branch =>
        byBranch[branch]?.length > 0 ? (
          <BranchSection
            key={branch}
            branch={branch}
            nodes={byBranch[branch]}
            lang={lang}
            filter={filter}
          />
        ) : null
      )}

      {/* Observer accordion */}
      {observerNodes.length > 0 && (
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12 }}>
          <button
            onClick={() => setObserverOpen(o => !o)}
            aria-expanded={observerOpen}
            style={{
              background:    'none',
              border:        'none',
              color:         COLORS.textMuted,
              cursor:        'pointer',
              fontFamily:    TYPOGRAPHY.mono,
              fontSize:      10,
              letterSpacing: '1px',
              padding:       0,
            }}
          >
            {observerOpen ? '▾' : '▸'} {lang === 'SM' ? `Node Mata'ita'i (${observerNodes.length})` : `Observer Nodes (${observerNodes.length})`} — {lang === 'SM' ? 'kiliki e tatala' : 'click to expand'}
          </button>

          {observerOpen && (
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
              {observerNodes
                .filter(n => filter === 'ALL' || n.status === filter)
                .map(node => (
                  <NodeCard key={node.code} node={node} lang={lang} />
                ))
              }
            </div>
          )}
        </div>
      )}

      <ResearchLabel />
    </div>
  )
}
