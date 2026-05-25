import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { C, MONO, SANS } from '../../constants'

interface Props {
  data:      string
  label:     string
  size?:     number
}

export function QRCodeDisplay({ data, label, size = 180 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    QRCode.toDataURL(data, {
      width:  size,
      margin: 2,
      color:  { dark: '#000000', light: '#ffffff' },
    }).then(url => setDataUrl(url))
      .catch(() => { /* fail silently — demo mode */ })
  }, [data, size])

  const download = () => {
    if (!dataUrl) return
    const a    = document.createElement('a')
    a.href     = dataUrl
    a.download = `${label.replace(/\s+/g, '_')}_QR.png`
    a.click()
  }

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        aria-label={`QR code loading: ${label}`}
      >
        <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>Loading…</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
      <img
        src={dataUrl}
        alt={`QR code for ${label}`}
        aria-label={`QR code: ${label}. Scan to verify.`}
        style={{ width: size, height: size, borderRadius: 4, border: '2px solid #fff' }}
      />
      <button
        onClick={download}
        aria-label={`Download QR code for ${label}`}
        style={{
          background:   C.surface2,
          border:       `1px solid ${C.border}`,
          borderRadius: 4,
          color:        C.muted,
          cursor:       'pointer',
          fontFamily:   SANS,
          fontSize:     12,
          padding:      '6px 12px',
          minHeight:    32,
        }}
      >
        ⬇ Download QR
      </button>
    </div>
  )
}
