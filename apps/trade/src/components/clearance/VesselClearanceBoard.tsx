import React, { useMemo } from 'react'
import { C, MONO, SANS } from '../../constants'
import { useClearanceStatus } from '../../hooks/useClearanceStatus'
import { generateCertRef, generateISO20022Ref } from '../../hooks/useOMWSubmission'
import { ClearanceChip } from '../shared/ClearanceChip'
import { PortClearanceCert } from '../maritime/PortClearanceCert'
import type { MinistryStatus } from '../../types'

// ── Agency metadata ────────────────────────────────────────────────────────────

const AGENCY_ORDER = ['customs', 'maf', 'portHealth', 'portAuth'] as const
type AgencyCode = typeof AGENCY_ORDER[number]

const AGENCY_META: Record<AgencyCode, { name: string; smName: string; icon: string }> = {
  customs:    { name: 'Customs & Revenue',    smName: 'Tumau ma Tupe Maua',  icon: '🛃' },
  maf:        { name: 'MAF Biosecurity',      smName: 'MAF Biosecurity',     icon: '🌿' },
  portHealth: { name: 'Port Health — MOH',    smName: 'Soifua Maloloina',    icon: '🏥' },
  portAuth:   { name: 'Samoa Port Authority', smName: 'Pulega o le Uafu',    icon: '⚓' },
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function isCleared(status: MinistryStatus | undefined): boolean {
  return status === 'CLEARED' || status === 'SUBMITTED'
}

function wst(): string {
  return new Date().toLocaleString('en-WS', {
    timeZone: 'Pacific/Apia', hour12: false,
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) + ' WST'
}

// ── Status chip for agency cards (label only, bilingual) ──────────────────────

const SM_STATUS: Record<string, string> = {
  CLEARED:       'UA PASIA',
  APPROVED:      'UA PASIA',
  PENDING:       'FAATALITALI',
  AWAITING_DOCS: 'TAOFI',
  AWAITING_PRIOR:'FAATALITALI',
  NOT_REQUIRED:  'E LE MANA\'OA',
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  vesselRef:   string
  vesselName:  string
  imoNumber:   string
  eta:         string
  flagState?:  string
  masterName?: string
  showDues?:   boolean
  compact?:    boolean
  lang?:       string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function VesselClearanceBoard({
  vesselRef,
  vesselName,
  imoNumber,
  eta,
  flagState  = '—',
  masterName = '—',
  showDues   = true,
  compact    = false,
  lang       = 'en',
}: Props) {
  const { record, lastUpdated } = useClearanceStatus(vesselRef)
  const isSM = lang === 'SM' || lang === 'sm'

  // Stable refs generated once per vesselRef
  const certRef = useMemo(() => generateCertRef(),            [vesselRef]) // eslint-disable-line react-hooks/exhaustive-deps
  const payRef  = useMemo(() => generateISO20022Ref(imoNumber), [imoNumber]) // eslint-disable-line react-hooks/exhaustive-deps

  // 4-agency status array
  const agencies = AGENCY_ORDER.map(code => ({
    code,
    meta:   AGENCY_META[code],
    entry:  record.ministryStatuses.find(ms => ms.code === code),
  }))

  const clearedCount    = agencies.filter(a => isCleared(a.entry?.status)).length
  const pendingAgencies = agencies.filter(a => !isCleared(a.entry?.status))
  const allCleared      = clearedCount === 4

  // Build clearances list for certificate
  const certClearances = agencies
    .filter(a => isCleared(a.entry?.status))
    .map(a => ({
      label: a.meta.name,
      at:    a.entry?.clearedAt ?? wst(),
    }))

  // Overall banner status
  type BannerState = 'SUBMITTED' | 'IN_CLEARANCE' | 'AWAITING' | 'ALL_CLEARED' | 'PORT_CLEARED'
  const bannerState: BannerState =
    allCleared                                          ? 'PORT_CLEARED'  :
    clearedCount >= 3 && pendingAgencies.length === 1   ? 'AWAITING'       :
    clearedCount > 0                                    ? 'IN_CLEARANCE'   :
                                                          'SUBMITTED'

  const bannerConfig: Record<BannerState, { bg: string; bdr: string; color: string; label: string }> = {
    SUBMITTED:   { bg: C.surface2,          bdr: C.border,   color: C.muted,    label: isSM ? 'UA TUUINA ATU'         : 'ARRIVAL SUBMITTED'     },
    IN_CLEARANCE:{ bg: `${C.flagBlue}14`,   bdr: '#253258',  color: '#38bdf8',  label: isSM ? "O LO'O SIAKI"          : 'IN CLEARANCE'          },
    AWAITING:    { bg: `${C.amber}14`,      bdr: C.amberBdr, color: C.amber,    label: isSM ? 'FAATALITALI'           : `AWAITING ${pendingAgencies[0]?.meta?.name ?? ''}`.trim() },
    ALL_CLEARED: { bg: `${C.green}14`,      bdr: C.greenBdr, color: C.green,    label: isSM ? 'UA PASIA UMA'          : 'ALL AGENCIES CLEARED'  },
    PORT_CLEARED:{ bg: C.green,             bdr: C.greenBdr, color: '#fff',     label: isSM ? 'UA FAASAOLOTO I LE UAFU / PORT CLEARED ✓' : 'UA FAASAOLOTO I LE UAFU / PORT CLEARED ✓' },
  }
  const banner = bannerConfig[bannerState]

  // ── PORT CLEARED terminal render ────────────────────────────────────────────

  if (bannerState === 'PORT_CLEARED') {
    const fakeTxHash = `0x${vesselRef.replace(/\W/g, '')}${'a1b2c3d4e5f6'}`
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* PORT CLEARED banner */}
        <div style={{ background: C.green, borderRadius: 8, padding: '24px 28px', textAlign: 'center' }}>
          <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '2px', marginBottom: 8 }}>
            UA FAASAOLOTO I LE UAFU / PORT CLEARED ✓
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,0.85)', marginBottom: 4 }}>
            Clearance Reference: {certRef}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
            {wst()}
          </div>
        </div>

        {/* Agency summary grid — all green */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {agencies.map(a => (
            <div key={a.code} style={{ background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }} aria-hidden="true">{a.meta.icon}</span>
                <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: C.green }}>
                  {isSM ? a.meta.smName : a.meta.name}
                </span>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.green }}>✓ {isSM ? 'UA PASIA' : 'CLEARED'}</div>
              {a.entry?.clearedAt && <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginTop: 2 }}>{a.entry.clearedAt}</div>}
            </div>
          ))}
        </div>

        {/* Certificate */}
        <PortClearanceCert
          certRef={certRef}
          txHash={fakeTxHash.padEnd(42, '0')}
          payRef={payRef}
          vesselName={vesselName}
          imoNumber={imoNumber}
          flagState={flagState}
          masterName={masterName}
          clearances={certClearances}
          duesAmount={record.duesAmount}
        />
      </div>
    )
  }

  // ── Standard in-progress render ─────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: '1px' }}>
            CLEARANCE STATUS — {vesselName}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>
            {vesselRef} · IMO {imoNumber} · ETA: {eta}
          </div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>Updated: {lastUpdated}</div>
      </div>

      {/* Overall status banner */}
      <div style={{ background: banner.bg, border: `1px solid ${banner.bdr}`, borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: banner.color, letterSpacing: '1.5px' }}>
          {banner.label}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: banner.color, opacity: 0.8 }}>
          {clearedCount} / 4 {isSM ? 'ua pasia' : 'cleared'}
        </span>
      </div>

      {/* Awaiting specific agency */}
      {bannerState === 'AWAITING' && pendingAgencies[0] && (
        <div style={{ background: `${C.amber}10`, border: `1px solid ${C.amberBdr}`, borderRadius: 6, padding: '8px 14px', fontFamily: MONO, fontSize: 10, color: C.amber }}>
          ⏳ {isSM ? 'Faatalitali' : 'Awaiting'}:{' '}
          <strong>{isSM ? pendingAgencies[0].meta.smName : pendingAgencies[0].meta.name}</strong>
          {' '}— {isSM ? 'O lo\'o siaki pea' : 'Assessment in progress'}
        </div>
      )}

      {/* 2×2 Agency grid */}
      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: 10 }}>
        {agencies.map(a => {
          const status  = a.entry?.status ?? 'PENDING'
          const cleared = isCleared(status)
          const held    = status === 'AWAITING_DOCS' || status === 'AWAITING_PRIOR'
          const cardBg  = cleared ? C.greenBg : held ? C.amberBg : C.surface
          const cardBdr = cleared ? C.greenBdr : held ? C.amberBdr : C.border
          const nameColor = cleared ? C.green : held ? C.amber : C.text

          return (
            <div key={a.code} style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }} aria-hidden="true">{a.meta.icon}</span>
                <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: nameColor }}>
                  {isSM ? a.meta.smName : a.meta.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
                <ClearanceChip status={status} size="sm" />
                {isSM && (
                  <span style={{ fontFamily: MONO, fontSize: 9, color: nameColor, letterSpacing: '0.5px' }}>
                    {SM_STATUS[status] ?? status}
                  </span>
                )}
              </div>
              {held && (
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.amber, marginTop: 6 }}>
                  {isSM ? 'Mana\'oia ni tusi fa\'amaonia' : 'Documents required — check agency queue'}
                </div>
              )}
              {a.entry?.clearedAt && cleared && (
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginTop: 4 }}>
                  {isSM ? 'Ua pasia' : 'Cleared'}: {a.entry.clearedAt}
                </div>
              )}
              {!cleared && !held && (
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 6 }}>
                  {isSM ? 'O lo\'o faatalitali' : 'Est. 2–4 hrs'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Dues panel */}
      {showDues && !compact && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>
              {isSM ? 'Tupe Taulaga' : 'Harbour Dues'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 14, color: C.gold, fontWeight: 600 }}>
                WST {record.duesAmount}
              </span>
              <ClearanceChip status={record.duesStatus === 'PAID' ? 'APPROVED' : record.duesStatus} size="sm" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden="true">🔒</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>
                {isSM ? 'Tusi Faatagaga o le Uafu' : 'Port Clearance Certificate'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.amber }}>{clearedCount} of 4 cleared</span>
              <ClearanceChip status="PENDING" size="sm" />
            </div>
          </div>
        </div>
      )}

      {/* Research disclaimer */}
      <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, textAlign: 'center' }}>
        {isSM ? 'Fa\'ata\'ita\'iga — Feso\'ota\'iga fa\'aaoga o le galuega Phase 2' : 'Simulated clearance workflow · Phase 2: live agency API integration'}
      </div>
    </div>
  )
}
