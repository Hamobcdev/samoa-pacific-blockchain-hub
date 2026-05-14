// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICBSCurrencyController {
    struct CurrencyPair {
        bytes32 base;
        bytes32 quote;
        bool active;
        uint256 dailyVolumeLimit;
        uint256 dailyVolumeUsed;
        uint256 circuitBreakerThresholdBps;
        address oracle;
        bool travelRuleRequired;
        uint256 lastReset;
    }
    event PairRegistered(
        bytes32 indexed base, bytes32 indexed quote
    );
    event PairPaused(
        bytes32 indexed base,
        bytes32 indexed quote,
        string reason
    );
    event CircuitBreakerTriggered(
        bytes32 indexed base, bytes32 indexed quote
    );

    function registerPair(
        bytes32 base, bytes32 quote,
        uint256 limit, uint256 breakerBps,
        address oracle, bool travelRuleRequired
    ) external;
    function pausePair(
        bytes32 base, bytes32 quote,
        string calldata reason
    ) external;
    function resumePair(
        bytes32 base, bytes32 quote
    ) external;
    function getPair(
        bytes32 base, bytes32 quote
    ) external view returns (CurrencyPair memory);
    function checkTransferAllowed(
        bytes32 base, bytes32 quote,
        uint256 amount,
        address sender, address recipient
    ) external view returns (bool allowed, string memory reason);
}
