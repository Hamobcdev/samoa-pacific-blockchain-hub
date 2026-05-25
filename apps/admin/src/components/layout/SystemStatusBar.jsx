import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'
import { t } from '../../i18n.js'

export function SystemStatusBar({ nodeHealth, lang = 'EN' }) {
  const { summary = {}, lastPoll } = nodeHealth ?? {}
  const { total = 0, operational = 0, degraded = 0, offline = 0 } = summary

  const overallOk = degraded === 0 && offline === 0

  return (
    <div
      role="status"
      aria-label="System status bar"
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             16,
        padding:         '4px 20px',
        background:      COLORS.surface,
        borderBottom:    `1px solid ${COLORS.border}`,
        fontFamily:      TYPOGRAPHY.mono,
        fontSize:        10,
        letterSpacing:   '0.8px',
        overflowX:       'auto',
        whiteSpace:      'nowrap',
      }}
    >
      <span style={{ color: overallOk ? COLORS.operational : COLORS.warning }}>
        {overallOk ? '✓' : '⚠'} {t(lang, 'status.health')}
      </span>

      <span style={{ color: COLORS.textDim }}>|</span>

      <span style={{ color: COLORS.textMuted }}>
        {t(lang, 'status.nodes')}: <span style={{ color: COLORS.operational }}>{operational}</span>
        {' / '}
        <span style={{ color: degraded > 0 ? COLORS.warning : COLORS.textMuted }}>{degraded}</span>
        {' / '}
        <span style={{ color: offline > 0 ? COLORS.critical : COLORS.textMuted }}>{offline}</span>
        {' '}({total} {t(lang, 'status.active')})
      </span>

      <span style={{ color: COLORS.textDim }}>|</span>

      <span style={{ color: COLORS.textDim }}>
        WST-DPI · Polygon Amoy
      </span>

      <span style={{ marginLeft: 'auto', color: COLORS.textDim }}>
        {lastPoll ? new Date(lastPoll).toISOString().slice(11, 19) + ' UTC' : '——'}
      </span>
    </div>
  )
}
