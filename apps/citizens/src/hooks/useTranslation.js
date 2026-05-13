import { useState } from 'react'
import { t, SUPPORTED_LANGS } from '@samoa-dpi/i18n'

export default function useTranslation() {
  const [lang, setLang] = useState('en')
  const toggleLang = () =>
    setLang(l => l === 'en' ? 'sm' : 'en')
  return {
    lang,
    toggleLang,
    t: (key) => t(key, lang),
  }
}
