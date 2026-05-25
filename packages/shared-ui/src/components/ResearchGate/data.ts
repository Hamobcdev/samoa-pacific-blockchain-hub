import type { ResearchDeliverable, ExternalIssue, ResearchGateProps } from './types'

export const ISOC_DELIVERABLES: ResearchDeliverable[] = [
  {
    id: 'D1',
    title: 'WoG-DPI Architecture and Governance in the Pacific SIDS Context',
    outputType: 'Working Paper',
    phase: 'Phase 1',
    status: 'in-progress',
    evidence: 'Research framework established. NUS academic lead.',
  },
  {
    id: 'D2',
    title: 'CBDC Design for Pacific Small Open Economies — CBS Sovereign Oracle Model',
    outputType: 'Working Paper',
    phase: 'Phase 2',
    status: 'pending',
    evidence: 'Pending CBS sandbox engagement.',
  },
  {
    id: 'D3',
    title: 'Participatory Action Research in National DPI Deployment',
    outputType: 'Working Paper',
    phase: 'Phase 3',
    status: 'pending',
  },
  {
    id: 'D4',
    title: 'Trade Facilitation and UNCTAD 2029 Readiness in Pacific SIDS',
    outputType: 'Working Paper',
    phase: 'Phase 4',
    status: 'pending',
  },
  {
    id: 'D5',
    title: 'WoG-DPI Impact on Financial Inclusion: Samoa Empirical Study',
    outputType: 'Peer-Reviewed Journal Paper',
    phase: 'Phase 5',
    status: 'pending',
  },
  {
    id: 'D6',
    title: 'CBS Sandbox Technical and Regulatory Findings Report',
    outputType: 'Government Report',
    phase: 'Phase 5',
    status: 'pending',
    evidence: 'CBS engagement at exploratory stage. Meeting held 20 May 2026.',
  },
  {
    id: 'D7',
    title: 'Samoa D-DPI Policy Brief — ICT Policy 2025–2030',
    outputType: 'Policy Brief',
    phase: 'Phase 5',
    status: 'pending',
  },
  {
    id: 'D8',
    title: 'Pacific SIDS D-DPI Toolkit — Open Implementation Guide',
    outputType: 'Open Access Publication',
    phase: 'Phase 5',
    status: 'pending',
  },
  {
    id: 'D9',
    title: 'Complete Open-Source Codebase — MIT Licence',
    outputType: 'Software Release',
    phase: 'Phase 5',
    status: 'in-progress',
    evidence: 'github.com/hamobcdev/samoa-pacific-blockchain-hub · 88 tests · feat/currency-architecture',
  },
  {
    id: 'D10',
    title: 'Ministry Training Materials — Role-Based Modules',
    outputType: 'Training Materials',
    phase: 'Phase 4',
    status: 'pending',
  },
]

export const EXTERNAL_ISSUES: ExternalIssue[] = [
  {
    date: '17/05/2026',
    platform: 'Vercel',
    description: 'Monorepo deployment failed when building from app subdirectory — pnpm workspace packages not resolved.',
    resolution: 'Deployed from monorepo root using vercel --prod --local-config apps/trade/vercel.json',
    researchNote: 'Demonstrates infrastructure overhead for SIDS teams with limited DevOps capacity. Supports the case for simplified deployment tooling in Pacific SIDS contexts.',
  },
  {
    date: '17/05/2026',
    platform: 'Polygon Amoy RPC',
    description: 'Alchemy RPC rate limiting caused intermittent failures during forge test suite execution.',
    resolution: 'Separated unit tests (local Anvil) from integration tests (Amoy). Added retry logic.',
    researchNote: 'External RPC dependency is a sovereignty risk. Supports the case for sovereign chain migration.',
  },
  {
    date: '17/05/2026',
    platform: 'MetaMask',
    description: 'wallet_switchEthereumChain fails silently on some browser/OS combinations.',
    resolution: 'Added wallet_addEthereumChain as fallback with explicit chainId and RPC URL.',
    researchNote: 'Wallet UX friction is a real barrier in low-digital-literacy contexts. Relevant to RQ3 on citizen trust and adoption.',
  },
]

export const RESEARCH_GATE_PROPS: ResearchGateProps = {
  programme: 'ISOC Foundation Research Programme 2026',
  institution: 'National University of Samoa',
  pi: 'Dr. Edna Temese, PhD',
  advisor: 'Prof. Stan Karanasios — University of Queensland (advisory, self-funded)',
  technicalPartner: 'Synergy Blockchain Pacific — Anthony Williams, CEO',
  submissionDeadline: '22 May 2026 · 21:00 UTC',
  fundingRequested: 'USD $500,000 over 24 months',
  deliverables: ISOC_DELIVERABLES,
  issueLog: EXTERNAL_ISSUES,
}
