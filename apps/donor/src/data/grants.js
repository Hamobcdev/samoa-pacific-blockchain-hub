/**
 * Phase 1 demo grant data.
 * Mirrors the AIDisbursementTracker.sol data structure exactly.
 *
 * Phase 2: read from on-chain via /api/rpc + eth_getLogs on
 * AIDisbursementTracker GrantCreated and TrancheReleased events.
 *
 * AMOUNTS: human-readable display values (no blockchain scaling).
 * decimals = number of decimal places to show, NOT a scaling factor.
 * Always display via AmountDisplay — never format inline.
 *
 * CURRENCY POLICY: WST and USD fiat only. No crypto tickers in UI.
 */

export const DEMO_GRANTS = [
  {
    grantId:        '1',
    title:          'Pacific Education Programme — Samoa 2026',
    grantor:        'Development Partner',
    grantorType:    'Development Partner',
    recipient:      'Ministry of Education, Sports & Culture',
    recipientCode:  'MESC',
    totalAmountRaw: '10000000',    // 100,000.00 WST
    decimals:        2,
    currency:       'WST',
    status:         'ACTIVE',
    createdAt:       1744934400000,  // 18 April 2026
    purpose:        'Primary school digital literacy programme — 12 outer island schools',
    tranches: [
      {
        id:          1,
        amountRaw:   '3000000',   // 30,000.00 WST
        description: 'Milestone 1 — School connectivity equipment procurement',
        status:      'Final',
        verifier:    '0x1234...5678',
        releasedAt:  1745280000000,  // 22 April 2026
        txHash:      '0xabc...def',
      },
      {
        id:          2,
        amountRaw:   '3500000',   // 35,000.00 WST
        description: 'Milestone 2 — Teacher digital literacy training (Phase 1)',
        status:      'Final',
        verifier:    '0x1234...5678',
        releasedAt:  1746144000000,  // 2 May 2026
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
    createdAt:       1746057600000,  // 1 May 2026
    purpose:        'Digital public infrastructure deployment and government capacity building',
    tranches: [
      {
        id:          1,
        amountRaw:   '7500000',   // 75,000.00 WST
        description: 'Phase 1 — Infrastructure procurement and deployment',
        status:      'Final',
        verifier:    '0x1234...5678',
        releasedAt:  1746489600000,  // 6 May 2026
        txHash:      '0xbcd...efg',
      },
      {
        id:          2,
        amountRaw:   '10000000',  // 100,000.00 WST
        description: 'Phase 2 — CBS integration and pilot deployment',
        status:      'Final',
        verifier:    '0x1234...5678',
        releasedAt:  1747353600000,  // 16 May 2026
        txHash:      '0xcde...fgh',
      },
      {
        id:          3,
        amountRaw:   '7500000',   // 75,000.00 WST
        description: 'Phase 3 — National rollout and evaluation',
        status:      'Confirming',
        verifier:    null,
        releasedAt:  null,
        txHash:      null,
      },
    ],
  },
  {
    grantId:        'NUS-ISOC-2026',
    title:          'Pacific Digital Sovereignty Research Programme',
    grantor:        'Internet Society (ISOC) Foundation',
    grantorType:    'Research Foundation',
    recipient:      'National University of Samoa',
    recipientCode:  'NUS',
    totalAmountRaw: '500000',        // 500,000.00 USD
    decimals:        2,
    displayDecimals: 2,
    currency:       'USD',
    status:         'ACTIVE',
    confirmed:       false,
    confirmedNote:  'Indicative grant amount — application pending ISOC Foundation',
    createdAt:       1746144000000,  // 2 May 2026
    purpose:        'Research grant supporting the Samoa DPI sovereignty and digital infrastructure programme. Principal Investigator: Dr. Edna Temese, NUS.',
    description:    'Research grant supporting the Samoa DPI sovereignty and digital infrastructure programme. Principal Investigator: Dr. Edna Temese, NUS.',
    tranches: [
      {
        id:          1,
        amountRaw:   '150000',       // 150,000.00 USD
        description: 'Milestone 1 — Research Design & Protocol',
        status:      'Confirming',
        verifier:    null,
        releasedAt:  null,
        txHash:      null,
      },
      {
        id:          2,
        amountRaw:   '200000',       // 200,000.00 USD
        description: 'Milestone 2 — Platform Prototype Deployment',
        status:      'Initiated',
        verifier:    null,
        releasedAt:  null,
        txHash:      null,
      },
      {
        id:          3,
        amountRaw:   '150000',       // 150,000.00 USD
        description: 'Milestone 3 — Final Report & Dissemination',
        status:      'Initiated',
        verifier:    null,
        releasedAt:  null,
        txHash:      null,
      },
    ],
  },
];
