import React, { useState } from 'react'
import { C, MONO, SANS } from '../constants'
import { AuditLog } from './AuditLog'
import type { OMWAuthResult, AuditEntry } from '../types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function wst() {
  return new Date().toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })
}

function ref(prefix: string) {
  return `${prefix}-${String(Math.floor(10000000 + Math.random() * 90000000))}`
}

function vesselRef() {
  return `${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`
}

function fld(
  label: string,
  value: string,
  onChange: (v: string) => void,
  opts?: { type?: string; placeholder?: string; readOnly?: boolean; mono?: boolean },
) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>{label}</label>
      <input
        type={opts?.type ?? 'text'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={opts?.placeholder}
        readOnly={opts?.readOnly}
        style={{
          background:  opts?.readOnly ? C.surface : C.surface2,
          border:      `1px solid ${C.border}`,
          borderRadius: 4,
          color:       opts?.readOnly ? C.muted : C.text,
          fontFamily:  opts?.mono !== false ? MONO : SANS,
          fontSize:    12,
          padding:     '8px 10px',
          outline:     'none',
          width:       '100%',
          boxSizing:   'border-box',
        }}
      />
    </div>
  )
}

function sel(label: string, value: string, onChange: (v: string) => void, options: string[]) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background:   C.surface2,
          border:       `1px solid ${C.border}`,
          borderRadius: 4,
          color:        C.text,
          fontFamily:   MONO,
          fontSize:     12,
          padding:      '8px 10px',
          outline:      'none',
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function submitBtn(label: string, onClick: () => void, disabled?: boolean) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background:    disabled ? C.surface3 : C.flagBlue,
        border:        'none',
        borderRadius:  4,
        color:         '#fff',
        cursor:        disabled ? 'not-allowed' : 'pointer',
        fontFamily:    MONO,
        fontSize:      11,
        fontWeight:    700,
        letterSpacing: '1px',
        padding:       '10px 18px',
        marginTop:     8,
        alignSelf:     'flex-start',
        opacity:       disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  )
}

function confirmation(lines: string[]) {
  return (
    <div style={{ background: `${C.green}10`, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: '12px 16px', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: MONO, fontSize: 11, color: i === 0 ? C.green : C.muted }}>{l}</div>
      ))}
    </div>
  )
}

function sectionHead(title: string, sub?: string) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: MONO, fontSize: 11, color: C.gold, letterSpacing: '2px', textTransform: 'uppercase' }}>{title}</div>
      {sub && <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function grid2(children: React.ReactNode[]) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{children}</div>
}

function grid3(children: React.ReactNode[]) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>{children}</div>
}

// ── Agency clearance statuses ─────────────────────────────────────────────────

type AgencyStatusVal = 'Pending' | 'Under Review' | 'Cleared' | 'Stub'

interface AgencyStatus {
  code:    string
  name:    string
  status:  AgencyStatusVal
  note?:   string
  updated: string
}

const INITIAL_STATUSES: AgencyStatus[] = [
  { code: 'SPA',     name: 'SPA Port Authority',        status: 'Pending',      updated: '—' },
  { code: 'CUSTOMS', name: 'Samoa Customs & Revenue',   status: 'Under Review', updated: wst() },
  { code: 'MAF',     name: 'MAF Biosecurity',           status: 'Pending',      updated: '—' },
  { code: 'HEALTH',  name: 'Port Health — MOH',         status: 'Stub',         note: 'Phase 2 — port health integration pending', updated: '—' },
]

const STATUS_BADGE: Record<AgencyStatusVal, { bg: string; bdr: string; color: string }> = {
  Pending:      { bg: C.amberBg,  bdr: C.amberBdr,  color: C.amber  },
  'Under Review': { bg: `${C.flagBlue}18`, bdr: C.border2, color: C.info   },
  Cleared:      { bg: C.greenBg, bdr: C.greenBdr, color: C.green  },
  Stub:         { bg: C.surface3, bdr: C.border,   color: C.dim    },
}

// ── Tab types ─────────────────────────────────────────────────────────────────

type FFTab = 'cargo' | 'bol' | 'asycuda' | 'status'

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  session: OMWAuthResult
}

export function FreightForwarderDashboard({ session }: Props) {
  const [tab, setTab] = useState<FFTab>('cargo')
  const [audit, setAudit] = useState<AuditEntry[]>([])

  function addAudit(entry: AuditEntry) {
    setAudit(prev => [entry, ...prev])
  }

  const tabs: { id: FFTab; label: string }[] = [
    { id: 'cargo',   label: 'CARGO DECLARATIONS' },
    { id: 'bol',     label: 'BILL OF LADING' },
    { id: 'asycuda', label: 'ASYCUDA' },
    { id: 'status',  label: 'STATUS' },
  ]

  return (
    <div style={{ fontFamily: SANS, color: C.text }}>
      {/* Role header */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.info, letterSpacing: '2px' }}>ZONE 1 — OFFICIAL</div>
          <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.text, marginTop: 2 }}>{session.label}</div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>
          Auth: {new Date(session.authedAt).toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })} WST
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background:    tab === t.id ? C.surface2 : 'none',
              border:        `1px solid ${tab === t.id ? C.border2 : 'transparent'}`,
              borderBottom:  tab === t.id ? `2px solid ${C.flagBlue}` : '2px solid transparent',
              borderRadius:  '4px 4px 0 0',
              color:         tab === t.id ? C.text : C.muted,
              cursor:        'pointer',
              fontFamily:    MONO,
              fontSize:      10,
              letterSpacing: '1px',
              padding:       '8px 14px',
              marginBottom:  -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'cargo'   && <CargoDeclarationsTab audit={audit} addAudit={addAudit} />}
      {tab === 'bol'     && <BillOfLadingTab audit={audit} addAudit={addAudit} />}
      {tab === 'asycuda' && <ASYCUDATab audit={audit} />}
      {tab === 'status'  && <StatusTab />}

      <AuditLog entries={audit} />
    </div>
  )
}

// ── Tab: Cargo Declarations ───────────────────────────────────────────────────

interface TabProps {
  audit:    AuditEntry[]
  addAudit: (e: AuditEntry) => void
}

function CargoDeclarationsTab({ addAudit }: TabProps) {
  const [declarantRef,   setDeclarantRef]   = useState('')
  const [procedureCode,  setProcedureCode]  = useState('40 00')
  const [country,        setCountry]        = useState('NZ')
  const [hsCode,         setHsCode]         = useState('')
  const [description,    setDescription]    = useState('')
  const [quantity,       setQuantity]       = useState('')
  const [quantityUnit,   setQuantityUnit]   = useState('KG')
  const [cifValue,       setCifValue]       = useState('')
  const [freight,        setFreight]        = useState('')
  const [insurance,      setInsurance]      = useState('')
  const [incoterms,      setIncoterms]      = useState('CIF')
  const [vesselName,     setVesselName]     = useState('MV Pacific Star')
  const [imoNumber,      setImoNumber]      = useState('9234567')
  const [blNumber,       setBlNumber]       = useState('')
  const [submitted,      setSubmitted]      = useState(false)
  const [sadRef,         setSadRef]         = useState('')

  function handleSubmit() {
    const r = ref('SAD')
    setSadRef(r)
    setSubmitted(true)
    addAudit({
      timestamp:     wst(),
      form:          'Single Admin. Document (SAD / ASYCUDA)',
      reference:     r,
      transmittedTo: 'ASYCUDA World — Samoa Customs & Revenue',
      status:        'SUBMITTED',
    })
  }

  const canSubmit = !!declarantRef && !!hsCode && !!description && !!quantity && !!cifValue

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {sectionHead('Single Administrative Document (SAD)', 'WCO Data Model v3 · ASYCUDA World · IMO FAL Convention')}

      {/* Declarant & Procedure */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px', marginBottom: 12 }}>BOX A — DECLARANT & PROCEDURE</div>
        {grid2([
          fld('Declarant Reference (Box 7)', declarantRef, setDeclarantRef, { placeholder: 'e.g. PTL-2026-0099' }),
          fld('Procedure Code (Box 37)', procedureCode, setProcedureCode, { placeholder: '40 00' }),
        ])}
        <div style={{ marginTop: 10 }}>
          {grid2([
            sel('Country of Export (Box 15a)', country, setCountry, ['NZ', 'AU', 'FJ', 'TO', 'VU', 'SB', 'PG', 'CN', 'US', 'JP', 'KR', 'SG', 'OTHER']),
            sel('Incoterms (Box 20)', incoterms, setIncoterms, ['CIF', 'FOB', 'CFR', 'EXW', 'DDP', 'DAP']),
          ])}
        </div>
      </div>

      {/* Goods Description */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px', marginBottom: 12 }}>BOX B — GOODS DESCRIPTION</div>
        {grid2([
          fld('HS Code (Box 33)', hsCode, setHsCode, { placeholder: 'e.g. 854231' }),
          fld('Description of Goods (Box 31)', description, setDescription, { placeholder: 'e.g. Electrical apparatus' }),
        ])}
        <div style={{ marginTop: 10 }}>
          {grid3([
            fld('Quantity (Box 35)', quantity, setQuantity, { placeholder: '0.00' }),
            sel('Unit', quantityUnit, setQuantityUnit, ['KG', 'T', 'L', 'M3', 'UNITS', 'PKGS']),
            fld('Number of Packages (Box 32)', '', () => {}, { placeholder: 'e.g. 24 CTN' }),
          ])}
        </div>
      </div>

      {/* Valuation */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px', marginBottom: 12 }}>BOX C — CUSTOMS VALUATION (WST)</div>
        {grid3([
          fld('CIF Value (Box 46)', cifValue, setCifValue, { placeholder: '0.00', type: 'number' }),
          fld('Freight (Box 44)', freight, setFreight, { placeholder: '0.00', type: 'number' }),
          fld('Insurance (Box 44)', insurance, setInsurance, { placeholder: '0.00', type: 'number' }),
        ])}
        {cifValue && freight && insurance && (
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginTop: 10 }}>
            Customs Value:{' '}
            <span style={{ color: C.gold }}>
              WST {(parseFloat(cifValue || '0')).toFixed(2)}
            </span>
            {' '}· Duties basis: CIF per ASYCUDA tariff schedule
          </div>
        )}
      </div>

      {/* Transport */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px', marginBottom: 12 }}>BOX D — TRANSPORT DETAILS</div>
        {grid3([
          fld('Vessel Name (Box 18)', vesselName, setVesselName),
          fld('IMO Number (Box 18)', imoNumber, setImoNumber),
          fld('B/L Number (Box 44)', blNumber, setBlNumber, { placeholder: 'e.g. MCCAPIA26050001' }),
        ])}
      </div>

      {/* Submit */}
      {!submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {!canSubmit && (
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.amber, marginBottom: 4 }}>
              Required: Declarant Ref, HS Code, Description, Quantity, CIF Value
            </div>
          )}
          {submitBtn('TRANSMIT TO ASYCUDA WORLD →', handleSubmit, !canSubmit)}
        </div>
      ) : (
        confirmation([
          `✓ SAD SUBMITTED TO ASYCUDA WORLD`,
          `Reference: ${sadRef}`,
          `Transmitted to: Samoa Customs & Revenue — ASYCUDA World`,
          `Timestamp (WST): ${wst()}`,
          `Status: Awaiting customs assessment — duty notice will follow`,
        ])
      )}
    </div>
  )
}

// ── Tab: Bill of Lading ───────────────────────────────────────────────────────

function BillOfLadingTab({ addAudit }: TabProps) {
  const [shipper,       setShipper]       = useState('')
  const [consignee,     setConsignee]     = useState('')
  const [notifyParty,   setNotifyParty]   = useState('')
  const [portLoading,   setPortLoading]   = useState('')
  const [portDischarge, setPortDischarge] = useState('Apia, Samoa')
  const [vesselName,    setVesselName]    = useState('MV Pacific Star')
  const [voyageNo,      setVoyageNo]      = useState('')
  const [blDate,        setBlDate]        = useState('')
  const [containers,    setContainers]    = useState('')
  const [sealNumbers,   setSealNumbers]   = useState('')
  const [grossWeight,   setGrossWeight]   = useState('')
  const [freight,       setFreight]       = useState('PREPAID')
  const [submitted,     setSubmitted]     = useState(false)
  const [blRef,         setBlRef]         = useState('')

  function handleSubmit() {
    const r = `BL-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`
    setBlRef(r)
    setSubmitted(true)
    addAudit({
      timestamp:     wst(),
      form:          'Bill of Lading — DPI Chain Registration',
      reference:     r,
      transmittedTo: 'Samoa DPI Chain (Phase 2 stub)',
      status:        'SUBMITTED',
    })
  }

  const canSubmit = !!shipper && !!consignee && !!portLoading && !!vesselName && !!blDate

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sectionHead('Bill of Lading — DPI Chain Registration', 'Phase 2: B/L hash anchored to Samoa DPI Chain · ISO 28000:2022')}

      {/* Phase 2 notice */}
      <div style={{ background: C.purpleBg, border: `1px solid ${C.purpleBdr}`, borderRadius: 6, padding: '10px 14px' }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.purple, letterSpacing: '1.5px', marginBottom: 4 }}>PHASE 2 — BLOCKCHAIN TRADE DOCUMENT REGISTRY</div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          In Phase 2, the SHA-256 hash of this B/L is anchored to the Samoa DPI Chain via the Trade Document Registry contract.
          The B/L data remains off-chain; only the hash and metadata are registered on-chain.
          This phase: in-memory only — chain registration is stubbed.
        </div>
      </div>

      {/* Parties */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px', marginBottom: 12 }}>PARTIES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fld('Shipper (Full Name & Address)', shipper, setShipper, { placeholder: 'e.g. Auckland Export Co Ltd, 123 Quay St, Auckland' })}
          {fld('Consignee (Full Name & Address)', consignee, setConsignee, { placeholder: 'e.g. Pacific Trade & Logistics, Apia' })}
          {fld('Notify Party', notifyParty, setNotifyParty, { placeholder: 'e.g. Same as consignee' })}
        </div>
      </div>

      {/* Transport */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px', marginBottom: 12 }}>TRANSPORT</div>
        {grid2([
          fld('Port of Loading', portLoading, setPortLoading, { placeholder: 'e.g. Auckland, New Zealand' }),
          fld('Port of Discharge', portDischarge, setPortDischarge),
        ])}
        <div style={{ marginTop: 10 }}>
          {grid3([
            fld('Vessel Name', vesselName, setVesselName),
            fld('Voyage Number', voyageNo, setVoyageNo, { placeholder: 'e.g. 026W' }),
            fld('B/L Date', blDate, setBlDate, { type: 'date' }),
          ])}
        </div>
      </div>

      {/* Cargo */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px', marginBottom: 12 }}>CARGO DETAILS</div>
        {grid3([
          fld('Container / Package Numbers', containers, setContainers, { placeholder: 'e.g. TCKU3245678' }),
          fld('Seal Numbers', sealNumbers, setSealNumbers, { placeholder: 'e.g. SL-880123' }),
          fld('Gross Weight (KG)', grossWeight, setGrossWeight, { type: 'number', placeholder: '0.00' }),
        ])}
        <div style={{ marginTop: 10 }}>
          {sel('Freight Payment', freight, setFreight, ['PREPAID', 'COLLECT', 'AS ARRANGED'])}
        </div>
      </div>

      {/* Submit */}
      {!submitted ? (
        <div>
          {!canSubmit && (
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.amber, marginBottom: 4 }}>
              Required: Shipper, Consignee, Port of Loading, Vessel, B/L Date
            </div>
          )}
          {submitBtn('REGISTER B/L ON DPI CHAIN →', handleSubmit, !canSubmit)}
        </div>
      ) : (
        confirmation([
          `✓ B/L REGISTERED — DPI CHAIN (PHASE 2 STUB)`,
          `Reference: ${blRef}`,
          `SHA-256 hash would be anchored to Trade Document Registry contract`,
          `Timestamp (WST): ${wst()}`,
          `Phase 2: Live chain anchoring pending Samoa DPI sovereign chain deployment`,
        ])
      )}
    </div>
  )
}

// ── Tab: ASYCUDA ──────────────────────────────────────────────────────────────

interface ASYCUDATabProps {
  audit: AuditEntry[]
}

function ASYCUDATab({ audit }: ASYCUDATabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sectionHead('ASYCUDA World Integration', 'UNCTAD Automated System for Customs Data · Samoa Customs & Revenue')}

      {/* Info panel */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '2px', marginBottom: 12 }}>SYSTEM OVERVIEW</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'System', value: 'ASYCUDA World (ASYCUDAWorld 4.3.2)' },
            { label: 'Operator', value: 'Samoa Ministry of Revenue (Customs & Excise Division)' },
            { label: 'Standard', value: 'WCO Data Model v3 · WCO SAFE Framework 2025' },
            { label: 'SAD Format', value: 'Single Administrative Document (UN/EDIFACT CUSCAR)' },
            { label: 'HS Nomenclature', value: 'WCO Harmonized System 2022' },
            { label: 'Tariff Schedule', value: 'Samoa Customs Tariff Act 2016 (as amended)' },
            { label: 'Integration Mode', value: 'Phase 1 — Stub / simulation. Phase 2: live ASYCUDA XML API' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, minWidth: 160, flexShrink: 0 }}>{label}</div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.text }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk management */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '2px', marginBottom: 12 }}>WCO RISK MANAGEMENT — SELECTIVITY CHANNELS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { channel: 'GREEN', desc: 'Release without examination', color: C.green, bg: C.greenBg, bdr: C.greenBdr },
            { channel: 'YELLOW', desc: 'Documentary check required', color: C.amber, bg: C.amberBg, bdr: C.amberBdr },
            { channel: 'RED', desc: 'Physical inspection required', color: C.critical, bg: C.critBg, bdr: C.critBdr },
          ].map(c => (
            <div key={c.channel} style={{ background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '10px 12px' }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: c.color, letterSpacing: '1px', marginBottom: 4 }}>■ {c.channel}</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 10 }}>
          Channel assigned by ASYCUDA risk engine post-submission. Phase 1: randomised demo assignment.
        </div>
      </div>

      {/* Transmission log */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '2px', marginBottom: 12 }}>
          SESSION TRANSMISSION LOG
          <span style={{ background: C.surface3, borderRadius: 3, color: C.muted, fontSize: 9, padding: '1px 6px', marginLeft: 8 }}>
            {audit.length}
          </span>
        </div>
        {audit.length === 0 ? (
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim, padding: '8px 0' }}>
            No transmissions in this session.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr>
                  {['TIMESTAMP (WST)', 'DOCUMENT', 'REFERENCE', 'DESTINATION', 'CHANNEL'].map(h => (
                    <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '6px 10px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', letterSpacing: '1px', background: C.surface2 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {audit.map((e, i) => {
                  const channels = ['GREEN', 'GREEN', 'YELLOW', 'GREEN', 'RED']
                  const ch = channels[i % channels.length]
                  const chColor = ch === 'GREEN' ? C.green : ch === 'YELLOW' ? C.amber : C.critical
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                      <td style={{ fontFamily: MONO, fontSize: 10, color: C.muted, padding: '6px 10px', borderBottom: `1px solid ${C.border}` }}>{e.timestamp}</td>
                      <td style={{ fontFamily: SANS, fontSize: 11, color: C.text,  padding: '6px 10px', borderBottom: `1px solid ${C.border}` }}>{e.form}</td>
                      <td style={{ fontFamily: MONO, fontSize: 10, color: C.gold,  padding: '6px 10px', borderBottom: `1px solid ${C.border}` }}>{e.reference}</td>
                      <td style={{ fontFamily: SANS, fontSize: 11, color: C.muted, padding: '6px 10px', borderBottom: `1px solid ${C.border}` }}>{e.transmittedTo}</td>
                      <td style={{ padding: '6px 10px', borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ fontFamily: MONO, fontSize: 9, color: chColor, letterSpacing: '1px' }}>■ {ch}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Phase 2 stub */}
      <div style={{ background: C.purpleBg, border: `1px solid ${C.purpleBdr}`, borderRadius: 6, padding: '10px 14px' }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.purple, letterSpacing: '1.5px', marginBottom: 4 }}>PHASE 2 — BLOCKCHAIN TRADE FACILITATION</div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          Phase 2 will anchor each ASYCUDA SAD submission hash to the Samoa DPI Chain via the Trade Facilitation Registry contract.
          Immutable proof-of-submission enables UNCTAD 2029 Blockchain Trade Facilitation Readiness compliance
          and supports trade finance instrument digitisation under the Pacific Agreement on Closer Economic Relations (PACER Plus).
        </div>
      </div>
    </div>
  )
}

// ── Tab: Status ───────────────────────────────────────────────────────────────

function StatusTab() {
  const [agencyStatuses, setAgencyStatuses] = useState<AgencyStatus[]>(INITIAL_STATUSES)
  const [refreshed, setRefreshed] = useState(false)

  function handleRefresh() {
    setAgencyStatuses(prev => prev.map(a => {
      if (a.status === 'Pending') return { ...a, status: 'Under Review' as AgencyStatusVal, updated: wst() }
      if (a.status === 'Under Review') return { ...a, status: 'Cleared' as AgencyStatusVal, updated: wst() }
      return a
    }))
    setRefreshed(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sectionHead('Agency Clearance Status', 'Real-time status across all border control agencies')}

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px' }}>CLEARANCE BOARD — ALL AGENCIES</div>
          <button
            onClick={handleRefresh}
            style={{ background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 4, color: C.info, cursor: 'pointer', fontFamily: MONO, fontSize: 10, padding: '5px 12px' }}
          >
            ↻ Refresh Status
          </button>
        </div>
        {agencyStatuses.map((a, i) => {
          const b = STATUS_BADGE[a.status]
          return (
            <div key={a.code} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: i < agencyStatuses.length - 1 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text }}>{a.name}</div>
                {a.note && <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 2 }}>{a.note}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ background: b.bg, border: `1px solid ${b.bdr}`, borderRadius: 3, color: b.color, fontFamily: MONO, fontSize: 9, padding: '2px 8px', letterSpacing: '0.5px' }}>
                  {a.status.toUpperCase()}
                </span>
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 4 }}>Updated: {a.updated}</div>
              </div>
            </div>
          )
        })}
      </div>

      {refreshed && (
        <div style={{ fontFamily: MONO, fontSize: 10, color: C.green }}>
          ✓ Status refreshed at {wst()} WST
        </div>
      )}

      {/* Overall status summary */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px', marginBottom: 12 }}>OVERALL CLEARANCE SUMMARY</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'CLEARED',      count: agencyStatuses.filter(a => a.status === 'Cleared').length,      color: C.green,    bg: C.greenBg,  bdr: C.greenBdr },
            { label: 'IN PROGRESS',  count: agencyStatuses.filter(a => a.status === 'Under Review').length, color: C.info,     bg: `${C.flagBlue}18`, bdr: C.border2 },
            { label: 'PENDING',      count: agencyStatuses.filter(a => a.status === 'Pending').length,      color: C.amber,    bg: C.amberBg,  bdr: C.amberBdr },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: 6, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: s.color, letterSpacing: '1px', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
