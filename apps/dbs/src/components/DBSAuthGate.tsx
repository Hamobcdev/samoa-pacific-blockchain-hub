import { useState } from 'react'

interface AuthResult {
  role: string
  inst: string | null
  label: string
}

interface DBSAuthGateProps {
  onAuthenticated: (role: string, inst: string | null, label: string) => void
}

const AUTH_MAP: Record<string, AuthResult> = {
  'DBS-STAFF-2026':   { role: 'DBS_STAFF',   inst: null,     label: 'DBS Staff' },
  'ANZ-OFFICER-2026': { role: 'BANK_OFFICER', inst: 'ANZ-WS', label: 'Bank Officer — ANZ-WS' },
  'BSP-OFFICER-2026': { role: 'BANK_OFFICER', inst: 'BSP-WS', label: 'Bank Officer — BSP-WS' },
  'SCB-OFFICER-2026': { role: 'BANK_OFFICER', inst: 'SCB-WS', label: 'Bank Officer — SCB-WS' },
  'NBS-OFFICER-2026': { role: 'BANK_OFFICER', inst: 'NBS-WS', label: 'Bank Officer — NBS-WS' },
  'DBS-OFFICER-2026': { role: 'BANK_OFFICER', inst: 'DBS-WS', label: 'Bank Officer — DBS-WS' },
}

export function DBSAuthGate({ onAuthenticated }: DBSAuthGateProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const match = AUTH_MAP[code.trim()]
    if (match) {
      onAuthenticated(match.role, match.inst, match.label)
    } else {
      setError('Invalid access code')
      setCode('')
    }
  }

  return (
    <div style={{
      minHeight:      '100vh',
      background:     'var(--color-bg)',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '40px 20px',
      gap:            '24px',
    }}>
      {/* Zone 2 classification band */}
      <div style={{
        position:       'fixed',
        top:            0,
        left:           0,
        right:          0,
        background:     '#173404',
        height:         32,
        zIndex:         1000,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '0 20px',
        fontFamily:     "'IBM Plex Mono', monospace",
      }}>
        <span style={{ color: '#97C459', fontSize: 10, letterSpacing: 2, fontWeight: 500 }}>
          ZONE 2 · RESTRICTED · OFFICIAL
        </span>
        <span style={{ color: '#97C459', fontSize: 10, letterSpacing: 2, opacity: 0.7 }}>
          SAMOA DPI
        </span>
      </div>

      {/* Samoa flag accent */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
        <div style={{ width: '28px', height: '5px', background: 'var(--color-flag-red)', borderRadius: '2px' }} />
        <div style={{ width: '28px', height: '5px', background: 'var(--color-flag-blue)', borderRadius: '2px' }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily:    "'IBM Plex Mono', monospace",
          fontSize:      '16px',
          fontWeight:    700,
          color:         'var(--color-text)',
          letterSpacing: '-0.3px',
        }}>
          WST-DPI DISTRIBUTION PORTAL
        </h1>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize:   '11px',
          color:      'var(--color-muted)',
          marginTop:  '4px',
        }}>
          Institutional Access
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '380px' }}
      >
        <label style={{
          fontFamily:    "'IBM Plex Mono', monospace",
          fontSize:      '10px',
          color:         'var(--color-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Institution Access Code
        </label>

        <input
          type="password"
          value={code}
          onChange={e => { setCode(e.target.value); setError('') }}
          autoComplete="off"
          aria-label="Institution Access Code"
          style={{
            background:  'var(--color-surface)',
            border:      '1px solid var(--color-border)',
            borderRadius: '4px',
            color:       'var(--color-text)',
            fontFamily:  "'IBM Plex Mono', monospace",
            fontSize:    '13px',
            padding:     '10px 14px',
            outline:     'none',
            width:       '100%',
          }}
        />

        {error && (
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize:   '10px',
            color:      'var(--color-critical)',
          }}>
            {error}
          </span>
        )}

        <button
          type="submit"
          style={{
            background:    'var(--color-gold)',
            border:        'none',
            borderRadius:  '4px',
            color:         '#000',
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      '12px',
            fontWeight:    700,
            padding:       '10px 20px',
            cursor:        'pointer',
            letterSpacing: '0.5px',
          }}
        >
          Authenticate
        </button>
      </form>
    </div>
  )
}
