import { Hono } from 'hono'
import { methodAllowlist } from '../middleware/methodAllowlist.js'

const RPC_ENDPOINT_URL = process.env.RPC_ENDPOINT_URL

// Phase 1 stub response — returned when no RPC endpoint is configured
function phase1Response(body) {
  const respond = (req) => ({
    jsonrpc: '2.0',
    id: req.id ?? null,
    result: req.method === 'eth_blockNumber' ? '0x401568'
           : req.method === 'net_version'    ? '80002'
           : '0x',
  })

  return Array.isArray(body)
    ? body.map(respond)
    : respond(body)
}

export const rpcRouter = new Hono()

rpcRouter.post('/', methodAllowlist(), async (c) => {
  const body = c.get('rpcBody')

  if (!RPC_ENDPOINT_URL) {
    return c.json(phase1Response(body))
  }

  const upstreamRes = await fetch(RPC_ENDPOINT_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  }).catch(err => {
    throw new Error(`Upstream RPC unreachable: ${err.message}`)
  })

  const data = await upstreamRes.json()
  return c.json(data, upstreamRes.status)
})
