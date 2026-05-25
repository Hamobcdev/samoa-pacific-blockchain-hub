import { AmountDisplay, SettlementChip, TimestampDisplay,
         StatusBadge } from '@samoa-dpi/shared-ui';
import { useDBS } from '../hooks/useDBS';

export function BankRegistryView({ role, bankCode, lang }) {
  const { tier2Banks } = useDBS(role, bankCode);

  return (
    <div data-panel>
      <div style={{ display: 'flex', alignItems: 'center',
                    marginBottom: '16px', gap: '12px' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px',
                     fontWeight: 600, color: 'var(--color-text)' }}>
          {lang === 'sm' ? 'Faletupe Faʻasoa Tau (Tier 2)' : 'Tier 2 — Licensed Retail Distributors'}
        </h2>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                       color: 'var(--color-muted)', marginLeft: 'auto' }}>
          {tier2Banks.length} {lang === 'sm' ? 'faletupe' : 'institutions'}
        </span>
        <button onClick={() => window.print()}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                   color: 'var(--color-muted)', background: 'none',
                   border: '1px solid var(--color-border)', borderRadius: '4px',
                   padding: '3px 10px', cursor: 'pointer' }}
          data-print-hide>
          Export / Print
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            {['Code', 'Institution', 'Status', 'Daily Limit (WST)', 'Settlement Bank', 'Compliance'].map(h => (
              <th key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px',
                                   color: 'var(--color-muted)', padding: '8px 12px',
                                   borderBottom: '1px solid var(--color-border)',
                                   textAlign: 'left', textTransform: 'uppercase',
                                   letterSpacing: '1px', background: 'var(--color-surface)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tier2Banks.map((bank, i) => (
            <tr key={bank.code} style={{
              background: i % 2 === 0 ? 'transparent' : 'var(--color-surface)'
            }}>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)',
                           fontSize: '11px', color: 'var(--color-gold)',
                           fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>
                {bank.code}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 500 }}>{bank.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                              color: 'var(--color-muted)' }}>{bank.swiftCode}</div>
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)' }}>
                <StatusBadge status={bank.status === 'Active' ? 'active' : 'offline'} lang={lang} />
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)',
                           textAlign: 'right' }}>
                <AmountDisplay
                  amount={bank.dailyLimitRaw}
                  currencyCode="WST"
                  decimals={2}
                />
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)',
                           fontFamily: 'var(--font-mono)', fontSize: '11px',
                           color: 'var(--color-muted)' }}>
                {bank.settlementBank}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
                  padding: '2px 8px', borderRadius: '3px',
                  background: 'var(--color-green-bg)', color: 'var(--color-green)',
                  border: '1px solid rgba(0,200,150,0.3)'
                }}>
                  ✓ {bank.complianceStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px',
                    color: 'var(--color-muted)', marginTop: '12px',
                    paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
        Data: Simulated · Phase 1 Research Environment · Not production data
      </div>
    </div>
  );
}
