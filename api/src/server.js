import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { rateLimiter } from './middleware/rateLimiter.js'
import { rpcRouter }   from './routes/rpc.js'
import { auditRouter } from './routes/audit.js'

const PORT = Number(process.env.PORT ?? 3001)

const CORS_ORIGINS = [
  'http://localhost:5180',  // admin
  'http://localhost:5181',  // citizens
  'http://localhost:5182',  // landing
]

const app = new Hono()

app.use('*', cors({
  origin: (origin) => CORS_ORIGINS.includes(origin) ? origin : null,
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  maxAge: 600,
}))

app.use('*', rateLimiter())

app.get('/health', (c) => c.json({ ok: true, phase: 1, ts: new Date().toISOString() }))

app.route('/api/rpc',   rpcRouter)
app.route('/api/audit', auditRouter)

app.notFound((c) => c.json({ error: 'Not found' }, 404))
app.onError((err, c) => {
  console.error('[API]', err.message)
  return c.json({ error: 'Internal server error' }, 500)
})

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`[samoa-dpi/api] listening on http://localhost:${PORT}`)
})
