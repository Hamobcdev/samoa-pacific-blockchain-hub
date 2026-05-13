import React from 'react'
import { FL, CL, SERVICE_CATEGORIES, FEATURED_SERVICES } from '../theme.js'
import ServiceCard from '../components/ServiceCard.jsx'
import CategoryTile from '../components/CategoryTile.jsx'
import TapaPattern from '../components/TapaPattern.jsx'

const STATS = [
  { labelKey: 'home.stats.served',      value: '142'  },
  { labelKey: 'home.stats.services',    value: '24'   },
  { labelKey: 'home.stats.ministries',  value: '7'    },
  { labelKey: 'home.stats.live',        value: 'Live' },
]

function StatPill({ value, label }) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      gap:            '2px',
      background:     '#FFFFFF',
      border:         '1px solid #DDD6C8',
      borderRadius:   '12px',
      padding:        '10px 14px',
      minWidth:       '72px',
      boxShadow:      '0 2px 8px rgba(0,48,135,0.08)',
    }}>
      <span style={{ fontFamily: FL.mono, fontSize: '16px', fontWeight: 700, color: CL.primary }}>
        {value}
      </span>
      <span style={{ fontFamily: FL.ui, fontSize: '9px', color: CL.muted, textAlign: 'center', lineHeight: 1.3 }}>
        {label}
      </span>
    </div>
  )
}

export default function HomeScreen({ t, lang, onNavigate, onSelectService }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        position:   'relative',
        minHeight:  '220px',
        background: 'linear-gradient(135deg, #003087 0%, #001F5C 50%, #CE1126 100%)',
        display:    'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding:    '40px 24px 60px',
        overflow:   'hidden',
        textAlign:  'center',
      }}>
        <TapaPattern />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: FL.display,
            fontSize:   'clamp(28px, 7vw, 42px)',
            fontWeight: 700,
            color:      '#FFFFFF',
            margin:     '0 0 10px',
            lineHeight: 1.1,
          }}>
            {t('home.welcome')}
          </h1>
          <p style={{
            fontFamily: FL.ui,
            fontSize:   '14px',
            color:      'rgba(255,255,255,0.9)',
            maxWidth:   '420px',
            margin:     '0 auto',
            lineHeight: 1.6,
          }}>
            {t('home.subtitle')}
          </p>
        </div>
      </div>

      {/* ── STATS STRIP (overlaps hero bottom) ───────────────────────────── */}
      <div style={{
        display:         'flex',
        gap:             '10px',
        justifyContent:  'center',
        flexWrap:        'wrap',
        padding:         '0 16px',
        marginTop:       '-24px',
        position:        'relative',
        zIndex:          2,
      }}>
        {STATS.map(s => (
          <StatPill key={s.labelKey} value={s.value} label={t(s.labelKey)} />
        ))}
      </div>

      {/* ── FEATURED SERVICES ────────────────────────────────────────────── */}
      <div style={{ background: CL.background, padding: '28px 16px 24px' }}>
        <div style={{
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          marginBottom:  '14px',
        }}>
          <span style={{
            fontFamily:    FL.ui,
            fontSize:      '11px',
            fontWeight:    700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color:         CL.muted,
          }}>
            {t('home.featured')}
          </span>
          <button
            onClick={() => onNavigate('browse')}
            style={{
              background:   'transparent',
              border:       'none',
              fontFamily:   FL.ui,
              fontSize:     '12px',
              color:        CL.primary,
              fontWeight:   600,
              cursor:       'pointer',
              padding:      0,
            }}
          >
            See all →
          </button>
        </div>

        {/* Horizontal scroll on mobile, 2-col grid on desktop */}
        <style>{`
          .featured-grid {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            padding-bottom: 4px;
            scrollbar-width: none;
          }
          .featured-grid::-webkit-scrollbar { display: none; }
          .featured-grid > * { min-width: 220px; flex-shrink: 0; }
          @media (min-width: 641px) {
            .featured-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              overflow: visible;
            }
            .featured-grid > * { min-width: unset; }
          }
        `}</style>
        <div className="featured-grid">
          {FEATURED_SERVICES.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              t={t}
              lang={lang}
              onSelect={onSelectService}
            />
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <div style={{ background: CL.surface, padding: '24px 16px' }}>
        <span style={{
          display:       'block',
          fontFamily:    FL.ui,
          fontSize:      '11px',
          fontWeight:    700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color:         CL.muted,
          marginBottom:  '14px',
        }}>
          {t('home.categories')}
        </span>
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap:                 '10px',
        }}>
          {SERVICE_CATEGORIES.map(cat => (
            <CategoryTile
              key={cat.id}
              category={cat}
              t={t}
              onSelect={() => onNavigate('browse')}
            />
          ))}
        </div>
      </div>

      {/* ── TRUST SIGNALS ────────────────────────────────────────────────── */}
      <div style={{
        background: CL.primary,
        padding:    '20px 16px',
        display:    'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap:        '12px',
      }}>
        <div style={{
          display:        'flex',
          gap:            '20px',
          flexWrap:       'wrap',
          justifyContent: 'center',
        }}>
          {['🔒 Blockchain Secured', '✓ CBS Regulated', '🇼🇸 Samoan Government'].map(item => (
            <span key={item} style={{
              fontFamily: FL.ui,
              fontSize:   '11px',
              color:      'rgba(255,255,255,0.9)',
              fontWeight: 500,
            }}>
              {item}
            </span>
          ))}
        </div>
        <a
          href="https://samoa-pacific-blockchain-hub.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily:     FL.mono,
            fontSize:       '11px',
            color:          '#C9A227',
            textDecoration: 'none',
          }}
        >
          {t('cta.legacy')}
        </a>
      </div>

    </div>
  )
}
