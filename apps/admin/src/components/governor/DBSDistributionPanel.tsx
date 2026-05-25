import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

const TIER2_BANKS = [
  { code: 'ANZ-WS', name: 'ANZ Bank Samoa',              limit: 500000, settlement: 'ANZ Group Pacific',       compliance: 'Compliant' },
  { code: 'BSP-WS', name: 'BSP Samoa',                   limit: 300000, settlement: 'BSP Financial Group PNG', compliance: 'Compliant' },
  { code: 'SCB-WS', name: 'Samoa Commercial Bank',       limit: 200000, settlement: 'National Bank of Samoa',  compliance: 'Compliant' },
  { code: 'NBS-WS', name: 'National Bank of Samoa',      limit: 200000, settlement: 'Central Bank of Samoa',   compliance: 'Compliant' },
  { code: 'DBS-WS', name: 'Development Bank of Samoa',   limit: 150000, settlement: 'Ministry of Finance',     compliance: 'Compliant' },
] as const

const TIER3_PARTICIPANTS = [
  { code: 'SNPF',   name: 'Samoa National Provident Fund',            partner: 'BSP-WS' },
  { code: 'UTOS',   name: 'Unit Trust of Samoa',                      partner: 'ANZ-WS' },
  { code: 'WSTLAC', name: 'Western Samoa Life Assurance Corporation', partner: 'NBS-WS' },
] as const

const TABLE_HEADERS = ['CODE', 'INSTITUTION', 'STATUS', 'DAILY LIMIT (WST)', 'SETTLEMENT BANK', 'COMPLIANCE'] as const

export function DBSDistributionPanel() {
  return (
    <div data-panel style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Zone 3 classification band */}
      <div style={{
        background:     '#633806',
        borderRadius:   4,
        padding:        '6px 14px',
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
      }}>
        <span style={{ color: '#FAC775', fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: 2, fontWeight: 500 }}>
          ZONE 3 · CONFIDENTIAL
        </span>
        <span style={{ color: '#FAC775', fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: 2, opacity: 0.7 }}>
          CBS OVERSIGHT FUNCTION
        </span>
      </div>

      {/* Header */}
      <div>
        <h2 style={{
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      14,
          fontWeight:    700,
          color:         COLORS.text,
          letterSpacing: '-0.2px',
          marginBottom:  8,
        }}>
          WST-DPI Distribution Network — CBS Supervisory View
        </h2>

        {/* Supervisory note */}
        <div style={{
          background:  COLORS.infoBg,
          border:      `1px solid ${COLORS.infoBorder}`,
          borderLeft:  `3px solid ${COLORS.info}`,
          borderRadius: 4,
          padding:     '10px 14px',
        }}>
          <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.info, lineHeight: 1.65 }}>
            This view is a CBS supervisory function. DBS does not self-report compliance —
            CBS independently monitors all WST-DPI distribution activity.
          </span>
        </div>
      </div>

      {/* Tier 2 — Licensed Retail Distributors */}
      <section>
        <h3 style={{
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      10,
          fontWeight:    600,
          color:         COLORS.textMuted,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom:  12,
        }}>
          Tier 2 — Licensed Retail Distributors
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {TABLE_HEADERS.map(h => (
                <th key={h} style={{
                  fontFamily:    TYPOGRAPHY.mono,
                  fontSize:      9,
                  color:         COLORS.textMuted,
                  padding:       '8px 12px',
                  borderBottom:  `1px solid ${COLORS.border}`,
                  textAlign:     h === 'DAILY LIMIT (WST)' ? 'right' : 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  background:    COLORS.surface,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIER2_BANKS.map((bank, i) => (
              <tr key={bank.code} style={{ background: i % 2 === 0 ? 'transparent' : COLORS.surface }}>
                <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.gold, fontWeight: 600, borderBottom: `1px solid ${COLORS.border}` }}>
                  {bank.code}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text, fontSize: 13 }}>
                  {bank.name}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{
                    fontFamily:    TYPOGRAPHY.mono,
                    fontSize:      9,
                    fontWeight:    600,
                    padding:       '2px 8px',
                    borderRadius:  3,
                    background:    COLORS.operationalBg,
                    color:         COLORS.operational,
                    border:        `1px solid ${COLORS.operationalBorder}`,
                  }}>
                    ✓ ACTIVE
                  </span>
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, textAlign: 'right', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.gold, fontWeight: 500 }}>
                  {bank.limit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted }}>
                  {bank.settlement}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{
                    fontFamily:   TYPOGRAPHY.mono,
                    fontSize:     9,
                    fontWeight:   600,
                    padding:      '2px 8px',
                    borderRadius: 3,
                    background:   COLORS.operationalBg,
                    color:        COLORS.operational,
                    border:       `1px solid ${COLORS.operationalBorder}`,
                  }}>
                    ✓ {bank.compliance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Tier 3 — Institutional Participants */}
      <section>
        <h3 style={{
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      10,
          fontWeight:    600,
          color:         COLORS.textMuted,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom:  12,
        }}>
          Tier 3 — Institutional Participants
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TIER3_PARTICIPANTS.map(p => (
            <div key={p.code} style={{
              background:    COLORS.surface,
              border:        `1px solid ${COLORS.border}`,
              borderLeft:    `3px solid ${COLORS.borderGold}`,
              borderRadius:  4,
              padding:       '10px 16px',
              display:       'flex',
              alignItems:    'center',
              gap:           24,
            }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.gold, fontWeight: 600, minWidth: 70 }}>
                {p.code}
              </span>
              <span style={{ color: COLORS.text, fontSize: 13, flex: 1 }}>
                {p.name}
              </span>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted }}>
                via {p.partner}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div style={{
        fontFamily:  TYPOGRAPHY.mono,
        fontSize:    9,
        color:       COLORS.textDim,
        paddingTop:  8,
        borderTop:   `1px solid ${COLORS.border}`,
      }}>
        Data: Simulated · Phase 1 Research Environment · CBS Oversight Function
      </div>
    </div>
  )
}
