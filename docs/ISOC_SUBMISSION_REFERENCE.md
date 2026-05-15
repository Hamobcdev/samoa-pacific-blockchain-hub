# ISOC Submission — Live Platform Reference
# Samoa DPI · NUS/ISOC Research Programme 2026
# Last updated: 2026-05-15

---

## Publicly Accessible Demo URLs

| Portal | URL | Status |
|---|---|---|
| Landing | [Vercel URL — add after Vercel project creation] | Phase 1 |
| Citizens | [Vercel URL — add after Vercel project creation] | Phase 1 |
| Admin (CBS) | [Vercel URL — add after Vercel project creation] | Phase 1 |
| DBS | [Vercel URL — add after Vercel project creation] | Phase 2 stub |
| Donor | [Vercel URL — add after Vercel project creation] | Phase 2 stub |
| Verify | [Vercel URL — add after Vercel project creation] | Phase 2 stub |

---

## Verified Repository

**Repository:** https://github.com/Hamobcdev/samoa-pacific-blockchain-hub  
**Branch:** feat/currency-architecture  
**Package manager:** pnpm  
**Commit at time of ISOC submission:** [run `git log --oneline -1` at submission time]

---

## Smart Contracts — Polygon Amoy Testnet

All contracts deployed 18 March 2026. Independently queryable via Polygonscan Amoy.

| Contract | Role | Address |
|---|---|---|
| NDIDSRegistry | National Digital Identity — hash-only, zero PII | `0x0E832d0C324Cd70ca58Dd1B0965151167853cE42` |
| InteroperabilityHub | Cross-ministry routing + consent enforcement | `0x6c213b53b41c325317dF0443442b0eae9c7618Cc` |
| AIDisbursementTracker | Grant lifecycle — milestone-based tranche release | `0x3fD12fe1400BD9B8cd7ebE59C47EA27ab6bF5EdB` |
| CBS MinistryNode | Central Bank of Samoa validator | `0xeC404FB5564da6f6c77DD7C8A694B1A3fFCe99c1` |
| MCIT MinistryNode | Ministry of Communications | `0x4F117fdC9BB2b781d52731E5674f669Bfe1E6402` |
| MOF MinistryNode | Ministry of Finance | `0x8c26B5E477d6feFf2a75C0Fbd7f3667c4dB07FC4` |

**Polygonscan Amoy explorer:** https://amoy.polygonscan.com/  
*Search any address above to verify deployment and transaction history.*

---

## Research Environment Note

This is a Phase 1 research prototype operating under the NUS/ISOC Research Programme 2026.

- No real citizen data is held on any system.
- All citizen identity records are simulated hash references.
- Financial amounts shown are for research demonstration only.
- The platform is not officially sanctioned by the Government of Samoa.
- Formal CBS engagement is at the exploratory stage — sandbox application being prepared.
- MCIT has been briefed — formal endorsement being sought.

**Research Principal Investigator:** Dr. Edna Temese, PhD — National University of Samoa (NUS)  
**Research Advisor:** Prof. Stan Karanasios — University of Queensland  
**Technical Partner:** Synergy Blockchain Pacific (SBP)  
**Contact:** synergyblockchaintf@gmail.com

---

## Independent Verification Checklist for ISOC Reviewers

- [ ] Clone repository: `git clone https://github.com/Hamobcdev/samoa-pacific-blockchain-hub`
- [ ] Install: `pnpm install`
- [ ] Build all portals: `pnpm --filter @samoa-dpi/landing build && pnpm --filter @samoa-dpi/citizens build && pnpm --filter @samoa-dpi/admin build`
- [ ] Run smart contract tests: `cd contracts && forge test -vv` — expect 29/29 passing
- [ ] Verify NDIDSRegistry on Polygonscan Amoy at address above
- [ ] Verify InteroperabilityHub on Polygonscan Amoy at address above
- [ ] Access live demo at Vercel URLs above (add URLs after deployment)

---

*samoa-pacific-blockchain-hub · feat/currency-architecture · NUS/ISOC Research Programme 2026*
