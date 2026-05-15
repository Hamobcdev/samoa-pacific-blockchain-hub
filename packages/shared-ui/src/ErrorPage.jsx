import React from 'react'

export function ErrorPage({ title, message, code, onRetry, lang = 'EN' }) {
  const isSM = lang === 'SM' || lang === 'sm'

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'var(--color-bg)',
        color:          'var(--color-text)',
        padding:        'var(--space-6)',
        fontFamily:     'var(--font-ui)',
        textAlign:      'center',
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 48, color: 'var(--color-critical)', marginBottom: 16, lineHeight: 1 }}>
        ✗
      </div>

      {code && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-muted)', letterSpacing: '2px', marginBottom: 8 }}>
          {isSM ? 'SESE' : 'ERROR'} {code}
        </div>
      )}

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>
        {title ?? (isSM ? 'Ua tupu se sese' : 'Something went wrong')}
      </h1>

      <p style={{ color: 'var(--color-muted)', fontSize: 14, maxWidth: 480, lineHeight: 1.7, marginBottom: 32 }}>
        {message ?? (isSM
          ? 'E le mafai ona faʻaalia lenei itulau. Faʻamolemole taumafai foi.'
          : 'This page could not be displayed. Please try again.'
        )}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background:    'var(--color-flag-blue)',
            border:        'none',
            borderRadius:  'var(--radius-md)',
            color:         '#fff',
            cursor:        'pointer',
            fontFamily:    'var(--font-mono)',
            fontSize:      12,
            fontWeight:    600,
            letterSpacing: '1px',
            minHeight:     'var(--touch-target)',
            padding:       '0 24px',
          }}
        >
          {isSM ? 'Taumafai Foi' : 'Try Again'}
        </button>
      )}

      <div style={{ marginTop: 48, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-dim)', letterSpacing: '1px' }}>
        SAMOA DPI · PHASE 1 RESEARCH ENVIRONMENT
      </div>
    </div>
  )
}
