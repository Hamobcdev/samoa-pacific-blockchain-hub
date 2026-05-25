# Samoa DPI — Live System Inventory
## Date: 22 May 2026 · Branch: feat/currency-architecture · Prompt 07B

---

## Smart Contracts (Polygon Amoy Testnet)

| Contract | Status |
|---|---|
| NDIDSRegistry | Deployed |
| InteroperabilityHub | Deployed |
| AIDisbursementTracker | Deployed |
| MinistryNode (×N) | Deployed |
| CulturalWitnessRegistry | Deployed |

**Forge tests: 88 · Exit status: 0**

Deployed addresses: `contracts/broadcast/Deploy.s.sol/80002/run-latest.json`

---

## Live Portals

| Portal | URL | HTTP | Audience |
|---|---|---|---|
| Landing | https://landing-alpha-seven-82.vercel.app | 200 | Public |
| Citizens | https://samoa-dpi-citizens.vercel.app | 200 | Citizens |
| CBS Admin | https://samoa-dpi-admin.vercel.app | 200 | CBS — Monetary policy |
| MOF Oversight | https://samoa-dpi-mof.vercel.app | 200 | MOF — Fiscal policy |
| DBS | https://samoa-dpi-dbs.vercel.app | 200 | DBS |
| Donor | https://samoa-dpi-donor.vercel.app | 200 | Donors |
| Verify | https://samoa-dpi-verify.vercel.app | 200 | Public — third-party |
| Trade/OMW | https://samoa-dpi-trade.vercel.app | 200 | Trade |

HTTP checks run: 22 May 2026. All 8 live Vercel portals returned 200.

---

## Governance Architecture

| Authority | Portal | Jurisdiction |
|---|---|---|
| Central Bank of Samoa | CBS Admin | Monetary policy · WST-DPI · mint/burn authority |
| Ministry of Finance | MOF Oversight | Fiscal · disbursements · grants · budget execution |
| SBP Technical | Internal | Platform operation · security · research infrastructure |
| NUS Research | Research Context (CBS Admin) | ISOC programme · D1–D10 deliverables |

**Constitutional separation confirmed 20 May 2026:** CBS holds monetary policy authority only.
Fiscal oversight (grant approvals, disbursement tracking, budget execution) sits with MOF per
constitutional mandate. This separation is reflected in the portal architecture.

---

## Stakeholder Engagement

| Body | Status | Date |
|---|---|---|
| Central Bank of Samoa | Exploratory — meeting held | 20 May 2026 |
| MCIT | Briefed — formal endorsement being sought | May 2026 |
| NUS / Dr. Edna Temese | Active — ISOC submission authorised | 20 May 2026 |
| Prof. Stan Karanasios (UQ) | Advisory confirmed — letter requested | 20 May 2026 |
| ISOC Foundation | Submission pending — deadline 22 May 2026 21:00 UTC | — |

---

## CBS Meeting Notes — 20 May 2026

- No governance decisions confirmed. All 6 CBS governance items remain `resolved: false`.
- Research proceeds on fiat rails (Polygon Amoy) per CBS direction. No CBDC on SBP timeline.
- CBS confirmed full mint/burn authority (consistent with platform design).
- CBS confirmed they want to be in the driver's seat for any sovereign chain work.
- Production readiness required before any pilot engagement.
- MOF fiscal oversight separation confirmed as correct constitutional model.
- NUS to make official contact with CBS. SBP monitoring progress.

---

## Research Programme — ISOC Deliverables Summary

| ID | Title | Status |
|---|---|---|
| D1 | WoG-DPI Architecture and Governance in the Pacific SIDS Context | In Progress |
| D2 | CBDC Design for Pacific Small Open Economies | Pending |
| D3 | Participatory Action Research in National DPI Deployment | Pending |
| D4 | Trade Facilitation and UNCTAD 2029 Readiness in Pacific SIDS | Pending |
| D5 | WoG-DPI Impact on Financial Inclusion: Samoa Empirical Study | Pending |
| D6 | CBS Sandbox Technical and Regulatory Findings Report | Pending |
| D7 | Samoa D-DPI Policy Brief — ICT Policy 2025–2030 | Pending |
| D8 | Pacific SIDS D-DPI Toolkit — Open Implementation Guide | Pending |
| D9 | Complete Open-Source Codebase — MIT Licence | In Progress |
| D10 | Ministry Training Materials — Role-Based Modules | Pending |

**Programme:** ISOC Foundation Research Programme 2026 · USD $500,000 over 24 months  
**PI:** Dr. Edna Temese, PhD — National University of Samoa  
**Advisor:** Prof. Stan Karanasios — University of Queensland (advisory, self-funded)  
**Technical Partner:** Synergy Blockchain Pacific — Anthony Williams, CEO  
**Submission deadline:** 22 May 2026 · 21:00 UTC (23 May 10:00 AM WST)

---

*Updated: Prompt 07B · 22 May 2026 · MOF portal live — samoa-dpi-mof.vercel.app · Synergy Blockchain Pacific*
