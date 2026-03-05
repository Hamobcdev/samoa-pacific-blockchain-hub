// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/NDIDSRegistry.sol";
import "../src/MinistryNode.sol";
import "../src/AIDisbursementTracker.sol";
import "../src/InteroperabilityHub.sol";

/**
 * @title SamoaPacificBlockchainHubTest
 * @notice Foundry test suite for the Samoa Government Interoperability PoC
 *
 *         Tests document:
 *         ✓ NDIDS citizen registration and privacy-preserving verification
 *         ✓ Ministry node permissioned data recording
 *         ✓ Cross-ministry read access control
 *         ✓ AID disbursement grant lifecycle (create → release → verify)
 *         ✓ Full cross-ministry workflow (NDIDS → Education → MOF benefit)
 *         ✓ Unauthorised access reverts
 *         ✓ Audit trail completeness
 *
 *         Run with: forge test -vv
 *         Coverage: forge coverage
 */
contract SamoaPacificBlockchainHubTest is Test {

    // ── Actors ───────────────────────────────────────────────────
    address admin      = makeAddr("admin");       // SBP / NDIDS authority
    address cbs        = makeAddr("cbs");          // Central Bank of Samoa
    address mcit       = makeAddr("mcit");         // Ministry of ICT
    address mof        = makeAddr("mof");          // Ministry of Finance
    address education  = makeAddr("education");    // Education (under MCIL)
    address unicef     = makeAddr("unicef");       // UNICEF as donor
    address verifier   = makeAddr("verifier");     // field verification officer
    address stranger   = makeAddr("stranger");     // unauthorised party

    // ── Contracts ────────────────────────────────────────────────
    NDIDSRegistry         ndids;
    MinistryNode          cbsNode;
    MinistryNode          mcitNode;
    MinistryNode          mofNode;
    MinistryNode          educationNode;
    AIDisbursementTracker aidTracker;
    InteroperabilityHub   hub;

    // ── Test citizen ─────────────────────────────────────────────
    // In production: hash = keccak256(citizenId + off-chain salt)
    bytes32 constant CITIZEN_HASH = keccak256("SAMOA_CITIZEN_001_SALT_XYZ");
    bytes32 constant DATA_HASH    = keccak256("ENROLMENT_DATA_2025");

    // ── Setup ────────────────────────────────────────────────────

    function setUp() public {
        vm.startPrank(admin);

        // Deploy core contracts
        ndids      = new NDIDSRegistry(admin);
        aidTracker = new AIDisbursementTracker(admin);
        hub        = new InteroperabilityHub(admin);

        // Deploy ministry nodes (each with NDIDS reference)
        cbsNode       = new MinistryNode("Central Bank of Samoa",          "CBS",       cbs,       address(ndids));
        mcitNode      = new MinistryNode("Ministry of Comms & IT",          "MCIT",      mcit,      address(ndids));
        mofNode       = new MinistryNode("Ministry of Finance",             "MOF",       mof,       address(ndids));
        educationNode = new MinistryNode("Ministry of Education",           "EDUCATION", education, address(ndids));

        // Wire hub
        hub.setNDIDS(address(ndids));
        hub.setAIDTracker(address(aidTracker));

        // Wire hub into ministry nodes (so the hub can coordinate workflows)
        cbsNode.setHub(address(hub));
        mcitNode.setHub(address(hub));
        mofNode.setHub(address(hub));
        educationNode.setHub(address(hub));

        // Register ministries in hub
        hub.registerMinistry("Central Bank of Samoa",    "CBS",       address(cbsNode));
        hub.registerMinistry("Ministry of Comms & IT",   "MCIT",      address(mcitNode));
        hub.registerMinistry("Ministry of Finance",      "MOF",       address(mofNode));
        hub.registerMinistry("Ministry of Education",    "EDUCATION", address(educationNode));

        vm.stopPrank();
    }

    // ════════════════════════════════════════════════════════════
    // NDIDS TESTS
    // ════════════════════════════════════════════════════════════

    function test_NDIDS_RegisterCitizen() public {
        vm.prank(admin);
        ndids.registerCitizen(CITIZEN_HASH);

        assertTrue(ndids.isRegistered(CITIZEN_HASH));
        assertEq(ndids.totalRegistered(), 1);
    }

    function test_NDIDS_CannotRegisterTwice() public {
        vm.startPrank(admin);
        ndids.registerCitizen(CITIZEN_HASH);
        vm.expectRevert(NDIDSRegistry.AlreadyRegistered.selector);
        ndids.registerCitizen(CITIZEN_HASH);
        vm.stopPrank();
    }

    function test_NDIDS_OnlyAdminCanRegister() public {
        vm.prank(stranger);
        vm.expectRevert(NDIDSRegistry.Unauthorised.selector);
        ndids.registerCitizen(CITIZEN_HASH);
    }

    function test_NDIDS_GrantAndRevokeReadAccess() public {
        vm.startPrank(admin);
        ndids.registerCitizen(CITIZEN_HASH);
        ndids.grantReadAccess(CITIZEN_HASH, address(educationNode));
        assertTrue(ndids.hasAccess(CITIZEN_HASH, address(educationNode)));

        ndids.revokeReadAccess(CITIZEN_HASH, address(educationNode));
        assertFalse(ndids.hasAccess(CITIZEN_HASH, address(educationNode)));
        vm.stopPrank();
    }

    function test_NDIDS_AccessDeniedWithoutPermission() public {
        vm.prank(admin);
        ndids.registerCitizen(CITIZEN_HASH);
        // educationNode has no read access yet
        vm.prank(address(educationNode));
        vm.expectRevert(NDIDSRegistry.AccessDenied.selector);
        ndids.verifyCitizen(CITIZEN_HASH);
    }

    function test_NDIDS_BatchRegister() public {
        bytes32[] memory hashes = new bytes32[](3);
        hashes[0] = keccak256("CITIZEN_A");
        hashes[1] = keccak256("CITIZEN_B");
        hashes[2] = keccak256("CITIZEN_C");

        vm.prank(admin);
        ndids.batchRegister(hashes);

        assertEq(ndids.totalRegistered(), 3);
        for (uint i = 0; i < 3; i++) {
            assertTrue(ndids.isRegistered(hashes[i]));
        }
    }

    // ════════════════════════════════════════════════════════════
    // MINISTRY NODE TESTS
    // ════════════════════════════════════════════════════════════

    function test_Ministry_RecordServiceWithoutNDIDS() public {
        vm.prank(cbs);
        uint256 recId = cbsNode.recordService(
            CITIZEN_HASH,
            "ACCOUNT_OPENED",
            DATA_HASH,
            false
        );
        assertEq(recId, 0);
        assertEq(cbsNode.totalRecords(), 1);
    }

    function test_Ministry_RecordServiceWithNDIDSVerification() public {
        // Setup: register citizen and grant education node access
        vm.startPrank(admin);
        ndids.registerCitizen(CITIZEN_HASH);
        ndids.grantReadAccess(CITIZEN_HASH, address(educationNode));
        vm.stopPrank();

        // Education node records enrolment, verifying via NDIDS
        vm.prank(education);
        uint256 recId = educationNode.recordService(
            CITIZEN_HASH,
            "SCHOOL_ENROLMENT",
            DATA_HASH,
            true  // triggers NDIDS verification
        );

        // Verify record is stored and NDIDS service count updated
        assertEq(recId, 0);
        assertEq(ndids.serviceCount(CITIZEN_HASH), 1);
    }

    function test_Ministry_CrossMinistryReadAccess() public {
        // CBS records a service
        vm.prank(cbs);
        cbsNode.recordService(CITIZEN_HASH, "REMITTANCE_RECEIVED", DATA_HASH, false);

        // MOF cannot read CBS records without permission
        vm.prank(address(mofNode));
        vm.expectRevert(MinistryNode.ReadAccessDenied.selector);
        cbsNode.getRecord(0);

        // Admin grants MOF read access to CBS
        vm.prank(cbs);
        cbsNode.authoriseReader(address(mofNode));

        // Now MOF can read
        vm.prank(address(mofNode));
        MinistryNode.ServiceRecord memory rec = cbsNode.getRecord(0);
        assertEq(rec.citizenHash, CITIZEN_HASH);
        assertEq(rec.serviceType, "REMITTANCE_RECEIVED");
    }

    function test_Ministry_OnlyAdminCanWrite() public {
        vm.prank(stranger);
        vm.expectRevert(MinistryNode.Unauthorised.selector);
        cbsNode.recordService(CITIZEN_HASH, "HACK_ATTEMPT", DATA_HASH, false);
    }

    // ════════════════════════════════════════════════════════════
    // AID DISBURSEMENT TRACKER TESTS
    // ════════════════════════════════════════════════════════════

    function _createUNICEFGrant() internal returns (uint256 grantId) {
        string[] memory milestones = new string[](3);
        milestones[0] = "Programme setup & capacity training complete";
        milestones[1] = "50 children enrolled with verified attendance";
        milestones[2] = "End-of-term assessment: learning outcomes documented";

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 30_000 ether;   // 30,000 USDC equivalent
        amounts[1] = 40_000 ether;
        amounts[2] = 30_000 ether;

        vm.prank(admin);
        grantId = aidTracker.createGrant(
            "UNICEF Samoa Education Access Programme 2025",
            unicef,
            address(educationNode),
            100_000 ether,
            50,             // target: 50 children
            "EDUCATION",
            milestones,
            amounts
        );
    }

    function test_AID_CreateGrant() public {
        uint256 grantId = _createUNICEFGrant();
        assertEq(grantId, 0);
        assertEq(aidTracker.totalGrants(), 1);

        (uint256 id, string memory title,,,,,, , , uint256 target,,) =
            aidTracker.getGrant(0);

        assertEq(id, 0);
        assertEq(target, 50);
        assertEq(aidTracker.getTrancheCount(0), 3);
        // Check title contains expected text
        assertTrue(bytes(title).length > 0);
    }

    function test_AID_ReleaseTranche() public {
        _createUNICEFGrant();

        vm.prank(admin);
        aidTracker.releaseTranche(0, 0);

        AIDisbursementTracker.Tranche memory t = aidTracker.getTranche(0, 0);
        assertEq(uint8(t.status), uint8(AIDisbursementTracker.TrancheStatus.Released));
        assertEq(aidTracker.totalDisbursed(), 30_000 ether);
    }

    function test_AID_VerifyUsage() public {
        _createUNICEFGrant();

        // Release first tranche
        vm.prank(admin);
        aidTracker.releaseTranche(0, 0);

        // Authorise field verifier
        vm.prank(admin);
        aidTracker.authoriseVerifier(verifier);

        // Verifier submits evidence
        bytes32 evidence = keccak256("FIELD_REPORT_MARCH_2025_IPFS_CID");
        vm.prank(verifier);
        aidTracker.verifyUsage(0, 0, evidence, 18); // 18 children served

        AIDisbursementTracker.Tranche memory t = aidTracker.getTranche(0, 0);
        assertEq(uint8(t.status), uint8(AIDisbursementTracker.TrancheStatus.Verified));
        assertEq(t.evidenceHash, evidence);
        assertEq(aidTracker.totalVerified(), 30_000 ether);

        (,,,,,,,,,,uint256 actual,) = aidTracker.getGrant(0);
        assertEq(actual, 18);
    }

    function test_AID_FullGrantLifecycleAndAutoComplete() public {
        _createUNICEFGrant();

        vm.prank(admin);
        aidTracker.authoriseVerifier(verifier);

        bytes32 evidence = keccak256("EVIDENCE");

        for (uint256 i = 0; i < 3; i++) {
            vm.prank(admin);
            aidTracker.releaseTranche(0, i);

            vm.prank(verifier);
            aidTracker.verifyUsage(0, i, evidence, 17);
        }

        (, , , , , , , AIDisbursementTracker.GrantStatus status, , , , ) =
            aidTracker.getGrant(0);
        assertEq(uint8(status), uint8(AIDisbursementTracker.GrantStatus.Completed));
        assertEq(aidTracker.totalVerified(), 100_000 ether);
    }

    function test_AID_UnauthorisedCannotVerify() public {
        _createUNICEFGrant();
        vm.prank(admin);
        aidTracker.releaseTranche(0, 0);

        vm.prank(stranger);
        vm.expectRevert(AIDisbursementTracker.Unauthorised.selector);
        aidTracker.verifyUsage(0, 0, bytes32(0), 0);
    }

    function test_AID_GetAuditTrail() public {
        _createUNICEFGrant();
        AIDisbursementTracker.Tranche[] memory trail = aidTracker.getAuditTrail(0);
        assertEq(trail.length, 3);
        assertEq(trail[0].milestone, "Programme setup & capacity training complete");
    }

    // ════════════════════════════════════════════════════════════
    // INTEROPERABILITY HUB TESTS
    // ════════════════════════════════════════════════════════════

    function test_Hub_MinistryRegistration() public view {
        assertEq(hub.getMinistryCount(), 4);
        InteroperabilityHub.Ministry memory m = hub.getMinistry("CBS");
        assertEq(m.name, "Central Bank of Samoa");
        assertEq(m.contractAddr, address(cbsNode));
        assertTrue(m.active);
    }

    function test_Hub_GrantPermission() public {
        vm.prank(admin);
        hub.grantPermission("CBS", "MOF");

        // MOF node should now be able to read CBS records
        vm.prank(cbs);
        cbsNode.recordService(CITIZEN_HASH, "PAYMENT", DATA_HASH, false);

        vm.prank(address(mofNode));
        MinistryNode.ServiceRecord memory rec = cbsNode.getRecord(0);
        assertEq(rec.serviceType, "PAYMENT");
    }

    function test_Hub_CrossMinistryEnrolmentWorkflow() public {
        // Setup: register citizen and grant education access to NDIDS
        vm.startPrank(admin);
        ndids.registerCitizen(CITIZEN_HASH);
        ndids.grantReadAccess(CITIZEN_HASH, address(educationNode));
        vm.stopPrank();

        // Grant MOF read access to Education node
        vm.prank(education);
        educationNode.authoriseReader(address(mofNode));

        // Execute the full workflow through the hub
        vm.prank(admin);
        bool success = hub.executeEnrolmentWorkflow(
            CITIZEN_HASH,
            address(educationNode),
            address(mofNode),
            DATA_HASH
        );

        assertTrue(success);

        // Education node has a record
        assertEq(educationNode.totalRecords(), 1);

        // MOF node has a benefit eligibility record
        assertEq(mofNode.totalRecords(), 1);

        // NDIDS service count incremented (identity was verified)
        assertEq(ndids.serviceCount(CITIZEN_HASH), 1);

        // Workflow logged in hub
        InteroperabilityHub.WorkflowEvent[] memory log = hub.getWorkflowLog();
        assertEq(log.length, 1);
        assertTrue(log[0].success);
        assertEq(log[0].workflowType, "ENROLMENT_AND_BENEFIT");
    }

    function test_Hub_GetAllMinistries() public view {
        InteroperabilityHub.Ministry[] memory all = hub.getAllMinistries();
        assertEq(all.length, 4);
    }

    // ════════════════════════════════════════════════════════════
    // FUZZ TESTS
    // ════════════════════════════════════════════════════════════

    function testFuzz_NDIDS_DifferentCitizens(bytes32 h1, bytes32 h2) public {
        vm.assume(h1 != h2);
        vm.startPrank(admin);
        ndids.registerCitizen(h1);
        ndids.registerCitizen(h2);
        vm.stopPrank();

        assertTrue(ndids.isRegistered(h1));
        assertTrue(ndids.isRegistered(h2));
        assertEq(ndids.totalRegistered(), 2);
    }

    function testFuzz_AID_BeneficiaryCount(uint256 count) public {
        vm.assume(count < 1_000_000);
        _createUNICEFGrant();

        vm.prank(admin);
        aidTracker.releaseTranche(0, 0);

        vm.prank(admin);
        aidTracker.authoriseVerifier(verifier);

        vm.prank(verifier);
        aidTracker.verifyUsage(0, 0, keccak256("evidence"), count);

        (,,,,,,,,,, uint256 actual,) = aidTracker.getGrant(0);
        assertEq(actual, count);
    }
}
