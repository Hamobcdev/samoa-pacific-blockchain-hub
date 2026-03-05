# Technical Architecture

## Samoa Pacific Blockchain Hub

**Synergy Blockchain Pacific · UNICEF Venture Fund 2026**

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Smart Contract Architecture](#smart-contract-architecture)
3. [Privacy Architecture](#privacy-architecture)
4. [Production Authentication](#production-authentication)
5. [Live Contract Interaction](#live-contract-interaction)
6. [Dashboard and UI](#dashboard-and-ui)
7. [Ministry-to-Ministry Data Exchange](#ministry-to-ministry-data-exchange)
8. [AID Disbursement Flow](#aid-disbursement-flow)
9. [Workflow Execution on Anvil and Mainnet](#workflow-execution-on-anvil-and-mainnet)
10. [Production Deployment Roadmap](#production-deployment-roadmap)
11. [Security Model](#security-model)
12. [Phase 2 Privacy Upgrades](#phase-2-privacy-upgrades)

---

## System Overview

The Samoa Pacific Blockchain Hub is a permissioned data sharing and accountability system built on EVM-compatible blockchain infrastructure. It consists of four smart contracts, six ministry nodes, a multi-stakeholder dashboard, and a comprehensive test and demo suite.

The core insight is that government ministries in Samoa currently cannot share citizen data across department boundaries without either creating a centralised database (which is a privacy and security risk) or resorting to manual paper-based processes (which are slow, error-prone, and unauditable). Blockchain solves this by allowing each ministry to own its own data node while enabling explicit, auditable, revocable data sharing with other ministries — without any central authority controlling the data.

```
                    ┌─────────────────────────────────┐
                    │      InteroperabilityHub         │
                    │  Ministry registry + Hub wiring  │
                    └──────────────┬──────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
   ┌──────▼──────┐        ┌───────▼───────┐       ┌───────▼────────┐
   │ NDIDSRegistry│        │AIDDisbursement│       │  MinistryNode  │
   │ Citizen ID   │        │   Tracker     │       │  (×6 deployed) │
   │ hash storage │        │ Grant + audit │       │  Per-ministry  │
   └─────────────┘        └───────────────┘       └────────────────┘
```

---

## Smart Contract Architecture

### NDIDSRegistry.sol

Stores the national citizen identity registry. No personally identifiable information is stored. Each citizen is represented only by a `bytes32` hash derived from `keccak256(citizenId + off-chain-salt)`.

**Key functions:**
```solidity
// Register a citizen (NDIDS authority only)
function registerCitizen(bytes32 citizenHash) external onlyAdmin

// Grant a ministry read access for a specific citizen
function grantReadAccess(bytes32 citizenHash, address ministry) external onlyAdmin

// Revoke that access
function revokeReadAccess(bytes32 citizenHash, address ministry) external onlyAdmin

// Ministry calls this to verify a citizen — returns boolean only
function verifyCitizen(bytes32 citizenHash) external returns (bool)

// Check if a ministry has access (view — no state change)
function hasAccess(bytes32 citizenHash, address ministry) external view returns (bool)

// Public read — registration status
function isRegistered(bytes32 citizenHash) external view returns (bool)
function serviceCount(bytes32 citizenHash) external view returns (uint256)
function totalRegistered() external view returns (uint256)
```

**Events emitted:**
```solidity
event CitizenRegistered(bytes32 indexed citizenHash, uint256 timestamp)
event ReadAccessGranted(bytes32 indexed citizenHash, address indexed ministry)
event ReadAccessRevoked(bytes32 indexed citizenHash, address indexed ministry)
event IdentityVerified(bytes32 indexed citizenHash, address indexed verifier)
```

### MinistryNode.sol

One instance deployed per ministry. Each node is owned by its ministry admin address. Records service delivery events linked to citizen hashes.

**Key functions:**
```solidity
// Record a service delivery event
// verifyViaNDIDS=true calls NDIDS atomically before writing the record
function recordService(
    bytes32 citizenHash,
    string calldata serviceType,
    bytes32 dataHash,        // hash of off-chain document (IPFS CID)
    bool verifyViaNDIDS
) external onlyAdmin returns (uint256 recordId)

// Grant another ministry read access to this node's records
function authoriseReader(address reader) external onlyAdmin

// Revoke that read access
function revokeReader(address reader) external onlyAdmin

// Read a specific record — only callable by authorised readers
function getRecord(uint256 recordId) external view returns (ServiceRecord memory)

// Get all record IDs for a citizen
function getCitizenRecords(bytes32 citizenHash) external view returns (uint256[] memory)

// Public totals
function totalRecords() external view returns (uint256)
```

**ServiceRecord struct:**
```solidity
struct ServiceRecord {
    bytes32 citizenHash;    // hashed citizen ID — no PII
    string  serviceType;    // e.g. "SCHOOL_ENROLMENT_2025"
    bytes32 dataHash;       // keccak256 of off-chain document
    uint256 timestamp;
    bool    ndidsVerified;  // was identity verified via NDIDS?
}
```

### AIDisbursementTracker.sol

Manages the full lifecycle of aid grants from creation through milestone-based release and field verification.

**Key functions:**
```solidity
// Create a new grant
function createGrant(
    string calldata title,
    address donor,
    address recipient,
    uint256 totalAmount,
    uint256 targetBeneficiaries,
    string calldata sector,
    string[] calldata milestones,
    uint256[] calldata amounts
) external onlyAdmin returns (uint256 grantId)

// Release a tranche (milestone achieved)
function releaseTranche(uint256 grantId, uint256 trancheId) external onlyAdmin

// Field officer submits evidence of usage
function verifyUsage(
    uint256 grantId,
    uint256 trancheId,
    bytes32 evidenceHash,    // IPFS CID of field report
    uint256 beneficiariesServed
) external onlyVerifier

// Authorise a field verifier
function authoriseVerifier(address verifier) external onlyAdmin

// Read full audit trail for a grant
function getAuditTrail(uint256 grantId) external view returns (Tranche[] memory)

// Global totals
function totalGrants() external view returns (uint256)
function totalDisbursed() external view returns (uint256)
function totalVerified() external view returns (uint256)
```

**Grant lifecycle states:**
```
Active → (all tranches Released) → (all tranches Verified) → Completed
```

### InteroperabilityHub.sol

The registry that wires all contracts together. Stores the canonical list of ministry nodes and their metadata.

**Key functions:**
```solidity
function setNDIDS(address ndids) external onlyAdmin
function setAIDTracker(address aidTracker) external onlyAdmin
function registerMinistry(string calldata name, string calldata code, address node) external onlyAdmin
function getMinistry(string calldata code) external view returns (MinistryInfo memory)
function getAllMinistries() external view returns (MinistryInfo[] memory)
```

---

## Privacy Architecture

The system enforces privacy at five independent layers.

### Layer 1: Zero PII on chain

No names, dates of birth, addresses, or any identifying information is ever written to the blockchain. The only citizen-linked data stored is a 32-byte hash.

### Layer 2: Citizen-held salt model

```
hash = keccak256(citizenId + citizenSalt)
```

The `citizenSalt` is generated per citizen and stored off-chain — held by the citizen themselves (or by the NDIDS authority on behalf of the citizen in Phase 1, transitioning to true self-custody in Phase 2). Without the salt, the hash is computationally irreversible. Even the NDIDS contract deployer cannot link a hash to a real identity without the citizen's salt.

### Layer 3: Per-citizen, per-ministry access grants

Access is not granted at the ministry level (e.g. "MOF can read all citizens"). It is granted at the citizen level (e.g. "MOF can read citizen 0x6219... specifically"). This is enforced in the NDIDS contract:

```solidity
mapping(bytes32 => mapping(address => bool)) private accessGrants;
```

A ministry requesting verification for a citizen they have not been explicitly granted access to receives an `AccessDenied()` revert.

### Layer 4: Boolean verification only

When a ministry calls `verifyCitizen(bytes32)`, the contract returns only `bool`. No additional data about the citizen is emitted in logs or returned in the response. The ministry knows: this citizen exists and is registered. Nothing else.

### Layer 5: Revocable at any time

Every access grant can be revoked by the NDIDS admin. Revocation is instant and recorded on-chain with a timestamp, creating a permanent audit trail of the full access lifecycle.

---

## Production Authentication

### Current state (PoC demo)

The dashboard uses a role-selector landing page. Users click their role card and see that stakeholder's view. There is no cryptographic authentication — this is appropriate for a proof-of-concept where the goal is to demonstrate the system logic, not production security.

### Production state (Phase 2)

In production, the role-selector is replaced entirely by wallet-based authentication using MetaMask, WalletConnect, or a hardware wallet.

**How it works technically:**

```javascript
// Using wagmi (React wallet connection library)
import { useAccount } from 'wagmi'

function App() {
  const { address, isConnected } = useAccount()

  // Read which ministry node this wallet address administers
  const { data: ministryCode } = useContractRead({
    address: HUB_ADDRESS,
    abi: HUB_ABI,
    functionName: 'getMinistryByAdmin',
    args: [address],
  })

  // Route to correct dashboard automatically
  if (address === NDIDS_ADMIN)     return <NDIDSDashboard />
  if (address === AID_VERIFIER)    return <UNICEFDashboard />
  if (ministryCode)                return <MinistryDashboard ministry={ministryCode} />
  return <PublicDashboard />
}
```

**Why this is secure:**

The smart contracts already enforce all permissions at the transaction level. A wallet address without the correct permissions cannot call `getRecord()`, `recordService()`, or `verifyCitizen()` — the contract reverts with an access denied error regardless of what the frontend shows. The frontend authentication is for user experience (routing to the right view). The contract-level enforcement is the actual security guarantee.

**Ministry wallet setup in production:**

Each ministry would be issued a hardware wallet (Ledger or Trezor) by the NDIDS authority. The wallet address is registered in the relevant `MinistryNode` contract as the `admin`. The ministry officer plugs in their hardware wallet, connects to the dashboard, and the system detects their address and shows only their node's data.

**UNICEF / donor wallet setup:**

The AID tracker contract has a separate `authorisedVerifiers` mapping. UNICEF field officers are added to this mapping. When they connect with their wallet, the dashboard detects their verifier status and shows the grant accountability view with the ability to submit field evidence.

**Public view:**

No wallet connection required. The public transparency view reads only public contract state (ministry list, total counts, grant status) which requires no authentication.

---

## Live Contract Interaction

### Running on Anvil — what actually executes

When you run any of the demo scripts or Foundry tests, real EVM transactions are broadcast to the Anvil chain. State changes are permanent for the lifetime of that Anvil session.

```bash
# This actually deploys 9 contracts and seeds demo data
forge script script/Deploy.s.sol:DeploySamoaHub \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0... \
  --broadcast

# This actually executes a full ministry data sharing workflow
bash contracts/demo/run_demo.sh 1

# These actually call contract functions and record state
cast send $EDUCATION_NODE \
  "recordService(bytes32,string,bytes32,bool)" \
  $CITIZEN_HASH "SCHOOL_ENROLMENT" $DATA_HASH true \
  --private-key $EDU_KEY --rpc-url http://127.0.0.1:8545
```

### Running on Polygon Mainnet — identical execution

The exact same commands work on mainnet with three changes:

1. `--rpc-url https://polygon-rpc.com` instead of localhost
2. `--account deployer` instead of `--private-key` (uses encrypted keystore)
3. Real POL gas fees apply (approximately $3-8 total for full deployment)

Every scenario, every test, every workflow executes identically on mainnet. The contracts do not know or care whether they are running on Anvil, Amoy testnet, or Polygon mainnet.

### Reflecting changes in the dashboard

**Current state:** The dashboard uses mock data. It does not read from the chain.

**To connect the dashboard to live contract state**, we add `ethers.js` and replace mock data with contract reads:

```javascript
import { ethers } from 'ethers'
import AID_ABI from '../abis/AIDisbursementTracker.json'

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545')
const aidContract = new ethers.Contract(AID_ADDRESS, AID_ABI, provider)

// Read live grant data
const grant = await aidContract.getGrant(0)
const auditTrail = await aidContract.getAuditTrail(0)
const totalDisbursed = await aidContract.totalDisbursed()
```

Foundry automatically generates ABIs during compilation. They are located at:
```
contracts/out/AIDisbursementTracker.sol/AIDisbursementTracker.json
contracts/out/NDIDSRegistry.sol/NDIDSRegistry.json
contracts/out/MinistryNode.sol/MinistryNode.json
contracts/out/InteroperabilityHub.sol/InteroperabilityHub.json
```

Once wired, every action executed via cast scripts, Foundry tests, or MetaMask is immediately reflected in the dashboard on the next data refresh. The dashboard can be configured to poll every 2 seconds or use WebSocket subscriptions for real-time event updates.

---

## Ministry-to-Ministry Data Exchange

### How a cross-ministry read works end-to-end

**Scenario: MOF needs to read Education records to verify school enrolment before approving a benefit.**

Step 1 — Education records the enrolment:
```solidity
// Education admin calls their node
educationNode.recordService(
    citizenHash,
    "SCHOOL_ENROLMENT_2025",
    keccak256(enrolmentDocument),
    true  // verify via NDIDS atomically
)
// This call: 1) checks NDIDS, 2) writes the record, 3) emits ServiceDelivered event
```

Step 2 — Education grants MOF read access:
```solidity
educationNode.authoriseReader(address(mofNode))
// This call: 1) adds mofNode to authorisedReaders, 2) emits ReaderAuthorised event
```

Step 3 — MOF reads the Education record:
```solidity
// MOF calls from their address (or their node contract calls it)
ServiceRecord memory rec = educationNode.getRecord(0)
// The contract checks: msg.sender must be in authorisedReaders
// If not: reverts with ReadAccessDenied()
// If yes: returns the full ServiceRecord
```

Step 4 — MOF records the benefit decision:
```solidity
mofNode.recordService(
    citizenHash,
    "EDUCATION_BENEFIT_APPROVED_2025",
    keccak256(benefitDecisionDocument),
    true  // re-verify identity via NDIDS
)
```

**What this looks like in the dashboard (once wired to live data):**

The Education Officer sees their record count increment. The MOF Officer sees the Education record appear in their Cross-Ministry tab. The Public Audit view shows both service delivery events in the live activity feed. The NDIDS Admin view shows the service count for that citizen increment from 1 to 2.

### Permission directional model

Permissions are directional and explicit:

```
Education --[grants]--> MOF    means MOF can read Education records
Education does NOT automatically get MOF read access
MOF must explicitly grant Education access to its own records if required
```

This mirrors how real inter-agency data sharing agreements work. Each agency controls its own data.

---

## AID Disbursement Flow

The complete flow from grant creation to verified delivery:

```
UNICEF creates grant (admin)
         │
         ▼
Grant created on AIDisbursementTracker
3 tranches: Pending / Pending / Pending
         │
         ▼
Milestone 1 achieved → admin releases Tranche 1
Tranche 1 status: Pending → Released
         │
         ▼
UNICEF field officer submits field report IPFS hash
verifyUsage(grantId, 0, evidenceHash, beneficiariesCount)
Tranche 1 status: Released → Verified
         │
         ▼
Process repeats for Tranches 2 and 3
         │
         ▼
All 3 tranches verified → Grant auto-completes
Grant status: Active → Completed
totalVerified() === totalDisbursed() === grant.totalAmount
```

**What cannot happen:**

- A tranche cannot be verified before it is released
- A tranche cannot be released out of order
- Only an `authorisedVerifier` address can call `verifyUsage()`
- The evidence hash is stored permanently on-chain
- The beneficiary count is stored permanently on-chain
- No one can alter any of these records after the fact

---

## Workflow Execution on Anvil and Mainnet

### Are the cast scripts and Foundry tests identical on mainnet?

Yes. The contracts, tests, and cast scripts are chain-agnostic. The only differences are:

| Item | Anvil | Polygon Mainnet |
|---|---|---|
| RPC URL | `http://127.0.0.1:8545` | `https://polygon-rpc.com` |
| Private key | Hardcoded public test key | Encrypted keystore |
| Gas cost | Zero (test ETH) | ~$3-8 USD (real POL) |
| Transaction speed | Instant | ~2 seconds per block |
| State persistence | Lost on restart | Permanent |
| Polygonscan | Not applicable | Publicly visible |

### Do workflow changes reflect in the dashboard?

**Current:** No. The dashboard uses mock data.

**After ethers.js integration:** Yes. Every on-chain state change — whether triggered by a cast script, a Foundry test, a demo script, or a MetaMask transaction — is reflected in the dashboard. The data source is the contract, not the UI.

This means you can:
- Run `bash contracts/demo/run_demo.sh 3` in a terminal
- Watch the AID grant lifecycle execute in real time
- Switch to the browser and refresh the UNICEF Donor dashboard
- See the updated grant status, tranche states, and audit trail reflecting the actual on-chain state

### Recommended demo flow using live chain

```bash
# 1. Start chain
anvil

# 2. Deploy
forge script script/Deploy.s.sol:DeploySamoaHub \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast

# 3. Start dashboard
cd frontend && npm run dev

# 4. Run Scenario 2 — full citizen journey (terminal visible on screen)
bash contracts/demo/run_demo.sh 2

# 5. Switch to browser — show NDIDS Admin view (service count incremented)
# 6. Show Ministry Officer — Education records the enrolment
# 7. Show Ministry Officer — MOF sees the cross-ministry record
# 8. Run Scenario 3 — AID lifecycle (visible in UNICEF Donor dashboard)
```

---

## Production Deployment Roadmap

### Phase 1 — PoC (current)

Architecture proven. All contracts deployed. Test suite passing. Multi-stakeholder dashboard. Demo scripts. UNICEF application submitted.

### Phase 2 — Pilot (months 3-9)

**Wallet authentication:**
- Integrate `wagmi` and `viem` into frontend
- Each ministry issued a hardware wallet (Ledger Nano X)
- Wallet address registered as ministry node admin
- Dashboard auto-detects connected wallet and routes to correct view

**Live data reads:**
- Foundry ABI outputs copied to `frontend/src/abis/`
- `ethers.js` contract reads replace all mock data
- WebSocket event subscriptions for real-time updates
- Loading states and error handling throughout

**IPFS integration:**
- Off-chain documents (field reports, enrolment records) stored on IPFS
- IPFS CID (content identifier) stored as the `dataHash` in service records
- Anyone can verify document integrity: `keccak256(document) === storedHash`
- Documents remain private — only those with the IPFS CID can retrieve them

**Ministry officer mobile app:**
- React Native application for field officers
- Camera → photograph document → auto-hash → submit to contract
- Works offline and syncs when connected

### Phase 3 — Production (months 10-24)

**Permissioned chain:**
Migrate from public Polygon to a permissioned chain (Polygon Edge supernet or Hyperledger Besu). Transaction data is not publicly visible. Only authorised nodes can participate in consensus. Retains full EVM compatibility — all existing contracts deploy without modification.

**ZK proof integration:**
Replace the boolean NDIDS verification with zero-knowledge proofs. Instead of a ministry querying whether a citizen is registered, they prove a statement about the citizen ("this person is over 18" or "this person has a valid school enrolment") without the NDIDS contract revealing which citizen triggered the proof.

Implementation path: Circom or Noir for circuit development, SnarkJS for proof generation, on-chain Groth16 or PLONK verifier contract.

**Encrypted cross-ministry data:**
Ministry service records encrypted with the recipient ministry's public key. Only the intended reader can decrypt the payload. The on-chain record proves the data exists and who can read it — the data itself is never exposed to unintended parties.

**Government system integration:**
REST API adapters connecting existing government databases to the ministry node contracts. The blockchain layer provides the audit trail and permission enforcement. Existing systems continue to function as the primary data store.

---

## Security Model

### What the blockchain guarantees

- **Immutability:** Records cannot be altered after creation
- **Transparency:** All events are publicly auditable (on public chain)
- **Permission enforcement:** Access control is cryptographic — it cannot be bypassed by UI manipulation
- **Non-repudiation:** Every transaction is signed by the originating wallet — the signing party cannot deny the action

### What the blockchain does NOT guarantee in Phase 1

- **Data confidentiality at rest:** On a public chain, all contract storage is readable by anyone with the contract address and ABI. The privacy in Phase 1 comes from hashing PII, not encrypting it.
- **Identity of the wallet holder:** The contracts enforce that the correct wallet address is used. They cannot verify that the person using the wallet is who they claim to be. Hardware wallets and organisational key management policies address this in production.

### Attack surface analysis

**Can a stranger read ministry records?**
No. `getRecord()` requires `msg.sender` to be in `authorisedReaders`. Any external call reverts with `ReadAccessDenied()`.

**Can a ministry officer impersonate another ministry?**
No. Each ministry node's `admin` mapping is set at deployment. Only the registered admin address can call `recordService()` and `authoriseReader()`. An officer from CBS cannot call MOF functions.

**Can the NDIDS admin expose citizen identity?**
In Phase 1, the NDIDS admin holds the off-chain salt mapping. This is a trust assumption — the NDIDS authority is Samoa's government digital identity bureau (equivalent to SBS). In Phase 2, citizens hold their own salts.

**Can the contract deployer upgrade contracts to change rules?**
The current contracts are not upgradeable proxies. The deployer cannot change contract logic after deployment. Adding upgradeability would require explicit proxy pattern implementation and is a Phase 2 governance decision.

---

## Phase 2 Privacy Upgrades

### ZK Proof Verification for NDIDS

Instead of storing `isRegistered[citizenHash] = true` and returning a boolean, the production system uses a ZK proof scheme:

1. Citizen generates a proof off-chain: "I know a preimage of this hash that is registered in NDIDS"
2. Ministry submits the proof to the NDIDS verifier contract
3. Contract verifies the proof using the on-chain Groth16 verifier
4. No hash, no citizen identifier, no linkable information appears in the transaction

This eliminates the linkability problem — repeated verifications of the same citizen cannot be correlated because each proof is unique.

### Encrypted Ministry Records

```
Ministry records service → generates symmetric key
Encrypts dataHash + serviceType with MOF's public key
Stores encrypted payload on IPFS
Stores IPFS CID and encrypted symmetric key on chain
MOF decrypts with their private key → reads payload
CBS cannot read MOF-destined records even with contract access
```

### Oasis Sapphire Consideration

Oasis Sapphire is a confidential EVM paratime. Smart contract state is encrypted at the TEE (Trusted Execution Environment) level. External callers cannot read contract storage. This is the most practical path to full data confidentiality without ZK proof implementation overhead. All existing Solidity contracts deploy without modification.

---

*TECHNICAL_ARCHITECTURE.md · Samoa Pacific Blockchain Hub · Synergy Blockchain Pacific · 2026*
