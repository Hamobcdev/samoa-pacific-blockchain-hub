# ISOC Submission — Live Platform Reference
# NUS/ISOC Research Programme 2026

## Live Demo URLs — Publicly Accessible

These URLs allow any ISOC reviewer to independently verify
the platform without contacting Synergy Blockchain Pacific.
All portals are live in production on Vercel.

| Portal | URL | Audience |
|--------|-----|----------|
| Landing | https://landing-alpha-seven-82.vercel.app | Public |
| Citizens | https://samoa-dpi-citizens.vercel.app | Samoan citizens |
| CBS Admin | https://samoa-dpi-admin.vercel.app | CBS leadership and staff |
| DBS Distribution | https://samoa-dpi-dbs.vercel.app | DBS and retail banks |
| Donor Oversight | https://samoa-dpi-donor.vercel.app | Development partners |
| Verify | https://samoa-dpi-verify-clqfc53lj-synergy-core-devs.vercel.app | Employers, service providers |

## Platform Capabilities — Current (as of 17 May 2026, commit 5a84df0)

### Landing Portal — https://landing-alpha-seven-82.vercel.app
- Public entry point with links to all 6 portals
- Role-sorted portal cards with audience labels and access notes
- Verify portal card notes: "Also accessible from the Citizens Portal"
- Research environment banner (NUS/ISOC context)

### Citizens Portal — https://samoa-dpi-citizens.vercel.app
- Full SM/EN language toggle (Samoan default)
- 7 navigation tabs: Home, Services, My Records, Verify, Identity, Access, Help
- 11 service categories covering 40+ government services
- 9-tier national identity system with 4-option UI (Tier 1 / Tier 5 / Tier 7 / Tier 9)
- Tier-based access gating: higher tiers unlock additional service categories
- Integrated Verify tab (credential check without identity tier requirement)
- Ministry Access popup (Phase 2 placeholder with contact flow)
- Mobile-first responsive layout
- Research gate on first visit (stored 30 days in localStorage)

### CBS Admin Portal — https://samoa-dpi-admin.vercel.app
- 6 CBS governance decision items (AC-2-multisig, PAUSABLE, AC-3-timelock, SOV-1, AC-1-consent, FATF-1)
- Clickable summary panel: one row per pending decision with severity badge
- CBSGovernanceGate popup per item: plain-language "What it does / Why pending / When CBS decides"
- Severity levels (CRITICAL / HIGH / MEDIUM) with colour + icon coding
- Feature flag references (VITE_FLAG_MULTISIG, VITE_FLAG_CIRCUIT_BREAKER, etc.)
- 24-hour action statements for each item once CBS provides confirmation
- MULTISIG_ACTIVE feature gate (Phase 2 section, currently gated off)
- Export / Print button on governance panel
- Sign Out navigation

### DBS Distribution Portal — https://samoa-dpi-dbs.vercel.app
- Retail bank disbursement dashboard
- WST daily limits per account tier
- NBS (National Bank of Samoa) as settlement bank
- Fiat-only display: WST, USD, NZD, AUD — no cryptocurrency references

### Donor Oversight Portal — https://samoa-dpi-donor.vercel.app
- NUS-ISOC-2026 grant: 500,000.00 USD (indicative, fiat)
- Grant lifecycle: milestone-based tranche tracking
- Field verification workflow (UNICEF-style disbursement transparency)
- Export / Print capability for grant lifecycle records

### Verify Portal — https://samoa-dpi-verify-clqfc53lj-synergy-core-devs.vercel.app
- Single-action printable credential verification
- Employer and service provider audience
- No identity tier required — open verification flow
- Also accessible from within the Citizens Portal (Verify tab)

## Verified Commit

Branch: feat/currency-architecture
Commit: 5a84df0
Repository: github.com/Hamobcdev/samoa-pacific-blockchain-hub

## On-Chain Verification

All contracts are deployed on Polygon Amoy testnet (chainId: 80002)
and queryable by any reviewer directly on Polygonscan Amoy.

| Contract | Address |
|---|---|
| NDIDSRegistry | 0x0E832d0C324Cd70ca58Dd1B0965151167853cE42 |
| AIDisbursementTracker | 0x3fD12fe1400BD9B8cd7ebE59C47EA27ab6bF5EdB |
| InteroperabilityHub | 0x6c213b53b41c325317dF0443442b0eae9c7618Cc |
| MinistryNode — CBS | 0xeC404FB5564da6f6c77DD7C8A694B1A3fFCe99c1 |
| MinistryNode — MCIT | 0x4F117fdC9BB2b781d52731E5674f669Bfe1E6402 |
| MinistryNode — MOF | 0x8c26B5E477d6feFf2a75C0Fbd7f3667c4dB07FC4 |
| MinistryNode — MCIL | 0xe9b67Df4a062C20167D963DD74fc436c1B83EceD |
| MinistryNode — Education | 0xa3Cb3B9A6DF26cd550A6D8A49EF693c78750F27d |
| MinistryNode — Customs | 0x6462197ff41c7EbA925e0F9EB980e61454e40366 |

## Research Environment Statement

This is a Phase 1 research prototype.
No real citizen data is held.
No real funds are involved.
Not officially sanctioned by the Government of Samoa.

Operated under the NUS/ISOC Research Programme 2026.
Principal Investigator: Dr. Edna Temese — National University of Samoa.
Technical Partner: Synergy Blockchain Pacific — Apia, Samoa.
Contact: synergyblockchaintf@gmail.com
