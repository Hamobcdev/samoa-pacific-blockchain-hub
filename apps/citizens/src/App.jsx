import React, { useState } from 'react'
import { CL, FL } from './theme.js'
import useTranslation from './hooks/useTranslation.js'
import CitizenHeader  from './components/CitizenHeader.jsx'
import BottomNav      from './components/BottomNav.jsx'
import HomeScreen     from './screens/HomeScreen.jsx'
import BrowseScreen   from './screens/BrowseScreen.jsx'
import ServiceScreen  from './screens/ServiceScreen.jsx'
import PaymentScreen  from './screens/PaymentScreen.jsx'
import SuccessScreen  from './screens/SuccessScreen.jsx'
import TrackScreen    from './screens/TrackScreen.jsx'

if (typeof document !== 'undefined' && !document.getElementById('sdpi-fonts')) {
  const l = document.createElement('link')
  l.id = 'sdpi-fonts'; l.rel = 'stylesheet'
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@400;500;700;800&display=swap'
  document.head.appendChild(l)
}

export default function App() {
  const { lang, toggleLang, t }       = useTranslation()
  const [screen, setScreen]           = useState('home')
  const [selectedService, setSelectedService] = useState(null)

  function navigate(to, data = null) {
    if (data) setSelectedService(data)
    setScreen(to)
    window.scrollTo(0, 0)
  }

  return (
    <div style={{
      minHeight:   '100vh',
      background:  CL.background,
      color:       CL.text,
      fontFamily:  FL.ui,
      display:     'flex',
      flexDirection:'column',
      maxWidth:    '100vw',
      overflowX:   'hidden',
    }}>
      <CitizenHeader
        t={t}
        lang={lang}
        toggleLang={toggleLang}
        currentScreen={screen}
        onNavigate={navigate}
      />

      <main style={{ flex: 1, paddingBottom: '80px' }}>
        {screen === 'home' && (
          <HomeScreen
            t={t}
            lang={lang}
            onNavigate={navigate}
            onSelectService={s => navigate('service', s)}
          />
        )}
        {screen === 'browse' && (
          <BrowseScreen
            t={t}
            lang={lang}
            onBack={() => navigate('home')}
            onSelectService={s => navigate('service', s)}
          />
        )}
        {screen === 'service' && selectedService && (
          <ServiceScreen
            service={selectedService}
            t={t}
            lang={lang}
            onBack={() => navigate('browse')}
            onPay={() => navigate('payment')}
          />
        )}
        {screen === 'payment' && selectedService && (
          <PaymentScreen
            service={selectedService}
            t={t}
            lang={lang}
            onBack={() => navigate('service')}
            onSuccess={() => navigate('success')}
          />
        )}
        {screen === 'success' && selectedService && (
          <SuccessScreen
            service={selectedService}
            t={t}
            lang={lang}
            onHome={() => navigate('home')}
            onTrack={() => navigate('track')}
          />
        )}
        {screen === 'track' && (
          <TrackScreen
            t={t}
            lang={lang}
            onBack={() => navigate('home')}
          />
        )}
      </main>

      <BottomNav
        currentScreen={screen}
        onNavigate={navigate}
        toggleLang={toggleLang}
        t={t}
      />
    </div>
  )
}
