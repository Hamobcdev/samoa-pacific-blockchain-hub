import React, { useState } from 'react'
import { C, MONO, SANS } from '../constants'
import { AuditLog } from './AuditLog'
import { useClearanceStatus } from '../hooks/useClearanceStatus'
import { generateCertRef, generateISO20022Ref } from '../hooks/useOMWSubmission'
import { PortClearanceCert } from './maritime/PortClearanceCert'
import type { OMWAuthResult, AuditEntry } from '../types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function wst() {
  return new Date().toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })
}

function genRef(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`
}

function statusBadge(status: string) {
  const upper = status.toUpperCase()
  const map: Record<string, { bg: string; bdr: string; color: string }> = {
    CLEARED:              { bg: C.greenBg,        bdr: C.greenBdr,  color: C.green    },
    'FREE PRATIQUE':      { bg: C.greenBg,        bdr: C.greenBdr,  color: C.green    },
    PENDING:              { bg: C.amberBg,         bdr: C.amberBdr,  color: C.amber    },
    'UNDER REVIEW':       { bg: `${C.flagBlue}18`, bdr: C.border2,   color: C.info     },
    'ASYCUDA PROCESSING': { bg: `${C.purple}18`,   bdr: C.purpleBdr, color: C.purple   },
    FLAGGED:              { bg: C.critBg,          bdr: C.critBdr,   color: C.critical },
    HELD:                 { bg: C.critBg,          bdr: C.critBdr,   color: C.critical },
    'BERTH CONFIRMED':    { bg: C.greenBg,         bdr: C.greenBdr,  color: C.green    },
    'AWAITING MDH':       { bg: C.amberBg,         bdr: C.amberBdr,  color: C.amber    },
    'MDH SUBMITTED':      { bg: `${C.flagBlue}18`, bdr: C.border2,   color: C.info     },
  }
  const s = map[upper] ?? { bg: C.surface3, bdr: C.border, color: C.dim }
  return (
    <span style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: 3, color: s.color, fontFamily: MONO, fontSize: 9, padding: '2px 8px', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  )
}

function riskChip(risk: 'Low' | 'Medium' | 'High') {
  const map = {
    Low:    { color: C.green,    bg: C.greenBg,  bdr: C.greenBdr  },
    Medium: { color: C.amber,    bg: C.amberBg,  bdr: C.amberBdr  },
    High:   { color: C.critical, bg: C.critBg,   bdr: C.critBdr   },
  }
  const s = map[risk]
  return (
    <span style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: 3, color: s.color, fontFamily: MONO, fontSize: 9, padding: '2px 6px' }}>
      {risk}
    </span>
  )
}

function tableHead(cols: string[]) {
  return (
    <thead>
      <tr>
        {cols.map(h => (
          <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '8px 10px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', letterSpacing: '1px', background: C.surface2, whiteSpace: 'nowrap' }}>
            {h}
          </th>
        ))}
      </tr>
    </thead>
  )
}

function td(content: React.ReactNode, mono = false) {
  return (
    <td style={{ fontFamily: mono ? MONO : SANS, fontSize: mono ? 10 : 12, color: C.text, padding: '8px 10px', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>
      {content}
    </td>
  )
}

function tdMuted(content: React.ReactNode) {
  return <td style={{ fontFamily: MONO, fontSize: 10, color: C.muted, padding: '8px 10px', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{content}</td>
}

function actionBtn(label: string, onClick: () => void, variant: 'default' | 'green' | 'amber' | 'red' = 'default') {
  const styles = {
    default: { bg: C.surface3,   bdr: C.border2,   color: C.textOnDark },
    green:   { bg: C.greenBg,    bdr: C.greenBdr,  color: C.green    },
    amber:   { bg: C.amberBg,    bdr: C.amberBdr,  color: C.amber    },
    red:     { bg: C.critBg,     bdr: C.critBdr,   color: C.critical },
  }
  const s = styles[variant]
  return (
    <button
      onClick={onClick}
      style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: 4, color: s.color, cursor: 'pointer', fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: '0.5px', padding: '3px 10px', whiteSpace: 'nowrap' }}
    >
      {label}
    </button>
  )
}

type AgencyTab = 'queue' | 'reference'

function AgencyTabs({ active, onChange }: { active: AgencyTab; onChange: (t: AgencyTab) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: `1px solid ${C.border}` }}>
      {(['queue', 'reference'] as AgencyTab[]).map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            background:   active === t ? C.surface2 : 'none',
            border:       `1px solid ${active === t ? C.border2 : 'transparent'}`,
            borderBottom: active === t ? `2px solid ${C.amber}` : '2px solid transparent',
            borderRadius: '4px 4px 0 0',
            color:        active === t ? C.text : C.muted,
            cursor:       'pointer',
            fontFamily:   MONO,
            fontSize:     10,
            letterSpacing: '1px',
            marginBottom:  -1,
            padding:      '7px 16px',
            textTransform: 'uppercase',
          }}
        >
          {t === 'queue' ? 'CLEARANCE QUEUE' : 'REFERENCE DATA'}
        </button>
      ))}
    </div>
  )
}

// ── CUSTOMS ───────────────────────────────────────────────────────────────────

interface CustomsEntry {
  ref:        string
  vessel:     string
  imo:        string
  eta:        string
  cargoType:  string
  hsCode:     string
  asycudaRef: string
  status:     string
  wcoRisk:    'Low' | 'Medium' | 'High'
}

const CUSTOMS_QUEUE: CustomsEntry[] = [
  { ref: 'NOA-2026-0042', vessel: 'MV Pacific Star',    imo: '9234567', eta: '17/05 14:00', cargoType: 'General Cargo',    hsCode: '8471.30', asycudaRef: 'SAD-20265831',  status: 'ASYCUDA PROCESSING', wcoRisk: 'Low'    },
  { ref: 'NOA-2026-0039', vessel: 'MV Ofu Cargo',       imo: '8812345', eta: '18/05 09:00', cargoType: 'Bulk Grain',        hsCode: '1006.30', asycudaRef: 'SAD-20261247',  status: 'Pending',            wcoRisk: 'Low'    },
  { ref: 'NOA-2026-0041', vessel: 'MV Savaii Explorer', imo: '7654321', eta: '19/05 06:30', cargoType: 'Dangerous Goods',   hsCode: '2710.12', asycudaRef: 'SAD-20268819',  status: 'FLAGGED',            wcoRisk: 'High'   },
]

const TARIFF_CODES = [
  { hs: '0901.11', desc: 'Coffee, not roasted',             rate: '0%'    },
  { hs: '2203.00', desc: 'Beer of malt',                    rate: '75%'   },
  { hs: '2402.20', desc: 'Cigarettes containing tobacco',   rate: '150%'  },
  { hs: '8703.23', desc: 'Motor vehicles <3000cc',          rate: '15%'   },
  { hs: '8471.30', desc: 'Portable ADP machines (laptops)', rate: '0%'    },
  { hs: '6109.10', desc: 'T-shirts, cotton',                rate: '20%'   },
  { hs: '1006.30', desc: 'Semi-milled or wholly milled rice', rate: '0%'  },
  { hs: '0302.11', desc: 'Trout, fresh or chilled',         rate: '0%'    },
  { hs: '2710.12', desc: 'Motor spirit (petrol)',            rate: 'Excise' },
  { hs: '3004.90', desc: 'Medicaments, mixed or unmixed',   rate: '0%'    },
  { hs: '9403.20', desc: 'Metal furniture',                 rate: '15%'   },
  { hs: '8516.60', desc: 'Ovens, cookers, grillers',        rate: '15%'   },
  { hs: '6403.99', desc: 'Leather footwear',                rate: '20%'   },
  { hs: '0402.21', desc: 'Milk powder, unsweetened',        rate: '0%'    },
  { hs: '3401.11', desc: 'Soap, toilet',                    rate: '20%'   },
]

const PROHIBITED_GOODS = [
  'Narcotic drugs and psychotropic substances (UN Convention 1988)',
  'Firearms, ammunition and weapons without Ministry of Police permit',
  'CITES Appendix I species — live animals, parts or derivatives',
  'Obscene or objectionable publications, films or material',
  'Counterfeit currency or forged documents',
  'Ozone-depleting substances (Montreal Protocol)',
  'Hazardous wastes prohibited under Basel Convention',
  'Products of child labour (ILO Convention 182)',
]

function CustomsView({ addAudit }: { addAudit: (e: AuditEntry) => void }) {
  const [tab, setTab] = useState<AgencyTab>('queue')
  const [queue, setQueue] = useState<CustomsEntry[]>(CUSTOMS_QUEUE)

  function handleClear(entry: CustomsEntry) {
    const r = genRef('CUS')
    setQueue(prev => prev.map(q => q.ref === entry.ref ? { ...q, status: 'CLEARED' } : q))
    addAudit({ timestamp: wst(), form: 'Customs Clearance — ASYCUDA Assessment', reference: r, transmittedTo: 'Samoa Customs & Revenue — MOR', status: 'CLEARED' })
  }

  function handleHold(entry: CustomsEntry) {
    const r = genRef('CUS')
    setQueue(prev => prev.map(q => q.ref === entry.ref ? { ...q, status: 'HELD' } : q))
    addAudit({ timestamp: wst(), form: 'Customs Hold — Docs Required', reference: r, transmittedTo: 'Samoa Customs & Revenue — MOR', status: 'HELD' })
  }

  return (
    <>
      <AgencyTabs active={tab} onChange={setTab} />

      {tab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px' }}>
            VESSEL CLEARANCE QUEUE — {queue.length} ENTRIES · ASYCUDA WORLD
          </div>
          <div style={{ overflowX: 'auto', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {tableHead(['VESSEL', 'IMO', 'ETA', 'CARGO TYPE', 'HS CODE', 'ASYCUDA REF', 'STATUS', 'WCO RISK', 'ACTION'])}
              <tbody>
                {queue.map((q, i) => (
                  <tr key={q.ref} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                    {td(q.vessel)}
                    {tdMuted(q.imo)}
                    {tdMuted(q.eta)}
                    {td(q.cargoType)}
                    {td(<span style={{ fontFamily: MONO, fontSize: 10, color: C.gold }}>{q.hsCode}</span>)}
                    {tdMuted(q.asycudaRef)}
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>{statusBadge(q.status)}</td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>{riskChip(q.wcoRisk)}</td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>
                      {q.status !== 'CLEARED' && q.status !== 'HELD' && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {actionBtn('Clear', () => handleClear(q), 'green')}
                          {actionBtn('Hold', () => handleHold(q), 'red')}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 14px', fontFamily: MONO, fontSize: 9, color: C.dim }}>
            Phase 1: decisions logged in-memory. Phase 2: transmitted via ASYCUDA XML API → Samoa DPI Chain audit anchor.
          </div>
        </div>
      )}

      {tab === 'reference' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Tariff quick reference */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px' }}>
              TARIFF QUICK REFERENCE — WCO HS 2022 · SAMOA CUSTOMS TARIFF ACT 2016
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {tableHead(['HS CODE', 'DESCRIPTION', 'DUTY RATE'])}
                <tbody>
                  {TARIFF_CODES.map((t, i) => (
                    <tr key={t.hs} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                      <td style={{ fontFamily: MONO, fontSize: 10, color: C.gold, padding: '7px 10px', borderBottom: `1px solid ${C.border}` }}>{t.hs}</td>
                      {td(t.desc)}
                      <td style={{ padding: '7px 10px', borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ fontFamily: MONO, fontSize: 10, color: t.rate === '0%' ? C.green : t.rate === 'Excise' ? C.purple : t.rate >= '50%' ? C.critical : C.amber }}>
                          {t.rate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prohibited goods */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.critical, letterSpacing: '1.5px', marginBottom: 10 }}>
              PROHIBITED GOODS — CUSTOMS ACT 2014
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PROHIBITED_GOODS.map((g, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: C.critical, flexShrink: 0 }}>■</span>
                  <span style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Currency rates + ASYCUDA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px', marginBottom: 10 }}>EXCHANGE RATES — CBS</div>
              {[['1 NZD', '1.82 WST'], ['1 USD', '2.73 WST'], ['1 AUD', '1.78 WST'], ['1 EUR', '2.98 WST'], ['1 GBP', '3.42 WST']].map(([from, to]) => (
                <div key={from} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 11, padding: '4px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted }}>{from}</span>
                  <span style={{ color: C.gold }}>= {to}</span>
                </div>
              ))}
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 8 }}>Source: CBS indicative rates · cbs.gov.ws</div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.purple, letterSpacing: '1.5px', marginBottom: 10 }}>ASYCUDA WORLD</div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
                System: ASYCUDAWorld 4.3.2<br />
                Operator: Samoa MOR Customs<br />
                Access: customs.gov.ws (Phase 2)<br />
                Format: UN/EDIFACT CUSCAR<br />
                HS Nomenclature: WCO 2022<br />
                Risk Engine: WCO SAFE 2025
              </div>
            </div>
          </div>

          {/* CHANGE F — IMO GISIS (Customs) */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 16px' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px', marginBottom: 6 }}>IMO GISIS VESSEL LOOKUP</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.info }}>gisis.imo.org</div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, marginTop: 4 }}>Verify IMO numbers, vessel certificates, and flag state records before processing clearance.</div>
          </div>
        </div>
      )}
    </>
  )
}

// ── MAF ───────────────────────────────────────────────────────────────────────

interface MAFEntry {
  ref:             string
  vessel:          string
  imo:             string
  eta:             string
  lastPort:        string
  storesDeclared:  string
  status:          string
}

const MAF_QUEUE: MAFEntry[] = [
  { ref: 'NOA-2026-0042', vessel: 'MV Pacific Star',    imo: '9234567', eta: '17/05 14:00', lastPort: 'Auckland, NZ',   storesDeclared: 'Provisions only',      status: 'Pending'      },
  { ref: 'NOA-2026-0039', vessel: 'MV Ofu Cargo',       imo: '8812345', eta: '18/05 09:00', lastPort: 'Suva, Fiji',     storesDeclared: 'Grain — bulk cargo',   status: 'UNDER REVIEW' },
  { ref: 'NOA-2026-0041', vessel: 'MV Savaii Explorer', imo: '7654321', eta: '19/05 06:30', lastPort: 'Manila, PH',     storesDeclared: 'Agricultural equipment', status: 'FLAGGED'    },
]

const MAF_COUNTRY_RISK = [
  { country: 'Australia',     risk: 'Low',    note: 'Equivalent biosecurity standards' },
  { country: 'New Zealand',   risk: 'Low',    note: 'Equivalent biosecurity standards' },
  { country: 'Fiji',          risk: 'Medium', note: 'Monitor foot-and-mouth status' },
  { country: 'Indonesia',     risk: 'High',   note: 'African swine fever, FMD present' },
  { country: 'Philippines',   risk: 'Medium', note: 'FMD — certificates required' },
  { country: 'China',         risk: 'High',   note: 'Multiple pest/disease concerns' },
  { country: 'India',         risk: 'High',   note: 'FMD, Newcastle disease' },
  { country: 'USA',           risk: 'Low',    note: 'Pre-clearance arrangements' },
]

const MAF_PROHIBITED = [
  'Fresh fruit without valid phytosanitary certificate',
  'Soil or earth of any type or origin',
  'Live animals without import permit and health certificate',
  'Used agricultural equipment without treatment certificate',
  'Untreated timber or unprocessed wood products',
  'Plant material without phytosanitary certificate',
  'Meat and meat products without veterinary health certificate',
  'Honey and beeswax without import permit',
  'Live snails (all species)',
  'Feathers and feather products without treatment certificate',
]

function MAFView({ addAudit }: { addAudit: (e: AuditEntry) => void }) {
  const [tab, setTab] = useState<AgencyTab>('queue')
  const [queue, setQueue] = useState<MAFEntry[]>(MAF_QUEUE)

  function handle(entry: MAFEntry, action: 'clear' | 'inspect' | 'fumigate') {
    const prefix = action === 'clear' ? 'MAF' : action === 'inspect' ? 'MAF' : 'MAF'
    const r = genRef(prefix)
    const newStatus = action === 'clear' ? 'CLEARED' : action === 'inspect' ? 'UNDER REVIEW' : 'HELD'
    const formLabel = action === 'clear' ? 'MAF Biosecurity Clearance' : action === 'inspect' ? 'MAF Inspection Required' : 'MAF Fumigation Order'
    setQueue(prev => prev.map(q => q.ref === entry.ref ? { ...q, status: newStatus } : q))
    addAudit({ timestamp: wst(), form: formLabel, reference: r, transmittedTo: 'MAF Biosecurity Division', status: newStatus })
  }

  return (
    <>
      <AgencyTabs active={tab} onChange={setTab} />

      {tab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px' }}>
            BIOSECURITY INSPECTION QUEUE — {queue.length} ENTRIES
          </div>
          <div style={{ overflowX: 'auto', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {tableHead(['VESSEL', 'IMO', 'ETA', 'LAST PORT', 'STORES DECLARED', 'STATUS', 'ACTION'])}
              <tbody>
                {queue.map((q, i) => (
                  <tr key={q.ref} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                    {td(q.vessel)}
                    {tdMuted(q.imo)}
                    {tdMuted(q.eta)}
                    {td(q.lastPort)}
                    {td(q.storesDeclared)}
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>{statusBadge(q.status)}</td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>
                      {q.status !== 'CLEARED' && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {actionBtn('Clear',    () => handle(q, 'clear'),    'green')}
                          {actionBtn('Inspect',  () => handle(q, 'inspect'),  'amber')}
                          {actionBtn('Fumigate', () => handle(q, 'fumigate'), 'red')}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'reference' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Country risk */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px' }}>
              COUNTRY BIOSECURITY RISK RATINGS
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {tableHead(['COUNTRY', 'RISK LEVEL', 'NOTE'])}
              <tbody>
                {MAF_COUNTRY_RISK.map((r, i) => (
                  <tr key={r.country} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                    {td(r.country)}
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>
                      {riskChip(r.risk as 'Low' | 'Medium' | 'High')}
                    </td>
                    {td(r.note)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prohibited items */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.critical, letterSpacing: '1.5px', marginBottom: 10 }}>
              PROHIBITED ITEMS — BIOSECURITY ACT 2005
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {MAF_PROHIBITED.map((g, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontFamily: MONO, fontSize: 9, color: C.critical }}>■</span>
                  <span style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment methods + contacts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px', marginBottom: 10 }}>APPROVED TREATMENT METHODS</div>
              {[
                { method: 'Methyl Bromide',  spec: '21°C min · 24 hr exposure' },
                { method: 'Heat Treatment',  spec: '56°C core temp · 30 min' },
                { method: 'Cold Treatment',  spec: '2°C for 16 days continuous' },
              ].map(t => (
                <div key={t.method} style={{ marginBottom: 10 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: C.text }}>{t.method}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{t.spec}</div>
                </div>
              ))}
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 4 }}>
                Standard: ISPM 15 (FAO) · Codex Alimentarius
              </div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px', marginBottom: 10 }}>CONTACTS & REFERENCES</div>
              {[
                ['MAF Emergency Hotline', '+685 22-561'],
                ['Codex Alimentarius',    'codexalimentarius.org'],
                ['IPPC / ISPM Standards', 'ippc.int'],
                ['OIE / WOAH',            'woah.org'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 10, padding: '4px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted }}>{label}</span>
                  <span style={{ color: C.info }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── PORT HEALTH ───────────────────────────────────────────────────────────────

interface PHEntry {
  ref:            string
  vessel:         string
  imo:            string
  eta:            string
  crewCount:      number
  illnessReports: number
  mdhStatus:      string
  status:         string
}

const PH_QUEUE: PHEntry[] = [
  { ref: 'NOA-2026-0042', vessel: 'MV Pacific Star',    imo: '9234567', eta: '17/05 14:00', crewCount: 18, illnessReports: 0, mdhStatus: 'MDH SUBMITTED', status: 'Pending'      },
  { ref: 'NOA-2026-0039', vessel: 'MV Ofu Cargo',       imo: '8812345', eta: '18/05 09:00', crewCount: 12, illnessReports: 0, mdhStatus: 'MDH SUBMITTED', status: 'FREE PRATIQUE' },
  { ref: 'NOA-2026-0041', vessel: 'MV Savaii Explorer', imo: '7654321', eta: '19/05 06:30', crewCount: 9,  illnessReports: 1, mdhStatus: 'AWAITING MDH',  status: 'UNDER REVIEW' },
]

function PortHealthView({ addAudit }: { addAudit: (e: AuditEntry) => void }) {
  const [tab, setTab] = useState<AgencyTab>('queue')
  const [queue, setQueue] = useState<PHEntry[]>(PH_QUEUE)

  function handlePratique(entry: PHEntry) {
    const r = genRef('FP')
    setQueue(prev => prev.map(q => q.ref === entry.ref ? { ...q, status: 'FREE PRATIQUE' } : q))
    addAudit({ timestamp: wst(), form: 'Free Pratique — WHO IHR 2005', reference: r, transmittedTo: 'Port Health Officer — MOH', status: 'FREE PRATIQUE GRANTED' })
  }

  function handleInspect(entry: PHEntry) {
    const r = genRef('PH')
    setQueue(prev => prev.map(q => q.ref === entry.ref ? { ...q, status: 'UNDER REVIEW' } : q))
    addAudit({ timestamp: wst(), form: 'Port Health Inspection Required', reference: r, transmittedTo: 'Port Health Officer — MOH', status: 'INSPECTION REQUIRED' })
  }

  return (
    <>
      <AgencyTabs active={tab} onChange={setTab} />

      {tab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px' }}>
            PORT HEALTH SCREENING QUEUE — WHO IHR 2005
          </div>
          <div style={{ overflowX: 'auto', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {tableHead(['VESSEL', 'IMO', 'ETA', 'CREW', 'ILLNESS REPORTS', 'MDH STATUS', 'STATUS', 'ACTION'])}
              <tbody>
                {queue.map((q, i) => (
                  <tr key={q.ref} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                    {td(q.vessel)}
                    {tdMuted(q.imo)}
                    {tdMuted(q.eta)}
                    {tdMuted(String(q.crewCount))}
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: q.illnessReports > 0 ? C.critical : C.green }}>
                        {q.illnessReports > 0 ? `⚠ ${q.illnessReports}` : '✓ None'}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>{statusBadge(q.mdhStatus)}</td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>{statusBadge(q.status)}</td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>
                      {q.status !== 'FREE PRATIQUE' && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {q.illnessReports === 0 && q.mdhStatus === 'MDH SUBMITTED' &&
                            actionBtn('Grant Pratique', () => handlePratique(q), 'green')}
                          {actionBtn('Inspect', () => handleInspect(q), 'amber')}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'reference' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* WHO alert status */}
          <div style={{ background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: '10px 16px' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.green, letterSpacing: '1.5px', marginBottom: 4 }}>WHO GLOBAL ALERT STATUS</div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.green, fontWeight: 600 }}>
              No active WHO Public Health Emergency of International Concern (PHEIC) — May 2026
            </div>
          </div>

          {/* Vaccine cert requirements */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px' }}>
              VACCINATION CERTIFICATE REQUIREMENTS BY REGION
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {tableHead(['REGION / ORIGIN', 'YELLOW FEVER', 'OTHER REQUIREMENTS'])}
              <tbody>
                {[
                  ['Pacific Islands',            'Not required',          'Standard WHO IHR screening'],
                  ['Sub-Saharan Africa',          'Required',              'Valid ICV certificate mandatory'],
                  ['South America (endemic)',     'Required',              'Valid ICV certificate mandatory'],
                  ['Southeast Asia',              'Not required',          'Cholera awareness — monitor'],
                  ['Middle East (Hajj season)',   'Not required',          'Meningococcal ACWY certificate'],
                  ['All regions',                 '—',                     'COVID: follow current WHO guidance'],
                ].map(([region, yf, other], i) => (
                  <tr key={region} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                    {td(region)}
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: yf === 'Required' ? C.critical : C.green }}>
                        {yf}
                      </span>
                    </td>
                    {td(other)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Free pratique conditions + contacts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px', marginBottom: 10 }}>
                FREE PRATIQUE CONDITIONS — WHO IHR 2005
              </div>
              {[
                'No cases of illness on board (or resolved with isolation)',
                'Valid deratisation / deratisation exemption certificate',
                'Maritime Declaration of Health submitted and assessed',
                'No reportable conditions under IHR Annex 2',
                'Crew vaccination records verified (yellow fever where applicable)',
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: C.green, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>{c}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px', marginBottom: 10 }}>CONTACTS</div>
              {[
                ['Port Health Office', '+685 21-212'],
                ['24hr Emergency', '+685 777-0000'],
                ['Medical Officer of Health', '+685 21-212 ext 3'],
                ['WHO Pacific', 'who.int/westernpacific'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 10, padding: '5px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted }}>{label}</span>
                  <span style={{ color: C.info }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── SPA ───────────────────────────────────────────────────────────────────────

interface SPAEntry {
  ref:           string
  vessel:        string
  imo:           string
  loa:           number
  eta:           string
  berthAssigned: string
  dues:          string
  status:        string
}

const SPA_QUEUE_INIT: SPAEntry[] = [
  { ref: 'NOA-2026-0042', vessel: 'MV Pacific Star',    imo: '9234567', loa: 142.5, eta: '17/05 14:00', berthAssigned: 'Berth 1',  dues: '15,687.00', status: 'BERTH CONFIRMED' },
  { ref: 'NOA-2026-0039', vessel: 'MV Ofu Cargo',       imo: '8812345', loa: 112.0, eta: '18/05 09:00', berthAssigned: '—',         dues: '10,332.00', status: 'Pending'        },
  { ref: 'NOA-2026-0041', vessel: 'MV Savaii Explorer', imo: '7654321', loa: 98.5,  eta: '19/05 06:30', berthAssigned: 'Berth 3',  dues: '8,568.00',  status: 'UNDER REVIEW'   },
]

const BERTH_OPTIONS = [
  { id: 'B1', label: 'Berth 1 — 180m LOA · 9m draft · General cargo' },
  { id: 'B2', label: 'Berth 2 — 120m LOA · 7m draft · Container/Ro-Ro' },
  { id: 'B3', label: 'Berth 3 — 80m LOA · 5m draft · Small vessels' },
  { id: 'AN', label: 'Anchorage — All vessel types' },
]

function SPAView({ addAudit }: { addAudit: (e: AuditEntry) => void }) {
  const [tab, setTab] = useState<AgencyTab>('queue')
  const [queue, setQueue] = useState<SPAEntry[]>(SPA_QUEUE_INIT)
  const [assignModal, setAssignModal] = useState<SPAEntry | null>(null)
  const [selectedBerth, setSelectedBerth] = useState('B1')
  const [portClearedRef, setPortClearedRef] = useState<Record<string, string>>({}) // vesselRef → certRef
  const [showCert, setShowCert] = useState<string | null>(null)

  // Check clearance record for MV Ofu Cargo (NOA-2026-0039) — the demo PORT CLEARED vessel
  const { record: ofuRecord } = useClearanceStatus('NOA-2026-0039')
  const AGENCY_CODES = ['customs', 'maf', 'portHealth', 'portAuth'] as const
  const ofuAllCleared = AGENCY_CODES.every(c => {
    const ms = ofuRecord.ministryStatuses.find(s => s.code === c)
    return ms?.status === 'CLEARED'
  })

  function issuePortClearance(entry: SPAEntry) {
    const certRef = generateCertRef()
    const r       = generateISO20022Ref(entry.imo)
    setPortClearedRef(prev => ({ ...prev, [entry.ref]: certRef }))
    setQueue(prev => prev.map(q => q.ref === entry.ref ? { ...q, status: 'PORT CLEARED' } : q))
    addAudit({ timestamp: wst(), form: 'Port Clearance Certificate Issued', reference: certRef, transmittedTo: 'SPA Port Authority · Vessel Agent · All Agencies', status: `PORT CLEARED — ${entry.vessel}` })
    void r
  }

  function confirmAssign() {
    if (!assignModal) return
    const r = genRef('BR')
    const berthLabel = BERTH_OPTIONS.find(b => b.id === selectedBerth)?.label.split(' — ')[0] ?? 'Berth'
    setQueue(prev => prev.map(q => q.ref === assignModal.ref ? { ...q, berthAssigned: berthLabel, status: 'BERTH CONFIRMED' } : q))
    setAssignModal(null)
    addAudit({ timestamp: wst(), form: 'Berth Assignment — SPA Port Operations', reference: r, transmittedTo: 'SPA Port Authority · Vessel Agent', status: `BERTH CONFIRMED — ${berthLabel}` })
  }

  return (
    <>
      <AgencyTabs active={tab} onChange={setTab} />

      {tab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px' }}>
            VESSEL ARRIVALS QUEUE — APIA PORT OPERATIONS
          </div>
          <div style={{ overflowX: 'auto', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {tableHead(['VESSEL', 'IMO', 'LOA (M)', 'ETA', 'BERTH ASSIGNED', 'DUES (WST)', 'STATUS', 'ACTION'])}
              <tbody>
                {queue.map((q, i) => (
                  <tr key={q.ref} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                    {td(q.vessel)}
                    {tdMuted(q.imo)}
                    {tdMuted(String(q.loa))}
                    {tdMuted(q.eta)}
                    {tdMuted(q.berthAssigned)}
                    <td style={{ fontFamily: MONO, fontSize: 10, color: C.gold, padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>{q.dues}</td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>{statusBadge(q.status)}</td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {q.status !== 'BERTH CONFIRMED' && q.status !== 'PORT CLEARED' && actionBtn('Assign Berth', () => { setAssignModal(q); setSelectedBerth('B1') }, 'default')}
                        {q.status === 'BERTH CONFIRMED' && !portClearedRef[q.ref] && (q.ref === 'NOA-2026-0039' ? ofuAllCleared : false) && (
                          <button
                            onClick={() => issuePortClearance(q)}
                            style={{ background: C.green, border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.5px', padding: '4px 10px', whiteSpace: 'nowrap' }}
                          >
                            Issue Port Clearance
                          </button>
                        )}
                        {portClearedRef[q.ref] && (
                          <button
                            onClick={() => setShowCert(showCert === q.ref ? null : q.ref)}
                            style={{ background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 4, color: C.green, cursor: 'pointer', fontFamily: MONO, fontSize: 9, letterSpacing: '0.5px', padding: '4px 10px', whiteSpace: 'nowrap' }}
                          >
                            {showCert === q.ref ? 'Hide Cert' : 'View Certificate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PORT CLEARED banner + certificate */}
          {Object.keys(portClearedRef).length > 0 && (
            <div style={{ background: C.green, borderRadius: 8, padding: '16px 20px' }}>
              <div style={{ fontFamily: MONO, fontSize: 12, color: '#fff', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 4 }}>
                PORT CLEARED — UA FAASAOLOTO I LE UAFU
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>
                {Object.entries(portClearedRef).map(([ref, cert]) => (
                  <div key={ref}>{ref} · Certificate: {cert} · {wst()}</div>
                ))}
              </div>
            </div>
          )}

          {/* Inline certificate view */}
          {showCert && portClearedRef[showCert] && (() => {
            const entry = queue.find(q => q.ref === showCert)
            if (!entry) return null
            const fakeTx = `0x${showCert.replace(/\W/g,'').padEnd(40,'0')}`
            return (
              <PortClearanceCert
                certRef={portClearedRef[showCert]}
                txHash={fakeTx}
                payRef={generateISO20022Ref(entry.imo)}
                vesselName={entry.vessel}
                imoNumber={entry.imo}
                flagState="WS"
                masterName="Captain"
                clearances={[
                  { label: 'Customs & Revenue Authority', at: wst() },
                  { label: 'MAF Biosecurity',             at: wst() },
                  { label: 'Port Health — MOH',            at: wst() },
                  { label: 'Samoa Port Authority',         at: wst() },
                ]}
                duesAmount={entry.dues}
              />
            )
          })()}

          {/* Berth assignment modal */}
          {assignModal && (
            <div style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 8, padding: 20 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '2px', marginBottom: 12 }}>
                ASSIGN BERTH — {assignModal.vessel} (LOA {assignModal.loa}m)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {BERTH_OPTIONS.map(b => (
                  <label key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', background: selectedBerth === b.id ? `${C.flagBlue}22` : 'transparent', borderRadius: 4, border: `1px solid ${selectedBerth === b.id ? C.border2 : 'transparent'}` }}>
                    <input
                      type="radio"
                      name="berth"
                      value={b.id}
                      checked={selectedBerth === b.id}
                      onChange={() => setSelectedBerth(b.id)}
                      style={{ accentColor: C.flagBlue }}
                    />
                    <span style={{ fontFamily: MONO, fontSize: 11, color: selectedBerth === b.id ? C.text : C.muted }}>{b.label}</span>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {actionBtn('Confirm Assignment', confirmAssign, 'green')}
                {actionBtn('Cancel', () => setAssignModal(null))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'reference' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Port charges */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px' }}>
              PORT CHARGES SCHEDULE — SPA TARIFF
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {tableHead(['SERVICE', 'RATE', 'NOTE'])}
              <tbody>
                {[
                  ['Berth dues',              'WST 0.50 / GT / 24hr',    'Minimum WST 500 per call'],
                  ['Pilotage (compulsory >500 GT)', 'WST 800 / movement', 'Compulsory for all vessels >500 GT'],
                  ['Towage',                  'WST 1,200 / movement',    'Per tug engagement'],
                  ['Mooring / unmooring',     'WST 150 / movement',      'Per mooring gang call'],
                  ['Waste reception',         'WST 200 / call',          'MARPOL Annex V compliance'],
                ].map(([svc, rate, note], i) => (
                  <tr key={svc} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                    {td(svc)}
                    <td style={{ fontFamily: MONO, fontSize: 10, color: C.gold, padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>{rate}</td>
                    {tdMuted(note)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Berth specs + VHF */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px' }}>
                BERTH SPECIFICATIONS
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {tableHead(['BERTH', 'MAX LOA', 'MAX DRAFT', 'TYPE'])}
                <tbody>
                  {[
                    ['Berth 1', '180m', '9.0m', 'General cargo'],
                    ['Berth 2', '120m', '7.0m', 'Container/Ro-Ro'],
                    ['Berth 3', '80m',  '5.0m', 'Small vessels'],
                    ['Anchorage', '—', '—',     'All types'],
                  ].map(([b, loa, draft, type], i) => (
                    <tr key={b} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                      {td(b, true)}
                      {tdMuted(loa)}
                      {tdMuted(draft)}
                      {td(type)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px', marginBottom: 10 }}>VHF RADIO DIRECTORY</div>
              {[
                ['Port Control',    'Ch 16 (calling) / Ch 12 (working)'],
                ['Pilots',          'Ch 14'],
                ['Harbour Master',  'Ch 16'],
                ['Vessel Traffic',  'Ch 12'],
              ].map(([station, freq]) => (
                <div key={station} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 10, padding: '5px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted }}>{station}</span>
                  <span style={{ color: C.info }}>{freq}</span>
                </div>
              ))}
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px', marginTop: 14, marginBottom: 8 }}>EXTERNAL RESOURCES</div>
              {[
                ['IMO GISIS vessel lookup', 'gisis.imo.org'],
                ['Notices to Mariners',     'sps.ws/notices (Phase 2)'],
                ['Tokyo MOU PSC',           'tokyo-mou.org'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 10, padding: '4px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted }}>{label}</span>
                  <span style={{ color: C.dim }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PSC inspection */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px', marginBottom: 10 }}>
              PSC INSPECTION REFERENCE — TOKYO MOU
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginBottom: 6 }}>CERTIFICATES TO VERIFY</div>
                {['Class certificates (Flag State)', 'Safety Equipment Certificate', 'MARPOL (I, II, V, VI)', 'ISM Code — Safety Management Certificate', 'ISPS Code — ISSC', 'MLC 2006 — DMLC Parts I & II'].map((c, i) => (
                  <div key={i} style={{ fontFamily: SANS, fontSize: 12, color: C.muted, padding: '3px 0' }}>• {c}</div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginBottom: 6 }}>DETENTION THRESHOLDS</div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
                  3 or more deficiencies → refer to PSC Officer<br />
                  1 critical deficiency → immediate detention consideration<br />
                  Class suspension → detention mandatory<br />
                  <br />
                  <span style={{ color: C.dim, fontFamily: MONO, fontSize: 9 }}>Ref: Tokyo MOU Annual Report 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* CHANGE E — Tokyo MOU PSC checklist table */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px' }}>TOKYO MOU — PORT STATE CONTROL INSPECTION</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 2 }}>Tokyo MOU on Port State Control — Pacific Region</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {tableHead(['CERTIFICATE', 'VALID PERIOD', 'DETENTION IF MISSING'])}
                <tbody>
                  {[
                    ['Class Certificate',              'Annual survey',   'Yes — critical'],
                    ['Safety Equipment Certificate',   '5 years',        'Yes — critical'],
                    ['MARPOL (IOPP Certificate)',       '5 years',        'Yes — critical'],
                    ['ISM (SMC Certificate)',           '5 years',        'Yes — critical'],
                    ['ISPS (ISSC Certificate)',         '5 years',        'Yes — critical'],
                    ['MLC 2006 (DMLC)',                '5 years',        'Yes — critical'],
                    ['Tonnage Certificate',            'Permanent',      'No — advisory'],
                  ].map(([cert, period, detention], i) => (
                    <tr key={cert} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                      {td(cert)}
                      {tdMuted(period)}
                      <td style={{ fontFamily: MONO, fontSize: 10, padding: '8px 10px', borderBottom: `1px solid ${C.border}`, color: detention.startsWith('Yes') ? C.critical : C.muted, whiteSpace: 'nowrap' }}>
                        {detention}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '10px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>Detention threshold: 3 or more deficiencies, or 1 critical deficiency. Source: Tokyo MOU Annual Report 2024</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>Tokyo MOU: tokyomou.org</div>
            </div>
          </div>

          {/* CHANGE F — IMO GISIS (SPA) */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 16px' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '1.5px', marginBottom: 6 }}>IMO GISIS VESSEL LOOKUP</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.info }}>gisis.imo.org</div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, marginTop: 4 }}>Cross-check vessel IMO number and class certificates before berth assignment.</div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  session: OMWAuthResult
}

export function GovOfficerDashboard({ session }: Props) {
  const [audit, setAudit] = useState<AuditEntry[]>([])

  function addAudit(entry: AuditEntry) {
    setAudit(prev => [entry, ...prev])
  }

  const agency = session.agency ?? 'CUSTOMS'

  const agencyMeta: Record<string, { label: string; color: string; subtitle: string }> = {
    CUSTOMS:     { label: 'Customs Officer — MOR',       color: C.amber, subtitle: 'Ministry of Revenue — Customs & Excise Division' },
    MAF:         { label: 'MAF Biosecurity Officer',     color: C.green, subtitle: 'Ministry of Agriculture & Fisheries — Biosecurity Division' },
    PORT_HEALTH: { label: 'Port Health Officer — MOH',  color: C.info,  subtitle: 'Ministry of Health — Port Health Division' },
    SPA:         { label: 'SPA Port Operations Officer', color: C.gold,  subtitle: 'Samoa Ports Authority' },
  }

  const meta = agencyMeta[agency] ?? agencyMeta['CUSTOMS']

  return (
    <div style={{ fontFamily: SANS, color: C.text }}>
      {/* Role header */}
      <div style={{ background: C.surface, border: `1px solid ${C.amberBdr}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.amber, letterSpacing: '2px', marginBottom: 4 }}>
          ZONE 2 — RESTRICTED OFFICIAL
        </div>
        <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, color: C.text }}>
          {session.label}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: meta.color, marginTop: 2 }}>
          {meta.subtitle}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 4 }}>
          Auth: {new Date(session.authedAt).toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })} WST
        </div>
      </div>

      {/* Agency-specific content */}
      {agency === 'CUSTOMS'     && <CustomsView     addAudit={addAudit} />}
      {agency === 'MAF'         && <MAFView          addAudit={addAudit} />}
      {agency === 'PORT_HEALTH' && <PortHealthView   addAudit={addAudit} />}
      {agency === 'SPA'         && <SPAView          addAudit={addAudit} />}

      <AuditLog entries={audit} />
    </div>
  )
}
