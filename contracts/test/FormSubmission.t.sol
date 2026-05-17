// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MinistryNode.sol";
import "../src/NDIDSRegistry.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract FormSubmissionTest is Test {

    address admin    = makeAddr("admin");
    address stranger = makeAddr("stranger");

    MinistryNode  node;
    NDIDSRegistry ndids;

    bytes32 constant CITIZEN_HASH  = keccak256("SAMOA_CITIZEN_FS_001");
    bytes32 constant FORM_HASH     = keccak256("FORM_DATA_2026_001");
    bytes32 constant FORM_HASH_2   = keccak256("FORM_DATA_2026_002");
    bytes32 constant FORM_HASH_3   = keccak256("FORM_DATA_2026_003");
    bytes32 constant WITNESS_HASH  = keccak256("WITNESS_NDIDS_001");
    bytes32 constant PAYMENT_REF   = keccak256("PMT_REF_001");
    bytes32 constant CRITERIA_HASH = keccak256("AUTO_CRITERIA_001");

    function setUp() public {
        vm.startPrank(admin);

        {
            NDIDSRegistry impl = new NDIDSRegistry();
            bytes memory d = abi.encodeWithSelector(NDIDSRegistry.initialize.selector, admin);
            ndids = NDIDSRegistry(address(new ERC1967Proxy(address(impl), d)));
        }
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(
                MinistryNode.initialize.selector,
                "Ministry of Internal Affairs", "MIA", admin, address(ndids)
            );
            node = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        vm.stopPrank();
    }

    // ── recordFormSubmission ──────────────────────────────────────────────────

    function test_recordFormSubmission_success() public {
        vm.prank(admin);
        uint256 id = node.recordFormSubmission(
            CITIZEN_HASH, FORM_HASH, "ARRIVAL_DECLARATION",
            WITNESS_HASH, 500, PAYMENT_REF
        );
        assertEq(id, 0);
        assertEq(node.totalSubmissions(), 1);
    }

    function test_recordFormSubmission_setsFormHashExists() public {
        vm.prank(admin);
        node.recordFormSubmission(
            CITIZEN_HASH, FORM_HASH, "BIRTH_CERT",
            bytes32(0), 0, bytes32(0)
        );
        (bool exists, uint256 sid) = node.verifyFormSubmission(FORM_HASH);
        assertTrue(exists);
        assertEq(sid, 0);
    }

    function test_recordFormSubmission_revertDuplicate() public {
        vm.startPrank(admin);
        node.recordFormSubmission(CITIZEN_HASH, FORM_HASH, "ARRIVAL_DECLARATION", bytes32(0), 0, bytes32(0));
        vm.expectRevert(MinistryNode.DuplicateSubmission.selector);
        node.recordFormSubmission(CITIZEN_HASH, FORM_HASH, "ARRIVAL_DECLARATION", bytes32(0), 0, bytes32(0));
        vm.stopPrank();
    }

    function test_recordFormSubmission_revertZeroCitizenHash() public {
        vm.prank(admin);
        vm.expectRevert(MinistryNode.ZeroAddress.selector);
        node.recordFormSubmission(bytes32(0), FORM_HASH, "ARRIVAL_DECLARATION", bytes32(0), 0, bytes32(0));
    }

    function test_recordFormSubmission_revertZeroFormHash() public {
        vm.prank(admin);
        vm.expectRevert(MinistryNode.ZeroAddress.selector);
        node.recordFormSubmission(CITIZEN_HASH, bytes32(0), "ARRIVAL_DECLARATION", bytes32(0), 0, bytes32(0));
    }

    function test_recordFormSubmission_revertEmptyFormType() public {
        vm.prank(admin);
        vm.expectRevert(MinistryNode.InvalidFormType.selector);
        node.recordFormSubmission(CITIZEN_HASH, FORM_HASH, "", bytes32(0), 0, bytes32(0));
    }

    // ── approveSubmission ─────────────────────────────────────────────────────

    function test_approveSubmission_success() public {
        vm.startPrank(admin);
        node.recordFormSubmission(CITIZEN_HASH, FORM_HASH, "ARRIVAL_DECLARATION", bytes32(0), 0, bytes32(0));
        vm.expectEmit(true, false, false, true);
        emit MinistryNode.FormAutoApproved(0, CRITERIA_HASH, block.timestamp);
        node.approveSubmission(0, CRITERIA_HASH);

        MinistryNode.FormSubmission memory fs = node.getSubmission(0);
        assertTrue(fs.autoApproved);
        vm.stopPrank();
    }

    // ── flagSubmissionForReview ───────────────────────────────────────────────

    function test_flagSubmissionForReview_success() public {
        vm.startPrank(admin);
        node.recordFormSubmission(CITIZEN_HASH, FORM_HASH, "ARRIVAL_DECLARATION", bytes32(0), 0, bytes32(0));
        vm.expectEmit(true, false, false, true);
        emit MinistryNode.FormRequiresReview(0, 2, 1, block.timestamp);
        node.flagSubmissionForReview(0, 2, 1);

        MinistryNode.FormSubmission memory fs = node.getSubmission(0);
        assertEq(fs.flagType, 2);
        assertEq(fs.priority, 1);
        vm.stopPrank();
    }

    function test_flagSubmissionForReview_revertInvalidFlag() public {
        vm.startPrank(admin);
        node.recordFormSubmission(CITIZEN_HASH, FORM_HASH, "ARRIVAL_DECLARATION", bytes32(0), 0, bytes32(0));
        vm.expectRevert(MinistryNode.InvalidFlagType.selector);
        node.flagSubmissionForReview(0, 0, 1);
        vm.stopPrank();
    }

    // ── verifyFormSubmission ──────────────────────────────────────────────────

    function test_verifyFormSubmission_exists() public {
        vm.prank(admin);
        node.recordFormSubmission(CITIZEN_HASH, FORM_HASH, "ARRIVAL_DECLARATION", bytes32(0), 0, bytes32(0));
        (bool exists, uint256 sid) = node.verifyFormSubmission(FORM_HASH);
        assertTrue(exists);
        assertEq(sid, 0);
    }

    function test_verifyFormSubmission_notExists() public view {
        (bool exists, uint256 sid) = node.verifyFormSubmission(keccak256("NONEXISTENT_FORM"));
        assertFalse(exists);
        assertEq(sid, 0);
    }

    // ── getSubmission ─────────────────────────────────────────────────────────

    function test_getSubmission_returnsCorrectData() public {
        vm.prank(admin);
        node.recordFormSubmission(
            CITIZEN_HASH, FORM_HASH, "ARRIVAL_DECLARATION",
            WITNESS_HASH, 500, PAYMENT_REF
        );
        vm.prank(admin);
        MinistryNode.FormSubmission memory fs = node.getSubmission(0);
        assertEq(fs.citizenHash, CITIZEN_HASH);
        assertEq(fs.formHash,    FORM_HASH);
        assertEq(fs.formType,    "ARRIVAL_DECLARATION");
        assertEq(fs.witnessHash, WITNESS_HASH);
        assertEq(fs.feeAmount,   500);
        assertEq(fs.paymentRef,  PAYMENT_REF);
        assertFalse(fs.autoApproved);
        assertEq(fs.flagType, 0);
        assertEq(fs.priority, 0);
    }

    // ── access control ────────────────────────────────────────────────────────

    function test_unauthorisedCannotRecord() public {
        vm.prank(stranger);
        vm.expectRevert(MinistryNode.UnauthorisedCaller.selector);
        node.recordFormSubmission(CITIZEN_HASH, FORM_HASH, "ARRIVAL_DECLARATION", bytes32(0), 0, bytes32(0));
    }

    // ── multiple submissions ──────────────────────────────────────────────────

    function test_multipleSubmissions_distinctIds() public {
        vm.startPrank(admin);
        uint256 id0 = node.recordFormSubmission(CITIZEN_HASH, FORM_HASH,   "TYPE_A", bytes32(0), 0, bytes32(0));
        uint256 id1 = node.recordFormSubmission(CITIZEN_HASH, FORM_HASH_2, "TYPE_B", bytes32(0), 0, bytes32(0));
        uint256 id2 = node.recordFormSubmission(CITIZEN_HASH, FORM_HASH_3, "TYPE_C", bytes32(0), 0, bytes32(0));
        vm.stopPrank();
        assertEq(id0, 0);
        assertEq(id1, 1);
        assertEq(id2, 2);
        assertEq(node.totalSubmissions(), 3);
    }
}
