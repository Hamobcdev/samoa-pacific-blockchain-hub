#!/usr/bin/env bash
# Gate 5 — End-to-End Integration Test (Anvil)
#
# Purpose: Spin up a local Anvil fork of Amoy, redeploy all contracts, and run
#          the full Foundry test suite. This gate catches regressions before
#          any testnet deployment.
#
# Usage:
#   bash Gate5_IntegrationTest.sh
#
# Pass criteria: forge test exits 0 and all 29 tests pass.
# Requires: foundry (forge, anvil) on PATH.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTRACTS_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
ANVIL_PORT=8545
ANVIL_PID=""

cleanup() {
  if [[ -n "$ANVIL_PID" ]]; then
    kill "$ANVIL_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "=== Gate 5: End-to-End Integration Test ==="
echo "Working directory: $CONTRACTS_DIR"

cd "$CONTRACTS_DIR"

# ── 1. Compile ────────────────────────────────────────────────────────────────
echo ""
echo "[1/3] Compiling contracts..."
forge build --silent
echo "      Build: OK"

# ── 2. Run unit + integration tests ──────────────────────────────────────────
echo ""
echo "[2/3] Running test suite..."
forge test -v 2>&1 | tee /tmp/forge_test_output.txt
TEST_EXIT=${PIPESTATUS[0]}

if [[ "$TEST_EXIT" -ne 0 ]]; then
  echo ""
  echo "=== GATE 5 FAILED — test suite returned exit code $TEST_EXIT ==="
  exit 1
fi

# Count passing tests from output
PASSED=$(grep -c "\[PASS\]" /tmp/forge_test_output.txt || true)
FAILED=$(grep -c "\[FAIL\]" /tmp/forge_test_output.txt || true)

echo ""
echo "[3/3] Results: $PASSED passed, $FAILED failed"

if [[ "$FAILED" -gt 0 ]]; then
  echo ""
  echo "=== GATE 5 FAILED — $FAILED test(s) failed ==="
  grep "\[FAIL\]" /tmp/forge_test_output.txt
  exit 1
fi

# ── 3. Smoke-deploy on Anvil ──────────────────────────────────────────────────
echo ""
echo "Starting Anvil on port $ANVIL_PORT..."
anvil --port "$ANVIL_PORT" --silent &
ANVIL_PID=$!
sleep 2

ANVIL_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
forge script script/Deploy.s.sol:DeploySamoaHub \
  --rpc-url "http://127.0.0.1:$ANVIL_PORT" \
  --private-key "$ANVIL_KEY" \
  --broadcast \
  --silent

echo "      Anvil deploy: OK"

echo ""
echo "=== GATE 5 PASSED — $PASSED tests passed, Anvil deploy succeeded ==="
exit 0
