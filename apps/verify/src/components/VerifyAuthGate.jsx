import { useState } from 'react';
import VerifyFooter from './VerifyFooter';

const AUTH_MAP = {
  'VERIFY-OFFICER-2026': {
    role: 'ISSUING_AUTHORITY',
    zone: 2,
    label: 'NDIDS Issuing Authority Officer — SBS',
    agency: 'SBS',
  },
};

export default function VerifyAuthGate({ onPublicAccess, onAuthAccess }) {
  const [credential, setCredential] = useState('');
  const [error, setError] = useState('');

  function handleSignIn() {
    const user = AUTH_MAP[credential.trim().toUpperCase()];
    if (user) {
      setError('');
      onAuthAccess(user);
    } else {
      setError('Access denied — authorised SBS officers only');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fc', display: 'flex', flexDirection: 'column' }}>
      {/* Amber research prototype band */}
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

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px',
      }}>
        {/* Samoa flag strip */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
          <div style={{ width: '28px', height: '5px', background: '#CE1126', borderRadius: '2px' }} />
          <div style={{ width: '28px', height: '5px', background: '#003087', borderRadius: '2px' }} />
        </div>

        {/* Heading block */}
        <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '660px' }}>
          <h1 style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '20px',
            fontWeight: 700,
            color: '#1a2035',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '12px',
            lineHeight: 1.4,
          }}>
            Samoa National Credential Verification System
          </h1>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            color: '#6b7280',
            letterSpacing: '0.3px',
          }}>
            National Digital Identification System (NDIDS) · Samoa Bureau of Statistics
          </p>
        </div>

        {/* Access cards */}
        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '860px',
        }}>
          {/* Card 1 — Primary: Public Verify */}
          <div style={{
            background: 'white',
            border: '2px solid #003087',
            borderRadius: '10px',
            padding: '32px',
            flex: '1 1 300px',
            maxWidth: '420px',
            boxShadow: '0 4px 14px rgba(0,48,135,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: '#003087',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600,
            }}>
              Public Access · No Account Required
            </div>
            <h2 style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '18px',
              fontWeight: 700,
              color: '#1a2035',
              margin: 0,
            }}>
              Verify a Credential
            </h2>
            <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
              Verify any credential issued under Samoa's National Digital Identification
              System. No account required.
            </p>
            <button
              onClick={onPublicAccess}
              style={{
                marginTop: 'auto',
                padding: '14px 20px',
                background: '#003087',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.5px',
                minHeight: '48px',
              }}
            >
              Access Public Verification
            </button>
          </div>

          {/* Card 2 — Secondary: Issuing Authority */}
          <div style={{
            background: '#fafbfc',
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            padding: '24px',
            flex: '1 1 260px',
            maxWidth: '360px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600,
            }}>
              Authorised Officers Only
            </div>
            <h2 style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '15px',
              fontWeight: 700,
              color: '#1a2035',
              margin: 0,
            }}>
              Issuing Authority Access
            </h2>
            <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.65, margin: 0 }}>
              For authorised SBS and government officers managing credential issuance
              and revocation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="password"
                value={credential}
                placeholder="Officer access code"
                onChange={e => { setCredential(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && credential.trim() && handleSignIn()}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '13px',
                  padding: '10px 12px',
                  border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '5px',
                  outline: 'none',
                  background: 'white',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
              {error && (
                <p style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  color: '#b91c1c',
                  margin: 0,
                }}>
                  {error}
                </p>
              )}
              <button
                onClick={handleSignIn}
                disabled={!credential.trim()}
                style={{
                  padding: '10px 16px',
                  background: credential.trim() ? '#1a2035' : '#c5ccd8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: credential.trim() ? 'pointer' : 'not-allowed',
                  minHeight: '38px',
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      <VerifyFooter />
    </div>
  );
}
