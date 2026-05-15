import React from 'react'

const EXPIRY_DAYS = 30

function isAcknowledged(key) {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return false
    const { ts } = JSON.parse(stored)
    return Date.now() - ts < EXPIRY_DAYS * 86400000
  } catch {
    return false
  }
}

export function ResearchGate({ children, storageKey }) {
  const key = storageKey || 'sdpi_acknowledged'
  const [dismissed, setDismissed] = React.useState(() => isAcknowledged(key))

  function acknowledge() {
    try { localStorage.setItem(key, JSON.stringify({ ts: Date.now() })) } catch {}
    setDismissed(true)
  }

  if (dismissed) return children ? <>{children}</> : null

  const coatStars = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: '3px', textAlign: 'center', fontSize: '14px', color: '#C9A227', lineHeight: 1 }}>
      <span /><span>★</span><span />
      <span>★</span><span>★</span><span>★</span>
      <span /><span>★</span><span />
    </div>
  )

  return (
    <>
      <div role="dialog" aria-modal="true" aria-label="Research Environment Notice" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0A1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '80px', height: '80px', border: '2px solid #C9A227', borderRadius: '50%', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {coatStars}
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 600, color: '#F0F4FF', letterSpacing: '2px', marginTop: '24px', textAlign: 'center' }}>
          Samoa Digital Public Infrastructure
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#A8B8D8', letterSpacing: '1px', marginTop: '4px' }}>
          Research Laboratory Environment
        </div>
        <div style={{ width: '120px', height: '1px', background: 'linear-gradient(90deg, transparent, #C9A227, transparent)', margin: '24px auto' }} />
        <div style={{ maxWidth: '520px', width: '100%', background: 'rgba(0,48,135,0.3)', border: '1px solid #003087', borderLeft: '3px solid #C9A227', borderRadius: '6px', padding: '20px 24px' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', lineHeight: 1.7, color: '#A8B8D8', margin: 0 }}>
            This system is a restricted research environment operated under the NUS/ISOC Internet Society Research Programme in collaboration with the Central Bank of Samoa. It demonstrates sovereign blockchain infrastructure for the Independent State of Samoa. No real citizen data is stored. This pilot is not authorised for public deployment.
          </p>
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#5A6A8A', textAlign: 'center', marginTop: '16px' }}>
          By entering you confirm you are an authorised research participant or CBS reviewer.
        </div>
        <button
          onClick={acknowledge}
          style={{ background: 'linear-gradient(135deg, #003087, #0A1628)', border: '1px solid #C9A227', borderRadius: '6px', padding: '14px 40px', marginTop: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#F0F4FF', letterSpacing: '1px' }}>Enter Research Environment</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: '#A8B8D8', marginTop: '4px' }}>Ulufale i le Siosiomaga Su&#x02BC;esu&#x02BC;ega</span>
        </button>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#5A6A8A', marginTop: '12px' }}>
          Restricted Access · NUS/ISOC 2026 · Access remembered for {EXPIRY_DAYS} days
        </div>
      </div>
      {children && <div style={{ visibility: 'hidden', pointerEvents: 'none' }}>{children}</div>}
    </>
  )
}

export default ResearchGate
