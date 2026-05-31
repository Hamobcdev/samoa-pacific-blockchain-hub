import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { t } from '../../i18n.js'

export function SessionWarning({ sessionState, onContinue, lang = 'EN' }) {
  if (sessionState === 'active') return null
  const isExpired = sessionState === 'expired'

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      aria-label={isExpired ? t(lang, 'session.timeout') : t(lang, 'session.warning')}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         9000,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'rgba(26,42,58,0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background:   '#ffffff',
        border:       `1px solid ${isExpired ? COLORS.criticalBorder : COLORS.warningBorder}`,
        borderTop:    `4px solid ${isExpired ? COLORS.critical : COLORS.warning}`,
        borderRadius: 8,
        padding:      32,
        maxWidth:     380,
        width:        '90%',
        textAlign:    'center',
        boxShadow:    '0 8px 32px rgba(26,58,107,0.15)',
      }}>
        <div style={{
          color:         isExpired ? COLORS.critical : COLORS.warning,
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: '1.5px',
          marginBottom:  12,
        }}>
          {isExpired ? '✗ SESSION ENDED' : '⚠ SESSION EXPIRING'}
        </div>
        <div style={{ color: COLORS.text, fontSize: 14, marginBottom: 24, fontFamily: TYPOGRAPHY.sans }}>
          {isExpired ? t(lang, 'session.timeout') : t(lang, 'session.warning')}
        </div>
        {!isExpired && (
          <button
            onClick={onContinue}
            autoFocus
            style={{
              background:    COLORS.govBlue,
              border:        'none',
              borderRadius:  4,
              color:         '#fff',
              cursor:        'pointer',
              fontFamily:    TYPOGRAPHY.mono,
              fontSize:      12,
              fontWeight:    600,
              letterSpacing: '1px',
              padding:       '10px 24px',
              width:         '100%',
            }}
          >
            {t(lang, 'action.continue')}
          </button>
        )}
        {isExpired && (
          <button
            onClick={() => window.location.reload()}
            autoFocus
            style={{
              background:    COLORS.surface,
              border:        `1px solid ${COLORS.border}`,
              borderRadius:  4,
              color:         COLORS.text,
              cursor:        'pointer',
              fontFamily:    TYPOGRAPHY.mono,
              fontSize:      12,
              letterSpacing: '1px',
              padding:       '10px 24px',
              width:         '100%',
            }}
          >
            {t(lang, 'action.signout')}
          </button>
        )}
      </div>
    </div>
  )
}
