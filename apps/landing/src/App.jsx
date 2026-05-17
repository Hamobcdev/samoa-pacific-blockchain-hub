import React, { useEffect, useRef } from 'react'
import { C, F } from '@samoa-dpi/shared-ui'
import { OPERATIONAL_NODES, GOVERNMENT_NODES } from '@samoa-dpi/contracts-abi'
import { ResearchGate }  from '@samoa-dpi/shared-ui'
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

const PORTALS = [
  {
    id:        'citizens',
    label:     'Citizens Portal',
    href:      'https://samoa-dpi-citizens.vercel.app',
    icon:      '◉',
    desc:      'View your government records and Digital Tālā',
    audience:  'For Samoan citizens',
    showLive:  true,
    badge:     null,
    legacyUrl: null,
  },
  {
    id:        'ministry',
    label:     'CBS Administration',
    href:      'https://samoa-dpi-admin-o8hjex7t2-synergy-core-devs.vercel.app',
    icon:      '⬡',
    desc:      'CBS oversight, governance decisions, node health',
    audience:  'For CBS and ministry officials',
    showLive:  true,
    badge:     null,
    legacyUrl: null,
  },
  {
    id:        'donor',
    label:     'Development Partners',
    href:      'https://samoa-dpi-donor-8h822jg1h-synergy-core-devs.vercel.app',
    icon:      '◈',
    desc:      'Grant lifecycle transparency and disbursement verification for international development partners',
    audience:  'For World Bank, ADB, ISOC, bilateral donors',
    showLive:  true,
    badge:     null,
    legacyUrl: null,
  },
  {
    id:        'verify',
    label:     'Verify a Credential',
    href:      'https://samoa-dpi-verify-clqfc53lj-synergy-core-devs.vercel.app',
    icon:      '✦',
    desc:      'Confirm a government-issued record is authentic',
    audience:  'For employers, service providers, verification bodies',
    note:      'Also accessible from the Citizens Portal',
    showLive:  true,
    badge:     null,
    legacyUrl: null,
  },
]

// ─── Portal Card ────────────────────────────────────────────────────────────

function PortalCard({ label, href, icon, desc, audience, note, showLive, isLive, badge, legacyUrl, hoverCard, clickCard, onShowToast }) {
  const [hovered, setHovered] = React.useState(false)

  const handleClick = (e) => {
    clickCard?.()
    if (href === '#') {
      e.preventDefault()
      onShowToast?.()
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
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

      {audience && (
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: C.gold, opacity: 0.75, letterSpacing: '0.3px' }}>
          {audience}
        </span>
      )}

      {note && (
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: C.silver, opacity: 0.55, letterSpacing: '0.2px' }}>
          {note}
        </span>
      )}

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

// ─── Static Node Network (mobile fallback for Three.js canvas — LAND-2) ────

function StaticNodeNetwork() {
  const nodes = [
    { x: 50,  y: 50,  color: '#C9A227' },
    { x: 200, y: 30,  color: '#CE1126' },
    { x: 350, y: 60,  color: '#003087' },
    { x: 480, y: 40,  color: '#C9A227' },
    { x: 80,  y: 150, color: '#003087' },
    { x: 260, y: 140, color: '#CE1126' },
    { x: 420, y: 160, color: '#C9A227' },
    { x: 550, y: 130, color: '#003087' },
  ]
  const edges = [
    [0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],
  ]
  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, overflow:'hidden', opacity:0.35 }}>
      <svg viewBox="0 0 600 200" style={{ width:'100%', height:'100%', objectFit:'cover' }} aria-hidden="true">
        {edges.map(([a,b],i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
            stroke="#1b2540" strokeWidth="1" />
        ))}
        {nodes.map((n,i) => (
          <circle key={i} cx={n.x} cy={n.y} r="6" fill={n.color} opacity="0.8" />
        ))}
      </svg>
    </div>
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
      <div style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:'10px', color:'#6b7a99', textAlign:'center', lineHeight:1.7, maxWidth:'640px' }}>
        Secure blockchain service layer for mygov.gov.ws — Samoa DPI Research Programme 2026
      </div>
      <div style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:'10px', color:'#6b7a99', textAlign:'center', lineHeight:1.7, maxWidth:'640px' }}>
        This is a research prototype operated under the NUS/ISOC Research Programme 2026.
        No real citizen data is held. This platform is not officially sanctioned by the
        Government of Samoa. For enquiries: synergyblockchaintf@gmail.com
      </div>
    </div>
  )
}

// ─── Root App ───────────────────────────────────────────────────────────────

const IS_MOBILE_DEVICE = typeof window !== 'undefined' &&
  (window.innerWidth < 768 || /iPhone|iPad|Android/i.test(navigator.userAgent))

export default function App() {
  const { soundEnabled, toggleSound, hoverCard, clickCard, blockPulse } = useSoundSystem(IS_MOBILE_DEVICE)
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
      <ResearchGate storageKey="sdpi_landing_acknowledged" />

      {/* toast notification */}
      <Toast visible={toastVisible} />

      {/* z-0 — WebGL network (desktop) or static SVG (mobile — LAND-2) */}
      {IS_MOBILE_DEVICE
        ? <StaticNodeNetwork />
        : <BlockchainCanvas blockNumber={blockNumber} />
      }

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
