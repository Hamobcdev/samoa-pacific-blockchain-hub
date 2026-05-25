import React, { useState, useEffect, useCallback } from 'react'
import { GLOBAL_STYLES, COLORS, TYPOGRAPHY } from './theme.js'
import { t } from './i18n.js'
import { CurrencyProvider, LanguageProvider, useLang, ClassificationBand } from '@samoa-dpi/shared-ui'
import { getSession, parseZoneFromToken, parseRoleFromToken } from './lib/gov-auth'
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
import { ResearchContextPanel } from './components/panels/ResearchContextPanel.jsx'
import { DBSDistributionPanel } from './components/governor/DBSDistributionPanel.tsx'

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
  dbs:        DBSDistributionPanel,
  research:   ResearchContextPanel,
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
  const [gatewaySession, setGatewaySession] = useState(null)

  const { roleId, role, setRole, can } = useRole()
  const auditLog    = useAuditLog()
  const nodeHealth  = useNodeHealth()
  const governance  = useGovernanceStatus()

  // Gateway token gate — runs once on mount
  useEffect(() => {
    const path = window.location.pathname

    // /governor → full CBS Admin view (zone 3); /analyst → read-only view (zone 2)
    const routeCtx =
      path === '/governor' ? { zone: 3, role: 'CBS Governor', roleId: 'CBS_GOVERNOR' }
      : path === '/analyst' ? { zone: 2, role: 'CBS Analyst',  roleId: 'CBS_ANALYST'  }
      : null

    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get('token')

    if (urlToken) {
      const zone     = routeCtx ? routeCtx.zone : parseZoneFromToken(urlToken)
      const roleName = routeCtx ? routeCtx.role : parseRoleFromToken(urlToken)
      sessionStorage.setItem('gov_session', JSON.stringify({
        sessionToken: urlToken,
        zone,
        role: roleName,
        storedAt: Date.now(),
        portalUrl: '',
      }))
      window.history.replaceState({}, '', path)
    }

    // DEV mode: skip redirect; auto-apply routeCtx if on a named route
    if (import.meta.env.DEV) {
      if (routeCtx) {
        setGatewaySession({ zone: routeCtx.zone, role: routeCtx.role })
        setRole(routeCtx.roleId)
        setHasRole(true)
      }
      return
    }

    const session = getSession()
    if (!session) {
      window.location.href = 'https://landing-alpha-seven-82.vercel.app/government'
      return
    }

    // Zone floor check: a zone-2 session must not access a zone-3 path via manual navigation
    if (routeCtx && session.zone < routeCtx.zone) {
      window.location.href = 'https://landing-alpha-seven-82.vercel.app/government'
      return
    }

    const effectiveZone   = routeCtx ? routeCtx.zone   : session.zone
    const effectiveRole   = routeCtx ? routeCtx.role   : session.role
    const effectiveRoleId = routeCtx ? routeCtx.roleId
      : session.zone >= 3 ? 'CBS_GOVERNOR' : 'CBS_ANALYST'

    setGatewaySession({ ...session, zone: effectiveZone, role: effectiveRole })
    setRole(effectiveRoleId)
    setHasRole(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      <CurrencyProvider lang={lang}>
        <RolePicker onSelect={handleRoleSelect} lang={lang} />
      </CurrencyProvider>
    )
  }

  return (
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
        {/* Classification band — shown when authenticated via gateway */}
        {gatewaySession && (
          <ClassificationBand zone={gatewaySession.zone} role={gatewaySession.role} />
        )}

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
            <button
              onClick={handleSignOut}
              aria-label="Sign out of current session"
              style={{
                background:    'transparent',
                border:        `1px solid ${COLORS.border2}`,
                borderRadius:  3,
                color:         COLORS.textDim,
                cursor:        'pointer',
                fontFamily:    TYPOGRAPHY.mono,
                fontSize:      10,
                letterSpacing: '1px',
                padding:       '3px 8px',
              }}
              onMouseEnter={e => e.currentTarget.style.color = COLORS.critical}
              onMouseLeave={e => e.currentTarget.style.color = COLORS.textDim}
            >
              Sign Out
            </button>
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
  )
}

export default function App() {
  return (
    <LanguageProvider defaultLang="EN">
      <AdminApp />
    </LanguageProvider>
  )
}
