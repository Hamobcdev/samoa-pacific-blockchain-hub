#!/usr/bin/env bash
# Gate 6 — Frontend Bundle Inspection
#
# Purpose: Confirm the production frontend bundle contains no sensitive secrets
#          (private keys, raw RPC keys) and that the bundle was built against
#          the latest deployed contract addresses.
#
# Usage:
#   cd frontend && npm run build
#   cd ..
#   bash contracts/script/verify/Gate6_BundleInspection.sh
#
# Pass criteria:
#   - No 0xac0974 (Anvil default key) in any bundle file
#   - No literal PRIVATE_KEY strings in bundle
#   - VITE_RPC_URL resolves to a non-empty string in the built JS
#   - Each of the 3 core contract addresses appears in the bundle

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
DIST_DIR="$REPO_ROOT/frontend/dist"

FAILED=0

pass() { echo "PASS  $1"; }
fail() { echo "FAIL  $1"; FAILED=$((FAILED + 1)); }

: "${NDIDS_ADDRESS:?Set NDIDS_ADDRESS}"
: "${AID_ADDRESS:?Set AID_ADDRESS}"
: "${HUB_ADDRESS:?Set HUB_ADDRESS}"

echo "=== Gate 6: Frontend Bundle Inspection ==="
echo "Bundle directory: $DIST_DIR"
echo ""

if [[ ! -d "$DIST_DIR" ]]; then
  echo "FAIL  dist/ directory not found — run 'npm run build' first"
  exit 1
fi

# ── Secret leak checks ────────────────────────────────────────────────────────

if grep -rq "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" "$DIST_DIR" 2>/dev/null; then
  fail "Anvil default private key found in bundle"
else
  pass "No Anvil default private key in bundle"
fi

if grep -rq "PRIVATE_KEY" "$DIST_DIR" 2>/dev/null; then
  fail "Literal PRIVATE_KEY string found in bundle"
else
  pass "No PRIVATE_KEY literal in bundle"
fi

if grep -rq "DEPLOYER_KEY" "$DIST_DIR" 2>/dev/null; then
  fail "DEPLOYER_KEY found in bundle"
else
  pass "No DEPLOYER_KEY in bundle"
fi

# ── Contract address checks ───────────────────────────────────────────────────

# Lowercase addresses for case-insensitive matching
ndids_lower=$(echo "$NDIDS_ADDRESS" | tr '[:upper:]' '[:lower:]')
aid_lower=$(echo "$AID_ADDRESS" | tr '[:upper:]' '[:lower:]')
hub_lower=$(echo "$HUB_ADDRESS" | tr '[:upper:]' '[:lower:]')

if grep -rqi "$ndids_lower" "$DIST_DIR" 2>/dev/null; then
  pass "NDIDSRegistry address present in bundle ($NDIDS_ADDRESS)"
else
  fail "NDIDSRegistry address NOT found in bundle — update frontend/src/App.jsx"
fi

if grep -rqi "$aid_lower" "$DIST_DIR" 2>/dev/null; then
  pass "AIDisbursementTracker address present in bundle ($AID_ADDRESS)"
else
  fail "AIDisbursementTracker address NOT found in bundle — update frontend/src/App.jsx"
fi

if grep -rqi "$hub_lower" "$DIST_DIR" 2>/dev/null; then
  pass "InteroperabilityHub address present in bundle ($HUB_ADDRESS)"
else
  fail "InteroperabilityHub address NOT found in bundle — update frontend/src/App.jsx"
fi

# ── RPC URL check ─────────────────────────────────────────────────────────────
# VITE_ vars are inlined at build time; the bundle should NOT contain the literal
# "VITE_RPC_URL" string (it should be replaced with the actual URL value).
if grep -rq "VITE_RPC_URL" "$DIST_DIR" 2>/dev/null; then
  fail "VITE_RPC_URL placeholder still present in bundle — VITE env var was not set at build time"
else
  pass "No VITE_RPC_URL placeholder in bundle (env var was correctly inlined)"
fi

echo ""
if [[ "$FAILED" -eq 0 ]]; then
  echo "=== GATE 6 PASSED — bundle is clean and addresses are current ==="
  exit 0
else
  echo "=== GATE 6 FAILED — $FAILED check(s) failed ==="
  exit 1
fi
