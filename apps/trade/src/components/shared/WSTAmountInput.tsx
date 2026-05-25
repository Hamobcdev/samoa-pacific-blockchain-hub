import React from 'react'
import { C, MONO, SANS } from '../../constants'

interface Props {
  id:           string
  label:        string
  value:        string
  onChange:     (v: string) => void
  error?:       string
  disabled?:    boolean
  placeholder?: string
}

export function WSTAmountInput({ id, label, value, onChange, error, disabled, placeholder = '0.00' }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    onChange(raw)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label htmlFor={id} style={{ fontFamily: SANS, fontSize: 13, color: C.muted, fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <span style={{
          background:   C.surface2,
          border:       `1px solid ${error ? C.critical : C.border}`,
          borderRight:  'none',
          borderRadius: '4px 0 0 4px',
          color:        C.gold,
          fontFamily:   MONO,
          fontSize:     13,
          fontWeight:   600,
          padding:      '8px 12px',
          whiteSpace:   'nowrap',
        }}>
          WST
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          style={{
            background:   C.surface2,
            border:       `1px solid ${error ? C.critical : C.border}`,
            borderRadius: '0 4px 4px 0',
            color:        C.text,
            fontFamily:   MONO,
            fontSize:     14,
            fontWeight:   500,
            padding:      '8px 12px',
            width:        '100%',
            outline:      'none',
            textAlign:    'right',
          }}
        />
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" aria-live="polite" style={{ color: C.critical, fontFamily: SANS, fontSize: 12 }}>
          {error}
        </span>
      )}
    </div>
  )
}
