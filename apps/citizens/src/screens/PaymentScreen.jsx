import React, { useState } from 'react'
import { FL, CL } from '../theme.js'

const METHODS = [
  { id: 'mpay',    label: 'M-Pay',    color: '#7040A8', bg: '#F3EEFF' },
  { id: 'bsp',     label: 'BSP Bank', color: '#003087', bg: '#EEF3FB' },
  { id: 'digicel', label: 'Digicel',  color: '#CE1126', bg: '#FDE8EB' },
]

export default function PaymentScreen({ service, t, lang, onBack, onSuccess }) {
  const [method, setMethod]     = useState(null)
  const [mobile, setMobile]     = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = () => {
    if (!method) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSuccess()
    }, 2000)
  }

  return (
    <div style={{
      maxWidth:      '480px',
      margin:        '0 auto',
      padding:       '16px',
      display:       'flex',
      flexDirection: 'column',
      gap:           '16px',
    }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          alignSelf:  'flex-start',
          background: 'transparent',
          border:     'none',
          fontFamily: FL.ui,
          fontSize:   '14px',
          fontWeight: 600,
          color:      CL.primary,
          cursor:     'pointer',
          padding:    '4px 0',
        }}
      >
        ← {t('service.back')}
      </button>

      {/* Title */}
      <h2 style={{ fontFamily: FL.display, fontSize: '24px', fontWeight: 700, color: CL.text, margin: 0 }}>
        {t('payment.title')}
      </h2>

      {/* Service summary */}
      <div style={{
        background:     CL.goldLight,
        border:         `1px solid ${CL.gold}44`,
        borderRadius:   '10px',
        padding:        '14px 20px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: FL.ui, fontSize: '12px', color: CL.muted }}>{service.nameKey}</div>
          <div style={{ fontFamily: FL.mono, fontSize: '10px', color: CL.muted, marginTop: '2px' }}>{t('payment.amount')}</div>
        </div>
        <span style={{ fontFamily: FL.display, fontSize: '26px', fontWeight: 700, color: '#8A5A00' }}>
          {service.fee}
        </span>
      </div>

      {/* Payment method */}
      <div>
        <div style={{ fontFamily: FL.ui, fontSize: '13px', fontWeight: 600, color: CL.textSoft, marginBottom: '10px' }}>
          {t('payment.method')}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {METHODS.map(m => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              style={{
                flex:         1,
                height:       '52px',
                background:   method === m.id ? m.bg : '#FFFFFF',
                border:       `2px solid ${method === m.id ? m.color : CL.border}`,
                borderRadius: '10px',
                fontFamily:   FL.ui,
                fontSize:     '13px',
                fontWeight:   700,
                color:        method === m.id ? m.color : CL.textSoft,
                cursor:       'pointer',
                transition:   'all 0.15s',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div style={{
          fontFamily:  FL.mono,
          fontSize:    '9px',
          color:       CL.muted,
          textAlign:   'center',
          marginTop:   '8px',
          letterSpacing: '0.3px',
        }}>
          Integration coming — demo flow only
        </div>
      </div>

      {/* Mobile input */}
      <div>
        <label style={{ fontFamily: FL.ui, fontSize: '13px', fontWeight: 600, color: CL.textSoft, display: 'block', marginBottom: '6px' }}>
          {t('payment.mobile')}
        </label>
        <input
          type="tel"
          placeholder="+685 ..."
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          style={{
            width:        '100%',
            height:       '44px',
            background:   CL.surface,
            border:       `1px solid ${CL.border2}`,
            borderRadius: '8px',
            padding:      '0 14px',
            fontFamily:   FL.mono,
            fontSize:     '14px',
            color:        CL.text,
            boxSizing:    'border-box',
            outline:      'none',
          }}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!method || loading}
        style={{
          background:   (!method || loading) ? CL.border : CL.primary,
          color:        (!method || loading) ? CL.muted : '#FFFFFF',
          border:       'none',
          borderRadius: '10px',
          height:       '48px',
          width:        '100%',
          fontFamily:   FL.ui,
          fontSize:     '15px',
          fontWeight:   700,
          cursor:       (!method || loading) ? 'not-allowed' : 'pointer',
          transition:   'background 0.15s',
        }}
      >
        {loading ? t('payment.processing') : t('payment.submit')}
      </button>
    </div>
  )
}
