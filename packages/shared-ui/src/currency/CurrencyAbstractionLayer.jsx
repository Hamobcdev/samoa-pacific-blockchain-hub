import React, { createContext, useContext, useState, useCallback } from 'react'
import Decimal from 'decimal.js'
import { CURRENCY_CONFIGS } from './currencyConfigs.js'
import { AmountDisplay }    from './AmountDisplay.jsx'
import { CurrencyBadge }   from './CurrencyBadge.jsx'
import { PrecisionToggle } from './PrecisionToggle.jsx'
import { SettlementChip }  from './SettlementChip.jsx'
import { ErrorAmount }     from './ErrorAmount.jsx'

// Phase 1 — WST only; expand this list per phase gate
const ACTIVE_CURRENCIES = ['WST']

const CurrencyContext = createContext(null)

export function CurrencyProvider({ lang = 'EN', children }) {
  const [precision, setPrecision] = useState('native')

  const togglePrecision = useCallback(() => {
    setPrecision(p => (p === 'native' ? 'tech' : 'native'))
  }, [])

  const formatAmount = useCallback(
    (rawAmount, currencyCode) => {
      const cfg = CURRENCY_CONFIGS[currencyCode] ?? CURRENCY_CONFIGS.WST
      const dp  = currencyCode === 'WST' ? 2 : (precision === 'tech' ? cfg.techDecimals : cfg.nativeDecimals)

      let num
      try {
        num = typeof rawAmount === 'bigint'
          ? new Decimal(rawAmount.toString()).div(new Decimal(10).pow(cfg.decimals))
          : new Decimal(String(rawAmount ?? 0))
      } catch {
        num = new Decimal(0)
      }

      const fixed    = num.toFixed(dp)
      const parts    = fixed.split('.')
      parts[0]       = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      const formatted = parts.join('.')

      return {
        formatted,
        code:    cfg.code,
        symbol:  cfg.symbol,
        color:   cfg.color,
        display: `${formatted} ${cfg.code}`,
      }
    },
    [precision],
  )

  return (
    <CurrencyContext.Provider value={{ precision, togglePrecision, formatAmount, CURRENCY_CONFIGS, ACTIVE_CURRENCIES, lang }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}

export { AmountDisplay, CurrencyBadge, PrecisionToggle, SettlementChip, ErrorAmount }
