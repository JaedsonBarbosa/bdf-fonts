type Font = {
  DWIDTH: number
  BBh: number
  BBox: number
  BBoy: number
  BITMAP: number[]
  BITS: number
}[]

type FontPair = {
  regular: Font
  bold: Font
}

export const Fonts: {
  Boxxy: {
    14: FontPair
  }
  Cherry: {
    10: FontPair
    11: FontPair
    13: FontPair
  }
  Ctrld: {
    [10]: FontPair
    [13]: FontPair
    [16]: FontPair
  }
  Dina: {
    [10]: FontPair
    [12]: FontPair
    [13]: FontPair
  }
  Dylex: {
    [10]: FontPair
    [13]: FontPair
    [20]: FontPair
  }
  Gohufont: {
    [11]: FontPair
    [14]: FontPair
  }
  Kakwa: {
    [12]: FontPair
  }
  Lokaltog: {
    [10]: FontPair
    [12]: FontPair
  }
  MPlus: {
    [10]: FontPair
    [12]: FontPair
  }
  Orp: {
    [12]: FontPair
  }
  Scientifica: {
    [11]: FontPair
  }
  Sq: {
    [15]: FontPair
  }
  Terminus: {
    [14]: FontPair
    [16]: FontPair
    [18]: FontPair
    [20]: FontPair
    [22]: FontPair
    [24]: FontPair
    [28]: FontPair
    [32]: FontPair
  }
  Tewi: {
    [11]: FontPair
  }
  Triskweline: {
    [13]: FontPair
  }
}

export function Write(
  font: Font,
  lineHeight: number,
  scale: 1 | 2,
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  align: 'left' | 'center' | 'right'
): number
