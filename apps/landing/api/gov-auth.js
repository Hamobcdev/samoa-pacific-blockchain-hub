const CREDENTIALS = {
  'DEV-ADMIN-2026':   { role: 'CBS_GOVERNOR', zone: 3, redirect: 'https://samoa-dpi-admin.vercel.app' },
  'CBS-GOVERNOR-2026':{ role: 'CBS_GOVERNOR', zone: 3, redirect: 'https://samoa-dpi-admin.vercel.app' },
  'CBS-ANALYST-2026': { role: 'CBS_ANALYST',  zone: 2, redirect: 'https://samoa-dpi-admin.vercel.app/analyst' },
  'MOF-ADMIN-2026':   { role: 'MOF_ADMIN',    zone: 2, redirect: 'https://samoa-dpi-mof.vercel.app/admin' },
  'MCIT-ADMIN-2026':  { role: 'MCIT_ADMIN',   zone: 2, redirect: null },
}

const ALLOWED_ORIGIN = 'https://samoa-dpi-landing-v2.vercel.app'

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { credential } = req.body || {}

  if (!credential || typeof credential !== 'string') {
    return res.status(401).json({ error: 'Invalid credential' })
  }

  const result = CREDENTIALS[credential.trim().toUpperCase()]

  if (!result) {
    return res.status(401).json({ error: 'Invalid credential' })
  }

  return res.status(200).json(result)
}
