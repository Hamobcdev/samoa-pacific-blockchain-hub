// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { NDIDSRegistry } from "./NDIDSRegistry.sol";
import { MinistryNode } from "./MinistryNode.sol";
import { AIDisbursementTracker } from "./AIDisbursementTracker.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import { ReentrancyGuardUpgradeable } from "./utils/ReentrancyGuardUpgradeable.sol";

/**
 * @title InteroperabilityHub
 * @notice Central registry that wires together all Samoa government ministry
 *         nodes, NDIDS, and the AID Disbursement Tracker.
 *
 * @dev This contract demonstrates the permissioned interoperability framework:
 *      - Each ministry is registered as a node with its own deployed contract
 *      - Cross-ministry read permissions are managed here
 *      - A cross-ministry workflow (e.g. NDIDS → Education → Benefit release)
 *        can be triggered and observed through this hub
 *      - The AID tracker is wired in so grant releases can reference ministry
 *        service records as on-chain evidence
 */
/// @notice Central registry and cross-ministry workflow hub.
/// Operates under MCIT Digital Economy Policy 2022.
/// BIS PFMI P11 compliance: legal basis documented.
contract InteroperabilityHub is Initializable, UUPSUpgradeable, Pausable, ReentrancyGuardUpgradeable {

    // ── Enums ────────────────────────────────────────────────────

    enum NodeType  { OPERATIONAL, OBSERVER, REGULATORY }
    enum GovBranch { EXECUTIVE, LEGISLATIVE, JUDICIAL, REGULATORY, SOE, ACADEMIC }

    // ── Structs ──────────────────────────────────────────────────

    struct NodeInfo {
        string    name;
        NodeType  nodeType;
        GovBranch branch;
        bool      active;
        uint256   registeredAt;
    }

    struct Ministry {
        string  name;
        string  code;
        address contractAddr;
        bool    active;
        uint256 registeredAt;
    }

    // ── State ────────────────────────────────────────────────────

    address public ADMIN;
    address public pauseAuthority;
    NDIDSRegistry         public ndids;
    AIDisbursementTracker public aidTracker;

    Ministry[] public ministries;
    mapping(string  => uint256) public ministryIndex;    // code    => index
    mapping(string  => bool)    public ministryExists;
    mapping(address => bool)    public isRegisteredNode; // contractAddr => bool (FIX 3)
    mapping(address => NodeInfo) public nodeInfo;

    // cross-ministry permission log
    struct Permission {
        string  fromCode;
        string  toCode;
        bool    active;
        uint256 grantedAt;
    }
    Permission[] public permissions;

    // workflow execution log
    struct WorkflowEvent {
        string  workflowType;
        bytes32 citizenHash;
        string  ministryCode;
        uint256 timestamp;
        bool    success;
    }
    WorkflowEvent[] public workflowLog;

    // ── OMW Maritime Clearance ────────────────────────────────────────────────
    struct OMWClearanceRecord {
        bytes32 vesselId;
        bytes32 declarationHash;
        uint8   ministryCount;
        uint8   clearedCount;
        bool    allCleared;
        uint256 submittedAt;
        uint256 finalClearedAt;
    }

    // ── Aviation Arrival Clearance (ICAO Annex 9 / WCO SAFE Framework) ────────
    struct ArrivalFlags {
        bool customsFlag;      // goods over limit or suspicious
        bool biosecurityFlag;  // food, plants, animals declared
        bool healthFlag;       // illness or health concern declared
        bool immigrationFlag;  // visa or permit concern
        bool currencyFlag;     // WST 20,000+ equivalent declared
        bool watchlistFlag;    // name match (always human review only)
        uint8 overallRisk;     // 0=GREEN 1=AMBER 2=RED (derived from flags)
    }

    struct ArrivalClearanceRecord {
        bytes32      passportHash;
        bytes32      declarationHash;
        ArrivalFlags flags;
        bool         cleared;
        uint256      submittedAt;
        uint256      clearedAt;
    }

    // ── Events ───────────────────────────────────────────────────

    event PauseAuthoritySet(address indexed authority);
    event MinistryRegistered(string code, string name, address contractAddr);
    event PermissionGranted(string fromCode, string toCode);
    event PermissionRevoked(string fromCode, string toCode);
    event WorkflowExecuted(string workflowType, bytes32 citizenHash, bool success);
    event NDIDSSet(address ndids);
    event AIDTrackerSet(address tracker);
    event ObserverRegistered(address indexed observer, string name, GovBranch branch);

    // ── OMW Events ────────────────────────────────────────────────────────────
    event OMWSubmissionAcknowledged(
        uint256 indexed clearanceId,
        bytes32 vesselId,
        uint256 submittedAt,
        uint8   ministryCount
    );
    event OMWClearanceInitiated(
        uint256 indexed clearanceId,
        bytes32 vesselId,
        bytes32 declarationHash,
        uint8   ministryCount,
        uint256 timestamp
    );
    event MinistryStatusUpdated(
        uint256 indexed clearanceId,
        bytes32 indexed ministryHash,
        uint8   status,
        bytes32 officerCredential,
        uint256 timestamp
    );
    event MinistryOMWRejected(
        uint256 indexed clearanceId,
        bytes32 indexed ministryHash,
        bytes32 rejectionCode,
        uint256 timestamp
    );
    event OMWAllCleared(
        uint256 indexed clearanceId,
        bytes32 vesselId,
        uint256 finalClearedAt
    );

    // ── Arrival Events ────────────────────────────────────────────────────────
    event ArrivalSubmissionAcknowledged(
        uint256 indexed clearanceId,
        bytes32 passportHash,
        uint256 submittedAt,
        uint8   overallRisk
    );
    event ArrivalWorkflowInitiated(
        uint256 indexed clearanceId,
        bytes32 passportHash,
        uint8   overallRisk,
        uint256 timestamp
    );
    event ArrivalCleared(
        uint256 indexed clearanceId,
        bytes32 passportHash,
        uint256 clearedAt
    );

    // ── Errors ───────────────────────────────────────────────────

    error Unauthorised();
    error MinistryNotFound();
    error AlreadyExists();
    error AlreadySet();                              // FIX 1: once-set guard
    error ZeroAddress();
    error EnrolmentStepFailed(string step);
    error UnregisteredMinistryNode(address node);   // FIX 3: node validation
    error VerificationExpired(bytes32 citizenHash); // CISA-1: expired NDIDS verification
    error InvalidClearance();
    error AlreadyComplete();
    error InvalidStatus();
    error InvalidRejectionCode();
    error AlreadyCleared();
    error InvalidMinistryCount();

    // ── Constructor / Initializer ────────────────────────────────

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin_) public initializer {
        if (admin_ == address(0)) revert ZeroAddress();
        __ReentrancyGuard_init();
        ADMIN = admin_;
        pauseAuthority = admin_;
    }

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }

    function _onlyAdmin() view internal {
        if (msg.sender != ADMIN) revert Unauthorised();
    }

    modifier onlyPauseAuthority() {
        if (msg.sender != pauseAuthority) revert Unauthorised();
        _;
    }

    // ── Setup ────────────────────────────────────────────────────

    /// @notice Set the NDIDS registry contract address (one-time).
    function setNDIDS(address _ndids) external onlyAdmin {
        if (address(ndids) != address(0)) revert AlreadySet();
        ndids = NDIDSRegistry(_ndids);
        emit NDIDSSet(_ndids);
    }

    /// @notice Set the AID disbursement tracker contract address (one-time).
    function setAIDTracker(address _tracker) external onlyAdmin {
        if (address(aidTracker) != address(0)) revert AlreadySet();
        aidTracker = AIDisbursementTracker(_tracker);
        emit AIDTrackerSet(_tracker);
    }

    // ── Ministry Registration ────────────────────────────────────

    /// @notice Register a ministry node contract with this hub.
    function registerMinistry(
        string calldata name,
        string calldata code,
        address contractAddr
    ) external onlyAdmin whenNotPaused {
        if (ministryExists[code]) revert AlreadyExists();
        ministryIndex[code] = ministries.length;
        ministryExists[code] = true;
        isRegisteredNode[contractAddr] = true;
        ministries.push(Ministry({
            name:         name,
            code:         code,
            contractAddr: contractAddr,
            active:       true,
            registeredAt: block.timestamp // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        }));
        emit MinistryRegistered(code, name, contractAddr);
    }

    /// @notice Register a read-only observer node (regulator, academic, SOE).
    function registerObserver(
        address observer,
        string calldata name,
        GovBranch branch
    ) external onlyAdmin whenNotPaused {
        nodeInfo[observer] = NodeInfo({
            name:         name,
            nodeType:     NodeType.OBSERVER,
            branch:       branch,
            active:       true,
            registeredAt: block.timestamp
        });
        emit ObserverRegistered(observer, name, branch);
    }

    // ── Permission Management ────────────────────────────────────

    /**
     * @notice Grant ministry B read access to ministry A's records
     */
    function grantPermission(string calldata fromCode, string calldata toCode)
        external onlyAdmin whenNotPaused
    {
        if (!ministryExists[fromCode] || !ministryExists[toCode])
            revert MinistryNotFound();

        Ministry storage from = ministries[ministryIndex[fromCode]];
        Ministry storage to   = ministries[ministryIndex[toCode]];

        MinistryNode(from.contractAddr).authoriseReader(to.contractAddr);

        permissions.push(Permission({
            fromCode:  fromCode,
            toCode:    toCode,
            active:    true,
            grantedAt: block.timestamp // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        }));

        emit PermissionGranted(fromCode, toCode);
    }

    /**
     * @notice Revoke ministry B's read access to ministry A's records.
     *         Calls revokeReader() on the from-node passing the to-node address.
     */
    function revokePermission(string calldata fromCode, string calldata toCode)
        external onlyAdmin whenNotPaused
    {
        if (!ministryExists[fromCode] || !ministryExists[toCode])
            revert MinistryNotFound();

        Ministry storage from = ministries[ministryIndex[fromCode]];
        Ministry storage to   = ministries[ministryIndex[toCode]];

        MinistryNode(from.contractAddr).revokeReader(to.contractAddr);

        emit PermissionRevoked(fromCode, toCode);
    }

    // ── Cross-Ministry Workflow: School Enrolment + Benefit ──────

    /**
     * @notice Execute the full child services workflow:
     *         1. Verify citizen identity via NDIDS
     *         2. Record school enrolment in Education/MCIL node
     *         3. Record benefit eligibility in MOF node
     *         This demonstrates end-to-end interoperability in a single tx.
     *
     * @param citizenHash   NDIDS hash of the child
     * @param educationNode Ministry of Education contract address
     * @param mofNode       MOF contract address
     * @param dataHash      Off-chain data hash (enrolment record)
     */
    function executeEnrolmentWorkflow(
        bytes32 citizenHash,
        address educationNode,
        address mofNode,
        bytes32 dataHash
    ) external onlyAdmin whenNotPaused nonReentrant returns (bool success) {

        // Validate both node addresses against the hub's own registry (FIX 3)
        if (!isRegisteredNode[educationNode]) revert UnregisteredMinistryNode(educationNode);
        if (!isRegisteredNode[mofNode])       revert UnregisteredMinistryNode(mofNode);

        // CISA-1: reject if citizen's NDIDS verification has expired
        if (!ndids.isVerificationCurrent(citizenHash)) revert VerificationExpired(citizenHash);

        // ── B4: CEI — write state BEFORE external calls ──────────
        // Record workflow attempt upfront; update success flag after
        uint256 logIndex = workflowLog.length;
        workflowLog.push(WorkflowEvent({
            workflowType: "ENROLMENT_AND_BENEFIT",
            citizenHash:  citizenHash,
            ministryCode: "MULTI",
            timestamp:    block.timestamp, // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
            success:      false   // default false, updated below if both succeed
        }));

        // ── External calls AFTER state write ─────────────────────

        // Step 1: Record school enrolment (Education node verifies via NDIDS)
        // B4 — capture return value, require success
        try MinistryNode(educationNode).recordService(
            citizenHash,
            "EDUCATION_ENROLMENT",
            dataHash,
            true  // verify via NDIDS
        ) returns (uint256) {
            // Step 2: Record benefit eligibility in MOF
            try MinistryNode(mofNode).recordService(
                citizenHash,
                "MOF_PAYMENT",
                dataHash,
                false  // trust education node's verification
            ) returns (uint256) {
                success = true;
                // B4 — update the pre-written log entry to success
                workflowLog[logIndex].success = true;
            } catch {
                success = false;
            }
        } catch {
            success = false;
        }



        emit WorkflowExecuted("ENROLMENT_AND_BENEFIT", citizenHash, success);
    }

    // ── Queries ──────────────────────────────────────────────────

    /// @notice Returns the total number of registered ministries.
    function getMinistryCount() external view returns (uint256) {
        return ministries.length;
    }

    /// @notice Returns the Ministry struct for a given ministry code.
    function getMinistry(string calldata code)
        external view returns (Ministry memory)
    {
        if (!ministryExists[code]) revert MinistryNotFound();
        return ministries[ministryIndex[code]];
    }

    /// @notice Returns a paginated slice of the workflow execution log.
    function getWorkflowLog(uint256 offset, uint256 limit)
        external view returns (WorkflowEvent[] memory slice)
    {
        uint256 total = workflowLog.length;
        uint256 end = offset + limit;
        if (end > total) end = total;
        if (offset >= total) return new WorkflowEvent[](0);
        slice = new WorkflowEvent[](end - offset);
        for (uint256 i = 0; i < slice.length; i++) {
            slice[i] = workflowLog[offset + i];
        }
    }

    /// @notice Returns the total number of workflow log entries.
    function getWorkflowLogLength() external view returns (uint256) {
        return workflowLog.length;
    }

    /// @notice Returns all cross-ministry permission records.
    function getPermissions() external view returns (Permission[] memory) {
        return permissions;
    }

    /// @notice Returns all registered ministry structs.
    function getAllMinistries() external view returns (Ministry[] memory) {
        return ministries;
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

    // ── Standardised OMW Rejection Codes ─────────────────────────────────────
    bytes32 public constant REJECT_BIOSECURITY_HOLD      = keccak256("BIOSECURITY_HOLD");
    bytes32 public constant REJECT_CUSTOMS_DUTY_UNPAID   = keccak256("CUSTOMS_DUTY_UNPAID");
    bytes32 public constant REJECT_DOCS_INCOMPLETE       = keccak256("DOCUMENTATION_INCOMPLETE");
    bytes32 public constant REJECT_HEALTH_INSPECTION     = keccak256("HEALTH_INSPECTION_REQUIRED");
    bytes32 public constant REJECT_IMMIGRATION_CLEARANCE = keccak256("IMMIGRATION_CLEARANCE_REQUIRED");
    bytes32 public constant REJECT_DANGEROUS_GOODS       = keccak256("DANGEROUS_GOODS_VIOLATION");
    bytes32 public constant REJECT_WATCHLIST_MATCH       = keccak256("WATCHLIST_MATCH_REVIEW");
    bytes32 public constant REJECT_PAYMENT_OUTSTANDING   = keccak256("PORT_DUES_OUTSTANDING");

    // ── OMW + Arrival Storage ─────────────────────────────────────────────────

    mapping(uint256 => OMWClearanceRecord)          public  omwClearances;       // slot 1
    mapping(uint256 => mapping(bytes32 => uint8))   private _ministryStatus;     // slot 2
    // 0=PENDING 1=IN_REVIEW 2=CLEARED 3=FLAGGED 4=REJECTED
    mapping(uint256 => mapping(bytes32 => bytes32)) private _officerCredential;  // slot 3
    mapping(uint256 => mapping(bytes32 => uint256)) private _ministryClearedAt;  // slot 4
    uint256 public totalOMWClearances;                                            // slot 5
    mapping(uint256 => ArrivalClearanceRecord)      public  arrivalClearances;   // slot 6
    uint256 public totalArrivalClearances;                                        // slot 7

    // ── OMW Maritime Functions ────────────────────────────────────────────────

    /// @notice Initiate an OMW maritime clearance workflow.
    ///         Routes vessel declaration to all required ministry nodes.
    ///         Emits acknowledgement event for shipping agent receipt.
    function executeOMWClearance(
        bytes32            vesselId,
        bytes32            declarationHash,
        bytes32[] calldata ministryHashes
    ) external onlyAdmin returns (uint256 clearanceId) {
        if (vesselId        == bytes32(0)) revert ZeroAddress();
        if (declarationHash == bytes32(0)) revert ZeroAddress();
        if (ministryHashes.length == 0)   revert InvalidMinistryCount();
        if (ministryHashes.length > 10)   revert InvalidMinistryCount();

        clearanceId = totalOMWClearances++;

        omwClearances[clearanceId] = OMWClearanceRecord({
            vesselId:        vesselId,
            declarationHash: declarationHash,
            ministryCount:   uint8(ministryHashes.length),
            clearedCount:    0,
            allCleared:      false,
            submittedAt:     block.timestamp,
            finalClearedAt:  0
        });

        for (uint256 i = 0; i < ministryHashes.length; i++) {
            _ministryStatus[clearanceId][ministryHashes[i]] = 0;
        }

        emit OMWSubmissionAcknowledged(
            clearanceId, vesselId, block.timestamp, uint8(ministryHashes.length)
        );
        emit OMWClearanceInitiated(
            clearanceId, vesselId, declarationHash,
            uint8(ministryHashes.length), block.timestamp
        );
    }

    /// @notice Update a ministry's clearance status for an OMW workflow.
    ///         Status: 0=PENDING 1=IN_REVIEW 2=CLEARED 3=FLAGGED
    ///         Use rejectMinistryOMWStatus() for status 4 (REJECTED).
    function updateMinistryOMWStatus(
        uint256 clearanceId,
        bytes32 ministryHash,
        uint8   status,
        bytes32 officerCredential
    ) external onlyAdmin {
        if (clearanceId >= totalOMWClearances)     revert InvalidClearance();
        if (status > 3)                            revert InvalidStatus();
        if (omwClearances[clearanceId].allCleared) revert AlreadyComplete();

        uint8 previousStatus = _ministryStatus[clearanceId][ministryHash];
        _ministryStatus[clearanceId][ministryHash]    = status;
        _officerCredential[clearanceId][ministryHash] = officerCredential;

        if (status == 2 && previousStatus != 2) {
            _ministryClearedAt[clearanceId][ministryHash] = block.timestamp;
            omwClearances[clearanceId].clearedCount++;

            if (omwClearances[clearanceId].clearedCount
                == omwClearances[clearanceId].ministryCount)
            {
                omwClearances[clearanceId].allCleared     = true;
                omwClearances[clearanceId].finalClearedAt = block.timestamp;
                emit OMWAllCleared(
                    clearanceId,
                    omwClearances[clearanceId].vesselId,
                    block.timestamp
                );
            }
        }

        emit MinistryStatusUpdated(
            clearanceId, ministryHash, status, officerCredential, block.timestamp
        );
    }

    /// @notice Formally reject an OMW ministry clearance with a reason code.
    ///         Uses standardised rejection code constants defined above.
    function rejectMinistryOMWStatus(
        uint256 clearanceId,
        bytes32 ministryHash,
        bytes32 rejectionCode
    ) external onlyAdmin {
        if (clearanceId >= totalOMWClearances)     revert InvalidClearance();
        if (omwClearances[clearanceId].allCleared) revert AlreadyComplete();
        if (rejectionCode == bytes32(0))           revert InvalidRejectionCode();

        _ministryStatus[clearanceId][ministryHash]    = 4;
        _officerCredential[clearanceId][ministryHash] = rejectionCode;

        emit MinistryOMWRejected(
            clearanceId, ministryHash, rejectionCode, block.timestamp
        );
        emit MinistryStatusUpdated(
            clearanceId, ministryHash, 4, rejectionCode, block.timestamp
        );
    }

    /// @notice Return an OMW clearance record as a struct (public mapping returns tuple).
    function getOMWRecord(uint256 id) external view returns (OMWClearanceRecord memory) {
        return omwClearances[id];
    }

    /// @notice Return an arrival clearance record as a struct (public mapping returns tuple).
    function getArrivalRecord(uint256 id) external view returns (ArrivalClearanceRecord memory) {
        return arrivalClearances[id];
    }

    /// @notice Get a ministry's current status in an OMW clearance.
    function getMinistryOMWStatus(
        uint256 clearanceId,
        bytes32 ministryHash
    )
        external view
        returns (uint8 status, bytes32 officerCred, uint256 clearedAt)
    {
        return (
            _ministryStatus[clearanceId][ministryHash],
            _officerCredential[clearanceId][ministryHash],
            _ministryClearedAt[clearanceId][ministryHash]
        );
    }

    // ── Aviation Arrival Functions ────────────────────────────────────────────

    /// @notice Initiate aviation passenger arrival clearance.
    ///         Implements ICAO Annex 9 / WCO SAFE Framework per-authority flags.
    ///         GREEN (no flags) auto-clears on submission.
    ///         AMBER/RED require officer review and manual clearArrival() call.
    function executeArrivalWorkflow(
        bytes32 passportHash,
        bytes32 declarationHash,
        bool    customsFlag,
        bool    biosecurityFlag,
        bool    healthFlag,
        bool    immigrationFlag,
        bool    currencyFlag,
        bool    watchlistFlag
    ) external onlyAdmin returns (uint256 clearanceId) {
        if (passportHash    == bytes32(0)) revert ZeroAddress();
        if (declarationHash == bytes32(0)) revert ZeroAddress();

        uint8 overallRisk = 0;
        if (watchlistFlag || (biosecurityFlag && customsFlag)) {
            overallRisk = 2;
        } else if (customsFlag || biosecurityFlag || healthFlag ||
                   immigrationFlag || currencyFlag) {
            overallRisk = 1;
        }

        ArrivalFlags memory flags = ArrivalFlags({
            customsFlag:     customsFlag,
            biosecurityFlag: biosecurityFlag,
            healthFlag:      healthFlag,
            immigrationFlag: immigrationFlag,
            currencyFlag:    currencyFlag,
            watchlistFlag:   watchlistFlag,
            overallRisk:     overallRisk
        });

        bool autoCleared = (overallRisk == 0);
        clearanceId = totalArrivalClearances++;

        arrivalClearances[clearanceId] = ArrivalClearanceRecord({
            passportHash:    passportHash,
            declarationHash: declarationHash,
            flags:           flags,
            cleared:         autoCleared,
            submittedAt:     block.timestamp,
            clearedAt:       autoCleared ? block.timestamp : 0
        });

        emit ArrivalSubmissionAcknowledged(
            clearanceId, passportHash, block.timestamp, overallRisk
        );
        emit ArrivalWorkflowInitiated(
            clearanceId, passportHash, overallRisk, block.timestamp
        );

        if (autoCleared) {
            emit ArrivalCleared(clearanceId, passportHash, block.timestamp);
        }
    }

    /// @notice Manually clear an arrival after officer inspection (AMBER/RED).
    function clearArrival(uint256 clearanceId) external onlyAdmin {
        if (clearanceId >= totalArrivalClearances)  revert InvalidClearance();
        if (arrivalClearances[clearanceId].cleared) revert AlreadyCleared();
        arrivalClearances[clearanceId].cleared   = true;
        arrivalClearances[clearanceId].clearedAt = block.timestamp;
        emit ArrivalCleared(
            clearanceId,
            arrivalClearances[clearanceId].passportHash,
            block.timestamp
        );
    }

    /// @dev Storage gap for UUPS upgrade safety.
    /// Reserves 43 slots (reduced from 50 by 7 new storage slots).
    uint256[43] private __gap;
}
