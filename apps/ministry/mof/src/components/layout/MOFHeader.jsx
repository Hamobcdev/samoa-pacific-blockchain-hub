import React, { useState, useEffect } from 'react'
import { COLORS, TYPOGRAPHY, ROLES } from '../../theme.js'

function pad(n) { return String(n).padStart(2, '0') }

function getWSTTime() {
  const now = new Date()
  const wst = new Date(now.toLocaleString('en-US', { timeZone: 'Pacific/Apia' }))
  return `${pad(wst.getHours())}:${pad(wst.getMinutes())}:${pad(wst.getSeconds())} WST`
}

export function MOFHeader({ roleId, lang }) {
  const [clock, setClock] = useState(getWSTTime())
  const role = ROLES[roleId] || ROLES['MOF_ANALYST']

  useEffect(() => {
    const id = setInterval(() => setClock(getWSTTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header style={{
      background:    '#ffffff',
      borderBottom:  `1px solid ${COLORS.border}`,
      padding:       '0 24px',
      height:        56,
      display:       'flex',
      alignItems:    'center',
      gap:           20,
      flexShrink:    0,
      position:      'sticky',
      top:           0,
      zIndex:        40,
      boxShadow:     '0 1px 4px rgba(26,58,107,0.06)',
    }}>
      {/* Left — brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          <div style={{ width: 16, height: 3, background: COLORS.flagRed,  borderRadius: 1 }} />
          <div style={{ width: 16, height: 3, background: COLORS.flagBlue, borderRadius: 1 }} />
        </div>
        <div style={{
          background:    COLORS.govBlueBg,
          border:        `1px solid ${COLORS.govBlueBorder}`,
          borderRadius:  4,
          color:         COLORS.govBlue,
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: '2px',
          padding:       '2px 8px',
        }}>
          MOF
        </div>
        <div>
          <div style={{
            fontFamily:    TYPOGRAPHY.mono,
            fontSize:      11,
            fontWeight:    700,
            color:         COLORS.govBlue,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
          }}>
            MOF FISCAL COMMAND CENTRE
          </div>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted }}>
            Ministry of Finance · Fiscal Authority
          </div>
        </div>
      </div>

      {/* Centre — clock */}
      <div style={{
        marginLeft:    'auto',
        marginRight:   'auto',
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      14,
        fontWeight:    700,
        color:         COLORS.govBlue,
        letterSpacing: '1px',
      }}>
        {clock}
      </div>

      {/* Right — badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        {role.hsm && (
          <span style={{
            background:    COLORS.infoBg,
            border:        `1px solid ${COLORS.infoBorder}`,
            borderRadius:  4,
            color:         COLORS.info,
            fontFamily:    TYPOGRAPHY.mono,
            fontSize:      11,
            letterSpacing: '1px',
            padding:       '2px 8px',
          }}>
            HSM
          </span>
        )}
        <span style={{
          background:    COLORS.govBlueBg,
          border:        `1px solid ${COLORS.govBlueBorder}`,
          borderRadius:  4,
          color:         COLORS.govBlue,
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      11,
          letterSpacing: '1px',
          padding:       '2px 8px',
        }}>
          L{role.level} · {role.id}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width:        7,
            height:       7,
            borderRadius: '50%',
            background:   COLORS.operational,
            animation:    'pulse 2s infinite',
          }} />
          <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.fiscal, fontWeight: 600 }}>DPI LIVE</span>
        </div>
        <span style={{
          background:    COLORS.goldBg,
          border:        `1px solid ${COLORS.goldBorder}`,
          borderRadius:  4,
          color:         COLORS.gold,
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      11,
          letterSpacing: '1px',
          padding:       '2px 8px',
        }}>
          FY 2025/26
        </span>
        <span style={{
          background:    COLORS.warningBg,
          border:        `1px solid ${COLORS.warningBorder}`,
          borderRadius:  4,
          color:         COLORS.warning,
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      11,
          letterSpacing: '0.5px',
          padding:       '2px 8px',
          fontWeight:    600,
        }}>
          6 COMPLIANCE ITEMS
        </span>
      </div>
    </header>
  )
}
