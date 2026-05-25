// In-memory rate limiter — 100 requests per minute per IP
const WINDOW_MS   = 60_000
const MAX_REQUESTS = 100

const buckets = new Map()

function getIp(req) {
  return req.header('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

export function rateLimiter() {
  return async (c, next) => {
    const ip  = getIp(c.req)
    const now = Date.now()
    let bucket = buckets.get(ip)

    if (!bucket || now - bucket.start > WINDOW_MS) {
      bucket = { start: now, count: 0 }
      buckets.set(ip, bucket)
    }

    bucket.count++

    if (bucket.count > MAX_REQUESTS) {
      return c.json(
        { error: 'Rate limit exceeded', retryAfterMs: WINDOW_MS - (now - bucket.start) },
        429,
      )
    }

    // Clean up old buckets periodically
    if (buckets.size > 10_000) {
      for (const [key, b] of buckets) {
        if (now - b.start > WINDOW_MS) buckets.delete(key)
      }
    }

    await next()
  }
}
