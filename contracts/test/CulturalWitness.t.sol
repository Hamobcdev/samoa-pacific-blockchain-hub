// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CulturalWitnessRegistry.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract CulturalWitnessTest is Test {

    address admin    = makeAddr("admin");
    address stranger = makeAddr("stranger");

    CulturalWitnessRegistry registry;

    bytes32 constant WITNESS_HASH = keccak256("MATAI_NDIDS_001");
    bytes32 constant APP_REF      = keccak256("APPLICATION_2026_001");
    bytes32 constant APP_REF_2    = keccak256("APPLICATION_2026_002");
    bytes32 constant GEO_HASH     = keccak256("APIA_UPOLU");

    uint256 constant ONE_YEAR = 365 days;

    function setUp() public {
        CulturalWitnessRegistry impl = new CulturalWitnessRegistry();
        bytes memory d = abi.encodeWithSelector(CulturalWitnessRegistry.initialize.selector, admin);
        registry = CulturalWitnessRegistry(address(new ERC1967Proxy(address(impl), d)));
    }

    // ── registerWitness ───────────────────────────────────────────────────────

    function test_registerWitness_success() public {
        uint256 expiry = block.timestamp + ONE_YEAR;
        vm.expectEmit(true, false, false, true);
        emit CulturalWitnessRegistry.WitnessRegistered(
            WITNESS_HASH, CulturalWitnessRegistry.WitnessType.MATAI, expiry
        );
        vm.prank(admin);
        registry.registerWitness(
            WITNESS_HASH, CulturalWitnessRegistry.WitnessType.MATAI, expiry, GEO_HASH
        );
    }

    function test_registerWitness_revertAlreadyRegistered() public {
        uint256 expiry = block.timestamp + ONE_YEAR;
        vm.startPrank(admin);
        registry.registerWitness(WITNESS_HASH, CulturalWitnessRegistry.WitnessType.MATAI, expiry, GEO_HASH);
        vm.expectRevert(CulturalWitnessRegistry.AlreadyRegistered.selector);
        registry.registerWitness(WITNESS_HASH, CulturalWitnessRegistry.WitnessType.MATAI, expiry, GEO_HASH);
        vm.stopPrank();
    }

    function test_registerWitness_revertZeroHash() public {
        vm.prank(admin);
        vm.expectRevert(CulturalWitnessRegistry.ZeroAddress.selector);
        registry.registerWitness(
            bytes32(0), CulturalWitnessRegistry.WitnessType.MATAI,
            block.timestamp + ONE_YEAR, GEO_HASH
        );
    }

    function test_registerWitness_revertPastExpiry() public {
        vm.prank(admin);
        vm.expectRevert(CulturalWitnessRegistry.InvalidExpiry.selector);
        registry.registerWitness(
            WITNESS_HASH, CulturalWitnessRegistry.WitnessType.MATAI,
            block.timestamp, GEO_HASH
        );
    }

    // ── attestApplication ─────────────────────────────────────────────────────

    function _registerWitness() internal {
        vm.prank(admin);
        registry.registerWitness(
            WITNESS_HASH, CulturalWitnessRegistry.WitnessType.MATAI,
            block.timestamp + ONE_YEAR, GEO_HASH
        );
    }

    function test_attestApplication_success() public {
        _registerWitness();
        vm.expectEmit(true, true, false, true);
        emit CulturalWitnessRegistry.WitnessAttested(
            APP_REF, WITNESS_HASH,
            CulturalWitnessRegistry.WitnessType.MATAI, block.timestamp
        );
        registry.attestApplication(APP_REF, WITNESS_HASH);

        vm.prank(admin);
        CulturalWitnessRegistry.Witness memory w = registry.getWitness(WITNESS_HASH);
        assertEq(w.attestationCount, 1);
    }

    function test_attestApplication_revertAlreadyAttested() public {
        _registerWitness();
        registry.attestApplication(APP_REF, WITNESS_HASH);
        vm.expectRevert(CulturalWitnessRegistry.AlreadyAttested.selector);
        registry.attestApplication(APP_REF, WITNESS_HASH);
    }

    function test_attestApplication_revertWitnessNotActive() public {
        _registerWitness();
        vm.prank(admin);
        registry.revokeWitness(WITNESS_HASH);
        vm.expectRevert(CulturalWitnessRegistry.WitnessNotActive.selector);
        registry.attestApplication(APP_REF, WITNESS_HASH);
    }

    function test_attestApplication_revertWitnessExpired() public {
        _registerWitness();
        vm.warp(block.timestamp + ONE_YEAR + 1);
        vm.expectRevert(CulturalWitnessRegistry.WitnessExpired.selector);
        registry.attestApplication(APP_REF, WITNESS_HASH);
    }

    // ── revokeWitness ─────────────────────────────────────────────────────────

    function test_revokeWitness_success() public {
        _registerWitness();
        vm.prank(admin);
        registry.revokeWitness(WITNESS_HASH);
        (bool valid,) = registry.isValidWitness(WITNESS_HASH);
        assertFalse(valid);
    }

    // ── renewWitness ──────────────────────────────────────────────────────────

    function test_renewWitness_restoresActive() public {
        _registerWitness();
        vm.startPrank(admin);
        registry.revokeWitness(WITNESS_HASH);
        (bool invalid,) = registry.isValidWitness(WITNESS_HASH);
        assertFalse(invalid);
        registry.renewWitness(WITNESS_HASH, block.timestamp + ONE_YEAR);
        vm.stopPrank();
        (bool valid,) = registry.isValidWitness(WITNESS_HASH);
        assertTrue(valid);
    }

    // ── isValidWitness ────────────────────────────────────────────────────────

    function test_isValidWitness_activeAndNotExpired() public {
        _registerWitness();
        (bool valid, CulturalWitnessRegistry.WitnessType wt) = registry.isValidWitness(WITNESS_HASH);
        assertTrue(valid);
        assertEq(uint8(wt), uint8(CulturalWitnessRegistry.WitnessType.MATAI));
    }

    function test_isValidWitness_expired() public {
        _registerWitness();
        vm.warp(block.timestamp + ONE_YEAR + 1);
        (bool valid,) = registry.isValidWitness(WITNESS_HASH);
        assertFalse(valid);
    }

    // ── getAttestation ────────────────────────────────────────────────────────

    function test_getAttestation_returnsCorrectData() public {
        _registerWitness();
        registry.attestApplication(APP_REF, WITNESS_HASH);
        (
            bool exists,
            bytes32 wh,
            CulturalWitnessRegistry.WitnessType wt,
            uint256 ts
        ) = registry.getAttestation(APP_REF);
        assertTrue(exists);
        assertEq(wh, WITNESS_HASH);
        assertEq(uint8(wt), uint8(CulturalWitnessRegistry.WitnessType.MATAI));
        assertGt(ts, 0);
    }

    function test_getAttestation_notExists() public view {
        (bool exists,,,) = registry.getAttestation(keccak256("NONEXISTENT_APP"));
        assertFalse(exists);
    }

    // ── access control ────────────────────────────────────────────────────────

    function test_nonAdminCannotRegister() public {
        vm.prank(stranger);
        vm.expectRevert(CulturalWitnessRegistry.Unauthorised.selector);
        registry.registerWitness(
            WITNESS_HASH, CulturalWitnessRegistry.WitnessType.MATAI,
            block.timestamp + ONE_YEAR, GEO_HASH
        );
    }
}
