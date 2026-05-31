import React from 'react'
import { COLORS, TYPOGRAPHY, CATEGORIES, ALL_TABS, ROLES } from '../../theme.js'
import { t } from '../../i18n.js'

export function CategoryNav({ activeCategory, activeTab, onCategory, onTab, roleId, lang }) {
  const role = ROLES[roleId] || ROLES['MOF_ANALYST']

  function canSeeTab(tabId) {
    if (role.tabs === 'all') return true
    return role.tabs.includes(tabId)
  }

  function canSeeCategory(catId) {
    const cat = CATEGORIES.find(c => c.id === catId)
    return cat ? cat.tabs.some(tid => canSeeTab(tid)) : false
  }

  const visibleCats = CATEGORIES.filter(c => canSeeCategory(c.id))
  const activeCat   = CATEGORIES.find(c => c.id === activeCategory) || visibleCats[0]
  const tabsForCat  = activeCat
    ? ALL_TABS.filter(tb => tb.category === activeCat.id && canSeeTab(tb.id))
    : []

  return (
    <div style={{
      background:   '#ffffff',
      borderBottom: `1px solid ${COLORS.border}`,
      flexShrink:   0,
    }}>
      {/* Category row */}
      <div style={{
        display:      'flex',
        padding:      '8px 24px 0',
        gap:          6,
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        {visibleCats.map(cat => {
          const isActive = cat.id === activeCategory
          return (
            <button
              key={cat.id}
              onClick={() => {
                onCategory(cat.id)
                const firstTab = ALL_TABS.find(tb => tb.category === cat.id && canSeeTab(tb.id))
                if (firstTab) onTab(firstTab.id)
              }}
              style={{
                background:    isActive ? COLORS.govBlue : '#ffffff',
                border:        `1px solid ${isActive ? COLORS.govBlue : COLORS.border}`,
                borderBottom:  'none',
                borderRadius:  '4px 4px 0 0',
                color:         isActive ? '#ffffff' : COLORS.textMuted,
                cursor:        'pointer',
                fontFamily:    TYPOGRAPHY.mono,
                fontSize:      11,
                fontWeight:    isActive ? 700 : 400,
                letterSpacing: '0.6px',
                padding:       '7px 14px',
                textTransform: 'uppercase',
                transition:    'background 0.15s, color 0.15s',
                whiteSpace:    'nowrap',
                position:      'relative',
                bottom:        -1,
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = COLORS.govBlueBg; e.currentTarget.style.color = COLORS.govBlue } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = COLORS.textMuted } }}
            >
              {t(lang, `cat.${cat.id}`) !== `cat.${cat.id}` ? t(lang, `cat.${cat.id}`) : cat.label}
            </button>
          )
        })}
      </div>

      {/* Tab strip */}
      <div style={{
        display:        'flex',
        padding:        '0 24px',
        gap:            0,
        overflowX:      'auto',
        flexWrap:       'nowrap',
        scrollbarWidth: 'thin',
        background:     '#ffffff',
      }}>
        {tabsForCat.map(tab => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onTab(tab.id)}
              style={{
                background:    'transparent',
                border:        'none',
                borderBottom:  isActive ? `2px solid ${COLORS.govBlue}` : '2px solid transparent',
                color:         isActive ? COLORS.govBlue : COLORS.textMuted,
                cursor:        'pointer',
                fontFamily:    TYPOGRAPHY.mono,
                fontSize:      12,
                fontWeight:    isActive ? 600 : 400,
                letterSpacing: '0.4px',
                padding:       '9px 16px',
                transition:    'color 0.15s, border-color 0.15s',
                whiteSpace:    'nowrap',
                flexShrink:    0,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = COLORS.govBlue }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = COLORS.textMuted }}
            >
              {lang === 'SM' ? tab.labelSM : tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
