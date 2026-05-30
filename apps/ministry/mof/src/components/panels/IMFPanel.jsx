import React from 'react'
import { StubPanel } from './StubPanel.jsx'

export function IMFPanel({ lang }) {
  return (
    <StubPanel
      title="IMF & PFTAC Integration"
      standard="IMF GFS Manual · SDDS · Article IV · PFTAC TA programme"
      sprint="MOF-3"
      onChain="No direct on-chain"
      kpis={[
        { label: 'IMF Article IV',     value: 'Oct 2026',  sub: 'Next consultation' },
        { label: 'SDDS Status',        value: 'Subscriber', sub: 'Data dissemination' },
        { label: 'PFTAC TA Active',    value: '4 programmes', sub: 'FY 2025/26' },
      ]}
    />
  )
}
