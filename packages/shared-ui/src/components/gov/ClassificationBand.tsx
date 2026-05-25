import React from 'react'

const ZONE_STYLES = {
  4: { bg: '#A32D2D', text: '#FFFFFF', label: 'ZONE 4 · EMERGENCY AUTHORITY' },
  3: { bg: '#633806', text: '#FAC775', label: 'ZONE 3 · CONFIDENTIAL' },
  2: { bg: '#173404', text: '#97C459', label: 'ZONE 2 · RESTRICTED · OFFICIAL' },
  1: { bg: '#042C53', text: '#B5D4F4', label: 'ZONE 1 · UNCLASSIFIED' },
  0: { bg: '#0a0f14', text: '#4a6070', label: 'RESTRICTED — GOVERNMENT USE ONLY' },
} as const

interface ClassificationBandProps {
  zone: 1 | 2 | 3 | 4 | null
  role?: string
}

export function ClassificationBand({ zone, role }: ClassificationBandProps) {
  const key = (zone ?? 0) as keyof typeof ZONE_STYLES
  const style = ZONE_STYLES[key] ?? ZONE_STYLES[0]

  return (
    <div style={{
      background:    style.bg,
      height:        32,
      display:       'flex',
      alignItems:    'center',
      justifyContent:'space-between',
      padding:       '0 20px',
      position:      'sticky',
      top:           0,
      zIndex:        1000,
      fontFamily:    "'IBM Plex Mono', monospace",
      flexShrink:    0,
    }}>
      <span style={{ color: style.text, fontSize: 10, letterSpacing: 2, fontWeight: 500 }}>
        {style.label}
      </span>
      {role && (
        <span style={{ color: style.text, fontSize: 10, letterSpacing: 2, opacity: 0.8 }}>
          {role}
        </span>
      )}
      <span style={{ color: style.text, fontSize: 10, letterSpacing: 2, opacity: 0.6 }}>
        SAMOA DPI
      </span>
    </div>
  )
}
