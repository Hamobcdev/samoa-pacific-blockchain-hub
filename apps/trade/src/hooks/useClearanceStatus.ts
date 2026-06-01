import { useState, useEffect, useRef } from 'react'
import { DEMO_CLEARANCE, DEMO_CLEARANCE_CLEARED } from '../constants'
import type { ClearanceRecord } from '../types'

const POLL_MS = 30_000

function getRecord(vesselRef: string): ClearanceRecord {
  if (vesselRef === 'NOA-2026-0039') {
    return { ...DEMO_CLEARANCE_CLEARED, vesselRef }
  }
  return { ...DEMO_CLEARANCE, vesselRef, formRef: vesselRef }
}

export function useClearanceStatus(vesselRef: string) {
  const [record, setRecord]       = useState<ClearanceRecord>(() => getRecord(vesselRef))
  const [lastUpdated, setUpdated] = useState<Date>(new Date())
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const poll = () => {
      setRecord(getRecord(vesselRef))
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
