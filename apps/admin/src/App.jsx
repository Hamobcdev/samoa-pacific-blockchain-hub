import React from 'react'
import { C, F } from '@samoa-dpi/shared-ui'

if (typeof document !== 'undefined' && !document.getElementById('sdpi-fonts')) {
  const l = document.createElement('link')
  l.id = 'sdpi-fonts'; l.rel = 'stylesheet'
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;700;800&display=swap'
  document.head.appendChild(l)
}

export default function App() {
  return (
    <div style={{
      minHeight: '100vh', background: C.sovereign, color: C.white,
      fontFamily: F.ui, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '24px', padding: '48px 24px', textAlign: 'center',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: C.flag + '22', border: `1px solid ${C.flag}44`,
        borderRadius: '20px', padding: '4px 14px',
        fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
        textTransform: 'uppercase', color: C.flag,
      }}>
        Restricted Access
      </div>

      <h1 style={{
        fontFamily: F.display, fontSize: 'clamp(24px, 4vw, 44px)',
        fontWeight: 700, margin: 0, color: C.white,
      }}>
        System Administration Portal
      </h1>

      <p style={{
        fontSize: '15px', color: C.silver, maxWidth: '560px',
        lineHeight: 1.7, margin: 0,
      }}>
        Restricted access — CBS oversight, NDIDS Registry, CBS Governance Panel,
        Interoperability Hub.
      </p>

      <a
        href="/"
        style={{
          marginTop: '8px', color: C.gold, fontSize: '14px',
          fontWeight: 600, textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '6px',
        }}
      >
        ← Back to landing
      </a>
    </div>
  )
}
