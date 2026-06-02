import React, { useState, useCallback } from 'react'
import { C, MONO, SANS, SSC_ROUTES } from '../constants'
import { AuditLog } from './AuditLog'
import type { OMWAuthResult, AuditEntry } from '../types'
import type { SSCRouteId } from '../constants'

function wst() {
  return new Date().toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })
}

function nref(prefix: string) {
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

function grid2(children: React.ReactNode[]) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{children}</div>
}

function sHead(title: string, sub?: string) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: MONO, fontSize: 11, color: C.gold, letterSpacing: '2px', textTransform: 'uppercase' }}>{title}</div>
      {sub && <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function submitBtn(label: string, onClick: () => void, disabled?: boolean) {
  return (
    <button onClick={onClick} disabled={!!disabled}
      style={{ background: disabled ? C.surface2 : C.flagBlue, border: 'none', borderRadius: 4, color: disabled ? C.muted : '#fff', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '1px', padding: '10px 18px', marginTop: 8, alignSelf: 'flex-start', opacity: disabled ? 0.5 : 1 }}>
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

interface Props {
  session: OMWAuthResult
}

type IntlTab = 'pre-arrival' | 'fal-forms' | 'clearance' | 'departure'

export function SSCAgentDashboard({ session: _session }: Props) {
  const [routeId,  setRouteId]  = useState<SSCRouteId>('INTERNATIONAL')
  const [intlTab,  setIntlTab]  = useState<IntlTab>('pre-arrival')
  const [audit,    setAudit]    = useState<AuditEntry[]>([])

  // submitted flags
  const [subFal1,  setSubFal1]  = useState(false)
  const [subFal6,  setSubFal6]  = useState(false)
  const [subFal3,  setSubFal3]  = useState(false)
  const [subFal5,  setSubFal5]  = useState(false)
  const [subDep,   setSubDep]   = useState(false)
  const [subDomDep,setSubDomDep]= useState(false)

  const [fal1Ref,  setFal1Ref]  = useState('')
  const [fal6Ref,  setFal6Ref]  = useState('')
  const [depRef,   setDepRef]   = useState('')
  const [domDepRef,setDomDepRef]= useState('')

  const addAudit = useCallback((e: AuditEntry) => setAudit(a => [e, ...a]), [])

  const route = SSC_ROUTES.find(r => r.id === routeId)!

  // ── INTERNATIONAL — PRE-ARRIVAL TAB ────────────────────────────────────────

  function IntlPreArrival() {
    const [f, setF] = useState({
      vesselName: 'MV Lady Samoa IV', imoNumber: '9720192', callSign: 'V5LAD',
      flagState: 'WS', masterName: '', passengerCount: '', crewCount: '',
      eta: '', lastPort: 'Pago Pago, American Samoa',
    })
    const [paxRows, setPaxRows] = useState([
      { nationality: 'WS', count: '' },
      { nationality: 'AS', count: '' },
      { nationality: 'NZ', count: '' },
    ])
    const [uscgAck, setUscgAck] = useState(false)

    function submitFal1() {
      const r = nref('FAL1')
      setFal1Ref(r); setSubFal1(true)
      addAudit({ timestamp: wst(), form: 'FAL Form 1 — General Declaration (Ferry)', reference: r, transmittedTo: 'SPA · Customs · MAF · Port Health', status: 'Submitted' })
    }

    function submitFal6() {
      const r = nref('FAL6')
      setFal6Ref(r); setSubFal6(true)
      addAudit({ timestamp: wst(), form: 'FAL Form 6 — Passenger List', reference: r, transmittedTo: 'SPA · Immigration · Customs · Port Health', status: 'Submitted' })
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>

        {/* USCG notification panel */}
        <div style={{ background: `${C.amber}12`, border: `1px solid ${C.amberBdr}`, borderRadius: 6, padding: '14px 18px' }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.amber, fontWeight: 700, letterSpacing: '1px', marginBottom: 6 }}>
            USCG 96-HOUR ADVANCE NOTICE — 33 CFR PART 160
          </div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.amber, lineHeight: 1.7, marginBottom: 10 }}>
            Vessels entering US waters (including American Samoa) must submit a 96-hour advance notice
            of arrival to the US Coast Guard via the National Vessel Movement Center (NVMC).
            Submit at <span style={{ fontFamily: MONO, fontSize: 11 }}>nvmc.uscg.gov</span> before
            dispatching FAL forms through this system.
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'NVMC Portal', val: 'nvmc.uscg.gov' },
              { label: 'Vessel Type Code', val: 'RORO/FERRY' },
              { label: 'Destination Port', val: 'Pago Pago (PPG)' },
              { label: 'Reporting Party', val: 'Vessel Agent / Master' },
            ].map(({ label, val }) => (
              <div key={label}>
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>{label}</div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: C.text }}>{val}</div>
              </div>
            ))}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: C.muted }}>
            <input type="checkbox" checked={uscgAck} onChange={e => setUscgAck(e.target.checked)} style={{ accentColor: C.amber }} />
            I confirm USCG 96-hour advance notice has been submitted to NVMC
          </label>
        </div>

        {/* FAL 1 */}
        {sHead('FAL Form 1 — General Declaration', 'IMO FAL Convention 2024 · Apia ↔ Pago Pago Route')}
        {grid2([
          fld('Vessel Name', f.vesselName, v => setF(x => ({ ...x, vesselName: v })), { readOnly: true }),
          fld('IMO Number', f.imoNumber, v => setF(x => ({ ...x, imoNumber: v })), { readOnly: true }),
          fld('Call Sign', f.callSign, v => setF(x => ({ ...x, callSign: v })), { readOnly: true }),
          fld('Flag State', f.flagState, v => setF(x => ({ ...x, flagState: v })), { readOnly: true }),
          fld("Master's Name", f.masterName, v => setF(x => ({ ...x, masterName: v })), { placeholder: 'Enter master name' }),
          fld('ETA — Port of Apia', f.eta, v => setF(x => ({ ...x, eta: v })), { type: 'datetime-local' }),
          fld('Total Passengers', f.passengerCount, v => setF(x => ({ ...x, passengerCount: v })), { type: 'number' }),
          fld('Total Crew', f.crewCount, v => setF(x => ({ ...x, crewCount: v })), { type: 'number' }),
          fld('Last Port of Call', f.lastPort, v => setF(x => ({ ...x, lastPort: v })), { readOnly: true }),
        ])}
        {!subFal1
          ? submitBtn('Submit FAL Form 1', submitFal1)
          : confirmation([`✓ FAL Form 1 submitted — ${fal1Ref}`, 'Transmitted to: SPA · Customs · MAF · Port Health', `${wst()} WST`])
        }

        {/* FAL 6 — passenger ferry requirement */}
        <div style={{ border: `2px solid ${C.flagBlue}40`, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ background: `${C.flagBlue}15`, borderBottom: `1px solid ${C.flagBlue}30`, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.info, fontWeight: 700, letterSpacing: '1px' }}>FAL FORM 6 — PASSENGER LIST</span>
            <span style={{ background: `${C.flagBlue}30`, border: `1px solid ${C.flagBlue}50`, borderRadius: 3, fontFamily: MONO, fontSize: 8, color: C.info, padding: '1px 6px' }}>REQUIRED — PASSENGER VESSEL</span>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>
              IMO FAL Form 6 is mandatory for all passenger vessels. List all passengers by nationality.
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 6 }}>PASSENGERS BY NATIONALITY</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', maxWidth: 400 }}>
                <thead>
                  <tr>
                    {['Nationality Code', 'Count'].map(h => (
                      <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '4px 8px', borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paxRows.map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: 4 }}>
                        <input value={row.nationality} onChange={e => { const n=[...paxRows]; n[i]={...n[i],nationality:e.target.value}; setPaxRows(n) }}
                          style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 8px', width: 80 }} />
                      </td>
                      <td style={{ padding: 4 }}>
                        <input type="number" value={row.count} onChange={e => { const n=[...paxRows]; n[i]={...n[i],count:e.target.value}; setPaxRows(n) }}
                          style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 8px', width: 80 }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => setPaxRows(x => [...x, { nationality: '', count: '' }])}
                style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 8px', marginTop: 6 }}>
                + Add Row
              </button>
            </div>
            {!subFal6
              ? submitBtn('Submit FAL Form 6 — Passenger List', submitFal6)
              : confirmation([`✓ FAL Form 6 submitted — ${fal6Ref}`, 'Transmitted to: SPA · Immigration · Customs · Port Health', `${wst()} WST`])
            }
          </div>
        </div>
      </div>
    )
  }

  // ── INTERNATIONAL — FAL FORMS TAB ──────────────────────────────────────────

  function IntlFalForms() {
    const [f3Items, setF3Items] = useState([{ desc: '', qty: '', unit: '' }])
    const [f5Crew, setF5Crew] = useState([{ name: '', rank: '', nationality: '', passport: '' }])

    function subFal3Fn() {
      const r = nref('FAL3'); setSubFal3(true)
      addAudit({ timestamp: wst(), form: "FAL Form 3 — Ship's Stores Declaration", reference: r, transmittedTo: 'Customs · MAF Biosecurity', status: 'Submitted' })
    }
    function subFal5Fn() {
      const r = nref('FAL5'); setSubFal5(true)
      addAudit({ timestamp: wst(), form: 'FAL Form 5 — Crew List', reference: r, transmittedTo: 'Port Health · Immigration', status: 'Submitted' })
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
        {sHead("FAL Forms — Ship's Stores & Crew List", 'IMO FAL Convention 2024')}

        {/* FAL 3 */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ background: C.surface2, padding: '10px 14px', fontFamily: MONO, fontSize: 11, color: C.text, fontWeight: 600 }}>
            FAL Form 3 — Ship's Stores Declaration
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Description','Qty','Unit'].map(h => <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '4px 8px', borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {f3Items.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: 4 }}><input value={row.desc} onChange={e => { const n=[...f3Items]; n[i]={...n[i],desc:e.target.value}; setF3Items(n) }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: '100%' }} /></td>
                    <td style={{ padding: 4 }}><input type="number" value={row.qty} onChange={e => { const n=[...f3Items]; n[i]={...n[i],qty:e.target.value}; setF3Items(n) }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: 70 }} /></td>
                    <td style={{ padding: 4 }}><input value={row.unit} onChange={e => { const n=[...f3Items]; n[i]={...n[i],unit:e.target.value}; setF3Items(n) }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: 70 }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setF3Items(x => [...x, { desc:'',qty:'',unit:'' }])}
              style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 8px', alignSelf: 'flex-start' }}>+ Add Row</button>
            {!subFal3
              ? submitBtn("Submit FAL Form 3", subFal3Fn)
              : confirmation(["✓ FAL Form 3 submitted", "Customs · MAF Biosecurity", wst() + " WST"])
            }
          </div>
        </div>

        {/* FAL 5 */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ background: C.surface2, padding: '10px 14px', fontFamily: MONO, fontSize: 11, color: C.text, fontWeight: 600 }}>
            FAL Form 5 — Crew List
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                <thead>
                  <tr>{['Name','Rank','Nationality','Passport No'].map(h => <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '4px 8px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {f5Crew.map((row, i) => (
                    <tr key={i}>
                      {(['name','rank','nationality','passport'] as const).map(k => (
                        <td key={k} style={{ padding: 4 }}>
                          <input value={row[k]} onChange={e => { const n=[...f5Crew]; n[i]={...n[i],[k]:e.target.value}; setF5Crew(n) }}
                            style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: 110 }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setF5Crew(x => [...x, { name:'',rank:'',nationality:'',passport:'' }])}
              style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 8px', alignSelf: 'flex-start' }}>+ Add Row</button>
            {!subFal5
              ? submitBtn("Submit FAL Form 5 — Crew List", subFal5Fn)
              : confirmation(["✓ FAL Form 5 submitted", "Port Health · Immigration", wst() + " WST"])
            }
          </div>
        </div>
      </div>
    )
  }

  // ── INTERNATIONAL — CLEARANCE TAB ─────────────────────────────────────────

  function IntlClearance() {
    const submitted = subFal1 && subFal6
    return (
      <div style={{ maxWidth: 640 }}>
        {sHead('Clearance Status', 'Apia → Pago Pago Route · Multi-Agency')}
        {!submitted && (
          <div style={{ background: `${C.amber}10`, border: `1px solid ${C.amberBdr}`, borderRadius: 6, padding: '12px 16px', marginBottom: 16, fontFamily: SANS, fontSize: 12, color: C.amber, lineHeight: 1.6 }}>
            Submit FAL Form 1 and FAL Form 6 (Passenger List) from the Pre-Arrival tab to initiate clearance.
          </div>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Agency','Status','Notes'].map(h => <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '8px 10px', borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              { name: 'SPA Port Authority',    status: submitted ? 'Pending'      : '—', note: 'Awaiting berth allocation'    },
              { name: 'Customs (MOR)',          status: submitted ? 'Under Review' : '—', note: 'Passenger manifest review'   },
              { name: 'Immigration',            status: submitted ? 'Under Review' : '—', note: 'FAL 6 passenger list review' },
              { name: 'MAF Biosecurity',        status: submitted ? 'Pending'      : '—', note: 'Standard bio-check'         },
              { name: 'Port Health',            status: submitted ? 'Pending'      : '—', note: 'MDH review'                 },
            ].map(row => (
              <tr key={row.name}>
                <td style={{ fontFamily: SANS, fontSize: 13, color: C.text, padding: '10px 10px', borderBottom: `1px solid ${C.border}` }}>{row.name}</td>
                <td style={{ padding: '10px 10px', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ background: row.status === 'Under Review' ? `${C.amber}18` : C.surface2, border: `1px solid ${row.status === 'Under Review' ? C.amberBdr : C.border}`, borderRadius: 3, color: row.status === 'Under Review' ? C.amber : C.dim, fontFamily: MONO, fontSize: 9, padding: '2px 8px' }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ fontFamily: MONO, fontSize: 10, color: C.dim, padding: '10px 10px', borderBottom: `1px solid ${C.border}` }}>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 10 }}>
          Phase 2: live agency API integration via OMW Single Window
        </div>
      </div>
    )
  }

  // ── INTERNATIONAL — DEPARTURE TAB ─────────────────────────────────────────

  function IntlDeparture() {
    const [atd,      setAtd]      = useState('')
    const [nextPort, setNextPort] = useState('Pago Pago, American Samoa')
    const [pob,      setPob]      = useState('')
    const [masterSig,setMasterSig]= useState(false)

    function submitDep() {
      const r = nref('SSCOUT')
      setDepRef(r); setSubDep(true)
      addAudit({ timestamp: wst(), form: 'SSC Departure Declaration — International', reference: r, transmittedTo: 'SPA Port Authority', status: 'Submitted' })
    }
    const canSubmit = !!atd && !!pob && masterSig

    if (subDep) return (
      <div style={{ maxWidth: 560 }}>
        {sHead('Departure Declaration', 'Outward Clearance — International Route')}
        {confirmation([`✓ Departure Declaration Submitted`, `Reference: ${depRef}`, `Route: Apia → Pago Pago, American Samoa`, `${wst()} WST`])}
      </div>
    )

    return (
      <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sHead('Departure Declaration', 'Outward Clearance — Apia → Pago Pago')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {fld('Actual Time of Departure (ATD)', atd, setAtd, { type: 'datetime-local' })}
          {fld('Next Port of Call', nextPort, setNextPort, { readOnly: true })}
        </div>
        {fld('Persons on Board at Departure', pob, setPob, { type: 'number', placeholder: 'Total crew + passengers' })}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: C.muted }}>
          <input type="checkbox" checked={masterSig} onChange={e => setMasterSig(e.target.checked)} style={{ accentColor: C.flagBlue }} />
          I, the Master, confirm all information is correct. USCG advance notice was submitted.
        </label>
        {submitBtn('Submit Departure Declaration', submitDep, !canSubmit)}
      </div>
    )
  }

  // ── DOMESTIC ROUTE ─────────────────────────────────────────────────────────

  function DomesticView() {
    const [depTime,   setDepTime]   = useState('')
    const [crew,      setCrew]      = useState('')
    const [pax,       setPax]       = useState('')
    const [destination, setDest]   = useState('Salelologa')
    const [masterSig, setMasterSig] = useState(false)

    function submitDomDep() {
      const r = nref('DSSOUT')
      setDomDepRef(r); setSubDomDep(true)
      addAudit({ timestamp: wst(), form: 'Domestic Simplified Departure Notice', reference: r, transmittedTo: 'SPA Port Authority — Mulifanua', status: 'Submitted' })
    }
    const canSub = !!depTime && !!crew && !!pax && masterSig

    return (
      <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sHead("Simplified Departure Notice", "Upolu ↔ Savaiʻi Domestic Ferry — MWTI / SPA")}

        <div style={{ background: `${C.flagBlue}10`, border: `1px solid ${C.border2}`, borderRadius: 6, padding: '10px 14px', fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          Domestic inter-island routes (Mulifanua ↔ Salelologa) operate under a simplified departure
          notice regime. Full IMO FAL forms are not required for domestic-only crossings. Passenger
          manifests are retained by SSC under MWTI domestic shipping regulations.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {fld('Vessel Name', 'MV Lady Samoa IV', () => {}, { readOnly: true })}
          {fld('IMO Number', '9720192', () => {}, { readOnly: true })}
          {fld('Departure Port', 'Mulifanua, Upolu', () => {}, { readOnly: true })}
          {fld('Destination', destination, setDest, { readOnly: true })}
          {fld('Departure Date / Time', depTime, setDepTime, { type: 'datetime-local' })}
          {fld('Crew on Board', crew, setCrew, { type: 'number' })}
        </div>

        {fld('Passengers on Board', pax, setPax, { type: 'number', placeholder: 'Total passengers boarded' })}

        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 14px' }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 6 }}>SAFETY CHECKLIST</div>
          {[
            'Life jackets and safety equipment checked',
            'Vessel departure log updated',
            'Emergency contact registered with SPA Mulifanua',
          ].map(item => (
            <div key={item} style={{ fontFamily: SANS, fontSize: 12, color: C.dim, padding: '3px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: C.green }}>✓</span> {item}
            </div>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: C.muted }}>
          <input type="checkbox" checked={masterSig} onChange={e => setMasterSig(e.target.checked)} style={{ accentColor: C.flagBlue }} />
          Master's declaration: all information is accurate and vessel is cleared for departure.
        </label>

        {subDomDep
          ? confirmation([`✓ Simplified Departure Notice submitted — ${domDepRef}`, 'Transmitted to: SPA Port Authority — Mulifanua', `${wst()} WST`])
          : submitBtn('Submit Departure Notice', submitDomDep, !canSub)
        }
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const intlTabs: Array<{ id: IntlTab; label: string }> = [
    { id: 'pre-arrival', label: 'PRE-ARRIVAL' },
    { id: 'fal-forms',   label: 'FAL FORMS'   },
    { id: 'clearance',   label: 'CLEARANCE'   },
    { id: 'departure',   label: 'DEPARTURE'   },
  ]

  return (
    <div style={{ padding: 24 }}>

      {/* Route selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 8, letterSpacing: '1px' }}>SELECT ROUTE</div>
        <div style={{ display: 'flex', gap: 0 }}>
          {SSC_ROUTES.map(r => (
            <button key={r.id} onClick={() => setRouteId(r.id)}
              style={{
                background:   routeId === r.id ? C.flagBlue : C.surface2,
                border:       `1px solid ${routeId === r.id ? C.flagBlue : C.border}`,
                borderRadius: r.id === 'INTERNATIONAL' ? '4px 0 0 4px' : '0 4px 4px 0',
                color:        routeId === r.id ? '#fff' : C.muted,
                cursor:       'pointer',
                fontFamily:   MONO,
                fontSize:     11,
                fontWeight:   routeId === r.id ? 700 : 400,
                padding:      '9px 18px',
                letterSpacing:'1px',
              }}>
              {r.id === 'INTERNATIONAL' ? '🌍 ' : '⚓ '}{r.label}
            </button>
          ))}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 4 }}>
          {route.ports.join(' ↔ ')} · SSC — Samoa Shipping Corporation
        </div>
      </div>

      {routeId === 'DOMESTIC'
        ? <DomesticView />
        : (
          <>
            {/* International tab bar */}
            <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
              {intlTabs.map(t => (
                <button key={t.id} onClick={() => setIntlTab(t.id)}
                  style={{ background: intlTab === t.id ? C.surface2 : 'none', border: 'none', borderBottom: intlTab === t.id ? `2px solid ${C.flagBlue}` : '2px solid transparent', color: intlTab === t.id ? C.text : C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 10, letterSpacing: '1.5px', padding: '10px 18px', transition: 'all 0.15s' }}>
                  {t.label}
                </button>
              ))}
            </div>

            {intlTab === 'pre-arrival' && <IntlPreArrival />}
            {intlTab === 'fal-forms'   && <IntlFalForms />}
            {intlTab === 'clearance'   && <IntlClearance />}
            {intlTab === 'departure'   && <IntlDeparture />}
          </>
        )
      }

      <AuditLog entries={audit} />
    </div>
  )
}
