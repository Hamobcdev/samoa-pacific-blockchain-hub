import { useState, useEffect, useRef } from 'react'
import { DEMO_CLEARANCE } from '../constants'
import type { ClearanceRecord } from '../types'

const POLL_MS = 30_000

export function useClearanceStatus(vesselRef: string) {
  const [record, setRecord]       = useState<ClearanceRecord>(DEMO_CLEARANCE)
  const [lastUpdated, setUpdated] = useState<Date>(new Date())
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // In demo mode, just use the static record.
    // A real implementation would poll the chain or an API here.
    void vesselRef // suppress lint

    const poll = () => {
      setRecord({ ...DEMO_CLEARANCE })
      setUpdated(new Date())
      timerRef.current = setTimeout(poll, POLL_MS)
    }

    timerRef.current = setTimeout(poll, POLL_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [vesselRef])

  const lastUpdatedStr = lastUpdated.toLocaleTimeString('en-WS', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  }) + ' WST'

  return { record, lastUpdated: lastUpdatedStr }
}
