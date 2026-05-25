/**
 * DBS data hook — service abstraction layer.
 * Phase 1: returns static registry data.
 * Phase 2: reads from on-chain DBS registry contract via /api/rpc.
 */
import { useState, useMemo } from 'react';
import { TIER_2_BANKS, TIER_3_PARTICIPANTS, CORRESPONDENT_BANKS } from '../data/bank-registry';

export function useDBS(viewingAs = 'DBS_STAFF', bankCode = null) {
  const [selectedBank, setSelectedBank] = useState(bankCode);

  // DBS Staff sees all banks.
  // Bank Officer sees only their institution.
  const visibleBanks = useMemo(() => {
    if (viewingAs === 'DBS_STAFF') return TIER_2_BANKS;
    return TIER_2_BANKS.filter(b => b.code === selectedBank);
  }, [viewingAs, selectedBank]);

  return {
    tier2Banks:        visibleBanks,
    tier3Participants: TIER_3_PARTICIPANTS,
    correspondents:    CORRESPONDENT_BANKS,
    selectedBank,
    setSelectedBank,
    isDBS:             viewingAs === 'DBS_STAFF',
  };
}
