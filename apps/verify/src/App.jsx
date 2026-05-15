import { useState } from 'react';
import { ResearchGate, TimestampDisplay } from '@samoa-dpi/shared-ui';
import { lookupRecord } from './data/mock-records';

const STRINGS = {
  heading:       { en: 'Verify a Government Record',         sm: 'Faʻamaonia se Faamaumauga' },
  subheading:    { en: 'Enter the reference number from your government document.', sm: 'Tuu le numera faasinomaga mai lou pepa.' },
  placeholder:   { en: 'e.g. SAM-0001-2026',                sm: 'e.g. SAM-0001-2026' },
  button:        { en: 'Verify →',                           sm: 'Faʻamaonia →' },
  verified:      { en: '✓  Verified by the Government of Samoa', sm: '✓  Faʻamaoniaina e le Malo o Samoa' },
  pending:       { en: '⏳  Verification Pending',           sm: '⏳  O Loʻo Faʻatalii' },
  notfound:      { en: '✗  Record Not Found',                sm: '✗  E Le Maua le Faamaumauga' },
  ministry:      { en: 'Issuing Ministry',                   sm: 'Matagaluega' },
  service:       { en: 'Service Type',                       sm: 'Ituaiga Tautua' },
  date:          { en: 'Record Date',                        sm: 'Aso o le Faamaumauga' },
  print:         { en: 'Print / Save PDF',                   sm: 'Lolomi / Sefe PDF' },
  reset:         { en: 'Check another →',                    sm: 'Siaki se isi →' },
  notfound_body: { en: 'This reference number is not in the system. Check the number and try again, or contact the issuing ministry.', sm: 'E leʻi maua lenei numera i le faiga. Siaki le numera ma taumafai toe.' },
  research:      { en: 'Research prototype · Not production · No real records held', sm: 'Suʻesuʻega · E leʻo galuega moni' },
};

const t = (lang, key) => STRINGS[key]?.[lang] || STRINGS[key]?.en || key;

const RESULT_STYLES = {
  Verified: { bg: '#f0fff8', border: '#00c896', color: '#007a4d', chip: '#e6fff5' },
  Pending:  { bg: '#fffbf0', border: '#f0b429', color: '#7a5c00', chip: '#fff8e0' },
  NotFound: { bg: '#fff5f5', border: '#ff3b4e', color: '#7a0010', chip: '#ffe5e5' },
};

export default function App() {
  const [lang, setLang]           = useState('sm');  // Verify: Samoan default
  const [ref, setRef]             = useState('');
  const [result, setResult]       = useState(null);
  const [searched, setSearched]   = useState(false);

  function handleVerify() {
    const r = lookupRecord(ref);
    setResult(r);
    setSearched(true);
  }

  function handleReset() {
    setRef(''); setResult(null); setSearched(false);
  }

  const style = result ? RESULT_STYLES[result.status] || RESULT_STYLES.NotFound : null;

  return (
    <ResearchGate storageKey="sdpi_verify_acknowledged">
      <div style={{ minHeight: '100vh', background: '#f8f9fc',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '40px 20px' }}>

        {/* Language toggle */}
        <div style={{ position: 'fixed', top: '16px', right: '16px' }}
             data-print-hide>
          <button onClick={() => setLang(l => l === 'en' ? 'sm' : 'en')}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px',
                     color: '#6b7280', background: 'white',
                     border: '1px solid #e2e6f0', borderRadius: '4px',
                     padding: '4px 12px', cursor: 'pointer' }}>
            {lang === 'en' ? 'SM' : 'EN'}
          </button>
        </div>

        {/* Identity */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
          <div style={{ width: '28px', height: '5px', background: '#CE1126', borderRadius: '2px' }} />
          <div style={{ width: '28px', height: '5px', background: '#003087', borderRadius: '2px' }} />
        </div>

        <div style={{ width: '100%', maxWidth: '480px',
                      display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Heading */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '18px',
                         fontWeight: 700, color: '#1a2035', marginBottom: '8px' }}>
              {t(lang, 'heading')}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              {t(lang, 'subheading')}
            </p>
          </div>

          {/* VER-1 — Input form */}
          {!searched && (
            <div style={{ background: 'white', borderRadius: '8px',
                          border: '1px solid #e2e6f0',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                value={ref}
                onChange={e => setRef(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && ref.trim() && handleVerify()}
                placeholder={t(lang, 'placeholder')}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '16px',
                  padding: '14px 16px', border: '2px solid #e2e6f0',
                  borderRadius: '6px', outline: 'none',
                  transition: 'border-color 0.15s', width: '100%',
                  letterSpacing: '1px',
                }}
                onFocus={e => e.target.style.borderColor = '#003087'}
                onBlur={e => e.target.style.borderColor = '#e2e6f0'}
                aria-label={t(lang, 'placeholder')}
              />
              <button
                onClick={handleVerify}
                disabled={!ref.trim()}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 600,
                  padding: '14px', background: ref.trim() ? '#003087' : '#c5ccd8',
                  color: 'white', border: 'none', borderRadius: '6px',
                  cursor: ref.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.15s', minHeight: '48px',
                }}>
                {t(lang, 'button')}
              </button>
            </div>
          )}

          {/* VER-1 — Result */}
          {searched && result && (
            <div className="verify-result-card" style={{
              background: style.chip, border: `2px solid ${style.border}`,
              borderRadius: '8px', padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px',
                             fontWeight: 700, color: style.color, marginBottom: '16px' }}>
                {t(lang, result.status === 'Verified' ? 'verified'
                        : result.status === 'Pending'  ? 'pending'
                        : 'notfound')}
              </div>

              {result.status !== 'NotFound' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: t(lang, 'ministry'), value: result.ministry },
                    { label: t(lang, 'service'),  value: result.service },
                    { label: t(lang, 'date'),
                      value: result.date
                        ? <TimestampDisplay timestamp={result.date} format="date" />
                        : '—' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px',
                                     color: '#6b7280', width: '140px', flexShrink: 0,
                                     textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {row.label}
                      </span>
                      <span style={{ fontSize: '13px', color: '#1a2035', fontWeight: 500 }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                  {result.note && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px',
                                 color: '#6b7280', marginTop: '4px',
                                 padding: '8px 12px', background: 'rgba(0,0,0,0.04)',
                                 borderRadius: '4px', lineHeight: 1.6 }}>
                      {result.note}
                    </p>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
                  {t(lang, 'notfound_body')}
                </p>
              )}

              {/* VER-2 — Print and reset buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}
                   data-print-hide>
                {result.status !== 'NotFound' && (
                  <button onClick={() => window.print()} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '12px',
                    padding: '8px 16px', background: '#003087', color: 'white',
                    border: 'none', borderRadius: '5px', cursor: 'pointer',
                    minHeight: '40px',
                  }}>
                    {t(lang, 'print')}
                  </button>
                )}
                <button onClick={handleReset} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '12px',
                  padding: '8px 16px', background: 'none', color: '#6b7280',
                  border: '1px solid #e2e6f0', borderRadius: '5px', cursor: 'pointer',
                  minHeight: '40px',
                }}>
                  {t(lang, 'reset')}
                </button>
              </div>

              {/* VER-2 — Print header (print-only) */}
              <div style={{ display: 'none' }} className="print-only">
                <div style={{ marginBottom: '16px', paddingBottom: '16px',
                               borderBottom: '2px solid #003087' }}>
                  <strong>GOVERNMENT OF SAMOA — RECORD VERIFICATION</strong><br />
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    Samoa Digital Public Infrastructure · {new Date().toLocaleDateString('en-WS')}
                  </span>
                </div>
                <p><strong>Reference:</strong> {ref}</p>
              </div>
            </div>
          )}

          {/* Research label */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
                       color: '#9ca3af', textAlign: 'center' }}
             data-print-hide>
            {t(lang, 'research')}
          </p>
        </div>
      </div>
    </ResearchGate>
  );
}
