# Samoa Digital Public Infrastructure — Architecture Reference
# For NUS/ISOC Research Paper · Technology-Neutral Description
# Version 1.0 · 2026-05-15

---

## 1. System Overview

The Samoa DPI is a Whole-of-Government Digital Public Infrastructure
connecting all major Samoan government ministries through a shared
cryptographic interoperability layer. It comprises four components:

**National Digital Identity System (NDIDS):** A hash-based citizen
identity registry. No personally identifiable information is stored
on-chain — only cryptographic commitments to identity references.
Access is governed by per-citizen access control lists enforced at
the protocol level.

**Ministry Nodes:** Independent, cryptographically-isolated smart
contract modules — one per government ministry or agency. Each node
maintains its own service record store with its own access control.
Data isolation is enforced at the protocol level: a credential
authorising access to Ministry A's records provides no access to
Ministry B's records under any circumstance.

**Interoperability Hub:** A routing and consent-enforcement layer
through which cross-ministry workflows are executed. All cross-ministry
data access requires explicit workflow invocation through the Hub,
creating an immutable on-chain record of every inter-ministerial
data exchange.

**Aid Disbursement Tracker:** A grant lifecycle management module
governing the creation, tranche management, verification, and release
of development grants. Integrates with the WST-DPI payment rail for
automated disbursement upon verified milestone completion.

---

## 2. Citizen Identity Flow

1. Citizen reference is cryptographically hashed and registered in NDIDS
2. The hash (not the reference) is stored on-chain — no PII on-chain
3. Authorised ministry officials may read the citizen's hash if
   registered in that ministry node's access control list
4. Cross-ministry identity lookup requires consent-governed workflow
   through the Interoperability Hub
5. Every access event emits an on-chain log entry — immutable and
   independently verifiable
6. Citizens can audit which ministries have accessed their record
   via the Citizens Portal

---

## 3. Cross-Ministry Service Delivery Flow

Example: education enrolment verification for a social welfare payment.

1. Ministry of Finance official initiates workflow via Hub
2. Hub verifies the official's cryptographic credential
3. Hub calls Ministry of Education node — requests service record
   for citizen hash
4. Education node verifies Hub's authorisation before responding
5. Service record returned to Hub
6. Hub relays to Finance node, records workflow completion
7. Workflow log entry emitted: participants, timestamp, outcome —
   permanently recorded and independently auditable
8. Aid Disbursement Tracker releases payment tranche on workflow
   success, subject to configured delay window and multi-signature
   approval

All steps produce on-chain evidence. No step is reversible or deniable.

---

## 4. WST-DPI Digital Currency Distribution Architecture

The WST-DPI (Digital Tālā) follows a tiered distribution model
aligned with BIS PFMI guidance for CBDC infrastructure:

**Tier 1 — Central Bank of Samoa (Issuer):**
Sole authority to mint and burn WST-DPI. Sets monetary policy
parameters, exchange rate oracle, and system governance.

**Tier 2 — Licensed Retail Distributors:**
Five CBS-authorised institutions distribute WST-DPI to citizens
and businesses, each operating under a daily distribution limit
set by CBS.

**Tier 3 — Institutional Participants:**
Non-bank financial institutions receive WST-DPI through their
Tier 2 banking partner for specific payment purposes.

**CBS Sovereign Oracle Model:**
Exchange rates are published and cryptographically signed by CBS
directly — eliminating dependency on foreign private oracle networks
for WST exchange rate data. The monetary authority is its own oracle.

---

## 5. Security Architecture — Key Properties

**Blast-radius isolation:** Compromise of any single ministry node
does not expose other nodes. Each node has independent access control.

**Immutable audit trail:** Every state change emits an on-chain event.
No transaction can be altered or deleted after confirmation by any
party, including the technical operator.

**Cryptographic access control:** Authorisation is enforced at the
protocol level. Application-layer filtering is not the security
boundary — it is a presentation layer only.

**Constitutional node architecture:** 25 operational validator nodes
across all government branches provide Byzantine fault tolerance.
30 observer nodes provide independent monitoring without write access.

**AI governance layer:** All AI agents interacting with the system
hold registered cryptographic credentials with defined capability
scopes and expiry dates. All AI-initiated actions are permanently
logged and distinguishable from human-initiated actions. Emergency
revocation capability is retained by the CBS Governor role.

---

## 6. One Maritime Window Integration

The Interoperability Hub provides the technical foundation for
Samoa's obligations under WTO Trade Facilitation Agreement
Article 10.4 (One Maritime Window).

A single maritime declaration submission routes to six ministry
nodes: Customs, Port Authority, Biosecurity, Health, Immigration,
and Maritime Finance. Each ministry reviews and approves its
component independently. A consolidated port clearance is issued
when all ministries approve. Harbour dues are settled via the
WST-DPI payment rail.

All declarations are permanently recorded with timestamps and
verifier credentials — the entire clearance chain is independently
auditable by any authorised party.

---

## 7. Compliance Alignment

| Standard | Requirement | Status |
|---|---|---|
| BIS PFMI P17 | Operational risk, circuit breaker | Pausable implemented — pause authority pending CBS decision |
| FATF R.15 | AML/CFT monitoring, SAR reporting | flagService() implemented — reporting chain pending CBS decision |
| CISA ZTMM 2.0 | Zero Trust Architecture | Cold wallet auth, explicit verification per request |
| NIST 800-53 | Access control, audit, session management | Implemented |
| WTO TFA Art. 10.4 | Single Window for trade documentation | Architecture complete — OMW implementation Phase 2 |
| IMO FAL.5 | Electronic maritime declarations | Schema validation architecture designed |
| W3C GovStack | Interoperable identity, service delivery | Hash-based NDIDS; W3C DID in Phase 3 |

---

## 8. Research Methodology Note

This architecture documentation is produced for academic research
purposes under the NUS/ISOC Research Programme 2026. All language
is technology-neutral. No proprietary protocol or vendor names
appear in this description. The architecture is independently
verifiable at the public testnet deployment referenced in the
ISOC Submission Reference document.

---
*National University of Samoa · NUS/ISOC Research Programme 2026*
*Principal Investigator: Dr. Edna Temese, Faculty of Science IT & Engineering*
*Technical Partner: Synergy Blockchain Pacific · Apia, Samoa*
