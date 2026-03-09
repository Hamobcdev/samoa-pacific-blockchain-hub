#!/usr/bin/env node
// =============================================================================
// register_citizens.js — Samoa Pacific Blockchain Hub
// Batch register citizen hashes into the NDIDSRegistry contract
// =============================================================================
// Usage:
//   node register_citizens.js                        # registers SEED_CITIZENS list
//   node register_citizens.js citizens.csv           # registers from CSV file
//   node register_citizens.js "WS-123456,WS-234567" # comma-separated inline
//
// CSV format: one citizenId per line, optional second column for label
//   WS-123456,Sione Faleolo
//   WS-234567,Lagi Tuivaga
//   SOE-EPC-2025-001,Electric Power Corporation
//
// Requirements:
//   npm install ethers
//   Anvil must be running: anvil --port 8545
//   Deployer key must match: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
//
// PRIVACY NOTE:
//   Only the keccak256 hash of each citizenId is sent to the blockchain.
//   The plain citizenId is NEVER stored on-chain or in any log output.
//   This script prints truncated hashes only.
// =============================================================================

const { ethers } = require("ethers");
const fs          = require("fs");
const path        = require("path");

// ── Config ────────────────────────────────────────────────────────────────
const RPC_URL      = process.env.RPC_URL      || "http://127.0.0.1:8545";
const DEPLOYER_KEY = process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const NDIDS_ADDR   = process.env.NDIDS_ADDR   || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const NDIDS_ABI = [
  "function totalRegistered() view returns (uint256)",
  "function isRegistered(bytes32) view returns (bool)",
  "function registerCitizen(bytes32 citizenHash) external",
  "function batchRegisterCitizens(bytes32[] citizenHashes) external",
  "event CitizenRegistered(bytes32 indexed citizenHash, uint256 timestamp)",
];

// ── Seed citizens — matches SEED_CITIZENS in App.jsx ──────────────────────
const SEED_CITIZENS = [
  { id: "CITIZEN-WS-001", label: "Demo Citizen 01",           sector: "Education/Welfare"  },
  { id: "CITIZEN-WS-002", label: "Demo Citizen 02",           sector: "Trade/Business"     },
  { id: "CITIZEN-WS-003", label: "Demo Citizen 03",           sector: "Business"           },
  { id: "CITIZEN-WS-004", label: "Demo Citizen 04",           sector: "Education"          },
  { id: "CITIZEN-WS-005", label: "Demo Citizen 05",           sector: "Welfare/Finance"    },
  { id: "SOE-EPC-2025-001", label: "Electric Power Corporation", sector: "Business/SOE"   },
  { id: "SOE-SWA-2025-002", label: "Samoa Water Authority",   sector: "Business/SOE"      },
  { id: "CITIZEN-WS-006", label: "Demo Citizen 06",           sector: "Identity"           },
  { id: "CITIZEN-WS-007", label: "Demo Citizen 07",           sector: "Identity"           },
  { id: "CITIZEN-WS-008", label: "Demo Citizen 08",           sector: "Identity/Elections" },
  { id: "CITIZEN-WS-009", label: "Demo Business 01",          sector: "Business/Trade"     },
  { id: "CITIZEN-WS-010", label: "Demo Foreign Investor",     sector: "Business/FDI"       },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function hashId(citizenId) {
  return ethers.keccak256(ethers.toUtf8Bytes(citizenId.trim()));
}

function shortHash(h) {
  return h.slice(0, 12) + "…" + h.slice(-6);
}

function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return raw.split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"))
    .map(line => {
      const [id, label] = line.split(",").map(s => s.trim());
      return { id, label: label || id };
    });
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("════════════════════════════════════════════════════════");
  console.log("  Samoa Pacific Blockchain — NDIDSRegistry Batch Register");
  console.log("════════════════════════════════════════════════════════");
  console.log(`  RPC:    ${RPC_URL}`);
  console.log(`  NDIDS:  ${NDIDS_ADDR}`);
  console.log("");

  // ── Connect ──────────────────────────────────────────────────────────────
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer   = new ethers.Wallet(DEPLOYER_KEY, provider);
  const ndids    = new ethers.Contract(NDIDS_ADDR, NDIDS_ABI, signer);

  const network  = await provider.getNetwork();
  const balance  = await provider.getBalance(signer.address);
  console.log(`  Network: chainId ${network.chainId}`);
  console.log(`  Signer:  ${signer.address}`);
  console.log(`  Balance: ${ethers.formatEther(balance)} ETH`);
  console.log("");

  // ── Determine citizen list ────────────────────────────────────────────────
  let citizens = [...SEED_CITIZENS];
  const arg = process.argv[2];

  if (arg && fs.existsSync(arg)) {
    console.log(`  Source: CSV file — ${arg}`);
    citizens = parseCsv(arg);
  } else if (arg && arg.includes(",")) {
    console.log(`  Source: Inline IDs`);
    citizens = arg.split(",").map(id => ({ id: id.trim(), label: id.trim() }));
  } else {
    console.log(`  Source: SEED_CITIZENS (default — ${citizens.length} citizens)`);
  }
  console.log("");

  // ── Pre-check: how many are already registered? ───────────────────────────
  const beforeTotal = Number(await ndids.totalRegistered());
  console.log(`  NDIDSRegistry: ${beforeTotal} citizens currently registered`);
  console.log("");

  // ── Check and register each citizen ──────────────────────────────────────
  const toRegister = [];
  const alreadyDone = [];

  process.stdout.write("  Checking registration status…\n");
  for (const c of citizens) {
    const h = hashId(c.id);
    const registered = await ndids.isRegistered(h);
    if (registered) {
      alreadyDone.push({ ...c, hash: h });
    } else {
      toRegister.push({ ...c, hash: h });
    }
  }

  console.log(`  Already registered: ${alreadyDone.length}`);
  console.log(`  To register:        ${toRegister.length}`);
  console.log("");

  if (toRegister.length === 0) {
    console.log("  ✅ All citizens already registered. Nothing to do.");
    return;
  }

  // ── Strategy: use batchRegisterCitizens if ≥3, otherwise one-by-one ──────
  const results = { success: 0, failed: 0, skipped: alreadyDone.length };

  if (toRegister.length >= 3) {
    console.log(`  Using batchRegisterCitizens (${toRegister.length} hashes in one tx)…`);
    try {
      const hashes = toRegister.map(c => c.hash);
      const tx     = await ndids.batchRegisterCitizens(hashes);
      process.stdout.write(`  Tx sent: ${tx.hash.slice(0,18)}… `);
      const receipt = await tx.wait();
      console.log(`confirmed (block ${receipt.blockNumber})`);
      results.success = toRegister.length;

      // Print summary — hashes only, no plain IDs
      toRegister.forEach(c => {
        console.log(`    ✅ ${shortHash(c.hash)}  [${c.sector || ""}]`);
      });
    } catch(e) {
      // batchRegister not on contract — fall back to one-by-one
      if (e.message?.toLowerCase().includes("no matching function")) {
        console.log("  ⚠ batchRegisterCitizens not found — falling back to individual registration");
        for (const c of toRegister) {
          await registerOne(ndids, c, results);
        }
      } else {
        console.error(`  ❌ Batch failed: ${e.message}`);
        results.failed = toRegister.length;
      }
    }
  } else {
    console.log(`  Registering ${toRegister.length} citizen(s) individually…`);
    for (const c of toRegister) {
      await registerOne(ndids, c, results);
    }
  }

  // ── Final summary ─────────────────────────────────────────────────────────
  const afterTotal = Number(await ndids.totalRegistered());
  console.log("");
  console.log("════════════════════════════════════════════════════════");
  console.log("  COMPLETE");
  console.log(`  Registered now:  ${results.success}`);
  console.log(`  Already existed: ${results.skipped}`);
  console.log(`  Errors:          ${results.failed}`);
  console.log(`  Total on-chain:  ${afterTotal} citizens`);
  console.log("════════════════════════════════════════════════════════");
}

async function registerOne(ndids, citizen, results) {
  try {
    const tx      = await ndids.registerCitizen(citizen.hash);
    const receipt = await tx.wait();
    console.log(`    ✅ ${shortHash(citizen.hash)}  block ${receipt.blockNumber}`);
    results.success++;
  } catch(e) {
    if (e.message?.toLowerCase().includes("already")) {
      console.log(`    ↩  ${shortHash(citizen.hash)}  already registered`);
      results.skipped++;
    } else {
      console.log(`    ❌ ${shortHash(citizen.hash)}  ${e.message?.slice(0,60)}`);
      results.failed++;
    }
  }
}

main().catch(err => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});
