// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
contract AIDisbursementTracker {

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

    address public immutable ADMIN;
    uint256 public totalGrants;
    uint256 public totalDisbursed;
    uint256 public totalVerified;

    mapping(uint256 => Grant) private _grants;

    // donor => grant IDs they've funded
    mapping(address => uint256[]) public donorGrants;

    // recipient => grant IDs they've received
    mapping(address => uint256[]) public recipientGrants;

    // authorised verifiers (e.g. ministry nodes, auditors)
    mapping(address => bool) public authorisedVerifiers;

    // ── Events ───────────────────────────────────────────────────

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

    // ── Errors ───────────────────────────────────────────────────

    error Unauthorised();
    error InvalidGrant();
    error InvalidTranche();
    error GrantNotActive();
    error TrancheNotPending();
    error TrancheNotReleased();
    error ZeroAddress();

    // ── Constructor ──────────────────────────────────────────────

    constructor(address _admin) {
        if (_admin == address(0)) revert ZeroAddress();
        ADMIN = _admin;
    }

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }

    function _onlyAdmin() internal view {
        if (msg.sender != ADMIN) revert Unauthorised();
        
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
    ) external onlyAdmin returns (uint256 grantId) {
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
        g.createdAt           = block.timestamp;
        g.targetBeneficiaries = targetBeneficiaries;
        g.sector              = sector;

        for (uint256 i = 0; i < milestones.length; i++) {
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

        donorGrants[donor].push(grantId);
        recipientGrants[recipient].push(grantId);

        emit GrantCreated(grantId, donor, recipient, totalAmount, sector, block.timestamp);
    }

    // ── Tranche Release ──────────────────────────────────────────

    /**
     * @notice Release a funding tranche when milestone is achieved
     *         Called by ADMIN (or in production: triggered by ministry node confirmation)
     */
    function releaseTranche(uint256 grantId, uint256 trancheId) external onlyAdmin {
        Grant storage g = _grants[grantId];
        if (g.createdAt == 0) revert InvalidGrant();
        if (g.status != GrantStatus.Active) revert GrantNotActive();
        if (trancheId >= g.tranches.length) revert InvalidTranche();

        Tranche storage t = g.tranches[trancheId];
        if (t.status != TrancheStatus.Pending) revert TrancheNotPending();

        t.status     = TrancheStatus.Released;
        t.releasedAt = block.timestamp;
        t.releasedBy = msg.sender;

        g.releasedAmount += t.amount;
        totalDisbursed   += t.amount;

        emit TrancheReleased(grantId, trancheId, t.amount, t.milestone, block.timestamp);
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
    ) external onlyVerifier {
        Grant storage g = _grants[grantId];
        if (g.createdAt == 0) revert InvalidGrant();
        if (trancheId >= g.tranches.length) revert InvalidTranche();

        Tranche storage t = g.tranches[trancheId];
        if (t.status != TrancheStatus.Released) revert TrancheNotReleased();

        t.status       = TrancheStatus.Verified;
        t.evidenceHash = evidenceHash;
        t.verifiedAt   = block.timestamp;
        t.verifiedBy   = msg.sender;

        g.actualBeneficiaries += beneficiariesServed;
        g.verifiedAmount      += t.amount;
        totalVerified         += t.amount;

        emit TrancheVerified(grantId, trancheId, evidenceHash, beneficiariesServed, block.timestamp);
        emit BeneficiariesUpdated(grantId, g.actualBeneficiaries);

        // Auto-complete if all tranches verified
        _checkCompletion(grantId);
    }

    // ── Access Control ───────────────────────────────────────────

    function authoriseVerifier(address verifier) external onlyAdmin {
        authorisedVerifiers[verifier] = true;
        emit VerifierAuthorised(verifier);
    }

    // ── Queries ──────────────────────────────────────────────────

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

    function getTranche(uint256 grantId, uint256 trancheId)
        external view returns (Tranche memory)
    {
        return _grants[grantId].tranches[trancheId];
    }

    function getTrancheCount(uint256 grantId) external view returns (uint256) {
        return _grants[grantId].tranches.length;
    }

    function getAuditTrail(uint256 grantId)
        external view returns (Tranche[] memory)
    {
        return _grants[grantId].tranches;
    }

    function getDonorGrants(address donor) external view returns (uint256[] memory) {
        return donorGrants[donor];
    }

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
        emit GrantCompleted(grantId, block.timestamp);
    }
}
