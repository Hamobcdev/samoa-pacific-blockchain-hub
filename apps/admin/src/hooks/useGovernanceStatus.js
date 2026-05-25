import { useState, useCallback } from 'react'
import { CBS_GOVERNANCE_ITEMS } from '../data/cbs-governance.js'

export function useGovernanceStatus() {
  const [items, setItems] = useState(CBS_GOVERNANCE_ITEMS)

  const resolve = useCallback((id, notes = '') => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, resolved: true, resolvedAt: Date.now(), notes }
        : item
    ))
  }, [])

  const pending  = items.filter(i => !i.resolved)
  const resolved = items.filter(i => i.resolved)
  const critical = pending.filter(i => i.severity === 'CRITICAL')
  const high     = pending.filter(i => i.severity === 'HIGH')
  const blockedPhase2 = critical.length > 0

  return {
    items,
    pending,
    resolved,
    critical,
    high,
    blockedPhase2,
    pendingCount:  pending.length,
    resolvedCount: resolved.length,
    resolve,
  }
}
