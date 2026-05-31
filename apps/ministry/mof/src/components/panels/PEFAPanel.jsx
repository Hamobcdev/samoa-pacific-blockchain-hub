import React, { useState } from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { KPICard } from '../shared/KPICard.jsx'
import { SectionHeader } from '../shared/SectionHeader.jsx'

const PEFA_DATA = [
  {
    pillar: 'P1: Budget Reliability',
    indicators: [
      { id: 'PI-1',  name: 'Aggregate expenditure outturn',                score: 'B',  status: 'Adequate',          note: 'Within 5% of approved budget in 2 of 3 years' },
      { id: 'PI-2',  name: 'Expenditure composition outturn',               score: 'C',  status: 'Needs improvement', note: 'Variance >10% in several budget heads' },
      { id: 'PI-3',  name: 'Revenue outturn',                               score: 'B',  status: 'Adequate',          note: 'Actual revenue 95-105% of budget in 2 years' },
    ],
  },
  {
    pillar: 'P2: Transparency of Public Finances',
    indicators: [
      { id: 'PI-4',  name: 'Budget classification',                          score: 'A',  status: 'Strong',            note: 'GFS/COFOG compliant classification in use' },
      { id: 'PI-5',  name: 'Budget documentation',                           score: 'B',  status: 'Adequate',          note: '5 of 12 basic elements published with budget' },
      { id: 'PI-6',  name: 'Central government operations outside budget',    score: 'B',  status: 'Adequate',          note: 'Extra-budgetary expenditure < 5%' },
      { id: 'PI-7',  name: 'Transfers to subnational governments',            score: 'C',  status: 'Needs improvement', note: 'Limited published basis for transfers' },
      { id: 'PI-8',  name: 'Performance information for service delivery',    score: 'C',  status: 'Needs improvement', note: 'Partial output reporting in some ministries' },
      { id: 'PI-9',  name: 'Public access to fiscal information',             score: 'B',  status: 'Adequate',          note: 'Budget proposal and year-end statements published' },
    ],
  },
  {
    pillar: 'P3: Management of Assets and Liabilities',
    indicators: [
      { id: 'PI-10', name: 'Fiscal risk reporting',                           score: 'C',  status: 'Needs improvement', note: 'SOE reporting incomplete; risk register partial' },
      { id: 'PI-11', name: 'Public investment management',                    score: 'B',  status: 'Adequate',          note: 'Project selection criteria defined' },
      { id: 'PI-12', name: 'Public asset management',                         score: 'C',  status: 'Needs improvement', note: 'Asset register incomplete' },
      { id: 'PI-13', name: 'Debt management',                                 score: 'B',  status: 'Adequate',          note: 'Debt strategy published; DSA conducted' },
    ],
  },
  {
    pillar: 'P4: Policy-Based Fiscal Strategy and Budgeting',
    indicators: [
      { id: 'PI-14', name: 'Macroeconomic and fiscal forecasting',            score: 'B',  status: 'Adequate',          note: 'MTEF prepared; macro assumptions documented' },
      { id: 'PI-15', name: 'Fiscal strategy',                                 score: 'C',  status: 'Needs improvement', note: 'Strategy not assessed against objectives' },
      { id: 'PI-16', name: 'Medium-term perspective in expenditure budgeting', score: 'B', status: 'Adequate',           note: 'Aggregate ceilings in MTEF' },
      { id: 'PI-17', name: 'Budget preparation process',                      score: 'B',  status: 'Adequate',          note: 'Clear calendar; MDA ceilings circulated' },
      { id: 'PI-18', name: 'Legislative scrutiny of budgets',                 score: 'B',  status: 'Adequate',          note: 'Parliament reviews and approves within schedule' },
    ],
  },
  {
    pillar: 'P5: Predictability and Control in Budget Execution',
    indicators: [
      { id: 'PI-19', name: 'Revenue administration',                          score: 'B',  status: 'Adequate',          note: 'MOR and Customs audits conducted' },
      { id: 'PI-20', name: 'Accounting for revenue',                          score: 'A',  status: 'Strong',            note: 'Daily reconciliation of tax collections' },
      { id: 'PI-21', name: 'Predictability of in-year resource allocation',   score: 'B',  status: 'Adequate',          note: 'Cash plan issued quarterly' },
      { id: 'PI-22', name: 'Expenditure arrears',                             score: 'C',  status: 'Needs improvement', note: 'Arrears >2% of total expenditure' },
      { id: 'PI-23', name: 'Payroll controls',                                score: 'B',  status: 'Adequate',          note: 'HR-payroll link established; audits annual' },
      { id: 'PI-24', name: 'Procurement management',                          score: 'C',  status: 'Needs improvement', note: 'OCDS adoption underway; tender board active' },
      { id: 'PI-25', name: 'Internal controls on non-salary expenditure',     score: 'B',  status: 'Adequate',          note: 'Commitment controls in FMIS' },
    ],
  },
  {
    pillar: 'P6: Accounting and Reporting',
    indicators: [
      { id: 'PI-26', name: 'In-year budget reports',                          score: 'B',  status: 'Adequate',          note: 'Quarterly reports published within 4 weeks' },
      { id: 'PI-27', name: 'Financial data integrity',                        score: 'B',  status: 'Adequate',          note: 'Bank reconciliation monthly; suspense cleared' },
      { id: 'PI-28', name: 'In-year budget reports (2)',                      score: 'B',  status: 'Adequate',          note: 'Coverage consistent with budget' },
      { id: 'PI-29', name: 'Annual financial reports',                        score: 'C',  status: 'Needs improvement', note: 'Reports submitted >6 months after year-end' },
    ],
  },
  {
    pillar: 'P7: External Scrutiny and Audit',
    indicators: [
      { id: 'PI-30', name: 'External audit',                                  score: 'B',  status: 'Adequate',          note: 'Auditor-General report covers >75% of revenue' },
      { id: 'PI-31', name: 'Legislative scrutiny of audit reports',           score: 'C',  status: 'Needs improvement', note: 'PAC review >12 months after audit submission' },
    ],
  },
]

function ScoreBadge({ score }) {
  const map = {
    'A':  [COLORS.pefaA, `${COLORS.pefaA}18`],
    'B+': [COLORS.pefaB, `${COLORS.pefaB}18`],
    'B':  [COLORS.pefaB, `${COLORS.pefaB}18`],
    'C':  [COLORS.pefaC, `${COLORS.pefaC}18`],
    'D':  [COLORS.pefaD, `${COLORS.pefaD}18`],
  }
  const [color, bg] = map[score] || [COLORS.pefaNA, 'transparent']
  return (
    <span style={{ background: bg, border: `1px solid ${color}55`, borderRadius: 3, color, fontFamily: TYPOGRAPHY.mono, fontSize: 12, fontWeight: 700, padding: '2px 9px' }}>
      {score}
    </span>
  )
}

function pillarAvg(indicators) {
  const map = { A: 4, B: 3, C: 2, D: 1 }
  const scores = indicators.map(i => map[i.score.replace('+','')]||0)
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  if (avg >= 3.5) return { label: 'A', color: COLORS.pefaA }
  if (avg >= 2.5) return { label: 'B', color: COLORS.pefaB }
  if (avg >= 1.5) return { label: 'C', color: COLORS.pefaC }
  return { label: 'D', color: COLORS.pefaD }
}

export function PEFAPanel({ lang }) {
  const [expandedRow, setExpandedRow] = useState(null)
  const allInds = PEFA_DATA.flatMap(p => p.indicators)
  const totalA  = allInds.filter(i => i.score === 'A').length
  const totalB  = allInds.filter(i => i.score.startsWith('B')).length
  const totalC  = allInds.filter(i => i.score === 'C').length
  const totalD  = allInds.filter(i => i.score === 'D').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <KPICard label="Total Indicators" value="31"                   sub="PEFA 2016 framework"           color={COLORS.text}    icon="◎" />
        <KPICard label="Rated A or B"     value={String(totalA+totalB)} sub="Strong / Adequate"            color={COLORS.fiscal}  icon="✓" />
        <KPICard label="Rated C or D"     value={String(totalC+totalD)} sub="Needs improvement"            color={COLORS.warning} icon="⚠" />
        <KPICard label="Next Assessment"  value="2026"                 sub="Self-assessment scheduled"     color={COLORS.info}    icon="◑" />
      </div>

      {/* 7-pillar summary */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="7-Pillar Summary" subtitle="PEFA 2016 · Average score per pillar" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PEFA_DATA.map(p => {
            const avg = pillarAvg(p.indicators)
            const pct = { A:100, B:75, C:50, D:25 }[avg.label] || 0
            return (
              <div key={p.pillar}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 13, color: COLORS.text }}>{p.pillar}</div>
                  <ScoreBadge score={avg.label} />
                </div>
                <div style={{ height: 6, background: COLORS.surface3, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: avg.color, borderRadius: 3, transition: 'width 0.4s' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Full 31-indicator table */}
      <div style={{ background: '#ffffff', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 3px rgba(26,58,107,0.05)' }}>
        <SectionHeader title="Full 31-Indicator Scorecard" subtitle="PEFA 2016 · Click indicator to expand dimension details" />
        {PEFA_DATA.map(p => (
          <div key={p.pillar} style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.info, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, fontWeight: 600 }}>
              {p.pillar}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                <thead>
                  <tr>
                    {['ID','Indicator','Score','Status','▼'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', background: COLORS.surface2, color: COLORS.govBlue, fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', borderBottom: `2px solid ${COLORS.border}`, whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.indicators.map((ind, i) => {
                    const rowKey = `${p.pillar}-${ind.id}`
                    const isExp  = expandedRow === rowKey
                    return (
                      <React.Fragment key={ind.id}>
                        <tr
                          onClick={() => setExpandedRow(isExp ? null : rowKey)}
                          style={{ background: i % 2 === 0 ? '#ffffff' : COLORS.surface, cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.background = COLORS.govBlueBg }}
                          onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? '#ffffff' : COLORS.surface }}
                        >
                          <td style={{ padding: '9px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, fontWeight: 600, borderBottom: `1px solid ${COLORS.border}` }}>{ind.id}</td>
                          <td style={{ padding: '9px 10px', fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{ind.name}</td>
                          <td style={{ padding: '9px 10px', borderBottom: `1px solid ${COLORS.border}` }}><ScoreBadge score={ind.score} /></td>
                          <td style={{ padding: '9px 10px', fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{ind.status}</td>
                          <td style={{ padding: '9px 10px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, borderBottom: `1px solid ${COLORS.border}`, textAlign: 'center' }}>{isExp ? '▲' : '▼'}</td>
                        </tr>
                        {isExp && (
                          <tr>
                            <td colSpan={5} style={{ background: COLORS.govBlueBg, borderBottom: `1px solid ${COLORS.govBlueBorder}`, padding: '10px 20px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted, lineHeight: 1.7 }}>
                              {ind.note} · Dimension-level breakdown: Phase 2 integration
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Blockchain contribution */}
      <div style={{ background: COLORS.fiscalBg, border: `1px solid ${COLORS.fiscalBorder}`, borderLeft: `4px solid ${COLORS.fiscal}`, borderRadius: 8, padding: '16px 20px' }}>
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, color: COLORS.fiscal, marginBottom: 10, letterSpacing: '1px' }}>
          PEFA PILLARS ADDRESSED BY DPI BLOCKCHAIN LAYER
        </div>
        {[
          { pillar: 'P2 Transparency', desc: 'OCDS on-chain procurement records → PI-24 improvement' },
          { pillar: 'P5 Internal Controls', desc: '#FA immutable audit trail → PI-25 strengthening' },
          { pillar: 'P6 Accounting', desc: 'Merkle root anchoring at fiscal close → PI-27 integrity' },
        ].map(c => (
          <div key={c.pillar} style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <div style={{ background: COLORS.operationalBg, border: `1px solid ${COLORS.operationalBorder}`, borderRadius: 3, color: COLORS.fiscal, fontFamily: TYPOGRAPHY.mono, fontSize: 11, fontWeight: 700, padding: '2px 8px', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>{c.pillar}</div>
            <div style={{ fontFamily: TYPOGRAPHY.sans, fontSize: 12, color: COLORS.textMuted, lineHeight: 1.55 }}>{c.desc}</div>
          </div>
        ))}
        <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, marginTop: 10 }}>
          Research contribution: Working Paper 1 (WoG D-DPI Architecture) ·
          NUS / ISOC Foundation Research Programme 2026
        </div>
      </div>
    </div>
  )
}
