import { useState } from 'react';
import VerifyFooter from './VerifyFooter';

// ─── helpers ──────────────────────────────────────────────────────────────────

function CollapsibleSection({ title, subtitle, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid #e2e6f0', borderRadius: '8px', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: '16px 20px',
          background: open ? '#f0f4ff' : 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left',
        }}
      >
        <div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            fontWeight: 700,
            color: '#1a2035',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '3px', fontFamily: "'IBM Plex Mono', monospace" }}>
              {subtitle}
            </div>
          )}
        </div>
        <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '12px', flexShrink: 0 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div style={{ padding: '16px 20px', background: 'white', borderTop: '1px solid #e2e6f0' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function TableWrap({ children }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '11px',
        minWidth: '520px',
      }}>
        {children}
      </table>
    </div>
  );
}

function Th({ children }) {
  return (
    <th style={{
      padding: '8px 10px',
      background: '#f3f4f6',
      color: '#374151',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      textAlign: 'left',
      borderBottom: '1px solid #d1d5db',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </th>
  );
}

function Td({ children, mono }) {
  return (
    <td style={{
      padding: '8px 10px',
      borderBottom: '1px solid #e5e7eb',
      color: '#374151',
      fontSize: '11px',
      fontFamily: mono ? "'IBM Plex Mono', monospace" : 'system-ui, sans-serif',
      lineHeight: 1.5,
    }}>
      {children}
    </td>
  );
}

function AmberNote({ children }) {
  return (
    <div style={{
      background: '#fffbeb',
      border: '1px solid #fbbf24',
      borderLeft: '3px solid #f59e0b',
      borderRadius: '6px',
      padding: '12px 16px',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '11px',
      color: '#92400e',
      lineHeight: 1.65,
    }}>
      {children}
    </div>
  );
}

// ─── data ─────────────────────────────────────────────────────────────────────

const CRED_TYPES = [
  { type: 'National Digital Identity (SDIN)', issuer: 'Samoa Bureau of Statistics', loa: 'LoA 3', validity: '2 years', legal: 'National Digital Identification Act 2024' },
  { type: 'Birth Certificate', issuer: 'SBS — Civil Registration & Vital Statistics', loa: 'LoA 3', validity: 'Permanent', legal: 'Births Deaths Marriages Act' },
  { type: 'Death Certificate', issuer: 'SBS — Civil Registration & Vital Statistics', loa: 'LoA 3', validity: 'Permanent', legal: 'Births Deaths Marriages Act' },
  { type: 'Marriage Certificate', issuer: 'SBS — Civil Registration & Vital Statistics', loa: 'LoA 3', validity: 'Permanent', legal: 'Births Deaths Marriages Act' },
  { type: 'Academic Certificate', issuer: 'Ministry of Education Sports & Culture', loa: 'LoA 2', validity: 'Permanent', legal: 'Education Act' },
  { type: 'Business Registration', issuer: 'MCIL', loa: 'LoA 2', validity: 'Annual renewal', legal: 'Companies Act' },
  { type: 'Land Title — Freehold', issuer: 'MNRE / PUMA', loa: 'LoA 3', validity: 'Permanent', legal: 'Land Titles Registration Act' },
  { type: 'Matai Title', issuer: 'Ministry of Justice', loa: 'LoA 3', validity: 'Permanent', legal: 'Samoa Land and Titles Act' },
  { type: 'Health Certificate', issuer: 'Ministry of Health', loa: 'LoA 2', validity: '1 year', legal: 'Health Ordinance' },
  { type: 'AEO Trusted Trader', issuer: 'Samoa Customs — MOR', loa: 'LoA 3', validity: '3 years', legal: 'WCO SAFE Framework' },
  { type: 'Seafarer Certificate', issuer: 'MWTI / SPA', loa: 'LoA 2', validity: 'Per STCW', legal: 'IMO STCW Convention' },
  { type: 'Electoral Registration', issuer: 'Electoral Commission of Samoa', loa: 'LoA 2', validity: 'Electoral cycle', legal: 'Electoral Act' },
];

const ISSUING_AUTHORITIES = [
  { auth: 'Samoa Bureau of Statistics', ministry: 'Minister of Women, Community & Social Development', creds: 'SDIN, Birth/Death/Marriage Certificates', email: 'sbs@sbs.gov.ws', phone: '(685) 62000', standard: 'NDIDS Act 2024 · W3C DID + VC' },
  { auth: 'MNRE / PUMA', ministry: 'Ministry of Natural Resources & Environment', creds: 'Freehold Land Titles, National Addresses', email: 'mnre@mnre.gov.ws', phone: '', standard: 'Land Titles Registration Act' },
  { auth: 'Ministry of Justice', ministry: 'Attorney General', creds: 'Matai Titles, Customary Land', email: 'justice@justice.gov.ws', phone: '', standard: 'Land & Titles Act' },
  { auth: 'Electoral Commission', ministry: 'Independent', creds: 'Electoral Registration', email: 'electoral@electoral.gov.ws', phone: '', standard: 'Electoral Act' },
  { auth: 'MCIL', ministry: 'Ministry of Commerce Industry & Labour', creds: 'Business Registration', email: 'mcil@mcil.gov.ws', phone: '', standard: 'Companies Act' },
  { auth: 'Customs MOR', ministry: 'Ministry of Revenue', creds: 'AEO Trusted Trader', email: 'customs@revenue.gov.ws', phone: '', standard: 'WCO SAFE Framework' },
  { auth: 'SPA / MWTI', ministry: 'Ministry of Works Transport Infrastructure', creds: 'Seafarer Certificates', email: 'spa@mwti.gov.ws', phone: '', standard: 'IMO STCW' },
];

const CROSS_BORDER = [
  { jurisdiction: 'New Zealand', status: 'Under discussion', framework: 'NZ Digital Identity Trust Framework' },
  { jurisdiction: 'Australia', status: 'Under discussion', framework: 'Australian Trusted Digital Identity Framework' },
  { jurisdiction: 'Fiji', status: 'Pending', framework: 'Pacific SIDS MoU' },
  { jurisdiction: 'Papua New Guinea', status: 'Pending', framework: 'Pacific SIDS MoU' },
  { jurisdiction: 'Pacific Community (SPC)', status: 'Advisory', framework: 'Pacific Digital Identity Initiative' },
  { jurisdiction: 'UNCITRAL MLETR', status: 'Legislative pathway', framework: 'Via MCIL/MFAT — enables electronic document legal equivalence' },
];

// ─── main component ───────────────────────────────────────────────────────────

export default function PublicVerifyView({ onBack }) {
  const [input, setInput] = useState('');
  const [verifyCount, setVerifyCount] = useState(0);
  const [verifyResult, setVerifyResult] = useState(null); // null | 'valid' | 'invalid'

  function handleVerify() {
    if (!input.trim()) return;
    const next = verifyCount + 1;
    setVerifyCount(next);
    setVerifyResult(next % 2 === 1 ? 'valid' : 'invalid');
  }

  function handleReset() {
    setInput('');
    setVerifyResult(null);
  }

  const maskedSdin = input.trim().length >= 4
    ? input.trim().slice(0, 4) + '••••••'
    : input.trim() + '••••••';

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fc', display: 'flex', flexDirection: 'column' }}>
      {/* Research band */}
      <div style={{
        background: '#fffbeb',
        borderBottom: '2px solid #fbbf24',
        padding: '7px 16px',
        textAlign: 'center',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        color: '#92400e',
        letterSpacing: '0.6px',
        fontWeight: 600,
      }}>
        RESEARCH PROTOTYPE · PHASE 1 · NOT AN OPERATIONAL SYSTEM · NUS / ISOC RESEARCH PROGRAMME 2026
      </div>

      <div style={{ flex: 1, padding: '32px 20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        {/* Back link */}
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            color: '#003087',
            cursor: 'pointer',
            padding: '0 0 20px 0',
            display: 'block',
          }}
        >
          ← Back
        </button>

        {/* Page header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '18px',
            fontWeight: 700,
            color: '#1a2035',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            marginBottom: '6px',
          }}>
            Public Credential Verification
          </h1>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: '#6b7280',
          }}>
            Verify any NDIDS-issued credential · Samoa Bureau of Statistics · No account required
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ── SECTION A — Credential Lookup ─────────────────────────────── */}
          <div style={{
            background: 'white',
            border: '1px solid #e2e6f0',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>
                Enter SDIN, Credential Reference, or Hash
              </label>
              <input
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value.toUpperCase()); setVerifyResult(null); }}
                onKeyDown={e => e.key === 'Enter' && input.trim() && handleVerify()}
                placeholder="e.g. SDIN-XXXXXXXXXX or NDIDS-2026-XXXXXX"
                style={{
                  width: '100%',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '15px',
                  padding: '14px 16px',
                  border: '2px solid #e2e6f0',
                  borderRadius: '6px',
                  outline: 'none',
                  letterSpacing: '1px',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#003087')}
                onBlur={e => (e.target.style.borderColor = '#e2e6f0')}
              />
            </div>

            {/* NDIDS Phase 2 note */}
            <AmberNote>
              <strong>NDIDS API Integration: Phase 2</strong><br />
              Live verification will connect to the SBS NDIDS registry when the production system is
              deployed (SFSRDP 2025–2029). Current results are simulated for research purposes.
            </AmberNote>

            <button
              onClick={handleVerify}
              disabled={!input.trim()}
              style={{
                marginTop: '16px',
                padding: '14px 24px',
                background: input.trim() ? '#003087' : '#c5ccd8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '14px',
                fontWeight: 600,
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                minHeight: '48px',
              }}
            >
              Verify Credential
            </button>

            {/* ── Valid result ────────────────────────────────────────────── */}
            {verifyResult === 'valid' && (
              <div style={{
                marginTop: '20px',
                background: '#f0fff8',
                border: '2px solid #00c896',
                borderRadius: '8px',
                padding: '20px',
              }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#007a4d',
                  marginBottom: '16px',
                }}>
                  ✓ CREDENTIAL VERIFIED
                </div>
                {[
                  { label: 'Credential Type', value: 'National Digital Identity (SDIN)' },
                  { label: 'Issuing Authority', value: 'Samoa Bureau of Statistics' },
                  { label: 'Issue Date', value: '15 March 2026' },
                  { label: 'Expiry', value: '15 March 2028' },
                  { label: 'Status', value: 'ACTIVE' },
                  { label: 'Assurance Level', value: 'LoA 3 — In-Person Proofing' },
                  { label: 'Standard', value: 'W3C Verifiable Credentials Data Model 2.0' },
                  { label: 'SDIN', value: maskedSdin },
                  { label: 'Blockchain Anchor', value: 'Phase 2 — on-chain anchoring pending NDIDS production deployment' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '10px',
                      color: '#6b7280',
                      width: '160px',
                      flexShrink: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      paddingTop: '1px',
                    }}>
                      {row.label}
                    </span>
                    <span style={{ fontSize: '12px', color: '#1a2035', fontWeight: 500 }}>
                      {row.value}
                    </span>
                  </div>
                ))}
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: 'rgba(0,0,0,0.04)',
                  borderRadius: '4px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: '#6b7280',
                }}>
                  Simulated · Phase 1 Research Environment
                </div>
                <button onClick={handleReset} style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: 'none',
                  color: '#6b7280',
                  border: '1px solid #e2e6f0',
                  borderRadius: '5px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  cursor: 'pointer',
                }}>
                  Check another →
                </button>
              </div>
            )}

            {/* ── Invalid result ──────────────────────────────────────────── */}
            {verifyResult === 'invalid' && (
              <div style={{
                marginTop: '20px',
                background: '#fff5f5',
                border: '2px solid #ff3b4e',
                borderRadius: '8px',
                padding: '20px',
              }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#7a0010',
                  marginBottom: '12px',
                }}>
                  ✗ CREDENTIAL NOT FOUND
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.65, margin: '0 0 12px 0' }}>
                  The reference entered was not found in the NDIDS registry, or the credential has
                  been revoked. Contact the issuing authority if you believe this is an error.
                </p>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  color: '#374151',
                  lineHeight: 1.7,
                }}>
                  <strong>Issuing Authority Contact</strong><br />
                  Samoa Bureau of Statistics — NDIDS Division<br />
                  sbs@sbs.gov.ws · (685) 62000
                </div>
                <button onClick={handleReset} style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: 'none',
                  color: '#6b7280',
                  border: '1px solid #e2e6f0',
                  borderRadius: '5px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  cursor: 'pointer',
                }}>
                  Check another →
                </button>
              </div>
            )}
          </div>

          {/* ── SECTION B — QR Code Guide ──────────────────────────────────── */}
          <CollapsibleSection
            title="How to Verify by QR Code"
            subtitle="IMO FAL · NDIDS Physical Card · 2D Barcode"
          >
            <ol style={{ padding: '0 0 0 18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'The credential holder presents their physical NDIDS card or digital credential document.',
                'Scan the 2D barcode using your device camera or a QR/barcode reader application.',
                'The barcode contains the SDIN reference — paste it into the verification field above.',
                'The result confirms whether the credential is genuine and currently active in the NDIDS registry.',
              ].map((step, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#374151', lineHeight: 1.65 }}>
                  {step}
                </li>
              ))}
            </ol>
            <div style={{ marginTop: '14px' }}>
              <AmberNote>
                <strong>Phase 2:</strong> In-app barcode scanner via device camera — SFSRDP Phase 2 deployment.
              </AmberNote>
            </div>
          </CollapsibleSection>

          {/* ── SECTION C — Credential Types ──────────────────────────────── */}
          <CollapsibleSection
            title="Credentials Verifiable on Samoa DPI"
            subtitle="GovStack Identity Building Block · National Digital Identification Act 2024"
          >
            <TableWrap>
              <thead>
                <tr>
                  <Th>Credential Type</Th>
                  <Th>Issuing Authority</Th>
                  <Th>LoA</Th>
                  <Th>Valid Period</Th>
                  <Th>Legal Basis</Th>
                </tr>
              </thead>
              <tbody>
                {CRED_TYPES.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafbfc' }}>
                    <Td mono>{row.type}</Td>
                    <Td>{row.issuer}</Td>
                    <Td mono>
                      <span style={{
                        background: row.loa === 'LoA 3' ? '#dbeafe' : '#fef3c7',
                        color: row.loa === 'LoA 3' ? '#1e40af' : '#92400e',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}>
                        {row.loa}
                      </span>
                    </Td>
                    <Td>{row.validity}</Td>
                    <Td>{row.legal}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </CollapsibleSection>

          {/* ── SECTION D — NIST LoA Reference ────────────────────────────── */}
          <CollapsibleSection
            title="Identity Assurance Levels"
            subtitle="NIST SP 800-63-3 · Digital Identity Guidelines"
          >
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                {
                  level: 'LoA 1',
                  title: 'Self-Asserted',
                  desc: 'Identity claimed but not independently verified. Suitable for low-risk digital services.',
                  example: 'Newsletter, basic online enquiry',
                  color: '#6b7280',
                  bg: '#f9fafb',
                },
                {
                  level: 'LoA 2',
                  title: 'Remote Proofing',
                  desc: 'Identity verified remotely using document evidence. Required for most government services.',
                  example: 'Business registration, academic records, health certificates',
                  color: '#92400e',
                  bg: '#fffbeb',
                },
                {
                  level: 'LoA 3',
                  title: 'In-Person Proofing',
                  desc: 'Identity verified in person with biometric binding. Required for high-value and sensitive services.',
                  example: 'SDIN, land titles, Matai titles, financial access',
                  color: '#1e40af',
                  bg: '#eff6ff',
                },
              ].map(card => (
                <div key={card.level} style={{
                  flex: '1 1 200px',
                  background: card.bg,
                  border: `1px solid ${card.color}30`,
                  borderTop: `3px solid ${card.color}`,
                  borderRadius: '6px',
                  padding: '16px',
                }}>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: card.color,
                    marginBottom: '4px',
                  }}>
                    {card.level} — {card.title}
                  </div>
                  <p style={{ fontSize: '12px', color: '#374151', lineHeight: 1.6, margin: '0 0 8px 0' }}>
                    {card.desc}
                  </p>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '10px',
                    color: '#6b7280',
                  }}>
                    Example: {card.example}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* ── SECTION E — Issuing Authority Directory ───────────────────── */}
          <CollapsibleSection
            title="Samoa NDIDS Issuing Authorities"
            subtitle="National Digital Identification Act 2024 · Relying Party Registry"
          >
            <TableWrap>
              <thead>
                <tr>
                  <Th>Authority</Th>
                  <Th>Ministry</Th>
                  <Th>Credentials</Th>
                  <Th>Contact</Th>
                  <Th>Standard</Th>
                </tr>
              </thead>
              <tbody>
                {ISSUING_AUTHORITIES.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafbfc' }}>
                    <Td mono>{row.auth}</Td>
                    <Td>{row.ministry}</Td>
                    <Td>{row.creds}</Td>
                    <Td mono>
                      <div>{row.email}</div>
                      {row.phone && <div style={{ color: '#6b7280' }}>{row.phone}</div>}
                    </Td>
                    <Td>{row.standard}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </CollapsibleSection>

          {/* ── SECTION F — Privacy Notice ─────────────────────────────────── */}
          <CollapsibleSection
            title="Privacy Notice"
            subtitle="National Digital Identification Act 2024 · Samoa Privacy Act 2021 · ISO/IEC 27001"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>
              <p style={{ margin: 0 }}>
                <strong>What we check:</strong> The SDIN or reference number you enter is checked against
                the DPI credential registry.
              </p>
              <p style={{ margin: 0 }}>
                <strong>What we do NOT retain:</strong> No personal data is collected, stored, or logged
                during public verification. The check is stateless — no record of your query is kept after
                the result is displayed.
              </p>
              <p style={{ margin: 0 }}>
                <strong>What the result shows:</strong> Verification status only. No personal information
                about the credential holder is displayed to the verifying party.
              </p>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: '#6b7280',
                padding: '10px 14px',
                background: '#f9fafb',
                borderRadius: '5px',
                lineHeight: 1.8,
              }}>
                Data Controller: Samoa Bureau of Statistics<br />
                Registrar General: SBS under NDIDS Act 2024<br />
                Contact: sbs@sbs.gov.ws · (685) 62000
              </div>
            </div>
          </CollapsibleSection>

          {/* ── SECTION G — Cross-Border Recognition ─────────────────────── */}
          <CollapsibleSection
            title="Cross-Border Recognition"
            subtitle="Pacific Digital Identity Interoperability · SFSRDP 2025–2029"
          >
            <TableWrap>
              <thead>
                <tr>
                  <Th>Jurisdiction</Th>
                  <Th>Status</Th>
                  <Th>Framework</Th>
                </tr>
              </thead>
              <tbody>
                {CROSS_BORDER.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafbfc' }}>
                    <Td mono>{row.jurisdiction}</Td>
                    <Td>
                      <span style={{
                        background: row.status === 'Advisory' ? '#f0fdf4' : '#fafafa',
                        color: row.status === 'Advisory' ? '#166534' : '#374151',
                        padding: '2px 7px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: 500,
                      }}>
                        {row.status}
                      </span>
                    </Td>
                    <Td>{row.framework}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
            <div style={{ marginTop: '14px' }}>
              <AmberNote>
                Full cross-border recognition requires bilateral MOUs and legislative alignment under
                the NDIDS Act 2024. SFSRDP Phase 2 priority.
              </AmberNote>
            </div>
          </CollapsibleSection>

        </div>
      </div>

      <VerifyFooter />
    </div>
  );
}
