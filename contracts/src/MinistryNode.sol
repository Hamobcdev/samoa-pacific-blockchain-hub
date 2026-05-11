// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { NDIDSRegistry } from "./NDIDSRegistry.sol";

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
contract MinistryNode {

    // ── Identity ─────────────────────────────────────────────────

    string  public ministryName;
    string  public ministryCode;
    address public immutable MINISTRY_ADMIN;
    address public immutable DEPLOYER;
    address public immutable NDIDS_ADDRESS;
    address public hub;

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

    // ── Cross-Ministry Sharing ───────────────────────────────────

    // which other ministry contracts may read our records
    mapping(address => bool) public authorisedReaders;

    // ── Events ───────────────────────────────────────────────────

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

    error Unauthorised();
    error ReadAccessDenied();
    error ZeroAddress();
    error HubAlreadySet();
    error MigrationNotPending();
    error TimelockNotExpired();

    // ── Constructor ──────────────────────────────────────────────

    constructor(
        string memory _name,
        string memory _code,
        address _admin,
        address _ndids
    ) {
        if (_admin == address(0)) revert ZeroAddress();
        if (_ndids == address(0)) revert ZeroAddress();
        ministryName  = _name;
        ministryCode  = _code;
        MINISTRY_ADMIN = _admin;
        NDIDS_ADDRESS = _ndids;
        DEPLOYER = msg.sender;
    }

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }
    function _onlyAdmin() internal view {
        if (msg.sender != MINISTRY_ADMIN) revert Unauthorised();
        
    }

    modifier onlyAdminOrHub() {
        _onlyAdminOrHub();
        _;
    }
     
    function _onlyAdminOrHub() internal view {
        if (msg.sender != MINISTRY_ADMIN && msg.sender != hub) revert Unauthorised();
        
    }

    modifier onlyAuthorised() {
         _onlyAuthorized();
         _;
    }
    function _onlyAuthorized() internal view {
        if (msg.sender != MINISTRY_ADMIN && !authorisedReaders[msg.sender])
            revert ReadAccessDenied();
    }    
    

    function setHub(address _hub) external {
        if (msg.sender != DEPLOYER && msg.sender != MINISTRY_ADMIN) revert Unauthorised();
        if (_hub == address(0)) revert ZeroAddress();
        if (hub != address(0)) revert HubAlreadySet();
        emit HubSet(address(0), _hub);
        hub = _hub;
    }

    // ── Hub Migration (48-hour timelock) ─────────────────────────

    function proposeHubMigration(address _newHub) external onlyAdmin {
        if (_newHub == address(0)) revert ZeroAddress();
        pendingHub = _newHub;
        migrationProposedAt = block.timestamp;
        emit HubMigrationProposed(_newHub, block.timestamp + HUB_MIGRATION_DELAY);
    }

    function confirmHubMigration() external onlyAdmin {
        if (pendingHub == address(0)) revert MigrationNotPending();
        if (block.timestamp < migrationProposedAt + HUB_MIGRATION_DELAY) revert TimelockNotExpired();
        address previous = hub;
        hub = pendingHub;
        pendingHub = address(0);
        migrationProposedAt = 0;
        emit HubMigrationConfirmed(previous, hub);
    }

    function cancelHubMigration() external onlyAdmin {
        if (pendingHub == address(0)) revert MigrationNotPending();
        address cancelled = pendingHub;
        pendingHub = address(0);
        migrationProposedAt = 0;
        emit HubMigrationCancelled(cancelled);
    }

    // ── Service Recording ────────────────────────────────────────

    /**
     * @notice Record a service delivery event for a citizen.
     *         Optionally verifies identity through NDIDS first.
     */
    function recordService(
        bytes32 citizenHash,
        string calldata serviceType,
        bytes32 dataHash,
        bool verifyViaNDIDS
    ) external onlyAdminOrHub returns (uint256 recordId) {
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
            timestamp:     block.timestamp,
            ndidsVerified: verified
        }));

        citizenRecordIds[citizenHash].push(recordId);

        emit ServiceDelivered(recordId, citizenHash, serviceType, verified, block.timestamp);
    }

    // ── Cross-Ministry Read Access ───────────────────────────────

    function authoriseReader(address reader) external onlyAdminOrHub {
        authorisedReaders[reader] = true;
        emit ReaderAuthorised(reader);
    }

    function revokeReader(address reader) external onlyAdminOrHub {
        authorisedReaders[reader] = false;
        emit ReaderRevoked(reader);
    }

    // ── Queries ──────────────────────────────────────────────────

    function getRecord(uint256 recordId)
        external
        view
        onlyAuthorised
        returns (ServiceRecord memory)
    {
        return _records[recordId];
    }

    function getCitizenRecords(bytes32 citizenHash)
        external
        view
        onlyAuthorised
        returns (uint256[] memory)
    {
        return citizenRecordIds[citizenHash];
    }

    function totalRecords() external view returns (uint256) {
        return _records.length;
    }
}
