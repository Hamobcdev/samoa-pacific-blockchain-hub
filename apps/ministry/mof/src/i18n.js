export const STRINGS = {
  'app.title':              { EN: 'MOF Fiscal Command Centre',           SM: 'Fale Tupe — DPI Samoa' },
  'app.subtitle':           { EN: 'Ministry of Finance · Samoa DPI',    SM: 'Matagaluega o Tupe · DPI Samoa' },
  // Navigation
  'nav.command':            { EN: 'Command',                             SM: "Fa'atonuga" },
  'nav.budget':             { EN: 'Budget Execution',                    SM: "Fa'atinoga Paketi" },
  'nav.revenue':            { EN: 'Revenue',                             SM: 'Tupe Maua' },
  'nav.debt':               { EN: 'Public Debt',                         SM: 'Aitalafu Faitele' },
  'nav.trade':              { EN: 'Trade Revenue',                       SM: "Tupe Fefaʻatauaʻi" },
  'nav.pefa':               { EN: 'PEFA Scorecard',                      SM: 'Fua PEFA' },
  'nav.compliance':         { EN: 'Fiscal Compliance',                   SM: 'Usoga Tupe' },
  'nav.imf':                { EN: 'IMF & PFTAC',                         SM: 'IMF & PFTAC' },
  'nav.donors':             { EN: 'Aid & Donors',                        SM: 'Fesoasoani' },
  'nav.procurement':        { EN: 'Procurement (OCDS)',                  SM: "Fa'atauina (OCDS)" },
  'nav.oracle':             { EN: 'Sovereign Oracle (#FA)',               SM: 'Oracle Pule' },
  'nav.pacific':            { EN: 'Pacific & External',                  SM: 'Pasefika' },
  // Category labels
  'cat.fiscal':             { EN: 'Fiscal Operations',                   SM: "Gaioiga Tupe" },
  'cat.compliance':         { EN: 'Compliance & Reporting',              SM: 'Usoga ma Lipoti' },
  'cat.transparency':       { EN: 'Transparency',                        SM: "Manino" },
  'cat.pacific':            { EN: 'Pacific & External',                  SM: 'Pasefika' },
  // Panel titles
  'panel.command':          { EN: 'MOF Fiscal Command Centre',           SM: "Nofoaga Tapula'a MOF" },
  'panel.budget':           { EN: 'Budget Execution',                    SM: "Fa'atinoga Paketi" },
  'panel.revenue':          { EN: 'Revenue Management',                  SM: "Pule Tupe Maua" },
  'panel.debt':             { EN: 'Public Debt Management',              SM: 'Pule Aitalafu' },
  'panel.trade':            { EN: 'Trade & Customs Revenue',             SM: "Tupe Fefaʻatauaʻi" },
  'panel.pefa':             { EN: 'PEFA Framework Scorecard',            SM: 'Fua PEFA' },
  'panel.compliance':       { EN: 'Fiscal Compliance',                   SM: 'Usoga Tupe' },
  'panel.imf':              { EN: 'IMF & PFTAC Integration',             SM: 'IMF & PFTAC' },
  'panel.donors':           { EN: 'Aid & Donor Management',              SM: "Pule Fesoasoani" },
  'panel.procurement':      { EN: 'Procurement — OCDS',                  SM: "Fa'atauina — OCDS" },
  'panel.oracle':           { EN: 'Sovereign Oracle (#FA)',               SM: 'Oracle Pule' },
  'panel.pacific':          { EN: 'Pacific & External Relations',        SM: 'Sootaga Fa Fafo' },
  // Classification band
  'band.zone3':             { EN: 'ZONE 3 · MOF FISCAL AUTHORITY · RESTRICTED', SM: 'ZONE 3 · MAUTINOA' },
  'band.mof':               { EN: 'MOF FISCAL AUTHORITY',                SM: 'PULEGA TUPE MOF' },
  // Role picker
  'picker.title':           { EN: 'MINISTRY OF FINANCE · DPI SAMOA',    SM: 'MATAGALUEGA O TUPE · DPI' },
  'picker.sub':             { EN: 'Digital Public Infrastructure — Fiscal Authority', SM: "DPI — Mana Tupe" },
  'picker.footer':          { EN: 'PFM Act 2001 · PEFA 2016 · GFSM 2014', SM: 'PFM 2001 · PEFA 2016' },
  // Status strings
  'status.live':            { EN: 'LIVE',                                SM: 'OLA' },
  'status.phase2':          { EN: 'PHASE 2',                             SM: 'VAEGA 2' },
  'status.pending':         { EN: 'PENDING',                             SM: 'FAATALI' },
  'status.compliant':       { EN: 'COMPLIANT',                           SM: 'USOGA' },
  'status.monitor':         { EN: 'MONITOR',                             SM: 'MATA\'ITA\'I' },
  'status.atrisk':          { EN: 'AT RISK',                             SM: "LAMATIIA" },
  // Session
  'session.warning':        { EN: 'Session expiring in 5 minutes',       SM: "Fa'amuta lau sauniga i le 5 minute" },
  'session.timeout':        { EN: 'Signed out — inactivity',              SM: "Ua ofo ona o le leai o se gaoioiga" },
  // Actions
  'action.signout':         { EN: 'Sign Out',                            SM: 'Ofo' },
  'action.continue':        { EN: 'Continue Session',                    SM: "Fa'atumau Sauniga" },
  'action.export':          { EN: 'Export / Print',                      SM: 'Tukuina / Lolomi' },
  // Phase labels
  'phase2.label':           { EN: 'Phase 2',                             SM: 'Vaega 2' },
  'phase2.pending':         { EN: 'Phase 2 — OCDS LIVE',                 SM: 'Vaega 2 — OCDS OLA' },
  // Stub
  'stub.waiting':           { EN: 'panel awaiting Phase',               SM: "O lenei vaega o lo'o faatalitali" },
  'stub.requires':          { EN: 'Requires MOF engagement before activation.', SM: "E mana'omia le MOF i luma o le fa'aola" },
}

export const t = (lang, key) => STRINGS[key]?.[lang] || STRINGS[key]?.EN || key
