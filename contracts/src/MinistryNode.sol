// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NDIDSRegistry.sol";

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
    address public immutable ministryAdmin;
    address public immutable deployer;
    NDIDSRegistry public immutable ndids;
    address public hub;

    // ── Service Records ──────────────────────────────────────────

    struct ServiceRecord {
        bytes32 citizenHash;      // NDIDS hash — no PII
        string  serviceType;      // e.g. "SCHOOL_ENROLMENT", "BENEFIT_PAYMENT"
        bytes32 dataHash;         // hash of off-chain service data
        uint256 timestamp;
        bool    ndidsVerified;    // was identity confirmed via NDIDS?
    }

    ServiceRecord[] public records;
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

    // ── Errors ───────────────────────────────────────────────────

    error Unauthorised();
    error ReadAccessDenied();

    // ── Constructor ──────────────────────────────────────────────

    constructor(
        string memory _name,
        string memory _code,
        address _admin,
        address _ndids
    ) {
        ministryName  = _name;
        ministryCode  = _code;
        ministryAdmin = _admin;
        ndids         = NDIDSRegistry(_ndids);
        deployer      = msg.sender;
    }

    modifier onlyAdmin() {
        if (msg.sender != ministryAdmin) revert Unauthorised();
        _;
    }

    modifier onlyAdminOrHub() {
        if (msg.sender != ministryAdmin && msg.sender != hub) revert Unauthorised();
        _;
    }

    modifier onlyAuthorised() {
        if (msg.sender != ministryAdmin && !authorisedReaders[msg.sender])
            revert ReadAccessDenied();
        _;
    }

    function setHub(address _hub) external {
        if (hub != address(0)) revert Unauthorised();
        if (msg.sender != deployer && msg.sender != ministryAdmin) revert Unauthorised();
        hub = _hub;
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
            verified = ndids.verifyCitizen(citizenHash);
        }

        recordId = records.length;
        records.push(ServiceRecord({
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
        return records[recordId];
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
        return records.length;
    }
}
