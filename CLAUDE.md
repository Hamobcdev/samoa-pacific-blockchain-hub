# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Samoa Pacific Blockchain Hub is a government interoperability proof-of-concept for Samoa, submitted to the UNICEF Venture Fund 2026. It connects government ministries via a permissioned blockchain layer, enabling privacy-preserving citizen verification and cross-ministry data sharing. Deployed to Polygon Amoy testnet; live demo at hamobcdev.github.io/samoa-pacific-blockchain-hub/.

---

## Commands

### Smart Contracts (Foundry)

All contract commands run from `contracts/`:

```bash
cd contracts
forge install          # install dependencies (forge-std, OpenZeppelin)
forge build            # compile contracts
forge test -vv         # run all 29 tests with verbose output
forge test --match-test <TestName> -vv   # run a single test
forge test --match-contract SamoaIntegrationScenarios -vv  # run one test file
forge fmt              # format Solidity code
forge snapshot         # update gas snapshots
```

**Local Anvil demo:**
```bash
anvil &                # start local node on port 8545
forge script script/Deploy.s.sol --rpc-url localhost --broadcast
```

**Testnet deployment (Polygon Amoy):**
```bash
# requires contracts/.env with PRIVATE_KEY, AMOY_RPC_URL, POLYGONSCAN_API_KEY
forge script script/Deploy.s.sol --rpc-url amoy --broadcast --verify
```

**Demo scenarios (uses `cast` CLI against a running Anvil or testnet):**
```bash
cd contracts/demo
bash run_demo.sh       # interactive menu for scenarios 1–6
```

### Frontend

All frontend commands run from `frontend/`:

```bash
cd frontend
npm install            # install dependencies
npm run dev            # start Vite dev server
npm run build          # production build to frontend/dist/
npm run preview        # preview production build locally
npm run deploy         # build + deploy to GitHub Pages
```

---

## Architecture

### Smart Contracts (`contracts/src/`)

Four contracts form the full system:

| Contract | Role |
|---|---|
| `NDIDSRegistry.sol` | National Digital ID — stores keccak256(citizenID + salt) hashes only, zero PII on-chain |
| `MinistryNode.sol` | Per-ministry service record storage; each ministry gets one deployed instance |
| `AIDisbursementTracker.sol` | Grant lifecycle — milestone-based tranche release, field verification by UNICEF |
| `InteroperabilityHub.sol` | Central registry — registers all Ministry nodes, coordinates cross-ministry workflows |

**Privacy model:** Citizens hold their own salt. On-chain only stores hashes. Boolean verification (`isRegistered`) is the only public data. Ministry records are access-controlled; cross-ministry reads require explicit grant.

**Deployment pattern:** `script/Deploy.s.sol` deploys all 4 core contracts + 6 named Ministry nodes (CBS, MCIT, MOF, MCIL, Education, Customs), seeds 25 demo citizens, and creates cross-ministry permission grants in a single script. Step scripts (`Step1_`, `Step2_`, `Step3_`) allow staged deployment if needed.

**Dependencies:** OpenZeppelin v5.1.0 (ReentrancyGuard) via Foundry submodule at `contracts/lib/`.

### Frontend (`frontend/src/`)

Single-page React 18 + Vite 5 app. All UI lives in one monolithic `frontend/src/App.jsx` (~2700 lines). There is no component decomposition or routing library — views are toggled by role-selector state.

**Role-based views baked into App.jsx:**
- UNICEF Donor Dashboard (grants, tranches, impact metrics)
- 7 Ministry Officer dashboards (CBS, MCIT, MOF, MCIL, Education, Customs, SBS)
- Citizen verification view
- Administrator / Interoperability Hub view

**Data mode:** The app supports both live testnet reads (ethers.js against Polygon Amoy) and mock/Anvil data. Contract addresses are hardcoded in App.jsx; switching networks means updating those constants.

**Base path:** Vite is configured with `base: '/samoa-pacific-blockchain-hub/'` for GitHub Pages.

### CI/CD

`.github/workflows/deploy.yml` builds the Vite app and deploys `frontend/dist/` to GitHub Pages on every push to `main`. Node 20 with `npm ci` cache.

### Utility Scripts

- `register_citizens.js` (root) — batch-registers hashed citizen IDs into NDIDSRegistry via ethers.js
- `contracts/demo/*.sh` — bash + `cast` scenario scripts for demos; each scenario maps to a test in `SamoaIntegrationScenarios.t.sol`

---

## Environment Setup

Copy and fill `contracts/.env.example` → `contracts/.env`:

```
ADMIN_ADDRESS=...
PRIVATE_KEY=...
AMOY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/<key>
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/<key>
POLYGONSCAN_API_KEY=...
```

`.env` is gitignored. Never commit real keys.

---

## Key Constraints

- **Solidity 0.8.24**, `via_ir = true`, optimizer 200 runs — required for the deployment to match the audited bytecode.
- **No PII on-chain** — any change that stores plaintext citizen data violates the core privacy model.
- **Ministry nodes are separate contract instances** — `MinistryNode.sol` is deployed once per ministry; the Hub tracks them all. Do not add ministry-specific logic to the Hub.
- **Live testnet addresses** are in `contracts/broadcast/Deploy.s.sol/80002/run-latest.json` and hardcoded in `frontend/src/App.jsx`. Both must be updated together after a redeployment.
