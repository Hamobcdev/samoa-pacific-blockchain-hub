#!/bin/bash
# =============================================================================
# MASTER DEMO RUNNER
# Samoa Pacific Blockchain Hub - UNICEF Venture Fund 2026
# Synergy Blockchain Pacific
#
# Runs all 6 scenarios in sequence or individually
# =============================================================================

RPC="http://127.0.0.1:8545"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

divider() { echo -e "\n${BLUE}══════════════════════════════════════════════════════════${NC}\n"; }

show_menu() {
  clear
  echo -e "${BLUE}"
  echo "  ╔══════════════════════════════════════════════════════════╗"
  echo "  ║   SAMOA PACIFIC BLOCKCHAIN HUB                          ║"
  echo "  ║   UNICEF Venture Fund 2026 - Technical Demo             ║"
  echo "  ║   Synergy Blockchain Pacific                            ║"
  echo "  ╠══════════════════════════════════════════════════════════╣"
  echo "  ║                                                          ║"
  echo "  ║   [1]  Scenario 1: Cross-Ministry Data Sharing          ║"
  echo "  ║   [2]  Scenario 2: Full Citizen Journey                 ║"
  echo "  ║   [3]  Scenario 3: AID Grant Full Lifecycle             ║"
  echo "  ║   [4]  Scenario 4: Privacy Demonstration                ║"
  echo "  ║   [5]  Scenario 5: Permission Revocation                ║"
  echo "  ║   [6]  Scenario 6: Multi-Ministry Trade Workflow        ║"
  echo "  ║   [A]  Run ALL scenarios in sequence                    ║"
  echo "  ║   [T]  Run Foundry integration test suite               ║"
  echo "  ║   [Q]  Quit                                             ║"
  echo "  ║                                                          ║"
  echo "  ╚══════════════════════════════════════════════════════════╝"
  echo -e "${NC}"
  echo -n "  Select scenario [1-6, A, T, Q]: "
}

run_foundry_tests() {
  echo -e "${YELLOW}Running full Foundry integration test suite...${NC}"
  cd "$SCRIPT_DIR/.."
  forge test --match-contract SamoaIntegrationScenarios -vv
  echo -e "${GREEN}Test suite complete.${NC}"
}

run_all() {
  echo -e "${YELLOW}Running all 6 scenarios in sequence...${NC}"
  for i in 1 2 3 4 5 6; do
    divider
    run_scenario $i
    echo -e "\n${GREEN}Scenario $i complete. Press Enter to continue...${NC}"
    read
  done
  divider
  echo -e "${GREEN}"
  echo "  ALL 6 SCENARIOS COMPLETE"
  echo "  Samoa Pacific Blockchain Hub - Full demonstration finished"
  echo -e "${NC}"
}

run_scenario() {
  case $1 in
    1) bash "$SCRIPT_DIR/scenario1_cross_ministry.sh" ;;
    2) bash "$SCRIPT_DIR/scenario2_citizen_journey.sh" ;;
    3) bash "$SCRIPT_DIR/scenario3_aid_lifecycle.sh" ;;
    4) bash "$SCRIPT_DIR/scenario4_privacy.sh" ;;
    5) bash "$SCRIPT_DIR/scenario5_revocation.sh" ;;
    6) bash "$SCRIPT_DIR/scenario6_trade_workflow.sh" ;;
  esac
}

# If argument passed, run directly
if [ "$1" != "" ]; then
  case "$1" in
    all|ALL|A) run_all ;;
    test|TEST|T) run_foundry_tests ;;
    *) run_scenario "$1" ;;
  esac
  exit 0
fi

# Interactive menu
while true; do
  show_menu
  read choice
  case $choice in
    1|2|3|4|5|6) run_scenario $choice ;;
    A|a) run_all ;;
    T|t) run_foundry_tests ;;
    Q|q) echo ""; exit 0 ;;
    *) echo -e "${YELLOW}Invalid choice${NC}" ;;
  esac
  echo -e "\n${GREEN}Press Enter to return to menu...${NC}"
  read
done
