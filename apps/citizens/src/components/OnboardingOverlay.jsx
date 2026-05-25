import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { CL, FL } from '../theme.js'

const STEPS = [
  {
    sm_title:  'O lau faamaumauga faʻamaonia',
    en_title:  'Your verified government record',
    sm_body:   'O lenei o lau faamaumauga faalelotu a le malo. E saogalemu — na o oe lava e mafai ona vaai.',
    en_body:   'This is your government digital record. It is secure — only you can see it.',
  },
  {
    sm_title:  'O ā ou tautua',
    en_title:  'Your service history',
    sm_body:   'Vaai le lisi o matagaluega ua faamaonia au tautua. E manaomia lou tofia.',
    en_body:   'See which ministries have verified your services. Your record stays private.',
  },
  {
    sm_title:  'Le Tupe Faaeletonika',
    en_title:  'Digital Tālā',
    sm_body:   'O le Tupe Faaeletonika o le a avanoa i luma. O lenei vaega o loʻo faatali mo le faʻaalia.',
    en_body:   'The Digital Tālā will be available soon. This section is coming in the next phase.',
  },
]

export function OnboardingOverlay() {
  const { lang } = useLanguage()
  const [step, setStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('sdpi_citizens_onboarding_done')) {
      setDismissed(true)
    }
  }, [])

  function dismiss() {
    sessionStorage.setItem('sdpi_citizens_onboarding_done', '1')
    setDismissed(true)
  }

  if (dismissed) return null

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1
  const isSM    = lang === 'sm'

  return (
    <div role="dialog" aria-modal="true" aria-label={isSM ? 'Faʻailoa fou' : 'Getting started'} style={{
      position:       'fixed',
      inset:          0,
      zIndex:         9990,
      background:     'rgba(0,0,0,0.6)',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '24px',
    }}>
      <div style={{
        background:   CL.surface,
        border:       `1px solid ${CL.border}`,
        borderRadius: 16,
        padding:      '32px 24px',
        maxWidth:     400,
        width:        '100%',
        display:      'flex',
        flexDirection: 'column',
        gap:          16,
      }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              height:      4,
              flex:        1,
              borderRadius: 2,
              background:  i <= step ? CL.primary : CL.border,
            }} />
          ))}
        </div>

        <div style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, letterSpacing: '0.5px' }}>
          {isSM ? `Laasaga ${step + 1} o le ${STEPS.length}` : `Step ${step + 1} of ${STEPS.length}`}
        </div>

        {/* SM title — larger */}
        <div>
          <div style={{ fontFamily: FL.display, fontSize: 22, fontWeight: 700, color: CL.primary, lineHeight: 1.2, marginBottom: 4 }}>
            {isSM ? current.sm_title : current.en_title}
          </div>
          {isSM && (
            <div style={{ fontFamily: FL.ui, fontSize: 12, color: CL.muted }}>
              {current.en_title}
            </div>
          )}
        </div>

        <p style={{ fontFamily: FL.ui, fontSize: '16px', lineHeight: '1.8', color: CL.textSoft, margin: 0 }}>
          {isSM ? current.sm_body : current.en_body}
        </p>

        <button
          onClick={isLast ? dismiss : () => setStep(s => s + 1)}
          style={{
            background:   CL.primary,
            color:        '#fff',
            fontFamily:   FL.ui,
            fontSize:     '16px',
            fontWeight:   700,
            border:       'none',
            borderRadius: 8,
            padding:      '14px',
            minHeight:    '48px',
            cursor:       'pointer',
            width:        '100%',
          }}
        >
          {isLast
            ? (isSM ? 'Ou te malamalama →' : 'Got it →')
            : (isSM ? 'Soso atu →' : 'Next →')
          }
        </button>
      </div>
    </div>
  )
}
