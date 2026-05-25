import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { CL, FL } from '../theme.js'

// Simulated citizen record data keyed by reference number
const MOCK_RECORDS = {
  'SC-001': {
    ministryServices: [
      { ministry: 'Ministry of Health', service: 'Medical records update', date: '15/05/2026' },
      { ministry: 'Ministry of Education', service: 'Education enrolment confirmed', date: '03/03/2026' },
    ],
  },
  'SC-002': {
    ministryServices: [
      { ministry: 'Ministry of Finance', service: 'Tax records registered', date: '10/04/2026' },
    ],
  },
}

const T = {
  heading:     { sm: 'O Lou Faamaumauga', en: 'Your Government Record' },
  subheading:  { sm: 'Faamaumauga Faʻamaonia', en: 'Verified government record' },
  placeholder: { sm: 'Fa\'aulu lau numera fa\'ailoga', en: 'Enter your reference number' },
  button:      { sm: 'Su\'e la\'u faamaumauga →', en: 'Check my record →' },
  registered:  { sm: '✓ Ua lesitala ma le Malo o Samoa', en: '✓ Registered with the Government of Samoa' },
  recorded:    { sm: 'Ua faamauina lau tautua', en: 'recorded your service' },
  notFound:    { sm: 'E le\'i maua le faamaumauga. Toe taumafai.', en: 'Record not found. Try SC-001 or SC-002.' },
  label:       { sm: 'Numera Fa\'ailoga', en: 'Reference Number' },
}

export function IdentityView() {
  const { lang } = useLanguage()
  const t = (key) => T[key]?.[lang] ?? T[key]?.en ?? key
  const [ref, setRef] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)

  function handleSearch(e) {
    e.preventDefault()
    const record = MOCK_RECORDS[ref.trim().toUpperCase()]
    setResult(record || null)
    setSearched(true)
  }

  return (
    <section aria-labelledby="identity-heading" style={{
      background: CL.surface,
      border:     `1px solid ${CL.border}`,
      borderTop:  `3px solid ${CL.primary}`,
      borderRadius: 12,
      padding:    '28px 24px',
      maxWidth:   640,
      margin:     '0 auto',
    }}>
      <h2 id="identity-heading" style={{ fontFamily: FL.display, fontSize: 22, fontWeight: 700, color: CL.primary, margin: '0 0 4px' }}>
        {t('heading')}
      </h2>
      <p style={{ fontFamily: FL.ui, fontSize: 13, color: CL.muted, margin: '0 0 20px' }}>
        {t('subheading')}
      </p>

      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label htmlFor="ref-input" style={{ fontFamily: FL.mono, fontSize: 11, color: CL.textSoft, letterSpacing: '0.5px' }}>
          {t('label')}
        </label>
        <input
          id="ref-input"
          type="text"
          value={ref}
          onChange={e => setRef(e.target.value)}
          placeholder={t('placeholder')}
          aria-required="true"
          style={{
            fontFamily:   FL.ui,
            fontSize:     '16px',
            color:        CL.text,
            background:   CL.surface,
            border:       `1px solid ${CL.border}`,
            borderRadius: 8,
            padding:      '14px 16px',
            outline:      'none',
            width:        '100%',
            boxSizing:    'border-box',
            minHeight:    '48px',
          }}
          onFocus={e => { e.target.style.borderColor = CL.primary }}
          onBlur={e => { e.target.style.borderColor = CL.border }}
        />
        <button
          type="submit"
          style={{
            background:   CL.primary,
            color:        '#fff',
            fontFamily:   FL.ui,
            fontSize:     '16px',
            fontWeight:   700,
            border:       'none',
            borderRadius: 8,
            padding:      '14px 24px',
            minHeight:    '48px',
            cursor:       'pointer',
            width:        '100%',
          }}
        >
          {t('button')}
        </button>
      </form>

      {/* PHASE 2: replace mock with NDIDSRegistry.getRecord() call */}

      {searched && result && (
        <div role="status" style={{ marginTop: 20, padding: '16px', background: '#e6f4ec', border: `1px solid ${CL.success}`, borderRadius: 8 }}>
          <p style={{ fontFamily: FL.ui, fontSize: 14, color: CL.success, fontWeight: 700, margin: '0 0 12px' }}>
            {t('registered')}
          </p>
          {result.ministryServices.map((s, i) => (
            <div key={i} style={{ marginBottom: 10, borderBottom: i < result.ministryServices.length - 1 ? `1px solid ${CL.border}` : 'none', paddingBottom: 10 }}>
              <div style={{ fontFamily: FL.ui, fontSize: 14, color: CL.text, fontWeight: 600 }}>{s.ministry}</div>
              <div style={{ fontFamily: FL.ui, fontSize: 13, color: CL.muted }}>{t('recorded')} · {s.date}</div>
              <div style={{ fontFamily: FL.ui, fontSize: 12, color: CL.textSoft }}>{s.service}</div>
            </div>
          ))}
        </div>
      )}

      {searched && !result && (
        <p role="alert" style={{ marginTop: 16, fontFamily: FL.ui, fontSize: 14, color: CL.error }}>
          {t('notFound')}
        </p>
      )}
    </section>
  )
}
