import React, { useState } from 'react'
// @ts-ignore
import { LanguageProvider, CurrencyProvider } from '@samoa-dpi/shared-ui'
import { C, MONO, SANS, TAPA_BG } from './constants'
import { OMWAuthGate } from './components/OMWAuthGate'
import { ShippingAgentDashboard } from './components/ShippingAgentDashboard'
import { FreightForwarderDashboard } from './components/FreightForwarderDashboard'
import { GovOfficerDashboard } from './components/GovOfficerDashboard'
import { PortalFooter } from './components/layout/PortalFooter'
import type { OMWAuthResult } from './types'

function wst() {
  return new Date().toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })
}

function AppInner() {
  const [session, setSession] = useState<OMWAuthResult | null>(null)

  if (!session) {
    return <OMWAuthGate onAuthenticated={setSession} />
  }

  const isGov      = session.zone === 2
  const bandColor  = isGov ? C.amber : C.info
  const bandBg     = isGov ? `${C.amber}18` : `${C.flagBlue}22`
  const bandBdr    = isGov ? C.amberBdr : C.border2
  const bandLabel  = isGov ? 'ZONE 2 — RESTRICTED OFFICIAL' : 'ZONE 1 — OFFICIAL'

  return (
    <div style={{ minHeight: '100dvh', background: C.bg, backgroundImage: TAPA_BG, display: 'flex', flexDirection: 'column' }}>

      {/* Classification band */}
      <div style={{ background: bandBg, borderBottom: `1px solid ${bandBdr}`, padding: '4px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: 9, color: bandColor, letterSpacing: '2px' }}>
          {bandLabel}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1px' }}>
          Session: {wst()} WST
        </span>
      </div>

      {/* Portal header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.gold, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 2 }}>
            Samoa One-Stop Maritime Window
          </div>
          <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, color: C.text }}>
            {session.label}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, textAlign: 'right' }}>
            <div>Authenticated</div>
            <div style={{ color: C.dim, fontSize: 9, marginTop: 2 }}>
              {new Date(session.authedAt).toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })} WST
            </div>
          </div>
          <button
            onClick={() => setSession(null)}
            aria-label="Sign out"
            style={{
              background:    'none',
              border:        `1px solid ${C.border2}`,
              borderRadius:  4,
              color:         C.muted,
              cursor:        'pointer',
              fontFamily:    MONO,
              fontSize:      10,
              letterSpacing: '1px',
              padding:       '6px 12px',
            }}
          >
            SIGN OUT
          </button>
        </div>
      </div>

      {/* Demo research banner */}
      <div style={{ background: `${C.amber}10`, borderBottom: `1px solid ${C.amberBdr}`, padding: '5px 24px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: 9, color: C.amber, letterSpacing: '1.5px' }}>
          RESEARCH PROTOTYPE
        </span>
        <span style={{ fontFamily: SANS, fontSize: 11, color: C.amber }}>
          NUS / ISOC Research Programme 2026 · No real government data · Not an operational system
        </span>
      </div>

      {/* Main content */}
      <main style={{ flex: 1, padding: '24px', maxWidth: 960, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {session.role === 'SHIPPING_AGENT'   && <ShippingAgentDashboard    session={session} />}
        {session.role === 'FREIGHT_FORWARDER' && <FreightForwarderDashboard session={session} />}
        {session.role === 'GOV_OFFICER'       && <GovOfficerDashboard       session={session} />}
      </main>

      <PortalFooter />
    </div>
  )
}

export function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AppInner />
      </CurrencyProvider>
    </LanguageProvider>
  )
}
