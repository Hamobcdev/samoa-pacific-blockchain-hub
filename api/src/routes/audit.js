import { Hono } from 'hono'

const MAX_ENTRIES = 1000
const entries = []

export const auditRouter = new Hono()

auditRouter.post('/', async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!body?.action) return c.json({ error: 'Missing action' }, 400)

  const entry = {
    id:        crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action:    body.action,
    detail:    body.detail ?? '',
    roleId:    body.roleId ?? '',
    ip:        c.req.header('x-forwarded-for')?.split(',')[0].trim() ?? 'internal',
  }

  entries.unshift(entry)
  if (entries.length > MAX_ENTRIES) entries.length = MAX_ENTRIES

  return c.json({ ok: true, id: entry.id }, 201)
})

auditRouter.get('/', (c) => {
  const limit = Math.min(Number(c.req.query('limit') ?? 100), MAX_ENTRIES)
  return c.json({ entries: entries.slice(0, limit), total: entries.length })
})

auditRouter.delete('/', (c) => {
  entries.length = 0
  return c.json({ ok: true })
})
