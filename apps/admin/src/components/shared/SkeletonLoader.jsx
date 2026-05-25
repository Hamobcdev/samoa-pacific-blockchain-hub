import React from 'react'
import { COLORS } from '../../theme.js'

const shimmerStyle = {
  background: `linear-gradient(90deg, ${COLORS.surface2} 25%, ${COLORS.surface3} 50%, ${COLORS.surface2} 75%)`,
  backgroundSize: '400px 100%',
  animation: 'shimmer 1.4s infinite linear',
  borderRadius: 4,
}

export function SkeletonBlock({ width = '100%', height = 16, style = {} }) {
  return (
    <div
      aria-hidden="true"
      style={{ width, height, ...shimmerStyle, ...style }}
    />
  )
}

export function SkeletonPanel({ rows = 4, style = {} }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading panel"
      style={{
        background:   COLORS.surface,
        border:       `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding:      24,
        display:      'flex',
        flexDirection: 'column',
        gap:          12,
        ...style,
      }}
    >
      <SkeletonBlock height={20} width="45%" />
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonBlock key={i} height={14} width={i % 2 === 0 ? '100%' : '72%'} />
      ))}
    </div>
  )
}
