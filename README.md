# Samoa Pacific Blockchain Hub
## Sovereign Digital Public Infrastructure — Independent State of Samoa

A live, independently verifiable blockchain DPI platform serving as 
the primary research instrument for the NUS/ISOC Internet Society 
Foundation Research Programme 2026.

## Live Platform

| Portal | URL | Status |
|--------|-----|--------|
| Landing | https://samoa-dpi-landing-v2.vercel.app | Live |
| CBS Admin | https://samoa-dpi-admin.vercel.app | Live |
| Citizens | https://samoa-dpi-citizens.vercel.app | Live |
| Trade / OMW | https://samoa-dpi-trade-v2.vercel.app | Live |
| Ministry of Finance | https://samoa-dpi-mof.vercel.app | Live |
| Donor Oversight | https://samoa-dpi-donor.vercel.app | Live |
| Credential Verify | https://samoa-dpi-verify.vercel.app | Live |
| DBS Distribution | https://samoa-dpi-dbs.vercel.app | Live |

## Research Programme

- Lead Institution: National University of Samoa (NUS)
- Principal Investigator: Dr. Edna Temese, PhD
- International Advisor: Prof. Stan Karanasios, University of Queensland (advisory)
- Technical Infrastructure: Synergy Blockchain Pacific — Anthony Williams, CEO
- Funding Body: Internet Society (ISOC) Foundation Research Grant Programme 2026
- Research focus: Measuring Meaningful Connectivity through Decentralised 
  Digital Public Infrastructure in a Pacific SIDS context

## Build Status

- 88 forge smart contract tests passing
- 8 Vercel portals deployed and live
- Branch: feat/currency-architecture (active development)
- Smart contracts: Polygon Amoy testnet

## Repository Structure

apps/          — 8 frontend portals (Vite/React)
packages/      — shared-ui, contracts-abi
contracts/     — Solidity smart contracts (Foundry)
docs/          — Architecture and research documentation

## Smart Contracts (Polygon Amoy Testnet)

- NDIDSRegistry.sol — National Digital Identity System
- MinistryNode.sol — Per-ministry service record registry
- InteroperabilityHub.sol — Cross-ministry workflow orchestration
- AIDisbursementTracker.sol — Grant lifecycle and tranche management

## Technical Stack

Solidity · Foundry · React · Vite · pnpm workspaces · 
Vercel · Polygon Amoy · ethers.js · IBM Plex (typography)

## Standards Alignment

BIS PFMI · FATF R.15 · GovStack · CISA ZTMM 2.0 · W3C DID

## Governance Status

Phase 1 — Research Environment. CBS governance decisions pending.
All 6 governance items (multisig, circuit breaker, timelock, 
validator governance, FATF SAR, citizen consent) are implemented 
as feature-flagged code awaiting CBS policy confirmation.

---
*Synergy Blockchain Pacific · Apia, Samoa · 2026*
*NUS/ISOC Research Programme · feat/currency-architecture*
