# Samoa Digital Public Infrastructure — Architecture Reference
# For NUS/ISOC Research Paper · Technology-Neutral Academic Description
# Version 1.0 · 2026-05-15
# Research PI: Dr. Edna Temese, PhD — National University of Samoa
# Research Advisor: Prof. Stan Karanasios — University of Queensland
# Technical Partner: Synergy Blockchain Pacific (SBP)

---

## 1. System Overview

The Samoa DPI is a Whole-of-Government Digital Public Infrastructure connecting
all major Samoan government ministries through a shared cryptographic
interoperability layer. It consists of four interdependent components:

- **National Digital Identity System (NDIDS):** A hash-based citizen identity
  registry. No personally identifiable information is stored on-chain; only
  cryptographic commitments to identity references. Access is governed by
  per-citizen access control lists.

- **Ministry Nodes:** Independent, cryptographically-isolated smart contract
  modules — one per government ministry or agency. Each node maintains its own
  service record store with independent access control. Data isolation is
  enforced at the protocol level: a credential authorising access to Ministry A's
  records provides no access to Ministry B's records.

- **Interoperability Hub:** A routing and consent-enforcement layer through which
  cross-ministry workflows are executed. All cross-ministry data access requires
  explicit workflow invocation through the Hub, creating an immutable on-chain
  record of every inter-ministerial data exchange.

- **Aid Disbursement Tracker:** A grant lifecycle management module governing
  the creation, tranche management, verification, and release of development
  grants denominated in the national digital currency (WST-DPI).

---

## 2. Citizen Identity Flow

1. Citizen reference is cryptographically hashed and registered in NDIDS.
2. The hash (not the reference) is stored on-chain.
3. Authorised ministry officials may read the citizen's hash if registered
   in that ministry node's access control list.
4. Cross-ministry identity lookup requires consent-governed workflow through
   the Interoperability Hub.
5. Every access event emits an on-chain log entry.
6. Citizens can audit which ministries have accessed their record.

---

## 3. Cross-Ministry Service Delivery Flow

Example: education enrolment verification for a social welfare payment.

1. Ministry of Finance official initiates workflow via Interoperability Hub.
2. Hub verifies the official's cryptographic credential.
3. Hub calls Ministry of Education node — requests service record for citizen hash.
4. Education node verifies Hub's authorisation.
5. Service record returned to Hub.
6. Hub relays to Finance node, records workflow completion.
7. Workflow log entry emitted: participants, timestamp, outcome.
8. AID Disbursement Tracker releases payment tranche on workflow success.

All seven steps produce on-chain evidence. No step is reversible or deniable.

---

## 4. WST-DPI Digital Currency Distribution Architecture

The WST-DPI (Digital Tālā) follows a tiered distribution model:

**Tier 1 — Central Bank of Samoa (Issuer):**
Sole authority to mint and burn WST-DPI. Sets monetary policy parameters,
exchange rate oracle, and system governance.

**Tier 2 — Licensed Retail Distributors:**
Five CBS-authorised institutions distribute WST-DPI to citizens and businesses.
Each operates under a daily distribution limit set by CBS.

**Tier 3 — Institutional Participants:**
Non-bank financial institutions (pension fund, unit trust, life insurer) receive
WST-DPI through their Tier 2 banking partner for specific payment purposes.

**Sovereignty property:**
The CBS Sovereign Oracle Model eliminates dependency on foreign private oracle
networks for WST exchange rates. The Central Bank publishes and cryptographically
signs exchange rates directly — the monetary authority is its own oracle.

---

## 5. Security Architecture — Key Properties

**Blast-radius isolation:** Compromise of any single ministry node does not
expose other nodes. Each has independent access control.

**Immutable audit trail:** Every state change emits an on-chain event.
No transaction can be altered or deleted after confirmation.

**Cryptographic access control:** Authorisation is enforced at the protocol
level. Application-layer filtering is not the security boundary.

**Constitutional node architecture:** 25 operational validator nodes across
all government branches provide Byzantine fault tolerance. 30 observer nodes
provide independent monitoring.

**AI governance:** All AI agents interacting with the system hold registered
cryptographic credentials with defined capability scopes and expiry dates.
All AI-initiated actions are permanently logged and distinguishable from
human-initiated actions. Emergency revocation capability retained by CBS Governor.

---

## 6. One Maritime Window Integration

The Interoperability Hub provides the technical foundation for Samoa's
obligations under WTO Trade Facilitation Agreement Article 10.4.

A single maritime declaration submission routes to six ministry nodes:
Customs, Port Authority, Biosecurity, Health, Immigration, and Maritime Finance.
Each ministry reviews and approves its component of the declaration independently.
A consolidated port clearance is issued when all ministries approve.
Harbour dues are paid via the WST-DPI payment rail.

All declarations are permanently recorded with timestamps and verifier credentials.
The entire clearance chain is independently auditable.

---

## 7. Compliance Alignment

| Standard | Relevant Requirement | Implementation Status |
|---|---|---|
| BIS PFMI P17 | Operational risk management, circuit breaker | Pausable implemented — pause authority pending CBS decision |
| FATF R.15 | AML/CFT monitoring, SAR reporting | flagService() implemented — reporting chain pending CBS decision |
| CISA ZTMM 2.0 | Zero Trust Architecture | Cold wallet authentication, explicit verification per request |
| NIST 800-53 | Access control, audit trail, session management | Implemented — see checklist |
| WTO TFA Art. 10.4 | Single Window for trade documentation | Architecture complete — OMW implementation Phase 2 |
| IMO FAL.5 | Electronic maritime declarations | Schema validation architecture designed |
| W3C GovStack | Interoperable identity, service delivery | Hash-based NDIDS; full W3C DID in Phase 3 |

---

## 8. Pacific Replication Framework

The Samoa DPI architecture is intentionally designed for replication across
Pacific Island nations facing identical constraints:

- **WTO TFA obligations:** Tonga, Vanuatu, Fiji, Solomon Islands, Papua New Guinea,
  and Federated States of Micronesia all share Article 10.4 Single Window obligations.
- **SIDS constraints:** Small Island Developing State infrastructure constraints
  (intermittent connectivity, mobile-first access, limited institutional capacity)
  are design requirements, not edge cases.
- **Sovereignty by default:** No foreign cloud dependency, no foreign oracle, no
  foreign payment rail. Each nation deploys its own sovereign infrastructure.
- **Documented for replication:** Architecture is described in technology-neutral
  academic language to enable adaptation across jurisdictions without proprietary
  vendor dependencies.

---

## 9. Smart Contract Test Coverage

| Contract | Tests | Status |
|---|---|---|
| NDIDSRegistry | 7/7 | ✓ Passing |
| MinistryNode | 6/6 | ✓ Passing |
| AIDisbursementTracker | 8/8 | ✓ Passing |
| InteroperabilityHub | 8/8 | ✓ Passing |
| **Total** | **29/29** | **✓ All passing** |

Tests include: citizen registration and hash verification, access control enforcement,
cross-ministry workflow invocation, grant lifecycle management, tranche release,
integration scenarios (education × welfare, customs × health, grant × ID verification).

---

*This document is prepared for the NUS/ISOC Research Programme 2026.
Technology-neutral language is used throughout. No proprietary protocol
or vendor names appear in this description.*

*samoa-pacific-blockchain-hub · feat/currency-architecture · 2026-05-15*
