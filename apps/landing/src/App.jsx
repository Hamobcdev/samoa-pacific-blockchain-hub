import React from 'react'
import { C, F } from '@samoa-dpi/shared-ui'

if (typeof document !== 'undefined' && !document.getElementById('sdpi-fonts')) {
  const l = document.createElement('link')
  l.id = 'sdpi-fonts'; l.rel = 'stylesheet'
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;700;800&display=swap'
  document.head.appendChild(l)
}

const PORTALS = [
  {
    label: 'I am a Citizen',
    href:  '/citizens',
    icon:  '👤',
    desc:  'Access personal services, verify your identity, and track benefit eligibility.',
  },
  {
    label: 'I am a Government Officer',
    href:  '/ministry',
    icon:  '🏛️',
    desc:  'Ministry dashboards, cross-ministry workflows, and service record management.',
  },
  {
    label: 'I am a Development Partner',
    href:  '/donor',
    icon:  '🌐',
    desc:  'UNICEF grant tracking, tranche verification, and impact reporting.',
  },
  {
    label: 'Verify a Document',
    href:  '/verify',
    icon:  '✅',
    desc:  'Instantly verify any government-issued credential against the NDIDS chain.',
  },
]

function PortalCard({ label, href, icon, desc }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <a
      href={href}
      style={{
        display: 'flex', flexDirection: 'column', gap: '12px',
        background: C.surface, border: `1px solid ${hovered ? C.gold : C.border}`,
        borderRadius: '16px', padding: '28px 24px',
        color: C.white, textDecoration: 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: '32px' }}>{icon}</span>
      <span style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 600, color: C.white }}>
        {label}
      </span>
      <span style={{ fontFamily: F.ui, fontSize: '13px', color: C.silver, lineHeight: '1.5' }}>
        {desc}
      </span>
    </a>
  )
}

function GovFooter() {
  return (
    <footer style={{
      borderTop: `1px solid ${C.border}`, padding: '20px 32px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: F.ui, fontSize: '12px', color: C.muted,
      flexWrap: 'wrap', gap: '8px',
    }}>
      <span>© 2026 Government of Samoa — Digital Public Infrastructure</span>
      <span style={{ color: C.gold, fontWeight: 700, letterSpacing: '0.5px' }}>
        UNICEF Venture Fund 2026
      </span>
      <span>Polygon Amoy Testnet · Chain ID 80002</span>
    </footer>
  )
}

export default function App() {
  return (
    <div style={{
      minHeight: '100vh', background: C.sovereign, color: C.white,
      display: 'flex', flexDirection: 'column', fontFamily: F.ui,
    }}>
      {/* Authority bar */}
      <div style={{
        background: C.authority, padding: '8px 32px',
        fontFamily: F.ui, fontSize: '11px', fontWeight: 700,
        letterSpacing: '1px', textTransform: 'uppercase', color: C.white,
      }}>
        Independent State of Samoa — Official Digital Services
      </div>

      {/* Hero + portal cards */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px 48px', gap: '16px', textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
          <div style={{ width: '4px', height: '56px', background: C.flag, borderRadius: '2px' }} />
          <h1 style={{
            fontFamily: F.display, fontSize: 'clamp(26px, 5vw, 52px)',
            fontWeight: 700, color: C.white, margin: 0, lineHeight: 1.1,
          }}>
            Samoa Digital Public Infrastructure
          </h1>
        </div>

        <p style={{
          fontFamily: F.ui, fontSize: '17px', color: C.silver,
          maxWidth: '540px', margin: 0, lineHeight: 1.5, fontWeight: 500,
        }}>
          Sovereign Blockchain Research Programme
        </p>
        <p style={{
          fontFamily: F.ui, fontSize: '13px', color: C.muted,
          maxWidth: '480px', margin: 0, lineHeight: 1.6,
        }}>
          Privacy-preserving citizen verification and cross-ministry interoperability,
          powered by a permissioned blockchain layer.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px', width: '100%', maxWidth: '960px', marginTop: '32px',
        }}>
          {PORTALS.map(p => <PortalCard key={p.href} {...p} />)}
        </div>
      </main>

      <GovFooter />
    </div>
  )
}
