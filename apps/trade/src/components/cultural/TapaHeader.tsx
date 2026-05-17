import React from 'react'
import { C } from '../../constants'

const TAPA_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'>
    <rect width='48' height='48' fill='none'/>
    <path d='M0 12 L12 0 M0 24 L24 0 M0 36 L36 0 M0 48 L48 0
             M12 48 L48 12 M24 48 L48 24 M36 48 L48 36'
          stroke='rgba(201,162,39,0.12)' stroke-width='0.7'/>
    <rect x='18' y='18' width='12' height='12'
          fill='none' stroke='rgba(0,48,135,0.12)' stroke-width='0.7'/>
    <circle cx='24' cy='24' r='2'
            fill='none' stroke='rgba(201,162,39,0.08)' stroke-width='0.7'/>
  </svg>`
)

interface Props {
  height?: number
}

export function TapaHeader({ height = 8 }: Props) {
  return (
    <div
      aria-hidden="true"
      style={{
        height,
        background:      `${C.flagBlue}`,
        backgroundImage: `url("data:image/svg+xml,${TAPA_SVG}")`,
        backgroundSize:  '48px 48px',
        borderBottom:    `1px solid ${C.gold}30`,
      }}
    />
  )
}
