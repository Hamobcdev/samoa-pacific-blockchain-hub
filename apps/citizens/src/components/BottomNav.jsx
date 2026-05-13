import React from 'react'
import { FL } from '../theme.js'

const NAV_ITEMS = [
  { id: 'home',     icon: '⌂',  labelKey: 'nav.home'     },
  { id: 'browse',   icon: '☰',  labelKey: 'nav.services' },
  { id: 'track',    icon: '◎',  labelKey: 'nav.track'    },
  { id: 'language', icon: '🌐', labelKey: 'nav.language.toggle' },
]

export default function BottomNav({ currentScreen, onNavigate, toggleLang, t }) {
  return (
    <>
      <style>{`
        .bottom-nav { display: none; }
        @media (max-width: 640px) { .bottom-nav { display: flex !important; } }
      `}</style>
      <nav className="bottom-nav" style={{
        position:        'fixed',
        bottom:          0,
        left:            0,
        right:           0,
        zIndex:          40,
        background:      '#FFFFFF',
        borderTop:       '1px solid #DDD6C8',
        height:          '64px',
        paddingBottom:   'env(safe-area-inset-bottom)',
        display:         'none',
        alignItems:      'stretch',
        boxSizing:       'border-box',
      }}>
        {NAV_ITEMS.map(item => {
          const active = item.id !== 'language' && currentScreen === item.id
          const handleClick = () => {
            if (item.id === 'language') toggleLang()
            else onNavigate(item.id)
          }
          return (
            <button
              key={item.id}
              onClick={handleClick}
              style={{
                flex:            1,
                display:         'flex',
                flexDirection:   'column',
                alignItems:      'center',
                justifyContent:  'center',
                gap:             '2px',
                background:      'transparent',
                border:          'none',
                borderTop:       active ? '2px solid #003087' : '2px solid transparent',
                cursor:          'pointer',
                padding:         '6px 0 4px',
                minHeight:       '44px',
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.icon}</span>
              <span style={{
                fontFamily:  FL.ui,
                fontSize:    '10px',
                fontWeight:  active ? 700 : 400,
                color:       active ? '#003087' : '#7A7A9A',
                lineHeight:  1,
              }}>
                {t(item.labelKey)}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
