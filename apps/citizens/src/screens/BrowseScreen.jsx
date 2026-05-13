import React, { useState } from 'react'
import { FL, CL, SERVICE_CATEGORIES, FEATURED_SERVICES } from '../theme.js'
import ServiceCard from '../components/ServiceCard.jsx'

export default function BrowseScreen({ t, lang, onBack, onSelectService }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery]                   = useState('')

  const filtered = FEATURED_SERVICES.filter(s => {
    const matchesCat  = activeCategory === 'all' || s.category === activeCategory
    const matchesName = s.nameKey.toLowerCase().includes(query.toLowerCase())
    return matchesCat && matchesName
  })

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      minHeight:     '100%',
    }}>
      {/* Sticky search + filter header */}
      <div style={{
        position:   'sticky',
        top:        '56px',
        zIndex:     30,
        background: CL.surface,
        borderBottom: `1px solid ${CL.border}`,
        padding:    '12px 16px',
        display:    'flex',
        flexDirection: 'column',
        gap:        '10px',
      }}>
        {/* Back + search row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent', border: 'none',
              fontFamily: FL.ui, fontSize: '14px', fontWeight: 600,
              color: CL.primary, cursor: 'pointer', padding: '4px 0', flexShrink: 0,
            }}
          >
            ←
          </button>
          <input
            type="search"
            placeholder="Search services..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex:         1,
              height:       '40px',
              background:   CL.background,
              border:       `1px solid ${CL.border}`,
              borderRadius: '20px',
              padding:      '0 16px',
              fontFamily:   FL.ui,
              fontSize:     '13px',
              color:        CL.text,
              outline:      'none',
              boxSizing:    'border-box',
            }}
          />
        </div>

        {/* Category filter pills */}
        <div style={{
          display:    'flex',
          gap:        '8px',
          overflowX:  'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none',
        }}>
          {[{ id: 'all', label: 'All' }, ...SERVICE_CATEGORIES.map(c => ({ id: c.id, label: t(`category.${c.id}`) }))].map(cat => {
            const active = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  flexShrink:   0,
                  background:   active ? CL.primary : CL.surface,
                  color:        active ? '#FFFFFF'  : CL.primary,
                  border:       `1px solid ${CL.primary}`,
                  borderRadius: '20px',
                  padding:      '5px 14px',
                  fontFamily:   FL.ui,
                  fontSize:     '12px',
                  fontWeight:   600,
                  cursor:       'pointer',
                  whiteSpace:   'nowrap',
                  transition:   'background 0.15s, color 0.15s',
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results grid */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <style>{`
          .browse-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }
          @media (min-width: 500px) {
            .browse-grid { grid-template-columns: repeat(2, 1fr); }
          }
        `}</style>
        <div className="browse-grid">
          {filtered.length > 0
            ? filtered.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  t={t}
                  lang={lang}
                  onSelect={onSelectService}
                />
              ))
            : (
              <div style={{
                gridColumn: '1 / -1',
                textAlign:  'center',
                padding:    '40px 0',
                fontFamily: FL.ui,
                fontSize:   '14px',
                color:      CL.muted,
              }}>
                No services found.
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
