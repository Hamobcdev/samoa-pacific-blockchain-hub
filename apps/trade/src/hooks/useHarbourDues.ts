import Decimal from 'decimal.js'
import { BASE_RATE_PER_GT } from '../constants'
import type { VesselType } from '../types'

export function calculateHarbourDues(
  grossTonnage: number,
  vesselType: VesselType,
  days: number,
): Decimal {
  const rate      = BASE_RATE_PER_GT[vesselType] ?? BASE_RATE_PER_GT['OTHER']
  const dailyRate = new Decimal(grossTonnage).times(rate)
  return dailyRate.times(days).toDecimalPlaces(2)
}

export function formatWST(amount: Decimal | string): string {
  const d = amount instanceof Decimal ? amount : new Decimal(amount)
  return `WST ${d.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export function useHarbourDues(grossTonnage: number, vesselType: VesselType, days: number) {
  const dues        = calculateHarbourDues(grossTonnage, vesselType, days)
  const rateDisplay = `WST ${(BASE_RATE_PER_GT[vesselType] ?? 0.35).toFixed(2)} / GT / day`

  return {
    dues,
    formatted:   formatWST(dues),
    rateDisplay,
  }
}
