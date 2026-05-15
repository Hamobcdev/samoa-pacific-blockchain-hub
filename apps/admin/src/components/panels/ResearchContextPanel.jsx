import React from 'react'

const POINTS = [
  {
    heading: 'Pacific-First Design',
    body: "Every design decision prioritises the constraints of Small Island Developing States: intermittent connectivity, mobile-first access, low bandwidth, small institutional capacity, and the imperative of data sovereignty. Systems designed for Switzerland do not work in Samoa.",
  },
  {
    heading: 'Whole-of-Government Scope',
    body: "55 nodes representing all major Samoan government branches — the first WoG-DPI deployment in the Pacific. Comparable to Estonia's X-Road and India's India Stack but designed for SIDS constraints from inception.",
  },
  {
    heading: 'Pacific Expansion Path',
    body: 'Tonga, Vanuatu, Fiji, Solomon Islands, PNG, and Micronesia share identical WTO Trade Facilitation Agreement obligations and face identical SIDS digital infrastructure constraints. Samoa implements first. The architecture is documented for Pacific replication.',
  },
  {
    heading: 'Sovereignty Without Dependency',
    body: 'No foreign cloud provider, no foreign oracle network, no foreign bridge for cross-chain settlement. The CBS Sovereign Oracle Model and the planned sovereign compute migration eliminate all foreign infrastructure dependencies from the monetary layer.',
  },
  {
    heading: 'NUS/ISOC Research Programme',
    body: 'This platform is the research instrument for a 24-month participatory action research programme led by Dr. Edna Temese (PI) at the National University of Samoa, with Prof. Stan Karanasios (UQ) as International Research Advisor. All academic outputs are NUS-led. Synergy Blockchain Pacific is the Technical Partner.',
  },
]

export function ResearchContextPanel({ lang = 'EN' }) {
  const isSM = lang === 'SM'

  return (
    <div data-panel style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div data-panel-heading style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      13,
          fontWeight:    600,
          color:         'var(--color-text)',
          marginBottom:  4,
          letterSpacing: '0.5px',
        }}>
          {isSM ? 'Tulaga o le Suʻesuʻega' : 'Research Context — Pacific Digital Infrastructure'}
        </div>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize:   11,
          color:      'var(--color-muted)',
        }}>
          NUS/ISOC Foundation Research Programme 2026 · USD $500,000 application · Deadline 22 May 2026
        </p>
      </div>

      {POINTS.map((pt, i) => (
        <div key={i} style={{
          background:   'var(--color-surface)',
          border:       '1px solid var(--color-border)',
          borderLeft:   '3px solid var(--color-gold)',
          borderRadius: 'var(--radius-md)',
          padding:      '14px 16px',
        }}>
          <div style={{
            fontFamily:   'var(--font-mono)',
            fontSize:     11,
            fontWeight:   600,
            color:        'var(--color-gold)',
            marginBottom: 6,
            letterSpacing: '0.5px',
          }}>
            {pt.heading}
          </div>
          <p style={{
            fontSize:   13,
            color:      'var(--color-muted)',
            lineHeight: 1.65,
            margin:     0,
          }}>
            {pt.body}
          </p>
        </div>
      ))}

      <div style={{
        background:    'var(--color-surface)',
        border:        '1px solid var(--color-border)',
        borderRadius:  'var(--radius-md)',
        padding:       '14px 16px',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 10, letterSpacing: '0.5px' }}>
          {isSM ? 'Faamaumauga o le Poloaiga' : 'Grant & Research Details'}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <tbody>
            {[
              ['Grant', 'ISOC Foundation 2026 · USD $500,000'],
              ['PI', 'Dr. Edna Temese, PhD — National University of Samoa'],
              ['Research Advisor', 'Prof. Stan Karanasios — University of Queensland'],
              ['Technical Partner', 'Synergy Blockchain Pacific (SBP)'],
              ['CBS Status', 'Exploratory engagement — sandbox application being prepared'],
              ['MCIT Status', 'Briefed — formal endorsement being sought'],
              ['Deadline', '22 May 2026'],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ color: 'var(--color-dim)', padding: '6px 0', paddingRight: 16, whiteSpace: 'nowrap', verticalAlign: 'top' }}>{label}</td>
                <td style={{ color: 'var(--color-text)', padding: '6px 0' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      9,
        color:         'var(--color-dim)',
        paddingTop:    8,
        borderTop:     '1px solid var(--color-border)',
        letterSpacing: '0.5px',
      }}>
        Data: Simulated · Phase 1 Research Environment · Not production data
      </div>
    </div>
  )
}
