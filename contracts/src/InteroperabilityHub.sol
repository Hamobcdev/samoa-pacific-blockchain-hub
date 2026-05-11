// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { NDIDSRegistry } from "./NDIDSRegistry.sol";
import { MinistryNode } from "./MinistryNode.sol";
import { AIDisbursementTracker } from "./AIDisbursementTracker.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

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
contract InteroperabilityHub is ReentrancyGuard {

    // ── Structs ──────────────────────────────────────────────────

    struct Ministry {
        string  name;
        string  code;
        address contractAddr;
        bool    active;
        uint256 registeredAt;
    }

    // ── State ────────────────────────────────────────────────────

    address public immutable ADMIN;
    NDIDSRegistry         public ndids;
    AIDisbursementTracker public aidTracker;

    Ministry[] public ministries;
    mapping(string  => uint256) public ministryIndex;    // code    => index
    mapping(string  => bool)    public ministryExists;
    mapping(address => bool)    public isRegisteredNode; // contractAddr => bool (FIX 3)

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

    // ── Events ───────────────────────────────────────────────────

    event MinistryRegistered(string code, string name, address contractAddr);
    event PermissionGranted(string fromCode, string toCode);
    event PermissionRevoked(string fromCode, string toCode);
    event WorkflowExecuted(string workflowType, bytes32 citizenHash, bool success);
    event NDIDSSet(address ndids);
    event AIDTrackerSet(address tracker);

    // ── Errors ───────────────────────────────────────────────────

    error Unauthorised();
    error MinistryNotFound();
    error AlreadyExists();
    error AlreadySet();                              // FIX 1: once-set guard
    error ZeroAddress();
    error EnrollmentStepFailed(string step);
    error UnregisteredMinistryNode(address node);   // FIX 3: node validation

    // ── Constructor ──────────────────────────────────────────────

    constructor(address _admin) {
        if (_admin == address(0)) revert ZeroAddress();
        ADMIN = _admin;
    }

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }

    function _onlyAdmin() view internal {
        if (msg.sender != ADMIN) revert Unauthorised();
        
    }

    // ── Setup ────────────────────────────────────────────────────

    function setNDIDS(address _ndids) external onlyAdmin {
        if (address(ndids) != address(0)) revert AlreadySet();
        ndids = NDIDSRegistry(_ndids);
        emit NDIDSSet(_ndids);
    }

    function setAIDTracker(address _tracker) external onlyAdmin {
        if (address(aidTracker) != address(0)) revert AlreadySet();
        aidTracker = AIDisbursementTracker(_tracker);
        emit AIDTrackerSet(_tracker);
    }

    // ── Ministry Registration ────────────────────────────────────

    function registerMinistry(
        string calldata name,
        string calldata code,
        address contractAddr
    ) external onlyAdmin {
        if (ministryExists[code]) revert AlreadyExists();
        ministryIndex[code] = ministries.length;
        ministryExists[code] = true;
        isRegisteredNode[contractAddr] = true;
        ministries.push(Ministry({
            name:         name,
            code:         code,
            contractAddr: contractAddr,
            active:       true,
            registeredAt: block.timestamp
        }));
        emit MinistryRegistered(code, name, contractAddr);
    }

    // ── Permission Management ────────────────────────────────────

    /**
     * @notice Grant ministry B read access to ministry A's records
     */
    function grantPermission(string calldata fromCode, string calldata toCode)
        external onlyAdmin
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
            grantedAt: block.timestamp
        }));

        emit PermissionGranted(fromCode, toCode);
    }

    /**
     * @notice Revoke ministry B's read access to ministry A's records.
     *         Calls revokeReader() on the from-node passing the to-node address.
     */
    function revokePermission(string calldata fromCode, string calldata toCode)
        external onlyAdmin
    {
        if (!ministryExists[fromCode] || !ministryExists[toCode])
            revert MinistryNotFound();

        Ministry storage from = ministries[ministryIndex[fromCode]];
        Ministry storage to   = ministries[ministryIndex[toCode]];

        MinistryNode(from.contractAddr).revokeReader(to.contractAddr);

        emit PermissionRevoked(fromCode, toCode);
    }

    // ── Cross-Ministry Workflow: School Enrollment + Benefit ──────

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
    function executeEnrollmentWorkflow(
        bytes32 citizenHash,
        address educationNode,
        address mofNode,
        bytes32 dataHash
    ) external onlyAdmin nonReentrant returns (bool success) {

        // Validate both node addresses against the hub's own registry (FIX 3)
        if (!isRegisteredNode[educationNode]) revert UnregisteredMinistryNode(educationNode);
        if (!isRegisteredNode[mofNode])       revert UnregisteredMinistryNode(mofNode);

        // ── B4: CEI — write state BEFORE external calls ──────────
        // Record workflow attempt upfront; update success flag after
        uint256 logIndex = workflowLog.length;
        workflowLog.push(WorkflowEvent({
            workflowType: "ENROLLMENT_AND_BENEFIT",
            citizenHash:  citizenHash,
            ministryCode: "MULTI",
            timestamp:    block.timestamp,
            success:      false   // default false, updated below if both succeed
        }));

        // ── External calls AFTER state write ─────────────────────

        // Step 1: Record school enrollment (Education node verifies via NDIDS)
        // B4 — capture return value, require success
        try MinistryNode(educationNode).recordService(
            citizenHash,
            "SCHOOL_ENROLLMENT",
            dataHash,
            true  // verify via NDIDS
        ) returns (uint256) {
            // Step 2: Record benefit eligibility in MOF
            try MinistryNode(mofNode).recordService(
                citizenHash,
                "EDUCATION_BENEFIT_ELIGIBLE",
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

        

        emit WorkflowExecuted("ENROLLMENT_AND_BENEFIT", citizenHash, success);
    }

    // ── Queries ──────────────────────────────────────────────────

    function getMinistryCount() external view returns (uint256) {
        return ministries.length;
    }

    function getMinistry(string calldata code)
        external view returns (Ministry memory)
    {
        if (!ministryExists[code]) revert MinistryNotFound();
        return ministries[ministryIndex[code]];
    }

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

    function getWorkflowLogLength() external view returns (uint256) {
        return workflowLog.length;
    }

    function getPermissions() external view returns (Permission[] memory) {
        return permissions;
    }

    function getAllMinistries() external view returns (Ministry[] memory) {
        return ministries;
    }
}
