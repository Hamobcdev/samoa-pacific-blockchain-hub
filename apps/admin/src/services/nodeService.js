import { GOVERNMENT_NODES, OPERATIONAL_NODES } from '@samoa-dpi/contracts-abi'

// Phase 1: simulation only. Set true when RPC proxy (localhost:3001) is available.
const USE_LIVE_DATA = import.meta.env.VITE_USE_LIVE_DATA === 'true'

const STATUSES = ['OPERATIONAL', 'OPERATIONAL', 'OPERATIONAL', 'DEGRADED', 'OFFLINE']

function simulateNodeHealth(node) {
  const seed = node.code.charCodeAt(0) + node.code.charCodeAt(node.code.length - 1)
  const idx  = (seed + Math.floor(Date.now() / 60_000)) % STATUSES.length
  return {
    code:        node.code,
    name:        node.name,
    branch:      node.branch,
    nodeType:    node.nodeType,
    color:       node.color,
    status:      STATUSES[idx],
    latencyMs:   40 + (seed % 180),
    blockHeight: 4_200_000 + (seed * 137),
    peers:       3 + (seed % 5),
    lastSeen:    Date.now(),
  }
}

export async function getAllNodeHealth() {
  if (USE_LIVE_DATA) {
    const res  = await fetch('/api/nodes/health')
    if (!res.ok) throw new Error(`Node health fetch failed: ${res.status}`)
    return res.json()
  }
  return GOVERNMENT_NODES.map(simulateNodeHealth)
}

export async function getNodeByCode(code) {
  const all = await getAllNodeHealth()
  return all.find(n => n.code === code) ?? null
}

export { OPERATIONAL_NODES }
