// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title  CulturalWitnessRegistry
/// @notice On-chain registry for Samoa's fa'amatai community witness system.
///         Formalises the existing cultural practice of matai, pastors,
///         lawyers, and government officers witnessing identity declarations.
///         Enables digital QR-based witnessing including remote diaspora flows.
/// @dev    UUPS upgradeable. ADMIN set via initialize() — not immutable.
///         Attestation currently identity-unverified (research prototype).
///         Production requires EIP-712 witness signature verification.
contract CulturalWitnessRegistry is Initializable, UUPSUpgradeable, Pausable {

    // ── Enumerations ──────────────────────────────────────────────────────
    enum WitnessType {
        PASTOR,        // 0 — ordained minister, priest, or deacon
        MATAI,         // 1 — registered Samoan matai title holder
        PULENUU,       // 2 — village mayor or tamaitai equivalent
        LAWYER,        // 3 — Law Society of Samoa registered member
        GOVT_OFFICER,  // 4 — government officer Grade 7 and above
        JP,            // 5 — Justice of the Peace (court-registered)
        POLICE         // 6 — commissioned police officer
    }

    // ── Structs ───────────────────────────────────────────────────────────
    struct Witness {
        bytes32     ndidsHash;        // NDIDS hash of this witness
        WitnessType witnessType;
        uint256     expiry;           // annual renewal timestamp
        bytes32     geographicHash;   // keccak256(village + district name)
        bool        active;
        uint256     attestationCount; // lifetime attestations performed
    }

    struct Attestation {
        bytes32     applicationRef;   // keccak256 of the application data
        bytes32     witnessHash;      // NDIDS hash of the witness
        WitnessType witnessType;
        uint256     timestamp;
    }

    // ── Storage ───────────────────────────────────────────────────────────
    address public ADMIN; // slot 1 — regular storage, set in initialize()

    mapping(bytes32 => Witness)     private _witnesses;          // slot 2
    mapping(bytes32 => Attestation) private _attestations;       // slot 3
    mapping(bytes32 => bool)        private _attestationExists;  // slot 4

    // ── Events ────────────────────────────────────────────────────────────
    event WitnessRegistered(
        bytes32 indexed ndidsHash,
        WitnessType     witnessType,
        uint256         expiry
    );
    event WitnessRevoked(bytes32 indexed ndidsHash);
    event WitnessRenewed(bytes32 indexed ndidsHash, uint256 newExpiry);
    event WitnessAttested(
        bytes32 indexed applicationRef,
        bytes32 indexed witnessHash,
        WitnessType     witnessType,
        uint256         timestamp
    );

    // ── Custom Errors ─────────────────────────────────────────────────────
    error Unauthorised();
    error ZeroAddress();
    error AlreadyRegistered();
    error NotRegistered();
    error WitnessNotActive();
    error WitnessExpired();
    error AlreadyAttested();
    error InvalidExpiry();

    // ── Storage Gap ───────────────────────────────────────────────────────
    // 50 total slots - 4 used (ADMIN + 3 mappings) = 46 remaining
    uint256[46] private __gap;

    // ── Constructor ───────────────────────────────────────────────────────

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ── Initializer ───────────────────────────────────────────────────────

    function initialize(address admin_) public initializer {
        if (admin_ == address(0)) revert ZeroAddress();
        ADMIN = admin_;
    }

    // ── Modifiers ─────────────────────────────────────────────────────────

    modifier onlyAdmin() {
        if (msg.sender != ADMIN) revert Unauthorised();
        _;
    }

    // ── UUPS Authorization ────────────────────────────────────────────────

    function _authorizeUpgrade(address) internal override {
        if (msg.sender != ADMIN) revert Unauthorised();
    }

    // ── Admin Functions ───────────────────────────────────────────────────

    /// @notice Register a new cultural witness after verifying credentials.
    ///         Called by SBS or MOJ officer at time of credential verification.
    function registerWitness(
        bytes32     ndidsHash,
        WitnessType witnessType,
        uint256     expiry,
        bytes32     geographicHash
    ) external onlyAdmin {
        if (ndidsHash == bytes32(0))      revert ZeroAddress();
        if (expiry <= block.timestamp)    revert InvalidExpiry();
        if (_witnesses[ndidsHash].active) revert AlreadyRegistered();

        _witnesses[ndidsHash] = Witness({
            ndidsHash:        ndidsHash,
            witnessType:      witnessType,
            expiry:           expiry,
            geographicHash:   geographicHash,
            active:           true,
            attestationCount: 0
        });

        emit WitnessRegistered(ndidsHash, witnessType, expiry);
    }

    /// @notice Revoke a witness credential immediately.
    function revokeWitness(bytes32 ndidsHash) external onlyAdmin {
        if (!_witnesses[ndidsHash].active) revert WitnessNotActive();
        _witnesses[ndidsHash].active = false;
        emit WitnessRevoked(ndidsHash);
    }

    /// @notice Renew a witness credential for another annual period.
    function renewWitness(bytes32 ndidsHash, uint256 newExpiry)
        external onlyAdmin
    {
        if (_witnesses[ndidsHash].ndidsHash == bytes32(0)) revert NotRegistered();
        if (newExpiry <= block.timestamp)                  revert InvalidExpiry();
        _witnesses[ndidsHash].expiry = newExpiry;
        _witnesses[ndidsHash].active = true;
        emit WitnessRenewed(ndidsHash, newExpiry);
    }

    // ── Witness Function ──────────────────────────────────────────────────

    /// @notice Witness an application by scanning the applicant's QR code.
    ///         The witnessHash is the NDIDS hash of the witnessing official.
    ///         Each application reference can only be witnessed once.
    /// @dev    RESEARCH PROTOTYPE: caller identity is not verified on-chain.
    ///         Production deployment requires EIP-712 witness signature.
    ///         In Phase 2: witness signs applicationRef with their wallet;
    ///         signature verified here against registered witness address.
    function attestApplication(
        bytes32 applicationRef,
        bytes32 witnessHash
    ) external {
        if (applicationRef == bytes32(0))       revert ZeroAddress();
        if (witnessHash    == bytes32(0))       revert ZeroAddress();
        if (_attestationExists[applicationRef]) revert AlreadyAttested();

        Witness storage w = _witnesses[witnessHash];
        if (!w.active)                   revert WitnessNotActive();
        if (w.expiry <= block.timestamp) revert WitnessExpired();

        _attestations[applicationRef] = Attestation({
            applicationRef: applicationRef,
            witnessHash:    witnessHash,
            witnessType:    w.witnessType,
            timestamp:      block.timestamp
        });
        _attestationExists[applicationRef] = true;
        w.attestationCount++;

        emit WitnessAttested(
            applicationRef,
            witnessHash,
            w.witnessType,
            block.timestamp
        );
    }

    // ── View Functions ────────────────────────────────────────────────────

    /// @notice Check if an NDIDS hash belongs to a valid, active witness.
    function isValidWitness(bytes32 ndidsHash)
        external view
        returns (bool valid, WitnessType witnessType)
    {
        Witness memory w = _witnesses[ndidsHash];
        valid       = w.active && w.expiry > block.timestamp;
        witnessType = w.witnessType;
    }

    /// @notice Retrieve attestation details for a given application reference.
    ///         Used by verify portal and ministry officer review.
    function getAttestation(bytes32 applicationRef)
        external view
        returns (
            bool        exists,
            bytes32     witnessHash,
            WitnessType witnessType,
            uint256     timestamp
        )
    {
        exists = _attestationExists[applicationRef];
        if (!exists) return (false, bytes32(0), WitnessType.PASTOR, 0);
        Attestation memory a = _attestations[applicationRef];
        return (true, a.witnessHash, a.witnessType, a.timestamp);
    }

    /// @notice Get full witness record. Admin only.
    function getWitness(bytes32 ndidsHash)
        external view onlyAdmin
        returns (Witness memory)
    {
        return _witnesses[ndidsHash];
    }
}
