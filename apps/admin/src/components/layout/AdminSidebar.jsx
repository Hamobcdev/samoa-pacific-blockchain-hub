import React from 'react'
import { COLORS, TYPOGRAPHY, ROLES, TAPA_BG } from '../../theme.js'
import { t } from '../../i18n.js'

const NAV_ITEMS = [
  { key: 'command',    icon: '⬡', access: ['full','readonly','technical','finance'] },
  { key: 'governance', icon: '⚖', access: ['full'] },
  { key: 'compliance', icon: '✓', access: ['full','readonly'] },
  { key: 'nodes',      icon: '◎', access: ['full','readonly','technical'] },
  { key: 'audit',      icon: '⟳', access: ['full'] },
  { key: 'donor',      icon: '◈', access: ['full','readonly'] },
  // dbs: absorbed into command — Ministry Portals → MOF Dashboard
  { key: 'research',   icon: '◑', access: ['full','readonly','technical','finance'] },
]

export function AdminSidebar({ activePanel, onNav, role, lang, onSignOut, governancePending }) {
  const roleAccess = role?.access ?? 'readonly'
  const visibleItems = NAV_ITEMS.filter(item => item.access.includes(roleAccess))

  return (
    <nav
      data-print-hide
      aria-label="Administration navigation"
      style={{
        width:           220,
        minWidth:        220,
        background:      COLORS.surface,
        backgroundImage: TAPA_BG,
        borderRight:     `1px solid ${COLORS.border}`,
        display:         'flex',
        flexDirection:   'column',
        height:          '100%',
        overflow:        'hidden',
      }}
    >
      {/* Logo / identity */}
      <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.gold, fontFamily: TYPOGRAPHY.mono, fontSize: 9, letterSpacing: '2.5px', marginBottom: 3 }}>
          CBS ADMIN
        </div>
        <div style={{ color: COLORS.text, fontFamily: TYPOGRAPHY.sans, fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
          {t(lang, 'app.title')}
        </div>
        <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9, letterSpacing: '1px', marginTop: 4 }}>
          {role?.id ?? '—'}
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {visibleItems.map(item => {
          const isActive = activePanel === item.key
          const hasBadge = item.key === 'governance' && governancePending > 0

          return (
            <button
              key={item.key}
              onClick={() => onNav(item.key)}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             10,
                width:           '100%',
                background:      isActive ? COLORS.surface3 : 'transparent',
                border:          'none',
                borderLeft:      isActive ? `3px solid ${COLORS.gold}` : '3px solid transparent',
                color:           isActive ? COLORS.text : COLORS.textMuted,
                cursor:          'pointer',
                fontFamily:      TYPOGRAPHY.mono,
                fontSize:        11,
                letterSpacing:   '0.8px',
                padding:         '10px 16px',
                textAlign:       'left',
                transition:      'background 0.1s, color 0.1s',
                position:        'relative',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = COLORS.surface2 }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <span aria-hidden="true" style={{ fontSize: 13, width: 16, textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{t(lang, `nav.${item.key}`)}</span>
              {hasBadge && (
                <span
                  aria-label={`${governancePending} pending governance items`}
                  style={{
                    background:   COLORS.critical,
                    borderRadius: 8,
                    color:        '#fff',
                    fontFamily:   TYPOGRAPHY.mono,
                    fontSize:     9,
                    fontWeight:   700,
                    minWidth:     16,
                    padding:      '1px 4px',
                    textAlign:    'center',
                  }}
                >
                  {governancePending}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Phase 2 badge */}
      <div style={{ padding: '8px 16px', borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{
          background:    COLORS.blockedBg,
          border:        `1px solid ${COLORS.blockedBorder}`,
          borderRadius:  4,
          color:         COLORS.blocked,
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      9,
          letterSpacing: '1.5px',
          padding:       '4px 8px',
          textAlign:     'center',
        }}>
          {t(lang, 'phase2.label')} — PENDING CBS
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={onSignOut}
        style={{
          background:    'transparent',
          border:        'none',
          borderTop:     `1px solid ${COLORS.border}`,
          color:         COLORS.textDim,
          cursor:        'pointer',
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      10,
          letterSpacing: '1px',
          padding:       '12px 16px',
          textAlign:     'left',
          transition:    'color 0.1s',
          display:       'flex',
          alignItems:    'center',
          gap:           8,
        }}
        onMouseEnter={e => e.currentTarget.style.color = COLORS.critical}
        onMouseLeave={e => e.currentTarget.style.color = COLORS.textDim}
      >
        <span aria-hidden="true">⎋</span>
        {t(lang, 'action.signout')}
      </button>
    </nav>
  )
}
