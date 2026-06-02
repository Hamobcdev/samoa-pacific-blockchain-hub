import React, { useState, useCallback } from 'react'
import { C, MONO, SANS, VESSEL_TYPES } from '../constants'
import type { VesselTypeId } from '../constants'
import { AuditLog } from './AuditLog'
import type { OMWAuthResult, AuditEntry } from '../types'

// ── Helpers ──────────────────────────────────────────────────────────────────

function wst() {
  return new Date().toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })
}

function ref(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`
}

function fld(label: string, value: string, onChange: (v: string) => void, opts?: { type?: string; placeholder?: string; readOnly?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>{label}</label>
      <input
        type={opts?.type ?? 'text'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={opts?.placeholder}
        readOnly={opts?.readOnly}
        style={{ background: opts?.readOnly ? C.surface : C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: opts?.readOnly ? C.muted : C.text, fontFamily: MONO, fontSize: 12, padding: '8px 10px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
      />
    </div>
  )
}

function sel(label: string, value: string, onChange: (v: string) => void, options: string[]) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '8px 10px', outline: 'none' }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function submitBtn(label: string, onClick: () => void) {
  return (
    <button onClick={onClick} style={{ background: C.flagBlue, border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '1px', padding: '10px 18px', marginTop: 8, alignSelf: 'flex-start' }}>
      {label}
    </button>
  )
}

function confirmation(lines: string[]) {
  return (
    <div style={{ background: `${C.green}10`, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: '12px 16px', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lines.map((l, i) => <div key={i} style={{ fontFamily: MONO, fontSize: 11, color: i === 0 ? C.green : C.muted }}>{l}</div>)}
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

// ── Agency clearance statuses ─────────────────────────────────────────────────

type AgencyStatusVal = 'Pending' | 'Under Review' | 'Cleared' | 'Stub'

interface AgencyStatus { code: string; name: string; status: AgencyStatusVal; note?: string; updated: string }

const INITIAL_STATUSES: AgencyStatus[] = [
  { code: 'SPA',        name: 'SPA Port Authority',  status: 'Pending',           updated: '—' },
  { code: 'CUSTOMS',    name: 'Customs (MOR)',        status: 'Pending',           updated: '—' },
  { code: 'MAF',        name: 'MAF Biosecurity',      status: 'Pending',           updated: '—' },
  { code: 'PORT_HEALTH',name: 'Port Health',          status: 'Pending',           updated: '—' },
  { code: 'IMMIG',      name: 'Immigration',          status: 'Stub',              note: 'Portal Pending', updated: '—' },
]

// ── Collapsible sub-form wrapper ──────────────────────────────────────────────

function Collapsible({ title, standard, children, defaultOpen }: { title: string; standard: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background: C.surface2, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', width: '100%', textAlign: 'left' }}>
        <div>
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.text, fontWeight: 600 }}>{title}</span>
          <span style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginLeft: 10 }}>{standard}</span>
        </div>
        <span style={{ color: C.muted, fontFamily: MONO, fontSize: 11 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div style={{ padding: 16 }}>{children}</div>}
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  session: OMWAuthResult
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ShippingAgentDashboard({ session }: Props) {
  const [tab, setTab] = useState<'pre-arrival' | 'declarations' | 'clearance' | 'departure'>('pre-arrival')
  const [audit, setAudit] = useState<AuditEntry[]>([])
  const [statuses, setStatuses] = useState<AgencyStatus[]>(INITIAL_STATUSES)
  const [refreshCount, setRefreshCount] = useState(0)
  const [vesselTypeId, setVesselTypeId] = useState<VesselTypeId>('CARGO')

  // submitted state per form
  const [submitted, setSubmitted] = useState({ fal1: false, fal2: false, fal3: false, fal4: false, fal5: false, fal7: false, mdh: false, dc: false })
  const [refs, setRefs] = useState({ fal1: '', fal2: '', fal3: '', fal5: '', dc: '' })
  const [crewCount, setCrewCount] = useState(0)
  const [hasDG, setHasDG] = useState(false)
  const [vesselData, setVesselData] = useState({ vesselName: '', imoNumber: '', masterName: '', flagState: '', crewCount: 0, callSign: '', locked: false })

  const addAudit = useCallback((entry: AuditEntry) => {
    setAudit(a => [entry, ...a])
  }, [])

  function markSubmitted(key: keyof typeof submitted, refVal: string, refKey?: keyof typeof refs) {
    setSubmitted(s => ({ ...s, [key]: true }))
    if (refKey) setRefs(r => ({ ...r, [refKey]: refVal }))
  }

  const tabs: Array<{ id: typeof tab; label: string }> = [
    { id: 'pre-arrival',  label: 'PRE-ARRIVAL' },
    { id: 'declarations', label: 'DECLARATIONS' },
    { id: 'clearance',    label: 'CLEARANCE STATUS' },
    { id: 'departure',    label: 'DEPARTURE' },
  ]

  function refreshStatuses() {
    const n = refreshCount + 1
    setRefreshCount(n)
    if (audit.length > 0 && n >= 1) {
      setStatuses(prev => prev.map((s, i) => {
        if (s.code === 'IMMIG') return s
        if (i <= 1) return { ...s, status: 'Under Review' as AgencyStatusVal, updated: wst() }
        return s
      }))
    }
  }

  // ── PRE-ARRIVAL TAB ───────────────────────────────────────────────────────

  function PreArrivalTab() {
    const [f, setF] = useState({
      vesselName: '', imoNumber: '', callSign: '', flagState: '',
      vesselType: 'General Cargo', grossTonnage: '', netTonnage: '',
      masterName: '', portOfArrival: 'Apia, Independent State of Samoa',
      eta: '', lastPort: '', nextPort: '', purpose: 'Commercial',
    })
    const [timelineOpen, setTimelineOpen] = useState(false)
    const [ispsLevel, setIspsLevel] = useState<'1' | '2' | '3'>('1')
    const [portsCalled, setPortsCalled] = useState([
      { port: '', country: '', ispsLevel: '', departure: '' },
      { port: '', country: '', ispsLevel: '', departure: '' },
    ])

    function handleSubmit() {
      if (!f.vesselName || !f.imoNumber) return
      const r = ref('OMW')
      markSubmitted('fal1', r, 'fal1')
      setVesselData({ vesselName: f.vesselName, imoNumber: f.imoNumber, masterName: f.masterName, flagState: f.flagState, crewCount: 0, callSign: f.callSign, locked: true })
      addAudit({ timestamp: wst(), form: 'FAL Form 1 — General Declaration', reference: r, transmittedTo: 'SPA · Customs · MAF · Port Health', status: 'Submitted' })
    }

    const timelineRows: Array<{ window: string; form: string; key: keyof typeof submitted }> = [
      { window: '72 hours before arrival',    form: 'FAL 1 — General Declaration',         key: 'fal1' },
      { window: '72 hours before arrival',    form: 'FAL 2 — Cargo Declaration',            key: 'fal2' },
      { window: '24 hours before arrival',    form: "FAL 3 — Ship's Stores Declaration",    key: 'fal3' },
      { window: '24 hours before arrival',    form: "FAL 4 — Crew's Effects Declaration",   key: 'fal4' },
      { window: '24 hours before arrival',    form: 'FAL 5 — Crew List',                    key: 'fal5' },
      { window: '24 hours before arrival',    form: 'MDH — Maritime Declaration of Health', key: 'mdh'  },
      { window: 'On arrival (if applicable)', form: 'FAL 7 — Dangerous Goods',             key: 'fal7' },
    ]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 680 }}>

        {/* CHANGE B — IMO FAL Submission Timeline */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
          <button onClick={() => setTimelineOpen(o => !o)}
            style={{ background: C.surface2, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', width: '100%', textAlign: 'left' }}>
            <div>
              <span style={{ fontFamily: MONO, fontSize: 11, color: C.gold, fontWeight: 600, letterSpacing: '1px' }}>IMO FAL SUBMISSION TIMELINE</span>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 2 }}>IMO FAL Convention 2024 — Required submission windows</div>
            </div>
            <span style={{ color: C.muted, fontFamily: MONO, fontSize: 11 }}>{timelineOpen ? '▲' : '▼'}</span>
          </button>
          {timelineOpen && (
            <div style={{ padding: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['Window', 'Forms Required', 'Status'].map(h => (
                    <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '6px 10px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', letterSpacing: '1px' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {timelineRows.map((row, i) => {
                    const done = submitted[row.key]
                    const r = row.key === 'fal1' ? refs.fal1 : row.key === 'fal5' ? refs.fal5 : ''
                    return (
                      <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                        <td style={{ fontFamily: MONO, fontSize: 10, color: C.dim, padding: '7px 10px', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{row.window}</td>
                        <td style={{ fontFamily: SANS, fontSize: 12, color: C.text, padding: '7px 10px', borderBottom: `1px solid ${C.border}` }}>{row.form}</td>
                        <td style={{ fontFamily: MONO, fontSize: 10, padding: '7px 10px', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap', color: done ? C.green : C.muted }}>
                          {done ? `✓ Submitted${r ? ` — ${r}` : ''}` : '○ Pending'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Vessel type selector */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '14px 16px' }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>VESSEL TYPE</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {VESSEL_TYPES.map(vt => (
              <button key={vt.id} onClick={() => setVesselTypeId(vt.id as VesselTypeId)}
                style={{ background: vesselTypeId === vt.id ? C.flagBlue : C.surface2, border: `1px solid ${vesselTypeId === vt.id ? C.flagBlue : C.border}`, borderRadius: 4, color: vesselTypeId === vt.id ? '#fff' : C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 10, padding: '7px 14px', transition: 'all 0.12s' }}>
                {vt.label}
              </button>
            ))}
          </div>
        </div>

        {/* CRUISE: FAL 6 + STA notification */}
        {vesselTypeId === 'CRUISE' && (
          <div style={{ border: `2px solid ${C.flagBlue}50`, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ background: `${C.flagBlue}18`, borderBottom: `1px solid ${C.flagBlue}30`, padding: '10px 14px' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: C.info, fontWeight: 700, letterSpacing: '1px' }}>CRUISE / PASSENGER VESSEL — ADDITIONAL REQUIREMENTS</div>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ background: `${C.flagBlue}25`, border: `1px solid ${C.flagBlue}50`, borderRadius: 3, fontFamily: MONO, fontSize: 9, color: C.info, padding: '2px 8px', whiteSpace: 'nowrap', marginTop: 2 }}>FAL 6 REQUIRED</span>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                  <strong style={{ color: C.text }}>FAL Form 6 — Passenger List</strong> is mandatory for all passenger vessels.
                  Submit the full passenger manifest in the Declarations tab (FAL Forms section) at least 24 hours before arrival.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ background: `${C.amber}18`, border: `1px solid ${C.amberBdr}`, borderRadius: 3, fontFamily: MONO, fontSize: 9, color: C.amber, padding: '2px 8px', whiteSpace: 'nowrap', marginTop: 2 }}>STA NOTICE</span>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                  <strong style={{ color: C.text }}>Samoa Tourism Authority notification required.</strong> The STA must be notified of cruise vessel arrivals
                  at least 72 hours in advance to coordinate shore excursion operators and tourism services.
                  A copy of the passenger manifest is automatically forwarded to STA on FAL 6 submission.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TANKER: Declaration panel */}
        {vesselTypeId === 'TANKER' && (
          <div style={{ border: `1px solid ${C.amberBdr}`, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ background: `${C.amber}12`, borderBottom: `1px solid ${C.amberBdr}`, padding: '10px 14px' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: C.amber, fontWeight: 700, letterSpacing: '1px' }}>TANKER / BULK CARRIER — ADDITIONAL DECLARATIONS</div>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                Tankers and bulk carriers are subject to additional Samoa Port Authority requirements:
              </div>
              {[
                'MARPOL Annex I — Oil Record Book to be available for inspection on arrival',
                'Cargo Information — MSDS / SDS sheets required for all liquid bulk cargo',
                'SOPEP (Shipboard Oil Pollution Emergency Plan) to be on board',
                'Dangerous Goods notification (FAL 7) required if carrying Class 3 or above',
                'SPA Harbour Master may require pre-arrival safety conference for tankers >5,000 GT',
              ].map((item, i) => (
                <div key={i} style={{ fontFamily: SANS, fontSize: 12, color: C.dim, display: 'flex', gap: 8 }}>
                  <span style={{ color: C.amber, flexShrink: 0 }}>›</span> {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {sectionHead('FAL Form 1 — General Declaration', 'IMO FAL Convention 2024 · Standard General Declaration')}

        {grid2([
          fld('Vessel Name', f.vesselName, v => setF(x => ({ ...x, vesselName: v }))),
          fld('IMO Number', f.imoNumber, v => setF(x => ({ ...x, imoNumber: v })), { placeholder: 'IMO1234567' }),
          fld('Call Sign', f.callSign, v => setF(x => ({ ...x, callSign: v }))),
          fld('Flag State', f.flagState, v => setF(x => ({ ...x, flagState: v }))),
        ])}

        {sel('Vessel Type', f.vesselType, v => setF(x => ({ ...x, vesselType: v })),
          ['General Cargo', 'Bulk Carrier', 'Container', 'Tanker', 'Ro-Ro', 'Other'])}

        {grid2([
          fld('Gross Tonnage', f.grossTonnage, v => setF(x => ({ ...x, grossTonnage: v })), { type: 'number' }),
          fld('Net Tonnage', f.netTonnage, v => setF(x => ({ ...x, netTonnage: v })), { type: 'number' }),
          fld("Master's Name", f.masterName, v => setF(x => ({ ...x, masterName: v }))),
          fld('Port of Arrival', f.portOfArrival, v => setF(x => ({ ...x, portOfArrival: v })), { readOnly: true }),
          fld('Expected Date/Time of Arrival', f.eta, v => setF(x => ({ ...x, eta: v })), { type: 'datetime-local' }),
          fld('Last Port of Call', f.lastPort, v => setF(x => ({ ...x, lastPort: v }))),
          fld('Next Port of Call (optional)', f.nextPort, v => setF(x => ({ ...x, nextPort: v }))),
        ])}

        {sel('Purpose of Call', f.purpose, v => setF(x => ({ ...x, purpose: v })),
          ['Commercial', 'Bunkering', 'Crew Change', 'Emergency', 'Other'])}

        {/* CHANGE C — ISPS Security Declaration */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.gold, letterSpacing: '2px', textTransform: 'uppercase' }}>ISPS SECURITY DECLARATION</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginTop: 2 }}>International Ship and Port Facility Security Code — Mandatory pre-arrival notification</div>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 6 }}>ISPS SECURITY LEVEL</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {(['1', '2', '3'] as const).map(lvl => (
                <label key={lvl} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: ispsLevel === lvl ? C.text : C.muted }}>
                  <input type="radio" name="ispsLevel" value={lvl} checked={ispsLevel === lvl} onChange={() => setIspsLevel(lvl)} style={{ accentColor: C.amber }} />
                  {lvl === '1' ? 'Level 1 (Normal)' : lvl === '2' ? 'Level 2 (Heightened)' : 'Level 3 (Exceptional)'}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 6 }}>LAST 10 PORTS OF CALL</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr>{['Port Name', 'Country', 'ISPS Level at Port', 'Date of Departure'].map(h => (
                    <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '4px 8px', borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {portsCalled.map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: 4 }}><input value={row.port} onChange={e => { const n=[...portsCalled]; n[i]={...n[i],port:e.target.value}; setPortsCalled(n) }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: '100%', boxSizing: 'border-box' }} /></td>
                      <td style={{ padding: 4 }}><input value={row.country} onChange={e => { const n=[...portsCalled]; n[i]={...n[i],country:e.target.value}; setPortsCalled(n) }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: '100%', boxSizing: 'border-box' }} /></td>
                      <td style={{ padding: 4 }}><input value={row.ispsLevel} onChange={e => { const n=[...portsCalled]; n[i]={...n[i],ispsLevel:e.target.value}; setPortsCalled(n) }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: 80 }} /></td>
                      <td style={{ padding: 4 }}><input type="date" value={row.departure} onChange={e => { const n=[...portsCalled]; n[i]={...n[i],departure:e.target.value}; setPortsCalled(n) }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: 130 }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button onClick={() => setPortsCalled(x => [...x, { port: '', country: '', ispsLevel: '', departure: '' }])} style={{ background: C.surface3, border: `1px solid ${C.border2}`, borderRadius: 3, color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 8px' }}>+ Add Row</button>
              {portsCalled.length > 1 && <button onClick={() => setPortsCalled(x => x.slice(0, -1))} style={{ background: C.surface3, border: `1px solid ${C.border2}`, borderRadius: 3, color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 8px' }}>− Remove</button>}
            </div>
          </div>
          <div style={{ background: `${C.amber}18`, border: `1px solid ${C.amberBdr}`, borderRadius: 4, padding: '10px 14px', fontFamily: SANS, fontSize: 12, color: C.amber, lineHeight: 1.6 }}>
            The Master declares that the vessel is in compliance with the ISPS Code and SOLAS Chapter XI-2. This declaration will be transmitted to the Samoa Port Authority.
          </div>
        </div>

        {!submitted.fal1
          ? submitBtn('Submit FAL Form 1 — General Declaration', handleSubmit)
          : confirmation([
              `✓ FAL Form 1 submitted — Reference: ${refs.fal1}`,
              `Transmitted to: SPA · Customs · MAF · Port Health`,
              `ASYCUDA Notification: Pending cargo declaration submission`,
              `Timestamp: ${wst()} WST`,
            ])
        }
      </div>
    )
  }

  // ── DECLARATIONS TAB ──────────────────────────────────────────────────────

  function DeclarationsTab() {
    // FAL 2
    const [f2, setF2] = useState({ bl: '', desc: '', hs: '', qty: '', unit: 'MT', weight: '', pol: '', shipper: '', consignee: '', dg: false, unNo: '', imoClass: '', imdgPage: '' })
    // FAL 3
    const [f3Items, setF3Items] = useState([{ desc: '', qty: '', unit: '', voyage: false }])
    // FAL 4
    const [f4Crew, setF4Crew] = useState([{ name: '', nationality: '', items: '', value: '' }])
    // FAL 5
    const [f5Crew, setF5Crew] = useState([{ name: '', rank: '', nationality: '', passport: '', dob: '', poe: '', visa: '' }])
    // FAL 7
    const [f7, setF7] = useState({ unNo: '', psn: '', imoClass: '', packGroup: '', stowage: '', emergency: '' })
    // MDH
    const [mdh, setMdh] = useState({ illness: false, deaths: false, infected: false, vaccination: 'All vaccinated' })
    // MARPOL
    const [marpol, setMarpol] = useState({ oilyWaste: '', sewage: false, garbage: '', hazardous: false, hazardousDesc: '', wasteReception: false })
    const [marpolSubmitted, setMarpolSubmitted] = useState(false)
    const [marpolRef, setMarpolRef] = useState('')

    function submitFAL2() {
      const r = `ASYCUDA-${String(Math.floor(10000000 + Math.random() * 90000000))}`
      markSubmitted('fal2', r)
      if (f2.dg) setHasDG(true)
      addAudit({ timestamp: wst(), form: 'FAL Form 2 — Cargo Declaration', reference: r, transmittedTo: 'ASYCUDA World — Customs MOR', status: 'Submitted' })
    }

    function submitFAL3() {
      const r = ref('FAL3')
      markSubmitted('fal3', r)
      addAudit({ timestamp: wst(), form: 'FAL Form 3 — Stores Declaration', reference: r, transmittedTo: 'Customs · MAF Biosecurity', status: 'Submitted' })
    }

    function submitFAL4() {
      const r = ref('FAL4')
      markSubmitted('fal4', r)
      addAudit({ timestamp: wst(), form: "FAL Form 4 — Crew's Effects Declaration", reference: r, transmittedTo: 'Customs MOR', status: 'Submitted' })
    }

    function submitFAL5() {
      const r = ref('FAL5')
      markSubmitted('fal5', r, 'fal5')
      const count = f5Crew.filter(c => c.name.trim()).length
      setCrewCount(count)
      setVesselData(v => ({ ...v, crewCount: count }))
      addAudit({ timestamp: wst(), form: 'FAL Form 5 — Crew List', reference: r, transmittedTo: 'Port Health · Immigration (stub)', status: 'Submitted' })
    }

    function submitFAL7() {
      const r = ref('FAL7')
      markSubmitted('fal7', r)
      addAudit({ timestamp: wst(), form: 'FAL Form 7 — Dangerous Goods', reference: r, transmittedTo: 'Customs · SPA Port Operations', status: 'Submitted' })
    }

    function submitMDH() {
      const r = ref('MDH')
      markSubmitted('mdh', r)
      addAudit({ timestamp: wst(), form: 'Maritime Declaration of Health', reference: r, transmittedTo: 'Port Health — MOH', status: 'Submitted' })
    }

    const rowBtn = (onClick: () => void, label: string) => (
      <button onClick={onClick} style={{ background: C.surface3, border: `1px solid ${C.border2}`, borderRadius: 3, color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 8px' }}>
        {label}
      </button>
    )

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 720 }}>
        {sectionHead('Declarations', 'IMO FAL Convention 2024 — Required forms for vessel arrival')}

        {/* FAL 2 */}
        <Collapsible title="FAL Form 2 — Cargo Declaration" standard="IMO FAL / ASYCUDA World / WCO Data Model v3" defaultOpen>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vesselData.vesselName && (
              <div style={{ background: `${C.flagBlue}10`, border: `1px solid ${C.border2}`, borderRadius: 4, padding: '6px 10px', fontFamily: MONO, fontSize: 10, color: C.dim }}>
                Vessel: <span style={{ color: C.text }}>{vesselData.vesselName}</span> — Pre-filled from FAL 1 — Single Window: submit once, use many times
              </div>
            )}
            {grid2([
              fld('B/L Number', f2.bl, v => setF2(x => ({ ...x, bl: v }))),
              fld('HS Code (WCO Harmonized System Code)', f2.hs, v => setF2(x => ({ ...x, hs: v })), { placeholder: '6-digit' }),
            ])}
            {fld('Cargo Description', f2.desc, v => setF2(x => ({ ...x, desc: v })))}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
              {fld('Quantity', f2.qty, v => setF2(x => ({ ...x, qty: v })), { type: 'number' })}
              {sel('Unit', f2.unit, v => setF2(x => ({ ...x, unit: v })), ['MT', 'TEU', 'Units', 'Litres'])}
            </div>
            {grid2([
              fld('Gross Weight (MT)', f2.weight, v => setF2(x => ({ ...x, weight: v })), { type: 'number' }),
              fld('Port of Loading', f2.pol, v => setF2(x => ({ ...x, pol: v }))),
              fld('Shipper Name', f2.shipper, v => setF2(x => ({ ...x, shipper: v }))),
              fld('Consignee Name', f2.consignee, v => setF2(x => ({ ...x, consignee: v }))),
            ])}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: C.muted }}>
              <input type="checkbox" checked={f2.dg} onChange={e => setF2(x => ({ ...x, dg: e.target.checked }))} style={{ accentColor: C.amber }} />
              Dangerous Goods on board
            </label>
            {f2.dg && (
              <div style={{ background: `${C.amber}10`, border: `1px solid ${C.amberBdr}`, borderRadius: 4, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {grid2([
                  fld('UN Number', f2.unNo, v => setF2(x => ({ ...x, unNo: v }))),
                  fld('IMO Hazard Class', f2.imoClass, v => setF2(x => ({ ...x, imoClass: v }))),
                  fld('IMDG Page Reference', f2.imdgPage, v => setF2(x => ({ ...x, imdgPage: v }))),
                ])}
              </div>
            )}
            {!submitted.fal2
              ? submitBtn('Transmit to ASYCUDA World — Customs MOR', submitFAL2)
              : confirmation(['✓ Transmitted to ASYCUDA World — Customs MOR', `ASYCUDA Entry Reference: ${audit.find(a => a.form.includes('FAL Form 2'))?.reference ?? ''}`, `Timestamp: ${wst()} WST`])
            }
          </div>
        </Collapsible>

        {/* FAL 3 */}
        <Collapsible title="FAL Form 3 — Ship's Stores Declaration" standard="IMO FAL Convention">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vesselData.vesselName && (
              <div style={{ background: `${C.flagBlue}10`, border: `1px solid ${C.border2}`, borderRadius: 4, padding: '6px 10px', fontFamily: MONO, fontSize: 10, color: C.dim }}>
                Vessel: <span style={{ color: C.text }}>{vesselData.vesselName}</span> — Pre-filled from FAL 1 — Single Window: submit once, use many times
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead><tr>{["Description","Quantity","Unit","Voyage Use"].map(h => <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '4px 8px', borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>{h}</th>)}</tr></thead>
              <tbody>
                {f3Items.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: 4 }}><input value={row.desc} onChange={e => { const n=[...f3Items]; n[i]={...n[i],desc:e.target.value}; setF3Items(n) }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: '100%' }} /></td>
                    <td style={{ padding: 4 }}><input type="number" value={row.qty} onChange={e => { const n=[...f3Items]; n[i]={...n[i],qty:e.target.value}; setF3Items(n) }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: 70 }} /></td>
                    <td style={{ padding: 4 }}><input value={row.unit} onChange={e => { const n=[...f3Items]; n[i]={...n[i],unit:e.target.value}; setF3Items(n) }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: 60 }} /></td>
                    <td style={{ padding: 4, textAlign: 'center' }}><input type="checkbox" checked={row.voyage} onChange={e => { const n=[...f3Items]; n[i]={...n[i],voyage:e.target.checked}; setF3Items(n) }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', gap: 8 }}>
              {rowBtn(() => setF3Items(x => [...x, { desc:'',qty:'',unit:'',voyage:false }]), '+ Add Row')}
              {f3Items.length > 1 && rowBtn(() => setF3Items(x => x.slice(0,-1)), '− Remove')}
            </div>
            {!submitted.fal3
              ? submitBtn("Transmit to: Customs · MAF Biosecurity", submitFAL3)
              : confirmation(["✓ FAL Form 3 — Ship's Stores transmitted", "Transmitted to: Customs · MAF Biosecurity", `Timestamp: ${wst()} WST`])
            }
          </div>
        </Collapsible>

        {/* FAL 4 */}
        <Collapsible title="FAL Form 4 — Crew's Effects Declaration" standard="IMO FAL Convention">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vesselData.vesselName && (
              <div style={{ background: `${C.flagBlue}10`, border: `1px solid ${C.border2}`, borderRadius: 4, padding: '6px 10px', fontFamily: MONO, fontSize: 10, color: C.dim }}>
                Vessel: <span style={{ color: C.text }}>{vesselData.vesselName}</span> — Pre-filled from FAL 1 — Single Window: submit once, use many times
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead><tr>{["Crew Member","Nationality","Items Declared","Est. Value (WST)"].map(h => <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '4px 8px', borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>{h}</th>)}</tr></thead>
              <tbody>
                {f4Crew.map((row, i) => (
                  <tr key={i}>
                    {(['name','nationality','items','value'] as const).map(k => (
                      <td key={k} style={{ padding: 4 }}>
                        <input value={row[k]} onChange={e => { const n=[...f4Crew]; n[i]={...n[i],[k]:e.target.value}; setF4Crew(n) }}
                          style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: '100%' }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', gap: 8 }}>
              {rowBtn(() => setF4Crew(x => [...x, { name:'',nationality:'',items:'',value:'' }]), '+ Add Row')}
              {f4Crew.length > 1 && rowBtn(() => setF4Crew(x => x.slice(0,-1)), '− Remove')}
            </div>
            {!submitted.fal4
              ? submitBtn('Transmit to Customs MOR', submitFAL4)
              : confirmation(["✓ FAL Form 4 — Crew's Effects transmitted", 'Transmitted to: Customs MOR', `Timestamp: ${wst()} WST`])
            }
          </div>
        </Collapsible>

        {/* FAL 5 */}
        <Collapsible title="FAL Form 5 — Crew List" standard="IMO FAL Convention">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vesselData.crewCount > 0 && (
              <div style={{ background: `${C.flagBlue}10`, border: `1px solid ${C.border2}`, borderRadius: 4, padding: '6px 10px', fontFamily: MONO, fontSize: 10, color: C.dim }}>
                Crew count from previous submission: <span style={{ color: C.text }}>{vesselData.crewCount}</span> — Pre-filled from FAL 1 — Single Window: submit once, use many times
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 700 }}>
                <thead><tr>{['Name','Rank/Rating','Nationality','Passport No','Date of Birth','Port of Embarkation','Visa/Permit (opt.)'].map(h => <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '4px 8px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {f5Crew.map((row, i) => (
                    <tr key={i}>
                      {(['name','rank','nationality','passport','dob','poe','visa'] as const).map(k => (
                        <td key={k} style={{ padding: 4 }}>
                          <input
                            type={k === 'dob' ? 'date' : 'text'}
                            value={row[k]}
                            onChange={e => { const n=[...f5Crew]; n[i]={...n[i],[k]:e.target.value}; setF5Crew(n) }}
                            style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 10, padding: '4px 6px', width: k==='dob'?120:100 }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {rowBtn(() => setF5Crew(x => [...x, { name:'',rank:'',nationality:'',passport:'',dob:'',poe:'',visa:'' }]), '+ Add Row')}
              {f5Crew.length > 1 && rowBtn(() => setF5Crew(x => x.slice(0,-1)), '− Remove')}
            </div>
            {!submitted.fal5
              ? submitBtn('Transmit to: Port Health · Immigration (stub)', submitFAL5)
              : confirmation(['✓ FAL Form 5 — Crew List transmitted', 'Transmitted to: Port Health · Immigration (stub — Immigration Portal pending)', `Timestamp: ${wst()} WST`])
            }
          </div>
        </Collapsible>

        {/* CHANGE D — MARPOL Waste Declaration (collapsible, after MDH in DOM order we put it last) */}

        {/* FAL 7 — only if DG */}
        {(hasDG || submitted.fal2) && (
          <Collapsible title="FAL Form 7 — Dangerous Goods" standard="IMO IMDG Code / FAL Convention">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {grid2([
                fld('UN Number', f7.unNo, v => setF7(x => ({ ...x, unNo: v }))),
                fld('Proper Shipping Name', f7.psn, v => setF7(x => ({ ...x, psn: v }))),
                fld('IMO Hazard Class', f7.imoClass, v => setF7(x => ({ ...x, imoClass: v }))),
                fld('Packing Group', f7.packGroup, v => setF7(x => ({ ...x, packGroup: v }))),
                fld('Stowage Position', f7.stowage, v => setF7(x => ({ ...x, stowage: v }))),
                fld('Emergency Contact', f7.emergency, v => setF7(x => ({ ...x, emergency: v }))),
              ])}
              {!submitted.fal7
                ? submitBtn('Transmit to: Customs · SPA Port Operations', submitFAL7)
                : confirmation(['✓ FAL Form 7 — Dangerous Goods transmitted', 'Transmitted to: Customs · SPA Port Operations', `Timestamp: ${wst()} WST`])
              }
            </div>
          </Collapsible>
        )}

        {/* MDH */}
        <Collapsible title="Maritime Declaration of Health (MDH)" standard="WHO International Health Regulations 2005">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {crewCount > 0 && (
              <div style={{ background: `${C.flagBlue}10`, border: `1px solid ${C.border2}`, borderRadius: 4, padding: '6px 10px', fontFamily: MONO, fontSize: 10, color: C.dim }}>
                Crew count: <span style={{ color: C.text }}>{crewCount}</span> — Pre-filled from FAL 1 — Single Window: submit once, use many times
              </div>
            )}
            {[
              ['illness',  'Any crew illness in last 30 days'],
              ['deaths',   'Deaths on board in last 30 days'],
              ['infected', 'Infected or contaminated persons on board'],
            ].map(([k, label]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: C.muted }}>
                <input type="checkbox" checked={mdh[k as keyof typeof mdh] as boolean} onChange={e => setMdh(x => ({ ...x, [k]: e.target.checked }))} style={{ accentColor: C.amber }} />
                {label}
              </label>
            ))}
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.green }}>✓ Free pratique requested: Yes</div>
            {sel('Vaccination status of crew', mdh.vaccination, v => setMdh(x => ({ ...x, vaccination: v })), ['All vaccinated', 'Partial', 'Unknown'])}
            {!submitted.mdh
              ? submitBtn('Transmit to Port Health — MOH', submitMDH)
              : confirmation(['✓ Maritime Declaration of Health transmitted', 'Transmitted to: Port Health — MOH', `Timestamp: ${wst()} WST`])
            }
          </div>
        </Collapsible>

        {/* MARPOL Waste Declaration */}
        <Collapsible title="MARPOL Waste Declaration" standard="MARPOL Annex V — Ship-generated waste notification — Samoa Port Authority">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>MARPOL Annex V compliance — Port reception facility notification required 24 hours before arrival</div>
            {grid2([
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>Oily waste / bilge water (litres)</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="number" value={marpol.oilyWaste} onChange={e => setMarpol(x => ({ ...x, oilyWaste: e.target.value }))}
                    style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '8px 10px', outline: 'none', flex: 1, boxSizing: 'border-box' }} />
                  <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>litres</span>
                </div>
              </div>,
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>Garbage / domestic waste (bags)</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="number" value={marpol.garbage} onChange={e => setMarpol(x => ({ ...x, garbage: e.target.value }))}
                    style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '8px 10px', outline: 'none', flex: 1, boxSizing: 'border-box' }} />
                  <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>bags</span>
                </div>
              </div>,
            ])}
            {[
              { key: 'sewage' as const, label: 'Sewage on board' },
              { key: 'hazardous' as const, label: 'Hazardous waste on board' },
              { key: 'wasteReception' as const, label: 'Waste reception required at Apia' },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: C.muted }}>
                <input type="checkbox" checked={marpol[key]} onChange={e => setMarpol(x => ({ ...x, [key]: e.target.checked }))} style={{ accentColor: C.amber }} />
                {label}
              </label>
            ))}
            {marpol.hazardous && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>Hazardous waste description</label>
                <input value={marpol.hazardousDesc} onChange={e => setMarpol(x => ({ ...x, hazardousDesc: e.target.value }))}
                  style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '8px 10px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
              </div>
            )}
            {!marpolSubmitted
              ? submitBtn('Notify SPA — Waste Reception', () => {
                  const r = `WR-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`
                  setMarpolRef(r)
                  setMarpolSubmitted(true)
                  addAudit({ timestamp: wst(), form: 'MARPOL Waste Declaration', reference: r, transmittedTo: 'SPA Port Operations — Waste Reception', status: 'Submitted' })
                })
              : confirmation([
                  `✓ Transmitted to SPA Port Operations — Waste Reception Reference: ${marpolRef}`,
                  'MARPOL Annex V compliance — Port reception facility notification required 24 hours before arrival',
                  `Timestamp: ${wst()} WST`,
                ])
            }
          </div>
        </Collapsible>
      </div>
    )
  }

  // ── CLEARANCE STATUS TAB ──────────────────────────────────────────────────

  function ClearanceTab() {
    const statusColor: Record<AgencyStatusVal, string> = {
      'Pending':      C.muted,
      'Under Review': C.amber,
      'Cleared':      C.green,
      'Stub':         C.dim,
    }
    const statusBg: Record<AgencyStatusVal, string> = {
      'Pending':      C.surface2,
      'Under Review': `${C.amber}18`,
      'Cleared':      `${C.green}10`,
      'Stub':         C.surface,
    }

    return (
      <div style={{ maxWidth: 640 }}>
        {sectionHead('Agency Clearance Status', 'Single Window — Multi-Agency Coordination')}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Agency', 'Status', 'Updated'].map(h => (
                <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '8px 12px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', letterSpacing: '1px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {statuses.map(s => (
              <tr key={s.code} style={{ background: s.code === 'IMMIG' ? C.surface : 'transparent' }}>
                <td style={{ fontFamily: SANS, fontSize: 13, color: C.text, padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>
                  {s.name}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ background: statusBg[s.status], border: `1px solid ${statusColor[s.status]}40`, borderRadius: 3, color: statusColor[s.status], fontFamily: MONO, fontSize: 9, padding: '2px 8px' }}>
                    {s.note ?? s.status}
                  </span>
                </td>
                <td style={{ fontFamily: MONO, fontSize: 10, color: C.dim, padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>
                  {s.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={refreshStatuses}
          style={{ background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 4, color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 10, padding: '8px 14px', marginTop: 14, letterSpacing: '1px' }}>
          ↻ Refresh Status
        </button>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 10 }}>
          Simulated clearance workflow. Phase 2: live agency API integration.
        </div>
      </div>
    )
  }

  // ── DEPARTURE TAB ─────────────────────────────────────────────────────────

  function DepartureTab() {
    const portCleared = statuses.filter(s => s.code !== 'IMMIG').every(s => s.status === 'Cleared')

    const [atd,            setAtd]            = useState('')
    const [nextPort,       setNextPort]       = useState('')
    const [pob,            setPob]            = useState('')
    const [personsChange,  setPersonsChange]  = useState<'no' | 'yes'>('no')
    const [changeRows,     setChangeRows]     = useState([{ name: '', reason: '' }])
    const [storesDeclared, setStoresDeclared] = useState(false)
    const [masterSig,      setMasterSig]      = useState(false)
    const [depSubmitted,   setDepSubmitted]   = useState(false)
    const [depRef,         setDepRef]         = useState('')

    function submitDeparture() {
      const r = `OUT-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`
      setDepRef(r)
      setDepSubmitted(true)
      addAudit({ timestamp: wst(), form: 'Departure Declaration', reference: r, transmittedTo: 'SPA Port Authority', status: 'Submitted' })
    }

    const canSubmit = !!atd && !!nextPort && !!pob && storesDeclared && masterSig

    if (!portCleared) {
      return (
        <div style={{ maxWidth: 560 }}>
          {sectionHead('Departure', 'Outward Clearance — Samoa Port Authority')}
          <div style={{ background: `${C.amber}10`, border: `1px solid ${C.amberBdr}`, borderRadius: 8, padding: '20px 24px' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.amber, fontWeight: 700, marginBottom: 8 }}>
              ⏳ PORT CLEARED REQUIRED BEFORE DEPARTURE
            </div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              The Departure Declaration form will be available once all four
              border agencies have completed clearance and the Samoa Port
              Authority has issued PORT CLEARED status.
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginTop: 12 }}>
              Current: {statuses.filter(s => s.code !== 'IMMIG' && s.status === 'Cleared').length} / 4 agencies cleared
            </div>
          </div>
        </div>
      )
    }

    if (depSubmitted) {
      return (
        <div style={{ maxWidth: 560 }}>
          {sectionHead('Departure', 'Outward Clearance — Samoa Port Authority')}
          {confirmation([
            `✓ Departure Declaration Submitted`,
            `Outward Clearance Reference: ${depRef}`,
            `Vessel is cleared for departure.`,
            `Timestamp: ${wst()} WST`,
          ])}
          <div style={{ background: `${C.amber}10`, border: `1px solid ${C.amberBdr}`, borderRadius: 6, padding: '10px 14px', marginTop: 12, fontFamily: SANS, fontSize: 12, color: C.amber, lineHeight: 1.6 }}>
            Note: Outward clearance from Customs office required for cargo vessels
            carrying dutiable goods — contact Customs MOR, Apia.
          </div>
        </div>
      )
    }

    return (
      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sectionHead('Departure Declaration', 'Outward Clearance — IMO FAL Convention · Samoa Port Authority')}

        {/* PORT CLEARED confirmation */}
        <div style={{ background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: '10px 14px', fontFamily: MONO, fontSize: 10, color: C.green }}>
          ✓ PORT CLEARED — All agencies have completed assessment. Departure declaration may now be submitted.
        </div>

        {grid2([
          fld('Actual Time of Departure (ATD)', atd, setAtd, { type: 'datetime-local' }),
          fld('Next Port of Call', nextPort, setNextPort, { placeholder: 'e.g. Suva, Fiji' }),
        ])}
        {fld('Persons on Board at Departure', pob, setPob, { type: 'number', placeholder: 'Total crew + passengers' })}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>Persons joining or disembarking in Samoa?</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {(['no', 'yes'] as const).map(v => (
              <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: personsChange === v ? C.text : C.muted }}>
                <input type="radio" name="persons-change" value={v} checked={personsChange === v} onChange={() => setPersonsChange(v)} style={{ accentColor: C.flagBlue }} />
                {v === 'yes' ? 'Yes' : 'No'}
              </label>
            ))}
          </div>
          {personsChange === 'yes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {changeRows.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {fld('Name', row.name, v => { const n=[...changeRows]; n[i]={...n[i],name:v}; setChangeRows(n) })}
                  {fld('Reason', row.reason, v => { const n=[...changeRows]; n[i]={...n[i],reason:v}; setChangeRows(n) })}
                </div>
              ))}
              <button onClick={() => setChangeRows(x => [...x, { name:'', reason:'' }])}
                style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 8px', alignSelf: 'flex-start' }}>
                + Add Row
              </button>
            </div>
          )}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: C.muted }}>
          <input type="checkbox" checked={storesDeclared} onChange={e => setStoresDeclared(e.target.checked)} style={{ accentColor: C.flagBlue }} />
          Final stores and bunkers declaration is accurate. All ship's stores for voyage use only.
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: C.muted }}>
          <input type="checkbox" checked={masterSig} onChange={e => setMasterSig(e.target.checked)} style={{ accentColor: C.flagBlue }} />
          I, the Master, confirm all information in this departure declaration is correct and complete.
        </label>

        {!canSubmit && (
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.amber }}>
            Required: ATD, Next Port, Persons on Board, stores declaration, Master confirmation
          </div>
        )}

        <button onClick={submitDeparture} disabled={!canSubmit}
          style={{ background: canSubmit ? C.flagBlue : C.surface2, border: 'none', borderRadius: 4, color: canSubmit ? '#fff' : C.muted, cursor: canSubmit ? 'pointer' : 'not-allowed', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '1px', padding: '12px 20px', alignSelf: 'flex-start', opacity: canSubmit ? 1 : 0.6 }}>
          Submit Departure Declaration
        </button>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 24 }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background:    tab === t.id ? C.surface2 : 'none',
              border:        'none',
              borderBottom:  tab === t.id ? `2px solid ${C.flagBlue}` : '2px solid transparent',
              color:         tab === t.id ? C.text : C.muted,
              cursor:        'pointer',
              fontFamily:    MONO,
              fontSize:      10,
              letterSpacing: '1.5px',
              padding:       '10px 18px',
              transition:    'all 0.15s',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'pre-arrival'  && <PreArrivalTab />}
      {tab === 'declarations' && <DeclarationsTab />}
      {tab === 'clearance'    && <ClearanceTab />}
      {tab === 'departure'    && <DepartureTab />}

      <AuditLog entries={audit} />
    </div>
  )
}
