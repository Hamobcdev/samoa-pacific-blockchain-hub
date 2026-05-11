#!/usr/bin/env bash
# Gate 2 — Polygonscan Source Verification
#
# Purpose: Confirm all 10 deployed contracts are source-verified on Polygonscan
#          (Amoy) after each deployment. Unverified bytecode breaks the public
#          audit trail and blocks Etherscan's read/write UI.
#
# Usage:
#   export POLYGONSCAN_API_KEY=...
#   export NDIDS_ADDRESS=0x...  (and the other 9 addresses from deploy output)
#   bash Gate2_PolygonscanVerify.sh
#
# Pass criteria: all 10 addresses print "Contract source code verified" or
#                "Already Verified".

set -euo pipefail

AMOY_EXPLORER_API="https://api-amoy.polygonscan.com/api"

check_verified() {
  local label="$1"
  local addr="$2"

  result=$(curl -s \
    "${AMOY_EXPLORER_API}?module=contract&action=getabi&address=${addr}&apikey=${POLYGONSCAN_API_KEY}")

  status=$(echo "$result" | jq -r '.status')
  message=$(echo "$result" | jq -r '.message')

  if [[ "$status" == "1" ]]; then
    echo "PASS  $label ($addr) — verified"
  else
    echo "FAIL  $label ($addr) — $message"
    FAILED=$((FAILED + 1))
  fi
}

: "${POLYGONSCAN_API_KEY:?Set POLYGONSCAN_API_KEY}"
: "${NDIDS_ADDRESS:?Set NDIDS_ADDRESS}"
: "${AID_ADDRESS:?Set AID_ADDRESS}"
: "${HUB_ADDRESS:?Set HUB_ADDRESS}"
: "${CBS_ADDRESS:?Set CBS_ADDRESS}"
: "${MCIT_ADDRESS:?Set MCIT_ADDRESS}"
: "${MOF_ADDRESS:?Set MOF_ADDRESS}"
: "${MCIL_ADDRESS:?Set MCIL_ADDRESS}"
: "${EDUCATION_ADDRESS:?Set EDUCATION_ADDRESS}"
: "${CUSTOMS_ADDRESS:?Set CUSTOMS_ADDRESS}"
: "${SBS_ADDRESS:?Set SBS_ADDRESS}"

FAILED=0

echo "=== Gate 2: Polygonscan Verification Check ==="
check_verified "NDIDSRegistry"          "$NDIDS_ADDRESS"
check_verified "AIDisbursementTracker"  "$AID_ADDRESS"
check_verified "InteroperabilityHub"    "$HUB_ADDRESS"
check_verified "MinistryNode (CBS)"     "$CBS_ADDRESS"
check_verified "MinistryNode (MCIT)"    "$MCIT_ADDRESS"
check_verified "MinistryNode (MOF)"     "$MOF_ADDRESS"
check_verified "MinistryNode (MCIL)"    "$MCIL_ADDRESS"
check_verified "MinistryNode (EDUC)"    "$EDUCATION_ADDRESS"
check_verified "MinistryNode (CUST)"    "$CUSTOMS_ADDRESS"
check_verified "MinistryNode (SBS)"     "$SBS_ADDRESS"

echo ""
if [[ "$FAILED" -eq 0 ]]; then
  echo "=== GATE 2 PASSED — all 10 contracts verified ==="
  exit 0
else
  echo "=== GATE 2 FAILED — $FAILED contract(s) unverified ==="
  echo "Re-run deployment with --verify flag:"
  echo "  forge script script/Deploy.s.sol --broadcast --verify --etherscan-api-key \$POLYGONSCAN_API_KEY"
  exit 1
fi
