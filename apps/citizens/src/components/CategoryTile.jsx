import React from 'react'
import { FL } from '../theme.js'

export default function CategoryTile({ category, t, onSelect }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onClick={() => onSelect(category)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        aspectRatio:   '1 / 1',
        background:    '#FFFFFF',
        border:        `1px solid ${hovered ? category.color : '#DDD6C8'}`,
        borderRadius:  '16px',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        justifyContent:'center',
        gap:           '6px',
        cursor:        'pointer',
        transition:    'border-color 0.2s, box-shadow 0.2s',
        boxShadow:     hovered
          ? `0 4px 12px ${category.color}22`
          : '0 1px 4px rgba(0,0,0,0.06)',
        padding:       '8px',
        userSelect:    'none',
      }}
    >
      <span style={{
        fontSize:   '28px',
        lineHeight: 1,
        transform:  hovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.2s',
        display:    'block',
      }}>
        {category.icon}
      </span>
      <span style={{
        fontFamily:  FL.ui,
        fontSize:    '10px',
        fontWeight:  600,
        color:       hovered ? category.color : '#3A3A5C',
        textAlign:   'center',
        lineHeight:  1.2,
        transition:  'color 0.2s',
      }}>
        {t(`category.${category.id}`)}
      </span>
    </div>
  )
}
