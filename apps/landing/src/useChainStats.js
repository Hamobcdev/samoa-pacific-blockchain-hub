import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const RPC = import.meta.env.VITE_RPC_URL || 'https://rpc-amoy.polygon.technology'

export default function useChainStats() {
  const [blockNumber,  setBlockNumber]  = useState(null)
  const [isLive,       setIsLive]       = useState(false)
  const [lastUpdated,  setLastUpdated]  = useState(null)

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(RPC)
    let active = true

    const poll = async () => {
      try {
        const n = await provider.getBlockNumber()
        if (!active) return
        setBlockNumber(n)
        setIsLive(true)
        setLastUpdated(new Date())
      } catch {
        if (!active) return
        setIsLive(false)
      }
    }

    poll()
    const id = setInterval(poll, 10000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  return { blockNumber, isLive, lastUpdated }
}
