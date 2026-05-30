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
    ? ALL_TABS.filter(t => t.category === activeCat.id && canSeeTab(t.id))
    : []

  return (
    <div style={{
      background:   COLORS.surface,
      borderBottom: `1px solid ${COLORS.border}`,
      flexShrink:   0,
    }}>
      {/* Category row */}
      <div style={{ display: 'flex', padding: '0 24px', gap: 4, borderBottom: `1px solid ${COLORS.border}` }}>
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
                background:    isActive ? COLORS.govBlue : 'transparent',
                border:        'none',
                borderBottom:  isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                color:         isActive ? COLORS.gold : COLORS.textMuted,
                cursor:        'pointer',
                fontFamily:    TYPOGRAPHY.mono,
                fontSize:      11,
                fontWeight:    isActive ? 700 : 400,
                letterSpacing: '0.8px',
                padding:       '10px 14px',
                textTransform: 'uppercase',
                transition:    'background 0.15s, color 0.15s, border-color 0.15s',
                whiteSpace:    'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = COLORS.surface2; e.currentTarget.style.color = COLORS.text } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.textMuted } }}
            >
              {t(lang, `cat.${cat.id}`) !== `cat.${cat.id}` ? t(lang, `cat.${cat.id}`) : cat.label}
            </button>
          )
        })}
      </div>

      {/* Tab strip */}
      <div style={{
        display:         'flex',
        padding:         '0 24px',
        gap:             0,
        overflowX:       'auto',
        flexWrap:        'nowrap',
        scrollbarWidth:  'thin',
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
                borderBottom:  isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                color:         isActive ? COLORS.text : COLORS.textMuted,
                cursor:        'pointer',
                fontFamily:    TYPOGRAPHY.mono,
                fontSize:      11,
                fontWeight:    isActive ? 600 : 400,
                letterSpacing: '0.5px',
                padding:       '8px 16px',
                transition:    'color 0.15s, border-color 0.15s',
                whiteSpace:    'nowrap',
                flexShrink:    0,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = COLORS.text }}
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
