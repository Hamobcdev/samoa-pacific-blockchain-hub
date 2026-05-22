// CSS design tokens — apps import directly:
//   import '@samoa-dpi/shared-ui/src/tokens.css'
export { C, F } from './tokens';
export type { ColorToken, FontToken } from './tokens';

// @ts-ignore — JSX components, resolved by Vite
export { ResearchGate } from './ResearchGate.jsx';
// @ts-ignore — JSX components, resolved by Vite
export { Tooltip } from './Tooltip.jsx';

// @ts-ignore — JSX components, resolved by Vite
export { StatusBadge } from './StatusBadge.jsx';
// @ts-ignore — JSX components, resolved by Vite
export { ErrorPage } from './ErrorPage.jsx';
// @ts-ignore — JSX components, resolved by Vite
export { LanguageProvider, useLang, useLanguage, LanguageToggle } from './LanguageToggle.jsx';

// @ts-ignore — feature flags, resolved by Vite (import.meta.env)
export { FLAGS, useFlag, FeatureGate } from './feature-flags.js';

// Research Context Panel — ISOC programme deliverables and issues log
export { ResearchContextPanel } from './components/ResearchGate/index.tsx';
export { ISOC_DELIVERABLES, EXTERNAL_ISSUES, RESEARCH_GATE_PROPS } from './components/ResearchGate/data.ts';
export type { ResearchGateProps, ResearchDeliverable, ExternalIssue } from './components/ResearchGate/types.ts';

// @ts-ignore — JSX/JS currency components, resolved by Vite
export {
  CURRENCY_CONFIGS,
  AmountDisplay,
  SettlementChip,
  CurrencyBadge,
  PrecisionToggle,
  AmountColumn,
  ErrorAmount,
  TimestampDisplay,
  CurrencyProvider,
  useCurrency,
} from './currency/index.js';
