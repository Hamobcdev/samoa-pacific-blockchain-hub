import React, { createContext, useContext } from 'react'
import { useCurrencyDisplay } from '../../hooks/useCurrencyDisplay.js'
import { AmountDisplay }    from './AmountDisplay.jsx'
import { CurrencyBadge }   from './CurrencyBadge.jsx'
import { PrecisionToggle } from './PrecisionToggle.jsx'
import { SettlementChip }  from './SettlementChip.jsx'
import { ErrorAmount }     from './ErrorAmount.jsx'

const CurrencyContext = createContext(null)

export function CurrencyProvider({ lang = 'EN', children }) {
  const display = useCurrencyDisplay()
  return (
    <CurrencyContext.Provider value={{ ...display, lang }}>
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
