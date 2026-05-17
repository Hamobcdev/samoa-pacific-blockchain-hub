import React from 'react'
// @ts-ignore
import { LanguageToggle } from '@samoa-dpi/shared-ui'
import { TapaHeader } from '../cultural/TapaHeader'
import { C, MONO, SANS, t } from '../../constants'
import type { TopRole, OfficerSubRole } from '../../types'
import type { LangKey } from '../../constants'

const ROLE_LABELS: Record<string, { en: string; sm: string; icon: string }> = {
  agent:      { en: 'Shipping Agent / Ship Master', sm: 'Sui o le Vaa / Kapeteni', icon: '🚢' },
  officer:    { en: 'Government Officer',           sm: 'Ofisa o le Malo',         icon: '👮' },
  passenger:  { en: 'Passenger / Airline',          sm: 'Tagata Malaga / Ea',      icon: '✈' },
}

const OFFICER_LABELS: Record<string, string> = {
  customs:    'Customs & Revenue',
  immigration:'Immigration',
  maf:        'MAF / Biosecurity',
  portHealth: 'Port Health',
  portAuth:   'Samoa Port Authority',
}

interface Props {
  lang:           string
  role:           TopRole | null
  officerSubRole: OfficerSubRole | null
  onSwitchRole:   () => void
}

export function PortalHeader({ lang, role, officerSubRole, onSwitchRole }: Props) {
  const roleInfo = role ? ROLE_LABELS[role] : null
  const roleLabel = roleInfo
    ? ((lang === 'SM' || lang === 'sm') ? roleInfo.sm : roleInfo.en)
    : null

  return (
    <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
      <TapaHeader height={6} />
      <div style={{
        display:     'flex',
        alignItems:  'center',
        justifyContent: 'space-between',
        padding:     '12px 24px',
        gap:         16,
      }}>
        {/* Left: identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 2 }}>
              SAMOA OMW
            </div>
            <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, color: C.text }}>
              {t(lang as Parameters<typeof t>[0], 'portalTitle' as LangKey)}
            </div>
          </div>
        </div>

        {/* Right: controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {role && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>
                {roleInfo?.icon} {roleLabel}
                {officerSubRole && ` · ${OFFICER_LABELS[officerSubRole] ?? officerSubRole}`}
              </span>
              <button
                onClick={onSwitchRole}
                aria-label="Switch role"
                style={{
                  background:   'none',
                  border:       `1px solid ${C.border}`,
                  borderRadius: 4,
                  color:        C.muted,
                  cursor:       'pointer',
                  fontFamily:   MONO,
                  fontSize:     10,
                  padding:      '4px 10px',
                  minHeight:    30,
                }}
              >
                {t(lang as Parameters<typeof t>[0], 'switchRole' as LangKey)}
              </button>
            </div>
          )}
          {/* @ts-ignore */}
          <LanguageToggle />
        </div>
      </div>
    </header>
  )
}
