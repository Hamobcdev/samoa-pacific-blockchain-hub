import React, { useState } from 'react'
import { C, MONO } from '../../constants'

interface Props {
  reference: string
}

export function ISO20022Ref({ reference }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(reference).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <code
        title="ISO 20022 payment reference — format: OMW/YYYY/PORTCODE/IMONUMBER/SEQUENCE"
        style={{
          background:   C.surface2,
          border:       `1px solid ${C.border}`,
          borderRadius: 4,
          color:        C.gold,
          fontFamily:   MONO,
          fontSize:     12,
          letterSpacing: '0.5px',
          padding:      '4px 10px',
        }}
      >
        {reference}
      </code>
      <button
        onClick={copy}
        aria-label="Copy ISO 20022 reference to clipboard"
        title="Copy to clipboard"
        style={{
          background:   copied ? `${C.green}20` : C.surface2,
          border:       `1px solid ${copied ? C.greenBdr : C.border}`,
          borderRadius: 4,
          color:        copied ? C.green : C.muted,
          cursor:       'pointer',
          fontFamily:   MONO,
          fontSize:     10,
          padding:      '4px 10px',
          minHeight:    30,
          transition:   'all 0.15s',
        }}
      >
        {copied ? '✓ Copied' : '⎘ Copy'}
      </button>
    </div>
  )
}
