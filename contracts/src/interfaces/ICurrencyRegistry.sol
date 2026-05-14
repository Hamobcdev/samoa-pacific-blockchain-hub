// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICurrencyRegistry {
    struct Currency {
        bytes32 code;
        address token;
        uint8 decimals;
        bool active;
        bool bridgeEnabled;
        bool fxEnabled;
        string displayName;
        uint256 registeredAt;
    }
    event CurrencyRegistered(
        bytes32 indexed code,
        address token,
        uint8 decimals
    );
    event CurrencyDeactivated(bytes32 indexed code);

    function registerCurrency(
        bytes32 code, address token,
        uint8 decimals, string calldata displayName
    ) external;
    function deactivateCurrency(bytes32 code) external;
    function getCurrency(bytes32 code)
        external view returns (Currency memory);
    function decimalsOf(bytes32 code)
        external view returns (uint8);
    function isActive(bytes32 code)
        external view returns (bool);
    function listActiveCurrencies()
        external view returns (bytes32[] memory);
}
