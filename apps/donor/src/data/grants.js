/**
 * Phase 1 demo grant data.
 * Mirrors the AIDisbursementTracker.sol data structure exactly.
 *
 * Phase 2: read from on-chain via /api/rpc + eth_getLogs on
 * AIDisbursementTracker GrantCreated and TrancheReleased events.
 *
 * IMPORTANT: amounts use raw integer strings (sene for WST, 2dp).
 * Always display via AmountDisplay — never format inline.
 */

export const DEMO_GRANTS = [
  {
    grantId:        '1',
    title:          'UNICEF Education Programme — Samoa 2026',
    grantor:        'UNICEF Pacific',
    grantorType:    'United Nations Agency',
    recipient:      'Ministry of Education, Sports & Culture',
    recipientCode:  'MESC',
    totalAmountRaw: '10000000',    // 100,000.00 WST
    decimals:        2,
    currency:       'WST',
    status:         'ACTIVE',
    createdAt:       1744934400,   // 18 April 2026
    purpose:        'Primary school digital literacy programme — 12 outer island schools',
    tranches: [
      {
        id:          1,
        amountRaw:   '3000000',   // 30,000.00 WST
        description: 'Milestone 1 — School connectivity equipment procurement',
        status:      'Final',
        verifier:    '0x1234...5678',
        releasedAt:  1745280000,  // 22 April 2026
        txHash:      '0xabc...def',
      },
      {
        id:          2,
        amountRaw:   '3500000',   // 35,000.00 WST
        description: 'Milestone 2 — Teacher digital literacy training (Phase 1)',
        status:      'Final',
        verifier:    '0x1234...5678',
        releasedAt:  1746144000,  // 2 May 2026
        txHash:      '0xdef...abc',
      },
      {
        id:          3,
        amountRaw:   '3500000',   // 35,000.00 WST
        description: 'Milestone 3 — Student device deployment and final assessment',
        status:      'Confirming',
        verifier:    null,
        releasedAt:  null,
        txHash:      null,
      },
    ],
  },
  {
    grantId:        '2',
    title:          'ADB Pacific Digital Infrastructure Grant 2026',
    grantor:        'Asian Development Bank',
    grantorType:    'Multilateral Development Bank',
    recipient:      'Ministry of Finance',
    recipientCode:  'MOF',
    totalAmountRaw: '25000000',    // 250,000.00 WST
    decimals:        2,
    currency:       'WST',
    status:         'ACTIVE',
    createdAt:       1746057600,   // 1 May 2026
    purpose:        'Digital public infrastructure deployment and government capacity building',
    tranches: [
      {
        id:          1,
        amountRaw:   '7500000',   // 75,000.00 WST
        description: 'Phase 1 — Infrastructure procurement and deployment',
        status:      'Initiated',
        verifier:    null,
        releasedAt:  null,
        txHash:      null,
      },
      {
        id:          2,
        amountRaw:   '10000000',  // 100,000.00 WST
        description: 'Phase 2 — CBS integration and pilot deployment',
        status:      'Initiated',
        verifier:    null,
        releasedAt:  null,
        txHash:      null,
      },
      {
        id:          3,
        amountRaw:   '7500000',   // 75,000.00 WST
        description: 'Phase 3 — National rollout and evaluation',
        status:      'Initiated',
        verifier:    null,
        releasedAt:  null,
        txHash:      null,
      },
    ],
  },
];
