export interface AuthResult {
  zone: 1 | 2 | 3
  role: string
  portalUrl: string
  sessionToken: string
}

async function sha256hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(input.trim().toUpperCase())
  )
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function authenticateCredential(rawCredential: string): Promise<AuthResult | null> {
  const hash = await sha256hex(rawCredential)
  try {
    const response = await fetch('/api/gov-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: hash }),
    })
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export function storeSession(result: AuthResult): void {
  sessionStorage.setItem('gov_session', JSON.stringify({
    role: result.role,
    zone: result.zone,
    portalUrl: result.portalUrl,
    sessionToken: result.sessionToken,
    storedAt: Date.now(),
  }))
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
