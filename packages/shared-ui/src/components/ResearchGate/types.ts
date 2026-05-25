export interface ResearchDeliverable {
  id: string
  title: string
  outputType: string
  phase: string
  status: 'complete' | 'in-progress' | 'pending'
  evidence?: string
}

export interface ExternalIssue {
  date: string
  platform: string
  description: string
  resolution: string
  researchNote: string
}

export interface ResearchGateProps {
  programme: string
  institution: string
  pi: string
  advisor: string
  technicalPartner: string
  submissionDeadline: string
  fundingRequested: string
  deliverables: ResearchDeliverable[]
  issueLog: ExternalIssue[]
}
