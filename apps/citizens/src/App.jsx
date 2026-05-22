import React, { useState, useEffect, useCallback } from 'react'
import { ResearchGate } from '@samoa-dpi/shared-ui'
import { CL, FL } from './theme.js'

if (typeof document !== 'undefined' && !document.getElementById('sdpi-fonts')) {
  const l = document.createElement('link')
  l.id = 'sdpi-fonts'; l.rel = 'stylesheet'
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@400;500;700;800&display=swap'
  document.head.appendChild(l)
}

// ─── TRANSLATIONS ────────────────────────────────────────────────────────────
const translations = {
  SM: {
    portalName: "Fale Tautua Samoa",
    portalSub: "DPI SAMOA — Vaega 1",
    langToggle: "EN",
    navAll: "O Auaunaga Atoa",
    navRecords: "La'u Faamaumauga",
    navTravel: "Malaga ma Tuaoi",
    navBusiness: "Pisinisi",
    navCommunity: "Lotoifale",
    navVerify: "La'u Fa'asinomaga",
    navHelp: "Fesoasoani",
    identifyTitle: "Fa'aalia Lau Igoa",
    identifySubtitle: "E mana'omia mo auaunaga fa'apitoa",
    idCitizen: "O a'u o se Tagata Samoa",
    idCitizenSub: "Fa'aulu lau Numera Fa'ailoga Atunu'u (NIN)",
    idVisitor: "O lo'o ou asiasi i Samoa",
    idVisitorSub: "Fa'aulu lau numera tusifolau ma aso o au malaga",
    idBusiness: "O a'u o se Pisinisi po'o se Fa'alapotopotoga",
    idBusinessSub: "Fa'aulu lau numera resitala pisinisi ma NIN",
    idVerify: "E mana'o a'u e fa'amaonia se Pepa",
    idVerifySub: "E le mana'omia se fa'asinomaga",
    idGuest: "Tagata Asiasi",
    idTier1: "Tagata Samoa — Vaega 1",
    idTier5: "Tagata Asiasi — VRN",
    statusLive: "Avanoa Nei",
    statusSoon: "O Lo'o Fa'atulaga",
    statusPending: "Fa'atali CBS",
    statusPhase2: "Vaega 2",
    cat1: "Fa'asinomaga ma Faamaumauga",
    cat2: "Malaga ma Tuaoi",
    cat3: "Auaunaga Pisinisi",
    cat4: "Soifua Maloloina",
    cat5: "Felauaiga",
    cat6: "Faamasinoga ma Lotoifale",
    cat7: "A'oga",
    cat8: "Fanua ma Siosiomaga",
    cat9: "Auaunaga Agafesootai",
    cat10: "Tupe",
    cat11: "Fa'amaonia se Pepa",
    fee: "Totogi",
    processing: "Taimi Fa'agasologa",
    requires: "Mana'omia",
    applyNow: "Talosaga Nei",
    learnMore: "Suesue Atili",
    comingSoon: "O Lo'o Fa'atulaga",
    addWatchlist: "Fa'aoga Lisi",
    close: "Tapuni",
    back: "Toe Foi",
    days: "aso pisinisi",
    free: "Fua",
    tierGateTitle: "E Mana'omia Fa'asinomaga",
    tierGateCitizen: "O lenei auaunaga e mana'omia ai lou fa'asinomaga o se Tagata Samoa.",
    tierGateAction: "Amata NDIDS Resitala",
    tierGateOffice: "Su'e le Ofisi SBS",
    comingSoonTitle: "O Lo'o Fa'atulaga",
    comingSoonMsg: "O lenei auaunaga o lo'o fa'atulaga ma o le a avanoa i le DPI Samoa.",
    comingSoonOffice: "I le taimi nei: asiasi lau ofisi fa'aletulafono latalata",
    verifyTitle: "Fa'amaonia se Pepa Faaletulafono",
    verifyDesc: "Su'e pe sa fa'ailoa moni se pepa e le malo — e le mana'omia se fa'asinomaga",
    verifyInput: "Fa'aulu le numera fa'amatalaga po'o su'e le QR",
    verifyBtn: "Fa'amaonia",
    footerNote: "O lenei o se fa'ata'ita'iga su'esu'e e fa'aauau i lalo o le Polokalama Su'esu'e NUS/ISOC 2026.",
    footerData: "E leai ni fa'amaumauga moni o tagata ua taofia.",
    recordsTitle: "O Lou Faamaumauga",
    recordsPlaceholder: "Fa'aulu lau numera fa'ailoga",
    recordsBtn: "Su'e la'u faamaumauga",
    recordsGate: "Fa'auli oe ina ia va'ai lau fa'amaumauga",
    balanceTitle: "Le Tupe Faaeletonika",
    balanceMsg: "O lau tupe faaeletonika o le a aliali mai i luga nei a maeʻa ona faʻaalu aloaia le faiga.",
    balanceLearn: "Aoao atili e uiga i le Tupe Faaeletonika →",
    helpTitle: "Fesoasoani",
    helpContact: "Fa'afesota'i",
    helpOffice: "Ofisi Latalata",
    helpOfficeNote: "Asiasi soʻo se ofisi o le SBS e resitala mo le NDIDS",
    helpAbout: "Fa'amatalaga",
    helpAboutMsg: "O lenei o se fa'ata'ita'iga su'esu'e a le malo o Samoa mo le Polokalama NUS/ISOC 2026.",
    signOut: "Fa'ato'a",
    viewAll: "Va'ai atoa →",
    services: "auaunaga",
    ninLabel: "Numera Fa'ailoga Atunu'u (NIN)",
    ninPlaceholder: "Pe'a fa'aulu lau NIN (numera 7)",
    passportLabel: "Numera Tusifolau",
    passportPlaceholder: "E.g. A12345678",
    arrivalLabel: "Aso Taunuu",
    nationalityLabel: "Atunu'u",
    companyLabel: "Numera Resitala Kamupani",
    companyPlaceholder: "E.g. SAM-2024-001",
    submitBtn: "Fa'amaonia",
    verifyNoLogin: "E le mana'omia se ulufale e fa'amaonia ai se pepa",
    verifyOrQR: "Po'o su'e se QR code",
    verifiedStatus: "✓ Ua Fa'amaonia",
    notFoundStatus: "E le'i maua le pepa i lenei fa'ata'ita'iga su'esu'e",
    notFoundNote: "I le oloa, o pepa uma a le malo o le a mafai ona fa'amaonia iinei",
    witnessRequired: "Molimau Aganuu",
    applyRefNote: "Lau numera talosaga",
    applyFeeNote: "Totogi e fa'aalu",
    applyFormNote: "O le fa'afesoʻotaʻiga o fomu o loʻo faʻagaioiina — Vaega 1",
    verifyAnother: "Fa'amaonia se isi pepa",
    verifyDocType: "Ituaiga Pepa",
    verifyIssuedBy: "Na Fa'ailoa e",
    verifyIssueDate: "Aso Na Fa'ailoa",
    verifyHolder: "Toʻo",
    verifyReference: "Numera Faʻailoga",
    verifyAuthentic: "O lenei pepa ua fa'amaonia — ua faamauina i le DPI Samoa",
    ministryAccessTitle: "Avanoa i Faamaumauga",
    ministryAccessPhase2SM: "O lo'o fa'atali le fa'afesoota'i ma le Matagaluega. O le a avanoa i le Vaega 2.",
    ministryAccessPhase2EN: "Connection to [ministry] is being established. Available in Phase 2.",
    ministryAccessGranted: "Na fa'atagaina lou avanoa i le",
    officeApia: "Ofisi Autu Apia — Beach Road, Apia",
    officeSavaii: "Ofisi Salelologa — Salelologa, Savaii",
    officeMore: "Ofisi isi — Vaega 2",
    requestAccess: "Talosaga Avanoa →",
  },
  EN: {
    portalName: "Samoa Citizen Services",
    portalSub: "DPI SAMOA — Phase 1",
    langToggle: "SM",
    navAll: "All Services",
    navRecords: "My Records",
    navTravel: "Travel & Border",
    navBusiness: "Business",
    navCommunity: "Community",
    navVerify: "My credentials",
    navHelp: "Help",
    identifyTitle: "Identify Yourself",
    identifySubtitle: "Required for specific services",
    idCitizen: "I am a Samoan Citizen",
    idCitizenSub: "Enter your National Identity Number (NIN)",
    idVisitor: "I am Visiting Samoa",
    idVisitorSub: "Enter your passport number and travel details",
    idBusiness: "I am a Business or Organisation",
    idBusinessSub: "Enter your company registration number and NIN",
    idVerify: "I want to Verify a Document",
    idVerifySub: "No identity required",
    idGuest: "Guest",
    idTier1: "Samoan Citizen — Tier 1",
    idTier5: "Visitor — VRN",
    statusLive: "Available Now",
    statusSoon: "Coming Soon",
    statusPending: "Pending CBS Decision",
    statusPhase2: "Phase 2",
    cat1: "Identity & Records",
    cat2: "Travel & Border",
    cat3: "Business Services",
    cat4: "Health",
    cat5: "Transport",
    cat6: "Justice & Community",
    cat7: "Education",
    cat8: "Land & Environment",
    cat9: "Social Services",
    cat10: "Financial",
    cat11: "Verify a Record",
    fee: "Fee",
    processing: "Processing Time",
    requires: "Requires",
    applyNow: "Apply Now",
    learnMore: "Learn More",
    comingSoon: "Coming Soon",
    addWatchlist: "Notify Me",
    close: "Close",
    back: "Back",
    days: "business days",
    free: "Free",
    tierGateTitle: "Identity Verification Required",
    tierGateCitizen: "This service requires you to be a verified Samoan citizen.",
    tierGateAction: "Start NDIDS Registration",
    tierGateOffice: "Find nearest SBS office",
    comingSoonTitle: "Coming Soon",
    comingSoonMsg: "This service is being built and will be available on Samoa DPI.",
    comingSoonOffice: "In the meantime: visit your nearest government office",
    verifyTitle: "Verify a Government-Issued Record",
    verifyDesc: "Confirm a document was issued by the government — no login required",
    verifyInput: "Enter reference number or scan QR code",
    verifyBtn: "Verify",
    footerNote: "This is a research prototype operated under the NUS/ISOC Research Programme 2026.",
    footerData: "No real citizen data is held.",
    recordsTitle: "Your Government Record",
    recordsPlaceholder: "Enter your reference number",
    recordsBtn: "Check my record →",
    recordsGate: "Please identify yourself to view your records",
    balanceTitle: "Your Digital Tālā",
    balanceMsg: "Your Digital Tālā balance will appear here once the system is officially launched.",
    balanceLearn: "Learn more about the Digital Tālā →",
    helpTitle: "Help",
    helpContact: "Contact Us",
    helpOffice: "Nearest Government Office",
    helpOfficeNote: "Visit any SBS office to register for NDIDS",
    helpAbout: "About this Platform",
    helpAboutMsg: "This is a research prototype built for the Government of Samoa under the NUS/ISOC Research Programme 2026.",
    signOut: "Sign Out",
    viewAll: "View all →",
    services: "services",
    ninLabel: "National Identity Number (NIN)",
    ninPlaceholder: "Enter your 7-digit NIN",
    passportLabel: "Passport Number",
    passportPlaceholder: "e.g. A12345678",
    arrivalLabel: "Arrival Date",
    nationalityLabel: "Nationality",
    companyLabel: "Company Registration Number",
    companyPlaceholder: "e.g. SAM-2024-001",
    submitBtn: "Confirm",
    verifyNoLogin: "No login required to verify a document",
    verifyOrQR: "Or scan a QR code",
    verifiedStatus: "✓ Verified",
    notFoundStatus: "Document not found in this research prototype",
    notFoundNote: "In production, all government-issued documents will be verifiable here",
    witnessRequired: "Cultural Witness",
    applyRefNote: "Your application reference",
    applyFeeNote: "Fee payable",
    applyFormNote: "Form connection in progress — Phase 1",
    verifyAnother: "Verify another record",
    verifyDocType: "Document Type",
    verifyIssuedBy: "Issued By",
    verifyIssueDate: "Issue Date",
    verifyHolder: "Holder",
    verifyReference: "Reference",
    verifyAuthentic: "This document is authentic — recorded on Samoa DPI",
    ministryAccessTitle: "Record Access",
    ministryAccessPhase2SM: "Connection to [ministry] is being established. Available in Phase 2.",
    ministryAccessPhase2EN: "Connection to [ministry] is being established. Available in Phase 2.",
    ministryAccessGranted: "Your access was granted on",
    officeApia: "Apia Main Office — Beach Road, Apia",
    officeSavaii: "Salelologa Office — Salelologa, Savaii",
    officeMore: "More offices — Phase 2",
    requestAccess: "Request Access →",
  }
}

// ─── SERVICE DATA ────────────────────────────────────────────────────────────
const SERVICE_DATA = [
  {
    id: 1, catKey: 'cat1', color: '#003087', icon: '◉', ministry: 'SBS / MWCSD',
    services: [
      { id:'SBS-001', name:'NDIDS Registration', nameS:'Resitala NDIDS', fee:'Free', feeS:'Fua', processing:'Same day', processingS:'Aso e tasi', minTier:0, status:'live', ministry:'Samoa Bureau of Statistics' },
      { id:'SBS-002', name:'Birth Certificate', nameS:'Tusi Faamaonia Fanau', fee:'WST 20.00', processing:'3 business days', minTier:2, status:'live', ministry:'Samoa Bureau of Statistics' },
      { id:'SBS-003', name:'Death Registration', nameS:'Resitala Maliu', fee:'WST 20.00', processing:'Same day', minTier:2, status:'soon', ministry:'SBS' },
      { id:'SBS-004', name:'Marriage Registration', nameS:'Resitala Faaipoipoga', fee:'WST 30.00', processing:'Same day', minTier:2, status:'soon', ministry:'SBS' },
      { id:'SBS-009', name:'Matai Title Registration', nameS:'Resitala Suafa Matai', fee:'WST 50.00', processing:'5 business days', minTier:2, status:'soon', ministry:'SBS' },
      { id:'MPMC-001', name:'Passport Application', nameS:'Talosaga Tusifolau', fee:'WST 200.00', processing:'5 business days', minTier:2, status:'soon', ministry:'MPMC Immigration' },
    ]
  },
  {
    id: 2, catKey: 'cat2', color: '#CE1126', icon: '✈', ministry: 'SAA / Customs / Immigration',
    services: [
      { id:'SAA-006', name:'Passenger Arrival Declaration', nameS:"Fa'amalumaluina Auai", fee:'Free', processing:'Instant QR', minTier:5, status:'soon', note:'Replaces paper arrival card', ministry:'SAA / Customs / Immigration' },
      { id:'SAA-007', name:'Passenger Departure Declaration', nameS:"Fa'amalumaluina Alu Ese", fee:'Free', processing:'Instant QR', minTier:5, status:'soon', ministry:'SAA / Customs / Immigration' },
      { id:'MPMC-006', name:'Visitor Permit Extension', nameS:"Fa'alautelega Perimita Asiasi", fee:'TBC', processing:'3 business days', minTier:5, status:'soon', ministry:'MPMC Immigration' },
      { id:'MPMC-007', name:'Residence Permit', nameS:'Perimita Nofoia', fee:'TBC', processing:'10 business days', minTier:4, status:'soon', ministry:'MPMC Immigration' },
      { id:'MPMC-008', name:'Work Permit', nameS:'Perimita Galuega', fee:'TBC', processing:'10 business days', minTier:4, status:'soon', ministry:'MPMC Immigration' },
    ]
  },
  {
    id: 3, catKey: 'cat3', color: '#C9A227', icon: '⬡', ministry: 'MCIL / MCR',
    services: [
      { id:'MCR-001', name:'Sole Trader Licence', nameS:'Laisene Pisinisi Tasi', fee:'WST 282.00/year', processing:'3 business days', minTier:1, status:'live', ministry:'Ministry of Customs & Revenue' },
      { id:'MCIL-001', name:'Company Registration', nameS:'Resitala Kamupani', fee:'WST 250.00', processing:'5 business days', minTier:1, status:'live', ministry:'MCIL' },
      { id:'MCIL-002', name:'Annual Return Filing', nameS:'Lipoti Faaletausaga', fee:'WST 50.00', processing:'Same day', minTier:1, status:'soon', ministry:'MCIL' },
      { id:'MCR-003', name:'VAGST Registration', nameS:'Resitala VAGST', fee:'Free', processing:'3 business days', minTier:1, status:'soon', ministry:'MCR' },
      { id:'MCR-007', name:'Tax Clearance Certificate', nameS:'Tusi Faamaonia Lafoga', fee:'WST 20.00', processing:'2 business days', minTier:1, status:'soon', ministry:'MCR' },
      { id:'MCIL-009', name:'Foreign Investment Certificate', nameS:"Tusi Tamaoaiga Fa'aese", fee:'WST 50.00', processing:'10 business days', minTier:7, status:'soon', ministry:'MCIL' },
    ]
  },
  {
    id: 4, catKey: 'cat4', color: '#10b981', icon: '✦', ministry: 'Ministry of Health',
    services: [
      { id:'MOH-011', name:'Health Clearance Certificate', nameS:'Tusi Faamaonia Soifua', fee:'WST 20.00', processing:'2 business days', minTier:1, status:'soon', ministry:'Ministry of Health' },
      { id:'MOH-012', name:'Vaccination Record Request', nameS:'Faamaumauga Tui', fee:'Free', processing:'Same day', minTier:1, status:'soon', ministry:'MOH' },
      { id:'MOH-007', name:'Food Safety Registration', nameS:"Resitala Saogalemu Mea'ai", fee:'TBC', processing:'5 business days', minTier:1, status:'soon', ministry:'MOH' },
      { id:'MOH-009', name:'Medicine Import Permit', nameS:'Perimita Aumai Vaitusi', fee:'TBC', processing:'10 business days', minTier:7, status:'soon', ministry:'MOH' },
    ]
  },
  {
    id: 5, catKey: 'cat5', color: '#6366f1', icon: '◎', ministry: 'Land Transport Authority',
    services: [
      { id:'LTA-001', name:"Vehicle Registration", nameS:"Resitala Va'a", fee:'Per LTA schedule', processing:'Same day', minTier:1, status:'soon', ministry:'Land Transport Authority' },
      { id:'LTA-003', name:"Driver's Licence (new)", nameS:"Laisene Ave Va'a", fee:'WST 21.00/month (TDL)', processing:'3 business days', minTier:1, status:'soon', ministry:'LTA' },
      { id:'LTA-006', name:'Foreign Licence Conversion', nameS:"Suiga Laisene Fa'aese", fee:'WST 284.00 – 315.00', processing:'3 business days', minTier:4, status:'soon', ministry:'LTA' },
      { id:'LTA-010', name:'Taxi Registration', nameS:"Resitala Ta'avale Asi", fee:'WST 37.00', processing:'2 business days', minTier:1, status:'soon', ministry:'LTA' },
    ]
  },
  {
    id: 6, catKey: 'cat6', color: '#f59e0b', icon: '⬢', ministry: 'MOJ / Police / SBS',
    services: [
      { id:'POL-001', name:'Police Clearance Certificate', nameS:'Tusi Faamaonia Leoleo', fee:'WST 30.00', processing:'5 business days', minTier:1, requiresWitness:true, status:'live', ministry:'Samoa Police Service' },
      { id:'MOJ-001', name:'Statutory Declaration', nameS:"Fa'amalosino Faaletulafono", fee:'Free', processing:'Instant', minTier:1, requiresWitness:true, status:'live', ministry:'Ministry of Justice' },
      { id:'MOJ-005', name:'Register as Cultural Witness', nameS:'Resitala o se Molimau Aganuu', fee:'WST 20.00/year', processing:'Same day', minTier:1, status:'live', ministry:'Ministry of Justice' },
      { id:'SBS-009b', name:'Matai Title Transfer', nameS:"Fa'aili Suafa Matai", fee:'TBC', processing:'10 business days', minTier:1, requiresWitness:true, status:'soon', ministry:'SBS / Land and Titles Court' },
    ]
  },
  {
    id: 7, catKey: 'cat7', color: '#0ea5e9', icon: '◈', ministry: 'MESC / SQA / NUS',
    services: [
      { id:'MESC-004', name:'Scholarship Application', nameS:'Talosaga Sikolasipi', fee:'Free', processing:'As per round', minTier:1, status:'soon', ministry:'Ministry of Education' },
      { id:'MESC-002', name:'Teacher Registration', nameS:'Resitala Faiaoga', fee:'TBC', processing:'10 business days', minTier:1, status:'soon', ministry:'MESC' },
      { id:'SQA-003', name:'Qualification Recognition', nameS:"Fa'ailoga Fa'amaumauga A'oa'oga", fee:'TBC', processing:'15 business days', minTier:1, status:'soon', ministry:'SQA' },
    ]
  },
  {
    id: 8, catKey: 'cat8', color: '#84cc16', icon: '⬟', ministry: 'MNRE',
    services: [
      { id:'MNRE-002', name:'Land Title Enquiry', nameS:"Su'esu'e Koluse Fanua", fee:'TBC', processing:'5 business days', minTier:1, status:'soon', ministry:'MNRE' },
      { id:'MNRE-003', name:'Subdivision Permit', nameS:'Perimita Vaeluina Fanua', fee:'TBC', processing:'15 business days', minTier:1, status:'soon', ministry:'MNRE' },
      { id:'MNRE-006', name:'Environmental Impact Assessment', nameS:'Iloiloga o Aafiaga i Siosiomaga', fee:'TBC', processing:'20 business days', minTier:7, status:'soon', ministry:'MNRE' },
    ]
  },
  {
    id: 9, catKey: 'cat9', color: '#ec4899', icon: '◆', ministry: 'MWCSD / MOF',
    services: [
      { id:'MWCSD-004', name:"Women's Development Fund", nameS:"Faamauga Atina'e o Tamaitai", fee:'Free', processing:'As per round', minTier:1, status:'soon', ministry:'MWCSD' },
      { id:'MOF-004', name:'Social Welfare Benefit', nameS:"Fa'amauga Agafesootai", fee:'Free', processing:'10 business days', minTier:1, status:'soon', ministry:'Ministry of Finance' },
      { id:'MOF-005', name:'Disability Allowance', nameS:"Fa'amauga Fa'ama'i", fee:'Free', processing:'10 business days', minTier:1, status:'soon', ministry:'MOF' },
    ]
  },
  {
    id: 10, catKey: 'cat10', color: '#14b8a6', icon: '◈', ministry: 'SNPF / DBS / CBS',
    services: [
      { id:'SNPF-003', name:'Provident Fund Enquiry', nameS:"Su'esu'e Tupe Fa'asao", fee:'Free', processing:'Instant', minTier:1, status:'soon', ministry:'SNPF' },
      { id:'SNPF-005', name:'Housing Advance Application', nameS:"Talosaga Fa'auma Fale", fee:'Free', processing:'15 business days', minTier:1, status:'soon', ministry:'SNPF' },
      { id:'DBS-001', name:'SME Loan Application', nameS:'Talosaga Nonogatupe SME', fee:'Free', processing:'20 business days', minTier:1, status:'soon', ministry:'Development Bank of Samoa' },
    ]
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return w
}

function hasTierAccess(minTier, tier) {
  if (minTier === 0) return true
  if (tier === null) return false
  if (tier === 1) return minTier <= 2
  if (tier === 5) return minTier <= 5
  if (tier === 7) return true
  return false
}

function makeVRN() {
  return 'VIS-2026-' + Math.random().toString(36).substr(2, 8).toUpperCase()
}

function makeAppRef(serviceId) {
  return `${serviceId}-DEMO-${Math.floor(100000 + Math.random() * 900000)}`
}

// ─── STATUS CHIP ─────────────────────────────────────────────────────────────

function StatusChip({ status, t }) {
  const configs = {
    live:    { bg: '#e6f4ec', color: '#00793D', border: '#00793D', label: t.statusLive,    icon: '●' },
    soon:    { bg: '#fff8e1', color: '#B87000', border: '#C9A227', label: t.statusSoon,    icon: '◌' },
    pending: { bg: '#f3e8ff', color: '#6d28d9', border: '#8b5cf6', label: t.statusPending, icon: '⊘' },
  }
  const c = configs[status] || configs.soon
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: 20, padding: '2px 10px',
      fontFamily: FL.mono, fontSize: 10, fontWeight: 600,
      letterSpacing: '0.3px',
    }}>
      <span aria-hidden="true">{c.icon}</span>
      <span>{c.label}</span>
    </span>
  )
}

// ─── POPUP OVERLAY ────────────────────────────────────────────────────────────

function PopupCard({ children, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(10,22,40,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div style={{
        background: CL.surface, borderRadius: 12, padding: '24px',
        maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: `1px solid ${CL.border}`,
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {children}
      </div>
    </div>
  )
}

function ComingSoonPopup({ service, t, lang, onClose }) {
  return (
    <PopupCard onClose={onClose}>
      <div style={{ fontFamily: FL.mono, fontSize: 10, color: '#B87000', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>◌ {t.comingSoonTitle}</div>
      <h3 style={{ fontFamily: FL.ui, fontSize: 18, fontWeight: 700, color: CL.text, margin: '0 0 8px' }}>
        {lang === 'SM' ? service.nameS : service.name}
      </h3>
      <p style={{ fontFamily: FL.ui, fontSize: 14, color: CL.textSoft, lineHeight: 1.6, margin: '0 0 12px' }}>{t.comingSoonMsg}</p>
      <p style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, margin: '0 0 4px' }}>
        Contact: {service.ministry}
      </p>
      <p style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, margin: '0 0 20px' }}>{t.comingSoonOffice}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => console.log('Notify:', service.id)} style={styles.btnSecondary}>{t.addWatchlist}</button>
        <button onClick={onClose} style={styles.btnPrimary}>{t.close}</button>
      </div>
    </PopupCard>
  )
}

function TierGatePopup({ service, t, lang, onClose, onOpenIdentity }) {
  return (
    <PopupCard onClose={onClose}>
      <div style={{ fontFamily: FL.mono, fontSize: 10, color: CL.primary, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>◉ {t.tierGateTitle}</div>
      <h3 style={{ fontFamily: FL.ui, fontSize: 18, fontWeight: 700, color: CL.text, margin: '0 0 8px' }}>
        {lang === 'SM' ? service.nameS : service.name}
      </h3>
      <p style={{ fontFamily: FL.ui, fontSize: 14, color: CL.textSoft, lineHeight: 1.6, margin: '0 0 20px' }}>{t.tierGateCitizen}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={() => { onClose(); onOpenIdentity() }} style={styles.btnPrimary}>{t.tierGateAction}</button>
        <button onClick={onClose} style={styles.btnSecondary}>{t.tierGateOffice}</button>
        <button onClick={onClose} style={styles.btnGhost}>{t.close}</button>
      </div>
    </PopupCard>
  )
}

function ApplyPopup({ service, t, lang, onClose }) {
  const [ref] = useState(() => makeAppRef(service.id))
  return (
    <PopupCard onClose={onClose}>
      <div style={{ fontFamily: FL.mono, fontSize: 10, color: '#00793D', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>● {t.statusLive}</div>
      <h3 style={{ fontFamily: FL.ui, fontSize: 18, fontWeight: 700, color: CL.text, margin: '0 0 16px' }}>
        {lang === 'SM' ? service.nameS : service.name}
      </h3>
      <div style={{ background: CL.surface2, borderRadius: 8, padding: '16px', marginBottom: 16 }}>
        <p style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, margin: '0 0 4px' }}>{t.applyRefNote}</p>
        <p style={{ fontFamily: FL.mono, fontSize: 14, fontWeight: 700, color: CL.primary, margin: '0 0 12px' }}>{ref}</p>
        <p style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, margin: '0 0 4px' }}>{t.applyFeeNote}</p>
        <p style={{ fontFamily: FL.ui, fontSize: 14, fontWeight: 600, color: CL.text, margin: 0 }}>
          {service.feeS && lang === 'SM' ? service.feeS : service.fee} via bank transfer or WST-DPI
        </p>
      </div>
      <p style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, margin: '0 0 20px' }}>{t.applyFormNote}</p>
      <button onClick={onClose} style={styles.btnPrimary}>{t.close}</button>
    </PopupCard>
  )
}

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────

function ServiceCard({ service, t, lang, identityState, onOpenIdentity }) {
  const [popup, setPopup] = useState(null)
  const hasAccess = hasTierAccess(service.minTier, identityState.tier)
  const svcName = lang === 'SM' ? service.nameS : service.name
  const svcFee = (lang === 'SM' && service.feeS) ? service.feeS : service.fee
  const svcProcessing = (lang === 'SM' && service.processingS) ? service.processingS : service.processing

  function handleBtn() {
    if (service.status === 'live' && hasAccess) { setPopup('apply'); return }
    if (service.status === 'live' && !hasAccess) { setPopup('tier'); return }
    setPopup('soon')
  }

  const btnLabel = service.status === 'live' && hasAccess
    ? `${t.applyNow} →`
    : service.status === 'live'
    ? `${t.requires}: Tier ${service.minTier}`
    : t.comingSoon

  const btnStyle = service.status === 'live' && hasAccess
    ? styles.btnPrimary
    : service.status === 'live'
    ? { ...styles.btnSecondary, borderColor: '#CE1126', color: '#CE1126' }
    : styles.btnGhost

  return (
    <div style={{
      background: CL.surface, borderRadius: 10, border: `1px solid ${CL.border}`,
      padding: '16px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FL.ui, fontSize: 14, fontWeight: 600, color: CL.text, marginBottom: 2 }}>{svcName}</div>
          <div style={{ fontFamily: FL.mono, fontSize: 10, color: CL.muted }}>{service.ministry}</div>
        </div>
        <StatusChip status={service.status} t={t} />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: FL.mono, fontSize: 9, color: CL.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.fee}</div>
          <div style={{ fontFamily: FL.mono, fontSize: 12, color: CL.text, fontWeight: 600 }}>{svcFee}</div>
        </div>
        <div>
          <div style={{ fontFamily: FL.mono, fontSize: 9, color: CL.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.processing}</div>
          <div style={{ fontFamily: FL.mono, fontSize: 12, color: CL.text, fontWeight: 600 }}>{svcProcessing}</div>
        </div>
      </div>
      {service.requiresWitness && (
        <div style={{ fontFamily: FL.mono, fontSize: 10, color: '#C9A227', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>⊕</span><span>{t.witnessRequired} {lang === 'SM' ? 'e mana\'omia' : 'required'}</span>
        </div>
      )}
      {service.note && (
        <div style={{ fontFamily: FL.mono, fontSize: 10, color: CL.muted, fontStyle: 'italic' }}>{service.note}</div>
      )}
      <button onClick={handleBtn} style={{ ...btnStyle, alignSelf: 'flex-start', marginTop: 4 }}>{btnLabel}</button>

      {popup === 'apply' && <ApplyPopup service={service} t={t} lang={lang} onClose={() => setPopup(null)} />}
      {popup === 'soon' && <ComingSoonPopup service={service} t={t} lang={lang} onClose={() => setPopup(null)} />}
      {popup === 'tier' && <TierGatePopup service={service} t={t} lang={lang} onClose={() => setPopup(null)} onOpenIdentity={onOpenIdentity} />}
    </div>
  )
}

// ─── CATEGORY SECTION ─────────────────────────────────────────────────────────

function CategorySection({ cat, t, lang, identityState, onOpenIdentity, defaultOpen }) {
  const [expanded, setExpanded] = useState(defaultOpen || false)
  const preview = cat.services.slice(0, 3)
  const catName = t[cat.catKey]

  return (
    <div style={{
      background: CL.surface, borderRadius: 12,
      border: `1px solid ${CL.border}`,
      borderLeft: `4px solid ${cat.color}`,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20, color: cat.color }}>{cat.icon}</span>
            <div>
              <div style={{ fontFamily: FL.ui, fontSize: 15, fontWeight: 700, color: CL.text }}>{catName}</div>
              <div style={{ fontFamily: FL.mono, fontSize: 10, color: CL.muted }}>{cat.ministry}</div>
            </div>
          </div>
          <span style={{ fontFamily: FL.mono, fontSize: 10, color: CL.muted, whiteSpace: 'nowrap' }}>
            {cat.services.length} {t.services}
          </span>
        </div>

        {!expanded && (
          <ul style={{ margin: 0, padding: '0 0 0 4px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {preview.map(s => (
              <li key={s.id} style={{ fontFamily: FL.ui, fontSize: 13, color: CL.textSoft, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: cat.color, fontSize: 8 }}>●</span>
                {lang === 'SM' ? s.nameS : s.name}
              </li>
            ))}
            {cat.services.length > 3 && (
              <li style={{ fontFamily: FL.mono, fontSize: 10, color: CL.muted }}>
                +{cat.services.length - 3} {lang === 'SM' ? 'tele atu' : 'more'}
              </li>
            )}
          </ul>
        )}

        <button
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          style={{
            ...styles.btnGhost,
            marginTop: 12,
            color: cat.color,
            borderColor: cat.color + '44',
            fontFamily: FL.mono,
            fontSize: 11,
          }}
        >
          {expanded ? `↑ ${t.close}` : t.viewAll}
        </button>
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid ${CL.border}`, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cat.services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              t={t}
              lang={lang}
              identityState={identityState}
              onOpenIdentity={onOpenIdentity}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── SERVICE GRID ─────────────────────────────────────────────────────────────

function ServiceGrid({ t, lang, identityState, onOpenIdentity, filterIds }) {
  const width = useWindowWidth()
  const cols = width < 768 ? 1 : width < 1024 ? 2 : 3
  const cats = filterIds ? SERVICE_DATA.filter(c => filterIds.includes(c.id)) : SERVICE_DATA

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 16,
    }}>
      {cats.map(cat => (
        <CategorySection
          key={cat.id}
          cat={cat}
          t={t}
          lang={lang}
          identityState={identityState}
          onOpenIdentity={onOpenIdentity}
          defaultOpen={filterIds?.length === 1}
        />
      ))}
    </div>
  )
}

// ─── VERIFY TAB ──────────────────────────────────────────────────────────────

function VerifyTab({ t }) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)

  function handleVerify(e) {
    e.preventDefault()
    if (!input.trim()) return
    if (input.toUpperCase().includes('DEMO')) {
      setResult({
        status: 'verified',
        docType: 'Business Licence',
        issuedBy: 'Ministry of Customs & Revenue',
        issueDate: '15/05/2026',
        holder: 'Samoa Business Ltd',
        ref: input.trim(),
      })
    } else {
      setResult({ status: 'not-found' })
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ background: CL.surface, borderRadius: 12, border: `1px solid ${CL.border}`, borderLeft: `4px solid #8b5cf6`, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 24, color: '#8b5cf6' }}>✓</span>
          <h2 style={{ fontFamily: FL.ui, fontSize: 20, fontWeight: 700, color: CL.text, margin: 0 }}>{t.verifyTitle}</h2>
        </div>
        <p style={{ fontFamily: FL.ui, fontSize: 14, color: CL.textSoft, lineHeight: 1.6, margin: '0 0 20px' }}>{t.verifyDesc}</p>

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setResult(null) }}
            placeholder={t.verifyInput}
            style={styles.input}
            onFocus={e => e.target.style.borderColor = '#8b5cf6'}
            onBlur={e => e.target.style.borderColor = CL.border}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ ...styles.btnPrimary, background: '#8b5cf6', flex: 1 }}>{t.verifyBtn}</button>
            <button type="button" onClick={() => console.log('QR scan')} style={styles.btnSecondary}>{t.verifyOrQR}</button>
          </div>
        </form>

        {result?.status === 'verified' && (
          <div role="status" style={{ marginTop: 20, background: '#e6f4ec', border: `1px solid #00793D`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontFamily: FL.mono, fontSize: 14, fontWeight: 700, color: '#00793D', marginBottom: 12 }}>{t.verifiedStatus}</div>
            {[
              [t.verifyDocType, result.docType],
              [t.verifyIssuedBy, result.issuedBy],
              [t.verifyIssueDate, result.issueDate],
              [t.verifyHolder, result.holder],
              [t.verifyReference, result.ref],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${CL.border}`, padding: '6px 0', gap: 8 }}>
                <span style={{ fontFamily: FL.mono, fontSize: 10, color: CL.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                <span style={{ fontFamily: FL.ui, fontSize: 13, fontWeight: 600, color: CL.text }}>{val}</span>
              </div>
            ))}
            <p style={{ fontFamily: FL.mono, fontSize: 11, color: '#00793D', marginTop: 12, marginBottom: 12 }}>{t.verifyAuthentic}</p>
            <button
              onClick={() => { setResult(null); setInput('') }}
              style={styles.btnSecondary}
            >
              {t.verifyAnother}
            </button>
          </div>
        )}

        {result?.status === 'not-found' && (
          <div role="alert" style={{ marginTop: 20, background: CL.errorLight, border: `1px solid ${CL.error}`, borderRadius: 8, padding: 16 }}>
            <p style={{ fontFamily: FL.ui, fontSize: 14, fontWeight: 600, color: CL.error, margin: '0 0 8px' }}>{t.notFoundStatus}</p>
            <p style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, margin: '0 0 12px' }}>{t.notFoundNote}</p>
            <button
              onClick={() => { setResult(null); setInput('') }}
              style={styles.btnSecondary}
            >
              {t.verifyAnother}
            </button>
          </div>
        )}

        <p style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, marginTop: 16, marginBottom: 0 }}>ℹ {t.verifyNoLogin}</p>
      </div>
    </div>
  )
}

// ─── RECORDS TAB ─────────────────────────────────────────────────────────────

const MOCK_RECORDS = {
  'SC-001': {
    ministryServices: [
      { ministry: 'Ministry of Health', service: 'Medical records update', date: '15/05/2026' },
      { ministry: 'Ministry of Education', service: 'Education enrolment confirmed', date: '03/03/2026' },
    ],
  },
  'SC-002': {
    ministryServices: [
      { ministry: 'Ministry of Finance', service: 'Tax records registered', date: '10/04/2026' },
    ],
  },
}

function MinistryAccessPopup({ ministry, date, t, lang, onClose }) {
  const msg = lang === 'SM'
    ? t.ministryAccessPhase2SM
    : t.ministryAccessPhase2EN.replace('[ministry]', ministry)
  return (
    <PopupCard onClose={onClose}>
      <div style={{ fontFamily: FL.mono, fontSize: 10, color: CL.primary, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
        ◉ {ministry} — {t.ministryAccessTitle}
      </div>
      <p style={{ fontFamily: FL.ui, fontSize: 14, color: CL.textSoft, lineHeight: 1.6, margin: '0 0 12px' }}>{msg}</p>
      {date && (
        <p style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, margin: '0 0 20px' }}>
          {t.ministryAccessGranted} {date}
        </p>
      )}
      <button onClick={onClose} style={styles.btnPrimary}>{t.close}</button>
    </PopupCard>
  )
}

function RecordsTab({ t, lang, identityState, onOpenIdentity }) {
  const [ref, setRef] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)
  const [ministryPopup, setMinistryPopup] = useState(null)

  function handleSearch(e) {
    e.preventDefault()
    const record = MOCK_RECORDS[ref.trim().toUpperCase()]
    setResult(record || null)
    setSearched(true)
  }

  if (!identityState.tier) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: CL.surface, borderRadius: 12, border: `1px solid ${CL.border}`, padding: '32px 24px' }}>
          <span style={{ fontSize: 40, display: 'block', marginBottom: 16 }}>🔒</span>
          <p style={{ fontFamily: FL.ui, fontSize: 15, color: CL.textSoft, marginBottom: 20 }}>{t.recordsGate}</p>
          <button onClick={onOpenIdentity} style={styles.btnPrimary}>{t.identifyTitle} →</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Identity badge */}
      <div style={{ background: CL.successLight, border: `1px solid ${CL.success}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20 }}>✓</span>
        <div>
          <div style={{ fontFamily: FL.ui, fontSize: 14, fontWeight: 700, color: CL.success }}>{identityState.display}</div>
          {identityState.refId && (
            <div style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted }}>{identityState.refId}</div>
          )}
        </div>
      </div>

      {/* Record lookup */}
      <div style={{ background: CL.surface, borderRadius: 12, border: `1px solid ${CL.border}`, borderTop: `3px solid ${CL.primary}`, padding: '24px' }}>
        <h2 style={{ fontFamily: FL.ui, fontSize: 20, fontWeight: 700, color: CL.primary, margin: '0 0 4px' }}>{t.recordsTitle}</h2>
        <p style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, margin: '0 0 20px' }}>
          {lang === 'SM' ? 'Faamaumauga Faʻamaonia' : 'Verified government record'}
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label htmlFor="rec-ref" style={{ fontFamily: FL.mono, fontSize: 11, color: CL.textSoft, letterSpacing: '0.5px' }}>
            {lang === 'SM' ? 'Numera Faʻailoga' : 'Reference Number'}
          </label>
          <input id="rec-ref" type="text" value={ref} onChange={e => setRef(e.target.value)} placeholder={t.recordsPlaceholder} style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>{t.recordsBtn}</button>
        </form>

        {searched && result && (
          <div role="status" style={{ marginTop: 16, background: '#e6f4ec', border: `1px solid ${CL.success}`, borderRadius: 8, padding: 16 }}>
            <p style={{ fontFamily: FL.ui, fontSize: 14, color: CL.success, fontWeight: 700, margin: '0 0 12px' }}>
              {lang === 'SM' ? '✓ Ua lesitala ma le Malo o Samoa' : '✓ Registered with the Government of Samoa'}
            </p>
            {result.ministryServices.map((s, i) => (
              <div key={i} style={{ marginBottom: 10, borderBottom: i < result.ministryServices.length - 1 ? `1px solid ${CL.border}` : 'none', paddingBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: FL.ui, fontSize: 14, fontWeight: 600, color: CL.text }}>{s.ministry}</div>
                    <div style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted }}>{s.date}</div>
                    <div style={{ fontFamily: FL.ui, fontSize: 13, color: CL.textSoft }}>{s.service}</div>
                  </div>
                  <button
                    onClick={() => setMinistryPopup({ ministry: s.ministry, date: s.date })}
                    style={{ ...styles.btnSecondary, fontSize: 12, padding: '6px 10px', minHeight: 36, whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    {t.requestAccess}
                  </button>
                </div>
              </div>
            ))}
            {ministryPopup && (
              <MinistryAccessPopup
                ministry={ministryPopup.ministry}
                date={ministryPopup.date}
                t={t}
                lang={lang}
                onClose={() => setMinistryPopup(null)}
              />
            )}
          </div>
        )}

        {searched && !result && (
          <p role="alert" style={{ marginTop: 12, fontFamily: FL.ui, fontSize: 14, color: CL.error }}>
            {lang === 'SM' ? "E le'i maua le faamaumauga. Toe taumafai." : 'Record not found. Try SC-001 or SC-002.'}
          </p>
        )}
      </div>

      {/* Digital Tālā */}
      <div style={{ background: CL.surface, borderRadius: 12, border: `1px solid ${CL.border}`, borderTop: `3px solid ${CL.primary}`, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>💰</span>
          <h2 style={{ fontFamily: FL.ui, fontSize: 20, fontWeight: 700, color: CL.primary, margin: 0 }}>{t.balanceTitle}</h2>
        </div>
        <p style={{ fontFamily: FL.ui, fontSize: 15, lineHeight: 1.7, color: CL.textSoft, margin: '0 0 20px' }}>{t.balanceMsg}</p>
        <a href="#" onClick={e => e.preventDefault()} style={{ ...styles.btnPrimary, display: 'inline-block', textDecoration: 'none' }}>
          {t.balanceLearn}
        </a>
      </div>
    </div>
  )
}

// ─── HELP TAB ─────────────────────────────────────────────────────────────────

function HelpTab({ t }) {
  const sections = [
    {
      title: t.helpContact,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <a
            href="mailto:synergyblockchaintf@gmail.com"
            style={{ fontFamily: FL.mono, fontSize: 13, color: CL.primary, textDecoration: 'none' }}
          >
            synergyblockchaintf@gmail.com
          </a>
          <div style={{ fontFamily: FL.ui, fontSize: 13, color: CL.textSoft }}>
            {lang === 'SM' ? 'Fesili su\'esu\'e: NUS, Dr. Edna Temese' : 'Research enquiries: NUS, Dr. Edna Temese'}
          </div>
        </div>
      )
    },
    {
      title: t.helpOffice,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: FL.ui, fontSize: 13, color: CL.textSoft }}>{t.helpOfficeNote}</div>
          <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[t.officeApia, t.officeSavaii].map(office => (
              <li key={office} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: CL.primary, fontSize: 12 }}>●</span>
                <span style={{ fontFamily: FL.ui, fontSize: 13, color: CL.text }}>{office}</span>
              </li>
            ))}
            <li style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, paddingLeft: 20 }}>{t.officeMore}</li>
          </ul>
        </div>
      )
    },
    {
      title: t.helpAbout,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontFamily: FL.ui, fontSize: 13, color: CL.textSoft, lineHeight: 1.6, margin: 0 }}>{t.helpAboutMsg}</p>
          <p style={{ fontFamily: FL.ui, fontSize: 13, color: CL.textSoft, lineHeight: 1.6, margin: 0 }}>
            {t.footerNote} {t.footerData}
          </p>
        </div>
      )
    },
  ]

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontFamily: FL.ui, fontSize: 22, fontWeight: 700, color: CL.primary, margin: 0 }}>{t.helpTitle}</h2>
      {sections.map(s => (
        <div key={s.title} style={{ background: CL.surface, borderRadius: 10, border: `1px solid ${CL.border}`, padding: '20px' }}>
          <h3 style={{ fontFamily: FL.ui, fontSize: 15, fontWeight: 700, color: CL.text, margin: '0 0 12px' }}>{s.title}</h3>
          {s.content}
        </div>
      ))}
    </div>
  )
}

// ─── IDENTITY PANEL ───────────────────────────────────────────────────────────

function IdentityPanel({ t, lang, onIdentify, onClose, onGoVerify }) {
  const [step, setStep] = useState(null)
  const [nin, setNin] = useState('')
  const [passport, setPassport] = useState('')
  const [company, setCompany] = useState('')

  function handleCitizen(e) {
    e.preventDefault()
    if (!nin.trim()) return
    onIdentify(1, t.idTier1, `NIN-${nin.trim()}`)
  }

  function handleVisitor(e) {
    e.preventDefault()
    if (!passport.trim()) return
    const vrn = makeVRN()
    onIdentify(5, t.idTier5, vrn)
  }

  function handleBusiness(e) {
    e.preventDefault()
    if (!company.trim()) return
    onIdentify(7, 'Business — ERI', `ERI-${company.trim()}`)
  }

  const options = [
    {
      key: 'citizen',
      icon: '🏛',
      label: t.idCitizen,
      sub: t.idCitizenSub,
      form: (
        <form onSubmit={handleCitizen} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <label style={styles.label}>{t.ninLabel}</label>
          <input
            type="text"
            value={nin}
            onChange={e => setNin(e.target.value.replace(/\D/g, '').slice(0, 7))}
            placeholder={t.ninPlaceholder}
            maxLength={7}
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.btnPrimary}>{t.submitBtn} →</button>
        </form>
      )
    },
    {
      key: 'visitor',
      icon: '✈',
      label: t.idVisitor,
      sub: t.idVisitorSub,
      form: (
        <form onSubmit={handleVisitor} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <label style={styles.label}>{t.passportLabel}</label>
          <input type="text" value={passport} onChange={e => setPassport(e.target.value)} placeholder={t.passportPlaceholder} style={styles.input} autoFocus />
          <label style={styles.label}>{t.arrivalLabel}</label>
          <input type="date" style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>{t.submitBtn} →</button>
        </form>
      )
    },
    {
      key: 'business',
      icon: '🏢',
      label: t.idBusiness,
      sub: t.idBusinessSub,
      form: (
        <form onSubmit={handleBusiness} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <label style={styles.label}>{t.companyLabel}</label>
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder={t.companyPlaceholder} style={styles.input} autoFocus />
          <button type="submit" style={styles.btnPrimary}>{t.submitBtn} →</button>
        </form>
      )
    },
    {
      key: 'verify',
      icon: '🔍',
      label: t.idVerify,
      sub: t.idVerifySub,
      action: () => { onGoVerify(); onClose() }
    },
  ]

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(10,22,40,0.55)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '80px 20px 20px',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t.identifyTitle}
    >
      <div style={{
        background: CL.surface, borderRadius: 16, padding: 24,
        maxWidth: 480, width: '100%',
        border: `1px solid ${CL.primary}`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxHeight: '80vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontFamily: FL.ui, fontSize: 20, fontWeight: 700, color: CL.primary, margin: '0 0 4px' }}>{t.identifyTitle}</h2>
            <p style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, margin: 0 }}>{t.identifySubtitle}</p>
          </div>
          <button onClick={onClose} aria-label={t.close} style={{ ...styles.btnGhost, padding: '4px 10px' }}>{t.close}</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map(opt => (
            <div key={opt.key}>
              <button
                onClick={() => opt.action ? opt.action() : setStep(step === opt.key ? null : opt.key)}
                style={{
                  width: '100%', textAlign: 'left', padding: '14px 16px',
                  background: step === opt.key ? CL.surfaceBlue : CL.surface2,
                  border: `1px solid ${step === opt.key ? CL.primary : CL.border}`,
                  borderRadius: 10, cursor: 'pointer',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  outline: 'none',
                }}
                onFocus={e => e.currentTarget.style.outline = `2px solid #CE1126`}
                onBlur={e => e.currentTarget.style.outline = 'none'}
              >
                <span style={{ fontSize: 22 }}>{opt.icon}</span>
                <div>
                  <div style={{ fontFamily: FL.ui, fontSize: 14, fontWeight: 700, color: CL.text }}>{opt.label}</div>
                  <div style={{ fontFamily: FL.mono, fontSize: 11, color: CL.muted, marginTop: 2 }}>{opt.sub}</div>
                </div>
              </button>
              {step === opt.key && opt.form && (
                <div style={{ padding: '0 8px 4px' }}>{opt.form}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── NAV TABS ─────────────────────────────────────────────────────────────────

const TAB_IDS = ['all', 'records', 'travel', 'business', 'community', 'verify', 'help']

function NavTabs({ activeTab, setActiveTab, t }) {
  const tabLabels = {
    all: t.navAll, records: t.navRecords, travel: t.navTravel,
    business: t.navBusiness, community: t.navCommunity, verify: t.navVerify, help: t.navHelp
  }

  function handleKeyDown(e, tabId) {
    const idx = TAB_IDS.indexOf(tabId)
    if (e.key === 'ArrowRight') {
      const next = TAB_IDS[(idx + 1) % TAB_IDS.length]
      setActiveTab(next)
      document.getElementById(`tab-${next}`)?.focus()
    } else if (e.key === 'ArrowLeft') {
      const prev = TAB_IDS[(idx - 1 + TAB_IDS.length) % TAB_IDS.length]
      setActiveTab(prev)
      document.getElementById(`tab-${prev}`)?.focus()
    }
  }

  return (
    <nav style={{ background: CL.surface, borderBottom: `1px solid ${CL.border}`, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div
        role="tablist"
        aria-label="Main navigation"
        style={{ display: 'flex', minWidth: 'max-content', padding: '0 12px' }}
      >
        {TAB_IDS.map(tabId => {
          const isActive = activeTab === tabId
          return (
            <button
              key={tabId}
              id={`tab-${tabId}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tabId}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tabId)}
              onKeyDown={e => handleKeyDown(e, tabId)}
              style={{
                fontFamily: FL.ui, fontSize: 13, fontWeight: isActive ? 700 : 500,
                color: isActive ? CL.accent : CL.muted,
                background: 'none', border: 'none',
                borderBottom: isActive ? `3px solid ${CL.accent}` : '3px solid transparent',
                padding: '14px 16px', cursor: 'pointer',
                whiteSpace: 'nowrap', minHeight: 48, minWidth: 44,
                transition: 'color 0.15s, border-color 0.15s',
                outline: 'none',
              }}
              onFocus={e => { if (!isActive) e.currentTarget.style.outline = `2px solid #CE112644` }}
              onBlur={e => e.currentTarget.style.outline = 'none'}
            >
              {tabLabels[tabId]}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ─── HEADER ───────────────────────────────────────────────────────────────────

function CitizenHeader({ lang, setLang, t, identityState, onIdentityClick }) {
  const tierColor = identityState.tier === 1 ? CL.success : identityState.tier ? CL.primary : CL.muted
  const tierLabel = identityState.tier ? `✓ ${identityState.display}` : `${t.idGuest} ▾`

  return (
    <header style={{
      background: CL.primary, color: '#fff',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 10, position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FL.ui, fontSize: 16, fontWeight: 700, lineHeight: 1.2, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {t.portalName}
        </div>
        <div style={{ fontFamily: FL.mono, fontSize: 9, opacity: 0.65, letterSpacing: '0.5px' }}>
          {t.portalSub}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={onIdentityClick}
          aria-label={identityState.tier ? `${identityState.display} — click to manage` : 'Identify yourself'}
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: `1px solid ${identityState.tier ? 'rgba(0,200,100,0.5)' : 'rgba(255,255,255,0.3)'}`,
            borderRadius: 6,
            color: identityState.tier ? '#5fffb0' : 'rgba(255,255,255,0.75)',
            cursor: 'pointer',
            fontFamily: FL.mono,
            fontSize: 10,
            padding: '6px 10px',
            minHeight: 44,
            whiteSpace: 'nowrap',
            maxWidth: 180,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {tierLabel}
        </button>

        <button
          onClick={() => setLang(l => l === 'SM' ? 'EN' : 'SM')}
          aria-label={`Switch language — currently ${lang}`}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 6, color: '#fff', cursor: 'pointer',
            fontFamily: FL.mono, fontSize: 11, padding: '6px 12px',
            minHeight: 44, minWidth: 44,
          }}
        >
          {t.langToggle}
        </button>
      </div>
    </header>
  )
}

// ─── OFFLINE BANNER ────────────────────────────────────────────────────────────

function OfflineBanner({ t }) {
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' && !navigator.onLine)
  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])
  if (!offline) return null
  return (
    <div role="alert" aria-live="polite" style={{
      background: '#fff8e1', border: `1px solid ${CL.warning}`, borderRadius: 0,
      padding: '10px 20px', fontFamily: FL.mono, fontSize: 13, color: CL.warning, textAlign: 'center',
    }}>
      {t.statusPending === 'Fa\'atali CBS'
        ? '⚠ Leai le initaneti — o le faʻamaumauga mulimuli mai le WST'
        : '⚠ Offline — showing last saved data'}
    </div>
  )
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

const styles = {
  btnPrimary: {
    background: CL.primary, color: '#fff',
    fontFamily: FL.ui, fontSize: 14, fontWeight: 700,
    border: 'none', borderRadius: 8,
    padding: '12px 20px', minHeight: 44,
    cursor: 'pointer', letterSpacing: '0.2px',
    outline: 'none',
  },
  btnSecondary: {
    background: 'transparent', color: CL.primary,
    fontFamily: FL.ui, fontSize: 13,
    border: `1px solid ${CL.primary}`, borderRadius: 8,
    padding: '10px 16px', minHeight: 44,
    cursor: 'pointer',
    outline: 'none',
  },
  btnGhost: {
    background: 'transparent', color: CL.muted,
    fontFamily: FL.ui, fontSize: 13,
    border: `1px solid ${CL.border}`, borderRadius: 8,
    padding: '8px 14px', minHeight: 44,
    cursor: 'pointer',
    outline: 'none',
  },
  label: {
    fontFamily: FL.mono, fontSize: 11, color: CL.textSoft, letterSpacing: '0.5px',
  },
  input: {
    fontFamily: FL.ui, fontSize: 16, color: CL.text,
    background: CL.surface, border: `1px solid ${CL.border}`,
    borderRadius: 8, padding: '14px 16px',
    outline: 'none', width: '100%', boxSizing: 'border-box',
    minHeight: 48,
  },
}

// ─── CITIZEN APP ─────────────────────────────────────────────────────────────

function CitizenApp() {
  const [lang, setLang] = useState('SM')
  const [activeTab, setActiveTab] = useState('all')
  const [identityState, setIdentityState] = useState({ tier: null, refId: null, display: null })
  const [showIdentityPanel, setShowIdentityPanel] = useState(false)

  const t = translations[lang]

  const handleIdentify = useCallback((tier, display, refId) => {
    setIdentityState({ tier, display, refId })
    setShowIdentityPanel(false)
  }, [])

  const handleSignOut = useCallback(() => {
    setIdentityState({ tier: null, refId: null, display: null })
    setShowIdentityPanel(false)
  }, [])

  // Tab filter map for category shortcuts
  const tabCategoryFilter = { travel: [2], business: [3], community: [6] }

  return (
    <div style={{ minHeight: '100vh', background: CL.background, display: 'flex', flexDirection: 'column', fontFamily: FL.ui }}>
      <CitizenHeader
        lang={lang}
        setLang={setLang}
        t={t}
        identityState={identityState}
        onIdentityClick={() => setShowIdentityPanel(s => !s)}
      />

      <OfflineBanner t={t} />

      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

      <main
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        style={{ flex: 1, padding: '20px 16px 40px', maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}
      >
        {activeTab === 'all' && (
          <ServiceGrid
            t={t}
            lang={lang}
            identityState={identityState}
            onOpenIdentity={() => setShowIdentityPanel(true)}
          />
        )}

        {(activeTab === 'travel' || activeTab === 'business' || activeTab === 'community') && (
          <ServiceGrid
            t={t}
            lang={lang}
            identityState={identityState}
            onOpenIdentity={() => setShowIdentityPanel(true)}
            filterIds={tabCategoryFilter[activeTab]}
          />
        )}

        {activeTab === 'records' && (
          <RecordsTab
            t={t}
            lang={lang}
            identityState={identityState}
            onOpenIdentity={() => setShowIdentityPanel(true)}
          />
        )}

        {activeTab === 'verify' && <VerifyTab t={t} />}

        {activeTab === 'help' && <HelpTab t={t} />}
      </main>

      {showIdentityPanel && (
        <IdentityPanel
          t={t}
          lang={lang}
          onIdentify={handleIdentify}
          onClose={() => setShowIdentityPanel(false)}
          onGoVerify={() => setActiveTab('verify')}
        />
      )}

      {/* Sign out option if identified */}
      {identityState.tier && showIdentityPanel && null /* sign out in panel via close */}

      <footer style={{
        padding: '16px 20px', textAlign: 'center',
        fontFamily: FL.mono, fontSize: 10, color: CL.muted,
        borderTop: `1px solid ${CL.border}`,
        lineHeight: 1.8,
      }}>
        <div>{t.footerNote}</div>
        <div>{t.footerData} · synergyblockchaintf@gmail.com</div>
      </footer>
    </div>
  )
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ResearchGate storageKey="sdpi_citizens_acknowledged">
      <CitizenApp />
    </ResearchGate>
  )
}
