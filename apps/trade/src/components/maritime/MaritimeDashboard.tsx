import React, { useState } from 'react'
import { C, SANS } from '../../constants'
import { NoticeOfArrival } from './NoticeOfArrival'
import { FALForm1 } from './FALForm1'
import { FALForm5 } from './FALForm5'
import { FALForm7 } from './FALForm7'
import { MaritimeHealthDecl } from './MaritimeHealthDecl'
import { HarbourDuesPayment } from './HarbourDuesPayment'
import { PortClearanceCert } from './PortClearanceCert'
import { ClearanceStatusBoard } from './ClearanceStatusBoard'
import { OfficerClearanceQueue } from './OfficerClearanceQueue'
import type { TopRole, OfficerSubRole } from '../../types'

type AgentStep = 1 | 2 | 3 | 4 | 5 | 6 | 7

interface Props {
  role:           TopRole
  officerSubRole: OfficerSubRole | null
  lang:           string
}

export function MaritimeDashboard({ role, officerSubRole, lang }: Props) {
  const [step, setStep]         = useState<AgentStep>(1)
  const [noaRef, setNoaRef]     = useState('')
  const [payRef, setPayRef]     = useState('')
  const [showStatus, setStatus] = useState(false)

  // Officer view
  if (role === 'officer') {
    return (
      <div style={{ padding: '24px' }}>
        {officerSubRole
          ? <OfficerClearanceQueue officerSubRole={officerSubRole} />
          : <div style={{ fontFamily: SANS, fontSize: 14, color: C.muted }}>Select your sub-role to view your clearance queue.</div>
        }
      </div>
    )
  }

  // Shipping Agent / Master — step wizard
  if (showStatus) {
    return (
      <div style={{ padding: '24px' }}>
        <button onClick={() => setStatus(false)} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '8px 14px', marginBottom: 16, minHeight: 36 }}>
          ← Back to submission
        </button>
        <ClearanceStatusBoard />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Step progress indicator */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {([1,2,3,4,5,6,7] as AgentStep[]).map(s => (
          <div
            key={s}
            aria-label={`Step ${s} ${s < step ? 'completed' : s === step ? 'current' : 'upcoming'}`}
            style={{
              width:        28,
              height:       6,
              borderRadius: 3,
              background:   s < step ? C.green : s === step ? C.flagBlue : C.border,
              transition:   'background 0.2s',
            }}
          />
        ))}
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: C.muted, marginLeft: 8, alignSelf: 'center' }}>
          Step {step} of 7
        </span>
      </div>

      {step === 1 && (
        <NoticeOfArrival
          lang={lang}
          onNext={ref => { setNoaRef(ref); setStep(2) }}
        />
      )}
      {step === 2 && (
        <FALForm1
          lang={lang}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <FALForm5
          lang={lang}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <FALForm7
          lang={lang}
          shown={false}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && (
        <MaritimeHealthDecl
          lang={lang}
          onNext={() => setStep(6)}
          onBack={() => setStep(4)}
        />
      )}
      {step === 6 && (
        <HarbourDuesPayment
          lang={lang}
          onNext={ref => { setPayRef(ref); setStep(7) }}
          onBack={() => setStep(5)}
        />
      )}
      {step === 7 && (
        <>
          <PortClearanceCert
            lang={lang}
            payRef={payRef || noaRef}
            onBack={() => setStep(6)}
          />
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setStatus(true)}
              style={{ background: `${C.flagBlue}20`, border: `1px solid ${C.flagBlue}40`, borderRadius: 6, color: C.info, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: '10px 18px', minHeight: 40 }}
            >
              📋 View Live Clearance Status Board
            </button>
          </div>
        </>
      )}
    </div>
  )
}
