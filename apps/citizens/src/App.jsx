import React, { useState, useEffect } from 'react'
import { ResearchGate } from '@samoa-dpi/shared-ui'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { OnboardingOverlay } from './components/OnboardingOverlay'
import { IdentityView }     from './components/IdentityView'
import { ConsentView }      from './components/ConsentView'
import { BalanceView }      from './components/BalanceView'
import { CL, FL } from './theme.js'

if (typeof document !== 'undefined' && !document.getElementById('sdpi-fonts')) {
  const l = document.createElement('link')
  l.id = 'sdpi-fonts'; l.rel = 'stylesheet'
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@400;500;700;800&display=swap'
  document.head.appendChild(l)
}

function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)
  const { lang } = useLanguage()

  useEffect(() => {
    const goOffline = () => setOffline(true)
    const goOnline  = () => setOffline(false)
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  if (!offline) return null

  const date = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Pacific/Apia',
  })

  return (
    <div role="alert" aria-live="polite" style={{
      background:   '#fff8e1',
      border:       `1px solid ${CL.warning}`,
      borderRadius: 0,
      padding:      '10px 20px',
      fontFamily:   FL.mono,
      fontSize:     '13px',
      color:        CL.warning,
      textAlign:    'center',
    }}>
      {lang === 'sm'
        ? `⚠ Leai le initaneti — o le faʻamaumauga mulimuli mai le ${date} WST`
        : `⚠ Offline — showing last saved data from ${date} WST`}
    </div>
  )
}

function CitizenHeader() {
  const { lang, toggle } = useLanguage()
  return (
    <header style={{
      background:    CL.primary,
      color:         '#fff',
      padding:       '12px 20px',
      display:       'flex',
      alignItems:    'center',
      justifyContent:'space-between',
    }}>
      <div>
        <div style={{ fontFamily: FL.display, fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
          {lang === 'sm' ? 'Fale Tautua Samoa' : 'Samoa Citizen Services'}
        </div>
        <div style={{ fontFamily: FL.mono, fontSize: 10, opacity: 0.75, letterSpacing: '0.5px' }}>
          DPI SAMOA · {lang === 'sm' ? 'Vaega 1' : 'Phase 1'}
        </div>
      </div>
      <button
        onClick={toggle}
        aria-label={`Switch language — currently ${lang.toUpperCase()}`}
        style={{
          background:   'rgba(255,255,255,0.15)',
          border:       '1px solid rgba(255,255,255,0.4)',
          borderRadius: 6,
          color:        '#fff',
          cursor:       'pointer',
          fontFamily:   FL.mono,
          fontSize:     11,
          padding:      '6px 12px',
          minHeight:    '48px',
        }}
      >
        {lang === 'sm' ? 'EN' : 'SM'}
      </button>
    </header>
  )
}

function CitizenApp() {
  return (
    <div style={{ minHeight: '100vh', background: CL.background, display: 'flex', flexDirection: 'column' }}>
      <OnboardingOverlay />
      <CitizenHeader />
      <OfflineBanner />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 16px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <IdentityView />
        <ConsentView />
        <BalanceView />
      </main>

      <footer style={{
        padding:    '16px 20px',
        textAlign:  'center',
        fontFamily: FL.mono,
        fontSize:   '10px',
        color:      CL.muted,
        borderTop:  `1px solid ${CL.border}`,
      }}>
        This is a research prototype operated under the NUS/ISOC Research Programme 2026.
        No real citizen data is held. For enquiries: synergyblockchaintf@gmail.com
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <ResearchGate storageKey="sdpi_citizens_acknowledged">
      <LanguageProvider defaultLang="sm">
        <CitizenApp />
      </LanguageProvider>
    </ResearchGate>
  )
}
