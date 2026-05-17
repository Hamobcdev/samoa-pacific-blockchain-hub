import React from 'react'
import { C, MONO, SANS } from '../../constants'

interface Props {
  id:       string
  value:    string
  onChange: (v: string) => void
  label?:   string
}

export function OfficerCredentialInput({ id, value, onChange, label = 'Officer Credential Hash' }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label htmlFor={id} style={{ fontFamily: SANS, fontSize: 13, color: C.muted, fontWeight: 500 }}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0x..."
        style={{
          background:   C.surface2,
          border:       `1px solid ${C.border}`,
          borderRadius: 4,
          color:        C.text,
          fontFamily:   MONO,
          fontSize:     12,
          letterSpacing: '0.3px',
          padding:      '8px 12px',
          outline:      'none',
          width:        '100%',
        }}
      />
      <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>
        Enter your officer credential hash for on-chain audit trail
      </span>
    </div>
  )
}
