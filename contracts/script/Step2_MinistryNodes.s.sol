// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/NDIDSRegistry.sol";
import "../src/MinistryNode.sol";
import "../src/InteroperabilityHub.sol";

/**
 * @title Step2_MinistryNodes
 * @notice Deploys 6 ministry nodes — 6 transactions total
 *
 * Requires Step 1 to be complete. Set in .env first:
 *   NDIDS_ADDRESS=0x...
 *   HUB_ADDRESS=0x...
 *
 * Run second:
 *   forge script script/Step2_MinistryNodes.s.sol:Step2_MinistryNodes \
 *     --rpc-url $AMOY_RPC_URL \
 *     --account deployer \
 *     --sender $ADMIN_ADDRESS \
 *     --broadcast \
 *     --verify \
 *     --with-gas-price 50gwei \
 *     -vvvv
 *
 * SAVE THE OUTPUT ADDRESSES — needed for Step 3
 */
contract Step2_MinistryNodes is Script {
    function run() external {
        address adminAddr  = vm.envAddress("ADMIN_ADDRESS");
        address ndidsAddr  = vm.envAddress("NDIDS_ADDRESS");

        vm.startBroadcast();

        MinistryNode cbsNode = new MinistryNode(
            "Central Bank of Samoa", "CBS", adminAddr, ndidsAddr
        );
        MinistryNode mcitNode = new MinistryNode(
            "Ministry of Communications and Information Technology", "MCIT", adminAddr, ndidsAddr
        );
        MinistryNode mofNode = new MinistryNode(
            "Ministry of Finance", "MOF", adminAddr, ndidsAddr
        );
        MinistryNode mcilNode = new MinistryNode(
            "Ministry of Commerce Industry and Labour", "MCIL", adminAddr, ndidsAddr
        );
        MinistryNode educationNode = new MinistryNode(
            "Ministry of Education Sports and Culture", "EDUCATION", adminAddr, ndidsAddr
        );
        MinistryNode customsNode = new MinistryNode(
            "Ministry of Customs and Revenue", "CUSTOMS", adminAddr, ndidsAddr
        );

        vm.stopBroadcast();

        console.log("=== STEP 2 COMPLETE -SAVE THESE ADDRESSES ===");
        console.log("CBS:       ", address(cbsNode));
        console.log("MCIT:      ", address(mcitNode));
        console.log("MOF:       ", address(mofNode));
        console.log("MCIL:      ", address(mcilNode));
        console.log("EDUCATION: ", address(educationNode));
        console.log("CUSTOMS:   ", address(customsNode));
        console.log("");
        console.log("Now add these to your .env before running Step 3:");
        console.log("CBS_ADDRESS=",       address(cbsNode));
        console.log("MCIT_ADDRESS=",      address(mcitNode));
        console.log("MOF_ADDRESS=",       address(mofNode));
        console.log("MCIL_ADDRESS=",      address(mcilNode));
        console.log("EDUCATION_ADDRESS=", address(educationNode));
        console.log("CUSTOMS_ADDRESS=",   address(customsNode));
    }
}
