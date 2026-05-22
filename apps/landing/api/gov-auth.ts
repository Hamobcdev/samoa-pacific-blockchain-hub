import type { VercelRequest, VercelResponse } from '@vercel/node'

interface AuthResult {
  zone: 1 | 2 | 3
  role: string
  portalUrl: string
  sessionToken: string
}

const CREDENTIAL_MAP: Record<string, AuthResult> = {}

function buildMap() {
  const entries: Array<[string | undefined, AuthResult]> = [
    [process.env.GOV_HASH_DEV_ADMIN, {
      zone: 3,
      role: 'DEV-ADMIN — Developer Full Access',
      portalUrl: 'https://samoa-dpi-admin.vercel.app/governor',
      sessionToken: '',
    }],
    [process.env.GOV_HASH_CBS_GOV, {
      zone: 3,
      role: 'CBS Governor',
      portalUrl: 'https://samoa-dpi-admin.vercel.app/governor',
      sessionToken: '',
    }],
    [process.env.GOV_HASH_CBS_ANALYST, {
      zone: 2,
      role: 'CBS Analyst',
      portalUrl: 'https://samoa-dpi-admin.vercel.app/analyst',
      sessionToken: '',
    }],
    [process.env.GOV_HASH_MOF_ADMIN, {
      zone: 2,
      role: 'MOF Administrator',
      portalUrl: 'https://samoa-dpi-mof.vercel.app/admin',
      sessionToken: '',
    }],
    [process.env.GOV_HASH_OBSERVER, {
      zone: 1,
      role: 'ISOC Research Observer',
      portalUrl: '/research',
      sessionToken: '',
    }],
  ]
  for (const [hash, result] of entries) {
    if (hash && hash.length === 64) {
      CREDENTIAL_MAP[hash] = result
    }
  }
}

buildMap()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { credential } = req.body as { credential?: string }

  if (!credential || credential.length !== 64) {
    await new Promise(r => setTimeout(r, 500))
    return res.status(401).json({ error: 'ACCESS DENIED.' })
  }

  const result = CREDENTIAL_MAP[credential.toLowerCase()]

  if (!result) {
    await new Promise(r => setTimeout(r, 500))
    return res.status(401).json({ error: 'ACCESS DENIED.' })
  }

  const tokenPayload = btoa(
    JSON.stringify({
      role: result.role,
      zone: result.zone,
      issued: Date.now(),
      expires: Date.now() + (result.zone >= 3 ? 15 * 60 * 1000 : 30 * 60 * 1000),
    })
  )

  return res.status(200).json({
    zone: result.zone,
    role: result.role,
    portalUrl: result.portalUrl,
    sessionToken: tokenPayload,
  })
}
