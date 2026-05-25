import React, { useState } from 'react'
// @ts-ignore
import { LanguageProvider, useLang, CurrencyProvider } from '@samoa-dpi/shared-ui'
import { C, MONO, SANS } from './constants'
import { useRole } from './hooks/useRole'
import { RolePicker } from './components/role/RolePicker'
import { PortalHeader } from './components/layout/PortalHeader'
import { PortalFooter } from './components/layout/PortalFooter'
import { TabNav } from './components/layout/TabNav'
import { MaritimeDashboard } from './components/maritime/MaritimeDashboard'
import { AviationDashboard } from './components/aviation/AviationDashboard'
import type { ActiveTab } from './types'

const DEMO_TX = '0xdemo…b3a9'

function AppInner() {
  const { role, officerSubRole, setRole, setOfficerSubRole, clearRole } = useRole()
  const { lang }                                                         = useLang()
  const [tab, setTab]                                                    = useState<ActiveTab>('maritime')

  if (!role) {
    return (
      <RolePicker
        lang={lang}
        onSelectRole={setRole}
        onSelectSubRole={setOfficerSubRole}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.surface, display: 'flex', flexDirection: 'column' }}>

      {/* Demo mode banner */}
      <div
        role="banner"
        aria-label="Demo mode notice"
        style={{ background: `${C.amber}18`, borderBottom: `1px solid ${C.amberBdr}`, padding: '6px 20px', display: 'flex', gap: 12, alignItems: 'center' }}
      >
        <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: 12, color: C.amber, fontWeight: 700 }}>⚠ DEMO MODE</span>
        <span style={{ fontFamily: SANS, fontSize: 12, color: C.amber }}>
          No wallet connected — submissions simulate on-chain recording. Mock TX:&nbsp;<span style={{ fontFamily: MONO }}>{DEMO_TX}</span>
        </span>
      </div>

      <PortalHeader
        lang={lang}
        role={role}
        officerSubRole={officerSubRole}
        onSwitchRole={clearRole}
      />

      <TabNav
        active={tab}
        onChange={setTab}
        lang={lang}
      />

      <main role="main" style={{ flex: 1 }}>
        {tab === 'maritime'
          ? <MaritimeDashboard role={role} officerSubRole={officerSubRole} lang={lang} />
          : <AviationDashboard role={role} lang={lang} />
        }
      </main>

      <PortalFooter />
    </div>
  )
}

export function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AppInner />
      </CurrencyProvider>
    </LanguageProvider>
  )
}
