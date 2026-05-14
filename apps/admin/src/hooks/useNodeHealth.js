import { useState, useEffect, useCallback } from 'react'
import { GOVERNMENT_NODES, OPERATIONAL_NODES } from '@samoa-dpi/contracts-abi'

const POLL_MS = 12_000

const STATUSES = ['OPERATIONAL', 'OPERATIONAL', 'OPERATIONAL', 'DEGRADED', 'OFFLINE']

function simulateHealth(node) {
  const seed = node.code.charCodeAt(0) + node.code.charCodeAt(node.code.length - 1)
  const idx  = (seed + Math.floor(Date.now() / 60_000)) % STATUSES.length
  return {
    code:      node.code,
    name:      node.name,
    branch:    node.branch,
    nodeType:  node.nodeType,
    color:     node.color,
    status:    STATUSES[idx],
    latencyMs: 40 + (seed % 180),
    blockHeight: 4_200_000 + (seed * 137),
    peers:     3 + (seed % 5),
    lastSeen:  Date.now(),
  }
}

export function useNodeHealth() {
  const [nodes, setNodes]     = useState([])
  const [loading, setLoading] = useState(true)
  const [lastPoll, setLastPoll] = useState(null)

  const poll = useCallback(() => {
    const health = GOVERNMENT_NODES.map(simulateHealth)
    setNodes(health)
    setLoading(false)
    setLastPoll(Date.now())
  }, [])

  useEffect(() => {
    poll()
    const id = setInterval(poll, POLL_MS)
    return () => clearInterval(id)
  }, [poll])

  const operational = nodes.filter(n => n.status === 'OPERATIONAL').length
  const degraded    = nodes.filter(n => n.status === 'DEGRADED').length
  const offline     = nodes.filter(n => n.status === 'OFFLINE').length

  return {
    nodes,
    loading,
    lastPoll,
    summary: { total: nodes.length, operational, degraded, offline },
    operationalNodes: OPERATIONAL_NODES,
  }
}
