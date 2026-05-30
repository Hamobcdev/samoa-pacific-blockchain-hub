import React from 'react'
import { COLORS, TYPOGRAPHY, ROLES } from '../../theme.js'
import { t } from '../../i18n.js'

export function MOFRolePicker({ onSelect, lang = 'EN' }) {
  return (
    <div style={{
      minHeight:      '100dvh',
      background:     COLORS.bg,
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        24,
    }}>
      {/* Header brand */}
      <div style={{ marginBottom: 8, display: 'flex', gap: 3 }}>
        <div style={{ width: 20, height: 4, background: COLORS.flagRed, borderRadius: 2 }} />
        <div style={{ width: 20, height: 4, background: COLORS.flagBlue, borderRadius: 2 }} />
      </div>

      <div style={{
        color:         COLORS.gold,
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      11,
        letterSpacing: '3px',
        marginBottom:  8,
        textTransform: 'uppercase',
      }}>
        {t(lang, 'picker.title')}
      </div>

      <div style={{
        color:         COLORS.text,
        fontFamily:    TYPOGRAPHY.sans,
        fontSize:      22,
        fontWeight:    600,
        marginBottom:  4,
        textAlign:     'center',
      }}>
        Ministry of Finance
      </div>

      <div style={{
        color:         COLORS.textMuted,
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      11,
        letterSpacing: '1px',
        marginBottom:  40,
        textAlign:     'center',
      }}>
        {t(lang, 'picker.sub')}
      </div>

      {/* Role buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 420 }}>
        {Object.values(ROLES).map(role => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            aria-describedby={`role-desc-${role.id}`}
            style={{
              background:     COLORS.surface,
              border:         `1px solid ${COLORS.border}`,
              borderRadius:   6,
              color:          COLORS.text,
              cursor:         'pointer',
              fontFamily:     TYPOGRAPHY.sans,
              padding:        '14px 20px',
              textAlign:      'left',
              transition:     'border-color 0.15s, background 0.15s',
              display:        'flex',
              alignItems:     'center',
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
              <div style={{ color: role.color, fontFamily: TYPOGRAPHY.mono, fontSize: 11, letterSpacing: '1.5px', marginBottom: 2 }}>
                {role.id}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{role.label}</div>
              <div id={`role-desc-${role.id}`} style={{ color: COLORS.textMuted, fontFamily: TYPOGRAPHY.mono, fontSize: 11, marginTop: 2 }}>
                {lang === 'SM' ? role.labelSM : role.ariaDescription}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0, marginLeft: 12 }}>
              <span aria-hidden="true" style={{ color: COLORS.textDim, fontSize: 18 }}>›</span>
              <span style={{
                background: `${role.color}18`,
                border:     `1px solid ${role.color}44`,
                borderRadius: 3,
                color:      role.color,
                fontFamily: TYPOGRAPHY.mono,
                fontSize:   11,
                padding:    '1px 6px',
              }}>
                L{role.level}
              </span>
              {role.hsm && (
                <span style={{
                  background: COLORS.govBlueBg,
                  border:     `1px solid ${COLORS.govBlueBorder}`,
                  borderRadius: 3,
                  color:      COLORS.info,
                  fontFamily: TYPOGRAPHY.mono,
                  fontSize:   11,
                  padding:    '1px 6px',
                }}>
                  HSM
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div style={{
        color:         COLORS.textDim,
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      11,
        letterSpacing: '1px',
        marginTop:     40,
        textAlign:     'center',
      }}>
        {t(lang, 'picker.footer')}
      </div>
    </div>
  )
}
