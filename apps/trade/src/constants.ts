import type {
  DemoVessel,
  DemoFlight,
  DemoPassenger,
  CBSGovernanceItem,
  ClearanceRecord,
} from './types'

// ── Demo vessels ──────────────────────────────────────────────────────────────

export const DEMO_VESSELS: DemoVessel[] = [
  {
    vesselName:          'MV Pacific Star',
    imoNumber:           '9234567',
    flagState:           'MH',
    vesselType:          'CARGO',
    grossTonnage:        12450,
    lengthOverall:       142.5,
    masterName:          'Capt. James Faleolo',
    shippingAgentName:   'Samoa Shipping Services Ltd',
    agentLicenceNumber:  'SSS-2024-0012',
    estimatedArrival:    '17/05/2026 14:00',
    destinationBerth:    'APIA_MAIN',
    hasDangerousGoods:   false,
    totalCrew:           18,
    totalPassengers:     0,
    duesOwed:            '15687.00',
    clearanceStatus:     'PARTIAL',
  },
  {
    vesselName:         'MV Ofu Cargo',
    imoNumber:          '8812345',
    flagState:          'WS',
    vesselType:         'BULK',
    grossTonnage:       8200,
    lengthOverall:      112.0,
    masterName:         'Capt. Tauese Pulu',
    shippingAgentName:  'Pacific Trade & Logistics',
    agentLicenceNumber: 'PTL-2023-0087',
    estimatedArrival:   '18/05/2026 09:00',
    destinationBerth:   'APIA_DOMESTIC',
    hasDangerousGoods:  false,
    totalCrew:          12,
    totalPassengers:    0,
    duesOwed:           '10332.00',
    clearanceStatus:    'APPROVED',
  },
  {
    vesselName:          'MV Savaii Explorer',
    imoNumber:           '7654321',
    flagState:           'FJ',
    vesselType:          'CARGO',
    grossTonnage:        6800,
    lengthOverall:       98.5,
    masterName:          'Capt. Sione Tupai',
    shippingAgentName:   'Samoan Pacific Shipping Co',
    agentLicenceNumber:  'SPS-2025-0031',
    estimatedArrival:    '19/05/2026 06:30',
    destinationBerth:    'SALELOLOGA',
    hasDangerousGoods:   true,
    dangerousGoodsClass: '3',
    totalCrew:           9,
    totalPassengers:     0,
    duesOwed:            '8568.00',
    clearanceStatus:     'FLAGGED',
  },
]

// ── Demo flights ──────────────────────────────────────────────────────────────

export const DEMO_FLIGHTS: DemoFlight[] = [
  {
    flightNumber:    'FJ411',
    origin:          'NAN',
    arrivalDate:     '17/05/2026',
    arrivalTime:     '14:00',
    totalPassengers: 47,
    declared:        47,
    greenCount:      39,
    amberCount:      6,
    redCount:        2,
  },
  {
    flightNumber:    'NF101',
    origin:          'AKL',
    arrivalDate:     '17/05/2026',
    arrivalTime:     '09:45',
    totalPassengers: 112,
    declared:        108,
    greenCount:      95,
    amberCount:      11,
    redCount:        2,
  },
]

// ── Demo passengers ───────────────────────────────────────────────────────────

export const DEMO_PASSENGERS: DemoPassenger[] = [
  {
    ref:            'ARR-2026-000189',
    familyName:     'TAUILIILI',
    givenNames:     'Maria Seleisa',
    nationality:    'NZ',
    passportNumber: 'NZ983421',
    flightNumber:   'FJ411',
    purposeOfVisit: 'TOURISM',
    stayDuration:   14,
    riskLevel:      'GREEN',
    carryingGoods:  false,
    carryingCurrency: false,
    carryingAnimals:  false,
    previousIllness:  false,
  },
  {
    ref:              'ARR-2026-000190',
    familyName:       'CHEN',
    givenNames:       'Wei Min',
    nationality:      'AU',
    passportNumber:   'PA341892',
    flightNumber:     'FJ411',
    purposeOfVisit:   'BUSINESS',
    stayDuration:     5,
    riskLevel:        'AMBER',
    carryingGoods:    true,
    goodsDescription: 'Electronic equipment, laptop accessories',
    goodsValue:       '2400',
    carryingCurrency: true,
    currencyAmount:   '12000',
    currencyType:     'AUD',
    previousIllness:  false,
  },
  {
    ref:              'ARR-2026-000191',
    familyName:       'FALEOLO',
    givenNames:       "Tupa'itea",
    nationality:      'WS',
    passportNumber:   'SW019341',
    flightNumber:     'FJ411',
    purposeOfVisit:   'RESIDENT',
    stayDuration:     0,
    riskLevel:        'GREEN',
    carryingGoods:    false,
    carryingCurrency: false,
    carryingAnimals:  true,
    animalDescription:'Companion dog — paperwork attached',
    previousIllness:  false,
    riskOverrideNote: 'Animal declaration — routine processing',
  },
]

// ── Demo officer credentials ──────────────────────────────────────────────────

export const DEMO_OFFICER_CREDENTIALS: Record<string, { name: string; credHash: string }> = {
  customs:    { name: 'Officer Malia Fono',       credHash: '0x3f7a...8b21' },
  immigration:{ name: 'Officer Sione Lesa',       credHash: '0x9c2d...4f18' },
  maf:        { name: 'Inspector Tala Sauni',     credHash: '0x6e1b...2a97' },
  portHealth: { name: 'Dr. Uelese Matagi',        credHash: '0x5d4c...7f03' },
  portAuth:   { name: 'Harbour Master Pepe Fiti', credHash: '0x2a8f...c14d' },
}

// ── Demo clearance record — in-progress ──────────────────────────────────────

export const DEMO_CLEARANCE: ClearanceRecord = {
  vesselRef:  'NOA-2026-0042',
  formRef:    'NOA-2026-0042',
  vesselName: 'MV Pacific Star',
  imoNumber:  '9234567',
  eta:        '17/05/2026 14:00',
  formStatuses: [
    { label: 'Notice of Arrival',          status: 'SUBMITTED' },
    { label: 'FAL Form 1 (General Decl)',  status: 'SUBMITTED' },
    { label: 'FAL Form 5 (Crew List)',     status: 'SUBMITTED' },
    { label: 'FAL Form 7 (Dangerous Gds)', status: 'NOT_REQUIRED' },
    { label: 'Health Declaration',         status: 'SUBMITTED' },
  ],
  ministryStatuses: [
    { ministry: 'Customs & Revenue',    code: 'customs',    status: 'CLEARED',       clearedAt: '16/05 11:45' },
    { ministry: 'Immigration',          code: 'immigration',status: 'CLEARED',       clearedAt: '16/05 12:10' },
    { ministry: 'MAF / Biosecurity',    code: 'maf',        status: 'PENDING' },
    { ministry: 'Port Health',          code: 'portHealth', status: 'AWAITING_DOCS' },
    { ministry: 'Samoa Port Authority', code: 'portAuth',   status: 'AWAITING_PRIOR' },
  ],
  duesAmount: '15,687.00',
  duesStatus: 'CBS_HELD',
}

// ── Demo clearance record — fully cleared (MV Ofu Cargo) ─────────────────────

export const DEMO_CLEARANCE_CLEARED: ClearanceRecord = {
  vesselRef:  'NOA-2026-0039',
  formRef:    'NOA-2026-0039',
  vesselName: 'MV Ofu Cargo',
  imoNumber:  '8812345',
  eta:        '18/05/2026 09:00',
  formStatuses: [
    { label: 'Notice of Arrival',          status: 'SUBMITTED' },
    { label: 'FAL Form 1 (General Decl)',  status: 'SUBMITTED' },
    { label: 'FAL Form 5 (Crew List)',     status: 'SUBMITTED' },
    { label: 'FAL Form 7 (Dangerous Gds)', status: 'NOT_REQUIRED' },
    { label: 'Health Declaration',         status: 'SUBMITTED' },
  ],
  ministryStatuses: [
    { ministry: 'Customs & Revenue',    code: 'customs',    status: 'CLEARED', clearedAt: '18/05 08:15' },
    { ministry: 'Immigration',          code: 'immigration',status: 'CLEARED', clearedAt: '18/05 08:20' },
    { ministry: 'MAF / Biosecurity',    code: 'maf',        status: 'CLEARED', clearedAt: '18/05 08:30' },
    { ministry: 'Port Health',          code: 'portHealth', status: 'CLEARED', clearedAt: '18/05 08:45' },
    { ministry: 'Samoa Port Authority', code: 'portAuth',   status: 'CLEARED', clearedAt: '18/05 09:00' },
  ],
  duesAmount: '10,332.00',
  duesStatus: 'PAID',
}

// ── CBS Governance items (canonical — must match apps/admin exactly) ──────────

export const CBS_GOVERNANCE_ITEMS: CBSGovernanceItem[] = [
  {
    id:              'AC-2-multisig',
    itemNumber:      1,
    title:           'Multi-Signature Governance (Gnosis Safe)',
    severity:        'CRITICAL',
    description:     'Confirm 3 keyholders for Gnosis Safe 2-of-3 deployment across all 4 contracts. Currently a single immutable admin EOA controls the entire system.',
    unlocks:         'Eliminates single-key admin risk. Required before Phase 2 launch. Deployment scripts ready.',
    question:        'Who are the 3 authorised keyholders? What is the approved quorum threshold?',
    resolved:        false,
    featureFlag:     'VITE_FLAG_MULTISIG',
    technicalStatus: 'Architecture complete — Gnosis Safe deployment scripts ready',
    awaitingCBS:     'Keyholder identity and quorum threshold',
    whatItDoes:      'Replaces the single admin key across all 4 smart contracts with a 2-of-3 Gnosis Safe multisig wallet. No single person can unilaterally execute high-value operations.',
    whyPending:      'CBS must designate 3 named keyholders and confirm the required quorum (recommended: 2-of-3). The technical implementation is complete and deployment-ready.',
    whatHappensWhen: 'SBP deploys the Gnosis Safe, transfers admin rights from the single deployer key, and confirms with CBS within 24 hours of receiving keyholder names.',
  },
  {
    id:              'PAUSABLE',
    itemNumber:      2,
    title:           'Emergency Circuit Breaker — System Pause',
    severity:        'HIGH',
    description:     'Assign authority to trigger emergency pause across all 4 contracts. OpenZeppelin Pausable is implemented. Pause authority address is unset.',
    unlocks:         'BIS PFMI P17 operational risk compliance. System can be halted on vulnerability discovery.',
    question:        'Who has authority to trigger emergency pause? CBS Governor? Joint CBS + MCIT?',
    resolved:        false,
    featureFlag:     'VITE_FLAG_CIRCUIT_BREAKER',
    technicalStatus: 'OZ Pausable implemented on all four contracts',
    awaitingCBS:     'Who holds emergency pause authority?',
    whatItDoes:      'Allows an authorised officer to instantly halt all system operations in an emergency.',
    whyPending:      'CBS must formally designate who holds pause authority. BIS PFMI Principle 17 requires this designation to be documented.',
    whatHappensWhen: 'SBP activates the circuit breaker function and assigns pause authority to the designated CBS role within 24 hours of receiving the designation in writing.',
  },
  {
    id:              'AC-3-timelock',
    itemNumber:      3,
    title:           'Timelock on Fund Release (releaseTranche)',
    severity:        'HIGH',
    description:     'Define mandatory delay between tranche approval and fund release on AIDisbursementTracker. TimelockController implementation is ready pending this decision.',
    unlocks:         'BIS PFMI P9 governance compliance. Prevents instantaneous admin fund release.',
    question:        'What is the governance-mandated timelock delay window for fund releases?',
    resolved:        false,
    featureFlag:     'VITE_FLAG_TIMELOCK',
    technicalStatus: 'TimelockController contracts deployed and tested',
    awaitingCBS:     'Governance-mandated delay window per function type',
    whatItDoes:      'Enforces a mandatory waiting period between when a fund release is approved and when it executes.',
    whyPending:      'CBS must specify the governance-approved timelock delay window. Options range from 1 hour to 24 hours per transaction type.',
    whatHappensWhen: 'SBP configures the TimelockController with the CBS-specified delay periods and deploys within 24 hours of receiving the approved delay schedule.',
  },
  {
    id:              'SOV-1',
    itemNumber:      4,
    title:           'Validator Node Designation',
    severity:        'HIGH',
    description:     'Assign validator nodes for the sovereign Geth Clique PoA chain to CBS, MOF, and MCIT. Genesis block extraData configuration is ready pending this decision.',
    unlocks:         'Sovereign chain deployment can begin. Removes dependency on Polygon Amoy testnet.',
    question:        'Which ministries operate validator nodes? What is the rotation policy and clique period?',
    resolved:        false,
    featureFlag:     'VITE_FLAG_VALIDATOR_GOV',
    technicalStatus: 'Genesis block configuration ready — validator slots reserved',
    awaitingCBS:     'Which ministries operate validator nodes?',
    whatItDoes:      "Defines which government ministries or institutions operate the validator nodes on the sovereign chain.",
    whyPending:      'CBS must confirm which ministries co-govern the network as validator node operators. The recommended structure is: CBS, MOF, and MCIT as the initial 3 validators.',
    whatHappensWhen: 'SBP generates validator keys for each designated ministry, configures the genesis block, and launches the sovereign chain within 48 hours of receiving confirmation.',
  },
  {
    id:              'AC-1-consent',
    itemNumber:      5,
    title:           'Citizen Consent for Cross-Ministry Data Access',
    severity:        'MEDIUM',
    description:     "Determine whether government can mediate citizen consent administratively for grantReadAccess(). EIP-712 citizen signature implementation is drafted and ready.",
    unlocks:         'Enables citizen-signed consent on identity access grants. GovStack interoperability compliance.',
    question:        'Can government mediate citizen consent administratively, or must each citizen sign individually?',
    resolved:        false,
    featureFlag:     'VITE_FLAG_CONSENT',
    technicalStatus: 'EIP-712 consent mechanism designed and implemented',
    awaitingCBS:     'Policy: can government mediate citizen consent administratively?',
    whatItDoes:      "Determines how a citizen's consent is recorded when a ministry requests access to their records held by another ministry.",
    whyPending:      'CBS and the Attorney General must confirm whether the government can legally mediate citizen consent administratively, or whether citizen digital signature is required.',
    whatHappensWhen: 'SBP implements the legally approved consent model within 48 hours of receiving the legal determination.',
  },
  {
    id:              'FATF-1',
    itemNumber:      6,
    title:           'AML Flag and Suspicious Activity Reporting (FATF R.15)',
    severity:        'HIGH',
    description:     'Define the suspicious activity reporting chain for FATF Recommendation 15 compliance. flagService() function architecture is drafted.',
    unlocks:         'FATF mutual evaluation readiness. AML flagging capability on-chain. Required before WST-DPI pilot.',
    question:        'Define the SAR reporting workflow, the receiving authority, and integration with CBS compliance systems.',
    resolved:        false,
    featureFlag:     'VITE_FLAG_FATF',
    technicalStatus: 'flagService() implemented — SAR event architecture complete',
    awaitingCBS:     'SAR reporting chain and CBS compliance integration specification',
    whatItDoes:      'Enables an authorised officer to flag a transaction or service record as potentially suspicious, triggering the FATF Recommendation 15 Suspicious Activity Report (SAR) workflow.',
    whyPending:      'CBS must define the SAR reporting chain: who can flag, who reviews, who files with the FATF reporting authority.',
    whatHappensWhen: 'SBP activates the flagService() function and connects it to the CBS-defined reporting workflow within 48 hours of receiving the workflow definition.',
  },
]

// ── i18n strings ──────────────────────────────────────────────────────────────

export const I18N = {
  en: {
    portalTitle:          'Trade & Border Clearance Portal',
    maritimeTab:          'Maritime',
    aviationTab:          'Aviation',
    roleShippingAgent:    'Shipping Agent / Ship Master',
    roleOfficer:          'Government Officer',
    rolePassenger:        'Passenger / Airline',
    noticeOfArrival:      'Notice of Arrival',
    generalDeclaration:   'General Declaration',
    crewList:             'Crew List',
    dangerousGoods:       'Dangerous Goods',
    healthDeclaration:    'Maritime Health Declaration',
    harbourDues:          'Harbour Dues',
    portClearance:        'Port Clearance Certificate',
    arrivalDeclaration:   'Passenger Arrival Declaration',
    departureDeclaration: 'Passenger Departure Declaration',
    pendingCBSApproval:   'Pending CBS Policy Approval',
    demoMode:             'Demo Mode — No wallet connected',
    switchRole:           'Switch role',
    submit:               'Submit',
    next:                 'Next →',
    back:                 '← Back',
    download:             'Download',
    copyClipboard:        'Copy to clipboard',
    statusPending:        'FAATALITALI',
    statusUnderReview:    "O LO'O SIAKI",
    statusApproved:       'UA PASIA',
    statusPortCleared:    'UA FAASAOLOTO I LE UAFU',
    statusHold:           'TAOFI',
    portClearedBanner:    'UA FAASAOLOTO I LE UAFU / PORT CLEARED',
    tabClearanceStatus:   'Clearance Status',
    tabPortCert:          'Port Clearance Certificate',
    tabVoyageDetails:     'Voyage Details',
  },
  sm: {
    portalTitle:          "Faitoto'o o Fefa'ataua'iga ma Tulagavae",
    maritimeTab:          'Vaa Folau',
    aviationTab:          'Va Ea',
    roleShippingAgent:    'Sui o le Vaa / Kapeteni',
    roleOfficer:          'Ofisa o le Malo',
    rolePassenger:        'Tagata Malaga / Ea',
    noticeOfArrival:      'Faasilasilaga o le Taunuu',
    generalDeclaration:   'Faamaoniga Lautele',
    crewList:             'Lisi o Tagata Faigaluega',
    dangerousGoods:       'Oloa Matautia',
    healthDeclaration:    'Faamaoniga o le Soifua Maloloina',
    harbourDues:          'Tupe Taulaga',
    portClearance:        'Tusi Faatagaga o le Uafu',
    arrivalDeclaration:   'Faamaoniga o Taunuu',
    departureDeclaration: 'Faamaoniga o Alu Atu',
    pendingCBSApproval:   'Faatali faaiuga a le CBS',
    demoMode:             "Fa'amaoniga Demo — Leai ni Pusi Fesootai",
    switchRole:           'Suia le matafaioi',
    submit:               'Tuuina atu',
    next:                 'Sosoo →',
    back:                 '← Toe foi',
    download:             'Sii i lalo',
    copyClipboard:        'Kopi i le klipiboa',
    statusPending:        'FAATALITALI',
    statusUnderReview:    "O LO'O SIAKI",
    statusApproved:       'UA PASIA',
    statusPortCleared:    'UA FAASAOLOTO I LE UAFU',
    statusHold:           'TAOFI',
    portClearedBanner:    'UA FAASAOLOTO I LE UAFU / PORT CLEARED',
    tabClearanceStatus:   'Tulaga o Faatagaga',
    tabPortCert:          'Tusi Faatagaga o le Uafu',
    tabVoyageDetails:     'Faaamatalaga o le Malaga',
  },
}

export type LangKey = keyof typeof I18N.en

export function t(lang: string, key: LangKey): string {
  const l = (lang === 'SM' || lang === 'sm') ? 'sm' : 'en'
  return I18N[l][key] ?? I18N.en[key]
}

// ── Harbour dues rates ────────────────────────────────────────────────────────

export const BASE_RATE_PER_GT: Record<string, number> = {
  CARGO:     0.42,
  TANKER:    0.55,
  PASSENGER: 0.38,
  BULK:      0.40,
  OTHER:     0.35,
}

// ── Tapa SVG pattern (same as admin/theme.js) ─────────────────────────────────

const TAPA_PATTERN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'>
  <rect width='48' height='48' fill='none'/>
  <path d='M0 12 L12 0 M0 24 L24 0 M0 36 L36 0 M0 48 L48 0
           M12 48 L48 12 M24 48 L48 24 M36 48 L48 36'
        stroke='rgba(201,162,39,0.06)' stroke-width='0.5'/>
  <rect x='18' y='18' width='12' height='12'
        fill='none' stroke='rgba(0,48,135,0.07)' stroke-width='0.5'/>
  <circle cx='24' cy='24' r='2'
          fill='none' stroke='rgba(201,162,39,0.04)' stroke-width='0.5'/>
</svg>`

export const TAPA_BG = `url("data:image/svg+xml,${encodeURIComponent(TAPA_PATTERN_SVG)}")`

// ── Design tokens ─────────────────────────────────────────────────────────────

export const C = {
  flagRed:    '#CE1126',
  flagBlue:   '#003087',
  gold:       '#C9A227',
  bg:         '#ffffff',
  surface:    '#f8f9fb',
  surface2:   '#f0f2f5',
  surface3:   '#18213c',
  border:     '#d0d5dd',
  border2:    '#253258',
  text:       '#1a2a3a',
  muted:      '#4a5568',
  dim:        '#718096',
  textOnDark: '#e8edf8',
  navy:       '#1a2a3a',
  green:     '#00c896',
  greenBg:   '#021a12',
  greenBdr:  '#054030',
  amber:     '#f0b429',
  amberBg:   '#130f00',
  amberBdr:  '#352a00',
  critical:  '#ff3b4e',
  critBg:    '#180a0c',
  critBdr:   '#3a1018',
  purple:    '#8b5cf6',
  purpleBg:  '#0d0618',
  purpleBdr: '#251245',
  info:      '#38bdf8',
}

export const MONO = 'IBM Plex Mono, monospace'
export const SANS = 'IBM Plex Sans, sans-serif'
