// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NDIDSRegistry.sol";
import "../src/MinistryNode.sol";
import "../src/AIDisbursementTracker.sol";
import "../src/InteroperabilityHub.sol";

/**
 * @title DeploySamoaHub
 * @notice Full deployment script for Samoa Pacific Blockchain Hub
 *
 * Deploys:
 *   - NDIDSRegistry
 *   - AIDisbursementTracker
 *   - InteroperabilityHub
 *   - 6 MinistryNodes (CBS, MCIT, MOF, MCIL, EDUCATION, CUSTOMS)
 *
 * Seeds:
 *   - 25 realistic citizens across 5 sectors
 *   - 5 cross-ministry permission grants
 *   - 1 UNICEF grant with 3 tranches (Tranche 1 released + verified)
 *   - 3 enrolment workflows
 *   - Service records across multiple ministries
 *
 * Usage (Anvil):
 *   forge script script/Deploy.s.sol:DeploySamoaHub \
 *     --rpc-url http://127.0.0.1:8545 \
 *     --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
 *     --broadcast -vvvv
 *
 * Usage (Polygon Mainnet):
 *   forge script script/Deploy.s.sol:DeploySamoaHub \
 *     --rpc-url https://polygon-rpc.com \
 *     --account deployer \
 *     --sender $ADMIN_ADDRESS \
 *     --broadcast --verify \
 *     --etherscan-api-key $POLYGONSCAN_API_KEY \
 *     -vvvv
 */
contract DeploySamoaHub is Script {

    // ── Citizen hashes ─────────────────────────────────────────────
    // In production: hash = keccak256(abi.encodePacked(citizenId, citizenSalt))
    // Salt is held off-chain by citizen — these demo hashes use predictable IDs
    // so the frontend verification demo works (user types the ID, frontend hashes it)

    function _h(string memory id) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(id));
    }

    function run() external {
        address admin = msg.sender;
        vm.startBroadcast();

        // ── 1. Deploy core contracts ──────────────────────────────
        NDIDSRegistry         ndids  = new NDIDSRegistry(admin);
        AIDisbursementTracker aid    = new AIDisbursementTracker(admin);
        InteroperabilityHub   hub    = new InteroperabilityHub(admin);

        // ── 2. Deploy ministry nodes ──────────────────────────────
        MinistryNode cbs       = new MinistryNode("Central Bank of Samoa",                   "CBS",       admin, address(ndids));
        MinistryNode mcit      = new MinistryNode("Ministry of Communications & IT",          "MCIT",      admin, address(ndids));
        MinistryNode mof       = new MinistryNode("Ministry of Finance",                      "MOF",       admin, address(ndids));
        MinistryNode mcil      = new MinistryNode("Ministry of Commerce Industry & Labour",   "MCIL",      admin, address(ndids));
        MinistryNode education = new MinistryNode("Ministry of Education Sports & Culture",   "EDUCATION", admin, address(ndids));
        MinistryNode customs   = new MinistryNode("Ministry of Customs & Revenue",            "CUSTOMS",   admin, address(ndids));

        // ── 3. Wire hub ───────────────────────────────────────────
        hub.setNDIDS(address(ndids));
        hub.setAIDTracker(address(aid));
        hub.registerMinistry("Central Bank of Samoa",                   "CBS",       address(cbs));
        hub.registerMinistry("Ministry of Communications & IT",          "MCIT",      address(mcit));
        hub.registerMinistry("Ministry of Finance",                      "MOF",       address(mof));
        hub.registerMinistry("Ministry of Commerce Industry & Labour",   "MCIL",      address(mcil));
        hub.registerMinistry("Ministry of Education Sports & Culture",   "EDUCATION", address(education));
        hub.registerMinistry("Ministry of Customs & Revenue",            "CUSTOMS",   address(customs));

        // ── 4. Register 25 citizens across 5 sectors ─────────────
        //
        // SECTOR 1: Education (7 children — core UNICEF beneficiaries)
        bytes32[] memory eduHashes = new bytes32[](7);
        eduHashes[0] = _h("SAMOA-EDU-001");  // primary school enrolment
        eduHashes[1] = _h("SAMOA-EDU-002");
        eduHashes[2] = _h("SAMOA-EDU-003");
        eduHashes[3] = _h("SAMOA-EDU-004");
        eduHashes[4] = _h("SAMOA-EDU-005");
        eduHashes[5] = _h("SAMOA-EDU-006");
        eduHashes[6] = _h("SAMOA-EDU-007");
        ndids.batchRegister(eduHashes);

        // SECTOR 2: Banking/CBS (3 citizens — remittance and account holders)
        bytes32[] memory cbsHashes = new bytes32[](3);
        cbsHashes[0] = _h("SAMOA-CBS-001");
        cbsHashes[1] = _h("SAMOA-CBS-002");
        cbsHashes[2] = _h("SAMOA-CBS-003");
        ndids.batchRegister(cbsHashes);

        // SECTOR 3: Trade/Customs (3 traders — customs clearance workflow)
        bytes32[] memory tradeHashes = new bytes32[](3);
        tradeHashes[0] = _h("SAMOA-TRADE-001");
        tradeHashes[1] = _h("SAMOA-TRADE-002");
        tradeHashes[2] = _h("SAMOA-TRADE-003");
        ndids.batchRegister(tradeHashes);

        // SECTOR 4: Social Welfare (5 beneficiaries — MOF benefit recipients)
        bytes32[] memory welfareHashes = new bytes32[](5);
        welfareHashes[0] = _h("SAMOA-WELFARE-001");
        welfareHashes[1] = _h("SAMOA-WELFARE-002");
        welfareHashes[2] = _h("SAMOA-WELFARE-003");
        welfareHashes[3] = _h("SAMOA-WELFARE-004");
        welfareHashes[4] = _h("SAMOA-WELFARE-005");
        ndids.batchRegister(welfareHashes);

        // SECTOR 5: MCIT/Customs/MCIL (7 citizens — business licences and digital)
        bytes32[] memory bizHashes = new bytes32[](7);
        bizHashes[0] = _h("SAMOA-CUSTOMS-001");
        bizHashes[1] = _h("SAMOA-CUSTOMS-002");
        bizHashes[2] = _h("SAMOA-MCIL-001");
        bizHashes[3] = _h("SAMOA-MCIL-002");
        bizHashes[4] = _h("SAMOA-MCIT-001");
        bizHashes[5] = _h("SAMOA-MCIT-002");
        bizHashes[6] = _h("SAMOA-MCIT-003");
        ndids.batchRegister(bizHashes);

        // ── 5. Grant NDIDS read access per sector ─────────────────
        // Education sector — EDUCATION and MOF can verify
        for (uint i = 0; i < 7; i++) {
            ndids.grantReadAccess(eduHashes[i], address(education));
            ndids.grantReadAccess(eduHashes[i], address(mof));
        }
        // Welfare — EDUCATION and MOF
        for (uint i = 0; i < 5; i++) {
            ndids.grantReadAccess(welfareHashes[i], address(education));
            ndids.grantReadAccess(welfareHashes[i], address(mof));
        }
        // CBS sector — CBS and MCIT
        for (uint i = 0; i < 3; i++) {
            ndids.grantReadAccess(cbsHashes[i], address(cbs));
            ndids.grantReadAccess(cbsHashes[i], address(mcit));
        }
        // Trade — CUSTOMS, MCIL, MOF
        for (uint i = 0; i < 3; i++) {
            ndids.grantReadAccess(tradeHashes[i], address(customs));
            ndids.grantReadAccess(tradeHashes[i], address(mcil));
            ndids.grantReadAccess(tradeHashes[i], address(mof));
        }
        // Biz — CUSTOMS, MCIL, MCIT
        ndids.grantReadAccess(bizHashes[0], address(customs));
        ndids.grantReadAccess(bizHashes[1], address(customs));
        ndids.grantReadAccess(bizHashes[2], address(mcil));
        ndids.grantReadAccess(bizHashes[3], address(mcil));
        ndids.grantReadAccess(bizHashes[4], address(mcit));
        ndids.grantReadAccess(bizHashes[5], address(mcit));
        ndids.grantReadAccess(bizHashes[6], address(mcit));

        // ── 6. Cross-ministry read permissions ─────────────────
        education.authoriseReader(address(mof));     // MOF can read Education enrolments
        cbs.authoriseReader(address(mof));           // MOF can read CBS remittance data
        customs.authoriseReader(address(mcil));      // MCIL can read Customs clearances
        cbs.authoriseReader(address(mcit));          // MCIT can read CBS digital records
        mcil.authoriseReader(address(mof));          // MOF can read MCIL trade data

        // ── 7. Seed service records ───────────────────────────────
        bytes32 dummyDataHash = keccak256(abi.encodePacked("demo-document-hash"));

        // Education: enrol 5 children (with NDIDS verification)
        for (uint i = 0; i < 5; i++) {
            education.recordService(eduHashes[i], "SCHOOL_ENROLMENT_2025", dummyDataHash, true);
        }
        // MOF: record benefit eligibility for 4 children (reads Education data)
        for (uint i = 0; i < 4; i++) {
            mof.recordService(eduHashes[i], "EDUCATION_BENEFIT_ELIGIBLE_2025", dummyDataHash, false);
        }
        // CBS: record remittance for 3 citizens
        for (uint i = 0; i < 3; i++) {
            cbs.recordService(cbsHashes[i], "REMITTANCE_RECEIVED", dummyDataHash, true);
        }
        // Customs + MCIL: trade clearance workflow for 2 traders
        for (uint i = 0; i < 2; i++) {
            customs.recordService(tradeHashes[i], "SHIPMENT_CLEARED_2025", dummyDataHash, true);
            mcil.recordService(tradeHashes[i], "TRADE_LICENCE_UPDATED", dummyDataHash, false);
            mof.recordService(tradeHashes[i], "DUTY_PROCESSED", dummyDataHash, false);
        }
        // Welfare: social welfare payments
        for (uint i = 0; i < 3; i++) {
            mof.recordService(welfareHashes[i], "SOCIAL_WELFARE_PAYMENT_2025", dummyDataHash, true);
        }

        // ── 8. Hub workflows (creates WorkflowEvent log entries) ──
        hub.executeEnrolmentWorkflow(eduHashes[0], address(education), address(mof), dummyDataHash);
        hub.executeEnrolmentWorkflow(eduHashes[1], address(education), address(mof), dummyDataHash);
        hub.executeEnrolmentWorkflow(eduHashes[2], address(education), address(mof), dummyDataHash);

        // ── 9. Create UNICEF grant ────────────────────────────────
        string[] memory milestones = new string[](3);
        milestones[0] = "Programme setup and capacity training complete";
        milestones[1] = "50 children enrolled with verified attendance records";
        milestones[2] = "End-of-term learning outcomes documented and verified";

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 30000;
        amounts[1] = 40000;
        amounts[2] = 30000;

        uint256 grantId = aid.createGrant(
            "UNICEF Samoa Education Access Programme 2025",
            admin,      // donor (UNICEF address in production)
            address(education),
            100000,     // total
            50,         // target beneficiaries
            "EDUCATION",
            milestones,
            amounts
        );

        // Authorise the education node as a field verifier
        aid.authoriseVerifier(address(education));
        aid.authoriseVerifier(admin);

        // Release and verify Tranche 1 (shows completed milestone)
        aid.releaseTranche(grantId, 0);
        aid.verifyUsage(grantId, 0,
            keccak256(abi.encodePacked("field-report-tranche-1-samoa-2025")),
            0   // beneficiaries enrolled in setup phase
        );

        // Release Tranche 2 (awaiting field verification — realistic demo state)
        aid.releaseTranche(grantId, 1);
        // NOTE: Tranche 2 verifyUsage NOT called — realistic: funds released, awaiting field report
        // Tranche 3 NOT released — awaiting milestone achievement

        vm.stopBroadcast();

        // ── Print addresses for copy-paste into App.jsx ───────────
        console.log("=== DEPLOYMENT COMPLETE ===");
        console.log("NDIDSRegistry:        ", address(ndids));
        console.log("AIDisbursementTracker:", address(aid));
        console.log("InteroperabilityHub:  ", address(hub));
        console.log("CBS:                  ", address(cbs));
        console.log("MCIT:                 ", address(mcit));
        console.log("MOF:                  ", address(mof));
        console.log("MCIL:                 ", address(mcil));
        console.log("EDUCATION:            ", address(education));
        console.log("CUSTOMS:              ", address(customs));
        console.log("");
        console.log("Citizens registered:  25");
        console.log("Permissions granted:  5");
        console.log("Service records:      ~20");
        console.log("Grant status:         Tranche 1 Verified, Tranche 2 Released, Tranche 3 Pending");
        console.log("");
        console.log("Update ADDR in frontend/src/App.jsx with these addresses if different from above.");
    }
}
