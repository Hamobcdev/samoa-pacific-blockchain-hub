import React from 'react'
import { StubPanel } from './StubPanel.jsx'

export function CompliancePanel({ lang }) {
  return (
    <StubPanel
      title="Fiscal Compliance"
      standard="PFM Act 2001 · IMF Article IV · PFTAC · Auditor-General reports"
      sprint="MOF-3"
      onChain="No direct on-chain — AG report hash anchoring Phase 2"
      kpis={[
        { label: 'Open AG Items',      value: '6',         sub: 'FY 2025/26' },
        { label: 'IMF Recommendations',value: '12',        sub: 'Article IV 2024' },
        { label: 'PFTAC Actions',      value: '4',         sub: 'TA programme 2025' },
      ]}
    />
  )
}
