// ── Role types ────────────────────────────────────────────────────────────────

export type TopRole = 'agent' | 'officer' | 'passenger'

export type OfficerSubRole =
  | 'customs'
  | 'immigration'
  | 'maf'
  | 'portHealth'
  | 'portAuth'

export type ActiveTab = 'maritime' | 'aviation'

// ── Vessel / Maritime ─────────────────────────────────────────────────────────

export type VesselType = 'CARGO' | 'TANKER' | 'PASSENGER' | 'BULK' | 'OTHER'

export type BerthCode = 'APIA_MAIN' | 'APIA_DOMESTIC' | 'SALELOLOGA'

export type ClearanceStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'FLAGGED'
  | 'AWAITING_DOCS'
  | 'CBS_HELD'
  | 'PARTIAL'

export type MinistryStatus =
  | 'SUBMITTED'
  | 'CLEARED'
  | 'PENDING'
  | 'AWAITING_DOCS'
  | 'AWAITING_PRIOR'
  | 'NOT_REQUIRED'

export interface DemoVessel {
  vesselName: string
  imoNumber: string
  flagState: string
  vesselType: VesselType
  grossTonnage: number
  lengthOverall: number
  masterName: string
  shippingAgentName: string
  agentLicenceNumber: string
  estimatedArrival: string
  destinationBerth: BerthCode
  hasDangerousGoods: boolean
  dangerousGoodsClass?: string
  totalCrew: number
  totalPassengers: number
  duesOwed: string
  clearanceStatus: ClearanceStatus
}

export interface NoticeOfArrival {
  vesselName: string
  imoNumber: string
  vesselType: VesselType
  flagState: string
  grossTonnage: number
  lengthOverall: number
  portOfDeparture: string
  departureDate: string
  estimatedArrival: string
  destinationBerth: BerthCode
  hasDangerousGoods: boolean
  totalCrew: number
  totalPassengers: number
  shippingAgentName: string
  agentLicenceNumber: string
  contactEmail: string
  contactPhone: string
}

export interface FALForm1 {
  arrivalPort: string
  arrivalDate: string
  vesselName: string
  imoNumber: string
  callSign: string
  flagState: string
  lastPort: string
  nextPort: string
  masterName: string
  masterNationality: string
  safetyManagementCertificate: string
  declarationAccurate: boolean
  noContraband: boolean
  noStowaways: boolean
  masterSignatureHash: string
  signedAt: string
}

export interface CrewMember {
  rank: string
  familyName: string
  givenNames: string
  nationality: string
  passportNumber: string
  passportExpiry: string
  seafarersBookNumber: string
  placeOfBirth: string
  dateOfBirth: string
}

export interface FALForm5 {
  vesselName: string
  imoNumber: string
  portOfArrival: string
  arrivalDate: string
  totalCrewCount: number
  crew: CrewMember[]
}

export interface DangerousGoodsEntry {
  imdgClass: string
  unNumber: string
  properShippingName: string
  quantity: number
  quantityUnit: 'KG' | 'L' | 'UNITS'
  packagingType: string
  emergencyContact: string
  flashpoint?: number
}

export interface MaritimeHealthDeclaration {
  vesselName: string
  imoNumber: string
  lastInfectedPort: string | null
  deratisationCertificate: string
  deratisationExpiry: string
  crewHealthDeclaration: boolean
  illnessOnBoard: boolean
  deathOnBoard: boolean
  animalOnBoard: boolean
  sanitaryMeasures: boolean
  illnessDescription?: string
  affectedPersonCount?: number
}

export interface MinistryStatusEntry {
  ministry: string
  code: string
  status: MinistryStatus
  clearedAt?: string
}

export interface ClearanceRecord {
  vesselRef: string
  formRef: string
  vesselName: string
  imoNumber: string
  eta: string
  formStatuses: Array<{ label: string; status: MinistryStatus }>
  ministryStatuses: MinistryStatusEntry[]
  duesAmount: string
  duesStatus: 'CBS_HELD' | 'PAID' | 'PENDING'
  certRef?: string
}

// ── Aviation / Passenger ──────────────────────────────────────────────────────

export type PurposeCode = 'TOURISM' | 'BUSINESS' | 'TRANSIT' | 'RESIDENT' | 'OTHER'

export type RiskLevel = 'GREEN' | 'AMBER' | 'RED'

export interface DemoPassenger {
  ref: string
  familyName: string
  givenNames: string
  nationality: string
  passportNumber: string
  flightNumber: string
  purposeOfVisit: PurposeCode
  stayDuration: number
  riskLevel: RiskLevel
  carryingGoods: boolean
  goodsDescription?: string
  goodsValue?: string
  carryingCurrency: boolean
  currencyAmount?: string
  currencyType?: string
  carryingAnimals?: boolean
  animalDescription?: string
  previousIllness: boolean
  riskOverrideNote?: string
}

export interface PassengerArrivalDeclaration {
  familyName: string
  givenNames: string
  dateOfBirth: string
  nationality: string
  passportNumber: string
  passportExpiry: string
  flightNumber: string
  departureAirport: string
  arrivalDate: string
  accommodationAddress: string
  purposeOfVisit: PurposeCode
  stayDuration: number
  carryingGoods: boolean
  carryingCurrency: boolean
  carryingAnimals: boolean
  previousIllness: boolean
  currencyAmount?: string
  currencyType?: string
  goodsDescription?: string
  goodsValue?: string
}

export interface PassengerDepartureDeclaration {
  familyName: string
  givenNames: string
  passportNumber: string
  flightNumber: string
  departureDatetime: string
  exportingCurrency: boolean
  currencyExportAmount?: string
  currencyExportType?: string
}

export interface DemoFlight {
  flightNumber: string
  origin: string
  arrivalDate: string
  arrivalTime: string
  totalPassengers: number
  declared: number
  greenCount: number
  amberCount: number
  redCount: number
}

// ── CBS Governance ────────────────────────────────────────────────────────────

export interface CBSGovernanceItem {
  id: string
  itemNumber: number
  title: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  unlocks: string
  question: string
  resolved: boolean
  featureFlag: string
  technicalStatus: string
  awaitingCBS: string
  whatItDoes: string
  whyPending: string
  whatHappensWhen: string
}

// ── OMW Submission ────────────────────────────────────────────────────────────

export interface OMWSubmissionResult {
  success: boolean
  txHash: string | null
  demoMode: boolean
  ref: string
}

// ── OMW Auth (Prompt 08) ──────────────────────────────────────────────────────

export interface OMWAuthResult {
  role: 'SHIPPING_AGENT' | 'FREIGHT_FORWARDER' | 'GOV_OFFICER'
  zone: 1 | 2
  label: string
  agency: string | null
  authedAt: string
}

export interface AuditEntry {
  timestamp: string
  form: string
  reference: string
  transmittedTo: string
  status: string
}
