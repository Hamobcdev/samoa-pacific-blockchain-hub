import React from 'react'

// Feature flag registry — keys map to VITE_FLAG_* env vars
// All flags default false in Phase 1. Set in apps/admin/.env to enable.
export const FLAGS = {
  MULTISIG_ACTIVE:       'VITE_FLAG_MULTISIG_ACTIVE',
  CBDC_BRIDGE_ACTIVE:    'VITE_FLAG_CBDC_BRIDGE_ACTIVE',
  CROSS_MINISTRY_ACTIVE: 'VITE_FLAG_CROSS_MINISTRY_ACTIVE',
  LIVE_RPC_ACTIVE:       'VITE_FLAG_LIVE_RPC_ACTIVE',
}

// Vite replaces import.meta.env at build time — dynamic key access works
// because the full object is inlined as an object literal.
function isFlagEnabled(flagName) {
  const key = `VITE_FLAG_${flagName}`
  return import.meta.env[key] === 'true'
}

export function useFlag(flagName) {
  return isFlagEnabled(flagName)
}

// Renders children only when flag is enabled — hidden, not disabled.
// Never renders a placeholder or disabled UI; the feature simply doesn't exist.
export function FeatureGate({ flag, children }) {
  if (!isFlagEnabled(flag)) return null
  return children
}
