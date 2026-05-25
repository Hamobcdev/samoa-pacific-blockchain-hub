import React from 'react'
import { C, MONO, t } from '../../constants'
import type { ActiveTab } from '../../types'
import type { LangKey } from '../../constants'

interface Props {
  active:   ActiveTab
  onChange: (tab: ActiveTab) => void
  lang:     string
}

export function TabNav({ active, onChange, lang }: Props) {
  const tabs: Array<{ id: ActiveTab; labelKey: LangKey; icon: string }> = [
    { id: 'maritime', labelKey: 'maritimeTab', icon: '🚢' },
    { id: 'aviation', labelKey: 'aviationTab', icon: '✈' },
  ]

  return (
    <nav
      role="tablist"
      aria-label="Portal sections"
      style={{
        background:   C.surface,
        borderBottom: `1px solid ${C.border}`,
        display:      'flex',
        gap:          0,
        padding:      '0 24px',
      }}
    >
      {tabs.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            style={{
              background:   'none',
              border:       'none',
              borderBottom: isActive ? `2px solid ${C.flagBlue}` : '2px solid transparent',
              color:        isActive ? C.text : C.muted,
              cursor:       'pointer',
              fontFamily:   MONO,
              fontSize:     12,
              fontWeight:   isActive ? 600 : 400,
              letterSpacing:'0.5px',
              marginBottom: -1,
              minHeight:    44,
              padding:      '0 20px',
              transition:   'color 0.15s, border-color 0.15s',
            }}
          >
            <span aria-hidden="true" style={{ marginRight: 6 }}>{tab.icon}</span>
            {t(lang as Parameters<typeof t>[0], tab.labelKey)}
          </button>
        )
      })}
    </nav>
  )
}
