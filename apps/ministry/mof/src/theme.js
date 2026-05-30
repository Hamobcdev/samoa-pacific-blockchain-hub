// ═══════════════════════════════════════════════════════════════
// MOF FISCAL COMMAND CENTRE — DESIGN SYSTEM
// Ministry of Finance · Samoa Digital Public Infrastructure
// PFM Act 2001 · PEFA 2016 · GFSM 2014 · OCDS 1.1.5
// Colour identity: Deep Navy / Emerald — distinct from CBS teal/gold
// ═══════════════════════════════════════════════════════════════

export const COLORS = {
  bg:               '#080f1c',
  surface:          '#0e1a2d',
  surface2:         '#152238',
  surface3:         '#1a2d47',
  border:           '#1e3a5f',
  border2:          '#2a4f7a',
  text:             '#e8edf5',
  textMuted:        '#5a7fa8',
  textDim:          '#2a4a6a',
  gold:             '#c9a227',
  // MOF fiscal colours
  fiscal:           '#2d6a4f',
  fiscalBg:         '#0a1f17',
  fiscalBorder:     '#1a4a35',
  govBlue:          '#1a3a6b',
  govBlueBg:        '#080f1c',
  govBlueBorder:    '#1e3a5f',
  // Semantic
  operational:      '#27ae60',
  operationalBg:    '#0a1f12',
  operationalBorder:'#1a4a2a',
  warning:          '#e07b2a',
  warningBg:        '#1a0e00',
  warningBorder:    '#3d2800',
  critical:         '#c0392b',
  criticalBg:       '#1a0800',
  criticalBorder:   '#3d1200',
  info:             '#4a90d9',
  infoBg:           '#080f1c',
  infoBorder:       '#1e3a5f',
  blocked:          '#8e6ac8',
  blockedBg:        '#0f0818',
  blockedBorder:    '#2a1550',
  // PEFA scoring
  pefaA:            '#27ae60',
  pefaB:            '#2d9cdb',
  pefaC:            '#e07b2a',
  pefaD:            '#c0392b',
  pefaNA:           '#5a7fa8',
  // Settlement states
  settlementFinal:  '#27ae60',
  settlementPending:'#e07b2a',
  settlementFailed: '#c0392b',
  // Flag colours
  flagBlue:         '#003087',
  flagRed:          '#ce1126',
}

export const TYPOGRAPHY = {
  mono: "'IBM Plex Mono', 'Courier New', monospace",
  sans: "'IBM Plex Sans', 'Segoe UI', sans-serif",
}

export const ROLES = {
  MOF_CEO: {
    id: 'MOF_CEO', label: 'Chief Executive Officer',
    labelSM: 'Pule Sili',
    color: '#c9a227', access: 'full', level: 1, hsm: true,
    ariaDescription: 'Full access — all panels and fiscal controls',
    tabs: 'all',
  },
  MOF_CFO: {
    id: 'MOF_CFO', label: 'Chief Financial Officer',
    labelSM: 'Pule Tupe Sili',
    color: '#2d6a4f', access: 'finance', level: 2, hsm: true,
    ariaDescription: 'Finance access — budget, revenue, debt, compliance',
    tabs: ['command','budget','revenue','debt','trade','pefa','compliance','imf','donors','pacific'],
  },
  MOF_PROCUREMENT: {
    id: 'MOF_PROCUREMENT', label: 'Procurement Officer',
    labelSM: 'Ofisa Faʻatauina',
    color: '#4a90d9', access: 'procure', level: 3, hsm: false,
    ariaDescription: 'Procurement access — OCDS, STEP, donor contracts',
    tabs: ['command','procurement','donors','oracle'],
  },
  MOF_AUDITOR: {
    id: 'MOF_AUDITOR', label: 'Internal Auditor',
    labelSM: 'Tagata Siaki Totogi',
    color: '#e07b2a', access: 'audit', level: 4, hsm: false,
    ariaDescription: 'Audit access — PEFA, compliance, oracle, IMF',
    tabs: ['command','pefa','compliance','oracle','imf'],
  },
  MOF_ANALYST: {
    id: 'MOF_ANALYST', label: 'Senior Analyst',
    labelSM: "Tagata Su'esu'e Sinia",
    color: '#8e6ac8', access: 'readonly', level: 5, hsm: false,
    ariaDescription: 'Read-only access — all panels visible',
    tabs: 'all',
  },
}

export const CATEGORIES = [
  {
    id: 'fiscal', label: 'Fiscal Operations',
    tabs: ['command','budget','revenue','debt','trade'],
  },
  {
    id: 'compliance', label: 'Compliance & Reporting',
    tabs: ['pefa','compliance','imf'],
  },
  {
    id: 'transparency', label: 'Transparency',
    tabs: ['donors','procurement','oracle'],
  },
  {
    id: 'pacific', label: 'Pacific & External',
    tabs: ['pacific'],
  },
]

export const ALL_TABS = [
  { id: 'command',     label: 'Command',              labelSM: "Fa'atonuga",        category: 'fiscal'       },
  { id: 'budget',      label: 'Budget Execution',      labelSM: "Fa'atinoga Paketi", category: 'fiscal'       },
  { id: 'revenue',     label: 'Revenue',               labelSM: 'Tupe Maua',         category: 'fiscal'       },
  { id: 'debt',        label: 'Public Debt',            labelSM: 'Aitalafu Faitele',  category: 'fiscal'       },
  { id: 'trade',       label: 'Trade Revenue',          labelSM: "Tupe Fefaʻatauaʻi", category: 'fiscal'      },
  { id: 'pefa',        label: 'PEFA Scorecard',         labelSM: 'Fua PEFA',          category: 'compliance'   },
  { id: 'compliance',  label: 'Fiscal Compliance',      labelSM: 'Usoga Tupe',        category: 'compliance'   },
  { id: 'imf',         label: 'IMF & PFTAC',            labelSM: 'IMF & PFTAC',       category: 'compliance'   },
  { id: 'donors',      label: 'Aid & Donors',           labelSM: 'Fesoasoani',        category: 'transparency' },
  { id: 'procurement', label: 'Procurement (OCDS)',     labelSM: "Fa'atauina (OCDS)", category: 'transparency' },
  { id: 'oracle',      label: 'Sovereign Oracle (#FA)', labelSM: 'Oracle Pule',       category: 'transparency' },
  { id: 'pacific',     label: 'Pacific & External',     labelSM: 'Pasefika',          category: 'pacific'      },
]

export const GLOBAL_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { color-scheme: dark; }

  body {
    background: #080f1c;
    color: #e8edf5;
    font-family: 'IBM Plex Sans', 'Segoe UI', sans-serif;
    font-size: 14px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  :focus-visible {
    outline: 2px solid #c9a227;
    outline-offset: 3px;
    border-radius: 2px;
  }

  .skip-link {
    position: absolute; top: -100%; left: 0;
    background: #c9a227; color: #000;
    padding: 8px 16px; font-family: 'IBM Plex Mono', monospace;
    font-size: 12px; font-weight: 600; z-index: 9999;
    text-decoration: none; border-radius: 0 0 4px 0;
  }
  .skip-link:focus { top: 0; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #0e1a2d; }
  ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #2a4f7a; }

  ::selection { background: rgba(26,58,107,0.55); color: #e8edf5; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  @media print {
    [data-print-hide] { display: none !important; }
    body { background: white; color: black; font-size: 11pt; }
    [data-panel] { page-break-after: always; }
    table { width: 100%; border-collapse: collapse; }
    td, th { border: 1px solid #ccc; padding: 6px; }
  }
`
