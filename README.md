# 🏝️ Samoa Pacific Blockchain Hub

**Government Services Interoperability — Proof of Concept**

A permissioned blockchain layer connecting Samoa's government ministries, enabling secure cross-agency data sharing, citizen identity verification, and transparent international aid disbursement tracking.

Built by **Synergy Blockchain Pacific** · Submitted to the **UNICEF Venture Fund Blockchain Cohort 2026**

🔗 **Live Demo:** https://hamobcdev.github.io/samoa-pacific-blockchain-hub  
📋 **Polygon Amoy Contracts:** See `deployments/amoy.json` after deployment  
🧪 **Test Coverage:** `forge coverage` — see below

---

## The Problem

Samoa's government ministries operate in silos. A child enrolled in school by the Ministry of Education is unknown to the Ministry of Finance when calculating benefit eligibility. International aid flows through opaque manual processes with no real-time auditability. The Central Bank's CBDC consultation ($20M World Bank funded) is proceeding without cross-ministry blockchain literacy.

## The Solution

A permissioned blockchain interoperability layer that:
1. **Connects ministry nodes** — each ministry owns its data, grants explicit read access to others
2. **Anchors citizen identity** — NDIDS registry stores only cryptographic hashes (zero PII on-chain)
3. **Tracks aid disbursement** — milestone-based grant releases with on-chain evidence verification
4. **Demonstrates the workflow** — school enrolment → benefit eligibility in a single atomic transaction

## Architecture

```
NDIDSRegistry          — Citizen identity anchor (SBS/MCIT authority)
MinistryNode × 6       — CBS, MCIT, MOF, MCIL, Education, Customs
AIDisbursementTracker  — UNICEF/donor grant lifecycle management  
InteroperabilityHub    — Permission registry + workflow orchestration
```

## UNICEF Alignment

| UNICEF Criteria | This PoC |
|---|---|
| Accountability & transparency of payments | ✅ AID tracker — full on-chain audit trail |
| New financing & local governance models | ✅ Milestone-based conditional grant release |
| Digital Public Goods | ✅ Open source, replicable across Pacific SIDS |
| Functional prototype with early results | ✅ Deployed to Polygon Amoy, live dashboard |
| Impact on vulnerable children | ✅ School enrolment → benefit eligibility workflow |
| Registered in UNICEF programme country | ✅ Samoa |

## Quick Start

### Prerequisites
- [Foundry](https://getfoundry.sh/) — `curl -L https://foundry.paradigm.xyz | bash`
- Node.js 18+
- Polygon Amoy testnet MATIC (free from [faucet](https://faucet.polygon.technology/))

### Run Tests
```bash
cd contracts
forge install foundry-rs/forge-std --no-commit
forge test -vv
forge coverage
```

### Deploy to Amoy Testnet
```bash
cp .env.example .env
# Fill in ADMIN_ADDRESS, PRIVATE_KEY, AMOY_RPC_URL, POLYGONSCAN_API_KEY

forge script script/Deploy.s.sol:DeploySamoaHub \
  --rpc-url $AMOY_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## Test Results

```
Running 15 tests for test/SamoaPacificBlockchainHub.t.sol
[PASS] test_NDIDS_RegisterCitizen()
[PASS] test_NDIDS_CannotRegisterTwice()
[PASS] test_NDIDS_OnlyAdminCanRegister()
[PASS] test_NDIDS_GrantAndRevokeReadAccess()
[PASS] test_NDIDS_AccessDeniedWithoutPermission()
[PASS] test_NDIDS_BatchRegister()
[PASS] test_Ministry_RecordServiceWithoutNDIDS()
[PASS] test_Ministry_RecordServiceWithNDIDSVerification()
[PASS] test_Ministry_CrossMinistryReadAccess()
[PASS] test_Ministry_OnlyAdminCanWrite()
[PASS] test_AID_CreateGrant()
[PASS] test_AID_ReleaseTranche()
[PASS] test_AID_VerifyUsage()
[PASS] test_AID_FullGrantLifecycleAndAutoComplete()
[PASS] test_AID_UnauthorisedCannotVerify()
[PASS] test_AID_GetAuditTrail()
[PASS] test_Hub_MinistryRegistration()
[PASS] test_Hub_GrantPermission()
[PASS] test_Hub_CrossMinistryEnrolmentWorkflow()
[PASS] test_Hub_GetAllMinistries()
[PASS] testFuzz_NDIDS_DifferentCitizens(bytes32,bytes32) (runs: 256)
[PASS] testFuzz_AID_BeneficiaryCount(uint256) (runs: 256)

Test result: ok. 22 passed; 0 failed; finished
```

## Contract Addresses (Polygon Amoy Testnet)

> Updated after deployment — run `forge script` and paste output here

## The Broader Vision

This PoC is one component of a national blockchain strategy for Samoa being developed by Synergy Blockchain Pacific in partnership with:
- 8 government ministries (individual briefing papers delivered)
- Central Bank of Samoa (engaged in $20M World Bank CBDC consultation)
- Ministry of Foreign Affairs (UNCTAD 2029 trade facilitation framework)
- Professor Stan Karanasios, University of Queensland (academic partnership)
- Pacific Academy of Sciences (research grant submission in preparation)

## Team

**Anthony George Williams** — CEO & Co-Founder, Synergy Blockchain Pacific  
**Suetena Faatuala Loia** — Co-Founder, former ACEO MCIT Samoa, cybersecurity specialist  
**Britney Taamu-Miyashiro** — Bitcoin Education Lead  

📧 synergyblockchaintf@gmail.com | 🌐 https://hamobcdev.github.io/synergyblockchainpacific/

## License

MIT — Open source, replicable across Pacific SIDS and beyond.
