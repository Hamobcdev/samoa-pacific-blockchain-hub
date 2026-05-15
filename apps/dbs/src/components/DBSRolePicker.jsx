import { TIER_2_BANKS } from '../data/bank-registry';

export function DBSRolePicker({ onSelect, lang }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', gap: '24px',
    }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <div style={{ width: '28px', height: '5px', background: 'var(--color-flag-red)', borderRadius: '2px' }} />
        <div style={{ width: '28px', height: '5px', background: 'var(--color-flag-blue)', borderRadius: '2px' }} />
      </div>
      <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px',
                   fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.3px' }}>
        WST-DPI DISTRIBUTION PORTAL
      </h1>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'var(--color-muted)', textAlign: 'center', maxWidth: '380px' }}>
        {lang === 'sm'
          ? 'Filifili lau matafaioi e fesootai ai'
          : 'Select your access role to continue'}
      </p>

      <div style={{ display: 'grid', gap: '10px', width: '100%', maxWidth: '480px' }}>
        {/* DBS Staff */}
        <button onClick={() => onSelect('DBS_STAFF', null)} style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderLeft: '3px solid var(--color-gold)',
          borderRadius: '6px', padding: '16px 20px', cursor: 'pointer',
          textAlign: 'left', transition: 'all 0.15s ease',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-gold)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px',
                        fontWeight: 600, color: 'var(--color-gold)' }}>
            DBS Staff
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                        color: 'var(--color-muted)', marginTop: '3px' }}>
            View all Tier 2 distributors and Tier 3 participants
          </div>
        </button>

        {/* Bank Officers */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                      color: 'var(--color-muted)', textTransform: 'uppercase',
                      letterSpacing: '1px', marginTop: '4px' }}>
          Bank Officer — select your institution:
        </div>
        {TIER_2_BANKS.map(bank => (
          <button key={bank.code} onClick={() => onSelect('BANK_OFFICER', bank.code)} style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderLeft: '3px solid #003087',
            borderRadius: '6px', padding: '12px 20px', cursor: 'pointer',
            textAlign: 'left', transition: 'all 0.15s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-flag-blue)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px',
                          fontWeight: 600, color: 'var(--color-text)' }}>
              {bank.name}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                          color: 'var(--color-muted)', marginTop: '2px' }}>
              {bank.code} · {bank.swiftCode}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
