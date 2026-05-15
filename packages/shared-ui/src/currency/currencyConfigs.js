// Currency Display Spec v1.0 — WST 2dp, USDC 6dp, FX 18dp (tech precision)
// Do not use native float for arithmetic — always pass through Decimal.js
export const CURRENCY_CONFIGS = {
  WST: {
    code:           'WST',
    name:           'Samoan Tālā',
    nameSM:         'Tālā Samoa',
    decimals:       2,
    nativeDecimals: 2,
    techDecimals:   6,
    symbol:         'T',
    color:          'var(--color-currency-wst)',
    description:    'Sovereign currency — always 2 decimal places (fiat standard)',
  },
  USDC: {
    code:           'USDC',
    name:           'USD Coin',
    nameSM:         'Tupe USD',
    decimals:       6,
    nativeDecimals: 2,
    techDecimals:   6,
    symbol:         '$',
    color:          'var(--color-currency-usdc)',
    description:    'Stablecoin — 6 decimal places (ERC-20 standard)',
  },
  FX: {
    code:           'FX',
    name:           'Foreign Exchange',
    nameSM:         'Tupe Malo',
    decimals:       6,
    nativeDecimals: 4,
    techDecimals:   18,
    symbol:         '¥',
    color:          'var(--color-currency-fx)',
    description:    'Cross-border settlement — precision varies by instrument',
  },
}
