// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/NDIDSRegistry.sol";
import "../src/AIDisbursementTracker.sol";
import "../src/InteroperabilityHub.sol";

/**
 * @title Step1_CoreContracts
 * @notice Deploys the 3 core contracts — 3 transactions total
 *
 * Run first:
 *   forge script script/Step1_CoreContracts.s.sol:Step1_CoreContracts \
 *     --rpc-url $AMOY_RPC_URL \
 *     --account deployer \
 *     --sender $ADMIN_ADDRESS \
 *     --broadcast \
 *     --verify \
 *     --with-gas-price 50gwei \
 *     -vvvv
 *
 * SAVE THE OUTPUT ADDRESSES — needed for Step 2 and Step 3
 */
contract Step1_CoreContracts is Script {
    function run() external {
        address adminAddr = vm.envAddress("ADMIN_ADDRESS");
        vm.startBroadcast();
        // DEPLOY-2: Address determinism via CREATE2 is the
        // correct fix. vm.setNonce removed — it is fragile
        // and environment-dependent.
        // TODO: Implement CREATE2 factory deployment for
        // production. See aud

        NDIDSRegistry ndids = new NDIDSRegistry(adminAddr);
        AIDisbursementTracker aidTracker = new AIDisbursementTracker(adminAddr);
        InteroperabilityHub hub = new InteroperabilityHub(adminAddr);

        vm.stopBroadcast();

        console.log("=== STEP 1 COMPLETE -SAVE THESE ADDRESSES ===");
        console.log("NDIDS:   ", address(ndids));
        console.log("AID:     ", address(aidTracker));
        console.log("HUB:     ", address(hub));
        console.log("");
        console.log("Now set these in your .env before running Step 2:");
        console.log("NDIDS_ADDRESS=", address(ndids));
        console.log("AID_ADDRESS=",   address(aidTracker));
        console.log("HUB_ADDRESS=",   address(hub));
    }
}
