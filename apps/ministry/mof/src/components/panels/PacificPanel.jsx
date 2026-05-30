import React from 'react'
import { StubPanel } from './StubPanel.jsx'

export function PacificPanel({ lang }) {
  return (
    <StubPanel
      title="Pacific & External Relations"
      standard="ADB Pacific · PIFS · SPC · Pacific fiscal peer comparisons"
      sprint="MOF-3"
      onChain="No direct on-chain"
      kpis={[
        { label: 'Pacific Peers',      value: '14',        sub: 'PIFS member states' },
        { label: 'ADB Programmes',     value: '3',         sub: 'Active Pacific programmes' },
        { label: 'SPC Engagements',    value: '6',         sub: 'FY 2025/26' },
      ]}
    />
  )
}
