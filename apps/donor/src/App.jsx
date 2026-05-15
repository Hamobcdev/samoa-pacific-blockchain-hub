import React from 'react'
import { ResearchGate } from '@samoa-dpi/shared-ui'

function StubPortal({ title, phase, description }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#070910',
      color: '#e8edf8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'IBM Plex Sans', sans-serif",
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '3px', color: '#C9A227', marginBottom: 24 }}>
        SAMOA DPI · RESEARCH PROTOTYPE · {phase}
      </div>
      <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#e8edf8', marginBottom: 8 }}>
        {title}
      </h1>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#8c9ab8', marginBottom: 32, maxWidth: 480 }}>
        {description}
      </p>
      <div style={{
        background: '#0c1222',
        border: '1px solid #f0b42940',
        borderLeft: '3px solid #f0b429',
        borderRadius: 6,
        padding: '12px 20px',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        color: '#f0b429',
        letterSpacing: '0.5px',
      }}>
        ⊘ AID Disbursement Tracker deployed — donor interface Phase 2
      </div>
      <div style={{ marginTop: 48, fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#3a4a6a', letterSpacing: '1px' }}>
        Research prototype operated under the NUS/ISOC Research Programme 2026.
        No real grant data is held. Contact: synergyblockchaintf@gmail.com
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ResearchGate storageKey="sdpi_donor_acknowledged">
      <StubPortal
        title="Development Partner Portal"
        phase="PHASE 2"
        description="UNICEF and development partner dashboard for AID disbursement tracking, milestone verification, and transparent tranche release on the Samoa DPI blockchain layer."
      />
    </ResearchGate>
  )
}
