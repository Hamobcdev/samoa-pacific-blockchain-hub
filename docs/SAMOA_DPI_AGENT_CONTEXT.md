# SAMOA DPI — AGENT CONTEXT v1.0
# Prepend to any Claude Code session or skill invocation.
# Full reference: SAMOA_DPI_PROJECT_ROADMAP_v1.html
# Date: 2026-05-15

---

## PROJECT IDENTITY

**Organisation:** Synergy Blockchain Pacific (SBP)
**Principals:** Anthony George Williams (CEO/CTO) · Suetena Faatuala Loia (Ops Director)
**Research PI:** Dr. Edna Temese, PhD — National University of Samoa (NUS) — UNAMBIGUOUS PI
**Research Advisor:** Prof. Stan Karanasios — University of Queensland
**SBP role:** Technical Partner only. Never co-PI. Never lead. Reports to Dr. Temese.
**Research grant:** ISOC Foundation 2026 · USD $500,000 · Deadline: 22 May 2026
**Platform:** Whole-of-Government Digital Public Infrastructure (WoG-DPI) — Samoa
**Chain:** Polygon Amoy (testnet) → Polygon Mainnet → Sovereign Geth PoA → Sovereign Compute (Phase 4)
**Branch:** feat/currency-architecture · **Package manager:** pnpm ONLY

---

## ARCHITECTURE — CRITICAL CONSTANTS

```
Nodes: 55 total (25 operational validators + 30 observers)
Contracts: NDIDSRegistry.sol · MinistryNode.sol · InteroperabilityHub.sol · AIDisbursementTracker.sol
Portals: 7 (Landing · Citizens · CBS Admin · Ministry×8 · DBS · Donor · Verify)
Tests: 29/29 forge tests passing · exit 0
```

**MONOREPO:**
```
packages/contracts-abi/   ← ALL node data lives here — GOVERNMENT_NODES, nodesByBranch
packages/shared-ui/src/   ← currency/ · Tooltip · StatusBadge · ErrorPage · LanguageToggle
                              ResearchGate · feature-flags · tokens.css · acronyms
apps/landing/             ✅ Port 5180 — complete
apps/citizens/            ✅ Port 5181 — complete (demo data, 159KB)
apps/admin/               ✅ Port 5182 — complete (31 src files, CBS demo-ready)
apps/ministry/ dbs/ donor/ verify/ trade/ — stubs (Phase 2–3)
api/                      ✅ Hono RPC proxy — method allowlist, rate limiting, Phase 1 sim
frontend/                 ⛔ Legacy monolith — NEVER TOUCH
```

---

## HARD RULES — NEVER VIOLATE

1. All node data from `@samoa-dpi/contracts-abi` — ZERO hardcoded arrays
2. Technology-neutral: NO ICP / DFINITY / Canister / NNS / Chain Fusion in any user-facing string
3. WST = 2dp always · currency code always co-visible · never a bare number
4. CBS_GOVERNANCE_ITEMS = exactly 6 items, resolved: false — never fabricate resolution
5. Package manager = pnpm ONLY
6. Phase-gated features: HIDDEN not disabled — use `<FeatureGate flag="...">` from shared-ui
7. Currency arithmetic = decimal.js or BigInt — NEVER native float
8. Status indicators = colour + icon + text — NEVER colour alone (WCAG AAA)
9. Research docs: NUS = Lead Institution · Dr. Temese = PI · SBP = Technical Partner only
10. NEVER touch `frontend/` legacy monolith

---

## DESIGN SYSTEM — LOCKED VALUES

```javascript
COLORS = {
  flagRed: '#CE1126', flagBlue: '#003087', gold: '#C9A227',
  bg: '#070910',      // NOT #07091\n0 — was a typo, now corrected
  surface: '#0c1222', surface2: '#111830',
  border: '#1b2540',  text: '#e8edf8',
  muted: '#8c9ab8',   // lightened in ADMIN-10 to pass WCAG AAA 7:1
  green: '#00c896', amber: '#f0b429', critical: '#ff3b4e', purple: '#8b5cf6',
}
FONTS = { mono: 'IBM Plex Mono', sans: 'IBM Plex Sans' }
// Mono = authority, amounts, addresses, labels
// Sans = body text
```

**Currency Display Spec v1.0:**
- WST: 2dp · USDC: 6dp technical/2dp native · FX: 18dp technical/2dp native
- Amount column: IBM Plex Mono 13px right-aligned
- Settlement chips: Initiated / Confirming / Final / Failed / CBS-Held
- Timestamps: DD/MM/YYYY HH:MM WST (UTC+13)

---

## CBS GOVERNANCE — 6 BLOCKED ITEMS (feature-flag gated)

| ID | Item | Flag |
|---|---|---|
| AC-2-multisig | Gnosis Safe 2-of-3 | VITE_FLAG_MULTISIG |
| AC-1-consent | Citizen EIP-712 consent | VITE_FLAG_CONSENT |
| AC-3-timelock | TimelockController on releaseTranche | VITE_FLAG_TIMELOCK |
| PAUSABLE | Circuit breaker all 4 contracts | VITE_FLAG_CIRCUIT_BREAKER |
| SOV-1 | Validator governance | VITE_FLAG_VALIDATOR_GOV |
| FATF-1 | AML/SAR reporting | VITE_FLAG_FATF |

All 6 technically implemented. CBS policy answers unlock them via env vars — no code changes.

---

## CHECKLIST STATE — 2026-05-15

```
Done (34/99):
  ADMIN-1–12 ✅  LAND-1–5 ✅  CIT-1–8 ✅  SHARED-1–6 ✅  API-1–3 ✅

Ready to build next (no CBS decisions required):
  DBS-1–4 (DBS portal)  ·  DONOR-1–2 (donor portal)  ·  VER-1–2 (verify portal)

CBS-blocked (wait for CBS decisions):
  AUTH-1–5 (cold wallet auth)  ·  MIN-1–5 (ministry portals)
  DEPLOY-1–3 (production)  ·  TRAIN-1–5 (training)

NUS/ISOC (separate deadline 22 May):
  NUS-1–5 (research submission readiness)
```

---

## TECHNOLOGY DECISIONS — LOCKED

| Question | Decision | Phase |
|---|---|---|
| WST oracle | CBS Sovereign Oracle Model — CBS IS the oracle, no Chainlink for WST | Phase 2 |
| Chainlink | Secondary verification only — international commodity data | Phase 2+ |
| ZK proofs | Additive layer on existing NDIDS hashes — ZKVerifier.sol | Phase 3 |
| Oasis/TEE | Assessment for confidential ministry records — EVM-compatible | Phase 3–4 |
| Sovereign compute | Full-stack sovereignty — HTTPS outcalls, threshold signing | Phase 4+ |
| OMW | executeOMWClearance() on InteroperabilityHub + WST-DPI harbour dues | Phase 2 |
| AI governance | AIAgentRegistry.sol + capability bitmask + human-in-the-loop | Phase 2 |

---

## IP / OPEN SOURCE — LOCKED

- Research codebase: MIT licence at programme end (ISOC Deliverable D9)
- Production deployments: AGPL or commercial licence (SBP retains)
- Trademarks: "Samoa DPI", "WST-DPI Digital Tālā", "Synergy Blockchain Pacific" (SBP)
- Commercial value: nearly a decade of research, the government relationship and trust, the operational expertise to deploy and maintain sovereign infrastructure, the training and upskilling capability, and the Pacific regional network of similar government relationships — not code

---

## REGULATORY LANGUAGE — DO NOT UPGRADE

- CBS: "engagement is at the exploratory stage. Formal sandbox application being prepared."
- MCIT: "has been briefed. Formal endorsement being sought."
- NUS: "NUS, led by Dr. Edna Temese as PI, is conducting independent academic research."

---

## WST-DPI DISTRIBUTION TIERS

- Tier 1: CBS (issuer)
- Tier 2 retail: ANZ Samoa · BSP Samoa · SCB · NBS · DBS (NOT Westpac — no longer in Samoa)
- Tier 3 institutional: SNPF · UTOS · WSTLAC (receive via Tier 2 banking partners)

---

## KEY DOCUMENTS (all in project docs/)

- `SAMOA_DPI_PROJECT_ROADMAP_v1.html` — master visual reference (this file's companion)
- `FRONTEND_UI_CHECKLIST_v1.html` — 99-item interactive checklist
- `CONTRACTS_SECURITY_CHECKLIST_v1.html` — 7-section contracts/backend
- `CYBERSECURITY_FRAMEWORK_v1.html` — 13-section founding security policy
- `ISOC_NUS_SupportDoc_v3.docx` — ISOC grant application support (WoG framing)
- `UREC_Ethics_Checklist_FILLED_Samoa_DPI.docx` — NUS ethics form (needs Dr. Temese signature)
- `audit_remediation_checklist.html` — 50-item audit tracker (6/50 resolved)
- `CLAUDE_CODE_PROMPT_PHASE1_FRONTEND.md` — Phase 1 build prompt (executed, complete)
- `CLAUDE_CODE_PROMPT_SHARED_INFRA.md` — Shared infra build prompt (executed, complete)

---
*SAMOA_DPI_AGENT_CONTEXT.md · v1.0 · 2026-05-15 · Synergy Blockchain Pacific*
