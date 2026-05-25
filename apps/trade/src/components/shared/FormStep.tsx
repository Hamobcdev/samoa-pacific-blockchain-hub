import React from 'react'
import { C, MONO, SANS } from '../../constants'

interface Props {
  step:     number
  total:    number
  title:    string
  children: React.ReactNode
}

export function FormStep({ step, total, title, children }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
        <span
          aria-label={`Step ${step} of ${total}`}
          style={{
            background:   C.flagBlue,
            borderRadius: '50%',
            color:        '#fff',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            fontFamily:   MONO,
            fontSize:     13,
            fontWeight:   700,
            height:       36,
            minWidth:     36,
            width:        36,
          }}
        >
          {step}
        </span>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Step {step} of {total}
          </div>
          <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, color: C.text }}>
            {title}
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
