import React from 'react'
import { StubPanel } from './StubPanel.jsx'

export function PublicDebtPanel({ lang }) {
  return (
    <StubPanel
      title="Public Debt Management"
      standard="IMF DSA Framework · PFM Act S.47 · ADB / World Bank creditors"
      sprint="MOF-2"
      onChain="Debt event hashing — MOF MinistryNode"
      kpis={[
        { label: 'Total Public Debt',  value: 'WST 1.26B', sub: '47.8% of GDP — illustrative' },
        { label: 'External Debt',      value: 'WST 980M',  sub: 'ADB / World Bank / bilateral' },
        { label: 'Domestic Debt',      value: 'WST 280M',  sub: 'Government securities' },
      ]}
    />
  )
}
