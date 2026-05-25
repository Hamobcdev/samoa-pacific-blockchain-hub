import React, { useState } from 'react'
import { C, MONO, SANS, TAPA_BG, t } from '../../constants'
import type { TopRole, OfficerSubRole } from '../../types'

interface RoleCard {
  id:          TopRole
  icon:        string
  en:          string
  sm:          string
  description: string
  descSM:      string
  color:       string
}

const ROLES: RoleCard[] = [
  {
    id:          'agent',
    icon:        '🚢',
    en:          'Shipping Agent / Ship Master',
    sm:          'Sui o le Vaa / Kapeteni',
    description: 'Submit FAL forms, pay harbour dues, receive port clearance certificate.',
    descSM:      'Tuuina atu faila FAL, totogi tupe taulaga, maua tusi faatagaga.',
    color:       C.flagBlue,
  },
  {
    id:          'officer',
    icon:        '👮',
    en:          'Government Officer',
    sm:          'Ofisa o le Malo',
    description: 'Customs · Immigration · MAF · Port Health · Samoa Port Authority. View and action clearance queues.',
    descSM:      'Taulaga · Siitia · MAF · Soifua · Uafu. Tilotilo ma faatino ose faatoesega.',
    color:       C.gold,
  },
  {
    id:          'passenger',
    icon:        '✈',
    en:          'Passenger / Airline',
    sm:          'Tagata Malaga / Ea',
    description: 'Submit Arrival or Departure Declaration. Receive digital clearance QR.',
    descSM:      'Tuuina atu faamaoniga o taunuu poo alu atu. Maua QR faamaoniga.',
    color:       C.green,
  },
]

const OFFICER_SUB_ROLES: Array<{ id: OfficerSubRole; label: string; icon: string }> = [
  { id: 'customs',    label: 'Customs & Revenue Authority',    icon: '📦' },
  { id: 'immigration',label: 'Immigration',                   icon: '🛂' },
  { id: 'maf',        label: 'Ministry of Agriculture & Fisheries (MAF / Biosecurity)', icon: '🌿' },
  { id: 'portHealth', label: 'Port Health',                   icon: '🏥' },
  { id: 'portAuth',   label: 'Samoa Port Authority',          icon: '⚓' },
]

interface Props {
  lang:             string
  onSelectRole:     (role: TopRole)            => void
  onSelectSubRole:  (sub: OfficerSubRole)      => void
}

export function RolePicker({ lang, onSelectRole, onSelectSubRole }: Props) {
  const [pendingOfficer, setPendingOfficer] = useState(false)
  const isSM = lang === 'SM' || lang === 'sm'

  if (pendingOfficer) {
    return (
      <div style={{ minHeight: '100dvh', background: C.bg, backgroundImage: TAPA_BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ color: C.gold, fontFamily: MONO, fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 8 }}>
          SAMOA OMW
        </div>
        <div style={{ color: C.text, fontFamily: SANS, fontSize: 20, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
          Government Officer
        </div>
        <div style={{ color: C.muted, fontFamily: MONO, fontSize: 11, marginBottom: 32 }}>
          Select your ministry or authority
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 440 }}>
          {OFFICER_SUB_ROLES.map(sub => (
            <button
              key={sub.id}
              onClick={() => { onSelectRole('officer'); onSelectSubRole(sub.id) }}
              style={{
                background:   C.surface,
                border:       `1px solid ${C.border}`,
                borderRadius: 6,
                color:        C.text,
                cursor:       'pointer',
                fontFamily:   SANS,
                padding:      '14px 18px',
                textAlign:    'left',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'space-between',
                transition:   'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = C.surface2 }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span aria-hidden="true" style={{ fontSize: 20 }}>{sub.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{sub.label}</span>
              </div>
              <span aria-hidden="true" style={{ color: C.dim, fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setPendingOfficer(false)}
          style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 11, marginTop: 20 }}
        >
          ← Back
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: C.bg, backgroundImage: TAPA_BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ color: C.gold, fontFamily: MONO, fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 8 }}>
        SAMOA ONE-STOP MARITIME WINDOW (OMW)
      </div>
      <div style={{ color: C.text, fontFamily: SANS, fontSize: 22, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        {isSM ? "Faitoto'o o Fefa'ataua'iga ma Tulagavae" : 'Trade & Border Clearance Portal'}
      </div>
      <div style={{ color: C.muted, fontFamily: MONO, fontSize: 11, marginBottom: 40, letterSpacing: '1px' }}>
        Digital Public Infrastructure · DPI
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 480 }}>
        {ROLES.map(role => (
          <button
            key={role.id}
            onClick={() => {
              if (role.id === 'officer') { setPendingOfficer(true) }
              else { onSelectRole(role.id) }
            }}
            aria-describedby={`role-desc-${role.id}`}
            style={{
              background:   C.surface,
              border:       `1px solid ${C.border}`,
              borderRadius: 8,
              color:        C.text,
              cursor:       'pointer',
              fontFamily:   SANS,
              padding:      '18px 22px',
              textAlign:    'left',
              transition:   'border-color 0.15s, background 0.15s',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'space-between',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = role.color; e.currentTarget.style.background = C.surface2 }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1 }}>{role.icon}</span>
              <div>
                <div style={{ color: role.color, fontFamily: MONO, fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>
                  {role.id.toUpperCase()}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                  {isSM ? role.sm : role.en}
                </div>
                <div id={`role-desc-${role.id}`} style={{ color: C.muted, fontSize: 13 }}>
                  {isSM ? role.descSM : role.description}
                </div>
              </div>
            </div>
            <span aria-hidden="true" style={{ color: C.dim, fontSize: 20 }}>›</span>
          </button>
        ))}
      </div>

      <div style={{ color: C.dim, fontFamily: MONO, fontSize: 10, letterSpacing: '1px', marginTop: 40 }}>
        SECURE SESSION · WCAG AAA · SAMOA DPI v0.6.0
      </div>
    </div>
  )
}
