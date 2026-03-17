# Samoa Pacific Blockchain Hub

**Government interoperability infrastructure for Samoa — built by a small Pacific team, proving what is possible before asking for permission.**

Built by [Synergy Blockchain Pacific](https://github.com/Hamobcdev) · UNICEF Venture Fund 2026 Application

🌐 **Live Demo:** [hamobcdev.github.io/samoa-pacific-blockchain-hub](https://hamobcdev.github.io/samoa-pacific-blockchain-hub/)
📹 **Demo Video:** [youtu.be/fe1tNsUf40s](https://youtu.be/fe1tNsUf40s)

---

## 🚀 Testnet Deployment — Live on Polygon Amoy (March 2026)

All contracts are deployed, verified, and publicly readable on the Polygon Amoy public testnet. This is no longer a local proof of concept — it is live public blockchain infrastructure.

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

> All contracts are open source under MIT licence. Source code is verified and publicly readable on Polygonscan. The full deployment receipt is in `contracts/broadcast/Deploy.s.sol/80002/run-latest.json`.

---

## What This Is — For Non-Technical Readers

Imagine every Samoan government ministry — Finance, Education, Customs, the Central Bank, the Bureau of Statistics — currently operating as separate islands of data. A family applying for a school benefit must prove their identity to Education, then prove it again to Finance, then again to the bank processing the payment. A business importing goods touches Customs, Commerce, Finance, and the Central Bank — each ministry holding a separate file, none automatically aware of what the others have recorded.

This system connects those islands.

The **Samoa Pacific Blockchain Hub** is a shared digital infrastructure layer that allows Samoa's government ministries to record services, verify citizen identities, and process cross-ministry workflows — with every transaction permanently recorded on a tamper-proof ledger that no single ministry, no single official, and no outside party can alter or delete.

**Why blockchain specifically?**

A conventional shared database could connect ministries — but it requires a central authority that all ministries trust, creates a single point of failure, and leaves records vulnerable to editing by whoever controls the database. Blockchain removes that vulnerability. Once a transaction is recorded, it is permanent. Every ministry sees the same record. No one — not a minister, not a vendor, not a foreign government — can change what happened.

For a small nation like Samoa, where institutional trust is hard-won and public confidence in government systems matters enormously, that permanence is not a technical feature. It is a governance guarantee.

**The One Government Portal connection:**

Samoa's government has committed to a unified "One Government Portal" — a single digital access point for all citizen services. The Samoa Pacific Blockchain Hub is designed to be the trust infrastructure beneath that portal. The portal is the front door citizens walk through. This system is the foundation that ensures every transaction recorded through that door is permanent, auditable, and shared correctly across all relevant ministries — without any ministry having to trust that another ministry's data is accurate, because the blockchain guarantees it.

**The Maritime Single Window connection:**

Since 1 January 2024, all IMO Member States including Samoa are required under the FAL Convention to operate a Maritime Single Window — a unified digital platform for all vessel arrival, stay, and departure documentation. SBP's InteroperabilityHub architecture is directly aligned with the IMO FAL once-only data submission principle. SBP is in active discussion with MWTI and Samoa Ports Authority regarding MSW implementation.

---

## Who We Are

Synergy Blockchain Pacific was founded by Anthony George Williams — currently the only blockchain developer based in Samoa.

Anthony pivoted away from cryptocurrency speculation to the underlying technology in 2019, after recognising that blockchain infrastructure — not speculative trading — was where the real transformative potential lay for small island developing states. With no formal blockchain development programme available in Samoa, he taught himself to build blockchain applications from the ground up, driven by a clear conviction: this technology is better suited to small island developing states than almost anywhere else. Because of our size, we are actually better positioned to scale blockchain infrastructure across an entire economy than larger nations with legacy systems too embedded to replace.

Synergy Blockchain Pacific today is Anthony, co-founder Suetena, and Britney who is supporting education and marketing outreach. No external funding. No institutional backing. Building because the window to get this right — before global standards lock in and Samoa is left adapting to infrastructure designed elsewhere — is closing.

This is not a corporate submission. It is a genuine grassroots effort from the only person on the island who has spent years developing both the technical capability and the government relationships needed to make this real.

We are asking UNICEF not just to fund a product, but to fund the beginning of an industry in the Pacific — and the person who has already spent years building it without being asked to.

---

## The Honest State of This Project

This repository is a working proof of concept — now deployed to public testnet. Here is exactly what exists today.

**What is real and working:**
- 4 smart contracts written, deployed to Polygon Amoy public testnet, and verified on Polygonscan
- 29 passing automated tests — unit, integration, and fuzz tests
- Slither static analysis audit complete — 0 critical, 0 high findings, all medium/low fixes applied
- Security improvements in this version: ReentrancyGuard on InteroperabilityHub, CEI pattern on MinistryNode, indexed event parameters, gas-optimised batch registration
- A live multi-ministry dashboard reading directly from real contract state
- 7 ministry dashboards: CBS, MCIT, MOF, MCIL, Education, Customs, and the Samoa Bureau of Statistics (SBS)
- Cross-ministry workflows with automatic pending action detection — a completed step in one ministry triggers the next step in another
- A National Digital Identity System (NDIDS) with privacy-preserving citizen identity — zero personal information stored on the blockchain, only cryptographic hashes
- Auto-registration of citizens into NDIDS whenever a service is recorded — the identity and service records stay permanently in sync
- Duplicate submission detection — the system blocks re-submission of the same service for the same citizen
- Payment processing with bank receipt verification, fee routing to the correct ministry account, and an immutable audit trail per transaction
- An AID Disbursement Tracker with milestone-based tranche release — donor funds only release when field evidence is verified on chain
- A batch citizen registration tool for backfilling existing records into the identity registry
- Six integration test scenarios demonstrating complete real government workflows end-to-end
- A citizen-facing view and an officer-facing view of every service

**What is not yet real:**
- No actual Samoa government ministry is using this system yet — active engagement in progress with CBS, MCIT, MOF, MCIL, Customs, MWTI, and Samoa Ports Authority
- The citizens and records are demo data — not real government data
- We have not yet had formal government sign-off on a pilot — CBS Regulatory Sandbox application submitted

**Why we are submitting now:**
We are submitting because this is the level of work a two-person unfunded team can produce to demonstrate genuine capability and commitment. With UNICEF support, we can move from proof of concept to a real government pilot. Without it, we continue building as best we can with what we have.

---

## The Problem We Are Trying to Solve

Samoa has committed to national digital readiness by 2029. The ICT and blockchain infrastructure priorities outlined at the Pacific Digital Government Summit, and the UNCTAD Trade Facilitation framework earmarked for global adoption by 2029, both point to the same conclusion — permissioned blockchain networks for government and enterprise data sharing are coming whether Pacific nations are ready or not.

The barrier in Samoa is not willingness. It is understanding.

The OneCoin scam left deep scepticism about blockchain technology across the Pacific. Government officials who might otherwise engage with this technology have legitimate reasons to be cautious. There is almost no local expertise to distinguish legitimate blockchain infrastructure from fraudulent schemes. Our engagement with government to date — documented in the suite of letters and proposals submitted alongside this application — shows that the conversation is possible but slow, and that having a working demonstration changes the dynamic entirely.

This system is that demonstration. It is what we show when words are not enough.

---

## Why Children Are Central to This Work

UNICEF's focus on children is not peripheral to what we are building — it is the reason the aid disbursement tracker exists at all.

In Samoa, as across the Pacific, significant international aid directed at children passes through government systems with limited transparency and accountability. Funding intended for school enrolment subsidies, nutrition programmes, and early childhood services is often delayed, misallocated, or simply unverifiable at the point of delivery.

The AID Disbursement Tracker in this system addresses that directly:

- Donor commitments are recorded on chain at the point of grant creation
- Tranches release only when field-verified milestones are met
- Evidence hashes are stored permanently — not in a spreadsheet, not in a ministry filing cabinet
- Every dollar from commitment to delivery is auditable by anyone with the contract address

Children cannot advocate for the money meant for them. This system creates a permanent, tamper-proof record that someone can always check.

---

## Live Demo

Four stakeholder views — no login required:

| Role | What you see |
|---|---|
| **UNICEF Donor** | Grant lifecycle, milestone progress, tranche releases, full audit trail |
| **Ministry Officer** | Service recording, citizen verification, cross-ministry workflow status |
| **Citizen** | Your own service history, verified identity status, benefit eligibility |
| **Administrator** | Full system overview, all ministry nodes, workflow log, permission grants |

🌐 [hamobcdev.github.io/samoa-pacific-blockchain-hub](https://hamobcdev.github.io/samoa-pacific-blockchain-hub/)

---

## Standards Alignment

SBP's Version 2 architecture is being built in full alignment with the international standards that are converging as the global digital trade framework:

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

**Security improvements applied in this version:**
- `ReentrancyGuard` (`nonReentrant`) on `InteroperabilityHub.executeEnrollmentWorkflow()`
- Check-Effects-Interactions (CEI) pattern enforced on `MinistryNode.recordService()`
- `indexed` parameters added to all key events for efficient CBS monitoring queries
- Gas-optimised `batchRegister()` — single `SSTORE` write after loop, not per iteration
- `HubSet` event added to `MinistryNode.setHub()` for full audit trail
- Zero-address guards added to all setup functions
- Wrapped modifier pattern throughout — `_onlyAdmin()` internal function

---

## Running Locally

```bash
git clone https://github.com/Hamobcdev/samoa-pacific-blockchain-hub
cd samoa-pacific-blockchain-hub/contracts
forge install
forge build
forge test -vv
```

Expected output: `29 passed; 0 failed`

**Local demo with Anvil:**
```bash
anvil &
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast -vvvv
cd ../frontend && npm install && npm run dev
```

---

## Testnet Barrier — The Honest Funding Argument

The previous version of this README noted testnet deployment as blocked. **That barrier is now resolved.** All 9 contracts are live and verified on Polygon Amoy.

This section is retained to document the honest reality of building infrastructure without funding: what took a well-resourced team hours took us significantly longer — navigating RPC limits, gas configuration for a new network, dependency management on an isolated connection, and debugging deployment tooling without a support team. Every one of those barriers was a resource problem, not a technical one.

UNICEF funding does not just accelerate development. It removes the friction that makes every step harder than it needs to be for a team building in the Pacific without institutional support.

---

## Phase 2 — What We Are Building Next

Layer 2 contracts currently in architecture and design:

| Contract | Function | Standards |
|---|---|---|
| `TradeDocument.sol` | eBL, Certificate of Origin, SPS Certificate, Letter of Credit | DCSA eBL 3.0.2, UNCITRAL MLETR, ICC DSI |
| `BusinessRegistry.sol` | MCIL-anchored business identity, AML risk tier | WCO SAFE AEO, FATF |
| `SupplyChain.sol` | Product provenance, custody chain, IoT oracle hooks, anti-theft alerts | GS1, Codex Alimentarius, HACCP |
| `TradeFinance.sol` | Smart contract escrow, milestone L/C, INCOTERM-conditional release | DCSA eBL, UCP 600 |
| `WorkflowB2B.sol` | Purchase order, delivery confirmation, invoice settlement | UN/CEFACT |
| `ComplianceGuard.sol` | AML risk tier, Chainlink watchlist oracle, CTR/STR auto-reporting | FATF, MLPA 2007 |
| `IMaritimerSingleWindow.sol` | IMO FAL Convention MSW — vessel arrival/departure coordination | IMO FAL 2024 |

**IoT Integration:** LoRaWAN cold chain monitoring, GPS route verification, tamper-evident seals — feeding parametric insurance smart contracts via Chainlink oracle adapters.

---

## Roadmap

### Phase 1 — Proof of Concept ✅ Complete (self-funded)
- [x] 4 smart contracts written and tested — 29 passing tests
- [x] Slither static analysis audit — 0 critical, 0 high findings
- [x] Security hardening — ReentrancyGuard, CEI pattern, indexed events, gas optimisation
- [x] **Deployed and verified on Polygon Amoy public testnet — March 2026**
- [x] 7 ministry dashboards with live contract reads
- [x] Cross-ministry workflow engine with automatic pending action detection
- [x] National Digital Identity System — privacy-preserving, hash-only, GDPR-aligned
- [x] Auto-registration of citizens into NDIDS on every service record
- [x] Duplicate submission detection across service records
- [x] Payment routing with fee ownership enforcement per ministry
- [x] AID Disbursement Tracker with milestone-based tranche release
- [x] Samoa Bureau of Statistics (SBS) full identity dashboard
- [x] Citizen-facing and officer-facing views of every service
- [x] Contextual evidence note guidance for every service type
- [x] Batch citizen registration tool for backfilling into NDIDS
- [x] Downloadable blockchain-verified government certificates
- [x] Government engagement suite — letters, proposals, briefings submitted to CBS, MCIT, MOF, MCIL, Customs, MWTI, SPA, MESC, MOR

### Phase 2 — Trade & Supply Chain Layer (in active development)
- [ ] `MilestoneEscrow.sol` abstract base — shared library extraction
- [ ] `TradeDocument.sol` — DCSA eBL 3.0.2 full field implementation
- [ ] `BusinessRegistry.sol` — MCIL-anchored business identity
- [ ] `SupplyChain.sol` — GS1 provenance, IoT oracle hooks, anti-theft alerts
- [ ] `TradeFinance.sol` — escrow, milestone L/C, dispute resolution
- [ ] `WorkflowB2B.sol` — PO to invoice settlement pipeline
- [ ] `ComplianceGuard.sol` — AML/CFT, Chainlink watchlist oracle
- [ ] Maritime Single Window module — IMO FAL Convention compliance
- [ ] Formal engagement with at least one Samoa government ministry
- [ ] CBS Regulatory Sandbox MOU
- [ ] Wallet-based authentication for ministry officers
- [ ] IPFS integration for off-chain document storage with on-chain hash anchoring
- [ ] ZK proof layer for NDIDS privacy enhancement
- [ ] Government and youth education programme
- [ ] CBS stablecoin pilot consultation

### Phase 3 — Payment Rail (parallel track)
- [ ] Stellar testnet anchor — WST Digital Payment Instrument pilot
- [ ] SEP-0012 KYC/AML integration with NDIDS bridge
- [ ] SEP-0031 NZ/AU to Samoa remittance corridor
- [ ] Purpose-locked remittance product for diaspora (RemitSafe)
- [ ] CBS mainnet deployment — conditional on sandbox MOU signature

### Phase 4 — Privacy, Compliance & Security
- [ ] Full AML/CFT oracle — Chainlink external adapter, OFAC + UN sanctions
- [ ] IoT parametric insurance — cold chain, route deviation, tamper detection
- [ ] Selective disclosure ZK proof implementation
- [ ] Independent security audit — Code4rena or Sherlock competitive audit
- [ ] UUPS proxy + timelock pattern across all production contracts

### Phase 5 — Sovereign Geth Network
- [ ] Three-node Geth QBFT consensus on physical hardware in Apia
- [ ] Validator nodes: CBS + MCIT + neutral government data centre
- [ ] Migration from Amoy testnet to sovereign chain
- [ ] Island-mode operation testing — graceful degradation verification

### Phase 6 — Pacific Regional Consortium
- [ ] PacificChain white-label deployment — Fiji as first partner node
- [ ] ADB Pacific regional infrastructure funding application
- [ ] Multi-nation permissioned chain — each nation sovereign over own node
- [ ] Samoa national project → Pacific Digital Sovereignty Infrastructure

---

## Built With

- [Solidity 0.8.24](https://soliditylang.org/) — Smart contracts
- [Foundry](https://book.getfoundry.sh/) — Testing, auditing, and deployment framework
- [OpenZeppelin Contracts v5.1.0](https://openzeppelin.com/contracts/) — Security primitives (ReentrancyGuard)
- [Polygon Amoy](https://polygon.technology/) — Public testnet deployment
- [ethers.js v6](https://docs.ethers.org/v6/) — Live contract reads and transaction signing
- [React 18](https://react.dev/) — Multi-stakeholder dashboard frontend
- [Vite](https://vitejs.dev/) — Build tooling
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
│   ├── broadcast/                    # Deployment receipts
│   │   └── Deploy.s.sol/80002/       # Amoy testnet deployment record
│   └── lib/                          # Dependencies (forge-std, OpenZeppelin)
└── frontend/                         # React/Vite dashboard
```

---

## License

MIT — Open source for the Pacific and beyond.

See [LICENSE.txt](./LICENSE.txt) for full terms. Built and owned by Synergy Blockchain Pacific · Anthony George Williams · 2026.

---

## Parallel Applications and Submissions

This repository is the primary submission to the **UNICEF Venture Fund 2026** — focused on the children, aid accountability, and government service delivery dimensions of the system.

We are also preparing a parallel submission to **UNCTAD** focused on the trade facilitation, customs workflow, and interoperability framework components — directly aligned with the UNCTAD Trade Facilitation blockchain standard targeted for global adoption by 2029.

A separate **CBS Stablecoin Pilot** is in development — a WST-pegged digital currency architecture designed in consultation with the Central Bank of Samoa, intended as the payment rail that connects this interoperability system to real financial settlement.

These are not separate projects. They are three layers of the same Pacific blockchain infrastructure programme — identity and interoperability, trade facilitation, and digital currency — being built in parallel by the same small team with no external funding.

---

## Building National Technical Expertise — Youth, Blockchain, and the AI Era

One of the most significant barriers to Pacific digital adoption is not infrastructure — it is people. There are almost no locally trained blockchain developers in Samoa. When governments or enterprises eventually commission blockchain systems, they will have no choice but to import that expertise at significant cost, with no knowledge transfer, leaving the country dependent on outside capability indefinitely.

Synergy Blockchain Pacific's small office is designed from the ground up to be a training hub as much as a development studio. Every project we build is an opportunity to bring young Samoan developers into real blockchain development — not theoretical coursework, but hands-on work on live systems with genuine government context.

**Blockchain is becoming the trust infrastructure for the AI era.** As AI-generated content, AI-issued credentials, and AI-assisted government services become unavoidable, the question of how to verify what is real and who authorised it becomes critical. Verifiable credentials anchored on blockchain — tamper-proof, auditable, independently verifiable without a central authority — are already emerging as the global standard for managing this challenge.

A young Samoan developer trained in permissioned blockchain networks today is not just learning a current technology. They are learning the foundational infrastructure that will underpin digital identity, AI accountability, and cross-border data trust for the next two decades. Samoa has an opportunity to be a source of that expertise for the Pacific region rather than a consumer of it from elsewhere.

---

## What UNICEF Funding Would Enable

- Complete Phase 2 trade document and supply chain layer — six new standards-aligned contracts
- Maritime Single Window implementation for Samoa Ports Authority — IMO FAL Convention compliance
- Formal government pilot with at least one Samoa ministry
- CBS Regulatory Sandbox progression to MOU and WST stablecoin pilot
- IoT cold chain monitoring integration — parametric insurance for Pacific perishable imports
- Fund the education programme running alongside development — workshops, government briefings, public literacy
- Establish the first formal blockchain infrastructure deployment in Samoa's public sector
- Create replicable open-source documentation so other Pacific nations can adopt the same approach without starting from zero
- Grow the team to deliver education and development in parallel
- Demonstrate to Samoa's government that the 2029 commitments are achievable with local capability, not just imported solutions

---

*Samoa Pacific Blockchain Hub · Synergy Blockchain Pacific · 2026*

*This is the work of Anthony George Williams and a small Pacific team — building the infrastructure their region needs, with the resources they have, before the window closes. Every line of code was written without a salary, without a grant, and without certainty that anyone would notice. We believe they should. Fa'afetai lava.*
