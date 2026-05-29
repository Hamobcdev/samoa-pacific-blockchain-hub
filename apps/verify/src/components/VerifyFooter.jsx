export default function VerifyFooter() {
  return (
    <footer style={{ background: '#111827', padding: '28px 20px', textAlign: 'center' }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        lineHeight: 2,
        letterSpacing: '0.3px',
      }}>
        <div style={{ color: '#d1d5db', fontWeight: 600 }}>
          Samoa National Credential Verification System
        </div>
        <div style={{ color: '#9ca3af' }}>Powered by Samoa Digital Public Infrastructure</div>
        <div style={{ color: '#9ca3af' }}>Samoa Bureau of Statistics · NDIDS Act 2024</div>
        <div style={{ marginTop: '10px', color: '#6b7280' }}>
          Aligned with: W3C Verifiable Credentials Data Model 2.0 · W3C DID Core 1.0 · NIST SP 800-63-3 · ISO 18013-5
        </div>
        <div style={{ color: '#6b7280' }}>
          GovStack Identity Building Block · UNCITRAL MLETR · ISO/IEC 27001 · eIDAS 2.0 (ref)
        </div>
        <div style={{ marginTop: '10px', color: '#4b5563', fontWeight: 500 }}>
          Phase 1 Research Environment · NUS / ISOC Research Programme 2026 · Not an operational system
        </div>
      </div>
    </footer>
  );
}
