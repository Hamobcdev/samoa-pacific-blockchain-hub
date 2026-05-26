import React, { useState } from 'react'
import { C, MONO, SANS } from '../constants'
import type { AuditEntry } from '../types'

interface Props {
  entries: AuditEntry[]
}

export function AuditLog({ entries }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 32 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background:  'none',
          border:      'none',
          color:       C.muted,
          cursor:      'pointer',
          display:     'flex',
          alignItems:  'center',
          gap:         8,
          fontFamily:  MONO,
          fontSize:    10,
          letterSpacing: '1.5px',
          padding:     '12px 0',
          width:       '100%',
          textAlign:   'left',
        }}
      >
        <span style={{ color: C.gold }}>▸</span>
        SUBMISSION AUDIT LOG
        <span style={{ background: C.surface3, borderRadius: 3, color: C.muted, fontSize: 9, padding: '1px 6px' }}>
          {entries.length}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 9 }}>{open ? '▲ collapse' : '▼ expand'}</span>
      </button>

      {open && (
        <div>
          {entries.length === 0 ? (
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim, paddingBottom: 16 }}>
              No submissions in this session.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr>
                    {['TIMESTAMP (WST)', 'FORM', 'REFERENCE', 'TRANSMITTED TO', 'STATUS'].map(h => (
                      <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '6px 10px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', letterSpacing: '1px', background: C.surface2 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                      <td style={{ fontFamily: MONO, fontSize: 10, color: C.muted, padding: '6px 10px', borderBottom: `1px solid ${C.border}` }}>
                        {e.timestamp}
                      </td>
                      <td style={{ fontFamily: SANS, fontSize: 11, color: C.text, padding: '6px 10px', borderBottom: `1px solid ${C.border}` }}>
                        {e.form}
                      </td>
                      <td style={{ fontFamily: MONO, fontSize: 10, color: C.gold, padding: '6px 10px', borderBottom: `1px solid ${C.border}` }}>
                        {e.reference}
                      </td>
                      <td style={{ fontFamily: SANS, fontSize: 11, color: C.muted, padding: '6px 10px', borderBottom: `1px solid ${C.border}` }}>
                        {e.transmittedTo}
                      </td>
                      <td style={{ padding: '6px 10px', borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 3, color: C.green, fontFamily: MONO, fontSize: 9, padding: '1px 6px' }}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, paddingTop: 8, paddingBottom: 12, lineHeight: 1.8 }}>
            Blockchain audit trail principle — every submission is permanently timestamped.<br />
            Phase 1: In-memory only. Phase 2: Anchored to Samoa DPI chain.
          </div>
        </div>
      )}
    </div>
  )
}
