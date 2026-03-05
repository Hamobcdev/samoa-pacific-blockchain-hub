# Samoa Pacific Blockchain Hub

**The first blockchain-based government interoperability system built by a Samoan, for Samoa.**

Built by [Synergy Blockchain Pacific](https://github.com/Hamobcdev) · UNICEF Venture Fund 2026 Application

---

## What This Is

A proof-of-concept blockchain system that allows six Samoan government ministries to share citizen service data securely and transparently — while preserving full citizen privacy and giving aid donors complete accountability over every dollar disbursed.

This is not a theoretical design. It is a deployed, tested, running system with 28+ passing tests and a live multi-stakeholder dashboard.

---

## Live Demo

**Dashboard:** [https://hamobcdev.github.io/samoa-pacific-blockchain-hub](https://hamobcdev.github.io/samoa-pacific-blockchain-hub)

Four stakeholder views — no login required for the demo:

| Role | What you see |
|---|---|
| 🏛️ UNICEF Donor | Grant disbursement, tranche tracker, field evidence, immutable audit trail |
| 💼 Ministry Officer | Record service delivery, manage data permissions, read cross-ministry records |
| 🪪 NDIDS Admin | Citizen registry, access matrix, live identity verification, privacy layers |
| 🌍 Public / Auditor | Ministry network, live events, contract addresses, system transparency |

---

## Deployed Contracts

> Update this section after each deployment

### Polygon Mainnet
| Contract | Address |
|---|---|
| NDIDSRegistry | *pending deployment* |
| AIDisbursementTracker | *pending deployment* |
| InteroperabilityHub | *pending deployment* |
| CBS Node | *pending deployment* |
| MCIT Node | *pending deployment* |
| MOF Node | *pending deployment* |
| MCIL Node | *pending deployment* |
| Education Node | *pending deployment* |
| Customs Node | *pending deployment* |

### Anvil Local (deterministic addresses)
| Contract | Address |
|---|---|
| NDIDSRegistry | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| AIDisbursementTracker | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| InteroperabilityHub | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| CBS Node | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |
| MCIT Node | `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9` |
| MOF Node | `0x5FC8d32690cc91D4c39d9d3abcBD16989F875707` |
| MCIL Node | `0x0165878A594ca255338adfa4d48449f69242Eb8F` |
| Education Node | `0xa513E6E4b8f2a923D98304ec87F64353C4D5C853` |
| Customs Node | `0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6` |

---

## Smart Contract Architecture

```
InteroperabilityHub
├── NDIDSRegistry          — Privacy-preserving citizen identity
├── AIDisbursementTracker  — Milestone-based aid accountability
└── Ministry Nodes (×6)
    ├── Central Bank of Samoa (CBS)
    ├── Ministry of Communications & IT (MCIT)
    ├── Ministry of Finance (MOF)
    ├── Ministry of Commerce, Industry & Labour (MCIL)
    ├── Ministry of Education, Sports & Culture (EDUCATION)
    └── Ministry of Customs & Revenue (CUSTOMS)
```

**Key design principles:**
- No PII ever touches the chain — only `keccak256(citizenId + citizen-held-salt)` hashes
- Each ministry owns its node — data sovereignty by architecture
- Cross-ministry reads require explicit on-chain permission grants
- Permissions are per-citizen, per-ministry, and revocable at any time
- AID disbursement is milestone-based — funds release only on achievement, verified by field officer

See [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) for the full technical specification.

---

## Test Suite

```bash
cd contracts

# Full suite — 28+ tests
forge test -vv

# Integration scenarios (6 full end-to-end scenarios)
forge test --match-contract SamoaIntegrationScenarios -vv

# Individual scenarios
forge test --match-test test_Scenario1_CrossMinistryDataSharing -vvvv
forge test --match-test test_Scenario2_FullCitizenJourney -vvvv
forge test --match-test test_Scenario3_AIDGrantFullLifecycle -vvvv
forge test --match-test test_Scenario4_PrivacyDemonstration -vvvv
forge test --match-test test_Scenario5_PermissionRevocation -vvvv
forge test --match-test test_Scenario6_MultiMinistryTradeWorkflow -vvvv

# Gas report
forge test --match-contract SamoaIntegrationScenarios --gas-report
```

---

## Live Demo Scripts

Six interactive cast scripts demonstrate each scenario against a live Anvil chain.

```bash
# Terminal 1 — start local chain
anvil

# Terminal 2 — deploy contracts
forge script script/Deploy.s.sol:DeploySamoaHub \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast -vvvv

# Run interactive demo menu
bash contracts/demo/run_demo.sh

# Or run all 6 scenarios in sequence
bash contracts/demo/run_demo.sh all
```

| Script | Scenario |
|---|---|
| `run_demo.sh 1` | Cross-ministry data sharing with access control |
| `run_demo.sh 2` | Full citizen journey — NDIDS → Education → MOF benefit |
| `run_demo.sh 3` | AID grant lifecycle — create → release → verify → complete |
| `run_demo.sh 4` | Privacy demonstration — what each party sees and cannot see |
| `run_demo.sh 5` | Permission revocation — grant, use, revoke, denied |
| `run_demo.sh 6` | Multi-ministry trade workflow — Customs → MCIL → MOF |

---

## Running Locally

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) — `curl -L https://foundry.paradigm.xyz | bash && foundryup`
- Node.js 18+ — `node --version`
- Git

### Setup

```bash
git clone https://github.com/Hamobcdev/samoa-pacific-blockchain-hub.git
cd samoa-pacific-blockchain-hub

# Install frontend dependencies
cd frontend && npm install

# Run the dashboard
npm run dev
# Open http://localhost:5173

# Run tests
cd ../contracts && forge test -vv
```

### Full system with live chain

```bash
# Terminal 1
anvil

# Terminal 2
cd contracts
forge script script/Deploy.s.sol:DeploySamoaHub \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast -vvvv

# Terminal 3
cd frontend && npm run dev
```

---

## Deploying to Polygon Mainnet

```bash
cd contracts
source .env

# Verify wallet balance (expect ~$3-8 USD in gas)
cast balance $ADMIN_ADDRESS --rpc-url https://polygon-rpc.com

# Deploy
forge script script/Deploy.s.sol:DeploySamoaHub \
  --rpc-url https://polygon-rpc.com \
  --account deployer \
  --sender $ADMIN_ADDRESS \
  --broadcast \
  --verify \
  --etherscan-api-key $POLYGONSCAN_API_KEY \
  -vvvv
```

---

## Production Authentication

The demo uses a role-selector landing page for presentation clarity. In production deployment, wallet-based authentication replaces this:

Each ministry officer connects with their ministry's Ethereum wallet address. The smart contracts already enforce data access permissions at the cryptographic level — a wallet address without explicit permissions cannot read or write protected data, regardless of what the frontend shows. No central login server is required. The blockchain wallet IS the authentication layer.

See [TECHNICAL_ARCHITECTURE.md — Production Authentication](./TECHNICAL_ARCHITECTURE.md#production-authentication) for the full implementation specification.

---

## Project Structure

```
samoa-pacific-blockchain-hub/
├── contracts/
│   ├── src/
│   │   ├── NDIDSRegistry.sol
│   │   ├── MinistryNode.sol
│   │   ├── AIDisbursementTracker.sol
│   │   └── InteroperabilityHub.sol
│   ├── test/
│   │   ├── SamoaPacificBlockchainHub.t.sol   — 22 unit tests
│   │   └── SamoaIntegrationScenarios.t.sol   — 6 integration scenarios
│   ├── script/
│   │   ├── Deploy.s.sol                       — Full deployment
│   │   ├── Step1_CoreContracts.s.sol          — Step deploy
│   │   ├── Step2_MinistryNodes.s.sol
│   │   └── Step3_WireAndSeed.s.sol
│   └── demo/
│       ├── run_demo.sh                        — Master demo runner
│       ├── scenario1_cross_ministry.sh
│       ├── scenario2_citizen_journey.sh
│       ├── scenario3_aid_lifecycle.sh
│       ├── scenario4_privacy.sh
│       ├── scenario5_revocation.sh
│       └── scenario6_trade_workflow.sh
├── frontend/
│   └── src/
│       └── App.jsx                            — Multi-stakeholder dashboard
├── README.md
├── TECHNICAL_ARCHITECTURE.md
└── DASHBOARD_SETUP_GUIDE.md
```

---

## Roadmap

### Phase 1 — PoC (current)
- [x] 4 smart contracts deployed and tested
- [x] 28+ passing tests including 6 integration scenarios
- [x] Multi-stakeholder dashboard (4 role views)
- [x] 6 live demo scripts
- [ ] Polygon mainnet deployment
- [ ] Dashboard connected to live contract reads

### Phase 2 — Pilot
- [ ] Wallet-based authentication (MetaMask / WalletConnect)
- [ ] Live contract reads replacing mock data
- [ ] IPFS integration for off-chain document storage
- [ ] Ministry officer onboarding flow

### Phase 3 — Production
- [ ] Permissioned chain deployment (Polygon Edge or Hyperledger Besu)
- [ ] ZK proof verification for NDIDS (Noir or Circom)
- [ ] Encrypted cross-ministry data payloads
- [ ] Mobile interface for field officers
- [ ] Integration with existing government systems

---

## Built With

- [Solidity 0.8.20](https://soliditylang.org/) — Smart contracts
- [Foundry](https://book.getfoundry.sh/) — Testing and deployment
- [Polygon](https://polygon.technology/) — EVM-compatible blockchain
- [React 18](https://react.dev/) — Dashboard frontend
- [Vite](https://vitejs.dev/) — Build tooling

---

## License

MIT — Open source for the Pacific and beyond.

---

*Samoa Pacific Blockchain Hub · Synergy Blockchain Pacific · 2026*
*Fa'afetai — built with respect for Samoa and all Pacific peoples*
