import React, { useState } from 'react'
import { C, MONO, SANS } from '../constants'
import { AuditLog } from './AuditLog'
import type { OMWAuthResult, AuditEntry } from '../types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function wst() {
  return new Date().toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })
}

function genRef(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`
}

function sectionHead(title: string, sub?: string) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: MONO, fontSize: 11, color: C.gold, letterSpacing: '2px', textTransform: 'uppercase' }}>{title}</div>
      {sub && <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function statusBadge(status: string) {
  const map: Record<string, { bg: string; bdr: string; color: string }> = {
    CLEARED:        { bg: C.greenBg,          bdr: C.greenBdr,  color: C.green    },
    PENDING:        { bg: C.amberBg,           bdr: C.amberBdr,  color: C.amber    },
    'UNDER REVIEW': { bg: `${C.flagBlue}18`,   bdr: C.border2,   color: C.info     },
    FLAGGED:        { bg: C.critBg,            bdr: C.critBdr,   color: C.critical },
    APPROVED:       { bg: C.greenBg,           bdr: C.greenBdr,  color: C.green    },
    HELD:           { bg: C.critBg,            bdr: C.critBdr,   color: C.critical },
    STUB:           { bg: C.surface3,          bdr: C.border,    color: C.dim      },
  }
  const s = map[status.toUpperCase()] ?? map['STUB']
  return (
    <span style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: 3, color: s.color, fontFamily: MONO, fontSize: 9, padding: '2px 8px', letterSpacing: '0.5px' }}>
      {status}
    </span>
  )
}

// ── Demo clearance queue ──────────────────────────────────────────────────────

interface QueueEntry {
  ref:       string
  vessel:    string
  imo:       string
  eta:       string
  status:    string
  flagState: string
  agent:     string
}

const DEMO_QUEUE: QueueEntry[] = [
  { ref: 'NOA-2026-0042', vessel: 'MV Pacific Star',   imo: '9234567', eta: '17/05/2026 14:00', status: 'UNDER REVIEW', flagState: 'MH', agent: 'Samoa Shipping Services Ltd' },
  { ref: 'NOA-2026-0039', vessel: 'MV Ofu Cargo',      imo: '8812345', eta: '18/05/2026 09:00', status: 'CLEARED',       flagState: 'WS', agent: 'Pacific Trade & Logistics'  },
  { ref: 'NOA-2026-0041', vessel: 'MV Savaii Explorer', imo: '7654321', eta: '19/05/2026 06:30', status: 'FLAGGED',       flagState: 'FJ', agent: 'Samoan Pacific Shipping Co'  },
]

// ── Customs dashboard ─────────────────────────────────────────────────────────

function CustomsDashboard({ addAudit }: { addAudit: (e: AuditEntry) => void }) {
  const [queue, setQueue] = useState<QueueEntry[]>(DEMO_QUEUE)
  const [selected, setSelected] = useState<QueueEntry | null>(null)
  const [decision, setDecision] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  function handleClear(entry: QueueEntry) {
    const r = genRef('CUS')
    setQueue(prev => prev.map(q => q.ref === entry.ref ? { ...q, status: 'CLEARED' } : q))
    setDecision(`CLEARED`)
    setSelected(null)
    addAudit({ timestamp: wst(), form: 'Customs Clearance — ASYCUDA Assessment', reference: r, transmittedTo: 'Samoa Customs & Revenue — MOR', status: 'CLEARED' })
  }

  function handleHold(entry: QueueEntry) {
    const r = genRef('CUS')
    setQueue(prev => prev.map(q => q.ref === entry.ref ? { ...q, status: 'HELD' } : q))
    setDecision('HELD')
    setSelected(null)
    addAudit({ timestamp: wst(), form: 'Customs Hold — Further Documentation Required', reference: r, transmittedTo: 'Samoa Customs & Revenue — MOR', status: 'HELD' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sectionHead('Customs Clearance Queue', 'Ministry of Revenue — Customs & Excise Division · ASYCUDA World')}

      {decision && (
        <div style={{ background: decision === 'CLEARED' ? C.greenBg : C.critBg, border: `1px solid ${decision === 'CLEARED' ? C.greenBdr : C.critBdr}`, borderRadius: 6, padding: '10px 14px', fontFamily: MONO, fontSize: 11, color: decision === 'CLEARED' ? C.green : C.critical }}>
          ✓ Decision recorded: {decision} at {wst()} WST
        </div>
      )}

      {/* Queue table */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px' }}>
          VESSEL CLEARANCE QUEUE — {queue.length} ENTRIES
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['REFERENCE', 'VESSEL', 'IMO', 'ETA', 'FLAG', 'STATUS', 'ACTION'].map(h => (
                  <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '8px 12px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', letterSpacing: '1px', background: C.surface2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queue.map((q, i) => (
                <tr key={q.ref} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                  <td style={{ fontFamily: MONO, fontSize: 10, color: C.gold, padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>{q.ref}</td>
                  <td style={{ fontFamily: SANS, fontSize: 12, color: C.text, padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>{q.vessel}</td>
                  <td style={{ fontFamily: MONO, fontSize: 10, color: C.muted, padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>{q.imo}</td>
                  <td style={{ fontFamily: MONO, fontSize: 10, color: C.muted, padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>{q.eta}</td>
                  <td style={{ fontFamily: MONO, fontSize: 10, color: C.info, padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>{q.flagState}</td>
                  <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>{statusBadge(q.status)}</td>
                  <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>
                    {q.status !== 'CLEARED' && q.status !== 'HELD' && (
                      <button
                        onClick={() => setSelected(selected?.ref === q.ref ? null : q)}
                        style={{ background: C.surface3, border: `1px solid ${C.border2}`, borderRadius: 4, color: C.text, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 10px' }}
                      >
                        REVIEW
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review panel */}
      {selected && (
        <div style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '2px', marginBottom: 12 }}>CUSTOMS ASSESSMENT — {selected.ref}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              ['Vessel', selected.vessel],
              ['IMO Number', selected.imo],
              ['ETA', selected.eta],
              ['Shipping Agent', selected.agent],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted }}>{l}</div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.text, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginBottom: 4 }}>ASSESSMENT NOTES</div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Enter assessment notes for audit trail..."
              style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 11, padding: 10, width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 60, outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handleClear(selected)} style={{ background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 4, color: C.green, cursor: 'pointer', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '1px', padding: '8px 16px' }}>
              ✓ GRANT CLEARANCE
            </button>
            <button onClick={() => handleHold(selected)} style={{ background: C.critBg, border: `1px solid ${C.critBdr}`, borderRadius: 4, color: C.critical, cursor: 'pointer', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '1px', padding: '8px 16px' }}>
              ✕ HOLD — DOCS REQUIRED
            </button>
          </div>
        </div>
      )}

      {/* ASYCUDA integration note */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 14 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px', marginBottom: 6 }}>ASYCUDA WORLD INTEGRATION</div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          Phase 1: Clearance decisions are logged in-memory. Phase 2: decisions are transmitted via ASYCUDA XML API to the Customs Processing Centre and anchored to the Samoa DPI Chain for immutable audit.
        </div>
      </div>
    </div>
  )
}

// ── MAF Biosecurity dashboard ─────────────────────────────────────────────────

interface BioChecklist {
  pestRisk:       boolean
  soilCheck:      boolean
  animalProducts: boolean
  plantMaterial:  boolean
  seaWater:       boolean
  vector:         boolean
}

function MAFDashboard({ addAudit }: { addAudit: (e: AuditEntry) => void }) {
  const [queue] = useState<QueueEntry[]>(DEMO_QUEUE)
  const [selected, setSelected] = useState<QueueEntry | null>(null)
  const [checklist, setChecklist] = useState<BioChecklist>({
    pestRisk: false, soilCheck: false, animalProducts: false,
    plantMaterial: false, seaWater: false, vector: false,
  })
  const [risk, setRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH' | null>(null)
  const [notes, setNotes] = useState('')
  const [cleared, setCleared] = useState(false)

  function toggleCheck(key: keyof BioChecklist) {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function handleAssess() {
    const flagged = Object.values(checklist).filter(Boolean).length
    const r: 'LOW' | 'MEDIUM' | 'HIGH' = flagged >= 3 ? 'HIGH' : flagged >= 1 ? 'MEDIUM' : 'LOW'
    setRisk(r)
  }

  function handleClear() {
    const r = genRef('MAF')
    setCleared(true)
    setSelected(null)
    addAudit({ timestamp: wst(), form: 'MAF Biosecurity Inspection', reference: r, transmittedTo: 'MAF Biosecurity Division', status: `CLEARED — RISK: ${risk}` })
  }

  const CHECKS: { key: keyof BioChecklist; label: string; desc: string }[] = [
    { key: 'pestRisk',       label: 'Pest Risk Material',       desc: 'Cargo contains potential pest-risk plant or animal material' },
    { key: 'soilCheck',      label: 'Soil / Growing Media',     desc: 'Soil, growing media or earth-moving equipment declared' },
    { key: 'animalProducts', label: 'Animal Products',          desc: 'Meat, dairy, honey, wool, hides or animal products declared' },
    { key: 'plantMaterial',  label: 'Living Plant Material',    desc: 'Seeds, bulbs, tissue cultures, plants in soil declared' },
    { key: 'seaWater',       label: 'Ballast Water',            desc: 'Ballast water exchange not completed in open ocean' },
    { key: 'vector',         label: 'Vector / Quarantine Pest', desc: 'Evidence of live insects, rodents or stowaways' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sectionHead('Biosecurity Inspection Queue', 'Ministry of Agriculture & Fisheries — Biosecurity Division')}

      {/* Queue */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px' }}>
          BIOSECURITY INSPECTION QUEUE
        </div>
        {queue.map((q, i) => (
          <div key={q.ref} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: i < queue.length - 1 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text }}>{q.vessel}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginTop: 2 }}>{q.ref} · ETA {q.eta} · Flag: {q.flagState}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {statusBadge(q.status)}
              <button
                onClick={() => { setSelected(selected?.ref === q.ref ? null : q); setCleared(false); setRisk(null) }}
                style={{ background: C.surface3, border: `1px solid ${C.border2}`, borderRadius: 4, color: C.text, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 10px' }}
              >
                INSPECT
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspection panel */}
      {selected && !cleared && (
        <div style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '2px', marginBottom: 16 }}>
            BIOSECURITY INSPECTION CHECKLIST — {selected.vessel}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {CHECKS.map(c => (
              <label key={c.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checklist[c.key]}
                  onChange={() => toggleCheck(c.key)}
                  style={{ marginTop: 2, accentColor: C.flagBlue }}
                />
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: C.text }}>{c.label}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{c.desc}</div>
                </div>
              </label>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginBottom: 4 }}>INSPECTION NOTES</div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Enter inspection findings..."
              style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 11, padding: 10, width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 60, outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleAssess}
              style={{ background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 4, color: C.text, cursor: 'pointer', fontFamily: MONO, fontSize: 10, padding: '8px 14px' }}
            >
              ASSESS RISK
            </button>
            {risk && (
              <button
                onClick={handleClear}
                style={{ background: risk === 'HIGH' ? C.critBg : C.greenBg, border: `1px solid ${risk === 'HIGH' ? C.critBdr : C.greenBdr}`, borderRadius: 4, color: risk === 'HIGH' ? C.critical : C.green, cursor: 'pointer', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '1px', padding: '8px 16px' }}
              >
                RECORD — RISK {risk}
              </button>
            )}
          </div>
          {risk && (
            <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 10, color: risk === 'HIGH' ? C.critical : risk === 'MEDIUM' ? C.amber : C.green }}>
              {risk === 'HIGH' ? '⚠ High biosecurity risk — further action required' : risk === 'MEDIUM' ? '⚠ Medium risk — monitor and document' : '✓ Low risk — standard clearance applicable'}
            </div>
          )}
        </div>
      )}

      {cleared && (
        <div style={{ background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: '12px 16px', fontFamily: MONO, fontSize: 11, color: C.green }}>
          ✓ Biosecurity inspection recorded at {wst()} WST
        </div>
      )}
    </div>
  )
}

// ── Port Health dashboard ─────────────────────────────────────────────────────

function PortHealthDashboard({ addAudit }: { addAudit: (e: AuditEntry) => void }) {
  const [queue] = useState<QueueEntry[]>(DEMO_QUEUE)
  const [selected, setSelected] = useState<QueueEntry | null>(null)
  const [illnessOnBoard,     setIllnessOnBoard]     = useState(false)
  const [deathOnBoard,       setDeathOnBoard]       = useState(false)
  const [validCert,          setValidCert]          = useState(true)
  const [vaccinations,       setVaccinations]       = useState(true)
  const [pratique,           setPratique]           = useState(false)
  const [pratiqueRef,        setPratiqueRef]        = useState('')

  function handleGrantPratique() {
    const r = genRef('FP')
    setPratiqueRef(r)
    setPratique(true)
    addAudit({ timestamp: wst(), form: 'Free Pratique — WHO IHR 2005', reference: r, transmittedTo: 'Port Health Officer — MOH', status: 'FREE PRATIQUE GRANTED' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sectionHead('Port Health Screening', 'Ministry of Health — Port Health Division · WHO IHR 2005')}

      {/* Info */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 14 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px', marginBottom: 6 }}>WHO IHR 2005 — FREE PRATIQUE</div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          Free Pratique is the permission granted to a ship to enter a port, embark or disembark, discharge or load cargo or stores after the vessel's Maritime Declaration of Health has been assessed.
          Authority: WHO International Health Regulations 2005.
        </div>
      </div>

      {/* Queue */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px' }}>
          PORT HEALTH SCREENING QUEUE
        </div>
        {queue.map((q, i) => (
          <div key={q.ref} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: i < queue.length - 1 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text }}>{q.vessel}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginTop: 2 }}>{q.ref} · ETA {q.eta}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {statusBadge(q.status)}
              <button
                onClick={() => setSelected(selected?.ref === q.ref ? null : q)}
                style={{ background: C.surface3, border: `1px solid ${C.border2}`, borderRadius: 4, color: C.text, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 10px' }}
              >
                ASSESS
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assessment panel */}
      {selected && (
        <div style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '2px', marginBottom: 16 }}>
            PORT HEALTH ASSESSMENT — {selected.vessel}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Illness on board declared', value: illnessOnBoard, set: setIllnessOnBoard, warn: true },
              { label: 'Death on board declared', value: deathOnBoard, set: setDeathOnBoard, warn: true },
              { label: 'Deratisation certificate valid', value: validCert, set: setValidCert, warn: false },
              { label: 'Crew vaccination records verified', value: vaccinations, set: setVaccinations, warn: false },
            ].map(({ label, value, set, warn }) => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => set(!value)}
                  style={{ accentColor: warn ? C.critical : C.green }}
                />
                <div style={{ fontFamily: MONO, fontSize: 11, color: warn ? (value ? C.critical : C.text) : (value ? C.green : C.muted) }}>
                  {label}
                </div>
              </label>
            ))}
          </div>
          {(illnessOnBoard || deathOnBoard) && (
            <div style={{ background: C.critBg, border: `1px solid ${C.critBdr}`, borderRadius: 4, padding: '8px 12px', marginBottom: 12, fontFamily: MONO, fontSize: 10, color: C.critical }}>
              ⚠ Public health alert conditions declared — refer to Medical Officer of Health before granting free pratique
            </div>
          )}
          {!pratique ? (
            <button
              onClick={handleGrantPratique}
              disabled={illnessOnBoard || deathOnBoard || !validCert}
              style={{
                background:   (illnessOnBoard || deathOnBoard || !validCert) ? C.surface3 : C.greenBg,
                border:       `1px solid ${(illnessOnBoard || deathOnBoard || !validCert) ? C.border : C.greenBdr}`,
                borderRadius: 4,
                color:        (illnessOnBoard || deathOnBoard || !validCert) ? C.dim : C.green,
                cursor:       (illnessOnBoard || deathOnBoard || !validCert) ? 'not-allowed' : 'pointer',
                fontFamily:   MONO,
                fontSize:     10,
                fontWeight:   700,
                letterSpacing: '1px',
                padding:      '8px 16px',
              }}
            >
              GRANT FREE PRATIQUE
            </button>
          ) : (
            <div style={{ background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: '10px 14px' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: C.green }}>✓ FREE PRATIQUE GRANTED</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginTop: 4 }}>Reference: {pratiqueRef}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>Issued: {wst()} WST</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── SPA Port Authority dashboard ──────────────────────────────────────────────

const BERTHS = [
  { code: 'APIA_MAIN',     name: 'Apia Main Wharf',        status: 'OCCUPIED',   vessel: 'MV Pacific Star',    loa: 142.5 },
  { code: 'APIA_DOMESTIC', name: 'Apia Domestic Wharf',    status: 'AVAILABLE',  vessel: null,                 loa: null  },
  { code: 'SALELOLOGA',    name: 'Salelologa Wharf',       status: 'ASSIGNED',   vessel: 'MV Savaii Explorer', loa: 98.5  },
]

function SPADashboard({ addAudit }: { addAudit: (e: AuditEntry) => void }) {
  const [berths, setBerths] = useState(BERTHS)
  const [duesVessel, setDuesVessel] = useState('MV Pacific Star')
  const [gt, setGt] = useState('12450')
  const [vesselType, setVesselType] = useState('CARGO')
  const [crew, setCrew] = useState('18')
  const [duesRef, setDuesRef] = useState('')
  const [duesPaid, setDuesPaid] = useState(false)
  const [departure, setDeparture] = useState<QueueEntry | null>(null)
  const [departureRef, setDepartureRef] = useState('')

  const RATE: Record<string, number> = { CARGO: 0.42, TANKER: 0.55, PASSENGER: 0.38, BULK: 0.40, OTHER: 0.35 }
  const gtVal    = parseFloat(gt) || 0
  const crewVal  = parseInt(crew) || 0
  const duesAmt  = gtVal * (RATE[vesselType] ?? 0.42) + crewVal * 50 + 500

  function handlePayDues() {
    const r = genRef('CBS')
    setDuesRef(r)
    setDuesPaid(true)
    addAudit({ timestamp: wst(), form: 'Harbour Dues — CBS Payment Gateway', reference: r, transmittedTo: 'Central Bank of Samoa (CBS) · SPA Port Authority', status: 'PAID — CBS CLEARED' })
  }

  function handleDeparture() {
    const r = genRef('DC')
    setDepartureRef(r)
    setDeparture(DEMO_QUEUE[0])
    addAudit({ timestamp: wst(), form: 'Departure Clearance Certificate', reference: r, transmittedTo: 'SPA Port Authority · All agencies', status: 'DEPARTURE CLEARED' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sectionHead('SPA Port Operations', 'Samoa Ports Authority · Berth Management · Harbour Dues')}

      {/* Berth status board */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: '1.5px' }}>
          BERTH STATUS BOARD
        </div>
        {berths.map((b, i) => {
          const color = b.status === 'AVAILABLE' ? C.green : b.status === 'OCCUPIED' ? C.critical : C.amber
          const bg    = b.status === 'AVAILABLE' ? C.greenBg : b.status === 'OCCUPIED' ? C.critBg : C.amberBg
          const bdr   = b.status === 'AVAILABLE' ? C.greenBdr : b.status === 'OCCUPIED' ? C.critBdr : C.amberBdr
          return (
            <div key={b.code} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: i < berths.length - 1 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text }}>{b.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginTop: 2 }}>
                  {b.vessel ? `${b.vessel} · LOA ${b.loa}m` : 'No vessel assigned'}
                </div>
              </div>
              <span style={{ background: bg, border: `1px solid ${bdr}`, borderRadius: 3, color, fontFamily: MONO, fontSize: 9, padding: '2px 8px' }}>
                {b.status}
              </span>
              {b.status === 'AVAILABLE' && (
                <button
                  onClick={() => setBerths(prev => prev.map(bx => bx.code === b.code ? { ...bx, status: 'ASSIGNED', vessel: 'MV Ofu Cargo', loa: 112.0 } : bx))}
                  style={{ marginLeft: 10, background: C.surface3, border: `1px solid ${C.border2}`, borderRadius: 4, color: C.text, cursor: 'pointer', fontFamily: MONO, fontSize: 9, padding: '3px 10px' }}
                >
                  ASSIGN
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Harbour dues calculator */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '2px', marginBottom: 12 }}>HARBOUR DUES CALCULATOR — CBS PAYMENT GATEWAY</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 4 }}>Vessel</div>
            <input value={duesVessel} onChange={e => setDuesVessel(e.target.value)} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '8px 10px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 4 }}>Vessel Type</div>
            <select value={vesselType} onChange={e => setVesselType(e.target.value)} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '8px 10px', outline: 'none', width: '100%' }}>
              {['CARGO', 'TANKER', 'PASSENGER', 'BULK', 'OTHER'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 4 }}>Gross Tonnage</div>
            <input type="number" value={gt} onChange={e => setGt(e.target.value)} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '8px 10px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 4 }}>Crew Count</div>
            <input type="number" value={crew} onChange={e => setCrew(e.target.value)} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '8px 10px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ background: C.surface2, borderRadius: 6, padding: '12px 16px', marginBottom: 12 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginBottom: 4 }}>DUES BREAKDOWN</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>GT rate ({vesselType}): WST {(gtVal * (RATE[vesselType] ?? 0.42)).toFixed(2)}</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>Crew wharfage (×{crewVal} × WST 50): WST {(crewVal * 50).toFixed(2)}</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>Port entry fee: WST 500.00</div>
          <div style={{ fontFamily: MONO, fontSize: 14, color: C.gold, fontWeight: 700, marginTop: 8 }}>TOTAL: WST {duesAmt.toFixed(2)}</div>
        </div>
        {!duesPaid ? (
          <button onClick={handlePayDues} style={{ background: C.flagBlue, border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '1px', padding: '10px 18px' }}>
            PROCESS VIA CBS PAYMENT GATEWAY →
          </button>
        ) : (
          <div style={{ background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: '10px 14px' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.green }}>✓ HARBOUR DUES PAID — CBS CLEARED</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginTop: 4 }}>Reference: {duesRef} · {wst()} WST</div>
          </div>
        )}
      </div>

      {/* Departure clearance queue */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, letterSpacing: '2px', marginBottom: 12 }}>DEPARTURE CLEARANCE</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {DEMO_QUEUE.map((q, i) => (
            <div key={q.ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: i % 2 === 0 ? C.surface2 : C.surface3, borderRadius: 4 }}>
              <div>
                <span style={{ fontFamily: SANS, fontSize: 12, color: C.text }}>{q.vessel}</span>
                <span style={{ fontFamily: MONO, fontSize: 9, color: C.muted, marginLeft: 8 }}>{q.ref}</span>
              </div>
              {statusBadge(q.status)}
            </div>
          ))}
        </div>
        {!departure ? (
          <button onClick={handleDeparture} style={{ background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 4, color: C.text, cursor: 'pointer', fontFamily: MONO, fontSize: 10, padding: '8px 16px' }}>
            ISSUE DEPARTURE CLEARANCE — MV PACIFIC STAR
          </button>
        ) : (
          <div style={{ background: C.greenBg, border: `1px solid ${C.greenBdr}`, borderRadius: 6, padding: '10px 14px' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.green }}>✓ DEPARTURE CLEARANCE ISSUED</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginTop: 4 }}>Reference: {departureRef} · {wst()} WST</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  session: OMWAuthResult
}

type GovTab = 'queue' | 'assess' | 'reports'

export function GovOfficerDashboard({ session }: Props) {
  const [audit, setAudit] = useState<AuditEntry[]>([])

  function addAudit(entry: AuditEntry) {
    setAudit(prev => [entry, ...prev])
  }

  const agency = session.agency ?? 'CUSTOMS'

  const agencyLabel: Record<string, { label: string; color: string }> = {
    CUSTOMS:    { label: 'Ministry of Revenue — Customs & Excise', color: C.amber  },
    MAF:        { label: 'Ministry of Agriculture & Fisheries',     color: C.green  },
    PORT_HEALTH:{ label: 'Ministry of Health — Port Health',        color: C.info   },
    SPA:        { label: 'Samoa Ports Authority',                   color: C.gold   },
  }

  const al = agencyLabel[agency] ?? agencyLabel['CUSTOMS']

  return (
    <div style={{ fontFamily: SANS, color: C.text }}>
      {/* Role header */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.amber, letterSpacing: '2px' }}>ZONE 2 — RESTRICTED OFFICIAL</div>
          <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.text, marginTop: 2 }}>{session.label}</div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: al.color, marginTop: 2 }}>{al.label}</div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>
          Auth: {new Date(session.authedAt).toLocaleString('en-WS', { timeZone: 'Pacific/Apia', hour12: false })} WST
        </div>
      </div>

      {/* Agency-specific dashboard */}
      {agency === 'CUSTOMS'     && <CustomsDashboard     addAudit={addAudit} />}
      {agency === 'MAF'         && <MAFDashboard          addAudit={addAudit} />}
      {agency === 'PORT_HEALTH' && <PortHealthDashboard   addAudit={addAudit} />}
      {agency === 'SPA'         && <SPADashboard          addAudit={addAudit} />}

      <AuditLog entries={audit} />
    </div>
  )
}
