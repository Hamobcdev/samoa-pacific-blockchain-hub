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
import GovernorCommandDashboard from './components/governor/GovernorCommandDashboard.jsx'
function injectGlobalStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('cbs-admin-globals')) return
  const style = document.createElement('style')
  style.id = 'cbs-admin-globals'
  style.textContent = GLOBAL_STYLES
  document.head.appendChild(style)
}

injectGlobalStyles()

const TIER2_BANKS = [
  { code: 'ANZ-WS', name: 'ANZ Bank Samoa',              limit: 500000, settlement: 'ANZ Group Pacific',       compliance: 'Compliant' },
  { code: 'BSP-WS', name: 'BSP Samoa',                   limit: 300000, settlement: 'BSP Financial Group PNG', compliance: 'Compliant' },
  { code: 'SCB-WS', name: 'Samoa Commercial Bank',       limit: 200000, settlement: 'National Bank of Samoa',  compliance: 'Compliant' },
  { code: 'NBS-WS', name: 'National Bank of Samoa',      limit: 200000, settlement: 'Central Bank of Samoa',   compliance: 'Compliant' },
  { code: 'DBS-WS', name: 'Development Bank of Samoa',   limit: 150000, settlement: 'Ministry of Finance',     compliance: 'Compliant' },
]

const TIER3_PARTICIPANTS = [
  { code: 'SNPF',   name: 'Samoa National Provident Fund',            partner: 'BSP-WS' },
  { code: 'UTOS',   name: 'Unit Trust of Samoa',                      partner: 'ANZ-WS' },
  { code: 'WSTLAC', name: 'Western Samoa Life Assurance Corporation', partner: 'NBS-WS' },
]

const TABLE_HEADERS = ['CODE', 'INSTITUTION', 'STATUS', 'DAILY LIMIT (WST)', 'SETTLEMENT BANK', 'COMPLIANCE']

function DBSDistributionPanel() {
  return (
    <div data-panel data-panel-version="1.1" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Zone 3 classification band */}
      <div style={{
        background:     '#633806',
        borderRadius:   4,
        padding:        '6px 14px',
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
      }}>
        <span style={{ color: '#FAC775', fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: 2, fontWeight: 500 }}>
          ZONE 3 · CONFIDENTIAL
        </span>
        <span style={{ color: '#FAC775', fontFamily: TYPOGRAPHY.mono, fontSize: 10, letterSpacing: 2, opacity: 0.7 }}>
          CBS OVERSIGHT FUNCTION
        </span>
      </div>

      {/* Header */}
      <div>
        <h2 style={{
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      14,
          fontWeight:    700,
          color:         COLORS.text,
          letterSpacing: '-0.2px',
          marginBottom:  8,
        }}>
          WST-DPI Distribution Network — CBS Supervisory View
        </h2>

        {/* Supervisory note */}
        <div style={{
          background:  COLORS.infoBg,
          border:      `1px solid ${COLORS.infoBorder}`,
          borderLeft:  `3px solid ${COLORS.info}`,
          borderRadius: 4,
          padding:     '10px 14px',
        }}>
          <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.info, lineHeight: 1.65 }}>
            This view is a CBS supervisory function. DBS does not self-report compliance —
            CBS independently monitors all WST-DPI distribution activity.
          </span>
        </div>
      </div>

      {/* Tier 2 — Licensed Retail Distributors */}
      <section>
        <h3 style={{
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      10,
          fontWeight:    600,
          color:         COLORS.textMuted,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom:  12,
        }}>
          Tier 2 — Licensed Retail Distributors
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {TABLE_HEADERS.map(h => (
                <th key={h} style={{
                  fontFamily:    TYPOGRAPHY.mono,
                  fontSize:      9,
                  color:         COLORS.textMuted,
                  padding:       '8px 12px',
                  borderBottom:  `1px solid ${COLORS.border}`,
                  textAlign:     h === 'DAILY LIMIT (WST)' ? 'right' : 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  background:    COLORS.surface,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIER2_BANKS.map((bank, i) => (
              <tr key={bank.code} style={{ background: i % 2 === 0 ? 'transparent' : COLORS.surface }}>
                <td style={{ padding: '10px 12px', fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.gold, fontWeight: 600, borderBottom: `1px solid ${COLORS.border}` }}>
                  {bank.code}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text, fontSize: 13 }}>
                  {bank.name}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{
                    fontFamily:    TYPOGRAPHY.mono,
                    fontSize:      9,
                    fontWeight:    600,
                    padding:       '2px 8px',
                    borderRadius:  3,
                    background:    COLORS.operationalBg,
                    color:         COLORS.operational,
                    border:        `1px solid ${COLORS.operationalBorder}`,
                  }}>
                    ✓ ACTIVE
                  </span>
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, textAlign: 'right', fontFamily: TYPOGRAPHY.mono, fontSize: 12, color: COLORS.gold, fontWeight: 500 }}>
                  {bank.limit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}`, fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textMuted }}>
                  {bank.settlement}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{
                    fontFamily:   TYPOGRAPHY.mono,
                    fontSize:     9,
                    fontWeight:   600,
                    padding:      '2px 8px',
                    borderRadius: 3,
                    background:   COLORS.operationalBg,
                    color:        COLORS.operational,
                    border:       `1px solid ${COLORS.operationalBorder}`,
                  }}>
                    ✓ {bank.compliance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Tier 3 — Institutional Participants */}
      <section>
        <h3 style={{
          fontFamily:    TYPOGRAPHY.mono,
          fontSize:      10,
          fontWeight:    600,
          color:         COLORS.textMuted,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom:  12,
        }}>
          Tier 3 — Institutional Participants
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TIER3_PARTICIPANTS.map(p => (
            <div key={p.code} style={{
              background:    COLORS.surface,
              border:        `1px solid ${COLORS.border}`,
              borderLeft:    `3px solid ${COLORS.borderGold}`,
              borderRadius:  4,
              padding:       '10px 16px',
              display:       'flex',
              alignItems:    'center',
              gap:           24,
            }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.gold, fontWeight: 600, minWidth: 70 }}>
                {p.code}
              </span>
              <span style={{ color: COLORS.text, fontSize: 13, flex: 1 }}>
                {p.name}
              </span>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 10, color: COLORS.textMuted }}>
                via {p.partner}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div style={{
        fontFamily:  TYPOGRAPHY.mono,
        fontSize:    9,
        color:       COLORS.textDim,
        paddingTop:  8,
        borderTop:   `1px solid ${COLORS.border}`,
      }}>
        Data: Simulated · Phase 1 Research Environment · CBS Oversight Function
      </div>
    </div>
  )
}

const PANEL_MAP = {
  command:    null,  // handled via GovernorCommandDashboard (see PanelContent)
  governance: CBSGovernancePanel,
  compliance: CompliancePanel,
  nodes:      NodeHealthMatrix,
  audit:      AuditRemediationPanel,
  // dbs: absorbed into command — CBS Distribution is now inside GovernorCommandDashboard
  research:   ResearchContextPanel,
}

function PanelContent({ activePanel, nodeHealth, governance, auditLog, lang, userCredential }) {
  if (activePanel === 'command') {
    return <GovernorCommandDashboard userRole={userCredential || 'CBS-ANALYST-2026'} />
  }
  const Component = PANEL_MAP[activePanel]
  if (Component) {
    const props = { lang }
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
  const [activePanel, setActivePanel] = useState('command')
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
                userCredential={roleId}
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
