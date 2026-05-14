import { useState, useCallback } from 'react'

export const CURRENCY_CONFIGS = {
  WST: {
    code:           'WST',
    name:           'Samoan Tālā',
    nameSM:         'Tālā Samoa',
    decimals:       2,
    nativeDecimals: 2,
    techDecimals:   6,
    symbol:         'T',
    color:          '#C9A227',
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
    color:          '#2775CA',
    description:    'Stablecoin — 6 decimal places (ERC-20 standard)',
  },
  FX: {
    code:           'FX',
    name:           'Foreign Exchange',
    nameSM:         'Tupe Malo',
    decimals:       6,
    nativeDecimals: 4,
    techDecimals:   6,
    symbol:         '¥',
    color:          '#8b5cf6',
    description:    'Cross-border settlement — precision varies by instrument',
  },
}

export function useCurrencyDisplay() {
  const [precision, setPrecision] = useState('native') // 'native' | 'tech'

  const togglePrecision = useCallback(() => {
    setPrecision(p => p === 'native' ? 'tech' : 'native')
  }, [])

  const formatAmount = useCallback((rawAmount, currencyCode) => {
    const cfg = CURRENCY_CONFIGS[currencyCode] ?? CURRENCY_CONFIGS.WST
    const dp = precision === 'tech' ? cfg.techDecimals : cfg.nativeDecimals

    // WST is always 2 decimal places regardless of precision mode
    const effectiveDp = currencyCode === 'WST' ? 2 : dp

    const num = typeof rawAmount === 'bigint'
      ? Number(rawAmount) / Math.pow(10, cfg.decimals)
      : Number(rawAmount)

    return {
      formatted:    num.toLocaleString('en-WS', { minimumFractionDigits: effectiveDp, maximumFractionDigits: effectiveDp }),
      code:         cfg.code,
      symbol:       cfg.symbol,
      color:        cfg.color,
      display:      `${cfg.symbol}${num.toLocaleString('en-WS', { minimumFractionDigits: effectiveDp, maximumFractionDigits: effectiveDp })} ${cfg.code}`,
    }
  }, [precision])

  return { precision, togglePrecision, formatAmount, CURRENCY_CONFIGS }
}
