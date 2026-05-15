import { useState } from 'react';
import { ResearchGate, LanguageProvider, useLang } from '@samoa-dpi/shared-ui';
import { GrantLifecycleView } from './components/GrantLifecycleView';
import { DEMO_GRANTS } from './data/grants';

function DonorApp() {
  const { lang } = useLang();
  const [selectedId, setSelectedId] = useState('1');
  const grant = DEMO_GRANTS.find(g => g.grantId === selectedId);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <header style={{ borderBottom: '1px solid var(--color-border)',
                       padding: '16px 24px', display: 'flex',
                       alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: '20px', height: '4px', background: 'var(--color-flag-red)', borderRadius: '2px' }} />
          <div style={{ width: '20px', height: '4px', background: 'var(--color-flag-blue)', borderRadius: '2px' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px',
                       fontWeight: 600, color: 'var(--color-text)' }}>
          {lang === 'sm' ? 'FAʻAALIA O MANAOGA' : 'DEVELOPMENT PARTNER OVERSIGHT'}
        </span>
        {/* DONOR-2 — Export button */}
        <button onClick={() => window.print()}
          style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)',
                   fontSize: '11px', color: 'var(--color-gold)',
                   background: 'none',
                   border: '1px solid rgba(201,162,39,0.4)',
                   borderRadius: '4px', padding: '6px 16px', cursor: 'pointer' }}
          data-print-hide>
          Export PDF / Print
        </button>
      </header>

      {/* Grant selector */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)',
                    display: 'flex', gap: '8px', flexWrap: 'wrap' }}
           data-print-hide>
        {DEMO_GRANTS.map(g => (
          <button key={g.grantId} onClick={() => setSelectedId(g.grantId)} style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '6px 14px',
            borderRadius: '4px', cursor: 'pointer',
            border: '1px solid ' + (selectedId === g.grantId
              ? 'var(--color-gold)' : 'var(--color-border)'),
            background: selectedId === g.grantId
              ? 'rgba(201,162,39,0.08)' : 'none',
            color: selectedId === g.grantId
              ? 'var(--color-gold)' : 'var(--color-muted)',
          }}>
            Grant #{g.grantId} — {g.grantor}
          </button>
        ))}
      </div>

      <main style={{ padding: '24px' }}>
        <GrantLifecycleView grant={grant} lang={lang} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ResearchGate storageKey="sdpi_donor_acknowledged">
      <LanguageProvider defaultLang="en">
        <DonorApp />
      </LanguageProvider>
    </ResearchGate>
  );
}
