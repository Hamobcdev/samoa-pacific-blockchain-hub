import React from 'react'
import { FL, CL, SERVICE_CATEGORIES } from '../theme.js'

const coatStars = (
  <div style={{
    display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
    gridTemplateRows:'1fr 1fr 1fr', gap:'2px',
    textAlign:'center', fontSize:'10px', color:'#C9A227', lineHeight:1,
  }}>
    <span/><span>★</span><span/>
    <span>★</span><span>★</span><span>★</span>
    <span/><span>★</span><span/>
  </div>
)

export default function ServiceScreen({ service, t, lang, onBack, onPay }) {
  const cat = SERVICE_CATEGORIES.find(c => c.id === service.category) || SERVICE_CATEGORIES[0]

  return (
    <div style={{
      maxWidth:  '640px',
      margin:    '0 auto',
      padding:   '16px',
      display:   'flex',
      flexDirection: 'column',
      gap:       '16px',
    }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          alignSelf:   'flex-start',
          background:  'transparent',
          border:      'none',
          fontFamily:  FL.ui,
          fontSize:    '14px',
          fontWeight:  600,
          color:       CL.primary,
          cursor:      'pointer',
          padding:     '4px 0',
          display:     'flex',
          alignItems:  'center',
          gap:         '4px',
        }}
      >
        ← {t('service.back')}
      </button>

      {/* Ministry card */}
      <div style={{
        background:   CL.surface,
        border:       `1px solid ${CL.border}`,
        borderTop:    `3px solid ${cat.color}`,
        borderRadius: '12px',
        padding:      '20px',
        display:      'flex',
        alignItems:   'center',
        gap:          '16px',
      }}>
        <div style={{
          width:        '48px',
          height:       '48px',
          border:       '2px solid #C9A227',
          borderRadius: '50%',
          display:      'flex',
          alignItems:   'center',
          justifyContent:'center',
          flexShrink:   0,
        }}>
          {coatStars}
        </div>
        <div>
          <div style={{ fontFamily: FL.mono, fontSize: '9px', color: CL.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
            {t('service.time')} · {service.time}
          </div>
          <div style={{ fontFamily: FL.display, fontSize: '18px', fontWeight: 600, color: CL.text }}>
            {service.ministry}
          </div>
          <div style={{ fontFamily: FL.ui, fontSize: '13px', color: CL.muted, marginTop: '2px' }}>
            {service.nameKey}
          </div>
        </div>
      </div>

      {/* Fee prominent */}
      <div style={{
        background:     CL.goldLight,
        border:         `1px solid ${CL.gold}44`,
        borderLeft:     `4px solid ${CL.gold}`,
        borderRadius:   '10px',
        padding:        '16px 20px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: FL.ui, fontSize: '14px', color: CL.warning }}>
          {t('service.fee')}
        </span>
        <span style={{ fontFamily: FL.display, fontSize: '28px', fontWeight: 700, color: '#8A5A00' }}>
          {service.fee}
        </span>
      </div>

      {/* What you need */}
      <div style={{
        background:   CL.surface,
        border:       `1px solid ${CL.border}`,
        borderRadius: '12px',
        padding:      '20px',
      }}>
        <div style={{ fontFamily: FL.ui, fontSize: '12px', fontWeight: 700, color: CL.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
          What you need
        </div>
        {['Original ID document', 'Completed application form', 'Proof of residence'].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: `1px solid ${CL.border}` }}>
            <span style={{ color: CL.success, fontSize: '14px' }}>✓</span>
            <span style={{ fontFamily: FL.ui, fontSize: '13px', color: CL.textSoft }}>{item}</span>
          </div>
        ))}
      </div>

      {/* What you get */}
      <div style={{
        background:   CL.successLight,
        border:       `1px solid ${CL.success}33`,
        borderRadius: '12px',
        padding:      '16px 20px',
      }}>
        <div style={{ fontFamily: FL.ui, fontSize: '12px', fontWeight: 700, color: CL.success, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
          What you receive
        </div>
        <p style={{ fontFamily: FL.ui, fontSize: '13px', color: CL.textSoft, margin: 0, lineHeight: 1.6 }}>
          An official government credential issued on the Samoa sovereign blockchain, verifiable by any ministry or authorised agency.
        </p>
      </div>

      {/* Apply button */}
      <button
        onClick={onPay}
        style={{
          background:   CL.primary,
          color:        '#FFFFFF',
          border:       'none',
          borderRadius: '10px',
          height:       '48px',
          width:        '100%',
          fontFamily:   FL.ui,
          fontSize:     '15px',
          fontWeight:   700,
          cursor:       'pointer',
          letterSpacing:'0.3px',
        }}
      >
        {t('service.apply')} →
      </button>
    </div>
  )
}
