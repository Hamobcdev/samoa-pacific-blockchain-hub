// Module-level audit log — persists across hook calls within a session.
// The useAuditLog hook manages React state; this service provides the backing store.
const MAX_ENTRIES = 1000
let _entries = []
let _seq = 0

function wstTimestamp() {
  return new Intl.DateTimeFormat('en-WS', {
    timeZone: 'Pacific/Apia',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(new Date())
}

export function logEntry(action, detail = '', roleId = '') {
  const entry = {
    id:        crypto.randomUUID(),
    seq:       ++_seq,
    timestamp: wstTimestamp(),
    action,
    detail,
    roleId,
  }
  _entries = [entry, ..._entries].slice(0, MAX_ENTRIES)
  return entry
}

export function getEntries() {
  return [..._entries]
}

export function clearEntries() {
  _entries = []
  _seq = 0
}
