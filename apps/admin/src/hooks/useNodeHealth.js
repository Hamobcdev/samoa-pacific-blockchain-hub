import { useState, useEffect, useCallback } from 'react'
import { OPERATIONAL_NODES } from '@samoa-dpi/contracts-abi'
import { getAllNodeHealth } from '../services/nodeService.js'

const POLL_MS = 12_000

export function useNodeHealth() {
  const [nodes, setNodes]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [lastPoll, setLastPoll] = useState(null)

  const poll = useCallback(async () => {
    try {
      const health = await getAllNodeHealth()
      setNodes(health)
      setLastPoll(Date.now())
    } finally {
      setLoading(false)
    }
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
