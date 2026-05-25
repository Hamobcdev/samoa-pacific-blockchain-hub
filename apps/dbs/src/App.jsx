import { useState } from 'react';
import { ResearchGate, LanguageProvider, useLang, FeatureGate } from '@samoa-dpi/shared-ui';
import { BankRegistryView }  from './components/BankRegistryView';
import { InstitutionalView } from './components/InstitutionalView';
import { CorrespondentView } from './components/CorrespondentView';
import { DBSAuthGate }       from './components/DBSAuthGate';

const TABS = [
  { id: 'banks',         label: { en: 'Retail Distributors', sm: 'Faʻasoa Tau' } },
  { id: 'institutional', label: { en: 'Institutional',       sm: 'Faʻalapotopotoga' } },
  { id: 'correspondent', label: { en: 'Correspondent Banks', sm: 'Faletupe' } },
];

function DBSApp() {
  const { lang } = useLang();
  const [auth, setAuth]           = useState(null);
  const [activeTab, setActiveTab] = useState('banks');

  if (!auth) return (
    <DBSAuthGate
      onAuthenticated={(role, inst, label) => setAuth({ role, inst, label })}
    />
  );

  const role     = auth.role;
  const bankCode = auth.inst;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--color-border)',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: '20px', height: '4px', background: 'var(--color-flag-red)', borderRadius: '2px' }} />
          <div style={{ width: '20px', height: '4px', background: 'var(--color-flag-blue)', borderRadius: '2px' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px',
                       fontWeight: 600, color: 'var(--color-text)' }}>
          WST-DPI DISTRIBUTION PORTAL
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                       color: 'var(--color-muted)', marginLeft: 'auto' }}>
          {auth.label}
        </span>
        <button onClick={() => setAuth(null)}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                   color: 'var(--color-muted)', background: 'none',
                   border: '1px solid var(--color-border)', borderRadius: '4px',
                   padding: '3px 10px', cursor: 'pointer' }}
          data-print-hide>
          Sign Out
        </button>
      </header>

      {/* Tab bar */}
      <nav style={{ display: 'flex', gap: '4px', padding: '12px 24px',
                    borderBottom: '1px solid var(--color-border)' }}
           data-print-hide>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              padding: '6px 14px', borderRadius: '4px', cursor: 'pointer',
              border: '1px solid ' + (activeTab === tab.id
                ? 'var(--color-gold)' : 'var(--color-border)'),
              background: activeTab === tab.id
                ? 'rgba(201,162,39,0.08)' : 'none',
              color: activeTab === tab.id
                ? 'var(--color-gold)' : 'var(--color-muted)',
            }}>
            {tab.label[lang]}
          </button>
        ))}
      </nav>

      {/* Panel */}
      <main style={{ padding: '24px' }}>
        {activeTab === 'banks'         && <BankRegistryView role={role} bankCode={bankCode} lang={lang} />}
        {activeTab === 'institutional' && <InstitutionalView lang={lang} />}
        {activeTab === 'correspondent' && <CorrespondentView lang={lang} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ResearchGate storageKey="sdpi_dbs_acknowledged">
      <LanguageProvider defaultLang="en">
        <DBSApp />
      </LanguageProvider>
    </ResearchGate>
  );
}
