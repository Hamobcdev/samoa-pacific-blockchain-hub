import { StatusBadge } from '@samoa-dpi/shared-ui';
import { TIER_3_PARTICIPANTS } from '../data/bank-registry';

export function InstitutionalView({ lang }) {
  return (
    <div data-panel>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px',
                     fontWeight: 600, color: 'var(--color-text)' }}>
          {lang === 'sm' ? 'Faʻalapotopotoga (Tier 3)' : 'Tier 3 — Institutional Participants'}
        </h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px',
                    color: 'var(--color-muted)', marginTop: '4px' }}>
          {lang === 'sm'
            ? 'E maua WST-DPI e ala i lo latou faletupe faʻatonu.'
            : 'Receive WST-DPI through their Tier 2 banking partner. Read-only compliance view.'}
        </p>
      </div>

      <div style={{ display: 'grid', gap: '8px' }}>
        {TIER_3_PARTICIPANTS.map(inst => (
          <div key={inst.code} style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderLeft: '3px solid var(--color-gold)',
            borderRadius: '6px', padding: '14px 16px',
            display: 'grid', gridTemplateColumns: '180px 1fr 1fr', gap: '12px',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px',
                             fontWeight: 600, color: 'var(--color-gold)' }}>
                {inst.code}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>
                {inst.name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                             color: 'var(--color-muted)', marginTop: '2px' }}>
                {inst.type}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                             color: 'var(--color-muted)', textTransform: 'uppercase',
                             letterSpacing: '0.5px', marginBottom: '3px' }}>
                Banking Partner
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px',
                             color: 'var(--color-text)' }}>
                {inst.bankingPartner}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                             color: 'var(--color-muted)', marginTop: '2px' }}>
                {inst.note}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px',
                           alignItems: 'flex-start' }}>
              <StatusBadge status="active" lang={lang} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
                padding: '2px 8px', borderRadius: '3px',
                background: 'var(--color-green-bg)', color: 'var(--color-green)',
                border: '1px solid rgba(0,200,150,0.3)'
              }}>
                ✓ {inst.complianceStatus}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px',
                    color: 'var(--color-muted)', marginTop: '12px',
                    paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
        Data: Simulated · Phase 1 Research Environment · Not production data
      </div>
    </div>
  );
}
