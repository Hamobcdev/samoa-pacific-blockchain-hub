import { useState, useCallback } from 'react'
import type { TopRole, OfficerSubRole } from '../types'

const SESSION_KEY_ROLE     = 'omw_trade_role'
const SESSION_KEY_SUBROLE  = 'omw_trade_subrole'

function readSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeSession(key: string, value: unknown) {
  try { sessionStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

function clearSession(key: string) {
  try { sessionStorage.removeItem(key) } catch { /* ignore */ }
}

export function useRole() {
  const [role, setRoleState]           = useState<TopRole | null>(() => readSession<TopRole>(SESSION_KEY_ROLE))
  const [officerSubRole, setSubRoleState] = useState<OfficerSubRole | null>(() => readSession<OfficerSubRole>(SESSION_KEY_SUBROLE))

  const setRole = useCallback((r: TopRole) => {
    setRoleState(r)
    writeSession(SESSION_KEY_ROLE, r)
    if (r !== 'officer') {
      setSubRoleState(null)
      clearSession(SESSION_KEY_SUBROLE)
    }
  }, [])

  const setOfficerSubRole = useCallback((sr: OfficerSubRole) => {
    setSubRoleState(sr)
    writeSession(SESSION_KEY_SUBROLE, sr)
  }, [])

  const clearRole = useCallback(() => {
    setRoleState(null)
    setSubRoleState(null)
    clearSession(SESSION_KEY_ROLE)
    clearSession(SESSION_KEY_SUBROLE)
  }, [])

  return { role, officerSubRole, setRole, setOfficerSubRole, clearRole }
}
