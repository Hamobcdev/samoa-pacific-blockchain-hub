import React from 'react'
import { FL, SERVICE_CATEGORIES } from '../theme.js'

export default function ServiceCard({ service, t, lang, onSelect }) {
  const [hovered, setHovered] = React.useState(false)
  const cat = SERVICE_CATEGORIES.find(c => c.id === service.category) || SERVICE_CATEGORIES[0]

  return (
    <div
      onClick={() => onSelect(service)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:     'relative',
        background:   '#FFFFFF',
        border:       `1px solid ${hovered ? '#003087' : '#DDD6C8'}`,
        borderRadius: '12px',
        padding:      '16px',
        boxShadow:    hovered
          ? '0 6px 20px rgba(0,48,135,0.14)'
          : '0 2px 8px rgba(0,48,135,0.06)',
        cursor:       'pointer',
        transition:   'border-color 0.2s, box-shadow 0.2s',
        display:      'flex',
        flexDirection:'column',
        gap:          '8px',
      }}
    >
      {/* Popular badge */}
      {service.popular && (
        <span style={{
          position:      'absolute',
          top:           '10px',
          right:         '10px',
          background:    '#CE1126',
          color:         '#FFFFFF',
          fontFamily:    FL.mono,
          fontSize:      '8px',
          fontWeight:    700,
          letterSpacing: '0.5px',
          padding:       '2px 6px',
          borderRadius:  '8px',
        }}>
          Popular
        </span>
      )}

      {/* Top row: icon + ministry badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '22px', color: cat.color, lineHeight: 1 }}>{cat.icon}</span>
        <span style={{
          fontFamily:    FL.mono,
          fontSize:      '9px',
          fontWeight:    700,
          color:         cat.color,
          background:    cat.color + '18',
          border:        `1px solid ${cat.color}44`,
          borderRadius:  '8px',
          padding:       '2px 7px',
          letterSpacing: '0.3px',
        }}>
          {service.ministryCode}
        </span>
      </div>

      {/* Service name */}
      <div style={{
        fontFamily: FL.ui,
        fontSize:   '15px',
        fontWeight: 600,
        color:      '#1A1A2E',
        lineHeight: 1.3,
      }}>
        {service.nameKey}
      </div>

      {/* Fee + Time pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{
          background:    '#FFF3CC',
          color:         '#B87000',
          fontFamily:    FL.mono,
          fontSize:      '10px',
          fontWeight:    600,
          padding:       '3px 8px',
          borderRadius:  '8px',
        }}>
          {t('service.fee')}: {service.fee}
        </span>
        <span style={{
          background:    '#EEF3FB',
          color:         '#003087',
          fontFamily:    FL.mono,
          fontSize:      '10px',
          fontWeight:    600,
          padding:       '3px 8px',
          borderRadius:  '8px',
        }}>
          {t('service.time')}: {service.time}
        </span>
      </div>
    </div>
  )
}
