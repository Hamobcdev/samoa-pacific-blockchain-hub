// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title NDIDSRegistry
 * @notice National Digital Identification System (NDIDS) - Samoa
 * @dev Stores hashed citizen identity anchors. No PII is stored on-chain.
 *      Only a keccak256 hash of (citizenId + salt) is recorded, enabling
 *      zero-knowledge verification by authorised ministry contracts.
 *
 *      Part of the Samoa Pacific Blockchain Hub - UNICEF Venture Fund PoC
 *      https://github.com/Hamobcdev/samoa-pacific-blockchain-hub
 */
/// @notice Samoa National Digital Identity Registry.
/// Operates under authority of the CBS Act 2015.
/// BIS PFMI P11 compliance: legal basis documented.
contract NDIDSRegistry is Initializable, UUPSUpgradeable {

    // ── State ────────────────────────────────────────────────────

    address public ADMIN;                       // NDIDS authority (SBS/MCIT)
    uint256 public totalRegistered;

    // citizenHash => registered
    mapping(bytes32 => bool) private _registered;

    // citizenHash => which ministry contracts may read
    mapping(bytes32 => mapping(address => bool)) private _readAccess;

    // citizenHash => service delivery log count
    mapping(bytes32 => uint256) public serviceCount;

    // ── Verification Expiry (CISA-1) ─────────────────────────────
    uint256 public constant MAX_VERIFICATION_AGE = 365 days;
    mapping(bytes32 => uint256) public verifiedAt;

    // ── Events ───────────────────────────────────────────────────

    event CitizenRegistered(bytes32 indexed citizenHash, uint256 timestamp);
    event ReadAccessGranted(bytes32 indexed citizenHash, address indexed ministry);
    event ReadAccessRevoked(bytes32 indexed citizenHash, address indexed ministry);
    event IdentityVerified(bytes32 indexed citizenHash, address indexed verifier, uint256 timestamp);
    event VerificationRenewed(bytes32 indexed citizenHash);

    // ── Errors ───────────────────────────────────────────────────

    error Unauthorised();
    error AlreadyRegistered();
    error NotRegistered(bytes32 citizenHash);
    error AccessDenied();
    error ZeroAddress();

    // ── Constructor / Initializer ────────────────────────────────

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin_) public initializer {
        if (admin_ == address(0)) revert ZeroAddress();
        ADMIN = admin_;
    }

    // ── Modifiers ────────────────────────────────────────────────

    modifier onlyAdmin() {
        if (msg.sender != ADMIN) revert Unauthorised();
        _;
    }

    // ── Registration ─────────────────────────────────────────────

    /**
     * @notice Register a citizen. Called by NDIDS authority only.
     * @param citizenHash keccak256(abi.encodePacked(citizenId, salt))
     *        Salt is kept off-chain by the citizen — preserves privacy.
     */
    function registerCitizen(bytes32 citizenHash) external onlyAdmin {
        if (_registered[citizenHash]) revert AlreadyRegistered();
        _registered[citizenHash] = true;
        totalRegistered++;
        verifiedAt[citizenHash] = block.timestamp;
        emit CitizenRegistered(citizenHash, block.timestamp); // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
    }

    /**
     * @notice Batch register multiple citizens (gas efficient for bulk import)
     * @dev Uses local accumulator to minimise SSTORE ops on totalRegistered
     */
    function batchRegister(bytes32[] calldata hashes) external onlyAdmin {
        uint256 newRegistrations = 0;
        for (uint256 i = 0; i < hashes.length; i++) {
            // duplicate check — skip already registered hashes silently
            if (!_registered[hashes[i]]) {
                _registered[hashes[i]] = true;
                verifiedAt[hashes[i]] = block.timestamp;
                newRegistrations++;         // ← cheap memory write, not storage
                emit CitizenRegistered(hashes[i], block.timestamp); // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
            }
        }
        // single storage write after loop completes
        totalRegistered += newRegistrations;
    }

    // ── Access Control ───────────────────────────────────────────

    /**
     * @notice Grant a ministry contract permission to verify this citizen
     * @dev Called by ADMIN — citizen consent recorded off-chain per GDPR/privacy law
     */
    function grantReadAccess(bytes32 citizenHash, address ministry) external onlyAdmin {
        if (!_registered[citizenHash]) revert NotRegistered(citizenHash);
        _readAccess[citizenHash][ministry] = true;
        emit ReadAccessGranted(citizenHash, ministry);
    }

    /// @notice Revoke a ministry contract's permission to verify this citizen.
    function revokeReadAccess(bytes32 citizenHash, address ministry) external onlyAdmin {
        if (!_registered[citizenHash]) revert NotRegistered(citizenHash);
        _readAccess[citizenHash][ministry] = false;
        emit ReadAccessRevoked(citizenHash, ministry);
    }

    // ── Verification ─────────────────────────────────────────────

    /**
     * @notice Called by authorised ministry contracts to verify a citizen
     * @return true if the hash is registered and caller has read access
     */
    function verifyCitizen(bytes32 citizenHash) external returns (bool) {
        if (!_registered[citizenHash]) return false;
        if (!_readAccess[citizenHash][msg.sender]) revert AccessDenied();
        serviceCount[citizenHash]++;
        emit IdentityVerified(citizenHash, msg.sender, block.timestamp); // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        return true;
    }

    /**
     * @notice Read-only check (does not emit event, for UI queries)
     */
    function isRegistered(bytes32 citizenHash) external view returns (bool) {
        return _registered[citizenHash];
    }

    /// @notice Check whether a ministry contract has read access for a citizen hash.
    function hasAccess(bytes32 citizenHash, address ministry) external view returns (bool) {
        return _readAccess[citizenHash][ministry];
    }

    // ── Verification Expiry (CISA-1) ─────────────────────────────

    /// @notice Returns true if the citizen's NDIDS verification is within MAX_VERIFICATION_AGE.
    function isVerificationCurrent(bytes32 citizenHash) public view returns (bool) {
        return block.timestamp - verifiedAt[citizenHash] < MAX_VERIFICATION_AGE;
    }

    /// @notice Renew the verification timestamp for a citizen, resetting their 365-day window.
    function renewVerification(bytes32 citizenHash) external onlyAdmin {
        verifiedAt[citizenHash] = block.timestamp;
        emit VerificationRenewed(citizenHash);
    }

    // ── UUPS ─────────────────────────────────────────────────────

    function _authorizeUpgrade(address newImplementation)
        internal override onlyAdmin {}


    // ── CBS-BLOCKED: EIP-712 Citizen Consent ─────────────────────
    //
    // The following is a DRAFT for on-chain citizen consent using EIP-712
    // typed-data signatures. Blocked pending legal review from SBS/MCIT.
    //
    // When unblocked, citizens would sign a ConsentMessage off-chain and
    // submit the signature here, removing the need for ADMIN to grant access
    // on their behalf. This strengthens the self-sovereign identity model.
    //
    // Planned interface:
    //
    //   bytes32 private constant CONSENT_TYPEHASH = keccak256(
    //       "CitizenConsent(bytes32 citizenHash,address ministry,uint256 nonce,uint256 expiry)"
    //   );
    //   mapping(bytes32 => uint256) public consentNonces;
    //
    //   function citizenConsent(
    //       bytes32 citizenHash,
    //       address ministry,
    //       uint256 expiry,
    //       bytes calldata signature
    //   ) external {
    //       require(block.timestamp <= expiry, "Consent expired");
    //       uint256 nonce = consentNonces[citizenHash]++;
    //       bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
    //           CONSENT_TYPEHASH, citizenHash, ministry, nonce, expiry
    //       )));
    //       address signer = ECDSA.recover(digest, signature);
    //       // signer must match the citizen's registered wallet (stored off-chain or
    //       // as an additional on-chain mapping citizenHash => walletAddress)
    //       require(signer == _citizenWallet[citizenHash], "Invalid consent signature");
    //       _readAccess[citizenHash][ministry] = true;
    //       emit ReadAccessGranted(citizenHash, ministry);
    //   }
    //
    // Requires: OpenZeppelin EIP712 + ECDSA, a citizenHash => wallet mapping,
    // and a citizen wallet registration flow (separate SBS process).
}
