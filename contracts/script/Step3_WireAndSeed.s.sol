// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NDIDSRegistry.sol";
import "../src/MinistryNode.sol";
import "../src/AIDisbursementTracker.sol";
import "../src/InteroperabilityHub.sol";

/**
 * @title Step3_WireAndSeed
 * @notice Wires the hub, registers ministries, seeds demo data — 8 transactions
 *
 * Requires Steps 1 and 2 complete. All addresses must be set in .env:
 *   NDIDS_ADDRESS, AID_ADDRESS, HUB_ADDRESS,
 *   CBS_ADDRESS, MCIT_ADDRESS, MOF_ADDRESS,
 *   MCIL_ADDRESS, EDUCATION_ADDRESS, CUSTOMS_ADDRESS
 *
 * Run third:
 *   forge script script/Step3_WireAndSeed.s.sol:Step3_WireAndSeed \
 *     --rpc-url $AMOY_RPC_URL \
 *     --account deployer \
 *     --sender $ADMIN_ADDRESS \
 *     --broadcast \
 *     --with-gas-price 50gwei \
 *     -vvvv
 */
contract Step3_WireAndSeed is Script {
    function run() external {
        address adminAddr      = vm.envAddress("ADMIN_ADDRESS");
        address ndidsAddr      = vm.envAddress("NDIDS_ADDRESS");
        address aidAddr        = vm.envAddress("AID_ADDRESS");
        address hubAddr        = vm.envAddress("HUB_ADDRESS");
        address cbsAddr        = vm.envAddress("CBS_ADDRESS");
        address mcitAddr       = vm.envAddress("MCIT_ADDRESS");
        address mofAddr        = vm.envAddress("MOF_ADDRESS");
        address mcilAddr       = vm.envAddress("MCIL_ADDRESS");
        address educationAddr  = vm.envAddress("EDUCATION_ADDRESS");
        address customsAddr    = vm.envAddress("CUSTOMS_ADDRESS");

        NDIDSRegistry         ndids      = NDIDSRegistry(ndidsAddr);
        AIDisbursementTracker aidTracker = AIDisbursementTracker(aidAddr);
        InteroperabilityHub   hub        = InteroperabilityHub(hubAddr);
        MinistryNode          eduNode    = MinistryNode(educationAddr);

        vm.startBroadcast();

        // Tx 1: Wire NDIDS into hub
        hub.setNDIDS(ndidsAddr);

        // Tx 2: Wire AID tracker into hub
        hub.setAIDTracker(aidAddr);

        // Tx 3: Register all 6 ministries (single tx — internal loop)
        hub.registerMinistry("Central Bank of Samoa",                    "CBS",       cbsAddr);
        hub.registerMinistry("Ministry of Comms and IT",                 "MCIT",      mcitAddr);
        hub.registerMinistry("Ministry of Finance",                      "MOF",       mofAddr);
        hub.registerMinistry("Ministry of Commerce Industry and Labour", "MCIL",      mcilAddr);
        hub.registerMinistry("Ministry of Education Sports and Culture", "EDUCATION", educationAddr);
        hub.registerMinistry("Ministry of Customs and Revenue",          "CUSTOMS",   customsAddr);

        // Tx 4-8: Seed 5 demo citizens with Education node access
        for (uint256 i = 0; i < 5; i++) {
            bytes32 h = keccak256(abi.encodePacked("SAMOA_DEMO_CITIZEN_", i));
            ndids.registerCitizen(h);
            ndids.grantReadAccess(h, educationAddr);
        }

        // Tx 9: Create UNICEF demo grant
        string[] memory milestones = new string[](3);
        milestones[0] = "Programme setup and capacity training complete";
        milestones[1] = "50 children enrolled with verified attendance";
        milestones[2] = "End-of-term outcomes documented and verified";

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 30000;
        amounts[1] = 40000;
        amounts[2] = 30000;

        aidTracker.createGrant(
            "UNICEF Samoa Education Access Programme 2025",
            address(0x000000000000000000000000000000000000dEaD),
            educationAddr,
            100000,
            50,
            "EDUCATION",
            milestones,
            amounts
        );

        // Tx 10: Release first tranche
        aidTracker.releaseTranche(0, 0);

        vm.stopBroadcast();

        console.log("=== STEP 3 COMPLETE - FULL DEPLOYMENT DONE ===");
        console.log("");
        console.log("=== PASTE INTO frontend/src/contracts.js ===");
        console.log("NDIDS:     ", ndidsAddr);
        console.log("HUB:       ", hubAddr);
        console.log("AID:       ", aidAddr);
        console.log("CBS:       ", cbsAddr);
        console.log("MCIT:      ", mcitAddr);
        console.log("MOF:       ", mofAddr);
        console.log("EDUCATION: ", educationAddr);
        console.log("CUSTOMS:   ", customsAddr);
        console.log("");
        console.log("Verify on Polygonscan:");
        console.log("https://amoy.polygonscan.com/address/", hubAddr);

        // Suppress unused variable warning
        adminAddr;
        eduNode;
    }
}
