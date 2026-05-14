import React from 'react'
import { COLORS, TYPOGRAPHY, ROLES, TAPA_BG } from '../../theme.js'
import { t } from '../../i18n.js'

export function RolePicker({ onSelect, lang = 'EN' }) {
  return (
    <div style={{
      minHeight:      '100dvh',
      background:     COLORS.bg,
      backgroundImage: TAPA_BG,
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        24,
    }}>
      <div style={{
        color:         COLORS.gold,
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      10,
        letterSpacing: '3px',
        marginBottom:  8,
        textTransform: 'uppercase',
      }}>
        {t(lang, 'app.title')}
      </div>

      <div style={{
        color:         COLORS.text,
        fontFamily:    TYPOGRAPHY.sans,
        fontSize:      22,
        fontWeight:    600,
        marginBottom:  4,
        textAlign:     'center',
      }}>
        Central Bank of Samoa
      </div>

      <div style={{
        color:         COLORS.textMuted,
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      11,
        letterSpacing: '1px',
        marginBottom:  40,
      }}>
        Digital Public Infrastructure — Administration
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400 }}>
        {Object.values(ROLES).map(role => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            aria-describedby={`role-desc-${role.id}`}
            style={{
              background:   COLORS.surface,
              border:       `1px solid ${COLORS.border}`,
              borderRadius: 6,
              color:        COLORS.text,
              cursor:       'pointer',
              fontFamily:   TYPOGRAPHY.sans,
              padding:      '16px 20px',
              textAlign:    'left',
              transition:   'border-color 0.15s, background 0.15s',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'space-between',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = role.color
              e.currentTarget.style.background  = COLORS.surface2
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = COLORS.border
              e.currentTarget.style.background  = COLORS.surface
            }}
          >
            <div>
              <div style={{ color: role.color, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '1.5px', marginBottom: 3 }}>
                {role.id}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{role.label}</div>
              <div id={`role-desc-${role.id}`} style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>
                {lang === 'SM' ? role.labelSM : role.label}
              </div>
            </div>
            <span aria-hidden="true" style={{ color: COLORS.textDim, fontSize: 18 }}>›</span>
          </button>
        ))}
      </div>

      <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '1px', marginTop: 40 }}>
        SECURE SESSION · WCAG AAA · WST-DPI v0.1
      </div>
    </div>
  )
}
