export const STRINGS = {
  'app.title':        { EN: 'CBS Administration Portal',     SM: "Fale Pulega — DPI Samoa" },
  'nav.overview':     { EN: 'Overview',                      SM: 'Iloilo Aoao' },
  'nav.governance':   { EN: 'CBS Governance',                SM: 'Pulega o le CBS' },
  'nav.compliance':   { EN: 'Compliance',                    SM: 'Usoga Tulafono' },
  'nav.nodes':        { EN: 'Node Health',                   SM: 'Soifua o Node' },
  'nav.audit':        { EN: 'Audit Remediation',             SM: 'Toe Iloilo' },
  'nav.ministry':     { EN: 'Ministry Portals',              SM: 'Matagaluega' },
  'nav.donor':        { EN: 'Donor Oversight',               SM: 'Mataala Foakina' },
  'nav.dbs':          { EN: 'DBS Distribution',              SM: 'DBS Tufatufa' },
  'status.active':    { EN: 'Active',                        SM: "Ati'ae" },
  'status.health':    { EN: 'Health',                        SM: 'Soifua' },
  'status.nodes':     { EN: 'Nodes',                         SM: 'Node' },
  'session.warning':  { EN: 'Session expiring in 5 minutes', SM: "Fa'amuta lau sauniga i le 5 minute" },
  'session.timeout':  { EN: 'Signed out — inactivity',       SM: "Ua ofo ona o le leai o se gaoioiga" },
  'currency.native':  { EN: 'Native Precision',              SM: "Su'esu'e Masani" },
  'currency.tech':    { EN: 'Technical Precision',           SM: "Su'esu'e Fa'apitoa" },
  'action.signout':   { EN: 'Sign Out',                      SM: 'Ofo' },
  'action.continue':  { EN: 'Continue Session',              SM: "Fa'atumau Sauniga" },
  'phase2.label':     { EN: 'Phase 2',                       SM: 'Vaega 2' },
}

export const t = (lang, key) => STRINGS[key]?.[lang] || STRINGS[key]?.EN || key
