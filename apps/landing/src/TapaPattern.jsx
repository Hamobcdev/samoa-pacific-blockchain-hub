import React from 'react'

// Samoan siapo geometric tile — 60×60px
// Elements:
//   outer frame · 4 corner 6×6 squares
//   stepped border: inner rect at 7px + tick dividers every 6px on all 4 sides
//   central diamond (30,9)(51,30)(30,51)(9,30)
//   inner concentric diamond at 40% size: (30,22)(38,30)(30,38)(22,30)
//   3 parallel diagonal hatch lines per corner (4px apart by k/c value)
//     TL/BR: x+y=const  ·  TR/BL: x-y / y-x = const

const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">',
  '<g fill="none" stroke="#C9A227" stroke-width="1.2" opacity="0.14">',

  // ── outer frame ─────────────────────────────────────────────────────────
  '<rect x="1" y="1" width="58" height="58"/>',

  // ── 4 corner 6×6 squares ────────────────────────────────────────────────
  '<rect x="1"  y="1"  width="6" height="6"/>',
  '<rect x="53" y="1"  width="6" height="6"/>',
  '<rect x="1"  y="53" width="6" height="6"/>',
  '<rect x="53" y="53" width="6" height="6"/>',

  // ── stepped border: inner band lines ────────────────────────────────────
  '<line x1="7"  y1="7"  x2="53" y2="7"/>',
  '<line x1="7"  y1="53" x2="53" y2="53"/>',
  '<line x1="7"  y1="7"  x2="7"  y2="53"/>',
  '<line x1="53" y1="7"  x2="53" y2="53"/>',

  // ── top band tick dividers (every 6px, x = 13..49) ──────────────────────
  '<line x1="13" y1="1" x2="13" y2="7"/>',
  '<line x1="19" y1="1" x2="19" y2="7"/>',
  '<line x1="25" y1="1" x2="25" y2="7"/>',
  '<line x1="31" y1="1" x2="31" y2="7"/>',
  '<line x1="37" y1="1" x2="37" y2="7"/>',
  '<line x1="43" y1="1" x2="43" y2="7"/>',
  '<line x1="49" y1="1" x2="49" y2="7"/>',

  // ── bottom band tick dividers ────────────────────────────────────────────
  '<line x1="13" y1="53" x2="13" y2="59"/>',
  '<line x1="19" y1="53" x2="19" y2="59"/>',
  '<line x1="25" y1="53" x2="25" y2="59"/>',
  '<line x1="31" y1="53" x2="31" y2="59"/>',
  '<line x1="37" y1="53" x2="37" y2="59"/>',
  '<line x1="43" y1="53" x2="43" y2="59"/>',
  '<line x1="49" y1="53" x2="49" y2="59"/>',

  // ── left band tick dividers ──────────────────────────────────────────────
  '<line x1="1" y1="13" x2="7" y2="13"/>',
  '<line x1="1" y1="19" x2="7" y2="19"/>',
  '<line x1="1" y1="25" x2="7" y2="25"/>',
  '<line x1="1" y1="31" x2="7" y2="31"/>',
  '<line x1="1" y1="37" x2="7" y2="37"/>',
  '<line x1="1" y1="43" x2="7" y2="43"/>',
  '<line x1="1" y1="49" x2="7" y2="49"/>',

  // ── right band tick dividers ─────────────────────────────────────────────
  '<line x1="53" y1="13" x2="59" y2="13"/>',
  '<line x1="53" y1="19" x2="59" y2="19"/>',
  '<line x1="53" y1="25" x2="59" y2="25"/>',
  '<line x1="53" y1="31" x2="59" y2="31"/>',
  '<line x1="53" y1="37" x2="59" y2="37"/>',
  '<line x1="53" y1="43" x2="59" y2="43"/>',
  '<line x1="53" y1="49" x2="59" y2="49"/>',

  // ── central diamond ──────────────────────────────────────────────────────
  // vertices (30,9)(51,30)(30,51)(9,30)
  // TL edge x+y=39 · TR edge x-y=21 · BR x+y=81 · BL y-x=21
  '<polygon points="30,9 51,30 30,51 9,30"/>',

  // ── inner diamond at 40% (half-width 21 × 0.4 ≈ 8) ──────────────────────
  '<polygon points="30,22 38,30 30,38 22,30"/>',

  // ── TL corner hatch  (x+y=const, lines in x+y < 39 exterior) ────────────
  // k=28: (0,28)→(28,0)
  '<line x1="0"  y1="28" x2="28" y2="0"/>',
  // k=32: (0,32)→(32,0)
  '<line x1="0"  y1="32" x2="32" y2="0"/>',
  // k=36: (0,36)→(36,0)
  '<line x1="0"  y1="36" x2="36" y2="0"/>',

  // ── TR corner hatch  (x-y=const, lines in x-y > 21 exterior) ────────────
  // c=32: (32,0)→(60,28)
  '<line x1="32" y1="0"  x2="60" y2="28"/>',
  // c=36: (36,0)→(60,24)
  '<line x1="36" y1="0"  x2="60" y2="24"/>',
  // c=40: (40,0)→(60,20)
  '<line x1="40" y1="0"  x2="60" y2="20"/>',

  // ── BR corner hatch  (x+y=const, lines in x+y > 81 exterior) ────────────
  // k=84: (60,24)→(24,60)
  '<line x1="60" y1="24" x2="24" y2="60"/>',
  // k=88: (60,28)→(28,60)
  '<line x1="60" y1="28" x2="28" y2="60"/>',
  // k=92: (60,32)→(32,60)
  '<line x1="60" y1="32" x2="32" y2="60"/>',

  // ── BL corner hatch  (y-x=const, lines in y-x > 21 exterior) ────────────
  // c=24: (0,24)→(36,60)
  '<line x1="0"  y1="24" x2="36" y2="60"/>',
  // c=28: (0,28)→(32,60)
  '<line x1="0"  y1="28" x2="32" y2="60"/>',
  // c=32: (0,32)→(28,60)
  '<line x1="0"  y1="32" x2="28" y2="60"/>',

  '</g></svg>',
].join('')

const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`

export default function TapaPattern() {
  return (
    <div style={{
      position:          'fixed',
      inset:             0,
      zIndex:            1,
      backgroundImage:   `url("${dataUri}")`,
      backgroundSize:    '60px 60px',
      backgroundRepeat:  'repeat',
      pointerEvents:     'none',
      opacity:           1,
    }} />
  )
}
