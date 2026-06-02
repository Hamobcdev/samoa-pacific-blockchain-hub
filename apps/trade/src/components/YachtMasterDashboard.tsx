import React, { useState } from 'react'
import { C, MONO, SANS, DEMO_CLEARANCE_YACHT } from '../constants'
import { AuditLog } from './AuditLog'
import type { OMWAuthResult, AuditEntry } from '../types'

function wst() {
  return new Date().toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })
}

function nref() {
  return `NOA-YT-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`
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

function confirmation(lines: string[]) {
  return (
    <div style={{ background: `${C.green}10`, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: '12px 16px', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lines.map((l, i) => <div key={i} style={{ fontFamily: MONO, fontSize: 11, color: i === 0 ? C.green : C.muted }}>{l}</div>)}
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

type Tab = 'declaration' | 'fal-forms' | 'clearance' | 'outward'

interface Props {
  session: OMWAuthResult
}

export function YachtMasterDashboard({ session: _session }: Props) {
  const [tab, setTab] = useState<Tab>('declaration')
  const [audit, setAudit] = useState<AuditEntry[]>([])

  const [noaRef,    setNoaRef]    = useState('')
  const [subNOA,    setSubNOA]    = useState(false)
  const [subFal1,   setSubFal1]   = useState(false)
  const [subPob,    setSubPob]    = useState(false)
  const [subOutward,setSubOutward]= useState(false)
  const [outRef,    setOutRef]    = useState('')

  function addAudit(e: AuditEntry) { setAudit(a => [e, ...a]) }

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'declaration', label: "MASTER'S DECLARATION" },
    { id: 'fal-forms',   label: 'FAL FORMS'           },
    { id: 'clearance',   label: 'CLEARANCE STATUS'    },
    { id: 'outward',     label: 'OUTWARD CLEARANCE'   },
  ]

  // ── MASTER'S DECLARATION ───────────────────────────────────────────────────

  function DeclarationTab() {
    const [f, setF] = useState({
      vesselName:  'SV Pacific Dream',
      vesselType:  'YACHT',
      hullId:      '',
      length:      '',
      flagState:   '',
      homePort:    '',
      masterName:  '',
      nationality: '',
      passportNo:  '',
      personsAboard:'',
      lastPort:    '',
      eta:         '',
      portOfEntry: 'Apia, Independent State of Samoa',
      purposeOfVisit:'Tourism / Recreation',
    })
    const [declarations, setDeclarations] = useState({
      noContraband:  false,
      noStowaways:   false,
      healthyCrew:   false,
      noAnimals:     false,
      masterConfirm: false,
    })

    const allDeclared = Object.values(declarations).every(Boolean)
    const requiredFilled = !!f.vesselName && !!f.masterName && !!f.eta && !!f.flagState

    function submitNOA() {
      const r = nref()
      setNoaRef(r); setSubNOA(true)
      addAudit({ timestamp: wst(), form: "Master's Pre-Arrival Declaration — Pleasure Craft", reference: r, transmittedTo: 'SPA · Customs · Port Health · MAF Biosecurity', status: 'Submitted' })
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 680 }}>
        {sHead("Master's Pre-Arrival Declaration", "Pleasure Craft / Small Craft · SPA Harbour Master")}

        <div style={{ background: `${C.flagBlue}10`, border: `1px solid ${C.border2}`, borderRadius: 6, padding: '10px 14px', fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          All pleasure craft and yachts must submit a Pre-Arrival Declaration at least 24 hours before
          arrival at the Port of Apia. Foreign-flagged yachts must have a valid ship's papers and crew
          passports on board for inspection. Harbour dues apply (minimum WST 350.00).
        </div>

        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 6 }}>VESSEL DETAILS</div>
          {grid2([
            fld('Vessel Name', f.vesselName, v => setF(x => ({ ...x, vesselName: v }))),
            fld('Hull ID / Registration No', f.hullId, v => setF(x => ({ ...x, hullId: v })), { placeholder: 'e.g. FJ-2023-001' }),
            fld('Vessel Length (m)', f.length, v => setF(x => ({ ...x, length: v })), { type: 'number', placeholder: 'm LOA' }),
            fld('Flag State', f.flagState, v => setF(x => ({ ...x, flagState: v })), { placeholder: 'e.g. NZ, AU, FJ' }),
            fld('Home Port', f.homePort, v => setF(x => ({ ...x, homePort: v }))),
            fld('Vessel Type', f.vesselType, v => setF(x => ({ ...x, vesselType: v })), { readOnly: true }),
          ])}
        </div>

        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 6 }}>MASTER DETAILS</div>
          {grid2([
            fld("Master's Name", f.masterName, v => setF(x => ({ ...x, masterName: v }))),
            fld('Nationality', f.nationality, v => setF(x => ({ ...x, nationality: v }))),
            fld('Passport Number', f.passportNo, v => setF(x => ({ ...x, passportNo: v }))),
            fld('Total Persons Aboard', f.personsAboard, v => setF(x => ({ ...x, personsAboard: v })), { type: 'number' }),
          ])}
        </div>

        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 6 }}>VOYAGE DETAILS</div>
          {grid2([
            fld('Last Port of Call', f.lastPort, v => setF(x => ({ ...x, lastPort: v }))),
            fld('Port of Entry (Samoa)', f.portOfEntry, v => setF(x => ({ ...x, portOfEntry: v })), { readOnly: true }),
            fld('Estimated Date / Time of Arrival', f.eta, v => setF(x => ({ ...x, eta: v })), { type: 'datetime-local' }),
            fld('Purpose of Visit', f.purposeOfVisit, v => setF(x => ({ ...x, purposeOfVisit: v }))),
          ])}
        </div>

        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '14px 16px' }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.gold, letterSpacing: '1px', marginBottom: 10 }}>MASTER'S DECLARATIONS</div>
          {([
            ['noContraband',  'No prohibited or undeclared goods on board'],
            ['noStowaways',   'No stowaways on board'],
            ['healthyCrew',   'No illness or infectious disease among persons on board'],
            ['noAnimals',     'No live animals on board (or declared below if applicable)'],
            ['masterConfirm', 'I confirm all information is accurate to the best of my knowledge'],
          ] as const).map(([key, label]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: C.muted, padding: '4px 0' }}>
              <input type="checkbox" checked={declarations[key]} onChange={e => setDeclarations(d => ({ ...d, [key]: e.target.checked }))} style={{ accentColor: C.flagBlue }} />
              {label}
            </label>
          ))}
        </div>

        {subNOA
          ? confirmation([
              `✓ Pre-Arrival Declaration Submitted`,
              `Reference: ${noaRef}`,
              `Transmitted to: SPA · Customs · Port Health · MAF Biosecurity`,
              `Please proceed to the FAL Forms tab to submit FAL Form 1 and Persons on Board list.`,
              `${wst()} WST`,
            ])
          : submitBtn("Submit Pre-Arrival Declaration", submitNOA, !requiredFilled || !allDeclared)
        }
      </div>
    )
  }

  // ── FAL FORMS ─────────────────────────────────────────────────────────────

  function FalFormsTab() {
    const [f1, setF1] = useState({
      vesselName: 'SV Pacific Dream', callSign: '', flagState: '', masterName: '',
      arrivalPort: 'Apia, Independent State of Samoa', eta: '', lastPort: '',
    })
    const [pobRows, setPobRows] = useState([
      { name: '', nationality: '', passportNo: '', dob: '', role: 'Crew' },
    ])

    function submitFal1() {
      setSubFal1(true)
      addAudit({ timestamp: wst(), form: 'FAL Form 1 — General Declaration (Yacht)', reference: noaRef || nref(), transmittedTo: 'SPA · Customs · MAF · Port Health', status: 'Submitted' })
    }
    function submitPob() {
      setSubPob(true)
      addAudit({ timestamp: wst(), form: 'Persons on Board List (FAL 5 simplified)', reference: noaRef || nref(), transmittedTo: 'Immigration · Port Health', status: 'Submitted' })
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
        {sHead('FAL Forms — Simplified (Pleasure Craft)', 'IMO FAL Convention 2024 · Small Craft Annex')}

        {noaRef && (
          <div style={{ background: `${C.green}08`, border: `1px solid ${C.greenBdr}`, borderRadius: 4, padding: '8px 12px', fontFamily: MONO, fontSize: 10, color: C.green }}>
            Pre-Arrival Reference: {noaRef} — Vessel details pre-filled
          </div>
        )}

        {/* FAL 1 simplified */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ background: C.surface2, padding: '10px 14px', fontFamily: MONO, fontSize: 11, color: C.text, fontWeight: 600 }}>
            FAL Form 1 — General Declaration (Simplified)
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {grid2([
              fld('Vessel Name', f1.vesselName, v => setF1(x => ({ ...x, vesselName: v }))),
              fld('Call Sign (if any)', f1.callSign, v => setF1(x => ({ ...x, callSign: v })), { placeholder: 'Optional for pleasure craft' }),
              fld('Flag State', f1.flagState, v => setF1(x => ({ ...x, flagState: v }))),
              fld("Master's Name", f1.masterName, v => setF1(x => ({ ...x, masterName: v }))),
              fld('Port of Arrival', f1.arrivalPort, v => setF1(x => ({ ...x, arrivalPort: v })), { readOnly: true }),
              fld('ETA', f1.eta, v => setF1(x => ({ ...x, eta: v })), { type: 'datetime-local' }),
              fld('Last Port of Call', f1.lastPort, v => setF1(x => ({ ...x, lastPort: v }))),
            ])}
            {!subFal1
              ? submitBtn('Submit FAL Form 1', submitFal1)
              : confirmation(['✓ FAL Form 1 submitted', `Transmitted: SPA · Customs · MAF · Port Health`, `${wst()} WST`])
            }
          </div>
        </div>

        {/* Persons on Board list */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ background: C.surface2, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.text, fontWeight: 600 }}>Persons on Board List (FAL 5 simplified)</span>
            <span style={{ fontFamily: MONO, fontSize: 8, color: C.info, background: `${C.flagBlue}20`, border: `1px solid ${C.flagBlue}40`, borderRadius: 3, padding: '1px 6px' }}>All persons aboard — crew and guests</span>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
                <thead>
                  <tr>{['Full Name','Nationality','Passport No','Date of Birth','Role'].map(h => <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '4px 8px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {pobRows.map((row, i) => (
                    <tr key={i}>
                      {(['name','nationality','passportNo','dob'] as const).map(k => (
                        <td key={k} style={{ padding: 4 }}>
                          <input
                            type={k === 'dob' ? 'date' : 'text'}
                            value={row[k]}
                            onChange={e => { const n=[...pobRows]; n[i]={...n[i],[k]:e.target.value}; setPobRows(n) }}
                            style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px', width: k === 'dob' ? 120 : 100 }}
                          />
                        </td>
                      ))}
                      <td style={{ padding: 4 }}>
                        <select value={row.role} onChange={e => { const n=[...pobRows]; n[i]={...n[i],role:e.target.value}; setPobRows(n) }}
                          style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, fontFamily: MONO, fontSize: 11, padding: '4px 6px' }}>
                          {['Crew','Crew/Owner','Guest','Family'].map(r => <option key={r}>{r}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setPobRows(x => [...x, { name:'',nationality:'',passportNo:'',dob:'',role:'Guest' }])}
              style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 8px', alignSelf: 'flex-start' }}>+ Add Person</button>
            {!subPob
              ? submitBtn('Submit Persons on Board List', submitPob)
              : confirmation(['✓ Persons on Board List submitted', 'Transmitted: Immigration · Port Health', `${wst()} WST`])
            }
          </div>
        </div>
      </div>
    )
  }

  // ── CLEARANCE STATUS ───────────────────────────────────────────────────────

  function ClearanceTab() {
    const clr = DEMO_CLEARANCE_YACHT

    const statusColor = (s: string) => s === 'CLEARED' ? C.green : s === 'AWAITING_DOCS' ? C.amber : s === 'PENDING' ? C.muted : C.dim
    const statusBg    = (s: string) => s === 'CLEARED' ? `${C.green}10` : s === 'AWAITING_DOCS' ? `${C.amber}18` : C.surface2

    return (
      <div style={{ maxWidth: 680 }}>
        {sHead('Clearance Status', `${clr.vesselName} · ${clr.vesselRef}`)}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '12px 16px' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginBottom: 4 }}>VESSEL</div>
            <div style={{ fontFamily: MONO, fontSize: 13, color: C.text }}>{clr.vesselName}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>IMO/Reg: {clr.imoNumber}</div>
          </div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '12px 16px' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginBottom: 4 }}>HARBOUR DUES</div>
            <div style={{ fontFamily: MONO, fontSize: 13, color: C.text }}>WST {clr.duesAmount}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: clr.duesStatus === 'PAID' ? C.green : C.amber }}>
              {clr.duesStatus === 'PAID' ? '✓ Paid' : '○ Pending payment'}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 8 }}>FORM SUBMISSIONS</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {clr.formStatuses.map((f, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                  <td style={{ fontFamily: SANS, fontSize: 12, color: C.text, padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>{f.label}</td>
                  <td style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ background: f.status === 'SUBMITTED' ? `${C.green}10` : C.surface2, border: `1px solid ${f.status === 'SUBMITTED' ? C.greenBdr : C.border}`, borderRadius: 3, color: f.status === 'SUBMITTED' ? C.green : C.muted, fontFamily: MONO, fontSize: 9, padding: '2px 8px' }}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 8 }}>AGENCY CLEARANCES</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Agency','Status','Cleared At'].map(h => <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.dim, padding: '6px 10px', borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {clr.ministryStatuses.map(m => (
                <tr key={m.code}>
                  <td style={{ fontFamily: SANS, fontSize: 12, color: C.text, padding: '9px 10px', borderBottom: `1px solid ${C.border}` }}>{m.ministry}</td>
                  <td style={{ padding: '9px 10px', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ background: statusBg(m.status), border: `1px solid ${statusColor(m.status)}40`, borderRadius: 3, color: statusColor(m.status), fontFamily: MONO, fontSize: 9, padding: '2px 8px' }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ fontFamily: MONO, fontSize: 10, color: C.dim, padding: '9px 10px', borderBottom: `1px solid ${C.border}` }}>
                    {m.clearedAt ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 10 }}>
          Demo data: SV Pacific Dream · NOA-YT-2026-0001 · Pleasure craft clearance
        </div>
      </div>
    )
  }

  // ── OUTWARD CLEARANCE ─────────────────────────────────────────────────────

  function OutwardTab() {
    const [atd,       setAtd]       = useState('')
    const [nextPort,  setNextPort]  = useState('')
    const [pob,       setPob]       = useState('')
    const [storasDec, setStorasDec] = useState(false)
    const [masterSig, setMasterSig] = useState(false)

    const canSubmit = !!atd && !!nextPort && !!pob && storasDec && masterSig

    function submitOut() {
      const r = `YT-OUT-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`
      setOutRef(r); setSubOutward(true)
      addAudit({ timestamp: wst(), form: 'Yacht Outward Clearance Notice', reference: r, transmittedTo: 'SPA Harbour Master', status: 'Submitted' })
    }

    if (subOutward) return (
      <div style={{ maxWidth: 540 }}>
        {sHead('Outward Clearance', 'SPA Harbour Master')}
        {confirmation([
          '✓ Outward Clearance Notice submitted',
          `Reference: ${outRef}`,
          `Vessel cleared for departure.`,
          `Bon voyage — fair winds and following seas.`,
          `${wst()} WST`,
        ])}
      </div>
    )

    return (
      <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sHead('Outward Clearance Notice', 'Pleasure Craft Departure · SPA Harbour Master')}

        <div style={{ background: `${C.flagBlue}10`, border: `1px solid ${C.border2}`, borderRadius: 6, padding: '10px 14px', fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          Pleasure craft are required to obtain outward clearance from the Harbour Master before
          departing Samoan waters. Present this form and ship's papers at the Harbour Master's office,
          Apia Port.
        </div>

        {grid2([
          fld('Vessel Name', 'SV Pacific Dream', () => {}, { readOnly: true }),
          fld('NOA Reference', noaRef || DEMO_CLEARANCE_YACHT.vesselRef, () => {}, { readOnly: true }),
          fld('Actual Time of Departure', atd, setAtd, { type: 'datetime-local' }),
          fld('Next Port of Call', nextPort, setNextPort, { placeholder: 'e.g. Vava\'u, Tonga' }),
        ])}
        {fld('Total Persons on Board at Departure', pob, setPob, { type: 'number' })}

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: C.muted }}>
          <input type="checkbox" checked={storasDec} onChange={e => setStorasDec(e.target.checked)} style={{ accentColor: C.flagBlue }} />
          Ship's stores and provisions declaration is complete. All goods for voyage use only.
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: MONO, fontSize: 11, color: C.muted }}>
          <input type="checkbox" checked={masterSig} onChange={e => setMasterSig(e.target.checked)} style={{ accentColor: C.flagBlue }} />
          I, the Master, declare the vessel is seaworthy and all persons on board have been advised of the voyage plan.
        </label>

        {submitBtn('Submit Outward Clearance Notice', submitOut, !canSubmit)}
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ background: tab === t.id ? C.surface2 : 'none', border: 'none', borderBottom: tab === t.id ? `2px solid ${C.flagBlue}` : '2px solid transparent', color: tab === t.id ? C.text : C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 10, letterSpacing: '1.5px', padding: '10px 18px', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'declaration' && <DeclarationTab />}
      {tab === 'fal-forms'   && <FalFormsTab />}
      {tab === 'clearance'   && <ClearanceTab />}
      {tab === 'outward'     && <OutwardTab />}

      <AuditLog entries={audit} />
    </div>
  )
}
