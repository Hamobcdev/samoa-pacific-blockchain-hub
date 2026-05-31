import React from 'react'
import { COLORS, TYPOGRAPHY, ROLES } from '../../theme.js'
import { t } from '../../i18n.js'

export function MOFRolePicker({ onSelect, lang = 'EN' }) {
  return (
    <div style={{
      minHeight:      '100dvh',
      background:     COLORS.surface,
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        24,
    }}>
      {/* Flag bar */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 4 }}>
        <div style={{ width: 28, height: 5, background: COLORS.flagRed,  borderRadius: 2 }} />
        <div style={{ width: 28, height: 5, background: COLORS.flagBlue, borderRadius: 2 }} />
      </div>

      {/* Crest area */}
      <div style={{
        background:    COLORS.govBlueBg,
        border:        `1px solid ${COLORS.govBlueBorder}`,
        borderRadius:  6,
        color:         COLORS.govBlue,
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      11,
        letterSpacing: '2.5px',
        marginBottom:  12,
        padding:       '4px 18px',
        textTransform: 'uppercase',
      }}>
        {t(lang, 'picker.title')}
      </div>

      <div style={{
        color:         COLORS.text,
        fontFamily:    TYPOGRAPHY.sans,
        fontSize:      24,
        fontWeight:    600,
        marginBottom:  4,
        textAlign:     'center',
      }}>
        Ministry of Finance
      </div>

      <div style={{
        color:         COLORS.textMuted,
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      12,
        letterSpacing: '0.5px',
        marginBottom:  40,
        textAlign:     'center',
      }}>
        {t(lang, 'picker.sub')}
      </div>

      {/* Role buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 440 }}>
        {Object.values(ROLES).map(role => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            aria-describedby={`role-desc-${role.id}`}
            style={{
              background:     '#ffffff',
              border:         `1px solid ${COLORS.border}`,
              borderLeft:     `3px solid ${COLORS.border}`,
              borderRadius:   6,
              color:          COLORS.text,
              cursor:         'pointer',
              fontFamily:     TYPOGRAPHY.sans,
              padding:        '14px 18px',
              textAlign:      'left',
              transition:     'border-color 0.15s, background 0.15s',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor    = COLORS.govBlue
              e.currentTarget.style.borderLeftColor = COLORS.govBlue
              e.currentTarget.style.background     = COLORS.govBlueBg
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor    = COLORS.border
              e.currentTarget.style.borderLeftColor = COLORS.border
              e.currentTarget.style.background     = '#ffffff'
            }}
          >
            <div>
              <div style={{ color: COLORS.govBlue, fontFamily: TYPOGRAPHY.mono, fontSize: 11, letterSpacing: '1.5px', marginBottom: 2 }}>
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
                background:   COLORS.govBlueBg,
                border:       `1px solid ${COLORS.govBlueBorder}`,
                borderRadius: 3,
                color:        COLORS.govBlue,
                fontFamily:   TYPOGRAPHY.mono,
                fontSize:     11,
                padding:      '1px 6px',
              }}>
                L{role.level}
              </span>
              {role.hsm && (
                <span style={{
                  background:   COLORS.infoBg,
                  border:       `1px solid ${COLORS.infoBorder}`,
                  borderRadius: 3,
                  color:        COLORS.info,
                  fontFamily:   TYPOGRAPHY.mono,
                  fontSize:     11,
                  padding:      '1px 6px',
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
