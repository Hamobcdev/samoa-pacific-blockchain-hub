import React from 'react'
import { COLORS, TYPOGRAPHY, ROLES, CATEGORIES, ALL_TABS } from '../../theme.js'
import { t } from '../../i18n.js'

const CATEGORY_ICONS = {
  fiscal:       '◎',
  compliance:   '⚖',
  transparency: '◈',
  pacific:      '◑',
}

const TAB_ICONS = {
  command:     '⬡',
  budget:      '◼',
  revenue:     '▲',
  debt:        '◐',
  trade:       '⟳',
  pefa:        '✓',
  compliance:  '⚖',
  imf:         '◻',
  donors:      '◈',
  procurement: '◆',
  oracle:      '#',
  pacific:     '◑',
}

export function MOFSidebar({ activeTab, onTab, roleId, lang, onSignOut }) {
  const role = ROLES[roleId] || ROLES['MOF_ANALYST']

  function canSeeTab(tabId) {
    if (role.tabs === 'all') return true
    return role.tabs.includes(tabId)
  }

  return (
    <nav
      data-print-hide
      aria-label="MOF navigation"
      style={{
        width:         200,
        minWidth:      200,
        background:    COLORS.surface,
        borderRight:   `1px solid ${COLORS.border}`,
        display:       'flex',
        flexDirection: 'column',
        height:        '100%',
        overflow:      'hidden',
      }}
    >
      {/* Identity */}
      <div style={{ padding: '16px 14px 14px', borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.gold, fontFamily: TYPOGRAPHY.mono, fontSize: 11, letterSpacing: '2px', marginBottom: 3 }}>
          MOF ADMIN
        </div>
        <div style={{ color: COLORS.text, fontFamily: TYPOGRAPHY.sans, fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>
          Ministry of Finance
        </div>
        <div style={{ color: role.color, fontFamily: TYPOGRAPHY.mono, fontSize: 11, letterSpacing: '1px', marginTop: 3 }}>
          {role.id}
        </div>
        <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 11, marginTop: 1 }}>
          Level {role.level}
        </div>
      </div>

      {/* Grouped nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
        {CATEGORIES.map(cat => {
          const visibleTabs = ALL_TABS.filter(tb => tb.category === cat.id && canSeeTab(tb.id))
          if (visibleTabs.length === 0) return null
          return (
            <div key={cat.id}>
              <div style={{
                padding:       '8px 14px 4px',
                fontFamily:    TYPOGRAPHY.mono,
                fontSize:      11,
                color:         COLORS.textDim,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display:       'flex',
                alignItems:    'center',
                gap:           6,
              }}>
                <span style={{ fontSize: 10 }}>{CATEGORY_ICONS[cat.id]}</span>
                {cat.label}
              </div>
              {visibleTabs.map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTab(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display:       'flex',
                      alignItems:    'center',
                      gap:           8,
                      width:         '100%',
                      background:    isActive ? COLORS.surface3 : 'transparent',
                      border:        'none',
                      borderLeft:    isActive ? `3px solid ${COLORS.gold}` : '3px solid transparent',
                      color:         isActive ? COLORS.gold : COLORS.textMuted,
                      cursor:        'pointer',
                      fontFamily:    TYPOGRAPHY.mono,
                      fontSize:      11,
                      letterSpacing: '0.5px',
                      padding:       '8px 14px',
                      textAlign:     'left',
                      transition:    'background 0.1s, color 0.1s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = COLORS.surface2 }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span aria-hidden="true" style={{ fontSize: 12, width: 14, textAlign: 'center', flexShrink: 0 }}>
                      {TAB_ICONS[tab.id] || '·'}
                    </span>
                    <span style={{ flex: 1 }}>
                      {lang === 'SM' ? tab.labelSM : tab.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Standards footer */}
      <div style={{ padding: '8px 14px', borderTop: `1px solid ${COLORS.border}` }}>
        {['PFM Act 2001', 'PEFA 2016', 'OCDS 1.1.5'].map(s => (
          <div key={s} style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim, lineHeight: 1.8 }}>
            {s}
          </div>
        ))}
        <div style={{
          marginTop:     6,
          background:    COLORS.fiscalBg,
          border:        `1px solid ${COLORS.fiscalBorder}`,
          borderRadius:  3,
          color:         COLORS.fiscal,
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      11,
          letterSpacing: '0.5px',
          padding:       '3px 8px',
          textAlign:     'center',
        }}>
          {t(lang, 'phase2.pending')}
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
          fontSize:      11,
          letterSpacing: '1px',
          padding:       '11px 14px',
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
