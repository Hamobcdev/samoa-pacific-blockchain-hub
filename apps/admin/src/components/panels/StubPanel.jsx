import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { ResearchLabel } from '../shared/ResearchLabel.jsx'

export function StubPanel({ titleKey, lang = 'EN', phase = 2 }) {
  const title = titleKey?.replace('nav.', '').toUpperCase() ?? 'PANEL'

  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      minHeight:      320,
      gap:            16,
      opacity:        0.65,
    }}>
      <div style={{
        background:    COLORS.blockedBg,
        border:        `1px solid ${COLORS.blockedBorder}`,
        borderRadius:  6,
        color:         COLORS.blocked,
        fontFamily:    TYPOGRAPHY.mono,
        fontSize:      9,
        letterSpacing: '2px',
        padding:       '4px 12px',
      }}>
        PHASE {phase} — PENDING CBS GOVERNANCE
      </div>

      <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 11, letterSpacing: '1px' }}>
        {lang === 'SM' ? 'O lenei vaega o lo\'o faatalitali' : `${title} panel awaiting Phase ${phase} activation`}
      </div>

      <div style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 9 }}>
        {lang === 'SM'
          ? 'Fa\'amatalaga: E mana\'omia CBS Pulega i luma o le fa\'aola'
          : 'Requires CBS governance decisions before activation. See Governance panel.'}
      </div>

      <ResearchLabel />
    </div>
  )
}
