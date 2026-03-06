# Samoa Pacific Blockchain Hub

**Government interoperability infrastructure for Samoa — built by a small Pacific team, proving what is possible before asking for permission.**

Built by [Synergy Blockchain Pacific](https://github.com/Hamobcdev) · UNICEF Venture Fund 2026 Application

---

## Who We Are

Synergy Blockchain Pacific was founded by Anthony George Williams — currently the only blockchain developer based in Samoa.

Anthony pivoted away from cryptocurrency speculation to the underlying technology in 2019, after recognising that blockchain infrastructure — not speculative trading — was where the real transformative potential lay for small island developing states. With no formal blockchain development programme available in Samoa, he taught himself to build blockchain applications from the ground up, driven by a clear conviction: this technology is better suited to small island developing states than almost anywhere else. Because of our size, we are actually better positioned to scale blockchain infrastructure across an entire economy than larger nations with legacy systems too embedded to replace.

Synergy Blockchain Pacific today is Anthony, co-founder Suetena, and Britney who is supporting education and marketing outreach. No external funding. No institutional backing. Building because the window to get this right — before global standards lock in and Samoa is left adapting to infrastructure designed elsewhere — is closing.

This is not a corporate submission. It is a genuine grassroots effort from the only person on the island who has spent years developing both the technical capability and the government relationships needed to make this real.

We are asking UNICEF not just to fund a product, but to fund the beginning of an industry in the Pacific — and the person who has already spent years building it without being asked to.

---

## The Honest State of This Project

This repository is a working proof of concept — not a live production system. Here is exactly what exists today:

**What is real and working:**
- 4 smart contracts written, deployed, and tested — 28+ passing tests
- A live multi-stakeholder dashboard reading from real contract state
- 25 citizens registered across 5 service sectors on a local blockchain
- Cross-ministry data sharing with permission enforcement at contract level
- A UNICEF grant lifecycle with milestone-based tranche release on chain
- Six integration test scenarios demonstrating real government workflows

**What is not yet real:**
- Not yet deployed to a public testnet or mainnet — see the section below on why
- No actual Samoa government ministry is using this system yet
- The citizens and records are demo data — not real government data
- We have not yet had formal government sign-off on a pilot

**Why we are submitting now:**
We are submitting because this is the level of work a two-person unfunded team can produce to demonstrate genuine capability and commitment. With UNICEF support, we can move from proof of concept to a real government pilot. Without it, we continue building as best we can with what we have.

---

## The Testnet Barrier — A Real Example of Why Funding Matters

We attempted to deploy this system to Polygon Amoy testnet. We hit two hard walls that a funded team would not face.

**The deployment script is too large for free-tier infrastructure.** The full deployment — 9 contracts, 25 citizens registered, 6 ministry nodes wired, cross-ministry permissions set, a UNICEF grant with three tranches seeded — is a single Foundry script that exceeds the gas limits on free RPC endpoints. We attempted deployment through Alchemy's free tier. Transactions dropped mid-sequence. Even after manually increasing gas fees, the deployment did not complete. The contracts that did land were orphaned — wired to addresses that didn't exist because later transactions in the sequence failed.

**Free RPC tier rate limits block the full test suite.** Alchemy's free tier has request rate limits that the dashboard's 3-second polling and the full integration test suite both exceed. Running all 28+ tests against a live testnet endpoint hits those limits within the first few scenarios.

This is not a technical failure. The same deployment script runs perfectly on Anvil local chain — every contract, every citizen, every permission, every test. The barrier is purely financial: a paid RPC endpoint ($50-200/month depending on throughput) and a small MATIC allocation for testnet gas would resolve both issues immediately.

**We are not deploying to mainnet.** Spending real cryptocurrency on a proof-of-concept system that is not yet serving real users would be financially irresponsible. The right deployment path is: funded RPC endpoint → complete testnet deployment with public verifiable transaction hashes on Polygonscan → pilot with one Samoa government ministry → production mainnet deployment when real data is moving.

We are asking UNICEF and any technical reviewers to run this system locally using the instructions below. Everything that would be publicly verifiable on a testnet block explorer is verifiable locally — the contracts, the transactions, the state changes, the audit trail. The only thing missing is a public URL, and that is a funding problem, not a capability problem.

If any reviewer or AID provider is able to assist with testnet deployment infrastructure as part of the evaluation process, we would welcome that conversation.

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

## The Broader Programme

This government interoperability pilot is one part of a wider suite of work Synergy Blockchain Pacific is developing in parallel:

**Government Interoperability Hub** (this repository) — the foundation layer. Six ministry nodes connected through a permissioned hub. This same architecture scales to enterprise supply chain, cross-border trade facilitation, and any use case requiring trusted data sharing between organisations that do not fully trust each other.

**CBS Stablecoin / CBDC Consultation** — we are in early conversations with the Central Bank of Samoa about a WST-pegged stablecoin pilot. The CBS ministry node in this system is designed as the foundation for that payment rail. Benefit disbursements tracked on chain today, settled in digital WST when the infrastructure is ready.

**Indigenous Community DAO Pilot** — a parallel pilot applying permissioned blockchain governance to an indigenous Iwi community in Aotearoa New Zealand. This work informs our approach to data sovereignty and community-controlled identity in the Pacific context, and demonstrates that our team can operate across different community governance structures.

**Enterprise and Supply Chain** — the same permissioned network architecture that connects government ministries applies directly to enterprise supply chain tracking, financial management, and cross-border trade — aligned with the UNCTAD Trade Facilitation standards targeted for global adoption by 2029. This is the long-term business model that makes Synergy Blockchain Pacific sustainable: implementing blockchain infrastructure for government and enterprise as Pacific capability grows.

None of these are funded. All of them are active. This is what a committed small team looks like before the funding arrives.

---

## What UNICEF Funding Would Enable

With support from the UNICEF Venture Fund, specifically:

- Move from proof of concept to a real government pilot with at least one Samoa ministry
- Fund the education programme running alongside development — workshops, government briefings, public literacy about what blockchain is and is not
- Establish the first formal blockchain infrastructure deployment in Samoa's public sector
- Create replicable open-source documentation so other Pacific nations can adopt the same approach without starting from zero
- Grow the team — currently two people — to deliver education and development in parallel
- Begin the CBS stablecoin pilot consultation with proper resourcing
- Demonstrate to Samoa's government that the 2029 commitments are achievable with local capability, not just imported solutions

---

## Building National Technical Expertise — Youth, Blockchain, and the AI Era

One of the most significant barriers to Pacific digital adoption is not infrastructure — it is people. There are almost no locally trained blockchain developers in Samoa. When governments or enterprises eventually commission blockchain systems, they will have no choice but to import that expertise at significant cost, with no knowledge transfer, leaving the country dependent on outside capability indefinitely.

Synergy Blockchain Pacific's small office is designed from the ground up to be a training hub as much as a development studio. Every project we build is an opportunity to bring young Samoan developers into real blockchain development — not theoretical coursework, but hands-on work on live systems with genuine government context. The goal is not just to build the infrastructure Samoa needs, but to build the people who can maintain, extend, and eventually teach it themselves.

This matters urgently for two reasons that extend well beyond blockchain alone.

**The 2029 deadline is a people problem as much as a technology problem.** Samoa's national digital readiness commitments cannot be met by importing solutions. They require local engineers who understand both the technology and the Samoan context — the language, the governance structures, the cultural considerations around data sovereignty and community consent. Those engineers do not yet exist in sufficient numbers. Growing them takes time that has already started running.

**Blockchain is becoming the trust infrastructure for the AI era.** As AI-generated content, AI-issued credentials, and AI-assisted government services become unavoidable, the question of how to verify what is real and who authorised it becomes critical. Verifiable credentials anchored on blockchain — tamper-proof, auditable, independently verifiable without a central authority — are already emerging as the global standard for managing this challenge. The W3C Verifiable Credentials standard, decentralised identity frameworks, and digital credential wallets are all converging on blockchain as the trust layer beneath AI systems.

A young Samoan developer trained in permissioned blockchain networks today is not just learning a current technology. They are learning the foundational infrastructure that will underpin digital identity, AI accountability, and cross-border data trust for the next two decades. Samoa has an opportunity to be a source of that expertise for the Pacific region rather than a consumer of it from elsewhere.

The interoperability hub in this repository is the first project in that training pipeline. The DAO governance pilot, the stablecoin consultation, and the enterprise supply chain work that follows are the next ones. Each project deepens the capability of the team and creates documented, open-source work that the next cohort of Pacific developers can build on.

This is how a small island nation builds a blockchain industry — not by waiting for it to arrive, but by starting it.

---

## Live Demo

Four stakeholder views — no login required:

| Role | What you see |
|---|---|
| 💰 UNICEF Donor | Live grant state, tranche tracker, field evidence hashes, audit trail |
| 🏛️ Ministry Officer | Record service delivery, manage permissions, cross-ministry records |
| 🪪 NDIDS Admin | 25-citizen registry, live identity verification, privacy architecture |
| 🌍 Public / Auditor | Ministry network, live workflow events, contract addresses |

The dashboard reads directly from smart contracts running on a local Anvil chain. Every transaction appears in the dashboard within 3 seconds. This is demonstrable live, not a recorded video.

---

## Deployed Contracts

### Polygon Mainnet
| Contract | Address |
|---|---|
| NDIDSRegistry | *deploying as part of this application* |
| AIDisbursementTracker | *deploying as part of this application* |
| InteroperabilityHub | *deploying as part of this application* |
| Ministry Nodes (×6) | *deploying as part of this application* |

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
- Zero PII on chain — only `keccak256(citizenId + salt)` hashes
- Each ministry owns its node — data sovereignty by architecture
- Cross-ministry reads require explicit on-chain permission grants
- Permissions are permanent until deliberately revoked
- Atomic workflows — multi-step processes execute in one transaction
- Aid disbursement tied to verified milestones, not manual approval

---

## Running Locally

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js 18+

### Setup

```bash
git clone https://github.com/Hamobcdev/samoa-pacific-blockchain-hub.git
cd samoa-pacific-blockchain-hub

cd frontend && npm install && npm run dev
# Open http://localhost:5173

cd ../contracts && forge test -vv
```

### Full live system

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

## Parallel Applications and Submissions

This repository is the primary submission to the **UNICEF Venture Fund 2026** — focused on the children, aid accountability, and government service delivery dimensions of the system.

We are also preparing a parallel submission to **UNCTAD** focused on the trade facilitation, customs workflow, and interoperability framework components — directly aligned with the UNCTAD Trade Facilitation blockchain standard targeted for global adoption by 2029. The customs and MCIL ministry nodes in this system are the technical foundation for that submission.

A separate **CBS Stablecoin Pilot** repository is in development — a WST-pegged digital currency architecture designed in consultation with the Central Bank of Samoa, intended as the payment rail that connects this interoperability system to real financial settlement. That pilot will be submitted to both CBS and UNCTAD as a companion piece to this work.

These are not separate projects. They are three layers of the same Pacific blockchain infrastructure programme — identity and interoperability, trade facilitation, and digital currency — being built in parallel by the same small team with no external funding.

---

## Roadmap

### Phase 1 — Proof of Concept ✅ Complete (self-funded)
- [x] 4 smart contracts written and tested
- [x] 28+ passing tests including 6 integration scenarios
- [x] Live multi-stakeholder dashboard with real contract reads
- [x] 25 demo citizens across 5 service sectors
- [x] Government engagement suite — letters, proposals, briefings
- [x] Full system running on Anvil local chain
- [ ] Testnet deployment — blocked by RPC rate limits and gas constraints (see above)

### Phase 2 — Pilot (requires funding — applying now)
- [ ] Paid RPC endpoint to complete testnet deployment
- [ ] Formal engagement with at least one Samoa government ministry
- [ ] Wallet-based authentication for ministry officers
- [ ] Government and youth education programme
- [ ] IPFS integration for off-chain document storage
- [ ] CBS stablecoin pilot with proper resourcing
- [ ] UNCTAD trade facilitation submission
- [ ] Public launch and Pacific regional documentation

### Phase 3 — Production and Regional Expansion (2027–2029)
- [ ] Live government deployment in Samoa
- [ ] Enterprise and supply chain implementations
- [ ] Regional Pacific expansion — replicable model for Pacific Island nations
- [ ] ZK proofs for NDIDS privacy layer
- [ ] AI-assisted anomaly detection and service optimisation
- [ ] Contribution to Samoa 2025–2030 ICT Development Plan targets
- [ ] Alignment with UNCTAD 2029 global trade facilitation standard

---

## Built With

- [Solidity 0.8.20](https://soliditylang.org/) — Smart contracts
- [Foundry](https://book.getfoundry.sh/) — Testing and deployment
- [Polygon](https://polygon.technology/) — EVM-compatible blockchain
- [ethers.js v6](https://docs.ethers.org/v6/) — Live contract reads
- [React 18](https://react.dev/) — Dashboard frontend
- [Vite](https://vitejs.dev/) — Build tooling

---

## License

MIT — Open source for the Pacific and beyond.

---

*Samoa Pacific Blockchain Hub · Synergy Blockchain Pacific · 2026*

*This is the work of Anthony George Williams and a small Pacific team — building the infrastructure their region needs, with the resources they have, before the window closes. Every line of code was written without a salary, without a grant, and without certainty that anyone would notice. We believe they should. Fa'afetai lava.*
