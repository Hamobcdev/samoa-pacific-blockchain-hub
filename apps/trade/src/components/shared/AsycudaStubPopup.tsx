import React, { useState, useRef, useEffect } from 'react'
import { C, MONO, SANS } from '../../constants'

interface Props {
  label:        string
  triggerLabel: string
}

export function AsycudaStubPopup({ label, triggerLabel }: Props) {
  const [open, setOpen] = useState(false)
  const closeRef        = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
      const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
      window.addEventListener('keydown', h)
      return () => window.removeEventListener('keydown', h)
    }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`${label} — Phase 2 feature`}
        style={{
          background:  C.purpleBg,
          border:      `1px solid ${C.purple}40`,
          borderRadius: 6,
          color:       C.purple,
          cursor:      'pointer',
          fontFamily:  MONO,
          fontSize:    11,
          padding:     '8px 16px',
          minHeight:   40,
        }}
      >
        ⊕ {triggerLabel}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
        >
          <div style={{ background: C.surface, border: `1px solid ${C.purple}40`, borderLeft: `4px solid ${C.purple}`, borderRadius: 8, padding: 28, maxWidth: 480, width: '100%', fontFamily: SANS }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: C.purple, marginBottom: 4 }}>
                  Phase 2 Feature
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{label}</div>
              </div>
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{ background: 'none', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontFamily: MONO, fontSize: 11, minHeight: 32 }}
              >
                Close
              </button>
            </div>

            <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>
              ASYCUDA World integration is scheduled for Phase 2. Customs officers can currently cross-reference manually using the cargo manifest in the FAL Form 7 above.
            </div>

            <div style={{ background: C.purpleBg, border: `1px solid ${C.purpleBdr}`, borderRadius: 6, padding: '12px 16px' }}>
              <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: C.purple, marginBottom: 8 }}>
                Phase 2 Scope
              </div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
                Direct API integration with the ASYCUDA World customs management system. Import declarations will sync automatically, eliminating manual cross-referencing. Estimated delivery: Q3 2026, subject to CBS infrastructure decision.
              </div>
            </div>

            <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim, borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 16 }}>
              Contact: synergyblockchaintf@gmail.com · Phase 2 timeline subject to CBS approval
            </div>
          </div>
        </div>
      )}
    </>
  )
}
