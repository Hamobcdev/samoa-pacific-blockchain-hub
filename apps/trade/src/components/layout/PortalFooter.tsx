import { C, MONO, SANS } from '../../constants'

export function PortalFooter() {
  return (
    <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: '16px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>
              Samoa One-Stop Maritime Window (OMW)
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>
              Independent State of Samoa · Digital Public Infrastructure
            </div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 2 }}>
              RESEARCH PROTOTYPE · NUS / ISOC Research Programme 2026
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '0.5px' }}>
              Polygon Amoy Testnet · Chain 80002
            </div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>
              Phase 1 — in-memory · Phase 2: Samoa DPI sovereign chain
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              'IMO FAL Convention 2024',
              'UNCTAD Single Window Guidelines',
              'WCO SAFE Framework 2025',
              'WCO Data Model v3',
              'ASYCUDA World',
              'ISO 28000:2022',
              'UNCTAD 2029 BT Readiness',
              'WHO IHR 2005',
              'MWTI Shipping Act 1998',
              'MWTI Port Regulations 2019',
            ].map(s => (
              <span key={s} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, fontFamily: MONO, fontSize: 8, color: C.dim, padding: '1px 6px', letterSpacing: '0.5px' }}>
                {s}
              </span>
            ))}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>
            v0.8.0 · Build 2026-05
          </div>
        </div>
      </div>
    </footer>
  )
}
