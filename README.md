# Samoa Pacific Blockchain Hub

**Government interoperability infrastructure for Samoa — built by a small Pacific team, proving what is possible before asking for permission.**

Built by [Synergy Blockchain Pacific](https://github.com/Hamobcdev) · UNICEF Venture Fund 2026 Application

🌐 **Live Demo:** [hamobcdev.github.io/samoa-pacific-blockchain-hub](https://hamobcdev.github.io/samoa-pacific-blockchain-hub/)
📹 **Demo Video:** [youtu.be/fe1tNsUf40s](https://youtu.be/fe1tNsUf40s)

---

## 🚀 Testnet Deployment — Live on Polygon Amoy (March 2026)

All contracts are deployed, verified, and publicly readable on the Polygon Amoy public testnet.

| Contract | Address | Explorer |
|---|---|---|
| **NDIDSRegistry** | `0x0E832d0C324Cd70ca58Dd1B0965151167853cE42` | [Polygonscan ↗](https://amoy.polygonscan.com/address/0x0e832d0c324cd70ca58dd1b0965151167853ce42) |
| **AIDisbursementTracker** | `0x3fD12fe1400BD9B8cd7ebE59C47EA27ab6bF5EdB` | [Polygonscan ↗](https://amoy.polygonscan.com/address/0x3fd12fe1400bd9b8cd7ebe59c47ea27ab6bf5edb) |
| **InteroperabilityHub** | `0x6c213b53b41c325317dF0443442b0eae9c7618Cc` | [Polygonscan ↗](https://amoy.polygonscan.com/address/0x6c213b53b41c325317df0443442b0eae9c7618cc) |
| **MinistryNode — CBS** | `0xeC404FB5564da6f6c77DD7C8A694B1A3fFCe99c1` | [Polygonscan ↗](https://amoy.polygonscan.com/address/0xec404fb5564da6f6c77dd7c8a694b1a3ffce99c1) |
| **MinistryNode — MCIT** | `0x4F117fdC9BB2b781d52731E5674f669Bfe1E6402` | [Polygonscan ↗](https://amoy.polygonscan.com/address/0x4f117fdc9bb2b781d52731e5674f669bfe1e6402) |
| **MinistryNode — MOF** | `0x8c26B5E477d6feFf2a75C0Fbd7f3667c4dB07FC4` | [Polygonscan ↗](https://amoy.polygonscan.com/address/0x8c26b5e477d6feff2a75c0fbd7f3667c4db07fc4) |
| **MinistryNode — MCIL** | `0xe9b67Df4a062C20167D963DD74fc436c1B83EceD` | [Polygonscan ↗](https://amoy.polygonscan.com/address/0xe9b67df4a062c20167d963dd74fc436c1b83eced) |
| **MinistryNode — Education** | `0xa3Cb3B9A6DF26cd550A6D8A49EF693c78750F27d` | [Polygonscan ↗](https://amoy.polygonscan.com/address/0xa3cb3b9a6df26cd550a6d8a49ef693c78750f27d) |
| **MinistryNode — Customs** | `0x6462197ff41c7EbA925e0F9EB980e61454e40366` | [Polygonscan ↗](https://amoy.polygonscan.com/address/0x6462197ff41c7eba925e0f9eb980e61454e40366) |

**Network:** Polygon Amoy (Chain ID: 80002) · **Deployer:** `0x2C80200932C8733b09B70F9962d6302D9E6dB2C5`
**Compiler:** Solidity 0.8.24 · **Audit:** Slither static analysis — 0 critical, 0 high findings · **Tests:** 29/29 passing

> All contracts are open source under MIT licence. Source code is verified and publicly readable on Polygonscan. Full deployment receipt: `contracts/broadcast/Deploy.s.sol/80002/run-latest.json`

---

## What This Is — For Non-Technical Readers

Imagine every Samoan government ministry — Finance, Education, Customs, the Central Bank, the Bureau of Statistics — currently operating as separate islands of data. A family applying for a school benefit must prove their identity to Education, then prove it again to Finance, then again to the bank processing the payment. A business importing goods touches Customs, Commerce, Finance, and the Central Bank — each ministry holding a separate file, none automatically aware of what the others have recorded.

This system connects those islands.

The **Samoa Pacific Blockchain Hub** is a shared digital infrastructure layer that allows Samoa's government ministries to record services, verify citizen identities, and process cross-ministry workflows — with every transaction permanently recorded on a tamper-proof ledger that no single ministry, no single official, and no outside party can alter or delete.

**Why blockchain specifically?**

A conventional shared database could connect ministries — but it requires a central authority that all ministries trust, creates a single point of failure, and leaves records vulnerable to editing by whoever controls the database. Blockchain removes that vulnerability. Once a transaction is recorded, it is permanent. Every ministry sees the same record. No one — not a minister, not a vendor, not a foreign government — can change what happened.

For a small nation like Samoa, where institutional trust is hard-won and public confidence in government systems matters enormously, that permanence is not a technical feature. It is a governance guarantee.

**The One Government Portal connection:**
Samoa's government has committed to a unified "One Government Portal." The Samoa Pacific Blockchain Hub is designed to be the trust infrastructure beneath that portal — ensuring every transaction recorded through it is permanent, auditable, and shared correctly across all ministries without any ministry having to trust another's data.

**The Maritime Single Window connection:**
Since 1 January 2024, all IMO Member States including Samoa are required under the FAL Convention to operate a Maritime Single Window. SBP's InteroperabilityHub architecture directly implements the IMO FAL once-only data submission principle. SBP is in active discussion with MWTI and Samoa Ports Authority regarding MSW implementation.

---

## Who We Are

Synergy Blockchain Pacific was founded by Anthony George Williams — currently the only blockchain developer based in Samoa. Anthony pivoted from cryptocurrency speculation to infrastructure development in 2019, self-teaching Solidity and full-stack blockchain development with a clear conviction: this technology is better suited to small island developing states than almost anywhere else. Because of our scale, we are better positioned to implement blockchain infrastructure comprehensively across an entire economy than larger nations with legacy systems too embedded to change.

Synergy Blockchain Pacific today is Anthony, co-founder Suetena Faatuala Loia (former ACEO, Ministry of Communications and IT), and Britney Taamu-Miyashiro supporting education and marketing. No external funding. No institutional backing. Building because the window to get this right — before global standards lock in and Samoa is left adapting to infrastructure designed elsewhere — is closing.

We are asking UNICEF not just to fund a product, but to fund the beginning of an industry in the Pacific — and the person who has already spent years building it without being asked to.

---

## The Honest State of This Project

This repository is a working proof of concept deployed to public testnet. Here is exactly what exists today.

**What is real and working:**
- 4 smart contracts deployed to Polygon Amoy public testnet and verified on Polygonscan
- 29 passing automated tests — unit, integration, and fuzz tests
- Slither static analysis audit complete — 0 critical, 0 high findings, all fixes applied
- Security hardening: ReentrancyGuard on InteroperabilityHub, CEI pattern on MinistryNode, indexed events, gas-optimised batch registration
- Live multi-ministry dashboard reading directly from public testnet contract state
- 7 ministry dashboards: CBS, MCIT, MOF, MCIL, Education, Customs, and SBS
- Cross-ministry workflows with automatic pending action detection
- National Digital Identity System (NDIDS) — privacy-preserving, hash-only, zero PII on-chain
- Auto-registration of citizens into NDIDS on every service record
- Duplicate submission detection across service records
- Payment processing with bank receipt verification, fee routing, and immutable audit trail
- AID Disbursement Tracker with milestone-based tranche release
- Six integration test scenarios demonstrating complete government workflows end-to-end

**What is not yet real:**
- No actual Samoa government ministry is using this system yet — active engagement with CBS, MCIT, MOF, MCIL, Customs, MWTI, and Samoa Ports Authority
- Citizens and records are demo data — not real government data
- Formal government pilot not yet signed — CBS Regulatory Sandbox application submitted

**Why we are submitting now:**
This is the level of work a two-person unfunded team can produce to demonstrate genuine capability and commitment. With UNICEF support we move from proof of concept to a real government pilot. Without it, we continue building as best we can.

---

## The Problem We Are Trying to Solve

Samoa has committed to national digital readiness by 2029. The ICT and blockchain infrastructure priorities from the Pacific Digital Government Summit, and the UNCTAD Trade Facilitation framework earmarked for global adoption by 2029, both point to the same conclusion — permissioned blockchain networks for government and enterprise data sharing are coming whether Pacific nations are ready or not.

The barrier in Samoa is not willingness. It is understanding. The OneCoin scam left deep scepticism about blockchain technology across the Pacific. Government officials have legitimate reasons to be cautious, and there is almost no local expertise to distinguish legitimate infrastructure from fraudulent schemes. Having a working demonstration changes the dynamic entirely.

This system is that demonstration. It is what we show when words are not enough.

---

## Why Children Are Central to This Work

UNICEF's focus on children is not peripheral to what we are building — it is the reason the AID Disbursement Tracker exists at all.

In Samoa, significant international aid directed at children passes through government systems with limited transparency. Funding for school enrolment subsidies, nutrition programmes, and early childhood services is often delayed, misallocated, or simply unverifiable at delivery.

The AID Disbursement Tracker addresses this directly:
- Donor commitments recorded on-chain at point of grant creation
- Tranches release only when field-verified milestones are met
- Evidence hashes stored permanently — not in a spreadsheet or a filing cabinet
- Every dollar from commitment to delivery is auditable by anyone with the contract address

Children cannot advocate for the money meant for them. This system creates a permanent, tamper-proof record that someone can always check.

---

## Live Demo — Testing the System

🌐 **[hamobcdev.github.io/samoa-pacific-blockchain-hub](https://hamobcdev.github.io/samoa-pacific-blockchain-hub/)**

The dashboard reads directly from the Polygon Amoy testnet. All 25 seeded citizens, the UNICEF grant, and all ministry records are live on-chain — no installation required.

**Four stakeholder views — no login required:**

| Role | What you see |
|---|---|
| **UNICEF Donor** | Grant lifecycle, milestone progress, tranche releases, full audit trail |
| **Ministry Officer** | Service recording, citizen verification, cross-ministry workflow status |
| **Citizen** | Service history, verified identity status, benefit eligibility |
| **Administrator** | System overview, all ministry nodes, workflow log, permission grants |

### Read-only — No setup needed

All dashboards, contract state, grant data, citizen records, and workflow history are fully readable without a wallet. This covers the complete reviewer experience for the UNICEF application.

### Submitting transactions (optional — for technical reviewers)

Write operations (recording a service, verifying a tranche) require a wallet with free Amoy test tokens:

1. Install [MetaMask](https://metamask.io/) browser extension
2. Add Polygon Amoy network manually:
   - Network name: `Polygon Amoy`
   - RPC URL: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`
   - Currency symbol: `POL`
3. Get free test POL: [faucet.polygon.technology](https://faucet.polygon.technology/) — select Amoy, paste your MetaMask address
4. Open the live demo — MetaMask will prompt for connection when you submit a transaction

**Pre-seeded citizen IDs for testing workflows:**

| Sector | Citizen IDs |
|---|---|
| Education (UNICEF beneficiaries) | `SAMOA-EDU-001` through `SAMOA-EDU-007` |
| Banking / CBS | `SAMOA-CBS-001` through `SAMOA-CBS-003` |
| Customs / Trade | `SAMOA-TRADE-001` through `SAMOA-TRADE-003` |
| Welfare / MOF | `SAMOA-WELFARE-001` through `SAMOA-WELFARE-005` |
| Business / MCIL | `SAMOA-BIZ-001` through `SAMOA-BIZ-003` |

**Suggested 5-minute reviewer walkthrough:**
1. Open the live demo — confirm network banner shows Polygon Amoy Testnet
2. Open UNICEF Donor Dashboard — see Grant #0, 100,000 WST total, 70,000 WST released
3. Open Education ministry — see pending cross-ministry actions for `SAMOA-EDU-001`
4. Open Interoperability Hub — see all 6 registered ministry nodes
5. Verify any contract independently at [amoy.polygonscan.com](https://amoy.polygonscan.com)

---

## Standards Alignment

SBP's Phase 2 architecture is being built in alignment with the international standards converging as the global digital trade framework:

| Standard | What It Governs | SBP Implementation |
|---|---|---|
| **DCSA eBL 3.0.2** | Electronic Bill of Lading — 190+ fields, digital title transfer | `TradeDocument.sol` — Phase 2 |
| **UNCITRAL MLETR** | Legal equivalence of electronic transferable records | Legislative advocacy via MCIL/MFAT |
| **WCO SAFE 2025** | Customs security, AEO trusted trader programme | `SupplyChain.sol` + Customs node |
| **UN/CEFACT** | Multimodal transport data models and message formats | `TradeDocument.sol` struct fields |
| **GS1** | Global supply chain identifiers (GTIN, GLN, SSCC) | `SupplyChain.sol` — Phase 2 |
| **IMO FAL Convention** | Maritime Single Window — mandatory since Jan 2024 | `InteroperabilityHub` MSW extension |
| **FATF / MLPA 2007** | AML/CFT compliance, risk tier classification | `ComplianceGuard.sol` — Phase 2 |
| **ISO TC 307** | Blockchain terminology, security, interoperability | Slither audit framework reference |

---

## Security Audit

Slither static analysis completed across all four contracts. **Zero critical findings. Zero high findings.**

| Severity | Count | Status |
|---|---|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 4 | ✅ All fixed |
| Low | 18 | ✅ All fixed |

**Security improvements applied:**
- `ReentrancyGuard` on `InteroperabilityHub.executeEnrollmentWorkflow()`
- Check-Effects-Interactions pattern enforced on `MinistryNode.recordService()`
- `indexed` parameters on all key events for efficient querying
- Gas-optimised `batchRegister()` — single `SSTORE` write after loop
- `HubSet` event added to `MinistryNode.setHub()` for full audit trail
- Zero-address guards on all setup functions

---

## Running the Test Suite

```bash
git clone https://github.com/Hamobcdev/samoa-pacific-blockchain-hub
cd samoa-pacific-blockchain-hub/contracts
forge install
forge build
forge test -vv
```

Expected output: `29 passed; 0 failed`

---

## Running Locally with Anvil

For a fully interactive local demo with write transactions — no wallet or test tokens required:

```bash
# Terminal 1 — start local blockchain
anvil

# Terminal 2 — deploy contracts and seed demo data
cd contracts
forge script script/Deploy.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast -vvvv

# Terminal 3 — start frontend
cd ../frontend && npm install && npm run dev
```

Open `http://localhost:5173` — the dashboard connects to Anvil automatically. All write transactions work without MetaMask. Use Anvil account #0 as the signing key (already configured). Anvil must remain running for the local demo to work.

---

## Phase 2 — What We Are Building Next

Layer 2 contracts currently in architecture and design:

| Contract | Function | Standards |
|---|---|---|
| `TradeDocument.sol` | eBL, Certificate of Origin, SPS Certificate, Letter of Credit | DCSA eBL 3.0.2, UNCITRAL MLETR, ICC DSI |
| `BusinessRegistry.sol` | MCIL-anchored business identity, AML risk tier | WCO SAFE AEO, FATF |
| `SupplyChain.sol` | Product provenance, custody chain, IoT oracle hooks | GS1, Codex Alimentarius, HACCP |
| `TradeFinance.sol` | Smart contract escrow, milestone L/C, dispute resolution | DCSA eBL, UCP 600 |
| `WorkflowB2B.sol` | Purchase order to invoice settlement pipeline | UN/CEFACT |
| `ComplianceGuard.sol` | AML risk tier, Chainlink watchlist oracle, CTR/STR reporting | FATF, MLPA 2007 |
| `IMaritimerSingleWindow.sol` | IMO FAL Convention MSW — vessel arrival/departure coordination | IMO FAL 2024 |

**AI Integration (Phase 2):** EventSchema.sol shared library defines AI-ready event types consumed directly by XGBoost AML risk models and LightGBM logistics forecasters — blockchain as the sovereign AI training data foundation.

**IoT Integration:** LoRaWAN cold chain monitoring, GPS route verification, tamper-evident seals — feeding parametric insurance contracts via Chainlink oracle adapters.

---

## Roadmap

### Phase 1 — Proof of Concept ✅ Complete (self-funded)
- [x] 4 smart contracts written and tested — 29 passing tests
- [x] Slither static analysis audit — 0 critical, 0 high findings
- [x] Security hardening — ReentrancyGuard, CEI pattern, indexed events, gas optimisation
- [x] **Deployed and verified on Polygon Amoy public testnet — March 2026**
- [x] 7 ministry dashboards with live contract reads
- [x] Cross-ministry workflow engine with automatic pending action detection
- [x] National Digital Identity System — privacy-preserving, hash-only
- [x] AID Disbursement Tracker with milestone-based tranche release
- [x] Government engagement suite — CBS, MCIT, MOF, MCIL, Customs, MWTI, SPA, MEC, MOR

### Phase 2 — Trade, Supply Chain & AI Layer (in active development)
- [ ] `EventSchema.sol` shared library — AI-ready event types for all Phase 2 contracts
- [ ] `TradeDocument.sol` — DCSA eBL 3.0.2 full field implementation
- [ ] `BusinessRegistry.sol` — MCIL-anchored business identity
- [ ] `SupplyChain.sol` — GS1 provenance, IoT oracle hooks
- [ ] `TradeFinance.sol` — escrow, milestone L/C, dispute resolution
- [ ] `WorkflowB2B.sol` — PO to invoice settlement pipeline
- [ ] `ComplianceGuard.sol` — AML/CFT, Chainlink oracle, AI risk scoring
- [ ] Maritime Single Window module — IMO FAL Convention compliance
- [ ] CBS Regulatory Sandbox MOU
- [ ] Wallet-based authentication for ministry officers
- [ ] IPFS integration for off-chain document storage with on-chain hash anchoring
- [ ] ZK proof layer for NDIDS privacy enhancement

### Phase 3 — Payment Rail
- [ ] Stellar testnet anchor — WST Digital Payment Instrument pilot
- [ ] SEP-0031 NZ/AU/US to Samoa remittance corridor
- [ ] Purpose-locked remittance product for diaspora (RemitSafe)
- [ ] CBS mainnet deployment — conditional on sandbox MOU signature

### Phase 4 — Privacy, Compliance & Security
- [ ] Full AML/CFT oracle — Chainlink, OFAC + UN sanctions watchlist
- [ ] IoT parametric insurance — cold chain, route deviation, tamper detection
- [ ] AI model v1 live — XGBoost AML risk scorer on sovereign chain event stream
- [ ] Independent security audit — Code4rena or Sherlock competitive audit

### Phase 5 — Sovereign Geth/Besu Network
- [ ] Four-node QBFT consensus on physical hardware in Apia
- [ ] Validator nodes: CBS + MCIT + MOF + government data centre
- [ ] Migration from Amoy testnet to sovereign chain
- [ ] Island-mode operation — graceful degradation during connectivity loss

### Phase 6 — Pacific Regional Consortium
- [ ] PacificChain white-label deployment — Fiji as first partner node
- [ ] Multi-nation permissioned chain — each nation sovereign over its own node
- [ ] ADB Pacific regional infrastructure funding application

---

## Built With

- [Solidity 0.8.24](https://soliditylang.org/) — Smart contracts
- [Foundry](https://book.getfoundry.sh/) — Testing, auditing, and deployment
- [OpenZeppelin Contracts v5.1.0](https://openzeppelin.com/contracts/) — Security primitives
- [Polygon Amoy](https://polygon.technology/) — Public testnet deployment
- [ethers.js v6](https://docs.ethers.org/v6/) — Contract reads and transaction signing
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) — Frontend dashboard
- [Slither](https://github.com/crytic/slither) — Static analysis security audit

---

## Repository Structure

```
samoa-pacific-blockchain-hub/
├── contracts/
│   ├── src/                          # Smart contracts
│   │   ├── NDIDSRegistry.sol         # National Digital ID System
│   │   ├── AIDisbursementTracker.sol # UNICEF grant milestone tracker
│   │   ├── InteroperabilityHub.sol   # Cross-ministry coordination
│   │   └── MinistryNode.sol          # Individual ministry logic
│   ├── test/                         # 29 automated tests
│   ├── script/                       # Deployment scripts
│   ├── broadcast/
│   │   └── Deploy.s.sol/80002/       # Amoy testnet deployment record
│   └── lib/                          # Dependencies
└── frontend/                         # React/Vite dashboard
```

---

## Parallel Applications and Submissions

This repository is the primary submission to the **UNICEF Venture Fund 2026** — focused on children, aid accountability, and government service delivery.

A parallel submission to **UNCTAD** covers the trade facilitation, customs workflow, and interoperability framework components — aligned with the UNCTAD 2029 global standard.

A separate **CBS Stablecoin Pilot** is in development — a WST-pegged digital currency in consultation with the Central Bank of Samoa, intended as the payment rail connecting this interoperability system to real financial settlement.

These are three layers of the same Pacific blockchain infrastructure programme — identity and interoperability, trade facilitation, and digital currency — built in parallel by the same small team with no external funding.

---

## Building National Technical Expertise — Youth, Blockchain, and the AI Era

There are almost no locally trained blockchain developers in Samoa. When governments eventually commission blockchain systems, they will have no choice but to import that expertise at significant cost, with no knowledge transfer, leaving the country dependent on outside capability indefinitely.

SBP is designed from the ground up to be a training hub as much as a development studio. Every project is an opportunity to bring young Samoan developers into real blockchain development — not theoretical coursework, but hands-on work on live systems with genuine government context.

**Blockchain is becoming the trust infrastructure for the AI era.** As AI-generated content and AI-assisted government services become unavoidable, the question of how to verify what is real and who authorised it becomes critical. Verifiable credentials anchored on blockchain — tamper-proof, auditable, independently verifiable — are the global standard for managing this challenge. A young Samoan developer trained in permissioned blockchain networks today is learning the foundational infrastructure that will underpin digital identity and AI accountability for the next two decades.

---

## What UNICEF Funding Would Enable

- Complete Phase 2 trade document and supply chain layer — seven new standards-aligned contracts
- Maritime Single Window implementation — IMO FAL Convention compliance for Samoa Ports Authority
- Formal government pilot with at least one Samoa ministry
- CBS Regulatory Sandbox progression to MOU and WST stablecoin pilot
- IoT cold chain monitoring integration — parametric insurance for Pacific perishable imports
- Education programme — workshops, government briefings, blockchain literacy
- First formal blockchain infrastructure deployment in Samoa's public sector
- Replicable open-source documentation for other Pacific nations
- Demonstrate to Samoa's government that the 2029 commitments are achievable with local capability

---

## License

MIT — Open source for the Pacific and beyond.

See [LICENSE.txt](./LICENSE.txt) for full terms. Built and owned by Synergy Blockchain Pacific · Anthony George Williams · 2026.

---

*Samoa Pacific Blockchain Hub · Synergy Blockchain Pacific · 2026*

*This is the work of Anthony George Williams and a small Pacific team — building the infrastructure their region needs, with the resources they have, before the window closes. Every line of code was written without a salary, without a grant, and without certainty that anyone would notice. We believe they should. Fa'afetai lava.*
