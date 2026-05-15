import { useState, useEffect } from 'react'

// Wraps any data fetch — if offline, returns last cached value
// with a { data, isStale, lastUpdated } shape
export function useOfflineData(fetchFn, cacheKey, deps = []) {
  const [state, setState] = useState({ data: null, isStale: false, lastUpdated: null, isOffline: false })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const isOnline = navigator.onLine
      if (!isOnline) {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const { data, ts } = JSON.parse(cached)
          if (!cancelled) setState({ data, isStale: true, lastUpdated: ts, isOffline: true })
        }
        return
      }

      try {
        const data = await fetchFn()
        if (!cancelled) {
          const ts = Date.now()
          localStorage.setItem(cacheKey, JSON.stringify({ data, ts }))
          setState({ data, isStale: false, lastUpdated: ts, isOffline: false })
        }
      } catch {
        const cached = localStorage.getItem(cacheKey)
        if (cached && !cancelled) {
          const { data, ts } = JSON.parse(cached)
          setState({ data, isStale: true, lastUpdated: ts, isOffline: true })
        }
      }
    }

    load()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
