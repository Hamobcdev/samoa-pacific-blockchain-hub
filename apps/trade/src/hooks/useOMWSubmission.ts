import { useState, useCallback } from 'react'
import type { OMWSubmissionResult } from '../types'

let _seqCounter = 41

function nextSeq(pad: number): string {
  _seqCounter += 1
  return String(_seqCounter).padStart(pad, '0')
}

export function generateISO20022Ref(imoNumber: string, portCode = 'WSAPI'): string {
  const yr = new Date().getFullYear()
  return `OMW/${yr}/${portCode}/${imoNumber}/${nextSeq(6)}`
}

export function generateNOARef(): string {
  const yr = new Date().getFullYear()
  return `NOA-${yr}-${nextSeq(4)}`
}

export function generateCertRef(): string {
  const yr = new Date().getFullYear()
  return `PCX-${yr}-${nextSeq(6)}`
}

export function useOMWSubmission() {
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult]         = useState<OMWSubmissionResult | null>(null)

  const submit = useCallback(async (imoNumber: string, portCode?: string): Promise<OMWSubmissionResult> => {
    setSubmitting(true)
    try {
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
