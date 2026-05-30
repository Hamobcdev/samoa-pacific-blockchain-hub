import React from 'react'
import { StubPanel } from './StubPanel.jsx'

export function RevenuePanel({ lang }) {
  return (
    <StubPanel
      title="Revenue Management"
      standard="IMF GFSM 2014 · COFOG · SBS VAGST · MOR Customs"
      sprint="MOF-2"
      onChain="MOF MinistryNode revenue events"
      kpis={[
        { label: 'VAGST Revenue',      value: 'WST 142M', sub: 'Illustrative — Phase 2' },
        { label: 'Customs Revenue',    value: 'WST 89M',  sub: 'Illustrative — Phase 2' },
        { label: 'Non-Tax Revenue',    value: 'WST 42M',  sub: 'Illustrative — Phase 2' },
      ]}
    />
  )
}
