// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/InteroperabilityHub.sol";
import "../src/NDIDSRegistry.sol";
import "../src/AIDisbursementTracker.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract OMWWorkflowTest is Test {

    address admin = makeAddr("admin");

    InteroperabilityHub hub;

    bytes32 constant VESSEL_ID  = keccak256("IMO9876543_VOY001");
    bytes32 constant DECL_HASH  = keccak256("FAL_FORM1_2026_001");
    bytes32 constant PASS_HASH  = keccak256("PASSPORT_NZ_ARRIVAL");
    bytes32 constant PASS_DECL  = keccak256("ARRIVAL_DECLARATION_001");
    bytes32 constant MIN_HASH_A = keccak256("CUSTOMS");
    bytes32 constant MIN_HASH_B = keccak256("BIOSECURITY");
    bytes32 constant MIN_HASH_C = keccak256("HEALTH");
    bytes32 constant OFFICER_ID = keccak256("OFFICER_CREDENTIALS_001");

    function setUp() public {
        vm.startPrank(admin);

        {
            NDIDSRegistry impl = new NDIDSRegistry();
            bytes memory d = abi.encodeWithSelector(NDIDSRegistry.initialize.selector, admin);
            NDIDSRegistry ndids = NDIDSRegistry(address(new ERC1967Proxy(address(impl), d)));

            AIDisbursementTracker aidImpl = new AIDisbursementTracker();
            bytes memory ad = abi.encodeWithSelector(AIDisbursementTracker.initialize.selector, admin);
            AIDisbursementTracker aid = AIDisbursementTracker(address(new ERC1967Proxy(address(aidImpl), ad)));

            InteroperabilityHub hubImpl = new InteroperabilityHub();
            bytes memory hd = abi.encodeWithSelector(InteroperabilityHub.initialize.selector, admin);
            hub = InteroperabilityHub(address(new ERC1967Proxy(address(hubImpl), hd)));

            hub.setNDIDS(address(ndids));
            hub.setAIDTracker(address(aid));
        }

        vm.stopPrank();
    }

    function _hashes(uint256 n) internal pure returns (bytes32[] memory h) {
        h = new bytes32[](n);
        h[0] = MIN_HASH_A;
        if (n > 1) h[1] = MIN_HASH_B;
        if (n > 2) h[2] = MIN_HASH_C;
    }

    // ── executeOMWClearance ───────────────────────────────────────────────────

    function test_executeOMWClearance_success() public {
        vm.prank(admin);
        uint256 id = hub.executeOMWClearance(VESSEL_ID, DECL_HASH, _hashes(3));
        assertEq(id, 0);
        assertEq(hub.totalOMWClearances(), 1);
        InteroperabilityHub.OMWClearanceRecord memory rec = hub.getOMWRecord(0);
        assertEq(rec.vesselId,      VESSEL_ID);
        assertEq(rec.ministryCount, 3);
        assertFalse(rec.allCleared);
    }

    function test_executeOMWClearance_incrementsCounter() public {
        vm.startPrank(admin);
        uint256 id0 = hub.executeOMWClearance(VESSEL_ID,               DECL_HASH,              _hashes(1));
        uint256 id1 = hub.executeOMWClearance(keccak256("VESSEL2"), keccak256("DECL2"), _hashes(1));
        vm.stopPrank();
        assertEq(id0, 0);
        assertEq(id1, 1);
    }

    function test_executeOMWClearance_emitsAcknowledgement() public {
        vm.expectEmit(true, false, false, true);
        emit InteroperabilityHub.OMWSubmissionAcknowledged(0, VESSEL_ID, block.timestamp, 3);
        vm.prank(admin);
        hub.executeOMWClearance(VESSEL_ID, DECL_HASH, _hashes(3));
    }

    function test_executeOMWClearance_revertEmptyMinistries() public {
        bytes32[] memory empty = new bytes32[](0);
        vm.prank(admin);
        vm.expectRevert(InteroperabilityHub.InvalidMinistryCount.selector);
        hub.executeOMWClearance(VESSEL_ID, DECL_HASH, empty);
    }

    function test_executeOMWClearance_revertTooManyMinistries() public {
        bytes32[] memory tooMany = new bytes32[](11);
        for (uint256 i = 0; i < 11; i++) tooMany[i] = keccak256(abi.encodePacked(i));
        vm.prank(admin);
        vm.expectRevert(InteroperabilityHub.InvalidMinistryCount.selector);
        hub.executeOMWClearance(VESSEL_ID, DECL_HASH, tooMany);
    }

    // ── updateMinistryOMWStatus ───────────────────────────────────────────────

    function test_updateMinistryOMWStatus_toCLEARED() public {
        vm.startPrank(admin);
        hub.executeOMWClearance(VESSEL_ID, DECL_HASH, _hashes(2));
        hub.updateMinistryOMWStatus(0, MIN_HASH_A, 2, OFFICER_ID);
        vm.stopPrank();

        (uint8 status,,) = hub.getMinistryOMWStatus(0, MIN_HASH_A);
        assertEq(status, 2);
        assertEq(hub.getOMWRecord(0).clearedCount, 1);
    }

    function test_updateMinistryOMWStatus_allCleared_emitsOMWAllCleared() public {
        vm.startPrank(admin);
        hub.executeOMWClearance(VESSEL_ID, DECL_HASH, _hashes(2));
        hub.updateMinistryOMWStatus(0, MIN_HASH_A, 2, OFFICER_ID);

        vm.expectEmit(true, false, false, true);
        emit InteroperabilityHub.OMWAllCleared(0, VESSEL_ID, block.timestamp);
        hub.updateMinistryOMWStatus(0, MIN_HASH_B, 2, OFFICER_ID);
        vm.stopPrank();

        assertTrue(hub.getOMWRecord(0).allCleared);
    }

    function test_updateMinistryOMWStatus_revertAlreadyComplete() public {
        vm.startPrank(admin);
        hub.executeOMWClearance(VESSEL_ID, DECL_HASH, _hashes(1)); // 1 ministry
        hub.updateMinistryOMWStatus(0, MIN_HASH_A, 2, OFFICER_ID); // clears all
        vm.expectRevert(InteroperabilityHub.AlreadyComplete.selector);
        hub.updateMinistryOMWStatus(0, MIN_HASH_A, 1, OFFICER_ID);
        vm.stopPrank();
    }

    // ── rejectMinistryOMWStatus ───────────────────────────────────────────────

    function test_rejectMinistryOMWStatus_success() public {
        vm.startPrank(admin);
        hub.executeOMWClearance(VESSEL_ID, DECL_HASH, _hashes(2));
        bytes32 code = hub.REJECT_BIOSECURITY_HOLD();

        vm.expectEmit(true, true, false, true);
        emit InteroperabilityHub.MinistryOMWRejected(0, MIN_HASH_A, code, block.timestamp);
        hub.rejectMinistryOMWStatus(0, MIN_HASH_A, code);
        vm.stopPrank();

        (uint8 status,,) = hub.getMinistryOMWStatus(0, MIN_HASH_A);
        assertEq(status, 4);
    }

    function test_rejectMinistryOMWStatus_revertZeroCode() public {
        vm.startPrank(admin);
        hub.executeOMWClearance(VESSEL_ID, DECL_HASH, _hashes(1));
        vm.expectRevert(InteroperabilityHub.InvalidRejectionCode.selector);
        hub.rejectMinistryOMWStatus(0, MIN_HASH_A, bytes32(0));
        vm.stopPrank();
    }

    // ── getMinistryOMWStatus ──────────────────────────────────────────────────

    function test_getMinistryOMWStatus_returnsCorrectValues() public {
        vm.startPrank(admin);
        hub.executeOMWClearance(VESSEL_ID, DECL_HASH, _hashes(2));
        hub.updateMinistryOMWStatus(0, MIN_HASH_A, 1, OFFICER_ID); // IN_REVIEW
        vm.stopPrank();

        (uint8 status, bytes32 cred, uint256 clearedAt) = hub.getMinistryOMWStatus(0, MIN_HASH_A);
        assertEq(status, 1);
        assertEq(cred,   OFFICER_ID);
        assertEq(clearedAt, 0);
    }

    // ── executeArrivalWorkflow ────────────────────────────────────────────────

    function test_executeArrivalWorkflow_greenAutoClears() public {
        vm.prank(admin);
        uint256 id = hub.executeArrivalWorkflow(
            PASS_HASH, PASS_DECL, false, false, false, false, false, false
        );
        InteroperabilityHub.ArrivalClearanceRecord memory rec = hub.getArrivalRecord(id);
        assertTrue(rec.cleared);
        assertEq(rec.flags.overallRisk, 0);
        assertGt(rec.clearedAt, 0);
    }

    function test_executeArrivalWorkflow_amberNotCleared() public {
        vm.prank(admin);
        uint256 id = hub.executeArrivalWorkflow(
            PASS_HASH, PASS_DECL, true, false, false, false, false, false
        );
        InteroperabilityHub.ArrivalClearanceRecord memory rec = hub.getArrivalRecord(id);
        assertFalse(rec.cleared);
        assertEq(rec.flags.overallRisk, 1);
        assertEq(rec.clearedAt, 0);
    }

    function test_executeArrivalWorkflow_redWatchlist() public {
        vm.prank(admin);
        uint256 id = hub.executeArrivalWorkflow(
            PASS_HASH, PASS_DECL, false, false, false, false, false, true
        );
        InteroperabilityHub.ArrivalClearanceRecord memory rec = hub.getArrivalRecord(id);
        assertFalse(rec.cleared);
        assertEq(rec.flags.overallRisk, 2);
    }

    function test_executeArrivalWorkflow_emitsAcknowledgement() public {
        vm.expectEmit(true, false, false, true);
        emit InteroperabilityHub.ArrivalSubmissionAcknowledged(0, PASS_HASH, block.timestamp, 0);
        vm.prank(admin);
        hub.executeArrivalWorkflow(PASS_HASH, PASS_DECL, false, false, false, false, false, false);
    }

    function test_executeArrivalWorkflow_multiFlagsDerivesRed() public {
        vm.prank(admin);
        uint256 id = hub.executeArrivalWorkflow(
            PASS_HASH, PASS_DECL, true, true, false, false, false, false
        );
        assertEq(hub.getArrivalRecord(id).flags.overallRisk, 2); // biosec + customs = RED
    }

    // ── clearArrival ──────────────────────────────────────────────────────────

    function test_clearArrival_success() public {
        vm.startPrank(admin);
        uint256 id = hub.executeArrivalWorkflow(
            PASS_HASH, PASS_DECL, true, false, false, false, false, false
        );
        vm.expectEmit(true, false, false, true);
        emit InteroperabilityHub.ArrivalCleared(id, PASS_HASH, block.timestamp);
        hub.clearArrival(id);
        vm.stopPrank();
        assertTrue(hub.getArrivalRecord(id).cleared);
    }

    function test_clearArrival_revertAlreadyCleared() public {
        vm.startPrank(admin);
        uint256 id = hub.executeArrivalWorkflow(
            PASS_HASH, PASS_DECL, false, false, false, false, false, false
        );
        vm.expectRevert(InteroperabilityHub.AlreadyCleared.selector);
        hub.clearArrival(id);
        vm.stopPrank();
    }

    function test_clearArrival_revertInvalidId() public {
        vm.prank(admin);
        vm.expectRevert(InteroperabilityHub.InvalidClearance.selector);
        hub.clearArrival(999);
    }
}
