// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IProjectVerification
/// @notice Multi-party approval for government infrastructure grant releases.
/// @dev MWTI verifies project milestone completion.
///      MOF authorises fund release after verification.
///      Models Samoa constitutional fund release chain:
///      Donor/CBS creates grant -> MWTI verifies ->
///      MOF authorises -> releaseTranche() executes.
///      LTA provides transport infrastructure records.
///      SQA provides qualification attestation.
interface IProjectVerification {

    struct Milestone {
        uint256  grantId;
        uint256  trancheIndex;
        bytes32  verifierCode;      // "MWTI"
        bytes32  authorisingCode;   // "MOF"
        bool     verified;
        bool     authorised;
        uint256  verifiedAt;
        uint256  authorisedAt;
        string   evidenceHash;      // IPFS CID
    }

    event MilestoneVerified(
        uint256 indexed grantId,
        uint256 indexed trancheIndex,
        bytes32 verifier,
        string  evidenceHash
    );

    event ReleaseAuthorised(
        uint256 indexed grantId,
        uint256 indexed trancheIndex,
        bytes32 authoriser
    );

    function verifyMilestone(
        uint256 grantId,
        uint256 trancheIndex,
        string calldata evidenceHash
    ) external;

    function authoriseRelease(
        uint256 grantId,
        uint256 trancheIndex
    ) external;

    function getMilestone(
        uint256 grantId,
        uint256 trancheIndex
    ) external view returns (Milestone memory);

    function isReadyForRelease(
        uint256 grantId,
        uint256 trancheIndex
    ) external view returns (bool);
}
