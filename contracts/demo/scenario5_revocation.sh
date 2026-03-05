#!/bin/bash
# =============================================================================
# SCENARIO 5: Permission Revocation
# Grant access, use it, revoke it, confirm denied
# Demonstrates data sovereignty and GDPR-aligned governance
# =============================================================================

set -e

RPC="http://127.0.0.1:8545"
ADMIN_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
CBS_KEY="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
MOF_KEY="0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"

# !! SET THESE AFTER DEPLOYMENT !!
NDIDS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
CBS_NODE="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
MOF_NODE="0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
EDUCATION_NODE="0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()     { echo -e "${BLUE}[DEMO]${NC} $1"; }
success() { echo -e "${GREEN}[GRANTED]${NC} $1"; }
blocked() { echo -e "${RED}[REVOKED/DENIED]${NC} $1"; }
info()    { echo -e "${YELLOW}[INFO]${NC} $1"; }
divider() { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"; }

CITIZEN_HASH=$(cast keccak "SAMOA-2009-0042-SALT-7x9k")

clear
echo -e "${YELLOW}"
echo "  ╔═══════════════════════════════════════════════════════╗"
echo "  ║   SCENARIO 5: Permission Revocation                  ║"
echo "  ║                                                       ║"
echo "  ║   Data sovereignty in action                         ║"
echo "  ║   Ministries control their own data access           ║"
echo "  ║   Citizens control their identity access             ║"
echo "  ╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

sleep 1

divider
log "PART A: Ministry-level access revocation"
log "CBS records data and grants MOF access"

cast send $NDIDS "registerCitizen(bytes32)" $CITIZEN_HASH \
  --private-key $ADMIN_KEY --rpc-url $RPC > /dev/null

cast send $CBS_NODE \
  "recordService(bytes32,string,bytes32,bool)" \
  $CITIZEN_HASH "ACCOUNT_OPENED" $(cast keccak "ACCOUNT_DATA_2025") false \
  --private-key $CBS_KEY --rpc-url $RPC > /dev/null

cast send $CBS_NODE "authoriseReader(address)" $MOF_NODE \
  --private-key $CBS_KEY --rpc-url $RPC > /dev/null

MOF_BEFORE=$(cast call $CBS_NODE "authorisedReaders(address)(bool)" $MOF_NODE --rpc-url $RPC)
success "MOF access to CBS data: $MOF_BEFORE"

divider
log "MOF reads CBS data successfully"

RECORD=$(cast call $CBS_NODE \
  "getRecord(uint256)((bytes32,string,bytes32,uint256,bool))" 0 \
  --from $MOF_NODE --rpc-url $RPC)
success "MOF successfully reads: $RECORD"

sleep 1
divider
log "CBS REVOKES MOF access"
info "Reason: Data sharing agreement expired"
info "In production: automated by policy engine or ministry decision"

cast send $CBS_NODE "revokeReader(address)" $MOF_NODE \
  --private-key $CBS_KEY --rpc-url $RPC > /dev/null

MOF_AFTER=$(cast call $CBS_NODE "authorisedReaders(address)(bool)" $MOF_NODE --rpc-url $RPC)
blocked "MOF access to CBS data after revocation: $MOF_AFTER"
blocked "Any future read attempt will revert with ReadAccessDenied()"

sleep 1
divider
log "PART B: Citizen-level NDIDS access revocation"
info "The NDIDS authority can revoke ministry access at the citizen level"
info "This represents the citizen's right to withdraw consent"

cast send $NDIDS \
  "grantReadAccess(bytes32,address)" $CITIZEN_HASH $EDUCATION_NODE \
  --private-key $ADMIN_KEY --rpc-url $RPC > /dev/null

ACCESS_BEFORE=$(cast call $NDIDS "hasAccess(bytes32,address)(bool)" \
  $CITIZEN_HASH $EDUCATION_NODE --rpc-url $RPC)
success "Education has NDIDS access for citizen: $ACCESS_BEFORE"

sleep 1
divider
log "Citizen withdraws consent - NDIDS access revoked"

cast send $NDIDS \
  "revokeReadAccess(bytes32,address)" $CITIZEN_HASH $EDUCATION_NODE \
  --private-key $ADMIN_KEY --rpc-url $RPC > /dev/null

ACCESS_AFTER=$(cast call $NDIDS "hasAccess(bytes32,address)(bool)" \
  $CITIZEN_HASH $EDUCATION_NODE --rpc-url $RPC)
blocked "Education has NDIDS access after revocation: $ACCESS_AFTER"

info "Education can no longer:"
info "  - Call verifyCitizen() for this citizen"
info "  - Record new services with NDIDS verification for this citizen"
info "  - Use this citizen's identity in any new cross-ministry workflow"

sleep 1
divider

log "Revocation audit trail - all events permanently on chain"
info "grantsReadAccess event:  recorded at block N"
info "ReadAccessRevoked event: recorded at block N+M"
info "Any future audit can reconstruct the complete access history"
info "Compliance with data governance regulations: demonstrable"

divider
echo -e "${GREEN}"
echo "  ╔═══════════════════════════════════════════════════════╗"
echo "  ║   SCENARIO 5 COMPLETE: Permission Revocation         ║"
echo "  ║                                                       ║"
echo "  ║   Ministry data sovereignty: DEMONSTRATED            ║"
echo "  ║   Citizen identity sovereignty: DEMONSTRATED         ║"
echo "  ║   Audit trail of all access changes: ON CHAIN        ║"
echo "  ║                                                       ║"
echo "  ║   This architecture is compatible with:              ║"
echo "  ║   - GDPR right to withdraw consent                   ║"
echo "  ║   - Pacific data sovereignty principles              ║"
echo "  ║   - Government data sharing agreements               ║"
echo "  ╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"
