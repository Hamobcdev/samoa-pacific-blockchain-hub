// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @dev Minimal upgradeable reentrancy guard compatible with UUPS proxies.
 *
 * openzeppelin-contracts-upgradeable is not installed in this repo — only
 * openzeppelin-contracts v5.1.0 is available. This local implementation
 * provides the same semantics as OZ's ReentrancyGuardUpgradeable:
 * - Storage state is initialised to NOT_ENTERED in __ReentrancyGuard_init()
 * - nonReentrant modifier blocks re-entrant calls
 *
 * Call __ReentrancyGuard_init() from your contract's initialize() function.
 */
abstract contract ReentrancyGuardUpgradeable is Initializable {
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED     = 2;

    /// @custom:storage-location erc7201:samoa.storage.ReentrancyGuard
    uint256 private _reentrancyStatus;

    error ReentrancyGuardReentrantCall();

    function __ReentrancyGuard_init() internal onlyInitializing {
        _reentrancyStatus = NOT_ENTERED;
    }

    modifier nonReentrant() {
        if (_reentrancyStatus == ENTERED) revert ReentrancyGuardReentrantCall();
        _reentrancyStatus = ENTERED;
        _;
        _reentrancyStatus = NOT_ENTERED;
    }
}
