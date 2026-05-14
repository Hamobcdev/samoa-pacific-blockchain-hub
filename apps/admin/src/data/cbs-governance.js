// CBS_GOVERNANCE_ITEMS — Constitutional source of truth
// Exactly 6 items. All resolved: false until CBS confirms.
// Do not add, remove, or reorder without explicit CBS instruction.

export const CBS_GOVERNANCE_ITEMS = [
  {
    id: 'AC-2-multisig',
    title: 'Multisig Keyholder Identity',
    severity: 'CRITICAL',
    description: 'Confirm 3 keyholders for Gnosis Safe 2-of-3 deployment across all 4 contracts. Currently a single immutable admin EOA controls the entire system.',
    unlocks: 'Eliminates single-key admin risk. Required before Phase 2 launch. Deployment scripts ready.',
    question: 'Who are the 3 authorised keyholders? What is the approved quorum threshold?',
    resolved: false,
  },
  {
    id: 'AC-1-consent',
    title: 'Citizen Consent Legal Framework',
    severity: 'HIGH',
    description: 'Determine whether government can mediate citizen consent administratively for grantReadAccess(). EIP-712 citizen signature implementation is drafted and ready.',
    unlocks: 'Enables citizen-signed consent on identity access grants. GovStack interoperability compliance.',
    question: 'Can government mediate citizen consent administratively, or must each citizen sign individually?',
    resolved: false,
  },
  {
    id: 'AC-3-timelock',
    title: 'Tranche Release Timelock Window',
    severity: 'HIGH',
    description: 'Define mandatory delay between tranche approval and fund release on AIDisbursementTracker. TimelockController implementation is ready pending this decision.',
    unlocks: 'BIS PFMI P9 governance compliance. Prevents instantaneous admin fund release.',
    question: 'What is the governance-mandated timelock delay window for fund releases?',
    resolved: false,
  },
  {
    id: 'PAUSABLE',
    title: 'Circuit Breaker Authority',
    severity: 'HIGH',
    description: 'Assign authority to trigger emergency pause across all 4 contracts. OpenZeppelin Pausable is implemented on all contracts. Pause authority address is unset.',
    unlocks: 'BIS PFMI P17 operational risk compliance. System can be halted on vulnerability discovery.',
    question: 'Who has authority to trigger emergency pause? CBS Governor? Joint CBS + MCIT?',
    resolved: false,
  },
  {
    id: 'SOV-1',
    title: 'Validator Node Assignment',
    severity: 'HIGH',
    description: 'Assign validator nodes for the sovereign Geth Clique PoA chain to CBS, MOF, and MCIT. Genesis block extraData configuration is ready pending this decision.',
    unlocks: 'Sovereign chain deployment can begin. Removes dependency on Polygon Amoy testnet.',
    question: 'Which ministries operate validator nodes? What is the rotation policy and clique period?',
    resolved: false,
  },
  {
    id: 'FATF-1',
    title: 'FATF SAR Reporting Workflow',
    severity: 'HIGH',
    description: 'Define the suspicious activity reporting chain for FATF Recommendation 15 compliance. flagService() function architecture is drafted. Integration point with CBS compliance team unconfirmed.',
    unlocks: 'FATF mutual evaluation readiness. AML flagging capability on-chain. Required before WST-DPI pilot.',
    question: 'Define the SAR reporting workflow, the receiving authority, and integration with CBS compliance systems.',
    resolved: false,
  },
]
