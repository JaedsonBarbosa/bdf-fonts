import { IFont } from './IFont'

export class Writer {
  constructor(
    public readonly ctx: CanvasRenderingContext2D,
    public bdf: IFont,
    public lineHeight: number,
    public scale: 1 | 2 = 1
  ) {}

  private drawChar(c: number, bx: number, by: number) {
    const g = this.bdf[c]
    const b = g['BITMAP']
    const ox = bx + g['BBox'] * this.scale - 1
    const oy = by - g['BBoy'] * this.scale - g['BBh'] * this.scale + 1
    for (let y = 0, len = b.length; y < len; y++) {
      const l = b[y]
      for (let i = g.bits, x = 0; i >= 0; i--, x++) {
        if (((l >> i) & 0x01) == 1) {
          this.ctx.fillRect(
            ox + x * this.scale,
            oy + y * this.scale,
            this.scale,
            this.scale
          )
        }
      }
    }
    return {
      x: bx + g['DWIDTH'].x * this.scale,
      y: by + g['DWIDTH'].y * this.scale,
    }
  }

  private measureText(text: string): IMetrics {
    const ret = {
      width: 0,
      height: 0,
    }
    for (var i = 0, len = text.length; i < len; i++) {
      const c = text[i].charCodeAt(0)
      const g = this.bdf[c]
      ret.width += g['DWIDTH'].x * this.scale
      ret.height += g['DWIDTH'].y * this.scale
    }
    return ret
  }

  private writeLine(text: string, x: number, y: number) {
    for (let i = 0, len = text.length; i < len; i++) {
      const c = text[i].charCodeAt(0)
      const r = this.drawChar(c, x, y)
      x = r.x
      y = r.y
    }
  }

  //https://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
  /** @returns bottom of the box */
  writeText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    align: TAlign
  ) {
    // Alocate space for the first line
    y += this.lineHeight

    // Remove all non-ASCII characters.
    text = text.replace(/[^\x00-\xFF]/g, '')

    const words = text.split(' ')
    let line = ''
    let lineWidth: number = 0
    function getX() {
      if (align == 'left') return x
      else {
        let freeSpace = maxWidth - lineWidth
        if (align == 'right') return x + freeSpace
        else return x + Math.floor(freeSpace / 2)
      }
    }
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const testLineWidth = this.measureText(testLine).width
      if (testLineWidth > maxWidth && n > 0) {
        this.writeLine(line, getX(), y)
        line = words[n] + ' '
        y += this.lineHeight
      } else line = testLine
      lineWidth = testLineWidth
    }
    lineWidth = this.measureText(line).width
    this.writeLine(line, getX(), y)
    return y
  }
}

interface IMetrics {
  width: number
  height: number
}

export type TAlign = 'left' | 'center' | 'right'
