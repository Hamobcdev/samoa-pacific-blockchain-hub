import { useState } from 'react';
import VerifyFooter from './VerifyFooter';

// ─── helpers ──────────────────────────────────────────────────────────────────

function wstNow() {
  return new Date().toLocaleString('en-WS', {
    timeZone: 'Pacific/Apia',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: false,
  }) + ' WST';
}

function Th({ children, narrow }) {
  return (
    <th style={{
      padding: '8px 10px',
      background: '#f3f4f6',
      color: '#374151',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '10px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      textAlign: 'left',
      borderBottom: '1px solid #d1d5db',
      whiteSpace: narrow ? 'nowrap' : undefined,
    }}>
      {children}
    </th>
  );
}

function Td({ children, mono, muted }) {
  return (
    <td style={{
      padding: '9px 10px',
      borderBottom: '1px solid #e5e7eb',
      fontFamily: mono ? "'IBM Plex Mono', monospace" : 'system-ui, sans-serif',
      fontSize: '11px',
      color: muted ? '#9ca3af' : '#374151',
      verticalAlign: 'top',
    }}>
      {children}
    </td>
  );
}

function StatusChip({ label }) {
  const map = {
    'Pending Review': { bg: '#fef3c7', color: '#92400e' },
    'Under Verification': { bg: '#eff6ff', color: '#1e40af' },
    'Ready to Issue': { bg: '#f0fdf4', color: '#166534' },
    'ACTIVE': { bg: '#f0fdf4', color: '#166534' },
    'REVOKED': { bg: '#fef2f2', color: '#991b1b' },
  };
  const s = map[label] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      padding: '2px 7px',
      borderRadius: '3px',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '10px',
      fontWeight: 600,
    }}>
      {label}
    </span>
  );
}

function ActionBtn({ children, onClick, variant }) {
  const styles = {
    primary: { background: '#003087', color: 'white' },
    danger: { background: '#b91c1c', color: 'white' },
    secondary: { background: 'none', color: '#374151', border: '1px solid #d1d5db' },
  };
  const s = styles[variant] || styles.secondary;
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        border: s.border || 'none',
        borderRadius: '4px',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        fontWeight: 600,
        cursor: 'pointer',
        background: s.background,
        color: s.color,
        minHeight: '28px',
      }}
    >
      {children}
    </button>
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
      marginBottom: '16px',
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h2 style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '13px',
        fontWeight: 700,
        color: '#1a2035',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        margin: '0 0 4px 0',
      }}>
        {title}
      </h2>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#6b7280', margin: 0 }}>
        {subtitle}
      </p>
    </div>
  );
}

// ─── queue data ───────────────────────────────────────────────────────────────

const QUEUE_ROWS = [
  { id: 'REQ-2026-001', hash: '0x4968...', type: 'SDIN', submitted: '26/05/2026', loa: 'LoA 3', status: 'Pending Review', action: 'Review' },
  { id: 'REQ-2026-002', hash: '0xf96e...', type: 'Birth Cert', submitted: '26/05/2026', loa: 'LoA 3', status: 'Under Verification', action: 'Review' },
  { id: 'REQ-2026-003', hash: '0xa0a0...', type: 'SDIN', submitted: '25/05/2026', loa: 'LoA 3', status: 'Ready to Issue', action: 'Issue' },
  { id: 'REQ-2026-004', hash: '0xe7db...', type: 'Marriage Cert', submitted: '25/05/2026', loa: 'LoA 3', status: 'Pending Review', action: 'Review' },
  { id: 'REQ-2026-005', hash: '0xbd7e...', type: 'SDIN', submitted: '24/05/2026', loa: 'LoA 3', status: 'Under Verification', action: 'Review' },
];

// ─── issued data ──────────────────────────────────────────────────────────────

const ISSUED_ROWS = [
  { ref: 'SDIN-2026-1234567890', type: 'SDIN', issued: '15/03/2026', expiry: '15/03/2028', status: 'ACTIVE' },
  { ref: 'NDIDS-BC-2026-001', type: 'Birth Cert', issued: '10/01/2026', expiry: 'Permanent', status: 'ACTIVE' },
  { ref: 'SDIN-2026-9876543210', type: 'SDIN', issued: '01/02/2026', expiry: '01/02/2028', status: 'ACTIVE' },
  { ref: 'NDIDS-MC-2026-001', type: 'Marriage Cert', issued: '20/04/2026', expiry: 'Permanent', status: 'ACTIVE' },
  { ref: 'SDIN-2025-1111111111', type: 'SDIN', issued: '15/11/2025', expiry: '15/11/2027', status: 'ACTIVE' },
  { ref: 'SDIN-2025-2222222222', type: 'SDIN', issued: '01/10/2025', expiry: '01/10/2027', status: 'REVOKED' },
];

// ─── revocation log ───────────────────────────────────────────────────────────

const REVOC_LOG = [
  { ref: 'SDIN-2025-2222222222', type: 'SDIN', revoked: '15/05/2026 09:12 WST', reason: 'Lost / Stolen', officer: 'OFFICER-A7**' },
  { ref: 'SDIN-2024-3333333333', type: 'SDIN', revoked: '02/04/2026 14:30 WST', reason: 'Expired', officer: 'OFFICER-B2**' },
  { ref: 'NDIDS-BC-2025-044', type: 'Birth Cert', revoked: '18/03/2026 11:00 WST', reason: 'Error in Issuance', officer: 'OFFICER-A7**' },
  { ref: 'SDIN-2024-9988776655', type: 'SDIN', revoked: '05/02/2026 16:45 WST', reason: 'Holder Request', officer: 'OFFICER-C5**' },
  { ref: 'SDIN-2023-1122334455', type: 'SDIN', revoked: '20/01/2026 10:20 WST', reason: 'Death (CRVS notification)', officer: 'OFFICER-B2**' },
];

// ─── audit log ────────────────────────────────────────────────────────────────

const AUDIT_LOG = [
  { ts: '29/05/2026 14:47 WST', action: 'PUBLIC_VERIFY', type: 'SDIN', result: 'VERIFIED' },
  { ts: '29/05/2026 14:41 WST', action: 'PUBLIC_VERIFY', type: 'SDIN', result: 'NOT FOUND' },
  { ts: '29/05/2026 14:33 WST', action: 'OFFICER_ACCESS', type: '—', result: 'AUTHENTICATED' },
  { ts: '29/05/2026 14:12 WST', action: 'CREDENTIAL_ISSUED', type: 'Birth Cert', result: 'ISSUED' },
  { ts: '29/05/2026 13:55 WST', action: 'PUBLIC_VERIFY', type: 'SDIN', result: 'VERIFIED' },
  { ts: '29/05/2026 13:40 WST', action: 'CREDENTIAL_ISSUED', type: 'SDIN', result: 'ISSUED' },
  { ts: '29/05/2026 12:55 WST', action: 'PUBLIC_VERIFY', type: 'Marriage Cert', result: 'VERIFIED' },
  { ts: '29/05/2026 12:23 WST', action: 'CREDENTIAL_ISSUED', type: 'SDIN', result: 'ISSUED' },
  { ts: '28/05/2026 16:48 WST', action: 'PUBLIC_VERIFY', type: 'SDIN', result: 'NOT FOUND' },
  { ts: '28/05/2026 15:30 WST', action: 'CREDENTIAL_REVOKED', type: 'SDIN', result: 'REVOKED' },
  { ts: '28/05/2026 14:20 WST', action: 'OFFICER_ACCESS', type: '—', result: 'AUTHENTICATED' },
  { ts: '28/05/2026 11:45 WST', action: 'PUBLIC_VERIFY', type: 'SDIN', result: 'VERIFIED' },
  { ts: '27/05/2026 16:01 WST', action: 'CREDENTIAL_ISSUED', type: 'SDIN', result: 'ISSUED' },
  { ts: '27/05/2026 14:30 WST', action: 'PUBLIC_VERIFY', type: 'Birth Cert', result: 'VERIFIED' },
  { ts: '27/05/2026 09:15 WST', action: 'CREDENTIAL_REVOKED', type: 'SDIN', result: 'REVOKED' },
];

function auditActionColor(action) {
  if (action === 'CREDENTIAL_ISSUED') return '#166534';
  if (action === 'CREDENTIAL_REVOKED') return '#991b1b';
  if (action === 'OFFICER_ACCESS') return '#1e40af';
  return '#374151';
}

// ─── generate reference ───────────────────────────────────────────────────────

function genRef() {
  const digits = String(Math.floor(Math.random() * 9000000000) + 1000000000);
  return `SDIN-${new Date().getFullYear()}-${digits}`;
}

function genRevRef() {
  const digits = String(Math.floor(Math.random() * 900000) + 100000);
  return `REV-${new Date().getFullYear()}-${digits}`;
}

// ─── tab components ───────────────────────────────────────────────────────────

function QueueTab() {
  const [reviewRow, setReviewRow] = useState(null);
  const [issuedMap, setIssuedMap] = useState({});

  function handleIssue(rowId) {
    const ref = genRef();
    setIssuedMap(m => ({ ...m, [rowId]: { ref, ts: wstNow() } }));
  }

  function handleApprove(rowId) {
    handleIssue(rowId);
    setReviewRow(null);
  }

  return (
    <div>
      <SectionHeader
        title="Pending Credential Issuance Requests"
        subtitle="National Digital Identification Act 2024 · SBS NDIDS Division"
      />
      <AmberNote>
        <strong>Live queue:</strong> Will connect to SBS NDIDS system (SFSRDP 2025–2029).
        Data below is simulated for research purposes.
      </AmberNote>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              <Th>Request ID</Th>
              <Th>Applicant Hash</Th>
              <Th>Type</Th>
              <Th>Submitted</Th>
              <Th>LoA Required</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {QUEUE_ROWS.map((row, i) => (
              <>
                <tr key={row.id} style={{ background: i % 2 === 0 ? 'white' : '#fafbfc' }}>
                  <Td mono>{row.id}</Td>
                  <Td mono muted>{row.hash}</Td>
                  <Td>{row.type}</Td>
                  <Td>{row.submitted}</Td>
                  <Td mono>
                    <span style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '1px 6px',
                      borderRadius: '3px',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}>
                      {row.loa}
                    </span>
                  </Td>
                  <Td><StatusChip label={issuedMap[row.id] ? 'Ready to Issue' : row.status} /></Td>
                  <Td>
                    {issuedMap[row.id] ? (
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '10px',
                        color: '#166534',
                        lineHeight: 1.6,
                      }}>
                        Credential issued<br />
                        <span style={{ color: '#374151' }}>Ref: {issuedMap[row.id].ref}</span><br />
                        <span style={{ color: '#9ca3af' }}>Blockchain anchor: Phase 2 — SFSRDP production</span>
                      </div>
                    ) : row.action === 'Issue' ? (
                      <ActionBtn variant="primary" onClick={() => handleIssue(row.id)}>
                        Issue
                      </ActionBtn>
                    ) : (
                      <ActionBtn variant="secondary" onClick={() => setReviewRow(reviewRow === row.id ? null : row.id)}>
                        {reviewRow === row.id ? 'Close' : 'Review'}
                      </ActionBtn>
                    )}
                  </Td>
                </tr>
                {reviewRow === row.id && (
                  <tr key={`${row.id}-detail`}>
                    <td colSpan={7} style={{ padding: '16px', background: '#f0f4ff', borderBottom: '1px solid #e2e6f0' }}>
                      <div style={{ maxWidth: '480px' }}>
                        <div style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#1a2035',
                          marginBottom: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px',
                        }}>
                          LoA 3 Checklist — {row.id}
                        </div>
                        {[
                          { done: true,  label: 'Identity proofing document submitted' },
                          { done: true,  label: 'Biometric data captured' },
                          { done: false, label: 'Adjudication review pending' },
                          { done: false, label: 'Supervisor approval pending' },
                        ].map((item, j) => (
                          <div key={j} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '6px',
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: '11px',
                            color: item.done ? '#166534' : '#6b7280',
                          }}>
                            <span>{item.done ? '✓' : '○'}</span>
                            <span>{item.label}</span>
                          </div>
                        ))}
                        <div style={{ marginTop: '14px' }}>
                          <ActionBtn variant="primary" onClick={() => handleApprove(row.id)}>
                            Approve for Issuance
                          </ActionBtn>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IssuedTab() {
  const [viewCert, setViewCert] = useState(null);

  const selected = viewCert ? ISSUED_ROWS.find(r => r.ref === viewCert) : null;

  return (
    <div>
      <SectionHeader
        title="Issued Credentials — Active Registry"
        subtitle="NDIDS Act 2024 · W3C VC Data Model 2.0"
      />
      <AmberNote>
        <strong>Live registry:</strong> Will connect to SBS NDIDS system (SFSRDP 2025–2029).
        Data below is simulated for research purposes.
      </AmberNote>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '540px' }}>
          <thead>
            <tr>
              <Th>Reference</Th>
              <Th>Type</Th>
              <Th>Issued</Th>
              <Th>Expiry</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {ISSUED_ROWS.map((row, i) => (
              <tr key={row.ref} style={{ background: i % 2 === 0 ? 'white' : '#fafbfc' }}>
                <Td mono>{row.ref}</Td>
                <Td>{row.type}</Td>
                <Td>{row.issued}</Td>
                <Td>{row.expiry}</Td>
                <Td><StatusChip label={row.status} /></Td>
                <Td>
                  <ActionBtn variant="secondary" onClick={() => setViewCert(viewCert === row.ref ? null : row.ref)}>
                    {viewCert === row.ref ? 'Close' : 'View'}
                  </ActionBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div style={{
          marginTop: '20px',
          background: '#f8f9fc',
          border: '1px solid #d1d5db',
          borderTop: '3px solid #003087',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '520px',
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '13px',
            fontWeight: 700,
            color: '#1a2035',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '16px',
            borderBottom: '2px solid #003087',
            paddingBottom: '10px',
          }}>
            Certificate of Authenticity
          </div>
          {[
            { label: 'Issuing Authority', value: 'Samoa Bureau of Statistics' },
            { label: 'Under', value: 'National Digital Identification Act 2024' },
            { label: 'Reference', value: selected.ref },
            { label: 'Credential Type', value: selected.type },
            { label: 'Issued', value: selected.issued },
            { label: 'Standard', value: 'W3C Verifiable Credentials Data Model 2.0' },
            { label: 'Blockchain Anchor', value: 'Phase 2 — SFSRDP production deployment (2025–2029)' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#6b7280',
                width: '150px',
                flexShrink: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
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
            marginTop: '16px',
            padding: '8px 12px',
            background: '#e5e7eb',
            borderRadius: '4px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#6b7280',
            textAlign: 'center',
          }}>
            [SBS logo placeholder]
          </div>
        </div>
      )}
    </div>
  );
}

function RevocationTab() {
  const [revokeRef, setRevokeRef] = useState('');
  const [reason, setReason] = useState('');
  const [result, setResult] = useState(null);

  function handleRevoke() {
    if (!revokeRef.trim() || !reason) return;
    setResult({
      ref: revokeRef.trim().toUpperCase(),
      revRef: genRevRef(),
      ts: wstNow(),
    });
    setRevokeRef('');
    setReason('');
  }

  return (
    <div>
      <SectionHeader
        title="Credential Revocation"
        subtitle="W3C VC Revocation List 2020 · NDIDS Act 2024 s.47"
      />

      <div style={{
        background: 'white',
        border: '1px solid #e2e6f0',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '500px',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <div>
          <label style={{
            display: 'block',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            fontWeight: 600,
            color: '#374151',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            marginBottom: '6px',
          }}>
            Enter SDIN or Credential Reference
          </label>
          <input
            type="text"
            value={revokeRef}
            onChange={e => setRevokeRef(e.target.value)}
            placeholder="e.g. SDIN-2026-XXXXXXXXXX"
            style={{
              width: '100%',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '13px',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '5px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            fontWeight: 600,
            color: '#374151',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            marginBottom: '6px',
          }}>
            Reason
          </label>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{
              width: '100%',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '5px',
              outline: 'none',
              background: 'white',
            }}
          >
            <option value="">Select reason...</option>
            <option>Lost / Stolen</option>
            <option>Expired</option>
            <option>Error in Issuance</option>
            <option>Holder Request</option>
            <option>Court Order</option>
            <option>Security Breach</option>
            <option>Death (CRVS notification)</option>
          </select>
        </div>
        <ActionBtn variant="danger" onClick={handleRevoke}>
          Revoke Credential
        </ActionBtn>
      </div>

      {result && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          borderLeft: '3px solid #b91c1c',
          borderRadius: '6px',
          padding: '16px 20px',
          maxWidth: '500px',
          marginBottom: '24px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          lineHeight: 1.8,
          color: '#374151',
        }}>
          <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: '8px' }}>
            Credential {result.ref} marked REVOKED
          </div>
          <div>Revocation Reference: {result.revRef}</div>
          <div>Recorded: {result.ts}</div>
          <div style={{ color: '#9ca3af' }}>Blockchain revocation: Phase 2 — SFSRDP production</div>
          <div style={{ marginTop: '6px', color: '#6b7280' }}>
            Note: All subsequent verification checks will return REVOKED status.
          </div>
        </div>
      )}

      <div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          fontWeight: 700,
          color: '#374151',
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
          marginBottom: '10px',
        }}>
          Revocation Log — Last 5
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
            <thead>
              <tr>
                <Th>Reference</Th>
                <Th>Type</Th>
                <Th>Revoked</Th>
                <Th>Reason</Th>
                <Th>Officer</Th>
              </tr>
            </thead>
            <tbody>
              {REVOC_LOG.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafbfc' }}>
                  <Td mono>{row.ref}</Td>
                  <Td>{row.type}</Td>
                  <Td mono muted>{row.revoked}</Td>
                  <Td>{row.reason}</Td>
                  <Td mono muted>{row.officer}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AuditTab() {
  const metrics = [
    { label: 'Credentials Issued Today', value: 3 },
    { label: 'Verifications Today', value: 12 },
    { label: 'Active Credentials', value: 847 },
    { label: 'Revocations This Month', value: 2 },
  ];

  return (
    <div>
      <SectionHeader
        title="Verification Audit Log"
        subtitle="ISO/IEC 27001 A.12.4 · NDIDS Act 2024 · Anonymised"
      />

      {/* Metric cards */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            flex: '1 1 140px',
            background: 'white',
            border: '1px solid #e2e6f0',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '28px',
              fontWeight: 700,
              color: '#003087',
            }}>
              {m.value}
            </div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '9px',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              marginTop: '4px',
            }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Log table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '440px' }}>
          <thead>
            <tr>
              <Th>Timestamp (WST)</Th>
              <Th>Action</Th>
              <Th>Type</Th>
              <Th>Result</Th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOG.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafbfc' }}>
                <Td mono muted>{row.ts}</Td>
                <Td mono>
                  <span style={{
                    color: auditActionColor(row.action),
                    fontWeight: 600,
                    fontSize: '10px',
                  }}>
                    {row.action}
                  </span>
                </Td>
                <Td>{row.type}</Td>
                <Td mono>
                  <span style={{
                    color: row.result === 'VERIFIED' || row.result === 'ISSUED' || row.result === 'AUTHENTICATED'
                      ? '#166534'
                      : row.result === 'REVOKED'
                        ? '#991b1b'
                        : '#6b7280',
                    fontSize: '10px',
                  }}>
                    {row.result}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: '14px',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        color: '#9ca3af',
        lineHeight: 1.7,
      }}>
        All entries anonymised per Samoa Privacy Act 2021 and NDIDS Act 2024.
        No PII stored. Verifying party identity not recorded.
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

const TABS = ['QUEUE', 'ISSUED', 'REVOCATION', 'AUDIT'];

export default function IssuingAuthorityDashboard({ user, onSignOut }) {
  const [activeTab, setActiveTab] = useState('QUEUE');
  const [ts] = useState(() => wstNow());

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fc', display: 'flex', flexDirection: 'column' }}>
      {/* Zone 2 amber classification band */}
      <div style={{
        background: '#92400e',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#fef3c7', letterSpacing: '2px', fontWeight: 500 }}>
          ZONE 2 · RESTRICTED · OFFICIAL
        </span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#fef3c7', letterSpacing: '1.5px', opacity: 0.8 }}>
          NDIDS ISSUING AUTHORITY
        </span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#fef3c7', letterSpacing: '1.5px', opacity: 0.6 }}>
          SAMOA DPI
        </span>
      </div>

      {/* Portal header */}
      <div style={{
        background: '#1a2035',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '14px',
            fontWeight: 700,
            color: '#f0f4ff',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
          }}>
            SBS NDIDS — Issuing Authority Portal
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#9ca3af',
            marginTop: '3px',
          }}>
            {user.label} · {ts}
          </div>
        </div>
        <button
          onClick={onSignOut}
          style={{
            padding: '7px 16px',
            background: 'transparent',
            border: '1px solid #4b5563',
            borderRadius: '4px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: '#9ca3af',
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Tab navigation */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e6f0',
        display: 'flex',
        padding: '0 20px',
        flexShrink: 0,
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '14px 20px',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #003087' : '2px solid transparent',
              background: 'none',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              fontWeight: activeTab === tab ? 700 : 400,
              color: activeTab === tab ? '#003087' : '#6b7280',
              cursor: 'pointer',
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, padding: '28px 20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {activeTab === 'QUEUE'      && <QueueTab />}
        {activeTab === 'ISSUED'     && <IssuedTab />}
        {activeTab === 'REVOCATION' && <RevocationTab />}
        {activeTab === 'AUDIT'      && <AuditTab />}
      </div>

      <VerifyFooter />
    </div>
  );
}
