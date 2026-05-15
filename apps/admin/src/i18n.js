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
  'action.clear':     { EN: 'Clear',                         SM: "Fa'amaʻi" },
  'action.export':    { EN: 'Export / Print',                SM: 'Tukuina / Lolomi' },
  'action.copy':      { EN: 'Copy address to clipboard',     SM: 'Kopi le tuatusi' },
  'action.copied':    { EN: 'Copied!',                       SM: 'Kopi!' },
  'phase2.label':     { EN: 'Phase 2',                       SM: 'Vaega 2' },
  'node.operational': { EN: 'Operational',                   SM: 'Ola' },
  'node.degraded':    { EN: 'Degraded',                      SM: "Fa'aletonu" },
  'node.offline':     { EN: 'Offline',                       SM: 'Leai' },
  'node.observer':    { EN: 'Observer',                      SM: "Mata'ita'i" },
  'node.syncing':     { EN: 'Syncing',                       SM: "Fa'aleleia" },
  'node.health.trend':{ EN: 'Node health trend (last 20 polls)', SM: 'Tala o node (20 siaki)' },
  'audit.no.entries': { EN: 'No audit entries yet',          SM: 'E leai ni faailoga' },
  'audit.last':       { EN: 'Last 500 entries · In-memory only · Not persisted across sessions', SM: 'Faailoga 500 mulimuli' },
  'compliance.footer':{ EN: 'All frameworks above must reach READY status before Phase 2 launch. Status is derived from CBS governance decisions.', SM: 'E manaomia mea uma i luga mo le amata o Vaega 2.' }, // SM VERIFY
  'gov.footer':       { EN: "Constitutional source — all items pending CBS confirmation. Do not add, remove, or reorder without explicit CBS instruction.", SM: "Ia fa'afou e le CBS. E le'i fa'atonutonuina se tasi." },
  'stub.waiting':     { EN: 'panel awaiting Phase',          SM: "O lenei vaega o lo'o faatalitali" }, // SM VERIFY
  'stub.requires':    { EN: 'Requires CBS governance decisions before activation. See Governance panel.', SM: "Fa'amatalaga: E mana'omia CBS Pulega i luma o le fa'aola" }, // SM VERIFY
}

export const t = (lang, key) => STRINGS[key]?.[lang] || STRINGS[key]?.EN || key
