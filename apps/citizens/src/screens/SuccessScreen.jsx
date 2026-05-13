import React, { useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { FL, CL } from '../theme.js'

const coatStars = (
  <div style={{
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr 1fr', gap: '3px',
    textAlign: 'center', fontSize: '12px', color: '#C9A227', lineHeight: 1,
  }}>
    <span/><span>★</span><span/>
    <span>★</span><span>★</span><span>★</span>
    <span/><span>★</span><span/>
  </div>
)

function formatDate() {
  const now = new Date()
  const d = String(now.getDate()).padStart(2, '0')
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const y = now.getFullYear()
  const h = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')
  return `${d}/${m}/${y} ${h}:${mi} (WST)`
}

const HASH = '0xA3F2C8D1...7E49B8F2'

export default function SuccessScreen({ service, t, lang, onHome, onTrack }) {
  const playedRef = useRef(false)

  useEffect(() => {
    if (playedRef.current) return
    playedRef.current = true

    const play = async () => {
      try {
        await Tone.start()
        const synth = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope:   { attack: 0.05, decay: 0.1, sustain: 0.4, release: 1.5 },
          volume:     -10,
        }).toDestination()

        const now = Tone.now()
        synth.triggerAttackRelease('C4', '8n', now)
        synth.triggerAttackRelease('E4', '8n', now + 0.15)
        synth.triggerAttackRelease('G4', '8n', now + 0.30)
        synth.triggerAttackRelease('C5', '4n', now + 0.50)

        setTimeout(() => synth.dispose(), 4000)
      } catch {
        // Audio context not available — silently skip
      }
    }
    play()
  }, [])

  return (
    <>
      <style>{`
        @keyframes sdpi-fade-in   { from { opacity:0 }               to { opacity:1 } }
        @keyframes sdpi-slide-up  { from { opacity:0; transform:translateY(40px) } to { opacity:1; transform:translateY(0) } }
        @keyframes sdpi-type-in   { from { opacity:0; letter-spacing:6px } to { opacity:1; letter-spacing:0.5px } }
      `}</style>

      <div style={{
        minHeight:       'calc(100vh - 58px)',
        background:      'linear-gradient(160deg, #001F5C 0%, #003087 60%, #CE1126 100%)',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '32px 16px 40px',
        animation:       'sdpi-fade-in 0.3s ease-out',
      }}>
        {/* Credential card */}
        <div style={{
          background:   '#FFFFFF',
          border:       '2px solid #C9A227',
          borderRadius: '12px',
          boxShadow:    '0 20px 60px rgba(0,48,135,0.3)',
          maxWidth:     '380px',
          width:        '100%',
          padding:      '32px',
          display:      'flex',
          flexDirection:'column',
          alignItems:   'center',
          gap:          '12px',
          animation:    'sdpi-slide-up 0.5s ease-out 0.1s both',
        }}>
          {/* Coat of arms */}
          <div style={{
            width:        '48px',
            height:       '48px',
            border:       '2px solid #C9A227',
            borderRadius: '50%',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            animation:    'sdpi-fade-in 0.4s ease-out 0.4s both',
          }}>
            {coatStars}
          </div>

          {/* OFFICIAL CREDENTIAL label */}
          <div style={{
            fontFamily:    FL.mono,
            fontSize:      '9px',
            color:         '#C9A227',
            letterSpacing: '2px',
            textAlign:     'center',
            textTransform: 'uppercase',
            animation:     'sdpi-type-in 0.8s ease-out 0.5s both',
          }}>
            OFFICIAL GOVERNMENT CREDENTIAL
          </div>

          {/* Bilingual heading */}
          <div style={{
            fontFamily:  FL.display,
            fontSize:    '18px',
            fontWeight:  600,
            color:       CL.text,
            textAlign:   'center',
            lineHeight:  1.3,
            animation:   'sdpi-fade-in 0.4s ease-out 0.6s both',
          }}>
            {t('success.credential')}
          </div>

          <div style={{ width: '100%', height: '1px', background: CL.border }} />

          {/* Service name */}
          <div style={{
            fontFamily:  FL.ui,
            fontSize:    '16px',
            fontWeight:  700,
            color:       CL.text,
            textAlign:   'center',
            animation:   'sdpi-fade-in 0.4s ease-out 0.65s both',
          }}>
            {service.nameKey}
          </div>

          {/* Issued by */}
          <div style={{
            fontFamily: FL.ui,
            fontSize:   '12px',
            color:      CL.muted,
            textAlign:  'center',
            animation:  'sdpi-fade-in 0.4s ease-out 0.7s both',
          }}>
            {t('success.issued')} <strong style={{ color: CL.textSoft }}>{service.ministry}</strong>
          </div>

          {/* Date */}
          <div style={{
            fontFamily:    FL.mono,
            fontSize:      '11px',
            color:         CL.muted,
            animation:     'sdpi-fade-in 0.4s ease-out 0.72s both',
          }}>
            {formatDate()}
          </div>

          {/* Hash */}
          <div style={{
            fontFamily:    FL.mono,
            fontSize:      '10px',
            color:         CL.placeholder,
            letterSpacing: '0.3px',
            animation:     'sdpi-fade-in 0.3s ease-out 0.75s both',
          }}>
            {HASH}
          </div>

          {/* QR placeholder */}
          <div style={{
            width:        '80px',
            height:       '80px',
            background:   CL.surface2,
            border:       `1px dashed ${CL.border2}`,
            borderRadius: '6px',
            display:      'flex',
            flexDirection:'column',
            alignItems:   'center',
            justifyContent:'center',
            gap:          '4px',
            animation:    'sdpi-fade-in 0.3s ease-out 0.8s both',
          }}>
            <span style={{ fontSize: '28px', color: CL.border2 }}>⊞</span>
            <span style={{ fontFamily: FL.mono, fontSize: '8px', color: CL.muted, textAlign: 'center' }}>
              QR verification
            </span>
          </div>

          {/* Blockchain verified */}
          <div style={{
            fontFamily:    FL.mono,
            fontSize:      '8px',
            color:         CL.success,
            letterSpacing: '0.5px',
            textAlign:     'center',
            animation:     'sdpi-fade-in 0.3s ease-out 0.85s both',
          }}>
            VERIFIED ON SAMOA SOVEREIGN BLOCKCHAIN
          </div>
        </div>

        {/* Action buttons */}
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           '10px',
          marginTop:     '24px',
          width:         '100%',
          maxWidth:      '380px',
          animation:     'sdpi-fade-in 0.2s ease-out 1s both',
        }}>
          {/* Download */}
          <button style={{
            background:   'transparent',
            border:       '2px solid #C9A227',
            borderRadius: '10px',
            height:       '44px',
            fontFamily:   FL.ui,
            fontSize:     '14px',
            fontWeight:   700,
            color:        '#C9A227',
            cursor:       'pointer',
          }}>
            {t('success.download')}
          </button>

          {/* Track */}
          <button
            onClick={onTrack}
            style={{
              background:  'transparent',
              border:      'none',
              fontFamily:  FL.ui,
              fontSize:    '13px',
              fontWeight:  600,
              color:       'rgba(255,255,255,0.7)',
              cursor:      'pointer',
              textDecoration: 'underline',
            }}
          >
            {t('success.track')}
          </button>

          {/* Home */}
          <button
            onClick={onHome}
            style={{
              background:   '#FFFFFF',
              color:        CL.primary,
              border:       'none',
              borderRadius: '10px',
              height:       '48px',
              fontFamily:   FL.ui,
              fontSize:     '15px',
              fontWeight:   700,
              cursor:       'pointer',
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    </>
  )
}
