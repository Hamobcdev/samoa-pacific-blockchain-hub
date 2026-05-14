import { useState, useCallback, useRef } from 'react'

const MAX_ENTRIES = 500

function wstTimestamp() {
  return new Intl.DateTimeFormat('en-WS', {
    timeZone: 'Pacific/Apia',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(new Date())
}

export function useAuditLog() {
  const [entries, setEntries] = useState([])
  const counterRef = useRef(0)

  const log = useCallback((action, detail = '', roleId = '') => {
    const entry = {
      id:        crypto.randomUUID(),
      seq:       ++counterRef.current,
      timestamp: wstTimestamp(),
      action,
      detail,
      roleId,
    }
    setEntries(prev => {
      const next = [entry, ...prev]
      return next.length > MAX_ENTRIES ? next.slice(0, MAX_ENTRIES) : next
    })
    return entry
  }, [])

  const clear = useCallback(() => {
    setEntries([])
    counterRef.current = 0
  }, [])

  return { entries, log, clear }
}
