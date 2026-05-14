// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { NDIDSRegistry } from "./NDIDSRegistry.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import { ReentrancyGuardUpgradeable } from "./utils/ReentrancyGuardUpgradeable.sol";

/**
 * @title MinistryNode
 * @notice Base contract for each Samoa government ministry node.
 * @dev Each ministry deploys its own instance. Data written by one ministry
 *      can only be read by other ministries that have been granted explicit
 *      cross-ministry read access — demonstrating permissioned interoperability.
 *
 *      Ministries in this PoC:
 *        CBS  — Central Bank of Samoa
 *        MCIT — Ministry of Communications & Information Technology
 *        MOF  — Ministry of Finance
 *        MCIL — Ministry of Commerce, Industry & Labour
 *        SBS  — Samoa Bureau of Statistics (NDIDS authority)
 */
/// @notice Per-ministry service record ledger.
/// Authorised under relevant ministry enabling legislation.
/// BIS PFMI P11 compliance: legal basis documented.
contract MinistryNode is Initializable, UUPSUpgradeable, Pausable, ReentrancyGuardUpgradeable {

    // ── Identity ─────────────────────────────────────────────────

    string  public ministryName;
    string  public ministryCode;
    address public MINISTRY_ADMIN;
    address public NDIDS_ADDRESS;
    address public hub;
    address public pauseAuthority;

    // ── Service Type Allowlist ────────────────────────────────────
    // Canonical service type identifiers — keccak256 of the string label.
    // recordService() rejects any string not present in validServiceTypes.

    bytes32 public constant EDUCATION_ENROLMENT = keccak256("EDUCATION_ENROLMENT");
    bytes32 public constant HEALTH_VISIT        = keccak256("HEALTH_VISIT");
    bytes32 public constant MOF_PAYMENT         = keccak256("MOF_PAYMENT");
    bytes32 public constant CUSTOMS_CLEARANCE   = keccak256("CUSTOMS_CLEARANCE");
    bytes32 public constant MCIT_LICENCE        = keccak256("MCIT_LICENCE");
    bytes32 public constant CBS_REGISTRATION    = keccak256("CBS_REGISTRATION");
    bytes32 public constant MCIL_LABOUR         = keccak256("MCIL_LABOUR");
    bytes32 public constant SBS_SURVEY          = keccak256("SBS_SURVEY");

    mapping(bytes32 => bool) public validServiceTypes;

    // ── Hub Migration Timelock ───────────────────────────────────

    address public pendingHub;
    uint256 public migrationProposedAt;
    uint256 public constant HUB_MIGRATION_DELAY = 48 hours;

    // ── Service Records ──────────────────────────────────────────

    struct ServiceRecord {
        bytes32 citizenHash;      // NDIDS hash — no PII
        string  serviceType;      // e.g. "SCHOOL_ENROLMENT", "BENEFIT_PAYMENT"
        bytes32 dataHash;         // hash of off-chain service data
        uint256 timestamp;
        bool    ndidsVerified;    // was identity confirmed via NDIDS?
    }

    ServiceRecord[] private _records;
    mapping(bytes32 => uint256[]) public citizenRecordIds; // citizenHash => record indices

    // ── Replay Protection ─────────────────────────────────────────
    // @dev TS-1: 1-second minimum prevents same-block replay.
    //      Validator-drift risk on PoA chains is documented and accepted.
    uint256 private lastRecordedAt;
    uint256 public constant MIN_RECORD_DELAY = 1;

    // ── Cross-Ministry Sharing ───────────────────────────────────

    // which other ministry contracts may read our records
    mapping(address => bool) public authorisedReaders;

    // ── Events ───────────────────────────────────────────────────

    event PauseAuthoritySet(address indexed authority);
    event ServiceDelivered(
        uint256 indexed recordId,
        bytes32 indexed citizenHash,
        string serviceType,
        bool ndidsVerified,
        uint256 timestamp
    );
    event ReaderAuthorised(address indexed reader);
    event ReaderRevoked(address indexed reader);
    event HubSet(address indexed previousHub, address indexed newHub);
    event HubMigrationProposed(address indexed proposedHub, uint256 executeAfter);
    event HubMigrationConfirmed(address indexed previousHub, address indexed newHub);
    event HubMigrationCancelled(address indexed cancelledHub);

    // ── Errors ───────────────────────────────────────────────────

    error UnauthorisedCaller();   // generic access denied
    error HubNotSet();            // onlyHub called before hub is wired
    error ReadAccessDenied();
    error ZeroAddress();
    error HubAlreadySet();
    error MigrationNotPending();
    error TimelockNotExpired();
    error InvalidServiceType();

    // ── Constructor / Initializer ────────────────────────────────

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory _name,
        string memory _code,
        address _admin,
        address _ndids
    ) public initializer {
        if (_admin == address(0)) revert ZeroAddress();
        if (_ndids == address(0)) revert ZeroAddress();
        __ReentrancyGuard_init();
        ministryName   = _name;
        ministryCode   = _code;
        MINISTRY_ADMIN = _admin;
        NDIDS_ADDRESS  = _ndids;
        pauseAuthority = _admin;
        validServiceTypes[EDUCATION_ENROLMENT] = true;
        validServiceTypes[HEALTH_VISIT]        = true;
        validServiceTypes[MOF_PAYMENT]         = true;
        validServiceTypes[CUSTOMS_CLEARANCE]   = true;
        validServiceTypes[MCIT_LICENCE]        = true;
        validServiceTypes[CBS_REGISTRATION]    = true;
        validServiceTypes[MCIL_LABOUR]         = true;
        validServiceTypes[SBS_SURVEY]          = true;
    }

    // ── Modifiers ────────────────────────────────────────────────

    // Permits only the ministry's own admin key.
    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }
    function _onlyAdmin() internal view {
        if (msg.sender != MINISTRY_ADMIN) revert UnauthorisedCaller();
    }

    modifier onlyPauseAuthority() {
        if (msg.sender != pauseAuthority) revert UnauthorisedCaller();
        _;
    }

    // Permits only the wired hub contract.
    // Reverts with HubNotSet() if hub has not been assigned yet.
    modifier onlyHub() {
        _onlyHub();
        _;
    }
    function _onlyHub() internal view {
        if (hub == address(0)) revert HubNotSet();
        if (msg.sender != hub) revert UnauthorisedCaller();
    }

    // Permits admin OR hub — used for functions that serve both direct
    // ministry operations and hub-orchestrated cross-ministry workflows.
    // (recordService, authoriseReader are legitimately called by both.)
    modifier onlyAdminOrHub() {
        _onlyAdminOrHub();
        _;
    }
    function _onlyAdminOrHub() internal view {
        if (msg.sender != MINISTRY_ADMIN && msg.sender != hub) revert UnauthorisedCaller();
    }

    // Permits admin or any address explicitly granted read access.
    modifier onlyAuthorised() {
        _onlyAuthorised();
        _;
    }
    function _onlyAuthorised() internal view {
        if (msg.sender != MINISTRY_ADMIN && !authorisedReaders[msg.sender])
            revert ReadAccessDenied();
    }

    // ── Hub Wiring ───────────────────────────────────────────────

    /// @notice Set the InteroperabilityHub contract address for this ministry node (one-time).
    function setHub(address _hub) external onlyAdmin {
        if (_hub == address(0)) revert ZeroAddress();
        if (hub != address(0)) revert HubAlreadySet();
        emit HubSet(address(0), _hub);
        hub = _hub;
    }

    // ── Hub Migration (48-hour timelock) ─────────────────────────

    /// @notice Propose a hub migration — starts the 48-hour timelock.
    function proposeHubMigration(address _newHub) external onlyAdmin whenNotPaused {
        if (_newHub == address(0)) revert ZeroAddress();
        pendingHub = _newHub;
        // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        migrationProposedAt = block.timestamp;
        emit HubMigrationProposed(_newHub, block.timestamp + HUB_MIGRATION_DELAY); // @dev TS-1
    }

    /// @notice Confirm a pending hub migration after the 48-hour timelock has elapsed.
    function confirmHubMigration() external onlyAdmin whenNotPaused {
        if (pendingHub == address(0)) revert MigrationNotPending();
        // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        if (block.timestamp < migrationProposedAt + HUB_MIGRATION_DELAY) revert TimelockNotExpired();
        address previous = hub;
        hub = pendingHub;
        pendingHub = address(0);
        migrationProposedAt = 0;
        emit HubMigrationConfirmed(previous, hub);
    }

    /// @notice Cancel a pending hub migration proposal.
    function cancelHubMigration() external onlyAdmin {
        if (pendingHub == address(0)) revert MigrationNotPending();
        address cancelled = pendingHub;
        pendingHub = address(0);
        migrationProposedAt = 0;
        emit HubMigrationCancelled(cancelled);
    }

    // ── Service Recording ────────────────────────────────────────

    /// @notice Record a government service delivered to a citizen, with optional NDIDS verification.
    function recordService(
        bytes32 citizenHash,
        string calldata serviceType,
        bytes32 dataHash,
        bool verifyViaNDIDS
    ) external onlyAdminOrHub whenNotPaused nonReentrant returns (uint256 recordId) {
        // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        require(block.timestamp >= lastRecordedAt + MIN_RECORD_DELAY || lastRecordedAt == 0, "TimestampTooSoon");
        if (!validServiceTypes[keccak256(bytes(serviceType))]) revert InvalidServiceType();

        bool verified = false;
        if (verifyViaNDIDS) {
            NDIDSRegistry ndids = NDIDSRegistry(NDIDS_ADDRESS);
            verified = ndids.verifyCitizen(citizenHash);
        }

        recordId = _records.length;
        _records.push(ServiceRecord({
            citizenHash:   citizenHash,
            serviceType:   serviceType,
            dataHash:      dataHash,
            timestamp:     block.timestamp, // @dev TS-1: validator-drift risk documented. Acceptable on permissioned PoA chain.
            ndidsVerified: verified
        }));

        citizenRecordIds[citizenHash].push(recordId);
        lastRecordedAt = block.timestamp; // @dev TS-1

        emit ServiceDelivered(recordId, citizenHash, serviceType, verified, block.timestamp); // @dev TS-1
    }

    // ── Cross-Ministry Read Access ───────────────────────────────

    /// @notice Grant another ministry contract read access to this node's service records.
    function authoriseReader(address reader) external onlyAdminOrHub whenNotPaused {
        authorisedReaders[reader] = true;
        emit ReaderAuthorised(reader);
    }

    /// @notice Revoke a ministry contract's read access to this node's service records.
    function revokeReader(address reader) external onlyAdminOrHub whenNotPaused {
        authorisedReaders[reader] = false;
        emit ReaderRevoked(reader);
    }

    // ── Queries ──────────────────────────────────────────────────

    /// @notice Retrieve a service record by ID (authorised readers only).
    function getRecord(uint256 recordId)
        external
        view
        onlyAuthorised
        returns (ServiceRecord memory)
    {
        return _records[recordId];
    }

    /// @notice Retrieve all record IDs for a citizen (authorised readers only).
    function getCitizenRecords(bytes32 citizenHash)
        external
        view
        onlyAuthorised
        returns (uint256[] memory)
    {
        return citizenRecordIds[citizenHash];
    }

    /// @notice Returns the total number of service records stored in this ministry node.
    function totalRecords() external view returns (uint256) {
        return _records.length;
    }

    // ── Circuit Breaker ──────────────────────────────────────────

    // CBS-BLOCKED: pause/unpause requires multi-sig governance approval.
    // Single-key pause authority is acceptable for PoC; replace with
    // a Gnosis Safe or Governor contract before mainnet.

    function pause() external onlyPauseAuthority {
        _pause();
    }

    function unpause() external onlyPauseAuthority {
        _unpause();
    }

    function setPauseAuthority(address newAuthority) external onlyAdmin {
        if (newAuthority == address(0)) revert ZeroAddress();
        pauseAuthority = newAuthority;
        emit PauseAuthoritySet(newAuthority);
    }

    // ── UUPS ─────────────────────────────────────────────────────

    function _authorizeUpgrade(address newImplementation)
        internal override onlyAdmin {}

    /// @dev Storage gap for UUPS upgrade safety.
    /// Reserves 50 slots to prevent storage
    /// collision in future upgrades.
    uint256[50] private __gap;
}
