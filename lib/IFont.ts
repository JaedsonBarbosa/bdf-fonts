interface IGlyph {
  DWIDTH: { x: number; y: number }
  BBh: number
  BBox: number
  BBoy: number
  bits: number
  BITMAP: number[]
}

export type IFont = IGlyph[]
