/**
 * Phase 1 mock NDIDS records for verification.
 * Keyed by reference number (format: SAM-XXXX-YYYY).
 *
 * Phase 2: verified against NDIDSRegistry.sol via /api/rpc.
 * The hash lookup never exposes PII — only verification status.
 *
 * PHASE 2 COMMENT: replace lookup with:
 * const hash = keccak256(referenceNumber);
 * const result = await ndidsRegistry.isRegistered(hash);
 */
export const MOCK_RECORDS = {
  'SAM-0001-2026': {
    status:   'Verified',
    ministry: 'Ministry of Health',
    service:  'Health Record',
    date:     1746144000,
    note:     null,
  },
  'SAM-0002-2026': {
    status:   'Verified',
    ministry: 'Ministry of Education, Sports & Culture',
    service:  'Education Enrolment',
    date:     1745280000,
    note:     null,
  },
  'SAM-0003-2026': {
    status:   'Pending',
    ministry: 'Samoa Bureau of Statistics',
    service:  'Identity Registration',
    date:     null,
    note:     'Registration in progress — verification available within 3 working days',
  },
};

export function lookupRecord(referenceNumber) {
  const clean = (referenceNumber || '').trim().toUpperCase();
  if (!clean) return null;
  return MOCK_RECORDS[clean] || { status: 'NotFound' };
}
