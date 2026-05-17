import React, { useState } from 'react'
import { C, MONO, SANS, CBS_GOVERNANCE_ITEMS } from '../../constants'
import { CBSGovernanceModal } from '../shared/CBSGovernanceModal'

export function PortalFooter() {
  const [showGov, setShowGov] = useState(false)
  const sovItem               = CBS_GOVERNANCE_ITEMS.find(i => i.id === 'SOV-1')!

  return (
    <>
      <footer style={{
        background:  C.surface,
        borderTop:   `1px solid ${C.border}`,
        fontFamily:  MONO,
        fontSize:    11,
        padding:     '16px 24px',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ color: C.text, fontWeight: 600, marginBottom: 2, fontFamily: SANS, fontSize: 13 }}>
              Samoa OMW Trade & Border Clearance
            </div>
            <div style={{ color: C.muted, fontSize: 11 }}>
              Operated by the Independent State of Samoa
            </div>
            <div style={{ color: C.dim, fontSize: 10 }}>
              Powered by Samoa Digital Public Infrastructure
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
            <div style={{ color: C.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#9ca3af' }}>●</span> Polygon Amoy (Testnet)
            </div>
            <div style={{ color: C.dim, fontSize: 10 }}>
              Network: 80002 · Block: #8,234,901 · Latency: 2.1s
            </div>
            <div style={{ color: C.dim, fontSize: 10 }}>
              Contract: InteroperabilityHub · 0x6c21…18Cc
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <button
            onClick={() => setShowGov(true)}
            aria-label="View CBS governance item: Validator Node Designation"
            style={{
              background:   'none',
              border:       'none',
              color:        C.amber,
              cursor:       'pointer',
              fontFamily:   MONO,
              fontSize:     11,
              padding:      0,
              textDecoration: 'underline',
            }}
          >
            🔒 Validator Governance: CBS-Blocked
          </button>

          <div style={{ color: C.dim, display: 'flex', gap: 12 }}>
            <span>v0.6.0 · Build: 2026-05-17</span>
            <a href="#" style={{ color: C.dim, textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: C.dim, textDecoration: 'none' }}>Terms</a>
          </div>
        </div>
      </footer>

      {showGov && <CBSGovernanceModal item={sovItem} onClose={() => setShowGov(false)} />}
    </>
  )
}
