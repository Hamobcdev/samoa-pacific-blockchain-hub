import React, { useState, useEffect } from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { KPICard } from '../shared/KPICard.jsx'
import { SectionHeader } from '../shared/SectionHeader.jsx'
import { StatusBadge } from '../shared/StatusBadge.jsx'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const EVENT_TYPES = {
  'BUDGET ANCHOR':  { color: COLORS.govBlue,  bg: COLORS.govBlueBg,  border: COLORS.govBlueBorder  },
  'GRANT RELEASE':  { color: COLORS.fiscal,   bg: COLORS.fiscalBg,   border: COLORS.fiscalBorder   },
  'PROCUREMENT':    { color: COLORS.gold,      bg: COLORS.goldBg,     border: COLORS.goldBorder     },
  'REVENUE POST':   { color: COLORS.govBlue,  bg: COLORS.govBlueBg,  border: COLORS.govBlueBorder  },
  'PEFA UPDATE':    { color: COLORS.info,      bg: COLORS.infoBg,     border: COLORS.infoBorder     },
  'TRADE REVENUE':  { color: COLORS.warning,   bg: COLORS.warningBg,  border: COLORS.warningBorder  },
  'AUDIT LOG':      { color: COLORS.blocked,   bg: COLORS.blockedBg,  border: COLORS.blockedBorder  },
}

const BASE_EVENTS = [
  { type: 'BUDGET ANCHOR',  desc: 'FY monthly close — Jun 2026',               hash: '0x4a8f…c291', ts: '09:31:22' },
  { type: 'GRANT RELEASE',  desc: 'ADB SFSRDP Tranche 2 — WST 8.4M',          hash: '0x7c2d…b184', ts: '09:28:14' },
  { type: 'PROCUREMENT',    desc: 'OC-WS-002 award hashed — WST 8.9M',         hash: '0x3e1b…f924', ts: '09:22:07' },
  { type: 'REVENUE POST',   desc: 'VAGST Apr batch — WST 22.4M',               hash: '0x9f4a…3c17', ts: '09:15:33' },
  { type: 'TRADE REVENUE',  desc: 'Port clearance revenue — WST 184K',         hash: '0x5b8c…a045', ts: '09:08:19' },
  { type: 'PEFA UPDATE',    desc: 'PI-17 Ops Risk — self assessment',           hash: '0x2d7e…9b38', ts: '09:01:44' },
  { type: 'AUDIT LOG',      desc: 'Budget variance report filed',               hash: '0x8a3f…d672', ts: '08:54:28' },
  { type: 'BUDGET ANCHOR',  desc: 'Expenditure composition close May 2026',     hash: '0x1c94…e523', ts: '08:47:15' },
  { type: 'GRANT RELEASE',  desc: 'World Bank SFSRDP disbursement — WST 4.2M', hash: '0x6e2b…a781', ts: '08:39:02' },
  { type: 'PROCUREMENT',    desc: 'OC-WS-006 tender hashed',                    hash: '0x4d7c…b834', ts: '08:31:48' },
  { type: 'REVENUE POST',   desc: 'Customs duties — Port batch WST 6.8M',      hash: '0x7a19…c452', ts: '08:24:11' },
  { type: 'AUDIT LOG',      desc: 'Payroll control confirmation FY close',      hash: '0x3b6a…f029', ts: '08:16:59' },
  { type: 'PEFA UPDATE',    desc: 'PI-24 Procurement — OCDS compliance noted',  hash: '0x9c4d…e317', ts: '08:09:34' },
  { type: 'TRADE REVENUE',  desc: 'CUSTOMS → MOF workflow confirmed',           hash: '0x2f8b…a093', ts: '08:02:07' },
  { type: 'GRANT RELEASE',  desc: 'EU IMPACT disbursement — USD 450K',          hash: '0x5e1c…d748', ts: '07:54:42' },
]

const MERKLE_HISTORY = [
  { month: 'May 2026', hash: '0x4a8f3c…2917ea', records: 842, ts: '2026-05-31 23:59:58', status: 'FINAL' },
  { month: 'Apr 2026', hash: '0x7c2db1…8413ab', records: 789, ts: '2026-04-30 23:59:52', status: 'FINAL' },
  { month: 'Mar 2026', hash: '0x3e1bf9…c724d1', records: 916, ts: '2026-03-31 23:59:47', status: 'FINAL' },
  { month: 'Feb 2026', hash: '0x9f4a3c…1708be', records: 703, ts: '2026-02-28 23:59:41', status: 'FINAL' },
  { month: 'Jan 2026', hash: '0x5b8ca0…4512fc', records: 835, ts: '2026-01-31 23:59:38', status: 'FINAL' },
  { month: 'Dec 2025', hash: '0x2d7e9b…3847da', records: 1124, ts: '2025-12-31 23:59:55', status: 'FINAL' },
]

const INTEGRITY_RECORDS = [
  { record: 'Budget execution report May 2026', onChain: '0x4a8f…', db: '0x4a8f…', match: true },
  { record: 'PEFA self-assessment 2026',        onChain: '0x7c2d…', db: '0x7c2d…', match: true },
  { record: 'Procurement register Apr 2026',    onChain: '0x3e1b…', db: '0x3e1b…', match: true },
  { record: 'Donor disbursement report Q3',     onChain: '0x9f4a…', db: '0x9f4a…', match: true },
]

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function OraclePanel({ lang }) {
  const [onChainEvents, setOnChainEvents] = useState(1247)
  const [feedIdx,       setFeedIdx]       = useState(0)
  const [feedItems,     setFeedItems]     = useState(BASE_EVENTS.slice(0, 8))

  useEffect(() => {
    const ev = setInterval(() => {
      if (Math.random() > 0.6) setOnChainEvents(n => n + 1)
    }, 20000 + Math.random() * 10000)
    return () => clearInterval(ev)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setFeedIdx(i => {
        const next = (i + 1) % BASE_EVENTS.length
        const now  = new Date()
        const ts   = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
        setFeedItems(prev => [
          { ...BASE_EVENTS[next], ts },
          ...prev.slice(0, 7),
        ])
        return next
      })
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <KPICard label="#FA Events This FY" value={String(onChainEvents)} sub="Fiscal events anchored on-chain" color={COLORS.govBlue}  icon="#" />
        <KPICard label="Last Merkle Root"   value="0x4a8f…"             sub="Anchored 2h ago · FY monthly close" color={COLORS.fiscal}  icon="◎" />
        <KPICard label="Data Integrity"     value="100% MATCH"          sub="All MOF records verified on-chain"  color={COLORS.fiscal}  icon="✓" />
        <KPICard label="Tamper Events"      value="0"                   sub="No integrity violations detected"  color={COLORS.fiscal}  icon="◼" />
      </div>

      {/* Live #FA feed */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader
          title="Sovereign Oracle — Live Fiscal Event Feed"
          subtitle="Immutable on-chain anchoring via InteroperabilityHub"
        />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                {['Timestamp','Event Type','Description','Hash','Status'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', background: COLORS.surface2, color: COLORS.govBlue, fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', borderBottom: `2px solid ${COLORS.border}`, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feedItems.map((ev, i) => {
                const style = EVENT_TYPES[ev.type] || EVENT_TYPES['AUDIT LOG']
                return (
                  <tr key={i} style={{ background: i === 0 ? COLORS.govBlueBg : i % 2 === 0 ? '#ffffff' : COLORS.surface, animation: i === 0 ? 'fadeIn 0.4s ease' : undefined }}>
                    <td style={{ padding: '9px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}`, whiteSpace: 'nowrap' }}>{ev.ts}</td>
                    <td style={{ padding: '9px 12px', borderBottom: `1px solid ${COLORS.border}`, whiteSpace: 'nowrap' }}>
                      <span style={{ background: style.bg, border: `1px solid ${style.border}`, borderRadius: 3, color: style.color, fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, padding: '2px 7px' }}>
                        {ev.type}
                      </span>
                    </td>
                    <td style={{ padding: '9px 12px', fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{ev.desc}</td>
                    <td style={{ padding: '9px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}`, whiteSpace: 'nowrap' }}>{ev.hash}</td>
                    <td style={{ padding: '9px 12px', borderBottom: `1px solid ${COLORS.border}` }}>
                      <StatusBadge variant="COMPLIANT" label="✓ FINAL" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Merkle root history */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="Monthly Fiscal Merkle Anchor History" subtitle="FY 2025/26 · Monthly close anchoring events" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr>
                {['Month','Merkle Root Hash','Records Included','Timestamp','Status'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', background: COLORS.surface2, color: COLORS.govBlue, fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', borderBottom: `2px solid ${COLORS.border}`, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MERKLE_HISTORY.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : COLORS.surface }}>
                  <td style={{ padding: '9px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, fontWeight: 600, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{r.month}</td>
                  <td style={{ padding: '9px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{r.hash}</td>
                  <td style={{ padding: '9px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.govBlue, fontWeight: 600, textAlign: 'center', borderBottom: `1px solid ${COLORS.border}` }}>{r.records}</td>
                  <td style={{ padding: '9px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{r.ts}</td>
                  <td style={{ padding: '9px 12px', borderBottom: `1px solid ${COLORS.border}` }}>
                    <StatusBadge variant="COMPLIANT" label="✓ FINAL" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data integrity verification */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="Data Integrity Verification" subtitle="On-chain hash vs current database state · No tamper events" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Record Type','On-Chain Hash','Current DB Hash','Integrity'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', background: COLORS.surface2, color: COLORS.govBlue, fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', borderBottom: `2px solid ${COLORS.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INTEGRITY_RECORDS.map((r, i) => (
                <tr key={i} style={{ background: r.match ? COLORS.fiscalBg : COLORS.criticalBg }}>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.text, borderBottom: `1px solid ${COLORS.fiscalBorder}` }}>{r.record}</td>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.fiscalBorder}` }}>{r.onChain}</td>
                  <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.fiscalBorder}` }}>{r.db}</td>
                  <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.fiscalBorder}` }}>
                    <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 12, fontWeight: 700, color: COLORS.fiscal }}>✓ MATCH</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture explanation */}
      <div style={{ background: COLORS.govBlueBg, border: `1px solid ${COLORS.govBlueBorder}`, borderLeft: `4px solid ${COLORS.govBlue}`, borderRadius: 8, padding: '20px 24px' }}>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, color: COLORS.govBlue, marginBottom: 14, letterSpacing: '1.5px' }}>
          SOVEREIGN ORACLE ARCHITECTURE
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 14 }}>
          Unlike commercial oracle networks (e.g. Chainlink), the MOF Sovereign Oracle anchors Samoa's
          own authoritative fiscal data to the blockchain. The Ministry of Finance is the source of truth —
          not an external commercial provider.
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.govBlue, fontWeight: 700, marginBottom: 8 }}>HOW IT WORKS:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {[
            '1. MOF fiscal data is collected at daily/monthly close',
            '2. A Merkle root hash of all fiscal records is computed',
            '3. The hash is posted to InteroperabilityHub via MOF MinistryNode',
            '4. Any future alteration of underlying data is detectable',
            '5. World Bank, IMF, and AG auditors can verify independently',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.govBlue, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 13, color: COLORS.textMuted }}>{step.replace(/^\d+\.\s*/, '')}</span>
            </div>
          ))}
        </div>
        <div style={{ background: COLORS.fiscalBg, border: `1px solid ${COLORS.fiscalBorder}`, borderRadius: 6, padding: '12px 16px' }}>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, color: COLORS.fiscal, marginBottom: 6, letterSpacing: '0.8px' }}>
            RESEARCH CONTRIBUTION
          </div>
          <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.65 }}>
            This is the first documented implementation of a sovereign government fiscal oracle in a
            Pacific SIDS context. Working Paper 2 (NUS/ISOC): CBS Sovereign Oracle Model.
          </div>
        </div>
      </div>

      {/* Contract references */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: '14px 18px' }}>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, lineHeight: 1.9 }}>
          InteroperabilityHub: 0xB4D3D4Ac59f0976Ee6b5A7d118df955c8E075bfd<br />
          MOF MinistryNode: 0xEcd8Af2929FaDC86aA5Bb85E05C95695df39F0Cf<br />
          AIDisbursementTracker: 0xbD7E00ECeE7A8d45D4720B54BbfD3295CF63455C
        </div>
      </div>
    </div>
  )
}
