import React from 'react'
import { StubPanel } from './StubPanel.jsx'

export function TradeRevenuePanel({ lang }) {
  return (
    <StubPanel
      title="Trade & Customs Revenue"
      standard="UNCTAD 2029 · IMO FAL · CUSTOMS → MOF interoperability workflow"
      sprint="MOF-3"
      onChain="CUSTOMS MinistryNode → MOF · 0x5AcFdAD651b344CdDC805b45BF1Ecf3e262d56FA"
      kpis={[
        { label: 'Customs Revenue',    value: 'WST 89M',   sub: 'YTD — illustrative' },
        { label: 'Import Duties',      value: 'WST 54M',   sub: 'Phase 2 live data' },
        { label: 'Trade Throughput',   value: '14,200 TEU',sub: 'Apia port YTD' },
      ]}
    />
  )
}
