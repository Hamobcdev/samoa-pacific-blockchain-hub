import { useState, useCallback } from 'react'
import type { OMWSubmissionResult } from '../types'

let _seqCounter = 41

function nextSeq(): string {
  _seqCounter += 1
  return String(_seqCounter).padStart(6, '0')
}

export function generateISO20022Ref(imoNumber: string, portCode = 'WSAPI'): string {
  const yr = new Date().getFullYear()
  return `OMW/${yr}/${portCode}/${imoNumber}/${nextSeq()}`
}

export function generateNOARef(): string {
  const yr  = new Date().getFullYear()
  const seq = String(_seqCounter + 10).padStart(4, '0')
  return `NOA-${yr}-${seq}`
}

export function generateCertRef(): string {
  const yr  = new Date().getFullYear()
  const seq = String(_seqCounter + 10).padStart(6, '0')
  return `PCX-${yr}-${seq}`
}

export function useOMWSubmission() {
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult]         = useState<OMWSubmissionResult | null>(null)

  const submit = useCallback(async (imoNumber: string, portCode?: string): Promise<OMWSubmissionResult> => {
    setSubmitting(true)
    try {
      // Demo mode: no wallet — simulate on-chain submission
      await new Promise(r => setTimeout(r, 900))
      const ref = generateISO20022Ref(imoNumber, portCode)
      const res: OMWSubmissionResult = {
        success:  true,
        txHash:   `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        demoMode: true,
        ref,
      }
      setResult(res)
      return res
    } finally {
      setSubmitting(false)
    }
  }, [])

  return { submit, submitting, result }
}
