import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { CL, FL } from '../theme.js'

const T = {
  heading:  { sm: 'Le Tupe Faaeletonika', en: 'Your Digital Tālā' },
  coming:   { sm: 'O lau tupe faaeletonika o le a aliali mai i luga nei a maeʻa ona faʻaalu aloaia le faiga.', en: 'Your Digital Tālā balance will appear here once the system is officially launched.' },
  learn:    { sm: 'Aoao atili e uiga i le Tupe Faaeletonika →', en: 'Learn more about the Digital Tālā →' },
}

export function BalanceView() {
  const { lang } = useLanguage()
  const t = (key) => T[key]?.[lang] ?? T[key]?.en ?? key

  return (
    <section aria-labelledby="balance-heading" style={{
      background:  CL.surface,
      border:      `1px solid ${CL.border}`,
      borderTop:   `3px solid ${CL.primary}`,
      borderRadius: 12,
      padding:     '28px 24px',
      maxWidth:    640,
      margin:      '0 auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }} aria-hidden="true">💰</span>
        <h2 id="balance-heading" style={{ fontFamily: FL.display, fontSize: 22, fontWeight: 700, color: CL.primary, margin: 0 }}>
          {t('heading')}
        </h2>
      </div>

      <p style={{
        fontFamily: FL.ui,
        fontSize:   '16px',
        lineHeight: '1.8',
        color:      CL.textSoft,
        margin:     '0 0 20px',
      }}>
        {t('coming')}
      </p>

      <a
        href="#"
        onClick={e => e.preventDefault()}
        style={{
          display:      'inline-block',
          background:   CL.primary,
          color:        '#fff',
          fontFamily:   FL.ui,
          fontSize:     '14px',
          fontWeight:   600,
          textDecoration: 'none',
          borderRadius: 8,
          padding:      '12px 20px',
          minHeight:    '48px',
          lineHeight:   '24px',
        }}
      >
        {t('learn')}
      </a>
    </section>
  )
}
