import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext({ lang: 'sm', toggle: () => {} })

export function LanguageProvider({ children, defaultLang = 'sm' }) {
  const [lang, setLang] = useState(defaultLang)
  const toggle = () => setLang(l => l === 'sm' ? 'en' : 'sm')
  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
