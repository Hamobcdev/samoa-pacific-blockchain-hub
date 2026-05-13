import en from './en.json'
import sm from './sm.json'

const translations = { en, sm }

export function t(key, lang = 'en') {
  return translations[lang]?.[key] || translations.en[key] || key
}

export const SUPPORTED_LANGS = ['en', 'sm']
export const LANG_LABELS = { en: 'English', sm: 'Gagana Samoa' }
