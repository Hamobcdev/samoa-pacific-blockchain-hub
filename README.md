# Samoa Digital Public Infrastructure (DPI)
## National University of Samoa · NUS/ISOC Research Programme 2026

> **Research Prototype — Phase 1**
> This is an academic research prototype operated under the
> NUS/ISOC Foundation Research Programme 2026.
> No real citizen data is held. Not officially sanctioned by
> the Government of Samoa.
> Principal Investigator: Dr. Edna Temese, National University of Samoa.

---

## What This Is

A Whole-of-Government Digital Public Infrastructure for the
Independent State of Samoa — connecting all major government
ministries through a shared cryptographic interoperability layer,
with a national digital identity system, a CBS-supervised digital
currency layer, and a trade facilitation interface.

Built to demonstrate that a Pacific Small Island Developing State
can design and operate sovereign digital government infrastructure
using open-source technology, governed locally, without dependency
on foreign commercial platforms.

---

## Research Programme

**Grant:** ISOC Foundation Research Programme 2026
**Lead Institution:** National University of Samoa (NUS)
**Principal Investigator:** Dr. Edna Temese, Faculty of Science IT & Engineering
**International Advisor:** Prof. Stan Karanasios, University of Queensland
**Technical Partner:** Synergy Blockchain Pacific · Apia, Samoa

The research investigates whether a SIDS can implement sovereign
Whole-of-Government DPI and achieve measurable improvements in
financial inclusion, government transparency, and citizen data
sovereignty.

---

## Platform Architecture

### Smart Contracts (Polygon Amoy Testnet)

| Contract | Purpose |
|---|---|
| `NDIDSRegistry.sol` | National Digital Identity System — hash-only, no PII on-chain |
| `MinistryNode.sol` | Per-ministry data store with cryptographic access control |
| `InteroperabilityHub.sol` | Cross-ministry workflow routing and consent enforcement |
| `AIDisbursementTracker.sol` | Grant lifecycle and WST-DPI disbursement management |

All contracts deployed on Polygon Amoy testnet and independently
verifiable on Polygonscan Amoy. Polygon mainnet transactions cost
a fraction of a cent — typically $0.001–$0.05 per transaction.

### Government Node Architecture

55 nodes representing the full Samoan government:
- 25 operational validator nodes across all government branches
- 30 observer nodes for independent monitoring

Branches: Financial · ICT & Infrastructure · Finance · Justice ·
Health & Social · Commerce · Primary Industries · Education ·
Statistics & Identity · Executive

### Seven Portals

| Portal | Port | Audience |
|---|---|---|
| Landing (`dpi.gov.ws`) | 5180 | Public |
| Citizens (`citizens.dpi.gov.ws`) | 5181 | Samoan citizens |
| CBS Admin (`admin.dpi.gov.ws`) | 5182 | CBS leadership and staff |
| Ministry portals (per subdomain) | — | Government officials |
| DBS Distribution (`dbs.dpi.gov.ws`) | 5183 | DBS and retail banks |
| Donor Oversight (`donor.dpi.gov.ws`) | 5184 | Development partners |
| Verify (`verify.dpi.gov.ws`) | 5185 | Employers, service providers |

### WST-DPI Distribution Tiers

- **Tier 1:** Central Bank of Samoa (issuer)
- **Tier 2:** ANZ Bank Samoa · BSP Samoa · Samoa Commercial Bank ·
  National Bank of Samoa · Development Bank of Samoa
- **Tier 3:** SNPF · UTOS · WSTLAC (via Tier 2 banking partners)

---

## Standards Alignment

| Standard | Relevance |
|---|---|
| BIS PFMI | Financial market infrastructure design principles |
| FATF R.15 | AML/CFT requirements for digital payment systems |
| CISA ZTMM 2.0 | Zero Trust security architecture |
| NIST 800-53 | Access control and audit requirements |
| WTO TFA Art. 10.4 | One Maritime Window obligation |
| W3C GovStack | Interoperable digital government building blocks |

---

## Local Development

### Prerequisites

- Node.js 18+
- pnpm (package manager — not npm or yarn)
- Foundry (for smart contracts)

### Install

```bash
git clone https://github.com/Hamobcdev/samoa-pacific-blockchain-hub
cd samoa-pacific-blockchain-hub
pnpm install
```

### Run portals locally

```bash
# Landing (port 5180)
pnpm --filter @samoa-dpi/landing dev

# Citizens (port 5181)
pnpm --filter @samoa-dpi/citizens dev

# CBS Admin (port 5182)
pnpm --filter @samoa-dpi/admin dev

# DBS Distribution (port 5183)
pnpm --filter @samoa-dpi/dbs dev

# Donor Oversight (port 5184)
pnpm --filter @samoa-dpi/donor dev

# Verify (port 5185)
pnpm --filter @samoa-dpi/verify dev

# API proxy (port 3001)
pnpm --filter @samoa-dpi/api dev
```

### Smart contracts

```bash
cd contracts
forge build
forge test        # 29/29 tests must pass
forge test -vv    # verbose output
```

### Build all portals

```bash
pnpm --filter @samoa-dpi/landing  build
pnpm --filter @samoa-dpi/citizens build
pnpm --filter @samoa-dpi/admin    build
pnpm --filter @samoa-dpi/dbs      build
pnpm --filter @samoa-dpi/donor    build
pnpm --filter @samoa-dpi/verify   build
```

All six must exit 0.

---

## Repository Structure

```
packages/
  contracts-abi/    <- Canonical government node registry — 55 nodes
  shared-ui/        <- Shared components, design tokens, currency display

apps/
  landing/          <- Public entry point (port 5180)
  citizens/         <- Citizen-facing portal (port 5181)
  admin/            <- CBS administration portal (port 5182)
  dbs/              <- DBS distribution portal (port 5183)
  donor/            <- Donor oversight portal (port 5184)
  verify/           <- Public verification portal (port 5185)
  ministry/         <- Ministry portals — Phase 2

api/                <- Server-side RPC proxy (port 3001)
contracts/          <- Solidity smart contracts + Foundry tests
docs/               <- Architecture documentation, checklists, research docs
```

---

## Design Principles

- **Samoan identity first:** Samoa flag colours, tapa cloth references,
  bilingual SM/EN throughout
- **Mobile-first:** Designed for Samoan connectivity — intermittent,
  mobile-primary, low-bandwidth resilient
- **WCAG AAA:** All status indicators use colour + icon + text —
  never colour alone
- **No secrets in browser:** All RPC credentials server-side only
- **Single source of truth:** All node data from `@samoa-dpi/contracts-abi`
  — zero hardcoded arrays in any portal
- **Technology-neutral:** No dependency on any single blockchain vendor

---

## Phase Status

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Research prototype · All 7 portals · NUS/ISOC submission | Complete |
| Phase 2 | CBS sandbox · Cold wallet authentication · OMW prototype | In progress |
| Phase 3 | Sovereign chain · Ministry portals · Production deployment | Planned |

---

## Licence

Research codebase: MIT licence (released at programme completion
per NUS/ISOC research agreement).

---

## Contact

**Synergy Blockchain Pacific**
Anthony George Williams · Apia, Independent State of Samoa
synergyblockchaintf@gmail.com · +685 759 3360

**National University of Samoa**
Dr. Edna Temese · Faculty of Science IT & Engineering
Principal Investigator · NUS/ISOC Research Programme 2026
