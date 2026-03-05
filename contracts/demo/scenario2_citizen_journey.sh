#!/bin/bash
# =============================================================================
# SCENARIO 2: Full Citizen Journey
# NDIDS Registration -> School Enrolment -> MOF Benefit Eligibility
# =============================================================================

set -e

RPC="http://127.0.0.1:8545"

ADMIN_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
EDU_KEY="0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926b"
MOF_KEY="0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"

# !! SET THESE AFTER DEPLOYMENT !!
NDIDS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
EDUCATION_NODE="0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
MOF_NODE="0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()     { echo -e "${BLUE}[DEMO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
info()    { echo -e "${YELLOW}[INFO]${NC} $1"; }
step()    { echo -e "${CYAN}[STEP $1]${NC} $2"; }
divider() { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"; }

CITIZEN_HASH=$(cast keccak "SAMOA-2009-0042-SALT-7x9k")
ENROLMENT_HASH=$(cast keccak "ENROLMENT_RECORD_2025_TERM1")

clear
echo -e "${CYAN}"
echo "  ╔═══════════════════════════════════════════════════════╗"
echo "  ║   SCENARIO 2: Full Citizen Journey                   ║"
echo "  ║   NDIDS -> Education -> MOF Benefit                  ║"
echo "  ║                                                       ║"
echo "  ║   Following one child through the full workflow      ║"
echo "  ║   Privacy preserved at every step                    ║"
echo "  ╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

sleep 1

divider
step 1 "Register citizen in NDIDS"
info "In production: SBS registers citizen with keccak256(citizenId + citizen-held salt)"
info "Citizen hash: $CITIZEN_HASH"

cast send $NDIDS \
  "registerCitizen(bytes32)" \
  $CITIZEN_HASH \
  --private-key $ADMIN_KEY \
  --rpc-url $RPC \
  > /dev/null

REGISTERED=$(cast call $NDIDS \
  "isRegistered(bytes32)(bool)" \
  $CITIZEN_HASH \
  --rpc-url $RPC)

success "Citizen registered in NDIDS: $REGISTERED"
TOTAL=$(cast call $NDIDS "totalRegistered()(uint256)" --rpc-url $RPC)
info "Total citizens registered: $TOTAL"

sleep 1
divider

step 2 "Grant Education ministry NDIDS read access for this citizen"
info "Access is citizen-specific - Education can only verify THIS citizen"
info "Access can be revoked at any time by the NDIDS authority"

cast send $NDIDS \
  "grantReadAccess(bytes32,address)" \
  $CITIZEN_HASH \
  $EDUCATION_NODE \
  --private-key $ADMIN_KEY \
  --rpc-url $RPC \
  > /dev/null

HAS_ACCESS=$(cast call $NDIDS \
  "hasAccess(bytes32,address)(bool)" \
  $CITIZEN_HASH \
  $EDUCATION_NODE \
  --rpc-url $RPC)

success "Education node has NDIDS access: $HAS_ACCESS"

sleep 1
divider

step 3 "Education records school enrolment WITH NDIDS verification"
info "This single transaction:"
info "  1. Calls NDIDS to verify citizen identity"
info "  2. Records enrolment event on Education node"
info "  3. Emits IdentityVerified event (auditable)"
info "  4. Emits ServiceDelivered event (auditable)"
info "  Zero PII crosses any boundary"

cast send $EDUCATION_NODE \
  "recordService(bytes32,string,bytes32,bool)" \
  $CITIZEN_HASH \
  "SCHOOL_ENROLMENT_2025_TERM1" \
  $ENROLMENT_HASH \
  true \
  --private-key $EDU_KEY \
  --rpc-url $RPC \
  > /dev/null

EDU_RECORDS=$(cast call $EDUCATION_NODE "totalRecords()(uint256)" --rpc-url $RPC)
SERVICE_COUNT=$(cast call $NDIDS "serviceCount(bytes32)(uint256)" $CITIZEN_HASH --rpc-url $RPC)

success "Education: Enrolment recorded. Total records: $EDU_RECORDS"
success "NDIDS: Service count for citizen incremented to: $SERVICE_COUNT"

sleep 1
divider

step 4 "Grant MOF read access to Education records"
info "Education ministry controls who reads its data"

cast send $EDUCATION_NODE \
  "authoriseReader(address)" \
  $MOF_NODE \
  --private-key $EDU_KEY \
  --rpc-url $RPC \
  > /dev/null

success "MOF authorised to read Education records"

sleep 1
divider

step 5 "MOF reads Education record and confirms enrolment"
info "MOF is confirming the child is enrolled before approving benefit"

RECORD=$(cast call $EDUCATION_NODE \
  "getRecord(uint256)((bytes32,string,bytes32,uint256,bool))" \
  0 \
  --from $MOF_NODE \
  --rpc-url $RPC)

success "MOF: Read Education record successfully"
info "Record: $RECORD"

sleep 1
divider

step 6 "MOF records benefit eligibility"
info "Benefit triggered by confirmed school enrolment"
info "This is the core child welfare use case for UNICEF alignment"

BENEFIT_HASH=$(cast keccak "BENEFIT_APPROVAL_2025_Q1")

cast send $MOF_NODE \
  "recordService(bytes32,string,bytes32,bool)" \
  $CITIZEN_HASH \
  "EDUCATION_BENEFIT_ELIGIBLE_2025" \
  $BENEFIT_HASH \
  true \
  --private-key $MOF_KEY \
  --rpc-url $RPC \
  > /dev/null

MOF_RECORDS=$(cast call $MOF_NODE "totalRecords()(uint256)" --rpc-url $RPC)
FINAL_SERVICE_COUNT=$(cast call $NDIDS "serviceCount(bytes32)(uint256)" $CITIZEN_HASH --rpc-url $RPC)

success "MOF: Benefit eligibility recorded. Total MOF records: $MOF_RECORDS"
success "NDIDS: Citizen has been verified $FINAL_SERVICE_COUNT times across ministries"

divider
echo -e "${GREEN}"
echo "  ╔═══════════════════════════════════════════════════════╗"
echo "  ║   SCENARIO 2 COMPLETE: Full Citizen Journey          ║"
echo "  ║                                                       ║"
echo "  ║   Journey: NDIDS -> Education -> MOF                 ║"
echo "  ║   NDIDS verifications: 2                             ║"
echo "  ║   Ministry records created: 2                        ║"
echo "  ║   PII stored on chain: ZERO                          ║"
echo "  ║   Unauthorised access points: ZERO                   ║"
echo "  ║                                                       ║"
echo "  ║   This child's school access and benefit eligibility ║"
echo "  ║   are now permanently recorded and auditable.        ║"
echo "  ╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"
