import React, { useState, useRef, useEffect } from 'react'
import { C, MONO, SANS, TAPA_BG } from '../constants'
import type { OMWAuthResult } from '../types'

const AUTH_MAP: Record<string, Omit<OMWAuthResult, 'authedAt'>> = {
  'SHIPPING-AGENT-2026': { role: 'SHIPPING_AGENT',   zone: 1, label: 'Shipping Agent / Ship Master',     agency: null },
  'FREIGHT-2026':        { role: 'FREIGHT_FORWARDER', zone: 1, label: 'Freight Forwarder / Trade Agent',  agency: null },
  'CUSTOMS-2026':        { role: 'GOV_OFFICER',       zone: 2, label: 'Customs Officer — MOR',            agency: 'CUSTOMS' },
  'MAF-2026':            { role: 'GOV_OFFICER',       zone: 2, label: 'MAF Biosecurity Officer',          agency: 'MAF' },
  'PORT-HEALTH-2026':    { role: 'GOV_OFFICER',       zone: 2, label: 'Port Health Officer — MOH',        agency: 'PORT_HEALTH' },
  'SPA-2026':            { role: 'GOV_OFFICER',       zone: 2, label: 'SPA Port Operations Officer',      agency: 'SPA' },
}

interface Props {
  onAuthenticated: (result: OMWAuthResult) => void
}

export function OMWAuthGate({ onAuthenticated }: Props) {
  const [credential, setCredential] = useState('')
  const [error, setError]           = useState(false)
  const [loading, setLoading]       = useState(false)
  const inputRef                    = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const upper    = credential.trim().toUpperCase()
  const preview  = AUTH_MAP[upper]
  const isGov    = preview?.zone === 2
  const bandColor = preview ? (isGov ? C.amber : C.info) : C.muted
  const bandBg    = preview ? (isGov ? `${C.amber}18` : `${C.flagBlue}22`) : `${C.surface2}`
  const bandBdr   = preview ? (isGov ? C.amberBdr : C.border2) : C.border
  const bandLabel = preview
    ? (isGov ? 'ZONE 2 — RESTRICTED OFFICIAL' : 'ZONE 1 — OFFICIAL')
    : 'GOVERNMENT AND COMMERCIAL USERS'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!credential.trim()) return
    setLoading(true)
    const entry = AUTH_MAP[upper]
    setTimeout(() => {
      if (!entry) {
        setError(true)
        setLoading(false)
        setCredential('')
        setTimeout(() => setError(false), 3000)
        return
      }
      onAuthenticated({ ...entry, authedAt: new Date().toISOString() })
    }, 400)
  }

  return (
    <div style={{ minHeight: '100dvh', background: C.bg, backgroundImage: TAPA_BG, display: 'flex', flexDirection: 'column' }}>
      {/* Top classification band */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '4px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '2px', textTransform: 'uppercase' }}>
          Independent State of Samoa
        </span>
        <span style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1px' }}>
          Digital Public Infrastructure · OMW
        </span>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.gold, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 10 }}>
              SAMOA ONE-STOP MARITIME WINDOW
            </div>
            <div style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 6 }}>
              Authorised Access
            </div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>
              Government and Commercial Users
            </div>
          </div>

          {/* Dynamic classification band */}
          <div style={{ background: bandBg, border: `1px solid ${bandBdr}`, borderRadius: 4, padding: '6px 12px', marginBottom: 24, textAlign: 'center', transition: 'all 0.2s' }}>
            <span style={{ fontFamily: MONO, fontSize: 9, color: bandColor, letterSpacing: '2px' }}>
              {bandLabel}
            </span>
          </div>

          {/* Auth form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label htmlFor="omw-cred" style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: '1px' }}>
              Enter Access Credential
            </label>
            <input
              ref={inputRef}
              id="omw-cred"
              type="password"
              value={credential}
              onChange={e => { setCredential(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit(e as unknown as React.FormEvent)}
              placeholder="ENTER CREDENTIAL"
              autoComplete="off"
              spellCheck={false}
              aria-label="Access credential"
              style={{
                background:    C.surface2,
                border:        `1px solid ${error ? C.critical : C.border}`,
                borderRadius:  4,
                color:         C.text,
                fontFamily:    MONO,
                fontSize:      13,
                letterSpacing: '2px',
                outline:       'none',
                padding:       '12px 14px',
                textAlign:     'center',
              }}
            />

            {error && (
              <div role="alert" style={{ fontFamily: MONO, fontSize: 11, color: C.critical, textAlign: 'center', letterSpacing: '1px' }}>
                Invalid credential — access denied
              </div>
            )}

            {preview && !error && (
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.green, textAlign: 'center' }}>
                ✓ {preview.label}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !credential.trim()}
              style={{
                background:    loading ? C.surface3 : C.flagBlue,
                border:        'none',
                borderRadius:  4,
                color:         '#fff',
                cursor:        loading || !credential.trim() ? 'not-allowed' : 'pointer',
                fontFamily:    MONO,
                fontSize:      11,
                fontWeight:    700,
                letterSpacing: '2px',
                marginTop:     4,
                minHeight:     44,
                opacity:       !credential.trim() ? 0.4 : 1,
                transition:    'background 0.15s',
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
            </button>
          </form>

          {/* Disclaimer */}
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, textAlign: 'center', marginTop: 24, lineHeight: 1.8, letterSpacing: '0.5px' }}>
            RESEARCH PROTOTYPE · NUS / ISOC Research Programme 2026<br />
            No real government data · Not an operational system<br />
            All access attempts are logged to the audit ledger
          </div>
        </div>
      </div>

      {/* Footer band */}
      <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: '8px 20px', textAlign: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: 9, color: C.dim, letterSpacing: '1px' }}>
          Samoa OMW · IMO FAL 2024 · WCO SAFE 2025 · ASYCUDA World · ISO 28000:2022
        </span>
      </div>
    </div>
  )
}
