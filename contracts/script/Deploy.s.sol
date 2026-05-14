// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/NDIDSRegistry.sol";
import "../src/MinistryNode.sol";
import "../src/AIDisbursementTracker.sol";
import "../src/InteroperabilityHub.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/**
 * @title DeploySamoaHub
 * @notice Full deployment script for Samoa Pacific Blockchain Hub
 *
 * Deploys (all via UUPS ERC1967Proxy):
 *   - NDIDSRegistry
 *   - AIDisbursementTracker
 *   - InteroperabilityHub
 *   - 7 MinistryNodes (CBS, MCIT, MOF, MCIL, EDUCATION, CUSTOMS, SBS)
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
 *     --private-key <ANVIL_TEST_KEY> \
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
    function _h(string memory id) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(id));
    }

    function run() external {
    vm.startBroadcast();
    address admin = msg.sender;

        // ── 1. Deploy core contracts via UUPS proxy ───────────────

        NDIDSRegistry ndids;
        {
            NDIDSRegistry impl = new NDIDSRegistry();
            bytes memory initData = abi.encodeWithSelector(NDIDSRegistry.initialize.selector, admin);
            ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
            ndids = NDIDSRegistry(address(proxy));
        }

        AIDisbursementTracker aid;
        {
            AIDisbursementTracker impl = new AIDisbursementTracker();
            bytes memory initData = abi.encodeWithSelector(AIDisbursementTracker.initialize.selector, admin);
            ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
            aid = AIDisbursementTracker(address(proxy));
        }

        InteroperabilityHub hub;
        {
            InteroperabilityHub impl = new InteroperabilityHub();
            bytes memory initData = abi.encodeWithSelector(InteroperabilityHub.initialize.selector, admin);
            ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
            hub = InteroperabilityHub(address(proxy));
        }

        // ── 2. Deploy ministry nodes via UUPS proxy ───────────────

        MinistryNode cbs;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory initData = abi.encodeWithSelector(MinistryNode.initialize.selector, "Central Bank of Samoa", "CBS", admin, address(ndids));
            ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
            cbs = MinistryNode(address(proxy));
        }

        MinistryNode mcit;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory initData = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Communications & IT", "MCIT", admin, address(ndids));
            ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
            mcit = MinistryNode(address(proxy));
        }

        MinistryNode mof;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory initData = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Finance", "MOF", admin, address(ndids));
            ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
            mof = MinistryNode(address(proxy));
        }

        MinistryNode mcil;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory initData = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Commerce Industry & Labour", "MCIL", admin, address(ndids));
            ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
            mcil = MinistryNode(address(proxy));
        }

        MinistryNode education;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory initData = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Education Sports & Culture", "EDUCATION", admin, address(ndids));
            ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
            education = MinistryNode(address(proxy));
        }

        MinistryNode customs;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory initData = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Customs & Revenue", "CUSTOMS", admin, address(ndids));
            ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
            customs = MinistryNode(address(proxy));
        }

        MinistryNode sbs;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory initData = abi.encodeWithSelector(MinistryNode.initialize.selector, "Samoa Bureau of Statistics", "SBS", admin, address(ndids));
            ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
            sbs = MinistryNode(address(proxy));
        }

        // ── 3. Wire hub ───────────────────────────────────────────
        hub.setNDIDS(address(ndids));
        hub.setAIDTracker(address(aid));
        hub.registerMinistry("Central Bank of Samoa",                   "CBS",       address(cbs));
        hub.registerMinistry("Ministry of Communications & IT",          "MCIT",      address(mcit));
        hub.registerMinistry("Ministry of Finance",                      "MOF",       address(mof));
        hub.registerMinistry("Ministry of Commerce Industry & Labour",   "MCIL",      address(mcil));
        hub.registerMinistry("Ministry of Education Sports & Culture",   "EDUCATION", address(education));
        hub.registerMinistry("Ministry of Customs & Revenue",            "CUSTOMS",   address(customs));
        hub.registerMinistry("Samoa Bureau of Statistics",               "SBS",       address(sbs));

        cbs.setHub(address(hub));
        mcit.setHub(address(hub));
        mof.setHub(address(hub));
        mcil.setHub(address(hub));
        education.setHub(address(hub));
        customs.setHub(address(hub));
        sbs.setHub(address(hub));

        // ── 4. Register 25 citizens across 5 sectors ─────────────

        bytes32[] memory eduHashes = new bytes32[](7);
        eduHashes[0] = _h("SAMOA-EDU-001");
        eduHashes[1] = _h("SAMOA-EDU-002");
        eduHashes[2] = _h("SAMOA-EDU-003");
        eduHashes[3] = _h("SAMOA-EDU-004");
        eduHashes[4] = _h("SAMOA-EDU-005");
        eduHashes[5] = _h("SAMOA-EDU-006");
        eduHashes[6] = _h("SAMOA-EDU-007");
        ndids.batchRegister(eduHashes);

        bytes32[] memory cbsHashes = new bytes32[](3);
        cbsHashes[0] = _h("SAMOA-CBS-001");
        cbsHashes[1] = _h("SAMOA-CBS-002");
        cbsHashes[2] = _h("SAMOA-CBS-003");
        ndids.batchRegister(cbsHashes);

        bytes32[] memory tradeHashes = new bytes32[](3);
        tradeHashes[0] = _h("SAMOA-TRADE-001");
        tradeHashes[1] = _h("SAMOA-TRADE-002");
        tradeHashes[2] = _h("SAMOA-TRADE-003");
        ndids.batchRegister(tradeHashes);

        bytes32[] memory welfareHashes = new bytes32[](5);
        welfareHashes[0] = _h("SAMOA-WELFARE-001");
        welfareHashes[1] = _h("SAMOA-WELFARE-002");
        welfareHashes[2] = _h("SAMOA-WELFARE-003");
        welfareHashes[3] = _h("SAMOA-WELFARE-004");
        welfareHashes[4] = _h("SAMOA-WELFARE-005");
        ndids.batchRegister(welfareHashes);

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
        for (uint i = 0; i < 7; i++) {
            ndids.grantReadAccess(eduHashes[i], address(education));
            ndids.grantReadAccess(eduHashes[i], address(mof));
        }
        for (uint i = 0; i < 5; i++) {
            ndids.grantReadAccess(welfareHashes[i], address(education));
            ndids.grantReadAccess(welfareHashes[i], address(mof));
        }
        for (uint i = 0; i < 3; i++) {
            ndids.grantReadAccess(cbsHashes[i], address(cbs));
            ndids.grantReadAccess(cbsHashes[i], address(mcit));
        }
        for (uint i = 0; i < 3; i++) {
            ndids.grantReadAccess(tradeHashes[i], address(customs));
            ndids.grantReadAccess(tradeHashes[i], address(mcil));
            ndids.grantReadAccess(tradeHashes[i], address(mof));
        }
        ndids.grantReadAccess(bizHashes[0], address(customs));
        ndids.grantReadAccess(bizHashes[1], address(customs));
        ndids.grantReadAccess(bizHashes[2], address(mcil));
        ndids.grantReadAccess(bizHashes[3], address(mcil));
        ndids.grantReadAccess(bizHashes[4], address(mcit));
        ndids.grantReadAccess(bizHashes[5], address(mcit));
        ndids.grantReadAccess(bizHashes[6], address(mcit));

        // ── 6. Cross-ministry read permissions ─────────────────
        education.authoriseReader(address(mof));
        cbs.authoriseReader(address(mof));
        customs.authoriseReader(address(mcil));
        cbs.authoriseReader(address(mcit));
        mcil.authoriseReader(address(mof));

        // ── 7. Seed service records ───────────────────────────────
        bytes32 dummyDataHash = keccak256(abi.encodePacked("demo-document-hash"));

        for (uint i = 0; i < 5; i++) {
            education.recordService(eduHashes[i], "EDUCATION_ENROLMENT", dummyDataHash, true);
        }
        for (uint i = 0; i < 4; i++) {
            mof.recordService(eduHashes[i], "MOF_PAYMENT", dummyDataHash, false);
        }
        for (uint i = 0; i < 3; i++) {
            cbs.recordService(cbsHashes[i], "CBS_REGISTRATION", dummyDataHash, true);
        }
        for (uint i = 0; i < 2; i++) {
            customs.recordService(tradeHashes[i], "CUSTOMS_CLEARANCE", dummyDataHash, true);
            mcil.recordService(tradeHashes[i], "MCIL_LABOUR", dummyDataHash, false);
            mof.recordService(tradeHashes[i], "MOF_PAYMENT", dummyDataHash, false);
        }
        for (uint i = 0; i < 3; i++) {
            mof.recordService(welfareHashes[i], "MOF_PAYMENT", dummyDataHash, true);
        }

        // ── 8. Hub workflows ──────────────────────────────────────
        hub.executeEnrollmentWorkflow(eduHashes[0], address(education), address(mof), dummyDataHash);
        hub.executeEnrollmentWorkflow(eduHashes[1], address(education), address(mof), dummyDataHash);
        hub.executeEnrollmentWorkflow(eduHashes[2], address(education), address(mof), dummyDataHash);

        // ── 9. Create UNICEF grant ────────────────────────────────
        string[] memory milestones = new string[](3);
        milestones[0] = "Programme setup and capacity training complete";
        milestones[1] = "50 children enrolled with verified attendance records";
        milestones[2] = "End-of-term learning outcomes documented and verified";

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1000;
        amounts[1] = 1500;
        amounts[2] = 2000;
        uint256 grantId = aid.createGrant(
            bytes32("WST"),
            uint8(2),
            address(education),
            "UNICEF Education Programme - Samoa 2026",
            amounts
        );

        aid.authoriseVerifier(address(education));
        aid.authoriseVerifier(admin);

        aid.releaseTranche(grantId, 0);
        aid.verifyUsage(grantId, 0,
            keccak256(abi.encodePacked("field-report-tranche-1-samoa-2025")),
            0
        );

        aid.releaseTranche(grantId, 1);

        vm.stopBroadcast();

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
        console.log("SBS:                  ", address(sbs));
        console.log("");
        console.log("Citizens registered:  25");
        console.log("Permissions granted:  5");
        console.log("Service records:      ~20");
        console.log("Grant status:         Tranche 1 Verified, Tranche 2 Released, Tranche 3 Pending");
        console.log("");
        console.log("Update ADDR in frontend/src/App.jsx with these addresses if different from above.");
    }
}
