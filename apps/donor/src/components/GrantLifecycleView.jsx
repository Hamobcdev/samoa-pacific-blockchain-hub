import { AmountDisplay, SettlementChip, TimestampDisplay } from '@samoa-dpi/shared-ui';

export function GrantLifecycleView({ grant, lang }) {
  if (!grant) return null;

  const releasedTranches = grant.tranches.filter(t => t.status === 'Final');
  const releasedTotal = releasedTranches.reduce((sum, t) => {
    // BigInt to avoid float — safe for WST integer sene amounts
    return (BigInt(sum) + BigInt(t.amountRaw)).toString();
  }, '0');

  return (
    <div data-panel style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Grant header */}
      <div style={{ background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderLeft: '3px solid var(--color-gold)',
                    borderRadius: '6px', padding: '16px 20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                      color: 'var(--color-muted)', letterSpacing: '1px',
                      textTransform: 'uppercase', marginBottom: '6px' }}>
          Grant #{grant.grantId} · {grant.grantorType}
        </div>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '15px',
                     fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
          {grant.title}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-muted)',
                    marginBottom: '12px', lineHeight: 1.6 }}>
          {grant.purpose}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total Grant',      value: (
                <div>
                  <AmountDisplay amount={grant.totalAmountRaw} currencyCode={grant.currency} size="lg" />
                  {grant.confirmed === false && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                                  color: '#f0b429', marginTop: '4px' }}>
                      Indicative — Application Pending
                    </div>
                  )}
                </div>
              )
            },
            { label: 'Released to Date', value: <AmountDisplay amount={releasedTotal} currencyCode={grant.currency} size="lg" /> },
            { label: 'Recipient',        value: grant.recipient },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px',
                            color: 'var(--color-muted)', letterSpacing: '1px',
                            textTransform: 'uppercase', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px',
                            fontWeight: 600, color: 'var(--color-text)' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tranche timeline */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px',
                     color: 'var(--color-muted)', textTransform: 'uppercase',
                     letterSpacing: '1px', marginBottom: '12px' }}>
          {lang === 'sm' ? 'Faʻasologa o Totogi' : 'Disbursement Tranches'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {grant.tranches.map((tranche, i) => (
            <div key={tranche.id} style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderLeft: tranche.status === 'Final'
                ? '3px solid var(--color-green)'
                : tranche.status === 'Confirming'
                ? '3px solid var(--color-amber)'
                : '3px solid var(--color-border)',
              borderRadius: '6px', padding: '14px 16px',
              display: 'grid',
              gridTemplateColumns: '40px 1fr auto auto',
              gap: '16px', alignItems: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px',
                             fontWeight: 700, color: 'var(--color-muted)',
                             textAlign: 'center' }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500,
                              marginBottom: '4px' }}>
                  {tranche.description}
                </div>
                {tranche.releasedAt && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                                color: 'var(--color-muted)' }}>
                    Released: <TimestampDisplay timestamp={tranche.releasedAt} />
                  </div>
                )}
                {tranche.txHash && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                                color: 'var(--color-muted)' }}>
                    Tx: {tranche.txHash}
                  </div>
                )}
              </div>
              <AmountDisplay
                amount={tranche.amountRaw}
                currencyCode={grant.currency}
              />
              <SettlementChip status={tranche.status} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px',
                    color: 'var(--color-muted)', paddingTop: '8px',
                    borderTop: '1px solid var(--color-border)' }}>
        Data: Simulated · Phase 1 Research Environment · Not production data
      </div>
    </div>
  );
}
