# Samoa Digital Public Infrastructure (DPI)
### One Government Interoperability Protocol

**Built by Synergy Blockchain Pacific · Research Programme 2026**
National University of Samoa / ISOC Foundation · Principal Investigator: Dr. Edna Temese

---

## 🌐 Live Showcase

**[https://hamobcdev.github.io/samoa-pacific-blockchain-hub](https://hamobcdev.github.io/samoa-pacific-blockchain-hub)**

The single public showcase URL for the Samoa DPI platform — covering all portals,
research context, standards compliance, and Pacific regional vision.

---

## 🔴 Live Platform — Research Prototype

> **Research environment only. No real government data. Submissions simulate on-chain recording.**
> NUS/ISOC Research Programme 2026 · Not an operational government system.

| Portal | URL | Access |
|--------|-----|--------|
| **CBS Admin Portal** | [samoa-dpi-admin-v2.vercel.app](https://samoa-dpi-admin-v2.vercel.app) | Role-picker — credentials below |
| **MOF Fiscal Command Centre** | [samoa-dpi-mof-v2.vercel.app](https://samoa-dpi-mof-v2.vercel.app) | Role-picker — credentials below |
| **One Maritime Window (OMW)** | [samoa-dpi-trade-v2.vercel.app](https://samoa-dpi-trade-v2.vercel.app) | Role-picker — credentials below |
| **Citizens Portal** | [samoa-dpi-citizens-v2.vercel.app](https://samoa-dpi-citizens-v2.vercel.app) | Open — select service |
| **Donor & Aid Portal** | [samoa-dpi-donor-v2.vercel.app](https://samoa-dpi-donor-v2.vercel.app) | Open — research demo |
| **DBS Distribution Portal** | [samoa-dpi-dbs-v2.vercel.app](https://samoa-dpi-dbs-v2.vercel.app) | Role-picker |

---

## 🔑 Demo Access Credentials

All portals use a role-picker on the login screen.
Enter the credential code when prompted.
No registration required. Research demonstration environment only.

### Central Bank of Samoa — CBS Admin Portal
[https://samoa-dpi-admin-v2.vercel.app](https://samoa-dpi-admin-v2.vercel.app)

| Role | Credential Code | Access Level |
|------|----------------|--------------|
| CBS Governor | `CBS-GOVERNOR-2026` | Full — all 12 tabs, monetary policy, CBDC governance |
| CBS Analyst | `CBS-ANALYST-2026` | Read-only — 8 tabs |
| CBS Deputy Governor | `CBS-DEPUTY-2026` | 12 tabs, no write access |
| CBS CFO | `CBS-CFO-2026` | Finance tabs — 9 tabs |
| CBS Auditor | `CBS-AUDITOR-2026` | Audit tabs — 4 tabs |
| CBS IT Officer | `CBS-IT-2026` | Security tab — 1 tab |

### Ministry of Finance — MOF Fiscal Command Centre
[https://samoa-dpi-mof-v2.vercel.app](https://samoa-dpi-mof-v2.vercel.app)

| Role | Credential Code | Access Level |
|------|----------------|--------------|
| Chief Executive Officer | `MOF_CEO` | Full — all 12 panels |
| Chief Financial Officer | `MOF_CFO` | Finance panels |
| Procurement Officer | `MOF_PROCUREMENT` | Procurement panels — 4 tabs |
| Internal Auditor | `MOF_AUDITOR` | Audit panels — 5 tabs |
| Senior Analyst | `MOF_ANALYST` | Read-only — all panels |

### One Maritime Window — OMW Trade Portal
[https://samoa-dpi-trade-v2.vercel.app](https://samoa-dpi-trade-v2.vercel.app)

| Role | Credential Code | Function |
|------|----------------|----------|
| Shipping Agent | `SHIPPING-AGENT-2026` | Submit FAL forms, vessel arrival, departure declaration |
| Ship Master | `SHIP-MASTER-2026` | Read-only — clearance status, port clearance certificate, voyage details |
| Freight Forwarder | `FREIGHT-2026` | Cargo declarations, B/L management, ASYCUDA |
| Customs Officer (MOR) | `CUSTOMS-2026` | Customs clearance queue — agency view only |
| MAF Biosecurity Officer | `MAF-2026` | Biosecurity queue — agency view only |
| Port Health Officer (MOH) | `PORT-HEALTH-2026` | Health declaration queue — agency view only |
| SPA Port Operations Officer | `SPA-2026` | Port authority queue — PORT CLEARED gate |

---

## 🏗️ Platform Architecture

```
Layer 5 — Pacific Regional Network (Phase 4)
    ↕  UNCTAD 2029 · ISO 20022 · BIS Project Nexus
Layer 4 — Sovereign Chain — Geth Clique PoA (Phase 3)
    ↕  CBS · MOF · MCIT validator nodes
Layer 3 — InteroperabilityHub + #FA Sovereign Oracle  ← LIVE on Amoy
    ↕  Cross-ministry workflows · Merkle anchoring · AIDisbursementTracker
Layer 2 — Ministry Node Contracts — 7 Deployed        ← LIVE on Amoy
    ↕  RBAC on-chain · FATF R.15 · BIS PFMI
Layer 1 — Sovereign Data Layer — NDIDS + Supabase     ← LIVE on Amoy
           Cryptographic citizen identity · W3C DID · NIST LoA-3
```

**Deployed Contracts — Polygon Amoy Testnet**

| Contract | Address |
|----------|---------|
| InteroperabilityHub | `0xB4D3D4Ac59f0976Ee6b5A7d118df955c8E075bfd` |
| AIDisbursementTracker | `0xbD7E00ECeE7A8d45D4720B54BbfD3295CF63455C` |
| MOF MinistryNode | `0xEcd8Af2929FaDC86aA5Bb85E05C95695df39F0Cf` |

---

## 📊 Standards Compliance

| Standard | Coverage | Live Portal |
|----------|----------|-------------|
| PEFA 2016 (31 indicators) | 85% | MOF Fiscal Command Centre |
| IMF GFSM 2014 | 78% | MOF Revenue Panel |
| OCDS 1.1.5 | 90% | MOF Procurement Panel |
| UNCTAD 2029 | 82% | One Maritime Window |
| BIS PFMI (24 principles) | 72% | CBS Admin Portal |
| FATF R.15 | 68% | CBS Financial Crimes Panel |
| CISA ZTMM 2.0 | 55% | Auth Layer + Contract RBAC |
| NIST SP 800-63-3 | 70% | NDIDS Registry |
| ISO 20022 | 40% | WST-DPI (Phase 2) |

---

## 🧪 Test Suite

```bash
cd contracts
forge test --gas-report
# 88/88 tests passing
```

---

## 🗂️ Repository Structure

```
samoa-pacific-blockchain-hub/
├── apps/
│   ├── admin/          # CBS Governor Command Centre
│   ├── ministry/mof/   # MOF Fiscal Command Centre
│   ├── trade/          # One Maritime Window (OMW)
│   ├── citizens/       # Citizens Portal
│   ├── donor/          # Donor & Aid Portal
│   └── dbs/            # DBS Distribution Portal
├── contracts/
│   ├── src/            # Solidity smart contracts
│   ├── test/           # 88 automated forge tests
│   └── script/         # Deployment scripts
├── packages/
│   └── shared-ui/      # Shared components
└── docs/
    └── index.html      # GitHub Pages showcase
```

---

## 🔬 Research Context

**Research Programme:** NUS/ISOC Foundation · Grant submitted May 2026
**Principal Investigator:** Dr. Edna Temese · NUS Faculty of Science, IT & Engineering
**Technical Partner:** Synergy Blockchain Pacific

**Working Papers (pending publication):**
- WP1: WoG-DPI Architecture and Governance in the Pacific SIDS Context
- WP2: CBS Sovereign Oracle Model — CBDC Design for Pacific Small Open Economies
- WP3: Trade Facilitation and UNCTAD 2029 Readiness in Pacific SIDS
- WP4: WoG-DPI Impact on Financial Inclusion: Samoa Empirical Study

---

## 📬 Contact & Engagement

| Enquiry | Contact |
|---------|---------|
| Government & CBS access briefing | synergyblockchaintf@gmail.com — Subject: Government Access Request |
| Investment & partnership brief | synergyblockchaintf@gmail.com — Subject: Investment Brief Request |
| Research & academic collaboration | NUS FSITE · Dr. Edna Temese |

**Synergy Blockchain Pacific**
Anthony George Williams, CEO & Blockchain Architect
Suetena Faatuala Loia, Operations Director
Apia, Independent State of Samoa

---

*Research Prototype — NUS/ISOC Research Programme 2026*
*Not an operational government system · No real government data*
*© 2026 Synergy Blockchain Pacific*
