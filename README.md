# Samoa Pacific Blockchain Hub

**Government interoperability infrastructure for Samoa — built by a small Pacific team, proving what is possible before asking for permission.**

Built by [Synergy Blockchain Pacific](https://github.com/Hamobcdev) · UNICEF Venture Fund 2026 Application

🌐 **Live Demo:** [hamobcdev.github.io/samoa-pacific-blockchain-hub](https://youtu.be/fe1tNsUf40s)

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

---

## Who We Are

Synergy Blockchain Pacific was founded by Anthony George Williams — currently the only blockchain developer based in Samoa.

Anthony pivoted away from cryptocurrency speculation to the underlying technology in 2019, after recognising that blockchain infrastructure — not speculative trading — was where the real transformative potential lay for small island developing states. With no formal blockchain development programme available in Samoa, he taught himself to build blockchain applications from the ground up, driven by a clear conviction: this technology is better suited to small island developing states than almost anywhere else. Because of our size, we are actually better positioned to scale blockchain infrastructure across an entire economy than larger nations with legacy systems too embedded to replace.

Synergy Blockchain Pacific today is Anthony, co-founder Suetena, and Britney who is supporting education and marketing outreach. No external funding. No institutional backing. Building because the window to get this right — before global standards lock in and Samoa is left adapting to infrastructure designed elsewhere — is closing.

This is not a corporate submission. It is a genuine grassroots effort from the only person on the island who has spent years developing both the technical capability and the government relationships needed to make this real.

We are asking UNICEF not just to fund a product, but to fund the beginning of an industry in the Pacific — and the person who has already spent years building it without being asked to.

---

## The Honest State of This Project

This repository is a working proof of concept — not a live production system. Here is exactly what exists today.

**What is real and working:**
- 4 smart contracts written, deployed, and tested — 28+ passing tests
- A live multi-ministry dashboard reading directly from real contract state on a local blockchain
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
- Not yet deployed to a public testnet or mainnet — see the section below on why
- No actual Samoa government ministry is using this system yet
- The citizens and records are demo data — not real government data
- We have not yet had formal government sign-off on a pilot

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
| 💰 UNICEF Donor | Live grant state, tranche tracker, field evidence hashes, full audit trail |
| 🏛 Ministry Officer | Record service delivery, cross-ministry pending actions, payment inbox, certificate generation |
| 🪪 NDIDS / SBS Admin | Citizen identity registry, bulk registration tool, live on-chain verification, privacy architecture |
| 🌍 Public / Auditor | Ministry network, live workflow events, contract addresses, interoperability permissions |

The dashboard reads directly from smart contracts. Every transaction appears within 3 seconds. This is demonstrable live, not a recorded video.

---

## System Architecture — What Each Component Does

### 7 Ministry Nodes

Each ministry has a dedicated blockchain node — a smart contract that only that ministry controls. Officers record service events to their own ministry's node. No ministry can write to another ministry's records.

| Ministry | Code | Key Services |
|---|---|---|
| Central Bank of Samoa | CBS | Account opening, remittance, loans, stablecoin issuance, payment processing |
| Ministry of Finance | MOF | Business licensing, tax compliance, duty confirmation, welfare and education benefit disbursement |
| Ministry of Commerce, Industry & Labour | MCIL | Company registration, trade licences, foreign investment approval, labour contracts |
| Ministry of Communications & IT | MCIT | Spectrum licences, ICT registration, cybersecurity audit records |
| Ministry of Education, Sports & Culture | EDUCATION | School enrolment, attendance records, graduation, scholarships, special needs support |
| Ministry of Customs & Revenue | CUSTOMS | Shipment clearance, trade facilitation, tariff classification, bond warehouse records |
| Samoa Bureau of Statistics | SBS | National Digital ID, birth certificates, passport registration, driver's licence digital records, elections ID, identity hash updates |

### National Digital Identity System (NDIDS)

The NDIDS is how ministries know they are all looking at the same person — without any ministry holding a copy of that person's personal information.

When a citizen is registered, their National ID (e.g. WS-123456) is converted into a cryptographic hash using a mathematical function called `keccak256`. The result is a string of letters and numbers that uniquely identifies that person — but cannot be reversed to reveal the original ID. Only the hash is stored on the blockchain.

When a ministry records a service for that citizen, they submit the same hash. The blockchain confirms: this hash is registered. Service recorded. No names, dates of birth, addresses, or identity documents ever touch the chain.

This architecture is aligned with Samoa's data sovereignty obligations and compatible with emerging global privacy frameworks including GDPR and the Pacific Data Governance Framework.

**Auto-sync:** From v18 onwards, every time a ministry officer records a service for a citizen, the system automatically registers that citizen's hash in the NDIDS if they are not already there. The identity registry and service records stay permanently in sync without any manual action.

### Cross-Ministry Workflow Engine

Many government services require multiple ministries acting in sequence. The workflow engine tracks these automatically.

**Example — School Benefit:**
1. **Education** records a school enrolment → triggers a pending action for MOF
2. **MOF** approves the education benefit → triggers a pending action for CBS
3. **CBS** processes the payment → triggers a pending action for Education
4. **Education** confirms benefit received → workflow complete

At every step, each ministry only sees the action relevant to them. The system detects when a prerequisite step is complete and surfaces the next required action automatically in the relevant ministry's dashboard.

**Current workflows:**

| Workflow | Ministries Involved |
|---|---|
| School Benefit & UNICEF Grant | Education → MOF → CBS → Education |
| Customs Trade Clearance | Customs → MCIL → MOF → CBS → Customs |
| Social Welfare Disbursement | MOF → CBS → MOF |
| Business Licence | MCIL → MOF |
| Foreign Investment Approval | MCIL → MOF → MCIT → MCIL |
| UNICEF Tranche Release | Education → MOF |
| SBS Identity Registration | SBS → CBS (optional bank link) |

### Payment Routing

Every service that carries a government fee is routed to the correct ministry's bank account automatically. The system enforces a single rule: the ministry that provides the service receives the payment. This is immutable — it is configured in the smart contract, not in a spreadsheet that someone can edit.

Ministry fee accounts are held at BSP, ANZ Samoa, SCB Apia, and CBS — reflecting the real banking relationships of Samoa's government ministries.

### AID Disbursement Tracker

Tracks international aid from commitment to delivery. The current demo models a WST 100,000 UNICEF programme for education access with three milestone-based tranches. Tranche release requires field evidence to be submitted and verified on chain — funds cannot be released by administrative instruction alone.

### Certificate and Receipt Generation

Every completed service transaction generates a downloadable, print-ready government certificate with the blockchain transaction hash, evidence hash, credential hash, and payment reference. These certificates are independently verifiable — anyone with the transaction hash can confirm the record exists on chain.

---

## Technical Architecture

### Smart Contracts

```
InteroperabilityHub
├── NDIDSRegistry          — Privacy-preserving citizen identity (hash-only)
├── AIDisbursementTracker  — Milestone-based aid accountability
└── Ministry Nodes (×7)
    ├── Central Bank of Samoa (CBS)
    ├── Ministry of Finance (MOF)
    ├── Ministry of Commerce, Industry & Labour (MCIL)
    ├── Ministry of Communications & IT (MCIT)
    ├── Ministry of Education, Sports & Culture (EDUCATION)
    ├── Ministry of Customs & Revenue (CUSTOMS)
    └── Samoa Bureau of Statistics (SBS) — post-funding dedicated contract
```

**Key design principles:**
- Zero PII on chain — only `keccak256` hashes of citizen identifiers
- Each ministry owns its node — data sovereignty enforced at contract level
- Cross-ministry reads require explicit on-chain permission grants
- Auto-registration — `registerCitizen()` called automatically on every service record
- Duplicate detection — same citizen + same service type blocked at submission
- Atomic workflows — multi-step processes cannot partially complete
- Aid disbursement tied to verified evidence hashes, not manual approval
- `staticNetwork: true` on the provider — prevents ENS resolution on local chain

### Frontend Stack

- React 18 with ethers.js v6 — reads live state from contracts every 3 seconds
- No backend server — the blockchain is the backend
- Citizen-facing and officer-facing views of every service form
- Contextual evidence note guidance for every service type — officers always know what to enter
- Full certificate and receipt generation with downloadable PDF output
- Privacy-first: citizen IDs are hashed in the browser before any network call — the plain ID never leaves the officer's machine

### Privacy Architecture

```
Officer enters: WS-123456
        ↓
Browser computes: keccak256("WS-123456")
        ↓
Sends to chain:   0x8f4a2b...c7d1  (hash only)
        ↓
NDIDSRegistry:    isRegistered(hash) → true/false
        ↓
Ministry node:    recordService(hash, serviceType, evidenceHash, ndidsVerified)
```

Personal information never leaves the browser. The blockchain never sees it.

---

## Deployed Contracts

### Anvil Local (current development environment)

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
| SBS Node | `deploying — dedicated SBSRegistry contract post-funding` |

### Public Testnet / Mainnet

| Contract | Address |
|---|---|
| All contracts | *deploying as part of this application — see testnet barrier section below* |

---

## The Testnet Barrier — A Real Example of Why Funding Matters

We attempted to deploy this system to Polygon Amoy testnet. We hit two hard walls that a funded team would not face.

**The deployment script exceeds free-tier infrastructure limits.** The full deployment — 9 contracts, citizens registered, ministry nodes wired, cross-ministry permissions set, a UNICEF grant with tranches seeded — is a single Foundry script that exceeds the gas limits on free RPC endpoints. We attempted deployment through Alchemy's free tier. Transactions dropped mid-sequence. The contracts that did land were orphaned — wired to addresses that didn't exist because later transactions failed.

**Free RPC tier rate limits block the full test suite.** The dashboard's 3-second polling and the full integration test suite both exceed Alchemy's free tier request limits. Running all 28+ tests against a live testnet endpoint hits those limits within the first few scenarios.

This is not a technical failure. The same deployment script runs perfectly on Anvil local chain — every contract, every citizen, every permission, every test. The barrier is purely financial: a paid RPC endpoint ($50–200/month) and a small MATIC allocation for testnet gas would resolve both issues immediately.

We are not deploying to mainnet. Spending real cryptocurrency on a proof-of-concept system not yet serving real users would be financially irresponsible. The right path is: funded RPC endpoint → complete testnet deployment with public transaction hashes on Polygonscan → pilot with one Samoa government ministry → production mainnet deployment when real data is moving.

We are asking UNICEF and technical reviewers to run this system locally. Everything verifiable on a testnet block explorer is verifiable locally. The only thing missing is a public URL — and that is a funding problem, not a capability problem.

---

## Security Practices — Key Management

### Local development vs. real deployments

This repository contains references to Anvil's **well-known public demo key** (`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`). This is not a secret. It is printed in plaintext by every `anvil` instance, documented in every Foundry tutorial, and holds no value on any real network. Any Foundry developer will recognise it on sight.

It appears in this repository for one reason only: it makes local contract addresses **deterministic** — the same every time you deploy to a fresh Anvil instance, so the test guide and frontend configuration always match without manual updates.

### What we actually do for testnet and production

For all non-local deployments, Synergy Blockchain Pacific uses **Foundry's encrypted keystore workflow**:

```bash
# Import a private key into an encrypted, password-protected keystore
cast wallet import deployer --interactive
# Enter private key when prompted — never stored in plaintext

# Deploy using the keystore (prompts for password at runtime)
forge script script/Deploy.s.sol:DeploySamoaHub \
  --rpc-url https://rpc-endpoint \
  --account deployer \
  --broadcast -vvvv
```

During our attempted Polygon Amoy testnet deployment (blocked by RPC rate limits and gas constraints on the free tier — see the Testnet Barrier section), all signing was done via the encrypted keystore. The raw `--private-key` flag was not used for any non-local transaction.

### Production officer authentication

In the MVP, all ministry dashboards share the Anvil deployer key for simplicity. **This is an explicit proof-of-concept shortcut.** Production deployments will use:

- One hardware wallet (Ledger Nano X) per ministry officer
- Wallet-based authentication via MetaMask / WalletConnect in the frontend
- Every transaction permanently signed by the individual officer's credential
- Ministry administrator multi-sig for contract governance

This architecture is costed in the Technical Costing document and is a confirmed Phase 2 deliverable.

---

## Running Locally

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js 18+

### Quick start — frontend only (demo data)

```bash
git clone https://github.com/Hamobcdev/samoa-pacific-blockchain-hub.git
cd samoa-pacific-blockchain-hub/frontend
npm install
npm run dev
# Open http://localhost:5173
```

### Full live system — all contracts on local chain

> **🔐 Security note — Anvil demo key (local development only)**
>
> The key below (`0xac0974...`) is **Anvil's well-known public Account #0** — it is printed in plaintext by every `anvil` instance, appears in every Foundry tutorial, and holds no value on any real network. It is used here solely for deterministic local deployment so contract addresses are always the same.
>
> **For testnet and production deployments, Synergy Blockchain Pacific uses Foundry's encrypted keystore (`cast wallet import`) — never a raw private key in any command, environment variable, or file.** During our attempted Polygon Amoy testnet deployment, all transactions were signed via the encrypted keystore workflow. The `--private-key` flag below is a local-only convenience for demo reproducibility and is explicitly not our practice for any non-local environment.
>
> See [Foundry keystore docs](https://book.getfoundry.sh/reference/cast/cast-wallet-import) for the production signing workflow we use.

```bash
# Terminal 1 — start local blockchain
anvil

# Terminal 2 — deploy all contracts
# NOTE: Key below is Anvil's universal public demo key — local chain only.
# Testnet/production: use `cast wallet import` encrypted keystore (see security note above).
cd contracts
forge script script/Deploy.s.sol:DeploySamoaHub \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast -vvvv

# Terminal 3 — start frontend
cd frontend && npm run dev

# Terminal 2 — register demo citizens into NDIDSRegistry
node register_citizens.js
```

> ⚠️ **IMPORTANT — Run `register_citizens.js` after every Anvil restart.**
>
> Anvil is a local in-memory blockchain. Every time it stops and restarts, the chain resets to zero — all contracts are gone and must be redeployed. This means all citizen registrations are also wiped. The deploy script re-deploys the contracts; `register_citizens.js` re-registers the seed citizens into NDIDSRegistry.
>
> **If you skip `register_citizens.js`, every identity lookup will return `false`** — even for citizens that appear in the UI seed data list. This is not a bug. The blockchain simply has no record of them yet because the registration transactions were reset with the chain.
>
> **The full sequence after every Anvil restart:**
> ```bash
> # 1. Kill and restart Anvil
> pkill anvil && anvil &
>
> # 2. Redeploy all contracts (from /contracts directory)
> forge script script/Deploy.s.sol:DeploySamoaHub \
>   --rpc-url http://127.0.0.1:8545 \
>   --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
>   --broadcast -vvvv
>
> # 3. Re-register seed citizens (from repo root)
> node register_citizens.js
>
> # 4. Reload the frontend in your browser (Ctrl+R or Cmd+R)
> ```
>
> After step 3, the Identity Registry tab in the SBS dashboard will show all seed citizens as ✅ On-chain, and identity lookups for `CITIZEN-WS-001` through `CITIZEN-WS-010` will return `true`.

### Run tests

```bash
cd contracts && forge test -vv
```

---

## The Broader Programme

This government interoperability pilot is one part of a wider suite of work Synergy Blockchain Pacific is developing in parallel.

**Government Interoperability Hub** (this repository) — the foundation layer. Seven ministry nodes connected through a permissioned hub. This same architecture scales to enterprise supply chain, cross-border trade facilitation, and any use case requiring trusted data sharing between organisations that do not fully trust each other.

**CBS Stablecoin / CBDC Consultation** — we are in early conversations with the Central Bank of Samoa about a WST-pegged stablecoin pilot. The CBS ministry node in this system is designed as the foundation for that payment rail. Benefit disbursements tracked on chain today, settled in digital WST when the infrastructure is ready.

**Indigenous Community DAO Pilot** — a parallel pilot applying permissioned blockchain governance to an indigenous Iwi community in Aotearoa New Zealand. This work informs our approach to data sovereignty and community-controlled identity in the Pacific context, and demonstrates that our team can operate across different community governance structures.

**Enterprise and Supply Chain** — the same permissioned network architecture that connects government ministries applies directly to enterprise supply chain tracking, financial management, and cross-border trade — aligned with the UNCTAD Trade Facilitation standards targeted for global adoption by 2029. This is the long-term business model that makes Synergy Blockchain Pacific sustainable.

None of these are funded. All of them are active. This is what a committed small team looks like before the funding arrives.

---

## Building National Technical Expertise — Youth, Blockchain, and the AI Era

One of the most significant barriers to Pacific digital adoption is not infrastructure — it is people. There are almost no locally trained blockchain developers in Samoa. When governments or enterprises eventually commission blockchain systems, they will have no choice but to import that expertise at significant cost, with no knowledge transfer, leaving the country dependent on outside capability indefinitely.

Synergy Blockchain Pacific's small office is designed from the ground up to be a training hub as much as a development studio. Every project we build is an opportunity to bring young Samoan developers into real blockchain development — not theoretical coursework, but hands-on work on live systems with genuine government context.

**Blockchain is becoming the trust infrastructure for the AI era.** As AI-generated content, AI-issued credentials, and AI-assisted government services become unavoidable, the question of how to verify what is real and who authorised it becomes critical. Verifiable credentials anchored on blockchain — tamper-proof, auditable, independently verifiable without a central authority — are already emerging as the global standard for managing this challenge.

A young Samoan developer trained in permissioned blockchain networks today is not just learning a current technology. They are learning the foundational infrastructure that will underpin digital identity, AI accountability, and cross-border data trust for the next two decades. Samoa has an opportunity to be a source of that expertise for the Pacific region rather than a consumer of it from elsewhere.

---

## What UNICEF Funding Would Enable

- Move from proof of concept to a real government pilot with at least one Samoa ministry
- Fund the education programme running alongside development — workshops, government briefings, public literacy about what blockchain is and is not
- Establish the first formal blockchain infrastructure deployment in Samoa's public sector
- Create replicable open-source documentation so other Pacific nations can adopt the same approach without starting from zero
- Grow the team to deliver education and development in parallel
- Begin the CBS stablecoin pilot consultation with proper resourcing
- Deploy dedicated SBSRegistry contract for the Samoa Bureau of Statistics identity system
- Integrate BSP, Vodafone M-Pay, and Digicel MyCash payment APIs for live transaction processing
- Demonstrate to Samoa's government that the 2029 commitments are achievable with local capability, not just imported solutions

---

## Parallel Applications and Submissions

This repository is the primary submission to the **UNICEF Venture Fund 2026** — focused on the children, aid accountability, and government service delivery dimensions of the system.

We are also preparing a parallel submission to **UNCTAD** focused on the trade facilitation, customs workflow, and interoperability framework components — directly aligned with the UNCTAD Trade Facilitation blockchain standard targeted for global adoption by 2029.

A separate **CBS Stablecoin Pilot** repository is in development — a WST-pegged digital currency architecture designed in consultation with the Central Bank of Samoa, intended as the payment rail that connects this interoperability system to real financial settlement.

These are not separate projects. They are three layers of the same Pacific blockchain infrastructure programme — identity and interoperability, trade facilitation, and digital currency — being built in parallel by the same small team with no external funding.

---

## Roadmap

### Phase 1 — Proof of Concept ✅ Complete (self-funded)
- [x] 4 smart contracts written and tested — 28+ passing tests
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
- [x] Government engagement suite — letters, proposals, briefings
- [ ] Testnet deployment — blocked by RPC rate limits and gas constraints

### Phase 2 — Pilot (requires funding — applying now)
- [ ] Paid RPC endpoint to complete public testnet deployment
- [ ] Formal engagement with at least one Samoa government ministry
- [ ] Dedicated SBSRegistry smart contract deployment
- [ ] Wallet-based authentication for ministry officers
- [ ] BSP, Vodafone M-Pay, and Digicel MyCash payment API integration
- [ ] IPFS integration for off-chain document storage with on-chain hash anchoring
- [ ] ZK proof layer for NDIDS privacy enhancement
- [ ] Government and youth education programme
- [ ] CBS stablecoin pilot with proper resourcing
- [ ] UNCTAD trade facilitation submission
- [ ] Public launch and Pacific regional documentation

### Phase 3 — Production and Regional Expansion (2027–2029)
- [ ] Live government deployment in Samoa — One Government Portal integration
- [ ] Enterprise and supply chain implementations
- [ ] Regional Pacific expansion — replicable model for Pacific Island nations
- [ ] AI-assisted anomaly detection and cross-ministry fraud flagging
- [ ] Multi-sig wallet governance for ministry administrators
- [ ] SMS gateway for outer islands with limited internet connectivity
- [ ] Alignment with UNCTAD 2029 global trade facilitation standard
- [ ] Contribution to Samoa 2025–2030 ICT Development Plan targets

---

## Built With

- [Solidity 0.8.20](https://soliditylang.org/) — Smart contracts
- [Foundry](https://book.getfoundry.sh/) — Testing and deployment framework
- [Polygon](https://polygon.technology/) — EVM-compatible public blockchain (testnet target)
- [ethers.js v6](https://docs.ethers.org/v6/) — Live contract reads and transaction signing
- [React 18](https://react.dev/) — Multi-stakeholder dashboard frontend
- [Vite](https://vitejs.dev/) — Build tooling

---

## License

MIT — Open source for the Pacific and beyond.

See [LICENSE.txt](./LICENSE.txt) for full terms. Built and owned by Synergy Blockchain Pacific · Anthony George Williams · 2026.

---

*Samoa Pacific Blockchain Hub · Synergy Blockchain Pacific · 2026*

*This is the work of Anthony George Williams and a small Pacific team — building the infrastructure their region needs, with the resources they have, before the window closes. Every line of code was written without a salary, without a grant, and without certainty that anyone would notice. We believe they should. Fa'afetai lava.*
