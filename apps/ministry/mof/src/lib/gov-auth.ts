export interface AuthResult {
  zone: 1 | 2 | 3
  role: string
  portalUrl: string
  sessionToken: string
}

export function getSession(): AuthResult | null {
  const raw = sessionStorage.getItem('gov_session')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    const maxAge = parsed.zone >= 3 ? 15 * 60000 : parsed.zone === 2 ? 30 * 60000 : 60 * 60000
    if (Date.now() - parsed.storedAt > maxAge) {
      sessionStorage.removeItem('gov_session')
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearSession(): void {
  sessionStorage.removeItem('gov_session')
}

export function parseZoneFromToken(token: string): number {
  try { return JSON.parse(atob(token)).zone || 0 } catch { return 0 }
}

export function parseRoleFromToken(token: string): string {
  try { return JSON.parse(atob(token)).role || 'Unknown' } catch { return 'Unknown' }
}
