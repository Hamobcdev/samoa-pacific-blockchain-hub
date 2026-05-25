// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/NDIDSRegistry.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract NonNDIDSTierTest is Test {

    address admin    = makeAddr("admin");
    address stranger = makeAddr("stranger");

    NDIDSRegistry ndids;

    bytes32 constant CITIZEN_HASH = keccak256("SAMOA_CITIZEN_NDIDS_001");
    bytes32 constant VRN_T5       = keccak256("VRN_TOURIST_2026_001");
    bytes32 constant ERI          = keccak256("ERI_COMPANY_ABC_001");

    function setUp() public {
        vm.startPrank(admin);
        NDIDSRegistry impl = new NDIDSRegistry();
        bytes memory d = abi.encodeWithSelector(NDIDSRegistry.initialize.selector, admin);
        ndids = NDIDSRegistry(address(new ERC1967Proxy(address(impl), d)));
        ndids.registerCitizen(CITIZEN_HASH);
        vm.stopPrank();
    }

    // ── registerVisitor ───────────────────────────────────────────────────────

    function test_registerVisitor_tier5_success() public {
        uint256 expiry = block.timestamp + 30 days;
        vm.expectEmit(true, false, false, true);
        emit NDIDSRegistry.VisitorRegistered(VRN_T5, 5, expiry);
        vm.prank(admin);
        ndids.registerVisitor(VRN_T5, 5, expiry);
    }

    function test_registerVisitor_revertInvalidTier_1() public {
        vm.prank(admin);
        vm.expectRevert(NDIDSRegistry.InvalidTier.selector);
        ndids.registerVisitor(VRN_T5, 1, block.timestamp + 30 days);
    }

    function test_registerVisitor_revertInvalidTier_7() public {
        vm.prank(admin);
        vm.expectRevert(NDIDSRegistry.InvalidTier.selector);
        ndids.registerVisitor(VRN_T5, 7, block.timestamp + 30 days);
    }

    function test_registerVisitor_revertExpiredTimestamp() public {
        vm.prank(admin);
        vm.expectRevert(NDIDSRegistry.InvalidExpiry.selector);
        ndids.registerVisitor(VRN_T5, 5, block.timestamp);
    }

    // ── isValidReference — tier 1 (NDIDS citizen) ────────────────────────────

    function test_isValidReference_tier1_ndids() public view {
        (bool valid, uint8 tier) = ndids.isValidReference(CITIZEN_HASH);
        assertTrue(valid);
        assertEq(tier, 1);
    }

    // ── isValidReference — tier 5 (visitor) ──────────────────────────────────

    function test_isValidReference_tier5_visitor() public {
        vm.prank(admin);
        ndids.registerVisitor(VRN_T5, 5, block.timestamp + 30 days);
        (bool valid, uint8 tier) = ndids.isValidReference(VRN_T5);
        assertTrue(valid);
        assertEq(tier, 5);
    }

    function test_isValidReference_expired_visitor() public {
        vm.prank(admin);
        ndids.registerVisitor(VRN_T5, 5, block.timestamp + 30 days);
        vm.warp(block.timestamp + 31 days);
        (bool valid,) = ndids.isValidReference(VRN_T5);
        assertFalse(valid);
    }

    // ── registerEntity ────────────────────────────────────────────────────────

    function test_registerEntity_success() public {
        vm.expectEmit(true, false, false, true);
        emit NDIDSRegistry.EntityRegistered(ERI, CITIZEN_HASH);
        vm.prank(admin);
        ndids.registerEntity(ERI, CITIZEN_HASH);
    }

    function test_registerEntity_revertSignatoryNotNDIDS() public {
        bytes32 unregistered = keccak256("UNREGISTERED_SIGNATORY_XYZ");
        vm.prank(admin);
        vm.expectRevert(NDIDSRegistry.SignatoryNotRegistered.selector);
        ndids.registerEntity(ERI, unregistered);
    }

    // ── isValidReference — tier 7 (entity) ───────────────────────────────────

    function test_isValidReference_tier7_entity() public {
        vm.prank(admin);
        ndids.registerEntity(ERI, CITIZEN_HASH);
        (bool valid, uint8 tier) = ndids.isValidReference(ERI);
        assertTrue(valid);
        assertEq(tier, 7);
    }

    // ── isValidReference — unknown hash ──────────────────────────────────────

    function test_isValidReference_unknown() public view {
        (bool valid, uint8 tier) = ndids.isValidReference(keccak256("UNKNOWN_HASH_XYZ_999"));
        assertFalse(valid);
        assertEq(tier, 0);
    }
}
