import React, { useEffect, useState } from 'react'
import { ResearchGate, ClassificationBand } from '@samoa-dpi/shared-ui'
import { getSession, parseZoneFromToken, parseRoleFromToken } from './lib/gov-auth'

const MONO = "'IBM Plex Mono', monospace"
const SANS = "'DM Sans', sans-serif"

const C = {
  bg:      '#070910',
  surface: '#0c1222',
  border:  '#1b2540',
  text:    '#e8edf8',
  muted:   '#8c9ab8',
  dim:     '#3a4a6a',
  green:   '#00A651',
  greenBg: 'rgba(0, 166, 81, 0.06)',
  greenBorder: 'rgba(0, 166, 81, 0.2)',
  gold:    '#C9A227',
  blue:    '#003087',
  red:     '#CE1126',
}

function SectionCard({
  icon, title, description, chipLabel, chipClass,
}: {
  icon: string
  title: string
  description: string
  chipLabel: string
  chipClass: string
}) {
  return (
    <div style={{
      background:   C.surface,
      border:       `1px solid ${C.border}`,
      borderLeft:   `4px solid ${C.green}`,
      borderRadius: 10,
      padding:      '24px 28px',
      display:      'flex',
      flexDirection: 'column',
      gap:          12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
          <h2 style={{
            fontFamily: SANS,
            fontSize:   18,
            fontWeight: 700,
            color:      C.text,
            margin:     0,
          }}>
            {title}
          </h2>
        </div>
        <span className={`status-chip ${chipClass}`}>{chipLabel}</span>
      </div>
      <p style={{
        fontFamily: SANS,
        fontSize:   14,
        color:      C.muted,
        lineHeight: 1.65,
        margin:     0,
      }}>
        {description}
      </p>
    </div>
  )
}

export default function App() {
  const [gatewaySession, setGatewaySession] = useState<{ zone: 1|2|3; role: string } | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get('token')

    if (urlToken) {
      const zone = parseZoneFromToken(urlToken) as 1|2|3
      const role = parseRoleFromToken(urlToken)
      sessionStorage.setItem('gov_session', JSON.stringify({
        sessionToken: urlToken,
        zone,
        role,
        storedAt: Date.now(),
        portalUrl: '',
      }))
      window.history.replaceState({}, '', window.location.pathname)
    }

    if (import.meta.env.DEV) return

    const session = getSession()
    if (!session) {
      window.location.href = 'https://landing-alpha-seven-82.vercel.app/government'
      return
    }

    setGatewaySession({ zone: session.zone, role: session.role })
  }, [])

  return (
    <>
      {gatewaySession && (
        <ClassificationBand zone={gatewaySession.zone} role={gatewaySession.role} />
      )}
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: SANS }}>

        {/* Header */}
        <header style={{
          background:   C.surface,
          borderBottom: `1px solid ${C.border}`,
          padding:      '0 32px',
          display:      'flex',
          alignItems:   'center',
          height:       64,
          gap:          16,
          position:     'sticky',
          top:          0,
          zIndex:       50,
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 20, height: 4, background: C.red,  borderRadius: 2 }} />
            <div style={{ width: 20, height: 4, background: C.blue, borderRadius: 2 }} />
          </div>
          <div>
            <div style={{
              fontFamily:    MONO,
              fontSize:      9,
              letterSpacing: '2px',
              color:         C.green,
              marginBottom:  2,
            }}>
              MOF · SAMOA DPI
            </div>
            <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.text }}>
              Ministry of Finance — Fiscal Oversight Portal
            </div>
          </div>
          <div style={{
            marginLeft:    'auto',
            fontFamily:    MONO,
            fontSize:      9,
            color:         C.dim,
            letterSpacing: '1px',
          }}>
            PHASE 1 STUB · PENDING MOF ENGAGEMENT
          </div>
        </header>

        <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

          {/* Hero */}
          <div style={{ marginBottom: 40 }}>
            <div style={{
              display:    'inline-flex',
              alignItems: 'center',
              gap:        8,
              background: C.greenBg,
              border:     `1px solid ${C.greenBorder}`,
              borderRadius: 6,
              padding:    '4px 14px',
              fontFamily: MONO,
              fontSize:   10,
              color:      C.green,
              letterSpacing: '1px',
              marginBottom: 20,
            }}>
              <span>◎</span> SAMOA DIGITAL PUBLIC INFRASTRUCTURE
            </div>

            <h1 style={{
              fontFamily: SANS,
              fontSize:   'clamp(24px, 4vw, 38px)',
              fontWeight: 800,
              color:      C.text,
              margin:     '0 0 12px',
              lineHeight: 1.2,
            }}>
              Ministry of Finance
            </h1>
            <p style={{
              fontFamily: SANS,
              fontSize:   16,
              color:      C.muted,
              margin:     0,
              lineHeight: 1.6,
              maxWidth:   580,
            }}>
              Fiscal Oversight Portal · Samoa Digital Public Infrastructure
            </p>
          </div>

          {/* Constitutional mandate notice */}
          <div style={{
            background:   C.greenBg,
            border:       `1px solid ${C.greenBorder}`,
            borderRadius: 8,
            padding:      '16px 20px',
            marginBottom: 32,
            display:      'flex',
            gap:          12,
            alignItems:   'flex-start',
          }}>
            <span style={{ fontSize: 18, color: C.green, flexShrink: 0, marginTop: 2 }}>⚖</span>
            <div>
              <div style={{
                fontFamily:    MONO,
                fontSize:      10,
                color:         C.green,
                letterSpacing: '1px',
                marginBottom:  6,
              }}>
                CONSTITUTIONAL MANDATE
              </div>
              <p style={{
                fontFamily: SANS,
                fontSize:   13,
                color:      C.muted,
                margin:     0,
                lineHeight: 1.65,
              }}>
                The Ministry of Finance holds constitutional authority over all government fiscal
                operations: grant approvals, budget execution, disbursement tracking, and donor
                fund management. These functions are separate from the monetary policy authority
                vested in the Central Bank of Samoa.
              </p>
            </div>
          </div>

          {/* Content sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <SectionCard
              icon="📊"
              title="Government Disbursement Oversight"
              description="AIDisbursementTracker — government grant lifecycle monitoring. Tranche approvals, milestone verification, and audit trail. Full integration with the on-chain disbursement tracker contract."
              chipLabel="Pending MOF engagement"
              chipClass="pending"
            />

            <SectionCard
              icon="✅"
              title="Grant Approval Workflow"
              description="Cross-ministry grant creation, MOF approval authority, and CBS settlement coordination. Milestone-based tranche release with cryptographic verification."
              chipLabel="Pending MOF engagement"
              chipClass="pending"
            />

            <SectionCard
              icon="🌐"
              title="Donor Fund Management"
              description="International donor programme oversight, reporting, and on-chain milestone verification for donor compliance. Supports UNICEF, World Bank, ADB, and bilateral donor requirements."
              chipLabel="Pending MOF engagement"
              chipClass="pending"
            />

            <SectionCard
              icon="📋"
              title="Budget Execution Tracking"
              description="Government expenditure tracking and World Bank STEP procurement integration (Phase 2). Provides real-time visibility into budget utilisation across all ministries."
              chipLabel="Phase 2 — post-pilot"
              chipClass="phase2"
            />

          </div>

          {/* Research note */}
          <div style={{
            marginTop:     40,
            padding:       '16px 20px',
            background:    C.surface,
            border:        `1px solid ${C.border}`,
            borderLeft:    `3px solid ${C.gold}`,
            borderRadius:  6,
          }}>
            <div style={{
              fontFamily:    MONO,
              fontSize:      9,
              color:         C.gold,
              letterSpacing: '1.5px',
              marginBottom:  8,
            }}>
              RESEARCH CONTEXT
            </div>
            <p style={{
              fontFamily: MONO,
              fontSize:   11,
              color:      C.dim,
              margin:     0,
              lineHeight: 1.7,
            }}>
              NUS/ISOC Foundation Research Programme 2026 · USD $500,000 over 24 months ·
              PI: Dr. Edna Temese (National University of Samoa) ·
              Technical Partner: Synergy Blockchain Pacific
            </p>
          </div>
        </main>

        <footer style={{
          borderTop:  `1px solid ${C.border}`,
          padding:    '20px 32px',
          background: C.surface,
          fontFamily: MONO,
          fontSize:   10,
          color:      C.dim,
          textAlign:  'center',
          lineHeight: 1.8,
        }}>
          <div>
            Ministry of Finance · Samoa Digital Public Infrastructure ·
            Research prototype — no real financial data is held.
          </div>
          <div style={{ marginTop: 4 }}>
            Enquiries: synergyblockchaintf@gmail.com
          </div>
        </footer>
      </div>
    </>
  )
}
