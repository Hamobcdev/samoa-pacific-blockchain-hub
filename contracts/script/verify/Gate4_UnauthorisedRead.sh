#!/usr/bin/env bash
# Gate 4 — Unauthorised Read Rejection
#
# Purpose: Confirm that access-control is enforced on-chain by attempting reads
#          from an address that has NOT been granted access. Each call should
#          revert. A clean system returns 0 successful-but-should-fail calls.
#
# Usage:
#   source contracts/.env
#   bash Gate4_UnauthorisedRead.sh
#
# Pass criteria: all attempted unauthorised reads revert (cast returns non-zero
#                exit code or "reverted" in output).

set -uo pipefail

: "${AMOY_RPC_URL:?Set AMOY_RPC_URL}"
: "${NDIDS_ADDRESS:?Set NDIDS_ADDRESS}"
: "${CBS_ADDRESS:?Set CBS_ADDRESS}"
: "${MOF_ADDRESS:?Set MOF_ADDRESS}"

# A clearly random address with no permissions
STRANGER="0x1234567890123456789012345678901234567890"

# A citizen hash that exists on-chain (SAMOA-CBS-001)
CITIZEN_HASH=$(cast keccak "SAMOA-CBS-001")

FAILED=0

expect_revert() {
  local label="$1"
  shift
  # Run cast call; capture output and exit code
  output=$(cast call "$@" --rpc-url "$AMOY_RPC_URL" --from "$STRANGER" 2>&1 || true)
  if echo "$output" | grep -qiE "revert|AccessDenied|ReadAccessDenied|Unauthorised|error"; then
    echo "PASS  $label — correctly reverted"
  else
    echo "FAIL  $label — did NOT revert (output: $output)"
    FAILED=$((FAILED + 1))
  fi
}

echo "=== Gate 4: Unauthorised Read Rejection Check ==="

# NDIDSRegistry.verifyCitizen — stranger has no read access
expect_revert \
  "NDIDSRegistry.verifyCitizen (no access)" \
  "$NDIDS_ADDRESS" \
  "verifyCitizen(bytes32)(bool)" \
  "$CITIZEN_HASH"

# MinistryNode.getRecord — stranger is not an authorised reader
expect_revert \
  "CBS.getRecord(0) (no access)" \
  "$CBS_ADDRESS" \
  "getRecord(uint256)((bytes32,string,bytes32,uint256,bool))" \
  "0"

# MinistryNode.getCitizenRecords — stranger is not an authorised reader
expect_revert \
  "CBS.getCitizenRecords (no access)" \
  "$CBS_ADDRESS" \
  "getCitizenRecords(bytes32)(uint256[])" \
  "$CITIZEN_HASH"

# MOF.getRecord — stranger is not an authorised reader
expect_revert \
  "MOF.getRecord(0) (no access)" \
  "$MOF_ADDRESS" \
  "getRecord(uint256)((bytes32,string,bytes32,uint256,bool))" \
  "0"

echo ""
if [[ "$FAILED" -eq 0 ]]; then
  echo "=== GATE 4 PASSED — all unauthorised reads correctly rejected ==="
  exit 0
else
  echo "=== GATE 4 FAILED — $FAILED call(s) did not revert when they should have ==="
  echo "Audit onlyAuthorised / AccessDenied modifiers in MinistryNode.sol"
  echo "and readAccess mapping in NDIDSRegistry.sol."
  exit 1
fi
