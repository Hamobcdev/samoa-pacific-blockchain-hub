// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NDIDSRegistry.sol";
import "../src/MinistryNode.sol";
import "../src/AIDisbursementTracker.sol";
import "../src/InteroperabilityHub.sol";

/**
 * @title DeploySamoaHub
 * @notice Deploys the full Samoa Government Interoperability PoC to Polygon Amoy testnet
 *
 * Usage:
 *   forge script script/Deploy.s.sol:DeploySamoaHub \
 *     --rpc-url $AMOY_RPC_URL \
 *     --broadcast \
 *     --verify \
 *     -vvvv
 *
 * Set in .env:
 *   ADMIN_ADDRESS=0x...
 *   AMOY_RPC_URL=https://rpc-amoy.polygon.technology
 *   PRIVATE_KEY=0x...
 *   POLYGONSCAN_API_KEY=...
 */
contract DeploySamoaHub is Script {

    function run() external {
        address adminAddr = vm.envAddress("ADMIN_ADDRESS");
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);

        // 1. Deploy NDIDS Registry (Samoa Bureau of Statistics / MCIT authority)
        NDIDSRegistry ndids = new NDIDSRegistry(adminAddr);
        console.log("NDIDSRegistry deployed at:      ", address(ndids));

        // 2. Deploy AID Disbursement Tracker
        AIDisbursementTracker aidTracker = new AIDisbursementTracker(adminAddr);
        console.log("AIDisbursementTracker deployed: ", address(aidTracker));

        // 3. Deploy Interoperability Hub
        InteroperabilityHub hub = new InteroperabilityHub(adminAddr);
        console.log("InteroperabilityHub deployed:   ", address(hub));

        // 4. Deploy Ministry Nodes
        MinistryNode cbsNode = new MinistryNode(
            "Central Bank of Samoa", "CBS", adminAddr, address(ndids)
        );
        console.log("CBS Node deployed:              ", address(cbsNode));

        MinistryNode mcitNode = new MinistryNode(
            "Ministry of Communications and Information Technology", "MCIT", adminAddr, address(ndids)
        );
        console.log("MCIT Node deployed:             ", address(mcitNode));

        MinistryNode mofNode = new MinistryNode(
            "Ministry of Finance", "MOF", adminAddr, address(ndids)
        );
        console.log("MOF Node deployed:              ", address(mofNode));

        MinistryNode mcilNode = new MinistryNode(
            "Ministry of Commerce Industry and Labour", "MCIL", adminAddr, address(ndids)
        );
        console.log("MCIL Node deployed:             ", address(mcilNode));

        MinistryNode educationNode = new MinistryNode(
            "Ministry of Education Sports and Culture", "EDUCATION", adminAddr, address(ndids)
        );
        console.log("Education Node deployed:        ", address(educationNode));

        MinistryNode customsNode = new MinistryNode(
            "Ministry of Customs and Revenue", "CUSTOMS", adminAddr, address(ndids)
        );
        console.log("Customs Node deployed:          ", address(customsNode));

        // 5. Wire Hub
        hub.setNDIDS(address(ndids));
        hub.setAIDTracker(address(aidTracker));

        hub.registerMinistry("Central Bank of Samoa",                        "CBS",       address(cbsNode));
        hub.registerMinistry("Ministry of Comms and IT",                     "MCIT",      address(mcitNode));
        hub.registerMinistry("Ministry of Finance",                          "MOF",       address(mofNode));
        hub.registerMinistry("Ministry of Commerce Industry and Labour",     "MCIL",      address(mcilNode));
        hub.registerMinistry("Ministry of Education Sports and Culture",     "EDUCATION", address(educationNode));
        hub.registerMinistry("Ministry of Customs and Revenue",              "CUSTOMS",   address(customsNode));

        // 6. Seed demo data for UNICEF PoC presentation
        _seedDemoData(adminAddr, ndids, aidTracker, educationNode, mofNode);

        vm.stopBroadcast();

        // 7. Output deployment manifest for frontend
        console.log("\n=== DEPLOYMENT MANIFEST (paste into frontend/src/contracts.ts) ===");
        console.log("NDIDS_ADDRESS=",           address(ndids));
        console.log("HUB_ADDRESS=",             address(hub));
        console.log("AID_TRACKER_ADDRESS=",     address(aidTracker));
        console.log("CBS_NODE_ADDRESS=",        address(cbsNode));
        console.log("MCIT_NODE_ADDRESS=",       address(mcitNode));
        console.log("MOF_NODE_ADDRESS=",        address(mofNode));
        console.log("EDUCATION_NODE_ADDRESS=",  address(educationNode));
        console.log("CUSTOMS_NODE_ADDRESS=",    address(customsNode));
    }

    function _seedDemoData(
        address admin,
        NDIDSRegistry ndids,
        AIDisbursementTracker aidTracker,
        MinistryNode educationNode,
        MinistryNode mofNode
    ) internal {
        // Register 5 demo citizens (hashes — no PII on chain)
        bytes32[5] memory citizens;
        for (uint i = 0; i < 5; i++) {
            citizens[i] = keccak256(abi.encodePacked("SAMOA_DEMO_CITIZEN_", i, "_SALT"));
            ndids.registerCitizen(citizens[i]);
            ndids.grantReadAccess(citizens[i], address(educationNode));
            ndids.grantReadAccess(citizens[i], address(mofNode));
        }
        console.log("Demo citizens registered: 5");

        // Create a demo UNICEF grant
        string[] memory milestones = new string[](3);
        milestones[0] = "Programme setup and capacity training complete";
        milestones[1] = "50 children enrolled with verified attendance records";
        milestones[2] = "End-of-term outcomes documented and verified";

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 30_000;   // simplified units for demo
        amounts[1] = 40_000;
        amounts[2] = 30_000;

        aidTracker.createGrant(
            "UNICEF Samoa Education Access Programme 2025",
            address(0xUNICEF000000000000000000000000000000000001),
            address(educationNode),
            100_000,
            50,
            "EDUCATION",
            milestones,
            amounts
        );
        console.log("Demo UNICEF grant created: grant #0");

        // Release first tranche (demo state)
        aidTracker.releaseTranche(0, 0);
        console.log("Demo: Tranche 0 released (programme setup milestone)");
    }
}
