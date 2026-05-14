import React, { useEffect, useRef } from 'react'
import { C, F } from '@samoa-dpi/shared-ui'
import { OPERATIONAL_NODES, GOVERNMENT_NODES } from '@samoa-dpi/contracts-abi'
import ResearchGate      from './ResearchGate.jsx'
import AuthorityBar      from './AuthorityBar.jsx'
import BlockchainCanvas  from './BlockchainCanvas.jsx'
import TapaPattern       from './TapaPattern.jsx'
import useSoundSystem    from './useSoundSystem.js'
import useChainStats     from './useChainStats.js'

if (typeof document !== 'undefined' && !document.getElementById('sdpi-fonts')) {
  const l = document.createElement('link')
  l.id = 'sdpi-fonts'; l.rel = 'stylesheet'
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@400;500;700;800&display=swap'
  document.head.appendChild(l)
}

const LEGACY_URL = 'https://samoa-pacific-blockchain-hub.vercel.app'

const PORTALS = [
  {
    id:        'citizens',
    label:     'I am a Citizen',
    href:      '#',
    icon:      '◉',
    desc:      'Access personal services, verify your identity, and track benefit eligibility.',
    showLive:  false,
    badge:     null,
    legacyUrl: null,
  },
  {
    id:        'ministry',
    label:     'I am a Government Officer',
    href:      '#',
    icon:      '⬡',
    desc:      'Ministry dashboards, cross-ministry workflows, and service record management.',
    showLive:  true,
    badge:     null,
    legacyUrl: LEGACY_URL,
  },
  {
    id:        'donor',
    label:     'I am a Development Partner',
    href:      '#',
    icon:      '◈',
    desc:      'UNICEF grant tracking, tranche verification, and impact reporting.',
    showLive:  false,
    badge:     'Coming Phase 2',
    legacyUrl: null,
  },
  {
    id:        'verify',
    label:     'Verify a Document',
    href:      '#',
    icon:      '✦',
    desc:      'Instantly verify any government-issued credential against the NDIDS chain.',
    showLive:  false,
    badge:     'Coming Phase 2',
    legacyUrl: null,
  },
]

// ─── Portal Card ────────────────────────────────────────────────────────────

function PortalCard({ label, href, icon, desc, showLive, isLive, badge, legacyUrl, hoverCard, clickCard, onShowToast }) {
  const [hovered, setHovered] = React.useState(false)

  const handleClick = (e) => {
    e.preventDefault()
    clickCard?.()
    onShowToast?.()
  }

  return (
    <a
      href={href}
      style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           '10px',
        background:    C.surface,
        border:        `1px solid ${hovered ? C.border2 : C.border}`,
        borderLeft:    `3px solid ${hovered ? C.gold : 'transparent'}`,
        borderRadius:  '16px',
        padding:       '28px 24px',
        color:         C.white,
        textDecoration:'none',
        transform:     hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition:    'border-color 0.2s, border-left-color 0.2s, transform 0.2s',
        cursor:        'pointer',
      }}
      onMouseEnter={() => { setHovered(true); hoverCard?.() }}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <span style={{ fontSize: '28px', lineHeight: 1 }}>{icon}</span>

      <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
        <span style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 600, color: C.white }}>
          {label}
        </span>
        {showLive && isLive && (
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: '#00A651', letterSpacing: '0.5px' }}>
            ● System live
          </span>
        )}
      </div>

      <span style={{ fontFamily: F.ui, fontSize: '13px', color: C.silver, lineHeight: '1.5', flex: 1 }}>
        {desc}
      </span>

      {legacyUrl && (
        <a
          href={legacyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            fontFamily:  F.mono,
            fontSize:    '10px',
            color:       C.teal,
            textDecoration: 'none',
            display:     'inline-flex',
            alignItems:  'center',
            gap:         '4px',
            marginTop:   '2px',
          }}
        >
          Currently accessible via legacy portal →
        </a>
      )}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'4px' }}>
        <span style={{ flex: 1 }} />
        {badge && (
          <span style={{
            display:       'inline-flex',
            alignItems:    'center',
            background:    'rgba(201,162,39,0.08)',
            border:        `1px solid ${C.gold}33`,
            borderRadius:  '12px',
            padding:       '2px 10px',
            fontFamily:    F.mono,
            fontSize:      '9px',
            color:         C.gold,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginRight:   '8px',
          }}>
            {badge}
          </span>
        )}
        <span style={{
          fontFamily:  F.ui,
          fontSize:    '13px',
          color:       C.gold,
          fontWeight:  600,
          display:     'inline-block',
          transform:   hovered ? 'translateX(2px)' : 'translateX(0)',
          transition:  'transform 0.2s',
        }}>
          →
        </span>
      </div>
    </a>
  )
}

// ─── Toast ──────────────────────────────────────────────────────────────────

function Toast({ visible }) {
  if (!visible) return null
  return (
    <div style={{
      position:    'fixed',
      bottom:      '36px',
      left:        '50%',
      transform:   'translateX(-50%)',
      zIndex:      200,
      background:  C.deep,
      border:      `1px solid ${C.border2}`,
      borderLeft:  `3px solid ${C.gold}`,
      borderRadius:'8px',
      padding:     '12px 24px',
      fontFamily:  F.ui,
      fontSize:    '13px',
      color:       C.silver,
      maxWidth:    '380px',
      width:       'max-content',
      textAlign:   'center',
      boxShadow:   '0 8px 32px rgba(0,0,0,0.5)',
      pointerEvents:'none',
    }}>
      This portal is launching soon — return to this page to access when live.
    </div>
  )
}

// ─── Stats Strip ────────────────────────────────────────────────────────────

function StatPill({ icon, value, label, live }) {
  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          '8px',
      background:   'rgba(30, 46, 80, 0.6)',
      border:       `1px solid ${C.border2}`,
      borderRadius: '20px',
      padding:      '6px 16px',
      fontFamily:   F.mono,
      fontSize:     '11px',
      color:        C.silver,
      whiteSpace:   'nowrap',
    }}>
      <span style={{ color: live ? '#00A651' : C.silver }}>{icon}</span>
      <span style={{ color: C.gold, fontSize: '14px', fontWeight: 600 }}>{value}</span>
      <span>{label}</span>
    </div>
  )
}

function StatsStrip({ isLive }) {
  const stats = [
    { icon: '🏛',  value: String(OPERATIONAL_NODES.length), label: 'Active Nodes',        live: false },
    { icon: '⬡',  value: String(GOVERNMENT_NODES.length),  label: 'Gov Entities',        live: false },
    { icon: '👤',  value: '25',                             label: 'Citizens Registered', live: false },
    { icon: '⟳',  value: '7',                              label: 'Active Workflows',    live: false },
    { icon: '●',   value: isLive ? 'Live' : 'Offline',     label: 'Amoy Testnet',        live: isLive },
  ]
  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap:                 '12px',
      width:               '100%',
      maxWidth:            '820px',
      justifyItems:        'center',
      margin:              '0 auto',
    }}>
      {stats.map(s => <StatPill key={s.label} {...s} />)}
    </div>
  )
}

// ─── Footer ─────────────────────────────────────────────────────────────────

function GovFooter() {
  return (
    <div style={{ width:'100%', padding:'20px 24px', background:'#0A1628', borderTop:'1px solid #1E2E50', display:'flex', flexDirection:'column', gap:'8px', alignItems:'center', boxSizing:'border-box' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
        <span style={{ fontFamily:'IBM Plex Mono', fontSize:'10px', color:'#5A6A8A' }}>Samoa DPI Research Laboratory</span>
        <div style={{ display:'flex', width:'3px', height:'20px' }}>
          <div style={{ flex:1, background:'#CE1126' }}/>
          <div style={{ flex:1, background:'#FFFFFF' }}/>
          <div style={{ flex:1, background:'#003087' }}/>
        </div>
        <span style={{ fontFamily:'IBM Plex Mono', fontSize:'10px', color:'#5A6A8A' }}>Powered by Sovereign Blockchain Infrastructure</span>
      </div>
      <div style={{ background:'rgba(206,17,38,0.08)', border:'1px solid rgba(206,17,38,0.3)', borderRadius:'4px', padding:'6px 16px', textAlign:'center' }}>
        <span style={{ fontFamily:'IBM Plex Mono', fontSize:'9px', color:'#E8445A', letterSpacing:'0.5px' }}>⚠ RESEARCH PILOT ONLY — This system operates under the NUS/ISOC Internet Society Research Programme. Not authorised for public deployment. Sandbox environment — no real citizen data.</span>
      </div>
      <div style={{ fontFamily:'DM Sans', fontSize:'9px', color:'#5A6A8A' }}>Research Agreement · Privacy Policy · Contact: synergyblockchaintf@gmail.com · © 2026 Synergy Blockchain Pacific</div>
    </div>
  )
}

// ─── Root App ───────────────────────────────────────────────────────────────

export default function App() {
  const { soundEnabled, toggleSound, hoverCard, clickCard, blockPulse } = useSoundSystem()
  const { blockNumber, isLive } = useChainStats()
  const prevBlockRef  = useRef(null)
  const toastTimerRef = useRef(null)
  const [toastVisible, setToastVisible] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== 'undefined' && window.innerWidth <= 640
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const showToast = React.useCallback(() => {
    setToastVisible(true)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000)
  }, [])

  // Trigger blockPulse sound on each new block
  useEffect(() => {
    if (blockNumber !== null && blockNumber !== prevBlockRef.current) {
      prevBlockRef.current = blockNumber
      blockPulse()
    }
  }, [blockNumber, blockPulse])

  return (
    <>
      {/* z-9999 — first-visit gate */}
      <ResearchGate />

      {/* toast notification */}
      <Toast visible={toastVisible} />

      {/* z-0 — WebGL network */}
      <BlockchainCanvas blockNumber={blockNumber} />

      {/* z-1 — tapa cloth overlay */}
      <TapaPattern />

      {/* z-10 — all UI content */}
      <div style={{
        position:      'relative',
        zIndex:        10,
        minHeight:     '100vh',
        display:       'flex',
        flexDirection: 'column',
        fontFamily:    F.ui,
      }}>
        {/* z-50 — sticky authority bar */}
        <AuthorityBar
          blockNumber={blockNumber}
          isLive={isLive}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
        />

        <main style={{
          flex:          1,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          justifyContent:'center',
          padding:       '48px 24px 40px',
          gap:           '20px',
          textAlign:     'center',
        }}>
          {/* Hero title */}
          <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'4px' }}>
            <div style={{ width:'4px', height:'56px', background: C.flag, borderRadius:'2px' }} />
            <h1 style={{
              fontFamily: F.display,
              fontSize:   'clamp(26px, 5vw, 52px)',
              fontWeight: 700,
              color:      C.white,
              margin:     0,
              lineHeight: 1.1,
            }}>
              Samoa Digital Public Infrastructure
            </h1>
          </div>

          <p style={{ fontFamily: F.ui, fontSize:'17px', color: C.silver, maxWidth:'540px', margin:0, lineHeight:1.5, fontWeight:500 }}>
            Sovereign Blockchain Research Programme
          </p>
          <p style={{ fontFamily: F.ui, fontSize:'13px', color: C.muted, maxWidth:'480px', margin:0, lineHeight:1.6 }}>
            Privacy-preserving citizen verification and cross-ministry interoperability,
            powered by a permissioned blockchain layer.
          </p>

          {/* Live stats strip */}
          <StatsStrip isLive={isLive} />

          {/* Portal cards */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap:                 '16px',
            width:               '100%',
            maxWidth:            '960px',
            marginTop:           '8px',
          }}>
            {PORTALS.map(p => (
              <PortalCard
                key={p.id}
                {...p}
                isLive={isLive}
                hoverCard={hoverCard}
                clickCard={clickCard}
                onShowToast={showToast}
              />
            ))}
          </div>
        </main>

        <GovFooter />
      </div>
    </>
  )
}
