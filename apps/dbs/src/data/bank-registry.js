/**
 * Tier 2 Licensed Retail Distributors — WST-DPI
 * Tier 3 Institutional Participants
 * Pacific Correspondent and Settlement Banks
 *
 * Phase 1: static reference data.
 * Phase 2: read from on-chain DBS registry contract.
 *
 * CRITICAL: Westpac is NOT in this list — no longer operating in Samoa.
 */

import Decimal from 'decimal.js';

// ── TIER 2 — LICENSED RETAIL DISTRIBUTORS ──────────────────────────────────
export const TIER_2_BANKS = [
  {
    code:             'ANZ-WS',
    name:             'ANZ Bank Samoa',
    fullName:         'Australia and New Zealand Banking Group — Samoa',
    tier:             2,
    status:           'Active',
    statusNote:       'CBS-authorised retail distributor',
    dailyLimitRaw:    '500000000',   // 5,000,000.00 WST in sene (2dp)
    decimals:         2,
    currency:         'WST',
    settlementBank:   'ANZ Group Pacific',
    swiftCode:        'ANZBNPPA',
    lastSettlement:   null,          // Phase 2: live timestamp
    complianceStatus: 'Compliant',
  },
  {
    code:             'BSP-WS',
    name:             'BSP Samoa',
    fullName:         'Bank of South Pacific — Samoa',
    tier:             2,
    status:           'Active',
    statusNote:       'CBS-authorised retail distributor',
    dailyLimitRaw:    '300000000',
    decimals:         2,
    currency:         'WST',
    settlementBank:   'BSP Financial Group PNG',
    swiftCode:        'BOSPNPPA',
    lastSettlement:   null,
    complianceStatus: 'Compliant',
  },
  {
    code:             'SCB-WS',
    name:             'Samoa Commercial Bank',
    fullName:         'Samoa Commercial Bank Ltd',
    tier:             2,
    status:           'Active',
    statusNote:       'CBS-authorised retail distributor',
    dailyLimitRaw:    '200000000',
    decimals:         2,
    currency:         'WST',
    settlementBank:   'National Bank of Samoa',
    swiftCode:        'SCBLWSAS',
    lastSettlement:   null,
    complianceStatus: 'Compliant',
  },
  {
    code:             'NBS-WS',
    name:             'National Bank of Samoa',
    fullName:         'National Bank of Samoa',
    tier:             2,
    status:           'Active',
    statusNote:       'CBS-authorised retail distributor',
    dailyLimitRaw:    '200000000',
    decimals:         2,
    currency:         'WST',
    settlementBank:   'Reserve Bank of Australia',
    swiftCode:        'NBSAWSAS',
    lastSettlement:   null,
    complianceStatus: 'Compliant',
  },
  {
    code:             'DBS-WS',
    name:             'Development Bank of Samoa',
    fullName:         'Development Bank of Samoa',
    tier:             2,
    status:           'Active',
    statusNote:       'CBS-authorised retail distributor — government development bank',
    dailyLimitRaw:    '150000000',
    decimals:         2,
    currency:         'WST',
    settlementBank:   'Ministry of Finance',
    swiftCode:        'DBSAWSAS',
    lastSettlement:   null,
    complianceStatus: 'Compliant',
  },
];

// ── TIER 3 — INSTITUTIONAL PARTICIPANTS ────────────────────────────────────
// These are NOT retail distributors.
// They receive WST-DPI via their Tier 2 banking partner.
export const TIER_3_PARTICIPANTS = [
  {
    code:             'SNPF',
    name:             'Samoa National Provident Fund',
    type:             'Pension Fund',
    bankingPartner:   'BSP-WS',
    purpose:          'Member pension payments and distributions',
    status:           'Active',
    complianceStatus: 'Compliant',
    note:             'Receives via BSP Samoa — not a direct CBS distributor',
  },
  {
    code:             'UTOS',
    name:             'Unit Trust of Samoa',
    type:             'Investment Fund',
    bankingPartner:   'ANZ-WS',
    purpose:          'Unit holder distributions and redemptions',
    status:           'Active',
    complianceStatus: 'Compliant',
    note:             'Receives via ANZ Bank Samoa',
  },
  {
    code:             'WSTLAC',
    name:             'Western Samoa Life Assurance Corporation',
    type:             'Life Insurance',
    bankingPartner:   'NBS-WS',
    purpose:          'Policy payments and insurance settlements',
    status:           'Active',
    complianceStatus: 'Compliant',
    note:             'Receives via National Bank of Samoa',
  },
];

// ── DBS-3 · PACIFIC CORRESPONDENT AND SETTLEMENT BANKS ─────────────────────
export const CORRESPONDENT_BANKS = [
  {
    name:      'BSP Financial Group PNG',
    role:      'Pacific Correspondent',
    coverage:  'Pacific Islands — PNG, Fiji, Solomon Islands, Vanuatu, Samoa',
    swiftCode: 'BOSPNPPA',
    status:    'Active',
  },
  {
    name:      'ANZ Group Pacific',
    role:      'Pacific Correspondent',
    coverage:  'Pacific Islands — full regional network',
    swiftCode: 'ANZBNPPA',
    status:    'Active',
  },
  {
    name:      'Reserve Bank of Australia',
    role:      'Settlement Bank',
    coverage:  'AUD settlement and clearing',
    swiftCode: 'RBAAU2S',
    status:    'Active',
  },
  {
    name:      'Reserve Bank of New Zealand',
    role:      'Settlement Bank',
    coverage:  'NZD settlement and clearing',
    swiftCode: 'RBNZNZ2W',
    status:    'Active',
  },
];

// ── UTILITY ─────────────────────────────────────────────────────────────────
export function formatDailyLimit(bank) {
  // Uses decimal.js — never native float
  const d = new Decimal(bank.dailyLimitRaw);
  const divisor = new Decimal(10).pow(bank.decimals);
  return d.div(divisor).toFixed(bank.decimals);
}
