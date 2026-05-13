// Copied from frontend/src/App.jsx (line 250) — DO NOT modify the monolith.
// Polygon Amoy Testnet — deployed 18 March 2026, verified on Polygonscan.

export const ADDR = {
  NDIDS:     "0x0E832d0C324Cd70ca58Dd1B0965151167853cE42",
  AID:       "0x3fD12fe1400BD9B8cd7ebE59C47EA27ab6bF5EdB",
  HUB:       "0x6c213b53b41c325317dF0443442b0eae9c7618Cc",
  CBS:       "0xeC404FB5564da6f6c77DD7C8A694B1A3fFCe99c1",
  MCIT:      "0x4F117fdC9BB2b781d52731E5674f669Bfe1E6402",
  MOF:       "0x8c26B5E477d6feFf2a75C0Fbd7f3667c4dB07FC4",
  MCIL:      "0xe9b67Df4a062C20167D963DD74fc436c1B83EceD",
  EDUCATION: "0xa3Cb3B9A6DF26cd550A6D8A49EF693c78750F27d",
  CUSTOMS:   "0x6462197ff41c7EbA925e0F9EB980e61454e40366",
  // SBS uses NDIDSRegistry for MVP — dedicated SBSRegistry contract in Phase 2
  SBS:       "0x0E832d0C324Cd70ca58Dd1B0965151167853cE42",
} as const;

export type ContractKey = keyof typeof ADDR;
