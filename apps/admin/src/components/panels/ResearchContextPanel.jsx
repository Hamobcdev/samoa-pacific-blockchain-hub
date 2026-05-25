import React from 'react'
import { ResearchContextPanel as ResearchContextView, RESEARCH_GATE_PROPS } from '@samoa-dpi/shared-ui'

export function ResearchContextPanel({ lang = 'EN' }) {
  return <ResearchContextView {...RESEARCH_GATE_PROPS} />
}
