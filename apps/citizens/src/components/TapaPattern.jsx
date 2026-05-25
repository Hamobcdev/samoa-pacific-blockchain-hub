import React from 'react'

// Samoan siapo geometric tile — 60×60px
// White stroke variant for dark hero backgrounds; opacity 0.08

const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">',
  '<g fill="none" stroke="#FFFFFF" stroke-width="1.2" opacity="0.08">',
  '<rect x="1" y="1" width="58" height="58"/>',
  '<rect x="1" y="1" width="6" height="6"/>',
  '<rect x="53" y="1" width="6" height="6"/>',
  '<rect x="1" y="53" width="6" height="6"/>',
  '<rect x="53" y="53" width="6" height="6"/>',
  '<line x1="7" y1="7" x2="53" y2="7"/>',
  '<line x1="7" y1="53" x2="53" y2="53"/>',
  '<line x1="7" y1="7" x2="7" y2="53"/>',
  '<line x1="53" y1="7" x2="53" y2="53"/>',
  '<line x1="13" y1="1" x2="13" y2="7"/>',
  '<line x1="19" y1="1" x2="19" y2="7"/>',
  '<line x1="25" y1="1" x2="25" y2="7"/>',
  '<line x1="31" y1="1" x2="31" y2="7"/>',
  '<line x1="37" y1="1" x2="37" y2="7"/>',
  '<line x1="43" y1="1" x2="43" y2="7"/>',
  '<line x1="49" y1="1" x2="49" y2="7"/>',
  '<line x1="13" y1="53" x2="13" y2="59"/>',
  '<line x1="19" y1="53" x2="19" y2="59"/>',
  '<line x1="25" y1="53" x2="25" y2="59"/>',
  '<line x1="31" y1="53" x2="31" y2="59"/>',
  '<line x1="37" y1="53" x2="37" y2="59"/>',
  '<line x1="43" y1="53" x2="43" y2="59"/>',
  '<line x1="49" y1="53" x2="49" y2="59"/>',
  '<line x1="1" y1="13" x2="7" y2="13"/>',
  '<line x1="1" y1="19" x2="7" y2="19"/>',
  '<line x1="1" y1="25" x2="7" y2="25"/>',
  '<line x1="1" y1="31" x2="7" y2="31"/>',
  '<line x1="1" y1="37" x2="7" y2="37"/>',
  '<line x1="1" y1="43" x2="7" y2="43"/>',
  '<line x1="1" y1="49" x2="7" y2="49"/>',
  '<line x1="53" y1="13" x2="59" y2="13"/>',
  '<line x1="53" y1="19" x2="59" y2="19"/>',
  '<line x1="53" y1="25" x2="59" y2="25"/>',
  '<line x1="53" y1="31" x2="59" y2="31"/>',
  '<line x1="53" y1="37" x2="59" y2="37"/>',
  '<line x1="53" y1="43" x2="59" y2="43"/>',
  '<line x1="53" y1="49" x2="59" y2="49"/>',
  '<polygon points="30,9 51,30 30,51 9,30"/>',
  '<polygon points="30,22 38,30 30,38 22,30"/>',
  '<line x1="0" y1="28" x2="28" y2="0"/>',
  '<line x1="0" y1="32" x2="32" y2="0"/>',
  '<line x1="0" y1="36" x2="36" y2="0"/>',
  '<line x1="32" y1="0" x2="60" y2="28"/>',
  '<line x1="36" y1="0" x2="60" y2="24"/>',
  '<line x1="40" y1="0" x2="60" y2="20"/>',
  '<line x1="60" y1="24" x2="24" y2="60"/>',
  '<line x1="60" y1="28" x2="28" y2="60"/>',
  '<line x1="60" y1="32" x2="32" y2="60"/>',
  '<line x1="0" y1="24" x2="36" y2="60"/>',
  '<line x1="0" y1="28" x2="32" y2="60"/>',
  '<line x1="0" y1="32" x2="28" y2="60"/>',
  '</g></svg>',
].join('')

const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`

export default function TapaPattern({ style }) {
  return (
    <div style={{
      position:         'absolute',
      inset:            0,
      backgroundImage:  `url("${dataUri}")`,
      backgroundSize:   '60px 60px',
      backgroundRepeat: 'repeat',
      pointerEvents:    'none',
      ...style,
    }} />
  )
}
