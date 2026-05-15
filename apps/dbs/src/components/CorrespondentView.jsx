import { CORRESPONDENT_BANKS } from '../data/bank-registry';
import { StatusBadge } from '@samoa-dpi/shared-ui';

export function CorrespondentView({ lang }) {
  return (
    <div data-panel>
      <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px',
                   fontWeight: 600, color: 'var(--color-text)', marginBottom: '16px' }}>
        {lang === 'sm' ? 'Faletupe Fesoʻotaiga' : 'Pacific Correspondent & Settlement Banks'}
      </h2>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'var(--color-muted)', marginBottom: '16px' }}>
        {lang === 'sm'
          ? 'Faletupe e fesoasoani i faʻauʻuga a le WST-DPI i fafo.'
          : 'International clearing relationships enabling WST-DPI cross-border settlement and redemption.'}
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            {['Institution', 'Role', 'Coverage', 'Status'].map(h => (
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
          {CORRESPONDENT_BANKS.map((bank, i) => (
            <tr key={bank.name} style={{
              background: i % 2 === 0 ? 'transparent' : 'var(--color-surface)'
            }}>
              <td style={{ padding: '10px 12px', fontWeight: 500,
                           borderBottom: '1px solid var(--color-border)' }}>
                {bank.name}
                {bank.swiftCode && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                                color: 'var(--color-muted)' }}>{bank.swiftCode}</div>
                )}
              </td>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)',
                           fontSize: '11px', color: 'var(--color-gold)',
                           borderBottom: '1px solid var(--color-border)' }}>
                {bank.role}
              </td>
              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)',
                           fontSize: '11px', color: 'var(--color-muted)',
                           borderBottom: '1px solid var(--color-border)' }}>
                {bank.coverage}
              </td>
              <td style={{ padding: '10px 12px',
                           borderBottom: '1px solid var(--color-border)' }}>
                <StatusBadge status="active" lang={lang} />
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
