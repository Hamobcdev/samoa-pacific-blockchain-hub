import { useState, useCallback } from 'react'
import { ROLES } from '../theme.js'

const STORAGE_KEY = 'cbs_admin_role'

const DEFAULT_ROLE = 'CBS_GOVERNOR'

export function useRole() {
  const [roleId, setRoleId] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored && ROLES[stored] ? stored : DEFAULT_ROLE
    } catch {
      return DEFAULT_ROLE
    }
  })

  const role = ROLES[roleId]

  const setRole = useCallback((id) => {
    if (!ROLES[id]) return
    try { sessionStorage.setItem(STORAGE_KEY, id) } catch { /* quota */ }
    setRoleId(id)
  }, [])

  const can = useCallback((capability) => {
    if (role.access === 'full')      return true
    if (role.access === 'readonly')  return capability === 'read'
    if (role.access === 'technical') return ['read', 'nodes', 'infra'].includes(capability)
    if (role.access === 'finance')   return ['read', 'currency', 'disbursement'].includes(capability)
    return false
  }, [role])

  return { roleId, role, setRole, can }
}
