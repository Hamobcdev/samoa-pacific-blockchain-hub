// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DecimalMath
 * @notice Decimal-safe normalization for
 * multi-currency accounting.
 * @dev Internal math in 18-decimal units.
 * Display retains native currency decimals.
 * Mirrors SWIFT, TARGET2, Bloomberg patterns.
 * WST-DPI: 2 decimals (sovereign fiat standard)
 * USDC/USDT: 6 decimals (Phase 3)
 * FX pairs: 18 decimals (Phase 4)
 */
library DecimalMath {
    uint8 internal constant ACCOUNTING_DECIMALS = 18;

    error DecimalsTooLarge(uint8 decimals);

    function normalize(
        uint256 amount,
        uint8 decimals
    ) internal pure returns (uint256) {
        if (decimals == ACCOUNTING_DECIMALS)
            return amount;
        if (decimals > ACCOUNTING_DECIMALS)
            revert DecimalsTooLarge(decimals);
        return amount *
            (10 ** (ACCOUNTING_DECIMALS - decimals));
    }

    function denormalize(
        uint256 normalized,
        uint8 decimals
    ) internal pure returns (uint256) {
        if (decimals == ACCOUNTING_DECIMALS)
            return normalized;
        if (decimals > ACCOUNTING_DECIMALS)
            revert DecimalsTooLarge(decimals);
        return normalized /
            (10 ** (ACCOUNTING_DECIMALS - decimals));
    }

    function convert(
        uint256 amount,
        uint8 fromDecimals,
        uint8 toDecimals
    ) internal pure returns (uint256) {
        if (fromDecimals == toDecimals) return amount;
        return denormalize(
            normalize(amount, fromDecimals),
            toDecimals
        );
    }
}
