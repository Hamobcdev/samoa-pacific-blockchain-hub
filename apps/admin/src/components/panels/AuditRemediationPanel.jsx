import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { TimestampDisplay } from '../currency/TimestampDisplay.jsx'
import { ResearchLabel } from '../shared/ResearchLabel.jsx'

export function AuditRemediationPanel({ auditLog, lang = 'EN' }) {
  const { entries, clear } = auditLog

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: COLORS.gold, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '2px' }}>
          {lang === 'SM' ? 'TOE ILOILO' : 'AUDIT REMEDIATION LOG'}
        </div>
        {entries.length > 0 && (
          <button
            onClick={clear}
            style={{
              background:    'transparent',
              border:        `1px solid ${COLORS.border}`,
              borderRadius:  3,
              color:         COLORS.textDim,
              cursor:        'pointer',
              fontFamily:    TYPOGRAPHY.mono,
              fontSize:      9,
              letterSpacing: '1px',
              padding:       '3px 8px',
            }}
          >
            CLEAR
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div style={{
          background:   COLORS.surface2,
          border:       `1px dashed ${COLORS.border}`,
          borderRadius: 6,
          color:        COLORS.textDim,
          fontFamily:   TYPOGRAPHY.mono,
          fontSize:     11,
          padding:      '32px 20px',
          textAlign:    'center',
          letterSpacing: '1px',
        }}>
          {lang === 'SM' ? 'E leai ni faailoga' : 'No audit entries yet'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 480, overflowY: 'auto' }}>
          {entries.map(entry => (
            <div key={entry.id} style={{
              background:   COLORS.surface2,
              border:       `1px solid ${COLORS.border}`,
              borderRadius: 4,
              padding:      '8px 12px',
              display:      'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap:          8,
              alignItems:   'center',
            }}>
              <span style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9, minWidth: 24, textAlign: 'right' }}>
                {entry.seq}
              </span>
              <div>
                <span style={{ color: COLORS.text, fontFamily: TYPOGRAPHY.mono, fontSize: 11 }}>{entry.action}</span>
                {entry.detail && (
                  <span style={{ color: COLORS.textMuted, fontFamily: TYPOGRAPHY.mono, fontSize: 10, marginLeft: 8 }}>
                    {entry.detail}
                  </span>
                )}
                {entry.roleId && (
                  <span style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9, marginLeft: 8 }}>
                    [{entry.roleId}]
                  </span>
                )}
              </div>
              <span style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9, whiteSpace: 'nowrap' }}>
                {entry.timestamp}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9 }}>
        {lang === 'SM' ? 'Faailoga 500 mulimuli' : 'Last 500 entries · In-memory only · Not persisted across sessions'}
      </div>

      <ResearchLabel />
    </div>
  )
}
