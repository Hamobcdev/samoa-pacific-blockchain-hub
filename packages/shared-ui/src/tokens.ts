// Copied from frontend/src/App.jsx — DO NOT modify the monolith.
// This is the canonical source for new apps; App.jsx retains its own copy.

export const C = {
  // Samoa Government Primary Palette
  authority:   "#003087",
  flag:        "#CE1126",
  gold:        "#C9A227",
  sovereign:   "#0A1628",
  deep:        "#0F1E3A",
  surface:     "#162040",
  border:      "#1E2E50",
  border2:     "#2A3F6B",
  // Text
  white:       "#F0F4FF",
  silver:      "#A8B8D8",
  muted:       "#5A6A8A",
  // Status
  seafoam:     "#00A651",
  teal:        "#00C4B4",
  amber:       "#F59E0B",
  coral:       "#E8445A",
  gold2:       "#C9A227",
  // Legacy aliases — keeps all existing C.abyss etc working
  abyss:       "#0A1628",
  navy:        "#0F1E3A",
  ocean:       "#162040",
  wave:        "#1E2E50",
  danger:      "#E8445A",
} as const;

export const F = {
  display: "Cormorant Garamond",
  mono:    "IBM Plex Mono",
  ui:      "DM Sans",
  sans:    "DM Sans",
} as const;

export type ColorToken = keyof typeof C;
export type FontToken  = keyof typeof F;
