import React, { useState } from 'react'
import { FL, CL } from '../theme.js'

const MAGNIFIER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <circle cx="20" cy="20" r="14" stroke="#DDD6C8" stroke-width="2.5"/>
  <line x1="30.5" y1="30.5" x2="42" y2="42" stroke="#DDD6C8" stroke-width="2.5" stroke-linecap="round"/>
</svg>`

const DEMO_RESULT = {
  reference:   'SPS-2026-00142',
  service:     'Police Clearance Certificate',
  ministry:    'Samoa Police Service',
  status:      'Issued',
  issued:      '14/05/2026 09:41 (WST)',
  hash:        '0xA3F2...8E91',
}

export default function TrackScreen({ t, lang, onBack }) {
  const [ref, setRef]       = useState('')
  const [nid, setNid]       = useState('')
  const [searched, setSearched] = useState(false)
  const [result, setResult] = useState(null)

  const handleSearch = () => {
    setSearched(true)
    // Demo: always return the dummy result when either field is filled
    if (ref.trim() || nid.trim()) {
      setResult(DEMO_RESULT)
    } else {
      setResult(null)
    }
  }

  return (
    <div style={{
      maxWidth:      '480px',
      margin:        '0 auto',
      padding:       '24px 16px',
      display:       'flex',
      flexDirection: 'column',
      gap:           '20px',
    }}>
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

      <div>
        <h2 style={{ fontFamily: FL.display, fontSize: '26px', fontWeight: 700, color: CL.text, margin: '0 0 6px' }}>
          {t('track.title')}
        </h2>
        <p style={{ fontFamily: FL.ui, fontSize: '13px', color: CL.muted, margin: 0, lineHeight: 1.6 }}>
          {t('track.subtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { label: t('track.reference'), value: ref, setter: setRef, placeholder: 'SPS-2026-XXXXX' },
          { label: t('track.nid'),       value: nid, setter: setNid, placeholder: 'NID-XXXXXXXX'   },
        ].map(field => (
          <div key={field.label}>
            <label style={{ fontFamily: FL.ui, fontSize: '13px', fontWeight: 600, color: CL.textSoft, display: 'block', marginBottom: '6px' }}>
              {field.label}
            </label>
            <input
              type="text"
              placeholder={field.placeholder}
              value={field.value}
              onChange={e => field.setter(e.target.value)}
              style={{
                width:        '100%',
                height:       '44px',
                background:   CL.surface,
                border:       `1px solid ${CL.border2}`,
                borderRadius: '8px',
                padding:      '0 14px',
                fontFamily:   FL.mono,
                fontSize:     '13px',
                color:        CL.text,
                boxSizing:    'border-box',
                outline:      'none',
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSearch}
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
        }}
      >
        {t('track.search')}
      </button>

      {/* Results */}
      {searched && result && (
        <div style={{
          background:   CL.surface,
          border:       `1px solid ${CL.border}`,
          borderLeft:   `4px solid ${CL.success}`,
          borderRadius: '10px',
          padding:      '18px 20px',
          display:      'flex',
          flexDirection:'column',
          gap:          '8px',
        }}>
          {[
            ['Reference', result.reference],
            ['Service',   result.service],
            ['Ministry',  result.ministry],
            ['Status',    result.status],
            ['Issued',    result.issued],
            ['Hash',      result.hash],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'baseline', borderBottom: `1px solid ${CL.border}`, paddingBottom: '6px' }}>
              <span style={{ fontFamily: FL.ui, fontSize: '12px', color: CL.muted, flexShrink: 0 }}>{k}</span>
              <span style={{ fontFamily: FL.mono, fontSize: '12px', color: CL.text, textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      {searched && !result && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 0' }}>
          <div dangerouslySetInnerHTML={{ __html: MAGNIFIER_SVG }} />
          <span style={{ fontFamily: FL.ui, fontSize: '13px', color: CL.muted, textAlign: 'center' }}>
            {t('track.notfound')}
          </span>
        </div>
      )}
    </div>
  )
}
