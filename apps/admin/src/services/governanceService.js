import { CBS_GOVERNANCE_ITEMS } from '../data/cbs-governance.js'

export function getGovernanceItems() {
  return CBS_GOVERNANCE_ITEMS
}

export function getPendingItems() {
  return CBS_GOVERNANCE_ITEMS.filter(i => !i.resolved)
}

export function getCriticalItems() {
  return CBS_GOVERNANCE_ITEMS.filter(i => !i.resolved && i.severity === 'CRITICAL')
}

export function isPhase2Blocked() {
  return getCriticalItems().length > 0
}
