// ═══════════════════════════════════════════════════════════════
// SAMOA DPI ADMIN PORTAL — DESIGN SYSTEM
// Constitutional edition · Pacific futurism · CBS presentation grade
// Governed by: sovereign-constitutional-standards
//
// AESTHETIC: Pacific futurism — NOT generic dark cyberpunk.
// Samoa flag colours anchor every surface. Tapa cloth geometry
// grounds the digital in cultural heritage. IBM Plex Mono signals
// government authority. Gold signals the Tālā — sovereign currency.
// ═══════════════════════════════════════════════════════════════

export const COLORS = {
  // Samoa National Flag — constitutional, do not alter
  flagRed:   '#CE1126',
  flagBlue:  '#003087',
  gold:      '#C9A227',
  goldLight: '#F4D87C',

  // Base surfaces — deep Pacific navy, not cold grey
  bg:           '#070910',
  surface:      '#0c1222',
  surface2:     '#111830',
  surface3:     '#18213c',
  surfaceGlass: 'rgba(12, 18, 34, 0.92)',

  // Borders
  border:      '#1b2540',
  border2:     '#253258',
  borderGold:  'rgba(201, 162, 39, 0.25)',

  // Text — WCAG AAA verified 2026-05-15
  // textMuted lightened from #6b7a99 (4.61:1) to #8c9ab8 (7.04:1) against bg
  text:      '#e8edf8',
  textMuted: '#8c9ab8',
  textDim:   '#3a4a6a',

  // Semantic — WCAG AAA: always pair with icon + text, never colour alone
  operational:       '#00c896',
  operationalBg:     '#021a12',
  operationalBorder: '#054030',

  warning:       '#f0b429',
  warningBg:     '#130f00',
  warningBorder: '#352a00',

  critical:       '#ff3b4e',
  criticalBg:     '#180a0c',
  criticalBorder: '#3a1018',

  high:       '#ff8500',
  highBg:     '#130c00',
  highBorder: '#382400',

  blocked:       '#8b5cf6',
  blockedBg:     '#0d0618',
  blockedBorder: '#251245',

  info:       '#38bdf8',
  infoBg:     '#010d14',
  infoBorder: '#082030',

  // Currency identity — per Currency Display Spec v1.0
  currencyWST:  '#C9A227',  // Sovereign gold
  currencyUSDC: '#2775CA',  // Circle blue
  currencyFX:   '#8b5cf6',  // International purple

  // Settlement finality states
  settlementInitiated:  '#38bdf8',
  settlementConfirming: '#f0b429',
  settlementFinal:      '#00c896',
  settlementFailed:     '#ff3b4e',
  settlementCBSHeld:    '#8b5cf6',
}

export const TYPOGRAPHY = {
  mono: "'IBM Plex Mono', 'Courier New', monospace",
  sans: "'IBM Plex Sans', 'Segoe UI', sans-serif",
  amountSize:   '13px',
  amountWeight: '500',
  labelSize:    '10px',
  labelTrack:   '1.5px',
  bodySize:     '14px',
  bodyLine:     '1.65',
}

// Tapa cloth — cultural heritage as digital texture
// Geometric crosshatch echoing traditional Samoan bark cloth.
// Applied to structural surfaces only — never on reading areas.
export const TAPA_PATTERN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'>
  <rect width='48' height='48' fill='none'/>
  <path d='M0 12 L12 0 M0 24 L24 0 M0 36 L36 0 M0 48 L48 0
           M12 48 L48 12 M24 48 L48 24 M36 48 L48 36'
        stroke='rgba(201,162,39,0.06)' stroke-width='0.5'/>
  <rect x='18' y='18' width='12' height='12'
        fill='none' stroke='rgba(0,48,135,0.07)' stroke-width='0.5'/>
  <circle cx='24' cy='24' r='2'
          fill='none' stroke='rgba(201,162,39,0.04)' stroke-width='0.5'/>
</svg>`

export const TAPA_BG = `url("data:image/svg+xml,${encodeURIComponent(TAPA_PATTERN_SVG)}")`

export const GLOBAL_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { color-scheme: dark; }

  body {
    background: #070910;
    color: #e8edf8;
    font-family: 'IBM Plex Sans', 'Segoe UI', sans-serif;
    font-size: 14px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* WCAG AAA focus — visible on all backgrounds */
  :focus-visible {
    outline: 2px solid #C9A227;
    outline-offset: 3px;
    border-radius: 2px;
  }

  /* Skip-to-content — WCAG AAA keyboard */
  .skip-link {
    position: absolute; top: -100%; left: 0;
    background: #C9A227; color: #000;
    padding: 8px 16px; font-family: 'IBM Plex Mono', monospace;
    font-size: 12px; font-weight: 600; z-index: 9999;
    text-decoration: none; border-radius: 0 0 4px 0;
  }
  .skip-link:focus { top: 0; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #0c1222; }
  ::-webkit-scrollbar-thumb { background: #253258; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #3a4a6a; }

  ::selection { background: rgba(0,48,135,0.45); color: #e8edf8; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  /* Honour prefers-reduced-motion — constitutional accessibility */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Print stylesheet — ADMIN-6 */
  @media print {
    [data-print-hide] { display: none !important; }
    body { background: white; color: black; font-size: 11pt; }
    [data-panel] { page-break-after: always; }
    [data-panel-heading] { color: #003087; border-color: #003087; }
    table { width: 100%; border-collapse: collapse; }
    td, th { border: 1px solid #ccc; padding: 6px; }
  }
`

// WCAG AAA: every status carries icon + colour + text
export const NODE_STATUS = {
  OPERATIONAL: { color: '#00c896', icon: '✓', label: 'Operational', labelSM: 'Ola' },
  DEGRADED:    { color: '#f0b429', icon: '⚠', label: 'Degraded',    labelSM: "Fa'aletonu" },
  OFFLINE:     { color: '#ff3b4e', icon: '✗', label: 'Offline',     labelSM: 'Leai' },
  OBSERVER:    { color: '#38bdf8', icon: '◎', label: 'Observer',    labelSM: "Mata'ita'i" },
  SYNCING:     { color: '#8b5cf6', icon: '↻', label: 'Syncing',     labelSM: "Fa'aleleia" },
}

export const SEVERITY_COLORS = {
  CRITICAL: { text: '#ff3b4e', bg: '#180a0c', border: '#3a1018' },
  HIGH:     { text: '#ff8500', bg: '#130c00', border: '#382400' },
  MEDIUM:   { text: '#f0b429', bg: '#130f00', border: '#352a00' },
  LOW:      { text: '#38bdf8', bg: '#010d14', border: '#082030' },
  BLOCKED:  { text: '#8b5cf6', bg: '#0d0618', border: '#251245' },
}

export const ROLES = {
  CBS_GOVERNOR: {
    id: 'CBS_GOVERNOR', label: 'CBS Governor',
    labelSM: 'Kovana o le Faletupe',
    color: '#C9A227', access: 'full',
    ariaDescription: 'Full access — all panels and controls visible',
  },
  CBS_ANALYST: {
    id: 'CBS_ANALYST', label: 'CBS Analyst',
    labelSM: "Tagata Su'esu'e o le Faletupe",
    color: '#003087', access: 'readonly',
    ariaDescription: 'Read-only access — no write operations',
  },
  'CBS-DEPUTY-2026': {
    id: 'CBS-DEPUTY-2026', label: 'Deputy Governor',
    labelSM: 'Sui Kovana o le Faletupe',
    color: '#2563eb', access: 'readonly',
    ariaDescription: 'Read-only access — Deputy Governor role',
  },
  'CBS-CFO-2026': {
    id: 'CBS-CFO-2026', label: 'Chief Financial Officer',
    labelSM: "Pulega Tupe Sili o le Faletupe",
    color: '#7c3aed', access: 'readonly',
    ariaDescription: 'Read-only access — Chief Financial Officer role',
  },
  'CBS-AUDITOR-2026': {
    id: 'CBS-AUDITOR-2026', label: 'Auditor',
    labelSM: "Tagata Siaki o le Faletupe",
    color: '#dc2626', access: 'readonly',
    ariaDescription: 'Read-only access — Auditor role',
  },
  'CBS-IT-2026': {
    id: 'CBS-IT-2026', label: 'IT Platform Officer',
    labelSM: "Ofisa Fa'aupuga IT o le Faletupe",
    color: '#6b7280', access: 'readonly',
    ariaDescription: 'Read-only access — IT Platform Officer role',
  },
  MCIT_ADMIN: {
    id: 'MCIT_ADMIN', label: 'MCIT Administrator',
    labelSM: "Pule Fa'atonu MCIT",
    color: '#38bdf8', access: 'technical',
    ariaDescription: 'Technical access — node health and infrastructure panels',
  },
  MOF_ADMIN: {
    id: 'MOF_ADMIN', label: 'Ministry of Finance Administrator',
    labelSM: "Pule Fa'atonu Tupe",
    color: '#00c896', access: 'finance',
    ariaDescription: 'Finance access — currency and disbursement panels',
  },
}

// NIST 800-53 AC-12 — tested 2026-05-15, 30s/60s flow confirmed working
// (warning at WARNING_MS, auto-logout at TIMEOUT_MS, session state clears, role picker reappears)
export const SESSION = {
  WARNING_MS:  5 * 60 * 1000,   // 5 minutes
  TIMEOUT_MS: 10 * 60 * 1000,   // 10 minutes
}
