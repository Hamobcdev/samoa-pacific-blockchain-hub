import React, { useState, useEffect, useCallback } from 'react'
import { ClassificationBand } from '@samoa-dpi/shared-ui'
import { getSession, clearSession, parseZoneFromToken, parseRoleFromToken } from './lib/gov-auth'
import { COLORS, TYPOGRAPHY, ROLES, CATEGORIES, ALL_TABS, GLOBAL_STYLES } from './theme.js'
import { t } from './i18n.js'
// Layout
import { MOFRolePicker }  from './components/layout/MOFRolePicker.jsx'
import { MOFHeader }      from './components/layout/MOFHeader.jsx'
import { MOFSidebar }     from './components/layout/MOFSidebar.jsx'
import { CategoryNav }    from './components/layout/CategoryNav.jsx'
import { SessionWarning } from './components/layout/SessionWarning.jsx'
// Panels
import { CommandPanel }      from './components/panels/CommandPanel.jsx'
import { BudgetPanel }       from './components/panels/BudgetPanel.jsx'
import { RevenuePanel }      from './components/panels/RevenuePanel.jsx'
import { PublicDebtPanel }   from './components/panels/PublicDebtPanel.jsx'
import { TradeRevenuePanel } from './components/panels/TradeRevenuePanel.jsx'
import { PEFAPanel }         from './components/panels/PEFAPanel.jsx'
import { CompliancePanel }   from './components/panels/CompliancePanel.jsx'
import { IMFPanel }          from './components/panels/IMFPanel.jsx'
import { AidDonorsPanel }    from './components/panels/AidDonorsPanel.jsx'
import { ProcurementPanel }  from './components/panels/ProcurementPanel.jsx'
import { OraclePanel }       from './components/panels/OraclePanel.jsx'
import { PacificPanel }      from './components/panels/PacificPanel.jsx'

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────

function injectGlobalStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('mof-globals')) return
  const el = document.createElement('style')
  el.id = 'mof-globals'
  el.textContent = GLOBAL_STYLES
  document.head.appendChild(el)
}
injectGlobalStyles()

// ─── ROLE NORMALISER ──────────────────────────────────────────────────────────

const ROLE_NORM: Record<string, string> = {
  MOF_ADMIN: 'MOF_CEO',
}

function resolveRole(id: string) {
  const normalised = ROLE_NORM[id] ?? id
  return (ROLES as Record<string, typeof ROLES[keyof typeof ROLES]>)[normalised] ?? ROLES['MOF_ANALYST']
}

// ─── SESSION TIMER ────────────────────────────────────────────────────────────

const SESSION_WARN_MS    = 5 * 60 * 1000
const SESSION_TIMEOUT_MS = 15 * 60 * 1000

// ─── PANEL MAP ────────────────────────────────────────────────────────────────

function PanelContent({ tab, roleId, lang }: { tab: string; roleId: string; lang: string }) {
  const props = { roleId, lang }
  switch (tab) {
    case 'command':     return <CommandPanel      {...props} />
    case 'budget':      return <BudgetPanel       {...props} />
    case 'revenue':     return <RevenuePanel      {...props} />
    case 'debt':        return <PublicDebtPanel   {...props} />
    case 'trade':       return <TradeRevenuePanel {...props} />
    case 'pefa':        return <PEFAPanel         {...props} />
    case 'compliance':  return <CompliancePanel   {...props} />
    case 'imf':         return <IMFPanel          {...props} />
    case 'donors':      return <AidDonorsPanel    {...props} />
    case 'procurement': return <ProcurementPanel  {...props} />
    case 'oracle':      return <OraclePanel       {...props} />
    case 'pacific':     return <PacificPanel      {...props} />
    default:            return <CommandPanel      {...props} />
  }
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [hasRole,          setHasRole]          = useState(false)
  const [roleId,           setRoleId]           = useState('MOF_ANALYST')
  const [activeCategory,   setActiveCategory]   = useState('fiscal')
  const [activeTab,        setActiveTab]        = useState('command')
  const [lang,             setLang]             = useState<'EN'|'SM'>('EN')
  const [sessionState,     setSessionState]     = useState<'active'|'warning'|'expired'>('active')
  const [lastActivity,     setLastActivity]     = useState(Date.now())
  const [gatewaySession,   setGatewaySession]   = useState<{ zone: 1|2|3; role: string } | null>(null)

  // ── On mount: parse gateway token, check session ──────────────────────────
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken  = urlParams.get('token')

    if (urlToken) {
      const zone = parseZoneFromToken(urlToken) as 1|2|3
      const role = parseRoleFromToken(urlToken)
      sessionStorage.setItem('gov_session', JSON.stringify({
        sessionToken: urlToken,
        zone,
        role,
        storedAt: Date.now(),
        portalUrl: '',
      }))
      window.history.replaceState({}, '', window.location.pathname)
    }

    // DEV auto-login
    if (import.meta.env.DEV && window.location.pathname === '/mof-admin') {
      handleRoleSelect('MOF_CEO')
      return
    }

    const session = getSession()
    if (session) {
      setGatewaySession({ zone: session.zone, role: session.role })
      const mofRole = Object.keys(ROLES).find(k => k === session.role) || 'MOF_ANALYST'
      handleRoleSelect(mofRole)
    }
    // No session → show MOFRolePicker (no redirect)
  }, [])

  // ── Activity tracking for session timeout ─────────────────────────────────
  const touchActivity = useCallback(() => setLastActivity(Date.now()), [])

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, touchActivity, { passive: true }))
    return () => events.forEach(e => window.removeEventListener(e, touchActivity))
  }, [touchActivity])

  useEffect(() => {
    if (!hasRole) return
    const id = setInterval(() => {
      const idle = Date.now() - lastActivity
      if      (idle >= SESSION_TIMEOUT_MS) setSessionState('expired')
      else if (idle >= SESSION_WARN_MS)    setSessionState('warning')
      else                                 setSessionState('active')
    }, 10000)
    return () => clearInterval(id)
  }, [hasRole, lastActivity])

  // ── Role selection ────────────────────────────────────────────────────────
  function handleRoleSelect(id: string) {
    const role = resolveRole(id)
    setRoleId(role.id)
    setHasRole(true)
    setLastActivity(Date.now())
    setSessionState('active')
    // Set default tab for this role
    if (role.tabs !== 'all' && Array.isArray(role.tabs) && !role.tabs.includes('command')) {
      const firstTab = role.tabs[0] || 'command'
      setActiveTab(firstTab)
      const cat = ALL_TABS.find(tb => tb.id === firstTab)?.category || 'fiscal'
      setActiveCategory(cat)
    } else {
      setActiveTab('command')
      setActiveCategory('fiscal')
    }
  }

  function handleSignOut() {
    clearSession()
    setHasRole(false)
    setSessionState('active')
    setGatewaySession(null)
    setRoleId('MOF_ANALYST')
    setActiveTab('command')
    setActiveCategory('fiscal')
  }

  function handleTabChange(tabId: string) {
    setActiveTab(tabId)
    const cat = ALL_TABS.find(tb => tb.id === tabId)?.category
    if (cat) setActiveCategory(cat)
    touchActivity()
  }

  function handleCategoryChange(catId: string) {
    setActiveCategory(catId)
    touchActivity()
  }

  // ── Render: role picker ───────────────────────────────────────────────────
  if (!hasRole) {
    return (
      <>
        <MOFRolePicker onSelect={handleRoleSelect} lang={lang} />
      </>
    )
  }

  const role = resolveRole(roleId)

  // ── Render: full dashboard ────────────────────────────────────────────────
  return (
    <>
      {/* Session warning overlay */}
      <SessionWarning
        sessionState={sessionState}
        onContinue={() => { touchActivity(); setSessionState('active') }}
        lang={lang}
      />

      {/* Classification band */}
      <ClassificationBand zone={3} role="MOF Fiscal Authority" />

      {/* Shell */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>

        {/* Top bar with lang toggle + sign out */}
        <div style={{
          background:     COLORS.surface,
          borderBottom:   `1px solid ${COLORS.border}`,
          padding:        '0 24px',
          height:         36,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'flex-end',
          gap:            12,
          flexShrink:     0,
          zIndex:         50,
        }}>
          <button
            onClick={() => setLang(l => l === 'EN' ? 'SM' : 'EN')}
            style={{
              background:    'transparent',
              border:        `1px solid ${COLORS.border}`,
              borderRadius:  3,
              color:         COLORS.textMuted,
              cursor:        'pointer',
              fontFamily:    TYPOGRAPHY.mono,
              fontSize:      11,
              letterSpacing: '1px',
              padding:       '2px 10px',
              transition:    'color 0.1s, border-color 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = COLORS.gold; e.currentTarget.style.borderColor = COLORS.gold }}
            onMouseLeave={e => { e.currentTarget.style.color = COLORS.textMuted; e.currentTarget.style.borderColor = COLORS.border }}
          >
            {lang === 'EN' ? 'SM' : 'EN'}
          </button>
          <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: 11, color: COLORS.textDim }}>
            {role.id}
          </span>
          <button
            onClick={handleSignOut}
            style={{
              background:    'transparent',
              border:        'none',
              color:         COLORS.textDim,
              cursor:        'pointer',
              fontFamily:    TYPOGRAPHY.mono,
              fontSize:      11,
              letterSpacing: '1px',
              padding:       '2px 0',
              transition:    'color 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = COLORS.critical}
            onMouseLeave={e => e.currentTarget.style.color = COLORS.textDim}
          >
            ⎋ {t(lang, 'action.signout')}
          </button>
        </div>

        {/* Main layout */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Sidebar */}
          <MOFSidebar
            activeTab={activeTab}
            onTab={handleTabChange}
            roleId={roleId}
            lang={lang}
            onSignOut={handleSignOut}
          />

          {/* Content area */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

            {/* MOF Header */}
            <MOFHeader roleId={roleId} lang={lang} />

            {/* Category + tab nav */}
            <CategoryNav
              activeCategory={activeCategory}
              activeTab={activeTab}
              onCategory={handleCategoryChange}
              onTab={handleTabChange}
              roleId={roleId}
              lang={lang}
            />

            {/* Panel content */}
            <main
              id="main-content"
              style={{
                flex:      1,
                overflowY: 'auto',
                padding:   '24px 28px 40px',
              }}
            >
              <PanelContent tab={activeTab} roleId={roleId} lang={lang} />
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
