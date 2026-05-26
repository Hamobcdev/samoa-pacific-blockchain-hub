import React, { useState, useCallback } from 'react'
import { C, MONO, SANS } from '../constants'
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
    const [crewInput, setCrewInput] = useState(String(crewCount || 0))
    const crew = parseInt(crewInput, 10) || 0
    const dues = 500 + crew * 50

    const checks: Array<{ label: string; done: boolean }> = [
      { label: 'FAL Form 1 submitted',                   done: submitted.fal1 },
      { label: 'Cargo Declaration submitted to ASYCUDA', done: submitted.fal2 },
      { label: 'All agency clearances received',         done: statuses.filter(s => s.code !== 'IMMIG').every(s => s.status === 'Cleared') },
      { label: 'Harbour dues paid',                      done: submitted.dc },
    ]

    function requestDeparture() {
      const r = ref('DC')
      markSubmitted('dc', r, 'dc')
      addAudit({ timestamp: wst(), form: 'Departure Clearance Request', reference: r, transmittedTo: 'SPA Port Authority', status: 'Submitted' })
    }

    return (
      <div style={{ maxWidth: 560 }}>
        {sectionHead('Departure Clearance', 'Samoa Port Authority — Port Departure Procedures')}

        {/* Checklist */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: '1px', marginBottom: 4 }}>DEPARTURE CLEARANCE CHECKLIST</div>
          {checks.map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 13, color: c.done ? C.green : C.dim }}>{c.done ? '☑' : '☐'}</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: c.done ? C.text : C.muted }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* Dues calculator */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, marginBottom: 20 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: '1px', marginBottom: 12 }}>HARBOUR DUES CALCULATOR</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: MONO, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: C.muted }}>
              <span>Base dues:</span><span>WST 500.00</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: C.muted }}>Crew members:</span>
              <input type="number" value={crewInput} onChange={e => setCrewInput(e.target.value)} min={0}
                style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 12, padding: '4px 8px', width: 60, outline: 'none' }} />
              <span style={{ color: C.muted }}>× WST 50.00 = WST {(crew * 50).toFixed(2)}</span>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: C.text, fontWeight: 700 }}>Total:</span>
              <span style={{ color: C.gold, fontWeight: 700 }}>WST {dues.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {!submitted.dc
          ? (
            <button onClick={requestDeparture}
              style={{ background: C.flagBlue, border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '1px', padding: '12px 20px' }}>
              Request Departure Clearance
            </button>
          )
          : confirmation([
              `✓ Departure Clearance Requested`,
              `Certificate Reference: ${refs.dc}`,
              `Transmitted to: SPA Port Authority`,
              `Timestamp: ${wst()} WST`,
            ])
        }
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
