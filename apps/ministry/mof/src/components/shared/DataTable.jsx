import React, { useState } from 'react'
import { COLORS, TYPOGRAPHY } from '../../theme.js'

export function DataTable({ headers, rows, onRowClick, expandedRender }) {
  const [expanded, setExpanded] = useState(null)
  const [sortKey,  setSortKey]  = useState(null)
  const [sortDir,  setSortDir]  = useState('asc')

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = sortKey
    ? [...rows].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey]
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
        return sortDir === 'asc' ? cmp : -cmp
      })
    : rows

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th
                key={h.key}
                onClick={() => h.sortable !== false && handleSort(h.key)}
                style={{
                  padding:       '9px 12px',
                  background:    COLORS.surface2,
                  color:         COLORS.govBlue,
                  fontFamily:    TYPOGRAPHY.mono,
                  fontSize:      11,
                  fontWeight:    700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  textAlign:     h.align === 'right' ? 'right' : 'left',
                  borderBottom:  `2px solid ${COLORS.border}`,
                  whiteSpace:    'nowrap',
                  cursor:        h.sortable !== false ? 'pointer' : 'default',
                  userSelect:    'none',
                }}
              >
                {h.label}
                {sortKey === h.key && (
                  <span style={{ marginLeft: 4, opacity: 0.6 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <React.Fragment key={i}>
              <tr
                onClick={() => {
                  if (expandedRender) setExpanded(expanded === i ? null : i)
                  if (onRowClick) onRowClick(row)
                }}
                style={{
                  background: i % 2 === 0 ? '#ffffff' : COLORS.surface,
                  cursor:     (expandedRender || onRowClick) ? 'pointer' : 'default',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = COLORS.govBlueBg }}
                onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? '#ffffff' : COLORS.surface }}
              >
                {headers.map(h => (
                  <td key={h.key} style={{
                    padding:      '10px 12px',
                    borderBottom: `1px solid ${COLORS.border}`,
                    fontFamily:   h.mono ? TYPOGRAPHY.mono : TYPOGRAPHY.sans,
                    fontSize:     12,
                    color:        COLORS.text,
                    verticalAlign:'top',
                    textAlign:    h.align === 'right' ? 'right' : 'left',
                  }}>
                    {row[h.key]}
                  </td>
                ))}
              </tr>
              {expanded === i && expandedRender && (
                <tr>
                  <td colSpan={headers.length} style={{
                    background:   COLORS.govBlueBg,
                    borderBottom: `1px solid ${COLORS.govBlueBorder}`,
                    padding:      '12px 20px',
                  }}>
                    {expandedRender(row)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
