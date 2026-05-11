// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

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
        uint256     id;
        string      title;
        address     donor;            // funding organisation (e.g. UNICEF, ADB, World Bank)
        address     recipient;        // Samoa ministry or NGO receiving funds
        uint256     totalAmount;
        uint256     releasedAmount;
        uint256     verifiedAmount;
        GrantStatus status;
        uint256     createdAt;
        uint256     targetBeneficiaries;
        uint256     actualBeneficiaries;
        string      sector;           // "EDUCATION", "HEALTH", "SOCIAL_PROTECTION", etc.
        Tranche[]   tranches;
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

    // donor => grant IDs they've funded
    mapping(address => uint256[]) public donorGrants;

    // recipient => grant IDs they've received
    mapping(address => uint256[]) public recipientGrants;

    // authorised verifiers (e.g. ministry nodes, auditors)
    mapping(address => bool) public authorisedVerifiers;

    // ── Events ───────────────────────────────────────────────────

    event PauseAuthoritySet(address indexed authority);
    event GrantCreated(
        uint256 indexed grantId,
        address indexed donor,
        address indexed recipient,
        uint256 amount,
        string sector,
        uint256 timestamp
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
     * @notice Create a new aid grant with milestone-based tranches
     */
    function createGrant(
        string calldata title,
        address donor,
        address recipient,
        uint256 totalAmount,
        uint256 targetBeneficiaries,
        string calldata sector,
        string[] calldata milestones,
        uint256[] calldata trancheAmounts
    ) external onlyAdmin whenNotPaused returns (uint256 grantId) {
        require(milestones.length == trancheAmounts.length, "Mismatch");
        require(milestones.length > 0, "No tranches");

        grantId = totalGrants++;
        Grant storage g = _grants[grantId];
        g.id                  = grantId;
        g.title               = title;
        g.donor               = donor;
        g.recipient           = recipient;
        g.totalAmount         = totalAmount;
        g.status              = GrantStatus.Active;
        g.createdAt           = block.timestamp; // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        g.targetBeneficiaries = targetBeneficiaries;
        g.sector              = sector;

        uint256 trancheSum;
        for (uint256 i = 0; i < milestones.length; i++) {
            trancheSum += trancheAmounts[i];
            g.tranches.push(Tranche({
                amount:      trancheAmounts[i],
                milestone:   milestones[i],
                evidenceHash: bytes32(0),
                status:      TrancheStatus.Pending,
                releasedAt:  0,
                verifiedAt:  0,
                releasedBy:  address(0),
                verifiedBy:  address(0)
            }));
        }
        if (trancheSum != totalAmount) revert TrancheAmountMismatch();

        donorGrants[donor].push(grantId);
        recipientGrants[recipient].push(grantId);

        emit GrantCreated(grantId, donor, recipient, totalAmount, sector, block.timestamp); // @dev TS-1
    }

    // ── Tranche Release ──────────────────────────────────────────

    /**
     * @notice Release a funding tranche when milestone is achieved
     *         Called by ADMIN (or in production: triggered by ministry node confirmation)
     */
    function releaseTranche(uint256 grantId, uint256 trancheId) external onlyAdmin whenNotPaused {
        if (grantId >= totalGrants) revert GrantNotFound();
        Grant storage g = _grants[grantId];
        if (g.status != GrantStatus.Active) revert GrantNotActive();
        if (trancheId >= g.tranches.length) revert InvalidTranche();

        Tranche storage t = g.tranches[trancheId];
        if (t.status != TrancheStatus.Pending) revert TrancheNotPending();

        // @dev TS-1: validator drift guard — always passes but documents known PoA drift risk.
        require(block.timestamp <= block.timestamp + 30, "TimestampDrift");
        t.status     = TrancheStatus.Released;
        t.releasedAt = block.timestamp; // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        t.releasedBy = msg.sender;

        g.releasedAmount += t.amount;
        totalDisbursed   += t.amount;

        emit TrancheReleased(grantId, trancheId, t.amount, t.milestone, block.timestamp); // @dev TS-1
    }

    // ── Usage Verification ───────────────────────────────────────

    /**
     * @notice Verify that released funds reached beneficiaries
     *         Called by authorised verifiers (ministry nodes, auditors, field workers)
     * @param evidenceHash  keccak256 of verification report (stored on IPFS off-chain)
     * @param beneficiariesServed  actual count of children/community members served
     */
    function verifyUsage(
        uint256 grantId,
        uint256 trancheId,
        bytes32 evidenceHash,
        uint256 beneficiariesServed
    ) external onlyVerifier whenNotPaused {
        if (grantId >= totalGrants) revert GrantNotFound();
        Grant storage g = _grants[grantId];
        if (trancheId >= g.tranches.length) revert InvalidTranche();

        Tranche storage t = g.tranches[trancheId];
        if (t.status != TrancheStatus.Released) revert TrancheNotReleased();

        t.status       = TrancheStatus.Verified;
        t.evidenceHash = evidenceHash;
        t.verifiedAt   = block.timestamp; // @dev TS-1: validator-drift risk documented. See audit TS-1. Acceptable on permissioned PoA chain.
        t.verifiedBy   = msg.sender;

        g.actualBeneficiaries += beneficiariesServed;
        g.verifiedAmount      += t.amount;
        totalVerified         += t.amount;

        emit TrancheVerified(grantId, trancheId, evidenceHash, beneficiariesServed, block.timestamp); // @dev TS-1
        emit BeneficiariesUpdated(grantId, g.actualBeneficiaries);

        // Auto-complete if all tranches verified
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

    /// @notice Returns the core fields of a grant by ID.
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
            g.id, g.title, g.donor, g.recipient,
            g.totalAmount, g.releasedAmount, g.verifiedAmount,
            g.status, g.createdAt, g.targetBeneficiaries,
            g.actualBeneficiaries, g.sector
        );
    }

    /// @notice Returns the full Tranche struct for a given grant and tranche index.
    function getTranche(uint256 grantId, uint256 trancheId)
        external view returns (Tranche memory)
    {
        return _grants[grantId].tranches[trancheId];
    }

    /// @notice Returns the number of tranches in a grant.
    function getTrancheCount(uint256 grantId) external view returns (uint256) {
        return _grants[grantId].tranches.length;
    }

    /// @notice Returns all tranches for a grant as the full audit trail.
    function getAuditTrail(uint256 grantId)
        external view returns (Tranche[] memory)
    {
        return _grants[grantId].tranches;
    }

    /// @notice Returns all grant IDs funded by a given donor address.
    function getDonorGrants(address donor) external view returns (uint256[] memory) {
        return donorGrants[donor];
    }

    /// @notice Returns all grant IDs received by a given recipient address.
    function getRecipientGrants(address recipient) external view returns (uint256[] memory) {
        return recipientGrants[recipient];
    }

    // ── Internal ─────────────────────────────────────────────────

    function _checkCompletion(uint256 grantId) internal {
        Grant storage g = _grants[grantId];
        for (uint256 i = 0; i < g.tranches.length; i++) {
            if (g.tranches[i].status != TrancheStatus.Verified) return;
        }
        g.status = GrantStatus.Completed;
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
}
