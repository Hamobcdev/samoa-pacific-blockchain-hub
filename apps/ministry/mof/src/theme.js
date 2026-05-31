// ═══════════════════════════════════════════════════════════════
// MOF FISCAL COMMAND CENTRE — DESIGN SYSTEM
// Ministry of Finance · Samoa Digital Public Infrastructure
// PFM Act 2001 · PEFA 2016 · GFSM 2014 · OCDS 1.1.5
// Sprint MOF-2: Light government theme
// ═══════════════════════════════════════════════════════════════

export const COLORS = {
  // ── Backgrounds ──
  bg:               '#ffffff',
  surface:          '#f8f9fb',
  surface2:         '#f0f4f8',
  surface3:         '#e8eef5',

  // ── Borders ──
  border:           '#d1dce8',
  border2:          '#b8c8d8',
  borderGov:        '#1a3a6b',
  borderFiscal:     '#1a6b3a',

  // ── Text ──
  text:             '#1a2a3a',
  textMuted:        '#4a6080',
  textDim:          '#8a9db5',

  // ── Government accent colours ──
  govBlue:          '#1a3a6b',
  govBlueBg:        '#eef2f8',
  govBlueBorder:    '#b8c8e8',
  fiscal:           '#1a6b3a',
  fiscalBg:         '#eef5f1',
  fiscalBorder:     '#b8d8c4',
  gold:             '#8b6914',
  goldBg:           '#fdf8ec',
  goldBorder:       '#e8d49a',

  // ── Semantic ──
  operational:      '#1a6b3a',
  operationalBg:    '#eef5f1',
  operationalBorder:'#b8d8c4',
  warning:          '#c05c00',
  warningBg:        '#fef3e8',
  warningBorder:    '#f0c898',
  critical:         '#a02020',
  criticalBg:       '#fdf0f0',
  criticalBorder:   '#e8b8b8',
  info:             '#1a5a9b',
  infoBg:           '#eef3fb',
  infoBorder:       '#b8d0f0',
  blocked:          '#6a3a9b',
  blockedBg:        '#f3eefb',
  blockedBorder:    '#c8b8e8',

  // ── PEFA scoring ──
  pefaA:            '#1a6b3a',
  pefaB:            '#1a5a9b',
  pefaC:            '#c05c00',
  pefaD:            '#a02020',
  pefaNA:           '#8a9db5',

  // ── Settlement states ──
  settlementFinal:  '#1a6b3a',
  settlementPending:'#c05c00',
  settlementFailed: '#a02020',

  // ── Classification band stays dark ──
  classificationBg:    '#0e1a2d',
  classificationText:  '#e8edf5',
  classificationBorder:'#1e3a5f',

  // ── Flag colours ──
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
    color: '#8b6914', access: 'full', level: 1, hsm: true,
    ariaDescription: 'Full access — all panels and fiscal controls',
    tabs: 'all',
  },
  MOF_CFO: {
    id: 'MOF_CFO', label: 'Chief Financial Officer',
    labelSM: 'Pule Tupe Sili',
    color: '#1a6b3a', access: 'finance', level: 2, hsm: true,
    ariaDescription: 'Finance access — budget, revenue, debt, compliance',
    tabs: ['command','budget','revenue','debt','trade','pefa','compliance','imf','donors','pacific'],
  },
  MOF_PROCUREMENT: {
    id: 'MOF_PROCUREMENT', label: 'Procurement Officer',
    labelSM: 'Ofisa Faʻatauina',
    color: '#1a5a9b', access: 'procure', level: 3, hsm: false,
    ariaDescription: 'Procurement access — OCDS, STEP, donor contracts',
    tabs: ['command','procurement','donors','oracle'],
  },
  MOF_AUDITOR: {
    id: 'MOF_AUDITOR', label: 'Internal Auditor',
    labelSM: 'Tagata Siaki Totogi',
    color: '#c05c00', access: 'audit', level: 4, hsm: false,
    ariaDescription: 'Audit access — PEFA, compliance, oracle, IMF',
    tabs: ['command','pefa','compliance','oracle','imf'],
  },
  MOF_ANALYST: {
    id: 'MOF_ANALYST', label: 'Senior Analyst',
    labelSM: "Tagata Su'esu'e Sinia",
    color: '#6a3a9b', access: 'readonly', level: 5, hsm: false,
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
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { color-scheme: light; }

  body {
    background: #ffffff;
    color: #1a2a3a;
    font-family: 'IBM Plex Sans', 'Segoe UI', sans-serif;
    font-size: 14px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  :focus-visible {
    outline: 2px solid #1a3a6b;
    outline-offset: 3px;
    border-radius: 2px;
  }

  .skip-link {
    position: absolute; top: -100%; left: 0;
    background: #1a3a6b; color: #fff;
    padding: 8px 16px; font-family: 'IBM Plex Mono', monospace;
    font-size: 12px; font-weight: 600; z-index: 9999;
    text-decoration: none; border-radius: 0 0 4px 0;
  }
  .skip-link:focus { top: 0; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #f0f4f8; }
  ::-webkit-scrollbar-thumb { background: #b8c8d8; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #8a9db5; }

  ::selection { background: rgba(26,58,107,0.15); color: #1a2a3a; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
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
