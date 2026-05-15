import React, { useState, useRef, useEffect, useCallback } from 'react'

const SHOW_DELAY = 300

export function Tooltip({ children, content, labelSM }) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState('above')
  const timerRef = useRef(null)
  const wrapRef = useRef(null)

  const show = useCallback(() => {
    if (wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect()
      setPosition(rect.top < 60 ? 'below' : 'above')
    }
    setVisible(true)
  }, [])

  const hide = useCallback(() => {
    setVisible(false)
  }, [])

  const scheduleShow = useCallback(() => {
    timerRef.current = setTimeout(show, SHOW_DELAY)
  }, [show])

  const cancelShow = useCallback(() => {
    clearTimeout(timerRef.current)
  }, [])

  // Touch: show immediately, auto-hide after 3s
  const handleTouchStart = useCallback((e) => {
    e.preventDefault()
    show()
    timerRef.current = setTimeout(hide, 3000)
  }, [show, hide])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const tooltipStyle = {
    position:     'absolute',
    zIndex:       9999,
    background:   '#111830',
    border:       '1px solid #253258',
    borderRadius: '4px',
    padding:      '6px 10px',
    fontFamily:   "'IBM Plex Sans', sans-serif",
    fontSize:     '12px',
    color:        '#e8edf8',
    maxWidth:     '280px',
    whiteSpace:   'pre-wrap',
    boxShadow:    '0 4px 16px rgba(0,0,0,0.4)',
    pointerEvents: 'none',
    left:         '50%',
    transform:    'translateX(-50%)',
  }

  if (position === 'above') {
    tooltipStyle.bottom = 'calc(100% + 6px)'
  } else {
    tooltipStyle.top = 'calc(100% + 6px)'
  }

  return (
    <span
      ref={wrapRef}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={scheduleShow}
      onMouseLeave={() => { cancelShow(); hide() }}
      onFocus={show}
      onBlur={hide}
      onTouchStart={handleTouchStart}
    >
      {children}
      {visible && (
        <span role="tooltip" style={tooltipStyle}>
          {content}
          {labelSM && (
            <span style={{ display: 'block', marginTop: 4, color: '#8899bb', fontSize: '11px' }}>
              {labelSM}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
