import React, { useState, useEffect, useCallback } from 'react'
import { GLOBAL_STYLES, COLORS, TYPOGRAPHY } from './theme.js'
import { t } from './i18n.js'
import { ResearchGate, CurrencyProvider, LanguageProvider, useLang } from '@samoa-dpi/shared-ui'
import { useRole }            from './hooks/useRole.js'
import { useSession }         from './hooks/useSession.js'
import { useAuditLog }        from './hooks/useAuditLog.js'
import { useNodeHealth }      from './hooks/useNodeHealth.js'
import { useGovernanceStatus } from './hooks/useGovernanceStatus.js'
// CurrencyProvider migrated to @samoa-dpi/shared-ui — imported above
import { ErrorBoundary }      from './components/shared/ErrorBoundary.jsx'
import { SessionWarning }     from './components/layout/SessionWarning.jsx'
import { RolePicker }         from './components/layout/RolePicker.jsx'
import { SystemStatusBar }    from './components/layout/SystemStatusBar.jsx'
import { AdminSidebar }       from './components/layout/AdminSidebar.jsx'
import { OverviewPanel }      from './components/panels/OverviewPanel.jsx'
import { CBSGovernancePanel } from './components/panels/CBSGovernancePanel.jsx'
import { CompliancePanel }    from './components/panels/CompliancePanel.jsx'
import { NodeHealthMatrix }   from './components/panels/NodeHealthMatrix.jsx'
import { AuditRemediationPanel } from './components/panels/AuditRemediationPanel.jsx'
import { StubPanel }          from './components/panels/StubPanel.jsx'

function injectGlobalStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('cbs-admin-globals')) return
  const style = document.createElement('style')
  style.id = 'cbs-admin-globals'
  style.textContent = GLOBAL_STYLES
  document.head.appendChild(style)
}

injectGlobalStyles()

const PANEL_MAP = {
  overview:   OverviewPanel,
  governance: CBSGovernancePanel,
  compliance: CompliancePanel,
  nodes:      NodeHealthMatrix,
  audit:      AuditRemediationPanel,
}

function PanelContent({ activePanel, nodeHealth, governance, auditLog, lang }) {
  const Component = PANEL_MAP[activePanel]
  if (Component) {
    const props = { lang }
    if (activePanel === 'overview')    { props.nodeHealth = nodeHealth; props.governance = governance }
    if (activePanel === 'governance')  { props.governance = governance }
    if (activePanel === 'nodes')       { props.nodeHealth = nodeHealth }
    if (activePanel === 'audit')       { props.auditLog   = auditLog }
    return <Component {...props} />
  }
  return <StubPanel titleKey={`nav.${activePanel}`} lang={lang} phase={2} />
}

function AdminApp() {
  const { lang, toggle: toggleLang } = useLang()
  const [hasRole, setHasRole]         = useState(false)
  const [activePanel, setActivePanel] = useState('overview')

  const { roleId, role, setRole, can } = useRole()
  const auditLog    = useAuditLog()
  const nodeHealth  = useNodeHealth()
  const governance  = useGovernanceStatus()

  const handleTimeout = useCallback(() => {
    auditLog.log('SESSION_TIMEOUT', 'Inactivity timeout', roleId)
    setHasRole(false)
  }, [roleId, auditLog])

  const { sessionState, resetSession } = useSession({ onTimeout: handleTimeout })

  const handleRoleSelect = useCallback((id) => {
    setRole(id)
    auditLog.log('ROLE_SELECTED', id, id)
    setHasRole(true)
  }, [setRole, auditLog])

  const handleNav = useCallback((panel) => {
    setActivePanel(panel)
    auditLog.log('NAV', panel, roleId)
  }, [roleId, auditLog])

  const handleSignOut = useCallback(() => {
    auditLog.log('SIGN_OUT', '', roleId)
    setHasRole(false)
  }, [roleId, auditLog])

  if (!hasRole) {
    return (
      <ResearchGate storageKey="sdpi_admin_acknowledged">
        <CurrencyProvider lang={lang}>
          <RolePicker onSelect={handleRoleSelect} lang={lang} />
        </CurrencyProvider>
      </ResearchGate>
    )
  }

  return (
    <ResearchGate storageKey="sdpi_admin_acknowledged">
    <CurrencyProvider lang={lang}>
      <a href="#main-content" className="skip-link">
        {lang === 'SM' ? 'Alu i le Amataga' : 'Skip to main content'}
      </a>

      <SessionWarning
        sessionState={sessionState}
        onContinue={resetSession}
        lang={lang}
      />

      <div style={{
        display:       'flex',
        flexDirection: 'column',
        height:        '100dvh',
        overflow:      'hidden',
        background:    COLORS.bg,
        color:         COLORS.text,
        fontFamily:    TYPOGRAPHY.sans,
      }}>
        {/* Top bar */}
        <header data-print-hide style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          padding:         '8px 20px',
          background:      COLORS.surface,
          borderBottom:    `1px solid ${COLORS.border}`,
          gap:             12,
          flexShrink:      0,
        }}>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: '2px', color: COLORS.gold }}>
            CBS ADMIN · DPI SAMOA
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={toggleLang}
              aria-label={`Switch language — currently ${lang}`}
              style={{
                background:    COLORS.surface2,
                border:        `1px solid ${COLORS.border2}`,
                borderRadius:  3,
                color:         COLORS.textMuted,
                cursor:        'pointer',
                fontFamily:    TYPOGRAPHY.mono,
                fontSize:      10,
                letterSpacing: '1px',
                padding:       '3px 8px',
              }}
            >
              {lang === 'EN' ? 'SM' : 'EN'}
            </button>
            <span style={{ color: COLORS.textDim, fontFamily: TYPOGRAPHY.mono, fontSize: 10 }}>
              {role?.id}
            </span>
          </div>
        </header>

        <SystemStatusBar nodeHealth={nodeHealth} lang={lang} />

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <AdminSidebar
            activePanel={activePanel}
            onNav={handleNav}
            role={role}
            lang={lang}
            onSignOut={handleSignOut}
            governancePending={governance.pendingCount}
          />

          <main
            id="main-content"
            tabIndex={-1}
            style={{
              flex:       1,
              overflowY:  'auto',
              padding:    '24px 28px',
              background: COLORS.bg,
            }}
          >
            <ErrorBoundary key={activePanel}>
              <PanelContent
                activePanel={activePanel}
                nodeHealth={nodeHealth}
                governance={governance}
                auditLog={auditLog}
                lang={lang}
              />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </CurrencyProvider>
    </ResearchGate>
  )
}

export default function App() {
  return (
    <LanguageProvider defaultLang="EN">
      <AdminApp />
    </LanguageProvider>
  )
}
