import React from 'react'
import { C, MONO, SANS } from '../../constants'
import { useClearanceStatus } from '../../hooks/useClearanceStatus'
import { ClearanceChip } from '../shared/ClearanceChip'

const STATUS_ICON: Record<string, string> = {
  SUBMITTED:      '✅',
  CLEARED:        '✅',
  PENDING:        '⚠️',
  AWAITING_DOCS:  '⏳',
  AWAITING_PRIOR: '🔒',
  NOT_REQUIRED:   '➖',
  CBS_HELD:       '⊘',
}

export function ClearanceStatusBoard() {
  const { record, lastUpdated } = useClearanceStatus('NOA-2026-0042')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.gold, fontWeight: 700 }}>
            CLEARANCE STATUS — {record.vesselName}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>
            {record.formRef} · ETA: {record.eta} WST
          </div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>
          Last updated: {lastUpdated}
        </div>
      </div>

      {/* Form statuses */}
      <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Form Submissions
        </div>
        {record.formStatuses.map((fs, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden="true" style={{ fontSize: 14 }}>{STATUS_ICON[fs.status] ?? '?'}</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: fs.status === 'NOT_REQUIRED' ? C.dim : C.muted }}>{fs.label}</span>
            </div>
            <ClearanceChip status={fs.status} size="sm" />
          </div>
        ))}
      </div>

      {/* Ministry clearances */}
      <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Ministry Clearances
        </div>
        {record.ministryStatuses.map((ms, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden="true" style={{ fontSize: 14 }}>{STATUS_ICON[ms.status] ?? '?'}</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.text }}>{ms.ministry}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {ms.clearedAt && (
                <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>{ms.clearedAt}</span>
              )}
              {ms.status === 'PENDING' && (
                <span style={{ fontFamily: MONO, fontSize: 10, color: C.amber }}>Est. 2–4hrs</span>
              )}
              <ClearanceChip status={ms.status} size="sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Dues and cert status */}
      <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>Harbour Dues</span>
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
            <span style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>Port Clearance Certificate</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: C.amber }}>3 of 5 cleared</span>
            <ClearanceChip status="PENDING" size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
