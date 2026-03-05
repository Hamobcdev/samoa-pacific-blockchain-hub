#!/bin/bash
# =============================================================================
# SCENARIO 3: AID Grant Full Lifecycle
# Create -> Release Tranche -> Verify Usage -> Auto-Complete
# This is the UNICEF killer feature demonstration
# =============================================================================

set -e

RPC="http://127.0.0.1:8545"

ADMIN_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
VERIFIER_KEY="0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6"
VERIFIER_ADDR="0xa0Ee7A142d267C1f36714E4a8F75612F20a79720"

# !! SET THESE AFTER DEPLOYMENT !!
AID_TRACKER="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
EDUCATION_NODE="0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
NC='\033[0m'

log()     { echo -e "${BLUE}[DEMO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
info()    { echo -e "${YELLOW}[INFO]${NC} $1"; }
money()   { echo -e "${MAGENTA}[FUNDS]${NC} $1"; }
divider() { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"; }

clear
echo -e "${MAGENTA}"
echo "  ╔═══════════════════════════════════════════════════════╗"
echo "  ║   SCENARIO 3: AID Grant Full Lifecycle               ║"
echo "  ║                                                       ║"
echo "  ║   UNICEF Education Access Programme 2025             ║"
echo "  ║   USD 100,000 - tracked from grant to delivery       ║"
echo "  ║                                                       ║"
echo "  ║   Every dollar accountable. Every child counted.     ║"
echo "  ╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

sleep 1

divider
log "STEP 1: Create UNICEF Education Grant"
info "Grant: UNICEF Samoa Education Access Programme 2025"
info "Total: 100,000 units across 3 milestone tranches"
info "Target: 50 vulnerable children"
info "Sector: EDUCATION"

# Create grant using cast with tuple encoding
cast send $AID_TRACKER \
  "createGrant(string,address,address,uint256,uint256,string,string[],uint256[])" \
  "UNICEF Samoa Education Access Programme 2025" \
  "0x000000000000000000000000000000000000dEaD" \
  $EDUCATION_NODE \
  100000 \
  50 \
  "EDUCATION" \
  '["Programme setup and 20 children enrolled","50 children with 80pct attendance for one term","End of year learning outcomes documented"]' \
  '[30000,40000,30000]' \
  --private-key $ADMIN_KEY \
  --rpc-url $RPC \
  > /dev/null

TOTAL_GRANTS=$(cast call $AID_TRACKER "totalGrants()(uint256)" --rpc-url $RPC)
success "Grant created. Total grants on system: $TOTAL_GRANTS"

TRANCHE_COUNT=$(cast call $AID_TRACKER "getTrancheCount(uint256)(uint256)" 0 --rpc-url $RPC)
info "Tranches created: $TRANCHE_COUNT"

sleep 1
divider

log "STEP 2: Authorise field verifier"
info "Verifier: UNICEF field officer / ministry auditor"
info "Verifier address: $VERIFIER_ADDR"

cast send $AID_TRACKER \
  "authoriseVerifier(address)" \
  $VERIFIER_ADDR \
  --private-key $ADMIN_KEY \
  --rpc-url $RPC \
  > /dev/null

IS_VERIFIER=$(cast call $AID_TRACKER "authorisedVerifiers(address)(bool)" $VERIFIER_ADDR --rpc-url $RPC)
success "Verifier authorised: $IS_VERIFIER"

sleep 1
divider

log "STEP 3: Release Tranche 1 - Programme Setup"
money "Releasing: 30,000 for programme setup and initial enrolment"

cast send $AID_TRACKER \
  "releaseTranche(uint256,uint256)" \
  0 0 \
  --private-key $ADMIN_KEY \
  --rpc-url $RPC \
  > /dev/null

TOTAL_DISBURSED=$(cast call $AID_TRACKER "totalDisbursed()(uint256)" --rpc-url $RPC)
success "Tranche 1 released"
money "Total disbursed so far: $TOTAL_DISBURSED"

sleep 1
divider

log "STEP 4: Field verifier submits evidence for Tranche 1"
info "Evidence: Field report hash (in production: IPFS CID)"
EVIDENCE=$(cast keccak "UNICEF_FIELD_REPORT_MARCH_2025_23_CHILDREN_ENROLLED")
info "Evidence hash: $EVIDENCE"
info "Beneficiaries served in this tranche: 23 children"

cast send $AID_TRACKER \
  "verifyUsage(uint256,uint256,bytes32,uint256)" \
  0 0 $EVIDENCE 23 \
  --private-key $VERIFIER_KEY \
  --rpc-url $RPC \
  > /dev/null

TOTAL_VERIFIED=$(cast call $AID_TRACKER "totalVerified()(uint256)" --rpc-url $RPC)
success "Tranche 1 verified by field officer"
money "Total verified as delivered: $TOTAL_VERIFIED"

sleep 1
divider

log "STEP 5: Release and verify Tranche 2 - Attendance Milestone"
money "Releasing: 40,000 for 50 children with 80pct attendance"

cast send $AID_TRACKER \
  "releaseTranche(uint256,uint256)" \
  0 1 \
  --private-key $ADMIN_KEY \
  --rpc-url $RPC \
  > /dev/null

EVIDENCE2=$(cast keccak "TERM1_ATTENDANCE_REPORT_48_CHILDREN_QUALIFYING")
cast send $AID_TRACKER \
  "verifyUsage(uint256,uint256,bytes32,uint256)" \
  0 1 $EVIDENCE2 48 \
  --private-key $VERIFIER_KEY \
  --rpc-url $RPC \
  > /dev/null

success "Tranche 2 released and verified - 48 children qualifying"

sleep 1
divider

log "STEP 6: Release and verify Tranche 3 - Final Outcomes"
money "Releasing: 30,000 for documented year-end learning outcomes"

cast send $AID_TRACKER \
  "releaseTranche(uint256,uint256)" \
  0 2 \
  --private-key $ADMIN_KEY \
  --rpc-url $RPC \
  > /dev/null

EVIDENCE3=$(cast keccak "YEAR_END_OUTCOMES_REPORT_47_CHILDREN_DOCUMENTED")
cast send $AID_TRACKER \
  "verifyUsage(uint256,uint256,bytes32,uint256)" \
  0 2 $EVIDENCE3 47 \
  --private-key $VERIFIER_KEY \
  --rpc-url $RPC \
  > /dev/null

success "Tranche 3 released and verified - 47 children documented"

sleep 1
divider

log "STEP 7: Read full audit trail"
info "Every transaction is permanently recorded and queryable"

FINAL_DISBURSED=$(cast call $AID_TRACKER "totalDisbursed()(uint256)" --rpc-url $RPC)
FINAL_VERIFIED=$(cast call $AID_TRACKER "totalVerified()(uint256)" --rpc-url $RPC)

money "Total disbursed: $FINAL_DISBURSED"
money "Total verified to beneficiaries: $FINAL_VERIFIED"

info "Querying complete audit trail..."
TRAIL=$(cast call $AID_TRACKER \
  "getAuditTrail(uint256)((uint256,string,bytes32,uint8,uint256,uint256,address,address)[])" \
  0 \
  --rpc-url $RPC)

success "Full audit trail retrieved: $TRAIL"
info "All 3 tranches: Pending -> Released -> Verified"
info "Grant status: AUTO-COMPLETED (all tranches verified)"

divider
echo -e "${GREEN}"
echo "  ╔═══════════════════════════════════════════════════════╗"
echo "  ║   SCENARIO 3 COMPLETE: AID Grant Lifecycle           ║"
echo "  ║                                                       ║"
echo "  ║   Total disbursed:  100,000                          ║"
echo "  ║   Total verified:   100,000                          ║"
echo "  ║   Children served:  47 (target was 50)               ║"
echo "  ║   Tranches:         3/3 verified                     ║"
echo "  ║   Grant status:     COMPLETED                        ║"
echo "  ║                                                       ║"
echo "  ║   Every dollar tracked. Every child counted.         ║"
echo "  ║   Full audit trail on chain. Permanently.            ║"
echo "  ║                                                       ║"
echo "  ║   THIS is what we are building for Samoa.            ║"
echo "  ╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"
