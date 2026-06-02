import React, { useState } from 'react'
import { C, MONO, SANS, DEMO_STA_ARRIVALS } from '../constants'
import type { OMWAuthResult } from '../types'

function sHead(title: string, sub?: string) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: MONO, fontSize: 11, color: C.gold, letterSpacing: '2px', textTransform: 'uppercase' }}>{title}</div>
      {sub && <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

type Tab = 'arrivals' | 'operators' | 'vessels'

interface Props {
  session: OMWAuthResult
}

const DEMO_OPERATORS = [
  { id: 'STE-001', name: 'Samoa Scenic Tours',          type: 'Land / Cultural',    capacity: 40, contact: '+685 21 001', status: 'ACTIVE' },
  { id: 'STE-002', name: 'Pacific Ocean Adventures',     type: 'Water Sports',       capacity: 20, contact: '+685 22 340', status: 'ACTIVE' },
  { id: 'STE-003', name: 'Falefa Falls Guided Walks',    type: 'Eco / Hiking',       capacity: 15, contact: '+685 23 811', status: 'ACTIVE' },
  { id: 'STE-004', name: 'Apia Craft Market Transfers',  type: 'Shopping / Transfer', capacity: 50, contact: '+685 25 012', status: 'ACTIVE' },
  { id: 'STE-005', name: 'Palolo Deep Snorkelling',      type: 'Marine / Snorkelling',capacity: 12, contact: '+685 24 558', status: 'ACTIVE' },
  { id: 'STE-006', name: 'Savai\'i Day Excursion',       type: 'Inter-island / Cultural',capacity: 30,contact: '+685 53 291', status: 'CONDITIONAL' },
]

export function STADashboard({ session: _session }: Props) {
  const [tab, setTab] = useState<Tab>('arrivals')
  const [selectedArrival, setSelectedArrival] = useState<number | null>(null)

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'arrivals',  label: 'UPCOMING ARRIVALS'      },
    { id: 'operators', label: 'SHORE EXCURSION OPS'    },
    { id: 'vessels',   label: 'VESSEL INFORMATION'     },
  ]

  // ── UPCOMING ARRIVALS ──────────────────────────────────────────────────────

  function ArrivalsTab() {
    return (
      <div style={{ maxWidth: 800 }}>
        {sHead('Upcoming Cruise Vessel Arrivals', 'Read-Only — STA Tourism Coordination View')}

        <div style={{ background: `${C.flagBlue}08`, border: `1px solid ${C.border2}`, borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          This view shows cruise vessel arrivals notified to STA by the Samoa Port Authority.
          STA has read-only access to arrival data. Clearance and port operations are managed by SPA and Zone 2 agencies.
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Notification Ref','Vessel','ETA','Type','Pax Ashore','Shore Window','Status'].map(h => (
                <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '8px 10px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEMO_STA_ARRIVALS.map((a, i) => {
              const isConfirmed = a.status === 'CONFIRMED'
              const isPending   = a.status === 'PENDING'
              return (
                <tr key={a.notificationRef}
                  onClick={() => setSelectedArrival(selectedArrival === i ? null : i)}
                  style={{ background: selectedArrival === i ? `${C.flagBlue}08` : i % 2 === 0 ? 'transparent' : C.surface2, cursor: 'pointer', transition: 'background 0.1s' }}>
                  <td style={{ fontFamily: MONO, fontSize: 10, color: C.info, padding: '10px 10px', borderBottom: `1px solid ${C.border}` }}>{a.notificationRef}</td>
                  <td style={{ fontFamily: SANS, fontSize: 13, color: C.text, padding: '10px 10px', borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>{a.vesselName}</td>
                  <td style={{ fontFamily: MONO, fontSize: 10, color: C.text, padding: '10px 10px', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{a.eta}</td>
                  <td style={{ fontFamily: MONO, fontSize: 10, color: C.muted, padding: '10px 10px', borderBottom: `1px solid ${C.border}` }}>{a.vesselType}</td>
                  <td style={{ fontFamily: MONO, fontSize: 12, color: C.text, padding: '10px 10px', borderBottom: `1px solid ${C.border}`, textAlign: 'right' }}>
                    {a.passengersAshore.toLocaleString()}
                  </td>
                  <td style={{ fontFamily: MONO, fontSize: 10, color: C.muted, padding: '10px 10px', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>
                    {a.shoreWindowFrom} – {a.shoreWindowTo}
                  </td>
                  <td style={{ padding: '10px 10px', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{
                      background:   isConfirmed ? `${C.green}10` : isPending ? `${C.amber}18` : `${C.critical}10`,
                      border:       `1px solid ${isConfirmed ? C.greenBdr : isPending ? C.amberBdr : C.critBdr}`,
                      borderRadius: 3, fontFamily: MONO, fontSize: 9, padding: '2px 8px',
                      color:        isConfirmed ? C.green : isPending ? C.amber : C.critical,
                    }}>
                      {isConfirmed ? '● ' : isPending ? '○ ' : '✕ '}{a.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Expanded row detail */}
        {selectedArrival !== null && (() => {
          const a = DEMO_STA_ARRIVALS[selectedArrival]
          return (
            <div style={{ border: `1px solid ${C.border2}`, borderRadius: 6, padding: '16px 20px', marginTop: 12, background: `${C.flagBlue}06` }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.gold, letterSpacing: '1.5px', marginBottom: 10 }}>ARRIVAL DETAIL — {a.notificationRef}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[
                  { label: 'Vessel Name',         val: a.vesselName },
                  { label: 'ETA',                 val: a.eta },
                  { label: 'Vessel Type',          val: a.vesselType },
                  { label: 'Passengers Ashore',   val: a.passengersAshore.toLocaleString() },
                  { label: 'Shore Window',         val: `${a.shoreWindowFrom} – ${a.shoreWindowTo}` },
                  { label: 'Notification Status',  val: a.status },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>{label}</div>
                    <div style={{ fontFamily: MONO, fontSize: 12, color: C.text, marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 9, color: C.dim }}>
                Clearance data is managed by SPA / Zone 2 agencies. STA view is read-only.
              </div>
            </div>
          )
        })()}

        <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 9, color: C.dim }}>
          Showing {DEMO_STA_ARRIVALS.length} scheduled arrivals · STA Cruise Coordination Unit · Phase 1 Demo Data
        </div>
      </div>
    )
  }

  // ── SHORE EXCURSION OPERATORS ──────────────────────────────────────────────

  function OperatorsTab() {
    const [filter, setFilter] = useState('')
    const filtered = DEMO_OPERATORS.filter(op =>
      op.name.toLowerCase().includes(filter.toLowerCase()) ||
      op.type.toLowerCase().includes(filter.toLowerCase())
    )

    return (
      <div style={{ maxWidth: 800 }}>
        {sHead('Registered Shore Excursion Operators', 'STA Registered Operators — Read-Only Directory')}

        <div style={{ background: `${C.flagBlue}08`, border: `1px solid ${C.border2}`, borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          Operators listed below are registered with the Samoa Tourism Authority to offer shore
          excursion services to cruise passengers. Operator management is handled through the STA
          back-office system.
        </div>

        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Filter by name or activity type..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: MONO, fontSize: 12, padding: '8px 12px', outline: 'none', width: '100%', maxWidth: 400, boxSizing: 'border-box' }}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Reg. ID','Operator Name','Activity Type','Max Capacity','Contact','Status'].map(h => (
                <th key={h} style={{ fontFamily: MONO, fontSize: 9, color: C.muted, padding: '8px 10px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((op, i) => (
              <tr key={op.id} style={{ background: i % 2 === 0 ? 'transparent' : C.surface2 }}>
                <td style={{ fontFamily: MONO, fontSize: 10, color: C.dim, padding: '9px 10px', borderBottom: `1px solid ${C.border}` }}>{op.id}</td>
                <td style={{ fontFamily: SANS, fontSize: 13, color: C.text, padding: '9px 10px', borderBottom: `1px solid ${C.border}`, fontWeight: 500 }}>{op.name}</td>
                <td style={{ fontFamily: MONO, fontSize: 10, color: C.muted, padding: '9px 10px', borderBottom: `1px solid ${C.border}` }}>{op.type}</td>
                <td style={{ fontFamily: MONO, fontSize: 12, color: C.text, padding: '9px 10px', borderBottom: `1px solid ${C.border}`, textAlign: 'right' }}>{op.capacity}</td>
                <td style={{ fontFamily: MONO, fontSize: 10, color: C.muted, padding: '9px 10px', borderBottom: `1px solid ${C.border}` }}>{op.contact}</td>
                <td style={{ padding: '9px 10px', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{
                    background:   op.status === 'ACTIVE' ? `${C.green}10` : `${C.amber}18`,
                    border:       `1px solid ${op.status === 'ACTIVE' ? C.greenBdr : C.amberBdr}`,
                    borderRadius: 3, fontFamily: MONO, fontSize: 9, padding: '2px 8px',
                    color:        op.status === 'ACTIVE' ? C.green : C.amber,
                  }}>
                    {op.status === 'ACTIVE' ? '● ACTIVE' : '◐ CONDITIONAL'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim, padding: '20px 10px', textAlign: 'center' }}>No operators match filter.</div>
        )}
        <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 9, color: C.dim }}>
          {filtered.length} of {DEMO_OPERATORS.length} operators shown · STA Registration Database · Phase 1 Demo Data
        </div>
      </div>
    )
  }

  // ── VESSEL INFORMATION ─────────────────────────────────────────────────────

  function VesselsTab() {
    const [selected, setSelected] = useState(0)
    const vessel = DEMO_STA_ARRIVALS[selected]

    return (
      <div style={{ maxWidth: 800 }}>
        {sHead('Vessel Information', 'STA Read-Only · Port clearance data excluded')}

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {DEMO_STA_ARRIVALS.map((a, i) => (
            <button key={a.notificationRef} onClick={() => setSelected(i)}
              style={{ background: selected === i ? C.flagBlue : C.surface2, border: `1px solid ${selected === i ? C.flagBlue : C.border}`, borderRadius: 4, color: selected === i ? '#fff' : C.muted, cursor: 'pointer', fontFamily: MONO, fontSize: 10, padding: '7px 14px' }}>
              {a.vesselName}
            </button>
          ))}
        </div>

        <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          {/* Vessel header */}
          <div style={{ background: C.surface2, borderBottom: `1px solid ${C.border}`, padding: '14px 18px' }}>
            <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 700, color: C.text }}>{vessel.vesselName}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginTop: 2 }}>{vessel.vesselType} · {vessel.notificationRef}</div>
          </div>

          {/* Vessel details */}
          <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { label: 'Vessel Type',          val: vessel.vesselType       },
              { label: 'ETA (Apia)',            val: vessel.eta              },
              { label: 'Passengers Ashore',     val: vessel.passengersAshore.toLocaleString() },
              { label: 'Shore Window (From)',   val: vessel.shoreWindowFrom  },
              { label: 'Shore Window (To)',     val: vessel.shoreWindowTo    },
              { label: 'Notification Status',   val: vessel.status           },
            ].map(({ label, val }) => (
              <div key={label} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: MONO, fontSize: 13, color: C.text }}>{val}</div>
              </div>
            ))}
          </div>

          {/* STA coordination notes */}
          <div style={{ padding: '14px 18px', background: `${C.amber}06`, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.gold, marginBottom: 8, letterSpacing: '1px' }}>STA COORDINATION NOTES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                `Shore excursion operators should be briefed 48 hours before ETA.`,
                `Passenger count (${vessel.passengersAshore}) confirmed with SSC / shipping agent.`,
                `All operators must hold valid STA registration certificates.`,
                `STA tourism officers to be on-site from ${vessel.shoreWindowFrom} WST.`,
              ].map((note, i) => (
                <div key={i} style={{ fontFamily: SANS, fontSize: 12, color: C.muted, display: 'flex', gap: 8 }}>
                  <span style={{ color: C.gold, flexShrink: 0 }}>›</span> {note}
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '10px 18px', borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>
              PORT CLEARANCE DATA — NOT AVAILABLE TO STA · Zone 2 restricted · Contact SPA for clearance queries
            </div>
          </div>
        </div>
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

      <div style={{ marginBottom: 12 }}>
        <span style={{ background: `${C.amber}12`, border: `1px solid ${C.amberBdr}`, borderRadius: 3, fontFamily: MONO, fontSize: 9, color: C.amber, padding: '2px 10px', letterSpacing: '1px' }}>
          READ-ONLY VIEW · ZONE 2 · SAMOA TOURISM AUTHORITY
        </span>
      </div>

      {tab === 'arrivals'  && <ArrivalsTab />}
      {tab === 'operators' && <OperatorsTab />}
      {tab === 'vessels'   && <VesselsTab />}
    </div>
  )
}
