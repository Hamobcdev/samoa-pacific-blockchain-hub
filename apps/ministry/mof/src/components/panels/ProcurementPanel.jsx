import React from 'react'
import { StubPanel } from './StubPanel.jsx'

export function ProcurementPanel({ lang }) {
  return (
    <StubPanel
      title="Procurement — OCDS 1.1.5"
      standard="Open Contracting Data Standard 1.1.5 · World Bank STEP · UNCITRAL"
      sprint="MOF-2"
      onChain="OCDS release hashing — MOF MinistryNode"
      kpis={[
        { label: 'Active Contracts',   value: '23',        sub: 'OCDS tracked' },
        { label: 'OCDS Value',         value: 'WST 156M',  sub: 'Total tracked value' },
        { label: 'STEP Packages',      value: '8',         sub: 'World Bank STEP' },
      ]}
    />
  )
}
