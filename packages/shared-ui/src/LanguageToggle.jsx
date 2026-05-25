import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext({ lang: 'EN', toggle: () => {}, setLang: () => {} })

export function LanguageProvider({ children, defaultLang = 'EN' }) {
  const [lang, setLang] = useState(defaultLang)
  const toggle = () => setLang(l => (l === 'EN' || l === 'en') ? 'SM' : 'EN')
  return (
    <LanguageContext.Provider value={{ lang, toggle, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}

// Alias for citizens app which uses useLanguage
export const useLanguage = useLang

export function LanguageToggle({ className, style: extraStyle }) {
  const { lang, toggle } = useLang()
  const isSM = lang === 'SM' || lang === 'sm'

  return (
    <button
      onClick={toggle}
      className={className}
      aria-label={`Switch language — currently ${lang.toUpperCase()}`}
      style={{
        background:    'rgba(255,255,255,0.12)',
        border:        '1px solid rgba(255,255,255,0.3)',
        borderRadius:  'var(--radius-sm)',
        color:         '#fff',
        cursor:        'pointer',
        fontFamily:    'var(--font-mono)',
        fontSize:      11,
        fontWeight:    600,
        letterSpacing: '1px',
        minHeight:     'var(--touch-target)',
        padding:       '0 14px',
        transition:    'background var(--transition-fast)',
        ...extraStyle,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
    >
      {isSM ? 'EN' : 'SM'}
    </button>
  )
}
