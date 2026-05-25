import { useState, useEffect, useRef, useCallback } from 'react'
import { SESSION } from '../theme.js'

export function useSession({ onTimeout } = {}) {
  const [state, setState] = useState('active') // 'active' | 'warning' | 'expired'
  const warnTimer  = useRef(null)
  const expTimer   = useRef(null)
  const lastActivity = useRef(Date.now())

  const reset = useCallback(() => {
    lastActivity.current = Date.now()
    setState('active')
    clearTimeout(warnTimer.current)
    clearTimeout(expTimer.current)
    warnTimer.current = setTimeout(() => setState('warning'), SESSION.WARNING_MS)
    expTimer.current  = setTimeout(() => {
      setState('expired')
      onTimeout?.()
    }, SESSION.TIMEOUT_MS)
  }, [onTimeout])

  useEffect(() => {
    reset()
    const events = ['mousemove', 'keydown', 'pointerdown', 'scroll']
    const handler = () => {
      if (Date.now() - lastActivity.current > 30_000) reset()
      else lastActivity.current = Date.now()
    }
    events.forEach(e => window.addEventListener(e, handler, { passive: true }))
    return () => {
      events.forEach(e => window.removeEventListener(e, handler))
      clearTimeout(warnTimer.current)
      clearTimeout(expTimer.current)
    }
  }, [reset])

  return { sessionState: state, resetSession: reset }
}
