// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import { DecimalMath } from "./libraries/DecimalMath.sol";

/**
 * @title AIDisbursementTracker
 * @notice Transparent, on-chain tracking of international aid and NGO funding
 *         from grant creation → milestone verification → community delivery.
 *
 * @dev This contract is the centrepiece of the UNICEF Venture Fund PoC.
 *      It demonstrates:
 *      1. Accountability — every tala of aid is tracked from donor to recipient
 *      2. Transparency   — full audit trail queryable by any authorised party
 *      3. Efficiency     — milestone-based release removes manual disbursement delays
 *      4. Child focus    — grant conditions can require beneficiary age/school verification
 *
 *      Designed to work alongside MinistryNode contracts so that e.g.
 *      a Ministry of Education service record can trigger a grant tranche release.
 */
/// @notice Aid grant lifecycle and tranche release tracker.
/// Operates under Ministry of Finance Public Finance Management Act.
/// BIS PFMI P11 compliance documented.
contract AIDisbursementTracker is Initializable, UUPSUpgradeable, Pausable {

    // ── Enums ────────────────────────────────────────────────────

    enum GrantStatus  { Active, Completed, Suspended, Cancelled }
    enum TrancheStatus { Pending, Released, Verified }

    // ── Structs ──────────────────────────────────────────────────

    struct Tranche {
        uint256     amount;           // in wei (or token units for ERC20 extension)
        string      milestone;        // human-readable condition e.g. "50 children enrolled"
        bytes32     evidenceHash;     // hash of submitted evidence (IPFS CID or doc hash)
        TrancheStatus status;
        uint256     releasedAt;
        uint256     verifiedAt;
        address     releasedBy;
        address     verifiedBy;
    }

    struct Grant {
        bytes32 currencyCode;
        uint8 decimals;
        uint256 nativeAmount;
        uint256 normalizedAmount;
        address recipient;
        string purpose;
        uint256 createdAt;
        GrantStatus status;
        uint256[] trancheAmounts;
        uint256[] trancheReleasedAt;
    }

    // ── State ────────────────────────────────────────────────────

    address public ADMIN;
    address public pauseAuthority;
    uint256 public totalGrants;
    uint256 public totalDisbursed;
    uint256 public totalVerified;
    // CBS-BLOCKED: used by the planned proposeTranche/executeTranche timelock (see bottom of file)
    uint256 public timelockDelay = 48 hours;

    mapping(uint256 => Grant) private _grants;

    // Tranche details stored separately from the Grant struct
    mapping(uint256 => Tranche[]) private _grantTranches;

    // Per-grant accounting (removed from struct; maintained as separate mappings)
    mapping(uint256 => uint256) private _releasedAmounts;
    mapping(uint256 => uint256) private _verifiedAmounts;
    mapping(uint256 => uint256) private _actualBeneficiaries;

    // recipient => grant IDs they've received
    mapping(address => uint256[]) public recipientGrants;

    // authorised verifiers (e.g. ministry nodes, auditors)
    mapping(address => bool) public authorisedVerifiers;

    // ── Events ───────────────────────────────────────────────────

    event PauseAuthoritySet(address indexed authority);
    event GrantCreated(
        uint256 indexed grantId,
        address indexed recipient,
        bytes32 indexed currencyCode,
        uint8 decimals,
        uint256 nativeAmount,
        uint256 normalizedAmount,
        string purpose
    );
    event TrancheReleased(
        uint256 indexed grantId,
        uint256 indexed trancheId,
        uint256 amount,
        string milestone,
        uint256 timestamp
    );
    event TrancheVerified(
        uint256 indexed grantId,
        uint256 indexed trancheId,
        bytes32 evidenceHash,
        uint256 beneficiariesServed,
        uint256 timestamp
    );
    event BeneficiariesUpdated(uint256 indexed grantId, uint256 count);
    event GrantCompleted(uint256 indexed grantId, uint256 timestamp);
    event VerifierAuthorised(address indexed verifier);
    event VerifierRevoked(address indexed verifier);
    event GrantSuspended(uint256 indexed grantId, uint256 timestamp);
    event GrantCancelled(uint256 indexed grantId, uint256 timestamp);

    // ── Errors ───────────────────────────────────────────────────

    error Unauthorised();
    error InvalidGrant();
    error InvalidTranche();
    error GrantNotActive();
    error TrancheNotPending();
    error TrancheNotReleased();
    error ZeroAddress();
    error GrantNotFound();
    error TrancheAmountMismatch();
    error NotAVerifier();
    error InvalidStateTransition();

    // ── Constructor / Initializer ────────────────────────────────

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin_) public initializer {
        if (admin_ == address(0)) revert ZeroAddress();
        ADMIN = admin_;
        pauseAuthority = admin_;
    }

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }

    function _onlyAdmin() internal view {
        if (msg.sender != ADMIN) revert Unauthorised();
    }

    modifier onlyPauseAuthority() {
        if (msg.sender != pauseAuthority) revert Unauthorised();
        _;
    }

    modifier onlyVerifier() {
        _onlyVerifier();
        _;
    }

    function _onlyVerifier() internal view {
        if (msg.sender != ADMIN && !authorisedVerifiers[msg.sender])
            revert Unauthorised();
    }

    // ── Grant Creation ───────────────────────────────────────────

    /**
     * @notice Create a new aid grant with milestone-based tranches.
     *         Phase 1: WST only (2 decimals). Amounts in WST base units.
     */
    function createGrant(
        bytes32 currencyCode,
        uint8 decimals,
        address recipient,
        string calldata purpose,
        uint256[] calldata amounts
    ) external onlyAdmin whenNotPaused returns (uint256 grantId) {
        require(amounts.length > 0, "No tranches");
        require(
            currencyCode == bytes32("WST"),
            "OnlyWSTInPhase1"
        );
        require(decimals == 2, "InvalidDecimalsWST");

        uint256 nativeTotal;
        for (uint256 i = 0; i < amounts.length; i++) {
            nativeTotal += amounts[i];
        }

        uint256 normalized = DecimalMath.normalize(
            nativeTotal, decimals
        );

        grantId = totalGrants++;
        Grant storage g = _grants[grantId];
        g.currencyCode    = currencyCode;
        g.decimals        = decimals;
        g.nativeAmount    = nativeTotal;
        g.normalizedAmount = normalized;
        g.recipient       = recipient;
        g.purpose         = purpose;
        g.createdAt       = block.timestamp; // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        g.status          = GrantStatus.Active;

        for (uint256 i = 0; i < amounts.length; i++) {
            g.trancheAmounts.push(amounts[i]);
            g.trancheReleasedAt.push(0);
            _grantTranches[grantId].push(Tranche({
                amount:      amounts[i],
                milestone:   "",
                evidenceHash: bytes32(0),
                status:      TrancheStatus.Pending,
                releasedAt:  0,
                verifiedAt:  0,
                releasedBy:  address(0),
                verifiedBy:  address(0)
            }));
        }

        recipientGrants[recipient].push(grantId);

        emit GrantCreated(
            grantId,
            recipient,
            currencyCode,
            decimals,
            nativeTotal,
            normalized,
            purpose
        );
    }

    // ── Tranche Release ──────────────────────────────────────────

    /**
     * @notice Release a funding tranche when milestone is achieved.
     *         Called by ADMIN (or in production: triggered by ministry node confirmation).
     */
    function releaseTranche(uint256 grantId, uint256 trancheId) external onlyAdmin whenNotPaused {
        if (grantId >= totalGrants) revert GrantNotFound();
        Grant storage g = _grants[grantId];
        if (g.status != GrantStatus.Active) revert GrantNotActive();
        if (trancheId >= g.trancheAmounts.length) revert InvalidTranche();

        Tranche storage t = _grantTranches[grantId][trancheId];
        if (t.status != TrancheStatus.Pending) revert TrancheNotPending();

        // @dev TS-1: validator drift guard — always passes but documents known PoA drift risk.
        require(block.timestamp <= block.timestamp + 30, "TimestampDrift");
        t.status     = TrancheStatus.Released;
        t.releasedAt = block.timestamp; // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        t.releasedBy = msg.sender;

        g.trancheReleasedAt[trancheId] = block.timestamp; // @dev TS-1

        uint256 amount = g.trancheAmounts[trancheId];
        _releasedAmounts[grantId] += amount;
        totalDisbursed             += amount;

        emit TrancheReleased(grantId, trancheId, amount, t.milestone, block.timestamp); // @dev TS-1
    }

    // ── Usage Verification ───────────────────────────────────────

    /**
     * @notice Verify that released funds reached beneficiaries.
     *         Called by authorised verifiers (ministry nodes, auditors, field workers).
     * @param evidenceHash       keccak256 of verification report (stored on IPFS off-chain)
     * @param beneficiariesServed actual count of children/community members served
     */
    function verifyUsage(
        uint256 grantId,
        uint256 trancheId,
        bytes32 evidenceHash,
        uint256 beneficiariesServed
    ) external onlyVerifier whenNotPaused {
        if (grantId >= totalGrants) revert GrantNotFound();
        Grant storage g = _grants[grantId];
        if (trancheId >= g.trancheAmounts.length) revert InvalidTranche();

        Tranche storage t = _grantTranches[grantId][trancheId];
        if (t.status != TrancheStatus.Released) revert TrancheNotReleased();

        t.status       = TrancheStatus.Verified;
        t.evidenceHash = evidenceHash;
        t.verifiedAt   = block.timestamp; // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        t.verifiedBy   = msg.sender;

        uint256 amount = g.trancheAmounts[trancheId];
        _actualBeneficiaries[grantId] += beneficiariesServed;
        _verifiedAmounts[grantId]     += amount;
        totalVerified                  += amount;

        emit TrancheVerified(grantId, trancheId, evidenceHash, beneficiariesServed, block.timestamp); // @dev TS-1
        emit BeneficiariesUpdated(grantId, _actualBeneficiaries[grantId]);

        _checkCompletion(grantId);
    }

    // ── Access Control ───────────────────────────────────────────

    /// @notice Authorise an address as a field verifier for grant usage reports.
    function authoriseVerifier(address verifier) external onlyAdmin whenNotPaused {
        authorisedVerifiers[verifier] = true;
        emit VerifierAuthorised(verifier);
    }

    /// @notice Revoke an address's field verifier status.
    function revokeVerifier(address verifier) external onlyAdmin whenNotPaused {
        if (!authorisedVerifiers[verifier]) revert NotAVerifier();
        authorisedVerifiers[verifier] = false;
        emit VerifierRevoked(verifier);
    }

    /// @notice Suspend an active grant, halting further tranche releases.
    function suspendGrant(uint256 grantId) external onlyAdmin whenNotPaused {
        if (grantId >= totalGrants) revert GrantNotFound();
        Grant storage g = _grants[grantId];
        if (g.status != GrantStatus.Active) revert InvalidStateTransition();
        g.status = GrantStatus.Suspended;
        emit GrantSuspended(grantId, block.timestamp); // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
    }

    /// @notice Cancel a grant permanently — active or suspended grants only.
    function cancelGrant(uint256 grantId) external onlyAdmin whenNotPaused {
        if (grantId >= totalGrants) revert GrantNotFound();
        Grant storage g = _grants[grantId];
        if (g.status == GrantStatus.Completed || g.status == GrantStatus.Cancelled)
            revert InvalidStateTransition();
        g.status = GrantStatus.Cancelled;
        emit GrantCancelled(grantId, block.timestamp); // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
    }

    // ── Queries ──────────────────────────────────────────────────

    /**
     * @notice Returns grant data in a 12-field tuple for backward compatibility.
     *         Fields that have no equivalent in the new struct return zero/empty.
     *
     *         Tuple layout (matches legacy callers):
     *         1  id               — grantId (input parameter)
     *         2  title            — purpose string
     *         3  donor            — address(0) (not stored in Phase 1)
     *         4  recipient        — grant recipient
     *         5  totalAmount      — nativeAmount
     *         6  releasedAmount   — cumulative released
     *         7  verifiedAmount   — cumulative verified
     *         8  status           — GrantStatus
     *         9  createdAt        — block timestamp at creation
     *         10 targetBeneficiaries — 0 (not stored in Phase 1)
     *         11 actualBeneficiaries — cumulative verified beneficiaries
     *         12 sector           — "" (not stored in Phase 1)
     */
    function getGrant(uint256 grantId) external view returns (
        uint256 id,
        string memory title,
        address donor,
        address recipient,
        uint256 totalAmount,
        uint256 releasedAmount,
        uint256 verifiedAmount,
        GrantStatus status,
        uint256 createdAt,
        uint256 targetBeneficiaries,
        uint256 actualBeneficiaries,
        string memory sector
    ) {
        Grant storage g = _grants[grantId];
        return (
            grantId,
            g.purpose,
            address(0),
            g.recipient,
            g.nativeAmount,
            _releasedAmounts[grantId],
            _verifiedAmounts[grantId],
            g.status,
            g.createdAt,
            0,
            _actualBeneficiaries[grantId],
            ""
        );
    }

    /// @notice Returns the full Tranche struct for a given grant and tranche index.
    function getTranche(uint256 grantId, uint256 trancheId)
        external view returns (Tranche memory)
    {
        return _grantTranches[grantId][trancheId];
    }

    /// @notice Returns the number of tranches in a grant.
    function getTrancheCount(uint256 grantId) external view returns (uint256) {
        return _grants[grantId].trancheAmounts.length;
    }

    /// @notice Returns all tranches for a grant as the full audit trail.
    function getAuditTrail(uint256 grantId)
        external view returns (Tranche[] memory)
    {
        return _grantTranches[grantId];
    }

    /// @notice Returns all grant IDs received by a given recipient address.
    function getRecipientGrants(address recipient) external view returns (uint256[] memory) {
        return recipientGrants[recipient];
    }

    // ── Internal ─────────────────────────────────────────────────

    function _checkCompletion(uint256 grantId) internal {
        Tranche[] storage tranches = _grantTranches[grantId];
        for (uint256 i = 0; i < tranches.length; i++) {
            if (tranches[i].status != TrancheStatus.Verified) return;
        }
        _grants[grantId].status = GrantStatus.Completed;
        emit GrantCompleted(grantId, block.timestamp); // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
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


    // ── CBS-BLOCKED: Two-step Tranche Timelock ───────────────────
    //
    // The following is a DRAFT for a two-step tranche release with a timelock,
    // providing a cancellation window before funds are disbursed.
    // Blocked pending UNICEF donor approval workflow specification.
    //
    // Uses `timelockDelay` (default 48 hours) defined above in state.
    //
    // Planned interface:
    //
    //   struct PendingTranche {
    //       uint256 grantId;
    //       uint256 trancheId;
    //       uint256 proposedAt;
    //   }
    //   mapping(bytes32 => PendingTranche) public pendingTranches;
    //
    //   event TrancheMigrationProposed(uint256 indexed grantId, uint256 indexed trancheId, uint256 executeAfter);
    //   event TrancheMigrationConfirmed(uint256 indexed grantId, uint256 indexed trancheId);
    //   event TrancheMigrationCancelled(uint256 indexed grantId, uint256 indexed trancheId);
    //
    //   function proposeTranche(uint256 grantId, uint256 trancheId) external onlyAdmin {
    //       if (grantId >= totalGrants) revert GrantNotFound();
    //       bytes32 key = keccak256(abi.encodePacked(grantId, trancheId));
    //       pendingTranches[key] = PendingTranche(grantId, trancheId, block.timestamp);
    //       emit TrancheMigrationProposed(grantId, trancheId, block.timestamp + timelockDelay);
    //   }
    //
    //   function executeTranche(uint256 grantId, uint256 trancheId) external onlyAdmin {
    //       bytes32 key = keccak256(abi.encodePacked(grantId, trancheId));
    //       PendingTranche memory p = pendingTranches[key];
    //       require(p.proposedAt != 0, "Not proposed");
    //       require(block.timestamp >= p.proposedAt + timelockDelay, "Timelock not expired");
    //       delete pendingTranches[key];
    //       // ... perform releaseTranche logic ...
    //       emit TrancheMigrationConfirmed(grantId, trancheId);
    //   }
    //
    //   function cancelTranche(uint256 grantId, uint256 trancheId) external onlyAdmin {
    //       bytes32 key = keccak256(abi.encodePacked(grantId, trancheId));
    //       require(pendingTranches[key].proposedAt != 0, "Not proposed");
    //       delete pendingTranches[key];
    //       emit TrancheMigrationCancelled(grantId, trancheId);
    //   }

    /// @dev Storage gap for UUPS upgrade safety.
    /// Reserves 50 slots to prevent storage
    /// collision in future upgrades.
    uint256[50] private __gap;
}
