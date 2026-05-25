import React from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[CBS Admin] Boundary caught:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div role="alert" style={{
        background: COLORS.criticalBg,
        border:     `1px solid ${COLORS.criticalBorder}`,
        borderRadius: 6,
        padding:    '24px',
        margin:     '16px',
        fontFamily: TYPOGRAPHY.mono,
      }}>
        <div style={{ color: COLORS.critical, fontSize: 12, letterSpacing: '1px', marginBottom: 8 }}>
          ✗ PANEL ERROR
        </div>
        <div style={{ color: COLORS.text, fontSize: 13, marginBottom: 16, opacity: 0.8 }}>
          {this.state.error?.message ?? 'An unexpected error occurred in this panel.'}
        </div>
        <button
          onClick={() => this.setState({ hasError: false, error: null })}
          style={{
            background:  COLORS.surface3,
            border:      `1px solid ${COLORS.border2}`,
            borderRadius: 4,
            color:        COLORS.text,
            cursor:       'pointer',
            fontFamily:   TYPOGRAPHY.mono,
            fontSize:     11,
            letterSpacing: '1px',
            padding:      '6px 16px',
          }}
        >
          RETRY
        </button>
      </div>
    )
  }
}
