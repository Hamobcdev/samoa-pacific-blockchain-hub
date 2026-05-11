// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/NDIDSRegistry.sol";
import "../src/MinistryNode.sol";
import "../src/InteroperabilityHub.sol";

/**
 * @title Step2_MinistryNodes
 * @notice Deploys 6 ministry nodes — 6 transactions total.
 *         Each node receives its own dedicated admin key so that
 *         a single compromised key cannot control all ministries.
 *
 * Requires Step 1 to be complete. Set in .env first:
 *   NDIDS_ADDRESS=0x...
 *   HUB_ADDRESS=0x...      (not used here, kept for Step 3)
 *
 *   # Per-ministry admin addresses (must be distinct, non-zero)
 *   ADMIN_CBS=0x...
 *   ADMIN_MCIT=0x...
 *   ADMIN_MOF=0x...
 *   ADMIN_MCIL=0x...
 *   ADMIN_EDUCATION=0x...
 *   ADMIN_CUSTOMS=0x...
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
        address ndidsAddr = vm.envAddress("NDIDS_ADDRESS");

        // Load per-ministry admin addresses — each ministry gets a dedicated key.
        // If any variable is missing or zero the script reverts here with a clear message
        // rather than silently deploying with a bad admin.
        address adminCbs       = vm.envOr("ADMIN_CBS",       address(0));
        address adminMcit      = vm.envOr("ADMIN_MCIT",      address(0));
        address adminMof       = vm.envOr("ADMIN_MOF",       address(0));
        address adminMcil      = vm.envOr("ADMIN_MCIL",      address(0));
        address adminEducation = vm.envOr("ADMIN_EDUCATION", address(0));
        address adminCustoms   = vm.envOr("ADMIN_CUSTOMS",   address(0));
        address adminSbs       = vm.envOr("ADMIN_SBS",       address(0));

        require(adminCbs       != address(0), "Missing env var: ADMIN_CBS");
        require(adminMcit      != address(0), "Missing env var: ADMIN_MCIT");
        require(adminMof       != address(0), "Missing env var: ADMIN_MOF");
        require(adminMcil      != address(0), "Missing env var: ADMIN_MCIL");
        require(adminEducation != address(0), "Missing env var: ADMIN_EDUCATION");
        require(adminCustoms   != address(0), "Missing env var: ADMIN_CUSTOMS");
        require(adminSbs       != address(0), "Missing env var: ADMIN_SBS");

        vm.startBroadcast();

        MinistryNode cbsNode = new MinistryNode(
            "Central Bank of Samoa", "CBS", adminCbs, ndidsAddr
        );
        MinistryNode mcitNode = new MinistryNode(
            "Ministry of Communications and Information Technology", "MCIT", adminMcit, ndidsAddr
        );
        MinistryNode mofNode = new MinistryNode(
            "Ministry of Finance", "MOF", adminMof, ndidsAddr
        );
        MinistryNode mcilNode = new MinistryNode(
            "Ministry of Commerce Industry and Labour", "MCIL", adminMcil, ndidsAddr
        );
        MinistryNode educationNode = new MinistryNode(
            "Ministry of Education Sports and Culture", "EDUCATION", adminEducation, ndidsAddr
        );
        MinistryNode customsNode = new MinistryNode(
            "Ministry of Customs and Revenue", "CUSTOMS", adminCustoms, ndidsAddr
        );
        MinistryNode sbsNode = new MinistryNode(
            "Samoa Bureau of Statistics", "SBS", adminSbs, ndidsAddr
        );

        vm.stopBroadcast();

        console.log("=== STEP 2 COMPLETE - SAVE THESE ADDRESSES ===");
        console.log("CBS:       ", address(cbsNode));
        console.log("MCIT:      ", address(mcitNode));
        console.log("MOF:       ", address(mofNode));
        console.log("MCIL:      ", address(mcilNode));
        console.log("EDUCATION: ", address(educationNode));
        console.log("CUSTOMS:   ", address(customsNode));
        console.log("SBS:       ", address(sbsNode));
        console.log("");
        console.log("Ministry admins:");
        console.log("  CBS admin:       ", adminCbs);
        console.log("  MCIT admin:      ", adminMcit);
        console.log("  MOF admin:       ", adminMof);
        console.log("  MCIL admin:      ", adminMcil);
        console.log("  EDUCATION admin: ", adminEducation);
        console.log("  CUSTOMS admin:   ", adminCustoms);
        console.log("  SBS admin:       ", adminSbs);
        console.log("");
        console.log("Now add these to your .env before running Step 3:");
        console.log("CBS_ADDRESS=",       address(cbsNode));
        console.log("MCIT_ADDRESS=",      address(mcitNode));
        console.log("MOF_ADDRESS=",       address(mofNode));
        console.log("MCIL_ADDRESS=",      address(mcilNode));
        console.log("EDUCATION_ADDRESS=", address(educationNode));
        console.log("CUSTOMS_ADDRESS=",   address(customsNode));
        console.log("SBS_ADDRESS=",       address(sbsNode));
    }
}
