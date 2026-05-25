import React from 'react'

export default function AuthorityBar({ blockNumber, isLive, soundEnabled, toggleSound }) {
  const coatStars = (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gridTemplateRows:'1fr 1fr 1fr', gap:'1px', textAlign:'center', fontSize:'8px', color:'#C9A227', lineHeight:1 }}>
      <span/><span>★</span><span/>
      <span>★</span><span>★</span><span>★</span>
      <span/><span>★</span><span/>
    </div>
  )

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      width: '100%', height: '52px',
      background: 'linear-gradient(135deg, #0A1628 0%, #003087 100%)',
      borderBottom: '2px solid #C9A227',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', boxSizing: 'border-box',
    }}>
      {/* Left: coat of arms */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
        <div style={{ width:'36px', height:'36px', border:'2px solid #C9A227', borderRadius:'50%', background:'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {coatStars}
        </div>
        <div style={{ fontSize:'7px', color:'#C9A227', fontFamily:'IBM Plex Mono' }}>WS</div>
      </div>

      {/* Center: state name */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ fontFamily:'Cormorant Garamond', fontSize:'13px', fontWeight:600, letterSpacing:'2px', color:'#F0F4FF' }}>
          INDEPENDENT STATE OF SAMOA
        </div>
        <div style={{ fontFamily:'DM Sans', fontSize:'10px', color:'#A8B8D8', letterSpacing:'1px' }}>
          Malo Sa&#x02BC;oloto Tuto&#x02BC;atasi o S&#x101;moa
        </div>
      </div>

      {/* Right: live block + badge + sound toggle */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        {/* Live block indicator */}
        <div style={{ fontFamily:'IBM Plex Mono', fontSize:'10px', letterSpacing:'0.5px' }}>
          {isLive
            ? <span style={{ color:'#00A651' }}>● LIVE · Block #{blockNumber?.toLocaleString()}</span>
            : <span style={{ color:'#F59E0B' }}>○ OFFLINE</span>
          }
        </div>

        {/* NUS badge */}
        <div style={{ background:'rgba(201,162,39,0.15)', border:'1px solid #C9A227', borderRadius:'4px', padding:'4px 10px' }}>
          <span style={{ fontFamily:'IBM Plex Mono', fontSize:'9px', color:'#C9A227', letterSpacing:'0.8px' }}>NUS · ISOC Research Programme</span>
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          style={{ background:'transparent', border:'1px solid rgba(201,162,39,0.3)', borderRadius:'4px', padding:'3px 8px', cursor:'pointer', fontFamily:'IBM Plex Mono', fontSize:'12px', color:'#A8B8D8', lineHeight:1 }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </div>
  )
}
