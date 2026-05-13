import React from 'react'
import { FL } from '../theme.js'

const coatStars = (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr 1fr',
    gap: '1px',
    textAlign: 'center',
    fontSize: '7px',
    color: '#C9A227',
    lineHeight: 1,
  }}>
    <span/><span>★</span><span/>
    <span>★</span><span>★</span><span>★</span>
    <span/><span>★</span><span/>
  </div>
)

export default function CitizenHeader({ t, lang, toggleLang, currentScreen, onNavigate }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      background: '#003087',
      borderBottom: '2px solid #C9A227',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: '56px',
      }}>
        {/* Left: coat of arms */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => onNavigate('home')}
        >
          <div style={{
            width: '28px',
            height: '28px',
            border: '1.5px solid #C9A227',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {coatStars}
          </div>
          {/* Mobile: short label */}
          <span style={{
            fontFamily: FL.display,
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '2px',
            color: '#F0F4FF',
            display: 'block',
          }}>
            <span className="header-mobile-label">SAMOA DPI</span>
          </span>
        </div>

        {/* Right: lang toggle + research badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '12px',
              padding: '4px 10px',
              fontFamily: FL.mono,
              fontSize: '11px',
              color: '#FFFFFF',
              cursor: 'pointer',
              lineHeight: 1.4,
            }}
          >
            {t('nav.language.toggle')}
          </button>

          {/* Research badge — hidden on mobile */}
          <div style={{
            background: 'rgba(201,162,39,0.2)',
            border: '1px solid #C9A227',
            borderRadius: '4px',
            padding: '3px 8px',
            fontFamily: FL.mono,
            fontSize: '9px',
            color: '#C9A227',
            whiteSpace: 'nowrap',
          }}
            className="header-research-badge"
          >
            Research Pilot
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .header-research-badge { display: none !important; }
        }
      `}</style>
    </header>
  )
}
