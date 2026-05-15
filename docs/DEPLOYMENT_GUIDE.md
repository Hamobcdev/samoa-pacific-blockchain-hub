# Samoa DPI — Deployment Guide
# Branch: feat/currency-architecture · NUS/ISOC Research Submission 2026

---

## Local Development

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20 LTS | https://nodejs.org |
| pnpm | 9+ | `npm i -g pnpm` |
| Foundry | latest | https://getfoundry.sh |

### Setup

```bash
git clone https://github.com/hamobcdev/samoa-pacific-blockchain-hub
cd samoa-pacific-blockchain-hub
pnpm install
```

### Start all portals (separate terminals)

```bash
pnpm --filter @samoa-dpi/landing dev    # http://localhost:5180
pnpm --filter @samoa-dpi/citizens dev   # http://localhost:5181
pnpm --filter @samoa-dpi/admin dev      # http://localhost:5182
pnpm --filter @samoa-dpi/dbs dev        # http://localhost:5183
pnpm --filter @samoa-dpi/donor dev      # http://localhost:5184
pnpm --filter @samoa-dpi/verify dev     # http://localhost:5185
```

```bash
cd api && node src/index.js             # http://localhost:3001
```

### Build verification

```bash
pnpm --filter @samoa-dpi/landing build
pnpm --filter @samoa-dpi/citizens build
pnpm --filter @samoa-dpi/admin build
pnpm --filter @samoa-dpi/dbs build
pnpm --filter @samoa-dpi/donor build
pnpm --filter @samoa-dpi/verify build
```

All builds must exit 0 with no TypeScript or lint errors before deployment.

---

## Vercel Deployment

Each portal is a separate Vercel project deployed from the monorepo root.

### Project setup table

| Vercel Project | Root Directory | Build Command | Output |
|---|---|---|---|
| samoa-dpi-landing | `.` | `pnpm --filter @samoa-dpi/landing build` | `apps/landing/dist` |
| samoa-dpi-citizens | `.` | `pnpm --filter @samoa-dpi/citizens build` | `apps/citizens/dist` |
| samoa-dpi-admin | `.` | `pnpm --filter @samoa-dpi/admin build` | `apps/admin/dist` |
| samoa-dpi-dbs | `.` | `pnpm --filter @samoa-dpi/dbs build` | `apps/dbs/dist` |
| samoa-dpi-donor | `.` | `pnpm --filter @samoa-dpi/donor build` | `apps/donor/dist` |
| samoa-dpi-verify | `.` | `pnpm --filter @samoa-dpi/verify build` | `apps/verify/dist` |

Each app's `vercel.json` sets `installCommand: "pnpm install"` and `framework: null`.

### Environment variables (Vercel dashboard → Settings → Environment Variables)

**All portals:**
None required for Phase 1 — all feature flags default to `false`.

**Admin portal (`samoa-dpi-admin`):**
Set the following in Vercel dashboard for Phase 2 activation:

| Variable | Phase 1 | Phase 2 |
|---|---|---|
| `VITE_FLAG_MULTISIG_ACTIVE` | `false` | `true` after CBS keyholder confirmation |
| `VITE_FLAG_CIRCUIT_BREAKER` | `false` | `true` after pause authority assigned |
| `VITE_FLAG_MULTISIG` | `false` | `true` after Gnosis Safe deployed |
| `VITE_FLAG_CONSENT` | `false` | `true` after consent legal framework confirmed |
| `VITE_FLAG_TIMELOCK` | `false` | `true` after timelock window decided |
| `VITE_FLAG_VALIDATOR_GOV` | `false` | `true` after validator assignment confirmed |
| `VITE_FLAG_FATF` | `false` | `true` after SAR reporting chain defined |
| `VITE_USE_LIVE_DATA` | `false` | `true` to enable live RPC reads |

**API (`samoa-dpi-api`):**

| Variable | Value |
|---|---|
| `RPC_ENDPOINT_URL` | Polygon Amoy RPC or sovereign chain RPC |
| `ALLOWED_ORIGINS` | Comma-separated Vercel deployment URLs |
| `SUPABASE_URL` | Phase 2 — audit log persistence |
| `SUPABASE_SERVICE_KEY` | Phase 2 — audit log persistence |

Never set real keys in local `.env` files committed to the repository.

---

## Smart Contract Verification

Contracts are deployed on Polygon Amoy testnet (chain ID 80002).

```bash
cd contracts
forge test -vv                          # all 29 tests must pass
```

| Contract | Address |
|---|---|
| NDIDSRegistry | `0x0E832d0C324Cd70ca58Dd1B0965151167853cE42` |
| InteroperabilityHub | `0x6c213b53b41c325317dF0443442b0eae9c7618Cc` |
| AIDisbursementTracker | `0x3fD12fe1400BD9B8cd7ebE59C47EA27ab6bF5EdB` |

Independent verification: search addresses on https://amoy.polygonscan.com

---

## Phase 2 — Sovereign Chain Migration

When CBS confirms validator node assignment (item `SOV-1` in CBS governance panel):

1. Set `VITE_FLAG_SOVEREIGN_CHAIN=true` in admin portal env
2. Update `RPC_ENDPOINT_URL` in api/.env to sovereign chain RPC
3. Re-run `forge script script/Deploy.s.sol` against sovereign chain
4. Update contract addresses in `packages/contracts-abi/src/addresses.ts`
5. Rebuild and redeploy all portals

The sovereign chain uses Geth Clique PoA. Genesis block configuration is ready at `contracts/genesis/`. Validator slot count and rotation policy pending CBS decision `SOV-1`.

---

## CBS Governance — Phase 2 Activation Checklist

All 6 governance items in `apps/admin/src/data/cbs-governance.js` must be confirmed before any Phase 2 flag is set. The admin portal CBS Governance panel tracks status. Do not set any Phase 2 feature flag until the corresponding CBS governance item is marked `resolved: true`.

Do not add, remove, or reorder governance items without explicit CBS instruction.

---

*Samoa DPI · NUS/ISOC Research Programme 2026 · feat/currency-architecture*
