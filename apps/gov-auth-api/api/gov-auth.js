export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  const allowed = origin.endsWith('.vercel.app') ||
    origin === 'https://landing-alpha-seven-82.vercel.app'
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')    return res.status(405).end()

  let credential
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    credential = body?.credential
  } catch { return res.status(400).end() }

  if (!credential || credential.length !== 64) {
    await new Promise(r => setTimeout(r, 500))
    return res.status(401).json({ error: 'ACCESS DENIED.' })
  }

  const map = {
    [process.env.GOV_HASH_DEV_ADMIN]:   { zone: 3, role: 'DEV-ADMIN — Developer Full Access', portalUrl: 'https://samoa-dpi-admin.vercel.app/governor' },
    [process.env.GOV_HASH_CBS_GOV]:     { zone: 3, role: 'CBS Governor',                      portalUrl: 'https://samoa-dpi-admin.vercel.app/governor' },
    [process.env.GOV_HASH_CBS_ANALYST]: { zone: 2, role: 'CBS Analyst',                       portalUrl: 'https://samoa-dpi-admin.vercel.app/analyst'  },
    [process.env.GOV_HASH_MOF_ADMIN]:   { zone: 2, role: 'MOF Administrator',                 portalUrl: 'https://samoa-dpi-mof.vercel.app/admin'      },
    [process.env.GOV_HASH_OBSERVER]:    { zone: 1, role: 'ISOC Research Observer',            portalUrl: '/research'                                   },
  }

  const result = map[credential.toLowerCase()]
  if (!result) {
    await new Promise(r => setTimeout(r, 500))
    return res.status(401).json({ error: 'ACCESS DENIED.' })
  }

  const sessionToken = Buffer.from(JSON.stringify({
    role:    result.role,
    zone:    result.zone,
    issued:  Date.now(),
    expires: Date.now() + (result.zone >= 3 ? 15 * 60000 : 30 * 60000),
  })).toString('base64')

  return res.status(200).json({ ...result, sessionToken })
}
