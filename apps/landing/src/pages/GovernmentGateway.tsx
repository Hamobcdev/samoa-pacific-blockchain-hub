import { useState, useEffect } from 'react'

export default function GovernmentGateway() {
  const [utcTime, setUtcTime] = useState('')

  useEffect(() => {
    const tick = () => setUtcTime(new Date().toISOString().replace('T', ' ').slice(0, 19))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const isDev = import.meta.env.DEV

  return (
    <div style={{
      background:    '#080c10',
      fontFamily:    "'IBM Plex Mono', monospace",
      minHeight:     '100vh',
      display:       'flex',
      flexDirection: 'column',
      color:         '#c8d8e8',
    }}>
      {/* Classification band — unauthenticated */}
      <div style={{
        background:    '#0a0f14',
        borderBottom:  '1px solid #1e2a3a',
        padding:       '0 20px',
        height:        32,
        display:       'flex',
        alignItems:    'center',
        justifyContent:'space-between',
        flexShrink:    0,
      }}>
        <span style={{ color: '#4a6070', fontSize: 10, letterSpacing: 2 }}>
          RESTRICTED — GOVERNMENT USE ONLY
        </span>
        <span style={{ color: '#4a6070', fontSize: 10, letterSpacing: 2 }}>
          SAMOA DPI · GOV ACCESS SYSTEM
        </span>
      </div>

      {/* DEV bypass banner — development only */}
      {isDev && (
        <div style={{
          background:   '#2a1a00',
          borderBottom: '1px solid #6a3a00',
          padding:      '8px 20px',
          textAlign:    'center',
        }}>
          <span style={{ color: '#EF9F27', fontSize: 10, letterSpacing: 2 }}>
            DEVELOPMENT MODE ACTIVE — AUTH GATE BYPASS AVAILABLE
          </span>
          <button
            onClick={() => { window.location.href = 'https://samoa-dpi-admin.vercel.app' }}
            style={{
              marginLeft:  16,
              background:  'none',
              border:      '1px solid #6a3a00',
              color:       '#EF9F27',
              padding:     '2px 10px',
              fontSize:    9,
              letterSpacing:1,
              cursor:      'pointer',
              fontFamily:  "'IBM Plex Mono', monospace",
            }}
          >
            BYPASS → CBS ADMIN
          </button>
          <button
            onClick={() => { window.location.href = 'https://samoa-dpi-mof.vercel.app' }}
            style={{
              marginLeft:  8,
              background:  'none',
              border:      '1px solid #6a3a00',
              color:       '#EF9F27',
              padding:     '2px 10px',
              fontSize:    9,
              letterSpacing:1,
              cursor:      'pointer',
              fontFamily:  "'IBM Plex Mono', monospace",
            }}
          >
            BYPASS → MOF
          </button>
        </div>
      )}

      {/* Main auth block */}
      <div style={{
        flex:           1,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '40px 20px',
      }}>
        <div style={{
          width:         '100%',
          maxWidth:      400,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           0,
        }}>
          {/* Government seal */}
          <div style={{
            width:        56,
            height:       56,
            borderRadius: '50%',
            background:   '#0d1520',
            border:       '1px solid #2a3a4a',
            display:      'flex',
            alignItems:   'center',
            justifyContent:'center',
            marginBottom: 20,
          }}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <circle cx="15" cy="15" r="12" stroke="#4a6a8a" strokeWidth="1"/>
              <polygon
                points="15,5 17.5,11.5 24,11.5 19,15.5 21,22 15,18 9,22 11,15.5 6,11.5 12.5,11.5"
                fill="none" stroke="#4a6a8a" strokeWidth="0.8"
              />
            </svg>
          </div>

          <p style={{ color: '#c8d8e8', fontSize: 13, letterSpacing: 3, margin: '0 0 4px', textAlign: 'center' }}>
            INDEPENDENT STATE OF SAMOA
          </p>
          <p style={{ color: '#4a6070', fontSize: 10, letterSpacing: 2, margin: '0 0 28px', textAlign: 'center' }}>
            DIGITAL PUBLIC INFRASTRUCTURE — RESTRICTED ACCESS
          </p>

          <div style={{ width: '100%', height: 1, background: '#1e2a3a', marginBottom: 28 }} />

          {/* Secure gateway notice */}
          <div style={{
            width:         '100%',
            background:    '#0d1520',
            border:        '1px solid #1e2a3a',
            borderRadius:  3,
            padding:       '24px 20px',
            textAlign:     'center',
            marginBottom:  24,
          }}>
            <div style={{ fontSize: 22, marginBottom: 12 }}>🔒</div>
            <p style={{
              color:         '#8ab4c8',
              fontFamily:    "'IBM Plex Mono', monospace",
              fontSize:      11,
              letterSpacing: 1.5,
              lineHeight:    1.9,
              margin:        0,
              textTransform: 'uppercase',
            }}>
              Government portal access is available<br />
              via secure gateway only.<br />
              <br />
              CBS and ministry officials access DPI<br />
              administration through a hardened,<br />
              classified domain.<br />
              <br />
              <span style={{ color: '#4a6070' }}>
                Contact CBS IT to request access.
              </span>
            </p>
          </div>

          {/* Legal warning */}
          <p style={{
            color:         '#1e2a3a',
            fontSize:      10,
            letterSpacing: 1,
            textAlign:     'center',
            maxWidth:      380,
            lineHeight:    1.8,
            textTransform: 'uppercase',
            margin:        '0 0 24px',
          }}>
            Unauthorised access beyond this point is strictly prohibited.
            All access attempts are recorded on an immutable blockchain ledger.
            Unauthorised access is an offence under the laws of the
            Independent State of Samoa and will be prosecuted.
          </p>

          {/* Prototype disclaimer */}
          <p style={{ color: '#1e2a3a', fontSize: 9, letterSpacing: 1, textAlign: 'center', lineHeight: 1.8 }}>
            RESEARCH PROTOTYPE — Simulates Zone 2–4 credential routing<br />
            NUS / ISOC Research Programme 2026<br />
            No real government data is held · Not an operational system
          </p>
        </div>
      </div>

      {/* Access log footer */}
      <div style={{
        background:    '#040608',
        borderTop:     '1px solid #1e2a3a',
        padding:       '8px 20px',
        display:       'flex',
        justifyContent:'space-between',
        flexShrink:    0,
      }}>
        <span style={{ color: '#1e3a4a', fontSize: 9, letterSpacing: 1 }}>
          UTC {utcTime}
        </span>
        <span style={{ color: '#1e3a4a', fontSize: 9, letterSpacing: 1 }}>
          SESSION: NONE · ZONE: UNAUTHENTICATED
        </span>
        <span style={{ color: '#1e3a4a', fontSize: 9, letterSpacing: 1 }}>
          ACCESS: RESTRICTED
        </span>
      </div>
    </div>
  )
}
