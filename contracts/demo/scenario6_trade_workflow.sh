#!/bin/bash
# =============================================================================
# SCENARIO 6: Multi-Ministry Trade Workflow
# Customs -> MCIL -> MOF - UNCTAD 2029 trade facilitation alignment
# =============================================================================

set -e

RPC="http://127.0.0.1:8545"
ADMIN_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
CUST_KEY="0xdbda1821b80551c9d65939329250132c0b9b9d45faab5f26b5a1a1ed7f8d73e3"
MCIL_KEY="0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6"
MOF_KEY="0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"

# !! SET THESE AFTER DEPLOYMENT !!
NDIDS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
CUSTOMS_NODE="0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"
MCIL_NODE="0x0165878A594ca255338adfa4d48449f69242Eb8F"
MOF_NODE="0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()     { echo -e "${BLUE}[DEMO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
info()    { echo -e "${YELLOW}[INFO]${NC} $1"; }
trade()   { echo -e "${CYAN}[TRADE]${NC} $1"; }
divider() { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"; }

TRADER_HASH=$(cast keccak "SAMOA-BUS-0891-SALT-2w5t")
SHIPMENT_HASH=$(cast keccak "SHIPMENT_MANIFEST_2025_0334_CONTAINER_MSKU7845632")
TRADE_HASH=$(cast keccak "TRADE_LICENCE_UPDATE_2025_IMPORT_CATEGORY_B")
DUTY_HASH=$(cast keccak "DUTY_PAYMENT_RECEIPT_2025_WST_12450")

clear
echo -e "${CYAN}"
echo "  ╔═══════════════════════════════════════════════════════╗"
echo "  ║   SCENARIO 6: Multi-Ministry Trade Workflow          ║"
echo "  ║                                                       ║"
echo "  ║   Customs -> MCIL -> MOF                             ║"
echo "  ║   Single shipment, three ministry coordination       ║"
echo "  ║   UNCTAD 2029 Single Window alignment                ║"
echo "  ╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

sleep 1

divider
log "SETUP: Register trader in NDIDS and grant trade ministry access"
trade "Trader: Fale Exports Ltd (SAMOA-BUS-0891)"
trade "Shipment: Container MSKU7845632 from New Zealand"

cast send $NDIDS "registerCitizen(bytes32)" $TRADER_HASH \
  --private-key $ADMIN_KEY --rpc-url $RPC > /dev/null

cast send $NDIDS "grantReadAccess(bytes32,address)" $TRADER_HASH $CUSTOMS_NODE \
  --private-key $ADMIN_KEY --rpc-url $RPC > /dev/null
cast send $NDIDS "grantReadAccess(bytes32,address)" $TRADER_HASH $MCIL_NODE \
  --private-key $ADMIN_KEY --rpc-url $RPC > /dev/null
cast send $NDIDS "grantReadAccess(bytes32,address)" $TRADER_HASH $MOF_NODE \
  --private-key $ADMIN_KEY --rpc-url $RPC > /dev/null

success "Trader registered, all trade ministries have NDIDS access"

sleep 1
divider

log "STEP 1: CUSTOMS - Shipment clearance with identity verification"
trade "Customs officer processes container MSKU7845632"
trade "Shipment manifest hash stored - document stored off-chain (IPFS in production)"

cast send $CUSTOMS_NODE \
  "recordService(bytes32,string,bytes32,bool)" \
  $TRADER_HASH "SHIPMENT_CLEARED_2025_CONTAINER_MSKU7845632" $SHIPMENT_HASH true \
  --private-key $CUST_KEY --rpc-url $RPC > /dev/null

CUST_RECORDS=$(cast call $CUSTOMS_NODE "totalRecords()(uint256)" --rpc-url $RPC)
NDIDS_COUNT=$(cast call $NDIDS "serviceCount(bytes32)(uint256)" $TRADER_HASH --rpc-url $RPC)
success "Customs: Shipment cleared. Records: $CUST_RECORDS"
success "NDIDS: Trader identity verifications: $NDIDS_COUNT"

sleep 1
divider

log "STEP 2: Grant MCIL read access to Customs records"
info "Customs grants MCIL access to see clearance before updating trade licence"

cast send $CUSTOMS_NODE "authoriseReader(address)" $MCIL_NODE \
  --private-key $CUST_KEY --rpc-url $RPC > /dev/null
success "MCIL authorised to read Customs records"

sleep 1
divider

log "STEP 3: MCIL - Reads clearance and updates trade licence"
trade "MCIL confirms shipment cleared, updates import licence record"

CLEARANCE=$(cast call $CUSTOMS_NODE \
  "getRecord(uint256)((bytes32,string,bytes32,uint256,bool))" 0 \
  --from $MCIL_NODE --rpc-url $RPC)
success "MCIL read Customs clearance: $CLEARANCE"

cast send $MCIL_NODE \
  "recordService(bytes32,string,bytes32,bool)" \
  $TRADER_HASH "IMPORT_LICENCE_UPDATED_2025_CATEGORY_B" $TRADE_HASH true \
  --private-key $MCIL_KEY --rpc-url $RPC > /dev/null

MCIL_RECORDS=$(cast call $MCIL_NODE "totalRecords()(uint256)" --rpc-url $RPC)
success "MCIL: Trade licence updated. Records: $MCIL_RECORDS"

sleep 1
divider

log "STEP 4: Grant MOF access to both Customs and MCIL records"
info "MOF needs to see clearance AND licence update before processing duty"

cast send $CUSTOMS_NODE "authoriseReader(address)" $MOF_NODE \
  --private-key $CUST_KEY --rpc-url $RPC > /dev/null
cast send $MCIL_NODE "authoriseReader(address)" $MOF_NODE \
  --private-key $MCIL_KEY --rpc-url $RPC > /dev/null
success "MOF authorised to read Customs and MCIL records"

sleep 1
divider

log "STEP 5: MOF - Reads both records and processes import duty"
trade "MOF confirms clearance and licence, calculates and records duty payment"

CLEARANCE_FOR_MOF=$(cast call $CUSTOMS_NODE \
  "getRecord(uint256)((bytes32,string,bytes32,uint256,bool))" 0 \
  --from $MOF_NODE --rpc-url $RPC)
success "MOF confirmed Customs clearance"

LICENCE_FOR_MOF=$(cast call $MCIL_NODE \
  "getRecord(uint256)((bytes32,string,bytes32,uint256,bool))" 0 \
  --from $MOF_NODE --rpc-url $RPC)
success "MOF confirmed MCIL licence update"

cast send $MOF_NODE \
  "recordService(bytes32,string,bytes32,bool)" \
  $TRADER_HASH "IMPORT_DUTY_PROCESSED_WST_12450" $DUTY_HASH false \
  --private-key $MOF_KEY --rpc-url $RPC > /dev/null

MOF_RECORDS=$(cast call $MOF_NODE "totalRecords()(uint256)" --rpc-url $RPC)
FINAL_NDIDS=$(cast call $NDIDS "serviceCount(bytes32)(uint256)" $TRADER_HASH --rpc-url $RPC)
success "MOF: Duty processed. MOF records: $MOF_RECORDS"
success "NDIDS: Trader verified $FINAL_NDIDS times across all ministries"

sleep 1
divider

log "Complete trade trail on chain:"
trade "Customs:  1 shipment cleared"
trade "MCIL:     1 licence updated"
trade "MOF:      1 duty processed"
trade "NDIDS:    3 identity verifications"
trade "Cross-ministry reads: Customs->MCIL, Customs->MOF, MCIL->MOF"
info "Full single-window workflow completed in one coordinated sequence"
info "All ministry data independently owned but interconnected by permission"

divider
echo -e "${GREEN}"
echo "  ╔═══════════════════════════════════════════════════════╗"
echo "  ║   SCENARIO 6 COMPLETE: Trade Workflow                ║"
echo "  ║                                                       ║"
echo "  ║   Ministries coordinated: 3                          ║"
echo "  ║   Transactions: Clearance, Licence, Duty             ║"
echo "  ║   NDIDS verifications: 3                             ║"
echo "  ║   Single window events: 1                            ║"
echo "  ║                                                       ║"
echo "  ║   UNCTAD 2029 Alignment:                             ║"
echo "  ║   Paperless cross-border trade facilitation          ║"
echo "  ║   demonstrated on blockchain for the first time      ║"
echo "  ║   in Samoa.                                          ║"
echo "  ╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"
