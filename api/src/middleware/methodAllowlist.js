// RPC method allowlist — only safe read-only eth_* methods pass through
const ALLOWED_METHODS = new Set([
  'eth_call',
  'eth_blockNumber',
  'eth_getTransactionReceipt',
  'eth_getLogs',
  'eth_getBalance',
  'net_version',
])

export function methodAllowlist() {
  return async (c, next) => {
    const body = await c.req.json().catch(() => null)

    if (!body) {
      return c.json({ error: 'Invalid JSON body' }, 400)
    }

    // Store parsed body for route handlers
    c.set('rpcBody', body)

    const method = Array.isArray(body) ? body.map(b => b.method) : body.method

    const methods = Array.isArray(method) ? method : [method]
    const blocked = methods.find(m => !ALLOWED_METHODS.has(m))

    if (blocked) {
      return c.json({ error: `Method not allowed: ${blocked}` }, 403)
    }

    await next()
  }
}
