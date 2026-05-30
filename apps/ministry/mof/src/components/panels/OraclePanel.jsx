import React from 'react'
import { StubPanel } from './StubPanel.jsx'

export function OraclePanel({ lang }) {
  return (
    <StubPanel
      title="Sovereign Oracle (#FA)"
      standard="Merkle anchoring · GFSM 2014 · Fiscal anchor events"
      sprint="MOF-3"
      onChain="InteroperabilityHub Merkle feed · 0xB4D3D4Ac59f0976Ee6b5A7d118df955c8E075bfd"
      kpis={[
        { label: '#FA Events YTD',     value: '1,247',     sub: 'Fiscal anchor events' },
        { label: 'Last Merkle Root',   value: '0x3fa8…',   sub: 'Anchored at FY close' },
        { label: 'Oracle Uptime',      value: '99.97%',    sub: 'Phase 1 stub' },
      ]}
    />
  )
}
