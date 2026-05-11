#!/usr/bin/env bash
# Gate 3 — records(uint256) Auto-Getter Absent from MinistryNode ABI
#
# Purpose: Confirm that the Solidity auto-generated public getter for the
#          _records array is NOT present in any deployed MinistryNode.
#          _records is declared `private`, so records(uint256) must not exist.
#          Any call to it must revert (unrecognised function selector). A clean
#          deployment returns 0 successful-but-should-fail calls.
#
# Usage:
#   source contracts/.env
#   bash Gate3_RecordsGetter.sh
#
# Pass criteria: records(uint256) reverts on all 7 MinistryNode proxies.

set -uo pipefail

: "${AMOY_RPC_URL:?Set AMOY_RPC_URL}"
: "${CBS_ADDRESS:?Set CBS_ADDRESS}"
: "${MCIT_ADDRESS:?Set MCIT_ADDRESS}"
: "${MOF_ADDRESS:?Set MOF_ADDRESS}"
: "${MCIL_ADDRESS:?Set MCIL_ADDRESS}"
: "${EDUCATION_ADDRESS:?Set EDUCATION_ADDRESS}"
: "${CUSTOMS_ADDRESS:?Set CUSTOMS_ADDRESS}"
: "${SBS_ADDRESS:?Set SBS_ADDRESS}"

FAILED=0

expect_revert() {
  local label="$1"
  shift
  output=$(cast call "$@" --rpc-url "$AMOY_RPC_URL" 2>&1 || true)
  if echo "$output" | grep -qiE "revert|error|unrecognised|invalid"; then
    echo "PASS  $label — records(uint256) correctly absent (reverted)"
  else
    echo "FAIL  $label — records(uint256) did NOT revert; getter is public (output: $output)"
    FAILED=$((FAILED + 1))
  fi
}

echo "=== Gate 3: records(uint256) Auto-Getter Absence Check ==="

expect_revert "CBS"       "$CBS_ADDRESS"       "records(uint256)((bytes32,string,bytes32,uint256,bool))" "0"
expect_revert "MCIT"      "$MCIT_ADDRESS"      "records(uint256)((bytes32,string,bytes32,uint256,bool))" "0"
expect_revert "MOF"       "$MOF_ADDRESS"       "records(uint256)((bytes32,string,bytes32,uint256,bool))" "0"
expect_revert "MCIL"      "$MCIL_ADDRESS"      "records(uint256)((bytes32,string,bytes32,uint256,bool))" "0"
expect_revert "EDUCATION" "$EDUCATION_ADDRESS" "records(uint256)((bytes32,string,bytes32,uint256,bool))" "0"
expect_revert "CUSTOMS"   "$CUSTOMS_ADDRESS"   "records(uint256)((bytes32,string,bytes32,uint256,bool))" "0"
expect_revert "SBS"       "$SBS_ADDRESS"       "records(uint256)((bytes32,string,bytes32,uint256,bool))" "0"

echo ""
if [[ "$FAILED" -eq 0 ]]; then
  echo "=== GATE 3 PASSED — records(uint256) absent on all 7 MinistryNode proxies ==="
  exit 0
else
  echo "=== GATE 3 FAILED — $FAILED node(s) expose records(uint256) ==="
  echo "Ensure _records is declared 'private' in MinistryNode.sol and redeploy."
  exit 1
fi
